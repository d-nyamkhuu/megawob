(function () {
  'use strict';
  const D = {
    'site': 'design-use-social-feed-menu-07',
    'brand': 'FriendSphere - OS/2',
    'tokens': {
      'bg': '#c8c8c8',
      'panel': '#ffffff',
      'fg': '#111111',
      'accent': '#111111',
      'font': "'Segoe UI',Tahoma,Arial,sans-serif",
      'line': '#c9c9c9',
      'muted': '#555555',
    },
    'menus': ['File', 'Edit', 'View', 'Post', 'Options', 'Help'],
    'tabs': ['Home', 'Explore', 'Notifications', 'Messages'],
    'obstruction': null,
  };
  const PEOPLE =
    '<svg viewBox="0 0 48 32" width="100%" height="100%" fill="#111"><circle cx="24" cy="6.5" r="6.5"/><path d="M12 30c0-10 5-15 12-15s12 5 12 15z"/><circle cx="9" cy="10" r="5"/><path d="M0 30c0-8 3-13 9-13 2 0 3 0 4 1-3 3-4 7-4 12z"/><circle cx="39" cy="10" r="5"/><path d="M48 30c0-8-3-13-9-13-2 0-3 0-4 1 3 3 4 7 4 12z"/></svg>';
  const DOC =
    '<svg viewBox="0 0 40 48" width="100%" height="100%" fill="#fff" stroke="#111" stroke-width="2.2"><path d="M10 2h18l9 9v32H10z"/><path d="M6 5h18l9 9v32H6z"/><path d="M2 3h19l9 9v34H2z"/><path d="M21 3v10h9M8 18h16M8 23h16M8 28h16M8 33h12M8 38h15" fill="none"/><path d="M8 7h7v6H8z" fill="#111"/></svg>';
  const PEN =
    '<svg viewBox="0 0 40 40" width="100%" height="100%" fill="#fff" stroke="#111" stroke-width="2.2"><path d="M6 34l2-9L28 5l7 7L15 32z"/><path d="M24 9l7 7M6 34l9-2"/></svg>';
  env.site({
    name: D.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      const display =
        (ctx.display === 'panel' && (root.clientWidth < 1440 || root.clientHeight < 801)) ||
        (ctx.display === 'toast' && (root.clientWidth < 1180 || root.clientHeight < 700))
          ? 'header'
          : ctx.display;
      document.body.className = 'bottom instruction-' + display;
      const shell = u.el('div', 'site-shell', document.body);
      const title = u.el('header', 'os-title', shell);
      const ic = u.el('span', 'os-icon', title);
      ic.innerHTML =
        '<svg viewBox="0 0 28 30" width="28" height="30" stroke="#111" stroke-width="1.3" stroke-linejoin="miter"><path d="M4 10h5V5h5V2h5v5h5v5h3v13H4z" fill="#ffe65b"/><path d="M1 12h11v13H1z" fill="#fff"/><path d="M12 15h12v13H12z" fill="#e57565"/><path d="M3 15h7m-7 3h7m-7 3h7m5-12h7m-7 3h7m-7 6h7m-7 3h7"/><path d="M7 9h3v4H7z" fill="#8dd7ef"/></svg>';
      u.el('span', 'os-name', title, D.brand);
      const wc = u.el('span', 'os-wc', title);
      for (const g of [
        '<svg viewBox="0 0 24 24"><path d="M3 18h17" stroke="#111" stroke-width="3"/></svg>',
        '<svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2"><path d="M8 3h13v14M3 8h13v13H3z"/></svg>',
        '<svg viewBox="0 0 24 24"><path d="M5 4l14 16M19 4L5 20" stroke="#111" stroke-width="2.5"/></svg>',
      ])
        u.el('i', '', wc).innerHTML = g;
      const menu = u.el('nav', 'os-menu', shell);
      for (const m of D.menus) {
        const s = u.el('span', '', menu);
        s.innerHTML = '<u>' + m[0] + '</u>' + m.slice(1);
      }
      u.el('span', 'os-date', menu, 'Mon Apr 11, 1994   10:24 AM');
      const body = u.el('div', 'design-body', shell);
      const note = u.el(
        'section',
        'task-note ' + (display === 'panel' ? 'task-note-panel' : display === 'toast' ? 'task-note-toast' : ''),
        body,
      );
      note.dataset.role = 'instruction';
      if (display !== 'hidden') {
        if (display === 'panel') u.el('h2', 'task-caption', note, 'Task');
        const c = u.el('span', 'task-clipboard', note);
        c.innerHTML = DOC;
        u.el('p', '', note, ctx.instruction);
      } else note.hidden = true;
      const tabs = u.el('div', 'os-tabs', body);
      D.tabs.forEach((t, i) => {
        const b = u.el('span', 'os-tab' + (i === 0 ? ' on' : ''), tabs);
        b.innerHTML = i === 0 ? '<u>H</u>ome' : t;
      });
      const book = u.el('div', 'os-book', body);
      const bh = u.el('div', 'os-bookhead', book);
      const lg = u.el('span', 'os-logo', bh);
      lg.innerHTML = PEOPLE;
      const bt = u.el('div', 'os-booktitle', bh);
      u.el('b', '', bt, 'FriendSphere');
      u.el('span', '', bt, 'Share ideas. Keep in touch.');
      const cb = u.el('button', 'os-compose', bh);
      cb.type = 'button';
      cb.innerHTML = PEN + "<span>What's happening?</span>";
      cb.addEventListener('click', () => env.log('decoy', { what: 'compose' }));
      const stage = u.el('main', 'stage', book);
      const actionbar = u.el('div', 'office-final-actions', book);
      const footer = u.el('footer', 'design-footer', shell);
      const er = ctx.rng.fork('chrome/end');
      const labels = (
        ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const preferred = er.bool(0.5);
      const label = preferred ? 'Submit' : er.pick(labels.filter((x) => x !== 'Submit'));
      const placement = preferred ? 'corner' : er.pick(['toolbar', 'tab']);
      let submit = null;
      const endParent = placement === 'corner' ? actionbar : placement === 'toolbar' ? menu : tabs;
      const endClass =
        'end-control' + (placement === 'toolbar' ? ' end-toolbar' : placement === 'tab' ? ' end-tab' : '');
      if (!ctx.finish) {
        submit = u.el('button', endClass, endParent, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && cr.bool(0.3)) {
        const own = label.trim().toLowerCase();
        const choices = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== own);
        if (choices.length) {
          const where = cr.pick(['corner', 'toolbar', 'tab']);
          const parent = where === 'corner' ? actionbar : where === 'toolbar' ? menu : tabs;
          const text = cr.pick(choices);
          const decoy = u.el('button', 'end-xtra', parent, text);
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
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
