(function () {
  'use strict';
  const palette = { bg: '#cfd4d7', panel: '#d6dadd', fg: '#111', muted: '#41474b', line: '#91999d' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
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
      const u = _c.util;
      document.body.classList.add('electron', 'stagger', 'instruction-' + _c.display);
      const mb = u.el('div', 'mac-menubar', document.body);
      const apple = u.svg('svg', { viewBox: '0 0 24 30', class: 'mac-apple', 'aria-hidden': 'true' }, mb);
      const defs = u.svg('defs', {}, apple);
      const grad = u.svg('linearGradient', { id: 'apple-rainbow', x1: '0', y1: '0', x2: '0', y2: '1' }, defs);
      for (const [offset, color] of [
        ['0%', '#62b849'], ['26%', '#62b849'], ['26%', '#f9da35'], ['42%', '#f9da35'],
        ['42%', '#ed8c25'], ['56%', '#ed8c25'], ['56%', '#d34449'], ['70%', '#d34449'],
        ['70%', '#9b4b9c'], ['84%', '#9b4b9c'], ['84%', '#4295ce'], ['100%', '#4295ce'],
      ]) u.svg('stop', { offset, 'stop-color': color }, grad);
      u.svg('path', {
        d: 'M12 8C9 5 3 7 2 12C0 18 5 27 8 27C10 27 11 25 13 26C18 30 21 22 22 19C17 17 17 12 21 10C18 6 15 6 12 8Z',
        fill: 'url(#apple-rainbow)', stroke: '#333', 'stroke-width': 1.2,
      }, apple);
      u.svg('path', { d: 'M12 7C11 3 15 1 18 1C18 4 15 7 12 7Z', fill: '#54a949', stroke: '#333' }, apple);
      for (const m of ['File', 'Edit', 'View', 'Special', 'Help']) u.el('span', 'mac-mi', mb, m);
      u.el('span', 'mac-clock', mb, '10:24 AM');
      const monitor = u.svg('svg', { viewBox: '0 0 28 30', class: 'mac-monitor', 'aria-hidden': 'true' }, mb);
      u.svg('path', { d: 'M4 2h19v22H4zM1 27h26l-4-4H5z', fill: '#c4c5cc', stroke: '#333', 'stroke-width': 1.5 }, monitor);
      u.svg('rect', { x: 7, y: 5, width: 13, height: 12, fill: '#7945ba', stroke: '#222' }, monitor);
      u.svg('path', { d: 'M8 7h10M8 9v5M11 20h6', stroke: '#eee', fill: 'none' }, monitor);
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('i', 'mac-box', top);
      u.el('span', 'mac-title', top, 'Color Challenge');
      u.el('i', 'mac-box r', top);
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, center, mb, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
      const spacer = _c.header.querySelector('.ref-spacer');
      if (spacer) spacer.remove();
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.mb;
      base(_c);
      _c.header = header;
      _c.mb.insertBefore(_c.headerTools, _c.mb.querySelector('.mac-clock'));
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('brief');
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('section', 'stage', _c.body); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('brief');
        _c.body.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.app.appendChild(foot);
      const clear = _c.util.el('button', 'mac-btn clear', null, 'Clear Selections');
      clear.type = 'button';
      clear.addEventListener('click', () => _c.stage.dispatchEvent(new CustomEvent('clear-selections')));
      foot.insertBefore(clear, foot.firstChild);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-read-figure-shades-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-shades-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0056ee'],
      LOW_ACCENTS: ['#0056ee'],
      parts,
    },
  });
})();
