/* fill-form/_workspace: reference builders. scope is the live unit scope; reference.js retains all design hooks. */
(function () {
  'use strict';
function icon(scope, util, parent, name) {
        const span = util.el('span','ff-icon',parent);
        span.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${scope.ICONS[name] || scope.ICONS.file}"/></svg>`;
        return span;
      }

function iconButton(scope, util, parent, name, label, text = '') {
        const b = util.el('button','ff-tool',parent);
        b.type = 'button'; b.title = label; b.setAttribute('aria-label',label);
        scope.icon(util,b,name); if(text) util.el('span','',b,text);
        return b;
      }

function workspace(scope, ctx, scan = false) {
        ctx.css('ff-workspace-style',scope.WORKSPACE_CSS);
        const {util,spec}=ctx, box=scope.stageBox(ctx), r=ctx.rng.fork('workspace');
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
          scope.iconButton(util,popup,'close','Close details').classList.add('ff-pop-close');
          popup.firstChild.addEventListener('click',()=>{popup.hidden=true;});
          util.el('h3','',popup,title);
          for(const line of lines) util.el('p','',popup,line);
          util.el('small','',popup,'Folio Capture / workspace activity');
        };
        const appbar=util.el('div','ff-appbar',root), brand=util.el('div','ff-product',appbar);
        scope.icon(util,brand,'stack'); util.el('span','',brand,'Folio Capture');
        const nav=util.el('nav','ff-appnav',appbar);
        for(const label of ['Documents','Batches','Reports']) {
          const b=util.el('button',label==='Documents'?'active':'',nav,label); b.type='button';
          b.addEventListener('click',()=>show(label,label==='Batches' ? [`${batch} / ${group[1]}`, '18 documents received; 6 awaiting review.', 'Travel expenses / awaiting assignment'] : label==='Reports' ? ['Daily intake: 146 documents','Export pending: 12 records','Last successful export: 09:12'] : ['Current document is open in the review workspace.','Other records are available in the processing queue.']));
        }
        const tools=util.el('div','ff-app-tools',appbar);
        scope.iconButton(util,tools,'search','Search documents').addEventListener('click',()=>show('Search documents',['Recent: supplier invoices','Recent: identity verification','Recent: property claims']));
        scope.iconButton(util,tools,'bell','Notifications, 3 unread').addEventListener('click',()=>show('Notifications',['New batch received from the shared mailbox.','Export to ledger completed for yesterday\'s batch.','Two documents in Travel expenses need an owner.']));
        const owner=ctx.content.personName(r,{csplit:spec.csplit});
        util.el('span','ff-avatar',tools,`${owner.first[0]}${owner.last[0]}`);
        const context=util.el('div','ff-contextbar',root);
        util.el('span','',context,group[0]); scope.icon(util,context,'chevron'); util.el('strong','',context,group[1]);
        scope.icon(util,context,'chevron'); util.el('span','',context,batch);
        util.el('span','ff-chip',context,'In review');
        const body=util.el('div','ff-workbody',root), queue=util.el('aside','ff-queue',body);
        for(const [name,label,n] of [['inbox','My queue','18'],['flag','Needs review','6'],['check','Processed','124'],['folder','All documents','146']]) {
          const b=scope.iconButton(util,queue,name,`${label}: ${n}`);
          util.el('span','ff-queue-label',b,`${label}   ${n}`);
          if(name==='inbox') b.setAttribute('aria-pressed','true');
          if(name==='flag') util.el('span','ff-queue-dot',b);
          b.addEventListener('click',()=>show(label,[`${n} documents in ${label.toLowerCase()}.`,`${batch} / ${group[1]}`, 'The current record remains assigned to you.']));
        }
        util.el('div','ff-queue-rule',queue); util.el('div','ff-queue-summary',queue,'This batch / 8 records');
        const list=util.el('div','ff-queue-list',queue);
        const current=util.el('div','ff-queue-record active',list);
        util.el('strong','',current,'Current document'); util.el('small','',current,`${record} / In review`);
        const companies=ctx.content.sample(r,ctx.content.COMPANIES,7,{csplit:spec.csplit});
        companies.forEach((company,i)=>{
          const b=util.el('button','ff-queue-record',list); b.type='button';
          const pageCount=r.int(1,3);
          util.el('strong','',b,company); util.el('small','',b,`${pageCount} ${pageCount===1?'page':'pages'} / ${i%3===0?'Needs review':i%3===1?'Queued':'Processed'}`);
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
        const details=scope.iconButton(util,tools,'info','Document details');
        details.addEventListener('click',()=>show('Document details',[`Record: ${record}`,`Batch: ${batch}`,`Assigned to ${owner.first} ${owner.last}`,'Source: shared mailbox / original attachment retained','Activity: Imported 09:18; assigned 09:20; opened 09:24.']));
        return {root,center,width,height,left,right,show};
      }

function renderWorkspace(scope, ctx, render) {
        scope.ensureStyle();
        const shell=scope.workspace(ctx), r=shell.center.getBoundingClientRect();
        const child=Object.create(ctx);
        child.stage=shell.center;
        child.size={width:r.width,height:ctx.spec.layout.long ? Math.max(380,shell.height-102) : r.height};
        const view=render(child);
        return {...view,anchors:[shell.root,...(view.anchors || [])]};
      }

function sectionOf(scope, f) {
        if(/^(total|subtotal|tax|amount|currency|qtySum|method|paid|cost|project|po|vat)$/.test(f.id)) return 'Amounts & coding';
        if(/claim|policy|loss|location|cause|adjuster/.test(f.id)) return 'Claim information';
        if(/phone|email|street|city|zip|country|website|fax|apt/.test(f.id)) return 'Contact & address';
        if(/date|due|issued|expiry|invNo|terminal/.test(f.id)) return 'Document details';
        return 'Record details';
      }

function recordBar(scope, util,parent,text='Draft record') {
        const bar=util.el('div','ff-record-bar',parent);
        const label=util.el('span','',bar);scope.icon(util,label,'file');util.el('span','',label,` ${text}`);
        util.el('span','ff-chip',bar,'In review');
      }


  env.template('fill-form/_workspace', () => ({ icon, iconButton, workspace, renderWorkspace, sectionOf, recordBar }));
})();
