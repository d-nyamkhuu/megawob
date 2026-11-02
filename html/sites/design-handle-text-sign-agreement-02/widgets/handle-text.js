// Adds the agreement acknowledgment and preserves this site's touch-gated scroll restore.
env.widget({
  task: 'handle-text',
  site: 'design-handle-text-sign-agreement-02',
  name: 'design',
  split: 'train',
  scenarios: ['sign-agreement'],
  template: 'handle-text/editor',
  design: {
    signScrollMode: 'touched',
    deferSignRestore: true,
    parts: {
      signAcknowledgment: (base, S) => (ctx, parent) => {
        ctx.util.el(
          'p',
          'agreement-ack',
          parent,
          'By entering your name below, you acknowledge that you have read and agree to be bound by this Agreement.',
        );
      },
    },
  },
  // find-in-page 'page' mode: the document is a long page that scrolls as a whole.
  scrollable: (spec) => spec.scenario === 'find' && spec.mode === 'page',
});
