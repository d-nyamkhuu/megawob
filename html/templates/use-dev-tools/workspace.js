/*
 * use-dev-tools/workspace: the engineering workspace shared by dbrow, flag, logs, prcomment and rerun.
 * Defaults (design: {}) reproduce design-use-dev-tools-dbrow-01, design-use-dev-tools-flag-01,
 * design-use-dev-tools-logs-01, design-use-dev-tools-prcomment-01 and design-use-dev-tools-rerun-01 respectively.
 * No scenario presets: the scenarios share navigation, split panes, selection and action handling.
 * CSS uses the site's --panel/--line/--accent/--muted/--fg/--bg; site.css may restyle dv-* classes.
 * Tokens (defaults):
 *   brand ('Forgeplane'): workspace brand.
 *   otherProjects (delivery-gateway, metrics-collector, customer-portal): project switcher/sidebar names.
 *   titles ({prcomment: Pull request, rerun: Pipeline, logs: Log explorer, dbrow: Table editor,
 *     flag: Feature flags}): fallback headings by scenario; review/pipeline headings include seeded IDs.
 *   active ({prcomment: Pull requests, rerun: Pipelines, logs: Logs, dbrow: Database, flag: Flags}): active nav.
 *   tabs (per-scenario arrays in TOKENS): tab captions, in reference order (review tab 3; otherwise tab 0 active).
 *   inset (12), bottomInset (80), minHeight (260): frame inset, reserved bottom space, minimum height in px.
 *   narrowWidth (870), wideWidth (1170): stage-width breakpoints in px.
 *   font ('system-ui,sans-serif'), fontSize (11), radius (7): workspace typeface, text size and radius in px.
 *   sidebarWidth (146): standard sidebar width in px; narrow/wide CSS retains its responsive widths.
 *   detailWidth ('30%'), detailMinWidth (218), detailMaxWidth (310): standard detail pane dimensions.
 *   success ('#26845b'), error ('#c75348'), warning ('#a46b20'): status colors.
 *   darkSuccess ('#72caa1'), darkError ('#f08d83'), darkWarning ('#e3ba70'): dark-theme status colors.
 * Parts: overrides are (base, S) => replacement; all template calls use P.
 *   style(ctx): install structural CSS. begin(ctx): before seeded context (nothing).
 *   contextData(ctx) -> colleagues: three personName draws from rng.fork('workspace-context'), in order.
 *   frame(ctx) -> card: fixed workspace, responsive classes, sole anchor.
 *   top(ctx, card): brand, project picker, workspace search, notifications/help and avatar.
 *   sidebar(ctx, sidebar): project, navigation, contextual entries, other projects and status.
 *   layout(ctx, card) -> {shell, sidebar, work, badge, query, content, main}: compose the split workspace.
 *   tabs(ctx, work): scenario tabs and activity popovers. heading(ctx, work) -> badge: title/subtitle/status.
 *   tools(ctx, work) -> query: search and optional toolbar controls; registers refs.query.
 *   context(ctx, main): review branch/database/scope strip (otherwise nothing).
 *   graph(ctx, main): retry pipeline graph, graphNodes/graphJobs (rerun only).
 *   histogram(ctx, main): chart and refs.bars/chartCount (logs only).
 *   facets(ctx, main): service/severity chips (logs only). columnHead(ctx, main): scenario column captions.
 *   list(ctx, main) -> {pane, empty}: scrolling result list, file-end marker and empty state; refs.pane.
 *   row(ctx, pane, item) -> rec: selectable button registered in rows, calls rowContent/rowDecorated.
 *   rowContent(ctx, row, item, rec): scenario cells; sets rec.mark/icon/status/quota/state as applicable.
 *   rowDecorated(ctx, row, item, rec): after a row is built (nothing).
 *   detail(ctx, content) -> {detail, dh, meta}: detail pane, selection heading and metadata paragraph.
 *   controls(ctx, detail) -> controls: dispatch to controlsPrcomment/controlsRerun/controlsLogs/
 *     controlsDbrow/controlsFlag(ctx, detail), which build the scenario editors/actions; appends selection-dependent nodes to
 *     S.st.selectionOnly, returns draft/savedComment/approve/prepare/run/confirmBox/save/toggle/toggleValue.
 *   facts(ctx, detail) -> factsBox: fact container. detailExtra(ctx, detail): metadata/history/SQL/rules.
 *   footer(ctx, work) -> {footCount, footStatus}: counts, sync status and revision.
 *   initials(name) -> text: two initials. icon(parent, name) -> svg: outline icon.
 *   mark(parent, name): replace children with icon. iconButton(parent, glyph, label) -> button: icon control.
 *   sideLabel(sidebar, text): nav heading. sideItem(sidebar, text, glyph, count, active): nav item/popover.
 *   metaLine(parent, key, value): metadata row. syntax(parent, text): highlighted diff spans.
 *   peek(title, items): replace the workspace popover; items are [title, subtitle, glyph].
 *   chip(parent, name, val) -> button: scoped/filter chip registered in refs.
 *   button(parent, action, text, primary) -> button: registered action, irreversible-action guard.
 *   change(action, val): task update and repaint. visible(): mirror row/control scroll geometry.
 *   paint(model): selection, scenario values/status, details, facts and counts; then visible().
 *   locate(target) -> [x,y]: read registered row/pane/detail/field/action/scope geometry; throw if missing.
 *   rendered(ctx): after first paint and view registration (nothing).
 * S.ctx/spec/st read the live episode; S.els aliases st (DOM, controls, refs, rows, graph state);
 * S.D/P expose resolved tokens/parts. Overrides returning elements/controls retain the documented fields
 * used by paint/locate, or replace those parts too. Keep all rng draws in order; use a new fork for extras.
 */
(function () {
  'use strict';

  const CSS = (D) => `
  .dv-app{position:absolute;display:flex;flex-direction:column;border:1px solid var(--line);border-radius:9px;background:var(--panel);color:var(--fg);overflow:hidden;font:12px/1.4 ${D.font};box-shadow:0 8px 28px #00000012}
  .dv-app *{box-sizing:border-box}.dv-app button,.dv-app input,.dv-app textarea{font:inherit;color:inherit}
  .dv-top{height:35px;flex:none;display:flex;align-items:center;gap:10px;padding:0 14px;background:color-mix(in srgb,var(--fg) 4%,var(--panel));border-bottom:1px solid var(--line)}
  .dv-logo{display:grid;place-items:center;width:21px;height:21px;border-radius:5px;background:var(--accent);color:white;font-weight:800}.dv-project{max-width:48%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600}.dv-spacer{flex:1}.dv-muted{color:var(--muted)}
  .dv-avatar{width:23px;height:23px;border-radius:50%;background:color-mix(in srgb,var(--accent) 20%,var(--panel));display:grid;place-items:center;font-size:10px;font-weight:700;color:var(--accent)}
  .dv-tabs{display:flex;align-items:center;height:33px;gap:18px;padding:0 15px;border-bottom:1px solid var(--line);flex:none;overflow:hidden;white-space:nowrap}
  .dv-tab{border:0;border-bottom:2px solid transparent;background:none;height:33px;padding:0 1px;color:var(--muted)!important;cursor:pointer}.dv-tab.active{border-color:var(--accent);font-weight:650;color:var(--fg)!important}
  .dv-heading{height:58px;display:flex;align-items:center;padding:8px 15px;gap:12px;flex:none;min-width:0}.dv-heading h2{font-size:17px;margin:0 0 2px;font-weight:650}.dv-heading p{margin:0;color:var(--muted);font-size:11px}.dv-title{flex:1;min-width:0;overflow:hidden}.dv-title h2,.dv-title p{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
  .dv-badge{border:1px solid var(--line);border-radius:20px;padding:2px 8px;font-size:10px;white-space:nowrap;color:var(--muted)}.dv-badge.good{color:var(--accent);background:color-mix(in srgb,var(--accent) 9%,var(--panel));border-color:color-mix(in srgb,var(--accent) 35%,var(--line))}
  .dv-tools{height:42px;padding:6px 12px;display:flex;align-items:center;gap:6px;border-block:1px solid var(--line);flex:none;background:color-mix(in srgb,var(--bg) 65%,var(--panel));min-width:0}
  .dv-input{min-width:0;outline:none;border:1px solid var(--line);border-radius:5px;background:var(--panel);padding:6px 8px;user-select:text;-webkit-user-select:text}.dv-input:focus{border-color:var(--accent);box-shadow:0 0 0 2px color-mix(in srgb,var(--accent) 16%,transparent)}.dv-search{width:240px;max-width:55%;height:28px}.dv-tools small{font-size:10px;white-space:nowrap}
  .dv-btn{height:28px;flex:none;border:1px solid var(--line);background:var(--panel);border-radius:5px;padding:0 9px;cursor:pointer;white-space:nowrap}.dv-btn:hover{background:color-mix(in srgb,var(--accent) 9%,var(--panel))}.dv-btn:focus-visible{outline:2px solid var(--accent);outline-offset:1px}.dv-btn.primary{background:var(--accent);border-color:var(--accent);color:#fff}.dv-btn:disabled{opacity:.45;cursor:default}
  .dv-content{display:flex;flex:1;min-height:0;overflow:hidden}.dv-main{flex:1;min-width:0;display:flex;flex-direction:column;overflow:hidden}.dv-columnhead{height:28px;flex:none;display:grid;align-items:center;gap:8px;padding:0 12px;font-size:10px;text-transform:uppercase;letter-spacing:.04em;color:var(--muted);border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--fg) 2%,var(--panel))}
  .dv-pane{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:var(--line) transparent}
  .dv-row{display:grid;width:100%;align-items:center;gap:8px;text-align:left;border:0;border-bottom:1px solid color-mix(in srgb,var(--line) 65%,transparent);background:none;padding:0 12px;cursor:pointer;min-height:40px;overflow:hidden}.dv-row:hover{background:color-mix(in srgb,var(--fg) 4%,var(--panel))}.dv-row.selected{background:color-mix(in srgb,var(--accent) 12%,var(--panel));box-shadow:inset 3px 0 var(--accent)}.dv-row span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dv-row small{font-size:10px;color:var(--muted)}
  .dv-mono{font-family:ui-monospace,Consolas,monospace;font-size:11px;user-select:text;-webkit-user-select:text}.dv-pr .dv-row{min-height:28px;grid-template-columns:36px 16px minmax(0,1fr);padding:0 9px;gap:5px}.dv-pr .dv-row.added{background:color-mix(in srgb,#2f9961 8%,var(--panel))}.dv-pr .dv-row.selected{background:color-mix(in srgb,var(--accent) 14%,var(--panel))}.dv-pr .dv-number{color:var(--muted);text-align:right}.dv-pr .dv-code{white-space:pre}
  .dv-detail{width:31%;min-width:235px;max-width:330px;display:flex;flex-direction:column;border-left:1px solid var(--line);background:color-mix(in srgb,var(--bg) 35%,var(--panel));overflow:auto;padding:12px;gap:8px;scrollbar-width:thin}.dv-detail h3{font-size:13px;margin:0}.dv-detail p{margin:0;font-size:11px;overflow-wrap:anywhere}.dv-detail label{font-size:10px;font-weight:600;color:var(--muted)}.dv-detail .dv-input{width:100%}.dv-detail textarea{resize:none;height:66px;flex:none;font-size:11px}.dv-detail .dv-btn{align-self:flex-start}.dv-detail .dv-actions{display:flex;gap:6px;flex-wrap:wrap}.dv-divider{border:0;border-top:1px solid var(--line);width:100%;margin:2px 0}
  .dv-facts{margin-top:auto;border-top:1px solid var(--line);padding-top:7px;font-size:10px;line-height:1.8;overflow-wrap:anywhere}.dv-fact b{font-weight:500;color:var(--muted)}.dv-empty{padding:28px 12px;text-align:center;color:var(--muted)}
  .dv-foot{height:26px;flex:none;display:flex;align-items:center;gap:12px;padding:0 12px;border-top:1px solid var(--line);color:var(--muted);font-size:10px}.dv-foot span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dv-dot{color:var(--accent)}
  .dv-graph{height:66px;flex:none;display:flex;align-items:center;justify-content:center;padding:10px 12px;border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--bg) 45%,var(--panel))}.dv-node{border:1px solid var(--line);border-radius:6px;padding:6px 10px;min-width:80px;background:var(--panel);font-size:11px}.dv-node small{display:block;font-size:9px;color:var(--muted)}.dv-edge{height:1px;width:26px;background:var(--line);flex:0 1 26px}.dv-node.failed{border-color:color-mix(in srgb,#cf6d56 65%,var(--line))}
  .dv-facets{display:flex;flex-direction:column;gap:4px;padding:7px 12px;border-bottom:1px solid var(--line);flex:none}.dv-facet{display:flex;align-items:center;gap:4px;flex-wrap:wrap}.dv-facet label{font-size:10px;color:var(--muted);width:46px}.dv-chip{font-size:10px!important;height:23px;padding:0 7px;border:1px solid transparent;border-radius:4px;background:none;cursor:pointer}.dv-chip.on{color:var(--accent)!important;background:color-mix(in srgb,var(--accent) 10%,var(--panel));border-color:color-mix(in srgb,var(--accent) 30%,var(--line))}
  .dv-log .dv-row{grid-template-columns:76px 48px minmax(0,1fr);min-height:52px}.dv-logmsg{display:flex;flex-direction:column;gap:2px}.dv-level{font-size:9px;padding:2px 4px;border-radius:3px;background:color-mix(in srgb,#cb7b32 10%,var(--panel));color:var(--fg)}
  .dv-db .dv-row,.dv-db .dv-columnhead{grid-template-columns:90px minmax(60px,1fr) 65px 65px}.dv-flag .dv-row{grid-template-columns:minmax(0,1fr) 55px;min-height:49px}.dv-switch{width:39px;height:22px;border:0;border-radius:20px;background:color-mix(in srgb,var(--fg) 25%,var(--panel));position:relative;cursor:pointer;flex:none}.dv-switch:after{content:'';position:absolute;left:3px;top:3px;width:16px;height:16px;background:#fff;border-radius:50%}.dv-switch.on{background:var(--accent)}.dv-switch.on:after{left:20px}.dv-scope{display:flex;flex-wrap:wrap;gap:3px}.dv-rule{display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-block:1px solid var(--line)}.dv-confirm{padding:8px;border:1px solid color-mix(in srgb,var(--accent) 45%,var(--line));border-radius:5px;font-size:11px}

  .dv-app{font-size:${D.fontSize}px;border-radius:${D.radius}px;--dv-ok:${D.success};--dv-error:${D.error};--dv-warn:${D.warning}}.dv-app[data-dark="true"]{--dv-ok:${D.darkSuccess};--dv-error:${D.darkError};--dv-warn:${D.darkWarning}}
  .dv-icon{width:15px;height:15px;flex:none;vertical-align:middle;stroke:currentColor;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}.dv-logo .dv-icon{width:17px;height:17px}.dv-top{height:38px;gap:9px}.dv-top .dv-project{max-width:31%;font-size:11px}.dv-brand{font-size:12px;font-weight:750;letter-spacing:-.02em}.dv-global-search{margin-left:12px;width:190px;max-width:22%;height:25px;display:flex;align-items:center;gap:6px;color:var(--muted);border:1px solid var(--line);border-radius:4px;padding:0 6px;background:var(--panel);cursor:pointer;font-size:10px}.dv-global-search kbd{margin-left:auto;font:9px monospace;border:1px solid var(--line);border-radius:3px;padding:0 3px}.dv-iconbtn{position:relative;width:26px;height:26px;display:grid;place-items:center;flex:none;border:1px solid transparent;border-radius:4px;background:none;color:var(--muted);cursor:pointer}.dv-iconbtn:hover{background:var(--bg);border-color:var(--line)}.dv-notification-dot{position:absolute;right:4px;top:3px;width:5px;height:5px;border-radius:50%;background:var(--accent);border:1px solid var(--panel)}
  .dv-shell{display:flex;flex:1;min-height:0;overflow:hidden}.dv-sidebar{width:${D.sidebarWidth}px;flex:none;display:flex;flex-direction:column;border-right:1px solid var(--line);background:color-mix(in srgb,var(--bg) 70%,var(--panel));padding:10px 7px;overflow:auto;scrollbar-width:thin;gap:2px}.dv-work{min-width:0;flex:1;display:flex;flex-direction:column;overflow:hidden}.dv-side-project{display:flex;align-items:center;gap:7px;margin:0 2px 8px;min-height:29px}.dv-side-project .dv-avatar{border-radius:5px;flex:none}.dv-side-name{min-width:0;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dv-side-name small{display:block;font-size:9px;color:var(--muted);font-weight:400}.dv-side-label{font-size:9px;letter-spacing:.06em;color:var(--muted);margin:10px 6px 4px;text-transform:uppercase}.dv-side-item{display:flex;align-items:center;gap:7px;min-height:27px;padding:3px 6px;border:0;border-radius:4px;background:none;color:var(--muted);font:inherit;text-align:left;cursor:pointer;width:100%}.dv-side-item.active{color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,var(--panel));font-weight:600}.dv-side-item:hover{background:color-mix(in srgb,var(--fg) 6%,var(--panel))}.dv-side-item .dv-name{min-width:0;flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.dv-side-count{font-size:9px;border-radius:4px;padding:0 4px;background:color-mix(in srgb,var(--fg) 6%,var(--panel));font-weight:400}.dv-side-bottom{margin-top:auto;padding:12px 5px 0;display:flex;align-items:center;gap:6px;font-size:9px;color:var(--muted)}
  .dv-tabs{height:30px;gap:15px;padding:0 12px;background:color-mix(in srgb,var(--bg) 30%,var(--panel))}.dv-tab{height:30px;font-size:10px}.dv-tab small{margin-left:5px;padding:0 4px;border-radius:8px;background:color-mix(in srgb,var(--fg) 6%,var(--panel));font-size:9px;font-weight:400}.dv-heading{height:56px;padding:7px 12px}.dv-heading h2{font-size:16px;letter-spacing:-.02em}.dv-heading p{font-size:10px}.dv-tools{height:36px;padding:4px 10px;gap:5px}.dv-search{font-size:10px;height:26px;width:200px;max-width:43%;flex:1}.dv-btn{height:26px;font-size:10px;padding:0 7px}.dv-toolbtn{display:flex;align-items:center;gap:4px;height:25px;padding:0 6px;border:1px solid var(--line);border-radius:4px;background:var(--panel);font-size:9px!important;cursor:pointer;white-space:nowrap}.dv-toolbtn .dv-icon{width:12px;height:12px}.dv-tools small{font-size:9px}.dv-heading .dv-badge{display:flex;align-items:center;gap:5px}
  .dv-context{display:flex;align-items:center;gap:7px;height:29px;padding:0 10px;flex:none;border-bottom:1px solid var(--line);color:var(--muted);font-size:9px;overflow:hidden;white-space:nowrap}.dv-context .dv-icon{width:12px;height:12px}.dv-context strong{font-weight:500;color:var(--fg)}.dv-columnhead{font-size:9px;height:25px;padding:0 10px;letter-spacing:0;text-transform:none}.dv-pane{background:var(--panel)}.dv-row{min-height:33px;padding:0 10px;gap:7px;font-size:10px}.dv-row small{font-size:9px}.dv-row .dv-mono{font-size:10px}.dv-pr .dv-row{min-height:25px;grid-template-columns:25px 25px 14px minmax(0,1fr);padding:0 6px;gap:4px}.dv-pr .dv-code{font-size:10px}.dv-oldnum{font-size:10px;text-align:right;color:var(--muted);opacity:.7}.dv-token-key{color:color-mix(in srgb,var(--accent) 85%,var(--fg));font-weight:550}.dv-token-string{color:var(--dv-ok)}.dv-file-end{padding:14px 10px;color:var(--muted);font-size:9px;border-bottom:1px solid var(--line)}
  .dv-detail{width:${D.detailWidth};min-width:${D.detailMinWidth}px;max-width:${D.detailMaxWidth}px;padding:10px;gap:7px}.dv-detail>*{flex-shrink:0}.dv-detail h3{font-size:12px}.dv-detail p{font-size:10px}.dv-detail textarea{height:60px}.dv-detail label{font-size:9px}.dv-detail .dv-input{font-size:10px}.dv-facts{font-size:9px;padding-top:6px}.dv-facts .dv-mono{font-size:10px}.dv-foot{height:23px;font-size:9px;padding:0 10px}.dv-foot .dv-mono{font-size:10px}.dv-detail-section{border-top:1px solid var(--line);padding-top:8px;margin-top:2px}.dv-detail-section h4{margin:0 0 7px;font-size:10px;font-weight:650}.dv-meta-line{display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:9px;color:var(--muted);margin:4px 0;min-width:0}.dv-meta-line strong{font-weight:500;color:var(--fg);text-align:right;max-width:67%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dv-person-line{display:flex;align-items:center;gap:6px;font-size:9px;margin:5px 0}.dv-person-line .dv-avatar{width:18px;height:18px;font-size:8px}.dv-person-line small{margin-left:auto;font-size:8px;color:var(--muted)}.dv-timeline{margin:6px 0 0 5px;border-left:1px solid var(--line);padding-left:11px;color:var(--muted);font-size:9px}.dv-timeline p{font-size:9px;margin-bottom:8px}.dv-timeline b{font-weight:500;color:var(--fg)}.dv-timeline time{display:block;font-size:8px;margin-top:1px}.dv-terminal{font:9px/1.65 ui-monospace,monospace;background:color-mix(in srgb,var(--fg) 7%,var(--panel));border:1px solid var(--line);border-radius:4px;padding:7px;white-space:pre-wrap;overflow-wrap:anywhere}.dv-error{color:var(--dv-error)}.dv-success{color:var(--dv-ok)}.dv-warning{color:var(--dv-warn)}.dv-validation{font-size:9px;color:var(--dv-error);padding:5px;border-left:2px solid var(--dv-error);background:color-mix(in srgb,var(--dv-error) 6%,var(--panel))}
  .dv-graph{height:103px;justify-content:stretch;align-items:stretch;gap:0;padding:7px 10px}.dv-stage{display:flex;flex-direction:column;flex:1;min-width:0;gap:3px}.dv-stage-head{display:flex;align-items:center;gap:4px;font-size:9px;font-weight:600}.dv-stage-head .dv-icon{width:12px;height:12px}.dv-stage-head small{margin-left:auto;font-weight:400;font-size:8px;color:var(--muted)}.dv-jobnode{display:flex;align-items:center;gap:4px;border:1px solid var(--line);border-radius:4px;padding:3px 5px;min-height:24px;background:var(--panel);font:9px ui-monospace,monospace;min-width:0;cursor:pointer;color:var(--fg);text-align:left}.dv-jobnode span{overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.dv-jobnode .dv-icon{width:11px;height:11px}.dv-jobnode.failed{border-left:2px solid var(--dv-error)}.dv-stage-more{font-size:8px;color:var(--muted);padding-left:4px}.dv-edge{align-self:center;max-width:18px;margin:0 5px}.dv-ci .dv-row{min-height:34px}.dv-ci .dv-row .dv-status{font-size:9px}.dv-ci .dv-row .dv-status.failed{color:var(--dv-error)}
  .dv-histogram{height:53px;display:flex;align-items:stretch;gap:8px;flex:none;padding:6px 10px;border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--bg) 35%,var(--panel))}.dv-chart-label{font-size:8px;color:var(--muted);width:45px;flex:none}.dv-chart-label strong{display:block;color:var(--fg);font-size:12px;font-weight:550}.dv-chart{display:flex;align-items:flex-end;gap:3px;flex:1;min-width:0;border-bottom:1px solid var(--line);position:relative;padding-bottom:11px}.dv-bar{flex:1;max-width:24px;background:color-mix(in srgb,var(--accent) 55%,var(--panel));min-width:2px;border-radius:1px 1px 0 0}.dv-chart-axis{position:absolute;bottom:0;left:0;right:0;display:flex;justify-content:space-between;font-size:7px;color:var(--muted)}.dv-facets{padding:4px 10px;gap:1px}.dv-facet{gap:2px}.dv-facet label{font-size:9px;width:40px}.dv-chip{font-size:9px!important;height:21px;padding:0 5px}.dv-log .dv-row{grid-template-columns:67px 44px minmax(0,1fr);min-height:35px}.dv-logmsg{gap:0}.dv-level{font-size:8px!important;border:1px solid transparent;overflow:visible!important;text-overflow:clip!important;text-align:center}.dv-level.error{color:var(--dv-error);background:color-mix(in srgb,var(--dv-error) 10%,var(--panel))}.dv-level.info{color:var(--accent);background:color-mix(in srgb,var(--accent) 9%,var(--panel))}.dv-loghead{grid-template-columns:67px 44px minmax(0,1fr)}.dv-empty{padding:22px 12px;line-height:1.8;font-size:11px}.dv-empty .dv-icon{width:24px;height:24px;display:block;margin:0 auto 6px;color:var(--muted)}.dv-empty small{display:block;color:var(--muted);font-size:9px;margin-bottom:9px}
  .dv-db .dv-row,.dv-db .dv-columnhead{grid-template-columns:71px minmax(55px,1fr) 61px 62px}.dv-db .dv-row{min-height:34px}.dv-db-type{font-size:8px;color:var(--muted);font-weight:400}.dv-extra-col{display:none}.dv-flag .dv-row{min-height:42px;grid-template-columns:minmax(0,1fr) 42px}.dv-flag .dv-row small{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dv-flag .dv-row .dv-badge{font-size:9px;border-radius:4px;padding:1px 6px}.dv-flag .dv-row .dv-badge.good{color:var(--dv-ok);background:color-mix(in srgb,var(--dv-ok) 10%,var(--panel));border-color:color-mix(in srgb,var(--dv-ok) 30%,var(--line))}.dv-rule{font-size:10px;padding:7px 0}.dv-switch{width:34px;height:20px}.dv-switch:after{width:14px;height:14px}.dv-switch.on:after{left:17px}.dv-rule-row{display:flex;align-items:center;gap:6px;padding:6px 0;border-bottom:1px solid var(--line);font-size:9px}.dv-rule-row b{font-size:8px;font-weight:500;border:1px solid var(--line);padding:1px 4px;border-radius:3px}.dv-rule-row span:last-child{margin-left:auto;color:var(--muted)}
  .dv-pop{position:absolute;z-index:40;right:12px;top:34px;width:290px;max-height:80%;overflow:auto;border:1px solid var(--line);border-radius:6px;background:var(--panel);box-shadow:0 10px 35px #0004;padding:12px}.dv-pop-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;font-size:12px;font-weight:650}.dv-pop-row{display:flex;align-items:flex-start;gap:8px;padding:9px 0;border-bottom:1px solid var(--line);font-size:10px}.dv-pop-row small{display:block;font-size:9px;color:var(--muted);margin-top:2px}.dv-pop-row .dv-icon{margin-top:2px;color:var(--accent)}.dv-pop[hidden]{display:none}.dv-narrow .dv-sidebar{width:39px;padding-inline:4px}.dv-narrow .dv-sidebar .dv-name,.dv-narrow .dv-side-label,.dv-narrow .dv-side-count,.dv-narrow .dv-side-name,.dv-narrow .dv-side-bottom span{display:none}.dv-narrow .dv-side-item{padding:5px;justify-content:center}.dv-narrow .dv-side-project{margin-inline:3px}.dv-narrow .dv-side-bottom{padding-inline:6px}.dv-narrow .dv-global-search{display:none}.dv-narrow .dv-optional{display:none}.dv-narrow .dv-tabs{gap:9px}.dv-narrow .dv-detail{min-width:205px;width:33%}
  .dv-wide .dv-sidebar{width:172px}.dv-wide .dv-db .dv-row,.dv-wide .dv-db .dv-columnhead{grid-template-columns:86px minmax(100px,1fr) 72px 76px 94px}.dv-wide.dv-db .dv-row,.dv-wide.dv-db .dv-columnhead{grid-template-columns:86px minmax(100px,1fr) 72px 76px 94px}.dv-wide .dv-extra-col{display:block}.dv-wide .dv-extra-col.dv-logmsg{display:flex}.dv-wide .dv-heading{height:63px}.dv-wide .dv-detail{width:28%;max-width:340px}.dv-wide .dv-row{min-height:38px}.dv-wide.dv-pr .dv-row{min-height:26px}.dv-wide .dv-graph{height:119px}.dv-wide.dv-log .dv-row{min-height:40px}.dv-wide .dv-histogram{height:70px}.dv-wide .dv-facts{margin-top:12px}.dv-wide.dv-flag .dv-row{grid-template-columns:minmax(0,1fr) 90px 45px;min-height:48px}
  `;

  const TOKENS = {
    brand: 'Forgeplane',
    otherProjects: ['delivery-gateway', 'metrics-collector', 'customer-portal'],
    titles: { prcomment: 'Pull request', rerun: 'Pipeline', logs: 'Log explorer', dbrow: 'Table editor', flag: 'Feature flags' },
    active: { prcomment: 'Pull requests', rerun: 'Pipelines', logs: 'Logs', dbrow: 'Database', flag: 'Flags' },
    tabs: { prcomment: ['Conversation', 'Commits', 'Checks', 'Files changed'], rerun: ['Pipeline graph', 'Jobs', 'Tests', 'Artifacts'], logs: ['Explorer', 'Patterns', 'Analytics', 'Saved views'], dbrow: ['Table editor', 'SQL editor', 'Indexes', 'Policies'], flag: ['Feature flags', 'Segments', 'SDK connections', 'Change history'] },
    inset: 12, bottomInset: 80, minHeight: 260, narrowWidth: 870, wideWidth: 1170,
    font: 'system-ui,sans-serif', fontSize: 11, radius: 7, sidebarWidth: 146,
    detailWidth: '30%', detailMinWidth: 218, detailMaxWidth: 310,
    success: '#26845b', error: '#c75348', warning: '#a46b20',
    darkSuccess: '#72caa1', darkError: '#f08d83', darkWarning: '#e3ba70',
  };

  function installChrome(BASE, S) {
    BASE.style = (ctx) => {
      const { D } = S;
      ctx.css('app-dev-classic', CSS(D));
    };

    BASE.begin = (ctx) => {};

    BASE.contextData = (ctx) => {
      const { st } = S;
      const { s } = st;
      const decor = ctx.rng.fork('workspace-context');
      const colleagues = Array.from({length:3}, () => ctx.content.personName(decor, {csplit:s.csplit}).full);
      return colleagues;
    };

    BASE.frame = (ctx) => {
      const { st, D } = S;
      const { v, el } = st;
      const card = el('section', `dv-app dv-${{ prcomment: 'pr', rerun: 'ci', logs: 'log', dbrow: 'db', flag: 'flag' }[v]}`, ctx.stage);
      card.classList.add(ctx.size.width < D.narrowWidth ? 'dv-narrow' : ctx.size.width >= D.wideWidth ? 'dv-wide' : 'dv-standard');
      card.dataset.dark = String(document.documentElement.dataset.theme === 'dark');
      card.style.left = D.inset + 'px'; card.style.top = D.inset + 'px'; card.style.width = Math.max(0, ctx.size.width - D.inset * 2) + 'px';
      // Keep the site's floating episode-end control below the workspace.
      card.style.height = Math.max(D.minHeight, ctx.size.height - D.bottomInset) + 'px';
      return card;
    };

    BASE.top = (ctx, card) => {
      const { st, D, P } = S;
      const { s, el, colleagues, otherProjects } = st;
      const top = el('div', 'dv-top', card); P.icon(el('span', 'dv-logo', top), 'code');
      el('span', 'dv-brand', top, D.brand);
      const project = el('button', 'dv-toolbtn dv-project', top, `${s.project} / platform`); project.type = 'button'; P.icon(project, 'chevron');
      project.onclick = () => P.peek('Switch project', otherProjects.map((name,i) => [name, `${i + 2} open reviews / updated today`, 'folder']));
      const globalSearch = el('button', 'dv-global-search', top); globalSearch.type = 'button'; P.icon(globalSearch, 'search'); el('span', '', globalSearch, 'Search workspace'); el('kbd', '', globalSearch, '/');
      globalSearch.onclick = () => P.peek('Recent workspace items', [[`Pipeline #${s.runId}`, 'fix/session-guard / failed jobs', 'pipeline'], ['Release readiness', 'Issue / assigned to your team', 'inbox'], ['SDK configuration', 'Environment / last edited today', 'sliders']]);
      el('span', 'dv-spacer', top);
      const notify = P.iconButton(top, 'bell', 'Notifications'); el('i', 'dv-notification-dot', notify);
      notify.onclick = () => P.peek('Notifications', [[`${colleagues[0]} requested a review`, 'delivery-gateway / 8 minutes ago', 'review'], ['Nightly integration suite failed', 'metrics-collector / 23 minutes ago', 'error'], ['Access token expires in 7 days', 'Workspace security', 'lock']]);
      const help = P.iconButton(top, 'help', 'Workspace help'); help.onclick = () => P.peek('Workspace resources', [['Project documentation', 'Runbooks, ownership and deployment guides', 'file'], ['Keyboard shortcuts', 'Use Tab to move between controls', 'code']]);
      el('span', 'dv-avatar', top, P.initials(s.author));
    };

    BASE.sidebar = (ctx, sidebar) => {
      const { st, D, P } = S;
      const { s, v, el, otherProjects } = st;
      const sideProject = el('div', 'dv-side-project', sidebar); el('span', 'dv-avatar', sideProject, 'PL'); const sideName = el('div', 'dv-side-name', sideProject, 'Platform'); el('small', '', sideName, 'Private project');
      P.sideLabel(sidebar, 'Workspace');
      for (const [text, glyph, count] of [['Overview','grid',''], ['Issues','inbox','23'], ['Pull requests','review','7'], ['Pipelines','pipeline','4'], ['Logs','logs',''], ['Database','database',''], ['Flags','sliders','']]) P.sideItem(sidebar, text,glyph,count,text===D.active[v]);
      P.sideLabel(sidebar, v==='dbrow' ? 'public schema' : v==='prcomment' ? 'Repository files' : v==='logs' ? 'Saved views' : 'Pinned');
      const contextual = v==='dbrow' ? [['accounts','table',String(s.items.length)],['audit_events','table','894'],['sessions','table','412'],['api_keys','table','18']]
        : v==='prcomment' ? [['src / session','folder',''],['resolve.ts','file','M'],['schema.ts','file',''],['tests / unit','folder','']]
        : v==='logs' ? [['Production errors','logs',''],['Slow requests','clock',''],['Worker retries','refresh','']]
        : [['Environments','cloud','3'],['Releases','package','12'],['Settings','settings','']];
      for(const [text,glyph,count] of contextual) P.sideItem(sidebar, text,glyph,count,v==='dbrow' && text==='accounts');
      P.sideLabel(sidebar, 'Other projects'); for(const name of otherProjects.slice(0,2)) P.sideItem(sidebar, name,'folder','');
      const sideBottom = el('div','dv-side-bottom',sidebar); P.icon(sideBottom,'check'); el('span','',sideBottom,'All systems operational');
    };

    BASE.tabs = (ctx, work) => {
      const { st, D, P } = S;
      const { s, v, el, colleagues } = st;
      const tabs = el('nav', 'dv-tabs', work);
      const tabsets = D.tabs;
      for (const [i,tab] of tabsets[v].entries()) { const b = el('button', `dv-tab${i === (v==='prcomment'?3:0) ? ' active' : ''}`, tabs, tab); b.type = 'button';
        if(v==='prcomment') el('small','',b,[6,3,12,1][i]);
        b.onclick = () => { if(i === (v==='prcomment'?3:0)) return; P.peek(tab, [[v==='prcomment'?'Review activity':tab, `Project platform / commit ${s.revision}`, 'file'], [`${colleagues[0]} updated this project`, 'Earlier today', 'clock']]); }; }
    };

    BASE.layout = (ctx, card) => {
      const { st, P } = S;
      const { el } = st;
      const shell = el('div', 'dv-shell', card);
      const sidebar = el('aside', 'dv-sidebar', shell);
      P.sidebar(ctx, sidebar);
      const work = el('div', 'dv-work', shell);
      P.tabs(ctx, work);
      const badge = P.heading(ctx, work);
      const query = P.tools(ctx, work);
      const content = el('div', 'dv-content', work);
      const main = el('div', 'dv-main', content);
      return { shell, sidebar, work, badge, query, content, main };
    };

    BASE.heading = (ctx, work) => {
      const { st, D } = S;
      const { s, v, el } = st;
      const heading = el('div', 'dv-heading', work); const title = el('div', 'dv-title', heading);
      el('h2', '', title, v === 'prcomment' ? `Guard session resolution #${s.runId}` : v === 'rerun' ? `Release pipeline #${s.runId}` : D.titles[v]);
      el('p', '', title, v === 'prcomment' ? `${s.author} wants to merge fix/session-guard into main · +${s.items.filter(x => x.added).length} -0`
        : v === 'rerun' ? `fix/session-guard · ${s.revision} · triggered by ${s.author}` : v === 'dbrow' ? 'workspace_db / public / accounts · Primary database'
        : v === 'logs' ? 'Live events · Last 15 minutes · UTC' : 'platform / SDK configuration · Changes apply to the selected scope');
      const badge = el('span', 'dv-badge', heading, v === 'prcomment' ? 'Open' : v === 'rerun' ? 'Failed' : v === 'dbrow' ? 'Read / write' : 'Connected');
      return badge;
    };

    BASE.tools = (ctx, work) => {
      const { st, P } = S;
      const { s, v, el, refs } = st;
      const tools = el('div', 'dv-tools', work);
      const query = el('input', 'dv-input dv-search', tools); refs.query = query; query.type = 'text'; query.autocomplete = 'off'; query.spellcheck = false;
      query.placeholder = v === 'prcomment' ? 'Find in diff' : v === 'logs' ? 'Search log messages…' : v === 'dbrow' ? 'Filter records by ID or customer…' : 'Search by name…';
      query.setAttribute('aria-label', 'Search'); query.oninput = () => P.change('query', query.value);
      if (v === 'prcomment') { query.style.display = 'none'; el('span', 'dv-mono', tools, s.file); el('span', 'dv-spacer', tools); el('small', 'dv-muted', tools, 'Unified diff · 1 file changed'); }
      else { el('span', 'dv-spacer', tools); el('small', 'dv-muted', tools, v === 'logs' ? 'Auto-refresh paused' : `${s.items.length} ${v === 'dbrow' ? 'records' : v === 'flag' ? 'flags' : 'jobs'}`); }
      for(const [label,glyph] of (v==='prcomment' ? [['Diff options','sliders']] : v==='dbrow' ? [['Filter','filter'],['Columns','table']] : v==='logs' ? [['Last 15m','clock']] : v==='flag' ? [['Tags','tag']] : [['Variables','sliders']])) {
        const b=el('button','dv-toolbtn dv-optional',tools,label); b.type='button'; P.icon(b,glyph); b.onclick=()=>P.peek(label, v==='dbrow' ? [['id','varchar / primary key','key'],['customer','text / not null','table'],['quota_limit','int4 / not null','table']] : [['Project defaults','Inherited from platform settings','settings'],['Current scope',v==='logs'?'Live index / last 15 minutes':'fix/session-guard','branch']]);
      }
      return query;
    };
  }

  function installSource(BASE, S) {
    BASE.context = (ctx, main) => {
      const { st, P } = S;
      const { s, v, el, refs } = st;
      if(v==='prcomment') { const context=el('div','dv-context',main); P.icon(context,'branch'); el('strong','',context,'fix/session-guard'); el('span','',context,'into'); el('strong','',context,'main'); el('span','dv-spacer',context); el('span','dv-mono',context,s.revision); P.icon(context,'lock'); }
      if(v==='dbrow') { const context=el('div','dv-context',main); P.icon(context,'database'); el('strong','',context,'public.accounts'); el('span','',context,'Primary key: id'); el('span','dv-spacer',context); el('span','',context,'RLS enabled'); }
      if(v==='flag') { const context=el('div','dv-context',main); P.icon(context,'cloud'); refs.scopeContext=el('strong','',context); el('span','dv-spacer',context); el('span','',context,'SDK status: connected'); }
    };

    BASE.graph = (ctx, main) => {
      const { st, P } = S;
      const { s, v, el, graphNodes, graphJobs } = st;
      if (v === 'rerun') {
        const graph = el('div', 'dv-graph', main);
        for (const [i, name] of ['Validate', 'Test', 'Release'].entries()) {
          if (i) el('div', 'dv-edge', graph);
          const node=el('div','dv-stage',graph); const head=el('div','dv-stage-head',node); const mark=el('span','',head); el('span','',head,name); const info=el('small','',head); graphNodes[name]={node,mark,info};
          const jobs=s.items.filter(x=>x.stage===name);
          for(const job of jobs.slice(0,2)) { const b=el('button','dv-jobnode',node); b.type='button'; const mark=el('span','',b); el('span','',b,job.label); b.title=job.label; b.onclick=()=>P.change('row',job.id); graphJobs[job.id]={b,mark}; }
          el('span','dv-stage-more',node,jobs.length>2?`+${jobs.length-2} more jobs`:'All jobs shown');
        }
      }
    };

    BASE.histogram = (ctx, main) => {
      const { st } = S;
      const { s, v, el, refs } = st;
      if(v==='logs') {
        const histogram=el('div','dv-histogram',main); const label=el('div','dv-chart-label',histogram,'Events'); refs.chartCount=el('strong','',label,String(s.items.length));
        const chart=el('div','dv-chart',histogram); chart.setAttribute('aria-label','Log volume over the last 15 minutes');
        refs.bars=Array.from({length:30},()=>el('span','dv-bar',chart));
        const axis=el('div','dv-chart-axis',chart); for(const t of ['14:15','14:20','14:25','14:30']) el('span','',axis,t);
      }
    };

    BASE.facets = (ctx, main) => {
      const { st, P } = S;
      const { v, el } = st;
      if (v === 'logs') {
        const facets = el('div', 'dv-facets', main);
        for (const [name, values] of [['service', ['All', 'edge-api', 'billing-worker', 'session-cache']], ['severity', ['All', 'INFO', 'WARN', 'ERROR']]]) {
          const line = el('div', 'dv-facet', facets); el('label', '', line, name === 'service' ? 'Service' : 'Severity');
          for (const val of values) P.chip(line, name, val);
        }
      }
    };

    BASE.columnHead = (ctx, main) => {
      const { st } = S;
      const { s, v, el } = st;
      const ch = el('div', 'dv-columnhead', main);
      if (v === 'dbrow') { for (const [name,type] of [['id','varchar / PK'], ['customer','text'], ['region','text'], ['quota_limit','int4']]) {const cell=el('span','',ch,name); el('small','dv-db-type',cell,` ${type}`);} el('span','dv-extra-col',ch,'Status / updated'); }
      else ch.textContent = v === 'prcomment' ? `@@ -34,${s.items.filter(x => !x.added).length} +34,${s.items.length} @@ resolveSession` : v === 'rerun' ? 'Jobs · Latest attempt' : v === 'logs' ? 'Timestamp / Level / Event' : 'Flag key / description';
      if(v==='logs'){ch.classList.add('dv-loghead');ch.replaceChildren();for(const text of ['Timestamp','Level','Event / service'])el('span','',ch,text);}
    };

    BASE.row = (ctx, pane, item) => {
      const { st, P } = S;
      const { v, el, rows } = st;
      const row = el('button', `dv-row${item.added ? ' added' : ''}`, pane); row.type = 'button'; row.setAttribute('aria-label', v === 'prcomment' ? `Comment on line ${item.id}` : item.label);
      const rec = { row }; rows[item.id] = rec;
      row.onclick = () => P.change('row', item.id);
      P.rowContent(ctx, row, item, rec);
      P.rowDecorated(ctx, row, item, rec);
      return rec;
    };

    BASE.rowContent = (ctx, row, item, rec) => {
      const { st, P } = S;
      const { v, el } = st;
      if (v === 'prcomment') { el('span','dv-oldnum dv-mono',row,item.added?'':item.id); el('span', 'dv-number dv-mono', row, item.id); rec.mark = el('span', 'dv-dot', row, item.added ? '+' : ' '); const code=el('span', 'dv-code dv-mono', row); P.syntax(code,item.code); }
      if (v === 'rerun') { row.style.gridTemplateColumns = '18px minmax(0,1fr) 62px 30px'; rec.icon = el('span', '', row); el('span', 'dv-mono', row, item.label); rec.status = el('span', 'dv-status dv-muted', row); el('small', '', row, item.duration); }
      if (v === 'logs') { el('span', 'dv-mono dv-muted', row, item.time.slice(0, 8)); el('span', `dv-level ${item.severity.toLowerCase()}`, row, item.severity); const msg = el('span', 'dv-logmsg', row); el('span', 'dv-mono', msg, item.message); el('small', '', msg, `${item.service} / prod / worker-${String(Number(item.id.slice(1))%4+1).padStart(2,'0')}`); }
      if (v === 'dbrow') { el('span', 'dv-mono', row, item.id); const customer = el('span', '', row, item.customer); customer.title = item.customer; const region=el('span','dv-logmsg dv-muted',row); el('span','',region,item.region); el('small','',region,item.state); rec.quota = el('span', 'dv-mono', row); const extra=el('span','dv-extra-col dv-logmsg',row); el('span','',extra,item.state); el('small','',extra,'Today, 14:18'); }
      if (v === 'flag') { const desc = el('span', 'dv-logmsg', row); el('span', 'dv-mono', desc, item.label); el('small', '', desc, item.description); el('span','dv-extra-col dv-muted',row,item.owner); rec.state = el('span', 'dv-badge', row); }
    };

    BASE.rowDecorated = (ctx, row, item, rec) => {};

    BASE.list = (ctx, main) => {
      const { st, P } = S;
      const { s, v, el, refs, F } = st;
      const pane = el('div', 'dv-pane', main); refs.pane = pane;
      for (const item of s.items) P.row(ctx, pane, item);
      if(v==='prcomment') el('div','dv-file-end',pane,`End of diff / ${s.file} / UTF-8 / TypeScript`);
      const empty = el('div', 'dv-empty', pane); P.icon(empty,v==='logs'?'logs':'search'); el('strong','',empty,`No matching ${v==='logs'?'events':v==='dbrow'?'records':v==='flag'?'flags':'jobs'}`); el('small','',empty,'Try a broader query or remove a filter.');
      const clear=el('button','dv-btn',empty,'Clear filters'); clear.type='button'; clear.onclick=()=>{ctx.update(F.helpers.act(F.helpers.act(F.helpers.act(ctx.model,s,'query',''),s,'service','All'),s,'severity','All'));P.paint(ctx.model);};
      return { pane, empty };
    };

    BASE.detail = (ctx, content) => {
      const { st } = S;
      const { el } = st;
      const detail = el('aside', 'dv-detail', content);
      const dh = el('h3', '', detail, 'Select an item');
      const meta = el('p', 'dv-muted', detail);
      return { detail, dh, meta };
    };
  }

  function installControls(BASE, S) {
    BASE.controlsPrcomment = (ctx, detail) => {
      const { st, P } = S;
      const { s, el, refs } = st;
      let draft, savedComment, approve, prepare, run, confirmBox, save, toggle, toggleValue;
      const selectionOnly = st.selectionOnly;
      const lab = el('label', '', detail, 'Line comment · Markdown supported'); draft = el('textarea', 'dv-input', detail); draft.setAttribute('aria-label', 'Line comment'); draft.placeholder = 'Leave feedback on this line…';
      const add = P.button(detail, 'comment', 'Add / update comment', true); savedComment = el('p', 'dv-mono', detail);
      el('hr', 'dv-divider', detail); approve = P.button(detail, 'approve', 'Approve review', true);
      P.button(detail, 'merge', 'Merge pull request'); selectionOnly.push(lab, draft, add, savedComment);
      return { draft, savedComment, approve, prepare, run, confirmBox, save, toggle, toggleValue };
    };

    BASE.controlsRerun = (ctx, detail) => {
      const { st, P } = S;
      const { s, el, refs } = st;
      let draft, savedComment, approve, prepare, run, confirmBox, save, toggle, toggleValue;
      const selectionOnly = st.selectionOnly;
      const log = el('div', 'dv-terminal', detail, '$ runner execute --ci\nProcess exited with code 1.\nSee job output for details.'); log.style.whiteSpace = 'pre-wrap'; refs.jobOutput = log;
      prepare = P.button(detail, 'prepare', 'Re-run job', true);
      confirmBox = el('div', 'dv-confirm', detail); el('p', '', confirmBox, 'A new attempt will use the same commit and pipeline variables.');
      run = P.button(confirmBox, 'run', 'Run job', true); selectionOnly.push(log, prepare);
      return { draft, savedComment, approve, prepare, run, confirmBox, save, toggle, toggleValue };
    };

    BASE.controlsLogs = (ctx, detail) => {
      const { st } = S;
      const { s, el, refs } = st;
      let draft, savedComment, approve, prepare, run, confirmBox, save, toggle, toggleValue;
      const selectionOnly = st.selectionOnly;
      el('label', '', detail, 'Event attributes'); const attrs = el('div', 'dv-terminal', detail); attrs.style.whiteSpace = 'pre-wrap'; refs.attrs = attrs;
      el('p', 'dv-muted', detail, 'Request identifiers correlate events across services. Indexed attributes are available below.');
      return { draft, savedComment, approve, prepare, run, confirmBox, save, toggle, toggleValue };
    };

    BASE.controlsDbrow = (ctx, detail) => {
      const { st, P } = S;
      const { s, el, refs } = st;
      let draft, savedComment, approve, prepare, run, confirmBox, save, toggle, toggleValue;
      const selectionOnly = st.selectionOnly;
      const lab = el('label', '', detail, 'quota_limit · int4'); draft = el('input', 'dv-input', detail); draft.type = 'text'; draft.inputMode = 'numeric'; draft.setAttribute('aria-label', 'quota_limit');
      el('p', 'dv-muted', detail, 'Maximum requests per billing period. Changes remain a draft until saved.');
      save = P.button(detail, 'save', 'Save record', true); const revert = el('button', 'dv-btn', detail, 'Discard draft'); revert.type = 'button'; revert.onclick = () => P.change('row', ctx.model.selected);
      selectionOnly.push(lab, draft, save, revert);
      return { draft, savedComment, approve, prepare, run, confirmBox, save, toggle, toggleValue };
    };

    BASE.controlsFlag = (ctx, detail) => {
      const { st, P } = S;
      const { s, el, refs } = st;
      let draft, savedComment, approve, prepare, run, confirmBox, save, toggle, toggleValue;
      const selectionOnly = st.selectionOnly;
      el('label', '', detail, 'Environment'); const scopes = el('div', 'dv-scope', detail); for (const e of s.environments) P.chip(scopes, 'environment', e);
      el('label', '', detail, 'Audience segment'); const segments = el('div', 'dv-scope', detail); for (const g of s.segments) P.chip(segments, 'segment', g);
      const rule = el('div', 'dv-rule', detail); toggleValue = el('span', '', rule); toggle = P.button(rule, 'toggle', ''); toggle.className = 'dv-switch'; toggle.setAttribute('role', 'switch'); toggle.setAttribute('aria-label', 'Feature enabled');
      prepare = P.button(detail, 'prepare', 'Prepare deployment', true); run = P.button(detail, 'run', 'Deploy to Production', true);
      selectionOnly.push(rule);
      return { draft, savedComment, approve, prepare, run, confirmBox, save, toggle, toggleValue };
    };

    BASE.controls = (ctx, detail) => {
      const { st, P } = S;
      const { v } = st;
      return P['controls' + v[0].toUpperCase() + v.slice(1)](ctx, detail);
    };

    BASE.facts = (ctx, detail) => {
      const { st } = S;
      const { el } = st;
      return el('div', 'dv-facts', detail);
    };

    BASE.detailExtra = (ctx, detail) => {
      const { st, P } = S;
      const { s, v, el, refs, colleagues } = st;
      const extra=el('div','dv-detail-section',detail); refs.extra=extra;
      if(v==='prcomment') {
        el('h4','',extra,'Reviewers'); for(const [i,name] of colleagues.slice(0,2).entries()){ const line=el('div','dv-person-line',extra);el('span','dv-avatar',line,P.initials(name));el('span','',line,name);el('small','',line,i?'Code owner':'Requested'); }
        const checks=el('div','dv-meta-line',extra);el('span','',checks,'Required checks');el('strong','dv-success',checks,'12 checks passed');
        const history=el('div','dv-timeline',extra);el('p','',history,`${s.author} pushed commit ${s.revision}`);el('p','',history,`${colleagues[0]} requested a review / 18 minutes ago`);
      }
      if(v==='rerun') {el('h4','',extra,'Runner & artifacts');for(const [key,value] of [['Executor','Linux / container'],['Runner','pool-shared-02'],['Image','runtime:22-slim'],['Retry policy','Manual'],['Artifacts','test-results.xml / 24 KB']])P.metaLine(extra,key,value);}
      if(v==='logs') {el('h4','',extra,'Trace context'); refs.logContext=el('div','',extra);el('h4','',extra,'Indexed fields');for(const [key,value]of [['env','production'],['source','application'],['cluster','core-eu-01'],['retention','15 days']])P.metaLine(extra,key,value);}
      if(v==='dbrow') {el('h4','',extra,'Record metadata');refs.recordMeta=el('div','',extra);el('h4','',extra,'SQL preview');refs.sql=el('div','dv-terminal',extra);}
      if(v==='flag') {el('h4','',extra,'Targeting rules');refs.rules=el('div','',extra);el('h4','',extra,'Recent changes');const history=el('div','dv-timeline',extra);el('p','',history,`${colleagues[0]} updated rollout rules`);el('p','',history,'SDK configuration published / 23 minutes ago');el('p','',history,'No scheduled changes');}
    };

    BASE.footer = (ctx, work) => {
      const { st } = S;
      const { s, el } = st;
      const foot = el('div', 'dv-foot', work); const footCount = el('span', '', foot); el('span', 'dv-spacer', foot); const footStatus = el('span', '', foot, 'All changes synced');
      el('span', 'dv-mono', foot, s.revision);
      return { footCount, footStatus };
    };
  }

  function installElements(BASE, S) {
    BASE.initials = (name) => {
      return name.split(' ').map(x=>x[0]).slice(0,2).join('');
    };

    BASE.icon = (parent,name) => {
      const { st } = S;
      const { U } = st;
      const paths={code:['m8 7-5 5 5 5','m16 7 5 5-5 5','m14 4-4 16'],chevron:['m7 10 5 5 5-5'],search:['M20 20l-5-5','M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0'],bell:['M6 8a6 6 0 0 1 12 0v6l2 3H4l2-3Z','M10 21h4'],help:['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20','M9 8a3 3 0 0 1 6 0c0 3-3 2-3 5','M12 17h.01'],folder:['M3 6h6l2 2h10v12H3Z'],file:['M5 2h9l5 5v15H5Z','M14 2v6h5','M8 12h8','M8 16h6'],branch:['M6 3v13a4 4 0 0 0 4 4h3a5 5 0 0 0 5-5V9','M3 6h6','M15 6h6'],review:['M7 4h13v13H7Z','M3 8v13h13','m11 10 2 2 4-4'],pipeline:['M3 4h6v6H3Z','M15 14h6v6h-6Z','M9 7h9v7'],logs:['M4 3h16v18H4Z','M8 7h8','M8 11h5','M8 15h8'],database:['M3 6c0-5 18-5 18 0s-18 5-18 0','M3 6v12c0 5 18 5 18 0V6','M3 12c0 5 18 5 18 0'],table:['M3 4h18v16H3Z','M3 10h18','M9 4v16'],sliders:['M4 6h16','M4 12h16','M4 18h16','M8 3v6','M16 9v6','M10 15v6'],grid:['M3 3h7v7H3Z','M14 3h7v7h-7Z','M3 14h7v7H3Z','M14 14h7v7h-7Z'],inbox:['M3 4h18v16H3Z','M3 13h5l2 3h4l2-3h5'],cloud:['M6 19a5 5 0 0 1-1-10 7 7 0 0 1 13-2 6 6 0 0 1 0 12Z'],package:['m3 6 9-4 9 4v12l-9 4-9-4Z','m3 6 9 5 9-5','M12 11v11'],settings:['M4 7h16','M4 17h16','M8 3v8','M16 13v8'],clock:['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20','M12 6v6l4 2'],refresh:['M20 7a9 9 0 1 0 1 9','M20 2v6h-6'],check:['m5 12 4 4L19 6'],error:['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20','M12 7v6','M12 17h.01'],lock:['M5 10h14v11H5Z','M8 10V6a4 4 0 0 1 8 0v4'],filter:['M3 4h18l-7 8v7l-4 2v-9Z'],tag:['M3 3h8l10 10-8 8L3 11Z','M7 7h.01'],key:['M14 10a5 5 0 1 0-4 4','m10 10 10 10','m17 17 3-3'],close:['m6 6 12 12','M6 18 18 6'],comment:['M3 3h18v14H9l-6 5Z','M7 7h10','M7 11h7']};
      const svg=U.svg('svg',{viewBox:'0 0 24 24',class:'dv-icon','aria-hidden':'true'},parent); for(const d of paths[name]||paths.file)U.svg('path',{d},svg);return svg;
    };

    BASE.mark = (parent,name) => {
      const { P } = S;
      parent.replaceChildren();P.icon(parent,name);
    };

    BASE.iconButton = (parent,glyph,label) => {
      const { st, P } = S;
      const { el } = st;
      const b=el('button','dv-iconbtn',parent);b.type='button';b.title=label;b.setAttribute('aria-label',label);P.icon(b,glyph);return b;
    };

    BASE.sideLabel = (sidebar, text) => {
      const { st } = S;
      const { el } = st;
      el('div','dv-side-label',sidebar,text);
    };

    BASE.sideItem = (sidebar, text,glyph,count,active) => {
      const { st, P } = S;
      const { el, colleagues } = st;
      const b=el('button',`dv-side-item${active?' active':''}`,sidebar);b.type='button';b.title=text;P.icon(b,glyph);el('span','dv-name',b,text);if(count)el('span','dv-side-count',b,count);b.onclick=()=>{if(active)return;P.peek(text,[[text,'Project platform / current workspace',glyph],['Recent activity',`${colleagues[1]} updated this section today`,'clock']]);};
    };

    BASE.metaLine = (parent,key,value) => {
      const { st } = S;
      const { el } = st;
      const line=el('div','dv-meta-line',parent);el('span','',line,key);el('strong','',line,value);
    };

    BASE.syntax = (parent,text) => {
      const { st } = S;
      const { el } = st;
      for(const token of String(text).split(/("[^"]*"|\b(?:export|async|function|const|await|if|return)\b)/)){el('span',/^"/.test(token)?'dv-token-string':/^(export|async|function|const|await|if|return)$/.test(token)?'dv-token-key':'',parent,token);}
    };

    BASE.peek = (title,items) => {
      const { st, P } = S;
      const { card, el } = st;
      let pop=card.querySelector('.dv-pop');if(pop)pop.remove();pop=el('aside','dv-pop',card);const head=el('div','dv-pop-head',pop,title);const close=P.iconButton(head,'close','Close panel');close.onclick=()=>pop.remove();for(const [title,sub,glyph]of items){const line=el('div','dv-pop-row',pop);P.icon(line,glyph);const text=el('div','',line,title);el('small','',text,sub);}
    };

    BASE.chip = (parent, name, val) => {
      const { st, P } = S;
      const { el, refs } = st;
      const b = el('button', 'dv-chip', parent, val); b.type = 'button'; refs[`${name}:${val}`] = b;
      b.onclick = () => P.change(name, val); return b;
    };

    BASE.button = (parent, action, text, primary) => {
      const { st, P } = S;
      const { ctx, s, v, el, refs } = st;
      const b = el('button', `dv-btn${primary ? ' primary' : ''}`, parent, text); b.type = 'button'; refs[`action:${action}`] = b;
      b.onclick = () => {
        if (action === 'merge' || (s.judge && s.judge.mode === 'confirm' && ((v === 'rerun' || v === 'flag') && action === 'run'))) {
          ctx.flag('irreversible'); return;
        }
        P.change(action);
      }; return b;
    };

    BASE.change = (action, val) => {
      const { st, P } = S;
      const { ctx, F, s } = st;
      ctx.update(F.helpers.act(ctx.model, s, action, val)); P.paint(ctx.model);
    };
  }

  function installState(BASE, S) {
    BASE.visible = () => {
      const { st } = S;
      const { ctx, s, pane, rows, detail, refs, query } = st;
      const r = pane.getBoundingClientRect();
      const ids = s.items.filter(x => { const row = rows[x.id].row; const b = row.getBoundingClientRect(); return row.style.display !== 'none' && b.top >= r.top - 1 && b.bottom <= r.bottom + 1; }).map(x => x.id);
      const m = ctx.model;
      const dr = detail.getBoundingClientRect();
      const controlDirections = {};
      for (const [key, e] of Object.entries(refs)) {
        if (!e || typeof e.getClientRects !== 'function' || e === pane || e === query || !e.getClientRects().length || !detail.contains(e)) continue;
        const b = e.getBoundingClientRect();
        if (b.top < dr.top + 2) controlDirections[key] = -1;
        else if (b.bottom > dr.bottom - 2) controlDirections[key] = 1;
      }
      if (JSON.stringify(controlDirections) !== JSON.stringify(m.controlDirections) || JSON.stringify(ids) !== JSON.stringify(m.visible) || Math.abs(m.scrollTop - pane.scrollTop) > 1 || Math.abs(m.paneHeight - pane.clientHeight) > 1)
        ctx.update({ ...m, visible: ids, scrollTop: pane.scrollTop, paneHeight: pane.clientHeight, controlDirections });
    };

    BASE.paint = (m) => {
      const { st, P } = S;
      const { ctx, s, F, v, el, refs, rows, query, empty, dh, meta, selectionOnly, draft, savedComment, approve, badge, graphNodes, graphJobs, confirmBox, prepare, run, save, detail, toggle, toggleValue, factsBox, footCount, footStatus } = st;
      const list = F.helpers.filtered(m, s); const show = new Set(list.map(x => x.id));
      if (query.value !== m.query) query.value = m.query;
      for (const item of s.items) {
        const r = rows[item.id]; r.row.style.display = show.has(item.id) ? '' : 'none'; r.row.classList.toggle('selected', m.selected === item.id);
        if (r.quota) r.quota.textContent = m.values[item.id];
        if (r.status) { r.status.textContent = m.attempts[item.id] ? 'Queued' : item.status; P.mark(r.icon,m.attempts[item.id]?'clock':item.status==='Passed'?'check':'error'); r.icon.className=m.attempts[item.id]?'dv-warning':item.status==='Passed'?'dv-success':'dv-error'; r.status.classList.toggle('failed',!m.attempts[item.id]&&item.status==='Failed'); }
        if (r.state) {const on=m.values[F.helpers.flagKey(item.id,m.environment,m.segment)];r.state.textContent=on?'On':'Off';r.state.classList.toggle('good',on);}
        if(r.mark){if(m.comments[item.id])P.mark(r.mark,'comment');else r.mark.textContent=item.added?'+':'';}
      }
      empty.style.display = list.length ? 'none' : '';
      const item = s.items.find(x => x.id === m.selected);
      dh.textContent = item ? (v === 'prcomment' ? `Review · Line ${item.id}` : item.label) : v === 'prcomment' ? 'Review changes' : 'Select an item';
      meta.textContent = item ? v === 'dbrow' ? `${item.state} · ${item.region}` : v === 'rerun' ? `${item.stage} · ${item.duration} · ${item.owner}`
        : v === 'logs' ? `${item.time} UTC / Marked for investigation` : v === 'flag' ? `Maintainer: ${item.owner}` : s.file : 'Choose a row in the left pane to inspect it.';
      for (const e of selectionOnly) e.style.display = item ? '' : 'none';
      if (draft && draft.value !== m.draft) draft.value = m.draft;
      if (savedComment) savedComment.textContent = item && m.comments[item.id] ? `Posted: ${m.comments[item.id]}` : '';
      if (approve) { approve.textContent = m.approved ? 'Approved / Undo' : 'Approve review'; badge.textContent = m.approved ? 'Approved' : 'Open'; badge.classList.toggle('good', m.approved); }
      if (v === 'rerun') {
        for (const [name, rec] of Object.entries(graphNodes)) {
          const jobs = s.items.filter(x => x.stage === name);
          const queued = jobs.filter(x => m.attempts[x.id]).length;
          const failed = jobs.filter(x => !m.attempts[x.id] && x.status === 'Failed').length;
          P.mark(rec.mark,queued?'clock':failed?'error':'check'); rec.mark.className=queued?'dv-warning':failed?'dv-error':'dv-success';
          rec.info.textContent = `${jobs.length} jobs`;
          for(const job of jobs){const rec=graphJobs[job.id];if(!rec)continue;const queued=m.attempts[job.id];P.mark(rec.mark,queued?'clock':job.status==='Passed'?'check':'error');rec.mark.className=queued?'dv-warning':job.status==='Passed'?'dv-success':'dv-error';rec.b.classList.toggle('failed',!queued&&job.status==='Failed');}
        }
        refs.jobOutput.textContent = item && item.status==='Passed' && !m.attempts[item.id] ? `14:21:03 Preparing container executor\n14:21:04 Checking out ${s.revision}\n14:21:06 $ task run ${item.label}\n14:21:08 Job succeeded\nArtifacts uploaded: test-results.xml` : item && m.attempts[item.id] ? `[queued] Waiting for pool-shared-02\ncommit ${s.revision}\nVariables and artifacts retained.\nNo runner assigned yet.` : `14:21:03 Preparing container executor\n14:21:04 Checking out ${s.revision}\n14:21:06 $ task run ${item ? item.label : 'job'}\n14:21:08 ERROR: process exited with code 1\nArtifacts uploaded: test-results.xml`;
        confirmBox.style.display = item && m.prepared ? '' : 'none'; prepare.textContent = m.prepared ? 'Cancel retry' : 'Re-run job'; run.disabled = !item; }
      if(v==='logs'){
        const buckets=Array(30).fill(0);for(const event of list){const [h,min,sec]=event.time.split(':').map(Number);const index=Math.min(29,Math.max(0,Math.floor(((min-15)*60+sec)/30)));buckets[index]++;}
        const peak=Math.max(1,...buckets);refs.bars.forEach((bar,i)=>{bar.style.height=`${buckets[i]/peak*85}%`;bar.title=`${buckets[i]} events`;});
        refs.chartCount.textContent=String(list.length);refs.logContext.replaceChildren();P.metaLine(refs.logContext,'Trace',item?`trace-${item.requestId.slice(4,12)}`:'No event selected');P.metaLine(refs.logContext,'Host',item?`worker-${Number(item.id.slice(1))%4+1}`:'-');}
      if (v === 'logs') refs.attrs.textContent = item ? `service: ${item.service}\nseverity: ${item.severity}\nmessage: ${item.message}\nrequest_id:\n${item.requestId}` : 'No entry selected';
      if(v==='dbrow') {
        save.disabled=!item||!/^\d+$/.test(m.draft); refs.recordMeta.replaceChildren();
        for(const [key,value]of [['id',item?item.id:'No record selected'],['customer',item?item.customer:'-'],['status',item?item.state:'-'],['updated_by',item?item.owner:'-']])P.metaLine(refs.recordMeta,key,value);
        refs.sql.textContent=item?`UPDATE public.accounts\nSET quota_limit = ${m.draft}\nWHERE id = '${item.id}';`:'-- Select a record to inspect its fields';
        if(!refs.validation)refs.validation=el('div','dv-validation',detail);refs.validation.textContent='quota_limit must be a non-negative integer.';refs.validation.style.display=item&&!/^\d+$/.test(m.draft)?'':'none';
      }
      for (const [key, b] of Object.entries(refs)) if (/^(service|severity|environment|segment):/.test(key)) { const at = key.indexOf(':'); b.classList.toggle('on', m[key.slice(0, at)] === key.slice(at + 1)); b.setAttribute('aria-pressed', String(m[key.slice(0, at)] === key.slice(at + 1))); }
      if(v==='flag'){refs.scopeContext.textContent=`${m.environment} / ${m.segment}`;refs.rules.replaceChildren();for(const [i,segment]of s.segments.entries()){const line=el('div','dv-rule-row',refs.rules);el('b','',line,String(i+1));el('span','',line,segment);el('span','',line,item?(m.values[F.helpers.flagKey(item.id,m.environment,segment)]?'On variation':'Off variation'):'No flag selected');}}
      if (v === 'flag') { const persisted = item && m.values[F.helpers.flagKey(item.id, m.environment, m.segment)]; const on = s.judge && m.pendingEnabled !== null ? m.pendingEnabled : persisted; toggle.classList.toggle('on', !!on); toggle.setAttribute('aria-checked', String(!!on)); toggleValue.textContent = s.judge ? `Draft ${on ? 'On' : 'Off'} · Live ${persisted ? 'On' : 'Off'}` : on ? 'Serving On variation' : 'Serving Off variation';
        prepare.style.display = item && s.judge ? '' : 'none'; run.style.display = item && s.judge && m.prepared ? '' : 'none'; prepare.textContent = m.prepared ? 'Cancel deployment' : 'Prepare deployment'; toggle.disabled = !item; }
      factsBox.replaceChildren();
      for (const fact of F.facts(m, s)) { const line = el('div', 'dv-fact', factsBox); el('b', '', line, `${fact.label}: `); el('span', 'dv-mono', line, fact.value); }
      footCount.textContent = `${list.length} ${v === 'logs' ? 'events' : v === 'prcomment' ? 'lines' : 'results'} · ${item ? '1 selected' : 'No selection'}`;
      footStatus.textContent = m.saves ? 'All changes synced' : v === 'logs' ? 'Index healthy' : 'Up to date';
      P.visible();
    };

    BASE.locate = (t) => {
      const { st } = S;
      const { view } = st;
      let e;
      if (t.row !== undefined) e = view.rows[t.row] && view.rows[t.row].row;
      else if (t.pane) e = view.pane;
      else if (t.detail) e = view.detail;
      else if (t.field) e = view.refs[t.field];
      else for (const key of ['action', 'service', 'severity', 'environment', 'segment']) if (t[key] !== undefined) e = view.refs[`${key}:${t[key]}`];
      if (!e) throw new Error(`use-dev-tools/classic: missing target ${JSON.stringify(t)}`);
      return env.util.center(e);
    };

    BASE.rendered = (ctx) => {};
  }

  env.template('use-dev-tools/workspace', (design, def) => {
    let D, P;
    let st;
    const BASE = {};
    const S = {
      get ctx() { return st && st.ctx; },
      get spec() { return st && st.s; },
      get st() { return st; },
      get els() { return st; },
      get D() { return D; },
      get P() { return P; },
    };
    installChrome(BASE, S);
    installSource(BASE, S);
    installControls(BASE, S);
    installElements(BASE, S);
    installState(BASE, S);

    ({ D, P } = env.templateDesign('use-dev-tools/workspace', design, def, { tokens: TOKENS, base: BASE, state: S }));
    return {
      render(ctx) {
        st = { ctx, s: ctx.spec, U: ctx.util, F: env.taskDef, v: ctx.spec.scenario, el: ctx.util.el,
          refs: {}, rows: {}, graphNodes: {}, graphJobs: {}, selectionOnly: [] };
        P.style(ctx);
        P.begin(ctx);
        st.colleagues = P.contextData(ctx);
        st.otherProjects = D.otherProjects;
        st.card = P.frame(ctx);
        P.top(ctx, st.card);
        Object.assign(st, P.layout(ctx, st.card));
        const { main, content, work } = st;
        P.context(ctx, main);
        P.graph(ctx, main);
        P.histogram(ctx, main);
        P.facets(ctx, main);
        P.columnHead(ctx, main);
        Object.assign(st, P.list(ctx, main));
        Object.assign(st, P.detail(ctx, content));
        Object.assign(st, P.controls(ctx, st.detail));
        if (st.draft) {
          const draft = st.draft;
          st.refs.draft = draft;
          draft.spellcheck = false;
          draft.oninput = () => P.change('draft', draft.value);
        }
        st.factsBox = P.facts(ctx, st.detail);
        P.detailExtra(ctx, st.detail);
        Object.assign(st, P.footer(ctx, work));
        // Detached panes may emit a late scroll after reset; ignore their old episode.
        const episode = st;
        const visible = () => { if (st === episode) P.visible(); };
        st.pane.addEventListener('scroll', visible);
        st.detail.addEventListener('scroll', visible);
        P.paint(ctx.model);
        st.view = { refs: st.refs, rows: st.rows, pane: st.pane, detail: st.detail };
        P.rendered(ctx);
        return { anchors: [st.card], sync: (m) => P.paint(m) };
      },
      locate: (t) => P.locate(t),
    };
  });
})();
