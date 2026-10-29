// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const brand = S.frameBrand(_c, header);
      if (!brand) util.el('div', 'ref-brand', header);
      const windowTools = util.el('div', 'window-controls', header);
      for (const mark of ['−', '□', '×']) util.el('span', '', windowTools, mark);
      const menu = util.el('nav', 'gnome-menu', document.body);
      for (const label of ['File', 'Edit', 'View', 'Go', 'Bookmarks', 'Help']) util.el('span', 'gnome-menu-item', menu, label);
      util.el('div', 'gnome-toolbar', document.body);
      Object.assign(_c, { header, menu });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const info = util.el('aside', 'folder-info', body);
      const identity = util.el('div', 'folder-identity', info);
      const badge = util.el('div', 'folder-badge', identity, '📁');
      util.el('strong', 'folder-heading', identity, 'Reference');
      util.el('span', 'folder-kind', identity, 'Folder');
      util.el('span', 'folder-path', identity, '~/Projects/Audio/Reference');
      const stats = util.el('div', 'folder-stats', info);
      for (const [label, value] of [['Items','24'],['Folders','5'],['Files','19'],['Size','2.1 GB'],['Modified','16 Jan 2024, 14:37']]) {
        const row = util.el('div', 'folder-stat', stats); util.el('span', '', row, label); util.el('span', '', row, value);
      }
      util.el('div', 'space-title', info, 'Space usage');
      util.el('div', 'space-meter', info);
      util.el('div', 'space-caption', info, '2.1 GB of 10 GB used');
      Object.assign(_c, { body, info });
    },
    'frame.panel': (base, S) => function (_c) {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      _c.body.classList.remove('ref-panel-right');
      if (panel) _c.info.prepend(panel);
    },
    'frame.floating': (base, S) => function (_c) {
      base(_c);
      if (_c.placement === 'floating' && _c.submit) {
        _c.submit.classList.remove('ref-float');
        _c.headerTools.append(_c.submit);
        document.querySelector('.ref-float-dock')?.remove();
      }
    },
    'frame.footer': (base, S) => function (_c) {
      base(_c);
      const foot = document.querySelector('.ref-foot');
      if (foot && !foot.querySelector('[data-role="submit"]')) {
        for (const button of foot.querySelectorAll('.ref-xtra')) _c.headerTools.append(button);
        foot.remove();
      }
    },
  };

  env.site({
    name: 'design-use-file-manager-multidelete-05',
    template: 'site/base',
    design: { parts },
  });
})();
