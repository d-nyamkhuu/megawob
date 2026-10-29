(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-editor-10',
    'brand': 'Notebook - Untitled',
    'mode': 'side-left',
    'tokens': {
      'bg': '#a9aab0',
      'panel': '#eef1f6',
      'fg': '#10131a',
      'accent': '#2f6fd0',
      'font': "'Segoe UI',Tahoma,Arial,sans-serif",
      'line': '#aab3c2',
      'muted': '#4a5568',
      'button-fg': '#000',
    },
    'menu': ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Help'],
    'tabs': ['Notes', 'Ideas', 'Research', 'Tasks', 'Journal', 'Archive'],
    'obstruction': ['BeOS Newsletter', 'Be the first to know. Get news, tips and updates from the BeOS team.', 'Close'],
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
      document.body.className = 'qt instruction-' + ctx.display;
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const labels = ctx.content.END_LABELS.map(labelOf),
        defaultSubmit = labels.find((x) => x.trim().toLowerCase() === 'submit') || labels[0];
      const common = er.bool(0.5),
        label = common ? defaultSubmit : labelOf(er.pick(labels));
      const placement = ctx.finish ? null : common ? 'footer' : er.pick(['header', 'menu']);
      const options = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
      const collide = options.length && cr.bool(0.3) ? cr.pick(options) : null;
      const shell = u.el('div', 'site-shell', document.body),
        title = u.el('header', 'qt-title', shell);
      u.el('span', 'qt-appico', title).innerHTML =
        '<svg viewBox="0 0 24 24"><path d="M5 5h13v12H9l-4 3z" fill="#fff9d1" stroke="#e9b43e"/><path d="M8 8h8M8 11h6M8 14h4" stroke="#e0af33"/><path d="M6 4v14" stroke="#fff"/></svg>';
      u.el('span', 'qt-title-text', title, D.brand);
      let submit = null;
      const endBtn = (parent, cls) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (!ctx.finish && placement === 'header') submit = endBtn(title, 'qt-end-title');
      const wb = u.el('span', 'qt-wbtns', title);
      for (const g of ['_', '\u25a1', '\u00d7']) u.el('i', '', wb, g);
      const menu = u.el('nav', 'qt-menu', shell);
      for (const m of D.menu) u.el('span', '', menu, m);
      if (!ctx.finish && placement === 'menu') submit = endBtn(menu, 'qt-end-menu');
      if (collide) {
        const b = u.el('button', 'qt-pq', menu, collide);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      const work = u.el('div', 'qt-work', shell),
        tabs = u.el('div', 'qt-tabs', work);
      D.tabs.forEach((t, i) => u.el('div', 'qt-tab' + (i === 0 ? ' on' : ''), tabs, t));
      const page = u.el('div', 'qt-page', work),
        rings = u.el('div', 'qt-rings', work);
      for (let i = 0; i < 10; i++) u.el('i', '', rings);
      const note = u.el(
        'section',
        'task-note' + (ctx.display === 'panel' ? ' note-panel' : ctx.display === 'toast' ? ' note-toast' : ''),
        page,
      );
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') u.el('p', '', note, ctx.instruction);
      else note.hidden = true;
      const stage = u.el('main', 'stage', page),
        foot = u.el('div', 'qt-foot', page);
      const clear = u.el('button', 'qt-clear', foot, 'Clear');
      clear.type = 'button';
      if (!ctx.finish && placement === 'footer') submit = endBtn(foot, 'end-control');
      const st = u.el('footer', 'qt-status', shell);
      u.el('span', 'qt-grip', st);
      u.el('span', 'qt-pos', st, 'Ln 1, Col 1');
      u.el('span', 'qt-zoom', st, '100%');
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
