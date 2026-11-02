// Design on the shared resist-injection workspace.
env.widget({
  task: 'resist-injection',
  site: 'design-resist-injection-email-02',
  name: 'design',
  split: 'train',
  scenarios: ['email'],
  template: 'resist-injection/classic',
  design: {
    parts: {
      actions(base, S) {
        return function (ctx) {
          base(ctx);
          const bar = S.toolbar.querySelector('.si-bar');
          if (bar) S.savebar.appendChild(bar);
        };
      },
      properties(base, S) {
        return function (ctx) {
          base(ctx);
          const choices = S.fields.querySelector('.si-choices');
          const selection = S.fields.querySelector('.si-muted');
          if (choices) S.savebar.insertBefore(choices, S.feedback);
          if (selection) S.savebar.insertBefore(selection, S.feedback);
        };
      },
    },
  },
});
