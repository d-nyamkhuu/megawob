// Design on use-workflow-editor/editor; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-workflow-editor',
  site: 'design-use-workflow-editor-remove-04',
  name: 'design',
  split: 'train',
  scenarios: ['remove'],
  template: 'use-workflow-editor/editor',
  design: {
    frameInset: 0, initialZoom: 1, gridSize: 20, searchPlaceholder: 'Search steps...', paletteHint: '', compactWidth: 0,
    parts: {
      frame: (base, S) => ctx => {
        const app = base(ctx);
        const right = Math.min(324, Math.max(220, ctx.size.width * .198));
        const extent = Math.max(...ctx.model.nodes.map(n => n.x + 168), 1000);
        S.zoom = Math.min(1.12, (ctx.size.width - right - 24) / extent);
        app.style.setProperty('--palette-width', right + 'px');
        return app;
      },
      top: () => () => {},
      toolbar: (base, S) => ctx => {
        const P = S.P, E = S.els;
        E.body = P.body(ctx, E.app);
        const bar = E.bar = P.el('div', 'af-toolbar', E.body);
        P.iconButton(bar, 'Select', 'cursor', () => {}, 'relay-select');
        P.iconButton(bar, 'Pan canvas', 'hand', () => {});
        P.iconButton(bar, 'Reset view', 'fit', () => { S.zoom = S.D.initialZoom; P.commit({ ...ctx.model, pan: [0, 0] }); });
        P.iconButton(bar, 'Zoom in', 'search', () => P.setZoom(S.zoom + .1));
        const zoom = P.button(bar, '', () => P.setZoom(S.zoom - .1), 'relay-zoom');
        E.zoomLabel = P.el('span', '', zoom, '100%');
        P.el('span', '', zoom, '⌄');
        P.el('span', 'relay-toolspace', bar);
        E.undo = P.iconButton(bar, 'Undo', 'undo', () => {
          const m = ctx.model, history = m.history.slice(), prev = history.pop();
          if (prev) P.commit({ ...m, ...prev, history, selected: null, panel: null, menu: null });
        });
        const redo = P.iconButton(bar, 'Redo', 'undo', () => {}, 'relay-redo');
        redo.disabled = true;
        E.del = P.iconButton(bar, 'Delete selected', 'trash', () => P.removeSelected());
        P.iconButton(bar, 'Fit canvas', 'fit', () => P.setZoom(S.D.initialZoom));
      },
      canvas: (base, S) => ctx => {
        base(ctx);
        const fit = () => {
          S.els.workspace.style.paddingTop = '0px';
          const rect = S.els.canvas.getBoundingClientRect();
          const bottom = Math.max(...ctx.model.nodes.map(n => n.y + 76), 250);
          const top = Math.min(...ctx.model.nodes.map(n => n.y), 90);
          const extent = Math.max(...ctx.model.nodes.map(n => n.x + 168), 1000);
          S.zoom = Math.min(1.12, (rect.width - 24) / extent, (rect.height - 20) / bottom);
          const offset = Math.max(6, Math.min(65, (rect.height - (bottom - top) * S.zoom) / 2 - top * S.zoom));
          S.els.workspace.style.paddingTop = offset + 'px';
        };
        fit();
        S.els.app.addEventListener('relay-layout', () => { fit(); S.P.paint(ctx.model); });
      },
      paletteFrame: (base, S) => ctx => {
        const P = S.P, E = S.els;
        E.palette = P.el('aside', 'af-palette', E.body);
        const tabs = P.el('div', 'relay-pane-tabs', E.palette);
        P.el('strong', 'active', tabs, 'Steps'); P.el('span', '', tabs, 'Details');
        const taskNote = document.querySelector('.ref-panel');
        if (taskNote) E.palette.appendChild(taskNote);
        const searchbox = P.el('div', 'relay-searchbox', E.palette);
        P.icon(searchbox, 'search');
        E.search = P.el('input', 'af-search', searchbox);
        E.search.placeholder = S.D.searchPlaceholder;
        E.search.setAttribute('aria-label', 'Find a step');
        E.list = P.el('div', 'af-list', E.palette);
        P.el('div', 'af-category', E.list, 'Triggers');
      },
      component: (base, S) => (ctx, list, type, i) => {
        const P = S.P;
        if (i === 1) P.el('div', 'af-category', list, 'Actions');
        const tile = base(ctx, list, type, i);
        tile.dataset.tone = i;
        const title = tile.lastElementChild;
        title.classList.add('relay-component-copy');
        P.el('small', '', title, ['Start from a customer event', 'Route based on a condition', 'Transform your data', 'Send a message', 'Create or update a record', 'Wait before the next step'][i]);
        return tile;
      },
      nodeDecorated: (base, S) => (ctx, card, n) => {
        card.dataset.tone = ['Webhook', 'Filter', 'Transform', 'Send message', 'Create record', 'Delay'].indexOf(n.type);
      },
      overview: (base, S) => ctx => {
        const P = S.P, E = S.els;
        const details = P.el('aside', 'af-overview', E.body);
        const tabs = P.el('div', 'relay-pane-tabs', details);
        for (const [i, name] of ['Details', 'Inputs', 'Outputs', 'Settings'].entries()) P.el('span', i ? '' : 'active', tabs, name);
        const content = P.el('div', 'relay-detail-content', details);
        const summary = P.el('div', 'relay-step-summary', content);
        P.icon(P.el('div', 'relay-detail-symbol', summary), 'bolt');
        E.overviewTitle = P.el('strong', '', summary);
        P.el('span', 'relay-detail-type', summary, 'Trigger');
        P.el('p', '', summary, 'Starts the workflow when a new event occurs.');
        P.button(summary, 'Edit parameters ↗', () => P.openPanel(ctx.model.selected?.node || ctx.model.nodes[0]?.id));
        const fields = P.el('div', 'relay-detail-fields', content);
        const name = P.el('div', 'relay-display-field', fields);
        P.el('span', '', name, 'Step name'); P.el('span', 'relay-detail-name', name);
        const desc = P.el('div', 'relay-display-field', fields);
        P.el('span', '', desc, 'Description'); P.el('span', 'relay-description', desc, 'Starts the workflow when a new customer event occurs.');
        E.overviewProperties = P.el('div', 'relay-detail-properties', content);
      },
      property: (base, S) => (ctx, parent, key, value) => {
        const row = S.P.el('div', 'af-property', parent);
        if (key === 'Operation') {
          row.classList.add('relay-enabled');
          S.P.el('span', 'relay-switch', row);
          const copy = S.P.el('div', '', row, 'Enabled');
          S.P.el('small', '', copy, 'This step is active in the workflow.');
        } else {
          const selected = ctx.model.nodes.find(n => n.id === ctx.model.selected?.node) || ctx.model.nodes[0];
          const trigger = selected?.type === 'Webhook';
          S.P.el('span', '', row, key === 'Component' ? (trigger ? 'Trigger type' : 'Step type') : (trigger ? 'Event source' : key));
          S.P.el('b', '', row, trigger && key === 'Destination' ? 'Webhook received' : value);
        }
        return row;
      },
      painted: (base, S) => (ctx, m) => {
        S.els.del.hidden = false;
        S.els.del.style.visibility = m.selected ? 'visible' : 'hidden';
        const redo = S.els.app.querySelector('.relay-redo');
        redo.hidden = false;
        redo.style.visibility = m.selected ? 'hidden' : 'visible';
        const selected = m.nodes.find(n => n.id === m.selected?.node) || m.nodes[0];
        S.els.app.querySelector('.relay-detail-name').textContent = selected?.label || 'No step selected';
        S.els.app.querySelector('.relay-detail-type').textContent = selected?.type || '';
        const i = ['Webhook', 'Filter', 'Transform', 'Send message', 'Create record', 'Delay'].indexOf(selected?.type);
        const symbol = S.els.app.querySelector('.relay-detail-symbol');
        symbol.dataset.tone = i;
        symbol.replaceChildren(); S.P.icon(symbol, S.D.icons[i] || 'code');
        const description = ['Starts the workflow when a new event occurs.', 'Routes the workflow based on a condition.', 'Transforms data for the next step.', 'Sends a message to the configured destination.', 'Creates or updates a record.', 'Waits before continuing to the next step.'][i] || 'Workflow step details.';
        S.els.app.querySelector('.relay-step-summary>p').textContent = description;
        S.els.app.querySelector('.relay-description').textContent = description;
      },
      icon: (base, S) => (parent, name) => {
        const paths = {
          send: 'M3 5h18v14H3zM3 5l9 8 9-8',
          record: 'M4 6c0-4 16-4 16 0s-16 4-16 0m0 0v12c0 4 16 4 16 0V6M4 12c0 4 16 4 16 0',
          cursor: 'm5 3 14 11-7 1-3 6z',
          hand: 'M8 12V5a2 2 0 0 1 4 0v6-7a2 2 0 0 1 4 0v7-5a2 2 0 0 1 4 0v9c0 5-3 7-7 7-3 0-4-2-6-4l-3-5a2 2 0 0 1 3-2l3 3',
          search: 'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14m5 12 6 6'
        };
        if (!paths[name]) return base(parent, name);
        const svg = S.ctx.util.svg('svg', {class:'af-icon', viewBox:'0 0 24 24', fill:name === 'cursor' ? 'currentColor' : 'none', stroke:'currentColor', 'stroke-width':1.8, 'stroke-linecap':'round', 'stroke-linejoin':'round'}, parent);
        S.ctx.util.svg('path', {d:paths[name]}, svg);
        return svg;
      }
    }
  },
});
