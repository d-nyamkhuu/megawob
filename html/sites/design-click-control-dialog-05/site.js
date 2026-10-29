(function () {
  'use strict';
  const cfg = {
    'title': 'File Manager',
    'theme': 'qtp',
    'layout': 'fm',
    'menus': ['File', 'Edit', 'View', 'Go', 'Bookmarks', 'Tools', 'Help'],
    'rail': ['Files', 'Search', 'Favorites', 'Settings', 'Help'],
    'side':
      'Task|Steps:|1.  Find the dialog named above.|2.  Click the requested button in it.|3.  Do not change any settings.',
  };
  const RAILICO = [
    '<svg viewBox="0 0 32 32"><defs><linearGradient id="rail-folder" x2="0" y2="1"><stop stop-color="#fff5b1"/><stop offset="1" stop-color="#e5b32f"/></linearGradient></defs><path d="M3 7q0-2 2-2h8l3 3h13v20H2z" fill="#e2b347" stroke="#786535"/><path d="M4 10h26l-2 18H2z" fill="url(#rail-folder)" stroke="#9b7925"/><path d="M5 12h23M5 8h7" fill="none" stroke="#fff9d4"/></svg>',
    '<svg viewBox="0 0 32 32"><defs><radialGradient id="rail-glass" cx=".35" cy=".25"><stop stop-color="white"/><stop offset=".65" stop-color="#e0f5ff"/><stop offset="1" stop-color="#7eaddb"/></radialGradient></defs><path d="M20 20l9 9" stroke="#384e78" stroke-width="5" stroke-linecap="round"/><path d="M21 20l8 8" stroke="#8ba4cb" stroke-width="2"/><circle cx="13" cy="13" r="10" fill="#a9b5c5" stroke="#3e506d"/><circle cx="13" cy="13" r="8" fill="url(#rail-glass)" stroke="#fff"/><path d="M7 13q0-7 7-7" fill="none" stroke="white"/></svg>',
    '<svg viewBox="0 0 32 32"><defs><linearGradient id="rail-star" x2=".7" y2="1"><stop stop-color="#fffbc4"/><stop offset=".5" stop-color="#f9d66c"/><stop offset="1" stop-color="#c39023"/></linearGradient></defs><path d="M16 2l4 9 10 1-7.5 7 2.3 10L16 24l-8.8 5 2.3-10L2 12l10-1z" fill="url(#rail-star)" stroke="#96722a"/><path d="m16 6-3 7-7 1 6 5-1 6 5-4 6 4-2-7 6-4-8-1z" fill="none" stroke="#fff1b6"/></svg>',
    '<svg viewBox="0 0 32 32"><defs><linearGradient id="rail-gear" x2="1" y2="1"><stop stop-color="#e5e9ee"/><stop offset="1" stop-color="#778491"/></linearGradient></defs><path d="m13 2 5 0 1 4 3 1 3-2 3 4-2 3 1 3 4 1-1 5-4 0-2 3 1 4-4 2-3-3-3 1-2 3-5-2 1-4-2-2-4-1 0-5 4-1 1-3-2-3 3-3 3 2 3-1z" fill="url(#rail-gear)" stroke="#485363"/><circle cx="16" cy="16" r="7" fill="#b9c2cc" stroke="#f2f3f4"/><circle cx="16" cy="16" r="5" fill="#6b7886" stroke="#485363"/></svg>',
    '<svg viewBox="0 0 32 32"><defs><linearGradient id="rail-help" x2=".5" y2="1"><stop stop-color="#acd1ff"/><stop offset=".45" stop-color="#71a3e9"/><stop offset="1" stop-color="#315b9e"/></linearGradient></defs><circle cx="16" cy="16" r="14" fill="url(#rail-help)" stroke="#405e83"/><path d="M5 13Q7 3 17 4" stroke="#e3f2ff" fill="none"/><text x="16" y="25" text-anchor="middle" font-size="26" fill="#fff" font-family="Arial">?</text></svg>',
  ];
  env.site({
    name: 'design-click-control-dialog-05',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body);
      const rail = u.el('nav', 'rail', shell);
      const rt = u.el('div', 'rail-top', rail);
      rt.innerHTML =
        '<svg viewBox="0 0 26 28"><defs><linearGradient id="app-tile" x2="1" y2="1"><stop stop-color="#fbfcfd"/><stop offset="1" stop-color="#a7b3bc"/></linearGradient></defs><rect x="1" y="1" width="24" height="26" rx="1" fill="url(#app-tile)" stroke="#6d7479"/><path d="m5 20 12-13 3-1-2 4L7 23z" fill="#737e8a" stroke="#394757" stroke-width=".7"/><path d="M17 4q-5-1-5 4l-5 7-3 1 3 4 4-3 5-7q5 0 4-5l-3 3-2-2z" fill="#c4cdd4" stroke="#657280" stroke-width=".8"/><path d="m6 6 3 1 11 13-2 2L6 9z" fill="#7892a9" stroke="#4b5b6a" stroke-width=".7"/><path d="m9 8 8 10" stroke="#f3f5f7"/></svg>';
      cfg.rail.forEach((s, i) => {
        const it = u.el('div', 'rail-item' + (i === 0 ? ' active' : ''), rail);
        u.el('i', '', it).innerHTML = RAILICO[i];
        u.el('span', '', it, s);
      });
      const main = u.el('div', 'main', shell);
      const head = u.el('header', 'head', main);
      const title = u.el('div', 'title', head);
      u.el('span', 'title-caption', title, cfg.title);
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 12h9"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const menu = u.el('div', 'tools', head);
      cfg.menus.forEach((l) => {
        const item = u.el('span', 'menu-label', menu);
        u.el('u', '', item, l[0]);
        u.el('span', '', item, l.slice(1));
      });
      const work = u.el('div', 'work', main);
      const center = u.el('section', 'center', work);
      let display = ctx.display || 'header';
      if (display === 'panel' && (window.innerWidth < 1260 || window.innerHeight < 680)) display = 'header';
      if (display === 'toast' && window.innerHeight < 680) display = 'header';
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display === 'toast') {
        note.classList.add('instruction-toast');
      }
      if (display === 'panel') {
        note.classList.add('instruction-panel');
        work.insertBefore(note, center);
      }
      const stage = u.el('div', 'stage', center);
      const foot = u.el('footer', 'footer', main);
      u.el('span', 'ready', foot, '1 item selected');
      const views = u.el('span', 'views', foot);
      views.innerHTML = '<i class="on"></i><i></i><i></i><b><s></s></b>';
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const keep = er.bool(0.5);
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
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const label = keep ? 'Submit' : labelOf(er.pick(labels));
        const placement = keep ? 'footer' : er.pick(['toolbar', 'footer', 'link']);
        const parent = placement === 'toolbar' ? menu : foot;
        const cls = placement === 'link' ? 'submit end-link' : 'submit';
        submit = u.el(placement === 'link' ? 'a' : 'button', cls, parent, label);
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
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
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const current = submit ? submit.textContent.trim().toLowerCase() : 'submit';
        const pool = [...new Set(labels.map(labelOf))].filter((x) => x.trim().toLowerCase() !== current);
        if (pool.length) {
          const label = cr.pick(pool);
          const b = u.el('button', 'chrome-xtra', menu, label);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
