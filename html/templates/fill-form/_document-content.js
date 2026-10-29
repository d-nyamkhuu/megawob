/* fill-form/_document-content: document template parts, installed in order with the live template scope. */
(function () {
  'use strict';
  function installCard(BASE, scope) {
    BASE.row = (util, parent, label, value, cls = 'ff-row') => {
      const r = util.el('div', cls, parent);
      util.el('div', 'ff-doclabel', r, label);
      util.el('div', 'ff-v', r, value);
      return r;
    };

    BASE.cardId = (util, card, d) => {
      const band = util.el('div', 'ff-band', card);
      util.el('b', '', band, d.issuer);
      util.el('span', '', band, d.org);
      const body = util.el('div', 'ff-cardbody', card);
      const photo = util.el('div', 'ff-photo', body);
      photo.innerHTML = scope.PERSON_SVG;
      const grid = util.el('div', 'ff-idgrid', body);
      for (const r of d.rows) scope.P.row(util, grid, r.label, r.value, 'ff-row' + (r.value.length > 18 || r.value.includes('\n') ? ' wide' : ''));
      const foot = util.el('div', 'ff-idfoot', card);
      for (const x of d.extras) scope.P.row(util, foot, x.label, x.value);
    };

    BASE.cardContact = (util, card, d) => {
      const box = util.el('div', 'ff-contact', card);
      const head = util.el('div', 'ff-chead', box);
      util.el('div', 'ff-avatar', head, d.initials);
      const who = util.el('div', '', head);
      util.el('div', 'ff-doclabel', who, d.issuer);
      if (d.heading) util.el('div', 'ff-cname', who, d.heading);
      if (d.subtitle) util.el('div', 'ff-csub', who, d.subtitle);
      const t = util.el('div', 'ff-ctable', box);
      for (const r of [...d.rows, ...d.extras]) {
        util.el('div', 'ff-doclabel', t, r.label);
        util.el('div', 'ff-v', t, r.value).style.whiteSpace = 'pre-line';
      }
    };

    BASE.cardProfile = (util, card, d) => {
      card.classList.add('ff-profile');
      const head = util.el('div', 'ff-phead', card);
      util.el('b', '', head, d.issuer);
      util.el('span', 'ff-doclabel', head, d.org);
      if (d.heading || d.subtitle) {
        const h = util.el('div', '', card);
        h.style.padding = '.7em 1.2em .2em';
        if (d.heading) util.el('div', 'ff-cname', h, d.heading);
        if (d.subtitle) util.el('div', 'ff-csub', h, d.subtitle);
      }
      const table = util.el('table', 'ff-ptable', card);
      for (const r of [...d.rows, ...d.extras]) {
        const tr = util.el('tr', '', table);
        util.el('td', '', tr, r.label);
        util.el('td', '', tr, r.value);
      }
    };

    BASE.cardFill = (util, card, d) => {
      if (d.style === 'id') scope.P.cardId(util, card, d);
      else if (d.style === 'contact') scope.P.cardContact(util, card, d);
      else scope.P.cardProfile(util, card, d);
    };

    BASE.renderCard = (util, pane, d, rng) => {
      const card = util.el('div', 'ff-card ff-paper', pane);
      scope.P.cardFill(util, card, d);
      if (rng.bool(0.5)) card.style.borderRadius = '.35em';
      return card;
    };

    // The mail client's toolbar: one seeded draw of three button sets.

  }

  function installEmail(BASE, scope) {
    BASE.mailTools = (rng) => rng.pick([['Reply', 'Forward', 'Archive'], ['Reply all', 'Forward', 'Delete'], ['Inbox', 'Reply', 'Mark unread']]);

    // A header block of labeled rows (From, To, Subject, Date) in a div of class o.cls inside parent: o.addr
    // shows the sender's address only; o.skip lists labels to leave out ('Date:'); labels are o.labelTag
    // elements (default b) of class o.labelCls. Returns the block.
    BASE.mailHeader = (util, parent, d, o = {}) => {
      const { cls = '', addr = false, skip = [], labelTag = 'b', labelCls = '' } = o;
      const head = util.el('div', cls, parent);
      for (const [label, value] of [['From:', addr ? d.from.addr : `${d.from.name} <${d.from.addr}>`], ['To:', d.to],
        ['Subject:', d.subject], ['Date:', d.date]]) {
        if (skip.includes(label)) continue;
        util.el(labelTag, labelCls, head, label);
        util.el('span', '', head, value);
      }
      return head;
    };

    BASE.mailPlain = (util, pane, d) => {
      const box = util.el('div', 'ff-plainmail ff-paper', pane);
      util.el('pre', 'hdr', box, `From: ${d.from.name} <${d.from.addr}>\nTo: ${d.to}\nDate: ${d.date}\nSubject: ${d.subject}`);
      util.el('hr', '', box);
      util.el('p', '', box, d.greeting);
      for (const p of d.paragraphs) util.el('p', '', box, p);
      util.el('p', '', box, d.signature.join('\n')).style.marginBottom = '0';
      return box;
    };

    BASE.mailClient = (util, pane, d, rng) => {
      const box = util.el('div', 'ff-mail', pane);
      const bar = util.el('div', 'ff-mailbar', box);
      for (const b of scope.P.mailTools(rng)) util.el('span', '', bar, b);
      util.el('div', 'ff-mailsubj', box, d.subject);
      const from = util.el('div', 'ff-mailfrom', box);
      util.el('div', 'ff-avatar', from, d.initials);
      const who = util.el('div', 'who', from);
      util.el('b', '', who, d.from.name);
      util.el('span', '', who, ` <${d.from.addr}>`);
      util.el('small', '', who, `to ${d.to}`);
      util.el('div', 'when', from, d.date);
      const body = util.el('div', 'ff-mailbody', box);
      util.el('p', '', body, d.greeting);
      for (const p of d.paragraphs) util.el('p', '', body, p);
      util.el('p', 'sig', body, d.signature.join('\n'));
      return box;
    };

    BASE.renderEmail = (util, pane, d, rng) => (d.style === 'plain' ? scope.P.mailPlain(util, pane, d) : scope.P.mailClient(util, pane, d, rng));


  }

  function installInvoice(BASE, scope) {
    BASE.isReceipt = (d) => d.style === 'receipt';

    BASE.receipt = (util, pane, d) => {
      const r = util.el('div', 'ff-receipt ff-paper', pane);
      r.style.boxShadow = 'none';
      r.style.filter = 'drop-shadow(0 4px 10px rgba(0,0,0,.18))';
      util.el('div', 'c vn', r, d.vendor.name);
      util.el('div', 'c', r, d.vendor.addr.join('\n')).style.whiteSpace = 'pre-line';
      util.el('div', 'c', r, `Tel ${d.vendor.phone}`);
      util.el('div', 'sep', r);
      for (const m of d.meta) {
        const ln = util.el('div', 'ln', r);
        util.el('span', '', ln, m.label);
        util.el('span', '', ln, m.value);
      }
      util.el('div', 'sep', r);
      for (const it of d.items) {
        const ln = util.el('div', 'ln', r);
        util.el('span', '', ln, it.desc);
        util.el('span', '', ln, it.amount);
        if (it.qty > 1) util.el('div', 'sub', r, `${it.qty} x ${it.unit}`);
      }
      if (d.totals.length) util.el('div', 'sep', r);
      for (const t of d.totals) {
        const ln = util.el('div', 'ln' + (t.strong ? ' big' : ''), r);
        util.el('span', '', ln, t.label);
        util.el('span', '', ln, t.value);
      }
      if (d.payLine) {
        util.el('div', 'sep', r);
        const ln = util.el('div', 'ln', r);
        util.el('span', '', ln, d.payLine.label);
        util.el('span', '', ln, d.payLine.value);
        if (d.payLine.change) {
          const c = util.el('div', 'ln', r);
          util.el('span', '', c, 'CHANGE');
          util.el('span', '', c, d.payLine.change);
        }
      }
      util.el('div', 'sep', r);
      if (d.currencyNote) util.el('div', 'c', r, d.currencyNote);
      for (const n of d.notes) util.el('div', 'c', r, n);
      return r;
    };

    BASE.sheetFont = (inv, rng) => { inv.style.fontFamily = rng.pick(scope.INVOICE_FONTS); };
    BASE.sheetTitle = (d) => d.title;
    BASE.sheetCols = (d) => d.cols;
    BASE.sheetEnd = (util, inv, tot, d) => {
      if (d.currencyNote) util.el('div', 'ff-notes', inv, d.currencyNote);
      for (const n of d.notes) util.el('div', 'ff-notes', inv, n);
      if (d.stamp) util.el('div', 'ff-stamp', inv, d.stamp);
    };

    BASE.sheetStart = () => {};
    BASE.sheetHeader = (util, inv, d) => {
      const head = util.el('div', 'ff-invhead', inv);
      const left = util.el('div', '', head);
      util.el('div', 'ff-vname', left, d.vendor.name);
      util.el('div', 'ff-vaddr', left, `${d.vendor.addr.join('\n')}\nTel. ${d.vendor.phone}`);
      const right = util.el('div', '', head);
      util.el('div', 'ff-invtitle', right, scope.P.sheetTitle(d));
      const meta = util.el('table', 'ff-meta', right);
      for (const m of d.meta) {
        const tr = util.el('tr', '', meta);
        util.el('td', '', tr, m.label);
        util.el('td', '', tr, m.value);
      }
    };

    BASE.sheetBillTo = (util, inv, d) => {
      if (d.billTo) {
        const b = util.el('div', 'ff-billto', inv);
        util.el('div', 'ff-doclabel', b, 'Bill to');
        util.el('b', '', b, d.billTo.name);
        util.el('div', '', b, d.billTo.addr.join('\n'));
      }
    };

    BASE.sheetItems = (util, inv, d) => {
      const table = util.el('table', 'ff-items', inv);
      const hr = util.el('tr', '', table);
      scope.P.sheetCols(d).forEach((c, i) => { util.el('th', i ? 'num' : '', hr, c); });
      for (const it of d.items) {
        const tr = util.el('tr', '', table);
        util.el('td', '', tr, it.desc);
        util.el('td', 'num', tr, String(it.qty));
        util.el('td', 'num', tr, it.unit);
        util.el('td', 'num', tr, it.amount);
      }
    };

    BASE.sheetTotals = (util, inv, d) => {
      const tot = util.el('table', 'ff-totals', inv);
      for (const t of d.totals) {
        const tr = util.el('tr', t.strong ? 'strong' : '', tot);
        util.el('td', '', tr, t.label);
        util.el('td', '', tr, t.value);
      }
      return tot;
    };

    BASE.invoiceSheet = (util, pane, d, rng) => {
      const inv = util.el('div', 'ff-invoice ff-paper', pane);
      scope.P.sheetStart(inv, d);
      scope.P.sheetFont(inv, rng, d);
      scope.P.sheetHeader(util, inv, d);
      scope.P.sheetBillTo(util, inv, d);
      scope.P.sheetItems(util, inv, d);
      const tot = scope.P.sheetTotals(util, inv, d);
      scope.P.sheetEnd(util, inv, tot, d);
      return inv;
    };

    BASE.renderInvoice = (util, pane, d, rng) => (scope.P.isReceipt(d) ? scope.P.receipt(util, pane, d) : scope.P.invoiceSheet(util, pane, d, rng));

    BASE.renderDoc = (util, pane, d, rng) => {
      if (d.kind === 'card') return scope.P.renderCard(util, pane, d, rng.fork('doc'));
      if (d.kind === 'email') return scope.P.renderEmail(util, pane, d, rng.fork('doc'));
      return scope.P.renderInvoice(util, pane, d, rng.fork('doc'));
    };


  }

  function installImage(BASE, scope) {
    BASE.imageDrawn = () => {};

    // ------------------------------------------------------------ document as an image (standard)

    // Draw the document onto a canvas: paper, a slight rotation, faint scan noise. Deterministic (seeded).
    BASE.renderImage = (util, pane, d, rng, W, maxH, look) => {
      const probe = document.createElement('canvas').getContext('2d');
      const blocks = scope.docBlocks(d);
      let F = look.size;
      let lay;
      for (;;) {
        lay = scope.layoutDoc(probe, blocks, W, F, look.fam, look.ink);
        if (lay.h <= maxH || F <= 10) break;
        F -= 0.5;
      }
      const H = lay.h;
      const dpr = window.devicePixelRatio || 1;
      const cv = util.el('canvas', 'ff-docimg', pane);
      cv.dataset.role = 'document-image';
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cv.style.width = `${W}px`;
      if (look.radius) cv.style.borderRadius = `${look.radius}px`;
      const c = cv.getContext('2d');
      c.scale(dpr, dpr);
      const g = c.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, look.paper);
      g.addColorStop(1, look.paper2);
      c.fillStyle = g;
      c.fillRect(0, 0, W, H);
      c.save();
      c.translate(W / 2, H / 2);
      c.rotate((look.angle * Math.PI) / 180);
      c.translate(-W / 2, -H / 2);
      c.textBaseline = 'top';
      for (const op of lay.ops) {
        if (op.k === 'rect') {
          c.fillStyle = op.color;
          c.fillRect(op.x, op.y, op.w, op.h);
        } else if (op.k === 'text') {
          c.font = op.font;
          c.fillStyle = op.color;
          c.textAlign = op.align || 'left';
          c.fillText(op.text, op.x, op.y);
        } else if (op.k === 'line') {
          c.strokeStyle = op.color;
          c.lineWidth = op.w;
          c.setLineDash(op.dashed ? [4, 3] : []);
          c.beginPath();
          c.moveTo(op.x1, op.y + 0.5);
          c.lineTo(op.x2, op.y + 0.5);
          c.stroke();
          c.setLineDash([]);
        } else if (op.k === 'stamp') {
          c.save();
          c.translate(op.x, op.y);
          c.rotate(-0.24);
          c.font = `800 ${op.size}px ${scope.DOC_FONTS.sans}`;
          c.strokeStyle = 'rgba(201,42,42,.75)';
          c.fillStyle = 'rgba(201,42,42,.75)';
          c.lineWidth = 3;
          c.textAlign = 'left';
          const w = c.measureText(op.text).width;
          c.strokeRect(-8, -6, w + 16, op.size + 12);
          c.fillText(op.text, 0, 0);
          c.restore();
        }
      }
      c.restore();
      // Scan noise: specks, a few faint streaks, a darker edge.
      for (let i = 0; i < Math.round((W * H) / 900 * look.noise); i++) {
        c.fillStyle = `rgba(40,40,40,${rng.float(0.05, 0.3).toFixed(3)})`;
        const r = rng.float(0.3, 1.1);
        c.beginPath();
        c.arc(rng.float(0, W), rng.float(0, H), r, 0, Math.PI * 2);
        c.fill();
      }
      for (let i = 0; i < rng.int(0, 3); i++) {
        c.fillStyle = `rgba(0,0,0,${rng.float(0.02, 0.05).toFixed(3)})`;
        c.fillRect(0, rng.float(0, H), W, rng.float(1, 3));
      }
      c.strokeStyle = 'rgba(0,0,0,.12)';
      c.lineWidth = 2;
      c.strokeRect(1, 1, W - 2, H - 2);
      scope.P.imageDrawn(cv, pane, d, dpr);
      return cv;
    };

    // The stage box. A scrollable page's stage can shrink to its content (flex: none) and report width 0
    // before anything is drawn; then measure the free space of its row and draw into a host of that width.

  }

  env.template('fill-form/_document-content', () => ({ installCard, installEmail, installInvoice, installImage }));
})();
