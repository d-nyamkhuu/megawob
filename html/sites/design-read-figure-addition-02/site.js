(function () {
  'use strict';
  const palette = { bg: '#f2f5f7', panel: '#ffffff', fg: '#111c27', muted: '#687582', line: '#d6dfe5' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'electron stagger instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
      u.svg('rect', { x: 1, y: 1, width: 24, height: 24, rx: 4, fill: '#f65b13' }, icon);
      [[6, 6], [14, 6], [6, 14], [14, 14]].forEach(([x, y]) =>
        u.svg('rect', { x, y, width: 6, height: 6, rx: 1, fill: '#fff' }, icon));
      u.el('span', 'brand', top, 'Math Practice');
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, top, center, header: center });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const nav = u.el('nav', 'menu', _c.top);
      const tabs = u.el('div', 'tabs', nav);
      ['Home', 'Tools', 'View', 'Help'].forEach((label, i) =>
        u.el('span', 'tab' + (i === 0 ? ' active' : ''), tabs, label));
      const ribbon = u.el('div', 'ribbon', nav);
      [['Edit', ['Select', 'Erase', 'Undo']], ['Insert', ['Block', 'Clear All']],
        ['View', ['Zoom In', 'Zoom Out', 'Fit']]].forEach((group, gi) => {
        const g = u.el('div', 'tool-group', ribbon);
        const items = u.el('div', 'tool-items', g);
        group[1].forEach((label, i) => {
          const b = u.el('div', 'tool' + (gi === 0 && i === 0 ? ' chosen' : ''), items);
          u.el('span', 'tool-icon', b, ['➤', '◇', '↶', '▦', '▤', '⊕', '⊖', '⛶'][gi === 0 ? i : gi === 1 ? i + 3 : i + 5]);
          u.el('span', 'tool-label', b, label);
        });
        u.el('span', 'group-label', g, group[0]);
      });
      _c.toolbar = ribbon;
    },
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
      if (_c.submit) _c.submit.classList.add('end-' + _c.placement);
    },
    'frame.body': () => (_c) => { _c.body = _c.center; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('episode-panel');
        panel.querySelector('.ref-panel-title').textContent = 'Quick Notes';
        panel.querySelector('.ref-panel-text').classList.add('episode-copy');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) note.classList.add('episode-toast');
    },
    'frame.footer': (base) => (_c) => {
      const footer = _c.util.el('footer', 'bottom', _c.app);
      const ready = _c.util.el('div', 'ready', footer);
      _c.util.el('i', 'ready-dot', ready);
      _c.util.el('span', '', ready, 'Ready');
      if (!_c.ctx.finish) {
        const clear = _c.util.el('button', 'clear-answer', footer, 'Clear');
        clear.type = 'button';
        clear.addEventListener('click', () => {
          const field = document.querySelector('.addition-content .answer input');
          if (field) {
            field.value = '';
            field.dispatchEvent(new Event('input', { bubbles: true }));
            field.focus();
          }
        });
      }
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      if (_c.submit) _c.submit.classList.add('end-' + _c.placement);
      _c.foot = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
      if (_c.submit) _c.submit.classList.add('end-' + _c.placement);
    },
    'frame.end': (base) => (_c) => {
      const result = base(_c);
      // The addition widget moves submitEl into its scene. Move a small host
      // with it so footer and floating controls retain their frame context.
      if (_c.submit && ['footer', 'link', 'floating'].includes(_c.placement)) {
        const host = _c.util.el('div',
          'end-host end-' + _c.placement + ' ' + (_c.placement === 'floating' ? 'ref-float-dock' : 'ref-foot'),
          _c.submit.parentElement);
        host.appendChild(_c.submit);
        result.submit = host;
      }
      return result;
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        messages = {
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
    name: 'design-read-figure-addition-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-read-figure-addition-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#fa5b12'],
      LOW_ACCENTS: ['#fa5b12'],
      parts,
    },
  });
})();
