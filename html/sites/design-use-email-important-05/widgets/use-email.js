// Thunderbird design with colored icons, compact rows, and a message importance indicator.
(function () {
  'use strict';
  const art = {
    mail:'<rect x="3" y="5" width="18" height="14" rx="1" fill="#f8fbff"/><path d="m3 5 9 8 9-8 M3 19l6-6 M21 19l-6-6" fill="none"/>',
    sent:'<rect x="2" y="4" width="20" height="16" rx="1" fill="#fafafa"/><path d="m2 4 10 9L22 4 M2 20l7-7 M22 20l-7-7" fill="none"/>',
    unread:'<path d="M3 8 12 2l9 6v13H3z" fill="#edf4fc"/><path d="M5 5h14v12H5z" fill="#fff"/><path d="m3 8 9 8 9-8 M3 21l7-7 M21 21l-7-7" fill="#edf4fc"/>',
    important:'<path d="M4 22V2h2v20z" fill="#e1e1e1" stroke="#4c5054"/><path class="flag-cloth" d="M6 3c4-2 8 3 14 0v10c-6 3-10-2-14 0z" fill="currentColor" stroke="#47474b"/>',
    inbox:'<path d="M8 6V3c0-2 8-2 8 0v3" fill="none"/><path d="M3 6h18l1 14H2z" fill="#95bbde"/><path d="M3 6h18v6H3z" fill="#bfd8ee"/><path d="M2 14h20M11 12h3v4h-3z" fill="#e6eef7"/><path d="M5 18h3" stroke="#fff"/>',
    drafts:'<path d="M5 1h10l5 5v17H5z" fill="#fff"/><path d="M15 1v6h5 M8 10h9 M8 13h9 M8 16h9 M8 19h7" fill="none"/><path d="M8 4h4M8 7h4" stroke="#7895ac"/>',
    junk:'<circle cx="12" cy="12" r="10" fill="#e63333" stroke="#333"/><circle cx="12" cy="12" r="7.3" fill="#f8f8f8" stroke="#fff"/><path d="m5 5 14 14" stroke="#bf161c" stroke-width="2.7"/>',
    trash:'<path d="M5 6h14l-1 16H6z" fill="#e6eaf1"/><path d="M3 5h18v2H3z M8 5V2h8v3 M9 10v9 M12 10v9 M15 10v9" fill="none"/>',
    new:'<path d="M3 3h16v18H3z" fill="#fff"/><path d="M6 7h6 M6 11h7 M6 15h6 M6 18h9" fill="none" stroke="#52738f"/><path d="m10 15 3-6 7-7 2 2-7 8z" fill="#ebb058" stroke="#3a4c64"/><path d="m10 15 4-1-3-3z" fill="#333"/>',
    reply:'<path d="m9 4-8 8 8 7v-5h8l5 3v-7l-5-2H9z" fill="#77a5d3"/>',
    replyall:'<path d="m7 4-6 8 6 7v-5" fill="#9ebfdf"/><path d="m13 4-8 8 8 7v-5h5l5 3v-7l-5-2h-5z" fill="#77a5d3"/>',
    forward:'<path d="m15 4 8 8-8 7v-5H2V8h13z" fill="#77a5d3"/>',
    delete:'<path d="m4 3 8 8 8-8 2 2-8 8 8 8-2 2-8-8-8 8-2-2 8-8-8-8z" fill="#dc323c" stroke="#4c4c4c"/>'
  };
  env.widget({
    task: 'use-email',
    site: 'design-use-email-important-05',
    name: 'design',
    split: 'train',
    scenarios: ['important'],
    template: 'use-email/mail',
    design: {
      rowHeight: 37.5,
      rowBasis: 'size',
      folderList: ['inbox', 'sent', 'drafts', 'junk', 'trash'],
      folderLabels: { junk: 'Spam' },
      paths: {
        delete: 'm5 5 14 14 M19 5 5 19',
        trash: 'M4 6h16 M9 6V3h6v3 M6 6l1 15h10l1-15 M10 10v7 M14 10v7',
        sent: 'M3 5h18v14H3z M3 5l9 7 9-7',
        drafts: 'M5 2h9l5 5v15H5z M14 2v6h5 M8 12h8 M8 16h8',
        junk: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z M6 6l12 12',
      },
      importantIcon: 'important',
      searchPlaceholder: 'Search mail',
      columns: ['From', 'Subject', 'Date', '!'],
      parts: {
        icon: (base, S) => (k) =>
          '<svg class="icon-' + k + '" viewBox="0 0 24 24" aria-hidden="true">' +
          (art[k] || '<path d="' + (S.paths[k] || S.paths.mail) + '"/>') + '</svg>',
        toolbarMade: (base, S) => () => {
          base();
          S.button(S.els.toolbar, 'Mark unread', 'toolbar:unread',
            () => S.action('unread', S.ctx.model.open ?? 0), 'unread');
        },
        listStart: (base, S) => (m, order) => {
          base(m, order);
          S.els.root.classList.toggle('mail-overflow', order.length > S.spec.rows);
        },
        occupiedKeep: (base) => (v) => base(v) && getComputedStyle(v).position !== 'fixed',
        docMeta: (base, S) => (meta, e) => {
          const mrow = (label, text) => {
            const row = S.el('div', 'mrow', meta);
            S.el('b', '', row, label);
            S.el('span', '', row, text);
          };
          mrow('From:', e.name + ' <' + e.addr + '>');
          mrow('Subject:', e.subject);
          mrow('Date:', e.time);
          mrow('To:', S.spec.me.name + S.cc(e));
          const imp = S.el('div', 'imp-state', meta);
          imp.innerHTML = S.P.icon('important') + '<span></span>';
        },
        docFlags: (base, S) => (m, i) => {
          base(m, i);
          const st = S.els.docInside.querySelector('.imp-state');
          if (st) {
            st.classList.toggle('on', !!m.flags[i].important);
            st.querySelector('span').textContent = m.flags[i].important ? 'Important' : 'Not important';
          }
        },
      },
    },
  });
})();
