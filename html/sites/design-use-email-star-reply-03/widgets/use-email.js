// WebMail design: custom message metadata, toolbar icons, editor controls, and folder decoys.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-star-reply-03',
    name: 'design',
    split: 'train',
    scenarios: ['star-reply'],
    template: 'use-email/mail',
    design: {
      style: 'plain',
      rowHeight: 39,
      columns: ['From', 'Subject', 'Received', ''],
      replyPlaceholder: 'Type your reply here...',
      paths: {
        inbox: 'M3 9 6 3h12l3 6v11H3z M3 9h5l2 5h4l2-5h5',
        archive: 'M3 4h18v4H3z M5 8v13h14V8 M9 13l3 3 3-3',
        send: 'm2 10 20-8-7 20-4-8z M11 14 22 2',
        more: 'M4 12h.1 M12 12h.1 M20 12h.1',
        bullets: 'M8 5h14 M8 12h14 M8 19h14 M2 5h.1 M2 12h.1 M2 19h.1',
        numbered: 'M9 5h13 M9 12h13 M9 19h13 M2 3h2v4 M2 10h3l-3 4h3 M2 17h3v4H2',
        link: 'm9 15 6-6 M8 16l-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0 M16 8l2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0',
        smile: 'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0 M7 14q5 7 10 0 M8 8h.1 M16 8h.1',
      },
      parts: {
        icon: (base, S) => (k) => {
          const filled = {
            inbox: '<path fill="currentColor" d="M4 3h16l3 7v11H1V10z"/><path stroke="#cdeeff" d="m4 5 8 7 8-7"/>',
            archive: '<rect x="2" y="2" width="20" height="5" rx="2" fill="currentColor"/><rect x="3" y="9" width="18" height="13" rx="2" fill="currentColor"/><path fill="#f1f7fc" stroke="none" d="M12 18c-9-5-3-9 0-5 3-4 9 0 0 5"/>',
            delete: '<path fill="currentColor" d="M4 7h16l-1 15H5z M2 4h20v2H2z M8 1h8v3H8z"/><path stroke="#e1ecf6" d="M8 10v9 M12 10v9 M16 10v9"/>',
            file: '<path fill="currentColor" d="M3 2h13v6h5v14H3z M17 2h4v5h-4z"/><path stroke="#dce8f3" d="M7 12h9 M7 16h7"/><path fill="currentColor" stroke="#e1ecf6" d="m17 10 6-7-3-2-6 7z"/>',
            sent: '<path fill="currentColor" d="M15 5 22 11 15 18v-4C8 14 4 17 2 21c-1-8 5-12 13-12z"/>',
            send: '<path fill="#fff" stroke="none" d="m2 10 20-8-7 20-4-8z"/><path fill="none" stroke="#63b72c" stroke-width="1" d="m11 14 11-12"/>',
            numbered: '<path d="M8 5h14 M8 12h14 M8 19h14"/><path fill="currentColor" stroke="none" d="M1 3h3v3H1z M1 10h3v3H1z M1 17h3v3H1z"/>',
          };
          return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (filled[k] || '<path d="' + (S.paths[k] || S.paths.mail) + '"/>') + '</svg>';
        },
        makeColumns: (base, S) => (col) => {
          for (const label of S.D.columns) S.el('span', '', col, label);
        },
        folderIcon: (base) => (v) => (v === 'trash' ? 'delete' : base(v)),
        foldersMade: (base, S) => () => {
          base();
          const { folders, folderButtons } = S.els;
          for (const [label, ic, before] of [['Sent', 'sent', 'starred'], ['Drafts', 'file', 'important']]) {
            const b = S.button(folders, label, null, null, ic, 'folder reference-folder');
            b.addEventListener('click', () => env.log('decoy', { label }));
            folders.insertBefore(b, folderButtons.get(before));
          }
        },
        docBack: (base, S) => (tools) => S.button(tools, 'Inbox', 'back', { back: true }, 'more', 'back-control'),
        docMeta: (base, S) => (meta, e) => {
          S.el('h2', '', meta, e.subject);
          S.el('span', 'avatar', meta, e.name.charAt(0).toUpperCase());
          S.el('div', 'sender-name', meta, e.name);
          S.el('div', 'address', meta, '<' + e.addr + '>');
          S.el('div', 'to-line', meta, 'to me' + S.cc(e));
          S.el('div', 'time-line', meta, e.time);
        },
        editorFormat: (base, S) => () => {
          const fmt = S.el('div', 'formatbar', S.els.editor);
          for (const label of ['B', 'I', 'U']) S.el('span', 'format-' + label, fmt, label);
          for (const k of ['bullets', 'numbered', 'link', 'smile']) {
            const item = S.el('span', 'format-icon', fmt);
            item.innerHTML = S.P.icon(k);
          }
        },
        editorBody: (base, S) => (shown) => {
          const area = S.el('textarea', '', S.els.editor);
          area.placeholder = shown.mode === 'forward' ? S.D.forwardPlaceholder : S.D.replyPlaceholder;
          area.spellcheck = false;
          S.els.fields.body = env.ui.textField(area, {
            value: shown.body || '',
            label: 'body',
            ...(S.D.keyboard && { keyboard: true }),
            onInput: (value) => S.field('body', value),
          });
          S.els.reg.set('field:body', area);
          return area;
        },
      },
    },
  });
})();
