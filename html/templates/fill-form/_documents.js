/* fill-form/_documents: reference builders. scope is the live unit scope; reference.js retains all design hooks. */
(function () {
  'use strict';
function row(scope, util, parent, label, value, cls = 'ff-row') {
        const r = util.el('div', cls, parent);
        util.el('div', 'ff-doclabel', r, label);
        util.el('div', 'ff-v', r, value);
        return r;
      }

function renderCard(scope, util, pane, d, rng) {
        const card = util.el('div', 'ff-card ff-paper', pane);
        if (d.style === 'id') {
          const band = util.el('div', 'ff-band', card);
          util.el('b', '', band, d.issuer);
          util.el('span', '', band, d.org);
          const body = util.el('div', 'ff-cardbody', card);
          const photo = util.el('div', 'ff-photo', body);
          photo.innerHTML = scope.PERSON_SVG;
          const grid = util.el('div', 'ff-idgrid', body);
          for (const r of d.rows) scope.row(util, grid, r.label, r.value, 'ff-row' + (r.value.length > 18 || r.value.includes('\n') ? ' wide' : ''));
          const foot = util.el('div', 'ff-idfoot', card);
          for (const x of d.extras) scope.row(util, foot, x.label, x.value);
        } else if (d.style === 'contact') {
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
        } else {
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
        }
        if (rng.bool(0.5)) card.style.borderRadius = '.35em';
        return card;
      }

function renderEmail(scope, util, pane, d, rng) {
        if (d.style === 'plain') {
          const box = util.el('div', 'ff-plainmail ff-paper', pane);
          util.el('pre', 'hdr', box, `From: ${d.from.name} <${d.from.addr}>\nTo: ${d.to}\nDate: ${d.date}\nSubject: ${d.subject}`);
          util.el('hr', '', box);
          util.el('p', '', box, d.greeting);
          for (const p of d.paragraphs) util.el('p', '', box, p);
          util.el('p', '', box, d.signature.join('\n')).style.marginBottom = '0';
          return box;
        }
        const box = util.el('div', 'ff-mail', pane);
        const bar = util.el('div', 'ff-mailbar', box);
        for (const b of rng.pick([['Reply', 'Forward', 'Archive'], ['Reply all', 'Forward', 'Delete'], ['Inbox', 'Reply', 'Mark unread']])) util.el('span', '', bar, b);
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
      }

function renderInvoice(scope, util, pane, d, rng) {
        if (d.style === 'receipt') {
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
        }
        const inv = util.el('div', 'ff-invoice ff-paper', pane);
        inv.style.fontFamily = rng.pick(scope.INVOICE_FONTS);
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
      }

function docBlocks(scope, d) {
        const B = [];
        const row = (cells, extra = {}) => B.push({ t: 'row', cells, ...extra });
        if (d.kind === 'card') {
          B.push({ t: 'band', left: d.issuer, right: d.org });
          if (d.heading) B.push({ t: 'title', text: d.heading });
          if (d.subtitle) B.push({ t: 'text', text: d.subtitle, muted: true });
          for (const r of d.rows) B.push({ t: 'kv', label: r.label, value: r.value });
          B.push({ t: 'rule', dashed: true });
          for (const r of d.extras) B.push({ t: 'kv', label: r.label, value: r.value, small: true });
        } else if (d.kind === 'email') {
          B.push({ t: 'kv', label: 'From:', value: `${d.from.name} <${d.from.addr}>`, small: true });
          B.push({ t: 'kv', label: 'To:', value: d.to, small: true });
          B.push({ t: 'kv', label: 'Date:', value: d.date, small: true });
          B.push({ t: 'kv', label: 'Subject:', value: d.subject, small: true, bold: true });
          B.push({ t: 'rule' });
          B.push({ t: 'text', text: d.greeting });
          for (const p of d.paragraphs) B.push({ t: 'text', text: p, gap: true });
          for (const s of d.signature) B.push({ t: 'text', text: s });
        } else if (d.style === 'receipt') {
          B.push({ t: 'title', text: d.vendor.name.toUpperCase(), align: 'center' });
          for (const a of d.vendor.addr) B.push({ t: 'text', text: a, align: 'center', small: true });
          B.push({ t: 'text', text: `Tel ${d.vendor.phone}`, align: 'center', small: true });
          B.push({ t: 'rule', dashed: true });
          for (const m of d.meta) row([{ text: m.label, from: 0, to: 0.5 }, { text: m.value, from: 0.4, to: 1, align: 'right' }]);
          B.push({ t: 'rule', dashed: true });
          for (const it of d.items) {
            row([{ text: it.desc, from: 0, to: 0.74 }, { text: it.amount, from: 0.74, to: 1, align: 'right' }]);
            if (it.qty > 1) row([{ text: `  ${it.qty} x ${it.unit}`, from: 0.04, to: 0.8, muted: true }]);
          }
          if (d.totals.length) B.push({ t: 'rule', dashed: true });
          for (const t of d.totals) row([{ text: t.label, from: 0, to: 0.6, bold: t.strong }, { text: t.value, from: 0.5, to: 1, align: 'right', bold: t.strong }]);
          if (d.payLine) {
            B.push({ t: 'rule', dashed: true });
            row([{ text: d.payLine.label, from: 0, to: 0.6 }, { text: d.payLine.value, from: 0.5, to: 1, align: 'right' }]);
            if (d.payLine.change) row([{ text: 'CHANGE', from: 0, to: 0.6 }, { text: d.payLine.change, from: 0.5, to: 1, align: 'right' }]);
          }
          B.push({ t: 'rule', dashed: true });
          if (d.currencyNote) B.push({ t: 'text', text: d.currencyNote, align: 'center', small: true });
          for (const n of d.notes) B.push({ t: 'text', text: n, align: 'center', small: true });
        } else {
          B.push({ t: 'title', text: d.vendor.name, ink: true });
          for (const a of d.vendor.addr) B.push({ t: 'text', text: a, muted: true, small: true });
          B.push({ t: 'text', text: `Tel. ${d.vendor.phone}`, muted: true, small: true });
          if (d.title) B.push({ t: 'title', text: d.title, align: 'right', light: true });
          for (const m of d.meta) row([{ text: m.label, from: 0.42, to: 0.7, muted: true, align: 'right' }, { text: m.value, from: 0.7, to: 1, align: 'right' }]);
          if (d.billTo) {
            B.push({ t: 'text', text: 'BILL TO', muted: true, small: true, gap: true });
            B.push({ t: 'text', text: d.billTo.name, bold: true });
            for (const a of d.billTo.addr) B.push({ t: 'text', text: a, small: true });
          }
          B.push({ t: 'gap' });
          const c = d.cols;
          row([{ text: c[0], from: 0, to: 0.5, bold: true }, { text: c[1], from: 0.5, to: 0.6, align: 'right', bold: true },
            { text: c[2], from: 0.6, to: 0.8, align: 'right', bold: true }, { text: c[3], from: 0.8, to: 1, align: 'right', bold: true }], { small: true });
          B.push({ t: 'rule', ink: true });
          for (const it of d.items) {
            row([{ text: it.desc, from: 0, to: 0.5 }, { text: String(it.qty), from: 0.5, to: 0.6, align: 'right' },
              { text: it.unit, from: 0.6, to: 0.8, align: 'right' }, { text: it.amount, from: 0.8, to: 1, align: 'right' }], { small: true });
          }
          B.push({ t: 'rule' });
          for (const t of d.totals) row([{ text: t.label, from: 0.3, to: 0.66, align: 'right', muted: !t.strong, bold: t.strong }, { text: t.value, from: 0.7, to: 1, align: 'right', bold: t.strong }]);
          if (d.currencyNote) B.push({ t: 'text', text: d.currencyNote, small: true, muted: true, gap: true });
          for (const n of d.notes) B.push({ t: 'text', text: n, small: true, muted: true, gap: true });
          if (d.stamp) B.push({ t: 'stamp', text: d.stamp });
        }
        return B;
      }

function layoutDoc(scope, c, blocks, W, F, fam, ink) {
        const pad = Math.round(F * 1.4);
        const inner = W - 2 * pad;
        const ops = [];
        let y = pad;
        const font = (size, bold, light) => `${bold ? 'bold ' : light ? '300 ' : ''}${size}px ${fam}`;
        const lh = (size) => Math.round(size * 1.4);
        const wrap = (text, f, maxW) => {
          c.font = f;
          const out = [];
          for (const para of String(text).split('\n')) {
            let line = '';
            for (const w of para.split(/\s+/)) {
              const t = line ? `${line} ${w}` : w;
              if (line && c.measureText(t).width > maxW) { out.push(line); line = w; } else line = t;
            }
            out.push(line);
          }
          return out;
        };
        const TXT = '#23262c';
        const MUTED = '#5f646d';
        for (const b of blocks) {
          if (b.t === 'band') {
            const top = y === pad ? 0 : y;
            const h = Math.round(F * 2.8);
            ops.push({ k: 'rect', x: -20, y: top - 20, w: W + 40, h: h + 20, color: ink });
            ops.push({ k: 'text', x: pad, y: top + (h - F * 1.05) / 2, text: b.left, font: font(Math.round(F * 1.02), true), color: '#fff' });
            ops.push({ k: 'text', x: W - pad, y: top + (h - F * 0.8) / 2, text: b.right, font: font(Math.round(F * 0.8)), color: '#fff', align: 'right' });
            y = top + h + Math.round(F * 0.8);
          } else if (b.t === 'title') {
            const size = Math.round(F * (b.light ? 1.4 : 1.28));
            const f = font(size, !b.light, b.light);
            for (const line of wrap(b.text, f, inner)) {
              const x = b.align === 'right' ? W - pad : b.align === 'center' ? W / 2 : pad;
              ops.push({ k: 'text', x, y, text: line, font: f, color: b.ink ? ink : TXT, align: b.align || 'left' });
              y += lh(size);
            }
            y += Math.round(F * 0.2);
          } else if (b.t === 'text') {
            const size = Math.round(F * (b.small ? 0.88 : 1));
            const f = font(size, b.bold);
            if (b.gap) y += Math.round(F * 0.45);
            for (const line of wrap(b.text, f, inner)) {
              const x = b.align === 'right' ? W - pad : b.align === 'center' ? W / 2 : pad;
              ops.push({ k: 'text', x, y, text: line, font: f, color: b.muted ? MUTED : TXT, align: b.align || 'left' });
              y += lh(size);
            }
          } else if (b.t === 'kv') {
            const size = Math.round(F * (b.small ? 0.86 : 1));
            const lw = Math.round(inner * (b.small ? 0.2 : 0.34));
            const vf = font(size, b.bold || !b.small);
            ops.push({ k: 'text', x: pad, y: y + 1, text: b.label, font: font(Math.round(size * 0.92)), color: MUTED });
            for (const line of wrap(b.value, vf, inner - lw - 8)) {
              ops.push({ k: 'text', x: pad + lw + 8, y, text: line, font: vf, color: TXT });
              y += lh(size);
            }
            y += Math.round(F * (b.small ? 0.1 : 0.32));
          } else if (b.t === 'row') {
            const size = Math.round(F * (b.small ? 0.9 : 1));
            let rows = 1;
            for (const cell of b.cells) {
              const f = font(size, cell.bold);
              const x0 = pad + cell.from * inner;
              const x1 = pad + cell.to * inner;
              const lines = cell.align === 'right' ? [cell.text] : wrap(cell.text, f, x1 - x0 - 6);
              lines.forEach((line, i) => ops.push({ k: 'text', x: cell.align === 'right' ? x1 : x0, y: y + i * lh(size), text: line, font: f,
                color: cell.muted ? MUTED : TXT, align: cell.align || 'left' }));
              rows = Math.max(rows, lines.length);
            }
            y += rows * lh(size) + Math.round(F * 0.15);
          } else if (b.t === 'rule') {
            y += Math.round(F * 0.35);
            ops.push({ k: 'line', x1: pad, x2: W - pad, y: y, color: b.ink ? ink : '#9aa0a8', dashed: !!b.dashed, w: b.ink ? 2 : 1 });
            y += Math.round(F * 0.55);
          } else if (b.t === 'gap') {
            y += Math.round(F * 0.8);
          } else if (b.t === 'stamp') {
            ops.push({ k: 'stamp', x: W - pad - F * 4.5, y: y * 0.45, text: b.text, size: Math.round(F * 1.7) });
          }
        }
        return { ops, h: Math.ceil(y + pad) };
      }

function renderImage(scope, util, pane, d, rng, W, maxH, look) {
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
        return cv;
      }

function renderDoc(scope, util, pane, d, rng) {
        if (d.kind === 'card') return scope.renderCard(util, pane, d, rng);
        if (d.kind === 'email') return scope.renderEmail(util, pane, d, rng);
        return scope.renderInvoice(util, pane, d, rng);
      }

function imageLook(scope, rng, d, receipt, ink) {
        const fam = receipt || (d.kind === 'email' && d.style === 'plain') ? scope.DOC_FONTS.mono
          : d.kind === 'invoice' && rng.bool(0.4) ? scope.DOC_FONTS.serif : scope.DOC_FONTS.sans;
        return { size: rng.pick([14, 15, 16]), fam, ink, paper: rng.pick(scope.PAPERS), paper2: rng.pick(['#eeeae0', '#e9ebee', '#f1efe8', '#e6e4dc']),
          angle: rng.float(-1.3, 1.3) || 0.4, noise: rng.float(0.4, 1.2), radius: d.kind === 'card' ? 10 : 0 };
      }


  env.template('fill-form/_documents', () => ({ row, renderCard, renderEmail, renderInvoice, docBlocks, layoutDoc, renderImage, renderDoc, imageLook }));
})();
