(function () {
  'use strict';
  const palette = { bg: '#bcbdb9', panel: '#d1d0ca', fg: '#151a23', muted: '#333840', line: '#8b8b86' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated briefing pane in every display mode.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'linux-calib');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head);
      const icon = u.el('span', 'app-icon', title);
      icon.innerHTML = '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20"/><path d="M5 5h5v14H5zM13 5h6v6h-6zM13 13h6v6h-6z"/></svg>';
      u.el('span', 'app-name', title, 'CalibPro 1.4.2  -  Display Calibration Utility');
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML = '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const menu = u.el('nav', 'tools', shell);
      ['File', 'Tools', 'View', 'Help'].forEach((x) => u.el('span', 'menu-item', menu, x));
      const work = u.el('div', 'work', shell);
      const briefing = u.el('aside', 'briefing', work);
      const heading = u.el('h1', '', briefing, 'Task Briefing');
      heading.hidden = _c.display === 'hidden';
      const noteBox = u.el('div', 'brief-note', briefing);
      Object.assign(_c, { shell, work, briefing, header: noteBox });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      // Build the original action strip before the template populates it.
      const u = _c.util;
      const center = u.el('section', 'center', _c.work);
      const tabs = u.el('nav', 'tabs', center);
      ['Display', 'Color', 'Text', 'Gamma', 'Advanced'].forEach((x, i) => u.el('span', i === 0 ? 'tab active' : 'tab', tabs, x));
      const actions = u.el('div', 'actions', center);
      u.el('button', 'reset', actions, 'Reset');
      const header = _c.header;
      _c.header = actions;
      base(_c);
      _c.header = header;
      Object.assign(_c, { center, actions });
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const panel = _c.header.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction', 'instruction-panel');
        panel.dataset.display = _c.display;
      }
      _c.util.el('p', 'brief-copy', _c.briefing, 'This utility controls display text settings for the calibration profile.');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
      _c.center.insertBefore(_c.stage, _c.actions);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('ready');
      ready.textContent = 'Ready';
      const detail = _c.util.el('span', 'status-detail', foot, 'Profile: Workstation　 |　 Display: 1024×576　 |　 v1.4.2');
      foot.insertBefore(detail, foot.querySelector('.ref-tools'));
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.actions.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-handle-text-spinner-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#681d2b'],
      LOW_ACCENTS: ['#681d2b'],
      parts,
    },
  });
})();
