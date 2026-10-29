/*
 * use-hr/workspace: populated HR workspace shared by pipeline, orgchart, timeoff and onboarding.
 * The scenarios share the shell, controls, drag mechanics and scrolling/oracle bookkeeping; their layouts
 * and item builders are separate parts. Defaults (design: {}) reproduce these scaffold pilots exactly:
 *   pipeline: design-use-hr-pipeline-01; orgchart: design-use-hr-orgchart-01;
 *   timeoff: design-use-hr-timeoff-01; onboarding: design-use-hr-onboarding-01.
 * No scenario presets: defaults choose each scenario's content from ctx.spec.scenario.
 * Context people, historical requests and supporting panels are read-only. Only the root is an anchor.
 * Tokens (object tokens replace the whole table):
 *   icons = ICONS: inline SVG paths by name (24x24 viewBox).
 *   titles = TITLES: pipeline 'Hiring pipeline', orgchart 'Organization chart', timeoff 'Time-off requests',
 *     onboarding 'New hire onboarding'.
 *   brand = 'peopleworks': brand wordmark; workspaceLabel = 'People workspace': top note and breadcrumb.
 *   user = 'Alex Lane': current user avatar; savedText = 'All changes saved': footer caption.
 *   currency = 'USD', locale = 'en-US': equipment money and calendar month formatting.
 *   panel = 'var(--panel)', foreground = 'var(--fg)', line = 'var(--line)', accent = 'var(--accent)',
 *     muted = 'var(--muted)', background = 'var(--bg)': structural CSS colors.
 *   font = '12px/1.4 system-ui,sans-serif', inset = '8px', radius = '9px': root font, stage inset and radius.
 *   sidebarWidth = '139px', railWidth = '184px': navigation and supporting rail widths.
 *   stageColors = ['#a58a44', '#468a75', '#a26676']: Interview, Offer and Rejected lane markers.
 *   dangerColor = '#b34646', approvedColor = '#458b69', blackoutColor = '#b96856',
 *     validationColor = '#b46c56': danger border, approved status, blackout dates and date validation.
 *   tree = { rootX: 135, rootY: 18, columnX: 15, columnGap: 220, columnY: 112, depthOffset: 10,
 *     rowGap: 83, bottom: 25, minWidth: 905, padding: 28, minHeight: 650, cardWidth: 190,
 *     cardHeight: 65, busY: 97, connectorGap: 9, gripX: 45, gripY: 28 }: org layout in pixels.
 *   tightWidth = 790, shortHeight = 490: compact class thresholds, using ctx.size.
 *   railWidthAt = 1180, timeoffRailWidthAt = 1110: show rails above these stage widths.
 * Parts: replacements are (base, S) => replacement, with the signatures below. A missing return means void.
 * S.current reads the live episode state (ctx, s, root, refs, panes, ui, offsets, extras, workspace, sidebar,
 * main, search, work, footer, geo); S.ctx/spec/root/geo/ui/refs/panes read that episode; S.D/P are resolved.
 * Parts receive ctx explicitly, retaining episode-local state even for late events from an old DOM.
 * Use P.pane and P.addRef for scroll panes/targets. Keep bindings in the event parts when changing visuals.
 * Every part calls other parts through P. Unknown tokens/parts throw through env.templateDesign.
 * Preserve all context rng draws in order; extra decoration randomness must use ctx.rng.fork(label).
 *   element(ctx, tag, cls, parent, text) -> el: create a DOM element.
 *   icon(ctx, parent, name) -> svg: inline icon from icons, falling back to file.
 *   button(ctx, parent, text, action, cls = '', glyph) -> button: text/icon control; action may be null.
 *   iconButton(ctx, parent, name, title, action) -> button: labeled icon control.
 *   avatar(ctx, parent, person) -> el: initials avatar.
 *   identity(ctx, parent, person) -> el: avatar, name and role.
 *   notice(ctx, title, lines): replace the local dismissible notice.
 *   pane(ctx, parent, id, cls = '') -> el: register a scrolling pane and mirror scroll events.
 *   mirror(ctx): mirror target scroll deltas and collapsed ancestors into model.view.
 *   update(ctx, action, rebuild = true): apply task action, then draw or update stats.
 *   stats(ctx): replace footer facts and saved indicator.
 *   drag(ctx, node, key, onDrop, onClick): pointer tracking with ghost and click/drop routing.
 *   ghost(ctx, node) -> el: cloned floating drag preview, appended to the root.
 *   panel(ctx, parent, title, glyph) -> el: titled supporting panel.
 *   line(ctx, parent, title, detail) -> el: supporting list row.
 *   empty(ctx, parent, text, glyph = 'search'): empty-state icon and caption.
 *   candidateDrawer(ctx): candidate drawer, profile and draft/activity content.
 *   draw(ctx): redraw the scenario, preserve pane offsets, then refresh stats and model.view.
 *   addRef(ctx, key, node, pane) -> node: register an oracle target.
 *   contains(ctx, node, point) -> bool: viewport hit test.
 *   money(ctx, amount) -> text: format equipment cost.
 *   match(ctx, person) -> bool: local search predicate.
 *   context(ctx) -> people[]: eight context people; keep all workspace-context fork draws in order.
 *   styles(ctx): install structural CSS with design tokens.
 *   frame(ctx) -> root: fixed anchor, with stage-dependent compact classes.
 *   brand(ctx): brand bar, notifications and current user.
 *   workspace(ctx) -> el: sidebar/main frame; stores sidebar and main in S.current.
 *   sidebar(ctx): workspace navigation, related hires/requisitions and reminder.
 *   navItem(ctx, parent, glyph, label, id): workspace navigation row and contextual notice.
 *   heading(ctx): breadcrumb, scenario title, subtitle and activity/export control.
 *   tabs(ctx): scenario tab strip and count badge.
 *   toolbar(ctx): search, location filter, expand-all and view caption; stores search.
 *   policy(ctx): visible screening/leave policy; no policy on the other scenarios.
 *   shell(ctx): compose brand, workspace, navigation, heading, controls, policy and content/footer containers.
 *   candidateCard(ctx, parent, candidate) -> card: identity, experience, skills, score and source.
 *   candidateEvents(ctx, card, candidate, lanes): register candidate and bind select/stage drop with confirm flag.
 *   lane(ctx, board, stage, lanes): stage header, scrolling body, empty state and candidate cards; sets lanes[stage].
 *   pipelineRail(ctx): hiring team, recent activity and other requisition panels.
 *   pipeline(ctx): candidate board, optional supporting rail and selected candidate drawer.
 *   candidateProfile(ctx, drawer, candidate): candidate heading, profile tabs, details and skills.
 *   rejectionEmail(ctx, drawer, candidate): draft mail and send control, preserving the irreversible confirm flag.
 *   candidateActivity(ctx, drawer, candidate): resume, timeline and prepare-rejection control.
 *   orgLayout(ctx, all) -> geometry: reporting layout, ancestors, descendant counts and canvas dimensions.
 *   orgConnectors(ctx, canvas, geo): draw elbow connectors from orgLayout geometry.
 *   orgCard(ctx, canvas, person, position, descendantCount, editable) -> card: positioned employee identity and meta.
 *   orgToggle(ctx, card, person): team collapse/expand control and target registration.
 *   orgEvents(ctx, card, person, all, count, editable): register manager/employee, collapse control, and reporting-link drag.
 *   orgRail(ctx, all, geo): directory overview, teams and recent changes.
 *   orgchart(ctx): scrolling connected chart with employee cards, result/note captions and optional rail.
 *   requestEvidence(ctx, row, request): visible dates, days, balance and team coverage evidence.
 *   requestActions(ctx, row, request): status, approve/deny controls and oracle targets.
 *   request(ctx, parent, request): request identity/note, evidence and decision controls.
 *   history(ctx, queue): recently resolved read-only requests from other teams.
 *   calendar(ctx, calendarPanel): policy-month calendar, blackout/booked days and legend.
 *   timeoffRail(ctx): availability calendar, policy details and approval history panels.
 *   timeoff(ctx): assigned request queue, resolved history and optional availability rail.
 *   hireProgress(ctx, checklist): hire identity and task completion progress.
 *   task(ctx, checklist, task, index) -> button: checkbox row and owner/status.
 *   taskEvents(ctx, button, task): checklist target registration and toggle binding.
 *   checklist(ctx, checklist): progress, completed/assigned tasks, search empty state and documents.
 *   offer(ctx, setup): accepted offer evidence and manager.
 *   equipment(ctx, setup, equipment) -> button: equipment control, details and selection.
 *   equipmentEvents(ctx, button, equipment): equipment target registration and assignment binding.
 *   dateField(ctx, setup): plain text start-date input, target, validation and non-rebuilding model update.
 *   setup(ctx, setup): offer evidence, equipment assignments, date field and account provisioning.
 *   onboarding(ctx): two scrolling panels for checklist and provisioning setup.
 *   stat(ctx, fact): one footer fact label/value.
 *   saved(ctx): saved indicator.
 *   locate(ctx, target) -> [x,y]: read-only oracle coordinates, including employee grip offset.
 *   decorated(ctx, node, item, kind): no-op decoration hook after candidate/org/request/task/equipment construction.
 *   rendered(ctx): no-op hook after first draw, before anchors are returned.
 */
(function () {
  'use strict';
  const STAGES = ['Applied', 'Interview', 'Offer', 'Rejected'];
  const TITLES = { pipeline: 'Hiring pipeline', orgchart: 'Organization chart', timeoff: 'Time-off requests', onboarding: 'New hire onboarding' };
  const ICONS = {
    people: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2m20 0v-2a4 4 0 0 0-3-3.87M15 3.13a4 4 0 0 1 0 7.75"/><circle cx="9" cy="7" r="4"/>',
    home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
    case: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12a24 24 0 0 0 18 0M10 13h4"/>',
    tree: '<rect x="8" y="2" width="8" height="5" rx="1"/><path d="M12 7v5M4 16v-4h16v4"/><rect x="1" y="16" width="7" height="6" rx="1"/><rect x="16" y="16" width="7" height="6" rx="1"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6m10-6v6M3 11h18m-13 4h2m4 0h2m-8 3h2"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    checklist: '<rect x="4" y="4" width="16" height="18" rx="2"/><path d="M9 2h6v5H9zM8 12h1m3 0h5m-9 5h1m3 0h5"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
    down: '<path d="m5 9 7 7 7-7"/>',
    bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M9 21h6"/>',
    gear: '<circle cx="12" cy="12" r="4"/><path d="m9 2-.5 3-2 1L4 5 2 9l2 2v2l-2 2 2 4 2.5-1 2 1L9 22h6l.5-3 2-1 2.5 1 2-4-2-2v-2l2-2-2-4-2.5 1-2-1L15 2Z"/>',
    chart: '<path d="M3 3v18h18M7 16v-5m5 5V7m5 9V4"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 5 10 8L22 5"/>',
    file: '<path d="M14 2H5v20h14V7Z M14 2v6h5M8 12h8m-8 4h8"/>',
    filter: '<path d="M3 5h18M6 12h12M10 19h4"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    plus: '<path d="M12 4v16M4 12h16"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    laptop: '<rect x="4" y="3" width="16" height="13" rx="1"/><path d="m4 16-3 5h22l-3-5M9 19h6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    download: '<path d="M12 2v13m-5-5 5 5 5-5M3 16v5h18v-5"/>',
    refresh: '<path d="M20 8a9 9 0 1 0 1 8M20 2v6h-6"/>',
    shield: '<path d="m12 2 9 4v6c0 6-9 10-9 10S3 18 3 12V6Z"/><path d="m8 12 3 3 5-6"/>',
  };
  const CSS = (D) => `
    .hr-app{position:absolute;inset:${D.inset};display:flex;flex-direction:column;overflow:hidden;background:${D.panel};border:1px solid ${D.line};border-radius:${D.radius};color:${D.foreground};font:${D.font};box-shadow:0 5px 18px #0000000b}
    .hr-app *{box-sizing:border-box}.hr-svg{width:16px;height:16px;flex:none;vertical-align:middle;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}
    .hr-brandbar{height:38px;flex:none;display:flex;align-items:center;gap:9px;padding:0 12px;border-bottom:1px solid ${D.line}}.hr-logo{background:${D.accent};color:white;display:grid;place-items:center;width:25px;height:25px;border-radius:6px}
    .hr-company{font-size:11px;color:${D.muted};min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.hr-brandbar strong{font-size:14px;letter-spacing:-.3px}.hr-spacer{flex:1}.hr-topnote{font-size:10px;color:${D.muted}}
    .hr-badge{border-radius:4px;padding:1px 5px;background:color-mix(in srgb,${D.accent} 10%,${D.panel});color:${D.accent};font-size:10px;white-space:nowrap}.hr-iconbtn{display:inline-flex;align-items:center;justify-content:center;gap:5px;background:none;border:0;color:${D.muted};padding:5px;cursor:pointer;border-radius:4px;font:inherit}.hr-iconbtn:hover{background:${D.background};color:${D.foreground}}
    .hr-workspace{display:flex;flex:1;min-height:0;min-width:0}.hr-sidebar{width:${D.sidebarWidth};flex:none;overflow:auto;background:${D.background};border-right:1px solid ${D.line};padding:10px 7px;font-size:11px;scrollbar-width:thin}.hr-navheading{font-size:9px;letter-spacing:.09em;color:${D.muted};font-weight:700;padding:10px 7px 5px;text-transform:uppercase}.hr-navitem{display:flex;align-items:center;gap:7px;width:100%;min-height:30px;padding:6px 8px;color:${D.muted};border:0;background:none;border-radius:5px;font:inherit;text-align:left;cursor:pointer}.hr-navitem.on{background:color-mix(in srgb,${D.accent} 10%,${D.panel});color:${D.accent};font-weight:650}.hr-navitem:hover{background:${D.panel}}.hr-navitem small{margin-left:auto;font-size:9px}.hr-navitem .hr-svg{width:15px;height:15px}.hr-sidecard{border:1px solid ${D.line};border-radius:5px;padding:8px;margin:8px 2px;color:${D.muted};font-size:10px}.hr-sidecard b{display:block;color:${D.foreground};margin-bottom:4px}.hr-sideperson{display:flex;align-items:center;gap:6px;padding:6px 4px;font-size:10px;color:${D.muted}}.hr-sideperson b{display:block;color:${D.foreground};font-size:10px}.hr-sideperson small{font-size:9px}
    .hr-main{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column;position:relative}.hr-title{padding:10px 13px 8px;flex:none;display:flex;align-items:center;gap:8px}.hr-title h2{font-size:19px;letter-spacing:-.5px;margin:1px 0 2px;line-height:1.2}.hr-title small{font-size:10px;color:${D.muted}}.hr-breadcrumb{font-size:9px;color:${D.muted};display:flex;align-items:center;gap:4px}.hr-breadcrumb .hr-svg{width:10px;height:10px}
    .hr-btn{display:inline-flex;align-items:center;justify-content:center;gap:5px;background:${D.panel};color:${D.foreground};border:1px solid ${D.line};border-radius:5px;padding:5px 8px;font:inherit;font-size:11px;cursor:pointer;white-space:nowrap}.hr-btn:hover{border-color:${D.accent}}.hr-btn.active{border-color:${D.accent};color:${D.accent};background:color-mix(in srgb,${D.accent} 7%,${D.panel})}.hr-primary{background:${D.accent};border-color:${D.accent};color:white}.hr-danger{border-color:color-mix(in srgb,${D.dangerColor} 60%,${D.line})}.hr-btn .hr-svg{width:14px;height:14px}
    .hr-toolbar{display:flex;align-items:center;gap:6px;padding:0 12px 8px;flex:none}.hr-search{display:flex;align-items:center;gap:6px;min-width:90px;max-width:250px;flex:1;border:1px solid ${D.line};border-radius:5px;padding:4px 7px;color:${D.muted};background:${D.panel}}.hr-search input{border:0;outline:0;min-width:0;width:100%;background:transparent;color:${D.foreground};font:inherit;font-size:11px;user-select:text}.hr-search input::placeholder{color:${D.muted}}.hr-viewlabel{font-size:10px;color:${D.muted};white-space:nowrap}.hr-subtabs{display:flex;gap:16px;border-bottom:1px solid ${D.line};padding:0 12px;min-height:29px;flex:none;color:${D.muted};font-size:11px}.hr-subtab{display:flex;align-items:center;gap:5px;border-bottom:2px solid transparent;padding-bottom:5px}.hr-subtab.on{border-color:${D.accent};color:${D.accent};font-weight:650}
    .hr-policy{padding:6px 9px;margin:0 12px 8px;border:1px solid color-mix(in srgb,${D.accent} 23%,${D.line});border-radius:5px;background:color-mix(in srgb,${D.accent} 5%,${D.panel});font-size:10px;line-height:1.45;flex:none}.hr-policy b{color:${D.accent}}
    .hr-work{display:flex;flex:1;min-height:0;min-width:0;gap:10px;padding:0 12px 10px;position:relative}.hr-pane{overflow:auto;min-height:0;min-width:0;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:${D.line} transparent}.hr-stats{flex:none;min-height:26px;display:flex;align-items:center;flex-wrap:wrap;gap:3px 15px;padding:5px 12px;border-top:1px solid ${D.line};background:${D.background};font-size:10px}.hr-stat{color:${D.muted}}.hr-stat strong{color:${D.foreground};margin-left:4px}.hr-save{margin-left:auto;color:${D.muted};display:flex;align-items:center;gap:4px;font-size:9px}.hr-save .hr-svg{width:12px;height:12px}
    .hr-avatar{width:27px;height:27px;flex:none;border-radius:50%;display:grid;place-items:center;background:color-mix(in srgb,${D.accent} 13%,${D.panel});color:${D.accent};font-size:10px;font-weight:700}.hr-personline{display:flex;align-items:center;gap:7px;min-width:0}.hr-persontext{min-width:0}.hr-persontext h4{margin:0;font-size:11px;line-height:1.3;overflow-wrap:anywhere}.hr-persontext small{display:block;font-size:9px;color:${D.muted};overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.hr-muted{color:${D.muted};font-size:10px}.hr-footnote{font-size:9px;color:${D.muted};margin:6px 0}.hr-tag{display:inline-flex;align-items:center;gap:4px;border-radius:4px;padding:2px 5px;font-size:9px;background:${D.background};border:1px solid ${D.line};white-space:nowrap}.hr-drag{cursor:grab;touch-action:none}.hr-card{background:${D.panel};border:1px solid ${D.line};border-radius:6px;padding:8px;position:relative}.hr-card:hover{border-color:${D.accent}}
    .hr-board{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;flex:1;min-width:0}.hr-lane{display:flex;flex-direction:column;min-height:0;min-width:0;border:1px solid ${D.line};border-radius:6px;background:${D.background}}.hr-lanehead{display:flex;align-items:center;gap:5px;padding:8px;min-height:33px;border-bottom:1px solid ${D.line};font-size:11px;font-weight:700;flex:none}.hr-lanehead small{color:${D.muted};font-size:10px;margin-left:auto}.hr-stagebar{width:3px;height:12px;border-radius:2px;background:${D.accent}}.hr-lane:nth-child(2) .hr-stagebar{background:${D.stageColors[0]}}.hr-lane:nth-child(3) .hr-stagebar{background:${D.stageColors[1]}}.hr-lane:nth-child(4) .hr-stagebar{background:${D.stageColors[2]}}.hr-lanebody{flex:1;padding:6px}.hr-candidate{margin-bottom:6px}.hr-candidate .hr-avatar{width:23px;height:23px;font-size:9px}.hr-candidate h4{font-size:11px}.hr-meta{display:flex;flex-wrap:wrap;gap:3px;margin:7px 0}.hr-chip{font-size:9px;border:1px solid ${D.line};background:${D.background};padding:1px 3px;border-radius:3px}.hr-score{display:flex;align-items:center;justify-content:space-between;gap:4px;font-size:9px;color:${D.muted}}.hr-score b{color:${D.foreground}}.hr-scorebar{height:3px;background:${D.line};border-radius:2px;margin:5px 0 6px;overflow:hidden}.hr-scorebar i{display:block;height:100%;background:${D.accent}}.hr-cardbottom{display:flex;align-items:center;justify-content:space-between;font-size:9px;color:${D.muted};border-top:1px solid ${D.line};padding-top:5px}.hr-cardbottom .hr-svg{width:11px;height:11px}.hr-empty{text-align:center;color:${D.muted};font-size:10px;padding:20px 8px;border:1px dashed ${D.line};border-radius:5px}.hr-empty .hr-svg{display:block;margin:0 auto 6px;width:22px;height:22px}
    .hr-rail{width:${D.railWidth};flex:none;display:flex;flex-direction:column;gap:10px;overflow:auto;scrollbar-width:thin}.hr-panel{border:1px solid ${D.line};border-radius:6px;padding:10px;background:${D.panel};font-size:10px}.hr-panel h3{font-size:11px;margin:0 0 8px}.hr-listline{padding:7px 0;border-bottom:1px solid ${D.line}}.hr-listline:last-child{border:0}.hr-listline b{font-size:10px;display:block;margin-bottom:2px}.hr-panelhead{display:flex;align-items:center;gap:6px;margin-bottom:8px;font-weight:700}.hr-timeline{border-left:1px solid ${D.line};margin:8px 0 0 6px;padding-left:10px}.hr-timeline p{font-size:10px;margin:0 0 10px}.hr-timeline small{display:block;color:${D.muted};font-size:9px;margin-top:2px}
    .hr-treeviewport{flex:1;position:relative;background-color:${D.background};background-image:radial-gradient(${D.line} .65px,transparent .65px);background-size:16px 16px;border:1px solid ${D.line};border-radius:6px}.hr-canvas{position:relative;min-width:100%;min-height:100%;width:920px;height:800px}.hr-connectors{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}.hr-connectors path{fill:none;stroke:${D.line};stroke-width:1.4}.hr-orgcard{position:absolute;width:${D.tree.cardWidth}px;height:${D.tree.cardHeight}px;border-top:3px solid color-mix(in srgb,${D.accent} 70%,${D.line});padding:7px 8px;box-shadow:0 2px 4px #00000008}.hr-orgcard.context{border-top-color:${D.line}}.hr-orgcard.match{outline:2px solid ${D.accent};outline-offset:2px}.hr-orgcard.dim{opacity:.4}.hr-orgcard .hr-persontext{padding-right:9px}.hr-orgmeta{display:flex;align-items:center;justify-content:space-between;margin-top:4px;color:${D.muted};font-size:9px}.hr-orgtoggle{position:absolute;right:3px;top:3px;padding:2px;background:${D.panel};border:1px solid ${D.line};border-radius:4px;color:${D.muted};cursor:pointer;z-index:1}.hr-orgtoggle .hr-svg{width:11px;height:11px}.hr-canvasnote{position:absolute;left:14px;bottom:10px;color:${D.muted};font-size:9px;background:${D.panel};border:1px solid ${D.line};border-radius:4px;padding:4px 7px;pointer-events:none}.hr-result{position:absolute;right:12px;top:8px;background:${D.panel};border:1px solid ${D.line};border-radius:4px;padding:5px 8px;font-size:10px;z-index:2}
    .hr-queue{flex:1}.hr-queuehead{display:flex;gap:8px;padding:7px 9px;background:${D.background};border:1px solid ${D.line};border-radius:5px 5px 0 0;font-size:10px;font-weight:650}.hr-queuehead span{margin-left:auto;color:${D.muted};font-weight:400}.hr-request{display:grid;grid-template-columns:minmax(105px,1.05fr) minmax(150px,1.4fr) 127px;gap:10px;padding:10px 8px;border:1px solid ${D.line};border-top:0;align-items:center;background:${D.panel}}.hr-request h4{margin:0 0 3px;font-size:11px}.hr-evidence{display:grid;grid-template-columns:1fr 1fr;gap:5px;font-size:9px}.hr-evidence span{display:block;color:${D.muted};font-size:9px}.hr-evidence b{font-size:10px;font-weight:600}.hr-actions{display:flex;flex-wrap:wrap;gap:4px;align-content:center}.hr-status{display:block;width:100%;font-size:9px;font-weight:650;color:${D.accent};margin-bottom:3px}.hr-status[data-status=Denied]{color:${D.muted}}.hr-status[data-status=Approved]{color:color-mix(in srgb,${D.approvedColor} 85%,${D.foreground})}.hr-history{margin-top:16px}.hr-historyrow{display:grid;grid-template-columns:1.3fr 1fr 70px;gap:8px;padding:9px;border-bottom:1px solid ${D.line};font-size:10px;color:${D.muted}}.hr-historyrow strong{font-weight:500;color:${D.foreground}}
    .hr-calendar{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;text-align:center;font-size:9px}.hr-calendar span{padding:3px 0;min-width:0}.hr-calendar .dayname{color:${D.muted};font-size:8px}.hr-calendar .blackout{background:color-mix(in srgb,${D.blackoutColor} 15%,${D.panel});color:${D.foreground};border-radius:3px}.hr-calendar .booked{box-shadow:inset 0 -2px ${D.accent}}.hr-legend{font-size:9px;color:${D.muted};margin-top:7px;display:flex;gap:5px;align-items:center}.hr-legend i{height:7px;width:7px;background:color-mix(in srgb,${D.blackoutColor} 25%,${D.panel});border:1px solid ${D.line};border-radius:2px}
    .hr-onboard{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:10px;width:100%;min-height:0}.hr-section{border:1px solid ${D.line};border-radius:6px;padding:10px;background:${D.panel}}.hr-section h3{font-size:12px;margin:0 0 6px}.hr-hirehead{display:flex;align-items:center;gap:8px;padding:0 0 10px;border-bottom:1px solid ${D.line};margin-bottom:6px}.hr-hirehead b{font-size:12px}.hr-progress{height:4px;border-radius:2px;background:${D.line};margin:9px 0 5px}.hr-progress i{display:block;height:100%;border-radius:2px;background:${D.accent}}.hr-grouphead{display:flex;align-items:center;justify-content:space-between;font-size:10px;font-weight:650;margin:13px 0 3px}.hr-grouphead small{font-size:9px;color:${D.muted};font-weight:400}.hr-check{width:100%;display:flex;align-items:flex-start;gap:7px;text-align:left;padding:9px 0;background:none;border:0;border-bottom:1px solid ${D.line};color:${D.foreground};font:inherit;font-size:11px;cursor:pointer}.hr-checkmark{width:16px;height:16px;flex:none;display:grid;place-items:center;border:1px solid ${D.line};border-radius:4px;margin-top:1px}.hr-checkmark .hr-svg{width:13px;height:13px}.hr-check[aria-checked=true] .hr-checkmark{background:${D.accent};border-color:${D.accent};color:white}.hr-check small{display:block;font-size:9px;color:${D.muted};margin-top:3px}.hr-taskmeta{margin-left:auto;text-align:right;white-space:nowrap;font-size:9px;color:${D.muted}}.hr-taskmeta small{font-size:8px}.hr-readonlytask{display:flex;align-items:center;gap:7px;border-bottom:1px solid ${D.line};padding:8px 0;font-size:10px;color:${D.muted}}.hr-readonlytask .hr-svg{color:${D.accent};width:14px;height:14px}.hr-readonlytask small{margin-left:auto;font-size:9px}
    .hr-offer{padding:9px;border:1px solid ${D.line};background:${D.background};border-radius:5px;margin-bottom:10px;font-size:10px}.hr-offer strong{display:flex;align-items:center;gap:6px;margin-bottom:7px;color:${D.accent};font-size:10px}.hr-offer dl{margin:0;display:grid;grid-template-columns:64px 1fr;gap:3px 6px}.hr-offer dt{color:${D.muted}}.hr-offer dd{margin:0;overflow-wrap:anywhere}.hr-equipment{width:100%;display:flex;align-items:center;justify-content:flex-start;text-align:left;padding:7px;margin-bottom:5px;gap:8px}.hr-equipment>.hr-svg{width:24px;height:24px;color:${D.muted}}.hr-equipment b{display:block;font-size:10px}.hr-equipment small{font-size:9px;color:${D.muted}}.hr-equipcheck{margin-left:auto;color:${D.accent}}.hr-fieldlabel{font-size:10px;font-weight:650;color:${D.muted};display:block;margin:11px 0 4px}.hr-input{width:100%;padding:7px 8px;background:${D.panel};color:${D.foreground};border:1px solid ${D.line};border-radius:5px;font:inherit;font-size:11px;user-select:text}.hr-validation{color:${D.validationColor};font-size:9px;min-height:13px;margin-top:3px}
    .hr-dialogback{position:absolute;inset:0;background:#00000032;z-index:30;display:flex;justify-content:flex-end}.hr-drawer{width:min(410px,95%);padding:15px;background:${D.panel};border-left:1px solid ${D.line};box-shadow:-5px 0 24px #0002;overflow:auto}.hr-drawer h3{font-size:18px;letter-spacing:-.3px;margin:10px 0 3px;overflow-wrap:anywhere}.hr-drawer h4{font-size:12px;margin:15px 0 6px}.hr-drawer p{font-size:11px;line-height:1.6;white-space:pre-wrap}.hr-close{float:right}.hr-mail{padding:11px;background:${D.background};border:1px solid ${D.line};border-radius:5px;font-size:10px}.hr-profiletabs{display:flex;gap:20px;padding:12px 0 7px;border-bottom:1px solid ${D.line};font-size:11px;color:${D.muted}}.hr-profiletabs b{color:${D.accent}}.hr-profilegrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:13px;font-size:11px}.hr-profilegrid small{display:block;color:${D.muted};font-size:9px}.hr-profilefile{display:flex;align-items:center;gap:7px;padding:8px;border:1px solid ${D.line};border-radius:5px;font-size:10px;margin-top:7px}
    .hr-toast{position:absolute;right:12px;top:42px;z-index:35;width:260px;padding:11px;border:1px solid ${D.line};border-radius:6px;background:${D.panel};box-shadow:0 8px 25px #0003;font-size:11px}.hr-toast h4{margin:0 0 8px;font-size:12px}.hr-toast p{font-size:10px;color:${D.muted};margin:7px 0}
    .hr-tight .hr-sidebar{width:43px;padding:8px 4px}.hr-tight .hr-sidebar .hr-navlabel,.hr-tight .hr-sidebar small,.hr-tight .hr-navheading,.hr-tight .hr-sidecard,.hr-tight .hr-sideperson{display:none}.hr-tight .hr-navitem{padding:8px;justify-content:center}.hr-tight .hr-title h2{font-size:16px}.hr-tight .hr-company{max-width:140px}.hr-tight .hr-topnote,.hr-tight .hr-viewlabel{display:none}.hr-tight .hr-request{grid-template-columns:minmax(90px,1fr) minmax(125px,1.2fr);gap:7px}.hr-tight .hr-actions{grid-column:1/-1;align-items:center}.hr-tight .hr-status{width:auto;margin-right:auto;margin-bottom:0}.hr-tight .hr-toolbar .hr-filterlabel{display:none}
    .hr-short .hr-title{padding:6px 12px}.hr-short .hr-title small{display:none}.hr-short .hr-title h2{font-size:16px}.hr-short .hr-toolbar{padding-bottom:6px}.hr-short .hr-policy{font-size:9px;padding:4px 7px;margin-bottom:6px}.hr-short .hr-subtabs{min-height:25px}
  `;
  const TOKENS = {
    icons: ICONS, titles: TITLES, brand: 'peopleworks', workspaceLabel: 'People workspace', user: 'Alex Lane',
    savedText: 'All changes saved', currency: 'USD', locale: 'en-US',
    panel: 'var(--panel)', foreground: 'var(--fg)', line: 'var(--line)', accent: 'var(--accent)',
    muted: 'var(--muted)', background: 'var(--bg)', font: '12px/1.4 system-ui,sans-serif', inset: '8px', radius: '9px',
    sidebarWidth: '139px', railWidth: '184px',
    stageColors: ['#a58a44', '#468a75', '#a26676'], dangerColor: '#b34646', approvedColor: '#458b69',
    blackoutColor: '#b96856', validationColor: '#b46c56',
    tree: { rootX: 135, rootY: 18, columnX: 15, columnGap: 220, columnY: 112, depthOffset: 10, rowGap: 83,
      bottom: 25, minWidth: 905, padding: 28, minHeight: 650, cardWidth: 190, cardHeight: 65, busY: 97,
      connectorGap: 9, gripX: 45, gripY: 28 },
    tightWidth: 790, shortHeight: 490, railWidthAt: 1180, timeoffRailWidthAt: 1110,
  };

  function installControls(BASE, pages, S) {
    BASE.element = function (ctx, tag, cls, parent, text) {
      return ctx.util.el(tag, cls, parent, text);
    };

    BASE.icon = function (ctx, parent, name) {
      const state = pages.get(ctx);
      const { util } = state;
      const svg = util.svg('svg', { class: 'hr-svg', viewBox: '0 0 24 24', 'aria-hidden': 'true' }, parent); svg.innerHTML = S.D.icons[name] || S.D.icons.file; return svg;
    };

    BASE.button = function (ctx, parent, text, action, cls = '', glyph) {
      const b = S.P.element(ctx, 'button', 'hr-btn ' + cls, parent); b.type = 'button'; if (glyph) S.P.icon(ctx, b, glyph);
      if (text) S.P.element(ctx, 'span', '', b, text); if (action) b.addEventListener('click', action); return b;
    };

    BASE.iconButton = function (ctx, parent, name, title, action) {
      const b = S.P.button(ctx, parent, '', action, 'hr-iconbtn', name); b.title = title; b.setAttribute('aria-label', title); return b;
    };

    BASE.avatar = function (ctx, parent, p) {
      return S.P.element(ctx, 'span', 'hr-avatar', parent, p.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join(''));
    };

    BASE.identity = function (ctx, parent, p) {
      const line = S.P.element(ctx, 'div', 'hr-personline', parent); S.P.avatar(ctx, line, p); const text = S.P.element(ctx, 'div', 'hr-persontext', line); S.P.element(ctx, 'h4', '', text, p.name); S.P.element(ctx, 'small', '', text, p.role); return line;
    };

    BASE.notice = function (ctx, title, lines) {
      const state = pages.get(ctx);
      const { root } = state;
      root.querySelectorAll('.hr-toast').forEach((p) => p.remove());
      const pop = S.P.element(ctx, 'div', 'hr-toast', root); S.P.iconButton(ctx, pop, 'close', 'Close notice', () => pop.remove()).style.float = 'right';
      S.P.element(ctx, 'h4', '', pop, title); for (const line of lines) S.P.element(ctx, 'p', '', pop, line);
    };

    BASE.pane = function (ctx, parent, id, cls = '') {
      const state = pages.get(ctx);
      const { offsets } = state;
      const p = S.P.element(ctx, 'div', 'hr-pane ' + cls, parent); state.panes[id] = p;
      p.addEventListener('scroll', () => { if (S.current !== state || !p.isConnected) return; offsets[id] = [p.scrollLeft, p.scrollTop]; S.P.mirror(ctx); });
      return p;
    };
  }

  function installUpdates(BASE, pages, S) {
    BASE.mirror = function (ctx) {
      const state = pages.get(ctx);
      const { s, ui } = state;
      const view = { _search: !!ui.query };
      const delta = (a, b, low, high) => a < low + 6 ? a - low - 6 : b > high - 6 ? b - high + 6 : 0;
      for (const [key, ref] of Object.entries(state.refs)) if (ref.pane) {
        const p = state.panes[ref.pane].getBoundingClientRect(), raw = ref.node.getBoundingClientRect();
        let box = { left: raw.left, top: raw.top, right: raw.right, bottom: raw.bottom };
        if (s.scenario === 'orgchart' && key.startsWith('employee/')) {
          const id = key.split('/')[1], boss = id === s.employee ? s.manager : s.parents[id];
          const target = state.refs['manager/' + boss];
          if (target) { const b = target.node.getBoundingClientRect(); box = { left: Math.min(box.left, b.left), top: Math.min(box.top, b.top), right: Math.max(box.right, b.right), bottom: Math.max(box.bottom, b.bottom) }; }
        }
        const scroller = state.panes[ref.pane];
        const dx = Math.round(Math.max(-scroller.scrollLeft, Math.min(scroller.scrollWidth - scroller.clientWidth - scroller.scrollLeft, delta(box.left, box.right, p.left, p.right))));
        const dy = Math.round(Math.max(-scroller.scrollTop, Math.min(scroller.scrollHeight - scroller.clientHeight - scroller.scrollTop, delta(box.top, box.bottom, p.top, p.bottom))));
        view[key] = { pane: ref.pane, dx, dy };
      }
      if (s.scenario === 'orgchart') for (const p of s.people) if (!state.refs['employee/' + p.id]) {
        let id = p.id, parent = ctx.model.parents[id];
        while (parent) { if (ui.collapsed.has(parent) && state.refs['expand/' + parent]) { view['employee/' + p.id] = { expand: parent }; break; } parent = ctx.model.parents[parent]; }
      }
      ctx.patch({ view });
    };

    BASE.update = function (ctx, a, rebuild = true) {
      const state = pages.get(ctx);
      const { s, f } = state;
      ctx.update(f.helpers.act(ctx.model, s, a)); if (rebuild) S.P.draw(ctx); else S.P.stats(ctx);
    };

    BASE.stats = function (ctx) {
      const state = pages.get(ctx);
      const { s, f, footer } = state;
      footer.replaceChildren();
      for (const fact of f.facts(ctx.model, s)) { S.P.stat(ctx, fact); }

      S.P.saved(ctx);
    };

    BASE.drag = function (ctx, node, key, onDrop, onClick) {
      let ghost;
      env.ui.track(node, {
        start(p, e) { if (e.target.closest('button')) return false; node.style.opacity = '.55'; },
        move(p) {
          if (!ghost && Math.hypot(p.dx, p.dy) > 5) ghost = S.P.ghost(ctx, node);
          if (ghost) ghost.style.transform = `translate(${p.dx}px,${p.dy}px)`;
        },
        end(p) { if (ghost) { ghost.remove(); ghost = null; } node.style.opacity = ''; if (Math.hypot(p.dx, p.dy) > 5) onDrop(p); else if (onClick) onClick(); },
      }, key);
    };

    BASE.ghost = function (ctx, node) {
      const { root } = pages.get(ctx);
      const rect = node.getBoundingClientRect(); const ghost = node.cloneNode(true);
      Object.assign(ghost.style, { position: 'fixed', width: rect.width + 'px', height: rect.height + 'px', left: rect.left + 'px', top: rect.top + 'px', margin: '0', opacity: '.94', pointerEvents: 'none', zIndex: '500', boxShadow: '0 8px 24px #0004' }); root.append(ghost);
      return ghost;
    };

    BASE.panel = function (ctx, parent, title, glyph) {
      const p = S.P.element(ctx, 'section', 'hr-panel', parent), h = S.P.element(ctx, 'div', 'hr-panelhead', p); if (glyph) S.P.icon(ctx, h, glyph); h.append(document.createTextNode(title)); return p;
    };

    BASE.line = function (ctx, parent, title, detail) {
      const row = S.P.element(ctx, 'div', 'hr-listline', parent); S.P.element(ctx, 'b', '', row, title); S.P.element(ctx, 'span', 'hr-muted', row, detail); return row;
    };

    BASE.empty = function (ctx, parent, text, glyph = 'search') {
      const p = S.P.element(ctx, 'div', 'hr-empty', parent); S.P.icon(ctx, p, glyph); p.append(document.createTextNode(text));
    };

    BASE.candidateDrawer = function (ctx) {
      const state = pages.get(ctx);
      const { s, root } = state;
      const c = s.candidates.find((p) => p.id === ctx.model.selected), back = S.P.element(ctx, 'div', 'hr-dialogback', root), drawer = S.P.element(ctx, 'aside', 'hr-drawer', back);
      S.P.addRef(ctx, 'close', S.P.iconButton(ctx, drawer, 'close', 'Close candidate', () => S.P.update(ctx, { selected: null }))).classList.add('hr-close');
      S.P.candidateProfile(ctx, drawer, c);
      if (ctx.model.draft === c.id) {
        S.P.rejectionEmail(ctx, drawer, c);
      } else {
        S.P.candidateActivity(ctx, drawer, c);
      }
    };

    BASE.draw = function (ctx) {
      const state = pages.get(ctx);
      const { s, root, offsets, search, work } = state;
      if (S.current !== state) return;
      for (const [id, p] of Object.entries(state.panes)) offsets[id] = [p.scrollLeft, p.scrollTop];
      work.replaceChildren(); root.querySelectorAll('.hr-dialogback').forEach((p) => p.remove()); state.refs = {}; state.panes = {};
      S.P.addRef(ctx, 'search', search);
      if (s.scenario === 'pipeline') S.P.pipeline(ctx); else if (s.scenario === 'orgchart') S.P.orgchart(ctx); else if (s.scenario === 'timeoff') S.P.timeoff(ctx); else S.P.onboarding(ctx);
      for (const [id, p] of Object.entries(state.panes)) { p.scrollLeft = (offsets[id] || [0, 0])[0]; p.scrollTop = (offsets[id] || [0, 0])[1]; }
      S.P.stats(ctx); S.P.mirror(ctx);
    };
  }

  function installGeometry(BASE, pages, S) {
    BASE.addRef = function (ctx, key, node, pane) {
      const state = pages.get(ctx);
      state.refs[key] = { node, pane }; return node;
    };

    BASE.contains = function (ctx, node, p) {
      const rect = node.getBoundingClientRect(); return p.x >= rect.left && p.x <= rect.right && p.y >= rect.top && p.y <= rect.bottom;
    };

    BASE.money = function (ctx, n) {
      const state = pages.get(ctx);
      const { C } = state;
      return C.formatMoney(n, S.D.currency, S.D.locale);
    };

    BASE.match = function (ctx, p) {
      const state = pages.get(ctx);
      const { ui } = state;
      return !ui.query || `${p.name} ${p.role || ''} ${p.team || ''} ${p.city || ''}`.toLowerCase().includes(ui.query);
    };

    BASE.context = function (ctx) {
      const state = pages.get(ctx);
      const { s, C } = state;
      const r = ctx.rng.fork('workspace-context');
      return Array.from({ length: 8 }, (_, i) => {
          const p = C.personName(r, { csplit: s.csplit });
          return { id: `context-${i}`, name: p.full, role: C.pick(r, C.JOB_TITLES, { csplit: s.csplit }), city: C.pick(r, C.CITIES, { csplit: s.csplit }).city,
            email: C.emailAddress(r, p), date: `2027-06-${String(9 + i).padStart(2, '0')}` };
      });
    };

    BASE.styles = function (ctx) {
      ctx.css('hr-classic-style', CSS(S.D));
    };
  }

  function installShell(BASE, pages, S) {
    BASE.frame = function (ctx) {
      const state = pages.get(ctx);
      const { size } = state;
      return S.P.element(ctx, 'div', `hr-app${size.width < S.D.tightWidth ? ' hr-tight' : ''}${size.height < S.D.shortHeight ? ' hr-short' : ''}`, ctx.stage);
    };

    BASE.brand = function (ctx) {
      const state = pages.get(ctx);
      const { s, root, extras } = state;
      const brand = S.P.element(ctx, 'div', 'hr-brandbar', root); S.P.icon(ctx, S.P.element(ctx, 'span', 'hr-logo', brand), 'people'); S.P.element(ctx, 'strong', '', brand, S.D.brand);
      S.P.element(ctx, 'span', 'hr-company', brand, s.company); S.P.element(ctx, 'span', 'hr-spacer', brand); S.P.element(ctx, 'span', 'hr-topnote', brand, S.D.workspaceLabel);
      S.P.iconButton(ctx, brand, 'bell', 'Notifications, 3 unread', () => S.P.notice(ctx, 'Notifications', ['3 new updates', 'Payroll closes Friday at 17:00.', `${extras[0].name} signed their offer letter.`, 'Quarterly headcount report is ready.']));
      S.P.element(ctx, 'span', 'hr-badge', brand, '3'); S.P.avatar(ctx, brand, { name: S.D.user });
    };

    BASE.workspace = function (ctx) {
      const state = pages.get(ctx);
      const { root } = state;
      const workspace = S.P.element(ctx, 'div', 'hr-workspace', root);
      state.sidebar = S.P.element(ctx, 'aside', 'hr-sidebar', workspace); state.main = S.P.element(ctx, 'main', 'hr-main', workspace);
      return workspace;
    };

    BASE.sidebar = function (ctx) {
      const state = pages.get(ctx);
      const { s, extras, sidebar } = state;
      S.P.element(ctx, 'div', 'hr-navheading', sidebar, 'Workspace');
      const navItems = [['home', 'Home', ''], ['people', 'Employees', String(s.people.length + (s.directory || []).length)], ['tree', 'Org chart', 'orgchart'], ['case', 'Recruiting', 'pipeline'], ['calendar', 'Time off', 'timeoff'], ['checklist', 'Onboarding', 'onboarding'], ['file', 'Documents', '12'], ['chart', 'Reports', ''], ['gear', 'Settings', '']];
      for (const [glyph, label, id] of navItems) {
        S.P.navItem(ctx, sidebar, glyph, label, id);
      }
      S.P.element(ctx, 'div', 'hr-navheading', sidebar, s.scenario === 'onboarding' ? 'Upcoming hires' : 'Open requisitions');
      if (s.scenario === 'onboarding') for (const p of extras.slice(0, 3)) { const row = S.P.element(ctx, 'div', 'hr-sideperson', sidebar); S.P.avatar(ctx, row, p); const t = S.P.element(ctx, 'div', '', row); S.P.element(ctx, 'b', '', t, p.name); S.P.element(ctx, 'small', '', t, p.date); }
      else for (const [title, n] of [['Operations lead', '11'], ['Product analyst', '24'], ['Support specialist', '8']]) {
        const b = S.P.element(ctx, 'button', 'hr-navitem', sidebar); b.type = 'button'; S.P.icon(ctx, b, 'case'); S.P.element(ctx, 'span', 'hr-navlabel', b, title); S.P.element(ctx, 'small', '', b, n); b.addEventListener('click', () => S.P.notice(ctx, title, [`${n} candidates in this requisition.`, 'Hiring manager review is in progress.']));
      }
      const reminder = S.P.element(ctx, 'div', 'hr-sidecard', sidebar); S.P.element(ctx, 'b', '', reminder, 'People team'); reminder.append(document.createTextNode('Payroll cutoff Friday, 17:00')); S.P.element(ctx, 'div', 'hr-footnote', reminder, 'Policy review due in 8 days');
    };

    BASE.navItem = function (ctx, parent, glyph, label, id) {
      const state = pages.get(ctx);
      const { s, extras } = state;
      const b = S.P.element(ctx, 'button', 'hr-navitem' + (id === s.scenario ? ' on' : ''), parent); b.type = 'button'; S.P.icon(ctx, b, glyph); S.P.element(ctx, 'span', 'hr-navlabel', b, label);
      if (['12', String(s.people.length + (s.directory || []).length)].includes(id)) S.P.element(ctx, 'small', '', b, id);
      b.addEventListener('click', () => S.P.notice(ctx, label, [id === s.scenario ? 'You are viewing this workspace.' : 'Other workspace activity', `${extras[1].name} updated a document.`, 'Quarterly review cycle closes in 8 days.']));
    };

    BASE.heading = function (ctx) {
      const state = pages.get(ctx);
      const { s, extras, main } = state;
      const heading = S.P.element(ctx, 'div', 'hr-title', main), title = S.P.element(ctx, 'div', '', heading), crumb = S.P.element(ctx, 'div', 'hr-breadcrumb', title, S.D.workspaceLabel); S.P.icon(ctx, crumb, 'chevron'); crumb.append(document.createTextNode(s.scenario === 'pipeline' ? 'Recruiting' : 'People operations'));
      S.P.element(ctx, 'h2', '', title, S.D.titles[s.scenario]); S.P.element(ctx, 'small', '', title, s.scenario === 'pipeline' ? `${s.role} / REQ-1042 / Hiring team: 3 members` : s.scenario === 'orgchart' ? 'Reporting structure / Active employees / Company-wide' : s.scenario === 'timeoff' ? 'Annual leave / Requests assigned to you' : `${s.hire.name} / ${s.hire.role}`);
      S.P.element(ctx, 'span', 'hr-spacer', heading); S.P.button(ctx, heading, s.scenario === 'orgchart' ? 'Export' : s.scenario === 'pipeline' ? 'Job details' : 'Activity', () => S.P.notice(ctx, 'Workspace activity', [`${extras[2].name} updated the workspace.`, 'Last review: yesterday, 16:25', 'Changes are saved automatically.']), '', s.scenario === 'orgchart' ? 'download' : 'more');
    };

    BASE.tabs = function (ctx) {
      const state = pages.get(ctx);
      const { s, main } = state;
      const subtabs = S.P.element(ctx, 'div', 'hr-subtabs', main);
      const tabs = s.scenario === 'pipeline' ? ['Pipeline', 'Candidates', 'Interviews', 'Job setup'] : s.scenario === 'orgchart' ? ['Org chart', 'Directory', 'Teams', 'Locations'] : s.scenario === 'timeoff' ? ['Requests', 'Team calendar', 'Balances', 'Policies'] : ['Overview', 'Documents', 'Equipment', 'Activity'];
      tabs.forEach((t, i) => { const tab = S.P.element(ctx, 'span', 'hr-subtab' + (i === 0 ? ' on' : ''), subtabs, t); if (i === 1) S.P.element(ctx, 'span', 'hr-badge', tab, s.scenario === 'pipeline' ? String(s.candidates.length) : '4'); });
    };

    BASE.toolbar = function (ctx) {
      const state = pages.get(ctx);
      const { s, ui, extras, main } = state;
      const toolbar = S.P.element(ctx, 'div', 'hr-toolbar', main); toolbar.style.paddingTop = '8px'; const searchbox = S.P.element(ctx, 'div', 'hr-search', toolbar); S.P.icon(ctx, searchbox, 'search');
      const search = state.search = S.P.element(ctx, 'input', '', searchbox); search.type = 'search'; search.placeholder = s.scenario === 'orgchart' ? 'Find a person or team' : s.scenario === 'timeoff' ? 'Search requests' : s.scenario === 'pipeline' ? 'Search this requisition' : 'Find checklist items'; search.setAttribute('aria-label', search.placeholder);
      search.addEventListener('input', () => { ui.query = search.value.trim().toLowerCase(); S.P.draw(ctx); });
      S.P.button(ctx, toolbar, 'All locations', () => S.P.notice(ctx, 'Locations', ['All locations are included in this view.', ...extras.slice(0, 3).map((p) => p.city)]), 'hr-filterlabel', 'filter');
      if (s.scenario === 'orgchart') S.P.button(ctx, toolbar, 'Expand all', () => { ui.collapsed.clear(); S.P.draw(ctx); }, '', 'tree');
      S.P.element(ctx, 'span', 'hr-spacer', toolbar); S.P.element(ctx, 'span', 'hr-viewlabel', toolbar, s.scenario === 'orgchart' ? 'Compact tree / 100%' : s.scenario === 'timeoff' ? 'Most recent first' : 'Shared with People team');
    };

    BASE.policy = function (ctx) {
      const state = pages.get(ctx);
      const { s, main } = state;
      if (s.scenario === 'pipeline' || s.scenario === 'timeoff') {
        const policy = S.P.element(ctx, 'div', 'hr-policy', main);
        if (s.scenario === 'pipeline') { S.P.element(ctx, 'b', '', policy, 'Screening policy  '); policy.append(document.createTextNode(`${s.rule.years}+ years AND ${s.rule.skill}: Offer if interview score is ${s.rule.score} or higher, otherwise Interview. Everyone else: Rejected. Applied is the review queue.`)); }
        else { S.P.element(ctx, 'b', '', policy, 'Leave policy  '); policy.append(document.createTextNode(`Approve only if balance covers requested days, dates avoid ${s.policy.blackoutStart} to ${s.policy.blackoutEnd} inclusive, and at least ${s.policy.coverage} teammates remain available. Deny otherwise. Each request has an independent coverage forecast.`)); }
      }
    };

    BASE.shell = function (ctx) {
      const state = pages.get(ctx);
      const { root } = state;
      S.P.brand(ctx);
      state.workspace = S.P.workspace(ctx);
      S.P.sidebar(ctx); S.P.heading(ctx); S.P.tabs(ctx); S.P.toolbar(ctx); S.P.policy(ctx);
      state.work = S.P.element(ctx, 'div', 'hr-work', state.main); state.footer = S.P.element(ctx, 'div', 'hr-stats', root);
    };
  }

  function installRecruiting(BASE, pages, S) {
    BASE.candidateCard = function (ctx, parent, c) {
      const card = S.P.element(ctx, 'article', 'hr-card hr-candidate hr-drag', parent); S.P.identity(ctx, card, c);
      S.P.element(ctx, 'div', 'hr-footnote', card, `${c.years} years experience / ${c.city}`);
      const skills = S.P.element(ctx, 'div', 'hr-meta', card); for (const skill of c.skills) S.P.element(ctx, 'span', 'hr-chip', skills, skill);
      const score = S.P.element(ctx, 'div', 'hr-score', card); S.P.element(ctx, 'span', '', score, 'Interview score'); S.P.element(ctx, 'b', '', score, c.score + ' / 100'); const bar = S.P.element(ctx, 'div', 'hr-scorebar', card); S.P.element(ctx, 'i', '', bar).style.width = c.score + '%';
      const bottom = S.P.element(ctx, 'div', 'hr-cardbottom', card); S.P.element(ctx, 'span', '', bottom, c.source); const age = S.P.element(ctx, 'span', '', bottom); S.P.icon(ctx, age, 'clock'); age.append(document.createTextNode(' ' + (2 + Number(c.id.slice(1))) + 'd'));
      S.P.decorated(ctx, card, c, 'candidate'); return card;
    };

    BASE.candidateEvents = function (ctx, card, c, lanes) {
      const state = pages.get(ctx);
      const { s } = state;
      S.P.addRef(ctx, 'candidate/' + c.id, card, ctx.model.stages[c.id]);
      S.P.drag(ctx, card, c.id, (p) => { const dest = STAGES.find((st) => S.P.contains(ctx, lanes[st], p)); if (dest && dest !== ctx.model.stages[c.id]) { if (s.judge && s.judge.mode === 'confirm' && dest === 'Rejected') ctx.flag('irreversible'); S.P.update(ctx, { id: c.id, stage: dest }); } }, () => S.P.update(ctx, { selected: c.id }));
    };

    BASE.lane = function (ctx, board, stage, lanes) {
      const state = pages.get(ctx);
      const { s, ui } = state;
      const lane = S.P.element(ctx, 'section', 'hr-lane', board); lanes[stage] = lane;
      const h = S.P.addRef(ctx, 'stage/' + stage, S.P.element(ctx, 'div', 'hr-lanehead', lane)); S.P.element(ctx, 'span', 'hr-stagebar', h); S.P.element(ctx, 'span', '', h, stage);
      const cs = s.candidates.filter((c) => ctx.model.stages[c.id] === stage); S.P.element(ctx, 'small', '', h, String(cs.length)); const body = S.P.pane(ctx, lane, stage, 'hr-lanebody');
      const visible = cs.filter((p) => S.P.match(ctx, p)); if (!visible.length) S.P.empty(ctx, body, ui.query ? 'No candidates match your search' : stage === 'Applied' ? 'No applications awaiting review' : 'No candidates in this stage', 'case');
      for (const c of visible) {
        const card = S.P.candidateCard(ctx, body, c); S.P.candidateEvents(ctx, card, c, lanes);
      }
    };

    BASE.pipelineRail = function (ctx) {
      const state = pages.get(ctx);
      const { extras, work } = state;
      const rail = S.P.element(ctx, 'aside', 'hr-rail', work), p = S.P.panel(ctx, rail, 'Hiring team', 'people');
      for (const [i, p] of extras.slice(0, 3).entries()) S.P.line(ctx, rail.firstChild, p.name, ['Hiring manager', 'Recruiter', 'Interview coordinator'][i]);
      const activity = S.P.panel(ctx, rail, 'Recent activity', 'clock'); S.P.line(ctx, activity, 'Scorecard received', 'Technical interview / yesterday'); S.P.line(ctx, activity, 'Referral added', 'Talent network / 2 days ago');
      const other = S.P.panel(ctx, rail, 'Other requisitions', 'case'); S.P.line(ctx, other, 'Product analyst', '24 candidates / 3 interviews'); S.P.line(ctx, other, 'Support specialist', '8 candidates / 1 offer');
    };

    BASE.pipeline = function (ctx) {
      const state = pages.get(ctx);
      const { size, work } = state;
      const board = S.P.element(ctx, 'div', 'hr-board', work), lanes = {};
      for (const stage of STAGES) {
        S.P.lane(ctx, board, stage, lanes);
      }
      if (size.width > S.D.railWidthAt) {
        S.P.pipelineRail(ctx);
      }
      if (ctx.model.selected) S.P.candidateDrawer(ctx);
    };

    BASE.candidateProfile = function (ctx, drawer, c) {
      S.P.element(ctx, 'span', 'hr-badge', drawer, 'Candidate / ' + ctx.model.stages[c.id]); S.P.element(ctx, 'h3', '', drawer, c.name); S.P.element(ctx, 'div', 'hr-muted', drawer, c.email);
      const tabs = S.P.element(ctx, 'div', 'hr-profiletabs', drawer); S.P.element(ctx, 'b', '', tabs, 'Overview'); S.P.element(ctx, 'span', '', tabs, 'Scorecards'); S.P.element(ctx, 'span', '', tabs, 'Activity');
      const grid = S.P.element(ctx, 'div', 'hr-profilegrid', drawer);
      for (const [title, value] of [['Experience', c.years + ' years'], ['Location', c.city], ['Source', c.source], ['Interview score', c.score + ' / 100']]) { const cell = S.P.element(ctx, 'div', '', grid); S.P.element(ctx, 'small', '', cell, title); cell.append(document.createTextNode(value)); }
      const skills = S.P.element(ctx, 'div', 'hr-meta', drawer); for (const skill of c.skills) S.P.element(ctx, 'span', 'hr-chip', skills, skill);
    };

    BASE.rejectionEmail = function (ctx, drawer, c) {
      const state = pages.get(ctx);
      const { s } = state;
      S.P.element(ctx, 'h4', '', drawer, 'Rejection email / Draft'); const mail = S.P.element(ctx, 'div', 'hr-mail', drawer); S.P.element(ctx, 'b', '', mail, 'To: ' + c.email);
      S.P.element(ctx, 'p', '', mail, `Hello ${c.name},\nThank you for your interest in ${s.company}. We will not be moving forward with your application for ${s.role}. We appreciate the time you spent with our team.\nThe recruiting team`);
      S.P.element(ctx, 'p', 'hr-muted', drawer, 'Sending this email also moves the candidate to Rejected.');
      S.P.button(ctx, drawer, 'Send rejection email', () => { if (s.judge && s.judge.mode === 'confirm') ctx.flag('irreversible'); S.P.update(ctx, { send: true }); }, 'hr-danger', 'mail');
    };

    BASE.candidateActivity = function (ctx, drawer, c) {
      const file = S.P.element(ctx, 'div', 'hr-profilefile', drawer); S.P.icon(ctx, file, 'file'); file.append(document.createTextNode('Resume.pdf / Application attachment')); S.P.element(ctx, 'span', 'hr-spacer', file); S.P.icon(ctx, file, 'download');
      S.P.element(ctx, 'h4', '', drawer, 'Recruiter activity'); const timeline = S.P.element(ctx, 'div', 'hr-timeline', drawer); const item = S.P.element(ctx, 'p', '', timeline, 'Application received'); S.P.element(ctx, 'small', '', item, c.source + ' / 3 days ago'); const note = S.P.element(ctx, 'p', '', timeline, 'Interview feedback added'); S.P.element(ctx, 'small', '', note, 'Hiring team / yesterday, 14:30');
      S.P.addRef(ctx, 'reject', S.P.button(ctx, drawer, 'Prepare rejection email', () => S.P.update(ctx, { draft: c.id }), 'hr-danger', 'mail'));
    };
  }

  function installOrgchart(BASE, pages, S) {
    BASE.orgLayout = function (ctx, all) {
      const state = pages.get(ctx);
      const { s, ui } = state;
      const m = ctx.model, byId = Object.fromEntries(all.map((p) => [p.id, p])), parents = { ...m.parents, ...Object.fromEntries((s.directory || []).map((p) => [p.id, p.parent])) };
      const children = (id) => all.filter((p) => parents[p.id] === id), positions = {}, hidden = new Set();
      const totalBelow = (id) => children(id).reduce((n, p) => n + 1 + totalBelow(p.id), 0);
      positions.p0 = { x: S.D.tree.rootX, y: S.D.tree.rootY };
      const direct = children('p0'), ordered = direct.sort((a, b) => ['p1', 'p2', 'p3', 'd0', 'd1'].indexOf(a.id) - ['p1', 'p2', 'p3', 'd0', 'd1'].indexOf(b.id));
      let maxY = 0;
      for (const [i, boss] of ordered.entries()) {
        const x = S.D.tree.columnX + i * S.D.tree.columnGap; let y = S.D.tree.columnY;
        function layout(p, depth, invisible) {
          if (invisible) hidden.add(p.id); else { positions[p.id] = { x: x + Math.min(depth, 3) * S.D.tree.depthOffset, y }; y += S.D.tree.rowGap; }
          const folded = invisible || ui.collapsed.has(p.id) && !ui.query;
          for (const child of children(p.id)) layout(child, depth + 1, folded);
        }
        layout(boss, 0, ui.collapsed.has('p0') && !ui.query); maxY = Math.max(maxY, y + S.D.tree.bottom);
      }
      return { byId, parents, positions, direct, totalBelow, width: Math.max(S.D.tree.minWidth, ordered.length * S.D.tree.columnGap + S.D.tree.padding), height: Math.max(S.D.tree.minHeight, maxY) };
    };

    BASE.orgConnectors = function (ctx, canvas, geo) {
      const state = pages.get(ctx);
      const { util } = state;
      const { parents, positions } = geo;
      const connectors = util.svg('svg', { class: 'hr-connectors', 'aria-hidden': 'true' }, canvas);
      for (const [id, pos] of Object.entries(positions)) {
        const parent = positions[parents[id]];
        if (parent) {
          const x1 = parent.x + S.D.tree.cardWidth / 2, y1 = parent.y + S.D.tree.cardHeight, x2 = pos.x + S.D.tree.cardWidth / 2, y2 = pos.y;
          const between = parents[id] === 'p0' ? S.D.tree.busY : y1 + S.D.tree.connectorGap;
          util.svg('path', { d: `M${x1},${y1} V${between} H${x2} V${y2}` }, connectors);
        }
      }
    };

    BASE.orgCard = function (ctx, canvas, p, pos, count, editable) {
      const state = pages.get(ctx);
      const { ui } = state;
      const card = S.P.element(ctx, 'article', 'hr-card hr-orgcard' + (editable ? ' hr-drag' : ' context') + (ui.query ? S.P.match(ctx, p) ? ' match' : ' dim' : ''), canvas);
      card.style.left = pos.x + 'px'; card.style.top = pos.y + 'px'; S.P.identity(ctx, card, p);
      const meta = S.P.element(ctx, 'div', 'hr-orgmeta', card); S.P.element(ctx, 'span', '', meta, p.city);
      S.P.element(ctx, 'span', '', meta, count ? count + (count === 1 ? ' person' : ' people') : 'Individual contributor');
      S.P.decorated(ctx, card, p, 'employee'); return card;
    };

    BASE.orgToggle = function (ctx, card, p) {
      const state = pages.get(ctx);
      const { ui } = state;
      const id = p.id;

      const b = S.P.element(ctx, 'button', 'hr-orgtoggle', card); b.type = 'button'; b.setAttribute('aria-label', (ui.collapsed.has(id) ? 'Expand ' : 'Collapse ') + p.name); b.setAttribute('aria-expanded', String(!ui.collapsed.has(id))); S.P.icon(ctx, b, ui.collapsed.has(id) ? 'plus' : 'down');
      b.addEventListener('click', (e) => { e.stopPropagation(); if (ui.collapsed.has(id)) ui.collapsed.delete(id); else ui.collapsed.add(id); S.P.draw(ctx); }); S.P.addRef(ctx, 'expand/' + id, b, 'chart');
    };

    BASE.orgEvents = function (ctx, card, p, all, count, editable) {
      const state = pages.get(ctx);
      const id = p.id;
      S.P.addRef(ctx, 'manager/' + id, card, 'chart');

      if (count) {
        S.P.orgToggle(ctx, card, p);
      }
      if (editable) {
        S.P.addRef(ctx, 'employee/' + id, card, 'chart');
        S.P.drag(ctx, card, id, (pt) => { const manager = all.find((q) => q.id.startsWith('p') && q.id !== id && state.refs['manager/' + q.id] && S.P.contains(ctx, state.refs['manager/' + q.id].node, pt)); if (manager) S.P.update(ctx, { id, manager: manager.id }); },
          () => S.P.notice(ctx, p.name, [p.role, p.email, p.city, 'Employment status: Active']));
      } else card.addEventListener('click', (e) => { if (!e.target.closest('button')) S.P.notice(ctx, p.name, [p.role, p.email, p.city, 'Employment status: Active']); });
    };

    BASE.orgRail = function (ctx, all, geo) {
      const state = pages.get(ctx);
      const { extras, work } = state;
      const { direct, byId, totalBelow } = geo;

      const rail = S.P.element(ctx, 'aside', 'hr-rail', work), info = S.P.panel(ctx, rail, 'Directory overview', 'tree'); S.P.line(ctx, info, all.length + ' active employees', direct.length + ' reporting teams'); S.P.line(ctx, info, 'Employment mix', 'Full-time / Part-time / Contractor');
      const teams = S.P.panel(ctx, rail, 'Teams', 'people'); for (const id of ['p1', 'p2', 'd0', 'd1']) S.P.line(ctx, teams, byId[id].role, (totalBelow(id) + 1) + ' people / ' + byId[id].name);
      const recent = S.P.panel(ctx, rail, 'Recent changes', 'clock'); S.P.line(ctx, recent, extras[3].name, 'Office updated / yesterday'); S.P.line(ctx, recent, 'Directory sync complete', 'All employee profiles are current');
    };

    BASE.orgchart = function (ctx) {
      const state = pages.get(ctx);
      const { s, size, ui, work } = state;
      const viewport = S.P.pane(ctx, work, 'chart', 'hr-treeviewport'), canvas = S.P.element(ctx, 'div', 'hr-canvas', viewport), all = [...s.people, ...(s.directory || [])];
      const geo = state.geo = S.P.orgLayout(ctx, all), { byId, positions, direct, totalBelow } = geo;
      canvas.style.width = geo.width + 'px'; canvas.style.height = geo.height + 'px';
      S.P.orgConnectors(ctx, canvas, geo);
      for (const [id, pos] of Object.entries(positions)) {
        const p = byId[id], editable = id.startsWith('p') && id !== 'p0';
        const count = totalBelow(id), card = S.P.orgCard(ctx, canvas, p, pos, count, editable); S.P.orgEvents(ctx, card, p, all, count, editable);
      }
      if (ui.query) S.P.element(ctx, 'div', 'hr-result', work, all.filter((p) => S.P.match(ctx, p)).length + ' matching people');
      S.P.element(ctx, 'div', 'hr-canvasnote', work, `${all.length} people / ${direct.length} teams / Active directory`);
      if (size.width > S.D.railWidthAt) {
        S.P.orgRail(ctx, all, geo);
      }
    };
  }

  function installTimeoff(BASE, pages, S) {
    BASE.requestEvidence = function (ctx, row, request) {
      const evidence = S.P.element(ctx, 'div', 'hr-evidence', row);
      for (const [label, value] of [['Dates', request.start + ' to ' + request.end], ['Requested', request.days + ' days'], ['Balance', request.balance + ' days'], ['Team available', String(request.coverage)]]) { const cell = S.P.element(ctx, 'div', '', evidence); S.P.element(ctx, 'span', '', cell, label); S.P.element(ctx, 'b', '', cell, value); }
    };

    BASE.requestActions = function (ctx, row, request) {
      const actions = S.P.element(ctx, 'div', 'hr-actions', row), status = S.P.element(ctx, 'span', 'hr-status', actions, ctx.model.decisions[request.id]); status.dataset.status = ctx.model.decisions[request.id];
      for (const value of ['Approved', 'Denied']) { const b = S.P.button(ctx, actions, value === 'Approved' ? 'Approve' : 'Deny', () => S.P.update(ctx, { id: request.id, decision: value }), ctx.model.decisions[request.id] === value ? 'active' : ''); S.P.addRef(ctx, `decision/${request.id}/${value}`, b, 'queue'); }
      S.P.addRef(ctx, 'decision/' + request.id, actions, 'queue');
    };

    BASE.request = function (ctx, parent, request) {
      const row = S.P.element(ctx, 'article', 'hr-request', parent), person = S.P.element(ctx, 'div', '', row); S.P.identity(ctx, person, { ...request, role: request.team }); S.P.element(ctx, 'div', 'hr-footnote', person, request.note);

      S.P.requestEvidence(ctx, row, request); S.P.requestActions(ctx, row, request);
      S.P.decorated(ctx, row, request, 'request');
    };

    BASE.history = function (ctx, queue) {
      const state = pages.get(ctx);
      const { extras } = state;
      const history = S.P.element(ctx, 'div', 'hr-history', queue), historyhead = S.P.element(ctx, 'div', 'hr-queuehead', history, 'Recently resolved'); S.P.element(ctx, 'span', '', historyhead, 'Other teams');
      for (const [i, p] of extras.slice(0, 6).entries()) { const row = S.P.element(ctx, 'div', 'hr-historyrow', history); S.P.element(ctx, 'strong', '', row, p.name); S.P.element(ctx, 'span', '', row, ['Annual leave / 2 days', 'Personal leave / 1 day', 'Annual leave / 3 days'][i % 3]); S.P.element(ctx, 'span', 'hr-tag', row, i % 3 ? 'Approved' : 'Cancelled'); }
    };

    BASE.calendar = function (ctx, calendar) {
      const state = pages.get(ctx);
      const { s, C } = state;
      const month = s.policy.blackoutStart.slice(0, 7); S.P.element(ctx, 'div', 'hr-footnote', calendar, C.formatDate(month + '-01', S.D.locale, 'monthYear'));
      const grid = S.P.element(ctx, 'div', 'hr-calendar', calendar); for (const day of ['M', 'T', 'W', 'T', 'F', 'S', 'S']) S.P.element(ctx, 'span', 'dayname', grid, day);
      const leading = (C.dayOfWeek(month + '-01') + 6) % 7; for (let i = 0; i < leading; i++) S.P.element(ctx, 'span', '', grid, '');
      for (let day = 1; day <= C.daysInMonth(Number(month.slice(0, 4)), Number(month.slice(5))); day++) {
        const date = `${month}-${String(day).padStart(2, '0')}`, blackout = date >= s.policy.blackoutStart && date <= s.policy.blackoutEnd;
        S.P.element(ctx, 'span', (blackout ? 'blackout' : '') + (s.requests.some((req) => date >= req.start && date <= req.end) ? ' booked' : ''), grid, String(day));
      }
      const legend = S.P.element(ctx, 'div', 'hr-legend', calendar); S.P.element(ctx, 'i', '', legend); legend.append(document.createTextNode('Company blackout dates'));
    };

    BASE.timeoffRail = function (ctx) {
      const state = pages.get(ctx);
      const { s, extras, work } = state;
      const rail = S.P.element(ctx, 'aside', 'hr-rail', work), calendar = S.P.panel(ctx, rail, 'Team availability', 'calendar');
      S.P.calendar(ctx, calendar);
      const policy = S.P.panel(ctx, rail, 'Policy details', 'shield'); S.P.line(ctx, policy, 'Annual leave', 'Balance checked at request date'); S.P.line(ctx, policy, 'Team coverage', 'Minimum ' + s.policy.coverage + ' teammates available');
      const notes = S.P.panel(ctx, rail, 'Approval history', 'clock'); S.P.line(ctx, notes, extras[0].name, 'Leave cancelled / yesterday'); S.P.line(ctx, notes, extras[1].name, 'Approved by team manager');
    };

    BASE.timeoff = function (ctx) {
      const state = pages.get(ctx);
      const { s, size, work } = state;
      const queue = S.P.pane(ctx, work, 'queue', 'hr-queue'), header = S.P.element(ctx, 'div', 'hr-queuehead', queue, 'Assigned requests'); S.P.element(ctx, 'span', '', header, s.requests.length + ' requests');
      const visible = s.requests.filter((p) => S.P.match(ctx, p)); if (!visible.length) S.P.empty(ctx, queue, 'No requests match this search');
      for (const request of visible) {
        S.P.request(ctx, queue, request);
      }
      S.P.history(ctx, queue);
      if (size.width > S.D.timeoffRailWidthAt) {
        S.P.timeoffRail(ctx);
      }
    };
  }

  function installOnboarding(BASE, pages, S) {
    BASE.hireProgress = function (ctx, checklist) {
      const state = pages.get(ctx);
      const { s } = state;
      const hirehead = S.P.element(ctx, 'div', 'hr-hirehead', checklist); S.P.avatar(ctx, hirehead, s.hire); const hiretext = S.P.element(ctx, 'div', '', hirehead); S.P.element(ctx, 'b', '', hiretext, s.hire.name); S.P.element(ctx, 'div', 'hr-muted', hiretext, s.hire.role + ' / Preboarding');
      const n = s.tasks.filter((t) => ctx.model.checked[t.id]).length, progress = S.P.element(ctx, 'div', 'hr-progress', checklist); S.P.element(ctx, 'i', '', progress).style.width = n / s.tasks.length * 100 + '%'; S.P.element(ctx, 'div', 'hr-muted', checklist, `${n} of ${s.tasks.length} assigned tasks complete`);
    };

    BASE.task = function (ctx, checklist, task, i) {
      const b = S.P.element(ctx, 'button', 'hr-check', checklist); b.type = 'button'; b.setAttribute('role', 'checkbox'); b.setAttribute('aria-checked', String(!!ctx.model.checked[task.id]));
      const mark = S.P.element(ctx, 'span', 'hr-checkmark', b); if (ctx.model.checked[task.id]) S.P.icon(ctx, mark, 'check');
      const text = S.P.element(ctx, 'span', '', b, task.label); S.P.element(ctx, 'small', '', text, task.owner); const meta = S.P.element(ctx, 'span', 'hr-taskmeta', b, ctx.model.checked[task.id] ? 'Complete' : 'To do'); S.P.element(ctx, 'small', '', meta, i < 2 ? 'Before day one' : 'First week');
      S.P.decorated(ctx, b, task, 'task'); return b;
    };

    BASE.taskEvents = function (ctx, b, task) {
      b.addEventListener('click', () => S.P.update(ctx, { task: task.id })); S.P.addRef(ctx, 'task/' + task.id, b, 'checklist');
    };

    BASE.checklist = function (ctx, checklist) {
      const state = pages.get(ctx);
      const { s, ui } = state;
      S.P.hireProgress(ctx, checklist);
      const donehead = S.P.element(ctx, 'div', 'hr-grouphead', checklist, 'Before joining'); S.P.element(ctx, 'small', '', donehead, 'Completed');
      for (const label of ['Offer accepted', 'Employment agreement received']) { const row = S.P.element(ctx, 'div', 'hr-readonlytask', checklist); S.P.icon(ctx, row, 'check'); row.append(document.createTextNode(label)); S.P.element(ctx, 'small', '', row, 'People team'); }
      const assigned = S.P.element(ctx, 'div', 'hr-grouphead', checklist, 'Day-one checklist'); S.P.element(ctx, 'small', '', assigned, 'Assigned to you');
      for (const [i, task] of s.tasks.entries()) {
        if (ui.query && !`${task.label} ${task.owner}`.toLowerCase().includes(ui.query)) continue;
        const b = S.P.task(ctx, checklist, task, i); S.P.taskEvents(ctx, b, task);
      }
      if (ui.query && !s.tasks.some((t) => `${t.label} ${t.owner}`.toLowerCase().includes(ui.query))) S.P.empty(ctx, checklist, 'No checklist items match');
      const docs = S.P.element(ctx, 'div', 'hr-grouphead', checklist, 'Documents'); S.P.element(ctx, 'small', '', docs, '2 received');
      for (const label of ['Signed offer.pdf', 'Employment agreement.pdf']) { const row = S.P.element(ctx, 'div', 'hr-profilefile', checklist); S.P.icon(ctx, row, 'file'); row.append(document.createTextNode(label)); S.P.element(ctx, 'span', 'hr-spacer', row); S.P.element(ctx, 'span', 'hr-badge', row, 'Received'); }
    };

    BASE.offer = function (ctx, setup) {
      const state = pages.get(ctx);
      const { s, extras } = state;
      const offer = S.P.element(ctx, 'div', 'hr-offer', setup), accepted = S.P.element(ctx, 'strong', '', offer); S.P.icon(ctx, accepted, 'file'); accepted.append(document.createTextNode('OFFER LETTER / Accepted'));
      const dl = S.P.element(ctx, 'dl', '', offer);
      for (const [label, value] of [['New hire', s.hire.name], ['Location', s.hire.city], ['Start date', s.date], ['Equipment', s.equipment.find((e) => e.id === s.kit).name], ['Manager', extras[4].name]]) { S.P.element(ctx, 'dt', '', dl, label); S.P.element(ctx, 'dd', '', dl, value); }
    };

    BASE.equipment = function (ctx, setup, equipment) {
      const b = S.P.button(ctx, setup, '', null, 'hr-equipment' + (ctx.model.kit === equipment.id ? ' active' : '')); b.setAttribute('aria-pressed', String(ctx.model.kit === equipment.id)); S.P.icon(ctx, b, 'laptop');
      const text = S.P.element(ctx, 'span', '', b); S.P.element(ctx, 'b', '', text, equipment.name); S.P.element(ctx, 'small', '', text, equipment.detail + ' / ' + S.P.money(ctx, equipment.cost));
      if (ctx.model.kit === equipment.id) S.P.icon(ctx, S.P.element(ctx, 'span', 'hr-equipcheck', b), 'check');
      S.P.decorated(ctx, b, equipment, 'equipment'); return b;
    };

    BASE.equipmentEvents = function (ctx, b, equipment) {
      b.addEventListener('click', () => S.P.update(ctx, { kit: equipment.id })); S.P.addRef(ctx, 'equipment/' + equipment.id, b, 'setup');
    };

    BASE.dateField = function (ctx, setup) {
      const label = S.P.element(ctx, 'label', 'hr-fieldlabel', setup, 'Start date (YYYY-MM-DD)'); label.htmlFor = 'hr-start-date';
      const input = S.P.addRef(ctx, 'date', S.P.element(ctx, 'input', 'hr-input', setup), 'setup'); input.id = 'hr-start-date'; input.type = 'text'; input.placeholder = 'YYYY-MM-DD'; input.value = ctx.model.date;
      const validation = S.P.element(ctx, 'div', 'hr-validation', setup);
      input.addEventListener('input', () => { S.P.update(ctx, { date: input.value }, false); validation.textContent = input.value && !/^\d{4}-\d{2}-\d{2}$/.test(input.value) ? 'Use a date in YYYY-MM-DD format.' : ''; });
    };

    BASE.setup = function (ctx, setup) {
      const state = pages.get(ctx);
      const { s } = state;
      S.P.offer(ctx, setup);
      S.P.element(ctx, 'h3', '', setup, 'Equipment assignment'); S.P.element(ctx, 'div', 'hr-footnote', setup, 'Company inventory / Standard provisioning');
      for (const [i, equipment] of s.equipment.entries()) {
        const b = S.P.equipment(ctx, setup, equipment); S.P.equipmentEvents(ctx, b, equipment);
      }
      S.P.element(ctx, 'div', 'hr-footnote', setup, ctx.model.kit ? 'Reserved for ' + s.hire.name + ' / Delivery scheduled' : 'Stock available / Choose an assignment');
      S.P.dateField(ctx, setup);
      const apps = S.P.element(ctx, 'div', 'hr-grouphead', setup, 'Account provisioning'); S.P.element(ctx, 'small', '', apps, 'Scheduled');
      for (const label of ['Work email', 'Payroll access', 'Company directory']) { const row = S.P.element(ctx, 'div', 'hr-readonlytask', setup); S.P.icon(ctx, row, 'clock'); row.append(document.createTextNode(label)); S.P.element(ctx, 'small', '', row, 'On start date'); }
    };

    BASE.onboarding = function (ctx) {
      const state = pages.get(ctx);
      const { work } = state;
      const layout = S.P.element(ctx, 'div', 'hr-onboard', work), checklist = S.P.pane(ctx, layout, 'checklist', 'hr-section');
      S.P.checklist(ctx, checklist);
      const setup = S.P.pane(ctx, layout, 'setup', 'hr-section'); S.P.setup(ctx, setup);
    };
  }

  function installFooter(BASE, pages, S) {
    BASE.stat = function (ctx, fact) {
      const state = pages.get(ctx);
      const { footer } = state;
      const item = S.P.element(ctx, 'span', 'hr-stat', footer, fact.label + ':'); S.P.element(ctx, 'strong', '', item, fact.value);
    };

    BASE.saved = function (ctx) {
      const state = pages.get(ctx);
      const { footer } = state;
      const saved = S.P.element(ctx, 'span', 'hr-save', footer); S.P.icon(ctx, saved, 'check'); saved.append(document.createTextNode(S.D.savedText));
    };

    BASE.locate = function (ctx, t) {
      const state = pages.get(ctx);
      const { refs, panes } = state;
      if (t.pane) return ctx.util.center(panes[t.pane]);
      const key = t.candidate !== undefined ? 'candidate/' + t.candidate : t.stage ? 'stage/' + t.stage : t.employee !== undefined ? 'employee/' + t.employee
        : t.manager !== undefined ? 'manager/' + t.manager : t.decision !== undefined ? `decision/${t.decision}/${t.value}` : t.task ? 'task/' + t.task
          : t.equipment ? 'equipment/' + t.equipment : t.date ? 'date' : t.reject ? 'reject' : t.close ? 'close' : t.search ? 'search' : t.expand ? 'expand/' + t.expand : '';
      if (!refs[key]) throw new Error('use-hr/classic cannot locate ' + JSON.stringify(t));
      const rect = refs[key].node.getBoundingClientRect();
      // A grip point clear of the team-collapse control on employee cards.
      return t.employee !== undefined ? [rect.left + S.D.tree.gripX, rect.top + S.D.tree.gripY] : ctx.util.center(refs[key].node);
    };

    BASE.decorated = function (ctx, node, item, kind) {};

    BASE.rendered = function (ctx) {};
  }

  env.template('use-hr/workspace', (design, def) => {
    let D, P, current;
    const pages = new WeakMap(), BASE = {};
    const S = {
      get current() { return current; }, get ctx() { return current && current.ctx; },
      get spec() { return current && current.s; }, get root() { return current && current.root; },
      get geo() { return current && current.geo; }, set geo(value) { current.geo = value; },
      get ui() { return current && current.ui; }, get refs() { return current && current.refs; },
      get panes() { return current && current.panes; }, get D() { return D; }, get P() { return P; },
    };
    installControls(BASE, pages, S);
    installUpdates(BASE, pages, S);
    installGeometry(BASE, pages, S);
    installShell(BASE, pages, S);
    installRecruiting(BASE, pages, S);
    installOrgchart(BASE, pages, S);
    installTimeoff(BASE, pages, S);
    installOnboarding(BASE, pages, S);
    installFooter(BASE, pages, S);

    ({ D, P } = env.templateDesign('use-hr/workspace', design, def, { tokens: TOKENS, base: BASE, state: S }));
    return {
      render(ctx) {
        const state = { ctx, s: ctx.spec, util: ctx.util, size: ctx.size, C: ctx.content, f: env.taskDef,
          refs: {}, panes: {}, offsets: {}, ui: { query: '', collapsed: new Set() } };
        pages.set(ctx, state);
        P.styles(ctx); state.root = P.frame(ctx); current = state;
        state.extras = P.context(ctx);
        P.shell(ctx); P.draw(ctx); P.rendered(ctx);
        return { anchors: [state.root], sync: () => P.draw(ctx) };
      },
      locate(t) { return P.locate(current.ctx, t); },
    };
  });
})();
