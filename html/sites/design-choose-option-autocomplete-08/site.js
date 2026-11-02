(function () {
  'use strict';
  const palette = { bg: '#c6c6c6', panel: '#d0d0d0', fg: '#111', muted: '#444', line: '#7a7a7a' };
  function icon(u, parent, globe) {
    const e = u.el('span', 'ds-sysicon', parent);
    e.innerHTML = globe
      ? '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2 23 5 29 12 29 21 23 28 13 30 5 25 2 17 5 8Z" fill="#eee" stroke="#222"/><circle cx="16" cy="16" r="11" fill="#1429a1" stroke="#222"/><path d="m7 8 5-2 2 4-3 4-5-1 1-5Zm14 1 5 4-2 5-4-1-1 4-4 1-2-5 3-4 4 1Zm-9 13 3 4-3 1-3-4Z" fill="#dedec9" stroke="#555" stroke-width=".6"/><path d="M5 16h22M16 5c-7 6-7 16 0 22M16 5c7 6 7 16 0 22" fill="none" stroke="#aaa" stroke-width=".7"/><path d="m8 6 5-2" stroke="white" stroke-width="2"/></svg>'
      : '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="m16 2 8 5 5 9-4 9-10 5-9-5-3-9 4-9Z" fill="#eee" stroke="#222"/><path d="m12 5 9-1 3 7 4 5-5 4 1 7-11-3-6 1 1-7-4-4 7-2Z" fill="#ddd" stroke="#333"/><path d="m12 9 7-2 3 9-6 3-5-2 1-8Zm-4 13 7 2 9-3M6 16l5 2M17 20l1 7" fill="none" stroke="#555"/><path d="m10 12 6 1 3-3 2 6-7 1-4-2Z" fill="white" stroke="#111"/><path d="M8 25h15M20 6v5" stroke="white"/></svg>';
    return e;
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The notebook has room for its original inline notes at every viewport.
      _c.display = _c.ctx.display || 'header';
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
      const top = u.el('header', 'ds-top', document.body);
      icon(u, top, false);
      u.el('span', 'ds-brand', top, 'OS/2 Workplace Shell  -  Employee Record');
      const wb = u.el('span', 'ds-wbtn', top);
      ['_', '▫', '×'].forEach((t) => u.el('i', '', wb, t));
      const nav = u.el('nav', 'ds-menu', document.body);
      ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Help'].forEach((t) => u.el('span', '', nav, t));
      const outer = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', outer);
      for (let i = 1; i <= 20; i++) u.el('div', '', rail, String(i));
      const content = u.el('div', 'ds-content', outer);
      const tabs = u.el('div', 'ds-tabs', content);
      ['General', 'Employment', 'Contact', 'Notes'].forEach((t, i) => u.el('span', i ? '' : 'on', tabs, t));
      const sheet = u.el('div', 'ds-sheet', content);
      Object.assign(_c, { header: sheet, sheet, menu: nav });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.sheet);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-brief');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const left = u.el('div', 'ds-left', _c.body);
      [['First name', 'Elena'], ['Last name', 'Morales'], ['Employee ID', 'EMP-1043']].forEach((r) => {
        const row = u.el('div', 'ds-row', left);
        u.el('span', '', row, r[0] + ':');
        u.el('div', 'ds-fake', row, r[1]);
      });
      const jr = u.el('div', 'ds-row', left);
      u.el('span', '', jr, 'Job title:');
      const jf = u.el('div', 'ds-fake ds-dd', jr, 'Project Coordinator');
      u.el('b', '', jf, '▾');
      const right = u.el('div', 'ds-right', _c.body);
      _c.stage = u.el('main', 'ds-stage', right);
      [['Department', ''], ['Start date', '2023-06-12'], ['Employment type', 'Full-time']].forEach((r, i) => {
        const row = u.el('div', 'ds-row ds-rrow', right);
        u.el('span', '', row, r[0] + ':');
        const f = u.el('div', 'ds-fake ds-dd', row, r[1]);
        if (i === 1) {
          const cal = u.el('b', 'ds-calendar', f);
          cal.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 4h20v18H2Z" fill="white" stroke="black"/><path d="M2 4h20v5H2Z" fill="#003999" stroke="black"/><path d="M6 2v5M18 2v5M3 13h18M3 17h18M7 9v12M12 9v12M17 9v12" fill="none" stroke="#222"/></svg>';
        }
        if (i === 2) u.el('b', '', f, '▾');
      });
      const addl = u.el('div', 'ds-addl', _c.sheet);
      u.el('div', '', addl, 'Additional information:');
      const area = u.el('div', 'ds-area', addl);
      const sb = u.el('div', 'ds-vsb', area);
      u.el('b', '', sb, '▲');
      u.el('i', '', sb);
      u.el('b', '', sb, '▼');
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.sheet.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.sheet.appendChild(foot);
      const cancel = _c.util.el('button', 'ds-travel-cancel', foot, 'Cancel');
      cancel.type = 'button';
      const st = _c.util.el('footer', 'ds-status', document.body);
      icon(_c.util, st, true);
      _c.util.el('span', 'ds-ready', st, 'Ready');
      _c.util.el('span', 'ds-sp', st);
      _c.util.el('span', 'ds-clock', st, 'Apr 24, 1994   10:27 AM');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        const status = document.body.querySelector('.ds-status');
        status.insertBefore(dock, status.querySelector('.ds-clock'));
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
    name: 'design-choose-option-autocomplete-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#0a1f8f'], LOW_ACCENTS: ['#0a1f8f'], parts,
    },
  });
})();
