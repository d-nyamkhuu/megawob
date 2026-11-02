// Design on templates/use-chat/workspace.js; defaults preserve the reference scaffold.
env.widget({
  task: 'use-chat',
  site: 'design-use-chat-channel-05',
  name: 'design',
  split: 'train',
  scenarios: ['channel'],
  template: 'use-chat/workspace',
  design: {
    panel: '#f7f3e9', line: '#c9bfac', accent: '#641d20',
    muted: '#71675b', fg: '#20202a', bg: '#eee5d1',
    font: 'Georgia, "Times New Roman", serif', contextAt: 10000,
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
        const title = U.el('div', 'forum-heading', head);
        U.el('h2', '', title, '# ' + m.name);
        U.el('div', 'forum-subtitle', title, m.topic);
        const tools = U.el('div', 'forum-header-tools', head);
        const count = U.el('span', 'forum-member-count', tools);
        P.icon(count, 'people', 20);
        U.el('span', '', count, String(m.members.length));
        const meeting = P.button(tools, '', null, null, 'forum-meeting');
        const camera = U.svg('svg', { viewBox: '0 0 24 24', width: 18, height: 18, 'aria-hidden': 'true' }, meeting);
        camera.innerHTML = '<path fill="currentColor" d="M2 5h13v14H2zm14 4 7-4v14l-7-4z"/>';
        U.el('span', '', meeting, 'Start Meeting');
        U.el('span', 'forum-dropdown', meeting, '▼');
        // Static inspector and column frame shows the live channel name and topic.
        const active = document.querySelector('.ref-col-active');
        if (active) active.textContent = '# ' + m.name;
        const nameBox = document.querySelector('.ref-col-name');
        if (nameBox) nameBox.textContent = m.name;
        const topicBox = document.querySelector('.ref-col-topic');
        if (topicBox) topicBox.textContent = m.topic;
        const roster = document.querySelector('.ref-col-roster');
        if (roster) {
          roster.replaceChildren();
          for (const id of m.members) {
            const person = S.spec.people[id];
            if (!person) continue;
            const row = U.el('div', 'ref-col-row ref-col-member', roster);
            P.avatar(row, person, 'ref-person-avatar');
            U.el('span', '', row, person.full);
            if (id === 0) U.el('span', 'ref-col-owner', row, 'Owner');
          }
        }
        const memberTitle = document.querySelector('.ref-members-title');
        if (memberTitle) memberTitle.textContent = 'Members (' + m.members.length + ')';
      },
      channelTabs: () => () => {},
      feed: (base, S) => (channel, m) => {
        if (S.offsets.messages === undefined) S.offsets.messages = 0;
        base(channel, m);
      },
      message: (base, S) => (parent, msg, i, m) => {
        base(parent, msg, i, m);
        const row = parent.lastElementChild;
        row.classList.add('forum-message', 'forum-current');
      },
      backgroundMessage: (base, S) => (parent, msg, i) => {
        base(parent, msg, i);
        const row = parent.lastElementChild;
        row.classList.add('forum-message');
      },
      fileCard: (base, S) => (parent, file) => {
        const U = S.ctx.util, row = U.el('div', 'forum-file', parent);
        S.P.icon(row, 'file', 32);
        U.el('span', 'forum-file-link', row, file.name);
        U.el('span', 'forum-file-size', row, file.size);
        return row;
      },
      composer: (base, S) => (parent, isThread, m) => {
        const U = S.ctx.util, P = S.P;
        const box = U.el('div', 'forum-compose', parent);
        P.field(box, isThread ? 'draft' : 'channelDraft', isThread ? m.draft : m.channelDraft,
          isThread ? 'Reply in thread...' : 'Type a message to #' + m.name + '...', false);
        const row = U.el('div', 'forum-compose-tools', box);
        const attach = P.button(row, '', null, null, 'forum-attach');
        attach.title = 'Attach file'; attach.setAttribute('aria-label', 'Attach file');
        P.icon(attach, 'clip', 23);
        if (!isThread) {
          // Channel settings sit beside the composer, as in the reference.
          const settings = P.button(row, '', 'settings', { settings: true }, 'forum-gear');
          settings.title = 'Channel Settings'; settings.setAttribute('aria-label', 'Channel Settings');
          const gear = U.svg('svg', { viewBox: '0 0 24 24', width: 18, height: 18, 'aria-hidden': 'true' }, settings);
          gear.innerHTML = '<path fill="currentColor" fill-rule="evenodd" d="m10 1 4 0 .7 3 2 .9 2.7-1.5 2.1 3.5-2.2 2 .2 2.2 2.5 1.8-2 3.5-2.9-1-1.9 1.3-.2 3.2h-4l-.7-3-2-.9-2.7 1.5-2.1-3.5 2.2-2L5.5 10 3 8.2l2-3.5 2.9 1L9.8 4zM12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/>';
          U.el('span', '', settings, 'Channel Settings');
        }
        P.button(row, isThread && m.replies[m.thread] ? 'Update reply' : 'Send',
          isThread ? 'send' : 'channelSend', isThread ? { send: true } : { channelSend: true }, 'ch-primary forum-send');
      },
    },
  },
});
