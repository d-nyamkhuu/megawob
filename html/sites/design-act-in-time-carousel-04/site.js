(function () {
  'use strict';
  const palette = { bg: '#f5f4f0', panel: '#f5f4f0', fg: '#090a0b', muted: '#56585a', line: '#c8c8c5' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original notes use the carousel's own card and corner notification.
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
      const top = u.el('header', 'ds-top', document.body);
      u.el('div', 'ds-brand', top, 'The Daily Chronicle');
      const nav = u.el('nav', 'ds-nav', top);
      ['NEWS', 'OPINION', 'LIFE', 'BUSINESS', 'TECH', 'SPORTS'].forEach((x) => u.el('span', '', nav, x));
      const tools = u.el('div', 'ds-headtools', top);
      u.el('span', 'ds-search', tools, '⌕');
      u.el('span', 'ds-weather-icon', tools, '☼');
      const wx = u.el('span', 'ds-weather', tools);
      u.el('b', '', wx, '72°');
      u.el('small', '', wx, 'Sunny');
      Object.assign(_c, { top, tools });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const stories = u.el('section', 'ds-stories', document.body);
      const sh = u.el('div', 'ds-stories-head', stories);
      u.el('h1', '', sh, 'Top Stories');
      const counts = u.el('div', 'ds-counts', sh);
      [['12', 'New Today'], ['34', 'Most Read'], ['8', "Editor's Picks"]].forEach(([n, t]) => {
        const c = u.el('div', 'ds-count', counts);
        u.el('b', '', c, n);
        u.el('span', '', c, t);
      });
      const grid = u.el('div', 'ds-story-grid', stories);
      const cardData = [
        ['politics', 'POLITICS', 'Senate advances climate bill in narrow vote'],
        ['health', 'HEALTH', 'New vaccine shows strong protection in early results'],
        ['nature', 'ENVIRONMENT', 'National park sees record number of visitors this summer'],
        ['tech', 'TECH', 'How remote work is reshaping small towns'],
      ];
      cardData.forEach(([kind, tag, title]) => {
        const c = u.el('article', 'ds-story', grid);
        u.el('div', 'ds-thumb ds-thumb-' + kind, c);
        u.el('div', 'ds-category', c, tag);
        u.el('h2', '', c, title);
      });
      const content = u.el('div', 'ds-content', document.body);
      Object.assign(_c, { contentPane: content, header: content });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction', 'ds-header-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tools;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.contentPane);
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.contentPane });
      const note = _c.contentPane.querySelector('.ref-panel');
      if (note) {
        note.classList.add('ds-panel-note');
        note.querySelector('.ref-panel-title').textContent = 'YOUR TASK';
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
        _c.contentPane.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('ds-footer');
      _c.footer = footer;
      const dock = _c.util.el('nav', 'ds-dock', document.body);
      [['⌂', 'Home', true], ['☰', 'Explore', false], ['♧', 'Saved', false], ['♙', 'Profile', false]].forEach(([icon, text, on]) => {
        const item = _c.util.el('div', 'ds-dock-item' + (on ? ' active' : ''), dock);
        _c.util.el('span', 'ds-dock-icon', item, icon);
        _c.util.el('span', '', item, text);
      });
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
    name: 'design-act-in-time-carousel-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#a7f52b'],
      LOW_ACCENTS: ['#a7f52b'],
      parts,
    },
  });
})();
