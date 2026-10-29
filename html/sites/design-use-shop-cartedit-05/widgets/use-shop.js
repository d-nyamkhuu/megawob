// Design on templates/use-shop/base.js: the base site's use-shop widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-cartedit-05',
  name: 'design',
  split: 'train',
  scenarios: ['cartedit'],
  template: 'use-shop/base',
  design: { parts: {
    framePlace: (base, S) => (app, options) => {
      Object.assign(app.style, {left:'0px',right:'0px',top:'0px',bottom:'0px',width:'100%',margin:'0px'});
    },
    shoppingLinesHeading: (base, S) => (view, m) => {
      const {util, pane, s, cash} = view;
      const total = S.F().shopTotals(m, s);
      util.el('h2', 'bag-title', pane, 'Your Bag');
      util.el('div', 'bag-subtotal', pane, `${total.count} items · Subtotal: ${cash(total.subtotal)}`);
      const head = util.el('div', 'bag-columns', pane);
      for (const x of ['Item','Price','Quantity','Total','']) util.el('span', '', head, x);
    },
    shoppingLine: (base, S) => (view, m, l, status) => {
      const {util, s, pane, cash, art, qty, link} = view;
      const p = s.products[l.id];
      const row = util.el('div', 'bag-line ' + status, pane);
      const item = util.el('div', 'bag-product', row);
      art(item, false, p);
      const info = util.el('div', 'bag-info', item);
      util.el('b', '', info, p.name);
      util.el('div', 'bag-detail', info, p.sku || 'Home & living');
      util.el('div', 'bag-stock', info, status === 'cart' ? 'In stock' : status === 'saved' ? 'Saved' : 'Removed');
      util.el('div', 'bag-price', row, cash(p.price));
      const q = util.el('div', 'bag-quantity', row);
      if (status !== 'removed') qty(q, l.qty, `line:${l.id}`);
      util.el('div', 'bag-total', row, cash(p.price * l.qty));
      const actions = util.el('div', 'bag-actions', row);
      if (status === 'cart') {
        for (const [label, to] of S.SHOPPING_CART_ACTIONS) {
          const action = link(actions, label, `line:${l.id}:${to}`);
          if (to === 'saved') {
            const icon = util.el('span', 'bookmark-icon', action);
            icon.innerHTML = '<svg viewBox="0 0 18 24" aria-hidden="true"><path d="M2 2h14v20l-7-5-7 5Z"/></svg>';
            action.prepend(icon);
          }
        }
      } else link(actions, status === 'saved' ? 'Move to bag' : 'Undo remove', `line:${l.id}:cart`);
    },
    shoppingCartFooter: (base, S) => () => {},
    shoppingSummary: (base, S) => (view, m) => {
      const {util, summary, s} = view;
      util.el('h2', '', summary, 'Shopping Bag Help');
      const tips = [
        ['Change quantity','Click the + or − buttons, or type a number in the quantity box.'],
        ['Remove an item','Click Remove to take an item out of your bag.'],
        ['Save for later','Click Save for Later to move an item to your saved list. You can add it back anytime.'],
        ['Other options','Continue shopping, or review your bag before checkout.']
      ];
      for (const [heading, copy] of tips) { util.el('h3', '', summary, heading); util.el('p', '', summary, copy); }
      const saved = util.el('div', 'saved-area', summary);
      util.el('h2', '', saved, 'Saved for Later');
      util.el('p', '', saved, 'Items you save from your bag will appear here.');
      const entries = m.lines.filter(l => l.status === 'saved');
      if (entries.length) for (const line of entries) util.el('div', 'saved-name', saved, s.products[line.id].name);
      else {
        const icon = util.el('div', 'saved-icon', saved);
        icon.innerHTML = '<svg viewBox="0 0 62 78" aria-hidden="true"><path d="M8 5h46v66L31 54 8 71Z"/></svg>';
        util.el('div', 'saved-empty', saved, 'No items saved yet.');
      }
    },
  } },
});
