// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    endLabel: (base) => function (rng, content) {
      const sampled = base(rng, content);
      const common = rng.fork('teamhub/common-end').bool(0.5);
      const matched = common === Boolean(sampled.charCodeAt(0) % 2);
      return matched && content.END_LABELS?.includes('Submit') ? 'Submit' : sampled;
    },
    'frame.placement': (base) => function (_c) {
      base(_c);
      if (!_c.ctx.finish && _c.label === 'Submit') _c.placement = 'header';
    },
    'frame.header': (base, S) => function (_c) {
      const { display, lr, nav, rng, util, word } = _c;
      const { K, TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      header.dataset.display = display;
      if (display !== 'header' || nav) {
        rng.pick(TITLES); // preserve the seeded frame draw used by sibling episodes
        const title = 'TeamHub';
        const brand = util.el('div', 'ref-brand', header, word ? word(lr.pick(K.brand)) : title);
        brand.dataset.role = 'brand';
      }
      util.el('div', 'ref-system-status', header, '▰   ◉   ⌕   ▣    Mon Apr 28  10:14 AM');
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
      util.el('span', 'ref-project-icon', identity, 'A');
      const details = util.el('div', 'ref-project-copy', identity);
      util.el('div', 'ref-project-title', details, 'Aurora Labs ⌄');
      util.el('div', 'ref-project-meta', details, '⌁');
      const search = util.el('div', 'ref-project-search', project, '⌕   Search');
      const shortcuts = util.el('div', 'ref-project-shortcuts', project);
      const section = (title, rows) => {
        util.el('div', 'ref-project-section', shortcuts, `${title}  ⌃`);
        for (const [index, [icon, label, active]] of rows.entries()) {
          const item = util.el('div', `ref-project-shortcut${active ? ' is-active' : ''}`, shortcuts);
          util.el('span', `ref-project-shortcut-icon${title === 'Direct messages' ? ` dm-${index}` : ''}`, item, icon);
          util.el('span', 'ref-project-shortcut-label', item, label);
        }
      };
      section('', [['⌂', 'Home'], ['@', 'Mentions'], ['▱', 'Drafts']]);
      section('Channels', [['#', 'general'], ['#', 'product', true], ['#', 'design'], ['#', 'engineering'], ['#', 'research'], ['#', 'marketing']]);
      section('Direct messages', [['●', 'Priya Shah'], ['●', 'Daniel Kim'], ['●', 'Elena Park'], ['●', 'Marcus Lee'], ['●', 'Jenna Kovalski']]);
      section('Apps', [['🗓', 'Calendar'], ['▲', 'Drive'], ['◧', 'Figma'], ['◉', 'GitHub']]);
      Object.assign(_c, { details, headerTools, identity, project, shortcuts, submit });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const inspector = util.el('aside', 'ref-inspector', body);
      util.el('div', 'ref-inspector-title', inspector, '⌕     ▣     ×');
      const meeting = util.el('section', 'ref-inspector-section', inspector);
      const sectionTabs = util.el('div', 'ref-inspector-tabs', meeting);
      util.el('span', 'is-active', sectionTabs, 'Participants');
      util.el('span', '', sectionTabs, 'Breakout Rooms');
      util.el('div', 'ref-inspector-search', meeting, '⌕  Search participants');
      const participants = util.el('section', 'ref-inspector-section ref-participants', inspector);
      util.el('strong', 'ref-inspector-heading', participants, 'In this meeting (6)');
      for (const [person, role, photo] of [['Priya Shah', 'Host', 0], ['Daniel Kim', '', 1], ['Elena Park', '', 2], ['Marcus Lee', '', 3], ['Jenna Kovalski', '', 4], ['Alex Rivera', '', 5]]) {
        const row = util.el('div', 'ref-inspector-person', participants);
        const avatar = util.el('span', `ref-inspector-dot person-${photo}`, row);
        avatar.setAttribute('aria-hidden', 'true');
        const copy = util.el('span', 'ref-inspector-person-copy', row);
        util.el('span', '', copy, person);
        if (role) util.el('small', 'ref-inspector-role', copy, role);
        util.el('span', 'ref-inspector-mic', row, '🎙');
      }
      const rooms = util.el('section', 'ref-inspector-section ref-rooms', inspector);
      const transcript = util.el('section', 'ref-transcript', body);
      const sharedFile = 'Research deck';
      const controls = util.el('div', 'ref-channel-heading', transcript);
      util.el('strong', '', controls, '#  product');
      util.el('span', '', controls, '24 members');
      const tabs = util.el('div', 'ref-transcript-tabs', transcript);
      for (const [name, active] of [['Messages', true], ['Threads', false], ['Files', false]]) {
        util.el('span', `ref-transcript-tab${active ? ' is-active' : ''}`, tabs, name);
      }
      const messages = util.el('div', 'ref-transcript-messages', transcript);
      for (const [person, time, text, attachment] of [
        ['Priya Shah', '9:02 AM', 'Here’s the latest update.', sharedFile],
        ['Daniel Kim', '9:15 AM', 'The user feedback looks great. Let’s discuss it in today’s meeting.', ''],
        ['Elena Park', '9:28 AM', 'I added a few more slides — take a look.', ''],
        ['Marcus Lee', '9:37 AM', 'Sounds good. We can review them during the meeting.', ''],
        ['Jenna Kovalski', '9:50 AM', '👍 Looking forward to it!', ''],
      ]) {
        const message = util.el('article', 'ref-transcript-message', messages);
        const portrait = ['Priya Shah', 'Daniel Kim', 'Elena Park', 'Marcus Lee', 'Jenna Kovalski', 'Alex Rivera'].indexOf(person);
        util.el('span', `ref-transcript-avatar person-${portrait}`, message, person.split(' ').map((part) => part[0]).join(''));
        const copy = util.el('div', 'ref-transcript-copy', message);
        const head = util.el('div', 'ref-transcript-head', copy);
        util.el('strong', '', head, person);
        util.el('span', '', head, time);
        util.el('div', 'ref-transcript-text', copy, text);
        if (attachment) util.el('div', 'ref-transcript-file', copy, `▤  ${attachment}`);
      }
      const composer = util.el('div', 'ref-composer', transcript);
      util.el('div', '', composer, 'Message #product');
      util.el('div', 'ref-composer-tools', composer, '⊕   B   𝘐   ♧   ☻   @');
      const dock = util.el('nav', 'ref-dock', document.body);
      util.el('div', 'ref-dock-title', dock, 'Shared in this channel');
      for (const [icon, title, kind, owner, date] of [['▣', sharedFile, 'Google Slides', 'Priya Shah', 'Apr 25'], ['▤', 'Product plan Q2', 'Google Docs', 'Daniel Kim', 'Apr 20'], ['▦', 'User interview notes', 'Google Sheets', 'Elena Park', 'Apr 18']]) {
        const item = util.el('div', 'ref-dock-item', dock);
        util.el('span', 'ref-dock-icon', item, icon);
        const copy = util.el('div', 'ref-dock-copy', item);
        util.el('strong', '', copy, title);
        util.el('small', '', copy, `${kind} · Updated ${date}`);
        util.el('span', 'ref-dock-owner', item, owner);
        util.el('span', 'ref-dock-date', item, date);
      }
      const visual = util.el('div', 'ref-video-visual', stage);
      for (let i = 0; i < 6; i++) util.el('div', `ref-video-person person-${i}`, visual);
      Object.assign(_c, { controls, dock, inspector, meeting, messages, participants, sharedFile, rooms, stage, tabs, transcript });
    },
  };

  env.site({
    name: 'design-use-chat-meeting-05',
    template: 'site/base',
    design: { parts },
  });
})();
