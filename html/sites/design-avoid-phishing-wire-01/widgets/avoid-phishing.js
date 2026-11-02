// Design on the shared avoid-phishing/classic widget.
env.widget({
  task: 'avoid-phishing',
  site: 'design-avoid-phishing-wire-01',
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
      detail(base, S) { return function(ctx) { base(ctx); S.els.detail.classList.add('wire-detail'); }; },
      list(base, S) { return function(ctx) {
        const P=S.P, els=S.els, pane=els.pane=P.mark({pane:true},ctx.util.el('div','sp-list wire-table',els.content));
        pane.setAttribute('aria-label','Payment requests');
        const head=ctx.util.el('div','wire-table-head',pane);
        for (const x of ['ID','Vendor','Invoice No.','Invoice Date','Amount (USD)','Requested Bank Details','Match Status']) ctx.util.el('span','',head,x);
        for (const x of ctx.spec.records) P.row(ctx,x);
        pane.addEventListener('scroll',()=>{if(ctx===P.ctx)ctx.patch({scroll:pane.scrollTop});});
      }; },
      row(base, S) { return function(ctx,x) {
        const P=S.P, s=ctx.spec, F=env.taskDef, row=P.mark({row:x.id},ctx.util.el('button','sp-row wire-table-row',S.els.pane));
        row.type='button';
        const vals=[x.id, x.name, x.subject, x.date || '', F.helpers.money(x.amount), x.bank, x.risky?'⚠  Bank details changed':'✓  Match'];
        for (const v of vals) ctx.util.el('span','wire-cell',row,String(v));
        row.addEventListener('click',()=>P.send(ctx,{open:x.id})); S.rows.set(x.id,row); P.rowDecorated(ctx,row,x); return row;
      }; },
      empty(base, S) { return function(ctx) {
        const el=ctx.util.el('div','wire-empty',S.els.reading);
        ctx.util.el('strong','',el,'Select an invoice request');
      }; },
      ledger(base, S) { return function(ctx,x) {
        const P=S.P, s=ctx.spec, F=env.taskDef, m=ctx.model, u=ctx.util, reading=S.els.reading, actions=S.els.actions;
        const grid=u.el('div','wire-detail-grid',reading);
        const inv=u.el('section','wire-detail-card',grid); u.el('h3','',inv,'Invoice Details');
        const master=u.el('section','wire-detail-card',grid); u.el('h3','',master,'Vendor Master Details');
        const doc=u.el('section','wire-detail-card wire-doc',grid); u.el('h3','',doc,'Invoice Document');
        P.meta(ctx,inv,[['Invoice ID',x.id],['Invoice No.',x.subject],['Invoice Date',x.date||'Mar 3, 2006'],['Due Date','Apr 2, 2006'],['Amount (USD)',F.helpers.money(x.amount)],['Vendor',x.name],['Description',x.subject]]);
        u.el('h4','',inv,'Requested Bank Details'); u.el('div','wire-bank-request',inv,x.bank);
        P.meta(ctx,master,[['Vendor ID',x.vendorId||'V-1001'],['Vendor Name',x.name],['Address',x.address||`${s.org.name}\n${s.org.domain}`],['Status','Active'],['Default Payment Terms','Net 30']]);
        u.el('h4','wire-bank-heading',master,'Bank Details (on file)'); u.el('div','wire-bank-master',master,x.master);
        const paper=u.el('div','wire-paper',doc);
        const paperHead=u.el('div','wire-paper-head',paper); u.el('span','wire-globe',paperHead,'◎');
        u.el('strong','',paperHead,x.name); u.el('span','wire-paper-address',paperHead,s.org.name);
        u.el('h2','',paper,'INVOICE');
        const paperMeta=u.el('div','wire-paper-meta',paper); u.el('span','',paperMeta,`Invoice No.: ${x.subject}`); u.el('span','',paperMeta,`Invoice Date: ${x.date||'Mar 3, 2006'}`); u.el('span','',paperMeta,`Amount: ${F.helpers.money(x.amount)}`);
        const paperTable=u.el('div','wire-paper-table',paper); u.el('strong','',paperTable,'Description'); u.el('strong','',paperTable,'Amount'); u.el('span','',paperTable,x.subject); u.el('span','',paperTable,F.helpers.money(x.amount));
        u.el('div','wire-paper-total',paper,`Total (USD)     ${F.helpers.money(x.amount)}`);
        u.el('div','wire-actions-label',actions,'Actions');
        P.button(ctx,actions,'🪙  Pay Invoice','pay',true); P.button(ctx,actions,'⏸  Hold Invoice','hold'); P.button(ctx,actions,'⚑  Report Bank Detail Change','flag');
        P.button(ctx,actions,'Release hold','release');
        if(m.done.includes(x.id)||m.flagged.includes(x.id)||m.held.includes(x.id)) u.el('span','sp-badge',actions,`Status: ${m.done.includes(x.id)?'Paid':m.flagged.includes(x.id)?'Reported': 'On hold'}`);
      }; },
    },
  },
});
