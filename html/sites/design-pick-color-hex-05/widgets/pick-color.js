// Restore this design's viewport-sized picker and compact parsed color readouts.
env.widget({
  task: 'pick-color',
  site: 'design-pick-color-hex-05',
  name: 'design',
  split: 'train',
  scenarios: ['hex'],
  traits: { controls: 'sv+hue' },
  template: 'pick-color/picker',
  design: {
    css: '',
    unitHeight: null,
    resetEvent: null,
    sideRows: 'none',
    editableRows: false,
    measured: false,
    svStyle: null,
    hueStyle: null,
    knobStyle: null,
    sideCurrentLabel: 'Current Colour',
    currentClass: 'cp-box cur',
    targetClass: 'cp-box tgt',
    parts: {
      fit: (base, S) => (ctx, card, maxH) => {
        const g = base(ctx, card, maxH);
        const size = Math.max(S.task.helpers.MIN_TRACK_PX,
          Math.min(Math.round(ctx.size.height * 0.865), maxH + 76));
        return {
          ...g,
          W: Math.round(size * 0.975),
          H: size,
          hueH: size,
          hueW: Math.round(size * 0.127),
          knob: Math.round(size * 0.055),
        };
      },
      target: (base, S) => (ctx, side, targetHost) => {
        const { util, spec } = ctx;
        if (!spec.showCode) return;
        const target = util.el('div', 'cp-box tgt', targetHost || side);
        util.el('div', 'cp-box-label', target, 'Target Colour');
        const text = String(spec.code);
        const color = /^#?[0-9a-f]{6}$/i.test(text)
          ? (text[0] === '#' ? text : '#' + text)
          : (spec.hex || text);
        util.el('div', 'cp-swatch', target).style.background = color;
        let match = /([0-9a-f]{6})/i.exec(text);
        const rgbMatch = /rgb\D*(\d+)\D+(\d+)\D+(\d+)/i.exec(text);
        if (rgbMatch) {
          match = [0, [1, 2, 3].map((i) =>
            ('0' + Math.min(255, +rgbMatch[i]).toString(16)).slice(-2)).join('')];
        }
        let hue = '—', saturation = '—', value = '—';
        if (match) {
          const channels = [0, 2, 4].map((i) => parseInt(match[1].slice(i, i + 2), 16) / 255);
          const max = Math.max(...channels), min = Math.min(...channels), delta = max - min;
          let h = 0;
          if (delta) h = max === channels[0]
            ? ((channels[1] - channels[2]) / delta + 6) % 6
            : max === channels[1]
              ? (channels[2] - channels[0]) / delta + 2
              : (channels[0] - channels[1]) / delta + 4;
          hue = Math.round(h * 60) + '°';
          saturation = Math.round(max ? delta / max * 100 : 0) + '%';
          value = Math.round(max * 100) + '%';
        }
        const values = util.el('dl', 'cp-vals', target);
        for (const [key, val] of [
          ['HEX', match ? '#' + match[1].toUpperCase() : text],
          ['H', hue], ['S', saturation], ['V', value],
        ]) {
          util.el('dt', '', values, key);
          util.el('dd', '', values, val);
        }
      },
      current: (base, S) => (ctx, side) => {
        const { util, rng } = ctx;
        const current = util.el('div', 'cp-box cur', side);
        rng.pick(['Current', 'Selected', 'New color', 'Preview']);
        util.el('div', 'cp-box-label', current, 'Current Colour');
        const swatch = util.el('div', 'cp-swatch', current);
        return { cur: current, current: swatch, rows: {} };
      },
      readout: (base, S) => (ctx, view) => {
        if (ctx.spec.fields) {
          return { el: null, paint() {} };
        }
        const values = ctx.util.el('dl', 'cp-vals', view.cur);
        const cells = {};
        for (const key of ['HEX', 'H', 'S', 'V']) {
          ctx.util.el('dt', '', values, key);
          cells[key] = ctx.util.el('dd', '', values);
        }
        return {
          el: cells.HEX,
          paint(model, rgb) {
            cells.HEX.textContent = S.math.hex(rgb).toUpperCase();
            cells.H.textContent = Math.round(model.h) + '°';
            cells.S.textContent = Math.round(model.s * 100) + '%';
            cells.V.textContent = Math.round(model.v * 100) + '%';
          },
        };
      },
    },
  },
});
