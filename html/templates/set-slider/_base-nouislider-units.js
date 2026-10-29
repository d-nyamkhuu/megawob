/* set-slider/_base-nouislider-units: default reference units; __scope supplies the original overridable bindings. */
(function () {
  'use strict';
  env.template('set-slider/_base-nouislider-units', () => {
    function ensureStyle(__scope) {
        const { CSS } = __scope;
        if (document.getElementById('nu-style')) return;
        const s = document.createElement('style');
        s.id = 'nu-style';
        s.textContent = CSS;
        document.head.append(s);
    }

    function placeIn(__scope, ctx, el, rng, pad = 12) {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const freeX = Math.max(0, ctx.size.width - w - 2 * pad);
        const freeY = Math.max(0, ctx.size.height - h - 2 * pad);
        const c01 = (f) => Math.min(1, Math.max(0, f));
        const fx = c01(rng.pick([0, 0.5, 0.5, 1]) + rng.float(-0.15, 0.15));
        const fy = c01(rng.pick([0, 0.5, 0.5, 1]) + rng.float(-0.15, 0.15));
        const st = ctx.stage.getBoundingClientRect();
        const fixed = [...document.querySelectorAll('[data-role="submit"]')]
          .filter((b) => getComputedStyle(b).position === 'fixed').map((b) => b.getBoundingClientRect());
        const hits = (x, y) => fixed.some((r) => st.left + x < r.right + 6 && st.left + x + w > r.left - 6 && st.top + y < r.bottom + 6 && st.top + y + h > r.top - 6);
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

    function makeNu(__scope, ctx, parent, index, s, g) {
        const { env, POS, KEYS, center } = __scope;
        const { util, spec } = ctx;
        const S = env.taskOf('set-slider').helpers.scale;
        const L = g.length;
        const vertical = g.vertical;
        const fmt = (v) => S.fmtU(s, v);
        const pos = (v) => S.frac(s, v) * POS;
        const val = (p) => S.valueAt(s, Math.min(1, Math.max(0, p / POS)));
        const wrap = util.el('div', vertical ? 'nu-col' : 'nu-row-cell', parent);
        if (!vertical) wrap.style.display = 'contents';
        util.el('div', 'nu-label', wrap, s.label);
        const box = util.el('div', 'nu-wrap', wrap);
        const target = util.el('div', '', box);
        target.dataset.role = 'track';
        Object.assign(target.style, vertical ? { height: L + 'px' } : { width: L + 'px' });
        const readout = g.readout ? util.el('div', 'nu-readout', wrap) : null;
        const n = ctx.model.values[index].length;
        const tip = (to) => ({ to: (x) => to(Number(x)) });
        const options = {
          start: ctx.model.values[index].map(pos),
          range: { min: 0, max: POS },
          step: 0.1,
          connect: n === 2 ? true : [true, false],
          orientation: vertical ? 'vertical' : 'horizontal',
          direction: vertical ? 'rtl' : 'ltr',
          behaviour: spec.allowTrackClick ? 'tap-drag' : 'drag',
          animate: false,
          keyboardSupport: false,
          tooltips: g.tooltips ? ctx.model.values[index].map(() => tip((p) => fmt(val(p)))) : false,
        };
        if (s.stops) {
          options.pips = { mode: 'values', values: s.stops.map((_, i) => (i / (s.stops.length - 1)) * POS), density: 100, stepped: true,
            format: { to: (p) => s.stops[Math.round((p / POS) * (s.stops.length - 1))] } };
        } else if (g.pips) {
          options.pips = { mode: 'values', values: g.pipValues.map(pos), density: 100, stepped: true,
            format: { to: (p) => S.fmt(s, val(p)) } };
        }
        const api = noUiSlider.create(target, options);
        const handles = [...target.querySelectorAll('.noUi-handle')];
        handles.forEach((h, j) => { h.dataset.role = 'thumb'; h.dataset.j = j; h.setAttribute('tabindex', spec.keys ? '0' : '-1'); });
        const base = target.querySelector('.noUi-base');
        const paint = (vals) => { if (readout) readout.textContent = vals.map(fmt).join(' – '); };
        // Keep the handles on the snapped values the model holds.
        let syncing = false;
        const setPos = (vals) => {
          syncing = true;
          api.set(vals.map(pos), false);
          syncing = false;
        };
        api.on('slide', (_, handle, un) => {
          if (syncing) return;
          const vals = un.map((p) => val(p));
          for (let j = 1; j < vals.length; j++) vals[j] = Math.max(vals[j], vals[j - 1]);
          const all = ctx.model.values.map((x) => x.slice());
          all[index] = vals;
          ctx.update({ ...ctx.model, values: all });
          paint(vals);
          setPos(vals);
        });
        // A press that is not on a handle is a track click: it jumps a handle in tap-drag mode and does nothing in
        // drag mode; either way it breaks a spec that forbids it.
        target.addEventListener('pointerdown', (e) => {
          if (e.target.closest && e.target.closest('.noUi-handle')) return;
          env.log('track-click', { what: s.label, policy: spec.allowTrackClick ? 'jump' : 'forbidden' });
          if (!spec.allowTrackClick) ctx.flag('track-click');
        }, true);
        handles.forEach((h) => {
          if (!spec.keys) return;
          h.addEventListener('pointerdown', () => h.focus({ preventScroll: true }));
          h.addEventListener('keydown', (e) => {
            if (!KEYS.has(e.key)) return;
            e.preventDefault();
            const v = ctx.model.values[index];
            if (v.length !== 1) return;
            const nv = S.keyApply(s, v[0], e.key);
            if (nv === v[0]) return;
            const all = ctx.model.values.map((x) => x.slice());
            all[index] = [nv];
            ctx.update({ ...ctx.model, values: all });
            paint([nv]);
            setPos([nv]);
          });
          h.addEventListener('focus', () => { if (ctx.model.focus !== index) ctx.update({ ...ctx.model, focus: index }); });
          h.addEventListener('blur', () => { if (ctx.model.focus === index) ctx.update({ ...ctx.model, focus: null }); });
        });
        paint(ctx.model.values[index]);
        return {
          anchor: target,
          locate(value, j) {
            const r = base.getBoundingClientRect();
            const f = S.frac(s, value);
            return vertical ? [r.left + r.width / 2, r.bottom - f * r.height] : [r.left + f * r.width, r.top + r.height / 2];
          },
          locateThumb: (j) => center(handles[j]),
          set(vals) { setPos(vals); paint(vals); },
        };
    }

    function tickValues(__scope, s, S) {
        if (s.log) {
          const out = [];
          for (let v = s.min; v <= s.max * 1.0001; v *= 10) out.push(Number(v.toPrecision(3)));
          return out;
        }
        const k = 4;
        return Array.from({ length: k + 1 }, (_, i) => Number((s.min + (i * (s.max - s.min)) / k).toFixed(S.decimals(s.step))));
    }

    function renderNu(__scope, ctx) {
        const { env, makeNu, tickValues, placeIn } = __scope;
        const { spec, rng, util, size } = ctx;
        const S = env.taskOf('set-slider').helpers.scale;
        const vertical = spec.vertical;
        const n = spec.sliders.length;
        const density = rng.pick(['normal', 'normal', 'dense', 'touch']);
        const look = rng.pick(['flat', 'bevel', 'pill']);
        const tooltips = rng.bool(0.4) && spec.showValue !== true;
        const readout = !tooltips && (rng.bool(0.6) || spec.showValue || spec.norm);
        const anyStops = spec.sliders.some((s) => s.stops);
        const hw = density === 'dense' ? 8 : density === 'touch' ? rng.int(28, 36) : look === 'bevel' ? 18 : 22;
        const hh = density === 'dense' ? 14 : density === 'touch' ? hw : look === 'bevel' ? 30 : 22;
        const rail = density === 'dense' ? 2 : density === 'touch' ? 10 : look === 'bevel' ? 8 : rng.int(5, 8);
        const card = util.el('div', 'nu-card' + (vertical ? ' vertical' : '') + ' nu-' + look + (vertical ? ' nu-v' : '') + (density === 'dense' ? ' nu-dense' : ''), ctx.stage);
        card.style.setProperty('--nu-rail', rail + 'px');
        card.style.setProperty('--nu-hw', hw + 'px');
        card.style.setProperty('--nu-hh', hh + 'px');
        // Stop names hang over the track ends.
        const hang = Math.max(0, ...spec.sliders.filter((s) => s.stops).map((s) => Math.max(s.stops[0].length, s.stops[s.stops.length - 1].length) * 4.2));
        if (hang && !vertical) card.style.paddingLeft = card.style.paddingRight = 36 + Math.ceil(hang) + 'px';
        const anyLog = spec.sliders.some((s) => s.log);
        const maxV = Math.max(240, Math.min(420, Math.floor(size.height) - 210));
        const room = Math.floor(size.width) - 120 - 96 - 24 - (readout ? 152 : 0) - 2 * Math.ceil(hang);
        const maxH = Math.max(320, Math.min(780, room));
        const minH = (s) => (s.log ? 440 : s.stops ? Math.max(260, (s.stops.length - 1) * 64) : 320);
        const rl = (s) => (vertical ? rng.int(240, maxV) : rng.int(Math.min(minH(s), maxH), Math.max(minH(s), maxH)));
        const shared = rl(anyLog ? { log: true } : spec.sliders.find((s) => s.stops) || {});
        const group = util.el('div', vertical ? 'nu-row' : 'nu-grid' + (readout ? '' : ' no-readout'), card);
        if (vertical && n >= 3) group.style.gap = '84px';
        if (!vertical) group.style.rowGap = Math.max(46, Math.min(70, Math.floor((size.height - 100) / n) - 50)) + 'px';
        if (!vertical && (density === 'dense' || !anyStops)) group.style.rowGap = Math.max(40, Math.min(64, Math.floor((size.height - 100) / n) - 50)) + 'px';
        const pips = rng.bool(0.5);
        const out = spec.sliders.map((s, i) => makeNu(ctx, group, i, s, {
          vertical, length: spec.norm ? shared : rl(s), readout, tooltips, pips, pipValues: tickValues(s, S),
        }));
        // Room under horizontal tracks for pips / tooltips above.
        if (!vertical && tooltips) card.style.paddingTop = '52px';
        placeIn(ctx, card, rng);
        return out;
    }

    return { ensureStyle, placeIn, makeNu, tickValues, renderNu };
  });
})();
