(function () {
  'use strict';
  const NAV = ['Tasks', 'Notes', 'Calendar', 'Contacts', 'Settings'];
  const RINGS = [10.3, 17.3, 24.3, 37.5, 47.7, 57.7, 66.9, 77.8, 86];
  const shapes = {
    Tasks: '<path fill="currentColor" d="M6 5h20v26H6z"/><path d="M10 3v6m12-6v6M10 13h12m-12 5h12m-12 5h8" stroke="#eee8d8" stroke-width="2"/>',
    Notes: '<path d="M6 3h14l7 7v21H6zM20 3v8h7M10 15h12m-12 5h12m-12 5h10" fill="none" stroke="currentColor" stroke-width="2.5"/>',
    Calendar: '<rect x="4" y="7" width="25" height="24" rx="2" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M10 3v8m13-8v8M5 13h23" stroke="currentColor" stroke-width="3"/><path d="M9 17h3v3H9zm6 0h3v3h-3zm6 0h3v3h-3zM9 23h3v3H9zm6 0h3v3h-3zm6 0h3v3h-3z" fill="currentColor"/>',
    Contacts: '<ellipse cx="16" cy="10" rx="6" ry="7" fill="currentColor"/><path d="M4 31v-3c0-13 24-13 24 0v3z" fill="currentColor"/>',
    Settings: '<path d="M13 2h6l1 5 4 2 5-1 3 5-4 4v4l4 4-3 5-5-1-4 2-1 4h-6l-1-4-4-2-5 1-3-5 4-4v-4l-4-4 3-5 5 1 4-2z" fill="currentColor"/><circle cx="16" cy="18" r="6" fill="#eee8da"/>',
    pencil: '<path d="M5 23L22 4l7 6-17 19-9 3z" fill="currentColor"/><path d="M19 8l7 6M5 23l7 6" stroke="#ece4d3" stroke-width="2"/>',
    bulb: '<path d="M11 25c0-5-6-8-6-14a11 11 0 0 1 22 0c0 6-6 9-6 14M11 25h10m-10 4h10m-8 3h6M16 0v-4M0 11h-4m36 0h4M3 0l-3-3m29 3l3-3M13 24l-2-13 5 4 5-4-2 13" fill="none" stroke="currentColor" stroke-width="2"/>',
    leaf: '<path d="M7 30C2 15 18 7 30 2c0 17-8 26-20 25" fill="currentColor"/><path d="M4 35L25 8" fill="none" stroke="#765538" stroke-width="1.4"/>',
  };
  function icon(el, key) {
    el.innerHTML = '<svg viewBox="0 0 34 36" aria-hidden="true">' + shapes[key] + '</svg>';
  }
  function styleControls(parent) {
    parent.querySelectorAll('.ref-submit').forEach((el) => el.classList.add('ds-submit'));
    parent.querySelectorAll('.ref-endlink').forEach((el) => el.classList.add('ds-submit', 'ds-endlink'));
    parent.querySelectorAll('.ref-xtra').forEach((el) => el.classList.add('ds-xtra'));
  }
  const palette = { bg: '#583522', panel: '#f5eddc', fg: '#2a1d14', muted: '#82786b', line: '#c9b992' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      const compact = (_c.ctx.size ? _c.ctx.size.width : _c.W) < 1200;
      _c.display = _c.ctx.display === 'panel' && compact ? 'header' : (_c.ctx.display || 'header');
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
      icon(u.el('span', 'ds-leaf', top), 'leaf');
      u.el('span', 'ds-brand', top, 'My Organizer');
      const side = u.el('nav', 'ds-side', document.body);
      NAV.forEach((n, i) => {
        const it = u.el('div', 'ds-nav' + (i === 0 ? ' on' : ''), side);
        icon(u.el('span', 'ds-ico', it), n);
        u.el('span', '', it, n);
      });
      const quote = u.el('aside', 'ds-quote', document.body);
      u.el('span', 'ds-pin', quote);
      u.el('div', '', quote, '“A more organized day a brighter tomorrow.”');
      RINGS.forEach((t) => {
        const r = u.el('span', 'ds-ring', document.body);
        r.style.top = t + '%';
      });
      if (_c.display !== 'panel') {
        const today = u.el('aside', 'ds-today', document.body);
        u.el('div', 'ds-sh', today, 'Today');
        ['Review notes', 'Prepare slides', 'Follow up with team'].forEach((t) => {
          const l = u.el('div', 'ds-chk', today);
          u.el('span', 'ds-box', l);
          u.el('span', '', l, t);
        });
      }
      const tools = u.el('aside', 'ds-tools', document.body);
      u.el('div', 'ds-sh', tools, 'Quick Tools');
      [['pencil', 'Add Task'], ['Tasks', 'New Note'], ['Calendar', 'View Calendar']].forEach((t) => {
        const b = u.el('div', 'ds-tool', tools);
        icon(u.el('span', 'ds-tico', b), t[0]);
        u.el('span', '', b, t[1]);
      });
      const tip = u.el('aside', 'ds-tip', document.body);
      const tiphead = u.el('div', 'ds-sh', tip);
      icon(u.el('span', 'ds-tipicon', tiphead), 'bulb');
      u.el('span', '', tiphead, 'Tip');
      u.el('div', 'ds-tiptx', tip, 'Set a due date to keep your goals on track.');
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const head = u.el('div', 'ds-head', content);
      head.classList.toggle('ds-compact-heading', _c.display === 'panel' || _c.display === 'toast');
      u.el('span', 'ds-htitle', head, 'New Task');
      u.el('span', 'ds-hdate', head, 'Thu, Apr 24, 2025');
      const header = _c.display === 'header' ? u.el('aside', 'ds-header-note', content) : content;
      Object.assign(_c, { body, content, head, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = header;
      styleControls(_c.headerTools);
      _c.headerTools.querySelectorAll('.ref-submit').forEach((el) => el.classList.add('ds-submit-header'));
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = document.body;
      base(_c);
      _c.body = body;
      const panel = document.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-task-panel');
        const heading = panel.querySelector('.ref-panel-title');
        heading.classList.add('ds-sh');
        heading.textContent = 'Instructions';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.main = _c.util.el('div', 'ds-main', _c.content);
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.classList.toggle('ds-finish', !!_c.ctx.finish);
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      styleControls(foot);
      _c.content.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.foot.appendChild(dock);
        styleControls(dock);
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
    name: 'design-set-date-typed-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-typed-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#455b32'],
      LOW_ACCENTS: ['#455b32'],
      parts,
    },
  });
})();
