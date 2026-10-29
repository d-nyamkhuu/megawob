/*
 * pan-map/city: shared slippy map and survey editor.
 * Scenarios: marker, center, zoom, pin, route, zone, zoomto. No scenario presets.
 * With design: {}, each scenario reproduces its pilot:
 *   center: design-pan-map-center-02; marker: design-pan-map-marker-01;
 *   pin: design-pan-map-pin-01; route: design-pan-map-route-01; zone: design-pan-map-zone-01;
 *   zoom: design-pan-map-zoom-01; zoomto: design-pan-map-zoomto-01.
 * Tokens (object/array tokens replace the whole value):
 *   font = '12px/1.4 system-ui,sans-serif': workspace font shorthand.
 *   panelWidth = 242: directory and drawer width in px.
 *   narrowPanelWidth = 190: narrow directory and drawer width in px.
 *   mapColors = { land: '#ece6d8', water: '#9fcbe8', park: '#bfdcae', street: '#ffffff', road: '#f7d58a', casing: '#c9a75a', transitRoad: '#e9a3a3', transitCasing: '#b55d5d', parkName: '#2f7a35', open: '#16824a', productLand: '#b7c5a4', productWater: '#66a9c9', productPark: '#76a55c', productRoad: '#e1cb91', editorLand: '#a4b594', editorRoad: '#e9d197', editorCasing: '#9a927b', droppedPin: '#c74439' }: base, transit, product and editor map palette.
 *   css = the _assets literal: base map structural CSS, exactly the reference .mp-* rules.
 *   productCss = the _assets literal: workspace structural CSS, exactly the reference product rules.
 *   editorCss = the _assets literal: editor structural CSS, exactly the reference .mpe-* rules.
 *   icons = the _assets literal: SVG path table, exactly the reference map/search/navigation/place icons.
 *   tierColors = { 1: '#d9480f', 2: '#1971c2', 3: '#6741d9' }: place colors by tier.
 *   venueColor = '#c2255c': venue marker color.
 *   editorPinColor = '#587d71': survey marker color.
 *   brand = 'Wayline': workspace brand text.
 *   maxWidth = 1260: maximum workspace width in px.
 *   maxHeight = 780: maximum workspace height in px.
 *   widthInset = 20: workspace horizontal inset in px.
 *   heightInset = 16: workspace vertical inset in px.
 *   narrowWidth = 760: compact-sidebar breakpoint in px.
 *   minMapWidth = 260: minimum explorer viewport width in px.
 *   maxMapWidth = 1000: maximum explorer viewport width in px.
 *   minMapHeight = 180: minimum explorer viewport height in px.
 *   mapHeaderHeight = 33: height reserved for the explorer heading in px.
 *   explorerSearch = 'Search this map': explorer search placeholder and accessible name.
 *   editorSearch = 'Search places or addresses': editor search placeholder and accessible name.
 *   categories = { all: 'All places', food: 'Food', landmarks: 'Landmarks' }: labels for fixed category keys.
 *   editorTitles = { pin: 'Saved location', route: 'Route planner', zone: 'Delivery zones', zoomto: 'Explore the map' }: sidebar titles by editor scenario.
 *   editorHints = { pin: 'Personal collection / Synced to this device', route: 'Operations itinerary / Local road survey', zone: 'Courier coverage / Operations team', zoomto: 'Survey view / North up / Local coordinates' }: sidebar hints by editor scenario.
 *   editLabels = { pin: 'Drop pin', route: 'Edit route', zone: 'Draw zone', zoomto: 'Explore' }: edit tool labels by editor scenario.
 *   attributions = ['Map data: city survey', 'Tiles: open street data', 'Cartography: local GIS office']: seeded attribution choices; retain length/order.
 *   infoActions = ['Save', 'Share', 'Nearby']: seeded secondary place actions; retain length/order.
 *   roadWidths = [0, 2, 3, 4, 6, 8, 10]: explorer road stroke widths by zoom.
 *   streetWidths = [0, 0, 1, 1.5, 2.5, 4, 6]: explorer minor street stroke widths by zoom.
 * Parts (overrides are (base, S) => replacement; all calls go through P):
 *   cssText(text) -> CSS: apply palette, font and sidebar width tokens to structural styles.
 *   building(ctx,parent,attrs) -> rect: one footprint; caller draws all random dimensions first.
 *   handle(ctx,port,index) -> element: numbered draggable route waypoint with dataset and accessible name.
 *   fit(ctx) -> {width,height}: cap the workspace at 1260x780, inset 20x16px.
 *   frame(ctx,width,height) -> root: flex workspace; narrow class below 760px.
 *   shellHeader(ctx,root,editor) -> {top,bar}: brand and project/status bar.
 *   shellPanels(ctx,root) -> {work,rail,panel,foot,status,position,drawer,title,dc,db}: navigation rail, directory, footer and hidden drawer.
 *   drawerContent(ctx,root,body,kind,person): layer toggles, saved maps, activity or sharing content.
 *   navigation(ctx,rail,position,open,drawer): workspace buttons and local drawer events.
 *   topActions(ctx,top,person,open): saved/share controls and seeded person avatar.
 *   explorerSearch(ctx,frame) -> input: search box in the explorer top bar.
 *   explorerHeading(ctx,panel) -> section: title and place count.
 *   explorerRow(ctx,list,place) -> {row,button}: place icon, name, address and rating.
 *   directoryEnd(ctx,list,count): empty-search message or end-of-results note.
 *   filter(ctx,parent,label,active) -> button: category chip; caller binds filtering.
 *   explorerFrame(ctx,frame) -> {card,head,port,W,H}: map heading, style toggle and viewport.
 *   explorerFit(ctx,card) -> {W,H}: viewport clamped to 260..1000px wide and at least 180px high.
 *   ambiguity(ctx,port): show matching addresses for an ambiguous request.
 *   explorerWorld(ctx,port,W,H) -> {world,wd,streets,casings,roads,minorNames}: water, parks, roads and seeded buildings; keeps both rng forks.
 *   reticle(ctx,port,W,H) -> element|null: center-scenario ring and crosshair.
 *   corners(ctx) -> {zc,ic,sc}: seeded zoom/info/scale corners; retain conditional rng draw.
 *   explorerControls(ctx,port,corners) -> {zoomBox,zin,ticks,zout,level,scaleTxt,scaleBar,info,infoName,infoSub,infoRating,infoAddress,infoHours,close}: zoom ticks, scale, seeded attribution and place info card.
 *   label(ctx,layer,class,text,x,y,rotation,scale) -> element: positioned map label.
 *   explorerPin(ctx,layer,place,scale,shape) -> {pin,dot}: colored icon marker and name.
 *   editorStyle(ctx): install editor structural CSS.
 *   editorSearch(ctx,top) -> {search,results}: address search and hidden suggestions popup.
 *   editorHeading(ctx,panel) -> section: per-scenario title and hint tokens.
 *   editorSettings(ctx,panel,onMode,repaint) -> {controls,settings,inspectorStatus}: travel mode chips, collection toggles and service properties.
 *   editorDirectory(ctx,panel,commit) -> {list,stopLabels}: place/stop list and route place directory.
 *   editorRow(ctx,list,place,badge) -> {row,button,name,address}: numbered place or waypoint row.
 *   editorFrame(ctx,work) -> {map,port,W,H}: editor map fills remaining workspace.
 *   editorWorld(ctx,port,W,H) -> {world,labels,pins,roadLabels}: parks, survey buildings, roads, labels and numbered pins; retains survey rng.
 *   editorPin(ctx,labels,place,index) -> pin: numbered survey marker with place name.
 *   editorOverlay(ctx,port,W,H) -> {path,vertices,handles,pin}: route/zone path, vertices, draggable handles, dropped pin and zoomto crosshair.
 *   editorTools(ctx,port,commit) -> {tools,edit,pan,clear,close}: edit/pan plus zone clear/close; bind tool actions.
 *   editorZoom(ctx,port) -> {zin,level,zout}: zoom button stack and level output.
 *   editorReadout(ctx,port,frame) -> {readout,saved}: property readout and compass legend.
 *   readoutLines(ctx,readout,lines): rebuild label/value rows from pure task statistics.
 *   suggestion(ctx,results,place) -> button: search result with address; caller binds selection.
 *   explorerPaint(ctx,elements,model): sync transforms, selection, zoom, reticle, scale and place details.
 *   editorPaint(ctx,elements,model): sync map, geometry, handles, sidebar stats, readouts and search results.
 *   vertex(ctx,group,portPoint,index) -> circle: zone vertex, larger for the closing target.
 *   rowDecorated(ctx,row,place): noop after a directory row is drawn.
 *   mapDecorated(ctx,port,editor): noop after map controls, before initial sync.
 *   rendered(ctx,view): noop after initial render and model sync, before anchors return.
 *   style(): install the base map CSS once per page.
 *   icon(parent,name,size=17) -> svg: render a path from the icon token table.
 *   iconButton(parent,name,title,text) -> button: labeled SVG button.
 *   kindIcon(place) -> name: food/station/building icon by place kind.
 *   placeMeta(ctx,place) -> metadata: deterministic rating, reviews, address and hours.
 *   productStyle(ctx): install workspace structural CSS.
 *   shell(ctx,editor) -> frame: assemble shell and seeded person; local drawer state only.
 *   renderExplorer(ctx) -> view: marker/center/zoom model updates, gestures, sync and oracle targets.
 *   renderEditor(ctx) -> view: pin/route/zone/zoomto model updates, gestures, sync and oracle targets.
 *   locate(target) -> [x,y]: delegate to the active view; throw if the target is missing.
 * S.ctx/spec/model/view read the live page; S.els exposes each view's elements;
 * S.D/P expose resolved tokens and parts. State belongs to the factory, never the module.
 * Implementation: _assets holds tokens; _chrome, _explorer-parts, _editor-parts and _paint install parts.
 * _explorer-view assembles explorer labels and gestures; public part names remain on city.
 * Keep every rng draw in order, including conditional corner draws and building skips.
 * Additional decoration randomness must use ctx.rng.fork(label).
 */
(function () {
  'use strict';

  env.template('pan-map/city', (design, def) => {
    const { TOKENS } = env.templateLib('pan-map/_assets');
    let D, P, ctxRef, view;
    const BASE = {};
    const S = {
      get ctx() { return ctxRef; },
      get spec() { return ctxRef && ctxRef.spec; },
      get model() { return ctxRef && ctxRef.model; },
      get view() { return view; },
      set view(v) { view = v; },
      get D() { return D; },
      get P() { return P; },
      els: {},
    };

    env.templateLib('pan-map/_chrome').install(BASE, S);
    BASE.renderExplorer = (ctx) => env.templateLib('pan-map/_explorer-view').renderExplorer(S, ctx);
    env.templateLib('pan-map/_explorer-parts').install(BASE, S);
    env.templateLib('pan-map/_editor-parts').install(BASE, S);
    env.templateLib('pan-map/_paint').install(BASE, S);
    BASE.locate = (t) => {
      const p = view && view.locate(t);
      if (!p) throw new Error(`pan-map/city cannot locate ${JSON.stringify(t)} (variant ${ctxRef && ctxRef.spec.scenario})`);
      return p;
    };

    ({ D, P } = env.templateDesign('pan-map/city', design, def, { tokens: TOKENS, base: BASE, state: S }));
    return {
      traits: { zoom: 'both' },
      render(ctx) {
        P.style();
        ctxRef = ctx;
        for (const key of Object.keys(S.els)) delete S.els[key];
        view = ['pin', 'route', 'zone', 'zoomto'].includes(ctx.spec.scenario) ? P.renderEditor(ctx) : P.renderExplorer(ctx);
        P.rendered(ctx, view);
        return { anchors: view.anchors, sync: view.sync };
      },
      locate(t) { return P.locate(t); },
    };
  }, { uses: ['pan-map/_assets', 'pan-map/_chrome', 'pan-map/_explorer-view', 'pan-map/_explorer-parts',
    'pan-map/_editor-parts', 'pan-map/_paint'] });
})();
