// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      document.body.classList.add('win31-chat');
      const titlebar = util.el('div', 'win31-titlebar', document.body, '▧  TeamTalk - Project Orion');
      const winBtns = util.el('span', 'win31-window-buttons', titlebar);
      for (const glyph of ['−', '□', '×']) util.el('span', 'win31-window-button', winBtns, glyph);
      const menubar = util.el('div', 'win31-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Channel', 'Meeting', 'Tools', 'Window', 'Help']) util.el('span', '', menubar, item);
      const toolbar = util.el('div', 'win31-toolbar', document.body);
      for (const [icon, label] of [['✎', 'New Msg'], ['↶', 'Reply'], ['☻', 'React'], ['▣', 'Meet Now'], ['⊞', 'Breakout Rooms'], ['♟＋', 'Add People'], ['▤', 'Channel Settings']]) {
        const item = util.el('div', 'win31-tool', toolbar);
        util.el('span', 'win31-tool-icon', item, icon);
        util.el('span', '', item, label);
      }
      document.body.insertBefore(titlebar, header);
      document.body.insertBefore(menubar, header);
      document.body.insertBefore(toolbar, header);
      S.frameBrand(_c, header);
      Object.assign(_c, { header, menubar, titlebar, toolbar, winBtns });
    },
  };

  env.site({
    name: 'design-use-chat-breakout-01',
    template: 'site/base',
    design: { parts },
  });
})();
