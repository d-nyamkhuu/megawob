(function () {
  'use strict';
  const palette = { bg: '#eee', panel: '#f5f5f5', fg: '#111', muted: '#333', line: '#777' };
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
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'People Directory');
      const links = u.el('nav', 'ds-links', top);
      ['New Person', 'Import', 'Help'].forEach((t, i) => {
        if (i) u.el('i', '', links, '|');
        const a = u.el('a', '', links, t);
        a.href = '#';
        a.addEventListener('click', (e) => e.preventDefault());
      });
      const contentRoot = u.el('div', 'ds-content', document.body);
      const header = _c.display === 'header' ? u.el('aside', 'ds-header-note', contentRoot) : top;
      Object.assign(_c, { top, contentRoot, header });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      base(_c);
      if (_c.header === _c.top && _c.headerTools.children.length) {
        if (_c.display === 'panel') _c.top.classList.add('ds-tools-visible');
        _c.headerTools.classList.add('ds-top-tools');
      }
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', _c.contentRoot);
      const people = u.el('aside', 'ds-people', body);
      u.el('h2', '', people, 'All People (24)');
      const list = u.el('div', 'ds-person-list', people);
      [
        'Adams, Karen', 'Bell, Thomas', 'Carter, Monica', 'Chen, Daniel', 'Davis, Ruth',
        'Evans, Paul', 'Foster, Linda', 'Garcia, Miguel', 'Harris, Naomi', 'Jackson, Robert',
        'Kim, Alice', 'Lee, Steven', 'Martin, Patricia', 'Nguyen, Hannah', 'Patel, Arjun',
        'Roberts, Julia', 'Ross, Kevin', 'Turner, Lisa', 'Walker, Brian', 'White, Angela',
        'Wilson, Derek', 'Young, Rachel', 'Zhang, Wen', 'Clark, Nathan',
      ].forEach((n, i) => {
        const a = u.el('a', i === 8 ? 'selected' : '', list, n);
        a.href = '#';
        a.addEventListener('click', (e) => e.preventDefault());
      });
      const center = u.el('section', 'ds-window', body);
      u.el('h2', 'ds-window-title', center, 'Edit Person');
      const fake = u.el('div', 'ds-fake-form', center);
      [
        ['First name', 'Naomi'], ['Last name', 'Harris'], ['Email', 'naomi.harris@company.com'],
        ['Phone', '(415) 555-0198'], ['Department', 'People Operations'], ['Title', 'Recruiter'],
        ['Location', 'San Francisco'],
      ].forEach((r, i) => {
        const row = u.el('div', 'ds-fake-row', fake);
        u.el('label', '', row, r[0] + ':');
        const val = u.el('div', 'ds-fake-value', row, r[1]);
        if (i === 4 || i === 6) val.classList.add('select');
      });
      const recent = u.el('aside', 'ds-recent', body);
      u.el('h2', '', recent, 'Recent People');
      [
        ['Harris, Naomi', 'Apr 12, 1994'], ['Kim, Alice', 'Apr 10, 1994'],
        ['Garcia, Miguel', 'Apr 08, 1994'], ['Evans, Paul', 'Apr 05, 1994'],
        ['Carter, Monica', 'Apr 02, 1994'],
      ].forEach((r) => {
        const row = u.el('div', 'ds-recent-row', recent);
        const a = u.el('a', '', row, r[0]);
        a.href = '#';
        a.addEventListener('click', (e) => e.preventDefault());
        u.el('span', '', row, r[1]);
      });
      Object.assign(_c, { body, center, recent });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.recent;
      base(_c);
      _c.body = body;
      const panel = _c.recent.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        _c.recent.insertBefore(panel, _c.recent.children[1]);
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'ds-stage', _c.center);
      const notes = u.el('div', 'ds-fake-notes', _c.center);
      u.el('label', '', notes, 'Notes:');
      u.el('div', '', notes, 'Focuses on technical hiring and candidate experience.');
      const dock = u.el('nav', 'ds-dock', _c.contentRoot);
      ['◉　 People', '▦　 Departments', '▤　 Jobs', '▦　 Interviews', '▣　 Reports'].forEach((t) =>
        u.el('button', '', dock, t),
      );
      _c.dock = dock;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.recent.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
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
    name: 'design-choose-option-tags-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-choose-option-tags-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#101c9a'],
      LOW_ACCENTS: ['#101c9a'],
      parts,
    },
  });
})();
