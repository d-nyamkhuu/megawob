/*
 * use-health-records/chart: shared clinical desktop for appointment, order, medrec, vitals and beds.
 * Scenarios share the patient chart shell, controls, tables, scroll mirror and model sync.
 * Named installers group shell, controls, workspaces, details, context and sync parts;
 * each factory keeps its live episode state in a private page object, exposed through S.
 * With design: {}, each scenario exactly reproduces its scaffolded pilot:
 *   appointment: design-use-health-records-appointment-01; order: design-use-health-records-order-01;
 *   medrec: design-use-health-records-medrec-02; vitals: design-use-health-records-vitals-01; beds: design-use-health-records-beds-01.
 * Scenario presets: none; each workspace is called through its named part.
 * Tokens (objects/arrays replace whole values):
 *   accent = 'var(--accent)': accent color, inherited from the site.
 *   panel = 'var(--panel)': panel background, inherited from the site.
 *   bg = 'var(--bg)': page background, inherited from the site.
 *   fg = 'var(--fg)': foreground color, inherited from the site.
 *   line = 'var(--line)': border color, inherited from the site.
 *   muted = 'var(--muted)': secondary text color, inherited from the site.
 *   cautionColor = '#c99330': patient caution color.
 *   invalidColor = '#b47636': invalid field color.
 *   orderWarningColor = '#b2873b': order warning color.
 *   errorColor = '#c66e37': record notice error color.
 *   rootInset = '5px': chart inset.
 *   rootRadius = '3px': chart corner radius.
 *   fontFamily = 'Arial,"Liberation Sans",sans-serif': chart font stack.
 *   fontSize = '11px': chart base font size.
 *   railWidth = '148px': chart navigation width.
 *   contextWidth = '229px': clinical sidebar width.
 *   bedColumns = 3: bed grid columns.
 *   slotHeight = '33px': calendar slot height.
 *   inputHeight = '27px': text input height.
 *   compactWidth = 850: stage width below which compact styles apply.
 *   narrowWidth = 940: stage width below which stacked orders apply.
 *   shortHeight = 430: stage height below which short styles apply.
 *   railMinWidth = 860: minimum stage width showing navigation.
 *   railMinHeight = 350: minimum stage height showing navigation.
 *   contextMinWidth = 1180: minimum stage width showing clinical context.
 *   contextMinHeight = 480: minimum stage height showing clinical context.
 *   brand = 'Fernwell': desktop brand label.
 *   chartLabel = 'Fictional patient chart': chart accessible label.
 *   labels = reference table below: workspace titles by scenario (default: Appointments, Orders, Medications, Flowsheets, Bed management).
 *   tabs = ['Summary','Appointments','Orders','Medications','Flowsheets','Bed management']: chart tab labels.
 *   filters = reference table below: toolbar labels by scenario (default: reference encounter filters).
 *   saveLabels = reference table below: save labels by scenario (default: Schedule visit, Sign order, Complete reconciliation, Save observations).
 *   iconPaths = reference table below: SVG paths by icon key (default: reference clinical icons).
 * Parts (each override is (base, S) => replacement; no return value unless documented):
 *   begin(ctx): before layout; default no-op.
 *   styles(ctx): return structural CSS with resolved colors, fonts and sizes.
 *   frame(ctx): return the chart root and set responsive classes.
 *   context(ctx): seed nurse/clerk/reviewer, worklist and past orders; preserves clinical-desktop draw order.
 *   icon(parent,key): return an inline SVG using D.iconPaths; fallback chart icon.
 *   popup(ctx): return the initially hidden chart information popup.
 *   inspect(title,rows): show read-only popup rows and log chart-information.
 *   tool(parent,label,key,handler): return an icon button with label and handler or read-only popup.
 *   top(ctx): build brand, worklist, search, notifications and team tools.
 *   menu(ctx): build desktop menus and workspace tab.
 *   banner(ctx): build patient identity, encounter and allergy/precaution banner.
 *   tabs(ctx): build chart tabs from D.tabs and D.labels.
 *   body(ctx): return the chart body containing navigation, main and context.
 *   rail(ctx): build navigation links, encounter checklist and clinic worklist.
 *   main(ctx): return the main chart column.
 *   heading(ctx): build workspace title, encounter subtitle and active badge.
 *   toolbar(ctx): build refresh/print tools, encounter filters and view options.
 *   listen(el,type,handler): bind an event for this render; ignore stale episode events.
 *   commit(m): update model then paint the actual accepted model.
 *   transfer(ctx): build draggable active patient tray, then bind transfer behavior.
 *   bindTransfer(tray): attach bed hover, compatibility validation and placement updates.
 *   pane(ctx): return native scroll pane and register it in refs.
 *   section(title,parent=pane): return section body after drawing its title.
 *   readTable(parent,title,headers,rows): return a section with a read-only table; call tableRow for each row.
 *   tableRow(parent,cells): return a read-only table row.
 *   tableCell(parent,value): return a text cell, or title/detail cell when value is an array.
 *   workflow(ctx): build the active encounter status strip.
 *   field(id,parent,wide=false): return a labeled field and register its scroll target; delegate choices or text input.
 *   choice(desc,value,parent): return a choice button, register it, then bind its model update.
 *   bindChoice(button,id,value): attach choice field update.
 *   input(desc,wrap,label): return labeled text input with hint, register it, then bind its model update.
 *   bindInput(input,id): attach typed field update.
 *   lookup(ctx): build ambiguous patient record selection.
 *   appointment(ctx): build visit details/calendar and historical scheduling tables.
 *   order(ctx): build order composer, routing and historical order queue.
 *   medrec(ctx): build reconciliation table, preview and prescription history.
 *   vitals(ctx): build nursing handoff, flowsheet entry and historical observations.
 *   beds(ctx): build capacity board and historical transport/census tables.
 *   miniCalendar(visit): build fixed October 2027 mini calendar (no wall time).
 *   visitDetails(visit): build visit fields and register selected-slot summary.
 *   calendar(workspace): build availability legend, provider/time grid and slot buttons.
 *   slot(cal,provider,t): build/register a busy or available calendar slot and bind selection.
 *   medicationRow(table,med,i): build medication identity/source and three review fields.
 *   observationRow(table,o): return a nursing handoff row with recorded units.
 *   bed(grid,bed): return a registered capacity card with a data-bed-patient node for sync.
 *   orderComposer(composer): build warning, catalog fields, routing and draft preview.
 *   orderQueue(queue): build historical order table.
 *   actions(ctx): build record status/notice and scenario save button (none for beds or lookup).
 *   bindSave(save): validate draft, flag unauthorized signing or save the record.
 *   snapshot(sidebar): build encounter location and care team snapshot.
 *   results(sidebar): build three seeded recent results; keep RNG draws in order.
 *   trend(sidebar): build prior pulse SVG trend.
 *   inbox(sidebar): build nursing/pharmacy/referral inbox.
 *   careNotes(sidebar): build care coordination note.
 *   sidebar(ctx): build clinical context column via snapshot/results/trend/inbox/careNotes.
 *   footer(ctx): build encounter reference and register next appointment text.
 *   paint(m): sync fields, status, calendar, preview and placements from accepted model.
 *   preview(m): rebuild saved/draft preview, preserving dose units and frequency.
 *   mirror(): patch unscored scroll geometry and target extents for closed-loop oracle.
 *   locate(target): return target center (pane: right scrollbar point); read geometry only, throw if absent.
 *   decorated(ctx): after layout and before initial paint/mirror; default no-op.
 *   rendered(ctx): after initial paint/mirror; default no-op; keep anchors fixed.
 * S.ctx/spec/root/body/main/pane/popup/refs/cr and context data read the live episode;
 * S.D/P expose resolved tokens/parts. refs contains registered controls and scroll targets.
 * Replacing controls/cards must retain refs and data-bed-patient nodes used by paint/locate.
 * Keep RNG draws in context, vitals and results in order, including viewport guards.
 * Additional decoration randomness must use ctx.rng.fork(label). No DOM work in the factory.
 */
(function () {
  'use strict';

  const CSS = (D) => `
  .ehr-root{position:absolute;inset:8px;display:flex;flex-direction:column;min-width:0;min-height:0;border:1px solid ${D.line};border-radius:7px;background:${D.panel};color:${D.fg};overflow:hidden;font-size:12px;box-shadow:0 3px 16px #0000000d}
  .ehr-root button,.ehr-root input{font:inherit;color:inherit;box-sizing:border-box}
  .ehr-root button{cursor:pointer;border:1px solid ${D.line};background:${D.panel};border-radius:4px;padding:5px 9px;line-height:1.3}
  .ehr-root button:hover{background:color-mix(in srgb,${D.accent} 10%,${D.panel})}
  .ehr-root button:focus-visible,.ehr-root input:focus-visible{outline:2px solid ${D.accent};outline-offset:1px}
  .ehr-root .ehr-primary{background:${D.accent};color:#fff;border-color:${D.accent};font-weight:650}
  .ehr-top{height:35px;flex:none;background:color-mix(in srgb,${D.accent} 12%,${D.panel});border-bottom:1px solid ${D.line};display:flex;align-items:center;gap:14px;padding:0 12px;font-size:10px}
  .ehr-logo{display:flex;align-items:center;gap:6px;font-size:15px;font-weight:700;letter-spacing:-.4px}.ehr-cross{width:21px;height:21px;background:${D.accent};color:white;border-radius:4px;text-align:center;line-height:21px;font-size:19px}
  .ehr-muted{color:${D.muted}}.ehr-grow{margin-left:auto}.ehr-top .ehr-pill{font-size:9px;letter-spacing:.04em}
  .ehr-banner{flex:none;display:flex;align-items:center;gap:12px;padding:9px 13px;border-bottom:1px solid ${D.line};min-width:0;background:color-mix(in srgb,${D.bg} 25%,${D.panel})}
  .ehr-avatar{width:36px;height:36px;flex:none;border-radius:50%;background:color-mix(in srgb,${D.accent} 15%,${D.panel});color:${D.accent};display:grid;place-items:center;font-size:13px;font-weight:700}
  .ehr-identity{min-width:0;flex:1}.ehr-name{font-size:17px;line-height:21px;font-weight:650;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ehr-demographics{display:flex;flex-wrap:wrap;gap:2px 13px;font-size:10px;color:${D.muted}}
  .ehr-alerts{display:flex;flex-direction:column;gap:3px;font-size:10px;flex:none}.ehr-pill{border:1px solid ${D.line};border-radius:3px;padding:2px 5px;background:${D.panel};white-space:nowrap}.ehr-caution{color:${D.fg};border-left:3px solid ${D.cautionColor};background:color-mix(in srgb,${D.cautionColor} 10%,${D.panel})}
  .ehr-tabs{height:32px;flex:none;display:flex;align-items:stretch;gap:4px;border-bottom:1px solid ${D.line};padding:0 9px;overflow:hidden}.ehr-tabs span{font-size:11px;white-space:nowrap;padding:7px 10px;color:${D.muted};border-bottom:2px solid transparent}.ehr-tabs .active{color:${D.accent};border-color:${D.accent};font-weight:650}
  .ehr-body{flex:1;min-height:0;display:flex}.ehr-rail{width:145px;flex:none;border-right:1px solid ${D.line};background:color-mix(in srgb,${D.bg} 55%,${D.panel});padding:12px;font-size:10px;overflow:auto}.ehr-rail h4{font-size:10px;text-transform:uppercase;letter-spacing:.05em;color:${D.muted};margin:3px 0 9px}.ehr-rail p{margin:6px 0 17px;line-height:1.6}.ehr-rail .ehr-raillink{padding:6px 7px;border-radius:3px;margin:2px 0}.ehr-rail .selected{background:color-mix(in srgb,${D.accent} 12%,${D.panel});color:${D.accent};font-weight:650}
  .ehr-main{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column}.ehr-heading{flex:none;display:flex;align-items:center;gap:9px;height:37px;padding:0 12px;border-bottom:1px solid ${D.line}}.ehr-heading h2{margin:0;font-size:14px;font-weight:650}.ehr-heading small{font-size:10px;color:${D.muted}}
  .ehr-pane{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;scrollbar-width:thin;padding:12px;scroll-behavior:auto;position:relative}.ehr-pane h3{font-size:12px;margin:0 0 8px}.ehr-section{border:1px solid ${D.line};border-radius:4px;margin-bottom:12px;overflow:hidden}.ehr-sectionhead{background:color-mix(in srgb,${D.bg} 65%,${D.panel});border-bottom:1px solid ${D.line};padding:6px 9px;font-size:10px;font-weight:650;display:flex;justify-content:space-between;gap:10px}.ehr-sectionbody{padding:10px}
  .ehr-formgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 15px}.ehr-field{min-width:0}.ehr-field label{display:block;font-size:10px;font-weight:650;margin-bottom:4px}.ehr-field small{display:block;color:${D.muted};font-size:9px;margin-top:3px;line-height:13px}.ehr-field input{height:30px;width:100%;border:1px solid ${D.line};border-radius:3px;background:${D.panel};padding:4px 8px;user-select:text;-webkit-user-select:text}
  .ehr-choices{display:flex;flex-wrap:wrap;gap:3px}.ehr-choices button{padding:5px 7px;font-size:10px;min-height:27px}.ehr-choices button[aria-pressed=true]{color:${D.accent};border-color:${D.accent};background:color-mix(in srgb,${D.accent} 10%,${D.panel});font-weight:650}
  .ehr-wide{grid-column:1/-1}.ehr-note{font-size:10px;color:${D.muted};line-height:1.5;margin:0 0 10px}.ehr-empty{padding:18px;text-align:center;color:${D.muted};font-size:11px;border:1px dashed ${D.line};margin:8px 0}
  .ehr-actions{flex:none;border-top:1px solid ${D.line};padding:7px 12px;background:color-mix(in srgb,${D.bg} 40%,${D.panel});display:flex;gap:9px;align-items:center;min-height:44px}.ehr-actiontext{flex:1;font-size:10px;line-height:14px;min-width:0}.ehr-actiontext b{display:block;color:${D.fg};font-weight:600}.ehr-error{color:${D.errorColor};white-space:normal}.ehr-foot{height:21px;flex:none;padding:3px 10px;border-top:1px solid ${D.line};display:flex;gap:12px;font-size:9px;color:${D.muted};overflow:hidden;white-space:nowrap}
  .ehr-appt{display:grid;grid-template-columns:minmax(175px,.55fr) minmax(0,1.45fr);align-items:start;gap:12px}.ehr-visit{min-width:0}.ehr-calendar{display:grid;grid-template-columns:40px repeat(var(--providers),minmax(0,1fr));border-left:1px solid ${D.line};border-top:1px solid ${D.line};font-size:10px}.ehr-calhead{position:sticky;top:-12px;z-index:2;background:${D.panel};font-weight:650;padding:7px 4px;min-width:0;border-right:1px solid ${D.line};border-bottom:1px solid ${D.line};text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ehr-time{padding:9px 3px;color:${D.muted};border-right:1px solid ${D.line};border-bottom:1px solid ${D.line};text-align:center}.ehr-calendar button.ehr-slot{height:35px;border-radius:0;border-top:0;border-left:0;font-size:9px;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}.ehr-slot.busy{background:color-mix(in srgb,${D.muted} 10%,${D.panel});border-left:3px solid ${D.muted}!important;color:${D.muted};cursor:default}.ehr-slot.selected{background:color-mix(in srgb,${D.accent} 18%,${D.panel})!important;border-left:3px solid ${D.accent}!important;color:${D.accent}}
  .ehr-medhead,.ehr-medrow{display:grid;grid-template-columns:minmax(95px,1fr) 157px 68px 115px;gap:8px;align-items:center;padding:8px 9px;border-bottom:1px solid ${D.line}}.ehr-medhead{font-size:9px;color:${D.muted};background:color-mix(in srgb,${D.bg} 70%,${D.panel});padding-top:6px;padding-bottom:6px}.ehr-medrow{min-height:77px}.ehr-medrow:last-child{border-bottom:0}.ehr-medrow strong{font-size:11px}.ehr-medrow small{font-size:9px;display:block;color:${D.muted};margin-top:3px}.ehr-medrow .ehr-choices button{padding:5px 4px;font-size:9px}.ehr-medrow .ehr-field label{display:none}.ehr-medrow input{font-size:11px}
  .ehr-observations{width:100%;border-collapse:collapse;font-size:10px}.ehr-observations th,.ehr-observations td{text-align:left;padding:7px 8px;border-bottom:1px solid ${D.line};white-space:nowrap}.ehr-observations th{font-size:9px;color:${D.muted};font-weight:500}.ehr-observations tr:last-child td{border-bottom:0}.ehr-orderpreview{margin-top:12px;border-left:3px solid ${D.accent};background:color-mix(in srgb,${D.accent} 5%,${D.panel});padding:9px;font-size:11px;line-height:1.7;overflow-wrap:anywhere}.ehr-previewlabel{font-size:9px;color:${D.muted};text-transform:uppercase;letter-spacing:.05em}
  .ehr-transfer{flex:none;margin:8px 12px 0;padding:7px 10px;display:flex;align-items:center;gap:12px;border:1px solid ${D.line};border-left:3px solid ${D.accent};border-radius:4px;cursor:grab;touch-action:none;background:color-mix(in srgb,${D.accent} 6%,${D.panel});font-size:11px}.ehr-transfer strong{display:block}.ehr-transfer small{font-size:9px;color:${D.muted}}.ehr-transfer.dragging{outline:2px dashed ${D.accent};opacity:.65}.ehr-bedgrid{display:grid;grid-template-columns:repeat(${D.bedColumns},minmax(0,1fr));gap:9px}.ehr-bed{min-height:118px;min-width:0;border:1px solid ${D.line};border-radius:5px;padding:8px;display:flex;flex-direction:column;gap:5px;font-size:10px}.ehr-bed header{display:flex;justify-content:space-between;gap:5px;align-items:center}.ehr-bed b{font-size:13px}.ehr-bed small{font-size:9px;color:${D.muted}}.ehr-bed .ehr-bedpatient{margin-top:auto;font-size:10px;border-radius:3px;background:color-mix(in srgb,${D.accent} 13%,${D.panel});padding:5px}.ehr-bed.over{outline:2px solid ${D.accent}}.ehr-bed.occupied{background:color-mix(in srgb,${D.muted} 7%,${D.panel})}
  .ehr-records{display:grid;gap:12px;padding:6px 0}.ehr-record{display:flex;align-items:center;gap:15px;padding:15px;border:1px solid ${D.line};border-radius:5px}.ehr-record strong{font-size:14px;display:block}.ehr-record small{display:block;color:${D.muted};font-size:11px;margin-top:4px}.ehr-compact .ehr-top{gap:9px}.ehr-compact .ehr-top .ehr-topextra{display:none}.ehr-compact .ehr-alerts{font-size:9px}.ehr-compact .ehr-formgrid{gap:9px}.ehr-compact .ehr-tabs span{padding:7px 6px;font-size:10px}.ehr-compact .ehr-medhead,.ehr-compact .ehr-medrow{grid-template-columns:minmax(80px,1fr) 139px 54px 100px;gap:5px;padding-left:6px;padding-right:6px}.ehr-compact .ehr-medrow .ehr-choices button{padding:5px 3px;font-size:9px}.ehr-compact .ehr-identity .ehr-name{font-size:15px}.ehr-compact .ehr-banner{padding:7px 9px;gap:8px}.ehr-compact .ehr-pane{padding:9px}.ehr-compact .ehr-bed{padding:6px;font-size:9px;min-height:110px}.ehr-compact .ehr-avatar{width:30px;height:30px}
  /* Dense clinical desktop. Historical rows are distinct from the active encounter. */
  .ehr-root{inset:${D.rootInset};border-radius:${D.rootRadius};font-family:${D.fontFamily};font-size:${D.fontSize};box-shadow:0 1px 7px #0001}
  .ehr-icon{width:15px;height:15px;flex:none;vertical-align:middle;stroke:currentColor;fill:none;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
  .ehr-root button.ehr-iconbtn{display:inline-flex;align-items:center;justify-content:center;gap:5px;padding:3px 6px;font-size:10px;min-height:23px;border-radius:2px;background:transparent}.ehr-root button.ehr-icononly{width:25px;padding:3px}
  .ehr-top{height:31px;gap:10px;padding:0 9px;background:color-mix(in srgb,${D.accent} 12%,${D.panel})}.ehr-logo{font-size:14px}.ehr-cross{display:grid;place-items:center;width:20px;height:20px;border-radius:3px}.ehr-cross svg{width:15px;height:15px;stroke-width:2.5}.ehr-top .ehr-iconbtn{border-color:transparent}.ehr-top .ehr-global-search{margin-left:auto;min-width:100px;max-width:220px;flex:1;justify-content:flex-start;background:${D.panel};border:1px solid ${D.line};color:${D.muted}}
  .ehr-menubar{height:25px;flex:none;display:flex;align-items:center;gap:4px;padding:0 8px;border-bottom:1px solid ${D.line};background:color-mix(in srgb,${D.bg} 50%,${D.panel});font-size:10px}.ehr-menubar button{border:0;padding:3px 8px;border-radius:0;background:transparent;font-size:10px}.ehr-workspace-tab{height:25px;display:inline-flex;align-items:center;gap:6px;border-bottom:2px solid ${D.accent};margin-left:13px;padding:0 10px;font-weight:600;background:${D.panel}}
  .ehr-banner{padding:6px 10px;gap:9px;min-height:57px}.ehr-avatar{width:31px;height:31px;border-radius:4px}.ehr-name{font-size:16px;line-height:19px}.ehr-demographics{gap:1px 12px}.ehr-encounter{display:flex;gap:12px;font-size:9px;color:${D.muted};margin-top:3px;flex-wrap:wrap}.ehr-encounter b{font-weight:500;color:${D.fg}}.ehr-alerts{gap:4px}.ehr-caution{display:flex;align-items:center;gap:4px}.ehr-caution .ehr-icon{height:12px;width:12px}.ehr-tabs{height:27px;padding:0 6px;gap:1px}.ehr-tabs span{padding:5px 8px;font-size:10px}.ehr-tabs .ehr-tabcount{font-size:9px;border:0;color:${D.muted};padding-left:3px}
  .ehr-rail{width:${D.railWidth};padding:8px 7px;font-size:10px;scrollbar-width:thin;overscroll-behavior:contain}.ehr-rail h4{font-size:9px;margin:8px 4px 4px;letter-spacing:.06em}.ehr-rail .ehr-raillink{display:flex;align-items:center;gap:6px;padding:5px 6px;margin:0;border-radius:2px;line-height:13px}.ehr-raillink .ehr-icon{height:13px;width:13px;opacity:.8}.ehr-count{margin-left:auto;color:${D.muted};font-size:9px;line-height:14px;padding:0 4px;border-radius:2px;background:color-mix(in srgb,${D.muted} 9%,${D.panel})}.ehr-problem{padding:4px 7px;border-bottom:1px solid color-mix(in srgb,${D.line} 50%,transparent);font-size:9px;line-height:14px}.ehr-problem small{display:block;color:${D.muted};font-size:9px}.ehr-rail-patient{display:flex;gap:5px;padding:5px 4px;border-bottom:1px solid ${D.line};font-size:9px;line-height:13px}.ehr-rail-patient b{display:block;font-weight:500}.ehr-rail-patient small{font-size:9px;color:${D.muted}}
  .ehr-heading{height:31px;padding:0 9px;gap:7px}.ehr-heading h2{font-size:13px}.ehr-heading small{font-size:9px}.ehr-toolbar{min-height:29px;flex:none;display:flex;align-items:center;gap:5px;padding:3px 8px;border-bottom:1px solid ${D.line};font-size:9px;background:color-mix(in srgb,${D.bg} 40%,${D.panel});white-space:nowrap;overflow:hidden}.ehr-toolbar .ehr-toolgroup{display:flex;align-items:center;gap:2px;border-right:1px solid ${D.line};padding-right:6px;margin-right:3px}.ehr-toolbar .ehr-filter{padding:3px 6px;border:1px solid ${D.line};background:${D.panel};border-radius:2px;overflow:hidden;text-overflow:ellipsis}.ehr-toolbar .ehr-iconbtn{white-space:nowrap}
  .ehr-pane{padding:8px;background:color-mix(in srgb,${D.bg} 38%,${D.panel});scrollbar-color:${D.muted} transparent}.ehr-section{background:${D.panel};border-radius:2px;margin-bottom:8px}.ehr-sectionhead{padding:5px 7px;font-size:10px;min-height:24px}.ehr-sectionbody{padding:8px}.ehr-formgrid{gap:8px 11px}.ehr-field label{font-size:10px;font-weight:600;margin-bottom:3px}.ehr-field input{height:${D.inputHeight};border-radius:2px;font-size:11px}.ehr-field small{font-size:9px;line-height:11px}.ehr-choices{gap:3px}.ehr-choices button{padding:4px 6px;min-height:25px;border-radius:2px}.ehr-field.invalid input{border-color:${D.invalidColor}}.ehr-field.invalid label{color:${D.fg};text-decoration:underline;text-decoration-color:${D.invalidColor};text-underline-offset:3px}.ehr-note{font-size:10px;line-height:14px;margin-bottom:7px}.ehr-actions{min-height:39px;padding:5px 9px;gap:8px}.ehr-actions button{font-size:11px;border-radius:2px;padding:5px 10px}.ehr-actiontext{font-size:9px;line-height:12px}.ehr-foot{height:20px;font-size:9px;gap:9px}.ehr-orderpreview{font-size:10px;line-height:1.6;margin-top:8px;padding:7px}.ehr-previewlabel{font-size:9px}
  .ehr-context{width:${D.contextWidth};flex:none;padding:8px;border-left:1px solid ${D.line};background:color-mix(in srgb,${D.bg} 55%,${D.panel});overflow:auto;scrollbar-width:thin;font-size:10px}.ehr-context .ehr-sectionbody{padding:6px}.ehr-context h4{font-size:10px;margin:0}.ehr-contextrow{display:flex;justify-content:space-between;gap:8px;padding:5px 0;border-bottom:1px solid ${D.line};font-size:10px;line-height:14px}.ehr-contextrow:last-child{border:0}.ehr-contextrow b{font-weight:500}.ehr-contextrow small{display:block;font-size:9px;color:${D.muted}}.ehr-contextrow .ehr-icon{width:12px;height:12px;margin-right:4px}.ehr-context .ehr-pill{font-size:9px;padding:1px 4px}.ehr-taskstatus{display:flex;gap:6px;align-items:center;padding:5px 7px;border:1px solid ${D.line};background:${D.panel};font-size:10px;margin-bottom:7px}.ehr-taskstatus small{font-size:9px;color:${D.muted};margin-left:auto}.ehr-taskstatus .ehr-icon{width:13px;height:13px}.ehr-status-text{font-weight:600}
  .ehr-tablewrap{overflow:auto;max-width:100%;scrollbar-width:thin}.ehr-data{width:100%;border-collapse:collapse;font-size:10px;line-height:13px;background:${D.panel}}.ehr-data th{color:${D.muted};font-size:9px;font-weight:600;background:color-mix(in srgb,${D.bg} 65%,${D.panel});white-space:nowrap}.ehr-data th,.ehr-data td{padding:5px 7px;border-bottom:1px solid ${D.line};text-align:left;vertical-align:top}.ehr-data td:first-child{font-weight:500}.ehr-data td small{display:block;font-size:9px;color:${D.muted}}.ehr-data tr:last-child td{border-bottom:0}.ehr-data tbody tr:nth-child(even){background:color-mix(in srgb,${D.bg} 30%,${D.panel})}.ehr-data .ehr-pill{font-size:9px;padding:1px 3px}.ehr-mono{font-variant-numeric:tabular-nums}.ehr-tiny{font-size:9px;color:${D.muted}}.ehr-section .ehr-tablewrap{margin:-8px}.ehr-section .ehr-contextrow{padding:5px 0}
  .ehr-orderlayout{display:grid;grid-template-columns:minmax(0,1.35fr) minmax(210px,.85fr);gap:8px;align-items:start}.ehr-orderlayout>div{min-width:0}.ehr-catalogmeta{display:flex;gap:8px;font-size:9px;color:${D.muted};border-bottom:1px solid ${D.line};padding:0 0 6px;margin-bottom:8px}.ehr-orderflag{padding:6px 7px;border-left:3px solid ${D.orderWarningColor};background:color-mix(in srgb,${D.orderWarningColor} 8%,${D.panel});font-size:10px;line-height:14px;margin-bottom:8px;display:flex;align-items:center;gap:6px}.ehr-orderflag .ehr-icon{width:13px;height:13px}.ehr-medhead,.ehr-medrow{grid-template-columns:minmax(120px,1fr) 157px 60px 105px;gap:6px;padding:6px 8px}.ehr-medrow{min-height:61px}.ehr-medrow small{line-height:12px;margin-top:2px}.ehr-medrow .ehr-field small{display:none}.ehr-medrow .ehr-choices button{min-height:25px;padding:4px 4px}.ehr-medrow .ehr-field label{display:none}.ehr-medrow .ehr-pill{font-size:8px;padding:0 3px;margin-right:4px}.ehr-medhead{padding:5px 8px}.ehr-medmeta{font-size:9px;color:${D.muted};line-height:12px;margin-top:2px}.ehr-observations th,.ehr-observations td{padding:5px 7px}.ehr-observations th{font-weight:600}.ehr-handoff-meta{font-size:9px;color:${D.muted};padding:4px 0 6px}.ehr-trend{width:100%;height:45px;display:block;stroke:${D.accent};fill:none;stroke-width:1.7}
  .ehr-appt{grid-template-columns:minmax(180px,.6fr) minmax(0,1.4fr);gap:8px}.ehr-calendar button.ehr-slot{height:${D.slotHeight};font-size:10px;padding:3px 5px;line-height:13px}.ehr-calendar button.ehr-slot small{display:block;font-size:8px;opacity:.8}.ehr-calhead{font-size:10px;padding:6px 4px;top:-8px}.ehr-time{font-size:10px;padding:8px 2px;font-variant-numeric:tabular-nums}.ehr-calmini{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;font-size:9px;text-align:center;margin-bottom:7px}.ehr-calmini span{padding:3px 0}.ehr-calmini .selected{background:${D.accent};color:white;border-radius:2px}.ehr-callegend{display:flex;flex-wrap:wrap;gap:8px;font-size:9px;padding:5px 0;color:${D.muted}}.ehr-callegend i{display:inline-block;width:8px;height:8px;background:color-mix(in srgb,${D.accent} 35%,${D.panel});margin-right:3px;border:1px solid ${D.line}}.ehr-callegend i.busy{background:color-mix(in srgb,${D.muted} 30%,${D.panel})}
  .ehr-transfer{margin:5px 8px 0;padding:5px 8px;border-radius:2px;gap:7px}.ehr-transfer strong{font-size:11px}.ehr-transfer small{font-size:9px}.ehr-bedgrid{gap:7px}.ehr-bed{min-height:126px;border-radius:2px;padding:7px;gap:4px;background:${D.panel};border-top:3px solid color-mix(in srgb,${D.accent} 55%,${D.line})}.ehr-bed.occupied{border-top-color:${D.muted}}.ehr-bed header .ehr-icon{height:13px;width:13px}.ehr-bed .ehr-bedpatient{border-radius:2px;padding:5px 4px;background:color-mix(in srgb,${D.accent} 9%,${D.panel});line-height:13px}.ehr-bed small{font-size:9px}.ehr-census{display:flex;align-items:center;gap:9px;flex-wrap:wrap;margin:0 0 7px;padding:6px 7px;background:${D.panel};border:1px solid ${D.line};font-size:10px}.ehr-census b{font-size:12px;margin-right:3px}.ehr-census span{padding-right:10px;border-right:1px solid ${D.line}}
  .ehr-popup{position:absolute;z-index:35;top:31px;right:9px;width:310px;max-width:calc(100% - 20px);max-height:calc(100% - 50px);overflow:auto;border:1px solid ${D.line};background:${D.panel};box-shadow:0 5px 20px #0003;border-radius:3px;padding:10px;font-size:11px}.ehr-popup header{display:flex;align-items:center;justify-content:space-between;padding-bottom:7px;border-bottom:1px solid ${D.line};margin-bottom:5px;font-weight:600}.ehr-popup[hidden]{display:none}.ehr-popup .ehr-iconbtn{padding:2px}.ehr-popup p{font-size:10px;color:${D.muted};line-height:15px;margin:7px 0}
  .ehr-taskstatus{white-space:nowrap;overflow:hidden}.ehr-status-text{overflow:hidden;text-overflow:ellipsis}.ehr-savebutton{display:inline-flex;align-items:center;gap:6px}.ehr-narrow .ehr-orderlayout{grid-template-columns:1fr}.ehr-narrow .ehr-encounter .ehr-enc-extra{display:none}.ehr-compact .ehr-top{gap:5px}.ehr-compact .ehr-medhead,.ehr-compact .ehr-medrow{grid-template-columns:minmax(100px,1fr) 139px 52px 99px;gap:5px;padding:6px}.ehr-compact .ehr-medrow{min-height:60px}.ehr-compact .ehr-tabs span{font-size:10px;padding:5px 5px}.ehr-compact .ehr-banner{padding:6px 8px}.ehr-compact .ehr-pane{padding:7px}.ehr-compact .ehr-bed{min-height:126px}.ehr-compact .ehr-calhead{font-size:9px}.ehr-short .ehr-menubar{display:none}.ehr-short .ehr-encounter{display:none}
  `;

  const TOKENS = {
    accent: 'var(--accent)',
    panel: 'var(--panel)',
    bg: 'var(--bg)',
    fg: 'var(--fg)',
    line: 'var(--line)',
    muted: 'var(--muted)',
    cautionColor: '#c99330',
    invalidColor: '#b47636',
    orderWarningColor: '#b2873b',
    errorColor: '#c66e37',
    rootInset: '5px',
    rootRadius: '3px',
    fontFamily: 'Arial,"Liberation Sans",sans-serif',
    fontSize: '11px',
    railWidth: '148px',
    contextWidth: '229px',
    bedColumns: 3,
    slotHeight: '33px',
    inputHeight: '27px',
    compactWidth: 850,
    narrowWidth: 940,
    shortHeight: 430,
    railMinWidth: 860,
    railMinHeight: 350,
    contextMinWidth: 1180,
    contextMinHeight: 480,
    brand: 'Fernwell',
    chartLabel: 'Fictional patient chart',
    labels: {appointment:'Appointments',order:'Orders',medrec:'Medications',vitals:'Flowsheets',beds:'Bed management'},
    tabs: ['Summary','Appointments','Orders','Medications','Flowsheets','Bed management'],
    filters: {appointment:['Day view','North clinic','All providers'],order:['Current encounter','Active + completed'],medrec:['Home medications','All sources'],vitals:['18 Oct 2027','All observations'],beds:['North + South wards','All bed states']},
    saveLabels: {appointment:'Schedule visit',order:'Sign order',medrec:'Complete reconciliation',vitals:'Save observations'},
    iconPaths: {cross:'M12 4v16M4 12h16',search:'M10.5 17a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13Zm5-2 5 5',
            bell:'M5 17h14l-2-4V9a5 5 0 0 0-10 0v4l-2 4Zm5 3h4',user:'M8 7a4 4 0 1 0 8 0 4 4 0 0 0-8 0ZM4 21v-2a8 8 0 0 1 16 0v2',
            chart:'M5 3h14v18H5zM8 7h8M8 11h8M8 15h5',list:'M8 5h13M8 12h13M8 19h13M3 5h1M3 12h1M3 19h1',
            clock:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2',check:'M4 12l5 5L20 6',
            warn:'M12 3 2 21h20L12 3ZM12 9v5M12 17v1',refresh:'M20 8a9 9 0 1 0 0 9M20 3v6h-6',
            filter:'M3 4h18l-7 8v7l-4 2V12L3 4Z',print:'M7 8V3h10v5M7 17H3V9h18v8h-4M7 14h10v7H7z',
            calendar:'M4 5h16v16H4zM8 2v6M16 2v6M4 10h16M8 14h2M14 14h2M8 18h2',
            bed:'M3 18v3M21 18v3M3 10v8h18v-8H3ZM5 10V4h14v6M7 8h3M14 8h3',
            lab:'M8 3h8M10 3v7L4 20h16l-6-10V3M8 15h8',med:'M7 17 17 7M4 20a5 5 0 0 1 0-7l9-9a5 5 0 0 1 7 7l-9 9a5 5 0 0 1-7 0Z',
            close:'M5 5l14 14M19 5 5 19',arrow:'M8 5l7 7-7 7',grip:'M8 5h1M15 5h1M8 12h1M15 12h1M8 19h1M15 19h1',
            mail:'M3 5h18v14H3zM3 6l9 7 9-7',heart:'M2 12h5l3-7 4 14 3-7h5',folder:'M3 6h7l2 3h9v12H3z',
            link:'M9 8 7 6a4 4 0 0 0-6 6l4 4a4 4 0 0 0 6 0M15 16l2 2a4 4 0 0 0 6-6l-4-4a4 4 0 0 0-6 0M8 12h8'},
  };

  function installShellParts(BASE, page) {
    BASE.begin = (ctx) => {};

    BASE.styles = (ctx) => {
      return CSS(page.D);
    };

    BASE.frame = (ctx) => {
      const el=page.u.el('section','ehr-root',ctx.stage);el.setAttribute('aria-label',page.D.chartLabel);
      el.classList.toggle('ehr-compact',ctx.size.width<page.D.compactWidth);
      el.classList.toggle('ehr-narrow',ctx.size.width<page.D.narrowWidth);
      el.classList.toggle('ehr-short',ctx.size.height<page.D.shortHeight);
      return el;
    };

    BASE.context = (ctx) => {
      page.cr=ctx.rng.fork('clinical-desktop');const C=ctx.content;
      const person=()=>C.personName(page.cr,{csplit:page.s.csplit}).full;
      page.nurse=person(),page.clerk=person(),page.reviewer=person();
      page.worklist=Array.from({length:9},(_,i)=>({name:person(),time:page.f.time(540+i*30),room:`${101+i}`,state:['Arrived','Roomed','Scheduled','Checked out'][i%4]}));
      page.pastOrders=Array.from({length:9},(_,i)=>({name:['CBC with differential','Basic metabolic panel','Nursing communication','Observation schedule','Specimen collection','Hepatic function panel','Follow-up referral','Care plan review','Thyroid screening'][i],
        date:`${15-i} Oct 2027`,state:['Final','In process','Signed','Completed'][i%4],by:i%2?page.s.providers[0]:page.reviewer}));
    };

    BASE.icon = (parent,key) => {
      const el=page.u.svg('svg',{viewBox:'0 0 24 24',class:'ehr-icon','aria-hidden':'true',focusable:'false'},parent);
      page.u.svg('path',{d:page.D.iconPaths[key]||page.D.iconPaths.chart},el);return el;
    };

    BASE.popup = (ctx) => {
      const el=page.u.el('aside','ehr-popup',page.root);el.hidden=true;el.setAttribute('aria-label','Chart information');
      return el;
    };

    BASE.inspect = (title,rows) => {
      page.popup.replaceChildren();page.popup.hidden=false;
      const header=page.u.el('header','',page.popup);page.u.el('span','',header,title);
      const close=page.u.el('button','ehr-iconbtn ehr-icononly',header);page.P.icon(close,'close');close.setAttribute('aria-label','Close chart information');page.P.listen(close,'click',()=>{page.popup.hidden=true;});
      for(const [label,detail,state] of rows) {const row=page.u.el('div','ehr-contextrow',page.popup),text=page.u.el('div','',row);page.u.el('b','',text,label);if(detail)page.u.el('small','',text,detail);if(state)page.u.el('span','ehr-tiny',row,state);}
      page.ctx.log('chart-information',{title});
    };

    BASE.tool = (parent,label,key,handler) => {
      const button=page.u.el('button','ehr-iconbtn',parent);button.type='button';page.P.icon(button,key);if(label)page.u.el('span','',button,label);
      page.P.listen(button,'click',handler||(()=>page.P.inspect(label,[[label,'Available in the chart review workspace','Read only']])));return button;
    };

    BASE.top = (ctx) => {
      const top=page.u.el('div','ehr-top',page.root),logo=page.u.el('div','ehr-logo',top);
      page.P.icon(page.u.el('span','ehr-cross',logo),'cross');page.u.el('span','',logo,page.D.brand);
      page.P.tool(top,'Worklist','list',()=>page.P.inspect('Clinic worklist',page.worklist.map(p=>[p.name,`${p.time} | Room ${p.room}`,p.state])));
      const search=page.P.tool(top,'Search chart / patient','search',()=>page.P.inspect('Chart index',[[page.s.patient.name,'Verify DOB and MRN before opening','Patient'],['Encounter documents','Notes, results and correspondence','12'],['Clinical orders','Current and historical orders','9']]));search.classList.add('ehr-global-search');
      page.u.el('span','ehr-topextra ehr-pill',top,'FICTIONAL RECORDS');
      page.P.tool(top,'3','bell',()=>page.P.inspect('Notifications',[[`Message from ${page.nurse}`,'Medication source list received','14:22'],['Laboratory interface','Specimen received; results pending','14:18'],['Department update','North clinic handover at 15:00','14:10']]));
      page.P.tool(top,'Clinical team','user',()=>page.P.inspect('Signed-in workspace',[[page.clerk,'Clinical documentation team','Active'],['North clinic','Outpatient and inpatient access','Connected']]));
    };

    BASE.menu = (ctx) => {
      const menu=page.u.el('div','ehr-menubar',page.root);
      for(const title of ['Patient','Chart','Orders','View','Tools','Help']) {
        const button=page.u.el('button','',menu,title);page.P.listen(button,'click',()=>page.P.inspect(title,[[`${title} workspace`,'Chart review, document history and encounter information',''],['Session status','Connected to the clinical record','Online']]));
      }
      const workspaceTab=page.u.el('span','ehr-workspace-tab',menu);page.P.icon(workspaceTab,'chart');page.u.el('span','',workspaceTab,'Patient chart');
      page.u.el('span','ehr-grow ehr-muted',menu,'North clinic | Documentation');
    };

    BASE.banner = (ctx) => {
      const banner=page.u.el('div','ehr-banner',page.root);
      page.u.el('div','ehr-avatar',banner,page.unidentified?'?':page.s.patient.name.split(' ').map(x=>x[0]).slice(0,2).join(''));
      const identity=page.u.el('div','ehr-identity',banner);page.u.el('div','ehr-name',identity,page.unidentified?'No patient selected':page.s.patient.name);
      const demographics=page.u.el('div','ehr-demographics',identity);
      if(page.unidentified) page.u.el('span','',demographics,`Search: ${page.s.patient.name} · 2 matching records`);
      else {page.u.el('span','',demographics,`DOB ${page.s.patient.dob}`);page.u.el('span','',demographics,page.s.patient.sex);page.u.el('span','',demographics,`MRN ${page.s.patient.mrn}`);}
      if(!page.unidentified) {
        const encounter=page.u.el('div','ehr-encounter',identity);page.u.el('b','',encounter,page.s.scenario==='beds'?'Inpatient | Admitted 17 Oct 2027':'Outpatient | 18 Oct 2027');
        page.u.el('span','',encounter,`Attending: ${page.s.providers[0]}`);page.u.el('span','ehr-enc-extra',encounter,'Preferred language: English | Portal active');
      }
      const alerts=page.u.el('div','ehr-alerts',banner),allergy=page.u.el('span','ehr-pill ehr-caution',alerts);page.P.icon(allergy,page.unidentified?'warn':'check');page.u.el('span','',allergy,page.unidentified?'Verify date of birth':'No known allergies | Reviewed');
      page.u.el('span','ehr-muted',alerts,page.unidentified?'Patient identity not confirmed':`${page.s.patient.isolation==='None'?'Standard':page.s.patient.isolation} precautions · Acuity ${page.s.patient.acuity}`);
    };

    BASE.tabs = (ctx) => {
      const tabs=page.u.el('nav','ehr-tabs',page.root);tabs.setAttribute('aria-label','Chart sections');
      for(const label of page.D.tabs)
        page.u.el('span',label===page.D.labels[page.s.scenario]?'active':'',tabs,label);
    };

    BASE.body = (ctx) => {
      return page.u.el('div','ehr-body',page.root);
    };

    BASE.rail = (ctx) => {
      const rail=page.u.el('aside','ehr-rail',page.body);page.u.el('h4','',rail,'Patient chart');
      for(const [text,key,count] of [['Encounter summary','chart',''],['Chart review','list','12'],['Problem list','heart','4'],['Medications','med',page.s.meds.length||'5'],['Orders','lab','9'],['Results review','lab','6'],['Flowsheets','chart','3'],['Documents','folder','12'],['Care team','user','4'],['Appointments','calendar','2'],['Bed management','bed',page.s.beds.length||'6']]) {
        const row=page.u.el('div',text===page.D.labels[page.s.scenario]?'ehr-raillink selected':'ehr-raillink',rail);page.P.icon(row,key);page.u.el('span','',row,text);if(count)page.u.el('span','ehr-count',row,String(count));
      }
      page.u.el('h4','',rail,'Encounter checklist');
      for(const [label,state] of [['Allergy review','Reviewed'],['Medication history','In progress'],['Screenings','Complete'],['Visit documentation','Unsigned']]){const row=page.u.el('div','ehr-problem',rail,label);page.u.el('small','',row,state);}
      page.u.el('h4','',rail,'Clinic worklist');
      for(const p of page.worklist.slice(0,5)){const row=page.u.el('div','ehr-rail-patient',rail);page.P.icon(row,'user');const info=page.u.el('div','',row);page.u.el('b','',info,p.name);page.u.el('small','',info,`${p.time} | ${p.state}`);}
    };

    BASE.main = (ctx) => {
      return page.u.el('div','ehr-main',page.body);
    };

    BASE.heading = (ctx) => {
      const heading=page.u.el('div','ehr-heading',page.main);
      page.u.el('h2','',heading,page.s.judge?.mode==='ambiguous'?'Patient lookup':page.D.labels[page.s.scenario]);
      page.u.el('small','',heading,page.s.scenario==='appointment'?page.s.date:page.s.scenario==='beds'?'North / South wards':'Outpatient encounter');
      page.u.el('span','ehr-grow ehr-pill',heading,page.s.scenario==='order'?page.s.orderKind:'Active');
    };

    BASE.toolbar = (ctx) => {
      const toolbar=page.u.el('div','ehr-toolbar',page.main),tools=page.u.el('div','ehr-toolgroup',toolbar);
      page.P.tool(tools,'Refresh','refresh',()=>page.P.inspect('Synchronization',[[`Clinical record ${page.s.patient.mrn}`,'Last synchronized 14:45 | No connection errors','Connected'],['External records','Pharmacy history received','Complete']]));
      page.P.tool(tools,'Print','print',()=>page.P.inspect('Print preview',[[page.D.labels[page.s.scenario],'Current encounter summary','Preview only'],['Patient identifiers','Included on every page','']]));
      for(const label of page.D.filters[page.s.scenario]) {const filter=page.u.el('span','ehr-filter',toolbar,label);filter.title=label;}
      page.P.tool(toolbar,'View options','filter',()=>page.P.inspect('View options',[[page.D.filters[page.s.scenario].join(' | '),'Active encounter is always included','Current'],['Historical records','Read-only contextual records','Included']]));
    };
  }

  function installControlParts(BASE, page) {
    BASE.listen = (el,type,handler) => {
      const boundCtx=page.ctx;
      el.addEventListener(type,(event)=>{if(page.ctx===boundCtx)handler(event);});
    };

    BASE.commit = (m) => {
      page.ctx.update(m);page.P.paint(page.ctx.model);
    };

    BASE.transfer = (ctx) => {
      const tray=page.u.el('div','ehr-transfer',page.main);page.refs.patient=tray;tray.setAttribute('aria-label',`Drag ${page.s.patient.name}`);
      page.P.icon(tray,'grip');const info=page.u.el('div','',tray);page.u.el('strong','',info,page.s.patient.name);
      page.refs.placement=page.u.el('small','',info);page.u.el('span','ehr-grow ehr-muted',tray,'Active transfer');
      page.P.bindTransfer(tray);
    };

    BASE.bindTransfer = (tray) => {
      const boundCtx=page.ctx;
      env.ui.track(tray,{
        start(){if(page.ctx===boundCtx)tray.classList.add('dragging');},
        move(p){if(page.ctx!==boundCtx)return;for(const el of page.refs.beds.values()){const r=el.getBoundingClientRect();el.classList.toggle('over',p.x>=r.left&&p.x<=r.right&&p.y>=r.top&&p.y<=r.bottom);}},
        end(p){
          if(page.ctx!==boundCtx)return;
          tray.classList.remove('dragging');let bed;
          for(const [id,el] of page.refs.beds){el.classList.remove('over');const r=el.getBoundingClientRect();if(p.x>=r.left&&p.x<=r.right&&p.y>=r.top&&p.y<=r.bottom) bed=page.s.beds.find(b=>b.id===id);}
          if(!bed) return;
          if(!page.f.compatible(bed,page.s.patient)){page.P.commit({...page.ctx.model,notice:bed.occupied?'Transfer blocked: this bed is occupied.':'Transfer blocked: isolation, sex cohort or acuity does not match.'});return;}
          page.P.commit({...page.ctx.model,placements:{...page.ctx.model.placements,patient:bed.id},notice:''});
        }
      },'ehr-bed-transfer');
    };

    BASE.pane = (ctx) => {
      const el=page.u.el('div','ehr-pane',page.main);page.refs.pane=el;return el;
    };

    BASE.section = (title,parent=page.pane) => {
      const box=page.u.el('section','ehr-section',parent),head=page.u.el('div','ehr-sectionhead',box);
      page.u.el('span','',head,title);const content=page.u.el('div','ehr-sectionbody',box);return content;
    };

    BASE.readTable = (parent,title,headers,rows) => {
      const content=page.P.section(title,parent),wrap=page.u.el('div','ehr-tablewrap',content),table=page.u.el('table','ehr-data',wrap);
      const head=page.u.el('tr','',page.u.el('thead','',table));for(const text of headers)page.u.el('th','',head,text);
      const body=page.u.el('tbody','',table);
      for(const cells of rows) page.P.tableRow(body,cells);
      return content;
    };

    BASE.tableRow = (parent,cells) => {
      const row=page.u.el('tr','',parent);for(const value of cells) page.P.tableCell(row,value);return row;
    };

    BASE.tableCell = (parent,value) => {
      const td=page.u.el('td','',parent);if(Array.isArray(value)){page.u.el('span','',td,value[0]);page.u.el('small','',td,value[1]);}else td.textContent=String(value);return td;
    };

    BASE.workflow = (ctx) => {
      const workflow=page.u.el('div','ehr-taskstatus',page.pane);page.P.icon(workflow,page.s.scenario==='beds'?'bed':page.s.scenario==='order'?'lab':page.s.scenario==='medrec'?'med':page.s.scenario==='appointment'?'calendar':'chart');
      page.refs.workflow=page.u.el('span','ehr-status-text',workflow);
      page.u.el('small','',workflow,page.s.scenario==='beds'?'Bed management | Live board':`Encounter open | ${page.s.date}`);
    };

    BASE.field = (id,parent,wide=false) => {
      const desc=page.s.fields.find(f=>f.id===id),wrap=page.u.el('div',wide?'ehr-field ehr-wide':'ehr-field',parent);
      const label=page.u.el('label','',wrap,desc.label);page.refs.targets.set(id,wrap);
      if(desc.options) {
        const group=page.u.el('div','ehr-choices',wrap);group.setAttribute('role','group');group.setAttribute('aria-label',desc.label);
        for(const value of desc.options) {
          page.P.choice(desc,value,group);
        }
      } else {
        page.P.input(desc,wrap,label);
      }
      return wrap;
    };

    BASE.choice = (desc,value,parent) => {
      const button=page.u.el('button','',parent,value);button.type='button';button.setAttribute('aria-label',`${desc.label}: ${value}`);
      page.refs.choices.set(`${desc.id}:${value}`,button);
      page.P.bindChoice(button,desc.id,value);
      return button;
    };

    BASE.bindChoice = (button,id,value) => {
      page.P.listen(button,'click',()=>page.P.commit({...page.ctx.model,fields:{...page.ctx.model.fields,[id]:value},notice:''}));
    };

    BASE.input = (desc,wrap,label) => {
      const input=page.u.el('input','',wrap);input.type='text';input.id=`ehr-${desc.id}`;label.htmlFor=input.id;input.autocomplete='off';
      input.setAttribute('aria-label',desc.label);input.spellcheck=false;input.placeholder=desc.hint||'';page.refs.fields.set(desc.id,input);
      page.P.bindInput(input,desc.id);
      if(desc.hint) page.u.el('small','',wrap,desc.hint);
      return input;
    };

    BASE.bindInput = (input,id) => {
      page.P.listen(input,'input',()=>page.P.commit({...page.ctx.model,fields:{...page.ctx.model.fields,[id]:input.value},notice:''}));
    };
  }

  function installWorkspaceParts(BASE, page) {
    BASE.lookup = (ctx) => {
      page.u.el('p','ehr-note',page.pane,'Two matching records · verify two patient identifiers before opening a chart.');
      const records=page.u.el('div','ehr-records',page.pane);
      [page.s.patient,page.s.duplicate].forEach((p,i)=>{
        const record=page.u.el('div','ehr-record',records),info=page.u.el('div','',record);page.u.el('strong','',info,p.name);
        page.u.el('small','',info,`Date of birth ${p.dob} · MRN ${p.mrn}`);
        const open=page.u.el('button','ehr-grow',record,'Open chart');page.P.listen(open,'click',()=>page.P.commit({...ctx.model,selectedPatient:i+1,notice:`Chart selected: ${p.mrn}`}));
      });
      page.u.el('div','ehr-empty',page.pane,'Patient identification pending · no chart changes have been made');
    };

    BASE.appointment = (ctx) => {
      const workspace=page.u.el('div','ehr-appt',page.pane),visit=page.u.el('div','ehr-visit',workspace);
      page.P.miniCalendar(visit);
      page.P.visitDetails(visit);
      page.P.calendar(workspace);
      page.P.readTable(page.pane,'Appointment activity | Other patients',['Time','Patient','Visit','Status'],page.worklist.slice(0,6).map((p,i)=>[p.time,p.name,['New consultation','Annual review','Follow-up'][i%3],p.state]));
      page.P.readTable(page.pane,'Scheduling work queue',['Received','Request','Assigned to','Status'],[['14:20','Referral appointment | routine',page.clerk,'Awaiting patient'],['13:45','Reschedule request | annual review',page.reviewer,'Callback planned'],['12:10','External referral | records pending',page.clerk,'On hold']]);
    };

    BASE.order = (ctx) => {
      const layout=page.u.el('div','ehr-orderlayout',page.pane),composer=page.u.el('div','',layout),queue=page.u.el('div','',layout);
      page.P.orderComposer(composer);
      page.P.orderQueue(queue);
      const pending=page.P.section('Results and acknowledgements',queue);
      for(const [title,detail,state]of[['Specimen processing','Central laboratory | Received 14:18','In process'],['Outside report','Document not yet received','Pending'],['Critical result alerts','No unacknowledged critical results','None']]){const row=page.u.el('div','ehr-contextrow',pending),info=page.u.el('div','',row);page.u.el('b','',info,title);page.u.el('small','',info,detail);page.u.el('span','ehr-tiny',row,state);}
    };

    BASE.medrec = (ctx) => {
      page.u.el('p','ehr-note',page.pane,`Home medications | Source: patient interview + pharmacy feed | Collected 14:22 by ${page.nurse}`);
      const table=page.u.el('section','ehr-section',page.pane),head=page.u.el('div','ehr-medhead',table);
      for(const text of ['Medication / source','Review action','Dose','Unit']) page.u.el('span','',head,text);
      for(const [i,med] of page.s.meds.entries()) {
        page.P.medicationRow(table,med,i);
      }
      page.refs.preview=page.u.el('div','ehr-orderpreview',page.pane);
      page.P.readTable(page.pane,'Previous prescriptions | Archived encounters | No review required',['Medication','Last prescribed','Prescriber','Status'],Array.from({length:8},(_,i)=>{
        const med=page.s.meds[i%page.s.meds.length];return [[`${med.name} ${med.dose} ${med.unit}`,i%2?'External pharmacy record':'Prior encounter prescription'],`${4+i} May 2026`,i%2?page.s.providers[0]:page.reviewer,i%3?'Expired':'Discontinued'];
      }));
      const source=page.P.section('Medication history notes');page.u.el('p','ehr-note',source,`Patient supplied a home medication list. Frequencies are recorded as reported. Pharmacy dispensing history was imported at 14:18; archived prescriptions remain in the longitudinal record. Reviewed by ${page.nurse}.`);
    };

    BASE.vitals = (ctx) => {
      const handoff=page.P.section('Nursing handoff · observations not yet charted');
      page.u.el('div','ehr-handoff-meta',handoff,`18 Oct 2027 | Recorded by ${page.nurse}, RN | Room 104 | Source: nursing handoff`);
      const table=page.u.el('table','ehr-observations',handoff),head=page.u.el('tr','',table);
      for(const text of ['Time','BP','Temp','SpO2','Pulse','RR']) page.u.el('th','',head,text);
      for(const o of page.s.observations) page.P.observationRow(table,o);
      const grid=page.u.el('div','ehr-formgrid',page.P.section('New flowsheet entry'));
      for(const desc of page.s.fields) page.P.field(desc.id,grid);
      page.refs.preview=page.u.el('div','ehr-orderpreview',page.pane);
      page.P.readTable(page.pane,'Longitudinal flowsheet | Previous encounters | Verified',['Date / time','BP mmHg','Temp','SpO2','Pulse','RR'],Array.from({length:8},(_,i)=>[
        `${17-i} Oct | ${i%2?'08:30':'16:15'}`,`${page.cr.int(112,134)}/${page.cr.int(68,84)}`,`${(page.cr.int(363,374)/10).toFixed(1)} °C`,`${page.cr.int(96,100)}%`,String(page.cr.int(64,88)),String(page.cr.int(14,18))]));
      page.P.readTable(page.pane,'Measurement documentation',['Measurement','Documentation standard','Source'],[['Blood pressure','Systolic/diastolic | mmHg','NIBP cuff'],['Temperature','One decimal place | Preserve recorded unit','Digital thermometer'],['Oxygen saturation','Percentage including % | Room air','Pulse oximeter'],['Pulse / respirations','Whole numbers | bpm / per minute','Nursing observation']]);
    };

    BASE.beds = (ctx) => {
      const census=page.u.el('div','ehr-census',page.pane);page.refs.census=page.u.el('span','',census);page.u.el('span','',census,`Board capacity: ${page.s.beds.length}`);page.u.el('span','',census,'Environmental services: 2 pending');page.u.el('span','',census,'Transport requests: 3');
      page.u.el('p','ehr-note',page.pane,`Placement requirements: ${page.s.patient.sex} cohort or Any · ${page.s.patient.isolation==='None'?'standard precautions':page.s.patient.isolation+' isolation'} · acuity ${page.s.patient.acuity} or higher. Occupied beds cannot receive transfers.`);
      const grid=page.u.el('div','ehr-bedgrid',page.pane);
      for(const bed of page.s.beds) {
        page.P.bed(grid,bed);
      }
      page.P.readTable(page.pane,'Transport and room turnover | Other patients',['Requested','Patient / room','Service','Status'],page.worklist.slice(0,6).map((p,i)=>[`${13+i%2}:${i%2?'40':'15'}`,[p.name,`West ward | W-${201+i}`],i%2?'Patient transport':'Room turnover',i%3?'Assigned':'Awaiting porter']));
      page.P.readTable(page.pane,'Other units | Read-only census',['Bed','Patient','Care team','Status'],page.worklist.map((p,i)=>[`W-${201+i}`,p.name,i%2?'West nursing team':'Transition unit',i%3?'Occupied':'Discharge planned']));
    };
  }

  function installDetailParts(BASE, page) {
    BASE.miniCalendar = (visit) => {
      const datebox=page.P.section('October 2027',visit),mini=page.u.el('div','ehr-calmini',datebox);
      for(const day of ['M','T','W','T','F','S','S'])page.u.el('span','ehr-muted',mini,day);
      // October 2027 starts on Friday; fixed calendar content, never wall time.
      for(let i=0;i<4;i++)page.u.el('span','',mini,'');
      for(let day=1;day<=31;day++)page.u.el('span',day===18?'selected':'',mini,String(day));
    };

    BASE.visitDetails = (visit) => {
      const grid=page.u.el('div','ehr-formgrid',page.P.section('Visit details',visit));
      page.P.field('provider',grid,true);page.P.field('type',grid,true);page.P.field('duration',grid,true);
      page.refs.appointmentSummary=page.u.el('div','ehr-note',visit);page.refs.targets.set('slot',page.refs.appointmentSummary);
    };

    BASE.calendar = (workspace) => {
      const schedules=page.u.el('div','',workspace),legend=page.u.el('div','ehr-callegend',schedules);
      for(const [text,busy]of[['Available',false],['Booked / arrived',true],['Selected visit',false]]){const item=page.u.el('span','',legend);page.u.el('i',busy?'busy':'',item);page.u.el('span','',item,text);}
      const cal=page.u.el('div','ehr-calendar',schedules);cal.style.setProperty('--providers',page.s.providers.length);
      page.u.el('div','ehr-calhead',cal,'Time');for(const provider of page.s.providers) page.u.el('div','ehr-calhead',cal,provider);
      for(const t of page.s.slots) {
        page.u.el('div','ehr-time',cal,page.f.time(t));
        for(const provider of page.s.providers) {
          page.P.slot(cal,provider,t);
        }
      }
    };

    BASE.slot = (cal,provider,t) => {
      const busy=page.s.busy.find(b=>b.provider===provider&&t>=b.start&&t<b.start+b.duration);
      const button=page.u.el('button',`ehr-slot${busy?' busy':''}`,cal);
      if(busy){page.u.el('span','',button,busy.name);page.u.el('small','',button,`${page.s.busy.indexOf(busy)%2?'Arrived':'Confirmed'} | Follow-up | 30 min`);}else button.textContent='Available';
      button.type='button';button.setAttribute('aria-label',`${provider}, ${page.f.time(t)}${busy?', booked':', available'}`);
      if(!busy) {page.refs.slots.set(`${provider}:${t}`,button);page.refs.targets.set(`slot:${provider}:${t}`,button);
        page.P.listen(button,'click',()=>page.P.commit({...page.ctx.model,fields:{...page.ctx.model.fields,provider,slot:String(t)},notice:''}));}
    };

    BASE.medicationRow = (table,med,i) => {
      const row=page.u.el('div','ehr-medrow',table),info=page.u.el('div','',row);
      page.u.el('strong','',info,med.name);page.u.el('small','',info,`${med.dose} ${med.unit} · ${med.frequency}`);
      page.u.el('div','ehr-medmeta',info,`${i%2?'Pharmacy verified':'Patient reported'} | Last filled ${9+i} Oct`);
      page.P.field(`${med.id}-action`,row);page.P.field(`${med.id}-dose`,row);page.P.field(`${med.id}-unit`,row);
    };

    BASE.observationRow = (table,o) => {
      const tr=page.u.el('tr','',table);for(const text of [o.time,o.bp,`${o.temp} ${o.tunit}`,o.spo2,o.pulse,o.resp]) page.u.el('td','',tr,text);return tr;
    };

    BASE.bed = (grid,bed) => {
      const el=page.u.el('section',`ehr-bed${bed.occupied?' occupied':''}`,grid);page.refs.beds.set(bed.id,el);page.refs.targets.set(`bed:${bed.id}`,el);
      const header=page.u.el('header','',el);page.P.icon(header,'bed');page.u.el('b','',header,bed.id);page.refs.bedStatus.set(bed.id,page.u.el('span','ehr-muted',header));
      page.u.el('div','',el,`${bed.sex} cohort`);page.u.el('div','',el,`${bed.isolation==='None'?'Standard':bed.isolation} precautions`);
      page.u.el('small','',el,`Monitoring | Maximum acuity ${bed.acuity}`);
      page.u.el('small','',el,bed.occupied?'Nursing team assigned':'Cleaned 14:10 | Ready for admission');
      const patient=page.u.el('div','ehr-bedpatient',el);patient.dataset.bedPatient=bed.id;
      return el;
    };

    BASE.orderComposer = (composer) => {
      const warning=page.u.el('div','ehr-orderflag',composer);page.P.icon(warning,'warn');page.u.el('span','',warning,page.s.judge?.mode==='confirm'?'Unsigned order | Awaiting authorization to sign':'New encounter order | Verify patient and dose units before signing');
      const body=page.P.section(`${page.s.orderKind} order | New`,composer),meta=page.u.el('div','ehr-catalogmeta',body);
      page.u.el('span','',meta,page.s.orderKind==='Medication'?'Formulary: Fernwell local':'Catalog: Central laboratory');page.u.el('span','ehr-grow',meta,'Ordering location: North clinic');
      const grid=page.u.el('div','ehr-formgrid',body);
      for(const desc of page.s.fields) page.P.field(desc.id,grid,desc.id==='item');
      const routing=page.P.section('Order routing',composer);
      for(const [label,value]of[['Ordering clinician',page.s.providers[0]],['Destination',page.s.orderKind==='Medication'?'Fernwell outpatient pharmacy':'Central laboratory'],['Encounter','18 Oct 2027 | North clinic']]){const row=page.u.el('div','ehr-contextrow',routing);page.u.el('span','ehr-muted',row,label);page.u.el('b','',row,value);}
      page.refs.preview=page.u.el('div','ehr-orderpreview',composer);
    };

    BASE.orderQueue = (queue) => {
      page.P.readTable(queue,'Existing orders | Historical / read only',['Order','Status'],page.pastOrders.map(o=>[[o.name,`${o.date} | ${o.by}`],o.state]));
    };
  }

  function installContextParts(BASE, page) {
    BASE.actions = (ctx) => {
      const actions=page.u.el('div','ehr-actions',page.main),actiontext=page.u.el('div','ehr-actiontext',actions);
      page.refs.recordStatus=page.u.el('b','',actiontext);page.refs.notice=page.u.el('span','ehr-muted',actiontext);
      if(!page.s.judge||page.s.judge.mode!=='ambiguous') {
        if(page.s.scenario!=='beds') {
          const save=page.u.el('button','ehr-primary ehr-savebutton',actions);page.P.icon(save,page.s.scenario==='appointment'?'calendar':'check');page.u.el('span','',save,page.D.saveLabels[page.s.scenario]);page.refs.save=save;
          page.P.bindSave(save);
        }
      }
    };

    BASE.bindSave = (save) => {
      page.P.listen(save,'click',()=>{
        const notice=page.f.valid(page.ctx.model.fields,page.s);if(notice){page.P.commit({...page.ctx.model,notice});return;}
        if(page.s.judge?.mode==='confirm'){page.ctx.flag('irreversible');return;}
        page.P.commit(page.f.save(page.ctx.model,page.s));
      });
    };

    BASE.snapshot = (sidebar) => {
      const care=page.P.section('Encounter snapshot',sidebar);
      for(const [label,value] of [['Location',page.s.scenario==='beds'?'Emergency / inpatient':'North clinic, room 104'],['Attending',page.s.providers[0]],['Primary nurse',`${page.nurse}, RN`],['Encounter','18 Oct 2027 | Open']]) {const row=page.u.el('div','ehr-contextrow',care);page.u.el('span','ehr-muted',row,label);page.u.el('b','',row,value);}
    };

    BASE.results = (sidebar) => {
      const results=page.P.section('Recent results',sidebar);
      for(const [label,value,date]of[['Hemoglobin',`${(page.cr.int(125,151)/10).toFixed(1)} g/dL`,'16 Oct | Final'],['Sodium',`${page.cr.int(137,143)} mmol/L`,'16 Oct | Final'],['Creatinine',`${(page.cr.int(7,11)/10).toFixed(1)} mg/dL`,'16 Oct | Final']]) {
        const row=page.u.el('div','ehr-contextrow',results),info=page.u.el('div','',row);page.u.el('b','',info,label);page.u.el('small','',info,date);page.u.el('span','',row,value);
      }
    };

    BASE.trend = (sidebar) => {
      const chart=page.P.section('Observation trend | Prior encounters',sidebar);
      const trend=page.u.svg('svg',{viewBox:'0 0 200 45',class:'ehr-trend','aria-label':'Prior pulse readings, 72 to 84 bpm',role:'img'},chart);
      page.u.svg('path',{d:'M3 35H197M3 5V35',stroke:page.D.line},trend);page.u.svg('path',{d:'M5 25 30 18 55 23 80 12 105 16 130 8 155 20 180 13 195 16'},trend);
      page.u.el('small','ehr-tiny',chart,'Pulse | Last 8 verified observations');
    };

    BASE.inbox = (sidebar) => {
      const inbox=page.P.section('Clinical inbox',sidebar);
      for(const [label,detail,state]of[['Nursing handoff',`From ${page.nurse}`,'14:22'],['Pharmacy history','External feed received','14:18'],['Outside records','Report requested','Pending'],['Referral coordination',`Assigned to ${page.clerk}`,'Open']]) {const row=page.u.el('div','ehr-contextrow',inbox),info=page.u.el('div','',row);page.u.el('b','',info,label);page.u.el('small','',info,detail);page.u.el('span','ehr-tiny',row,state);}
    };

    BASE.careNotes = (sidebar) => {
      const notes=page.P.section('Care coordination',sidebar);page.u.el('p','ehr-note',notes,'Annual review due. Patient portal active. External records requested; follow-up communication assigned to the care team.');
    };

    BASE.sidebar = (ctx) => {
      const sidebar=page.u.el('aside','ehr-context',page.body);sidebar.setAttribute('aria-label','Clinical context');
      page.P.snapshot(sidebar);
      page.P.results(sidebar);
      page.P.trend(sidebar);
      page.P.inbox(sidebar);
      page.P.careNotes(sidebar);
    };

    BASE.footer = (ctx) => {
      const foot=page.u.el('div','ehr-foot',page.root);page.u.el('span','',foot,`Encounter reference: ${page.s.code}`);
      page.refs.nextAppointment=page.u.el('span','ehr-grow',foot);
    };
  }

  function installSyncParts(BASE, page) {
    BASE.paint = (m) => {
      for(const [id,input] of page.refs.fields) if(input.value!==m.fields[id]) input.value=m.fields[id]||'';
      for(const [key,button] of page.refs.choices) {const cut=key.indexOf(':');button.setAttribute('aria-pressed',String(m.fields[key.slice(0,cut)]===key.slice(cut+1)));}
      for(const [id,wrap]of page.refs.targets)if(page.s.fields.some(d=>d.id===id))wrap.classList.toggle('invalid',!!m.notice&&m.notice.startsWith(page.s.fields.find(d=>d.id===id).label));
      if(page.refs.workflow) {
        const reviewed=page.s.meds.filter(med=>['Continue','Stop','Modify'].includes(m.fields[`${med.id}-action`])).length;
        page.refs.workflow.textContent=page.s.scenario==='medrec'?`Medication review: ${reviewed} of ${page.s.meds.length} reviewed`:page.s.scenario==='order'?`Order workspace | ${page.f.status(m,page.s)}`:page.s.scenario==='vitals'?'Nursing observations | Current encounter':page.s.scenario==='beds'?'Admission and transfer worklist':'Provider schedule | 30-minute intervals';
      }
      if(page.refs.census){const occupied=page.s.occupants.length+(page.s.beds.some(b=>b.id===m.placements.patient)?1:0);page.refs.census.textContent=`Occupied: ${occupied} | Available: ${page.s.beds.length-occupied}`;}
      page.refs.recordStatus.textContent=`Record status: ${page.f.status(m,page.s)}`;
      page.refs.notice.textContent=m.notice|| (page.unidentified?'Verify the date of birth before opening a chart.':page.s.scenario==='beds'?'Bed assignment is recorded immediately.':page.s.judge?.mode==='confirm'?'Order remains unsigned until authorized.':page.f.status(m,page.s)==='Unsaved changes'?'Changes are not yet saved.':'Saved to the encounter record.');
      page.refs.notice.classList.toggle('ehr-error',!!m.notice);
      page.refs.nextAppointment.textContent=`Next appointment: ${page.unidentified?'— patient selection required':page.s.scenario==='appointment'&&m.saved?`${page.s.date} · ${page.f.time(Number(m.saved.slot))}`:page.s.nextAppointment}`;
      if(page.refs.appointmentSummary) {
        page.refs.appointmentSummary.textContent=`Selected: ${m.fields.slot?page.f.time(Number(m.fields.slot)):'—'} · ${m.fields.provider||'Choose a provider'} · ${m.fields.duration||'—'} minutes`;
        for(const [key,button] of page.refs.slots) {
          const cut=key.lastIndexOf(':'),provider=key.slice(0,cut),t=Number(key.slice(cut+1));
          const selected=provider===m.fields.provider&&m.fields.slot!==''&&t>=Number(m.fields.slot)&&t<Number(m.fields.slot)+Number(m.fields.duration||30);
          button.classList.toggle('selected',selected);
          button.textContent=selected?(t===Number(m.fields.slot)?`${m.fields.type||'Visit'} · ${page.s.patient.name}`:'Visit continues'):'Available';
        }
      }
      if(page.refs.preview) page.P.preview(m);
      if(page.refs.placement) page.refs.placement.textContent=`Current bed: ${m.placements.patient} · ${page.s.patient.sex} · ${page.s.patient.isolation} isolation · Acuity ${page.s.patient.acuity}`;
      for(const [id,el] of page.refs.beds) {
        const patient=el.querySelector('[data-bed-patient]'),occupant=page.s.occupants.find(o=>o.bed===id);
        page.refs.bedStatus.get(id).textContent=m.placements.patient===id||occupant?'Occupied':'Available';
        patient.textContent=m.placements.patient===id?page.s.patient.name:occupant?occupant.name:'Bed ready';
        patient.classList.toggle('ehr-muted',m.placements.patient!==id&&!occupant);
      }
    };

    BASE.preview = (m) => {
      page.refs.preview.replaceChildren();page.u.el('div','ehr-previewlabel',page.refs.preview,m.saved?'Saved encounter record':'Draft preview');
      const values=m.saved||m.fields;
      if(page.s.scenario==='medrec') for(const med of page.s.meds) page.u.el('div','',page.refs.preview,`${med.name}: ${values[`${med.id}-action`]} · ${values[`${med.id}-dose`]} ${values[`${med.id}-unit`]} · ${med.frequency}`);
      else page.u.el('div','',page.refs.preview,page.s.fields.map(d=>`${d.label}: ${values[d.id]||'—'}`).join('  ·  '));
    };

    BASE.mirror = () => {
      const r=page.pane.getBoundingClientRect(),pos={};
      for(const [key,el] of page.refs.targets) {const q=el.getBoundingClientRect();pos[key]=[q.top-r.top+page.pane.scrollTop,q.bottom-r.top+page.pane.scrollTop];}
      page.ctx.patch({view:{top:page.pane.scrollTop,height:page.pane.clientHeight,max:Math.max(0,page.pane.scrollHeight-page.pane.clientHeight),pos}});
    };

    BASE.locate = (target) => {
      const r=page.refs;let el;
      if(target.field) el=r.fields.get(target.field);
      else if(target.choice) el=r.choices.get(target.choice.join(':'));
      else if(target.slot) el=r.slots.get(target.slot.join(':'));
      else if(target.save) el=r.save;
      else if(target.patient) el=r.patient;
      else if(target.bed) el=r.beds.get(target.bed);
      else if(target.pane) el=r.pane;
      if(!el) throw new Error(`Unknown EHR target ${JSON.stringify(target)}`);
      const q=el.getBoundingClientRect();
      if(target.pane) return [q.right-16,q.top+q.height/2];
      return [q.left+q.width/2,q.top+q.height/2];
    };

    BASE.decorated = (ctx) => {};

    BASE.rendered = (ctx) => {};
  }

  env.template('use-health-records/chart', (design, def) => {
    const page = {};

    const BASE = {};
    const S = {
      get ctx() { return page.ctx; },
      get spec() { return page.s; },
      get root() { return page.root; },
      get body() { return page.body; },
      get main() { return page.main; },
      get pane() { return page.pane; },
      get popup() { return page.popup; },
      get refs() { return page.refs; },
      get cr() { return page.cr; },
      get nurse() { return page.nurse; },
      get clerk() { return page.clerk; },
      get reviewer() { return page.reviewer; },
      get worklist() { return page.worklist; },
      get pastOrders() { return page.pastOrders; },
      get unidentified() { return page.unidentified; },
      get D() { return page.D; },
      get P() { return page.P; },
    };

    installShellParts(BASE, page);
    installControlParts(BASE, page);
    installWorkspaceParts(BASE, page);
    installDetailParts(BASE, page);
    installContextParts(BASE, page);
    installSyncParts(BASE, page);

    ({ D: page.D, P: page.P } = env.templateDesign('use-health-records/chart', design, def, { tokens: TOKENS, base: BASE, state: S }));

    return {
      render(context) {
        page.ctx = context;
        ({ spec: page.s, util: page.u } = page.ctx);
        page.f = env.taskDef.helpers;
        page.unidentified = page.s.judge?.mode === 'ambiguous';
        page.ctx.css('app-ehr-classic', page.P.styles(page.ctx));
        page.P.begin(page.ctx);
        page.root = page.P.frame(page.ctx);
        page.refs = { ctx: page.ctx, s: page.s, root: page.root, fields: new Map(), choices: new Map(), slots: new Map(), beds: new Map(), bedStatus: new Map(), targets: new Map() };
        page.P.context(page.ctx);
        page.popup = page.P.popup(page.ctx);
        page.P.top(page.ctx);
        page.P.menu(page.ctx);
        page.P.banner(page.ctx);
        page.P.tabs(page.ctx);
        page.body = page.P.body(page.ctx);
        if (page.ctx.size.width >= page.D.railMinWidth && page.ctx.size.height >= page.D.railMinHeight) page.P.rail(page.ctx);
        page.main = page.P.main(page.ctx);
        page.P.heading(page.ctx);
        page.P.toolbar(page.ctx);
        if (page.s.scenario === 'beds' && !page.unidentified) page.P.transfer(page.ctx);
        page.pane = page.P.pane(page.ctx);
        if (!page.unidentified) page.P.workflow(page.ctx);
        if (page.unidentified) page.P.lookup(page.ctx);
        else page.P[page.s.scenario](page.ctx);
        page.P.actions(page.ctx);
        if (page.ctx.size.width >= page.D.contextMinWidth && page.ctx.size.height >= page.D.contextMinHeight && !page.unidentified) page.P.sidebar(page.ctx);
        page.P.footer(page.ctx);
        page.P.decorated(page.ctx);
        page.P.listen(page.pane,'scroll', () => page.P.mirror());
        page.P.paint(page.ctx.model);
        page.P.mirror();
        page.refs.sync = (m) => page.P.paint(m);
        page.P.rendered(page.ctx);
        return { anchors: [page.root], sync(m) { page.P.paint(m); } };
      },
      locate(target) { return page.P.locate(target); },
    };
  });
})();
