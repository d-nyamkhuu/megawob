(function () {
  'use strict';
  const NAV = [
    ['Home', 'M3 11l9-8 9 8M5 10v11h5v-7h4v7h5V10'],
    ['Clients', 'M12 12a4 4 0 100-8 4 4 0 000 8zm-8 9c0-4 4-6 8-6s8 2 8 6z'],
    ['Tasks', 'M5 3h14a1 1 0 011 1v16H4V4a1 1 0 011-1zM8 12l3 3 5-6'],
    ['Calendar', 'M5 5h14a1 1 0 011 1v15H4V6a1 1 0 011-1zM4 10h16M8 2v5M16 2v5'],
    ['Reports', 'M3 21V12h3v9zM10 21V3h3v18zM17 21V8h3v13z'],
    ['Settings', 'M9 3l1-2h4l1 2 2 1 2 0 2 3-1 2v3l1 2-2 3h-2l-2 1-1 3h-4l-1-3-2-1H5l-2-3 1-2V9L3 7l2-3h2zM12 7a5 5 0 100 10 5 5 0 000-10z'],
  ];
  const CHECKS = ['Create client record', 'Send welcome email', 'Schedule kickoff call',
    'Assign account manager', 'Confirm documentation', 'Mark as ready'];
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
  const palette = { bg: '#8398b5', panel: '#ffffff', fg: '#0a0e16', muted: '#667287', line: '#d4d8de' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'nb');
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
      u.el('div', 'crumbs', top, 'Clients  ›  New Client');
      const right = u.el('div', 'top-r', top);
      const help = u.el('span', 'help', right);
      u.el('i', '', help, '?');
      u.el('span', '', help, 'Help');
      u.el('span', 'avatar', right, 'JD');
      u.el('h1', '', main, 'Client Intake');
      const noteSlot = u.el('div', 'note-slot', main);
      main.dataset.display = _c.display;
      Object.assign(_c, { main, right, noteSlot, header: noteSlot });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.right;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.main;
      const u = _c.util;
      const notes = u.el('aside', 'notes', document.body);
      const nh = u.el('div', 'notes-h', notes);
      const di = u.el('span', 'doc', nh);
      di.innerHTML = '<svg viewBox="0 0 24 28"><path d="M3 1h11l8 8v16a2 2 0 01-2 2H3a2 2 0 01-2-2V3a2 2 0 012-2z" fill="currentColor"/><path d="M14 1v8h8M6 13h10M6 17h10M6 21h7" fill="none" stroke="white" stroke-width="1.5" stroke-linejoin="round"/></svg>';
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
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.noteSlot.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.main.appendChild(foot);
      const clear = _c.util.el('button', 'clear-form', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () =>
        _c.stage.querySelectorAll('input,textarea').forEach((input) => (input.value = '')),
      );
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.querySelector('.clear-form'));
    },
    overlay: () => (ctx) => {
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
  };
  env.site({
    name: 'design-click-control-focus-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-focus-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ee540a'],
      LOW_ACCENTS: ['#ee540a'],
      parts,
    },
  });
})();
