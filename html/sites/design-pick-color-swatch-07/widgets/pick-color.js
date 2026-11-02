// Design on templates/pick-color/picker.js.
env.widget({
  task: 'pick-color',
  site: 'design-pick-color-swatch-07',
  name: 'design',
  split: 'train',
  scenarios: ['swatch'],
  traits: { controls: 'sv+hue' },
  template: 'pick-color/picker',
  design: {
    resetSelector: '[data-action="Reset"]',
    parts: {
      fit: (base, S) => (ctx, card) => {
        const bounds = card.getBoundingClientRect();
        const W = Math.max(90, Math.floor(bounds.width * .368));
        const H = Math.round(Math.min(W * 1.08, bounds.height * .925));
        return { W, H, hueH: H, radius: 0, bounds,
          D: Math.round(Math.min(bounds.width * .434, bounds.height * .99)),
          hueW: Math.round(bounds.width * .033), knob: Math.max(18, Math.round(W * .068)) };
      },
      hit: () => (ctx, el, kind, g) => {
        if (kind === 'sv') Object.assign(el.style, { left: g.bounds.width * .49 + 'px', top: g.bounds.height * .025 + 'px' });
      },
      hue: (base, S) => (ctx, card, g) => {
        const { util, spec } = ctx, { D, bounds, hueH } = g, stripW = g.hueW;
        const hueHit = util.el('div', 'cp-hit', card);
        hueHit.dataset.role = 'hue';
        const hue = util.el('div', 'industrial-hue-ring', hueHit);
        Object.assign(hue.style, { width: D + 'px', height: D + 'px' });
        const hueMarker = util.el('div', 'hue-ring-marker', hueHit);
        const huePoint = (h) => {
          const r = hue.getBoundingClientRect(), a = -h * Math.PI / 180;
          return [r.left + D / 2 + Math.sin(a) * D * .425, r.top + D / 2 - Math.cos(a) * D * .425];
        };
        const huePad = env.ui.pad(hueHit, {
          label: 'hue',
          rect: () => { const r = hue.getBoundingClientRect(); return { left:r.left, top:r.top, width:D, height:D }; },
          value: [.5, .075],
          onInput([u, v]) { S.commit({ h: (360 - Math.atan2(u - .5, .5 - v) * 180 / Math.PI) % 360 }); },
        });

        const valueHit = util.el('div', 'cp-hit', card);
        valueHit.dataset.role = 'value';
        Object.assign(valueHit.style, { left: bounds.width * .893 + 'px', top: bounds.height * .025 + 'px' });
        const valueStrip = util.el('div', 'industrial-value', valueHit);
        Object.assign(valueStrip.style, { width: stripW + 'px', height: hueH + 'px' });
        const valueBar = util.el('div', 'value-bar', valueStrip);
        return {
          el: hue, set() {}, locate: huePoint,
          bind() {
            const valueCtl = env.ui.slider(valueHit, {
              label: 'value',
              thumbs: [valueBar],
              values: [ctx.model.v],
              min: 0,
              max: 1,
              keyboard: !!spec.keys,
              geometry() {
                const r = valueStrip.getBoundingClientRect();
                const x = r.left + r.width / 2;
                return { start: [x, r.top + hueH - 1], end: [x, r.top] };
              },
              place: (bar, point, f) => { bar.style.top = (1 - f) * (hueH - 1) + 'px'; },
              onInput([v]) { S.commit({ v }); },
            });
            this.valueCtl = valueCtl;
          },
          paint(m) {
            const a = -m.h * Math.PI / 180;
            Object.assign(hueMarker.style, { left: D / 2 + Math.sin(a) * D * .425 + 'px', top: D / 2 - Math.cos(a) * D * .425 + 'px' });
            valueStrip.style.background = `linear-gradient(to bottom, ${S.math.hex(S.math.modelRgb({ ...m, v: 1 }))}, #000)`;
            this.valueCtl.set([m.v]);
          },
          locateExtra(t, m) { if (t.surface === 'value') return this.valueCtl.locate(t.current ? m.v : t.v); return null; },
        };
      },
      layout: (base, S) => (ctx, card) => {
        const { util, spec } = ctx, st = S.st;
        const top = util.el('div', 'top-row', card);
        const mkBlock = (label, cls) => {
          const blk = util.el('div', 'top-blk ' + cls, top);
          util.el('div', 'blk-label', blk, label);
          const swatch = util.el('div', 'cp-swatch', blk);
          return { blk, swatch };
        };
        const target = mkBlock(spec.targetLabel, 'tb-target');
        const current = mkBlock('Current', 'tb-current');
        const lines = {};
        const rd = util.el('dl', 'readouts', current.blk);
        for (const k of ['Lab', 'sRGB', 'Hex']) {
          util.el('dt', '', rd, k);
          lines[k] = util.el('dd', '', rd);
        }
        util.el('div', 'adjust-head', card, 'Adjust Color');
        const adj = util.el('div', 'adjust-row', card);
        const controlHost = util.el('div', 'picker-controls', adj);
        const vals = util.el('div', 'values-box', adj);
        util.el('div', 'values-title', vals, 'Current Values (display only)');
        const vgrid = util.el('dl', 'values-grid', vals);
        const vf = {};
        for (const k of ['H', 'S', 'V', '-', 'R', 'G', 'B', '-', '#']) {
          if (k === '-') { util.el('div', 'vrule', vgrid); continue; }
          util.el('dt', '', vgrid, k);
          vf[k] = util.el('dd', '', vgrid);
        }
        const pvT = document.querySelector('[data-role="prev-target"]');
        const pvC = document.querySelector('[data-role="prev-current"]');
        const pvTL = document.querySelector('[data-role="prev-target-label"]');
        if (pvTL) pvTL.textContent = spec.targetLabel;
        const paintSwatches = (rgb, m) => {
          current.swatch.style.background = S.math.hex(rgb);
          lines.Lab.textContent = S.math.srgbToLab(rgb).map(c => c.toFixed(1)).join('   ');
          lines.sRGB.textContent = rgb.map(c => Math.round(c)).join('   ');
          lines.Hex.textContent = S.math.hex(rgb).toUpperCase();
          vf.H.textContent = Math.round(m.h) + '  °';
          vf.S.textContent = m.s.toFixed(2);
          vf.V.textContent = m.v.toFixed(2);
          vf.R.textContent = Math.round(rgb[0]);
          vf.G.textContent = Math.round(rgb[1]);
          vf.B.textContent = Math.round(rgb[2]);
          vf['#'].textContent = S.math.hex(rgb).replace('#', '').toUpperCase();
          if (pvC) pvC.style.background = S.math.hex(rgb);
        };
        target.swatch.style.background = S.math.hex(spec.rgb);
        if (pvT) pvT.style.background = S.math.hex(spec.rgb);
        st.controls = S.P.picker(ctx, controlHost, ctx.size.height, ctx.size.width);
        st.side = {
          anchors: [target.swatch, current.swatch], locators: {},
          paint(m) {
            const rgb = S.math.modelRgb(m);
            paintSwatches(rgb, m);
            const delta = document.querySelector('[data-role="color-difference"]');
            if (delta) delta.textContent = S.task.error(m, spec).toFixed(1);
          }
        };
        const randomize = document.querySelector('[data-action="Randomize Current"]');
        if (randomize) randomize.onclick = () => {
          // Advance through a deterministic alternate color sequence without consuming the episode RNG.
          const m = ctx.model;
          S.commit({ h:(m.h + 137.508) % 360, s:.25 + ((m.s + .37) % .7), v:.4 + ((m.v + .23) % .6) });
        };
        const copy = document.querySelector('[data-action="Copy Current Hex"]');
        if (copy) copy.onclick = () => {
          const code = S.math.hex(S.math.modelRgb(ctx.model)).toUpperCase();
          ctx.log('copy-current-hex', { code });
          const ready = document.querySelector('.st-ready');
          if (ready) ready.textContent = 'Copied ' + code;
        };
      },
    },
  },
});
