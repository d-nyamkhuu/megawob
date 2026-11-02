// This design adds the ticker to the order form and keeps Buy visible under long instructions.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-stock-06',
  name: 'design',
  split: 'train',
  scenarios: ['stock'],
  template: 'act-in-time/arena',
  design: {
    symbolField: 'Symbol',
    quantity: '',
    parts: {
      stockSync: (base, S) => (ctx, layout, m) => {
        base(ctx, layout, m);
        const { root, buy } = layout;
        const note = document.querySelector('.ds-header-note .ds-instruction, .ds-toast .ds-instruction');
        if (note) {
          const stageEl = root.closest('.ds-stage');
          const fits = () => buy.getBoundingClientRect().bottom <= stageEl.getBoundingClientRect().bottom - 4;
          let size = parseFloat(getComputedStyle(note).fontSize);
          while (!fits() && size > 24) {
            size = Math.max(24, size * 0.94);
            note.style.fontSize = size + 'px';
          }
        }
      },
    },
  },
});
