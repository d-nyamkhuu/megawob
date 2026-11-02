/* base / use-form-builder / classic: Fieldnote's draft editor. Question canvas + properties inspector,
 * answer-to-section routing, drag handles for sections/questions, and response-policy settings.
 * Workspace navigation, adjacent forms, collaborator/activity drawers, publishing details and realistic
 * respondent previews are widget-local. Decorative icons are inline SVG only.
 * All authoring controls operate on the task model; nested panes wheel, with visible geometry mirrored
 * into model.view for the oracle. No native picker popups. Fixed outer anchor, token-based light/dark UI.
 */
(function () {
  'use strict';
  const CSS = `
  .af-app { position:absolute; inset:10px; display:flex; flex-direction:column; min-width:0; min-height:0;
    border:1px solid var(--line); border-radius:10px; background:var(--panel); overflow:hidden;
    font-size:13px; box-shadow:0 4px 18px #0000000b; }
  .af-app button,.af-app input,.af-app textarea { font:inherit; color:var(--fg); }
  .af-app button { cursor:pointer; border:1px solid var(--line); background:var(--panel); border-radius:5px; padding:6px 9px; }
  .af-app button:hover { border-color:var(--accent); background:color-mix(in srgb,var(--accent) 7%,var(--panel)); }
  .af-app button:focus-visible,.af-app input:focus,.af-app textarea:focus { outline:2px solid var(--accent); outline-offset:1px; }
  .af-app button:disabled { opacity:.55; cursor:default; }
  .af-top { flex:none; display:flex; align-items:center; gap:10px; padding:9px 14px; border-bottom:1px solid var(--line); }
  .af-logo { display:grid; place-items:center; width:30px; height:32px; background:var(--accent); color:white; border-radius:7px; font-size:21px; font-weight:750; }
  .af-title { min-width:0; flex:1; }
  .af-title b { display:block; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; font-size:14px; }
  .af-title small { color:var(--muted); font-size:11px; }
  .af-status { color:var(--muted); white-space:nowrap; font-size:11px; }
  .af-top .af-primary { background:var(--accent); color:white; border-color:var(--accent); }
  .af-tabs { flex:none; display:flex; align-items:center; gap:3px; padding:0 10px; height:37px; border-bottom:1px solid var(--line); }
  .af-tabs button { border:0; border-radius:0; background:none; padding:9px 11px; color:var(--muted); height:37px; font-size:12px; }
  .af-tabs button[aria-selected=true] { color:var(--accent); border-bottom:3px solid var(--accent); font-weight:650; }
  .af-tabs .af-response { margin-left:auto; color:var(--muted); font-size:11px; }
  .af-sections { display:flex; flex:none; gap:5px; padding:7px 10px; border-bottom:1px solid var(--line); overflow-x:auto; }
  .af-sections button { flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; font-size:11px; text-align:left; padding:5px 7px; }
  .af-sections button.on { border-color:var(--accent); color:var(--accent); background:color-mix(in srgb,var(--accent) 9%,var(--panel)); }
  .af-body { flex:1; min-height:0; min-width:0; display:grid; grid-template-columns:minmax(160px, 1fr) minmax(245px, .9fr); }
  .af-canvas { min-height:0; min-width:0; overflow:auto; overscroll-behavior:contain; background:var(--bg); padding:14px; border-right:1px solid var(--line); }
  .af-inspector { min-height:0; min-width:0; overflow:auto; overscroll-behavior:contain; padding:14px; }
  .af-app h2 { font-size:18px; line-height:1.2; margin:0 0 4px; letter-spacing:-.3px; overflow-wrap:anywhere; }
  .af-app h3 { font-size:14px; margin:0 0 10px; }
  .af-kicker { font-size:10px; text-transform:uppercase; letter-spacing:.08em; color:var(--muted); margin:0 0 7px; }
  .af-desc { color:var(--muted); font-size:11px; margin:4px 0 12px; line-height:1.45; overflow-wrap:anywhere; }
  .af-card { position:relative; margin:8px 0; border:1px solid var(--line); border-left:3px solid var(--line); border-radius:6px; background:var(--panel); padding:10px; cursor:pointer; }
  .af-card.selected { border-color:var(--accent); }
  .af-card-top { display:flex; gap:6px; color:var(--muted); font-size:10px; margin-bottom:5px; }
  .af-card-title { font-weight:650; line-height:1.35; overflow-wrap:anywhere; }
  .af-preview-line { height:8px; border-bottom:1px dotted var(--line); margin-top:7px; width:85%; }
  .af-preview-options { margin-top:7px; color:var(--muted); font-size:11px; overflow-wrap:anywhere; }
  .af-add { width:100%; border-style:dashed!important; color:var(--accent)!important; margin:8px 0 0; }
  .af-field { margin:0 0 11px; display:block; min-width:0; }
  .af-label { display:block; font-weight:600; margin-bottom:5px; font-size:11px; }
  .af-input { background:var(--panel); border:1px solid var(--line); border-radius:5px; width:100%; padding:7px 8px; font-size:12px!important; user-select:text; -webkit-user-select:text; }
  textarea.af-input { resize:vertical; min-height:59px; line-height:1.45; }
  .af-select { width:100%; display:flex; justify-content:space-between; gap:5px; text-align:left; font-size:12px!important; min-height:31px; }
  .af-select span:first-child { min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .af-divider { border-top:1px solid var(--line); margin:13px 0; }
  .af-pair { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
  .af-toggle-row { display:flex; gap:12px; align-items:center; justify-content:space-between; padding:10px 0; border-bottom:1px solid var(--line); }
  .af-toggle-row b { font-size:12px; display:block; }
  .af-toggle-row small { font-size:11px; color:var(--muted); display:block; margin-top:3px; }
  .af-switch { flex:none; width:33px; height:19px; padding:2px!important; border:0!important; border-radius:20px!important; background:var(--line)!important; }
  .af-switch:after { content:''; display:block; width:15px; height:15px; border-radius:50%; background:white; box-shadow:0 1px 3px #0004; }
  .af-switch[aria-checked=true] { background:var(--accent)!important; }
  .af-switch[aria-checked=true]:after { margin-left:14px; }
  .af-notice { border:1px solid var(--line); border-radius:5px; padding:8px; color:var(--muted); font-size:10px; line-height:1.5; margin-top:12px; background:var(--bg); }
  .af-answer { margin:10px 0 14px; }
  .af-answer .af-desc { margin:3px 0 5px; }
  .af-answer b { font-size:12px; overflow-wrap:anywhere; display:block; }
  .af-foot { flex:none; display:flex; gap:12px; flex-wrap:wrap; align-items:center; padding:7px 12px; border-top:1px solid var(--line); background:var(--panel); font-size:10px; color:var(--muted); }
  .af-foot b { font-weight:600; color:var(--fg); }
  .af-foot .af-id { margin-left:auto; }
  .af-order { position:relative; }
  .af-order-row { height:37px; border:1px solid var(--line); border-radius:5px; background:var(--panel); margin-bottom:5px; display:flex; gap:8px; align-items:center; padding:0 8px; }
  .af-order-row.dragging { z-index:3; border-color:var(--accent); box-shadow:0 4px 12px #0003; }
  .af-grip { color:var(--muted); cursor:grab; padding:5px; touch-action:none; flex:none; }
  .af-order-label { overflow:hidden; white-space:nowrap; text-overflow:ellipsis; flex:1; font-size:12px; }
  .af-order-section { cursor:pointer; }
  .af-order-section.on { border-color:var(--accent); }
  .af-menu { position:absolute; z-index:30; border:1px solid var(--line); background:var(--panel); box-shadow:0 8px 24px #0003; border-radius:6px; padding:4px; overflow:auto; }
  .af-menu button { display:block; width:100%; border:0; text-align:left; padding:6px 8px; min-height:29px; font-size:12px; }
  .af-menu button.chosen { background:color-mix(in srgb,var(--accent) 12%,var(--panel)); color:var(--accent); }
  .af-menu-back { position:absolute; inset:0; z-index:29; background:transparent; }
  .af-settings { padding:14px 22px; }
  .af-settings .af-toggle-row { padding:13px 0; }
  .af-settings .af-field { max-width:260px; margin-top:13px; }
  .af-dialog { position:absolute; z-index:35; inset:12px; border:1px solid var(--line); border-radius:8px; background:var(--panel); display:flex; flex-direction:column; overflow:hidden; }
  .af-dialog-head { display:flex; align-items:center; justify-content:space-between; padding:12px 18px; border-bottom:1px solid var(--line); }
  .af-dialog-body { overflow:auto; padding:18px; }
  .af-empty { padding:25px 10px; text-align:center; color:var(--muted); }
  .af-compact .af-status,.af-compact .af-response,.af-compact .af-title small { display:none; }
  .af-compact .af-top { padding:7px 10px; }
  .af-compact .af-canvas,.af-compact .af-inspector { padding:10px; }
  .af-compact .af-tabs button { padding:8px; }
  .af-app [hidden] { display:none!important; }
  .af-icon { width:16px; height:16px; flex:none; vertical-align:middle; fill:none; stroke:currentColor; stroke-width:1.7; stroke-linecap:round; stroke-linejoin:round; pointer-events:none; }
  .af-workspace { display:flex; flex:1; min-height:0; min-width:0; }
  .af-editor { display:flex; flex:1; flex-direction:column; min-width:0; min-height:0; }
  .af-sidebar { flex:none; width:158px; border-right:1px solid var(--line); background:color-mix(in srgb,var(--bg) 65%,var(--panel)); display:flex; flex-direction:column; min-height:0; }
  .af-sidebar-scroll { padding:10px 8px; flex:1; min-height:0; overflow:auto; overscroll-behavior:contain; }
  .af-side-brand { display:flex; gap:8px; align-items:center; padding:2px 5px 12px; font-size:12px; font-weight:650; }
  .af-side-caption { text-transform:uppercase; letter-spacing:.07em; font-size:9px; color:var(--muted); margin:17px 7px 6px; }
  .af-sidebar button { display:flex; align-items:center; gap:8px; width:100%; text-align:left; background:transparent; border-color:transparent; padding:7px 6px; font-size:11px; }
  .af-sidebar button span { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .af-sidebar button small { margin-left:auto; color:var(--muted); font-size:9px; }
  .af-sidebar .af-current { background:color-mix(in srgb,var(--accent) 10%,var(--panel)); color:var(--accent); border-color:color-mix(in srgb,var(--accent) 25%,var(--line)); }
  .af-sidebar .af-subform { padding:7px 5px 7px 12px; font-size:10px; color:var(--muted); }
  .af-side-foot { padding:10px 12px; border-top:1px solid var(--line); font-size:10px; color:var(--muted); }
  .af-meter { height:4px; background:var(--line); margin:6px 0; border-radius:3px; }
  .af-meter span { display:block; height:100%; width:32%; background:var(--accent); border-radius:3px; }
  .af-nav-small .af-sidebar { width:43px; }
  .af-nav-small .af-sidebar button { justify-content:center; padding:8px 3px; }
  .af-nav-small .af-sidebar button span,.af-nav-small .af-sidebar button small,.af-nav-small .af-side-caption,.af-nav-small .af-side-brand span,.af-nav-small .af-side-foot,.af-nav-small .af-sidebar .af-subform { display:none; }
  .af-top { gap:9px; padding:8px 12px; }
  .af-logo { width:29px; height:31px; }
  .af-logo .af-icon { width:21px; height:21px; }
  .af-top button { display:flex; align-items:center; gap:6px; font-size:11px; }
  .af-icon-btn { padding:6px!important; min-width:29px; position:relative; }
  .af-notification-count { position:absolute; right:1px; top:-4px; background:var(--accent); color:white; border:2px solid var(--panel); border-radius:8px; min-width:13px; font-size:8px; text-align:center; }
  .af-avatars { display:flex; margin:0 4px; }
  .af-avatar { width:24px; height:24px; border-radius:50%; border:2px solid var(--panel); background:color-mix(in srgb,var(--accent) 17%,var(--panel)); color:var(--fg); margin-left:-6px; display:grid; place-items:center; font-size:8px; font-weight:700; }
  .af-badge { display:inline-flex; align-items:center; gap:4px; border:1px solid var(--line); padding:2px 5px; border-radius:4px; font-size:9px; color:var(--muted); background:var(--panel); white-space:nowrap; }
  .af-badge .af-icon { width:11px; height:11px; }
  .af-status { display:flex; align-items:center; gap:4px; font-size:10px; }
  .af-status .af-icon { width:13px; height:13px; }
  .af-tabs .af-tool { margin-left:auto; display:flex; align-items:center; gap:5px; }
  .af-tabs .af-tool + .af-tool { margin-left:0; }
  .af-sections button { display:flex; align-items:center; gap:6px; }
  .af-sections button .af-section-label { overflow:hidden; text-overflow:ellipsis; }
  .af-sections button small { margin-left:auto; color:var(--muted); font-size:9px; }
  .af-form-header { padding:12px; margin-bottom:12px; border:1px solid var(--line); border-top:4px solid var(--accent); border-radius:6px; background:var(--panel); }
  .af-form-header h2 { font-size:17px; }
  .af-form-header p { margin:6px 0 8px; color:var(--muted); font-size:11px; }
  .af-section-heading { display:flex; align-items:center; justify-content:space-between; gap:7px; margin:10px 0 5px; }
  .af-section-heading h3 { margin:0; font-size:13px; }
  .af-card { padding:10px 12px; margin:9px 0; }
  .af-card-top { align-items:center; font-size:10px; margin-bottom:7px; }
  .af-card-top .af-icon { width:13px; height:13px; }
  .af-card-top .af-card-more { margin-left:auto; }
  .af-card-title { font-size:12px; }
  .af-preview-line { height:auto; min-height:27px; border:0; border-bottom:1px solid var(--line); margin-top:10px; width:95%; color:var(--muted); font-size:11px; font-weight:400; padding:5px 0; }
  .af-preview-options { display:flex; flex-direction:column; gap:5px; margin-top:10px; }
  .af-preview-option { display:flex; gap:7px; align-items:flex-start; font-size:11px; }
  .af-preview-option .af-icon { width:13px; height:13px; margin-top:1px; }
  .af-preview-more { font-size:10px; color:var(--muted); margin:2px 0 0 20px; }
  .af-property-heading { display:flex; align-items:center; gap:7px; border-bottom:1px solid var(--line); margin:-2px 0 13px; padding-bottom:9px; }
  .af-property-heading b { font-size:12px; }
  .af-property-heading small { margin-left:auto; color:var(--muted); font-size:9px; }
  .af-type-help { font-size:10px; color:var(--muted); padding:5px 0 8px; }
  .af-rule-summary { padding:9px; background:var(--bg); border:1px solid var(--line); border-radius:5px; font-size:10px; margin:9px 0; }
  .af-inline-error { color:color-mix(in srgb,#df4040 75%,var(--fg)); font-size:11px; display:flex; gap:6px; margin:7px 0; }
  .af-inline-error .af-icon { width:14px; height:14px; }
  .af-answer { border:1px solid var(--line); border-radius:6px; padding:10px; margin:9px 0; background:color-mix(in srgb,var(--bg) 40%,var(--panel)); }
  .af-answer .af-field { margin:8px 0 0; }
  .af-answer .af-condition { display:flex; align-items:center; gap:7px; }
  .af-answer .af-condition .af-icon { color:var(--accent); }
  .af-journey { border:1px solid var(--line); border-radius:6px; padding:10px; margin:14px 0; background:var(--panel); }
  .af-journey-row { display:flex; align-items:center; gap:8px; padding:7px 0; font-size:11px; border-bottom:1px solid var(--line); }
  .af-journey-row:last-child { border:0; }
  .af-journey-row small { margin-left:auto; color:var(--muted); font-size:10px; }
  .af-step { color:var(--muted); font-size:10px; width:18px; text-align:center; }
  .af-order-row { height:42px; }
  .af-order-meta { color:var(--muted); font-size:9px; margin-left:auto; white-space:nowrap; }
  .af-order-label b { display:block; font-weight:550; overflow:hidden; text-overflow:ellipsis; }
  .af-order-label small { display:block; font-size:9px; color:var(--muted); }
  .af-menu button { display:flex; align-items:center; gap:8px; padding:7px 8px; }
  .af-menu button .af-menu-label { flex:1; min-width:0; }
  .af-menu button small { display:block; color:var(--muted); font-size:9px; margin-top:2px; }
  .af-menu .af-menu-caption { padding:4px 8px 7px; text-transform:uppercase; font-size:9px; letter-spacing:.07em; color:var(--muted); border-bottom:1px solid var(--line); margin-bottom:3px; }
  .af-settings { padding:16px 20px; }
  .af-settings-group { border:1px solid var(--line); border-radius:7px; padding:10px 12px; margin:12px 0; }
  .af-settings-group h3 { display:flex; align-items:center; gap:7px; font-size:12px; padding-bottom:9px; border-bottom:1px solid var(--line); margin:0; }
  .af-settings-group .af-toggle-row:last-child { border:0; }
  .af-policy-panel { overflow:auto; padding:18px 14px; border-left:1px solid var(--line); background:var(--bg); }
  .af-policy-panel h3 { font-size:12px; }
  .af-policy-panel .af-policy-row { padding:9px 0; border-bottom:1px solid var(--line); font-size:11px; display:flex; justify-content:space-between; gap:12px; }
  .af-policy-row span { color:var(--muted); }
  .af-smallprint { color:var(--muted); font-size:10px; line-height:1.5; }
  .af-dialog { inset:16px; max-width:680px; margin:auto; box-shadow:0 12px 40px #0003; }
  .af-dialog-body .af-activity-row { display:flex; align-items:flex-start; gap:10px; padding:12px 0; border-bottom:1px solid var(--line); font-size:12px; }
  .af-activity-row small { display:block; color:var(--muted); margin-top:3px; font-size:10px; }
  .af-dialog-head .af-icon-btn { margin-left:auto; }
  .af-share-link { border:1px solid var(--line); padding:10px; border-radius:5px; background:var(--bg); font-size:11px; overflow-wrap:anywhere; }
  .af-foot { gap:12px; padding:6px 10px; }
  .af-compact .af-avatars,.af-compact .af-top-draft,.af-compact .af-history { display:none; }
  .af-compact .af-top { gap:6px; }
  .af-compact .af-publish-label { display:none; }
  .af-compact .af-tabs .af-tool { padding:8px 6px; }
  `;
  const ICONS = {
    form: ['M6 3h12v18H6z','M9 7h6M9 11h6M9 15h4'],
    grid: ['M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z'],
    folder: ['M3 6h7l2 3h9v11H3z'], search: ['M20 20l-5-5','M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0'],
    chevron: ['m8 10 4 4 4-4'], arrow: ['M4 12h16m-5-5 5 5-5 5'],
    check: ['m5 12 4 4L19 6'], plus: ['M12 5v14M5 12h14'],
    eye: ['M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12','M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0'],
    share: ['M12 16V3m-5 5 5-5 5 5','M5 12v9h14v-9'],
    bell: ['M5 17h14l-2-4V9a5 5 0 0 0-10 0v4z','M10 21h4'],
    history: ['M3 8V3m0 5h5','M4 7a9 9 0 1 1-1 9','M12 7v5l3 2'],
    people: ['M15 21v-3a5 5 0 0 0-10 0v3','M14 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0','M17 4a4 4 0 0 1 0 8m2 3a5 5 0 0 1 3 5'],
    grip: ['M8 5h1m6 0h1M8 12h1m6 0h1M8 19h1m6 0h1'],
    text: ['M4 5h16M12 5v15M8 20h8'], paragraph: ['M4 5h16M4 10h16M4 15h16M4 20h10'],
    radio: ['M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0'], checkbox: ['M4 4h16v16H4z','m7 12 3 3 7-7'], box: ['M4 4h16v16H4z'],
    number: ['M8 3 6 21M17 3l-2 18M3 9h18M2 15h18'],
    route: ['M5 4v12a4 4 0 0 0 4 4h10m-4-4 4 4-4 3','M5 4v3a4 4 0 0 0 4 4h10m-4-4 4 4-4 4'],
    settings: ['M4 7h16M4 17h16','M9 4v6M15 14v6'],
    lock: ['M5 10h14v11H5z','M8 10V6a4 4 0 0 1 8 0v4'],
    calendar: ['M4 5h16v16H4zM4 10h16M8 2v6M16 2v6'],
    info: ['M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0','M12 11v6M12 7h.01'],
    more: ['M5 12h.01M12 12h.01M19 12h.01'],
    close: ['m6 6 12 12M6 18 18 6'], mail: ['M3 5h18v14H3z','m3 6 9 7 9-7'],
    warning: ['m12 3 10 18H2z','M12 9v5M12 17h.01'],
    palette: ['M12 3a9 9 0 1 0 0 18h2a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h4a4 4 0 0 0 4-4c0-3-4-6-9-6','M7 8h.01M11 6h.01M6 12h.01M16 7h.01']
  };
  const typeIcon = t => ({'Short text':'text','Paragraph':'paragraph','Multiple choice':'radio','Checkboxes':'checkbox','Number':'number'}[t] || 'form');
  let live;
  env.widget({task:'use-form-builder',site:'base',name:'classic',split:'train',
    scenarios:['addq','branching','reorder','validation','settings'],
    render(ctx) {
      ctx.css('app-forms-classic',CSS);
      const F=env.taskDef, {spec,util}=ctx;
      const root=util.el('div','af-app'+(ctx.size.width<900?' af-compact':'')+(ctx.size.width<830?' af-nav-small':''),ctx.stage);
      // The reference frame reserves a short note; a multi-question brief can make it taller.
      // Keep the editor above the actual note while staying within the supplied stage.
      const note=document.querySelector('.ref-note');
      if(note){const overlap=ctx.stage.getBoundingClientRect().bottom-note.getBoundingClientRect().top;root.style.bottom=Math.max(10,overlap+8)+'px';}
      const st={ctx,root,targets:new Map(),panes:{},sorts:{},syncers:[],menus:null,painting:false};live=st;
      const key=F.helpers.targetKey;
      const register=(t,el,pane)=>{st.targets.set(key(t),{el,pane});return el;};
      const el=(tag,cls,parent,text)=>util.el(tag,cls,parent,text);
      const button=(label,parent,t,act,cls='')=> {
        const b=el('button',cls,parent,label);b.type='button';
        if(t)register(t,b);
        if(act)b.addEventListener('click',()=>commit(act));
        return b;
      };
      function icon(name,parent,size=16) {
        const svg=util.svg('svg',{viewBox:'0 0 24 24',width:size,height:size,'aria-hidden':'true',class:'af-icon'},parent);
        for(const d of ICONS[name]||ICONS.form)util.svg('path',{d},svg);
        return svg;
      }
      function iconButton(label,parent,name,fn,cls='') {
        const b=button('',parent,null,null,'af-icon-btn '+cls);b.setAttribute('aria-label',label);b.title=label;icon(name,b);if(fn)b.addEventListener('click',fn);return b;
      }
      const cr=ctx.rng.fork('workspace-content');
      const peers=[spec.owner,...Array.from({length:2},()=>env.content.personName(cr,{csplit:spec.csplit}).full)];
      const neighboringForms=['Event registration','Customer onboarding','Quarterly pulse','Speaker proposals','Volunteer interest','Partner request'];
      const top=el('div','af-top',root);
      icon('form',el('div','af-logo',top));
      const title=el('div','af-title',top);
      el('b','',title,spec.title);el('small','',title,`Fieldnote / Team workspace · ${spec.owner}`);
      el('span','af-badge af-top-draft',top,'Draft');
      const saved=el('span','af-status',top);icon('check',saved);el('span','',saved,'Saved');
      const avatars=el('div','af-avatars',top);avatars.title='Editors: '+peers.join(', ');
      for(const person of peers)el('span','af-avatar',avatars,person.split(' ').map(x=>x[0]).slice(0,2).join(''));
      iconButton('Version history',top,'history',()=>drawer('history'),'af-history');
      const notifications=iconButton('Notifications',top,'bell',()=>drawer('activity'));
      el('span','af-notification-count',notifications,'3');
      const preview=button('Preview',top,{preview:true},null);
      preview.addEventListener('click',()=>commit({ui:{preview:!ctx.model.ui.preview}}));
      icon('eye',preview);
      const share=button('Share',top,null,null,'af-primary');icon('share',share);share.addEventListener('click',()=>drawer('share'));
      const workspace=el('div','af-workspace',root);
      const sidebar=el('aside','af-sidebar',workspace);sidebar.setAttribute('aria-label','Workspace navigation');
      const nav=el('div','af-sidebar-scroll',sidebar);
      const brand=el('div','af-side-brand',nav);icon('grid',brand);el('span','',brand,'Team workspace');
      function navButton(label,name,fn,cls='',count='') {
        const b=button('',nav,null,null,cls);icon(name,b);el('span','',b,label);if(count)el('small','',b,count);b.title=label;b.setAttribute('aria-label',label);b.addEventListener('click',fn);return b;
      }
      navButton('All forms','grid',()=>drawer('forms'),'','18');
      navButton('Shared with me','people',()=>drawer('forms'),'','6');
      navButton('Recent activity','history',()=>drawer('activity'));
      el('div','af-side-caption',nav,'Projects');
      navButton('Research','folder',()=>drawer('forms'),'','8');
      navButton('Operations','folder',()=>drawer('forms'),'','5');
      el('div','af-side-caption',nav,'Recent forms');
      navButton(spec.title.split(' · ')[1]||'Current draft','form',()=>{},'af-current');
      for(const title of neighboringForms)navButton(title,'form',()=>drawer('forms'),'af-subform');
      const navFoot=el('div','af-side-foot',sidebar,'Team plan');const meter=el('div','af-meter',navFoot);el('span','',meter);el('span','',navFoot,'320 / 1,000 monthly responses');
      const editor=el('div','af-editor',workspace);
      const tabs=el('nav','af-tabs',editor);tabs.setAttribute('aria-label','Form editor');
      const tabButtons={};
      for(const [id,label]of [['questions','Questions'],['logic','Logic'],['arrange','Arrange'],['settings','Settings']]) {
        tabButtons[id]=button(label,tabs,{tab:id},{ui:{tab:id}});tabButtons[id].setAttribute('role','tab');
      }
      const responses=button('Responses',tabs,null,null,'af-tool');icon('grid',responses);responses.addEventListener('click',()=>drawer('responses'));
      const theme=iconButton('Theme and appearance',tabs,'palette',()=>drawer('theme'),'af-tool');
      theme.style.marginLeft='0';
      const sections=el('div','af-sections',editor);
      const body=el('div','af-body',editor);
      const foot=el('div','af-foot',root);
      function status() {
        foot.replaceChildren();
        for(const f of F.facts(ctx.model,spec)) {
          const label=el('span',f.label==='Form ID'?'af-id':'',foot,`${f.label}: `);el('b','',label,f.value);
        }
      }
      function mirror() {
        if(live!==st||st.painting)return;
        const hidden={};
        for(const [k,v]of st.targets) {
          if(!v.pane||!v.el.isConnected)continue;
          const p=st.panes[v.pane];if(!p)continue;
          const r=v.el.getBoundingClientRect(),pr=p.getBoundingClientRect();
          const center=r.top+r.height/2;
          if(center<pr.top+8 || center>pr.bottom-8)hidden[k]={pane:v.pane,dir:center<pr.top+8?-1:1};
        }
        // Only layout facts; no scored field changes during measuring or locating.
        if(JSON.stringify(ctx.model.view?.hidden)!==JSON.stringify(hidden))ctx.update({...ctx.model,view:{hidden}});
      }
      function commit(act,rebuild=true) {
        if(live!==st)return;
        ctx.update(F.helpers.apply(ctx.model,spec,act));
        if(rebuild)paint();else {for(const sync of st.syncers)sync();status();mirror();}
      }
      function pane(name,cls,parent=body) {
        const p=el('div',cls,parent);st.panes[name]=p;register({pane:name},p);
        p.addEventListener('scroll',()=>mirror());
        p.addEventListener('wheel',e=>{e.preventDefault();p.scrollTop+=Math.sign(e.deltaY)*Math.min(Math.abs(e.deltaY),Math.max(16,p.clientHeight/2));mirror();},{passive:false});
        return p;
      }
      function field(label,name,value,parent,paneName,multiline=false) {
        const wrap=el('label','af-field',parent);el('span','af-label',wrap,label);
        const inp=el(multiline?'textarea':'input','af-input',wrap);
        if(!multiline)inp.type='text';
        inp.value=value;inp.autocomplete='off';inp.spellcheck=false;
        register({field:name},inp,paneName);
        const read=()=>name==='closeDate'?ctx.model.settings.closeDate:name==='title'?F.helpers.question(ctx.model,ctx.model.ui.selected)?.title:name==='options'?F.helpers.question(ctx.model,ctx.model.ui.selected)?.options.join('\n'):F.helpers.question(ctx.model,ctx.model.ui.selected)?.validation[name];
        st.syncers.push(()=>{const v=read()??'';if(inp.value!==v && !(name==='options'&&inp.value.endsWith('\n')&&inp.value.slice(0,-1)===v))inp.value=v;});
        inp.addEventListener('input',()=>commit({field:[name,inp.value]},false));
        return inp;
      }
      function select(label,name,value,parent,paneName) {
        const wrap=el('div','af-field',parent);el('span','af-label',wrap,label);
        const b=button('',wrap,{open:name},{ui:{open:ctx.model.ui.open===name?null:name}},'af-select');
        el('span','',b,value);icon('chevron',b);register({open:name},b,paneName);return b;
      }
      function toggle(label,hint,name,on,parent,paneName) {
        const row=el('div','af-toggle-row',parent),text=el('div','',row);
        el('b','',text,label);if(hint)el('small','',text,hint);
        const b=button('',row,{toggle:name},{toggle:name},'af-switch');
        b.setAttribute('role','switch');b.setAttribute('aria-label',label);b.setAttribute('aria-checked',String(on));register({toggle:name},b,paneName);
        return b;
      }
      function journey(parent) {
        const box=el('div','af-journey',parent);el('div','af-kicker',box,'Respondent journey');
        ctx.model.sectionOrder.forEach((id,i)=>{
          const row=el('div','af-journey-row',box);el('span','af-step',row,String(i+1));
          el('span','',row,spec.sections.find(x=>x.id===id).title);
          el('small','',row,`${ctx.model.orders[id].length} questions`);icon('arrow',row,13);
        });
      }
      function canvas(parent) {
        const m=ctx.model,sec=spec.sections.find(s=>s.id===m.ui.section);
        const header=el('div','af-form-header',parent);
        el('div','af-kicker',header,'FORM / DRAFT');el('h2','',header,spec.title.split(' · ')[1]||spec.title);
        el('p','',header,'Your feedback helps us plan better experiences. Responses are shared with the organizing team.');
        const badge=el('span','af-badge',header);icon('lock',badge);el('span','',badge,'Not published');
        const sectionHead=el('div','af-section-heading',parent);el('h3','',sectionHead,sec.title);
        el('span','af-badge',sectionHead,`${m.sectionOrder.indexOf(sec.id)+1} / ${spec.sections.length}`);
        for(const id of m.orders[sec.id]) {
          const q=F.helpers.question(m,id);if(!q)continue;
          const card=el('article','af-card'+(m.ui.selected===id?' selected':''),parent);
          card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-label',q.title);
          register({question:id},card,'canvas');
          card.addEventListener('click',()=>commit({ui:{selected:id}}));
          card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();commit({ui:{selected:id}});}});
          const type=el('div','af-card-top',card);icon(typeIcon(q.type),type);
          const typeLabel=el('span','',type,`${m.orders[sec.id].indexOf(id)+1} / ${q.type}`);
          icon('more',el('span','af-card-more',type));
          const name=el('div','af-card-title',card,q.title);
          const preview=el('div',q.options.length?'af-preview-options':'af-preview-line',card);
          st.syncers.push(()=>{
            const now=F.helpers.question(ctx.model,id);if(!now)return;
            name.textContent=now.title+(now.validation.required?' *':'');
            typeLabel.textContent=`${ctx.model.orders[sec.id].indexOf(id)+1} / ${now.type}`;
            preview.replaceChildren();
            if(now.options.length) {
              now.options.slice(0,2).forEach(text=>{const row=el('div','af-preview-option',preview);icon(now.type==='Checkboxes'?'box':'radio',row);el('span','',row,text);});
              if(now.options.length>2)el('span','af-preview-more',preview,`+ ${now.options.length-2} more options`);
            } else preview.textContent=now.type==='Number'?'Enter a number':now.type==='Paragraph'?'Long answer text':'Short answer text';
          });
        }
        if(m.ui.tab==='questions') {
          const add=button('Add question',parent,{add:true},{ui:{open:m.ui.open==='add'?null:'add'}},'af-add');icon('plus',add);register({add:true},add,'canvas');
          el('p','af-smallprint',parent,'End of section / continues to the next section');
        } else journey(parent);
      }
      function inspector(p) {
        const m=ctx.model,q=F.helpers.question(m,m.ui.selected);
        if(!q){el('div','af-empty',p,'Select a question or add your first question.');return;}
        if(m.ui.tab==='logic') {
          const head=el('div','af-property-heading',p);icon('route',head);el('b','',head,'Answer routing');el('small','',head,`Q${m.orders[q.section].indexOf(q.id)+1}`);el('h3','',p,q.title);
          if(!q.options.length) {icon('route',el('div','af-empty',p));el('p','af-desc',p,'No answer rules for this question. Routing is available for Multiple choice and Checkboxes.');const other=m.questions.find(x=>x.options.length);if(other)button('View choice question',p,null,{ui:{section:other.section,selected:other.id}});journey(p);return;}
          el('p','af-desc',p,'If answer is equal to … go to section. Unconfigured answers continue normally.');
          q.options.forEach((answer,i)=>{
            const row=el('div','af-answer',p);el('div','af-kicker',row,`Rule ${String(i+1).padStart(2,'0')} / answer equals`);const condition=el('div','af-condition',row);icon('radio',condition);el('b','',condition,answer);
            const dest=m.rules[q.id]?.[answer]||'next';
            select('Go to section',`route:${i}`,dest==='next'?'Continue to next section':spec.sections.find(s=>s.id===dest)?.title||dest,row,'inspector');
          });
          const count=Object.values(m.rules[q.id]||{}).filter(x=>x!=='next').length;el('div','af-rule-summary',p,`${count} custom routes / ${q.options.length} answer choices. Routing is evaluated when respondents finish this section.`);
          return;
        }
        const head=el('div','af-property-heading',p);icon(typeIcon(q.type),head);el('b','',head,'Question properties');el('small','',head,`Q${m.orders[q.section].indexOf(q.id)+1}`);
        field('Question title','title',q.title,p,'inspector',true);
        select('Question type','type',q.type,p,'inspector');
        if(q.options.length) {
          field('Answer options · one per line','options',q.options.join('\n'),p,'inspector',true);
          el('p','af-desc',p,'Options appear to respondents in this order.');
        }
        el('div','af-divider',p);el('h3','',p,'Response validation');
        select('Rule','preset',q.validation.preset,p,'inspector');
        if(['Number range','Text length'].includes(q.validation.preset)) {
          const row=el('div','af-pair',p);
          field(q.validation.preset==='Text length'?'Minimum characters':'Minimum','min',q.validation.min,row,'inspector');
          field(q.validation.preset==='Text length'?'Maximum characters':'Maximum','max',q.validation.max,row,'inspector');
          el('p','af-desc',p,'Both endpoints are inclusive.');
        }
        const validationState=el('div','af-rule-summary',p);
        const validationError=el('div','af-inline-error',p);
        st.syncers.push(()=>{
          const v=F.helpers.question(ctx.model,q.id)?.validation;if(!v)return;
          validationState.textContent=v.preset==='None'?'No response validation. Any answer is accepted.':v.preset==='Number range'?`Accept numbers from ${v.min||'no minimum'} to ${v.max||'no maximum'}.`:v.preset==='Text length'?`Accept ${v.min||'0'} to ${v.max||'unlimited'} characters.`:v.preset==='Email address'?'Example: name@example.com':'Responses must match the selected pattern preset.';
          const bounded=['Number range','Text length'].includes(v.preset);
          const invalid=bounded&&v.min!==''&&v.max!==''&&Number(v.min)>Number(v.max);
          validationError.hidden=!invalid;validationError.replaceChildren();
          if(invalid){icon('warning',validationError);el('span','',validationError,'Minimum cannot exceed maximum.');}
        });
        toggle('Required','Respondents must answer this question.','required',q.validation.required,p,'inspector');
        el('div','af-notice',p,'Built-in rules: number range, text length, email and pattern presets. External checks, one-time email verification codes, live inventory checks and digital signature verification are unavailable.');
        const del=button('Delete question',p,{remove:q.id},{remove:q.id});register({remove:q.id},del,'inspector');
      }
      function orderList(name,parent,ids,labelOf) {
        const box=el('div','af-order',parent),items={};
        const rowHeight=Math.max(34,Math.min(43,Math.floor((body.clientHeight-100)/Math.max(1,ids.length))-5));
        for(const id of ids) {
          const row=el('div','af-order-row'+(name==='sections'?' af-order-section'+(ctx.model.ui.section===id?' on':''):''),box);
          row.style.height=rowHeight+'px';
          const grip=el('span','af-grip',row);icon('grip',grip);grip.setAttribute('aria-label',`Drag ${labelOf(id)}`);
          const label=el('span','af-order-label',row);el('b','',label,labelOf(id));
          const subtitle=name==='sections'?`${ctx.model.orders[id].length} questions`:F.helpers.question(ctx.model,id).type;el('small','',label,subtitle);
          icon(name==='sections'?'form':typeIcon(F.helpers.question(ctx.model,id).type),row);items[id]=row;
          if(name==='sections')row.addEventListener('click',e=>{if(!e.target.closest('.af-grip'))commit({ui:{section:id,selected:ctx.model.orders[id][0]}});});
          register({list:name,item:id},grip,name==='sections'?'canvas':'inspector');
        }
        st.sorts[name]=env.ui.sortable(box,{
          order:ids,items,handle:'.af-grip',axis:'y',activeClass:'dragging',
          onChange(order){commit({order:[name,order]});},
        });
      }
      function menu() {
        const name=ctx.model.ui.open;if(!name)return;
        const q=F.helpers.question(ctx.model,ctx.model.ui.selected);
        let options,value,trigger;
        if(name==='add'){options=F.helpers.types.map(v=>[v,v]);trigger=st.targets.get(key({add:true}))?.el;}
        else if(name==='type'){options=F.helpers.types.map(v=>[v,v]);value=q?.type;}
        else if(name==='preset'){options=F.helpers.presets.map(v=>[v,v]);value=q?.validation.preset;}
        else if(name.startsWith('route:')){options=[['next','Continue to next section'],...spec.sections.map(s=>[s.id,s.title])];value=ctx.model.rules[q.id]?.[q.options[Number(name.slice(6))]]||'next';}
        if(!options)return;
        trigger ||= st.targets.get(key({open:name}))?.el;if(!trigger)return;
        const back=el('div','af-menu-back',root);back.addEventListener('click',()=>commit({ui:{open:null}}));
        const pop=el('div','af-menu',root);pop.setAttribute('role','menu');
        const r=trigger.getBoundingClientRect(),rr=root.getBoundingClientRect();
        const detailed=name==='add'||name==='type';
        const w=Math.min(Math.max(260,r.width),rr.width-16),h=Math.min(options.length*(detailed?45:32)+36,rr.height-20);
        const left=Math.max(8,Math.min(r.left-rr.left,rr.width-w-8));
        const top=Math.max(8,Math.min(r.bottom-rr.top+3,rr.height-h-8));
        Object.assign(pop.style,{left:left+'px',top:top+'px',width:w+'px',maxHeight:h+'px'});
        el('div','af-menu-caption',pop,name==='add'?'Add a question':name==='preset'?'Built-in validation':name==='type'?'Question type':'Destination');
        for(const [v,label]of options) {
          const b=button('',pop,{pick:[name,v]},name==='add'?{add:v}:{pick:[name,v]},value===v?'chosen':'');
          icon(name==='add'||name==='type'?typeIcon(v):name==='preset'?'check':'route',b);const labelBox=el('span','af-menu-label',b,label);
          if(detailed)el('small','',labelBox,{'Short text':'Names, emails and short answers','Paragraph':'Longer feedback and comments','Multiple choice':'Choose one answer from a list','Checkboxes':'Choose several answers','Number':'Quantities and numeric values'}[v]);
          if(value===v)icon('check',b);b.setAttribute('role','menuitem');
        }
        st.menus=[back,pop];
      }
      function drawer(kind) {
        root.querySelector('.af-dialog')?.remove();
        const dialog=el('section','af-dialog',root);dialog.setAttribute('role','dialog');dialog.setAttribute('aria-label',kind);
        const head=el('div','af-dialog-head',dialog);
        const names={forms:'Workspace forms',history:'Version history',activity:'Notifications',share:'Share this draft',responses:'Responses',theme:'Theme and appearance'};
        el('b','',head,names[kind]);iconButton('Close panel',head,'close',()=>dialog.remove());
        const panel=el('div','af-dialog-body',dialog);
        if(kind==='forms') {
          el('p','af-desc',panel,'Research / recently updated forms');
          [spec.title.split(' · ')[1],...neighboringForms].forEach((name,i)=>{const row=el('div','af-activity-row',panel);icon('form',row);const label=el('div','',row,name);el('small','',label,i===0?'Current draft / editing now':`${i%2?'Published':'Draft'} / ${peers[i%peers.length]} / ${i+1} days ago`);});
        } else if(kind==='activity'||kind==='history') {
          const rows=kind==='history'?['Draft changes saved','Question wording updated','Form created']:['You were added as an editor','A review was requested on Event registration','Quarterly pulse is ready for review'];
          rows.forEach((text,i)=>{const row=el('div','af-activity-row',panel);icon(kind==='history'?'history':'bell',row);const label=el('div','',row,text);el('small','',label,`${peers[i%peers.length]} / ${i===0?'Just now':i===1?'2 hours ago':'Yesterday'}`);});
        } else if(kind==='share') {
          el('h3','',panel,'Collaborator preview');el('p','af-desc',panel,'This form is a draft. People with workspace access can review its structure before it is published.');
          el('div','af-share-link',panel,`https://forms.example.com/preview/${spec.ref.toLowerCase()}`);
          peers.forEach((person,i)=>{const row=el('div','af-activity-row',panel);icon('people',row);const label=el('div','',row,person);el('small','',label,i?'Editor / Team workspace':'Owner / Can manage access');});
        } else if(kind==='responses') {
          icon('grid',el('div','af-empty',panel));el('h3','',panel,'No responses yet');el('p','af-desc',panel,'Responses will appear here after the form is published. Summary, individual responses and exports are available in this workspace.');
          el('div','af-notice',panel,'Status: Draft / Response storage: Team workspace / Export format: CSV');
        } else {
          el('h3','',panel,'Workspace theme');el('p','af-desc',panel,'This form inherits its colors and typography from Team workspace.');
          const swatches=el('div','af-pair',panel);for(const [label,color]of [['Accent','var(--accent)'],['Canvas','var(--bg)'],['Surface','var(--panel)'],['Text','var(--fg)']]){const cell=el('div','af-rule-summary',swatches,label);cell.style.borderTop=`12px solid ${color}`;}
          el('div','af-notice',panel,'Typography: System sans / Body: 13 px / Question labels: Medium / Form layout: Sections');
        }
      }
      function paint() {
        st.painting=true;
        const scrolls={};for(const [name,p]of Object.entries(st.panes))scrolls[name]=p.scrollTop;
        for(const ctl of Object.values(st.sorts))ctl.detach();
        st.sorts={};st.syncers=[];st.panes={};
        if(st.menus)st.menus.forEach(e=>e.remove());st.menus=null;
        root.querySelector('.af-dialog')?.remove();
        // Persistent header targets survive; body/section targets are re-registered below.
        for(const [k,v]of st.targets)if(!top.contains(v.el)&&!tabs.contains(v.el))st.targets.delete(k);
        sections.replaceChildren();body.replaceChildren();
        const m=ctx.model;
        for(const [id,b]of Object.entries(tabButtons))b.setAttribute('aria-selected',String(id===m.ui.tab));
        for(const id of m.sectionOrder) {
          const sec=spec.sections.find(s=>s.id===id);
          const b=button('',sections,{section:id},{ui:{section:id,selected:m.orders[id][0]||null}},m.ui.section===id?'on':'');
          el('span','af-section-label',b,`${m.sectionOrder.indexOf(id)+1}. ${sec.title}`);el('small','',b,String(m.orders[id].length));b.title=sec.title;
        }
        sections.hidden=m.ui.tab==='settings';
        body.style.gridTemplateColumns='';
        if(m.ui.tab==='settings') {
          body.style.gridTemplateColumns=body.clientWidth>780?'minmax(0,1fr) 218px':'minmax(0,1fr)';
          const p=pane('inspector','af-inspector af-settings');
          el('div','af-kicker',p,'Form settings');el('h2','',p,'Responses & access');
          el('p','af-desc',p,'Control how respondents identify themselves and when this form accepts responses.');
          const identity=el('div','af-settings-group',p);const identityTitle=el('h3','',identity);icon('people',identityTitle);el('span','',identityTitle,'Respondent identity');
          toggle('Collect email addresses','Store a respondent email with every response.','emails',m.settings.emails,identity,'inspector');
          toggle('Limit to one response','Require sign-in and prevent duplicate submissions.','one',m.settings.one,identity,'inspector');
          const schedule=el('div','af-settings-group',p);const scheduleTitle=el('h3','',schedule);icon('calendar',scheduleTitle);el('span','',scheduleTitle,'Response schedule');
          toggle('Close on a date','Stop accepting new responses on the scheduled day.','closeEnabled',m.settings.closeEnabled,schedule,'inspector');
          if(m.settings.closeEnabled){field('Closing date / YYYY-MM-DD','closeDate',m.settings.closeDate,schedule,'inspector');el('p','af-desc',schedule,'Closes at 23:59 in workspace time (UTC).');}
          const presentation=el('div','af-settings-group',p);el('h3','',presentation,'After submission');el('p','af-desc',presentation,'Confirmation message');el('div','af-share-link',presentation,'Thanks for your feedback. Your response has been recorded.');
          if(body.clientWidth>780){const overview=el('aside','af-policy-panel',body);el('h3','',overview,'Publishing overview');for(const [label,value]of [['Visibility','Unpublished'],['Owner',spec.owner],['Responses','0'],['Storage','Team workspace'],['Time zone','UTC']]){const row=el('div','af-policy-row',overview);el('span','',row,label);el('b','',row,value);}el('p','af-smallprint',overview,'Changes are saved to your draft. Share a preview with collaborators before distributing the live form.');}
          el('div','af-notice',p,'Response storage: Team workspace · Confirmation message: “Thanks for your feedback.”\nExisting responses are retained when a form closes.');
        } else if(m.ui.tab==='arrange') {
          const a=pane('canvas','af-canvas'),b=pane('inspector','af-inspector');
          el('div','af-kicker',a,'Structure');el('h3','',a,'Section order');el('p','af-desc',a,'Drag a handle. Select a section to arrange its questions.');
          orderList('sections',a,m.sectionOrder,id=>spec.sections.find(s=>s.id===id).title);journey(a);
          el('div','af-kicker',b,spec.sections.find(s=>s.id===m.ui.section).title);el('h3','',b,'Question order');el('p','af-desc',b,'Drag question handles into the desired order.');
          orderList('questions',b,m.orders[m.ui.section],id=>F.helpers.question(m,id).title);el('div','af-notice',b,'Question settings and answer rules stay attached when the form structure changes. Section boundaries are preserved.');
        } else {
          const a=pane('canvas','af-canvas'),b=pane('inspector','af-inspector');canvas(a);inspector(b);
        }
        for(const sync of st.syncers)sync();
        for(const [name,p]of Object.entries(st.panes))p.scrollTop=scrolls[name]||0;
        status();st.painting=false;mirror();
        menu();
        if(m.ui.preview) {
          const dialog=el('div','af-dialog',root),head=el('div','af-dialog-head',dialog);
          el('b','',head,'Respondent preview');button('Back to editor',head,{closePreview:true},{ui:{preview:false}});
          const p=el('div','af-dialog-body',dialog);
          el('h2','',p,spec.title);
          for(const sec of m.sectionOrder){el('h3','',p,spec.sections.find(s=>s.id===sec).title);for(const id of m.orders[sec]){const q=F.helpers.question(m,id),card=el('div','af-card',p);el('b','',card,q.title+(q.validation.required?' *':''));el('p','af-desc',card,q.type+(q.options.length?': '+q.options.join(' / '):''));}}
        }
      }
      st.locate=t=> {
        if(t.list&&t.slot!==undefined)return st.sorts[t.list].locateSlot(t.slot,undefined,t.item);
        if(t.list&&t.item)return st.sorts[t.list].locate(t.item);
        const v=st.targets.get(key(t));
        if(!v)throw new Error(`use-form-builder/classic target is not rendered: ${key(t)}`);
        // Clipped scroll panes use a point inside the exposed viewport, not an off-screen child.
        const r=v.el.getBoundingClientRect();
        return [r.left+r.width/2,r.top+r.height/2];
      };
      paint();return {anchors:[root],sync:paint};
    },
    locate(t){return live.locate(t);}
  });
})();
