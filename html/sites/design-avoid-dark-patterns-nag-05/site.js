// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task rq-window-head', document.body);
      const title = util.el('div', 'rq-titlebar', header);
      util.el('span', 'rq-appicon', title, '◈');
      util.el('strong', 'rq-title', title, 'Roamquill');
      const windowTools = util.el('div', 'rq-window-controls', title);
      for (const mark of ['−', '□', '×']) util.el('span', '', windowTools, mark);
      const menus = util.el('nav', 'rq-menus', header);
      for (const item of ['File', 'Edit', 'View', 'Places', 'Collections', 'Tools', 'Window', 'Help']) {
        const a = util.el('a', 'rq-menu', menus, item);
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      util.el('span', 'rq-irix', menus, '◉ IRIX');
      const shelf = util.el('nav', 'rq-shelf', header);
      for (const [icon, label] of [['⌂','Home'],['🌐','Explore'],['▰','Places'],['▤','Collections'],['◩','Map'],['⌕','Search']]) {
        const a = util.el('a', 'rq-tool', shelf, ''); a.href = '#';
        const art = util.el('img', 'rq-tool-icon', a); art.src = `sites/design-avoid-dark-patterns-nag-05/assets/${label.toLowerCase()}.png`; art.alt = '';
        util.el('span', 'rq-tool-label', a, label);
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'tool', label }); });
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menus, shelf });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const stats = util.el('aside', 'folio-stats', body);
      const box1 = util.el('section', 'rq-box', stats);
      const collectionTitle = util.el('div', 'folio-stats-title', box1);
      const folderArt = util.el('img', 'rq-list-icon', collectionTitle); folderArt.src = 'sites/design-avoid-dark-patterns-nag-05/assets/collection-title.png'; folderArt.alt = '';
      util.el('span', '', collectionTitle, 'Collections');
      for (const [icon, caption, value] of [['folder','All Places', '248'], ['city','City breaks', '12'], ['mountain','Scenic drives', '18'], ['food','Food & drink', '27'], ['weekend','Weekend ideas', '9']]) {
        const row = util.el('div', 'folio-stats-row', box1);
        const label = util.el('span', 'rq-collection-name', row);
        const art = util.el('img', 'rq-list-icon', label); art.src = `sites/design-avoid-dark-patterns-nag-05/assets/${icon}.png`; art.alt = '';
        util.el('span', '', label, caption);
        util.el('span', '', row, value);
      }
      const box2 = util.el('section', 'rq-box rq-recent', stats);
      const recentTitle = util.el('div', 'folio-stats-title', box2);
      const clockArt = util.el('img', 'rq-list-icon', recentTitle); clockArt.src = 'sites/design-avoid-dark-patterns-nag-05/assets/clock.png'; clockArt.alt = '';
      util.el('span', '', recentTitle, 'Recent Places');
      for (const [i, caption, value] of [[1,'The Glasshouse Bakery','Edinburgh, Scotland'],[2,'Calton Hill','Edinburgh, Scotland'],[3,'St Giles’ Cathedral','Edinburgh, Scotland'],[4,'National Museum of Scotland','Edinburgh, Scotland'],[5,'The Royal Mile','Edinburgh, Scotland']]) {
        const row = util.el('div', 'rq-recent-row', box2);
        const thumb = util.el('img', 'rq-thumb', row); thumb.src = `sites/design-avoid-dark-patterns-nag-05/assets/recent-${i}.png`; thumb.alt = '';
        const copy = util.el('span','',row); util.el('b','',copy,caption); util.el('small','',copy,value);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, stats });
    },
    'frame.panel': (base, S) => function (_c) {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) _c.stats.prepend(panel);
    },
    'frame.stage': (base, S) => function (_c) {
      const stage = _c.util.el('main', 'ref-stage', _c.body);
      S.frameAlign(_c, stage);
      stage.style.justifyContent = 'flex-start';
      stage.style.alignItems = 'flex-start';
      _c.stage = stage;
    },
    'frame.footer': (base, S) => function (_c) {
      base(_c);
      const status = document.querySelector('.ref-foot-text');
      if (status) status.textContent = 'Roamquill　·　Ready';
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-nag-05',
    template: 'site/base',
    design: { parts },
  });
})();
