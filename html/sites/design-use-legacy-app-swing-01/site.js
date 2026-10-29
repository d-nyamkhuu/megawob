// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'swing-titlebar', header);
      util.el('div', 'swing-company', titlebar, 'Acme Manufacturing');
      util.el('div', 'swing-appname', titlebar, 'Operations Management System');
      util.el('div', 'swing-meta', titlebar, 'User: jcarter　 |　 Plant: 100　 |　 Apr 24, 2008　10:22 AM');
      const appnav = util.el('nav', 'swing-nav', header);
      for (const [i, item] of ['Home', 'Production', 'Inventory', 'Maintenance', 'Master Data', 'Reports', 'Administration'].entries()) {
        const a = util.el('a', `swing-navlink${i === 3 ? ' active' : ''}`, appnav, item);
        a.href = '#';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      }
      S.frameBrand(_c, header);
      Object.assign(_c, { appnav, header, titlebar });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { ctx, display, header, titlebar, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      const headerNote = header.querySelector('.ref-instruction');
      if (headerNote) { headerNote.classList.add('swing-instruction'); titlebar.appendChild(headerNote); }
      Object.assign(_c, { headerNote });
    },
  };

  env.site({
    name: 'design-use-legacy-app-swing-01',
    template: 'site/base',
    design: { parts },
  });
})();
