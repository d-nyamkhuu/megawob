// Keep the shared pad handlers and locate targets; add Vista status presentation.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-simon-11',
  name: 'design',
  split: 'train',
  scenarios: ['simon'],
  template: 'act-in-time/arena',
  design: {
    parts: {
      build: (base, S) => (ctx, frame, update) => {
        const view = base(ctx, frame, update);
        const { util, spec } = ctx;
        const main = frame.body.querySelector('.ut-main');
        const row = main.querySelector('.ds-pads');
        row.style.setProperty('--pad-rows', String(Math.ceil(spec.pads.length / 2)));
        const caption = main.querySelector('.ds-phase');
        const sequence = util.el('section', 'ds-sequence', main);
        sequence.appendChild(caption);
        const progress = util.el('div', 'ds-progress', sequence);
        progress.setAttribute('aria-label', 'Sequence progress');
        const dots = spec.seq.map(() => util.el('i', '', progress));
        const lines = document.querySelectorAll('.ds-readout-line');
        if (lines[1]) lines[1].textContent = 'Sequence length: ' + spec.seq.length;
        let state = null;
        if (lines[2]) {
          lines[2].textContent = 'Status: ';
          state = util.el('strong', 'ds-readout-state', lines[2]);
        }
        return {
          locate: view.locate,
          sync(model) {
            view.sync(model);
            const watching = env.taskDef.helpers.simonPhase(spec, model.t) === 'show';
            caption.textContent = watching ? 'Watch the sequence…' : 'Repeat the sequence';
            if (state) state.textContent = watching ? 'Watch…' : 'Your turn';
            dots.forEach((dot, i) => {
              dot.dataset.done = String(!watching && i < model.presses.length);
            });
            progress.setAttribute('aria-label', model.presses.length + ' of ' + spec.seq.length + ' pads entered');
          },
        };
      },
    },
  },
});
