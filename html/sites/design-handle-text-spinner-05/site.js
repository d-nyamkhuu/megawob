(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#edf7ff', fg: '#172b3f', muted: '#617384', line: '#b8d8f5' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
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
      document.body.classList.add('ref', 'material', 'horizontal');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title brandrow', head);
      const brand = u.el('div', 'brand', title);
      u.el('strong', 'brand-work', brand, 'Work');
      u.el('strong', 'brand-space', brand, 'Space');
      u.el('span', 'brand-divider', title, '|');
      u.el('span', 'section-name', title, 'Personal Settings');
      const account = u.el('div', 'account', title);
      u.el('span', '', account, 'Welcome, Alex');
      u.el('i', '', account, '|');
      u.el('a', '', account, 'My Account');
      u.el('i', '', account, '|');
      u.el('a', '', account, 'Sign Out');
      const tabs = u.el('nav', 'tools', head);
      'Home|Email|Calendar|Tasks|Settings'.split('|').forEach((s, i) => u.el('div', i === 4 ? 'active' : '', tabs, s));
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const appearance = u.el('section', 'appearance-heading', center);
      u.el('h2', '', appearance, 'Audio Settings');
      u.el('p', '', appearance, '');
      Object.assign(_c, { shell, tabs, center, header: center });
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
      _c.header = _c.tabs;
      base(_c);
      _c.header = header;
      if (_c.submit) _c.submit.classList.add('header-end');
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('instruction', 'instruction-panel');
        note.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const stage = u.el('div', 'stage', _c.center);
      const heading = u.el('div', 'stage-heading', stage);
      u.el('h2', '', heading, 'Audio Settings');
      const meter = u.el('div', 'volume-meter', stage);
      u.el('span', 'speaker low', meter, '◀');
      u.el('span', 'meter-track', meter);
      u.el('span', 'speaker high', meter, '◖)))');
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.classList.add('ready');
      text.textContent = '';
      if (_c.submit && foot.contains(_c.submit) && _c.submit.tagName === 'BUTTON') _c.submit.classList.add('submit');
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
    name: 'design-handle-text-spinner-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'web2.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#398bce'],
      LOW_ACCENTS: ['#398bce'],
      parts,
    },
  });
})();
