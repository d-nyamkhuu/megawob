(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#000', muted: '#5d6471', line: '#d4d7dd' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Preserve the sheet's original compact-viewport note fallback.
      if ((_c.W < 1260 || _c.H < 700) && _c.display === 'toast') _c.display = 'header';
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
      document.body.classList.add('ref', 'swiss');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'title', head, 'Event Registration Form');
      const work = u.el('div', 'work', shell);
      const brief = u.el('aside', 'brief', work);
      u.el('div', 'big-no', brief, '01');
      u.el('div', 'rule', brief);
      u.el('h2', '', brief, 'Quick task');
      u.el('p', '', brief, 'Interact with the form on the right.');
      const center = u.el('section', 'center', work);
      const foot = u.el('footer', 'footer', shell);
      const act = u.el('div', 'act', foot);
      u.el('div', 'big-no', act, '02');
      const at = u.el('div', 'act-t', act);
      u.el('h3', '', at, 'Actions');
      u.el('p', '', at, 'Complete the task using the controls.');
      Object.assign(_c, { shell, work, brief, center, foot, header: center });
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
      _c.header = _c.foot;
      base(_c);
      _c.header = header;
      if (_c.placement === 'icon' && _c.submit) _c.brief.appendChild(_c.submit);
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.brief;
      base(_c);
      _c.body = body;
      const note = _c.brief.querySelector('.ref-panel');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
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
        note.dataset.display = _c.display;
        _c.center.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.foot.appendChild(foot);
      const clear = _c.util.el('button', 'clear-form', _c.foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () =>
        _c.stage.querySelectorAll('input,textarea').forEach((input) => (input.value = '')),
      );
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.brief.appendChild(dock);
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
    name: 'design-click-control-focus-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-focus-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ff2424'],
      LOW_ACCENTS: ['#ff2424'],
      parts,
    },
  });
})();
