(function () {
  'use strict';
  const C = {
    site: 'design-fill-form-card-09',
    title: 'Contact Manager',
    menu: 'Workspace|File|Edit|View|Tools',
    wmenu: 'File|Edit|Actions|Help',
  };
  const icons = {
    New: '<path d="M5 2h15l7 7v21H5z" fill="#f4f3ef" stroke="#252535" stroke-width="1.6"/><path d="M20 2v7h7M7 4v24h18" fill="none" stroke="#858593" stroke-width="1.2"/>',
    Open: '<path d="M2 5h11l3 4h11v17H2z" fill="#d4d3d4" stroke="#252535" stroke-width="1.5"/><path d="M2 26l5-12h24l-6 12z" fill="#858695" stroke="#252535" stroke-width="1.6"/><path d="M4 6h8M7 15h22" stroke="#fafafa"/>',
    Save: '<path d="M3 3h25v26H3z" fill="#666881" stroke="#252535" stroke-width="1.6"/><path d="M8 3h14v11H8zM8 19h16v10H8z" fill="#dddde2" stroke="#252535" stroke-width="1.5"/><path d="M19 5v7M11 22h10M5 5v21" stroke="#f9f9f9"/>',
    Delete: '<path d="M6 7h21v23H6z" fill="#999aa8" stroke="#252535" stroke-width="1.5"/><path d="M4 5h25v4H4zM12 5V2h9v3" fill="#dcdce0" stroke="#252535" stroke-width="1.5"/><path d="M9 11v16M14 11v16M19 11v16M24 11v16" stroke="#eee" stroke-width="2"/><path d="M11 11v16M16 11v16M21 11v16" stroke="#555568"/> ',
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
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
      const nav = u.el('nav', 'ds-menu', top);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      u.el('span', 'ds-clock', top, 'Mon Apr 15   10:24 AM');
      const desktop = u.el('div', 'ds-body', document.body);
      const win = u.el('div', 'ds-content', desktop);
      const tb = u.el('div', 'ds-titlebar', win);
      u.el('span', 'ds-tb-btn', tb, '−');
      u.el('span', 'ds-grip', tb);
      u.el('span', 'ds-tb-title', tb, C.title);
      const tc = u.el('span', 'ds-tb-ctl', tb);
      u.el('span', 'ds-tb-btn', tc, '−');
      u.el('span', 'ds-tb-btn ds-maximize', tc, '');
      u.el('span', 'ds-tb-btn', tc, '×');
      const wm = u.el('nav', 'ds-wmenu', win);
      C.wmenu.split('|').forEach((t) => {
        const s = u.el('span', '', wm);
        s.innerHTML = t === 'File' ? '<u>F</u>ile' : t;
      });
      const toolbar = u.el('div', 'ds-toolbar', win);
      ['New', 'Open', 'Save', '|', 'Delete'].forEach((l) => {
        if (l === '|') {
          u.el('span', 'ds-tsep', toolbar);
          return;
        }
        const b = u.el('button', 'ds-tool' + (l === 'New' ? ' on' : ''), toolbar);
        b.type = 'button';
        b.innerHTML = '<svg viewBox="0 0 32 32" width="34" height="34">' + icons[l] + '</svg><span>' + l + '</span>';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: l }));
      });
      const trash = u.el('div', 'ds-trash', desktop);
      trash.innerHTML = '<svg viewBox="0 0 32 32" width="46" height="46">' + icons.Delete + '</svg><span>Trash</span>';
      Object.assign(_c, { win, toolbar, header: win });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.win.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.win);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.win.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').remove();
      const clear = _c.util.el('button', 'ds-cancel ds-clear', null, 'Clear Form');
      clear.type = 'button';
      foot.prepend(clear);
      _c.win.appendChild(foot);
      const status = _c.util.el('div', 'ds-statusbar', _c.win);
      _c.util.el('span', 'ds-resize', status, '◢');
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
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
  const palette = { bg: '#626382', panel: '#c9c6bf', fg: '#111', muted: '#333', line: '#6f6c63' };
  env.site({
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#111'],
      LOW_ACCENTS: ['#111'],
      parts,
    },
  });
})();
