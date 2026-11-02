(function () {
  'use strict';
  const palette = { bg: '#063b39', panel: '#f2ead2', fg: '#10142b', muted: '#665f55', line: '#b8a98e' };
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
      document.body.className = 'cdrom instruction-' + _c.display;
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const mark = u.el('div', 'mark', top);
      u.el('i', '', mark);
      u.el('i', '', mark);
      u.el('i', '', mark);
      u.el('h1', '', top, 'Math Practice Workshop');
      u.el('div', 'tagline', top, 'Build Skills for a Brighter Tomorrow');
      const center = u.el('main', 'center', app);
      const left = u.el('section', 'left-pane', center);
      const tabs = u.el('nav', 'tabs', left);
      ['Add', 'Subtract', 'Multiply', 'Divide'].forEach((x, i) => u.el('div', 'tab' + (!i ? ' active' : ''), tabs, x));
      const aside = u.el('aside', 'aside', center);
      const rtabs = u.el('nav', 'tabs', aside);
      ['Instructions', 'Examples', 'Help'].forEach((x, i) => u.el('div', 'tab' + (!i ? ' active' : ''), rtabs, x));
      u.el('h2', 'aside-title', aside, 'Building Blocks');
      u.el('div', 'rule', aside);
      const list = u.el('ol', 'steps', aside);
      ['Practice at your own pace.', 'Review your work before moving on.'].forEach((x) => u.el('li', '', list, x));
      const footer = u.el('footer', 'bottom', app);
      u.el('div', 'disc', footer);
      u.el('span', 'motto', footer, 'Learning Today  A Brighter Tomorrow');
      u.el('span', 'companion', footer, 'CD-ROM Companion');
      Object.assign(_c, { app, center, left, aside, footer, toolbar: tabs, header: left });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      if (_c.submit) _c.submit.classList.add('cd-top-control');
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.left);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.app.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.footer.appendChild(foot);
        const extras = _c.util.el('div', 'cd-foot-extras ref-tools', _c.left);
        for (const button of foot.querySelectorAll('.ref-xtra')) extras.appendChild(button);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    'frame.end': (base) => (_c) => {
      const result = base(_c);
      // Addition moves the supplied handle into its scene. Supply the complete
      // template container, sized to its end control, to retain its placement.
      if (_c.placement === 'footer' || _c.placement === 'link') {
        result.submit = _c.footer.querySelector('.ref-foot');
      } else if (_c.placement === 'floating') {
        result.submit = _c.footer.querySelector('.ref-float-dock');
      }
      return result;
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        messages = {
          cookie: 'This application stores preferences on your device.',
          toast: 'Your workspace has been synced.',
          chat: 'Need help with this exercise?',
          promo: 'Try the new practice collection.',
          banner: 'An updated practice collection is available.',
        };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-read-figure-addition-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#00796d'],
      LOW_ACCENTS: ['#00796d'],
      parts,
    },
  });
})();
