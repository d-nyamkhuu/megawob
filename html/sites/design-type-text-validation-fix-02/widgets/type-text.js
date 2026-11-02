// Design on templates/type-text/base.js: use the reference form's fitting and interaction logic.
env.widget({
  task: 'type-text',
  site: 'design-type-text-validation-fix-02',
  name: 'design',
  split: 'train',
  scenarios: ['validation-fix'],
  template: 'type-text/base',
  design: {
    parts: {
      build: base => (ctx, look) => base(ctx, {
        ...look,
        ruled: ctx.size.height < 480 ? false : look.ruled,
        subtitle: ctx.size.height < 480 ? '' : look.subtitle,
        vars: {
          ...look.vars,
          '--ft-pad': `${Math.min(parseFloat(look.vars['--ft-pad']), ctx.size.height < 480 ? 6 : 26)}px`,
          '--ft-gap': `${Math.min(parseFloat(look.vars['--ft-gap']), ctx.size.height < 480 ? 4 : 16)}px`,
          '--ft-h': `${Math.min(parseFloat(look.vars['--ft-h']), ctx.size.height < 480 ? 28 : 40)}px`,
          '--ft-r': '4px',
        },
      }),
    },
  },
});
