// Design on the change-settings/preferences template; defaults reproduce the reference scaffold.
env.widget({
  task: 'change-settings',
  site: 'design-change-settings-search-04',
  name: 'design',
  split: 'train',
  scenarios: ['search'],
  template: 'change-settings/preferences',
  design: {
    widthMax: 980,
    longWidthMin: 760,
    parts: {
      navigation(base, S) {
        return (ctx, body) => {
          const tabs = ctx.util.el('nav', 'sp-tabs', body);
          for (const section of ctx.spec.sections) {
            const b = S.P.tab(ctx, tabs, section);
            b.addEventListener('click', () => S.P.update(ctx, env.taskDef.helpers.setTab(ctx.model, section.id)));
            S.els.tabEls[section.id] = b;
          }
        };
      },
    },
  },
});
