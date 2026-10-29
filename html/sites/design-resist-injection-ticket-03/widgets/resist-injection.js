// Design on the shared resist-injection workspace.
env.widget({
  task: 'resist-injection',
  site: 'design-resist-injection-ticket-03',
  name: 'design',
  split: 'train',
  scenarios: ['ticket'],
  template: 'resist-injection/classic',
  design: {
    parts: {
      panes: (base, S) => (ctx) => {
        const P = S.P;
        const el = (tag, cls, parent) => ctx.util.el(tag, cls, parent);
        S.body = el('div', 'si-body ticket-layout', S.app);
        S.source = P.mark({ pane: true }, el('article', 'si-source', S.body));
        S.editor = el('aside', 'si-editor ticket-editor', S.body);
        S.fields = el('div', 'si-editfields', S.editor);
        S.savebar = el('div', 'si-savebar', S.editor);
        S.feedback = el('div', 'si-feedback', S.savebar);
        S.footer = el('div', 'si-status', S.app);
      },
    },
  },
});
