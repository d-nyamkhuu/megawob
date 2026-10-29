(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-food-09',
    'brand': 'GoodBite',
    'tagline': 'Fresh Food, Great Choices',
    'tokens': {
      'bg': '#f8fbff',
      'panel': '#ffffff',
      'fg': '#0b2a73',
      'accent': '#3d86c6',
      'font': "'Trebuchet MS',Tahoma,Verdana,sans-serif",
      'line': '#bfd6ea',
      'muted': '#4a5568',
    },
    'obstruction': null,
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const logo = u.el('div', 'gb-logo', header);
      logo.innerHTML =
        '<svg viewBox="0 0 40 40" width="38" height="38"><path d="M6 36C4 18 14 5 36 3C37 22 27 34 8 35Z" fill="#56a833" stroke="#3d8a1f" stroke-width="1.5"/><path d="M6 36C14 24 22 14 33 7" stroke="#e8f5d8" stroke-width="1.6" fill="none"/></svg>';
      u.el('div', 'design-brand', header, D.brand);
      u.el('div', 'gb-tag', header, D.tagline);
      const nav = u.el('nav', 'design-nav', header);
      for (const label of ['Menu', 'Specials', 'About', 'Help']) {
        const b = u.el('button', 'header-tab', nav, label);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { what: label }));
      }
      const sb = u.el('div', 'gb-search', header);
      const si = u.el('input', '', sb);
      si.type = 'text';
      si.placeholder = 'Search menu...';
      const sg = u.el('span', 'gb-sg', sb);
      sg.innerHTML =
        '<svg viewBox="0 0 20 20" width="18" height="18"><circle cx="8" cy="8" r="5.5" fill="none" stroke="#223" stroke-width="2"/><path d="M12 12L18 18" stroke="#223" stroke-width="2.4"/></svg>';
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') u.el('p', 'food-task', note, ctx.instruction);
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = (ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Confirm']).map(labelOf);
      const er = ctx.rng.fork('chrome/end');
      const placement = er.pick(['footer', 'footer', 'header', 'left']);
      const alternateLabels = endLabels.filter((label) => label !== 'Submit');
      const endLabel = placement === 'footer' ? 'Submit' : er.pick(alternateLabels);
      shell.classList.add('end-' + placement);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'header' ? header : footer;
        if (placement === 'header') sb.hidden = true;
        submit = u.el('button', 'end-control' + (placement === 'header' ? ' header-end' : ''), parent, endLabel);
        submit.type = 'button';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const pool = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (pool.length) {
          const label = cr.pick(pool);
          const decoy = u.el('button', 'chrome-xtra', footer, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
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
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  });
})();
