(function () {
  'use strict';
  const palette = { bg: '#fcfaf4', panel: '#fff5f3', fg: '#56131f', muted: '#554943', line: '#762b35' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The catalog has its own responsive note locations.
      _c.display = _c.ctx.display || 'header';
      if ((_c.display === 'panel' || _c.display === 'toast') && _c.W < 1150) _c.display = 'header';
      document.body.className = 'library instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const app = u.el('main', 'app', document.body);
      const top = u.el('header', 'top', app);
      const brand = u.el('div', 'brand', top);
      const logo = u.svg('svg', { width: 118, height: 82, viewBox: '0 0 118 82', class: 'book-logo' }, brand);
      u.svg('path', {
        d: 'M8 15Q30 5 57 17V72Q32 59 8 68ZM57 17Q83 5 109 15V68Q82 59 57 72Z',
        fill: '#f6efe2', stroke: 'currentColor', 'stroke-width': 2,
      }, logo);
      for (let y = 22; y < 64; y += 6) {
        u.svg('path', { d: `M14 ${y}q19 -8 37 0M63 ${y}q19 -8 40 0`, fill: 'none', stroke: 'currentColor', 'stroke-width': 0.8 }, logo);
      }
      const identity = u.el('div', 'identity', brand);
      u.el('div', 'library-name', identity, 'Rivermere Public Library');
      u.el('div', 'tagline', identity, 'Books　·　People　·　Ideas　·　Since 1892');
      const mast = u.el('div', 'mast-right', top);
      u.el('nav', 'mast-links', mast, 'Catalog　 |　 Hours　 |　 My Account　 |　 Help');
      u.el('div', 'motto', mast, 'A More Informed Tomorrow');
      const grid = u.el('div', 'body-grid', app);
      const nav = u.el('nav', 'side-nav', grid);
      for (const [i, text] of ['Search Catalog', 'Advanced Search', 'Browse by Subject', 'New Arrivals', 'Collections', 'Research Guides', 'Library Information'].entries()) {
        const item = u.el('div', 'nav-item' + (i === 0 ? ' active' : ''), nav, text);
        item.setAttribute('aria-hidden', 'true');
      }
      const work = u.el('section', 'work', grid);
      const intro = u.el('div', 'intro', work);
      u.el('h1', '', intro, 'Library Catalog');
      u.el('p', '', intro, 'Find books, journals, media and more.');
      Object.assign(_c, { app, work, intro, catalogNav: nav, header: work });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.work.querySelector('.ref-instruction');
      if (note) note.classList.add('brief');
      const spacer = _c.work.querySelector('.ref-spacer');
      if (spacer) spacer.remove();
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.intro;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('catalog-tools');
      if (_c.headerTools.childElementCount) _c.intro.classList.add('has-tools');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const mid = u.el('div', 'mid', _c.work);
      const aside = u.el('aside', 'aside', mid);
      const stack = u.svg('svg', { viewBox: '0 0 280 300', class: 'book-stack' }, aside);
      u.svg('path', {
        d: 'M20 76l28-20 198 12-16 53-202-3z M18 134l30-19 200 13-16 55-205-4z M15 194l35-20 203 15-19 57-207-5z',
        fill: '#f5eee2', stroke: '#49332d', 'stroke-width': 4,
      }, stack);
      u.svg('path', { d: 'M42 77l191 9m-195 48 191 11m-194 50 194 12', fill: 'none', stroke: '#876f60', 'stroke-width': 3 }, stack);
      u.el('div', 'book-words', aside, 'Knowledge\nBuilds\nStronger\nCommunities');
      u.el('blockquote', 'quote', aside, '“Good books are\ngood citizens.”');
      u.el('div', 'attribution', aside, '— Daniel Webster');
      Object.assign(_c, { body: _c.work, mid, aside });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const panel = _c.aside.querySelector('.ref-panel');
      if (panel) panel.classList.add('brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('section', 'stage', _c.mid);
      _c.mid.insertBefore(_c.stage, _c.aside);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('brief');
        _c.work.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'bottom', _c.app);
      const tips = u.el('div', 'dock-col tips', footer);
      u.svg('svg', { viewBox: '0 0 64 64', class: 'dock-icon' }, tips).innerHTML = '<circle cx="26" cy="26" r="19"/><path d="M40 40l17 17"/>';
      const tipst = u.el('div', 'dock-copy', tips);
      u.el('b', '', tipst, 'Search Tips');
      u.el('p', '', tipst, 'Try a title, author, subject,\nor keyword. Use fewer words\nfor more results.');
      const examples = u.el('div', 'dock-col examples', footer);
      u.svg('svg', { viewBox: '0 0 72 58', class: 'open-book' }, examples).innerHTML = '<path d="M4 8q17-6 32 2v42Q20 44 4 50zM68 8q-17-6-32 2v42q16-8 32-2z"/>';
      const ex = u.el('div', 'dock-copy', examples);
      u.el('b', '', ex, 'Example Searches');
      u.el('p', '', ex, '•　animal behavior\n•　mark twain\n•　climate change\n•　medieval history');
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('dock-actions');
      if (_c.placement === 'link') foot.classList.add('catalog-link-actions');
      foot.querySelector('.ref-foot-text').remove();
      footer.appendChild(foot);
      if (_c.ctx.finish || !['footer', 'link'].includes(_c.placement)) {
        foot.classList.add('finish-actions');
        u.el('span', 'reader-services', foot, 'Reader Services');
      }
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.catalogNav.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      u.el('span', '', el, 'Library information');
      const dismiss = u.el('button', '', el, 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-solve-puzzle-hot-cold-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { 'design-solve-puzzle-hot-cold-01': palette }, LOW_THEME: palette, ACCENTS: ['#651923'], LOW_ACCENTS: ['#651923'], parts },
  });
})();
