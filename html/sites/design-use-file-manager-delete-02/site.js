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
      const { header, util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const paperRail = util.el('aside', 'paper-rail', header);
      for (const [icon, label, active] of [['⌂','Home',true],['▧','Gallery'],['▰','Desktop'],['↓','Downloads'],['▤','Documents'],['▧','Pictures'],['♫','Music'],['▣','Videos']]) {
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
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'explorer-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'explorer-inspector', body);
      const summary = util.el('div', 'inspector-summary', inspector);
      util.el('span', 'inspector-folder', summary, '📁');
      const summaryText = util.el('div', 'inspector-summary-copy', summary);
      util.el('strong', '', summaryText, 'Approved');
      util.el('span', '', summaryText, 'File folder');
      const detail = util.el('section', 'inspector-section', inspector);
      util.el('h3', '', detail, '⌄  Details');
      for (const [label, value] of [['Type:','File folder'],['Location:','C:\\Users\\Alex\\Documents\\Projects'],['Size:','7.1 MB (7 items)'],['Date modified:','Mar 5, 2024, 10:14 AM']]) {
        const row = util.el('div', 'inspector-row', detail);
        util.el('span', '', row, label); util.el('span', '', row, value);
      }
      const properties = util.el('section', 'inspector-section inspector-properties', inspector);
      util.el('h3', '', properties, '⌄  Properties');
      for (const [label, value] of [['Folder contains:','7 items'],['Created:','Feb 15, 2024, 9:03 AM']]) {
        const row = util.el('div', 'inspector-row', properties);
        util.el('span', '', row, label); util.el('span', '', row, value);
      }
      const attributes = util.el('div', 'inspector-attributes', inspector);
      util.el('span', '', attributes, 'Attributes:');
      util.el('div', 'inspector-check', attributes, '☑  Read-only (Only applies to files in folder)');
      util.el('div', 'inspector-check', attributes, '☐  Hidden');
      Object.assign(_c, { attributes, detail, inspector, properties, stage, summary, summaryText });
    },
  };

  env.site({
    name: 'design-use-file-manager-delete-02',
    template: 'site/base',
    design: { parts },
  });
})();
