/*
 * pick-color/picker: the live picker of color/L1 (24 sites); swatch and hex.
 * Defaults reproduce design-pick-color-swatch-01 (lineage medoid); the hex preset reproduces
 * design-pick-color-hex-03. Wheel/RGB registrations, illustrations and unreachable scenarios were dead.
 * CSS is retained byte for byte, including the reference selectors, for cascade/screenshot parity.
 *
 * Variation inventory (swatch/hex counts, out of 12 each): instrument/custom panels 11/0,
 * side layout 1/12; sampled size+radius+strip+knob 1/10, radius+strip+knob only 0/2;
 * sampled side width 1/12, side-left draw 1/10, placeCard 1/10; reversed hue 2/2;
 * measured control spans 0/3; no inline SV/hue size 0/2; no inline knob size 0/2;
 * extra target+current HEX/RGB/HSV tables 0/2; fixed side-current caption 1/9;
 * current numeric readouts 12/12; reset/clear bindings 3/7. Each geometry is otherwise unique.
 * Swatch's preset keeps its instrument path; hex's preset contains its shared side path, sampling,
 * caption and placement. Its CSS, row style and reset event select its concrete default design.
 * One-off migration map (numbers are design suffixes):
 * swatch-02: sideLayout and custom Lab conversion; -03: axes and instrumentExtra;
 * -04: HSL panelPaint, instrumentExtra and initial-state delta; -05: axes and extra swatch;
 * -06: axes, numeric groups and buttons; -07: ring hue, value strip and custom layout;
 * -08/-09: custom layouts and numeric rows; -10: positioned fields and inspector mirrors;
 * -11: reference-pixel annotations, preview swatches and measured flag; -12: frame hosts,
 * horizontal hue preceding SV, preview panel and HSL paint.
 * hex-02: rectangular fit and notebook strip; -03: CSS/boxed editable rows/reset event;
 * -04: two panels, target/readout and colored markers; -05: parsed target HSV and current HSV;
 * -06: CSS calc markers, readout groups, quick swatches and reset; -07: margin target,
 * HTML readout, unconditional offset draws and presets; -08: read-only control/footer mirrors;
 * -09: legends, quick presets and numeric rows; -10: em-based fit, external info/sliders/reset;
 * -12: brief target, preferences mirror and locate navigation gate.
 *
 * Tokens (defaults below in TOKENS; objects replace the entire value):
 * css: extra CSS (''), layout: instruments|side ('instruments'), axes: draw axes (true).
 * sampleSize/sampleControls: consume original size / radius-strip-knob draws (false/false).
 * sidePlacement: none|sample ('none'); place: sample card offsets (false).
 * reverseHue: hue increases upward (false); measured: use DOM control spans (false).
 * horizontalHue/hueFirst: horizontal strip / build hue before SV (false/false; swatch-12).
 * svStyle/hueStyle/knobStyle: inline style override (null: geometry-derived style).
 * targetLabel: side-target caption (null: spec.targetLabel); targetClass/currentClass: side classes ('').
 * sideCurrentLabel: caption (null: sampled); drawCurrentLabel: keep its draw (true).
 * sideRows: none|rows|values ('none'); editableRows: fields replace row cells (false).
 * prependCurrent: move current before target (false); forceTarget: show hex target regardless (false).
 * targetSwatch: extra cp-target-swatch (false); targetCode: code|hex ('code').
 * targetParent: selector for external target (null); toleranceText: prefix/suffix pair (null).
 * unitHeight: --cp-unit height divisor (null); resetEvent: document reset event (null).
 * clear: install widget.clear restoring the whole initial model (false).
 * resetSelector/resetScope/resetWhole/resetLog: optional reset button selector (null), search scope
 *   document|shell ('document'), restore all model fields (false), [event,data] log (null).
 * upperReadout: uppercase current hex (false); panelFields: instrument fields (RGB, HEX, Lab).
 * panelSuffix: field-label suffix ('   :'); targetUpper: uppercase instrument caption (true).
 * currentLabel/pickerLabel: instrument captions ('CURRENT'/'COLOR PICKER').
 *
 * Parts (all called through P; overrides are (base, S) => replacement):
 * style(ctx): install CSS; card(ctx)->el: create the card; begin(ctx,card): unit/reset setup.
 * layout(ctx,card): populate S.st.controls/side; sideLayout(ctx,card): sampled side path.
 * limits(ctx,sideW)->{maxH,maxW}: stage allowance; sideLeft(ctx)->bool: original placement draw.
 * fit(ctx,host,maxH)->geo: control W/H/hueW/hueH/radius/knob (keep original RNG draws).
 * axes(ctx,host,geo): annotations; hit(ctx,el,kind,geo): position each hit area (noop).
 * svStyle(geo), hueStyle(geo), knobStyle(geo)->object: resolve inline control styles.
 * hueGeometry(ctx,el,geo)->{start,end}: slider span; huePlace(bar,el,fraction,geo): bar position.
 * picker(ctx,host,maxH,maxW)->controls: SV and hue;
 * hue(ctx,host,geo)->{el,bar?,bind?,set,locate,paint,locateExtra?}: build the hue DOM, then bind
 *   its slider after the SV pad; optional locateExtra(target,model) handles an extra value strip.
 * svRect(el,geo)->rect: pad span; markers(ctx,knob,hue,model,geo): paint SV marker (hue hook noop).
 * controlsPaint(ctx,model,geo): extra control readouts (noop).
 * panel(ctx,card,label)->{panel,swatch,fields}: instrument panel; panelPaint(panel,rgb): its values.
 * pickerHost(ctx,card)->el: middle instrument panel; instrumentExtra(ctx,card,target,current,host)
 *   ->paint(model,rgb): additional instrument readouts (noop).
 * instrumentSide(ctx,target,current,paint)->side: current paint, anchors and delta readout.
 * side(ctx,parent,width,targetHost?)->side: target/current/fields; target(ctx,side,targetHost): target block.
 * current(ctx,side)->view: current block {cur,current,rows}; readout(ctx,view)->{el,paint}.
 * fields(ctx,view,out): editable controls; fieldBox(ctx,view)->el and fieldRow(ctx,view,box,key)->el.
 * currentReady(ctx,side,view): after fields (prepend by token); currentPaint(ctx,view,model,rgb): tables.
 * rows(ctx,parent)->cells: seven boxed readouts; rowsPaint(cells,hsv,rgb): fill them.
 * values(ctx,parent,rgb,hsv?)->cells: HEX/RGB/HSV definition list (hsv omitted: initially empty).
 * sidePaint(ctx,view,model,rgb): extra mirrors (noop); rendered(ctx,card): before first paint (noop).
 * placeCard(card,ctx): original offset draws; afterPaint(ctx,card): placement/clear, after first paint.
 * bindReset(ctx): bind the configured reset button (default: nothing), before placement.
 * locate(target)->point: field or pointer target. Replace for navigation obstacles.
 * S exposes live st (settable), ctx, spec, D, P, math, task, commit(), commitRgb(), paintAll().
 * Each render gets fresh state; document reset listeners are removed before replacement.
 */
(function () {
  'use strict';

  const CSS = `
  .cp { display: flex; align-items: flex-start; gap: 12px; padding: 14px; border: 1px solid var(--line);
        border-radius: 12px; background: var(--panel); box-shadow: 0 1px 3px rgba(0,0,0,.06); position: relative; }
  .cp-hit { position: relative; padding: 8px; cursor: crosshair; touch-action: none; }
  .cp-sv, .cp-hue { position: relative; }
  .cp-sv-layer { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; }
  .cp-sv-white { background: linear-gradient(to right, #fff, rgba(255,255,255,0)); }
  .cp-sv-black { background: linear-gradient(to top, #000, rgba(0,0,0,0)); }
  .cp-hue { background: linear-gradient(to bottom, #f00 0%, #ff0 16.667%, #0f0 33.333%, #0ff 50%, #00f 66.667%, #f0f 83.333%, #f00 100%); }
  .cp-knob { position: absolute; border: 2px solid #fff; border-radius: 50%;
             box-shadow: 0 0 0 1px rgba(0,0,0,.6), inset 0 0 0 1px rgba(0,0,0,.25); pointer-events: none; }
  .cp-bar { position: absolute; left: -5px; right: -5px; height: 8px; margin-top: -4px; border: 2px solid #fff;
            border-radius: 4px; box-shadow: 0 0 0 1px rgba(0,0,0,.6); pointer-events: none; }
  .cp-hbar { position: absolute; top: -5px; bottom: -5px; width: 8px; margin-left: -4px; border: 2px solid #fff;
             border-radius: 4px; box-shadow: 0 0 0 1px rgba(0,0,0,.6); pointer-events: none; }
  .cp-ctl { display: flex; gap: 6px; align-items: flex-start; }
  .cp-ctl.col { flex-direction: column; align-items: center; }
  .cp-disc { position: relative; border-radius: 50%; }
  .cp-disc-layer { position: absolute; inset: 0; border-radius: 50%; pointer-events: none; }
  .cp-ring { position: absolute; width: 14px; height: 14px; margin: -7px 0 0 -7px; border: 2px solid #fff; border-radius: 50%;
             box-shadow: 0 0 0 1px rgba(0,0,0,.7); pointer-events: none; }
  .cp-rgb { display: flex; flex-direction: column; gap: 14px; padding: 6px 4px; }
  .cp-rgb.cols { flex-direction: row; gap: 18px; }
  .cp-row { display: flex; align-items: center; gap: 10px; }
  .cp-rgb.cols .cp-row { flex-direction: column-reverse; gap: 6px; }
  .cp-ch { width: 16px; color: var(--muted); font-weight: 700; font-size: 13px; text-align: center; }
  .cp-track { position: relative; border-radius: 6px; box-shadow: inset 0 0 0 1px rgba(0,0,0,.15); }
  .cp-num { min-width: 34px; font: 13px ui-monospace, Menlo, Consolas, "DejaVu Sans Mono", monospace; color: var(--fg); text-align: right; }
  .cp-thumb { position: absolute; width: 14px; height: 26px; margin: -13px 0 0 -7px; border-radius: 4px;
              background: #fff; box-shadow: 0 0 0 1px rgba(0,0,0,.55), 0 1px 3px rgba(0,0,0,.3); pointer-events: none; }
  .cp-rgb.cols .cp-thumb { width: 26px; height: 14px; margin: -7px 0 0 -13px; }
  .cp-side { display: flex; flex-direction: column; gap: 12px; padding: 6px 6px 6px 12px; }
  .cp-label { margin-bottom: 5px; color: var(--muted); font-size: 12px; font-weight: 600;
              letter-spacing: .06em; text-transform: uppercase; }
  .cp-swatch { height: 60px; border: 1px solid var(--line); border-radius: 8px;
               box-shadow: inset 0 0 0 1px rgba(255,255,255,.15); }
  .cp-swatch.small { height: 46px; }
  .cp-code { display: flex; align-items: center; justify-content: center; height: 52px; padding: 0 8px; border: 1px dashed var(--line);
             border-radius: 8px; font: 600 17px ui-monospace, Menlo, Consolas, "DejaVu Sans Mono", monospace; letter-spacing: .02em;
             white-space: nowrap; }
  .cp-hex { margin-top: 6px; color: var(--fg); font: 14px ui-monospace, Menlo, Consolas, "DejaVu Sans Mono", monospace; }
  .cp-hex::before { content: 'HEX'; margin-right: 8px; color: var(--muted); font-size: 11px; }
  .cp-fields { display: flex; flex-direction: column; gap: 8px; }
  .cp-frow { display: flex; align-items: center; gap: 6px; }
  .cp-flab { color: var(--muted); font-size: 12px; font-weight: 600; min-width: 26px; }
  .cp-in { box-sizing: border-box; height: 30px; padding: 0 8px; border: 1px solid var(--line); border-radius: 6px;
           background: var(--bg); color: var(--fg); font: 14px ui-monospace, Menlo, Consolas, "DejaVu Sans Mono", monospace; }
  .cp-in:focus { outline: 2px solid var(--accent); outline-offset: 0; }
  .cp-in.hex { width: 100%; }
  .cp-in.ch { flex: 1 1 0; width: 0; min-width: 0; text-align: center; }
  .cp-presets { display: grid; gap: 6px; }
  .cp-preset { position: relative; border-radius: 6px; border: 1px solid rgba(0,0,0,.18); cursor: pointer; }
  .cp-preset.on { outline: 2px solid var(--accent); outline-offset: 2px; }
  .cp-preset-name { display: block; margin-top: 2px; font-size: 10px; color: var(--muted); text-align: center;
                    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cp-img { display: block; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; }
  .cp-img.picking { cursor: crosshair; }
  .cp-img .pin { pointer-events: none; }
  .cp-tool { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border: 1px solid var(--line);
             border-radius: 6px; background: var(--bg); color: var(--fg); font: inherit; font-size: 13px; cursor: pointer; }
  .cp-tool.on { background: var(--accent); border-color: var(--accent); color: #fff; }
  `;
  const ROW_CSS = `.design .cp { position: absolute; inset: 0; display: block; padding: 0; border: 0; border-radius: 0; background: transparent; box-shadow: none; }
  .design .cp .cp-hit { position: absolute; padding: 0; top: 4.72%; height: 91.77%; }
  .design .cp .cp-hit[data-role=sv] { left: 4.78%; width: 45.1%; }
  .design .cp .cp-hit[data-role=hue] { left: 51.8%; width: 3.53%; }
  .cp-sv, .cp-hue { width: 100%; height: 100%; }
  .design .cp .cp-knob { width: 4.9cqh; height: 4.9cqh; margin: -2.45cqh 0 0 -2.45cqh; border: 2px solid #fff; box-shadow: 0 0 0 1px rgba(0,0,0,.25); }
  .design .cp .cp-bar { left: -5px; right: -5px; height: 12px; margin-top: -6px; border: 0; border-radius: 6px; background: #fff; box-shadow: 0 0 4px rgba(0,0,0,.5); }
  .design .cp .cp-side { position: absolute; inset: 0; width: auto !important; padding: 0; display: block; pointer-events: none; }
  .cp-pn { position: absolute; top: 4.2%; width: 16.2%; }
  .cp-current { left: 59.15%; }
  .cp-target { left: 80.5%; }
  .cp-div { position: absolute; left: 78%; top: 6%; height: 88%; width: 2px; background: #3a3a3a; }
  .design .cp .cp-label { font-size: calc(2.55 * var(--cp-unit)); font-weight: 600; color: #fff; text-transform: none; letter-spacing: 0; margin: 0 0 2.4cqh; line-height: 1.2; }
  .design .cp .cp-swatch { height: calc(15.5 * var(--cp-unit)); border: 0; border-radius: 8px; box-shadow: none; }
  .cp-rows { margin-top: calc(3 * var(--cp-unit)); }
  .cp-r { display: flex; align-items: center; height: calc(5.75 * var(--cp-unit)); margin-bottom: calc(.95 * var(--cp-unit)); background: linear-gradient(115deg,#252525,#212121); border: 1px solid #343434; border-radius: 5px; font-size: calc(2.55 * var(--cp-unit)); color: #f0f0f0; }
  .cp-rk { width: 38%; padding-left: 7%; color: #9a9a9a; }
  .cp-pn { top: 5.7%; }
  .design .cp .cp-label { margin-bottom: calc(1.25 * var(--cp-unit)); letter-spacing: -.045cqh; }
  .cp-editable-rows { display: block; }
  .cp-editable-rows .cp-frow { gap: 0; }
  .cp-editable-rows .cp-flab { width: 38%; padding-left: 7%; flex: none; font: inherit; }
  .cp-editable-rows .cp-in { pointer-events: auto; min-width: 0; width: 62%; height: 100%; padding: 0 4px 0 0; border: 0; border-radius: 0; background: transparent; color: #f0f0f0; font: inherit; text-align: left; }
  .cp-hex { display: none; }
  `;

  const TOKENS = {
    css: '', layout: 'instruments', axes: true, sampleSize: false, sampleControls: false,
    sidePlacement: 'none', place: false, reverseHue: false, measured: false,
    horizontalHue: false, hueFirst: false,
    svStyle: null, hueStyle: null, knobStyle: null,
    targetLabel: null, targetClass: '', currentClass: '', sideCurrentLabel: null, drawCurrentLabel: true,
    sideRows: 'none', editableRows: false, prependCurrent: false, forceTarget: false,
    targetSwatch: false, targetCode: 'code', targetParent: null, toleranceText: null,
    unitHeight: null, resetEvent: null, clear: false, upperReadout: false,
    resetSelector: null, resetScope: 'document', resetWhole: false, resetLog: null,
    panelFields: ['RGB', 'HEX', 'Lab'], panelSuffix: '   :', targetUpper: true,
    currentLabel: 'CURRENT', pickerLabel: 'COLOR PICKER',
  };
  const SCENARIOS = {
    swatch: { layout: 'instruments' },
    hex: {
      layout: 'side', axes: false, sampleSize: true, sampleControls: true,
      sidePlacement: 'sample', place: true, measured: true,
      svStyle: { width: '100%', height: '100%', borderRadius: '8px' },
      hueStyle: { width: '100%', height: '100%', borderRadius: '9px' }, knobStyle: {},
      targetLabel: 'Target Color', targetClass: 'cp-pn cp-target', currentClass: 'cp-pn cp-current',
      sideCurrentLabel: 'Current Color', sideRows: 'rows', editableRows: true,
      unitHeight: 78.85, resetEvent: 'cp-reset', css: ROW_CSS,
    },
  };

  env.template('pick-color/picker', (design, def) => {
    let D, P, st, resetFn;
    const BASE = {};
    const F = () => env.taskDef;
    const M = () => env.taskDef.helpers.math;
    const S = {
      get st() { return st; }, set st(value) { st = value; },
      get ctx() { return st.ctx; }, get spec() { return st.ctx.spec; },
      get D() { return D; }, get P() { return P; }, get math() { return M(); }, get task() { return F(); },
      commit(part) { st.ctx.update({ ...st.ctx.model, ...part }); S.paintAll(); },
      commitRgb(rgb, extra = {}) { S.commit({ ...M().rgbToHsv(rgb), ...extra }); },
      paintAll() { if (st) { st.controls.paint(st.ctx.model); st.side.paint(st.ctx.model); } },
    };
    BASE.style = () => {
      if (document.getElementById('cpk-style')) return;
      const s = document.createElement('style');
      s.id = 'cpk-style'; s.textContent = CSS + D.css; document.head.append(s);
    };
    BASE.card = (ctx) => {
      const card = ctx.util.el('div', 'cp', ctx.stage);
      card.style.fontFamily = 'inherit';
      return card;
    };
    BASE.begin = (ctx, card) => {
      if (D.unitHeight) card.style.setProperty('--cp-unit', `min(1cqh, ${ctx.size.height / D.unitHeight}px)`);
      if (D.resetEvent) {
        const init = { h: ctx.model.h, s: ctx.model.s, v: ctx.model.v };
        if (resetFn) document.removeEventListener(D.resetEvent, resetFn);
        resetFn = () => S.commit({ ...init });
        document.addEventListener(D.resetEvent, resetFn);
      }
    };
    BASE.fit = (ctx, card, maxH) => {
      const minPx = F().helpers.MIN_TRACK_PX;
      if (D.sampleControls) {
        const W = D.sampleSize ? Math.max(minPx, Math.min(ctx.rng.int(230, 320), maxH)) : minPx;
        const radius = ctx.rng.pick([2, 4, 6]);
        const hueW = ctx.rng.int(20, 30);
        const knob = ctx.rng.int(12, 16);
        return { W, H: W, hueH: W, hueW, radius, knob };
      }
      const bounds = card.getBoundingClientRect();
      const W = Math.max(minPx, Math.floor(Math.min(bounds.width * .655, bounds.height * .916)));
      const H = Math.round(W * .994);
      return { W, H, hueH: H - 5, radius: 0, hueW: Math.round(bounds.width * .101),
        knob: Math.max(18, Math.round(W * .068)), bounds };
    };
    BASE.axes = (ctx, card, g) => {
      if (!D.axes) return;
      const { util } = ctx;
      const { W, H, hueW } = g;
      const axis = util.el('div', 'sv-axis', card);
      Object.assign(axis.style, { top: Math.round(H * .04) + 'px', height: Math.round(H * .925) + 'px', bottom: 'auto' });
      util.el('div', 'axis-arrow up', axis);
      util.el('div', 'axis-label', axis, 'Value (Brightness)');
      util.el('div', 'axis-arrow down', axis);
      const saturation = util.el('div', 'saturation-axis', card);
      Object.assign(saturation.style, { top: Math.round(H + W * .027) + 'px', bottom: 'auto' });
      util.el('span', 'horizontal-arrow left', saturation);
      util.el('span', '', saturation, 'Saturation');
      util.el('span', 'horizontal-arrow right', saturation);
      const hueLabel = util.el('div', 'hue-label', card, 'Hue');
      Object.assign(hueLabel.style, { width: hueW + 'px', top: Math.round(H + W * .025) + 'px', bottom: 'auto' });
    };
    BASE.hit = () => {};
    BASE.svRect = (el, g) => {
      const r = el.getBoundingClientRect();
      return { left: r.left, top: r.top, width: (D.measured ? r.width : g.W) - 1,
        height: (D.measured ? r.height : g.H) - 1 };
    };
    BASE.markers = (ctx, knob, hue, m, g) => {
      const r = P.svRect(knob.parentElement, g);
      Object.assign(knob.style, { left: m.s * r.width + 'px', top: (1 - m.v) * r.height + 'px' });
    };
    BASE.controlsPaint = () => {};
    BASE.svStyle = (g) => D.svStyle || { width: g.W + 'px', height: g.H + 'px', borderRadius: g.radius + 'px' };
    BASE.hueStyle = (g) => D.hueStyle || { width: g.hueW + 'px', height: g.hueH + 'px', borderRadius: Math.min(g.radius, 4) + 'px' };
    BASE.knobStyle = (g) => D.knobStyle || { width: g.knob + 'px', height: g.knob + 'px', margin: `${-g.knob / 2}px 0 0 ${-g.knob / 2}px` };
    BASE.hueGeometry = (ctx, hue, g) => {
      const r = hue.getBoundingClientRect();
      const length = (D.measured ? (D.horizontalHue ? r.width : r.height) : (D.horizontalHue ? g.hueW : g.hueH)) - 1;
      const start = D.horizontalHue ? [r.left, r.top + r.height / 2] : [r.left + r.width / 2, r.top];
      const end = D.horizontalHue ? [r.left + length, start[1]] : [start[0], r.top + length];
      return D.reverseHue ? { start: end, end: start } : { start, end };
    };
    BASE.huePlace = (bar, hue, f, g) => {
      const length = (D.measured ? (D.horizontalHue ? hue.getBoundingClientRect().width : hue.getBoundingClientRect().height) : (D.horizontalHue ? g.hueW : g.hueH)) - 1;
      bar.style[D.horizontalHue ? 'left' : 'top'] = (D.reverseHue ? 1 - f : f) * length + 'px';
    };
    BASE.hue = (ctx, card, g) => {
      const { util, spec } = ctx;
      const hit = util.el('div', 'cp-hit', card);
      hit.dataset.role = 'hue';
      P.hit(ctx, hit, 'hue', g);
      const hue = util.el('div', 'cp-hue', hit);
      Object.assign(hue.style, P.hueStyle(g));
      const bar = util.el('div', D.horizontalHue ? 'cp-hbar' : 'cp-bar', hue);
      let ctl;
      const bind = () => { ctl = env.ui.slider(hit, {
        label: 'hue', thumbs: [bar], values: [ctx.model.h], min: 0, max: 360, keyboard: !!spec.keys,
        geometry: () => P.hueGeometry(ctx, hue, g),
        place: (el, point, f) => P.huePlace(el, hue, f, g),
        onInput([h]) { S.commit({ h }); },
      }); };
      return { el: hue, bar, bind, set: (v) => ctl.set(v), locate: (v) => ctl.locate(v), paint() {} };
    };
    BASE.picker = (ctx, card, maxH, maxW) => {
      const { util } = ctx;
      const g = P.fit(ctx, card, maxH);
      P.axes(ctx, card, g);
      let hue = D.hueFirst ? P.hue(ctx, card, g) : null;
      const hit = util.el('div', 'cp-hit', card);
      hit.dataset.role = 'sv';
      P.hit(ctx, hit, 'sv', g);
      const sv = util.el('div', 'cp-sv', hit);
      Object.assign(sv.style, P.svStyle(g));
      util.el('div', 'cp-sv-layer cp-sv-white', sv);
      util.el('div', 'cp-sv-layer cp-sv-black', sv);
      const knob = util.el('div', 'cp-knob', sv);
      Object.assign(knob.style, P.knobStyle(g));
      if (!hue) hue = P.hue(ctx, card, g);
      const pad = env.ui.pad(hit, {
        label: 'sv', rect: () => P.svRect(sv, g), value: [ctx.model.s, 1 - ctx.model.v],
        onInput([u, v]) { S.commit({ s: u, v: 1 - v }); },
      });
      if (hue.bind) hue.bind();
      return {
        anchors: [sv, hue.el],
        paint(m) {
          sv.style.backgroundColor = `hsl(${m.h} 100% 50%)`;
          P.markers(ctx, knob, hue, m, g);
          pad.set([m.s, 1 - m.v]); hue.set([m.h]); hue.paint(m);
          P.controlsPaint(ctx, m, g);
        },
        locate(t, m) {
          if (t.surface === 'sv') {
            const [s, v] = t.current ? [m.s, m.v] : [t.s, t.v];
            return pad.locate([s, 1 - v]);
          }
          if (t.surface === 'hue') return hue.locate(t.current ? m.h : t.h);
          if (hue.locateExtra) return hue.locateExtra(t, m);
          return null;
        },
      };
    };

    BASE.panel = (ctx, card, label) => {
      const { util } = ctx;
      const panel = util.el('section', 'instrument-panel', card);
      const heading = util.el('div', 'panel-label', panel);
      util.el('span', '', heading, label);
      const swatch = util.el('div', 'cp-swatch', panel);
      const values = util.el('dl', 'color-values', panel);
      const fields = {};
      for (const name of D.panelFields) {
        util.el('dt', '', values, name + D.panelSuffix);
        fields[name] = util.el('dd', '', values);
      }
      return { panel, swatch, fields };
    };
    BASE.panelPaint = (panel, rgb) => {
      panel.swatch.style.background = M().hex(rgb);
      panel.fields.RGB.textContent = rgb.map(c => Math.round(c).toString().padStart(3)).join(' ');
      panel.fields.HEX.textContent = M().hex(rgb);
      panel.fields.Lab.textContent = M().srgbToLab(rgb).map(c => c.toFixed(1).padStart(5)).join(' ');
    };
    BASE.pickerHost = (ctx, card) => {
      const middle = ctx.util.el('section', 'instrument-panel picker-panel', card);
      const heading = ctx.util.el('div', 'panel-label', middle);
      ctx.util.el('span', '', heading, D.pickerLabel);
      return ctx.util.el('div', 'picker-controls', middle);
    };
    BASE.instrumentExtra = () => () => {};
    BASE.instrumentSide = (ctx, target, current, extra) => ({
      anchors: [target.swatch, current.swatch], locators: {},
      paint(m) {
        const rgb = M().modelRgb(m);
        P.panelPaint(current, rgb); extra(m, rgb);
        const delta = document.querySelector('[data-role="color-difference"]');
        if (delta) delta.textContent = F().error(m, ctx.spec).toFixed(1);
      },
    });
    BASE.layout = (ctx, card) => {
      if (D.layout === 'side') return P.sideLayout(ctx, card);
      const label = ctx.spec.targetLabel;
      const target = P.panel(ctx, card, D.targetUpper ? label.toUpperCase() : label);
      const host = P.pickerHost(ctx, card);
      const current = P.panel(ctx, card, D.currentLabel);
      const extra = P.instrumentExtra(ctx, card, target, current, host);
      P.panelPaint(target, ctx.spec.rgb);
      st.controls = P.picker(ctx, host, ctx.size.height, ctx.size.width);
      st.side = P.instrumentSide(ctx, target, current, extra);
    };
    BASE.limits = (ctx, sideW) => ({ maxH: Math.floor(ctx.size.height) - 76, maxW: Math.floor(ctx.size.width) - sideW - 80 });
    BASE.sideLeft = (ctx) => D.sidePlacement === 'sample' ? ctx.rng.bool(.25) : false;
    BASE.sideLayout = (ctx, card) => {
      const sideW = ctx.rng.int(160, 190);
      const { maxH, maxW } = P.limits(ctx, sideW);
      const left = P.sideLeft(ctx);
      let sideHost = null;
      if (left) sideHost = ctx.util.el('div', '', card);
      st.controls = P.picker(ctx, card, maxH, maxW);
      st.side = P.side(ctx, sideHost || card, sideW);
      if (sideHost) sideHost.replaceWith(sideHost.firstChild);
    };
    BASE.rows = (ctx, parent) => {
      const box = ctx.util.el('div', 'cp-rows', parent), out = {};
      for (const k of ['HEX', 'H', 'S', 'V', 'R', 'G', 'B']) {
        const r = ctx.util.el('div', 'cp-r', box);
        ctx.util.el('span', 'cp-rk', r, k);
        out[k] = ctx.util.el('span', 'cp-rv', r, '');
      }
      return out;
    };
    BASE.rowsPaint = (rows, hsv, rgb) => {
      const vals = { HEX: M().hex(rgb).toUpperCase(), H: Math.round(hsv.h) + '°',
        S: Math.round(hsv.s * 100) + '%', V: Math.round(hsv.v * 100) + '%', R: rgb[0], G: rgb[1], B: rgb[2] };
      for (const k in rows) rows[k].textContent = String(vals[k]);
    };
    BASE.values = (ctx, parent, rgb, hsv) => {
      const dl = ctx.util.el('dl', 'color-values', parent);
      const rows = ['HEX', 'R', 'G', 'B', 'H', 'S', 'V'].map((key) => {
        ctx.util.el('dt', '', dl, key);
        return ctx.util.el('dd', '', dl);
      });
      if (hsv) {
        const values = [M().hex(rgb), ...rgb, Math.round(hsv.h) + '°', Math.round(hsv.s * 100) + '%', Math.round(hsv.v * 100) + '%'];
        rows.forEach((row, i) => { row.textContent = String(values[i]); });
      }
      return rows;
    };
    BASE.target = (ctx, side, targetHost) => {
      const { util, spec } = ctx;
      const showTarget = spec.scenario === 'swatch';
      if (!showTarget && !spec.showCode && !D.forceTarget) return;
      const t = util.el('div', D.targetClass, D.targetParent ? document.querySelector(D.targetParent) : targetHost || side);
      util.el('div', 'cp-label', t, D.targetLabel ?? spec.targetLabel);
      if (D.targetSwatch) util.el('div', 'cp-target-swatch', t).style.background = spec.hex;
      if (D.sideRows === 'rows') {
        util.el('div', 'cp-swatch', t).style.background = spec.hex;
        const rgb = M().fromHex(spec.hex);
        P.rowsPaint(P.rows(ctx, t), M().rgbToHsv(rgb), rgb);
        util.el('div', 'cp-div', side);
      } else {
        if (showTarget) util.el('div', 'cp-swatch', t).style.background = spec.hex;
        else util.el('div', 'cp-code', t, spec[D.targetCode]);
        if (D.toleranceText) util.el('div', 'cp-tolerance', t, D.toleranceText[0] + F().tolerance(spec).tau + D.toleranceText[1]);
        if (D.sideRows === 'values') P.values(ctx, t, spec.rgb, spec.goal);
      }
    };
    BASE.current = (ctx, side) => {
      const cur = ctx.util.el('div', D.currentClass, side);
      const sampled = D.drawCurrentLabel ? ctx.rng.pick(['Current', 'Selected', 'New color', 'Preview']) : null;
      ctx.util.el('div', 'cp-label', cur, D.sideCurrentLabel ?? sampled);
      const current = ctx.util.el('div', 'cp-swatch', cur);
      return { cur, current, rows: D.sideRows === 'rows' ? P.rows(ctx, cur) : {} };
    };
    BASE.readout = (ctx, view) => {
      const el = !ctx.spec.fields && (ctx.spec.scenario === 'hex' || ctx.rng.bool(.5)) ? ctx.util.el('div', 'cp-hex', view.cur) : null;
      return { el, paint(m, rgb) { if (el) el.textContent = D.upperReadout ? M().hex(rgb).toUpperCase() : M().hex(rgb); } };
    };
    BASE.fieldBox = (ctx, view) => {
      const box = ctx.util.el('div', 'cp-fields', view.cur);
      box.style.marginTop = '6px';
      if (D.editableRows) {
        box.classList.add('cp-editable-rows'); box.style.marginTop = '0';
        box.append(view.rows.HEX.parentElement.parentElement);
      }
      return box;
    };
    BASE.fieldRow = (ctx, view, box, key) => {
      if (!D.editableRows) return ctx.util.el('div', 'cp-frow', box);
      const row = view.rows[key].parentElement;
      row.replaceChildren(); row.classList.add('cp-frow'); return row;
    };
    BASE.fields = (ctx, view, out) => {
      const { util, spec, rng } = ctx, math = M();
      const fields = view.fields = {};
      if (!spec.fields) return;
      const bind = (input, key, accept, maxLength) => {
        const h = env.ui.textField(input, {
          value: '', accept, maxLength, label: key,
          onInput(val) {
            if (key === 'hex') { const rgb = math.parseColor(val); if (rgb) S.commitRgb(rgb); return; }
            if (!/^\d{1,3}$/.test(val) || Number(val) > 255) return;
            const c = math.channels(ctx.model); c['rgb'.indexOf(key)] = Number(val); S.commitRgb(c);
          },
        });
        fields[key] = { el: input, h };
      };
      const box = P.fieldBox(ctx, view);
      if (spec.fields === 'hex' || spec.fields === 'both') {
        const row = P.fieldRow(ctx, view, box, 'HEX');
        util.el('span', 'cp-flab', row, rng.pick(['Hex', 'HEX', '#']));
        const input = util.el('input', 'cp-in hex', row);
        input.spellcheck = false; input.setAttribute('autocomplete', 'off'); input.setAttribute('aria-label', 'Hex color');
        bind(input, 'hex', /[#0-9a-fA-F]/, 7);
      }
      if (spec.fields === 'rgb' || spec.fields === 'both') {
        const shared = D.editableRows ? null : P.fieldRow(ctx, view, box, 'RGB');
        for (const k of 'rgb') {
          const row = shared || P.fieldRow(ctx, view, box, k.toUpperCase());
          util.el('span', 'cp-flab', row, k.toUpperCase()).style.minWidth = '12px';
          const input = util.el('input', 'cp-in ch', row);
          input.setAttribute('inputmode', 'numeric'); input.setAttribute('autocomplete', 'off'); input.setAttribute('aria-label', k.toUpperCase());
          bind(input, k, /\d/, 3);
        }
      }
      out.anchors.push(box); out.locators.field = (k) => util.center(fields[k].el);
    };
    BASE.currentReady = (ctx, side, view) => {
      if (D.sideRows === 'values') view.values = P.values(ctx, view.cur);
      if (D.prependCurrent) side.prepend(view.cur);
    };
    BASE.currentPaint = (ctx, view, m, rgb) => {
      if (D.sideRows === 'rows') P.rowsPaint(view.rows, m, rgb);
      if (view.values) {
        const values = [M().hex(rgb), ...rgb, Math.round(m.h) + '°', Math.round(m.s * 100) + '%', Math.round(m.v * 100) + '%'];
        view.values.forEach((row, i) => { row.textContent = String(values[i]); });
      }
    };
    BASE.sidePaint = () => {};
    BASE.side = (ctx, parent, width, targetHost) => {
      const side = ctx.util.el('div', 'cp-side', parent);
      side.style.width = width + 'px';
      const out = { anchors: [], locators: {} };
      P.target(ctx, side, targetHost);
      const view = P.current(ctx, side);
      const readout = P.readout(ctx, view);
      P.fields(ctx, view, out);
      P.currentReady(ctx, side, view);
      out.paint = (m) => {
        const rgb = M().modelRgb(m), code = M().hex(rgb);
        view.current.style.background = code;
        P.currentPaint(ctx, view, m, rgb); readout.paint(m, rgb);
        const active = document.activeElement, fields = view.fields;
        if (fields.hex && active !== fields.hex.el) fields.hex.h.set(code);
        for (const k of 'rgb') if (fields[k] && active !== fields[k].el) fields[k].h.set(String(rgb['rgb'.indexOf(k)]));
        P.sidePaint(ctx, view, m, rgb);
      };
      return out;
    };
    BASE.rendered = () => {};
    BASE.placeCard = (card, ctx) => {
      const s = ctx.stage.getBoundingClientRect(), r = card.getBoundingClientRect();
      const lo = [s.left - r.left + 4, s.top - r.top + 4], hi = [s.right - r.right - 4, s.bottom - r.bottom - 4];
      const pick = (a, b) => (b > a ? Math.round(ctx.rng.float(Math.max(a, -90), Math.min(b, 90))) : 0);
      card.style.left = pick(lo[0], hi[0]) + 'px'; card.style.top = pick(lo[1], hi[1]) + 'px';
    };
    BASE.afterPaint = (ctx, card) => {
      P.bindReset(ctx);
      if (D.place) P.placeCard(card, ctx);
      if (D.clear) {
        const initial = { ...ctx.model };
        env.widgetDef.clear = () => { ctx.update({ ...initial }); S.paintAll(); };
      }
    };
    BASE.bindReset = (ctx) => {
      if (!D.resetSelector) return;
      const initial = D.resetWhole ? { ...ctx.model } : { h: ctx.model.h, s: ctx.model.s, v: ctx.model.v };
      const scope = D.resetScope === 'shell' ? ctx.stage.closest('.shell') : document;
      const reset = scope.querySelector(D.resetSelector);
      if (reset) reset.onclick = () => {
        if (D.resetLog) ctx.log(D.resetLog[0], D.resetLog[1]);
        S.commit(initial);
      };
    };
    BASE.locate = (t) => {
      const m = st.ctx.model, L = st.side.locators;
      if (t.field) return L.field(t.field);
      const p = st.controls.locate(t, m);
      if (!p) throw new Error(`pick-color/${st.ctx.spec.controls} cannot locate ${JSON.stringify(t)}`);
      return p;
    };
    ({ D, P } = env.templateDesign('pick-color/picker', design, def, { tokens: TOKENS, scenarios: SCENARIOS, base: BASE, state: S }));
    return {
      traits: { controls: 'sv+hue' },
      render(ctx) {
        P.style(ctx);
        const card = P.card(ctx);
        st = { ctx, card, controls: null, side: null };
        P.begin(ctx, card); P.layout(ctx, card); P.rendered(ctx, card);
        S.paintAll(); P.afterPaint(ctx, card);
        return { anchors: [...st.controls.anchors, ...st.side.anchors], sync: () => S.paintAll() };
      },
      locate: (t) => P.locate(t),
    };
  });
})();
