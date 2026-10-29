// Design of this site on the use-email/mail template (templates/use-email/mail.js): irix with a command rail in the
// folder panel, an inline Reply / Reply all / Forward group in the message tools, and fixed-visible search and
// scroll bar.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-nl-04',
    name: 'design',
    split: 'train',
    scenarios: ['nl'],
    template: 'use-email/mail',
    design: {
      rowHeight: 98,
      newLabel: 'Compose',
      needsToolsExcept: ['reply'],
      scrollToRowIcon: false,
      replyPlaceholder: 'Type your reply here...',
      paths: {
        new: 'M5 17 17 5l3 3L8 20H4z M15 7l3 3',
        send: 'm3 6 19-4-7 19-4-8-8-7z m9 6 6-6-4 8z',
        attach: 'M8 16 16 8a3 3 0 0 0-4-4L4 12a5 5 0 0 0 7 7l9-9a2 2 0 0 0-3-3l-9 9a1 1 0 0 1-2-2l7-7',
        people:
          'M8 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6 M17 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6 M2 20v-4c0-6 12-6 12 0v4z M16 13c5 0 6 3 6 7h-6',
        gear: 'm10 2 4 0 1 3 3 1 3-1 2 4-2 2v3l2 2-2 4-3-1-3 1-1 3h-4l-1-3-3-1-3 1-2-4 2-2v-3L1 9l2-4 3 1 3-1z M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
        overflow: 'M12 4v.1 M12 12v.1 M12 20v.1',
        railmail: 'M3 6l9 8 9-8 M3 19l4-4 M21 19l-4-4',
      },
      parts: {
        panel: (base, S) => (cls, title) => {
          const p = base(cls, title);
          if (cls === 'folders') {
            const rail = S.el('div', 'command-rail', p);
            S.button(rail, 'Mail', null, () => ({ view: 'inbox' }), 'railmail', 'rail-command active');
            for (const [label, ic] of [
              ['Calendar', 'file'],
              ['Contacts', 'people'],
              ['Settings', 'gear'],
            ])
              S.button(
                rail,
                label,
                null,
                () => {
                  S.navToggle();
                  return {};
                },
                ic,
                'rail-command',
              );
          }
          return p;
        },
        rowSender: (base, S) => (r, e) => {
          const sender = S.el('span', 'sender', r, e.name);
          if (e.name.length > 9)
            sender.style.fontSize = Math.max(13, Math.min(29, (S.ctx.size.width * 0.097 - 10) / (e.name.length * 0.6))) + 'px';
        },
        toolsDone: (base, S) => (d, m, i) => {
          const { button, action, ctx } = S;
          const { tools, doc } = { tools: d.tools, doc: S.els.doc };
          button(tools, 'Reply', 'action:reply', () => action('reply', ctx.model.open ?? i), 'reply', 'primary-reply');
          for (const [label, op] of [
            ['Reply all', 'replyall'],
            ['Forward', 'forward'],
          ])
            button(tools, label, 'action:' + op, () => action(op, ctx.model.open ?? i), op, 'supplemental-action');
          button(
            tools,
            'More actions',
            null,
            () => {
              doc.classList.toggle('expanded-tools');
              return {};
            },
            'overflow',
            'more-actions',
          );
        },
        docMeta: (base, S) => (meta, e) => {
          const { el, cc } = S;
          const heading = el('h2', '', meta, e.subject);
          if (e.subject.length > 28) heading.classList.add('long-subject');
          const sender = el('div', 'sender-header', meta);
          el('div', 'avatar', sender, e.name[0]);
          const senderText = el('div', 'sender-details', sender);
          el('strong', '', senderText, e.name);
          el('div', 'address', senderText, 'to me' + cc(e));
          el('span', 'message-time', sender, e.time);
        },
        editorFields: (base, S) => (group, shown) => {
          base(group, shown);
          const options = S.el('div', 'recipient-options', group);
          for (const label of ['Cc', 'Bcc']) {
            const b = S.button(options, label, null, null);
            b.addEventListener('click', () => S.els.editor.classList.toggle('show-cc'));
          }
        },
        actionsStart: (base, S) => (acts) => {
          S.button(acts, 'Attach', null, null, 'attach', 'attach-button');
        },
        cancelButton: (base, S) => (acts) => S.button(acts, 'Cancel', 'compose:discard', { discard: true }, null, 'discard'),
        paintClasses: (base, S) => (m) => {
          S.els.root.classList.add('show-scrollbar', 'show-search', 'show-selection');
          S.els.editor.classList.add('show-cc');
          base(m);
        },
      },
    },
  });
})();
