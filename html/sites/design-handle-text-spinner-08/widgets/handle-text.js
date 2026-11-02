// Site design on templates/handle-text/editor.js; shared behavior and part signatures are documented there.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-spinner-08',
  name: 'design',
  split: 'train',
  scenarios: ['spinner'],
  template: 'handle-text/editor',
  design: {
    parts: {
      spinnerBuilt: (base, S) => (ctx, body) => {
        const { util } = ctx;
        for (const [name, value, unit] of [['Balance', '0', '%'], ['Sample Rate', '44', 'kHz']]) {
          const other = util.el('div', 'ut-fieldrow audio-xtra', body);
          const lab = util.el('div', 'ut-lab', other);
          util.el('span', 'ut-label', lab, name);
          const spin = util.el('div', 'ut-spin stacked', other);
          util.el('span', 'audio-value', spin, value);
          const arrows = util.el('div', 'ut-arrows', spin);
          for (const [direction, svg] of [['up', S.D.upSvg], ['down', S.D.downSvg]]) {
            const b = util.el('button', 'ut-sb', arrows);
            b.type = 'button';
            b.innerHTML = svg;
            b.setAttribute('aria-label', `${name} ${direction}`);
            b.addEventListener('click', () => env.log('decoy', { label: `${name} ${direction}` }));
          }
          util.el('span', 'ut-unit', spin, unit);
        }
        const options = util.el('div', 'audio-options', body);
        const enable = util.el('label', 'audio-enable', options);
        const check = util.el('input', '', enable);
        check.type = 'checkbox';
        check.addEventListener('change', () => env.log('decoy', { label: 'Enable sound output' }));
        util.el('span', '', enable, 'Enable sound output');
      },
    },
  },
});
