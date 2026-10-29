// Design on templates/use-chat/workspace.js; defaults preserve the reference scaffold.
env.widget({
  task: 'use-chat',
  site: 'design-use-chat-channel-03',
  name: 'design',
  split: 'train',
  scenarios: ['channel'],
  template: 'use-chat/workspace',
  design: {
    font: 'Arial, "Segoe UI", sans-serif',
    fontSize: '16px',
    inset: '0',
    contextAt: 0,
    contextWidth: '26%',
    parts: {
      topbar: () => () => {},
      rail: () => () => {},
      navigation: (base) => (parent) => {
        const active = base(parent);
        active.el.closest('.ch-nav').hidden = true;
        return active;
      },
      channelTabs: () => () => {},
      chatHeader: (base, S) => (m) => {
        const { el } = S.ctx.util, P = S.P;
        const head = el('div', 'channel-titlebar', S.main);
        const left = el('div', 'channel-titlegroup', head);
        const badge = el('span', 'channel-hash', left); P.icon(badge, 'hash', 25);
        el('h2', '', left, m.name); P.icon(left, 'chevron', 15);
        el('span', 'channel-titledivider', left);
        const settings = P.iconButton(left, 'settings', 'Channel settings', 'settings', { settings: true });
        const svg = settings.querySelector('svg');
        svg.innerHTML = '<g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><path d="m9 3-1 3-3 1v3l-2 2 2 2v3l3 1 1 3h6l1-3 3-1v-3l2-2-2-2V7l-3-1-1-3z"/><circle cx="12" cy="12" r="3.2"/></g>';
        if (S.ctx.stage.channelInstruction) head.append(S.ctx.stage.channelInstruction);
        const tools = el('div', 'channel-titletools', head);
        const meet = P.button(tools, '', null, null, 'channel-meet'); P.icon(meet, 'camera', 22); el('span', '', meet, 'Meet'); P.icon(meet, 'chevron', 15);
        const members = P.button(tools, '', 'headerMembers', { settings: true }, 'channel-membercount'); P.icon(members, 'people', 23); el('span', '', members, m.members.length);
        const extra = el('div', 'channel-extratools', head);
        P.iconButton(extra, 'search', 'Search in channel', null, null);
        const more = P.iconButton(extra, 'more', 'More channel options', null, null); more.classList.add('channel-more');
        if (S.ctx.stage.channelHeaderTools) extra.append(S.ctx.stage.channelHeaderTools);
      },
      avatar: (base, S) => (parent, person, cls = '') => {
        const avatar = base(parent, person, cls);
        const index = Math.max(0, S.spec.people.findIndex(p => p.full === person.full)) % 6;
        avatar.classList.add('channel-portrait');
        avatar.style.setProperty('--portrait-x', `${index % 3 * 50}%`);
        avatar.style.setProperty('--portrait-y', `${Math.floor(index / 3) * 100}%`);
        avatar.setAttribute('aria-label', person.full);
        return avatar;
      },
      fileCard: (base, S) => (parent, file) => {
        const row = base(parent, file);
        row.classList.add('channel-file');
        const art = S.ctx.util.el('span', 'channel-fileicon', row);
        art.append(row.firstElementChild);
        row.prepend(art);
        art.querySelector('svg').innerHTML = '<path d="M5 2h9l5 5v15H5z" fill="#7fb4ff"/><path d="M14 2v6h5" fill="#4a8eff"/><path d="M8 12h8M8 15h8M8 18h6" stroke="#e5f0ff" stroke-width="1.3"/>';
        if (parent.closest('.ch-messages')) S.P.iconButton(row, 'more', 'File options', null, null, 'ch-iconbtn channel-more');
        return row;
      },
      message: (base, S) => (parent, msg, i, m) => {
        base(parent, msg, i, m);
        const row = parent.lastElementChild, content = row.querySelector('.ch-messagebody');
        const meta = content.querySelector('.ch-meta');
        row.insertBefore(meta, content);
        const actions = content.querySelector('.ch-actions');
        const reaction = S.ctx.util.el('span', 'channel-reaction', actions);
        S.P.icon(reaction, i === 2 ? 'heart' : 'thumbsup', 22);
        S.ctx.util.el('span', '', reaction, Math.max(1, msg.reactions));
        actions.prepend(reaction);
        const thread = actions.querySelector('.ch-threadlink');
        thread.setAttribute('aria-label', thread.textContent);
        thread.replaceChildren();
        S.P.icon(thread, 'threads', 18);
        S.ctx.util.el('span', '', thread, msg.replies + Number(!!m.replies[i]));
      },
      feed: (base, S) => (parent, m) => {
        base(parent, m);
        const feed = parent.querySelector('.ch-messages');
        const messages = [...feed.querySelectorAll(':scope > .ch-message')].slice(-S.spec.messages.length);
        const current = S.ctx.util.el('div', 'channel-current', feed);
        feed.insertBefore(current, messages[0]);
        messages.forEach(row => current.append(row));
      },
      backgroundMessage: (base) => (parent, msg, i) => {
        base(parent, msg, i);
        const row = parent.lastElementChild, content = row.querySelector('.ch-messagebody');
        row.insertBefore(content.querySelector('.ch-meta'), content);
      },
      composer: (base, S) => (parent, thread, m) => {
        base(parent, thread, m);
        const box = parent.querySelector('.ch-compose');
        if (!box || thread) return;
        const plus = box.querySelector('.ch-composetools button'); box.prepend(plus);
        const tools = box.querySelector('.ch-composetools');
        S.ctx.util.el('span', 'channel-type', tools, 'Aa');
        const send = box.querySelector('[data-chat-control="channelSend"]');
        send.setAttribute('aria-label', 'Send');
        [...send.childNodes].filter(node => node.nodeType === 3).forEach(node => node.remove());
      },
      contextPanel: (base, S) => (conv, m) => {
        const { el } = S.ctx.util, P = S.P;
        const side = P.pane(el('aside', 'ch-context channel-inspector ch-scroll', conv), 'context');
        const heading = el('div', 'channel-inspectorhead', side); el('h3', '', heading, 'Channel details');
        P.iconButton(heading, 'close', 'Close channel details', null, null);
        const summary = el('div', 'channel-summary', side);
        const hash = el('div', 'channel-summaryhash', summary); P.icon(hash, 'hash', 36);
        const label = el('div', '', summary); el('strong', '', label, '# ' + m.name); el('small', '', label, 'Created Feb 14, 2024');
        const description = el('section', 'channel-description', side); el('h4', '', description, 'Description'); el('p', '', description, m.topic);
        const members = el('section', 'channel-membersection', side);
        const title = el('h4', '', members, 'Members'); el('span', 'channel-sectioncount', title, m.members.length);
        m.members.forEach((index, i) => {
          const person = S.spec.people[index], row = el('div', 'channel-member', members);
          const avatar = el('div', 'channel-memberavatar', row); P.avatar(avatar, person);
          el('i', 'channel-online' + (i === m.members.length - 1 ? ' away' : ''), avatar);
          const text = el('div', 'channel-memberlabel', row); el('div', '', text, person.full); el('small', '', text, i === m.members.length - 1 ? 'Away' : 'Online');
          el('span', 'channel-memberrole', row, i === 0 ? 'Owner' : 'Member');
        });
        const files = el('section', 'channel-shared', side), filehead = el('div', 'channel-sharedhead', files);
        const filetitle = el('h4', '', filehead, 'Shared files'); el('span', 'channel-sectioncount', filetitle, S.spec.sharedFiles.length); P.icon(filehead, 'forward', 17);
        S.spec.sharedFiles.forEach(file => P.fileCard(files, file));
      },
    },
  },
});
