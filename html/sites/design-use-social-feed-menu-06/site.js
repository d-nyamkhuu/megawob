(function () {
  'use strict';
  const D = {
    'site': 'design-use-social-feed-menu-06',
    'tokens': {
      'bg': '#fbfbfd',
      'panel': '#ffffff',
      'fg': '#14182b',
      'accent': '#ff5a00',
      'font': "Inter,'Segoe UI',Helvetica,Arial,sans-serif",
      'line': '#e6e8ec',
      'muted': '#5f6672',
    },
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      document.body.className = 'bottom instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const note = u.el('section', 'task-note', shell);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        u.el('h2', '', note, 'Your task');
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const stage = u.el('main', 'stage', shell);
      const actions = u.el('div', 'final-actions', shell);
      let submit = null;
      const endR = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const placement = endR.pick(['footer', 'footer', 'header', 'link']);
      const label = placement === 'footer' ? 'Submit' : endR.pick(endWords);
      shell.classList.add('end-' + placement);
      if (ctx.finish) {
        actions.hidden = true;
        shell.classList.add('finish-mode');
      } else {
        submit = u.el('button', 'end-control' + (placement === 'link' ? ' end-link' : ''), actions, label);
        submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', () => ctx.submit());
        const collideR = ctx.rng.fork('chrome/collide');
        if (collideR.bool(0.3)) {
          const pool = [...new Set(endWords)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) {
            const decoyLabel = collideR.pick(pool);
            const decoy = u.el('button', 'chrome-xtra', actions, decoyLabel);
            decoy.type = 'button';
            decoy.dataset.role = 'xtra';
            decoy.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
          }
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
