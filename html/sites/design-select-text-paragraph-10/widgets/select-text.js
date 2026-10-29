// Keeps the original font and room sizing, aside state, and paragraph-count footer.
env.widget({
  task: 'select-text',
  site: 'design-select-text-paragraph-10',
  name: 'design',
  split: 'train',
  scenarios: ['paragraph'],
  traits: { pane: true, marks: true, emptyStart: true },
  template: 'select-text/paragraphs',
  design: {
    fontMax: 29,
    fontDivisor: 41,
    clearSelection: true,
    parts: {
      font: () => (ctx) => Math.min(29, Math.round(ctx.size.width / 41)),
      begin: (base) => (ctx) => {
        base(ctx);
        document.querySelector('.aside .tab')?.classList.add('active');
      },
      card: (base) => (ctx, el) => {
        base(ctx, el);
        el.style.setProperty('--paragraph-gap', `${Math.min(44, 132 / ctx.spec.paragraphs.length)}px`);
      },
      paragraphsBefore: (base) => (ctx) => {
        base(ctx);
        document.querySelector('.footer-copy').textContent = `${ctx.spec.paragraphs.length} paragraphs`;
      },
      room: () => (ctx) => Math.max(120, ctx.stage.clientHeight - 12),
    },
  },
});
