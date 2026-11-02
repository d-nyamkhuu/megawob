// This design gives each tab a welcome page with three resource cards.
env.widget({
  task: 'click-control',
  site: 'design-click-control-tab-05',
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
        util.el('h2', 'welcome', p, 'Welcome');
        util.el('p', 'welcome-subtitle', p, 'Explore the tabs above to find useful information.');
        util.el('h3', 'featured-title', p, 'Featured Resources');
        const grid = util.el('div', 'resource-grid', p);
        const art = [
          '<path d="M9 4h10l8 8v19a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z"/><path d="M19 4v9h8" fill="none" stroke="#d5e2ff" stroke-width="1.5"/>',
          '<circle cx="12" cy="12" r="5"/><circle cx="25" cy="12" r="5"/><path d="M1 31v-3a11 11 0 0 1 22 0v3Zm24 0v-3a14 14 0 0 0-4-10c9-2 15 3 15 10v3Z"/>',
          '<rect x="5" y="21" width="6" height="12" rx="2"/><rect x="15" y="14" width="6" height="19" rx="2"/><rect x="25" y="7" width="6" height="26" rx="2"/>',
        ];
        const bodies = ['Project Guide', 'Our Team', 'Latest Updates'].map((title, k) => {
          const card = util.el('section', 'resource-card resource-' + k, grid);
          const icon = util.el('div', 'resource-icon', card);
          icon.innerHTML = '<svg viewBox="0 0 36 38" aria-hidden="true">' + art[k] + '</svg>';
          const body = util.el('div', 'resource-body', card);
          util.el('h4', '', body, title);
          return util.el('div', 'resource-copy', body);
        });
        t.words.forEach((word, j) => {
          const body = bodies[Math.min(2, Math.floor((j * 3) / t.words.length))];
          const line = util.el('div', word.link ? 'resource-link' : 'resource-text', body);
          if (word.link) {
            const a = util.el('span', 'uc-link', line, word.text);
            a.dataset.key = i + '.' + j;
            a.dataset.role = 'link';
            links.push(a);
          } else line.append(word.text);
        });
      },
    },
  },
});
