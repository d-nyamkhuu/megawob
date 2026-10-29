// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';


  const TITLES = ['Aurora Office'];

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      name = 'warm';
      accent = '#92783d';
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { content, local, rng, util } = _c;
      const { K } = S;
      const header = util.el('header', 'ref-task', document.body);
      {
        const title = rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Willow');
        brand.dataset.role = 'brand';
      }
      {
        const n = util.el('nav', 'ref-nav', header);
        const navItems = local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
        const labels = ['Home', 'Documents', 'Presentations', 'Spreadsheets', 'Contacts', 'Calendar'];
        for (const [i, item] of navItems.entries()) {
          const label = labels[i] || item;
          const a = util.el('a', 'ref-navlink', n, label);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
        }
        for (const [i, label] of ['Shared', 'Starred', 'Events', 'People', 'Settings'].entries()) {
          const a = util.el('a', 'ref-navlink ref-nav-extra', n, label);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label }); });
        }
      }
      Object.assign(_c, { header });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      const search = util.el('div', 'ref-search', headerTools);
      util.el('span', 'ref-search-icon', search, '⌕');
      util.el('span', 'ref-search-label', search, 'Search documents');
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, search, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const index = util.el('aside', 'ref-doc-index', body);
      util.el('h1', 'ref-index-title', index, 'Documents');
      const create = util.el('button', 'ref-new-document', index, '＋  New Documents');
      create.type = 'button';
      const folders = util.el('nav', 'ref-folders', index);
      for (const [i, label] of ['All Documents', 'Recent', 'Shared with Me', 'Templates'].entries()) {
        const item = util.el('div', `ref-folder${i === 0 ? ' is-current' : ''}`, folders, label);
        item.dataset.role = 'nav';
      }
      const find = util.el('div', 'ref-index-search', index, '⌕  Search documents…');
      const columns = util.el('div', 'ref-index-columns', index);
      util.el('span', '', columns, 'Name');
      util.el('span', '', columns, 'Modified ↓');
      const records = util.el('div', 'ref-records', index);
      const recordNames = ['Project Plan', 'Q2 Financial Review', 'Team Handbook', 'Client Brief – Acme',
        'Product Roadmap', 'Marketing Strategy', 'Operations Update', 'Research Summary', 'Budget Proposal',
        'Brand Guidelines', 'Stakeholder Notes', 'Launch Plan'];
      const recordDates = ['Today, 10:24 AM', 'Apr 24, 2024', 'Apr 20, 2024', 'Apr 18, 2024', 'Apr 12, 2024',
        'Apr 10, 2024', 'Apr 5, 2024', 'Apr 3, 2024', 'Mar 28, 2024', 'Mar 25, 2024', 'Mar 22, 2024', 'Mar 18, 2024'];
      recordNames.forEach((name, i) => {
        const row = util.el('div', `ref-record${i === 0 ? ' is-current' : ''}`, records);
        util.el('span', 'ref-record-icon', row, '▤');
        util.el('span', 'ref-record-name', row, name);
        util.el('span', 'ref-record-date', row, recordDates[i]);
      });
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, columns, create, find, folders, index, recordDates, recordNames, records });
    },
    'frame.toast': (base, S) => function (_c) {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector(':scope > .ref-note');
        _c.index.insertBefore(note, _c.columns);
      }
    },
    'frame.nav': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-use-slides-trackchanges-03',
    template: 'site/base',
    design: { TITLES, parts },
  });
})();
