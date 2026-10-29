// Folio workspace defaults; replace tokens and parts to restyle this design.
env.widget({
  task: 'use-accounting',
  site: 'design-use-accounting-approve-03',
  name: 'design',
  split: 'train',
  scenarios: ['approve'],
  template: 'use-accounting/workspace',
  design: {
    extraCss: String.raw`

#lp-desk {
  --gap:14px; --top-h:40%; --policy-h:21%;
  --lower-top:calc(var(--top-h) + var(--policy-h) + var(--gap) + var(--gap));
  --lower-h:calc(100% - var(--lower-top));
  --invoice-head:90px; --invoice-row:40px; --staff-head:82px;
  --staff-row:clamp(19px, calc((var(--lower-h) - var(--staff-head) - 10px) / 4), 35px);
  position:relative; display:block; width:100%; height:100%; inset:auto; box-sizing:border-box;
  min-height:0; margin:0; padding:0; border:0 !important;
  background:transparent !important; box-shadow:none !important; overflow:visible;
  color:#0b142d; font:14px/1.4 Arial,sans-serif;
}

#lp-desk * { font-family:Arial,sans-serif !important; font-size:14px !important; color:#0b142d; box-sizing:border-box; }

#lp-desk * { background-color:transparent !important; box-shadow:none !important; }

#lp-desk .lp-invoice-date, #lp-desk .lp-invoice-amount, #lp-desk .lp-policy-intro { border:0 !important; border-radius:0 !important; }

#lp-desk .lp-invoice-columns, #lp-desk .lp-staff-columns { border-radius:0 !important; }

#lp-desk .af-shell, #lp-desk .af-main, #lp-desk .af-work, #lp-desk .af-column,
#lp-desk .af-footer {
  display:contents; position:static; transform:none; overflow:visible;
}

#lp-desk .af-top, #lp-desk .af-sidebar, #lp-desk .af-heading, #lp-desk .af-metrics,
#lp-desk .af-toolbar, #lp-desk .af-history, #lp-desk .af-inspector,
#lp-desk .af-note, #lp-desk .af-footer > .af-notice,
#lp-desk .af-work > .af-column:nth-child(2) > .af-colhead { display:none; }

#lp-desk::before { content:''; position:absolute; inset:0 auto auto 0; width:calc(50% - 7px); height:var(--top-h); background:#fff; border:1px solid #e1e9f1; border-radius:8px; box-shadow:0 2px 3px #29466709, -3px -3px 12px #ffffff80; }

#lp-desk button { font:14px Arial,sans-serif !important; cursor:pointer; }

#lp-desk .af-work > .af-column:first-child > .af-colhead {
  position:absolute; top:0; left:0; width:calc(50% - 7px); height:var(--invoice-head);
  display:block; padding:15px 16px; border:0 !important; background:transparent !important; box-shadow:none !important;
}

#lp-desk .af-colhead > strong { font-size:18px !important; line-height:34px; }

#lp-desk .lp-faux-search { position:absolute; top:12px; left:143px; right:62px; height:34px; border:1px solid #d6e0ed; border-radius:6px; background:#fff !important; display:flex; gap:12px; align-items:center; padding:0 11px; color:#718099; font-size:13px !important; font-weight:400; white-space:nowrap; }

#lp-desk .lp-faux-search i { width:13px; height:13px; display:inline-block; border:1.6px solid #35496d; border-radius:50%; position:relative; flex:none; }

#lp-desk .lp-faux-search i::after { content:''; position:absolute; width:6px; height:1.5px; background:#35496d; right:-5px; bottom:-2px; transform:rotate(48deg); }

#lp-desk .lp-filter { position:absolute; top:12px; right:16px; height:34px; width:35px; border:1px solid #d6e0ed !important; border-radius:6px !important; background:#fff !important; color:#435575; padding:0; }

#lp-desk .lp-invoice-columns { position:absolute; left:0; right:0; bottom:0; height:34px; display:grid; grid-template-columns:17% 28% 21% 17% 17%; align-items:center; padding:0 20px; background:#f7f9fc !important; border-top:1px solid #e7edf4; border-bottom:1px solid #e0e8f2; }

#lp-desk .lp-invoice-columns span { color:#34496c; font-weight:600; font-size:13px !important; }

#lp-desk .af-invoice {
  position:absolute; left:0; top:calc(var(--lp-row) * var(--invoice-row));
  width:100%; height:var(--invoice-row); min-height:0; margin:0; padding:0 20px;
  display:grid; grid-template-columns:17% 28% 21% 17% 17%; align-items:center; text-align:left;
  border:0 !important; border-bottom:1px solid #e6edf5 !important; border-radius:0 !important; box-shadow:none !important; background:#fff !important;
}

#lp-desk .af-invoice.selected { background:#d8ebfc !important; }

#lp-desk .af-invoice > b { grid-column:1; font-weight:400; color:#34496c; }

#lp-desk .af-invoice.selected > b { color:#0878ff; }

#lp-desk .af-invoice > span:not([class]) { grid-column:2; }

#lp-desk .af-invoice .af-line { display:none; }

#lp-desk .lp-invoice-date { grid-column:3; grid-row:1; color:#34496c; }

#lp-desk .lp-invoice-amount { grid-column:4; grid-row:1; color:#34496c; }

#lp-desk .lp-invoice-status { grid-column:5; grid-row:1; justify-self:start; background:#ffedbc !important; border-radius:6px; padding:4px 10px; color:#312619; font-size:12px !important; }

#lp-desk .af-summarybox, #lp-desk .af-policy, #lp-desk .af-linehelp, #lp-desk .af-route { border:1px solid #e0e8f2 !important; border-radius:8px !important; background:#fff !important; box-shadow:0 2px 3px #29466709, -3px -3px 12px #ffffff70 !important; }

#lp-desk .af-summarybox { position:absolute; top:0; left:calc(50% + 7px); width:calc(50% - 7px); height:var(--top-h); margin:0; padding:78px 18px 18px; display:block; }

#lp-desk .af-summarybox h4 { position:absolute; top:18px; left:18px; margin:0; font-size:22px !important; font-weight:700; }

#lp-desk .lp-status { position:absolute; top:19px; left:163px; padding:5px 10px; background:#ffedbc !important; color:#312619; border-radius:6px; font-size:12px !important; }

#lp-desk .af-summarybox .af-kv { width:51%; height:35px; display:grid; grid-template-columns:35% 65%; border:0 !important; align-items:center; }

#lp-desk .af-summarybox .af-kv > span { color:#53658b; }

#lp-desk .af-summarybox .af-kv > b { font-weight:400; font-size:15px !important; text-align:left; }

#lp-desk .lp-detail-extra { position:absolute; top:78px; right:18px; width:44%; }

#lp-desk .lp-detail-extra > div { display:grid; grid-template-columns:40% 60%; align-items:center; height:35px; }

#lp-desk .lp-detail-extra span { color:#53658b; }

#lp-desk .lp-detail-extra b { font-weight:400; font-size:14px !important; }

#lp-desk .af-policy { position:absolute; left:0; top:calc(var(--top-h) + var(--gap)); width:100%; height:var(--policy-h); padding:14px 16px; margin:0; display:block; }

#lp-desk .af-policy h3 { font-size:18px !important; margin:0; font-weight:700; }

#lp-desk .lp-policy-intro { position:absolute; top:19px; left:355px; right:130px; font-size:13px !important; color:#53658b; }

#lp-desk .lp-edit-policy { position:absolute; right:16px; top:11px; height:35px; width:104px; background:#f7f9fc !important; border:1px solid #d3dfed !important; border-radius:6px !important; box-shadow:none !important; font-size:13px !important; }

#lp-desk .af-policy ol { position:absolute; left:16px; right:16px; top:55px; bottom:27px; margin:0; padding:0; display:flex; list-style:none; border:1px solid #e0e8f2; border-radius:6px; overflow:hidden; }

#lp-desk .af-policy li { flex:1; min-width:0; margin:0; padding:8px 24px; background:#fbfdff !important; border-right:1px solid #dbe7f4; display:flex; flex-direction:column; justify-content:center; gap:3px; }

#lp-desk .af-policy li:nth-child(2) { background:#eaf4ff !important; }

#lp-desk .af-policy li strong { font-size:15px !important; }

#lp-desk .af-policy li small { color:#53658b; font-size:13px !important; }

#lp-desk .af-policy li span { color:#53658b; font-size:12px !important; }

#lp-desk .af-policy li { border-right:0; clip-path:polygon(0 0,calc(100% - 20px) 0,100% 50%,calc(100% - 20px) 100%,0 100%,20px 50%); margin-left:-18px; padding-left:42px; }

#lp-desk .af-policy li:first-child { clip-path:polygon(0 0,calc(100% - 20px) 0,100% 50%,calc(100% - 20px) 100%,0 100%); margin-left:0; padding-left:24px; }

#lp-desk .af-policy li:last-child { clip-path:polygon(0 0,100% 0,100% 100%,0 100%,20px 50%); }

#lp-desk .af-policy > .af-sub { position:absolute; left:23px; right:20px; bottom:7px; font-size:11px !important; color:#607292; white-space:nowrap; }

#lp-desk .af-linehelp { position:absolute; top:var(--lower-top); left:0; width:calc(35% - 7px); height:var(--lower-h); margin:0; padding:14px 16px; display:block; }

#lp-desk .af-linehelp > strong { font-size:18px !important; }

#lp-desk .af-linehelp .lp-faux-search { left:35%; right:15px; top:10px; }

#lp-desk .lp-staff-columns { position:absolute; top:49px; left:16px; right:16px; height:30px; background:#f7f9fc !important; border:1px solid #e3eaf3; border-radius:4px; display:grid; grid-template-columns:60% 40%; align-items:center; padding:0 12px; }

#lp-desk .lp-staff-columns span { color:#34496c; font-size:13px !important; }

#lp-desk .af-person { position:absolute; top:calc(var(--lp-row) * var(--staff-row)); left:0; width:100%; height:var(--staff-row); min-height:0; padding:0 8px; margin:0; display:grid; grid-template-columns:40px 47% 1fr 23px; align-items:center; gap:0; background:#fff !important; border:1px solid #e9eef5 !important; border-top:0 !important; border-radius:4px; }

#lp-desk .af-person.lp-selected { background:#eaf4ff !important; }

#lp-desk .af-person > .af-sp { display:contents; }

#lp-desk .af-person .af-avatar { grid-column:1; grid-row:1; width:32px; height:27px; border-radius:50%; display:flex; align-items:center; justify-content:center; background:#d8ebff !important; color:#0864c6; font-size:12px !important; }

#lp-desk .af-person:nth-of-type(4n) .af-avatar { background:#d8f1e4 !important; color:#206449; }

#lp-desk .af-person:nth-of-type(5n) .af-avatar { background:#e8dfff !important; color:#5626b0; }

#lp-desk .af-person:nth-of-type(6n) .af-avatar { background:#ffe4c5 !important; color:#8c4514; }

#lp-desk .af-person-name { grid-column:2; grid-row:1; font-weight:400; font-size:13px !important; }

#lp-desk .af-person small { grid-column:3; grid-row:1; font-size:12px !important; color:#34496c; }

#lp-desk .af-person button { grid-column:4; grid-row:1; padding:0; height:23px; min-height:0; width:23px; border:0 !important; background:transparent !important; box-shadow:none !important; font-size:0 !important; color:#0878ff; }

#lp-desk .af-person button::before { content:'+'; font-size:19px; }

#lp-desk .af-person button:disabled::before { content:'✓'; font-size:15px; color:#9baec6; }

#lp-desk .af-route { position:absolute; top:var(--lower-top); left:calc(35% + 7px); width:calc(65% - 7px); height:var(--lower-h); min-height:0; margin:0; padding:56px 74px 65px 18px; display:flex; flex-wrap:wrap; align-content:center; align-items:center; gap:8px; }

#lp-desk .af-route::before { content:'Approval Route for ' attr(data-invoice); position:absolute; top:14px; left:18px; font-size:18px; font-weight:700; }

#lp-desk .af-route > .af-muted { position:absolute; top:56px; left:18px; right:74px; bottom:65px; display:flex; flex-direction:column; align-items:center; justify-content:center; border:1px dashed #c9d8ec; border-radius:4px; padding:8px; }

#lp-desk .af-route > .af-muted svg { width:32px; height:28px; color:#7c8eac; margin-bottom:5px; }

#lp-desk .af-route > .af-muted strong { font-weight:400; margin-bottom:5px; }

#lp-desk .af-route > .af-muted small { color:#607292; font-size:13px !important; }

#lp-desk .af-routechip { background:#edf5ff !important; border:1px solid #cbdcf0; border-radius:5px; padding:8px 10px; }

#lp-desk .lp-route-arrows { position:absolute; right:18px; top:56px; display:flex; flex-direction:column; gap:10px; }

#lp-desk .lp-route-arrows button { height:40px; width:40px; min-height:0; padding:0; font-size:24px !important; color:#7187a8; border:1px solid #d4dfed !important; border-radius:5px !important; background:#f8fafd !important; box-shadow:none !important; }

#lp-desk .lp-approve-invoice, #lp-desk .lp-add-approver { position:absolute; bottom:18px; height:38px; min-height:0; padding:0 12px; border-radius:6px !important; box-shadow:none !important; }

#lp-desk .lp-add-approver { left:calc(35% + 25px); width:155px; border:1px solid #8cbcff !important; background:#f7fbff !important; color:#0878ff; }

#lp-desk .lp-approve-invoice { left:calc(35% + 190px); width:170px; border:1px solid #d6e0ed !important; background:#edf5ff !important; color:#0878ff; }

#lp-desk .lp-approve-invoice::before { content:'✓'; margin-right:9px; font-size:18px; }

#lp-desk .lp-approve-invoice:disabled { background:#f4f7fb !important; color:#a7b8d1 !important; opacity:1; }

#lp-desk { height:calc(100% - 8px); }

#lp-desk .af-person-name { font-size:14px !important; }

#lp-desk .af-person small { font-size:13px !important; }

#lp-desk .af-colhead > strong { font-size:20px !important; }

#lp-desk .lp-invoice-columns span { font-size:14px !important; }

#lp-desk .af-policy h3 { font-size:19px !important; }

#lp-desk .af-policy ol { bottom:18px; }

#lp-desk .af-policy li strong { font-size:16px !important; }

#lp-desk .af-linehelp > strong { font-size:19px !important; }

#lp-desk .af-route::before { font-size:19px; }

#lp-desk .lp-status.lp-approved { color:#16824e; background:#daf4e7 !important; }

@media (max-height:740px) {

  #lp-desk { --gap:10px; --top-h:38%; --policy-h:25%; --invoice-head:60px; --invoice-row:28px; --staff-head:47px; }

  #lp-desk * { font-size:12px !important; }

  #lp-desk .af-work > .af-column:first-child > .af-colhead { padding:7px 12px; }

  #lp-desk .af-colhead > strong { font-size:15px !important; line-height:25px; }

  #lp-desk .lp-faux-search { top:6px; height:25px; left:110px; right:45px; font-size:11px !important; }

  #lp-desk .lp-filter { top:6px; right:10px; height:25px; width:27px; }

  #lp-desk .lp-invoice-columns { height:26px; padding:0 12px; }

  #lp-desk .lp-invoice-columns span { font-size:10px !important; }

  #lp-desk .af-invoice { padding:0 12px; }

  #lp-desk .af-invoice > * { font-size:11px !important; }

  #lp-desk .lp-invoice-status { padding:3px 6px; font-size:10px !important; }

  #lp-desk .af-summarybox { padding:48px 12px 10px; }

  #lp-desk .af-summarybox h4 { top:12px; left:12px; font-size:17px !important; }

  #lp-desk .lp-status { top:11px; left:140px; font-size:10px !important; padding:4px 7px; }

  #lp-desk .af-summarybox .af-kv { height:25px; grid-template-columns:34% 66%; }

  #lp-desk .af-summarybox .af-kv > b { font-size:11px !important; }

  #lp-desk .lp-detail-extra { top:48px; right:12px; }

  #lp-desk .lp-detail-extra > div { height:25px; }

  #lp-desk .lp-detail-extra b, #lp-desk .lp-detail-extra span { font-size:10px !important; }

  #lp-desk .af-policy { padding:9px 12px; }

  #lp-desk .af-policy h3 { font-size:15px !important; }

  #lp-desk .lp-policy-intro { display:none; }

  #lp-desk .lp-edit-policy { top:5px; right:12px; height:27px; width:85px; font-size:11px !important; }

  #lp-desk .af-policy ol { top:34px; bottom:19px; left:12px; right:12px; }

  #lp-desk .af-policy li { padding:2px 24px; gap:1px; line-height:1.15; }

  #lp-desk .af-policy li strong { font-size:12px !important; }

  #lp-desk .af-policy li small, #lp-desk .af-policy li span { font-size:10px !important; }

  #lp-desk .af-policy > .af-sub { left:17px; bottom:3px; font-size:9px !important; }

  #lp-desk .af-linehelp { padding:8px 12px; }

  #lp-desk .af-linehelp > strong { font-size:15px !important; }

  #lp-desk .af-linehelp .lp-faux-search { left:43%; right:10px; height:24px; top:5px; }

  #lp-desk .lp-staff-columns { top:31px; left:12px; right:12px; height:16px; padding:0 8px; }

  #lp-desk .lp-staff-columns span { font-size:10px !important; }

  #lp-desk .af-person { grid-template-columns:28px 46% 1fr 20px; padding:0 4px; }

  #lp-desk .af-person .af-avatar { width:23px; height:19px; font-size:10px !important; }

  #lp-desk .af-person-name, #lp-desk .af-person small { font-size:10px !important; }

  #lp-desk .af-person button { height:19px; width:20px; }

  #lp-desk .af-route { padding:34px 48px 43px 12px; }

  #lp-desk .af-route::before { top:8px; left:12px; font-size:15px; }

  #lp-desk .af-route > .af-muted { top:34px; bottom:43px; left:12px; right:48px; padding:4px; }

  #lp-desk .af-route > .af-muted svg { flex:none; height:16px; width:23px; margin-bottom:1px; }

  #lp-desk .af-route > .af-muted strong { margin-bottom:1px; font-size:12px !important; line-height:1.2; }

  #lp-desk .af-route > .af-muted small { font-size:10px !important; line-height:1.2; }

  #lp-desk .lp-route-arrows { right:12px; top:34px; gap:6px; }

  #lp-desk .lp-route-arrows button { width:27px; height:27px; font-size:20px !important; }

  #lp-desk .lp-approve-invoice, #lp-desk .lp-add-approver { bottom:9px; height:28px; font-size:11px !important; }

  #lp-desk .lp-add-approver { left:calc(35% + 19px); width:125px; }

  #lp-desk .lp-approve-invoice { left:calc(35% + 151px); width:145px; }
}
#lp-desk .lp-source-scroll { position:absolute; top:var(--invoice-head); left:0; width:calc(50% - 7px); height:calc(var(--top-h) - var(--invoice-head)); }
#lp-desk .lp-staff-scroll { position:absolute; top:calc(var(--lower-top) + var(--staff-head)); left:16px; width:calc(35% - 39px); height:calc(var(--lower-h) - var(--staff-head) - 8px); }
#lp-desk .af-pane { overflow:auto; }
#lp-desk .af-content { position:relative; padding:0; }
#lp-desk .lp-source-scroll .af-content { min-height:calc(var(--lp-invoice-count) * var(--invoice-row)); }
#lp-desk .lp-staff-scroll .af-content { min-height:calc(var(--lp-staff-count) * var(--staff-row)); }
#lp-desk .af-track { display:block; }
#lp-desk .af-routechip { display:inline-flex; }
#lp-desk .lp-approve-invoice { white-space:nowrap; justify-content:center; }
@media (max-height:740px) {
  #lp-desk .lp-staff-scroll { left:12px; width:calc(35% - 31px); }
}
`,
    commitLabels: { approve: 'Approve Invoice' },
    parts: {
      frame: (base, S) => ctx => {
        const app = base(ctx);
        app.id = 'lp-desk';
        // Resolve row density against the desk before nesting rows in their pane.
        const style = getComputedStyle(app);
        const value = name => parseFloat(style.getPropertyValue(name));
        const lowerHeight = app.clientHeight * (1 - (value('--top-h') + value('--policy-h')) / 100) - 2 * value('--gap');
        app.style.setProperty('--staff-row', Math.max(19, Math.min(35, (lowerHeight - value('--staff-head') - 10) / ctx.spec.staff.length)) + 'px');
        app.style.setProperty('--lp-invoice-count', ctx.spec.invoices.length);
        app.style.setProperty('--lp-staff-count', ctx.spec.staff.length);
        return app;
      },
      renderApprove: (base, S) => () => {
        const { P, el, spec: s } = S;
        const source = P.scroll(P.column('Open invoices', 'Awaiting approval'), 'source');
        source.pane.parentElement.classList.add('lp-source-scroll');
        s.invoices.forEach((invoice, i) => P.invoiceRow(source, invoice, i));
        P.approvalPolicy(S.work);
        S.invoiceDetail = el('div', 'af-summarybox', S.work);
        el('div', 'af-linehelp', S.work, 'APPROVER DIRECTORY / Finance team / Sequential approval');
        const column = P.column('Approval route', 'Sequential');
        S.routeBox = el('div', 'af-route', column);
        const editor = P.scroll(column, 'editor');
        editor.pane.parentElement.classList.add('lp-staff-scroll');
        for (const person of s.staff) P.approverRow(editor, person);
        P.history(source.content, 'Recently paid / Read only');
      },
      synced: (base, S) => model => {
        const app = S.root;
        const util = S.ctx.util;
        const make = (tag, cls, parent, text) => util.el(tag, cls, parent, text);
        const header = app.querySelector('.af-work > .af-column:first-child .af-colhead');
        if (header && !header.dataset.lp) {
          header.dataset.lp = '1';
          header.innerHTML = '<strong>Invoices</strong><div class="lp-faux-search"><i></i>Search invoices...</div><button class="lp-filter" type="button" aria-label="Filter invoices"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 6h16M7 11h10M10 16h4"/></svg></button><div class="lp-invoice-columns"><span>Invoice #</span><span>Vendor</span><span>Date</span><span>Amount</span><span>Status</span></div>';
        }
        const invoices = app.querySelectorAll('.af-invoice');
        invoices.forEach((invoice, index) => {
          invoice.style.setProperty('--lp-row', index);
          if (invoice.dataset.lp) return;
          invoice.dataset.lp = '1';
          const line = invoice.querySelector('.af-line');
          const parts = (line ? line.textContent : '').split('·');
          const iso = (parts[1] || '').replace(/^\s*Due\s*/i, '').trim();
          const bits = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
          const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          const date = bits ? months[Number(bits[2]) - 1] + ' ' + Number(bits[3]) + ', ' + bits[1] : iso;
          make('span', 'lp-invoice-date', invoice, date);
          make('span', 'lp-invoice-amount', invoice, (parts[0] || '').trim());
          make('span', 'lp-invoice-status', invoice, 'Pending');
        });
        const summary = app.querySelector('.af-summarybox');
        const heading = summary && summary.querySelector('h4');
        const invoiceId = heading ? heading.textContent.replace(/^Invoice\s*\/\s*/i, '').trim() : '';
        if (summary && !summary.querySelector('.lp-detail-extra')) {
          summary.dataset.lp = '1';
          if (heading) heading.textContent = invoiceId;
          make('span', 'lp-status', summary, 'Pending Approval');
          const extra = make('div', 'lp-detail-extra', summary);
          for (const [label, value] of [['Invoice #', invoiceId], ['Status', 'Pending Approval'], ['Terms', 'Net 30'], ['Description', 'Vendor invoice']]) {
            const row = make('div', '', extra);
            make('span', '', row, label);
            make('b', '', row, value);
          }
        }
        if (heading && heading.textContent !== invoiceId) heading.textContent = invoiceId;
        const repeatedId = summary && summary.querySelector('.lp-detail-extra > div:first-child b');
        if (repeatedId && repeatedId.textContent !== invoiceId) repeatedId.textContent = invoiceId;
        const policy = app.querySelector('.af-policy');
        if (policy && !policy.dataset.lp) {
          policy.dataset.lp = '1';
          const title = policy.querySelector('h3');
          if (title) title.textContent = 'Amount-Threshold Approval Policy';
          make('span', 'lp-policy-intro', policy, 'Invoices require approval based on the total amount (USD). Approvers must act in the following order.');
          const edit = make('button', 'lp-edit-policy', policy, 'Edit Policy');
          edit.type = 'button';
          edit.addEventListener('click', () => env.log('decoy', {label:'Edit Policy'}));
          const roles = [];
          policy.querySelectorAll('li').forEach((li, index) => {
            const original = li.textContent.trim();
            const split = original.indexOf(':');
            const role = split < 0 ? original : original.slice(0, split).trim();
            const condition = split < 0 ? '' : original.slice(split + 1).trim().replace(/\.$/, '');
            roles.push(role);
            li.title = original;
            li.textContent = '';
            make('strong', '', li, condition.charAt(0).toUpperCase() + condition.slice(1));
            make('small', '', li, (index + 1) + (index ? ' approvers' : ' approver'));
            make('span', '', li, roles.join('  →  '));
          });
        }
        const directory = app.querySelector('.af-linehelp');
        if (directory && !directory.dataset.lp) {
          directory.dataset.lp = '1';
          directory.innerHTML = '<strong>Available Staff</strong><div class="lp-faux-search"><i></i>Search staff...</div><div class="lp-staff-columns"><span>Name</span><span>Role</span></div>';
        }
        app.querySelectorAll('.af-person').forEach((person, index) => {
          person.style.setProperty('--lp-row', index);
          const button = person.querySelector('button');
          if (button) button.title = 'Add Approver';
          if (person.dataset.lp) return;
          person.dataset.lp = '1';
          person.addEventListener('click', (event) => {
            if (event.target.closest('button')) return;
            for (const row of app.querySelectorAll('.af-person')) row.classList.remove('lp-selected');
            person.classList.add('lp-selected');
          });
        });
        const route = app.querySelector('.af-route');
        if (route) {
          if (route.dataset.invoice !== invoiceId) route.dataset.invoice = invoiceId;
          const empty = route.querySelector(':scope > .af-muted');
          if (empty && !empty.dataset.lp) {
            empty.dataset.lp = '1';
            empty.innerHTML = '<svg viewBox="0 0 40 32" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="20" cy="9" r="4"/><circle cx="8" cy="12" r="3"/><circle cx="32" cy="12" r="3"/><path d="M12 29v-6c0-8 16-8 16 0v6zM3 25v-5c0-5 7-6 10-3M37 25v-5c0-5-7-6-10-3"/></g></svg><strong>No approvers added yet</strong><small>Add approvers from the staff list based on the amount-threshold policy.</small>';
          }
          if (!route.querySelector('.lp-route-arrows')) {
            const arrows = make('div', 'lp-route-arrows', route);
            for (const glyph of ['⌃', '⌄']) {
              const button = make('button', '', arrows, glyph);
              button.type = 'button';
              button.disabled = true;
            }
          }
        }
        for (const pane of Object.values(S.panes)) pane.refresh();
        const footer = app.querySelector('.af-footer');
        const approve = footer && footer.querySelector('.primary');
        if (approve) {
          approve.classList.add('lp-approve-invoice');
          if (/^approve (payment|invoice)/i.test(approve.textContent.trim())) {
            approve.disabled = !app.querySelector('.af-routechip');
          }
          const approved = /^approved\b/i.test(approve.textContent.trim());
          const status = summary && summary.querySelector('.lp-status');
          if (status) {
            const text = approved ? 'Approved' : 'Pending Approval';
            if (status.textContent !== text) status.textContent = text;
            status.classList.toggle('lp-approved', approved);
          }
        }
        if (footer && !footer.querySelector('.lp-add-approver')) {
          const add = make('button', 'lp-add-approver', footer, '＋  Add Approver');
          add.type = 'button';
          add.addEventListener('click', () => {
            const selected = app.querySelector('.af-person.lp-selected button:not(:disabled)') || app.querySelector('.af-person button:not(:disabled)');
            if (selected) selected.click();
          });
        }
      },
    },
  },
});
