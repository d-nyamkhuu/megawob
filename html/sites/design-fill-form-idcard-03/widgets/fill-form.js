// Design on templates/fill-form/base.js: the base site's fill-form widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-idcard-03',
  name: 'design',
  split: 'train',
  scenarios: ['idcard'],
  template: 'fill-form/base',
  design: {
    parts: {
      'workspace': (base, S) => function workspace(ctx, scan = false) {
        const { WORKSPACE_CSS, icon, iconButton, stageBox } = S;
        ctx.css('ff-workspace-style',WORKSPACE_CSS);
        const {util,spec}=ctx, box=stageBox(ctx), r=ctx.rng.fork('workspace');
        const root=util.el('div',`ff-workspace${scan ? ' ff-scan' : ''}${spec.layout.long ? ' long' : ''}`,box.host);
        const width=Math.max(240,Math.min(1420,box.width-20)), height=Math.max(260,box.height-20);
        root.style.width=`${width}px`; root.style.margin='10px';
        if(!spec.layout.long) root.style.height=`${height}px`;
        root.classList.toggle('wide',width>=1180);
        root.classList.toggle('compact',width>=860 && width<1180);
        const original=spec.base || spec.scenario;
        const group={card:['People operations','Contact records'],email:['Events','Registrations'],invoice:['Finance','Supplier invoices'],receipt:['Expenses','Card transactions'],idcard:['Onboarding','Identity documents'],claim:['Insurance','Claims intake']}[original] || ['Operations','Records'];
        const batch=`B-${r.int(3000,9999)}`, record=`DOC-${r.int(10000,99999)}`;
        const popup=util.el('div','ff-popover',root); popup.hidden=true;
        const show=(title,lines) => {
          popup.replaceChildren(); popup.hidden=false;
          iconButton(util,popup,'close','Close details').classList.add('ff-pop-close');
          popup.firstChild.addEventListener('click',()=>{popup.hidden=true;});
          util.el('h3','',popup,title);
          for(const line of lines) util.el('p','',popup,line);
          util.el('small','',popup,'Folio Capture / workspace activity');
        };
        const appbar=util.el('div','ff-appbar',root), brand=util.el('div','ff-product',appbar);
        icon(util,brand,'stack'); util.el('span','',brand,'Folio Capture');
        const nav=util.el('nav','ff-appnav',appbar);
        for(const label of ['Documents','Batches','Reports']) {
          const b=util.el('button',label==='Documents'?'active':'',nav,label); b.type='button';
          b.addEventListener('click',()=>show(label,label==='Batches' ? [`${batch} / ${group[1]}`, '18 documents received; 6 awaiting review.', 'Travel expenses / awaiting assignment'] : label==='Reports' ? ['Daily intake: 146 documents','Export pending: 12 records','Last successful export: 09:12'] : ['Current document is open in the review workspace.','Other records are available in the processing queue.']));
        }
        const tools=util.el('div','ff-app-tools',appbar);
        iconButton(util,tools,'search','Search documents').addEventListener('click',()=>show('Search documents',['Recent: supplier invoices','Recent: identity verification','Recent: property claims']));
        iconButton(util,tools,'bell','Notifications, 3 unread').addEventListener('click',()=>show('Notifications',['New batch received from the shared mailbox.','Export to ledger completed for yesterday\'s batch.','Two documents in Travel expenses need an owner.']));
        const owner=ctx.content.personName(r,{csplit:spec.csplit});
        util.el('span','ff-avatar',tools,`${owner.first[0]}${owner.last[0]}`);
        const context=util.el('div','ff-contextbar',root);
        util.el('span','',context,group[0]); icon(util,context,'chevron'); util.el('strong','',context,group[1]);
        icon(util,context,'chevron'); util.el('span','',context,batch);
        util.el('span','ff-chip',context,'In review');
        const body=util.el('div','ff-workbody',root), queue=util.el('aside','ff-queue',body);
        for(const [name,label,n] of [['inbox','My queue','18'],['flag','Needs review','6'],['check','Processed','124'],['folder','All documents','146']]) {
          const b=iconButton(util,queue,name,`${label}: ${n}`);
          util.el('span','ff-queue-label',b,`${label}   ${n}`);
          if(name==='inbox') b.setAttribute('aria-pressed','true');
          if(name==='flag') util.el('span','ff-queue-dot',b);
          b.addEventListener('click',()=>show(label,[`${n} documents in ${label.toLowerCase()}.`,`${batch} / ${group[1]}`, 'The current record remains assigned to you.']));
        }
        util.el('div','ff-queue-rule',queue); util.el('div','ff-queue-summary',queue,'This batch / 8 records');
        const list=util.el('div','ff-queue-list',queue);
        const heading=util.el('div','ff-queue-heading',list);
        for(const title of ['#','Name','ID No.','Modified']) util.el('span','',heading,title);
        const current=util.el('div','ff-queue-record active',list);
        util.el('span','ff-record-num',current,'001');util.el('strong','ff-record-name',current,'Current document');
        util.el('span','ff-record-id',current,`FD${record.slice(-7)}`);util.el('span','ff-record-date',current,'12 Jan 2018');
        const companies=ctx.content.sample(r,ctx.content.COMPANIES,7,{csplit:spec.csplit});
        companies.forEach((company,i)=>{
          const b=util.el('button','ff-queue-record',list); b.type='button';
          const pageCount=r.int(1,3);
          const dates=['03 Mar 2018','25 Apr 2018','19 May 2018','02 Jun 2018','18 Jul 2018','30 Aug 2018','14 Sep 2018'];
          util.el('span','ff-record-num',b,String(i+2).padStart(3,'0'));util.el('strong','ff-record-name',b,company);
          util.el('span','ff-record-id',b,`FD${String(Number(record.slice(-6))+i+1).padStart(6,'0')}`);
          util.el('span','ff-record-date',b,dates[i]);
          b.addEventListener('click',()=>show(company,['Neighboring record / assigned to another reviewer','Source: shared mailbox',i%3===0?'Exception: attachment quality needs review.':'No open exceptions for this record.']));
        });
        const center=util.el('div','ff-workcenter',body);
        if(width>=1300) {
          const panel=util.el('aside','ff-inspector',body);
          util.el('h4','',panel,'Document details');
          const dl=util.el('dl','',panel);
          for(const [label,value] of [['Record ID',record],['Batch',batch],['Source','Shared mailbox'],['Assigned to',`${owner.first} ${owner.last}`],['Priority','Normal'],['Retention','Standard / 7 years']]) {
            util.el('dt','',dl,label);util.el('dd','',dl,value);
          }
          const activity=util.el('div','ff-activity',panel);util.el('h4','',activity,'Activity');
          for(const [label,time] of [['Draft opened','09:24 / You'],['Assigned to reviewer','09:20 / Intake service'],['Document imported','09:18 / Shared mailbox']]) {
            const p=util.el('p','',activity,label); util.el('small','',p,time);
          }
        }
        const status=util.el('div','ff-work-status',root);
        const left=util.el('span','',status,`${record} / Draft record`);
        const right=util.el('span','',status,'All changes saved locally');
        const details=iconButton(util,tools,'info','Document details');
        details.addEventListener('click',()=>show('Document details',[`Record: ${record}`,`Batch: ${batch}`,`Assigned to ${owner.first} ${owner.last}`,'Source: shared mailbox / original attachment retained','Activity: Imported 09:18; assigned 09:20; opened 09:24.']));
        return {root,center,width,height,left,right,show};
      },
      'layoutDoc': (base, S) => function layoutDoc(c, blocks, W, F, fam, ink) {
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
            const rowLh = b.compact ? Math.round(size * 1.08) : lh(size);
            let rows = 1;
            for (const cell of b.cells) {
              const f = font(size, cell.bold);
              const x0 = pad + cell.from * inner;
              const x1 = pad + cell.to * inner;
              const lines = cell.align === 'right' ? [cell.text] : wrap(cell.text, f, x1 - x0 - 6);
              lines.forEach((line, i) => ops.push({ k: 'text', x: cell.align === 'right' ? x1 : x0, y: y + i * rowLh, text: line, font: f,
                color: cell.muted ? MUTED : TXT, align: cell.align || 'left' }));
              rows = Math.max(rows, lines.length);
            }
            y += rows * rowLh + Math.round(F * (b.compact ? 0.04 : 0.15));
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
      },
      'scanBitmap': (base, S) => function scanBitmap(ctx, parent) {
        const { DOC_FONTS, docBlocks, layoutDoc } = S;
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
          if (d.style === 'idcard') {
            // A landscape, one-card layout. Keep the source values in the bitmap and arrange the
            // generated labels in a compact data block beside the portrait.
            blocks.push({ t:'rule' });
            for (const row of d.rows) blocks.push({ t:'row', small:true, compact:true, cells:[
              { text:row.label, from:.32, to:.60, muted:true },
              { text:row.value, from:.61, to:1, bold:true },
            ] });
            blocks.push({ t:'rule' });
          } else {
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
          }
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
        bg.addColorStop(0, d.style === 'idcard' ? '#e4f0f2' : receipt ? '#f6f2e6' : '#fbfaf5');
        bg.addColorStop(0.55, d.style === 'idcard' ? '#f5f0e3' : '#f2f0e9'); bg.addColorStop(1, d.style === 'idcard' ? '#d5e5ec' : '#dedbd2');
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
          // A small scanned portrait treatment and pale security engraving, independent of field values.
          const px=42, py=Math.max(105,Math.round(H*.31)), pw=150, ph=Math.min(190,H-py-54);
          const photo=c.createLinearGradient(px,py,px+pw,py+ph); photo.addColorStop(0,'#b9c8cb');photo.addColorStop(1,'#75878c');
          c.fillStyle=photo;c.fillRect(px,py,pw,ph);
          c.save();c.beginPath();c.rect(px,py,pw,ph);c.clip();
          const shirt=c.createLinearGradient(px,py+ph*.66,px+pw,py+ph);shirt.addColorStop(0,'#263843');shirt.addColorStop(1,'#71828a');
          c.fillStyle=shirt;c.beginPath();c.moveTo(px+8,py+ph);c.quadraticCurveTo(px+14,py+ph*.65,px+pw*.5,py+ph*.67);c.quadraticCurveTo(px+pw-12,py+ph*.65,px+pw-5,py+ph);c.fill();
          const complexion=c.createLinearGradient(px+pw*.32,py+ph*.27,px+pw*.7,py+ph*.62);complexion.addColorStop(0,'#e0b49a');complexion.addColorStop(.55,'#c98f76');complexion.addColorStop(1,'#9d695d');
          c.fillStyle=complexion;c.beginPath();c.ellipse(px+pw*.51,py+ph*.38,pw*.22,ph*.25,0,0,Math.PI*2);c.fill();
          const hair=c.createLinearGradient(px+pw*.25,py,px+pw*.72,py+ph*.58);hair.addColorStop(0,'#171719');hair.addColorStop(.45,'#403633');hair.addColorStop(1,'#171719');
          c.fillStyle=hair;c.beginPath();c.ellipse(px+pw*.5,py+ph*.27,pw*.25,ph*.23,0,Math.PI,Math.PI*2);c.quadraticCurveTo(px+pw*.78,py+ph*.42,px+pw*.71,py+ph*.61);c.lineTo(px+pw*.65,py+ph*.36);c.quadraticCurveTo(px+pw*.5,py+ph*.32,px+pw*.32,py+ph*.36);c.lineTo(px+pw*.27,py+ph*.62);c.quadraticCurveTo(px+pw*.18,py+ph*.39,px+pw*.25,py+ph*.26);c.fill();
          c.strokeStyle='#493b37';c.lineWidth=2;c.beginPath();c.moveTo(px+pw*.35,py+ph*.4);c.quadraticCurveTo(px+pw*.41,py+ph*.38,px+pw*.47,py+ph*.4);c.moveTo(px+pw*.54,py+ph*.4);c.quadraticCurveTo(px+pw*.6,py+ph*.38,px+pw*.66,py+ph*.4);c.stroke();
          c.fillStyle='#393638';c.beginPath();c.ellipse(px+pw*.41,py+ph*.405,5,1.5,0,0,Math.PI*2);c.ellipse(px+pw*.59,py+ph*.405,5,1.5,0,0,Math.PI*2);c.fill();
          c.strokeStyle='#443532';c.lineWidth=2;c.beginPath();c.moveTo(px+pw*.34,py+ph*.38);c.lineTo(px+pw*.46,py+ph*.375);c.moveTo(px+pw*.54,py+ph*.375);c.lineTo(px+pw*.66,py+ph*.38);c.stroke();
          c.strokeStyle='#946d61';c.lineWidth=1.5;c.beginPath();c.moveTo(px+pw*.51,py+ph*.42);c.lineTo(px+pw*.49,py+ph*.49);c.lineTo(px+pw*.53,py+ph*.50);c.stroke();
          c.strokeStyle='#704c46';c.lineWidth=2;c.beginPath();c.moveTo(px+pw*.43,py+ph*.53);c.quadraticCurveTo(px+pw*.51,py+ph*.57,px+pw*.59,py+ph*.53);c.stroke();
          c.strokeStyle='#b6a59a40';c.lineWidth=1;for(let strand=0;strand<5;strand++){c.beginPath();c.moveTo(px+pw*(.28+strand*.025),py+ph*.27);c.quadraticCurveTo(px+pw*(.18+strand*.02),py+ph*.44,px+pw*(.26+strand*.015),py+ph*.64);c.stroke();}
          for(let grain=0;grain<180;grain++){c.fillStyle=`rgba(255,238,220,${r.float(.015,.08)})`;c.fillRect(px+r.float(0,pw),py+r.float(0,ph),.7,.7);}
          c.restore();c.strokeStyle='#fff9';c.lineWidth=2;c.strokeRect(px,py,pw,ph);
          c.strokeStyle='#537a8c20';
          for (let i=0;i<18;i++) { c.beginPath(); c.ellipse(W*.69, H*.53, 210+i*6, 65+i*3, 0.3, 0, 7); c.stroke(); }
        }
        if (d.style === 'idcard') {
          const first=d.rows.find(x=>/first|given/i.test(x.label)), last=d.rows.find(x=>/surname|last/i.test(x.label));
          const signature=[first&&first.value,last&&last.value].filter(Boolean).join(' ');
          c.font='italic 24px cursive';c.fillStyle='#25384a';c.fillText(signature,42,H-43);
          c.strokeStyle='#25384a';c.lineWidth=1.4;c.beginPath();c.moveTo(40,H-36);c.quadraticCurveTo(90,H-21,155,H-39);c.stroke();
        } else {
          const stamp = d.stamp || 'DIGITAL COPY';
          c.save(); c.translate(W-208, H-77); c.rotate(-0.09); c.font = 'bold 23px sans-serif';
          c.strokeStyle = '#9b463d99'; c.fillStyle = '#9b463d99'; c.lineWidth = 2;
          const sw = c.measureText(stamp).width; c.strokeRect(-8, -6, sw+16, 38); c.fillText(stamp, 0, 0); c.restore();
        }
        c.restore();
        // Fold shading, edge shadows and low-density dust never erase the dark text.
        if (d.style !== 'idcard') {
          const fold = c.createLinearGradient(W*.48, 0, W*.55, 0);
          fold.addColorStop(0, '#0000'); fold.addColorStop(.45, '#463a2020'); fold.addColorStop(.53, '#ffffff55'); fold.addColorStop(1, '#0000');
          c.fillStyle = fold; c.fillRect(0, 0, W, H);
        }
        const edge = c.createLinearGradient(0, 0, 22, 0); edge.addColorStop(0, '#332c2224'); edge.addColorStop(1, '#0000');
        c.fillStyle = edge; c.fillRect(0, 0, 22, H);
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
