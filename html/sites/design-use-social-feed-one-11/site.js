(function () {
  'use strict';
  const D = {
    'site': 'design-use-social-feed-one-11',
    'brand': 'TeamNotebook',
    'mode': 'bottom',
    'tokens': {
      'bg': '#bdd5d2',
      'panel': '#eff9f6',
      'fg': '#123f37',
      'accent': '#186c60',
      'font': 'Arial,sans-serif',
      'line': '#c8cdd5',
      'muted': '#5f6a78',
    },
    'nav': 'Home    Projects    Notes    People    Discussions    Calendar',
    'obstruction': [
      'Software Update',
      'A new version is available. Version 3.4.1 includes performance improvements and security updates.',
      'Remind me later',
    ],
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
      u.el('div', 'design-brand', header, D.brand);
      u.el('nav', 'design-nav', header, D.nav);
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (D.mode.includes('side') || D.mode === 'twin' || ctx.display === 'panel') u.el('h2', '', note, 'Your Task');
        if (ctx.display === 'panel') note.classList.add('episode-task-panel');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, D.footer || 'Ready');
      const endRng = ctx.rng.fork('chrome/end');
      const labels = ctx.content && ctx.content.END_LABELS;
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabels =
        Array.isArray(labels) && labels.length
          ? labels.map(labelOf)
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const keepCurrent = !ctx.finish && endRng.bool(0.5);
      let placement = ctx.finish ? null : keepCurrent ? 'footer' : endRng.pick(['rail', 'footer-link', 'footer-icon']);
      if (placement === 'rail' && ctx.display === 'panel') placement = 'footer-link';
      const label = keepCurrent ? 'Submit' : endRng.pick(endLabels);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const pool = endLabels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) collision = { label: collideRng.pick(pool) };
      }
      const decoy = (parent) => {
        const b = u.el('button', 'episode-xtra', parent, collision.label);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: collision.label, collide: true }));
      };
      let submit = null;
      if (collision) decoy(footer);
      if (placement === 'rail') {
        submit = u.el('button', 'end-control rail-end', body, label);
        submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
      }
      if (placement === 'footer') {
        submit = u.el('button', 'end-control', footer, label);
        submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
      }
      if (placement === 'footer-link') {
        submit = u.el('button', 'end-link', footer, label + ' ›');
        submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
      }
      if (placement === 'footer-icon') {
        submit = u.el('button', 'end-icon', footer, '✓');
        submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
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
