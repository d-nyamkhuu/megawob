// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      header.dataset.display = display;
      if (display !== 'header' || nav) {
        rng.pick(TITLES); // preserve the seeded frame draw used by sibling episodes
        const title = 'TeamTalk';
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
      }
      Object.assign(_c, { header });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      const project = util.el('section', 'ref-project', document.body);
      const identity = util.el('div', 'ref-project-identity', project);
      util.el('span', 'ref-project-icon', identity, '▤');
      const details = util.el('div', 'ref-project-copy', identity);
      util.el('div', 'ref-project-title', details, 'Project Orion');
      util.el('div', 'ref-project-meta', details, 'Engineering   ·   8 members   ·   Team channel');
      util.el('div', 'ref-project-description', details, 'Design, development and launch of Project Orion.');
      const shortcuts = util.el('div', 'ref-project-shortcuts', project);
      for (const [icon, label, count] of [['▤', 'Files', '12'], ['☑', 'Tasks', '7'], ['♟', 'People', '8'], ['⚙', 'Settings', '']]) {
        const item = util.el('div', 'ref-project-shortcut', shortcuts);
        util.el('span', 'ref-project-shortcut-icon', item, icon);
        util.el('span', 'ref-project-shortcut-label', item, label);
        if (count) util.el('span', 'ref-project-shortcut-count', item, count);
      }
      Object.assign(_c, { details, headerTools, identity, project, shortcuts, submit });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'ref-inspector', body);
      util.el('div', 'ref-inspector-title', inspector, 'Meeting Details');
      const meeting = util.el('section', 'ref-inspector-section', inspector);
      util.el('strong', 'ref-inspector-meeting', meeting, 'Project Orion Sync');
      for (const [icon, text] of [['▦', 'Tue, Apr 14, 1987'], ['◷', '10:00 AM – 11:00 AM'], ['♟', '4 in meeting'], ['▤', 'Team channel: Project Orion']]) {
        const row = util.el('div', 'ref-inspector-row', meeting);
        util.el('span', 'ref-inspector-icon', row, icon);
        util.el('span', '', row, text);
      }
      const participants = util.el('section', 'ref-inspector-section', inspector);
      util.el('strong', 'ref-inspector-heading', participants, 'Participants (4)');
      for (const [person, role] of [['Alex Chen', 'Host'], ['Priya Shah', ''], ['Marcus Lee', ''], ['Dana Brooks', '']]) {
        const row = util.el('div', 'ref-inspector-person', participants);
        util.el('span', 'ref-inspector-dot', row);
        util.el('span', '', row, person);
        if (role) util.el('span', 'ref-inspector-role', row, role);
      }
      const rooms = util.el('section', 'ref-inspector-section', inspector);
      util.el('strong', 'ref-inspector-heading', rooms, 'Breakout Rooms');
      for (let i = 1; i <= 3; i++) {
        const row = util.el('div', 'ref-inspector-room', rooms);
        util.el('span', 'ref-inspector-folder', row, '▱');
        util.el('span', '', row, `Room ${i}`);
        util.el('span', 'ref-inspector-count', row, '0');
      }
      const transcript = util.el('section', 'ref-transcript', body);
      const controls = util.el('div', 'ref-meeting-controls', transcript);
      for (const [icon, label] of [['♩', 'Mic'], ['▰', 'Camera'], ['▣', 'Share'], ['♧', 'Raise Hand'], ['♟', 'Breakout Rooms']]) {
        const control = util.el('div', 'ref-meeting-control', controls);
        util.el('span', 'ref-meeting-control-icon', control, icon);
        util.el('span', '', control, label);
      }
      const tabs = util.el('div', 'ref-transcript-tabs', transcript);
      for (const [name, active] of [['Channel', true], ['Threads', false], ['Files', false]]) {
        util.el('span', `ref-transcript-tab${active ? ' is-active' : ''}`, tabs, name);
      }
      const messages = util.el('div', 'ref-transcript-messages', transcript);
      for (const [person, time, text, attachment] of [
        ['Dana Brooks', '9:14 AM', 'Here are the latest mockups for the onboarding flow.', 'onboarding-mockups.gif'],
        ['Marcus Lee', '9:27 AM', 'These look great. Let’s review them in today’s meeting.', ''],
        ['Priya Shah', '9:35 AM', 'I’ve added meeting notes to the channel.', 'Project notes'],
      ]) {
        const message = util.el('article', 'ref-transcript-message', messages);
        util.el('span', 'ref-transcript-avatar', message, person.split(' ').map((part) => part[0]).join(''));
        const copy = util.el('div', 'ref-transcript-copy', message);
        const head = util.el('div', 'ref-transcript-head', copy);
        util.el('strong', '', head, person);
        util.el('span', '', head, time);
        util.el('div', 'ref-transcript-text', copy, text);
        if (attachment) util.el('div', 'ref-transcript-file', copy, `▤  ${attachment}`);
      }
      const dock = util.el('nav', 'ref-dock', document.body);
      for (const [icon, text] of [['●', 'Chat'], ['♟', 'Teams'], ['▦', 'Meetings'], ['▤', 'Files'], ['▣', 'People']]) {
        const item = util.el('div', 'ref-dock-item', dock);
        util.el('span', 'ref-dock-icon', item, icon);
        util.el('span', '', item, text);
      }
      Object.assign(_c, { controls, dock, inspector, meeting, messages, participants, rooms, stage, tabs, transcript });
    },
  };

  env.site({
    name: 'design-use-chat-meeting-01',
    template: 'site/base',
    design: { parts },
  });
})();
