// Design on templates/use-shop/base.js: the base site's use-shop widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-variantpick-03',
  name: 'design',
  split: 'train',
  scenarios: ['variantpick'],
  template: 'use-shop/base',
  design: {
    parts: {
      'shoppingArt': (base, S) => function (view, parent, large = false, product = view.s.products[0]) {
        const { productArt } = S;
        const { ctx, util } = view;
        const a = util.el('div', large ? 'ax-art' : 'ax-mini', parent);
        const hues = { Ocean: 209, Clay: 15, Moss: 95, Ink: 224 };
        const hue = large ? (hues[ctx.model.selections.colour] || product.hue || 209) : 45 + product.id * 62;
        a.innerHTML = productArt(product.name, hue);
        if (large && /shirt/i.test(product.name)) {
          const ink = `hsl(${hue} 31% 49%)`, seam = `hsl(${hue} 20% 32%)`, light = `hsl(${hue} 25% 70%)`;
          a.innerHTML = `<svg viewBox="0 0 240 300" aria-hidden="true" shape-rendering="crispEdges"><path d="M83 25 60 34 25 57 8 91l31 18 18-26-2 169h130l-2-169 18 26 31-18-17-34-35-23-23-9Z" fill="${ink}" stroke="${seam}" stroke-width="4"/><path d="m83 25 37 31 37-31-9 44-28-20-28 20Z" fill="${light}" stroke="${seam}" stroke-width="3"/><path d="M120 56v195M64 94l-3 127m115-127 3 127" fill="none" stroke="${seam}" stroke-width="3"/><path d="M140 125h32v48h-32Z" fill="${light}" fill-opacity=".35" stroke="${seam}" stroke-width="2"/><path d="M144 125v48m24-48v48M18 92l22 13m182-13-22 13M51 211l27 5m84 0 27-5" fill="none" stroke="${seam}" stroke-width="4"/><g fill="${light}" stroke="${seam}" stroke-width="1"><circle cx="126" cy="91" r="3"/><circle cx="126" cy="115" r="3"/><circle cx="126" cy="139" r="3"/><circle cx="126" cy="163" r="3"/><circle cx="126" cy="187" r="3"/><circle cx="126" cy="211" r="3"/></g><path d="M67 37 40 59m133-22 27 22" stroke="${light}" stroke-width="2" fill="none"/></svg>`;
        }
        return a;
      },
      // A product list beside the product page, its options in a column of their own.
      'shoppingProduct': (base, S) => function (view, m) {
        const { productArt, shoppingProductHeading, shoppingProductOptions } = S;
        const { util, s, cash, pane } = view;
        const layout = util.el('div', 'amiga-shop-layout', pane);
        const listing = util.el('div', 'amiga-product-list', layout);
        util.el('div', 'amiga-list-title', listing, 'Products');
        const listBody = util.el('div', 'amiga-product-rows', listing);
        s.products.forEach((item, index) => {
          const row = util.el('div', 'amiga-product-row' + (index === 0 ? ' active' : ''), listBody);
          const thumb = util.el('div', 'amiga-product-thumb', row);
          thumb.innerHTML = productArt(item.name, 45 + item.id * 62);
          const label = util.el('div', 'amiga-row-copy', row);
          util.el('b', '', label, item.name);
          util.el('span', '', label, cash(item.price));
        });
        if (s.products.length < 5) {
          [['Crew Neck Sweater', '$49.00', 211], ['Chinos', '$44.00', 32], ['Jeans', '$42.00', 205], ['T-Shirt', '$24.00', 0]]
            .slice(0, 5 - s.products.length).forEach(([name, price, hue]) => {
              const row = util.el('div', 'amiga-product-row', listBody);
              const thumb = util.el('div', 'amiga-product-thumb', row);
              thumb.innerHTML = productArt(name, hue);
              const label = util.el('div', 'amiga-row-copy', row);
              util.el('b', '', label, name); util.el('span', '', label, price);
            });
        }
        const detail = util.el('div', 'amiga-product-detail', layout);
        const head = shoppingProductHeading(view, m, detail);
        util.el('div', 'amiga-product-description', head, 'Everyday wear. Comfortable and durable.');
        const optionCol = util.el('div', 'amiga-option-column', detail);
        shoppingProductOptions(view, m, optionCol);
        optionCol.querySelector(':scope > .ax-actions').classList.add('amiga-actions');
      },
      'shoppingSummaryHeading': (base, S) => function (view, m, t) {
        const { util, s, cash, summary } = view;
        if (s.scenario === 'variantpick') {
          const p = s.products[0];
          const inspector = util.el('section', 'amiga-inspector', summary);
          util.el('h3', '', inspector, 'Details');
          const values = [['Product', p.name], ['Price', cash(p.price)], ['Size', m.selections.size || '—'],
            ['Colour', m.selections.colour || '—'], ['Material', m.selections.material || '—']];
          values.forEach(([label, value]) => {
            const row = util.el('div', 'amiga-inspector-row', inspector);
            util.el('b', '', row, label); util.el('span', '', row, value);
          });
          util.el('p', 'amiga-inspector-copy', inspector, 'Regular fit. Button-down collar. Machine wash cold.');
        }
        util.el('h3', '', summary, s.scenario === 'returns' ? 'Return summary' : 'Bag summary');
        if (s.scenario === 'variantpick' && !m.picked) {
          const empty = util.el('div', 'amiga-bag-empty', summary);
          util.el('div', 'amiga-bag-icon', empty);
          util.el('span', '', empty, 'Your bag is empty.');
        }
      },
    },
  },
});
