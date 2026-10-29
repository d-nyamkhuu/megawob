/*
 * kit/runtime/split.js: split drags (knob dragSteps=split). Press, move and release must be separate agent actions:
 * the oracle sends a drag or path as down, one or two moves and up (start / next), new overlays wait while the
 * button is held (holding), and a drag that presses and releases inside one action ends the episode
 * (atomicDrag, from the window listeners in input.js).
 * State (env._rt.split, made by reset()): held (the queued moves and release) and down (the last left press, from
 * input.js via press()).
 */
(function () {
  'use strict';
  const kit = (window.__megawobKit = window.__megawobKit || {});

  const S = (env) => env._rt.split;
  // reset() hook.
  const reset = (env) => { env._rt.split = { held: [], down: null }; };

  // The points a drag / path action passes through (a drag goes via its midpoint).
  function points(act) {
    return act.type === 'drag'
      ? [act.from, [(act.from[0] + act.to[0]) / 2, (act.from[1] + act.to[1]) / 2], act.to] : act.points;
  }

  // dragSteps=split and the left button is held between actions.
  const holding = (env) => env.episode.drag === 'split' && kit.input.buttonHeld(env);
  // Actions of a split drag still to send.
  const pending = (env) => !!(S(env) && S(env).held.length);
  // Scroll events seen so far (any element or the page: a capturing window listener sees every element's
  // scroll, which does not bubble): relocate only trusts fresh points when something scrolled after the press.
  let scrolls = 0;
  window.addEventListener('scroll', () => { scrolls++; }, true);

  // Split a drag / path action (from plan step, or null for the oracle's own actions) at points fixed now:
  // a drag moves to its midpoint first; a path's inner points go in at most two move actions (move {at,
  // points}: the pointer passes through every point in one action), so a long stroke still takes four actions.
  // Queues the moves and the release (held) and returns the press.
  function start(env, act, step) {
    const pts = points(act);
    const inner = pts.slice(1, -1);
    const size = Math.max(1, Math.ceil(inner.length / 2));
    const moves = [];
    for (let i = 0; i < inner.length; i += size) {
      const chunk = inner.slice(i, i + size);
      const idx = [i + 1, i + chunk.length];  // point range in pts, for relocate
      moves.push(chunk.length > 1 ? { type: 'move', at: chunk[chunk.length - 1], points: chunk, _pts: idx }
        : { type: 'move', at: chunk[0], _pts: idx });
    }
    // Modifier keys: pressed before the press, released after the release.
    const mods = act.modifiers ? { modifiers: act.modifiers } : {};
    const last = pts.length - 1;
    S(env).held = [...moves, { type: 'up', at: pts[last], ...mods, _pts: [last, last] }]
      .map((a) => (step ? { ...a, _step: step, _base: pts, _scrolls: scrolls } : a));
    return { type: 'down', at: pts[0], ...mods };
  }

  // The next queued move / release, located again (relocate).
  const next = (env) => relocate(env, S(env).held.shift());

  // The page may have moved since the press (a pane auto-scrolled while the pointer dwelt at its edge), so a
  // held move / release is located again from its plan step when it is sent. The fresh points are taken only
  // when something scrolled since the press and the whole step moved as one (every point shifted like the press
  // point). Anything else keeps the points fixed at the press: the target gone, a live drag preview reshuffling
  // the items under the pointer, or the dragged item itself following the pointer (a box or resize handle that
  // moves with the drag shifts every point of a target located on it, which looks like a scroll but would count
  // the move twice and overshoot; at a canvas edge the oracle then never settled).
  function relocate(env, a) {
    const { _step: step, _pts: idx, _base: base, _scrolls: mark, ...out } = a;
    if (!step || !idx || !base || mark === scrolls) return out;
    try {
      const pts = points(kit.oracle.action(env, step));
      if (pts.length !== base.length || pts.some((p) => !p || !p.every(Number.isFinite))) return out;
      const dx = pts[0][0] - base[0][0], dy = pts[0][1] - base[0][1];
      if (pts.some((p, i) => Math.abs(p[0] - base[i][0] - dx) > 2 || Math.abs(p[1] - base[i][1] - dy) > 2)) return out;
      const fresh = pts.slice(idx[0], idx[1] + 1);
      out.at = fresh[fresh.length - 1];
      if (out.points) out.points = fresh;
    } catch (e) { /* locate failed mid-drag: keep the stored points */ }
    return out;
  }

  // A drag that presses and releases inside one agent action (an atomic drag_and_drop) ends the episode before
  // any page handler sees the release (pointerup, or drop / dragend for native HTML5 drag and drop, which fires
  // no pointerup).
  // A left press (input.js pointerdown listener): where and in which agent action; another button clears it.
  function press(env, e) {
    const s = S(env);
    if (s) s.down = e.button === 0 ? { x: e.clientX, y: e.clientY, step: kit.clock.steps(env) } : null;
  }

  function atomicDrag(env, e, pointer) {
    const s = S(env);
    const d = s && s.down;
    if (pointer && s) s.down = null;
    if (!d || !env.episode || env.episode.drag !== 'split' || env.done || d.step !== kit.clock.steps(env)) return;
    if (pointer && Math.hypot(e.clientX - d.x, e.clientY - d.y) <= 8) return;
    e.stopImmediatePropagation();
    if (!pointer) e.preventDefault();
    env.flag('atomic-drag', pointer ? { dx: Math.round(e.clientX - d.x), dy: Math.round(e.clientY - d.y) } : { native: e.type });
  }

  kit.split = { reset, points, holding, pending, start, next, relocate, press, atomicDrag };
})();
