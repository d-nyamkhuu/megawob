/*
 * reference / slider / rcslider, mui: React 18 widgets on real React slider libraries (vendor/, loaded through the
 * widgets' `uses` lists in templates/set-slider/base.js, which also declares their names and scenarios; this file
 * fills in their render / locate). Each render mounts a fresh React root in the stage (the previous one is unmounted) with
 * ReactDOM.flushSync, so the page exists when render returns; every model change re-renders it synchronously.
 *   rcslider  rc-slider 11.1.9 (one pre-built IIFE bundle). Scenarios horizontal, vertical, log, range, multi, stops,
 *             mixer, match. Library behaviour kept: a press on a handle drags it by the pointer's travel from the
 *             press (no jump to the pointer), a press on the rail or on a mark label jumps the nearest handle there
 *             and keeps dragging it, handles of a range cannot cross (allowCross off), linear sliders snap to the
 *             library's own step, stops are marks with step null (the value snaps to the nearest mark), dots per
 *             seed.
 *   mui       MUI (@mui/material 5.18.0 UMD) Slider and Rating. Scenarios horizontal, vertical, log, range, multi,
 *             stops, mixer, match, rating. Library behaviour kept: any press on the slider (thumb or rail) moves
 *             the nearest thumb to the pointer at once and keeps dragging it, thumbs do not swap (disableSwap),
 *             marks with step null for stops, value labels per seed ('on' above the thumbs, or a readout column),
 *             small / medium size. Rating: MUI Rating with precision 0.5 or 1 (half stars from the left half of a
 *             star; the hovered value previews under the pointer; clicking the current value clears it to 0).
 * React roots: rc-slider runs on a concurrent root (createRoot, every page update under flushSync); MUI on a legacy
 * root (ReactDOM.render), so a Rating hover commits on its mousemove and a click right after it gets the hovered
 * (half) star, as with MUI 5 on React 17.
 * Log sliders run on a 0..1000 position scale (MUI: its `scale` prop shows the value); the task's
 * scale.valueAt maps positions to values, so a value is always on the task's grid.
 * Track clicks: a press on the slider that is not on a handle / thumb is logged and flagged ('track-click') when
 * the spec forbids it (the libraries always jump; the instruction says not to).
 * Keyboard episodes (spec.keys): the libraries' own key handling is off (rc-slider keyboard={false}; MUI's hidden
 * range inputs never see the keys); a press focuses a handle, arrows / PageUp / PageDown / Home / End step the
 * single value with helpers.scale.keyApply, focus is mirrored into model.focus. Without spec.keys those keys do
 * nothing here.
 * Values: the model holds the task's values; library values are converted on every change and re-snapped with
 * scale.valueAt; ranges stay ordered.
 * No timers: transitions are off (CSS), so a thumb sits where the model says when an event returns.
 */
(function () {
  'use strict';

  const POS = 1000;
  const KEYS = new Set(['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End']);

  const CSS = `
  .sr-card { position: absolute; padding: 28px 36px 40px; border: 1px solid var(--line); border-radius: 10px; color: var(--fg);
    background: color-mix(in srgb, var(--panel) 60%, var(--bg)); box-shadow: 0 1px 3px rgba(0,0,0,.06); box-sizing: border-box; }
  .sr-card.vertical { padding: 34px 64px 26px 44px; }
  .sr-card.dense { padding: 18px 24px 30px; border-radius: 4px; font-size: 12.5px; box-shadow: none; }
  .sr-grid { display: grid; grid-template-columns: auto auto auto; column-gap: 26px; align-items: center; }
  .sr-grid.no-readout { grid-template-columns: auto auto; }
  .sr-row { display: flex; align-items: flex-start; }
  .sr-col { display: flex; flex-direction: column; align-items: center; gap: 18px; }
  .sr-label { min-width: 96px; font-weight: 600; text-align: right; white-space: nowrap; }
  .sr-col .sr-label { min-width: 0; text-align: center; max-width: 110px; overflow: hidden; text-overflow: ellipsis; }
  .sr-readout { width: 128px; padding: 4px 10px; border: 1px solid var(--line); border-radius: 6px; background: var(--panel);
    font-variant-numeric: tabular-nums; text-align: center; white-space: nowrap; overflow: hidden; box-sizing: border-box; }
  .sr-col .sr-readout { width: 84px; }
  .sr-track { position: relative; flex: none; }
  .sr-presets { margin: -6px 0 30px; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); font-size: 13px; }
  .sr-presets table { border-collapse: collapse; width: 100%; }
  .sr-presets th, .sr-presets td { padding: 5px 12px; text-align: left; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .sr-presets th { color: var(--muted); font-weight: 600; font-size: 12px; border-bottom: 1px solid var(--line); }
  .sr-presets td:first-child { font-weight: 650; }
  .sr-presets caption { text-align: left; padding: 8px 12px 2px; font-weight: 700; font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
  .sr-head { margin: 0 0 4px; font-size: 18px; font-weight: 700; }
  .sr-sub { margin: 0 0 18px; color: var(--muted); }
  .sr-rate { display: grid; grid-template-columns: auto auto auto; column-gap: 22px; row-gap: 14px; align-items: center; }
  .sr-rate .sr-label { min-width: 90px; text-align: left; }
  .sr-rate .sr-readout { width: 76px; }
  .sr-card * { transition: none !important; animation: none !important; }

  /* rc-slider: the structural rules of assets/index.css, themed */
  .rc-slider { position: relative; width: 100%; height: calc(var(--sr-hs) + 0px); padding: calc((var(--sr-hs) - var(--sr-rail)) / 2) 0;
    border-radius: 6px; touch-action: none; box-sizing: border-box; }
  .rc-slider * { box-sizing: border-box; }
  .rc-slider-rail { position: absolute; width: 100%; height: var(--sr-rail); background-color: var(--line); border-radius: 6px; }
  .rc-slider-track { position: absolute; height: var(--sr-rail); background-color: var(--accent); border-radius: 6px; }
  .rc-slider-handle { position: absolute; z-index: 1; width: var(--sr-hs); height: var(--sr-hs); margin-top: calc((var(--sr-rail) - var(--sr-hs)) / 2);
    background-color: var(--panel); border: solid 2px var(--accent); border-radius: 50%; cursor: grab; user-select: none; touch-action: pan-x; outline: none; }
  .rc-slider-handle-dragging.rc-slider-handle-dragging.rc-slider-handle-dragging { box-shadow: 0 0 0 5px color-mix(in srgb, var(--accent) 30%, transparent); }
  .rc-slider-handle:focus-visible, .rc-slider-handle.sr-focus { box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 40%, transparent); }
  .rc-slider-mark { position: absolute; top: calc(var(--sr-hs) + 6px); left: 0; width: 100%; font-size: 12px; }
  .rc-slider-mark-text { position: absolute; display: inline-block; color: var(--muted); text-align: center; vertical-align: middle; cursor: pointer; white-space: nowrap; }
  .rc-slider-mark-text-active { color: var(--fg); }
  .rc-slider-step { position: absolute; width: 100%; height: var(--sr-rail); background: transparent; }
  .rc-slider-dot { position: absolute; bottom: calc(var(--sr-rail) / 2 - 4px); width: 8px; height: 8px; vertical-align: middle; background-color: var(--panel);
    border: 2px solid var(--line); border-radius: 50%; cursor: pointer; }
  .rc-slider-dot-active { border-color: var(--accent); }
  .rc-slider-vertical { width: var(--sr-hs); height: 100%; padding: 0 calc((var(--sr-hs) - var(--sr-rail)) / 2); }
  .rc-slider-vertical .rc-slider-rail { width: var(--sr-rail); height: 100%; }
  .rc-slider-vertical .rc-slider-track { bottom: 0; left: calc((var(--sr-hs) - var(--sr-rail)) / 2); width: var(--sr-rail); }
  .rc-slider-vertical .rc-slider-handle { margin-top: 0; margin-left: calc((var(--sr-rail) - var(--sr-hs)) / 2); touch-action: pan-y; }
  .rc-slider-vertical .rc-slider-mark { top: 0; left: calc(var(--sr-hs) + 8px); height: 100%; }
  .rc-slider-vertical .rc-slider-step { width: var(--sr-rail); height: 100%; }
  .rc-slider-vertical .rc-slider-dot { margin-left: -4px; left: calc(var(--sr-rail) / 2) !important; bottom: auto; }
  .sr-square .rc-slider-handle { border-radius: 3px; }
  .sr-filled .rc-slider-handle { background-color: var(--accent); border-color: var(--panel); box-shadow: 0 1px 3px rgba(0,0,0,.35); }
  `;

  let R = null; // the current render

  const h = (...a) => window.React.createElement(...a);
  const SC = () => env.taskOf('set-slider').helpers.scale;
  const rectOf = (el) => el.getBoundingClientRect();
  const center = (el) => {
    const r = rectOf(el);
    return [r.left + r.width / 2, r.top + r.height / 2];
  };

  // Library position <-> task value.
  const toPos = (s, v) => (s.log ? Math.round(SC().frac(s, v) * POS) : v);
  const toVal = (s, p) => (s.log ? SC().valueAt(s, p / POS) : s.stops ? Math.round(p) : SC().valueAt(s, SC().frac(s, p)));

  function placeIn(ctx, el, rng, pad = 12) {
    const w = el.offsetWidth;
    const hh = el.offsetHeight;
    const freeX = Math.max(0, ctx.size.width - w - 2 * pad);
    const freeY = Math.max(0, ctx.size.height - hh - 2 * pad);
    const c01 = (f) => Math.min(1, Math.max(0, f));
    const fx = c01(rng.pick([0, 0.5, 0.5, 1]) + rng.float(-0.15, 0.15));
    const fy = c01(rng.pick([0, 0.5, 0.5, 1]) + rng.float(-0.15, 0.15));
    const st = ctx.stage.getBoundingClientRect();
    const fixed = [...document.querySelectorAll('[data-role="submit"]')]
      .filter((b) => getComputedStyle(b).position === 'fixed').map((b) => b.getBoundingClientRect());
    const hits = (x, y) => fixed.some((r) => st.left + x < r.right + 6 && st.left + x + w > r.left - 6 && st.top + y < r.bottom + 6 && st.top + y + hh > r.top - 6);
    let [x, y] = [pad + fx * freeX, pad + fy * freeY];
    for (const [ax, ay] of [[fx, fy], [fx, 0], [0, fy], [0, 0], [1, 0], [0, 1], [0.5, 0], [0.5, 0.5]]) {
      if (!hits(pad + ax * freeX, pad + ay * freeY)) {
        [x, y] = [pad + ax * freeX, pad + ay * freeY];
        break;
      }
    }
    el.style.left = Math.round(x) + 'px';
    el.style.top = Math.round(y) + 'px';
  }

  // ---- model updates

  function draw(S) {
    if (R !== S || !S.root) return;
    window.ReactDOM.flushSync(() => S.root.render(h(App, { S, values: S.values, tick: ++S.tick })));
  }

  function setValues(S, i, vals) {
    if (R !== S) return;
    const s = S.spec.sliders[i];
    vals = vals.map((v) => Math.min(s.max, Math.max(s.min, v)));
    if (vals.length === 2 && vals[0] > vals[1]) vals = [vals[1], vals[0]];
    const cur = S.values[i];
    if (cur.length === vals.length && cur.every((v, j) => v === vals[j])) return draw(S);
    S.values = S.values.map((x, k) => (k === i ? vals : x.slice()));
    S.ctx.update({ ...S.ctx.model, values: S.values.map((x) => x.slice()) });
    draw(S);
  }

  // ---- library sliders

  function RcRow({ S, i, value }) {
    const Rc = window.RcSlider;
    const s = S.spec.sliders[i];
    const vertical = S.vertical;
    const pos = value.map((v) => toPos(s, v));
    const props = {
      range: pos.length === 2,
      value: pos.length === 2 ? pos : pos[0],
      allowCross: false,
      keyboard: false,
      vertical,
      onChange: (v) => setValues(S, i, [].concat(v).map((p) => toVal(s, p))),
    };
    if (s.log) Object.assign(props, { min: 0, max: POS, step: 1 });
    else if (s.stops) Object.assign(props, { min: 0, max: s.stops.length - 1, step: null, marks: Object.fromEntries(s.stops.map((t, k) => [k, t])), dots: true });
    else {
      Object.assign(props, { min: s.min, max: s.max, step: s.step });
      if (S.marks) props.marks = Object.fromEntries(S.ticks(s).map((v) => [v, SC().fmt(s, v)]));
      if (S.dots && (s.max - s.min) / s.step <= 40) props.dots = true;
    }
    return h(Rc, props);
  }

  function MuiRow({ S, i, value }) {
    const M = window.MaterialUI;
    const s = S.spec.sliders[i];
    const pos = value.map((v) => toPos(s, v));
    const props = {
      value: pos.length === 2 ? pos : pos[0],
      orientation: S.vertical ? 'vertical' : 'horizontal',
      disableSwap: true,
      size: S.size,
      valueLabelDisplay: S.labels ? 'on' : 'off',
      valueLabelFormat: (p) => SC().fmtU(s, toVal(s, p)),
      onChange: (e, v) => setValues(S, i, [].concat(v).map((p) => toVal(s, p))),
      sx: { color: 'var(--accent)', ...(S.vertical ? { height: '100%' } : { width: '100%' }), '& .MuiSlider-rail': { color: 'var(--line)', opacity: 1 },
        '& .MuiSlider-markLabel': { color: 'var(--muted)', fontSize: '12px' }, '& .MuiSlider-markLabelActive': { color: 'var(--fg)' },
        '& .MuiSlider-thumb.sr-focus': { boxShadow: '0 0 0 6px color-mix(in srgb, var(--accent) 30%, transparent)' } },
      componentsProps: { input: { tabIndex: S.spec.keys ? 0 : -1 } },
    };
    if (s.log) Object.assign(props, { min: 0, max: POS, step: 1, scale: (p) => toVal(s, p) });
    else if (s.stops) Object.assign(props, { min: 0, max: s.stops.length - 1, step: null, marks: s.stops.map((t, k) => ({ value: k, label: t })) });
    else {
      Object.assign(props, { min: s.min, max: s.max, step: s.step });
      if (S.marks) props.marks = S.ticks(s).map((v) => ({ value: v, label: SC().fmt(s, v) }));
    }
    return h(M.Slider, props);
  }

  function MuiRating({ S, i, value }) {
    const M = window.MaterialUI;
    const s = S.spec.sliders[i];
    return h(M.Rating, {
      name: `sr-rate-${i}`,
      value: value[0],
      max: s.max,
      precision: s.step,
      size: S.size === 'small' ? 'medium' : 'large',
      onChange: (e, v) => setValues(S, i, [v == null ? 0 : v]),
      sx: { color: S.starColor, '& .MuiRating-iconEmpty': { color: 'var(--line)' } },
    });
  }

  // ---- page

  function PresetCard({ S }) {
    const { spec } = S;
    return h('div', { className: 'sr-presets', 'data-role': 'presets' },
      h('table', null,
        h('caption', null, S.presetTitle),
        h('tbody', null,
          h('tr', null, h('th', null, 'Preset'), spec.sliders.map((s, k) => h('th', { key: k }, s.label))),
          spec.presets.map((p, r) => h('tr', { key: r }, h('td', null, p.name), p.values.map((v, k) => h('td', { key: k }, SC().fmtU(spec.sliders[k], v))))))));
  }

  function App({ S, values }) {
    const { spec } = S;
    const Row = S.engine === 'mui' ? MuiRow : RcRow;
    const readout = (i) => (S.readout ? h('div', { className: 'sr-readout', key: 'r' + i }, values[i].map((v) => SC().fmtU(spec.sliders[i], v)).join(' – ')) : null);
    const track = (i, child) => h('div', {
      key: 't' + i, className: 'sr-track', 'data-role': 'track', 'data-slider': i,
      ref: (el) => { if (el) S.tracks[i] = el; },
      style: S.vertical ? { height: S.len[i] + 'px', width: '40px', display: 'flex', justifyContent: 'center' } : { width: S.len[i] + 'px' },
    }, child);
    let body;
    if (spec.scenario === 'rating') {
      const stars = (v) => `${SC().fmt({ step: 0.5 }, v).replace(/\.0$/, '')} / ${spec.stars.n}`;
      body = [h('div', { className: 'sr-head', key: 'h' }, spec.scene.title), h('div', { className: 'sr-sub', key: 's' }, spec.scene.item),
        h('div', { className: 'sr-rate', key: 'g' }, spec.sliders.flatMap((s, i) => [
          h('div', { className: 'sr-label', key: 'l' + i }, s.label),
          h('div', { key: 't' + i, className: 'sr-track', 'data-role': 'track', 'data-slider': i, ref: (el) => { if (el) S.tracks[i] = el; } }, h(MuiRating, { S, i, value: values[i] })),
          h('div', { className: 'sr-readout', key: 'r' + i }, stars(values[i][0])),
        ]))];
    } else if (S.vertical) {
      body = h('div', { className: 'sr-row', style: { gap: S.colGap + 'px' } }, spec.sliders.map((s, i) => h('div', { className: 'sr-col', key: i },
        h('div', { className: 'sr-label', title: s.label }, s.label),
        track(i, h(Row, { S, i, value: values[i] })),
        readout(i))));
    } else {
      body = h('div', { className: 'sr-grid' + (S.readout ? '' : ' no-readout'), style: { rowGap: S.rowGap + 'px' } },
        spec.sliders.flatMap((s, i) => [h('div', { className: 'sr-label', key: 'l' + i }, s.label), track(i, h(Row, { S, i, value: values[i] })), readout(i)]));
    }
    return h('div', null, spec.presets ? h(PresetCard, { S }) : null, body);
  }

  function ticksOf(s) {
    const S = SC();
    const k = 4;
    return Array.from({ length: k + 1 }, (_, i) => Number((s.min + (i * (s.max - s.min)) / k).toFixed(S.decimals(s.step))));
  }

  // The thumbs / handles of slider i, in value order.
  function thumbsOf(S, i) {
    const t = S.tracks[i];
    if (!t) return [];
    if (S.engine === 'mui') return [...t.querySelectorAll('.MuiSlider-thumb')];
    return [...t.querySelectorAll('.rc-slider-handle')];
  }
  const railOf = (S, i) => S.tracks[i].querySelector(S.engine === 'mui' ? '.MuiSlider-rail' : '.rc-slider-rail');

  function bind(S, card) {
    const { ctx, spec } = S;
    const sig = { signal: S.abort.signal };
    const indexOf = (t) => {
      const tr = t && t.closest ? t.closest('[data-slider]') : null;
      return tr ? Number(tr.dataset.slider) : null;
    };
    // Track clicks: a press on a slider that is not on its handle.
    card.addEventListener('mousedown', (e) => {
      const i = indexOf(e.target);
      if (i === null || spec.scenario === 'rating') return;
      if (e.target.closest('.rc-slider-handle, .MuiSlider-thumb')) return;
      env.log('track-click', { what: spec.sliders[i].label, policy: spec.allowTrackClick ? 'jump' : 'forbidden' });
      if (!spec.allowTrackClick) ctx.flag('track-click');
    }, { capture: true, ...sig });
    // Keys: the libraries never see them; with spec.keys they step the focused slider like keyApply.
    card.addEventListener('keydown', (e) => {
      if (!KEYS.has(e.key)) return;
      const i = indexOf(document.activeElement);
      if (i === null) return;
      e.preventDefault();
      e.stopPropagation();
      if (!spec.keys || S.values[i].length !== 1) return;
      const nv = SC().keyApply(spec.sliders[i], S.values[i][0], e.key);
      if (nv !== S.values[i][0]) setValues(S, i, [nv]);
    }, { capture: true, ...sig });
    S.mount.addEventListener('focusin', (e) => {
      const i = indexOf(e.target);
      if (i !== null && spec.keys && ctx.model.focus !== i) ctx.update({ ...ctx.model, focus: i });
    }, sig);
    S.mount.addEventListener('focusout', (e) => {
      if (!(e.relatedTarget && S.mount.contains(e.relatedTarget)) && ctx.model.focus !== null && ctx.model.focus !== undefined) ctx.update({ ...ctx.model, focus: null });
    }, sig);
    if (spec.keys) {
      // rc-slider handles take focus on a press; MUI focuses its hidden input itself.
      card.addEventListener('mousedown', (e) => {
        const hd = e.target.closest && e.target.closest('.rc-slider-handle');
        if (hd) hd.focus({ preventScroll: true });
      }, { capture: true, ...sig });
    }
  }

  function render(ctx, engine) {
    const React = window.React;
    const ReactDOM = window.ReactDOM;
    const lib = engine === 'mui' ? window.MaterialUI : window.RcSlider;
    if (!React || !ReactDOM || !lib) throw new Error(`slider/${engine}: vendored React or the slider library is missing`);
    ctx.css('sr-style', CSS);
    if (R) {
      R.abort.abort();
      const old = R.root;
      R.root = null;
      if (old) old.unmount();
    }
    const { spec, rng, size } = ctx;
    const S = {
      ctx, spec, engine, tick: 0, tracks: {}, abort: new AbortController(),
      values: ctx.model.values.map((v) => v.slice()),
      vertical: !!spec.vertical, ticks: ticksOf,
    };
    const n = spec.sliders.length;
    const density = rng.pick(['normal', 'normal', 'dense', 'touch']);
    S.size = density === 'dense' ? 'small' : 'medium';
    S.labels = engine === 'mui' && rng.bool(0.35) && !spec.showValue && !spec.norm;
    S.readout = spec.scenario === 'rating' || (!S.labels && (rng.bool(0.6) || spec.showValue || spec.norm));
    S.marks = rng.bool(0.4) && !spec.presets;
    // Something must show the values: a readout when there are neither value labels nor marks / stop names.
    if (!S.labels && !S.readout && !S.marks && !spec.sliders.every((s) => s.stops)) S.readout = true;
    S.dots = rng.bool(0.4);
    S.presetTitle = rng.pick(['Presets', 'Saved presets', 'Profiles', 'Scenes']);
    S.starColor = rng.pick(['#faaf00', '#f59f00', 'var(--accent)']);
    const look = engine === 'rcslider' ? rng.pick(['round', 'round', 'square', 'filled']) : null;
    // Sizes: track lengths from the stage (horizontal: room for label, readout and padding; vertical: for the
    // label and readout above / below; log tracks >= 440 px keep 1 px of travel below the tolerance).
    const presetsH = spec.presets ? 40 + 26 * (spec.presets.length + 1) : 0;
    const hang = Math.max(0, ...spec.sliders.filter((s) => s.stops).map((s) => Math.max(s.stops[0].length, s.stops[s.stops.length - 1].length) * 4.2));
    const maxV = Math.max(220, Math.min(420, Math.floor(size.height) - 190 - presetsH));
    const room = Math.floor(size.width) - 120 - 96 - 26 - (S.readout ? 154 : 0) - 2 * Math.ceil(hang);
    const maxH = Math.max(320, Math.min(760, room));
    const minH = (s) => (s.log ? 440 : s.stops ? Math.max(260, (s.stops.length - 1) * 64) : 320);
    const rl = (s) => (S.vertical ? rng.int(Math.min(240, maxV), maxV) : rng.int(Math.min(minH(s), maxH), Math.max(minH(s), maxH)));
    const anyLog = spec.sliders.some((s) => s.log);
    const shared = rl(anyLog ? { log: true } : spec.sliders.find((s) => s.stops) || {});
    S.len = spec.sliders.map((s) => (spec.norm || S.vertical ? shared : rl(s)));
    S.colGap = n >= 6 ? rng.int(34, 50) : rng.int(56, 90);
    const labelRoom = S.labels ? 34 : 0;
    S.rowGap = Math.max(42, Math.min(66, Math.floor((size.height - 100 - presetsH) / n) - 46)) + labelRoom;
    const hs = density === 'dense' ? 12 : density === 'touch' ? rng.int(24, 30) : rng.int(14, 18);
    const card = ctx.util.el('div', `sr-card sr-${engine}` + (S.vertical ? ' vertical' : '') + (density === 'dense' ? ' dense' : '')
      + (look ? ` sr-${look}` : ''), ctx.stage);
    card.style.setProperty('--sr-hs', hs + 'px');
    card.style.setProperty('--sr-rail', (density === 'dense' ? 2 : density === 'touch' ? 8 : rng.int(4, 6)) + 'px');
    if (density === 'touch') card.style.fontSize = '16px';
    if (hang && !S.vertical) card.style.paddingLeft = card.style.paddingRight = 36 + Math.ceil(hang) + 'px';
    if (!S.vertical && S.labels) card.style.paddingTop = '56px';
    if (S.vertical && (S.marks || spec.sliders.some((s) => s.stops))) card.style.paddingRight = 96 + Math.ceil(hang) + 'px';
    if (!S.vertical && (S.marks || spec.sliders.some((s) => s.stops))) card.style.paddingBottom = '54px';
    S.card = card;
    S.mount = ctx.util.el('div', '', card);
    R = S;
    // MUI runs on a legacy root (ReactDOM.render, as under React 17, which MUI 5 supports): every update there
    // commits within its event, so Rating's hover (set on mousemove) is in place when a click follows at once.
    // On a concurrent root the hover commits a task later and a quick click takes the whole star under it.
    const mount = S.mount;
    S.root = engine === 'mui'
      ? { render: (el) => ReactDOM.render(el, mount), unmount: () => ReactDOM.unmountComponentAtNode(mount) }
      : ReactDOM.createRoot(mount);
    card.style.width = 'max-content';
    draw(S);
    // Long labels at a large font: shorten the horizontal tracks until the card fits the stage.
    const excess = card.offsetWidth - (Math.floor(size.width) - 24);
    if (excess > 0 && !S.vertical && spec.scenario !== 'rating') {
      S.len = S.len.map((l) => Math.max(220, l - excess));
      draw(S);
    }
    placeIn(ctx, card, rng);
    bind(S, card);
    return {
      anchors: spec.sliders.map((_, i) => S.tracks[i]),
      sync(m) {
        if (R !== S) return;
        S.values = m.values.map((v) => v.slice());
        draw(S);
      },
    };
  }

  function locate(t) {
    const S = R;
    const i = t.slider;
    if (i === undefined || !S.tracks[i]) throw new Error(`slider/${S && S.engine} cannot locate ${JSON.stringify(t)}`);
    const s = S.spec.sliders[i];
    if (S.spec.scenario === 'rating') {
      // Star k spans [left + (k-1) w, left + k w]; MUI rounds max * x + precision / 2 to the precision.
      const r = rectOf(S.tracks[i].querySelector('.MuiRating-root'));
      const w = r.width / s.max;
      const v = t.value !== undefined ? t.value : Math.max(s.step, S.values[i][0]);
      const k = Math.ceil(v - 1e-9);
      const half = Math.abs(v - Math.round(v)) > 1e-9;
      const off = s.step < 1 ? (half ? 0.25 : 0.75) : 0.5;
      return [r.left + (k - 1 + off) * w, r.top + r.height / 2];
    }
    if (t.value === undefined) return center(thumbsOf(S, i)[t.thumb || 0]);
    const r = rectOf(railOf(S, i));
    let f = SC().frac(s, t.value);
    if (s.log) f = Math.round(f * POS) / POS;
    return S.vertical ? [r.left + r.width / 2, r.bottom - f * r.height] : [r.left + f * r.width, r.top + r.height / 2];
  }

  const def = (name) => env.widgetOf('set-slider', name);
  if (def('rcslider')) Object.assign(def('rcslider'), { render: (ctx) => render(ctx, 'rcslider'), locate });
  if (def('mui')) Object.assign(def('mui'), { render: (ctx) => render(ctx, 'mui'), locate });
})();
