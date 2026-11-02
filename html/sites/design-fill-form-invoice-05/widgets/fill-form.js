// Design of this site on the fill-form/document template (templates/fill-form/document.js): the reference
// page layout (standard) with a letterhead invoice (logo, tagline), required stars and short captions on the
// form, date and currency decorations, action buttons and notes moved into the page, and invoice images
// repainted as the same letterhead.
(function () {
  'use strict';

  function paintInvoiceImage(cv, pane, d, dpr) {
    const width = pane.clientWidth, height = pane.clientHeight;
    const scale = width / 1089;
    cv.width = Math.round(width * dpr);
    cv.height = Math.round(height * dpr);
    cv.style.width = width + 'px';
    cv.style.height = height + 'px';
    const c = cv.getContext('2d');
    c.scale(dpr * scale, dpr * scale);
    const H = height / scale;
    c.fillStyle = '#fff';
    c.fillRect(0, 0, 1089, H);
    c.textBaseline = 'top';
    const text = (value, x, y, size = 22, bold = false, align = 'left', max = undefined) => {
      c.font = `${bold ? '700' : '400'} ${size}px Arial, Helvetica, sans-serif`;
      c.fillStyle = '#151922'; c.textAlign = align;
      if (max) c.fillText(String(value), x, y, max);
      else c.fillText(String(value), x, y);
    };
    c.save();c.translate(68, 53);c.scale(.97, .97);
    c.fillStyle = '#3e505b';c.beginPath();
    [[2,68],[36,24],[49,42],[68,1],[79,24],[73,39],[36,68]].forEach(([x,y],i)=>i ? c.lineTo(x,y) : c.moveTo(x,y));
    c.closePath();c.fill();c.fillStyle = '#2c6898';c.beginPath();c.moveTo(46,68);c.lineTo(86,21);c.lineTo(122,68);c.closePath();c.fill();c.restore();
    text(d.vendor.name, 198, 66, 36, true, 'left', 480);
    text('Global Shipping Solutions', 198, 105, 18);
    [d.vendor.name, ...d.vendor.addr, `Tel. ${d.vendor.phone}`].forEach((line,i)=>text(line, 70, 151+i*26));
    text('INVOICE', 1017, 80, 47, true, 'right');
    d.meta.forEach((m,i)=>{
      text(m.label, 735, 158+i*30, 21, false, 'left', 120);
      text(m.value, 860, 158+i*30, 21, false, 'left', 175);
    });
    if (d.billTo) {
      text('Bill To:', 70, 294, 22, true);
      [d.billTo.name, ...d.billTo.addr].forEach((line,i)=>text(line,70,320+i*26));
    }
    const payRows = d.payLine ? 1 + (d.payLine.change ? 1 : 0) : 0;
    const extra = Math.max(0, d.items.length - 3 + d.totals.length - 3 + payRows);
    const noteLines = [d.currencyNote, ...d.notes].filter(Boolean);
    let y = 455 - extra*40 - Math.max(0, noteLines.length - 1)*25;
    const edges = [55, 535, 685, 847, 1035];
    const cell = (x, yy, w, h, shaded = false) => {
      if (shaded) {
        const g = c.createLinearGradient(0,yy,0,yy+h);g.addColorStop(0,'#e5e8eb');g.addColorStop(1,'#d9dde2');
        c.fillStyle = g;c.fillRect(x,yy,w,h);
      }
      c.strokeStyle='#cbd2da';c.lineWidth=1;c.strokeRect(x,yy,w,h);
    };
    const headers = d.cols || ['Description','Quantity','Unit Price','Amount'];
    headers.forEach((label,i)=>{
      cell(edges[i],y,edges[i+1]-edges[i],41,true);
      text(label,i===0?edges[i]+20:i===1?(edges[i]+edges[i+1])/2:edges[i+1]-20,y+10,22,true,i===0?'left':i===1?'center':'right');
    });
    y += 41;
    d.items.forEach(it=>{
      const values=[it.desc,it.qty,it.unit,it.amount];
      values.forEach((value,i)=>{
        cell(edges[i],y,edges[i+1]-edges[i],41);
        text(value,i===0?edges[i]+20:i===1?(edges[i]+edges[i+1])/2:edges[i+1]-20,y+10,21,false,i===0?'left':i===1?'center':'right',edges[i+1]-edges[i]-30);
      });
      y+=41;
    });
    const totals = [...d.totals];
    if (d.payLine) {
      totals.push({label:d.payLine.label,value:d.payLine.value});
      if (d.payLine.change) totals.push({label:'CHANGE',value:d.payLine.change});
    }
    totals.forEach(t=>{
      cell(685,y,350,40,!!t.strong);
      text(t.label,720,y+10,21,!!t.strong,'left',150);
      text(t.value,1015,y+10,21,!!t.strong,'right',180);
      y+=40;
    });
    noteLines.forEach((line,i)=>text(line,60,H-75-(noteLines.length-1-i)*27,21,false,'left',970));
    if (d.stamp) {
      c.save();c.translate(870,355);c.rotate(-.24);c.strokeStyle='#c92a2a';c.lineWidth=3;c.strokeRect(-10,-8,140,48);
      c.font='700 28px Arial';c.textAlign='left';c.fillStyle='#c92a2a';c.fillText(d.stamp,0,0);c.restore();
    }
  }

  env.widget({
    task: 'fill-form',
    site: 'design-fill-form-invoice-05',
    name: 'design',
    split: 'train',
    scenarios: ['invoice'],
    template: 'fill-form/document',
    design: {
      formTitle: 'Enter Invoice Information',
      dateIcon: {
        cls: 'ff-dateicon',
        boxCls: 'ff-datewrap',
        svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 5h18v16H3zM3 10h18M7 2v6M17 2v6M7 13h2m3 0h2m3 0h2M7 17h2m3 0h2m3 0h2"/></svg>',
      },
      parts: {
        // This design supplies its own date wrapper and footer placement.
        fieldWrap: () => () => {},
        arranged: () => () => {},
        formStart: () => (form, pane, spec) => { form.classList.toggle('ff-dense', spec.fields.length > 6); },
        labelText: () => (f) => f.label.replace(/\s*\(numbers only\)/i, '').replace(/^Merchant name$/i, 'Vendor').replace(/^Purchase date$/i, 'Date').replace(/^Total$/i, 'Total amount'),
        label: (base, S) => (f, lab) => {
          lab.title = f.label;
          const sourceDate = f.kind === 'date' && S.spec.doc.meta.some(m => /date/i.test(m.label) && (/due/i.test(f.label) === /due/i.test(m.label)));
          if (sourceDate || /merchant|vendor|invoice|^total \(numbers/i.test(f.label)) S.ctx.util.el('span', 'ff-required', lab, ' *');
        },
        fieldDone: (base, S) => (f, x, wrap) => {
          const util = S.ctx.util;
          if (f.kind === 'text' || f.kind === 'date') {
            if (f.kind !== 'date') x.input.placeholder = '';
            if (/^total \(numbers/i.test(f.label)) {
              const total = S.spec.doc.totals.find(t => t.strong);
              const currency = total && total.value.match(/(?:[A-Z]{3}|[£€$¥])/);
              if (currency) {
                x.input.parentElement.classList.add('ff-moneywrap');
                util.el('span', 'ff-currency', x.input.parentElement, currency[0]);
              }
            }
          }
          if (/purchase order|po number/i.test(f.label)) util.el('div', 'ff-hint', wrap, 'Leave empty if not mentioned on the invoice.');
        },
        formEnd: (base, S) => (form, grid, pane, spec) => {
          const actions = document.querySelector('.ds-btns');
          if (actions) (spec.layout.tabs ? S.st.root : form).append(actions);
          const notes = document.querySelector('.ds-notes');
          if (notes && !spec.layout.tabs) pane.append(notes);
        },
        isReceipt: () => () => false,
        sheetFont: (base) => (inv, rng, d) => { if (d.style !== 'receipt') base(inv, rng, d); },
        sheetStart: () => (inv, d) => {
          inv.style.setProperty('--extra-rows', Math.max(0, d.items.length - 3 + d.totals.length - 3 + (d.payLine ? 1 + (d.payLine.change ? 1 : 0) : 0)));
        },
        sheetHeader: () => (util, inv, d) => {
          const head = util.el('div', 'ff-invhead', inv);
          const left = util.el('div', 'ff-vendor', head);
          const logo = util.el('div', 'ff-logo', left);
          logo.innerHTML = '<svg viewBox="0 0 120 72"><defs><linearGradient id="ff-mountain-ink" x2="1" y2="1"><stop stop-color="#53636d"/><stop offset="1" stop-color="#35444f"/></linearGradient><linearGradient id="ff-mountain-blue" x2="1" y2="1"><stop stop-color="#3979a7"/><stop offset="1" stop-color="#245c88"/></linearGradient></defs><path d="M2 68 36 24 49 42 68 1 79 24 73 39 36 68Z" fill="url(#ff-mountain-ink)"/><path d="M46 68 86 21 122 68Z" fill="url(#ff-mountain-blue)"/></svg>';
          util.el('div', 'ff-vname', left, d.vendor.name);
          util.el('div', 'ff-tagline', left, 'Global Shipping Solutions');
          util.el('div', 'ff-vaddr', left, `${d.vendor.name}\n${d.vendor.addr.join('\n')}\nTel. ${d.vendor.phone}`);
          const right = util.el('div', 'ff-invright', head);
          util.el('div', 'ff-invtitle', right, 'INVOICE');
          const meta = util.el('table', 'ff-meta', right);
          for (const m of d.meta) {
            const tr = util.el('tr', '', meta);
            util.el('td', '', tr, m.label);
            util.el('td', '', tr, m.value);
          }
        },
        sheetBillTo: () => (util, inv, d) => {
          if (d.billTo) {
            const b = util.el('div', 'ff-billto', inv);
            util.el('div', 'ff-doclabel', b, 'Bill To:');
            util.el('b', '', b, d.billTo.name);
            util.el('div', '', b, d.billTo.addr.join('\n'));
          }
        },
        sheetCols: () => (d) => d.cols || ['Description', 'Quantity', 'Unit Price', 'Amount'],
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
          if (d.currencyNote) util.el('div', 'ff-notes', inv, d.currencyNote);
          for (const n of d.notes) util.el('div', 'ff-notes', inv, n);
          if (d.stamp) util.el('div', 'ff-stamp', inv, d.stamp);
        },
        // Keep image episodes as images, using the same document design as the DOM episodes.
        // The original scan pass above preserves every seeded random draw.
        imageDrawn: () => (cv, pane, d, dpr) => {
          if (d.kind === 'invoice') paintInvoiceImage(cv, pane, d, dpr);
        },
        finished: () => (ctx, R) => {
          const { root, tabbar, formPane } = R;
          const L = ctx.spec.layout;
          // Selected tabs use bold text. Freeze the strip's outer box so changing tabs
          // cannot change the existing tabbar anchor's dimensions.
          if (tabbar) {
            const rect = tabbar.getBoundingClientRect();
            tabbar.style.width = rect.width + 'px';
            tabbar.style.height = rect.height + 'px';
          }

          // Fit the existing margin content to this episode's stage rather than the viewport.
          // Reserve room for a margin end link, and keep these dimensions fixed while fields change.
          const stageHeight = ctx.size.height;
          const form = formPane.querySelector('.ff-form');
          const notes = document.querySelector('.ds-notes');
          const marginEnd = document.querySelector('.ds-margin-end');
          const reserve = marginEnd ? marginEnd.offsetHeight + 8 : 0;
          const offset = formPane.getBoundingClientRect().top - ctx.stage.getBoundingClientRect().top;
          const notesHeight = notes ? notes.offsetHeight + parseFloat(getComputedStyle(notes).marginTop) : 0;
          if (form && !L.tabs) {
            const available = Math.max(0, stageHeight - offset - notesHeight - reserve - 8);
            form.style.minHeight = Math.min(form.offsetHeight, available) + 'px';
            if (form.offsetHeight > available) {
              root.classList.add('ff-compact-margin');
              form.style.minHeight = '0';
            }
          }
        },
      },
    },
  });
})();
