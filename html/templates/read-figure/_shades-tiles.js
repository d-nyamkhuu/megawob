/* read-figure/_shades-tiles: shared template implementation; design parts stay on the calling template. */
(function () {
  'use strict';
  function install(BASE, scope, V) {
    BASE.begin = (ctx) => {};
    BASE.columns = (ctx, n) => (scope.D.columns === null ? ctx.spec.cols : Math.min(scope.D.columns, n));
    BASE.layout = (ctx, B) => {
      const { spec, rng } = ctx,
        n = spec.tiles.length,
        cols = scope.P.columns(ctx, n),
        rows = Math.ceil(n / cols),
        gap = rng.int(8, 14),
        hintH = spec.select === 'modifier' ? 30 : 0;
      const T = Math.floor(
        Math.min(rng.int(54, 78), (B.w - gap * (cols - 1)) / cols, (B.h - hintH - gap * (rows - 1)) / rows),
      );
      return { n, cols, rows, gap, hintH, T };
    };
    BASE.grid = (ctx, body, { n, cols, T, gap }) => {
      const grid = ctx.util.el('div', 'up-tiles', body);
      if (scope.D.columnVar) grid.style.setProperty(scope.D.columnVar, Math.ceil(n / scope.D.columnDivisor));
      grid.style.gridTemplateColumns = `repeat(${cols}, ${T}px)`;
      grid.style.gap = `${gap}px`;
      return grid;
    };
    BASE.tileStyle = (ctx, t, { T }) => `width:${T}px;height:${T}px;background:hsl(${t.h}, ${t.s}%, ${t.l}%)`;
    BASE.tile = (ctx, el, i) => {};
    BASE.tilesReady = (ctx, tiles) => {};
    BASE.selection = (ctx, tiles, up) => {
      scope.P.tilesReady(ctx, tiles);
      return (m) => scope.P.tilesSync(ctx, tiles, m);
    };
    BASE.tilesSync = (ctx, tiles, m) =>
      tiles.forEach((d, i) => d.setAttribute('aria-checked', String(m.selected.includes(i))));
    BASE.shades = (ctx, body, up, B) => {
      const { spec, util, rng } = ctx;
      scope.P.begin(ctx);
      const geo = scope.P.layout(ctx, B),
        grid = scope.P.grid(ctx, body, geo);
      scope.tiles = spec.tiles.map((t, i) => {
        const d = util.el('div', 'up-tile', grid);
        d.style.cssText = scope.P.tileStyle(ctx, t, geo);
        d.dataset.role = 'tile';
        d.setAttribute('role', 'checkbox');
        scope.P.tile(ctx, d, i);
        util.el('span', 'ck', d).innerHTML = scope.CHECK;
        d.addEventListener('click', (e) => {
          const sel = ctx.model.selected,
            mod = e.ctrlKey || e.metaKey || e.shiftKey;
          let next;
          if (spec.select === 'modifier' && !mod) next = [i];
          else next = sel.includes(i) ? sel.filter((x) => x !== i) : sel.concat([i]).sort((a, b) => a - b);
          ctx.log('select', { what: 'tile', value: i, mod });
          up({ selected: next });
        });
        return d;
      });
      if (spec.select === 'modifier')
        util.el(
          'div',
          'up-hint',
          body,
          rng.pick([
            'Click a tile to select it. Ctrl+click to select more than one.',
            'Hold Ctrl (or Shift) while clicking to add tiles to the selection.',
          ]),
        );
      const sync = scope.P.selection(ctx, scope.tiles, up);
      return {
        sync,
        locate: (t) => (t.tile !== undefined ? env.util.center(scope.tiles[t.tile]) : scope.fail(t)),
      };
    };
    BASE.budget = (ctx, recover) => ({
      w: Math.floor(ctx.size.width - scope.D.budgetWidth),
      h: Math.floor(ctx.size.height - scope.D.budgetHeight - (recover ? scope.D.recoverHeight : 0)),
    });
    BASE.beforeFit = (ctx, panel, body) => {};
  }
  env.template('read-figure/_shades-tiles', () => ({ install }));
})();
