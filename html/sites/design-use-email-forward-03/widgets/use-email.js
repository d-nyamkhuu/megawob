// Bauhaus mail with illustrated folders, counts, dated rows and an address-book forward editor.
(function () {
  'use strict';
  const art = {
    inbox: '<path d="M3 10h7l3 3h9l-3 9H5z" fill="#f9cd63"/><path d="m8 3 10 4-3 9-10-4z" fill="#fff"/><path d="m8 3 3 7 7-3M3 10l7 5 12-2"/>',
    sent: '<path d="m3 8 16-5 3 14-16 3z" fill="#fff"/><path d="m3 8 10 5 6-10M13 13l8 6-1-8" fill="#c7e4d8"/>',
    drafts: '<path d="M3 9h8l3 3h8l-4 10H5z" fill="#f4c260"/><path d="m8 3 10 2-2 12-10-2z" fill="#fff7d9"/><path d="m12 7 9 6-8 8-3-5z" fill="#f7ca66"/>',
    archive: '<path d="M3 7 12 3l9 4v14H3z" fill="#bcc0c5"/><path d="m3 7 9 4 9-4M12 11v8M5 5l7 3 7-3M9 13h6" fill="none"/>',
    trash: '<path d="M5 7h14l-2 15H7z" fill="#c5c6c8"/><ellipse cx="12" cy="6" rx="9" ry="3" fill="#eee"/><path d="M9 3h6M9 10v9M12 10v9M15 10v9"/>',
  };
  env.widget({
    task: 'use-email',
    site: 'design-use-email-forward-03',
    name: 'design',
    split: 'train',
    scenarios: ['forward'],
    template: 'use-email/mail',
    design: {
      rowHeight: 31,
      rowBasis: 'stage',
      ledgerTitle: 'Mail',
      docTitle: 'Message Preview',
      contactsTitle: 'Address Book',
      columns: ['From', 'Subject', 'Date', 'Size'],
      forwardTitle: 'Forward Message',
      parts: {
        icon: (base) => (k) => art[k]
          ? '<svg viewBox="0 0 24 24" aria-hidden="true">' + art[k] + '</svg>'
          : base(k),
        panel: (base, S) => (cls, title) => {
          const p = base(cls, title);
          S.el('span', 'window-controls', p, '▁ ▣ ×');
          return p;
        },
        rowTime: (base, S) => (r, e) => {
          S.el('span', 'time', r, 'Apr 26, 1999  ' + e.time);
          S.el('span', 'size', r, 5 + (e.body.length % 11) + ' KB');
        },
        paintFolders: (base, S) => (m) => {
          base(m);
          for (const [v, b] of S.els.folderButtons) {
            let n = b.querySelector('.count');
            if (['inbox', 'sent', 'drafts'].includes(v)) {
              if (!n) n = S.el('span', 'count', b);
              n.textContent = v === 'sent' ? m.sent.length
                : v === 'drafts' ? (m.compose ? 1 : 0) : m.box.filter((x) => x === v).length;
            }
          }
        },
        folderIcon: (base) => (v) => ['inbox', 'sent', 'drafts', 'archive', 'trash'].includes(v) ? v : base(v),
        docMeta: (base, S) => (meta, e) => {
          for (const [label, value] of [
            ['From:', e.name],
            ['Date:', 'Mon, Apr 26, 1999 ' + e.time],
            ['Subject:', e.subject],
          ]) {
            const line = S.el('div', 'meta-line', meta);
            S.el('span', '', line, label);
            S.el('span', '', line, value);
          }
        },
        editorTitleMade: (base, S) => (...args) => {
          base(...args);
          S.el('span', 'window-controls', S.els.editor, '▁ ▣ ×');
        },
        editorFields: (base, S) => (group, shown) => {
          const book = S.el('button', 'address-book-button', group, 'Address Book...');
          book.type = 'button';
          book.addEventListener('click', () => S.els.contact.classList.toggle('book-open'));
          base(group, shown);
        },
        editorFormat: (base, S) => (shown) => {
          base(shown);
          const original = S.spec.emails[shown.of ?? 0];
          if (shown.mode === 'forward') {
            S.el('div', 'original-header', S.els.editor,
              '----- Original Message -----\nFrom: ' + original.name
                + '\nDate: Mon, Apr 26, 1999 ' + original.time + '\nSubject: ' + original.subject);
          }
        },
        actionsStart: (base, S) => (acts, shown) => {
          base(acts, shown);
          const draft = S.el('button', 'save-draft', acts, 'Save Draft');
          draft.type = 'button';
          draft.addEventListener('click', () => env.log('decoy', { label: 'Save Draft' }));
        },
      },
    },
  });
})();
