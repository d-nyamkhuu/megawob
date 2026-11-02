// Design on templates/fill-form/base.js: the base site's fill-form widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-claim-01',
  name: 'design',
  split: 'train',
  scenarios: ['claim'],
  template: 'fill-form/base',
  design: {
    parts: {
      'textField': (base, S) => function textField(util, wrap, f, value) {
        const { icon, setField } = S;
        const box = util.el('div', 'ff-inwrap', wrap);
        const input = util.el('input', 'ff-input', box);
        input.type = 'text';
        input.id = `ff-${f.id}`;
        input.name = f.id;
        input.autocomplete = 'off';
        input.spellcheck = false;
        input.placeholder = f.placeholder || '';
        if(f.kind === 'date') {
          box.classList.add('ff-date-input');
          const calendar=util.el('span','ff-date-calendar',box);
          calendar.setAttribute('aria-hidden','true');
          calendar.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="1"/><path d="M3 9h18M7 1v6M17 1v6"/></svg>';
        }
        input.value = value || '';
        input.dataset.role = 'field';
        const clear = util.el('div', 'ff-clear', box);
        icon(util,clear,'close');
        clear.dataset.role = 'clear';
        clear.title = 'Clear';
        const sync = () => box.classList.toggle('filled', input.value.length > 0);
        sync();
        input.addEventListener('input', () => {
          sync();
          setField(f.id, input.value, null);
        });
        clear.addEventListener('click', () => {
          input.value = '';
          sync();
          setField(f.id, '', null);
        });
        return { input, clear };
      },
      '+0.paintClaimNotice': (base, S) => function paintClaimNotice(c, d, W, H) {
        c.save(); c.scale(W / 660, H / 830);
        const paper = c.createLinearGradient(0, 0, 660, 830);
        paper.addColorStop(0, '#eceef1'); paper.addColorStop(.5, '#f1f2f5'); paper.addColorStop(1, '#e7e9ee');
        c.fillStyle=paper; c.fillRect(0,0,660,830);
        for(let i=0;i<90000;i++) {
          const x=((Math.sin(i*12.9898)*43758.5453)%1+1)%1*660;
          const y=((Math.sin(i*78.233)*16341.37)%1+1)%1*830;
          c.fillStyle=i%2 ? '#1b274307' : '#ffffff60'; c.fillRect(x,y,1.3,1.1);
        }
        c.fillStyle='#858783';c.fillRect(0,0,660,7);
        const edge=c.createLinearGradient(0,0,9,0);edge.addColorStop(0,'#686b6a40');edge.addColorStop(1,'#686b6a00');
        c.fillStyle=edge;c.fillRect(0,0,9,830);
        c.strokeStyle='#c8c9cc';c.lineWidth=1;c.strokeRect(.5,.5,659,829);
        c.textBaseline='alphabetic';c.textAlign='left';
        const print=(text,x,y,size=16,bold=false)=>{
          c.fillStyle='#11151c';c.font=`${bold?'bold ':''}${size}px Arial, sans-serif`;c.fillText(String(text),x,y);
        };
        const line=(x,y,to=612)=>{c.strokeStyle='#646974';c.lineWidth=.9;c.beginPath();c.moveTo(x,y);c.lineTo(to,y+.4);c.stroke();};
        // Open pen strokes keep the handwritten entries distinct from the printed form.
        const pen={
          a:'M9 8Q5 5 2 10Q-1 16 3 16Q7 16 9 8L7 16L11 15',
          b:'M1 16L6 0M3 11Q8 5 10 9Q12 13 7 16Q3 18 2 14',
          c:'M10 8Q6 5 2 10Q-1 15 3 16Q6 17 9 14',
          d:'M9 8Q5 5 2 10Q-1 16 3 16Q6 17 9 9L12 0M9 9L7 16L11 15',
          e:'M1 12Q10 13 9 8Q6 5 2 10Q-1 15 3 16Q7 17 10 14',
          f:'M1 22L7 2Q9 -2 12 1M1 8L11 7',
          g:'M10 8Q6 5 2 10Q-1 15 3 16Q7 17 10 8L6 23Q4 27 0 24',
          h:'M1 16L6 0M3 10Q10 4 10 9L8 16L12 15',
          i:'M4 8L2 15Q2 17 7 15M5 3L5.3 2.5',
          j:'M6 8L2 24Q0 27 -3 24M7 3L7.3 2.5',
          k:'M1 16L6 0M3 12L11 7M5 11L10 16',
          l:'M3 16Q1 17 2 13L6 0',
          m:'M1 16L4 7L3 12Q8 4 9 8L7 16M8 12Q14 4 15 8L13 16L17 15',
          n:'M1 16L4 7L3 12Q10 4 11 8L9 16L13 15',
          o:'M8 7Q3 6 1 12Q-1 17 4 16Q9 16 10 11Q11 7 7 7',
          p:'M0 24L5 7M4 10Q9 5 11 9Q12 13 7 16Q3 18 3 14',
          q:'M10 8Q6 5 2 10Q-1 16 3 16Q7 17 10 8L6 24',
          r:'M1 16L4 7L3 12Q7 5 11 8',
          s:'M10 8Q6 5 3 8Q1 10 6 12Q10 14 6 16Q2 18 0 15',
          t:'M6 2L2 14Q1 18 7 15M0 8L10 7',
          u:'M3 7L1 13Q-1 19 5 15L10 7L8 15Q8 17 12 15',
          v:'M1 7L3 16Q8 13 11 7',
          w:'M1 7L2 16L9 9L8 16Q13 14 16 7',
          x:'M1 8L9 16M10 7L0 17',
          y:'M3 7L1 13Q-1 18 5 15L10 7L5 23Q2 28 -1 24',
          z:'M1 8L11 7L0 16L10 15',
          A:'M0 16L10 0L12 16M3 11L11 10',B:'M1 16L5 0Q16 -1 13 5Q11 8 4 8Q17 6 13 13Q10 17 1 16',
          C:'M14 2Q9 -2 4 4Q-2 11 2 15Q6 19 12 13',D:'M0 16L5 0M4 0Q19 -1 13 10Q10 17 0 16',
          E:'M14 0L5 1L1 16L12 15M3 9L11 8',F:'M1 16L5 1L15 0M3 9L12 8',
          G:'M14 2Q8 -2 3 5Q-2 12 3 16Q8 19 13 10L7 10',H:'M1 16L5 0M11 16L15 0M3 9L13 8',
          I:'M1 1L11 0M7 1L3 16M-1 17L9 16',J:'M4 1L14 0M11 1L7 13Q4 21 -1 15',
          K:'M1 16L5 0M15 0L3 10L12 17',L:'M5 0L1 16L13 15',M:'M0 16L5 0L8 11L17 0L14 16',
          N:'M0 16L5 0L11 16L16 0',O:'M11 0Q4 -1 1 8Q-2 17 5 17Q13 17 15 7Q17 -1 10 0',
          P:'M1 17L5 1Q17 -1 14 6Q12 10 3 9',Q:'M11 0Q4 -1 1 8Q-2 17 5 17Q13 17 15 7Q17 -1 10 0M7 13L14 20',
          R:'M1 17L5 1Q17 -1 14 6Q12 10 3 9M7 9L13 17',S:'M14 2Q8 -2 4 3Q1 7 8 9Q16 12 9 16Q3 20 0 14',
          T:'M0 1L18 0M9 1L5 17',U:'M4 0L1 11Q-1 19 6 16Q12 15 16 0',V:'M2 0L4 17L17 0',
          W:'M2 0L2 17L11 5L11 17L22 0',X:'M2 0L13 17M16 0L0 17',Y:'M1 0L7 9L15 0M7 9L4 17',Z:'M2 1L16 0L0 17L13 16',
          '0':'M8 0Q3 1 1 9Q-1 18 5 16Q11 15 12 7Q14 -1 8 0','1':'M2 5L9 0L5 17',
          '2':'M2 4Q7 -3 11 2Q15 7 0 17L12 16','3':'M2 2Q14 -4 11 4L6 8Q16 7 10 14Q5 20 0 15',
          '4':'M11 0L0 11L13 10M10 4L7 17','5':'M14 0L5 1L2 8Q13 4 11 12Q8 20 0 15',
          '6':'M13 0Q4 0 1 11Q-1 19 6 16Q13 13 9 8Q5 5 1 11','7':'M0 1L14 0L3 17M4 8L12 8',
          '8':'M7 0Q0 2 5 8Q14 12 7 16Q0 20 0 13Q0 10 8 7Q16 0 7 0','9':'M11 7Q4 12 2 7Q0 1 8 0Q16 -1 10 11L6 17',
          '-':'M1 10L10 9','.':'M3 16L3.5 15.5',',':'M4 16L2 20','/':'M0 20L12 -1',
          '(':'M9 0Q0 8 3 20',')':'M4 0Q10 8 0 20','@':'M13 8Q7 4 4 11Q1 18 8 15L12 7L11 15Q19 17 19 8Q20 -2 9 0Q-3 2 -2 15Q-1 24 14 21',
          '$':'M13 3Q8 -1 3 4Q0 8 7 10Q14 12 8 17Q2 20 0 15M10 -3L4 22',':':'M4 7L4.3 6.7M2 16L2.3 15.7'
        };
        const narrow=new Set(['i','j','l','t','f','.',',',':']);
        const wide=new Set(['m','w','M','W','@']);
        const hand=(text,x,y,max=420,size=25)=>{
          const chars=Array.from(String(text)), unit=size/21;
          const width=ch=>ch===' '?8:narrow.has(ch)?8:wide.has(ch)?20:/[A-Z]/.test(ch)?17:14;
          const fit=Math.min(1,max/(chars.reduce((a,ch)=>a+width(ch),0)*unit));
          c.save();c.translate(x,y-20*unit);c.scale(unit*fit,unit);c.transform(1,0,-.17,1,3.4,0);
          c.strokeStyle='#233e6d';c.fillStyle='#233e6d';c.lineWidth=1.15;c.lineCap='round';c.lineJoin='round';
          chars.forEach((ch,i)=>{
            c.save();c.translate(0,Math.sin(i*1.9)*.45);c.rotate(Math.sin(i*1.3)*.025);
            if(pen[ch])c.stroke(new Path2D(pen[ch]));
            else if(ch!==' '){c.font='italic 21px cursive';c.fillText(ch,0,17);}
            c.restore();c.translate(width(ch),0);
          });c.restore();
        };
        // A small mountain mark and the issuer occupy the letterhead's left column.
        c.fillStyle='#67717e';c.beginPath();c.moveTo(34,87);c.lineTo(61,61);c.lineTo(81,88);c.closePath();c.fill();
        c.fillStyle='#11151b';c.beginPath();c.moveTo(56,88);c.lineTo(74,70);c.lineTo(91,89);c.closePath();c.fill();
        c.strokeStyle='#f7f7f8';c.lineWidth=2;c.beginPath();c.moveTo(46,79);c.lineTo(55,76);c.lineTo(60,69);c.stroke();
        c.fillStyle='#080b12';c.font='bold 28px Georgia, serif';
        const issuer=String(d.issuer);const issuerSize=Math.min(28,300/c.measureText(issuer).width*28);
        c.font=`bold ${issuerSize}px Georgia, serif`;c.fillText(issuer,93,89);
        print(d.issuer,94,112,13);print('Property insurance services',94,128,12);print('Claims department',94,143,12);
        print('Property Claim',453,105,21,true);print('Loss Notice',453,131,20);
        const section=(text,y)=>{line(43,y);print(text,43,y+22,16,true);line(43,y+33);};
        const rows=d.rows || [];
        const isContact=row=>/phone|email|contact/i.test(row.id+' '+row.label);
        const isAmount=row=>/estimat|amount|total/i.test(row.id+' '+row.label);
        const isInsured=row=>/policy|name|claim.*ref/i.test(row.id+' '+row.label) && !isContact(row);
        const insured=rows.filter(isInsured);
        insured.sort((a,b)=>(/name/i.test(a.label)?0:/policy/i.test(a.label)?1:2)-(/name/i.test(b.label)?0:/policy/i.test(b.label)?1:2));
        const incident=rows.filter(row=>!isInsured(row)&&!isContact(row)&&!isAmount(row));
        const contacts=rows.filter(isContact), amounts=rows.filter(isAmount);
        section('INSURED DETAILS',179);
        const insuredStep=Math.min(40,151/Math.max(1,insured.length));
        insured.forEach((row,i)=>{const y=246+i*insuredStep;print(row.label+':',43,y,16);line(177,y+6);hand(row.value,188,y+2,418);});
        const incidentTop=Math.max(384,253+insured.length*insuredStep);
        section('INCIDENT DETAILS',incidentTop);
        const incidentStep=Math.min(44,(650-incidentTop-50)/Math.max(1,incident.length));
        incident.forEach((row,i)=>{
          const y=incidentTop+67+i*incidentStep;
          const description=/cause|description/i.test(row.id+' '+row.label);
          const long=description || String(row.value).length>35;
          print(row.label+':',43,y,16);
          if(long){line(43,y+31);hand(row.value,60,y+26,545,23);if(description && incident.length<=3){line(43,y+65);line(43,y+99);}}
          else{line(172,y+6);hand(row.value,184,y+2,421,25);}
        });
        amounts.forEach((row,i)=>{const y=703+i*34;print(row.label+':',43,y,16);line(238,y+6,430);hand(row.value,254,y+2,180,27);});
        contacts.forEach((row,i)=>{const y=753+i*30;print(row.label+':',43,y,14);line(172,y+5);hand(row.value,184,y+1,423,23);});
        if(!contacts.length){print(d.note || '',43,794,11);}
        c.restore();
      },
      'scanBitmap': (base, S) => function scanBitmap(ctx, parent) {
        const { DOC_FONTS, docBlocks, layoutDoc, paintClaimNotice } = S;
        const { util, spec } = ctx;
        const r = ctx.rng.fork('scan-paper');
        const d = spec.doc;
        const W = 660;
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
        const H = layout.h + 40;
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
        const hands = d.kind === 'scan' ? d.rows.filter((row) => row.hand).map((row) => row.value) : [];
        for (const op of layout.ops) {
          if (op.k === 'text') {
            c.font = hands.includes(op.text) ? `italic 24px "URW Bookman", cursive` : op.font;
            c.fillStyle = hands.includes(op.text) ? '#334d75' : op.color;
            c.textAlign = op.align || 'left';
            // Generic payment network in the scanned copy of legacy invoices.
            c.fillText(String(op.text).replace(/VISA|MASTERCARD|AMEX|Visa|Mastercard/g, 'CARD'), op.x, op.y);
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
        for (let i=0;i<W*H/260;i++) {
          c.fillStyle = `rgba(50,43,32,${r.float(.025,.13)})`;
          c.fillRect(r.float(0,W), r.float(0,H), r.float(.3,1.5), r.float(.3,1.1));
        }
        if (d.kind === 'scan' && d.style === 'claim') paintClaimNotice(c, d, W, H);
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
