(function () {
  'use strict';
  env.site({
    name: 'design-act-in-time-deadline-01',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.classList.add('travel-page');
      const header = u.el('header', 'tp-header', body);
      const logo = u.el('div', 'tp-logo', header);
      logo.innerHTML =
        '<svg viewBox="0 0 100 56" aria-hidden="true"><path d="M4 49 28 18l10 12L55 4l40 45H4Z" fill="#f9fbff"/><path d="m23 29 7 7 9-12 6 10 10-19 17 26H15Z" fill="#09284d"/><path d="m57 15 7 14 8 5-17-1-4-6Z" fill="#fff"/></svg>';
      const brand = u.el('div', 'tp-brand', header);
      u.el('strong', '', brand, 'TrailPoint Travel');
      u.el('span', '', brand, 'Get out there.');
      const links = u.el('div', 'tp-links', header);
      u.el('span', 'tp-user', links, '♟　My Account');
      u.el('i', '', links, '');
      u.el('span', '', links, 'Help');
      let submit = null,
        placement = null,
        label = 'OK';
      const makeEnd = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      const de = (parent, text, collide = false) => {
        const b = u.el('button', 'tp-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, ...(collide ? { collide: true } : {}) }));
        return b;
      };
      if (!ctx.finish) {
        const fallback = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete'];
        const labels =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : fallback;
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const er = ctx.rng.fork('chrome/end'),
          common = er.bool(0.5);
        label = common ? 'OK' : labelOf(er.pick(labels));
        placement = common ? 'header' : er.pick(['header', 'footer', 'link', 'icon']);
        const navtools = u.el('div', 'tp-tools', header);
        if (placement === 'header') submit = makeEnd(navtools, 'tp-submit', label);
        else if (placement === 'icon') {
          submit = makeEnd(navtools, 'tp-submit tp-icon', '✓');
          submit.setAttribute('aria-label', label);
        }
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) de(navtools, String(cr.pick(pool)), true);
        }
      }
      const nav = u.el('nav', 'tp-tabs', body);
      ['Featured Deals', 'Flights', 'Hotels', 'Vatels', 'Vacation Packages', 'Car Rental'].forEach((t, i) =>
        u.el('div', i ? 'tp-tab' : 'tp-tab selected', nav, t),
      );
      const bodyrow = u.el('div', 'tp-body', body);
      const sidebar = u.el('aside', 'tp-sidebar', bodyrow);
      const list = u.el('section', 'tp-list', sidebar);
      u.el('h2', 'tp-section-title', list, 'Today’s Deals');
      const rows = [
        ['Pine Ridge Ski Resort', '2-Night Weekend Getaway', 'Lodging + Lift Tickets', ''],
        ['Sunset Bay Resort', '4-Night Beach Package', 'Hotel + Airfare', ''],
        ['Riverton City Break', '3 Nights in Riverton', 'Hotel + Extras', ''],
        ['Canyon Trails Tour', 'National Park Adventure', 'Guided Tour + Lodging', ''],
        ['Lakeview Cabins', '3-Night Cabin Stay', 'Lodging + Activities', ''],
      ];
      const listbody = u.el('div', 'tp-listbody', list);
      rows.forEach((r, i) => {
        const row = u.el('div', i ? 'tp-row' : 'tp-row active', listbody);
        u.el('span', 'tp-thumb', row, r[3]);
        const copy = u.el('span', 'tp-rowcopy', row);
        u.el('b', '', copy, r[0]);
        u.el('span', '', copy, r[1]);
        u.el('small', '', copy, r[2]);
        u.el('strong', 'tp-chevron', row, '›');
      });
      const detail = u.el('section', 'tp-details', sidebar);
      u.el('h2', 'tp-section-title', detail, 'Deal Details');
      const d = u.el('div', 'tp-detailbody', detail);
      u.el('div', 'tp-detailname', d, 'Pine Ridge Ski Resort');
      u.el('div', 'tp-detail-sub', d, '2-Night Weekend Getaway');
      [
        ['Location:', 'Pine Ridge, CO'],
        ['Includes:', '2 nights lodging,\n2 lift tickets (adult)'],
        ['Valid for travel:', 'Jan 10 – Mar 31, 2006'],
        ['Blackout dates:', 'Feb 17 – Feb 20, 2006'],
        ['Rating:', '★★★★★　(214 reviews)'],
      ].forEach((x) => {
        const line = u.el('div', 'tp-detail-line', d);
        u.el('span', '', line, x[0]);
        u.el('span', '', line, x[1]);
      });
      const main = u.el('main', 'tp-main', bodyrow);
      const mode = ctx.display || 'header';
      if (mode === 'header') u.el('div', 'tp-tasknote tp-headernote', main, ctx.instruction);
      if (mode === 'panel') u.el('div', 'tp-tasknote tp-panelnote', sidebar, ctx.instruction);
      if (mode === 'toast') {
        const toast = u.el('div', 'tp-tasknote tp-toast', body, ctx.instruction);
      }
      const stage = u.el('div', 'tp-stage', main);
      const foot = u.el('footer', 'tp-footer', body);
      u.el('span', 'tp-footcopy', foot, 'TrailPoint Travel　•　Offers updated daily');
      if (!ctx.finish && (placement === 'footer' || placement === 'link')) {
        const wrap = u.el('div', 'tp-tools', foot);
        submit = makeEnd(
          wrap,
          placement === 'link' ? 'tp-endlink' : 'tp-submit',
          placement === 'link' ? label + ' ›' : label,
        );
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'tp-overlay tp-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your travel preferences.',
        toast: 'Your trip information has been updated.',
        chat: 'Welcome to TrailPoint. How can we help?',
        promo: 'Get inspired. Sign up for our travel newsletter.',
        banner: 'Special travel offers are updated every day.',
      };
      u.el('div', 'tp-overlay-text', el, texts[ctx.kind] || texts.banner);
      const b = u.el('button', 'tp-overlay-dismiss', el, ctx.kind === 'cookie' ? 'Accept' : '×');
      b.type = 'button';
      b.setAttribute('aria-label', 'Close');
      b.addEventListener('click', () => ctx.dismiss(ctx.kind === 'cookie' ? 'accept' : 'close'));
      return { el, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
