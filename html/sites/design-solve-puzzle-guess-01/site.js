// Number Guess's dark frame; shared controls and episode UI come from site/base.
(function () {
  'use strict';

  const theme = { bg: '#1c1327', panel: '#261b32', fg: '#efeaf6', muted: '#bdb2ce', line: '#463754' };

  function titleIcon(u, top) {
    const icon = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26', class: 'title-icon' }, top);
    u.svg('rect', { x: 3, y: 2, width: 20, height: 22, rx: 3, fill: '#8266ce',
      stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
    u.svg('path', { d: 'M7 7h12M7 11h12M7 15h12M7 19h9', fill: 'none',
      stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
  }

  function windowControls(u, top) {
    const controls = u.el('div', 'native-window-controls', top);
    for (const d of ['M3 12h14', 'M4 4h12v12H4z', 'M4 4l12 12M16 4L4 16']) {
      const icon = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, controls);
      u.svg('path', { d, fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, icon);
    }
  }

  env.site({
    name: 'design-solve-puzzle-guess-01',
    template: 'site/base',
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { dark: theme },
      LOW_THEME: theme,
      ACCENTS: ['#ff796e'],
      LOW_ACCENTS: ['#ff796e'],
      LANGS: ['en'],
      parts: {
        'frame.layout': (base) => function (_c) {
          base(_c);
          _c.display = _c.ctx.display;
          document.body.className = 'dark horizontal instruction-' + _c.display +
            (_c.ctx.finish ? ' finish-mode' : '');
        },
        'frame.placement': (base) => function (_c) {
          base(_c);
          // The reset control belongs in the bottom bar in every episode.
          _c.wantFooter = true;
          document.body.classList.add('end-' + (_c.placement || 'footer'));
        },
        'frame.header': () => function (_c) {
          const { util: u } = _c;
          const app = u.el('main', 'app', document.body);
          const header = u.el('header', 'top', app);
          titleIcon(u, header);
          u.el('span', '', header, 'Number Guess');
          windowControls(u, header);
          u.el('nav', 'menu', header, 'A simple game of logic');
          const body = u.el('div', 'center ref-body', app);
          Object.assign(_c, { app, header, body });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => function (_c) {
          base(_c);
          const brief = _c.header.querySelector('.ref-instruction, .ref-spacer');
          brief.className = 'brief';
          _c.body.appendChild(brief);
        },
        'frame.body': () => () => {},
        'frame.panel': (base) => function (_c) {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) {
            panel.classList.add('aside');
            panel.querySelector('.ref-panel-text').classList.add('instruction-card');
            document.body.appendChild(panel);
          }
        },
        'frame.stage': () => function (_c) {
          _c.stage = _c.util.el('section', 'stage', _c.body);
        },
        'frame.toast': (base) => function (_c) {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            _c.body.querySelector('.brief').replaceWith(note);
            note.classList.add('brief');
          }
        },
        'frame.footer': (base) => function (_c) {
          base(_c);
          const footer = document.querySelector('.ref-foot');
          footer.classList.add('bottom');
          footer.querySelector('.ref-foot-text').remove();
          _c.app.appendChild(footer);
          _c.footer = footer;
        },
        'frame.floating': (base) => function (_c) {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) _c.footer.appendChild(dock);
        },
        'frame.end': (base) => function (_c) {
          const result = base(_c);
          // Keep the existing stylesheet's hooks on the template's controls.
          if (result.submit) {
            result.submit.classList.add('submit');
            if (_c.header.contains(result.submit)) result.submit.classList.add('top-submit');
            if (_c.placement === 'link') result.submit.classList.add('submit-link');
          }
          for (const decoy of document.querySelectorAll('.ref-xtra')) decoy.classList.add('end-xtra');
          return result;
        },
      },
    },
  });
})();
