// This design uses the shared Simon widget without overrides.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-simon-10',
  name: 'design',
  split: 'train',
  scenarios: ['simon'],
  template: 'act-in-time/arena',
  design: { parts: { build: (base, S) => function(ctx, f, up) {
    const view = base(ctx, f, up), main = f.body.querySelector('.ut-main');
    const status = main.querySelector('.ds-phase'), history = main.querySelector('.ds-history');
    history.querySelector('h3').textContent = 'Sequence Progress';
    history.classList.add('ds-progress');
    const dots = ctx.util.el('div', 'ds-progress-dots', history);
    for (let i = 0; i < 4; i++) ctx.util.el('i', i === 0 ? 'active' : '', dots);
    ctx.util.el('div', 'ds-step-label', history, 'Step 1 of 4');
    const copy = ctx.util.el('div', 'ds-watch-copy', status);
    copy.textContent = 'A sequence is playing. Memorize the order.';
    const controls = ctx.util.el('section', 'ds-controls', main);
    ctx.util.el('h3', '', controls, 'Controls');
    const replay = ctx.util.el('button', 'ds-replay', controls, '⟳  Replay');
    replay.type = 'button'; replay.disabled = true;
    const clear = ctx.util.el('button', 'ds-clear', controls, '×  Clear');
    clear.type = 'button'; clear.addEventListener('click', () => up({ presses: [] }));
    const sync = view.sync;
    view.sync = (m) => {
      sync(m); replay.disabled = env.taskDef.helpers.simonPhase(ctx.spec, m.t) === 'show';
      const step = Math.min((m.presses || []).length + 1, ctx.spec.seq.length);
      history.querySelectorAll('.ds-progress-dots i').forEach((dot, i) => dot.classList.toggle('active', i === step - 1));
      history.querySelector('.ds-step-label').textContent = 'Step ' + step + ' of ' + ctx.spec.seq.length;
      if (!status.querySelector('.ds-watch-copy')) ctx.util.el('div', 'ds-watch-copy', status, 'A sequence is playing. Memorize the order.');
    };
    return view;
  } } },
});
