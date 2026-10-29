// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const header = _c.util.el('header', 'ref-task', document.body);
      S.frameBrand(_c, header);
      const nav = _c.util.el('nav', 'ipad-tabs', header);
      for (const label of ['Home','Accounts','Contacts','Opportunities','Cases','Documents','Reports']) _c.util.el('span', '', nav, label);
      const global = _c.util.el('div', 'ipad-global', header);
      _c.util.el('span', 'ipad-searchbox', global, '⌕　Search...');
      const gi = (cls, svg) => { const s = _c.util.el('span', 'ipad-gicon ' + cls, global); s.innerHTML = svg; };
      gi('', '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="5" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="19" cy="5" r="2"/><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="12" cy="19" r="2"/><circle cx="19" cy="19" r="2"/></svg>');
      gi('', '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a6 6 0 0 0-6 6v4l-2 4v1h16v-1l-2-4V8a6 6 0 0 0-6-6zM9.5 19a2.5 2.5 0 0 0 5 0z"/></svg>');
      _c.util.el('span', 'ipad-avatar', global, 'JD');
      Object.assign(_c, { header });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const fileside = util.el('aside', 'ipad-sidebar', body);
      util.el('div', 'ipad-side-title', fileside, '▤　Files');
      for (const [icon, label, count] of [['▣','All Files','6'],['◷','Recent','6'],['♧','Shared with Me','2'],['☆','Starred','0'],['▣','Archive','18']]) {
        const row = util.el('div', 'ipad-side-row', fileside);
        util.el('b', '', row, icon); util.el('span', '', row, label); util.el('small', '', row, count);
      }
      const storage = util.el('div', 'ipad-storage', fileside);
      util.el('strong', '', storage, 'Storage');
      util.el('div', 'ipad-storage-bar', storage);
      util.el('span', '', storage, '420 MB of 1 GB used');
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, fileside });
    },
  };

  env.site({
    name: 'design-resist-injection-filename-05',
    template: 'site/base',
    design: { parts },
  });
})();
