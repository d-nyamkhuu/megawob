/* use-form-builder/_assets: unchanged editor stylesheet, icon paths and token defaults; no episode state. */
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
  const TOKENS = {
    accent: 'var(--accent)', background: 'var(--bg)', panel: 'var(--panel)', text: 'var(--fg)',
    muted: 'var(--muted)', line: 'var(--line)', fontFamily: null, fontSize: '13px', radius: '10px',
    inset: 10, noteGap: 8, compactWidth: 900, smallNavWidth: 830, sidebarWidth: 158, smallSidebarWidth: 43,
    columns: 'minmax(160px, 1fr) minmax(245px, .9fr)', policyWidth: 780, policyPanelWidth: 218,
    menuWidth: 260, rowMin: 34, rowMax: 43, previewOptions: 2,
    brand: 'Fieldnote', workspace: 'Team workspace', icons: ICONS,
    typeIcons: {'Short text':'text','Paragraph':'paragraph','Multiple choice':'radio','Checkboxes':'checkbox','Number':'number'},
    neighboringForms: ['Event registration','Customer onboarding','Quarterly pulse','Speaker proposals','Volunteer interest','Partner request'],
    tabs: [['questions','Questions'],['logic','Logic'],['arrange','Arrange'],['settings','Settings']],
    typeDetails: {'Short text':'Names, emails and short answers','Paragraph':'Longer feedback and comments','Multiple choice':'Choose one answer from a list','Checkboxes':'Choose several answers','Number':'Quantities and numeric values'},
  };
  env.template('use-form-builder/_assets', () => ({ CSS, TOKENS }));
})();
