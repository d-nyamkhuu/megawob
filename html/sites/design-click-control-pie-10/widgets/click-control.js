// This design scales the pie, adds blue gradients and a nine-dot hub, and closes it from Reset.
env.widget({
  task: 'click-control',
  site: 'design-click-control-pie-10',
  name: 'design',
  split: 'train',
  scenarios: ['pie'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    outerInset: 6,
    gapOuter: .55,
    gapInner: 1.4,
    pieMin: 150,
    pieMax: 464,
    pieHSub: 12,
    pieWSub: 12,
    innerFrac: .135,
    parts: {
      pieDefs: (base, S) => (ctx, svg) => {
        const { util } = ctx;
        const defs = util.svg('defs', {}, svg);
        const sectorGradient = util.svg('radialGradient', { id: 'vista-sector', cx: '.35', cy: '.25', r: '.9' }, defs);
        util.svg('stop', { offset: '0', 'stop-color': '#eef7ff' }, sectorGradient);
        util.svg('stop', { offset: '.5', 'stop-color': '#dcecff' }, sectorGradient);
        util.svg('stop', { offset: '1', 'stop-color': '#b9d9fc' }, sectorGradient);
        const knobGradient = util.svg('linearGradient', { id: 'vista-knob', x2: '0', y2: '1' }, defs);
        util.svg('stop', { offset: '0', 'stop-color': '#e9ebee' }, knobGradient);
        util.svg('stop', { offset: '1', 'stop-color': '#bdc1c5' }, knobGradient);
      },
      sliceLabel: () => (ctx, g, text, path, label, i, x, y, size) => {
        text.style.fontSize = `${size * .082}px`;
        text.textContent = label;
      },
      knobRadius: () => (size) => size * .12,
      plus: (base, S) => (spread, c, size) => {
        const util = S.ctx.util;
        const plus = util.svg('g', { class: 'uc-spread-i' }, spread);
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            util.svg('rect', {
              x: c + (col - 1) * size * .036 - size * .011,
              y: c + (row - 1) * size * .036 - size * .011,
              width: size * .022,
              height: size * .022,
              rx: size * .006,
            }, plus);
          }
        }
        return plus;
      },
      pieShow: () => (area) => (el, open) => {
        el.style.display = open ? '' : 'none';
        if (open) area.setAttribute('data-open', 'true');
        else area.removeAttribute('data-open');
      },
      pieBound: () => (ctx, content, up) => {
        const reset = document.querySelector('.reset');
        if (reset) reset.addEventListener('click', () => up({ open: false }));
      },
    },
  },
});
