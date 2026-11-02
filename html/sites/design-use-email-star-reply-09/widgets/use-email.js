// Plain WebMail layout with the site's stacked message view and reply decorations.
(function () {
  'use strict';

  const paths = {
    back: 'M20 12H5 M11 5l-7 7 7 7',
    delete: 'M7 7h10v14H7z M5 5h14 M9 3h6',
    unread: 'M3 5h18v14H3z M4 6l8 6 8-6',
    move: 'M2 6h8l2 3h10v12H2z',
    more: 'M12 4h.01 M12 12h.01 M12 20h.01',
    clip: 'M9 17V6a3 3 0 0 1 6 0v12a5 5 0 0 1-10 0V7 M12 7v10a1 1 0 0 1-2 0V6',
    format: 'M5 19h14 M7 15l5-12 5 12 M9 11h6',
    link: 'M9 8H7a4 4 0 0 0 0 8h3 M15 8h2a4 4 0 0 1 0 8h-3 M8 12h8',
    smile: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M8 9h.01 M16 9h.01 M7 14q5 7 10 0',
  };

  function avatar(parent, name, S) {
    let h = 0;
    for (const ch of name) h += ch.charCodeAt(0);
    const cols = ['#8e5bc4', '#3a9a52', '#e0412f', '#13908e', '#e5a823', '#7b57c2', '#d6568c', '#3b7bd6'];
    const a = S.el('span', 'avatar', parent);
    a.textContent = name.trim().charAt(0).toUpperCase();
    a.style.background = cols[h % cols.length];
    return a;
  }

  env.widget({
    task: 'use-email',
    site: 'design-use-email-star-reply-09',
    name: 'design',
    split: 'train',
    scenarios: ['star-reply'],
    template: 'use-email/mail',
    design: {
      style: 'plain',
      stack: true,
      rowHeight: 120,
      folderList: ['inbox', 'starred', 'important', 'archive', 'trash'],
      paths,
      replyPlaceholder: '│',
      forwardPlaceholder: '│',
      parts: {
        icon: (base, S) => (k) => {
          if (k === 'unread')
            return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2" fill="currentColor" stroke="none"/><path d="m4 6 8 6 8-6" fill="none" stroke="white"/></svg>';
          return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + (S.paths[k] || S.paths.mail) + '"/></svg>';
        },
        listStart: (base, S) => (m, order) => {
          base(m, order);
          S.els.listWrap.classList.toggle('mailbox-scrollable', order.length > S.spec.rows);
        },
        rowHead: (base, S) => (r, e) => {
          avatar(r, e.name, S);
        },
        docBack: (base, S) => (tools) => {
          if (S.D.stack) S.button(tools, 'Inbox', 'back', { back: true }, 'back', 'back-control');
        },
        toolsDone: (base, S) => (d, ...args) => {
          base(d, ...args);
          for (const k of ['unread', 'move', 'more']) {
            const decoration = S.el('span', 'toolbar-decoration ' + k, d.tools);
            decoration.innerHTML = S.P.icon(k);
          }
        },
        docMeta: (base, S) => (meta, e) => {
          const { el } = S;
          el('h2', '', meta, e.subject);
          const srow = (S.els.d.senderRow = el('div', 'sender-row', meta));
          avatar(srow, e.name, S);
          const who = el('div', 'who', srow);
          el('div', 'from-name', who, e.name);
          el('div', 'address', who, e.addr);
          el('div', 'to-me', who, 'to me' + S.cc(e) + ' ▾');
          el('div', 'stamp', srow, e.time);
          const more = el('span', 'message-more', srow);
          more.innerHTML = S.P.icon('more');
        },
        docDone: (base, S) => (d, ...args) => {
          base(d, ...args);
          const starButton = d.tools.querySelector('[aria-label="Star"]');
          if (starButton) {
            starButton.classList.add('message-star');
            d.senderRow.appendChild(starButton);
          }
          d.senderRow.appendChild(d.acts);
        },
        editorTitleMade: (base, S) => (title, ...args) => {
          base(title, ...args);
          const replyIcon = S.el('span', 'reply-heading-icon', title);
          replyIcon.innerHTML = S.P.icon('reply');
          title.prepend(replyIcon);
        },
        editorFormat: (base, S) => () => {
          const fmt = S.el('div', 'formatbar', S.els.editor);
          for (const k of ['clip', 'format', 'link', 'smile']) S.el('span', '', fmt).innerHTML = S.P.icon(k);
        },
        cancelButton: (base, S) => (acts) =>
          S.button(acts, S.D.cancelLabel, 'compose:discard', { discard: true }, 'delete', 'discard'),
      },
    },
  });
})();
