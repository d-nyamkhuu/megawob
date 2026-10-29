(function () {
  'use strict';
  const SIDE = [
    [
      'Notes',
      '<path d="M4 2h11l5 5v15H4z" fill="#936a2d" stroke="#7a5018"/><path d="M15 2v6h5M7 11h10M7 14h10M7 17h10" fill="none" stroke="#e9d4a1" stroke-width=".8"/>',
    ],
    [
      'Tasks',
      '<rect x="4" y="4" width="16" height="16" rx="2" fill="none" stroke="#3a2c1e" stroke-width="1.8"/><path d="m8 12 3 3 5-6" fill="none" stroke="#3a2c1e" stroke-width="2"/>',
    ],
    [
      'Calendar',
      '<rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="#3a2c1e" stroke-width="1.8"/><path d="M3 10h18M8 3v4M16 3v4" stroke="#3a2c1e" stroke-width="1.8"/><path d="M7 13h2M11 13h2M15 13h2M7 17h2M11 17h2" stroke="#3a2c1e" stroke-width="1.8"/>',
    ],
    [
      'Favorites',
      '<defs><linearGradient id="goldstar" x2="1" y2="1"><stop stop-color="#bd9652"/><stop offset=".5" stop-color="#8b5b15"/><stop offset="1" stop-color="#af843b"/></linearGradient></defs><path d="m12 2.5 3 6.3 6.8.8-5 4.7 1.3 6.8-6.1-3.4-6.1 3.4 1.3-6.8-5-4.7 6.8-.8z" fill="url(#goldstar)" stroke="#7d5a26" stroke-width=".4"/>',
    ],
    [
      'Trash',
      '<path d="M5 7h14l-1 16H6Z" fill="#3f3a2e"/><path d="M3 5.5h18M9 5.5V2.5h6v3" fill="none" stroke="#3f3a2e" stroke-width="1.8"/><path d="m8.5 9 .7 11M12 9v11m3.5-11-.7 11" fill="none" stroke="#f1e9d7" stroke-width="1.2"/>',
    ],
  ];
  const TOOLS = [
    ['New Note', '<path d="M12 4v16M4 12h16" stroke="#3a2c1e" stroke-width="2.2"/>'],
    [
      'Calendar',
      '<rect x="3" y="5" width="18" height="16" rx="2" fill="none" stroke="#3a2c1e" stroke-width="1.8"/><path d="M3 8h18M8 3v4M16 3v4" stroke="#3a2c1e" stroke-width="2.2"/><path d="M7 12h2m2 0h2m2 0h2M7 16h2m2 0h2m2 0h2" stroke="#3a2c1e" stroke-width="1.8"/>',
    ],
    [
      'Search',
      '<circle cx="10" cy="10" r="6" fill="none" stroke="#3a2c1e" stroke-width="2"/><path d="m15 15 6 6" stroke="#3a2c1e" stroke-width="2.4"/>',
    ],
  ];
  const svg = (p, c) => '<svg viewBox="0 0 24 24" class="' + (c || '') + '">' + p + '</svg>';
  env.site({
    name: 'design-click-control-menu-08',
    styles: ['org.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'orgz';
      const shell = u.el('main', 'o-shell', document.body);
      const left = u.el('div', 'o-left', shell);
      const top = u.el('section', 'o-top', left);
      const pin = u.el('div', 'o-pin', top);
      pin.innerHTML =
        '<svg viewBox="0 0 40 60"><defs><linearGradient id="brass"><stop stop-color="#53360e"/><stop offset=".28" stop-color="#a77b34"/><stop offset=".52" stop-color="#c29c59"/><stop offset=".75" stop-color="#98702d"/><stop offset="1" stop-color="#573b15"/></linearGradient></defs><path d="m19 36 1 19 2-19" fill="#aaa99a" stroke="#4b4634"/><path d="M12 9h16l-3 21 6 4v5H9v-5l6-4Z" fill="url(#brass)" stroke="#563a16" stroke-width="1.5"/><ellipse cx="20" cy="9" rx="12" ry="5" fill="url(#brass)" stroke="#593913" stroke-width="1.5"/><ellipse cx="20" cy="34" rx="11" ry="4" fill="url(#brass)" stroke="#593913" stroke-width="1.5"/><path d="M11 8q8-4 15-1M11 33q6-3 14-1" fill="none" stroke="#e4c78a" opacity=".7"/></svg>';
      const card = u.el('div', 'o-taskcard', top);
      u.el('h2', '', card, 'Your Task');
      const note = u.el('div', 'instruction', card, ctx.instruction);
      note.dataset.display = ctx.display;
      const display = ctx.display || 'header';
      if (display === 'hidden' || display === 'panel') {
        card.hidden = true;
        pin.hidden = true;
      }
      if (display === 'toast') {
        card.classList.add('o-notice');
        card.querySelector('h2').textContent = 'Task notice';
      }
      const book = u.el('section', 'o-book', left);
      const rings = u.el('div', 'o-rings', book);
      for (let i = 0; i < 9; i++) u.el('i', '', rings);
      const page = u.el('div', 'o-page', book);
      const bar = u.el('header', 'o-bar', page);
      const logo = u.el('span', 'o-logo', bar);
      logo.innerHTML =
        '<svg viewBox="0 0 72 82"><defs><linearGradient id="binding" x2="0" y2="1"><stop stop-color="#bd8a53"/><stop offset=".5" stop-color="#8f5a2c"/><stop offset="1" stop-color="#683e1a"/></linearGradient><linearGradient id="sheet" x2="1" y2="1"><stop stop-color="#fffdf2"/><stop offset="1" stop-color="#d8d0b9"/></linearGradient><linearGradient id="metal"><stop stop-color="#3b3429"/><stop offset=".5" stop-color="#ddd6c6"/><stop offset="1" stop-color="#4c4639"/></linearGradient></defs><rect x="2" y="3" width="68" height="76" rx="7" fill="url(#binding)" stroke="#503718" stroke-width="2"/><rect x="5" y="6" width="61" height="68" rx="4" fill="none" stroke="#cfab78"/><path d="M15 12 63 16 54 71 7 66Z" fill="#746747"/><path d="m14 10 48 3-9 54L6 63Z" fill="url(#sheet)" stroke="#9d947d"/><path d="m17 23 36 2m-37 5 35 2m-36 6 35 2m-36 6 32 2m-33 5 23 2" stroke="#aaa18c"/><path d="M22 5q0-9 3-1v13m17-12q0-9 3-1v14m14-12q0-9 3-1v14" fill="none" stroke="url(#metal)" stroke-width="3"/><path d="m57 17 4 3-20 43-6 6 1-9Z" fill="#aca99c" stroke="#706b5b"/><path d="m59 20-21 42" stroke="#fff" stroke-width="2"/></svg>';
      u.el('span', 'o-name', bar, 'My Organizer');
      const sp = u.el('span', 'o-spacer', bar);
      TOOLS.forEach((t) => {
        const b = u.el('span', 'o-tool', bar);
        b.innerHTML = svg(t[1]) + '<em>' + t[0] + '</em>';
      });
      const body = u.el('div', 'o-body', page);
      const side = u.el('nav', 'o-side', body);
      SIDE.forEach((s, i) => {
        const r = u.el('div', i === 0 ? 'on' : '', side);
        r.innerHTML = svg(s[1]) + '<span>' + s[0] + '</span>';
      });
      const paper = u.el('section', 'o-paper', body);
      u.el('h1', '', paper, 'Welcome');
      u.el('div', 'o-date', paper, 'Apr 27, 2010');
      const stage = u.el('div', 'stage', page);
      u.el('p', 'o-text', paper, 'Keep track of your ideas, to-dos, and important information in one place.');
      u.el('p', 'o-text', paper, 'Use the Menu above to access more options.');
      const right = u.el('aside', 'o-right', shell);
      u.el('h3', '', right, 'Task Progress');
      ['Find the Menu button', 'Click the requested menu item', 'Complete the task'].forEach((s, i) => {
        const r = u.el('div', 'o-step', right);
        u.el('i', i === 0 ? 'cur' : '', r);
        u.el('span', '', r, s);
      });
      u.el('hr', '', right);
      if (display === 'panel') {
        if (ctx.instruction.length > 160 && right.getBoundingClientRect().width < 280) {
          card.hidden = false;
          pin.hidden = false;
        } else {
          const ticket = u.el('section', 'o-ticket', right);
          u.el('h3', '', ticket, 'Your Task');
          ticket.append(note);
        }
      }
      const er = ctx.rng.fork('chrome/end');
      const placement = er.pick(['answer', 'answer', 'footer', 'header']);
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const label = placement === 'answer' ? 'Submit' : labelOf(er.pick(ctx.content.END_LABELS));
      const answer = u.el('section', 'o-answer', right);
      u.el('h3', '', answer, ctx.finish ? 'Organizer status' : 'Submit Your Answer');
      u.el(
        'p',
        '',
        answer,
        ctx.finish
          ? 'Review your organizer when ready.'
          : placement === 'header'
            ? 'Click the checkmark above when you have completed the task.'
            : placement === 'footer'
              ? 'Click the button at the foot of this page when you have completed the task.'
              : 'Click the button below when you have completed the task.',
      );
      let submit = null;
      if (!ctx.finish) {
        const parent =
          placement === 'answer' ? answer : placement === 'footer' ? u.el('footer', 'o-endfooter', right) : right;
        submit = u.el(
          'button',
          'submit' + (placement === 'header' ? ' o-endicon' : ''),
          parent,
          placement === 'header' ? '✓' : label,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', ctx.submit);
        if (placement === 'header') right.classList.add('o-headerend');
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const pool = [...new Set(endLabels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) {
          const text = cr.pick(pool);
          const b = u.el('button', 'o-xtra', answer, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
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
