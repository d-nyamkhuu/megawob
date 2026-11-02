(function () {
  'use strict';
  const ICON_APP =
    '<svg width="40" height="40" viewBox="0 0 40 40"><rect x="3" y="7" width="34" height="30" fill="#e8eefc" stroke="#12285f" stroke-width="3"/><rect x="3" y="7" width="34" height="8" fill="#2c4d9a" stroke="#12285f" stroke-width="3"/><rect x="9" y="2" width="4" height="9" fill="#12285f"/><rect x="27" y="2" width="4" height="9" fill="#12285f"/><path d="M8 20h5v4H8zM17 20h5v4h-5zM26 20h5v4h-5zM8 27h5v4H8zM17 27h5v4h-5zM26 27h5v4h-5z" fill="#6f87c4"/></svg>';
  const ICON_WARN =
    '<svg width="62" height="56" viewBox="0 0 62 56"><path d="M31 3 L59 53 H3 Z" fill="#ffc400" stroke="#1a1a1a" stroke-width="4" stroke-linejoin="miter"/><rect x="28" y="18" width="6" height="19" fill="#1a1a1a"/><rect x="28" y="41" width="6" height="6" fill="#1a1a1a"/></svg>';
  const ICON_DOC =
    '<svg width="36" height="36" viewBox="0 0 36 36"><path d="M7 3h17l6 6v24H7z" fill="#fff" stroke="#12285f" stroke-width="2.5"/><path d="M12 14h13M12 19h13M12 24h13M12 29h9" stroke="#12285f" stroke-width="2.5"/></svg>';
  function noteTitle(u, parent, text) {
    const h = u.el('h2', '', parent);
    u.el('span', '', h).innerHTML = ICON_DOC;
    u.el('span', '', h, text);
  }
  const palette = { bg: '#d9e1ef', panel: '#f6f2e1', fg: '#12285f', muted: '#5d6a8c', line: '#8e9bbd' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast' && _c.W < 1260) _c.display = 'header';
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
      u.el('span', 'ds-logo', top).innerHTML = ICON_APP;
      u.el('span', 'ds-brand', top, 'Task Manager');
      const tabs = u.el('nav', 'ds-tabs', top);
      ['Calendar Tools', 'My Tasks', 'Reports', 'Settings'].forEach((t, i) =>
        u.el('span', 'ds-tab' + (i === 0 ? ' on' : ''), tabs, t));
      const util = u.el('span', 'ds-util', top);
      ['Help', '|', 'Sign Out'].forEach((t) => u.el('span', '', util, t));
      const desk = u.el('div', 'ds-desk ds-display-' + _c.display, document.body);
      const dlg = u.el('section', 'ds-dialog', desk);
      const tb = u.el('div', 'ds-dtitle', dlg);
      u.el('span', '', tb, 'Select Date Range');
      u.el('span', 'ds-x', tb, '✕');
      const dbody = u.el('div', 'ds-dbody', dlg);
      u.el('div', 'ds-spacer', dbody);
      Object.assign(_c, { desk, dlg, tb, dbody, header: dbody });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-heading');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.tb;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.dbody;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.desk;
      base(_c);
      _c.body = body;
      const panel = _c.desk.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-title').remove();
        noteTitle(_c.util, panel, 'Task');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
        panel.appendChild(panel.querySelector('.ref-panel-text'));
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.dbody);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-brief', 'ds-task-toast');
        noteTitle(_c.util, note, 'Task reminder');
        const text = note.querySelector('.ref-note-text');
        text.classList.add('ds-instruction');
        note.appendChild(text);
        _c.desk.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('ds-footer');
        foot.querySelector('.ref-foot-text').remove();
        _c.dlg.appendChild(foot);
      }
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
      if (ctx.kind === 'banner') {
        const icon = u.el('span', 'ds-warn', el);
        icon.innerHTML = ICON_WARN;
        const text = u.el('div', 'ds-wtext', el);
        u.el('h2', '', text, 'Layout could not be restored.');
        u.el('p', '', text, 'Your previous layout could not be restored. Some elements may be out of place.');
      } else {
        const texts = {
          cookie: 'We use cookies to remember your preferences.',
          toast: 'Changes synced.',
          chat: 'Hello. How can we help?',
          promo: 'Try our new workspace.',
        };
        u.el('div', '', el, texts[ctx.kind]);
      }
      const dismiss = u.el(
        'button',
        '',
        el,
        ctx.kind === 'banner' ? 'Use default layout' : ctx.kind === 'cookie' ? 'Accept all' : 'Close',
      );
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-set-date-range-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'banner' },
    design: {
      THEMES: { 'design-set-date-range-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0f8a96'],
      LOW_ACCENTS: ['#0f8a96'],
      parts,
    },
  });
})();
