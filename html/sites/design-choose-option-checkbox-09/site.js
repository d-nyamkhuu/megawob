(function () {
  'use strict';
  const C = {
    site: 'design-choose-option-checkbox-09',
    brand: 'New Listing',
    menu: 'File|Edit|View|Go|Tools|Windows|Help',
  };
  const palette = { bg: '#b4b4b4', panel: '#dedede', fg: '#0c0c0c', muted: '#444', line: '#555' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has room for its margin note at every viewport.
      _c.display = _c.ctx.display || 'header';
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
      const bar = u.el('header', 'nx-bar', document.body);
      const apple = u.el('span', 'nx-apple', bar);
      apple.innerHTML =
        '<svg viewBox="0 0 16 18" width="16" height="18"><path fill="#fff" d="M11 0c0 1.5-1 3-2.600 3.300C8.300 1.700 9.600.2 11 0zM8 4.500c.8 0 1.700-.6 3-.6 1.200 0 2.500.6 3.300 1.800-2.800 1.600-2.400 5.500.4 6.600-.7 1.700-1.700 3.700-3.100 3.700-1.100 0-1.500-.7-2.600-.7s-1.600.7-2.600.7C4.600 16 2 12 2 8.600 2 5.800 4 4 6 4c1.100 0 1.500.5 2 .5z"/></svg>';
      const nav = u.el('nav', 'nx-menu', bar);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      u.el('span', 'nx-clock', bar, 'Mon Mar 1   10:24 AM');
      const desk = u.el('div', 'nx-desk', document.body);
      const win = u.el('section', 'nx-win', desk);
      const tb = u.el('div', 'nx-title', win);
      u.el('i', '', tb);
      u.el('i', '', tb);
      u.el('span', '', tb, C.brand);
      const doc = u.el('div', 'nx-doc', win);
      u.el('h1', 'nx-h1', doc, 'Property Details');
      const margin = u.el('aside', 'nx-margin', desk);
      Object.assign(_c, { desk, win, tb, doc, margin, header: doc });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tb;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const stat = u.el('div', 'nx-static', _c.doc);
      const f1 = u.el('div', 'nx-f nx-wide', stat);
      u.el('label', '', f1, 'Title');
      u.el('div', 'nx-text', f1, 'Riverside Apartment');
      const f2 = u.el('div', 'nx-f', stat);
      u.el('label', '', f2, 'Property type');
      const pop = u.el('div', 'nx-pop', f2);
      u.el('span', '', pop, 'Apartment');
      u.el('b', '', pop, '▼');
      const f3 = u.el('div', 'nx-f', stat);
      u.el('label', '', f3, 'Max guests');
      const sp = u.el('div', 'nx-spin', f3);
      u.el('span', '', sp, '4');
      const arrows = u.el('b', '', sp);
      u.el('i', '', arrows, '▲');
      u.el('i', '', arrows, '▼');
      _c.body = u.el('div', 'nx-main', _c.doc);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.margin;
      base(_c);
      _c.body = body;
      const title = _c.margin.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Task notes';
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.margin.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const foot = u.el('footer', 'nx-foot', _c.doc);
      u.el('span', 'nx-btn', foot, 'Cancel');
      u.el('span', 'nx-btn', foot, 'Save Draft');
      base(_c);
      const controls = document.body.querySelector('.ref-foot');
      if (controls) foot.appendChild(controls);
      _c.foot = foot;
      u.el('h3', '', _c.margin, 'Action notes:');
      const ol = u.el('ol', '', _c.margin);
      [
        'Review the property details.',
        'Select the correct must-have amenities using the checkboxes.',
      ].forEach((t) => u.el('li', '', ol, t));
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
      THEMES: { 'design-choose-option-checkbox-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#222'],
      LOW_ACCENTS: ['#222'],
      TITLES: [C.brand],
      parts,
    },
  });
})();
