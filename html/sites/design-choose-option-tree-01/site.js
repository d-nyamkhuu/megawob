(function () {
  'use strict';
  const palette = { bg: '#1b1527', panel: '#251e32', fg: '#ede5ff', muted: '#bfb2d1', line: '#41354f' };
  const parts = {
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
      const win = u.el('div', 'ds-window', document.body);
      const rail = u.el('aside', 'ds-rail', win);
      const icon = (parent, cls, paths) => {
        const ns = 'http://www.w3.org/2000/svg', s = document.createElementNS(ns, 'svg');
        s.setAttribute('class', cls);
        s.setAttribute('viewBox', '0 0 24 24');
        s.setAttribute('fill', 'none');
        s.setAttribute('stroke', 'currentColor');
        s.setAttribute('stroke-width', '1.7');
        s.setAttribute('stroke-linecap', 'round');
        s.setAttribute('stroke-linejoin', 'round');
        parent.appendChild(s);
        paths.forEach((d) => {
          const p = document.createElementNS(ns, 'path');
          p.setAttribute('d', d);
          s.appendChild(p);
        });
        return s;
      };
      const mark = u.el('div', 'ds-mark', rail);
      icon(mark, 'ds-logo', ['M4 18C4 8 10 4 21 3c0 11-4 17-14 18', 'M4 20 16 8']);
      const navIcons = [
        ['Home', ['M3 10.5 12 3l9 7.5', 'M5.5 9.5V21h13V9.5', 'M9.5 21v-6h5v6']],
        ['Search', ['M20 20l-4.4-4.4', 'M17 10.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0']],
        ['Preferences', ['M4 6h16', 'M4 12h16', 'M4 18h16', 'M9 4v4', 'M15 10v4', 'M8 16v4']],
        ['Orders', ['M5 8h14l1 13H4L5 8Z', 'M9 8V6a3 3 0 0 1 6 0v2']],
        ['Products', ['M12 3 21 8v8l-9 5-9-5V8l9-5Z', 'm3.5 8 8.5 5 8.5-5', 'M12 13v8']],
        ['Messages', ['M3 5h18v14H3z', 'm4 7 8 6 8-6']],
        ['Rewards', ['m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z']],
        ['Help', ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z', 'M9.7 9a2.4 2.4 0 1 1 4 1.8c-1.2.8-1.7 1.2-1.7 2.7', 'M12 17.5h.01']],
      ];
      navIcons.forEach((x, i) => {
        const r = u.el('div', 'ds-nav' + (i === 2 ? ' active' : ''), rail);
        icon(r, 'ds-icon', x[1]);
        u.el('span', '', r, x[0]);
      });
      const shell = u.el('div', 'ds-shell', win);
      const top = u.el('header', 'ds-titlebar', shell);
      u.el('span', 'ds-brand', top, '◈');
      u.el('div', 'ds-window-controls', top, '−　□　×');
      const work = u.el('div', 'ds-work', shell);
      const side = u.el('aside', 'ds-preferences', work);
      const sideHead = u.el('div', 'ds-prefhead', side);
      u.el('strong', '', sideHead, 'Preferences');
      u.el('span', 'ds-plus', sideHead, '＋');
      const search = u.el('div', 'ds-search', side);
      u.el('span', '', search, '⌕');
      u.el('span', 'ds-searchtext', search, 'Search preferences');
      const list = u.el('div', 'ds-pref-list', side);
      const rows = [
        ['♙', 'My account', 'Profile, security, details', 'Updated Apr 12, 2026'],
        ['♧', 'Notifications', 'Email, SMS, in-app', 'Updated Apr 10, 2026'],
        ['◇', 'Privacy', 'Data, visibility, sharing', 'Updated Apr 5, 2026'],
        ['▤', 'Payment methods', 'Cards, wallets, billing', 'Updated Mar 28, 2026'],
        ['♧', 'Delivery preferences', 'Addresses, options', 'Updated Mar 22, 2026'],
        ['◈', 'Dietary filters', 'Food preferences', 'Updated Mar 18, 2026'],
        ['⚝', 'Accessibility', 'Display, interaction', 'Updated Mar 12, 2026'],
        ['◎', 'Language & region', 'Language, currency', 'Updated Mar 6, 2026'],
        ['☆', 'Rewards', 'Points and offers', 'Updated Feb 25, 2026'],
      ];
      rows.forEach((x, i) => {
        const row = u.el('div', 'ds-prefrow' + (i === 0 ? ' selected' : ''), list);
        u.el('span', 'ds-rowicon', row, x[0]);
        const t = u.el('div', 'ds-rowtext', row);
        u.el('div', 'ds-rowname', t, x[1]);
        u.el('div', 'ds-rowdesc', t, x[2]);
        u.el('div', 'ds-rowdate', t, x[3]);
      });
      const contentRoot = u.el('div', 'ds-content', work);
      Object.assign(_c, { top, contentRoot, header: contentRoot });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.top.insertBefore(_c.headerTools, _c.top.firstElementChild);
    },
    'frame.body': () => (_c) => { _c.body = _c.contentRoot; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const heading = _c.body.querySelector('.ref-panel-title');
      if (heading) heading.textContent = 'Task details';
    },
    'frame.stage': () => (_c) => {
      _c.heading = _c.util.el('h1', 'ds-heading', _c.contentRoot, 'Notifications & filters');
      _c.stage = _c.util.el('main', 'ds-stage', _c.contentRoot);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.contentRoot.insertBefore(note, _c.heading);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.contentRoot.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
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
    name: 'design-choose-option-tree-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-choose-option-tree-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#f17b9c'],
      LOW_ACCENTS: ['#f17b9c'],
      parts,
    },
  });
})();
