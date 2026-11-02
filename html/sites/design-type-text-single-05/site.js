(function () {
  'use strict';
  const palette = { bg: '#f5f8fa', panel: '#fff', fg: '#080b10', muted: '#5d6979', line: '#e7ecf1' };
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
      const body = u.el('div', 'ds-body', document.body);
      const ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="#ff780b" stroke-width="2">';
      const DARK = '<svg viewBox="0 0 24 24" fill="none" stroke="#2b3240" stroke-width="1.6">';
      const tools = u.el('aside', 'ds-tools', body);
      u.el('h3', '', tools, 'Tools');
      [
        ['Calculator', ICON + '<rect x="3" y="1" width="18" height="22" rx="1" fill="#ff780b"/><path d="M6 5h12" stroke="#fff" stroke-width="3"/><path d="M6 10h2m3 0h2m3 0h2M6 14h2m3 0h2m3 0h2M6 18h2m3 0h2m3 0h2" stroke="#fff" stroke-width="2"/></svg>'],
        ['Notepad', DARK + '<path d="M3 1h10l7 7v15H3zM13 1v7h7"/><path d="M6 11h11M6 15h11M6 19h9"/></svg>'],
        ['Timer', DARK + '<circle cx="12" cy="12" r="9.5"/><path d="M12 5v7h5"/></svg>'],
      ].forEach(([n, s]) => {
        const t = u.el('div', 'ds-tool', tools);
        t.insertAdjacentHTML('beforeend', s);
        u.el('span', '', t, n);
      });
      const content = u.el('div', 'ds-content', body);
      const notes = u.el('aside', 'ds-notes', body);
      const nh = u.el('h3', '', notes);
      nh.insertAdjacentHTML('beforeend', ICON + '<path d="M4 1h10l6 6v15q0 1-1 1H4q-1 0-1-1V2q0-1 1-1z" fill="#ff780b"/><path d="M14 2v6h6M6 11h11M6 15h11M6 19h11" stroke="#fff" stroke-width="1.5"/></svg>');
      u.el('span', '', nh, 'Notes');
      if (_c.display !== 'panel') u.el('p', '', notes, 'You can use the tools on the left if needed.');
      notes.classList.toggle('ds-note-panel', _c.display === 'panel');
      const head = u.el('div', 'ds-cardhead', content);
      const hl = u.el('div', 'l', head);
      u.el('span', 'bar', hl);
      u.el('span', '', hl, 'Task 1 of 1');
      u.el('span', 'ds-req', head, 'Required');
      const main = u.el('div', 'ds-main', content);
      Object.assign(_c, { body, content, notes, main, header: head });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.main;
      base(_c);
      _c.header = header;
      if (_c.display === 'header') _c.util.el('div', 'ds-sub ds-sub-space', _c.main);
    },
    'frame.tools': (base) => (_c) => { base(_c); },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.notes;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        _c.main.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.main.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = _c.ctx.finish ? 'Ready' : '';
      foot.classList.toggle('ds-finish', !!_c.ctx.finish);
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
    name: 'design-type-text-single-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-type-text-single-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ff700e'],
      LOW_ACCENTS: ['#ff700e'],
      parts,
    },
  });
})();
