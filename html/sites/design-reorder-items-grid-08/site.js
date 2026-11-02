(function () {
  'use strict';
  const palette = { bg: '#fbf7ee', panel: '#fbf8f0', fg: '#2a1a1a', muted: '#5a4a48', line: '#8a5a5a' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
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
      document.body.classList.add('design', 'library', 'layout-library');
      document.body.classList.toggle('has-instruction-toast', _c.display === 'toast');
      document.documentElement.style.setProperty('--font', "Georgia, 'Times New Roman', serif");
      const shell = u.el('div', 'shell', document.body);
      const brief = u.el('section', 'lib-brief', shell);
      const logo = u.el('div', 'lib-logo', brief);
      const books = u.svg('svg', {
        width: 200, height: 150, viewBox: '0 0 200 150', fill: 'none', stroke: '#5a1a1e',
        'stroke-width': 1.6, class: 'lib-books',
      }, logo);
      const defs = u.svg('defs', {}, books);
      const ink = u.svg('filter', { id: 'library-ink', 'color-interpolation-filters': 'sRGB' }, defs);
      u.svg('feColorMatrix', { type: 'matrix', values: '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -2 -2 -2 0 5.4' }, ink);
      u.svg('image', {
        href: 'sites/design-reorder-items-grid-08/assets/library-engraving.webp',
        x: -20, y: -25, width: 1672, height: 941, filter: 'url(#library-ink)',
      }, books);
      const name = u.el('div', 'lib-name', logo);
      u.el('div', 'lib-name-big', name, 'Riverton Public Library');
      u.el('div', 'lib-motto', name, 'Books Build Brighter Minds');
      u.el('hr', 'lib-rule', brief);
      u.el('h2', 'lib-h2', brief, 'Task Briefing');
      u.el('p', '', brief, 'The tiles on the right show call numbers from our catalog, but they are out of order.');
      if (_c.display !== 'hidden') u.el('div', 'lib-brief-gap', brief);
      u.el('p', '', brief, 'Use the mouse to drag and drop the tiles into the grid on the right.');
      u.el('hr', 'lib-rule thin', brief);
      const ex = u.el('div', 'lib-example', brief);
      const eh = u.el('div', 'lib-ex-h', ex);
      u.el('b', '', eh, 'Example');
      eh.append(' (for understanding order)');
      const et = u.el('div', 'lib-ex-tiles', ex);
      for (const t of ['A12', 'B07', 'C03']) u.el('span', '', et, t);
      u.el('p', 'lib-ex-note', ex, 'In the example, the tiles are in alphabetical order from left to right.');
      u.el('hr', 'lib-rule thin', brief);
      const q = u.el('div', 'lib-quote', brief);
      u.el('div', '', q, '“A library is a universe of possibilities.”');
      u.el('div', 'by', q, '— Anonymous');
      const main = u.el('div', 'lib-main', shell);
      const head = u.el('header', 'lib-head', main);
      u.el('div', 'lib-title', head, 'Riverton Public Library');
      u.el('div', 'lib-tag', head, 'Knowledge Serves a Brighter Tomorrow');
      Object.assign(_c, { shell, main, header: head });
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'lib-nav', _c.main);
      ['Catalog', 'Research Tools', 'Community', 'About'].forEach((t, i) => {
        if (i) _c.util.el('i', '', nav, '|');
        const a = _c.util.el('a', '', nav, t);
        a.onclick = () => env.log('nav', { label: t });
      });
      const panel = _c.util.el('div', 'lib-panel', _c.main);
      const bar = _c.util.el('div', 'lib-bar', panel);
      _c.util.el('span', 'lib-bar-title', bar, 'Arrange the Call Numbers');
      const note = _c.util.el('section', 'task-note', panel);
      note.hidden = _c.display !== 'header' && _c.display !== 'panel';
      Object.assign(_c, { panel, bar, header: note });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) text.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.bar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.panel; },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.header });
      const panel = _c.header.querySelector('.ref-panel');
      if (panel) {
        _c.header.classList.add('instruction-panel');
        panel.querySelector('.ref-panel-text').classList.add('instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.panel);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('task-note', 'instruction-toast');
        note.querySelector('.ref-note-text').classList.add('instruction');
        note.querySelector('.ref-note-x').classList.add('note-close');
        _c.panel.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('footer');
      _c.panel.appendChild(footer);
      footer.querySelector('.ref-foot-text').remove();
      const left = _c.util.el('div', 'lib-actions', footer);
      footer.prepend(left);
      const reset = _c.util.el('button', 'clear', left, 'Reset');
      reset.type = 'button';
      reset.onclick = () => env.widgetDef.clear?.();
      const shuf = _c.util.el('button', 'clear', left, 'Shuffle');
      shuf.type = 'button';
      shuf.onclick = () => env.log('shuffle', {});
      _c.foot = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title = {
        cookie: 'Your privacy',
        toast: 'Changes saved',
        chat: 'Support',
        promo: 'Library notice',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This site stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with the catalog?',
        promo: 'Ask a librarian about new services.',
        banner: 'You are viewing the public catalog.',
      }[kind];
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-reorder-items-grid-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-reorder-items-grid-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#6a2024'],
      LOW_ACCENTS: ['#6a2024'],
      parts,
    },
  });
})();
