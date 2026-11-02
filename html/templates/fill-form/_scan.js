/* fill-form/_scan: reference builders. scope is the live unit scope; reference.js retains all design hooks. */
(function () {
  'use strict';
function scanBitmap(scope, ctx, parent) {
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
        } else blocks = scope.docBlocks(d);
        const F = d.kind === 'scan' ? 22 : 21;
        const layout = scope.layoutDoc(probe, blocks, W, F, receipt ? scope.DOC_FONTS.mono : scope.DOC_FONTS.sans, '#3a5261');
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
        const pos = {};
        for (const f of spec.fields) {
          if (f.src === null) continue;
          const ops = layout.ops.filter((op) => op.k === 'text' && typeof f.src === 'string' && String(op.text).includes(f.src));
          pos[f.id] = ops.length && !f.computed ? Math.max(...ops.map((op) => op.y + F*1.8)) : H;
        }
        return { cv, W, H, pos };
      }

function renderScan(scope, ctx) {
        scope.ensureStyle();
        ctx.css('ff-scan-style', scope.SCAN_CSS);
        const { util, spec } = ctx;
        scope.st = { ctx, spec, el:{}, tabs:null, extra:{} };
        const shell=scope.workspace(ctx,true), root=shell.root;
        const main = util.el('div', 'ff-scan-main', shell.center);
        const viewer = util.el('section', 'ff-scan-view', main);
        viewer.dataset.role = 'document';
        const filebar=util.el('div','ff-scan-filebar',viewer);
        scope.icon(util,filebar,'file');
        util.el('span','ff-scan-filename',filebar,spec.layout.pdf ? spec.layout.pdf.file : 'source_scan.tif');
        util.el('span','ff-chip',filebar,'Original');
        const toolbar = util.el('div', 'ff-scan-toolbar', viewer);
        const pageLabel=util.el('span','ff-scan-filename',toolbar,'Page 1 / 1');
        scope.iconButton(util,toolbar,'hand','Hand tool').setAttribute('aria-pressed','true');
        const minus = scope.iconButton(util,toolbar,'minus','Zoom out');
        const zoomText = util.el('span','ff-scan-zoom',toolbar);
        const plus = scope.iconButton(util,toolbar,'plus','Zoom in');
        const fit = scope.iconButton(util,toolbar,'fit','Fit page width');
        scope.iconButton(util,toolbar,'more','Document actions').addEventListener('click',()=>shell.show('Original attachment',[
          'Original scan retained in the document archive.','1 page / scanned copy','Version history: original upload; no replacements.']));
        const well = util.el('div', 'ff-scan-well', viewer);
        const pages=util.el('div','ff-page-strip',well);
        scope.icon(util,pages,'grid');
        const pane = util.el('div', 'ff-scan-scroll', well);
        const sheet = util.el('div','ff-scan-sheet',pane);
        const rail = util.el('div','ff-scan-rail',well); const thumb = util.el('div','ff-scan-thumb',rail);
        const bitmap = scope.scanBitmap(ctx, sheet);
        const thumbnail=util.el('canvas','',pages);thumbnail.width=48;thumbnail.height=68;
        thumbnail.setAttribute('aria-hidden','true');
        thumbnail.getContext('2d').drawImage(bitmap.cv,0,0,48,68);
        thumbnail.addEventListener('click',()=>{pane.scrollTop=0;pane.scrollLeft=0;mirror();});
        util.el('small','',pages,'1');
        util.el('div','ff-scan-source-foot',viewer,'Original attachment / Color / Read-only');
        const entry = util.el('section','ff-scan-entry',main);
        const entryHead = util.el('div','ff-scan-entry-head',entry);
        util.el('h2','',entryHead,spec.formTitle);
        util.el('p','',entryHead,'Record fields / Manual verification');
        const fieldsPane = util.el('div','ff-scan-fields',entry);
        fieldsPane.dataset.role = 'form';
        const grid = util.el('div','ff-grid',fieldsPane);
        const groups=new Map();
        for(const f of spec.fields) { const name=scope.sectionOf(f); if(!groups.has(name)) groups.set(name,[]); groups.get(name).push(f); }
        for(const [name,fields] of groups) {
          const label=util.el('div','ff-section',grid);scope.icon(util,label,'file');util.el('span','',label,name);
          for(const f of fields) scope.addField(util,grid,f,ctx.model.fields[f.id]);
        }
        const entryFoot = util.el('div','ff-scan-entry-foot',entry);
        const count = util.el('span','',entryFoot);
        util.el('span','',entryFoot,'Draft / Not exported');
        shell.right.textContent='Draft changes saved';
        let zoom = Math.max(.72, (pane.clientWidth-28)/bitmap.W);
        const thumbY = () => {
          const max = Math.max(0, pane.scrollHeight-pane.clientHeight);
          const h = Math.max(24, rail.clientHeight * pane.clientHeight / Math.max(1,pane.scrollHeight));
          thumb.style.height = `${h}px`;
          thumb.style.top = `${max ? pane.scrollTop/max*(rail.clientHeight-h) : 0}px`;
          return { max, h };
        };
        const mirror = () => {
          if (!root.isConnected) return;
          const { max } = thumbY();
          const old = ctx.model.pdf || {};
          const pos = Object.fromEntries(Object.entries(bitmap.pos).map(([id,y]) => [id, Math.min(pane.scrollHeight, y*zoom+14)]));
          const pdf = { top:Math.round(pane.scrollTop), view:pane.clientHeight, max, pos,
            seen:Math.max(old.seen || 0, Math.round(pane.scrollTop)+pane.clientHeight) };
          if (JSON.stringify(old) !== JSON.stringify(pdf)) ctx.patch({ pdf });
        };
        const mirrorForm = () => {
          if (!root.isConnected) return;
          const top = Math.round(fieldsPane.scrollTop);
          const pr = fieldsPane.getBoundingClientRect();
          const pos = {};
          for (const f of spec.fields) {
            const fr = scope.st.el[f.id].wrap.getBoundingClientRect();
            pos[f.id] = [Math.round(fr.top-pr.top+top), Math.round(fr.bottom-pr.top+top)];
          }
          const next = { top, view:fieldsPane.clientHeight, max:fieldsPane.scrollHeight-fieldsPane.clientHeight, pos };
          if (JSON.stringify(ctx.model.scanForm) !== JSON.stringify(next)) ctx.patch({ scanForm:next });
        };
        const resize = () => {
          bitmap.cv.style.width = `${bitmap.W*zoom}px`; bitmap.cv.style.height = `${bitmap.H*zoom}px`;
          zoomText.textContent = `${Math.round(zoom*100)}%`;
          // A zoom changes document coordinates; restart the seen coverage in the new coordinate space.
          ctx.patch({ pdf:{ ...(ctx.model.pdf || {}), seen:0 } }); mirror();
        };
        plus.addEventListener('click',() => { zoom=Math.min(2,zoom+.2); resize(); });
        minus.addEventListener('click',() => { zoom=Math.max(.5,zoom-.2); resize(); });
        fit.addEventListener('click',() => { zoom=(pane.clientWidth-28)/bitmap.W; resize(); });
        scope.env.ui.scrollPane(pane,{ thumb, track:rail, travel:() => rail.clientHeight-thumbY().h, onScroll:mirror });
        scope.env.ui.scrollPane(fieldsPane,{ onScroll:mirrorForm });
        pane.addEventListener('scroll',mirror); fieldsPane.addEventListener('scroll',mirrorForm);
        let pan;
        bitmap.cv.addEventListener('pointerdown',(e) => {
          if(e.button !== 0) return;
          pan={x:e.clientX,y:e.clientY,left:pane.scrollLeft,top:pane.scrollTop};
          bitmap.cv.setPointerCapture(e.pointerId); bitmap.cv.style.cursor='grabbing'; e.preventDefault();
        });
        bitmap.cv.addEventListener('pointermove',(e) => {
          if(!pan) return;
          pane.scrollLeft=pan.left+pan.x-e.clientX; pane.scrollTop=pan.top+pan.y-e.clientY; mirror();
        });
        const release=() => { pan=null; bitmap.cv.style.cursor='grab'; };
        bitmap.cv.addEventListener('pointerup',release); bitmap.cv.addEventListener('pointercancel',release);
        const sync = (model) => {
          let filled=0;
          for(const f of spec.fields) {
            const el=scope.st.el[f.id], v=model.fields[f.id];
            if(v !== '' && v !== false && v != null) filled++;
            if(el.input) { if(el.input.value !== String(v || '')) el.input.value=String(v || ''); el.input.parentElement.classList.toggle('filled',!!v); }
            else if(f.kind === 'dropdown') {
              el.w.set({ value:v || null, open:model.open === f.id });
              const label=el.btn.querySelector('.ff-ddval'); label.textContent=v || 'Select…'; label.classList.toggle('empty',!v);
              for(const [label,o] of Object.entries(el.opts)) o.classList.toggle('sel',label === v);
            }
            else if(el.w) el.w.set(f.kind === 'checkbox' ? (v ? [f.id] : []) : v || null);
          }
          count.textContent=`${filled} / ${spec.fields.length} fields entered`;
        };
        scope.st.scanCount = () => { count.textContent=`${spec.fields.filter((f) => !!ctx.model.fields[f.id]).length} / ${spec.fields.length} fields entered`; };
        if (spec.keys !== undefined) scope.mirrorFocus(root);
        resize(); mirrorForm(); sync(ctx.model);
        scope.st.extra = {
          scanForm:() => util.center(fieldsPane), pdfPane:() => util.center(pane), pdfThumb:() => util.center(thumb),
          pdfTo:(t) => { const q=rail.getBoundingClientRect(), {max,h}=thumbY(); return [q.left+q.width/2,q.top+h/2+(max ? Math.max(0,Math.min(max,t.pdfTo))/max*(q.height-h) : 0)]; },
        };
        return { anchors:[root,viewer,entry], sync };
      }


  env.template('fill-form/_scan', () => ({ scanBitmap, renderScan }));
})();
