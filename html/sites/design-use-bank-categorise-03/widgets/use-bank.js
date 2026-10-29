// Design on the shared use-bank/classic workspace; the Riverbend dressing is applied while the rows are rendered.
(function () {
  'use strict';
  const colors = { Groceries: '#1dc886', Transport: '#3284f5', Shopping: '#a950ef', Health: '#ff5688', Entertainment: '#a35af4', Utilities: '#19c999', 'Bills & Utilities': '#19c999', Travel: '#31bfc4', Dining: '#ffad21', Uncategorised: '#8699b7', Other: '#8699b7' };
  const symbols = { Groceries: '▰', Transport: '▣', Shopping: '▰', Health: '♥', Entertainment: '♟', Utilities: 'ϟ', 'Bills & Utilities': 'ϟ', Travel: '✈', Dining: '♨', Uncategorised: '•••' };
  const merchantColors = ['#14bf77', '#006e54', '#ffb600', '#b45a1d', '#258fff', '#e83444', '#edb600', '#fb4268', '#9b64d9'];
  const merchantIcon = (name) => {
    let drawing = '<path d="M6 8h12l1 13H5zM9 8V6a3 3 0 0 1 6 0v2"/>';
    if (/fish|market|foods|grocery/i.test(name)) drawing = '<path d="M4 12c5-8 11-8 16 0-5 8-11 8-16 0zm0 0-3-4v8z"/><circle cx="15" cy="11" r="1"/>';
    else if (/auto|motors|transport/i.test(name)) drawing = '<path d="m5 5-3 7v8h4v-3h12v3h4v-8l-3-7zM4 11h16M6 14h2m8 0h2"/>';
    else if (/media|records|music|entertain/i.test(name)) drawing = '<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 6 3-6 3z"/>';
    else if (/clinic|health|hospital|pharm/i.test(name)) drawing = '<path d="M12 21C-5 11 3-1 12 7c9-8 17 4 0 14z"/>';
    else if (/logistics|movers|trading/i.test(name)) drawing = '<path d="M2 5h13v12H2zM15 10h4l3 4v3h-7z"/><circle cx="6" cy="18" r="2"/><circle cx="18" cy="18" r="2"/>';
    else if (/mining|metal|electronics|software/i.test(name)) drawing = '<path d="m3 8 4-5h10l4 5-9 13zM3 8h18M7 3l5 18 5-18"/>';
    else if (/farm|florist|green/i.test(name)) drawing = '<path d="M4 20C2 8 9 2 21 3c1 12-5 19-17 17zm0 0L17 7"/>';
    return '<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + drawing + '</svg>';
  };
  const formatDate = (iso) => {
    if (!iso) return '';
    const [year, month, day] = iso.split('-');
    return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][Number(month) - 1] + ' ' + Number(day) + ', ' + year;
  };

  env.widget({
    task: 'use-bank',
    site: 'design-use-bank-categorise-03',
    name: 'design',
    split: 'train',
    scenarios: ['categorise'],
    template: 'use-bank/classic',
    design: {
      parts: {
        // Account and period filters first, the list tools up beside the page heading.
        searchBox: (base) => (E) => {
          base(E);
          const toolbar = E.pane.querySelector('.bk-toolbar');
          const headtools = E.root.querySelector('.bk-headtools');
          if (!toolbar) return;
          if (headtools) for (const control of toolbar.querySelectorAll(':scope > .bk-btn')) headtools.append(control);
          const digits = String(E.s.cards?.[0] || '').slice(-4) || '4821';
          const filter = (cls, text) => {
            const button = E.u.el('button', cls, null, text + '  ⌄');
            button.type = 'button';
            button.addEventListener('click', () => env.log('decoy', { label: text }));
            return button;
          };
          toolbar.prepend(filter('rb-account-filter', 'Checking •••• ' + digits), filter('rb-period-filter', 'Last 30 days'));
        },
        table: (base) => (E) => {
          base(E);
          const heading = E.tableHost.querySelector('th');
          if (heading) heading.textContent = 'Merchant';
        },
        // Date and id are drawn from the first cell's data attributes, the merchant gets a coloured badge.
        transaction: (base) => (E, t, body) => {
          const i = body.children.length;
          base(E, t, body);
          const tr = body.lastElementChild;
          const cell = tr.cells[0];
          cell.dataset.date = formatDate(t.date);
          cell.dataset.id = t.id;
          cell.querySelector('.bk-merchant small')?.remove();
          E.u.el('span', 'rb-merchant-description', cell.querySelector('.bk-merchant-title').parentElement, 'Card purchase');
          const avatar = cell.querySelector('.bk-avatar');
          avatar.style.setProperty('--merchant-color', merchantColors[i % merchantColors.length]);
          avatar.innerHTML = merchantIcon(t.name);
          const picker = tr.cells[tr.cells.length - 1].querySelector('button');
          const category = (picker?.textContent || 'Uncategorised').replace(/[⌄▾▽▼]/g, '').trim();
          if (picker) {
            picker.dataset.category = category;
            picker.dataset.catSymbol = symbols[category] || '•';
            picker.style.setProperty('--cat-color', colors[category] || '#8293b4');
          }
        },
      },
    },
  });
})();
