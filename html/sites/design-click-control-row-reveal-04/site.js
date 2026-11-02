(function () {
  'use strict';
  const palette = { bg: '#f3f4f6', panel: '#ffffff', fg: '#202936', muted: '#596474', line: '#d8dce2' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
      document.body.dataset.display = _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'qt', 'dock');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, 'People');
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML = '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const tools = u.el('div', 'tools', head);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((label) => {
        const item = u.el('span', 'menu-label', tools);
        u.el('u', '', item, label[0]);
        u.el('span', '', item, label.slice(1));
      });
      const center = u.el('section', 'center');
      Object.assign(_c, { shell, tools, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
      const spacer = _c.header.querySelector('.ref-spacer');
      if (spacer) {
        spacer.classList.add('instruction');
        spacer.hidden = true;
        if (_c.display === 'panel') spacer.remove();
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tools;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const work = u.el('div', 'work', _c.shell);
      const rail = u.el('nav', 'people-rail', work);
      const navItems = [
        ['All People', '24', 'people', true],
        ['Favorites', '3', 'star', false],
        ['Teams', '8', 'teams', false],
        ['Labels', '6', 'tag', false],
        ['Archived', '12', 'archive', false],
      ];
      const paths = {
        people: 'M4 7a3 3 0 1 0 6 0 3 3 0 0 0-6 0Zm9 1a2 2 0 1 0 0-4m-8 7c-3 0-5 2-5 5v1h14v-1c0-3-2-5-5-5Zm9 1c2 0 4 1 4 4v1h-3',
        star: 'm10 1 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L10 15.3l-5.6 2.9 1.1-6.2L1 7.6l6.2-.9Z',
        teams: 'M4 7a3 3 0 1 0 6 0 3 3 0 0 0-6 0Zm9 1a2 2 0 1 0 0-4m-8 7c-3 0-5 2-5 5v1h14v-1c0-3-2-5-5-5Zm9 1c2 0 4 1 4 4v1h-3',
        tag: 'm2 3 8-.5 9 9-7.5 7.5-9-9Zm5 3h.1',
        archive: 'M3 3h14v4H3zm1 4v12h12V7m-8 4h4',
      };
      navItems.forEach(([label, count, icon, active]) => {
        const row = u.el('div', 'people-nav-item' + (active ? ' active' : ''), rail);
        const svg = u.el('span', 'people-nav-icon', row);
        svg.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="' + paths[icon] + '"/></svg>';
        u.el('span', 'people-nav-label', row, label);
        u.el('span', 'people-nav-count', row, count);
      });
      work.appendChild(_c.center);
      Object.assign(_c, { body: work });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('instruction');
        panel.dataset.display = 'panel';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = 'toast';
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      const tools = foot.querySelector('.ref-tools');
      const dock = u.el('div', 'dock-sections', foot);
      ['Task List', 'Status', 'Notes', 'Actions'].forEach((s) => {
        const d = u.el('section', 'dock-section', dock);
        u.el('strong', '', d, s);
        if (s === 'Notes') u.el('div', 'dock-note', d, 'Follow the instruction above.');
        if (s === 'Actions') d.appendChild(tools);
      });
      const statusbar = u.el('div', 'bottom-status', _c.shell);
      u.el('span', '', statusbar, 'Ready');
      u.el('span', '', statusbar, 'Tue Apr 23, 2002   10:24 AM');
      _c.foot = foot;
      _c.actions = tools;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-click-control-row-reveal-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-row-reveal-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0878e8'],
      LOW_ACCENTS: ['#0878e8'],
      parts,
    },
  });
})();
