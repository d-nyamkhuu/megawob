/*
 * read-figure/scene: the L1 scene widgets (medoid design-read-figure-identify-01): a content root around a scene that holds
 * the widget's scenario's widget, an Undo bar, an optional reset control and menu labels. The scenario picks the widget and
 * the parts below. design {} reproduces design-read-figure-<scenario>-01 for addition, ascending, color, count, greatest,
 * grid, identify and shape, and design-read-figure-number-checkboxes-03. No renderer RNG draws. The L2 panel widgets
 * (shades) share little of this and have their own template, read-figure/shades.
 * Tokens (base defaults; the scenario preset below is applied before the design):
 *   resetLabel (null): optional reset text; resetParent ('.bottom'): its frame selector.
 *   recoveryParent (null): recovery selector, null uses root; menuLabels (null): menu replacement array;
 *   optionalMenu (false): tolerate a missing menu.
 *   inputSynced (true): include textField in paints (addition, count).
 *   fontFamily ('Arial'), textScale (1): glyph text; shapeStroke (null), shapeStrokeWidth (2): shape outlines
 *     (count, identify, shape).
 *   boardColumns (null), boardRows (null): reflow by max columns or requested rows; sceneBoard (false): scene budget;
 *     smallScale (.4), largeScale (.75): cell fractions; itemColors ({}): color overrides (count, shape).
 *   addition: cubeFaces (null): top/front/side colors, null means plain span; cubeStroke ('#873e09'): outline;
 *     additionInputParent ('root'): root or scene.
 *   pick-color: sampleLabel ('Sample Color'): sample caption; swatchSizing (false): responsive CSS sizes.
 *   count: answerCaption (null): optional count-options wrapper; typedLabel ('Your answer:'): input label.
 *   grid: gridArrows (false): arrowheads and axis names; arrowColor ('#143756'); arrowEnds ('positive'|'all');
 *     tickSize (0): half tick length; gridAspect (null): optional preserveAspectRatio attribute.
 *   identify: optionIcons (true): include answer glyphs; figureScale (.7): fraction of frame.
 *   number-checkboxes: answerTitle ('Your turn'), titleClass (''): heading text/class; pixelMax (34), pixelGap (5),
 *     pixelInset (55): sizing.
 * VARIANTS: addition sets cubeFaces; count and shape set boardColumns 5, sceneBoard, largeScale .85, and count adds
 *   answerCaption, shape menuLabels; greatest, grid and number-checkboxes set resetLabel; grid sets gridArrows and
 *   number-checkboxes answerTitle. ascending and identify have none.
 * Parts:
 *   set(patch): update and sync; sync(model): run paints and synced(model) (noop hook).
 *   answer(key): record a single choice; button(parent,text,key,fn,cls='control'): create and index a button.
 *   begin(ctx), rendered(ctx): noop hooks before widget / after frame controls, before first sync.
 *   recoveryParent(ctx)->element: selector or root; recovery(ctx): Undo bar; recovered(ctx,bar): noop hook.
 *   resetModel(first)->model: clone the initial model; reset(ctx): optional reset control; menu(ctx): menu labels.
 *   widget(ctx): draw the scenario's widget.
 * Parts of some scenarios (only those scenarios define them; a design naming another scenario's part throws):
 *   count, identify, shape: poly(n,cx,cy,r,rot=0,inner=0)->points; figure(u,parent,item,cx,cy,size,color): SVG glyph.
 *   count, shape: boardLayout(items,cols,rows)->{items,cols,rows}; boardSize(ctx)->{W,H};
 *     itemGeometry(item,index,geo)->{cx,cy,sz,x,y,width,height}; itemColor(item)->color;
 *     board(items,cols,rows,clickable): create SVG cells; item(ctx,group,item,index): noop hook after each glyph.
 *   count, identify: options(parent,keys): answer buttons; optionParent(parent)->element: unchanged;
 *     optionIcon(button,key): identify's answer glyph (when optionIcons), else noop; optionsReady(ctx,row): noop hook.
 *   addition, count: input(parent,prop,label='Your answer:')->input: textField binding;
 *     inputReady(ctx,element,prop): noop hook.
 *   addition: cube(ctx,group,groupIndex,index): one block. The page's submit button moves into the scene.
 *   ascending: numberGeometry(ctx,board,button,cell,index): position/size one number tile.
 *   pick-color: swatchSize(ctx): set sample/swatch CSS sizes; colorReady(ctx,sample,choices): noop after swatches.
 *   count: countOptions(ctx): wrapped or bare number options.
 *   grid: gridSize(ctx)->{W,H}; gridGeometry(ctx)->{W,H,pad,X,Y}: mappings; gridFrame(ctx,geo)->svg;
 *     gridLine(ctx,svg,geo,value,axis): axis/grid line extents;
 *     gridTick(ctx,svg,geo,value,axis), gridLabel(ctx,svg,geo,value,axis): tick / number;
 *     gridArrows(ctx,svg,geo): arrow path and axis names; gridDecorated(ctx,svg,geo): calls gridArrows;
 *     gridRadius(ctx,geo)->number: click-circle radius.
 *   identify: fClamp(value)->scale: cap at 1.1; identifySize(ctx)->{W,H}: frame budget;
 *     identifyFrame(ctx,W,H)->svg: bordered SVG; identified(ctx,svg,W,H): noop after figure before options.
 *   number-checkboxes: pixelTitles(ctx)->[example,answer]; pixelParent(ctx,row,index)->parent;
 *     pixelSize(ctx)->CSS size; pixelGrid(ctx,wrap,grid,index): noop before cells;
 *     pixelReady(ctx,wrap,grid,index): noop after cells.
 *   shape: shape(ctx): SVG board; replace for a different presentation (ledger).
 * S exposes live ctx, spec, root, scene, refs, paints, field, D and P. All mutable state belongs to the factory.
 */
(function () {
  'use strict';
  const TOKENS = {
    resetLabel: null,
    resetParent: '.bottom',
    recoveryParent: null,
    menuLabels: null,
    optionalMenu: false,
    inputSynced: true,
    fontFamily: 'Arial',
    textScale: 1,
    shapeStroke: null,
    shapeStrokeWidth: 2,
    boardColumns: null,
    boardRows: null,
    sceneBoard: false,
    smallScale: 0.4,
    largeScale: 0.75,
    itemColors: {},
    cubeFaces: null,
    cubeStroke: '#873e09',
    additionInputParent: 'root',
    sampleLabel: 'Sample Color',
    swatchSizing: false,
    answerCaption: null,
    typedLabel: 'Your answer:',
    gridArrows: false,
    arrowColor: '#143756',
    arrowEnds: 'positive',
    tickSize: 0,
    gridAspect: null,
    optionIcons: true,
    figureScale: 0.7,
    answerTitle: 'Your turn',
    titleClass: '',
    pixelMax: 34,
    pixelGap: 5,
    pixelInset: 55,
  };
  const BOARD = { boardColumns: 5, sceneBoard: true, largeScale: 0.85 };
  const SCENARIOS = {
    addition: { cubeFaces: ['#ff9a35', '#fa8421', '#b55813'] },
    color: { swatchSizing: true },
    count: { ...BOARD, answerCaption: 'Your answer:' },
    greatest: { resetLabel: 'Clear Selection' },
    grid: { resetLabel: 'Clear', gridArrows: true },
    'number-checkboxes': { answerTitle: 'Your Answer', resetLabel: 'Clear' },
    shape: { ...BOARD, menuLabels: ['Play', 'Instructions', 'Settings', 'Help'] },
  };
  env.template('read-figure/scene', (design, def) => {
    let D, P, ctx, s, u, f, root, scene, refs, paints, field;
    const BASE = {};
    const V = (def.scenarios || [])[0];
    const S = {
      get ctx() { return ctx; }, get spec() { return s; }, get root() { return root; }, get scene() { return scene; },
      get refs() { return refs; }, get paints() { return paints; }, get field() { return field; },
      get D() { return D; }, get P() { return P; },
    };
    const scope = {
      get D() { return D; },
      get P() { return P; },
      get ctx() { return ctx; },
      get s() { return s; },
      get u() { return u; },
      get f() { return f; },
      get root() { return root; },
      get scene() { return scene; },
      get refs() { return refs; },
      get paints() { return paints; },
      get field() { return field; }, set field(value) { field = value; }
    };
    env.templateLib('read-figure/_scene-controls').install(BASE, scope, V);
    env.templateLib('read-figure/_scene-boards').install(BASE, scope, V);
    env.templateLib('read-figure/_scene-answers').install(BASE, scope, V);
    env.templateLib('read-figure/_scene-widgets').install(BASE, scope, V);
    if (!BASE.widget) throw new Error(`read-figure/scene: no widget for variant '${V}'`);

    ({ D, P } = env.templateDesign('read-figure/scene', design, def, {
      tokens: TOKENS,
      scenarios: SCENARIOS,
      base: BASE,
      state: S,
    }));
    return {
      render(nextCtx) {
        ctx = nextCtx;
        s = ctx.spec;
        u = ctx.util;
        f = env.taskDef;
        root = u.el('div', 'content ' + s.scenario + '-content', ctx.stage);
        scene = u.el('div', 'scene', root);
        refs = new Map();
        paints = [];
        field = null;
        P.begin(ctx);
        P.widget(ctx);
        P.recovery(ctx);
        if (V === 'addition' && env.submitEl) {
          scene.append(env.submitEl);
          env.submitEl.classList.add('in-scene');
        }
        P.reset(ctx);
        P.menu(ctx);
        P.rendered(ctx);
        P.sync(ctx.model);
        return { anchors: [root], sync: (m) => P.sync(m) };
      },
      locate(t) {
        if (t.field && field) return field.locate();
        const e = refs.get(JSON.stringify(t));
        if (!e) throw new Error('Missing target ' + JSON.stringify(t));
        return env.util.center(e);
      },
    };
  }, { uses: ['read-figure/_scene-controls', 'read-figure/_scene-boards', 'read-figure/_scene-answers', 'read-figure/_scene-widgets'] });
})();
