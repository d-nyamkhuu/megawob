// The human invoice sheet, calendar control, and source fitting used by this invoice design.
(function () {
  'use strict';

  function addHumanSheet(util, pane, d) {
    const sheet = util.el('div', 'human-sheet', pane);
    const header = util.el('div', 'human-invhead', sheet);
    const vendor = util.el('div', '', header);
    util.el('div', 'human-vendor', vendor, d.vendor.name);
    util.el('div', 'human-address', vendor, d.vendor.addr.join('\n'));
    util.el('div', 'human-phone', vendor, `Tel. ${d.vendor.phone}`);
    const metadata = util.el('div', 'human-metadata', header);
    util.el('div', 'human-title', metadata, d.style === 'receipt' ? 'RECEIPT' : d.title);
    const meta = util.el('table', '', metadata);
    for (const m of d.meta) {
      const tr = util.el('tr', '', meta);
      util.el('td', '', tr, m.label);
      util.el('td', '', tr, m.value);
    }
    if (d.billTo) {
      const bill = util.el('div', 'human-bill', sheet);
      util.el('b', '', bill, 'Bill to: ' + d.billTo.name);
      util.el('div', '', bill, d.billTo.addr.join('\n'));
    }
    const table = util.el('table', 'human-items', sheet);
    const hr = util.el('tr', '', table);
    (d.cols || ['Description', 'Qty', 'Unit Price', 'Amount']).forEach((c) => util.el('th', '', hr, c));
    for (const item of d.items) {
      const tr = util.el('tr', '', table);
      [item.desc, String(item.qty), item.unit, item.amount].forEach((v) => util.el('td', '', tr, v));
    }
    const totals = util.el('table', 'human-totals', sheet);
    for (const t of d.totals) {
      const tr = util.el('tr', t.strong ? 'strong' : '', totals);
      util.el('td', '', tr, t.label);
      util.el('td', '', tr, t.value);
    }
    const notes = util.el('div', 'human-notes', sheet);
    if (d.payLine) util.el('div', '', notes, `${d.payLine.label} ${d.payLine.value}${d.payLine.change ? '  CHANGE ' + d.payLine.change : ''}`);
    if (d.currencyNote) util.el('div', '', notes, d.currencyNote);
    for (const n of d.notes) util.el('div', '', notes, n);
    if (d.stamp) util.el('div', 'human-stamp', sheet, d.stamp);
    return sheet;
  }

  env.widget({
    task: 'fill-form',
    site: 'design-fill-form-invoice-04',
    name: 'design',
    split: 'train',
    scenarios: ['invoice'],
    template: 'fill-form/document',
    design: {
      dateIcon: null,
      parts: {
        fieldWrap: () => () => {},
        rootReady: (base) => (ctx, R) => {
          base(ctx, R);
          ctx.stage.parentElement.classList.toggle('human-tabs', !!ctx.spec.layout.tabs);
          R.root.style.setProperty('--human-fields', ctx.spec.fields.length);
          R.root.style.setProperty('--human-doc-size', `${Math.min(20, Math.max(11, (R.box.height - 100) / 25))}px`);
        },
        renderDoc: (base, S) => (util, pane, d, rng) => {
          base(util, pane, d, rng);
          for (const child of [...pane.children]) child.hidden = true;
          addHumanSheet(util, pane, d);
        },
        imageDrawn: (base, S) => (cv, pane, d) => {
          cv.hidden = true;
          addHumanSheet(S.ctx.util, pane, d);
        },
        arranged: (base, S) => (ctx, R) => {
          const { spec, util } = ctx;
          for (const f of spec.fields) {
            const input = S.el[f.id].input;
            if (input) input.placeholder = '';
            if (f.kind === 'date' && input) {
              const calendar = util.el('button', 'human-calendar', input.parentElement);
              calendar.type = 'button';
              calendar.title = 'Enter date';
              calendar.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#444" stroke-width="1.6"><path d="M3 5h18v17H3zM3 10h18M7 2v6m10-6v6"/><path d="M7 13h2m3 0h2m3 0h1M7 17h2m3 0h2m3 0h1" stroke-width="2"/></svg>';
              calendar.addEventListener('click', () => input.focus());
            }
          }
        },
        finished: (base) => (ctx, R) => {
          base(ctx, R);
          const sheet = R.docPane.querySelector('.human-sheet');
          if (!sheet) return;
          let sourceSize = parseFloat(R.root.style.getPropertyValue('--human-doc-size'));
          while (sheet.scrollHeight > sheet.clientHeight + 1 && sourceSize > 10) {
            sourceSize -= 0.5;
            R.root.style.setProperty('--human-doc-size', sourceSize + 'px');
          }
        },
      },
    },
  });
})();
