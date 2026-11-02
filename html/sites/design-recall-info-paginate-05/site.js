// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const paths = {
    search: '<circle cx="19" cy="19" r="13"/><path d="m29 29 13 13"/>',
    bookmark: '<path d="M12 5h24v37L24 32 12 42Z"/>',
    document: '<path d="M10 3h20l9 10v32H10Z M30 3v11h9 M17 22h15 M17 29h15 M17 36h15"/>',
    star: '<path d="m24 3 6 15 16 1-12 11 4 15-14-9-14 9 4-15L2 19l16-1Z"/>',
    bell: '<path d="M9 36h30l-5-8V18a10 10 0 0 0-20 0v10Z M19 38a5 5 0 0 0 10 0 M21 8V5a3 3 0 0 1 6 0v3"/>',
    gear: '<path d="m20 3-2 6-6 2-6-2-4 7 5 5v6l-5 5 4 7 6-2 6 2 2 6h8l2-6 6-2 6 2 4-7-5-5v-6l5-5-4-7-6 2-6-2-2-6Z"/><circle cx="24" cy="24" r="8"/>',
    minimize: '<path d="M13 27h22"/>',
    maximize: '<path d="M15 16h18v18H15Z M20 11h18v18"/>',
    close: '<path d="m15 15 18 18 M33 15 15 33"/>',
  };
  function drawIcon(node, name) {
    node.innerHTML = `<svg viewBox="0 0 48 48" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.7" stroke-linejoin="miter" stroke-linecap="square">${paths[name]}</svg>`;
  }

  const parts = {
    'frame.body': (base, S) => function (_c) {
      const { content, label, local, rng, sidebar, util } = _c;
      const { K } = S;
      document.body.dataset.metroInstruction = _c.display;
      const windowTools = util.el('div', 'jh-window-buttons', document.body);
      for (const [icon, name] of [['minimize', 'Minimize'], ['maximize', 'Maximize'], ['close', 'Close window']]) {
        const button = util.el('button', `jh-window-button jh-window-${icon}`, windowTools);
        button.type = 'button'; button.title = name; button.setAttribute('aria-label', name);
        drawIcon(button, icon);
        button.addEventListener('click', () => env.log('decoy', { what: 'window', label: name }));
      }
      const body = util.el('div', 'ref-body', document.body);
      const side = util.el('aside', 'jh-sidebar', body);
      const brand = util.el('div', 'jh-brand', side, 'Job Search');
      const recent = util.el('div', 'jh-recent-title', side, 'Recent Searches');
      const sideItems = ['Software Engineer', 'Product Manager', 'Data Analyst', 'UX Designer'];
      for (const label of sideItems) {
        const a = util.el('a', `jh-side-item${label === 'Software Engineer' ? ' active' : ''}`, side, label);
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label }); });
      }
      const navrow = util.el('nav', 'jh-navrow', body);
      for (const [icon, label] of [['search', 'Search'], ['bookmark', 'Saved'], ['document', 'Applications'], ['gear', 'Settings']]) {
        const tab = util.el('button', `jh-tab${label === 'Search' ? ' active' : ''}`, navrow);
        tab.type = 'button';
        drawIcon(util.el('span', 'jh-tab-icon', tab), icon);
        util.el('span', '', tab, label);
        tab.addEventListener('click', () => env.log('decoy', { what: 'nav', label }));
      }
      const search = navrow;
      const stats = util.el('aside', 'jh-outside-stats', body);
      for (const [icon, value, label, color] of [['document', '42', 'Total Results', 'blue'], ['bookmark', '7', 'Saved Jobs', 'green'], ['star', '3', 'Applied', 'purple'], ['bell', '5', 'New This Week', 'teal']]) {
        const card = util.el('div', `jh-out-stat ${color}`, stats);
        drawIcon(util.el('span', 'jh-out-icon', card), icon);
        const copy = util.el('div', 'jh-out-copy', card);
        util.el('b', '', copy, value);
        util.el('span', '', copy, label);
      }
      if (sidebar) {
        const links = util.el('aside', 'ref-side', side);
        for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav)) {
          const a = util.el('a', 'ref-sidelink', links, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body, brand, navrow, search, side, sideItems, tabs: navrow });
    },
  };

  env.site({
    name: 'design-recall-info-paginate-05',
    template: 'site/base',
    design: { parts },
  });
})();
