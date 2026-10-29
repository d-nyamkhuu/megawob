(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-ticket-07',
    'brand': 'TrailGuide Tickets',
    'tokens': {
      'bg': '#1a1029',
      'panel': '#241838',
      'fg': '#f3effb',
      'accent': '#ff5c6c',
      'font': "'Segoe UI',Arial,sans-serif",
      'line': '#3b2e57',
      'muted': '#b9accf',
    },
  };
  const BUS =
    '<svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="2.5" width="14" height="12" rx="3"/><path d="M3 9h14M6 17.5v-3M14 17.5v-3"/><circle cx="6.5" cy="12" r=".6"/><circle cx="13.5" cy="12" r=".6"/></svg>';
  const NAV = [
    [
      'Tickets',
      '<svg viewBox="0 0 20 20" width="22" height="22" fill="currentColor"><path d="M2 7l3-3 13 0 0 3a2 2 0 0 0 0 4v3l-3 3H5l-3-3v-3a2 2 0 0 0 0-4z" transform="rotate(-35 10 10) scale(.9) translate(1 1)"/><path d="M10 6v2m0 1v2m0 1v2" stroke="#6c3e55"/></svg>',
    ],
    [
      'Trips',
      '<svg viewBox="0 0 20 20" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="14" height="13" rx="1"/><path d="M3 8h14M7 2v3M13 2v3M6 11h2m2 0h2m2 0h1M6 14h2m2 0h2m2 0h1"/></svg>',
    ],
    [
      'Saved',
      '<svg viewBox="0 0 20 20" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 3h10v14l-5-4-5 4zM7 5h6"/></svg>',
    ],
    [
      'Settings',
      '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m10 2 4 0 .7 3 2 1.2 2.9-.9 2 3.4-2.2 2.1v2.4l2.2 2.1-2 3.4-2.9-.9-2 1.2-.7 3h-4l-.7-3-2-1.2-2.9.9-2-3.4 2.2-2.1v-2.4L2.4 8.8l2-3.4 2.9.9 2-1.2z"/><circle cx="12" cy="12" r="3.2"/></svg>',
    ],
  ];
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
      const lg = u.el('span', 'tg-logo', header);
      lg.innerHTML = BUS;
      u.el('div', 'design-brand', header, D.brand);
      u.el('div', 'window-controls', header, '—    ☐    ✕');
      const body = u.el('div', 'design-body', shell);
      const rail = u.el('nav', 'tg-rail', body);
      NAV.forEach(([n, svg], i) => {
        const it = u.el('div', 'tg-nav' + (i ? '' : ' on'), rail);
        const ic = u.el('span', '', it);
        ic.innerHTML = svg;
        u.el('em', '', it, n);
      });
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') u.el('p', 'food-task', note, ctx.instruction);
      const bar = u.el('div', 'tg-route', body);
      [
        ['From', 'Rivermouth', 'f'],
        ['⇄', '', 's'],
        ['To', 'Stonebridge', 't'],
        ['', 'Tue, Apr 14, 2026', 'd'],
        ['', '1 passenger', 'p'],
      ].forEach(([l, v, c]) => {
        const w = u.el('div', 'tg-r ' + c, bar);
        if (l) u.el('span', '', w, l);
        if (c === 'd' || c === 'p') {
          const icon = u.el('span', 'route-icon', w);
          icon.innerHTML =
            c === 'd'
              ? NAV[1][1]
              : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="7" r="4"/><path d="M4 22v-3c0-7 16-7 16 0v3"/></svg>';
        }
        if (v) u.el('b', '', w, v);
        if (c === 'p') u.el('span', 'route-chevron', w, '⌄');
      });
      const stage = u.el('main', 'stage', body);
      const prev = u.el('aside', 'tg-preview', body);
      const ph = u.el('div', 'tg-ph', prev);
      const pi = u.el('span', '', ph);
      pi.innerHTML = BUS;
      u.el('span', '', ph, 'Trip Preview');
      const closePreview = u.el('i', '', ph);
      closePreview.innerHTML =
        '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.3"><path d="m4 4 12 12M16 4 4 16"/></svg>';
      const pb = u.el('div', 'tg-pb', prev);
      u.el('div', '', pb, 'No ticket selected');
      u.el('small', '', pb, 'Choose a ticket from the list to see the details here.');
      const pbuy = u.el('button', 'tg-pbuy', pb, 'Buy');
      pbuy.type = 'button';
      pbuy.disabled = true;
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'tg-results', footer, '');
      const b = u.el('button', 'clear-selection', footer, 'Clear selection');
      b.type = 'button';
      // Independent streams preserve all existing task and frame draws.
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['header', 'link']);
      const endLabel = referenceEnd ? 'Submit' : er.pick(endLabels);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'end-control end-' + placement, placement === 'header' ? header : footer, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        if (placement === 'header') header.insertBefore(submit, header.querySelector('.window-controls'));
        submit.addEventListener('click', () => ctx.submit());
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const choices = [...new Set(endLabels)].filter(
          (label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (choices.length) {
          const label = cr.pick(choices);
          const parent = cr.pick(['header', 'footer']) === 'header' ? header : footer;
          const decoy = u.el('button', 'chrome-xtra', parent, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          if (parent === header) header.insertBefore(decoy, header.querySelector('.window-controls'));
          else footer.insertBefore(decoy, b);
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
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
      const [title, copy, label] = texts[ctx.kind];
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
