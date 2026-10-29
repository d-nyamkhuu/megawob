// Thunderbird design with taller rows, a Mail list title and separate sender labels.
env.widget({
  task: 'use-email',
  site: 'design-use-email-important-09',
  name: 'design',
  split: 'train',
  scenarios: ['important'],
  template: 'use-email/mail',
  design: {
    rowHeight: 46,
    ledgerTitle: 'Mail',
    columns: ['From', 'Subject', 'Date', 'Important'],
    parts: {
      docMeta: (base, S) => (meta, e) => {
        S.el('h2', '', meta, e.subject);
        const from = S.el('div', 'from-line', meta);
        S.el('span', 'meta-label', from, 'From:');
        S.el('span', '', from, e.name);
        S.el('div', 'address', meta, '<' + e.addr + '>');
        S.el('div', '', meta, 'To: ' + S.spec.me.name + S.cc(e));
        S.el('div', 'address', meta, e.time);
      },
    },
  },
});
