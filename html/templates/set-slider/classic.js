/*
 * set-slider/classic: straight custom/native sliders, from design-set-slider-range-12 (L1 medoid).
 * Scenarios: horizontal, vertical, log, range, multi, stops, media, mixer, match. Live classic
 * branches remain; the scaffold's unregistered arc widget is omitted. All state is per factory.
 * With design {}: range -> design-set-slider-range-12; log -> design-set-slider-log-01;
 * multi -> design-set-slider-multi-10; vertical -> design-set-slider-vertical-03.
 * Other classic scenarios retain the medoid's live reference behavior.
 *
 * Tokens (null means retain sampled geometry/look):
 * ticks/readout/native null: override sampled booleans; readout 'shown': use spec.showValue; thumb/rail/thumbBox null: dimensions in px.
 * sampleLook/sampleLength true: draw the medoid look/length stream; false supports the six
 * fixed-look siblings that intentionally omit those draws. clear false: install widgetDef.clear.
 * stageStyle false: put the stylesheet in the stage and replace it each render when true.
 * horizontal false: force horizontal presentation; seededOrientation false: use spec.vertical
 * for length draws even when presentation is horizontal. rowClass null: replace display:contents.
 * minor null: {log, tag='div', cls='slc-minor', before=false, vertical=false, count} minor ticks.
 * bubble null: {tag='span', cls, units=false} value label inside every thumb.
 * cross/tickCount null: optional hit thickness / tick-count override.
 *
 * Presets: log forces ticks/readout/native (8/12, 9/12, 9/12 sites respectively) and uses log-01's
 * geometry/placement. multi forces ticks/readout/native (9/12, 7/12, 9/12), and uses
 * multi-10's horizontal geometry/look/begin hook. vertical forces ticks/readout (11/12 and 12/12 sites, including widget-level overrides),
 * and uses vertical-03's geometry. The look draws remain sampled before these overrides.
 * Preset part overrides are replaceable: () => replacement discards the preset below it.
 *
 * Parts (all calls via P; S.ctx/sliders/D/P/CSS expose live state; sliders is settable):
 * ensureStyle(): install structural CSS. placeIn(ctx,el,rng,pad=12): sampled placement.
 * keyboard(ctx,el,index,s,get,set): focus/key bindings. tickValues(s,scale,n,L,vertical): labels.
 * commit(ctx,index,values): update model. makeSlider/makeNative(ctx,parent,index,s,g): controller.
 * renderPlain/renderMedia/renderMixer(ctx,look): layout -> controller array.
 * begin(ctx): noop before look. look(ctx): sampled look plus token overrides -> object.
 * root(ctx,el,index,s,g): row display. label(ctx,root,index,s,g): label -> element.
 * cross(ctx,index,s,g): hit thickness -> px. rail(ctx,w): noop after rail creation.
 * beforeThumbs(ctx,w), thumb(ctx,w,el,j): decorations before/on thumbs.
 * ticks(ctx,w): ticks -> void; minorTicks(ctx,w,ticks): configured minor marks.
 * readout(ctx,w): readout -> element/null. afterReadout(ctx,w): noop after it exists.
 * paintReadout(ctx,w,values): readout text; painted(ctx,w,values,fractions): thumb labels/noop.
 * sliderOptions(ctx,w): extra primitive options -> {}. widget(ctx,w): noop after first paint.
 * native(ctx,{input,index,s,g,L,T,center,value,paint}): noop after native event bindings.
 * size(ctx,look): ctx.size. orientation(ctx): spec.vertical or horizontal override.
 * card(ctx,l): create card -> el. limits(ctx,l): {maxV,maxH}. length(ctx,s,l,limits): sampled px.
 * beforeGroup(ctx,l): noop before group. group(ctx,l): group -> el. layout(ctx,l): noop after setup.
 * parent(ctx,l,s,i): group -> el. geometry(ctx,g,s,i,l): apply tickCount; mutate widget geometry.
 * control(ctx,parent,i,s,g,native): build appropriate controller. controlled(ctx,ctl,s,i,l): noop.
 * beforePlace/placed(ctx,l,controllers): noops before/after sampled card placement.
 * rendered(ctx,look): optional clear binding after all widgets. sync(ctx,model): noop before sync.
 * w = {root,body,hit,rail,fill,index,s,g,L,cross,frac,fmt,n,thumbs,readout}; fields become
 * available as built. l = {size,vertical,n,anyLog,look,card,group}; presetsH on limits only.
 * Preserve every rng draw of any replaced part, in order, unless matching a fixed-look original.
 */
(function () {
  'use strict';

  const CSS = `
  .slc-card {
    position: absolute; padding: 30px 40px 42px; border: 1px solid var(--line); border-radius: 12px;
    background: color-mix(in srgb, var(--panel) 55%, var(--bg)); box-shadow: 0 1px 3px rgba(0,0,0,.06);
  }
  .slc-card.vertical { padding: 26px 70px 26px 50px; }
  .slc-card.tight { padding: 22px 30px 34px; }
  .slc-grid { display: grid; grid-template-columns: auto auto auto; column-gap: 24px; row-gap: 58px; align-items: center; }
  .slc-row { display: flex; align-items: flex-start; gap: 112px; }
  .slc-v { display: flex; flex-direction: column; align-items: center; gap: 14px; }
  .slc-label { min-width: 96px; font-weight: 600; text-align: right; white-space: nowrap; }
  .slc-v .slc-label { min-width: 0; text-align: center; }
  .slc-readout {
    width: 128px; white-space: nowrap; overflow: hidden; padding: 4px 10px; border: 1px solid var(--line);
    border-radius: 6px; background: var(--panel); font-variant-numeric: tabular-nums; text-align: center;
  }
  .slc-body { position: relative; }
  .slc-hit { position: relative; touch-action: none; outline: none; }
  .slc-hit:focus-visible, .slc-hit.focused { box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 45%, transparent); border-radius: 8px; }
  .slc-rail, .slc-fill { position: absolute; border-radius: 99px; }
  .slc-rail { background: var(--line); }
  .slc-fill { background: var(--accent); }
  .slc-thumb {
    position: absolute; border: 2px solid var(--accent); border-radius: 50%; background: var(--panel);
    box-shadow: 0 1px 3px rgba(0,0,0,.3);
  }
  .slc-thumb.active { box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 25%, transparent), 0 1px 3px rgba(0,0,0,.3); }
  .slc-h .slc-rail, .slc-h .slc-fill { top: 50%; transform: translateY(-50%); }
  .slc-v .slc-rail, .slc-v .slc-fill { left: 50%; transform: translateX(-50%); }
  .slc-ticks { position: absolute; color: var(--muted); font-size: 12px; font-variant-numeric: tabular-nums; pointer-events: none; }
  .slc-tick { position: absolute; white-space: nowrap; }
  .slc-tick::before { content: ""; position: absolute; background: var(--muted); }
  .slc-h .slc-ticks { left: 0; right: 0; top: 100%; height: 28px; }
  .slc-h .slc-tick { top: 8px; transform: translateX(-50%); }
  .slc-h .slc-tick::before { left: 50%; top: -7px; width: 1px; height: 5px; }
  .slc-v .slc-ticks { top: 0; bottom: 0; left: 100%; width: 60px; }
  .slc-v .slc-tick { left: 12px; transform: translateY(-50%); }
  .slc-v .slc-tick::before { top: 50%; left: -10px; width: 5px; height: 1px; }
  .slc-stop { font-weight: 600; color: var(--fg); }
  .slc-native { -webkit-appearance: none; appearance: none; display: block; margin: 0; padding: 0; background: transparent; outline: none; }
  .slc-native::-webkit-slider-runnable-track { height: var(--rail); border-radius: 99px;
    background: linear-gradient(to right, var(--accent) 0 var(--pct), var(--line) var(--pct) 100%); }
  .slc-native::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: var(--thumb); height: var(--thumb);
    margin-top: calc((var(--rail) - var(--thumb)) / 2); border-radius: 50%; background: var(--accent); border: 2px solid var(--panel);
    box-shadow: 0 1px 3px rgba(0,0,0,.35); }
  .slc-native:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 30%, transparent); }
  .slc-presets { margin: -6px 0 34px; border: 1px solid var(--line); border-radius: 8px; background: var(--panel); font-size: 13px; }
  .slc-presets table { border-collapse: collapse; width: 100%; }
  .slc-presets th, .slc-presets td { padding: 5px 12px; text-align: left; white-space: nowrap; font-variant-numeric: tabular-nums; }
  .slc-presets th { color: var(--muted); font-weight: 600; font-size: 12px; border-bottom: 1px solid var(--line); }
  .slc-presets td:first-child { font-weight: 650; }
  .slc-presets caption { text-align: left; padding: 8px 12px 2px; font-weight: 700; font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }

  .slm-player { position: absolute; overflow: hidden; border-radius: 10px; background: #0d0f13; color: #e9edf3; box-shadow: 0 10px 28px rgba(0,0,0,.28);
    font: 13px/1.3 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  .slm-video { position: relative; display: flex; align-items: center; justify-content: center; }
  .slm-title { position: absolute; left: 16px; top: 12px; right: 16px; font-size: 15px; font-weight: 650; text-shadow: 0 1px 3px rgba(0,0,0,.6); }
  .slm-big { width: 0; height: 0; border-left: 34px solid rgba(255,255,255,.85); border-top: 21px solid transparent; border-bottom: 21px solid transparent; margin-left: 8px; }
  .slm-bar { padding: 6px 14px 10px; background: linear-gradient(#16191f, #0d0f13); }
  .slm-seek .slc-rail, .slm-vol .slc-rail { background: rgba(255,255,255,.22); }
  .slm-icon { color: #cfd6df; display: flex; }
  .slm-seek .slc-buf { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,.38); border-radius: 99px; }
  .slm-seek .slc-thumb, .slm-vol .slc-thumb { border-color: #fff; background: var(--accent); }
  .slm-row { display: flex; align-items: center; gap: 14px; margin-top: 2px; }
  .slm-btn { width: 30px; height: 30px; border-radius: 50%; border: 0; background: rgba(255,255,255,.12); color: #fff; font-size: 13px; }
  .slm-time { font-variant-numeric: tabular-nums; color: #cfd6df; white-space: nowrap; }
  .slm-spacer { flex: 1; }
  .slm-volpct { width: 40px; text-align: right; font-variant-numeric: tabular-nums; color: #cfd6df; }

  .slx-mixer { position: absolute; display: flex; gap: 6px; padding: 14px 14px 12px; border-radius: 10px; border: 1px solid var(--line);
    background: color-mix(in srgb, var(--panel) 80%, var(--bg)); box-shadow: 0 2px 10px rgba(0,0,0,.08); }
  .slx-strip { width: 64px; flex: none; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 8px 6px; border-radius: 8px; background: color-mix(in srgb, var(--bg) 60%, var(--panel)); }
  .slx-name { font-size: 12px; font-weight: 700; white-space: nowrap; max-width: 78px; overflow: hidden; text-overflow: ellipsis; }
  .slx-val { width: 60px; text-align: center; overflow: hidden; font-size: 12px; color: var(--muted); font-variant-numeric: tabular-nums; white-space: nowrap; }
  .slx-body { display: flex; gap: 6px; align-items: stretch; }
  .slx-meter { width: 5px; border-radius: 3px; background: linear-gradient(to top, #2f9e44 0 60%, #f2c200 60% 82%, #e03131 82%); opacity: .35; }
  .slx-fader .slc-thumb { border-radius: 4px; }
  `;

  const TOKENS = {
    ticks: null, readout: null, native: null, thumb: null, rail: null, thumbBox: null,
    sampleLook: true, sampleLength: true, clear: false, stageStyle: false,
    horizontal: false, seededOrientation: false, rowClass: null,
    minor: null, bubble: null, cross: null, tickCount: null,
  };
  const SCENARIOS = {
    log: { ticks: true, readout: true, native: false, parts: {
      geometry: (base) => (ctx, g, s, i, layout) => {
        base(ctx, g, s, i, layout);
        g.length = Math.max(300, Math.floor(ctx.stage.clientWidth || layout.size.width) - 16);
        const unit = Math.min(ctx.stage.clientWidth / 1442, ctx.stage.clientHeight / 349);
        g.thumb = 26 * Math.min(1, unit); g.rail = 10; g.ticks = true; g.readout = true;
      },
      placed: () => (ctx, { card }) => { card.style.left = '0px'; card.style.top = '0px'; },
    } },
    multi: { ticks: true, readout: true, native: false, horizontal: true, tickCount: 1, parts: {
      begin: () => (ctx) => document.body.style.setProperty('--extra-sliders', Math.max(0, ctx.spec.sliders.length - 2)),
      look: (base) => (ctx) => Object.assign(base(ctx), {
        thumb: Math.max(18, Math.round(ctx.size.width * 0.01555)),
        rail: Math.max(8, Math.round(ctx.size.width * 0.00778)),
      }),
      geometry: (base) => (ctx, g, s, i, layout) => {
        base(ctx, g, s, i, layout); g.length = Math.round(layout.size.width * 0.752);
      },
    } },
    vertical: { ticks: true, readout: true, parts: {
      geometry: (base) => (ctx, g, s, i, layout) => {
        base(ctx, g, s, i, layout);
        const { size, vertical } = layout;
        if (vertical) {
          g.length = Math.max(90, Math.floor(size.height) - 90);
          g.thumb = 19; g.ticks = true; g.readout = true;
        }
      },
    } },
  };

  env.template('set-slider/classic', (design, def) => {
    let sliders, ctxRef, D, P;
    const BASE = {};
    const state = {
      get ctx() { return ctxRef; }, get sliders() { return sliders; }, set sliders(v) { sliders = v; },
      get D() { return D; }, get P() { return P; }, CSS,
    };
    const KEYS = new Set(['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End']);

    BASE.ensureStyle = function () {
      const existing = document.getElementById('slc-style');
      if (existing && !D.stageStyle) return;
      if (existing) existing.remove();
      const s = document.createElement('style');
      s.id = 'slc-style';
      s.textContent = CSS;
      (D.stageStyle ? ctxRef.stage : document.head).append(s);
    };

    // Place an absolutely positioned element at a sampled spot inside the stage, away from fixed controls
    // of the site (a floating end button) that would cover it.
    BASE.placeIn = function (ctx, el, rng, pad = 12) {
      const W = ctx.size.width;
      const H = ctx.size.height;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      const freeX = Math.max(0, W - w - 2 * pad);
      const freeY = Math.max(0, H - h - 2 * pad);
      const c01 = (f) => Math.min(1, Math.max(0, f));
      const fx = c01(rng.pick([0, 0.5, 0.5, 1]) + rng.float(-0.15, 0.15));
      const fy = c01(rng.pick([0, 0.5, 0.5, 1]) + rng.float(-0.15, 0.15));
      const st = ctx.stage.getBoundingClientRect();
      const fixed = [...document.querySelectorAll('[data-role="submit"]')]
        .filter((b) => getComputedStyle(b).position === 'fixed').map((b) => b.getBoundingClientRect());
      const hits = (x, y) => fixed.some((r) => st.left + x < r.right + 6 && st.left + x + w > r.left - 6 && st.top + y < r.bottom + 6 && st.top + y + h > r.top - 6);
      const cands = [[fx, fy], [fx, 0], [0, fy], [0, 0], [1, 0], [0, 1], [0.5, 0], [0.5, 0.5]];
      let [x, y] = [pad + fx * freeX, pad + fy * freeY];
      for (const [ax, ay] of cands) {
        const cx = pad + ax * freeX;
        const cy = pad + ay * freeY;
        if (!hits(cx, cy)) {
          [x, y] = [cx, cy];
          break;
        }
      }
      el.style.left = Math.round(x) + 'px';
      el.style.top = Math.round(y) + 'px';
    };

    // Keyboard support for one slider: focusable track, keyApply steps, focus mirrored into the model.
    BASE.keyboard = function (ctx, el, index, s, get, set) {
      if (!ctx.spec.keys) return;
      el.tabIndex = 0;
      el.addEventListener('pointerdown', () => el.focus({ preventScroll: true }));
      el.addEventListener('keydown', (e) => {
        if (!KEYS.has(e.key)) return;
        e.preventDefault();
        const v = get();
        if (v.length !== 1) return;
        const nv = env.taskOf('set-slider').helpers.scale.keyApply(s, v[0], e.key);
        if (nv !== v[0]) set([nv]);
      });
      el.addEventListener('focus', () => {
        el.classList.add('focused');
        if (ctx.model.focus !== index) ctx.update({ ...ctx.model, focus: index });
      });
      el.addEventListener('blur', () => {
        el.classList.remove('focused');
        if (ctx.model.focus === index) ctx.update({ ...ctx.model, focus: null });
      });
    };

    // Intermediate tick values; fewer ticks when labels would collide.
    BASE.tickValues = function (s, S, n, L, vertical) {
      if (s.stops) return s.stops.map((_, i) => i);
      if (s.log) {
        const out = [];
        for (let v = s.min; v <= s.max * 1.0001; v *= 10) out.push(Number(v.toPrecision(3)));
        return out;
      }
      const chars = Math.max(S.fmt(s, s.min).length, S.fmt(s, s.max).length);
      const need = vertical ? 22 : chars * 7.5 + 14;
      for (const k of [n, 5, 4, 2, 1]) {
        if (k <= n && L / k >= need) {
          return Array.from({ length: k + 1 }, (_, i) => Number((s.min + (i * (s.max - s.min)) / k).toFixed(S.decimals(s.step))));
        }
      }
      return [s.min, s.max];
    };

    // Commit slider index's values to the model (keeping the other sliders and the focus).
    BASE.commit = function (ctx, index, vals) {
      const all = ctx.model.values.map((x) => x.slice());
      all[index] = vals;
      ctx.update({ ...ctx.model, values: all });
    };

    // One custom slider widget bound to model.values[index]. g: { vertical, length, thumb, rail, ticks,
    // tickCount, readout, cls, readoutEl, labelEl (false: no label), fmt }.
    BASE.makeSlider = function (ctx, parent, index, s, g) {
      const { util } = ctx;
      const S = env.taskOf('set-slider').helpers.scale;
      const { vertical } = g;
      const L = g.length;
      const frac = (v) => S.frac(s, v);
      const fmt = g.fmt || ((v) => S.fmtU(s, v));

      const root = util.el('div', (vertical ? 'slc-v' : 'slc-h') + (g.cls ? ' ' + g.cls : ''), parent);
      P.root(ctx, root, index, s, g);
      if (g.labelEl !== false) P.label(ctx, root, index, s, g);
      const body = util.el('div', 'slc-body', root);
      if (!vertical) body.classList.add('slc-h');
      const hit = util.el('div', 'slc-hit', body);
      hit.dataset.role = 'track';
      const cross = P.cross(ctx, index, s, g);
      Object.assign(hit.style, vertical ? { width: cross + 'px', height: L + 'px' } : { width: L + 'px', height: cross + 'px' });
      const rail = util.el('div', 'slc-rail', hit);
      Object.assign(rail.style, vertical ? { top: 0, bottom: 0, width: g.rail + 'px' } : { left: 0, right: 0, height: g.rail + 'px' });
      P.rail(ctx, { root, body, hit, rail, index, s, g, L, cross });
      if (g.buffer) {
        const buf = util.el('div', 'slc-buf', hit);
        Object.assign(buf.style, { left: 0, width: g.buffer * L + 'px', height: g.rail + 'px' });
      }
      const fill = util.el('div', 'slc-fill', hit);
      Object.assign(fill.style, vertical ? { width: g.rail + 'px' } : { height: g.rail + 'px' });

      const n = ctx.model.values[index].length;
      const w = { root, body, hit, rail, fill, index, s, g, L, cross, frac, fmt, n };
      P.beforeThumbs(ctx, w);
      const thumbs = Array.from({ length: n }, (_, j) => {
        const t = util.el('div', 'slc-thumb', hit);
        t.dataset.role = 'thumb';
        t.dataset.j = j;
        Object.assign(t.style, g.thumbBox ? { width: g.thumbBox[0] + 'px', height: g.thumbBox[1] + 'px' } : { width: g.thumb + 'px', height: g.thumb + 'px' });
        P.thumb(ctx, w, t, j);
        return t;
      });
      w.thumbs = thumbs;

      P.ticks(ctx, w);
      const readout = P.readout(ctx, w);
      w.readout = readout;
      P.afterReadout(ctx, w);
      const tw = g.thumbBox ? g.thumbBox[0] : g.thumb;
      const th = g.thumbBox ? g.thumbBox[1] : g.thumb;

      const values = () => ctx.model.values[index];
      function paint(vals) {
        const fs = vals.map(frac);
        const [a, b] = fs.length === 2 ? fs : [0, fs[0]];
        if (vertical) Object.assign(fill.style, { top: (1 - b) * L + 'px', height: (b - a) * L + 'px' });
        else Object.assign(fill.style, { left: a * L + 'px', width: (b - a) * L + 'px' });
        P.paintReadout(ctx, w, vals);
        P.painted(ctx, w, vals, fs);
      }

      const ctl = env.ui.slider(hit, {
        ...P.sliderOptions(ctx, w),
        label: s.label,
        thumbs,
        values: values().slice(),
        valueAt: (f) => S.valueAt(s, f),
        fractionOf: frac,
        orientation: vertical ? 'vertical' : 'horizontal',
        place(t, point, f) {
          if (vertical) Object.assign(t.style, { left: (cross - tw) / 2 + 'px', top: (1 - f) * L - th / 2 + 'px' });
          else Object.assign(t.style, { top: (cross - th) / 2 + 'px', left: f * L - tw / 2 + 'px' });
        },
        // Track clicks jump the nearest thumb, as most real sliders do; the spec may forbid them.
        trackClick() {
          if (!ctx.spec.allowTrackClick) ctx.flag('track-click');
        },
        onStart: (j) => thumbs[j].classList.add('active'),
        onInput(vals) {
          P.commit(ctx, index, vals);
          paint(vals);
        },
        onChange(vals, j) {
          if (j !== null) thumbs[j].classList.remove('active');
        },
      });
      P.keyboard(ctx, hit, index, s, () => values(), (vals) => {
        ctl.set(vals);
        P.commit(ctx, index, vals);
        paint(vals);
      });

      paint(values());
      P.widget(ctx, w);
      return {
        anchor: hit,
        locate: (value, j) => ctl.locate(value, j),
        locateThumb: (j) => ctl.locateThumb(j),
        set: (vals) => { ctl.set(vals); paint(vals); },
      };
    };

    // A native <input type=range> bound to model.values[index] (single thumb, horizontal). The thumb's
    // center travels exactly L px: the input is L + thumb wide.
    BASE.makeNative = function (ctx, parent, index, s, g) {
      const { util } = ctx;
      const S = env.taskOf('set-slider').helpers.scale;
      const N = s.log ? 1000 : Math.round((s.max - s.min) / s.step);
      const toK = (v) => Math.round(S.frac(s, v) * N);
      const fromK = (k) => S.valueAt(s, k / N);
      const L = g.length;
      const T = g.thumb;
      const root = util.el('div', 'slc-h', parent);
      P.root(ctx, root, index, s, { ...g, vertical: false, native: true });
      P.label(ctx, root, index, s, g);
      const body = util.el('div', 'slc-body slc-h', root);
      const input = util.el('input', 'slc-native', body);
      input.type = 'range';
      input.min = 0;
      input.max = N;
      input.step = 1;
      input.dataset.role = 'track';
      input.setAttribute('aria-label', s.label);
      input.style.setProperty('--rail', g.rail + 'px');
      input.style.setProperty('--thumb', T + 'px');
      Object.assign(input.style, { width: L + T + 'px', height: Math.max(T, 24) + 8 + 'px' });
      if (!ctx.spec.keys) input.tabIndex = -1;
      if (g.ticks) {
        const ticks = util.el('div', 'slc-ticks', body);
        ticks.style.left = T / 2 + 'px';
        ticks.style.right = T / 2 + 'px';
        for (const v of P.tickValues(s, S, g.tickCount, L, false)) {
          const t = util.el('div', 'slc-tick', ticks, S.fmt(s, v));
          t.style.left = S.frac(s, v) * L + 'px';
        }
      }
      const readout = g.readout ? util.el('div', 'slc-readout', root) : null;
      const value = () => ctx.model.values[index][0];
      const paint = (v) => {
        input.value = String(toK(v));
        input.style.setProperty('--pct', (S.frac(s, v) * 100).toFixed(3) + '%');
        if (readout) readout.textContent = S.fmtU(s, v);
      };
      const center = (v) => {
        const r = input.getBoundingClientRect();
        return [r.left + T / 2 + S.frac(s, v) * L, r.top + r.height / 2];
      };
      input.addEventListener('pointerdown', (e) => {
        const [cx, cy] = center(value());
        const onThumb = Math.abs(e.clientX - cx) <= T / 2 + 1 && Math.abs(e.clientY - cy) <= T / 2 + 2;
        if (!onThumb) {
          env.log('track-click', { what: s.label, policy: 'jump' });
          if (!ctx.spec.allowTrackClick) ctx.flag('track-click');
        }
      });
      input.addEventListener('input', () => {
        const v = fromK(Number(input.value));
        input.style.setProperty('--pct', (S.frac(s, v) * 100).toFixed(3) + '%');
        if (readout) readout.textContent = S.fmtU(s, v);
        if (v !== value()) P.commit(ctx, index, [v]);
      });
      P.keyboard(ctx, input, index, s, () => ctx.model.values[index], (vals) => {
        paint(vals[0]);
        P.commit(ctx, index, vals);
      });
      P.native(ctx, { input, index, s, g, L, T, center, value, paint });
      paint(value());
      return {
        anchor: input,
        locate: (v) => center(v),
        locateThumb: () => center(value()),
        set: (vals) => paint(vals[0]),
      };
    };

    BASE.renderPlain = function (ctx, look) {
      const { spec, rng, util } = ctx;
      const size = P.size(ctx, look);
      const vertical = P.orientation(ctx);
      const n = spec.sliders.length;
      const anyLog = spec.sliders.some((s) => s.log);
      const layout = { size, vertical, n, anyLog, look };
      const card = P.card(ctx, layout);
      layout.card = card;
      // Stop names are centered on the track ends: leave room for the longest one.
      const stopPad = Math.max(0, ...spec.sliders.filter((s) => s.stops).map((s) => Math.max(s.stops[0].length, s.stops[s.stops.length - 1].length) * 4.2 - 30));
      if (stopPad && !vertical) card.style.paddingRight = card.style.paddingLeft = 40 + Math.ceil(stopPad) + 'px';
      // Presets card (match): one row per preset, one column per slider.
      if (spec.presets) {
        const box = util.el('div', 'slc-presets', card);
        box.dataset.role = 'presets';
        const table = util.el('table', '', box);
        util.el('caption', '', table, rng.pick(['Presets', 'Saved presets', 'Profiles', 'Scenes']));
        const head = util.el('tr', '', table);
        util.el('th', '', head, 'Preset');
        for (const s of spec.sliders) util.el('th', '', head, s.label);
        for (const p of spec.presets) {
          const tr = util.el('tr', '', table);
          util.el('td', '', tr, p.name);
          p.values.forEach((v, i) => util.el('td', '', tr, env.taskOf('set-slider').helpers.scale.fmtU(spec.sliders[i], v)));
        }
      }
      const presetsH = spec.presets ? 40 + 26 * (spec.presets.length + 1) : 0;
      // Track lengths from the stage: horizontal tracks leave room for label, readout and padding; vertical
      // tracks for the label, ticks and readout above/below.
      const { maxV, maxH } = P.limits(ctx, { ...layout, presetsH });
      const minH = (s) => (s.log ? 440 : s.stops ? Math.max(260, (s.stops.length - 1) * 64) : 320);
      const randLength = (s) => P.length(ctx, s, layout, { maxV, maxH, minH });
      const shared = randLength(anyLog ? { log: true } : spec.sliders.find((s) => s.stops) || {});
      P.beforeGroup(ctx, layout);
      const group = P.group(ctx, layout);
      layout.group = group;
      if (!vertical && !look.readout) group.style.gridTemplateColumns = 'auto auto';
      if (vertical && n >= 3) group.style.gap = '84px';
      if (!vertical && n >= 4) group.style.rowGap = Math.max(40, Math.min(58, Math.floor((size.height - presetsH - 90) / n) - 40)) + 'px';
      P.layout(ctx, layout);
      const native = look.native && !vertical;
      const out = spec.sliders.map((s, i) => {
        const parent = P.parent(ctx, layout, s, i);
        const g = {
          ...look,
          vertical,
          // Multi sliders form one aligned form; a distractor gets its own track length.
          length: spec.norm ? shared : randLength(s),
          tickCount: rng.pick([4, 5, 10]),
        };
        P.geometry(ctx, g, s, i, layout);
        const made = P.control(ctx, parent, i, s, g, native);
        P.controlled(ctx, made, s, i, layout);
        return made;
      });
      P.beforePlace(ctx, layout, out);
      P.placeIn(ctx, card, rng);
      P.placed(ctx, layout, out);
      return out;
    };

    BASE.renderMedia = function (ctx, look) {
      const { spec, rng, util, size } = ctx;
      const S = env.taskOf('set-slider').helpers.scale;
      const [seek, vol] = spec.sliders;
      const PW = Math.max(480, Math.min(860, Math.floor(size.width) - 40, rng.int(560, 900)));
      const VH = Math.max(120, Math.min(340, Math.floor(size.height) - 150, Math.round(PW * rng.float(0.36, 0.56))));
      const player = util.el('div', 'slm-player', ctx.stage);
      player.style.width = PW + 'px';
      const video = util.el('div', 'slm-video', player);
      const hue = rng.int(0, 359);
      Object.assign(video.style, { height: VH + 'px', background: `linear-gradient(135deg, hsl(${hue} 35% 22%), hsl(${(hue + 70) % 360} 40% 12%))` });
      util.el('div', 'slm-title', video, spec.title);
      util.el('div', 'slm-big', video);
      const bar = util.el('div', 'slm-bar', player);
      const L = PW - 28;
      const t = rng.int(12, 16);
      const out = [];
      out[0] = P.makeSlider(ctx, bar, 0, seek, {
        vertical: false, length: L, thumb: t, rail: rng.int(3, 6), ticks: false, standalone: true, labelEl: false, cls: 'slm-seek',
        buffer: rng.float(0.3, 1), fmt: (v) => S.fmt(seek, v),
      });
      const row = util.el('div', 'slm-row', bar);
      const play = util.el('button', 'slm-btn', row, '▶');
      play.type = 'button';
      play.tabIndex = -1;
      const time = util.el('span', 'slm-time', row);
      util.el('span', 'slm-spacer', row);
      const icon = util.el('span', 'slm-icon', row);
      icon.innerHTML = '<svg width="18" height="16" viewBox="0 0 18 16"><path d="M1 5.5h3.5L9 1.5v13L4.5 10.5H1z" fill="currentColor"/>' +
        '<path d="M12 4.5c1.6 1.8 1.6 5.2 0 7M14.5 2.5c2.7 3 2.7 8 0 11" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>';
      const pct = util.el('span', 'slm-volpct');
      out[1] = P.makeSlider(ctx, row, 1, vol, {
        vertical: false, length: rng.int(120, 150), thumb: 12, rail: 4, ticks: false, standalone: true, labelEl: false, cls: 'slm-vol',
        readoutEl: pct, fmt: (v) => `${v}%`,
      });
      row.append(pct);
      // Elapsed / total time follows the seek value.
      const paintTime = () => { time.textContent = `${S.fmt(seek, ctx.model.values[0][0])} / ${S.fmt(seek, seek.max)}`; };
      paintTime();
      const upd = ctx.update;
      ctx.update = (m) => { upd(m); paintTime(); };
      P.placeIn(ctx, player, rng);
      out.paintTime = paintTime;
      return out;
    };

    BASE.renderMixer = function (ctx, look) {
      const { spec, rng, util, size } = ctx;
      const mixer = util.el('div', 'slx-mixer', ctx.stage);
      mixer.dataset.role = 'mixer';
      const L = Math.max(200, Math.min(340, Math.floor(size.height) - 170, rng.int(220, 360)));
      const out = spec.sliders.map((s, i) => {
        const strip = util.el('div', 'slx-strip', mixer);
        util.el('div', 'slx-name', strip, s.label).title = s.label;
        const val = util.el('div', 'slx-val', strip);
        const body = util.el('div', 'slx-body', strip);
        const sl = P.makeSlider(ctx, body, i, s, {
          vertical: true, length: L, thumb: 14, thumbBox: [26, 12], rail: 4, ticks: false, labelEl: false, cls: 'slx-fader',
          readoutEl: val,
        });
        const meter = util.el('div', 'slx-meter', body);
        meter.style.height = L + 'px';
        return sl;
      });
      P.placeIn(ctx, mixer, rng);
      return out;
    };

    BASE.begin = () => {};
    BASE.look = (ctx) => {
      const { rng, spec } = ctx;
      const look = D.sampleLook ? {
        thumb: rng.int(14, 26), rail: rng.int(4, 10), ticks: rng.bool(0.6),
        readout: rng.bool(0.6) || spec.showValue || spec.scenario === 'match', native: rng.bool(0.3),
      } : {};
      for (const key of ['thumb', 'rail', 'ticks', 'readout', 'native', 'thumbBox']) {
        if (D[key] !== null) look[key] = key === 'readout' && D[key] === 'shown' ? !!spec.showValue : D[key];
      }
      return look;
    };
    BASE.root = (ctx, root, index, s, g) => {
      if (!g.vertical && !g.standalone) {
        if (D.rowClass) root.classList.add(...D.rowClass.split(' '));
        else root.style.display = 'contents';
      }
    };
    BASE.label = (ctx, root, index, s) => ctx.util.el('div', 'slc-label', root, s.label);
    BASE.cross = (ctx, index, s, g) => g.cross || D.cross || Math.max(g.thumb, 24) + 12;
    BASE.rail = () => {};
    BASE.beforeThumbs = () => {};
    BASE.thumb = (ctx, w, t) => {
      if (D.bubble) ctx.util.el(D.bubble.tag || 'span', D.bubble.cls, t);
    };
    BASE.minorTicks = (ctx, w, ticks) => {
      const m = D.minor;
      if (!m || (m.log ? !w.s.log : w.s.log || w.s.stops) || (w.g.vertical && !m.vertical)) return;
      const values = [];
      if (m.log) {
        for (let decade = w.s.min; decade < w.s.max; decade *= 10) {
          for (let k = 2; k < 10; k++) if (decade * k < w.s.max) values.push(decade * k);
        }
      } else {
        for (let k = 0; k <= m.count; k++) values.push(w.s.min + k * (w.s.max - w.s.min) / m.count);
      }
      for (const value of values) {
        const tick = ctx.util.el(m.tag || 'div', m.cls || 'slc-minor', ticks);
        tick.style[w.g.vertical ? 'top' : 'left'] = (w.g.vertical ? 1 - w.frac(value) : w.frac(value)) * w.L + 'px';
      }
    };
    BASE.ticks = (ctx, w) => {
      const { s, g, body, L, frac } = w;
      if (!(g.ticks || s.stops)) return;
      const ticks = ctx.util.el('div', 'slc-ticks', body);
      if (D.minor && D.minor.before) P.minorTicks(ctx, w, ticks);
      for (const v of P.tickValues(s, env.taskOf('set-slider').helpers.scale, g.tickCount, L, g.vertical)) {
        const t = ctx.util.el('div', 'slc-tick' + (s.stops ? ' slc-stop' : ''), ticks, env.taskOf('set-slider').helpers.scale.fmt(s, v));
        t.style[g.vertical ? 'top' : 'left'] = (g.vertical ? (1 - frac(v)) * L : frac(v) * L) + 'px';
      }
      if (!(D.minor && D.minor.before)) P.minorTicks(ctx, w, ticks);
    };
    BASE.readout = (ctx, { g, root }) => g.readoutEl || (g.readout ? ctx.util.el('div', 'slc-readout', root) : null);
    BASE.afterReadout = () => {};
    BASE.paintReadout = (ctx, w, vals) => { if (w.readout) w.readout.textContent = vals.map(w.fmt).join(' – '); };
    BASE.painted = (ctx, w, vals) => {
      if (D.bubble) w.thumbs.forEach((t, j) => {
        if (vals[j] !== undefined) t.firstChild.textContent = D.bubble.units ? w.fmt(vals[j]) : env.taskOf('set-slider').helpers.scale.fmt(w.s, vals[j]);
      });
    };
    BASE.sliderOptions = () => ({});
    BASE.widget = () => {};
    BASE.native = () => {};
    BASE.size = (ctx) => ctx.size;
    BASE.orientation = (ctx) => D.horizontal ? false : ctx.spec.vertical;
    BASE.card = (ctx, { vertical, n }) => ctx.util.el('div', 'slc-card' + (vertical ? ' vertical' : '') + (n >= 4 ? ' tight' : ''), ctx.stage);
    BASE.limits = (ctx, { size, look, presetsH }) => ({
      maxV: Math.max(240, Math.min(440, Math.floor(size.height) - 200 - presetsH)),
      maxH: Math.max(320, Math.min(820, Math.floor(size.width) - 120 - 96 - 24 - (look.readout ? 152 : 0))),
    });
    BASE.length = (ctx, s, layout, { maxV, maxH, minH }) => {
      const vertical = D.seededOrientation ? ctx.spec.vertical : layout.vertical;
      if (!D.sampleLength) return vertical ? maxV : maxH;
      return vertical ? ctx.rng.int(240, maxV) : ctx.rng.int(Math.min(minH(s), maxH), Math.max(minH(s), maxH));
    };
    BASE.beforeGroup = () => {};
    BASE.group = (ctx, { vertical, card }) => ctx.util.el('div', vertical ? 'slc-row' : 'slc-grid', card);
    BASE.layout = () => {};
    BASE.parent = (ctx, { group }) => group;
    BASE.geometry = (ctx, g) => { if (D.tickCount !== null) g.tickCount = D.tickCount; };
    BASE.control = (ctx, parent, i, s, g, native) => {
      if (native && s.target !== undefined && !s.stops && (!s.target || s.target.length === 1)) return P.makeNative(ctx, parent, i, s, g);
      return P.makeSlider(ctx, parent, i, s, g);
    };
    BASE.controlled = () => {};
    BASE.beforePlace = () => {};
    BASE.placed = () => {};
    BASE.rendered = (ctx) => {
      if (!D.clear) return;
      const initial = structuredClone(ctx.model);
      env.widgetDef.clear = () => { ctx.update(structuredClone(initial)); sliders.forEach((sl, i) => sl.set(initial.values[i])); };
    };
    BASE.sync = () => {};

    ({ D, P } = env.templateDesign('set-slider/classic', design, def, { tokens: TOKENS, scenarios: SCENARIOS, base: BASE, state }));
    return {

      render(ctx) {
        ctxRef = ctx;
        P.ensureStyle();
        P.begin(ctx);
        const { spec, rng } = ctx;
        const look = P.look(ctx);
        if (spec.scenario === 'media') sliders = P.renderMedia(ctx, look);
        else if (spec.scenario === 'mixer') sliders = P.renderMixer(ctx, look);
        else sliders = P.renderPlain(ctx, look);
        P.rendered(ctx, look);
        return {
          anchors: sliders.map((sl) => sl.anchor),
          sync(m) {
            P.sync(ctx, m);
            sliders.forEach((sl, i) => sl.set(m.values[i]));
            if (sliders.paintTime) sliders.paintTime();
          },
        };
      },

      locate(t) {
        const sl = sliders[t.slider];
        if (!sl) throw new Error(`set-slider/classic cannot locate ${JSON.stringify(t)}`);
        if (t.value !== undefined) return sl.locate(t.value, t.thumb);
        return sl.locateThumb(t.thumb);
      },
    };
  });
})();
