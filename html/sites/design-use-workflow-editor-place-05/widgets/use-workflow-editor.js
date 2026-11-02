// Design on use-workflow-editor/editor; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-workflow-editor',
  site: 'design-use-workflow-editor-place-05',
  name: 'design',
  split: 'train',
  scenarios: ['place'],
  template: 'use-workflow-editor/editor',
  design: {
    paletteWidth: 300, tightPaletteWidth: 250, initialZoom: 1, frameInset: 0,
    paletteTitle: 'Components', paletteHint: '', canvasHint: '', gridSize: 18,
    fontFamily: '"Segoe UI", Arial, sans-serif',
    parts: {
      paletteFrame: (base, S) => (ctx) => {
        const E = S.els, u = ctx.util;
        E.palette = u.el('aside', 'af-palette', E.body);
        u.el('h3', '', E.palette, 'Components');
        E.search = u.el('input', 'af-search', E.palette);
        E.search.placeholder = 'Find a step...';
        E.search.setAttribute('aria-label', 'Find a step');
        E.list = u.el('div', 'af-list', E.palette);
        for (const name of ['Messaging', 'Logic', 'Timing', 'Data']) {
          const group = u.el('section', 'af-group', E.list);
          group.dataset.group = name;
          u.el('div', 'af-grouphead', group, name);
        }
      },
      component: (base, S) => (ctx, list, type, i) => {
        const bucket = ({'Send message':'Messaging', Filter:'Logic', Transform:'Logic', Delay:'Timing', 'Create record':'Data', Webhook:'Data'})[type] || 'Logic';
        const parent = list.querySelector(`[data-group="${bucket}"]`) || list;
        const tile = ctx.util.el('div', 'af-component', parent);
        tile.setAttribute('role', 'button');
        tile.setAttribute('aria-label', `Drag ${type} to canvas`);
        S.P.icon(ctx.util.el('span', 'af-symbol', tile), S.D.icons[i]);
        ctx.util.el('span', '', tile, type);
        return tile;
      },
      portGesture: (base, S) => (target, id, kind, edgeRef = null) => {
        let from, old;
        const key = env.taskDef.helpers.edgeKey;
        env.ui.track(target, {
          start(p, e) {
            e.stopPropagation(); old = null;
            if (kind === 'out') from = id;
            else {
              const incoming = S.ctx.model.edges.filter(edge => edge[1] === id);
              old = edgeRef || incoming.find(edge => S.ctx.model.selected?.edge && key(edge) === key(S.ctx.model.selected.edge)) || incoming[0];
              if (!old) return false;
              from = old[0];
            }
            S.els.rubber.setAttribute('visibility', 'visible');
          },
          move(p) {
            const n = S.ctx.model.nodes.find(node => node.id === from), r = S.els.canvas.getBoundingClientRect();
            S.els.rubber.setAttribute('d', S.P.curve(S.P.point(n, 'out'), [(p.x-r.left)/S.zoom, (p.y-r.top)/S.zoom]));
          },
          end(p) {
            S.els.rubber.setAttribute('visibility', 'hidden');
            const nearest = Object.values(S.els.ports).filter(el => el.dataset.flowPort === 'in').map(el => {
              const r = el.getBoundingClientRect();
              return { el, d: Math.hypot(p.x - (r.left+r.width/2), p.y - (r.top+r.height/2)) };
            }).sort((a,b) => a.d-b.d)[0];
            const hit = nearest?.d <= 28 ? nearest.el : null;
            if (!hit || hit.dataset.node === from) return;
            const edge = [from, hit.dataset.node], m = S.ctx.model;
            const next = old ? m.edges.filter(e => key(e) !== key(old)) : m.edges.slice();
            if (!next.some(e => key(e) === key(edge))) next.push(edge);
            S.P.mutate({ ...m, edges: next, selected: { edge } });
            S.ctx.log(old ? 'edge-reroute' : 'edge-add', { edge });
          },
        }, 'flow-port');
      },
      references: (base, S) => (ctx) => {
        S.els.references = ctx.util.el('div', 'af-reference', S.els.world);
        S.els.referenceNodes = [];
      },
      point: (base, S) => (n, kind) => {
        const p = S.els.nodes[n.id];
        const m = S.model;
        if (p) {
          const x = parseFloat(p.style.left) || 0, y = parseFloat(p.style.top) || 0;
          return [x + p.offsetWidth / 2, y + (kind === 'out' ? p.offsetHeight : 0)];
        }
        const q = env.taskDef.helpers.port(n, kind);
        return [q[0] + m.pan[0], q[1] + m.pan[1]];
      },
      wire: (base, S) => (ctx, edge, a, b, start, end, selected) => {
        const g = ctx.util.svg('g', { class: `af-wire${selected ? ' on' : ''}` }, S.els.wires);
        const mid = (start[1] + end[1]) / 2;
        const d = end[0] < start[0] && end[1] < start[1] + 100
          ? `M${start[0]},${start[1]} L${start[0]},${start[1]+12} L${end[0]},${start[1]+12} L${end[0]},${end[1]}`
          : `M${start[0]},${start[1]} C${start[0]+24},${mid} ${end[0]+24},${mid} ${end[0]},${end[1]}`;
        const visible = Math.abs(start[0]-end[0]) < 2 && end[1] > start[1]
          ? `M${start[0]},${start[1]} L${end[0]},${end[1]}` : d;
        ctx.util.svg('path', { class: 'af-edge', d: visible, 'marker-end': 'url(#af-arrow)' }, g);
        const hit = ctx.util.svg('path', { class: 'af-hit', d }, g);
        const select = e => { e.stopPropagation(); S.P.commit({ ...ctx.model, selected: { edge }, panel: null, menu: null }); };
        hit.addEventListener('click', select);
        if (visible !== d) ctx.util.svg('path', { class: 'af-hit', d: visible }, g).addEventListener('click', select);
        if (selected) {
          const handle = ctx.util.svg('circle', { class: 'af-end', cx: end[0], cy: end[1] - 10, r: 5 }, g);
          S.P.portGesture(handle, edge[1], 'in', edge);
        }
        return hit;
      },
      edges: (base, S) => (m) => {
        const E = S.els;
        E.wires.replaceChildren();
        const edgeEls = {};
        for (const edge of m.edges) {
          const a = m.nodes.find(n => n.id === edge[0]), b = m.nodes.find(n => n.id === edge[1]);
          if (!a || !b) continue;
          const start = S.P.point(a, 'out'), end = S.P.point(b, 'in');
          const selected = m.selected?.edge && env.taskDef.helpers.edgeKey(m.selected.edge) === env.taskDef.helpers.edgeKey(edge);
          const hit = S.P.wire(S.ctx, edge, a, b, start, end, selected);
          const mid = hit.getPointAtLength(hit.getTotalLength()/2);
          edgeEls[env.taskDef.helpers.edgeKey(edge)] = { mid: [mid.x, mid.y] };
        }
        /* The template's edge cache is read by locate and measure. */
        Object.keys(E.edgeEls).forEach(key => delete E.edgeEls[key]);
        Object.assign(E.edgeEls, edgeEls);
      },
      paint: (base, S) => {
        const origins = new Map();
        let initialIds = null;
        let mountedApp = null;
        return (m) => {
          if (mountedApp !== S.els.app) {
            mountedApp = S.els.app;
            origins.clear();
            initialIds = null;
          }
          if (!initialIds) initialIds = new Set(m.nodes.map(n => n.id));
          base(m);
          const canvas = S.els.canvas;
          const h = canvas.clientHeight / S.zoom;
          const w = canvas.clientWidth / S.zoom;
          const count = m.nodes.filter(n => initialIds.has(n.id)).length;
          const compact = h < 520 || count > 6;
          const rows = compact ? Math.ceil(count / 2) : count;
          const gap = compact ? Math.min(105, Math.max(55, (h - 105) / Math.max(1, rows - 1)))
            : Math.min(138, (h - 130) / Math.max(1, rows - 1));
          let index = 0;
          for (const n of m.nodes) {
            if (!initialIds.has(n.id)) continue;
            if (!origins.has(n.id)) origins.set(n.id, { x:n.x, y:n.y });
            const o = origins.get(n.id), card = S.els.nodes[n.id];
            const cardW = card.offsetWidth;
            const colX = compact ? (w - 2 * cardW) / 3 + (index % 2) * (cardW + (w - 2 * cardW) / 3) : (w - cardW) / 2;
            const row = compact ? Math.floor(index / 2) : index;
            card.style.left = `${Math.round(colX + (n.x - o.x) + m.pan[0])}px`;
            card.style.top = `${Math.round((compact ? 20 : 42) + row * gap + (n.y - o.y) + m.pan[1])}px`;
            index++;
          }
          S.P.edges(m);
          S.P.measure();
        };
      },
      measure: (base, S) => () => {
        base();
        const m = S.ctx.model;
        S.ctx.update({ ...m, view: { ...m.view, w: Math.max(m.view.w, 2200), h: Math.max(m.view.h, 1000) } });
      },
      locate: (base, S) => (target) => {
        if (target.node && S.els.nodes[target.node]) return env.util.center(S.els.nodes[target.node]);
        if (target.world) {
          const r = S.els.canvas.getBoundingClientRect();
          const cardW = S.els.nodes[S.model.nodes[0]?.id]?.getBoundingClientRect().width || 220;
          return [r.left + Math.max(18, r.width - cardW - 18), r.top + r.height * .55];
        }
        return base(target);
      },
    },
  },
});
