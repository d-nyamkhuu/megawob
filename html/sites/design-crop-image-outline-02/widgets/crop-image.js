env.widget({
  task: 'crop-image',
  site: 'design-crop-image-outline-02',
  name: 'design',
  split: 'train',
  scenarios: ['outline'],
  traits: { aspect: 4 / 3 },
  template: 'crop-image/box',
  design: {
    fitMode: 'floor-width',
    insetX: 44,
    insetY: 44,
    inspectorTitle: 'Crop Box',
    measurementSuffix: ':',
    reset: false,
    viewOptions: false,
    parts: {
      fit: (base) => (ctx, tools) => base({ ...ctx, size: {
        width: Math.min(ctx.size.width, ctx.stage.clientWidth),
        height: Math.min(ctx.size.height, ctx.stage.clientHeight),
      } }, tools),
      image: () => (ctx) => {
        const { util } = ctx;
        for (const [axis, arrows] of [['vertical', ['▲', '▼']], ['horizontal', ['◀', '▶']]]) {
          const scroll = util.el('div', 'crop-scrollbar ' + axis, ctx.stage);
          scroll.setAttribute('aria-hidden', 'true');
          util.el('span', 'scroll-arrow', scroll, arrows[0]);
          const track = util.el('span', 'scroll-track', scroll);
          util.el('span', 'scroll-thumb', track);
          util.el('span', 'scroll-arrow', scroll, arrows[1]);
        }
        util.el('div', 'crop-scroll-corner', ctx.stage);
      },
      measurementUnit: () => (ctx, label) => {
        const arrows = ctx.util.el('span', 'measurement-arrows', label);
        ctx.util.el('i', '', arrows, '▲');
        ctx.util.el('i', '', arrows, '▼');
      },
      inspectorTools: (base, S) => (ctx, inspector) => {
        const { util, spec } = ctx;
        util.el('hr', '', inspector);
        util.el('h3', 'target-heading', inspector, 'Target (dashed rectangle)');
        const targetValues = {
          X: Math.round(spec.target.l * S.W), Y: Math.round(spec.target.t * S.H),
          Width: Math.round((spec.target.r - spec.target.l) * S.W),
          Height: Math.round((spec.target.b - spec.target.t) * S.H),
        };
        for (const key of ['X', 'Y', 'Width', 'Height']) {
          const row = util.el('div', 'target-measurement', inspector);
          util.el('span', '', row, key + ':');
          util.el('output', '', row, String(targetValues[key]));
        }
        util.el('hr', '', inspector);
        util.el('h3', 'tools-heading', inspector, 'Tools');
        const palette = util.el('div', 'crop-tool-palette', inspector);
        for (const [label, path] of [
          ['Pointer', 'M8 3V27L14 21L19 31L23 29L18 19H27Z'],
          ['Pan', 'M10 29L4 18Q2 14 6 14L11 19V7Q11 3 14 4L15 16V4Q17 1 19 4V16V6Q22 3 23 7V17V10Q27 6 28 11V24L24 31H14Z'],
          ['Select', 'M5 5H28V28H5Z'],
        ]) {
          const button = util.el('button', 'crop-tool', palette);
          button.type = 'button';
          button.title = label;
          button.setAttribute('aria-label', label);
          const icon = util.svg('svg', { viewBox: '0 0 34 34', width: 34, height: 34 }, button);
          util.svg('path', {
            d: path, fill: label === 'Pointer' ? '#111' : label === 'Pan' ? '#d5d3ca' : 'none',
            stroke: '#111', 'stroke-width': label === 'Pointer' ? 0 : 1.5,
            ...(label === 'Select' ? { 'stroke-dasharray': '3 2' } : {}),
          }, icon);
          button.onclick = () => env.log('decoy', { label });
        }
      },
    },
  },
});
