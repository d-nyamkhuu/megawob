// Design on templates/use-chat/workspace.js; defaults preserve the reference scaffold.
env.widget({
  task: 'use-chat',
  site: 'design-use-chat-thread-02',
  name: 'design',
  split: 'train',
  scenarios: ['thread'],
  template: 'use-chat/workspace',
  design: {
    font: 'Arial, Helvetica, sans-serif', fontSize: '18px', radius: '0px', inset: '0px',
    parts: {
      avatar: (base, S) => (parent, person, cls = '') => {
        const avatar = base(parent, person, cls);
        const index = S.spec.people.findIndex(p => p.full === person.full);
        if (index >= 0) {
          avatar.classList.add('nx-portrait');
          avatar.style.setProperty('--portrait-position', `${(index % 6) * 20}%`);
        }
        return avatar;
      },
      icon: (base, S) => (parent, kind, size = 24) => {
        if (!['thumbsup', 'threads'].includes(kind)) return base(parent, kind, size);
        const svg = S.ctx.util.svg('svg', { viewBox: '0 0 24 24', width: size, height: size, 'aria-hidden': 'true' }, parent);
        svg.innerHTML = '<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
          (kind === 'threads' ? '<path d="M5 4h14q2 0 2 2v10q0 2-2 2h-8l-5 4v-4H5q-2 0-2-2V6q0-2 2-2z"/>' : '<path d="M8 10l4-6q2-3 3 0l-1 5h5q3 0 2 3l-2 8H8zM3 10h5v11H3z"/>') + '</g>';
        return svg;
      },
      topbar: () => () => {},
      rail: () => () => {},
      navigation: (base, S) => () => {
        // No redundant workspace tree in this desktop window. Keep paint's live label.
        const text = S.ctx.util.el('span', '', null, S.spec.channelName);
        return { el: text, text };
      },
      drawChat: (base, S) => m => {
        const { util: U } = S.ctx, P = S.P;
        const sheet = U.el('section', 'nx-sheet', S.main);
        P.chatHeader(m);
        const conv = U.el('div', 'ch-conversation', sheet);
        const channel = U.el('div', 'ch-channel', conv);
        P.feed(channel, m);
        P.composer(channel, false, m);
        if (m.thread !== null) P.threadPanel(conv, m);
        P.contextPanel(S.main, m);
        if (m.menu !== null) P.messageMenu(m);
        if (m.picker !== null) P.reactionPicker(m);
      },
      chatHeader: (base, S) => m => {
        const { util: U, stage } = S.ctx, P = S.P;
        const sheet = S.main.querySelector('.nx-sheet');
        const title = U.el('div', 'nx-titlebar', sheet);
        const heading = U.el('div', 'nx-heading', title);
        U.el('h2', '', heading, '#  ' + m.name);
        if (stage.teamInstruction) heading.append(stage.teamInstruction);
        if (stage.teamTools) title.append(stage.teamTools);
        const meta = U.el('div', 'nx-channelmeta', sheet);
        U.el('span', 'nx-topic', meta, m.topic);
        const members = P.button(meta, `${m.members.length} members`, 'settings', { settings: true }, 'nx-members');
        P.icon(members, 'people', 24);
        const search = U.el('div', 'nx-search', meta);
        P.icon(search, 'search', 22); U.el('span', '', search, 'Search');
      },
      message: (base, S) => (parent, msg, i, m) => {
        const { util: U } = S.ctx, P = S.P;
        const row = U.el('article', 'ch-message nx-message', parent);
        const author = U.el('div', 'nx-author', row);
        const avatar = P.avatar(author, S.spec.people[msg.author]);
        avatar.classList.add('nx-portrait');
        avatar.style.setProperty('--portrait-position', `${(msg.author % 6) * 20}%`);
        const meta = U.el('div', 'ch-meta', author);
        U.el('strong', '', meta, S.spec.people[msg.author].full);
        U.el('span', 'ch-muted', meta, msg.time);
        const body = U.el('div', 'nx-messagecopy', row);
        if (m.pins[i]) U.el('div', 'ch-pin', body, 'Pinned to this channel');
        U.el('div', 'ch-text', body, msg.text);
        const actions = U.el('div', 'ch-actions', row);
        const thread = P.button(actions, '', `thread:${i}`, { openThread: i }, 'ch-threadlink');
        thread.title = 'Reply in thread'; thread.setAttribute('aria-label', `${msg.replies + Number(!!m.replies[i])} replies`);
        P.icon(thread, 'threads', 22); U.el('span', '', thread, msg.replies + Number(!!m.replies[i]));
        const reaction = P.iconButton(actions, 'thumbsup', 'Add reaction to ' + msg.text, `react:${i}`, { picker: i }, 'nx-reaction');
        U.el('span', '', reaction, msg.reactions + Number(!!m.reactions[i]));
        P.iconButton(actions, 'more', 'Message actions for ' + msg.text, `more:${i}`, { menu: i });
      },
      composer: (base, S) => (parent, isThread, m) => {
        const { util: U } = S.ctx, P = S.P;
        const box = U.el('div', 'ch-compose', parent);
        P.field(box, isThread ? 'draft' : 'channelDraft', isThread ? m.draft : m.channelDraft,
          isThread ? 'Reply in thread...' : `Message #${m.name}`, true);
        const row = U.el('div', 'ch-sendrow', box), tools = U.el('div', 'ch-composetools', row);
        for (const [kind, label] of [['clip', 'Attach file'], ['threads', 'Formatting'], ['smile', 'Insert reaction']]) {
          P.iconButton(tools, kind, label, null, null, 'nx-toolbutton');
        }
        P.button(row, isThread && m.replies[m.thread] ? 'Update reply' : 'Send', isThread ? 'send' : 'channelSend',
          isThread ? { send: true } : { channelSend: true }, 'ch-primary');
      },
      contextPanel: (base, S) => (parent, m) => {
        const { util: U } = S.ctx, P = S.P;
        const side = P.pane(U.el('aside', 'nx-inspector', parent), 'context');
        U.el('div', 'nx-inspectortitle', side, 'Channel Details — # ' + m.name);
        const body = U.el('div', 'nx-inspectorbody', side);
        U.el('div', 'nx-channelbadge', body, '#');
        const summary = U.el('div', 'nx-summary', body);
        U.el('strong', '', summary, m.name);
        U.el('div', '', summary, `${m.members.length} members`);
        U.el('p', '', summary, m.topic);
        const properties = U.el('div', 'nx-properties', body);
        P.property(properties, 'Created', 'Mar 3, 1993');
        P.property(properties, 'Created by', S.spec.people[0].full);
        P.property(properties, 'Type', S.spec.visibility + ' channel');
        const notice = U.el('div', 'ch-property', properties);
        U.el('b', '', notice, 'Notifications');
        const notifications = P.button(notice, 'All new messages', null, null, 'nx-notifications');
        U.el('span', '', notifications, '▼');
      },
    },
  },
});
