// Monochrome mail with sender highlighting, a message toolbar, attachment cards, and an inbox count.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-delete-10',
    name: 'design',
    split: 'train',
    scenarios: ['delete'],
    template: 'use-email/mail',
    design: {
      rowHeight: 98,
      folderList: ['inbox', 'starred', 'sent', 'drafts', 'archive', 'spam', 'trash'],
      toolbarOps: [['Reply', 'reply'], ['Reply all', 'replyall'], ['Forward', 'forward'], ['Delete', 'delete']],
      paths: {
        sent: 'm2 3 20 9-20 9 4-9z M6 12h16',
        drafts: 'M5 2h9l5 5v15H5z M14 2v6h5',
        spam: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M12 7v6 M12 16v1',
        trash: 'M4 6h16 M9 6V3h6v3 M6 6l1 15h10l1-15 M10 10v7 M14 10v7',
      },
      parts: {
        begin: (base, S) => () => {
          const instruction = document.querySelector('.instruction');
          if (instruction) {
            const text = instruction.textContent;
            const names = S.spec.emails
              .flatMap((p) => [p.name, ...p.name.split(' ')])
              .filter((n) => n.length > 2)
              .sort((a, b) => b.length - a.length);
            const sender = names.find((n) =>
              new RegExp('(^|[^\\p{L}])' + n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '($|[^\\p{L}])', 'u').test(text),
            );
            if (sender) {
              const at = text.indexOf(sender);
              instruction.replaceChildren(document.createTextNode(text.slice(0, at)));
              S.el('span', 'instruction-sender', instruction, sender);
              instruction.append(document.createTextNode(text.slice(at + sender.length)));
              const step = document.querySelector('.note-steps li');
              if (step) step.textContent = 'Locate the email from ' + sender + ' in the inbox (it is still present).';
            }
          }
        },
        icon: (base) => (k) => {
          if (k === 'trash' || k === 'delete')
            return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" stroke="none" d="M5 7h14l-1 15H6z M3 4h18v2H3z M9 1h6v2H9z"/><path stroke="var(--chalk)" stroke-width="1.3" d="M9 10v9 M12 10v9 M15 10v9"/></svg>';
          if (k === 'drafts')
            return '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" stroke="none" d="M5 2h9l5 5v15H5z"/><path stroke="var(--chalk)" d="M14 3v5h4 M8 12h8 M8 15h8 M8 18h6"/></svg>';
          if (k === 'sent')
            return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m2 10 20-8-6 20-5-7-7-2z M11 15l11-13 M11 15l-1 6"/></svg>';
          return base(k);
        },
        docMade: (base, S) => () => {
          const { doc, toolbar } = S.els;
          doc.insertBefore(toolbar, doc.querySelector('.window-title').nextSibling);
          S.el('span', 'toolbar-more', toolbar, '•••');
        },
        docMeta: (base, S) => (meta, e, i) => {
          const { el, button, action, ctx } = S;
          el('h2', '', meta, e.subject);
          const identity = el('div', 'message-identity', meta);
          el('div', 'sender-avatar', identity, e.name.charAt(0));
          const from = el('div', 'sender-details', identity);
          el('strong', '', from, e.name);
          el('div', 'recipient', from, 'to me ⌄' + S.cc(e));
          el('span', 'message-time', identity, e.time);
          button(identity, 'Star', 'message:star', () => action('star', ctx.model.open ?? i), 'star', 'message-star');
        },
        docContent: (base, S) => (d, e, i, m) => {
          const content = (d.content = S.el('div', 'message-content', S.els.docInside));
          S.el('div', 'body-text', content, e.body);
          if (e.att.length) {
            const attachments = S.el('div', 'attachments', content);
            for (const a of e.att) S.P.attachment(attachments, a, e);
          }
          S.sentNotes(content, i, m);
        },
        attachment: (base, S) => (content, a) => {
          const b = S.el('div', 'attachment', content);
          b.innerHTML = S.P.icon('file');
          const label = S.el('div', 'attachment-label', b);
          S.el('span', '', label, a.file);
          S.el('div', 'attachment-size', label, a.size);
        },
        painted: (base, S) => (m) => {
          const inboxCount = S.els.folderButtons.get('inbox');
          let count = inboxCount.querySelector('.count');
          if (!count) count = S.el('span', 'count', inboxCount);
          count.textContent = m.box.filter((b) => b === 'inbox').length;
        },
      },
    },
  });
})();
