/* sort-into-bins/_base-libraries: reference renderer scope, with every original design unit hook. */
(function () {
  'use strict';
  env.template('sort-into-bins/_base-libraries', () => ({
    register(env, scriptOf, __parts, __has, setScope) {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get CSS() { return CSS; },
        get SHAPE_SVG() { return SHAPE_SVG; },
        get INK() { return INK; },
        get shapeSvg() { return shapeSvg; },
        get itemTitle() { return itemTitle; },
        get round3() { return round3; },
        get ia() { return ia; }, set ia(v) { ia = v; },
        get gl() { return gl; }, set gl(v) { gl = v; },
        get renderInteract() { return renderInteract; },
        get renderDragula() { return renderDragula; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+2.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      setScope(__scope);
      if (__has('renderInteract')) renderInteract = __parts['renderInteract'](renderInteract, __scope);
      if (__has('renderDragula')) renderDragula = __parts['renderDragula'](renderDragula, __scope);

      const CSS = __has('CSS@2') ? __parts['CSS@2'](undefined, __scope) : (env.templateLib('sort-into-bins/_styles').libraries);

      const SHAPE_SVG = __has('SHAPE_SVG@2') ? __parts['SHAPE_SVG@2'](undefined, __scope) : (env.templateLib('sort-into-bins/_assets').shapes({ circle: '<circle cx="50" cy="50" r="45"/>', square: '<rect x="6" y="6" width="88" height="88" rx="4"/>' }));
      // traits.palette items: color 'black' (not in content.COLORS) and fill 'outline' (stroke only, no fill).
      const INK = __has('INK@2') ? __parts['INK@2'](undefined, __scope) : ('#17181c');
      const shapeSvg = __has('shapeSvg@2') ? __parts['shapeSvg@2'](undefined, __scope) : { shapeSvg: (content, it) => (it.fill === 'outline'
        ? `<svg viewBox="0 0 100 100" fill="none" stroke-width="6.5"><g stroke="rgba(255,255,255,.4)" stroke-width="11">${SHAPE_SVG[it.shape]}</g><g stroke="${content.COLORS[it.color] || INK}">${SHAPE_SVG[it.shape]}</g></svg>`
        : `<svg viewBox="0 0 100 100" fill="${content.COLORS[it.color] || INK}" stroke="${content.COLORS[it.color] ? 'rgba(0,0,0,.38)' : 'rgba(255,255,255,.4)'}" stroke-width="3">${SHAPE_SVG[it.shape]}</svg>`) }.shapeSvg;
      const itemTitle = __has('itemTitle@2') ? __parts['itemTitle@2'](undefined, __scope) : { itemTitle: (it) => `${it.fill === 'outline' ? 'outline ' : ''}${it.color} ${it.shape}` }.itemTitle;
      const round3 = __has('round3') ? __parts['round3'](undefined, __scope) : { round3: (p) => p.map((v) => Math.round(v * 1000) / 1000) }.round3;

      // ======================================================================= interact

      let ia = __has('ia') ? __parts['ia'](undefined, __scope) : (null);

      function renderInteract(ctx) { return env.templateLib('sort-into-bins/_base-libraries-parts').renderInteract(__scope, ctx); }

      env.widget({
        task: 'sort-into-bins', site: 'base', name: 'interact', split: 'train',
        scenarios: ['single', 'collect', 'sort'],
        traits: { snap: true },
        uses: [['../vendor/interactjs-1.10.27/interact.min', 'vendor']],
        render: renderInteract,
        locate(t) {
          const r = ia.board.getBoundingClientRect();
          if (t.point !== undefined) return [r.left + t.point[0] * ia.geo.W, r.top + t.point[1] * ia.geo.H];
          if (t.item !== undefined) return ia.ctx.util.center(ia.items[t.item]);
          throw new Error(`sort-into-bins/interact cannot locate ${JSON.stringify(t)}`);
        },
      });

      // ======================================================================= dragula lanes

      let gl = __has('gl') ? __parts['gl'](undefined, __scope) : (null);

      function renderDragula(ctx) { return env.templateLib('sort-into-bins/_base-libraries-parts').renderDragula(__scope, ctx); }

      env.widget({
        task: 'sort-into-bins', site: 'base', name: 'dragula', split: 'train',
        scenarios: ['single', 'collect', 'sort'],
        traits: { noPile: true },
        uses: [['../vendor/dragula-3.7.3/dragula.min', 'vendor']],
        render: renderDragula,
        locate(t) {
          const center = (el) => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
          if (t.item !== undefined) return center(gl.cards[t.item]);
          if (t.point !== undefined) {
            const w = env.taskDef.helpers.where(gl.ctx.spec, t.point);
            const id = w === 'out' || w === 'partial' ? 'out' : w;
            const l = gl.lanes.find((x) => x.id === id);
            const r = l.body.getBoundingClientRect();
            return [r.left + r.width / 2, r.bottom - Math.min(30, r.height / 4)];
          }
          throw new Error(`sort-into-bins/dragula cannot locate ${JSON.stringify(t)}`);
        },
      });

    },
  }), { uses: ['sort-into-bins/_assets', 'sort-into-bins/_styles', 'sort-into-bins/_base-libraries-parts'] });
})();
