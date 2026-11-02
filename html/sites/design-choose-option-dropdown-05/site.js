(function () {
  'use strict';
  const C = { site: 'design-choose-option-dropdown-05', brand: 'HomeNest', title: 'Return an Item' };
  const BAG = '<svg viewBox="0 0 40 48" width="40" height="48"><defs><linearGradient id="bag-blue" x2="0" y2="1"><stop stop-color="#218bff"/><stop offset="1" stop-color="#0066f0"/></linearGradient></defs><path d="M12 16V11a8 8 0 0 1 16 0v5" fill="none" stroke="#1680ff" stroke-width="2.5"/><path d="M6 13h28a3 3 0 0 1 3 3l1 27a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3l1-27a3 3 0 0 1 3-3" fill="url(#bag-blue)"/><path d="M12 24c4 2 6 2 8-1 2 3 4 3 8 1v7c0 7-3 10-8 10s-8-3-8-10z" fill="#fff"/></svg>';
  const SEARCH = '<svg viewBox="0 0 16 16" width="18" height="18" fill="none" stroke="#444" stroke-width="1.4" stroke-linecap="round"><circle cx="7" cy="7" r="4.8"/><path d="M10.6 10.6L14 14"/></svg>';
  const palette = { bg: '#faf9f7', panel: '#ffffff', fg: '#101924', muted: '#616b7a', line: '#e1dfdd' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
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
      const top = u.el('header', 'ds-top', document.body);
      const brand = u.el('div', 'ds-brand', top);
      brand.insertAdjacentHTML('beforeend', BAG);
      u.el('span', '', brand, C.brand);
      const search = u.el('div', 'ds-search', top);
      search.insertAdjacentHTML('beforeend', SEARCH);
      u.el('span', '', search, 'Search orders, products, or help...');
      const win = u.el('div', 'ds-win', top);
      ['M2 8h14', 'M3 3h11v11H3z M5 1h11v11', 'M2 2l12 12M14 2L2 14'].forEach((d) => {
        const icon = u.el('span', 'ds-wc', win);
        icon.innerHTML = '<svg viewBox="0 0 18 18" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1"><path d="' + d + '"/></svg>';
      });
      const user = u.el('div', 'ds-user', top);
      u.el('span', 'ds-avatar', user, 'JD');
      u.el('span', '', user, 'Jordan Diaz');
      const chev = u.el('span', 'ds-user-chev', user);
      chev.innerHTML = '<svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor"><path d="m2 5 6 6 6-6"/></svg>';
      const body = u.el('div', 'ds-body', document.body);
      const doc = u.el('div', 'ds-doc', body);
      u.el('h1', 'ds-h1', doc, C.title);
      u.el('p', 'ds-sub', doc, 'Tell us what you’re returning and why. We’ll guide you through the next steps.');
      Object.assign(_c, { body, doc, header: doc });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('ds-title-tools');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const main = u.el('div', 'ds-main', _c.doc);
      const deco = u.el('div', 'ds-deco', main);
      const f1 = u.el('div', 'ds-static ds-s-order', deco);
      u.el('span', 'ds-sl', f1, 'Order number');
      u.el('span', 'ds-sbox', f1, 'HN-7843921');
      u.el('span', 'ds-placed', f1, 'Placed on Mar 3, 2024');
      const f2 = u.el('div', 'ds-static ds-s-reason', deco);
      u.el('span', 'ds-sl', f2, 'Reason for return');
      const f3 = u.el('div', 'ds-static ds-s-details', deco);
      u.el('span', 'ds-sl', f3, 'Additional details');
      u.el('span', 'ds-area', f3, 'Add any other details (optional)');
      u.el('span', 'ds-count', f3, '0 / 500');
      const f4 = u.el('div', 'ds-static ds-s-method', deco);
      u.el('span', 'ds-sl', f4, 'Return method');
      const r1 = u.el('span', 'ds-radio on', f4);
      u.el('i', '', r1);
      u.el('b', '', r1, 'Prepaid return label');
      u.el('em', '', r1, 'We’ll email you a label to print.');
      const r2 = u.el('span', 'ds-radio', f4);
      u.el('i', '', r2);
      u.el('b', '', r2, 'In-store return');
      u.el('em', '', r2, 'Return at any HomeNest store.');
      const qty = u.el('div', 'ds-static ds-s-qty', deco);
      u.el('span', 'ds-sl', qty, 'Quantity');
      const q = u.el('span', 'ds-sbox ds-q', qty, '1');
      q.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 18 26" width="18" height="26" fill="none" stroke="#586373" stroke-width="1.5"><path d="m4 10 5-5 5 5m-10 6 5 5 5-5"/></svg>');
      u.el('span', 'ds-of', qty, 'of 1');
      const margin = u.el('aside', 'ds-margin', _c.body);
      Object.assign(_c, { main, margin });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.margin;
      base(_c);
      _c.body = body;
      const u = _c.util;
      if (_c.display === 'panel') u.el('hr', '', _c.margin);
      if (_c.display !== 'hidden') {
        u.el('div', 'ds-yt ds-notes', _c.margin, 'Notes');
        const ul = u.el('ul', 'ds-nl', _c.margin);
        ['Select the correct item from the dropdown list.', 'Do not change any other fields.', 'Review your selection.'].forEach((t) => u.el('li', '', ul, t));
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.margin.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.main.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      const cancel = _c.util.el('button', 'ds-cancel', null, 'Cancel');
      cancel.type = 'button';
      cancel.addEventListener('click', () => env.log('decoy', { label: 'Cancel' }));
      foot.prepend(cancel);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.prepend(dock);
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
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#0874f9'], LOW_ACCENTS: ['#0874f9'], parts },
  });
})();
