// Design on the shared resist-injection workspace.
env.widget({
  task: 'resist-injection',
  site: 'design-resist-injection-chat-03',
  name: 'design',
  split: 'train',
  scenarios: ['chat'],
  template: 'resist-injection/classic',
  design: {
    parts: {
      panes: (base, S) => (ctx) => {
        const P = S.P, el = (tag, cls, parent, text) => ctx.util.el(tag, cls, parent, text);
        const body = el('div', 'si-body si-chat-body', S.app); S.body = body;
        P.sourcePane(ctx); P.editorPane(ctx); P.savePane(ctx); P.statusPane(ctx);
      },
      sourceChat: (base, S) => (ctx) => {
        const s = S.spec, P = S.P, parent = S.source;
        const el = (tag, cls, host, text) => ctx.util.el(tag, cls, host, text);
        const frame = el('div', 'wb-chat-layout', parent);
        const main = el('div', 'wb-chat-main', frame);
        const title = el('h2', '', main, s.sourceTitle);
        const list = el('div', 'wb-conversation-list', main);
        const head = el('div', 'wb-conversation-head', list);
        for (const label of ['From', 'Subject', 'Time']) el('b', '', head, label);
        (s.items || []).slice(0, 3).forEach((item, i) => {
          const row = el('div', `wb-conversation-row${i === 0 ? ' selected' : ''}`, list);
          el('span', '', row, item.by || 'Team member');
          el('span', '', row, i === 0 ? 'Vendor update' : (i === 1 ? 'Room options' : 'Re: launch plan'));
          el('span', '', row, ['09:12', '09:28', '09:41'][i]);
        });
        const messages = el('div', 'wb-messages', main);
        (s.items || []).forEach((item, i) => P.chatItem(messages, item, i));
        const schedule = el('aside', 'wb-schedule', frame);
        el('h3', '', schedule, 'Pinned: Launch Planning Schedule');
        const table = el('table', 'wb-schedule-table', schedule);
        const trh = el('tr', '', table);
        for (const label of ['Day', 'Room', 'Notes']) el('th', '', trh, label);
        const row = el('tr', '', table);
        el('td', '', row, s.day || 'Planning day');
        el('td', '', row, s.room || 'Meeting room');
        el('td', '', row, 'Seats available · A/V');
        const tips = el('aside', 'wb-tips', frame);
        el('div', 'wb-tips-title', tips, 'ℹ  Tips');
        const tipList = el('ul', '', tips);
        for (const text of ['Use the scroll bars to read more messages or the full schedule.', 'Type your reply in the box below.', 'Press Send to post your message to this channel.']) el('li', '', tipList, text);
      },
    },
  },
});
