(function () {
  'use strict';
  const D = {
    'site': 'design-use-social-feed-one-01',
    'brand': 'SunnyNet',
    'mode': 'side-left',
    'tokens': {
      'bg': '#e4eaf5',
      'panel': '#fffef3',
      'fg': '#00003d',
      'accent': '#0000cb',
      'font': "'Times New Roman',Times,serif",
      'line': '#bbb8ae',
      'muted': '#5f6a78',
    },
    'nav': 'Friends    Ideas    Good Times',
    'obstruction': null,
    'footer': '',
  };
  const BADGES = {
    house: `<path fill="#15121f" d="M2 13V10h2V8h2V6h2V4h2V2h2V0h2v2h2v2h2v2h2v2h2v2h2v3h-3v12H3V13z"/><path fill="#b84627" d="M3 11h2V9h2V7h2V5h2V3h2V2h1v2h2v2h2v2h2v2h2v2h-4V10h-2V8h-2V6h-2v2h-2v2H8v2H3z"/><path fill="#fff4dc" d="M6 12h3v-2h2V8h3v2h2v2h3v12H6z"/><path fill="#4bb9ed" d="M7 15h4v5H7zm8 0h3v5h-3z"/><path fill="#161524" d="M11 16h4v9h-4z"/><path fill="#ffd434" d="M12 17h2v7h-2z"/><path fill="#64b236" d="M1 25h22v2H1zM3 23h3v2H3zm16 0h3v2h-3z"/><path fill="#fff" d="M8 15h1v3H8zm8 0h1v3h-1zM12 9h2v2h-2z"/><path fill="#003c64" d="M21 3h2v7h-2z"/>`,
    pencil: `<path fill="#101d29" d="M2 3h2V1h15v2h3v25H1V5h1z"/><path fill="#e1edf3" d="M3 5h2V3h13v3h2v20H3z"/><path fill="#fff" d="M5 4h12v3H5zM4 8h15v16H4z"/><path fill="#092c3d" d="M4 2h2v3H4zm3 6h11v1H7zm-3 4h13v2H4zm0 4h9v2H4zm0 4h7v2H4z"/><path fill="#050c17" d="M10 19h2v-2h2v-2h2v-2h2v-2h2V9h2V7h3v2h2v3h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2H9z"/><path fill="#ffe03c" d="M12 18h2v-2h2v-2h2v-2h2v-2h2v3h-2v2h-2v2h-2v2h-2v2h-2z"/><path fill="#f29922" d="M14 19h2v-2h2v-2h2v-2h2v-2h1v2h-2v2h-2v2h-2v2h-2v2h-1z"/><path fill="#ea437c" d="M23 8h2v3h-2z"/><path fill="#adcbd9" d="M2 27h19v1H2z"/>`,
    people: `<path fill="#141724" d="M9 3h2V1h6v2h2v10h-2v2h2v2h2v12h-3v3h-4v-6h-1v6H9v-3H6V17h3v-2h2v-2H9zM2 10h6v2h2v9H8v3h2v8H1V21H0v-8h2zM20 10h5v2h2v9h-2v11h-7V20h1v-8h1z"/><path fill="#b9611e" d="M11 3h6v2h2v5h-3V7h-3v2h-2zM2 12h6v3H2z"/><path fill="#233f35" d="M20 12h5v3h-5z"/><path fill="#ffd0a1" d="M12 8h5v5h-5zM3 15h5v5H3zm17 0h5v5h-5z"/><path fill="#eef1ee" d="M13 9h1v1h-1zm3 0h1v1h-1zM4 16h1v1H4zm3 0h1v1H7zm14 0h1v1h-1zm3 0h1v1h-1z"/><path fill="#75badf" d="M10 16h8v10h-8zM2 21h7v6H2zm17 0h6v6h-6z"/><path fill="#e5e9ee" d="M11 16h6v2h-6zM3 22h1v4H3zm17 0h1v4h-1z"/><path fill="#2464a6" d="M10 26h3v5h-3zm5 0h3v5h-3zM2 27h2v4H2zm4 0h2v4H6zm14 0h2v4h-2zm3 0h2v4h-2z"/>`,
    flower: `<path fill="#19251a" d="M10 17h2v14h-2zM3 21h3v2h3v3H6v-2H3zm10 4h3v-2h3v3h-3v2h-3z"/><path fill="#3dac26" d="M11 18h1v12h-1zM4 21h3v2H4zm9 5h3v-2h2v2h-2v2h-3z"/><path fill="#16132e" d="M8 2h5v2h4v4h3v5h-3v4h-4v3H8v-3H4v-4H1V8h3V4h4z"/><path fill="#a565dc" d="M9 3h3v5H9zm6 3h2v4h-5V8h3zM3 9h5v4H3zm5 4h4v5H8zm5-3h5v4h-5z"/><path fill="#ffe457" d="M8 8h5v5H8z"/>`,
  };
  function badge(u, p, n, c) {
    const b = u.el('span', 'pixel-badge ' + c, p);
    b.setAttribute('aria-hidden', 'true');
    b.innerHTML = '<svg viewBox="0 0 28 32" xmlns="http://www.w3.org/2000/svg">' + BADGES[n] + '</svg>';
    return b;
  }
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
      u.el('nav', 'design-nav', header, D.nav.replace(/\s{2,}/g, ' ⚒ '));
      const mast = u.el('div', 'design-mast', header);
      badge(u, mast, 'house', 'mast-house left');
      u.el('div', 'design-brand', mast, D.brand);
      badge(u, mast, 'house', 'mast-house right');
      u.el('div', 'design-sub', mast, 'A Friendly Place on the Web');
      const tag = u.el('div', 'design-tag', header);
      u.el('div', '', tag, 'Small People');
      u.el('div', '', tag, 'Make a Brighter Web');
      u.el('div', 'design-date', tag, 'Mon, Apr 28, 1996');
      const body = u.el('div', 'design-body', shell);
      const note = u.el('section', 'task-note', body);
      note.dataset.role = 'instruction';
      if (ctx.instruction.length > 85) note.classList.add('long-instruction');
      if (ctx.display === 'panel') {
        if (D.mode.includes('side') || D.mode === 'twin') u.el('h2', '', note, 'Today’s Task');
        const brief = u.el('div', 'task-brief', note);
        badge(u, brief, 'pencil', 'task-pencil');
        u.el('p', '', brief, ctx.instruction);
        const qn = u.el('div', 'qn', note);
        u.el('h3', '', qn, 'Quick Notes');
        const ul = u.el('ul', '', qn);
        [
          'Be kind and keep it friendly.',
          'You can also Retweet or Like.',
          'Complete the requested action.',
        ].forEach((t) => u.el('li', '', ul, t));
        const cm = u.el('div', 'qn community', note);
        badge(u, cm, 'people', 'community-people');
        u.el('h3', '', cm, 'Community');
        ['New Posts Today: 24', 'Online Now: 6', 'Welcome!'].forEach((t) => u.el('div', 'qlink', cm, t));
        const day = u.el('div', 'good-day', cm);
        badge(u, day, 'flower', 'flower');
        const wish = u.el('span', '', day);
        wish.innerHTML = 'Have a<br>great day!';
      } else note.hidden = true;
      let headerNote = null;
      if (ctx.display === 'header') {
        headerNote = u.el('div', 'header-task-note', header, ctx.instruction);
        headerNote.dataset.role = 'instruction';
      }
      const stage = u.el('main', 'stage', body);
      const footer = u.el('footer', 'design-footer', shell);
      if (ctx.display === 'toast') {
        const t = u.el('div', 'instruction-toast-card', footer, ctx.instruction);
        t.dataset.role = 'instruction';
      }
      const fl = u.el('div', 'footer-label', footer);
      u.el('h3', '', fl, 'Actions');
      u.el('div', '', fl, 'Complete the requested action.');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          labels = ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const labelPool = labels.map(labelOf),
          baseline = labelPool.find((x) => x.toLowerCase() === 'submit') || labelPool[0],
          alternates = labelPool.filter((x) => x.toLowerCase() !== baseline.toLowerCase()),
          keepBaseline = er.bool(0.5) || !alternates.length;
        const label = keepBaseline ? baseline : er.pick(alternates),
          placement = keepBaseline ? 'footer' : er.pick(['header', 'footer-link', 'footer']);
        const makeEnd = (parent, cls, link) => {
          const b = u.el(link ? 'a' : 'button', cls, parent, label);
          if (link) b.href = '#';
          else b.type = 'button';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        if (placement === 'header') submit = makeEnd(header, 'header-end-control', false);
        else if (placement === 'footer-link') submit = makeEnd(footer, 'end-link', true);
        else submit = makeEnd(footer, 'end-control', false);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const same = (x) => x.trim().toLowerCase() === label.trim().toLowerCase();
          const options = [...new Set(labels.map(labelOf))].filter((x) => !same(x));
          if (options.length) {
            const d = u.el('button', 'xtra-control', footer, cr.pick(options));
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
          }
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
