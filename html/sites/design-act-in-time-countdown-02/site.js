(function () {
  'use strict';
  const C = { site: 'design-act-in-time-countdown-02' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      let label = 'Submit',
        submit = null,
        placement = 'header';
      const fallback = [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
        'Complete',
        "I'm done",
      ];
      const labels =
        ctx.content && ctx.content.END_LABELS && ctx.content.END_LABELS.length ? ctx.content.END_LABELS : fallback;
      const name = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      if (!ctx.finish) {
        const r = ctx.rng.fork('chrome/end');
        const native = r.bool(0.5);
        const choices = labels.filter((x) => name(x).toLowerCase() !== 'ready');
        const sampled = native ? 'Confirm' : name(r.pick(choices.length ? choices : labels));
        placement = native ? 'header' : r.pick(['header', 'footer', 'link']);
        label = placement === 'header' ? 'Confirm' : sampled;
      }
      const win = u.el('div', 'fm-window', body);
      const title = u.el('header', 'fm-titlebar', win);
      const lights = u.el('div', 'fm-lights', title);
      ['red', 'yellow', 'green'].forEach((c) => u.el('i', 'fm-light ' + c, lights));
      u.el('span', 'fm-title', title, 'FreshMart Grocery');
      const winctl = u.el('div', 'fm-winctl', title);
      ['−', '□', '×'].forEach((t) => u.el('span', '', winctl, t));
      const nav = u.el('nav', 'fm-nav', win);
      [
        ['◆', 'Home'],
        ['🛒', 'Shop'],
        ['▣', 'Pickup & Delivery'],
        ['▤', 'Orders'],
        ['◆', 'Special Offers'],
      ].forEach((x, i) => {
        const a = u.el('div', 'fm-tab' + (i === 2 ? ' active' : ''), nav);
        u.el('b', '', a, x[0]);
        u.el('span', '', a, x[1]);
      });
      const search = u.el('div', 'fm-search', nav);
      u.el('b', '', search, '⌕');
      u.el('span', '', search, 'Search products');
      const bodyrow = u.el('div', 'fm-body', win);
      const side = u.el('aside', 'fm-sidebar', bodyrow);
      [
        ['▦', 'Book a Pickup'],
        ['☷', 'My Bookings'],
        ['●', 'Store Information'],
        ['?', 'Help'],
      ].forEach((x, i) => {
        const a = u.el('div', 'fm-sideitem' + (!i ? ' selected' : ''), side);
        u.el('b', '', a, x[0]);
        u.el('span', '', a, x[1]);
      });
      const work = u.el('div', 'fm-work', bodyrow);
      const main = u.el('main', 'fm-reservation-frame', work);
      const stage = u.el('div', 'fm-stage', main);
      const mode = ctx.display || 'header';
      if (mode === 'header') u.el('div', 'fm-header-note', work, ctx.instruction);
      const brief = (parent, cls) => {
        const n = u.el('aside', cls, parent);
        u.el('strong', '', n, 'Task Instructions');
        u.el('div', 'fm-note-text', n, ctx.instruction);
      };
      if (mode === 'panel') brief(work, 'fm-panel-note');
      if (mode === 'toast') {
        const toast = u.el('div', 'fm-toast', win);
        u.el('div', '', toast, ctx.instruction);
        const x = u.el('button', '', toast, '×');
        x.onclick = () => toast.remove();
      }
      const right = u.el('aside', 'fm-right', bodyrow);
      const store = u.el('section', 'fm-sidecard', right);
      u.el('h3', '', store, 'Selected Store');
      u.el('div', 'fm-store-photo', store);
      u.el('b', 'fm-store-name', store, 'Riverside Store');
      u.el('div', 'fm-address', store, '7420 Maple Ave\nRiverside, CA 92507');
      u.el('a', 'fm-link', store, 'Change Store…');
      const avail = u.el('section', 'fm-sidecard fm-availability', right);
      u.el('h3', '', avail, 'Pickup Availability');
      [
        ['Mon', '12'],
        ['Tue', '10'],
        ['Wed', '9'],
        ['Thu', '11'],
        ['Fri', '8'],
        ['Sat', '14'],
        ['Sun', '10'],
      ].forEach((x) => {
        const row = u.el('div', 'fm-avail-row', avail);
        u.el('span', '', row, x[0]);
        u.el('span', '', row, x[1] + ' slots');
      });
      const end = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = text;
        b.setAttribute('aria-label', text);
        b.onclick = () => ctx.submit();
        return b;
      };
      if (!ctx.finish && placement === 'header') {
        const toolbar = u.el('div', 'fm-toolbar', nav);
        submit = end(toolbar, 'fm-end', label);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = labels.map(name).filter((x) => x.toLowerCase() !== label.toLowerCase());
          if (pool.length) {
            const d = u.el('button', 'fm-xtra', toolbar, String(cr.pick(pool)));
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.onclick = () => env.log('decoy', { label: d.textContent, collide: true });
          }
        }
      }
      if (!ctx.finish && placement !== 'header') {
        const foot = u.el('footer', 'fm-footer', main);
        submit = end(
          foot,
          placement === 'link' ? 'fm-end fm-linkend' : 'fm-end',
          placement === 'link' ? 'Mark complete' : label,
        );
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const box = u.el('section', 'fm-overlay fm-overlay-' + ctx.kind, document.body);
      box.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to improve your shopping experience.',
        toast: 'Your pickup details are up to date.',
        chat: 'Need help with your order?',
        promo: 'Fresh deals for your next visit.',
        banner: 'Pickup hours may vary by location.',
      };
      u.el('div', '', box, texts[ctx.kind] || texts.banner);
      const b = u.el('button', '', box, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      b.onclick = () => ctx.dismiss('close');
      return { el: box, dismiss: b, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
