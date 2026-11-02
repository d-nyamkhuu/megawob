(function () {
  'use strict';
  const C = {
    site: 'design-choose-option-listbox-03',
    brand: 'Appearance',
    menus: ['File', 'Edit', 'View', 'Window', 'Special', 'Help'],
    tabs: ['Themes', 'Appearance', 'Fonts', 'Desktop'],
  };
  const APPLE =
    '<svg viewBox="0 0 24 30"><defs><linearGradient id="apple-rainbow" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#64ad43"/><stop offset=".25" stop-color="#f5da37"/><stop offset=".43" stop-color="#ed9630"/><stop offset=".6" stop-color="#c9474c"/><stop offset=".79" stop-color="#914a9b"/><stop offset="1" stop-color="#477cc0"/></linearGradient></defs><path d="M12 8c0-4 3-6 5-6 1 3-2 6-5 6z" fill="#4c9b3f" stroke="#222"/><path d="M12 9C2 4 0 14 3 21c2 7 5 8 9 6 5 2 7-1 10-7-5-2-5-7-1-9-2-3-5-4-9-2z" fill="url(#apple-rainbow)" stroke="#222" stroke-width="1.4"/></svg>';
  const HD =
    '<svg viewBox="0 0 60 58"><defs><linearGradient id="hd-metal" x2=".7" y2="1"><stop stop-color="#fff"/><stop offset=".55" stop-color="#ddd"/><stop offset="1" stop-color="#8b8b94"/></linearGradient></defs><path d="M9 3h42l5 47-3 5H4L2 50z" fill="url(#hd-metal)" stroke="#24242b" stroke-width="2"/><path d="M13 7h34l4 33H8z" fill="#ddd" stroke="#333"/><path d="M16 9h29l3 28H11z" fill="#e7e7e7" stroke="#fff" stroke-width="2"/><path d="M5 43h49M6 47h47" stroke="#555"/><rect x="35" y="47" width="13" height="4" rx="1" fill="#444" stroke="#eee"/><path d="M8 4L4 49M12 5h36" fill="none" stroke="#fff"/></svg>';
  const NOTE =
    '<svg viewBox="0 0 44 58"><rect x="3" y="4" width="38" height="52" fill="#fdfdf8" stroke="#25252b" stroke-width="2"/><path d="M6 7h32M7 15h29M7 18h12m3 0h13M7 21h28M7 24h17m3 0h9M7 28h28M7 31h18m3 0h8M7 34h29M7 38h25M7 41h28M7 45h22M7 49h25" fill="none" stroke="#555" stroke-width="1"/><path d="M7 2v7m4-7v7m4-7v7m4-7v7m4-7v7m4-7v7m4-7v7m4-7v7m4-7v7" stroke="#222" stroke-width="2"/><path d="M8 11h17m3 0h8" stroke="#333"/></svg>';
  const TRASH =
    '<svg viewBox="0 0 46 64"><defs><linearGradient id="trash-metal"><stop stop-color="#aaa"/><stop offset=".18" stop-color="#f8f8f8"/><stop offset=".35" stop-color="#999"/><stop offset=".55" stop-color="#eee"/><stop offset=".8" stop-color="#aaa"/><stop offset="1" stop-color="#777"/></linearGradient></defs><path d="M5 12h36l-2 45c-1 5-29 5-32 0z" fill="url(#trash-metal)" stroke="#333" stroke-width="2"/><ellipse cx="23" cy="12" rx="21" ry="7" fill="url(#trash-metal)" stroke="#333" stroke-width="2"/><ellipse cx="23" cy="10" rx="17" ry="4" fill="#bbb" stroke="#eee"/><path d="M17 9V4c0-3 12-3 12 0v5" fill="#ccc" stroke="#333" stroke-width="2"/><path d="M11 22v31m6-33v35m7-34v35m6-35v33m6-33v30" stroke="#777"/><path d="M12 22v31m6-33v35m7-34v35m6-35v33m6-33v30" stroke="#eee"/></svg>';
  const palette = { bg: '#6b82bd', panel: '#dcdcdc', fg: '#111', muted: '#444', line: '#555' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original window has room for every note mode at every viewport.
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
      u.el('span', 'ds-apple', top).innerHTML = APPLE;
      C.menus.forEach((t) => u.el('span', 'ds-mi', top, t));
      u.el('span', 'ds-clock', top, 'Mon Apr 17  9:24 AM');
      u.el('span', 'ds-speaker', top).innerHTML =
        '<svg viewBox="0 0 30 28"><path d="M3 10h5l7-6v20l-7-6H3z" fill="#555568" stroke="#222"/><path d="M19 8q7 6 0 12m4-17q12 11 0 22" fill="none" stroke="#222" stroke-width="2"/></svg>';
      const desktop = u.el('div', 'ds-body', document.body);
      [
        ['ds-ic ds-ic-hd', HD, 'Macintosh HD'],
        ['ds-ic ds-ic-notes', NOTE, 'Notes'],
        ['ds-ic ds-ic-trash', TRASH, 'Trash'],
      ].forEach((a) => {
        const d = u.el('div', a[0], desktop);
        u.el('div', 'ds-ic-img', d).innerHTML = a[1];
        u.el('div', 'ds-ic-label', d, a[2]);
      });
      const content = u.el('div', 'ds-content', desktop);
      const tb = u.el('div', 'ds-titlebar', content);
      u.el('span', 'ds-box ds-box-l', tb);
      u.el('span', 'ds-box ds-box-l2', tb);
      u.el('span', 'ds-ttl', tb, C.brand);
      u.el('span', 'ds-box ds-box-r', tb);
      const tabs = u.el('div', 'ds-tabs', content);
      C.tabs.forEach((t) => u.el('span', 'ds-tab' + (t === 'Appearance' ? ' on' : ''), tabs, t));
      const header = u.el('div', _c.display === 'header' ? 'ds-header-note' : 'ds-note-slot', content);
      Object.assign(_c, { contentWindow: content, tabs, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.tabs;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.contentWindow);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-title').textContent = 'Instructions';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'ds-stage', _c.body);
      const pv = u.el('div', 'ds-preview', _c.body);
      u.el('div', 'ds-pv-label', pv, 'Preview:');
      const sw = u.el('div', 'ds-sw', pv);
      const st = u.el('div', 'ds-sw-t', sw);
      u.el('span', 'ds-box ds-box-sw', st);
      u.el('span', 'ds-sw-ttl', st, 'Sample Window');
      const sb = u.el('div', 'ds-sw-body', sw);
      u.el('p', '', sb, 'Active content uses the selected accent color.');
      u.el('span', 'ds-ok', sb, 'OK');
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.contentWindow.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.contentWindow.appendChild(foot);
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
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-choose-option-listbox-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#6c7fd0'],
      LOW_ACCENTS: ['#6c7fd0'],
      parts,
    },
  });
})();
