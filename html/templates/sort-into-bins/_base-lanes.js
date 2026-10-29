/* sort-into-bins/_base-lanes: reference renderer scope, with every original design unit hook. */
(function () {
  'use strict';
  env.template('sort-into-bins/_base-lanes', () => ({
    register(env, scriptOf, __parts, __has, setScope) {
      'use strict';
      const __scope = {
        get env() { return env; },
        get scriptOf() { return scriptOf; },
        get SHAPE_SVG() { return SHAPE_SVG; },
        get CSS() { return CSS; },
        get INK() { return INK; },
        get shapeSvg() { return shapeSvg; },
        get itemTitle() { return itemTitle; },
        get cap() { return cap; },
        get laneOf() { return laneOf; },
        get spec() { return spec; }, set spec(v) { spec = v; },
        get ctxRef() { return ctxRef; }, set ctxRef(v) { ctxRef = v; },
        get lanes() { return lanes; }, set lanes(v) { lanes = v; },
        get cards() { return cards; }, set cards(v) { cards = v; },
        get root() { return root; }, set root(v) { root = v; },
        get ensureStyle() { return ensureStyle; },
        get layout() { return layout; },
        get laneAt() { return laneAt; },
        get drop() { return drop; },
        get render() { return render; },
      };
      for (const k of Object.keys(__parts)) if (k.startsWith('+1.')) {
        let v; let built = false;
        Object.defineProperty(__scope, k.slice(3), {
          get: () => (built ? v : (built = true, v = __parts[k](undefined, __scope))),
          set: (x) => { built = true; v = x; },
        });
      }
      setScope(__scope);
      if (__has('ensureStyle@1')) ensureStyle = __parts['ensureStyle@1'](ensureStyle, __scope);
      if (__has('layout')) layout = __parts['layout'](layout, __scope);
      if (__has('laneAt')) laneAt = __parts['laneAt'](laneAt, __scope);
      if (__has('drop')) drop = __parts['drop'](drop, __scope);
      if (__has('render@1')) render = __parts['render@1'](render, __scope);

      const SHAPE_SVG = __has('SHAPE_SVG@1') ? __parts['SHAPE_SVG@1'](undefined, __scope) : (env.templateLib('sort-into-bins/_assets').shapes({ circle: '<circle cx="50" cy="50" r="45"/>', square: '<rect x="6" y="6" width="88" height="88" rx="4"/>' }));

      const CSS = __has('CSS@1') ? __parts['CSS@1'](undefined, __scope) : (env.templateLib('sort-into-bins/_styles').lanes);

      // traits.palette items: color 'black' (not in content.COLORS) and fill 'outline' (stroke only, no fill).
      const INK = __has('INK@1') ? __parts['INK@1'](undefined, __scope) : ('#17181c');
      const shapeSvg = __has('shapeSvg@1') ? __parts['shapeSvg@1'](undefined, __scope) : { shapeSvg: (content, it) => (it.fill === 'outline'
        ? `<svg viewBox="0 0 100 100" fill="none" stroke-width="6.5"><g stroke="rgba(255,255,255,.4)" stroke-width="11">${SHAPE_SVG[it.shape]}</g><g stroke="${content.COLORS[it.color] || INK}">${SHAPE_SVG[it.shape]}</g></svg>`
        : `<svg viewBox="0 0 100 100" fill="${content.COLORS[it.color] || INK}" stroke="${content.COLORS[it.color] ? 'rgba(0,0,0,.38)' : 'rgba(255,255,255,.4)'}" stroke-width="3">${SHAPE_SVG[it.shape]}</svg>`) }.shapeSvg;
      const itemTitle = __has('itemTitle@1') ? __parts['itemTitle@1'](undefined, __scope) : { itemTitle: (it) => `${it.fill === 'outline' ? 'outline ' : ''}${it.color} ${it.shape}` }.itemTitle;
      const cap = __has('cap') ? __parts['cap'](undefined, __scope) : { cap: (s) => s[0].toUpperCase() + s.slice(1) }.cap;

      let spec = __has('spec@1') ? __parts['spec@1'](undefined, __scope) : undefined;
      let ctxRef = __has('ctxRef@1') ? __parts['ctxRef@1'](undefined, __scope) : undefined;
      let lanes = __has('lanes') ? __parts['lanes'](undefined, __scope) : undefined;
      let cards = __has('cards') ? __parts['cards'](undefined, __scope) : undefined;
      let root = __has('root') ? __parts['root'](undefined, __scope) : undefined;

      function ensureStyle() { return env.templateLib('sort-into-bins/_base-lanes-parts').ensureStyle(__scope); }

      const laneOf = __has('laneOf') ? __parts['laneOf'](undefined, __scope) : { laneOf: (model, id) => {
        const w = env.taskDef.helpers.where(spec, model.pos[id]);
        return w === 'out' || w === 'partial' ? 'out' : w;
      } }.laneOf;

      // Put every card in the lane its position says, in slot order (the extra lane: item order).
      function layout(ctx) { return env.templateLib('sort-into-bins/_base-lanes-parts').layout(__scope, ctx); }

      function laneAt(x, y) { return env.templateLib('sort-into-bins/_base-lanes-parts').laneAt(__scope, x, y); }

      function drop(ctx, id, lane) { return env.templateLib('sort-into-bins/_base-lanes-parts').drop(__scope, ctx, id, lane); }

      function render(ctx) { return env.templateLib('sort-into-bins/_base-lanes-parts').render(__scope, ctx); }

      env.widget({
        task: 'sort-into-bins', site: 'base', name: 'lanes', split: 'train',
        scenarios: ['single', 'collect', 'sort'],
        traits: { noPile: true },
        render,

        locate(t) {
          const center = (el) => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };
          if (t.item !== undefined) return center(cards[t.item]);
          if (t.point !== undefined) {
            const w = env.taskDef.helpers.where(spec, t.point);
            const id = w === 'out' || w === 'partial' ? 'out' : w;
            const l = lanes.find((x) => x.id === id);
            const r = l.body.getBoundingClientRect();
            return [r.left + r.width / 2, r.bottom - Math.min(30, r.height / 4)];
          }
          throw new Error(`sort-into-bins/lanes cannot locate ${JSON.stringify(t)}`);
        },
      });

    },
  }), { uses: ['sort-into-bins/_assets', 'sort-into-bins/_styles', 'sort-into-bins/_base-lanes-parts'] });
})();
