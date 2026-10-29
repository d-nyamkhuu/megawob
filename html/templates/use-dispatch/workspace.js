/*
 * use-dispatch/workspace: dispatch, put-away, capacity and route planning on one operations workspace.
 * Scenarios: board, warehouse, reschedule, route-order. No scenario presets: their widgets share the
 * workspace, cards, scroll/drag mechanics and inspector; route-order substitutes a stop list/matrix.
 * design: {} reproduces design-use-dispatch-board-01, design-use-dispatch-warehouse-01,
 * design-use-dispatch-reschedule-01 and design-use-dispatch-route-order-01 for the matching scenario.
 * Tokens (defaults):
 *   brand = 'Wayline': toolbar brand; breadcrumb = 'North depot / Operations': toolbar location.
 *   titles = { board: 'Dispatch board', warehouse: 'Warehouse put-away', reschedule: 'Delivery capacity',
 *     'route-order': 'Route planner' }: workspace titles; icons = ICONS below: SVG path table (replace whole).
 *   font = 'system-ui,sans-serif': app/map font family.
 *   panel/foreground/line/background/accent/muted = var(--panel/--fg/--line/--bg/--accent/--muted): colors.
 *   warning = '#c35135': constraint color; inset = 8: app inset in px.
 *   cardHeight = 68, stopHeight = 40, cardGap = 8: row dimensions in px, shared with drag/oracle geometry.
 *   paneInset = 6: pane padding/slot origin and mirrored visible-height inset in px.
 *   laneHeaderHeight = 87, inspectorWidth = 218: panel dimensions in px.
 *   compactWidth = 800, roomyWidth = 1140, shortHeight = 430: stage breakpoints in px.
 * Parts (all calls through P; wrappers are (base, S) => replacement):
 *   styles(ctx): install structural CSS using the style tokens; returns nothing.
 *   frame(ctx) -> el: create the responsive app section in ctx.stage.
 *   content(ctx): draw operations-content names/products in reference order; returns nothing.
 *   icon(parent, name, size=15) -> svg: draw a path from the icons token.
 *   button(parent, label, iconName, onClick, className="") -> button: build a control.
 *   toolbar(): toolbar, rules popover and controls; returns nothing.
 *   background(title, subtitle): show an unscored records/notifications popover; returns nothing.
 *   shell(): create the rail/work frame; returns nothing.
 *   rail(): navigation buttons, saved workspaces and team control; returns nothing.
 *   navigation(): current workspace, Activity and Documents tabs; returns nothing.
 *   context(): scenario title, count and context copy; returns nothing.
 *   filters(): period/depot/view controls and live exception count; returns nothing.
 *   workspace(): main/inspector frame and detached footer; returns nothing.
 *   pane(parent, id, className="") -> el: scroll area with deterministic wheel/mirroring handlers.
 *   mirror(): patch unscored scroll geometry into the model only when changed; returns nothing.
 *   commit(model): update the model, paint and mirror; returns nothing.
 *   attach(el, item): install selection/drag/drop mechanics; returns nothing.
 *   ghost(card, origin) -> el: clone and position a drag preview.
 *   stopContent(item, el): stop number, customer, service and load; returns nothing.
 *   cardContent(item, el): shipment/inventory card contents; returns nothing.
 *   card(item, parent) -> el: accessible card, content, registration and drag binding.
 *   laneHeader(lane, laneSpec) -> el: persistent title, metadata, load and fill bar.
 *   empty(pane, laneSpec) -> el: receiving/allocation empty state.
 *   lane(laneSpec, parent) -> el: registered drop lane, header, pane and empty state.
 *   lanes(): build the board/warehouse/capacity lanes and initial cards; returns nothing.
 *   routeList(parent): route header, depot endpoints and stop pane; returns nothing.
 *   matrix(parent): directed-distance table and policy, registering cells; returns nothing.
 *   routes(): route/list and matrix layout; returns nothing.
 *   activity(): live exception dock and background activity feed; returns nothing.
 *   inspector(): details panel and close control, then context and related panels; returns nothing.
 *   serviceMap(parent): schematic map; service-map fork draws two ints per item in order.
 *   contextPanel(inspector): service map, storage locations or other delivery runs; returns nothing.
 *   related(inspector): other active plans/receipts; returns nothing.
 *   footer(): attach the footer and register its three fact spans; returns nothing.
 *   paintRoute(model, alerts): reorder stops, highlight matrix edges and map route; returns nothing.
 *   paintLanes(model, alerts): move cards and update compatibility, loads and warnings; returns nothing.
 *   detail(model, alerts): rebuild selected shipment/inventory details and warnings; returns nothing.
 *   paint(model): selection, constraint summaries and detail/fact painting; returns nothing while dragging.
 *   facts(model): update visible plan facts; returns nothing.
 *   locate(target) -> [x,y]: read card/header/pane/slot geometry; throw for unknown targets.
 *   item(el, item): after card construction and drag binding; default no-op.
 *   laneDecorated(el, laneSpec): after lane construction; default no-op.
 *   rendered(ctx): after initial paint/mirror; default no-op.
 * S.ctx/spec/model/refs/route/app/els/content/D/P read live page state; S.selected is writable.
 * S.els exposes writable rail, work, workspace, main, footer, detail and both popovers.
 * Replaced builders must retain the refs they register: cards, lanes, panes, heads, loads, fills,
 * rows (empty states), cells (matrix) and inspector/detail/exceptionCount/issue/facts. Keep a
 * .ad-state inside allocation cards and .ad-stop-number inside route stops for the paint parts,
 * or replace the corresponding paint part too. Anchors remain [S.app]; locate only reads geometry.
 * Content is { dispatcher, contacts, otherProducts, otherPlans, bgRows, noteText }.
 * Keep operations-content and service-map rng draws in order, even when replacing those parts.
 * Draw additional decoration randomness from ctx.rng.fork(label).
 */
(function () {
  'use strict';

  const ICONS={
    brand:'M4 8h14m-4-4 4 4-4 4M20 16H6m4-4-4 4 4 4',
    grid:'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
    truck:'M3 6h11v11H3zM14 10h4l3 4v3h-7M5 17a2 2 0 1 0 4 0m7 0a2 2 0 1 0 4 0',
    box:'m3 7 9-4 9 4-9 4-9-4v10l9 4 9-4V7M12 11v10M7 5l10 4',
    calendar:'M4 5h16v16H4zM4 10h16M8 3v4M16 3v4M8 14h2m4 0h2m-8 4h2',
    route:'M6 5h10a4 4 0 0 1 0 8H8a4 4 0 0 0 0 8h10M3 5a2 2 0 1 0 4 0 2 2 0 1 0-4 0m14 16 4-3m-4 3 4 2',
    bell:'M5 17h14l-2-3V9a5 5 0 0 0-10 0v5l-2 3m5 3h4',
    filter:'M3 5h18l-7 8v6l-4 2v-8z',
    down:'m6 9 6 6 6-6',
    check:'m5 12 4 4L19 6',
    alert:'m12 3 10 18H2L12 3m0 6v5m0 3v1',
    file:'M5 3h9l5 5v13H5zM14 3v6h5M8 13h8m-8 4h6',
    activity:'M3 12h4l3-8 4 16 3-8h4',
    grip:'M8 5h1m6 0h1M8 12h1m6 0h1M8 19h1m6 0h1',
    user:'M8 7a4 4 0 1 0 8 0 4 4 0 1 0-8 0M4 21v-3a8 8 0 0 1 16 0v3',
    pin:'M5 9a7 7 0 1 1 14 0c0 5-7 12-7 12S5 14 5 9m4 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0',
    clock:'M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18m0 4v5l4 2',
    snow:'M12 2v20M3 7l18 10M3 17 21 7M9 4l3 3 3-3M9 20l3-3 3 3',
    close:'m6 6 12 12M6 18 18 6',
    panel:'M3 4h18v16H3zM15 4v16',
    archive:'M3 4h18v5H3zM5 9v12h14V9m-10 4h6',
    search:'M3 10a7 7 0 1 0 14 0 7 7 0 1 0-14 0m12 5 6 6'
  };
  const CSS = (D) => `
  .ad-app{position:absolute;inset:${D.inset}px;display:flex;flex-direction:column;min-height:0;min-width:0;overflow:hidden;background:${D.panel};color:${D.foreground};border:1px solid ${D.line};border-radius:9px;font:12px/1.35 ${D.font};box-shadow:0 3px 16px #0000000c}
  .ad-app button{font:inherit;color:inherit;background:${D.panel};border:1px solid ${D.line};border-radius:5px;padding:5px 9px;cursor:pointer}.ad-app button:hover{background:${D.background}}
  .ad-toolbar{flex:none;height:48px;display:flex;align-items:center;gap:10px;padding:0 12px;border-bottom:1px solid ${D.line}}
  .ad-mark{background:${D.accent};color:white;border-radius:6px;padding:4px 7px;font-size:17px;font-weight:800}.ad-brand{font-size:16px;font-weight:720}.ad-crumb{color:${D.muted};margin-right:auto;white-space:nowrap}.ad-badge{border:1px solid ${D.line};border-radius:20px;padding:3px 8px;color:${D.muted};white-space:nowrap;font-size:10px}
  .ad-nav{height:31px;flex:none;display:flex;align-items:stretch;gap:20px;padding:0 13px;color:${D.muted};border-bottom:1px solid ${D.line};background:color-mix(in srgb,${D.background} 45%,${D.panel})}.ad-nav span{display:flex;align-items:center;white-space:nowrap}.ad-nav .active{border-bottom:2px solid ${D.accent};color:${D.accent};font-weight:650}.ad-nav .ad-right{margin-left:auto;font-size:10px}
  .ad-context{flex:none;min-height:36px;display:flex;align-items:center;gap:8px;padding:5px 12px;border-bottom:1px solid ${D.line}}.ad-context strong{font-size:13px}.ad-context .ad-muted{margin-left:auto;font-size:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ad-muted{color:${D.muted}}
  .ad-lanes{display:grid;flex:1;min-height:0;min-width:0;gap:8px;padding:8px;background:${D.background}}
  .ad-lane{display:flex;flex-direction:column;min-width:0;min-height:0;background:${D.panel};border:1px solid ${D.line};border-radius:6px;overflow:hidden}.ad-lane.over{outline:2px solid ${D.accent};outline-offset:-2px}
  .ad-lane-head{flex:none;height:${D.laneHeaderHeight}px;padding:8px;border-bottom:1px solid ${D.line};background:color-mix(in srgb,${D.accent} 4%,${D.panel});cursor:default}.ad-lane-head strong{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:12px}.ad-meta{display:block;font-size:10px;color:${D.muted};margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ad-load{font-size:11px;margin-top:4px;font-variant-numeric:tabular-nums}.ad-bar{height:3px;background:${D.line};border-radius:3px;margin-top:5px;overflow:hidden}.ad-fill{height:100%;background:${D.accent};width:0}.ad-warn{color:${D.warning}}.ad-lane.bad .ad-fill{background:${D.warning}}
  .ad-pane{flex:1;min-height:0;position:relative;overflow:auto;scrollbar-width:thin;overscroll-behavior:contain;padding:${D.paneInset}px;scroll-behavior:auto;overflow-anchor:none}.ad-empty{padding:16px 4px;text-align:center;font-size:10px;color:${D.muted};border:1px dashed ${D.line};border-radius:4px;margin-bottom:5px}
  .ad-card{height:${D.cardHeight}px;margin-bottom:${D.cardGap}px;position:relative;cursor:grab;touch-action:none;border:1px solid ${D.line};border-left:3px solid ${D.accent};background:${D.panel};border-radius:5px;padding:6px 7px;overflow:hidden;box-shadow:0 1px 2px #00000009}
  .ad-card:hover{border-color:${D.accent}}.ad-card.dragging{opacity:.28}.ad-card.invalid{border-left-color:${D.warning}}.ad-card-top{display:flex;align-items:center;gap:5px;white-space:nowrap}.ad-id{font-size:11px;font-weight:750;color:${D.accent}}.ad-grip{color:${D.muted};font-size:13px;line-height:12px}.ad-weight{margin-left:auto;font-size:10px;font-weight:650;font-variant-numeric:tabular-nums}.ad-customer{font-size:11px;font-weight:600;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;margin-top:3px}.ad-card-note{font-size:10px;color:${D.muted};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:3px}.ad-ghost{position:fixed;z-index:4000;pointer-events:none;opacity:.94;box-shadow:0 8px 20px #0004;margin:0;transform:rotate(-1deg)}
  .ad-footer{flex:none;min-height:39px;display:flex;align-items:center;gap:16px;padding:6px 12px;border-top:1px solid ${D.line};font-size:10px;background:${D.panel};overflow:hidden}.ad-footer span{white-space:nowrap}.ad-footer b{font-weight:650;color:${D.foreground}}.ad-footer .ad-reference{margin-left:auto;overflow:hidden;text-overflow:ellipsis;color:${D.muted}}
  .ad-routes{display:flex;flex:1;min-height:0;background:${D.background};gap:10px;padding:8px}.ad-route-box{display:flex;flex-direction:column;min-width:0;min-height:0;flex:1;border:1px solid ${D.line};border-radius:6px;background:${D.panel};overflow:hidden}.ad-route-head{flex:none;padding:8px 10px;border-bottom:1px solid ${D.line};font-size:11px;display:flex;justify-content:space-between;gap:6px}.ad-route-list{padding:${D.paneInset}px 9px}.ad-stop{height:${D.stopHeight}px;margin-bottom:${D.cardGap}px;display:flex;align-items:center;gap:8px;padding:5px 7px}.ad-stop-number{flex:none;width:23px;height:23px;display:grid;place-items:center;border:1px solid ${D.line};border-radius:50%;color:${D.muted};font-size:10px}.ad-stop-copy{min-width:0;flex:1}.ad-stop .ad-customer{margin:0;font-size:10px}.ad-stop .ad-card-note{margin:1px 0 0;font-size:9px}.ad-depot{flex:none;padding:6px 10px;font-size:10px;color:${D.muted};border-bottom:1px dashed ${D.line};background:${D.background}}.ad-depot:last-child{border-bottom:0;border-top:1px dashed ${D.line}}
  .ad-matrix-box{flex:1.12;min-width:0;min-height:0;border:1px solid ${D.line};border-radius:6px;background:${D.panel};display:flex;flex-direction:column;overflow:hidden}.ad-matrix-pane{overflow:auto;min-height:0;padding:8px;scrollbar-width:thin}.ad-table{width:100%;border-collapse:collapse;font-size:11px;text-align:center;font-variant-numeric:tabular-nums}.ad-table th,.ad-table td{padding:6px 2px;border-bottom:1px solid ${D.line}}.ad-table th{font-size:10px;font-weight:650;background:${D.background};color:${D.muted}}.ad-table td.on{background:color-mix(in srgb,${D.accent} 12%,${D.panel});font-weight:650;color:${D.accent}}.ad-policy{padding:9px 10px;font-size:10px;color:${D.muted};border-top:1px solid ${D.line};line-height:1.5}.ad-popover{position:absolute;top:43px;right:9px;width:260px;z-index:30;padding:13px;background:${D.panel};border:1px solid ${D.line};border-radius:7px;box-shadow:0 8px 24px #0003;font-size:12px}.ad-popover p{margin:7px 0;color:${D.muted}}
  .ad-app.compact .ad-brand{font-size:14px}.ad-app.compact .ad-crumb,.ad-app.compact .ad-nav .ad-right,.ad-app.compact .ad-badge{display:none}.ad-app.compact .ad-context .ad-muted{max-width:160px}.ad-app.compact .ad-footer{gap:10px;padding:6px 8px;font-size:9px}.ad-app.compact .ad-lanes{gap:5px;padding:5px}.ad-app.compact .ad-lane-head{padding:7px 5px}.ad-app.compact .ad-pane{padding:${D.paneInset}px 4px}.ad-app.compact .ad-card{padding:6px 4px}.ad-app.compact .ad-table th,.ad-app.compact .ad-table td{padding:5px 1px;font-size:10px}
  .ad-app [hidden]{display:none!important}.ad-app svg{flex:none;vertical-align:middle}.ad-app button{display:inline-flex;align-items:center;justify-content:center;gap:5px}.ad-app button:focus-visible{outline:2px solid ${D.accent};outline-offset:1px}
  .ad-toolbar{height:44px;gap:8px}.ad-mark{display:flex;padding:5px}.ad-brand{letter-spacing:-.4px}.ad-crumb{font-size:10px}.ad-toolbar .ad-icon-btn{position:relative;padding:5px}.ad-dot{width:5px;height:5px;border-radius:50%;background:${D.accent};display:inline-block;margin-right:4px}.ad-bell-count{position:absolute;right:-3px;top:-5px;background:${D.accent};color:white;border-radius:8px;font-size:8px;padding:0 3px}.ad-avatar{width:25px;height:25px;border-radius:50%;background:color-mix(in srgb,${D.accent} 20%,${D.panel});color:${D.accent};display:grid;place-items:center;font-size:9px;font-weight:700}
  .ad-shell{display:flex;min-height:0;flex:1}.ad-rail{flex:none;width:44px;border-right:1px solid ${D.line};display:flex;flex-direction:column;overflow:hidden;background:color-mix(in srgb,${D.background} 60%,${D.panel});padding:8px 4px}.ad-rail button{border:0;background:transparent;justify-content:flex-start;padding:7px 9px;margin-bottom:2px;color:${D.muted};width:100%;font-size:10px;white-space:nowrap}.ad-rail button.current{background:color-mix(in srgb,${D.accent} 12%,${D.panel});color:${D.accent};font-weight:700}.ad-rail-label,.ad-rail-count,.ad-saved{display:none}.ad-rail-bottom{margin-top:auto;border-top:1px solid ${D.line};padding-top:7px}.ad-work{min-width:0;min-height:0;flex:1;display:flex;flex-direction:column}
  .ad-app.roomy .ad-rail{width:144px;padding:10px 8px}.ad-app.roomy .ad-rail-label{display:inline}.ad-app.roomy .ad-rail-count{display:inline;margin-left:auto;font-size:9px;color:${D.muted}}.ad-app.roomy .ad-saved{display:block;margin:16px 6px 0;font-size:9px;line-height:1.6;color:${D.muted}}.ad-saved h5{font-size:9px;letter-spacing:.08em;text-transform:uppercase;margin:0 0 7px;color:${D.muted}}.ad-saved div{padding:5px 0;border-bottom:1px solid ${D.line}}.ad-saved b{display:block;color:${D.foreground};font-size:10px;font-weight:550}
  .ad-nav{height:27px;gap:15px;padding:0 10px;font-size:10px}.ad-context{min-height:36px;padding:5px 10px}.ad-context strong{font-size:13px}.ad-context .ad-muted{font-size:9px}.ad-filters{height:31px;flex:none;display:flex;align-items:center;gap:6px;padding:3px 9px;border-bottom:1px solid ${D.line};font-size:10px;white-space:nowrap;overflow:hidden}.ad-filters button{font-size:10px;padding:3px 6px;background:${D.panel}}.ad-filters .ad-filter-end{margin-left:auto;font-size:9px;color:${D.muted};overflow:hidden;text-overflow:ellipsis}.ad-filter-sep{height:15px;border-left:1px solid ${D.line};margin:0 2px}
  .ad-workspace{display:flex;flex:1;min-height:0;min-width:0}.ad-main{flex:1;display:flex;flex-direction:column;min-height:0;min-width:0}.ad-lanes{gap:6px;padding:6px}.ad-lane-head{height:${D.laneHeaderHeight}px;padding:6px 7px}.ad-lane-head strong{font-size:11px;display:flex;align-items:center;gap:5px}.ad-lane-head .ad-meta{font-size:9px}.ad-lane-head .ad-load{font-size:10px}.ad-lane-head .ad-bar{margin-top:4px}.ad-empty{padding:10px 4px;font-size:10px;background:${D.background}}.ad-empty svg{display:block;margin:0 auto 5px;color:${D.muted}}
  .ad-card{padding:4px 6px;border-left-width:2px;border-radius:3px;box-shadow:none}.ad-card-top{line-height:12px;gap:4px}.ad-id{font-size:10px}.ad-grip{display:flex}.ad-customer{font-size:10px;line-height:13px;margin-top:2px}.ad-card-note{display:flex;align-items:center;gap:3px;font-size:9px;line-height:11px;margin-top:2px}.ad-card-ref{font-size:8px;line-height:10px;color:${D.muted};display:flex;justify-content:space-between;margin-top:2px;white-space:nowrap;overflow:hidden}.ad-state{font-size:8px;line-height:11px;padding:0 3px;background:${D.background};border:1px solid ${D.line};border-radius:3px;color:${D.muted};overflow:hidden;max-width:56px}.ad-card.selected{background:color-mix(in srgb,${D.accent} 5%,${D.panel})}.ad-card.invalid .ad-state{color:${D.warning}}.ad-weight{font-size:9px}.ad-stop{padding:3px 5px;border-left-width:2px;gap:5px}.ad-stop .ad-customer{font-size:10px}.ad-stop-number{width:21px;height:21px;font-size:9px}.ad-stop .ad-state{margin-left:auto}.ad-stop .ad-weight{margin-left:0}.ad-load svg{width:11px;height:11px;margin-right:3px}
  .ad-inspector{display:none;flex:none;width:${D.inspectorWidth}px;min-height:0;border-left:1px solid ${D.line};background:${D.panel};overflow:auto;scrollbar-width:thin;overscroll-behavior:contain}.ad-app.roomy .ad-inspector{display:block}.ad-inspector.open{display:block;position:absolute;right:0;top:44px;bottom:29px;z-index:25;width:255px;box-shadow:-5px 0 20px #0003}.ad-inspector-head{position:sticky;top:0;z-index:1;display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:${D.panel};border-bottom:1px solid ${D.line};font-size:11px;font-weight:650}.ad-inspector-head button{padding:2px;border:0}.ad-section{padding:10px;border-bottom:1px solid ${D.line}}.ad-section h5{font-size:9px;text-transform:uppercase;letter-spacing:.08em;color:${D.muted};margin:0 0 8px}.ad-inspect-title{font-size:12px;font-weight:650;margin:4px 0 7px}.ad-pairs{display:grid;grid-template-columns:76px minmax(0,1fr);gap:5px 6px;font-size:10px}.ad-pairs dt{color:${D.muted}}.ad-pairs dd{margin:0;overflow-wrap:anywhere}.ad-note{padding:7px;background:${D.background};border-left:2px solid ${D.accent};font-size:10px;line-height:1.5;margin-top:8px;color:${D.muted}}.ad-exceptions{font-size:10px;line-height:1.5;color:${D.muted}}.ad-exceptions.bad{color:${D.warning}}.ad-history-row{font-size:9px;padding:7px 0;border-bottom:1px solid ${D.line};color:${D.muted}}.ad-history-row b{font-size:10px;display:block;color:${D.foreground};font-weight:550;margin-bottom:2px}.ad-mini-map{width:100%;height:108px;display:block;background:${D.background};border:1px solid ${D.line};border-radius:4px}.ad-mini-map text{fill:${D.foreground};font-size:8px;font-family:${D.font}}.ad-mini-map .ad-map-road{stroke:${D.line};stroke-width:6;fill:none}.ad-mini-map .ad-map-route{stroke:${D.accent};stroke-width:2;fill:none}.ad-mini-map circle{fill:${D.panel};stroke:${D.accent};stroke-width:1.5}.ad-mini-caption{font-size:8px;color:${D.muted};margin-top:4px}.ad-cap-line{display:flex;justify-content:space-between;font-size:10px;margin:7px 0}.ad-cap-line span{color:${D.muted}}
  .ad-activity-dock{height:42px;flex:none;display:flex;gap:12px;align-items:center;padding:5px 9px;border-top:1px solid ${D.line};background:${D.panel};overflow:hidden}.ad-activity-dock>div{min-width:0;flex:1;font-size:9px;color:${D.muted};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ad-activity-dock b{display:block;font-size:9px;font-weight:600;color:${D.foreground};margin-bottom:2px}.ad-activity-dock svg{margin-right:4px;color:${D.muted}}.ad-alert-count{color:${D.warning}!important}.ad-footer{height:29px;min-height:29px;font-size:9px;padding:4px 9px;gap:12px}.ad-footer .ad-reference{font-size:8px}
  .ad-popover{top:42px;right:8px;max-height:calc(100% - 50px);overflow:auto;width:290px;padding:12px;font-size:11px}.ad-popover .ad-history-row:last-child{border:0}.ad-popover button{margin-top:8px;font-size:10px}.ad-app.short .ad-activity-dock{display:none}.ad-app.short .ad-nav{display:none}.ad-app.compact .ad-state{display:none}.ad-app.compact .ad-filter-end{display:none}.ad-app.compact .ad-inspect-toggle{padding:5px}.ad-app.compact .ad-inspect-toggle span{display:none}
  `;

  const TOKENS = {
    brand: 'Wayline', breadcrumb: 'North depot / Operations',
    titles: { board: 'Dispatch board', warehouse: 'Warehouse put-away', reschedule: 'Delivery capacity', 'route-order': 'Route planner' },
    icons: ICONS, font: 'system-ui,sans-serif',
    panel: 'var(--panel)', foreground: 'var(--fg)', line: 'var(--line)', background: 'var(--bg)',
    accent: 'var(--accent)', muted: 'var(--muted)', warning: '#c35135',
    inset: 8, cardHeight: 68, stopHeight: 40, cardGap: 8, paneInset: 6,
    laneHeaderHeight: 87, inspectorWidth: 218, compactWidth: 800, roomyWidth: 1140, shortHeight: 430,
  };

  function installFrame(BASE, state) {
    BASE.styles = (ctx) => {
      ctx.css('app-dispatch-classic',CSS(state.D));
    };

    BASE.frame = (ctx) => {
      const app=state.u.el('section',`ad-app${ctx.size.width<state.D.compactWidth?' compact':''}${ctx.size.width>=state.D.roomyWidth?' roomy':''}${ctx.size.height<state.D.shortHeight?' short':''}`,ctx.stage);
      app.setAttribute('aria-label','Dispatch operations');
      return app;
    };

    BASE.content = (ctx) => {
      const cr=ctx.rng.fork('operations-content'),C=ctx.content,co={csplit:state.s.csplit};
      state.dispatcher=C.personName(cr,co);state.contacts=state.s.items.map(()=>C.personName(cr,co));
      const otherCompanies=C.sample(cr,C.COMPANIES,12,co);state.otherProducts=C.sample(cr,C.PRODUCTS,6,co);
      state.otherPlans=[['East district','18 orders','In progress'],['Customer returns','7 collections','Awaiting review'],['South depot','22 orders','Ready to dispatch'],['West district','12 orders','Draft']];
      state.bgRows=Array.from({length:9},(_,i)=>({ref:`${state.s.scenario==='warehouse'?'RCV':'RUN'}-${4100+i}`,name:otherCompanies[i],status:['Completed','Awaiting paperwork','In progress'][i%3]}));
      state.noteText=state.s.scenario==='warehouse'?'Receiving note: retain lot labels and keep handling instructions with each carton.':state.s.scenario==='reschedule'?'Customer service note: weekday commitments have been confirmed. Preserve the delivery contact and reference.':'Delivery note: use the goods entrance. Call the receiving desk on arrival; signature required.';
    };

    BASE.icon = (parent,name,size=15) => {
      const svg=env.util.svg('svg',{viewBox:'0 0 24 24',width:size,height:size,fill:'none',stroke:'currentColor','stroke-width':1.7,'stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true'},parent);
      env.util.svg('path',{d:state.D.icons[name]||state.D.icons.file},svg);return svg;
    };

    BASE.button = (parent,label,name,fn,cls='') => {
      const b=state.u.el('button',cls,parent);b.type='button';if(name)state.P.icon(b,name);if(label)state.u.el('span','',b,label);b.addEventListener('click',fn);return b;
    };

    BASE.toolbar = () => {
      const toolbar=state.u.el('div','ad-toolbar',state.app);state.P.icon(state.u.el('span','ad-mark',toolbar),'brand',18);state.u.el('span','ad-brand',toolbar,state.D.brand);state.u.el('span','ad-crumb',toolbar,state.D.breadcrumb);
      const live=state.u.el('span','ad-badge',toolbar);state.u.el('i','ad-dot',live);state.u.el('span','',live,'Changes saved');
      const notices=state.P.button(toolbar,'','bell',()=>state.P.background('Notifications','Three updates from other operations'), 'ad-icon-btn');notices.setAttribute('aria-label','Notifications');state.u.el('span','ad-bell-count',notices,'3');
      const help=state.P.button(toolbar,'Rules','file',()=>{});
      const details=state.P.button(toolbar,'Details','panel',()=>{state.refs.inspector.hidden=false;state.refs.inspector.classList.toggle('open');},'ad-inspect-toggle');details.setAttribute('aria-label','Show shipment details');
      const avatar=state.u.el('span','ad-avatar',toolbar,state.dispatcher.first[0]+state.dispatcher.last[0]);avatar.title=state.dispatcher.full;
      state.pop=state.u.el('div','ad-popover',state.app);state.pop.hidden=true;state.u.el('strong','',state.pop,'Planning rules');
      state.u.el('p','',state.pop,state.route?'Every stop is visited once. Distances are directional; include departure from and return to Depot.':
        state.s.scenario==='warehouse'?'Match the item’s storage temperature. Hazardous inventory requires a hazmat-certified bin. Loads are measured in kg.':
        state.s.scenario==='board'?'A vehicle’s shift must cover each job’s entire delivery window. The total assigned load must fit its capacity.':'Daily capacity is the total weight of deliveries. Move cards between days to balance the plan.');
      state.u.el('p','',state.pop,'Assignments are saved automatically. Customer references and receiving notes remain attached to the shipment.');
      help.addEventListener('click',()=>{state.pop.hidden=!state.pop.hidden;});
    };

    BASE.background = (title,subtitle) => {
      state.background.replaceChildren();state.background.hidden=false;state.pop.hidden=true;
      state.u.el('strong','',state.background,title);state.u.el('p','ad-muted',state.background,subtitle);
      const data=title==='Notifications'?[['09:42','East district: driver check-in overdue'],['09:37','Receiving dock 4: paperwork requested'],['09:31','South depot: a route was shared with the team']]:
        state.bgRows.map(r=>[`${r.ref} · ${r.name}`,r.status]);
      data.forEach(([a,b])=>{const row=state.u.el('div','ad-history-row',state.background);state.u.el('b','',row,a);state.u.el('span','',row,b);});
      state.P.button(state.background,'Close','close',()=>{state.background.hidden=true;});
    };

    BASE.shell = () => {
      const shell=state.u.el('div','ad-shell',state.app);
      state.rail=state.u.el('aside','ad-rail',shell);state.work=state.u.el('div','ad-work',shell);
    };

    BASE.rail = () => {
      const areas=[['grid','Overview',''],['truck','Dispatch','24'],['box','Inventory','16'],['calendar','Schedules','5'],['route','Routes','12'],['user','Customers','']];
      areas.forEach(([ic,label,count])=>{const active=label===(state.s.scenario==='warehouse'?'Inventory':state.s.scenario==='reschedule'?'Schedules':state.route?'Routes':'Dispatch');
        const b=state.P.button(state.rail,'',ic,()=>state.P.background(label,`Other ${label.toLowerCase()} records at North depot`),active?'current':'');b.title=label;b.setAttribute('aria-label',label);state.u.el('span','ad-rail-label',b,label);if(count)state.u.el('span','ad-rail-count',b,count);});
      const saved=state.u.el('div','ad-saved',state.rail);state.u.el('h5','',saved,'Saved workspaces');
      state.otherPlans.forEach(([name,count,status])=>{const row=state.u.el('div','',saved);state.u.el('b','',row,name);state.u.el('span','',row,`${count} · ${status}`);});
      const bottom=state.u.el('div','ad-rail-bottom',state.rail);const team=state.P.button(bottom,'','user',()=>state.P.background('Planning team','North depot · Dispatch and receiving'));team.title='Planning team';state.u.el('span','ad-rail-label',team,'Planning team');
    };

    BASE.navigation = () => {
      const nav=state.u.el('div','ad-nav',state.work);[state.D.titles[state.s.scenario],'Activity','Documents'].forEach(t=>{const n=state.u.el('span',t===state.D.titles[state.s.scenario]?'active':'',nav,t);if(t!==state.D.titles[state.s.scenario]){n.style.cursor='pointer';n.addEventListener('click',()=>state.P.background(t,'Recent records from the depot'));}});state.u.el('span','ad-right',nav,'Shared with Planning team');
    };

    BASE.context = () => {
      const context=state.u.el('div','ad-context',state.work);state.u.el('strong','',context,state.D.titles[state.s.scenario]);state.u.el('span','ad-badge',context,`${state.s.items.length} ${state.s.scenario==='warehouse'?'items':state.route?'stops':'deliveries'}`);
      state.u.el('span','ad-muted',context,state.s.scenario==='board'?'Service windows · local depot time':state.s.scenario==='warehouse'?'Receiving batch · storage compliance':state.s.scenario==='reschedule'?'Week 24 · kg per day':'Distance matrix · km · directional');
    };

    BASE.filters = () => {
      const filters=state.u.el('div','ad-filters',state.work);
      state.P.button(filters,state.s.scenario==='warehouse'?'Receipt RCV-2406':state.s.scenario==='reschedule'?'Week 24':'Tuesday, 8 June','calendar',()=>state.P.background('Planning periods','Other saved periods and batches'));
      state.P.button(filters,'North depot','down',()=>state.P.background('Depots','Other operational workspaces'));state.u.el('span','ad-filter-sep',filters);
      state.P.button(filters,'Current plan','filter',()=>state.P.background('Saved views','Other plans are shown for operational context'));
      const exceptionCount=state.u.el('span','ad-filter-end',filters);state.refs.exceptionCount=exceptionCount;
    };

    BASE.workspace = () => {
      state.workspace=state.u.el('div','ad-workspace',state.work);state.main=state.u.el('div','ad-main',state.workspace);
      state.footer=state.u.el('div','ad-footer');
    };
  }

  function installDrag(BASE, state) {
    BASE.pane = (parent,id,cls='') => {
      const p=state.u.el('div',`ad-pane ${cls}`,parent);p.setAttribute('aria-label',`${id==='pool'?'Unassigned':id} scroll area`);
      state.refs.panes.set(id,p);p.addEventListener('scroll',()=>{if(!state.painting&&!state.dragging) state.P.mirror();});
      // Native scrolling stays available to mouse users; explicit handling also keeps wheel actions deterministic.
      p.addEventListener('wheel',e=>{e.preventDefault();p.scrollTop+=e.deltaY;state.P.mirror();},{passive:false});
      return p;
    };

    BASE.mirror = () => {
      const view={};
      for(const [id,p] of state.refs.panes) view[id]={px:p.scrollTop,h:p.clientHeight-state.D.paneInset*2,row:state.route?state.D.stopHeight+state.D.cardGap:state.D.cardHeight+state.D.cardGap};
      if(JSON.stringify(view)!==JSON.stringify(state.ctx.model.view)) state.ctx.patch({view});
    };

    BASE.commit = (m) => {
      state.ctx.update(m);state.P.paint(state.ctx.model);state.P.mirror();
    };

    BASE.attach = (card,it) => {
      let origin;
      env.ui.track(card,{
        start() {
          origin=card.getBoundingClientRect();state.dragging=it.id;
          state.refs.ghost=state.P.ghost(card,origin);card.classList.add('dragging');
        },
        move(p) {
          if(!state.refs.ghost) return;
          state.refs.ghost.style.left=`${origin.left+p.dx}px`;state.refs.ghost.style.top=`${origin.top+p.dy}px`;
          for(const [id,l] of state.refs.lanes) {const r=l.getBoundingClientRect();l.classList.toggle('over',p.x>=r.left&&p.x<=r.right&&p.y>=r.top&&p.y<=r.bottom);}
        },
        end(p) {
          state.refs.ghost?.remove();state.refs.ghost=null;card.classList.remove('dragging');state.dragging=null;
          for(const l of state.refs.lanes.values()) l.classList.remove('over');
          if(Math.abs(p.dx)+Math.abs(p.dy)<4) {state.selected=it.id;state.P.paint(state.ctx.model);if(state.ctx.size.width<state.D.roomyWidth) state.refs.inspector.classList.add('open');return;}
          if(state.route) {
            const pane=state.refs.panes.get('route'), r=pane.getBoundingClientRect();
            if(p.x<r.left||p.x>r.right||p.y<r.top||p.y>r.bottom) return;
            const i=state.u.clamp(Math.floor((p.y-r.top+pane.scrollTop-state.D.paneInset)/(state.D.stopHeight+state.D.cardGap)),0,state.ctx.model.order.length-1);
            state.P.commit(state.f.helpers.move(state.ctx.model,it.id,i,state.s));
          } else for(const [id,l] of state.refs.lanes) {
            const r=l.getBoundingClientRect();if(p.x>=r.left&&p.x<=r.right&&p.y>=r.top&&p.y<=r.bottom) {state.P.commit(state.f.helpers.move(state.ctx.model,it.id,id,state.s));break;}
          }
        }
      },'dispatch-card');
    };

    BASE.ghost = (card,origin) => {
      const ghost=card.cloneNode(true);ghost.classList.add('ad-ghost');ghost.style.width=`${origin.width}px`;ghost.style.height=`${origin.height}px`;
      ghost.style.left=`${origin.left}px`;ghost.style.top=`${origin.top}px`;state.app.appendChild(ghost);state.refs.ghost=ghost;
      return ghost;
    };
  }

  function installPlans(BASE, state) {
    BASE.stopContent = (it,el) => {
      state.P.icon(state.u.el('span','ad-grip',el),'grip',11);state.u.el('span','ad-stop-number',el);
      const copy=state.u.el('div','ad-stop-copy',el);state.u.el('div','ad-customer',copy,`${it.id} · ${it.name}`);state.u.el('div','ad-card-note',copy,`${it.address} · 10 min service`);state.u.el('span','ad-state',el,'Planned');state.u.el('span','ad-weight',el,`${it.weight} kg`);
    };

    BASE.cardContent = (it,el) => {
      const top=state.u.el('div','ad-card-top',el);state.P.icon(state.u.el('span','ad-grip',top),'grip',10);state.u.el('span','ad-id',top,it.id);state.u.el('span','ad-state',top);state.u.el('span','ad-weight',top,`${it.weight} kg`);
      state.u.el('div','ad-customer',el,it.name);
      const note=state.u.el('div','ad-card-note',el);state.P.icon(note,state.s.scenario==='warehouse'?(it.temp==='chilled'?'snow':it.haz?'alert':'box'):state.s.scenario==='board'?'clock':'pin',10);
      state.u.el('span','',note,state.s.scenario==='warehouse'?`${it.temp==='chilled'?'Chilled · 2–8°C':'Ambient'}${it.haz?' · HAZMAT':''}`:
        state.s.scenario==='board'?`${state.f.helpers.time(it.start)}–${state.f.helpers.time(it.end)}`:it.address);
      const ref=state.u.el('div','ad-card-ref',el);state.u.el('span','',ref,`${state.s.scenario==='warehouse'?'LOT':'ORD'}-${2800+state.s.items.indexOf(it)}`);state.u.el('span','',ref,state.s.scenario==='warehouse'?'QC released':state.s.scenario==='reschedule'?'Customer confirmed':'Signature required');
    };

    BASE.card = (it,parent) => {
      const el=state.u.el('div',`ad-card${state.route?' ad-stop':''}`,parent);el.setAttribute('aria-label',`${it.id}: ${it.name}, ${it.weight} kg`);el.title=`${it.id} · ${it.name} · ${it.address}`;
      if(state.route) state.P.stopContent(it,el);else state.P.cardContent(it,el);
      state.refs.cards.set(it.id,el);state.P.attach(el,it);state.P.item(el,it);return el;
    };

    BASE.laneHeader = (lane,l) => {
      const head=state.u.el('div','ad-lane-head',lane);state.refs.heads.set(l.id,head);const label=state.u.el('strong','',head);state.P.icon(label,l.id==='pool'?'archive':state.s.scenario==='warehouse'?'box':state.s.scenario==='reschedule'?'calendar':'truck',12);state.u.el('span','',label,l.label);
      state.u.el('span','ad-meta',head,l.id==='pool'?(state.s.scenario==='warehouse'?'Receipt RCV-2406':'Current plan backlog'):state.s.scenario==='warehouse'?`${l.temp==='chilled'?'Chilled · 2–8°C':'Ambient'}${l.haz?' · Hazmat certified':''}`:
        state.s.scenario==='board'?l.vehicle:'Scheduled deliveries');
      if(l.id!=='pool'&&state.s.scenario==='board') state.u.el('span','ad-meta',head,`Shift ${state.f.helpers.time(l.start)}–${state.f.helpers.time(l.end)}`);
      state.refs.loads.set(l.id,state.u.el('div','ad-load',head));const bar=state.u.el('div','ad-bar',head);state.refs.fills.set(l.id,state.u.el('div','ad-fill',bar));
      return head;
    };

    BASE.empty = (pane,l) => {
      const empty=state.u.el('div','ad-empty',pane);state.P.icon(empty,l.id==='pool'?'check':'archive',17);state.u.el('span','',empty,l.id==='pool'?(state.s.scenario==='warehouse'?'Receiving queue cleared':'All jobs allocated'):
        state.s.scenario==='warehouse'?'No stock allocated':state.s.scenario==='reschedule'?'No deliveries scheduled':'No jobs assigned');state.refs.rows.set(l.id,empty);
      return empty;
    };

    BASE.lane = (l,parent) => {
      const lane=state.u.el('section','ad-lane',parent);lane.setAttribute('aria-label',l.label);state.refs.lanes.set(l.id,lane);
      state.P.laneHeader(lane,l);
      const pane=state.P.pane(lane,l.id);state.P.empty(pane,l);
      state.P.laneDecorated(lane,l);return lane;
    };

    BASE.lanes = () => {
      const lanes=state.u.el('div','ad-lanes',state.main);lanes.style.gridTemplateColumns=`repeat(${state.s.lanes.length+1},minmax(0,1fr))`;
      for(const l of [{id:'pool',label:state.s.scenario==='warehouse'?'Receiving dock':'Unassigned'},...state.s.lanes]) state.P.lane(l,lanes);
      for(const it of state.s.items) state.P.card(it,state.refs.panes.get(state.ctx.model.assign[it.id]||'pool'));
    };

    BASE.routeList = (body) => {
      const left=state.u.el('div','ad-route-box',body);
      const rh=state.u.el('div','ad-route-head',left);state.u.el('strong','',rh,`Run N-24 · ${state.s.items.length} stops`);state.u.el('span','ad-muted',rh,`${state.s.routeCapacity} kg vehicle`);
      const start=state.u.el('div','ad-depot',left);state.P.icon(start,'pin',11);state.u.el('span','',start,' North depot · Departure');const pane=state.P.pane(left,'route','ad-route-list');
      for(const id of state.ctx.model.order) state.P.card(state.s.items.find(it=>it.id===id),pane);
      const end=state.u.el('div','ad-depot',left);state.P.icon(end,'pin',11);state.u.el('span','',end,' North depot · Return');
    };

    BASE.matrix = (body) => {
      const matrix=state.u.el('div','ad-matrix-box',body);const mh=state.u.el('div','ad-route-head',matrix);state.u.el('strong','',mh,'Distance matrix');state.u.el('span','ad-muted',mh,'Rows: from · Columns: to');
      const mp=state.u.el('div','ad-matrix-pane',matrix),table=state.u.el('table','ad-table',mp);table.setAttribute('aria-label','Directed distances in kilometers');
      const nodes=['depot',...state.s.items.map(it=>it.id)],thead=state.u.el('thead','',table),tr=state.u.el('tr','',thead);state.u.el('th','',tr,'km');
      nodes.forEach(id=>state.u.el('th','',tr,id==='depot'?'Depot':id));const tb=state.u.el('tbody','',table);state.refs.cells=new Map();
      for(const a of nodes) {const row=state.u.el('tr','',tb);state.u.el('th','',row,a==='depot'?'Depot':a);for(const b of nodes) state.refs.cells.set(`${a}/${b}`,state.u.el('td','',row,a===b?'—':String(state.s.distances[a][b])));}
      state.u.el('div','ad-policy',matrix,'Each value is the road distance from the row stop to the column stop. Highlighted cells show the current route. Depot travel is included.');
    };

    BASE.routes = () => {
      const body=state.u.el('div','ad-routes',state.main);state.P.routeList(body);state.P.matrix(body);
    };
  }

  function installInspector(BASE, state) {
    BASE.activity = () => {
      const dock=state.u.el('div','ad-activity-dock',state.main);state.refs.dock=dock;
      const issue=state.u.el('div','',dock);const issueTitle=state.u.el('b','',issue);state.P.icon(issueTitle,'alert',11);state.u.el('span','',issueTitle,' Plan exceptions');state.refs.issue=state.u.el('span','',issue);
      const feed=state.u.el('div','',dock);const feedTitle=state.u.el('b','',feed);state.P.icon(feedTitle,'activity',11);state.u.el('span','',feedTitle,' Depot activity');state.u.el('span','',feed,'09:37 · South depot manifest shared');
    };

    BASE.inspector = () => {
      const inspector=state.u.el('aside','ad-inspector',state.workspace);state.refs.inspector=inspector;inspector.setAttribute('aria-label','Shipment information');
      const ih=state.u.el('div','ad-inspector-head',inspector);state.u.el('span','',ih,state.route?'Route information':state.s.scenario==='warehouse'?'Receiving information':'Shipment information');state.P.button(ih,'','close',()=>{inspector.classList.remove('open');if(state.ctx.size.width>=state.D.roomyWidth)inspector.hidden=true;}).setAttribute('aria-label','Close details');
      state.detail=state.u.el('div','ad-section',inspector);state.refs.detail=state.detail;
      state.P.contextPanel(inspector);state.P.related(inspector);
    };

    BASE.serviceMap = (contextPanel) => {
      const map=state.u.svg('svg',{viewBox:'0 0 200 108',class:'ad-mini-map',role:'img','aria-label':'Schematic service area'},contextPanel);
      state.u.svg('path',{d:'M0 24h200M0 64h200M35 0v108M95 0v108M158 0v108',class:'ad-map-road'},map);
      const mr=state.ctx.rng.fork('service-map'),points={depot:[24,83]};state.s.items.forEach(it=>{points[it.id]=[mr.int(40,184),mr.int(12,91)];});state.refs.points=points;
      state.refs.routePath=state.u.svg('path',{class:'ad-map-route'},map);
      for(const [id,p] of Object.entries(points)) {state.u.svg('circle',{cx:p[0],cy:p[1],r:6},map);const t=state.u.svg('text',{x:p[0]+8,y:p[1]+3},map);t.textContent=id==='depot'?'Depot':id;}
      state.u.el('div','ad-mini-caption',contextPanel,'Service area schematic · distances use road km');
    };

    BASE.contextPanel = (inspector) => {
      const contextPanel=state.u.el('div','ad-section',inspector);state.u.el('h5','',contextPanel,state.route||state.s.scenario==='board'?'Service area':state.s.scenario==='warehouse'?'Storage locations':'Other delivery runs');
      if(state.route||state.s.scenario==='board') {
        state.P.serviceMap(contextPanel);
      } else if(state.s.scenario==='warehouse') {
        for(const [i,l] of state.s.lanes.entries()) {const row=state.u.el('div','ad-history-row',contextPanel);const b=state.u.el('b','',row);state.P.icon(b,'box',11);state.u.el('span','',b,` North / ${l.temp==='chilled'?'Cold room':'Dry storage'} / ${l.label}`);state.u.el('span','',row,`${l.haz?'Hazmat certified':'Standard receiving'} · ${l.capacity} kg limit`);}
        state.u.el('div','ad-note',contextPanel,'Quality desk: certificate for receipt RCV-2403 is pending. This receipt is released for put-away.');
      } else {
        [['Thursday','East district · 14 booked'],['Friday','South depot · 21 booked'],['Saturday','Collections only · 6 booked']].forEach(([a,b])=>{const r=state.u.el('div','ad-history-row',contextPanel);state.u.el('b','',r,a);state.u.el('span','',r,b);});
      }
    };

    BASE.related = (inspector) => {
      const related=state.u.el('div','ad-section',inspector);state.u.el('h5','',related,state.s.scenario==='warehouse'?'Other receipts':'Other active plans');
      state.bgRows.slice(0,5).forEach((row,i)=>{const r=state.u.el('div','ad-history-row',related);state.u.el('b','',r,`${row.ref} · ${state.s.scenario==='warehouse'?state.otherProducts[i].name:row.name}`);state.u.el('span','',r,row.status);});
    };

    BASE.footer = () => {
      state.work.appendChild(state.footer);
      for(let i=0;i<3;i++) state.refs.facts.push(state.u.el('span',i===2?'ad-reference':'',state.footer));
    };
  }

  function installPaint(BASE, state) {
    BASE.paintRoute = (m,alerts) => {
      const pane=state.refs.panes.get('route');
      m.order.forEach((id,i)=>{const el=state.refs.cards.get(id);if(pane.children[i]!==el) pane.insertBefore(el,pane.children[i]||null);el.querySelector('.ad-stop-number').textContent=String(i+1);});
      const seq=['depot',...m.order,'depot'],edges=new Set(seq.slice(1).map((id,i)=>`${seq[i]}/${id}`));
      for(const [key,el] of state.refs.cells) el.classList.toggle('on',edges.has(key));
      if(state.s.items.reduce((a,it)=>a+it.weight,0)>state.s.routeCapacity) alerts.push('Manifest exceeds vehicle capacity');
      const points=['depot',...m.order,'depot'].map(id=>state.refs.points[id]);
      state.refs.routePath.setAttribute('d',points.map((p,i)=>`${i?'L':'M'}${p[0]} ${p[1]}`).join(' '));
    };

    BASE.paintLanes = (m,alerts) => {
      const totals=state.f.helpers.loads(m,state.s);
      for(const [id,pane] of state.refs.panes) {
        const items=state.s.items.filter(it=>(m.assign[it.id]||'pool')===id);
        const empty=state.refs.rows.get(id);empty.hidden=items.length>0;
        items.forEach((it,i)=>{
          const el=state.refs.cards.get(it.id);if(pane.children[i+1]!==el) pane.insertBefore(el,pane.children[i+1]||null);
          const l=state.s.lanes.find(x=>x.id===id);el.classList.toggle('invalid',!!l&&(!state.f.helpers.compatible(it,l,state.s)||totals[id]>l.capacity));
          if(l&&!state.f.helpers.compatible(it,l,state.s)) alerts.push(`${it.id}: ${state.s.scenario==='warehouse'?'incompatible storage':'outside vehicle shift'}`);
          el.querySelector('.ad-state').textContent=!l?'Queued':!state.f.helpers.compatible(it,l,state.s)||totals[id]>l.capacity?'Review':'Assigned';
        });
        const l=state.s.lanes.find(x=>x.id===id),load=items.reduce((n,it)=>n+it.weight,0),bad=!!l&&load>l.capacity;
        if(bad) alerts.push(`${l.label}: ${load-l.capacity} kg over capacity`);
        state.refs.loads.get(id).replaceChildren();if(bad)state.P.icon(state.refs.loads.get(id),'alert',11);state.u.el('span','',state.refs.loads.get(id),l?`${load} / ${l.capacity} kg`:`${items.length} waiting · ${load} kg`);
        state.refs.loads.get(id).classList.toggle('ad-warn',bad);state.refs.lanes.get(id).classList.toggle('bad',bad);
        state.refs.fills.get(id).style.width=l?`${Math.min(100,100*load/l.capacity)}%`:'0%';
      }
    };

    BASE.detail = (m,alerts) => {
      const it=state.s.items.find(x=>x.id===state.selected),idx=state.s.items.indexOf(it),l=state.s.lanes.find(x=>x.id===m.assign[it.id]);
      state.detail.replaceChildren();state.u.el('h5','',state.detail,`${state.s.scenario==='warehouse'?'Inventory':'Delivery'} detail · ${it.id}`);state.u.el('div','ad-inspect-title',state.detail,it.name);
      const pairs=state.u.el('dl','ad-pairs',state.detail);
      const data=[['Reference',`${state.s.scenario==='warehouse'?'LOT':'ORD'}-${2800+idx}`],['Status',state.route?'Planned':l?'Assigned':'Awaiting allocation'],
        [state.s.scenario==='warehouse'?'Location':state.route?'Stop number':'Assigned to',state.route?String(m.order.indexOf(it.id)+1):l?l.label:'Unassigned'],
        ['Load',`${it.weight} kg`],['Contact',state.contacts[idx].full],
        state.s.scenario==='warehouse'?['Storage',`${it.temp}${it.haz?' / hazmat':''}`]:['Address',`${24+idx*7} ${it.address}`],
        state.s.scenario==='board'?['Window',`${state.f.helpers.time(it.start)}–${state.f.helpers.time(it.end)}`]:state.s.scenario==='warehouse'?['Quality','Released for put-away']:['Service','10 minutes / signature'],['Owner',state.dispatcher.full]];
      data.forEach(([key,value])=>{state.u.el('dt','',pairs,key);state.u.el('dd','',pairs,value);});
      state.u.el('div','ad-note',state.detail,state.noteText);
      if(alerts.length){state.u.el('h5','',state.detail,'Constraint alerts');state.u.el('div','ad-exceptions bad',state.detail,alerts.join('. '));}
    };

    BASE.paint = (m) => {
      if(state.dragging) return;
      state.painting=true;
      const alerts=[];
      if(state.route) state.P.paintRoute(m,alerts);else state.P.paintLanes(m,alerts);
      for(const [id,el] of state.refs.cards) el.classList.toggle('selected',id===state.selected);
      state.refs.exceptionCount.textContent=`${alerts.length} constraint ${alerts.length===1?'alert':'alerts'} · Autosaved`;
      state.refs.exceptionCount.classList.toggle('ad-alert-count',alerts.length>0);
      state.refs.issue.textContent=alerts.length?alerts.slice(0,2).join('; '):'No capacity or handling exceptions';state.refs.issue.title=alerts.join('; ');state.refs.issue.classList.toggle('ad-alert-count',alerts.length>0);
      state.P.detail(m,alerts);
      state.P.facts(m);
      state.painting=false;
    };

    BASE.facts = (m) => {
      state.f.facts(m,state.s).forEach((fact,i)=>{state.refs.facts[i].textContent=`${fact.label}: ${fact.value}`;});
    };

    BASE.locate = (t) => {
      if(t.item) return state.u.center(state.refs.cards.get(t.item));
      if(t.lane) return state.u.center(state.refs.heads.get(t.lane));
      if(t.pane) return state.u.center(state.refs.panes.get(t.pane));
      if(t.slot!==undefined) {const p=state.refs.panes.get('route'),r=p.getBoundingClientRect();return [r.left+r.width/2,r.top+state.D.paneInset+t.slot*(state.D.stopHeight+state.D.cardGap)+state.D.stopHeight/2-p.scrollTop];}
      throw new Error(`Unknown use-dispatch target: ${JSON.stringify(t)}`);
    };

    BASE.item = (el,it) => {};

    BASE.laneDecorated = (el,l) => {};

    BASE.rendered = (ctx) => {};
  }

  env.template('use-dispatch/workspace', (design, def) => {
    const state = {};
    const BASE = {};
    const S = {
      get ctx() { return state.ctx; }, get spec() { return state.s; }, get model() { return state.ctx.model; },
      get refs() { return state.refs; }, get route() { return state.route; }, get app() { return state.app; },
      get selected() { return state.selected; }, set selected(id) { state.selected=id; },
      get D() { return state.D; }, get P() { return state.P; },
      get content() { return { dispatcher: state.dispatcher, contacts: state.contacts, otherProducts: state.otherProducts, otherPlans: state.otherPlans, bgRows: state.bgRows, noteText: state.noteText }; },
      els: {
        get rail() { return state.rail; }, set rail(el) { state.rail=el; }, get work() { return state.work; }, set work(el) { state.work=el; }, get workspace() { return state.workspace; }, set workspace(el) { state.workspace=el; },
        get main() { return state.main; }, set main(el) { state.main=el; }, get footer() { return state.footer; }, set footer(el) { state.footer=el; }, get detail() { return state.detail; }, set detail(el) { state.detail=el; },
        get pop() { return state.pop; }, set pop(el) { state.pop=el; }, get background() { return state.background; }, set background(el) { state.background=el; },
      },
    };

    installFrame(BASE, state);

    installDrag(BASE, state);

    installPlans(BASE, state);

    installInspector(BASE, state);

    installPaint(BASE, state);

    ({ D: state.D, P: state.P } = env.templateDesign('use-dispatch/workspace', design, def, { tokens: TOKENS, base: BASE, state: S }));
    return {
      render(next) {
        state.ctx=next;state.s=state.ctx.spec;state.f=env.taskDef;state.u=state.ctx.util;state.route=state.s.scenario==='route-order';
        state.P.styles(state.ctx);state.app=state.P.frame(state.ctx);
        state.refs={cards:new Map(),lanes:new Map(),panes:new Map(),heads:new Map(),loads:new Map(),fills:new Map(),facts:[],rows:new Map()};
        state.dragging=null;state.painting=false;state.selected=state.s.items[0].id;
        state.P.content(state.ctx);state.P.toolbar();
        state.background=state.u.el('div','ad-popover',state.app);state.background.hidden=true;
        state.P.shell();state.P.rail();state.P.navigation();state.P.context();state.P.filters();state.P.workspace();
        if(state.route) state.P.routes();else state.P.lanes();
        state.P.activity();state.P.inspector();state.P.footer();
        state.P.paint(state.ctx.model);state.P.mirror();state.P.rendered(state.ctx);
        return { anchors: [state.app], sync(m) { state.P.paint(m);state.P.mirror(); } };
      },
      locate(t) { return state.P.locate(t); },
    };
  });
})();
