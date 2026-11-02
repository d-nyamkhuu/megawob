// Design on the protect-privacy/classic template.
env.widget({
  task: 'protect-privacy',
  site: 'design-protect-privacy-autofill-05',
  name: 'design',
  split: 'train',
  scenarios: ['autofill'],
  template: 'protect-privacy/classic',
  design: {
    parts: {
      fit: (base, S) => (ctx) => {
        const g = base(ctx); // Keep the template's seeded size and alignment draws.
        S.pineSize = ctx.size;
        return { ...g, winW: Math.min(g.fullW, ctx.size.width - 28), winH: Math.min(g.fullH, ctx.size.height - 34), ax: 'left' };
      },
      view: (base, S) => (m) => {
        const P = S.P;
        const app = S.app;
        // The native storefront supplies its own title and navigation frame.
        for (const node of app.parentElement.children) {
          if (node.classList.contains('sp-tabs') || node.classList.contains('sp-bar')) node.style.display = 'none';
        }
        const height = S.pineSize.height;
        const compact = height < 650;
        const main = P.element('div', 'sp-main pine-main', app);
        main.style.minHeight = '0';
        const content = P.element('div', 'pine-checkout', main);
        const head = P.element('div', 'pine-form-head', content);
        P.element('span', 'pine-cart-icon', head, '');
        P.element('h1', '', head, 'Delivery Address');
        const summary = P.element('div', 'pine-summary', head);
        P.element('span', 'pine-summary-cart', summary, '');
        P.element('span', '', summary, '2 items');
        P.element('i', '', summary, '');
        P.element('span', '', summary, '$48.00');
        const pane = P.element('section', 'pine-form-pane', content);
        pane.style.minHeight = '0';
        const co = P.element('div', 'sp-co pine-co', pane);
        Object.assign(co.style, { padding: '0', display: 'flex', flexDirection: 'column' });
        P.form(co, m);
        // Fit the template's controls within the space left by the storefront.
        // These styles are applied during render, before the window is anchored.
        const card = co.querySelector('.sp-card');
        Object.assign(card.style, { flex: '1', minHeight: '0', margin: '0', padding: compact ? '0 4px' : '0 2px', display: 'flex', flexDirection: 'column', border: '0', background: 'transparent' });
        const heading = card.querySelector('.sp-h2');
        if (heading) heading.style.display = 'none';
        const grid = card.querySelector('.sp-grid');
        Object.assign(grid.style, { flex: 'none', height: `${Math.min(100, S.spec.fields.length * 18.75)}%`, minHeight: '0', display: 'grid', gridTemplateColumns: '1fr', gridTemplateRows: `repeat(${S.spec.fields.length}, minmax(0, 1fr))`, gap: compact ? '5px' : '12px', marginTop: '0' });
        for (const field of grid.children) {
          Object.assign(field.style, { minHeight: '0', display: 'flex', flexDirection: 'column' });
          const label = field.querySelector('label');
          if (label) Object.assign(label.style, { flex: 'none', fontSize: compact ? '15px' : '22px', fontWeight: '400', marginBottom: compact ? '3px' : '4px' });
          const input = field.querySelector('.sp-in');
          if (input) Object.assign(input.style, { flex: '1', minHeight: '22px', height: '0', maxHeight: '50px', fontSize: compact ? '16px' : '21px' });
        }
        const button = card.querySelector('[data-k="af-submit"]');
        if (button) {
          Object.assign(button.parentElement.style, { flex: 'none', marginTop: '4px', justifyContent: 'flex-end' });
          Object.assign(button.style, { height: compact ? '30px' : '40px', padding: compact ? '0 12px' : '0 20px', fontSize: compact ? '14px' : '17px' });
        }
      },
    },
  },
});
