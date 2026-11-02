// Design of this site on the use-email/mail template (templates/use-email/mail.js): flash with detailed icons, a
// message pane that says "No message selected" until a message is open, and cell text wrappers in the list.
// Detailed icon art.
(function () {
  'use strict';
  const detailed = {
    new: '<path d="M4 2h13v20H4z" fill="white" stroke="black"/><path d="M7 6h7M7 9h7M7 12h6M7 15h5" stroke="#000080"/><path d="m12 16 8-12 3 2-8 12-4 2z" fill="#ffd82e" stroke="black"/>',
    reply: '<path d="M9 2 1 10l8 7v-5c8-1 10 3 11 8l2-7C21 6 16 5 9 6z" fill="white" stroke="black"/><path d="M9 3 3 10l6 5M10 7c7-1 10 2 11 7" stroke="#000080"/>',
    replyall: '<path d="M7 2 1 8l6 6M7 8l6-6v5c7-1 9 3 10 10l-4 5c0-8-3-10-6-10v6L7 12z" fill="white" stroke="#000080"/><path d="M7 3 2 8l5 5M13 3v4c8 0 10 4 10 11" stroke="black"/>',
    forward: '<path d="M3 8h12V3l8 8-8 8v-5H3z" fill="white" stroke="black"/><path d="M17 5l4 6-4 6M4 10h10" stroke="#0068ac"/>',
    delete: '<path d="m3 2 9 9 9-9 2 2-9 9 9 9-2 2-9-9-9 9-2-2 9-9-9-9z" fill="#e51d1d" stroke="#6f1515"/>',
    unread: '<path d="M1 3h20v17H1z" fill="white" stroke="black"/><path d="M3 5h14M3 8h12" stroke="#1450c5"/><path d="M1 10l10 7L21 7v13H1z" fill="#ddd" stroke="black"/><path d="m13 15 6 3 4-7" stroke="#000080"/>'
  };
  env.widget({
    task: 'use-email',
    site: 'design-use-email-star-10',
    name: 'design',
    split: 'train',
    scenarios: ['star'],
    template: 'use-email/mail',
    design: {
      rowHeight: 40.5,
      newLabel: 'New',
      columns: ['From', 'Subject', 'Received', ''],
      scrollToRowIcon: false,
      parts: {
        icon: (base, S) => (k) =>
          '<svg viewBox="0 0 24 24" aria-hidden="true">' +
          (detailed[k] || '<path d="' + (S.paths[k] || S.paths.mail) + '"/>') +
          '</svg>',
        toolbarStar: (base, S) => () => {
          S.button(S.els.toolbar, 'Mark Read', null, () => ({}), 'unread');
          base();
        },
        makeColumns: (base, S) => (col) => {
          for (const s of S.D.columns) {
            const cell = S.el('span', 'column-cell', col);
            if (s) S.el('span', 'column-label', cell, s);
            else cell.innerHTML = S.P.icon('star');
          }
        },
        availHeight: (base, S) => (occupied) => Math.max(40, Math.min(S.els.ledger.clientHeight - occupied, S.els.listWrap.clientHeight)),
        // Keep the reference's white pane, but give the listbox exactly the number of visible rows the task plans for.
        // Otherwise a short list cannot scroll, while the oracle keeps requesting a nonzero scroll position.
        listSized: (base, S) => (m, order, rowH) => {
          const { list, track } = S.els;
          list.style.bottom = 'auto';
          list.style.height = rowH * S.spec.rows + 'px';
          track.style.bottom = 'auto';
          track.style.height = rowH * S.spec.rows + 'px';
        },
        rowSender: (base, S) => (r, e) => {
          const sender = S.el('span', 'sender', r);
          S.el('span', 'cell-text', sender, e.name);
        },
        rowTime: (base, S) => (r, e) => {
          const time = S.el('span', 'time', r);
          S.el('span', 'cell-text', time, e.time);
        },
        docMeta: (base, S) => (meta, e, i, m) => {
          const hasMessage = m.open !== null || !!m.compose;
          for (const [label, value] of [
            ['From:', e.name],
            ['Subject:', e.subject],
            ['Received:', e.time],
          ]) {
            const line = S.el('div', 'meta-line', meta);
            S.el('strong', '', line, label);
            S.el('span', '', line, hasMessage ? value : '—');
          }
        },
        docContent: (base, S) => (d, e, i, m) => {
          const hasMessage = m.open !== null || !!m.compose;
          const content = (d.content = S.el('div', 'message-content', S.els.docInside));
          S.el('div', 'body-copy', content, hasMessage ? e.body : 'No message selected.\n\nClick an email from the list to view its contents.');
          if (hasMessage) for (const a of e.att) S.P.attachment(content, a, e);
          S.sentNotes(content, i, m);
        },
      },
    },
  });
})();
