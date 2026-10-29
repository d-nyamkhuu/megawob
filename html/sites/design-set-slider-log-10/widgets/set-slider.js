// Site design on the shared slider template.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-log-10',
  name: 'design',
  split: 'train',
  scenarios: ['log'],
  template: 'set-slider/classic',
  design: {
    ticks: null, readout: null, native: null, minor: { log: true, tag: 'div', cls: 'slc-minor' },
    parts: {
      placed: () => () => {},
      geometry: () => (ctx, g, s, i, { size, n, card, group, vertical }) => {
        if (s.log && !vertical) {
          const unit = size.width / 1614;
          card.style.setProperty('--instrument-unit', unit + 'px');
          g.length = size.width * .73;
          g.thumbBox = [22 * unit, 35 * unit];
          g.thumb = 35 * unit;
          g.ticks = true;
          g.readout = true;
          g.fmt = (v) => env.taskOf('set-slider').helpers.scale.fmt(s, v);
          group.style.gridTemplateColumns = 'calc(82 * var(--instrument-unit)) auto calc(122 * var(--instrument-unit))';
        }
        // Distractor channels must fit the shallow stage too; keep the main single-channel geometry.
        if (n > 1 && !vertical) {
          card.classList.add('cp-extra-sliders');
          group.style.gridTemplateColumns = `repeat(${n}, minmax(0, 1fr))`;
          g.length = (size.width * .96 - 20 * (n - 1)) / n - 24 - g.thumb;
          g.readout = true;
          g.standalone = true;
        }
      },
      control: (base, S) => (ctx, parent, i, s, g, native) => base(ctx, parent, i, s, g, native && !s.log),
      controlled: () => (ctx, made, s, i, { n, vertical, group }) => {
        if (n > 1 && !vertical) group.lastElementChild.classList.add('cp-extra-control');
      },
      painted: () => (ctx, w, vals) => {
        const { s, index } = w;
        const S = env.taskOf('set-slider').helpers.scale;
        if (s.log && index === 0) {
          const current = S.fmt(s, vals[0]);
          const keyValues = document.querySelectorAll('.p-key .kv span');
          const readoutValues = document.querySelectorAll('.g-tol .kv span');
          if (keyValues[1]) keyValues[1].textContent = S.fmt(s, s.min);
          if (keyValues[3]) keyValues[3].textContent = S.fmt(s, s.max);
          if (keyValues[5]) keyValues[5].textContent = current;
          if (readoutValues[5]) readoutValues[5].textContent = current + ' rev/sec';
          const log = document.querySelector('.cp-log pre');
          if (log) log.textContent = '2004-11-02 14:28:11    Device connected.\n2004-11-02 14:28:13    Calibration mode enabled.\n2004-11-02 14:28:17    Current speed: ' + current + ' rev/sec.';
          const scaleLabels = document.querySelectorAll('.g-scale .nums span');
          scaleLabels.forEach((label, decade) => { label.textContent = S.fmt(s, s.min * Math.pow(10, decade)); });
        }
      },
    },
  },
});
