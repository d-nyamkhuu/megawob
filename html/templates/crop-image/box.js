/*
 * templates / crop / box: the live canvas crop editor from crop/L1's medoid
 * design-crop-image-default-01. Discarded reference corners registrations never registered at these sites.
 * Scenarios in this lineage: default, outline. The medoid's position/content/aspect/marquee paths remain;
 * ratio presets, Apply, marquee gestures and keyboard nudges retain the original draw-shape/interaction order.
 * With design {}, and the site's original identity/traits, defaults reproduce:
 *   default: design-crop-image-default-01 (medoid); outline: design-crop-image-outline-01.
 * Presets: default {}; outline { inspector: true, asideApply: false, fitMode: 'round-height',
 * insetX: 4, insetY: 4 }. The last three select outline-01's exact geometry; other outline sites vary it.
 *
 * Variation inventory (all 23 member diffs read; dNN/oNN mean default/outline-NN):
 *   Background color changes: 10 default sites; d03/d04 share #fff, d07/d12 share #ffffff.
 *   Sizing changes: d05/d06/d11 and all 12 outline sites. Default uses legacy rounding (12/12);
 *   outline uses floor-width (5/12: o02/o03/o05/o10/o12), stretch (4: o04/o06/o08/o11),
 *   floor-height (2: o07/o09), round-height (1: o01). Insets vary; o01/o04/o05/o08 share 4/4.
 *   Inspector/measurements: 11/12 outline sites (all but o11); Reset and view options: 10/12 (also not o02).
 *   Aside Apply removed: 12/12 outline, plus d02/d11/d12; d05 adds a fallback parent.
 *   Readout parent changes: d07/o06; readout text changes: d07/o06; extra frame values: d02/d08/d11.
 *   Inspector heading 'CROP CONTROLS': 6 (o01/o03/o05/o06/o08/o10); 'Crop Box': 3 (o02/o04/o09).
 *   Measurement colons: o02/o07. Reset label changes: o08. View labels/heading change: o08.
 *   One-offs: d02 value card/checkbox; d06 civic CSS, rect sizing and handle-center correction;
 *   d08 hit areas/value fields; d10 magazine CSS/stroked shapes; d11 width/dock/fields;
 *   d12 action dock; o02 scrollbars/target fields/palette; o03 absolute ellipse radii;
 *   o04 target panel; o05 cleanup/transparent canvas/stage resize-element/header tools/artwork class;
 *   o06 percentage placement/live frame size; o07 nudge buttons; o08 mode buttons/zoom;
 *   o09 fit/reset tools; o10 mode buttons/tool heading; o11 working strip; o12 photo/task panel,
 *   frame-sibling handles, client fitting/placement and fixed wrap width.
 *
 * Tokens (defaults below; object/array tokens replace the whole value):
 *   background '#f1f5f7': canvas fill color.
 *   fitMode 'legacy': legacy height-first rounding; round-height, floor-width, floor-height, stretch.
 *   insetX 48, insetY 78: space removed from ctx.size before fitting; tools reserve another 40 px vertically.
 *   placementPad 8: sampled editor inset; placementClient false: use ctx.size, true: stage client dimensions.
 *   surfaceHandles false: handles are box children; true: frame siblings positioned in image px.
 *   readoutParent null: wrap; otherwise a parent selector with wrap fallback.
 *   asideApply true: move Apply toolbar before .aside .submit.
 *   inspector false: create external inspector; inspectorParent '.shell': its parent selector.
 *   inspectorTitle 'CROP CONTROLS': first heading; measurementSuffix '': suffix on X/Y/Width/Height.
 *   reset true, resetLabel 'Reset': inspector reset control, restoring the original model.
 *   viewOptions true, viewTitle 'VIEW OPTIONS': inspector view section and heading.
 *   viewLabels ['Show target outline', 'Show grid']: captions; 'Show target outline' starts checked.
 *   targetLabel 'Show target outline': caption identifying the target rather than grid checkbox.
 *
 * Parts: design.parts.<name> = (base, S) => replacement. Every call goes through P.
 * State S: ctx/spec, frame/crop, W/H (settable), D/P, els (live nodes, measurements, and
 * showBox/paintTools/commit after controls setup). els is cleared per render. No factory DOM work.
 *   style() -> CSS: original structural stylesheet; override for additional/replaced rules.
 *   begin(ctx): before sizing; default noop (cleanup hook).
 *   fit(ctx, tools) -> {W,H}: fit image with token geometry; does not draw RNG.
 *   placeIn(ctx, el, rng, pad=placementPad): position editor, avoid fixed Submit; pick/float/pick/float.
 *   background(g, spec, fam, rng): fill the canvas with background (no RNG).
 *   drawScene(g, spec, fam, rng): background, then each original shape/label (no RNG).
 *   ellipse(g, x, y, w, h): append the original ellipse path, using normalized coordinates.
 *   filled(g, object): after each shape/label fill, before label text; noop (stroke hook).
 *   image(ctx): after canvas drawing, before crop controls; noop (canvas/scrollbar hook).
 *   place(el, rect, grow=0): apply normalized rectangle as pixel left/top/width/height.
 *   readout(ctx, wrap) -> el: create cr-readout in the selected parent.
 *   inspector(ctx): token-enabled inspector; calls heading, measurements, tools, reset, views, inspected.
 *   inspectorHeading(ctx, inspector) -> el: first heading.
 *   measurements(ctx, inspector): four labeled outputs stored in els.measurements.
 *   measurementUnit(ctx, label, key) -> el: append px; replace for spinner decorations.
 *   inspectorTools(ctx, inspector): before Reset; noop (tools hook).
 *   reset(ctx, inspector) -> button: restore snapshot through crop.set and ctx.update.
 *   viewOptions(ctx, inspector): heading, checkboxes and target/grid visibility handlers.
 *   inspected(ctx, inspector): after inspector creation; noop (frame/layout hook).
 *   shuffled(ctx): after toolbar order's bool draw, before controls; noop (toolbar parent hook).
 *   controls(ctx): after showBox/paintTools/commit exist; noop (extra behavior hook).
 *   applyBar(ctx, bar): move Apply toolbar into aside when asideApply is true.
 *   tools(ctx): after all toolbar controls, before cropbox initialization; noop (toolbar/card hook).
 *   placed(ctx, el, model): after crop-image/hole placement; position frame-sibling handles if enabled.
 *   measure(ctx, model): update inspector outputs when present.
 *   paintReadout(ctx, model): empty marquee message or readoutText.
 *   readoutText(ctx, model) -> string: crop size and position in image px.
 *   rendered(ctx): before sampled positioning/px model update; noop (final layout hook).
 *   locateHandle(name, rect) -> [x,y]: crop primitive's handle location.
 * Preserve each replaced part's RNG draws; decorations needing randomness use ctx.rng.fork(label).
 */
(function () {
  'use strict';
  const CSS = `
  .cr-wrap { position: absolute; display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 14px; }
  .cr-frame { position: relative; flex: none; box-shadow: 0 4px 18px rgba(0,0,0,.18); border-radius: 2px; touch-action: none; }
  .cr-frame canvas { display: block; }
  .cr-dim { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
  .cr-hole { position: absolute; box-shadow: 0 0 0 4000px rgba(0,0,0,.5); }
  .cr-frame.empty .cr-hole { box-shadow: none; }
  .cr-target {
    position: absolute; pointer-events: none; box-sizing: border-box;
    border: 2px dashed #fff; outline: 1px solid rgba(0,0,0,.55); outline-offset: 0;
    box-shadow: inset 0 0 0 1px rgba(0,0,0,.55);
  }
  .cr-box { position: absolute; outline: 1px solid rgba(255,255,255,.95); box-shadow: 0 0 0 1px rgba(0,0,0,.35); cursor: move; touch-action: none; }
  .cr-box:focus { outline: 2px solid var(--accent); }
  .cr-grid { position: absolute; inset: 0; pointer-events: none; }
  .cr-grid::before, .cr-grid::after { content: ""; position: absolute; border: 0 dashed rgba(255,255,255,.55); }
  .cr-grid::before { left: 33.33%; right: 33.33%; top: 0; bottom: 0; border-left-width: 1px; border-right-width: 1px; }
  .cr-grid::after { top: 33.33%; bottom: 33.33%; left: 0; right: 0; border-top-width: 1px; border-bottom-width: 1px; }
  .cr-handle {
    position: absolute; width: 12px; height: 12px; margin: -6px 0 0 -6px;
    background: var(--accent); border: 1.5px solid #fff; border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0,0,0,.35);
  }
  .cr-handle[data-role="handle-nw"], .cr-handle[data-role="handle-se"] { cursor: nwse-resize; }
  .cr-handle[data-role="handle-ne"], .cr-handle[data-role="handle-sw"] { cursor: nesw-resize; }
  .cr-handle[data-role="handle-n"], .cr-handle[data-role="handle-s"] { cursor: ns-resize; }
  .cr-handle[data-role="handle-e"], .cr-handle[data-role="handle-w"] { cursor: ew-resize; }
  .cr-locked .cr-handle[data-role="handle-n"], .cr-locked .cr-handle[data-role="handle-s"],
  .cr-locked .cr-handle[data-role="handle-e"], .cr-locked .cr-handle[data-role="handle-w"] { display: none; }
  .cr-readout { color: var(--muted); font-size: 14px; font-variant-numeric: tabular-nums; }
  .cr-tools { display: flex; align-items: center; gap: 6px; flex-wrap: nowrap; }
  .cr-chip { padding: 4px 9px; border-radius: 6px; border: 1px solid var(--line); background: var(--panel); color: var(--fg); font-size: 13px; cursor: pointer; }
  .cr-chip.on { background: var(--accent); border-color: var(--accent); color: #fff; }
  .cr-sep { width: 14px; }
  .cr-apply { padding: 5px 12px; border-radius: 6px; border: 1px solid color-mix(in srgb, var(--accent) 60%, var(--line)); background: color-mix(in srgb, var(--accent) 12%, var(--panel)); color: var(--fg); font-weight: 650; font-size: 13px; cursor: pointer; }
  .cr-badge { font-size: 12px; color: #2f9e44; font-weight: 650; min-width: 64px; }
  `;
  const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
  const ARROWS = new Set(['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown']);

  const TOKENS = {
    background: '#f1f5f7', fitMode: 'legacy', insetX: 48, insetY: 78,
    placementPad: 8, placementClient: false, surfaceHandles: false,
    readoutParent: null, asideApply: true, inspector: false, inspectorParent: '.shell',
    inspectorTitle: 'CROP CONTROLS', measurementSuffix: '', reset: true, resetLabel: 'Reset',
    viewOptions: true, viewTitle: 'VIEW OPTIONS',
    viewLabels: ['Show target outline', 'Show grid'], targetLabel: 'Show target outline',
  };
  const SCENARIOS = {
    default: {},
    outline: { fitMode: 'round-height', insetX: 4, insetY: 4, inspector: true, asideApply: false },
  };

  env.template('crop-image/box', (design, def) => {
    let D, P, ctxRef;
    const BASE = {};
    const els = {};
    const S = {
      get ctx() { return ctxRef; }, get spec() { return ctxRef.spec; },
      get frame() { return frame; }, get crop() { return crop; },
      get W() { return W; }, set W(value) { W = value; },
      get H() { return H; }, set H(value) { H = value; },
      get D() { return D; }, get P() { return P; }, els,
    };
    let frame;
    let W;
    let H;
    let crop;
    let chips;
    let applyBtn;

    function ensureStyle() {
      if (document.getElementById('cr-style')) return;
      const s = document.createElement('style');
      s.id = 'cr-style';
      s.textContent = P.style();
      document.head.append(s);
    }

    BASE.placeIn = (ctx, el, rng, pad = D.placementPad) => {
      const SW = D.placementClient ? ctx.stage.clientWidth : ctx.size.width;
      const SH = D.placementClient ? ctx.stage.clientHeight : ctx.size.height;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const freeX = Math.max(0, SW - w - 2 * pad);
      const freeY = Math.max(0, SH - h - 2 * pad);
      const c01 = (f) => Math.min(1, Math.max(0, f));
      const fx = c01(rng.pick([0, 0.5, 0.5, 1]) + rng.float(-0.15, 0.15));
      const fy = c01(rng.pick([0, 0.5, 0.5, 1]) + rng.float(-0.15, 0.15));
      const st = ctx.stage.getBoundingClientRect();
      const fixed = [...document.querySelectorAll('[data-role="submit"]')]
        .filter((b) => getComputedStyle(b).position === 'fixed').map((b) => b.getBoundingClientRect());
      const hits = (x, y) => fixed.some((r) => st.left + x < r.right + 6 && st.left + x + w > r.left - 6 && st.top + y < r.bottom + 6 && st.top + y + h > r.top - 6);
      let [x, y] = [pad + fx * freeX, pad + fy * freeY];
      for (const [ax, ay] of [[fx, fy], [fx, 0], [0, fy], [0, 0], [1, 0], [0, 1], [0.5, 0]]) {
        if (!hits(pad + ax * freeX, pad + ay * freeY)) {
          [x, y] = [pad + ax * freeX, pad + ay * freeY];
          break;
        }
      }
      el.style.left = Math.round(x) + 'px';
      el.style.top = Math.round(y) + 'px';
    };

    // Background (spec.bg.style) and objects on a 2D canvas of W x H px.
    BASE.drawScene = (g, spec, fam, rng) => {
      P.background(g, spec, fam, rng);
      for (const o of spec.objects) {
        const { x, y, w, h } = o.sq;
        if (o.kind === 'label') {
          const px = [x * W, y * H, w * W, h * H];
          g.fillStyle = o.hex;
          g.beginPath();
          g.roundRect(px[0], px[1], px[2], px[3], Math.min(8, px[3] / 4));
          g.fill();
          P.filled(g, o);
          g.fillStyle = '#fff';
          g.font = `650 ${Math.round(px[3] * 0.42)}px system-ui, -apple-system, "Segoe UI", sans-serif`;
          g.textAlign = 'center';
          g.textBaseline = 'middle';
          g.fillText(o.text, px[0] + px[2] / 2, px[1] + px[3] / 2 + 1, px[2] * 0.88);
          continue;
        }
        g.fillStyle = o.hex;
        g.beginPath();
        const pts = fam.shapePoints(o);
        if (pts) {
          pts.forEach(([px, py], k) => (k ? g.lineTo(px * W, py * H) : g.moveTo(px * W, py * H)));
          g.closePath();
        } else {
          P.ellipse(g, x, y, w, h);
        }
        g.fill();
        P.filled(g, o);
      }
    };

    BASE.ellipse = (g, x, y, w, h) =>
      g.ellipse((x + w / 2) * W, (y + h / 2) * H, (w / 2) * W, (h / 2) * H, 0, 0, 2 * Math.PI);
    BASE.filled = () => {};

    BASE.place = (el, r, grow = 0) => {
      Object.assign(el.style, {
        left: r.l * W - grow + 'px',
        top: r.t * H - grow + 'px',
        width: (r.r - r.l) * W + 2 * grow + 'px',
        height: (r.b - r.t) * H + 2 * grow + 'px',
      });
    };

    BASE.style = () => CSS;
    BASE.begin = () => {};
    BASE.image = () => {};
    BASE.shuffled = () => {};
    BASE.controls = () => {};
    BASE.tools = () => {};
    BASE.rendered = () => {};
    BASE.background = (g) => {
      g.fillStyle = D.background;
      g.fillRect(0, 0, W, H);
    };
    BASE.fit = (ctx, tools) => {
      const size = ctx.size;
      const spec = ctx.spec;
      const availW = Math.floor(size.width - D.insetX);
      const availH = Math.floor(size.height - D.insetY - (tools ? 40 : 0));
      let W, H;
      if (D.fitMode === 'round-height') {
        H = Math.min(availH, Math.round(availW / spec.aspect));
        W = Math.min(availW, Math.round(H * spec.aspect));
      } else if (D.fitMode === 'floor-width') {
        W = Math.floor(Math.min(availW, availH * spec.aspect));
        H = Math.floor(W / spec.aspect);
      } else if (D.fitMode === 'floor-height') {
        H = Math.floor(Math.min(availH, availW / spec.aspect));
        W = Math.floor(H * spec.aspect);
      } else if (D.fitMode === 'stretch') {
        W = availW;
        H = availH;
      } else {
        H = availH;
        W = Math.round(H * spec.aspect);
        if (W > availW) {
          W = availW;
          H = Math.round(W / spec.aspect);
        }
      }
      return { W, H };
    };
    BASE.readout = (ctx, wrap) => ctx.util.el('div', 'cr-readout',
      D.readoutParent ? document.querySelector(D.readoutParent) || wrap : wrap);
    BASE.inspector = (ctx) => {
      if (!D.inspector) return;
      const inspector = ctx.util.el('aside', 'crop-inspector', document.querySelector(D.inspectorParent));
      els.inspector = inspector;
      P.inspectorHeading(ctx, inspector);
      P.measurements(ctx, inspector);
      P.inspectorTools(ctx, inspector);
      if (D.reset) P.reset(ctx, inspector);
      if (D.viewOptions) P.viewOptions(ctx, inspector);
      P.inspected(ctx, inspector);
    };
    BASE.inspectorHeading = (ctx, inspector) => ctx.util.el('h3', '', inspector, D.inspectorTitle);
    BASE.measurements = (ctx, inspector) => {
      const measurements = els.measurements = {};
      for (const key of ['X', 'Y', 'Width', 'Height']) {
        const label = ctx.util.el('label', 'crop-measurement', inspector, key + D.measurementSuffix);
        measurements[key] = ctx.util.el('output', '', label);
        P.measurementUnit(ctx, label, key);
      }
    };
    BASE.measurementUnit = (ctx, label) => ctx.util.el('span', '', label, 'px');
    BASE.inspectorTools = () => {};
    BASE.inspected = () => {};
    BASE.reset = (ctx, inspector) => {
      const restore = ctx.util.el('button', 'crop-reset', inspector, D.resetLabel);
      els.restore = restore;
      const initial = { ...ctx.model };
      restore.onclick = () => {
        crop.set(initial);
        ctx.update({ ...initial });
      };
      return restore;
    };
    BASE.viewOptions = (ctx, inspector) => {
      const { util } = ctx;
      util.el('hr', '', inspector);
      util.el('h3', '', inspector, D.viewTitle);
      for (const text of D.viewLabels) {
        const label = util.el('label', 'crop-option', inspector);
        const input = util.el('input', '', label);
        input.type = 'checkbox';
        input.checked = text === 'Show target outline';
        util.el('span', '', label, text);
        input.onchange = () => {
          const item = frame.querySelector(text === D.targetLabel ? '.cr-target' : '.cr-grid');
          if (item) item.style.display = input.checked ? 'block' : 'none';
        };
      }
    };
    BASE.applyBar = (ctx, bar) => {
      if (!D.asideApply) return;
      const aside = document.querySelector('.aside');
      if (aside) aside.insertBefore(bar, aside.querySelector('.submit'));
    };
    BASE.placed = (ctx, el, m) => {
      if (!D.surfaceHandles) return;
      for (const [name, handle] of Object.entries(els.handles)) {
        const [x, y] = env.taskDef.helpers.handlePoint(m, name);
        handle.style.left = x * W + 'px';
        handle.style.top = y * H + 'px';
      }
    };
    BASE.measure = (ctx, m) => {
      const fields = els.measurements;
      if (!fields) return;
      fields.X.textContent = Math.round(m.l * W);
      fields.Y.textContent = Math.round(m.t * H);
      fields.Width.textContent = Math.round((m.r - m.l) * W);
      fields.Height.textContent = Math.round((m.b - m.t) * H);
    };
    BASE.paintReadout = (ctx, m) => {
      els.readout.textContent = ctx.spec.scenario === 'marquee' && !ctx.model.on
        ? 'No selection - drag on the image to select' : P.readoutText(ctx, m);
    };
    BASE.readoutText = (ctx, m) => {
      const px = (v, s) => Math.round(v * s);
      return `Crop: ${px(m.r - m.l, W)} × ${px(m.b - m.t, H)} px at (${px(m.l, W)}, ${px(m.t, H)})`;
    };
    BASE.locateHandle = (name, rect) => crop.locateHandle(name, rect);

    // The ratio preset chips of the aspect scenario. Returns them by ratio.
    function presetChips(ctx, bar, commit) {
      const { spec, util } = ctx;
      const fam = env.taskDef.helpers;
      const chips = {};
      for (const r of ['free', ...fam.RATIOS]) {
        const c = util.el('button', 'cr-chip', bar, r === 'free' ? 'Free' : r);
        c.type = 'button';
        c.dataset.role = 'preset';
        c.addEventListener('click', () => {
          const m = { ...fam.applyRatio(ctx.model, r, spec), ratio: r };
          crop.set(m);
          commit(m);
          env.log('preset', { ratio: r });
        });
        chips[r] = c;
      }
      return chips;
    }

    // The Apply button and its badge (ctx.model.applied). Returns the badge.
    function applyControls(ctx, bar, paintTools) {
      const { spec, util, rng } = ctx;
      if (chips) util.el('span', 'cr-sep', bar);
      applyBtn = util.el('button', 'cr-apply', bar, rng.pick(['Apply crop', 'Crop', 'Apply', 'Crop image', 'Done cropping']));
      applyBtn.type = 'button';
      applyBtn.dataset.role = 'apply';
      const badge = util.el('span', 'cr-badge', bar);
      applyBtn.addEventListener('click', () => {
        const m = ctx.model;
        ctx.update({ ...m, applied: { l: m.l, t: m.t, r: m.r, b: m.b } });
        env.log('apply-crop');
        paintTools();
      });
      P.applyBar(ctx, bar);
      return badge;
    }

    // Marquee: a press on the image outside the box draws a new selection.
    function bindMarquee(ctx, box, commit) {
      const { spec } = ctx;
      const fam = env.taskDef.helpers;
      frame.addEventListener('pointerdown', (e) => {
        if (e.button !== 0 || (box.style.display !== 'none' && box.contains(e.target))) return;
        e.preventDefault();
        frame.setPointerCapture(e.pointerId);
        const p0 = crop.toNorm([e.clientX, e.clientY]);
        env.log('grab', { what: 'marquee' });
        const move = (ev) => {
          const r = fam.marqueeRect(p0, crop.toNorm([ev.clientX, ev.clientY]), spec);
          if (!r) return;
          crop.set(r);
          commit({ ...r, on: true });
          crop.set(r);
        };
        const end = (ev) => {
          move(ev);
          frame.removeEventListener('pointermove', move);
          frame.removeEventListener('pointerup', end);
          env.log('release', { what: 'marquee' });
        };
        frame.addEventListener('pointermove', move);
        frame.addEventListener('pointerup', end);
      });
    }

    // Keyboard nudging of the focused box.
    function bindKeys(ctx, box, commit) {
      const { spec } = ctx;
      const fam = env.taskDef.helpers;
      box.tabIndex = 0;
      box.addEventListener('pointerdown', () => box.focus({ preventScroll: true }));
      box.addEventListener('keydown', (e) => {
        if (!ARROWS.has(e.key)) return;
        e.preventDefault();
        const m = fam.nudge({ ...ctx.model, px: { W, H } }, (e.shiftKey ? 'Shift+' : '') + e.key, spec);
        crop.set(m);
        commit({ l: m.l, t: m.t, r: m.r, b: m.b });
      });
      box.addEventListener('focus', () => { if (!ctx.model.focus) ctx.update({ ...ctx.model, focus: true }); });
      box.addEventListener('blur', () => { if (ctx.model.focus) ctx.update({ ...ctx.model, focus: false }); });
    }

    ({ D, P } = env.templateDesign('crop-image/box', design, def, { tokens: TOKENS, scenarios: SCENARIOS, base: BASE, state: S }));
    return {
      render(ctx) {
        ensureStyle();
        ctxRef = ctx;
        for (const key of Object.keys(els)) delete els[key];
        P.begin(ctx);
        const { spec, util, rng } = ctx;
        const fam = env.taskDef.helpers;
        const tools = spec.scenario === 'aspect' || spec.apply;

        ({ W, H } = P.fit(ctx, tools));

        const wrap = util.el('div', 'cr-wrap', ctx.stage);
        let bar = null;
        if (tools) {
          bar = util.el('div', 'cr-tools', wrap);
          bar.dataset.role = 'toolbar';
        }
        frame = util.el('div', 'cr-frame', wrap);
        Object.assign(frame.style, { width: W + 'px', height: H + 'px' });
        const canvas = util.el('canvas', '', frame);
        canvas.dataset.role = 'image';
        canvas.width = W;
        canvas.height = H;
        P.drawScene(canvas.getContext('2d'), spec, fam, rng);
        Object.assign(els, { wrap, bar, canvas });
        P.image(ctx);

        const hole = util.el('div', 'cr-hole', util.el('div', 'cr-dim', frame));
        if (spec.scenario === 'outline') P.place(util.el('div', 'cr-target', frame), spec.target, 1);
        const box = util.el('div', 'cr-box', frame);
        box.dataset.role = 'crop-move';
        util.el('div', 'cr-grid', box);
        const handles = {};
        for (const name of HANDLES) {
          const h = util.el('div', 'cr-handle', D.surfaceHandles ? frame : box);
          h.dataset.role = 'handle-' + name;
          const [fx, fy] = fam.handlePoint({ l: 0, t: 0, r: 1, b: 1 }, name);
          Object.assign(h.style, { left: fx * 100 + '%', top: fy * 100 + '%' });
          handles[name] = h;
        }
        const readout = P.readout(ctx, wrap);
        Object.assign(els, { hole, box, handles, readout });
        P.inspector(ctx);
        if (bar && rng.bool(0.4)) wrap.append(bar);
        P.shuffled(ctx);

        const showBox = () => {
          const off = spec.scenario === 'marquee' && !ctx.model.on;
          box.style.display = off ? 'none' : '';
          frame.classList.toggle('empty', off);
          frame.classList.toggle('cr-locked', !!fam.ratioValue(ctx.model.ratio));
        };
        let badge = null;
        const paintTools = () => {
          if (chips) for (const [r, c] of Object.entries(chips)) c.classList.toggle('on', (ctx.model.ratio || 'free') === r);
          if (badge) {
            const m = ctx.model;
            const ok = m.applied && ['l', 't', 'r', 'b'].every((k) => Math.abs(m.applied[k] - m[k]) <= 0.002);
            badge.textContent = ok ? 'Applied ✓' : '';
          }
        };
        // Every change of the rectangle (drag, marquee, preset, key) un-applies an applied crop.
        const commit = (m) => {
          ctx.update({ ...ctx.model, ...m, ...(spec.apply ? { applied: null } : {}) });
          showBox();
          paintTools();
        };

        Object.assign(els, { showBox, paintTools, commit });
        P.controls(ctx);
        chips = null;
        applyBtn = null;
        if (spec.scenario === 'aspect') chips = presetChips(ctx, bar, commit);
        if (spec.apply) badge = applyControls(ctx, bar, paintTools);

        P.tools(ctx);

        crop = env.ui.cropbox(frame, box, {
          value: { l: ctx.model.l, t: ctx.model.t, r: ctx.model.r, b: ctx.model.b },
          handles,
          apply: (r, action, dx, dy) => fam.applyDrag({ ...r, ratio: ctx.model.ratio }, action, dx, dy, spec),
          place: (el, m) => {
            P.place(hole, m);
            P.place(el, m);
            P.placed(ctx, el, m);
            P.measure(ctx, m);
            P.paintReadout(ctx, m);
          },
          onInput: (m) => commit(m),
        });

        // Marquee: a press on the image outside the box draws a new selection.
        if (spec.scenario === 'marquee') bindMarquee(ctx, box, commit);

        // Keyboard nudging of the focused box.
        if (spec.keys) bindKeys(ctx, box, commit);

        showBox();
        paintTools();
        crop.set(ctx.model);
        P.rendered(ctx);
        P.placeIn(ctx, wrap, rng);
        // Mirror the rendered image size (unscored) for the keyboard plan.
        ctx.update({ ...ctx.model, px: { W, H } });
        return {
          anchors: [frame],
          sync: (m) => {
            crop.set(m);
            showBox();
            paintTools();
          },
        };
      },
      locate(t) {
        if (t.mark) return crop.locate(t.mark);
        if (t.preset) return env.util.center(chips[t.preset]);
        if (t.apply) return env.util.center(applyBtn);
        return P.locateHandle(t.handle, t.rect);
      },
    };
  });
})();
