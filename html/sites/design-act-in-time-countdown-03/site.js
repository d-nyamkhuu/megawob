(function () {
  'use strict';
  const C = { site: 'design-act-in-time-countdown-03' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const body = u.el('div', 'shop-frame', document.body);
      let submit = null,
        placement = 'footer',
        label = 'Submit';
      if (!ctx.finish) {
        const fallback = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const labels = (ctx.content && ctx.content.END_LABELS) || fallback;
        const str = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const er = ctx.rng.fork('chrome/end');
        label = er.bool(0.5) ? 'Apply' : str(er.pick(labels));
        placement = er.pick(['footer', 'header', 'link']);
      }
      const header = u.el('header', 'shop-header', body);
      u.el('div', 'shop-wordmark', header, 'atelier');
      if (ctx.display === 'header' && ctx.instruction) u.el('div', 'shop-instruction', header, ctx.instruction);
      else u.el('div', 'shop-space', header);
      if (!ctx.finish && placement === 'header') {
        submit = u.el('button', 'shop-apply', header, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.addEventListener('click', () => ctx.submit());
      }
      const area = u.el('div', 'shop-area', body);
      const inspector = u.el('aside', 'shop-inspector', area);
      u.el('h2', '', inspector, 'Product Details');
      const info = [
        ['Name', 'Hooded Utility Jacket'],
        ['Price', '$89'],
        ['Rating', '★★★★★  (124 reviews)'],
        [
          'Description',
          'A lightweight jacket with a drawstring hood, front snap closure and plenty of pockets. Perfect for everyday wear.',
        ],
        ['Materials', '100% Cotton'],
        ['Care', 'Machine wash cold, tumble dry low'],
        ['SKU', 'HJ-2847-SND'],
        ['Availability', 'In stock'],
      ];
      info.forEach(([k, v]) => {
        const row = u.el('section', 'shop-detail', inspector);
        u.el('strong', '', row, k);
        u.el('span', '', row, v);
      });
      if (ctx.display === 'panel' && ctx.instruction) {
        const p = u.el('div', 'shop-panel-note', inspector);
        u.el('b', '', p, 'Your task');
        u.el('div', '', p, ctx.instruction);
      }
      const stage = u.el('main', 'shop-stage', area);
      const gallery = u.el('div', 'shop-gallery', area);
      u.el('div', 'shop-photo', gallery);
      const thumbs = u.el('div', 'shop-thumbs', gallery);
      ['front', 'back', 'detail', 'hood'].forEach((v, i) => {
        const t = u.el('div', 'shop-thumb shop-thumb-' + v, thumbs);
        t.setAttribute('aria-hidden', 'true');
      });
      const summary = u.el('section', 'shop-summary', area);
      const titleRow = u.el('div', 'shop-title-row', summary);
      u.el('h1', '', titleRow, 'Hooded Utility Jacket');
      u.el('strong', 'shop-price', titleRow, '$89');
      const rating = u.el('div', 'shop-rating', summary);
      u.el('span', 'shop-stars', rating, '★★★★★');
      u.el('span', 'shop-reviews', rating, '(124 reviews)');
      u.el(
        'p',
        'shop-description',
        summary,
        'A lightweight jacket with a drawstring hood, front snap closure and plenty of pockets. Perfect for everyday wear.',
      );
      if (ctx.display === 'toast' && ctx.instruction) {
        const note = u.el('div', 'shop-toast', body);
        u.el('span', '', note, ctx.instruction);
        const x = u.el('button', '', note, '×');
        x.type = 'button';
        x.addEventListener('click', () => note.remove());
      }
      const dock = u.el('nav', 'shop-dock', body);
      [
        ['⌂', 'Home'],
        ['⌕', 'Shop'],
        ['♡', 'Favorites'],
        ['🛒', 'Cart'],
        ['♙', 'Account'],
      ].forEach(([icon, t], i) => {
        const a = u.el('div', 'shop-navitem' + (i === 1 ? ' active' : ''), dock);
        u.el('i', '', a, icon);
        u.el('span', '', a, t);
      });
      if (!ctx.finish && placement !== 'header') {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          placement === 'link' ? 'shop-text-end' : 'shop-apply shop-dock-end',
          dock,
          label,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'shop-overlay shop-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new collection.',
        banner: 'New season arrivals are here.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const b = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      b.type = 'button';
      b.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
