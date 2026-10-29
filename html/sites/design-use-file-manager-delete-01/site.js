// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const paperHead = util.el('div', 'paper-head', header);
      util.el('div', 'paper-brand', paperHead, 'The Daily Chronicle');
      util.el('div', 'paper-tagline', paperHead, 'N E W S　·　P E R S P E C T I V E　·　A　B R I G H T E R　T O M O R R O W');
      const paperSearch = util.el('div', 'paper-search', paperHead);
      util.el('div', 'paper-date', paperSearch, 'Tuesday, June 14, 2011');
      const searchRow = util.el('div', 'paper-search-row', paperSearch);
      const searchInput = util.el('span', 'paper-search-input', searchRow, 'Search files, folders and articles...');
      util.el('span', 'paper-search-button', searchRow, '⌕');
      S.frameBrand(_c, header);
      Object.assign(_c, { header, paperHead, paperSearch, searchInput, searchRow });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const paperRail = util.el('aside', 'paper-rail', body);
      for (const [icon, label, active] of [['▣','My Drive',true],['♟','Shared with Me'],['◷','Recent'],['★','Starred'],['▧','Photos'],['▤','Documents'],['♫','Music'],['▥','Videos'],['▤','Trash']]) {
        const row = util.el('div', `paper-rail-item${active ? ' active' : ''}`, paperRail);
        util.el('span', 'paper-rail-icon', row, icon);
        util.el('span', '', row, label);
      }
      const paperHero = util.el('section', 'paper-hero', body);
      util.el('div', 'paper-city', paperHero);
      const heroCopy = util.el('div', 'paper-hero-copy', paperHero);
      util.el('div', 'paper-hero-title', heroCopy, 'Your Files, Anywhere');
      util.el('div', 'paper-hero-sub', heroCopy, 'Store, organize and share your documents, photos and more with The Daily Chronicle.');
      const recent = util.el('div', 'paper-recent', paperHero);
      util.el('div', 'paper-recent-title', recent, 'Recent Files');
      for (const [icon, name, date] of [['▤','Article Draft.doc','Jun 14, 2011'],['▧','Budget.xlsx','Jun 13, 2011'],['▣','Festival Poster.jpg','Jun 12, 2011'],['▤','Design Notes.txt','Jun 11, 2011'],['♫','Interview Audio.mp3','Jun 10, 2011']]) {
        const row = util.el('div', 'paper-recent-row', recent);
        util.el('span', 'paper-recent-icon', row, icon);
        util.el('span', 'paper-recent-name', row, name);
        util.el('span', 'paper-recent-date', row, date);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, heroCopy, paperHero, paperRail, recent });
    },
  };

  env.site({
    name: 'design-use-file-manager-delete-01',
    template: 'site/base',
    design: { parts },
  });
})();
