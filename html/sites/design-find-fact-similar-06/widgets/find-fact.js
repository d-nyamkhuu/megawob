// Adds an inline source sentence and a footer Clear button instead of a briefing block.
env.widget({
  task: 'find-fact',
  site: 'design-find-fact-similar-06',
  name: 'design',
  split: 'train',
  scenarios: ['similar'],
  template: 'find-fact/similar',
  design: {
    briefSelector: null,
    parts: {
      framed: (base, S) => (ctx, frame, up) => {
        base(ctx, frame, up);
        const { app, work } = frame;
        const note = ctx.util.el('p', 'ds-source-note', app,
          'Choose all the words that mean the same or a similar thing as ' + ctx.spec.given.join(', ') + '.');
        app.insertBefore(note, work);
      },
      rendered: (base, S) => (ctx, frame, up) => {
        base(ctx, frame, up);
        const clear = ctx.util.el('button', 'ds-clear', document.querySelector('.ds-footer'), 'Clear');
        clear.type = 'button';
        clear.addEventListener('click', () => {
          up({ values: [] });
          S.view.sync(ctx.model);
        });
      },
    },
  },
});
