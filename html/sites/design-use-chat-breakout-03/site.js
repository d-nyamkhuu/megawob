// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      const appBrand = util.el('div', 'riverside-brand', header);
      util.el('strong', '', appBrand, '♟ Riverside Project');
      util.el('span', '', appBrand, 'Team Meeting');
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
      Object.assign(_c, { appBrand, header, menubar, titlebar, toolbar, winBtns });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const channels = util.el('aside', 'riverside-channels', body);
      util.el('div', 'riverside-channel-heading', channels, 'Channels');
      for (const [icon, label, active] of [['#','General',false],['#','Project Updates',false],['#','Design',false],['#','Engineering',false],['#','Marketing',false],['#','Team Meeting',true]]) {
        const row = util.el('div', `riverside-channel${active ? ' active' : ''}`, channels);
        util.el('span', 'riverside-channel-icon', row, icon);
        util.el('span', '', row, label);
      }
      util.el('div', 'riverside-channel-heading riverside-dm-heading', channels, 'Direct Messages　＋');
      for (const name of ['Elena Garcia','Marcus Chen','Priya Desai','Noah Kim']) {
        const row = util.el('div', 'riverside-channel riverside-dm', channels);
        util.el('span', 'riverside-online', row, '●');
        util.el('span', '', row, name);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, channels });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);

      // Build the inspector before the widget is measured; it reserves its own space.
      const inspector = util.el('aside', 'riverside-inspector', body);
      util.el('h2', '', inspector, 'Participant Details');
      const detail = util.el('div', 'riverside-inspector-person', inspector);
      const person = _c.ctx.spec.people[0];
      const personName = person ? person.full : 'Team participant';
      util.el('div', 'riverside-inspector-avatar', detail, personName.split(/\s+/).map((s) => s[0]).join('').slice(0, 2));
      util.el('h3', '', detail, personName);
      util.el('div', 'riverside-detail-row', inspector, 'Role　　 Product Designer');
      util.el('div', 'riverside-detail-row', inspector, 'Team　　 Design');
      util.el('div', 'riverside-detail-row', inspector, 'Location　　 Kyiv, Ukraine');
      util.el('div', 'riverside-detail-row', inspector, 'Availability　● In meeting');
      util.el('hr', '', inspector);
      util.el('strong', '', inspector, 'About');
      util.el('p', '', inspector, 'Focuses on user experience and visual design. Interested in workshop discussions and creative brainstorming.');
      const dock = util.el('nav', 'riverside-dock', document.body);
      for (const [icon, label] of [['●','Chat'],['♟','Meetings'],['▦','Calendar'],['▤','Files'],['♟','Contacts']]) {
        const item = util.el('div', 'riverside-dock-item', dock);
        util.el('span', 'riverside-dock-icon', item, icon);
        util.el('span', '', item, label);
      }
      Object.assign(_c, { dock, stage });
    },
  };

  env.site({
    name: 'design-use-chat-breakout-03',
    template: 'site/base',
    design: { parts },
  });
})();
