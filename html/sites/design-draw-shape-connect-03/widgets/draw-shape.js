// Design on templates/draw-shape/base.js: the base site's draw-shape widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'draw-shape',
  site: 'design-draw-shape-connect-03',
  name: 'design',
  split: 'train',
  scenarios: ['connect'],
  template: 'draw-shape/base',
  design: {
    parts: {
      'place': (base) => function place(root, ctx, rng) {
        // Keep the portrait treatment inside the stage, including its frame and hint.
        const board = root.querySelector('.dw-board');
        const svg = board.querySelector('svg');
        const tall = ctx.size.height > 675 ? 1.6 : ctx.size.height > 585 ? 1.2 : 1.05;
        const narrow = ctx.size.height > 585 ? 0.82 : 0.78;
        board.style.padding = `${12 * tall}px ${12 * narrow}px`;
        svg.setAttribute('preserveAspectRatio', 'none');
        svg.setAttribute('width', Number(svg.getAttribute('width')) * narrow);
        svg.setAttribute('height', Number(svg.getAttribute('height')) * tall);
        const initial = root.getBoundingClientRect();
        const height = Number(svg.getAttribute('height'));
        const reserve = initial.height - height;
        svg.setAttribute('height', Math.min(height, ctx.size.height - reserve - 24));
        base(root, ctx, rng);
        const rect = root.getBoundingClientRect();
        root.style.left = '0px';
        root.style.top = '0px';
        root.style.transform = `translate(${(ctx.size.width - rect.width) / 2}px, ${(ctx.size.height - rect.height) / 2}px)`;
      },
      'buildConnect': (base, S) => function buildConnect(B) {
        const { drawGrid, env } = S;
        const { ctx, svg, px, W, H, scale } = B;
        const { util, rng, spec } = ctx;
        const NODE = env.taskDef.helpers.NODE;
        drawGrid(util, rng, svg, W, H, rng.pick(['dots', 'plain', 'lines']));
        const defs = util.svg('defs', {}, svg);
        const mk = util.svg('marker', { id: 'dw-arrow', viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto' }, defs);
        util.svg('path', { d: 'M0,0 L10,5 L0,10 z', style: 'fill: color-mix(in srgb, var(--fg) 60%, transparent)' }, mk);
        const edgesG = util.svg('g', {}, svg);
        const nodesG = util.svg('g', {}, svg);
        const delsG = util.svg('g', { class: 'dw-edge' }, svg); // remove handles above the nodes
        const rubber = util.svg('line', { class: 'dw-rubber', visibility: 'hidden' }, svg);
        const xs = spec.nodes.map((n) => n.x), ys = spec.nodes.map((n) => n.y);
        const range = (a) => [Math.min(...a), Math.max(...a)];
        const [minX, maxX] = range(xs), [minY, maxY] = range(ys);
        const nodeAt = (i) => {
          const n = spec.nodes[i], b = spec.board;
          const x = maxX > minX ? (n.x - minX) / (maxX - minX) : 0.5;
          const y = maxY > minY ? (n.y - minY) / (maxY - minY) : 0.5;
          return [b.w * (0.14 + 0.72 * x), b.h * (0.12 + 0.76 * y)];
        };
        const portOf = (i, kind) => [nodeAt(i)[0] + (kind === 'out' ? 25 / scale : -25 / scale), nodeAt(i)[1]];
        const rx = rng.pick([4, 8, 14]);
        const ports = {};
        spec.nodes.forEach((n, i) => {
          const g = util.svg('g', { class: 'dw-node' }, nodesG);
          g.dataset.node = String(i);
          g.dataset.role = 'node';
          const [cx, cy] = px(nodeAt(i));
          util.svg('circle', { cx, cy, r: 15, class: 'node-body' }, g);
          util.svg('text', { x: cx, y: cy - 27 }, g).textContent = n.label;
          for (const kind of ['in', 'out']) {
            const [qx, qy] = px(portOf(i, kind));
            const c = util.svg('circle', { cx: qx, cy: qy, r: 7, class: 'dw-port' }, g);
            c.dataset.role = 'port';
            c.dataset.node = String(i);
            c.dataset.kind = kind;
            ports[`${i}:${kind}`] = c;
            env.ui.track(c, {
              start(p, e) { e.stopPropagation(); rubber.setAttribute('x1', qx); rubber.setAttribute('y1', qy); },
              move(p) {
                const r = svg.getBoundingClientRect();
                rubber.setAttribute('x2', (p.x - r.left) * W / r.width);
                rubber.setAttribute('y2', (p.y - r.top) * H / r.height);
                rubber.setAttribute('visibility', 'visible');
              },
              end(p) {
                rubber.setAttribute('visibility', 'hidden');
                const hit = document.elementsFromPoint(p.x, p.y).find((el) => el.closest && el.closest('.dw-node'));
                if (!hit) return;
                const j = Number(hit.closest('.dw-node').dataset.node);
                if (j === i) return;
                const e = kind === 'out' ? [i, j] : [j, i];
                const m = ctx.model;
                if (m.edges.some((f) => f[0] === e[0] && f[1] === e[1])) return;
                ctx.log('connect', { from: e[0], to: e[1] });
                B.up({ ...m, edges: m.edges.concat([e]) });
              },
            }, 'port');
          }
        });
        let dels = {};
        function sync(m) {
          edgesG.replaceChildren();
          delsG.replaceChildren();
          dels = {};
          for (const [i, j] of m.edges) {
            const a = px(portOf(i, 'out'));
            const b = px(portOf(j, 'in'));
            // Horizontal tangents (node-editor style); backward links bend less so they stay on the board.
            const k = b[0] > a[0] ? Math.max(40, (b[0] - a[0]) / 2) : 60;
            const c1 = [a[0] + Math.min(k, (W - a[0]) * 1.2), a[1]];
            const c2 = [b[0] - Math.min(k, b[0] * 1.2), b[1]];
            const g = util.svg('g', { class: 'dw-edge' }, edgesG);
            util.svg('path', { class: 'e', d: `M${a[0]},${a[1]} C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${b[0]},${b[1]}`, 'marker-end': 'url(#dw-arrow)' }, g);
            const mid = [0.125 * a[0] + 0.375 * c1[0] + 0.375 * c2[0] + 0.125 * b[0], 0.125 * a[1] + 0.375 * c1[1] + 0.375 * c2[1] + 0.125 * b[1]];
            const del = util.svg('g', { class: 'del' }, delsG);
            del.dataset.role = 'remove-edge';
            util.svg('circle', { cx: mid[0], cy: mid[1], r: 8 }, del);
            util.svg('path', { d: `M${mid[0] - 3.5},${mid[1] - 3.5} L${mid[0] + 3.5},${mid[1] + 3.5} M${mid[0] + 3.5},${mid[1] - 3.5} L${mid[0] - 3.5},${mid[1] + 3.5}` }, del);
            del.addEventListener('click', () => {
              ctx.log('disconnect', { from: i, to: j });
              B.up({ ...ctx.model, edges: ctx.model.edges.filter((e) => !(e[0] === i && e[1] === j)) });
            });
            dels[`${i}>${j}`] = del;
          }
        }
        B.hint(rng.pick(['Drag from a node\'s right-hand dot to another node to connect them. Click × on an arrow to remove it.',
          'Connections run from the out port (right) to the in port (left). Hover an arrow to remove it.']));
        return {
          sync,
          locate(t) {
            if (t.port) return env.util.center(ports[`${t.port[0]}:${t.port[1]}`]);
            if (t.edgeDel) {
              const el = dels[`${t.edgeDel[0]}>${t.edgeDel[1]}`];
              return el ? env.util.center(el.querySelector('circle')) : null;
            }
            return null;
          },
        };
      },
    },
  },
});
