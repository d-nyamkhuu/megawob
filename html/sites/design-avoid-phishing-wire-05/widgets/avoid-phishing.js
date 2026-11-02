// Design on the shared avoid-phishing/classic widget.
env.widget({
  task: 'avoid-phishing',
  site: 'design-avoid-phishing-wire-05',
  name: 'design',
  split: 'train',
  scenarios: ['wire'],
  template: 'avoid-phishing/classic',
  design: {
    rowHeight: 31,
    parts: {
      layout(base, S) { return function(ctx) {
        const P = S.P, els = S.els;
        els.app = P.frame(ctx);
        els.shell = ctx.util.el('div', 'sp-shell wire-shell', els.app);
        els.nav = ctx.util.el('aside', 'sp-nav wire-summary', els.shell);
        P.navigation(ctx, els.shell);
        els.work = ctx.util.el('main', 'sp-work wire-work', els.shell);
        els.toolbar = ctx.util.el('div', 'sp-toolbar wire-title', els.work, 'Invoice Queue');
        els.content = ctx.util.el('div', 'sp-content wire-content', els.work);
        els.footer = ctx.util.el('div', 'sp-status wire-status', els.app);
      }; },
      navigation(base, S) { return function(ctx, shell) {
        const nav = S.els.nav, records = ctx.spec.records;
        const util = ctx.util;
        util.el('strong', '', nav, 'Invoice Queue');
        for (const [icon, label, n] of [['▣','All Requests',records.length],['✓','Match',records.filter(x=>!x.risky).length],['⚠','Bank Details Changed',records.filter(x=>x.risky).length],['⊖','On Hold',0],['▤','Reports',0]]) {
          const row = util.el('div', 'wire-count-row', nav);
          util.el('span', 'wire-count-icon', row, icon); util.el('span', '', row, label); util.el('span', 'wire-count', row, String(n));
        }
        const vendors = util.el('section', 'wire-vendors', nav);
        util.el('strong', '', vendors, 'Vendors');
        for (const [icon,label,n] of [['●','All Vendors','248'],['●','Active','210'],['●','Inactive','38']]) {
          const row=util.el('div','wire-count-row',vendors); util.el('span','wire-count-icon',row,icon); util.el('span','',row,label); util.el('span','wire-count',row,n);
        }
      }; },
      toolbar(base, S) { return function(ctx) {}; },
      rendered(base,S) { return function(ctx) {
        base(ctx);
        // Only the rows below the sticky heading form the list's usable viewport.
        const pane=S.els.pane, head=pane.querySelector('.wire-table-head');
        ctx.patch({paneH:pane.clientHeight-head.getBoundingClientRect().height});
      }; },
      detail(base, S) { return function(ctx) { base(ctx); S.els.detail.classList.add('wire-detail'); }; },
      list(base, S) { return function(ctx) {
        const P=S.P, els=S.els, pane=els.pane=P.mark({pane:true},ctx.util.el('div','sp-list wire-table',els.content));
        pane.setAttribute('aria-label','Payment requests');
        const head=ctx.util.el('div','wire-table-head',pane);
        for (const x of ['Req #','Invoice #','Vendor','Invoice Date','Due Date','Amount (USD)','Bank / Account','Status']) ctx.util.el('span','',head,x);
        for (const x of ctx.spec.records) P.row(ctx,x);
        // The oracle uses this existing layout token to decide which rows need scrolling.
        const firstRow=S.rows.values().next().value;
        if(firstRow) S.D.rowHeight=firstRow.getBoundingClientRect().height;
        pane.addEventListener('scroll',()=>{if(ctx===S.ctx)ctx.patch({scroll:pane.scrollTop});});
      }; },
      row(base, S) { return function(ctx,x) {
        const P=S.P, s=ctx.spec, F=env.taskDef, row=P.mark({row:x.id},ctx.util.el('button','sp-row wire-table-row',S.els.pane));
        row.type='button';
        const m=ctx.model;
        const vals=[x.id, x.subject, x.name, x.date || '03/03/2006', '04/02/2006', F.helpers.money(x.amount), x.bank, m.done.includes(x.id)?'Paid':m.held.includes(x.id)?'On hold':m.flagged.includes(x.id)?'Reported':'Pending'];
        for (const v of vals) ctx.util.el('span','wire-cell',row,String(v));
        row.addEventListener('click',()=>P.send(ctx,{open:x.id})); S.rows.set(x.id,row); P.rowDecorated(ctx,row,x); return row;
      }; },
      empty(base, S) { return function(ctx) {
        const first=ctx.spec.records[0];
        if (!first) return;
        S.rows.get(first.id)?.classList.add('selected');
        S.P.ledger(ctx,first);
      }; },
      ledger(base, S) { return function(ctx,x) {
        const P=S.P, s=ctx.spec, F=env.taskDef, m=ctx.model, u=ctx.util, reading=S.els.reading, actions=S.els.actions;
        const grid=u.el('div','wire-detail-grid',reading);
        const inv=u.el('section','wire-detail-card',grid); u.el('h3','',inv,`Invoice Request Details  –  ${x.id}`);
        const master=u.el('section','wire-detail-card',grid); u.el('h3','',master,`Vendor Master  –  ${x.name}`);
        P.meta(ctx,inv,[['Vendor:',x.name],['Invoice #:',x.subject],['Invoice Date:',x.date||'03/03/2006'],['Due Date:','04/02/2006'],['Amount (USD):',F.helpers.money(x.amount)],['Description:',x.subject],['Payment Method:','Wire Transfer'],['Bank / Account:',x.bank],['Reference:',s.reference]]);
        const attachment=u.el('div','wire-attachment',inv);u.el('span','',attachment,'Attachments:');
        const file=u.el('a','',attachment,`📎  Invoice_${x.subject}.pdf (56 KB)`);file.href='#';file.addEventListener('click',e=>{e.preventDefault();env.log('decoy',{what:'attachment'});});
        P.meta(ctx,master,[['Vendor ID:',x.vendorId||`V-${1000+Number(x.id)}`],['Name:',x.name],['Address:',x.address||`${s.org.name}\n${s.org.domain}`],['Phone:','(217) 555-0186'],['Contact:','Accounts Receivable'],['Default Payment Method:','Wire Transfer'],['Preferred Bank:',x.master],['Account Number:',x.master]]);
        actions.classList.add('wire-decisions');
        const decision=u.el('section','wire-decision-main',actions);
        u.el('h3','',decision,`Payment Decision  –  ${x.id}`);
        const options=u.el('div','wire-options',decision);u.el('span','wire-action-caption',options,'Action:');
        for (const [label,action] of [['Pay Invoice','pay'],['Hold Invoice','hold'],['Report Bank Detail Change','flag'],['Release hold','release']]) {
          const b=P.button(ctx,options,label,action,action==='pay');
          b.addEventListener('click',()=>{if(ctx.model.open!==x.id)P.send(ctx,{open:x.id},false);},true);
        }
        const comments=u.el('label','wire-comments',decision,'Comments:');
        const comment=u.el('textarea','',comments);comment.setAttribute('aria-label','Comments');
        const links=u.el('aside','wire-quick-links',actions);u.el('strong','',links,'Quick Links');
        for (const [icon,label] of [['▣','View Vendor History'],['▧','View Purchase Order'],['✉','View Related Emails'],['📎','View Attachments']]) {
          const a=u.el('a','',links,`${icon}  ${label}`);a.href='#';a.addEventListener('click',e=>{e.preventDefault();env.log('decoy',{what:'quick-link',label});});
        }
        if(m.done.includes(x.id)||m.flagged.includes(x.id)||m.held.includes(x.id)) u.el('span','sp-badge',decision,`Status: ${m.done.includes(x.id)?'Paid':m.flagged.includes(x.id)?'Reported': 'On hold'}`);
      }; },
    },
  },
});
