(function () {
  'use strict';
  const palette = { bg: '#e8e1cf', panel: '#f5efe3', fg: '#151a0c', muted: '#685225', line: '#c4a85a' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The notebook's side note also needs the taller paper layout.
      if (_c.display === 'panel' && !_c.tall) _c.display = 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('nbk', 'nb', 'instruction-' + _c.display);
      document.body.dataset.note = _c.display;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'VISUAL SKILLS');
      u.el('em', '', top, 'EXERCISE 1 OF 5');
      const center = u.el('div', 'center', app);
      Object.assign(_c, { app, top, center, header: top });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const tabs = u.el('nav', 'tabs', document.body);
      ['Count', 'Shapes', 'Colors', 'Practice', 'Notes'].forEach((t, i) =>
        u.el('div', 'tab' + (i ? '' : ' on'), tabs, t),
      );
      const rings = u.el('div', 'rings', document.body);
      for (let i = 0; i < 9; i++) u.el('i', '', rings);
    },
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.center;
      base(_c);
      _c.header = header;
      const note = _c.center.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('brief');
        if (note.textContent.length > 48) note.classList.add('long');
        _c.util.el('small', 'guidance', note, 'Look at the items below and count those that match the task.');
      }
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('aside');
        document.body.appendChild(panel);
        panel.querySelector('.ref-panel-title').classList.add('panel-title');
        panel.querySelector('.ref-panel-text').classList.add('aside-copy');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) note.classList.add('instruction-toast');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      _c.app.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
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
    name: 'design-read-figure-count-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'nb.css'],
    design: {
      THEMES: { 'design-read-figure-count-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#4f5d2f'],
      LOW_ACCENTS: ['#4f5d2f'],
      parts,
    },
  });
})();
