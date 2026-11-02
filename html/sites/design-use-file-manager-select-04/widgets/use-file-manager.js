// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-select-04',
  name: 'design',
  split: 'train',
  scenarios: ['select'],
  template: 'use-file-manager/explorer',
  design: {
    windowRadius: 0,
    margin: 0,
    parts: {
      fit: (base, S) => (ctx) => {
        base(ctx);
        S.geo = { left: 0, top: 0, winW: ctx.size.width, winH: ctx.size.height };
      },
      tileSize: (base, S) => (model, groups) => {
        base(model, groups);
        // Keep the grouped rows, adding columns only when a dense folder needs them.
        const { paneH } = S.geo;
        const available = paneH - 20 - groups.length * (S.spec.grouped ? 26 : 6);
        let cols = 1;
        let rows;
        let height;
        do {
          rows = Math.max(1, groups.reduce((n, g) => n + Math.ceil(g.ids.length / cols), 0));
          height = Math.floor((available - Math.max(0, rows - groups.length) * 4) / rows);
          if (height >= 24 || cols >= S.spec.cols) break;
          cols++;
        } while (true);
        S.industrialColumns = cols;
        S.els.pane.classList.add('compact');
        const tileH = Math.min(34, height);
        return { tileH, iconPx: Math.min(24, tileH - 8), lines: 1 };
      },
      group: (base, S) => (model, group) => {
        const box = base(model, group);
        if (S.spec.view !== 'list') {
          box.style.gridTemplateColumns = `repeat(${S.industrialColumns}, minmax(0, 1fr))`;
        }
        return box;
      },
      tile: (base) => (model, id, height, iconSize, lines, box) => {
        const tile = base(model, id, height, iconSize, lines, box);
        Object.assign(tile.style, {
          flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',
          gap: '10px', padding: '3px 8px', borderRadius: '0',
        });
        Object.assign(tile._label.style, {
          textAlign: 'left', display: 'block', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
        });
        return tile;
      },
    },
  },
});
