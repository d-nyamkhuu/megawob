(function () {
  'use strict';
  const palette = { bg: '#eaf1f7', panel: '#eef3fa', fg: '#111111', muted: '#435873', line: '#8fa6c4' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original work area has space for its side card and inline toast.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'forum', 'split');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, 'Project Library');
      const acct = u.el('div', 'acct', head);
      acct.innerHTML = '<a>Help</a><i>|</i><a>My Account</a><i>|</i><a>Sign Out</a>';
      const ov = u.el('section', 'overview', shell);
      const l = u.el('div', 'ov-l', ov);
      u.el('h2', '', l, 'Riverdale Community Project');
      [
        ['Project ID:', 'RCP-1042'],
        ['Status:', 'In Progress'],
        ['Owner:', 'Taylor Kim'],
        ['Last Updated:', 'Apr 12, 2003'],
      ].forEach((r) => {
        const d = u.el('div', 'ov-row', l);
        u.el('b', '', d, r[0]);
        u.el('span', '', d, r[1]);
      });
      const r = u.el('div', 'ov-r', ov);
      u.el('h3', '', r, 'Project Summary');
      u.el('p', '', r,
        'The Riverdale Community Project aims to improve local parks, expand volunteer opportunities, and provide resources for neighborhood initiatives. This page contains key project information, links, and notes for team members.');
      const taskbar = u.el('div', 'taskbar', shell);
      const caption = u.el('span', 'taskbar-label', taskbar, 'Your Task');
      caption.hidden = _c.display === 'hidden';
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      Object.assign(_c, { shell, taskbar, work, center, header: center });
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
      _c.header = _c.taskbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      base(_c);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.center.insertBefore(note, _c.stage);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      const status = foot.querySelector('.ref-foot-text');
      status.classList.add('footer-status');
      status.textContent = _c.ctx.finish ? 'Project records are up to date.' : '';
      status.hidden = !_c.ctx.finish;
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-click-control-collapsible-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#41678e'],
      LOW_ACCENTS: ['#41678e'],
      parts,
    },
  });
})();
