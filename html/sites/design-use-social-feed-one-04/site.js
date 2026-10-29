(function () {
  'use strict';
  const D = {
    'site': 'design-use-social-feed-one-04',
    'brand': 'Chirp',
    'mode': 'bottom',
    'tokens': {
      'bg': '#fafcfe',
      'panel': '#ffffff',
      'fg': '#0b1530',
      'accent': '#0b6ff0',
      'font': "'Segoe UI Variable','Segoe UI','Carlito',Arial,sans-serif",
      'line': '#e7edf4',
      'muted': '#6a7e9e',
    },
    'obstruction': null,
    'footer': '',
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      document.body.className = D.mode + ' instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const brand = u.el('div', 'design-brand', header);
      brand.innerHTML =
        '<svg viewBox="0 0 24 24" fill="#1d9bf0"><path d="M22 5.9c-.7.3-1.5.5-2.4.7.9-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1-1.6-1.7-4.3-1.8-6-.1-1.1 1.1-1.5 2.6-1.2 4C8.1 8.9 4.9 7.2 2.8 4.6c-1.1 1.9-.5 4.3 1.3 5.5-.7 0-1.3-.2-1.9-.5 0 2 1.4 3.7 3.3 4.1-.6.2-1.2.2-1.9.1.5 1.700 2.100 2.800 3.900 2.800-1.800 1.400-4 2.100-6.300 1.900 7.200 4.600 16.800-.5 16.600-9.900.8-.6 1.500-1.300 2.100-2.200z"/></svg>';
      u.el('span', '', brand, D.brand);
      const wc = u.el('div', 'window-controls', header);
      wc.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12h14"/></svg><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="5" width="14" height="14" rx="2"/></svg><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 5l14 14M19 5L5 19"/></svg>';
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        const ic = u.el('span', 'task-clipboard', note);
        ic.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/><path d="M18.5 3.500a2.100 2.100 0 0 1 3 3L12 16l-4 1 1-4z"/></svg>';
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const rail = u.el('nav', 'rail-nav', body);
      const RI = {
        home: '<path d="M4 11l8-7 8 7v9h-5v-6H9v6H4z"/>',
        explore: '<circle cx="10.500" cy="10.500" r="6.500"/><path d="M15.500 15.500L20.500 20.500"/>',
        bell: '<path d="M4 17.5c2-2 2-4 2-8a6 6 0 0 1 12 0c0 4 0 6 2 8H4z"/><path d="M9.5 19a2.5 2.5 0 0 0 5 0"/>',
        mail: '<rect x="3.500" y="5.500" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/>',
        bookmark: '<path d="M5 3.5h14v17l-7-4.5-7 4.5z"/>',
        list: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M7.5 8h1M11 8h5.5M7.5 11.5h1M11 11.5h5.5M7.5 15h5"/>',
        user: '<circle cx="12" cy="8.500" r="4"/><path d="M5 21v-1a7 6 0 0 1 14 0v1H5z"/>',
        more: '<circle cx="5" cy="12" r="1.500" fill="currentColor"/><circle cx="12" cy="12" r="1.500" fill="currentColor"/><circle cx="19" cy="12" r="1.500" fill="currentColor"/>',
      };
      [
        ['home', 'Home'],
        ['explore', 'Explore'],
        ['bell', 'Notifications'],
        ['mail', 'Messages'],
        ['bookmark', 'Bookmarks'],
        ['list', 'Lists'],
        ['user', 'Profile'],
        ['more', 'More'],
      ].forEach(([k, l], i) => {
        const b = u.el('button', 'rail-item' + (i === 0 ? ' on' : ''), rail);
        b.type = 'button';
        b.innerHTML =
          '<svg viewBox="0 0 24 24" fill="' +
          (i === 0 ? 'currentColor' : 'none') +
          '" stroke="currentColor" stroke-width="1.600" stroke-linejoin="round" stroke-linecap="round">' +
          RI[k] +
          '</svg><span>' +
          l +
          '</span>';
        b.addEventListener('click', () => env.log('decoy', { what: l }));
      });
      const stage = u.el('main', 'stage', body);
      const details = u.el('div', 'task-details', body);
      details.hidden = true;
      const fields = u.el('dl', 'task-detail-fields', details);
      for (const [label, value] of [
        ['Action:', ''],
        ['Target Author:', ''],
        ['Post Starts With:', ''],
        ['Status:', 'Not completed'],
      ]) {
        u.el('dt', '', fields, label);
        u.el('dd', 'detail-' + label.split(':')[0].replaceAll(' ', '-').toLowerCase(), fields, value);
      }
      const er = ctx.rng.fork('chrome/end'),
        labels = (ctx.content && ctx.content.END_LABELS) || [
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
      let place, label;
      if (!er.bool(0.5)) {
        place = 'bottom';
        label = 'Submit';
      } else {
        const raw = er.pick(labels);
        label = typeof raw === 'string' ? raw : (raw && (raw.label || raw.text || raw.name)) || String(raw);
        place = er.pick(['bottom', 'header', 'link']);
      }
      let submit = null;
      const end = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (!ctx.finish) {
        if (place === 'header') submit = end(header, 'end-control end-header', label);
        else if (place === 'link') submit = end(body, 'end-control end-link', label);
        else submit = end(body, 'end-control', label);
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = labels
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
          .filter((x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase());
        if (pool.length) {
          const b = u.el('button', 'pqd-xtra', header, cr.pick(pool));
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: b.textContent, collide: true }));
        }
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
