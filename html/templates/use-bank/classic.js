/*
 * use-bank/classic: shared retail banking workspace from the reference classic widget.
 * Scenarios: categorise, dispute, limits, paybill, schedule. No scenario presets: the shared
 * workspace selects its table/form and notices from spec.scenario.
 * With design: {}, reproduces each scaffold exactly:
 *   categorise: design-use-bank-categorise-01; dispute: design-use-bank-dispute-01;
 *   limits: design-use-bank-limits-01; paybill: design-use-bank-paybill-01;
 *   schedule: design-use-bank-schedule-01.
 * Tokens (whole objects replace defaults):
 *   css = CSS: complete structural bk-* stylesheet below.
 *   icons = PATHS: inline SVG path table below (24x24 viewBox).
 *   brand = 'Pinebridge'; personal = 'Personal banking': workspace/card brand and subtitle.
 *   titles = {paybill: 'Pay a bill', schedule: 'Recurring transfers', categorise: 'Transactions',
 *     dispute: 'Dispute a charge', limits: 'Card controls'}: per-scenario workspace titles.
 *   inset = 20; minWidth = 260; minHeight = 180: stage deductions and minimum frame size in px.
 *   compactAt = 940; railAt = 1200; sidebarAt = 710: stage-width layout breakpoints in px.
 *   background = 'var(--bg)'; panel = 'var(--panel)'; foreground = 'var(--fg)';
 *   muted = 'var(--muted)'; line = 'var(--line)'; accent = 'var(--accent)': site theme colors.
 *   positive = '#20835d'; attention = '#bc8227'; error = '#d04c4c'; invalid = '#c44c4c': status colors.
 *   font = '13px/1.4 system-ui,sans-serif'; radius = '8px': workspace font and frame radius.
 *   sideWidth = '206px'; compactSideWidth = '178px'; railWidth = '146px': sidebar/rail widths.
 *   controlHeight = '35px'; dialogWidth = '410px': input/toolbar height and dialog maximum width.
 *   searchPlaceholder = 'Search transactions'; choicePlaceholder = 'Select an option';
 *   datePlaceholder = 'YYYY-MM-DD'; currency = '$': control prompts and amount affix.
 * Parts are installed by _controls, _records, _workflow, _form and _frame.
 * Parts: overrides are (base, S) => replacement; all calls dispatch through P.
 * E is the episode: ctx, s (spec), u (util), F (task), root, pane, footer, refs, inputs,
 * tableHost, lastView, choicesPane, crumb, title, stateBadge, active and titles.
 * S exposes live episode/ctx/spec/root/pane/footer/refs and resolved D/P. Parts mutate E when
 * replacing tracked nodes; keep ref targets and bind task actions through change/button.
 *   icon(E, u, parent, name, cls = '') -> SVG: inline path from icons, falling back to info.
 *   key(E, target) -> string: stable JSON target key.
 *   ref(E, target, el) -> el: register a control for locate and scroll mirroring.
 *   ui(E, patch): update unscored bankUI and redraw.
 *   change(E, action, full = true): apply task action; optionally redraw.
 *   tool(E, parent, label, glyph, fn) -> button: labelled icon control.
 *   button(E, parent, text, target, action, cls = '', glyph) -> button: tracked task action.
 *   badge(E, parent, text, cls = '', glyph) -> el: status tag.
 *   row(E, parent, label, value, cls = ''): summary row.
 *   sectionHead(E, parent, title, meta = '') -> el: section title and optional metadata.
 *   notice(E, parent, text, glyph = 'info') -> el: contextual notice.
 *   popup(E, title, text): open unscored information dialog.
 *   localButton(E, parent, text, fn, cls = '', glyph) -> button: glyph/text and click binding.
 *   mirror(E): mirror clipped control offsets into bankScroll; ignore stale episode events.
 *   history(E, parent): activity/dispute history panel, tabs, table and count.
 *   table(E): filter transactions and build header, rows, empty state and count.
 *   searchBox(E): search input, filter/export controls and transaction host.
 *   field(E, field, grid): labelled choice or text control, hints and validation.
 *   cardPreview(E, parent): selected card visual and purchase activity.
 *   details(E, parent): field/value summary using task money formatting.
 *   draw(E): reset tracked controls, select view, draw dialogs, restore scroll and anchors.
 *   transaction(E, transaction, tbody): merchant/account/status/amount row and category/dispute action.
 *   historyRow(E, record, index, tbody, payment, dispute): decorative activity row and status.
 *   choiceControl(E, field, label): tracked choice button with dialog semantics.
 *   textControl(E, field, label): tracked input/textarea with amount/date decoration and input binding.
 *   preview(E): unscored account preview with return control.
 *   billers(E): saved biller/account information for judge stop cases.
 *   receipt(E): success, exact task facts, details, notice, history and edit footer.
 *   review(E): review steps, summary, authorisation notice and action controls.
 *   edit(E): validation, transaction selection or form and review footer.
 *   choices(E): choice dialog, tracked close/scroll pane and option rows.
 *   information(E): unscored information popup with tracked dismiss button.
 *   option(E, field, value): tracked selectable option with account/biller details and selected mark.
 *   spending(E): February spending, transaction and uncategorised statistics.
 *   form(E): card/transaction introduction, fields, scenario notice and history.
 *   transactionBanner(E): selected dispute transaction and change action.
 *   fields(E): form grid and all non-transaction fields.
 *   formNotice(E): payment balance/biller details or card/dispute guidance.
 *   shell(E): build topbar, navigation, layout, optional rail/sidebar, heading, pane and footer.
 *   topbar(E): brand, customer and notification/message/help tools.
 *   navigation(E): banking tabs and secure session text.
 *   rail(E, layout): optional wide-stage workspace navigation rail.
 *   sidebar(E, layout): optional accounts, contextual activity and support sidebar.
 *   account(E, account, parent): account label, tracked balance and available caption.
 *   heading(E, main): breadcrumb, title, status badge and page options tool.
 *   frame(E) -> el: stage-sized workspace, with compact class below compactAt.
 *   styles(E) -> CSS text: structural stylesheet with design colors, font and dimensions.
 *   begin(E, ctx): before stylesheet/frame construction; no-op decoration hook.
 *   rendered(E): after initial draw; no-op decoration hook.
 *   drawn(E): after view/dialog construction, before scroll restoration and reanchor; no-op hook.
 *   fieldDrawn(E, field, label): after hints/validation; no-op decoration hook.
 *   locate(E, target) -> [x,y]: read registered control geometry; throw for missing targets.
 * Task apply owns scored model changes; UI and scroll mirrors remain unscored. locate only
 * reads geometry. Receipt facts come only from F.facts. No base widget rng draws exist here;
 * added decoration randomness must use ctx.rng.fork(label). Factories do no DOM work.
 */
(function () {
  'use strict';
  const PATHS = {
    bank: 'M3 9h18L12 3 3 9Zm2 3v7m5-7v7m4-7v7m5-7v7M3 21h18',
    bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
    shield: 'm12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Zm-4 9 3 3 5-6',
    chevron: 'm8 10 4 4 4-4', close: 'm6 6 12 12M6 18 18 6',
    search: 'M20 20l-5-5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z',
    card: 'M3 5h18v14H3V5Zm0 5h18M6 15h4', check: 'm5 12 4 4L19 6',
    calendar: 'M4 5h16v16H4V5Zm0 5h16M8 3v4m8-4v4M8 14h2m4 0h2m-8 3h2',
    transfer: 'M3 7h17m-4-4 4 4-4 4M21 17H4m4-4-4 4 4 4',
    file: 'M6 3h9l4 4v14H6V3Zm9 0v5h4M9 12h7m-7 4h7',
    clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 7v5l3 2',
    help: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 3h.01',
    download: 'M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5',
    filter: 'M3 5h18l-7 8v6l-4 2v-8L3 5Z', dots: 'M5 12h.01M12 12h.01M19 12h.01',
    lock: 'M6 10h12v11H6V10Zm3 0V6a3 3 0 0 1 6 0v4',
    wallet: 'M3 6h17v15H3V6Zm0 0V3h14v3m-2 7h6v5h-6v-5Z',
    arrow: 'M5 12h14m-5-5 5 5-5 5', info: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM12 10v7m0-10h.01',
  };
  const CSS = `
  .bk {position:relative;display:flex;flex-direction:column;background:var(--bg);color:var(--fg);border:1px solid var(--line);border-radius:8px;overflow:hidden;font:13px/1.4 system-ui,sans-serif;text-align:left;box-shadow:0 8px 28px #0000000d;}
  .bk * {box-sizing:border-box;} .bk button,.bk input,.bk textarea {font:inherit;color:inherit;} .bk button {cursor:pointer;} .bk svg {width:17px;height:17px;flex:none;vertical-align:middle;}
  .bk-top {flex:none;display:flex;align-items:center;gap:9px;padding:9px 16px;background:var(--panel);border-bottom:1px solid var(--line);min-width:0;} .bk-logo {display:flex;align-items:center;color:var(--accent);}.bk-logo svg {width:26px;height:26px;} .bk-brand {font-size:19px;font-weight:760;letter-spacing:-.04em;} .bk-personal {font-size:10px;text-transform:uppercase;letter-spacing:.09em;color:var(--muted);border-left:1px solid var(--line);padding-left:10px;}
  .bk-user {margin-left:auto;color:var(--muted);font-size:11px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;} .bk-top-tools {display:flex;gap:8px;align-items:center;flex:none;}.bk-iconbtn {display:flex;align-items:center;justify-content:center;width:30px;height:30px;background:transparent;border:0;border-radius:5px;position:relative;}.bk-iconbtn:hover {background:var(--bg);}.bk-dot {position:absolute;right:0;top:-2px;font-size:9px;color:var(--panel);background:var(--accent);border-radius:9px;padding:1px 4px;}
  .bk-nav {display:flex;gap:21px;align-items:center;padding:0 16px;background:var(--panel);border-bottom:1px solid var(--line);height:36px;flex:none;overflow:hidden;white-space:nowrap;}.bk-nav button {border:0;border-bottom:2px solid transparent;background:none;padding:9px 0 8px;font-size:12px;color:var(--muted);}.bk-nav button.active {color:var(--accent);border-bottom-color:var(--accent);font-weight:700;}.bk-session {margin-left:auto;font-size:10px;color:var(--muted);}
  .bk-layout {display:flex;flex:1;min-height:0;min-width:0;}.bk-main {display:flex;flex-direction:column;flex:1;min-width:0;min-height:0;background:var(--panel);}.bk-side {width:206px;flex:none;border-left:1px solid var(--line);padding:13px 12px;background:var(--bg);overflow:auto;overscroll-behavior:contain;}.bk-side h4 {font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted);margin:0 0 8px;}.bk-side-section {padding-bottom:13px;margin-bottom:13px;border-bottom:1px solid var(--line);}.bk-side-section:last-child {border-bottom:0;}.bk-account {background:var(--panel);border:1px solid var(--line);border-radius:5px;padding:8px 9px;margin-bottom:6px;}.bk-account small {display:block;color:var(--muted);font-size:10px;}.bk-account b {display:block;font-size:17px;margin:3px 0 1px;font-weight:670;font-variant-numeric:tabular-nums;letter-spacing:-.02em;}.bk-minirow {display:flex;gap:8px;margin:9px 0;align-items:flex-start;}.bk-minirow svg {color:var(--muted);width:15px;height:15px;}.bk-minirow p {margin:0;font-size:11px;}.bk-minirow small {display:block;font-size:10px;color:var(--muted);}.bk-textlink {color:var(--accent);font-size:11px;font-weight:550;}
  .bk-rail {width:146px;flex:none;background:var(--bg);border-right:1px solid var(--line);padding:14px 9px;overflow:auto;}.bk-rail h4 {font-size:10px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;margin:0 8px 9px;}.bk-rail button {display:flex;align-items:center;gap:8px;background:none;border:0;width:100%;text-align:left;font-size:11px;padding:9px 8px;color:var(--muted);border-radius:4px;}.bk-rail .active {background:var(--panel);color:var(--accent);font-weight:650;}.bk-rail hr {border:0;border-top:1px solid var(--line);margin:14px 0;}
  .bk-heading {display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 16px 9px;flex:none;border-bottom:1px solid var(--line);}.bk-crumb {font-size:10px;color:var(--muted);margin-bottom:3px;}.bk h2 {font-size:20px;line-height:1.2;margin:0;font-weight:660;letter-spacing:-.025em;}.bk-headtools {display:flex;align-items:center;gap:8px;flex:none;}.bk-tag {display:inline-flex;align-items:center;gap:4px;border:1px solid var(--line);background:var(--bg);border-radius:4px;padding:3px 6px;font-size:10px;white-space:nowrap;color:var(--muted);}.bk-tag.positive {color:color-mix(in srgb,#20835d 75%,var(--fg));background:color-mix(in srgb,#20835d 9%,var(--panel));border-color:color-mix(in srgb,#20835d 25%,var(--line));}.bk-tag.attention {color:color-mix(in srgb,#bc8227 75%,var(--fg));background:color-mix(in srgb,#bc8227 9%,var(--panel));}.bk-tag svg {width:12px;height:12px;}
  .bk-scroll {overflow:auto;flex:1;min-height:0;padding:12px 16px 18px;overscroll-behavior:contain;touch-action:pan-y;scrollbar-gutter:stable;}.bk-block {margin-bottom:16px;}.bk-sectionhead {display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 0 9px;}.bk-sectionhead h3 {font-size:13px;font-weight:650;margin:0;}.bk-sectionhead small {color:var(--muted);font-size:10px;}.bk-note {font-size:11px;color:var(--muted);margin:5px 0 9px;}.bk-steps {display:flex;align-items:center;gap:9px;color:var(--muted);font-size:10px;margin-bottom:11px;}.bk-steps .current {color:var(--accent);font-weight:650;}.bk-steps i {height:1px;width:26px;background:var(--line);}.bk-grid {display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px 14px;}.bk-field {display:flex;flex-direction:column;gap:4px;min-width:0;}.bk-field.wide {grid-column:1/-1;}.bk-label {font-size:11px;font-weight:650;}.bk-control {display:block;width:100%;height:35px;background:var(--panel);border:1px solid var(--line);border-radius:4px;padding:7px 9px;outline:none;text-align:left;min-width:0;}.bk-control:focus {border-color:var(--accent);box-shadow:0 0 0 2px color-mix(in srgb,var(--accent) 18%,transparent);}.bk-control[aria-invalid=true] {border-color:#c44c4c;}.bk-inputwrap {position:relative;}.bk-inputwrap .bk-control {padding-right:32px;}.bk-inputwrap .bk-affix {position:absolute;right:9px;top:9px;color:var(--muted);pointer-events:none;width:15px;height:15px;}.bk-inputwrap.amount .bk-control {padding-left:24px;font-variant-numeric:tabular-nums;}.bk-currency {position:absolute;left:10px;top:8px;color:var(--muted);}.bk-choice {display:flex;align-items:center;justify-content:space-between;gap:5px;}.bk-choice span {overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.bk-choice svg {width:14px;height:14px;color:var(--muted);}.bk textarea {height:75px;resize:vertical;user-select:text;}.bk-hint {font-size:10px;color:var(--muted);}.bk-error {font-size:11px;color:color-mix(in srgb,#d04c4c 80%,var(--fg));}.bk-errorbox {padding:8px 10px;background:color-mix(in srgb,#d04c4c 7%,var(--panel));border:1px solid color-mix(in srgb,#d04c4c 40%,var(--line));border-radius:4px;margin-bottom:10px;}
  .bk-footer {display:flex;align-items:center;gap:9px;flex:none;padding:9px 16px;background:var(--panel);border-top:1px solid var(--line);}.bk-footer small {color:var(--muted);font-size:10px;margin-right:auto;display:flex;align-items:center;gap:5px;}.bk-footer small svg {width:13px;height:13px;}.bk-btn {display:inline-flex;align-items:center;justify-content:center;gap:6px;border:1px solid var(--line);border-radius:4px;background:var(--panel);padding:7px 11px;font-size:12px;white-space:nowrap;}.bk-btn:hover {background:var(--bg);}.bk-btn.primary {color:white;background:var(--accent);border-color:var(--accent);font-weight:650;}.bk-btn.link {border:0;background:none;color:var(--accent);padding-left:0;}.bk-btn svg {width:14px;height:14px;}
  .bk-toolbar {display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-bottom:10px;}.bk-searchbox {position:relative;flex:1;min-width:130px;}.bk-searchbox svg {position:absolute;left:9px;top:9px;color:var(--muted);width:16px;height:16px;}.bk-searchbox input {padding-left:31px;}.bk-toolbar .bk-btn {height:35px;font-size:11px;padding:6px 9px;}.bk-stats {display:flex;gap:0;border:1px solid var(--line);border-radius:5px;background:var(--bg);margin-bottom:12px;}.bk-stat {flex:1;padding:8px 10px;border-right:1px solid var(--line);min-width:0;}.bk-stat:last-child {border:0;}.bk-stat small {display:block;font-size:10px;color:var(--muted);}.bk-stat b {font-size:15px;font-weight:650;font-variant-numeric:tabular-nums;}
  .bk-table {border-collapse:collapse;width:100%;table-layout:fixed;font-size:11px;}.bk-table th {font-size:9px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);text-align:left;padding:8px 6px;border-block:1px solid var(--line);background:var(--bg);}.bk-table td {padding:9px 6px;border-bottom:1px solid var(--line);vertical-align:middle;overflow-wrap:anywhere;}.bk-table small {display:block;color:var(--muted);font-size:10px;}.bk-table .bk-num {white-space:nowrap;font-variant-numeric:tabular-nums;text-align:right;font-weight:600;}.bk-table .bk-btn {font-size:10px;padding:5px 6px;max-width:100%;}.bk-merchant {display:flex;align-items:center;gap:8px;min-width:0;}.bk-avatar {display:flex;align-items:center;justify-content:center;background:var(--bg);border:1px solid var(--line);width:29px;height:29px;border-radius:6px;font-size:10px;font-weight:700;color:var(--muted);flex:none;}.bk-merchant-title {font-weight:570;}.bk-table-meta {display:flex;justify-content:space-between;font-size:10px;color:var(--muted);padding:9px 0;}.bk-divider {height:1px;background:var(--line);margin:16px 0;}.bk-history {padding-top:12px;border-top:1px solid var(--line);margin-top:16px;}.bk-history .bk-table td {padding-block:8px;}
  .bk-summary {border:1px solid var(--line);border-radius:5px;overflow:hidden;margin:9px 0 14px;}.bk-row {display:flex;justify-content:space-between;gap:12px;padding:9px 11px;border-bottom:1px solid var(--line);font-size:12px;}.bk-row:last-child {border:0;}.bk-row>span {color:var(--muted);flex:1;}.bk-row b {font-weight:570;text-align:right;max-width:66%;overflow-wrap:anywhere;}.bk-row.amount b {font-size:18px;letter-spacing:-.02em;}.bk-notice {display:flex;align-items:flex-start;gap:8px;padding:9px 10px;border:1px solid var(--line);border-radius:4px;background:var(--bg);font-size:11px;margin:10px 0;line-height:1.45;}.bk-notice>svg {color:var(--accent);width:15px;height:15px;margin-top:1px;}.bk-success {display:flex;align-items:center;gap:10px;margin:0 0 10px;}.bk-success>svg {width:32px;height:32px;padding:6px;background:color-mix(in srgb,#20835d 12%,var(--panel));color:color-mix(in srgb,#20835d 75%,var(--fg));border-radius:50%;}.bk-success b {display:block;font-size:15px;}.bk-success small {display:block;font-size:11px;color:var(--muted);}
  .bk-mask {position:absolute;inset:0;background:#0005;display:flex;align-items:center;justify-content:center;z-index:20;padding:12px;}.bk-dialog {background:var(--panel);border:1px solid var(--line);box-shadow:0 12px 45px #0004;border-radius:7px;width:min(410px,100%);max-height:100%;display:flex;flex-direction:column;overflow:hidden;}.bk-dialog-head {display:flex;align-items:center;justify-content:space-between;padding:10px 13px;font-weight:650;border-bottom:1px solid var(--line);}.bk-options {overflow:auto;padding:5px;overscroll-behavior:contain;}.bk-option {display:flex;align-items:center;gap:9px;width:100%;text-align:left;background:var(--panel);border:0;border-bottom:1px solid var(--line);padding:10px 9px;border-radius:3px;font-size:12px;}.bk-option:last-child {border:0;}.bk-option small {display:block;font-size:10px;color:var(--muted);}.bk-option>svg {color:var(--muted);}.bk-option .bk-option-label {flex:1;min-width:0;}.bk-option.selected {background:var(--bg);color:var(--accent);}.bk-option:hover,.bk-option:focus {background:var(--bg);}.bk-empty {padding:25px 10px;text-align:center;color:var(--muted);}.bk-empty svg {width:28px;height:28px;margin-bottom:8px;}.bk-empty b {display:block;color:var(--fg);font-size:13px;}.bk-empty p {font-size:11px;}
  .bk-creditcard {position:relative;border:1px solid color-mix(in srgb,var(--accent) 40%,var(--line));border-radius:9px;padding:13px 16px;background:linear-gradient(115deg,color-mix(in srgb,var(--accent) 20%,var(--panel)),var(--panel));min-height:115px;max-width:330px;}.bk-creditcard-head {display:flex;justify-content:space-between;font-weight:650;font-size:13px;}.bk-chip {width:25px;height:19px;display:block;border:1px solid color-mix(in srgb,#bc965c 70%,var(--line));background:color-mix(in srgb,#bc965c 30%,var(--panel));border-radius:4px;margin:10px 0 5px;}.bk-cardnumber {font-size:16px;font-variant-numeric:tabular-nums;letter-spacing:.08em;}.bk-cardowner {font-size:9px;text-transform:uppercase;color:var(--muted);margin-top:6px;}.bk-cardintro {display:flex;align-items:center;gap:18px;margin-bottom:14px;}.bk-cardintro>div {flex:1;}.bk-cardaside {font-size:11px;color:var(--muted);}.bk-cardaside strong {display:block;color:var(--fg);margin:3px 0;font-size:16px;}.bk-detail-banner {padding:10px 12px;border:1px solid var(--line);border-radius:5px;background:var(--bg);margin-bottom:11px;}.bk-detail-banner .bk-merchant {justify-content:space-between;}.bk-detail-banner .bk-hint {display:block;}.bk-casepath {display:flex;gap:8px;color:var(--muted);font-size:10px;margin:9px 0;}.bk-casepath span {padding:5px 8px;background:var(--bg);border:1px solid var(--line);border-radius:4px;}.bk-casepath .active {color:var(--accent);border-color:var(--accent);}.bk-popcontent {padding:12px 14px;overflow:auto;}.bk-popcontent p {font-size:12px;margin:0 0 8px;}.bk-tabline {display:flex;gap:14px;align-items:center;margin-bottom:12px;font-size:11px;color:var(--muted);}.bk-tabline .active {color:var(--accent);font-weight:650;border-bottom:2px solid var(--accent);padding-bottom:6px;}
  .bk.compact .bk-side {width:178px;}.bk.compact .bk-heading {padding:8px 12px;}.bk.compact .bk-scroll {padding:10px 12px 15px;}.bk.compact .bk-brand {font-size:17px;}.bk.compact .bk-personal,.bk.compact .bk-session {display:none;}.bk.compact .bk-nav {gap:15px;}.bk.compact .bk-top {padding:8px 12px;}.bk.compact .bk-steps {margin-bottom:8px;}.bk.compact .bk-headtools .bk-btn {display:none;}.bk.compact .bk-cardaside {display:none;}.bk.compact .bk-table .bk-channel {display:none;}
  `;

  const TOKENS = {
    css: CSS,
    icons: PATHS,
    brand: 'Pinebridge',
    personal: 'Personal banking',
    titles: { paybill: 'Pay a bill', schedule: 'Recurring transfers', categorise: 'Transactions', dispute: 'Dispute a charge', limits: 'Card controls' },
    inset: 20,
    minWidth: 260,
    minHeight: 180,
    compactAt: 940,
    railAt: 1200,
    sidebarAt: 710,
    background: 'var(--bg)',
    panel: 'var(--panel)',
    foreground: 'var(--fg)',
    muted: 'var(--muted)',
    line: 'var(--line)',
    accent: 'var(--accent)',
    positive: '#20835d',
    attention: '#bc8227',
    error: '#d04c4c',
    invalid: '#c44c4c',
    font: '13px/1.4 system-ui,sans-serif',
    radius: '8px',
    sideWidth: '206px',
    compactSideWidth: '178px',
    railWidth: '146px',
    controlHeight: '35px',
    dialogWidth: '410px',
    searchPlaceholder: 'Search transactions',
    choicePlaceholder: 'Select an option',
    datePlaceholder: 'YYYY-MM-DD',
    currency: '$',
  };

  env.template('use-bank/classic', (design, def) => {
    let D, P, live, episode;
    const BASE = {};
    const S = {
      get episode() { return episode; },
      get ctx() { return episode && episode.ctx; },
      get spec() { return episode && episode.s; },
      get root() { return episode && episode.root; },
      get pane() { return episode && episode.pane; },
      get footer() { return episode && episode.footer; },
      get refs() { return episode && episode.refs; },
      get D() { return D; },
      get P() { return P; },
    };

    const state = { get D() { return D; }, get P() { return P; }, get live() { return live; } };
    env.templateLib('use-bank/_controls').install(BASE,state);
    env.templateLib('use-bank/_records').install(BASE,state);
    env.templateLib('use-bank/_workflow').install(BASE,state);
    env.templateLib('use-bank/_form').install(BASE,state);
    env.templateLib('use-bank/_frame').install(BASE,state);

    ({ D, P } = env.templateDesign('use-bank/classic', design, def, { tokens: TOKENS, base: BASE, state: S }));
    return {
      render(ctx) {
        const E = { ctx, s: ctx.spec, u: ctx.util, F: env.taskDef, refs: {}, inputs: {} };
        E.active = ['paybill','schedule'].includes(E.s.scenario) ? 'Pay & transfer' : E.s.scenario === 'limits' ? 'Cards' : 'Activity';
        E.titles = D.titles;
        episode = E;
        P.begin(E,ctx);
        ctx.css('app-bank-classic',P.styles(E));
        E.root = P.frame(E);
        P.shell(E);
        live = E;
        P.draw(E);
        P.rendered(E);
        return { anchors: [E.root], sync() { P.draw(E); } };
      },
      locate(t) { return P.locate(live,t); },
    };
  }, { uses: ['use-bank/_controls', 'use-bank/_records', 'use-bank/_workflow', 'use-bank/_form', 'use-bank/_frame'] });
})();
