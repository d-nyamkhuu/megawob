// Design on templates/fill-form/base.js: the base site's fill-form widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-claim-02',
  name: 'design',
  split: 'train',
  scenarios: ['claim'],
  template: 'fill-form/base',
  design: {
    parts: {
      'scanBitmap': (base, S) => function scanBitmap(ctx, parent) {
        const { DOC_FONTS, docBlocks, layoutDoc } = S;
        const { util, spec } = ctx;
        const r = ctx.rng.fork('scan-paper');
        const d = spec.doc;
        const W = spec.scenario === 'claim' ? 600 : 660;
        const probe = document.createElement('canvas').getContext('2d');
        const receipt = d.style === 'receipt';
        let blocks;
        if (d.kind === 'scan') {
          blocks = [{ t:'title', text:d.issuer, align:receipt ? 'center' : 'left' },
            { t:'text', text:d.title, bold:true, align:receipt ? 'center' : 'left' },
            { t:'text', text:d.subtitle, small:true, muted:true }, { t:'rule', dashed:receipt }];
          // Reserve a portrait band on ID cards; every fact still has its own full-width line below it.
          if (d.style === 'idcard') blocks.push({ t:'text', text:'CIVIC REGISTRY / RESIDENT SERVICES', small:true }, { t:'gap' }, { t:'gap' }, { t:'gap' });
          for (const row of d.rows) {
            if (receipt && row.id === 'total') {
              for (const it of d.items) {
                blocks.push({ t:'row', small:true, cells:[{ text:`${it.qty} × ${it.desc}`, from:0, to:0.75 }, { text:it.amount, from:0.76, to:1, align:'right' }] });
              }
              blocks.push({ t:'rule', dashed:true });
            }
            blocks.push({ t:'kv', label:row.label, value:row.value, bold:row.id === 'total' });
          }
          blocks.push({ t:'rule', dashed:receipt }, { t:'text', text:d.note, small:true, muted:true }, { t:'gap' }, { t:'gap' }, { t:'gap' });
        } else blocks = docBlocks(d);
        const F = d.kind === 'scan' ? 22 : 21;
        const layout = layoutDoc(probe, blocks, W, F, receipt ? DOC_FONTS.mono : DOC_FONTS.sans, '#3a5261');
        if (spec.scenario === 'claim') for (const op of layout.ops) {
          if (typeof op.y === 'number') op.y *= 1.2;
          if (op.k === 'rect') op.h *= 1.2;
        }
        const H = Math.ceil((layout.h + 40) * (spec.scenario === 'claim' ? 1.2 : 1));
        const cv = util.el('canvas', '', parent);
        cv.dataset.role = 'document-image';
        cv.setAttribute('role', 'img');
        cv.setAttribute('aria-label', 'Scanned source document. Use the viewer controls to magnify.');
        // Deliberately no title, fallback text, alt transcription, data attributes or DOM copy of the source.
        cv.width = W * 2; cv.height = H * 2;
        const c = cv.getContext('2d');
        c.scale(2, 2);
        const bg = c.createLinearGradient(0, 0, W, H);
        bg.addColorStop(0, receipt ? '#f6f2e6' : '#fbfaf5'); bg.addColorStop(0.55, '#f2f0e9'); bg.addColorStop(1, '#dedbd2');
        c.fillStyle = bg; c.fillRect(0, 0, W, H);
        c.save(); c.translate(W/2, H/2); c.rotate(r.float(-0.006, 0.006)); c.translate(-W/2, -H/2 + 8);
        c.textBaseline = 'top';
        c.filter = `blur(${spec.level === 'easy' ? 0.06 : 0.16}px)`;
        const hands = spec.scenario === 'claim' ? d.rows.map((row) => row.value) : d.kind === 'scan' ? d.rows.filter((row) => row.hand).map((row) => row.value) : [];
        for (const op of layout.ops) {
          if (op.k === 'text') {
            const handwritten = hands.includes(op.text);
            c.font = handwritten ? `italic 24px "Comic Sans MS", "Segoe Print", cursive` : spec.scenario === 'claim' ? op.font.replace(/((?:bold|300)?\s*\d+(?:\.\d+)?px)\s+.+$/, '$1 Georgia') : op.font;
            c.fillStyle = handwritten ? '#273b68' : op.color;
            c.textAlign = op.align || 'left';
            // Generic payment network in the scanned copy of legacy invoices.
            const value = String(op.text).replace(/VISA|MASTERCARD|AMEX|Visa|Mastercard/g, 'CARD');
            if (handwritten) {
              let x = op.align === 'right' ? op.x - c.measureText(value).width : op.x;
              for (let i = 0; i < value.length; i++) {
                const ch = value[i], phase = i * 1.73 + op.y * .13;
                c.save(); c.translate(x, op.y + Math.sin(phase) * 1.35); c.rotate(Math.sin(phase * .71) * .035);
                c.textAlign = 'left'; c.fillText(ch, 0, 0); c.restore();
                x += c.measureText(ch).width * .96;
              }
              c.save(); c.strokeStyle = '#34466b88'; c.lineWidth = .8; c.beginPath(); c.moveTo(49, op.y + 29); c.lineTo(W - 38, op.y + 29); c.stroke(); c.restore();
            } else c.fillText(value, op.x, op.y);
          } else if (op.k === 'line') {
            c.strokeStyle = op.color; c.lineWidth = op.w; c.setLineDash(op.dashed ? [5,4] : []);
            c.beginPath(); c.moveTo(op.x1, op.y); c.lineTo(op.x2, op.y); c.stroke(); c.setLineDash([]);
          } else if (op.k === 'rect') { c.fillStyle = op.color; c.fillRect(op.x, op.y, op.w, op.h); }
        }
        c.filter = 'none';
        if (d.style === 'idcard') {
          // A deliberately schematic portrait and security guilloche, not a real person's photograph.
          c.fillStyle = '#d4dcd6'; c.fillRect(W-142, 104, 94, 102);
          c.fillStyle = '#82938c'; c.beginPath(); c.ellipse(W-95, 136, 18, 23, 0, 0, 7); c.fill();
          c.beginPath(); c.ellipse(W-95, 199, 37, 38, 0, 0, 7); c.fill();
          c.strokeStyle = '#54756625';
          for (let i=0;i<18;i++) { c.beginPath(); c.ellipse(W/2, H/2, 190+i*6, 55+i*3, 0.3, 0, 7); c.stroke(); }
        }
        const stamp = d.stamp || 'DIGITAL COPY';
        c.save(); c.translate(W-208, H-77); c.rotate(-0.09); c.font = 'bold 23px sans-serif';
        c.strokeStyle = '#9b463d99'; c.fillStyle = '#9b463d99'; c.lineWidth = 2;
        const sw = c.measureText(stamp).width; c.strokeRect(-8, -6, sw+16, 38); c.fillText(stamp, 0, 0); c.restore();
        c.restore();
        // Fold shading, edge shadows and low-density dust never erase the dark text.
        const fold = c.createLinearGradient(W*.48, 0, W*.55, 0);
        fold.addColorStop(0, '#0000'); fold.addColorStop(.45, '#463a2020'); fold.addColorStop(.53, '#ffffff55'); fold.addColorStop(1, '#0000');
        c.fillStyle = fold; c.fillRect(0, 0, W, H);
        const edge = c.createLinearGradient(0, 0, 22, 0); edge.addColorStop(0, '#332c2224'); edge.addColorStop(1, '#0000');
        c.fillStyle = edge; c.fillRect(0, 0, 22, H);
        if (spec.scenario === 'claim') {
          for (const fy of [H * .34, H * .68]) {
            const crease = c.createLinearGradient(0, fy - 4, 0, fy + 5);
            crease.addColorStop(0, '#0000'); crease.addColorStop(.45, '#4b44350d'); crease.addColorStop(.62, '#ffffff24'); crease.addColorStop(1, '#0000');
            c.fillStyle = crease; c.fillRect(0, fy - 4, W, 9);
            c.strokeStyle = '#6c65500b'; c.lineWidth = 1; c.beginPath(); c.moveTo(0, fy + 1); c.lineTo(W, fy - 1); c.stroke();
          }
        }
        for (let i=0;i<W*H/260;i++) {
          c.fillStyle = `rgba(50,43,32,${r.float(.025,.13)})`;
          c.fillRect(r.float(0,W), r.float(0,H), r.float(.3,1.5), r.float(.3,1.1));
        }
        const pos = {};
        for (const f of spec.fields) {
          if (f.src === null) continue;
          const ops = layout.ops.filter((op) => op.k === 'text' && typeof f.src === 'string' && String(op.text).includes(f.src));
          pos[f.id] = ops.length && !f.computed ? Math.max(...ops.map((op) => op.y + F*1.8)) : H;
        }
        return { cv, W, H, pos };
      },
    },
  },
});
