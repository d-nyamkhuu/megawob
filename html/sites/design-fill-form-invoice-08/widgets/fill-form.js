// Invoice design: keep the site's form title, date control, receipt rendering, and stage-bounded dropdown.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-invoice-08',
  name: 'design',
  split: 'train',
  scenarios: ['invoice'],
  template: 'fill-form/document',
  design: {
    formTitle: null,
    dateIcon: {
      cls: 'ff-calendar',
      host: 'box',
      early: true,
      tag: 'button',
      title: 'Enter date',
      boxCls: 'ff-date',
      focus: true,
      svg: '<svg viewBox="0 0 24 26"><rect x="3" y="5" width="18" height="18" rx="1" fill="white" stroke="#346da9"/><path d="M3 10h18M7 3v5M17 3v5M6 13h12M6 17h12M6 20h12M9 11v11M14 11v11" fill="none" stroke="#346da9" stroke-width="1.2"/></svg>',
    },
    parts: {
      panes: (base, S) => (ctx, R) => {
        const { util } = ctx;
        const tools = util.el('div', 'ff-doctools', R.docPane);
        ['Zoom In', 'Zoom Out', 'Fit Width'].forEach((label, i) => {
          const button = util.el('button', '', tools);
          button.type = 'button';
          button.innerHTML = '<svg viewBox="0 0 32 32"><circle cx="13" cy="12" r="9" fill="#f8fafc" stroke="#657187" stroke-width="2"/><path d="M20 19l9 10M8 12h10' + (i === 0 ? 'M13 7v10' : '') + '" fill="none" stroke="#657187" stroke-width="2"/></svg>';
          util.el('span', '', button, label);
        });
        const pages = util.el('div', 'ff-pages', tools);
        util.el('button', '', pages, '◀');
        util.el('span', '', pages, '1 / 1');
        util.el('button', '', pages, '▶');
      },
      showList: () => (dd, btn, list, open) => {
        dd.classList.toggle('open', open);
        if (!open) return;
        dd.classList.remove('up');
        const r = btn.getBoundingClientRect();
        const h = list.offsetHeight;
        const surface = dd.closest('.ds-stage');
        const bounds = surface ? surface.getBoundingClientRect() : { top: 0, bottom: window.innerHeight };
        if (r.bottom + 4 + h > bounds.bottom - 6 && r.top - 4 - h > bounds.top + 6) dd.classList.add('up');
      },
      arranged: () => () => {},
      fieldWrap: () => () => {},
      label: () => (f, lab) => {
        if (f.label.length > 23) lab.classList.add('ff-longlabel');
      },
      finished: () => (ctx, R) => {
        const paper = R.docPane.querySelector('.ff-invoice');
        if (paper) {
          const head = paper.querySelector('.ff-invhead');
          const overflow = paper.scrollHeight - paper.clientHeight;
          if (overflow > 0) head.style.minHeight = Math.max(72, head.offsetHeight - overflow - 12) + 'px';
        }
      },
      renderInvoice: () => (util, pane, d, rng) => {
        if (d.style === 'receipt') {
          const inv = util.el('div', 'ff-invoice ff-paper ff-receipt-sheet', pane);
          const head = util.el('div', 'ff-invhead', inv);
          const left = util.el('div', '', head);
          util.el('div', 'ff-vname', left, d.vendor.name);
          util.el('div', 'ff-vaddr', left, `${d.vendor.addr.join('\n')}\nTel. ${d.vendor.phone}`);
          const right = util.el('div', '', head);
          util.el('div', 'ff-invtitle', right, 'INVOICE');
          const meta = util.el('table', 'ff-meta', right);
          for (const m of d.meta) {
            const tr = util.el('tr', '', meta);
            util.el('td', '', tr, m.label);
            util.el('td', '', tr, m.value);
          }
          const table = util.el('table', 'ff-items', inv);
          const hr = util.el('tr', '', table);
          ['Description', 'Qty', 'Unit Price', 'Amount'].forEach((c, i) => util.el('th', i ? 'num' : '', hr, c));
          for (const it of d.items) {
            const tr = util.el('tr', '', table);
            util.el('td', '', tr, it.desc);
            util.el('td', 'num', tr, String(it.qty));
            util.el('td', 'num', tr, it.unit);
            util.el('td', 'num', tr, it.amount);
          }
          const totals = util.el('table', 'ff-totals', inv);
          for (const t of d.totals) {
            const tr = util.el('tr', t.strong ? 'strong' : '', totals);
            util.el('td', '', tr, t.label);
            util.el('td', '', tr, t.value);
          }
          if (d.payLine) {
            util.el('div', 'ff-notes', inv, `${d.payLine.label}: ${d.payLine.value}${d.payLine.change ? ' / CHANGE: ' + d.payLine.change : ''}`);
          }
          if (d.currencyNote) util.el('div', 'ff-notes', inv, d.currencyNote);
          for (const n of d.notes) util.el('div', 'ff-notes', inv, n);
          return inv;
        }
        const inv = util.el('div', 'ff-invoice ff-paper', pane);
        inv.style.fontFamily = rng.pick([
          '"Liberation Sans", Arial, Helvetica, sans-serif',
          'Georgia, "Liberation Serif", "Times New Roman", serif',
          '"DejaVu Sans", Verdana, sans-serif',
          'system-ui, sans-serif',
        ]);
        const head = util.el('div', 'ff-invhead', inv);
        const left = util.el('div', '', head);
        util.el('div', 'ff-vname', left, d.vendor.name);
        util.el('div', 'ff-vaddr', left, `${d.vendor.addr.join('\n')}\nTel. ${d.vendor.phone}`);
        const right = util.el('div', '', head);
        util.el('div', 'ff-invtitle', right, d.title);
        const meta = util.el('table', 'ff-meta', right);
        for (const m of d.meta) {
          const tr = util.el('tr', '', meta);
          util.el('td', '', tr, m.label);
          util.el('td', '', tr, m.value);
        }
        if (d.billTo) {
          const b = util.el('div', 'ff-billto', inv);
          util.el('div', 'ff-doclabel', b, 'Bill to');
          util.el('b', '', b, d.billTo.name);
          util.el('div', '', b, d.billTo.addr.join('\n'));
        }
        const table = util.el('table', 'ff-items', inv);
        const hr = util.el('tr', '', table);
        d.cols.forEach((c, i) => { util.el('th', i ? 'num' : '', hr, c); });
        for (const it of d.items) {
          const tr = util.el('tr', '', table);
          util.el('td', '', tr, it.desc);
          util.el('td', 'num', tr, String(it.qty));
          util.el('td', 'num', tr, it.unit);
          util.el('td', 'num', tr, it.amount);
        }
        const tot = util.el('table', 'ff-totals', inv);
        for (const t of d.totals) {
          const tr = util.el('tr', t.strong ? 'strong' : '', tot);
          util.el('td', '', tr, t.label);
          util.el('td', '', tr, t.value);
        }
        if (d.currencyNote) util.el('div', 'ff-notes', inv, d.currencyNote);
        for (const n of d.notes) util.el('div', 'ff-notes', inv, n);
        if (d.stamp) util.el('div', 'ff-stamp', inv, d.stamp);
        return inv;
      },
    },
  },
});
