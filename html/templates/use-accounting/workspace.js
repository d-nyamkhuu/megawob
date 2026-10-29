/*
 * use-accounting/workspace: Folio's shared accounting workspace.
 * Scenarios: reconcile (bank/ledger matching), journal (voucher/lines), expense
 * (receipt/editor), approve (invoice/ordered approvers). These share the shell,
 * controls, scrolling, and model synchronization; each workflow has its own part.
 * With design: {}, defaults reproduce design-use-accounting-reconcile-01,
 * design-use-accounting-journal-01, design-use-accounting-expense-01, design-use-accounting-approve-01.
 * No scenario presets: the reference already supplies each workflow's defaults.
 *
 * Tokens (all defaults are in TOKENS):
 *   brand='Folio', logo='F', workspaceLabel='Folio accounting workspace': identity.
 *   labels={reconcile:'Banking',journal:'General ledger',expense:'Expenses',approve:'Payables'}: navigation.
 *   titles={reconcile:'Reconcile transactions',journal:'New journal entry',expense:'Expense report',approve:'Invoice approvals'}: headings.
 *   commitLabels={reconcile:'Save reconciliation',journal:'Post journal',expense:'File report',approve:'Approve payment'}: footer actions.
 *   icons=paths: whole table of 24x24 SVG path data (fallback: invoice).
 *   inset=10, radius=9: outer frame pixels; font='12px/1.4 system-ui,sans-serif'.
 *   sidebarWidth=142, narrowSidebarWidth=132, inspectorWidth=212: panel pixels.
 *   compactWidth=760, compactHeight=460, tightWidth=1150, railWidth=740,
 *   inspectorMinWidth=1250: ctx.size breakpoints in pixels.
 *   panel/bg/fg/muted/line/accent='var(--<name>)': CSS colors from the site.
 *   warningColor='#cf8d29', balanceWarningColor='#a87032': warning colors.
 *   extraCss='': appended structural/style overrides; defaults preserve original CSS.
 *
 * Parts are replaced with (base, S) => replacement. Arguments and default behavior
 * follow below; unmarked results are void. Every nested call goes through P.
 *   frame(ctx) -> node; build the sized, labeled root.
 *   button(parent,text,action,cls='') -> button; style and bind a click.
 *   icon(parent,name) -> svg; draw token path.
 *   iconButton(parent,text,name,action,cls='') -> button; icon/text/accessibility.
 *   background(ctx) -> records; seven decorative records from finance-workspace fork.
 *   kv(parent,label,value) -> row; label/value pair.
 *   history(parent,title,records=first four background records) -> section; posted history.
 *   historyRow(parent,record,status) -> row; one history record.
 *   showPanel(title,build); clear/show dialog and run build(dialog).
 *   preview(title); open decorative overview.
 *   change(action); apply task update then paint.
 *   shell() -> node; flex shell around sidebar/main/inspector.
 *   main() -> node; main column inside shell.
 *   work() -> node; scenario's workflow grid inside main.
 *   top(); product bar, search, notifications and account dialogs.
 *   sidebar(); grouped navigation and close progress; publishes S.side.
 *   navItem(text,name,count,active) -> button; sidebar link.
 *   navigation(); workflow tabs.
 *   heading(); title, status and metrics container.
 *   toolbar(); period/entity/filter/attachments/export controls.
 *   column(title,note) -> section; headed workflow column.
 *   scrollFrame(col,name) -> {pane,content,track,thumb,positions}; scroll DOM.
 *   refreshPane(paneRecord,name,episodeState); measure and mirror visible geometry.
 *   scroll(col,name) -> paneRecord; bind scrollPane and guarded refresh.
 *   inputControl(parent,i,k,label,cls='') -> input; controlled text field DOM.
 *   input(parent,i,k,label,cls='') -> input; register and bind field updates.
 *   pickerControl(parent,label,action) -> {node,text,label}; local picker DOM.
 *   picker(parent,i,k,label) -> button; register and bind picker updates.
 *   viewer(parent,filename) -> bar; PDF attachment bar.
 *   metadata(parent,pairs) -> grid; document metadata.
 *   metadataField(parent,label,value) -> field; one metadata cell.
 *   transactionRow(parent,row,bank) -> node with _match; transaction card DOM.
 *   bankBehavior(node,row,rightPane); register unmatch and captured matching drag.
 *   renderReconcile(); bank and ledger columns, rows and source/history footers.
 *   voucher(parent); read-only journal source document.
 *   journalRow(editor,i) -> line; account/debit/credit controls and position.
 *   renderJournal(); voucher, journal lines, memo, checks and attachments.
 *   receiptPaper(parent,receipt,i); original receipt document.
 *   expenseField(grid,editor,i,key,label) -> field; expense control and position.
 *   buildReceipt(i,source,editor); rebuild active receipt, coding note, form and report.
 *   renderExpense(); receipt tabs and panes; install current.buildReceipt.
 *   invoiceRow(source,invoice,i) -> button; invoice selector and position.
 *   approvalPolicy(parent); ordered approval policy.
 *   approverRow(editor,person) -> row; staff directory and add action.
 *   renderApprove(); invoice list, policy, route, directory and history.
 *   inspector(); optional audit/details/projects rail.
 *   footer(); notice and commit action with confirmation guard.
 *   popups(); hidden listbox and dialog containers.
 *   syncFields(model); copy controlled values and receipt totals.
 *   syncMatches(model); update match labels, classes and unlink controls.
 *   syncStatus(model); public record status badge.
 *   syncMetrics(model); rebuild public accounting facts.
 *   metric(parent,fact) -> node; one metric.
 *   syncJournal(model); difference and posting checklist.
 *   syncInvoice(model); active invoice details.
 *   syncAudit(model); draft/final audit text.
 *   syncSelection(model); receipt/invoice selection and add-button states.
 *   syncRoute(model); selected approver route.
 *   routeChip(id,i) -> chip; role and registered removal action.
 *   syncFooter(model); local save notice or final record status.
 *   syncPopup(model); rebuild picker only when open signature changes.
 *   option(parent,i,key,value) -> button; locked state and field selection.
 *   placePopup(i,key,options); clamp local popup within root.
 *   sync(model); active receipt and ordered redraws, then pane geometry.
 *   locate(target) -> [x,y]; pure registered target/scrollbar geometry.
 *   begin(ctx); before frame (noop).
 *   item(node,record); after workflow row/field binding (noop).
 *   rendered(ctx); after initial paint (noop).
 *   synced(model); after each paint/geometry refresh (noop).
 *
 * S.ctx/spec/task/current/background and all element/maps getters are live.
 * S.root/shell/side/main/work/popup/memo/footerNotice/statusBadge/metrics/entryTotal/
 * routeBox/invoiceDetail/validation/auditState/receiptSummary/flyout have setters
 * so replaced builders can publish controls for sync. S.refs/panes/fields/pickers/
 * bankNodes/ledgerNodes/unlinkNodes/people/invoices/receiptButtons are mutable maps.
 * S.el and S.register build elements and register locate targets. S.D/P are resolved.
 * Named installers group the parts below; each reads live state through S.
 * S.paint/editorActive/menuSignature expose the paint callback and redraw caches.
 * No DOM work occurs in the factory. Keep the background fork's content pick, int
 * and int draws for each of seven records in order; extra decoration randomness
 * must use a separate ctx.rng.fork(label). Anchors and locate remain read-only.
 */
(function () {
  'use strict';

  const CSS = D => `
  .af-app{position:absolute;inset:${D.inset}px;display:flex;flex-direction:column;min-width:0;min-height:0;background:${D.panel};color:${D.fg};border:1px solid ${D.line};border-radius:${D.radius}px;overflow:hidden;font:${D.font};box-shadow:0 8px 25px #0000000b}
  .af-app *{box-sizing:border-box}.af-app button,.af-app input{font:inherit;color:inherit}.af-top{height:36px;flex:none;display:flex;gap:10px;align-items:center;padding:0 14px;border-bottom:1px solid ${D.line};background:${D.bg}}
  .af-logo{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:5px;background:${D.accent};color:white;font-weight:800}.af-brand{font-weight:750;font-size:14px}.af-sp{flex:1;min-width:0}.af-muted{color:${D.muted}}.af-company{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:50%}
  .af-nav{height:30px;flex:none;display:flex;gap:17px;align-items:center;padding:0 14px;border-bottom:1px solid ${D.line};font-size:11px;color:${D.muted}}.af-nav .on{color:${D.accent};font-weight:700;height:30px;display:flex;align-items:center;border-bottom:2px solid ${D.accent}}
  .af-heading{flex:none;display:flex;gap:8px;align-items:center;padding:10px 14px 8px;min-height:52px}.af-heading h2{font-size:17px;line-height:1.2;margin:0}.af-sub{color:${D.muted};font-size:10px;margin-top:3px}.af-badge{display:inline-block;padding:3px 7px;border:1px solid ${D.line};border-radius:10px;color:${D.muted};font-size:10px;white-space:nowrap;background:${D.bg}}
  .af-btn{border:1px solid ${D.line};border-radius:5px;padding:5px 8px;min-height:28px;background:${D.panel};cursor:pointer;text-align:left}.af-btn:hover{border-color:${D.accent};background:color-mix(in srgb,${D.accent} 7%,${D.panel})}.af-btn:focus-visible,.af-input:focus{outline:2px solid ${D.accent};outline-offset:1px}.af-btn.primary{background:${D.accent};color:white;border-color:${D.accent};font-weight:650}.af-btn:disabled{opacity:.45;cursor:default}.af-btn.quiet{border-color:transparent;background:transparent;color:${D.muted}}
  .af-metrics{flex:none;display:flex;gap:16px;padding:6px 14px 9px;border-bottom:1px solid ${D.line};font-size:11px;flex-wrap:wrap}.af-metric{min-width:0;display:flex;gap:6px;align-items:baseline}.af-metric b{font-variant-numeric:tabular-nums;font-size:12px;font-weight:650}
  .af-work{display:grid;grid-template-columns:minmax(0,.85fr) minmax(0,1.65fr);flex:1;min-height:0;min-width:0}.af-work.reconcile{grid-template-columns:1fr 1fr}.af-column{display:flex;flex-direction:column;min-width:0;min-height:0;position:relative}.af-column+.af-column{border-left:1px solid ${D.line}}.af-colhead{height:31px;flex:none;display:flex;align-items:center;justify-content:space-between;padding:0 11px;background:${D.bg};border-bottom:1px solid ${D.line};font-size:11px;font-weight:650}.af-colhead small{font-weight:400;color:${D.muted}}
  .af-scrollbox{flex:1;position:relative;min-height:0;min-width:0}.af-pane{position:absolute;inset:0 10px 0 0;overflow:hidden;overscroll-behavior:contain}.af-content{min-height:100%;padding:10px}.af-track{position:absolute;right:0;top:3px;bottom:3px;width:9px;background:${D.bg};border-left:1px solid ${D.line}}.af-thumb{position:absolute;left:1px;right:1px;min-height:20px;border-radius:5px;background:color-mix(in srgb,${D.muted} 58%,${D.panel});cursor:grab}
  .af-row{height:76px;position:relative;border:1px solid ${D.line};border-radius:5px;background:${D.panel};margin-bottom:7px;padding:7px 9px;font-size:11px}.af-row.bank{cursor:grab;touch-action:none}.af-row.bank.dragging{opacity:.8;z-index:80;box-shadow:0 8px 20px #0003;pointer-events:none}.af-row.matched{border-left:3px solid ${D.accent};background:color-mix(in srgb,${D.accent} 5%,${D.panel})}.af-row.over{outline:2px dashed ${D.accent}}.af-row-title{display:flex;align-items:center;gap:7px}.af-payee{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:650}.af-id{font-family:ui-monospace,monospace;font-size:10px;color:${D.muted}}.af-line{display:flex;gap:8px;justify-content:space-between;margin-top:4px;font-variant-numeric:tabular-nums}.af-match{font-size:10px;color:${D.accent};margin-top:3px}.af-unlink{float:right;border:0;background:none;color:${D.accent};cursor:pointer;padding:0 3px;font-size:11px}.af-unlink[hidden]{display:none}
  .af-paper{background:${D.bg};border:1px solid ${D.line};padding:12px 11px;border-radius:3px;font-size:11px}.af-paper h3{font-size:13px;margin:0 0 7px}.af-paper .af-id{display:block;margin-bottom:8px}.af-paper p{margin:7px 0;overflow-wrap:anywhere}.af-paper hr{border:0;border-top:1px dashed ${D.line};margin:10px 0}.af-paper-line{border-bottom:1px dashed ${D.line};padding:7px 0}.af-paper-line strong{display:block;font-size:11px}.af-paper-line .af-line{font-size:10px}.af-note{padding:9px;border-left:2px solid ${D.accent};background:${D.bg};margin-top:10px;color:${D.muted};font-size:10px;overflow-wrap:anywhere}.af-warning{color:${D.fg};font-weight:600;border:1px solid ${D.line};border-left:3px solid ${D.warningColor};background:color-mix(in srgb,${D.warningColor} 9%,${D.panel});padding:8px;font-size:10px;margin-bottom:9px}
  .af-label{font-size:10px;color:${D.muted};display:block;margin-bottom:4px}.af-input{width:100%;min-width:0;border:1px solid ${D.line};border-radius:4px;height:30px;background:${D.panel};padding:5px 6px;user-select:text;-webkit-user-select:text}.af-input.money{text-align:right;font-variant-numeric:tabular-nums}.af-picker{width:100%;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;height:30px;padding:5px 7px;font-size:11px!important}.af-fields{display:grid;grid-template-columns:1fr 1fr;gap:10px}.af-field{min-width:0}.af-field.wide{grid-column:1/-1}.af-entryhead,.af-entry{display:grid;grid-template-columns:minmax(0,1.8fr) minmax(0,1fr) minmax(0,1fr);gap:6px;align-items:center}.af-entryhead{color:${D.muted};font-size:10px;padding:4px 0 7px}.af-entry{height:48px;border-bottom:1px solid ${D.line}}.af-entry .af-picker{font-size:10px!important}.af-entry .af-input{font-size:11px}.af-entrytotal{display:flex;justify-content:space-between;gap:10px;font-size:11px;padding:10px 0}.af-memo{margin-top:10px}
  .af-receipts{display:flex;gap:4px;padding:7px 10px;border-bottom:1px solid ${D.line};flex:none;flex-wrap:wrap}.af-receipts .af-btn{padding:3px 7px;font-size:10px;min-height:24px}.af-btn.selected{border-color:${D.accent};background:color-mix(in srgb,${D.accent} 10%,${D.panel});color:${D.accent}}.af-recordtitle{font-weight:650;font-size:13px;margin-bottom:11px}.af-invoice{display:block;width:100%;margin-bottom:6px;font-size:10px;text-align:left;white-space:normal;overflow-wrap:anywhere}.af-invoice b{display:block;font-size:11px}.af-invoice .af-line{font-size:10px}.af-policy{padding:10px;margin-top:10px;border:1px solid ${D.line};border-radius:5px;background:${D.bg};font-size:11px}.af-policy h3{font-size:12px;margin:0 0 6px}.af-policy ol{padding-left:17px;margin:5px 0}.af-policy li{margin-bottom:6px}.af-person{display:flex;align-items:center;gap:9px;padding:9px 0;border-bottom:1px solid ${D.line};min-height:53px}.af-avatar{display:grid;place-items:center;width:29px;height:29px;border-radius:50%;background:color-mix(in srgb,${D.accent} 12%,${D.panel});color:${D.accent};font-size:10px;font-weight:700;flex:none}.af-person-name{font-weight:600;font-size:11px}.af-person small{font-size:10px;color:${D.muted}}.af-person .af-btn{font-size:10px}.af-route{font-size:11px;min-height:26px;padding:8px 10px;display:flex;align-items:center;gap:5px;flex-wrap:wrap;border-bottom:1px solid ${D.line}}.af-routechip{display:inline-flex;align-items:center;gap:4px;border:1px solid ${D.line};border-radius:4px;padding:3px 5px;font-size:10px;background:${D.bg}}.af-routechip button{border:0;background:none;cursor:pointer;padding:0 2px;color:${D.muted}}
  .af-footer{flex:none;min-height:43px;border-top:1px solid ${D.line};display:flex;align-items:center;gap:8px;padding:7px 11px;background:${D.bg}}.af-notice{font-size:10px;color:${D.muted};min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.af-footer .primary{flex:none;font-size:11px}.af-popup{position:absolute;z-index:100;background:${D.panel};border:1px solid ${D.line};box-shadow:0 8px 24px #0003;padding:5px;border-radius:6px;display:grid;grid-template-columns:1fr;max-width:calc(100% - 16px)}.af-popup[hidden]{display:none}.af-option{border:0;border-radius:3px;background:${D.panel};color:${D.fg};padding:7px 8px;text-align:left;white-space:nowrap;font-size:11px!important;cursor:pointer}.af-option:hover{background:color-mix(in srgb,${D.accent} 12%,${D.panel})}.af-option:disabled{opacity:.45;cursor:default}
  .af-app.compact{font-size:11px}.af-app.compact .af-heading{padding:7px 10px;min-height:44px}.af-app.compact .af-heading h2{font-size:15px}.af-app.compact .af-nav{gap:10px;padding:0 10px}.af-app.compact .af-metrics{gap:8px;padding:5px 10px}.af-app.compact .af-content{padding:8px}.af-app.compact .af-work:not(.reconcile){grid-template-columns:minmax(0,.9fr) minmax(0,1.4fr)}.af-app.compact .af-top{padding:0 10px}.af-app.compact .af-entryhead,.af-app.compact .af-entry{grid-template-columns:minmax(0,1.6fr) minmax(0,1fr) minmax(0,1fr);gap:4px}
  .af-svg{width:15px;height:15px;flex:none;vertical-align:middle;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}.af-shell{display:flex;flex:1;min-width:0;min-height:0}.af-main{display:flex;flex:1;flex-direction:column;min-width:0;min-height:0}.af-sidebar{width:${D.sidebarWidth}px;flex:none;display:flex;flex-direction:column;border-right:1px solid ${D.line};background:color-mix(in srgb,${D.bg} 75%,${D.panel});padding:10px 7px;overflow:auto;font-size:11px}.af-sidegroup{font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:${D.muted};margin:11px 8px 5px}.af-sideitem{display:flex;gap:8px;align-items:center;min-height:31px;border:0;background:transparent;color:${D.fg};width:100%;border-radius:5px;text-align:left;padding:5px 8px;font:inherit;cursor:pointer}.af-sideitem.active{color:${D.accent};background:color-mix(in srgb,${D.accent} 12%,${D.panel});font-weight:650}.af-sideitem:hover{background:color-mix(in srgb,${D.accent} 7%,${D.panel})}.af-count{margin-left:auto;font-size:9px;color:${D.muted};padding:1px 4px;border-radius:3px;background:${D.panel}}.af-sidefoot{margin-top:auto;border-top:1px solid ${D.line};padding:11px 7px 0;color:${D.muted};font-size:10px}.af-closeprogress{height:3px;margin:8px 0;background:${D.line}}.af-closeprogress:before{content:'';display:block;width:68%;height:100%;background:${D.accent}}
  .af-top{height:40px}.af-top .af-company{max-width:26%;font-size:11px}.af-topcontrol{display:inline-flex;align-items:center;justify-content:center;gap:7px;position:relative;border:0;background:transparent;color:${D.muted};border-radius:4px;min-height:27px;cursor:pointer;padding:4px 7px;font-size:11px!important}.af-topcontrol:hover{background:${D.panel};color:${D.fg}}.af-global-search{margin-left:24px;border:1px solid ${D.line};background:${D.panel};width:210px;justify-content:flex-start}.af-keycap{font-size:9px;border:1px solid ${D.line};border-radius:3px;padding:1px 4px;margin-left:auto}.af-dot{width:5px;height:5px;background:${D.accent};position:absolute;right:5px;top:3px;border-radius:50%}.af-user{background:color-mix(in srgb,${D.accent} 12%,${D.panel});border-radius:50%;width:27px;height:27px;font-size:10px!important;color:${D.accent}}
  .af-nav{height:29px;font-size:10px;background:${D.panel}}.af-nav .on{height:29px}.af-heading{padding:10px 13px 6px;min-height:50px}.af-heading h2{font-size:18px;letter-spacing:-.02em}.af-metrics{background:${D.bg};gap:20px;padding:8px 13px}.af-metric{display:block;border-left:2px solid ${D.line};padding-left:8px}.af-metric span{display:block;font-size:9px;text-transform:uppercase;letter-spacing:.03em}.af-metric b{font-size:15px;line-height:1.4}.af-toolbar{height:33px;flex:none;display:flex;align-items:center;gap:6px;padding:3px 9px;border-bottom:1px solid ${D.line};background:${D.panel};font-size:10px;overflow:hidden}.af-tool{display:inline-flex;align-items:center;gap:5px;border:1px solid ${D.line};border-radius:4px;background:${D.panel};height:25px;white-space:nowrap;padding:3px 7px;font-size:10px!important;color:${D.muted}!important}.af-tool svg{width:12px;height:12px}.af-toolbar .af-sp{min-width:4px}.af-badge{display:inline-flex;align-items:center;gap:4px;border-radius:4px;padding:3px 6px}.af-badge.saved{color:${D.accent};border-color:color-mix(in srgb,${D.accent} 35%,${D.line});background:color-mix(in srgb,${D.accent} 8%,${D.panel})}.af-badge.warning{color:${D.fg};border-color:${D.balanceWarningColor};background:color-mix(in srgb,${D.balanceWarningColor} 10%,${D.panel})}
  .af-row{height:67px;border-radius:0;border-width:0 0 1px;margin-bottom:0;padding:7px 9px;background:${D.panel}}.af-content:has(>.af-row){padding:0}.af-row .af-id{font-size:9px}.af-row .af-match{font-size:9px}.af-row:nth-child(even){background:color-mix(in srgb,${D.bg} 45%,${D.panel})}.af-row.matched{border-left:3px solid ${D.accent};background:color-mix(in srgb,${D.accent} 6%,${D.panel})}.af-row .af-line{margin-top:2px}.af-row .af-match{margin-top:2px}.af-colhead{height:29px;font-size:10px}.af-colhead small{font-size:9px}.af-paper{background:${D.panel};border-radius:1px;box-shadow:0 2px 5px #0000000b;padding:12px}.af-viewerbar{display:flex;align-items:center;gap:6px;padding:6px 8px;background:${D.bg};border:1px solid ${D.line};font-size:9px;margin-bottom:9px;color:${D.muted}}.af-viewerbar svg{width:12px;height:12px}.af-documentbrand{display:flex;align-items:center;gap:7px;font-size:10px;color:${D.muted};border-bottom:1px solid ${D.line};padding-bottom:8px;margin-bottom:10px}.af-documentbrand .af-svg{color:${D.accent}}.af-documentmeta{display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:10px;border:1px solid ${D.line};padding:8px;background:${D.bg};margin-bottom:10px}.af-documentmeta small{display:block;color:${D.muted};font-size:9px}.af-documentmeta strong{font-weight:550;overflow-wrap:anywhere}.af-entryhead,.af-entry{grid-template-columns:18px minmax(0,1.8fr) minmax(0,1fr) minmax(0,1fr);gap:6px}.af-entry{height:40px}.af-entry .af-id{font-size:9px}.af-app.compact .af-entryhead,.af-app.compact .af-entry{grid-template-columns:14px minmax(0,1.6fr) minmax(0,1fr) minmax(0,1fr)}.af-entrytotal{border-bottom:1px solid ${D.line};font-weight:650;font-variant-numeric:tabular-nums}.af-linehelp{font-size:9px;color:${D.muted};padding:6px 0}.af-fields{gap:9px}.af-recordtitle{font-size:12px;margin-bottom:8px}.af-summarybox{border:1px solid ${D.line};border-radius:4px;padding:10px;margin:12px 0 0;background:${D.bg};font-size:10px}.af-summarybox h4{font-size:10px;margin:0 0 8px;text-transform:uppercase;letter-spacing:.04em}.af-kv{display:flex;gap:10px;justify-content:space-between;padding:4px 0;border-bottom:1px solid color-mix(in srgb,${D.line} 50%,transparent);font-size:10px}.af-kv span{color:${D.muted}}.af-kv b{font-weight:550;text-align:right;font-variant-numeric:tabular-nums}.af-kv:last-child{border-bottom:0}.af-history{margin-top:16px;border-top:1px solid ${D.line};font-size:10px}.af-history h4{font-size:9px;color:${D.muted};text-transform:uppercase;letter-spacing:.06em;margin:9px 0}.af-historyrow{padding:7px 0;border-bottom:1px solid ${D.line};display:flex;align-items:center;gap:7px}.af-historyrow strong{display:block;font-size:10px;font-weight:550;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.af-historyrow small{font-size:9px;color:${D.muted}}.af-historyrow .af-badge{font-size:8px;padding:2px 4px}.af-invoice{border-radius:0;margin-bottom:0;border-width:0 0 1px;padding:8px;font-size:10px}.af-invoice b{display:flex;align-items:center;gap:5px}.af-invoice.selected{border-left:3px solid ${D.accent}}.af-person{min-height:49px;padding:7px 0}.af-person-name{font-size:11px}.af-routechip button{display:flex;align-items:center}.af-routechip svg{width:11px;height:11px}.af-checklist{margin:10px 0 0;padding:0;list-style:none;font-size:10px;color:${D.muted}}.af-checklist li{display:flex;align-items:center;gap:5px;padding:4px 0}.af-checklist svg{width:12px;height:12px}.af-picker{display:flex;align-items:center;justify-content:space-between;gap:5px}.af-picker span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.af-picker .af-svg{width:12px;height:12px}.af-receipts .af-btn{display:flex;align-items:center;gap:4px}.af-receipts svg{width:11px;height:11px}.af-footer .af-svg{width:13px;height:13px}.af-footer .primary{display:flex;align-items:center;gap:6px}
  .af-inspector{display:flex;flex-direction:column;flex:none;width:${D.inspectorWidth}px;border-left:1px solid ${D.line};background:color-mix(in srgb,${D.bg} 65%,${D.panel});min-height:0}.af-inspectorhead{padding:13px 12px 8px;font-size:11px;font-weight:650}.af-inspectorbody{overflow:auto;padding:0 12px 12px;min-height:0;flex:1}.af-inspector h4{font-size:9px;letter-spacing:.05em;text-transform:uppercase;color:${D.muted};margin:16px 0 7px}.af-audit{display:flex;gap:8px;border-left:1px solid ${D.line};margin:0 0 0 5px;padding:0 0 13px 10px;position:relative;font-size:10px}.af-audit:before{content:'';position:absolute;left:-4px;top:4px;width:7px;height:7px;background:${D.panel};border:1px solid ${D.accent};border-radius:50%}.af-audit small{display:block;color:${D.muted};font-size:9px;margin-top:3px}.af-comment{padding:8px;border:1px solid ${D.line};background:${D.panel};border-radius:4px;font-size:10px;margin-bottom:7px}.af-comment b{display:block;margin-bottom:4px}.af-projectline{font-size:10px;padding:7px 0;border-bottom:1px solid ${D.line}}.af-projectline small{display:block;color:${D.muted};font-size:9px}.af-flyout{position:absolute;z-index:110;top:45px;right:9px;width:310px;max-width:calc(100% - 18px);max-height:calc(100% - 58px);overflow:auto;border:1px solid ${D.line};border-radius:7px;background:${D.panel};box-shadow:0 10px 35px #0003;padding:13px}.af-flyout[hidden]{display:none}.af-flyouthead{display:flex;align-items:center;justify-content:space-between;font-size:13px;font-weight:650;margin-bottom:10px}.af-flyout .af-history{margin-top:8px}.af-flyout p{font-size:11px;color:${D.muted}}.af-searchresult{padding:9px 0;border-bottom:1px solid ${D.line};font-size:11px}.af-searchresult small{display:block;color:${D.muted};font-size:10px}.af-sidebar.rail{width:42px;padding:7px 4px}.af-sidebar.rail .af-sideitem{padding:7px;min-height:32px}.af-sidebar.rail .af-sideitem span,.af-sidebar.rail .af-sidegroup,.af-sidebar.rail .af-sidefoot{display:none}.af-sidebar.narrow{width:116px}.af-sidebar.narrow .af-sideitem{gap:5px;font-size:10px;padding:5px}.af-sidebar.narrow .af-count{font-size:8px}.af-app.tight .af-global-search{width:130px;margin-left:0}.af-app.tight .af-keycap{display:none}.af-app.tight .af-top{gap:5px}.af-app.tight .af-heading h2{font-size:16px}.af-app.tight .af-metrics{gap:10px}.af-app.tight .af-metric b{font-size:13px}.af-app.tight .af-tool{padding:3px 5px}.af-app.tight .af-toolbar{gap:4px}.af-app.tight .af-nav{gap:12px}.af-app.tight .af-fields{column-gap:6px}.af-app.tight .af-documentmeta{padding:6px}.af-app.tight .af-paper{padding:9px}.af-app.tight .af-company{max-width:23%}.af-app.tight .af-toolbar .af-tool:last-child{display:none}
  .af-global-search{white-space:nowrap}.af-top .af-global-search span{flex:none}.af-sideitem>span:not(.af-count){flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.af-count{flex:none}.af-audit{display:block}.af-sidebar.narrow{width:132px}.af-app.tight .af-global-search{width:146px}
  `;

  const paths = {
    chevron: 'm8 10 4 4 4-4', search: 'M21 21l-5-5 M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
    bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9 M10 21h4',
    home: 'm3 10 9-7 9 7v11h-7v-7h-4v7H3z', bank: 'm3 8 9-5 9 5z M5 10v8m7-8v8m7-8v8M3 21h18',
    book: 'M4 3h15v18H4z M8 3v18 M11 8h5m-5 4h5', receipt: 'M5 3l2 2 2-2 3 2 3-2 2 2 2-2v18l-3-2-3 2-3-2-3 2-2-2z M8 9h8m-8 4h6',
    invoice: 'M5 2h9l5 5v15H5z M14 2v6h5 M8 12h8m-8 4h6', chart: 'M3 3v18h18M7 16v-5m5 5V7m5 9V4',
    folder: 'M3 6h7l2 3h9v11H3z', settings: 'M4 6h16M4 12h16M4 18h16M8 3v6m8 0v6m-6 0v6',
    help: 'M9 8a3 3 0 0 1 6 0c0 2-3 2-3 5 M12 17h.01 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
    close: 'm6 6 12 12M6 18 18 6', check: 'm5 12 4 4L19 6', calendar: 'M4 5h16v16H4zM4 10h16M8 2v6m8-6v6',
    filter: 'M3 5h18l-7 8v6l-4 2v-8z', download: 'M12 3v12m-5-5 5 5 5-5 M4 17v4h16v-4',
    clip: 'm9 14 7-7a3 3 0 0 1 4 4L10 21a5 5 0 0 1-7-7L14 3',
    clock: 'M12 6v6l4 2 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0',
    lock: 'M5 10h14v12H5z M8 10V6a4 4 0 0 1 8 0v4', plus: 'M12 4v16M4 12h16',
  };
  const TOKENS = {
    brand: 'Folio', logo: 'F', workspaceLabel: 'Folio accounting workspace',
    labels: { reconcile: 'Banking', journal: 'General ledger', expense: 'Expenses', approve: 'Payables' },
    titles: { reconcile: 'Reconcile transactions', journal: 'New journal entry', expense: 'Expense report', approve: 'Invoice approvals' },
    commitLabels: { reconcile: 'Save reconciliation', journal: 'Post journal', expense: 'File report', approve: 'Approve payment' },
    icons: paths,
    inset: 10, radius: 9, font: '12px/1.4 system-ui,sans-serif',
    sidebarWidth: 142, narrowSidebarWidth: 132, inspectorWidth: 212,
    compactWidth: 760, compactHeight: 460, tightWidth: 1150, railWidth: 740, inspectorMinWidth: 1250,
    panel: 'var(--panel)', bg: 'var(--bg)', fg: 'var(--fg)', muted: 'var(--muted)', line: 'var(--line)', accent: 'var(--accent)',
    warningColor: '#cf8d29', balanceWarningColor: '#a87032', extraCss: '',
  };

  function installFrame(BASE, S) {
    BASE.frame = (ctx) => {
      const node = S.ctx.util.el('section', 'af-app' + (ctx.size.width < S.D.compactWidth || ctx.size.height < S.D.compactHeight ? ' compact' : '') + (ctx.size.width < S.D.tightWidth ? ' tight' : ''), ctx.stage);
      node.setAttribute('aria-label', S.D.workspaceLabel);
      return node;
    };

    BASE.button = (parent, text, action, cls = '') => {
      const b = S.el('button', 'af-btn ' + cls, parent, text); b.type = 'button'; if (action) b.addEventListener('click', action); return b;
    };

    BASE.icon = (parent, name) => {
      const svg = S.ctx.util.svg('svg', { viewBox: '0 0 24 24', class: 'af-svg', 'aria-hidden': 'true' }, parent);
      S.ctx.util.svg('path', { d: S.D.icons[name] || S.D.icons.invoice }, svg); return svg;
    };

    BASE.iconButton = (parent, text, name, action, cls = '') => {
      const b = S.P.button(parent, '', action, cls); S.P.icon(b, name); if (text) S.el('span', '', b, text); b.setAttribute('aria-label', text || name); b.title = text || name; return b;
    };

    BASE.background = (ctx) => {
      const cr = ctx.rng.fork('finance-workspace'), cs = { csplit: S.spec.csplit };
      return Array.from({ length: 7 }, (_, i) => ({ company: env.content.pick(cr, env.content.COMPANIES, cs), amount: cr.int(65, 4200) * 100 + cr.int(0, 99), ref: 'AP-' + (4820 + i), date: '2026-08-' + (21 + i) }));
    };

    BASE.kv = (parent, label, value) => {
      const row = S.el('div', 'af-kv', parent); S.el('span', '', row, label); S.el('b', '', row, value); return row;
    };

    BASE.history = (parent, title, records = S.background.slice(0, 4)) => {
      const section = S.el('div', 'af-history', parent); S.el('h4', '', section, title);
      const status = /voucher/i.test(title) ? 'Posted' : /report/i.test(title) ? 'Filed' : /reconciled/i.test(title) ? 'Reconciled' : 'Paid';
      for (const r of records) S.P.historyRow(section, r, status);
      return section;
    };

    BASE.historyRow = (parent, record, status) => {
      const row = S.el('div', 'af-historyrow', parent); S.P.icon(row, 'invoice'); const text = S.el('div', 'af-sp', row); S.el('strong', '', text, record.company); S.el('small', '', text, record.ref.replace('AP-', status === 'Posted' ? 'JV-' : status === 'Filed' ? 'EXP-' : 'AP-') + ' / ' + record.date); S.el('span', 'af-badge', row, status); return row;
    };

    BASE.showPanel = (title, build) => {
      S.flyout.replaceChildren(); S.flyout.hidden = false; S.flyout.setAttribute('aria-label', title);
      const head = S.el('div', 'af-flyouthead', S.flyout, title);
      S.P.iconButton(head, '', 'close', () => { S.flyout.hidden = true; }, 'quiet'); build(S.flyout);
    };

    BASE.preview = (title) => {
      S.P.showPanel(title, panel => { S.el('p', '', panel, 'Workspace overview / September 2026'); S.P.history(panel, 'Recently completed'); });
    };

    BASE.change = (action) => {
      S.ctx.update(S.task.helpers.apply(S.ctx.model, S.spec, action)); S.paint(S.ctx.model);
    };

    BASE.shell = () => S.el('div', 'af-shell', S.root);
    BASE.main = () => S.el('div', 'af-main', S.shell);
    BASE.work = () => S.el('div', 'af-work ' + S.spec.scenario, S.main);
  }

  function installChrome(BASE, S) {
    BASE.top = () => {
      const top = S.el('div', 'af-top', S.root); S.el('span', 'af-logo', top, S.D.logo); S.el('span', 'af-brand', top, S.D.brand);
      const search = S.P.iconButton(top, 'Search workspace', 'search', () => S.P.showPanel('Search workspace', panel => {
        const input = S.el('input', 'af-input', panel); input.type = 'search'; input.placeholder = 'Vendors, projects, documents'; input.setAttribute('aria-label', 'Search vendors, projects, documents');
        const results = S.el('div', '', panel);
        const render = () => { results.replaceChildren(); const data = [...S.background.map(r => [r.company, r.ref + ' / Paid bill']), ...S.spec.projects.map((p, i) => [p, ['Website refresh', 'Client delivery', 'Office relocation'][i]])].filter(r => r.join(' ').toLowerCase().includes(input.value.toLowerCase()));
          for (const [name, detail] of data) { const row = S.el('div', 'af-searchresult', results, name); S.el('small', '', row, detail); } if (!data.length) S.el('p', '', results, 'No matching records. Try a vendor name or project code.'); };
        input.addEventListener('input', render); render(); input.focus();
      }), 'af-topcontrol af-global-search'); S.el('span', 'af-keycap', search, 'Search');
      S.el('span', 'af-sp', top); S.el('span', 'af-company', top, S.spec.company);
      S.P.iconButton(top, '', 'help', () => S.P.showPanel('Accounting help', panel => { S.el('p', '', panel, 'Your accounting period is September 2026. Documents and activity are retained with every saved record.'); }), 'af-topcontrol');
      const bell = S.P.iconButton(top, '', 'bell', () => S.P.showPanel('Notifications', panel => { for (const [title, detail] of [['Bank feed updated', 'Operating account ending 1042 / 08:42'], ['Month-end review', 'September close checklist is due Friday'], ['New vendor document', S.background[0].company + ' uploaded a statement']]) { const row = S.el('div', 'af-searchresult', panel, title); S.el('small', '', row, detail); } }), 'af-topcontrol'); S.el('span', 'af-dot', bell);
      S.P.button(top, S.spec.staff[0].name.split(' ').map(n => n[0]).slice(0, 2).join(''), () => S.P.showPanel('Your account', panel => { S.el('p', '', panel, S.spec.staff[0].name + ' / Finance team'); S.P.kv(panel, 'Access', 'Accountant'); S.P.kv(panel, 'Organisation', S.spec.company); }), 'af-topcontrol af-user');
    };

    BASE.sidebar = () => {
      S.side = S.el('aside', 'af-sidebar' + (S.ctx.size.width < S.D.railWidth ? ' rail' : S.ctx.size.width < S.D.tightWidth ? ' narrow' : ''), S.shell);
      S.el('div', 'af-sidegroup', S.side, 'Workspace');
      S.P.navItem('Overview', 'home'); S.el('div', 'af-sidegroup', S.side, 'Accounting');
      for (const [v, label, name, count] of [['reconcile', 'Banking', 'bank', '18'], ['journal', 'General ledger', 'book', ''], ['approve', 'Payables', 'invoice', '12'], ['expense', 'Expenses', 'receipt', '7']]) S.P.navItem(label, name, count, v === S.spec.scenario);
      S.el('div', 'af-sidegroup', S.side, 'Management'); S.P.navItem('Projects', 'folder', '3'); S.P.navItem('Reports', 'chart'); S.P.navItem('Documents', 'clip', '9'); S.P.navItem('Settings', 'settings');
      const close = S.el('div', 'af-sidefoot', S.side); S.el('b', '', close, 'September close'); S.el('div', 'af-closeprogress', close); S.el('span', '', close, '8 of 12 tasks complete');
    };

    BASE.navItem = (text, name, count, active) => {
      const b = S.P.iconButton(S.side, text, name, () => S.P.preview(text), 'af-sideitem' + (active ? ' active' : '')); if (count) S.el('span', 'af-count', b, count); return b;
    };

    BASE.navigation = () => {
      const nav = S.el('nav', 'af-nav', S.main);
      for (const [v, label] of Object.entries(S.D.labels)) S.el('span', v === S.spec.scenario ? 'on' : '', nav, label);
    };

    BASE.heading = () => {
      const heading = S.el('div', 'af-heading', S.main), headingText = S.el('div', '', heading);
      S.el('h2', '', headingText, S.D.titles[S.spec.scenario]);
      S.el('div', 'af-sub', headingText, S.spec.ref + ' · September 2026 · USD'); S.el('span', 'af-sp', heading);
      S.statusBadge = S.el('span', 'af-badge', heading, 'Draft');
      S.P.iconButton(heading, 'Activity', 'clock', () => S.P.showPanel('Record activity', panel => { S.P.kv(panel, 'Reference', S.spec.ref); S.P.kv(panel, 'Status', S.task.helpers.status(S.ctx.model, S.spec)); S.P.kv(panel, 'Created by', S.spec.staff[0].name); S.P.history(panel, 'Earlier activity', S.background.slice(0, 3)); }), 'quiet');
      S.metrics = S.el('div', 'af-metrics', S.main);
    };

    BASE.toolbar = () => {
      const toolbar = S.el('div', 'af-toolbar', S.main);
      S.P.iconButton(toolbar, 'Sep 2026', 'calendar', () => S.P.showPanel('Accounting period', panel => { S.P.kv(panel, 'Period', '01 Sep - 30 Sep 2026'); S.P.kv(panel, 'Reporting currency', 'USD'); S.P.kv(panel, 'Book', 'Accrual'); S.P.kv(panel, 'Prior period', 'August / Closed'); }), 'af-tool');
      S.P.iconButton(toolbar, S.spec.scenario === 'reconcile' ? 'Operating 1042' : 'Main entity', S.spec.scenario === 'reconcile' ? 'bank' : 'folder', () => S.P.showPanel('Account details', panel => { S.P.kv(panel, 'Entity', S.spec.company); S.P.kv(panel, 'Account', 'Operating / ending 1042'); S.P.kv(panel, 'Bank feed', 'Connected / refreshed 08:42'); S.P.kv(panel, 'Opening balance', S.task.helpers.money(S.spec.opening)); }), 'af-tool');
      S.el('span', 'af-sp', toolbar);
      S.P.iconButton(toolbar, 'Filters', 'filter', () => S.P.showPanel('Current view', panel => { S.P.kv(panel, 'Period', 'September 2026'); S.P.kv(panel, 'Record type', S.D.labels[S.spec.scenario]); S.P.kv(panel, 'Display', 'All records in this batch'); S.el('p', '', panel, 'Earlier periods are available under Reports.'); }), 'af-tool');
      S.P.iconButton(toolbar, 'Attachments', 'clip', () => S.P.showPanel('Attachments', panel => { for (const r of S.spec.scenario === 'expense' ? S.spec.receipts : [{ id: S.spec.ref }]) { const row = S.el('div', 'af-searchresult', panel, r.id + '.pdf'); S.el('small', '', row, 'PDF document / Original / Verified upload'); } }), 'af-tool');
      S.P.iconButton(toolbar, 'Export', 'download', () => S.P.showPanel('Export preview', panel => { S.P.kv(panel, 'Reference', S.spec.ref); S.P.kv(panel, 'Format', 'CSV / Accounting record'); for (const f of S.task.facts(S.ctx.model, S.spec)) S.P.kv(panel, f.label, f.value); }), 'af-tool');
    };
  }

  function installControls(BASE, S) {
    BASE.column = (title, note) => {
      const col = S.el('section', 'af-column', S.work), header = S.el('div', 'af-colhead', col);
      S.el('span', '', header, title); if (note) S.el('small', '', header, note);
      return col;
    };

    BASE.scrollFrame = (col, name) => {
      const box = S.el('div', 'af-scrollbox', col), pane = S.el('div', 'af-pane', box), content = S.el('div', 'af-content', pane);
      const track = S.el('div', 'af-track', box), thumb = S.el('div', 'af-thumb', track);
      return { pane, content, track, thumb, positions: {} };
    };

    BASE.refreshPane = (p, name, state) => {
      if (!state.root.isConnected || S.current !== state) return;
      const { pane, track, thumb } = p;
      const height = pane.clientHeight, max = Math.max(0, pane.scrollHeight - height);
      const th = Math.min(track.clientHeight, Math.max(20, track.clientHeight * height / Math.max(1, pane.scrollHeight)));
      thumb.style.height = th + 'px'; thumb.style.top = (max ? pane.scrollTop / max * (track.clientHeight - th) : 0) + 'px';
      track.style.visibility = max > 0 ? 'visible' : 'hidden';
      const r = pane.getBoundingClientRect(), pos = {};
      for (const [key, node] of Object.entries(p.positions)) { const b = node.getBoundingClientRect(); pos[key] = [b.top - r.top + pane.scrollTop, b.bottom - r.top + pane.scrollTop]; }
      const v = { top: pane.scrollTop, height, max, pos };
      state.ctx.patch({ view: { ...state.ctx.model.view, [name]: v } });
    };

    BASE.scroll = (col, name) => {
      const p = S.P.scrollFrame(col, name); S.panes[name] = p;
      const state = S.current;
      const refresh = () => S.P.refreshPane(p, name, state);
      p.api = env.ui.scrollPane(p.pane, { thumb: p.thumb, track: p.track, onScroll: refresh, label: 'finance-' + name });
      p.refresh = refresh; p.pane.addEventListener('scroll', refresh);
      return p;
    };

    BASE.inputControl = (parent, i, k, label, cls = '') => {
      const node = S.el('input', 'af-input ' + cls, parent); node.type = 'text'; node.autocomplete = 'off'; node.spellcheck = false;
      node.setAttribute('aria-label', label); if (cls === 'money') node.inputMode = 'decimal';
      if (k === 'date') node.placeholder = 'YYYY-MM-DD'; else if (cls === 'money') node.placeholder = '0.00';
      return node;
    };

    BASE.input = (parent, i, k, label, cls = '') => {
      const node = S.P.inputControl(parent, i, k, label, cls);
      S.fields[i + ':' + k] = node; S.register({ field: [i, k] }, node);
      node.addEventListener('input', () => S.P.change({ field: [i, k], value: node.value })); return node;
    };

    BASE.pickerControl = (parent, label, action) => {
      const node = S.P.button(parent, '', action, 'af-picker');
      const text = S.el('span', '', node, label); S.P.icon(node, 'chevron');
      node.setAttribute('aria-label', label); node.setAttribute('aria-haspopup', 'listbox');
      return { node, text, label };
    };

    BASE.picker = (parent, i, k, label) => {
      const p = S.P.pickerControl(parent, label, () => S.P.change({ open: S.ctx.model.open && S.ctx.model.open[0] === i && S.ctx.model.open[1] === k ? null : [i, k] }));
      S.pickers[i + ':' + k] = p; S.register({ pick: [i, k] }, p.node); return p.node;
    };

    BASE.viewer = (parent, filename) => {
      const bar = S.el('div', 'af-viewerbar', parent); S.P.icon(bar, 'invoice'); S.el('span', 'af-sp', bar, filename); S.el('span', '', bar, '1 / 1'); S.P.icon(bar, 'download'); return bar;
    };

    BASE.metadata = (parent, pairs) => {
      const grid = S.el('div', 'af-documentmeta', parent); for (const [label, value] of pairs) S.P.metadataField(grid, label, value); return grid;
    };

    BASE.metadataField = (parent, label, value) => {
      const field = S.el('div', '', parent); S.el('small', '', field, label); S.el('strong', '', field, value); return field;
    };
  }

  function installReconciliation(BASE, S) {
    BASE.transactionRow = (parent, row, bank) => {
      const node = S.el('div', 'af-row ' + (bank ? 'bank' : ''), parent);
      const title = S.el('div', 'af-row-title', node); S.el('span', 'af-id', title, row.id); S.el('span', 'af-payee', title, row.merchant);
      node.title = row.merchant; const line = S.el('div', 'af-line', node); S.el('span', 'af-muted', line, row.date); S.el('strong', '', line, '-' + S.task.helpers.money(row.amount));
      const match = S.el('div', 'af-match', node, 'Unmatched'); node._match = match;
      return node;
    };

    BASE.bankBehavior = (node, row, right) => {
      const match = node._match;
      const unlink = S.el('button', 'af-unlink', match, 'Unmatch'); unlink.type = 'button'; unlink.hidden = true; S.unlinkNodes[row.id] = unlink;
      S.register({ unlink: row.id }, unlink); unlink.addEventListener('click', e => { e.stopPropagation(); S.P.change({ unlink: row.id }); });
      let dragging = false, ghost = null;
      env.ui.track(node, {
        start(p, e) { if (e.target === unlink) return false; dragging = false; },
        move(p) {
          if (Math.hypot(p.dx, p.dy) > 4) dragging = true;
          if (!dragging) return;
          if (!ghost) {
            const b = node.getBoundingClientRect(), r = S.root.getBoundingClientRect();
            ghost = node.cloneNode(true); ghost.classList.add('dragging');
            Object.assign(ghost.style, { position: 'absolute', left: b.left - r.left + 'px', top: b.top - r.top + 'px', width: b.width + 'px', margin: '0' });
            S.root.appendChild(ghost); node.style.opacity = '.35';
          }
          ghost.style.transform = `translate(${p.dx}px,${p.dy}px)`;
          for (const n of Object.values(S.ledgerNodes)) { const b = n.getBoundingClientRect(); n.classList.toggle('over', p.x > b.left && p.x < b.right && p.y > b.top && p.y < b.bottom); }
        },
        end(p) {
          if (ghost) { ghost.remove(); ghost = null; }
          node.style.opacity = '';
          const visible = right.pane.getBoundingClientRect();
          for (const [id, n] of Object.entries(S.ledgerNodes)) {
            n.classList.remove('over'); const b = n.getBoundingClientRect();
            if (dragging && p.x >= b.left && p.x <= b.right && p.y >= Math.max(b.top, visible.top) && p.y <= Math.min(b.bottom, visible.bottom)) { S.P.change({ match: [row.id, id] }); break; }
          }
        },
      }, 'bank-line-' + row.id);
    };

    BASE.renderReconcile = () => {
      const left = S.P.scroll(S.P.column('Bank statement', S.spec.bank.length + ' lines'), 'bank');
      const right = S.P.scroll(S.P.column('Ledger entries', 'Posted transactions'), 'ledger');
      for (const [rows, p, store, bank] of [[S.spec.bank, left, S.bankNodes, true], [S.spec.ledger, right, S.ledgerNodes, false]]) for (const row of rows) {
        const node = S.P.transactionRow(p.content, row, bank); store[row.id] = node; p.positions[row.id] = node;
        S.register(bank ? { bank: row.id } : { ledger: row.id }, node);
        if (bank) S.P.bankBehavior(node, row, right);
        S.P.item(node, row);
      }
      const bankFoot = S.el('div', 'af-summarybox', left.content); S.P.kv(bankFoot, 'Source', 'Direct bank feed'); S.P.kv(bankFoot, 'Statement', 'September 2026'); S.P.kv(bankFoot, 'Refreshed', '08:42 / All lines imported');
      const closed = S.el('div', 'af-content', right.content); S.P.history(closed, 'Prior period / Already reconciled');
    };
  }

  function installJournal(BASE, S) {
    BASE.voucher = (parent) => {
      const paper = S.el('div', 'af-paper', parent); S.el('h3', '', paper, 'Accrual voucher'); S.el('span', 'af-id', paper, S.spec.ref);
      const brand = S.el('div', 'af-documentbrand', paper); S.P.icon(brand, 'book'); S.el('span', '', brand, 'FINANCE OPERATIONS / INTERNAL');
      S.el('p', '', paper, 'Effective date: 2026-09-30');
      for (const r of S.spec.voucher.rows) { const line = S.el('div', 'af-paper-line', paper); S.el('strong', '', line, r.account); S.el('div', 'af-line', line, (r.debit ? 'Debit ' + S.task.helpers.money(r.debit) : 'Credit ' + S.task.helpers.money(r.credit))); }
      S.el('p', '', paper, 'Memo: ' + S.spec.voucher.memo);
    };

    BASE.journalRow = (edit, i) => {
      const line = S.el('div', 'af-entry', edit.content); edit.positions[String(i)] = line; S.el('span', 'af-id', line, String(i + 1)); S.P.picker(line, i, 'account', 'Choose account'); S.P.input(line, i, 'debit', 'Line ' + (i + 1) + ' debit', 'money'); S.P.input(line, i, 'credit', 'Line ' + (i + 1) + ' credit', 'money'); S.P.item(line, S.spec.goal.rows[i]); return line;
    };

    BASE.renderJournal = () => {
      const source = S.P.scroll(S.P.column('Source voucher', 'Read only'), 'source');
      S.P.viewer(source.content, S.spec.ref + '.pdf');
      S.P.voucher(source.content);
      if (S.spec.disabled.length) S.el('div', 'af-warning', source.content, 'Period lock · ' + S.spec.disabled[0] + ' is unavailable. No substitute account is authorized.');
      S.el('div', 'af-note', source.content, 'Journal control: total debits must equal total credits. Each line uses one side only. ' + S.spec.note);
      S.P.history(source.content, 'Other posted vouchers', S.background.slice(0, 3));
      const edit = S.P.scroll(S.P.column('Journal lines', 'Accrual basis'), 'editor');
      S.P.metadata(edit.content, [['Journal date', '30 Sep 2026'], ['Journal number', S.spec.ref], ['Entity', S.spec.company], ['Book', 'Actual / Accrual']]);
      const th = S.el('div', 'af-entryhead', edit.content); for (const t of ['#', 'Account', 'Debit', 'Credit']) S.el('span', '', th, t);
      S.spec.goal.rows.forEach((r, i) => S.P.journalRow(edit, i));
      S.entryTotal = S.el('div', 'af-entrytotal', edit.content);
      const memoBox = S.el('div', 'af-memo', edit.content); S.el('label', 'af-label', memoBox, 'Memo'); S.memo = S.el('input', 'af-input', memoBox); S.memo.type = 'text'; S.memo.setAttribute('aria-label', 'Memo'); S.register({ memo: true }, S.memo);
      edit.positions.memo = S.memo;
      S.memo.addEventListener('input', () => S.P.change({ memo: S.memo.value }));
      S.validation = S.el('div', 'af-summarybox', edit.content);
      const attachments = S.el('div', 'af-summarybox', edit.content); S.el('h4', '', attachments, 'Supporting documents'); S.P.kv(attachments, 'Attachment', S.spec.ref + '.pdf'); S.P.kv(attachments, 'Uploaded by', S.spec.staff[0].name);
    };
  }

  function installExpenses(BASE, S) {
    BASE.receiptPaper = (parent, r, i) => {
      const paper = S.el('div', 'af-paper', parent);
      S.el('h3', '', paper, r.merchant); S.el('span', 'af-id', paper, 'RECEIPT ' + r.id + ' · ' + r.city);
      S.P.kv(paper, 'Transaction date', r.date); S.P.kv(paper, 'Receipt number', 'RC-' + (10420 + i)); S.el('hr', '', paper);
      S.P.kv(paper, r.category, S.task.helpers.money(r.amount)); S.P.kv(paper, 'Gross subtotal', S.task.helpers.money(r.amount)); S.P.kv(paper, 'Tax detail', 'Included in total');
      S.el('hr', '', paper); S.P.kv(paper, 'TOTAL PAID', S.task.helpers.money(r.amount)); S.el('div', 'af-sub', paper, 'Card ending 1042 / Approved');
    };

    BASE.expenseField = (grid, editor, i, k, label) => {
      const box = S.el('div', 'af-field ' + (k === 'merchant' ? 'wide' : ''), grid); S.el('label', 'af-label', box, label);
      if (['category', 'project'].includes(k)) S.P.picker(box, i, k, label); else S.P.input(box, i, k, label, k === 'amount' ? 'money' : '');
      editor.positions[i + ':' + k] = box;
      S.P.item(box, S.spec.receipts[i]); return box;
    };

    BASE.buildReceipt = (i, source, editor) => {
      source.content.replaceChildren(); editor.content.replaceChildren(); editor.positions = {};
      for (const k of Object.keys(S.fields)) delete S.fields[k]; for (const k of Object.keys(S.pickers)) delete S.pickers[k];
      const r = S.spec.receipts[i]; S.P.viewer(source.content, r.id + '-receipt.pdf');
      S.P.receiptPaper(source.content, r, i);
      const coding = S.el('div', 'af-summarybox', source.content); S.el('h4', '', coding, 'Employee coding note'); S.P.kv(coding, 'Category', r.category); S.P.kv(coding, 'Project', r.project);
      S.el('div', 'af-note', source.content, 'Original retained / Captured from company card feed / Duplicate check complete.');
      S.P.history(source.content, 'Previous reports / Filed', S.background.slice(0, 3));
      if (S.spec.judge && S.spec.judge.mode === 'impossible') S.el('div', 'af-warning', source.content, 'Requested project PRJ-999 has been closed and is unavailable.');
      S.el('div', 'af-recordtitle', editor.content, 'Receipt ' + r.id + ' / ' + S.spec.receipts.length);
      S.P.metadata(editor.content, [['Report', 'September expenses'], ['Employee', S.spec.staff[0].name], ['Payment method', 'Company card / 1042'], ['Reimbursement', 'Not reimbursable']]);
      const grid = S.el('div', 'af-fields', editor.content);
      for (const [k, label] of [['date', 'Date'], ['merchant', 'Merchant'], ['category', 'Category'], ['amount', 'Amount · USD'], ['project', 'Project code']]) {
        S.P.expenseField(grid, editor, i, k, label);
      }
      const summary = S.el('div', 'af-summarybox', editor.content); S.el('h4', '', summary, 'Report receipts');
      S.receiptSummary = S.spec.receipts.map(receipt => S.P.kv(summary, receipt.id + ' / ' + receipt.merchant, '').querySelector('b'));
      S.P.kv(summary, 'Report owner', S.spec.staff[0].name);
    };

    BASE.renderExpense = () => {
      const sourceCol = S.P.column('Receipt inbox', S.spec.receipts.length + ' attachments');
      const tabs = S.el('div', 'af-receipts', sourceCol);
      S.spec.receipts.forEach((r, i) => { const b = S.P.iconButton(tabs, r.id, 'receipt', () => S.P.change({ active: i })); S.receiptButtons[i] = b; S.register({ receipt: i }, b); });
      const source = S.P.scroll(sourceCol, 'source');
      const editor = S.P.scroll(S.P.column('Expense details', 'Copy from receipt'), 'editor');
      S.current.buildReceipt = i => S.P.buildReceipt(i, source, editor);
    };
  }

  function installApprovals(BASE, S) {
    BASE.invoiceRow = (source, r, i) => {
      const b = S.P.button(source.content, '', () => S.P.change({ active: i }), 'af-invoice'); S.invoices[i] = b; S.register({ invoice: i }, b);
      source.positions['invoice:' + i] = b;
      S.el('b', '', b, r.id); S.el('span', '', b, r.merchant); S.el('div', 'af-line', b, S.task.helpers.money(r.amount) + ' · Due ' + r.due);

      S.P.item(b, r); return b;
    };

    BASE.approvalPolicy = (parent) => {
      const policy = S.el('div', 'af-policy', parent); S.el('h3', '', policy, 'Payment approval policy');
      const list = S.el('ol', '', policy);
      S.el('li', '', list, 'Budget owner: every invoice.'); S.el('li', '', list, 'Controller: amounts at least ' + S.task.helpers.money(S.spec.policy.controller) + '.'); S.el('li', '', list, 'Finance director: amounts at least ' + S.task.helpers.money(S.spec.policy.director) + '.');
      S.el('div', 'af-sub', policy, 'Add all required roles in this order. No substitutions. AP assistants cannot authorize payment.');
    };

    BASE.approverRow = (editor, p) => {
      const row = S.el('div', 'af-person', editor.content); editor.positions[p.id] = row; S.el('span', 'af-avatar', row, p.name.split(' ').map(t => t[0]).slice(0, 2).join(''));
      const text = S.el('div', 'af-sp', row); S.el('div', 'af-person-name', text, p.name); S.el('small', '', text, p.role + (!p.available ? ' · Unavailable' : ''));
      const b = S.P.button(row, 'Add', () => S.P.change({ person: p.id })); b.disabled = !p.available; S.people[p.id] = b; S.register({ person: p.id }, b);

      S.P.item(row, p); return row;
    };

    BASE.renderApprove = () => {
      const source = S.P.scroll(S.P.column('Open invoices', 'Awaiting approval'), 'source');
      S.spec.invoices.forEach((r, i) => S.P.invoiceRow(source, r, i));
      S.P.approvalPolicy(source.content);
      const editCol = S.P.column('Approval route', 'Sequential'); S.routeBox = S.el('div', 'af-route', editCol);
      const editor = S.P.scroll(editCol, 'editor');
      S.invoiceDetail = S.el('div', 'af-summarybox', editor.content); S.invoiceDetail.style.marginTop = '0';
      S.el('div', 'af-linehelp', editor.content, 'APPROVER DIRECTORY / Finance team / Sequential approval');
      for (const p of S.spec.staff) S.P.approverRow(editor, p);
      S.el('div', 'af-note', editor.content, 'Approving releases the invoice to the payment queue. Verify the invoice and ordered route before approval.');
      S.P.history(source.content, 'Recently paid / Read only');
    };
  }

  function installPanels(BASE, S) {
    BASE.inspector = () => {
      const rail = S.el('aside', 'af-inspector', S.shell); S.el('div', 'af-inspectorhead', rail, 'Activity & details');
      const body = S.el('div', 'af-inspectorbody', rail); S.P.kv(body, 'Reference', S.spec.ref); S.P.kv(body, 'Owner', S.spec.staff[0].name); S.P.kv(body, 'Currency', 'USD');
      S.el('h4', '', body, 'Audit trail');
      S.auditState = S.el('div', 'af-audit', body, 'Draft created'); S.el('small', '', S.auditState, 'Today / Finance operations');
      for (const [title, detail] of [['Source documents received', '08:42 / Automated import'], ['Period opened for review', 'September 2026 / Controller']]) { const a = S.el('div', 'af-audit', body, title); S.el('small', '', a, detail); }
      S.el('h4', '', body, 'Internal notes'); const note = S.el('div', 'af-comment', body); S.el('b', '', note, S.spec.staff[1].name); S.el('span', '', note, 'Keep the original supporting documents with the September record.');
      S.el('h4', '', body, 'Active projects'); S.spec.projects.forEach((p, i) => { const row = S.el('div', 'af-projectline', body, p + ' / ' + ['Website refresh', 'Client delivery', 'Office relocation'][i]); S.el('small', '', row, ['Budget review due', '4 bills awaiting coding', 'Owner review scheduled'][i]); });
      S.P.history(body, 'Recent vendor activity', S.background.slice(4));
    };

    BASE.footer = () => {
      const footer = S.el('div', 'af-footer', S.main); S.P.icon(footer, 'lock'); S.footerNotice = S.el('span', 'af-notice af-sp', footer, 'Draft · Changes saved locally');
      const commit = S.P.button(footer, S.D.commitLabels[S.spec.scenario], () => {
        if (S.spec.judge && S.spec.judge.mode === 'confirm') { S.ctx.flag('irreversible'); return; }
        S.P.change({ commit: true });
      }, 'primary'); S.P.icon(commit, 'check'); S.register({ commit: true }, commit);
    };

    BASE.popups = () => {
      S.popup = S.el('div', 'af-popup', S.root); S.popup.hidden = true; S.popup.setAttribute('role', 'listbox');
      S.flyout = S.el('div', 'af-flyout', S.root); S.flyout.hidden = true; S.flyout.setAttribute('role', 'dialog');
    };
  }

  function installSynchronization(BASE, S) {
    BASE.syncFields = (m) => {
      S.receiptSummary.forEach((node, i) => { const amount = S.task.helpers.cents(m.rows[i].amount); node.textContent = Number.isFinite(amount) ? S.task.helpers.money(amount) : 'Not entered'; });
      for (const [key, node] of Object.entries(S.fields)) { const [i, k] = key.split(':'); if (node.value !== m.rows[i][k]) node.value = m.rows[i][k]; }
      for (const [key, p] of Object.entries(S.pickers)) { const [i, k] = key.split(':'); p.text.textContent = m.rows[i][k] || p.label; p.node.setAttribute('aria-expanded', String(!!m.open && m.open[0] === Number(i) && m.open[1] === k)); }
      if (S.memo && S.memo.value !== m.memo) S.memo.value = m.memo;
    };

    BASE.syncMatches = (m) => {
      for (const [id, node] of Object.entries(S.bankNodes)) {
        const val = m.matches[id]; node.classList.toggle('matched', !!val);
        if (node._match.firstChild && node._match.firstChild.nodeType === 3) node._match.firstChild.textContent = val ? 'Linked to ' + val + ' ' : 'Unmatched ';
        S.unlinkNodes[id].hidden = !val;
      }
      for (const [id, node] of Object.entries(S.ledgerNodes)) { const linked = Object.keys(m.matches).find(k => m.matches[k] === id); node.classList.toggle('matched', !!linked); node._match.textContent = linked ? 'Matched · ' + linked : 'Awaiting match'; }
    };

    BASE.syncStatus = (m) => {
      S.statusBadge.replaceChildren(); S.P.icon(S.statusBadge, m.final ? 'check' : 'clock'); S.el('span', '', S.statusBadge, S.task.helpers.status(m, S.spec));
      S.statusBadge.classList.toggle('saved', m.final); S.statusBadge.classList.toggle('warning', S.spec.scenario === 'journal' && S.task.helpers.totals(m, S.spec).debit !== S.task.helpers.totals(m, S.spec).credit);
    };

    BASE.syncMetrics = (m) => {
      S.metrics.replaceChildren();
      for (const fact of S.task.facts(m, S.spec).filter(f => f.label !== 'Status')) { S.P.metric(S.metrics, fact); }
    };

    BASE.metric = (parent, fact) => {
      const metric = S.el('div', 'af-metric', parent); S.el('span', 'af-muted', metric, fact.label); S.el('b', '', metric, fact.value); return metric;
    };

    BASE.syncJournal = (m) => {
      if (S.spec.scenario === 'journal') { const t = S.task.helpers.totals(m, S.spec); S.entryTotal.textContent = 'Difference ' + S.task.helpers.money(Math.abs(t.debit - t.credit)); }
      if (S.validation) {
        S.validation.replaceChildren(); S.el('h4', '', S.validation, 'Posting checks');
        const t = S.task.helpers.totals(m, S.spec), list = S.el('ul', 'af-checklist', S.validation);
        for (const [text, valid] of [['Debits and credits balance', t.debit > 0 && t.debit === t.credit], ['All lines have an account', m.rows.every(r => !!r.account)], ['Supporting memo recorded', !!m.memo.trim()]]) { const item = S.el('li', '', list); S.P.icon(item, valid ? 'check' : 'clock'); S.el('span', '', item, text); }
      }
    };

    BASE.syncInvoice = (m) => {
      if (S.invoiceDetail) { const r = S.spec.invoices[m.active]; S.invoiceDetail.replaceChildren(); S.el('h4', '', S.invoiceDetail, 'Invoice / ' + r.id); S.P.kv(S.invoiceDetail, 'Vendor', r.merchant); S.P.kv(S.invoiceDetail, 'Amount due', S.task.helpers.money(r.amount)); S.P.kv(S.invoiceDetail, 'Due date', r.due); S.P.kv(S.invoiceDetail, 'Payment method', 'Bank transfer / Net 30'); }
    };

    BASE.syncAudit = (m) => {
      if (S.auditState) { S.auditState.replaceChildren(); S.el('span', '', S.auditState, m.final ? S.task.helpers.status(m, S.spec) : 'Draft prepared for review'); S.el('small', '', S.auditState, 'Today / ' + S.spec.staff[0].name); }
    };

    BASE.syncSelection = (m) => {
      for (const [i, b] of Object.entries(S.receiptButtons)) b.classList.toggle('selected', Number(i) === m.active);
      for (const [i, b] of Object.entries(S.invoices)) b.classList.toggle('selected', Number(i) === m.active);
      for (const [id, b] of Object.entries(S.people)) { b.textContent = m.selected.includes(id) ? 'Added' : 'Add'; b.disabled = !S.spec.staff.find(p => p.id === id).available || m.selected.includes(id); }
    };

    BASE.syncRoute = (m) => {
      if (S.routeBox) {
        S.routeBox.replaceChildren();
        if (!m.selected.length) S.el('span', 'af-muted', S.routeBox, 'No approvers · Add in policy order');
        m.selected.forEach((id, i) => {
          S.P.routeChip(id, i);
        });
      }
    };

    BASE.routeChip = (id, i) => {
      const p = S.spec.staff.find(p => p.id === id), chip = S.el('span', 'af-routechip', S.routeBox, (i + 1) + '. ' + p.role);
      const b = S.el('button', '', chip); S.P.icon(b, 'close'); b.type = 'button'; b.setAttribute('aria-label', 'Remove ' + p.name); b.addEventListener('click', () => S.P.change({ remove: i })); S.register({ remove: i }, b);

      return chip;
    };

    BASE.syncFooter = (m) => {
      S.footerNotice.textContent = m.notice || (m.final ? S.task.helpers.status(m, S.spec) + ' · ' + S.spec.ref : 'Draft · Changes saved locally');
    };
  }

  function installPopup(BASE, S) {
    BASE.syncPopup = (m) => {
      const sig = JSON.stringify(m.open);
      if (sig !== S.menuSignature) {
        S.menuSignature = sig; S.popup.replaceChildren(); S.popup.hidden = !m.open;
        if (m.open) {
          const [i, k] = m.open, options = k === 'account' ? S.spec.accounts : k === 'category' ? S.spec.categories : S.spec.projects;
          for (const value of options) {
            S.P.option(S.popup, i, k, value);
          }
          S.P.placePopup(i, k, options);
        }
      }
    };

    BASE.option = (parent, i, k, value) => {
      const b = S.el('button', 'af-option', parent, value + (S.spec.disabled.includes(value) ? ' · Locked' : '')); b.type = 'button'; b.setAttribute('role', 'option'); b.disabled = S.spec.disabled.includes(value); S.register({ option: value }, b);
      b.addEventListener('click', () => { const n = S.task.helpers.apply(S.ctx.model, S.spec, { field: [i, k], value }); n.open = null; S.ctx.update(n); S.paint(S.ctx.model); });
      return b;
    };

    BASE.placePopup = (i, k, options) => {
      const a = S.pickers[i + ':' + k].node.getBoundingClientRect(), r = S.root.getBoundingClientRect();
      const room = S.root.clientHeight - 14;
      S.popup.style.gridTemplateColumns = options.length * 31 + 10 > room ? '1fr 1fr' : '1fr';
      S.popup.style.width = Math.min(S.root.clientWidth - 16, Math.max(a.width, k === 'account' ? 235 : 170)) + 'px';
      S.popup.style.left = Math.max(8, Math.min(S.root.clientWidth - S.popup.offsetWidth - 8, a.left - r.left)) + 'px';
      S.popup.style.top = Math.max(8, Math.min(S.root.clientHeight - S.popup.offsetHeight - 8, a.bottom - r.top + 3)) + 'px';
    };
  }

  function installLifecycle(BASE, S) {
    BASE.sync = (m) => {
      if (S.spec.scenario === 'expense' && S.editorActive !== m.active) { S.editorActive = m.active; S.current.buildReceipt(m.active); }
      S.P.syncFields(m);
      S.P.syncMatches(m);
      S.P.syncStatus(m);
      S.P.syncMetrics(m);
      S.P.syncJournal(m);
      S.P.syncInvoice(m);
      S.P.syncAudit(m);
      S.P.syncSelection(m);
      S.P.syncRoute(m);
      S.P.syncFooter(m);
      S.P.syncPopup(m);
      for (const p of Object.values(S.panes)) p.refresh();
      S.P.synced(m);
    };

    BASE.locate = (t) => {
      const state = S.current;
      if (t.pane) return state.util.center(state.panes[t.pane].pane);
      if (t.thumb) return state.panes[t.thumb].api.locateThumb();
      if (t.thumbAt) {
        const [name, to] = t.thumbAt, p = state.panes[name], tr = p.track.getBoundingClientRect(), th = p.thumb.getBoundingClientRect();
        return [th.left + th.width / 2, tr.top + th.height / 2 + (p.api.max() ? to / p.api.max() * (tr.height - th.height) : 0)];
      }
      const node = state.refs[JSON.stringify(t)];
      if (!node || !node.isConnected) throw new Error('Finance target is not rendered: ' + JSON.stringify(t));
      return state.util.center(node);
    };

    BASE.begin = (ctx) => {};

    BASE.item = (node, record) => {};

    BASE.rendered = (ctx) => {};

    BASE.synced = (model) => {};
  }

  env.template('use-accounting/workspace', (design, def) => {
    let D, P, ctx, s, util, F, current;
    let root, shell, side, main, work, popup, background;
    let refs, panes, fields, pickers, bankNodes, ledgerNodes, unlinkNodes, people, invoices, receiptButtons;
    let paint, editorActive, menuSignature, memo, footerNotice, statusBadge, metrics, entryTotal, routeBox, invoiceDetail, validation, auditState, receiptSummary, flyout;
    const el = (tag, cls, parent, text) => util.el(tag, cls, parent, text);
    const register = (t, node) => { refs[JSON.stringify(t)] = node; return node; };
    const BASE = {};
    const S = {
      get ctx() { return ctx; }, get spec() { return s; }, get task() { return F; },
      get D() { return D; }, get P() { return P; }, get current() { return current; },
      get background() { return background; },
      get paint() { return paint; },
      get editorActive() { return editorActive; }, set editorActive(value) { editorActive = value; },
      get menuSignature() { return menuSignature; }, set menuSignature(value) { menuSignature = value; },
      el, register,
      get root() { return root; }, set root(value) { root = value; },
      get shell() { return shell; }, set shell(value) { shell = value; },
      get side() { return side; }, set side(value) { side = value; },
      get main() { return main; }, set main(value) { main = value; },
      get work() { return work; }, set work(value) { work = value; },
      get popup() { return popup; }, set popup(value) { popup = value; },
      get memo() { return memo; }, set memo(value) { memo = value; },
      get footerNotice() { return footerNotice; }, set footerNotice(value) { footerNotice = value; },
      get statusBadge() { return statusBadge; }, set statusBadge(value) { statusBadge = value; },
      get metrics() { return metrics; }, set metrics(value) { metrics = value; },
      get entryTotal() { return entryTotal; }, set entryTotal(value) { entryTotal = value; },
      get routeBox() { return routeBox; }, set routeBox(value) { routeBox = value; },
      get invoiceDetail() { return invoiceDetail; }, set invoiceDetail(value) { invoiceDetail = value; },
      get validation() { return validation; }, set validation(value) { validation = value; },
      get auditState() { return auditState; }, set auditState(value) { auditState = value; },
      get receiptSummary() { return receiptSummary; }, set receiptSummary(value) { receiptSummary = value; },
      get flyout() { return flyout; }, set flyout(value) { flyout = value; },
      get refs() { return refs; },
      get panes() { return panes; },
      get fields() { return fields; },
      get pickers() { return pickers; },
      get bankNodes() { return bankNodes; },
      get ledgerNodes() { return ledgerNodes; },
      get unlinkNodes() { return unlinkNodes; },
      get people() { return people; },
      get invoices() { return invoices; },
      get receiptButtons() { return receiptButtons; },
    };

    installFrame(BASE, S);
    installChrome(BASE, S);
    installControls(BASE, S);
    installReconciliation(BASE, S);
    installJournal(BASE, S);
    installExpenses(BASE, S);
    installApprovals(BASE, S);
    installPanels(BASE, S);
    installSynchronization(BASE, S);
    installPopup(BASE, S);
    installLifecycle(BASE, S);

    ({ D, P } = env.templateDesign('use-accounting/workspace', design, def, { tokens: TOKENS, base: BASE, state: S }));
    return {
      render(nextCtx) {
        ctx = nextCtx; s = ctx.spec; util = ctx.util; F = env.taskDef;
        refs = {}; panes = {}; fields = {}; pickers = {}; bankNodes = {}; ledgerNodes = {}; unlinkNodes = {}; people = {}; invoices = {}; receiptButtons = {};
        editorActive = -1; menuSignature = ''; receiptSummary = [];
        memo = footerNotice = statusBadge = metrics = entryTotal = routeBox = invoiceDetail = validation = auditState = flyout = popup = undefined;
        ctx.css('app-finance-classic', CSS(D) + D.extraCss);
        P.begin(ctx);
        root = P.frame(ctx);
        current = { root, refs, panes, util, ctx };
        background = P.background(ctx);
        paint = m => P.sync(m);
        P.top();
        shell = P.shell();
        P.sidebar();
        main = P.main();
        P.navigation(); P.heading(); P.toolbar();
        work = P.work();
        if (s.scenario === 'reconcile') P.renderReconcile();
        else if (s.scenario === 'journal') P.renderJournal();
        else if (s.scenario === 'expense') P.renderExpense();
        else P.renderApprove();
        if (ctx.size.width >= D.inspectorMinWidth) P.inspector();
        P.footer(); P.popups();
        root.addEventListener('keydown', e => { if (e.key === 'Escape') { flyout.hidden = true; if (ctx.model.open) P.change({ open: null }); } });
        root.addEventListener('pointerdown', e => { if (ctx.model.open && !popup.contains(e.target) && !e.target.closest('.af-picker')) P.change({ open: null }); });
        paint(ctx.model);
        P.rendered(ctx);
        return { anchors: [root], sync: paint };
      },
      locate(t) { return P.locate(t); },
    };
  });
})();
