(function () {
  'use strict';
  const palette = { bg: '#f7f8f9', panel: '#ffffff', fg: '#0b1421', muted: '#38495d', line: '#d5dbe1' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
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
      const title = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-mark', title, '●');
      u.el('span', 'ds-brand', title, 'People & Accounts');
      u.el('span', 'ds-window', title, '−　□　×');
      const menu = u.el('nav', 'ds-menu', document.body);
      'File|Edit|View|Records|Tools|Help'.split('|').forEach((t) => u.el('span', '', menu, t));
      const toolbar = u.el('div', 'ds-toolbar', document.body);
      const icons = {
        plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="#ff8000" stroke="none"/><path d="M12 6v12M6 12h12" stroke="#fff" stroke-width="1.8"/></svg>',
        folder: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 6.5h7l2 2h10v11h-19z"/><path d="M2.5 8.5v-3h7l2 2"/></svg>',
        trash: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M9 4h6M7 7l1 14h8l1-14M10 10v8M14 10v8"/></svg>',
        search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m15.5 15.5 5 5"/></svg>',
        filter: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h18l-7 8v7l-4 2v-9z"/></svg>',
        sort: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4v16m0 0-4-4m4 4 4-4M17 20V4m0 0-4 4m4-4 4 4"/></svg>',
      };
      [['plus', 'New'], ['folder', 'Open'], ['trash', 'Delete'], ['search', 'Find'], ['filter', 'Filter'], ['sort', 'Sort']].forEach(([icon, text]) => {
        const b = u.el('button', 'ds-tool', toolbar);
        b.type = 'button';
        u.el('span', 'ds-tool-icon', b).innerHTML = icons[icon];
        u.el('span', '', b, text);
      });
      Object.assign(_c, { header: title, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      [['♟', 'People'], ['▦', 'Organisations'], ['▢', 'Activity'], ['▤', 'Documents'], ['▥', 'Reports']].forEach(([icon, text], i) => {
        const item = u.el('div', 'ds-navitem' + (i === 0 ? ' active' : ''), rail);
        u.el('span', 'ds-navicon', item, icon);
        u.el('span', '', item, text);
      });
      const content = u.el('div', 'ds-content', body);
      const hero = u.el('section', 'ds-hero', content);
      const identity = u.el('div', 'ds-identity', hero);
      u.el('div', 'ds-avatar', identity, 'JS');
      const details = u.el('div', 'ds-identity-copy', identity);
      u.el('h1', '', details, 'Jordan Smith');
      u.el('div', 'ds-subtitle', details, 'Individual Customer');
      const meta = u.el('div', 'ds-meta', details);
      [['✉', 'jordan.smith@example.com'], ['♧', '+44 7700 900123'], ['♧', 'Bristol, UK']].forEach(([icon, text]) => {
        const item = u.el('span', '', meta);
        u.el('b', '', item, icon);
        u.el('span', '', item, text);
      });
      const stats = u.el('div', 'ds-stats', hero);
      [['4', 'Total bookings'], ['2', 'Open requests'], ['1', 'Saved card']].forEach(([n, label]) => {
        const stat = u.el('div', 'ds-stat', stats);
        u.el('strong', '', stat, n);
        u.el('span', '', stat, label);
      });
      const tabs = u.el('nav', 'ds-tabs', content);
      ['Details', 'Bookings', 'Requests', 'Documents'].forEach((text, i) => u.el('span', i === 0 ? 'active' : '', tabs, text));
      const main = u.el('div', 'ds-main', content);
      Object.assign(_c, { body: main, content, tabs });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-task-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.tabs.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.tabs.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.' };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-type-text-complete-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#ff8000'], LOW_ACCENTS: ['#ff8000'], parts,
    },
  });
})();
