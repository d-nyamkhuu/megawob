// Design on the shared resist-injection workspace.
env.widget({
  task: 'resist-injection',
  site: 'design-resist-injection-doc-03',
  name: 'design',
  split: 'train',
  scenarios: ['doc'],
  template: 'resist-injection/classic',
  design: {
    navScenarios: ['doc'],
    navThreshold: 600,
    parts: {
      panes(base) { return (ctx) => base(ctx); },
      sourceDoc(base, S) { return (ctx) => {
        base(ctx);
        const bar = S.ctx.util.el('div', 'lisa-docbar', S.source);
        S.ctx.util.el('strong', '', bar, S.spec.sourceTitle);
        S.ctx.util.el('span', '', bar, S.spec.day);
        const paper = S.source.querySelector('.si-paper');
        if (paper) paper.classList.add('lisa-paper');
        S.source.insertBefore(bar, S.source.firstChild);
      }; },
    },
  },
});
