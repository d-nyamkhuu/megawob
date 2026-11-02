(function () {
  'use strict';
  const C = {
    nav: ['Search', 'Advanced Search', 'Browse', 'My Account', 'Help'],
    rows: [
      ['1', 'The Quiet Earth', 'Harper, Louise', '1991', 'FIC HAR', 'Available'],
      ['2', 'Maps of the Mind', 'Delacourt, Pierre', '1988', '153.4 DEL', 'Checked Out'],
      ['3', 'A History of Rivers', 'Nguyen, Kam', '1994', '551.48 NGU', 'Available'],
      ['4', 'The Stone Garden', 'Matsuda, Erin', '1990', 'FIC MAT', 'Available'],
      ['5', 'Weather and the World', 'Ellison, Mark', '1987', '551.6 ELL', 'Checked Out'],
      ['6', 'Letters from the North', 'Bjornstad, Lise', '1992', '914.8 BJO', 'Available'],
      ['7', 'The Created Self', 'Ramirez, Daniel', '1995', '155.2 RAM', 'Available'],
      ['8', 'Gardening Through the Seasons', 'Whitfield, Nora', '1989', '635 WHI', 'Checked Out'],
    ],
  };
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
      const el = _c.util.el;
      const page = el('div', 'lc-page', document.body);
      page.style.setProperty('--page-x', document.documentElement.clientWidth / 1672);
      page.style.setProperty('--page-y', document.documentElement.clientHeight / 941);
      const top = el('header', 'lc-banner', page);
      const logo = el('span', 'lc-logo', top);
      logo.setAttribute('role', 'img');
      logo.setAttribute('aria-label', 'Open book');
      const bt = el('div', 'lc-title', top);
      el('div', 'lc-name', bt, 'Riverton Public Library');
      el('div', 'lc-sub', bt, 'Catalog');
      el('div', 'lc-motto', top, 'Knowledge Serves a Greater Tomorrow');
      const nav = el('nav', 'lc-nav', page);
      C.nav.forEach((t, i) => {
        if (i) el('span', 'lc-sep', nav, '|');
        el('span', t === 'Browse' ? 'lc-navi lc-u' : 'lc-navi', nav, t);
      });
      el('span', 'lc-date', nav, 'Mon, Apr 21, 1997');
      const extras = el('div', 'lc-navtools', nav);
      const task = el('section', 'lc-task', page);
      el('div', 'lc-taskbar', task, 'Text Transformation Task');
      const btns = el('div', 'lc-btns', task);
      Object.assign(_c, { page, task, btns, extras, header: task });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const ins = _c.header.querySelector('.ref-instruction');
      if (ins) {
        const n = String(ins.textContent).length;
        if (n > 65) {
          ins.style.fontSize = 'calc(var(--u)*' + (n > 100 ? 30 : 34) + ')';
          ins.style.lineHeight = 'calc(var(--u)*' + (n > 100 ? 34 : 38) + ')';
        }
      }
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.btns;
      base(_c);
      _c.header = h;
      for (const b of _c.headerTools.querySelectorAll('.ref-xtra')) _c.extras.appendChild(b);
    },
    'frame.body': () => (_c) => {
      const el = _c.util.el;
      const cat = el('section', 'lc-cat', _c.page);
      el('h1', 'lc-h1', cat, 'Library Catalog');
      const sr = el('div', 'lc-search', cat);
      el('span', 'lc-slabel', sr, 'Search for:');
      el('div', 'lc-sinput', sr);
      const sel = el('div', 'lc-sel', sr, 'Title');
      el('span', 'lc-caret', sel, '⌄');
      el('div', 'lc-btn lc-sbtn', sr, 'Search');
      el('span', 'lc-more', sr, 'More Search Options');
      const tbl = el('table', 'lc-table', cat);
      const th = el('tr', '', el('thead', '', tbl));
      ['No.', 'Title', 'Author', 'Year', 'Call Number', 'Availability'].forEach((h) => el('th', '', th, h));
      const tb = el('tbody', '', tbl);
      C.rows.forEach((r, row) => {
        const tr = el('tr', '', tb);
        r.forEach((c, i) => {
          const td = el('td', '', tr, c);
          if ((i === 5 && c === 'Available') || (i === 4 && [0, 3, 5, 6, 7].includes(row)) ||
              (row === 7 && [1, 2, 3].includes(i))) td.classList.add('lc-ul');
        });
      });
      const pv = el('aside', 'lc-prev', _c.page);
      el('div', 'lc-prevbar', pv, 'Item Preview');
      const cov = el('div', 'lc-cover', pv);
      cov.setAttribute('role', 'img');
      cov.setAttribute('aria-label', 'The Quiet Earth, by Louise Harper');
      const inf = el('div', 'lc-info', pv);
      el('div', 'lc-it', inf, 'The Quiet Earth');
      ['Author: Harper, Louise', 'Year: 1991', 'Call Number: FIC HAR', 'Format: Hardcover',
        'Availability: Available'].forEach((t) => el('div', 'lc-il', inf, t));
      el('div', 'lc-rule', inf);
      el('div', 'lc-full', inf, 'View Full Record');
      _c.body = _c.page;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.page.querySelector('.ref-panel');
      if (panel) panel.querySelector('.ref-panel-title').textContent = 'Task Note';
    },
    'frame.stage': () => (_c) => {
      const el = _c.util.el;
      const stage = el('main', 'lc-stage', _c.task);
      const clr = el('button', 'lc-btn lc-clear', _c.btns, 'Clear');
      clr.type = 'button';
      const rst = el('button', 'lc-btn lc-clear', _c.btns, 'Reset');
      rst.type = 'button';
      clr.addEventListener('click', () => stage.dispatchEvent(new CustomEvent('library-clear')));
      rst.addEventListener('click', () => stage.dispatchEvent(new CustomEvent('library-reset')));
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.page.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.task.appendChild(foot);
        for (const b of foot.querySelectorAll('.ref-xtra')) _c.extras.appendChild(b);
        foot.querySelector('.ref-foot-text').remove();
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.task.appendChild(dock);
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
  const palette = { bg: '#f3f0e6', panel: '#f8f5eb', fg: '#111827', muted: '#5b5348', line: '#8a7f70' };
  env.site({
    name: 'design-type-text-transform-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#62282b'], LOW_ACCENTS: ['#62282b'], parts,
    },
  });
})();
