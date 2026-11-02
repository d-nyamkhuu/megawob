(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#f1f4f8', fg: '#111820', muted: '#596775', line: '#aebbc9' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('yosemite', 'open-canvas', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'Number Sequence');
      u.el('nav', 'menu', top, 'ⓘ  Help');
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, top, center, header: top });
    },
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const bottom = _c.util.el('footer', 'bottom', _c.app);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) bottom.appendChild(foot);
      _c.bottom = bottom;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.bottom.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u=ctx.util,el=u.el('div','overlay '+ctx.kind,document.body);
      const messages={cookie:'This application stores preferences on your device.',toast:'Your workspace has been synced.',chat:'Need help with this exercise?',promo:'Try the new practice collection.',banner:'An updated practice collection is available.'};
      u.el('span','',el,messages[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept':'Dismiss');
      dismiss.addEventListener('click',ctx.dismiss);return {el,dismiss};
    }
  };
  env.site({
    name: 'design-read-figure-ascending-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-ascending-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1684f8'],
      LOW_ACCENTS: ['#1684f8'],
      parts
    }
  });
})();
