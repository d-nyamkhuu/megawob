// Relayboard design on use-workflow-editor/editor; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-workflow-editor',
  site: 'design-use-workflow-editor-configure-04',
  name: 'design',
  split: 'train',
  scenarios: ['configure'],
  template: 'use-workflow-editor/editor',
  design: {
      frameInset: 0,
      frameRadius: 0,
      fontFamily: 'Georgia,"Times New Roman",serif',
      paletteWidth: 266,
      tightPaletteWidth: 205,
      paletteTitle: 'Steps',
      searchPlaceholder: 'Search steps...',
      categoryLabel: 'Core',
      paletteHint: '',
      canvasHint: '',
      initialZoom: 1,
      gridSize: 17,
      panelWidth: 310,
    parts: {
      frame: (base, S) => (ctx) => {
        const app = base(ctx);
        const paletteWidth = ctx.size.width < S.D.tightWidth ? 205 : 266;
        const right = Math.max(...ctx.model.nodes.map(n => n.x + 148));
        const bottom = Math.max(...ctx.model.nodes.map(n => n.y + 76));
        S.zoom = Math.min(1, (ctx.size.width - paletteWidth - 38) / right, (ctx.size.height - 71) / bottom);
        const desiredGap = Math.max(0, Math.min(165, (ctx.size.height - 310) * .65));
        app.style.setProperty('--canvas-gap', Math.min(desiredGap, Math.max(0, ctx.size.height - 71 - bottom * S.zoom)) + 'px');
        return app;
      },
      top: () => () => {},
      toolbar: (base, S) => (ctx) => {
        base(ctx);
        const { P, els } = S;
        const bar = els.bar;
        const buttons = [...bar.children];
        const zoomOut = buttons[1], zoomIn = buttons[3], fit = buttons[4];
        for (const [button, plus] of [[zoomOut, false], [zoomIn, true]]) {
          button.replaceChildren();
          const icon = ctx.util.svg('svg', { viewBox: '0 0 24 24', class: 'af-icon', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.6 }, button);
          ctx.util.svg('circle', { cx: 10, cy: 10, r: 6.8 }, icon);
          ctx.util.svg('path', { d: 'm15 15 6 6M6.5 10h7' + (plus ? 'M10 6.5v7' : '') }, icon);
        }
        const group = P.el('div', 'rb-history', null);
        els.undo.replaceChildren();
        P.icon(els.undo, 'undo');
        els.undo.title = 'Undo';
        els.undo.setAttribute('aria-label', 'Undo');
        group.append(els.undo);
        const redo = P.iconButton(group, 'Redo', 'undo', () => {});
        redo.classList.add('rb-redo'); redo.disabled = true;
        const zoomBox = P.el('div', 'rb-zoom', null);
        zoomBox.append(els.zoomLabel);
        P.el('span', '', zoomBox, '⌄');
        els.del.classList.add('rb-delete');
        bar.replaceChildren(group, zoomBox, zoomOut, zoomIn, fit, els.del);
        els.body.prepend(bar);
      },
      paletteFrame: (base, S) => (ctx) => {
        const { P, els, D } = S;
        els.palette = P.el('aside', 'af-palette', els.body);
        P.el('h3', '', els.palette, D.paletteTitle);
        const searchBox = P.el('div', 'rb-step-search', els.palette);
        const searchIcon = ctx.util.svg('svg', { viewBox: '0 0 24 24', class: 'rb-step-search-icon', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.7 }, searchBox);
        ctx.util.svg('circle', { cx: 10, cy: 10, r: 6.6 }, searchIcon);
        ctx.util.svg('path', { d: 'm15 15 5 5' }, searchIcon);
        els.search = P.el('input', 'af-search', searchBox);
        els.search.placeholder = D.searchPlaceholder;
        els.search.setAttribute('aria-label', 'Find a step');
        els.list = P.el('div', 'af-list', els.palette);
        P.el('div', 'af-category', els.list, D.categoryLabel);
      },
      component: (base, S) => (ctx, list, type, i) => {
        const tile = base(ctx, list, type, i);
        tile.dataset.tone = i;
        S.P.el('span', 'rb-grip', tile, '⠿');
        return tile;
      },
      node: (base, S) => (ctx, layer, n) => {
        const card = base(ctx, layer, n);
        card.dataset.tone = Math.max(0, env.taskDef.helpers.TYPES.indexOf(n.type));
        return card;
      },
      references: (base, S) => (ctx) => {
        base(ctx);
        S.els.references.remove();
      },
      edges: (base, S) => (m) => {
        base(m);
        // These paths belong to the decorative read-only branch, not the workflow.
        for (const path of [...S.els.wires.children]) {
          if (path.tagName.toLowerCase() === 'path') path.remove();
        }
      },
      executions: (base, S) => (ctx) => {
        base(ctx);
        S.els.executions.remove();
      },
      overview: (base, S) => (ctx) => {
        base(ctx);
        S.els.overviewTitle.closest('.af-overview').remove();
      },
      footer: (base, S) => (ctx) => {
        base(ctx);
        S.els.nodeCount.parentElement.remove();
      },
    },
  },
});
