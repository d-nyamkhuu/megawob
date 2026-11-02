// CityMail labels, message metadata, overflow marker, and catalog card for this reply design.
(function () {
  'use strict';
  env.widget({
    task: 'use-email',
    site: 'design-use-email-reply-09',
    name: 'design',
    split: 'train',
    scenarios: ['reply'],
    template: 'use-email/mail',
    design: {
      ledgerTitle: 'Library Mail',
      docTitle: 'Message Details',
      columns: ['From', 'Subject', 'Received', ''],
      cancelLabel: 'Save Draft',
      parts: {
        rowsBuilt: (base, S) => (m, order, rowH, avail) => {
          base(m, order, rowH, avail);
          const { list, listWrap } = S.els;
          listWrap.classList.toggle('mailbox-scrollable', list.scrollHeight > list.clientHeight + 1);
        },
        docMeta: (base, S) => (meta, e) => {
          for (const [k, v] of [
            ['From:', e.name],
            ['To:', S.spec.me.name + S.cc(e)],
            ['Subject:', e.subject],
            ['Received:', e.time],
          ]) {
            const kv = S.el('div', 'kv', meta);
            S.el('span', 'k', kv, k);
            S.el('span', 'v', kv, v);
          }
        },
        docActions: (base, S) => (d, e, i, m) => {
          base(d, e, i, m);
          const cat = S.el('div', 'catalog', S.els.docInside);
          S.el('h3', '', cat, 'Related Catalog');
          const cr = S.el('div', 'cat-row', cat);
          const cv = S.el('div', 'cover', cr);
          S.el('span', '', cv, 'MARITIME HISTORY');
          const ci = S.el('div', 'cat-info', cr);
          S.el('b', '', ci, 'Maritime History');
          S.el('div', '', ci, 'Various Authors');
          S.el('div', '', ci, 'Call No. 910 MAR');
          S.el('u', '', ci, 'View in Catalog');
        },
      },
    },
  });
})();
