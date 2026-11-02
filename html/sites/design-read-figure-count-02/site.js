(function () {
  'use strict';
  const palette = { bg: '#d4d6d8', panel: '#fff', fg: '#111', muted: '#626b74', line: '#969fa8' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original inspector accommodates its note at every viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.remove('ref-has-note');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      // Episodes reuse the body; discard the previous instruction mode.
      document.body.className = 'qt inspector instruction-' + _c.display;
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', {width:26,height:26,viewBox:'0 0 26 26',class:'title-icon'}, top);
      u.svg('rect', {x:3,y:2,width:20,height:22,rx:3,fill:'#d7e2e8',stroke:'currentColor','stroke-width':1.5}, icon);
      u.svg('path', {d:'M7 7h12M7 11h12M7 15h12M7 19h9',fill:'none',stroke:'currentColor','stroke-width':1.5}, icon);
      u.el('span', '', top, 'Shape Counter');
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', {width:20,height:20,viewBox:'0 0 20 20'}, wc);
        u.svg('path', {d:kind==='min'?'M3 12h14':kind==='max'?'M4 4h12v12H4z':'M4 4l12 12M16 4L4 16',fill:'none',stroke:'currentColor','stroke-width':1.5}, svg);
      }
      const center = u.el('div', 'center', app);
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, 'Feedback');
      u.el('p', 'aside-copy', aside, 'Not answered yet.');
      Object.assign(_c, {app, top, center, aside, header:center});
    },
    'frame.nav': () => (_c) => {
      _c.util.el('nav', 'menu', _c.top, 'File    Edit    View    Tools    Help');
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const panel = _c.aside.querySelector('.ref-panel');
      if (panel) panel.classList.add('brief', 'qt-instruction-panel');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief', 'qt-instruction-toast');
        note.setAttribute('role', 'status');
        _c.aside.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
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
      u.el('span','',el,messages[ctx.kind]);const dismiss=u.el('button','',el,ctx.kind==='cookie'?'Accept':'Dismiss');dismiss.addEventListener('click',ctx.dismiss);return {el,dismiss};
    },
  };
  env.site({
    name: 'design-read-figure-count-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-count-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2e5e9e'],
      LOW_ACCENTS: ['#2e5e9e'],
      parts,
    },
  });
})();
