// Design on the shared avoid-phishing/classic widget.
env.widget({
  task: 'avoid-phishing',
  site: 'design-avoid-phishing-invoice-05',
  name: 'design',
  split: 'train',
  scenarios: ['invoice'],
  template: 'avoid-phishing/classic',
  design: {
    parts: {
      detail: (base, S) => (ctx) => {
        base(ctx);
        // Keep decisions outside the scrolling record, in the template's footer.
        S.els.actions.className = 'inv-actions';
      },
      empty: (base, S) => (ctx) => S.P.ledger(ctx, ctx.spec.records[0]),
      ledger: (base, S) => (ctx, x) => {
        const { reading, actions } = S.els;
        const s = ctx.spec, m = ctx.model, F = env.taskDef;
        const shell = ctx.util.el('div', 'inv-task', reading);
        const top = ctx.util.el('section', 'inv-paper inv-invoice', shell);
        const heading = ctx.util.el('div', 'inv-heading', top);
        ctx.util.el('span', 'inv-doc-icon', heading, '▤');
        ctx.util.el('h2', '', heading, `Invoice Details — ${s.reference}`);
        ctx.util.el('span', 'inv-status', heading, m.done.includes(x.id) ? 'Paid' : m.held.includes(x.id) ? 'On hold' : 'Unpaid');
        const upper = ctx.util.el('div', 'inv-upper', top);
        const facts = ctx.util.el('dl', 'inv-facts', upper);
        for (const [k,v] of [['Invoice No.',s.reference],['Invoice Date','May 14, 1996'],['Due Date','Jun 13, 1996'],['Amount',F.helpers.money(x.amount)],['Description',x.subject],['Reference',s.reference]]) {
          ctx.util.el('dt','',facts,k); ctx.util.el('dd','',facts,v);
        }
        const requested = ctx.util.el('section','inv-account',upper);
        ctx.util.el('h3','',requested,'Vendor Bank Details');
        const ra=ctx.util.el('dl','',requested);
        for (const [k,v] of [['Bank Name',x.bank],['Account Name',x.name],['Account No.','0123456789'],['Routing No.','071000013'],['Payment Method','ACH (Direct Deposit)']]) {ctx.util.el('dt','',ra,k);ctx.util.el('dd','',ra,v);}

        const vendor=ctx.util.el('section','inv-paper inv-vendor',shell);
        const vh=ctx.util.el('div','inv-heading',vendor);ctx.util.el('span','inv-doc-icon',vh,'♟');ctx.util.el('h2','',vh,'Vendor Master Record — V-1023');
        const lower=ctx.util.el('div','inv-lower',vendor);
        const vf=ctx.util.el('dl','inv-facts',lower);
        for(const [k,v] of [['Vendor ID','V-1023'],['Vendor Name',x.name],['Address',`1250 Market Street\n${s.org.name}, CA 95642`],['Phone','(916) 555-0199'],['Email',`ap@${x.domain}`],['Status','Active']]){ctx.util.el('dt','',vf,k);ctx.util.el('dd','',vf,v);}
        const master=ctx.util.el('section','inv-account inv-master',lower);
        ctx.util.el('h3','',master,'Vendor Master Payment Details'); const ma=ctx.util.el('dl','',master);
        for(const [k,v] of [['Terms','Net 30'],['Default Payment Method','ACH (Direct Deposit)'],['Bank Name',x.master],['Account No.','0123456789'],['Routing No.','071000013'],['Last Payment Date','Apr 15, 1996'],['YTD Payments','$12,480.00']]){ctx.util.el('dt','',ma,k);ctx.util.el('dd','',ma,v);}
        const bar=actions; shell.appendChild(bar); ctx.util.el('strong','',bar,'Payment');
        const form=ctx.util.el('div','inv-payment-fields',bar);
        for(const [label,value] of [['Payment Amount',F.helpers.money(x.amount)],['Payment Date','Jun 13, 1996'],['Payment Method','ACH (Direct Deposit)'],['Reference',s.reference],['Memo',x.subject]]){const f=ctx.util.el('div','inv-field',form);ctx.util.el('span','',f,label);ctx.util.el('span','inv-value',f,value);}
        const decision=ctx.util.el('div','inv-decision-label',bar,'Payment Decision');
        const buttons=ctx.util.el('div','inv-action-buttons',bar);
        S.P.button(ctx,buttons,'Pay','pay',true); S.P.button(ctx,buttons,'Hold','hold'); S.P.button(ctx,buttons,'Reject','flag');
        S.P.button(ctx,buttons,'Release hold','release');
        ctx.util.el('p','inv-request-status',shell,`Request status: ${m.done.includes(x.id)?'Paid':m.flagged.includes(x.id)?'Reported':m.held.includes(x.id)?'On hold':'Pending approval'}`);
      },
      list: (base,S) => (ctx) => {
        const pane=S.els.pane=S.P.mark({pane:true},ctx.util.el('div','sp-list',S.els.content));
        pane.setAttribute('aria-label','Invoices');
        const title=ctx.util.el('div','invoice-index-title',pane);
        ctx.util.el('span','inv-doc-icon',title,'▤');
        ctx.util.el('strong','',title,'Invoices');
        const head=ctx.util.el('div','sp-row invoice-table-head',pane);
        for(const h of ['Invoice No.','Vendor Name','Date','Amount','Status'])ctx.util.el('span','',head,h);
        for(const x of ctx.spec.records)S.P.row(ctx,x);
        const related=[
          ['JH-3390','Jordan Hardware','May 10, 1996','$680.00'],
          ['RVC-5512','Riverton Cleaners','May 08, 1996','$320.50'],
          ['FCL-7781','Foothill Communications','May 03, 1996','$2,140.00'],
          ['TC-4466','Tri-County Utilities','Apr 28, 1996','$982.17'],
          ['BKS-9901','Baker & Sons','Apr 25, 1996','$154.20'],
          ['SW-8830','Sunnyvale Waste','Apr 21, 1996','$415.00'],
          ['GRN-7710','Greenfields Landscaping','Apr 18, 1996','$875.00'],
          ['PC-6622','Pinecrest Computing','Apr 12, 1996','$1,060.00'],
          ['LIB-3377','Library World','Apr 09, 1996','$540.00'],
          ['CIT-2288','City Hardware','Apr 02, 1996','$298.75'],
          ['MT-1199','Metro Telephone','Mar 28, 1996','$613.40'],
          ['A1-1042','A1 Janitorial','Mar 22, 1996','$260.00'],
          ['HB-7722','Hillside Bookstore','Mar 15, 1996','$124.90'],
          ['RPD-5590','Riverton Printing','Mar 10, 1996','$965.00'],
          ['CS-3178','County Sanitation','Mar 03, 1996','$430.25'],
          ['EL-8841','ElectroLight','Feb 26, 1996','$2,310.00'],
          ['FR-6033','Franklin Rental','Feb 20, 1996','$780.00'],
          ['NW-1188','Northwest Paper','Feb 14, 1996','$412.60'],
          ['AV-4450','Alvarez Motors','Feb 07, 1996','$1,125.00']
        ];
        for(const values of related){const row=ctx.util.el('div','sp-row invoice-table-row invoice-index-extra',pane);for(const value of [...values,'Unpaid'])ctx.util.el('span','',row,value);}
        pane.addEventListener('scroll',()=>{if(ctx===S.ctx)ctx.patch({scroll:pane.scrollTop});});
      },
      row: (base,S) => (ctx,x) => {
        const F=env.taskDef, s=ctx.spec, row=S.P.mark({row:x.id},ctx.util.el('button','sp-row invoice-table-row',S.els.pane));
        row.type='button';row.setAttribute('aria-label',`${x.name} ${x.subject} ${F.helpers.money(x.amount)}`);
        const date=x.date||'May 14, 1996';
        for(const value of [x.reference||s.reference,x.name,date,F.helpers.money(x.amount),'Unpaid'])ctx.util.el('span','',row,value);
        row.addEventListener('click',()=>S.P.send(ctx,{open:x.id}));S.rows.set(x.id,row);S.P.rowDecorated(ctx,row,x);return row;
      },
    },
  },
});
