(function () {
  'use strict';
  const palette = { bg: '#c4dcf8', panel: '#e7f0ff', fg: '#07164c', muted: '#2a56a5', line: '#244878' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original uses the same side card at every viewport.
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
      document.body.className = 'flash dlg instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      u.el('div', 'workspace-panel', document.body);
      const outline = u.svg('svg', {class:'frame-outline',viewBox:'0 0 1000 800',preserveAspectRatio:'none'}, app);
      u.svg('polygon', {points:'1,1 985,1 999,15 999,799 18,799 1,782',fill:'none',stroke:'#284b78','stroke-width':2}, outline);
      u.svg('path', {d:'M2 782L18 798H998V16',fill:'none',stroke:'#85afd6','stroke-width':2}, outline);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'Shape Counter');
      const gl = u.el('div', 'glyph', top);
      u.el('i', '', gl); u.el('i', '', gl); u.el('i', '', gl); u.el('i', '', gl);
      const center = u.el('div', 'center', app);
      const aside = u.el('aside', 'aside note-' + _c.display, document.body);
      const noteOutline = u.svg('svg', {class:'note-outline',viewBox:'0 0 290 175',preserveAspectRatio:'none'}, aside);
      u.svg('polygon', {points:'1,1 260,1 289,30 289,174 28,174 1,147',fill:'none',stroke:'#91bf99','stroke-width':1.4}, noteOutline);
      if (_c.display !== 'panel') u.el('b', '', aside, 'Task');
      if (_c.display === 'header') u.el('p', 'aside-copy', aside, 'Explore the shapes and practice your counting skills.');
      const brand = u.el('div', 'brand', document.body);
      u.el('b', '', brand, 'Bright');
      u.el('i', '', brand, 'Path');
      u.el('div', 'brand-sub', brand, 'Learning Tools');
      Object.assign(_c, { app, top, center, aside, header: center });
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'sidenav', document.body);
      ['Activities','My Progress','Settings','Help'].forEach((t,i) => _c.util.el('div', i ? '' : 'on', nav, t));
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
      const title = _c.aside.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Task';
      const text = _c.aside.querySelector('.ref-panel-text');
      if (text) text.classList.add('aside-copy');
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('section', 'stage', _c.center); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.querySelector('.ref-note-text').classList.add('aside-copy');
        _c.aside.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const bottom = _c.util.el('footer', 'bottom', _c.app);
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      bottom.appendChild(foot);
      _c.bottom = bottom;
    },
    'frame.floating': (base) => (_c) => { base(_c); },
    overlay: () => (ctx) => {
      const u = ctx.util, el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {cookie:'This application stores preferences on your device.',toast:'Your workspace has been synced.',chat:'Need help with this exercise?',promo:'Try the new practice collection.',banner:'An updated practice collection is available.'};
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return {el,dismiss};
    },
  };
  env.site({
    name: 'design-read-figure-count-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-count-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1f4f96'],
      LOW_ACCENTS: ['#1f4f96'],
      parts,
    },
  });
})();
