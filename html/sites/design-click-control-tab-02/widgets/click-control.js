// This design gives each tab a ledger table with document and link rows.
env.widget({
  task: 'click-control',
  site: 'design-click-control-tab-02',
  name: 'design',
  split: 'train',
  scenarios: ['tab'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      tabButton: () => () => {},
      tabPanel: () => (ctx, p, t, i, links) => {
        const { util } = ctx;
        const table = util.el('table', 'ledger-rows', p);
        table.innerHTML = '<tr><th>Title</th><th>Type</th><th>Updated</th></tr>';
        t.words.forEach((word, j) => {
          const row = util.el('tr', '', table);
          const cell = util.el('td', '', row);
          if (word.link) {
            const a = util.el('span', 'uc-link', cell, word.text);
            a.dataset.key = i + '.' + j;
            a.dataset.role = 'link';
            links.push(a);
          } else {
            cell.append(word.text);
          }
          util.el('td', '', row, word.link ? 'Link' : 'Document');
          util.el('td', '', row, '04/' + String(12 - j).padStart(2, '0') + '/1992');
        });
      },
    },
  },
});
