(function () {
  'use strict';
  const cfg = {
    title: 'Task Studio',
    obstacle: 'BIG NEWS!',
    copy: 'We’re building an even brighter workspace experience.|Explore what’s coming soon and be part of it!',
    dismiss: 'Collapse announcement',
  };
  const palette = { bg: '#fcf9f0', panel: '#fcf9f0', fg: '#090c2b', muted: '#51536d', line: '#0c1232' };
  function drawAnnouncement(u, shell) {
    const obstacle = u.el('section', 'design-obstacle', shell);
    obstacle.hidden = true;
    u.el('h2', '', obstacle, cfg.obstacle);
    cfg.copy.split('|').forEach((t) => u.el('p', '', obstacle, t));
    const close = u.el('button', 'dismiss-design', obstacle, cfg.dismiss);
    close.type = 'button';
    close.addEventListener('click', () => { obstacle.hidden = true; });
    const art = u.el('div', 'announcement-art', obstacle);
    art.innerHTML =
      '<svg viewBox="0 0 300 200"><g stroke="#0c1232" stroke-width="7" stroke-linejoin="round"><path d="M73 129 91 179Q92 183 86 185L68 189Q63 191 61 185L46 139Z" fill="#0c1232"/><path d="M64 95 39 104Q18 111 23 132Q28 153 50 146L74 141Z" fill="#c7a5fa"/><path d="M61 95 157 22 188 146 74 141Q65 122 61 95Z" fill="#fcf9ee"/><ellipse cx="175" cy="83" rx="16" ry="65" transform="rotate(-14 175 83)" fill="#c7a5fa"/><path d="m198 33 18-23m-8 55 24-10m-18 44 23 4" fill="none" stroke-linecap="round"/></g><path d="m5 46 26-31" stroke="#c7a5fa" stroke-width="13" stroke-linecap="round"/></svg>';
    const burst = u.el('div', 'announcement-burst', obstacle);
    burst.innerHTML =
      '<svg viewBox="0 0 60 80"><path d="m7 26 29-22M9 42l44 4M8 61l12 12" fill="none" stroke="#c7a5fa" stroke-width="8" stroke-linecap="round"/></svg>';
    const squiggle = u.el('div', 'announcement-squiggle', obstacle);
    squiggle.innerHTML =
      '<svg viewBox="0 0 150 60"><path d="M5 45C18 13 28 62 43 30S65 51 80 20 104 40 119 13Q127 3 145 16" fill="none" stroke="#0c1232" stroke-width="7" stroke-linecap="round"/></svg>';
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original task area supports all note modes, even on small screens.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.remove('ref-has-note');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'memphis', 'board');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, cfg.title);
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      Object.assign(_c, { shell, work, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.work;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('work-tools');
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.center;
      base(_c);
      _c.body = body;
      const note = _c.center.querySelector('.ref-panel');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = 'panel';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
      drawAnnouncement(_c.util, _c.shell);
      _c.util.el('i', 'little-dot', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = 'toast';
        _c.center.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      const brand = foot.querySelector('.ref-foot-text');
      brand.classList.add('ready');
      brand.innerHTML =
        '<svg viewBox="0 0 64 64"><path d="M32 8A27 27 0 0 0 5 36L32 32Z" fill="#ff8e98" stroke="#10162e" stroke-width="3"/><path d="M5 36A27 27 0 0 0 32 61V32Z" fill="#ffe47b" stroke="#10162e" stroke-width="3"/><path d="M32 4A28 28 0 0 1 32 60Z" fill="#bca1f1" stroke="#10162e" stroke-width="3"/></svg><strong>Task<br>Studio</strong><small>SMALL TASKS<br>BRIGHTER DAYS</small>';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      if (ctx.kind === 'banner') {
        const source = document.querySelector('.design-obstacle');
        const el = source.cloneNode(true);
        el.hidden = false;
        el.classList.add('episode-announcement');
        document.body.appendChild(el);
        const dismiss = el.querySelector('.dismiss-design');
        dismiss.addEventListener('click', () => {
          source.hidden = true;
          ctx.dismiss();
        });
        return { el, dismiss };
      }
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        { cookie: 'Cookie preferences', toast: 'Notification', chat: 'Support', promo: 'A special offer' }[ctx.kind] ||
          'Service notice',
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
        }[ctx.kind] || 'A new update is available.',
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-click-control-pie-11',
    template: 'site/base',
    langs: ['en'],
    initialOverlay: { kind: 'banner' },
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-pie-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#b998fa'],
      LOW_ACCENTS: ['#b998fa'],
      parts,
    },
  });
})();
