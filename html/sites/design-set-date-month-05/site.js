(function () {
  'use strict';
  const C = {
    'site': 'design-set-date-month-05',
    'brand': 'Library Study Room Reservation',
    'title': 'Reservation Details',
    'instruction': 'top',
    'rail': 'Your Reservation|Need Help?',
    'menu': 'Riverside Community Library',
    'briefTitle': 'Instructions',
  };
  env.site({
    name: C.site,
    template: 'site/base',
    design: { parts: {
    frame: () => function (ctx) {
      const u = ctx.util;
      const body = u.el('div', 'ds-body', document.body);
      const tb = u.el('div', 'ds-title', body);
      const sys = u.el('span', 'ds-sysmenu', tb);
      sys.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16" stroke="#18212b" stroke-width="2"/></svg>';
      u.el('span', 't', tb, 'Reports');
      ['min', 'max', 'close'].forEach((g) => {
        const b = u.el('span', 'ds-wb ' + g, tb);
        b.innerHTML = g === 'min' ? '<svg viewBox="0 0 24 24"><path d="M5 18h14" stroke="#111" stroke-width="2"/></svg>' : g === 'max' ? '<svg viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" fill="none" stroke="#111" stroke-width="2"/></svg>' : '<svg viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" stroke="#111" stroke-width="2"/></svg>';
      });
      const menu = u.el('nav', 'ds-menu', body);
      ['File', 'Edit', 'View', 'Records', 'Tools', 'Help'].forEach((m) => {
        const s = u.el('span', 'mi', menu);
        if (['File', 'Records', 'Help'].includes(m)) {
          u.el('u', '', s, m[0]);
          s.append(m.slice(1));
        } else s.textContent = m;
      });
      const mid = u.el('div', 'ds-mid', body);
      const rail = u.el('aside', 'ds-rail', mid);
      const rh = u.el('div', 'rh', rail);
      u.el('span', '', rh, 'Monthly Reports');
      const pin = u.el('span', 'pin', rh);
      pin.innerHTML = '<svg viewBox="0 0 24 24"><path d="M8 3h8l-1 5 3 4v2h-5l-1 7-1-7H6v-2l3-4z" fill="#111" stroke="#111"/><path d="M12 19v4" stroke="#111"/></svg>';
      const cols = u.el('div', 'cols', rail);
      u.el('span', 'a', cols, 'Month');
      u.el('span', 'b', cols, 'Title');
      const lst = u.el('div', 'lst', rail);
      const rows = u.el('div', 'rows', lst);
      ['Dec', 'Nov', 'Oct', 'Sep', 'Aug', 'Jul', 'Jun', 'May', 'Apr', 'Mar', 'Feb', 'Jan'].forEach((m) => {
        const r = u.el('div', 'r', rows);
        u.el('span', 'a', r, m + ' 1992');
        u.el('span', 'b', r, 'Sales Summary');
      });
      const sb = u.el('div', 'sb', lst);
      u.el('span', '', sb, '▲');
      u.el('i', '', sb);
      u.el('span', '', sb, '▼');
      const content = u.el('div', 'ds-content', mid);
      const top = u.el('header', 'ds-top', menu);
      const main = u.el('div', 'ds-main', content);
      function note(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('div', 'ds-note-title', b, 'Task Note');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      const disp = (ctx.display === 'panel' || ctx.display === 'toast') && window.innerWidth < 1260 ? 'header' : ctx.display;
      if (disp !== 'hidden') {
        if (disp === 'panel') note(main, 'ds-brief');
        else {
          const n = note(content, disp === 'toast' ? 'ds-toast' : 'ds-header-note');
          if (disp === 'header') tb.insertBefore(n, tb.querySelector('.ds-wb'));
          else content.insertBefore(n, main);
        }
      }
      const stage = u.el('main', 'ds-stage', main);
      const foot = u.el('footer', 'ds-footer', content);
      const endRng = ctx.rng.fork('chrome/end');
      const bank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      let placement = null,
        label = 'Submit';
      if (!ctx.finish) {
        if (endRng.bool(0.5)) {
          placement = 'footer';
        } else {
          const alternatives = bank.map(labelOf).filter((x) => x.trim().toLowerCase() !== 'submit');
          if (alternatives.length) label = endRng.pick(alternatives);
          placement = endRng.pick(['footer', 'footer', 'header', 'link']);
        }
      }
      let submit = null;
      const endButton = (parent, cls, text, asLink) => {
        const b = u.el(asLink ? 'a' : 'button', cls, parent, text);
        if (asLink) {
          b.href = '#';
        } else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (placement === 'header') submit = endButton(top, 'ds-end-header', label, false);
      if (placement === 'footer') submit = endButton(foot, 'ds-submit', label, false);
      if (placement === 'link') submit = endButton(foot, 'ds-end-link', label + ' ›', true);
      if (!ctx.finish) {
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const words = bank.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (words.length) {
            const text = cr.pick(words);
            const d = u.el('button', 'ds-xtra', foot, text);
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
      const dock = u.el('div', 'ds-dock', body);
      const ic = {
        Reports: '<svg viewBox="0 0 50 50"><defs><linearGradient id="bars"><stop stop-color="#fafafa"/><stop offset=".34" stop-color="#8d959a"/><stop offset=".5" stop-color="#303940"/><stop offset="1" stop-color="#606a71"/></linearGradient></defs><g fill="url(#bars)" stroke="#20272d"><rect x="5" y="22" width="9" height="25"/><rect x="21" y="4" width="9" height="43"/><rect x="37" y="11" width="9" height="36"/></g><path d="M7 24h4M23 6h4M39 13h4" stroke="#fff"/><path d="M15 31h4v16h-4M31 25h4v22h-4" fill="#343d43" stroke="#15191d"/></svg>',
        Accounts: '<svg viewBox="0 0 50 50"><g stroke="#30363b" stroke-linejoin="round"><path d="M3 13 35 3v25L3 38z" fill="#f0f1f2"/><path d="M8 17 40 7v25L8 42z" fill="#ebedee"/><path d="M15 22 47 12v25L15 47z" fill="#a8adb1"/></g><path d="m5 15 28-9M10 19 38 10M17 24 45 15" stroke="#fff"/><path d="M12 19v24" stroke="#72777b"/></svg>',
        Customers: '<svg viewBox="0 0 50 50"><g fill="#3e4449" stroke="#171b1f"><circle cx="7" cy="16" r="3.5"/><circle cx="25" cy="7" r="4.5"/><circle cx="43" cy="16" r="3.5"/><path d="M1 44V28q0-7 6-7t6 7v16z"/><path d="M16 47V24q0-10 9-10t9 10v23z"/><path d="M37 44V28q0-7 6-7t6 7v16z"/></g><path d="M18 45V24q0-8 6-8M3 42V29M39 42V29" fill="none" stroke="#8e9499"/></svg>',
        Products: '<svg viewBox="0 0 50 50"><path d="M25 3 45 14 25 25 5 14z" fill="#eff0f1"/><path d="M5 14 25 25v23L5 37z" fill="#c1c5c9"/><path d="m25 25 20-11v23L25 48z" fill="#91979d"/><path d="M25 3 45 14v23L25 48 5 37V14zM5 14l20 11 20-11M25 25v23" stroke="#262c31" stroke-width="1.5" fill="none"/></svg>',
        Orders: '<svg viewBox="0 0 50 50"><rect x="8" y="3" width="35" height="44" fill="#f1f2f3" stroke="#24292e" stroke-width="1.5"/><path d="M11 45V6h29" fill="none" stroke="#fff"/><path d="M12 8h27v35H12z" fill="#c0c4c7" stroke="#777d82"/><path d="M15 12h21M15 18h21M15 24h21M15 30h21M15 36h21" stroke="#40474d"/><path d="M15 14h21M15 20h21M15 26h21M15 32h21M15 38h21" stroke="#eef0f1"/></svg>',
      };
      Object.keys(ic).forEach((k) => {
        const it = u.el('div', 'it', dock);
        const g = u.el('span', '', it);
        g.innerHTML = ic[k];
        u.el('span', '', it, k);
      });
      return { stage, submit };
    },
    overlay: () => function (ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      if (ctx.kind === 'banner') el.style.top = document.querySelector('.ds-menu').getBoundingClientRect().bottom + 'px';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
        clear: 'Something went wrong. The form was reset; please fill it in again.',
        revert: "Couldn't save your change. Please try again.",
        saved: 'Changes saved.',
      };
      u.el('div', '', el, texts[ctx.kind] || 'Notice.');
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : ctx.kind === 'clear' ? 'OK' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      const ttl = { toast: 4, saved: 2, revert: 5 };
      return { el, dismiss, ttlSteps: ttl[ctx.kind] || 0 };
    },
    } },
  });
})();
