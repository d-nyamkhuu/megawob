// Design of this site on click-control/controls: keep the notebook accordion's title, chevron, and document rows.
env.widget({
  task: 'click-control',
  site: 'design-click-control-collapsible-08',
  name: 'design',
  split: 'train',
  scenarios: ['collapsible'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    modTitle: 'Module Contents',
    chevron: '<svg viewBox="0 0 16 21" aria-hidden="true"><path d="M2 1L15 10.5L2 20Z"/></svg>',
    parts: {
      colBody: () => (ctx, bd, s, i, links) => {
        const { util } = ctx;
        const descriptions = [
          'Timeline and milestones',
          'Meet the team',
          'Helpful reference link',
          'Brand and writing standards',
          'What’s new',
          'Get help',
        ];
        let linkIndex = 0;
        s.words.forEach((word, j) => {
          if (word.link) {
            const row = util.el('div', 'nb-docrow', bd);
            const icon = util.el('span', 'nb-docicon', row);
            icon.innerHTML = '<svg viewBox="0 0 24 28" aria-hidden="true"><path d="M3 2h12l7 7v17H3Z"/><path d="M15 2v8h7M7 13h10M7 17h10M7 21h7"/></svg>';
            const a = util.el('span', 'uc-link', row, word.text);
            a.dataset.key = `${i}.${j}`;
            a.dataset.role = 'link';
            links.push(a);
            util.el('span', 'nb-docdesc', row, ' – ' + descriptions[linkIndex++ % descriptions.length]);
          } else {
            util.el('span', 'nb-segment', bd, word.text + ' ');
          }
        });
      },
    },
  },
});
