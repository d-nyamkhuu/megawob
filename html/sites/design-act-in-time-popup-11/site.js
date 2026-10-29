(function(){
  'use strict';
  const C={site:'design-act-in-time-popup-11'};
  env.site({name:C.site,styles:['site.css'],scripts:[],frame(ctx){
    if(document.activeElement&&document.activeElement!==document.body)document.activeElement.blur();
    const sel=window.getSelection();if(sel)sel.removeAllRanges();
    const u=ctx.util,root=document.body;
    const header=u.el('header','ds-top',root);
    u.el('span','ds-brand',header,'LedgerPro');
    const nav=u.el('nav','ds-menu',header);
    ['Transactions','Contacts','Reports','Settings'].forEach((t,i)=>{const a=u.el('span',i===0?'active':'',nav,t);});
    const utilities=u.el('div','ds-utilities',header);
    u.el('span','ds-bell',utilities,'●');u.el('span','',utilities,'Help');
    const work=u.el('div','ds-workspace',root);
    const ledger=u.el('section','ds-ledger',work);
    u.el('h1','',ledger,'Transaction Ledger');
    const tools=u.el('div','ds-ledger-tools',ledger);
    ['All accounts　⌄','Last 30 days　⌄','⌕　Search transactions...'].forEach(t=>u.el('div','ds-filter',tools,t));
    const add=u.el('button','ds-add',tools,'＋　Add transaction');add.type='button';
    const table=u.el('div','ds-table',ledger);
    ['Date','Description','Category','Amount','Status'].forEach(t=>u.el('span','',table,t));
    const empty=u.el('div','ds-empty',ledger);
    u.el('div','ds-file-icon',empty,'▤');u.el('strong','',empty,'No transactions yet');u.el('span','',empty,'Add a transaction to get started.');
    const loginPane=u.el('section','ds-login-pane',work);
    const preview=u.el('aside','ds-preview',work);
    const ph=u.el('div','ds-preview-head',preview);u.el('b','',ph,'▣　Document Preview');u.el('span','',ph,'⌗');
    const invoice=u.el('div','ds-invoice',preview);u.el('strong','',invoice,'Invoice');
    u.el('span','ds-invoice-vendor',invoice,'Acme Supplies\n123 Market St.\nRiverton, CA 94601');
    u.el('div','ds-invoice-lines',invoice,'Bill To:　　　　　　　　　Invoice #\n▰▰▰▰▰　　　　　　　　　Date\n▰▰▰　　　　　　　　　Due Date');
    u.el('div','ds-invoice-grid',invoice,'Item　　　　　　　　 Qty　　 Unit Price　　 Total\n▰▰▰▰▰　　　　　　 ▰▰　　 ▰▰▰　　 ▰▰▰\n▰▰▰▰▰　　　　　　 ▰▰　　 ▰▰▰　　 ▰▰▰');
    const display=ctx.display||'header';
    let note=null;
    if(display!=='hidden'){
      note=u.el('aside',`ds-instruction-note ds-note-${display}`,work);
      if(display==='panel')u.el('b','ds-note-title',note,'Instructions');
      u.el('div','ds-instruction',note,ctx.instruction);
    }
    if(display==='toast')note.classList.add('ds-note-toast');
    const stage=u.el('main','ds-stage',work);
    const rng=ctx.rng.fork('chrome/end'), labels=ctx.content&&ctx.content.END_LABELS;
    const labelList=Array.isArray(labels)&&labels.length?labels:['Submit','Done','Finish','Continue','Save','OK','Confirm','Apply'];
    const raw=labelList[rng.int(0,labelList.length-1)];
    const sampledLabel=typeof raw==='string'?raw:(raw.label||raw.text||'Submit');
    const sampledPlacement=ctx.finish?null:rng.pick(['header','header','footer','link','icon']);
    const preferOriginal=ctx.rng.fork('chrome/end/default').bool(0.5);
    const label=preferOriginal?'Submit':sampledLabel;
    const alternate={header:'footer',footer:'link',link:'icon',icon:'link'};
    const placement=ctx.finish?null:preferOriginal?'header':alternate[sampledPlacement];
    let submit=null;
    const makeEnd=(parent,cls,text)=>{const b=u.el('button',cls,parent,text);b.type='button';b.dataset.role='submit';b.setAttribute('aria-label',label);b.title=label;b.addEventListener('click',()=>ctx.submit());return b;};
    const collideRng=ctx.rng.fork('chrome/collide');
    if(!ctx.finish&&collideRng.bool(0.3)){
      const other=labelList.map(x=>typeof x==='string'?x:(x.label||x.text||'')).filter(x=>x&&x.toLowerCase()!==label.toLowerCase());
      if(other.length){const text=collideRng.pick(other),b=u.el('button','ds-xtra',utilities,text);b.type='button';b.dataset.role='xtra';b.addEventListener('click',()=>env.log('decoy',{label:text,collide:true}));}
    }
    if(placement==='header')submit=makeEnd(utilities,'ds-submit ds-submit-header',label);
    if(placement==='icon')submit=makeEnd(utilities,'ds-submit ds-submit-header ds-submit-icon','✓');
    const foot=u.el('footer','ds-footer',work);u.el('span','',foot,'All changes are saved automatically.');
    if(placement==='footer')submit=makeEnd(foot,'ds-submit',label);
    if(placement==='link')submit=makeEnd(foot,'ds-submit ds-submit-link',label+' ›');
    return{stage,submit};
  },overlay(ctx){
    const u=ctx.util,el=u.el('section','ds-overlay ds-overlay-'+ctx.kind,document.body);el.dataset.role='overlay';
    const texts={cookie:'We use cookies to remember your preferences.',toast:'Changes synced.',chat:'Hello. How can we help?',promo:'Try our new workspace.',banner:'Scheduled maintenance tonight.'};
    u.el('div','',el,texts[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept all':'Close');dismiss.addEventListener('click',()=>ctx.dismiss('close'));return{el,dismiss,ttlSteps:ctx.kind==='toast'?4:0};
  }});
})();
