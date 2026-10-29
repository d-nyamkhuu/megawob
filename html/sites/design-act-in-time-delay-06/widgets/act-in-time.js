// Site design on the shared act-in-time/arena template.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-delay-06',
  name: 'design',
  split: 'train',
  scenarios: ['delay'],
  template: 'act-in-time/arena',
  design: {
    process: false,
    waitText: 'Waiting…',
    parts: {
      interval:
        () =>
        (ctx, { els, pad, W }) => {
          if (els.length === 2) {
            const boxes = els.map((el) => el.getBoundingClientRect());
            const gap = 12;
            if (
              boxes[0].left < boxes[1].right + gap &&
              boxes[1].left < boxes[0].right + gap &&
              boxes[0].top < boxes[1].bottom + gap &&
              boxes[1].top < boxes[0].bottom + gap
            ) {
              const order = [0, 1].sort((a, b) => boxes[a].left - boxes[b].left);
              const width = boxes[0].width + boxes[1].width + gap;
              const center = els.reduce((sum, el, i) => sum + parseFloat(el.style.left) + boxes[i].width / 2, 0) / 2;
              let left = Math.max(pad, Math.min(W - pad - width, center - width / 2));
              for (const i of order) {
                els[i].style.left = Math.round(left) + 'px';
                left += boxes[i].width + gap;
              }
            }
          }
        },
      delayState: () => (ctx, card) => {
        const { util } = ctx;
        const progress = util.el('div', 'ut-delay-progress', card);
        const fill = util.el('i', '', progress);
        const pct = util.el('span', '', progress, '0%');
        const note = util.el('div', 'ut-delay-note', card, 'The task button will be enabled on the task clock.');
        return { fill, pct, note };
      },
      delaySync:
        () =>
        (ctx, { extra }, m, ready) => {
          extra.fill.style.width = ready ? '100%' : '0%';
          extra.pct.textContent = ready ? '100%' : '0%';
          extra.note.textContent = ready
            ? 'The task button is enabled.'
            : 'The task button will be enabled on the task clock.';
        },
    },
  },
});
