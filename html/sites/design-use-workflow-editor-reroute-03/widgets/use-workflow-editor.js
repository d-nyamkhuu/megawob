// Design on use-workflow-editor/editor; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-workflow-editor',
  site: 'design-use-workflow-editor-reroute-03',
  name: 'design',
  split: 'train',
  scenarios: ['reroute'],
  template: 'use-workflow-editor/editor',
  design: {
      frameInset: 0, frameRadius: 0, paletteWidth: 212, tightPaletteWidth: 166,
      fontFamily: '"Courier New",monospace', paletteTitle: 'Steps', gridSize: 18,
      initialZoom: 1, dangerColor: '#111', successColor: '#111', errorColor: '#111',
    parts: {
      top: () => () => {},
      toolbar: (base, S) => ctx => {
        base(ctx);
        S.els.bar.hidden = true;
      },
      paletteFrame: (base, S) => ctx => {
        const E = S.els, P = S.P;
        E.palette = P.el('aside', 'af-palette gem-palette', E.body);
        P.el('h3', '', E.palette, 'Steps');
        E.search = P.el('input', 'af-search', E.palette);
        E.search.placeholder = S.D.searchPlaceholder;
        E.search.setAttribute('aria-label', 'Find a step');
        E.search.hidden = true;
        E.list = P.el('div', 'af-list', E.palette);
        const scroll = P.el('div', 'gem-scroll', E.palette);
        const up = P.button(scroll, '▲', () => { E.list.scrollTop -= 58; });
        up.setAttribute('aria-label', 'Scroll steps up');
        P.el('div', 'gem-scroll-track', scroll);
        const down = P.button(scroll, '▼', () => { E.list.scrollTop += 58; });
        down.setAttribute('aria-label', 'Scroll steps down');
      },
      palette: (base, S) => ctx => {
        base(ctx);
        const decorations = {
          Branch:'M12 5v7M4 19v-5h16v5M9 2h6v6H9zM1 18h6v5H1zM17 18h6v5h-6z',
          Merge:'M6 5v14M8 5l10 7L8 19M2 3h6v5H2zM2 17h6v5H2zM17 9h6v6h-6z',
          Log:'M3 1h13l5 5v17H3zM16 1v6h5M6 11h12M6 15h12M6 19h9',
          'HTTP Request':'M2 12a10 10 0 1 0 20 0a10 10 0 1 0-20 0M12 2c-7 6-7 14 0 20 7-6 7-14 0-20M2 12h20M4 6h16M4 18h16M12 2v20',
        };
        for (const [name, icon] of [['Branch','branch'], ['Merge','branch'], ['Log','record'], ['HTTP Request','grid']]) {
          const row = S.P.el('div', 'af-component gem-extra-step', S.els.list);
          S.P.icon(S.P.el('span', 'af-symbol', row), icon);
          S.P.el('span', '', row, name);
          row.querySelector('path').setAttribute('d',decorations[name]);
          row.addEventListener('click', () => env.log('decoy', {label:name}));
        }
      },
      componentDecorated: (base, S) => (ctx, tile, type, i) => {
        base(ctx, tile, type, i);
        const shapes = [null, 'M12 1 23 12 12 23 1 12Z', 'M3 1h13l5 5v17H3zM16 1v6h5M6 11h12M6 15h12M6 19h9', 'M2 4h20v16H2zM2 4l10 9L22 4', 'M9 1h6l1 4 3 2 4 1-1 5-3 1-1 4-3 1-1 4H9l-1-4-4-1-2-4 1-5 4-1 2-3zM8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0', null];
        if (shapes[i]) tile.querySelector('path').setAttribute('d', shapes[i]);
      },
      references: (base, S) => ctx => {
        base(ctx);
        S.els.references.hidden = true;
      },
      edges: (base, S) => m => {
        base(m);
        S.els.wires.querySelectorAll('[stroke-dasharray]').forEach(el => el.remove());
      },
      overview: (base, S) => ctx => {
        base(ctx);
        S.els.overviewTitle.closest('.af-overview').remove();
      },
      executions: (base, S) => ctx => {
        base(ctx);
        const tools = ctx.stage.parentElement.querySelector('.relay-canvas-tools');
        tools.appendChild(S.els.minimap.parentElement);
        S.els.executions.remove();
      },
      footer: (base, S) => ctx => {
        base(ctx);
        S.els.nodeCount.parentElement.hidden = true;
      },
      node: (base, S) => (ctx, layer, n) => {
        const card = S.P.el('div', 'af-node gem-node', layer);
        card.setAttribute('aria-label', n.label);
        card.dataset.node = n.id;
        if (n.type === 'Filter') card.classList.add('gem-decision');
        S.P.el('span', 'gem-node-label', card, n.label);
        return card;
      },
      curve: () => (a, b) => {
        const x = Math.round((a[0] + b[0]) / 2);
        return `M${a[0]},${a[1]} H${x} V${b[1]} H${b[0]}`;
      },
      minimap: (base, S) => (m, rect) => {
        const map = S.els.minimap, svg = S.ctx.util.svg;
        map.replaceChildren();
        const maxX = Math.max(...m.nodes.map(n => n.x + 160), 1000);
        const maxY = Math.max(420, ...m.nodes.map(n => n.y + 90));
        const k = Math.min(124 / maxX, 64 / maxY);
        for (const edge of m.edges) {
          const a = m.nodes.find(n => n.id === edge[0]), b = m.nodes.find(n => n.id === edge[1]);
          if (a && b) svg('path', {d:S.P.curve([4+(a.x+148)*k,4+(a.y+38)*k], [4+b.x*k,4+(b.y+38)*k]), class:'af-mapedge'}, map);
        }
        for (const n of m.nodes) svg('rect', {x:4+n.x*k,y:4+n.y*k,width:148*k,height:76*k,fill:'#fafafa',stroke:'#111','stroke-width':1}, map);
      },
      rendered: (base, S) => ctx => {
        base(ctx);
        const windowTools = ctx.stage.parentElement.querySelector('.relay-controls');
        for (const [button, label] of [[S.els.undo,'Undo'],[S.els.del,'Delete selected']]) {
          button.classList.add('gem-recovery');
          button.setAttribute('aria-label',label); button.title = label;
          for (const child of [...button.childNodes]) if (child.nodeType === 3) child.remove();
          const svg = button.querySelector('svg');
          if (svg) { svg.setAttribute('width','16'); svg.setAttribute('height','16'); }
          windowTools.prepend(button);
        }
        const tools = ctx.stage.parentElement.querySelector('.relay-canvas-buttons');
        const old = S.els.bar.querySelectorAll('button');
        const zoomOut = [...old].find(b => b.title === 'Zoom out' || b.getAttribute('aria-label') === 'Zoom out');
        const zoomIn = [...old].find(b => b.title === 'Zoom in' || b.getAttribute('aria-label') === 'Zoom in');
        const gadgets = tools.querySelectorAll('.canvas-tool-button');
        for (const [source, target] of [[zoomOut,gadgets[2]],[zoomIn,gadgets[3]]]) {
          if (source && target) target.addEventListener('click', () => source.click());
        }
        const maxX = Math.max(...ctx.model.nodes.map(n => n.x + 175));
        S.zoom = Math.min(1, Math.max(.35, (S.els.canvas.clientWidth - 14) / maxX));
        S.P.paint(ctx.model);
      },
    },
  },
});
