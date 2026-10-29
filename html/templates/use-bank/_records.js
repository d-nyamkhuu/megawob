/* use-bank/_records: classic workspace records parts.
 * install(BASE, S) preserves part names/order; S supplies the live design and page state.
 * No DOM work or randomness occurs until a part is called.
 */
(function () {
  'use strict';
  function install(BASE, S) {
    BASE.history = (E, parent) => {
      const { P } = S;
      const { s, u, F } = E;
      const block=u.el('section','bk-history',parent);
      const payment=['paybill','schedule'].includes(s.scenario), dispute=s.scenario==='dispute';
      P.sectionHead(E,block,payment?'Payment activity':dispute?'Recent disputes':s.scenario==='limits'?'Recent card activity':'Recent account activity',payment?'Last 30 days':dispute?'Resolution centre':'Posted transactions');
      const tabs=u.el('div','bk-tabline',block);u.el('span','active',tabs,payment?'Scheduled':dispute?'Open cases':'All activity');u.el('span','',tabs,payment?'Completed':dispute?'Closed cases':'Pending');u.el('span','',tabs,payment?'Cancelled':'Statements');
      const tbl=u.el('table','bk-table',block), h=u.el('tr','',u.el('thead','',tbl));
      ['Description',payment?'Next payment':'Date','Amount','Status'].forEach((x,i)=>{const th=u.el('th','',h,x);th.style.width=['40%','22%','18%','20%'][i];});
      const body=u.el('tbody','',tbl);
      const records=dispute?[['Merchant review / PB-20416','Feb 18','$42.80','Under review'],['Duplicate payment / PB-19802','Jan 29','$26.50','Resolved']]
        :payment?s.payees.slice(0,4).map((p,i)=>[p.name,`Mar ${String(5+i*3).padStart(2,'0')}`,F.helpers.money(s.transactions[i%s.transactions.length].amount),i===2?'Processing':'Scheduled'])
        :s.transactions.slice(0,6).map(t=>[t.name,t.date.slice(5),F.helpers.money(t.amount),'Posted']);
      records.forEach((record,i)=>P.historyRow(E,record,i,body,payment,dispute));
      u.el('div','bk-table-meta',block,`${records.length} ${dispute?'cases':'records'} shown / Personal accounts`);
    };

    BASE.table = (E) => {
      const { P } = S;
      const { ctx, s, u } = E;
      E.tableHost.replaceChildren();
      const q=ctx.model.search.toLowerCase(), xs=s.transactions.filter(t=>`${t.id} ${t.name} ${t.date}`.toLowerCase().includes(q));
      if(!xs.length) {const empty=u.el('div','bk-empty',E.tableHost);P.icon(E,u,empty,'search');u.el('b','',empty,'No matching transactions');u.el('p','',empty,'Try a different merchant name, date or transaction ID.');return;}
      const tbl=u.el('table','bk-table',E.tableHost), h=u.el('tr','',u.el('thead','',tbl));
      ['Transaction','Account','Status','Amount',s.scenario==='categorise'?'Category':''].forEach((x,i)=>{const th=u.el('th',i===1?'bk-channel':'',h,x);th.style.width=['35%','19%','12%','14%','20%'][i];});
      const body=u.el('tbody','',tbl);
      xs.forEach(t=>P.transaction(E,t,body));
      const meta=u.el('div','bk-table-meta',E.tableHost);u.el('span','',meta,`${xs.length} of ${s.transactions.length} transactions / Feb 2027`);u.el('span','',meta,'Newest first');P.mirror(E);
    };

    BASE.searchBox = (E) => {
      const { D, P } = S;
      const { ctx, u } = E;
      const toolbar=u.el('div','bk-toolbar',E.pane), wrap=u.el('div','bk-searchbox',toolbar);P.icon(E,u,wrap,'search');
      const input=P.ref(E,{search:true},u.el('input','bk-control',wrap));input.type='text';input.placeholder=D.searchPlaceholder;input.setAttribute('aria-label',D.searchPlaceholder);input.value=ctx.model.search;
      input.addEventListener('input',()=>{P.change(E,{search:input.value},false);P.table(E);});
      P.localButton(E,toolbar,'Filters',()=>P.popup(E,'Transaction filters','Account: All personal accounts\nDate range: February 1-28, 2027\nStatus: Posted\nTransaction type: Card purchases'),'bk-btn','filter');
      P.localButton(E,toolbar,'Export',()=>P.popup(E,'Export transactions','February 2027 / Posted card purchases\nCSV and PDF statements are available in Documents. No account data is sent outside this page.'),'bk-btn','download');
      E.tableHost=u.el('div','',E.pane);P.table(E);
    };

    BASE.field = (E, f,grid) => {
      const { P } = S;
      const { ctx, u } = E;
      const box=u.el('label',`bk-field${f.kind==='details'?' wide':''}`,grid);u.el('span','bk-label',box,f.label);
      if(f.options) {
        P.choiceControl(E,f,box);
      } else {
        P.textControl(E,f,box);
      }
      const el=E.refs[P.key(E,{field:f.id})];el.setAttribute('aria-invalid',String(!!ctx.model.invalid[f.id]));
      if(f.hint)u.el('small','bk-hint',box,f.hint);
      if(ctx.model.invalid[f.id])u.el('span','bk-error',box,ctx.model.invalid[f.id]);
      P.fieldDrawn(E,f,box);
    };

    BASE.cardPreview = (E, parent) => {
      const { D, P } = S;
      const { ctx, s, u, F } = E;
      const m=ctx.model, card=m.values.card || s.cards[0], intro=u.el('div','bk-cardintro',parent), visual=u.el('div','bk-creditcard',intro);
      const h=u.el('div','bk-creditcard-head',visual);u.el('span','',h,D.brand);P.icon(E,u,h,'card');u.el('span','bk-chip',visual);
      u.el('div','bk-cardnumber',visual,'**** **** **** '+card.slice(-4));u.el('div','bk-cardowner',visual,s.customer);
      const aside=u.el('div','bk-cardaside',intro);u.el('span','',aside,'Card purchase activity');u.el('strong','',aside,F.helpers.money(s.transactions[0].amount));u.el('small','',aside,'Spent today / Posted purchases');
    };

    BASE.details = (E, parent) => {
      const { P } = S;
      const { ctx, s, u, F } = E;
      const m=ctx.model, list=u.el('div','bk-summary',parent);
      s.fields.forEach(f=>{const value=m.values[f.id];P.row(E,list,f.label,value?f.kind==='amount'?F.helpers.money(F.helpers.cents(value) || 0):value:'Not provided',f.kind==='amount'?'amount':'');});
    };

    BASE.draw = (E) => {
      const { P } = S;
      const { ctx, s, F } = E;
      const m=ctx.model, scroll=E.lastView===m.view?E.pane.scrollTop:0;E.lastView=m.view;E.choicesPane=null;
      E.root.querySelectorAll('[data-account]').forEach(el=>{const a=s.accounts.find(a=>a.label===el.dataset.account);el.textContent=F.helpers.money(a.balance-(m.saved&&s.scenario==='paybill'&&m.values.from===a.label?F.helpers.cents(m.values.amount)||0:0));});
      E.refs={};E.inputs={};E.pane.replaceChildren();E.footer.replaceChildren();E.root.querySelector('.bk-mask')?.remove();E.stateBadge.replaceChildren();
      E.crumb.textContent=`Personal banking / ${E.active} / ${E.titles[s.scenario]}`;
      E.title.textContent=m.view==='receipt'?(s.scenario==='dispute'?'Dispute received':'Confirmation'):m.view==='review'?'Review & authorise':E.titles[s.scenario];
      P.badge(E,E.stateBadge,m.view==='receipt'?'Confirmed':m.view==='review'?'Not yet submitted':'Draft',m.view==='receipt'?'positive':'',m.view==='receipt'?'check':'file');
      P.ref(E,{pane:true},E.pane);
      if(m.bankUI?.preview) {
        P.preview(E);
      } else if(s.judge && s.judge.mode!=='confirm') {
        P.billers(E);
      } else if(m.view==='receipt') {
        P.receipt(E);
      } else if(m.view==='review') {
        P.review(E);
      } else {
        P.edit(E);
      }
      if(m.open && !m.bankUI?.preview) {
        P.choices(E);
      }
      if(m.bankUI?.popup) {
        P.information(E);
      }
      P.drawn(E);
      E.pane.scrollTop=scroll;ctx.reanchor([E.root]);P.mirror(E);
    };

    BASE.transaction = (E, t, body) => {
      const { P } = S;
      const { ctx, s, u, F } = E;
      const tr=u.el('tr','',body), name=u.el('td','',tr), merchant=u.el('div','bk-merchant',name);u.el('span','bk-avatar',merchant,t.name.split(' ').map(x=>x[0]).slice(0,2).join(''));const text=u.el('div','',merchant);u.el('span','bk-merchant-title',text,t.name);u.el('small','',text,`${t.date} / ${t.id}`);
      const account=u.el('td','bk-channel',tr);u.el('span','',account,'Card purchase');u.el('small','',account,'Card '+s.cards[0].slice(-4));
      P.badge(E,u.el('td','',tr),'Posted','positive');u.el('td','bk-num',tr,F.helpers.money(t.amount));const cell=u.el('td','',tr);
      if(s.scenario==='categorise') {const b=P.button(E,cell,ctx.model.values[t.id],{field:t.id},{open:t.id});P.icon(E,u,b,'chevron');}
      else P.button(E,cell,'Dispute',{transaction:t.id},{transaction:t.id},'link','arrow');
    };

    BASE.historyRow = (E, record, i, body, payment, dispute) => {
      const { P } = S;
      const { s, u } = E;
      const tr=u.el('tr','',body);record.forEach((v,j)=>{const td=u.el('td',j===2?'bk-num':'',tr);if(j===3)P.badge(E,td,v,v==='Resolved'||v==='Posted'?'positive':'attention');else {u.el('span','',td,v);if(j===0)u.el('small','',td,payment?`${s.accounts[i%s.accounts.length].label} / ${i%2?'Monthly':'One time'}`:dispute?'Card ending '+s.cards[0].slice(-4):s.transactions[i].id);}});
    };

    BASE.choiceControl = (E, f, box) => {
      const { D, P } = S;
      const { ctx, u } = E;
      const b=P.ref(E,{field:f.id},P.localButton(E,box,ctx.model.values[f.id]||D.choicePlaceholder,()=>P.change(E,{open:f.id}),'bk-control bk-choice'));
      P.icon(E,u,b,'chevron');b.setAttribute('aria-label',f.label);b.setAttribute('aria-haspopup','dialog');
    };

    BASE.textControl = (E, f, box) => {
      const { D, P } = S;
      const { ctx, u } = E;
      const wrap=u.el('div',`bk-inputwrap${f.kind==='amount'?' amount':''}`,box);
      const el=P.ref(E,{field:f.id},u.el(f.kind==='details'?'textarea':'input','bk-control',wrap));el.setAttribute('aria-label',f.label);el.value=ctx.model.values[f.id]||'';el.autocomplete='off';el.spellcheck=false;
      if(f.kind==='amount') {el.inputMode='decimal';u.el('span','bk-currency',wrap,D.currency);}
      if(f.kind==='date') {el.placeholder=D.datePlaceholder;P.icon(E,u,wrap,'calendar','bk-affix');}
      el.addEventListener('input',()=>P.change(E,{set:[f.id,el.value]},false));E.inputs[f.id]=el;
    };
  }
  env.template('use-bank/_records', () => ({ install }));
})();
