// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      header.classList.add('folio-header');
      const mast = util.el('div', 'folio-mast', header);
      const brandMark = util.el('span', 'folio-mark', mast, '◧');
      brandMark.setAttribute('aria-hidden', 'true');
      util.el('strong', 'folio-brand', mast, 'Folio Reader');
      const folioNav = util.el('nav', 'folio-nav', mast);
      for (const item of ['Home', 'My Lists', 'Discover', 'People', 'Account']) {
        const a = util.el('a', item === 'Home' ? 'folio-tab active' : 'folio-tab', folioNav, item);
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      const search = util.el('div', 'folio-search', mast, '⌕　Search articles, topics, or people');
      S.frameBrand(_c, header);
      Object.assign(_c, { brandMark, folioNav, header, mast, search });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const stats = util.el('aside', 'folio-stats', document.body);
      util.el('div', 'folio-stats-title', stats, '▥　My reading activity');
      for (const [caption, value] of [['Articles read', '24'], ['Saved to lists', '8'], ['Comments', '3']]) {
        const row = util.el('div', 'folio-stats-row', stats);
        util.el('span', '', row, caption);
        util.el('span', '', row, value);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, stats });
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-nag-01',
    template: 'site/base',
    design: { parts },
  });
})();
