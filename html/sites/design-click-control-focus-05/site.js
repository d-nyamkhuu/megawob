(function () {
  'use strict';
  const NAV = [
    ['Home', 'M3 11l9-8 9 8M5 10v11h5v-7h4v7h5V10'],
    ['Clients', 'M12 12a4 4 0 100-8 4 4 0 000 8zm-8 9c0-4 4-6 8-6s8 2 8 6z'],
    ['Tasks', 'M5 3h14a1 1 0 011 1v16H4V4a1 1 0 011-1zM8 12l3 3 5-6'],
    ['Calendar', 'M5 5h14a1 1 0 011 1v15H4V6a1 1 0 011-1zM4 10h16M8 2v5M16 2v5'],
    ['Reports', 'M3 21V12h3v9zM10 21V3h3v18zM17 21V8h3v13z'],
    [
      'Settings',
      'M9 3l1-2h4l1 2 2 1 2 0 2 3-1 2v3l1 2-2 3h-2l-2 1-1 3h-4l-1-3-2-1H5l-2-3 1-2V9L3 7l2-3h2zM12 7a5 5 0 100 10 5 5 0 000-10z',
    ],
  ];
  const CHECKS = [
    'Create client record',
    'Send welcome email',
    'Schedule kickoff call',
    'Assign account manager',
    'Confirm documentation',
    'Mark as ready',
  ];
  const END_LABELS = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
  const NS = 'http://www.w3.org/2000/svg';
  function icon(parent, d, filled) {
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('class', 'ico');
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', d);
    if (filled) p.setAttribute('fill', 'currentColor');
    s.appendChild(p);
    parent.appendChild(s);
    return s;
  }
  env.site({
    name: 'design-click-control-focus-05',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref nb';
      const win = u.el('main', 'win', document.body);
      const side = u.el('nav', 'side', win);
      const brand = u.el('div', 'brand', side);
      u.el('span', 'logo', brand).appendChild(document.createElement('i'));
      const bt = u.el('div', 'brand-t', brand);
      u.el('b', '', bt, 'Northbridge');
      u.el('small', '', bt, 'Operations Portal');
      NAV.forEach((n, i) => {
        const it = u.el('div', 'nav-item' + (i === 1 ? ' on' : ''), side);
        icon(it, n[1], false);
        u.el('span', '', it, n[0]);
      });
      const main = u.el('section', 'main', win);
      const top = u.el('header', 'top', main);
      const bc = u.el('div', 'crumbs', top);
      bc.textContent = 'Clients  ›  New Client';
      const right = u.el('div', 'top-r', top);
      const help = u.el('span', 'help', right);
      u.el('i', '', help, '?');
      u.el('span', '', help, 'Help');
      u.el('span', 'avatar', right, 'JD');
      u.el('h1', '', main, 'Client Intake');
      const note = u.el('div', 'instruction', main);
      const mark = u.el('span', 'mark', note, '!');
      const nt = u.el('span', 'note-t', note, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      main.dataset.display = ctx.display;
      const stage = u.el('div', 'stage', main);
      const foot = u.el('footer', 'footer', main);
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const placement = er.pick(['footer', 'footer', 'header', 'link']);
        const bank = (ctx.content && ctx.content.END_LABELS) || END_LABELS;
        const picked = er.pick(bank);
        const label = er.bool(0.5)
          ? 'Submit'
          : typeof picked === 'string'
            ? picked
            : picked.label || picked.text || picked.name || String(picked);
        const cr = ctx.rng.fork('chrome/collide');
        let collide = null;
        if (cr.bool(0.3)) {
          const pool = (ctx.content && ctx.content.END_LABELS) || END_LABELS;
          const options = pool
            .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
            .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (options.length) collide = cr.pick(options);
        }
        const decoy = (parent, text, isCollide) => {
          const b = u.el('button', 'chrome-xtra', parent, text);
          b.type = 'button';
          b.addEventListener('click', () =>
            env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
          );
        };
        const addEnd = (parent, cls, text) => {
          const b = u.el(placement === 'link' ? 'a' : 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button';
          else b.href = '#';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        if (collide && placement !== 'header') decoy(right, collide, true);
        if (placement === 'header') {
          if (collide) decoy(right, collide, true);
          submit = addEnd(right, 'submit header-submit', label);
        } else if (placement === 'link') submit = addEnd(foot, 'submit-link', `${label} ›`);
        else {
          submit = addEnd(foot, 'submit', label);
        }
      }
      const clear = u.el('button', 'clear-form', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () =>
        stage.querySelectorAll('input,textarea').forEach((input) => (input.value = '')),
      );
      const notes = u.el('aside', 'notes', document.body);
      const nh = u.el('div', 'notes-h', notes);
      const di = u.el('span', 'doc', nh);
      di.innerHTML =
        '<svg viewBox="0 0 24 28"><path d="M3 1h11l8 8v16a2 2 0 01-2 2H3a2 2 0 01-2-2V3a2 2 0 012-2z" fill="currentColor"/><path d="M14 1v8h8M6 13h10M6 17h10M6 21h7" fill="none" stroke="white" stroke-width="1.5" stroke-linejoin="round"/></svg>';
      u.el('span', 'notes-t', nh, 'Notes');
      icon(u.el('span', 'wc', nh), 'M5 12h14');
      icon(u.el('span', 'wc x', nh), 'M5 5l14 14M19 5L5 19');
      const nb = u.el('div', 'notes-b', notes);
      u.el('h2', '', nb, 'Onboarding checklist');
      CHECKS.forEach((c) => {
        const r = u.el('div', 'chk', nb);
        u.el('i', '', r);
        u.el('span', '', r, c);
      });
      u.el('hr', '', nb);
      u.el('h2', '', nb, 'Additional notes');
      u.el('div', 'ta', nb, 'Add notes here...');
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
