// Keeps the margin reference card, live value grid, and width based picker geometry.
(function () {
  'use strict';

  env.widget({
    task: 'pick-color',
    site: 'design-pick-color-hex-07',
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
      svStyle: null,
      hueStyle: null,
      knobStyle: null,
      currentClass: 'cur-block',
      sideCurrentLabel: 'Current Color',
      drawCurrentLabel: true,
      parts: {
        limits: (base, S) => (ctx, sideW) => ({
          maxH: Math.floor(ctx.size.height) - 4,
          maxW: Math.floor(ctx.size.width) - sideW - 80,
        }),
        fit: (base, S) => (ctx, card, maxH) => {
          const minPx = S.task.helpers.MIN_TRACK_PX;
          ctx.rng.int(230, 320);
          const W = ctx.size.width * 0.537;
          const H = Math.max(minPx, maxH);
          const radius = ctx.rng.pick([2, 4, 6]);
          const hueW = ctx.rng.int(20, 30);
          const knob = ctx.rng.int(12, 16);
          return { W, H, hueH: H, hueW, radius, knob };
        },
        svRect: (base, S) => (el, g) => {
          const r = el.getBoundingClientRect();
          return { left: r.left, top: r.top, width: g.W - 1, height: g.H - 1 };
        },
        hueGeometry: (base, S) => (ctx, hue, g) => {
          const r = hue.getBoundingClientRect();
          const x = r.left + r.width / 2;
          return { start: [x, r.top], end: [x, r.top + g.H - 1] };
        },
        huePlace: (base, S) => (bar, hue, f, g) => {
          bar.style.top = f * (g.H - 1) + 'px';
        },
        markers: (base, S) => (ctx, knob, hue, model, g) => {
          base(ctx, knob, hue, model, g);
          hue.bar.style.background = S.math.hex(S.math.hsvToRgb(model.h, model.s, model.v));
        },
        target: (base, S) => (ctx, side, targetHost) => {
          const { util, spec } = ctx;
          if (spec.scenario !== 'swatch' && !spec.showCode) return;
          const slot = document.querySelector('.margin-target');
          const target = util.el('div', '', slot || side);
          util.el('div', 'cp-label t-title', target, 'Target Color (for reference)');
          if (spec.scenario === 'swatch') {
            util.el('div', 'cp-swatch', target).style.background = spec.hex;
            return;
          }
          const rgb = S.math.parseColor(spec.code);
          const row = util.el('div', 't-row', target);
          util.el('div', 't-swatch', row).style.background = spec.code;
          const values = util.el('div', 't-vals', row);
          const isHex = /^#[0-9a-f]{6}$/i.test(String(spec.code));
          const lines = [[isHex ? 'Hex' : 'Code', isHex ? String(spec.code).toUpperCase() : String(spec.code).replace(/\s+/g, '')]];
          if (rgb) lines.push(['R', String(rgb[0])], ['G', String(rgb[1])], ['B', String(rgb[2])]);
          for (const [key, value] of lines) {
            const line = util.el('div', !isHex && key === 'Code' ? 'long' : '', values);
            util.el('span', '', line, key);
            util.el('span', '', line, value);
          }
        },
        readout: (base, S) => (ctx, view) => {
          const result = base(ctx, view);
          return {
            el: result.el,
            paint(model, rgb) {
              if (!result.el) return;
              const code = S.math.hex(rgb);
              const hsv = [Math.round(model.h) % 360 + '°', Math.round(model.s * 100) + '%', Math.round(model.v * 100) + '%'];
              const cells = [['Hex', code.toUpperCase(), 'big'], ['R', rgb[0]], ['G', rgb[1]], ['B', rgb[2]], null,
                ['H', hsv[0]], ['S', hsv[1]], ['V', hsv[2]]];
              result.el.innerHTML = '<div class="vals">' + cells.map((cell) => cell
                ? `<span class="k">${cell[0]}</span><span class="${cell[2] || ''}">${cell[1]}</span>`
                : '<span class="sep"></span>').join('') + '</div>';
            },
          };
        },
        placeCard: (base, S) => (card, ctx) => {
          const stage = ctx.stage.getBoundingClientRect();
          const rect = card.getBoundingClientRect();
          const lo = [stage.left - rect.left + 4, stage.top - rect.top + 4];
          const hi = [stage.right - rect.right - 4, stage.bottom - rect.bottom - 4];
          const pick = (a, b) => {
            const offset = ctx.rng.float(b > a ? Math.max(a, -90) : -90, b > a ? Math.min(b, 90) : 90);
            return b > a ? Math.round(offset) : 0;
          };
          card.style.left = pick(lo[0], hi[0]) + 'px';
          card.style.top = pick(lo[1], hi[1]) + 'px';
        },
      },
    },
  });
})();
