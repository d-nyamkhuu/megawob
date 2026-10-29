// This design uses the inline answer row and adds the reference page's decorative form controls.
env.widget({
  task: 'type-text',
  site: 'design-type-text-single-03',
  name: 'design',
  split: 'train',
  scenarios: ['single'],
  scrollable: (spec) => !!spec.long,
  template: 'type-text/fields',
  design: {
    layout: 'inline',
    title: 'Your Answer',
    parts: {
      finish: (base) => (ctx, card) => {
        base(ctx, card);
        const grid = card.querySelector('.ft-grid');
        const fake = (label, text, cls, before) => {
          const l = document.createElement('div');
          l.className = 'ds-flab';
          l.textContent = label;
          const b = document.createElement('div');
          b.className = 'ds-fake ' + cls;
          b.textContent = text;
          l.setAttribute('aria-hidden', 'true');
          b.setAttribute('aria-hidden', 'true');
          if (before) {
            grid.insertBefore(l, grid.firstChild);
            grid.insertBefore(b, l.nextSibling);
          } else {
            grid.append(l, b);
          }
        };
        fake('Title', 'Optional', '', true);
        fake('Due date', 'Apr 28, 2025', 'val w1 date');
        fake('Priority', 'Normal', 'val w2 sel');
        fake('Notes', 'Optional', 'ta');
        card.style.width = '100%';
        // Keep the reference spacing where it fits; compact decorative rows only when needed.
        let excess = Math.max(0, card.getBoundingClientRect().height - ctx.size.height);
        if (excess) {
          const gap = parseFloat(getComputedStyle(grid).rowGap);
          const reduction = Math.min(Math.max(0, gap - 8), excess / 4);
          grid.style.rowGap = `${gap - reduction}px`;
          excess -= reduction * 4;
          if (excess) {
            const notes = grid.querySelector('.ds-fake.ta');
            notes.style.setProperty(
              'height',
              `${Math.max(32, notes.getBoundingClientRect().height - excess)}px`,
              'important',
            );
          }
        }
      },
    },
  },
});
