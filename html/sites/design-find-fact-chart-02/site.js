(function () {
  'use strict';
  const palette = { bg: '#f4f5f7', panel: '#fff', fg: '#172033', muted: '#667185', line: '#d2d6dc' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const dots = u.el('div', 'ds-dots', top);
      ['red', 'yellow', 'green'].forEach((c) => u.el('i', 'dot ' + c, dots));
      u.el('span', 'ds-brand', top, '⌕');
      const search = u.el('div', 'ds-search', top);
      u.el('span', '', search, '⌕');
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      'Dashboard|Reports|Orders|Customers|Products'.split('|').forEach((t, i) => {
        const item = u.el('div', 'ds-navitem' + (i === 1 ? ' active' : ''), rail);
        u.el('span', 'ds-navicon', item, ['▥', '▮', '▤', '♟', '◆'][i]);
        u.el('span', '', item, t);
      });
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      const list = u.el('aside', 'ds-list', main);
      u.el('div', 'ds-list-title', list, 'Sales Reports');
      [
        'Orders by Category', 'Orders by Region', 'Monthly Orders', 'Top Customers',
        'Product Sales', 'Orders by Segment', 'Returns',
      ].forEach((t, i) => {
        const row = u.el('div', 'ds-report' + (i === 0 ? ' selected' : ''), list);
        u.el('div', 'ds-report-name', row, t);
        u.el('div', 'ds-report-date', row, 'Jan 1, 2015 – Dec 31, 2015');
      });
      Object.assign(_c, { top, body, contentPane: content, main, list, header: top });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.contentPane;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.classList.add('ds-tools');
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.list;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.contentPane.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      let foot = document.body.querySelector('.ref-foot');
      if (!foot) foot = _c.util.el('footer', 'ref-foot', _c.contentPane);
      else _c.contentPane.appendChild(foot);
      foot.classList.add('ds-footer');
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
    name: 'design-find-fact-chart-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-chart-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#3180df'],
      LOW_ACCENTS: ['#3180df'],
      parts,
    },
  });
})();
