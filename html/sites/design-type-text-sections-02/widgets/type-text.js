// Preserve the reference behavior and reserve room for the side-by-side sections.
env.widget({
  task: 'type-text',
  site: 'design-type-text-sections-02',
  name: 'design',
  split: 'train',
  scenarios: ['sections'],
  template: 'type-text/base',
  design: {
    parts: {
      buildSections: (base) => (ctx, look, card) => {
        base(ctx, look, card);
        if (ctx.spec.panes === 'tabs') return;
        // The desktop design places accordion bodies beside their headers.
        // Reserve their full height so the save row stays below every section.
        let height = 0;
        for (const body of card.querySelectorAll('.ft-acc-b')) {
          const hidden = body.hidden;
          body.hidden = false;
          height = Math.max(height, body.getBoundingClientRect().height);
          body.hidden = hidden;
        }
        const space = ctx.util.el('div', 'ds-section-space', card);
        space.style.gridColumn = '2';
        space.style.gridRow = '2';
        space.style.height = `${Math.ceil(height)}px`;
      },
    },
  },
});
