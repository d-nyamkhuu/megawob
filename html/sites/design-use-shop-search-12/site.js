(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-search-12',
    'brand': 'FinderShop',
    'mode': 'top',
    'tokens': {
      'bg': '#f7f6f3',
      'panel': '#ffffff',
      'fg': '#18243b',
      'accent': '#ed710b',
      'font': 'monospace',
      'line': '#bebebe',
      'muted': '#5e6779',
    },
    'nav': 'File    Edit    View    Help',
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
      const logo = u.el('span', 'design-logo', header);
      logo.innerHTML =
        '<svg viewBox="0 0 32 32" width="30" height="30"><defs><linearGradient id="bag-orange" x2="0" y2="1"><stop stop-color="#ffab47"/><stop offset="1" stop-color="#f07805"/></linearGradient></defs><rect x="1" y="6" width="30" height="27" rx="4" fill="url(#bag-orange)"/><path d="M9 11V5a7 7 0 0114 0v6" fill="none" stroke="#fff" stroke-width="2.2"/><path d="M8 13l5-2a3 3 0 006 0l5 2-2 6-3-1v10h-9V18l-3 1z" fill="#fff"/><path d="M3 9v18" stroke="#fff" opacity=".22"/></svg>';
      u.el('div', 'design-brand', header, D.brand);
      const nav = u.el('nav', 'design-nav', header);
      for (const t of ['File', 'Edit', 'View', 'Help']) u.el('span', '', nav, t);
      const wc = u.el('span', 'win-ctl', header);
      wc.innerHTML =
        '<svg viewBox="0 0 120 20" width="110" height="18" fill="none" stroke="#ddd" stroke-width="1.600"><path d="M5 10h12"/><rect x="48" y="4" width="11" height="11"/><path d="M52 2h11v11"/><path d="M92 3l12 12M104 3L92 15"/></svg>';
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        if (D.mode.includes('side') || D.mode === 'twin') u.el('h2', '', note, 'Your Task');
        u.el('div', 'note-lbl', note, 'TASK');
        const taskText = u.el('p', '', note, ctx.instruction);
        taskText.dataset.long = String(ctx.instruction.length > 75);
        const ab = u.el('div', 'note-about', note);
        u.el('h3', '', ab, 'ABOUT THIS TASK');
        u.el('div', '', ab, 'Use the search box below to find the result.');
        const l2 = u.el('div', '', ab);
        l2.append('Click the ');
        u.el('b', '', l2, 'requested result');
        l2.append(' in the search results.');
        const l3 = u.el('div', '', ab);
        if (ctx.finish) {
          l3.append('Then finish the task.');
        } else {
          l3.append('Then click the ');
          u.el('b', '', l3, 'Submit');
          l3.append(' button.');
        }
        if (ctx.display === 'panel') {
          ab.appendChild(taskText);
          note.classList.add('panel-display');
        }
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      u.el('span', 'footer-label', footer, '');
      const reset = u.el('button', 'reset-btn', footer, 'Reset');
      reset.type = 'button';
      reset.addEventListener('click', () => env.log('reset', {}));
      const labels = (ctx.content && ctx.content.END_LABELS) || [
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
      const labelRng = ctx.rng.fork('chrome/end');
      const baseline = labelRng.bool(0.5);
      const chosen = baseline ? 'Submit' : labelRng.pick(labels);
      const label = String(chosen.label || chosen.text || chosen.name || chosen);
      const placementRng = ctx.rng.fork('chrome/end-placement');
      const placement = baseline ? 'footer' : placementRng.pick(['header', 'link']);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideRng.bool(0.3)) {
        const options = [...new Set(labels.map((x) => String(x.label || x.text || x.name || x)))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (options.length) collide = { label: collideRng.pick(options), where: collideRng.pick(['header', 'footer']) };
      }
      let submit = null;
      const makeEnd = (parent, link) => {
        const b = u.el(link ? 'a' : 'button', 'end-control' + (link ? ' end-link' : ''), parent, label);
        if (link) b.href = '#';
        else b.type = 'button';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const makeCollide = (parent) => {
        const b = u.el('button', 'end-pq', parent, collide.label);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: collide.label, collide: true }));
      };
      if (!ctx.finish && placement === 'header') submit = makeEnd(header, false);
      if (!ctx.finish && placement === 'footer') submit = makeEnd(footer, false);
      if (!ctx.finish && placement === 'link') submit = makeEnd(footer, true);
      if (collide && collide.where === 'header') makeCollide(header);
      if (collide && collide.where === 'footer') makeCollide(footer);
      const decoy = u.el('button', 'design-xtra', footer, 'Save view');
      decoy.type = 'button';
      decoy.addEventListener('click', () => env.log('decoy', { what: 'Save view' }));
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
