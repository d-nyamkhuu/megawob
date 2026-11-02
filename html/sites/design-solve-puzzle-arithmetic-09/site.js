(function () {
  'use strict';
  const palette = { bg: '#f7f4ed', panel: '#ffffff', fg: '#111111', muted: '#756331', line: '#9b8550' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'homepage notebook instruction-' + _c.display + (_c.ctx.finish ? ' episode-finish' : '');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
      document.body.classList.add('end-placement-' + _c.placement);
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'Math Practice');
      const center = u.el('div', 'center', app);
      const toolbar = u.el('div', 'chrome-toolbar', app);
      Object.assign(_c, { app, center, toolbar, header: center });
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
    'frame.body': () => (_c) => {
      const u = _c.util;
      const aside = u.el('aside', 'aside', document.body);
      u.el('b', '', aside, 'A quick calculation');
      u.el('p', 'aside-copy', aside, 'Use the order of operations to solve the problem.\nType your answer in the box.');
      const branch = u.svg('svg', { class: 'leaf-art', viewBox: '0 0 150 110', fill: 'none', 'aria-hidden': 'true' }, aside);
      const ink = { stroke: '#9b884e', 'stroke-width': 1.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' };
      u.svg('path', { ...ink, d: 'M8 103C27 79 40 58 57 38S89 14 125 7M30 77C23 60 24 45 36 23C43 45 41 60 30 77ZM39 66C55 55 68 40 75 20C56 31 45 45 39 66ZM51 47C46 30 50 16 63 4C66 23 62 37 51 47ZM44 61C62 59 79 64 96 77C76 79 59 74 44 61ZM68 31C85 21 101 19 121 24C105 37 87 39 68 31ZM31 77C49 75 66 81 79 95C60 96 44 90 31 77Z' }, branch);
      [[30, 77, 38, 23], [39, 66, 75, 20], [51, 47, 63, 4], [44, 61, 96, 77], [68, 31, 121, 24], [31, 77, 79, 95]].forEach(([x1, y1, x2, y2]) =>
        u.svg('path', { ...ink, d: `M${x1} ${y1}Q${(x1 + x2) / 2} ${(y1 + y2) / 2 - 4} ${x2} ${y2}` }, branch));
      Object.assign(_c, { aside, body: _c.center });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.center.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'bottom', _c.app);
      const tools = u.el('div', 'reference-tools', _c.app);
      const clear = u.el('button', 'tool-button', tools, '✎　Clear answer');
      const calc = u.el('button', 'tool-button', tools, '▦　Show calculator');
      const panel = u.el('div', 'calculator-panel', _c.app);
      clear.type = calc.type = 'button';
      clear.addEventListener('click', () => {
        const field = document.querySelector('.answer input');
        if (field) {
          field.value = '';
          field.dispatchEvent(new Event('input', { bubbles: true }));
          field.focus();
        }
      });
      panel.hidden = true;
      calc.addEventListener('click', () => {
        panel.hidden = !panel.hidden;
        calc.textContent = panel.hidden ? '▦　Show calculator' : '▦　Hide calculator';
      });
      for (const key of ['7', '8', '9', '4', '5', '6', '1', '2', '3', '0', '⌫', 'C']) {
        const keyButton = u.el('button', 'calc-key', panel, key);
        keyButton.type = 'button';
        keyButton.addEventListener('click', () => {
          const field = document.querySelector('.answer input');
          if (!field) return;
          field.value = key === 'C' ? '' : key === '⌫' ? field.value.slice(0, -1) : field.value + key;
          field.dispatchEvent(new Event('input', { bubbles: true }));
        });
      }
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      footer.appendChild(foot);
      const rack = u.el('div', 'chrome-actions', footer);
      for (const button of _c.app.querySelectorAll('.ref-xtra')) rack.appendChild(button);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
      const homes = {
        header: { left: '77.6%', top: '4%', bottom: 'auto', width: '18%', height: '6%' },
        icon: { left: 'auto', right: '2.4%', top: '4%', bottom: 'auto', width: '6%', height: '6%' },
        link: { left: '32%', top: '4%', bottom: 'auto', width: '20%', height: '6%' },
        floating: { position: 'static', width: '100%', height: '100%' },
      };
      if (_c.submit) {
        for (const [key, value] of Object.entries(homes[_c.placement] || {})) {
          _c.submit.style.setProperty(key, value, 'important');
        }
      }
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
    name: 'design-solve-puzzle-arithmetic-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#756331'], LOW_ACCENTS: ['#756331'], parts },
  });
})();
