/*
 * use-travel/portal: Wayfarer portal, shared by seat, daterange, flights, hotels and change.
 * Defaults (design: {}) reproduce design-use-travel-seat-01, design-use-travel-daterange-01,
 * design-use-travel-flights-01, design-use-travel-hotels-01 and design-use-travel-change-01 respectively.
 * No scenario presets: the shared workflow dispatches by spec.scenario and changeKind.
 * CSS uses the site's --accent, --panel, --fg, --muted and --line by default.
 * Tokens (all defaults are listed in TOKENS below):
 *   brand: brand text ('wayfarer'); appLabel: accessible app name ('Wayfarer travel booking').
 *   titles: scenario heading table (Choose your seat / Plan your stay / Find your flight /
 *     Find a place to stay / Manage your booking); icons: 24px SVG path table (ICONS).
 *   compactWidth: compact breakpoint (700); workspaceWidth: workspace breakpoint (1120);
 *     summaryWidth: side summary breakpoint (890); all use ctx.size.width in px.
 *   inset: app inset ('8px'); radius: app radius ('8px'); fontSize: app font size ('13px');
 *     fontFamily: optional app font (null leaves the site's inherited font).
 *   railWidth: filters ('202px'); workspaceRailWidth: navigation ('154px');
 *     summaryRailWidth: trip summary ('219px').
 *   accent/panel/foreground/muted/line: CSS colors (var(--accent/panel/fg/muted/line)).
 *   positive: positive text color ('color-mix(in srgb,#258452 75%,var(--fg))');
 *     starColor: hotel stars ('#b18432'); artColors: thumbnail palette, replaced as a whole:
 *     {sun:'#fff8dc', wall:'#e1d5bd', roof:'#6c766f', wing:'#b8aa91', window:'#51646a',
 *      mullion:'#b9c5bb', sill:'#a79983', door:'#465852', canopy:'#647e74', ground:'#bfc3b3',
 *      trunk:'#857960', foliage:'#5d7965'}; backdrop hues derive from the property's hash.
 *   weekdays: calendar labels (Su through Sa); seatColumns: cabin labels (A B C '' D E F);
 *     legend: class/label pairs (''/Available, sel/Selected, occ/Occupied).
 *   steps: Trip details / Your selection / Review & payment;
 *     changeSteps: Your booking / Make changes / Review & confirm.
 *   reviewLabel: 'Review booking'; changeReviewLabel: 'Review change'; bookLabel: 'Book and pay'.
 * Parts: overrides are (base, S) => replacement; every template call goes through P.
 *   svg(parent, name, label) -> SVG element: 24px icon from D.icons.
 *   hotelArt(parent, id, save = false) -> element: deterministic architectural thumbnail and optional save button.
 *   plainButton(parent, text, icon, action, cls = '') -> element: ordinary button with icon and callback.
 *   panel(name) -> void: toggle an unscored auxiliary drawer.
 *   resetFilters() -> void: reset filters and repaint.
 *   register(t, node, inPane = false) -> element: register oracle target and visibility tracking.
 *   act(t) -> void: apply business transition, confirmation flag and repaint.
 *   button(parent, text, target, cls = '', inPane = false) -> element: registered business-action button.
 *   line(parent, icon, text, cls='at-services') -> element: icon and text row.
 *   worknav() -> void: workspace links and recent trips.
 *   sidepanel(m) -> void: stay/flight/change summary.
 *   drawPanel(m) -> void: auxiliary drawer contents.
 *   visibility() -> void: mirror pane/filter visibility and geometry to unscored model pageState.
 *   newPane(parent) -> element: tracked native scroll pane with optional notice.
 *   dropdown(parent, label, name, options, value) -> void: trigger and DOM option popup.
 *   checkbox(parent, text, name, value, checked, count) -> void: registered filter checkbox and optional count.
 *   calendar(main, m) -> void: stay/departure fields, two months and terms.
 *   seats(main, m) -> void: cabin heading, legend, equipment and rows.
 *   resultFilters(rail, m) -> void: flight/hotel filter rail.
 *   results(main, m) -> void: sorted result list, toolbar, chips and cards.
 *   review(main, m) -> void: itinerary facts, confirmation, traveler and payment modules.
 *   manage(main,m) -> void: existing booking and change entry with baggage/payment modules.
 *   paint() -> void: reset controls, dispatch views, restore scroll and mirror visibility.
 *   details(ctx) -> object: draws the original travel-details fork in its original order.
 *   frame(ctx) -> void: create app, topbar, route, progress, content and footer containers.
 *   app(ctx) -> element: responsive, labeled app anchor.
 *   topbar(app) -> void: brand, navigation and account controls.
 *   route(app) -> void: breadcrumb, scenario title and trip summary.
 *   month(months, month, m) -> void: month title, weekday grid and day cells.
 *   day(grid, month, d, m) -> void: registered day button with range/disabled pageState.
 *   seatRow(cabin, row, m) -> void: exit-row container and its seats.
 *   seat(r, x, row, m) -> void: aisle number and registered seat button with fee/occupancy.
 *   resultCard(p, x, m) -> void: result article, information, expansion and price.
 *   flightInfo(info, x, m) -> void: carrier, itinerary and services.
 *   hotelInfo(info, x, m) -> void: property name, stars, location, rating, room and amenities.
 *   resultDetails(info, x, m, hotel) -> void: expand control and conditional fare/room details.
 *   resultPrice(card, x, m, hotel) -> void: fare/nightly price and registered select control.
 *   filterChips(main, m) -> void: applied-filter chips and remove callbacks.
 *   resultToolbar(main, m, rows) -> void: result count and sort dropdown.
 *   emptyResults(p, m) -> void: no-results message and clear-filters control.
 *   priceFilter(rail, m) -> void: price label, histogram and dual-thumb slider.
 *   histogram(rail) -> void: price-distribution SVG.
 *   placeThumb(t, p, f) -> style object: place a thumb in track-relative percent.
 *   progress(m) -> void: active workflow steps and saved/pricing status.
 *   passengerRail(m) -> void: passenger assignment, companion, cabin guide and policy.
 *   main(m, isResults) -> void: create main container and dispatch review/manage/calendar/results/seats.
 *   footer(m) -> void: selection total/status and registered review/back/book controls.
 *   el(tag, cls, parent, text) -> element: delegates to ctx.util.el.
 *   locate(t) -> [x,y]: read registered target rect or slider oracle helper; no DOM changes.
 *   style(ctx) -> void: install structural CSS using D tokens.
 *   render(next) -> {anchors,sync}: initialize live episode state, draw decoration/frame and repaint.
 *   begin(ctx) -> void: no-op before style/details/frame.
 *   rendered(ctx) -> void: no-op after initial paint.
 *   painted(ctx) -> void: no-op after every paint, before visibility measurement.
 *   cardBuilt(card, x, m) -> void: no-op after each result card.
 *   dayBuilt(cell, iso, m) -> void: no-op after each calendar cell.
 *   seatBuilt(seat, x, m) -> void: no-op after each seat.
 * S exposes live ctx/spec/model/details, app/progress/content/footer/pane/rail/slider
 * (all seven settable), refs, tracked/filterTracked, and resolved D/P.
 * Keep all random draws in order, especially details(ctx); extra decoration uses another fork.
 * Registered buttons, pane tracking, act, visibility and locate hold the workflow/oracle wiring;
 * restyles normally replace frame/panel/item parts instead. No DOM work happens in the factory.
 */
(function () {
  'use strict';

  // Original SVG artwork: symbols share a 24px viewBox and inherit the site's light/dark tokens.
  const ICONS = {
    plane:'M22 2 9 15m13-13-7 20-4-9-9-4Z', hotel:'M3 21V5h12v16M15 10h6v11M7 9h4m-4 4h4m-4 4h4M1 21h22',
    search:'m21 21-5-5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z', calendar:'M4 5h16v16H4ZM8 2v6m8-6v6M4 10h16',
    user:'M20 21v-2a6 6 0 0 0-6-6h-4a6 6 0 0 0-6 6v2M16 5a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
    bell:'M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4',
    chevron:'m8 4 8 8-8 8', down:'m6 9 6 6 6-6', check:'m5 12 4 4L19 6', close:'m6 6 12 12M6 18 18 6',
    bag:'M4 7h16v14H4ZM8 7V3h8v4M8 11v6m8-6v6', shield:'m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6Zm-4 10 3 3 5-6',
    pin:'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM15 10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z',
    clock:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM12 6v6l4 2', card:'M2 5h20v15H2ZM2 10h20M5 16h5',
    heart:'M12 21 3 12a6 6 0 0 1 9-8 6 6 0 0 1 9 8Z', info:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM12 11v6m0-10v1',
    seat:'M7 3v10h11l3 7M3 16h13l2 5M7 6h9v6M7 3H4v9', coffee:'M3 7h14v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5ZM17 8h4v6h-4M6 2v2m5-2v2',
    star:'m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z', arrow:'M3 12h18m-6-6 6 6-6 6',
    help:'M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0ZM9 8a3 3 0 0 1 6 0c0 2-3 2-3 5m0 3v1',
    map:'m2 6 6-3 8 3 6-3v15l-6 3-8-3-6 3Zm6-3v15m8-12v15', wifi:'M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0m-11 4a6 6 0 0 1 8 0m-4 4h.01',
  };

  const TOKENS = {
    brand: 'wayfarer',
    appLabel: 'Wayfarer travel booking',
    titles: {seat: 'Choose your seat', daterange: 'Plan your stay', flights: 'Find your flight', hotels: 'Find a place to stay', change: 'Manage your booking'},
    icons: ICONS,
    compactWidth: 700,
    workspaceWidth: 1120,
    summaryWidth: 890,
    inset: '8px',
    radius: '8px',
    fontSize: '13px',
    fontFamily: null,
    railWidth: '202px',
    workspaceRailWidth: '154px',
    summaryRailWidth: '219px',
    accent: 'var(--accent)',
    panel: 'var(--panel)',
    foreground: 'var(--fg)',
    muted: 'var(--muted)',
    line: 'var(--line)',
    positive: 'color-mix(in srgb,#258452 75%,var(--fg))',
    starColor: '#b18432',
    artColors: {sun: '#fff8dc', wall: '#e1d5bd', roof: '#6c766f', wing: '#b8aa91', window: '#51646a', mullion: '#b9c5bb', sill: '#a79983', door: '#465852', canopy: '#647e74', ground: '#bfc3b3', trunk: '#857960', foliage: '#5d7965'},
    weekdays: ['Su','Mo','Tu','We','Th','Fr','Sa'],
    seatColumns: ['A','B','C','','D','E','F'],
    legend: [['','Available'],['sel','Selected'],['occ','Occupied']],
    steps: ['Trip details','Your selection','Review & payment'],
    changeSteps: ['Your booking','Make changes','Review & confirm'],
    reviewLabel: 'Review booking',
    changeReviewLabel: 'Review change',
    bookLabel: 'Book and pay',
  };
  const CSS = (D) => `
  .at-app{position:absolute;inset:${D.inset};display:flex;flex-direction:column;overflow:hidden;border:1px solid ${D.line};border-radius:12px;background:${D.panel};box-shadow:0 8px 28px #0001;font-size:13px}
  .at-app *{box-sizing:border-box}.at-app button{font:inherit;cursor:pointer;color:${D.foreground};background:${D.panel};border:1px solid ${D.line};border-radius:6px;padding:6px 10px}
  .at-app button:hover{border-color:${D.accent};background:color-mix(in srgb,${D.accent} 9%,${D.panel})}.at-app button:disabled{opacity:.45;cursor:not-allowed}.at-app button.on,.at-app .at-primary{background:${D.accent};color:white;border-color:${D.accent}}
  .at-top{height:43px;flex:none;display:flex;align-items:center;gap:22px;padding:0 16px;border-bottom:1px solid ${D.line}}.at-brand{font-size:18px;font-weight:800;letter-spacing:-.5px;color:${D.accent}}.at-nav{color:${D.muted};font-size:12px}.at-account{margin-left:auto;color:${D.muted};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:190px}
  .at-route{flex:none;padding:9px 16px;background:color-mix(in srgb,${D.accent} 5%,${D.panel});border-bottom:1px solid ${D.line};display:flex;align-items:center;gap:12px}.at-route h2{font-size:17px;margin:0 0 2px;line-height:1.2}.at-muted{color:${D.muted};font-size:12px}.at-chip{display:inline-block;border:1px solid ${D.line};border-radius:15px;padding:2px 9px;font-size:11px;white-space:nowrap}.at-route .at-chip{margin-left:auto}
  .at-content{flex:1;min-height:0;display:flex;position:relative;overflow:hidden}.at-rail{flex:none;width:188px;padding:12px;border-right:1px solid ${D.line};overflow:auto;overscroll-behavior:contain}.at-rail h3{font-size:13px;margin:0 0 10px}.at-rail p{margin:6px 0 12px}.at-check{display:flex;align-items:center;gap:6px;margin:9px 0;line-height:1.25;font-size:12px;cursor:pointer}.at-check input{accent-color:${D.accent};flex:none;margin:0}
  .at-field{margin:10px 0;position:relative}.at-field>span{display:block;font-size:11px;color:${D.muted};margin-bottom:4px}.at-field>button{width:100%;text-align:left;display:flex;justify-content:space-between;gap:6px;min-height:31px}.at-pop{position:absolute;left:0;right:0;top:100%;margin-top:3px;background:${D.panel};border:1px solid ${D.line};padding:4px;border-radius:7px;z-index:20;box-shadow:0 6px 20px #0003;max-height:160px;overflow:auto}.at-pop button{display:block;width:100%;text-align:left;border:0;padding:6px}.at-pop button.on{background:color-mix(in srgb,${D.accent} 15%,${D.panel});color:${D.accent}}
  .at-main{flex:1;min-width:0;min-height:0;display:flex;flex-direction:column}.at-toolbar{padding:7px 12px;flex:none;display:flex;align-items:center;gap:8px;border-bottom:1px solid ${D.line}}.at-toolbar .at-field{margin:0 0 0 auto;width:148px}.at-toolbar .at-field>span{display:none}
  .at-pane{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;padding:12px;scrollbar-width:thin;touch-action:pan-y}.at-footer{flex:none;min-height:56px;border-top:1px solid ${D.line};padding:8px 14px;display:flex;align-items:center;gap:12px;background:${D.panel}}.at-footer>div:first-child{flex:1;min-width:0}.at-footer button{flex:none}.at-footer strong{font-size:14px}.at-status{font-size:11px;color:${D.muted};margin-top:2px}.at-notice{color:${D.accent};font-size:11px}
  .at-seat-wrap{max-width:360px;margin:0 auto;border:1px solid ${D.line};border-radius:80px 80px 16px 16px;padding:24px 18px 18px;background:color-mix(in srgb,${D.foreground} 2%,${D.panel})}.at-cockpit{text-align:center;font-size:10px;color:${D.muted};margin-bottom:13px;letter-spacing:2px}.at-seat-row{display:grid;grid-template-columns:repeat(3,minmax(25px,1fr)) 24px repeat(3,minmax(25px,1fr));gap:6px;align-items:center;margin-bottom:7px}.at-seat-row.exit{border-top:1px dashed ${D.accent};padding-top:6px}.at-seat-row.exit::before{content:'EXIT';grid-column:1/-1;text-align:center;font-size:9px;letter-spacing:3px;color:${D.muted}}.at-seat-row button{height:31px;padding:0;font-size:11px;border-radius:6px 6px 3px 3px;border-bottom-width:3px}.at-seat-row button:disabled{background:color-mix(in srgb,${D.foreground} 12%,${D.panel});color:${D.muted}}.at-seat-row button.companion{border-color:${D.accent};opacity:1}.at-rownum{text-align:center;font-size:11px;color:${D.muted}}.at-seat-head{display:flex;justify-content:space-around;color:${D.muted};font-size:11px;margin-bottom:9px}
  .at-legend{display:flex;flex-wrap:wrap;gap:9px;margin-bottom:12px;font-size:10px;color:${D.muted}}.at-legend i{display:inline-block;width:10px;height:10px;border:1px solid ${D.line};border-radius:2px;vertical-align:middle}.at-legend i.sel{background:${D.accent}}.at-legend i.occ{background:color-mix(in srgb,${D.foreground} 20%,${D.panel})}
  .at-dates{display:flex;gap:8px;padding:10px 12px;border-bottom:1px solid ${D.line}}.at-dates button{flex:1;text-align:left;font-size:12px}.at-dates small{display:block;color:${D.muted};font-size:10px}.at-calbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}.at-months{display:grid;grid-template-columns:1fr 1fr;gap:16px}.at-month-title{text-align:center;font-weight:700;margin:0 0 8px}.at-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:2px;grid-auto-rows:28px}.at-grid>span{text-align:center;font-size:10px;color:${D.muted};align-self:center}.at-grid button{padding:0;border-color:transparent;font-size:12px;border-radius:4px}.at-grid button.inrange{background:color-mix(in srgb,${D.accent} 14%,${D.panel});border-radius:0}.at-grid button:disabled{text-decoration:line-through}.at-calnote{margin-top:10px;color:${D.muted};font-size:11px;line-height:1.5}.at-empty{text-align:center;padding:30px 10px;color:${D.muted}}
  .at-card{border:1px solid ${D.line};border-radius:9px;padding:12px;margin-bottom:9px;display:flex;align-items:center;gap:12px;min-height:96px;background:${D.panel}}.at-card.chosen{border-color:${D.accent};box-shadow:inset 3px 0 ${D.accent}}.at-card-main{flex:1;min-width:0}.at-card h3{margin:0 0 5px;font-size:14px}.at-card-meta{font-size:11px;color:${D.muted};line-height:1.6}.at-card-price{text-align:right;flex:none}.at-card-price strong{display:block;font-size:18px}.at-card-price button{margin-top:5px;font-size:12px}.at-airline{width:34px;height:34px;display:grid;place-items:center;background:color-mix(in srgb,${D.accent} 12%,${D.panel});border-radius:7px;color:${D.accent};font-weight:800;flex:none}.at-tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:6px}.at-tags span{font-size:10px;padding:1px 5px;border-radius:3px;background:color-mix(in srgb,${D.foreground} 5%,${D.panel})}
  .at-track{position:relative;height:8px;margin:20px 9px 17px;background:${D.line};border-radius:4px;touch-action:none}.at-thumb{position:absolute;width:18px;height:18px;border:2px solid ${D.panel};border-radius:50%;background:${D.accent};box-shadow:0 0 0 1px ${D.accent};cursor:ew-resize}.at-range-label{font-weight:600;font-size:12px}.at-summary{max-width:620px;margin:0 auto}.at-summary h3{margin:0 0 12px;font-size:18px}.at-summary dl{display:grid;grid-template-columns:1fr 1fr;gap:10px 20px;margin:16px 0;padding:16px;border:1px solid ${D.line};border-radius:9px}.at-summary dt{color:${D.muted}}.at-summary dd{margin:0;text-align:right;font-weight:650}.at-summary p{line-height:1.6}.at-confirm{padding:9px 12px;border-radius:7px;border:1px solid ${D.line};color:${D.muted};font-size:12px}.at-manage{border:1px solid ${D.line};padding:16px;border-radius:10px;margin:10px auto;max-width:610px}.at-manage h3{margin:0 0 12px}.at-manage button{margin-top:12px}
  .at-app.compact .at-nav{display:none}.at-app.compact .at-account{max-width:110px}.at-app.compact .at-rail{width:165px;padding:9px}.at-app.compact .at-card{gap:7px;padding:9px}.at-app.compact .at-airline{display:none}.at-app.compact .at-months{gap:8px}.at-app.compact .at-route{padding:8px 12px}.at-app.compact .at-route h2{font-size:15px}.at-app.compact .at-grid{grid-auto-rows:25px}.at-app.compact .at-card h3{font-size:12px}.at-app.compact .at-card-price strong{font-size:15px}.at-app.compact .at-rail.seat-info{width:150px}
  .at-app{border-radius:${D.radius};font-size:${D.fontSize};${D.fontFamily == null ? '' : `font-family:${D.fontFamily};`}--at-soft:color-mix(in srgb,${D.foreground} 4%,${D.panel});--at-green:${D.positive};font-variant-numeric:tabular-nums}
  .at-ico{width:16px;height:16px;flex:none;vertical-align:middle;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}
  .at-app button{display:inline-flex;align-items:center;justify-content:center;gap:6px;border-radius:5px}.at-top{height:46px;gap:16px}.at-brand{display:flex;gap:7px;align-items:center;letter-spacing:-.7px;font-size:21px}.at-brand>.at-ico{width:25px;height:25px}
  .at-nav{display:flex;align-self:stretch;gap:4px}.at-app .at-nav button{border:0;border-radius:0;background:transparent;padding:0 10px;font-size:12px;color:${D.muted}}.at-app .at-nav button.active{border-bottom:3px solid ${D.accent};color:${D.foreground};font-weight:700}
  .at-account{display:flex;gap:6px;align-items:center;max-width:none;overflow:visible}.at-app .at-iconbtn{position:relative;width:31px;height:31px;padding:0;border:0;background:transparent}.at-dot{position:absolute;top:2px;right:2px;width:6px;height:6px;background:${D.accent};border:1px solid ${D.panel};border-radius:50%}.at-avatar{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:var(--at-soft);font-weight:750;font-size:11px;color:${D.foreground}}
  .at-route{background:${D.panel};padding:9px 16px;gap:14px;min-height:59px}.at-route h2{font-size:18px}.at-breadcrumb{display:flex;gap:6px;align-items:center;color:${D.muted};font-size:10px;margin-bottom:4px}.at-breadcrumb .at-ico{width:10px;height:10px}.at-tripbrief{margin-left:auto;display:flex;gap:12px;align-items:center;font-size:11px;flex:none}.at-tripbrief>div{border-left:1px solid ${D.line};padding-left:12px}.at-tripbrief small{display:block;color:${D.muted};font-size:10px}
  .at-progress{display:flex;align-items:center;gap:16px;flex:none;height:28px;padding:0 16px;border-bottom:1px solid ${D.line};background:var(--at-soft);font-size:10px;color:${D.muted}}.at-progress span{display:flex;align-items:center;gap:5px}.at-stepnum{border:1px solid ${D.line};display:grid;place-items:center;border-radius:50%;width:16px;height:16px;font-size:9px}.at-progress .current{color:${D.accent};font-weight:700}.at-progress .current .at-stepnum{background:${D.accent};color:#fff;border-color:${D.accent}}.at-progress>.at-muted{margin-left:auto;font-size:10px}
  .at-worknav{width:${D.workspaceRailWidth};flex:none;border-right:1px solid ${D.line};background:var(--at-soft);padding:14px 10px;overflow:auto;font-size:11px}.at-worknav h4{font-size:10px;letter-spacing:.07em;text-transform:uppercase;color:${D.muted};margin:5px 7px 10px}.at-worknav>button{display:flex;width:100%;justify-content:flex-start;margin:3px 0;background:transparent;border:0;padding:8px}.at-worknav .navon{background:${D.panel};border:1px solid ${D.line};font-weight:650}.at-worknav .at-recent{padding:10px 7px;border-top:1px solid ${D.line};margin-top:12px}.at-recent p{margin:4px 0 12px;font-size:10px;line-height:1.5;color:${D.muted}}
  .at-rail{width:${D.railWidth};background:${D.panel};padding:12px}.at-rail h3{margin-top:0;display:flex;justify-content:space-between;align-items:center}.at-rail h4{font-size:11px;margin:15px 0 8px}.at-rail summary{font-size:11px;font-weight:650;margin:12px 0 7px;cursor:pointer}.at-rail details{border-top:1px solid ${D.line};margin-top:12px}.at-facetrow{display:flex;align-items:center;gap:6px;justify-content:space-between;color:${D.muted};font-size:11px;margin:7px 0}.at-app .at-textbtn{padding:0;border:0;background:transparent;color:${D.accent};font-size:11px;text-align:left}.at-check{justify-content:space-between;gap:7px;margin:10px 0}.at-check>span{flex:1}.at-count{font-size:10px;color:${D.muted}}.at-histogram{display:block;width:100%;height:25px;margin-top:8px;fill:color-mix(in srgb,${D.accent} 25%,${D.panel})}.at-track{margin-top:5px}.at-field>button{justify-content:space-between}.at-pop button{justify-content:flex-start}
  .at-toolbar{gap:8px;padding:7px 12px;min-height:42px}.at-toolbar strong{font-size:12px}.at-filterline{flex:none;padding:6px 12px;border-bottom:1px solid ${D.line};display:flex;gap:5px;align-items:center;overflow:auto;white-space:nowrap;min-height:29px;background:var(--at-soft)}.at-filterline>.at-muted{font-size:10px}.at-app .at-filterchip{padding:2px 6px;font-size:10px;background:${D.panel};border-radius:12px;flex:none}.at-filterchip .at-ico{width:10px;height:10px}
  .at-pane{background:var(--at-soft);padding:12px}.at-card{position:relative;min-height:136px;border-radius:7px;align-items:stretch;gap:12px;padding:12px;margin-bottom:10px}.at-card h3{font-size:15px;line-height:1.25}.at-card-price{min-width:99px;display:flex;flex-direction:column;justify-content:center;align-items:flex-end;border-left:1px solid ${D.line};padding-left:12px}.at-card-price strong{font-size:21px;letter-spacing:-.6px}.at-card-price .at-muted{font-size:10px}.at-card-price button{min-width:84px}.at-carrier{display:flex;gap:7px;align-items:center;font-size:11px;margin-bottom:9px}.at-airline{width:26px;height:26px;border-radius:5px;font-size:10px}.at-itinerary{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:5px 0 8px;max-width:450px}.at-time strong{display:block;font-size:19px;line-height:1.1;letter-spacing:-.6px}.at-time small{font-size:10px;color:${D.muted}}.at-duration{flex:1;max-width:150px;text-align:center;font-size:10px;color:${D.muted};position:relative}.at-flightline{display:flex;align-items:center;margin:2px 0;color:${D.muted}}.at-flightline::before,.at-flightline::after{content:'';height:1px;background:${D.line};flex:1}.at-flightline .at-ico{width:12px;height:12px;margin:0 3px}.at-services{display:flex;gap:12px;align-items:center;flex-wrap:wrap;font-size:10px;color:${D.muted};line-height:1.5}.at-services span{display:inline-flex;align-items:center;gap:4px}.at-services .at-ico{width:12px;height:12px}.at-details{font-size:11px;color:${D.muted};border-top:1px solid ${D.line};padding-top:8px;margin-top:8px;line-height:1.6}
  .at-propertyart{width:108px;min-height:115px;flex:none;overflow:hidden;border-radius:5px;position:relative;background:#dce8e6}.at-propertyart>svg{display:block;width:100%;height:100%;position:absolute;inset:0}.at-propertyart .at-iconbtn{position:absolute;right:4px;top:4px;background:${D.panel};border:1px solid ${D.line};border-radius:50%;width:25px;height:25px}.at-hotelcard{min-height:160px}.at-stars{display:inline-flex;gap:1px;color:${D.starColor};margin-bottom:4px}.at-stars .at-ico{width:10px;height:10px;fill:currentColor;stroke-width:1}.at-rating{display:inline-flex;align-items:center;gap:5px;font-size:10px;margin:4px 0}.at-rating>b{background:${D.accent};color:#fff;padding:3px 5px;border-radius:5px 5px 5px 0;font-size:11px}.at-location{font-size:10px;color:${D.muted};margin:3px 0 5px}.at-roomtype{font-size:11px;font-weight:600;margin-top:6px}.at-positive{color:var(--at-green);font-size:10px;line-height:1.6}.at-tags{gap:3px;margin-top:4px}.at-tags span{font-size:9px;background:var(--at-soft)}
  .at-sidepanel{width:${D.summaryRailWidth};flex:none;border-left:1px solid ${D.line};padding:12px;overflow:auto;background:${D.panel}}.at-sidepanel h3{font-size:13px;margin:0 0 9px}.at-sidepanel h4{font-size:11px;margin:12px 0 6px}.at-sidepanel .at-propertyart{width:100%;height:100px;min-height:100px;margin-bottom:10px}.at-sidepanel p{font-size:11px;line-height:1.5;margin:7px 0}.at-sidepanel dl{display:grid;grid-template-columns:1fr auto;gap:7px;font-size:11px;margin:12px 0}.at-sidepanel dt{color:${D.muted}}.at-sidepanel dd{margin:0;text-align:right;font-weight:600}.at-rule{height:1px;background:${D.line};margin:12px 0}.at-totalrow{display:flex;justify-content:space-between;font-size:12px;font-weight:750;border-top:1px solid ${D.line};padding-top:10px;margin-top:8px}.at-assignment{padding:10px;border:1px solid ${D.accent};border-radius:6px;margin:10px 0;background:color-mix(in srgb,${D.accent} 6%,${D.panel})}.at-assignment strong{display:block;margin:5px 0}.at-sectionlabel{font-size:9px;text-transform:uppercase;letter-spacing:.07em;color:${D.muted}}
  .at-seat-wrap{max-width:346px;border-radius:65px 65px 18px 18px;padding:18px 16px;background:${D.panel};position:relative}.at-cockpit{margin-bottom:10px}.at-equipment{display:flex;align-items:center;justify-content:space-between;margin:8px 12px 13px;color:${D.muted};font-size:9px}.at-seat-head{display:grid;grid-template-columns:repeat(3,1fr) 24px repeat(3,1fr);gap:5px;text-align:center;margin-bottom:7px}.at-seat-row{gap:5px;margin-bottom:5px}.at-seat-row button{height:37px;display:flex;flex-direction:column;gap:0;position:relative;line-height:1.15;background:color-mix(in srgb,${D.accent} 5%,${D.panel});border-color:color-mix(in srgb,${D.accent} 30%,${D.line})}.at-seat-row button small{font-size:8px;color:${D.muted}}.at-seat-row button.on{background:${D.accent}}.at-seat-row button.on small{color:#fff}.at-seat-row button .at-ico{width:10px;height:10px;position:absolute;top:1px;right:1px}.at-seat-row button:disabled{opacity:1;color:${D.muted};background:var(--at-soft);border-color:${D.line}}.at-seat-row button.companion{border-color:${D.accent};color:${D.accent}}.at-seat-infohead{padding:8px 12px;border-bottom:1px solid ${D.line};display:flex;justify-content:space-between;align-items:center;font-size:11px;background:${D.panel}}
  .at-stayintro{padding:10px 12px;border-bottom:1px solid ${D.line};display:flex;gap:10px;align-items:center;background:${D.panel}}.at-stayintro>.at-ico{color:${D.accent};width:24px;height:24px}.at-stayintro strong{font-size:13px;display:block}.at-stayintro small{font-size:10px;color:${D.muted}}.at-dates{padding:8px 12px;background:${D.panel}}.at-dates button{display:block;position:relative;padding:6px 9px}.at-dates button>.at-ico{position:absolute;right:8px;top:14px;color:${D.muted}}.at-dates button small{font-size:9px}.at-calbar{margin-bottom:9px}.at-months{background:${D.panel};padding:10px;border:1px solid ${D.line};border-radius:7px;gap:18px}.at-grid{grid-auto-rows:27px}.at-month-title{font-size:12px}.at-calnote{display:flex;gap:6px;align-items:flex-start;font-size:10px}.at-stayterms{background:${D.panel};border:1px solid ${D.line};padding:10px;border-radius:6px;font-size:11px;margin-top:12px;line-height:1.6}.at-empty{max-width:440px;margin:auto;padding:30px 12px}.at-empty>.at-ico{width:32px;height:32px;color:${D.accent};margin-bottom:8px}.at-empty h3{font-size:16px;color:${D.foreground};margin:4px 0 8px}.at-empty p{font-size:12px;line-height:1.6}.at-empty button{margin-top:8px}
  .at-manage{max-width:850px;padding:0;background:${D.panel};margin:0 auto 12px}.at-managehead{padding:12px 14px;display:flex;justify-content:space-between;gap:12px;align-items:center;border-bottom:1px solid ${D.line}}.at-manage h3{margin:0;font-size:15px}.at-tagstatus{display:inline-flex;align-items:center;gap:4px;border-radius:4px;padding:3px 6px;background:color-mix(in srgb,#258452 10%,${D.panel});font-size:10px;color:var(--at-green)}.at-tagstatus .at-ico{width:12px;height:12px}.at-managebody{padding:12px 14px}.at-manage .at-itinerary{max-width:none;margin:12px 0}.at-bookingtools{display:flex;gap:14px;border-bottom:1px solid ${D.line};padding:0 12px;font-size:11px;color:${D.muted}}.at-bookingtools span{padding:9px 0}.at-bookingtools span:first-child{color:${D.accent};border-bottom:2px solid ${D.accent}}.at-module{padding:12px 14px;border:1px solid ${D.line};border-radius:7px;background:${D.panel};margin:10px 0;line-height:1.5;font-size:11px}.at-module h4{display:flex;align-items:center;gap:6px;font-size:12px;margin:0 0 8px}.at-module p{margin:5px 0}.at-servicegrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}.at-servicegrid>.at-module{margin:0}.at-alert{display:flex;gap:7px;align-items:flex-start;font-size:11px;line-height:1.4;padding:9px 12px;border:1px solid ${D.line};border-radius:6px;background:${D.panel};margin:0 0 10px;color:${D.muted}}.at-alert .at-ico{color:${D.accent}}
  .at-summary{max-width:760px}.at-summary h3{font-size:19px;margin-bottom:6px}.at-summary dl{background:${D.panel};margin:12px 0;padding:14px;gap:8px 20px;font-size:12px}.at-confirm{display:flex;gap:8px;line-height:1.5;background:${D.panel}}.at-confirm .at-ico{color:var(--at-green);margin-top:1px}.at-footer{min-height:55px}.at-footer strong{font-size:13px}.at-footer .at-primary{min-height:34px}.at-footer .at-status{display:flex;align-items:center;gap:5px;font-size:10px}.at-footer .at-status .at-ico{width:11px;height:11px}
  .at-drawer{position:absolute;top:43px;right:10px;width:290px;max-width:calc(100% - 20px);max-height:calc(100% - 60px);overflow:auto;background:${D.panel};border:1px solid ${D.line};border-radius:7px;padding:12px;box-shadow:0 8px 28px #0003;z-index:30}.at-drawer h3{font-size:13px;margin:0 0 12px}.at-drawer p{font-size:11px;line-height:1.6;color:${D.muted}}.at-drawer>button{float:right}
  .at-app.compact .at-account{max-width:none}.at-app.compact .at-accountname,.at-app.compact .at-tripbrief,.at-app.compact .at-progress>.at-muted{display:none}.at-app.compact .at-top{gap:8px;padding:0 11px}.at-app.compact .at-brand{font-size:19px}.at-app.compact .at-progress{gap:8px;font-size:9px;padding:0 11px}.at-app.compact .at-card{padding:9px;gap:9px;min-height:137px}.at-app.compact .at-propertyart{width:68px;min-height:113px}.at-app.compact .at-card-price{min-width:72px;padding-left:7px}.at-app.compact .at-card-price button{min-width:63px;padding:6px 7px;font-size:11px}.at-app.compact .at-card-price strong{font-size:17px}.at-app.compact .at-card h3{font-size:13px}.at-app.compact .at-time strong{font-size:16px}.at-app.compact .at-services{gap:6px}.at-app.compact .at-hotelcard .at-tags{display:none}.at-app.compact .at-duration{min-width:45px}.at-app.compact .at-months{padding:7px;gap:10px}.at-app.compact .at-grid{grid-auto-rows:26px}.at-app.compact .at-seat-infohead>span{font-size:10px}.at-app.compact .at-footer strong{font-size:11px}.at-app.compact .at-footer{padding:8px;gap:7px}.at-app.compact .at-footer>button{font-size:11px;padding:6px 8px}.at-app.compact .at-servicegrid{grid-template-columns:1fr}
  .at-sidepanel .at-services{flex-wrap:nowrap;align-items:flex-start;gap:6px;font-size:10px;margin:6px 0}.at-sidepanel .at-services>span{min-width:0;display:block}.at-location{display:flex;align-items:center;gap:3px}.at-location .at-ico{width:12px;height:12px}.at-sectionlabel:has(>.at-ico),div.at-muted:has(>.at-ico){display:flex;align-items:center;gap:5px}.at-worknav>button{font-size:11px;text-align:left}.at-app summary{list-style:none;display:flex;align-items:center;gap:5px}.at-app summary::-webkit-details-marker{display:none}.at-app summary>.at-ico{width:12px;height:12px}.at-app details[open]>summary>.at-ico{transform:rotate(180deg)}
  `;

  function installControls(BASE, pageState) {
    BASE.svg = (parent, name, label) => {
      const node = document.createElementNS(pageState.ns, 'svg');
      node.setAttribute('viewBox','0 0 24 24');node.classList.add('at-ico');
      node.setAttribute('aria-hidden', label ? 'false' : 'true');
      if (label) node.setAttribute('aria-label',label);
      const path = document.createElementNS(pageState.ns,'path');path.setAttribute('d',pageState.D.icons[name] || pageState.D.icons.info);node.append(path);parent.append(node);return node;
    };

    BASE.hotelArt = (parent, id, save = false) => {
      const art = pageState.P.el('div','at-propertyart',parent), hue = pageState.U.hash32(id) % 70 + 160;
      const scene = document.createElementNS(pageState.ns,'svg');scene.setAttribute('viewBox','0 0 160 160');scene.setAttribute('preserveAspectRatio','xMidYMid slice');
      scene.setAttribute('role','img');scene.setAttribute('aria-label','Hotel exterior illustration');
      // Original architectural thumbnail: no remote assets or embedded icon fonts.
      const shape = (tag, attrs) => {const n=document.createElementNS(pageState.ns,tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,String(v));scene.append(n);};
      shape('rect',{width:160,height:160,fill:`hsl(${hue} 25% 85%)`});
      shape('circle',{cx:136,cy:26,r:20,fill:pageState.D.artColors.sun});
      shape('path',{d:'M0 92 35 73 80 88 120 64 160 88V160H0Z',fill:`hsl(${hue} 19% 64%)`});
      shape('rect',{x:18,y:36,width:115,height:113,fill:pageState.D.artColors.wall});
      shape('rect',{x:18,y:32,width:115,height:7,fill:pageState.D.artColors.roof});
      shape('rect',{x:111,y:48,width:30,height:101,fill:pageState.D.artColors.wing});
      for(let y=49;y<130;y+=24)for(let x=28;x<110;x+=23){
        shape('rect',{x,y,width:13,height:17,fill:pageState.D.artColors.window});
        shape('path',{d:`M${x+6} ${y}v17m-6-8h13`,stroke:pageState.D.artColors.mullion,'stroke-width':1});
        shape('rect',{x:x-2,y:y+17,width:17,height:2,fill:pageState.D.artColors.sill});
      }
      shape('rect',{x:62,y:123,width:31,height:27,fill:pageState.D.artColors.door});
      shape('path',{d:'m54 124 13-9h26l12 9Z',fill:pageState.D.artColors.canopy});
      shape('path',{d:'M0 149h160v11H0',fill:pageState.D.artColors.ground});
      for(const x of [8,149]){shape('rect',{x:x-2,y:116,width:4,height:36,fill:pageState.D.artColors.trunk});shape('ellipse',{cx:x,cy:111,rx:14,ry:29,fill:pageState.D.artColors.foliage});}
      art.append(scene);
      if(save){const b=pageState.P.plainButton(art,'','heart',()=>{const saved=pageState.ctx.model.travelSaved || [];pageState.ctx.patch({travelSaved:saved.includes(id)?saved.filter(x=>x!==id):[...saved,id]});pageState.P.paint();},'at-iconbtn');b.setAttribute('aria-label',(pageState.ctx.model.travelSaved || []).includes(id)?'Remove from saved properties':'Save property');if((pageState.ctx.model.travelSaved || []).includes(id))b.style.color=pageState.D.accent;}
      return art;
    };

    BASE.plainButton = (parent, text, icon, action, cls = '') => {
      const b=pageState.P.el('button',cls,parent);b.type='button';if(icon)pageState.P.svg(b,icon);if(text)pageState.P.el('span','',b,text);if(action)b.addEventListener('click',action);return b;
    };

    BASE.panel = (name) => {
      pageState.ctx.patch({travelPanel:pageState.ctx.model.travelPanel===name?'':name});pageState.P.paint();
    };

    BASE.resetFilters = () => {
      pageState.ctx.patch({filters:{nonstop:false,alliance:'',before:1440,min:0,max:pageState.s.maxPrice,rating:0,amenities:[]},scroll:0,filterScroll:0,booked:false,menu:''});pageState.P.paint();
    };

    BASE.register = (t, node, inPane = false) => {
      pageState.refs.set(pageState.F.helpers.key(t), node);
      if (inPane) pageState.tracked.push([t, node]);
      if (pageState.rail && pageState.rail.contains(node)) pageState.filterTracked.push([t, node]);
      return node;
    };

    BASE.act = (t) => {
      if (t.control === 'book' && pageState.s.judge && pageState.s.judge.mode === 'confirm') pageState.ctx.flag('irreversible');
      pageState.ctx.update(pageState.F.helpers.apply(pageState.ctx.model, pageState.s, t)); pageState.P.paint();
    };

    BASE.button = (parent, text, target, cls = '', inPane = false) => {
      const b = pageState.P.register(target, pageState.P.el('button', cls, parent, text), inPane);
      b.type = 'button'; b.addEventListener('click', () => pageState.P.act(target)); return b;
    };

    BASE.line = (parent, icon, text, cls='at-services') => {
      const row=pageState.P.el('div',cls,parent);pageState.P.svg(row,icon);pageState.P.el('span','',row,text);return row;
    };
  }

  function installPanels(BASE, pageState) {
    BASE.worknav = () => {
      const nav=pageState.P.el('aside','at-worknav',pageState.content);pageState.P.el('h4','',nav,'Your workspace');
      for(const [name,icon]of [['Upcoming trips','calendar'],['Saved properties','heart'],['Price alerts','bell'],['Wallet & receipts','card'],['Traveler profiles','user']])
        pageState.P.plainButton(nav,name,icon,()=>pageState.P.panel(name),name==='Upcoming trips'?'navon':'');
      const recent=pageState.P.el('div','at-recent',nav);pageState.P.el('h4','',recent,'Recent trips');
      for(let i=0;i<pageState.details.otherTrips.length;i++){pageState.P.el('strong','',recent,pageState.details.otherTrips[i].city);pageState.P.el('p','',recent,`${pageState.F.helpers.fmtDate(pageState.C.addDays(pageState.s.calendar.base,-18-i*32))}\n${i===0?'Receipt available':'Completed'}`);}
      pageState.P.el('h4','',nav,'Wayfarer rewards');pageState.P.el('p','at-muted',nav,`${pageState.details.member.toLocaleString('en-US')} points available`);
    };

    BASE.sidepanel = (m) => {
      const side=pageState.P.el('aside','at-sidepanel',pageState.content);side.setAttribute('aria-label','Trip summary');
      if(pageState.s.scenario==='daterange') {
        pageState.P.hotelArt(side,pageState.details.property);pageState.P.el('h3','',side,pageState.details.property);pageState.P.line(side,'pin',`${pageState.details.street}, ${pageState.s.dest.city}`,'at-services');
        pageState.P.el('div','at-rating',side,`8.8 / 10 · Excellent · 624 reviews`);pageState.P.el('div','at-rule',side);
        pageState.P.el('h4','',side,pageState.details.room);pageState.P.el('p','at-muted',side,'1 room · 1 adult · 1 large bed');
        const dl=pageState.P.el('dl','',side),n=pageState.F.helpers.nights(m.start,m.end);
        for(const [k,v]of [['Check-in',pageState.F.helpers.fmtDate(m.start)],['Check-out',pageState.F.helpers.fmtDate(m.end)],['Nightly rate',pageState.F.helpers.money(pageState.s.nightly)],['Nights',String(n)]]){pageState.P.el('dt','',dl,k);pageState.P.el('dd','',dl,v);}
        const total=pageState.P.el('div','at-totalrow',side);pageState.P.el('span','',total,'Stay total');pageState.P.el('span','',total,pageState.F.helpers.money(n*pageState.s.nightly));
        pageState.P.el('p','at-muted',side,'Includes taxes and property fees. No deposit required.');pageState.P.line(side,'shield','Free cancellation before check-in','at-positive');
      } else {
        pageState.P.el('h3','',side,pageState.s.scenario==='change'?'Change summary':'Your flight');
        pageState.P.el('div','at-sectionlabel',side,'Economy Standard');pageState.P.el('p','',side,`${pageState.s.origin.city} to ${pageState.s.dest.city}`);
        pageState.P.el('p','at-muted',side,`${pageState.details.flight.airline} · ${pageState.details.flight.no}`);pageState.P.line(side,'calendar',pageState.F.helpers.fmtDate(pageState.s.scenario==='change'?m.date:pageState.s.original.date),'at-services');
        const dl=pageState.P.el('dl','',side);
        const rows=pageState.s.scenario==='change'?[['Original date',pageState.F.helpers.fmtDate(pageState.s.original.date)],['Original seat',pageState.s.original.seat],['New seat',m.seat || 'Not selected'],['Change fee',pageState.F.helpers.money(pageState.s.changeFee)]]
          :[['Traveler',pageState.s.passenger],['Seat',m.seat || 'Not selected'],['Seat fee',pageState.F.helpers.money((pageState.s.seats.find(x=>x.id===m.seat)||{}).fare || 0)]];
        for(const [k,v]of rows){pageState.P.el('dt','',dl,k);pageState.P.el('dd','',dl,v);}
        pageState.P.el('div','at-rule',side);pageState.P.el('h4','',side,'Included with your fare');pageState.P.line(side,'bag','1 cabin bag + 1 checked bag');pageState.P.line(side,'coffee','Complimentary refreshments');pageState.P.line(side,'shield','Changes permitted; fees may apply');
        pageState.P.el('div','at-rule',side);pageState.P.el('h4','',side,'Need a hand?');pageState.P.el('p','at-muted',side,'Travel support is available before and during your trip.');pageState.P.plainButton(side,'Contact travel support','help',()=>pageState.P.panel('Support'),'at-textbtn');
      }
    };

    BASE.drawPanel = (m) => {
      for(const n of pageState.app.querySelectorAll(':scope > .at-drawer'))n.remove();
      if(!m.travelPanel)return;
      const drawer=pageState.P.el('aside','at-drawer',pageState.app);drawer.setAttribute('aria-label',m.travelPanel);
      pageState.P.plainButton(drawer,'','close',()=>pageState.P.panel(m.travelPanel),'at-iconbtn').setAttribute('aria-label','Close panel');
      pageState.P.el('h3','',drawer,m.travelPanel);
      if(m.travelPanel==='Notifications'||m.travelPanel==='Price alerts') {
        pageState.P.line(drawer,'bell','Your price alerts are up to date.');pageState.P.el('p','',drawer,`Flights to ${pageState.details.otherTrips[0].city}: no price change since your last search.`);
        pageState.P.line(drawer,'card','Receipt ready');pageState.P.el('p','',drawer,`Your ${pageState.details.otherTrips[1].city} trip receipt is available in Wallet & receipts.`);
      }else if(['My trips','Upcoming trips','Flights','Stays'].includes(m.travelPanel)) {
        for(const city of pageState.details.otherTrips){pageState.P.el('h4','',drawer,city.city);pageState.P.el('p','',drawer,`${pageState.F.helpers.fmtDate(pageState.C.addDays(pageState.s.calendar.base,-20))} · Completed · Receipt available`);}
      }else if(m.travelPanel==='Account'||m.travelPanel==='Traveler profiles') {
        pageState.P.el('strong','',drawer,pageState.s.passenger);pageState.P.el('p','',drawer,pageState.details.email);pageState.P.el('p','',drawer,`Rewards balance: ${pageState.details.member} points. Preferred currency: USD.`);
      }else if(m.travelPanel==='Saved properties')pageState.P.el('p','',drawer,`${(m.travelSaved || []).length} saved properties. Use the heart on a property to save it for later.`);
      else if(m.travelPanel==='Wallet & receipts')pageState.P.el('p','',drawer,`Travel wallet ending ${pageState.details.card}. Receipts from completed trips are retained in your account.`);
      else {pageState.P.el('p','',drawer,'Manage your itinerary, review baggage policies, or get help with a booking.');pageState.P.el('p','',drawer,`Booking reference: ${pageState.s.reference}. Support hours: every day, 06:00–23:00.`);}
    };
  }

  function installPaneControls(BASE, pageState) {
    BASE.visibility = () => {
      if (!pageState.pane) return;
      const r = pageState.pane.getBoundingClientRect(), visible = [], above = [];
      for (const [t, node] of pageState.tracked) {
        const b = node.getBoundingClientRect();
        if (b.top >= r.top + 1 && b.bottom <= r.bottom - 1) visible.push(pageState.F.helpers.key(t));
        else if (b.top < r.top + 1) above.push(pageState.F.helpers.key(t));
      }
      const filterVisible = [], filterAbove = [];
      if (pageState.rail) {
        const rr = pageState.rail.getBoundingClientRect();
        for (const [t, node] of pageState.filterTracked) {
          const b = node.getBoundingClientRect();
          if (b.top >= rr.top + 1 && b.bottom <= rr.bottom - 1) filterVisible.push(pageState.F.helpers.key(t));
          else if (b.top < rr.top + 1) filterAbove.push(pageState.F.helpers.key(t));
        }
      }
      pageState.ctx.patch({scroll: pageState.pane.scrollTop, visible, above, filterVisible, filterAbove, filterScroll: pageState.rail ? pageState.rail.scrollTop : 0,
        paneH: pageState.pane.clientHeight, filterH: pageState.rail ? pageState.rail.clientHeight : 0});
    };

    BASE.newPane = (parent) => {
      const current = pageState.ctx;
      pageState.pane = pageState.P.el('div', 'at-pane', parent); pageState.P.register({pane: true}, pageState.pane);
      pageState.pane.addEventListener('scroll', () => { if (pageState.ctx === current && !pageState.painting) pageState.P.visibility(); });
      if(pageState.ctx.model.notice && /unavailable|another date/i.test(pageState.ctx.model.notice))pageState.P.line(pageState.pane,'info',pageState.ctx.model.notice,'at-alert');
      return pageState.pane;
    };

    BASE.dropdown = (parent, label, name, options, value) => {
      const wrap = pageState.P.el('div', 'at-field', parent); pageState.P.el('span', '', wrap, label);
      const current = options.find(x => x[0] === value);
      const trigger=pageState.P.button(wrap,current ? current[1] : String(value),{menu:name});pageState.P.svg(trigger,'down');
      trigger.setAttribute('aria-expanded',String(pageState.ctx.model.menu===name));trigger.setAttribute('aria-label',`${label}: ${current ? current[1] : value}`);
      if (pageState.ctx.model.menu === name) {
        const pop = pageState.P.el('div', 'at-pop', pageState.app);
        const ar = pageState.app.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
        Object.assign(pop.style, {right:'auto',width:`${Math.max(wr.width,160)}px`,maxHeight:`${ar.height-24}px`,
          left:`${Math.max(6,Math.min(wr.left-ar.left,ar.width-170))}px`,top:'0px'});
        for (const [v, text] of options) pageState.P.button(pop, text, {option: v}, value === v ? 'on' : '');
        pop.style.top = `${Math.max(8,Math.min(wr.bottom-ar.top+3,ar.height-pop.getBoundingClientRect().height-9))}px`;
      }
    };

    BASE.checkbox = (parent, text, name, value, checked, count) => {
      const label = pageState.P.el('label', 'at-check', parent), check = pageState.P.el('input', '', label);
      check.type = 'checkbox'; check.checked = checked; pageState.P.register({filter: name, value}, check);
      pageState.P.el('span', '', label, text); check.addEventListener('change', () => pageState.P.act({filter: name, value}));
      if(count!==undefined)pageState.P.el('small','at-count',label,String(count));
    };
  }

  function installViews(BASE, pageState) {
    BASE.calendar = (main, m) => {
      const intro=pageState.P.el('div','at-stayintro',main);pageState.P.svg(intro,pageState.s.scenario==='change'?'plane':'hotel');const stay=pageState.P.el('div','',intro);
      pageState.P.el('strong','',stay,pageState.s.scenario==='change'?`${pageState.s.origin.city} to ${pageState.s.dest.city}`:pageState.details.property);
      pageState.P.el('small','',stay,pageState.s.scenario==='change'?`${pageState.details.flight.no} · Economy Standard · Current departure ${pageState.F.helpers.fmtDate(pageState.s.original.date)}`:`${pageState.details.room} · 1 room, 1 adult · ${pageState.s.dest.city}`);
      const fields = pageState.P.el('div', 'at-dates', main);
      const start = pageState.P.button(fields, '', {control: 'calendar'});
      pageState.P.el('small', '', start, pageState.s.scenario === 'change' ? 'Departure date' : 'Check-in');
      pageState.P.el('span', '', start, pageState.F.helpers.fmtDate(pageState.s.scenario === 'change' ? m.date : m.start));
      pageState.P.svg(start,'calendar');
      if (pageState.s.scenario === 'daterange') {
        const end = pageState.P.el('button', '', fields); pageState.P.el('small', '', end, 'Check-out'); pageState.P.el('span', '', end, pageState.F.helpers.fmtDate(m.end));
        pageState.P.svg(end,'calendar');
        end.addEventListener('click', () => pageState.P.act({control: 'calendar'}));
      }
      const p = pageState.P.newPane(main);
      if (!m.open) {
        const empty = pageState.P.el('div', 'at-empty', p);
        pageState.P.svg(empty,m.end?'check':'calendar');
        pageState.P.el('h3', '', empty, pageState.s.scenario === 'change' ? 'Choose a new departure date' : m.end ? 'Your dates are selected' : 'When are you travelling?');
        pageState.P.el('p', '', empty, pageState.s.scenario === 'daterange' ? `${pageState.F.helpers.money(pageState.s.nightly)} per night · Flexible cancellation` : 'Your route and passenger details stay the same.');
        if(m.end)pageState.P.line(empty,'shield','Your room is available for the selected dates.','at-positive');
        pageState.P.plainButton(empty,m.end?'Adjust dates':'View available dates','calendar',()=>pageState.P.act({control:'calendar'}));
        return;
      }
      const bar = pageState.P.el('div', 'at-calbar', p);
      const prev = pageState.P.button(bar, '', {nav: -1}, '', true), nextMonth = pageState.F.helpers.addMonth(m.view, 1);
      pageState.P.svg(prev,'chevron').style.transform='rotate(180deg)';
      prev.setAttribute('aria-label', 'Previous month');
      pageState.P.el('span', 'at-muted', bar, pageState.s.scenario === 'daterange' ? m.start && !m.end ? 'Select check-out' : 'Select check-in' : 'Select departure');
      const next=pageState.P.button(bar,'',{nav:1},'',true);pageState.P.svg(next,'chevron');next.setAttribute('aria-label','Next month');
      const months = pageState.P.el('div', 'at-months', p);
      for (const month of [m.view, nextMonth]) {
        pageState.P.month(months, month, m);
      }
      pageState.P.line(p,'info',pageState.s.scenario==='change'?'Unavailable departures are crossed out. All times are local. Your existing booking is retained until you confirm the change.':'Unavailable dates are crossed out. Check-in from 15:00. Check-out by 11:00. All times are local.','at-calnote');
      const terms=pageState.P.el('div','at-stayterms',p);pageState.P.el('strong','',terms,pageState.s.scenario==='change'?'Fare conditions':'Your room includes');
      pageState.P.el('div','at-positive',terms,pageState.s.scenario==='change'?`Change fee ${pageState.F.helpers.money(pageState.s.changeFee)}. Your seat and baggage allowance stay the same.`:'Private bathroom · Free Wi-Fi · Daily housekeeping');
      pageState.P.el('div','at-muted',terms,pageState.s.scenario==='change'?'Review your updated itinerary before payment.':'No prepayment needed. Cancellation terms apply to the entire stay.');
    };

    BASE.seats = (main, m) => {
      const header=pageState.P.el('div','at-seat-infohead',main);pageState.P.line(header,'plane',`${pageState.details.flight.no} · Single-aisle aircraft · Economy`);pageState.P.el('span','at-muted',header,`${pageState.s.seats.filter(x=>!x.occupied).length} available`);
      const p = pageState.P.newPane(main), legend = pageState.P.el('div', 'at-legend', p);
      for (const [cls, name] of pageState.D.legend) {
        const span = pageState.P.el('span', '', legend); pageState.P.el('i', cls, span); pageState.P.el('span', '', span, ` ${name}`);
      }
      const cabin = pageState.P.el('div', 'at-seat-wrap', p); pageState.P.el('div', 'at-cockpit', cabin, 'FRONT OF AIRCRAFT');
      const equipment=pageState.P.el('div','at-equipment',cabin);pageState.P.line(equipment,'coffee','Galley');pageState.P.line(equipment,'user','Lavatory');
      const head=pageState.P.el('div','at-seat-head',cabin);for(const label of pageState.D.seatColumns)pageState.P.el('span','',head,label);
      for (const row of [...new Set(pageState.s.seats.map(x => x.row))]) {
        pageState.P.seatRow(cabin, row, m);
      }
      const back=pageState.P.el('div','at-equipment',cabin);pageState.P.line(back,'bag','Rear galley');pageState.P.line(back,'user','Lavatory');
      pageState.P.line(p,'info','Seat availability may change until your assignment is confirmed. Window: A/F. Aisle: C/D.','at-calnote');
    };

    BASE.resultFilters = (rail, m) => {
      const heading=pageState.P.el('h3','',rail,'Filter results');pageState.P.plainButton(heading,'Reset',null,() => pageState.P.resetFilters(),'at-textbtn');
      if (pageState.s.scenario === 'flights') {
        pageState.P.checkbox(rail, `Nonstop only (${pageState.s.flights.filter(x=>!x.stops).length})`, 'nonstop', !m.filters.nonstop, m.filters.nonstop);
        // Both boolean target values point to the same checkbox.
        pageState.refs.set(pageState.F.helpers.key({filter: 'nonstop', value: m.filters.nonstop}), pageState.refs.get(pageState.F.helpers.key({filter: 'nonstop', value: !m.filters.nonstop})));
        pageState.P.dropdown(rail, 'Airline alliance', 'alliance', [['','All alliances'], ...pageState.F.helpers.ALLIANCES.map(a => [a,a])], m.filters.alliance);
        pageState.P.dropdown(rail, 'Depart before', 'before', [...new Set([1440,660,780,900,pageState.s.goal.before])].sort((a,b)=>a-b).map(a => [a,a === 1440 ? 'Any time' : pageState.F.helpers.time(a)]), m.filters.before);
        pageState.P.dropdown(rail, 'Maximum fare', 'max', [...new Set([pageState.s.maxPrice,250,350,450,pageState.s.goal.max])].sort((a,b)=>a-b).map(a => [a,pageState.F.helpers.money(a)]), m.filters.max);
        const airlines=pageState.P.el('details','',rail);pageState.P.svg(pageState.P.el('summary','',airlines,'Airlines on this route'),'down');
        for(const name of [...new Set(pageState.s.flights.map(x=>x.airline))]){const row=pageState.P.el('div','at-facetrow',airlines);pageState.P.el('span','',row,name);pageState.P.el('span','',row,String(pageState.s.flights.filter(x=>x.airline===name).length));}
        const fare=pageState.P.el('details','',rail);pageState.P.svg(pageState.P.el('summary','',fare,'Fare information'),'down');pageState.P.el('p','at-muted',fare,'Economy Standard includes a cabin bag and seat selection for a fee. Changes may incur a fare difference.');
        pageState.P.el('p', 'at-muted', rail, 'Prices include taxes. All departure times are local.');
      } else {
        pageState.P.priceFilter(rail, m);
        pageState.P.dropdown(rail, 'Minimum guest rating', 'rating', [...new Set([0,7.2,7.8,8,8.5,9,9.4,pageState.s.goal.rating])].map(a => [a,a ? `${a.toFixed(1)}+` : 'Any rating']), m.filters.rating);
        pageState.P.el('h3', '', rail, 'Amenities');
        for (const a of pageState.F.helpers.AMENITIES) pageState.P.checkbox(rail, a, 'amenities', a, m.filters.amenities.includes(a),pageState.s.hotels.filter(x=>x.amenities.includes(a)).length);
        const areas=pageState.P.el('details','',rail);pageState.P.svg(pageState.P.el('summary','',areas,'Neighborhoods'),'down');for(const area of [...new Set(pageState.s.hotels.map(x=>x.area))]){const row=pageState.P.el('div','at-facetrow',areas);pageState.P.el('span','',row,area);pageState.P.el('span','',row,String(pageState.s.hotels.filter(x=>x.area===area).length));}
        pageState.P.el('p','at-muted',rail,'Guest ratings are based on verified stays. Nightly rates include property fees.');
      }
    };

    BASE.results = (main, m) => {
      const rows = pageState.F.helpers.order(pageState.s, m);
      pageState.P.resultToolbar(main, m, rows);
      pageState.P.filterChips(main, m);
      const p = pageState.P.newPane(main);
      if (!rows.length) {
        pageState.P.emptyResults(p, m);return;
      }
      for (const x of rows) {
        pageState.P.resultCard(p, x, m);
      }
      pageState.P.line(p,'info',`${rows.length} of ${pageState.s.scenario==='hotels'?pageState.s.hotels.length:pageState.s.flights.length} results shown. Prices and availability are subject to confirmation.`,'at-calnote');
    };

    BASE.review = (main, m) => {
      const p = pageState.P.newPane(main), box = pageState.P.el('div', 'at-summary', p);
      const state=pageState.P.el('div','at-tagstatus',box);pageState.P.svg(state,m.booked?'check':'shield');pageState.P.el('span','',state,m.booked?'Booking confirmed':'Secure booking review');
      pageState.P.el('h3', '', box, m.booked ? 'Your itinerary is confirmed' : 'Review your itinerary');
      pageState.P.el('div', 'at-muted', box, `${pageState.s.passenger} · ${pageState.s.origin.city} to ${pageState.s.dest.city}`);
      const dl = pageState.P.el('dl', '', box);
      const add = (label, value) => { pageState.P.el('dt', '', dl, label); pageState.P.el('dd', '', dl, value); };
      if (pageState.s.scenario === 'daterange') { add('Check-in',pageState.F.helpers.fmtDate(m.start));add('Check-out',pageState.F.helpers.fmtDate(m.end)); }
      if (pageState.s.scenario === 'flights') { const x = pageState.s.flights.find(x=>x.id===m.selected); if(x) { add('Flight',`${x.airline} · ${x.no}`);add('Departure',pageState.F.helpers.time(x.dep)); } }
      if (pageState.s.scenario === 'hotels') { const x = pageState.s.hotels.find(x=>x.id===m.selected); if(x) add('Hotel',x.name); }
      if (pageState.s.scenario === 'change') {
        if (pageState.s.goal.changeKind === 'seat') add('Seat',m.seat || 'Not selected');
        else add('Departure',pageState.F.helpers.fmtDate(m.date));
      }
      for (const fact of pageState.F.facts(m,pageState.s)) add(fact.label,fact.value);
      if (!['flights','hotels'].includes(pageState.s.scenario)) add('Booking reference',m.booked?pageState.s.reference:'Pending');
      const confirmation=pageState.P.el('div','at-confirm',box);pageState.P.svg(confirmation,'shield');pageState.P.el('span','',confirmation,m.booked?'A confirmation is saved in My trips. Your receipt is available in Wallet & receipts.':'Review the itinerary and price before completing your booking. Payment confirms the reservation and accepts the fare or property conditions.');
      const grid=pageState.P.el('div','at-servicegrid',box);
      const traveler=pageState.P.el('section','at-module',grid);pageState.P.line(traveler,'user','Traveler & contact','at-services');pageState.P.el('p','',traveler,pageState.s.passenger);pageState.P.el('p','at-muted',traveler,pageState.details.email);pageState.P.el('p','at-muted',traveler,'1 adult · Primary contact');
      const payment=pageState.P.el('section','at-module',grid);pageState.P.line(payment,'card',m.booked?'Payment receipt':'Payment method','at-services');pageState.P.el('p','',payment,`Travel wallet ending ${pageState.details.card}`);pageState.P.el('p','at-muted',payment,m.booked?`Reference ${pageState.s.reference} · Receipt saved`:'Your saved payment method will be used only when you confirm.');
      const policies=pageState.P.el('details','at-module',box);pageState.P.svg(pageState.P.el('summary','',policies,'Booking conditions and cancellation policy'),'down');pageState.P.el('p','at-muted',policies,'Names must match travel documents. Cancellation and changes are subject to the selected fare or property policy. Taxes and service fees are included in the displayed total.');
    };

    BASE.manage = (main,m) => {
      const tabs=pageState.P.el('div','at-bookingtools',main);for(const label of ['Overview','Passengers','Baggage','Payments'])pageState.P.el('span','',tabs,label);
      const p=pageState.P.newPane(main);
      pageState.P.line(p,'info','Your itinerary is confirmed. Online check-in opens 24 hours before departure.','at-alert');
      const box=pageState.P.el('section','at-manage',p), head=pageState.P.el('div','at-managehead',box), info=pageState.P.el('div','',head);
      pageState.P.el('div','at-sectionlabel',info,'Booking reference');pageState.P.el('h3','',info,pageState.s.reference);
      pageState.P.button(head,'Change booking',{control:'edit'},'at-primary',true);
      const body=pageState.P.el('div','at-managebody',box),status=pageState.P.el('div','at-tagstatus',body);pageState.P.svg(status,'check');pageState.P.el('span','',status,'Confirmed · Upcoming trip');
      pageState.P.el('p','at-muted',body,`${pageState.F.helpers.fmtDate(m.date)} · ${pageState.details.flight.airline} · ${pageState.details.flight.no}`);
      const itinerary=pageState.P.el('div','at-itinerary',body);
      const from=pageState.P.el('div','at-time',itinerary);pageState.P.el('strong','',from,pageState.s.origin.iata);pageState.P.el('small','',from,pageState.s.origin.city);
      const duration=pageState.P.el('div','at-duration',itinerary);pageState.P.el('span','',duration,`${Math.floor(pageState.details.flight.duration/60)}h ${pageState.details.flight.duration%60}m`);pageState.P.svg(pageState.P.el('div','at-flightline',duration),'plane');pageState.P.el('span','',duration,'Economy Standard');
      const to=pageState.P.el('div','at-time',itinerary);pageState.P.el('strong','',to,pageState.s.dest.iata);pageState.P.el('small','',to,pageState.s.dest.city);
      const traveler=pageState.P.el('div','at-assignment',body);pageState.P.el('div','at-sectionlabel',traveler,'Passenger & seat');pageState.P.el('strong','',traveler,pageState.s.passenger);pageState.P.line(traveler,'seat',`Seat ${m.seat} · Ticket ${pageState.s.reference}-01`,'at-services');
      const grid=pageState.P.el('div','at-servicegrid',p);
      const baggage=pageState.P.el('section','at-module',grid);const bh=pageState.P.el('h4','',baggage);pageState.P.svg(bh,'bag');pageState.P.el('span','',bh,'Baggage & extras');pageState.P.el('p','',baggage,'1 cabin bag (8 kg) · 1 checked bag (23 kg)');pageState.P.el('p','at-muted',baggage,'Standard seat assignment · Refreshments included');
      const policy=pageState.P.el('section','at-module',grid);const ph=pageState.P.el('h4','',policy);pageState.P.svg(ph,'shield');pageState.P.el('span','',ph,'Change conditions');pageState.P.el('p','',policy,`Booking changes: ${pageState.F.helpers.money(pageState.s.changeFee)}`);pageState.P.el('p','at-muted',policy,'Review the updated date or seat and applicable fees before confirming.');
      const receipt=pageState.P.el('section','at-module',p);pageState.P.line(receipt,'card','Payment and travel documents','at-services');pageState.P.el('p','at-muted',receipt,`Receipt ${pageState.s.reference} · Traveler ${pageState.s.passenger}`);pageState.P.plainButton(receipt,'View receipts and documents','chevron',()=>pageState.P.panel('Wallet & receipts'),'at-textbtn');
    };
  }

  function installFrame(BASE, pageState) {
    BASE.paint = () => {
      const current = pageState.ctx;
      pageState.painting = true; pageState.refs = new Map(); pageState.slider = null; pageState.tracked.length = 0; pageState.filterTracked.length = 0; pageState.pane = null; pageState.rail = null;
      for (const pop of pageState.app.querySelectorAll(':scope > .at-pop')) pop.remove();
      pageState.content.replaceChildren(); pageState.footer.replaceChildren();
      const m = pageState.ctx.model;
      pageState.P.progress(m);
      if(pageState.ctx.size.width>=pageState.D.workspaceWidth)pageState.P.worknav();
      const isResults = ['flights','hotels'].includes(pageState.s.scenario);
      if (m.page !== 'review' && m.page !== 'manage') {
        if (isResults) {
          pageState.rail = pageState.P.el('aside','at-rail',pageState.content);pageState.P.register({pane:'filters'},pageState.rail);pageState.P.resultFilters(pageState.rail,m);
          pageState.rail.scrollTop = m.filterScroll || 0;
          pageState.rail.addEventListener('scroll',()=>{if(pageState.ctx === current && !pageState.painting)pageState.P.visibility();});
        }
        else if (pageState.s.scenario === 'seat' || (pageState.s.scenario === 'change' && pageState.s.goal.changeKind === 'seat')) {
          pageState.P.passengerRail(m);
        }
      }
      pageState.P.main(m, isResults);
      if(!isResults && pageState.ctx.size.width>=pageState.D.summaryWidth)pageState.P.sidepanel(m);
      pageState.P.footer(m);
      if (pageState.pane) pageState.pane.scrollTop = m.scroll || 0;
      pageState.P.drawPanel(m);
      pageState.P.painted(pageState.ctx);
      pageState.painting = false; pageState.P.visibility();
    };

    BASE.details = (ctx) => {
      const decoration = ctx.rng.fork('travel-details'), bankOpts = {csplit:pageState.s.csplit};
      return {property:pageState.C.pick(decoration,pageState.F.helpers.HOTEL_NAMES,bankOpts),street:`${decoration.int(12,98)} ${pageState.C.pick(decoration,pageState.C.STREET_NAMES,bankOpts)}`,
        room:decoration.pick(['Superior double room','Classic king room','Deluxe queen room']),flight:pageState.s.flights[0],
        otherTrips:pageState.C.sample(decoration,pageState.C.CITIES.filter(x=>x.iata),3,bankOpts),member:decoration.int(2100,8700),
        card:pageState.C.digits(decoration,4),email:pageState.C.emailAddress(decoration,{first:pageState.s.passenger.split(' ')[0],last:pageState.s.passenger.split(' ').slice(1).join(' ')})};
    };

    BASE.frame = (ctx) => {
      pageState.app = pageState.P.app(ctx);
      pageState.P.topbar(pageState.app);
      pageState.P.route(pageState.app);
      pageState.progress=pageState.P.el('div','at-progress',pageState.app);
      pageState.content = pageState.P.el('div', 'at-content', pageState.app); pageState.footer = pageState.P.el('footer', 'at-footer', pageState.app);
    };

    BASE.app = (ctx) => {
      const app = pageState.P.el('section', `at-app${ctx.size.width < pageState.D.compactWidth ? ' compact' : ''}`, ctx.stage);
      app.setAttribute('aria-label', pageState.D.appLabel);
      return app;
    };

    BASE.topbar = (app) => {
      const top = pageState.P.el('header', 'at-top', app);
      const brand=pageState.P.el('div','at-brand',top);pageState.P.svg(brand,'plane');pageState.P.el('span','',brand,pageState.D.brand);
      const nav=pageState.P.el('nav','at-nav',top);nav.setAttribute('aria-label','Travel services');
      for(const [text,icon]of [['Flights','plane'],['Stays','hotel'],['My trips','bag']])pageState.P.plainButton(nav,text,icon,()=>pageState.P.panel(text),text===(['hotels','daterange'].includes(pageState.s.scenario)?'Stays':pageState.s.scenario==='change'?'My trips':'Flights')?'active':'');
      const account=pageState.P.el('div','at-account',top);
      const help=pageState.P.plainButton(account,'','help',()=>pageState.P.panel('Support'),'at-iconbtn');help.setAttribute('aria-label','Help and support');
      const bell=pageState.P.plainButton(account,'','bell',()=>pageState.P.panel('Notifications'),'at-iconbtn');bell.setAttribute('aria-label','Notifications, 2 unread');pageState.P.el('i','at-dot',bell);
      pageState.P.el('span','at-accountname at-muted',account,'USD');
      const profile=pageState.P.plainButton(account,'',null,()=>pageState.P.panel('Account'),'at-iconbtn');profile.setAttribute('aria-label','Your account');pageState.P.el('span','at-avatar',profile,pageState.s.passenger.split(' ').map(x=>x[0]).slice(0,2).join(''));
    };

    BASE.route = (app) => {
      const route = pageState.P.el('div', 'at-route', app), title = pageState.P.el('div', '', route);
      const crumbs=pageState.P.el('div','at-breadcrumb',title);pageState.P.el('span','',crumbs,'My trips');pageState.P.svg(crumbs,'chevron');pageState.P.el('span','',crumbs,['hotels','daterange'].includes(pageState.s.scenario)?pageState.s.dest.city:`${pageState.s.origin.iata} - ${pageState.s.dest.iata}`);
      pageState.P.el('h2', '', title, pageState.D.titles[pageState.s.scenario]);
      const brief=pageState.P.el('div','at-tripbrief',route);
      for(const [label,value]of [['Destination',pageState.s.dest.city],['Travelers','1 adult'],[pageState.s.scenario==='change'?'Booking':['hotels','daterange'].includes(pageState.s.scenario)?'Rooms':'Fare',pageState.s.scenario==='change'?pageState.s.reference:['hotels','daterange'].includes(pageState.s.scenario)?'1 room':'Economy Standard']]){const b=pageState.P.el('div','',brief);pageState.P.el('small','',b,label);pageState.P.el('strong','',b,value);}
    };
  }

  function installCalendarSeats(BASE, pageState) {
    BASE.month = (months, month, m) => {
      const box = pageState.P.el('div', '', months); pageState.P.el('div', 'at-month-title', box, pageState.C.formatDate(`${month}-01`, 'en-US', 'monthYear'));
      const grid = pageState.P.el('div', 'at-grid', box);
      for (const d of pageState.D.weekdays) pageState.P.el('span', '', grid, d);
      const [y, mo] = month.split('-').map(Number), offset = pageState.C.dayOfWeek(`${month}-01`);
      for (let i = 0; i < offset; i++) pageState.P.el('i', '', grid);
      for (let d = 1; d <= pageState.C.daysInMonth(y, mo); d++) {
        pageState.P.day(grid, month, d, m);
      }
    };

    BASE.day = (grid, month, d, m) => {
      const iso = `${month}-${String(d).padStart(2, '0')}`;
      const picked = pageState.s.scenario === 'change' ? iso === m.date : [m.start, m.end].includes(iso);
      const inrange = pageState.s.scenario === 'daterange' && m.start && m.end && iso > m.start && iso < m.end;
      const b = pageState.P.button(grid, String(d), {day: iso}, picked ? 'on' : inrange ? 'inrange' : '', true);
      b.disabled = iso < pageState.s.calendar.base || iso > pageState.s.calendar.last || pageState.s.calendar.blocked.includes(iso);
      b.setAttribute('aria-label', pageState.F.helpers.fmtDate(iso));
      pageState.P.dayBuilt(b, iso, m);
    };

    BASE.seatRow = (cabin, row, m) => {
      const r = pageState.P.el('div', `at-seat-row${pageState.s.seats.find(x => x.row === row).exit ? ' exit' : ''}`, cabin);
      for (const x of pageState.s.seats.filter(x => x.row === row)) {
        pageState.P.seat(r, x, row, m);
      }
    };

    BASE.seat = (r, x, row, m) => {
      if (x.col === 3) pageState.P.el('span', 'at-rownum', r, String(row));
      const b = pageState.P.button(r, x.id, {seat: x.id}, m.seat === x.id ? 'on' : pageState.s.goal.near === x.id ? 'companion' : '', true);
      b.disabled = x.occupied;
      b.title = `${x.id} · ${x.kind}${x.exit ? ' · Exit row' : ''} · ${x.occupied ? 'Occupied' : pageState.F.helpers.money(x.fare)}`;
      b.setAttribute('aria-label', b.title);
      pageState.P.el('small','',b,x.occupied?'Occupied':pageState.F.helpers.money(x.fare));
      if (pageState.s.goal.near === x.id) pageState.P.svg(b,'user');
      pageState.P.seatBuilt(b, x, m);
    };
  }

  function installResultCards(BASE, pageState) {
    BASE.resultCard = (p, x, m) => {
      const hotel=pageState.s.scenario==='hotels', card = pageState.P.el('article', `at-card${hotel?' at-hotelcard':''}${m.selected === x.id ? ' chosen' : ''}`, p);
      if(hotel)pageState.P.hotelArt(card,x.name,true);
      const info = pageState.P.el('div', 'at-card-main', card);
      if(!hotel) {
        pageState.P.flightInfo(info, x, m);
      }else {
        pageState.P.hotelInfo(info, x, m);
      }
      pageState.P.resultDetails(info, x, m, hotel);
      pageState.P.resultPrice(card, x, m, hotel);
      pageState.P.cardBuilt(card, x, m);
    };

    BASE.flightInfo = (info, x, m) => {
      const carrier=pageState.P.el('div','at-carrier',info);pageState.P.el('span','at-airline',carrier,x.no.slice(0,2));pageState.P.el('strong','',carrier,x.airline);pageState.P.el('span','at-muted',carrier,x.no);
      const times=pageState.P.el('div','at-itinerary',info);
      const dep=pageState.P.el('div','at-time',times);pageState.P.el('strong','',dep,pageState.F.helpers.time(x.dep));pageState.P.el('small','',dep,pageState.s.origin.iata);
      const dur=pageState.P.el('div','at-duration',times);pageState.P.el('span','',dur,`${Math.floor(x.duration/60)}h ${x.duration%60}m`);pageState.P.svg(pageState.P.el('div','at-flightline',dur),'plane');pageState.P.el('span','',dur,x.stops?'1 stop':'Nonstop');
      const arr=pageState.P.el('div','at-time',times);pageState.P.el('strong','',arr,`${pageState.F.helpers.time((x.dep+x.duration)%1440)}${x.dep+x.duration>=1440?' +1':''}`);pageState.P.el('small','',arr,pageState.s.dest.iata);
      pageState.P.el('div','at-card-meta',info,`${x.alliance} · Economy Standard`);
      const service=pageState.P.el('div','at-services',info);for(const [icon,text]of [['bag','Cabin bag included'],['shield','Changes permitted']]){const sp=pageState.P.el('span','',service);pageState.P.svg(sp,icon);pageState.P.el('span','',sp,text);}
    };

    BASE.hotelInfo = (info, x, m) => {
      pageState.P.el('h3','',info,x.name);const stars=pageState.P.el('div','at-stars',info);for(let i=0;i<3+pageState.U.hash32(x.name)%3;i++)pageState.P.svg(stars,'star');
      const location=pageState.P.el('div','at-location',info);pageState.P.svg(location,'pin');pageState.P.el('span','',location,`${x.area} · ${(pageState.U.hash32(x.id)%35/10+.3).toFixed(1)} km from centre`);
      const rating=pageState.P.el('div','at-rating',info);pageState.P.el('b','',rating,x.rating.toFixed(1));pageState.P.el('strong','',rating,x.rating>=9?'Wonderful':x.rating>=8?'Very good':'Good');pageState.P.el('span','at-muted',rating,`${x.reviews} reviews`);
      pageState.P.el('div','at-roomtype',info,pageState.details.room);pageState.P.el('div','at-positive',info,'Free cancellation · No prepayment');
      const tags=pageState.P.el('div','at-tags',info);for(const a of x.amenities)pageState.P.el('span','',tags,a);
    };

    BASE.resultDetails = (info, x, m, hotel) => {
      pageState.P.plainButton(info,hotel?'Room details':'Flight & fare details','down',()=>{pageState.ctx.patch({travelExpanded:m.travelExpanded===x.id?'':x.id});pageState.P.paint();},'at-textbtn');
      if(m.travelExpanded===x.id)pageState.P.el('div','at-details',info,hotel?`${pageState.details.room}. One large bed, private bathroom and daily housekeeping. ${x.amenities.join(', ')}. Nightly rates include taxes. Cancellation is permitted before check-in.`:`${x.no} operated by ${x.airline}. ${x.stops?'One connection; total journey time includes the layover.':'Direct service between the shown airports.'} Economy Standard: 1 cabin bag up to 8 kg. Change fees and any fare difference apply; no cash refund after departure.`);
    };

    BASE.resultPrice = (card, x, m, hotel) => {
      const price = pageState.P.el('div', 'at-card-price', card); pageState.P.el('strong', '', price, pageState.F.helpers.money(x.price));
      pageState.P.el('div', 'at-muted', price, hotel ? 'per night, 1 room' : 'total per adult');
      pageState.P.el('div','at-muted',price,'Taxes included');
      const select=pageState.P.button(price,m.selected===x.id?'Selected':'Select',{select:x.id},m.selected===x.id?'on':'at-primary',true);pageState.P.svg(select,m.selected===x.id?'check':'chevron');
    };

    BASE.filterChips = (main, m) => {
      const applied=pageState.P.el('div','at-filterline',main), f=m.filters;
      const chip=(text,action)=>{const b=pageState.P.plainButton(applied,text,null,action,'at-filterchip');pageState.P.svg(b,'close');};
      if(f.nonstop)chip('Nonstop',()=>pageState.P.act({filter:'nonstop',value:false}));
      if(f.alliance)chip(f.alliance,()=>pageState.P.act({filter:'alliance',value:''}));
      if(f.before<1440)chip(`Before ${pageState.F.helpers.time(f.before)}`,()=>pageState.P.act({filter:'before',value:1440}));
      if(f.min>0||f.max<pageState.s.maxPrice)chip(`${pageState.F.helpers.money(f.min)}–${pageState.F.helpers.money(f.max)}`,()=>{pageState.ctx.patch({filters:{...f,min:0,max:pageState.s.maxPrice},booked:false});pageState.P.paint();});
      if(f.rating)chip(`Rating ${f.rating.toFixed(1)}+`,()=>pageState.P.act({filter:'rating',value:0}));
      for(const a of f.amenities)chip(a,()=>pageState.P.act({filter:'amenities',value:a}));
      if(!applied.children.length)pageState.P.line(applied,'info',pageState.s.scenario==='hotels'?'1 room, 1 adult · Rates include taxes and fees':'One way · 1 adult · Economy · Total fares include taxes','at-muted');
    };

    BASE.resultToolbar = (main, m, rows) => {
      const tool = pageState.P.el('div', 'at-toolbar', main);
      pageState.P.el('strong', '', tool, `${rows.length} ${pageState.s.scenario === 'hotels' ? 'properties' : 'flights'} found`);
      pageState.P.dropdown(tool, 'Sort by', 'sort', [['recommended','Recommended'],['price','Lowest price'],pageState.s.scenario === 'hotels' ? ['rating','Guest rating'] : ['departure','Departure time']], m.sort);
    };

    BASE.emptyResults = (p, m) => {
      const empty=pageState.P.el('div','at-empty',p);pageState.P.svg(empty,'search');pageState.P.el('h3','',empty,'No matches for these preferences');
      pageState.P.el('p','',empty,`We found ${pageState.s.scenario==='hotels'?pageState.s.hotels.length:pageState.s.flights.length} options before filtering. A wider budget or fewer preferences may reveal more options.`);
      pageState.P.plainButton(empty,'Clear filters','close',() => pageState.P.resetFilters(),'at-primary');pageState.P.el('p','at-muted',empty,'Your trip details will stay the same.');
    };
  }

  function installPriceFilter(BASE, pageState) {
    BASE.priceFilter = (rail, m) => {
      pageState.P.el('div', 'at-muted', rail, 'Nightly price');
      const range = pageState.P.el('div', 'at-range-label', rail, `${pageState.F.helpers.money(m.filters.min)} – ${pageState.F.helpers.money(m.filters.max)}`);
      pageState.P.histogram(rail);
      const track = pageState.P.el('div', 'at-track', rail), thumbs = [pageState.P.el('div', 'at-thumb', track), pageState.P.el('div', 'at-thumb', track)];
      pageState.slider = env.ui.slider(track, {thumbs, min: 0, max: pageState.s.maxPrice, step: 10, values: [m.filters.min,m.filters.max],
        // Place thumbs in track-relative %, not px measured now: the rail gains its scrollbar only after the
        // filters below are appended, which narrows the track and would leave px-placed thumbs off their values.
        place: (t, p, f) => pageState.P.placeThumb(t, p, f),
        label: 'Nightly price range', onInput: values => {
          range.textContent = `${pageState.F.helpers.money(values[0])} – ${pageState.F.helpers.money(values[1])}`;
          pageState.ctx.patch({filters: {...pageState.ctx.model.filters,min: values[0],max: values[1]},booked: false,scroll: 0});
        }, onChange: () => pageState.P.paint()});
    };

    BASE.histogram = (rail) => {
      const hist=document.createElementNS(pageState.ns,'svg');hist.classList.add('at-histogram');hist.setAttribute('viewBox','0 0 180 25');hist.setAttribute('aria-label','Nightly price distribution');
      for(let i=0;i<18;i++){const n=pageState.s.hotels.filter(x=>Math.floor(x.price/pageState.s.maxPrice*18)===i).length;const r=document.createElementNS(pageState.ns,'rect');for(const[k,v]of Object.entries({x:i*10,y:24-Math.max(2,n*6),width:8,height:Math.max(2,n*6)}))r.setAttribute(k,String(v));hist.append(r);}rail.append(hist);
    };

    BASE.placeThumb = (t, p, f) => {
      return Object.assign(t.style, {left: `${f * 100}%`, top: '50%', transform: 'translate(-50%,-50%)'});
    };
  }

  function installWorkflow(BASE, pageState) {
    BASE.progress = (m) => {
      pageState.progress.replaceChildren();
      const steps=pageState.s.scenario==='change'?pageState.D.changeSteps:pageState.D.steps;
      for(let i=0;i<steps.length;i++){const st=pageState.P.el('span',i===(m.page==='review'?2:m.page==='manage'?0:1)?'current':'',pageState.progress);pageState.P.el('b','at-stepnum',st,String(i+1));pageState.P.el('span','',st,steps[i]);}
      pageState.P.el('span','at-muted',pageState.progress,m.booked?'Saved in My trips':'Prices include taxes and fees');
    };

    BASE.passengerRail = (m) => {
      const passenger = pageState.P.el('aside','at-rail seat-info',pageState.content);
      pageState.P.el('h3','',passenger,'Passengers');
      const assignment=pageState.P.el('div','at-assignment',passenger);pageState.P.line(assignment,'user','Adult 1','at-sectionlabel');pageState.P.el('strong','',assignment,pageState.s.passenger);
      pageState.P.el('div','at-muted',assignment,m.seat?`Seat ${m.seat}`:'No seat assigned');
      if (pageState.s.goal.near){pageState.P.el('h4','',passenger,'Travel companion');pageState.P.line(passenger,'user',`Assigned seat ${pageState.s.goal.near}`);pageState.P.el('p','at-muted',passenger,'Companion seats are already confirmed.');}
      pageState.P.el('h4','',passenger,'Cabin & seat guide');pageState.P.el('div','at-chip',passenger,'Economy Standard');
      pageState.P.el('p','at-muted',passenger,'A and F: window. C and D: aisle.');
      pageState.P.el('p','at-muted',passenger,'Exit rows are marked on the cabin map. Occupied seats are unavailable.');
      pageState.P.el('h4','',passenger,'Seat fees');pageState.P.el('p','at-muted',passenger,`From ${pageState.F.helpers.money(Math.min(...pageState.s.seats.map(x=>x.fare)))} per traveler. Fees are shown on available seats.`);
      pageState.P.plainButton(passenger,'Seat selection policy','info',()=>pageState.P.panel('Seat selection policy'),'at-textbtn');
    };

    BASE.main = (m, isResults) => {
      const main = pageState.P.el('div','at-main',pageState.content);
      if (m.page === 'review') pageState.P.review(main,m);
      else if (m.page === 'manage') pageState.P.manage(main,m);
      else if (pageState.s.scenario === 'daterange' || (pageState.s.scenario === 'change' && pageState.s.goal.changeKind === 'date')) pageState.P.calendar(main,m);
      else if (isResults) pageState.P.results(main,m);
      else pageState.P.seats(main,m);
    };

    BASE.footer = (m) => {
      const isResults = ['flights','hotels'].includes(pageState.s.scenario);
      const total = pageState.P.el('div','',pageState.footer), selectedSeat = pageState.s.seats.find(x=>x.id===m.seat);
      let summary = 'Choose an option to continue';
      if (pageState.s.scenario === 'seat') summary = `Seat: ${m.seat || 'Not selected'} · Seat fee: ${pageState.F.helpers.money(selectedSeat ? selectedSeat.fare : 0)}`;
      if (pageState.s.scenario === 'daterange') summary = `Nights: ${pageState.F.helpers.nights(m.start,m.end)} · Stay total: ${pageState.F.helpers.money(pageState.F.helpers.nights(m.start,m.end)*pageState.s.nightly)}`;
      if (pageState.s.scenario === 'change') summary = `Seat: ${m.seat} · Departure: ${pageState.F.helpers.fmtDate(m.date)} · Change fee: ${pageState.F.helpers.money(pageState.s.changeFee)}`;
      if (isResults) { const x = (pageState.s.scenario === 'hotels' ? pageState.s.hotels:pageState.s.flights).find(x=>x.id===m.selected);if(x) summary = `${pageState.s.scenario === 'hotels' ? 'Nightly rate' : 'Fare'}: ${pageState.F.helpers.money(x.price)}`; }
      pageState.P.el('strong','',total,summary);pageState.P.line(total,m.booked||m.page==='manage'?'check':'shield',`Status: ${m.booked ? 'Confirmed' : m.page==='manage'?'Existing booking confirmed':m.page === 'review' ? 'Ready for review' : 'Selection in progress'}`,'at-status');
      if (m.notice) pageState.P.el('div','at-notice',total,m.notice);
      const prepared = pageState.s.scenario === 'seat' ? !!m.seat : pageState.s.scenario === 'daterange' ? pageState.F.helpers.available(pageState.s,m.start,m.end)
        : isResults ? !!m.selected : pageState.s.goal.changeKind === 'seat' ? m.seat !== pageState.s.original.seat : m.date !== pageState.s.original.date;
      if (m.page === 'review') {
        pageState.P.button(pageState.footer,'Edit details',{control:'back'});
        if (!m.booked) pageState.P.svg(pageState.P.button(pageState.footer,pageState.D.bookLabel,{control:'book'},'at-primary'),'shield');
      } else if (m.page !== 'manage') {const review=pageState.P.button(pageState.footer,pageState.s.scenario==='change'?pageState.D.changeReviewLabel:pageState.D.reviewLabel,{control:'review'},'at-primary');pageState.P.svg(review,'chevron');review.disabled=!prepared;}
    };

    BASE.el = (tag, cls, parent, text) => {
      return pageState.ctx.util.el(tag, cls, parent, text);
    };

    BASE.locate = (t) => {
      if (t.thumb !== undefined) return pageState.slider.locateThumb(t.thumb);
      if (t.price !== undefined) return pageState.slider.locate(t.price,t.j);
      const node = pageState.refs.get(env.taskDef.helpers.key(t));
      if (!node) throw new Error(`Unknown travel target ${JSON.stringify(t)}`);
      const b = node.getBoundingClientRect();
      return [b.left+b.width/2,b.top+b.height/2];
    };
  }

  function installLifecycle(BASE, pageState) {
    BASE.style = (ctx) => {
      ctx.css('app-travel-classic', CSS(pageState.D));
    };

    BASE.render = (next) => {
      pageState.ctx = next;
      pageState.s = pageState.ctx.spec; pageState.U = pageState.ctx.util; pageState.F = env.taskDef; pageState.C = env.content;
      pageState.pane = null; pageState.rail = null; pageState.painting = false;
      pageState.tracked.length = 0; pageState.filterTracked.length = 0;
      pageState.P.begin(pageState.ctx);
      pageState.P.style(pageState.ctx);
      pageState.details = pageState.P.details(pageState.ctx);
      pageState.P.frame(pageState.ctx);
      pageState.P.paint();
      pageState.P.rendered(pageState.ctx);
      return {anchors: [pageState.app], sync: () => pageState.P.paint()};
    };

    BASE.begin = (ctx) => {
    };

    BASE.rendered = (ctx) => {
    };

    BASE.painted = (ctx) => {
    };

    BASE.cardBuilt = (card, x, m) => {
    };

    BASE.dayBuilt = (cell, iso, m) => {
    };

    BASE.seatBuilt = (seat, x, m) => {
    };
  }

  env.template('use-travel/portal', (design, def) => {
    // Each part reads live episode state, including after reset and in delayed scroll callbacks.
    const pageState = {ns: 'http://www.w3.org/2000/svg', tracked: [], filterTracked: []};
    const BASE = {};
    const S = {
      get ctx() { return pageState.ctx; },
      get spec() { return pageState.s; },
      get model() { return pageState.ctx.model; },
      get details() { return pageState.details; },
      get app() { return pageState.app; },
      set app(value) { pageState.app = value; },
      get progress() { return pageState.progress; },
      set progress(value) { pageState.progress = value; },
      get content() { return pageState.content; },
      set content(value) { pageState.content = value; },
      get footer() { return pageState.footer; },
      set footer(value) { pageState.footer = value; },
      get pane() { return pageState.pane; },
      set pane(value) { pageState.pane = value; },
      get rail() { return pageState.rail; },
      set rail(value) { pageState.rail = value; },
      get slider() { return pageState.slider; },
      set slider(value) { pageState.slider = value; },
      get refs() { return pageState.refs; },
      get D() { return pageState.D; },
      get P() { return pageState.P; },
      tracked: pageState.tracked, filterTracked: pageState.filterTracked,
    };

    installControls(BASE, pageState);
    installPanels(BASE, pageState);
    installPaneControls(BASE, pageState);
    installViews(BASE, pageState);
    installFrame(BASE, pageState);
    installCalendarSeats(BASE, pageState);
    installResultCards(BASE, pageState);
    installPriceFilter(BASE, pageState);
    installWorkflow(BASE, pageState);
    installLifecycle(BASE, pageState);

    ({ D: pageState.D, P: pageState.P } = env.templateDesign('use-travel/portal', design, def, {tokens: TOKENS, base: BASE, state: S}));
    return {render: (ctx) => pageState.P.render(ctx), locate: (t) => pageState.P.locate(t)};
  });
})();
