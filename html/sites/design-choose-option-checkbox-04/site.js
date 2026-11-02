(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-checkbox-04',
    'menu': 'File|Edit|View|Help',
  };
  const drawings = {
    pin: '<path fill="#111" d="M13 2l10 3-1 3-4-1-3 11 6 3-1 3-8-2-5 9 2-10-5-2 1-3 6 1 3-11-5-2z"/>',
    tools: '<path d="M5 6h20v5H5zM7 14h17M8 11l3 9M22 11l-3 9M7 22h17M6 27l17-12M8 24l16 4" fill="none"/>',
    select: '<path fill="white" d="M5 3v26l7-7 6 12 5-3-6-11 10-1z"/>',
    text: '<text x="2" y="29" font-family="serif" font-size="34" fill="black" stroke="none">A</text>',
    zoom: '<path fill="#aaa" d="M23 21l10 10-3 3-10-11z"/><circle cx="13" cy="13" r="11" fill="#eee"/><circle cx="13" cy="13" r="8.5" fill="#c4cbd2" stroke="#888"/>',
    pan: '<path fill="url(#ol-metal)" d="M11 30l-6-10q-2-4 1-5 2-1 5 4V8q0-4 3-3v12V3q1-4 4-1v15V5q2-3 4 0v14V10q2-3 4 0v16l-3 7H14z"/>',
    home: '<path fill="url(#ol-metal)" d="M3 17L18 3l16 14-3 3-3-3v17H8V17l-3 3z"/><path fill="#eee" d="M15 22h7v12h-7zM12 14h5v5h-5zM23 14h4v5h-4z"/><path d="M25 7V2h5v10M18 8L8 17" fill="none"/>',
    folder:
      '<path fill="#b7cce1" d="M3 11V6q0-2 3-2h8l4 5h14v23H3z"/><path fill="url(#ol-blue)" d="M2 11h30v22H2z"/><path d="M4 13h25M4 13v18" stroke="#e8f2fb"/><path d="M29 13v18H4" stroke="#718397" stroke-width="1"/>',
    help: '<path fill="#eee" d="M7 4h22v27H7z"/><path fill="url(#ol-blue)" d="M3 7h20v27H3z"/><path d="M25 3v26l6-2V8l-3-1M6 9v22" fill="none"/>',
    trash:
      '<path fill="url(#ol-metal)" d="M8 12h23v27q-10 5-23 0z"/><path fill="#e7e9e9" d="M10 14h5v25h-5z" stroke="none"/><ellipse fill="#b7b9bb" cx="20" cy="11" rx="16" ry="5"/><ellipse fill="#e4e5e6" cx="20" cy="9" rx="15" ry="4"/><path fill="#d7d7d7" d="M14 8l2-6h9l3 7-5 1-1-5h-4l-1 4z"/>',
    window:
      '<path fill="url(#ol-blue)" d="M3 4h28v27H3z"/><path d="M4 8h26M25 25h4v4h-4"/><path d="M5 10v18h3" fill="none" stroke="white"/>',
    screen:
      '<path fill="#c5c9ce" d="M5 8h27v22H5z"/><path fill="#9dabb5" d="M8 11h21v16H8z"/><path d="M9 12h19v14" fill="none" stroke="white"/>',
    volume:
      '<path fill="#c8ccce" d="M4 14h7l9-8v27l-9-8H4z"/><path d="M24 12q11 8 0 15M24 17q4 3 0 6M12 14v11" fill="none"/>',
    min: '<path d="M9 25h16" stroke-width="4"/>',
    max: '<path fill="#c6c9cc" d="M9 7h16v18H9z"/>',
  };
  function icon(parent, name) {
    const e = document.createElement('span');
    e.className = 'ol-glyph ol-glyph-' + name;
    e.innerHTML =
      '<svg viewBox="0 0 ' +
      (name === 'trash' ? '40 44' : '36 36') +
      '" fill="none" stroke="#101010" stroke-width="1.7" stroke-linejoin="round"><defs><linearGradient id="ol-blue" x2="0" y2="1"><stop stop-color="#d4e6f5"/><stop offset=".6" stop-color="#b7cee6"/><stop offset="1" stop-color="#8da8c5"/></linearGradient><linearGradient id="ol-metal"><stop stop-color="#edf0f1"/><stop offset=".3" stop-color="#c9cfd4"/><stop offset=".75" stop-color="#c0c6cc"/><stop offset="1" stop-color="#929ca7"/></linearGradient></defs>' +
      drawings[name] +
      '</svg>';
    parent.append(e);
    return e;
  }
  const palette = { bg: '#6383a3', panel: '#c4c6c7', fg: '#000000', muted: '#66717e', line: '#777777' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      if (_c.display === 'panel' && _c.W < 1100) _c.display = 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const ctx = _c.ctx;
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const tools = u.el('aside', 'ol-pane ol-tools', document.body);
      const th = u.el('div', 'ol-ph', tools);
      icon(th, 'tools');
      u.el('span', '', th, 'Tools');
      icon(th, 'pin');
      [
        ['select', 'Select', 1],
        ['text', 'Text'],
        ['zoom', 'Zoom'],
        ['pan', 'Pan'],
      ].forEach((r) => {
        const t = u.el('div', 'ol-tool' + (r[2] ? ' sel' : ''), tools);
        icon(t, r[0]);
        u.el('span', '', t, r[1]);
      });
      const places = u.el('aside', 'ol-pane ol-places', document.body);
      const ph = u.el('div', 'ol-ph', places);
      icon(ph, 'pin');
      u.el('span', '', ph, 'Places');
      u.el('span', '', ph, '≡');
      ['Home', 'Documents', 'Work'].forEach((t) => {
        const d = u.el('div', 'ol-icon', places);
        icon(d, t === 'Home' ? 'home' : 'folder');
        u.el('span', '', d, t);
      });
      const help = u.el('aside', 'ol-pane ol-help', document.body);
      const hh = u.el('div', 'ol-ph', help);
      icon(hh, 'pin');
      u.el('span', '', hh, 'Help');
      u.el('span', '', hh, '≡');
      const hd = u.el('div', 'ol-icon', help);
      icon(hd, 'help');
      u.el('span', '', hd, 'Help Topics');
      const trash = u.el('div', 'ol-trash', document.body);
      icon(trash, 'trash');
      u.el('span', '', trash, 'Trash');
      const tb = u.el('footer', 'ol-taskbar', document.body);
      const sun = u.el('span', 'ol-sun', tb);
      const mark = u.el('span', 'ol-sunmark', sun);
      mark.innerHTML =
        '<svg viewBox="-2 -2 52 52" fill="none" stroke="#282868" stroke-width="2.5">' +
        '<g transform="rotate(-45 24 24)">' +
        [0, 90, 180, 270]
          .map((a) => '<path transform="rotate(' + a + ' 24 24)" d="M8 5v18h16V5M12 5v14h8V5"/>')
          .join('') +
        '</g>' +
        '</svg>';
      u.el('span', '', sun, 'Sun');
      const task = u.el('span', 'ol-task', tb);
      icon(task, 'window');
      u.el('span', '', task, 'Topic Selection');
      const tray = u.el('span', 'ol-tray', tb);
      ['screen', 'volume'].forEach((n) => {
        const box = u.el('span', 'ol-tray-box', tray);
        icon(box, n);
      });
      u.el('span', 'ol-clock', tb, 'Mon Apr 6   10:24 AM');
      const win = u.el('div', 'ol-win', document.body);
      const top = u.el('header', 'ds-top', win);
      const brand = u.el('span', 'ds-brand', top);
      icon(brand, 'window');
      u.el('span', '', brand, 'Topic Selection');
      const wb = u.el('span', 'ol-wb', top);
      ['min', 'max'].forEach((n) => {
        const b = u.el('span', 'ol-title-button', wb);
        icon(b, n);
      });
      const nav = u.el('nav', 'ds-menu', win);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      const outer = u.el('div', 'ds-body', win);
      const content = u.el('div', 'ds-content', outer);
      Object.assign(_c, { win, top, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-header-note');
        const text = _c.util.el('div', 'ds-instruction', note, note.textContent);
        note.replaceChildren(text);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ol-controls');
      _c.top.insertBefore(_c.headerTools, _c.top.querySelector('.ol-wb'));
      if (_c.submit) _c.submit.classList.add('ol-header-submit');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
      if (_c.display === 'panel') _c.body.classList.add('ds-panel-mode');
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
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').textContent = '';
      _c.content.appendChild(foot);
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
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-choose-option-checkbox-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#96bada'],
      LOW_ACCENTS: ['#96bada'],
      parts,
    },
  });
})();
