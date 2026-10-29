(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-ticket-05',
    'brand': 'Rail Tickets - Book a Train Ticket',
    'tokens': {
      'bg': '#9cbbdc',
      'panel': '#ffffff',
      'fg': '#10224a',
      'accent': '#2f6fc4',
      'font': "'Segoe UI',Tahoma,'DejaVu Sans',Arial,sans-serif",
      'line': '#b7c8dd',
      'muted': '#4a5d7a',
    },
    'obstruction': null,
  };
  const svg = (b) =>
    '<svg viewBox="0 0 40 40" width="100%" height="100%"><defs><linearGradient id="blue" x2=".3" y2="1"><stop stop-color="#83d6ff"/><stop offset=".45" stop-color="#328dec"/><stop offset="1" stop-color="#0755bb"/></linearGradient><linearGradient id="silver" x2=".2" y2="1"><stop stop-color="#fff"/><stop offset=".5" stop-color="#d6e2ef"/><stop offset="1" stop-color="#8ea5c0"/></linearGradient><linearGradient id="gold" x2=".2" y2="1"><stop stop-color="#fff09b"/><stop offset=".5" stop-color="#ffdc55"/><stop offset="1" stop-color="#ecaf24"/></linearGradient><linearGradient id="red" x2=".2" y2="1"><stop stop-color="#ffaaa4"/><stop offset=".45" stop-color="#ef5350"/><stop offset="1" stop-color="#c52321"/></linearGradient></defs>' +
    b +
    '</svg>';
  const ICONS = {
    find: svg(
      '<path d="M25 25l10 11" stroke="#677787" stroke-width="7" stroke-linecap="round"/><path d="M26 26l8 9" stroke="url(#silver)" stroke-width="4" stroke-linecap="round"/><circle cx="16" cy="16" r="14" fill="url(#silver)" stroke="#7f9bae"/><circle cx="16" cy="16" r="11" fill="url(#blue)" stroke="#fff" stroke-width="1.5"/><ellipse cx="16" cy="13" rx="9" ry="8" fill="#d7f4ff" opacity=".7"/>',
    ),
    dates: svg(
      '<rect x="4" y="5" width="32" height="33" rx="2" fill="url(#silver)" stroke="#6f879e"/><rect x="7" y="13" width="26" height="21" fill="#fff"/><path d="M10 19h4v4h-4zm7 0h4v4h-4zm-7 7h4v4h-4zm7 0h4v4h-4z" fill="#5ea7ed"/><path d="M24 19h5v5h-5zm0 7h5v4h-5z" fill="#f16b61"/><path d="M11 2v9m18-9v9" stroke="#667f93" stroke-width="4"/><path d="M11 2v7m18-7v7" stroke="#c4e5ef" stroke-width="2"/>',
    ),
    pax: svg(
      '<circle cx="12" cy="15" r="6" fill="url(#blue)" stroke="#246bbc"/><path d="M2 34v-7c0-10 21-10 21 0v7z" fill="url(#blue)" stroke="#246bbc"/><circle cx="26" cy="10" r="8" fill="url(#blue)" stroke="#246bbc"/><path d="M14 36V25c0-12 23-12 23 0v11z" fill="url(#blue)" stroke="#246bbc"/>',
    ),
    pref: svg(
      '<path d="M16 2h8l1 5 4 2 4-2 5 7-4 4v4l4 3-4 7-5-1-4 2-1 5h-8l-1-5-4-2-5 1-4-7 4-3v-4l-4-4 5-7 4 2 4-2z" fill="url(#silver)" stroke="#829cbd" stroke-width="1.4"/><circle cx="20" cy="20" r="7" fill="#eaf4ff" stroke="#829cbd" stroke-width="1.5"/>',
    ),
    save: svg(
      '<path d="M3 3h30l4 4v30H3z" fill="url(#blue)" stroke="#3864a4"/><rect x="8" y="4" width="22" height="16" fill="url(#silver)" stroke="#edf6ff"/><path d="M8 24h23v12H8z" fill="#fff" stroke="#496fad"/><path d="M12 26h6v10h-6z" fill="#246bc4"/><path d="M5 5v30" stroke="#8cc6f8"/>',
    ),
    load: svg(
      '<path d="M4 4h12l4 5h13v25H4z" fill="url(#gold)" stroke="#d1a23a"/><path d="M7 7h8l4 5h11" fill="none" stroke="#fff6bf"/><path d="M10 18h27l-8 17H3z" fill="url(#gold)" stroke="#d1a23a"/><path d="M11 20h23" stroke="#fff4b2"/>',
    ),
    clear: svg(
      '<path d="M8 3 20 15 32 3 38 9 26 21 37 32 31 38 20 27 9 38 3 32 14 21 2 9z" fill="url(#red)" stroke="#d05a55"/>',
    ),
    print: svg(
      '<path d="M10 2h15l6 6v17H10z" fill="url(#silver)" stroke="#78889c"/><path d="M25 2v7h6" fill="#fff" stroke="#78889c"/><rect x="2" y="18" width="36" height="15" rx="3" fill="url(#silver)" stroke="#5c6b7c"/><rect x="5" y="27" width="30" height="5" fill="#405066"/><rect x="10" y="29" width="21" height="9" fill="url(#silver)" stroke="#60778a"/><rect x="13" y="31" width="15" height="5" fill="#88bee9"/>',
    ),
    mail: svg(
      '<rect x="2" y="7" width="36" height="26" rx="1" fill="url(#silver)" stroke="#8a97a8"/><path d="m3 32 13-13m21 13L24 19" stroke="#9faab6" stroke-width="1.5"/><path d="M3 8l17 17L37 8" fill="#fff" stroke="#8995a4" stroke-width="1.5"/>',
    ),
    help: svg(
      '<circle cx="20" cy="20" r="18" fill="url(#blue)" stroke="#1553be"/><ellipse cx="20" cy="10" rx="12" ry="6" fill="#fff" opacity=".2"/><text x="20" y="30" text-anchor="middle" font-size="29" font-weight="700" fill="#fff" font-family="Arial">?</text>',
    ),
    train: svg(
      '<rect x="7" y="3" width="26" height="30" rx="4" fill="#133e88" stroke="#a1c7eb"/><path d="M16 6h8" stroke="#fff" stroke-width="2"/><rect x="10" y="10" width="8" height="10" rx="1" fill="#e7f4ff"/><rect x="22" y="10" width="8" height="10" rx="1" fill="#e7f4ff"/><circle cx="13" cy="26" r="2.5" fill="#fff"/><circle cx="27" cy="26" r="2.5" fill="#fff"/><path d="M9 39l7-6m15 6l-7-6M12 36h16" stroke="#173b7b" stroke-width="2.5"/>',
    ),
    ticket:
      '<svg viewBox="0 0 136 118" width="100%" height="100%"><defs><linearGradient id="ticketBlue" x2="0" y2="1"><stop stop-color="#3898eb"/><stop offset="1" stop-color="#0873cc"/></linearGradient></defs><g transform="rotate(-28 68 59)"><path d="M12 27h111v20c-16 0-16 25 0 25v20H12V72c16 0 16-25 0-25z" fill="url(#ticketBlue)" stroke="#207cd0" stroke-width="7" stroke-linejoin="round"/><path d="M18 33h99v9c-19 4-19 32 0 36v8H18v-8c19-4 19-32 0-36z" fill="none" stroke="#fff" stroke-width="4"/><path d="M88 34v16m0 5v10m0 5v16" stroke="#fff" stroke-width="4"/></g></svg>',
    info: '<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="10.5" fill="#2f73d9"/><rect x="10.7" y="10" width="2.6" height="8" fill="#fff"/><circle cx="12" cy="6.8" r="1.7" fill="#fff"/></svg>',
  };
  const GROUPS = [
    [
      'Search',
      [
        ['Find Trains', 'find'],
        ['Travel Dates', 'dates'],
        ['Passengers', 'pax'],
        ['Preferences', 'pref'],
      ],
    ],
    [
      'Journey',
      [
        ['Save Journey', 'save'],
        ['Load Journey', 'load'],
        ['Clear', 'clear'],
      ],
    ],
    [
      '',
      [
        ['Print', 'print'],
        ['Email', 'mail'],
      ],
    ],
    ['Support', [['Help', 'help']]],
  ];
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'instruction-' + ctx.display;
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const placement = ctx.finish ? null : endRng.pick(['footer', 'footer', 'toolbar', 'link']);
      const endLabel = placement === 'footer' ? 'Submit' : endRng.pick(endLabels.filter((label) => label !== 'Submit'));
      const shell = u.el('div', 'site-shell', document.body);
      const tb = u.el('header', 'titlebar', shell);
      const ai = u.el('div', 'app-orb', tb);
      ai.innerHTML = ICONS.train;
      u.el('div', 'title-text', tb, D.brand);
      const wc = u.el('div', 'win-ctl', tb);
      u.el('span', 'wmin', wc, '▁');
      u.el('span', 'wmax', wc, '□');
      u.el('span', 'wclose', wc, '✕');
      const tabs = u.el('nav', 'tabs', shell);
      ['Home', 'View', 'Tools', 'Help'].forEach((t, i) => u.el('span', i === 0 ? 'on' : '', tabs, t));
      const rib = u.el('div', 'ribbon', shell);
      for (const [gname, items] of GROUPS) {
        const g = u.el('div', 'rgroup', rib);
        const row = u.el('div', 'rrow', g);
        for (const [label, ic] of items) {
          const b = u.el('button', 'rbtn', row);
          b.type = 'button';
          const i = u.el('span', 'ric', b);
          i.innerHTML = ICONS[ic];
          u.el('span', 'rlab', b, label);
          b.addEventListener('click', () => env.log('decoy', { what: label }));
        }
        u.el('div', 'rgname', g, gname || ' ');
      }
      const surface = u.el('div', 'surface', shell);
      const note = u.el('section', 'task-note', surface);
      note.dataset.role = 'instruction';
      const ti = u.el('div', 'note-icon', note);
      ti.innerHTML = ICONS.ticket;
      const nt = u.el('div', 'note-text', note);
      if (ctx.display !== 'hidden') u.el('p', 'food-task', nt, ctx.instruction);
      u.el(
        'p',
        'brief-help',
        nt,
        ctx.finish
          ? 'Select one of the tickets below click Buy ticket.'
          : `Select one of the tickets below click Buy ticket, then ${endLabel}.`,
      );
      const stage = u.el('main', 'stage', surface);
      const footer = u.el('footer', 'design-footer', surface);
      // The widget fills this slot on every render; keep the frame node intact.
      u.el('div', 'ticket-details', footer);
      const spacer = u.el('div', 'foot-gap', footer);
      const bt = u.el('button', 'buy-ticket', footer, 'Buy ticket');
      bt.type = 'button';
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? tabs : footer;
        submit = u.el(
          'button',
          'end-control' + (placement === 'toolbar' ? ' end-toolbar' : placement === 'link' ? ' end-link' : ''),
          parent,
          endLabel,
        );
        submit.type = 'button';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.dataset.role = 'submit';
        submit.addEventListener('click', () => ctx.submit());
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const options = [...new Set(endLabels)].filter(
          (label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (options.length) {
          const label = collideRng.pick(options);
          const decoy = u.el('button', 'chrome-xtra', tabs, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      const tk = u.el('div', 'taskbar', shell);
      const st = u.el('div', 'start-orb', tk);
      st.innerHTML =
        '<svg viewBox="0 0 40 40"><path d="M8 8c6-3 9 3 14 0l-2 11c-5 3-8-3-14 0z" fill="#f04b2c"/><path d="M24 8c4-2 7 0 11-1l-2 11c-4 1-7-1-11 1z" fill="#8ac537"/><path d="M6 21c6-3 9 3 14 0l-2 11c-5 3-8-3-14 0z" fill="#38a8ed"/><path d="M22 21c4-2 7 0 11-1l-2 11c-4 1-7-1-11 1z" fill="#ffd74a"/></svg>';
      const folder = u.el('div', 'tb-btn tb-a', tk);
      folder.innerHTML = svg(
        '<path d="M3 5h13l4 4h17v27H3z" fill="url(#gold)" stroke="#bb913b"/><path d="M4 13h32v8H4z" fill="#e8f9ff"/><path d="M3 17h34v19H3z" fill="url(#gold)" stroke="#ceac57"/><rect x="16" y="27" width="15" height="9" fill="#d8eefc" stroke="#7eafcf"/>',
      );
      const media = u.el('div', 'tb-btn tb-b', tk);
      media.innerHTML = svg(
        '<rect x="3" y="5" width="34" height="31" rx="3" fill="#3c8dc2" stroke="#a5d3ed"/><circle cx="20" cy="20" r="13" fill="url(#gold)" stroke="#fff"/><path d="M16 11 29 20 16 29z" fill="#fff"/>',
      );
      const ta = u.el('div', 'tb-btn tb-c on', tk);
      ta.innerHTML = ICONS.train;
      const tray = u.el('div', 'tb-tray', tk);
      tray.innerHTML =
        '<svg viewBox="0 0 102 30"><path d="m5 18 6-7 6 7z" fill="#fff" stroke="#344f71"/><path d="M34 12h5l7-6v20l-7-6h-5z" fill="#fff" stroke="#344f71"/><path d="M50 10q9 6 0 12m4-17q15 11 0 22" fill="none" stroke="#fff" stroke-width="2"/><path d="M70 6h23v17H70zM75 26h14m-7-3v3M74 3v7" fill="none" stroke="#fff" stroke-width="2"/></svg>';
      const clock = u.el('div', 'tb-clock', tk);
      u.el('div', '', clock, '10:24');
      u.el('div', '', clock, '14/10/2008');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
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
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  });
})();
