/* sort-into-bins/_base-board: reference renderer scope, with every original design unit hook. */
(function () {
  'use strict';
  env.template('sort-into-bins/_base-board', () => ({
    register(env, scriptOf, __parts, __has, setScope) {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get CSS() { return CSS; },
        get SHAPE_SVG() { return SHAPE_SVG; },
        get FOLDER_SVG() { return FOLDER_SVG; },
        get TRASH_SVG() { return TRASH_SVG; },
        get KIND_COLOR() { return KIND_COLOR; },
        get FILE_SVG() { return FILE_SVG; },
        get els() { return els; },
        get INK() { return INK; },
        get shapeSvg() { return shapeSvg; },
        get itemTitle() { return itemTitle; },
        get toPx() { return toPx; },
        get toModel() { return toModel; },
        get rectPx() { return rectPx; },
        get boardPt() { return boardPt; },
        get thumbTop() { return thumbTop; },
        get board() { return board; }, set board(v) { board = v; },
        get geo() { return geo; }, set geo(v) { geo = v; },
        get spec() { return spec; }, set spec(v) { spec = v; },
        get ctxRef() { return ctxRef; }, set ctxRef(v) { ctxRef = v; },
        get paneEl() { return paneEl; }, set paneEl(v) { paneEl = v; },
        get outerEl() { return outerEl; }, set outerEl(v) { outerEl = v; },
        get thumbEl() { return thumbEl; }, set thumbEl(v) { thumbEl = v; },
        get paneGeo() { return paneGeo; }, set paneGeo(v) { paneGeo = v; },
        get ensureStyle() { return ensureStyle; },
        get renderBoxes() { return renderBoxes; },
        get attachNative() { return attachNative; },
        get renderDesk() { return renderDesk; },
        get renderPalette() { return renderPalette; },
        get mirrorView() { return mirrorView; },
        get renderPane() { return renderPane; },
        get render() { return render; },
        get locate() { return locate; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+0.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      setScope(__scope);
      if (__has('ensureStyle@0')) ensureStyle = __parts['ensureStyle@0'](ensureStyle, __scope);
      if (__has('renderBoxes')) renderBoxes = __parts['renderBoxes'](renderBoxes, __scope);
      if (__has('attachNative')) attachNative = __parts['attachNative'](attachNative, __scope);
      if (__has('renderDesk')) renderDesk = __parts['renderDesk'](renderDesk, __scope);
      if (__has('renderPalette')) renderPalette = __parts['renderPalette'](renderPalette, __scope);
      if (__has('mirrorView')) mirrorView = __parts['mirrorView'](mirrorView, __scope);
      if (__has('renderPane')) renderPane = __parts['renderPane'](renderPane, __scope);
      if (__has('render@0')) render = __parts['render@0'](render, __scope);
      if (__has('locate')) locate = __parts['locate'](locate, __scope);

      const CSS = __has('CSS@0') ? __parts['CSS@0'](undefined, __scope) : (env.templateLib('sort-into-bins/_styles').board);

      const SHAPE_SVG = __has('SHAPE_SVG@0') ? __parts['SHAPE_SVG@0'](undefined, __scope) : (env.templateLib('sort-into-bins/_assets').shapes());
      const FOLDER_SVG = __has('FOLDER_SVG') ? __parts['FOLDER_SVG'](undefined, __scope) : env.templateLib('sort-into-bins/_assets').folderSvg;
      const TRASH_SVG = __has('TRASH_SVG') ? __parts['TRASH_SVG'](undefined, __scope) : (env.templateLib('sort-into-bins/_assets').trashSvg);
      const KIND_COLOR = __has('KIND_COLOR') ? __parts['KIND_COLOR'](undefined, __scope) : (env.templateLib('sort-into-bins/_assets').colors());
      const FILE_SVG = __has('FILE_SVG') ? __parts['FILE_SVG'](undefined, __scope) : env.templateLib('sort-into-bins/_assets').fileSvg(KIND_COLOR);

      let board = __has('board') ? __parts['board'](undefined, __scope) : undefined;
      let geo = __has('geo') ? __parts['geo'](undefined, __scope) : undefined;
      let spec = __has('spec@0') ? __parts['spec@0'](undefined, __scope) : undefined;
      let ctxRef = __has('ctxRef@0') ? __parts['ctxRef@0'](undefined, __scope) : undefined;
      const els = __has('els') ? __parts['els'](undefined, __scope) : ({});

      function ensureStyle() { return env.templateLib('sort-into-bins/_base-board-parts').ensureStyle(__scope); }

      // traits.palette items: color 'black' (not in content.COLORS) and fill 'outline' (stroke only, no fill).
      const INK = __has('INK@0') ? __parts['INK@0'](undefined, __scope) : ('#17181c');
      const shapeSvg = __has('shapeSvg@0') ? __parts['shapeSvg@0'](undefined, __scope) : { shapeSvg: (content, it) => (it.fill === 'outline'
        ? `<svg viewBox="0 0 100 100" fill="none" stroke-width="6.5"><g stroke="rgba(255,255,255,.4)" stroke-width="11">${SHAPE_SVG[it.shape]}</g><g stroke="${content.COLORS[it.color] || INK}">${SHAPE_SVG[it.shape]}</g></svg>`
        : `<svg viewBox="0 0 100 100" fill="${content.COLORS[it.color] || INK}" stroke="${content.COLORS[it.color] ? 'rgba(0,0,0,.38)' : 'rgba(255,255,255,.4)'}" stroke-width="3">${SHAPE_SVG[it.shape]}</svg>`) }.shapeSvg;
      const itemTitle = __has('itemTitle@0') ? __parts['itemTitle@0'](undefined, __scope) : { itemTitle: (it) => `${it.fill === 'outline' ? 'outline ' : ''}${it.color} ${it.shape}` }.itemTitle;
      // Item top-left in board px <-> item center in normalized board units (the model).
      const toPx = __has('toPx') ? __parts['toPx'](undefined, __scope) : { toPx: (p) => [(p[0] - spec.item.w / 2) * geo.W, (p[1] - spec.item.h / 2) * geo.H] }.toPx;
      const toModel = __has('toModel') ? __parts['toModel'](undefined, __scope) : { toModel: (q) => [q[0] / geo.W + spec.item.w / 2, q[1] / geo.H + spec.item.h / 2] }.toModel;
      const rectPx = __has('rectPx') ? __parts['rectPx'](undefined, __scope) : { rectPx: (r) => ({ left: r.x * geo.W + 'px', top: r.y * geo.H + 'px', width: r.w * geo.W + 'px', height: r.h * geo.H + 'px' }) }.rectPx;
      const boardPt = __has('boardPt') ? __parts['boardPt'](undefined, __scope) : { boardPt: (e) => {
        const r = board.getBoundingClientRect();
        return [(e.clientX - r.left) / geo.W, (e.clientY - r.top) / geo.H];
      } }.boardPt;

      // ======================================================================= boxes (single, collect, sort)

      function renderBoxes(ctx, mode) { return env.templateLib('sort-into-bins/_base-board-parts').renderBoxes(__scope, ctx, mode); }

      // Native HTML5 drag-and-drop for the boxes: the board is the drop target, the release point and the grab
      // offset give the item's new position; the box under the dragged item's center lights up.
      function attachNative(ctx, items, boxes, finish) { return env.templateLib('sort-into-bins/_base-board-parts').attachNative(__scope, ctx, items, boxes, finish); }

      // ======================================================================= desk

      function renderDesk(ctx) { return env.templateLib('sort-into-bins/_base-board-parts').renderDesk(__scope, ctx); }

      // ======================================================================= palette

      function renderPalette(ctx) { return env.templateLib('sort-into-bins/_base-board-parts').renderPalette(__scope, ctx); }

      let paneEl = __has('paneEl') ? __parts['paneEl'](undefined, __scope) : undefined;
      let outerEl = __has('outerEl') ? __parts['outerEl'](undefined, __scope) : undefined;
      let thumbEl = __has('thumbEl') ? __parts['thumbEl'](undefined, __scope) : undefined;
      let paneGeo = __has('paneGeo') ? __parts['paneGeo'](undefined, __scope) : undefined;

      // Scrolling pane facts (scroll window in normalized board y) mirrored into the model for the plan.
      function mirrorView(ctx) { return env.templateLib('sort-into-bins/_base-board-parts').mirrorView(__scope, ctx); }
      const thumbTop = __has('thumbTop') ? __parts['thumbTop'](undefined, __scope) : { thumbTop: (scroll) => (paneGeo.max > 0 ? (scroll / paneGeo.max) * (paneGeo.viewH - paneGeo.thumbH) : 0) }.thumbTop;

      function renderPane(ctx) { return env.templateLib('sort-into-bins/_base-board-parts').renderPane(__scope, ctx); }

      function render(ctx, mode) { return env.templateLib('sort-into-bins/_base-board-parts').render(__scope, ctx, mode); }

      function locate(t) { return env.templateLib('sort-into-bins/_base-board-parts').locate(__scope, t); }

      env.widget({
        task: 'sort-into-bins', site: 'base', name: 'boxes', split: 'train',
        scenarios: ['single', 'collect', 'sort', 'desk', 'palette'],
        traits: { snap: true },
        render: (ctx) => render(ctx, {}),
        locate,
      });

      env.widget({
        task: 'sort-into-bins', site: 'base', name: 'scroll', split: 'train',
        scenarios: ['single', 'collect', 'sort'],
        traits: { snap: true, tall: true, noPile: true },
        render: (ctx) => render(ctx, { pane: true }),
        locate,
      });

      env.widget({
        task: 'sort-into-bins', site: 'base', name: 'native', split: 'train',
        scenarios: ['single', 'collect', 'sort'],
        traits: { snap: true },
        render: (ctx) => render(ctx, { native: true }),
        locate,
      });

    },
  }), { uses: ['sort-into-bins/_assets', 'sort-into-bins/_styles', 'sort-into-bins/_base-board-parts'] });
})();
