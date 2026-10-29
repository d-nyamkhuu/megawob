// Design on templates/use-shop/base.js: the base site's use-shop widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
(function () {
const assetRoot = new URL('../assets/', document.currentScript.src);
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-variantpick-05',
  name: 'design',
  split: 'train',
  scenarios: ['variantpick'],
  template: 'use-shop/base',
  design: { parts: {
    shoppingProductHeading: (_base) => function (view, m, parent = view.pane) {
      const { util, s, cash } = view;
      const head = util.el('div', 'lux-product-heading', parent);
      const photo = util.el('div', 'lux-product-photo', head);
      const img = util.el('img', '', photo);
      img.src = new URL('crew-neck.webp', assetRoot).href;
      img.alt = s.products[0].name;
      const info = util.el('div', 'lux-product-copy', head);
      util.el('h1', '', info, s.products[0].name);
      util.el('div', 'lux-price', info, cash(s.products[0].price));
      util.el('p', 'lux-description', info, 'A modern essential made from premium fabrics. Soft, breathable and easy to wear, with a timeless fit for everyday comfort.');
      return head;
    },
    shoppingProduct: (base) => function (view, m) {
      base(view, m);
      const { util, pane } = view;
      const head = pane.querySelector('.lux-product-heading');
      const copy = head.querySelector('.lux-product-copy');
      const options = util.el('div', 'lux-options', copy);
      for (const field of [...pane.querySelectorAll(':scope > .ax-options')]) options.append(field);
      const stock = pane.querySelector(':scope > .ax-stock');
      const actions = pane.querySelector(':scope > .ax-actions');
      const order = util.el('div', 'lux-order', copy);
      util.el('label', 'lux-quantity-label', order, 'Quantity');
      order.append(actions);
      order.append(stock);
      const features = util.el('div', 'lux-features', copy);
      const icons = [
        '<path d="M2 5h15v15H2zM17 10h6l4 5v5h-10M20 10v6h7"/><circle cx="7" cy="21" r="3"/><circle cx="22" cy="21" r="3"/>',
        '<path d="M26 3C8 2 1 9 5 20c10 7 20-1 21-17ZM1 28 20 9M10 12v9h9"/>',
        '<path d="M26 12A12 12 0 0 0 5 7L3 3v7h7M3 18a12 12 0 0 0 21 5"/>',
        '<path d="m15 2 11 4v9c0 7-6 12-11 14C9 26 4 22 4 15V6zM9 15l4 4 8-9"/>'
      ];
      ['Free shipping\non orders over $75', 'Sustainably sourced\nfabrics', 'Easy returns\nwithin 30 days', '2 year quality\nguarantee'].forEach((text, i) => {
        const feature = util.el('div', 'lux-feature', features);
        util.el('span', 'lux-feature-icon', feature).innerHTML = '<svg viewBox="0 0 30 32" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">' + icons[i] + '</svg>';
        util.el('span', '', feature, text);
      });
      const related = pane.querySelector('.as-recommendations');
      related.classList.add('lux-related');
      related.querySelector('h3').textContent = 'You might also like';
      const cards = [...related.querySelectorAll('.as-rec-item')];
      cards.forEach((card, i) => {
        const art = card.querySelector('.as-rec-art');
        art.replaceChildren();
        const img = util.el('img', '', art); img.src = new URL('related-' + i + '.webp', assetRoot).href; img.alt = '';
        const meta = util.el('div', 'lux-related-copy', card);
        meta.append(card.querySelector('b'));
        card.querySelector(':scope > span').remove();
        util.el('div', '', meta, ['$36', '$40', '$44'][i]);
        const dots = util.el('div', 'lux-related-dots', meta);
        ['#29384c', '#b4b4b1', '#e1d7c7', '#7d826d'].forEach(c => util.el('i', '', dots).style.background = c);
      });
      const fourth = util.el('div', 'as-rec-item', related.querySelector('.as-rec-grid'));
      const art = util.el('div', 'as-rec-art', fourth);
      const img = util.el('img', '', art); img.src = new URL('related-3.webp', assetRoot).href; img.alt = '';
      const meta = util.el('div', 'lux-related-copy', fourth);
      util.el('b', '', meta, 'Men’s Pocket T-Shirt'); util.el('div', '', meta, '$42');
      const dots = util.el('div', 'lux-related-dots', meta);
      ['#29384c', '#626953', '#e1d7c7', '#8faecb'].forEach(c => util.el('i', '', dots).style.background = c);
      const extras = util.el('div', 'lux-product-details', copy);
      for (const el of [...pane.children]) if (el !== head && el !== related) extras.append(el);
      pane.append(related);
    },
    shoppingToolbar: (base) => function (view) { base(view); view.toolbar.hidden = true; },
    shoppingPainted: (base) => function (view, m) {
      base(view, m);
      const badge = document.querySelector('.lux-bag i');
      if (badge) badge.textContent = m.picked ? String(m.picked.qty) : '0';
      view.summary.classList.add('lux-bag-panel');
      const close = view.util.el('button', 'lux-close-bag', view.summary, 'Close bag');
      close.addEventListener('click', () => view.shell.classList.remove('bag-open'));
    },
    buildShopping: (base) => function (ctx, body) {
      const result = base(ctx, body);
      const bag = document.querySelector('.lux-bag');
      bag.setAttribute('role', 'button'); bag.setAttribute('tabindex', '0'); bag.setAttribute('aria-label', 'View shopping bag');
      const toggle = () => body.querySelector('.ax-shell').classList.toggle('bag-open');
      bag.addEventListener('click', toggle);
      bag.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
      return result;
    },
  } },
});
})();
