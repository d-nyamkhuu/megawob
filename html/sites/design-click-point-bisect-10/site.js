(function () {
  'use strict';
  const palette = { bg: '#f4f6f9', panel: '#ffffff', fg: '#111', muted: '#555', line: '#cfd5dc' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      document.body.className = 'design gt display-' + _c.display +
        (_c.display === 'toast' ? ' has-instruction-toast' : '');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const shell = u.el('div', 'gt-shell', document.body);
      const nav = u.el('nav', 'gt-nav', shell);
      u.el('div', 'gt-brand', nav, 'GeoTasks');
      for (const t of ['Home', 'Tasks', 'Reports', 'Settings']) u.el('a', t === 'Tasks' ? 'on' : '', nav, t);
      u.el('div', 'gt-sp', nav);
      u.el('a', '', nav, 'Help');
      u.el('div', 'sep', nav);
      u.el('a', 'last', nav, 'Sign out');
      const main = u.el('div', 'gt-main', shell);
      const side = u.el('aside', 'gt-side', main);
      if (_c.display !== 'panel') {
        u.el('h4', 'side-title', side, 'Task');
        u.el('p', 'side-copy', side, 'Follow the instructions in the dialog and click in the diagram.');
      }
      const dlg = u.el('section', 'gt-dialog', main);
      const title = u.el('div', 'gt-title', dlg);
      u.el('div', 'gt-caption', title, 'Angle Bisector');
      u.el('span', 'gt-question', title, 'Question 1 of 1');
      Object.assign(_c, { shell, navBar: nav, main, side, dlg, title, header: dlg });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('gt-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.display === 'toast' ? _c.navBar : _c.title;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.main; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.side;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      const sw = _c.util.el('div', 'gt-stage', _c.dlg);
      _c.stage = _c.util.el('main', 'stage', sw);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.shell.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('gt-foot');
      _c.dlg.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      const tools = foot.querySelector('.ref-tools');
      for (const text of ['Clear', 'Reset']) {
        const b = u.el('button', 'gt-btn', null, text);
        b.type = 'button';
        b.onclick = () => { env.widgetDef.clear?.(); };
        foot.insertBefore(b, tools);
      }
      const spacer = u.el('div', 'gt-sp');
      foot.insertBefore(spacer, tools);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.shell.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title = {
        cookie: 'Your privacy',
        toast: 'Changes saved',
        chat: 'Support',
        promo: 'Workspace update',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This application stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with this workspace?',
        promo: 'Explore the latest workspace features.',
        banner: 'You are viewing a shared workspace.',
      }[kind];
      const label = kind === 'cookie' ? 'Reject optional' : 'Close';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, label);
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-click-point-bisect-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-point-bisect-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1f6fdc'],
      LOW_ACCENTS: ['#1f6fdc'],
      parts,
    },
  });
})();
