// Preserve the answer status and decorative pointer unique to this center design.
env.widget({
  task: 'click-point',
  site: 'design-click-point-center-04',
  name: 'design',
  split: 'train',
  scenarios: ['center'],
  template: 'click-point/board',
  design: {
    clear: true,
    parts: {
      readout: () => (point) => {
        const status = document.querySelector('.answer-status');
        if (status) status.textContent = point ? 'Point selected.' : 'No answer yet.';
      },
      built: (base, S) => (ctx, { wrap }) => {
        const pointer = S.ctx.util.svg('svg', { class: 'wb-pointer', viewBox: '0 0 30 44', 'aria-hidden': 'true' }, ctx.stage);
        S.ctx.util.svg('path', {
          d: 'M2 2V36L10 28L17 41L23 37L16 25H28Z',
          fill: '#000',
          stroke: '#fff',
          'stroke-width': 2,
          'stroke-linejoin': 'miter',
        }, pointer);
      },
    },
  },
});
