(function () {
  'use strict';
  const palette = { bg: '#fcf8ee', panel: '#fcf8ee', fg: '#080922', muted: '#655d78', line: '#080922' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('memphis', 'utility', 'instruction-' + _c.display);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'Color Match');
      u.el('nav', 'menu', top, 'Help      Exit');
      const actions = u.el('div', 'header-actions', top);
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, header: top, actions, center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
      const note = _c.center.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('brief', 'instruction-header');
        note.classList.toggle('long-instruction', _c.ctx.instruction.length > 30);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.actions;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) note.classList.add('brief', 'instruction-panel');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.body);
      _c.util.el('aside', 'aside', document.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief', 'instruction-toast');
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      if (_c.ctx.finish) foot.classList.add('finished');
      _c.app.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u=ctx.util,el=u.el('div','overlay '+ctx.kind,document.body);
      const messages={cookie:'This application stores preferences on your device.',toast:'Your workspace has been synced.',chat:'Need help with this exercise?',promo:'Try the new practice collection.',banner:'An updated practice collection is available.'};
      u.el('span','',el,messages[ctx.kind]);
      const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept':'Dismiss');
      dismiss.addEventListener('click',ctx.dismiss);
      return {el,dismiss};
    },
  };
  env.site({
    name: 'design-read-figure-color-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-color-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#9e80ff'],
      LOW_ACCENTS: ['#9e80ff'],
      parts,
    },
  });
})();
