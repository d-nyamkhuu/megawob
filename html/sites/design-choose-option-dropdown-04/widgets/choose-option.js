// Replaces the default heading and decoys with this site's task form rows.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-dropdown-04',
  name: 'design',
  split: 'train',
  scenarios: ['dropdown'],
  template: 'choose-option/widgets',
  design: {
    details: false,
    parts: {
      heading: (base, S) => (ctx, card) => {
        const { util, spec } = ctx;
        util.el('div', 'fp-note', card, spec.note);
        const fake = (lab, kind, text) => {
          const row = util.el('div', 'rz-row', card);
          util.el('span', 'rz-lab', row, lab);
          util.el('div', 'rz-fake ' + kind, row, text);
        };
        fake('Title', 'inp', 'Prepare Q2 budget report');
        fake('Description', 'inp area', 'Compile departmental figures and prepare a summary\nfor review.');
      },
      decorated: (base, S) => (ctx, card) => {
        const { util, size } = ctx;
        const fake = (lab, kind, text, width) => {
          const row = util.el('div', 'rz-row', card);
          util.el('span', 'rz-lab', row, lab);
          const field = util.el('div', 'rz-fake ' + kind, row, text);
          if (width) field.style.width = width;
          if (kind === 'sel') {
            const caret = util.el('span', 'rz-car', field);
            caret.innerHTML = '<svg viewBox="0 0 14 14"><path d="M2 4.5l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2"/></svg>';
          }
        };
        fake('Due date', 'inp', 'Apr 24, 2015', '44%');
        fake('Priority', 'sel', 'Medium', '44%');
        fake('Status', 'sel', 'In Progress', '44%');
        const paddingTop = parseFloat(getComputedStyle(ctx.stage).paddingTop) || 0;
        const unit = Math.min(card.offsetHeight / 64, Math.max(0, size.height - paddingTop - 2) / 64);
        card.style.setProperty('--fp-unit', unit + 'px');
      },
    },
  },
});
