/* base / use-gov-portal/classic: a fictional civic-service portal, with a source-record dossier,
 * wheel-scrolled application/evidence pane, live conditional sections, recoverable validation,
 * draft save, review/edit and a binding in-app submission followed by a receipt. Native text
 * inputs and DOM radio buttons only. Account navigation, secure messages, a case history and
 * document-library distractors surround the task without adding scored fields. Section statuses reflect
 * completion/format validation, never the task's scoring verdict. All icons are inline SVG.
 * The outer portal is the fixed anchor; only inner panes scroll.
 */
(function () {
  'use strict';
  let current;
  const ICONS = {
    seal:'M3 10h18M5 10v9m5-9v9m4-9v9m5-9v9M3 21h18M12 3l10 5H2l10-5Z',
    mail:'M3 5h18v14H3V5Zm0 1 9 7 9-7',
    user:'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2',
    file:'M14 2H5v20h14V7l-5-5Zm0 0v6h5M8 12h8m-8 4h8',
    lock:'M6 10h12v11H6V10Zm3 0V6a3 3 0 0 1 6 0v4m-3 4v3',
    check:'m5 12 4 4L19 6',
    clock:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 6v6l4 2',
    help:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 8a3 3 0 1 1 4 3c-1 1-1 1-1 3m0 3h.01',
    chevron:'m9 5 7 7-7 7',
    radio:'M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
    upload:'M12 16V3m-5 5 5-5 5 5M4 16v5h16v-5',
    warning:'m12 3 10 18H2L12 3Zm0 6v5m0 3h.01',
  };
  function icon(parent, name, cls='') {
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('viewBox','0 0 24 24'); svg.setAttribute('fill','none');
    svg.setAttribute('stroke','currentColor'); svg.setAttribute('stroke-width','1.6');
    svg.setAttribute('stroke-linecap','round'); svg.setAttribute('stroke-linejoin','round');
    svg.setAttribute('aria-hidden','true'); svg.setAttribute('class',`gov-icon ${cls}`);
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d',ICONS[name] || ICONS.file); svg.append(path); parent.append(svg);
    return svg;
  }
  const CSS = `
  .gov-app {flex:none;display:flex;flex-direction:column;overflow:hidden;background:var(--panel);border:1px solid var(--line);box-shadow:0 4px 18px #0001;color:var(--fg);font:13px/1.45 Arial,"Liberation Sans",sans-serif;}
  .gov-app * {box-sizing:border-box;}.gov-app [hidden] {display:none!important;}
  .gov-icon {width:17px;height:17px;flex:none;vertical-align:middle;}.gov-app button .gov-icon{width:15px;height:15px;}
  .gov-masthead{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:7px 16px;border-bottom:3px solid var(--accent);background:color-mix(in srgb,var(--accent) 12%,#152232);color:#f7f8fa;flex:none;}
  .gov-brand{display:flex;align-items:center;gap:9px;font-size:14px;font-weight:700;letter-spacing:.01em;white-space:nowrap;}
  .gov-brand>.gov-icon{width:25px;height:25px;}.gov-brand small{display:block;font-size:10px;letter-spacing:.08em;text-transform:uppercase;font-weight:400;opacity:.8;}
  .gov-account{display:flex;align-items:center;gap:14px;font-size:11px;min-width:0;}
  .gov-app .gov-account button{display:flex;align-items:center;gap:6px;background:none;color:inherit;border:0;padding:3px;font-size:11px;}
  .gov-count{background:var(--panel);color:var(--fg);border-radius:8px;padding:0 5px;font-size:10px;}
  .gov-head{padding:9px 16px 8px;border-bottom:1px solid var(--line);flex:none;}
  .gov-breadcrumb{display:flex;align-items:center;gap:6px;color:var(--muted);font-size:10px;margin-bottom:5px;}
  .gov-breadcrumb .gov-icon{width:10px;height:10px;}
  .gov-title-row{display:flex;align-items:center;justify-content:space-between;gap:12px;}
  .gov-title-row h2{margin:0;font-size:22px;line-height:1.2;letter-spacing:-.02em;}
  .gov-subtitle{color:var(--muted);font-size:11px;margin-top:4px;display:flex;gap:12px;flex-wrap:wrap;}
  .gov-pill{font-size:11px;padding:3px 7px;background:var(--bg);border:1px solid var(--line);white-space:nowrap;display:inline-flex;align-items:center;gap:5px;}
  .gov-pill::before{content:'';width:5px;height:5px;background:var(--accent);border-radius:50%;}
  .gov-workflow{display:flex;align-items:center;justify-content:space-between;gap:8px;border-bottom:1px solid var(--line);padding:0 16px;flex:none;}
  .gov-steps{display:flex;gap:16px;color:var(--muted);font-size:11px;}
  .gov-step{padding:8px 0 6px;border-bottom:2px solid transparent;display:flex;align-items:center;gap:5px;}
  .gov-step-number{font-size:10px;width:16px;height:16px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:50%;}
  .gov-step.current{color:var(--fg);font-weight:700;border-color:var(--accent);}.gov-step.current .gov-step-number{background:var(--accent);color:white;border-color:var(--accent);}
  .gov-work{display:flex;min-height:0;flex:1;}
  .gov-sidebar{width:226px;flex:none;display:flex;flex-direction:column;min-height:0;background:var(--bg);border-right:1px solid var(--line);}
  .gov-case{padding:10px 12px 8px;border-bottom:1px solid var(--line);font-size:11px;}.gov-case-code{font-family:"Courier New",monospace;font-size:12px;font-weight:700;}.gov-case .gov-hint{margin:2px 0 0;}
  .gov-side-tabs{display:flex;gap:1px;padding:0 8px;border-bottom:1px solid var(--line);flex:none;}
  .gov-app .gov-side-tab{background:none;border:0;border-bottom:2px solid transparent;border-radius:0;padding:8px 6px;font-size:11px;color:var(--muted);}
  .gov-app .gov-side-tab[aria-selected=true]{color:var(--fg);border-bottom-color:var(--accent);font-weight:700;}
  .gov-record{flex:1;min-height:0;padding:12px;overflow:auto;overscroll-behavior:contain;user-select:text;-webkit-user-select:text;scrollbar-gutter:stable;}
  .gov-record h3{font-size:13px;margin:0 0 3px;}.gov-kicker{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);margin:16px 0 6px;}
  .gov-record dl{margin:0;}.gov-record dt{color:var(--muted);font-size:10px;margin-top:9px;}.gov-record dd{margin:1px 0;font-weight:550;overflow-wrap:anywhere;line-height:1.3;}
  .gov-record .gov-person{font-size:15px;font-weight:700;margin:2px 0 8px;}
  .gov-rule{border-left:3px solid var(--accent);padding:7px 8px;margin:8px 0;background:var(--panel);font-size:11px;}
  .gov-other-case{padding:8px 0;border-bottom:1px solid var(--line);font-size:11px;}.gov-other-case span{display:block;font-size:10px;color:var(--muted);margin-top:2px;}
  .gov-message{border-bottom:1px solid var(--line);padding:10px 0;font-size:11px;}.gov-message h4{font-size:12px;margin:3px 0;}.gov-message p{margin:4px 0;color:var(--muted);}
  .gov-timeline{padding:0;margin:12px 0 0;list-style:none;}.gov-timeline li{padding:0 0 13px 14px;border-left:1px solid var(--line);position:relative;font-size:11px;}.gov-timeline li::before{content:'';width:5px;height:5px;background:var(--accent);position:absolute;left:-3px;top:4px;border-radius:50%;}.gov-timeline small{display:block;color:var(--muted);margin-top:2px;}
  .gov-main{flex:1;min-width:0;display:flex;flex-direction:column;min-height:0;}
  .gov-context-strip{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 16px;border-bottom:1px solid var(--line);background:var(--bg);font-size:10px;flex:none;}
  .gov-context-strip span{display:flex;gap:5px;align-items:center;}.gov-context-strip .gov-icon{width:12px;height:12px;}
  .gov-scroll{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;padding:16px 20px;scrollbar-gutter:stable;}
  .gov-page-intro{padding-bottom:10px;border-bottom:1px solid var(--line);margin-bottom:12px;}.gov-page-intro h3{margin:0 0 4px;font-size:19px;}.gov-page-intro p{margin:0;color:var(--muted);font-size:12px;}
  .gov-section{border:0;border-top:1px solid var(--line);margin:18px 0 0;padding:13px 0 0;min-width:0;}.gov-section:first-of-type{margin-top:14px;}
  .gov-section legend{padding:0 9px 0 0;font-weight:700;font-size:15px;}
  .gov-section-meta{display:flex;justify-content:space-between;gap:8px;color:var(--muted);font-size:10px;margin:0 0 11px;}.gov-section-status{font-weight:600;color:var(--accent);}
  .gov-fields{display:grid;grid-template-columns:repeat(var(--gov-cols),minmax(0,1fr));gap:13px 18px;}.gov-field{min-width:0;}
  .gov-field label,.gov-label{display:block;font-weight:600;margin-bottom:5px;font-size:13px;}.gov-field-code{color:var(--muted);font-size:10px;font-weight:400;display:block;margin-bottom:3px;}
  .gov-input{height:35px;width:100%;border:1px solid var(--muted);border-radius:2px;background:var(--panel);color:var(--fg);padding:5px 8px;font:inherit;user-select:text;-webkit-user-select:text;}
  .gov-input:focus,.gov-app button:focus-visible{outline:3px solid color-mix(in srgb,var(--accent) 35%,transparent);outline-offset:1px;}
  .gov-hint{font-size:11px;color:var(--muted);margin:4px 0;overflow-wrap:anywhere;}.gov-error{color:color-mix(in srgb,#df3d4a 75%,var(--fg));font-size:11px;min-height:15px;margin-top:3px;}.gov-input[aria-invalid=true]{border:2px solid #d94350;}
  .gov-options{display:flex;gap:5px;flex-wrap:wrap;}.gov-app button{font:inherit;cursor:pointer;color:var(--fg);background:var(--panel);border:1px solid var(--line);border-radius:2px;padding:6px 10px;}
  .gov-app button[aria-checked=true]{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,var(--panel));color:var(--fg);box-shadow:inset 0 0 0 1px var(--accent);}
  .gov-radio{display:flex;gap:6px;align-items:center;}.gov-radio .gov-icon{width:14px;height:14px;}.gov-radio[aria-checked=true] .gov-icon{fill:var(--accent);stroke:var(--accent);}
  .gov-wide{grid-column:1/-1;}.gov-alert{padding:9px 11px;background:var(--bg);border-left:3px solid var(--accent);margin-bottom:10px;font-size:12px;}.gov-alert.bad{border-color:#d94350;}
  .gov-help-block{padding:10px 12px;background:var(--bg);border:1px solid var(--line);margin:12px 0;font-size:11px;}.gov-help-block summary{cursor:pointer;font-weight:600;}.gov-help-block p{margin:7px 0 0;color:var(--muted);}
  .gov-file-toolbar{display:flex;justify-content:space-between;gap:8px;align-items:center;background:var(--bg);border:1px solid var(--line);padding:9px 10px;margin-top:12px;font-size:11px;}
  .gov-file{padding:12px 0;border-bottom:1px solid var(--line);}.gov-file-head{display:flex;justify-content:space-between;align-items:start;gap:8px;}
  .gov-file-title{display:flex;gap:9px;align-items:start;min-width:0;}.gov-file-title>.gov-icon{width:27px;height:31px;color:var(--muted);}
  .gov-file h4{font-size:13px;margin:0 0 3px;}.gov-file code{font-size:10px;overflow-wrap:anywhere;}.gov-file-meta{font-size:10px;color:var(--muted);margin:5px 0;display:flex;gap:10px;flex-wrap:wrap;}.gov-file-state{font-weight:600;}
  .gov-types{margin:9px 0 0 36px;padding:9px 10px;background:var(--bg);border:1px solid var(--line);}.gov-types .gov-label{font-size:11px;}.gov-types button{font-size:10px;padding:5px 7px;}
  .gov-file-actions{display:flex;flex-direction:column;align-items:end;gap:5px;}.gov-file-actions button{font-size:11px;white-space:nowrap;}.gov-file-rule{font-size:10px;color:var(--muted);}
  .gov-library{margin-top:16px;}.gov-library-row{display:flex;gap:8px;align-items:center;padding:8px 0;border-top:1px solid var(--line);font-size:11px;}.gov-library-row span{flex:1;}.gov-library-row small{font-size:10px;color:var(--muted);}
  .gov-bottom{padding:8px 14px;display:flex;justify-content:space-between;align-items:center;gap:8px;border-top:1px solid var(--line);flex:none;box-shadow:0 -2px 5px #00004;}
  .gov-app .gov-primary{color:white;background:var(--accent);border-color:var(--accent);font-weight:650;display:flex;align-items:center;gap:8px;font-size:12px;}
  .gov-app .gov-link{border:0;color:var(--accent);padding:4px 0;font-size:12px;}.gov-save-status{font-size:10px;color:var(--muted);}
  .gov-summary{margin:0;}.gov-summary div{display:grid;grid-template-columns:minmax(100px,42%) 1fr;gap:10px;padding:9px 0;border-bottom:1px solid var(--line);}.gov-summary dt{color:var(--muted);}.gov-summary dd{margin:0;overflow-wrap:anywhere;font-weight:550;}
  .gov-declaration{padding:14px;background:var(--bg);border:1px solid var(--line);margin-top:16px;}.gov-check{display:flex;gap:8px;align-items:start;cursor:pointer;}.gov-check input{accent-color:var(--accent);width:17px;height:17px;flex:none;}
  .gov-receipt h3{font-size:24px;margin:12px 0 5px;}.gov-received{display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--accent) 12%,var(--panel));width:42px;height:42px;border-radius:50%;color:var(--accent);}.gov-received>.gov-icon{width:25px;height:25px;}
  .gov-reference-label{font-size:11px;color:var(--muted);margin:14px 0 3px;}.gov-reference-value{font:bold 20px "Courier New",monospace;margin-bottom:16px;}
  .gov-next-steps{margin-top:20px;padding:14px;border:1px solid var(--line);}.gov-next-steps h4{margin:0 0 8px;font-size:14px;}.gov-next-steps p{font-size:12px;color:var(--muted);margin:4px 0;}
  .gov-advice{width:203px;flex:none;padding:14px 13px;border-left:1px solid var(--line);overflow:auto;background:var(--bg);font-size:11px;}.gov-advice h3{font-size:13px;margin:0 0 8px;}.gov-advice p{color:var(--muted);line-height:1.5;}.gov-advice .gov-kicker{margin-top:16px;}
  .gov-section-list{padding:0;margin:0;list-style:none;}.gov-section-list li{padding:7px 0;border-bottom:1px solid var(--line);}.gov-section-list .gov-link{font-size:11px;padding:0;text-align:left;}.gov-section-list small{display:block;color:var(--muted);font-size:10px;margin-top:2px;}
  .gov-trust{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--muted);margin-top:14px;}.gov-trust .gov-icon{width:12px;height:12px;}
  .gov-app.compact .gov-sidebar{width:192px;}.gov-app.compact .gov-record{padding:10px;}.gov-app.compact .gov-scroll{padding:12px 14px;}.gov-app.compact .gov-title-row h2{font-size:19px;}
  .gov-app.short .gov-masthead{padding:4px 12px;}.gov-app.short .gov-brand{font-size:12px;}.gov-app.short .gov-brand small{display:none;}.gov-app.short .gov-head{padding:7px 12px;}.gov-app.short .gov-title-row h2{font-size:18px;}.gov-app.short .gov-subtitle{margin-top:3px;}.gov-app.short .gov-breadcrumb{margin-bottom:4px;}.gov-app.short .gov-context-strip{padding:4px 12px;}.gov-app.short .gov-case{padding:7px 10px;}
  .gov-app.short .gov-page-intro{padding-bottom:7px;margin-bottom:8px;}.gov-app.short .gov-page-intro h3{font-size:16px;}.gov-app.short .gov-page-intro p{display:none;}.gov-app.short .gov-field-code{display:none;}.gov-app.short .gov-section{margin-top:12px;padding-top:10px;}.gov-app.short .gov-section-meta{margin-bottom:6px;}.gov-app.short .gov-side-panel>.gov-kicker:first-child{margin-top:0;}.gov-app.short .gov-record .gov-trust{margin-top:8px;}
  .gov-app.narrow .gov-account-name{display:none;}.gov-app.narrow .gov-account{gap:8px;}.gov-app.narrow .gov-brand{font-size:12px;}.gov-app.narrow .gov-sidebar{width:173px;}.gov-app.narrow .gov-workflow{padding:0 10px;}.gov-app.narrow .gov-steps{gap:9px;font-size:10px;}.gov-app.narrow .gov-guide-link{display:none;}.gov-app.narrow .gov-subtitle .gov-form-version{display:none;}.gov-app.narrow .gov-file-head{flex-wrap:wrap;}.gov-app.narrow .gov-file-actions{align-items:start;}.gov-app.narrow .gov-types{margin-left:0;}
  `;
  env.widget({task:'use-gov-portal',site:'base',name:'classic',split:'train',
    scenarios:['branching','checklist','saveresume','strict'],
    render(ctx) {
      ctx.css('app-gov-classic', CSS);
      const {util:u,spec:s,size} = ctx, fam = env.taskDef;
      const width = Math.max(280, size.width - 24), height = Math.max(180, size.height - 16);
      const wide = width >= 1250;
      const r = ctx.rng.fork('portal/details');
      const app = u.el('div','gov-app' + (width < 1050 ? ' compact' : '') + (height < 520 ? ' short' : '') + (width < 740 ? ' narrow' : ''),ctx.stage);
      app.style.width = `${Math.min(1440,width)}px`; app.style.height = `${Math.min(810,height)}px`;
      app.style.setProperty('--gov-cols',width - (wide ? 203 : 0) >= 850 ? '2' : '1');
      const masthead=u.el('div','gov-masthead',app), brand=u.el('div','gov-brand',masthead);
      icon(brand,'seal');const brandText=u.el('span','',brand,'Cedar Vale');u.el('small','',brandText,'Civic services account');
      const account=u.el('div','gov-account',masthead);
      const messagesButton=u.el('button','',account);messagesButton.type='button';icon(messagesButton,'mail');u.el('span','',messagesButton,'Messages');u.el('span','gov-count',messagesButton,'2');
      const accountButton=u.el('button','',account);accountButton.type='button';icon(accountButton,'user');u.el('span','gov-account-name',accountButton,s.record.name);
      const head=u.el('header','gov-head',app), breadcrumb=u.el('div','gov-breadcrumb',head);
      u.el('span','',breadcrumb,'My account');icon(breadcrumb,'chevron');u.el('span','',breadcrumb,'Applications');icon(breadcrumb,'chevron');u.el('span','',breadcrumb,'Civic support');
      const titleRow=u.el('div','gov-title-row',head);
      u.el('h2','',titleRow,'Civic support application');const pill=u.el('span','gov-pill',titleRow,'');
      const subtitle=u.el('div','gov-subtitle',head);
      u.el('span','',subtitle,`Application ${s.ref}`);u.el('span','gov-form-version',subtitle,'CS-104 / Personal support / Form version 4.2');
      const workflow=u.el('div','gov-workflow',app),steps=u.el('div','gov-steps',workflow);
      const guide=u.el('button','gov-link gov-guide-link',workflow,'Application guidance');guide.type='button';
      const work=u.el('div','gov-work',app),sidebar=u.el('aside','gov-sidebar',work);
      const caseBox=u.el('div','gov-case',sidebar);u.el('div','gov-case-code',caseBox,s.ref);u.el('div','gov-hint',caseBox,'Personal support / Current application');
      const sideTabs=u.el('div','gov-side-tabs',sidebar);sideTabs.setAttribute('role','tablist');sideTabs.setAttribute('aria-label','Case information');
      const record=u.el('div','gov-record',sidebar);record.setAttribute('aria-label','Case information');record.tabIndex=0;
      const sidePanels={},sideButtons={};
      const chooseSide=id=>{for(const [key,panel]of Object.entries(sidePanels)){panel.hidden=key!==id;sideButtons[key].setAttribute('aria-selected',String(key===id));}record.scrollTop=0;};
      for(const [id,title]of [['record','Record'],['history','Activity'],['messages','Messages']]){
        const b=u.el('button','gov-side-tab',sideTabs,title);b.type='button';b.setAttribute('role','tab');sideButtons[id]=b;
        sidePanels[id]=u.el('div','gov-side-panel',record);sidePanels[id].setAttribute('role','tabpanel');sidePanels[id].setAttribute('aria-label',title);
        b.addEventListener('click',()=>chooseSide(id));
      }
      messagesButton.addEventListener('click',()=>chooseSide('messages'));accountButton.addEventListener('click',()=>chooseSide('record'));guide.addEventListener('click',()=>{chooseSide('record');record.scrollTop=record.scrollHeight;});
      const source=sidePanels.record;
      u.el('div','gov-kicker',source,'Verified applicant record');u.el('div','gov-person',source,s.record.name);
      const verified=u.el('div','gov-trust',source);icon(verified,'lock');u.el('span','',verified,'Source: resident services register');
      const recordDl=u.el('dl','',source);
      const recordRow=(label,value)=>{u.el('dt','',recordDl,label);u.el('dd','',recordDl,String(value));};
      recordRow('Residence in district',`${s.record.months} months`);recordRow('Employment',s.record.employment);recordRow('Dependants',s.record.dependants);
      for(const f of s.fields)if(f.kind==='text'&&f.id!=='name')recordRow(f.id==='date'?'Proposed effective date':f.label,f.source);
      if(s.scenario==='branching')recordRow('Household member',s.record.child);
      u.el('div','gov-kicker',source,'Service eligibility');
      u.el('div','gov-rule',source,`Applicants must have lived in the district for at least ${s.record.minimum} months. Only provide employment and household details when they apply.`);
      u.el('div','gov-kicker',source,'Other applications');
      for(const [title,state]of [['Resident parking permit','Issued'],['Address registration','Closed'],['Community travel pass','Renewal due']]){
        const item=u.el('div','gov-other-case',source,title);u.el('span','',item,`CV-${r.int(10400,98999)} / ${state}`);
      }
      u.el('div','gov-kicker',source,'Help with this application');
      u.el('p','gov-hint',source,'Use your verified record when completing this form. For an incorrect register entry, contact Resident Services.');
      u.el('p','gov-hint',source,'Application guide CS-104 / Privacy notice / Accessibility support');
      u.el('h3','',sidePanels.history,'Application activity');u.el('div','gov-hint',sidePanels.history,'Draft history is retained until a decision is issued.');
      const historyList=u.el('ol','gov-timeline',sidePanels.history),liveHistory=u.el('li','',historyList);
      for(const [title,detail]of [['Applicant record verified','Resident Services / register import'],['Draft restored','Previous session / revision 02'],['Application created','Civic support / online service']]){
        const row=u.el('li','',historyList,title);u.el('small','',row,detail);
      }
      u.el('h3','',sidePanels.messages,'Secure messages');u.el('div','gov-hint',sidePanels.messages,'2 unread / Messages for your account');
      for(const [title,body]of [['Your draft is available','You can return to your saved civic support application from My applications. No decision has been made.'],['Travel pass renewal reminder','Your community travel pass is due for renewal. This message does not affect your civic support application.']]){
        const item=u.el('article','gov-message',sidePanels.messages);u.el('div','gov-hint',item,'Resident Services / Unread');u.el('h4','',item,title);u.el('p','',item,body);
      }
      chooseSide('record');env.ui.scrollPane(record,{});
      const main=u.el('div','gov-main',work),contextStrip=u.el('div','gov-context-strip',main);
      const contextTitle=u.el('span','',contextStrip);icon(contextTitle,'file');const contextLabel=u.el('span','',contextTitle);
      const security=u.el('span','',contextStrip);icon(security,'lock');u.el('span','',security,'Secure application');
      const pane=u.el('div','gov-scroll',main);pane.setAttribute('aria-label','Application details');pane.tabIndex=0;
      const form = u.el('div','gov-form',pane), review = u.el('div','gov-review',pane), receipt = u.el('div','gov-receipt',pane);
      const intro=u.el('div','gov-page-intro',form);
      const scenarioCopy={
        branching:['Applicant and household details','Information about your circumstances determines which parts of this application apply.'],
        checklist:['Documents and supporting evidence','Provide the evidence required for your circumstances. Existing files are available from your case document library.'],
        saveresume:['Continue your saved application','Your previous answers have been restored. Check that the information is still current before making your declaration.'],
        strict:['Identity and contact details','Enter your details as recorded on your documents. The service checks identity numbers, dates and postal addresses.'],
      };
      u.el('h3','',intro,scenarioCopy[s.scenario][0]);u.el('p','',intro,scenarioCopy[s.scenario][1]);
      const notice = u.el('div','gov-alert',form,s.scenario === 'saveresume' ? 'Saved draft restored. Check entries against the verified record before continuing.' :
        'Complete the applicable sections. Your application is not sent until you review and declare it.');
      const errorBox = u.el('div','gov-alert bad',form);errorBox.setAttribute('role','alert');
      const fields = {}, groups = {}, targets = new Map();
      const put = (t,el) => targets.set(fam.helpers.targetKey(t),el);
      const act = a => {ctx.update(fam.helpers.apply(ctx.model,s,a));paint(ctx.model);};
      for (const f of s.fields) {
        if (!groups[f.section]) {
          const fs = u.el('fieldset','gov-section',form);u.el('legend','',fs,f.section);
          const meta=u.el('div','gov-section-meta',fs);
          u.el('span','',meta,'Required where applicable');const status=u.el('span','gov-section-status',meta);
          groups[f.section] = {el:fs,status,grid:u.el('div','gov-fields',fs),fields:[]};
        }
        const g = groups[f.section];g.fields.push(f);
        const wrap = u.el('div','gov-field' + (f.kind==='choice' ? ' gov-wide' : ''),g.grid);
        const label = u.el('label','gov-label',wrap);
        u.el('span','gov-field-code',label,`CS-104 / ${s.fields.indexOf(f)+1}`);u.el('span','',label,f.label);
        let input, choices;
        if (f.kind === 'text') {
          input = u.el('input','gov-input',wrap);input.type='text';input.id=`gov-${f.id}`;
          label.htmlFor=input.id;input.autocomplete='off';input.spellcheck=false;
          input.addEventListener('input',()=>act({set:[f.id,input.value]}));put({field:f.id},input);
        } else {
          choices = new Map(); const row=u.el('div','gov-options',wrap);row.setAttribute('role','radiogroup');row.setAttribute('aria-label',f.label);
          for (const value of f.options) {
            const b=u.el('button','gov-radio',row);b.type='button';b.setAttribute('role','radio');icon(b,'radio');u.el('span','',b,value);
            b.addEventListener('click',()=>act({set:[f.id,value]}));choices.set(value,b);put({choice:[f.id,value]},b);
          }
        }
        if (f.hint) u.el('div','gov-hint',wrap,f.hint);
        const err = u.el('div','gov-error',wrap);err.id=`gov-error-${f.id}`;
        if (input) input.setAttribute('aria-describedby',err.id);
        fields[f.id] = {wrap,input,choices,err};
      }
      const docs = {};
      let evidenceCount;
      const fileSize=new Map(s.docs.map(d=>[d.id,r.int(85,840)]));
      if (s.docs.length) {
        const fs=u.el('fieldset','gov-section',form);u.el('legend','',fs,'6 · Evidence checklist');
        u.el('p','gov-hint',fs,'Available case files are listed below. Attach the documents required by each rule. Optional evidence should remain unattached.');
        const toolbar=u.el('div','gov-file-toolbar',fs);u.el('strong','',toolbar,`${s.docs.length} documents available`);evidenceCount=u.el('span','',toolbar);
        const types=[...new Set(s.docs.map(d=>d.type))];
        for (const d of s.docs) {
          const row=u.el('div','gov-file',fs),top=u.el('div','gov-file-head',row),fileTitle=u.el('div','gov-file-title',top);
          icon(fileTitle,'file');const title=u.el('div','',fileTitle);
          u.el('h4','',title,d.label);u.el('code','',title,d.file);
          const metadata=u.el('div','gov-file-meta',title);u.el('span','',metadata,`PDF / ${fileSize.get(d.id)} KB`);u.el('span','',metadata,`${r.int(1,4)} pages`);
          const fileState=u.el('div','gov-file-state gov-hint',title);
          const actions=u.el('div','gov-file-actions',top);u.el('span','gov-file-rule',actions,d.rule.startsWith('Optional')?'Optional':d.id==='identity'||d.id==='residence'?'Required':'Conditional');
          const attach=u.el('button','',actions,'');attach.type='button';attach.addEventListener('click',()=>act({attach:d.id}));put({attach:d.id},attach);
          u.el('div','gov-hint',row,d.rule);
          const chooser=u.el('div','gov-types',row);u.el('div','gov-label',chooser,'Document type');
          const options=u.el('div','gov-options',chooser), buttons=new Map();
          options.setAttribute('role','radiogroup');options.setAttribute('aria-label',`${d.label} document type`);
          for (const type of types) {
            const b=u.el('button','',options,type);b.type='button';b.setAttribute('role','radio');
            b.addEventListener('click',()=>act({docType:[d.id,type]}));buttons.set(type,b);put({docType:[d.id,type]},b);
          }
          docs[d.id]={attach,chooser,buttons,fileState,err:u.el('div','gov-error',row)};
        }
      }
      const library=u.el('div','gov-library',form);
      u.el('div','gov-kicker',library,'Other files in your account');
      for(const [name,detail]of [['parking-permit-receipt.pdf','Parking / Archived'],['registration-confirmation.pdf','Address registration'],['travel-pass-renewal.pdf','Travel / Notice']]){
        const row=u.el('div','gov-library-row',library);icon(row,'file');u.el('span','',row,name);u.el('small','',row,detail);
      }
      const help=u.el('details','gov-help-block',form);u.el('summary','',help,'What happens to my information?');
      u.el('p','',help,'Resident Services uses this information to assess your application. Evidence is retained with your case. Only authorised staff can access your documents. A change to your circumstances may require an updated application.');
      u.el('h3','',review,'Check your answers');
      u.el('div','gov-alert',review,'Review the applicant details and attached evidence. You can return to the application to make corrections.');
      const summary=u.el('dl','gov-summary',review), summaryValues={};
      for (const f of s.fields) {
        const row=u.el('div','',summary);u.el('dt','',row,f.label);summaryValues[f.id]={row,value:u.el('dd','',row)};
      }
      const evidenceSummary=u.el('div','gov-hint',review);
      const declaration=u.el('div','gov-declaration',review);
      u.el('strong','',declaration,'Declaration and legal responsibility');
      u.el('p','gov-hint',declaration,'I confirm that the information and evidence provided are accurate. Sending this application creates a binding declaration.');
      const checkLabel=u.el('label','gov-check',declaration), check=u.el('input','',checkLabel);check.type='checkbox';
      u.el('span','',checkLabel,'I have checked the details and accept the declaration.');
      check.addEventListener('change',()=>act({declare:true}));put({declare:true},check);
      const receivedIcon=u.el('div','gov-received',receipt);icon(receivedIcon,'check');u.el('h3','',receipt,'Application received');
      u.el('p','',receipt,'Keep this reference for your records. A caseworker will review your application.');
      u.el('div','gov-reference-label',receipt,'Your application reference');u.el('div','gov-reference-value',receipt,s.ref);
      const factsDl=u.el('dl','gov-summary',receipt);
      const nextSteps=u.el('div','gov-next-steps',receipt);u.el('h4','',nextSteps,'What happens next');
      const nextTimeline=u.el('ol','gov-timeline',nextSteps);
      for(const [title,detail]of [['Received by Resident Services','Your application and declaration have been recorded.'],['Caseworker assessment','We will check eligibility and contact you if more information is needed.'],['Decision notice','Your decision will be sent using your correspondence preference.']]){
        const row=u.el('li','',nextTimeline,title);u.el('small','',row,detail);
      }
      u.el('p','',nextSteps,'Keep the original documents. You do not need to submit another application while this case is being reviewed.');
      let adviceItems;
      if(wide){
        const advice=u.el('aside','gov-advice',work);advice.setAttribute('aria-label','Application guidance');
        u.el('h3','',advice,'In this application');adviceItems=new Map();const list=u.el('ul','gov-section-list',advice);
        for(const [name,g]of Object.entries(groups)){
          const row=u.el('li','',list),jump=u.el('button','gov-link',row,name.replace(/^\d+ · /,''));jump.type='button';
          jump.addEventListener('click',()=>{if(ctx.model.page==='form'&&!g.el.hidden){pane.scrollTop+=g.el.getBoundingClientRect().top-pane.getBoundingClientRect().top-10;geometry();}});
          adviceItems.set(name,{row,status:u.el('small','',row)});
        }
        u.el('div','gov-kicker',advice,'Before you send');
        u.el('p','',advice,'Check names and dates against the applicant record. Unneeded household details should stay blank.');
        u.el('p','',advice,'A final submission is a legal declaration. You can save an unfinished draft without making that declaration.');
        u.el('div','gov-kicker',advice,'Need assistance?');u.el('p','',advice,'Resident Services / Application guide CS-104 / Secure messages');
        const trust=u.el('div','gov-trust',advice);icon(trust,'lock');u.el('span','',trust,'Your account is protected');env.ui.scrollPane(advice,{});
      }
      const foot=u.el('div','gov-bottom',main), left=u.el('div','',foot);
      const edit=u.el('button','gov-link',left,'Edit application');edit.type='button';edit.addEventListener('click',()=>act({nav:'edit'}));put({nav:'edit'},edit);
      const save=u.el('button','gov-link',left,'Save draft');save.type='button';save.addEventListener('click',()=>act({nav:'save'}));put({nav:'save'},save);
      const saveStatus=u.el('div','gov-save-status',left);
      const primary=u.el('button','gov-primary',foot);primary.type='button';
      primary.addEventListener('click',()=>{
        const nav=ctx.model.page==='form' ? 'review' : 'submit';
        if (nav==='submit' && s.judge?.mode==='confirm') {ctx.flag('irreversible');return;}
        act({nav});
      });
      put({nav:'review'},primary);put({nav:'submit'},primary);
      function geometry() {
        const p=pane.getBoundingClientRect(), view={};
        for (const [key,el] of targets) {
          if (!pane.contains(el) || !el.getClientRects().length) continue;
          const r=el.getBoundingClientRect();
          view[key] = r.top < p.top+8 || r.bottom > p.bottom-8 ? Math.round((r.top+r.bottom)/2 - (p.top+p.bottom)/2) : 0;
        }
        if (JSON.stringify(ctx.model.view)!==JSON.stringify(view)) ctx.patch({view});
      }
      let page = null;
      function paint(m) {
        const changed=page!==m.page;page=m.page;
        form.hidden=m.page!=='form';review.hidden=m.page!=='review';receipt.hidden=m.page!=='receipt';
        pill.textContent=m.submitted ? 'Received' : !s.record.eligible ? 'Not eligible' : m.saved ? 'Draft saved' : 'In progress';
        steps.replaceChildren();
        ['Application','Check answers','Confirmation'].forEach((t,i)=>{
          const active=i===['form','review','receipt'].indexOf(m.page),item=u.el('span','gov-step'+(active?' current':''),steps);
          if(active)item.setAttribute('aria-current','step');u.el('span','gov-step-number',item,String(i+1));u.el('span','',item,t);
        });
        contextLabel.textContent=m.page==='form'?'CS-104 / '+scenarioCopy[s.scenario][0]:m.page==='review'?'CS-104 / Review and declaration':'CS-104 / Submission acknowledgement';
        liveHistory.replaceChildren();liveHistory.append(m.submitted?'Application submitted':m.saved?'Draft saved':'Application in progress');
        u.el('small','',liveHistory,m.submitted?'Acknowledgement recorded / current session':m.saved?'Current session / latest revision':'Unsaved changes / current session');
        for (const f of s.fields) {
          const w=fields[f.id];w.wrap.hidden=!fam.helpers.active(f,m.values);
          if (w.input) {if(w.input.value!==m.values[f.id])w.input.value=m.values[f.id];w.input.setAttribute('aria-invalid',String(!!m.errors[f.id]));}
          if (w.choices) for (const [value,b] of w.choices) b.setAttribute('aria-checked',String(value===m.values[f.id]));
          w.err.textContent=m.errors[f.id]||'';
          const v=summaryValues[f.id];v.row.hidden=!fam.helpers.active(f,m.values);v.value.textContent=m.values[f.id]||'Not provided';
        }
        for(const [name,g]of Object.entries(groups)){
          const live=g.fields.filter(f=>fam.helpers.active(f,m.values));g.el.hidden=!live.length;
          const entered=live.filter(f=>String(m.values[f.id]||'').trim()).length;
          const label=!live.length?'Not applicable':!entered?'Not started':entered===live.length?'Answers entered':'In progress';
          g.status.textContent=label;
          if(adviceItems){const a=adviceItems.get(name);a.status.textContent=label;}
        }
        if(evidenceCount)evidenceCount.textContent=`${s.docs.filter(d=>m.docs[d.id].attached).length} attached to application`;
        for (const d of s.docs) {
          const w=docs[d.id],v=m.docs[d.id];w.attach.textContent=v.attached?'Remove attachment':'Attach file';
          w.attach.setAttribute('aria-pressed',String(v.attached));w.chooser.hidden=!v.attached;w.fileState.textContent=v.attached?'Attached / '+(v.type||'Document type not selected'):'Available in document library / Not attached';
          for(const [type,b] of w.buttons)b.setAttribute('aria-checked',String(type===v.type));
          w.err.textContent=m.errors[d.id]||'';
        }
        const errors=Object.values(m.errors);errorBox.hidden=!errors.length;
        errorBox.textContent=errors.length ? `${errors.length} ${errors.length===1?'item needs':'items need'} attention. ${m.errors._form||'Check the highlighted entries before continuing.'}` : '';
        notice.hidden=s.scenario!=='saveresume'&&s.record.eligible;
        notice.classList.toggle('bad',!s.record.eligible);
        if(!s.record.eligible)notice.textContent=`Not eligible: ${s.record.months} months of residence; ${s.record.minimum} required.`;
        check.checked=m.declared;
        evidenceSummary.textContent=s.docs.length ? 'Attached evidence: '+s.docs.filter(d=>m.docs[d.id].attached).map(d=>`${d.label} (${m.docs[d.id].type||'unclassified'})`).join('; ') : 'No evidence attachments required for this application.';
        edit.hidden=m.page==='form';save.hidden=m.page!=='form';primary.hidden=m.page==='receipt';
        primary.textContent=m.page==='form'?'Continue to review':'Send application';
        saveStatus.textContent=m.submitted?'Submission recorded':m.saved?'Draft saved · current session':'Changes are not yet saved';
        factsDl.replaceChildren();
        for (const f of fam.facts(m,s)) {const row=u.el('div','',factsDl);u.el('dt','',row,f.label);u.el('dd','',row,f.value);}
        if(changed)pane.scrollTop=0;
        geometry();
      }
      env.ui.scrollPane(pane,{onScroll:()=>geometry()});
      pane.addEventListener('scroll',geometry);
      current={ctx,pane,targets};
      paint(ctx.model);
      return {anchors:[app],sync:paint};
    },
    locate(t) {
      if (t.pane) return current.ctx.util.center(current.pane);
      const el=current.targets.get(env.taskDef.helpers.targetKey(t));
      if (!el || !el.getClientRects().length) throw new Error(`use-gov-portal target is hidden: ${JSON.stringify(t)}`);
      return current.ctx.util.center(el);
    }
  });
})();
