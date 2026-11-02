// This design keeps the tab site's destination card and scaled intro in each panel.
env.widget({
  task: 'click-control',
  site: 'design-click-control-tab-03',
  name: 'design',
  split: 'train',
  scenarios: ['tab'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      tabButton: () => () => {},
      tabPanel: () => (ctx, p, t, i, links) => {
        const { util } = ctx;
        const prose = util.el('p', 'cd-intro', p);
        const textLength = t.words.reduce((n, word) => n + word.text.length + 1, 0);
        prose.style.setProperty('--intro-scale', Math.min(1, Math.sqrt(175 / Math.max(1, textLength))));
        t.words.forEach((word, j) => {
          if (j) prose.append(' ');
          if (word.link) {
            const a = util.el('span', 'uc-link', prose, word.text);
            a.dataset.key = i + '.' + j;
            a.dataset.role = 'link';
            links.push(a);
          } else prose.append(word.text);
        });
        const feature = util.el('section', 'cd-feature', p);
        util.el('h3', '', feature, 'Featured Destination');
        const body = util.el('div', 'cd-feature-body', feature);
        const photo = util.el('div', 'cd-photo', body);
        photo.setAttribute('role', 'img');
        photo.setAttribute('aria-label', 'Mount Rainier reflected in a forest lake');
        const description = util.el('div', 'cd-feature-description', body);
        util.el('h4', '', description, 'Mount Rainier');
        util.el('p', '', description, 'Towering forests, alpine meadows and breathtaking views make Mount Rainier a must-see destination.');
        util.el('span', 'cd-learn', description, 'Learn more here.');
      },
    },
  },
});
