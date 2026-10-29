// Design on the shared avoid-phishing/classic widget.
env.widget({
  task: 'avoid-phishing',
  site: 'design-avoid-phishing-attachment-02',
  name: 'design',
  split: 'train',
  scenarios: ['attachment'],
  template: 'avoid-phishing/classic',
  design: {
    parts: {
      navigation(base, S) {
        return function(ctx, shell) {
          const nav = ctx.util.el('aside', 'sp-nav', shell);
          ctx.util.el('h2', 'mail-nav-title', nav, 'Mail');
          const envelope = '<svg viewBox="0 0 32 27" aria-hidden="true"><rect x="2" y="3" width="28" height="21" rx="1" fill="#d8e6f0" stroke="#376084"/><path d="m3 4 13 11L29 4M3 23l10-10m16 10L19 13" fill="none" stroke="#376084"/><path d="m4 4 12 9L28 4" fill="none" stroke="#fff"/></svg>';
          const compose = ctx.util.el('div', 'mail-new-message', nav);
          ctx.util.el('i', 'mail-folder-icon', compose).innerHTML = envelope;
          ctx.util.el('span', '', compose, 'New Message');
          for (const [icon, name, count] of [['✉', 'Inbox', '8'], ['✉', 'Sent Items', '3'], ['▱', 'Drafts', '2'], ['▥', 'Deleted Items', '0']]) {
            const row = ctx.util.el('div', `mail-folder${name === 'Inbox' ? ' active' : ''}`, nav);
            const glyph = ctx.util.el('i', 'mail-folder-icon', row);
            glyph.innerHTML = name === 'Deleted Items'
              ? '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M8 9h16l-1 21H9zM6 7h20v3H6zM12 3h8v4h-8z" fill="#b9cfdf" stroke="#3b5c76"/><path d="M12 12v15m5-15v15m4-15v15" stroke="#5c7c93"/><path d="M10 11v17" stroke="#fff"/></svg>'
              : name === 'Drafts'
                ? '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="m4 17 15-14 9 8-5 18H4z" fill="#ecd28b" stroke="#8a6b32"/><path d="m19 3-2 10 11-2M7 18l-1 8h14" fill="none" stroke="#a27c35"/></svg>'
                : envelope;
            ctx.util.el('span', '', row, name);
            ctx.util.el('small', '', row, count);
          }
          ctx.util.el('h3', 'mail-folders-title', nav, 'Folders');
          for (const [name, count] of [['AP', '4'], ['Customers', '1'], ['Suppliers', '2'], ['Personal', '0'], ['Archive', '12']]) {
            const row = ctx.util.el('div', 'mail-folder', nav);
            ctx.util.el('i', 'mail-folder-icon folder', row);
            ctx.util.el('span', '', row, name);
            ctx.util.el('small', '', row, count);
          }
        };
      },
      rowDecorated(base, S) {
        return function(ctx, row, record) {
          base(ctx, row, record);
          row.querySelector('strong').textContent = record.name || ctx.spec.person.full;
          const index = ctx.spec.records.indexOf(record);
          ctx.util.el('time', 'mail-row-time', row, ['10:24 AM', '9:17 AM', 'Apr 2'][index % 3]);
          ctx.util.el('i', 'mail-row-paperclip', row).innerHTML = '<svg viewBox="0 0 32 36" aria-hidden="true"><path d="M11 22 23 9c5-5 11 2 6 7L14 31C6 38-3 28 4 21L20 4c7-7 17 3 10 10L15 29c-3 3-7-1-4-4L25 10" transform="translate(0 0) scale(.9)" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>';
          row.title = record.file;
        };
      },
      show(base, S) {
        let rendered = false;
        return function(ctx) {
          S.els.content.querySelectorAll('.mail-attachments').forEach((node) => node.remove());
          base(ctx);
          // Selecting a message or opening a preview rebuilds the attachment rail.
          // The initial render precedes the template's anchor registration.
          if (rendered) ctx.reanchor();
          rendered = true;
        };
      },
      attachment(base, S) {
        return function(ctx, x) {
          const { els, P } = S;
          const s = ctx.spec;
          x = x || { subject: 'Message attachments', domain: s.domain };
          const reading = els.reading;
          reading.classList.add('mail-message');
          els.actions.style.display = 'none';
          ctx.util.el('h2', '', reading, x.subject || 'Message');
          P.meta(ctx, reading, [['From', `${x.name || s.person.full} <${x.name ? 'mail' : 'documents'}@${x.domain}>`],
            ['To', s.username], ['Date', 'Apr 5, 2010  10:24 AM'], ['Subject', x.subject || x.file]]);
          ctx.util.el('p', '', reading, 'Hello,');
          ctx.util.el('p', '', reading, 'Please find attached the documents for your review. Let me know if you need anything else from us.');
          ctx.util.el('p', '', reading, 'Thanks,');
          ctx.util.el('p', 'mail-signature', reading, `${x.name || s.person.full}\n${s.org.name}`);
          const side = ctx.util.el('aside', 'mail-attachments', els.content);
          const heading = ctx.util.el('h3', '', side);
          ctx.util.el('span', 'mail-clip', heading).innerHTML = '<svg viewBox="0 0 32 36" aria-hidden="true"><path d="M11 22 23 9c5-5 11 2 6 7L14 31C6 38-3 28 4 21L20 4c7-7 17 3 10 10L15 29c-3 3-7-1-4-4L25 10" transform="translate(0 0) scale(.9)" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>';
          ctx.util.el('strong', '', heading, 'Attachments');
          ctx.util.el('span', 'mail-attachment-count', heading, `(${s.records.length})`);
          for (const file of s.records) {
            const card = ctx.util.el('div', 'mail-attachment-card', side);
            const pdf = /\.pdf$/i.test(file.file);
            ctx.util.el('span', `mail-file-icon${pdf ? ' pdf' : ''}`, card, pdf ? 'PDF' : 'W');
            const info = ctx.util.el('div', 'mail-file-info', card);
            ctx.util.el('strong', '', info, file.file);
            ctx.util.el('small', '', info, `${s.ood ? '4.8' : '98'} KB`);
            P.cardDecorated(ctx, card, 'attachment', file);
            if (x.id === file.id) P.button(ctx, card, 'Open', 'open-file', true);
            else {
              const select = ctx.util.el('button', 'sp-btn mail-inspect', card, 'Inspect');
              select.type = 'button';
              select.addEventListener('click', () => S.rows.get(file.id).click());
            }
            if (ctx.model.done.includes(file.id)) ctx.util.el('div', 'sp-muted', card, `Preview open: ${file.file}`);
          }
        };
      },
      empty(base, S) {
        return function(ctx) { S.P.attachment(ctx, null); };
      },
    },
  },
});
