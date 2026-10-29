// Notebook listbox design: fit whole-pixel rows to the stage and use compact scroll controls.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-listbox-08',
  name: 'design',
  split: 'train',
  scenarios: ['listbox'],
  template: 'choose-option/widgets',
  design: {
    integralRows: false,
    parts: {
      geometry: (_base) => (ctx, controls, sampledRowH) => {
        const wrap = controls.field.parentElement.parentElement;
        const available = Math.min(126, ctx.size.height - wrap.offsetTop - 14 - 2);
        const rowH = Math.min(sampledRowH, Math.max(1, Math.floor(available / ctx.spec.rows)));
        return { rowH, H: ctx.spec.rows * rowH, border: 2 };
      },
      rail: (_base) => (ctx, controls) => {
        const { util } = ctx;
        const parent = util.el('div', 'fp-scroll-controls', controls.lb);
        const up = util.el('button', 'fp-scroll-arrow up', parent);
        up.type = 'button';
        up.setAttribute('aria-label', 'Scroll up');
        const track = util.el('div', 'fp-track', parent);
        track.dataset.role = 'scrollbar';
        const thumb = util.el('div', 'fp-thumb', track);
        thumb.dataset.role = 'thumb';
        const down = util.el('button', 'fp-scroll-arrow down', parent);
        down.type = 'button';
        down.setAttribute('aria-label', 'Scroll down');
        return { track, thumb, up, down };
      },
      arrowsReady: (_base) => (ctx, controls) => {
        controls.up.addEventListener('click', () => {
          controls.list.scrollTop -= controls.rowH;
          controls.lbx.refresh();
          controls.mirror(controls.lbx.scrollIndex());
        });
        controls.down.addEventListener('click', () => {
          controls.list.scrollTop += controls.rowH;
          controls.lbx.refresh();
          controls.mirror(controls.lbx.scrollIndex());
        });
      },
    },
  },
});
