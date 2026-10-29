// Keeps this design's modifier note, omits the tile column variable, and compresses tall grids before fitting.
env.widget({
  task: 'read-figure',
  site: 'design-read-figure-shades-08',
  name: 'design',
  split: 'train',
  scenarios: ['shades'],
  template: 'read-figure/shades',
  design: {
    columnVar: null,
    parts: {
      shades: (base, S) => (ctx, body, up, B) => {
        const selectionNote = document.querySelector('.notes li');
        if (selectionNote && ctx.spec.select === 'modifier')
          selectionNote.textContent = 'Ctrl+click any tile to select or deselect it.';
        return base(ctx, body, up, B);
      },
      beforeFit: (base, S) => (ctx, panel, body) => {
        const { spec, size } = ctx;
        if (spec.scenario !== 'shades') return base(ctx, panel, body);
        const grid = body.querySelector('.up-tiles');
        const tiles = [...grid.children];
        const height = panel.getBoundingClientRect().height;
        if (height > size.height - 8 && tiles.length) {
          const rowCount = new Set(tiles.map((tile) => tile.getBoundingClientRect().top)).size;
          const tileHeight = tiles[0].getBoundingClientRect().height;
          const fittedHeight = Math.max(1, Math.floor(tileHeight - (height - size.height + 8) / rowCount));
          grid.style.setProperty('--tile-height', `${fittedHeight}px`);
          grid.classList.add('compact');
        }
        return base(ctx, panel, body);
      },
    },
  },
});
