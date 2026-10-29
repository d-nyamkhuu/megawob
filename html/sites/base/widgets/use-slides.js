/* use-slides/classic: Lattice Office, a deck editor and document review workspace.
 * Uses reference tokens, native text selection, scrolling panes and thumbnail drag.
 * All target lookup is read-only; pane geometry is mirrored on render/scroll.
 */
(function () {
  'use strict';
  let live;
  const ICONS = {
    chevron: '<path d="m6 9 6 6 6-6"/>', grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    undo: '<path d="M8 4 3 9l5 5M4 9h10a6 6 0 0 1 0 12"/>', redo: '<path d="m16 4 5 5-5 5m4-5H10a6 6 0 0 0 0 12"/>',
    print: '<path d="M6 8V3h12v5M6 17H3V9h18v8h-3M6 14h12v7H6z"/>', paint: '<path d="M3 3h13v7H3zM16 6h5v7H10v8H7v-8"/>',
    search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>', select: '<path d="m5 3 13 9-7 1-3 7z"/>',
    top: '<path d="M3 4h18M7 8v12h4V8zm8 0v8h4V8z"/>', middle: '<path d="M2 12h20M6 5h4v14H6zm8 3h4v8h-4z"/>', bottom: '<path d="M3 21h18M7 4v13h4V4zm8 5v8h4V9z"/>',
    distribute: '<path d="M3 3v18M21 3v18M7 7h3v10H7zm7 0h3v10h-3z"/>',
    plus: '<path d="M12 4v16M4 12h16"/>', comment: '<path d="M3 3h18v14H9l-6 4zM7 8h10M7 12h7"/>',
    check: '<path d="m4 12 5 5L20 6"/>', close: '<path d="m5 5 14 14M5 19 19 5"/>',
    folder: '<path d="M3 6h7l2 3h9v12H3zM3 6V3h7l2 3h7v3"/>', document: '<path d="M5 2h10l4 4v16H5zM14 2v5h5M8 11h8M8 15h8M8 19h5"/>',
    slides: '<rect x="3" y="4" width="18" height="13" rx="1"/><path d="M12 17v5m-5 0 5-5 5 5M7 9h10M7 12h6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>', bell: '<path d="M5 16V9a7 7 0 0 1 14 0v7l2 2H3zM9 21h6"/>',
    share: '<circle cx="5" cy="12" r="3"/><circle cx="19" cy="5" r="3"/><circle cx="19" cy="19" r="3"/><path d="m8 10 8-4M8 14l8 4"/>',
    lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4"/>', present: '<path d="M3 3h18v14H3zM12 17v5M8 22l4-5 4 5m-6-15 5 3-5 3z"/>',
    layout: '<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 8h18M10 8v13"/>', theme: '<path d="m12 2 9 10-9 10L3 12zM12 2v20M3 12h18"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    link: '<path d="m10 7 4-4a5 5 0 0 1 7 7l-4 4M14 17l-4 4a5 5 0 0 1-7-7l4-4m1 6 8-8"/>',
    edit: '<path d="m4 16 13-13 4 4L8 20l-5 1zM14 6l4 4"/>', eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    next: '<path d="M4 12h16m-6-6 6 6-6 6"/>', text: '<path d="M4 5h16M12 5v15M8 20h8"/>', bold: '<path d="M7 3h6a5 5 0 0 1 0 9H7zm0 9h7a5 5 0 0 1 0 9H7z"/>',
    italic: '<path d="M10 3h10M4 21h10M15 3 9 21"/>', send: '<path d="m2 3 20 9-20 9 4-9zm4 9h16"/>',
    trash: '<path d="M3 6h18M9 3h6M6 6l1 15h10l1-15M10 10v7M14 10v7"/>', notes: '<path d="M4 3h16v18H4zM8 7h8M8 11h8M8 15h5"/>',
    left: '<path d="m14 5-7 7 7 7"/>', right: '<path d="m10 5 7 7-7 7"/>', list: '<path d="M9 5h12M9 12h12M9 19h12M3 5h1M3 12h1M3 19h1"/>',
  };
  const CSS = `
    .as-app{display:flex;flex-direction:column;overflow:hidden;border:1px solid var(--line);border-radius:9px;background:var(--panel);color:var(--fg);font:12px/1.4 system-ui;box-shadow:0 8px 26px #0001}
    .as-app *{box-sizing:border-box}.as-app button,.as-app input,.as-app textarea{font:inherit;color:inherit}
    .as-head{height:44px;flex:none;display:flex;align-items:center;gap:10px;padding:6px 14px;border-bottom:1px solid var(--line)}
    .as-logo{background:var(--accent);color:white;font-weight:800;font-size:19px;width:30px;height:30px;border-radius:7px;display:grid;place-items:center}
    .as-name{min-width:0;flex:1}.as-title{font-size:13px;font-weight:650;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.as-sub{font-size:10px;color:var(--muted)}
    .as-avatar{width:26px;height:26px;display:grid;place-items:center;background:color-mix(in srgb,var(--accent) 15%,var(--panel));border-radius:50%;color:var(--accent);font-weight:700}
    .as-pill{border:1px solid var(--line);border-radius:5px;padding:4px 10px;color:var(--muted)}
    .as-menu{display:flex;gap:16px;align-items:center;height:26px;padding:0 14px;border-bottom:1px solid var(--line);flex:none;color:var(--muted)}
    .as-menu b{color:var(--accent);border-bottom:2px solid var(--accent);height:26px;padding-top:4px}
    .as-tools{display:flex;align-items:center;gap:5px;flex-wrap:wrap;padding:7px 10px;border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--fg) 2%,var(--panel));flex:none;min-height:43px}
    .as-tool{border:1px solid transparent;background:transparent;border-radius:4px;min-height:28px;padding:4px 7px;cursor:pointer;white-space:nowrap}
    .as-tool:hover{background:color-mix(in srgb,var(--accent) 10%,var(--panel));border-color:var(--line)}
    .as-tool[aria-pressed=true]{background:color-mix(in srgb,var(--accent) 16%,var(--panel));border-color:var(--accent)}
    .as-tool:disabled{opacity:.4;cursor:default}.as-sep{height:21px;width:1px;background:var(--line);margin:0 3px}
    .as-size{width:43px;height:28px;border:1px solid var(--line);border-radius:4px;background:var(--panel);text-align:center}
    .as-color{width:25px;height:25px;padding:3px;border:1px solid var(--line);border-radius:50%;cursor:pointer;background:var(--panel)}
    .as-color i{display:block;width:100%;height:100%;border-radius:50%}.as-color[aria-pressed=true]{outline:2px solid var(--accent);outline-offset:1px}
    .as-main{flex:1;min-height:0;display:flex;overflow:hidden}.as-rail{flex:none;width:144px;background:var(--bg);border-right:1px solid var(--line);display:flex;flex-direction:column;min-height:0}
    .as-cap{height:29px;flex:none;display:flex;align-items:center;justify-content:space-between;padding:0 10px;color:var(--muted);font-size:10px;font-weight:650;text-transform:uppercase;letter-spacing:.04em;border-bottom:1px solid var(--line)}
    .as-scroll{overflow:auto;min-height:0;flex:1;overscroll-behavior:contain;scrollbar-width:thin;position:relative}
    .as-thumbs{position:relative;margin:6px 7px}.as-thumb{position:absolute;left:0;width:100%;height:61px;background:var(--panel);border:1px solid var(--line);border-radius:4px;cursor:grab;padding:6px 7px 5px 20px;overflow:hidden;touch-action:none}
    .as-thumb.active{border:2px solid var(--accent)}.as-thumb.dragging{z-index:10;opacity:.85;box-shadow:0 6px 12px #0003}.as-num{position:absolute;left:5px;top:7px;font-size:9px;color:var(--muted)}
    .as-thumb strong{font-size:9px;display:block}.as-thumb small{font-size:7px;color:var(--muted);display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.as-mini{display:flex;gap:3px;margin-top:8px}.as-mini i{height:12px;width:24%;border-radius:2px;background:color-mix(in srgb,var(--accent) 22%,var(--panel));border-bottom:2px solid var(--accent)}
    .as-editor{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column;background:var(--bg)}
    .as-work{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:14px;overflow:hidden;position:relative}
    .as-slidewrap{position:relative;flex:none;box-shadow:0 3px 12px #0002}.as-canvas{width:720px;height:400px;position:absolute;top:0;left:0;transform-origin:top left;background:var(--panel);overflow:hidden}
    .as-slidehead{position:absolute;left:40px;top:28px;font-weight:700;font-size:27px;letter-spacing:-.03em}.as-slidesub{position:absolute;left:42px;top:67px;font-size:12px;color:var(--muted)}
    .as-shape{position:absolute;width:110px;height:48px;display:flex;align-items:center;justify-content:center;cursor:move;border:1px solid color-mix(in srgb,var(--accent) 40%,var(--line));border-radius:5px;background:color-mix(in srgb,var(--accent) 8%,var(--panel));white-space:nowrap;touch-action:none}
    .as-shape.selected{outline:2px solid var(--accent);outline-offset:3px}.as-shape.selected:after{content:'';position:absolute;inset:-7px;background:linear-gradient(var(--accent),var(--accent)) left top/6px 6px no-repeat,linear-gradient(var(--accent),var(--accent)) right bottom/6px 6px no-repeat;pointer-events:none}
    .as-guide{position:absolute;pointer-events:none;border-top:1px dashed #d548a5;left:0;right:0;display:none;z-index:5}.as-guide.on{display:block}
    .as-notes{height:34px;flex:none;padding:8px 14px;border-top:1px solid var(--line);font-size:11px;color:var(--muted);background:var(--panel)}
    .as-status{display:flex;gap:14px;align-items:center;padding:5px 12px;height:28px;border-top:1px solid var(--line);flex:none;color:var(--muted);font-size:10px;white-space:nowrap}.as-status .as-owner{margin-left:auto;max-width:45%;overflow:hidden;text-overflow:ellipsis}
    .as-inspector{width:152px;flex:none;border-left:1px solid var(--line);background:var(--panel);padding:12px;font-size:11px;overflow:auto}.as-inspector h4{margin:0 0 14px;font-size:12px}.as-inspector p{margin:8px 0;color:var(--muted)}
    .as-inspector dl{display:grid;grid-template-columns:1fr auto;gap:7px}.as-inspector dt{color:var(--muted)}.as-inspector dd{margin:0}.as-inspector hr{border:0;border-top:1px solid var(--line);margin:14px 0}
    .as-doc{padding:22px 26px;max-width:650px;margin:18px auto;background:var(--panel);border:1px solid var(--line);min-height:100%;box-shadow:0 2px 6px #0001;font:13px/1.85 Georgia,serif;color:var(--fg);user-select:text;-webkit-user-select:text}
    .as-doc h2{font:650 22px/1.2 system-ui;margin:4px 0 7px}.as-docmeta{font:10px system-ui;color:var(--muted);margin-bottom:22px;user-select:none}.as-doc p{margin:0 0 20px}.as-doctext::selection,.as-doctext *::selection{background:color-mix(in srgb,var(--accent) 30%,transparent)}
    .as-review{width:224px;flex:none;border-left:1px solid var(--line);display:flex;flex-direction:column;background:var(--panel);min-height:0}
    .as-card{margin:9px;padding:12px;border:1px solid var(--line);border-radius:6px;background:var(--panel);font-size:11px;overflow-wrap:anywhere}.as-cardhead{font-weight:650;display:flex;align-items:center;justify-content:space-between;gap:6px}.as-time{color:var(--muted);font-size:10px;margin:3px 0 8px}.as-quote{border-left:2px solid var(--accent);padding-left:8px;color:var(--muted);margin:7px 0}
    .as-card p{margin:6px 0}.as-card button{font-size:11px}.as-card textarea{width:100%;height:76px;resize:none;border:1px solid var(--line);border-radius:4px;background:var(--panel);padding:7px;user-select:text}
    .as-actions{display:flex;gap:5px;margin-top:9px}.as-primary{background:var(--accent);color:white!important;border:0;border-radius:4px;padding:6px 11px;cursor:pointer}
    .as-del{color:#b9424c;text-decoration:line-through;background:color-mix(in srgb,#b9424c 10%,var(--panel))}.as-ins{color:#258468;text-decoration:underline;background:color-mix(in srgb,#258468 10%,var(--panel))}
    [data-theme=dark] .as-del{color:#f6949f}[data-theme=dark] .as-ins{color:#67c9af}
    .as-change{min-height:152px}.as-resolution{font-weight:600;color:var(--accent);margin:5px 0}.as-app.compact .as-rail{width:112px}.as-app.compact .as-review{width:202px}.as-app.compact .as-doc{padding:16px;margin:10px}.as-app.compact .as-menu{gap:11px}
    .as-app{border-radius:6px;font-size:12px}.as-ico{width:16px;height:16px;flex:none;vertical-align:middle;pointer-events:none;fill:none;stroke:currentColor;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round}
    .as-tool,.as-pill{display:inline-flex;align-items:center;justify-content:center;gap:6px}.as-app [hidden]{display:none!important}.as-head{height:46px}.as-logo{width:29px;height:31px;border-radius:5px}.as-head-actions{display:flex;align-items:center;gap:6px;flex:none}.as-head-actions .as-tool{padding:5px}.as-share{background:var(--accent);color:white!important}
    .as-presence{display:flex;margin-right:5px}.as-presence .as-avatar{border:2px solid var(--panel);margin-left:-5px;font-size:10px;background:color-mix(in srgb,var(--accent) 12%,var(--panel))}.as-dot{display:inline-block;width:5px;height:5px;border-radius:50%;background:#2ba67c;margin:0 5px 1px 0}
    .as-filetabs{height:26px;flex:none;display:flex;align-items:stretch;background:var(--bg);border-bottom:1px solid var(--line);gap:1px;padding-left:10px;overflow:hidden}.as-filetab{display:flex;align-items:center;gap:6px;padding:0 12px;color:var(--muted);font-size:10px;border-right:1px solid var(--line);white-space:nowrap}.as-filetab.active{background:var(--panel);color:var(--fg);border-top:2px solid var(--accent)}.as-filetab .as-ico{width:12px;height:12px}.as-filetab button{padding:0;border:0;background:none}
    .as-menu{height:25px;padding-left:12px;gap:18px}.as-menu b{height:25px}.as-quick{height:31px;display:flex;align-items:center;gap:4px;padding:2px 10px;border-bottom:1px solid var(--line);flex:none;background:color-mix(in srgb,var(--fg) 2%,var(--panel))}.as-quick .as-tool{min-height:25px;padding:3px 6px}.as-fontname{width:98px;justify-content:space-between}.as-tools{min-height:37px;padding:4px 9px;gap:3px;flex-wrap:nowrap;overflow:hidden}.as-tools .as-tool{font-size:11px;min-height:27px;padding:3px 5px}.as-tools .as-sub{white-space:nowrap}.as-group-caption{margin-left:auto;color:var(--muted);font-size:10px}.as-tool small{font-size:10px;color:var(--muted)}
    .as-projects{width:140px;flex:none;border-right:1px solid var(--line);padding:9px 7px;background:color-mix(in srgb,var(--fg) 2%,var(--panel));overflow:auto;scrollbar-width:thin}.as-projects h5{font-size:9px;letter-spacing:.07em;color:var(--muted);margin:14px 5px 7px;text-transform:uppercase}.as-projects .as-tool{display:flex;width:100%;justify-content:flex-start;text-align:left;font-size:10px;padding:7px 6px;gap:7px}.as-projects .as-tool span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.as-projects .as-tool.current{background:color-mix(in srgb,var(--accent) 12%,var(--panel));color:var(--accent)}.as-projects .as-ico{width:15px;height:15px}.as-projects small{display:block;font-size:9px;color:var(--muted);padding-left:27px;margin-top:-4px}.as-projects.narrow{width:38px;padding:8px 2px}.as-projects.narrow h5,.as-projects.narrow small,.as-projects.narrow .as-tool span{display:none}.as-projects.narrow .as-tool{justify-content:center;padding:8px 3px}
    .as-rail{width:154px}.as-cap{height:28px;font-size:9px;letter-spacing:.02em}.as-cap .as-ico{width:13px;height:13px}.as-thumb{padding:0 0 0 16px;border:0;background:none;height:61px;overflow:visible}.as-thumb.active{border:0}.as-num{left:0;top:3px}.as-preview{position:absolute;left:16px;right:0;top:0;height:59px;border:1px solid var(--line);border-radius:2px;background:var(--panel);overflow:hidden}.as-thumb.active .as-preview{outline:2px solid var(--accent);outline-offset:1px}.as-preview svg{display:block;width:100%;height:100%;color:var(--fg)}.as-thumb strong,.as-thumb small{display:none}
    .as-ruler{height:17px;flex:none;background:color-mix(in srgb,var(--fg) 2%,var(--panel));border-bottom:1px solid var(--line);font-size:8px;color:var(--muted);display:flex;justify-content:space-around;align-items:center;padding:0 22px;background-image:repeating-linear-gradient(90deg,transparent 0 19px,var(--line) 19px 20px)}.as-work{padding:12px}.as-canvas{background:var(--panel);border-top:5px solid var(--accent)}.as-slidehead{top:28px;font-size:28px}.as-slidesub{top:69px}.as-slidefoot{position:absolute;left:40px;right:40px;bottom:15px;display:flex;justify-content:space-between;color:var(--muted);font-size:8px;border-top:1px solid var(--line);padding-top:7px;pointer-events:none}.as-slidefoot.align-footer{bottom:66px}.as-slideeyebrow{position:absolute;right:38px;top:35px;color:var(--muted);font-size:9px;letter-spacing:1px}.as-notes{height:30px;display:flex;align-items:center;gap:8px;padding:5px 12px}.as-status{height:25px;gap:10px;padding:3px 10px}.as-status .as-ico{width:12px;height:12px}.as-status-tail{margin-left:auto;display:flex;align-items:center;gap:8px}.as-status .as-owner{margin-left:0;max-width:none}.as-zoomtrack{width:65px;height:3px;background:var(--line);position:relative}.as-zoomtrack:after{content:'';position:absolute;left:32px;top:-3px;width:7px;height:9px;border-radius:2px;background:var(--muted)}
    .as-inspector{width:182px;padding:0;display:flex;flex-direction:column;overflow:hidden}.as-inspector-body{padding:12px;overflow:auto;scrollbar-width:thin;flex:1;min-height:0}.as-inspector h4{padding:10px 12px;margin:0;border-bottom:1px solid var(--line)}.as-inspector p{display:flex;align-items:center;justify-content:space-between;font-weight:600;color:var(--fg);font-size:10px}.as-inspector dl{gap:6px;font-size:10px}.as-inspector dd{background:var(--bg);border:1px solid var(--line);min-width:45px;padding:2px 5px;border-radius:3px}.as-inspector .as-layer{display:flex;gap:7px;align-items:center;padding:7px;border:1px solid var(--line);margin-top:5px;font-size:10px;cursor:pointer}.as-inspector .as-layer.active{border-color:var(--accent);color:var(--accent)}.as-inspector .as-layer .as-ico{width:12px;height:12px}
    .as-outline{width:142px;flex:none;padding:0 10px;background:var(--panel);border-right:1px solid var(--line);font-size:10px;overflow:auto}.as-outline h4{font-size:11px;margin:13px 0}.as-outline p{padding:7px 0;color:var(--muted);border-bottom:1px solid var(--line)}.as-outline .active{color:var(--accent);font-weight:600}.as-doc{max-width:650px;margin:16px auto;padding:24px 34px;font:13px/1.8 Georgia,serif;min-height:760px}.as-dochead{display:flex;justify-content:space-between;font:8px system-ui;color:var(--muted);border-bottom:1px solid var(--line);padding-bottom:9px;margin-bottom:24px;letter-spacing:.08em}.as-doc h3{font:600 13px system-ui;margin:20px 0 9px}.as-doc p{margin-bottom:16px}.as-docfooter{margin-top:35px;border-top:1px solid var(--line);padding-top:10px;color:var(--muted);font:9px system-ui;display:flex;justify-content:space-between}.as-revisionline{padding:7px 10px;border-left:2px solid color-mix(in srgb,var(--accent) 65%,transparent);background:color-mix(in srgb,var(--accent) 3%,var(--panel));position:relative}.as-revisionline:after{content:attr(data-reviewer);position:absolute;right:0;top:-13px;font:8px system-ui;color:var(--muted)}
    .as-review{width:250px}.as-reviewfilters{display:flex;align-items:center;gap:5px;padding:7px 9px;border-bottom:1px solid var(--line);font-size:10px;flex:none}.as-reviewfilters .as-pill{font-size:9px;padding:3px 6px;background:var(--bg)}.as-reviewfilters .as-ico{width:12px;height:12px}.as-card{margin:8px;border-radius:5px;padding:10px;font-size:11px}.as-cardhead{justify-content:flex-start;gap:6px;font-size:10px}.as-cardhead .as-avatar{width:22px;height:22px;font-size:9px}.as-cardhead .as-threadmore{margin-left:auto;color:var(--muted)}.as-time{font-size:9px;margin:3px 0 8px 28px}.as-card .as-quote{font-size:10px;max-height:38px;overflow:hidden}.as-threadreply{color:var(--muted);font-size:9px;border-top:1px solid var(--line);margin-top:9px;padding-top:7px}.as-threadreply .as-ico{width:11px;height:11px;margin-right:4px}.as-empty{padding:12px;color:var(--muted);font-size:10px}.as-empty .as-ico{margin-right:5px}.as-change{min-height:158px}.as-change .as-time{margin-left:0}.as-resolution{font-size:10px}.as-card .as-actions{margin-top:7px}.as-actions .as-tool{font-size:10px;padding:3px 5px}.as-card textarea{height:57px}.as-reviewnav{display:flex;gap:5px;margin-left:auto}.as-reviewnav .as-ico{width:11px;height:11px}
    .as-popover{position:absolute;z-index:90;right:12px;top:44px;width:275px;padding:14px;background:var(--panel);border:1px solid var(--line);border-radius:6px;box-shadow:0 8px 25px #0003}.as-popover h4{font-size:13px;margin:0 0 10px;display:flex;justify-content:space-between;align-items:center}.as-popover p{font-size:11px;margin:8px 0;color:var(--muted)}.as-popover .as-tool{font-size:11px}.as-app{position:relative}.as-save{display:inline-flex;align-items:center;gap:4px}.as-save .as-ico{width:11px;height:11px}.as-quiet{color:var(--muted)}
    .as-app.compact .as-review{width:220px}.as-app.compact .as-rail{width:130px}.as-app.compact .as-doc{padding:20px;margin:12px}.as-app.compact .as-group-caption{display:none}.as-app.tight .as-head-actions .as-optional,.as-app.tight .as-presence,.as-app.tight .as-status-tail .as-zoomtrack{display:none}.as-app.tight .as-tools{gap:1px}.as-app.tight .as-tools .as-tool{font-size:10px;gap:3px}.as-app.tight .as-quick .as-optional{display:none}
  `;
  env.widget({
    task: 'use-slides', site: 'base', name: 'classic', split: 'train',
    scenarios: ['reorder', 'align', 'restyle', 'comments', 'trackchanges'],
    render(ctx) {
      const { spec: s, util: u, size } = ctx, F = env.taskDef;
      ctx.css('app-slides-classic', CSS);
      const refs = {}, shapeEls = [], revisionEls = [], panes = {}, segments = [];
      let sortable, selection, scale = 1, deckTitle, inspector, commentList, composerBox, draftField, guide, slideArt;
      const cr = ctx.rng.fork('office-decoration'), co = { csplit: s.csplit };
      const teammates = [s.owner, s.baseComment.author, ctx.content.personName(cr, co).full];
      const isDoc = !s.judge && ['comments', 'trackchanges'].includes(s.scenario);
      const root = u.el('section', 'as-app' + (size.width < 1100 ? ' compact' : '') + (size.width < 850 ? ' tight' : ''), ctx.stage);
      root.style.width = `${Math.max(1, size.width - 24)}px`;
      root.style.height = `${Math.max(1, size.height - 24)}px`;
      root.setAttribute('aria-label', 'Lattice Office editor');
      const commit = (patch) => { ctx.update({ ...ctx.model, ...patch }); sync(ctx.model); mirror(); };
      const register = (el, key) => { refs[key] = el; return el; };
      function icon(parent, name) {
        const el = u.svg('svg', { viewBox: '0 0 24 24', class: 'as-ico', 'aria-hidden': 'true' }, parent);
        el.innerHTML = ICONS[name] || ICONS.more; return el;
      }
      const toolIcons = { selectAll: 'select', top: 'top', middle: 'middle', bottom: 'bottom', distribute: 'distribute', bold: 'bold', italic: 'italic', comment: 'comment', post: 'send' };
      const button = (parent, label, key, fn, cls = 'as-tool', glyph) => {
        const b = u.el('button', cls, parent); b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
        const which = glyph || (key?.startsWith('tool:') ? toolIcons[key.slice(5)] : key?.startsWith('revision:') ? { accept: 'check', reject: 'close', undo: 'undo' }[key.split(':')[2]] : key?.startsWith('deleteComment:') ? 'trash' : null);
        if (which) icon(b, which);
        if (label && !['tool:bold', 'tool:italic'].includes(key)) u.el('span', '', b, label);
        if (key) register(b, key); if (fn) b.addEventListener('click', fn); return b;
      };
      const popover = u.el('div', 'as-popover', root); popover.hidden = true;
      function panel(title, lines) {
        popover.replaceChildren(); popover.hidden = false;
        const h = u.el('h4', '', popover, title);
        button(h, 'Close', null, () => { popover.hidden = true; }, 'as-tool', 'close');
        for (const line of lines) u.el('p', '', popover, line);
      }
      const utility = (parent, label, glyph, title, lines, cls = 'as-tool') => button(parent, label, null, () => panel(title || label, lines || ['This file is up to date.', 'Your changes are saved in Team space.']), cls, glyph);
      function avatar(parent, name, cls = 'as-avatar') {
        const el = u.el('span', cls, parent, name.split(' ').map((p) => p[0]).slice(0, 2).join('')); el.title = name; return el;
      }
      function cardHeader(parent, author, time) {
        const h = u.el('div', 'as-cardhead', parent); avatar(h, author); u.el('span', '', h, author);
        const more = u.el('span', 'as-threadmore', h); icon(more, 'more');
        u.el('div', 'as-time', parent, time);
      }
      const head = u.el('div', 'as-head', root);
      const logo = u.el('div', 'as-logo', head); icon(logo, isDoc ? 'document' : 'slides');
      const name = u.el('div', 'as-name', head);
      u.el('div', 'as-title', name, s.title + (isDoc ? ' / Review notes' : ''));
      const subtitle = u.el('div', 'as-sub', name, 'Lattice Office / Team space / ');
      const save = register(u.el('span', 'as-save', subtitle), 'save'); icon(save, 'check'); u.el('span', '', save, 'All changes saved');
      const headActions = u.el('div', 'as-head-actions', head);
      const presence = u.el('div', 'as-presence', headActions); teammates.forEach((who) => avatar(presence, who));
      utility(headActions, '', 'clock', 'Version history', [`Today, 10:42 - ${s.owner}`, 'Version 3: Updated team briefing', `Yesterday, 16:18 - ${s.baseComment.author}`, 'Version 2: Added review notes'], 'as-tool as-optional').setAttribute('aria-label', 'Version history');
      const notify = utility(headActions, '', 'bell', 'Activity', [`${s.baseComment.author} left a comment on this draft.`, 'Delivery plan was shared with the team.', `${teammates[2]} is viewing the file.`], 'as-tool as-optional'); notify.setAttribute('aria-label', 'Activity');
      utility(headActions, 'Share', 'share', 'Share this file', ['General access: Restricted', ...teammates.map((who, i) => `${who} - ${i ? 'Can edit' : 'Owner'}`), 'Link sharing is available to members of Team space.'], 'as-tool as-share');
      utility(headActions, 'Editing', 'edit', 'Document mode', ['Editing - Make changes to this file', 'Viewing - Read without making changes', 'Your current mode is Editing.']);
      const filetabs = u.el('div', 'as-filetabs', root);
      for (const [i, title] of [isDoc ? 'Review notes.doc' : 'Team briefing.slides', 'Quarterly planning.slides', 'Launch checklist.doc'].entries()) {
        const tab = u.el('div', 'as-filetab' + (i === 0 ? ' active' : ''), filetabs); icon(tab, title.endsWith('.doc') ? 'document' : 'slides');
        u.el('span', '', tab, title); if (i === 0) icon(tab, 'close');
        else tab.addEventListener('click', () => panel(title, ['Last edited yesterday', 'Location: Team space / Planning', `Owned by ${teammates[i]}`, 'This file is available from Recent files.']));
      }
      const menu = u.el('div', 'as-menu', root);
      const menus = { File: ['New file', 'Open recent', 'Make a copy', 'Download', 'Print'], Edit: ['Undo', 'Redo', 'Find and replace'], View: ['Show ruler', 'Show outline', 'Fit to window', 'Full screen'], Insert: ['Text box', 'Image', 'Table', 'Link'], Format: ['Text', 'Paragraph', 'Arrange', 'Format options'], Review: ['Comments', 'Track changes', 'Version history'], Help: ['Keyboard shortcuts', 'Office help', 'Send feedback'] };
      for (const [title, entries] of Object.entries(menus)) {
        const item = u.el(title === (isDoc ? 'Review' : 'Format') ? 'b' : 'span', '', menu, title);
        item.style.cursor = 'pointer'; item.addEventListener('click', () => panel(title, entries));
      }
      const quick = u.el('div', 'as-quick', root);
      utility(quick, '', 'undo', 'Undo history', ['No earlier edits in this session.']).setAttribute('aria-label', 'Undo history');
      utility(quick, '', 'redo', 'Redo history', ['No edits to redo.']).setAttribute('aria-label', 'Redo history');
      utility(quick, '', 'print', 'Print preview', [isDoc ? 'Review notes - Portrait, A4' : 'Team briefing - Landscape, 16:9', 'Destination: Save as PDF', 'All pages'], 'as-tool as-optional').setAttribute('aria-label', 'Print preview');
      utility(quick, '', 'paint', 'Format painter', ['Select text or an object to copy its formatting.'], 'as-tool as-optional').setAttribute('aria-label', 'Format painter');
      u.el('span', 'as-sep', quick);
      utility(quick, 'Fit', 'search', 'Zoom', ['Fit to window', '50%', '75%', '100%', '125%']);
      u.el('span', 'as-sep', quick);
      utility(quick, 'Normal text', 'text', 'Text styles', ['Normal text', 'Title', 'Subtitle', 'Heading 1', 'Heading 2'], 'as-tool as-optional');
      utility(quick, 'Sans', 'chevron', 'Font family', ['Sans', 'Serif', 'Monospace', 'Recent fonts'], 'as-tool as-fontname');
      if (s.scenario !== 'restyle' && !s.judge) {
        u.el('span', 'as-pill', quick, isDoc ? '11' : '20');
        utility(quick, '', 'bold', 'Text formatting', ['Select text to apply bold formatting.']).setAttribute('aria-label', 'Bold');
        utility(quick, '', 'italic', 'Text formatting', ['Select text to apply italic formatting.']).setAttribute('aria-label', 'Italic');
      }
      u.el('span', 'as-sep', quick);
      utility(quick, '', 'link', 'Insert link', ['Select text or an object to add a link.'], 'as-tool as-optional').setAttribute('aria-label', 'Insert link');
      const selectedLabel = register(u.el('span', 'as-group-caption', quick), 'selectionStatus');
      const tools = u.el('div', 'as-tools', root);
      const setStyle = (key, value) => {
        const styles = ctx.model.styles.map((st, i) => ctx.model.selected.includes(i) ? { ...st, [key]: typeof value === 'function' ? value(st[key]) : value } : st);
        commit({ styles });
      };
      if (!isDoc) {
        if (s.scenario === 'align' && !s.judge) {
          button(tools, 'Select all shapes', 'tool:selectAll', () => commit({ selected: s.shapes.map((_, i) => i) }));
          u.el('span', 'as-sep', tools);
          u.el('span', 'as-sub', tools, 'Align to slide');
          for (const [key, label, y] of [['top', 'Align top', 0], ['middle', 'Align middle', 176], ['bottom', 'Align bottom', 352]]) {
            button(tools, label, `tool:${key}`, () => commit({ positions: ctx.model.positions.map((p, i) => ctx.model.selected.includes(i) ? { ...p, y } : p) }));
          }
          button(tools, 'Distribute horizontally', 'tool:distribute', () => {
            const selected = ctx.model.selected.slice().sort((a, b) => ctx.model.positions[a].x - ctx.model.positions[b].x);
            if (selected.length < 2) return;
            const lo = ctx.model.positions[selected[0]].x, hi = ctx.model.positions[selected[selected.length - 1]].x;
            commit({ positions: ctx.model.positions.map((p, i) => selected.includes(i) ? { ...p, x: lo + (hi - lo) * selected.indexOf(i) / (selected.length - 1) } : p) });
          });
        } else if (s.scenario === 'restyle' || s.judge) {
          u.el('span', 'as-sub', tools, 'Text formatting');
          const input = register(u.el('input', 'as-size', tools), 'field:size');
          input.type = 'text'; input.inputMode = 'numeric'; input.setAttribute('aria-label', 'Font size');
          input.addEventListener('input', () => { const n = Number(input.value); if (Number.isFinite(n) && n >= 8 && n <= 72) setStyle('size', n); });
          u.el('span', 'as-sub', tools, 'pt');
          button(tools, 'B', 'tool:bold', () => setStyle('bold', (v) => !v)).style.fontWeight = '800';
          button(tools, 'I', 'tool:italic', () => setStyle('italic', (v) => !v)).style.fontStyle = 'italic';
          u.el('span', 'as-sep', tools);
          u.el('span', 'as-sub', tools, 'Text colour');
          for (const [name, color] of Object.entries(F.helpers.COLORS)) {
            const b = button(tools, '', `color:${name}`, () => setStyle('color', name), 'as-color'); b.title = name; b.setAttribute('aria-label', name);
            u.el('i', '', b).style.background = color;
          }
        } else {
          utility(tools, 'New slide', 'plus', 'New slide', ['Title slide', 'Title and body', 'Section header', 'Blank']);
          utility(tools, 'Layout', 'layout', 'Slide layout', ['Title and body', 'Two columns', 'Section header']);
          utility(tools, 'Theme', 'theme', 'Theme library', ['Lattice / Standard', 'Editorial / Soft', 'Pitch / Contrast']);
          utility(tools, 'Transition', 'slides', 'Slide transition', ['None', 'Fade', 'Slide from right']);
          utility(tools, 'Present', 'present', 'Presentation ready', [`${s.slides.length} slides`, 'Start from the beginning', 'Presenter view']);
        }
      } else {
        if (s.scenario === 'comments') button(tools, 'New comment', 'tool:comment', () => {
          const v = ctx.model.selection; if (v.end <= v.start) return;
          commit({ composer: { open: true, start: v.start, end: v.end }, draft: '' }); draftField.focus();
        });
        else utility(tools, 'Track changes: On', 'edit', 'Tracking options', ['Track changes for everyone', 'Markup: All changes', 'Revisions are saved with the author name.']);
        utility(tools, 'All markup', 'eye', 'Show markup', ['Insertions and deletions', 'Comments', 'Formatting changes']);
        utility(tools, 'Reviewers', 'comment', 'Reviewers', teammates);
        u.el('span', 'as-group-caption', tools, s.scenario === 'comments' ? 'Review / Comments' : 'Review / Changes');
      }
      const main = u.el('div', 'as-main', root);
      const projects = u.el('aside', 'as-projects' + (size.width < 1200 ? ' narrow' : ''), main);
      projects.setAttribute('aria-label', 'Workspace navigation');
      u.el('h5', '', projects, 'Team space');
      utility(projects, 'Recent files', 'clock', 'Recent files', ['Team briefing.slides - Today', 'Review notes.doc - Today', 'Quarterly planning.slides - Yesterday', 'Launch checklist.doc - Yesterday']);
      utility(projects, 'Shared with me', 'share', 'Shared with me', [`Quarterly planning - ${teammates[1]}`, `Budget review - ${teammates[2]}`, 'Brand resources - Design team']);
      utility(projects, 'Starred', 'folder', 'Starred files', ['Brand resources', 'Project calendar', 'Team handbook']);
      u.el('h5', '', projects, 'Projects');
      for (const [i, title] of ['Team briefing', 'Customer launch', 'Quarterly planning', 'Brand resources'].entries()) {
        utility(projects, title, i === 0 ? 'slides' : 'folder', title, [`Location: Team space / ${title}`, `${i + 3} files`, `Last edited by ${teammates[i % 3]}`], 'as-tool' + (i === 0 ? ' current' : ''));
        u.el('small', '', projects, i === 0 ? 'Open now' : `${i + 3} files`);
      }
      u.el('h5', '', projects, 'Activity');
      utility(projects, 'Notifications', 'bell', 'Notifications', [`${teammates[1]} mentioned the team in Review notes.`, 'Launch checklist has been updated.', 'No unread mentions in this file.']);
      utility(projects, 'File details', 'document', 'File details', [`Owner: ${s.owner}`, 'Location: Team space / Planning', 'Version: 3', 'Access: Team members only']);
      env.ui.scrollPane(projects, {});
      function mirror() {
        if (!root.isConnected) return;
        const view = {};
        for (const [key, p] of Object.entries(panes)) {
          const pr = p.el.getBoundingClientRect();
          const targets = p.targets ? p.targets.map((el) => {
            const r = el.getBoundingClientRect(); return [r.top - pr.top + p.el.scrollTop, r.bottom - pr.top + p.el.scrollTop];
          }) : [];
          view[key] = { scroll: p.el.scrollTop, height: p.el.clientHeight, pitch: p.pitch || 0, targets };
        }
        if (JSON.stringify(view) !== JSON.stringify(ctx.model.view)) ctx.update({ ...ctx.model, view });
      }
      function scrolling(el, key, targets, pitch) {
        panes[key] = { el, targets, pitch };
        env.ui.scrollPane(el, { onScroll: mirror });
        el.addEventListener('scroll', mirror);
      }
      // Thumbnails and the editing canvas share the same presentation layouts.
      // The illustration is decorative; all editable objects remain in the model.
      function presentation(parent, index, thumbnail) {
        parent.replaceChildren();
        const svg = u.svg('svg', { viewBox: '0 0 720 400', width: '100%', height: '100%', 'aria-hidden': 'true' }, parent);
        const rect = (x, y, w, h, fill, rx = 0) => u.svg('rect', { x, y, width: w, height: h, fill, rx }, svg);
        const text = (x, y, value, font = 18, fill = 'var(--fg)', weight = 400) => {
          const t = u.svg('text', { x, y, fill, 'font-size': font, 'font-family': 'system-ui', 'font-weight': weight }, svg); t.textContent = value;
        };
        if (thumbnail) {
          rect(0, 0, 720, 400, 'var(--panel)'); rect(0, 0, 720, 6, 'var(--accent)');
          text(40, 65, s.slides[index].title, 31, 'var(--fg)', 700);
          text(40, 95, s.slides[index].subtitle, 16, 'var(--muted)');
        }
        const muted = 'color-mix(in srgb,var(--accent) 12%,var(--panel))';
        if (s.scenario !== 'reorder' || s.judge) {
          s.shapes.forEach((shape, i) => {
            const p = ctx.model.positions[i], st = ctx.model.styles[i];
            rect(p.x, p.y, 110, 48, muted, 5);
            if (thumbnail) text(p.x + 12, p.y + 30, shape.label, st.size, F.helpers.COLORS[st.color], st.bold ? 700 : 400);
          });
        } else if (index % 3 === 0) {
          rect(40, 135, 218, 180, muted, 8); text(65, 209, `${78 + index}%`, 56, 'var(--accent)', 700);
          text(65, 244, 'Team readiness', 18, 'var(--muted)'); text(65, 280, 'Quarterly pulse', 14, 'var(--muted)');
          text(295, 165, 'A shared direction', 24, 'var(--fg)', 650);
          for (const [i, line] of ['Focus on the customer experience', 'Ship in small, measurable stages', 'Make room for feedback early'].entries()) {
            rect(295, 194 + i * 42, 5, 5, 'var(--accent)', 2); text(311, 203 + i * 42, line, 15);
          }
        } else if (index % 3 === 1) {
          text(40, 135, 'Progress by workstream', 20, 'var(--fg)', 600);
          for (let i = 0; i < 4; i++) {
            const x = 70 + i * 100, height = 65 + ((i + index) % 4) * 33;
            rect(x, 315 - height, 54, height, i === 3 ? 'var(--accent)' : muted, 3); text(x + 5, 341, ['Plan', 'Pilot', 'Build', 'Ship'][i], 13, 'var(--muted)');
          }
          text(513, 192, '24', 48, 'var(--accent)', 700); text(513, 222, 'active initiatives', 14, 'var(--muted)');
          text(513, 268, 'Weekly snapshot', 13, 'var(--muted)');
        } else {
          text(40, 133, 'From planning to delivery', 20, 'var(--fg)', 600);
          const rows = [['Discovery', 'Research complete', 'On track'], ['Pilot', 'Feedback in review', 'In progress'], ['Delivery', 'Dependencies mapped', 'Next up']];
          rows.forEach((row, i) => {
            rect(40, 154 + i * 62, 640, 51, i % 2 ? 'var(--panel)' : muted, 3);
            text(56, 184 + i * 62, row[0], 17, 'var(--fg)', 600); text(230, 184 + i * 62, row[1], 15, 'var(--muted)'); text(541, 184 + i * 62, row[2], 13, 'var(--accent)');
          });
        }
      }
      if (!isDoc) {
        const rail = u.el('aside', 'as-rail', main);
        const railHead = u.el('div', 'as-cap', rail, 'Slides'); icon(railHead, 'layout');
        const railPane = register(u.el('div', 'as-scroll', rail), 'pane:rail');
        const board = u.el('div', 'as-thumbs', railPane), cards = {};
        board.style.height = `${s.slides.length * 68}px`;
        s.slides.forEach((slide, i) => {
          const card = cards[i] = register(u.el('div', 'as-thumb', board), `slide:${i}`);
          card.setAttribute('aria-label', `Slide ${slide.title}`);
          u.el('span', 'as-num', card, String(i + 1));
          const preview = u.el('div', 'as-preview', card); presentation(preview, i, true);
          card.addEventListener('click', () => commit({ activeSlide: i }));
        });
        sortable = env.ui.sortable(board, { order: ctx.model.order, items: cards,
          slotRect: (i) => ({ x: 0, y: i * 68, w: board.clientWidth, h: 61 }), axis: 'y', activeClass: 'dragging',
          onChange: (order) => commit({ order }), label: 'slide thumbnails' });
        scrolling(railPane, 'rail', null, 68);
        const editor = u.el('div', 'as-editor', main);
        const ruler = u.el('div', 'as-ruler', editor); for (let i = 0; i < 13; i++) u.el('span', '', ruler, String(i));
        const work = u.el('div', 'as-work', editor);
        const wrap = u.el('div', 'as-slidewrap', work), canvas = u.el('div', 'as-canvas', wrap);
        if (s.scenario === 'reorder' && !s.judge) {
          slideArt = u.el('div', '', canvas); Object.assign(slideArt.style, { position: 'absolute', inset: '0', pointerEvents: 'none' });
        }
        deckTitle = u.el('div', 'as-slidehead', canvas);
        register(u.el('div', 'as-slidesub', canvas), 'slideSubtitle');
        u.el('div', 'as-slideeyebrow', canvas, 'LATTICE / TEAM BRIEFING');
        const slideFoot = u.el('div', 'as-slidefoot' + (s.scenario === 'align' ? ' align-footer' : ''), canvas);
        u.el('span', '', slideFoot, 'Internal working draft / Planning & delivery'); register(u.el('span', '', slideFoot), 'slidePage');
        guide = u.el('div', 'as-guide', canvas);
        s.shapes.forEach((shape, i) => {
          const el = shapeEls[i] = register(u.el('div', 'as-shape', canvas, shape.label), `shape:${i}`);
          if (slideArt) el.hidden = true;
          el.setAttribute('aria-label', `Shape ${shape.label}`);
          let origin;
          env.ui.track(el, {
            start(p, e) {
              origin = { ...ctx.model.positions[i] };
              const selected = e.shiftKey ? (ctx.model.selected.includes(i) ? ctx.model.selected.filter((x) => x !== i) : [...ctx.model.selected, i]) : [i];
              commit({ selected });
            },
            move(p) {
              if (Math.hypot(p.dx, p.dy) < 3) return;
              let x = Math.max(0, Math.min(610, origin.x + p.dx / scale));
              let y = Math.max(0, Math.min(352, origin.y + p.dy / scale));
              const snapY = [0, 176, 352, ...ctx.model.positions.filter((_, j) => j !== i).map((q) => q.y)].find((v) => Math.abs(v - y) < 6);
              const snapX = [40, 570, F.helpers.distributedX(s, i)].find((v) => Math.abs(v - x) < 6);
              if (snapY !== undefined) y = snapY; if (snapX !== undefined) x = snapX;
              commit({ positions: ctx.model.positions.map((q, j) => j === i ? { x, y } : q) });
              guide.classList.toggle('on', snapY !== undefined); guide.style.top = `${y + 24}px`;
            },
            end() { guide.classList.remove('on'); },
          }, `shape ${i}`);
        });
        const notes = u.el('div', 'as-notes', editor); icon(notes, 'notes'); u.el('span', '', notes, 'Speaker notes'); u.el('span', 'as-quiet', notes, 'Discuss dependencies and agree on next steps.');
        if (size.width > 1100) {
          inspector = u.el('aside', 'as-inspector', main);
          u.el('h4', '', inspector, slideArt ? 'Slide design' : 'Format options');
          const inner = u.el('div', 'as-inspector-body', inspector);
          if (slideArt) {
            u.el('p', '', inner, 'Current theme'); u.el('div', 'as-pill', inner, 'Lattice / Standard');
            u.el('p', '', inner, 'Layout'); register(u.el('div', 'as-pill', inner), 'slideLayout');
            u.el('hr', '', inner); u.el('p', '', inner, 'Theme colours');
            const colors = u.el('div', 'as-actions', inner);
            for (const color of Object.values(F.helpers.COLORS)) { const swatch = u.el('span', 'as-color', colors); u.el('i', '', swatch).style.background = color; }
            u.el('p', '', inner, 'Master layouts');
            for (const layout of ['Title & overview', 'Chart & callout', 'Delivery roadmap']) utility(inner, layout, 'layout', layout, ['Layout saved in Lattice / Standard', 'Available from the Layout menu'], 'as-layer');
            u.el('hr', '', inner); u.el('p', '', inner, 'Accessibility'); u.el('small', 'as-quiet', inner, 'Reading order follows the slide layout.');
          } else {
            const label = u.el('p', '', inner, 'Size & rotation'); icon(label, 'chevron');
            register(u.el('div', 'as-empty', inner, 'Select an object to see its properties.'), 'inspectorEmpty');
            const dl = register(u.el('dl', '', inner), 'inspectorProperties');
            for (const [k, v] of [['Width', '110'], ['Height', '48'], ['Rotation', '0 deg'], ['X', '40'], ['Y', '112']]) { u.el('dt', '', dl, k); register(u.el('dd', '', dl, v), `property:${k}`); }
            u.el('hr', '', inner);
            for (const title of ['Text fitting', 'Fill & border', 'Drop shadow', 'Alt text']) { const p = u.el('p', '', inner, title); icon(p, 'chevron'); }
            u.el('hr', '', inner); u.el('p', '', inner, 'Selection pane');
            s.shapes.forEach((shape, i) => button(inner, shape.label, `layer:${i}`, () => commit({ selected: [i] }), 'as-layer', 'text'));
          }
          env.ui.scrollPane(inner, {});
        }
        const wr = work.getBoundingClientRect();
        scale = Math.min((wr.width - 28) / 720, (wr.height - 56) / 400, 1.4);
        scale = Math.max(.1, scale);
        wrap.style.width = `${720 * scale}px`; wrap.style.height = `${400 * scale}px`; canvas.style.transform = `scale(${scale})`;
      } else {
        let outline;
        const sections = ['Overview', 'Scope & priorities', 'Delivery approach', 'Dependencies', 'Decisions', 'Next steps', 'Appendix'];
        if (size.width > 1140) {
          outline = u.el('aside', 'as-outline', main);
          u.el('h4', '', outline, 'Document outline');
          u.el('p', 'active', outline, 'Team briefing');
        }
        const editor = u.el('div', 'as-editor', main);
        const ruler = u.el('div', 'as-ruler', editor); for (let i = 0; i < 11; i++) u.el('span', '', ruler, String(i));
        const docPane = register(u.el('div', 'as-scroll', editor), 'pane:document');
        const paper = u.el('article', 'as-doc', docPane);
        const paperHead = u.el('div', 'as-dochead', paper); u.el('span', '', paperHead, 'LATTICE / TEAM SPACE'); u.el('span', '', paperHead, 'INTERNAL WORKING COPY');
        u.el('h2', '', paper, 'Team briefing');
        u.el('div', 'as-docmeta', paper, `Prepared by ${s.owner} / Version 3 / Planning & delivery`);
        const body = u.el('div', 'as-doctext', paper), paragraphEls = [];
        let offset = 0;
        s.paragraphs.forEach((text, i) => {
          const heading = u.el('h3', '', body, `${i + 1}. ${sections[i]}`);
          if (outline) {
            const entry = u.el('p', '', outline, `${i + 1}. ${sections[i]}`); entry.style.cursor = 'pointer';
            entry.addEventListener('click', () => { docPane.scrollTop += heading.getBoundingClientRect().top - docPane.getBoundingClientRect().top - 10; mirror(); });
          }
          const p = u.el('p', '', body, text);
          const range = document.createRange(); range.setStart(p.firstChild, 0); range.setEnd(p.firstChild, s.phrases[i].text.length);
          paragraphEls.push(range); segments.push({ node: p.firstChild, start: offset }); offset += text.length + 2;
          if (s.scenario === 'trackchanges') {
            const contexts = ['The pilot is scheduled to run for ', 'Implementation will be led by ', 'We recommend starting with ', 'The launch depends on ', 'The steering group expects ', 'Planning is based on ', 'Questions will be revisited during '];
            const c = s.changes[i % s.changes.length], line = u.el('p', 'as-revisionline', body, contexts[i]);
            line.dataset.reviewer = c.author;
            const before = u.el('span', 'as-del', line, c.before); u.el('span', '', line, ' '); const after = u.el('span', 'as-ins', line, c.after);
            u.el('span', '', line, '.');
            revisionEls.push({ before, after });
          }
        });
        const paperFoot = u.el('div', 'as-docfooter', paper); u.el('span', '', paperFoot, 'Confidential / Team members only'); u.el('span', '', paperFoot, 'Planning & delivery');
        scrolling(docPane, 'document', paragraphEls);
        const side = u.el('aside', 'as-review', main);
        const cap = register(u.el('div', 'as-cap', side), 'reviewCount');
        const filters = u.el('div', 'as-reviewfilters', side);
        utility(filters, s.scenario === 'comments' ? 'All comments' : 'All reviewers', 'chevron', 'Review filters', s.scenario === 'comments' ? ['Open comments', 'Resolved comments', 'All comments', 'Mentions of me'] : ['All reviewers', ...teammates], 'as-pill');
        const reviewNav = u.el('div', 'as-reviewnav', filters);
        utility(reviewNav, '', 'left', 'Review navigation', ['Use the review pane to see earlier suggestions.']).setAttribute('aria-label', 'Previous review');
        utility(reviewNav, '', 'right', 'Review navigation', ['Use the review pane to see later suggestions.']).setAttribute('aria-label', 'Next review');
        if (s.scenario === 'comments') {
          const listPane = u.el('div', 'as-scroll', side);
          register(listPane, 'pane:comments'); scrolling(listPane, 'comments', []);
          const base = u.el('div', 'as-card', listPane);
          cardHeader(base, s.baseComment.author, 'Today, 09:18 / Draft review');
          u.el('div', 'as-quote', base, 'Team briefing'); u.el('p', '', base, s.baseComment.text);
          const reply = u.el('div', 'as-threadreply', base); icon(reply, 'comment'); u.el('span', '', reply, 'Reply or mention someone');
          commentList = u.el('div', '', listPane);
          const empty = register(u.el('div', 'as-empty', listPane), 'commentEmpty'); icon(empty, 'check'); u.el('span', '', empty, 'No unread comments in this file');
          composerBox = u.el('div', 'as-card', side); composerBox.style.flex = 'none';
          const composerHead = u.el('div', 'as-cardhead', composerBox); avatar(composerHead, s.owner); u.el('span', '', composerHead, 'New comment');
          register(u.el('div', 'as-quote', composerBox), 'quote');
          draftField = register(u.el('textarea', '', composerBox), 'field:comment'); draftField.setAttribute('aria-label', 'Comment text'); draftField.placeholder = 'Add a comment…';
          draftField.addEventListener('input', () => commit({ draft: draftField.value }));
          const actions = u.el('div', 'as-actions', composerBox);
          button(actions, 'Post', 'tool:post', () => {
            if (!ctx.model.draft.trim()) return;
            const c = ctx.model.composer;
            commit({ comments: [...ctx.model.comments, { start: c.start, end: c.end, text: ctx.model.draft }], draft: '', composer: { ...c, open: false } });
          }, 'as-primary');
          button(actions, 'Cancel', null, () => commit({ composer: { ...ctx.model.composer, open: false }, draft: '' }));
          selection = env.ui.textSelection(body, { segments, length: s.doc.length, value: ctx.model.selection,
            onChange: (v) => commit({ selection: v }), label: 'comment anchor' });
        } else {
          const reviewPane = register(u.el('div', 'as-scroll', side), 'pane:review');
          const actionGroups = [];
          s.changes.forEach((change, i) => {
            const card = u.el('div', 'as-card as-change', reviewPane);
            cardHeader(card, change.author, `Today, ${9 + Math.floor(i / 3)}:${String(12 + i * 4).padStart(2, '0')} / Text replacement`);
            u.el('div', 'as-quote', card, `${i + 1}. ${sections[i]}`);
            u.el('span', 'as-del', card, change.before); u.el('span', '', card, ' '); icon(card, 'next'); u.el('span', '', card, ' '); u.el('span', 'as-ins', card, change.after);
            register(u.el('div', 'as-resolution', card), `resolution:${i}`);
            const actions = u.el('div', 'as-actions', card);
            actionGroups.push(actions);
            for (const [action, label] of [['accept', 'Accept'], ['reject', 'Reject'], ['undo', 'Undo']]) button(actions, label, `revision:${i}:${action}`, () => commit({ decisions: ctx.model.decisions.map((x, j) => i === j ? action === 'undo' ? 'pending' : action : x) }));
          });
          scrolling(reviewPane, 'review', actionGroups);
        }
        cap.textContent = s.scenario === 'comments' ? 'Comments' : 'Suggested changes';
      }
      const footer = register(u.el('footer', 'as-status', root), 'status');
      icon(footer, isDoc ? 'document' : 'slides');
      const statusCount = u.el('span', '', footer), statusExtra = u.el('span', '', footer);
      const tail = u.el('div', 'as-status-tail', footer);
      u.el('span', 'as-owner', tail, `Owner: ${s.owner}`);
      icon(tail, 'layout'); u.el('span', 'as-zoomtrack', tail); register(u.el('span', '', tail), 'zoom');
      let lastComments = '', lastArtwork = '', lastPreview = '';
      function sync(m) {
        refs.save.querySelector('span').textContent = m.composer.open && m.draft ? 'Comment draft' : 'All changes saved';
        refs.selectionStatus.textContent = isDoc ? 'Reviewing' : m.selected.length === 1 ? `${s.shapes[m.selected[0]].label} selected` : m.selected.length ? `${m.selected.length} objects selected` : 'No object selected';
        refs.zoom.textContent = isDoc ? '100%' : `${Math.round(scale * 100)}%`;
        if (sortable && !sortable.dragging()) sortable.set(m.order);
        if (!isDoc) {
          for (let i = 0; i < s.slides.length; i++) {
            const el = refs[`slide:${i}`]; el.classList.toggle('active', m.activeSlide === i);
            el.querySelector('.as-num').textContent = String(m.order.indexOf(i) + 1);
          }
          deckTitle.textContent = s.slides[m.activeSlide].title;
          refs.slideSubtitle.textContent = s.slides[m.activeSlide].subtitle + ' / Planning & delivery';
          refs.slidePage.textContent = `${m.order.indexOf(m.activeSlide) + 1} / ${m.order.length}`;
          if (slideArt && lastArtwork !== String(m.activeSlide)) { lastArtwork = String(m.activeSlide); presentation(slideArt, m.activeSlide, false); }
          const previewKey = JSON.stringify([m.positions, m.styles]);
          if (!slideArt && lastPreview !== previewKey) {
            lastPreview = previewKey;
            for (let i = 0; i < s.slides.length; i++) presentation(refs[`slide:${i}`].querySelector('.as-preview'), i, true);
          }
          shapeEls.forEach((el, i) => {
            const st = m.styles[i], p = m.positions[i];
            el.style.left = `${p.x}px`; el.style.top = `${p.y}px`; el.style.color = `color-mix(in srgb, ${F.helpers.COLORS[st.color]} 64%, var(--fg))`;
            el.style.fontWeight = st.bold ? '750' : '400'; el.style.fontStyle = st.italic ? 'italic' : 'normal'; el.style.fontSize = `${st.size}px`;
            el.classList.toggle('selected', m.selected.includes(i));
            if (refs[`layer:${i}`]) refs[`layer:${i}`].classList.toggle('active', m.selected.includes(i));
          });
          if (refs.slideLayout) refs.slideLayout.textContent = ['Title & overview', 'Chart & callout', 'Delivery roadmap'][m.activeSlide % 3];
          if (refs['property:X']) {
            const p = m.positions[m.selected[0] ?? 0];
            refs['property:X'].textContent = String(Math.round(p.x)); refs['property:Y'].textContent = String(Math.round(p.y));
            refs.inspectorEmpty.hidden = m.selected.length > 0; refs.inspectorProperties.hidden = !m.selected.length;
          }
          const st = m.styles[m.selected[0] ?? 0];
          if (refs['field:size'] && document.activeElement !== refs['field:size']) refs['field:size'].value = String(st.size);
          for (const key of ['bold', 'italic']) if (refs[`tool:${key}`]) refs[`tool:${key}`].setAttribute('aria-pressed', String(st[key] && m.selected.length > 0));
          for (const color of Object.keys(F.helpers.COLORS)) if (refs[`color:${color}`]) refs[`color:${color}`].setAttribute('aria-pressed', String(color === st.color && m.selected.length > 0));
          statusCount.textContent = `Slides: ${m.order.length}`; statusExtra.textContent = `Objects: ${m.positions.length} · ${Math.round(scale * 100)}%`;
        } else if (s.scenario === 'comments') {
          statusCount.textContent = `Words: ${s.doc.split(/\s+/).length}`; statusExtra.textContent = `Comments: ${1 + m.comments.length}`;
          refs.reviewCount.textContent = `Comments (${1 + m.comments.length})`;
          refs.commentEmpty.hidden = m.comments.length > 0 || m.composer.open;
          composerBox.hidden = !m.composer.open;
          refs.quote.textContent = s.doc.slice(m.composer.start, m.composer.end);
          if (draftField.value !== m.draft) draftField.value = m.draft;
          refs['tool:post'].disabled = !m.draft.trim();
          if (selection && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) selection.set(m.selection);
          if (JSON.stringify(m.comments) !== lastComments) {
            lastComments = JSON.stringify(m.comments); commentList.replaceChildren();
            const targets = [];
            m.comments.forEach((c, i) => {
              const card = u.el('div', 'as-card', commentList); cardHeader(card, s.owner, 'Just now / Posted');
              u.el('div', 'as-quote', card, s.doc.slice(c.start, c.end)); u.el('p', '', card, c.text);
              targets.push(button(card, 'Delete', `deleteComment:${i}`, () => commit({ comments: ctx.model.comments.filter((_, j) => j !== i) })));
              const reply = u.el('div', 'as-threadreply', card); icon(reply, 'comment'); u.el('span', '', reply, 'Reply or mention someone');
            });
            panes.comments.targets = targets;
          }
        } else {
          const reviewed = m.decisions.filter((x) => x !== 'pending').length;
          statusCount.textContent = `Pending changes: ${m.decisions.length - reviewed}`; statusExtra.textContent = `Reviewed: ${reviewed}`;
          refs.reviewCount.textContent = `Changes (${m.decisions.length - reviewed} pending)`;
          m.decisions.forEach((state, i) => {
            refs[`resolution:${i}`].textContent = state === 'pending' ? 'Pending' : state === 'accept' ? 'Accepted' : 'Rejected';
            for (const action of ['accept', 'reject', 'undo']) refs[`revision:${i}:${action}`].hidden = action === 'undo' ? state === 'pending' : state !== 'pending';
            const line = revisionEls[i];
            if (line) { line.before.hidden = state === 'accept'; line.after.hidden = state === 'reject'; line.before.className = state === 'pending' ? 'as-del' : ''; line.after.className = state === 'pending' ? 'as-ins' : ''; }
          });
        }
      }
      live = { refs, sortable, selection, panes };
      sync(ctx.model); mirror();
      return { anchors: [root], sync: (m) => { sync(m); mirror(); } };
    },
    locate(t) {
      if (t.char !== undefined) return live.selection.locate(t);
      if (t.slot !== undefined) return live.sortable.locateSlot(t.slot);
      if (t.slide !== undefined) return live.sortable.locate(t.slide);
      const key = t.shape !== undefined ? `shape:${t.shape}` : t.tool ? `tool:${t.tool}` : t.field ? `field:${t.field}` : t.color ? `color:${t.color}` : t.revision !== undefined ? `revision:${t.revision}:${t.action}` : t.deleteComment !== undefined ? `deleteComment:${t.deleteComment}` : `pane:${t.pane}`;
      const el = live.refs[key]; if (!el || el.hidden) throw new Error(`use-slides: target ${key} not visible`);
      return env.util.center(el);
    },
  });
})();
