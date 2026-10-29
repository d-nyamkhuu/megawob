// Notebook design: rectangular controls and a separate live readout strip.
env.widget({
  task: 'pick-color',
  site: 'design-pick-color-hex-02',
  name: 'design',
  split: 'train',
  scenarios: ['hex'],
  traits: { controls: 'sv+hue' },
  template: 'pick-color/picker',
  design: {
    css: '',
    unitHeight: null,
    sideRows: 'none',
    editableRows: false,
    targetClass: '',
    currentClass: '',
    targetLabel: 'Target color',
    sideCurrentLabel: 'Your color (live preview)',
    drawCurrentLabel: true,
    parts: {
      fit: (base, S) => (ctx, card, maxH) => {
        const g = base(ctx, card, maxH);
        const minPx = S.task.helpers.MIN_TRACK_PX;
        const W = Math.max(minPx, Math.floor(ctx.size.width * 0.638));
        const H = Math.max(minPx, Math.floor(ctx.size.height * 0.523));
        return { ...g, W, H, hueH: H, hueW: Math.round(ctx.size.width * 0.0215), radius: 2 };
      },
      svStyle: (base) => (g) => ({ width: g.W + 'px', height: g.H + 'px', borderRadius: '2px' }),
      hueStyle: (base) => (g) => ({ width: g.hueW + 'px', height: g.hueH + 'px', borderRadius: '2px' }),
      knobStyle: (base) => (g) => ({ width: g.knob + 'px', height: g.knob + 'px', margin: `${-g.knob / 2}px 0 0 ${-g.knob / 2}px` }),
      target: (base, S) => (ctx, side) => {
        const { util, spec } = ctx;
        if (!spec.showCode) return;
        const target = util.el('div', '', side);
        util.el('div', 'cp-label', target, 'Target color');
        util.el('div', 'cp-tswatch', target).style.background = spec.code;
        util.el('div', 'cp-code', target, spec.code);
      },
      rendered: (base, S) => (ctx, card) => {
        const { util } = ctx;
        util.el('div', 'nb-curlabel', card, 'Current color');
        const swatch = util.el('div', 'nb-curswatch', card);
        const values = {};
        for (const [key, label, left, width] of [
          ['hex', 'HEX', 16.7, 9.9], ['r', 'R', 28.8, 5.1], ['g', 'G', 35.9, 5.1],
          ['b', 'B', 43.1, 5.1], ['h', 'H', 52.7, 5.2], ['s', 'S', 59.5, 5.2], ['v', 'V', 66.7, 5.4],
        ]) {
          const labelEl = util.el('div', 'nb-flab', card, label);
          labelEl.style.left = left + '%';
          const valueEl = util.el('div', 'nb-fbox', card);
          Object.assign(valueEl.style, { left: left + '%', width: width + '%' });
          values[key] = valueEl;
        }
        util.el('div', 'nb-fsep', card);
        const paintSide = S.st.side.paint;
        S.st.side.paint = (model) => {
          paintSide(model);
          const rgb = S.math.modelRgb(model);
          values.hex.textContent = S.math.hex(rgb).toUpperCase();
          swatch.style.background = S.math.hex(rgb);
          ['r', 'g', 'b'].forEach((key, i) => { values[key].textContent = String(rgb[i]); });
          values.h.textContent = String(Math.round(model.h) % 360);
          values.s.textContent = Math.round(model.s * 100) + '%';
          values.v.textContent = Math.round(model.v * 100) + '%';
        };
      },
    },
  },
});
