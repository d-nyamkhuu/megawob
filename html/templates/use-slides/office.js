/* use-slides/office: Lattice Office deck editor and document review workspace.
 * Scenarios: align, reorder, restyle, comments, trackchanges; judge episodes use the deck.
 * design: {} reproduces each matching pilot with no scenario presets:
 *   align: design-use-slides-align-01; reorder: design-use-slides-reorder-01;
 *   restyle: design-use-slides-restyle-01; comments: design-use-slides-comments-01;
 *   trackchanges: design-use-slides-trackchanges-01.
 * Tokens (object and array defaults are defined in TOKENS below):
 *   icons = ICONS: SVG path table; default ICONS below.
 *   toolIcons = see TOKENS: tool-to-icon table.
 *   uiFont = 'system-ui': UI and SVG text font.
 *   documentFont = 'Georgia,serif': document body font.
 *   guideColor = '#d548a5': snap guide colour.
 *   deletionColor = '#b9424c': deleted text colour.
 *   insertionColor = '#258468': inserted text colour.
 *   darkDeletionColor = '#f6949f': deleted text in dark theme.
 *   darkInsertionColor = '#67c9af': inserted text in dark theme.
 *   presenceColor = '#2ba67c': presence dot colour.
 *   editorLabel = 'Lattice Office editor': editor accessible label.
 *   brand = 'Lattice Office': header brand.
 *   workspace = 'Team space': header and navigation workspace label.
 *   documentTitle = 'Team briefing': document heading, outline title and seeded quote.
 *   slideEyebrow = 'LATTICE / TEAM BRIEFING': slide eyebrow.
 *   slideFooter = 'Internal working draft / Planning & delivery': slide footer label.
 *   notesLabel = 'Speaker notes': notes heading.
 *   notesText = 'Discuss dependencies and agree on next steps.': notes text.
 *   commentPlaceholder = 'Add a comment…': composer placeholder.
 *   frameInset = 24: frame width/height inset in stage px.
 *   compactAt = 1100: compact frame breakpoint in stage px.
 *   tightAt = 850: tight frame breakpoint in stage px.
 *   navigationAt = 1200: narrow navigation breakpoint in stage px.
 *   inspectorAt = 1100: inspector visible above this stage width.
 *   outlineAt = 1140: outline visible above this stage width.
 *   railWidth = 154: normal thumbnail rail width in px.
 *   compactRailWidth = 130: compact thumbnail rail width in px.
 *   reviewWidth = 250: normal review sidebar width in px.
 *   compactReviewWidth = 220: compact review sidebar width in px.
 *   inspectorWidth = 182: inspector width in px.
 *   navigationWidth = 140: expanded project navigation width in px.
 *   outlineWidth = 142: document outline width in px.
 *   thumbnailPitch = 68: thumbnail slot pitch in px.
 *   thumbnailHeight = 61: sortable thumbnail hit height in px.
 *   canvasInsetX = 28: horizontal space reserved while fitting canvas.
 *   canvasInsetY = 56: vertical space reserved while fitting canvas.
 *   maxScale = 1.4: maximum canvas scale.
 *   sections = see TOKENS: document section titles in order.
 *   revisionContexts = see TOKENS: inline tracked revision prefixes in order.
 *   layouts = ['Title & overview', 'Chart & callout', 'Delivery roadmap']: reorder artwork layout names.
 *   menus = see TOKENS: menu labels and panel entries.
 * Parts (all calls go through P; overrides are (base, S) => replacement):
 *   styles(ctx): install the structural stylesheet with resolved tokens; no return.
 *   layout(ctx): compose the editor frame, frame, workspace and footer; no return.
 *   frame(ctx): create and size the editor section in ctx.stage; return its element.
 *   commit(patch): merge a model patch, then sync and mirror layout; no return.
 *   register(el, key): store an oracle reference; return el.
 *   icon(parent, name): append an SVG icon from icons; return its element.
 *   button(parent, label, key, fn, cls = 'as-tool', glyph): append a labelled button, register key, bind fn; return the button.
 *   popover(): create the hidden utility panel in root; no return.
 *   panel(title, lines): show utility title and paragraph lines in the popover; no return.
 *   utility(parent, label, glyph, title, lines, cls = 'as-tool'): append a button that opens a utility panel; return the button.
 *   avatar(parent, name, cls = 'as-avatar'): append initials and a name tooltip; return its element.
 *   cardHeader(parent, author, time): append author avatar, name, more icon and timestamp; no return.
 *   head(): draw title, saved status, presence and sharing controls; no return.
 *   fileTabs(): draw active and decorative file tabs; no return.
 *   menu(): draw menu labels and bind utility panels; no return.
 *   quickTools(): draw quick formatting, zoom and selection status; no return.
 *   setStyle(key, value): apply a value or value function to selected shapes; no return.
 *   tools(): create task toolbar and dispatch by scenario (judge uses style tools); no return.
 *   alignTools(tools): draw selection, alignment and distribution controls with model handlers; no return.
 *   styleTools(tools): draw font size, bold, italic and colour controls with model handlers; no return.
 *   deckTools(tools): draw decorative slide, layout, theme, transition and present controls; no return.
 *   reviewTools(tools): draw comment or tracking controls, markup and reviewers; no return.
 *   main(): create the main workspace container; return its element.
 *   navigation(main): draw project navigation and attach scrolling; no return.
 *   mirror(): mirror scroll geometry into unscored model.view; no return, no redraw.
 *   scrolling(el, key, targets, pitch): register pane geometry and scroll listeners, ignoring old episodes; no return.
 *   presentation(parent, index, thumbnail): replace decorative SVG artwork for a slide or thumbnail; no return.
 *   thumbnail(board, slide, i): draw a registered slide thumbnail and bind activation; return its element.
 *   rail(main): build thumbnail rail, sortable controller and scrolling pane; no return.
 *   ruler(editor, count): append count ruler ticks; no return.
 *   slideHeading(canvas): draw slide title, subtitle, eyebrow and footer references; no return.
 *   shape(canvas, shape, i): draw and register a shape (hidden under reorder artwork); return its element.
 *   shapeBehavior(el, i): attach selection, dragging, bounds and snapping to a shape; no return.
 *   notes(editor): draw the speaker notes strip; no return.
 *   themeInspector(inner): draw theme, layout, colour and accessibility details; no return.
 *   shapeInspector(inner): draw object properties and selectable layers; no return.
 *   inspector(main): draw a responsive inspector and attach scrolling; no return.
 *   fit(work, wrap, canvas): fit fixed 720x400 model canvas to workspace and set scale; no return.
 *   deck(main): compose deck rail, canvas, objects, notes and inspector; no return.
 *   outline(main): draw document outline above its breakpoint; return element or undefined.
 *   paper(docPane): draw document paper and heading; return { paper, body }.
 *   paragraph(body, text, i, outline, docPane): draw headed paragraph and outline link; return text node and phrase Range.
 *   revisionLine(body, i): draw inline tracked revision and retain before/after elements; no return.
 *   paperFooter(paper): draw document confidentiality footer; no return.
 *   document(main): compose document text, selection segments, scroll targets and review pane; no return.
 *   reviewFilters(side): draw review filter and previous/next utility buttons; no return.
 *   baseComment(listPane): draw seeded existing comment and reply prompt; no return.
 *   composer(side): draw and bind comment composer, Post and Cancel; no return.
 *   comments(side, body): compose comments list, empty state, composer and text selection; no return.
 *   changeCard(reviewPane, change, i): draw tracked change with accept/reject/undo controls; return action group.
 *   changes(side): compose tracked-change cards and scrolling targets; no return.
 *   review(main, body): draw review sidebar, filters and scenario list; no return.
 *   footer(): draw status bar and retain counters and zoom reference; no return.
 *   postedComment(parent, c, i): draw posted comment with Delete and reply prompt; return Delete button.
 *   sync(m): update common status, sortable order, then scenario visuals; no return.
 *   syncDeck(m): update thumbnails, artwork, shape styles, properties and toolbar; no return.
 *   thumbnailSynced(el, i, m): update thumbnail activation and its visible number; no return.
 *   shapeSynced(el, i, m): update a shape's position, typography and selection; no return.
 *   syncComments(m): update comment counters, composer, selection and posted cards; no return.
 *   syncChanges(m): update decisions, controls and inline tracked markup; no return.
 *   locate(t): read-only target lookup using controllers or registered elements; return [x,y].
 *   thumbnailDecorated(el, slide, i): after thumbnail drawing; default no-op.
 *   shapeDecorated(el, shape, i): after shape drawing; default no-op.
 *   cardDecorated(el, item, i): after comment/change card drawing (i null for seeded comment); default no-op.
 *   synced(m): after each visual sync, before layout mirroring; default no-op.
 *   rendered(ctx): after initial sync and mirror; default no-op.
 * S.ctx/spec/size/root/isDoc expose the current episode; S.refs/panes/shapeEls/revisionEls
 * expose registered DOM. S.segments holds text selection segments. S.sortable/selection,
 * scale/deckTitle/guide/slideArt/commentList/composerBox/draftField/statusCount/statusExtra
 * are writable for replacement layouts and builders; retain references used by sync.
 * S.D/P expose resolved tokens and parts. No DOM work runs before render.
 * Preserve the office-decoration fork and personName draw in render; extra randomness
 * belongs on a separate ctx.rng.fork(label). Model coordinates stay 720x400.
 */
(function () {
  'use strict';
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
  const CSS = (D) => `
    .as-app{display:flex;flex-direction:column;overflow:hidden;border:1px solid var(--line);border-radius:9px;background:var(--panel);color:var(--fg);font:12px/1.4 ${D.uiFont};box-shadow:0 8px 26px #0001}
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
    .as-thumbs{position:relative;margin:6px 7px}.as-thumb{position:absolute;left:0;width:100%;height:${D.thumbnailHeight}px;background:var(--panel);border:1px solid var(--line);border-radius:4px;cursor:grab;padding:6px 7px 5px 20px;overflow:hidden;touch-action:none}
    .as-thumb.active{border:2px solid var(--accent)}.as-thumb.dragging{z-index:10;opacity:.85;box-shadow:0 6px 12px #0003}.as-num{position:absolute;left:5px;top:7px;font-size:9px;color:var(--muted)}
    .as-thumb strong{font-size:9px;display:block}.as-thumb small{font-size:7px;color:var(--muted);display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.as-mini{display:flex;gap:3px;margin-top:8px}.as-mini i{height:12px;width:24%;border-radius:2px;background:color-mix(in srgb,var(--accent) 22%,var(--panel));border-bottom:2px solid var(--accent)}
    .as-editor{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column;background:var(--bg)}
    .as-work{flex:1;min-height:0;display:flex;align-items:center;justify-content:center;padding:14px;overflow:hidden;position:relative}
    .as-slidewrap{position:relative;flex:none;box-shadow:0 3px 12px #0002}.as-canvas{width:720px;height:400px;position:absolute;top:0;left:0;transform-origin:top left;background:var(--panel);overflow:hidden}
    .as-slidehead{position:absolute;left:40px;top:28px;font-weight:700;font-size:27px;letter-spacing:-.03em}.as-slidesub{position:absolute;left:42px;top:67px;font-size:12px;color:var(--muted)}
    .as-shape{position:absolute;width:110px;height:48px;display:flex;align-items:center;justify-content:center;cursor:move;border:1px solid color-mix(in srgb,var(--accent) 40%,var(--line));border-radius:5px;background:color-mix(in srgb,var(--accent) 8%,var(--panel));white-space:nowrap;touch-action:none}
    .as-shape.selected{outline:2px solid var(--accent);outline-offset:3px}.as-shape.selected:after{content:'';position:absolute;inset:-7px;background:linear-gradient(var(--accent),var(--accent)) left top/6px 6px no-repeat,linear-gradient(var(--accent),var(--accent)) right bottom/6px 6px no-repeat;pointer-events:none}
    .as-guide{position:absolute;pointer-events:none;border-top:1px dashed ${D.guideColor};left:0;right:0;display:none;z-index:5}.as-guide.on{display:block}
    .as-notes{height:34px;flex:none;padding:8px 14px;border-top:1px solid var(--line);font-size:11px;color:var(--muted);background:var(--panel)}
    .as-status{display:flex;gap:14px;align-items:center;padding:5px 12px;height:28px;border-top:1px solid var(--line);flex:none;color:var(--muted);font-size:10px;white-space:nowrap}.as-status .as-owner{margin-left:auto;max-width:45%;overflow:hidden;text-overflow:ellipsis}
    .as-inspector{width:152px;flex:none;border-left:1px solid var(--line);background:var(--panel);padding:12px;font-size:11px;overflow:auto}.as-inspector h4{margin:0 0 14px;font-size:12px}.as-inspector p{margin:8px 0;color:var(--muted)}
    .as-inspector dl{display:grid;grid-template-columns:1fr auto;gap:7px}.as-inspector dt{color:var(--muted)}.as-inspector dd{margin:0}.as-inspector hr{border:0;border-top:1px solid var(--line);margin:14px 0}
    .as-doc{padding:22px 26px;max-width:650px;margin:18px auto;background:var(--panel);border:1px solid var(--line);min-height:100%;box-shadow:0 2px 6px #0001;font:13px/1.85 ${D.documentFont};color:var(--fg);user-select:text;-webkit-user-select:text}
    .as-doc h2{font:650 22px/1.2 ${D.uiFont};margin:4px 0 7px}.as-docmeta{font:10px ${D.uiFont};color:var(--muted);margin-bottom:22px;user-select:none}.as-doc p{margin:0 0 20px}.as-doctext::selection,.as-doctext *::selection{background:color-mix(in srgb,var(--accent) 30%,transparent)}
    .as-review{width:224px;flex:none;border-left:1px solid var(--line);display:flex;flex-direction:column;background:var(--panel);min-height:0}
    .as-card{margin:9px;padding:12px;border:1px solid var(--line);border-radius:6px;background:var(--panel);font-size:11px;overflow-wrap:anywhere}.as-cardhead{font-weight:650;display:flex;align-items:center;justify-content:space-between;gap:6px}.as-time{color:var(--muted);font-size:10px;margin:3px 0 8px}.as-quote{border-left:2px solid var(--accent);padding-left:8px;color:var(--muted);margin:7px 0}
    .as-card p{margin:6px 0}.as-card button{font-size:11px}.as-card textarea{width:100%;height:76px;resize:none;border:1px solid var(--line);border-radius:4px;background:var(--panel);padding:7px;user-select:text}
    .as-actions{display:flex;gap:5px;margin-top:9px}.as-primary{background:var(--accent);color:white!important;border:0;border-radius:4px;padding:6px 11px;cursor:pointer}
    .as-del{color:${D.deletionColor};text-decoration:line-through;background:color-mix(in srgb,${D.deletionColor} 10%,var(--panel))}.as-ins{color:${D.insertionColor};text-decoration:underline;background:color-mix(in srgb,${D.insertionColor} 10%,var(--panel))}
    [data-theme=dark] .as-del{color:${D.darkDeletionColor}}[data-theme=dark] .as-ins{color:${D.darkInsertionColor}}
    .as-change{min-height:152px}.as-resolution{font-weight:600;color:var(--accent);margin:5px 0}.as-app.compact .as-rail{width:112px}.as-app.compact .as-review{width:202px}.as-app.compact .as-doc{padding:16px;margin:10px}.as-app.compact .as-menu{gap:11px}
    .as-app{border-radius:6px;font-size:12px}.as-ico{width:16px;height:16px;flex:none;vertical-align:middle;pointer-events:none;fill:none;stroke:currentColor;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round}
    .as-tool,.as-pill{display:inline-flex;align-items:center;justify-content:center;gap:6px}.as-app [hidden]{display:none!important}.as-head{height:46px}.as-logo{width:29px;height:31px;border-radius:5px}.as-head-actions{display:flex;align-items:center;gap:6px;flex:none}.as-head-actions .as-tool{padding:5px}.as-share{background:var(--accent);color:white!important}
    .as-presence{display:flex;margin-right:5px}.as-presence .as-avatar{border:2px solid var(--panel);margin-left:-5px;font-size:10px;background:color-mix(in srgb,var(--accent) 12%,var(--panel))}.as-dot{display:inline-block;width:5px;height:5px;border-radius:50%;background:${D.presenceColor};margin:0 5px 1px 0}
    .as-filetabs{height:26px;flex:none;display:flex;align-items:stretch;background:var(--bg);border-bottom:1px solid var(--line);gap:1px;padding-left:10px;overflow:hidden}.as-filetab{display:flex;align-items:center;gap:6px;padding:0 12px;color:var(--muted);font-size:10px;border-right:1px solid var(--line);white-space:nowrap}.as-filetab.active{background:var(--panel);color:var(--fg);border-top:2px solid var(--accent)}.as-filetab .as-ico{width:12px;height:12px}.as-filetab button{padding:0;border:0;background:none}
    .as-menu{height:25px;padding-left:12px;gap:18px}.as-menu b{height:25px}.as-quick{height:31px;display:flex;align-items:center;gap:4px;padding:2px 10px;border-bottom:1px solid var(--line);flex:none;background:color-mix(in srgb,var(--fg) 2%,var(--panel))}.as-quick .as-tool{min-height:25px;padding:3px 6px}.as-fontname{width:98px;justify-content:space-between}.as-tools{min-height:37px;padding:4px 9px;gap:3px;flex-wrap:nowrap;overflow:hidden}.as-tools .as-tool{font-size:11px;min-height:27px;padding:3px 5px}.as-tools .as-sub{white-space:nowrap}.as-group-caption{margin-left:auto;color:var(--muted);font-size:10px}.as-tool small{font-size:10px;color:var(--muted)}
    .as-projects{width:${D.navigationWidth}px;flex:none;border-right:1px solid var(--line);padding:9px 7px;background:color-mix(in srgb,var(--fg) 2%,var(--panel));overflow:auto;scrollbar-width:thin}.as-projects h5{font-size:9px;letter-spacing:.07em;color:var(--muted);margin:14px 5px 7px;text-transform:uppercase}.as-projects .as-tool{display:flex;width:100%;justify-content:flex-start;text-align:left;font-size:10px;padding:7px 6px;gap:7px}.as-projects .as-tool span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.as-projects .as-tool.current{background:color-mix(in srgb,var(--accent) 12%,var(--panel));color:var(--accent)}.as-projects .as-ico{width:15px;height:15px}.as-projects small{display:block;font-size:9px;color:var(--muted);padding-left:27px;margin-top:-4px}.as-projects.narrow{width:38px;padding:8px 2px}.as-projects.narrow h5,.as-projects.narrow small,.as-projects.narrow .as-tool span{display:none}.as-projects.narrow .as-tool{justify-content:center;padding:8px 3px}
    .as-rail{width:${D.railWidth}px}.as-cap{height:28px;font-size:9px;letter-spacing:.02em}.as-cap .as-ico{width:13px;height:13px}.as-thumb{padding:0 0 0 16px;border:0;background:none;height:${D.thumbnailHeight}px;overflow:visible}.as-thumb.active{border:0}.as-num{left:0;top:3px}.as-preview{position:absolute;left:16px;right:0;top:0;height:${D.thumbnailHeight - 2}px;border:1px solid var(--line);border-radius:2px;background:var(--panel);overflow:hidden}.as-thumb.active .as-preview{outline:2px solid var(--accent);outline-offset:1px}.as-preview svg{display:block;width:100%;height:100%;color:var(--fg)}.as-thumb strong,.as-thumb small{display:none}
    .as-ruler{height:17px;flex:none;background:color-mix(in srgb,var(--fg) 2%,var(--panel));border-bottom:1px solid var(--line);font-size:8px;color:var(--muted);display:flex;justify-content:space-around;align-items:center;padding:0 22px;background-image:repeating-linear-gradient(90deg,transparent 0 19px,var(--line) 19px 20px)}.as-work{padding:12px}.as-canvas{background:var(--panel);border-top:5px solid var(--accent)}.as-slidehead{top:28px;font-size:28px}.as-slidesub{top:69px}.as-slidefoot{position:absolute;left:40px;right:40px;bottom:15px;display:flex;justify-content:space-between;color:var(--muted);font-size:8px;border-top:1px solid var(--line);padding-top:7px;pointer-events:none}.as-slidefoot.align-footer{bottom:66px}.as-slideeyebrow{position:absolute;right:38px;top:35px;color:var(--muted);font-size:9px;letter-spacing:1px}.as-notes{height:30px;display:flex;align-items:center;gap:8px;padding:5px 12px}.as-status{height:25px;gap:10px;padding:3px 10px}.as-status .as-ico{width:12px;height:12px}.as-status-tail{margin-left:auto;display:flex;align-items:center;gap:8px}.as-status .as-owner{margin-left:0;max-width:none}.as-zoomtrack{width:65px;height:3px;background:var(--line);position:relative}.as-zoomtrack:after{content:'';position:absolute;left:32px;top:-3px;width:7px;height:9px;border-radius:2px;background:var(--muted)}
    .as-inspector{width:${D.inspectorWidth}px;padding:0;display:flex;flex-direction:column;overflow:hidden}.as-inspector-body{padding:12px;overflow:auto;scrollbar-width:thin;flex:1;min-height:0}.as-inspector h4{padding:10px 12px;margin:0;border-bottom:1px solid var(--line)}.as-inspector p{display:flex;align-items:center;justify-content:space-between;font-weight:600;color:var(--fg);font-size:10px}.as-inspector dl{gap:6px;font-size:10px}.as-inspector dd{background:var(--bg);border:1px solid var(--line);min-width:45px;padding:2px 5px;border-radius:3px}.as-inspector .as-layer{display:flex;gap:7px;align-items:center;padding:7px;border:1px solid var(--line);margin-top:5px;font-size:10px;cursor:pointer}.as-inspector .as-layer.active{border-color:var(--accent);color:var(--accent)}.as-inspector .as-layer .as-ico{width:12px;height:12px}
    .as-outline{width:${D.outlineWidth}px;flex:none;padding:0 10px;background:var(--panel);border-right:1px solid var(--line);font-size:10px;overflow:auto}.as-outline h4{font-size:11px;margin:13px 0}.as-outline p{padding:7px 0;color:var(--muted);border-bottom:1px solid var(--line)}.as-outline .active{color:var(--accent);font-weight:600}.as-doc{max-width:650px;margin:16px auto;padding:24px 34px;font:13px/1.8 ${D.documentFont};min-height:760px}.as-dochead{display:flex;justify-content:space-between;font:8px ${D.uiFont};color:var(--muted);border-bottom:1px solid var(--line);padding-bottom:9px;margin-bottom:24px;letter-spacing:.08em}.as-doc h3{font:600 13px ${D.uiFont};margin:20px 0 9px}.as-doc p{margin-bottom:16px}.as-docfooter{margin-top:35px;border-top:1px solid var(--line);padding-top:10px;color:var(--muted);font:9px ${D.uiFont};display:flex;justify-content:space-between}.as-revisionline{padding:7px 10px;border-left:2px solid color-mix(in srgb,var(--accent) 65%,transparent);background:color-mix(in srgb,var(--accent) 3%,var(--panel));position:relative}.as-revisionline:after{content:attr(data-reviewer);position:absolute;right:0;top:-13px;font:8px ${D.uiFont};color:var(--muted)}
    .as-review{width:${D.reviewWidth}px}.as-reviewfilters{display:flex;align-items:center;gap:5px;padding:7px 9px;border-bottom:1px solid var(--line);font-size:10px;flex:none}.as-reviewfilters .as-pill{font-size:9px;padding:3px 6px;background:var(--bg)}.as-reviewfilters .as-ico{width:12px;height:12px}.as-card{margin:8px;border-radius:5px;padding:10px;font-size:11px}.as-cardhead{justify-content:flex-start;gap:6px;font-size:10px}.as-cardhead .as-avatar{width:22px;height:22px;font-size:9px}.as-cardhead .as-threadmore{margin-left:auto;color:var(--muted)}.as-time{font-size:9px;margin:3px 0 8px 28px}.as-card .as-quote{font-size:10px;max-height:38px;overflow:hidden}.as-threadreply{color:var(--muted);font-size:9px;border-top:1px solid var(--line);margin-top:9px;padding-top:7px}.as-threadreply .as-ico{width:11px;height:11px;margin-right:4px}.as-empty{padding:12px;color:var(--muted);font-size:10px}.as-empty .as-ico{margin-right:5px}.as-change{min-height:158px}.as-change .as-time{margin-left:0}.as-resolution{font-size:10px}.as-card .as-actions{margin-top:7px}.as-actions .as-tool{font-size:10px;padding:3px 5px}.as-card textarea{height:57px}.as-reviewnav{display:flex;gap:5px;margin-left:auto}.as-reviewnav .as-ico{width:11px;height:11px}
    .as-popover{position:absolute;z-index:90;right:12px;top:44px;width:275px;padding:14px;background:var(--panel);border:1px solid var(--line);border-radius:6px;box-shadow:0 8px 25px #0003}.as-popover h4{font-size:13px;margin:0 0 10px;display:flex;justify-content:space-between;align-items:center}.as-popover p{font-size:11px;margin:8px 0;color:var(--muted)}.as-popover .as-tool{font-size:11px}.as-app{position:relative}.as-save{display:inline-flex;align-items:center;gap:4px}.as-save .as-ico{width:11px;height:11px}.as-quiet{color:var(--muted)}
    .as-app.compact .as-review{width:${D.compactReviewWidth}px}.as-app.compact .as-rail{width:${D.compactRailWidth}px}.as-app.compact .as-doc{padding:20px;margin:12px}.as-app.compact .as-group-caption{display:none}.as-app.tight .as-head-actions .as-optional,.as-app.tight .as-presence,.as-app.tight .as-status-tail .as-zoomtrack{display:none}.as-app.tight .as-tools{gap:1px}.as-app.tight .as-tools .as-tool{font-size:10px;gap:3px}.as-app.tight .as-quick .as-optional{display:none}
  `;

  const TOKENS = {
    icons: ICONS,
    toolIcons: { selectAll: 'select', top: 'top', middle: 'middle', bottom: 'bottom', distribute: 'distribute', bold: 'bold', italic: 'italic', comment: 'comment', post: 'send' },
    uiFont: 'system-ui',
    documentFont: 'Georgia,serif',
    guideColor: '#d548a5',
    deletionColor: '#b9424c',
    insertionColor: '#258468',
    darkDeletionColor: '#f6949f',
    darkInsertionColor: '#67c9af',
    presenceColor: '#2ba67c',
    editorLabel: 'Lattice Office editor',
    brand: 'Lattice Office',
    workspace: 'Team space',
    documentTitle: 'Team briefing',
    slideEyebrow: 'LATTICE / TEAM BRIEFING',
    slideFooter: 'Internal working draft / Planning & delivery',
    notesLabel: 'Speaker notes',
    notesText: 'Discuss dependencies and agree on next steps.',
    commentPlaceholder: 'Add a comment…',
    frameInset: 24,
    compactAt: 1100,
    tightAt: 850,
    navigationAt: 1200,
    inspectorAt: 1100,
    outlineAt: 1140,
    railWidth: 154,
    compactRailWidth: 130,
    reviewWidth: 250,
    compactReviewWidth: 220,
    inspectorWidth: 182,
    navigationWidth: 140,
    outlineWidth: 142,
    thumbnailPitch: 68,
    thumbnailHeight: 61,
    canvasInsetX: 28,
    canvasInsetY: 56,
    maxScale: 1.4,
    sections: ['Overview', 'Scope & priorities', 'Delivery approach', 'Dependencies', 'Decisions', 'Next steps', 'Appendix'],
    revisionContexts: ['The pilot is scheduled to run for ', 'Implementation will be led by ', 'We recommend starting with ', 'The launch depends on ', 'The steering group expects ', 'Planning is based on ', 'Questions will be revisited during '],
    layouts: ['Title & overview', 'Chart & callout', 'Delivery roadmap'],
    menus: { File: ['New file', 'Open recent', 'Make a copy', 'Download', 'Print'], Edit: ['Undo', 'Redo', 'Find and replace'], View: ['Show ruler', 'Show outline', 'Fit to window', 'Full screen'], Insert: ['Text box', 'Image', 'Table', 'Link'], Format: ['Text', 'Paragraph', 'Arrange', 'Format options'], Review: ['Comments', 'Track changes', 'Version history'], Help: ['Keyboard shortcuts', 'Office help', 'Send feedback'] },
  };

  function installFrameParts(BASE, page) {
    BASE.styles = (ctx) => {
      ctx.css('app-slides-classic', CSS(page.D));
    };

    BASE.layout = (ctx) => {
      page.root = page.P.frame(ctx);
      page.P.popover();
      page.P.head();
      page.P.fileTabs();
      page.P.menu();
      page.P.quickTools();
      page.P.tools();
      const main = page.P.main();
      page.P.navigation(main);
      if (page.isDoc) page.P.document(main);
      else page.P.deck(main);
      page.P.footer();
    };

    BASE.frame = (ctx) => {
      const el = page.u.el('section', 'as-app' + (page.size.width < page.D.compactAt ? ' compact' : '') + (page.size.width < page.D.tightAt ? ' tight' : ''), ctx.stage);
      el.style.width = `${Math.max(1, page.size.width - page.D.frameInset)}px`;
      el.style.height = `${Math.max(1, page.size.height - page.D.frameInset)}px`;
      el.setAttribute('aria-label', page.D.editorLabel);
      return el;
    };

    BASE.commit = (patch) => {
      page.ctx.update({ ...page.ctx.model, ...patch }); page.P.sync(page.ctx.model); page.P.mirror();
    };

    BASE.register = (el, key) => {
      page.refs[key] = el; return el;
    };

    BASE.icon = (parent, name) => {
      const el = page.u.svg('svg', { viewBox: '0 0 24 24', class: 'as-ico', 'aria-hidden': 'true' }, parent);
      el.innerHTML = page.D.icons[name] || page.D.icons.more; return el;
    };

    BASE.button = (parent, label, key, fn, cls = 'as-tool', glyph) => {
      const b = page.u.el('button', cls, parent); b.type = 'button'; b.title = label; b.setAttribute('aria-label', label);
      const which = glyph || (key?.startsWith('tool:') ? page.D.toolIcons[key.slice(5)] : key?.startsWith('revision:') ? { accept: 'check', reject: 'close', undo: 'undo' }[key.split(':')[2]] : key?.startsWith('deleteComment:') ? 'trash' : null);
      if (which) page.P.icon(b, which);
      if (label && !['tool:bold', 'tool:italic'].includes(key)) page.u.el('span', '', b, label);
      if (key) page.P.register(b, key); if (fn) b.addEventListener('click', fn); return b;
    };

    BASE.popover = () => {
      page.popover = page.u.el('div', 'as-popover', page.root); page.popover.hidden = true;
    };

    BASE.panel = (title, lines) => {
      page.popover.replaceChildren(); page.popover.hidden = false;
      const h = page.u.el('h4', '', page.popover, title);
      page.P.button(h, 'Close', null, () => { page.popover.hidden = true; }, 'as-tool', 'close');
      for (const line of lines) page.u.el('p', '', page.popover, line);
    };

    BASE.utility = (parent, label, glyph, title, lines, cls = 'as-tool') => {
      return page.P.button(parent, label, null, () => page.P.panel(title || label, lines || ['This file is up to date.', 'Your changes are saved in Team space.']), cls, glyph);
    };

    BASE.avatar = (parent, name, cls = 'as-avatar') => {
      const el = page.u.el('span', cls, parent, name.split(' ').map((p) => p[0]).slice(0, 2).join('')); el.title = name; return el;
    };

    BASE.cardHeader = (parent, author, time) => {
      const h = page.u.el('div', 'as-cardhead', parent); page.P.avatar(h, author); page.u.el('span', '', h, author);
      const more = page.u.el('span', 'as-threadmore', h); page.P.icon(more, 'more');
      page.u.el('div', 'as-time', parent, time);
    };
  }

  function installToolbarParts(BASE, page) {
    BASE.head = () => {
      const head = page.u.el('div', 'as-head', page.root);
      const logo = page.u.el('div', 'as-logo', head); page.P.icon(logo, page.isDoc ? 'document' : 'slides');
      const name = page.u.el('div', 'as-name', head);
      page.u.el('div', 'as-title', name, page.s.title + (page.isDoc ? ' / Review notes' : ''));
      const subtitle = page.u.el('div', 'as-sub', name, `${page.D.brand} / ${page.D.workspace} / `);
      const save = page.P.register(page.u.el('span', 'as-save', subtitle), 'save'); page.P.icon(save, 'check'); page.u.el('span', '', save, 'All changes saved');
      const headActions = page.u.el('div', 'as-head-actions', head);
      const presence = page.u.el('div', 'as-presence', headActions); page.teammates.forEach((who) => page.P.avatar(presence, who));
      page.P.utility(headActions, '', 'clock', 'Version history', [`Today, 10:42 - ${page.s.owner}`, 'Version 3: Updated team briefing', `Yesterday, 16:18 - ${page.s.baseComment.author}`, 'Version 2: Added review notes'], 'as-tool as-optional').setAttribute('aria-label', 'Version history');
      const notify = page.P.utility(headActions, '', 'bell', 'Activity', [`${page.s.baseComment.author} left a comment on this draft.`, 'Delivery plan was shared with the team.', `${page.teammates[2]} is viewing the file.`], 'as-tool as-optional'); notify.setAttribute('aria-label', 'Activity');
      page.P.utility(headActions, 'Share', 'share', 'Share this file', ['General access: Restricted', ...page.teammates.map((who, i) => `${who} - ${i ? 'Can edit' : 'Owner'}`), 'Link sharing is available to members of Team space.'], 'as-tool as-share');
      page.P.utility(headActions, 'Editing', 'edit', 'Document mode', ['Editing - Make changes to this file', 'Viewing - Read without making changes', 'Your current mode is Editing.']);
    };

    BASE.fileTabs = () => {
      const filetabs = page.u.el('div', 'as-filetabs', page.root);
      for (const [i, title] of [page.isDoc ? 'Review notes.doc' : 'Team briefing.slides', 'Quarterly planning.slides', 'Launch checklist.doc'].entries()) {
        const tab = page.u.el('div', 'as-filetab' + (i === 0 ? ' active' : ''), filetabs); page.P.icon(tab, title.endsWith('.doc') ? 'document' : 'slides');
        page.u.el('span', '', tab, title); if (i === 0) page.P.icon(tab, 'close');
        else tab.addEventListener('click', () => page.P.panel(title, ['Last edited yesterday', 'Location: Team space / Planning', `Owned by ${page.teammates[i]}`, 'This file is available from Recent files.']));
      }
    };

    BASE.menu = () => {
      const menu = page.u.el('div', 'as-menu', page.root);
      const menus = page.D.menus;
      for (const [title, entries] of Object.entries(menus)) {
        const item = page.u.el(title === (page.isDoc ? 'Review' : 'Format') ? 'b' : 'span', '', menu, title);
        item.style.cursor = 'pointer'; item.addEventListener('click', () => page.P.panel(title, entries));
      }
    };

    BASE.quickTools = () => {
      const quick = page.u.el('div', 'as-quick', page.root);
      page.P.utility(quick, '', 'undo', 'Undo history', ['No earlier edits in this session.']).setAttribute('aria-label', 'Undo history');
      page.P.utility(quick, '', 'redo', 'Redo history', ['No edits to redo.']).setAttribute('aria-label', 'Redo history');
      page.P.utility(quick, '', 'print', 'Print preview', [page.isDoc ? 'Review notes - Portrait, A4' : 'Team briefing - Landscape, 16:9', 'Destination: Save as PDF', 'All pages'], 'as-tool as-optional').setAttribute('aria-label', 'Print preview');
      page.P.utility(quick, '', 'paint', 'Format painter', ['Select text or an object to copy its formatting.'], 'as-tool as-optional').setAttribute('aria-label', 'Format painter');
      page.u.el('span', 'as-sep', quick);
      page.P.utility(quick, 'Fit', 'search', 'Zoom', ['Fit to window', '50%', '75%', '100%', '125%']);
      page.u.el('span', 'as-sep', quick);
      page.P.utility(quick, 'Normal text', 'text', 'Text styles', ['Normal text', 'Title', 'Subtitle', 'Heading 1', 'Heading 2'], 'as-tool as-optional');
      page.P.utility(quick, 'Sans', 'chevron', 'Font family', ['Sans', 'Serif', 'Monospace', 'Recent fonts'], 'as-tool as-fontname');
      if (page.s.scenario !== 'restyle' && !page.s.judge) {
        page.u.el('span', 'as-pill', quick, page.isDoc ? '11' : '20');
        page.P.utility(quick, '', 'bold', 'Text formatting', ['Select text to apply bold formatting.']).setAttribute('aria-label', 'Bold');
        page.P.utility(quick, '', 'italic', 'Text formatting', ['Select text to apply italic formatting.']).setAttribute('aria-label', 'Italic');
      }
      page.u.el('span', 'as-sep', quick);
      page.P.utility(quick, '', 'link', 'Insert link', ['Select text or an object to add a link.'], 'as-tool as-optional').setAttribute('aria-label', 'Insert link');
      page.P.register(page.u.el('span', 'as-group-caption', quick), 'selectionStatus');
    };

    BASE.setStyle = (key, value) => {
      const styles = page.ctx.model.styles.map((st, i) => page.ctx.model.selected.includes(i) ? { ...st, [key]: typeof value === 'function' ? value(st[key]) : value } : st);
      page.P.commit({ styles });
    };

    BASE.tools = () => {
      const tools = page.u.el('div', 'as-tools', page.root);
      if (page.isDoc) page.P.reviewTools(tools);
      else if (page.s.scenario === 'align' && !page.s.judge) page.P.alignTools(tools);
      else if (page.s.scenario === 'restyle' || page.s.judge) page.P.styleTools(tools);
      else page.P.deckTools(tools);
    };

    BASE.alignTools = (tools) => {
      page.P.button(tools, 'Select all shapes', 'tool:selectAll', () => page.P.commit({ selected: page.s.shapes.map((_, i) => i) }));
      page.u.el('span', 'as-sep', tools);
      page.u.el('span', 'as-sub', tools, 'Align to slide');
      for (const [key, label, y] of [['top', 'Align top', 0], ['middle', 'Align middle', 176], ['bottom', 'Align bottom', 352]]) {
        page.P.button(tools, label, `tool:${key}`, () => page.P.commit({ positions: page.ctx.model.positions.map((p, i) => page.ctx.model.selected.includes(i) ? { ...p, y } : p) }));
      }
      page.P.button(tools, 'Distribute horizontally', 'tool:distribute', () => {
        const selected = page.ctx.model.selected.slice().sort((a, b) => page.ctx.model.positions[a].x - page.ctx.model.positions[b].x);
        if (selected.length < 2) return;
        const lo = page.ctx.model.positions[selected[0]].x, hi = page.ctx.model.positions[selected[selected.length - 1]].x;
        page.P.commit({ positions: page.ctx.model.positions.map((p, i) => selected.includes(i) ? { ...p, x: lo + (hi - lo) * selected.indexOf(i) / (selected.length - 1) } : p) });
      });
    };

    BASE.styleTools = (tools) => {
      page.u.el('span', 'as-sub', tools, 'Text formatting');
      const input = page.P.register(page.u.el('input', 'as-size', tools), 'field:size');
      input.type = 'text'; input.inputMode = 'numeric'; input.setAttribute('aria-label', 'Font size');
      input.addEventListener('input', () => { const n = Number(input.value); if (Number.isFinite(n) && n >= 8 && n <= 72) page.P.setStyle('size', n); });
      page.u.el('span', 'as-sub', tools, 'pt');
      page.P.button(tools, 'B', 'tool:bold', () => page.P.setStyle('bold', (v) => !v)).style.fontWeight = '800';
      page.P.button(tools, 'I', 'tool:italic', () => page.P.setStyle('italic', (v) => !v)).style.fontStyle = 'italic';
      page.u.el('span', 'as-sep', tools);
      page.u.el('span', 'as-sub', tools, 'Text colour');
      for (const [name, color] of Object.entries(page.F.helpers.COLORS)) {
        const b = page.P.button(tools, '', `color:${name}`, () => page.P.setStyle('color', name), 'as-color'); b.title = name; b.setAttribute('aria-label', name);
        page.u.el('i', '', b).style.background = color;
      }
    };

    BASE.deckTools = (tools) => {
      page.P.utility(tools, 'New slide', 'plus', 'New slide', ['Title slide', 'Title and body', 'Section header', 'Blank']);
      page.P.utility(tools, 'Layout', 'layout', 'Slide layout', ['Title and body', 'Two columns', 'Section header']);
      page.P.utility(tools, 'Theme', 'theme', 'Theme library', ['Lattice / Standard', 'Editorial / Soft', 'Pitch / Contrast']);
      page.P.utility(tools, 'Transition', 'slides', 'Slide transition', ['None', 'Fade', 'Slide from right']);
      page.P.utility(tools, 'Present', 'present', 'Presentation ready', [`${page.s.slides.length} slides`, 'Start from the beginning', 'Presenter view']);
    };

    BASE.reviewTools = (tools) => {
      if (page.s.scenario === 'comments') page.P.button(tools, 'New comment', 'tool:comment', () => {
        const v = page.ctx.model.selection; if (v.end <= v.start) return;
        page.P.commit({ composer: { open: true, start: v.start, end: v.end }, draft: '' }); page.draftField.focus();
      });
      else page.P.utility(tools, 'Track changes: On', 'edit', 'Tracking options', ['Track changes for everyone', 'Markup: All changes', 'Revisions are saved with the author name.']);
      page.P.utility(tools, 'All markup', 'eye', 'Show markup', ['Insertions and deletions', 'Comments', 'Formatting changes']);
      page.P.utility(tools, 'Reviewers', 'comment', 'Reviewers', page.teammates);
      page.u.el('span', 'as-group-caption', tools, page.s.scenario === 'comments' ? 'Review / Comments' : 'Review / Changes');
    };
  }

  function installPresentationParts(BASE, page) {
    BASE.main = () => {
      return page.u.el('div', 'as-main', page.root);
    };

    BASE.navigation = (main) => {
      const projects = page.u.el('aside', 'as-projects' + (page.size.width < page.D.navigationAt ? ' narrow' : ''), main);
      projects.setAttribute('aria-label', 'Workspace navigation');
      page.u.el('h5', '', projects, page.D.workspace);
      page.P.utility(projects, 'Recent files', 'clock', 'Recent files', ['Team briefing.slides - Today', 'Review notes.doc - Today', 'Quarterly planning.slides - Yesterday', 'Launch checklist.doc - Yesterday']);
      page.P.utility(projects, 'Shared with me', 'share', 'Shared with me', [`Quarterly planning - ${page.teammates[1]}`, `Budget review - ${page.teammates[2]}`, 'Brand resources - Design team']);
      page.P.utility(projects, 'Starred', 'folder', 'Starred files', ['Brand resources', 'Project calendar', 'Team handbook']);
      page.u.el('h5', '', projects, 'Projects');
      for (const [i, title] of ['Team briefing', 'Customer launch', 'Quarterly planning', 'Brand resources'].entries()) {
        page.P.utility(projects, title, i === 0 ? 'slides' : 'folder', title, [`Location: Team space / ${title}`, `${i + 3} files`, `Last edited by ${page.teammates[i % 3]}`], 'as-tool' + (i === 0 ? ' current' : ''));
        page.u.el('small', '', projects, i === 0 ? 'Open now' : `${i + 3} files`);
      }
      page.u.el('h5', '', projects, 'Activity');
      page.P.utility(projects, 'Notifications', 'bell', 'Notifications', [`${page.teammates[1]} mentioned the team in Review notes.`, 'Launch checklist has been updated.', 'No unread mentions in this file.']);
      page.P.utility(projects, 'File details', 'document', 'File details', [`Owner: ${page.s.owner}`, 'Location: Team space / Planning', 'Version: 3', 'Access: Team members only']);
      env.ui.scrollPane(projects, {});
    };

    BASE.mirror = () => {
      if (!page.root.isConnected) return;
      const view = {};
      for (const [key, p] of Object.entries(page.panes)) {
        const pr = p.el.getBoundingClientRect();
        const targets = p.targets ? p.targets.map((el) => {
          const r = el.getBoundingClientRect(); return [r.top - pr.top + p.el.scrollTop, r.bottom - pr.top + p.el.scrollTop];
        }) : [];
        view[key] = { scroll: p.el.scrollTop, height: p.el.clientHeight, pitch: p.pitch || 0, targets };
      }
      if (JSON.stringify(view) !== JSON.stringify(page.ctx.model.view)) page.ctx.update({ ...page.ctx.model, view });
    };

    BASE.scrolling = (el, key, targets, pitch) => {
      page.panes[key] = { el, targets, pitch };
      const episode = page.ctx;
      const mirror = () => { if (page.ctx === episode) page.P.mirror(); };
      env.ui.scrollPane(el, { onScroll: mirror });
      el.addEventListener('scroll', mirror);
    };

    BASE.presentation = (parent, index, thumbnail) => {
      parent.replaceChildren();
      const svg = page.u.svg('svg', { viewBox: '0 0 720 400', width: '100%', height: '100%', 'aria-hidden': 'true' }, parent);
      const rect = (x, y, w, h, fill, rx = 0) => page.u.svg('rect', { x, y, width: w, height: h, fill, rx }, svg);
      const text = (x, y, value, font = 18, fill = 'var(--fg)', weight = 400) => {
        const t = page.u.svg('text', { x, y, fill, 'font-size': font, 'font-family': page.D.uiFont, 'font-weight': weight }, svg); t.textContent = value;
      };
      if (thumbnail) {
        rect(0, 0, 720, 400, 'var(--panel)'); rect(0, 0, 720, 6, 'var(--accent)');
        text(40, 65, page.s.slides[index].title, 31, 'var(--fg)', 700);
        text(40, 95, page.s.slides[index].subtitle, 16, 'var(--muted)');
      }
      const muted = 'color-mix(in srgb,var(--accent) 12%,var(--panel))';
      if (page.s.scenario !== 'reorder' || page.s.judge) {
        page.s.shapes.forEach((shape, i) => {
          const p = page.ctx.model.positions[i], st = page.ctx.model.styles[i];
          rect(p.x, p.y, 110, 48, muted, 5);
          if (thumbnail) text(p.x + 12, p.y + 30, shape.label, st.size, page.F.helpers.COLORS[st.color], st.bold ? 700 : 400);
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
    };

    BASE.thumbnail = (board, slide, i) => {
      const card = page.P.register(page.u.el('div', 'as-thumb', board), `slide:${i}`);
      card.setAttribute('aria-label', `Slide ${slide.title}`);
      page.u.el('span', 'as-num', card, String(i + 1));
      const preview = page.u.el('div', 'as-preview', card); page.P.presentation(preview, i, true);
      card.addEventListener('click', () => page.P.commit({ activeSlide: i }));
      page.P.thumbnailDecorated(card, slide, i);
      return card;
    };

    BASE.rail = (main) => {
      const rail = page.u.el('aside', 'as-rail', main);
      const railHead = page.u.el('div', 'as-cap', rail, 'Slides'); page.P.icon(railHead, 'layout');
      const railPane = page.P.register(page.u.el('div', 'as-scroll', rail), 'pane:rail');
      const board = page.u.el('div', 'as-thumbs', railPane), cards = {};
      board.style.height = `${page.s.slides.length * page.D.thumbnailPitch}px`;
      page.s.slides.forEach((slide, i) => { cards[i] = page.P.thumbnail(board, slide, i); });
      page.sortable = env.ui.sortable(board, { order: page.ctx.model.order, items: cards,
        slotRect: (i) => ({ x: 0, y: i * page.D.thumbnailPitch, w: board.clientWidth, h: page.D.thumbnailHeight }), axis: 'y', activeClass: 'dragging',
        onChange: (order) => page.P.commit({ order }), label: 'slide thumbnails' });
      page.P.scrolling(railPane, 'rail', null, page.D.thumbnailPitch);
    };

    BASE.ruler = (editor, count) => {
      const ruler = page.u.el('div', 'as-ruler', editor);
      for (let i = 0; i < count; i++) page.u.el('span', '', ruler, String(i));
    };

    BASE.slideHeading = (canvas) => {
      page.deckTitle = page.u.el('div', 'as-slidehead', canvas);
      page.P.register(page.u.el('div', 'as-slidesub', canvas), 'slideSubtitle');
      page.u.el('div', 'as-slideeyebrow', canvas, page.D.slideEyebrow);
      const slideFoot = page.u.el('div', 'as-slidefoot' + (page.s.scenario === 'align' ? ' align-footer' : ''), canvas);
      page.u.el('span', '', slideFoot, page.D.slideFooter); page.P.register(page.u.el('span', '', slideFoot), 'slidePage');
    };

    BASE.shape = (canvas, shape, i) => {
      const el = page.P.register(page.u.el('div', 'as-shape', canvas, shape.label), `shape:${i}`);
      if (page.slideArt) el.hidden = true;
      el.setAttribute('aria-label', `Shape ${shape.label}`);
      page.P.shapeDecorated(el, shape, i);
      return el;
    };
  }

  function installDeckParts(BASE, page) {
    BASE.shapeBehavior = (el, i) => {
      let origin;
      env.ui.track(el, {
        start(p, e) {
          origin = { ...page.ctx.model.positions[i] };
          const selected = e.shiftKey ? (page.ctx.model.selected.includes(i) ? page.ctx.model.selected.filter((x) => x !== i) : [...page.ctx.model.selected, i]) : [i];
          page.P.commit({ selected });
        },
        move(p) {
          if (Math.hypot(p.dx, p.dy) < 3) return;
          let x = Math.max(0, Math.min(610, origin.x + p.dx / page.scale));
          let y = Math.max(0, Math.min(352, origin.y + p.dy / page.scale));
          const snapY = [0, 176, 352, ...page.ctx.model.positions.filter((_, j) => j !== i).map((q) => q.y)].find((v) => Math.abs(v - y) < 6);
          const snapX = [40, 570, page.F.helpers.distributedX(page.s, i)].find((v) => Math.abs(v - x) < 6);
          if (snapY !== undefined) y = snapY; if (snapX !== undefined) x = snapX;
          page.P.commit({ positions: page.ctx.model.positions.map((q, j) => j === i ? { x, y } : q) });
          page.guide.classList.toggle('on', snapY !== undefined); page.guide.style.top = `${y + 24}px`;
        },
        end() { page.guide.classList.remove('on'); },
      }, `shape ${i}`);
    };

    BASE.notes = (editor) => {
      const notes = page.u.el('div', 'as-notes', editor); page.P.icon(notes, 'notes'); page.u.el('span', '', notes, page.D.notesLabel); page.u.el('span', 'as-quiet', notes, page.D.notesText);
    };

    BASE.themeInspector = (inner) => {
      page.u.el('p', '', inner, 'Current theme'); page.u.el('div', 'as-pill', inner, 'Lattice / Standard');
      page.u.el('p', '', inner, 'Layout'); page.P.register(page.u.el('div', 'as-pill', inner), 'slideLayout');
      page.u.el('hr', '', inner); page.u.el('p', '', inner, 'Theme colours');
      const colors = page.u.el('div', 'as-actions', inner);
      for (const color of Object.values(page.F.helpers.COLORS)) { const swatch = page.u.el('span', 'as-color', colors); page.u.el('i', '', swatch).style.background = color; }
      page.u.el('p', '', inner, 'Master layouts');
      for (const layout of page.D.layouts) page.P.utility(inner, layout, 'layout', layout, ['Layout saved in Lattice / Standard', 'Available from the Layout menu'], 'as-layer');
      page.u.el('hr', '', inner); page.u.el('p', '', inner, 'Accessibility'); page.u.el('small', 'as-quiet', inner, 'Reading order follows the slide layout.');
    };

    BASE.shapeInspector = (inner) => {
      const label = page.u.el('p', '', inner, 'Size & rotation'); page.P.icon(label, 'chevron');
      page.P.register(page.u.el('div', 'as-empty', inner, 'Select an object to see its properties.'), 'inspectorEmpty');
      const dl = page.P.register(page.u.el('dl', '', inner), 'inspectorProperties');
      for (const [k, v] of [['Width', '110'], ['Height', '48'], ['Rotation', '0 deg'], ['X', '40'], ['Y', '112']]) { page.u.el('dt', '', dl, k); page.P.register(page.u.el('dd', '', dl, v), `property:${k}`); }
      page.u.el('hr', '', inner);
      for (const title of ['Text fitting', 'Fill & border', 'Drop shadow', 'Alt text']) { const p = page.u.el('p', '', inner, title); page.P.icon(p, 'chevron'); }
      page.u.el('hr', '', inner); page.u.el('p', '', inner, 'Selection pane');
      page.s.shapes.forEach((shape, i) => page.P.button(inner, shape.label, `layer:${i}`, () => page.P.commit({ selected: [i] }), 'as-layer', 'text'));
    };

    BASE.inspector = (main) => {
      if (page.size.width <= page.D.inspectorAt) return;
      page.inspector = page.u.el('aside', 'as-inspector', main);
      page.u.el('h4', '', page.inspector, page.slideArt ? 'Slide design' : 'Format options');
      const inner = page.u.el('div', 'as-inspector-body', page.inspector);
      if (page.slideArt) page.P.themeInspector(inner);
      else page.P.shapeInspector(inner);
      env.ui.scrollPane(inner, {});
    };

    BASE.fit = (work, wrap, canvas) => {
      const wr = work.getBoundingClientRect();
      page.scale = Math.min((wr.width - page.D.canvasInsetX) / 720, (wr.height - page.D.canvasInsetY) / 400, page.D.maxScale);
      page.scale = Math.max(.1, page.scale);
      wrap.style.width = `${720 * page.scale}px`; wrap.style.height = `${400 * page.scale}px`; canvas.style.transform = `scale(${page.scale})`;
    };

    BASE.deck = (main) => {
      page.P.rail(main);
      const editor = page.u.el('div', 'as-editor', main);
      page.P.ruler(editor, 13);
      const work = page.u.el('div', 'as-work', editor);
      const wrap = page.u.el('div', 'as-slidewrap', work), canvas = page.u.el('div', 'as-canvas', wrap);
      if (page.s.scenario === 'reorder' && !page.s.judge) {
        page.slideArt = page.u.el('div', '', canvas); Object.assign(page.slideArt.style, { position: 'absolute', inset: '0', pointerEvents: 'none' });
      }
      page.P.slideHeading(canvas);
      page.guide = page.u.el('div', 'as-guide', canvas);
      page.s.shapes.forEach((shape, i) => {
        const el = page.shapeEls[i] = page.P.shape(canvas, shape, i);
        page.P.shapeBehavior(el, i);
      });
      page.P.notes(editor);
      page.P.inspector(main);
      page.P.fit(work, wrap, canvas);
    };
  }

  function installDocumentParts(BASE, page) {
    BASE.outline = (main) => {
      let outline;
      if (page.size.width > page.D.outlineAt) {
        outline = page.u.el('aside', 'as-outline', main);
        page.u.el('h4', '', outline, 'Document outline');
        page.u.el('p', 'active', outline, page.D.documentTitle);
      }
      return outline;
    };

    BASE.paper = (docPane) => {
      const paper = page.u.el('article', 'as-doc', docPane);
      const paperHead = page.u.el('div', 'as-dochead', paper); page.u.el('span', '', paperHead, 'LATTICE / TEAM SPACE'); page.u.el('span', '', paperHead, 'INTERNAL WORKING COPY');
      page.u.el('h2', '', paper, page.D.documentTitle);
      page.u.el('div', 'as-docmeta', paper, `Prepared by ${page.s.owner} / Version 3 / Planning & delivery`);
      const body = page.u.el('div', 'as-doctext', paper);
      return { paper, body };
    };

    BASE.paragraph = (body, text, i, outline, docPane) => {
      const heading = page.u.el('h3', '', body, `${i + 1}. ${page.D.sections[i]}`);
      if (outline) {
        const entry = page.u.el('p', '', outline, `${i + 1}. ${page.D.sections[i]}`); entry.style.cursor = 'pointer';
        entry.addEventListener('click', () => { docPane.scrollTop += heading.getBoundingClientRect().top - docPane.getBoundingClientRect().top - 10; page.P.mirror(); });
      }
      const p = page.u.el('p', '', body, text);
      const range = document.createRange(); range.setStart(p.firstChild, 0); range.setEnd(p.firstChild, page.s.phrases[i].text.length);
      return { node: p.firstChild, range };
    };

    BASE.revisionLine = (body, i) => {
      const c = page.s.changes[i % page.s.changes.length], line = page.u.el('p', 'as-revisionline', body, page.D.revisionContexts[i]);
      line.dataset.reviewer = c.author;
      const before = page.u.el('span', 'as-del', line, c.before); page.u.el('span', '', line, ' '); const after = page.u.el('span', 'as-ins', line, c.after);
      page.u.el('span', '', line, '.');
      page.revisionEls.push({ before, after });
    };

    BASE.paperFooter = (paper) => {
      const paperFoot = page.u.el('div', 'as-docfooter', paper); page.u.el('span', '', paperFoot, 'Confidential / Team members only'); page.u.el('span', '', paperFoot, 'Planning & delivery');
    };

    BASE.document = (main) => {
      const outline = page.P.outline(main);
      const editor = page.u.el('div', 'as-editor', main);
      page.P.ruler(editor, 11);
      const docPane = page.P.register(page.u.el('div', 'as-scroll', editor), 'pane:document');
      const { paper, body } = page.P.paper(docPane), paragraphEls = [];
      let offset = 0;
      page.s.paragraphs.forEach((text, i) => {
        const { node, range } = page.P.paragraph(body, text, i, outline, docPane);
        paragraphEls.push(range); page.segments.push({ node, start: offset }); offset += text.length + 2;
        if (page.s.scenario === 'trackchanges') page.P.revisionLine(body, i);
      });
      page.P.paperFooter(paper);
      page.P.scrolling(docPane, 'document', paragraphEls);
      page.P.review(main, body);
    };

    BASE.reviewFilters = (side) => {
      const filters = page.u.el('div', 'as-reviewfilters', side);
      page.P.utility(filters, page.s.scenario === 'comments' ? 'All comments' : 'All reviewers', 'chevron', 'Review filters', page.s.scenario === 'comments' ? ['Open comments', 'Resolved comments', 'All comments', 'Mentions of me'] : ['All reviewers', ...page.teammates], 'as-pill');
      const reviewNav = page.u.el('div', 'as-reviewnav', filters);
      page.P.utility(reviewNav, '', 'left', 'Review navigation', ['Use the review pane to see earlier suggestions.']).setAttribute('aria-label', 'Previous review');
      page.P.utility(reviewNav, '', 'right', 'Review navigation', ['Use the review pane to see later suggestions.']).setAttribute('aria-label', 'Next review');
    };

    BASE.baseComment = (listPane) => {
      const base = page.u.el('div', 'as-card', listPane);
      page.P.cardHeader(base, page.s.baseComment.author, 'Today, 09:18 / Draft review');
      page.u.el('div', 'as-quote', base, page.D.documentTitle); page.u.el('p', '', base, page.s.baseComment.text);
      const reply = page.u.el('div', 'as-threadreply', base); page.P.icon(reply, 'comment'); page.u.el('span', '', reply, 'Reply or mention someone');
      page.P.cardDecorated(base, page.s.baseComment, null);
    };
  }

  function installReviewParts(BASE, page) {
    BASE.composer = (side) => {
      page.composerBox = page.u.el('div', 'as-card', side); page.composerBox.style.flex = 'none';
      const composerHead = page.u.el('div', 'as-cardhead', page.composerBox); page.P.avatar(composerHead, page.s.owner); page.u.el('span', '', composerHead, 'New comment');
      page.P.register(page.u.el('div', 'as-quote', page.composerBox), 'quote');
      page.draftField = page.P.register(page.u.el('textarea', '', page.composerBox), 'field:comment'); page.draftField.setAttribute('aria-label', 'Comment text'); page.draftField.placeholder = page.D.commentPlaceholder;
      page.draftField.addEventListener('input', () => page.P.commit({ draft: page.draftField.value }));
      const actions = page.u.el('div', 'as-actions', page.composerBox);
      page.P.button(actions, 'Post', 'tool:post', () => {
        if (!page.ctx.model.draft.trim()) return;
        const c = page.ctx.model.composer;
        page.P.commit({ comments: [...page.ctx.model.comments, { start: c.start, end: c.end, text: page.ctx.model.draft }], draft: '', composer: { ...c, open: false } });
      }, 'as-primary');
      page.P.button(actions, 'Cancel', null, () => page.P.commit({ composer: { ...page.ctx.model.composer, open: false }, draft: '' }));
    };

    BASE.comments = (side, body) => {
      const listPane = page.u.el('div', 'as-scroll', side);
      page.P.register(listPane, 'pane:comments'); page.P.scrolling(listPane, 'comments', []);
      page.P.baseComment(listPane);
      page.commentList = page.u.el('div', '', listPane);
      const empty = page.P.register(page.u.el('div', 'as-empty', listPane), 'commentEmpty'); page.P.icon(empty, 'check'); page.u.el('span', '', empty, 'No unread comments in this file');
      page.P.composer(side);
      page.selection = env.ui.textSelection(body, { segments: page.segments, length: page.s.doc.length, value: page.ctx.model.selection,
        onChange: (v) => page.P.commit({ selection: v }), label: 'comment anchor' });
    };

    BASE.changeCard = (reviewPane, change, i) => {
      const card = page.u.el('div', 'as-card as-change', reviewPane);
      page.P.cardHeader(card, change.author, `Today, ${9 + Math.floor(i / 3)}:${String(12 + i * 4).padStart(2, '0')} / Text replacement`);
      page.u.el('div', 'as-quote', card, `${i + 1}. ${page.D.sections[i]}`);
      page.u.el('span', 'as-del', card, change.before); page.u.el('span', '', card, ' '); page.P.icon(card, 'next'); page.u.el('span', '', card, ' '); page.u.el('span', 'as-ins', card, change.after);
      page.P.register(page.u.el('div', 'as-resolution', card), `resolution:${i}`);
      const actions = page.u.el('div', 'as-actions', card);
      for (const [action, label] of [['accept', 'Accept'], ['reject', 'Reject'], ['undo', 'Undo']]) page.P.button(actions, label, `revision:${i}:${action}`, () => page.P.commit({ decisions: page.ctx.model.decisions.map((x, j) => i === j ? action === 'undo' ? 'pending' : action : x) }));
      page.P.cardDecorated(card, change, i);
      return actions;
    };

    BASE.changes = (side) => {
      const reviewPane = page.P.register(page.u.el('div', 'as-scroll', side), 'pane:review');
      const actionGroups = [];
      page.s.changes.forEach((change, i) => { actionGroups.push(page.P.changeCard(reviewPane, change, i)); });
      page.P.scrolling(reviewPane, 'review', actionGroups);
    };

    BASE.review = (main, body) => {
      const side = page.u.el('aside', 'as-review', main);
      const cap = page.P.register(page.u.el('div', 'as-cap', side), 'reviewCount');
      page.P.reviewFilters(side);
      if (page.s.scenario === 'comments') page.P.comments(side, body);
      else page.P.changes(side);
      cap.textContent = page.s.scenario === 'comments' ? 'Comments' : 'Suggested changes';
    };

    BASE.footer = () => {
      const footer = page.P.register(page.u.el('footer', 'as-status', page.root), 'status');
      page.P.icon(footer, page.isDoc ? 'document' : 'slides');
      page.statusCount = page.u.el('span', '', footer); page.statusExtra = page.u.el('span', '', footer);
      const tail = page.u.el('div', 'as-status-tail', footer);
      page.u.el('span', 'as-owner', tail, `Owner: ${page.s.owner}`);
      page.P.icon(tail, 'layout'); page.u.el('span', 'as-zoomtrack', tail); page.P.register(page.u.el('span', '', tail), 'zoom');
    };

    BASE.postedComment = (parent, c, i) => {
      const card = page.u.el('div', 'as-card', parent); page.P.cardHeader(card, page.s.owner, 'Just now / Posted');
      page.u.el('div', 'as-quote', card, page.s.doc.slice(c.start, c.end)); page.u.el('p', '', card, c.text);
      const target = page.P.button(card, 'Delete', `deleteComment:${i}`, () => page.P.commit({ comments: page.ctx.model.comments.filter((_, j) => j !== i) }));
      const reply = page.u.el('div', 'as-threadreply', card); page.P.icon(reply, 'comment'); page.u.el('span', '', reply, 'Reply or mention someone');
      page.P.cardDecorated(card, c, i);
      return target;
    };

    BASE.sync = (m) => {
      page.refs.save.querySelector('span').textContent = m.composer.open && m.draft ? 'Comment draft' : 'All changes saved';
      page.refs.selectionStatus.textContent = page.isDoc ? 'Reviewing' : m.selected.length === 1 ? `${page.s.shapes[m.selected[0]].label} selected` : m.selected.length ? `${m.selected.length} objects selected` : 'No object selected';
      page.refs.zoom.textContent = page.isDoc ? '100%' : `${Math.round(page.scale * 100)}%`;
      if (page.sortable && !page.sortable.dragging()) page.sortable.set(m.order);

      if (!page.isDoc) page.P.syncDeck(m);
      else if (page.s.scenario === 'comments') page.P.syncComments(m);
      else page.P.syncChanges(m);
      page.P.synced(m);
    };
  }

  function installSyncParts(BASE, page) {
    BASE.syncDeck = (m) => {
      for (let i = 0; i < page.s.slides.length; i++) {
        page.P.thumbnailSynced(page.refs[`slide:${i}`], i, m);
      }
      page.deckTitle.textContent = page.s.slides[m.activeSlide].title;
      page.refs.slideSubtitle.textContent = page.s.slides[m.activeSlide].subtitle + ' / Planning & delivery';
      page.refs.slidePage.textContent = `${m.order.indexOf(m.activeSlide) + 1} / ${m.order.length}`;
      if (page.slideArt && page.lastArtwork !== String(m.activeSlide)) { page.lastArtwork = String(m.activeSlide); page.P.presentation(page.slideArt, m.activeSlide, false); }
      const previewKey = JSON.stringify([m.positions, m.styles]);
      if (!page.slideArt && page.lastPreview !== previewKey) {
        page.lastPreview = previewKey;
        for (let i = 0; i < page.s.slides.length; i++) page.P.presentation(page.refs[`slide:${i}`].querySelector('.as-preview'), i, true);
      }
      page.shapeEls.forEach((el, i) => page.P.shapeSynced(el, i, m));
      if (page.refs.slideLayout) page.refs.slideLayout.textContent = page.D.layouts[m.activeSlide % 3];
      if (page.refs['property:X']) {
        const p = m.positions[m.selected[0] ?? 0];
        page.refs['property:X'].textContent = String(Math.round(p.x)); page.refs['property:Y'].textContent = String(Math.round(p.y));
        page.refs.inspectorEmpty.hidden = m.selected.length > 0; page.refs.inspectorProperties.hidden = !m.selected.length;
      }
      const st = m.styles[m.selected[0] ?? 0];
      if (page.refs['field:size'] && document.activeElement !== page.refs['field:size']) page.refs['field:size'].value = String(st.size);
      for (const key of ['bold', 'italic']) if (page.refs[`tool:${key}`]) page.refs[`tool:${key}`].setAttribute('aria-pressed', String(st[key] && m.selected.length > 0));
      for (const color of Object.keys(page.F.helpers.COLORS)) if (page.refs[`color:${color}`]) page.refs[`color:${color}`].setAttribute('aria-pressed', String(color === st.color && m.selected.length > 0));
      page.statusCount.textContent = `Slides: ${m.order.length}`; page.statusExtra.textContent = `Objects: ${m.positions.length} · ${Math.round(page.scale * 100)}%`;
    };

    BASE.thumbnailSynced = (el, i, m) => {
      el.classList.toggle('active', m.activeSlide === i);
      el.querySelector('.as-num').textContent = String(m.order.indexOf(i) + 1);
    };

    BASE.shapeSynced = (el, i, m) => {
      const st = m.styles[i], p = m.positions[i];
      el.style.left = `${p.x}px`; el.style.top = `${p.y}px`; el.style.color = `color-mix(in srgb, ${page.F.helpers.COLORS[st.color]} 64%, var(--fg))`;
      el.style.fontWeight = st.bold ? '750' : '400'; el.style.fontStyle = st.italic ? 'italic' : 'normal'; el.style.fontSize = `${st.size}px`;
      el.classList.toggle('selected', m.selected.includes(i));
      if (page.refs[`layer:${i}`]) page.refs[`layer:${i}`].classList.toggle('active', m.selected.includes(i));
    };

    BASE.syncComments = (m) => {
      page.statusCount.textContent = `Words: ${page.s.doc.split(/\s+/).length}`; page.statusExtra.textContent = `Comments: ${1 + m.comments.length}`;
      page.refs.reviewCount.textContent = `Comments (${1 + m.comments.length})`;
      page.refs.commentEmpty.hidden = m.comments.length > 0 || m.composer.open;
      page.composerBox.hidden = !m.composer.open;
      page.refs.quote.textContent = page.s.doc.slice(m.composer.start, m.composer.end);
      if (page.draftField.value !== m.draft) page.draftField.value = m.draft;
      page.refs['tool:post'].disabled = !m.draft.trim();
      if (page.selection && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) page.selection.set(m.selection);
      if (JSON.stringify(m.comments) !== page.lastComments) {
        page.lastComments = JSON.stringify(m.comments); page.commentList.replaceChildren();
        const targets = [];
        m.comments.forEach((c, i) => { targets.push(page.P.postedComment(page.commentList, c, i)); });
        page.panes.comments.targets = targets;
      }
    };

    BASE.syncChanges = (m) => {
      const reviewed = m.decisions.filter((x) => x !== 'pending').length;
      page.statusCount.textContent = `Pending changes: ${m.decisions.length - reviewed}`; page.statusExtra.textContent = `Reviewed: ${reviewed}`;
      page.refs.reviewCount.textContent = `Changes (${m.decisions.length - reviewed} pending)`;
      m.decisions.forEach((state, i) => {
        page.refs[`resolution:${i}`].textContent = state === 'pending' ? 'Pending' : state === 'accept' ? 'Accepted' : 'Rejected';
        for (const action of ['accept', 'reject', 'undo']) page.refs[`revision:${i}:${action}`].hidden = action === 'undo' ? state === 'pending' : state !== 'pending';
        const line = page.revisionEls[i];
        if (line) { line.before.hidden = state === 'accept'; line.after.hidden = state === 'reject'; line.before.className = state === 'pending' ? 'as-del' : ''; line.after.className = state === 'pending' ? 'as-ins' : ''; }
      });
    };

    BASE.locate = (t) => {
      if (t.char !== undefined) return page.selection.locate(t);
      if (t.slot !== undefined) return page.sortable.locateSlot(t.slot);
      if (t.slide !== undefined) return page.sortable.locate(t.slide);
      const key = t.shape !== undefined ? `shape:${t.shape}` : t.tool ? `tool:${t.tool}` : t.field ? `field:${t.field}` : t.color ? `color:${t.color}` : t.revision !== undefined ? `revision:${t.revision}:${t.action}` : t.deleteComment !== undefined ? `deleteComment:${t.deleteComment}` : `pane:${t.pane}`;
      const el = page.refs[key]; if (!el || el.hidden) throw new Error(`use-slides: target ${key} not visible`);
      return env.util.center(el);
    };

    BASE.thumbnailDecorated = (el, slide, i) => {};

    BASE.shapeDecorated = (el, shape, i) => {};

    BASE.cardDecorated = (el, item, i) => {};

    BASE.synced = (m) => {};

    BASE.rendered = (ctx) => {};
  }

  env.template('use-slides/office', (design, def) => {
    // Private live state shared by the part builders; S below remains the design API.
    const page = {};
    const BASE = {};
    const S = {
      get ctx() { return page.ctx; }, get spec() { return page.s; }, get size() { return page.size; },
      get root() { return page.root; }, get isDoc() { return page.isDoc; }, get teammates() { return page.teammates; },
      get refs() { return page.refs; }, get panes() { return page.panes; },
      get shapeEls() { return page.shapeEls; }, get revisionEls() { return page.revisionEls; },
      get segments() { return page.segments; },
      get sortable() { return page.sortable; }, set sortable(value) { page.sortable = value; },
      get selection() { return page.selection; }, set selection(value) { page.selection = value; },
      get scale() { return page.scale; }, set scale(value) { page.scale = value; },
      get deckTitle() { return page.deckTitle; }, set deckTitle(value) { page.deckTitle = value; },
      get guide() { return page.guide; }, set guide(value) { page.guide = value; },
      get slideArt() { return page.slideArt; }, set slideArt(value) { page.slideArt = value; },
      get commentList() { return page.commentList; }, set commentList(value) { page.commentList = value; },
      get composerBox() { return page.composerBox; }, set composerBox(value) { page.composerBox = value; },
      get draftField() { return page.draftField; }, set draftField(value) { page.draftField = value; },
      get statusCount() { return page.statusCount; }, set statusCount(value) { page.statusCount = value; },
      get statusExtra() { return page.statusExtra; }, set statusExtra(value) { page.statusExtra = value; },
      get D() { return page.D; }, get P() { return page.P; },
    };

    installFrameParts(BASE, page);
    installToolbarParts(BASE, page);
    installPresentationParts(BASE, page);
    installDeckParts(BASE, page);
    installDocumentParts(BASE, page);
    installReviewParts(BASE, page);
    installSyncParts(BASE, page);

    ({ D: page.D, P: page.P } = env.templateDesign('use-slides/office', design, def, { tokens: TOKENS, base: BASE, state: S }));

    return {
      render(nextCtx) {
        page.ctx = nextCtx; page.s = page.ctx.spec; page.u = page.ctx.util; page.size = page.ctx.size; page.F = env.taskDef;
        page.P.styles(page.ctx);
        page.refs = {}; page.shapeEls = []; page.revisionEls = []; page.panes = {}; page.segments = [];
        page.sortable = page.selection = page.deckTitle = page.inspector = page.commentList = page.composerBox = page.draftField = page.guide = page.slideArt = undefined;
        page.scale = 1; page.lastComments = ''; page.lastArtwork = ''; page.lastPreview = '';
        const cr = page.ctx.rng.fork('office-decoration'), co = { csplit: page.s.csplit };
        page.teammates = [page.s.owner, page.s.baseComment.author, page.ctx.content.personName(cr, co).full];
        page.isDoc = !page.s.judge && ['comments', 'trackchanges'].includes(page.s.scenario);
        page.P.layout(page.ctx);
        page.P.sync(page.ctx.model); page.P.mirror();
        page.P.rendered(page.ctx);
        return { anchors: [page.root], sync: (m) => { page.P.sync(m); page.P.mirror(); } };
      },
      locate(t) { return page.P.locate(t); },
    };
  });
})();
