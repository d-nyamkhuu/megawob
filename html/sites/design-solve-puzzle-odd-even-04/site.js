(function () {
  'use strict';
  const site = 'design-solve-puzzle-odd-even-04';
  const palette = { bg: '#5599dc', panel: '#eef5fc', fg: '#172744', muted: '#637997', line: '#c9dbef' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The dedicated practice pane accommodates every instruction display.
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
      document.body.className = 'riso horizontal instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'Number Sort');
      u.el('nav', 'menu', top, 'HOME    PRACTICE    HELP');
      const mountain = u.el('img', 'mountain-art', top);
      mountain.src = 'sites/' + site + '/assets/mountain-sun.webp';
      mountain.alt = '';
      const center = u.el('div', 'center', app);
      const brief = u.el('div', 'brief', center);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, 'Practice Builds Confidence');
      u.el('p', 'aside-copy', aside, '');
      const bottom = u.el('footer', 'bottom', app);
      const art = u.el('div', 'footer-art', bottom);
      const trees = u.el('img', '', art);
      trees.src = 'sites/' + site + '/assets/footer-trees.webp';
      trees.alt = '';
      u.el('div', 'footer-tagline', bottom, 'A BRIGHTER\nTOMORROW\nADDS UP');
      Object.assign(_c, { app, center, brief, bottom, header: bottom });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.app;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => { base(_c); },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.brief;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.app.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.bottom.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.bottom.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u=ctx.util, el=u.el('div','overlay '+ctx.kind,document.body);
      const messages={cookie:'This application stores preferences on your device.',toast:'Your workspace has been synced.',chat:'Need help with this exercise?',promo:'Try the new practice collection.',banner:'An updated practice collection is available.'};
      u.el('span','',el,messages[ctx.kind]);
      const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept':'Dismiss');
      dismiss.addEventListener('click',ctx.dismiss);
      return {el,dismiss};
    }
  };
  env.site({
    name: site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-odd-even-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#287ce8'],
      LOW_ACCENTS: ['#287ce8'],
      parts
    }
  });
})();
