// BeOS presentation; model coordinates and graph edits remain owned by the template.
function relayNodePosition(S, n) {
  const original = S.relayPositions?.find(v => v.id === n.id);
  if (!original) return [n.x + S.model.pan[0], n.y + S.model.pan[1]];
  const i = S.relayPositions.indexOf(original);
  const row = S.els.canvas.clientHeight / S.zoom * .395 - 42;
  const x = i < 5 ? [50,300,555,800,1055][i] : 295;
  const y = i < 5 ? row : row + 212;
  return [x + n.x - original.x + S.model.pan[0], y + n.y - original.y + S.model.pan[1]];
}
function relayNodeWidth(S,n) {
  const i = S.relayPositions?.findIndex(v=>v.id===n.id);
  return [170,170,178,185,230,190][i] || 170;
}
function relayTypeGlyph(type) {
  const shapes = {
    Webhook: '<path d="M3 12h15V5l13 13-13 13v-8H3z" fill="#36c63c" stroke="#16731b" stroke-width="1.5"/><path d="M6 14h13V9" fill="none" stroke="#a8f89b"/>',
    Action: '<rect x="4" y="4" width="27" height="28" rx="1" fill="#6c9efb" stroke="#142561" stroke-width="2"/><path d="M7 29V7h21" fill="none" stroke="#bcd5ff" stroke-width="2"/>',
    Filter: '<path d="m18 2 16 16-16 16L2 18z" fill="#a374e5" stroke="#31204a" stroke-width="1.5"/>',
    Transform: '<path d="M5 2h19l8 8v24H5z" fill="#ffd356" stroke="#94701b" stroke-width="1.5"/><path d="M24 2v9h8M9 13h18M9 18h18M9 23h18M9 28h18" fill="none" stroke="#a67d17" stroke-width="1.5"/>',
    'Create record': '<path d="M9 3h15l6 6v23H9z" fill="#9ab9ed" stroke="#254570" stroke-width="1.5"/><path d="M24 3v7h6M13 14h13M13 19h13M13 24h13" fill="none" stroke="#395b89"/>',
    'Send message': '<rect x="2" y="7" width="32" height="24" rx="1" fill="#31c2c5" stroke="#064f57" stroke-width="1.5"/><path d="m3 8 15 13L33 8" fill="none" stroke="#064f57" stroke-width="1.5"/>',
    Delay: '<circle cx="18" cy="18" r="16" fill="#9399a7" stroke="#252732" stroke-width="1.5"/><path d="M18 5v14l10-11" fill="none" stroke="#252732" stroke-width="1.5"/>',
    Log: '<path d="M4 2h28v32H4z" fill="#ddc8a3" stroke="#89744c" stroke-width="1.5"/><path d="M9 8h18M9 14h18M9 20h18M9 26h18" stroke="#7d6b49" stroke-width="2"/>',
  };
  return '<svg viewBox="0 0 36 36" aria-hidden="true">' + (shapes[type] || shapes.Action) + '</svg>';
}
env.widget({
  task: 'use-workflow-editor',
  site: 'design-use-workflow-editor-reroute-04',
  name: 'design',
  split: 'train',
  scenarios: ['reroute'],
  template: 'use-workflow-editor/editor',
  design: {
    frameInset: 0, frameRadius: 0, initialZoom: 1, gridSize: 36, fontFamily: 'Arial,Helvetica,sans-serif',
    parts: {
      top: () => () => {},
      frame: (base, S) => (ctx) => {
        const app = base(ctx);
        S.zoom = Math.min(1, (ctx.size.width - 35) / 1280);
        S.relayFitZoom = S.zoom;
        S.D.initialZoom = S.zoom;
        S.relayPositions = ctx.model.nodes.map(n => ({id:n.id,x:n.x,y:n.y}));
        return app;
      },
      toolbar: (base, S) => (ctx) => {
        base(ctx);
        const bar = S.els.bar;
        bar.querySelector('.af-tabs').remove();
        bar.lastElementChild.remove();
        const select = S.P.button(bar, '', () => {}, 'be-select');
        select.title = 'Selection tool'; select.setAttribute('aria-label', select.title);
        select.innerHTML = '<svg viewBox="0 0 32 32"><path d="M7 3v25l7-8 6 10 5-3-6-10 10-1z" fill="#000"/></svg>';
        const hand = S.P.button(bar, '', () => {}, 'be-hand');
        hand.title = 'Pan tool'; hand.setAttribute('aria-label', hand.title);
        hand.innerHTML = '<svg viewBox="0 0 36 36"><path d="m10 21-4-7q-3-5-5-2l5 14 6 7h12l7-12V11q-2-3-4 0v7-12q-2-4-4 0v11V4q-3-4-5 0v13-11q-3-3-5 1v14z" transform="translate(3 -1) scale(.9)" fill="#eee" stroke="#111" stroke-width="1.7" stroke-linejoin="round"/></svg>';
        bar.prepend(hand); bar.prepend(select);
        const buttons = [...bar.querySelectorAll('button')];
        buttons[2].innerHTML = '<svg viewBox="0 0 32 32"><circle cx="13" cy="12" r="9" fill="#eee" stroke="#111" stroke-width="2"/><path d="m20 19 9 10M8 12h10" stroke="#111" stroke-width="3"/></svg>';
        buttons[3].innerHTML = '<svg viewBox="0 0 32 32"><circle cx="13" cy="12" r="9" fill="#eee" stroke="#111" stroke-width="2"/><path d="m20 19 9 10M8 12h10m-5-5v10" stroke="#111" stroke-width="3"/></svg>';
        bar.insertBefore(buttons[3], buttons[2]);
        bar.insertBefore(S.els.zoomLabel, buttons[4]);
        S.els.zoomLabel.className = 'be-zoom';
        buttons[4].classList.add('be-grid');
        buttons[4].innerHTML = '<svg viewBox="0 0 36 36">' + Array.from({length:25}, (_,i) => '<rect x="'+(5+i%5*6)+'" y="'+(5+Math.floor(i/5)*6)+'" width="2.5" height="2.5" fill="#2353b8"/>').join('') + '</svg>';
        S.els.undo.innerHTML = '<svg viewBox="0 0 36 36"><path d="M5 5h9v27H5zm17 0h9v27h-9z" fill="#779cec" stroke="#18335c" stroke-width="1.5"/><path d="M2 12h15m-15 8h15m2-8h15m-15 8h15" stroke="#18335c" stroke-width="2"/></svg>'; S.els.undo.title = 'Undo';
        S.els.del.innerHTML = '<svg viewBox="0 0 36 36"><path d="M8 4h20v8H8zM5 17h26v9H5z" fill="#6898e4" stroke="#18335c" stroke-width="1.5"/><path d="M18 1v3m0 8v5M10 26v7m16-7v7M6 30h24" stroke="#18335c" stroke-width="2"/></svg>';
        const align = S.P.button(bar, '', () => {}, 'be-align'); align.title = 'Align steps'; align.setAttribute('aria-label', align.title);
        align.innerHTML = '<svg viewBox="0 0 36 36"><path d="M16 6h13v9H16zM5 21h24v9H5z" fill="#6898e4" stroke="#18335c" stroke-width="1.5"/><path d="M32 2v32m-17-16h14" stroke="#18335c" stroke-width="2"/></svg>';
        const tools = document.querySelector('.relay-header > .ref-tools');
        if (tools) bar.append(tools);
      },
      navigation: () => () => {},
      canvas: (base,S) => (ctx) => {
        base(ctx);
        const arrow = S.els.svg.querySelector('marker');
        arrow.setAttribute('markerWidth','7'); arrow.setAttribute('markerHeight','7'); arrow.setAttribute('refX','12');
      },
      paletteFrame: (base, S) => (ctx) => {
        base(ctx);
        const host = document.querySelector('.relay-stats');
        host.replaceChildren(S.els.palette);
        S.els.palette.querySelector('h3').textContent = 'Steps';
      },
      component: (base, S) => (ctx, list, type, i) => {
        const tile = base(ctx, list, type, i);
        tile.dataset.type = type;
        tile.querySelector('.af-symbol').innerHTML = type === 'Create record'
          ? '<svg viewBox="0 0 36 36"><path d="M3 8v21c0 8 30 8 30 0V8z" fill="#f56464" stroke="#a71c25" stroke-width="1.5"/><ellipse cx="18" cy="8" rx="15" ry="6" fill="#ff8686" stroke="#a71c25" stroke-width="1.5"/></svg>'
          : relayTypeGlyph(type);
        return tile;
      },
      palette: (base, S) => (ctx) => {
        base(ctx);
        const entries = [...S.els.list.querySelectorAll('.af-component')];
        const extra = (label) => {
          const row = ctx.util.el('div', 'af-component be-palette-extra', S.els.list);
          ctx.util.el('span', 'af-symbol', row).innerHTML = relayTypeGlyph(label);
          ctx.util.el('span', '', row, label);
          return row;
        };
        const action = extra('Action'), log = extra('Log');
        const order = [entries[0],action,entries[1],entries[2],entries[4],entries[3],entries[5],log];
        S.els.list.replaceChildren(...order.filter(Boolean));
      },
      references: (base, S) => (ctx) => { base(ctx); S.els.references.replaceChildren(); },
      edges: (base, S) => (m) => { base(m); for (const path of S.els.wires.querySelectorAll(':scope > path')) path.remove(); },
      executions: (base, S) => (ctx) => { base(ctx); S.els.executions.remove(); },
      overview: (base, S) => (ctx) => { base(ctx); S.els.overviewTitle.closest('.af-overview').remove(); },
      footer: (base, S) => (ctx) => { base(ctx); S.els.nodeCount.parentElement.remove(); },
      node: (base, S) => (ctx, layer, n) => {
        const card = base(ctx, layer, n);
        card.dataset.type = n.type;
        card.querySelector('.af-nodefoot').remove();
        card.querySelector('.af-symbol').innerHTML = relayTypeGlyph(n.type);
        return card;
      },
      point: (base, S) => (n, kind) => {
        const p = relayNodePosition(S, n);
        return [p[0] + (kind === 'out' ? (n.type === 'Filter' ? 160 : relayNodeWidth(S,n)) : (n.type === 'Filter' ? 10 : 0)), p[1] + 42];
      },
      setZoom: (base,S) => (value) => {
        S.zoom = Math.max(S.relayFitZoom * .6, Math.min(S.relayFitZoom * 1.4, Math.round(value*100)/100));
        S.P.paint(S.model);
      },
      curve: () => (a,b) => `M${a[0]},${a[1]} L${b[0]},${b[1]}`,
      wire: (base, S) => (ctx, edge, a, b, start, end, selected) => {
        const lane = Math.max(start[1],end[1]) + 75 - ctx.model.pan[1];
        const hit = base(ctx,edge,{...a,y:lane},{...b,y:lane},start,end,selected);
        if (Math.abs(start[1]-end[1]) < 1 && end[0]-start[0] > 320) {
          const y = start[1]-108;
          const d = `M${start[0]},${start[1]} L${start[0]+28},${y} L${end[0]-28},${y} L${end[0]},${end[1]}`;
          for (const path of hit.parentElement.querySelectorAll('path')) path.setAttribute('d',d);
        }
        return hit;
      },
      painted: (base, S) => (ctx,m) => {
        base(ctx,m);
        for (const n of m.nodes) {
          const p = relayNodePosition(S,n), card = S.els.nodes[n.id];
          card.style.left = p[0] + 'px'; card.style.top = p[1] + 'px';
          card.style.width = relayNodeWidth(S,n) + 'px';
        }
        S.els.workspace.style.backgroundPosition = S.els.canvas.style.backgroundPosition;
        S.els.zoomLabel.textContent = Math.round(S.zoom / S.relayFitZoom * 100) + '%';
      },
      locate: (base,S) => (target) => target.node ? env.util.center(S.els.nodes[target.node]) : base(target),
    },
  },
});
