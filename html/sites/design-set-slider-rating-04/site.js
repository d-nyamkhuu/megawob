(function () {
  'use strict';
  function icon(u, parent, shape) {
    const s = u.svg('svg', { viewBox: '0 0 24 24', class: 'nav-icon', 'aria-hidden': 'true' }, parent);
    const paths = {
      home: 'M3 11 12 3l9 8v9h-6v-6H9v6H3z',
      hotels: 'M3 20V8h8v12M11 12h10v8M5 11h2m-2 3h2m7 1h2m2 0h1',
      flights: 'M2 14l8-2 2-9 2-1 2 9 6 2v2l-8-1-2 5-2 1-1-6-7 2z',
      trips: 'M3 5l6-2 6 3 6-2v15l-6 2-6-3-6 2zM9 3v15m6-12v15',
      customers: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M4 21c0-5 3-7 8-7s8 2 8 7',
      reports: 'M3 20h4V11H3zm7 0h4V6h-4zm7 0h4V3h-4z',
    };
    u.svg(
      'path',
      {
        d: paths[shape],
        fill: shape === 'home' || shape === 'customers' ? 'currentColor' : 'none',
        stroke: 'currentColor',
        'stroke-width': 2,
        'stroke-linejoin': 'round',
      },
      s,
    );
  }
  function drawOverlay(ctx) {
    const u = ctx.util,
      box = u.el('aside', 'notice overlay-' + ctx.kind, document.body);
    box.setAttribute('role', 'dialog');
    const title = {
      cookie: 'Privacy preferences',
      toast: 'Hotel workspace',
      chat: 'Wanderly Travel support',
      promo: 'Travel updates',
      banner: 'Service announcement',
    }[ctx.kind];
    u.el('strong', '', box, title);
    const x = u.el('button', 'notice-x', box, '×');
    x.type = 'button';
    x.setAttribute('aria-label', 'Close');
    x.onclick = () => ctx.dismiss('close');
    u.el(
      'p',
      '',
      box,
      {
        cookie: 'Your preferences are stored on this device.',
        toast: 'Hotel information is ready.',
        chat: 'How can we help with your stay?',
        promo: 'Get the latest travel offers.',
        banner: 'Some hotel details may be updated.',
      }[ctx.kind],
    );
    const b = u.el('button', 'notice-dismiss', box, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
    b.type = 'button';
    b.onclick = () => ctx.dismiss('dismiss');
    return { el: box, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  env.site({
    name: 'design-set-slider-rating-04',
    styles: ['site.css', 'workspace.css', 'finish.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        rng = ctx.rng.fork('chrome/end');
      let placement = rng.pick(['footer', 'footer', 'header', 'link', 'icon']);
      if (ctx.finish) placement = null;
      const labels = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
      ];
      const chosen = rng.pick(labels),
        label = typeof chosen === 'string' ? chosen : chosen.label || chosen.text || String(chosen);
      const cr = ctx.rng.fork('chrome/collide'),
        pool = labels
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || String(x)))
          .filter((x) => x !== label);
      const collision = cr.bool(0.3) && pool.length ? cr.pick(pool) : null;
      document.body.className = 'hotel-app instr-' + ctx.display;
      const title = u.el('div', 'window-title', document.body);
      u.el('span', 'brand-mark', title, '◢');
      u.el('span', 'app-name', title, 'Wanderly Travel');
      u.el('span', 'window-controls', title, '−　□　×');
      const nav = u.el('nav', 'top-nav', document.body);
      for (const [name, key] of [
        ['Home', 'home'],
        ['Hotels', 'hotels'],
        ['Flights', 'flights'],
        ['Trips', 'trips'],
        ['Customers', 'customers'],
        ['Reports', 'reports'],
      ]) {
        const a = u.el('div', 'nav-item ' + (name === 'Hotels' ? 'active' : ''), nav);
        icon(u, a, key);
        u.el('span', '', a, name);
      }
      const search = u.el('div', 'search', nav, '⌕　 Search hotels, cities, or keywords...');
      if (placement === 'header' && !ctx.finish) makeEnd(nav, 'header-end', label);
      const main = u.el('div', 'workspace', document.body);
      const list = u.el('aside', 'hotel-list', main);
      u.el('h2', 'pane-title', list, 'Hotels');
      const hotels = [
        ['Maple Ridge Inn', 'Seattle, WA', '★★★★☆', '4.0'],
        ['Saffron House', 'Portland, OR', '★★★☆', '3.5'],
        ['Linden Court', 'San Francisco, CA', '★★★★★', '4.5'],
        ['Cedar & Stone', 'Denver, CO', '★★★★☆', '4.0'],
        ['Harbor View Hotel', 'San Diego, CA', '★★★☆☆', '3.0'],
        ['Elm Grove Inn', 'Austin, TX', '★★★★☆', '4.0'],
        ['Pinecrest Suites', 'Phoenix, AZ', '★★★☆', '3.5'],
        ['Willow Bend', 'Chicago, IL', '★★★★☆', '4.5'],
      ];
      hotels.forEach((h, i) => {
        const row = u.el('div', 'hotel-row ' + (i === 1 ? 'selected' : ''), list);
        u.el('div', 'hotel-thumb thumb-' + i, row);
        const d = u.el('div', 'hotel-copy', row);
        u.el('b', '', d, h[0]);
        u.el('span', '', d, h[1]);
        u.el('span', 'mini-stars', d, h[2] + '　' + h[3]);
      });
      const center = u.el('main', 'hotel-content', main);
      const summary = u.el('section', 'summary', center);
      u.el('div', 'hotel-photo', summary);
      const desc = u.el('div', 'summary-copy', summary);
      u.el('h1', '', desc, 'Saffron House');
      u.el('div', 'city', desc, 'Portland, OR');
      u.el('div', 'overall', desc, '★★★☆　3.5　(128 reviews)');
      u.el('div', 'features', desc, '⌖　 Central location　　 ◉　 Free Wi-Fi　　 ☕　 Complimentary breakfast');
      const details = u.el('aside', 'details', main);
      u.el('h2', 'pane-title', details, 'Hotel Details');
      [
        ['Address', '123 SW Montgomery St'],
        ['', 'Portland, OR 97201'],
        ['Phone', '(503) 555-0182'],
        ['Website', 'www.saffronhouse.com'],
        ['Category', 'Boutique Hotel'],
        ['Rooms', '72'],
        ['Check-in', '3:00 PM'],
        ['Check-out', '11:00 AM'],
      ].forEach((x) => {
        const r = u.el('div', 'detail-row', details);
        u.el('span', '', r, x[0]);
        u.el('span', '', r, x[1]);
      });
      const map = u.el('div', 'map-placeholder', details);
      const svg = u.svg('svg', { viewBox: '0 0 360 180', 'aria-hidden': 'true' }, map);
      u.svg('rect', { width: 360, height: 180, fill: '#e6e6e4' }, svg);
      for (const [d, w] of [
        ['M-20 24 L380 112', '8'],
        ['M5 170 L320 -10', '7'],
        ['M-20 124 L380 43', '6'],
        ['M102 -20 L205 200', '5'],
        ['M272 -10 L160 200', '5'],
        ['M-10 76 L370 154', '4'],
        ['M-20 55 L380 147', '3'],
        ['M-10 154 L380 66', '3'],
        ['M55 -15 L150 200', '3'],
        ['M220 -10 L300 200', '3'],
      ])
        u.svg('path', { d, stroke: '#fff', 'stroke-width': w, fill: 'none' }, svg);
      for (const [x, y] of [
        [40, 42],
        [78, 131],
        [133, 34],
        [240, 119],
        [310, 52],
        [278, 145],
        [183, 87],
      ])
        u.svg('rect', { x, y, width: 26, height: 18, fill: '#d0d0ce', stroke: '#fff', 'stroke-width': 2 }, svg);
      u.svg('path', { d: 'M180 56c-8 0-14 6-14 14 0 11 14 27 14 27s14-16 14-27c0-8-6-14-14-14z', fill: '#111' }, svg);
      u.svg('circle', { cx: 180, cy: 70, r: 4.5, fill: '#eee' }, svg);
      u.el('div', 'map-street', map, 'SW Montgomery St');
      u.el('h2', 'amenities-head', details, 'Amenities');
      u.el(
        'div',
        'amenities',
        details,
        '◉　 Free Wi-Fi\n♜　 Complimentary breakfast\n♧　 Fitness center\n▣　 On-site parking\n♣　 Pet friendly\n◆　 Sustainable practices',
      );
      if (ctx.display === 'header') u.el('div', 'task-note', center, ctx.instruction);
      if (ctx.display === 'panel') {
        const panel = u.el('aside', 'task-panel', main);
        u.el('b', '', panel, 'Task');
        u.el('div', '', panel, ctx.instruction);
      }
      if (ctx.display === 'toast') {
        const toast = u.el('div', 'task-toast', document.body, ctx.instruction);
      }
      const task = u.el('section', 'rating-area', center);
      u.el('h2', '', task, 'Rate This Hotel');
      const stage = u.el('div', 'rating-stage', task);
      stage.dataset.role = 'stage';
      const foot = u.el('footer', 'form-footer', document.body);
      const status = u.el('div', 'footer-status', foot, 'Wanderly Travel　 •　 Hotel rating details');
      const actions = u.el('div', 'footer-actions', foot);
      if (!ctx.finish && placement === 'footer') makeEnd(actions, 'primary', label);
      if (!ctx.finish && placement === 'link') {
        const a = u.el('a', 'footer-link', actions, label + ' ›');
        a.href = '#';
        a.dataset.role = 'submit';
        a.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
      }
      if (!ctx.finish && placement === 'icon') {
        const b = makeEnd(actions, 'icon-end', '✓');
        b.title = label;
        b.setAttribute('aria-label', label);
      }
      if (collision) {
        const b = u.el('button', 'xtra', nav, collision);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', { label: collision, collide: true });
      }
      const update = u.el('button', 'xtra update', actions, 'Update');
      update.type = 'button';
      update.dataset.role = 'xtra';
      update.onclick = () => env.log('decoy', { label: 'Update' });
      return { stage, submit: document.querySelector('[data-role="submit"]') };
      function makeEnd(parent, cls, text) {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.onclick = () => ctx.submit();
        return b;
      }
    },
    overlay: drawOverlay,
  });
})();
