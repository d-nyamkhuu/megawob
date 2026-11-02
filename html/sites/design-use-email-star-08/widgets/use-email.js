// QuickMail design: custom star, tall rows, a search field in the message title, and richer message details.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-star-08',
    name: 'design',
    split: 'train',
    scenarios: ['star'],
    template: 'use-email/mail',
    design: {
      rowHeight: 123,
      rowBasis: 'size',
      folderList: ['inbox', 'compose', 'sent', 'drafts', 'trash'],
      folderLabels: { sent: 'Sent Mail' },
      searchPlaceholder: 'Search mail',
      paths: {
        star: 'M12 2.2 15.05 8.39 21.9 9.38 16.95 14.2 18.12 21.01 12 17.8 5.88 21.01 7.05 14.2 2.1 9.38 8.95 8.39Z',
      },
      parts: {
        listStart: (base, S) => (m, order) => {
          base(m, order);
          S.els.listWrap.classList.toggle('has-overflow', order.length > S.spec.rows);
        },
        docMade: (base, S) => () => {
          base();
          S.els.doc.querySelector('.window-title').append(S.els.searchline);
        },
        docMeta: (base, S) => (meta, e, i, m, d) => {
          S.el('h2', '', meta, e.subject);
          S.el('span', 'av', meta, e.name.charAt(0).toUpperCase());
          S.el('div', 'from', meta, e.name);
          S.el('div', 'address addr', meta, '<' + e.addr + '>');
          S.el('div', 'to', meta, 'to me' + (e.cc.length ? ' · Cc: ' + e.cc.map((x) => x.name).join(', ') : ''));
          S.el('div', 'address when', meta, e.time);
        },
        attachment: (base, S) => (content, a, e) => {
          const b = S.el('div', 'attachment', content);
          b.innerHTML = S.P.icon('file');
          const info = S.el('div', 'attachment-info', b);
          S.el('div', '', info, a.file);
          S.el('div', 'attachment-size', info, a.size);
        },
      },
    },
  });
})();
