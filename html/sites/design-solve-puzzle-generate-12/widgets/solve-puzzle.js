env.widget({
  task: 'solve-puzzle',
  site: 'design-solve-puzzle-generate-12',
  name: 'design',
  split: 'train',
  scenarios: ['generate'],
  template: 'solve-puzzle/classic',
  design: {
    currentLabel: 'Current Number:',
    currentLabelClass: 'current-label',
    parts: {
      generatorBody: (base, S) => (box) => {
        const u = S.ctx.util;
        const badge = u.el('div', 'generator-brand', box);
        const mark = u.svg('svg', { viewBox: '0 0 120 120', class: 'wire-cube' }, badge);
        u.svg(
          'path',
          {
            d: 'M60 8 104 31 104 86 60 111 16 86 16 31 60 8 60 62 16 31m44 31 44-31M60 62v49m0-49 44 24M60 62 16 86M38 20v53l44 24V44L38 20m0 53 44-29',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': 5,
          },
          mark,
        );
        u.el('span', 'brand-caption', badge, 'Number Generator');
        const main = u.el('div', 'generator-main', box);
        return main;
      },
      decorated: (base, S) => (box) => {
        const u = S.ctx.util;
        const save = u.el('div', 'save-panel', box);
        u.el('div', 'monitor-icon', save, '▰');
        const saveButton = u.el('button', 'save-view', save, 'Save View');
        saveButton.type = 'button';
        saveButton.addEventListener('click', () => {});
        u.el('p', 'save-caption', save, 'Saves your window layout and appearance preferences only.');
      },
      actionParent: () => (box) => box.querySelector('.generator-main'),
    },
  },
});
