(function () {
  'use strict';
  const D = {
    'site': 'design-use-social-feed-reply-05',
    'brand': 'ChatterBox',
    'mode': 'bottom',
    'tokens': {
      'bg': '#d8dde6',
      'panel': '#ffffff',
      'fg': '#14233c',
      'accent': '#6f9be4',
      'font': 'Segoe UI,Tahoma,Arial,sans-serif',
      'line': '#b4bccb',
      'muted': '#5f6a78',
    },
    'menus': ['File', 'Edit', 'View', 'Go', 'Tools', 'Help'],
    'obstruction': null,
  };
  const ICON = {
    new: '<path d="M4 4h12v16H4z" fill="#fff"/><path d="M8 9h5M8 12h5M14 18l7-9" />',
    reply: '<path d="M10 5L3 11l7 6v-4c5 0 8 1 11 6-1-6-4-10-11-10z" fill="#4f86d6"/>',
    like: '<path d="M3 10h4v11H3zM7 10l4-7c2 0 3 1 2 4h7v3l-2 9H7" fill="#4f86d6"/>',
    refresh: '<path d="M20 8a8 8 0 0 0-14-2M4 16a8 8 0 0 0 14 2M20 3v5h-5M4 21v-5h5" stroke="#3a9a3a"/>',
    home: '<path d="M3 11L12 3l9 8M5 10v11h14V10" fill="#fff"/>',
    at: '<circle cx="12" cy="12" r="4"/><path d="M16 8v5c0 3 4 3 4-1a8 8 0 1 0-4 7"/>',
    mail: '<rect x="2" y="5" width="20" height="14" fill="#fff"/><path d="M2 6l10 7 10-7"/>',
    doc: '<path d="M5 3h10l4 4v14H5z" fill="#fff"/><path d="M8 11h8M8 14h8M8 17h8"/>',
    star: '<path d="M12 2l3 7 7 .8-5.4 4.8 1.6 7.4-6.2-3.8-6.2 3.8 1.6-7.4L2 9.8 9 9z" fill="#f2b522" stroke="#9a7410"/>',
    group: '<circle cx="9" cy="8" r="3.5" fill="#e0a070"/><path d="M3 20c0-5 12-5 12 0" fill="#4f86d6"/><circle cx="17" cy="9" r="3" fill="#e0a070"/>',
    tri: '<path d="M12 3l9 17H3z" fill="#4aa83a" stroke="#2a6a1e"/>',
    cam: '<rect x="2" y="6" width="20" height="14" rx="2" fill="#333"/><circle cx="12" cy="13" r="4" fill="#ddd"/>',
  };
  const svg = (k, s, fill) =>
    '<svg viewBox="0 0 24 24" width="' + (s || 20) + '" height="' + (s || 20) + '" fill="none" stroke="#35507c" stroke-width="1.6" stroke-linejoin="round">' + ICON[k] + '</svg>';
  env.site({
    name: D.site,
    template: 'site/base',
    design: { parts: {
    frame: () => function frame(ctx) {
      const u = ctx.util,
        root = document.documentElement;
      for (const [k, v] of Object.entries(D.tokens)) root.style.setProperty('--' + k, v);
      document.body.className = D.mode + ' instruction-' + ctx.display;
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const title = u.el('div', 'design-title', header);
      u.el('span', 'design-brand', title, D.brand);
      const note = u.el('section', 'task-note', title);
      note.dataset.role = 'instruction';
      if (ctx.display === 'header') u.el('p', '', note, ctx.instruction);
      else note.hidden = true;
      u.el('div', 'window-controls', title).innerHTML = '<i>_</i><i>□</i><i>×</i>';
      const nav = u.el('nav', 'design-nav', header);
      for (const m of D.menus) {
        const s = u.el('span', '', nav);
        s.innerHTML = '<u>' + m[0] + '</u>' + m.slice(1);
      }
      const bar = u.el('div', 'qt-toolbar', header);
      for (const [label, key] of [
        ['New Post', 'new'],
        ['Reply', 'reply'],
        ['Like', 'like'],
        ['Refresh', 'refresh'],
      ]) {
        const b = u.el('button', 'qt-tool', bar);
        b.type = 'button';
        b.innerHTML = svg(key, 26) + '<span>' + label + '</span>';
        b.addEventListener('click', () => env.log('decoy', { what: label }));
      }
      const er = ctx.rng.fork('chrome/end'),
        endPool =
          ctx.content && Array.isArray(ctx.content.END_LABELS)
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'],
        endText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      let endWhere = 'footer',
        endLabel = 'Save';
      if (!ctx.finish && !er.bool(0.5)) {
        endWhere = er.pick(['toolbar', 'link', 'icon']);
        endLabel = endText(er.pick(endPool));
      }
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const options = [...new Set(endPool.map(endText))].filter(
          (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (options.length) collide = cr.pick(options);
      }
      const body = u.el('div', 'design-body', shell);
      const left = u.el('aside', 'qt-left', body);
      const tree = u.el('div', 'qt-tree', left);
      for (const [g, items] of [
        ['Feeds', [['Home Feed', 'home'], ['Mentions', 'at'], ['Direct Messages', 'mail'], ['My Posts', 'doc'], ['Saved', 'star']]],
        ['Groups', [['Friends', 'group'], ['Family', 'star'], ['Hiking Club', 'tri'], ['Photography', 'cam']]],
      ]) {
        u.el('div', 'qt-group', tree, '▾ ' + g);
        for (const [t, k] of items) {
          const r = u.el('div', 'qt-item' + (t === 'Home Feed' ? ' sel' : ''), tree);
          r.innerHTML = svg(k, 22) + '<span>' + t + '</span>';
        }
      }
      const insp = u.el('div', 'qt-insp', left);
      u.el('div', 'qt-pane-h', insp, 'Details');
      const prof = u.el('div', 'qt-prof', insp);
      u.el('div', 'qt-pic', prof);
      const pt = u.el('div', 'qt-prof-t', prof);
      pt.innerHTML = '<b>Emily Carter</b><br><span>@emilyc</span><br><span>Seattle, WA</span>';
      for (const [a, b] of [['Following', '152'], ['Followers', '248'], ['Posts', '87']]) {
        const r = u.el('div', 'qt-stat', insp);
        u.el('span', '', r, a);
        u.el('span', '', r, b);
      }
      u.el('p', 'qt-bio', insp, 'Hiker, photographer, and coffee enthusiast.');
      if (ctx.display === 'panel') {
        const c = u.el('section', 'task-note qt-card', insp);
        c.dataset.role = 'instruction';
        u.el('b', '', c, 'Task');
        u.el('p', '', c, ctx.instruction);
      }
      const right = u.el('div', 'qt-right', body);
      u.el('div', 'qt-pane-h', right, 'Home Feed');
      const stage = u.el('main', 'stage', right);
      const footer = u.el('footer', 'design-footer', shell);
      const status = u.el('span', 'footer-label', footer, 'Ready');
      if (ctx.display === 'toast') {
        const t = u.el('span', 'task-note qt-toast', footer, ctx.instruction);
        t.dataset.role = 'instruction';
      }
      let submit = null;
      const makeEnd = (parent, cls, text) => {
        const b = u.el('button', cls, parent);
        if (text !== null) b.textContent = endLabel;
        b.type = 'button';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (collide) {
        const b = u.el('button', 'pqd-xtra', footer, collide);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      if (!ctx.finish) {
        if (endWhere === 'footer') submit = makeEnd(footer, 'end-control footer-end-control');
        else if (endWhere === 'toolbar') {
          submit = makeEnd(bar, 'end-control tb-end');
        } else if (endWhere === 'link') submit = makeEnd(footer, 'end-control end-link');
        else {
          submit = makeEnd(bar, 'end-control tb-end tb-icon', null);
          submit.innerHTML = '✔';
        }
      }
      return { stage, submit };
    },
    overlay: () => function overlay(ctx) {
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
    } },
  });
})();
