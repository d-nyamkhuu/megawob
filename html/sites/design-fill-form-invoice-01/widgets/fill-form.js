// Design of this site on the fill-form/document template (templates/fill-form/document.js): every document
// (receipts included) is an invoice sheet with its payment lines in the totals and a notes footer; required
// stars and date icons on the form; the page footer moves into the form with a Clear button; the page keeps
// both panes visible (no tab switching); the sheet's font is fitted to its box.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-invoice-01',
  name: 'design',
  split: 'train',
  scenarios: ['invoice'],
  template: 'fill-form/document',
  design: {
    layout: 'compact',
    formTitle: 'Enter Invoice Information',
    tabsGrid: null,
    listAvoidSubmit: true,
    dateIcon: {
      cls: 'ff-date-icon',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="17" rx="2"/><path d="M3 10h18M7 2v6M17 2v6"/></svg>',
    },
    parts: {
      // This design supplies its own date wrapper, footer placement and document fit.
      fieldWrap: () => () => {},
      arranged: () => () => {},
      finished: () => () => {},
      formStart: () => (form, pane, spec) => { pane.classList.toggle('ff-dense', spec.fields.length > 6); },
      label: (base, S) => (f, lab) => {
        if (f.gold !== '' && f.gold !== false) S.ctx.util.el('span', 'ff-required', lab, '*');
      },
      isReceipt: () => () => false,
      sheetFont: () => () => {},
      sheetTitle: () => (d) => d.title || 'INVOICE',
      sheetCols: () => (d) => d.cols || ['Description', 'Qty', 'Unit Price', 'Amount'],
      sheetEnd: () => (util, inv, tot, d) => {
        if (d.payLine) {
          const tr = util.el('tr', '', tot);
          util.el('td', '', tr, d.payLine.label);
          util.el('td', '', tr, d.payLine.value);
          if (d.payLine.change) {
            const change = util.el('tr', '', tot);
            util.el('td', '', change, 'CHANGE');
            util.el('td', '', change, d.payLine.change);
          }
        }
        const footer = util.el('div', 'ff-docfoot', inv);
        const notes = util.el('div', 'ff-docnotes', footer);
        if (d.currencyNote) util.el('div', 'ff-notes', notes, d.currencyNote);
        for (const n of d.notes) util.el('div', 'ff-notes', notes, n);
        const firstNote = footer.querySelector('.ff-notes');
        if (firstNote) firstNote.classList.add('ff-notes-first');
        if (d.stamp) {
          inv.classList.add('ff-has-stamp');
          util.el('div', 'ff-stamp', footer, d.stamp);
        }
      },
      showTab: () => () => {},
      // Both documents and controls remain visible; tabs retain the task navigation state.
      fit: (base, S) => (ctx, R) => {
        const { spec, size } = ctx;
        const baseFont = Math.min(21, size.width / 73.6, size.height / 36.8);
        R.root.style.fontSize = baseFont + 'px';
        const actions = document.querySelector('.ds-footer');
        if (actions) {
          R.formPane.append(actions);
          actions.querySelector('.ds-invoice-clear').addEventListener('click', () => {
            const el = S.el;
            const fields = Object.fromEntries(spec.fields.map((f) => [f.id, f.kind === 'checkbox' ? false : '']));
            ctx.update({ ...ctx.model, fields, open: null });
            for (const x of Object.values(el)) {
              if (x.input) { x.input.value = ''; x.input.parentNode.classList.remove('filled'); }
              if (x.dd) { x.w.set({ value: null, open: false }); x.show(''); }
              else if (x.w) x.w.set(spec.fields.find((f) => el[f.id] === x).kind === 'checkbox' ? [] : null);
            }
          });
        }
        const paper = R.docPane.querySelector('.ff-invoice');
        if (paper) {
          for (let font = baseFont; font >= baseFont * .65; font -= .25) {
            paper.style.fontSize = font + 'px';
            if (paper.scrollHeight <= paper.clientHeight + 1 && paper.scrollWidth <= paper.clientWidth + 1) break;
          }
        }
      },
      syncField: (base, S) => (id, x, m) => {
        if (x.input) {
          x.input.value = m.fields[id] ?? '';
          x.input.parentNode.classList.toggle('filled', x.input.value.length > 0);
        }
        if (x.dd) { x.w.set({ value: m.fields[id] || null, open: m.open === id }); x.show(m.fields[id]); }
        else if (x.w) x.w.set(S.spec.fields.find((f) => f.id === id).kind === 'checkbox' ? (m.fields[id] ? [id] : []) : m.fields[id] || null);
      },
    },
  },
});
