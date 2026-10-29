/* use-bank/_workflow: classic workspace workflow parts.
 * install(BASE, S) preserves part names/order; S supplies the live design and page state.
 * No DOM work or randomness occurs until a part is called.
 */
(function () {
  'use strict';
  function install(BASE, S) {
    BASE.preview = (E) => {
      const { D, P } = S;
      const { ctx, s } = E;
      const m=ctx.model;
      P.sectionHead(E,E.pane,m.bankUI.preview,D.personal);P.notice(E,E.pane,'Your current banking draft is retained while you view other account information.');P.history(E,E.pane);
      const b=P.localButton(E,E.footer,'Return to '+E.titles[s.scenario],()=>P.ui(E,{preview:null}),'bk-btn primary','arrow');P.ref(E,{nav:'return'},b);
    };

    BASE.billers = (E) => {
      const { P } = S;
      const { s, u, F } = E;
      P.sectionHead(E,E.pane,'Saved billers',`${s.payees.length} payment accounts`);u.el('p','bk-note',E.pane,'Manage biller account details and view payment delivery preferences.');
      const list=u.el('div','bk-summary',E.pane);s.payees.forEach(p=>P.row(E,list,p.name,`Account ending ${p.suffix}`));
      s.accounts.forEach(a=>P.row(E,E.pane,a.label,`${F.helpers.money(a.balance)} available`));
      u.el('small','',E.footer,'No payment has been prepared.');P.history(E,E.pane);
    };

    BASE.receipt = (E) => {
      const { P } = S;
      const { ctx, s, u, F } = E;
      const m=ctx.model;
      const success=u.el('div','bk-success',E.pane);P.icon(E,u,success,'check');const text=u.el('div','',success);u.el('b','',text,s.scenario==='dispute'?'We have received your dispute.':'Your banking changes are confirmed.');u.el('small','',text,'Keep the confirmation number for your records.');
      const facts=u.el('div','bk-summary',E.pane);F.facts(m,s).forEach(f=>P.row(E,facts,f.label,f.value));
      P.sectionHead(E,E.pane,'Transaction details');P.details(E,E.pane);
      if(s.scenario==='dispute') {const path=u.el('div','bk-casepath',E.pane);['Received','Investigation','Decision'].forEach((v,i)=>u.el('span',i===0?'active':'',path,v));P.notice(E,E.pane,'We will send updates to your secure inbox. Your provisional credit eligibility will be assessed during the investigation.','shield');}
      else P.notice(E,E.pane,s.scenario==='schedule'?'The recurring instruction is active. Only scheduled transfers are affected; other standing instructions are unchanged.':s.scenario==='limits'?'Card preferences have been updated. Existing subscriptions and already authorised transactions may still be processed.':'A confirmation has been added to your activity. Future-dated payments are listed under Scheduled.','check');
      P.history(E,E.pane);const small=u.el('small','',E.footer);P.icon(E,u,small,'shield');u.el('span','',small,'Saved to your secure banking profile');P.button(E,E.footer,'Make changes',{nav:'edit'},{nav:'edit'});
    };

    BASE.review = (E) => {
      const { P } = S;
      const { ctx, s, u } = E;
      const steps=u.el('div','bk-steps',E.pane);u.el('span','',steps,'1 Details');u.el('i','',steps);u.el('span','current',steps,'2 Review');u.el('i','',steps);u.el('span','',steps,'3 Confirmation');
      P.sectionHead(E,E.pane,['paybill','schedule'].includes(s.scenario)?'Payment instructions':'Changes to authorise');P.details(E,E.pane);
      P.notice(E,E.pane,['paybill','schedule'].includes(s.scenario)?'By authorising, you instruct Pinebridge to process the payment using these account details. A confirmation will appear in your payment activity.':'These changes will be applied to your selected transactions or card. Review the details before authorising.','shield');
      P.button(E,E.footer,'Edit details',{nav:'edit'},{nav:'edit'});u.el('small','',E.footer,'No changes applied yet');
      const b=P.ref(E,{nav:'apply'},P.localButton(E,E.footer,s.scenario==='paybill'?'Pay bill':s.scenario==='schedule'?'Set up transfer':s.scenario==='dispute'?'Send dispute':'Apply changes',()=>{if(s.judge?.mode==='confirm')ctx.flag('irreversible');else P.change(E,{nav:'apply'});},'bk-btn primary','lock'));
      b.type='button';P.history(E,E.pane);
    };

    BASE.edit = (E) => {
      const { P } = S;
      const { ctx, s, u } = E;
      const m=ctx.model;
      if(Object.keys(m.invalid).length) {const err=u.el('div','bk-errorbox',E.pane);u.el('strong','bk-error',err,'We could not continue.');u.el('div','bk-error',err,'Check the highlighted information below.');}
      if(s.scenario==='categorise') {
        P.spending(E);
        P.searchBox(E);
      } else if(s.scenario==='dispute' && !m.values.transaction) {
        P.sectionHead(E,E.pane,'Find a posted transaction','February 2027');u.el('p','bk-note',E.pane,'Pending authorisations cannot be disputed until they have posted to your account.');P.searchBox(E);P.history(E,E.pane);
      } else {
        P.form(E);
      }
      const small=u.el('small','',E.footer);P.icon(E,u,small,'lock');u.el('span','',small,'Secure banking / USD');P.button(E,E.footer,'Review changes',{nav:'review'},{nav:'review'},'primary','arrow');
    };

    BASE.choices = (E) => {
      const { P } = S;
      const { ctx, s, u } = E;
      const m=ctx.model;
      const f=s.fields.find(f=>f.id===m.open), mask=u.el('div','bk-mask',E.root), d=u.el('div','bk-dialog',mask);d.setAttribute('role','dialog');d.setAttribute('aria-label',f.label);
      const h=u.el('div','bk-dialog-head',d);u.el('span','',h,f.label);P.ref(E,{nav:'close'},P.tool(E,h,'Close choices','close',()=>P.change(E,{nav:'close'})));
      E.choicesPane=u.el('div','bk-options',d);P.ref(E,{choicePane:true},E.choicesPane);E.choicesPane.addEventListener('scroll',()=>P.mirror(E));
      f.options.forEach(value=>P.option(E,f,value));
    };

    BASE.information = (E) => {
      const { P } = S;
      const { ctx, u } = E;
      const m=ctx.model;
      const mask=u.el('div','bk-mask',E.root), dialog=u.el('div','bk-dialog',mask), h=u.el('div','bk-dialog-head',dialog);dialog.setAttribute('role','dialog');u.el('span','',h,m.bankUI.popup.title);
      P.ref(E,{nav:'dismiss'},P.tool(E,h,'Close panel','close',()=>P.ui(E,{popup:null})));const content=u.el('div','bk-popcontent',dialog);m.bankUI.popup.text.split('\n').forEach(text=>u.el('p','',content,text));
    };

    BASE.option = (E, f, value) => {
      const { P } = S;
      const { ctx, s, u, F } = E;
      const m=ctx.model;

      const b=P.ref(E,{option:value},P.localButton(E,E.choicesPane,'',()=>P.change(E,{set:[f.id,value]}),`bk-option${m.values[f.id]===value?' selected':''}`,f.id==='card'||f.id==='frozen'?'card':f.kind==='category'?'file':f.id==='frequency'?'calendar':'wallet'));
      const label=u.el('div','bk-option-label',b);u.el('span','',label,value);
      const a=s.accounts.find(a=>a.label===value), payee=s.payees.find(p=>p.label===value);
      if(a)u.el('small','',label,`${F.helpers.money(a.balance)} available / Personal account`);
      else if(payee)u.el('small','',label,'Saved biller / Electronic payment');
      else if(f.id==='card')u.el('small','',label,'Personal card / Card services enabled');
      if(m.values[f.id]===value)P.icon(E,u,b,'check');
    };
  }
  env.template('use-bank/_workflow', () => ({ install }));
})();
