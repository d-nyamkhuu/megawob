// Keep the market renderer and its anchors; add a read-only product inspector.
let shopDock = null;
const shopAssets = new URL('../assets/', document.currentScript.src).href;
// Keep the ad builders (and their random draws and click handlers) while giving
// their output a compact home beneath the inspector's product information.
const shopAdvertisement = (base) => function (...args) {
  const parents = args.filter(a => a && a.nodeType === 1);
  const previous = new Set(parents.flatMap(p => Array.from(p.children)));
  const result = base(...args);
  if (result && result.nodeType === 1) result.classList.add('shop-sponsored');
  for (const parent of parents) for (const child of parent.children) {
    if (!previous.has(child)) child.classList.add('shop-sponsored');
  }
  return result;
};
env.widget({
  task: 'use-shop',
  site: 'design-use-shop-checkout-05',
  name: 'design',
  split: 'train',
  scenarios: ['checkout'],
  template: 'use-shop/base',
  design: {
    widget: 'market',
    parts: {
      adLeader: shopAdvertisement,
      adCard: shopAdvertisement,
      productArt: (base) => function (name, hue, kind) {
        const original = base(name, hue, kind);
        const text = String(name).toLowerCase();
        const photos = [['pacifier', 'pacifier',355,285],['bottle', 'bottles',120,89],['bib', 'bibs',120,86],['teddy|plush', 'bear',120,90],['blanket', 'blanket',120,82],['monitor', 'monitor',120,81]];
        const match = photos.find(p => new RegExp(p[0]).test(text));
        if (match) return `<svg viewBox="0 0 ${match[2]} ${match[3]}" aria-hidden="true"><image href="${shopAssets}product-${match[1]}.webp" width="${match[2]}" height="${match[3]}" preserveAspectRatio="xMidYMid slice"/></svg>`;
        const electronics = [/door.*lock|keypad/,/remote control/,/medication.*clock|reminder.*clock/,/speaker|radio/,/flashlight|torch/,/usb|charging cable/,/weigh|scale/,/pill|organizer/,/blood pressure/,/thermometer/,/power bank/,/mouse/,/keyboard/,/earbud/,/sanitizer/,/hand soap/];
        const electronic = electronics.findIndex(re => re.test(text));
        if (electronic >= 0) return `<svg viewBox="0 0 256 256" aria-hidden="true"><image href="${shopAssets}electronics-${electronic}.webp" width="256" height="256"/></svg>`;
        const tiles = [/bike|bicycle/,/batter/,/sorting|shape.*cube/,/headphone|headset/,/stacking.*ring/,/toy car|race car|toy truck/,/bear|plush/,/wooden.*puzzle|jigsaw|building blocks/,/thermometer/,/first.aid|bandage|medical/,/toothpaste/,/toothbrush/,/diaper/,/wipe|tissue/,/sippy|feeding cup/,/towel|bedding|sheet set/];
        const index = tiles.findIndex(re => re.test(text));
        if (index >= 0) return `<svg viewBox="0 0 256 256" aria-hidden="true"><image href="${shopAssets}catalog-${index}.webp" width="256" height="256"/></svg>`;
        const extra = [/cargo.*net/,/novel|book|paperback|hardcover/,/sink caddy/,/air hockey/,/resistance.*band/,/wide.brim|sun hat/,/romper|onesie/,/^$/, /building block/,/fire truck/,/water bottle|flask/,/tote/,/saucepan|pot|pan set/,/alarm clock/,/cotton.*towel/,/backpack/];
        const other = extra.findIndex(re => re.test(text));
        return `<svg viewBox="0 0 256 256" aria-hidden="true"><image href="${shopAssets}catalog-extra-${other < 0 ? 7 : other}.webp" width="256" height="256"/></svg>`;
      },
      // Mirror the template's cart-list scrolling for the internal shop panes.
      where: (base) => function (element, what) {
        const list = element && (element.closest('.co-grid, .shop-categories') || element.closest('.co-page'));
        if (list) {
          const row = element.getBoundingClientRect();
          const pane = list.getBoundingClientRect();
          if (row.top < pane.top) list.scrollTop += row.top - pane.top;
          else if (row.bottom > pane.bottom) list.scrollTop += row.bottom - pane.bottom;
        }
        return base(element, what);
      },
      'market.render': (base) => function (ctx) {
        const result = base(ctx);
        const { el } = ctx.util;
        const app = ctx.stage.querySelector('.as-app');
        if (!app) return result;
        const inspector = el('aside', 'shop-inspector', app);
        el('h2', 'ins-heading', inspector, 'Product Details');
        const content = el('div', 'ins-content', inspector);
        const photo = el('div', 'ins-photo', content);
        const name = el('h3', 'ins-name', content);
        const price = el('div', 'ins-price', content);
        const description = el('p', 'ins-description', content);
        const attributes = el('dl', 'ins-attributes', content);
        const sponsors = el('section', 'shop-sponsors', content);
        el('h4', '', sponsors, 'Sponsored links');
        const cache = new Map();
        const refresh = () => {
          // This design scrolls results inside the window instead of the page.
          const page = app.querySelector('.co-page');
          if (page) {
            page.style.minHeight = '0';
            page.style.overflow = 'auto';
            const height = page.parentElement.clientHeight;
            page.classList.toggle('co-compact', ctx.model.page === 'checkout' && height < 400);
            page.classList.toggle('co-tight', ctx.model.page === 'checkout' && height < 340);
          }
          const filters = app.querySelector('.co-filters');
          for (const ad of app.querySelectorAll('.shop-sponsored, .mk-lead, .mk-side')) {
            if (!sponsors.contains(ad)) sponsors.appendChild(ad);
          }
          if (filters && !filters.querySelector('.shop-categories')) {
            const categories = el('div', 'shop-categories');
            filters.querySelector('.co-fh').after(categories);
            for (const choice of filters.querySelectorAll('.co-check')) categories.appendChild(choice);
            const sideAd = filters.querySelector('.mk-side');
            if (sideAd) {
              sideAd.style.flex = 'none';
              categories.appendChild(sideAd);
            }
          }
          for (const grid of app.querySelectorAll('.co-grid')) {
            grid.parentElement.classList.add('shop-results');
          }
          for (const card of app.querySelectorAll('.co-card')) {
            const title = card.querySelector('.co-name');
            const product = ctx.spec.products.find(p => title && p.name === title.textContent);
            if (!product) continue;
            const thumb = card.querySelector('.co-thumb');
            if (thumb) cache.set(product.id, thumb.cloneNode(true));
            const step = card.querySelector('.co-step');
            if (step) step.setAttribute('aria-label', 'Quantity');
            const info = card.querySelector('.co-info');
            if (info && !info.querySelector('.shop-row-description')) {
              const descriptions = [
                [/pacifier/i, '2 soft silicone pacifiers with carrying case. BPA-free. 0 – 18 months.'],
                [/bottle/i, '3 bottles with anti-colic design. BPA-free. 4 oz each.'],
                [/bib/i, 'Soft, absorbent cotton bibs. Machine washable.'],
                [/teddy|plush/i, 'Classic soft teddy bear. 12 inch.'],
                [/blanket/i, 'Cozy fleece blanket. 30" x 40".'],
                [/monitor/i, 'Clear sound and long range.'],
                [/bike/i, 'Lightweight balance bike for little riders.'],
                [/batter/i, 'Long-lasting rechargeable AA batteries. 8-pack.'],
                [/sorting|shape.*cube/i, 'Colorful wooden shapes for hands-on play.']
              ];
              const description = descriptions.find(([re]) => re.test(product.name));
              el('div', 'shop-row-description', info, description ? description[1] : (ctx.spec.cats[product.cat] || '') + ' · ' + product.sku);
              const stock = el('div', 'shop-row-stock', info, product.stock ? 'In Stock' : 'Out of Stock');
              stock.classList.toggle('unavailable', !product.stock);
            }
          }
          const first = app.querySelector('.co-name');
          const selected = ctx.model.page === 'detail' ? ctx.spec.products[ctx.model.view] : null;
          const product = selected || ctx.spec.products.find(p => first && p.name === first.textContent) || ctx.spec.products[0];
          if (!product) return;
          photo.replaceChildren();
          if (cache.has(product.id)) photo.appendChild(cache.get(product.id).cloneNode(true));
          else el('span', 'ins-package', photo, '▣');
          name.textContent = product.name;
          price.textContent = env.taskDef.helpers.fmtMoney(product.price, ctx.spec.money);
          description.textContent = (ctx.spec.cats[product.cat] || 'Shop') + ' collection. ' + (product.stock ? 'Available to order.' : 'Currently out of stock.');
          attributes.replaceChildren();
          for (const [label, value] of [['Category', ctx.spec.cats[product.cat]], ['Rating', (product.rating / 10).toFixed(1) + ' / 5'], ['Availability', product.stock ? product.stock + ' in stock' : 'Out of stock'], ['SKU', product.sku]]) {
            el('dt', '', attributes, label + ':'); el('dd', '', attributes, String(value));
          }
          const headings = app.querySelectorAll('.co-fh');
          if (headings[0]) headings[0].textContent = 'Categories';
          if (headings[1]) headings[1].textContent = 'Price Range';
          const search = app.querySelector('.co-search input');
          if (search) search.placeholder = '';
        };
        refresh();
        const sync = result.sync;
        result.sync = function () { const value = sync && sync.apply(this, arguments); refresh(); return value; };
        const nav = app.querySelector('.co-navs');
        const dock = document.querySelector('.shop-dock') || shopDock;
        if (nav && dock) {
          shopDock = dock;
          const old = dock.querySelector('.co-navs'); if (old) old.remove();
          dock.appendChild(nav);
          app.appendChild(dock);
        }
        const coupon = ctx.spec.coupon;
        if (coupon) {
          const code = document.querySelector('.promo-code');
          if (code) code.textContent = typeof coupon === 'string' ? coupon : coupon.code || 'SPRING10';
        }
        return result;
      },
    },
  },
});
