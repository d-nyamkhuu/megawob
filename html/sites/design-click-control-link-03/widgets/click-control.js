// This design lays seeded links out as project-note resources with a short closing note.
env.widget({
  task: 'click-control',
  site: 'design-click-control-link-03',
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
        util.el(
          'p',
          'notebook-intro',
          art,
          'Welcome to the project notes. Use the links below to learn more about each topic.',
        );
        const resources = util.el('ul', 'notebook-resources', art);
        const labels = ['Project overview: ', 'Architecture details: ', 'Design notes: ', 'Release plan: ', 'FAQ: '];
        links.slice(0, 5).forEach((a, i) => {
          const row = util.el('li', '', resources);
          row.append(labels[i % labels.length]);
          row.append(a);
        });
        const closing = util.el('p', 'notebook-closing', art);
        const inlineLinks = links.slice(5);
        if (inlineLinks.length) {
          closing.append('For additional information, visit the ');
          inlineLinks.forEach((a, i) => {
            if (i) closing.append(i === inlineLinks.length - 1 ? ' or ' : ', ');
            closing.append(a);
          });
          closing.append('.');
        } else closing.append('For additional information, visit the documentation or contact the team.');
      },
    },
  },
});
