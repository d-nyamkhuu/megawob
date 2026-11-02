/*
 * set-slider/settings: horizontal settings rows (L2-L5 share the same controller/key/reset code).
 * Neutral defaults reproduce design-set-slider-horizontal-10, the L2 medoid. Scenario: horizontal.
 * With the horizontal preset, design {} reproduces design-set-slider-horizontal-09 exactly.
 * L3/L4/L5 medoids horizontal-01/-07/-12 replace align-layout/row parts.
 * The horizontal preset enables the fill shared by 7/12 sites, using horizontal-09 as its
 * representative: four rows, standard four labels, max 10, prepend dummies, four tick intervals,
 * fill before ticks, and decorative values {Brightness:4,Contrast:6,Saturation:3,Sharpness:5}.
 * No RNG draws; each factory owns its controls and current ctx.
 *
 * Tokens and defaults:
 * rows 3, labels ['Brightness','Sharpness','Contrast'], min 0, max 1000: decorative rows.
 * order 'swap': exchange first two rows for one live control; 'last' rotates live row to end;
 * 'prepend' puts all decorative rows first; 'scoredLast' moves targeted live rows last; null keeps order.
 * ticks 8: intervals, null disables ticks. major 0: every Nth tick has .major when nonzero.
 * fill false: create a fill; fillFirst false: create it before ticks when true.
 * fillMode 'width': width in percent; 'variable': --f; 'inset': width calc(percent + .8em).
 * labelSuffix '': label text suffix. heading null: settings h3. settings true: wrap rows in section.
 * locateError 'Unknown library slider': error for an unrecognized slider target.
 * decorative null: {label: number} fixed dummy values; otherwise Brightness=512, others=300.
 * decorativeFraction null: fixed percent for all dummy rows, else 51.2/30 (or from decorative values).
 *
 * Parts: S.ctx/controls/D/P expose live state (controls settable), S.def contains widget identity.
 * begin(ctx): noop before initial model copy. settings(ctx): settings container -> el (stage if disabled).
 * rows(ctx,settings): .slider-rows -> el. entries(ctx): live+dummy rows -> [{s,i}], i null for dummies.
 * prepared(ctx,rows,entries): noop before rows. row(ctx,rows,s,i): build widget -> w.
 * ticks(ctx,w,s,i): configured tick marks. endpoints(ctx,w,s,i): min/max labels.
 * readout(ctx,w,s,i): output -> el. decorative(ctx,w,s): position/text for inert row.
 * place(ctx,w,s,i,thumb,point,fraction): thumb/fill placement. paint(ctx,w,s,i,values): value text.
 * bind(ctx,w,s,i): controller+keyboard -> {ctl,paint}. keyboard(ctx,hit,s,i,ctl,commit): key/focus wiring.
 * rendered(ctx,rows,entries): noop after controls. reset(ctx,initial,sync): bind page reset action.
 * w = {row,body,hit,thumb,fill,readout}; parts may add private fields.
 */
(function () {
  'use strict';
  const KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End']);
  const TOKENS = {
    rows: 3, labels: ['Brightness', 'Sharpness', 'Contrast'], min: 0, max: 1000, order: 'swap',
    ticks: 8, major: 0, fill: false, fillFirst: false, fillMode: 'width', labelSuffix: '',
    heading: null, settings: true, decorative: null, decorativeFraction: null, locateError: 'Unknown library slider',
  };
  const SCENARIOS = {
    horizontal: {
      rows: 4, labels: ['Brightness', 'Contrast', 'Saturation', 'Sharpness'], max: 10, order: 'prepend',
      ticks: 4, fill: true, fillFirst: true, decorative: { Brightness: 4, Contrast: 6, Saturation: 3, Sharpness: 5 },
    },
  };

  env.template('set-slider/settings', (design, def) => {
    let D, P, ctxRef, controls = [];
    const BASE = {};
    const S = {
      get ctx() { return ctxRef; }, get controls() { return controls; }, set controls(v) { controls = v; },
      get D() { return D; }, get P() { return P; }, def,
    };
    BASE.begin = () => {};
    BASE.settings = (ctx) => {
      if (!D.settings) return ctx.stage;
      const el = ctx.util.el('section', 'image-settings', ctx.stage);
      if (D.heading) ctx.util.el('h3', '', el, D.heading);
      return el;
    };
    BASE.rows = (ctx, settings) => ctx.util.el('div', 'slider-rows', settings);
    BASE.entries = (ctx) => {
      const entries = ctx.spec.sliders.map((s, i) => ({ s, i }));
      const labels = D.labels.filter(label => !entries.some(({ s }) => s.label === label));
      const padding = [];
      while (entries.length + padding.length < D.rows) {
        padding.push({ s: { label: labels.shift(), min: D.min, max: D.max, step: 1 }, i: null });
      }
      if (D.order === 'prepend') entries.unshift(...padding);
      else entries.push(...padding);
      if (ctx.spec.sliders.length === 1) {
        if (D.order === 'swap' && entries.length > 1) [entries[0], entries[1]] = [entries[1], entries[0]];
        if (D.order === 'last') entries.push(entries.shift());
      }
      if (D.order === 'scoredLast') {
        const scored = entries.filter(({ i, s }) => i !== null && s.target);
        return entries.filter(e => !scored.includes(e)).concat(scored);
      }
      return entries;
    };
    BASE.prepared = () => {};
    BASE.ticks = (ctx, w) => {
      if (D.ticks === null) return;
      for (let n = 0; n <= D.ticks; n++) {
        const tick = ctx.util.el('i', 'slider-tick' + (D.major && n % D.major === 0 ? ' major' : ''), w.hit);
        tick.style.left = (n * (100 / D.ticks)) + '%';
      }
    };
    BASE.endpoints = (ctx, w, s) => {
      const ends = ctx.util.el('div', 'slider-endpoints', w.body);
      ctx.util.el('span', '', ends, env.taskOf('set-slider').helpers.scale.fmt(s, s.min));
      ctx.util.el('span', '', ends, env.taskOf('set-slider').helpers.scale.fmt(s, s.max));
    };
    BASE.readout = (ctx, w) => ctx.util.el('output', 'slider-readout', w.row);
    BASE.row = (ctx, rows, s, i) => {
      const u = ctx.util;
      const row = u.el('div', 'slider-row' + (i !== null && s.target ? ' scored' : ''), rows);
      u.el('label', 'slider-label', row, s.label + D.labelSuffix);
      const body = u.el('div', 'slider-body', row);
      const hit = u.el('div', 'slider-hit', body);
      hit.dataset.role = 'track'; hit.setAttribute('aria-label', s.label);
      u.el('div', 'slider-rail', hit);
      const w = { row, body, hit };
      if (D.fill && D.fillFirst) w.fill = u.el('div', 'slider-fill', hit);
      P.ticks(ctx, w, s, i);
      if (D.fill && !D.fillFirst) w.fill = u.el('div', 'slider-fill', hit);
      w.thumb = u.el('div', 'slider-thumb', hit); w.thumb.dataset.role = 'thumb';
      P.endpoints(ctx, w, s, i);
      w.readout = P.readout(ctx, w, s, i);
      return w;
    };
    BASE.decorative = (ctx, w, s) => {
      const value = D.decorative ? D.decorative[s.label] || 5 : s.label === 'Brightness' ? 512 : 300;
      const fraction = D.decorativeFraction !== null ? D.decorativeFraction : D.decorative
        ? (value - s.min) / (s.max - s.min) * 100 : s.label === 'Brightness' ? 51.2 : 30;
      w.thumb.style.left = fraction + '%';
      if (D.fillMode === 'variable') w.hit.style.setProperty('--f', fraction + '%');
      else if (w.fill) w.fill.style.width = D.fillMode === 'inset' ? `calc(${fraction}% + .8em)` : fraction + '%';
      w.readout.textContent = String(value);
      w.row.classList.add('decorative');
    };
    BASE.place = (ctx, w, s, i, t, p, f) => {
      t.style.left = (f * 100) + '%';
      if (D.fillMode === 'variable') w.hit.style.setProperty('--f', (f * 100) + '%');
      else if (w.fill) w.fill.style.width = D.fillMode === 'inset' ? `calc(${f * 100}% + .8em)` : (f * 100) + '%';
    };
    BASE.paint = (ctx, w, s, i, vals) => { w.readout.textContent = vals.map(v => env.taskOf('set-slider').helpers.scale.fmtU(s, v)).join(' – '); };
    BASE.keyboard = (ctx, hit, s, i, ctl, commit) => {
      if (!ctx.spec.keys) return;
      hit.tabIndex = 0;
      hit.addEventListener('pointerdown', () => hit.focus({ preventScroll: true }));
      hit.addEventListener('focus', () => { if (ctx.model.focus !== i) ctx.update({ ...ctx.model, focus: i }); });
      hit.addEventListener('blur', () => { if (ctx.model.focus === i) ctx.update({ ...ctx.model, focus: null }); });
      hit.addEventListener('keydown', e => {
        if (!KEYS.has(e.key)) return;
        e.preventDefault();
        const v = env.taskOf('set-slider').helpers.scale.keyApply(s, ctx.model.values[i][0], e.key);
        ctl.set([v]); commit([v]);
      });
    };
    BASE.bind = (ctx, w, s, i) => {
      const scale = env.taskOf('set-slider').helpers.scale;
      const paint = vals => P.paint(ctx, w, s, i, vals);
      const commit = vals => {
        const values = ctx.model.values.map(v => v.slice()); values[i] = vals;
        ctx.update({ ...ctx.model, values }); paint(vals);
      };
      const ctl = env.ui.slider(w.hit, {
        label: s.label, thumbs: [w.thumb], values: ctx.model.values[i].slice(),
        valueAt: f => scale.valueAt(s, f), fractionOf: v => scale.frac(s, v),
        place: (t, p, f) => P.place(ctx, w, s, i, t, p, f),
        trackClick() { if (!ctx.spec.allowTrackClick) ctx.flag('track-click'); }, onInput: commit,
      });
      P.keyboard(ctx, w.hit, s, i, ctl, commit);
      paint(ctx.model.values[i]);
      return { ctl, paint };
    };
    BASE.rendered = () => {};
    BASE.reset = (ctx, initial, sync) => {
      document.querySelector('[data-action="reset"]').onclick = () => {
        const m = JSON.parse(JSON.stringify(initial)); ctx.update(m); sync(m);
      };
    };
    ({ D, P } = env.templateDesign('set-slider/settings', design, def, { tokens: TOKENS, scenarios: SCENARIOS, base: BASE, state: S }));
    return {
      render(ctx) {
        ctxRef = ctx;
        P.begin(ctx);
        const initial = JSON.parse(JSON.stringify(ctx.model));
        const rows = P.rows(ctx, P.settings(ctx));
        const entries = P.entries(ctx);
        controls = [];
        const anchors = [];
        P.prepared(ctx, rows, entries);
        for (const { s, i } of entries) {
          const w = P.row(ctx, rows, s, i);
          if (i === null) { P.decorative(ctx, w, s); continue; }
          controls[i] = P.bind(ctx, w, s, i);
          anchors.push(w.hit);
        }
        P.rendered(ctx, rows, entries);
        const sync = m => controls.forEach((sl, i) => { sl.ctl.set(m.values[i]); sl.paint(m.values[i]); });
        P.reset(ctx, initial, sync);
        return { anchors, sync };
      },
      locate(t) {
        const sl = controls[t.slider];
        if (!sl) throw new Error(D.locateError);
        return t.value === undefined ? sl.ctl.locateThumb(t.thumb) : sl.ctl.locate(t.value, t.thumb);
      },
    };
  });
})();
