// Extranet design: per-slider panels, compact layouts, and range/target notes.
(function () {
  let compact = false;
  let packed = false;
  let rowHeight = 0;
  let gap = 0;
  let em = 16;
  let fixedLength = 0;

  env.widget({
    task: 'set-slider',
    site: 'design-set-slider-multi-07',
    name: 'design',
    split: 'train',
    scenarios: ['multi'],
    template: 'set-slider/classic',
    design: {
      minor: { count: 4 },
      parts: {
        look: () => (ctx) => {
          const { rng, spec } = ctx;
          return {
            thumb: rng.int(14, 26),
            rail: rng.int(4, 10),
            ticks: rng.bool(0.6),
            readout: rng.bool(0.6) || spec.showValue || spec.scenario === 'match',
            native: rng.bool(0.3),
          };
        },
        makeSlider: (base, S) => (ctx, parent, index, s, g) => {
          const { util } = ctx;
          const scale = env.taskOf('set-slider').helpers.scale;
          const vertical = g.vertical;
          const L = g.length;
          const frac = (v) => scale.frac(s, v);
          const fmt = g.fmt || ((v) => scale.fmtU(s, v));
          const root = util.el('div', (vertical ? 'slc-v' : 'slc-h') + (g.cls ? ' ' + g.cls : ''), parent);
          if (!vertical && !g.standalone) root.style.display = 'contents';
          if (g.labelEl !== false) util.el('div', 'slc-label', root, s.label);
          const body = util.el('div', 'slc-body', root);
          if (!vertical) body.classList.add('slc-h');
          const hit = util.el('div', 'slc-hit', body);
          hit.dataset.role = 'track';
          const cross = g.cross || Math.max(g.thumb, 24) + 12;
          Object.assign(hit.style, vertical ? { width: cross + 'px', height: L + 'px' } : { width: L + 'px', height: cross + 'px' });
          const rail = util.el('div', 'slc-rail', hit);
          Object.assign(rail.style, vertical ? { top: 0, bottom: 0, width: g.rail + 'px' } : { left: 0, right: 0, height: g.rail + 'px' });
          if (g.buffer) {
            const buf = util.el('div', 'slc-buf', hit);
            Object.assign(buf.style, { left: 0, width: g.buffer * L + 'px', height: g.rail + 'px' });
          }
          const fill = util.el('div', 'slc-fill', hit);
          Object.assign(fill.style, vertical ? { width: g.rail + 'px' } : { height: g.rail + 'px' });
          const n = ctx.model.values[index].length;
          const thumbs = Array.from({ length: n }, (_, j) => {
            const t = util.el('div', 'slc-thumb', hit);
            t.dataset.role = 'thumb';
            t.dataset.j = j;
            Object.assign(t.style, g.thumbBox
              ? { width: g.thumbBox[0] + 'px', height: g.thumbBox[1] + 'px' }
              : { width: g.thumb + 'px', height: g.thumb + 'px' });
            return t;
          });
          if (g.ticks || s.stops) {
            const ticks = util.el('div', 'slc-ticks', body);
            const tvals = S.P.tickValues(s, scale, g.tickCount, L, vertical);
            for (const v of tvals) {
              const t = util.el('div', 'slc-tick' + (s.stops ? ' slc-stop' : ''), ticks, scale.fmt(s, v));
              t.style[vertical ? 'top' : 'left'] = (vertical ? (1 - frac(v)) * L : frac(v) * L) + 'px';
            }
            if (!vertical && !s.log && !s.stops) {
              for (let k = 0; k < tvals.length - 1; k++) {
                for (let m = 1; m < 5; m++) {
                  const mt = util.el('div', 'slc-minor', ticks);
                  mt.style.left = frac(tvals[k] + ((tvals[k + 1] - tvals[k]) * m) / 5) * L + 'px';
                }
              }
            }
          }
          const readout = g.readoutEl || (g.readout ? util.el('div', 'slc-readout', root) : null);
          const tw = g.thumbBox ? g.thumbBox[0] : g.thumb;
          const th = g.thumbBox ? g.thumbBox[1] : g.thumb;
          const values = () => ctx.model.values[index];
          function paint(vals) {
            const fs = vals.map(frac);
            const [a, b] = fs.length === 2 ? fs : [0, fs[0]];
            if (vertical) Object.assign(fill.style, { top: (1 - b) * L + 'px', height: (b - a) * L + 'px' });
            else Object.assign(fill.style, { left: a * L + 'px', width: (b - a) * L + 'px' });
            if (readout) readout.textContent = vals.map(fmt).join(' – ');
          }
          const ctl = env.ui.slider(hit, {
            label: s.label, thumbs, values: values().slice(),
            valueAt: (f) => scale.valueAt(s, f), fractionOf: frac,
            orientation: vertical ? 'vertical' : 'horizontal',
            place(t, point, f) {
              if (vertical) Object.assign(t.style, { left: (cross - tw) / 2 + 'px', top: (1 - f) * L - th / 2 + 'px' });
              else Object.assign(t.style, { top: (cross - th) / 2 + 'px', left: f * L - tw / 2 + 'px' });
            },
            trackClick() { if (!ctx.spec.allowTrackClick) ctx.flag('track-click'); },
            onStart: (j) => thumbs[j].classList.add('active'),
            onInput(vals) {
              const all = ctx.model.values.map((x) => x.slice());
              all[index] = vals;
              ctx.update({ ...ctx.model, values: all });
              paint(vals);
            },
            onChange(vals, j) { if (j !== null) thumbs[j].classList.remove('active'); },
          });
          S.P.keyboard(ctx, hit, index, s, () => values(), (vals) => {
            ctl.set(vals);
            const all = ctx.model.values.map((x) => x.slice());
            all[index] = vals;
            ctx.update({ ...ctx.model, values: all });
            paint(vals);
          });
          paint(values());
          return {
            anchor: hit,
            locate: (value, j) => ctl.locate(value, j),
            locateThumb: (j) => ctl.locateThumb(j),
            set: (vals) => { ctl.set(vals); paint(vals); },
          };
        },
        renderPlain: (base, S) => (ctx, look) => {
          const { spec, rng, util, size } = ctx;
          const vertical = spec.vertical;
          const n = spec.sliders.length;
          const anyLog = spec.sliders.some((s) => s.log);
          const card = util.el('div', 'slc-card' + (vertical ? ' vertical' : '') + (n >= 4 ? ' tight' : ''), ctx.stage);
          const stopPad = Math.max(0, ...spec.sliders.filter((s) => s.stops)
            .map((s) => Math.max(s.stops[0].length, s.stops[s.stops.length - 1].length) * 4.2 - 30));
          if (stopPad && !vertical) card.style.paddingRight = card.style.paddingLeft = 40 + Math.ceil(stopPad) + 'px';
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
          const maxV = Math.max(240, Math.min(440, Math.floor(size.height) - 200 - presetsH));
          const room = Math.floor(size.width) - 120 - 96 - 24 - (look.readout ? 152 : 0);
          const maxH = Math.max(320, Math.min(820, room));
          const minH = (s) => (s.log ? 440 : s.stops ? Math.max(260, (s.stops.length - 1) * 64) : 320);
          const randLength = (s) => vertical ? rng.int(240, maxV)
            : rng.int(Math.min(minH(s), maxH), Math.max(minH(s), maxH));
          const shared = randLength(anyLog ? { log: true } : spec.sliders.find((s) => s.stops) || {});
          const group = util.el('div', vertical ? 'slc-row' : 'slc-grid', card);
          if (!vertical && !look.readout) group.style.gridTemplateColumns = 'auto auto';
          if (vertical && n >= 3) group.style.gap = '84px';
          if (!vertical && n >= 4) group.style.rowGap = Math.max(40,
            Math.min(58, Math.floor((size.height - presetsH - 90) / n) - 40)) + 'px';
          const native = false;
          const stageW = ctx.stage.clientWidth || size.width;
          em = parseFloat(getComputedStyle(ctx.stage).fontSize) || 16;
          gap = Math.min(em * 0.85, size.height / Math.max(1, n) * 0.12);
          rowHeight = (size.height - gap * (n - 1)) / n;
          compact = !vertical && (n >= 4 || rowHeight < em * 7.5);
          packed = compact && rowHeight < em * 5.5;
          if (compact) {
            card.classList.add('compact');
            if (packed) card.classList.add('packed');
            card.style.setProperty('--slc-gap', gap + 'px');
            card.style.setProperty('--slc-row-height', rowHeight + 'px');
          }
          fixedLength = Math.max(80, Math.floor(stageW - em * (packed ? 17.6 : 12.4)));
          const out = spec.sliders.map((s, i) => {
            const g = {
              ...look,
              vertical,
              length: spec.norm ? shared : randLength(s),
              tickCount: rng.pick([4, 5, 10]),
            };
            if (!vertical) {
              g.length = fixedLength;
              g.tickCount = s.max - s.min === 30 ? 6 : 5;
              g.rail = Math.round(em * 0.7);
              g.thumb = Math.round(em * 2.2);
              g.thumbBox = [Math.round(em * 1.2), Math.round(em * 2.2)];
              g.ticks = true;
              g.readout = true;
            }
            if (compact) {
              const scale = Math.min(1, rowHeight / (em * 9.85));
              g.cross = Math.max(12, Math.min(Math.round(em * 1.6), Math.floor(rowHeight - em * 0.45)));
              g.rail = Math.max(5, Math.round(g.rail * scale));
              g.thumb = Math.min(g.cross, Math.max(12, Math.round(g.thumb * scale)));
              g.thumbBox = [Math.max(9, Math.round(g.thumbBox[0] * scale)), g.thumb];
            }
            const panel = vertical ? group : util.el('div', 'slc-panel', group);
            if (native && s.target !== undefined && !s.stops && (!s.target || s.target.length === 1)) {
              return S.P.makeNative(ctx, panel, i, s, g);
            }
            return S.P.makeSlider(ctx, panel, i, s, g);
          });
          S.P.placeIn(ctx, card, rng);
          card.style.left = '0px';
          card.style.top = '0px';
          const rangeBox = document.getElementById('ref-ranges');
          if (rangeBox && !rangeBox.childNodes.length) {
            for (const s of spec.sliders) util.el('div', '', rangeBox,
              `${s.label}: ${env.taskOf('set-slider').helpers.scale.fmt(s, s.min)} to ${env.taskOf('set-slider').helpers.scale.fmt(s, s.max)}`);
          }
          const targets = document.getElementById('ref-targets');
          if (targets && !targets.childNodes.length) {
            util.el('h4', '', targets, 'Targets');
            for (const s of spec.sliders.filter((s) => s.target !== undefined)) {
              const values = Array.isArray(s.target) ? s.target : [s.target];
              util.el('div', '', targets,
                `${s.label}: ${values.map((v) => env.taskOf('set-slider').helpers.scale.fmt(s, v)).join(' – ')}`);
            }
          }
          return out;
        },
        minorTicks: (base, S) => (ctx, w, ticks) => {
          if (w.g.vertical || w.s.log || w.s.stops) return;
          const tickValues = S.P.tickValues(w.s, env.taskOf('set-slider').helpers.scale, w.g.tickCount, w.L, false);
          for (let k = 0; k < tickValues.length - 1; k++) {
            for (let m = 1; m < 5; m++) {
              const value = tickValues[k] + ((tickValues[k + 1] - tickValues[k]) * m) / 5;
              const tick = ctx.util.el('div', 'slc-minor', ticks);
              tick.style.left = w.frac(value) * w.L + 'px';
            }
          }
        },
      },
    },
  });
})();
