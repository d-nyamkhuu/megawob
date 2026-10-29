/* base / use-hr / classic: a fictional, populated HR workspace. Contextual directory employees,
 * requisitions, historical leave and other hires are read-only, never extra targets. Org chart uses a
 * connected canvas with expandable branches and native x/y scrolling. Only its reporting links change;
 * the model's original graded employees remain the editable set. All icon artwork is inline SVG.
 * Scroll geometry (including both ends of org moves and hidden ancestors) is mirrored to model.view.
 * Search, team collapse, notifications and supporting panels are local UI state. Root is the only anchor. */
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
  const CSS = `
    .hr-app{position:absolute;inset:8px;display:flex;flex-direction:column;overflow:hidden;background:var(--panel);border:1px solid var(--line);border-radius:9px;color:var(--fg);font:12px/1.4 system-ui,sans-serif;box-shadow:0 5px 18px #0000000b}
    .hr-app *{box-sizing:border-box}.hr-svg{width:16px;height:16px;flex:none;vertical-align:middle;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}
    .hr-brandbar{height:38px;flex:none;display:flex;align-items:center;gap:9px;padding:0 12px;border-bottom:1px solid var(--line)}.hr-logo{background:var(--accent);color:white;display:grid;place-items:center;width:25px;height:25px;border-radius:6px}
    .hr-company{font-size:11px;color:var(--muted);min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.hr-brandbar strong{font-size:14px;letter-spacing:-.3px}.hr-spacer{flex:1}.hr-topnote{font-size:10px;color:var(--muted)}
    .hr-badge{border-radius:4px;padding:1px 5px;background:color-mix(in srgb,var(--accent) 10%,var(--panel));color:var(--accent);font-size:10px;white-space:nowrap}.hr-iconbtn{display:inline-flex;align-items:center;justify-content:center;gap:5px;background:none;border:0;color:var(--muted);padding:5px;cursor:pointer;border-radius:4px;font:inherit}.hr-iconbtn:hover{background:var(--bg);color:var(--fg)}
    .hr-workspace{display:flex;flex:1;min-height:0;min-width:0}.hr-sidebar{width:139px;flex:none;overflow:auto;background:var(--bg);border-right:1px solid var(--line);padding:10px 7px;font-size:11px;scrollbar-width:thin}.hr-navheading{font-size:9px;letter-spacing:.09em;color:var(--muted);font-weight:700;padding:10px 7px 5px;text-transform:uppercase}.hr-navitem{display:flex;align-items:center;gap:7px;width:100%;min-height:30px;padding:6px 8px;color:var(--muted);border:0;background:none;border-radius:5px;font:inherit;text-align:left;cursor:pointer}.hr-navitem.on{background:color-mix(in srgb,var(--accent) 10%,var(--panel));color:var(--accent);font-weight:650}.hr-navitem:hover{background:var(--panel)}.hr-navitem small{margin-left:auto;font-size:9px}.hr-navitem .hr-svg{width:15px;height:15px}.hr-sidecard{border:1px solid var(--line);border-radius:5px;padding:8px;margin:8px 2px;color:var(--muted);font-size:10px}.hr-sidecard b{display:block;color:var(--fg);margin-bottom:4px}.hr-sideperson{display:flex;align-items:center;gap:6px;padding:6px 4px;font-size:10px;color:var(--muted)}.hr-sideperson b{display:block;color:var(--fg);font-size:10px}.hr-sideperson small{font-size:9px}
    .hr-main{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column;position:relative}.hr-title{padding:10px 13px 8px;flex:none;display:flex;align-items:center;gap:8px}.hr-title h2{font-size:19px;letter-spacing:-.5px;margin:1px 0 2px;line-height:1.2}.hr-title small{font-size:10px;color:var(--muted)}.hr-breadcrumb{font-size:9px;color:var(--muted);display:flex;align-items:center;gap:4px}.hr-breadcrumb .hr-svg{width:10px;height:10px}
    .hr-btn{display:inline-flex;align-items:center;justify-content:center;gap:5px;background:var(--panel);color:var(--fg);border:1px solid var(--line);border-radius:5px;padding:5px 8px;font:inherit;font-size:11px;cursor:pointer;white-space:nowrap}.hr-btn:hover{border-color:var(--accent)}.hr-btn.active{border-color:var(--accent);color:var(--accent);background:color-mix(in srgb,var(--accent) 7%,var(--panel))}.hr-primary{background:var(--accent);border-color:var(--accent);color:white}.hr-danger{border-color:color-mix(in srgb,#b34646 60%,var(--line))}.hr-btn .hr-svg{width:14px;height:14px}
    .hr-toolbar{display:flex;align-items:center;gap:6px;padding:0 12px 8px;flex:none}.hr-search{display:flex;align-items:center;gap:6px;min-width:90px;max-width:250px;flex:1;border:1px solid var(--line);border-radius:5px;padding:4px 7px;color:var(--muted);background:var(--panel)}.hr-search input{border:0;outline:0;min-width:0;width:100%;background:transparent;color:var(--fg);font:inherit;font-size:11px;user-select:text}.hr-search input::placeholder{color:var(--muted)}.hr-viewlabel{font-size:10px;color:var(--muted);white-space:nowrap}.hr-subtabs{display:flex;gap:16px;border-bottom:1px solid var(--line);padding:0 12px;min-height:29px;flex:none;color:var(--muted);font-size:11px}.hr-subtab{display:flex;align-items:center;gap:5px;border-bottom:2px solid transparent;padding-bottom:5px}.hr-subtab.on{border-color:var(--accent);color:var(--accent);font-weight:650}
    .hr-policy{padding:6px 9px;margin:0 12px 8px;border:1px solid color-mix(in srgb,var(--accent) 23%,var(--line));border-radius:5px;background:color-mix(in srgb,var(--accent) 5%,var(--panel));font-size:10px;line-height:1.45;flex:none}.hr-policy b{color:var(--accent)}
    .hr-work{display:flex;flex:1;min-height:0;min-width:0;gap:10px;padding:0 12px 10px;position:relative}.hr-pane{overflow:auto;min-height:0;min-width:0;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:var(--line) transparent}.hr-stats{flex:none;min-height:26px;display:flex;align-items:center;flex-wrap:wrap;gap:3px 15px;padding:5px 12px;border-top:1px solid var(--line);background:var(--bg);font-size:10px}.hr-stat{color:var(--muted)}.hr-stat strong{color:var(--fg);margin-left:4px}.hr-save{margin-left:auto;color:var(--muted);display:flex;align-items:center;gap:4px;font-size:9px}.hr-save .hr-svg{width:12px;height:12px}
    .hr-avatar{width:27px;height:27px;flex:none;border-radius:50%;display:grid;place-items:center;background:color-mix(in srgb,var(--accent) 13%,var(--panel));color:var(--accent);font-size:10px;font-weight:700}.hr-personline{display:flex;align-items:center;gap:7px;min-width:0}.hr-persontext{min-width:0}.hr-persontext h4{margin:0;font-size:11px;line-height:1.3;overflow-wrap:anywhere}.hr-persontext small{display:block;font-size:9px;color:var(--muted);overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.hr-muted{color:var(--muted);font-size:10px}.hr-footnote{font-size:9px;color:var(--muted);margin:6px 0}.hr-tag{display:inline-flex;align-items:center;gap:4px;border-radius:4px;padding:2px 5px;font-size:9px;background:var(--bg);border:1px solid var(--line);white-space:nowrap}.hr-drag{cursor:grab;touch-action:none}.hr-card{background:var(--panel);border:1px solid var(--line);border-radius:6px;padding:8px;position:relative}.hr-card:hover{border-color:var(--accent)}
    .hr-board{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;flex:1;min-width:0}.hr-lane{display:flex;flex-direction:column;min-height:0;min-width:0;border:1px solid var(--line);border-radius:6px;background:var(--bg)}.hr-lanehead{display:flex;align-items:center;gap:5px;padding:8px;min-height:33px;border-bottom:1px solid var(--line);font-size:11px;font-weight:700;flex:none}.hr-lanehead small{color:var(--muted);font-size:10px;margin-left:auto}.hr-stagebar{width:3px;height:12px;border-radius:2px;background:var(--accent)}.hr-lane:nth-child(2) .hr-stagebar{background:#a58a44}.hr-lane:nth-child(3) .hr-stagebar{background:#468a75}.hr-lane:nth-child(4) .hr-stagebar{background:#a26676}.hr-lanebody{flex:1;padding:6px}.hr-candidate{margin-bottom:6px}.hr-candidate .hr-avatar{width:23px;height:23px;font-size:9px}.hr-candidate h4{font-size:11px}.hr-meta{display:flex;flex-wrap:wrap;gap:3px;margin:7px 0}.hr-chip{font-size:9px;border:1px solid var(--line);background:var(--bg);padding:1px 3px;border-radius:3px}.hr-score{display:flex;align-items:center;justify-content:space-between;gap:4px;font-size:9px;color:var(--muted)}.hr-score b{color:var(--fg)}.hr-scorebar{height:3px;background:var(--line);border-radius:2px;margin:5px 0 6px;overflow:hidden}.hr-scorebar i{display:block;height:100%;background:var(--accent)}.hr-cardbottom{display:flex;align-items:center;justify-content:space-between;font-size:9px;color:var(--muted);border-top:1px solid var(--line);padding-top:5px}.hr-cardbottom .hr-svg{width:11px;height:11px}.hr-empty{text-align:center;color:var(--muted);font-size:10px;padding:20px 8px;border:1px dashed var(--line);border-radius:5px}.hr-empty .hr-svg{display:block;margin:0 auto 6px;width:22px;height:22px}
    .hr-rail{width:184px;flex:none;display:flex;flex-direction:column;gap:10px;overflow:auto;scrollbar-width:thin}.hr-panel{border:1px solid var(--line);border-radius:6px;padding:10px;background:var(--panel);font-size:10px}.hr-panel h3{font-size:11px;margin:0 0 8px}.hr-listline{padding:7px 0;border-bottom:1px solid var(--line)}.hr-listline:last-child{border:0}.hr-listline b{font-size:10px;display:block;margin-bottom:2px}.hr-panelhead{display:flex;align-items:center;gap:6px;margin-bottom:8px;font-weight:700}.hr-timeline{border-left:1px solid var(--line);margin:8px 0 0 6px;padding-left:10px}.hr-timeline p{font-size:10px;margin:0 0 10px}.hr-timeline small{display:block;color:var(--muted);font-size:9px;margin-top:2px}
    .hr-treeviewport{flex:1;position:relative;background-color:var(--bg);background-image:radial-gradient(var(--line) .65px,transparent .65px);background-size:16px 16px;border:1px solid var(--line);border-radius:6px}.hr-canvas{position:relative;min-width:100%;min-height:100%;width:920px;height:800px}.hr-connectors{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;overflow:visible}.hr-connectors path{fill:none;stroke:var(--line);stroke-width:1.4}.hr-orgcard{position:absolute;width:190px;height:65px;border-top:3px solid color-mix(in srgb,var(--accent) 70%,var(--line));padding:7px 8px;box-shadow:0 2px 4px #00000008}.hr-orgcard.context{border-top-color:var(--line)}.hr-orgcard.match{outline:2px solid var(--accent);outline-offset:2px}.hr-orgcard.dim{opacity:.4}.hr-orgcard .hr-persontext{padding-right:9px}.hr-orgmeta{display:flex;align-items:center;justify-content:space-between;margin-top:4px;color:var(--muted);font-size:9px}.hr-orgtoggle{position:absolute;right:3px;top:3px;padding:2px;background:var(--panel);border:1px solid var(--line);border-radius:4px;color:var(--muted);cursor:pointer;z-index:1}.hr-orgtoggle .hr-svg{width:11px;height:11px}.hr-canvasnote{position:absolute;left:14px;bottom:10px;color:var(--muted);font-size:9px;background:var(--panel);border:1px solid var(--line);border-radius:4px;padding:4px 7px;pointer-events:none}.hr-result{position:absolute;right:12px;top:8px;background:var(--panel);border:1px solid var(--line);border-radius:4px;padding:5px 8px;font-size:10px;z-index:2}
    .hr-queue{flex:1}.hr-queuehead{display:flex;gap:8px;padding:7px 9px;background:var(--bg);border:1px solid var(--line);border-radius:5px 5px 0 0;font-size:10px;font-weight:650}.hr-queuehead span{margin-left:auto;color:var(--muted);font-weight:400}.hr-request{display:grid;grid-template-columns:minmax(105px,1.05fr) minmax(150px,1.4fr) 127px;gap:10px;padding:10px 8px;border:1px solid var(--line);border-top:0;align-items:center;background:var(--panel)}.hr-request h4{margin:0 0 3px;font-size:11px}.hr-evidence{display:grid;grid-template-columns:1fr 1fr;gap:5px;font-size:9px}.hr-evidence span{display:block;color:var(--muted);font-size:9px}.hr-evidence b{font-size:10px;font-weight:600}.hr-actions{display:flex;flex-wrap:wrap;gap:4px;align-content:center}.hr-status{display:block;width:100%;font-size:9px;font-weight:650;color:var(--accent);margin-bottom:3px}.hr-status[data-status=Denied]{color:var(--muted)}.hr-status[data-status=Approved]{color:color-mix(in srgb,#458b69 85%,var(--fg))}.hr-history{margin-top:16px}.hr-historyrow{display:grid;grid-template-columns:1.3fr 1fr 70px;gap:8px;padding:9px;border-bottom:1px solid var(--line);font-size:10px;color:var(--muted)}.hr-historyrow strong{font-weight:500;color:var(--fg)}
    .hr-calendar{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;text-align:center;font-size:9px}.hr-calendar span{padding:3px 0;min-width:0}.hr-calendar .dayname{color:var(--muted);font-size:8px}.hr-calendar .blackout{background:color-mix(in srgb,#b96856 15%,var(--panel));color:var(--fg);border-radius:3px}.hr-calendar .booked{box-shadow:inset 0 -2px var(--accent)}.hr-legend{font-size:9px;color:var(--muted);margin-top:7px;display:flex;gap:5px;align-items:center}.hr-legend i{height:7px;width:7px;background:color-mix(in srgb,#b96856 25%,var(--panel));border:1px solid var(--line);border-radius:2px}
    .hr-onboard{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:10px;width:100%;min-height:0}.hr-section{border:1px solid var(--line);border-radius:6px;padding:10px;background:var(--panel)}.hr-section h3{font-size:12px;margin:0 0 6px}.hr-hirehead{display:flex;align-items:center;gap:8px;padding:0 0 10px;border-bottom:1px solid var(--line);margin-bottom:6px}.hr-hirehead b{font-size:12px}.hr-progress{height:4px;border-radius:2px;background:var(--line);margin:9px 0 5px}.hr-progress i{display:block;height:100%;border-radius:2px;background:var(--accent)}.hr-grouphead{display:flex;align-items:center;justify-content:space-between;font-size:10px;font-weight:650;margin:13px 0 3px}.hr-grouphead small{font-size:9px;color:var(--muted);font-weight:400}.hr-check{width:100%;display:flex;align-items:flex-start;gap:7px;text-align:left;padding:9px 0;background:none;border:0;border-bottom:1px solid var(--line);color:var(--fg);font:inherit;font-size:11px;cursor:pointer}.hr-checkmark{width:16px;height:16px;flex:none;display:grid;place-items:center;border:1px solid var(--line);border-radius:4px;margin-top:1px}.hr-checkmark .hr-svg{width:13px;height:13px}.hr-check[aria-checked=true] .hr-checkmark{background:var(--accent);border-color:var(--accent);color:white}.hr-check small{display:block;font-size:9px;color:var(--muted);margin-top:3px}.hr-taskmeta{margin-left:auto;text-align:right;white-space:nowrap;font-size:9px;color:var(--muted)}.hr-taskmeta small{font-size:8px}.hr-readonlytask{display:flex;align-items:center;gap:7px;border-bottom:1px solid var(--line);padding:8px 0;font-size:10px;color:var(--muted)}.hr-readonlytask .hr-svg{color:var(--accent);width:14px;height:14px}.hr-readonlytask small{margin-left:auto;font-size:9px}
    .hr-offer{padding:9px;border:1px solid var(--line);background:var(--bg);border-radius:5px;margin-bottom:10px;font-size:10px}.hr-offer strong{display:flex;align-items:center;gap:6px;margin-bottom:7px;color:var(--accent);font-size:10px}.hr-offer dl{margin:0;display:grid;grid-template-columns:64px 1fr;gap:3px 6px}.hr-offer dt{color:var(--muted)}.hr-offer dd{margin:0;overflow-wrap:anywhere}.hr-equipment{width:100%;display:flex;align-items:center;justify-content:flex-start;text-align:left;padding:7px;margin-bottom:5px;gap:8px}.hr-equipment>.hr-svg{width:24px;height:24px;color:var(--muted)}.hr-equipment b{display:block;font-size:10px}.hr-equipment small{font-size:9px;color:var(--muted)}.hr-equipcheck{margin-left:auto;color:var(--accent)}.hr-fieldlabel{font-size:10px;font-weight:650;color:var(--muted);display:block;margin:11px 0 4px}.hr-input{width:100%;padding:7px 8px;background:var(--panel);color:var(--fg);border:1px solid var(--line);border-radius:5px;font:inherit;font-size:11px;user-select:text}.hr-validation{color:#b46c56;font-size:9px;min-height:13px;margin-top:3px}
    .hr-dialogback{position:absolute;inset:0;background:#00000032;z-index:30;display:flex;justify-content:flex-end}.hr-drawer{width:min(410px,95%);padding:15px;background:var(--panel);border-left:1px solid var(--line);box-shadow:-5px 0 24px #0002;overflow:auto}.hr-drawer h3{font-size:18px;letter-spacing:-.3px;margin:10px 0 3px;overflow-wrap:anywhere}.hr-drawer h4{font-size:12px;margin:15px 0 6px}.hr-drawer p{font-size:11px;line-height:1.6;white-space:pre-wrap}.hr-close{float:right}.hr-mail{padding:11px;background:var(--bg);border:1px solid var(--line);border-radius:5px;font-size:10px}.hr-profiletabs{display:flex;gap:20px;padding:12px 0 7px;border-bottom:1px solid var(--line);font-size:11px;color:var(--muted)}.hr-profiletabs b{color:var(--accent)}.hr-profilegrid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:13px;font-size:11px}.hr-profilegrid small{display:block;color:var(--muted);font-size:9px}.hr-profilefile{display:flex;align-items:center;gap:7px;padding:8px;border:1px solid var(--line);border-radius:5px;font-size:10px;margin-top:7px}
    .hr-toast{position:absolute;right:12px;top:42px;z-index:35;width:260px;padding:11px;border:1px solid var(--line);border-radius:6px;background:var(--panel);box-shadow:0 8px 25px #0003;font-size:11px}.hr-toast h4{margin:0 0 8px;font-size:12px}.hr-toast p{font-size:10px;color:var(--muted);margin:7px 0}
    .hr-tight .hr-sidebar{width:43px;padding:8px 4px}.hr-tight .hr-sidebar .hr-navlabel,.hr-tight .hr-sidebar small,.hr-tight .hr-navheading,.hr-tight .hr-sidecard,.hr-tight .hr-sideperson{display:none}.hr-tight .hr-navitem{padding:8px;justify-content:center}.hr-tight .hr-title h2{font-size:16px}.hr-tight .hr-company{max-width:140px}.hr-tight .hr-topnote,.hr-tight .hr-viewlabel{display:none}.hr-tight .hr-request{grid-template-columns:minmax(90px,1fr) minmax(125px,1.2fr);gap:7px}.hr-tight .hr-actions{grid-column:1/-1;align-items:center}.hr-tight .hr-status{width:auto;margin-right:auto;margin-bottom:0}.hr-tight .hr-toolbar .hr-filterlabel{display:none}
    .hr-short .hr-title{padding:6px 12px}.hr-short .hr-title small{display:none}.hr-short .hr-title h2{font-size:16px}.hr-short .hr-toolbar{padding-bottom:6px}.hr-short .hr-policy{font-size:9px;padding:4px 7px;margin-bottom:6px}.hr-short .hr-subtabs{min-height:25px}
  `;
  let current;
  function render(ctx) {
    const { spec: s, util, size, content: C } = ctx, f = env.taskDef;
    ctx.css('hr-classic-style', CSS);
    const root = util.el('div', `hr-app${size.width < 790 ? ' hr-tight' : ''}${size.height < 490 ? ' hr-short' : ''}`, ctx.stage);
    const state = { ctx, root, refs: {}, panes: {} }; current = state;
    const offsets = {}, ui = { query: '', collapsed: new Set() }, r = ctx.rng.fork('workspace-context');
    const extras = Array.from({ length: 8 }, (_, i) => {
      const p = C.personName(r, { csplit: s.csplit });
      return { id: `context-${i}`, name: p.full, role: C.pick(r, C.JOB_TITLES, { csplit: s.csplit }), city: C.pick(r, C.CITIES, { csplit: s.csplit }).city,
        email: C.emailAddress(r, p), date: `2027-06-${String(9 + i).padStart(2, '0')}` };
    });
    const el = (tag, cls, parent, text) => util.el(tag, cls, parent, text);
    function icon(parent, name) { const svg = util.svg('svg', { class: 'hr-svg', viewBox: '0 0 24 24', 'aria-hidden': 'true' }, parent); svg.innerHTML = ICONS[name] || ICONS.file; return svg; }
    const addRef = (key, node, pane) => { state.refs[key] = { node, pane }; return node; };
    function button(parent, text, action, cls = '', glyph) {
      const b = el('button', 'hr-btn ' + cls, parent); b.type = 'button'; if (glyph) icon(b, glyph);
      if (text) el('span', '', b, text); b.addEventListener('click', action); return b;
    }
    function iconButton(parent, name, title, action) { const b = button(parent, '', action, 'hr-iconbtn', name); b.title = title; b.setAttribute('aria-label', title); return b; }
    function avatar(parent, p) { return el('span', 'hr-avatar', parent, p.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join('')); }
    function identity(parent, p) { const line = el('div', 'hr-personline', parent); avatar(line, p); const text = el('div', 'hr-persontext', line); el('h4', '', text, p.name); el('small', '', text, p.role); return line; }
    function notice(title, lines) {
      root.querySelectorAll('.hr-toast').forEach((p) => p.remove());
      const pop = el('div', 'hr-toast', root); iconButton(pop, 'close', 'Close notice', () => pop.remove()).style.float = 'right';
      el('h4', '', pop, title); for (const line of lines) el('p', '', pop, line);
    }
    function pane(parent, id, cls = '') {
      const p = el('div', 'hr-pane ' + cls, parent); state.panes[id] = p;
      p.addEventListener('scroll', () => { if (current !== state || !p.isConnected) return; offsets[id] = [p.scrollLeft, p.scrollTop]; mirror(); });
      return p;
    }
    function mirror() {
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
    }
    function update(a, rebuild = true) { ctx.update(f.helpers.act(ctx.model, s, a)); if (rebuild) draw(); else stats(); }
    function stats() {
      footer.replaceChildren();
      for (const fact of f.facts(ctx.model, s)) { const item = el('span', 'hr-stat', footer, fact.label + ':'); el('strong', '', item, fact.value); }
      const saved = el('span', 'hr-save', footer); icon(saved, 'check'); saved.append(document.createTextNode('All changes saved'));
    }
    function drag(node, key, onDrop, onClick) {
      let ghost;
      env.ui.track(node, {
        start(p, e) { if (e.target.closest('button')) return false; node.style.opacity = '.55'; },
        move(p) {
          if (!ghost && Math.hypot(p.dx, p.dy) > 5) {
            const rect = node.getBoundingClientRect(); ghost = node.cloneNode(true);
            Object.assign(ghost.style, { position: 'fixed', width: rect.width + 'px', height: rect.height + 'px', left: rect.left + 'px', top: rect.top + 'px', margin: '0', opacity: '.94', pointerEvents: 'none', zIndex: '500', boxShadow: '0 8px 24px #0004' }); root.append(ghost);
          }
          if (ghost) ghost.style.transform = `translate(${p.dx}px,${p.dy}px)`;
        },
        end(p) { if (ghost) { ghost.remove(); ghost = null; } node.style.opacity = ''; if (Math.hypot(p.dx, p.dy) > 5) onDrop(p); else if (onClick) onClick(); },
      }, key);
    }
    const contains = (node, p) => { const rect = node.getBoundingClientRect(); return p.x >= rect.left && p.x <= rect.right && p.y >= rect.top && p.y <= rect.bottom; };
    const money = (n) => C.formatMoney(n, 'USD', 'en-US');
    const brand = el('div', 'hr-brandbar', root); icon(el('span', 'hr-logo', brand), 'people'); el('strong', '', brand, 'peopleworks');
    el('span', 'hr-company', brand, s.company); el('span', 'hr-spacer', brand); el('span', 'hr-topnote', brand, 'People workspace');
    iconButton(brand, 'bell', 'Notifications, 3 unread', () => notice('Notifications', ['3 new updates', 'Payroll closes Friday at 17:00.', `${extras[0].name} signed their offer letter.`, 'Quarterly headcount report is ready.']));
    el('span', 'hr-badge', brand, '3'); avatar(brand, { name: 'Alex Lane' });
    const workspace = el('div', 'hr-workspace', root), sidebar = el('aside', 'hr-sidebar', workspace), main = el('main', 'hr-main', workspace);
    el('div', 'hr-navheading', sidebar, 'Workspace');
    const navItems = [['home', 'Home', ''], ['people', 'Employees', String(s.people.length + (s.directory || []).length)], ['tree', 'Org chart', 'orgchart'], ['case', 'Recruiting', 'pipeline'], ['calendar', 'Time off', 'timeoff'], ['checklist', 'Onboarding', 'onboarding'], ['file', 'Documents', '12'], ['chart', 'Reports', ''], ['gear', 'Settings', '']];
    for (const [glyph, label, id] of navItems) {
      const b = el('button', 'hr-navitem' + (id === s.scenario ? ' on' : ''), sidebar); b.type = 'button'; icon(b, glyph); el('span', 'hr-navlabel', b, label);
      if (['12', String(s.people.length + (s.directory || []).length)].includes(id)) el('small', '', b, id);
      b.addEventListener('click', () => notice(label, [id === s.scenario ? 'You are viewing this workspace.' : 'Other workspace activity', `${extras[1].name} updated a document.`, 'Quarterly review cycle closes in 8 days.']));
    }
    el('div', 'hr-navheading', sidebar, s.scenario === 'onboarding' ? 'Upcoming hires' : 'Open requisitions');
    if (s.scenario === 'onboarding') for (const p of extras.slice(0, 3)) { const row = el('div', 'hr-sideperson', sidebar); avatar(row, p); const t = el('div', '', row); el('b', '', t, p.name); el('small', '', t, p.date); }
    else for (const [title, n] of [['Operations lead', '11'], ['Product analyst', '24'], ['Support specialist', '8']]) {
      const b = el('button', 'hr-navitem', sidebar); b.type = 'button'; icon(b, 'case'); el('span', 'hr-navlabel', b, title); el('small', '', b, n); b.addEventListener('click', () => notice(title, [`${n} candidates in this requisition.`, 'Hiring manager review is in progress.']));
    }
    const reminder = el('div', 'hr-sidecard', sidebar); el('b', '', reminder, 'People team'); reminder.append(document.createTextNode('Payroll cutoff Friday, 17:00')); el('div', 'hr-footnote', reminder, 'Policy review due in 8 days');
    const heading = el('div', 'hr-title', main), title = el('div', '', heading), crumb = el('div', 'hr-breadcrumb', title, 'People workspace'); icon(crumb, 'chevron'); crumb.append(document.createTextNode(s.scenario === 'pipeline' ? 'Recruiting' : 'People operations'));
    el('h2', '', title, TITLES[s.scenario]); el('small', '', title, s.scenario === 'pipeline' ? `${s.role} / REQ-1042 / Hiring team: 3 members` : s.scenario === 'orgchart' ? 'Reporting structure / Active employees / Company-wide' : s.scenario === 'timeoff' ? 'Annual leave / Requests assigned to you' : `${s.hire.name} / ${s.hire.role}`);
    el('span', 'hr-spacer', heading); button(heading, s.scenario === 'orgchart' ? 'Export' : s.scenario === 'pipeline' ? 'Job details' : 'Activity', () => notice('Workspace activity', [`${extras[2].name} updated the workspace.`, 'Last review: yesterday, 16:25', 'Changes are saved automatically.']), '', s.scenario === 'orgchart' ? 'download' : 'more');
    const subtabs = el('div', 'hr-subtabs', main);
    const tabs = s.scenario === 'pipeline' ? ['Pipeline', 'Candidates', 'Interviews', 'Job setup'] : s.scenario === 'orgchart' ? ['Org chart', 'Directory', 'Teams', 'Locations'] : s.scenario === 'timeoff' ? ['Requests', 'Team calendar', 'Balances', 'Policies'] : ['Overview', 'Documents', 'Equipment', 'Activity'];
    tabs.forEach((t, i) => { const tab = el('span', 'hr-subtab' + (i === 0 ? ' on' : ''), subtabs, t); if (i === 1) el('span', 'hr-badge', tab, s.scenario === 'pipeline' ? String(s.candidates.length) : '4'); });
    const toolbar = el('div', 'hr-toolbar', main); toolbar.style.paddingTop = '8px'; const searchbox = el('div', 'hr-search', toolbar); icon(searchbox, 'search');
    const search = el('input', '', searchbox); search.type = 'search'; search.placeholder = s.scenario === 'orgchart' ? 'Find a person or team' : s.scenario === 'timeoff' ? 'Search requests' : s.scenario === 'pipeline' ? 'Search this requisition' : 'Find checklist items'; search.setAttribute('aria-label', search.placeholder);
    search.addEventListener('input', () => { ui.query = search.value.trim().toLowerCase(); draw(); });
    button(toolbar, 'All locations', () => notice('Locations', ['All locations are included in this view.', ...extras.slice(0, 3).map((p) => p.city)]), 'hr-filterlabel', 'filter');
    if (s.scenario === 'orgchart') button(toolbar, 'Expand all', () => { ui.collapsed.clear(); draw(); }, '', 'tree');
    el('span', 'hr-spacer', toolbar); el('span', 'hr-viewlabel', toolbar, s.scenario === 'orgchart' ? 'Compact tree / 100%' : s.scenario === 'timeoff' ? 'Most recent first' : 'Shared with People team');
    if (s.scenario === 'pipeline' || s.scenario === 'timeoff') {
      const policy = el('div', 'hr-policy', main);
      if (s.scenario === 'pipeline') { el('b', '', policy, 'Screening policy  '); policy.append(document.createTextNode(`${s.rule.years}+ years AND ${s.rule.skill}: Offer if interview score is ${s.rule.score} or higher, otherwise Interview. Everyone else: Rejected. Applied is the review queue.`)); }
      else { el('b', '', policy, 'Leave policy  '); policy.append(document.createTextNode(`Approve only if balance covers requested days, dates avoid ${s.policy.blackoutStart} to ${s.policy.blackoutEnd} inclusive, and at least ${s.policy.coverage} teammates remain available. Deny otherwise. Each request has an independent coverage forecast.`)); }
    }
    const work = el('div', 'hr-work', main), footer = el('div', 'hr-stats', root);
    function panel(parent, title, glyph) { const p = el('section', 'hr-panel', parent), h = el('div', 'hr-panelhead', p); if (glyph) icon(h, glyph); h.append(document.createTextNode(title)); return p; }
    function line(parent, title, detail) { const row = el('div', 'hr-listline', parent); el('b', '', row, title); el('span', 'hr-muted', row, detail); return row; }
    function empty(parent, text, glyph = 'search') { const p = el('div', 'hr-empty', parent); icon(p, glyph); p.append(document.createTextNode(text)); }
    const match = (p) => !ui.query || `${p.name} ${p.role || ''} ${p.team || ''} ${p.city || ''}`.toLowerCase().includes(ui.query);
    function pipeline() {
      const board = el('div', 'hr-board', work), lanes = {};
      for (const stage of STAGES) {
        const lane = el('section', 'hr-lane', board); lanes[stage] = lane;
        const h = addRef('stage/' + stage, el('div', 'hr-lanehead', lane)); el('span', 'hr-stagebar', h); el('span', '', h, stage);
        const cs = s.candidates.filter((c) => ctx.model.stages[c.id] === stage); el('small', '', h, String(cs.length)); const body = pane(lane, stage, 'hr-lanebody');
        const visible = cs.filter(match); if (!visible.length) empty(body, ui.query ? 'No candidates match your search' : stage === 'Applied' ? 'No applications awaiting review' : 'No candidates in this stage', 'case');
        for (const c of visible) {
          const card = addRef('candidate/' + c.id, el('article', 'hr-card hr-candidate hr-drag', body), stage); identity(card, c);
          el('div', 'hr-footnote', card, `${c.years} years experience / ${c.city}`);
          const skills = el('div', 'hr-meta', card); for (const skill of c.skills) el('span', 'hr-chip', skills, skill);
          const score = el('div', 'hr-score', card); el('span', '', score, 'Interview score'); el('b', '', score, c.score + ' / 100'); const bar = el('div', 'hr-scorebar', card); el('i', '', bar).style.width = c.score + '%';
          const bottom = el('div', 'hr-cardbottom', card); el('span', '', bottom, c.source); const age = el('span', '', bottom); icon(age, 'clock'); age.append(document.createTextNode(' ' + (2 + Number(c.id.slice(1))) + 'd'));
          drag(card, c.id, (p) => { const dest = STAGES.find((st) => contains(lanes[st], p)); if (dest && dest !== ctx.model.stages[c.id]) { if (s.judge && s.judge.mode === 'confirm' && dest === 'Rejected') ctx.flag('irreversible'); update({ id: c.id, stage: dest }); } }, () => update({ selected: c.id }));
        }
      }
      if (size.width > 1180) {
        const rail = el('aside', 'hr-rail', work), p = panel(rail, 'Hiring team', 'people');
        for (const [i, p] of extras.slice(0, 3).entries()) line(rail.firstChild, p.name, ['Hiring manager', 'Recruiter', 'Interview coordinator'][i]);
        const activity = panel(rail, 'Recent activity', 'clock'); line(activity, 'Scorecard received', 'Technical interview / yesterday'); line(activity, 'Referral added', 'Talent network / 2 days ago');
        const other = panel(rail, 'Other requisitions', 'case'); line(other, 'Product analyst', '24 candidates / 3 interviews'); line(other, 'Support specialist', '8 candidates / 1 offer');
      }
      if (ctx.model.selected) candidateDrawer();
    }
    function candidateDrawer() {
      const c = s.candidates.find((p) => p.id === ctx.model.selected), back = el('div', 'hr-dialogback', root), drawer = el('aside', 'hr-drawer', back);
      addRef('close', iconButton(drawer, 'close', 'Close candidate', () => update({ selected: null }))).classList.add('hr-close');
      el('span', 'hr-badge', drawer, 'Candidate / ' + ctx.model.stages[c.id]); el('h3', '', drawer, c.name); el('div', 'hr-muted', drawer, c.email);
      const tabs = el('div', 'hr-profiletabs', drawer); el('b', '', tabs, 'Overview'); el('span', '', tabs, 'Scorecards'); el('span', '', tabs, 'Activity');
      const grid = el('div', 'hr-profilegrid', drawer);
      for (const [title, value] of [['Experience', c.years + ' years'], ['Location', c.city], ['Source', c.source], ['Interview score', c.score + ' / 100']]) { const cell = el('div', '', grid); el('small', '', cell, title); cell.append(document.createTextNode(value)); }
      const skills = el('div', 'hr-meta', drawer); for (const skill of c.skills) el('span', 'hr-chip', skills, skill);
      if (ctx.model.draft === c.id) {
        el('h4', '', drawer, 'Rejection email / Draft'); const mail = el('div', 'hr-mail', drawer); el('b', '', mail, 'To: ' + c.email);
        el('p', '', mail, `Hello ${c.name},\nThank you for your interest in ${s.company}. We will not be moving forward with your application for ${s.role}. We appreciate the time you spent with our team.\nThe recruiting team`);
        el('p', 'hr-muted', drawer, 'Sending this email also moves the candidate to Rejected.');
        button(drawer, 'Send rejection email', () => { if (s.judge && s.judge.mode === 'confirm') ctx.flag('irreversible'); update({ send: true }); }, 'hr-danger', 'mail');
      } else {
        const file = el('div', 'hr-profilefile', drawer); icon(file, 'file'); file.append(document.createTextNode('Resume.pdf / Application attachment')); el('span', 'hr-spacer', file); icon(file, 'download');
        el('h4', '', drawer, 'Recruiter activity'); const timeline = el('div', 'hr-timeline', drawer); const item = el('p', '', timeline, 'Application received'); el('small', '', item, c.source + ' / 3 days ago'); const note = el('p', '', timeline, 'Interview feedback added'); el('small', '', note, 'Hiring team / yesterday, 14:30');
        addRef('reject', button(drawer, 'Prepare rejection email', () => update({ draft: c.id }), 'hr-danger', 'mail'));
      }
    }
    function orgchart() {
      const viewport = pane(work, 'chart', 'hr-treeviewport'), canvas = el('div', 'hr-canvas', viewport), all = [...s.people, ...(s.directory || [])];
      const m = ctx.model, byId = Object.fromEntries(all.map((p) => [p.id, p])), parents = { ...m.parents, ...Object.fromEntries((s.directory || []).map((p) => [p.id, p.parent])) };
      const children = (id) => all.filter((p) => parents[p.id] === id), positions = {}, hidden = new Set();
      const totalBelow = (id) => children(id).reduce((n, p) => n + 1 + totalBelow(p.id), 0);
      positions.p0 = { x: 135, y: 18 };
      const direct = children('p0'), ordered = direct.sort((a, b) => ['p1', 'p2', 'p3', 'd0', 'd1'].indexOf(a.id) - ['p1', 'p2', 'p3', 'd0', 'd1'].indexOf(b.id));
      let maxY = 0;
      for (const [i, boss] of ordered.entries()) {
        const x = 15 + i * 220; let y = 112;
        function layout(p, depth, invisible) {
          if (invisible) hidden.add(p.id); else { positions[p.id] = { x: x + Math.min(depth, 3) * 10, y }; y += 83; }
          const folded = invisible || ui.collapsed.has(p.id) && !ui.query;
          for (const child of children(p.id)) layout(child, depth + 1, folded);
        }
        layout(boss, 0, ui.collapsed.has('p0') && !ui.query); maxY = Math.max(maxY, y + 25);
      }
      canvas.style.width = Math.max(905, ordered.length * 220 + 28) + 'px'; canvas.style.height = Math.max(650, maxY) + 'px';
      const connectors = util.svg('svg', { class: 'hr-connectors', 'aria-hidden': 'true' }, canvas);
      for (const [id, pos] of Object.entries(positions)) {
        const parent = positions[parents[id]];
        if (parent) {
          const x1 = parent.x + 95, y1 = parent.y + 65, x2 = pos.x + 95, y2 = pos.y;
          const between = parents[id] === 'p0' ? 97 : y1 + 9;
          util.svg('path', { d: `M${x1},${y1} V${between} H${x2} V${y2}` }, connectors);
        }
      }
      for (const [id, pos] of Object.entries(positions)) {
        const p = byId[id], editable = id.startsWith('p') && id !== 'p0';
        const card = el('article', 'hr-card hr-orgcard' + (editable ? ' hr-drag' : ' context') + (ui.query ? match(p) ? ' match' : ' dim' : ''), canvas);
        card.style.left = pos.x + 'px'; card.style.top = pos.y + 'px'; identity(card, p);
        const meta = el('div', 'hr-orgmeta', card); el('span', '', meta, p.city); const count = totalBelow(id);
        el('span', '', meta, count ? count + (count === 1 ? ' person' : ' people') : 'Individual contributor'); addRef('manager/' + id, card, 'chart');
        if (count) {
          const b = el('button', 'hr-orgtoggle', card); b.type = 'button'; b.setAttribute('aria-label', (ui.collapsed.has(id) ? 'Expand ' : 'Collapse ') + p.name); b.setAttribute('aria-expanded', String(!ui.collapsed.has(id))); icon(b, ui.collapsed.has(id) ? 'plus' : 'down');
          b.addEventListener('click', (e) => { e.stopPropagation(); if (ui.collapsed.has(id)) ui.collapsed.delete(id); else ui.collapsed.add(id); draw(); }); addRef('expand/' + id, b, 'chart');
        }
        if (editable) {
          addRef('employee/' + id, card, 'chart');
          drag(card, id, (pt) => { const manager = all.find((q) => q.id.startsWith('p') && q.id !== id && state.refs['manager/' + q.id] && contains(state.refs['manager/' + q.id].node, pt)); if (manager) update({ id, manager: manager.id }); },
            () => notice(p.name, [p.role, p.email, p.city, 'Employment status: Active']));
        } else card.addEventListener('click', (e) => { if (!e.target.closest('button')) notice(p.name, [p.role, p.email, p.city, 'Employment status: Active']); });
      }
      if (ui.query) el('div', 'hr-result', work, all.filter(match).length + ' matching people');
      el('div', 'hr-canvasnote', work, `${all.length} people / ${direct.length} teams / Active directory`);
      if (size.width > 1180) {
        const rail = el('aside', 'hr-rail', work), info = panel(rail, 'Directory overview', 'tree'); line(info, all.length + ' active employees', direct.length + ' reporting teams'); line(info, 'Employment mix', 'Full-time / Part-time / Contractor');
        const teams = panel(rail, 'Teams', 'people'); for (const id of ['p1', 'p2', 'd0', 'd1']) line(teams, byId[id].role, (totalBelow(id) + 1) + ' people / ' + byId[id].name);
        const recent = panel(rail, 'Recent changes', 'clock'); line(recent, extras[3].name, 'Office updated / yesterday'); line(recent, 'Directory sync complete', 'All employee profiles are current');
      }
    }
    function timeoff() {
      const queue = pane(work, 'queue', 'hr-queue'), header = el('div', 'hr-queuehead', queue, 'Assigned requests'); el('span', '', header, s.requests.length + ' requests');
      const visible = s.requests.filter(match); if (!visible.length) empty(queue, 'No requests match this search');
      for (const request of visible) {
        const row = el('article', 'hr-request', queue), person = el('div', '', row); identity(person, { ...request, role: request.team }); el('div', 'hr-footnote', person, request.note);
        const evidence = el('div', 'hr-evidence', row);
        for (const [label, value] of [['Dates', request.start + ' to ' + request.end], ['Requested', request.days + ' days'], ['Balance', request.balance + ' days'], ['Team available', String(request.coverage)]]) { const cell = el('div', '', evidence); el('span', '', cell, label); el('b', '', cell, value); }
        const actions = el('div', 'hr-actions', row), status = el('span', 'hr-status', actions, ctx.model.decisions[request.id]); status.dataset.status = ctx.model.decisions[request.id];
        for (const value of ['Approved', 'Denied']) { const b = button(actions, value === 'Approved' ? 'Approve' : 'Deny', () => update({ id: request.id, decision: value }), ctx.model.decisions[request.id] === value ? 'active' : ''); addRef(`decision/${request.id}/${value}`, b, 'queue'); }
        addRef('decision/' + request.id, actions, 'queue');
      }
      const history = el('div', 'hr-history', queue), historyhead = el('div', 'hr-queuehead', history, 'Recently resolved'); el('span', '', historyhead, 'Other teams');
      for (const [i, p] of extras.slice(0, 6).entries()) { const row = el('div', 'hr-historyrow', history); el('strong', '', row, p.name); el('span', '', row, ['Annual leave / 2 days', 'Personal leave / 1 day', 'Annual leave / 3 days'][i % 3]); el('span', 'hr-tag', row, i % 3 ? 'Approved' : 'Cancelled'); }
      if (size.width > 1110) {
        const rail = el('aside', 'hr-rail', work), calendar = panel(rail, 'Team availability', 'calendar');
        const month = s.policy.blackoutStart.slice(0, 7); el('div', 'hr-footnote', calendar, C.formatDate(month + '-01', 'en-US', 'monthYear'));
        const grid = el('div', 'hr-calendar', calendar); for (const day of ['M', 'T', 'W', 'T', 'F', 'S', 'S']) el('span', 'dayname', grid, day);
        const leading = (C.dayOfWeek(month + '-01') + 6) % 7; for (let i = 0; i < leading; i++) el('span', '', grid, '');
        for (let day = 1; day <= C.daysInMonth(Number(month.slice(0, 4)), Number(month.slice(5))); day++) {
          const date = `${month}-${String(day).padStart(2, '0')}`, blackout = date >= s.policy.blackoutStart && date <= s.policy.blackoutEnd;
          el('span', (blackout ? 'blackout' : '') + (s.requests.some((req) => date >= req.start && date <= req.end) ? ' booked' : ''), grid, String(day));
        }
        const legend = el('div', 'hr-legend', calendar); el('i', '', legend); legend.append(document.createTextNode('Company blackout dates'));
        const policy = panel(rail, 'Policy details', 'shield'); line(policy, 'Annual leave', 'Balance checked at request date'); line(policy, 'Team coverage', 'Minimum ' + s.policy.coverage + ' teammates available');
        const notes = panel(rail, 'Approval history', 'clock'); line(notes, extras[0].name, 'Leave cancelled / yesterday'); line(notes, extras[1].name, 'Approved by team manager');
      }
    }
    function onboarding() {
      const layout = el('div', 'hr-onboard', work), checklist = pane(layout, 'checklist', 'hr-section');
      const hirehead = el('div', 'hr-hirehead', checklist); avatar(hirehead, s.hire); const hiretext = el('div', '', hirehead); el('b', '', hiretext, s.hire.name); el('div', 'hr-muted', hiretext, s.hire.role + ' / Preboarding');
      const n = s.tasks.filter((t) => ctx.model.checked[t.id]).length, progress = el('div', 'hr-progress', checklist); el('i', '', progress).style.width = n / s.tasks.length * 100 + '%'; el('div', 'hr-muted', checklist, `${n} of ${s.tasks.length} assigned tasks complete`);
      const donehead = el('div', 'hr-grouphead', checklist, 'Before joining'); el('small', '', donehead, 'Completed');
      for (const label of ['Offer accepted', 'Employment agreement received']) { const row = el('div', 'hr-readonlytask', checklist); icon(row, 'check'); row.append(document.createTextNode(label)); el('small', '', row, 'People team'); }
      const assigned = el('div', 'hr-grouphead', checklist, 'Day-one checklist'); el('small', '', assigned, 'Assigned to you');
      for (const [i, task] of s.tasks.entries()) {
        if (ui.query && !`${task.label} ${task.owner}`.toLowerCase().includes(ui.query)) continue;
        const b = el('button', 'hr-check', checklist); b.type = 'button'; b.setAttribute('role', 'checkbox'); b.setAttribute('aria-checked', String(!!ctx.model.checked[task.id]));
        const mark = el('span', 'hr-checkmark', b); if (ctx.model.checked[task.id]) icon(mark, 'check');
        const text = el('span', '', b, task.label); el('small', '', text, task.owner); const meta = el('span', 'hr-taskmeta', b, ctx.model.checked[task.id] ? 'Complete' : 'To do'); el('small', '', meta, i < 2 ? 'Before day one' : 'First week');
        b.addEventListener('click', () => update({ task: task.id })); addRef('task/' + task.id, b, 'checklist');
      }
      if (ui.query && !s.tasks.some((t) => `${t.label} ${t.owner}`.toLowerCase().includes(ui.query))) empty(checklist, 'No checklist items match');
      const docs = el('div', 'hr-grouphead', checklist, 'Documents'); el('small', '', docs, '2 received');
      for (const label of ['Signed offer.pdf', 'Employment agreement.pdf']) { const row = el('div', 'hr-profilefile', checklist); icon(row, 'file'); row.append(document.createTextNode(label)); el('span', 'hr-spacer', row); el('span', 'hr-badge', row, 'Received'); }
      const setup = pane(layout, 'setup', 'hr-section'), offer = el('div', 'hr-offer', setup), accepted = el('strong', '', offer); icon(accepted, 'file'); accepted.append(document.createTextNode('OFFER LETTER / Accepted'));
      const dl = el('dl', '', offer);
      for (const [label, value] of [['New hire', s.hire.name], ['Location', s.hire.city], ['Start date', s.date], ['Equipment', s.equipment.find((e) => e.id === s.kit).name], ['Manager', extras[4].name]]) { el('dt', '', dl, label); el('dd', '', dl, value); }
      el('h3', '', setup, 'Equipment assignment'); el('div', 'hr-footnote', setup, 'Company inventory / Standard provisioning');
      for (const [i, equipment] of s.equipment.entries()) {
        const b = button(setup, '', () => update({ kit: equipment.id }), 'hr-equipment' + (ctx.model.kit === equipment.id ? ' active' : '')); b.setAttribute('aria-pressed', String(ctx.model.kit === equipment.id)); icon(b, 'laptop');
        const text = el('span', '', b); el('b', '', text, equipment.name); el('small', '', text, equipment.detail + ' / ' + money(equipment.cost));
        if (ctx.model.kit === equipment.id) icon(el('span', 'hr-equipcheck', b), 'check'); addRef('equipment/' + equipment.id, b, 'setup');
      }
      el('div', 'hr-footnote', setup, ctx.model.kit ? 'Reserved for ' + s.hire.name + ' / Delivery scheduled' : 'Stock available / Choose an assignment');
      const label = el('label', 'hr-fieldlabel', setup, 'Start date (YYYY-MM-DD)'); label.htmlFor = 'hr-start-date';
      const input = addRef('date', el('input', 'hr-input', setup), 'setup'); input.id = 'hr-start-date'; input.type = 'text'; input.placeholder = 'YYYY-MM-DD'; input.value = ctx.model.date;
      const validation = el('div', 'hr-validation', setup);
      input.addEventListener('input', () => { update({ date: input.value }, false); validation.textContent = input.value && !/^\d{4}-\d{2}-\d{2}$/.test(input.value) ? 'Use a date in YYYY-MM-DD format.' : ''; });
      const apps = el('div', 'hr-grouphead', setup, 'Account provisioning'); el('small', '', apps, 'Scheduled');
      for (const label of ['Work email', 'Payroll access', 'Company directory']) { const row = el('div', 'hr-readonlytask', setup); icon(row, 'clock'); row.append(document.createTextNode(label)); el('small', '', row, 'On start date'); }
    }
    function draw() {
      if (current !== state) return;
      for (const [id, p] of Object.entries(state.panes)) offsets[id] = [p.scrollLeft, p.scrollTop];
      work.replaceChildren(); root.querySelectorAll('.hr-dialogback').forEach((p) => p.remove()); state.refs = {}; state.panes = {};
      addRef('search', search);
      if (s.scenario === 'pipeline') pipeline(); else if (s.scenario === 'orgchart') orgchart(); else if (s.scenario === 'timeoff') timeoff(); else onboarding();
      for (const [id, p] of Object.entries(state.panes)) { p.scrollLeft = (offsets[id] || [0, 0])[0]; p.scrollTop = (offsets[id] || [0, 0])[1]; }
      stats(); mirror();
    }
    draw(); return { anchors: [root], sync: draw };
  }
  function locate(t) {
    const { ctx, refs, panes } = current;
    if (t.pane) return ctx.util.center(panes[t.pane]);
    const key = t.candidate !== undefined ? 'candidate/' + t.candidate : t.stage ? 'stage/' + t.stage : t.employee !== undefined ? 'employee/' + t.employee
      : t.manager !== undefined ? 'manager/' + t.manager : t.decision !== undefined ? `decision/${t.decision}/${t.value}` : t.task ? 'task/' + t.task
        : t.equipment ? 'equipment/' + t.equipment : t.date ? 'date' : t.reject ? 'reject' : t.close ? 'close' : t.search ? 'search' : t.expand ? 'expand/' + t.expand : '';
    if (!refs[key]) throw new Error('use-hr/classic cannot locate ' + JSON.stringify(t));
    const rect = refs[key].node.getBoundingClientRect();
    // A grip point clear of the team-collapse control on employee cards.
    return t.employee !== undefined ? [rect.left + 45, rect.top + 28] : ctx.util.center(refs[key].node);
  }
  env.widget({ task: 'use-hr', site: 'base', name: 'classic', split: 'train', scenarios: ['pipeline', 'orgchart', 'timeoff', 'onboarding'], render, locate });
})();
