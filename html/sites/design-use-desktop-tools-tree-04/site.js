(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-tree-04',
    'brand': 'Project Explorer',
    'mode': 'yosemite',
    'tokens': {
      'bg': '#ececec',
      'panel': '#ffffff',
      'fg': '#1d1d1f',
      'accent': '#2f7ee8',
      'font': '-apple-system,Helvetica Neue,Arial,sans-serif',
      'line': '#d6d6d9',
      'muted': '#6c6c70',
      'button-fg': '#fff',
    },
    'nav': 'Terminal    Edit    Settings    Help',
    'obstruction': ['BeOS Newsletter', 'Be the first to know. Get news, tips and updates from the BeOS team.', 'Close'],
    'footer': 'workspace',
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
      u.el('div', 'tl', header).innerHTML = '<i></i><i></i><i></i>';
      u.el('div', 'design-brand', header, D.brand);
      u.el('nav', 'design-nav', header, D.nav);
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display === 'panel') {
        u.el('h2', '', note, 'Project note');
        u.el('p', '', note, ctx.instruction);
      } else if (ctx.display !== 'hidden') u.el('p', '', note, ctx.instruction);
      else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');
      const er = ctx.rng.fork('chrome/end');
      let placement = 'footer',
        label = 'Submit';
      if (!ctx.finish && !er.bool(0.5)) {
        placement = er.pick(['header', 'link']);
        const bank = ctx.content && ctx.content.END_LABELS;
        const labels = Array.isArray(bank)
          ? bank.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name)).filter(Boolean)
          : ['Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        label = er.pick(labels);
      }
      let submit = null;
      const makeEnd = (parent, cls, text, tag) => {
        const b = u.el(tag || 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'header') submit = makeEnd(header, 'end-control end-header', label);
        else if (placement === 'link') submit = makeEnd(footer, 'end-link', label + ' ›', 'a');
        else submit = makeEnd(footer, 'end-control', label);
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const bank = ctx.content && ctx.content.END_LABELS;
        const opts = (
          Array.isArray(bank) ? bank : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
        )
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name))
          .filter((x) => x && x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (opts.length) {
          const d = u.el('button', 'end-xtra', footer, cr.pick(opts));
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
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
