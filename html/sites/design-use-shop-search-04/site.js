(function () {
  'use strict';
  const D = {
    'site': 'design-use-shop-search-04',
    'brand': 'Web Finder',
    'tokens': {
      'bg': '#9fa4b0',
      'panel': '#c9c6be',
      'fg': '#111111',
      'accent': '#1a1ad0',
      'font': "Helvetica,Arial,'Liberation Sans',sans-serif",
      'line': '#8d8a84',
      'muted': '#222222',
    },
    'menus': ['File', 'Edit', 'View', 'Search', 'Go', 'Bookmarks'],
    'top': ['Applications', 'Workspace', 'Help'],
    'obstruction': null,
  };
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      for (const [k, v] of Object.entries(D.tokens)) document.documentElement.style.setProperty('--' + k, v);
      document.body.className = 'motif instruction-' + ctx.display;
      const endR = ctx.rng.fork('chrome/end');
      const placements = [
        'footer',
        'footer',
        'footer',
        'footer',
        'footer',
        'footer',
        'footer',
        'header',
        'header',
        'link',
      ];
      const placement = ctx.finish ? null : endR.pick(placements);
      const rawLabels = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
        'Complete',
      ];
      const endLabels = rawLabels.map((x) =>
        typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x),
      );
      const alternatives = endLabels.filter((x) => x.trim().toLowerCase() !== 'submit');
      const label = endR.bool(0.7) ? 'Submit' : endR.pick(alternatives);
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const options = endLabels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) collide = { label: collideR.pick(options), where: collideR.pick(['menu', 'footer']) };
      }
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      u.el('span', 'mo-logo', header, 'UNIX');
      for (const t of D.top) {
        const item = u.el('span', 'mo-top', header);
        u.el('u', '', item, t[0]);
        item.append(t.slice(1));
      }
      u.el('span', 'mo-clock', header, 'Mon Jul 15 1991   10:24 AM');
      const win = u.el('div', 'design-body', shell);
      const tb = u.el('div', 'mo-title', win);
      u.el('span', 'mo-tear', tb, '');
      u.el('span', 'mo-tt', tb, D.brand);
      u.el('span', 'mo-wb', tb, '▭');
      u.el('span', 'mo-wb', tb, '✕');
      const mb = u.el('div', 'mo-menu', win);
      for (const m of D.menus) {
        const item = u.el('span', 'mo-mi', mb);
        u.el('u', '', item, m[0]);
        item.append(m.slice(1));
      }
      const help = u.el('span', 'mo-mi mo-help', mb);
      u.el('u', '', help, 'H');
      help.append('elp');
      const fr = u.el('div', 'mo-frame', win);
      const note = u.el('section', 'task-note', fr);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') u.el('p', 'food-task', note, ctx.instruction);
      if (ctx.display === 'panel') note.classList.add('panel-note');
      if (ctx.display === 'toast') note.classList.add('toast-note');
      const stage = u.el('main', 'stage', fr);
      const footer = u.el('footer', 'design-footer', win);
      let submit = null;
      const endBtn = (parent, cls, text) => {
        const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const decoy = (parent) => {
        const b = u.el('button', 'mo-xtra', parent, collide.label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide.label, collide: true }));
      };
      if (!ctx.finish) {
        if (placement === 'footer') submit = endBtn(footer, 'end-control', label);
        else if (placement === 'header') submit = endBtn(mb, 'menu-end', label);
        else submit = endBtn(footer, 'end-link', label + ' ›');
      }
      if (collide) {
        const parent = collide.where === 'menu' ? mb : footer;
        decoy(parent);
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
      let [title, copy, label] = texts[ctx.kind];
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
