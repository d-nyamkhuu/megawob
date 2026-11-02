// Design on the choose-option/widgets template.
(function () {
  'use strict';
  const SWATCH = {
    'Forest Green': '#2d6a1e',
    Gold: '#f5c518',
    Grape: '#7b22a8',
    Indigo: '#3b2bd0',
    Lavender: '#b48cf0',
    Lime: '#6cd04a',
    Maroon: '#6a0a0a',
    Mint: '#8af0c8',
    Navy: '#0a1a6a',
    Olive: '#556b0f',
    Orange: '#f57c10',
    Peach: '#f5a08a',
    Pink: '#f060b8',
    Plum: '#7a2080',
    Red: '#e02030',
    Sage: '#7fa070',
    Sand: '#c8b490',
    'Sky Blue': '#6aa4f0',
    Cherry: '#c0102a',
    Cream: '#f5efc8',
  };
  env.widget({
    task: 'choose-option',
    site: 'design-choose-option-listbox-03',
    name: 'design',
    split: 'train',
    scenarios: ['listbox'],
    template: 'choose-option/widgets',
    design: {
      railClass: null,
      arrows: false,
      integralRows: false,
      parts: {
        geometry: () => (ctx) => {
          const scale = Math.min(1, ctx.size.width / 1178);
          return { scale, rowH: 25 * scale, H: Math.min(453 * scale, ctx.size.height - 40), border: 2 };
        },
        rowDecoration: () => (ctx, controls, r, o) => {
          const { util } = ctx;
          const sq = util.el('span', 'ds-sq', r);
          sq.style.background =
            SWATCH[o] || 'hsl(' + Array.from(o).reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 360, 7) + ',65%,48%)';
        },
        rowsDone: () => (ctx, controls) => {
          const { util, spec } = ctx;
          const { list, H, rowH } = controls;
          const scrollRoom = util.el('div', 'fp-scroll-room', list);
          scrollRoom.setAttribute('aria-hidden', 'true');
          scrollRoom.style.height = Math.max(0, H - spec.rows * rowH) + 'px';
          scrollRoom.style.pointerEvents = 'none';
        },
        rail: (base) => (ctx, controls) => {
          const rail = base(ctx, controls);
          rail.track.style.setProperty('--arrow-height', 23 * controls.scale + 'px');
          return rail;
        },
        scrollOptions: (base) => (ctx, controls) => ({ ...base(ctx, controls), pad: 23 * controls.scale }),
      },
    },
  });
})();
