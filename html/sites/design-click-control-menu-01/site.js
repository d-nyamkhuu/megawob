(function () {
  'use strict';
  const palette = { bg: '#c9cccf', panel: '#e5e6e7', fg: '#080e20', muted: '#54606d', line: '#7e8996' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'openlook', 'inspector', 'display-' + _c.display);
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, 'Contact Manager');
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML = '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const badge = u.el('span', 'app-badge', title);
      badge.innerHTML = '<svg viewBox="0 0 24 24"><rect x="5" y="6" width="14" height="15" rx="2" fill="#172335" stroke="#fff"/><path d="M7 5Q12 0 17 5M4 8v13h15" fill="none" stroke="#172335"/></svg>';
      u.el('span', 'sun-brand', title, '❖ Sun');
      const toolbar = u.el('div', 'tools', head);
      ['File', 'Edit', 'View', 'People', 'Tools', 'Help'].forEach((t) => u.el('span', 'tool-label', toolbar, t));
      const center = u.el('section', 'center');
      Object.assign(_c, { shell, toolbar, center, header: toolbar });
    },
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
      const note = _c.center.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'work', _c.shell);
      body.appendChild(_c.center);
      const aside = u.el('aside', 'inspector', body);
      ['Contact Details', 'No contact selected', 'Name:   —', 'Email:   —', 'Phone:   —', 'Group:   —', 'Notes:'].forEach((s, i) => {
        const line = u.el(i === 0 ? 'h2' : 'p', '', aside);
        if (i > 1 && s.includes('—')) {
          u.el('span', 'detail-label', line, s.split(':')[0] + ':');
          u.el('span', 'detail-value', line, '—');
        } else if (i === 1) u.el('span', 'contact-empty', line, s);
        else line.textContent = s;
        if (i === 1) {
          const portrait = u.el('span', 'portrait', line);
          portrait.innerHTML = '<svg viewBox="0 0 90 90"><circle cx="45" cy="29" r="14"/><path d="M24 76V61C24 37 66 37 66 61V76Z"/></svg>';
          line.prepend(portrait);
        }
        if (i === 6) {
          const notes = u.el('div', 'notes-box', line);
          const track = u.el('div', 'notes-track', notes);
          u.el('span', 'notes-up', track, '▲');
          u.el('span', 'notes-down', track, '▼');
        }
      });
      Object.assign(_c, { body, aside });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.aside.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('ready');
      ready.textContent = 'Ready.';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.querySelector('.ref-tools'));
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
    name: 'design-click-control-menu-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-menu-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1d43ac'],
      LOW_ACCENTS: ['#1d43ac'],
      parts,
    },
  });
})();
