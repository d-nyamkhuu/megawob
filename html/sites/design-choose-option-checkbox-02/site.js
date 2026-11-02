(function () {
  'use strict';
  const palette = { bg: '#fdfcfa', panel: '#fdfcfa', fg: '#161616', muted: '#6b6b6b', line: '#cfccc6' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const mast = u.el('div', 'ds-mast', top);
      u.el('div', 'ds-brand', mast, 'The Daily Chronicle');
      const tag = u.el('div', 'ds-tag', mast);
      u.el('i', '', tag);
      u.el('span', '', tag, 'News for a brighter tomorrow');
      u.el('i', '', tag);
      const tr = u.el('div', 'ds-topright', top);
      u.el('div', 'ds-date', tr, 'Monday, March 14, 2011');
      const toolbar = u.el('div', 'ds-links', tr);
      ['Home', 'Help', 'Contact'].forEach((t, i) => {
        if (i) u.el('b', '', toolbar, '|');
        u.el('span', '', toolbar, t);
      });
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      const side = u.el('aside', 'ds-side', main);
      u.el('h2', '', side, 'Topic Preferences');
      u.el('p', '', side, 'Tell us which topics you’re interested in so we can personalize your news experience. Select any topics you want to follow. You can change these at any time.');
      u.el('hr', '', side);
      u.el('h3', '', side, 'Your Selections');
      u.el('p', 'ds-none', side, 'No topics selected yet.');
      const work = u.el('div', 'ds-work', main);
      u.el('div', 'ds-step', work, 'Step 1 of 1');
      u.el('h1', '', work, 'Choose Your Topics');
      Object.assign(_c, { header: toolbar, toolbar, siteBody: body, contentPane: content, main, work });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.work;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.siteBody;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.work;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.util.el('div', 'ds-lead', _c.work, 'Select the topics you’re interested in:');
      _c.stage = _c.util.el('main', 'ds-stage', _c.work);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.contentPane.insertBefore(note, _c.main);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.contentPane.appendChild(foot);
      const ready = foot.querySelector('.ref-foot-text');
      ready.className = 'ds-ready';
      ready.textContent = '';
      _c.util.el('b', '', ready, 'Ready to continue?');
      _c.util.el('em', '', ready, 'You can change your selections at any time.');
      if (!_c.ctx.finish) {
        const clr = _c.util.el('button', 'ds-clear', foot, 'Clear All');
        clr.type = 'button';
        clr.addEventListener('click', () => {
          _c.stage.querySelectorAll('input:checked').forEach((i) => i.click());
        });
      }
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.querySelector('.ds-clear'));
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
    name: 'design-choose-option-checkbox-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-choose-option-checkbox-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#b3140f'],
      LOW_ACCENTS: ['#b3140f'],
      parts,
    },
  });
})();
