(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-calendar-06',
    'brand': 'My Calendar',
    'mode': 'band',
    'tokens': {
      'bg': '#fbfcfd',
      'panel': '#f1f3f6',
      'fg': '#1b1f24',
      'accent': '#1f6fc6',
      'font': 'Helvetica,Arial,sans-serif',
      'line': '#cfd3d8',
      'muted': '#5f6a78',
      'button-fg': '#fff',
      'header': '#3a4047',
    },
    'nav': 'Terminal    Edit    Settings    Help',
    'obstruction': ['Calendar updates', 'Get calendar tips and updates for your workspace.', 'Close'],
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
      const br = u.el('div', 'design-brand', header);
      br.innerHTML =
        '<svg viewBox="0 0 34 34" width="34" height="34"><rect x="2" y="4" width="30" height="28" rx="3" fill="#dfe3e8"/><rect x="2" y="4" width="30" height="7" rx="3" fill="#aab2bb"/><path d="M9 2v6M25 2v6" stroke="#dfe3e8" stroke-width="3"/><g fill="#5d646c"><rect x="7" y="14" width="4" height="3"/><rect x="13" y="14" width="4" height="3"/><rect x="19" y="14" width="4" height="3"/><rect x="25" y="14" width="3" height="3"/><rect x="7" y="19" width="4" height="3"/><rect x="13" y="19" width="4" height="3"/><rect x="19" y="19" width="4" height="3"/><rect x="25" y="19" width="3" height="3"/><rect x="7" y="24" width="4" height="3"/><rect x="13" y="24" width="4" height="3"/><rect x="19" y="24" width="4" height="3"/></g></svg>';
      u.el('span', '', br, D.brand);
      const nav = u.el('nav', 'design-nav', header);
      for (const t of ['Day', 'Week', 'Month', 'Calendar ▾']) u.el('span', '', nav, t);
      const un = u.el('nav', 'design-util', header);
      for (const t of ['Settings', 'Help', 'Sign out']) u.el('span', '', un, t);
      const body = u.el('div', 'design-body', shell);
      const band = u.el('div', 'band', body);
      u.el('div', 'band-sub', band, 'Use the calendar and event form below to create the event, then submit.');
      const mc = u.el('div', 'band-cal', band);
      u.el('div', 'mc-date', mc, 'Tue, Apr 23, 2013');
      const mh = u.el('div', 'mc-head', mc);
      u.el('span', '', mh, '‹');
      u.el('b', '', mh, 'April 2013');
      u.el('span', '', mh, '›');
      const mg = u.el('div', 'mc-grid', mc);
      for (const d of ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']) u.el('b', '', mg, d);
      for (let i = 0; i < 1; i++) u.el('i', '', mg, '');
      for (let d = 1; d <= 30; d++) u.el('i', d === 23 ? 'sel' : '', mg, String(d));
      const te = u.el('div', 'band-ev', band);
      u.el('h3', '', te, "Today's Events");
      u.el('p', '', te, 'No events scheduled.');
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (D.mode.includes('side') || D.mode === 'twin') u.el('h2', '', note, 'Your Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');
      let submit = null;
      const endR = ctx.rng.fork('chrome/end'),
        collR = ctx.rng.fork('chrome/collide');
      let placement = 'footer',
        label = 'Submit';
      if (!ctx.finish) {
        placement = endR.pick(['footer', 'footer', 'footer', 'header', 'link']);
        const bank = ctx.content && ctx.content.END_LABELS;
        const labels =
          Array.isArray(bank) && bank.length
            ? bank
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        if (endR.bool(0.5)) {
          const v = endR.pick(labels);
          label = typeof v === 'string' ? v : v.label || v.text || v.name || String(v);
        }
        const addEnd = (parent, cls, text) => {
          const b = u.el('button', cls, parent, text);
          b.type = 'button';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', () => ctx.submit());
          return b;
        };
        if (placement === 'header') submit = addEnd(un, 'end-control end-header', label);
        else if (placement === 'link') submit = addEnd(footer, 'end-control end-link', label + ' ›');
        else submit = addEnd(footer, 'end-control', label);
        if (collR.bool(0.3)) {
          const words = labels
            .map((v) => (typeof v === 'string' ? v : v.label || v.text || v.name || String(v)))
            .filter((v) => String(v).toLowerCase() !== String(label).toLowerCase());
          if (words.length) {
            const d = u.el('button', 'chrome-xtra', un, collR.pick(words));
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
          }
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
