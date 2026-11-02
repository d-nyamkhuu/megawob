(function () {
  'use strict';
  const palette = { bg: '#e5edf5', panel: '#edf3fa', fg: '#10264a', muted: '#66717e', line: '#b9c4d0' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      if (_c.display === 'panel' && _c.H < 700) _c.display = 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'People Manager');
      u.el('span', 'ds-welcome', top, 'Welcome, User   |   Sign out');
      const menu = u.el('nav', 'ds-menu', document.body);
      ['Contacts', 'Add', 'Search', 'Help'].forEach((t, i) => {
        if (i) u.el('i', '', menu, '|');
        u.el('span', '', menu, t);
      });
      const outer = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', outer);
      Object.assign(_c, { menu, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-title').textContent = 'Your Task';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'People Manager v1.0';
      _c.util.el('em', 'ds-flinks', foot, 'Privacy   |   Terms   |   Contact');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.querySelector('.ds-flinks'));
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      if (ctx.initial) {
        const obstacle = u.el('section', 'ds-initial ds-initial-survey', document.body);
        const tbar = u.el('div', 'ds-sv-bar', obstacle);
        u.el('b', '', tbar, 'Quick Survey');
        const xb = u.el('button', 'ds-sv-x', tbar, '✕');
        xb.type = 'button';
        xb.setAttribute('aria-label', 'Close survey');
        xb.addEventListener('click', () => close.click());
        u.el('h3', '', obstacle, 'Help us improve People Manager');
        u.el('p', '', obstacle, 'What do you think of this application?');
        const options = u.el('div', 'ds-survey-options', obstacle);
        ['Very satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very dissatisfied'].forEach((t) => {
          const l = u.el('label', '', options);
          const r = u.el('input', '', l);
          r.type = 'radio';
          r.name = 'survey';
          l.append(' ' + t);
        });
        u.el('div', 'ds-sv-label', obstacle, 'Additional comments (optional):');
        u.el('textarea', '', obstacle).setAttribute('aria-label', 'Additional comments (optional)');
        const close = u.el('button', '', obstacle, 'Close survey');
        close.type = 'button';
        obstacle.dataset.role = 'overlay';
        close.addEventListener('click', () => {
          env.log('reference-obstruction-dismiss', { kind: 'survey' });
          ctx.dismiss('close');
        });
        return { el: obstacle, dismiss: close };
      }
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
    name: 'design-fill-form-card-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'promo' },
    design: {
      THEMES: { 'design-fill-form-card-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#547aa2'],
      LOW_ACCENTS: ['#547aa2'],
      parts,
    },
  });
})();
