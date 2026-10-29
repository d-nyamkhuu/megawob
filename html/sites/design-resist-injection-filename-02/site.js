// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const titlebar = util.el('div', 'ipad-titlebar', header);
      util.el('span', 'ipad-folder-icon', titlebar, '');
      util.el('strong', 'ipad-app-title', titlebar, 'Document Organizer');
      const winControls = util.el('div', 'ol-window-controls', titlebar);
      const winButton = (label, glyph, action) => {
        const b = util.el('button', `ol-window-button ol-${action}`, winControls, glyph);
        b.type = 'button';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => {
          if (action === 'minimize') document.body.classList.toggle('ol-minimized');
          if (action === 'maximize') document.body.classList.toggle('ol-maximized');
          if (action === 'close') document.body.classList.add('ol-window-closed');
        });
        return b;
      };
      winButton('Minimize', '−', 'minimize');
      winButton('Maximize', '□', 'maximize');
      winButton('Close', '×', 'close');
      const launcher = util.el('button', 'ol-window-launcher', document.body, 'Document Organizer');
      launcher.type = 'button';
      launcher.addEventListener('click', () => document.body.classList.remove('ol-window-closed'));
      const menubar = util.el('nav', 'ipad-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'Go', 'Window', 'Help']) util.el('span', '', menubar, item);
      const toolbar = util.el('div', 'ipad-toolbar', header);
      for (const [icon, label] of [['＋','New'],['↑','Upload'],['▱','Move'],['▢','Copy'],['▤','Delete'],['◇','Tag'],['•••','More']]) {
        const tool = util.el('div', 'ipad-tool', toolbar);
        util.el('b', '', tool, icon); util.el('small', '', tool, label);
      }
      util.el('div', 'ipad-search', toolbar, '⌕　 Search files…');
      S.frameBrand(_c, header);
      Object.assign(_c, { header, launcher, menubar, titlebar, toolbar, winButton, winControls });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const fileside = util.el('aside', 'ipad-sidebar', body);
      for (const [icon, label] of [['▣','All Files'],['◷','Recent'],['♧','Shared'],['☆','Starred'],['♜','Trash']]) {
        const row = util.el('div', 'ipad-side-row', fileside);
        util.el('b', '', row, icon); util.el('span', '', row, label);
      }
      util.el('div', 'ipad-side-heading', fileside, 'Folders');
      for (const label of ['Project Phoenix','Client Docs','Research','Archive']) {
        const row = util.el('div', 'ipad-side-row', fileside);
        util.el('b', '', row, '▰'); util.el('span', '', row, label);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, fileside });
    },
  };

  env.site({
    name: 'design-resist-injection-filename-02',
    template: 'site/base',
    design: { parts },
  });
})();
