// Design on templates/use-chat/workspace.js; defaults preserve the reference scaffold.
env.widget({
  task: 'use-chat',
  site: 'design-use-chat-pinreact-01',
  name: 'design',
  split: 'train',
  scenarios: ['pinreact'],
  template: 'use-chat/workspace',
  design: {
    panel: '#ffffff', bg: '#f4f7fb', fg: '#171735', muted: '#606381',
    line: '#e1e5ef', accent: '#5146ff', inset: '0px', radius: '0px', fontSize: '16px',
    parts: {
      avatar: (base, S) => (parent, person, cls = '') => {
        const el = base(parent, person, cls);
        const personIndex = S.spec.people.findIndex(p => p.full === person.full);
        const index = (personIndex < 0 ? S.ctx.util.hash32(person.full) : personIndex) % 4;
        el.classList.add('team-portrait');
        el.style.setProperty('--portrait-x', index % 2 ? '100%' : '0%');
        el.style.setProperty('--portrait-y', index > 1 ? '100%' : '0%');
        el.setAttribute('aria-label', person.full);
        return el;
      },
      icon: (base, S) => (parent, kind, size = 24) => {
        const paths = {
          star: '<path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"/>',
          reply: '<path d="m9 5-6 6 6 6M3 11h10c5 0 8 3 8 8"/>',
          threads: '<path d="M5 3h14a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H9l-6 4v-5a3 3 0 0 1-2-3V6a3 3 0 0 1 4-3z"/>',
        };
        if (!paths[kind]) return base(parent, kind, size);
        const svg = S.ctx.util.svg('svg', { viewBox: '0 0 24 24', width: size, height: size, 'aria-hidden': 'true' }, parent);
        svg.innerHTML = `<g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths[kind]}</g>`;
        return svg;
      },
      topbar: () => () => {},
      channelTabs: () => () => {},
      chatHeader: (base, S) => m => {
        const { P, ctx } = S, U = ctx.util;
        const head = U.el('div', 'ch-head', S.main);
        const title = U.el('div', 'team-channel-title', head);
        const name = U.el('h2', '', title);
        P.icon(name, 'hash', 28);
        U.el('span', '', name, m.name);
        P.iconButton(name, 'star', 'Favorite channel', null, null);
        U.el('p', '', title, `${m.members.length} members  |  ${m.topic}`);
        const tools = U.el('div', 'ch-headtools', head);
        const call = P.button(tools, '', null, null, 'team-call');
        call.title = 'Start huddle'; call.setAttribute('aria-label', 'Start huddle');
        P.icon(call, 'camera', 23); P.icon(call, 'chevron', 13);
        const members = P.button(tools, '', 'settings', { settings: true });
        P.icon(members, 'people', 23); U.el('span', '', members, m.members.length);
        P.iconButton(tools, 'more', 'Channel options', null, null, 'team-channel-more');
      },
      feed: (base, S) => (channel, m) => {
        base(channel, m);
        const feed = channel.querySelector('[data-chat-pane="messages"]');
        const current = S.ctx.util.el('div', 'team-current-messages');
        const rows = [...feed.children].filter(el => el.matches('article.ch-message')).slice((S.spec.history || []).length);
        if (rows.length) feed.insertBefore(current, rows[0]);
        rows.forEach(row => current.append(row));
      },
      message: (base, S) => (parent, msg, i, m) => {
        base(parent, msg, i, m);
        const row = parent.lastElementChild;
        row.dataset.messageIndex = i;
        const actions = row.querySelector('.ch-actions');
        row.querySelector('.ch-facepile')?.remove();
        actions.querySelector(':scope > .ch-muted')?.remove();
        const tools = S.ctx.util.el('div', 'team-message-tools', row);
        for (const key of [`react:${i}`, `more:${i}`]) {
          const button = actions.querySelector(`[data-chat-control="${key}"]`);
          if (button) tools.append(button);
        }
        const more = tools.lastElementChild;
        const reply = S.P.iconButton(tools, 'reply', 'Reply', null, null);
        const bookmark = S.P.iconButton(tools, 'later', 'Save for later', null, null);
        if (more) { tools.insertBefore(reply, more); tools.insertBefore(bookmark, more); }
        const thread = actions.querySelector('.ch-threadlink');
        if (thread) { const icon = S.P.icon(thread, 'threads', 19); thread.prepend(icon); }
        const reaction = actions.querySelector('.ch-reaction, .ch-on');
        if (reaction) actions.prepend(reaction);
      },
      fileCard: (base, S) => (parent, file) => {
        const row = base(parent, file);
        row.firstElementChild.remove();
        const thumb = S.ctx.util.el('div', 'team-file-thumbnail');
        thumb.innerHTML = '<svg viewBox="0 0 96 52" aria-hidden="true"><rect width="96" height="52" rx="4" fill="#cdc9ff"/><rect x="5" y="6" width="24" height="42" rx="2" fill="#fafbff"/><rect x="36" y="5" width="24" height="43" rx="2" fill="#fff"/><rect x="66" y="6" width="25" height="42" rx="2" fill="#e7e5fa"/><path d="M8 10h18M39 9h18M69 10h18" stroke="#5146ff" stroke-width="4"/><path d="M9 21h16M9 27h13M40 18h16M40 24h16M69 18h16M69 24h13M9 40h15M40 40h16" stroke="#c1d3fc" stroke-width="4"/></svg>';
        row.prepend(thumb);
        S.P.iconButton(row, 'more', 'File options', null, null);
        return row;
      },
      composer: (base, S) => (parent, isThread, m) => {
        if (isThread) return base(parent, isThread, m);
        const { P, ctx } = S, U = ctx.util;
        const box = U.el('div', 'ch-compose team-compose', parent);
        const format = U.el('div', 'ch-format', box);
        for (const [kind, label] of [['bold', 'Bold'], ['italic', 'Italic'], ['link', 'Insert link'], ['list', 'Bulleted list'], ['list', 'Numbered list'], ['code', 'Code']]) P.iconButton(format, kind, label, null, null);
        P.field(box, 'channelDraft', m.channelDraft, `Message #${m.name}`, true);
        const tools = U.el('div', 'team-compose-tools', box);
        U.el('span', 'team-type', tools, 'Aa');
        P.iconButton(tools, 'smile', 'Insert reaction', null, null);
        P.iconButton(tools, 'clip', 'Attach file', null, null);
        const send = P.iconButton(tools, 'send', 'Send', 'channelSend', { channelSend: true }, 'team-send');
        send.setAttribute('aria-label', 'Send');
      },
      rendered: (base, S) => ctx => {
        base(ctx);
        // Start at the first recent message, with the older history still available above.
        const feed = S.panes.get('messages');
        const current = feed?.querySelector('.team-current-messages');
        if (current) feed.scrollTop += current.getBoundingClientRect().top - feed.getBoundingClientRect().top;
      },
    },
  },
});
