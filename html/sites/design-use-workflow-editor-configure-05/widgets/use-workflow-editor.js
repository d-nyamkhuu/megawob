// Relayboard design on use-workflow-editor/editor; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-workflow-editor',
  site: 'design-use-workflow-editor-configure-05',
  name: 'design',
  split: 'train',
  scenarios: ['configure'],
  template: 'use-workflow-editor/editor',
  design: {
    frameInset: 0, frameRadius: 0, paletteWidth: 202, tightPaletteWidth: 184,
    initialZoom: 1, gridSize: 13, fontFamily: 'Arial,Helvetica,sans-serif',
    paletteTitle: 'Components',
    parts: {
      top: () => () => {},
      toolbar: (base, S) => (ctx) => {
        base(ctx);
        const { P, els: E } = S;
        const undo = E.undo, del = E.del;
        E.bar.replaceChildren();
        const workflow = P.el('div', 'pl-workflow', E.bar);
        P.el('span', '', workflow, 'Workflow:');
        const choose = P.button(workflow, S.spec.title, () => P.showPopover('Workflow', [S.spec.title, 'Owner: ' + S.spec.owner]), 'pl-workflow-choice');
        P.el('span', 'pl-select-arrow', choose, '▾');
        const group = P.el('div', 'pl-tool-group', E.bar);
        const tool = (parent, label, icon, fn) => {
          const b = P.button(parent, '', fn, 'pl-tool');
          P.icon(P.el('span', 'pl-tool-icon', b), icon);
          P.el('span', '', b, label); b.title = label; return b;
        };
        tool(group, 'Add Step', 'plus', () => { E.list.scrollTop = 0; E.list.focus(); });
        del.replaceChildren(); P.icon(P.el('span', 'pl-tool-icon', del), 'minus'); P.el('span', '', del, 'Delete');
        del.className = 'af-btn pl-tool'; group.appendChild(del);
        const zoom = P.el('div', 'pl-tool-group pl-zoom', E.bar);
        tool(zoom, 'Zoom In', 'zoomIn', () => P.setZoom(S.zoom + .1));
        tool(zoom, 'Zoom Out', 'zoomOut', () => P.setZoom(S.zoom - .1));
        tool(zoom, 'Fit', 'fit', () => { S.zoom = E.canvas.dataset.fitZoom * 1; P.commit({ ...ctx.model, pan: [0, 0] }); });
        E.zoomLabel = P.el('span', 'pl-internal', E.bar);
        const layout = P.el('div', 'pl-tool-group pl-layout', E.bar);
        tool(layout, 'Align', 'align', () => P.showPopover('Align steps', ['Select a step to inspect its position.']));
        tool(layout, 'Arrange', 'arrange', () => P.showPopover('Arrange steps', ['Drag a step to change its position on the canvas.']));
        layout.appendChild(undo); undo.classList.add('pl-internal');
      },
      paletteFrame: (base, S) => (ctx) => {
        const { P, els: E } = S;
        E.palette = P.el('aside', 'af-palette', E.body);
        P.el('h3', '', E.palette, 'Step Palette');
        E.search = P.el('input', 'af-search pl-internal', E.palette); E.search.setAttribute('aria-label', 'Find a step');
        E.list = P.el('div', 'af-list', E.palette); E.list.tabIndex = -1;
        const scroll = P.el('div', 'pl-scrollbar', E.palette);
        const thumb = P.el('div', 'pl-scroll-thumb', scroll);
        P.button(scroll, '▴', () => { E.list.scrollTop -= 90; }, 'pl-scroll-up');
        P.button(scroll, '▾', () => { E.list.scrollTop += 90; }, 'pl-scroll-down');
        const syncScroll = () => {
          const track = Math.max(1, scroll.clientHeight - 44), height = Math.max(35, track * E.list.clientHeight / E.list.scrollHeight);
          thumb.style.height = height + 'px';
          thumb.style.top = (22 + (track - height) * E.list.scrollTop / Math.max(1, E.list.scrollHeight - E.list.clientHeight)) + 'px';
        };
        E.list.addEventListener('scroll', syncScroll); E.list._syncScroll = syncScroll;
        let startScroll;
        env.ui.track(thumb, { start(p, e) { e.stopPropagation(); startScroll = E.list.scrollTop; }, move(p) {
          E.list.scrollTop = startScroll + p.dy * (E.list.scrollHeight - E.list.clientHeight) / Math.max(1, scroll.clientHeight - 44 - thumb.clientHeight);
        }, end() {} }, 'palette-scroll');
        E.list._groups = {};
        for (const name of ['Communication', 'Data', 'Flow']) {
          const section = P.el('section', 'pl-palette-section', E.list);
          P.el('h4', '', section, '▾  ' + name);
          E.list._groups[name] = section;
        }
        const row = (group, label, icon) => {
          const tile = P.el('div', 'pl-palette-row', E.list._groups[group]);
          P.icon(P.el('span', 'pl-palette-icon', tile), icon); P.el('span', '', tile, label);
        };
        row('Communication', 'Select', 'select'); row('Communication', 'Trigger', 'bolt'); row('Communication', 'Condition', 'condition');
        row('Communication', 'Action', 'gear'); row('Data', 'Email', 'email'); row('Data', 'File', 'record');
        row('Data', 'Database', 'database'); row('Flow', 'Delay', 'clock'); row('Flow', 'Log', 'activity');
        E.list._groups.Apps = P.el('section', 'pl-palette-section pl-apps-section', E.list);
        P.el('h4', 'pl-apps', E.list._groups.Apps, '▾  Apps');
      },
      component: (base, S) => (ctx, list, type, i) => {
        const group = type === 'Send message' ? 'Communication' : type === 'Create record' ? 'Data' : type === 'Delay' ? 'Flow' : 'Apps';
        const tile = base(ctx, list._groups[group], type, i);
        tile.classList.add('pl-palette-row');
        if (group === 'Communication' || group === 'Data') list._groups[group].insertBefore(tile, list._groups[group].children[2]);
        if (group === 'Flow') list._groups[group].insertBefore(tile, list._groups[group].children[3]);
        tile.hidden = true;
        return tile;
      },
      icon: (base, S) => (parent, name) => {
        const paths = {
          select: '<path d="M3 1v22l6-6 5 9 4-2-5-9h9Z" fill="#08090b" stroke="#08090b" stroke-width="1.5"/>',
          condition: '<path d="m13 1 12 12-12 12L1 13Z" fill="url(#pl-blue)" stroke="#17243a" stroke-width="1.5"/>',
          gear: '<path d="M10 1h6l1 4 3 1 4-2 4 5-3 3 1 4 4 1v6l-4 1-1 3-3 3-4-2-3 1-1 4h-6l-1-4-3-1-4 2-3-5 3-3-1-4-4-1v-6l4-1 1-3L1 5l5-3 3 3 3-1Z" transform="translate(1 0) scale(.86)" fill="#d6c995" stroke="#1b1a16" stroke-width="1.5"/><circle cx="13" cy="13" r="4" fill="#b5ad88" stroke="#1b1a16" stroke-width="1.5"/>',
          email: '<path d="M2 5h20v15H2z" fill="url(#pl-paper)"/><path d="m3 6 9 8 9-8M3 19l6-7m12 7-6-7" fill="none"/>',
          send: '<path d="M12 3C5 3 2 6 2 10c0 3 2 5 5 6l-2 6 7-5c7 0 10-3 10-7S18 3 12 3Z" fill="url(#pl-blue)"/><path d="M7 10h1m3 0h1m3 0h1"/>',
          record: '<path d="M4 1h11l6 6v16H4z" fill="url(#pl-paper)"/><path d="M15 1v7h6M7 12h10M7 16h10M7 19h10" fill="none"/>',
          bolt: '<path d="M4 1h11l6 6v16H4z" fill="url(#pl-paper)"/><path d="M15 1v7h6M7 12h10M7 16h10M7 19h10" fill="none"/>',
          code: '<path d="M4 1h11l6 6v16H4z" fill="url(#pl-paper)"/><path d="M15 1v7h6M7 12h10M7 16h10M7 19h10" fill="none"/>',
          filter: '<path d="M2 2h21L15 13v7l-4 3V13Z" fill="url(#pl-blue)"/><path d="M3 5h18M12 13h3" fill="none"/>',
          phone: '<path d="m6 2 4 6-3 3c2 4 4 6 7 7l3-3 5 4c-1 5-5 5-10 2C6 18 2 12 2 7c0-3 2-4 4-5Z" fill="url(#pl-blue)"/>',
          database: '<path d="M3 6v14c0 5 18 5 18 0V6" fill="url(#pl-paper)"/><ellipse cx="12" cy="5" rx="9" ry="4" fill="url(#pl-paper)"/><path d="M3 11c3 4 15 4 18 0M3 17c3 4 15 4 18 0" fill="none"/>',
          pencil: '<path d="M2 3h11v18H2Z" fill="url(#pl-paper)"/><path d="m2 24 2-7L17 2c2-2 6 2 5 4L8 22Z" fill="#f6d74c"/><path d="m4 17 4 5M16 3l5 5M2 24l3-1" fill="none"/>',
          activity: '<path d="M2 3h21v20H2Z" fill="url(#pl-paper)"/><path d="M5 6h15M5 9h15M5 12h15M5 15h15M5 18h15" fill="none" stroke="#505d97"/>',
          clock: '<circle cx="13" cy="13" r="11" fill="url(#pl-paper)"/><path d="M13 4v2M5 6l2 2M3 13h2M5 20l2-2M13 21v2M21 20l-2-2M21 13h2M20 6l-2 2M13 7v7l-4 3" fill="none"/>',
          deleteRecord: '<path d="M4 1h11l6 6v16H4z" fill="url(#pl-paper)"/><path d="M15 1v7h6M7 12h9M7 16h7" fill="none"/><path d="m13 15 9 8m0-8-9 8" stroke="#d12020" stroke-width="3"/>',
          arrow: '<path d="M2 9h11V3l9 9-9 9v-6H2Z" fill="url(#pl-green)"/>',
          branch: '<path d="M10 5h8V1l7 6-7 6V9h-8zM11 19H6v-4l-6 6 6 5v-4h5Z" fill="url(#pl-blue)"/>',
          loop: '<path d="M20 7V1l-4 4A10 10 0 1 0 22 15h-4a6 6 0 1 1-5-8l-3 4h12V7Z" fill="url(#pl-blue)"/>',
          zoomIn: '<circle cx="10" cy="9" r="7" fill="url(#pl-paper)"/><path d="m15 15 7 7-2 2-7-7Z" fill="#a49b81"/><path d="M6 9h8M10 5v8" fill="none"/>',
          zoomOut: '<circle cx="10" cy="9" r="7" fill="url(#pl-paper)"/><path d="m15 15 7 7-2 2-7-7Z" fill="#a49b81"/><path d="M6 9h8" fill="none"/>',
          plus: '<rect x="2" y="2" width="20" height="20" rx="1" fill="url(#pl-paper)"/><path d="M6 12h12M12 6v12" fill="none" stroke-width="2"/>',
          minus: '<rect x="2" y="2" width="20" height="20" rx="1" fill="url(#pl-paper)"/><path d="M6 12h12" fill="none" stroke-width="2"/>',
          fit: '<path d="M2 2h20v20H2Z" fill="url(#pl-paper)"/><path d="M8 4H4v4m12-4h4v4M4 16v4h4m8 0h4v-4" fill="none" stroke="#454e9d"/>',
          align: '<path d="M2 2h12v12H2zM16 13h8v9h-8Z" fill="url(#pl-paper)"/><path d="M8 16v8m-4-4h8M17 5v4m-2-2h4" fill="none"/>',
          arrange: '<path d="M2 2h12v12H2zM8 8h12v12H8zM14 14h10v10H14z" fill="url(#pl-paper)"/>',
        };
        if (!paths[name]) return base(parent, name);
        const svg = S.ctx.util.svg('svg', { class: 'af-icon pl-icon', viewBox: '0 0 26 26', 'aria-hidden': 'true' }, parent);
        svg.innerHTML = paths[name]; return svg;
      },
      frame: (base, S) => (ctx) => {
        const app = base(ctx);
        const defs = ctx.util.svg('svg', { class: 'pl-definitions', width: 0, height: 0, 'aria-hidden': 'true' }, app);
        defs.innerHTML = '<defs><linearGradient id="pl-paper" x2=".7" y2="1"><stop stop-color="#fff"/><stop offset=".5" stop-color="#e9edf7"/><stop offset="1" stop-color="#9ca8cf"/></linearGradient><linearGradient id="pl-blue" x2=".7" y2="1"><stop stop-color="#d8eaff"/><stop offset=".5" stop-color="#8da7ec"/><stop offset="1" stop-color="#5462ae"/></linearGradient><linearGradient id="pl-green" x2=".7" y2="1"><stop stop-color="#b4ed9e"/><stop offset="1" stop-color="#24a12a"/></linearGradient></defs>';
        return app;
      },
      canvas: (base, S) => (ctx) => {
        base(ctx);
        const E = S.els;
        // Presentation offsets leave the stored workflow and its undo history untouched.
        const slots = [[52,292], [286,292], [520,226], [752,226], [520,400], [752,400]];
        E.canvas._offsets = Object.fromEntries(ctx.model.nodes.map((n, i) => {
          const p = slots[i] || [40 + (i % 4) * 232, 510 + Math.floor(i / 4) * 120];
          return [n.id, [p[0] - n.x, p[1] - n.y]];
        }));
        S.zoom = Math.min(1, (E.canvas.clientWidth - 34) / 1040, (E.canvas.clientHeight - 24) / 560);
        E.canvas.dataset.fitZoom = S.zoom;
      },
      point: (base, S) => (n, kind) => {
        const p = base(n, kind), d = S.els.canvas._offsets[n.id] || [0, 0];
        return [p[0] + d[0], p[1] + d[1] + 4];
      },
      locate: (base, S) => (target) => {
        const p = base(target);
        if (!target.node) return p;
        const d = S.els.canvas._offsets[target.node] || [0, 0];
        return [p[0] + d[0] * S.zoom, p[1] + d[1] * S.zoom];
      },
      references: (base, S) => (ctx) => { base(ctx); S.els.references.hidden = true; },
      executions: (base, S) => (ctx) => { base(ctx); S.els.executions.hidden = true; },
      overview: (base, S) => (ctx) => { base(ctx); S.els.overviewTitle.closest('.af-overview').hidden = true; },
      edges: (base, S) => (m) => { base(m); for (const wire of S.els.wires.querySelectorAll(':scope > path')) wire.remove(); },
      wire: (base, S) => (ctx, edge, a, b, start, end, selected) => {
        const hit = base(ctx, edge, a, b, start, end, selected);
        if (end[0] <= start[0]) {
          const d = `M${start[0]},${start[1]} C${start[0]+60},${start[1]+90} ${end[0]-60},${end[1]-90} ${end[0]},${end[1]}`;
          for (const p of hit.parentElement.querySelectorAll('path')) p.setAttribute('d', d);
        }
        return hit;
      },
      footer: (base, S) => (ctx) => { base(ctx); S.els.nodeCount.parentElement.hidden = true; },
      node: (base, S) => (ctx, layer, n) => {
        const card = base(ctx, layer, n), types = ['Webhook', 'Filter', 'Transform', 'Send message', 'Create record', 'Delay'];
        card.dataset.tone = ['trigger', 'logic', 'action', 'action', 'data', 'data'][types.indexOf(n.type)] || 'data';
        return card;
      },
      painted: (base, S) => (ctx, m) => {
        base(ctx, m);
        for (const n of m.nodes) {
          const card = S.els.nodes[n.id], d = S.els.canvas._offsets[n.id] || [0, 0];
          card.style.left = (n.x + m.pan[0] + d[0]) + 'px';
          card.style.top = (n.y + m.pan[1] + d[1]) + 'px';
        }
        const summary = document.querySelector('.relay-summary');
        if (!summary) return;
        const values = summary.querySelectorAll('.relay-summary-value');
        values[0].textContent = S.spec.title; values[1].textContent = m.nodes.length; values[2].textContent = m.edges.length;
      },
      rendered: (base, S) => (ctx) => { base(ctx); S.els.list._syncScroll(); },
    },
  },
});
