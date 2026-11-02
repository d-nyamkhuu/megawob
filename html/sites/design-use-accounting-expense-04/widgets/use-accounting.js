// Finance Pro expense presentation, using the workspace's original controls.
env.widget({
  task: 'use-accounting',
  site: 'design-use-accounting-expense-04',
  name: 'design',
  split: 'train',
  scenarios: ['expense'],
  template: 'use-accounting/workspace',
  design: {
    inset: 0,
    extraCss: `
.fin-expense { font-family:Arial,"Segoe UI",sans-serif; }
.fin-expense .af-input,.fin-expense .fin-memo { background:#fff; color:#171724; border:1px solid #a5cee9; border-radius:3px; box-shadow:inset 0 1px 2px #dceaf3; }
.fin-expense .af-btn,.fin-expense .af-option,.fin-expense .fin-receipt-action { color:#171724; background:linear-gradient(#fff,#e5f4ff); border:1px solid #a5cee9; border-radius:5px; box-shadow:inset 0 1px #fff,0 1px 2px #c6ddeb; }
.fin-expense .af-btn:hover,.fin-expense .af-option:hover { border-color:#329bea; }
/* Expense workspace: selector above the receipt, with entry fields below. */
.af-app.fin-expense { display:flex; flex-direction:column; gap:0; padding:0; border:1px solid #87c5f0; border-radius:11px; background:#f5fbff; overflow:hidden; }
.af-app.fin-expense { margin:0; }
.fin-expense .fin-report-title { flex:none; height:46px; display:flex; align-items:center; gap:18px; padding:0 23px; background:linear-gradient(110deg,#1684cf,#6fc4ed 62%,#e0f5ff); color:white; }
.fin-expense .fin-report-title strong { font-size:26px; letter-spacing:.3px; }
.fin-report-paper { display:inline-block; transform:rotate(-16deg); font-size:40px; color:white; text-shadow:2px 2px 2px #5285a6; }
.fin-report-paper svg { width:45px; height:47px; display:block; filter:drop-shadow(1px 2px 1px #477aa0); }
.af-app.fin-expense .af-work.expense { display:grid; grid-template-columns:minmax(0,1fr); grid-template-rows:var(--fin-selector-height) minmax(0,1fr) var(--fin-entry-height); gap:8px; flex:1; min-height:0; padding:0 16px 10px; overflow:hidden; }
.fin-selector { display:grid; grid-template-columns:minmax(0,1fr) 180px; grid-template-rows:27px minmax(0,1fr); column-gap:20px; min-height:0; }
.fin-selector-caption { grid-column:1/-1; margin:5px 5px 0; color:#0057b8; font-size:19px; line-height:22px; }
.fin-receipt-table { border:1px solid #a2c6de; background:linear-gradient(#fff,#e8f4fd); overflow:hidden; border-radius:4px; }
.fin-receipt-table { position:relative; padding-right:19px; }
.fin-table-scroll { position:absolute; top:0; right:0; bottom:0; width:19px; background:linear-gradient(90deg,#f9fcff,#e3edf4); border-left:1px solid #c3d5e2; display:flex; flex-direction:column; align-items:center; color:#71849b; font-size:20px; line-height:20px; pointer-events:none; }
.fin-table-scroll i { width:14px; height:40px; margin:1px 0; background:linear-gradient(90deg,#e6edf2,#bac8d3); border-radius:6px; border:1px solid #f8fcff; }
.fin-table-scroll span:last-child { margin-top:auto; }
.fin-receipt-heading span { color:#171724; }
.fin-receipt-heading,.fin-receipt-row { display:grid; grid-template-columns:9% 20% minmax(0,1fr) 27%; }
.fin-receipt-heading { height:25px; color:#15151a; background:linear-gradient(#fff,#e5f0f9); }
.fin-receipt-heading span,.fin-receipt-row span { padding:2px 14px; border-right:1px solid #c7ddeb; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }
.fin-receipt-heading span,.fin-receipt-row span { font-size:16px; }
.fin-receipt-heading span:first-child,.fin-receipt-row span:first-child { text-align:center; }
.fin-receipt-heading span:last-child,.fin-receipt-row span:last-child { text-align:center; border-right:0; }
.fin-expense .fin-receipt-row { width:100%; height:30px; min-height:0; margin:0; padding:0; border:0; border-bottom:1px solid #ddeaf3; border-radius:0; background:#fff; box-shadow:none; color:#171724; font-size:16px; text-align:left; }
.fin-expense .fin-receipt-row:nth-child(even) { background:#f3f9fd; }
.fin-expense .fin-receipt-row.selected { background:linear-gradient(#39a4f0,#2f94df); color:white; }
.fin-receipt-actions { display:flex; flex-direction:column; gap:4px; padding-top:0; }
.fin-receipt-action { display:flex; align-items:center; gap:10px; flex:1; min-height:0; padding:2px 12px; font-size:15px; background:linear-gradient(#fff,#e0eaf2); box-shadow:inset 0 1px #fff; }
.fin-receipt-action>span:first-child { width:20px; text-align:center; font-weight:bold; font-size:25px; line-height:1; color:#65af3b; text-shadow:0 1px white; }
.fin-receipt-action:nth-child(2)>span:first-child { color:#d46970; }
.fin-receipt-action:nth-child(n+3)>span:first-child { color:#7da8cd; }
.fin-receipt-action>span:first-child svg { display:block; width:24px; height:24px; filter:drop-shadow(0 1px 1px #b3c7d4); }
.fin-scan-area { min-height:0; overflow:hidden; position:relative; background:#a5a5a3; border:1px solid #929a9d; }
.fin-source-frame { width:100%; height:100%; max-height:none; border:0; background:transparent; }
.fin-source-frame .af-pane { height:100%; max-height:none; background:transparent; }
.fin-expense .fin-source-frame .af-content { background:transparent; padding:0; }
.fin-source-frame .af-viewerbar,.fin-source-frame .af-note,.fin-source-frame .af-history { display:none; }
.fin-source-frame .af-paper { width:310px; margin:0 auto; padding:15px 24px; background:#eee9df; border:1px solid #d3cbbd; border-radius:1px; color:#393731; box-shadow:1px 2px 4px #777; font:14px/1.25 'Courier New',monospace; }
.fin-source-frame .af-paper * { font-family:'Courier New',monospace; color:#393731; font-size:14px; }
.fin-source-frame .af-paper h3 { text-align:center; font-size:20px; margin:0 0 3px; }
.fin-source-frame .af-summarybox { max-width:310px; margin:0 auto; background:#eee9df; border:0; border-radius:0; font:13px 'Courier New',monospace; }
.fin-source-frame .af-summarybox { display:none; }
.fin-source-frame .af-paper { min-height:390px; background-color:#eee9df; background-image:linear-gradient(169deg,transparent 18%,#fff8 19%,transparent 20%,transparent 55%,#9992 56%,transparent 58%),linear-gradient(25deg,#aaa1,transparent 35%,#fff5 36%,transparent 38%),url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='260' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.085' numOctaves='3' seed='7' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.16'/%3E%3C/svg%3E"); }
.fin-source-frame .af-paper .fin-receipt-address { text-align:center; }
.fin-source-frame .af-paper .fin-thermal-line { display:flex; justify-content:space-between; gap:10px; min-height:20px; }
.fin-source-frame .af-paper .fin-thermal-line span:first-child { max-width:185px; }
.fin-source-frame .af-paper .fin-thermal-line span:last-child { white-space:nowrap; }
.fin-source-frame .af-paper .fin-thermal-space { height:17px; }
.fin-source-frame .af-paper .fin-thermal-total { border-top:1px dashed #8b857b; margin-top:5px; padding-top:5px; }
.fin-source-frame .af-paper .fin-thermal-thanks { text-align:center; }
.fin-source-frame .af-paper,.fin-source-frame .af-paper * { font-size:16px; }
.fin-source-frame .af-paper h3 { font-size:24px; }
.fin-source-frame .af-paper .fin-thermal-space { height:20px; }
.fin-source-frame .af-paper { background-blend-mode:luminosity; }
.fin-scan-area { background-color:#a5a5a3; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.65' numOctaves='3' seed='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.16'/%3E%3C/svg%3E"); }
.fin-entry { position:relative; min-height:0; border:1px solid #b0d7f0; border-radius:7px; overflow:visible; background:#fff; padding-top:27px; }
.fin-entry-title { position:absolute; top:0; left:0; right:0; height:27px; margin:0; padding:2px 12px; font-size:19px; color:#0057b8; border-bottom:1px solid #c2e0f3; background:linear-gradient(#f2fbff,#e5f4fd); }
.fin-editor-frame { border:0; height:100%; width:100%; background:#fff; }
.fin-editor-frame .af-pane { height:100%; max-height:none; border:0; }
.fin-expense .fin-editor-frame .af-content { padding:9px 12px; background:#fff; }
.fin-editor-frame .af-recordtitle,.fin-editor-frame .af-documentmeta,.fin-editor-frame .af-summarybox { display:none; }
.fin-expense .fin-editor-frame .af-fields { display:grid; grid-template-columns:42% minmax(0,1fr); gap:7px 24px; }
.fin-expense .fin-editor-frame .af-field { display:flex; align-items:center; gap:10px; margin:0; }
.fin-editor-frame .af-field label { flex:none; width:80px; font-size:15px; color:#171724; }
.fin-editor-frame .af-field :is(input,button) { width:100%; min-width:0; min-height:29px; height:29px; padding:3px 7px; font-size:15px; border-radius:3px; }
.fin-editor-frame .af-field.fin-field-date { grid-column:1; grid-row:1; }
.fin-editor-frame .af-field.fin-field-merchant { grid-column:1; grid-row:2; }
.fin-editor-frame .af-field.fin-field-category { grid-column:1; grid-row:3; }
.fin-editor-frame .af-field.fin-field-amount { grid-column:2; grid-row:1; padding-right:198px; }
.fin-editor-frame .af-field.fin-field-project { grid-column:2; grid-row:2; padding-right:198px; }
.fin-editor-frame .af-field.fin-field-memo { grid-column:2; grid-row:3; align-items:flex-start; }
.fin-editor-frame .fin-field-date input { max-width:165px; }
.fin-editor-frame .fin-field-date { position:relative; }
.fin-date-calendar { position:absolute; left:225px; top:0; width:30px; height:29px; line-height:26px; text-align:center; color:#358bdb; border:1px solid #9ebed7; border-radius:0 3px 3px 0; background:linear-gradient(#fff,#dce8f1); font-size:22px; pointer-events:none; }
.fin-editor-frame .fin-field-date input { padding-right:32px; }
.af-app.fin-expense .fin-editor-frame .af-field label { font-size:16px; line-height:20px; }
.af-app.fin-expense .fin-editor-frame .af-field :is(input,textarea,button,button span) { font-size:15px; }
.fin-editor-frame .fin-field-amount input { max-width:115px; text-align:left; }
.fin-editor-frame .fin-field-project button { max-width:310px; }
.fin-editor-frame .fin-field-amount label { white-space:nowrap; }
.fin-editor-frame .fin-field-memo textarea { min-height:43px; height:43px; resize:none; width:100%; padding:4px; }
.fin-file-receipt { color:#0053a2; }
.fin-file-receipt svg { display:none; }
.fin-expense .fin-file-receipt { position:absolute; right:10px; top:39px; width:188px; height:51px; padding:8px 14px; font-size:17px; font-weight:bold; color:#0053a2; background:linear-gradient(#fff,#dce6ee); }
.fin-file-receipt::before { content:''; display:inline-block; width:36px; height:29px; margin-right:10px; vertical-align:middle; background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 32'%3E%3Cdefs%3E%3ClinearGradient id='g' x2='0' y2='1'%3E%3Cstop stop-color='%23efffb4'/%3E%3Cstop offset='1' stop-color='%2358ad1d'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M3 3h12l4 4h18v22H3z' fill='%23b4df6e' stroke='%23597d2e'/%3E%3Cpath d='M4 10h34l-4 20H1z' fill='url(%23g)' stroke='%234b7f20' stroke-width='1.5'/%3E%3Cpath d='M5 12h30' stroke='%23fff'/%3E%3C/svg%3E") center/contain no-repeat; }
  .fin-expense.fin-compact .fin-report-title { height:36px; }
  .fin-expense.fin-compact .fin-report-title strong { font-size:21px; }
  .fin-expense.fin-compact .af-work.expense { gap:5px; padding:0 10px 7px; }
  .fin-expense.fin-compact .fin-selector { grid-template-columns:minmax(0,1fr) 145px; column-gap:12px; grid-template-rows:25px minmax(0,1fr); }
  .fin-expense.fin-compact .fin-receipt-row { height:19px; font-size:13px; }
  .fin-expense.fin-compact .fin-receipt-heading { height:21px; }
  .fin-expense.fin-compact .fin-receipt-heading span,.fin-expense.fin-compact .fin-receipt-row span { font-size:13px; }
  .fin-expense.fin-compact .fin-receipt-heading span,.fin-expense.fin-compact .fin-receipt-row span { padding:2px 5px; }
  .fin-expense.fin-compact .fin-receipt-action { font-size:12px; padding:1px 6px; gap:4px; }
  .fin-expense.fin-compact .fin-editor-frame .af-content { padding:7px 8px; }
  .fin-expense.fin-compact .fin-editor-frame .af-fields { gap:5px 10px; }
  .fin-expense.fin-compact .fin-editor-frame .af-fields { grid-template-columns:1fr 1fr; }
  .fin-expense.fin-compact .fin-editor-frame .af-field { gap:5px; }
  .fin-expense.fin-compact .fin-editor-frame .af-field label { width:58px; font-size:12px; }
  .fin-expense.fin-compact .fin-editor-frame .af-field :is(input,button) { height:25px; min-height:25px; font-size:12px; }
  .fin-expense.fin-compact .fin-file-receipt { top:35px; width:100px; height:26px; padding:2px 4px; font-size:12px; }
  .fin-expense.fin-compact .fin-file-receipt::before { width:20px; height:19px; margin-right:4px; }
  .fin-expense.fin-compact .fin-editor-frame .fin-field-amount input { max-width:80px; }
  .fin-expense.fin-compact .fin-editor-frame .fin-field-project button { max-width:none; }
  .fin-expense.fin-compact .fin-editor-frame .fin-field-memo textarea { min-height:25px; height:25px; }
  .fin-expense.fin-compact .fin-date-calendar { display:none; }
  .fin-expense.fin-compact .fin-editor-frame .fin-field-date input { padding-right:7px; }
  .af-app.fin-expense.fin-compact .fin-editor-frame .af-field label { font-size:12px; line-height:15px; }
  .af-app.fin-expense.fin-compact .fin-editor-frame .af-field :is(input,textarea,button,button span) { font-size:12px; }
  .fin-expense.fin-compact .fin-source-frame .af-paper { width:270px; padding:10px 18px; }

.fin-expense.fin-compact .fin-field-amount,.fin-expense.fin-compact .fin-field-project { padding-right:110px; }
`,
    parts: {
      frame: (base, S) => ctx => {
        const root = base(ctx);
        const fullSelector = Math.max(208, 54 + S.spec.receipts.length * 30);
        const compact = ctx.size.height < fullSelector + 364 || ctx.size.width < 760;
        root.classList.add('fin-expense');
        root.classList.toggle('fin-compact', compact);
        // Leave room for every receipt, including the longer held-out reports.
        const rowHeight = compact ? 19 : 30;
        const selectorHeight = Math.max(compact ? 125 : 208,
          (compact ? 25 + 21 : 27 + 25) + S.spec.receipts.length * rowHeight + 2);
        root.style.setProperty('--fin-selector-height', selectorHeight + 'px');
        root.style.setProperty('--fin-entry-height', (compact ? 150 : 172) + 'px');
        return root;
      },
      expenseField: (base, S) => (grid, editor, i, key, label) => {
        const box = base(grid, editor, i, key, label);
        box.classList.add('fin-field-' + key);
        const input = box.querySelector('input');
        if (input) input.placeholder = '';
        if (key === 'date') S.ctx.util.el('span','fin-date-calendar',box,'▦');
        return box;
      },
      buildReceipt: (base, S) => (...args) => {
        const result = base(...args);
        const fields = S.panes.editor.content.querySelector('.af-fields');
        const memo = S.ctx.util.el('div','af-field fin-field-memo',fields);
        S.ctx.util.el('label','',memo,'Memo:');
        const input = S.ctx.util.el('textarea','fin-memo',memo);
        input.setAttribute('aria-label','Memo');
        if (S.root.dataset.ready) S.ctx.reanchor();
        return result;
      },
      receiptPaper: (base, S) => (parent, receipt) => {
          const paper = S.ctx.util.el('div','af-paper',parent);
          const el = S.ctx.util.el;
          el('h3','fin-receipt-merchant',paper,receipt.merchant.toUpperCase());
          el('div','fin-receipt-address',paper,receipt.city);
          el('div','fin-receipt-address',paper,'SALES RECEIPT');
          const line = (label,value,cls='') => {
            const row = el('div','fin-thermal-line '+cls,paper);
            el('span','',row,label); el('span','',row,value);
          };
          el('div','fin-thermal-space',paper);
          line(receipt.category.toUpperCase(),(receipt.amount/100).toFixed(2));
          line('PROJECT',receipt.project);
          el('div','fin-thermal-space',paper);
          line('SUBTOTAL',(receipt.amount/100).toFixed(2));
          line('SALES TAX','Included');
          line('TOTAL',(receipt.amount/100).toFixed(2),'fin-thermal-total');
          el('div','fin-thermal-space',paper);
          line('CARD',(receipt.amount/100).toFixed(2));
          el('div','fin-thermal-space',paper);
          line(receipt.date,receipt.id);
          el('div','fin-thermal-thanks',paper,'Thank you for your business');
          return paper;
      },
      rendered: (base, S) => function (...args) {
        const result = base.apply(this, args);
        const el = S.ctx.util.el;
        S.root.classList.add('fin-expense');
        const title = el('div','fin-report-title');
        const art=el('span','fin-report-paper',title);
        art.innerHTML='<svg viewBox="0 0 44 48" aria-hidden="true"><path d="M5 10h30v34H5z" fill="#a2c7e7" stroke="#547aa5"/><path d="M10 3h29v36H10z" fill="#f7fcff" stroke="#6390bf"/><path d="M15 10h5v5h-5zM25 10h8M15 20h18M15 25h18M15 30h13" fill="none" stroke="#6595c9" stroke-width="2"/></svg>';
        el('strong','',title,'Expense Report');
        const selector = el('section','fin-selector');
        el('h3','fin-selector-caption',selector,'Receipts for This Report');
        const table = el('div','fin-receipt-table',selector);
        const heads = el('div','fin-receipt-heading',table);
        ['#','Date','Merchant','Amount'].forEach(t=>el('span','',heads,t));
        const rows = el('div','fin-receipt-rows',table);
        Object.values(S.receiptButtons).forEach((button,i)=>{
          const receipt = S.spec.receipts[i];
          const [year,month,day]=receipt.date.split('-');
          const displayDate=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][Number(month)-1]+' '+Number(day)+', '+year;
          button.classList.add('fin-receipt-row');
          button.replaceChildren();
          [String(i+1),displayDate,receipt.merchant,'$'+(receipt.amount/100).toFixed(2)].forEach(t=>el('span','',button,t));
          rows.append(button);
        });
        const rail=el('div','fin-table-scroll',table);
        el('span','',rail,'⌃'); el('i','',rail); el('span','',rail,'⌄');
        const actions = el('div','fin-receipt-actions',selector);
        [['⊕','Add Receipt...'],['×','Remove Receipt'],['▧','Rotate Left'],['▧','Rotate Right'],['⌕','Zoom In']].forEach(([icon,label])=>{
          const button = el('button','fin-receipt-action',actions);
          const art=el('span','',button);
          const drawing=label.startsWith('Add') ? '<circle cx="13" cy="13" r="10" fill="#8dce55" stroke="#5b9534"/><path d="M13 7v12M7 13h12" stroke="white" stroke-width="3"/>' : label.startsWith('Remove') ? '<path d="m5 5 16 16M21 5 5 21" stroke="#cf6c73" stroke-width="5" stroke-linecap="round"/>' : label==='Zoom In' ? '<circle cx="10" cy="10" r="7" fill="#d8efff" stroke="#6f9abd" stroke-width="2"/><path d="m15 16 8 8" stroke="#c3a75b" stroke-width="4"/><path d="M10 6v8M6 10h8" stroke="#71a6ca" stroke-width="2"/>' : '<path d="M6 4h13l6 6v15H6z" fill="#edf7ff" stroke="#7f9fbc"/><path d="M19 4v7h6M10 13h10M10 17h10M10 21h7" fill="none" stroke="#91b3ce"/>';
          art.innerHTML='<svg viewBox="0 0 28 28" aria-hidden="true">'+drawing+'</svg>';
          el('span','',button,label);
          button.type='button';
          button.addEventListener('click',()=>env.log('decoy',{label}));
        });
        const frame = pane => /scroll|frame/i.test(pane.parentElement.className) ? pane.parentElement : pane;
        const source = frame(S.panes.source.pane);
        source.classList.add('fin-source-frame');
        const scan = el('div','fin-scan-area');
        scan.append(source);
        const entry = el('section','fin-entry');
        el('h3','fin-entry-title',entry,'Expense Details');
        const editor = frame(S.panes.editor.pane);
        editor.classList.add('fin-editor-frame');
        entry.append(editor);
        const commit = Object.entries(S.refs).find(([key])=>key.includes('commit'))?.[1];
        if(commit) { commit.classList.add('fin-file-receipt'); entry.append(commit); }
        S.work.replaceChildren(selector,scan,entry);
        S.root.replaceChildren(title,S.work,...[S.popup,S.flyout].filter(x=>x && x.nodeType===1));
        Object.values(S.panes).forEach(pane=>{ if(typeof pane.refresh==='function') pane.refresh(); });
        S.root.dataset.ready = 'true';
        return result;
      }
    }
  },
});
