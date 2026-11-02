// Design of this site on the use-email/mail template (templates/use-email/mail.js): Carbon icon art, a sidebar
// Junk decoy, address lines in the message header, the original message quoted inside the forward editor.
// Icon art of the design: filled glyphs by name; other icons draw from the path table.
(function () {
  'use strict';
  const special = {mail:'<path fill="#e6f3ff" stroke="#689bbd" d="M2 5h20v15H2z M2 5l10 8L22 5"/>',inbox:'<path fill="#edb95d" stroke="#ad843c" d="M4 3h16v9H4z"/><path fill="#e6f3ff" stroke="#689bbd" d="M2 7h20v13H2z M2 7l10 8L22 7"/>',sent:'<path fill="#e6f3ff" stroke="#689bbd" d="M2 5h20v15H2z M2 5l10 8L22 5"/>',drafts:'<path fill="#fff" stroke="#aaa" d="M5 2h12l3 3v17H5z"/><path stroke="#bcc5ca" d="M8 6h8 M8 10h8 M8 14h8"/><path stroke="#c19a54" stroke-width="3" d="m11 19 10-11"/>',trash:'<path stroke="#e7ecee" stroke-width="2.5" d="M4 6h16 M9 3h6 M6 7l1 14h10l1-14 M10 10v8 M14 10v8"/>',new:'<path fill="#fffbea" stroke="#aaa" d="M2 4h19v14H2z M2 4l10 8 9-8"/><path stroke="#64b338" stroke-width="3" d="M18 13v9 M14 17h9"/>',delete:'<path stroke="#e24b40" stroke-width="3.5" d="m4 4 16 16 M20 4 4 20"/>',close:'<circle cx="12" cy="12" r="9" stroke="#e24b40" stroke-width="2.5"/><path stroke="#e24b40" stroke-width="2.5" d="m6 6 12 12"/>',file:'<path fill="#fff" stroke="#a0a7b0" d="M6 1h12l4 4v18H6z M18 1v5h4"/><path stroke="#b5bac2" d="M9 9h10 M9 12h10 M9 15h10 M9 18h10"/><path fill="#126ad3" stroke="#fff" d="M1 7h11v12H1z"/><text x="3" y="16" fill="#fff" stroke="none" font-size="9" font-family="Arial" font-weight="bold">W</text>'};
  special.junk='<path fill="#f6ead5" stroke="#aaa" d="M4 4h16v18H4z"/><path fill="#d14c38" stroke="#eee" d="M3 7h18v5H3z"/><circle cx="12" cy="15" r="5" fill="#d34932" stroke="#fff"/><path stroke="#fff" d="m9 12 6 6"/>';
  const blue='<defs><linearGradient id="carbon-blue" x2="0" y2="1"><stop stop-color="#83c9fb"/><stop offset="1" stop-color="#1878d6"/></linearGradient></defs>';
  special.reply=blue+'<path fill="url(#carbon-blue)" stroke="#377dad" stroke-width=".5" d="M10 3 1 11l9 7v-5c6-1 9 1 11 7 2-8-2-13-11-12z"/>';
  special.replyall=blue+'<path fill="url(#carbon-blue)" stroke="#377dad" stroke-width=".5" d="m8 3-8 8 8 7v-5l-3-2 3-3z M15 3l-9 8 9 7v-5c4-1 7 1 8 7 2-8-1-13-8-12z"/>';
  special.forward=blue+'<path fill="url(#carbon-blue)" stroke="#377dad" stroke-width=".5" d="M14 3 23 11 14 19v-5H2V8h12z"/>';
  special.move='<defs><linearGradient id="carbon-gold" x2="0" y2="1"><stop stop-color="#ffeaa0"/><stop offset="1" stop-color="#deb451"/></linearGradient></defs><path fill="#d9aa4b" stroke="#ab8538" stroke-width=".5" d="M2 4h8l2 3h10v15H2z"/><path fill="url(#carbon-gold)" stroke="#b49042" stroke-width=".5" d="M1 9h22v13H1z"/>';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-forward-09',
    name: 'design',
    split: 'train',
    scenarios: ['forward'],
    template: 'use-email/mail',
    design: {
      rowHeight: 34,
      folderList: ['inbox', 'drafts', 'sent', 'archive', 'trash'],
      rowBasis: 'stage',
      rowRef: 1300,
      newLabel: 'New',
      searchPlaceholder: 'Search mail',
      columns: ['From', 'Subject', 'Received', ''],
      sendIcon: null,
      parts: {
        icon: (base, S) => (k) =>
          '<svg viewBox="0 0 24 24" aria-hidden="true">' +
          (special[k] || '<path d="' + (S.paths[k] || S.paths.mail) + '"/>') +
          '</svg>',
        toolbarStar: (base, S) => () => {
          S.button(S.els.toolbar, 'Move', 'decoy:move', () => ({}), 'move', 'toolbar-xtra');
          S.button(S.els.toolbar, 'Spam', 'decoy:spam', () => ({}), 'close', 'toolbar-xtra spam');
          base();
        },
        searchInput: (base, S) => (searchline) => {
          S.el('span', 'search-glass', searchline, '');
          return base(searchline);
        },
        folderStart: (base, S) => (v) => {
          if (v === 'archive') S.button(S.els.folders, 'Junk', null, null, 'junk', 'folder junk-xtra');
        },
        folderIcon: (base, S) => (v) => (['inbox', 'drafts', 'sent', 'trash'].includes(v) || S.paths[v] ? v : 'move'),
        folderMade: (base, S) => (v, b) => {
          if (v === 'archive') b.classList.add('extra-folder');
        },
        docMeta: (base, S) => (meta, e) => {
          const { el, cc } = S;
          for (const [label, value] of [
            ['From', e.name + ' <' + e.addr + '>'],
            ['To', S.spec.me.name + (S.spec.me.addr ? ' <' + S.spec.me.addr + '>' : '') + cc(e)],
            ['Subject', e.subject],
          ]) {
            const line = el('div', 'meta-line', meta);
            el('span', 'meta-label', line, label + ':');
            el('span', '', line, value);
          }
          el('div', 'address', meta, e.time);
        },
        attachment: (base, S) => (content, a) => {
          const { el } = S;
          const b = el('div', 'attachment', content);
          b.innerHTML = S.P.icon('file');
          if (!/\.docx?$/i.test(a.file)) {
            b.classList.add('generic-attachment');
            const badge = el('span', 'file-kind', b, /\.pdf$/i.test(a.file) ? 'PDF' : '');
            if (!badge.textContent)
              badge.innerHTML =
                '<svg viewBox="0 0 16 16"><path d="M1 1h14v14H1z" fill="#b5cee1"/><path d="m2 13 4-6 3 4 2-3 3 5" fill="#659258"/><circle cx="11" cy="4" r="2" fill="#efcd64"/></svg>';
          }
          const details = el('div', 'attachment-details', b);
          el('div', '', details, a.file);
          el('div', 'attachment-size', details, a.size);
        },
        editorTitle: (base, S) => (shown) => {
          const t = base(shown);
          if (shown.mode === 'forward') t.textContent = 'Fwd: ' + S.spec.emails[shown.of ?? 0].subject;
          return t;
        },
        editorFields: (base, S) => (group, shown) => {
          base(group, shown);
          const toRow = group.querySelector('.field-row');
          const links = S.el('div', 'recipient-links', toRow);
          for (const label of ['Cc', 'Bcc']) {
            const b = S.el('button', '', links, label);
            b.type = 'button';
            b.addEventListener('click', (ev) => {
              ev.preventDefault();
              group.classList.toggle('show-cc');
            });
          }
        },
        editorBody: (base, S) => (shown) => {
          const { el, D } = S;
          const { editor, reg } = S.els;
          const bodyBox = el('div', 'forward-body', editor);
          if (shown.mode === 'forward') {
            const original = S.spec.emails[shown.of ?? 0];
            el(
              'div',
              'original-header',
              bodyBox,
              '----- Original Message -----\nFrom: ' +
                original.name +
                ' <' +
                original.addr +
                '>\nTo: ' +
                S.spec.me.name +
                (S.spec.me.addr ? ' <' + S.spec.me.addr + '>' : '') +
                '\nSent: ' +
                original.time +
                '\nSubject: ' +
                original.subject,
            );
          }
          const area = el('textarea', '', bodyBox);
          area.placeholder = shown.mode === 'forward' ? D.forwardPlaceholder : D.replyPlaceholder;
          area.spellcheck = false;
          S.els.fields.body = env.ui.textField(area, { value: shown.body || '', label: 'body', onInput: (v) => S.field('body', v) });
          reg.set('field:body', area);
          return area;
        },
        actionsStart: (base, S) => (acts) => {
          const attach = S.button(acts, 'Attach', null, null, null, 'attach-control');
          const clip = S.el('span', 'paperclip', attach);
          clip.innerHTML =
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 17 9-9a3 3 0 0 0-4-4L4 13a5 5 0 0 0 7 7l9-9a7 7 0 0 0-10-10L2 9 M7 14l8-8"/></svg>';
        },
        cancelButton: (base, S) => (acts) => S.button(acts, 'Cancel', 'compose:discard', { discard: true }, null, 'discard-control'),
      },
    },
  });
})();
