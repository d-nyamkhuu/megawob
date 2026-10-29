(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-food-01',
    'brand': 'RED SLICE',
    'mode': 'top',
    'tokens': {
      'bg': '#f5f3e9',
      'panel': '#fcfbf7',
      'fg': '#171d21',
      'accent': '#e11b2a',
      'font': 'Arial,sans-serif',
      'line': '#c8cdd5',
      'muted': '#5f6a78',
    },
    'nav': 'PIZZA & MORE',
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
      const bbox = u.el('div', 'design-brandbox', header);
      u.el('div', 'design-brand', bbox, D.brand);
      u.el('nav', 'design-nav', bbox, D.nav);
      const mid = u.el('div', 'design-mid', header);
      u.el('div', 'design-deco', header, 'GOOD\nFOOD\nBRIGHTER\nDAYS');
      const body = u.el('div', 'design-body', shell);
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
      if (!ctx.finish) {
        const bank = ctx.content && ctx.content.END_LABELS;
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const labels =
          Array.isArray(bank) && bank.length
            ? bank.map(labelOf)
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const er = ctx.rng.fork('chrome/end');
        const base = er.bool(0.5);
        const place = base ? 'footer' : er.pick(['header', 'link']);
        const label = base ? 'Submit' : labelOf(er.pick(labels));
        document.body.dataset.endPlace = place;
        if (place === 'header' || place === 'link') document.body.classList.add('episode-end-' + place);
        const makeEnd = (parent, cls, text, kind) => {
          const b = u.el('button', cls, parent, text);
          b.type = 'button';
          b.dataset.role = kind || 'submit';
          b.setAttribute('aria-label', text);
          b.title = text;
          b.addEventListener('click', () => ctx.submit());
          return b;
        };
        const decoy = (parent, text) => {
          const b = u.el('button', 'end-xtra', parent, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          return b;
        };
        if (place === 'footer') submit = makeEnd(footer, 'end-control', label);
        else if (place === 'link') submit = makeEnd(footer, 'end-control end-link', label);
        else {
          const tools = u.el('div', 'header-end-tools', mid);
          submit = makeEnd(tools, 'end-control end-header-control', label);
        }
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const own = label.trim().toLowerCase();
          const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== own);
          if (options.length) {
            const text = labelOf(cr.pick(options));
            const parent =
              cr.pick(['header', 'footer']) === 'header'
                ? document.body.classList.contains('episode-end-header')
                  ? mid
                  : u.el('div', 'header-end-tools', mid)
                : footer;
            if (parent === mid && !parent.querySelector('.header-end-tools')) {
              const tools = u.el('div', 'header-end-tools', mid);
              decoy(tools, text);
            } else if (parent === mid) {
              decoy(parent.querySelector('.header-end-tools'), text);
            } else decoy(parent, text);
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
