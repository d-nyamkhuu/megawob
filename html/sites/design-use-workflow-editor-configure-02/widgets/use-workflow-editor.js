// Relayboard design on use-workflow-editor/editor; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-workflow-editor',
  site: 'design-use-workflow-editor-configure-02',
  name: 'design',
  split: 'train',
  scenarios: ['configure'],
  template: 'use-workflow-editor/editor',
  design: {
      frameInset: 0,
      paletteWidth: 240,
      tightPaletteWidth: 190,
      fontFamily: '"Trebuchet MS", Arial, sans-serif',
      paths: {
        file:'M5 2h9l5 5v15H5zM14 2v6h5M8 12h8M8 16h8',
        bolt:'M5 2h9l5 5v15H5zM14 2v6h5M8 12h8M8 16h8',
        filter:'M2 3h20l-8 10v8l-4 1V13z',
        code:'M3 4h18v16H3zM3 4l9 9 9-9M3 20l7-9m4 0 7 9',
        send:'M3 4h18v16H3zM3 4l9 9 9-9M3 20l7-9m4 0 7 9',
        record:'M4 5c0-5 16-5 16 0s-16 5-16 0v14c0 5 16 5 16 0V5M4 10c0 5 16 5 16 0M4 15c0 5 16 5 16 0',
        clock:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20m0 4v7l4 2',
        plus:'M12 3v18M3 12h18',
        undo:'m8 3-6 6 6 6M3 9h9a8 8 0 0 1 0 15',
        grid:'M3 3h3v3H3zm8 0h3v3h-3zm8 0h3v3h-3zM3 11h3v3H3zm8 0h3v3h-3zm8 0h3v3h-3zM3 19h3v3H3zm8 0h3v3h-3zm8 0h3v3h-3z',
        fit:'M4 3v18M9 4h12v5H9zM9 13h8v6H9z',
        search:'M16 16l6 6M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0',
        webhook:'M8 5a4 4 0 1 1 7 3l4 7M7 7l-4 9m3 3h11M5 14a4 4 0 1 0 4 5m7-4a4 4 0 1 1-1 4',
        condition:'M10 2h4v4h-4zM3 17h4v4H3zM17 17h4v4h-4zM12 6v6M5 17v-5h14v5',
        split:'M10 18h4v4h-4zM4 2h4v4H4zM17 2h4v4h-4zM6 6v3l6 5 7-5V6M12 14v4',
        globe:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20M2 12h20M4 6h16M4 18h16M12 2c-6 6-6 14 0 20M12 2c6 6 6 14 0 20',
        people:'M9 9a4 4 0 1 0 0-8 4 4 0 0 0 0 8M18 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6M2 22v-6a7 7 0 0 1 14 0v6zM17 13a6 6 0 0 1 6 6v3h-5',
        close:'m5 5 14 14M19 5 5 19',
        trash:'M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15',
      },
    parts: {
      canvas: (base, S) => (ctx) => {
        base(ctx);
        const graphWidth = Math.max(...ctx.model.nodes.map(n => n.x + 168));
        S.zoom = Math.min(.85, (S.els.canvas.getBoundingClientRect().width - 20) / graphWidth);
      },
      top: (base, S) => (ctx) => {
        const top = S.P.el('div', 'af-top', S.els.app);
        S.P.el('strong', 'rb-workflow-title', top, S.spec.title);
      },
      toolbar: (base, S) => (ctx) => {
        base(ctx);
        const bar = S.els.bar;
        for (const child of [...bar.children]) child.hidden = true;
        const control = (label, glyph, fn) => {
          const b = S.P.button(bar, label + '  ▾', fn, 'rb-editor-control');
          b.dataset.tool = label;
          const svg = S.P.icon(b, glyph); b.prepend(svg); return b;
        };
        control('Add Step', 'plus', () => {
          S.els.palette.classList.toggle('rb-search-open');
          if (S.els.palette.classList.contains('rb-search-open')) S.els.search.focus();
        });
        control('Zoom', 'search', () => S.P.setZoom(S.zoom >= 1 ? .75 : S.zoom + .1));
        control('Align', 'fit', () => S.P.showPopover('Align steps', ['Drag a step to adjust its position on the canvas.']));
        control('Arrange', 'grid', () => S.P.showPopover('Arrange steps', ['The workflow keeps its existing connections and step positions.']));
        const spacer = S.P.el('span', 'rb-toolbar-space', bar);
        S.els.undo.hidden = false; bar.appendChild(S.els.undo);
        const redo = S.P.button(bar, 'Redo', () => {}, 'rb-redo');
        S.P.icon(redo, 'undo'); redo.disabled = true;
      },
      paletteFrame: (base, S) => (ctx) => {
        const P = S.P, E = S.els;
        E.palette = P.el('aside', 'af-palette rb-native-palette', E.app);
        P.el('h3', 'rb-palette-title', E.palette, 'Step Palette');
        E.search = P.el('input', 'af-search', E.palette);
        E.search.placeholder = 'Find a step...'; E.search.setAttribute('aria-label', 'Find a step');
        E.list = P.el('div', 'af-list', E.palette);
        S.paletteGroups = {};
        for (const title of ['Triggers','Actions','Logic']) {
          const group = P.el('div', 'rb-component-group ' + title.toLowerCase(), E.list);
          P.el('strong', 'rb-group-title', group, title);
          S.paletteGroups[title] = group;
        }
        const row = (group, label, glyph) => {
          const tile = P.el('div', 'rb-palette-row', S.paletteGroups[group]);
          P.icon(tile, glyph); P.el('span', '', tile, label);
        };
        row('Triggers','New form submission','file');
        row('Triggers','Schedule','clock');
        row('Triggers','New record','record');
        row('Triggers','Email received','send');
        row('Actions','Record activity','record');
        row('Actions','Update record','file');
        row('Actions','Call web service','globe');
        row('Actions','Generate document','file');
        row('Logic','Condition','condition');
        row('Logic','Split path','split');
      },
      component: (base, S) => (ctx, list, type, i) => {
        const group = S.paletteGroups[['Triggers','Logic','Logic','Actions','Actions','Logic'][i]];
        const tile = base(ctx, group, type, i);
        if (i === 0) group.insertBefore(tile, group.children[3]);
        if (i === 3) group.insertBefore(tile, group.children[1]);
        if (i === 4) group.insertBefore(tile, group.children[3]);
        if (i === 0 || i === 4) tile.querySelector('svg path').setAttribute('d', S.D.paths[i === 0 ? 'webhook' : 'people']);
        return tile;
      },
      references: (base, S) => (ctx) => {
        base(ctx);
        S.els.references.hidden = true;
      },
      edges: (base, S) => (model) => {
        base(model);
        for (const path of S.els.wires.querySelectorAll(':scope > path[stroke-dasharray]')) path.remove();
      },
      node: (base, S) => (ctx, layer, n) => {
        const card = base(ctx, layer, n);
        card.dataset.type = n.type;
        return card;
      },
    },
  },
});
