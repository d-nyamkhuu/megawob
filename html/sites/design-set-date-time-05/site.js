(function () {
  'use strict';
  const C = {
    site: 'design-set-date-time-05',
    brand: 'Harbor & Oak',
    sub: 'Restaurant Reservations',
    tabs: ['Reservations', 'Tables', 'Menu', 'Guests', 'Settings'],
    cols: ['Date', 'Time', 'Guest Name', 'Party Size', 'Table', 'Status'],
    rows: [
      ['6:00 PM', 'Taylor Kim', '2', 'T3', 'Seated'],
      ['6:30 PM', 'Jordan Lee', '4', 'T5', 'Seated'],
      ['7:00 PM', 'Morgan Patel', '2', 'T2', 'Arrived'],
      ['7:30 PM', 'Casey Brown', '5', 'T8', 'Confirmed'],
      ['8:00 PM', 'Riley Chen', '3', 'T6', 'Confirmed'],
      ['8:30 PM', 'Alex Martinez', '2', 'T4', 'Pending'],
      ['9:00 PM', 'Jamie Wilson', '4', 'T7', 'Pending'],
    ],
  };
  const FORK =
    '<svg width="40" height="44" viewBox="0 0 40 44" fill="none" stroke="#53627e" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4v12a4 4 0 0 0 8 0V4M13 4v36M28 40V4c-5 3-7 9-7 16h7"/></svg>';
  const SEARCH =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#56627a" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>';
  const CAL =
    '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2f6fe0" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>';
  const PEOPLE =
    '<svg width="30" height="26" viewBox="0 0 32 26" fill="none" stroke="#56627a" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="8" r="4.5"/><path d="M7 23c0-5 4-8 9-8s9 3 9 8H7zM7 15c-3 1-5 4-5 7h3M25 15c3 1 5 4 5 7h-3M6 12a3.5 3.5 0 0 1 0-7M26 12a3.5 3.5 0 0 0 0-7"/></svg>';
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const body = u.el('div', 'ds-body', document.body);
      const top = u.el('header', 'ds-top', body);
      const brand = u.el('div', 'ds-brandbox', top);
      const logo = u.el('span', 'ds-logo', brand);
      logo.innerHTML = FORK;
      const bt = u.el('div', 'ds-brandtext', brand);
      u.el('div', 'ds-brand', bt, C.brand);
      u.el('div', 'ds-brandsub', bt, C.sub);
      const nav = u.el('nav', 'ds-menu', top);
      C.tabs.forEach((t, i) => u.el('span', 'ds-tab' + (i ? '' : ' on'), nav, t));
      const search = u.el('div', 'ds-search', top);
      const si = u.el('span', '', search);
      si.innerHTML = SEARCH;
      u.el('span', 'ds-ph', search, 'Search reservations...');
      let display = ctx.display || 'header';
      if ((display === 'panel' || display === 'toast') && window.innerWidth < 1260) display = 'header';
      const headerInline = display === 'header' && window.innerWidth < 1260;
      const ends =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const er = ctx.rng.fork('chrome/end'),
        base = ends.find((x) => labelOf(x).toLowerCase() === 'submit') || ends[0];
      const baseline = !ctx.finish && er.bool(0.5),
        placement = ctx.finish ? null : baseline ? 'footer' : er.pick(['header', 'preview']);
      const endLabel = baseline
        ? labelOf(base)
        : labelOf(
            er.pick(
              ends.map(labelOf).filter((x) => x.trim().toLowerCase() !== labelOf(base).trim().toLowerCase()).length
                ? ends.map(labelOf).filter((x) => x.trim().toLowerCase() !== labelOf(base).trim().toLowerCase())
                : ends,
            ),
          );
      const cr = ctx.rng.fork('chrome/collide'),
        pool = [...new Set(ends.map(labelOf))].filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collision = !ctx.finish && pool.length && cr.bool(0.3) ? labelOf(cr.pick(pool)) : null;
      const headerActions = u.el('div', 'ds-header-actions', top);
      const decoy = (parent, text, collide) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collide ? { label: text, collide: true } : { label: text }));
      };
      if (collision) decoy(headerActions, collision, true);
      let submit = null;
      const makeEnd = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', text);
        b.title = text;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (placement === 'header') submit = makeEnd(headerActions, 'ds-submit ds-header-submit', endLabel);
      if (display === 'header' && !headerInline) {
        const note = u.el('aside', 'ds-header-note', body);
        const icon = u.el('span', 'ds-noteic', note);
        icon.innerHTML = CAL;
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const main = u.el('div', 'ds-main', body);
      const led = u.el('section', 'ds-ledger', main);
      const tbl = u.el('div', 'ds-table', led);
      const head = u.el('div', 'ds-tr ds-th', tbl);
      C.cols.forEach((c) => {
        const s = u.el('span', '', head, c);
        u.el('i', 'ds-sort', s, '');
      });
      C.rows.forEach((r) => {
        const tr = u.el('div', 'ds-tr', tbl);
        ['Apr 26, 2025', r[0], r[1], r[2], r[3]].forEach((v) => u.el('span', '', tr, v));
        const st = u.el('span', '', tr);
        u.el('em', 'ds-badge ds-b-' + r[4].toLowerCase(), st, r[4]);
      });
      const right = u.el('div', 'ds-right', main);
      const panel = u.el('section', 'ds-panel', right);
      u.el('h2', '', panel, 'New Reservation');
      if (display === 'panel' || headerInline) {
        const n = u.el('aside', 'ds-notebox', panel);
        const ic = u.el('span', 'ds-noteic', n);
        ic.innerHTML = CAL;
        u.el('div', 'ds-instruction', n, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', panel);
      const foot = u.el('footer', 'ds-footer', panel);
      const cancel = u.el('button', 'ds-cancel', foot, 'Clear');
      cancel.type = 'button';
      if (placement === 'footer') submit = makeEnd(foot, 'ds-submit', endLabel);
      const rail = u.el('aside', 'ds-rail', right);
      const rh = u.el('h2', '', rail);
      const ri = u.el('span', '', rh);
      ri.innerHTML = PEOPLE;
      u.el('span', 'ds-rail-title', rh, 'Reservation Preview');
      if (placement === 'preview') submit = makeEnd(rh, 'ds-submit ds-preview-submit', endLabel);
      u.el('div', 'ds-reservation-values', rail);
      if (display === 'toast') {
        const note = u.el('aside', 'ds-toast-note', led);
        const icon = u.el('span', 'ds-noteic', note);
        icon.innerHTML = CAL;
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
