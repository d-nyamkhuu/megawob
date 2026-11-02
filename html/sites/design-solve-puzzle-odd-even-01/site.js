(function () {
  'use strict';
  const site = 'design-solve-puzzle-odd-even-01';
  const palette = { bg: '#f6efdf', panel: '#f6efdf', fg: '#175564', muted: '#3b7479', line: '#317981' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      if (_c.display === 'panel' && (_c.W < 1320 || _c.H < 760)) _c.display = 'header';
      document.body.classList.add('riso', 'horizontal', 'instruction-' + _c.display);
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'Number Sort');
      u.el('nav', 'menu', top, 'HOME    PRACTICE    HELP');
      const mountain = u.el('img', 'mountain-art', top);
      mountain.src = 'sites/' + site + '/assets/mountain-sun.webp';
      mountain.alt = '';
      const center = u.el('div', 'center', app);
      const bottom = u.el('footer', 'bottom', app);
      const art = u.el('div', 'footer-art', bottom);
      const trees = u.el('img', '', art);
      trees.src = 'sites/' + site + '/assets/footer-trees.webp';
      trees.alt = '';
      u.el('div', 'footer-tagline', bottom, 'A BRIGHTER\nTOMORROW\nADDS UP');
      const toolbar = u.el('div', 'bottom-toolbar', bottom);
      Object.assign(_c, { app, center, bottom, toolbar, header: center });
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
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) _c.app.appendChild(panel);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.center.insertBefore(note, _c.stage);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.toolbar.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.toolbar.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u=ctx.util,el=u.el('div','overlay '+ctx.kind,document.body);
      const messages={cookie:'This application stores preferences on your device.',toast:'Your workspace has been synced.',chat:'Need help with this exercise?',promo:'Try the new practice collection.',banner:'An updated practice collection is available.'};
      u.el('span','',el,messages[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept':'Dismiss');dismiss.addEventListener('click',ctx.dismiss);return {el,dismiss};
    },
  };
  env.site({
    name: site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-solve-puzzle-odd-even-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#601226'],
      LOW_ACCENTS: ['#601226'],
      parts,
    },
  });
})();
