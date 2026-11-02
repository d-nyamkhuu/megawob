(function () {
  'use strict';
  const palette = { bg: '#f4ead2', panel: '#f5ead4', fg: '#2f1c0b', muted: '#79654d', line: '#bca580' };
  function styleNote(_c, note, text) {
    if (!note) return;
    note.classList.add('instruction');
    note.dataset.display = _c.display;
    const title = _c.util.el('strong', 'note-title', null, 'Task');
    note.insertBefore(title, note.firstChild);
    if (text) text.classList.add('note-text');
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Keep the original narrow-viewport fallback for the paper notes.
      _c.display = _c.ctx.display || 'header';
      if ((_c.display === 'panel' || _c.display === 'toast') && _c.W < 1150) _c.display = 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'organizer', 'compact');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, 'My Organizer');
      const toolbar = u.el('div', 'tools', head);
      u.el('span', 'menu-labels', toolbar, 'Notes        Calendar        Tasks        Settings');
      Object.assign(_c, { shell, header: head, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      styleNote(_c, _c.header.querySelector('.ref-instruction'));
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'work', _c.shell);
      const center = _c.util.el('section', 'center', body);
      Object.assign(_c, { body, center });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.center;
      base(_c);
      _c.body = body;
      const note = _c.center.querySelector('.ref-panel');
      if (note) {
        note.querySelector('.ref-panel-title').remove();
        styleNote(_c, note, note.querySelector('.ref-panel-text'));
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      u.el('span', 'notebook-tagline', _c.center, 'A calmer day, a more organized you.');
      u.el('div', 'notebook-rule', _c.center);
      u.el('div', 'notebook-binding', _c.center);
      _c.stage = u.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction-toast');
        styleNote(_c, note, note.querySelector('.ref-note-text'));
        _c.center.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      foot.querySelector('.ref-foot-text').classList.add('ready');
      foot.querySelector('.ref-foot-text').textContent = 'Ready.';
      _c.shell.appendChild(foot);
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
  env.site({
    name: 'design-click-control-hover-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-hover-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#386f9e'],
      LOW_ACCENTS: ['#386f9e'],
      parts,
    },
  });
})();
