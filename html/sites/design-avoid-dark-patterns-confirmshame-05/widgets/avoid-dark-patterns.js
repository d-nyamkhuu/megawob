// Design on the shared avoid-dark-patterns/browser template.
env.widget({
  task: 'avoid-dark-patterns',
  site: 'design-avoid-dark-patterns-confirmshame-05',
  name: 'design',
  split: 'train',
  scenarios: ['confirmshame'],
  template: 'avoid-dark-patterns/browser',
  design: {
    font: '16px/1.4 "Segoe UI", Arial, sans-serif',
    dimColor: 'transparent',
    parts: {
      screenBody: (base, S) => (sc, parent, m) => {
        if (!(sc.blocks || []).some(b => b.t === 'line')) return base(sc, parent, m);
        const el = S.ctx.util.el;
        const body = el('div', 'sd-body paw-checkout', parent);
        const product = el('section', 'paw-product', body);
        const photo = el('div', 'paw-product-photo', product);
        const itemBlock = sc.blocks.find(b => b.t === 'line');
        const item = S.spec.priced.find(e => e.id === itemBlock.pid);
        const crumbs = el('div', 'paw-crumbs', body);
        el('span', '', crumbs, 'Home');
        el('span', '', crumbs, '›');
        el('span', '', crumbs, 'Health & Beauty');
        el('span', '', crumbs, '›');
        el('span', '', crumbs, item ? item.label : 'Product');
        body.insertBefore(crumbs, product);
        if (item && !/grooming brush/i.test(item.label)) {
          photo.classList.add('paw-product-placeholder');
          photo.innerHTML = '<svg viewBox="0 0 220 420" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="pt1" x1="0" x2="1"><stop offset="0" stop-color="#e6ebf0"/><stop offset=".3" stop-color="#fff"/><stop offset="1" stop-color="#dfe6ee"/></linearGradient><linearGradient id="pt2" x1="0" x2="1"><stop offset="0" stop-color="#7fb8d6"/><stop offset=".4" stop-color="#a9d6ec"/><stop offset="1" stop-color="#6aa8c9"/></linearGradient></defs><ellipse cx="110" cy="408" rx="70" ry="8" fill="#000" opacity=".12"/><path d="M38 12h144l8 300c0 10-6 18-14 22H44c-8-4-14-12-14-22Z" fill="url(#pt1)" stroke="#cfd8e1"/><path d="M34 300h152l-6 34H40Z" fill="url(#pt1)"/><path d="M42 330h136l-4 70c-1 6-5 9-10 9H56c-5 0-9-3-10-9Z" fill="url(#pt2)"/><rect x="82" y="360" width="56" height="26" rx="6" fill="#8cc3de" opacity=".7"/><path d="M104 58c0-12 10-18 16-18 0 12-8 20-16 18Z" fill="#4c9a6a"/><text x="110" y="92" text-anchor="middle" font-family="Segoe UI,Arial" font-size="19" fill="#4a5a72">Bramblewick</text><text class="pt-n" x="110" y="150" text-anchor="middle" font-family="Segoe UI,Arial" font-size="23" font-weight="700" fill="#1f3d78"></text><text x="110" y="192" text-anchor="middle" font-family="Segoe UI,Arial" font-size="20" font-weight="700" fill="#e8651a">Care</text><g font-family="Segoe UI,Arial" font-size="11" fill="#667" text-anchor="middle"><text x="110" y="236">Quality formula</text><text x="110" y="252">Dermatologically tested</text><text x="110" y="268">Fragrance free</text></g><text x="110" y="295" text-anchor="middle" font-family="Segoe UI,Arial" font-size="13" font-weight="700" fill="#1f3d78">100 ml</text></svg>';
          photo.querySelector('.pt-n').textContent = item.label.split(/[ ,]/).slice(0, 2).join(' ').slice(0, 16);
        }
        const details = el('div', 'paw-product-info', product);
        const identity = sc.blocks.filter(b => ['h', 'line'].includes(b.t));
        const choices = sc.blocks.filter(b => !['h', 'line'].includes(b.t));
        S.P.main({ ...sc, blocks: identity }, details, m);
        const controls = el('div', 'paw-checkout-controls', product);
        el('strong', 'paw-panel-stock', controls, 'In stock');
        el('div', 'paw-panel-dispatch', controls, 'Dispatched from Bramblewick Depot');
        const delivery = el('section', 'paw-delivery', body);
        S.P.blocks(choices, delivery, m);
        if (sc.side) S.P.side(sc, controls, m);
        const lower = el('div', 'paw-lower', body);
        const table = el('section', 'paw-specification', lower);
        el('h3', '', table, 'Product Details');
        const grooming = item && /grooming brush/i.test(item.label);
        const properties = grooming
          ? [['Suitable for', 'Cats and dogs'], ['Material', 'Stainless steel, plastic'], ['Handle', 'Ergonomic, non-slip'], ['Size', 'Medium']]
          : [['Product', item ? item.label : 'Selected item'], ['Availability', 'In stock'], ['Delivery', 'Standard or Express'], ['Support', 'Customer care']];
        for (const [key, value] of properties) {
          const row = el('div', 'paw-spec-row', table);
          el('span', '', row, key); el('span', '', row, value);
        }
        const reviews = el('section', 'paw-reviews', lower);
        el('h3', '', reviews, 'Customer Reviews');
        for (const [text, date] of [[grooming ? 'Great brush, works really well on my dog!' : 'Great quality, works really well!', '8 Mar 2014'], ['Good quality and easy to use.', '21 Feb 2014']]) {
          const row = el('div', 'paw-review', reviews);
          el('span', 'paw-stars', row, '★★★★★');
          const copy = el('div', '', row, text); el('small', '', copy, date);
        }
        return body;
      },
      line: (base, S) => (b, parent, m) => {
        const result = base(b, parent, m);
        if (parent.querySelector('.sd-line') && !parent.querySelector('.paw-stock')) {
          const el = S.ctx.util.el;
          const rating = el('div', 'paw-rating', parent);
          el('span', 'paw-stars', rating, '★★★★★'); el('span', '', rating, '(142 customer reviews)');
          el('div', 'paw-stock', parent, 'In stock');
          const item = S.spec.priced.find(e => e.id === b.pid);
          const ul = el('ul', 'paw-description paw-bullets', parent);
          for (const t of (item && /grooming brush/i.test(item.label)
            ? ['Helps remove loose fur', 'Reduces shedding', 'Suitable for cats and dogs', 'Ergonomic, non-slip handle']
            : ['Quality product from our range', 'Selected with care', 'Dispatched from Bramblewick Depot', 'Easy returns'])) el('li', '', ul, t);
        }
        return result;
      },
      modalEl: (base, S) => (parent, md) => {
        const el = S.ctx.util.el;
        const dim = el('div', 'sd-dim paw-offer-dim', parent);
        const dlg = el('div', 'sd-dlg sd-modal paw-offer', dim);
        // Keep the offer controls inside the stage even with footer or overlay reservations.
        dlg.style.padding = '0';
        dlg.style.gap = '0';
        dlg.style.setProperty('--offer-width', `${Math.min(802, S.ctx.size.width * 0.82)}px`);
        dlg.style.setProperty('--offer-scale', String(Math.min(1, Math.max(0.4, (S.ctx.size.height - 60) / 660))));
        const titlebar = el('div', 'paw-offer-titlebar', dlg, 'Special Offer');
        const dismiss = md.ctls.find(id => /link|ghost|quiet|shame/.test(S.spec.ctls[id].style || ''));
        if (dismiss) {
          const close = el('button', 'paw-offer-close', titlebar, '×');
          close.title = S.spec.ctls[dismiss].label;
          close.setAttribute('aria-label', close.title);
          close.addEventListener('click', () => S.P.onCtl(dismiss));
        }
        const content = el('div', 'paw-offer-content', dlg);
        el('h3', '', content, md.title);
        el('p', 'paw-offer-subtitle', content, 'Keep your pet healthy and happy with exclusive benefits.');
        const features = el('div', 'paw-offer-features', content);
        const photo = el('div', 'paw-offer-pets', features);
        photo.setAttribute('role', 'img');
        photo.setAttribute('aria-label', 'Golden retriever and tabby cat');
        const benefits = el('div', 'paw-offer-benefits', features);
        for (const [icon, heading, sub] of [['truck', 'Delivery to your door', 'Pet essentials, delivered'], ['tag', 'Quality pet supplies', 'Everything for your pet'], ['paw', 'Pet advice from experts', 'Friendly, helpful support']]) {
          const row = el('div', 'paw-benefit', benefits);
          const glyph = el('span', 'paw-benefit-icon', row);
          if (icon === 'truck') glyph.innerHTML = S.D.icons.truck;
          else if (icon === 'tag') glyph.innerHTML = '<svg viewBox="0 0 48 48"><path d="M5 23 25 3h17v17L22 40a5 5 0 0 1-7 0L5 30a5 5 0 0 1 0-7Z"/><circle cx="34" cy="11" r="3" fill="white"/></svg>';
          else glyph.innerHTML = '<svg viewBox="0 0 48 48"><ellipse cx="10" cy="20" rx="5" ry="7"/><ellipse cx="20" cy="11" rx="5" ry="8"/><ellipse cx="32" cy="11" rx="5" ry="8"/><ellipse cx="41" cy="21" rx="5" ry="7"/><path d="M13 34c3-5 5-12 11-12s9 7 13 12c5 9-4 12-10 9-3-2-4-2-7 0-7 3-13-1-7-9Z"/></svg>';
          const text = el('div', '', row); el('strong', '', text, heading); el('span', '', text, sub);
        }
        const footer = el('div', 'paw-offer-footer', dlg);
        if (md.text) el('p', 'paw-offer-terms', footer, md.text);
        md.ctls.forEach((id, index) => S.P.ctlBtn(id, footer, index === 0 ? 'paw-offer-accept' : 'paw-offer-decline'));
        return dlg;
      },
    },
  },
});
