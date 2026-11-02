(function () {
  'use strict';
  const palette = { bg: '#f8f6ef', panel: '#faf8f1', fg: '#202519', muted: '#666747', line: '#c5ad75' };

  function drawPaper(u, app) {
    const paper = u.el('article', 'editorial-paper', app);
    const mast = u.el('div', 'paper-mast', paper);
    u.el('span', '', mast, 'FIELD NOTES');
    u.el('span', '', mast, 'APR 25, 2024');
    u.el('h1', '', paper, 'Notes from the Garden');
    u.el('div', 'paper-subtitle', paper, 'Observations, ideas, and small discoveries.');
    u.el('div', 'paper-rule', paper);
    u.el(
      'p', '', paper,
      'A quiet morning in the garden offers a reminder to slow down and notice the details. The changing light, the texture of new leaves, and the steady rhythm of the seasons all invite a deeper appreciation for the natural world.',
    );
    u.el(
      'p', '', paper,
      'These notes capture a few highlights from today’s walk, with a focus on the small moments that are easy to miss.',
    );
    u.el('h2', 'paper-section', paper, 'TODAY’S OBSERVATIONS');
    const list = u.el('ul', 'paper-list', paper);
    [
      'New leaves on the maple are beginning to unfurl.',
      'A pair of finches visited the birdbath.',
      'The herbs in the south bed are showing steady growth.',
      'Noticed more bees around the lavender.',
    ].forEach((t) => u.el('li', '', list, t));
    const quote = u.el('blockquote', 'paper-quote', paper);
    u.el('em', '', quote, '“Attention is a form of care.”');
    u.el('small', '', quote, '— MARY OLIVER');
    const sprig = u.svg('svg', { class: 'quote-sprig', viewBox: '0 0 90 100', 'aria-hidden': 'true' }, quote);
    u.svg('path', {
      d: 'M30 92C39 76 48 54 56 17M40 72C25 64 18 54 17 42c14 3 24 12 27 24M48 53c14-5 22-14 25-27-13 2-22 9-27 20M34 82C21 79 13 72 8 61c13 0 23 5 30 15M55 31c-1-13 3-22 11-30 5 12 3 23-5 33',
      fill: 'none', stroke: '#667057', 'stroke-width': '2',
    }, sprig);
    [
      ['M17 42Q17 55 44 66Q40 47 17 42Z'],
      ['M73 26Q58 29 48 46Q67 43 73 26Z'],
      ['M8 61Q17 78 36 79Q29 63 8 61Z'],
      ['M66 1Q56 14 61 34Q75 17 66 1Z'],
    ].forEach(([d]) => u.svg('path', { d, fill: '#a8ad98', stroke: '#667057', 'stroke-width': '1.3' }, sprig));
    const rail = u.el('div', 'tool-rail', app);
    const icons = [
      ['M7 2h9l7 7v13H7z M16 2v7h7'],
      ['M4 20l4-.8L21 6a2.1 2.1 0 0 0-3-3L5 16z M15.5 5.5l3 3'],
      ['M3 4h18v16H3z M4 17l5-5 4 4 3-3 5 5 M8 9h.1'],
      ['M12 5h.1 M12 12h.1 M12 19h.1'],
    ];
    icons.forEach((paths, i) => {
      const item = u.el('div', 'tool-icon tool-' + i, rail);
      const svg = u.svg('svg', { viewBox: '0 0 26 26', 'aria-hidden': 'true' }, item);
      paths.forEach((d) => u.svg('path', {
        d, fill: 'none', stroke: 'currentColor', 'stroke-width': i === 3 ? 3 : 1.7,
        'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      }, svg));
    });
  }

  function styleNote(el) {
    if (!el) return;
    el.classList.add('brief');
    const text = el.querySelector('.ref-panel-text, .ref-note-text') || el;
    if (text.textContent.length > 100) el.classList.add('long-note');
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original margin accommodates all note modes at every viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'plain floating instruction-' + _c.display;
      const app = u.el('main', 'app', document.body);
      u.el('header', 'top', app, 'Field Notes');
      const center = u.el('div', 'center', app);
      const header = u.el('div', 'margin-notes', center);
      const toolbar = u.el('div', 'margin-tools', app);
      drawPaper(u, app);
      const footer = u.el('footer', 'bottom', app);
      Object.assign(_c, { app, center, header, toolbar, footer });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      styleNote(_c.header.querySelector('.ref-instruction'));
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.center;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      styleNote(_c.header.querySelector('.ref-panel'));
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.header.appendChild(note);
        styleNote(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.footer.appendChild(foot);
      if (_c.placement === 'footer' && _c.submit) _c.submit.classList.add('margin-footer-end');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.app.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };

  env.site({
    name: 'design-solve-puzzle-generate-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#343d25'],
      LOW_ACCENTS: ['#343d25'],
      parts,
    },
  });
})();
