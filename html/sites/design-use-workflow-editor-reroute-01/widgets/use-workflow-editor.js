// Design on use-workflow-editor/editor; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-workflow-editor',
  site: 'design-use-workflow-editor-reroute-01',
  name: 'design',
  split: 'train',
  scenarios: ['reroute'],
  template: 'use-workflow-editor/editor',
  design: {
      frameInset: 0,
      frameRadius: 0,
      paletteWidth: 191,
      tightPaletteWidth: 170,
      paletteTitle: 'Steps',
      paletteHint: '',
      canvasHint: '',
      initialZoom: .73,
      gridSize: 19,
      icons: ['bolt', 'diamond', 'gear', 'gear', 'database', 'clock'],
    parts: {
      top: () => () => {},
      frame: (base, S) => (ctx) => {
        const app = base(ctx);
        const paletteWidth = ctx.size.width < S.D.tightWidth ? S.D.tightPaletteWidth : S.D.paletteWidth;
        S.zoom = Math.max(.6, Math.min(S.D.initialZoom, (ctx.size.width - paletteWidth - 40) / 1290));
        return app;
      },
      toolbar: (base, S) => (ctx) => {
        base(ctx);
        const controls = document.querySelector('.relay-controls');
        controls.replaceChildren();
        const bar = S.els.bar;
        for (const child of [...bar.children]) {
          if (child === S.els.zoomLabel || ['Zoom out', 'Zoom in', 'Reset view'].includes(child.title)) controls.appendChild(child);
        }
        const map = S.P.iconButton(controls, 'Canvas overview', 'map', () => S.P.showPopover('Workflow overview', ['Steps: ' + ctx.model.nodes.length, 'Connections: ' + ctx.model.edges.length]));
        map.classList.add('relay-map-button');
        const actions = S.P.el('div', 'relay-selection-actions', S.els.app);
        actions.append(S.els.undo, S.els.del);
        bar.remove();
      },
      paletteFrame: (base, S) => (ctx) => {
        const P = S.P;
        S.els.palette = P.el('aside', 'af-palette', S.els.body);
        P.el('h3', '', S.els.palette, S.D.paletteTitle);
        S.els.search = P.el('input', 'af-search', S.els.palette);
        S.els.search.hidden = true;
        S.els.search.setAttribute('aria-label', 'Find a step');
        S.els.list = P.el('div', 'af-list', S.els.palette);
      },
      component: (base, S) => (ctx, list, type, i) => {
        const tile = base(ctx, list, type, i);
        tile.dataset.type = type;
        tile.style.setProperty('--type-color', ['#1aa577', '#ff850b', '#1484ff', '#1484ff', '#7550e8', '#4c637f'][i]);
        return tile;
      },
      node: (base, S) => (ctx, layer, n) => {
        const card = base(ctx, layer, n);
        const types = ['Webhook', 'Filter', 'Transform', 'Send message', 'Create record', 'Delay'];
        const i = types.indexOf(n.type);
        card.style.setProperty('--type-color', ['#1aa577', '#ff850b', '#1484ff', '#1484ff', '#7550e8', '#4c637f'][i] || '#1484ff');
        card.querySelector('.af-nodefoot svg').remove();
        return card;
      },
      icon: (base, S) => (parent, name) => {
        const paths = {
          bolt: 'M14 1 3 14h7l-1 9L21 9h-8z',
          diamond: 'M12 1 23 12 12 23 1 12Z',
          gear: 'm10 1-1 3-3 1-3-1-2 4 2 2v4l-2 2 2 4 3-1 3 1 1 3h4l1-3 3-1 3 1 2-4-2-2v-4l2-2-2-4-3 1-3-1-1-3z M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
          database: 'M3 5a9 4 0 0 1 18 0 9 4 0 0 1-18 0 M3 8c4 4 14 4 18 0v5c-4 4-14 4-18 0z M3 16c4 4 14 4 18 0v4c-4 4-14 4-18 0z',
          map: 'm3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2z M9 3v16m6-14v16',
          fit: 'M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5 M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0',
        };
        if (!paths[name]) return base(parent, name);
        const svg = ctxSvg(S, parent, name, paths[name]);
        return svg;
      },
      references: (base, S) => (ctx) => {
        base(ctx);
        S.els.references.hidden = true;
      },
      edges: (base, S) => (model) => {
        base(model);
        for (const path of S.els.wires.querySelectorAll(':scope > path')) path.remove();
      },
      executions: (base, S) => (ctx) => { base(ctx); S.els.executions.hidden = true; },
      overview: (base, S) => (ctx) => { base(ctx); S.els.overviewProperties.closest('.af-overview').hidden = true; },
      footer: (base, S) => (ctx) => { base(ctx); S.els.nodeCount.parentElement.hidden = true; },
      painted: (base, S) => (ctx, model) => {
        base(ctx, model);
        S.els.zoomLabel.textContent = Math.round(S.zoom / S.D.initialZoom * 100) + '%';
        S.els.app.querySelector('.relay-selection-actions').hidden = !model.selected && !model.history.length;
      },
    },
  },
});

function ctxSvg(S, parent, name, path) {
  const filled = name !== 'map' && name !== 'fit';
  const svg = S.ctx.util.svg('svg', { class: 'af-icon', viewBox: '0 0 24 24', fill: filled ? 'currentColor' : 'none', stroke: filled ? 'none' : 'currentColor', 'stroke-width': 1.7, 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, parent);
  S.ctx.util.svg('path', { d: path, 'fill-rule': 'evenodd' }, svg);
  return svg;
}
