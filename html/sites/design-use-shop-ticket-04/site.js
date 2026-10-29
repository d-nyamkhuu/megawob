(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-ticket-04',
    'brand': 'TravelHub',
    'mode': 'side-left',
    'tokens': {
      'bg': '#2a5fb4',
      'panel': '#ffffff',
      'fg': '#111111',
      'accent': '#0a58b8',
      'font': 'Arial,Helvetica,sans-serif',
      'line': '#8a8f98',
      'muted': '#444a52',
    },
    'obstruction': null,
    'footer': '',
  };
  const SIDE = [
    ['Travel Center', ['Flights', 'Trains', 'Coaches', 'Ferries', 'Hotels', 'Car Hire']],
    ['Plan Your Trip', ['Maps', 'Timetables', 'City Guides', 'Travel News']],
    ['Services', ['Travel Insurance', 'Currency Info', 'Visa Information', 'Baggage Rules']],
    ['Useful Links', ['Weather', 'Holiday Ideas', 'Special Offers', 'Contact Us']],
  ];
  const TOP = ['Home', 'Destinations', 'Travel Tips', 'Help'];
  const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
  const GLOBE =
    '<svg viewBox="0 0 40 40" width="100%" height="100%"><defs><radialGradient id="ocean" cx="35%" cy="30%"><stop stop-color="#fff"/><stop offset=".45" stop-color="#4ddfff"/><stop offset="1" stop-color="#0876d1"/></radialGradient></defs><circle cx="20" cy="20" r="18" fill="url(#ocean)" stroke="#001d57" stroke-width="1.2"/><g fill="none" stroke="#00316b" stroke-width="1.2"><ellipse cx="20" cy="20" rx="8" ry="18"/><ellipse cx="20" cy="20" rx="14" ry="18"/><path d="M2 20h36M5 11h30M5 29h30M20 2v36"/></g></svg>';
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'side-left instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const gl = u.el('div', 'tp-globe', header);
      gl.innerHTML = GLOBE;
      u.el('div', 'design-brand', header, D.brand);
      u.el('div', 'design-tag', header, 'Travel Directory & Ticket Shop');
      const tn = u.el('nav', 'design-nav', header);
      TOP.forEach((t, i) => {
        if (i) u.el('span', 'sep', tn, '|');
        const a = u.el('a', '', tn, t);
        a.href = '#';
        a.addEventListener('click', (e) => {
          e.preventDefault();
          env.log('decoy', { what: t });
        });
      });
      const body = u.el('div', 'design-body', shell);
      const side = u.el('aside', 'tp-side', body);
      for (const [h, ls] of SIDE) {
        u.el('div', 'tp-sh', side, h);
        const ul = u.el('div', 'tp-links', side);
        for (const l of ls) {
          const a = u.el('a', l === 'Coaches' ? 'on' : '', ul, l);
          a.href = '#';
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: l });
          });
        }
      }
      const col = u.el('div', 'tp-col', body);
      const note = u.el('section', 'task-note', col);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') u.el('p', 'food-task', note, ctx.instruction);
      const frm = u.el('section', 'tp-form', col);
      u.el('div', 'tp-fh', frm, 'Coach Tickets');
      const fb = u.el('div', 'tp-fb', frm);
      const f1 = u.el('div', 'tp-fc', fb);
      for (const [l, k] of [
        ['From:', 'from'],
        ['To:', 'to'],
        ['Date:', 'date'],
      ]) {
        const r = u.el('div', 'tp-fr', f1);
        u.el('span', '', r, l);
        const val = u.el('span', 'tp-in ' + k, r, '—');
        val.dataset.field = k;
        if (k === 'date') u.el('span', 'tp-calendar', r, '▦');
      }
      const f2 = u.el('div', 'tp-fc tp-f2', fb);
      const pr = u.el('div', 'tp-fr', f2);
      u.el('span', '', pr, 'Passengers:');
      u.el('span', 'tp-in sm', pr, '1');
      u.el('div', 'tp-chk', f2, 'Show all operators');
      u.el('span', 'tp-sbtn', f2, 'Search');
      const stage = u.el('main', 'stage', col);
      const footer = u.el('footer', 'design-footer', col);
      const vd = u.el('button', 'view-details', footer, 'View Details');
      vd.type = 'button';
      vd.addEventListener('click', () => env.log('decoy', { what: 'View Details' }));
      const buy = u.el('button', 'purchase-control', footer, 'Buy Ticket');
      buy.type = 'button';
      const er = ctx.rng.fork('chrome/end');
      const endWords = (
        ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', '✓']
      ).map(labelOf);
      const original = er.bool(0.5);
      const placement = original ? 'footer' : er.pick(['header', 'palette-link']);
      const label = original ? 'Submit' : er.pick(endWords.filter((t) => t !== 'Submit'));
      let submit = null;
      const endControl = (parent, cls, link = false) => {
        const b = u.el(link ? 'a' : 'button', cls, parent, label);
        if (link) b.href = '#';
        else b.type = 'button';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (!ctx.finish && placement === 'footer') submit = endControl(footer, 'end-control');
      if (!ctx.finish && placement === 'header') submit = endControl(header, 'end-control tp-header-end');
      const status = u.el('div', 'tp-status', shell);
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const alternatives = [...new Set(endWords)].filter(
          (t) => t.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (alternatives.length) {
          const text = cr.pick(alternatives);
          const decoy = u.el('button', 'tp-xtra', status, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      const pal = u.el('aside', 'tp-palette', document.body);
      const tb = u.el('div', 'tp-ptitle', pal);
      u.el('span', 'tp-pico', tb, '');
      u.el('span', '', tb, 'Trip Planner');
      u.el('span', 'tp-pbtn', tb, '–');
      u.el('span', 'tp-pbtn', tb, '×');
      u.el('div', 'tp-psel', pal, 'Selected Ticket');
      const pf = u.el('div', 'tp-pfields', pal);
      for (const f of ['Operator', 'Departure', 'Arrival', 'Duration', 'Price']) {
        const r = u.el('div', '', pf);
        u.el('span', '', r, f + ':');
        const v = u.el('span', '', r, '—');
        v.dataset.ticketField = f;
      }
      const pc = u.el('div', 'tp-pfoot', pal);
      const cl = u.el('button', '', pc, 'Clear');
      cl.type = 'button';
      cl.addEventListener('click', () => env.log('decoy', { what: 'Clear' }));
      if (!ctx.finish && placement === 'palette-link') {
        pc.classList.add('has-end');
        submit = endControl(pc, 'tp-end-link', true);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const named = D.obstruction;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) {
        [title, copy, label] = named;
      }
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept all');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      if (/Tip/.test(title)) {
        const c = u.el('label', '', el);
        c.style.cssText = 'display:block;padding:0 22px 14px';
        const ch = u.el('input', '', c);
        ch.type = 'checkbox';
        c.append(' Do not show again');
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  });
})();
