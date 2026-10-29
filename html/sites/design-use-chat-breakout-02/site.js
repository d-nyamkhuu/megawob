// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { util } = _c;
      const header = util.el('header', 'ref-task', document.body);
      document.body.classList.add('win31-chat');
      const titlebar = util.el('div', 'win31-titlebar', document.body, 'TeamTalk');
      const winBtns = util.el('span', 'win31-window-buttons', titlebar);
      for (const glyph of ['−', '□', '×']) util.el('span', 'win31-window-button', winBtns, glyph);
      document.body.insertBefore(titlebar, header);
      S.frameBrand(_c, header);
      Object.assign(_c, { header, titlebar, winBtns });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const chat = util.el('section', 'aqua-chat', body);
      const channel = util.el('header', 'aqua-channel', chat);
      util.el('strong', '', channel, '# project-alpha');
      util.el('span', '', channel, '8 members');
      const messages = util.el('div', 'aqua-messages', chat);
      const entries = [
        ['Megan Sullivan', '9:02 AM', 'Looking forward to today’s workshop sessions!', 'MS'],
        ['Rohan Kapoor', '9:04 AM', 'Here’s the latest draft for review.', 'RK'],
        ['Elif Demir', '9:08 AM', 'Thanks! This looks great.', 'ED'],
        ['Deepa Banerjee', '9:12 AM', 'Excited for the breakouts this afternoon.', 'DB'],
        ['Alessia Ricci', '9:15 AM', 'I’ll bring a few ideas to discuss.', 'AR'],
        ['Despina Papadopoulos', '9:18 AM', 'Great — see you all there!', 'DP'],
      ];
      for (const [person, time, message, initials] of entries) {
        const row = util.el('article', 'aqua-message', messages);
        util.el('span', 'aqua-avatar aqua-photo aqua-photo-' + entries.findIndex(e => e[0] === person), row, initials);
        const copy = util.el('div', 'aqua-copy', row);
        const byline = util.el('div', 'aqua-byline', copy);
        util.el('strong', '', byline, person);
        util.el('span', '', byline, time);
        util.el('div', 'aqua-message-text', copy, message);
        if (person === 'Rohan Kapoor') {
          const file = util.el('div', 'aqua-file', copy);
          const fileIcon = util.el('span', 'aqua-file-icon', file);
          const paper = util.svg('svg', { viewBox: '0 0 38 49', width: 38, height: 49, 'aria-hidden': 'true' }, fileIcon);
          paper.innerHTML = '<path d="M3 1h22l11 12v33a2 2 0 01-2 2H3a2 2 0 01-2-2V3a2 2 0 012-2z" fill="#b6e2ff" stroke="#168aff"/><path d="M25 1v12h11" fill="#e7f7ff" stroke="#168aff"/><path d="M10 19h16M10 24h18M10 29h18M10 34h12" stroke="#159eff" stroke-width="3"/>';
          const details = util.el('span', 'aqua-file-details', file);
          util.el('span', '', details, 'alpha-roadmap.pdf');
          util.el('small', '', details, '2.4 MB');
        }
      }
      const compose = util.el('div', 'aqua-compose', chat);
      util.el('div', 'aqua-message-input', compose, 'Message #project-alpha…');
      const send = util.el('button', 'aqua-send', compose, 'Send');
      send.type = 'button';
      const composeTools = util.el('div', 'aqua-compose-tools', chat);
      for (const paths of [
        '<path d="M10 18l8-8a4 4 0 00-6-6L3 13a6 6 0 008 8l10-10M6 16L16 6"/>',
        '<circle cx="12" cy="12" r="10"/><path d="M7 14q5 7 10 0M8 8h.1M16 8h.1"/>',
      ]) {
        const icon = util.svg('svg', { viewBox: '0 0 24 24', width: 27, height: 27, 'aria-hidden': 'true' }, composeTools);
        icon.innerHTML = '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">' + paths + '</g>';
      }
      util.el('span', '', composeTools, 'A');
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, channel, chat, compose, composeTools, entries, messages, send });
    },
    // The instruction panel goes in the chat column, between the channel header and the messages, so it takes its
    // own space left of the Breakout Rooms window instead of floating over it.
    'frame.panel': (base) => function (_c) {
      const { body, chat, messages } = _c;
      _c.body = chat;
      base(_c);
      _c.body = body;
      const panel = chat.lastElementChild;
      if (panel && panel.classList.contains('ref-panel')) chat.insertBefore(panel, messages);
    },
  };

  env.site({
    name: 'design-use-chat-breakout-02',
    template: 'site/base',
    design: { parts },
  });
})();
