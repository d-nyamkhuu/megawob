(function () {
  'use strict';
  const palette = { bg: '#edf3f7', panel: '#fff', fg: '#14233f', muted: '#72829b', line: '#dce4ed' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All note modes share the original task strip, including on small screens.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'ShopEase');
      const meta = u.el('div', 'ds-window-meta', top);
      u.el('span', '', meta, 'Mon, Apr 27, 2026  10:14 AM');
      if (!_c.ctx.finish) ['−', '□', '×'].forEach((t) => {
        const b = u.el('button', '', meta, t);
        b.type = 'button';
      });
      const brief = u.el('aside', 'ds-brief');
      brief.hidden = _c.display === 'hidden';
      Object.assign(_c, { top, meta, header: brief });
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'ds-menu', document.body);
      'Home|Shop|Deals|Orders|Account'.split('|').forEach((t) => _c.util.el('span', '', nav, t));
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = h;
      _c.headerTools.classList.add('ds-toptools');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      'All Categories|Electronics|Home & Kitchen|Clothing & Accessories|Beauty & Personal Care|Sports & Outdoors|Toys & Games|Books & Media|Health & Wellness|Automotive|Office & Stationery|Pets'
        .split('|').forEach((t) => u.el('div', '', rail, t));
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      main.appendChild(_c.header);
      const shelf = u.el('footer', 'ds-footer', content);
      Object.assign(_c, { body, contentBox: content, main, shelf });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.shelf.appendChild(foot);
      _c.contentBox.classList.toggle('ds-has-shelf', !!foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.shelf.appendChild(dock);
        _c.contentBox.classList.add('ds-has-shelf');
      }
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
    name: 'design-act-in-time-loading-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#287cf4'],
      LOW_ACCENTS: ['#287cf4'],
      parts,
    },
  });
})();
