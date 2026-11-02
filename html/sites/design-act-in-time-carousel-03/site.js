(function () {
  'use strict';
  const palette = { bg: '#fcf8ef', panel: '#eee9fc', fg: '#001332', muted: '#4f568d', line: '#cdc0f0' };
  function drawHelp(u, b) {
    const help = u.el('div', 'ds-help', b);
    const demo = u.el('div', 'ds-demo', help);
    u.el('div', 'ds-demo-dots', demo, '●　●　●　●　●');
    u.el('p', '', help, 'Dots show how many slides are in the carousel.');
    [
      ['‹　　›', 'Use the left and right arrows to go to the previous or next slide.'],
      ['Ⅱ　　▶', 'The carousel rotates automatically. Click pause to stop, or play to resume.'],
    ].forEach((x) => {
      const row = u.el('div', 'ds-help-row', help);
      u.el('b', '', row, x[0]);
      u.el('span', '', row, x[1]);
    });
    const legend = u.el('section', 'ds-legend', b);
    u.el('h2', '', legend, 'Controls Legend');
    [
      ['‹', 'Previous slide'], ['›', 'Next slide'],
      ['●　●　●　●', 'Slide indicators'], ['Ⅱ', 'Pause / Play (auto-rotate)'],
    ].forEach((x) => {
      const row = u.el('div', 'ds-legend-row', legend);
      u.el('b', '', row, x[0]);
      u.el('span', '', row, x[1]);
    });
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated help pane even at the smallest viewport.
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
      u.el('span', 'ds-brand', top, 'ShopWell');
      const nav = u.el('nav', 'ds-menu', top);
      'Groceries|Household⌄|Personal Care⌄|Health⌄|Baby⌄|Pets⌄|More⌄'.split('|').forEach((t) => u.el('span', '', nav, t));
      const search = u.el('div', 'ds-search', top);
      u.el('b', '', search, '⌕');
      u.el('span', '', search, 'Search products...');
      u.el('div', 'ds-cart', top, '🛒');
      u.el('i', '', top, '3');
      const meta = u.el('div', 'ds-window-meta', top);
      if (!_c.ctx.finish) ['−', '□', '×'].forEach((t) => {
        const b = u.el('button', '', meta, t);
        b.type = 'button';
      });
      const brief = u.el('aside', 'ds-brief' + (_c.display === 'hidden' ? ' ds-brief-hidden' : ''));
      u.el('h2', '', brief, 'Carousel Help');
      const shelf = u.el('div', 'ds-footer');
      Object.assign(_c, { top, brief, shelf, header: brief });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.shelf;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      main.appendChild(_c.brief);
      content.appendChild(_c.shelf);
      Object.assign(_c, { body, content, main });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.brief;
      base(_c);
      _c.body = body;
      const note = _c.brief.querySelector('.ref-panel-text');
      if (note) note.classList.add('ds-instruction');
      drawHelp(_c.util, _c.brief);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-instruction', 'ds-instruction-toast');
        _c.brief.insertBefore(note, _c.brief.querySelector('.ds-help'));
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.shelf.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.shelf.appendChild(dock);
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
    name: 'design-act-in-time-carousel-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-carousel-03': palette }, LOW_THEME: palette,
      ACCENTS: ['#ff7863'], LOW_ACCENTS: ['#ff7863'], parts,
    },
  });
})();
