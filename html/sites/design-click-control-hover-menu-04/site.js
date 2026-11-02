(function () {
  'use strict';
  const palette = { bg: '#0061c9', panel: '#f7fbff', fg: '#08194d', muted: '#456388', line: '#a9c3df' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original inspector has room for its note at every supported size.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'aqua');
      const shell = u.el('main', 'shell', document.body);
      const frame = u.el('div', 'app-window', shell);
      const titlebar = u.el('header', 'titlebar', frame);
      u.el('span', 'traffic', titlebar, '');
      u.el('strong', 'window-title', titlebar, 'Acme Solutions');
      u.el('span', 'window-pill', titlebar, '');
      const mast = u.el('header', 'masthead', frame);
      u.el('span', 'globe', mast, '◉');
      const brand = u.el('div', 'brand', mast);
      u.el('strong', '', brand, 'Acme Solutions');
      u.el('small', '', brand, 'Products for a Connected World');
      u.el('div', 'searchbox', mast, '⌕　Search Products');
      const panel = u.el('section', 'task-window');
      const taskhead = u.el('header', 'taskhead', panel);
      u.el('strong', '', taskhead, 'Products');
      u.el('span', 'mini-pill', taskhead, '');
      Object.assign(_c, { shell, frame, panel, header: taskhead });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.dataset.display = _c.display;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const work = u.el('div', 'work', _c.frame);
      const center = u.el('section', 'center', work);
      center.appendChild(_c.panel);
      const aside = u.el('aside', 'inspector', work);
      u.el('h2', '', aside, 'Product Details');
      Object.assign(_c, { body: work, aside });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.aside;
      base(_c);
      _c.body = body;
      const u = _c.util;
      const aside = _c.aside;
      // Leave the inspector note ahead of the static product details in both modes.
      const prod = u.el('div', 'product', aside);
      u.el('span', 'product-icon', prod, '▤✎');
      const pd = u.el('div', '', prod);
      u.el('strong', '', pd, 'Acme Office');
      u.el('span', '', pd, 'Productivity Suite');
      u.el('span', '', pd, 'Version 3.2');
      const details = u.el('div', 'details', aside);
      [
        ['Category:', 'Productivity'],
        ['Release Date:', 'Jan 12, 2001'],
        ['Size:', '120 MB'],
        ['Language:', 'English'],
        ['Developer:', 'Acme Solutions'],
        ['Description:', 'A complete set of office productivity tools, including word processing, spreadsheets, and presentations.'],
      ].forEach(([a, b]) => {
        const row = u.el('div', 'detail-row', details);
        u.el('span', '', row, a);
        u.el('span', '', row, b);
      });
      const related = u.el('section', 'related', aside);
      u.el('h3', '', related, 'Related Resources');
      [['▤', 'Product Website'], ['▣', 'User Guide (PDF)'], ['◉', 'Support Center']].forEach(([i, t]) => {
        const row = u.el('div', 'resource', related);
        u.el('span', '', row, i);
        u.el('a', '', row, t);
      });
      _c.product = prod;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.panel);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') _c.aside.insertBefore(document.body.querySelector('.ref-note'), _c.product);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.panel.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        if (_c.foot) _c.foot.appendChild(dock);
        else _c.panel.appendChild(dock);
      }
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-click-control-hover-menu-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#075bd8'],
      LOW_ACCENTS: ['#075bd8'],
      parts,
    },
  });
})();
