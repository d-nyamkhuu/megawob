// This design presents the seeded article links as a notebook resource list.
env.widget({
  task: 'click-control',
  site: 'design-click-control-link-08',
  name: 'design',
  split: 'train',
  scenarios: ['link'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      linkDecor: (base, S) => (ctx, art, links) => {
        const { util } = ctx;
        S.P.clearArticle(art);
        util.el('p', 'notebook-intro', art, 'Here are some helpful links for getting started:');
        const resources = util.el('ul', 'notebook-resources', art);
        const labels = [
          'Return to the main page.',
          'University information and tools.',
          'Search books and journals.',
          'Campus maps and directions.',
          'Find faculty and staff.',
          'Upcoming seminars and activities.',
        ];
        links.forEach((a, i) => {
          const row = util.el('li', '', resources);
          row.append(a);
          util.el('span', 'ol-dash', row, '–');
          row.append(labels[i % labels.length]);
        });
        util.el('hr', 'ol-rule', art);
        const closing = util.el('p', 'notebook-closing', art, 'For more information, visit our ');
        util.el('span', 'ol-fakelink', closing, 'contact page');
        closing.append('.');
      },
    },
  },
});
