/*
 * reference / composition / booking: a scrollable page that stacks the embedded tasks' base widgets
 * as sections (outlined cards, ruled sections or bare blocks), in one column or a two-column grid when the
 * stage is wide. Each embedded widget renders into its own box with a derived ctx (its sub-spec, a live
 * sub-model getter, an update wrapper that writes the sub-model back into the composite model, stage =
 * the box, size = the box size, the other ctx fields passed through) and answers locate() for its targets
 * ({ part: i, t }).
 *
 * Box sizes: each embedded widget is first rendered into a generous box (so widgets that reserve room for their
 * popups get it), then re-rendered into a box that fits what it drew plus a margin; if that second layout
 * overflows, the generous box is kept. Embedded widgets read their task's helpers through env.familyDef.helpers,
 * which the composition task resolves (see its logic header); this widget records which part the user last
 * touched (capture-phase listener) so ambiguous helper names resolve to that part.
 * Scenarios booking, filters, profile, appearance (train) and planner, event (held-out task pairings, only
 * sampled under the compose=heldout knob; see the task header) all use the same layout.
 */
(function () {
  'use strict';

  const USES = [['type-text', 'fields'], ['choose-option', 'widgets'], ['set-date', 'calendar'], ['set-slider', 'classic'], ['pick-color', 'picker']];

  const CSS = `
  .cp-wrap { display: flex; flex-direction: column; gap: var(--cp-gap); padding: 14px 0 28px; flex: none; }
  .cp-wrap.grid { display: grid; grid-template-columns: repeat(2, var(--cp-colw)); align-items: start; }
  .cp-head { display: flex; align-items: baseline; gap: 12px; margin: 0 0 2px; }
  .cp-head h1 { margin: 0; font-size: 22px; font-weight: 750; letter-spacing: -.01em; }
  .cp-head span { color: var(--muted); font-size: 13.5px; }
  .cp-card { min-width: 0; }
  .cp-card.cards { border: 1px solid var(--line); border-radius: 12px; background: color-mix(in srgb, var(--panel) 55%, var(--bg)); padding: 10px 12px 12px; }
  .cp-card.ruled { border-top: 2px solid var(--line); padding-top: 8px; }
  .cp-label { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: var(--muted);
    text-transform: uppercase; letter-spacing: .06em; margin: 0 2px 6px; }
  .cp-label .n { display: inline-flex; width: 20px; height: 20px; border-radius: 50%; align-items: center; justify-content: center;
    background: var(--accent); color: #fff; font-size: 11.5px; letter-spacing: 0; }
  .cp-box { position: relative; display: flex; align-items: center; justify-content: center; }
  /* Site workaround: long unbreakable values (emails) in the instruction panel overflow it and the page. */
  .ref-panel-text, .ref-note-text, .ref-instruction { overflow-wrap: anywhere; }
  `;

  function ensureStyle() {
    if (document.getElementById('cp-style')) return;
    const s = document.createElement('style');
    s.id = 'cp-style';
    s.textContent = CSS;
    document.head.append(s);
  }

  // The part the user last touched (helpers with the same name in two embedded tasks resolve to it).
  const touch = (e) => {
    const el = e.target && e.target.closest ? e.target.closest('[data-cfam]') : null;
    const fam = env.taskDef;
    if (el && fam && fam.name === 'complete-goals' && fam.helpers.setActivePart) fam.helpers.setActivePart(el.dataset.cfam);
  };
  for (const type of ['pointerdown', 'pointerup', 'click', 'input', 'change', 'keydown', 'focusin', 'wheel']) {
    window.addEventListener(type, touch, { capture: true, passive: true });
  }

  let st = null;

  // Union of the drawn content inside box (box-relative), ignoring wrappers that merely fill the box.
  function contentBox(box) {
    const b = box.getBoundingClientRect();
    let top = Infinity;
    let bottom = -Infinity;
    let left = Infinity;
    let right = -Infinity;
    for (const el of box.querySelectorAll('*')) {
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      if (Math.abs(r.width - b.width) < 2 && Math.abs(r.height - b.height) < 2) continue;
      top = Math.min(top, r.top);
      bottom = Math.max(bottom, r.bottom);
      left = Math.min(left, r.left);
      right = Math.max(right, r.right);
    }
    if (top === Infinity) return null;
    return { top: top - b.top, bottom: bottom - b.top, left: left - b.left, right: right - b.left, w: b.width, h: b.height };
  }
  const inside = (cb) => cb && cb.top >= -1 && cb.left >= -1 && cb.bottom <= cb.h + 1 && cb.right <= cb.w + 1;

  // Builds every part into stage with one layout; returns false if an embedded widget drew wider than its box.
  function layout(ctx, look, at, W, H0) {
    const { spec, rng, util, stage } = ctx;
    const fam = env.taskDef;
    const n = spec.parts.length;
    const { grid, colW } = at;
    const wrapW = grid ? 2 * colW + look.gap : colW;
    const host = util.el('div', 'cp-wrap' + (grid ? ' grid' : ''), stage);
    host.style.setProperty('--cp-gap', `${look.gap}px`);
    host.style.setProperty('--cp-colw', `${colW}px`);
    host.style.width = `${wrapW}px`;
    host.style.marginLeft = `${Math.round(16 + Math.max(0, W - wrapW - 40) * look.offset)}px`;
    host.style.marginRight = '16px';
    if (look.head) {
      const head = util.el('div', 'cp-head', host);
      if (grid) head.style.gridColumn = '1 / -1';
      util.el('h1', '', head, spec.title);
      util.el('span', '', head, look.sub);
    }
    const pad = look.style === 'cards' ? 26 : 0;
    st = { ctx, parts: [] };
    const allAnchors = () => st.parts.flatMap((P) => [P.card, ...(P.anchors || [])]);
    let ok = true;
    spec.parts.forEach((part, i) => {
      const subFam = env.taskOf(part.task);
      const widget = env.widgetOf(part.task, part.widget);
      if (!subFam || !widget) throw new Error(`composition: missing ${part.task} or its skin ${part.widget}`);
      const card = util.el('section', `cp-card ${look.style}`, host);
      card.dataset.cfam = part.task;
      card.dataset.cpart = String(i);
      if (look.style !== 'bare' || look.numbered) {
        const lab = util.el('div', 'cp-label', card);
        if (look.numbered) util.el('span', 'n', lab, String(i + 1));
        util.el('span', '', lab, part.label);
      }
      const box = util.el('div', 'cp-box', card);
      box.dataset.role = 'part';
      const w = colW - pad;
      const P = { i, part, fam: subFam, widget, card, box, w, h: H0, view: null, anchors: [], overflow: false };
      st.parts.push(P);
      // A sub-ctx outlives its episode for a moment (blur handlers of the removed inputs run during the next
      // reset, when the kit's model already is the new episode's): fall back to the last sub-model then.
      let lastSub = null;
      const subCtx = (h) => ({
        spec: part.spec,
        get model() {
          const m = ctx.model && ctx.model.parts && ctx.model.parts[i];
          if (m !== undefined) lastSub = m;
          return lastSub;
        },
        rng: rng.fork(`part${i}`),
        stage: box,
        size: { width: w, height: h },
        opts: { ...ctx.opts, scenario: part.scenario },
        update: (m) => {
          const cur = ctx.model;
          if (!cur.parts || i >= cur.parts.length || cur.parts[i] === m) return;
          ctx.update({ ...cur, parts: cur.parts.map((x, j) => (j === i ? m : x)) });
        },
        log: ctx.log,
        flag: ctx.flag,
        reanchor: (els) => {
          if (els && els.length) P.anchors = els;
          ctx.reanchor(allAnchors());
        },
        clock: ctx.clock,
        episode: ctx.episode,
        util,
        content: ctx.content,
      });
      P.draw = (h) => {
        box.replaceChildren();
        box.style.width = `${w}px`;
        box.style.height = `${h}px`;
        P.h = h;
        fam.helpers.setActivePart(part.task);
        P.view = widget.render(subCtx(h)) || {};
        P.anchors = P.view.anchors && P.view.anchors.length ? P.view.anchors : [];
      };
      P.draw(H0);
      let cb = contentBox(box);
      // Content taller than the box (out-of-range field counts): grow the box so it never overlaps the next part.
      for (let k = 0; k < 3 && cb && cb.bottom > cb.h + 1 && cb.bottom < 2400; k++) {
        P.draw(Math.ceil(cb.bottom) + 24);
        cb = contentBox(box);
      }
      if (cb) {
        const want = Math.max(140, Math.ceil(cb.bottom - cb.top) + 40);
        if (want < H0 - 24 && cb.bottom <= cb.h + 1) {
          P.draw(want);
          if (!inside(contentBox(box))) P.draw(H0);
        }
        const cb2 = contentBox(box);
        if (cb2 && (cb2.left < -1 || cb2.right > cb2.w + 1)) { P.overflow = true; ok = false; }
      }
    });
    void n;
    return ok;
  }

  env.widget({
    task: 'complete-goals',
    site: 'base',
    name: 'booking',
    split: 'train',
    scenarios: ['booking', 'filters', 'profile', 'appearance', 'planner', 'event'],
    scrollable: true,
    uses: USES,
    // Facts about the embedded widgets the logic needs for sampling (read lazily: the embedded widget files load
    // after this one).
    traits: {
      get parts() {
        const out = {};
        for (const [f, name] of USES) {
          const s = env.widgetOf(f, name);
          if (s) out[f] = { widget: name, scenarios: s.scenarios || null, traits: s.traits || {} };
        }
        return out;
      },
    },

    render(ctx) {
      ensureStyle();
      const { spec, rng, util, stage } = ctx;
      const fam = env.taskDef;
      // A scrollable stage shrinks to its content; measure the room its row leaves for it.
      let W = ctx.size.width;
      const sr = stage.getBoundingClientRect();
      if (W < 240 && stage.parentElement) {
        const p = stage.parentElement;
        W = p.clientWidth;
        for (const c of p.children) if (c !== stage) W -= c.getBoundingClientRect().width + 32;
      }
      // Keep clear of an end control the site pins to the bottom-right corner (content scrolls under it).
      for (const el of document.querySelectorAll('[data-role=submit]')) {
        if (getComputedStyle(el).position !== 'fixed') continue;
        W = Math.min(W, el.getBoundingClientRect().left - sr.left - 8);
      }
      W = Math.floor(W);
      const H0 = Math.max(420, Math.min(600, Math.floor(ctx.size.height) - 40));
      const n = spec.parts.length;
      const look = {
        style: rng.pick(['cards', 'cards', 'ruled', 'bare']),
        grid: n >= 2 && W >= 1240 && rng.bool(0.5),
        gap: rng.int(14, 26),
        colW: rng.int(700, 900),
        offset: rng.float(0, 1),
        head: rng.bool(0.6),
        sub: rng.pick(['All fields are saved when you finish.', `${n} sections`, 'Changes apply immediately.', '']),
        numbered: rng.bool(0.5),
      };
      // Layout attempts: the sampled one, then single columns as wide as the stage allows (an embedded widget
      // whose content is wider than its box gets a wider box).
      const attempts = [
        { grid: look.grid, colW: look.grid ? Math.min(680, Math.floor((W - 48 - look.gap) / 2)) : Math.min(W - 40, look.colW) },
        { grid: false, colW: Math.min(W - 40, Math.max(look.colW, 860)) },
        { grid: false, colW: W - 32 },
      ];
      let ok = false;
      for (const at of attempts) {
        stage.replaceChildren();
        ok = layout(ctx, look, at, W, H0);
        if (ok) break;
      }
      if (!ok) ctx.log('composition-overflow', { parts: st.parts.filter((P) => P.overflow).map((P) => P.part.task) });
      fam.helpers.setActivePart(null);

      // Mirror whether the site's instruction toast is open (the plan closes it first, see the logic).
      const note = document.querySelector('.ref-note');
      const noteOpen = !!(note && getComputedStyle(note).visibility !== 'hidden' && note.getBoundingClientRect().height > 0);
      if (!!ctx.model.note !== noteOpen) ctx.update({ ...ctx.model, note: noteOpen });
      st.noteX = note ? note.querySelector('.ref-note-x') : null;
      if (st.noteX && !st.noteX.dataset.cpBound) {
        st.noteX.dataset.cpBound = '1';
        st.noteX.addEventListener('click', () => { if (ctx.model.note) ctx.update({ ...ctx.model, note: false }); });
      }

      const allAnchors = () => st.parts.flatMap((P) => [P.card, ...(P.anchors || [])]);
      return {
        anchors: allAnchors(),
        sync(model) {
          for (const P of st.parts) {
            fam.helpers.setActivePart(P.part.task);
            if (P.view && typeof P.view.sync === 'function') P.view.sync(model.parts[P.i]);
            else {
              P.draw(P.h);
              ctx.reanchor(allAnchors());
            }
          }
          fam.helpers.setActivePart(null);
        },
      };
    },

    locate(t, envRef) {
      if (!st) throw new Error('composition/booking not rendered');
      if (t.note) {
        if (!st.noteX) throw new Error('composition/booking: no instruction note');
        return env.util.center(st.noteX);
      }
      const P = st.parts[t.part];
      if (!P) throw new Error(`composition/booking: no part ${JSON.stringify(t)}`);
      env.taskDef.helpers.setActivePart(P.part.task);
      return P.widget.locate(t.t, envRef);
    },
  });
})();
