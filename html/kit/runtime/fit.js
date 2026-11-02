/*
 * kit/runtime/fit.js: layout repair for widgets whose page layout leaves them no room. After the first render of an
 * episode the kit checks the widget's anchors the way the checker does: inside the viewport and inside the stage (not
 * whether something covers them: a site panel over part of a large anchor is normal on working sites). When one
 * fails, the stage's largest clear rectangle (inside the viewport, not under anything outside the stage) is found on
 * a sample grid, and the widget renders into a wrapper there, with ctx.size the wrapper's size. An end control that is
 * covered or off the page is raised over its cover, or pinned clear of the widget. A layout that passes is left as is.
 *
 *   kit.fit.root(env)      the element the widget renders into: the stage, or the episode's fit wrapper (made anew)
 *   kit.fit.repair(env)    after the first render: decide env._rt.fit (null when the layout is fine) and re-render
 *   kit.fit.submit(env)    make the end control reachable (repair() calls it)
 *
 * Measured with no overlay showing (overlays appear on the clock, after the first render), so a perturbation is
 * never mistaken for a cover. Pure function of the page geometry, so an episode replays identically.
 * Loaded by play.html before kit/env.js, like every kit/runtime/*.js module (see the list there).
 */
(function () {
  'use strict';
  const kit = (window.__megawobKit = window.__megawobKit || {});

  const GRID = 12; // px between sample points
  const MIN = 0.2; // a clear rectangle below this share of the visible stage is not worth it

  const visible = (env) => {
    const s = env.stage.getBoundingClientRect();
    const scroll = env.episode && env.episode.scrollable;
    const top = scroll ? s.top : Math.max(s.top, 0);
    const bottom = scroll ? s.bottom : Math.min(s.bottom, innerHeight);
    return { left: Math.max(s.left, 0), top, right: Math.min(s.right, innerWidth), bottom };
  };

  // The point is on the page and what is on top there belongs to the stage (the widget or the stage itself).
  const clear = (env, x, y) => {
    const hit = document.elementFromPoint(x, y);
    return !!hit && env.stage.contains(hit);
  };

  function broken(env) {
    const W = innerWidth, H = innerHeight;
    const scroll = env.episode && env.episode.scrollable;
    const st = env.stage.getBoundingClientRect();
    for (const [el] of env.anchors || []) {
      if (el === env.stage) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      if (r.left < -1 || r.right > W + 1 || (!scroll && (r.top < -1 || r.bottom > H + 1))) return 'viewport';
      if (r.left < st.left - 1 || r.right > st.right + 1 || (!scroll && (r.top < st.top - 1 || r.bottom > st.bottom + 1))) return 'stage';
    }
    return null;
  }

  // Largest all-clear rectangle of the sample grid over the visible stage (maximal rectangle in a 0/1 matrix).
  function largestClear(env) {
    const v = visible(env);
    const cols = Math.floor((v.right - v.left) / GRID), rows = Math.floor((v.bottom - v.top) / GRID);
    if (cols < 2 || rows < 2) return null;
    const heights = new Array(cols).fill(0);
    let best = null;
    for (let j = 0; j < rows; j++) {
      const y = v.top + (j + 0.5) * GRID;
      for (let i = 0; i < cols; i++) heights[i] = clear(env, v.left + (i + 0.5) * GRID, y) ? heights[i] + 1 : 0;
      const stack = [];
      for (let i = 0; i <= cols; i++) {
        const h = i < cols ? heights[i] : 0;
        let start = i;
        while (stack.length && stack[stack.length - 1][1] >= h) {
          const [s, sh] = stack.pop();
          const area = sh * (i - s);
          if (sh && (!best || area > best.area)) best = { area, i0: s, i1: i, j0: j - sh + 1, j1: j + 1 };
          start = s;
        }
        stack.push([start, h]);
      }
    }
    if (!best || best.area < MIN * cols * rows) return null;
    return { left: v.left + best.i0 * GRID, top: v.top + best.j0 * GRID, width: (best.i1 - best.i0) * GRID,
      height: (best.j1 - best.j0) * GRID };
  }

  function root(env) {
    const fit = env._rt.fit;
    if (!fit) return env.stage;
    if (getComputedStyle(env.stage).position === 'static') env.stage.style.position = 'relative';
    const s = env.stage.getBoundingClientRect();
    const box = env.util.el('div', 'env-fit', env.stage);
    box.style.cssText = `position:absolute;box-sizing:border-box;left:${fit.left - s.left - env.stage.clientLeft}px;`
      + `top:${fit.top - s.top - env.stage.clientTop}px;width:${fit.width}px;height:${fit.height}px`;
    return box;
  }

  // The end control can be reached: on the page, at least 4 px, and on top at its centre.
  const reachable = (el, scroll) => {
    const r = el.getBoundingClientRect();
    if (scroll && r.width >= 4 && r.height >= 4 && (r.top < 0 || r.bottom > innerHeight)) return true; // scrolled to
    if (r.width < 4 || r.height < 4 || r.left < 0 || r.top < 0 || r.right > innerWidth || r.bottom > innerHeight) return false;
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return !!hit && el.contains(hit);
  };

  const overlaps = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

  // The highest z-index on e and its ancestors: what an element must beat to show over e.
  const zOf = (e) => {
    let z = 0;
    for (; e && e !== document.body && e !== document.documentElement; e = e.parentElement) {
      const v = parseInt(getComputedStyle(e).zIndex, 10);
      if (v > z) z = v;
    }
    return z;
  };
  // A raised end control stays under the kit's own page tools (#env-shortcut, #env-debug, #env-cursor in env.css).
  const RAISE_MAX = 2147481000;

  // An end control the site's frame covers (a task note over a header button) or put off the page: raise it just
  // over the cover (not over later overlays or the kit's tools), else pin it where it is, else in a viewport corner
  // clear of the widget's anchors. When neither works its style is restored, so a failed repair moves nothing. The
  // anchors were frozen by _render(); a moved control can shift the page's flow, so they are re-keyed after a fix
  // (before the agent's first look, so it is no layout change).
  function submit(env) {
    const el = env.submitEl;
    const scroll = env.episode && env.episode.scrollable;
    if (!el || reachable(el, scroll)) return;
    const style = el.style, before = style.cssText;
    const fixed = (how) => {
      env.anchors = (env.anchors || []).map(([a]) => [a, kit.score.anchorKey(env, a)]);
      env.log('fit', how);
    };
    if (getComputedStyle(el).position === 'static') style.position = 'relative';
    const c = el.getBoundingClientRect();
    const cover = document.elementFromPoint(c.left + c.width / 2, c.top + c.height / 2);
    style.zIndex = String(Math.min(Math.max(zOf(cover), zOf(el.parentElement)) + 1, RAISE_MAX));
    if (reachable(el)) return fixed({ submit: 'raised' });
    const r = el.getBoundingClientRect();
    const w = Math.max(r.width, 72), h = Math.max(r.height, 32);
    const anchors = (env.anchors || []).map(([a]) => a.getBoundingClientRect());
    const spots = [[r.left, r.top], [innerWidth - w - 12, innerHeight - h - 12], [innerWidth - w - 12, 12],
      [12, innerHeight - h - 12], [12, 12]];
    for (const [x, y] of spots) {
      const box = { left: x, top: y, right: x + w, bottom: y + h };
      if (x < 0 || y < 0 || box.right > innerWidth || box.bottom > innerHeight || anchors.some((a) => overlaps(a, box))) continue;
      Object.assign(style, { position: 'fixed', left: `${x}px`, top: `${y}px`, right: 'auto', bottom: 'auto',
        width: `${w}px`, height: `${h}px`, margin: '0' });
      if (reachable(el)) return fixed({ submit: 'pinned', at: [Math.round(x), Math.round(y)] });
    }
    style.cssText = before;
  }

  function repair(env) {
    env._rt.fit = null;
    if (typeof document.elementFromPoint !== 'function') return; // a stub DOM (node tests, golden's node layer)
    const why = broken(env);
    if (!why) return submit(env);
    env.stage.replaceChildren(); // measure the bare stage: the widget's own elements are not covers
    const rect = largestClear(env);
    if (rect) env._rt.fit = { ...rect, why };
    env._render();
    if (rect) env.log('fit', { why, rect: [rect.left, rect.top, rect.width, rect.height].map(Math.round) });
    submit(env);
  }

  kit.fit = { root, repair, broken, submit };
})();
