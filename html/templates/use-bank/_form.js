/* use-bank/_form: classic workspace form parts.
 * install(BASE, S) preserves part names/order; S supplies the live design and page state.
 * No DOM work or randomness occurs until a part is called.
 */
(function () {
  'use strict';
  function install(BASE, S) {
    BASE.spending = (E) => {
      const { ctx, s, u, F } = E;
      const m=ctx.model;
      const stats=u.el('div','bk-stats',E.pane);
      [['February spending',F.helpers.money(s.transactions.reduce((n,t)=>n+t.amount,0))],['Transactions',String(s.transactions.length)],['Uncategorised',String(s.transactions.filter(t=>m.values[t.id]==='Uncategorised').length)]].forEach(([k,v])=>{const el=u.el('div','bk-stat',stats);u.el('small','',el,k);u.el('b','',el,v);});
    };

    BASE.form = (E) => {
      const { P } = S;
      const { s, u } = E;
      if(s.scenario==='limits') P.cardPreview(E,E.pane);
      if(s.scenario==='dispute') {
        P.transactionBanner(E);
      } else if(s.scenario!=='limits') {
        const steps=u.el('div','bk-steps',E.pane);u.el('span','current',steps,'1 Payment details');u.el('i','',steps);u.el('span','',steps,'2 Review');u.el('i','',steps);u.el('span','',steps,'3 Confirmation');
      }
      P.sectionHead(E,E.pane,s.scenario==='limits'?'Manage this card':s.scenario==='dispute'?'Tell us what happened':s.scenario==='schedule'?'Transfer details':'Payment details',s.scenario==='dispute'?'Step 1 of 2':'USD');
      P.fields(E);
      P.formNotice(E);
      P.history(E,E.pane);
    };

    BASE.transactionBanner = (E) => {
      const { P } = S;
      const { ctx, s, u, F } = E;
      const m=ctx.model;
      const t=s.transactions.find(x=>x.id===m.values.transaction), banner=u.el('div','bk-detail-banner',E.pane), merchant=u.el('div','bk-merchant',banner);
      const info=u.el('div','',merchant);u.el('b','',info,t.name);u.el('small','bk-hint',info,`${t.id} / ${t.date} / Card ${s.cards[0].slice(-4)}`);u.el('b','',merchant,F.helpers.money(t.amount));P.badge(E,banner,'Posted','positive');
      P.button(E,banner,'Change transaction',{field:'transaction'},{set:['transaction','']},'link');
    };

    BASE.fields = (E) => {
      const { P } = S;
      const { s, u } = E;
      const grid=u.el('div','bk-grid',E.pane);s.fields.filter(f=>f.kind!=='transaction').forEach(f=>P.field(E,f,grid));
    };

    BASE.formNotice = (E) => {
      const { P } = S;
      const { ctx, s, u, F } = E;
      const m=ctx.model;
      if(['paybill','schedule'].includes(s.scenario)) {
        const account=s.accounts.find(a=>a.label===m.values.from);
        const payee=s.payees.find(p=>p.label===m.values.payee);
        P.notice(E,E.pane,account?`${account.label}: ${F.helpers.money(account.balance)} available. ${s.scenario==='schedule'?'The first transfer is processed on the start date.':'Your selected delivery date is shown in the payment review.'}`:'Payments use available funds in your selected source account. Delivery details are included in the review.','wallet');
        if(payee) {const band=u.el('div','bk-detail-banner',E.pane);P.sectionHead(E,band,payee.name,'Saved biller');u.el('small','bk-hint',band,`Biller account ending ${payee.suffix} / Electronic delivery / eBills available`);}
        if(s.scenario==='schedule')u.el('p','bk-note',E.pane,'Recurring transfers continue through the end date. You can change or cancel a future instruction in Payment activity.');
      } else if(s.scenario==='limits') P.notice(E,E.pane,'Daily limits apply to new card purchases. A frozen card cannot make new purchases; subscriptions and prior authorisations may still be processed.','shield');
      else P.notice(E,E.pane,'Include the facts that help explain your dispute. We will contact you through the secure message centre if supporting documents are needed.','file');
    };
  }
  env.template('use-bank/_form', () => ({ install }));
})();
