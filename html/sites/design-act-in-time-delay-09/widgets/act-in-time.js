// Adds the interval-stage class and the live countdown/details readout.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-delay-09',
  name: 'design',
  split: 'train',
  scenarios: ['delay'],
  template: 'act-in-time/arena',
  design: {
    parts: {
      main: (base) => (ctx, main) => {
        base(ctx, main);
        if (ctx.spec.mode === 'interval') main.classList.add('ut-main-interval');
      },
      delaySync: (base) => (ctx, layout, m, ready) => {
        base(ctx, layout, m, ready);
        const { card } = layout;
        const durationMs = Math.max(
          0,
          Number(
            ctx.spec.ready ?? ctx.spec.delay ?? ctx.spec.wait ?? ctx.spec.duration ?? ctx.spec.waitMs ?? ctx.spec.delayMs ?? ctx.spec.after ?? 15000,
          ) || 15000,
        );
        const remainingMs = Math.max(0, durationMs - m.t);
        const remainingSeconds = Math.ceil(remainingMs / 1000);
        const clock = `${String(Math.floor(remainingSeconds / 60)).padStart(2, '0')}:${String(remainingSeconds % 60).padStart(2, '0')}`;
        card.style.setProperty('--delay-clock', `"${clock}"`);
        card.style.setProperty(
          '--delay-progress',
          `${durationMs ? Math.min(100, 20 + Math.max(0, (m.t / durationMs) * 80)) : 100}%`,
        );
        const details = document.querySelector('.ds-content');
        if (details) {
          const quote = (value) => `"${String(value).replaceAll('"', '\\"')}"`;
          const durationSeconds = Math.ceil(durationMs / 1000);
          const durationLabel = `${durationSeconds} seconds`;
          const durationClock = `${String(Math.floor(durationSeconds / 60)).padStart(2, '0')}:${String(durationSeconds % 60).padStart(2, '0')}`;
          details.style.setProperty('--detail-mode', quote(ctx.spec.context.title));
          details.style.setProperty('--detail-duration', quote(durationLabel));
          details.style.setProperty('--detail-status', quote(env.taskDef.helpers.delayReady(ctx.spec, m.t) ? 'Ready' : 'Waiting'));
          details.style.setProperty('--detail-automation', quote(`Enables button at ${durationClock}`));
        }
      },
    },
  },
});
