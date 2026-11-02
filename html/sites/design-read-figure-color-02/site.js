(function () {
  'use strict';
  const palette = { bg: '#292f35', panel: '#22282e', fg: '#e7e8e9', muted: '#b9bec8', line: '#646a70' };
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
      document.body.className = 'carbon brief-left instruction-' + _c.display;
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 22, height: 22, viewBox: '0 0 22 22' }, top);
      u.svg('rect', { x: 1, y: 1, width: 20, height: 20, rx: 3, fill: '#6e9dc7' }, icon);
      u.svg('path', { d: 'M5 5h12v12H5zM5 9h12M9 5v12', fill: 'none', stroke: '#e8f4ff', 'stroke-width': 1 }, icon);
      u.el('span', '', top, 'Color Match');
      u.el('span', 'window-controls', top, '−   □   ×');
      u.el('nav', 'menu', top, 'File    Edit    View    Tools    Help');
      const brief = u.el('div', 'brief');
      Object.assign(_c, { app, top, header: brief, brief });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const center = _c.util.el('div', 'center', _c.app);
      center.appendChild(_c.brief);
      const aside = _c.util.el('aside', 'aside', document.body);
      _c.util.el('b', '', aside, 'Color Match');
      _c.util.el('p', 'aside-copy', aside, '');
      Object.assign(_c, { body: center });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.brief;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) note.setAttribute('role', 'status');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('bottom');
      _c.app.appendChild(footer);
      footer.querySelector('.ref-foot-text').remove();
      const u = _c.util;
      const help = u.el('span', 'footer-help', null, 'Help');
      const hs = u.svg('svg', { width: 32, height: 32, viewBox: '0 0 32 32', style: 'vertical-align:middle;margin-right:12px' }, help);
      u.svg('circle', { cx: 16, cy: 16, r: 14, fill: '#aeb7c0', stroke: '#111', 'stroke-width': 2 }, hs);
      const ht = u.svg('text', { x: 16, y: 23, 'text-anchor': 'middle', fill: '#17222c', 'font-size': 24, 'font-weight': 700 }, hs);
      ht.textContent = '?';
      help.prepend(hs);
      footer.prepend(help);
      const clear = u.el('button', 'control clear', null, 'Clear');
      clear.dataset.clear = 'true';
      clear.type = 'button';
      footer.insertBefore(clear, footer.querySelector('.ref-tools'));
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
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
    name: 'design-read-figure-color-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-color-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#176bc5'],
      LOW_ACCENTS: ['#176bc5'],
      parts,
    },
  });
})();
