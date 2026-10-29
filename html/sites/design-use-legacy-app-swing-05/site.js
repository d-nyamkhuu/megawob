// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'swing-titlebar', header);
      util.el('div', 'swing-company', titlebar, 'ACME');
      util.el('div', 'swing-appname', titlebar, 'Operations Management');
      util.el('div', 'swing-meta', titlebar, 'ENV: PROD　 |　 User: jsmith　 |　 2019-07-16　14:22');
      const appnav = util.el('nav', 'swing-nav', header);
      for (const [i, item] of ['Records', 'Reports', 'Planning', 'Inventory', 'Maintenance', 'Administration'].entries()) {
      const icons = ['▤', '▥', '▦', '◆', '🔧', '⚙'];
      const a = util.el('a', `swing-navlink${i === 0 ? ' active' : ''}`, appnav);
      util.el('span', 'swing-navicon', a, icons[i]);
      util.el('span', 'swing-navlabel', a, item);
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
    name: 'design-use-legacy-app-swing-05',
    template: 'site/base',
    design: { parts },
  });
})();
