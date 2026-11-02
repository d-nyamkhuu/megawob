(function () {
  'use strict';
  const C = {
    site: 'design-type-text-login-04',
    brand: 'Global Explorer',
    tagline: 'World Knowledge at Your Fingertips',
    nav: 'DISCOVER|LEARN|EXPLORE',
    tabs: 'Welcome|Maps|Culture|Wildlife|History|Activities|Reference',
  };
  const palette = { bg: '#0f2a8c', panel: '#f1e6c4', fg: '#15154f', muted: '#5b5230', line: '#8a6b1c' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The notebook has its own inline note and side card, including on short pages.
      const display = _c.ctx.display || 'header';
      _c.display = display === 'panel' && _c.W < 1180 ? 'header' : display;
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
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
      u.el('div', 'ds-globe', top);
      const ids = u.el('div', 'ds-ids', top);
      u.el('div', 'ds-brand', ids, C.brand);
      u.el('div', 'ds-tagline', ids, C.tagline);
      const nav = u.el('nav', 'ds-nav', top);
      C.nav.split('|').forEach((t, i) => {
        if (i) u.el('i', '', nav, '');
        u.el('span', '', nav, t);
      });
      const book = u.el('div', 'ds-book', document.body);
      const rail = u.el('aside', 'ds-rail', book);
      C.tabs.split('|').forEach((t, i) => u.el('div', 'ds-tab t' + i + (i === 0 ? ' on' : ''), rail, t));
      const page = u.el('div', 'ds-page', book);
      const map = u.el('div', 'ds-map', page);
      map.innerHTML =
        '<svg viewBox="0 0 610 600" xmlns="http://www.w3.org/2000/svg"><defs><filter id="map-ink" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 .63 0 0 0 0 .55 0 0 0 0 .38 -5 0 0 0 4.5"/></filter><mask id="map-only"><rect width="610" height="600" fill="white"/><g fill="black"><rect x="0" y="99" width="495" height="8"/><rect x="0" y="192" width="410" height="163"/><rect x="0" y="396" width="180" height="63"/><rect x="0" y="494" width="180" height="63"/></g></mask></defs><g mask="url(#map-only)"><image href="sites/design-type-text-login-04/assets/notebook-reference.webp" x="-1040" y="-135" width="1672" height="941" filter="url(#map-ink)"/></g></svg>';
      const body = u.el('div', 'ds-body', page);
      const content = u.el('div', 'ds-content', body);
      const title = u.el('h1', 'ds-title', content, 'Member Login');
      u.el('p', 'ds-lead', content, 'Sign in to access maps, articles and more.');
      Object.assign(_c, { contentPane: content, title, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.contentPane);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-title').textContent = 'Instructions';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.contentPane.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.contentPane.appendChild(foot);
      if (!foot.querySelector('button, a') && _c.placement !== 'floating') foot.classList.add('ds-footer-empty');
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
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#1d3a9e'],
      LOW_ACCENTS: ['#1d3a9e'],
      parts,
    },
  });
})();
