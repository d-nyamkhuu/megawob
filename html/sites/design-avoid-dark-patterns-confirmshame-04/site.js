// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) =>
      function (_c) {
        base(_c);
        if (_c.H <= 800 && _c.display === 'toast') {
          _c.display = 'header';
          document.body.classList.remove('ref-has-note');
        }
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { content, ctx, display, local, lr, nav, rng, util, word } = _c;
        const { K, TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        const titlebar = util.el('div', 'cad-titlebar', header);
        const engraving = util.el('div', 'lib-engraving', titlebar);
        engraving.innerHTML =
          '<svg viewBox="0 0 220 126" aria-hidden="true"><g fill="none" stroke="#27231e" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 43 109 8l95 35-9 8v57H25V51zM15 43h189M35 52h148M43 53v51m25-51v51m26-51v51m26-51v51m26-51v51m24-51v51M31 106h158l13 8H19zM82 46l27-28 28 28M89 43h42M100 29h16M17 50l-8 7m202-7 7 7"/><path d="M50 61h10m29 0h10m27 0h10m27 0h10M50 77h10m29 0h10m27 0h10m27 0h10M50 92h10m29 0h10m27 0h10m27 0h10"/><path d="M7 106h206M8 100l-3-11 8-9 2 13m-2-7-8-2m198 22 3-11-8-9-2 13m2-7 8-2M32 110l-8 8m8-5 7 8m144-11 8 8m-8-5-7 8"/></g><circle cx="110" cy="39" r="5" fill="none" stroke="#27231e" stroke-width="1.5"/><path d="M107 39h6m-3-3v6" stroke="#27231e" stroke-width="1"/></svg>';
        util.el('span', 'cad-app-icon', titlebar, 'R');
        util.el('span', 'cad-app-name', titlebar, 'Riverside');
        util.el('span', 'lib-name-sub', titlebar, 'Public Library');
        util.el('span', 'cad-version', titlebar, 'Books. Ideas. A Stronger Community.');
        util.el('span', 'cad-window-controls', titlebar, '');
        const menubar = util.el('nav', 'cad-menubar', header);
        for (const item of ['Library Catalog', 'Bookstore', 'Events', 'My Account']) {
          const m = util.el('span', 'cad-menu-item', menubar, item);
          m.dataset.role = 'menu';
        }
        const toolbar = util.el('div', 'cad-toolbar', header);
        const tabs = util.el('nav', 'cad-tabs', toolbar);
        for (const [icon, label] of [
          ['⌂', 'Home'],
          ['▤', 'Catalog'],
          ['🛒', 'Bookstore'],
          ['●', 'My Account'],
          ['?', 'Help'],
        ]) {
          const tab = util.el('div', 'cad-tab', tabs);
          util.el('span', 'cad-tab-icon', tab, icon);
          util.el('span', '', tab, label);
        }
        const search = util.el('div', 'cad-search', toolbar);
        util.el('span', '', search, 'All Items　⌄');
        util.el('span', 'cad-search-text', search, '');
        util.el('div', 'cad-cart', toolbar, 'Search');
        util.el('div', 'cad-settings', toolbar, '');
        if (display !== 'header' || nav) {
          const title = rng.pick(TITLES);
          const brand = util.el('div', 'ref-brand', toolbar, word ? word(lr.pick(K.brand)) : title);
          brand.dataset.role = 'brand';
        }
        if (nav) {
          const n = util.el('nav', 'ref-nav', toolbar);
          for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav)) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        if (display === 'header') util.el('div', 'ref-instruction', toolbar, ctx.instruction);
        else util.el('div', 'ref-spacer', toolbar);
        Object.assign(_c, { engraving, header, menubar, search, tabs, titlebar, toolbar });
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, label, placement, toolbar, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', toolbar);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }
        Object.assign(_c, { headerTools, submit });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const record = util.el('section', 'lib-record', document.body);
        const photo = util.el('div', 'lib-art', record);
        photo.innerHTML =
          '<svg viewBox="0 0 240 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><defs><linearGradient id="frame-sky" x2="0" y2="1"><stop stop-color="#a8c4d8"/><stop offset="1" stop-color="#eef0e5"/></linearGradient><linearGradient id="frame-water" x2="0" y2="1"><stop stop-color="#7893a0"/><stop offset="1" stop-color="#253f43"/></linearGradient></defs><rect width="240" height="150" fill="url(#frame-sky)"/><path d="m0 82 34-34 23 20 32-39 29 36 27-30 49 45 46-25v40H0z" fill="#536d61"/><path d="m0 91 37-32 23 19 29-37 31 39 27-27 36 33 29-20 28 18v24H0z" fill="#71826b"/><path d="M0 91q33-7 63 2t60 0 59 0 58-3v60H0z" fill="url(#frame-water)"/><path d="M0 105q34-8 64 0t60 0 59 1 57-3M0 123q33-6 65 1t60 0 59 1 56-2" fill="none" stroke="#d4dfd6" stroke-width="2" opacity=".6"/><g fill="#263e32"><path d="m14 94 12-34 12 34zm-4 7h32v4H10zm21-2 13-38 14 38zm-3 7h34v4H28zm155-14 13-37 14 37zm-4 7h36v4h-36zm32-4 12-31 12 31zm-3 7h30v4h-30z"/></g><path d="M0 138q52-7 100 0t140-2v14H0z" fill="#1f3832"/></svg>';
        const recText = util.el('div', 'lib-record-copy', record);
        util.el('strong', '', recText, 'Digital Photo Frame 10 inch');
        util.el('span', '', recText, 'By HomeView');
        util.el(
          'p',
          '',
          recText,
          '10 inch digital photo frame with bright display. View your favourite photos at home.',
        );
        const biblio = util.el('div', 'lib-biblio', record);
        for (const [label, value, cls] of [
          ['Format:', 'Electronics'],
          ['Publisher:', 'HomeView'],
          ['ISBN:', '9781592840271'],
          ['Availability:', 'In Stock', 'is-stock'],
        ]) {
          const row = util.el('div', `lib-biblio-row${cls ? ` ${cls}` : ''}`, biblio);
          util.el('strong', '', row, label);
          util.el('span', '', row, value);
        }
        const ad = util.el('aside', 'lib-ad', record);
        const adArt = util.el('div', 'lib-ad-art', ad);
        adArt.innerHTML =
          '<svg viewBox="0 0 160 120" aria-hidden="true"><g fill="#e8e0d1" stroke="#332f29" stroke-width="2" stroke-linejoin="round"><path d="M16 103V57q0-4 4-4h18q4 0 4 4v46zM45 103V34q0-4 4-4h19q4 0 4 4v69zM73 103V48q0-4 4-4h18q4 0 4 4v59H73zM100 103V24q0-4 4-4h20q4 0 4 4v79zM130 103V43q0-4 4-4h13q4 0 4 4v60z"/><path d="M20 57h18M49 34h19M77 48h18M104 24h20M134 43h13" fill="none"/></g><g fill="none" stroke="#554f45" stroke-width="1.4"><path d="M21 61v36m4-36v36m4-36v36m4-36v36M50 39v58m5-58v58m5-58v58m6-58v58M78 53v44m5-44v44m5-44v44m15-63v63m5-63v63m5-63v63m5-63v63m14-55v55m4-55v55m5-55v55"/><path d="M15 105h140M12 110h145" stroke-width="2"/></g></svg>';
        util.el('div', 'lib-ad-copy', ad, 'Supporting Readers for a Brighter Tomorrow');
        const cart = util.el('div', 'lib-cart', body);
        util.el('h2', '', cart, 'Your Cart (1 item)');
        const table = util.el('table', 'lib-cart-table', cart);
        const thead = util.el('thead', '', table);
        const headings = util.el('tr', 'lib-cart-row', thead);
        util.el('th', '', headings, 'Item');
        util.el('th', '', headings, 'Price');
        const tbody = util.el('tbody', '', table);
        const cartItem = util.el('tr', 'lib-cart-item', tbody);
        const itemCell = util.el('td', '', cartItem);
        const thumb = util.el('span', 'lib-thumb', itemCell);
        thumb.innerHTML = photo.innerHTML;
        const itemCopy = util.el('div', 'lib-item-copy', cartItem);
        util.el('strong', '', itemCopy, 'Digital Photo Frame 10 inch');
        util.el('span', '', itemCopy, 'By HomeView');
        util.el('span', '', itemCopy, 'ISBN: 9781592840271');
        util.el('a', '', itemCopy, 'Remove');
        itemCell.appendChild(itemCopy);
        util.el('td', 'lib-price', cartItem, '$89.99');
        const summary = util.el('aside', 'lib-summary', body);
        util.el('h2', '', summary, 'Order Summary');
        const summaryRow = (label, value, cls) => {
          const row = util.el('div', `lib-summary-row${cls ? ` ${cls}` : ''}`, summary);
          util.el('span', '', row, label);
          util.el('span', '', row, value);
        };
        summaryRow('Items (1)', '$89.99');
        summaryRow('Delivery', '');
        const deliveryOption = (label, value, selected) => {
          const row = util.el('div', `lib-summary-row lib-delivery-option${selected ? ' is-selected' : ''}`, summary);
          util.el('span', 'lib-radio', row, '');
          util.el('span', 'lib-delivery-label', row, label);
          util.el('span', '', row, value);
        };
        deliveryOption('Standard Delivery (Free)', '$0.00', true);
        deliveryOption('Express Delivery (2–3 days)', '$9.99', false);
        deliveryOption('Next Day Delivery', '$14.99', false);
        summaryRow('Total', '$89.99', 'lib-total');
        const deliveryPromo = util.el('div', 'lib-free-delivery', summary);
        util.el('span', 'lib-truck', deliveryPromo, '');
        const promoText = util.el('div', '', deliveryPromo);
        util.el('strong', '', promoText, 'Free Delivery');
        util.el('span', '', promoText, 'on orders over $25');
        util.el('a', '', promoText, 'See delivery details');
        S.frameSidebar(_c, body);
        Object.assign(_c, {
          ad,
          adArt,
          biblio,
          body,
          cart,
          cartItem,
          deliveryOption,
          deliveryPromo,
          headings,
          itemCell,
          itemCopy,
          photo,
          promoText,
          recText,
          record,
          summary,
          summaryRow,
          table,
          tbody,
          thead,
          thumb,
        });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        const dock = util.el('nav', 'lib-dock', document.body);
        for (const [icon, label] of [
          ['⌂', 'Home'],
          ['▤', 'Catalog'],
          ['🛒', 'Bookstore'],
          ['●', 'My Account'],
          ['?', 'Help'],
        ]) {
          const item = util.el('div', 'lib-dock-item', dock);
          util.el('b', '', item, icon);
          util.el('span', '', item, label);
        }
        util.el('small', '', dock, 'Riverside Public Library　 Knowledge. People. Possibilities.');
        S.frameAlign(_c, stage);
        Object.assign(_c, { dock, stage });
      },
    'frame.end': (base, S) =>
      function (_c) {
        const result = base(_c);
        const foot = document.querySelector('footer.ref-foot');
        if (foot) _c.dock.insertBefore(foot, _c.dock.lastElementChild);
        const floating = document.querySelector('.ref-float-dock');
        if (floating) _c.dock.insertBefore(floating, _c.dock.lastElementChild);
        return result;
      },
    'frame.nav': (base, S) => function (_c) {},
    'frame.instruction': (base, S) => function (_c) {},
  };

  env.site({
    name: 'design-avoid-dark-patterns-confirmshame-04',
    template: 'site/base',
    design: { parts },
  });
})();
