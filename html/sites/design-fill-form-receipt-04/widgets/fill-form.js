// Design on templates/fill-form/base.js: the base site's fill-form widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'fill-form',
  site: 'design-fill-form-receipt-04',
  name: 'design',
  split: 'train',
  scenarios: ['receipt'],
  template: 'fill-form/base',
  design: {
    parts: {
      'ICONS': (base, S) => ({
        file:'M6 3h8l4 4v14H6z M14 3v5h4 M9 12h6 M9 16h6',
        inbox:'M4 4h16v15H4z M4 13h5l2 3h2l2-3h5',
        stack:'M4 7l8-4 8 4-8 4z M4 12l8 4 8-4 M4 17l8 4 8-4',
        search:'M16 16l5 5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
        bell:'M6 8a6 6 0 0 1 12 0v7l2 3H4l2-3z M10 21h4',
        history:'M4 5v5h5 M4 10a8 8 0 1 1 1 8 M12 7v6l4 2',
        check:'M5 12l4 4L19 6', close:'M6 6l12 12 M18 6L6 18',
        minus:'M5 12h14', plus:'M5 12h14 M12 5v14',
        fit:'M8 3H3v5 M16 3h5v5 M3 16v5h5 M21 16v5h-5',
        refresh:'M20 5v6h-6 M20 11a8 8 0 1 0-2 7',
        hand:'M8 13V6a2 2 0 0 1 4 0v6 M12 8a2 2 0 0 1 4 0v5 M16 10a2 2 0 0 1 4 0v7c0 4-3 5-6 5h-2c-3 0-4-2-6-5l-3-4a2 2 0 0 1 3-2l2 2',
        chevron:'M9 5l7 7-7 7', down:'M5 9l7 7 7-7',
        more:'M5 11v2 M12 11v2 M19 11v2',
        info:'M12 11v6 M12 7v1 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
        flag:'M5 22V3h14l-3 5 3 5H5', lock:'M6 10h12v11H6z M8 10V6a4 4 0 0 1 8 0v4',
        folder:'M3 6h7l2 3h9v12H3z', grid:'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
      }),
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
        const queueFilters=util.el('div','ff-queue-rule',queue);
        for(const [i,label] of ['All','Unprocessed','Processed'].entries()) {
          const b=util.el('button',i===0?'ff-filter active':'ff-filter',queueFilters,label);b.type='button';
          b.addEventListener('click',()=>show(label,['The current receipt remains open.','Related records are listed in the receipts queue.']));
        }
        util.el('div','ff-queue-summary',queue,'This batch / 8 records');
        const list=util.el('div','ff-queue-list',queue);
        const current=util.el('div','ff-queue-record active',list);
        util.el('strong','',current,'Current document'); util.el('small','',current,`${record} / In review`);
        const companies=ctx.content.sample(r,ctx.content.COMPANIES,7,{csplit:spec.csplit});
        const previewAmounts=ctx.rng.fork('visual/receipt-queue-amounts');
        const previewDates=ctx.rng.fork('visual/receipt-queue-dates');
        const month=previewDates.pick(['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']),year=previewDates.int(2023,2026);
        let dateIndex=0;const queueDate=()=>`${month} ${28-dateIndex++*2}, ${year}`;
        companies.forEach((company,i)=>{
          const b=util.el('button','ff-queue-record',list); b.type='button';
          const pageCount=r.int(1,3);
          b.title=`${pageCount} ${pageCount===1?'page':'pages'} / ${i%3===0?'Needs review':i%3===1?'Queued':'Processed'}`;
          util.el('strong','',b,company); util.el('small','',b,queueDate());
          util.el('span','ff-record-amount',b,'$'+previewAmounts.float(3,49).toFixed(2));
          b.addEventListener('click',()=>show(company,['Neighboring record / assigned to another reviewer','Source: shared mailbox',i%3===0?'Exception: attachment quality needs review.':'No open exceptions for this record.']));
        });
        const additionalCompanies=ctx.content.sample(ctx.rng.fork('visual/additional-receipts'),ctx.content.COMPANIES,12,{csplit:spec.csplit}).filter(name=>!companies.includes(name)).slice(0,2);
        for(const name of additionalCompanies) {
          const b=util.el('button','ff-queue-record',list);b.type='button';
          util.el('strong','',b,name);util.el('small','',b,queueDate());
          util.el('span','ff-record-amount',b,'$'+previewAmounts.float(3,49).toFixed(2));
          b.addEventListener('click',()=>show(name,['Related expense records / read-only.','The current receipt remains open for review.']));
        }
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
        const pos = {};
        for (const f of spec.fields) {
          if (f.src === null) continue;
          const ops = layout.ops.filter((op) => op.k === 'text' && typeof f.src === 'string' && String(op.text).includes(f.src));
          pos[f.id] = ops.length && !f.computed ? Math.max(...ops.map((op) => op.y + F*1.8)) : H;
        }
        // Present the same seeded source as narrow thermal paper on a grey scan bed.
        // Original content is preserved; reading coordinates follow the paper's top inset.
        if (receipt) {
          c.save(); c.setTransform(1,0,0,1,0,0);
          c.fillStyle='#999a99'; c.fillRect(0,0,cv.width,cv.height);
          for(let y=0;y<cv.height;y+=3) for(let x=0;x<cv.width;x+=3) {
            const raw=((x*73856093)^(y*19349663))>>>0;
            const n=Math.imul(raw^(raw>>>13),1274126177)>>>0;
            c.fillStyle=((n>>>16)&1)?'rgba(255,255,255,.035)':'rgba(0,0,0,.035)';
            c.fillRect(x,y,2,2);
          }
          const left=W*.205*2, paperWidth=W*.59*2;
          c.shadowColor='#20202060'; c.shadowBlur=12; c.shadowOffsetX=-3; c.shadowOffsetY=3;
          c.fillStyle='#ecebea';
          c.beginPath(); c.moveTo(left,28);
          for(let x=0;x<=paperWidth;x+=10)c.lineTo(left+x,28+(Math.floor(x/10)%2)*5);
          c.lineTo(left+paperWidth,cv.height-20);
          for(let x=paperWidth;x>=0;x-=10)c.lineTo(left+x,cv.height-20-(Math.floor(x/10)%2)*5);
          c.closePath();c.fill();c.shadowColor='transparent';c.clip();
          c.scale(2,2);
          const paperLeft=left/2, paperW=paperWidth/2;
          c.fillStyle='#e9e8e4';c.fillRect(paperLeft,0,paperW,H);
          const grain=(x,y)=>{const n=Math.imul((Math.imul(x,73856093)^Math.imul(y,19349663))>>>0,1274126177)>>>0;return (n^(n>>>13))>>>0;};
          const softNoise=(x,y,size)=>{
            const ix=Math.floor(x/size),iy=Math.floor(y/size),fx=x/size-ix,fy=y/size-iy;
            const sx=fx*fx*(3-2*fx),sy=fy*fy*(3-2*fy),v=(a,b)=>grain(a,b)/4294967295;
            const a=v(ix,iy)*(1-sx)+v(ix+1,iy)*sx,b=v(ix,iy+1)*(1-sx)+v(ix+1,iy+1)*sx;
            return a*(1-sy)+b*sy;
          };
          const paperHeight=(x,y)=>softNoise(x,y,64)*.65+softNoise(x+45,y-12,24)*.35;
          c.globalAlpha=.6;
          for(let y=0;y<H;y+=3)for(let x=0;x<paperW;x+=3){
            const dx=paperHeight(x+2,y)-paperHeight(x-2,y),dy=paperHeight(x,y+2)-paperHeight(x,y-2);
            const shade=Math.max(210,Math.min(250,233+(dx*1.2+dy*.7)*190));
            c.fillStyle=`rgb(${shade},${shade-1},${shade-4})`;c.fillRect(paperLeft+x,y,3,3);
          }
          c.globalAlpha=1;
          // Quiet scan grain and broad creases, with no additional random draws.
          for(let y=0;y<H;y+=2) {
            const light=(Math.sin(y*.071)+Math.sin(y*.019))*.012;
            c.fillStyle=light>0?'rgba(255,255,255,'+light+')':'rgba(35,32,27,'+(-light)+')';
            c.fillRect(paperLeft,y,paperW,2);
          }
          const crease=c.createLinearGradient(paperLeft,0,paperLeft+paperW,0);
          crease.addColorStop(0,'#24201808');crease.addColorStop(.4,'#ffffff08');
          crease.addColorStop(.61,'#665a4104');crease.addColorStop(.66,'#ffffff0c');crease.addColorStop(1,'#00000004');
          c.fillStyle=crease;c.fillRect(paperLeft,0,paperW,H);
          for(let y=0;y<H;y+=3)for(let x=0;x<paperW;x+=3){
            const raw=((x*73856093)^(y*19349663))>>>0;
            const n=Math.imul(raw^(raw>>>13),1274126177)>>>0;
            c.fillStyle=((n>>>16)&1)?'rgba(255,255,255,.065)':'rgba(45,39,30,.025)';c.fillRect(paperLeft+x,y,2,2);
          }
          c.textBaseline='top';c.filter='blur(.10px)';
          for(const op of layout.ops) {
            if(op.k==='text') {
              const value=String(op.text);c.font=op.font;c.fillStyle='#282725';c.textAlign=op.align||'left';
              const x=paperLeft+op.x*.59;
              const next=layout.ops.find(q=>q.k==='text'&&Math.abs(q.y-op.y)<=1.5&&q.x>op.x+2);
              let reserved=9;
              if(next&&next.align==='right'){c.font=next.font;reserved=c.measureText(String(next.text)).width+12;c.font=op.font;}
              const max=op.align==='center'?paperW-36:op.align==='right'?paperW*.28:next?(next.x-op.x)*.59-reserved:paperLeft+paperW-x-18;
              c.fillText(value===d.issuer?value.toUpperCase():value,x,op.y+50,Math.max(45,max));
            } else if(op.k==='line') {
              c.strokeStyle='#514e49';c.lineWidth=1;c.setLineDash(op.dashed?[6,4]:[]);
              c.beginPath();c.moveTo(paperLeft+op.x1*.59,op.y+50);c.lineTo(paperLeft+op.x2*.59,op.y+50);c.stroke();c.setLineDash([]);
            }
          }
          c.filter='none';
          c.save();c.translate(paperLeft+paperW-105,H-68);c.rotate(-.09);c.font='18px monospace';c.textAlign='left';
          c.fillStyle='#66534d99';c.strokeStyle='#66534d77';c.strokeRect(-6,-4,94,29);c.fillText(stamp,0,0,80);c.restore();
          c.restore();
          for(const id of Object.keys(pos))if(pos[id]<H)pos[id]=Math.min(H,pos[id]+42);
        }
        return { cv, W, H, pos };
      },
      'renderScan': (base, S) => function renderScan(ctx) {
        const { SCAN_CSS, addField, ensureStyle, env, icon, iconButton, mirrorFocus, scanBitmap, sectionOf, workspace } = S;
        ensureStyle();
        ctx.css('ff-scan-style', SCAN_CSS);
        const { util, spec } = ctx;
        S.st = { ctx, spec, el:{}, tabs:null, extra:{} };
        const shell=workspace(ctx,true), root=shell.root;
        const main = util.el('div', 'ff-scan-main', shell.center);
        const viewer = util.el('section', 'ff-scan-view', main);
        viewer.dataset.role = 'document';
        const filebar=util.el('div','ff-scan-filebar',viewer);
        icon(util,filebar,'file');
        util.el('span','ff-scan-filename',filebar,spec.layout.pdf ? spec.layout.pdf.file : 'source_scan.tif');
        util.el('span','ff-chip',filebar,'Original');
        const toolbar = util.el('div', 'ff-scan-toolbar', viewer);
        const pageLabel=util.el('span','ff-scan-filename',toolbar,'Page 1 / 1');
        iconButton(util,toolbar,'hand','Hand tool').setAttribute('aria-pressed','true');
        const minus = iconButton(util,toolbar,'minus','Zoom out');
        const zoomText = util.el('span','ff-scan-zoom',toolbar);
        const plus = iconButton(util,toolbar,'plus','Zoom in');
        const resetZoom = iconButton(util,toolbar,'refresh','Reset zoom');
        const fit = iconButton(util,toolbar,'fit','Fit page width');
        iconButton(util,toolbar,'more','Document actions').addEventListener('click',()=>shell.show('Original attachment',[
          'Original scan retained in the document archive.','1 page / scanned copy','Version history: original upload; no replacements.']));
        const well = util.el('div', 'ff-scan-well', viewer);
        const pages=util.el('div','ff-page-strip',well);
        icon(util,pages,'grid');
        const pane = util.el('div', 'ff-scan-scroll', well);
        const sheet = util.el('div','ff-scan-sheet',pane);
        const rail = util.el('div','ff-scan-rail',well); const thumb = util.el('div','ff-scan-thumb',rail);
        const bitmap = scanBitmap(ctx, sheet);
        const thumbnail=util.el('canvas','',pages);thumbnail.width=48;thumbnail.height=68;
        thumbnail.setAttribute('aria-hidden','true');
        thumbnail.getContext('2d').drawImage(bitmap.cv,0,0,48,68);
        thumbnail.addEventListener('click',()=>{pane.scrollTop=0;pane.scrollLeft=0;mirror();});
        util.el('small','',pages,'1');
        util.el('div','ff-scan-source-foot',viewer,'Original attachment / Color / Read-only');
        const entry = util.el('section','ff-scan-entry',main);
        const formRail=util.el('div','ff-form-rail',entry),formThumb=util.el('div','ff-form-thumb',formRail);
        const entryHead = util.el('div','ff-scan-entry-head',entry);
        util.el('h2','',entryHead,spec.formTitle);
        util.el('p','',entryHead,'Record fields / Manual verification');
        const fieldsPane = util.el('div','ff-scan-fields',entry);
        fieldsPane.dataset.role = 'form';
        const grid = util.el('div','ff-grid',fieldsPane);
        const groups=new Map();
        for(const f of spec.fields) { const name=sectionOf(f); if(!groups.has(name)) groups.set(name,[]); groups.get(name).push(f); }
        for(const [name,fields] of groups) {
          const label=util.el('div','ff-section',grid);icon(util,label,'file');util.el('span','',label,name);
          for(const f of fields) addField(util,grid,f,ctx.model.fields[f.id]);
        }
        const entryFoot = util.el('div','ff-scan-entry-foot',entry);
        const count = util.el('span','',entryFoot);
        util.el('span','',entryFoot,'Draft / Not exported');
        shell.right.textContent='Draft changes saved';
        let zoom = Math.max(.3, pane.clientWidth/bitmap.W);
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
          const railH=formRail.clientHeight,range=Math.max(0,fieldsPane.scrollHeight-fieldsPane.clientHeight);
          const thumbH=Math.max(28,railH*fieldsPane.clientHeight/Math.max(1,fieldsPane.scrollHeight));
          formThumb.style.height=thumbH+'px';
          formThumb.style.top=(range?fieldsPane.scrollTop/range*(railH-thumbH):0)+'px';
          const top = Math.round(fieldsPane.scrollTop);
          const pr = fieldsPane.getBoundingClientRect();
          const pos = {};
          for (const f of spec.fields) {
            const fr = S.st.el[f.id].wrap.getBoundingClientRect();
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
        fit.addEventListener('click',() => { zoom=pane.clientWidth/bitmap.W; resize(); });
        resetZoom.addEventListener('click',() => { zoom=Math.max(.3,pane.clientWidth/bitmap.W); resize(); });
        env.ui.scrollPane(pane,{ thumb, track:rail, travel:() => rail.clientHeight-thumbY().h, onScroll:mirror });
        env.ui.scrollPane(fieldsPane,{thumb:formThumb,track:formRail,travel:()=>formRail.clientHeight-formThumb.offsetHeight,onScroll:mirrorForm});
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
            const el=S.st.el[f.id], v=model.fields[f.id];
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
        S.st.scanCount = () => { count.textContent=`${spec.fields.filter((f) => !!ctx.model.fields[f.id]).length} / ${spec.fields.length} fields entered`; };
        if (spec.keys !== undefined) mirrorFocus(root);
        resize(); mirrorForm(); sync(ctx.model);
        S.st.extra = {
          scanForm:() => util.center(fieldsPane), pdfPane:() => util.center(pane), pdfThumb:() => util.center(thumb),
          pdfTo:(t) => { const q=rail.getBoundingClientRect(), {max,h}=thumbY(); return [q.left+q.width/2,q.top+h/2+(max ? Math.max(0,Math.min(max,t.pdfTo))/max*(q.height-h) : 0)]; },
        };
        return { anchors:[root,viewer,entry], sync };
      },
    },
  },
});
