(function () {
  'use strict';
  const palette = { bg: '#d3dbe1', panel: '#f8f9fa', fg: '#293747', muted: '#5a6470', line: '#b9c3cf' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'metro', 'frame');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const tb = u.el('div', 'title', head);
      const logo = u.el('span', 'wlogo', tb);
      logo.innerHTML =
        '<svg viewBox="0 0 16 16"><path d="M1 2.4 6.6 1.6v5.2H1ZM7.4 1.5 15 .4v6.4H7.4ZM1 7.6h5.6v5.2L1 12ZM7.4 7.6H15v6.4l-7.6-1.1Z"/></svg>';
      u.el('span', 'ttext', tb, 'Feedback Form');
      const wc = u.el('span', 'window-controls', tb);
      wc.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 8.5h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3.5 3.5h9v9h-9Z"/></svg></i><i class="close"><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const mb = u.el('nav', 'menubar', head);
      ['File', 'Edit', 'View', 'Help'].forEach((s) => u.el('span', '', mb, s));
      const work = u.el('div', 'work', shell);
      const panel = u.el('section', 'panel', work);
      const banner = u.el('div', 'banner', panel);
      u.el('span', '', banner, 'User Feedback');
      const privacy = u.el('button', 'privacy', panel, 'View our privacy policy');
      privacy.type = 'button';
      privacy.addEventListener('click', () => env.log('decoy', { label: 'View our privacy policy' }));
      const body = u.el('div', 'pbody', panel);
      Object.assign(_c, { shell, mb, panel, header: body, body });
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
      _c.header = _c.mb;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.header;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction', 'instruction-panel');
        panel.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      _c.util.el('div', 'lead', _c.body, 'Please complete the form below.');
      _c.stage = _c.util.el('div', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.body.insertBefore(note, _c.body.firstChild);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const foot = u.el('footer', 'footer', _c.shell);
      const tray = u.el('span', 'tray', foot);
      tray.innerHTML =
        '<svg class="winkey" viewBox="0 0 16 16"><path d="M0 2.3 6.5 1.4v5.8H0ZM7.3 1.3 16 0v7.2H7.3ZM0 8h6.5v5.8L0 12.9ZM7.3 8H16v8l-8.7-1.2Z"/></svg>';
      base(_c);
      const controls = document.body.querySelector('.ref-foot');
      foot.appendChild(controls);
      const sys = u.el('span', 'sysicons', foot);
      sys.innerHTML =
        '<svg viewBox="0 0 16 16"><path d="m3 11 5-5 5 5"/></svg><svg viewBox="0 0 16 16"><path d="M2 6h3l4-3v10l-4-3H2ZM11 5.5a3.5 3.5 0 0 1 0 5M13 3.5a6.5 6.5 0 0 1 0 9"/></svg><svg viewBox="0 0 16 16"><path d="M2 3h12v8H2ZM6 14h4M8 11v3"/></svg>';
      const clock = u.el('span', 'clock', foot);
      u.el('span', '', clock, '10:24 AM');
      u.el('span', '', clock, '4/12/2012');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.panel.appendChild(dock);
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
    name: 'design-click-control-widget-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'metro.css'],
    design: {
      THEMES: { metro: palette },
      LOW_THEME: palette,
      ACCENTS: ['#076bc4'],
      LOW_ACCENTS: ['#076bc4'],
      parts,
    },
  });
})();
