// Design on templates/use-shop/base.js: the base site's use-shop widget for this scenario (it was scaffolded from
// it), with the units this site changed as parts.
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-compare-02',
  name: 'design',
  split: 'train',
  scenarios: ['compare'],
  template: 'use-shop/base',
  design: {
    parts: {
      'shoppingCompare': (base, S) => function (view, m) {
        const { productArt, recommendations, serviceDetails } = S;
        const { ctx, util, s, cash, pane, button } = view;
        util.el('div', 'ax-kicker', pane, 'Backpacks · product comparison');
        util.el('h2', '', pane, 'Backpacks — Compare Products');
        util.el('div', 'ax-muted', pane, `1 - ${s.products.length} of ${s.products.length} products`);
        const table = util.el('table', 'ax-table ax-product-rows', pane);
        const head = util.el('tr', '', util.el('thead', '', table));
        ['Product','Price (USD)','Capacity (L)','Weight (g)','Warranty (Years)','Select'].forEach(x=>util.el('th','',head,x));
        const tbody = util.el('tbody', '', table);
        s.products.forEach((p) => {
          const row=util.el('tr','product-row',tbody), product=util.el('td','product-cell',row);
          util.el('div','ax-pack-art',product).innerHTML=productArt(p.name,40+p.id*64,'pack');
          const info=util.el('div','product-info',product);
          util.el('b','product-name',info,p.name);
          util.el('div','product-maker',info,`by ${p.brand||'TrailGear'}`);
          util.el('div','product-description',info,(['Versatile day-and-overnight pack with ventilated back panel and multiple pockets.','Lightweight pack for weekend trips. Adjustable torso and hip belt.','Rugged and roomy pack with compression straps and hydration sleeve.','Streamlined design for fast and light adventures.'])[p.id%4]);
          util.el('td','',row,cash(p.price));util.el('td','',row,p.capacity+'');util.el('td','',row,p.weight+'');util.el('td','',row,p.warranty+'');
          const sel=util.el('td','selection-cell',row);const b=button(sel,m.selected===p.id?'Selected':'Select',`select:${p.id}`,'ax-chip');b.setAttribute('aria-pressed',String(m.selected===p.id));
          button(sel,m.picked?'Update bag':'Add to Bag','add','as-btn primary ax-row-add',m.selected===null);
        });
        serviceDetails(util, pane, 'About these specifications', 'Capacity is measured in litres. Listed weight is for the empty pack; small variations between production batches are normal. Warranty covers manufacturing defects.');
        recommendations(ctx, pane);
      },
    },
  },
});
