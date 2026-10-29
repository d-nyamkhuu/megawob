// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-roach-02',
  name: 'design',
  split: 'train',
  scenarios: ['roach'],
  template: 'avoid-dark-patterns/browser',
  design: {
    font: '16px/1.4 "Courier New", Courier, monospace',
    windowRadius: '2px',
    windowShadow: '8px 8px 0 #080907',
    geometry: { margin: 0, minWidth: 360, minHeight: 360, widthBreakpoint: 900, widthMin: 880, widthMax: 1080, widthScale: [1, 1], heightBreakpoint: 560, heightMin: 540, heightMax: 660, heightScale: [1, 1], sideBreakpoint: 900, sideNarrow: 240, sideRange: [255, 290] },
    colors: { '--b': '#ffdf25', '--bs': '#fff8d8', '--bfg': '#080907', '--good': '#2f7d32', '--warn': '#a25b00', '--bad': '#c62828' },
    parts: {
      main: (base, S) => (sc, body, model) => {
        const main = base(sc, body, model);
        main.classList.add('bp-subscription');
        const heading = main.querySelector('.sd-h');
        const details = main.querySelector('.sd-kv');
        const action = main.querySelector('.sd-b');
        if (!heading || !details || !action) return main;

        const card = S.ctx.util.el('div', 'bp-plan-card', main);
        const icon = S.ctx.util.el('div', 'bp-plan-icon', card);
        icon.setAttribute('aria-hidden', 'true');
        const info = S.ctx.util.el('div', 'bp-plan-info', card);
        const planName = S.ctx.util.el('strong', 'bp-plan-name', info, S.app.name);
        S.ctx.util.el('span', 'bp-plan-caption', info, 'Unlimited reading. Any book. Any time.');
        info.append(details);
        const benefits = S.ctx.util.el('div', 'bp-plan-benefits', info);
        for (const label of ['Unlimited access to our full library', 'Read on any device', 'New releases every week', 'Cancel anytime']) {
          S.ctx.util.el('div', 'bp-plan-benefit', benefits, label);
        }
        const price = S.ctx.util.el('div', 'bp-plan-action', card);
        const planValue = details.querySelector('dd');
        const priceText = planValue && planValue.textContent.match(/[$€£]\s?[\d,.]+(?:\s*\/\s*(?:month|mo))?/i);
        S.ctx.util.el('strong', 'bp-plan-price', price, priceText ? priceText[0].replace('/month', ' / month') : (planValue ? planValue.textContent : 'Membership'));
        S.ctx.util.el('span', 'bp-plan-next', price, 'Next billing date');
        S.ctx.util.el('span', 'bp-plan-date', price, 'Apr 12, 2019');
        S.ctx.util.el('span', 'bp-plan-status', price, 'Active');
        price.append(action);
        heading.after(card);
        return main;
      },
    },
  },
});
