// Keeps this site's readout and quick swatches while using the shared hex picker.
(function () {
  'use strict';

  const SWATCHES = ['#ff0000', '#ff8f1a', '#ffff00', '#38a818', '#00ffff', '#0a22ff', '#6a4080', '#e050d8', '#a06a58', '#8090b4'];

  env.widget({
    task: 'pick-color',
    site: 'design-pick-color-hex-06',
    name: 'design',
    split: 'train',
    scenarios: ['hex'],
    traits: { controls: 'sv+hue' },
    template: 'pick-color/picker',
    design: {
      css: '',
      currentClass: '',
      sideRows: 'none',
      editableRows: false,
      upperReadout: true,
      resetSelector: '.reset',
      resetScope: 'shell',
      parts: {
        target: (base, S) => (ctx, side, targetHost) => {
          const { util, spec } = ctx;
          if (!spec.showCode) return;
          const target = util.el('div', '', targetHost || side);
          util.el('div', 'cp-label', target, 'Target Color');
          util.el('div', 'cp-swatch', target).style.background = spec.hex;
          util.el('div', 'cp-code', target, spec.code);
          util.el('div', 'cp-tolerance', target, 'ΔE00 ≤ ' + S.task.tolerance(spec).tau);
        },
        rendered: (base, S) => (ctx, card) => {
          const { util } = ctx;
          const readout = util.el('div', 'cp-readout', card);
          S.st.readout = [];
          [['H', 'S', 'V'], ['R', 'G', 'B'], ['#']].forEach((names, gi) => {
            const group = util.el('div', gi === 2 ? 'ro-group last' : 'ro-group', readout);
            for (const name of names) {
              const row = util.el('div', 'ro-row', group);
              util.el('b', '', row, name + ':');
              S.st.readout.push(util.el('span', '', row, ''));
            }
          });
          const swatches = util.el('div', 'cp-swlist', card);
          util.el('h4', '', swatches, 'Swatches');
          const row = util.el('div', 'cp-swrow', swatches);
          for (const color of SWATCHES) {
            const button = util.el('button', '', row);
            button.type = 'button';
            button.setAttribute('aria-label', 'Choose ' + color);
            button.style.background = color;
            button.onclick = () => S.commitRgb(S.math.parseColor(color));
          }
        },
        sidePaint: (base, S) => (ctx, view, model) => {
          const rgb = S.math.modelRgb(model);
          const channels = S.math.channels(model).map((x) => Math.round(x));
          const values = [Math.round(model.h) % 360, Math.round(model.s * 100), Math.round(model.v * 100),
            channels[0], channels[1], channels[2], S.math.hex(rgb).slice(1).toUpperCase()];
          S.st.readout.forEach((el, i) => { el.textContent = String(values[i]); });
        },
        markers: (base) => (ctx, knob, hue, model) => {
          Object.assign(knob.style, {
            left: `calc(${model.s} * (100% - 1px))`,
            top: `calc(${1 - model.v} * (100% - 1px))`,
          });
        },
        huePlace: (base) => (bar, hue, fraction) => {
          bar.style.top = `calc(${fraction} * (100% - 1px))`;
        },
      },
    },
  });
})();
