// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-autofill-03',
  name: 'design',
  split: 'train',
  scenarios: ['autofill'],
  template: 'protect-privacy/classic',
  design: {
    parts: {
      summary: () => () => {},
      view: (_base, S) => (m) => {
        const P = S.P;
        const app = S.app;
        const main = P.element('div', 'sp-main', app);
        const co = P.element('div', 'sp-co', main);
        const intro = P.element('div', 'checkout-intro', co);
        P.element('div', 'checkout-title', intro, 'Checkout');
        const steps = P.element('div', 'checkout-steps', intro);
        for (const [n, label] of [['1', 'Shipping Address'], ['2', 'Shipping Method'], ['3', 'Payment'], ['4', 'Review Order']]) {
          const item = P.element('div', `checkout-step${n === '1' ? ' current' : ''}`, steps);
          P.element('span', 'checkout-step-num', item, n);
          P.element('span', 'checkout-step-label', item, label);
          if (n !== '4') P.element('i', 'checkout-step-rule', item);
        }
        const section = P.element('section', 'checkout-form-wrap', co);
        P.element('div', 'checkout-section-title', section, 'Shipping Address');
        P.form(section, m);
      },
    },
  },
});
