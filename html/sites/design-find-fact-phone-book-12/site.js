(function () {
  'use strict';
  const palette = { bg: '#bcbab5', panel: '#bcbab5', fg: '#111', muted: '#111', line: '#c9cbd0' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Preserve this frame's original note fallbacks.
      _c.display = _c.ctx.display || 'header';
      if ((_c.display === 'panel' && _c.W < 1260) || (_c.display === 'toast' && _c.W < 1100)) _c.display = 'header';
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
      const icon = u.el('span', 'ds-appicon', top);
      icon.innerHTML =
        '<svg viewBox="0 0 30 30" aria-hidden="true"><path fill="#eeeae0" stroke="#333" d="M5 4h20v22H5z"/><path fill="#888" stroke="#222" d="M8 7h15v16H8z"/><path fill="#eee" d="M10 8h11v14H10z"/><path stroke="#922" d="M13 9v11m3-10v10m3-8v7"/><path stroke="#222" d="M3 27h24M4 3h22"/></svg>';
      u.el('span', 'ds-brand', top, 'Address Book');
      const wb = u.el('span', 'ds-wbtns', top);
      ['_', '□', '×'].forEach((t) => u.el('i', '', wb, t));
      const menu = u.el('nav', 'ds-menu', document.body);
      ['File', 'Edit', 'View', 'Actions', 'Help'].forEach((t) => u.el('span', '', menu, t));
      u.el('span', 'ds-clock', menu, 'Mon Apr 15   10:24 AM');
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      Object.assign(_c, { menu, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('ds-brief');
        note.querySelector('.ref-panel-text').classList.add('ds-instruction');
        note.querySelector('.ref-panel-title').textContent = 'Instructions';
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'ds-stage', _c.body);
      const side = u.el('aside', 'ds-side', _c.body);
      const sv = u.el('button', 'ds-save', side, 'Save View…');
      sv.type = 'button';
      sv.addEventListener('click', () => env.log('decoy', { label: 'Save View…' }));
      u.el('div', 'ds-savenote', side, 'Saves only your presentation preferences (column widths, sort order, etc).');
      _c.side = side;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      const total = foot.querySelector('.ref-foot-text');
      total.classList.add('ds-total');
      total.textContent = 'Contacts';
      const sel = _c.util.el('span', 'ds-sel', null, 'No contact selected');
      total.after(sel);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.side.appendChild(dock);
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
    name: 'design-find-fact-phone-book-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#111111'],
      LOW_ACCENTS: ['#111111'],
      parts,
    },
  });
})();
