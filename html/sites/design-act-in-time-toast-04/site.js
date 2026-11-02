(function () {
  'use strict';
  const palette = { bg: '#c5c5c5', panel: '#efefef', fg: '#111', muted: '#454545', line: '#aaa' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original workstation has dedicated note positions at every size.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, '▣　Workspace');
      const nav = u.el('nav', 'ds-menu', top);
      ['File', 'Edit', 'View', 'Go', 'Window', 'Services', 'Help'].forEach((x) => u.el('span', '', nav, x));
      u.el('div', 'ds-window-title', document.body, 'Network');
      if (!_c.ctx.finish) {
        ['−', '□', '×'].forEach((x, i) => {
          const b = u.el('button', 'ds-window-control', top, x);
          b.type = 'button';
          b.style.right = (84 - i * 37) + 'px';
        });
      }
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      [
        ['◎', 'Network'], ['✉', 'Mail'], ['▣', 'Contacts'],
        ['▤', 'Documents'], ['▤', 'Print'], ['⚙', 'Preferences'],
      ].forEach(([icon, t], n) => {
        const a = u.el('div', 'ds-navitem' + (!n ? ' selected' : ''), rail);
        u.el('b', '', a, icon);
        u.el('span', '', a, t);
      });
      const work = u.el('div', 'ds-work', body);
      const tabs = u.el('nav', 'ds-tabs', work);
      ['Accounts', 'Connection', 'Security', 'Proxies'].forEach((x, i) => u.el('span', i ? '' : 'active', tabs, x));
      Object.assign(_c, { top, body, work, header: work });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.work.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction', 'ds-instruction-header');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.work;
      base(_c);
      _c.body = body;
      const note = _c.work.querySelector('.ref-panel');
      if (note) note.classList.add('ds-instruction', 'ds-instruction-panel');
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const row = u.el('div', 'ds-main', _c.work);
      const stage = u.el('main', 'ds-stage', row);
      const tips = u.el('aside', 'ds-tips', row);
      u.el('h2', '', tips, 'ⓘ　Security Tips');
      [
        'The code expires after a few minutes.',
        'Enter the code exactly as it appears.',
        'If you don’t see the code, check your device and try again.',
      ].forEach((x) => u.el('p', '', tips, '•　' + x));
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-instruction', 'ds-instruction-toast');
        _c.work.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.work.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.prepend(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      u.el(
        'div',
        '',
        el,
        {
          cookie: 'We use cookies to remember your preferences.',
          toast: 'Changes synced.',
          chat: 'Hello. How can we help?',
          promo: 'Try our new workspace.',
          banner: 'Scheduled maintenance tonight.',
        }[ctx.kind],
      );
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-act-in-time-toast-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-toast-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#777'],
      LOW_ACCENTS: ['#777'],
      parts,
    },
  });
})();
