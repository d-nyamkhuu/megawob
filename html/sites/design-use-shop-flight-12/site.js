(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-flight-12',
    'brand': 'SkyTrip',
    'mode': 'top',
    'tokens': {
      'bg': '#dbeafa',
      'panel': '#ffffff',
      'fg': '#12396c',
      'accent': '#2b69b6',
      'font': 'Lato,Carlito,Calibri,"Trebuchet MS","Segoe UI",Arial,sans-serif',
      'line': '#bebebe',
      'muted': '#5e6779',
    },
    'nav': 'Home    Flights    Hotels    My Trips    Help',
    'obstruction': null,
    'footer': 'Ready',
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
      brand.insertAdjacentHTML(
        'beforeend',
        '<svg class="sky-plane" viewBox="0 0 54 45" aria-hidden="true"><path fill="#fff" d="M47 8C54 6 56 10 50 13L34 20 24 42 18 43 25 24 13 29 9 35 4 35 6 27 0 22 3 18 12 23 25 18 15 4 21 2 33 15Z"/></svg>',
      );
      u.el('span', '', brand, D.brand);
      u.el('span', 'sky-tag', header, 'Flights. A simpler way.');
      const nav = u.el('nav', 'design-nav', header);
      for (const label of D.nav.split(/ {2,}/)) {
        const item = u.el('span', '', nav, label);
        item.addEventListener('click', () => env.log('decoy', { label }));
      }
      const ban = u.el('div', 'sky-banner', shell);
      u.el('div', 'sky-h', ban, 'Explore Tomorrow');
      u.el('div', 'sky-s', ban, 'New places. Same easy search.');
      ban.insertAdjacentHTML(
        'beforeend',
        '<svg class="sky-art" viewBox="0 0 1672 157" preserveAspectRatio="none"><defs><linearGradient id="sky-blue" x2="0" y2="1"><stop stop-color="#cee6fd"/><stop offset="1" stop-color="#b9dff0"/></linearGradient><linearGradient id="sky-sweep" x2="0" y2="1"><stop stop-color="#91c6ed"/><stop offset="1" stop-color="#6eace0"/></linearGradient><linearGradient id="sky-city" x2="0" y2="1"><stop stop-color="#275d87"/><stop offset="1" stop-color="#295c8c"/></linearGradient></defs><path fill="url(#sky-blue)" d="M0 0h1672v157H0z"/><g fill="#fff" opacity=".65"><circle cx="319" cy="49" r="26"/><circle cx="284" cy="63" r="24"/><ellipse cx="301" cy="76" rx="57" ry="14"/></g><circle cx="795" cy="91" r="38" fill="#ffdf62"/><path fill="url(#sky-sweep)" d="M1012 0H1672V157H477C689 134 856 88 1012 0z"/><path fill="#759d80" opacity=".8" d="M0 77l135 80H0z"/><path fill="#85a16e" d="M477 157l188-49 151 49z"/><path fill="#3979a6" d="M764 145l72-8 86-30 66 21 47 29H764z"/><path fill="url(#sky-city)" d="M816 157l106-50 42 12 2-20 23 0 1 20 7 0 0-36 7 0 3-6 13 0 4 6 6 0 0 23 2 0 0-67 31 0 0 75 7 0 1-33 18 0 0-18 27 0 0 29 13 0 0 20 5 0 0-57 5 0 1-9 18 0 3 8 4 0 0 45 11 0 0-65 8-22 16 0 10 26 0 13 5 0 0-30 17 0 1 31 9 5 0 33 7 0 26 26 17 32z"/><path fill="#75a69e" d="M1258 157l74-18 42 18z"/></svg>',
      );
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (D.mode.includes('side') || D.mode === 'twin') u.el('h2', '', note, 'Your Task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      const back = u.el('button', 'footer-label', footer, 'Back');
      back.type = 'button';
      back.disabled = true;
      back.setAttribute('aria-label', 'Back to flight search');
      let submit = null;
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const er = ctx.rng.fork('chrome/end');
      let placement = 'footer',
        label = 'Submit';
      if (!ctx.finish) {
        if (!er.bool(0.5)) {
          placement = er.pick(['header', 'link']);
          label = er.pick(endWords);
        }
        shell.classList.add('end-in-' + placement);
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'end-control' + (placement === 'link' ? ' end-link' : ''),
          placement === 'header' ? header : footer,
          label,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      } else u.el('span', 'footer-status', footer, 'Ready');
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const alternatives = endWords.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (alternatives.length) {
          const decoyLabel = cr.pick(alternatives);
          const decoy = u.el('button', 'chrome-xtra', footer, decoyLabel);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
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
