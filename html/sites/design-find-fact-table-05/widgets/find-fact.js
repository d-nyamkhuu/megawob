// This design compresses dense tables after the shared layout is built so answer fields stay visible.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-table-05',
  name: 'design',
  split: 'train',
  scenarios: ['table'],
  template: 'find-fact/table',
  design: {
    parts: {
      rendered: (base, S) => (ctx, frame, up) => {
        const { work } = frame;
        // Preserve the normal row treatment whenever it fits. Dense seeded tables must
        // leave the answer strip inside the stage rather than clipping its inputs.
        if (ctx.spec.scenario === 'table' && work.scrollHeight > work.clientHeight + 1) {
          const table = work.querySelector('.rl-table');
          const form = work.querySelector('.rl-form');
          const heading = table.closest('.rl-card').querySelector('h3');
          const gap = parseFloat(getComputedStyle(work).rowGap) || 0;
          const available =
            work.clientHeight - form.getBoundingClientRect().height - heading.getBoundingClientRect().height - gap - 6;
          table.style.setProperty('--rl-fit-row', Math.floor(available / table.rows.length) + 'px');
          table.classList.add('rl-fit');
        }
      },
    },
  },
});
