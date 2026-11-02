// Design on choose-option/radio with account setup copy and plan-specific option details.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-radio-08',
  name: 'design',
  split: 'train',
  scenarios: ['radio'],
  template: 'choose-option/widgets',
  design: {
    detailTable: {
      Starter: 'Good for individuals getting started.',
      Pro: 'Additional features for growing teams.',
      Standard: 'Additional features for growing teams.',
      Professional: 'Advanced tools and support.',
      Business: 'Advanced tools and support.',
      Enterprise: 'Custom solutions for large organizations.',
    },
    detailFallback: 'Select the option that fits your needs.',
    parts: {
      heading: (base, S) => (ctx, card) => {
        const { util } = ctx;
        const head = util.el('header', 'ds-email-heading', card);
        util.el('h1', '', head, 'Create Your Account');
        util.el('p', '', head, 'Set up your account to get started.');
      },
      label: (base, S) => (ctx, field) => {
        const { util, spec } = ctx;
        util.el('div', 'fp-label', field, spec.label === 'Subscription' ? 'Subscription Plan' : spec.label);
        util.el('div', 'fp-sub', field, 'Select the plan that fits your needs.');
      },
      emailContent: (base, S) => (ctx, card) => {
        const { util } = ctx;
        const decoys = util.el('section', 'ds-email-content', card);
        util.el('h3', '', decoys, 'Account Details');
        [['Full Name', 'Enter your full name'], ['Email Address', 'you@example.com']].forEach((item) => {
          const label = util.el('label', '', decoys);
          util.el('span', '', label, item[0]);
          const input = util.el('input', '', label);
          input.type = 'text';
          input.placeholder = item[1];
        });
      },
    },
  },
});
