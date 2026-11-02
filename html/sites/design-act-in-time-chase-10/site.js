(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#132d4d', muted: '#536b87', line: '#cbd8e6' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The briefing pane has room for all four displays at every viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const shell = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', shell);
      const main = u.el('div', 'ds-main', content);
      const brief = u.el('aside', 'ds-brief', main);
      const hero = u.el('section', 'ds-brief-hero', brief);
      u.el('div', 'ds-eyebrow', hero, 'Attention Check');
      const how = u.el('section', 'ds-how', brief);
      u.el('h2', '', how, 'How it works');
      const steps = u.el('ol', '', how);
      [
        'The activity workspace is in the area on the right.',
        'Live counters show the activity as it takes place.',
        'Use Reset to start the workspace again when needed.',
      ].forEach((t) => u.el('li', '', steps, t));
      const progress = u.el('section', 'ds-progress', brief);
      u.el('h2', '', progress, 'Progress');
      u.el('p', '', progress, 'The counters above the workspace show the current session progress.');
      shell.dataset.display = _c.display;
      progress.classList.toggle('ds-progress-panel', _c.display === 'panel');
      Object.assign(_c, { shell, content, main, brief, progress, header: hero });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      base(_c);
      if (_c.headerTools.children.length) _c.header.classList.add('ds-has-tools');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.main;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.progress;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      const foot = _c.util.el('footer', 'ds-footer', _c.content);
      const reset = _c.util.el('button', 'ds-reset', foot, 'Reset');
      reset.type = 'button';
      reset.addEventListener('click', () => window.location.reload());
      base(_c);
      const templateFoot = document.body.querySelector('.ref-foot');
      if (templateFoot) foot.appendChild(templateFoot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-chase-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-chase-10': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1769d2'],
      LOW_ACCENTS: ['#1769d2'],
      parts,
    },
  });
})();
