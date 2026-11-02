// Adds account preference details, a subscription label, and compact radio columns.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-radio-11',
  name: 'design',
  split: 'train',
  scenarios: ['radio'],
  template: 'choose-option/widgets',
  design: {
    parts: {
      label: (base, S) => (ctx, field) =>
        ctx.util.el(
          'div',
          'fp-label',
          field,
          ctx.spec.label === 'Subscription' ? 'Select a subscription plan:' : ctx.spec.label,
        ),
      choiceDetail: (base, S) => (ctx, option) => {
        const descriptions = {
          Starter: 'Essential tools for small teams',
          Standard: 'Everyday tools for growing teams',
          Professional: 'Advanced features and more capacity',
          Business: 'Expanded controls and team management',
          Enterprise: 'Full platform access and dedicated support',
        };
        return (
          (ctx.spec.details && ctx.spec.details[option]) ||
          descriptions[option] ||
          (ctx.spec.label === 'Backup schedule'
            ? 'Automatic backup frequency'
            : 'Available account preference')
        );
      },
      rendered: (base, S) => (ctx, card) => {
        const group = card.querySelector('.fp-group');
        if (group) {
          const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
          const count = ctx.spec.options.length;
          const available = group.getBoundingClientRect().height;
          const minimumRow = (count > 6 ? 2.9 : 2.1) * rem;
          const columns = Math.min(
            count,
            Math.max(1, Math.ceil((count * minimumRow) / Math.max(1, available))),
          );
          group.style.setProperty('--fp-choice-columns', columns);
          group.classList.toggle('fp-dense', columns > 1);
        }
      },
    },
  },
});
