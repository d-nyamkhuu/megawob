// QuickMail's illustrated icons, Get Mail decoy, and compact, overflowing message list.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-star-06',
    name: 'design',
    split: 'train',
    scenarios: ['star'],
    template: 'use-email/mail',
    design: {
      style: 'flash',
      folderList: ['inbox', 'drafts', 'sent', 'junk', 'trash', 'archive', 'compose'],
      folderLabels: { sent: 'Sent', drafts: 'Drafts', junk: 'Junk', spam: 'Spam', templates: 'Templates', compose: 'Compose' },
      rowHeight: 34.4,
      ledgerTitle: 'Mail',
      docTitle: 'Message Preview',
      searchPlaceholder: 'Search',
      scrollToRowIcon: false,
      parts: {
        icon: (base, S) => (k) => {
          const defs = '<defs><linearGradient id="aqua" x2="0" y2="1"><stop stop-color="#d8f2ff"/><stop offset=".45" stop-color="#78b8f1"/><stop offset="1" stop-color="#2873ce"/></linearGradient><linearGradient id="paper" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#c3d7e8"/></linearGradient><linearGradient id="metal" x2="1" y2="0"><stop stop-color="#758b9a"/><stop offset=".35" stop-color="#e1edf2"/><stop offset=".6" stop-color="#859ba9"/><stop offset="1" stop-color="#526c7e"/></linearGradient></defs>';
          let shape;
          if (['mail', 'unread', 'sent', 'inbox', 'junk'].includes(k))
            shape = (k === 'inbox' ? '<path d="M4 2h13l3 4v9H4Z" fill="url(#paper)" stroke="#7293b3"/>' : '') +
              '<rect x="2" y="6" width="20" height="15" rx="2" fill="url(#aqua)" stroke="#527ca9"/><path d="m3 7 9 8 9-8M3 20l7-7m4 0 7 7" fill="none" stroke="#eaf8ff" stroke-width="1.3"/>' +
              (k === 'junk' ? '<path d="m4 10 6 5-1 7-5-3zm16 0-6 5 1 7 5-3z" fill="#d9b15a" stroke="#a08042"/>' : '');
          else if (k === 'drafts' || k === 'file')
            shape = '<path d="M5 1h11l4 5v17H5Z" fill="url(#paper)" stroke="#6894c8"/><path d="M16 1v6h4M8 10h8M8 13h8M8 16h7" fill="none" stroke="#8fa9c4"/><path d="m11 20 2-5 8-8 2 2-9 9z" fill="#d5e7fb" stroke="#467bb4"/>';
          else if (k === 'trash')
            shape = '<path d="m5 6 1 16q6 3 12 0l1-16" fill="url(#metal)" stroke="#546b7e"/><ellipse cx="12" cy="5" rx="9" ry="3" fill="url(#metal)" stroke="#546b7e"/><path d="M9 3V1h6v2M8 8l1 12m3-12v13m4-13-1 12" fill="none" stroke="#556e82"/>';
          else if (['archive', 'move', 'compose'].includes(k))
            shape = '<path d="M2 7V3h8l3 4" fill="url(#paper)" stroke="#7497c2"/><rect x="1" y="7" width="22" height="15" rx="2" fill="url(#aqua)" stroke="#4b7cac"/><path d="m12 12 3 3-3 3-3-3z" fill="#f4fbff" stroke="none"/>';
          else if (k === 'delete')
            shape = '<circle cx="12" cy="12" r="9.4" fill="url(#metal)" stroke="#943e31"/><circle cx="12" cy="12" r="7.5" fill="#e5edf4" stroke="#c85c47" stroke-width="2.5"/><path d="m6.5 17.5 11-11" stroke="#ad493b" stroke-width="2.8"/>';
          else if (k === 'new')
            shape = '<rect x="3" y="4" width="17" height="17" rx="1" fill="url(#paper)" stroke="#6995c6"/><path d="m8 17 2-5L21 1l2 2-11 11z" fill="#ddb769" stroke="#647b8a"/><path d="m8 17 4-3" stroke="#4b5363"/>';
          else shape = '<path d="' + (S.paths[k] || S.paths.mail) + '"' + (['reply', 'replyall', 'forward'].includes(k) ? ' fill="url(#aqua)"' : '') + '/>';
          return '<svg viewBox="0 0 24 24" aria-hidden="true">' + defs + shape + '</svg>';
        },
        newButton: (base, S) => () => {
          const b = S.button(S.els.toolbar, 'Get Mail', null, null, 'mail', 'get-mail');
          b.addEventListener('click', () => env.log('decoy', { label: 'Get Mail' }));
          base();
        },
        folderIcon: (base, S) => (v) => v,
        listStart: (base, S) => (m, order) => {
          base(m, order);
          S.els.listWrap.classList.toggle('list-overflow', order.length > S.spec.rows);
        },
      },
    },
  });
})();
