(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#faf7ef', fg: '#0a1428', muted: '#606f84', line: '#c7c7c7' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('civic', 'bands', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const brand = u.el('div', 'brand', top);
      u.el('b', '', brand, 'Civic Services');
      u.el('small', '', brand, 'A more accessible community for everyone');
      const nav = u.el('nav', 'menu', top);
      for (const t of ['Home', 'Services', 'Help', 'Sign in']) u.el('span', '', nav, t);
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, top, navBar: nav, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.navBar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('brief');
    },
    'frame.stage': () => (_c) => {
      _c.util.el('div', 'sub', _c.body, 'Choose all that apply. You can select more than one.');
      _c.stage = _c.util.el('section', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('brief');
        _c.center.prepend(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('bottom');
      _c.app.appendChild(footer);
      footer.querySelector('.ref-foot-text').remove();
      const tip = u.el('div', 'tip', footer);
      footer.prepend(tip);
      const ic = u.svg('svg', { width: 68, height: 46, viewBox: '0 0 68 46', class: 'kb' }, tip);
      u.svg('rect', { x: 2, y: 3, width: 64, height: 40, rx: 5, fill: 'none', stroke: '#2b3f5c', 'stroke-width': 3 }, ic);
      u.svg('path', {
        d: 'M10 13h4M20 13h4M30 13h4M40 13h4M50 13h4M10 21h4M20 21h4M30 21h4M40 21h4M50 21h4M10 30h4M20 30h25M50 30h4',
        fill: 'none', stroke: '#2b3f5c', 'stroke-width': 3,
      }, ic);
      const tipText = u.el('span', '', tip, 'Tip: You can also use your keyboard to select tiles');
      u.el('br', '', tipText);
      u.el('span', '', tipText, '(Tab to move, Space to select).');
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.footer.classList.add('has-floating');
        _c.footer.appendChild(dock);
      }
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This site stores preferences on your device.',
        toast: 'Your request has been saved.',
        chat: 'Need help with this form?',
        promo: 'Try the new service guide.',
        banner: 'An updated service guide is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-read-figure-shades-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'civic.css'],
    design: {
      THEMES: { 'design-read-figure-shades-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0b57b8'],
      LOW_ACCENTS: ['#0b57b8'],
      parts,
    },
  });
})();
