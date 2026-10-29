// Design on templates/use-chat/workspace.js; defaults preserve the reference scaffold.
env.widget({
  task: 'use-chat',
  site: 'design-use-chat-thread-05',
  name: 'design',
  split: 'train',
  scenarios: ['thread'],
  template: 'use-chat/workspace',
  design: {
    panel: '#ffffff', bg: '#f4f5f7', fg: '#27364c', muted: '#768092', line: '#d9dde4', accent: '#ff7425',
    parts: {
      icon: (base, S) => (parent, kind, size = 24) => {
        if (kind !== 'threads') return base(parent, kind, size);
        const svg = S.ctx.util.svg('svg', {viewBox:'0 0 24 24', width:size, height:size, 'aria-hidden':'true'}, parent);
        svg.innerHTML = '<path d="M6 3.5h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3h-7l-5 4v-4a3 3 0 0 1-3-3v-8a3 3 0 0 1 3-3Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>';
        return svg;
      },
      // Photo avatars: the site paints the portrait sheet (--avatar-image) behind every avatar.
      avatar: (base, S) => (parent, person, cls = '') => {
        const el = base(parent, person, cls);
        el.textContent = '';
        el.style.background = '';
        el.style.color = '';
        el.classList.add('ref-avatar-photo');
        const messageIndex = S.spec.messages.findIndex(msg => S.spec.people[msg.author].full === person.full);
        el.dataset.portrait = String(messageIndex >= 0 ? [0, 1, 0, 2, 3][messageIndex % 5] : env.util.hash32(person.full) % 4);
        Object.assign(el.style, { flex: '0 0 54px', width: '54px', height: '54px', minWidth: '54px', fontSize: '0' });
        return el;
      },
      message: (base, S) => (parent, msg, i, m) => {
        base(parent, msg, i, m);
        const row = parent.lastElementChild;
        row.classList.add('rv-message');
        const link = row.querySelector('.ch-threadlink');
        if (link) {
          const count = msg.replies + Number(!!m.replies[i]);
          link.setAttribute('aria-label', `${count} replies to ${msg.text}`);
          link.title = 'Reply in thread';
          link.replaceChildren();
          S.P.icon(link, 'threads', 22);
          S.ctx.util.el('span', '', link, count);
          row.append(link);
        }
        row.querySelector('.ch-actions')?.remove();
        row.querySelector('.ch-previewlink')?.remove();
        const edited = row.querySelector('.ch-meta span:last-child');
        if (edited?.textContent === '(edited)') edited.remove();
        const file = row.querySelector('.ch-filecard');
        if (file) {
          const photo = S.ctx.util.el('img', 'ref-site-photo', null);
          photo.src = new URL('sites/design-use-chat-thread-05/assets/site-visit.png', window.location.href).href;
          photo.alt = 'Site visit'; photo.title = file.textContent;
          file.replaceWith(photo);
        }
      },
      composer: (base, S) => (parent, isThread, m) => {
        base(parent, isThread, m);
        const box = parent.querySelector(':scope > .ch-compose');
        const field = box.querySelector('textarea');
        const row = box.querySelector('.ch-sendrow');
        row.prepend(field);
        const attachment = box.querySelector('.ch-composetools button');
        if (attachment) attachment.textContent = 'Aa';
        const send = box.querySelector('.ch-primary');
        send.querySelector('svg')?.remove();
        const format = box.querySelector('.ch-format');
        const list = S.P.iconButton(format, 'list', 'Numbered list', null, null);
        format.insertBefore(list, format.lastElementChild.previousElementSibling);
      },
      chatHeader: (base, S) => m => {
        base(m);
        const head = S.main.querySelector('.ch-head');
        head.querySelector('p').textContent = `${m.members.length} members  |  ${m.topic}`;
        const members = head.querySelector('[data-chat-control="settings"]');
        members.setAttribute('aria-label', `${m.members.length} members`);
        members.replaceChildren(); S.P.icon(members, 'people', 24);
        S.ctx.util.el('span', '', members, m.members.length);
        const search = head.querySelector('[aria-label="Search in channel"]');
        if (search) { search.replaceChildren(); S.P.icon(search, 'more', 24); search.classList.add('rv-more'); }
      },
      painted: (base, S) => m => {
        base(m);
        document.body.classList.toggle('ref-thread-open', m.thread !== null);
        const activeChannel = document.querySelector('.ref-selected');
        if (activeChannel) activeChannel.textContent = '#  ' + m.name;
        const related = document.querySelector('.ref-related');
        if (!related) return;
        const U = S.ctx.util;
        related.replaceChildren();
        U.el('div', 'ref-related-title', related, 'Thread');
        U.el('div', 'ref-related-subtitle', related, 'Related conversations');
        const indices = [1, 3, 2, 4, 0, ...S.spec.messages.map((_, i) => i)].filter((i, n, all) => i < S.spec.messages.length && all.indexOf(i) === n);
        for (const i of indices) {
          const msg = S.spec.messages[i], person = S.spec.people[msg.author];
          const row = S.P.button(related, '', null, { openThread: i }, 'ref-related-row');
          S.P.avatar(row, person, 'ref-related-avatar');
          const copy = U.el('div', 'ref-related-copy', row);
          U.el('strong', '', copy, person.full);
          const text = U.el('div', 'ref-related-message', copy);
          if (i === 1) { const photo = U.el('img', 'ref-related-thumb', text); photo.src = new URL('sites/design-use-chat-thread-05/assets/site-visit.png', window.location.href).href; photo.alt = 'Site visit'; }
          U.el('span', '', text, msg.text);
          U.el('div', 'ref-related-meta', copy, `${msg.replies + Number(!!m.replies[i])} ${msg.replies === 1 ? 'reply' : 'replies'} · Last reply ${msg.time}`);
        }
      },
    },
  },
});
