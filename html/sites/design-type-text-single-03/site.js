(function () {
  'use strict';
  const palette = { bg: '#f1f6fc', panel: '#fff', fg: '#0e2a55', muted: '#6b7a8c', line: '#c7dcef' };
  function panel(u, right, title) {
    const p = u.el('div', 'ds-panel', right);
    u.el('h3', '', p, title);
    return u.el('div', 'ds-pbody', p);
  }
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
      u.el('span', 'ds-b1', brand, 'Task');
      u.el('span', 'ds-b2', brand, ' Flow');
      u.el('span', 'ds-tag', brand, 'Simple Tools for Getting Things Done');
      const who = u.el('div', 'ds-who', top);
      u.el('span', '', who, 'Welcome, Alex');
      u.el('i', '', who);
      u.el('span', '', who, 'Apr 28, 2025');
      const nav = u.el('nav', 'ds-tabs', document.body);
      ['Tasks', 'Notes', 'Files', 'Calendar', 'Contacts'].forEach((t, i) =>
        u.el('span', 'ds-tab' + (i === 0 ? ' on' : ''), nav, t));
      const body = u.el('div', 'ds-body', document.body);
      const left = u.el('section', 'ds-left', body);
      const bar = u.el('h2', 'ds-bar', left, 'New Task');
      Object.assign(_c, { body, left, bar, header: left });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      if (_c.display === 'header') _c.header = _c.util.el('aside', 'ds-brief', header);
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.bar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const right = u.el('aside', 'ds-right', _c.body);
      const d = panel(u, right, 'Task Details');
      [
        ['Status', 'Not submitted'],
        ['Created', 'Apr 28, 2025'],
        ['Assignee', 'Me'],
        ['Priority', 'Normal'],
      ].forEach((r) => {
        const row = u.el('div', 'ds-row', d);
        u.el('span', '', row, r[0]);
        u.el('span', '', row, r[1]);
      });
      _c.right = right;
    },
    'frame.panel': (base) => (_c) => {
      const u = _c.util;
      base({ ..._c, body: _c.right });
      if (_c.display === 'panel') {
        const p = _c.right.querySelector('.ref-panel');
        p.classList.add('ds-panel', 'ds-panel-instruction');
        p.querySelector('.ref-panel-title').textContent = 'Task Instructions';
        const text = p.querySelector('.ref-panel-text');
        text.classList.add('ds-instruction');
        u.el('div', 'ds-pbody', p).appendChild(text);
      } else {
        const t = panel(u, _c.right, 'Helpful Tips');
        const ul = u.el('ul', 'ds-tips', t);
        [
          'Read the instructions carefully.',
          'Enter the exact text in the specified field.',
          'You can complete the other fields if you want.',
          'Complete the task when you are ready.',
        ].forEach((s) => u.el('li', '', ul, s));
      }
      const h = panel(u, _c.right, 'Need Help?');
      u.el('p', '', h, 'If you have any questions, please contact your administrator.');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.left);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        const title = _c.util.el('span', 'ds-toast-title', null, 'Task reminder');
        note.prepend(title);
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.left.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').remove();
      const clear = _c.util.el('span', 'ds-clear', foot, 'Clear');
      clear.setAttribute('aria-hidden', 'true');
      _c.left.appendChild(foot);
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
    name: 'design-type-text-single-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-type-text-single-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2f8f2f'],
      LOW_ACCENTS: ['#2f8f2f'],
      parts,
    },
  });
})();
