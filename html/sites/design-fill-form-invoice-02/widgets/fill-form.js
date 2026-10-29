// Invoice-02 keeps its framed dropdown, inline date button and original invoice details.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-invoice-02',
  name: 'design',
  split: 'train',
  scenarios: ['invoice'],
  template: 'fill-form/document',
  design: {
    formTitle: null,
    dateIcon: {
      cls: 'ff-calendar',
      boxCls: 'ff-datewrap',
      host: 'box',
      early: true,
      tag: 'button',
      title: 'Enter date',
      focus: true,
      svg: '<svg viewBox="0 0 28 28"><path d="M3 6h22v19H3zM3 11h22M8 3v7M20 3v7M9 12v12M15 12v12M21 12v12M4 17h20M4 21h20" fill="none" stroke="black" stroke-width="2"/></svg>',
    },
    parts: {
      arranged: () => () => {},
      fieldWrap: () => () => {},
      grid: (base) => (grid, form, pane, spec) => {
        base(grid, form, pane, spec);
        form.classList.toggle('ff-dense', spec.fields.length > 5);
      },
      labelText: (base) => (f) => f.label + (f.label.endsWith(':') ? '' : ':'),
      placeholder: () => () => '',
      showList: (base, S) => (dd, btn, list, open) => {
        dd.classList.toggle('open', open);
        if (!open) return;
        dd.classList.remove('up');
        const r = btn.getBoundingClientRect();
        const h = list.offsetHeight;
        const stage = S.st.root.getBoundingClientRect();
        if (r.bottom + 4 + h > Math.min(window.innerHeight - 6, stage.bottom - 6) && r.top - 4 - h > stage.top) {
          dd.classList.add('up');
        }
      },
      isReceipt: () => (d) => d.style === 'receipt' && d.kind !== 'invoice',
      sheetTitle: (base) => (d) => d.title || 'INVOICE',
      sheetCols: (base) => (d) => d.cols || ['Description', 'Qty', 'Unit Price', 'Amount'],
      sheetFont: (base) => (invoice, rng, d) => {
        if (d.style !== 'receipt') base(invoice, rng, d);
      },
      sheetEnd: () => (util, inv, tot, d) => {
        if (d.currencyNote) util.el('div', 'ff-notes', inv, d.currencyNote);
        if (d.payLine) {
          util.el('div', 'ff-notes', inv, `${d.payLine.label}: ${d.payLine.value}`);
          if (d.payLine.change) util.el('div', 'ff-notes', inv, `CHANGE: ${d.payLine.change}`);
        }
        for (const n of d.notes) util.el('div', 'ff-notes', inv, n);
        if (d.stamp) util.el('div', 'ff-stamp', inv, d.stamp);
      },
      finished: (base, S) => (ctx, R) => {
        const { root, docPane, formPane } = R;
        const L = ctx.spec.layout;
        const invoice = docPane.querySelector('.ff-invoice');
        if (invoice) {
          invoice.style.minHeight = '0';
          const sourceHeight = L.tabs
            ? root.getBoundingClientRect().bottom - docPane.getBoundingClientRect().top - 8
            : docPane.clientHeight;
          let paperSize = parseFloat(getComputedStyle(invoice).fontSize);
          while (invoice.scrollHeight > sourceHeight && paperSize > 11) {
            paperSize -= 0.5;
            invoice.style.fontSize = paperSize + 'px';
          }
          if (!L.tabs) invoice.style.minHeight = '100%';
        }

        const form = formPane.querySelector('.ff-form');
        const footer = ctx.stage.closest('.ds-content').querySelector('.ds-footer');
        const limit = Math.min(root.getBoundingClientRect().bottom - 8, footer.getBoundingClientRect().top - 8);
        if (form.getBoundingClientRect().bottom > limit && !L.tabs) {
          const note = ctx.stage.parentElement.querySelector('.ds-brief');
          const top = root.getBoundingClientRect().top;
          const gap = parseFloat(getComputedStyle(root).fontSize) * 0.7;
          const safeTop = note ? note.getBoundingClientRect().bottom + gap : top + gap;
          const current = formPane.getBoundingClientRect().top;
          const margin = parseFloat(getComputedStyle(formPane).marginTop);
          formPane.style.marginTop = Math.max(0, margin - Math.max(0, current - safeTop)) + 'px';
        }
        if (!L.tabs) {
          const note = ctx.stage.parentElement.querySelector('.ds-brief');
          if (note) {
            const nr = note.getBoundingClientRect();
            const fr = formPane.getBoundingClientRect();
            const gap = parseFloat(getComputedStyle(root).fontSize) * 0.7;
            if (fr.left < nr.right && fr.right > nr.left && fr.top < nr.bottom + gap) {
              formPane.style.marginTop = parseFloat(getComputedStyle(formPane).marginTop) + nr.bottom + gap - fr.top + 'px';
            }
          }
        }
        let formSize = parseFloat(getComputedStyle(form).fontSize);
        while (form.getBoundingClientRect().bottom > limit && formSize > 10) {
          formSize -= 0.5;
          form.style.fontSize = formSize + 'px';
        }
        if (!L.tabs) {
          const util = ctx.util;
          const rail = util.el('div', 'ff-scrollrail', root);
          const up = util.el('button', 'ff-scrollarrow', rail, '▲');
          const track = util.el('div', 'ff-scrolltrack', rail);
          const thumb = util.el('div', 'ff-scrollthumb', track);
          const down = util.el('button', 'ff-scrollarrow', rail, '▼');
          up.type = down.type = 'button';
          up.setAttribute('aria-label', 'Scroll document up');
          down.setAttribute('aria-label', 'Scroll document down');
          up.addEventListener('click', () => { docPane.scrollTop -= docPane.clientHeight / 3; });
          down.addEventListener('click', () => { docPane.scrollTop += docPane.clientHeight / 3; });
          docPane.addEventListener('scroll', () => {
            const range = docPane.scrollHeight - docPane.clientHeight;
            thumb.style.top = (range > 0 ? docPane.scrollTop / range * (track.clientHeight - thumb.offsetHeight) : 0) + 'px';
          });
          track.addEventListener('pointerdown', (event) => {
            const bounds = track.getBoundingClientRect();
            const scrollTo = (e) => {
              docPane.scrollTop = Math.max(0, (e.clientY - bounds.top) / bounds.height) * (docPane.scrollHeight - docPane.clientHeight);
            };
            scrollTo(event);
            track.setPointerCapture(event.pointerId);
            const move = (e) => scrollTo(e);
            const stop = () => {
              track.removeEventListener('pointermove', move);
              track.removeEventListener('pointerup', stop);
            };
            track.addEventListener('pointermove', move);
            track.addEventListener('pointerup', stop);
          });
        }
      },
    },
  },
});
