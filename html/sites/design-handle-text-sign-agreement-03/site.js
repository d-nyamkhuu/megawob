(function () {
  'use strict';
  const palette = { bg: '#f4f5f7', panel: '#ffffff', fg: '#17213a', muted: '#667085', line: '#d9dee8' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated briefing pane in every display mode.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'ref clearlooks split';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, 'Acme Workspace');
      const glyph = u.el('span', 'title-document', title);
      glyph.innerHTML =
        '<svg viewBox="0 0 20 24"><path d="M2 1h11l5 5v16H2Z" fill="#f4f4ef" stroke="#59636c"/><path d="M13 1v6h5M5 9h9M5 12h8M5 15h9M5 18h6" fill="none" stroke="#849097"/><path d="M6 6h3v4H6Z" fill="#a9bac7" stroke="#5e6d77"/></svg>';
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const work = u.el('div', 'work', shell);
      const briefing = u.el('aside', 'briefing', work);
      const label = u.el('div', 'brief-label', briefing, 'TASK');
      label.hidden = _c.display === 'hidden';
      const noteHost = u.el('div', 'brief-note', briefing);
      u.el('div', 'brief-rule', briefing);
      u.el('div', 'brief-heading', briefing, 'Additional information');
      u.el('p', 'brief-copy', briefing,
        'Review the agreement on the right. You can scroll using your mouse wheel or the scrollbar.');
      const center = u.el('section', 'center', work);
      const appbar = u.el('div', 'workspace-bar', center);
      const appIcon = u.el('span', 'app-icon', appbar);
      appIcon.innerHTML =
        '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" stroke-width="1.6"/></svg>';
      u.el('strong', '', appbar, 'Document Center');
      u.el('span', 'bar-spacer', appbar);
      const help = u.el('span', 'help-item', appbar);
      help.innerHTML = '<b>?</b> Help';
      u.el('span', 'avatar', appbar, 'LC');
      Object.assign(_c, { shell, work, briefing, center, appbar, help, header: noteHost });
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
      const header = _c.header;
      _c.header = _c.appbar;
      base(_c);
      _c.header = header;
      _c.appbar.insertBefore(_c.headerTools, _c.help);
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const note = _c.header.querySelector('.ref-panel-text');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('div', 'stage', _c.center);
      const titleCard = u.el('div', 'agreement-heading', _c.stage);
      u.el('h1', '', titleCard, 'Software License Agreement');
      u.el('p', '', titleCard, 'Last updated: March 1, 2024');
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.header.appendChild(note);
        const text = note.querySelector('.ref-note-text');
        text.classList.add('instruction', 'instruction-toast');
        text.dataset.display = _c.display;
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.center.appendChild(foot);
      // Extra actions belong to the workspace toolbar, leaving the agreement's
      // reserved completion slot clear of the widget's Agree / Cancel actions.
      for (const extra of foot.querySelectorAll('.ref-xtra')) _c.headerTools.appendChild(extra);
      foot.classList.toggle('has-end', !!foot.querySelector('[data-role="submit"]'));
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.foot.appendChild(dock);
        _c.foot.classList.add('has-end');
      }
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
    name: 'design-handle-text-sign-agreement-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-handle-text-sign-agreement-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1682e8'],
      LOW_ACCENTS: ['#1682e8'],
      parts,
    },
  });
})();
