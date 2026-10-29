/*
 * use-gov-portal/portal: civic-service application, source dossier, evidence checklist,
 * draft save, review/declaration and receipt. Scenarios: branching, checklist, saveresume, strict.
 * With design: {}, each scenario reproduces its scaffolded pilot exactly:
 * design-use-gov-portal-branching-01, design-use-gov-portal-checklist-01,
 * design-use-gov-portal-saveresume-01, design-use-gov-portal-strict-01. No scenario presets are needed;
 * spec.scenario selects the introduction, conditional fields and evidence in the shared widget.
 * Colors otherwise inherit the site's --panel, --line, --accent, --muted, --fg and --bg.
 *
 * Tokens (defaults):
 *   fontFamily = 'Arial,"Liberation Sans",sans-serif': portal font stack.
 *   fontSize = 13, lineHeight = 1.45: base text size (px) and line height.
 *   sidebarWidth = 226, compactSidebarWidth = 192, narrowSidebarWidth = 173: dossier widths (px).
 *   adviceWidth = 203: guidance column width (px), also reserved by fit for field columns.
 *   inputHeight = 35, controlRadius = 2: text-input height and control corner radius (px).
 *   errorColor = '#d94350', errorTextColor = '#df3d4a': validation borders and text tint.
 *   mastheadBase = '#152232', mastheadText = '#f7f8fa': masthead background mix and text.
 *   shadow = '0 4px 18px #0001': portal shadow.
 *   insetX = 24, insetY = 16: stage space reserved around the portal (px).
 *   minWidth = 280, minHeight = 180, maxWidth = 1440, maxHeight = 810: frame bounds (px).
 *   wideAt = 1250, compactAt = 1050, shortAt = 520, narrowAt = 740, twoColumnsAt = 850:
 *     layout thresholds against available frame width/height, before maximum bounds (px).
 *   brand = 'Cedar Vale', brandSubtitle = 'Civic services account': masthead copy.
 *   title = 'Civic support application': application heading.
 *   formVersion = 'CS-104 / Personal support / Form version 4.2': heading metadata.
 *   variantCopy = VARIANT_COPY: per-scenario [intro heading, description] table below (replaced whole).
 *   icons = ICONS: inline SVG path table below, 24 x 24 viewBox (replaced whole).
 *
 * Parts: overrides are (base, S) => replacement; all nested calls go through P.
 * Each v argument is the episode view: {ctx,u,s,fam,r,geo,els,fields,groups,docs,targets,
 * summaryValues,page}; controls are stored on v.els. Builders return nothing unless noted.
 * S.view, S.ctx, S.spec and S.els read the live episode; S.D/P are resolved tokens/parts.
 *   css(v) -> text: structural CSS with styling tokens.
 *   styles(v): install css with the original style id.
 *   fit(v) -> {width,height,wide}: stage-relative geometry.
 *   frame(v): create/size the fixed portal anchor; set v.els.app.
 *   masthead(v): brand and account controls; set messagesButton/accountButton.
 *   heading(v): breadcrumb, application title and status; set pill.
 *   workflow(v): step container and guidance button; set steps/guide.
 *   sidebar(v): dossier shell, tabs and panels; set record/sidePanels/sideButtons.
 *   sideTab(v,id,title): one tab and its panel, with tab-switch behavior.
 *   chooseSide(v,id): switch dossier panel and reset its scroll.
 *   record(v): verified record, eligibility, other applications and help.
 *   recordRow(v,parent,label,value): one verified-record dt/dd pair.
 *   otherCase(v,parent,title,state): one distractor application; draws one case number.
 *   history(v): activity panel and live activity row; set liveHistory.
 *   messages(v): messages panel, using message for each article.
 *   message(v,parent,title,body): one secure-message article.
 *   main(v): main pane, context strip and page containers; set pane/form/review/receipt/contextLabel.
 *   introduction(v): scenario intro, notice and validation alert; set notice/errorBox.
 *   fields(v): create section groups and bind each field via field/textInput/choice.
 *   section(v,name) -> {el,status,grid,fields}: section heading, status and field grid.
 *   field(v,f,group) -> {wrap,label}: field frame and label; fields adds hint/error after controls.
 *   textInput(v,f,field) -> input: native text control; fields binds model updates/target.
 *   choiceGroup(v,parent,label) -> el: accessible radio group.
 *   choice(v,parent,value,radioIcon) -> button: one radio control, optionally with icon.
 *   evidence(v): evidence shell/count and document controls; draws all file sizes before rows.
 *   evidenceRow(v,parent,d,size,types) -> {attach,chooser,buttons,fileState,err}:
 *     one evidence card; calls fileMetadata and binds attachment/classification actions.
 *   fileMetadata(v,parent,d,size): file size and page count; draws one page count.
 *   library(v): decorative account files and privacy disclosure.
 *   libraryRow(v,parent,name,detail): one decorative account file.
 *   review(v): answer summary and legal declaration; binds declaration target.
 *   summaryRow(v,parent,label) -> {row,value}: a dt/dd answer or receipt fact.
 *   declaration(v,parent) -> checkbox: legal copy and native checkbox.
 *   receipt(v): acknowledgement, reference, facts container and next steps; set factsDl.
 *   timelineRow(v,parent,title,detail) -> li: activity/next-step timeline item.
 *   advice(v): wide-layout guidance sidebar and section jumps; set adviceItems.
 *   adviceItem(v,parent,name,group) -> {row,status}: section jump with live geometry.
 *   footer(v): navigation controls and save status; set edit/save/saveStatus/primary.
 *   button(v,parent,cls,text) -> button: native button with type=button.
 *   icon(parent,name,cls='') -> svg: inline icon from tokens.
 *   put(v,target,el): register oracle target, no DOM work.
 *   act(v,action): task apply/update followed by sync.
 *   geometry(v): mirror pane-relative target scroll distances into the model.
 *   sync(v,model): visibility, values, validation, counts and navigation; calls steps/facts/geometry.
 *   steps(v,model): draw the three workflow indicators.
 *   facts(v,model): draw receipt facts using summaryRow.
 *   anchors(v) -> [el]: the fixed outer portal.
 *   locate(v,target) -> [x,y]: pure pane/target lookup, throws for hidden targets.
 *   decorated(v,el,kind,data): after each field/evidence/other-case/message/library/advice row;
 *     default no-op, data is the field/document or row label.
 *   rendered(v): after initial sync; default no-op.
 *
 * Keep rng draws in order on v.r = ctx.rng.fork('portal/details'): three otherCase
 * int(10400,98999), then one int(85,840) per document, then fileMetadata int(1,4) per document.
 * Additional decoration randomness must use a separately labelled ctx.rng.fork(...).
 * Part definitions are grouped by shell, form, review and state; each group reads
 * resolved tokens and parts through S so design overrides retain their original behavior.
 * Only inner panes scroll; the outer portal is the stable anchor. Native text inputs,
 * DOM radio buttons and a checkbox retain the original model and oracle contracts.
 */
(function () {
  'use strict';
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
  const CSS = (D) => `
  .gov-app {flex:none;display:flex;flex-direction:column;overflow:hidden;background:var(--panel);border:1px solid var(--line);box-shadow:${D.shadow};color:var(--fg);font:${D.fontSize}px/${D.lineHeight} ${D.fontFamily};}
  .gov-app * {box-sizing:border-box;}.gov-app [hidden] {display:none!important;}
  .gov-icon {width:17px;height:17px;flex:none;vertical-align:middle;}.gov-app button .gov-icon{width:15px;height:15px;}
  .gov-masthead{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:7px 16px;border-bottom:3px solid var(--accent);background:color-mix(in srgb,var(--accent) 12%,${D.mastheadBase});color:${D.mastheadText};flex:none;}
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
  .gov-sidebar{width:${D.sidebarWidth}px;flex:none;display:flex;flex-direction:column;min-height:0;background:var(--bg);border-right:1px solid var(--line);}
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
  .gov-input{height:${D.inputHeight}px;width:100%;border:1px solid var(--muted);border-radius:${D.controlRadius}px;background:var(--panel);color:var(--fg);padding:5px 8px;font:inherit;user-select:text;-webkit-user-select:text;}
  .gov-input:focus,.gov-app button:focus-visible{outline:3px solid color-mix(in srgb,var(--accent) 35%,transparent);outline-offset:1px;}
  .gov-hint{font-size:11px;color:var(--muted);margin:4px 0;overflow-wrap:anywhere;}.gov-error{color:color-mix(in srgb,${D.errorTextColor} 75%,var(--fg));font-size:11px;min-height:15px;margin-top:3px;}.gov-input[aria-invalid=true]{border:2px solid ${D.errorColor};}
  .gov-options{display:flex;gap:5px;flex-wrap:wrap;}.gov-app button{font:inherit;cursor:pointer;color:var(--fg);background:var(--panel);border:1px solid var(--line);border-radius:${D.controlRadius}px;padding:6px 10px;}
  .gov-app button[aria-checked=true]{border-color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,var(--panel));color:var(--fg);box-shadow:inset 0 0 0 1px var(--accent);}
  .gov-radio{display:flex;gap:6px;align-items:center;}.gov-radio .gov-icon{width:14px;height:14px;}.gov-radio[aria-checked=true] .gov-icon{fill:var(--accent);stroke:var(--accent);}
  .gov-wide{grid-column:1/-1;}.gov-alert{padding:9px 11px;background:var(--bg);border-left:3px solid var(--accent);margin-bottom:10px;font-size:12px;}.gov-alert.bad{border-color:${D.errorColor};}
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
  .gov-advice{width:${D.adviceWidth}px;flex:none;padding:14px 13px;border-left:1px solid var(--line);overflow:auto;background:var(--bg);font-size:11px;}.gov-advice h3{font-size:13px;margin:0 0 8px;}.gov-advice p{color:var(--muted);line-height:1.5;}.gov-advice .gov-kicker{margin-top:16px;}
  .gov-section-list{padding:0;margin:0;list-style:none;}.gov-section-list li{padding:7px 0;border-bottom:1px solid var(--line);}.gov-section-list .gov-link{font-size:11px;padding:0;text-align:left;}.gov-section-list small{display:block;color:var(--muted);font-size:10px;margin-top:2px;}
  .gov-trust{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--muted);margin-top:14px;}.gov-trust .gov-icon{width:12px;height:12px;}
  .gov-app.compact .gov-sidebar{width:${D.compactSidebarWidth}px;}.gov-app.compact .gov-record{padding:10px;}.gov-app.compact .gov-scroll{padding:12px 14px;}.gov-app.compact .gov-title-row h2{font-size:19px;}
  .gov-app.short .gov-masthead{padding:4px 12px;}.gov-app.short .gov-brand{font-size:12px;}.gov-app.short .gov-brand small{display:none;}.gov-app.short .gov-head{padding:7px 12px;}.gov-app.short .gov-title-row h2{font-size:18px;}.gov-app.short .gov-subtitle{margin-top:3px;}.gov-app.short .gov-breadcrumb{margin-bottom:4px;}.gov-app.short .gov-context-strip{padding:4px 12px;}.gov-app.short .gov-case{padding:7px 10px;}
  .gov-app.short .gov-page-intro{padding-bottom:7px;margin-bottom:8px;}.gov-app.short .gov-page-intro h3{font-size:16px;}.gov-app.short .gov-page-intro p{display:none;}.gov-app.short .gov-field-code{display:none;}.gov-app.short .gov-section{margin-top:12px;padding-top:10px;}.gov-app.short .gov-section-meta{margin-bottom:6px;}.gov-app.short .gov-side-panel>.gov-kicker:first-child{margin-top:0;}.gov-app.short .gov-record .gov-trust{margin-top:8px;}
  .gov-app.narrow .gov-account-name{display:none;}.gov-app.narrow .gov-account{gap:8px;}.gov-app.narrow .gov-brand{font-size:12px;}.gov-app.narrow .gov-sidebar{width:${D.narrowSidebarWidth}px;}.gov-app.narrow .gov-workflow{padding:0 10px;}.gov-app.narrow .gov-steps{gap:9px;font-size:10px;}.gov-app.narrow .gov-guide-link{display:none;}.gov-app.narrow .gov-subtitle .gov-form-version{display:none;}.gov-app.narrow .gov-file-head{flex-wrap:wrap;}.gov-app.narrow .gov-file-actions{align-items:start;}.gov-app.narrow .gov-types{margin-left:0;}
  `;
  const SCENARIO_COPY = {
    branching:['Applicant and household details','Information about your circumstances determines which parts of this application apply.'],
    checklist:['Documents and supporting evidence','Provide the evidence required for your circumstances. Existing files are available from your case document library.'],
    saveresume:['Continue your saved application','Your previous answers have been restored. Check that the information is still current before making your declaration.'],
    strict:['Identity and contact details','Enter your details as recorded on your documents. The service checks identity numbers, dates and postal addresses.'],
  };

  const TOKENS = {
    fontFamily: 'Arial,"Liberation Sans",sans-serif', fontSize: 13, lineHeight: 1.45,
    sidebarWidth: 226, compactSidebarWidth: 192, narrowSidebarWidth: 173, adviceWidth: 203,
    inputHeight: 35, controlRadius: 2, errorColor: '#d94350', errorTextColor: '#df3d4a',
    mastheadBase: '#152232', mastheadText: '#f7f8fa', shadow: '0 4px 18px #0001',
    insetX: 24, insetY: 16, minWidth: 280, minHeight: 180, maxWidth: 1440, maxHeight: 810,
    wideAt: 1250, compactAt: 1050, shortAt: 520, narrowAt: 740, twoColumnsAt: 850,
    brand: 'Cedar Vale', brandSubtitle: 'Civic services account', title: 'Civic support application',
    formVersion: 'CS-104 / Personal support / Form version 4.2', scenarioCopy: SCENARIO_COPY, icons: ICONS,
  };

  function defineShellParts(BASE, S) {
    BASE.css = (v) => CSS(S.D);
    BASE.styles = (v) => v.ctx.css('app-gov-classic', S.P.css(v));

    BASE.fit = (v) => {
      const {ctx} = v;
      const width = Math.max(S.D.minWidth, ctx.size.width - S.D.insetX);
      const height = Math.max(S.D.minHeight, ctx.size.height - S.D.insetY);
      return {width,height,wide:width >= S.D.wideAt};
    };

    BASE.frame = (v) => {
      const {ctx,u,geo: {width,height,wide}} = v;
      const app = u.el('div','gov-app' + (width < S.D.compactAt ? ' compact' : '') + (height < S.D.shortAt ? ' short' : '') + (width < S.D.narrowAt ? ' narrow' : ''),ctx.stage);
      app.style.width = `${Math.min(S.D.maxWidth,width)}px`; app.style.height = `${Math.min(S.D.maxHeight,height)}px`;
      app.style.setProperty('--gov-cols',width - (wide ? S.D.adviceWidth : 0) >= S.D.twoColumnsAt ? '2' : '1');
      v.els.app=app;
    };

    BASE.masthead = (v) => {
      const {u,s,els: {app}} = v;
      const masthead=u.el('div','gov-masthead',app), brand=u.el('div','gov-brand',masthead);
      S.P.icon(brand,'seal');const brandText=u.el('span','',brand,S.D.brand);u.el('small','',brandText,S.D.brandSubtitle);
      const account=u.el('div','gov-account',masthead);
      const messagesButton=S.P.button(v,account,'');S.P.icon(messagesButton,'mail');u.el('span','',messagesButton,'Messages');u.el('span','gov-count',messagesButton,'2');
      const accountButton=S.P.button(v,account,'');S.P.icon(accountButton,'user');u.el('span','gov-account-name',accountButton,s.record.name);
      Object.assign(v.els,{messagesButton,accountButton});
    };

    BASE.heading = (v) => {
      const {u,s,els: {app}} = v;
      const head=u.el('header','gov-head',app), breadcrumb=u.el('div','gov-breadcrumb',head);
      u.el('span','',breadcrumb,'My account');S.P.icon(breadcrumb,'chevron');u.el('span','',breadcrumb,'Applications');S.P.icon(breadcrumb,'chevron');u.el('span','',breadcrumb,'Civic support');
      const titleRow=u.el('div','gov-title-row',head);
      u.el('h2','',titleRow,S.D.title);const pill=u.el('span','gov-pill',titleRow,'');
      const subtitle=u.el('div','gov-subtitle',head);
      u.el('span','',subtitle,`Application ${s.ref}`);u.el('span','gov-form-version',subtitle,S.D.formVersion);
      v.els.pill=pill;
    };

    BASE.workflow = (v) => {
      const {u,els: {app}} = v;
      const workflow=u.el('div','gov-workflow',app),steps=u.el('div','gov-steps',workflow);
      const guide=S.P.button(v,workflow,'gov-link gov-guide-link','Application guidance');
      Object.assign(v.els,{steps,guide});
    };

    BASE.sidebar = (v) => {
      const {u,s,els: {app,messagesButton,accountButton,guide}} = v;
      const work=u.el('div','gov-work',app),sidebar=u.el('aside','gov-sidebar',work);
      const caseBox=u.el('div','gov-case',sidebar);u.el('div','gov-case-code',caseBox,s.ref);u.el('div','gov-hint',caseBox,'Personal support / Current application');
      const sideTabs=u.el('div','gov-side-tabs',sidebar);sideTabs.setAttribute('role','tablist');sideTabs.setAttribute('aria-label','Case information');
      const record=u.el('div','gov-record',sidebar);record.setAttribute('aria-label','Case information');record.tabIndex=0;
      Object.assign(v.els,{work,sidebar,sideTabs,record,sidePanels:{},sideButtons:{}});
      for(const [id,title]of [['record','Record'],['history','Activity'],['messages','Messages']])S.P.sideTab(v,id,title);
      messagesButton.addEventListener('click',()=>S.P.chooseSide(v,'messages'));accountButton.addEventListener('click',()=>S.P.chooseSide(v,'record'));guide.addEventListener('click',()=>{S.P.chooseSide(v,'record');record.scrollTop=record.scrollHeight;});
      S.P.record(v);S.P.history(v);S.P.messages(v);
      S.P.chooseSide(v,'record');env.ui.scrollPane(record,{});
    };

    BASE.sideTab = (v,id,title) => {
      const {u,els: {sideTabs,record,sideButtons,sidePanels}} = v;
      const b=S.P.button(v,sideTabs,'gov-side-tab',title);b.setAttribute('role','tab');sideButtons[id]=b;
      sidePanels[id]=u.el('div','gov-side-panel',record);sidePanels[id].setAttribute('role','tabpanel');sidePanels[id].setAttribute('aria-label',title);
      b.addEventListener('click',()=>S.P.chooseSide(v,id));
    };

    BASE.chooseSide = (v,id) => {
      const {els: {sidePanels,sideButtons,record}} = v;
      for(const [key,panel]of Object.entries(sidePanels)){panel.hidden=key!==id;sideButtons[key].setAttribute('aria-selected',String(key===id));}record.scrollTop=0;
    };

    BASE.record = (v) => {
      const {u,s,els: {sidePanels}} = v;
      const source=sidePanels.record;
      u.el('div','gov-kicker',source,'Verified applicant record');u.el('div','gov-person',source,s.record.name);
      const verified=u.el('div','gov-trust',source);S.P.icon(verified,'lock');u.el('span','',verified,'Source: resident services register');
      const recordDl=u.el('dl','',source);
      S.P.recordRow(v,recordDl,'Residence in district',`${s.record.months} months`);S.P.recordRow(v,recordDl,'Employment',s.record.employment);S.P.recordRow(v,recordDl,'Dependants',s.record.dependants);
      for(const f of s.fields)if(f.kind==='text'&&f.id!=='name')S.P.recordRow(v,recordDl,f.id==='date'?'Proposed effective date':f.label,f.source);
      if(s.scenario==='branching')S.P.recordRow(v,recordDl,'Household member',s.record.child);
      u.el('div','gov-kicker',source,'Service eligibility');
      u.el('div','gov-rule',source,`Applicants must have lived in the district for at least ${s.record.minimum} months. Only provide employment and household details when they apply.`);
      u.el('div','gov-kicker',source,'Other applications');
      for(const [title,state]of [['Resident parking permit','Issued'],['Address registration','Closed'],['Community travel pass','Renewal due']]){
        S.P.otherCase(v,source,title,state);
      }
      u.el('div','gov-kicker',source,'Help with this application');
      u.el('p','gov-hint',source,'Use your verified record when completing this form. For an incorrect register entry, contact Resident Services.');
      u.el('p','gov-hint',source,'Application guide CS-104 / Privacy notice / Accessibility support');
    };

    BASE.recordRow = (v,parent,label,value) => {
      const {u} = v;
      u.el('dt','',parent,label);u.el('dd','',parent,String(value));
    };

    BASE.otherCase = (v,parent,title,state) => {
      const {u,r} = v;
      const item=u.el('div','gov-other-case',parent,title);u.el('span','',item,`CV-${r.int(10400,98999)} / ${state}`);
      S.P.decorated(v,item,'other-case',title);
    };

    BASE.history = (v) => {
      const {u,els: {sidePanels}} = v;
      u.el('h3','',sidePanels.history,'Application activity');u.el('div','gov-hint',sidePanels.history,'Draft history is retained until a decision is issued.');
      const historyList=u.el('ol','gov-timeline',sidePanels.history),liveHistory=u.el('li','',historyList);
      for(const [title,detail]of [['Applicant record verified','Resident Services / register import'],['Draft restored','Previous session / revision 02'],['Application created','Civic support / online service']]){
        S.P.timelineRow(v,historyList,title,detail);
      }
      v.els.liveHistory=liveHistory;
    };

    BASE.messages = (v) => {
      const {u,els: {sidePanels}} = v;
      u.el('h3','',sidePanels.messages,'Secure messages');u.el('div','gov-hint',sidePanels.messages,'2 unread / Messages for your account');
      for(const [title,body]of [['Your draft is available','You can return to your saved civic support application from My applications. No decision has been made.'],['Travel pass renewal reminder','Your community travel pass is due for renewal. This message does not affect your civic support application.']]){
        S.P.message(v,sidePanels.messages,title,body);
      }
    };

    BASE.message = (v,parent,title,body) => {
      const {u} = v;
      const item=u.el('article','gov-message',parent);u.el('div','gov-hint',item,'Resident Services / Unread');u.el('h4','',item,title);u.el('p','',item,body);
      S.P.decorated(v,item,'message',title);
    };
  }

  function defineFormParts(BASE, S) {
    BASE.main = (v) => {
      const {u,els: {work}} = v;
      const main=u.el('div','gov-main',work),contextStrip=u.el('div','gov-context-strip',main);
      const contextTitle=u.el('span','',contextStrip);S.P.icon(contextTitle,'file');const contextLabel=u.el('span','',contextTitle);
      const security=u.el('span','',contextStrip);S.P.icon(security,'lock');u.el('span','',security,'Secure application');
      const pane=u.el('div','gov-scroll',main);pane.setAttribute('aria-label','Application details');pane.tabIndex=0;
      const form = u.el('div','gov-form',pane), review = u.el('div','gov-review',pane), receipt = u.el('div','gov-receipt',pane);
      Object.assign(v.els,{main,contextLabel,pane,form,review,receipt});
    };

    BASE.introduction = (v) => {
      const {u,s,els: {form}} = v;
      const intro=u.el('div','gov-page-intro',form);
      u.el('h3','',intro,S.D.scenarioCopy[s.scenario][0]);u.el('p','',intro,S.D.scenarioCopy[s.scenario][1]);
      const notice = u.el('div','gov-alert',form,s.scenario === 'saveresume' ? 'Saved draft restored. Check entries against the verified record before continuing.' :
        'Complete the applicable sections. Your application is not sent until you review and declare it.');
      const errorBox = u.el('div','gov-alert bad',form);errorBox.setAttribute('role','alert');
      Object.assign(v.els,{notice,errorBox});
    };

    BASE.fields = (v) => {
      const {u,s,fields,groups} = v;
      for (const f of s.fields) {
        if (!groups[f.section]) groups[f.section]=S.P.section(v,f.section);
        const g=groups[f.section];g.fields.push(f);
        const w=S.P.field(v,f,g);
        if (f.kind==='text') {
          w.input=S.P.textInput(v,f,w);
          w.input.addEventListener('input',()=>S.P.act(v,{set:[f.id,w.input.value]}));S.P.put(v,{field:f.id},w.input);
        } else {
          w.choices=new Map();const row=S.P.choiceGroup(v,w.wrap,f.label);
          for(const value of f.options){
            const b=S.P.choice(v,row,value,true);
            b.addEventListener('click',()=>S.P.act(v,{set:[f.id,value]}));w.choices.set(value,b);S.P.put(v,{choice:[f.id,value]},b);
          }
        }
        if (f.hint) u.el('div','gov-hint',w.wrap,f.hint);
        w.err=u.el('div','gov-error',w.wrap);w.err.id=`gov-error-${f.id}`;
        if(w.input)w.input.setAttribute('aria-describedby',w.err.id);
        fields[f.id]=w;
        S.P.decorated(v,w.wrap,'field',f);
      }
    };

    BASE.section = (v,name) => {
      const {u,els: {form}} = v;
      const fs=u.el('fieldset','gov-section',form);u.el('legend','',fs,name);
      const meta=u.el('div','gov-section-meta',fs);
      u.el('span','',meta,'Required where applicable');const status=u.el('span','gov-section-status',meta);
      return {el:fs,status,grid:u.el('div','gov-fields',fs),fields:[]};
    };

    BASE.field = (v,f,group) => {
      const {u,s} = v;
      const wrap=u.el('div','gov-field' + (f.kind==='choice' ? ' gov-wide' : ''),group.grid);
      const label=u.el('label','gov-label',wrap);
      u.el('span','gov-field-code',label,`CS-104 / ${s.fields.indexOf(f)+1}`);u.el('span','',label,f.label);
      return {wrap,label};
    };

    BASE.textInput = (v,f,field) => {
      const {u} = v;
      const input=u.el('input','gov-input',field.wrap);input.type='text';input.id=`gov-${f.id}`;
      field.label.htmlFor=input.id;input.autocomplete='off';input.spellcheck=false;
      return input;
    };

    BASE.choiceGroup = (v,parent,label) => {
      const {u} = v;
      const row=u.el('div','gov-options',parent);row.setAttribute('role','radiogroup');row.setAttribute('aria-label',label);
      return row;
    };

    BASE.choice = (v,parent,value,radioIcon) => {
      const {u} = v;
      const b=S.P.button(v,parent,radioIcon?'gov-radio':'',radioIcon?undefined:value);b.setAttribute('role','radio');
      if(radioIcon){S.P.icon(b,'radio');u.el('span','',b,value);}
      return b;
    };

    BASE.evidence = (v) => {
      const {u,s,r,docs,els: {form}} = v;
      const fileSize=new Map(s.docs.map(d=>[d.id,r.int(85,840)]));
      if (!s.docs.length) return;
      const fs=u.el('fieldset','gov-section',form);u.el('legend','',fs,'6 · Evidence checklist');
      u.el('p','gov-hint',fs,'Available case files are listed below. Attach the documents required by each rule. Optional evidence should remain unattached.');
      const toolbar=u.el('div','gov-file-toolbar',fs);u.el('strong','',toolbar,`${s.docs.length} documents available`);v.els.evidenceCount=u.el('span','',toolbar);
      const types=[...new Set(s.docs.map(d=>d.type))];
      for(const d of s.docs)docs[d.id]=S.P.evidenceRow(v,fs,d,fileSize.get(d.id),types);
    };

    BASE.evidenceRow = (v,parent,d,size,types) => {
      const {u} = v;
      const row=u.el('div','gov-file',parent),top=u.el('div','gov-file-head',row),fileTitle=u.el('div','gov-file-title',top);
      S.P.icon(fileTitle,'file');const title=u.el('div','',fileTitle);
      u.el('h4','',title,d.label);u.el('code','',title,d.file);
      S.P.fileMetadata(v,title,d,size);
      const fileState=u.el('div','gov-file-state gov-hint',title);
      const actions=u.el('div','gov-file-actions',top);u.el('span','gov-file-rule',actions,d.rule.startsWith('Optional')?'Optional':d.id==='identity'||d.id==='residence'?'Required':'Conditional');
      const attach=S.P.button(v,actions,'','');attach.addEventListener('click',()=>S.P.act(v,{attach:d.id}));S.P.put(v,{attach:d.id},attach);
      u.el('div','gov-hint',row,d.rule);
      const chooser=u.el('div','gov-types',row);u.el('div','gov-label',chooser,'Document type');
      const options=S.P.choiceGroup(v,chooser,`${d.label} document type`), buttons=new Map();
      for (const type of types) {
        const b=S.P.choice(v,options,type,false);
        b.addEventListener('click',()=>S.P.act(v,{docType:[d.id,type]}));buttons.set(type,b);S.P.put(v,{docType:[d.id,type]},b);
      }
      const result={attach,chooser,buttons,fileState,err:u.el('div','gov-error',row)};
      S.P.decorated(v,row,'evidence',d);
      return result;
    };

    BASE.fileMetadata = (v,parent,d,size) => {
      const {u,r} = v;
      const metadata=u.el('div','gov-file-meta',parent);u.el('span','',metadata,`PDF / ${size} KB`);u.el('span','',metadata,`${r.int(1,4)} pages`);
    };
  }

  function defineReviewParts(BASE, S) {
    BASE.library = (v) => {
      const {u,els: {form}} = v;
      const library=u.el('div','gov-library',form);
      u.el('div','gov-kicker',library,'Other files in your account');
      for(const [name,detail]of [['parking-permit-receipt.pdf','Parking / Archived'],['registration-confirmation.pdf','Address registration'],['travel-pass-renewal.pdf','Travel / Notice']]){
        S.P.libraryRow(v,library,name,detail);
      }
      const help=u.el('details','gov-help-block',form);u.el('summary','',help,'What happens to my information?');
      u.el('p','',help,'Resident Services uses this information to assess your application. Evidence is retained with your case. Only authorised staff can access your documents. A change to your circumstances may require an updated application.');
    };

    BASE.libraryRow = (v,parent,name,detail) => {
      const {u} = v;
      const row=u.el('div','gov-library-row',parent);S.P.icon(row,'file');u.el('span','',row,name);u.el('small','',row,detail);
      S.P.decorated(v,row,'library',name);
    };

    BASE.review = (v) => {
      const {u,s,summaryValues,els: {review}} = v;
      u.el('h3','',review,'Check your answers');
      u.el('div','gov-alert',review,'Review the applicant details and attached evidence. You can return to the application to make corrections.');
      const summary=u.el('dl','gov-summary',review);
      for(const f of s.fields)summaryValues[f.id]=S.P.summaryRow(v,summary,f.label);
      const evidenceSummary=u.el('div','gov-hint',review);
      const check=S.P.declaration(v,review);
      check.addEventListener('change',()=>S.P.act(v,{declare:true}));S.P.put(v,{declare:true},check);
      Object.assign(v.els,{evidenceSummary,check});
    };

    BASE.summaryRow = (v,parent,label) => {
      const {u} = v;
      const row=u.el('div','',parent);u.el('dt','',row,label);return {row,value:u.el('dd','',row)};
    };

    BASE.declaration = (v,parent) => {
      const {u} = v;
      const declaration=u.el('div','gov-declaration',parent);
      u.el('strong','',declaration,'Declaration and legal responsibility');
      u.el('p','gov-hint',declaration,'I confirm that the information and evidence provided are accurate. Sending this application creates a binding declaration.');
      const checkLabel=u.el('label','gov-check',declaration), check=u.el('input','',checkLabel);check.type='checkbox';
      u.el('span','',checkLabel,'I have checked the details and accept the declaration.');
      return check;
    };

    BASE.receipt = (v) => {
      const {u,s,els: {receipt}} = v;
      const receivedIcon=u.el('div','gov-received',receipt);S.P.icon(receivedIcon,'check');u.el('h3','',receipt,'Application received');
      u.el('p','',receipt,'Keep this reference for your records. A caseworker will review your application.');
      u.el('div','gov-reference-label',receipt,'Your application reference');u.el('div','gov-reference-value',receipt,s.ref);
      const factsDl=u.el('dl','gov-summary',receipt);
      const nextSteps=u.el('div','gov-next-steps',receipt);u.el('h4','',nextSteps,'What happens next');
      const nextTimeline=u.el('ol','gov-timeline',nextSteps);
      for(const [title,detail]of [['Received by Resident Services','Your application and declaration have been recorded.'],['Caseworker assessment','We will check eligibility and contact you if more information is needed.'],['Decision notice','Your decision will be sent using your correspondence preference.']]){
        S.P.timelineRow(v,nextTimeline,title,detail);
      }
      u.el('p','',nextSteps,'Keep the original documents. You do not need to submit another application while this case is being reviewed.');
      v.els.factsDl=factsDl;
    };

    BASE.timelineRow = (v,parent,title,detail) => {
      const {u} = v;
      const row=u.el('li','',parent,title);u.el('small','',row,detail);return row;
    };

    BASE.advice = (v) => {
      const {u,geo: {wide},groups,els: {work}} = v;
      let adviceItems;
      if(wide){
        const advice=u.el('aside','gov-advice',work);advice.setAttribute('aria-label','Application guidance');
        u.el('h3','',advice,'In this application');adviceItems=new Map();const list=u.el('ul','gov-section-list',advice);
        for(const [name,g]of Object.entries(groups)){
          adviceItems.set(name,S.P.adviceItem(v,list,name,g));
        }
        u.el('div','gov-kicker',advice,'Before you send');
        u.el('p','',advice,'Check names and dates against the applicant record. Unneeded household details should stay blank.');
        u.el('p','',advice,'A final submission is a legal declaration. You can save an unfinished draft without making that declaration.');
        u.el('div','gov-kicker',advice,'Need assistance?');u.el('p','',advice,'Resident Services / Application guide CS-104 / Secure messages');
        const trust=u.el('div','gov-trust',advice);S.P.icon(trust,'lock');u.el('span','',trust,'Your account is protected');env.ui.scrollPane(advice,{});
      }
      v.els.adviceItems=adviceItems;
    };

    BASE.adviceItem = (v,parent,name,group) => {
      const {ctx,u,els: {pane}} = v;
      const row=u.el('li','',parent),jump=S.P.button(v,row,'gov-link',name.replace(/^\d+ · /,''));
      jump.addEventListener('click',()=>{if(ctx.model.page==='form'&&!group.el.hidden){pane.scrollTop+=group.el.getBoundingClientRect().top-pane.getBoundingClientRect().top-10;S.P.geometry(v);}});
      const item={row,status:u.el('small','',row)};S.P.decorated(v,row,'advice',name);return item;
    };

    BASE.footer = (v) => {
      const {ctx,u,s,els: {main}} = v;
      const foot=u.el('div','gov-bottom',main), left=u.el('div','',foot);
      const edit=S.P.button(v,left,'gov-link','Edit application');edit.addEventListener('click',()=>S.P.act(v,{nav:'edit'}));S.P.put(v,{nav:'edit'},edit);
      const save=S.P.button(v,left,'gov-link','Save draft');save.addEventListener('click',()=>S.P.act(v,{nav:'save'}));S.P.put(v,{nav:'save'},save);
      const saveStatus=u.el('div','gov-save-status',left);
      const primary=S.P.button(v,foot,'gov-primary');
      primary.addEventListener('click',()=>{
        const nav=ctx.model.page==='form' ? 'review' : 'submit';
        if (nav==='submit' && s.judge?.mode==='confirm') {ctx.flag('irreversible');return;}
        S.P.act(v,{nav});
      });
      S.P.put(v,{nav:'review'},primary);S.P.put(v,{nav:'submit'},primary);
      Object.assign(v.els,{edit,save,saveStatus,primary});
    };

    BASE.button = (v,parent,cls,text) => {
      const {u} = v;
      const b=u.el('button',cls,parent,text);b.type='button';return b;
    };

    BASE.icon = (parent,name,cls='') => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
      svg.setAttribute('viewBox','0 0 24 24'); svg.setAttribute('fill','none');
      svg.setAttribute('stroke','currentColor'); svg.setAttribute('stroke-width','1.6');
      svg.setAttribute('stroke-linecap','round'); svg.setAttribute('stroke-linejoin','round');
      svg.setAttribute('aria-hidden','true'); svg.setAttribute('class',`gov-icon ${cls}`);
      const path = document.createElementNS('http://www.w3.org/2000/svg','path');
      path.setAttribute('d',S.D.icons[name] || S.D.icons.file); svg.append(path); parent.append(svg);
      return svg;
    };
  }

  function defineStateParts(BASE, S) {
    BASE.put = (v,t,el) => v.targets.set(v.fam.helpers.targetKey(t),el);

    BASE.act = (v,a) => {
      const {ctx,s,fam} = v;
      ctx.update(fam.helpers.apply(ctx.model,s,a));S.P.sync(v,ctx.model);
    };

    BASE.geometry = (v) => {
      const {ctx,targets,els: {pane}} = v;
      const p=pane.getBoundingClientRect(), view={};
      for (const [key,el] of targets) {
        if (!pane.contains(el) || !el.getClientRects().length) continue;
        const r=el.getBoundingClientRect();
        view[key] = r.top < p.top+8 || r.bottom > p.bottom-8 ? Math.round((r.top+r.bottom)/2 - (p.top+p.bottom)/2) : 0;
      }
      if (JSON.stringify(ctx.model.view)!==JSON.stringify(view)) ctx.patch({view});
    };

    BASE.sync = (v,m) => {
      const {u,s,fam,fields,groups,docs,summaryValues} = v;
      const {form,review,receipt,pill,contextLabel,liveHistory,adviceItems,evidenceCount,errorBox,
        notice,check,evidenceSummary,edit,save,primary,saveStatus,pane} = v.els;
      const changed=v.page!==m.page;v.page=m.page;
      form.hidden=m.page!=='form';review.hidden=m.page!=='review';receipt.hidden=m.page!=='receipt';
      pill.textContent=m.submitted ? 'Received' : !s.record.eligible ? 'Not eligible' : m.saved ? 'Draft saved' : 'In progress';
      S.P.steps(v,m);
      contextLabel.textContent=m.page==='form'?'CS-104 / '+S.D.scenarioCopy[s.scenario][0]:m.page==='review'?'CS-104 / Review and declaration':'CS-104 / Submission acknowledgement';
      liveHistory.replaceChildren();liveHistory.append(m.submitted?'Application submitted':m.saved?'Draft saved':'Application in progress');
      u.el('small','',liveHistory,m.submitted?'Acknowledgement recorded / current session':m.saved?'Current session / latest revision':'Unsaved changes / current session');
      for (const f of s.fields) {
        const w=fields[f.id];w.wrap.hidden=!fam.helpers.active(f,m.values);
        if (w.input) {if(w.input.value!==m.values[f.id])w.input.value=m.values[f.id];w.input.setAttribute('aria-invalid',String(!!m.errors[f.id]));}
        if (w.choices) for (const [value,b] of w.choices) b.setAttribute('aria-checked',String(value===m.values[f.id]));
        w.err.textContent=m.errors[f.id]||'';
        const summary=summaryValues[f.id];summary.row.hidden=!fam.helpers.active(f,m.values);summary.value.textContent=m.values[f.id]||'Not provided';
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
        const w=docs[d.id],doc=m.docs[d.id];w.attach.textContent=doc.attached?'Remove attachment':'Attach file';
        w.attach.setAttribute('aria-pressed',String(doc.attached));w.chooser.hidden=!doc.attached;w.fileState.textContent=doc.attached?'Attached / '+(doc.type||'Document type not selected'):'Available in document library / Not attached';
        for(const [type,b] of w.buttons)b.setAttribute('aria-checked',String(type===doc.type));
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
      S.P.facts(v,m);
      if(changed)pane.scrollTop=0;
      S.P.geometry(v);
    };

    BASE.steps = (v,m) => {
      const {u,els: {steps}} = v;
      steps.replaceChildren();
      ['Application','Check answers','Confirmation'].forEach((t,i)=>{
        const active=i===['form','review','receipt'].indexOf(m.page),item=u.el('span','gov-step'+(active?' current':''),steps);
        if(active)item.setAttribute('aria-current','step');u.el('span','gov-step-number',item,String(i+1));u.el('span','',item,t);
      });
    };

    BASE.facts = (v,m) => {
      const {s,fam,els: {factsDl}} = v;
      factsDl.replaceChildren();
      for(const f of fam.facts(m,s))S.P.summaryRow(v,factsDl,f.label).value.textContent=f.value;
    };

    BASE.anchors = (v) => [v.els.app];

    BASE.locate = (v,t) => {
      if (t.pane) return v.ctx.util.center(v.els.pane);
      const el=v.targets.get(env.taskDef.helpers.targetKey(t));
      if (!el || !el.getClientRects().length) throw new Error(`use-gov-portal target is hidden: ${JSON.stringify(t)}`);
      return v.ctx.util.center(el);
    };

    BASE.decorated = (v,el,kind,data) => {};
    BASE.rendered = (v) => {};
  }

  env.template('use-gov-portal/portal', (design, def) => {
    let D, P, view;
    const BASE = {};
    const S = {
      get view() { return view; },
      get ctx() { return view?.ctx; },
      get spec() { return view?.s; },
      get els() { return view?.els; },
      get D() { return D; },
      get P() { return P; },
    };
    defineShellParts(BASE, S);
    defineFormParts(BASE, S);
    defineReviewParts(BASE, S);
    defineStateParts(BASE, S);

    ({D,P}=env.templateDesign('use-gov-portal/portal',design,def,{tokens:TOKENS,base:BASE,state:S}));
    return {
      render(ctx) {
        const v={ctx,u:ctx.util,s:ctx.spec,fam:env.taskDef,r:ctx.rng.fork('portal/details'),
          els:{},fields:{},groups:{},docs:{},targets:new Map(),summaryValues:{},page:null};
        view=v;
        P.styles(v);v.geo=P.fit(v);
        P.frame(v);P.masthead(v);P.heading(v);P.workflow(v);P.sidebar(v);P.main(v);
        P.introduction(v);P.fields(v);P.evidence(v);P.library(v);P.review(v);P.receipt(v);
        P.advice(v);P.footer(v);
        env.ui.scrollPane(v.els.pane,{onScroll:()=>P.geometry(v)});
        v.els.pane.addEventListener('scroll',()=>P.geometry(v));
        P.sync(v,ctx.model);P.rendered(v);
        return {anchors:P.anchors(v),sync:m=>P.sync(v,m)};
      },
      locate(t) { return P.locate(view,t); },
    };
  });
})();
