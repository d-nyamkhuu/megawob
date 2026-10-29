/*
 * use-site-builder/studio: publishing studio shared by page, email, seo, social and blockedit.
 * design: {} reproduces each scaffold exactly (no scenario presets):
 *   page: design-use-site-builder-page-01; email: design-use-site-builder-email-01;
 *   seo: design-use-site-builder-seo-01; social: design-use-site-builder-social-01;
 *   blockedit: design-use-site-builder-blockedit-01.
 * Shared shell and inputs live in _workspace.js, scenario panels in _panels.js,
 * and model synchronization/location in _paint.js. Existing parts remain the widget API.
 * Tokens (defaults):
 *   fontFamily ('system-ui,sans-serif'), fontSize ('11px'), radius ('6px'): workspace typography/radius.
 *   colors ({}): optional panel/line/accent/muted/fg/bg CSS color values; otherwise site variables.
 *   inset (8): workspace margin in stage px; compactWidth (800): compact/layer/settings breakpoint.
 *   navExpandWidth (1150): expand product navigation above this stage width.
 *   narrowWidth (750): breakpoint for library, campaign and social pane widths.
 *   libraryWidths ([124,150]), campaignWidths ([190,230]), socialWidths ([145,185]): narrow/wide px.
 *   settingsWidths ([120,150]), layersWidths ([118,155]): narrow/wide px at compactWidth.
 *   pageInspectorWidth (950): minimum stage width for the page details pane.
 *   documentWidth (780), emailWidth (620): maximum document widths in px; pageColumns (2): page grid.
 *   icons (ICONS below): whole SVG path table; titles (TOKENS below): whole scenario toolbar-title table.
 *   navigation (TOKENS below): whole [icon,label,count] product navigation table.
 *   symbols (TOKENS below): whole block-type -> icon-name table.
 *   historyCells ([0,4,7,11,14]): calendar cells with published history (preserve draws on replacement).
 *   workspaceLabel ('Studio workspace / Marketing'), libraryLabel ('Content blocks'), searchLabel ('Find a block').
 *   emptySection ('Empty section'): empty slot label.
 *   emptyDrafts ('Your queue is organized.\nUnscheduled drafts will appear here.'): empty tray message.
 *   previewTitle ('Your page title'), previewDescription ('Add a description to preview how this page may appear in search results.').
 *   domain ('studio.example'): publishing domain and SEO preview URL.
 * Parts (overrides are (base, S) => replacement; every internal call goes through P):
 *   begin(ctx): before DOM construction; no-op.
 *   style(ctx): install structural CSS with typography, document widths and optional theme colors.
 *   context(ctx): -> {cr,company,colleague,otherProjects}: sample studio/context in reference order.
 *   icon(parent, name): -> svg: draw the named path from D.icons (grid fallback).
 *   iconButton(parent, name, label, action): -> button: accessible icon control with optional click action.
 *   kv(parent, label, value): -> strong: draw a label/value row.
 *   checkline(parent, text): -> row: draw an icon and span used by live checklist updates.
 *   showPanel(title, rows): toggle a contextual popover; rows are [label, detail] pairs.
 *   frame(ctx): -> app: stable workspace anchor sized from ctx.size and inset.
 *   ref(t, el, pane): -> el: register a target and optional scrolling-pane record.
 *   pane(id, parent, cls): -> el: create and register a wheel pane; mirror visibility on scroll.
 *   mirror(): mirror clipped target centers into model.view.hidden; no task edits.
 *   apply(n): update model and repaint from the current ctx.model.
 *   edit(fn): clone current model, clear committed, apply an edit and repaint.
 *   header(): project, collaborators, preview and P.publish controls.
 *   publishView(parent): -> button: draw-shape/register the episode's publish/send control.
 *   publish(parent): bind publishing and judge-confirm behavior to P.publishView.
 *   toolbar(): scenario title, history, responsive preview and audience/zoom controls.
 *   workspace(): -> el: create the flex workspace for navigation and scenario panels.
 *   navigation(): workspace navigation and contextual project/settings menus.
 *   footer(): -> {status,metric}: create live footer elements, owner and saved-state label.
 *   field(parent, def, prop, paneId): -> input: bind a field view to model.fields or selected model.props.
 *   fieldView(parent, def, prop): -> {wrap,input,out}: label, native text control with limit, and counter.
 *   fieldMeter(wrap): -> fill: character-limit meter inside a field wrapper.
 *   drag(el, itemOf, kind): bind pointer-captured block/post dragging, drop hit tests and model updates.
 *   ghost(id): -> el: create the drag preview (positioning stays in drag).
 *   library(): build block library, search, saved sections and page tree; bind palette drags.
 *   document(): build page/email canvas with document header, slots and footer.
 *   pageInspector(): build unscored page, typography and publishing details.
 *   campaignInspector(): build campaign fields, delivery checklist and tracking details.
 *   composer(): page/email layout through library, document and appropriate inspector parts.
 *   paletteItem(library, it): -> el: draw and register a library card with its type icon.
 *   slotView(page, i): -> entry {slot,title,copy,visual,remove}: draw-shape/register one canvas slot.
 *   slot(page, i): bind slot removal and drag/drop, retain its view entry for repaint.
 *   settingsMenu(): build SEO settings navigation and other-pages tree.
 *   seoForm(): build metadata fields, indexing, canonical URL and structured-data context.
 *   seoPreview(): build search listing preview and checklist; save live text refs.
 *   seo(): SEO layout through settings menu, form and preview parts.
 *   channels(): build connected channels and unscheduled draft tray/drop target.
 *   calendar(): build social toolbar, scrollable calendar and cells in row/day order.
 *   postView(drafts, it): -> el: draw-shape/register one post, retaining .ab-postmeta span for repaint.
 *   post(it): bind a post view to drag handling and retain it for scheduling.
 *   social(): social layout through channels, calendar and post parts.
 *   history(cell, i, row): published archive card; consumes cr.int(21,180) once per history cell.
 *   calendarCell(calendar, row, day): build/register one calendar cell and drop target; invoke history at selected indices.
 *   layers(): build selectable block navigator and unscored collection tree.
 *   blockList(): build block canvas/list through editBlock views.
 *   blockInspector(): build selected-block fields, alignment controls and typography details.
 *   blockedit(): block editor layout through navigator, list and inspector parts.
 *   editBlockView(list, it): -> entry {block,copy,meta}: draw-shape/register a selectable block card.
 *   editBlock(list, it): bind a block card to selection and retain its live text refs.
 *   alignmentButton(group, a): -> button: draw-shape/register one alignment choice.
 *   paint(m): repaint current model through field/slot/SEO/social/block parts, then mirror visibility.
 *   paintField(entry, m): set field value, character counter and limit meter.
 *   paintSlot(entry, i, m): set filled/empty slot content, type, spacer and removal visibility.
 *   paintSeo(m): update search listing text from metadata.
 *   paintSocial(m): move post cards without losing listeners; update labels and scroll records.
 *   paintBlocks(m): update block properties, inspector fields, spacing and alignment selection.
 *   item(ctx, el, item): after a palette/slot/post/block is bound; no-op decoration hook (slot item may be undefined).
 *   rendered(ctx): after initial repaint; no-op decoration hook.
 *   locate(t): -> [x,y]: read registered target/pane geometry, throw if missing; never mutate DOM.
 * S.ctx/spec/st expose the current episode and widget records; S.els exposes app/work/status/metric.
 * S.company/colleague/otherProjects/cr expose sampled context; S.D/P expose resolved tokens/parts.
 * View return values documented above are consumed by binding and paint parts; preserve their fields.
 * Keep all reference RNG draws in order: context draws and social history cr.int calls.
 * Additional random decoration must use ctx.rng.fork('<label>'). No DOM work occurs in the factory.
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
  const ICONS = {
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
  const keyOf = (t) => JSON.stringify(t);
  const center = (el) => { const r = el.getBoundingClientRect(); return [Math.round(r.left + r.width / 2), Math.round(r.top + r.height / 2)]; };
  const inside = (r, p) => p.x >= r.left && p.x <= r.right && p.y >= r.top && p.y <= r.bottom;

  const TOKENS = {
    fontFamily: 'system-ui,sans-serif', fontSize: '11px', radius: '6px', colors: {},
    inset: 8, compactWidth: 800, navExpandWidth: 1150, narrowWidth: 750,
    libraryWidths: [124, 150], campaignWidths: [190, 230], socialWidths: [145, 185],
    settingsWidths: [120, 150], layersWidths: [118, 155], pageInspectorWidth: 950,
    documentWidth: 780, emailWidth: 620, pageColumns: 2,
    icons: ICONS,
    titles: { page: 'Page designer', email: 'Campaign builder', seo: 'Search settings', social: 'October 2027 · Week 42', blockedit: 'Page designer' },
    navigation: [['grid','Overview',''],['pages','Website','8'],['mail','Campaigns','12'],['calendar','Publishing','7'],['people','Audience',''],['folder','Assets','24'],['chart','Reports','']],
    symbols: { Heading:'heading', Image:'image', Text:'text', Button:'button', Divider:'divider', Quote:'quote', Columns:'columns', Spacer:'spacer' },
    historyCells: [0, 4, 7, 11, 14],
    workspaceLabel: 'Studio workspace / Marketing', libraryLabel: 'Content blocks',
    searchLabel: 'Find a block', emptySection: 'Empty section',
    emptyDrafts: 'Your queue is organized.\nUnscheduled drafts will appear here.',
    previewTitle: 'Your page title',
    previewDescription: 'Add a description to preview how this page may appear in search results.',
    domain: 'studio.example',
  };

  env.template('use-site-builder/studio', (design, def) => {
    let D, P;
    let ctx, s, u, size, f, cr, company, colleague, otherProjects, icons;
    let st, state, app, work, status, metric, popover, drops;
    const els = {};
    const BASE = {};
    const S = {
      get ctx() { return ctx; },
      get spec() { return s; },
      get st() { return st; },
      get company() { return company; },
      get colleague() { return colleague; },
      get otherProjects() { return otherProjects; },
      get cr() { return cr; },
      get D() { return D; },
      get P() { return P; },
      els,
    };

    const studio = {
      get D() { return D; },
      get P() { return P; },
      get ctx() { return ctx; },
      get spec() { return s; },
      get util() { return u; },
      get size() { return size; },
      get helpers() { return f; },
      get cr() { return cr; },
      get company() { return company; },
      get colleague() { return colleague; },
      get otherProjects() { return otherProjects; },
      get icons() { return icons; },
      get st() { return st; },
      get state() { return state; },
      get app() { return app; },
      get work() { return work; },
      get status() { return status; },
      get metric() { return metric; },
      get popover() { return popover; },
      set popover(value) { popover = value; },
      get drops() { return drops; },
      CSS, keyOf, center, inside,
    };

    env.templateLib('use-site-builder/_workspace').installFrame(BASE, studio);
    env.templateLib('use-site-builder/_workspace').installShell(BASE, studio);
    env.templateLib('use-site-builder/_workspace').installInputs(BASE, studio);
    env.templateLib('use-site-builder/_panels').installComposer(BASE, studio);
    env.templateLib('use-site-builder/_panels').installSeo(BASE, studio);
    env.templateLib('use-site-builder/_panels').installSocial(BASE, studio);
    env.templateLib('use-site-builder/_panels').installBlocks(BASE, studio);
    env.templateLib('use-site-builder/_paint').installPaint(BASE, studio);

    ({ D, P } = env.templateDesign('use-site-builder/studio', design, def, { tokens: TOKENS, base: BASE, state: S }));
    return {
      render(nextCtx) {
        ctx = nextCtx;
        s = ctx.spec; u = ctx.util; size = ctx.size; f = env.taskDef.helpers; icons = D.icons;
        P.style(ctx);
        ({ cr, company, colleague, otherProjects } = P.context(ctx));
        state = st = { ctx, refs: new Map(), panes: {}, records: [], fields: [], props: [], slots: [], posts: {}, blocks: {}, align: {}, ghost: null };
        popover = null;
        drops = [];
        for (const key of Object.keys(els)) delete els[key];
        P.begin(ctx);
        app = P.frame(ctx);
        els.app = app;
        P.header();
        P.toolbar();
        work = P.workspace();
        els.work = work;
        P.navigation();
        ({ status, metric } = P.footer());
        Object.assign(els, { status, metric });
        if (s.scenario === 'page' || s.scenario === 'email') P.composer();
        else if (s.scenario === 'seo') P.seo();
        else if (s.scenario === 'social') P.social();
        else P.blockedit();
        P.paint(ctx.model);
        P.rendered(ctx);
        return { anchors: [app], sync: (m) => P.paint(m) };
      },
      locate(t) { return P.locate(t); },
    };
  }, { uses: ['use-site-builder/_workspace', 'use-site-builder/_panels', 'use-site-builder/_paint'] });
})();
