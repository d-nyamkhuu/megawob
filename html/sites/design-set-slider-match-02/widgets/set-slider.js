// Keep the template's controls and seeded draws; fit the mixer rows to the stage.
env.widget({
  task: 'set-slider',
  site: 'design-set-slider-match-02',
  name: 'design',
  split: 'train',
  scenarios: ['match'],
  template: 'set-slider/base',
  design: {
    parts: {
      renderPlain: (base) => function (ctx, look) {
        const controls = base(ctx, look);
        const grid = controls[0].anchor.closest('.slc-grid');
        if (!grid) return controls;
        const { width, height } = ctx.size;
        const small = width <= 877.2;
        Object.assign(grid.style, {
          position: 'absolute',
          left: small ? '3%' : '4.2%',
          right: small ? '3%' : '4.5%',
          display: 'grid',
          gridTemplateColumns: small ? '12% minmax(0,1fr) 13%' : '12% minmax(0,1fr) 14%',
          columnGap: small ? '1%' : '1.2%',
          alignItems: 'center',
        });
        const rows = controls.length;
        const rowHeight = Math.max(
          ...controls.map(control => control.anchor.offsetHeight),
          ...Array.from(grid.querySelectorAll('.slc-readout'), el => el.offsetHeight)
        );
        const preferredGap = height < 555 ? 18 : small ? 24 : Math.max(30, Math.min(58, width * .05472));
        const bottom = height - 32;
        const top = Math.min(height * .585, bottom - rows * rowHeight - Math.max(0, rows - 1) * 8);
        const gap = rows > 1 ? Math.max(0, Math.min(preferredGap, (bottom - top - rows * rowHeight) / (rows - 1))) : 0;
        grid.style.top = top + 'px';
        grid.style.rowGap = gap + 'px';
        // Repaint after sizing so each thumb uses its final track geometry.
        controls.forEach((control, i) => control.set(ctx.model.values[i]));
        return controls;
      },
    },
  },
});
