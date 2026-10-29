/* base / use-site-builder / classic: a dense, token-themed publishing studio.
 * Product navigation, project menus, activity, layers, campaign delivery, SEO advanced
 * settings and calendar history provide unscored context around the unchanged task.
 * Stable workspace anchor; inner library/canvas/inspector panes wheel independently.
 * Pointer-captured palette, section and calendar drags; native text fields enforce
 * advertised limits. Every repaint reads ctx.model, including injected corrections.
 * Model view.hidden mirrors clipped controls so the task oracle can wheel first;
 * locate() only reads geometry. No native pickers, timers, external assets or network.
 */
(function () {
  'use strict';
  const CSS = `
  .ab-app { position:absolute; display:flex; flex-direction:column; overflow:hidden; border:1px solid var(--line); border-radius:9px;
    background:var(--panel); color:var(--fg); font:12px/1.35 system-ui,sans-serif; box-shadow:0 8px 25px #0000000b; }
  .ab-app * { box-sizing:border-box; }
  .ab-head,.ab-tools,.ab-foot { display:flex; align-items:center; gap:10px; flex:none; padding:0 12px; }
  .ab-head { height:46px; border-bottom:1px solid var(--line); }
  .ab-logo { display:grid; place-items:center; width:25px; height:25px; border-radius:6px; background:var(--accent); color:white; font-weight:800; font-size:16px; }
  .ab-project { font-weight:650; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; flex:1; min-width:0; }
  .ab-tag { color:var(--muted); border:1px solid var(--line); border-radius:4px; padding:2px 6px; font-size:10px; white-space:nowrap; }
  .ab-app button { font:inherit; cursor:pointer; }
  .ab-btn { flex:none; background:var(--panel); border:1px solid var(--line); border-radius:5px; padding:6px 10px; color:var(--fg); }
  .ab-btn:hover { border-color:var(--accent); }
  .ab-primary { background:var(--accent); border-color:var(--accent); color:white; font-weight:650; }
  .ab-tools { height:35px; border-bottom:1px solid var(--line); color:var(--muted); background:var(--bg); }
  .ab-tools b { font-weight:600; color:var(--fg); }
  .ab-grow { flex:1; min-width:0; }
  .ab-work { display:flex; flex:1; min-height:0; min-width:0; }
  .ab-side { width:150px; flex:none; display:flex; flex-direction:column; border-right:1px solid var(--line); min-height:0; }
  .ab-caption { padding:10px 10px 7px; color:var(--muted); font-size:10px; text-transform:uppercase; letter-spacing:.09em; font-weight:650; flex:none; }
  .ab-pane { overflow:auto; overscroll-behavior:contain; scrollbar-width:thin; min-height:0; min-width:0; touch-action:pan-y; }
  .ab-library { padding:0 8px 10px; flex:1; }
  .ab-search { margin:0 8px 8px; padding:7px; border:1px solid var(--line); border-radius:4px; color:var(--muted); font-size:11px; }
  .ab-palette { height:39px; margin-bottom:6px; padding:7px; display:flex; align-items:center; gap:8px; border:1px solid var(--line); border-radius:5px; cursor:grab; background:var(--panel); }
  .ab-palette:hover { border-color:var(--accent); background:color-mix(in srgb,var(--accent) 7%,var(--panel)); }
  .ab-symbol { width:23px; height:23px; flex:none; display:grid; place-items:center; background:var(--bg); border-radius:4px; font-size:15px; }
  .ab-palette span:last-child { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .ab-main { flex:1; min-width:0; min-height:0; display:flex; flex-direction:column; background:var(--bg); }
  .ab-canvas { flex:1; padding:12px; }
  .ab-page { height:100%; min-height:190px; display:grid; gap:8px; }
  .ab-slot { min-width:0; min-height:66px; position:relative; border:1px dashed var(--line); background:var(--panel); border-radius:3px; cursor:grab; padding:18px 12px 9px; overflow:hidden; }
  .ab-slot.empty { display:flex; align-items:center; justify-content:center; color:var(--muted); background:color-mix(in srgb,var(--panel) 55%,transparent); }
  .ab-slot.filled { border-style:solid; box-shadow:0 1px 3px #00000008; }
  .ab-slot:hover { border-color:var(--accent); }
  .ab-position { position:absolute; top:3px; left:8px; color:var(--muted); font-size:9px; }
  .ab-blocktitle { font-size:10px; color:var(--accent); font-weight:650; }
  .ab-copy { font-size:12px; margin-top:4px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; overflow-wrap:anywhere; }
  .ab-slot[data-type="Heading"] .ab-copy { font-size:17px; font-weight:700; }
  .ab-slot[data-type="Button"] .ab-copy { display:inline-block; background:var(--accent); color:white; padding:4px 10px; border-radius:4px; font-size:11px; }
  .ab-slot[data-type="Image"] { background:linear-gradient(145deg,color-mix(in srgb,var(--accent) 12%,var(--panel)),var(--panel)); }
  .ab-slot[data-type="Image"] .ab-copy { font-size:10px; color:var(--muted); }
  .ab-visual { display:none; }
  .ab-slot[data-type="Divider"] .ab-visual { display:block; height:1px; margin:14px 0; background:var(--line); }
  .ab-slot[data-type="Spacer"] .ab-visual { display:block; height:25px; margin:8px 0; border-block:1px dashed var(--line); text-align:center; color:var(--muted); font-size:10px; }
  .ab-slot[data-type="Image"] .ab-visual { display:block; height:36px; position:relative; overflow:hidden; margin:5px 0; border-radius:3px;
    background:linear-gradient(145deg,color-mix(in srgb,var(--accent) 28%,var(--panel)),color-mix(in srgb,var(--accent) 6%,var(--panel))); }
  .ab-slot[data-type="Image"] .ab-visual::before { content:''; position:absolute; left:15%; bottom:-13px; width:90px; height:50px; transform:rotate(35deg); background:color-mix(in srgb,var(--accent) 45%,var(--panel)); }
  .ab-slot[data-type="Image"] .ab-visual::after { content:''; position:absolute; right:22%; top:5px; width:14px; height:14px; border-radius:50%; background:var(--panel); }
  .ab-slot[data-type="Quote"] .ab-copy { border-left:3px solid var(--accent); padding-left:10px; font-style:italic; }
  .ab-slot[data-type="Columns"] .ab-copy { column-count:2; column-gap:12px; display:block; font-size:10px; max-height:44px; }
  .ab-empty { white-space:pre-line; text-align:center; color:var(--muted); font-size:11px; padding:18px 4px; }
  .ab-remove { position:absolute; right:3px; top:1px; border:0; background:none; color:var(--muted); padding:0 4px; font-size:16px!important; }
  .ab-inspector { width:218px; padding:0 12px 12px; border-left:1px solid var(--line); background:var(--panel); flex:none; }
  .ab-inspector .ab-caption { padding-left:0; }
  .ab-field { display:block; margin:0 0 12px; min-width:0; }
  .ab-fieldlabel { display:block; font-size:11px; font-weight:600; margin-bottom:5px; }
  .ab-input { width:100%; height:33px; padding:6px 8px; background:var(--panel); color:var(--fg); border:1px solid var(--line); border-radius:4px; font:12px/1.35 system-ui,sans-serif; user-select:text; }
  textarea.ab-input { height:61px; resize:none; display:block; }
  .ab-input:focus { outline:2px solid color-mix(in srgb,var(--accent) 35%,transparent); border-color:var(--accent); }
  .ab-counter { display:block; text-align:right; font-size:10px; color:var(--muted); padding-top:3px; font-variant-numeric:tabular-nums; }
  .ab-counter.full { color:var(--accent); }
  .ab-hint { white-space:pre-line; color:var(--muted); font-size:10px; padding:6px 0; line-height:1.5; }
  .ab-foot { min-height:30px; border-top:1px solid var(--line); color:var(--muted); font-size:10px; white-space:nowrap; }
  .ab-owner { overflow:hidden; text-overflow:ellipsis; }
  .ab-status { color:var(--accent); font-weight:600; }
  .ab-form { padding:16px; flex:1; }
  .ab-preview { margin:14px; padding:15px; border:1px solid var(--line); background:var(--panel); border-radius:6px; }
  .ab-preview-title { color:var(--accent); font-size:18px; margin:8px 0 5px; overflow-wrap:anywhere; }
  .ab-preview-url { color:var(--muted); font-size:10px; }
  .ab-preview-desc { font-size:12px; overflow-wrap:anywhere; }
  .ab-post { border:1px solid var(--line); border-left:3px solid var(--accent); padding:7px; margin-bottom:7px; background:var(--panel); border-radius:5px; cursor:grab; min-width:0; }
  .ab-post b { font-size:10px; display:block; color:var(--accent); }
  .ab-post p { margin:4px 0; font-size:10px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; overflow-wrap:anywhere; }
  .ab-post small { color:var(--muted); font-size:9px; }
  .ab-calendar { flex:1; min-height:0; min-width:0; display:grid; grid-template-columns:38px repeat(5,minmax(0,1fr)); grid-template-rows:27px repeat(3,minmax(0,1fr)); background:var(--panel); }
  .ab-day,.ab-hour { display:flex; align-items:center; justify-content:center; color:var(--muted); font-size:10px; background:var(--bg); border-bottom:1px solid var(--line); }
  .ab-hour { font-size:9px; align-items:flex-start; padding-top:8px; }
  .ab-cell { border-left:1px solid var(--line); border-bottom:1px solid var(--line); min-height:0; padding:4px; overflow:auto; }
  .ab-cell .ab-post { padding:4px; margin-bottom:3px; }
  .ab-cell .ab-post p { -webkit-line-clamp:2; }
  .ab-cell .ab-post small { display:none; }
  .ab-selected { outline:2px solid var(--accent); outline-offset:-2px; }
  .ab-blocklist { padding:16px; }
  .ab-editblock { display:block; width:100%; text-align:left; padding:13px 15px; border:1px solid var(--line); background:var(--panel); color:var(--fg); margin-bottom:10px; border-radius:5px; }
  .ab-editblock strong { display:block; font-size:10px; color:var(--accent); margin-bottom:6px; }
  .ab-editblock p { margin:5px 0; overflow-wrap:anywhere; font-size:14px; }
  .ab-editblock small { color:var(--muted); font-size:10px; }
  .ab-segment { display:flex; }
  .ab-segment button { flex:1; background:var(--panel); color:var(--fg); border:1px solid var(--line); padding:6px 2px; font-size:10px; }
  .ab-segment button.on { background:color-mix(in srgb,var(--accent) 15%,var(--panel)); border-color:var(--accent); color:var(--accent); }
  .ab-over { outline:2px solid var(--accent); outline-offset:-2px; background:color-mix(in srgb,var(--accent) 10%,var(--panel)); }
  .ab-ghost { position:fixed; z-index:70; pointer-events:none; padding:9px 14px; background:var(--panel); border:1px solid var(--accent); border-radius:5px; box-shadow:0 6px 20px #0003; font-size:12px; color:var(--fg); }

  .ab-app { border-radius:6px; font-size:11px; box-shadow:0 3px 14px #00000012; }
  .ab-app svg { width:16px; height:16px; flex:none; vertical-align:middle; }
  .ab-head { height:44px; gap:8px; }
  .ab-logo { width:26px; height:26px; border-radius:5px; }
  .ab-project { display:flex; flex-direction:column; line-height:1.35; }
  .ab-project small { color:var(--muted); font-size:9px; font-weight:400; }
  .ab-iconbtn { width:28px; height:28px; display:grid; place-items:center; border:1px solid transparent; border-radius:4px; background:transparent; color:var(--muted); padding:0; flex:none; }
  .ab-iconbtn:hover { border-color:var(--line); background:var(--bg); color:var(--fg); }
  .ab-head .ab-btn { padding:6px 9px; font-size:11px; }
  .ab-avatar { width:23px; height:23px; display:grid; place-items:center; border-radius:50%; background:color-mix(in srgb,var(--accent) 14%,var(--panel)); border:2px solid var(--panel); color:var(--fg); font-size:8px; font-weight:700; flex:none; }
  .ab-collaborators { display:flex; margin:0 3px; }
  .ab-collaborators .ab-avatar + .ab-avatar { margin-left:-6px; }
  .ab-tools { height:32px; gap:7px; font-size:10px; background:var(--panel); }
  .ab-divider { width:1px; height:16px; background:var(--line); flex:none; }
  .ab-nav { width:43px; flex:none; border-right:1px solid var(--line); background:var(--bg); display:flex; flex-direction:column; padding:9px 4px; gap:5px; overflow:auto; scrollbar-width:thin; }
  .ab-nav.expanded { width:145px; padding:9px 7px; }
  .ab-navitem { min-height:31px; width:100%; border:0; border-radius:4px; background:transparent; color:var(--muted); display:flex; align-items:center; gap:8px; padding:7px; text-align:left; font-size:10px!important; position:relative; }
  .ab-navitem.active { color:var(--accent); background:color-mix(in srgb,var(--accent) 10%,var(--panel)); font-weight:650; }
  .ab-navitem:hover { background:var(--panel); color:var(--fg); }
  .ab-navitem em { margin-left:auto; padding:0 4px; font-size:8px; font-style:normal; border-radius:4px; background:var(--line); }
  .ab-nav:not(.expanded) .ab-navitem span,.ab-nav:not(.expanded) .ab-navitem em,.ab-nav:not(.expanded) .ab-navcap { display:none; }
  .ab-navcap { text-transform:uppercase; color:var(--muted); font-size:8px; letter-spacing:.08em; margin:10px 6px 2px; }
  .ab-navbottom { margin-top:auto; }
  .ab-tabs { display:flex; align-items:center; gap:14px; min-height:31px; border-bottom:1px solid var(--line); padding:0 10px; flex:none; }
  .ab-tabs span { color:var(--muted); font-size:10px; padding:8px 0; }
  .ab-tabs .active { color:var(--fg); font-weight:650; border-bottom:2px solid var(--accent); }
  .ab-caption { padding:10px 10px 6px; font-size:9px; letter-spacing:.06em; }
  .ab-side { width:166px; }
  .ab-palette { height:37px; margin-bottom:5px; padding:6px; font-size:10px; }
  .ab-palette small { font-size:8px; color:var(--muted); margin-left:auto; }
  .ab-search { display:flex; align-items:center; gap:6px; margin:8px; padding:6px; font-size:10px; }
  .ab-symbol { width:24px; height:24px; }
  .ab-tree { border-top:1px solid var(--line); margin-top:10px; padding-top:6px; }
  .ab-tree-row { min-height:25px; display:flex; align-items:center; gap:6px; color:var(--muted); font-size:10px; padding:4px 2px; white-space:nowrap; overflow:hidden; }
  .ab-tree-row svg { width:12px; height:12px; }
  .ab-tree-row.indent { padding-left:14px; }
  .ab-tree-row .ab-tag { margin-left:auto; font-size:8px; }
  .ab-canvas { padding:15px 18px; background:color-mix(in srgb,var(--fg) 3%,var(--bg)); }
  .ab-document { min-height:100%; max-width:780px; margin:auto; background:var(--panel); box-shadow:0 2px 7px #00000012; border:1px solid var(--line); }
  .ab-dochead { min-height:42px; padding:10px 14px; display:flex; align-items:center; gap:8px; font-size:10px; border-bottom:1px solid var(--line); }
  .ab-dochead strong { font-size:11px; margin-right:auto; }
  .ab-dochead span { color:var(--muted); font-size:8px; }
  .ab-docfoot { padding:15px; color:var(--muted); border-top:1px solid var(--line); text-align:center; font-size:9px; line-height:1.7; }
  .ab-page { min-height:210px; height:auto; padding:12px; gap:5px; }
  .ab-slot { min-height:84px; border-color:color-mix(in srgb,var(--accent) 24%,var(--line)); border-radius:1px; padding:20px 11px 10px; }
  .ab-slot.filled { box-shadow:none; }
  .ab-slot.empty { min-height:95px; border-style:dashed; }
  .ab-page.email { max-width:620px; margin:auto; }
  .ab-page.email .ab-slot { min-height:88px; }
  .ab-position { font-size:8px; opacity:.8; }
  .ab-blocktitle { font-size:9px; }
  .ab-copy { font-size:11px; -webkit-line-clamp:3; }
  .ab-slot[data-type="Heading"] .ab-copy { font-size:19px; line-height:1.25; }
  .ab-slot[data-type="Image"] .ab-visual { height:60px; }
  .ab-slot[data-type="Image"] .ab-copy { -webkit-line-clamp:1; }
  .ab-remove { width:20px; height:19px; padding:3px; display:grid; place-items:center; }
  .ab-remove svg { width:11px; height:11px; }
  .ab-inspector { width:218px; padding:0 11px 12px; }
  .ab-field { margin-bottom:11px; }
  .ab-input { height:31px; font-size:11px; }
  textarea.ab-input { height:61px; }
  .ab-fieldlabel { font-size:10px; }
  .ab-counter { font-size:9px; }
  .ab-setting { border-top:1px solid var(--line); padding:9px 0; }
  .ab-kv { display:flex; justify-content:space-between; align-items:center; gap:8px; font-size:10px; margin:6px 0; color:var(--muted); }
  .ab-kv strong { color:var(--fg); font-size:10px; font-weight:500; text-align:right; }
  .ab-checkline { display:flex; align-items:center; gap:6px; font-size:10px; padding:5px 0; color:var(--muted); }
  .ab-checkline svg { width:12px; height:12px; color:var(--accent); }
  .ab-notice { background:color-mix(in srgb,var(--accent) 7%,var(--panel)); border:1px solid color-mix(in srgb,var(--accent) 30%,var(--line)); padding:8px; color:var(--fg); border-radius:4px; font-size:10px; line-height:1.5; margin:9px 0; }
  .ab-notice.warn { color:var(--fg); background:color-mix(in srgb,#b68a32 9%,var(--panel)); border-color:color-mix(in srgb,#b68a32 32%,var(--line)); }
  .ab-popover { position:absolute; z-index:80; top:41px; right:12px; width:260px; max-height:70%; overflow:auto; padding:12px; background:var(--panel); border:1px solid var(--line); border-radius:6px; box-shadow:0 8px 26px #0003; }
  .ab-popover h3 { font-size:12px; margin:0 0 9px; }
  .ab-popover button { display:block; width:100%; text-align:left; background:none; border:0; border-top:1px solid var(--line); color:var(--fg); padding:9px 2px; font-size:10px; }
  .ab-popover small { display:block; color:var(--muted); margin-top:4px; }
  .ab-previewmode .ab-position,.ab-previewmode .ab-remove,.ab-previewmode .ab-blocktitle { visibility:hidden; }
  .ab-previewmode .ab-slot { border-color:transparent; }
  .ab-previewmode .ab-slot.empty { background:var(--panel); }
  .ab-breadcrumb { color:var(--muted); font-size:9px; padding:9px 14px; border-bottom:1px solid var(--line); background:var(--panel); }
  .ab-seotabs { display:flex; gap:17px; padding:0 15px; border-bottom:1px solid var(--line); }
  .ab-seotabs span { padding:9px 0; font-size:10px; color:var(--muted); }
  .ab-seotabs .active { color:var(--accent); border-bottom:2px solid var(--accent); }
  .ab-form { padding:12px 16px; }
  .ab-form h2 { font-size:15px; margin:0 0 4px; font-weight:650; }
  .ab-preview { margin:12px; padding:14px; }
  .ab-preview-title { font-size:17px; }
  .ab-checkmeter { height:3px; background:var(--line); border-radius:3px; overflow:hidden; margin-top:5px; }
  .ab-checkmeter i { display:block; height:100%; width:0; background:var(--accent); }
  .ab-socialbar { min-height:36px; display:flex; align-items:center; gap:7px; padding:4px 10px; border-bottom:1px solid var(--line); background:var(--panel); flex:none; }
  .ab-socialbar .ab-btn { font-size:9px; padding:4px 6px; }
  .ab-channel { display:flex; align-items:center; gap:6px; padding:8px 2px; font-size:10px; border-bottom:1px solid var(--line); }
  .ab-channel .ab-avatar { border-width:1px; width:21px; height:21px; }
  .ab-channel small { color:var(--muted); display:block; font-size:8px; }
  .ab-post { font-size:10px; box-shadow:0 1px 2px #00000009; }
  .ab-post .ab-posthead { display:flex; align-items:center; gap:5px; }
  .ab-post .ab-posthead svg { width:11px; height:11px; color:var(--muted); }
  .ab-post .ab-posthead b { flex:1; }
  .ab-post .ab-postmeta { font-size:8px; color:var(--muted); margin-top:4px; display:flex; align-items:center; gap:4px; }
  .ab-post .ab-postmeta svg { width:9px; height:9px; }
  .ab-history { border:1px solid var(--line); border-left:2px solid var(--muted); padding:5px; margin:0 0 4px; border-radius:3px; font-size:8px; color:var(--muted); background:var(--bg); line-height:1.4; pointer-events:none; }
  .ab-history strong { display:block; font-size:8px; font-weight:500; color:var(--fg); }
  .ab-history .ab-historytext { display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:1; overflow:hidden; }
  .ab-calendar { grid-template-rows:27px repeat(3,minmax(85px,1fr)); min-height:282px; }
  .ab-calendarwrap { flex:1; min-height:0; overflow:auto; }
  .ab-calendarwrap .ab-calendar { height:100%; }
  .ab-layerbar { padding:7px 10px; border-bottom:1px solid var(--line); font-size:10px; color:var(--muted); display:flex; align-items:center; gap:7px; }
  .ab-blocklist { padding:12px 18px; }
  .ab-blocklist .ab-editblock { max-width:700px; margin:0 auto 8px; border-radius:1px; box-shadow:0 1px 3px #0000000a; }
  .ab-spacingbox { border:1px dashed var(--muted); padding:8px; text-align:center; font-size:9px; color:var(--muted); background:var(--bg); }
  .ab-spacingbox div { border:1px solid var(--line); padding:8px; background:var(--panel); margin-top:5px; }
  .ab-foot { font-size:9px; min-height:27px; gap:8px; }
  .ab-foot svg { width:11px; height:11px; }
  .ab-status { font-weight:500; }
  .ab-compact .ab-collaborators,.ab-compact .ab-version,.ab-compact .ab-zoomlabel { display:none; }
  `;
  let st;
  const keyOf = (t) => JSON.stringify(t);
  const center = (el) => { const r = el.getBoundingClientRect(); return [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)]; };
  const inside = (r, p) => p.x >= r.left && p.x <= r.right && p.y >= r.top && p.y <= r.bottom;
  env.widget({
    task: 'use-site-builder', site: 'base', name: 'classic', split: 'train', scenarios: ['page', 'email', 'seo', 'social', 'blockedit'],
    render(ctx) {
      ctx.css('app-builder-classic', CSS);
      const { spec: s, util: u, size } = ctx;
      const f = env.taskDef.helpers;
      const cr = ctx.rng.fork('studio/context'), C = ctx.content;
      const company = s.project.split(' / ')[0];
      const colleague = C.personName(cr, { csplit: s.csplit }).full;
      const otherProjects = C.sample(cr, C.HEADLINES, 5, { csplit: s.csplit });
      const icons = {
        grid:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
        pages:'M6 3h9l4 4v14H6zM15 3v5h4M9 12h7M9 16h7',
        layers:'m3 7 9-4 9 4-9 4zM3 12l9 4 9-4M3 17l9 4 9-4',
        image:'M3 4h18v16H3zM3 16l5-6 5 5 3-3 5 5M16 8h.01',
        text:'M4 5h16M12 5v15M8 20h8', heading:'M5 4v16M19 4v16M5 12h14',
        button:'M3 7h18v10H3zM8 12h8', divider:'M3 12h18', quote:'M4 6h6v6H5v6H3v-7zM15 6h6v6h-5v6h-2v-7z',
        columns:'M3 4h8v16H3zM15 4h6v16h-6z', spacer:'M4 4h16M4 20h16M12 7v10m-3-7 3-3 3 3m-6 4 3 3 3-3',
        search:'m20 20-5-5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',
        chevron:'m9 5 7 7-7 7', down:'m6 9 6 6 6-6', plus:'M12 4v16M4 12h16', close:'m6 6 12 12M6 18 18 6',
        bell:'M6 8a6 6 0 0 1 12 0v7l3 3H3l3-3zM9 21h6',
        settings:'M3 7h18M3 17h18M8 4v6M16 14v6', calendar:'M3 5h18v16H3zM7 2v6M17 2v6M3 10h18M7 14h3M14 14h3',
        mail:'M3 5h18v14H3zM3 5l9 8 9-8', people:'M4 21v-4a5 5 0 0 1 10 0v4M18 13a4 4 0 0 1 3 4v4M13 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0M17 3a4 4 0 0 1 0 8',
        chart:'M4 3v18h17M8 16v-5M13 16V7M18 16V4', folder:'M3 5h7l2 3h9v12H3z',
        eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
        desktop:'M3 4h18v13H3zM8 21h8M12 17v4', phone:'M7 2h10v20H7zM11 18h2',
        undo:'M9 5 3 11l6 6M3 11h12a6 6 0 0 1 6 6', redo:'m15 5 6 6-6 6M21 11H9a6 6 0 0 0-6 6',
        alert:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M12 7v6M12 17h.01',
        check:'m4 12 5 5L20 6', clock:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M12 6v6l4 2',
        globe:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M3 12h18M12 3a18 18 0 0 1 0 18 18 18 0 0 1 0-18',
        link:'m9 15 6-6M9 7l2-2a5 5 0 0 1 7 7l-2 2M15 17l-2 2a5 5 0 0 1-7-7l2-2',
        help:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0M9 9a3 3 0 1 1 4 3l-1 1v1M12 17h.01',
        grip:'M9 5h.01M15 5h.01M9 12h.01M15 12h.01M9 19h.01M15 19h.01',
      };
      const icon = (parent, name) => {
        const svg = u.svg('svg', { viewBox:'0 0 24 24', fill:'none', stroke:'currentColor', 'stroke-width':1.7, 'stroke-linecap':'round', 'stroke-linejoin':'round', 'aria-hidden':'true' }, parent);
        u.svg('path', { d:icons[name] || icons.grid }, svg); return svg;
      };
      const iconButton = (parent, name, label, action) => {
        const b = u.el('button', 'ab-iconbtn', parent); b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
        icon(b, name); if (action) b.addEventListener('click', action); return b;
      };
      const kv = (parent, label, value) => { const row = u.el('div', 'ab-kv', parent); u.el('span','',row,label); return u.el('strong','',row,value); };
      const checkline = (parent, text) => { const row = u.el('div', 'ab-checkline', parent); icon(row,'check'); u.el('span','',row,text); return row; };
      let popover;
      const showPanel = (title, rows) => {
        if (popover) { const same = popover.dataset.title === title; popover.remove(); popover = null; if (same) return; }
        popover = u.el('div', 'ab-popover', app); popover.dataset.title = title;
        u.el('h3','',popover,title);
        for (const row of rows) { const b = u.el('button','',popover,row[0]); b.type = 'button'; u.el('small','',b,row[1]); b.addEventListener('click',()=>{ popover.remove(); popover=null; }); }
      };
      const state = st = { ctx, refs: new Map(), panes: {}, records: [], fields: [], props: [], slots: [], posts: {}, blocks: {}, align: {}, ghost: null };
      const app = u.el('section', `ab-app${size.width < 800 ? ' ab-compact' : ''}`, ctx.stage);
      Object.assign(app.style, { left: '8px', top: '8px', width: `${Math.max(1, size.width - 16)}px`, height: `${Math.max(1, size.height - 16)}px` });
      const ref = (t, el, pane) => {
        state.refs.set(keyOf(t), el);
        if (pane) state.records.push({ key: keyOf(t), el, pane });
        return el;
      };
      const pane = (id, parent, cls) => {
        const el = u.el('div', `ab-pane ${cls || ''}`, parent);
        state.panes[id] = el;
        // The primitive owns wheel behavior; a scroll event also covers keyboard scroll.
        env.ui.scrollPane(el, { onScroll: () => mirror(), label: `builder-${id}` });
        el.addEventListener('scroll', () => mirror());
        return el;
      };
      function mirror() {
        const hidden = {};
        const paneIds = new Map(Object.entries(state.panes).map(([id, el]) => [el, id]));
        for (const r of state.records) {
          if (!r.el.isConnected) continue;
          const er = r.el.getBoundingClientRect();
          if (!er.width || !er.height) continue;
          const cy = er.top + er.height / 2;
          // Reveal the outer pane first when a card lives inside a scrolling calendar cell.
          for (let parent = r.el.parentElement; parent && parent !== app; parent = parent.parentElement) {
            const paneId = paneIds.get(parent);
            if (!paneId || parent.scrollHeight <= parent.clientHeight + 1) continue;
            const pr = parent.getBoundingClientRect();
            if (cy < pr.top + 5 || cy > pr.bottom - 5) hidden[r.key] = { pane: paneId, dy: cy - (pr.top + pr.bottom) / 2 };
          }
        }
        const view = { hidden };
        if (JSON.stringify(ctx.model.view) !== JSON.stringify(view)) ctx.patch({ view });
      }
      const apply = (n) => { ctx.update(n); paint(ctx.model); };
      const edit = (fn) => { const n = env.util.clone(ctx.model); n.committed = false; fn(n); apply(n); };
      const head = u.el('header', 'ab-head', app);
      icon(u.el('div', 'ab-logo', head), 'layers');
      const project = u.el('div', 'ab-project', head); u.el('span','',project,s.project); u.el('small','',project,'Studio workspace / Marketing');
      iconButton(head,'down','Switch project',()=>showPanel('Recent projects',otherProjects.map((p,i)=>[p,i ? 'Draft / Marketing team' : 'Recently edited / Design team'])));
      u.el('span', 'ab-tag ab-version', head, `Revision ${s.revision}`);
      const collaborators = u.el('div','ab-collaborators',head);
      for (const name of [s.owner,colleague]) { const a=u.el('div','ab-avatar',collaborators,name.split(' ').map((v)=>v[0]).slice(0,2).join('')); a.title=name; }
      iconButton(head,'bell','Notifications, 3 unread',()=>showPanel('Activity / 3 unread',[[`${colleague} left a comment`,'Please review the mobile layout. / 12 min ago'],['Brand assets updated','Two new images in the shared library. / 1 hour ago'],['Weekly performance report','Your latest report is ready to view. / 2 hours ago']]));
      const previewButton = iconButton(head,'eye','Preview',()=>{ app.classList.toggle('ab-previewmode'); previewButton.setAttribute('aria-pressed',String(app.classList.contains('ab-previewmode'))); });
      const publish = ref({ publish: true }, u.el('button', 'ab-btn ab-primary', head, s.actionLabel));
      publish.type = 'button';
      publish.addEventListener('click', () => {
        if (s.judge && s.judge.mode === 'confirm') ctx.flag('irreversible');
        apply({ ...ctx.model, committed: true });
      });
      const tools = u.el('div', 'ab-tools', app);
      const titles = { page: 'Page designer', email: 'Campaign builder', seo: 'Search settings', social: 'October 2027 · Week 42', blockedit: 'Page designer' };
      u.el('b', '', tools, titles[s.scenario]);
      u.el('span', 'ab-grow', tools, s.scenario === 'social' ? 'UTC · Week view' : s.scenario === 'seo' ? 'Settings / SEO' : 'Content  /  Design');
      iconButton(tools,'undo','Version history',()=>showPanel('Version history',[[`Revision ${s.revision}`,'Current draft / All changes saved'],[`Revision ${s.revision-1}`,'Previous published version / Yesterday']]));
      u.el('span','ab-divider',tools);
      iconButton(tools,'desktop','Desktop preview',()=>app.classList.remove('ab-previewmode'));
      iconButton(tools,'phone','Mobile preview information',()=>showPanel('Responsive layout',[['Mobile layout','Sections stack vertically on narrow screens.'],['Tablet layout','Uses the same content and delivery settings.']]));
      u.el('span', 'ab-zoomlabel', tools, s.scenario === 'email' ? `${s.audience.toLocaleString('en-US')} subscribers` : '100%');
      const work = u.el('div', 'ab-work', app);
      const nav = u.el('nav', `ab-nav${size.width > 1150 ? ' expanded' : ''}`, work); nav.setAttribute('aria-label','Workspace');
      u.el('div','ab-navcap',nav,'Workspace');
      const currentNav = {page:'Website',email:'Campaigns',seo:'Website',social:'Publishing',blockedit:'Website'}[s.scenario];
      const navigation = [['grid','Overview',''],['pages','Website','8'],['mail','Campaigns','12'],['calendar','Publishing','7'],['people','Audience',''],['folder','Assets','24'],['chart','Reports','']];
      navigation.forEach(([glyph,label,count])=>{
        const b=u.el('button',`ab-navitem${label===currentNav?' active':''}`,nav); b.type='button'; b.title=label; icon(b,glyph); u.el('span','',b,label); if(count)u.el('em','',b,count);
        b.addEventListener('click',()=>showPanel(label,label==='Website'? [['Home','Published / Primary page'],['About us','Published'],['Journal','6 articles'],['Contact','Draft']]:otherProjects.slice(0,4).map((p,i)=>[p,i%2?'Published':'Draft / Marketing team'])));
      });
      u.el('div','ab-navcap',nav,'Team projects');
      for(const label of ['Autumn launch','Brand refresh']) { const b=u.el('button','ab-navitem',nav); b.type='button';b.title=label;icon(b,'folder');u.el('span','',b,label);b.addEventListener('click',()=>showPanel(label,[['Project overview','3 collaborators / Updated yesterday'],['Shared assets','Marketing workspace']])); }
      const bottom=u.el('div','ab-navbottom',nav);
      iconButton(bottom,'settings','Workspace settings',()=>showPanel('Workspace settings',[['Marketing workspace','Team plan / 5 members'],['Brand settings','Colors, fonts and shared assets']]));
      iconButton(bottom,'help','Help center',()=>showPanel('Help center',[['Design and publish','Guides for managing your draft.'],['Keyboard shortcuts','Standard text editing is supported.']]));
      const foot = u.el('footer', 'ab-foot', app);
      const status = u.el('span', 'ab-status', foot);
      const metric = u.el('span', '', foot);
      u.el('span', 'ab-grow ab-owner', foot, `Owner: ${s.owner}`);
      icon(foot, 'check');
      state.saved = u.el('span', '', foot, 'All changes saved');
      function field(parent, def, prop, paneId) {
        const wrap = u.el('label', 'ab-field', parent);
        u.el('span', 'ab-fieldlabel', wrap, def.label);
        const input = u.el(def.id === 'description' || def.id === 'preheader' || def.id === 'title' && prop ? 'textarea' : 'input', 'ab-input', wrap);
        if (input.tagName === 'INPUT') input.type = 'text';
        input.setAttribute('aria-label', def.label);
        input.maxLength = def.limit;
        input.spellcheck = false;
        const out = u.el('output', 'ab-counter', wrap);
        const t = prop ? { prop: def.id } : { field: def.id };
        ref(t, input, paneId);
        const meter = u.el('div','ab-checkmeter',wrap); const fill=u.el('i','',meter);
        const entry = { input, out, def, fill };
        (prop ? state.props : state.fields).push(entry);
        input.addEventListener('input', () => edit((m) => {
          const value = input.value.slice(0, def.limit);
          if (prop) m.props[m.selected][def.id] = def.id === 'padding' ? Math.max(0, Math.min(64, Number(value) || 0)) : value;
          else m.fields[def.id] = value;
        }));
        return input;
      }
      const drops = [];
      function drag(el, itemOf, kind) {
        let id = null;
        env.ui.track(el, {
          start(p, e) {
            if (e.target.closest('button')) return false;
            id = itemOf();
            if (!id) return false;
            state.ghost = u.el('div', 'ab-ghost', app, s.items.find((it) => it.id === id).label);
            state.ghost.style.left = `${p.x + 10}px`; state.ghost.style.top = `${p.y + 8}px`;
          },
          move(p) {
            if (state.ghost) { state.ghost.style.left = `${p.x + 10}px`; state.ghost.style.top = `${p.y + 8}px`; }
            drops.forEach((d) => d.el.classList.toggle('ab-over', inside(d.el.getBoundingClientRect(), p)));
          },
          end(p) {
            if (state.ghost) state.ghost.remove(); state.ghost = null;
            drops.forEach((d) => d.el.classList.remove('ab-over'));
            const target = drops.find((d) => inside(d.el.getBoundingClientRect(), p));
            if (!target || !id) return;
            edit((m) => {
              if (kind === 'post') m.schedule[id] = target.index;
              else {
                const old = m.slots.indexOf(id), displaced = m.slots[target.index];
                m.slots[target.index] = id;
                if (old >= 0 && old !== target.index) m.slots[old] = displaced;
              }
            });
          },
        }, `builder-${kind}`);
      }
      if (s.scenario === 'page' || s.scenario === 'email') {
        const side = u.el('aside', 'ab-side', work);
        side.style.width = size.width < 750 ? '124px' : '150px';
        u.el('div', 'ab-caption', side, 'Content blocks');
        const tabs=u.el('div','ab-tabs',side); u.el('span','active',tabs,'Blocks');u.el('span','',tabs,'Saved');
        const search=u.el('div','ab-search',side);icon(search,'search');u.el('span','',search,'Find a block');
        const library = pane('library', side, 'ab-library');
        const symbols = { Heading:'heading', Image:'image', Text:'text', Button:'button', Divider:'divider', Quote:'quote', Columns:'columns', Spacer:'spacer' };
        for (const it of s.items) {
          const block = ref({ palette: it.id }, u.el('div', 'ab-palette', library), 'library');
          block.setAttribute('aria-label', `Drag ${it.label}`);
          icon(u.el('span','ab-symbol',block), symbols[it.type]); u.el('span','',block,it.label);
          drag(block, () => it.id, 'block');
        }
        const savedBlocks=u.el('div','ab-tree',library);
        u.el('div','ab-caption',savedBlocks,'Saved sections');
        for(const name of ['Brand header','Product feature','Newsletter footer','Social links']) { const r=u.el('div','ab-tree-row',savedBlocks);icon(r,'layers');u.el('span','',r,name); }
        u.el('div','ab-caption',savedBlocks,'Pages');
        for(const [name,badge] of [['Home','Live'],['Our story','Live'],['Journal','6'],['Contact','Draft']]) { const r=u.el('div','ab-tree-row',savedBlocks);icon(r,'pages');u.el('span','',r,name);u.el('span','ab-tag',r,badge); }
        const main = u.el('div', 'ab-main', work);
        u.el('div','ab-breadcrumb',main,s.scenario==='email'?'Campaigns / Monthly dispatch / Design':'Pages / Studio page / Body');
        const canvas = pane('canvas', main, 'ab-canvas');
        const document = u.el('div','ab-document',canvas);
        const dochead=u.el('div','ab-dochead',document); u.el('strong','',dochead,company); u.el('span','',dochead,s.scenario==='email'?'View in browser':'About     Journal     Contact');
        const page = u.el('div', `ab-page${s.scenario==='email'?' email':''}`, document);
        const cols = s.scenario === 'page' ? 2 : 1;
        page.style.gridTemplateColumns = `repeat(${cols},minmax(0,1fr))`;
        page.style.gridTemplateRows = s.scenario === 'email' ? `repeat(${s.goalSlots.length},auto)` : `repeat(${Math.ceil(s.goalSlots.length / cols)},minmax(66px,1fr))`;
        for (let i = 0; i < s.goalSlots.length; i++) {
          const slot = ref({ slot: i }, u.el('div', 'ab-slot', page), 'canvas');
          const pos = s.scenario === 'page' ? `Row ${Math.floor(i / 2) + 1} · ${i % 2 ? 'Right' : 'Left'}` : `Section ${i + 1}`;
          u.el('span', 'ab-position', slot, pos);
          const title = u.el('div', 'ab-blocktitle', slot);
          const visual = u.el('div', 'ab-visual', slot);
          const copy = u.el('div', 'ab-copy', slot);
          const remove = u.el('button', 'ab-remove', slot); icon(remove,'close');
          remove.type = 'button'; remove.setAttribute('aria-label', `Remove ${pos}`);
          remove.addEventListener('pointerdown', (e) => e.stopPropagation());
          remove.addEventListener('click', () => edit((m) => { m.slots[i] = null; }));
          state.slots.push({ slot, title, copy, visual, remove });
          drops.push({ el: slot, index: i });
          drag(slot, () => ctx.model.slots[i], 'block');
        }
        const docfoot=u.el('div','ab-docfoot',document);
        u.el('div','',docfoot,company);
        u.el('div','',docfoot,s.scenario==='email'?'You are receiving this email because you subscribed.':'Stories, updates and useful ideas from our team.');
        u.el('div','',docfoot,s.scenario==='email'?'Manage preferences | Unsubscribe':'Privacy | Terms | Contact');
        if (s.scenario === 'page' && size.width >= 950) {
          const details=pane('details',work,'ab-inspector');
          u.el('div','ab-caption',details,'Page settings');kv(details,'Page','Studio page');kv(details,'Template','Two-column layout');
          u.el('div','ab-setting',details);u.el('div','ab-caption',details,'Typography');kv(details,'Heading','System / Semibold');kv(details,'Body','System / Regular');kv(details,'Base size','16 px');
          u.el('div','ab-caption',details,'Publishing');kv(details,'Domain','studio.example');kv(details,'Visibility','Public');
          u.el('div','ab-notice',details,'You are editing a draft. The live page updates when changes are published.');
        }
        if (s.scenario === 'email') {
          const inspector = pane('inspector', work, 'ab-inspector');
          inspector.style.width = size.width < 750 ? '190px' : '230px';
          u.el('div', 'ab-caption', inspector, 'Campaign settings');
          s.fields.forEach((def) => field(inspector, def, false, 'inspector'));
          u.el('div','ab-setting',inspector); kv(inspector,'From',s.owner);kv(inspector,'Reply to','hello@studio.example');kv(inspector,'Audience','Newsletter subscribers');kv(inspector,'Recipients',s.audience.toLocaleString('en-US'));
          u.el('div','ab-caption',inspector,'Delivery checklist');
          state.subjectCheck=checkline(inspector,'Subject line missing');checkline(inspector,'Unsubscribe link included');checkline(inspector,'Responsive template');
          u.el('div','ab-setting',inspector);u.el('div','ab-caption',inspector,'Tracking');kv(inspector,'Open tracking','On');kv(inspector,'Link tracking','On');kv(inspector,'Campaign tag','Monthly dispatch');
          u.el('div','ab-notice warn',inspector,'Send a test to your team before sending this campaign to subscribers.');
        }
      } else if (s.scenario === 'seo') {
        const settingsNav=u.el('aside','ab-side',work);settingsNav.style.width=size.width<800?'120px':'150px';
        u.el('div','ab-caption',settingsNav,'Page settings');
        const menu=pane('settingsMenu',settingsNav,'ab-library');
        for(const [glyph,label] of [['pages','General'],['search','SEO settings'],['image','Social sharing'],['globe','Localization'],['link','Redirects'],['settings','Custom code']]) {const r=u.el('div','ab-tree-row',menu);icon(r,glyph);u.el('span','',r,label);if(label==='SEO settings')r.style.color='var(--accent)';}
        u.el('div','ab-tree',menu);u.el('div','ab-caption',menu,'Other pages');for(const name of ['Home','Our story','Journal','Contact','Privacy policy']){const r=u.el('div','ab-tree-row',menu);icon(r,'pages');u.el('span','',r,name);}
        const form = pane('form', work, 'ab-form');
        form.style.flex = '1.1';
        u.el('h2','',form,'Search engine listing');u.el('div','ab-hint',form,'Control how this page appears in search results.');
        s.fields.forEach((def) => field(form, def, false, 'form'));
        u.el('div','ab-hint',form,'Search engines may display a different title or description.');
        u.el('div','ab-setting',form);u.el('div','ab-caption',form,'Indexing and canonical URL');kv(form,'Search indexing','Allowed');kv(form,'Follow page links','Enabled');kv(form,'Canonical URL','Automatic');kv(form,'Include in sitemap','Yes');
        u.el('div','ab-notice',form,'SEO changes are saved to this draft. Publish to update the public listing.');
        u.el('div','ab-setting',form);u.el('div','ab-caption',form,'Structured data');kv(form,'Schema type','WebPage');kv(form,'Language','English');
const main = pane('seoPreview',work,'ab-main'); main.style.flex = '1';
        u.el('div', 'ab-caption', main, 'Search result preview');
        const preview = u.el('div', 'ab-preview', main);
        u.el('div', 'ab-preview-url', preview, 'studio.example /');
        state.previewTitle = u.el('div', 'ab-preview-title', preview);
        state.previewDesc = u.el('div', 'ab-preview-desc', preview);
        state.previewSlug = u.el('div', 'ab-hint', preview);
        const health=u.el('div','ab-preview',main);u.el('div','ab-caption',health,'Listing checks');
        state.seoCheck=checkline(health,'Title not added');checkline(health,'Page is indexable');checkline(health,'Canonical URL configured');
        u.el('div','ab-notice warn',health,'Preview only. Search appearance can vary by device and query.');
      } else if (s.scenario === 'social') {
        const side = u.el('aside', 'ab-side', work);
        side.style.width = size.width < 750 ? '145px' : '185px';
        u.el('div','ab-caption',side,'Channels');
        const channels=u.el('div','ab-library',side);channels.style.flex='none';
        for(const [name,network] of [[company,'Social feed'],['Studio journal','Community']]) { const r=u.el('div','ab-channel',channels);u.el('span','ab-avatar',r,name.slice(0,2).toUpperCase());const text=u.el('div','',r,name);u.el('small','',text,network); }
        u.el('div', 'ab-caption', side, 'Unscheduled posts');
        const drafts = pane('drafts', side, 'ab-library'); ref({ drafts: true }, drafts);
        drops.push({ el: drafts, index: -1 });
        state.drafts = drafts;
        state.emptyDrafts = u.el('div', 'ab-empty', drafts, 'Your queue is organized.\nUnscheduled drafts will appear here.');
        const main = u.el('div', 'ab-main', work);
        const socialbar=u.el('div','ab-socialbar',main);iconButton(socialbar,'chevron','Previous period',()=>showPanel('Calendar periods',[['Previous week','Published archive / 11 posts']]));
        u.el('strong','ab-grow',socialbar,'18 - 22 October');
        const filter=u.el('button','ab-btn',socialbar,'All channels');filter.type='button';filter.addEventListener('click',()=>showPanel('Channels',[[company,'Connected / Social feed'],['Studio journal','Connected / Community']]));
        u.el('span','ab-tag',socialbar,'Week');
        const calendarwrap=pane('calendar',main,'ab-calendarwrap');
        const calendar = u.el('div', 'ab-calendar', calendarwrap);
        u.el('div', 'ab-day', calendar, 'UTC');
        s.days.forEach((d) => u.el('div', 'ab-day', calendar, d));
        state.cells = [];
        for (let row = 0; row < 3; row++) {
          u.el('div', 'ab-hour', calendar, s.times[row]);
          for (let day = 0; day < 5; day++) {
            const i = row * 5 + day, cell = ref({ cell: i }, pane(`calendar${i}`, calendar, 'ab-cell'), 'calendar');
            cell.setAttribute('aria-label', f.cellLabel(s, i));
            state.cells.push(cell); drops.push({ el: cell, index: i });
            if([0,4,7,11,14].includes(i)) { const history=u.el('div','ab-history',cell);u.el('strong','',history,'Published / Studio journal');u.el('div','ab-historytext',history,otherProjects[i%otherProjects.length]);u.el('span','',history,`${s.times[row]} / ${cr.int(21,180)} views`); }
          }
        }
        for (const it of s.items) {
          const post = ref({ post: it.id }, u.el('div', 'ab-post', drafts));
          const posthead=u.el('div','ab-posthead',post);icon(posthead,'globe');u.el('b','',posthead,it.label);icon(posthead,'grip');
          u.el('p','',post,it.copy);u.el('small','',post,s.owner);
          const meta=u.el('div','ab-postmeta',post);icon(meta,'clock');u.el('span','',meta,'Draft / Social feed');
          state.posts[it.id] = post;
          drag(post, () => it.id, 'post');
        }
      } else {
        const layers=u.el('aside','ab-side',work);layers.style.width=size.width<800?'118px':'155px';
        u.el('div','ab-caption',layers,'Navigator');const tree=pane('layers',layers,'ab-library');
        const root=u.el('div','ab-tree-row',tree);icon(root,'pages');u.el('span','',root,'Body');
        for(const it of s.items) {const row=u.el('button','ab-navitem',tree);row.type='button';icon(row,'layers');u.el('span','',row,it.label);row.addEventListener('click',()=>apply({...ctx.model,selected:it.id}));}
        for(const name of ['Footer','Legal links','Cookie notice']) {const row=u.el('div','ab-tree-row indent',tree);icon(row,'layers');u.el('span','',row,name);}
        u.el('div','ab-tree',tree);u.el('div','ab-caption',tree,'Collections');for(const name of ['Articles','Team members','Testimonials']){const row=u.el('div','ab-tree-row',tree);icon(row,'folder');u.el('span','',row,name);}
        const main = u.el('div', 'ab-main', work);
        const bar=u.el('div','ab-layerbar',main);icon(bar,'layers');u.el('span','',bar,'Body / Content / Block');
        const list = pane('blocks', main, 'ab-blocklist');
        u.el('div', 'ab-caption', list, 'Studio page / Desktop');
        for (const it of s.items) {
          const block = ref({ block: it.id }, u.el('button', 'ab-editblock', list), 'blocks'); block.type = 'button';
          u.el('strong', '', block, it.label);
          const copy = u.el('p', '', block), meta = u.el('small', '', block);
          state.blocks[it.id] = { block, copy, meta };
          block.addEventListener('click', () => { apply({ ...ctx.model, selected: it.id }); });
        }
        const inspector = pane('inspector', work, 'ab-inspector');
        const tabs=u.el('div','ab-tabs',inspector);u.el('span','active',tabs,'Properties');u.el('span','',tabs,'Style');
        state.inspectName = u.el('div', 'ab-caption', inspector);
        field(inspector, { id: 'title', label: 'Text', limit: 90 }, true, 'inspector');
        field(inspector, { id: 'url', label: 'Link URL', limit: 100 }, true, 'inspector');
        const label = u.el('div', 'ab-field', inspector);
        u.el('div', 'ab-fieldlabel', label, 'Alignment');
        const group = u.el('div', 'ab-segment', label);
        for (const a of ['Left', 'Center', 'Right']) {
          const b = ref({ align: a }, u.el('button', '', group, a), 'inspector'); b.type = 'button';
          state.align[a] = b;
          b.addEventListener('click', () => edit((m) => { m.props[m.selected].align = a; }));
        }
        const padding = field(inspector, { id: 'padding', label: 'Padding', limit: 2 }, true, 'inspector');
        padding.inputMode = 'numeric';
        const spacing=u.el('div','ab-spacingbox',inspector,'MARGIN / 0');state.spacingBox=u.el('div','',spacing,'PADDING / 16 px');
        u.el('div','ab-setting',inspector);u.el('div','ab-caption',inspector,'Typography');kv(inspector,'Font','System');kv(inspector,'Weight','Regular / 400');kv(inspector,'Line height','1.5');
        u.el('div','ab-setting',inspector);u.el('div','ab-caption',inspector,'Visibility');kv(inspector,'Desktop','Visible');kv(inspector,'Tablet / Mobile','Inherited');
      }
      function paint(m) {
        state.saved.textContent=m.committed ? s.scenario==='email'?'Campaign sent':s.scenario==='social'?'Schedule activated':'Published version saved' : 'All changes saved';
        if(state.subjectCheck) { state.subjectCheck.querySelector('span').textContent=m.fields.subject?'Subject line added':'Subject line missing'; state.subjectCheck.querySelector('path').setAttribute('d',m.fields.subject?icons.check:icons.alert); }
        if(state.seoCheck) { state.seoCheck.querySelector('span').textContent=m.fields.title?'Title added':'Title not added'; state.seoCheck.querySelector('path').setAttribute('d',m.fields.title?icons.check:icons.alert); }
        status.textContent = `Status: ${f.status(m, s)}`;
        metric.textContent = s.scenario === 'social' ? `Scheduled posts: ${Object.values(m.schedule).filter((v) => v >= 0).length}` :
          s.scenario === 'seo' ? `Metadata characters: ${Object.values(m.fields).join('').length}` : `Words: ${f.wordCount(m, s)}`;
        for (const entry of state.fields) {
          const value = String(m.fields[entry.def.id] || '');
          if (entry.input.value !== value) entry.input.value = value;
          entry.out.textContent = `${value.length} / ${entry.def.limit}`;
          entry.out.classList.toggle('full', value.length >= entry.def.limit);
          entry.fill.style.width = `${Math.min(100,value.length/entry.def.limit*100)}%`;
        }
        state.slots.forEach((entry, i) => {
          const it = s.items.find((item) => item.id === m.slots[i]);
          entry.slot.className = `ab-slot ${it ? 'filled' : 'empty'}`;
          entry.slot.dataset.type = it ? it.type : '';
          entry.title.textContent = it ? it.label : 'Empty section';
          entry.copy.textContent = it && !['Divider', 'Spacer'].includes(it.type) ? it.copy : '';
          entry.visual.textContent = it && it.type === 'Spacer' ? 'Spacer' : '';
          entry.remove.style.display = it ? '' : 'none';
        });
        if (s.scenario === 'seo') {
          state.previewTitle.textContent = m.fields.title || 'Your page title';
          state.previewDesc.textContent = m.fields.description || 'Add a description to preview how this page may appear in search results.';
          state.previewSlug.textContent = `studio.example/${m.fields.slug || 'page'}`;
        }
        if (s.scenario === 'social') {
          state.emptyDrafts.style.display = Object.values(m.schedule).some((v) => v < 0) ? 'none' : '';
          // Cards keep their listeners while moving between the tray and calendar cells.
          for (const it of s.items) {
            const post = state.posts[it.id], dest = m.schedule[it.id] >= 0 ? state.cells[m.schedule[it.id]] : state.drafts;
            if (post.parentElement !== dest) dest.appendChild(post);
            post.querySelector('.ab-postmeta span').textContent=m.committed?'Scheduled / Social feed':m.schedule[it.id]>=0?'Planned / Social feed':'Draft / Social feed';
          }
          state.records = state.records.filter((r) => !r.key.startsWith('{"post":'));
          for (const it of s.items) state.records.push({ key: keyOf({ post: it.id }), el: state.posts[it.id], pane: m.schedule[it.id] < 0 ? 'drafts' : `calendar${m.schedule[it.id]}` });
        }
        if (s.scenario === 'blockedit') {
          for (const it of s.items) {
            const p = m.props[it.id], entry = state.blocks[it.id];
            entry.block.classList.toggle('ab-selected', it.id === m.selected);
            entry.copy.textContent = p.title; entry.copy.style.textAlign = p.align.toLowerCase();
            entry.block.style.paddingTop = entry.block.style.paddingBottom = `${p.padding}px`;
            entry.meta.textContent = `${p.url} · ${p.padding}px padding`;
          }
          state.spacingBox.textContent=`PADDING / ${m.props[m.selected].padding} px`;
          state.inspectName.textContent = `Inspector / ${s.items.find((it) => it.id === m.selected).label}`;
          for (const entry of state.props) {
            const value = String(m.props[m.selected][entry.def.id]);
            if (entry.input.value !== value) entry.input.value = value;
            entry.out.textContent = entry.def.id === 'padding' ? 'px / 0-64' : `${value.length} / ${entry.def.limit}`;
            entry.fill.style.width = entry.def.id==='padding'?`${Number(value)/64*100}%`:`${Math.min(100,value.length/entry.def.limit*100)}%`;
          }
          for (const a of Object.keys(state.align)) state.align[a].classList.toggle('on', m.props[m.selected].align === a);
        }
        mirror();
      }
      paint(ctx.model);
      return { anchors: [app], sync: paint };
    },
    locate(t) {
      if (t.pane) return center(st.panes[t.pane]);
      const el = st.refs.get(keyOf(t));
      if (!el || !el.isConnected) throw new Error(`use-site-builder: missing target ${JSON.stringify(t)}`);
      return center(el);
    },
  });
})();
