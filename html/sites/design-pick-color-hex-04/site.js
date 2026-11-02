(function () {
  'use strict';
  const palette = { bg: '#222', panel: '#b4b4b4', fg: '#f2f2f2', muted: '#e8e8e8', line: '#555' };
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
      const u = _c.util;
      document.body.classList.add('design', 'nextstep');
      const shell = u.el('div', 'shell', document.body);
      const title = u.el('header', 'title-bar', shell);
      const appIcon = u.el('div', 'app-icon', title);
      appIcon.innerHTML =
        '<svg viewBox="0 0 92 78" aria-label="NeXT"><path fill="#070707" d="M20 9h53v42L39 72 20 40z"/><g fill="none" stroke="#eee" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" transform="rotate(-20 46 36)"><path d="M29 28v-9l9 9v-9 M41 24h10c0-9-12-8-11 0 0 8 8 8 11 4 M55 16l11 15m0-15L55 31 M32 36h13m-7 0v19 M48 36h16m-8 0v19"/></g></svg>';
      u.el('div', 'title', title, 'Color Studio');
      const controls = u.el('div', 'window-controls', title);
      for (const [label, name] of [['−', 'Minimize'], ['□', 'Maximize'], ['×', 'Close']]) {
        const b = u.el('button', 'window-button', controls, label);
        b.type = 'button';
        b.setAttribute('aria-label', name);
        b.onclick = () => env.log('window-control', { name });
      }
      const noteHost = u.el('div', 'note-host', shell);
      noteHost.hidden = _c.display === 'hidden';
      Object.assign(_c, { shell, title, header: noteHost });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const ribbon = u.el('nav', 'ribbon', _c.shell);
      _c.shell.insertBefore(ribbon, _c.header);
      const ICON = {
        New: '<path d="M7 3h8l5 5v13H7z M15 3v5h5 M10 11h7m-7 3h7m-7 3h7"/>',
        Open: '<path fill="currentColor" stroke="none" d="M3 5h7l2 3h10v2H5v10H3z M6 11h16v10H6z"/>',
        Save: '<path fill="currentColor" stroke="none" fill-rule="evenodd" d="M3 3h18v19H3z M7 4v7h11V4z M8 5h3v5H8z M6 14h12v2H6z M6 17h2v5H6z"/>',
        Print: '<path fill="currentColor" stroke="none" d="M6 3h12v6H6z M3 10h18v8h-4v4H7v-4H3z"/><path stroke="#b4b4b4" d="M5 12h14M8 16h8v4H8z"/>',
        Undo: '<path fill="currentColor" stroke="none" d="M11 3L3 10l8 5v-4c8-1 10 5 6 10 9-5 5-14-6-14z"/>',
        Redo: '<path fill="currentColor" stroke="none" d="M13 3l8 7-8 5v-4c-8-1-10 5-6 10-9-5-5-14 6-14z"/>',
        Picker: '<path fill="currentColor" stroke="none" d="M16 2c3-3 7 1 4 4l-3 3 2 2-2 2-3-3-8 9-4 2 2-4 8-9-2-2 2-2 2 2z"/>',
        Select: '<path d="M4 4h16v16H4z" stroke-dasharray="3 3"/>',
        Crop: '<path d="M7 2v15h15 M2 7h15v15"/>',
        Measure: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 2v5 M12 17v5 M2 12h5 M17 12h5"/>',
        Zoom: '<path d="M3 3h18v18H3z M3 9h18 M3 15h18 M9 3v18 M15 3v18"/>',
        Fit: '<path d="M3 5h18v14H3z M3 8h18"/>',
        Preferences: '<path fill="currentColor" stroke="none" fill-rule="evenodd" d="M10 2h4l1 3 3 1 3-1 2 4-3 2v3l3 2-2 4-3-1-3 1-1 3h-4l-1-3-3-1-3 1-2-4 3-2v-3L1 9l2-4 3 1 3-1z M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8"/>',
        Help: '<path stroke-width="4" d="M7 7c0-6 11-6 11 0 0 4-6 4-6 9"/><circle fill="currentColor" stroke="none" cx="12" cy="21" r="2"/>',
      };
      const GROUPS = [ ['File', ['New', 'Open', 'Save', 'Print']], ['Edit', ['Undo', 'Redo']], ['Tools', ['Picker', 'Select', 'Crop', 'Measure']], ['View', ['Zoom', 'Fit']], ['Options', ['Preferences', 'Help']] ];
      for (const [gname, items] of GROUPS) {
        const g = u.el('div', 'rb-group', ribbon);
        const row = u.el('div', 'rb-items', g);
        for (const it of items) {
          const b = u.el('button', 'rb-btn' + (it === 'Picker' ? ' on' : '') + (it === 'Undo' || it === 'Redo' ? ' dis' : ''), row);
          b.type = 'button';
          const ic = u.el('span', 'rb-icon', b);
          ic.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">' + ICON[it] + '</svg>';
          u.el('span', 'rb-label', b, it);
          b.onclick = () => env.log('menu', { label: it });
        }
        u.el('div', 'rb-gname', g, gname);
      }
    },
    'frame.instruction': (base) => (_c) => { base(_c); },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      // The shell itself supplies the grid body; notes are absolutely positioned.
      _c.body = _c.shell;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('footer');
      _c.shell.appendChild(footer);
      footer.querySelector('.ref-foot-text').remove();
      const status = u.el('section', 'status-section', footer);
      footer.prepend(status);
      u.el('span', 'status-led', status);
      u.el('span', 'status-ready', status, 'Ready');
      u.el('span', 'status-divider', status);
      u.el('span', 'status-copy', status, 'Generic RGB profile.');
      const delta = u.el('div', 'difference-value', footer, '—');
      delta.dataset.role = 'color-difference';
      delta.hidden = true;
      const action = footer.querySelector('.ref-tools');
      action.classList.add('action-section');
      const reset = u.el('button', 'reset', action, 'Reset');
      action.prepend(reset);
      reset.type = 'button';
      reset.onclick = () => env.log('menu', { label: 'Reset' });
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      u.el(
        'h3',
        '',
        box,
        {
          cookie: 'Console preferences',
          toast: 'Instrument notice',
          chat: 'Laboratory support',
          promo: 'Calibration reminder',
          banner: 'Workstation notice',
        }[kind],
      );
      u.el(
        'p',
        '',
        box,
        {
          cookie: 'Optional settings may be stored on this workstation.',
          toast: 'The calibration console is ready.',
          chat: 'Adjust the hue and saturation/value controls to match the target.',
          promo: 'Review the instrument profile before calibration.',
          banner: 'The instrument is operating with the Generic RGB profile.',
        }[kind],
      );
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Use default settings' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-pick-color-hex-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { 'design-pick-color-hex-04': palette }, LOW_THEME: palette, ACCENTS: ['#7aa7e0'], LOW_ACCENTS: ['#7aa7e0'], parts },
  });
})();
