// Atlas letterhead, calendar, and stage fitting on the shared document template.
(function () {
  'use strict';

  function letterhead(util, paper, d) {
    paper.replaceChildren();
    paper.className = 'ff-invoice ff-paper atlas-invoice';
    paper.classList.toggle('atlas-busy', !!d.payLine || d.items.length > 4);
    const head = util.el('div', 'atlas-letterhead', paper);
    const brand = util.el('div', 'atlas-vendor', head);
    const logo = util.el('div', 'atlas-mountains', brand);
    logo.innerHTML = '<svg viewBox="0 0 270 78"><path fill="#414c80" d="M0 71l29-16 13-20 13 19 22-9 43-36 15-9 31 39 17 9 19-7 20 21 17-14 14 21 17 5H0z"/><path fill="#fff" d="M135 0l-10 30 12-12 17 29-10-30 25 30-19-31zM42 35l-8 25 13-14 10 13-5-16zM95 43l25-34-13 31-17 13zM222 48l-8 18 12-9 15 13z"/></svg>';
    util.el('div', 'atlas-vname', brand, d.vendor.name);
    util.el('div', 'atlas-tagline', brand, 'Global Shipping Solutions');
    util.el('div', 'atlas-address', head, `${d.vendor.addr.join('\n')}\nPhone: ${d.vendor.phone}`);
    const info = util.el('div', 'atlas-info', paper);
    util.el('h2', '', info, d.title || 'INVOICE');
    const meta = util.el('div', 'atlas-meta', info);
    for (const m of d.meta) util.el('div', '', meta, `${m.label}:  ${m.value}`);
    if (d.billTo) {
      const bill = util.el('div', 'atlas-bill', paper);
      util.el('b', '', bill, 'Bill To:');
      util.el('div', '', bill, `${d.billTo.name}\n${d.billTo.addr.join('\n')}`);
    }
    const table = util.el('table', 'atlas-items', paper);
    const hr = util.el('tr', '', table);
    ['Description', 'Qty', 'Unit Price', 'Amount'].forEach((t) => util.el('th', '', hr, t));
    for (const it of d.items) {
      const tr = util.el('tr', '', table);
      [it.desc, String(it.qty), it.unit, it.amount].forEach((t) => util.el('td', '', tr, t));
    }
    const tot = util.el('table', 'atlas-totals', paper);
    for (const t of d.totals) {
      const tr = util.el('tr', t.strong ? 'strong' : '', tot);
      util.el('td', '', tr, t.label);
      util.el('td', '', tr, t.value);
    }
    if (d.payLine) {
      util.el('div', 'atlas-payment', paper, `${d.payLine.label}: ${d.payLine.value}${d.payLine.change ? '\nCHANGE: ' + d.payLine.change : ''}`);
    }
    const notes = util.el('div', 'atlas-notes', paper);
    if (d.currencyNote) util.el('div', '', notes, d.currencyNote);
    for (const n of d.notes) util.el('div', '', notes, n);
    if (d.stamp) util.el('div', 'ff-stamp', paper, d.stamp);
    return paper;
  }

  env.widget({
    task: 'fill-form',
    site: 'design-fill-form-invoice-03',
    name: 'design',
    split: 'train',
    scenarios: ['invoice'],
    template: 'fill-form/document',
    design: {
      dateIcon: {
        cls: 'ff-calendar',
        host: 'box',
        svg: '<svg viewBox="0 0 32 32"><rect x="4" y="7" width="24" height="22" rx="2"/><path d="M4 13h24M10 3v9M22 3v9M9 18h3m4 0h3m4 0h2M9 23h3m4 0h3m4 0h2"/></svg>',
      },
      parts: {
        formStart: () => (form, pane, spec) => form.classList.toggle('ff-dense', spec.fields.length > 6),
        fieldWrap: () => () => {},
        arranged: () => () => {},
        finished: () => () => {},
        fieldDone: (base) => (f, x, wrap) => {
          base(f, x, wrap);
          if (f.kind === 'date' && f.placeholder) {
            const guide = document.querySelector('.ds-guide li:nth-child(3)');
            if (guide) guide.textContent = `Enter the date in ${f.placeholder} format.`;
          }
        },
        receipt: (base) => (util, pane, d) => letterhead(util, base(util, pane, d), d),
        sheetEnd: () => (util, inv, tot, d) => letterhead(util, inv, d),
        fit: (base) => (ctx, R) => {
          base(ctx, R);
          const L = ctx.spec.layout;
          if (!L.long && !L.image) {
            const { root, docPane, formPane } = R;
            const sr = ctx.stage.getBoundingClientRect();
            const scs = getComputedStyle(ctx.stage);
            const limit = sr.bottom - parseFloat(scs.paddingBottom) - parseFloat(scs.borderBottomWidth) - 2;
            const formEl = formPane.querySelector('.ff-form') || formPane;
            const docBottom = () => {
              let b = 0;
              for (const e of docPane.querySelectorAll('*')) {
                const r = e.getBoundingClientRect();
                if (r.height) b = Math.max(b, r.bottom);
              }
              return b;
            };
            const tooTall = () => formEl.getBoundingClientRect().bottom > limit ||
              docPane.scrollHeight > docPane.clientHeight + 1 || docBottom() > limit;
            for (let fit = 1; fit > 0.5;) {
              root.style.setProperty('--ffit', String(fit));
              if (!tooTall()) break;
              fit = Math.round((fit - 0.02) * 100) / 100;
            }
          }
        },
      },
    },
  });
})();
