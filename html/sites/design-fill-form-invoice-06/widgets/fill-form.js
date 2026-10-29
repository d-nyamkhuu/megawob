// Invoice reference paper, stage-aware dropdowns, and dense-form fitting for this design.
(function () {
  'use strict';

  function renderReferenceInvoice(util, pane, d) {
    const paper = util.el('div', 'reference-paper', pane);
    const vendor = util.el('div', 'reference-vendor', paper);
    util.el('b', '', vendor, d.vendor.name);
    util.el('div', '', vendor, d.vendor.addr.join('\n'));
    util.el('div', '', vendor, `Tel ${d.vendor.phone}`);
    const heading = util.el('div', 'reference-heading', paper);
    util.el('h2', '', heading, d.title || 'Invoice');
    const meta = util.el('table', '', heading);
    for (const m of d.meta) {
      const row = util.el('tr', '', meta);
      util.el('td', '', row, m.label);
      util.el('td', '', row, m.value);
    }
    if (d.billTo) {
      const bill = util.el('div', 'reference-billto', paper);
      util.el('b', '', bill, d.billTo.name);
      util.el('div', '', bill, d.billTo.addr.join('\n'));
    }
    const items = util.el('table', 'reference-items', paper);
    const header = util.el('tr', '', items);
    (d.cols || ['Description', 'Qty', 'Unit Price', 'Amount']).forEach((col) => util.el('th', '', header, col));
    for (const item of d.items) {
      const row = util.el('tr', '', items);
      [item.desc, String(item.qty), item.unit, item.amount].forEach((cell) => util.el('td', '', row, cell));
    }
    const totals = util.el('table', 'reference-totals', paper);
    for (const total of d.totals) {
      const row = util.el('tr', total.strong ? 'strong' : '', totals);
      util.el('td', '', row, total.label);
      util.el('td', '', row, total.value);
    }
    if (d.payLine) {
      const row = util.el('tr', '', totals);
      util.el('td', '', row, d.payLine.label);
      util.el('td', '', row, d.payLine.value);
      if (d.payLine.change) {
        const change = util.el('tr', '', totals);
        util.el('td', '', change, 'CHANGE');
        util.el('td', '', change, d.payLine.change);
      }
    }
    const notes = util.el('div', 'reference-notes', paper);
    if (d.currencyNote) util.el('div', '', notes, d.currencyNote);
    for (const note of d.notes) util.el('div', '', notes, note);
    if (d.stamp) util.el('div', 'ff-stamp', paper, d.stamp);
  }

  function appendReferenceView(util, pane, d) {
    for (const child of [...pane.children]) child.style.display = 'none';
    const tools = util.el('div', 'reference-tools', pane);
    util.el('b', '', tools, 'Receipt');
    const icons = util.el('div', '', tools);
    ['minus', 'plus', 'expand'].forEach((kind) => {
      const button = util.el('button', '', icons);
      button.type = 'button';
      button.setAttribute('aria-label', kind === 'expand' ? 'Fit receipt' : `Zoom ${kind === 'plus' ? 'in' : 'out'}`);
      button.innerHTML = kind === 'expand'
        ? '<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7"/></svg>'
        : '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="7"/><path d="m15 15 6 6M6 10h8' + (kind === 'plus' ? 'M10 6v8' : '') + '"/></svg>';
    });
    renderReferenceInvoice(util, pane, d);
  }

  env.widget({
    task: 'fill-form',
    site: 'design-fill-form-invoice-06',
    name: 'design',
    split: 'train',
    scenarios: ['invoice'],
    template: 'fill-form/document',
    design: {
      dateIcon: {
        cls: 'ff-calendar',
        host: 'box',
        svg: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 9h18M7 2v6M17 2v6"/></svg>',
      },
      parts: {
        rootReady: (base) => (ctx, R) => {
          R.root.classList.remove('doc-right', 'long');
        },
        listLimit: (base, S) => (r) => {
          const stage = S.ctx.stage.getBoundingClientRect();
          return Math.min(stage.bottom, window.innerHeight) - 6;
        },
        showList: (base, S) => (dd, btn, list, open) => {
          dd.classList.toggle('open', open);
          if (!open) return;
          dd.classList.remove('up');
          const r = btn.getBoundingClientRect();
          const h = list.offsetHeight;
          const stage = S.ctx.stage.getBoundingClientRect();
          if (
            r.bottom + 4 + h > Math.min(stage.bottom, window.innerHeight) - 6 &&
            r.top - 4 - h > Math.max(stage.top, 0) + 6
          ) dd.classList.add('up');
        },
        formStart: (base) => (form, pane, spec) => {
          pane.style.setProperty('--field-count', spec.fields.length);
          pane.classList.toggle('ff-crowded', spec.fields.length > 6);
        },
        arranged: () => () => {},
        fieldDone: (base, S) => (f, x, wrap) => {
          if (/\bPO\b|purchase order/i.test(f.label)) {
            S.ctx.util.el('div', 'ff-helper', wrap, 'Leave blank if not present on the receipt.');
          }
        },
        renderInvoice: (base) => (util, pane, d, rng) => {
          base(util, pane, d, rng);
          appendReferenceView(util, pane, d);
        },
        imageDrawn: (base, S) => (cv, pane, d) => {
          if (d.kind === 'invoice') appendReferenceView(S.ctx.util, pane, d);
        },
        finished: (base) => (ctx, R) => {
          const { formPane, docPane } = R;
          const form = formPane.querySelector('.ff-form');
          const grid = form.querySelector('.ff-grid');
          const labels = [...form.querySelectorAll('.ff-label')];
          const controls = [...form.querySelectorAll('.ff-input,.ff-ddbtn')];
          const heading = form.querySelector('h2');
          const paneStyle = getComputedStyle(formPane);
          const formHeight = formPane.clientHeight - parseFloat(paneStyle.paddingTop) - parseFloat(paneStyle.paddingBottom);
          const initialGap = parseFloat(getComputedStyle(grid).rowGap);
          const initialHeadingGap = parseFloat(getComputedStyle(heading).marginBottom);
          const labelSizes = labels.map((el) => parseFloat(getComputedStyle(el).fontSize));
          const controlSizes = controls.map((el) => ({
            height: el.getBoundingClientRect().height,
            font: parseFloat(getComputedStyle(el).fontSize),
          }));
          for (let scale = 0.95; form.getBoundingClientRect().height > formHeight + 1 && scale >= 0.45; scale -= 0.05) {
            grid.style.setProperty('gap', Math.max(3, initialGap * scale) + 'px', 'important');
            heading.style.setProperty('margin-bottom', Math.max(5, initialHeadingGap * scale) + 'px', 'important');
            labels.forEach((el, i) => {
              el.style.setProperty('font-size', Math.max(11, labelSizes[i] * scale) + 'px', 'important');
              el.style.setProperty('margin-bottom', Math.max(2, 6 * scale) + 'px', 'important');
            });
            controls.forEach((el, i) => {
              el.style.setProperty('height', Math.max(24, controlSizes[i].height * scale) + 'px', 'important');
              el.style.setProperty('font-size', Math.max(11, controlSizes[i].font * scale) + 'px', 'important');
            });
          }
          const paper = docPane.querySelector('.reference-paper');
          if (paper) {
            let paperSize = parseFloat(getComputedStyle(paper).fontSize);
            while (paper.scrollHeight > paper.clientHeight + 1 && paperSize > 9) {
              paperSize -= 0.5;
              paper.style.fontSize = paperSize + 'px';
            }
          }
        },
      },
    },
  });
})();
