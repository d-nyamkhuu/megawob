// Design of this site on the fill-form/document template (templates/fill-form/document.js): the reference
// page layout (standard) with the invoice redrawn as a typeset sheet, the key fields grouped at the top of
// the form (invoice number, date, vendor, total with currency, purchase order), a calendar icon on date
// fields, reset hooks for the page's Cancel button, and a compact/tight/condensed look on short stages.
(function () {
  'use strict';

  // A clean typeset rendition of the same sampled source. Retain the original renderer's
  // random draws above this presentation pass, and keep image episodes as raster documents.
  function sheetInvoice(util, pane, d) {
    const cv = document.createElement('canvas');
    cv.className = 'ff-sheetinvoice';
    const W = 660;
    const H = Math.max(660, 350 + d.items.length * 48 + d.totals.length * 34 + d.notes.length * 26 + (d.billTo ? 110 : 0) + (d.payLine ? 70 : 0));
    cv.width = W * 2; cv.height = H * 2;
    const c = cv.getContext('2d'); c.scale(2, 2);
    c.fillStyle = '#fff'; c.fillRect(0, 0, W, H);
    const text = (value, x, y, size = 20, bold = false, align = 'left', color = '#171f32', maxWidth) => {
      c.font = `${bold ? '600' : '400'} ${size}px Arial, sans-serif`;
      c.fillStyle = color; c.textAlign = align;
      if (maxWidth) c.fillText(String(value), x, y, maxWidth); else c.fillText(String(value), x, y);
    };
    const rule = y => {c.strokeStyle='#dce0e7'; c.lineWidth=1.3; c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();};
    text(d.vendor.name, 0, 36, 36, true, 'left', '#080e1d', 400);
    let y = 80;
    for (const a of d.vendor.addr) {text(a,0,y,21);y+=27;}
    text(`Tel. ${d.vendor.phone}`,0,y,18);
    c.font = '600 25px Arial, sans-serif';
    const letters = [...'INVOICE'];
    let tx = W - letters.reduce((sum, letter) => sum + c.measureText(letter).width, 0) - 4 * (letters.length - 1);
    for (const letter of letters) {
      text(letter,tx,27,25,true,'left','#646b7a');
      tx += c.measureText(letter).width + 4;
    }
    let my=73;
    for(const m of d.meta) {text(`${m.label} ${m.value}`,W,my,20,my===73,'right','#171f32',300);my+=34;}
    y=Math.max(y+35,my+22,170); rule(y);
    if(d.billTo) {
      y+=28; text('Bill to',0,y,18);y+=26;text(d.billTo.name,0,y,20,true);
      for(const a of d.billTo.addr){y+=24;text(a,0,y,18);}y+=28;
    } else y+=26;
    c.fillStyle='#eef0f4';c.fillRect(0,y,W,48);
    text('Qty',16,y+31,18,true);text('Description',94,y+31,18,true);
    text('Unit Price',487,y+31,18,true,'right');text('Amount',642,y+31,18,true,'right');
    y+=48;
    for(const it of d.items) {
      text(it.qty,16,y+30,18);text(it.desc,94,y+30,18,false,'left','#171f32',315);
      text(it.unit,487,y+30,18,false,'right');text(it.amount,642,y+30,18,false,'right');
      y+=48;rule(y);
    }
    y+=34;
    for(const t of d.totals) {
      if(t.strong){c.strokeStyle='#b9c0cd';c.beginPath();c.moveTo(402,y-24);c.lineTo(W,y-24);c.stroke();}
      text(t.label,410,y,t.strong?21:18,!!t.strong,'left','#171f32',110);
      text(t.value,642,y,t.strong?21:18,!!t.strong,'right');y+=34;
    }
    if(d.payLine) {text(`${d.payLine.label} ${d.payLine.value}`,W,y,18,false,'right');y+=26;
      if(d.payLine.change){text(`Change ${d.payLine.change}`,W,y,18,false,'right');y+=26;}}
    y+=36;
    if(d.currencyNote){text(d.currencyNote,0,y,17);y+=26;}
    for(const n of d.notes){text(n,0,y,17,false,'left','#171f32',W);y+=26;}
    if(d.stamp) text(d.stamp,W,y,20,true,'right');
    pane.replaceChildren(cv);
  }

  env.widget({
    task: 'fill-form',
    site: 'design-fill-form-invoice-10',
    name: 'design',
    split: 'train',
    scenarios: ['invoice'],
    traits: { noTabs: true, fieldset: { invoice: { keys: ['invNo', 'date', 'vendor', 'total', 'currency'], blank: ['po'] } } },
    template: 'fill-form/document',
    design: {
      formTitle: 'Enter Invoice Information',
      dateIcon: { cls: 'ff-calendar-icon', svg: '<svg viewBox="0 0 28 28" aria-hidden="true"><rect x="3" y="5" width="22" height="21" rx="2"/><path d="M3 11h22M8 2v6M20 2v6M8 15h2m4 0h2m4 0h1M8 20h2m4 0h2m4 0h1"/></svg>' },
      parts: {
        // The replacement canvas needs no receipt font fit.
        finished: () => () => {},
        fieldWrap: () => (f, wrap) => {
          if (f.kind === 'date') {
            wrap.classList.add('ff-datefield');
          }
        },
        // What the page's Cancel button calls on each field entry.
        entry: (base, S) => (f, x) => {
          if (f.kind === 'checkbox') x.reset = () => { x.cb.checked = false; S.P.setField(f.id, false, null); };
          else if (f.kind === 'dropdown') x.reset = () => { x.show(''); S.P.setField(f.id, '', null); };
          else if (f.kind === 'radio') x.reset = () => { for (const [, input] of x.radios) input.checked = false; S.P.setField(f.id, '', null); };
        },
        formEnd: (base, S) => (form, grid) => {
          const util = S.ctx.util;
          const fields = [...grid.children];
          const find = re => fields.find(w => re.test(w.querySelector('.ff-label')?.textContent || ''));
          const byId = id => fields.find(w => w.dataset.field === id);
          const invoice = byId('invNo') || find(/^(invoice|receipt|order).*(number|no\.|#)/i);
          const date = byId('date') || fields.find(w => w.classList.contains('ff-datefield'));
          const vendor = byId('vendor') || find(/merchant|vendor|seller|supplier|company name|store name/i);
          const po = byId('po') || find(/purchase order|^po number/i);
          const total = byId('total') || find(/^(grand )?total(?! quantity| items)/i);
          const currency = byId('currency') || fields.find(w => w.querySelector('.ff-dd'));
          const primary = [invoice, date, vendor].filter(Boolean);
          primary.forEach(w => {w.classList.add('ff-primary'); grid.append(w);});
          if (total || currency) {
            const combined = util.el('div', 'ff-totalrow', grid);
            if(total) combined.append(total);
            if(currency) combined.append(currency);
          }
          if(po){po.classList.add('ff-primary');grid.append(po);}
          const extra = fields.filter(w => ![...primary,po,total,currency].includes(w));
          if(extra.length){const more=util.el('div','ff-extrafields',grid);extra.forEach(w=>more.append(w));}
        },
        arranged: (base, S) => (ctx, R) => {
          const { util, spec } = ctx;
          const d = spec.doc;
          const L = spec.layout;
          const { root, docPane, formPane, box } = R;
          if (d.kind === 'invoice') sheetInvoice(util, docPane, d);
          const foot = document.querySelector('.ds-footer');
          if (foot) {
            if (L.tabs) { root.append(foot); foot.classList.add('ff-tabfooter'); }
            else formPane.append(foot);
          }
          // Chrome initially reserves the footer's height; measure the sheet after its
          // existing move into the form so a full-size reference keeps its original pitch.
          const sheetHeight = box.host.clientHeight || box.height;
          root.classList.toggle('ff-compact', sheetHeight < 740);
          root.classList.toggle('ff-tight', sheetHeight < 560);
          root.classList.toggle('ff-condensed', sheetHeight < 480);
          const clearAll = document.querySelector('.ds-cancel');
          if (clearAll) clearAll.addEventListener('click', () => {
            for (const f of spec.fields) {
              const item = S.el[f.id];
              if (item && item.input) item.clear.click();
              else if (item && item.reset) {
                item.reset();
              }
            }
          });
        },
      },
    },
  });
})();
