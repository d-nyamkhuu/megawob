(function () {
  'use strict';
  const D = {
    'site': 'design-use-desktop-tools-tree-06',
    'brand': 'Terminal',
    'mode': 'side-left',
    'tokens': {
      'bg': '#cfcbc3',
      'panel': '#cfcbc3',
      'fg': '#111',
      'accent': '#2a3c8c',
      'font': 'Helvetica,Arial,sans-serif',
      'line': '#8a867e',
      'muted': '#555',
      'button-fg': '#000',
    },
    'nav': 'Terminal    Edit    Settings    Help',
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
      shell.classList.toggle('finish-mode', !!ctx.finish);
      const header = u.el('header', 'design-header', shell);
      const ti = u.el('span', 'mx-ticon', header);
      for (let i = 0; i < 3; i++) u.el('i', '', ti);
      u.el('div', 'design-brand', header, 'File Browser');
      let submit = null;
      const er = ctx.rng.fork('chrome/end');
      let place = 'footer',
        label = 'Submit';
      if (!ctx.finish && !er.bool(0.5)) {
        place = er.pick(['title', 'nav']);
        const bank = ctx.content && ctx.content.END_LABELS;
        const choices =
          Array.isArray(bank) && bank.length
            ? bank
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const picked = er.pick(choices);
        label =
          typeof picked === 'string'
            ? picked
            : (picked && (picked.label || picked.text || picked.name)) || String(picked);
      }
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const bank = ctx.content && ctx.content.END_LABELS;
        const choices =
          Array.isArray(bank) && bank.length
            ? bank
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const labels = choices
          .map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)))
          .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (labels.length) collide = cr.pick(labels);
      }
      shell.classList.toggle('has-end-xtra', !!collide);
      shell.dataset.endPlacement = ctx.finish ? 'none' : place;
      const makeEnd = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      const endDecoy = (parent) => {
        if (!collide) return;
        const b = u.el('button', 'mx-end-xtra', parent, collide);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log && env.log('decoy', { label: collide, collide: true }));
      };
      if (place === 'title' && !ctx.finish) submit = makeEnd(header, 'end-control end-title', label);
      const wb = u.el('span', 'mx-wbtns', header);
      for (const g of ['_', '▢', '✕']) u.el('b', '', wb, g);
      const nav = u.el('nav', 'design-nav', shell);
      for (const t of ['File', 'Edit', 'View', 'Go', 'Bookmarks']) {
        const s = u.el('span', '', nav);
        s.innerHTML = '<u>' + t[0] + '</u>' + t.slice(1);
      }
      u.el('span', 'mx-help', nav).innerHTML = '<u>H</u>elp';
      if (place === 'nav' && !ctx.finish) {
        submit = makeEnd(nav, 'end-control end-nav', label);
      }
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.display !== 'hidden') {
        u.el('h2', '', note, 'Task');
        u.el('p', '', note, ctx.instruction);
        u.el('hr', '', note);
        const l1 = u.el('div', 'mx-kv', note);
        u.el('b', '', l1, 'Location:');
        u.el('span', '', l1, '/home/user');
        const l2 = u.el('div', 'mx-kv', note);
        u.el('b', '', l2, 'Details:');
        u.el('span', '', l2, 'The file is inside one of the subfolders. Browse the tree on the right.');
      } else note.hidden = true;
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      const acts = u.el('div', 'mx-acts', footer);
      const ICO = {
        Open: '<svg viewBox="0 0 36 40"><path d="M3 7h11l4 5h15v25H3z" fill="#f4db77" stroke="#20395f" stroke-width="2"/><path d="M5 35V9h8l4 5h14" fill="none" stroke="#fff8cc" stroke-width="2"/></svg>',
        Up: '<svg viewBox="0 0 36 40"><path d="M18 2L6 17h8v16h8V17h8zM6 37h24" fill="#92918b" stroke="#92918b" stroke-width="2"/></svg>',
        'New Folder':
          '<svg viewBox="0 0 42 40"><path d="M2 5h13l4 5h18v25H2z" fill="#f4db77" stroke="#393424" stroke-width="2"/><path d="M4 33V7h10l4 5h17" fill="none" stroke="#fff5c4"/><path d="M27 22h7v7h7v7h-7v4h-7v-4h-7v-7h7z" fill="#285194" stroke="#e8e8da"/></svg>',
        Delete:
          '<svg viewBox="0 0 36 40"><path d="M6 10h24M13 7V3h10v4M8 13h20v24H8zM13 16v17M18 16v17M23 16v17" fill="none" stroke="#93928e" stroke-width="3"/></svg>',
        View: '<svg viewBox="0 0 36 40"><path d="M4 2h28v36H4z" fill="#d9d7cd" stroke="#222" stroke-width="2"/><path d="M8 8h4M8 15h4M8 22h4M8 29h4M16 8h12M16 15h12M16 22h12M16 29h12" stroke="#222" stroke-width="2"/></svg>',
      };
      for (const t of ['Open', 'Up', 'New Folder', 'Delete', '|', 'View']) {
        if (t === '|') {
          u.el('i', 'mx-sep', acts);
          continue;
        }
        const b = u.el('button', 'mx-btn' + (t === 'Up' || t === 'Delete' ? ' dis' : ''), acts);
        b.type = 'button';
        b.innerHTML = ICO[t] + '<span>' + t + '</span>' + (t === 'View' ? '<em>▾</em>' : '');
        b.addEventListener('click', () => env.log && env.log('decoy', { what: t }));
      }
      if ((place === 'footer' && !ctx.finish) || collide) u.el('i', 'mx-sep', acts);
      endDecoy(acts);
      if (place === 'footer' && !ctx.finish) submit = makeEnd(footer, 'end-control', label);
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
