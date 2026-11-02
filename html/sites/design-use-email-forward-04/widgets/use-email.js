// Bauhaus mail with colored folder icons, contact addresses, message metadata and attachment panels,
// plus the original Forward Message title and Cc/Bcc decorations.
(function () {
  'use strict';
  const pixel = {
    inbox: '<path fill="#efd37a" d="M2 10h20v11H2z"/><path fill="#fff6d2" d="m2 10 10 7 10-7-5-4H7z"/><path fill="#d2e6f3" d="M7 3h10v9H7z"/><path fill="#e7c674" d="M10 1h4v4h-4z"/>',
    sent: '<path fill="#f4f8ff" d="M2 5h20v15H2z"/><path d="m2 5 10 8L22 5M2 20l7-8m13 8-7-8"/>',
    drafts: '<path fill="#f2d57b" d="M5 2h11l4 4v16H5z"/><path fill="#d7ecf4" d="M7 4h8v5H7z"/><path d="M8 12h9M8 15h7M8 18h7"/>',
    trash: '<path fill="#c1dde9" d="M5 6h14v15H5z"/><path fill="#a8ccd7" d="M3 4h18v3H3zM9 1h6v3H9z"/><path d="M9 10v8M15 10v8"/>',
    junk: '<path fill="#f2d57b" d="M2 9h20v12H2z"/><path fill="#f6df9c" d="m2 9 5-6h10l5 6-10 8z"/>',
    clip: '<path d="m8 16 8-8c3-3 7 1 4 4L10 22c-5 5-11-1-6-6L15 5c5-5 12 2 7 7L12 22" transform="translate(-1 -2)"/>',
  };
  env.widget({
    task: 'use-email',
    site: 'design-use-email-forward-04',
    name: 'design',
    split: 'train',
    scenarios: ['forward'],
    template: 'use-email/mail',
    design: {
      rowHeight: 44,
      folderList: ['inbox', 'sent', 'drafts', 'trash', 'junk'],
      folderLabels: { trash: 'Deleted' },
      foldersTitle: 'Folders',
      contactsTitle: 'Suggested Contact',
      forwardTitle: 'Forward Message',
      parts: {
        icon: (base) => (k) => pixel[k]
          ? '<svg viewBox="0 0 24 24" aria-hidden="true">' + pixel[k] + '</svg>'
          : base(k),
        contactMade: (base, S) => (b, p) => {
          S.el('small', 'addr', b, p.addr || p.email || (p.name.toLowerCase().replace(/[^a-z]+/g, '.') + '@northwind.com'));
        },
        folderIcon: (base) => (v) => ['sent', 'drafts', 'trash', 'junk'].includes(v) ? v : base(v),
        docMeta: (base, S) => (meta, e) => {
          const { el, spec } = S;
          el('h2', '', meta, e.subject);
          const ml = (k, v) => {
            const d = el('div', 'mline', meta);
            el('b', '', d, k);
            el('span', '', d, v);
          };
          ml('From:', e.name + ' <' + e.addr + '>');
          ml('To:', spec.me.name + (spec.me.addr ? ' <' + spec.me.addr + '>' : '') + S.cc(e));
          ml('Date:', e.time);
        },
        docContent: (base, S) => (d, e, i, m) => {
          const content = (d.content = S.el('div', 'message-content', S.els.docInside, e.body));
          if (e.att.length) {
            const attachments = S.el('div', 'attachments', S.els.docInside);
            for (const a of e.att) {
              const b = S.el('div', 'attachment', attachments);
              b.innerHTML = S.P.icon('clip');
              S.el('span', '', b, a.file + ' (' + a.size + ')');
            }
          }
          S.sentNotes(content, i, m);
        },
        editorRowMade: (base, S) => (row, k) => {
          if (k === 'to') {
            S.el('span', 'abook', row);
            const ac = S.el('span', 'addcc', row);
            S.el('u', '', ac, 'Add Cc');
            ac.append(' | ');
            S.el('u', '', ac, 'Add Bcc');
          }
        },
      },
    },
  });
})();
