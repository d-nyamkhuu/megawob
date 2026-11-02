// Keeps this design's proportional swatch picker, reversed hue scale, instrument layout and readouts.
(function () {
  'use strict';

  function toLab(rgb) {
    const lin = (c) => {
      c /= 255;
      return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    };
    const [r, g, b] = rgb.map(lin);
    const xyz = [
      (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047,
      0.2126 * r + 0.7152 * g + 0.0722 * b,
      (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883,
    ];
    const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : ((24389 / 27) * t + 16) / 116);
    const [fx, fy, fz] = xyz.map(f);
    return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
  }

  env.widget({
    task: 'pick-color',
    site: 'design-pick-color-swatch-02',
    name: 'design',
    split: 'train',
    scenarios: ['swatch'],
    traits: { controls: 'sv+hue' },
    template: 'pick-color/picker',
    design: {
      axes: false,
      reverseHue: true,
      sidePlacement: 'sample',
      place: true,
      parts: {
        limits: (base) => (ctx, sideW) => ({
          maxH: Math.floor(Math.min(ctx.size.height * 0.78, ctx.size.width * 0.249, 430)),
          maxW: Math.floor(ctx.size.width) - sideW - 80,
        }),
        fit: (base, S) => (ctx, card, maxH) => {
          const minPx = S.task.helpers.MIN_TRACK_PX;
          const sampledSize = ctx.rng.int(230, 320);
          const size = Math.max(minPx, Math.min(maxH, 430));
          const W = Math.max(minPx, Math.round(size * 0.98));
          const radius = ctx.rng.pick([2, 4, 6]);
          const sampledStripWidth = ctx.rng.int(20, 30);
          const knob = ctx.rng.int(12, 16);
          return {
            W,
            H: size,
            hueH: size,
            hueW: Math.max(22, Math.round(size * 0.118)),
            radius,
            knob,
            sampledSize,
            sampledStripWidth,
          };
        },
        knobStyle: (base) => (g) => {
          const marker = Math.round(g.H * 0.082);
          return {
            width: marker + 'px',
            height: marker + 'px',
            margin: `${-marker / 2}px 0 0 ${-marker / 2}px`,
          };
        },
        hue: (base) => (ctx, card, g) => {
          const control = base(ctx, card, g);
          const paint = control.paint;
          control.paint = (model) => {
            paint(model);
            control.bar.style.backgroundColor = `hsl(${model.h} 100% 50%)`;
          };
          return control;
        },
        layout: (base, S) => (ctx, card) => {
          const { util, size, rng, spec } = ctx;
          const sideW = rng.int(160, 190);
          const { maxH, maxW } = S.P.limits(ctx, sideW);
          S.st = { ctx, card, controls: null, side: null };
          S.P.sideLeft(ctx); // Keep the original placement draw; the site uses a fixed layout band.
          card.style.setProperty('--sw-h', Math.round(maxH * 0.676) + 'px');

          const targetColumn = util.el('div', 'cp-col cp-col-t', card);
          S.st.controls = S.P.picker(ctx, card, maxH, maxW);
          const readouts = util.el('div', 'cp-readouts', card);
          const currentColumn = util.el('div', 'cp-col cp-col-c', card);
          const temp = util.el('div', '', card);
          S.st.side = S.P.side(ctx, temp, sideW);
          const sideParts = Array.from(temp.firstChild.children);
          temp.remove();

          const infoOf = () => {
            const dl = document.createElement('dl');
            dl.className = 'cp-info';
            const rows = {};
            for (const key of ['HEX', 'RGB', 'Lab']) {
              util.el('dt', '', dl, key);
              rows[key] = util.el('dd', '', dl);
            }
            rows.set = (rgb) => {
              rows.HEX.textContent = S.math.hex(rgb).toUpperCase();
              rows.RGB.textContent = rgb.join(', ');
              rows.Lab.textContent = toLab(rgb).map((x) => x.toFixed(1)).join(', ');
            };
            return { dl, rows };
          };
          const targetInfo = infoOf();
          const currentInfo = infoOf();
          if (sideParts.length) {
            const target = sideParts[0];
            target.className = '';
            targetColumn.append(target, targetInfo.dl);
            targetInfo.rows.set(S.math.fromHex(spec.hex));
          }
          const current = sideParts[sideParts.length - 1];
          if (current) {
            const label = current.querySelector('.cp-label');
            if (label) label.textContent = 'Current';
            currentColumn.append(current, currentInfo.dl);
          }

          const makeReadout = (key, unit) => {
            const row = util.el('div', 'cp-ro-row', readouts);
            util.el('span', 'k', row, key);
            const value = util.el('div', 'cp-ro-val', row);
            util.el('span', 'cp-ro-unit', row, unit || '');
            return value;
          };
          const hsv = [makeReadout('H', '°'), makeReadout('S', '%'), makeReadout('V', '%')];
          util.el('div', 'cp-ro-sep', readouts);
          const rgb = [makeReadout('R'), makeReadout('G'), makeReadout('B')];
          util.el('div', 'cp-ro-sep', readouts);
          const hexRow = util.el('div', 'cp-ro-hex', readouts);
          util.el('span', '', hexRow, 'HEX');
          const hex = util.el('span', '', hexRow);

          const paintSide = S.st.side.paint;
          S.st.side.paint = (model) => {
            paintSide(model);
            const channels = S.math.modelRgb(model);
            currentInfo.rows.set(channels);
            hsv[0].textContent = String(Math.round(model.h) % 360);
            hsv[1].textContent = String(Math.round(model.s * 100));
            hsv[2].textContent = String(Math.round(model.v * 100));
            channels.forEach((channel, i) => { rgb[i].textContent = String(channel); });
            hex.textContent = S.math.hex(channels).toUpperCase();
          };
        },
      },
    },
  });
})();
