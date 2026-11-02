(function () {
  'use strict';
  const palette = { bg: '#b9e5ff', panel: '#e8f7ff', fg: '#244d76', muted: '#3e6386', line: '#89c8ed' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection(); if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('span', 'ds-logo', top); logo.setAttribute('aria-hidden', 'true');
      const identity = u.el('div', 'ds-identity', top);
      u.el('strong', 'ds-brand', identity, 'TaskFlow');
      u.el('span', 'ds-tagline', identity, 'Simple tools for everyday tasks');
      const account = u.el('div', 'ds-account', top);
      u.el('span', '', account, 'Welcome, Alex');
      const links = u.el('div', 'ds-account-links', account);
      u.el('span', '', links, 'Help'); u.el('i', '', links, '|'); u.el('span', '', links, 'Sign out');
      const content = u.el('div', 'ds-content', document.body);
      const stage = u.el('main', 'ds-stage tools-open', content);
      stage.dataset.display = _c.display;
      const skyline = u.el('div', 'ds-skyline', content);
      for (let i = 0; i < 11; i++) u.el('span', 'ds-building', skyline);
      const leaves = u.el('div', 'ds-leaves', content);
      for (let i = 0; i < 5; i++) u.el('i', '', leaves);
      const heading = u.el('section', 'ds-heading', content);
      const title = u.el('h1', '', heading, _c.display === 'panel' ? 'Task instructions' : 'Prepare to continue');
      title.hidden = _c.display === 'hidden';
      if (_c.display === 'hidden') heading.classList.add('ds-no-instruction');
      if (_c.display === 'toast') heading.classList.add('ds-toast-note');
      if (_c.display === 'panel') heading.classList.add('ds-panel-note');
      Object.assign(_c, { top, contentBox: content, taskStage: stage, heading, header: heading });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.heading.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.contentBox; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.heading;
      base(_c);
      _c.body = body;
      const note = _c.heading.querySelector('.ref-panel-text');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.taskStage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.heading.appendChild(note);
      }
      const u = _c.util;
      u.el('div', 'ds-waiting', _c.heading, 'Waiting for the task clock');
      if (_c.display === 'header') {
        u.el('p', 'ds-explainer', _c.heading, 'The next step will be available on the task clock.');
      }
      const slogan = u.el('aside', 'ds-slogan', _c.contentBox);
      ['Small', 'Steps', 'Bright', 'Results'].forEach(t => u.el('span', '', slogan, t));
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.contentBox.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      if (_c.ctx.finish) foot.classList.add('ds-finish-footer');
      const u = _c.util;
      const clock = u.el('div', 'ds-footer-clock');
      foot.prepend(clock);
      u.el('span', 'ds-clock-icon', clock, '◷');
      const clockcopy = u.el('div', '', clock);
      u.el('small', '', clockcopy, 'Task clock');
      u.el('strong', '', clockcopy, '00:00');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      if (ctx.initial) {
        const stage = document.querySelector('.ds-stage');
        const clockLabel = document.querySelector('.ds-footer-clock small');
        const waiting = document.querySelector('.ds-waiting');
        stage.classList.remove('tools-open');
        clockLabel.textContent = 'Task clock (paused)';
        const el = u.el('section', 'ds-fold ds-initial-fold', document.querySelector('.ds-content'));
        el.dataset.role = 'overlay';
        const toolIcon = u.el('span', 'ds-tool-icon', el); toolIcon.setAttribute('aria-hidden', 'true');
        const foldCopy = u.el('div', 'ds-fold-copy', el);
        u.el('strong', '', foldCopy, 'Tools are hidden');
        u.el('span', '', foldCopy, 'Expand tools to show the task controls.');
        const dismiss = u.el('button', 'ds-expand', el);
        dismiss.type = 'button'; dismiss.dataset.role = 'expand-tools';
        u.el('span', 'ds-expand-mark', dismiss, '⌄'); u.el('b', '', dismiss, 'Expand tools');
        dismiss.addEventListener('click', () => {
          waiting.hidden = true; clockLabel.textContent = 'Task clock';
          stage.classList.add('tools-open'); ctx.dismiss('close');
        });
        return { el, dismiss };
      }
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body); el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.' };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-delay-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'banner' },
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#0754a5'], LOW_ACCENTS: ['#0754a5'], parts },
  });
})();
