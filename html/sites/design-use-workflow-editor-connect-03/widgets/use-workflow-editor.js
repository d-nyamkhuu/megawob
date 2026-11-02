// Design on use-workflow-editor/editor; defaults reproduce this pilot's reference scaffold.
env.widget({
  task: 'use-workflow-editor',
  site: 'design-use-workflow-editor-connect-03',
  name: 'design',
  split: 'train',
  scenarios: ['connect'],
  template: 'use-workflow-editor/editor',
  design: {
      frameInset: 0, frameRadius: 0, initialZoom: 1,
      fontFamily: 'Arial, Helvetica, sans-serif', gridSize: 20,
      icons: ['webhook', 'document', 'document', 'mail', 'database', 'pause'],
      paths: {
        webhook: 'M9 8a4 4 0 1 1 6-1M10 5l-5 9a4 4 0 1 0 5 5m-3-4 10 0a4 4 0 1 0-1-5m-3-3 5 9M8 18l5-9',
        document: 'M5 2h9l5 5v15H5zM14 2v6h5M8 11h8M8 15h8M8 18h5',
        mail: 'M2 5h20v15H2zM2 6l10 8L22 6',
        database: 'M3 5c0-5 18-5 18 0v14c0 5-18 5-18 0zM3 5c0 5 18 5 18 0M3 10c0 5 18 5 18 0M3 15c0 5 18 5 18 0',
        pause: 'M7 2h10a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4M9 7v10M15 7v10',
        minus: 'M5 12h14', plus: 'M12 5v14M5 12h14',
        fit: 'M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5',
        close: 'M5 5l14 14M19 5 5 19', trash: 'M5 6h14M9 6V3h6v3M7 6v15h10V6',
        undo: 'M8 4 3 9l5 5M3 9h10a6 6 0 0 1 0 12',
        check: 'M4 12l5 5L20 6', more: 'M5 12h1m5 0h1m5 0h1',
        grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
        filter: 'M3 4h18l-7 8v7l-4 2v-9z', record: 'M4 4h16v16H4zM4 9h16M9 9v11',
        play: 'M7 4l14 8-14 8z',
      },
    parts: {
      frame: (base, S) => (ctx) => {
        const app = base(ctx);
        const E = S.els;
        const w = ctx.size.width, h = ctx.size.height - 62;
        const k = Math.min(1.28, (w - 18) / 862, (h - 110) / 450);
        S.zoom = Math.max(.46, k);
        S.fitZoom = S.zoom;
        // Presentation offsets retain the sampled coordinates and all task state.
        const slots = [[18, 236], [254, 236], [496, 156], [714, 156], [496, 334], [714, 334]];
        S.offsets = {};
        ctx.model.nodes.forEach((n, i) => {
          const p = slots[i];
          if (p) S.offsets[n.id] = [p[0] - n.x, p[1] - n.y];
        });
        return app;
      },
      top: () => () => {},
      toolbar: (base, S) => (ctx) => {
        base(ctx);
        const { bar, zoomLabel, undo, del } = S.els;
        bar.querySelector('.af-tabs').remove();
        bar.querySelector('.af-primary').remove();
        undo.style.width = 'auto';
        const reset = bar.querySelector('[aria-label="Reset view"]');
        reset.hidden = true;
        const group = S.P.el('div', 'relay-tools', bar);
        for (const [label, path] of [
          ['Select', 'M6 2v20l5-6 5 7 3-2-5-7h8z'],
          ['Hand tool', 'M8 12V5a2 2 0 0 1 4 0v6-8a2 2 0 0 1 4 0v9-6a2 2 0 0 1 4 0v10c0 5-3 7-7 7-3 0-5-1-7-4L2 14a2 2 0 0 1 3-3l3 3'],
          ['Select area', 'M3 8V3h5M11 3h3M17 3h4v5M21 11v3M21 17v4h-5M13 21h-3M7 21H3v-5M3 13v-3'],
        ]) {
          const b = S.P.button(group, '', () => {
            group.querySelectorAll('button').forEach(x => x.classList.remove('active'));
            b.classList.add('active');
            S.els.canvas.style.cursor = label === 'Hand tool' ? 'grab' : 'default';
          });
          b.title = label; b.setAttribute('aria-label', label);
          const svg = ctx.util.svg('svg', {viewBox:'0 0 24 24', fill:label === 'Select' ? 'currentColor' : 'none', stroke:'currentColor', 'stroke-width':1.6}, b);
          ctx.util.svg('path', {d:path}, svg);
        }
        group.firstChild.classList.add('active');
        bar.prepend(group);
        bar.append(zoomLabel);
        zoomLabel.classList.add('relay-zoom');
        zoomLabel.setAttribute('role', 'button'); zoomLabel.tabIndex = 0;
        zoomLabel.title = 'Reset view';
        zoomLabel.addEventListener('click', () => {
          S.zoom = S.fitZoom;
          S.P.commit({ ...ctx.model, pan:[0,0] });
        });
      },
      node: (base, S) => (ctx, layer, n) => {
        const card = base(ctx, layer, n);
        card.dataset.tone = String(['green', 'blue', 'purple', 'yellow', 'blue', 'green'][ctx.model.nodes.indexOf(n) % 6]);
        card.querySelector('.af-nodefoot').remove();
        const offset = S.offsets[n.id] || [0, 0];
        card.style.translate = `${offset[0]}px ${offset[1]}px`;
        return card;
      },
      point: (base, S) => (n, kind) => {
        const p = base(n, kind), offset = S.offsets[n.id] || [0, 0];
        return [p[0] + offset[0], p[1] + offset[1] - 5];
      },
      locate: (base, S) => (target) => {
        if (target.node && S.els.nodes[target.node]) {
          const r = S.els.nodes[target.node].getBoundingClientRect();
          return [r.left + r.width / 2, r.top + Math.min(22 * S.zoom, r.height / 2)];
        }
        return base(target);
      },
      painted: (base, S) => (ctx, m) => {
        base(ctx, m);
        S.els.zoomLabel.textContent = Math.round(S.zoom / S.fitZoom * 100) + '%';
        const grid = 20 * S.zoom / S.fitZoom;
        S.els.canvas.style.backgroundSize = `${grid}px ${grid}px`;
      },
    },
  },
});
