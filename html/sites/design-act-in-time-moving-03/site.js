(function () {
  'use strict';
  const palette = { bg: '#f8f7f1', panel: '#fbfaf6', fg: '#111111', muted: '#4c4a45', line: '#282724' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The ledger has room for its dedicated note card at every viewport.
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
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'Shape Catcher');
      const meta = u.el('div', 'ds-window-meta', top);
      u.el('span', '', meta, 'Mon, Apr 27, 2026  10:14 AM');
      ['−', '□', '×'].forEach((t) => {
        const b = u.el('button', '', meta, t);
        b.type = 'button';
      });
      const card = u.el('aside', 'ds-task-card');
      if (_c.display === 'header') u.el('h2', '', card, 'Instructions');
      Object.assign(_c, { top, card, header: top });
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'ds-menu', document.body);
      ['Home', 'Games', 'Archive', 'Help'].forEach((t) => _c.util.el('span', '', nav, t));
    },
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.card;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      if (_c.display === 'header') main.appendChild(_c.card);
      Object.assign(_c, { body: main, content, main });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.main.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-task-card');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        _c.main.appendChild(note);
      }
      const card = _c.main.querySelector('.ds-task-card');
      if (card) {
        const text = card.querySelector('.ref-instruction, .ref-panel-text');
        const list = _c.util.el('ol', 'ds-steps', card);
        const first = _c.util.el('li', '', list);
        first.appendChild(text);
        ['Ignore shapes of other colors.', 'Act quickly — they keep moving.'].forEach((t) => _c.util.el('li', '', list, t));
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'Shapes are moving.';
      // Utility buttons retain the original status-bar location.
      const tools = foot.querySelector('.ref-tools');
      _c.headerTools.querySelectorAll('.ref-xtra').forEach((b) => tools.prepend(b));
      const preview = _c.util.el('aside', 'ds-preview', _c.content);
      _c.util.el('div', 'ds-preview-title', preview, 'Next Shapes (Preview)');
      const shapes = _c.util.el('div', 'ds-preview-shapes', preview);
      ['square', 'triangle', 'circle'].forEach((t) => _c.util.el('span', 'ds-preview-' + t, shapes));
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.main.appendChild(dock);
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
    name: 'design-act-in-time-moving-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-moving-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#a51f2d'],
      LOW_ACCENTS: ['#a51f2d'],
      parts,
    },
  });
})();
