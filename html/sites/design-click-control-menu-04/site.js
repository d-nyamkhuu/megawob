(function () {
  'use strict';
  const cfg = {
    title: 'Team Directory',
    sub: 'Browse by name to view team members.',
    side: 'Task',
    hint: ['Open the menu and navigate through the requested names.', 'Click the final name to select it.'],
    search: 'Search people...',
  };
  const ICON_TASK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="#2f9c85" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2.5"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>';
  const ICON_SEARCH =
    '<svg viewBox="0 0 24 24" fill="none" stroke="#7b868c" stroke-width="1.7" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>';
  const ICON_HELP =
    '<svg viewBox="0 0 24 24" fill="none" stroke="#555f66" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="9.5"/><path d="M9.3 9.4a2.8 2.8 0 1 1 4 2.5c-.9.5-1.3 1-1.3 2M12 17.3v.1"/></svg>';
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated note pane even at the smallest viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'mint', 'minimal');
      const shell = u.el('main', 'shell', document.body);
      const work = u.el('div', 'work', shell);
      const left = u.el('section', 'side', work);
      left.hidden = _c.display === 'hidden';
      const sh = u.el('div', 'side-head', left);
      u.el('span', 'side-icon', sh).innerHTML = ICON_TASK;
      u.el('span', 'side-label', sh, cfg.side);
      const header = u.el('div', 'task-note', left);
      Object.assign(_c, { shell, work, left, header });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const center = u.el('section', 'center', _c.work);
      const top = u.el('div', 'top', center);
      const tt = u.el('div', 'top-title', top);
      u.el('h1', '', tt, cfg.title);
      u.el('p', '', tt, cfg.sub);
      const sr = u.el('button', 'search', top);
      sr.type = 'button';
      sr.setAttribute('aria-label', cfg.search);
      sr.addEventListener('click', () => env.log('decoy', { label: cfg.search }));
      u.el('span', 'search-icon', sr).innerHTML = ICON_SEARCH;
      u.el('span', 'search-text', sr, cfg.search);
      Object.assign(_c, { center, top });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const note = _c.header.querySelector('.ref-panel-text');
      if (note) {
        note.classList.add('instruction', 'instruction-panel');
        note.dataset.display = _c.display;
      }
      if (_c.display !== 'hidden') cfg.hint.forEach((t) => _c.util.el('p', 'side-hint', _c.left, t));
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction-toast');
        const text = note.querySelector('.ref-note-text');
        text.dataset.display = _c.display;
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      const help = _c.util.el('div', 'help');
      _c.util.el('span', 'help-icon', help).innerHTML = ICON_HELP;
      _c.util.el('span', '', help, 'Help');
      foot.prepend(help);
      _c.foot = foot;
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
  const palette = { bg: '#f3f6f7', panel: '#fff', fg: '#142333', muted: '#718091', line: '#dce3e7' };
  env.site({
    name: 'design-click-control-menu-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-menu-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#6cdcc1'],
      LOW_ACCENTS: ['#6cdcc1'],
      parts,
    },
  });
})();
