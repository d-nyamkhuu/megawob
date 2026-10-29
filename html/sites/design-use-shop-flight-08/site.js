(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-flight-08',
    'brand': 'Campus Caf\u00e9 \u2013 Food Ordering',
    'mode': 'side-left',
    'tokens': {
      'bg': '#38404c',
      'panel': '#15171b',
      'fg': '#e8e8ea',
      'accent': '#2172da',
      'font': "'Helvetica Neue',Helvetica,Arial,sans-serif",
      'line': '#30343a',
      'muted': '#a2a7af',
    },
    'nav': 'File    Edit    View    Tools    Window    Help',
    'obstruction': null,
    'footer': '',
  };
  const svg = (body, fill = 'none') =>
    `<svg viewBox="0 0 32 32" fill="${fill}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  const icons = {
    Flights: svg('<path d="M4 4l3-1 10 9 9-5c5-2 7 0 3 3l-9 6 1 11-3 2-4-10-7 3-3-2 6-6z"/>', '#d4dce2'),
    Hotels: svg('<path d="M3 8v20M29 14v14M3 23h26M7 13h6v7H7zM15 14h12v6H15"/>'),
    Cars: svg('<path d="M5 15l4-9h14l4 9M4 15h24v10H4zM7 25v4M25 25v4M8 19h3M21 19h3"/>'),
    'My Trips': svg(
      '<rect x="5" y="6" width="22" height="23" rx="2"/><path d="M11 3v6M21 3v6M5 12h22M10 17h3M18 17h4M10 22h3M18 22h4"/>',
    ),
    'Sign In': svg('<circle cx="16" cy="9" r="6"/><path d="M5 28v-3c0-6 6-8 11-8s11 2 11 8v3z"/>', '#c7cdd3'),
    Help: svg(
      '<circle cx="16" cy="16" r="12" fill="#c7cdd3"/><path d="M12 12c0-6 10-5 9 0 0 3-5 3-5 6M16 23h.1" stroke="#262b30"/>',
    ),
    apple: svg(
      '<path d="M19 7c-2-4 2-6 5-6 0 4-2 6-5 6zM17 10c-5-4-11-2-12 4-2 7 4 16 8 16 3 0 4-2 7 0 4 2 7-3 9-7-6-3-7-9-1-12-4-4-7-3-11-1z" stroke="none"/>',
      '#101820',
    ),
    wifi: svg('<path d="M3 10c7-8 19-8 26 0M7 15c5-5 13-5 18 0M11 20c3-3 7-3 10 0M15 25h2"/>'),
    sound: svg('<path d="M3 12h6l7-6v20l-7-6H3z" fill="#101820"/><path d="M21 10c4 4 4 8 0 12M25 6c6 6 6 14 0 20"/>'),
    battery: svg(
      '<rect x="2" y="8" width="26" height="16" rx="2"/><path d="M30 13v6"/><rect x="5" y="11" width="20" height="10" fill="#101820" stroke="none"/>',
    ),
    finder: svg(
      '<rect x="1" y="1" width="30" height="30" rx="3" fill="#92c6ef" stroke="#426c98"/><path d="M2 2h14l-4 17h6v12H2" fill="#4198eb" stroke="none"/><path d="M8 9v4M25 9v4M7 22c5 5 13 5 18-1M17 3l-4 15h6v12" stroke="#223349" stroke-width="1.4"/>',
    ),
    globe: svg(
      '<circle cx="16" cy="16" r="14" stroke="#4b97dc"/><ellipse cx="16" cy="16" rx="7" ry="14" stroke="#4b97dc"/><path d="M2 16h28M5 8c6 3 16 3 22 0M5 24c6-3 16-3 22 0" stroke="#4b97dc"/>',
    ),
    calendar: svg(
      '<rect x="4" y="5" width="24" height="25" fill="#d5dce1" stroke="#63737c"/><path d="M4 10h24" stroke="#dab565" stroke-width="7"/><path d="M10 1v8M22 1v8" stroke="#526b84"/><path d="M9 15h3M16 15h3M23 15h1M9 20h3M16 20h3M9 25h3M16 25h3" stroke="#85939c"/>',
    ),
    trash: svg(
      '<path d="M6 5l2 23c0 4 16 4 16 0l2-23" fill="#64717c" stroke="#aab3bb"/><ellipse cx="16" cy="5" rx="11" ry="3" fill="#8b98a1" stroke="#b0bac0"/><path d="M11 10l1 17M17 10v18M22 10l-2 17" stroke="#8999a5" stroke-width="1"/>',
    ),
  };
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
      u.el('span', 'mb-apple', header).innerHTML = icons.apple;
      u.el('b', 'design-brand', header, 'TravelBook');
      for (const m of ['File', 'Edit', 'View', 'Tools', 'Window', 'Help']) u.el('span', 'mb-item', header, m);
      const status = u.el('div', 'mb-status', header);
      for (const k of ['wifi', 'sound', 'battery']) u.el('span', '', status).innerHTML = icons[k];
      u.el('span', 'mb-clock', header, 'Mon Nov 2, 2009   10:24 AM');
      const body = u.el('div', 'design-body', shell);
      let note = null;
      note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') u.el('p', 'food-task', note, ctx.instruction);
      const win = u.el('div', 'tb-win', body);
      const tbar = u.el('div', 'tb-title', win);
      for (const c of ['#ec5f57', '#f2bf3a', '#5bc84a']) {
        const d = u.el('i', '', tbar);
        d.style.background = c;
      }
      u.el('span', 'tb-name', tbar, 'TravelBook');
      const tools = u.el('div', 'tb-tools', win);
      for (const [t, on] of [
        ['Flights', 1],
        ['Hotels', 0],
        ['Cars', 0],
        ['My Trips', 0],
      ]) {
        const b = u.el('div', 'tb-tab' + (on ? ' on' : ''), tools);
        u.el('em', '', b).innerHTML = icons[t];
        u.el('span', '', b, t);
      }
      u.el('div', 'tb-sp', tools);
      for (const [t, g] of [
        ['Sign In', '●'],
        ['Help', '?'],
      ]) {
        const b = u.el('div', 'tb-tab', tools);
        u.el('em', '', b).innerHTML = icons[t];
        u.el('span', '', b, t);
      }
      const stage = u.el('main', 'stage', win);
      const footer = u.el('footer', 'design-footer', win);
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const original = er.bool(0.5);
      const placement = original ? 'footer' : er.pick(['toolbar', 'link']);
      const label = original ? 'Submit' : er.pick(endWords);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? tbar : footer;
        submit = u.el('button', 'end-control end-' + placement, parent, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const alternatives = endWords.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (alternatives.length) {
          const text = cr.pick(alternatives);
          const decoy = u.el('button', 'chrome-xtra', tools.querySelector('.tb-sp'), text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      if (ctx.finish || placement === 'toolbar') u.el('span', 'footer-status', footer, 'TravelBook · Ready');
      const dock = u.el('div', 'tb-dock', shell);
      for (const k of ['finder', 'globe', 'calendar', 'trash']) u.el('i', '', dock).innerHTML = icons[k];
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
