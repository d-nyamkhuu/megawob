// Design on templates/use-chat/workspace.js; defaults preserve the reference scaffold.
env.widget({
  task: 'use-chat',
  site: 'design-use-chat-channel-01',
  name: 'design',
  split: 'train',
  scenarios: ['channel'],
  template: 'use-chat/workspace',
  design: {
    panel: '#ffffff', line: '#c6d7e8', accent: '#587fa8',
    muted: '#6d7083', fg: '#11132d', bg: '#eff5f9',
    font: 'Arial, sans-serif', contextAt: 10000,
    parts: {
      topbar: () => () => {},
      rail: () => () => {},
      // Keep the live channel label used by paint, without a workspace sidebar.
      navigation: (base, S) => parent => {
        const el = S.ctx.util.el('div', 'forum-nav-state', parent);
        return { el, text: S.ctx.util.el('span', '', el) };
      },
      chatHeader: (base, S) => m => {
        const { util: U } = S.ctx, P = S.P;
        const head = U.el('div', 'forum-header', S.main);
        U.el('h2', '', head, '#' + m.name);
        U.el('span', 'forum-member-count', head, m.members.length + ' members');
        const tools = U.el('div', 'forum-header-tools', head);
        const settings = P.button(tools, '', 'settings', { settings: true });
        const gear = U.svg('svg', { viewBox: '0 0 24 24', width: 18, height: 18, 'aria-hidden': 'true' }, settings);
        gear.innerHTML = '<path fill="currentColor" fill-rule="evenodd" d="m10 1 4 0 .7 3 2 .9 2.7-1.5 2.1 3.5-2.2 2 .2 2.2 2.5 1.8-2 3.5-2.9-1-1.9 1.3-.2 3.2h-4l-.7-3-2-.9-2.7 1.5-2.1-3.5 2.2-2L5.5 10 3 8.2l2-3.5 2.9 1L9.8 4zM12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>';
        U.el('span', '', settings, 'Channel Settings');
        const meeting = P.button(tools, '', null, null, 'forum-meeting');
        const camera = U.svg('svg', { viewBox: '0 0 24 24', width: 18, height: 18, 'aria-hidden': 'true' }, meeting);
        camera.innerHTML = '<path fill="currentColor" d="M2 5h13v14H2zm14 4 7-4v14l-7-4z"/>';
        U.el('span', '', meeting, 'Start Meeting');
        U.el('span', 'forum-dropdown', meeting, '▼');
        const topic = U.el('div', 'forum-topic', S.main);
        U.el('b', '', topic, 'Topic:');
        U.el('span', '', topic, m.topic);
      },
      channelTabs: () => () => {},
      message: (base, S) => (parent, msg, i, m) => {
        base(parent, msg, i, m);
        const row = parent.lastElementChild;
        row.classList.add('forum-message', 'forum-current');
        const meta = row.querySelector('.ch-meta');
        row.prepend(meta);
        // Draw the existing conversation excerpt as an indented forum reply.
        const reply = S.spec.threadHistory?.[i]?.[0];
        if (reply && (i === 1 || i === 3)) {
          const U = S.ctx.util, snippet = U.el('div', 'forum-reply', row.querySelector('.ch-messagebody'));
          U.el('strong', '', snippet, S.spec.people[reply.author].full);
          U.el('span', 'forum-reply-time', snippet, reply.time);
          U.el('div', '', snippet, reply.text);
        }
      },
      backgroundMessage: (base, S) => (parent, msg, i) => {
        base(parent, msg, i);
        const row = parent.lastElementChild;
        row.classList.add('forum-message');
        row.prepend(row.querySelector('.ch-meta'));
      },
      fileCard: (base, S) => (parent, file) => {
        const U = S.ctx.util, row = U.el('div', 'forum-file', parent);
        S.P.icon(row, 'clip', 23);
        U.el('span', 'forum-file-link', row, file.name);
        U.el('span', 'forum-file-size', row, '(' + file.size + ')');
        return row;
      },
      composer: (base, S) => (parent, isThread, m) => {
        const U = S.ctx.util, P = S.P;
        const box = U.el('div', 'forum-compose', parent);
        P.field(box, isThread ? 'draft' : 'channelDraft', isThread ? m.draft : m.channelDraft,
          isThread ? 'Reply in thread...' : 'Type a message to #' + m.name + '...', true);
        const row = U.el('div', 'forum-compose-tools', box);
        const attach = P.button(row, '', null, null, 'forum-attach');
        P.icon(attach, 'clip', 23); U.el('span', '', attach, 'Attach');
        U.el('span', 'forum-tool-divider', row);
        for (const [kind, label] of [['bold', 'Bold'], ['italic', 'Italic'], ['underline', 'Underline']]) {
          const b = P.button(row, '', null, null, 'forum-format');
          b.title = label; b.setAttribute('aria-label', label);
          U.el(kind === 'bold' ? 'b' : kind === 'italic' ? 'i' : 'u', '', b,
            kind === 'bold' ? 'B' : kind === 'italic' ? 'I' : 'U');
        }
        U.el('span', 'forum-tool-divider', row);
        P.iconButton(row, 'list', 'List', null, null, 'forum-format');
        P.iconButton(row, 'smile', 'Insert reaction', null, null, 'forum-format');
        P.button(row, isThread && m.replies[m.thread] ? 'Update reply' : 'Send',
          isThread ? 'send' : 'channelSend', isThread ? { send: true } : { channelSend: true }, 'ch-primary forum-send');
      },
    },
  },
});
