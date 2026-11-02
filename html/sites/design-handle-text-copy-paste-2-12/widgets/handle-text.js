// Keep this site's 4 px inset around the template's usable editor stage.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-copy-paste-2-12',
  name: 'design',
  split: 'train',
  scenarios: ['copy-paste-2'],
  template: 'handle-text/editor',
  design: {
    dockAnswer: false,
    parts: {
      stageBox: (base, S) => (ctx) => ({
        x: 0,
        y: 0,
        w: ctx.size.width - 4,
        h: ctx.size.height - 4,
      }),
      rendered: (base, S) => (ctx, view) => {
        base(ctx, view);
        const answer = view.card.querySelector('.ut-fieldrow');
        const taskNote = document.querySelector('.instruction');
        if (answer && taskNote && !taskNote.hidden) {
          answer.classList.add('has-instruction');
          answer.insertBefore(taskNote, answer.firstChild);
        }
      },
    },
  },
});
