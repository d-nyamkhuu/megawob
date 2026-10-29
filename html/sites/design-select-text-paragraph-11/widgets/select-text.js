// Keeps this site's larger paragraph font and Lisa spacing on the shared paragraph template.
env.widget({
  task: 'select-text',
  site: 'design-select-text-paragraph-11',
  name: 'design',
  split: 'train',
  scenarios: ['paragraph'],
  traits: { pane: true, marks: true },
  template: 'select-text/paragraphs',
  design: {
    fontMax: 32,
    fontDivisor: 39,
    parts: {
      fit: (base, S) => (ctx) => {
        base(ctx);
        S.textEl.style.setProperty('--lisa-gap', ctx.spec.paragraphs.length > 3 ? '.8em' : '1.36em');
      },
    },
  },
});
