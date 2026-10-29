// Stationery listbox: fills the stage height and uses triangular scroll arrows.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-listbox-12',
  name: 'design',
  split: 'train',
  scenarios: ['listbox'],
  template: 'choose-option/widgets',
  design: {
    integralRows: false,
    arrowUp: '▲',
    parts: {
      geometry: (base) => (ctx, controls, sampledRowH) => {
        const label = controls.field.querySelector('.fp-label');
        const available = ctx.stage.clientHeight - (label ? label.offsetHeight : 0) - 22;
        const rowH = Math.max(sampledRowH, Math.floor(available / ctx.spec.rows));
        return { rowH, H: ctx.spec.rows * rowH, border: 2 };
      },
      rail: (base) => (ctx, controls) => {
        const rail = base(ctx, controls);
        rail.down.remove();
        rail.down = null;
        return rail;
      },
      arrowsReady: (base) => (ctx, controls) => {
        const down = ctx.util.el('button', 'fp-arrow', controls.track.parentElement, '▼');
        down.type = 'button';
        down.setAttribute('aria-label', 'Scroll down');
        controls.down = down;
        base(ctx, controls);
      },
    },
  },
});
