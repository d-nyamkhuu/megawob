// This design capitalizes the chase metric labels and ignores pointer events before real motion.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-chase-04',
  name: 'design',
  split: 'train',
  scenarios: ['chase'],
  template: 'act-in-time/arena',
  design: {
    elapsedLabel: 'Time Elapsed',
    insideLabel: 'Pointer Inside (Dwell)',
    clearView: true,
    clearOnRender: true,
    parts: {
      hover: () => (ctx, b, up) => {
        let pointerMoved = false;
        const markPointerMove = () => {
          pointerMoved = true;
        };
        b.svg.addEventListener('pointermove', markPointerMove, true);
        const hov = env.ui.hover(b.svg, {
          clock: ctx.clock,
          label: 'board',
          onMove: ({ x, y }) => {
            if (!pointerMoved) return;
            const p = b.toBoard([x, y]).map((v) => Math.round(v * 10000) / 10000);
            up({ p });
          },
          onLeave: () => {
            if (pointerMoved) up({ p: null });
          },
        });
        return {
          detach() {
            b.svg.removeEventListener('pointermove', markPointerMove, true);
            hov.detach();
          },
        };
      },
    },
  },
});
