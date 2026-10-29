// The design keeps this site's three-row image controls and compact slider markup.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-horizontal-05',
  name: 'design',
  split: 'train',
  scenarios: ['horizontal'],
  template: 'set-slider/settings',
  design: {
    rows: 3,
    labels: ['Brightness', 'Sharpness', 'Contrast'],
    min: 0,
    max: 1000,
    order: 'swap',
    ticks: 10,
    fill: false,
    decorative: null,
    parts: {
      settings: (base, S) => (ctx) => {
        const settings = base(ctx);
        if (ctx.spec.sliders.length > 1) {
          ctx.stage.parentElement.classList.add('multi-instrument');
          const fontSize = parseFloat(getComputedStyle(ctx.stage).fontSize);
          settings.style.fontSize = Math.min(fontSize, ctx.size.height / (ctx.spec.sliders.length * 5.6)) + 'px';
        }
        return settings;
      },
      row: () => (ctx, rows, s, i) => {
        const u = ctx.util;
        const scale = env.taskOf('set-slider').helpers.scale;
        const row = u.el('div', 'slider-row', rows);
        u.el('label', 'slider-label', row, s.label);
        u.el('span', 'slider-min', row, scale.fmt(s, s.min));
        const hit = u.el('div', 'slider-hit', row);
        hit.dataset.role = 'track';
        hit.setAttribute('aria-label', s.label);
        u.el('div', 'slider-rail', hit);
        for (let n = 0; n <= 10; n++) {
          const tick = u.el('i', 'slider-tick', hit);
          tick.style.left = (n * 10) + '%';
        }
        const thumb = u.el('div', 'slider-thumb', hit);
        thumb.dataset.role = 'thumb';
        u.el('span', 'slider-max', row, scale.fmt(s, s.max));
        u.el('span', 'slider-cap', row, 'Current Value');
        const readout = u.el('output', 'slider-readout', row);
        return { row, body: row, hit, thumb, readout };
      },
    },
  },
});
