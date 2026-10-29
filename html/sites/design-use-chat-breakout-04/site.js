// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      document.body.classList.add('win31-chat');
      const titlebar = util.el('div', 'win31-titlebar', document.body);
      util.el('strong', 'th-brand', titlebar, '◉  TeamHub');
      const topnav = util.el('nav', 'th-nav', titlebar);
      for (const [label, active] of [['Chat', false], ['Channels', false], ['Meetings', true], ['Files', false], ['People', false], ['•••', false]]) {
        const item = util.el('span', active ? 'active' : '', topnav, label);
        if (active) item.classList.add('active');
      }
      const winBtns = util.el('span', 'win31-window-buttons', titlebar);
      for (const glyph of ['−', '□', '×']) util.el('span', 'win31-window-button', winBtns, glyph);
      const menubar = util.el('div', 'win31-menubar', document.body);
      for (const item of ['File', 'Edit', 'View', 'Channel', 'Meeting', 'Tools', 'Window', 'Help']) util.el('span', '', menubar, item);
      const toolbar = util.el('div', 'win31-toolbar', document.body);
      const meeting = util.el('div', 'th-meeting-meta', toolbar);
      util.el('strong', '', meeting, 'Product Workshop');
      util.el('span', '', meeting, '10:00 – 11:00　 |　 8 participants');
      for (const [icon, label] of [['♩', 'Mute'], ['◼', 'Stop Video'], ['♟', 'Participants'], ['▦', 'Breakout Rooms'], ['▤', 'Chat'], ['•••', 'More'], ['☎', 'Leave']]) {
        const item = util.el('div', 'win31-tool', toolbar);
        util.el('span', 'win31-tool-icon', item, icon);
        util.el('span', '', item, label);
      }
      document.body.insertBefore(titlebar, header);
      document.body.insertBefore(menubar, header);
      document.body.insertBefore(toolbar, header);
      S.frameBrand(_c, header);
      Object.assign(_c, { header, meeting, menubar, titlebar, toolbar, topnav, winBtns });
    },
    'frame.stage': (base) => function (_c) {
      base(_c);
      const { body, stage, util } = _c;
      const workspace = util.el('div', 'th-workspace', body);
      const task = util.el('div', 'th-task-area', workspace);
      util.el('div', 'th-tabs', task, 'Breakout Rooms　　　 Meeting Details');
      task.appendChild(stage);
      const help = util.el('aside', 'th-help', workspace);
      util.el('h2', 'th-help-title', help, 'Breakout Rooms');
      util.el('h3', 'th-help-heading', help, 'How it works');
      const steps = util.el('ol', 'th-help-list', help);
      for (const text of [
        'Drag participants from the list into a breakout room.',
        'Each participant can be in one room at a time.',
        'You can move participants between rooms at any time.',
        'Rooms will be created when you start the breakout session.',
      ]) util.el('li', '', steps, text);
      util.el('h3', 'th-help-heading th-help-tips', help, 'Tips');
      const tips = util.el('ul', 'th-help-list', help);
      for (const text of [
        'Aim for a balanced number of participants in each room.',
        'You can rename rooms from the … menu.',
        'Participants will see a notification when assigned.',
        'You can join any breakout room as the host.',
      ]) util.el('li', '', tips, text);
    },
  };

  env.site({
    name: 'design-use-chat-breakout-04',
    template: 'site/base',
    design: { parts },
  });
})();
