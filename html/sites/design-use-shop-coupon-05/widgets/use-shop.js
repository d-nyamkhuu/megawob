// Keep the shared coupon renderer, anchors and handlers. The render/sync wrapper
// formats its existing DOM into the Aero bag and summary panes before returning.
  function decorate(stage, u) {
    const shell = stage.querySelector('.ax-shell');
    if (!shell) return;
    const main = shell.querySelector('.ax-main');
    const summary = shell.querySelector('.ax-summary');
    if (!main || !summary) return;
    if (!shell.classList.contains('aero-shell')) {
      shell.classList.add('aero-shell');
      const rail = u.el('aside', 'aero-rail', shell);
      const departments = u.el('section', 'aero-departments', rail);
      u.el('h2', '', departments, 'Shop by Department');
      for (const name of ['Featured', 'Electronics', 'Home & Kitchen', 'Apparel', 'Shoes', 'Beauty & Health', 'Sports & Outdoors', 'Toys & Games', 'Books, Movies & Music', 'Office Supplies', 'Home Improvement', 'Gifts & Seasonal']) u.el('div', 'aero-department', departments, name);
      const featured = u.el('section', 'aero-featured', rail);
      u.el('h2', '', featured, 'Featured Offers');
      const list = u.el('div', 'aero-featured-list', featured);
      [['Up to 30% Off', 'Home Essentials', 'Spring Savings'], ['Save 20%', 'Select Headphones', 'Better Sound, Less'], ['10% Off', 'Kitchen Appliances', 'Cook More at Home'], ['Up to 25% Off', 'Outdoor Gear', 'Get Outside']].forEach((offer, i) => {
        const row = u.el('div', 'aero-featured-row', list);
        const art = u.el('span', 'aero-catalog aero-art-' + i, row);
        art.setAttribute('aria-hidden', 'true');
        const text = u.el('div', '', row);
        u.el('b', '', text, offer[0]); u.el('span', '', text, offer[1]); u.el('small', '', text, offer[2]);
      });
      const hero = u.el('section', 'aero-hero', shell);
      const copy = u.el('div', 'aero-hero-copy', hero);
      u.el('h1', '', copy, 'Spring Savings');
      u.el('p', '', copy, 'Fresh finds for a brighter home');
      const badge = u.el('div', 'aero-sale', hero);
      u.el('span', '', badge, 'Up to'); u.el('strong', '', badge, '30% OFF'); u.el('span', '', badge, 'Home Essentials');
    }
    const heading = main.querySelector(':scope > h2');
    if (heading && !heading.querySelector('.aero-count')) {
      heading.textContent = 'Your Shopping Bag';
      u.el('span', 'aero-count', heading, main.querySelectorAll('.ax-line').length + ' items');
      const columns = u.el('div', 'aero-columns', main);
      for (const text of ['Item', 'Price', 'Quantity', 'Total']) u.el('span', '', columns, text);
      heading.after(columns);
    }
    const form = main.querySelector(':scope > .ax-form');
    if (form) {
      const title = form.previousElementSibling;
      const offerTitle = form.nextElementSibling;
      const orders = [...main.querySelectorAll(':scope > .ax-order')];
      let coupon = summary.querySelector('.aero-coupon');
      if (!coupon) coupon = u.el('section', 'aero-coupon', summary);
      if (title && title.tagName === 'H3') { title.textContent = 'Have a Coupon Code?'; coupon.append(title); }
      coupon.append(form);
      let offers = summary.querySelector('.aero-offers');
      if (!offers) offers = u.el('section', 'aero-offers', summary);
      if (offerTitle && offerTitle.tagName === 'H3') { offerTitle.textContent = 'Available Offers'; offers.append(offerTitle); }
      for (const order of orders) offers.append(order);
      const extra = summary.querySelector('.aero-summary-extra') || u.el('div', 'aero-summary-extra', summary);
      for (const item of [...summary.children]) if (item.matches('button, .ax-muted, .ax-summary-benefits, details')) extra.append(item);
    }
    const summaryHeading = summary.querySelector(':scope > h3');
    if (summaryHeading && summaryHeading.textContent !== 'Order Summary') summaryHeading.textContent = 'Order Summary';
    for (const line of main.querySelectorAll('.ax-line')) {
      if (line.dataset.aeroLine) continue;
      line.dataset.aeroLine = '1';
      const name = line.querySelector('.ax-line-top b');
      const priceSource = line.querySelector('.ax-line-top .ax-muted');
      const price = priceSource && priceSource.textContent.match(/\$[\d,.]+/);
      const quantitySource = line.querySelector(':scope > .ax-muted');
      const quantity = quantitySource && quantitySource.textContent.match(/Quantity\s*(\d+)/i);
      u.el('span', 'aero-price', line, price ? price[0] : '');
      u.el('span', 'aero-quantity', line, quantity ? quantity[1] : '1');
      u.el('span', 'aero-line-total', line, quantitySource ? (quantitySource.textContent.match(/\$[\d,.]+/) || price || [''])[0] : (price || [''])[0]);
      const art = line.querySelector('.ax-mini');
      if (art && name) {
        const title = name.textContent.toLowerCase();
        const index = /backpack|rucksack/.test(title) ? 3 : /bottle|flask/.test(title) ? 4 : /shoe|sneaker|runner/.test(title) ? 5 : /vest|jacket|shirt/.test(title) ? 6 : /skateboard/.test(title) ? 7 : /headphone/.test(title) ? 1 : /blender/.test(title) ? 2 : null;
        if (index !== null) { art.classList.add('aero-catalog', 'aero-art-' + index); art.textContent = ''; }
        else {
          const outdoor = /croquet/.test(title) ? 0 : /sunglass|eyewear/.test(title) ? 1 : /glove/.test(title) ? 2 : /lock|cable/.test(title) ? 3 : /pull.up|doorway/.test(title) ? 4 : /gaiter/.test(title) ? 5 : /vacuum/.test(title) ? 6 : /plier/.test(title) ? 7 : /tent/.test(title) ? 8 : /sleeping/.test(title) ? 9 : /helmet/.test(title) ? 10 : 11;
          art.classList.add('aero-outdoor'); art.textContent = '';
          art.style.backgroundPosition = (outdoor % 4) * 100 / 3 + '% ' + Math.floor(outdoor / 4) * 50 + '%';
        }
      }
    }
  }

window.__installAeroShop = function () {
  const widget = env.widgetDef;
  if (widget.render.__aeroWrapped) return;
  const baseRender = widget.render;
  const render = function (ctx) {
    const result = baseRender.apply(this, arguments);
    decorate(ctx.stage, ctx.util);
    if (result && typeof result.sync === 'function') {
      const sync = result.sync;
      result.sync = function () {
        const value = sync.apply(this, arguments);
        decorate(ctx.stage, ctx.util);
        return value;
      };
    }
    return result;
  };
  render.__aeroWrapped = true;
  widget.render = render;
};
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-coupon-05',
  name: 'design',
  split: 'train',
  scenarios: ['coupon'],
  template: 'use-shop/base',
  design: {},
});
