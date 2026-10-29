// Design on the shared resist-injection workspace.
env.widget({
  task: 'resist-injection',
  site: 'design-resist-injection-email-04',
  name: 'design',
  split: 'train',
  scenarios: ['email'],
  template: 'resist-injection/classic',
  design: {
    parts: {
      styles: (base, S) => function (ctx) {
        base(ctx);
        ctx.css('minimal-mail-rows', `
          .si-app { display:grid; grid-template-columns:minmax(0,1fr); grid-template-rows:minmax(0,1fr) auto; }
          .si-app .si-body { grid-row:1; }
          .si-app .si-toolbar { grid-row:2; }
        `);
      },
    },
  },
});
