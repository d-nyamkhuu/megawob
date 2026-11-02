(function () {
  'use strict';
  const palette = { bg: '#25243a', panel: '#aeb0c4', fg: '#0d1024', muted: '#777b8a', line: '#b9bfd1' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This workstation reserves its own memo and status lanes at all sizes.
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'sgi workstation instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const desk = u.el('div', 'desktop', document.body);
      const sys = u.el('div', 'system-menu', desk);
      u.el('b', 'irix-brand', sys, '◢ IRIX ▸');
      ['File', 'Edit', 'View', 'Tools', 'Windows', 'Help'].forEach((x) => u.el('span', 'sys-item', sys, x));
      u.el('span', 'clock', sys, 'Mon Apr 14   10:27 AM');
      const shelf = u.el('div', 'tool-shelf', desk);
      [
        ['▰', 'Explorer'], ['›_', 'Terminal'], ['●', 'Graphics'], ['▤', 'DataMgr'],
        ['▣', 'Print'], ['⚒', 'Prefs'], ['?', 'Help'],
      ].forEach((a) => {
        const x = u.el('div', 'tool', shelf);
        u.el('b', 'tool-icon', x, a[0]);
        u.el('span', '', x, a[1]);
      });
      const app = u.el('main', 'app', desk);
      const top = u.el('header', 'top', app);
      u.el('span', '', top, 'Number Task – Console');
      u.el('nav', 'menu', top, 'File     Edit     View     Tools     Windows     Help');
      const center = u.el('div', 'center', app);
      const brief = u.el('div', 'brief', center);
      Object.assign(_c, { app, top, center, brief, header: brief });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.brief;
      base(_c);
      _c.body = body;
      const title = _c.brief.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Task memo';
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      _c.note = document.body.querySelector('.ref-note');
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('bottom');
      if (_c.placement === 'link') foot.classList.add('end-link');
      _c.app.appendChild(foot);
      const status = foot.querySelector('.ref-foot-text');
      status.classList.add('status-note');
      status.textContent = 'Ready.';
      if (_c.note) {
        status.remove();
        foot.insertBefore(_c.note, foot.firstChild);
      }
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
      // The classic generator reparents env.submitEl into its action row.
      // Reserve the template control's slot and preserve its screen position.
      if (_c.submit) {
        const button = _c.submit;
        const rect = button.getBoundingClientRect();
        const slot = _c.util.el('span', 'control-slot', button.parentElement);
        slot.style.width = rect.width + 'px';
        slot.style.height = rect.height + 'px';
        Object.assign(button.style, {
          position: 'fixed', left: rect.left + 'px', top: rect.top + 'px',
          width: rect.width + 'px', height: rect.height + 'px', zIndex: '10',
        });
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
    name: 'design-solve-puzzle-generate-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#aaa1ec'], LOW_ACCENTS: ['#aaa1ec'], parts,
    },
  });
})();
