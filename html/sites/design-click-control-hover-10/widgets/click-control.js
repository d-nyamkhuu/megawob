// Design: use the site's blue hover fill and describe the seeded target in its page frame.
env.widget({
  task: 'click-control',
  site: 'design-click-control-hover-10',
  name: 'design',
  split: 'train',
  scenarios: ['hover'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    hoverFill: { green: '#2f9e44', blue: '#306bef', red: '#e03131' },
    parts: {
      rendered: () => (ctx) => {
        const details = document.querySelector('.details .db');
        if (details) {
          const rows = details.querySelectorAll('p');
          rows[0].lastChild.textContent = ctx.spec.color[0].toUpperCase() + ctx.spec.color.slice(1) + ' square';
          rows[1].lastChild.textContent = (ctx.spec.need / 1000) + ' seconds (total)';
        }
        const movementNote = document.querySelector('.para p');
        if (movementNote) movementNote.textContent = `The ${ctx.spec.color} square will move to different positions within the box. Keep your mouse over it as it moves.`;
      },
    },
  },
});
