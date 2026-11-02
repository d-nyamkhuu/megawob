(function () {
  'use strict';
  const C = {
    site: 'design-set-date-time-12',
    app: 'Task Manager',
    menus: ['File', 'Edit', 'View', 'Window', 'Help'],
    rail: [
      ['Tasks', 'M8 3h12v22H8z M11 1h6v5h-6z'],
      ['Notes', 'M6 4h16v20H6z M9 10h10 M9 14h10 M9 18h6'],
      ['Files', 'M5 8h18v16H5z M5 12h18 M11 16h6'],
      [
        'Prefs',
        'M14 9a5 5 0 1 0 0 10a5 5 0 1 0 0-10z M14 3l2.500 3h-5z M14 25l2.500-3h-5z M3 14l3-2.500v5z M25 14l-3-2.500v5z M6 6l4.500 1-1.500 4z M22 22l-4.500-1 1.500-4z M22 6l-1 4.500-4-1.500z M6 22l1-4.500 4 1.500z',
      ],
    ],
    side: ['General', 'Appearance', 'Notifications', 'Date & Time', 'Shortcuts', 'Privacy', 'Network'],
  };
  const ICONS = [
    '<rect x="8" y="8" width="33" height="42" rx="1" fill="#984a36"/><rect x="11" y="10" width="27" height="37" fill="#fafafa"/><path d="M19 8V5h5V3h4v3h5v6H18V8z" fill="#ddd"/><path d="M15 18h19M15 23h19M15 28h19M15 33h19M15 38h19M15 43h19" stroke="#858585" stroke-width="1"/>',
    '<path d="M9 8h32v39H9z" fill="#f7f7f7"/><path d="M9 8l3-2h31l-2 41" fill="none"/><path d="M14 4v8M21 4v8M29 4v8M36 4v8" stroke-width="3"/><path d="M14 19l2 2 3-5M14 29l2 2 3-5M22 18h13M22 28h10M14 37h16" stroke="#666" stroke-width="1"/><path d="M29 45v-9l13-4-2 11z" fill="#b8c7d3"/><path d="M30 45l8-10" stroke-width="2"/>',
    '<path d="M10 8h29l3 39H7z" fill="url(#metal)"/><path d="M9 10h31v18H8zM8 29h34v17H7z" fill="url(#metal)"/><path d="M17 16h13v5H17zM17 34h13v5H17z" fill="#787b82"/><path d="M19 17h9M19 35h9M12 6h24v4H12z" stroke="#fff" stroke-width="1.5"/>',
    '<path d="M20 7l2-5h6l2 5 5 2 5-2 4 5-3 4 1 5 5 2v6l-5 2-2 5 2 5-5 4-4-3-5 1-2 5h-6l-2-5-5-2-5 2-4-5 3-4-1-5-5-2v-6l5-2 2-5-2-5 5-4 4 3z" fill="url(#metal)"/><circle cx="25" cy="26" r="10" fill="#f6f6f6"/><circle cx="25" cy="26" r="7" fill="#b6b8be" stroke="#777"/>',
  ];
  const palette = { bg: '#e7e7ea', panel: '#d4d4d8', fg: '#17191c', muted: '#53555b', line: '#888b92' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      let display = _c.ctx.display || 'header';
      if ((display === 'panel' && _c.W < 1100) || (display === 'toast' && _c.H < 680)) display = 'header';
      _c.display = display;
      document.body.classList.toggle('ref-has-note', display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const el = _c.util.el;
      const bar = el('header', 'mac-menubar', document.body);
      el('span', 'mac-apple', bar);
      const lg = el('span', 'mac-logo', bar);
      lg.innerHTML = '<svg viewBox="0 0 24 28"><path fill="#8aa6d6" stroke="#252b36" stroke-width="1.5" d="M12 8c1-4 3-6 6-6 0 3-2 5-5 6 4-2 8 1 8 2-4 2-4 6 0 8-2 5-4 8-7 8-2 0-2-1-4-1s-2 1-4 0C2 23 1 18 2 13c1-5 5-7 10-5z"/><path d="M5 11c1-2 3-2 5-2" fill="none" stroke="#e9eff9"/></svg>';
      el('b', 'mac-appname', bar, C.app);
      C.menus.forEach((m) => el('span', 'mac-menu', bar, m));
      el('span', 'mac-spacer', bar);
      el('span', 'mac-clock', bar, 'Mon Apr 22  10:24 AM');
      const vol = el('span', 'mac-vol', bar);
      vol.innerHTML = '<svg viewBox="0 0 24 20"><path fill="#333" d="M2 7h4l5-4v14l-5-4H2z"/><path fill="none" stroke="#333" stroke-width="1.600" d="M14 6c2 2 2 6 0 8M17 3c4 4 4 10 0 14"/></svg>';
      const win = el('div', 'mac-win', document.body);
      const tb = el('div', 'mac-title', win);
      const lights = el('div', 'mac-lights', tb);
      ['r', 'y', 'g'].forEach((c) => el('i', 'mac-light mac-' + c, lights));
      el('span', 'mac-ridge', tb);
      el('span', 'mac-ttext', tb, C.app);
      el('span', 'mac-ridge', tb);
      el('span', 'mac-zoom', tb);
      const body = el('div', 'mac-body', win);
      const rail = el('nav', 'mac-rail', body);
      C.rail.forEach((r, i) => {
        const it = el('div', 'mac-ri' + (i === 0 ? ' on' : ''), rail);
        const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        s.setAttribute('viewBox', '0 0 50 56');
        s.innerHTML = '<defs><linearGradient id="metal" x2="0" y2="1"><stop stop-color="#f4f4f6"/><stop offset=".5" stop-color="#b9bbc1"/><stop offset="1" stop-color="#e2e3e6"/></linearGradient></defs><g stroke="#343840" stroke-width="1.8" stroke-linejoin="round">' + ICONS[i] + '</g>';
        it.appendChild(s);
        el('span', '', it, r[0]);
      });
      const main = el('div', 'mac-main', body);
      const tabs = el('div', 'mac-tabs', main);
      const tPref = el('button', 'mac-tab on', tabs);
      el('span', '', tPref, 'Preferences');
      tPref.type = 'button';
      const tTask = el('button', 'mac-tab', tabs);
      el('span', '', tTask, 'Task');
      tTask.type = 'button';
      tTask.dataset.role = 'tab-task';
      const panel = el('div', 'mac-panel', main);
      const pref = el('div', 'mac-pref', panel);
      pref.dataset.role = 'preferences';
      const side = el('div', 'mac-side', pref);
      C.side.forEach((s, i) => el('div', 'mac-si' + (i === 0 ? ' on' : ''), side, s));
      const pc = el('div', 'mac-pc', pref);
      el('h2', '', pc, 'General Preferences');
      const r1 = el('div', 'mac-prow', pc);
      el('label', '', r1, 'User name:');
      el('div', 'mac-field', r1, 'Alex Chen');
      const r2 = el('div', 'mac-prow', pc);
      el('label', '', r2, 'Language:');
      const sel = el('div', 'mac-field mac-sel', r2, 'English');
      el('i', '', sel);
      el('hr', '', pc);
      [ ['Show start-up window', 1], ['Check for updates automatically', 1], ['Play notification sound', 0], ['Use compact mode', 0] ].forEach((c) => {
        const row = el('div', 'mac-chk', pc);
        el('i', c[1] ? 'on' : '', row);
        el('span', '', row, c[0]);
      });
      el('hr', '', pc);
      const r3 = el('div', 'mac-prow', pc);
      el('label', '', r3, 'Default view:');
      const s3 = el('div', 'mac-field mac-sel', r3, 'Tasks');
      el('i', '', s3);
      const prev = el('section', 'mac-prev', main);
      const pl = el('div', 'mac-prevl', prev);
      el('h3', '', pl, 'Task Preview');
      const pr = el('div', 'mac-prevr', prev);
      const msg = el('div', 'mac-m1', pr, 'Open the Task tab to complete this task.');
      const m2 = el('div', 'mac-m2', pr);
      m2.appendChild(document.createTextNode('The timer will start after you open the '));
      el('u', '', m2, 'Task');
      m2.appendChild(document.createTextNode(' tab.'));
      const tm = el('div', 'mac-timer', pr);
      el('span', '', tm, 'Timer:');
      const tv = el('span', 'mac-tv', tm, 'Paused');
      function show(task) {
        pref.style.display = task ? 'none' : '';
        tTask.classList.toggle('on', task);
        tPref.classList.toggle('on', !task);
        msg.textContent = task ? 'Complete the task in the Task tab.' : 'Open the Task tab to complete this task.';
        m2.style.visibility = task ? 'hidden' : '';
        tv.textContent = task ? 'Running' : 'Paused';
      }
      tTask.addEventListener('click', () => show(true));
      tPref.addEventListener('click', () => show(false));
      Object.assign(_c, { body, panel, pref, tabs, pl, pr, header: pl });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.pl.querySelector('.ref-instruction');
      if (note) note.classList.add('mac-note', 'mac-note-header');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tabs;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('mac-task-tools');
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.pl;
      base(_c);
      _c.body = body;
      const note = _c.pl.querySelector('.ref-panel');
      if (note) note.classList.add('mac-note', 'mac-note-panel');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.panel);
      _c.panel.insertBefore(_c.stage, _c.pref);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('mac-note', 'mac-note-toast');
        _c.pl.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.pr.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.pr.appendChild(dock);
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
      THEMES: { 'design-set-date-time-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#305f9e'],
      LOW_ACCENTS: ['#305f9e'],
      parts,
    },
  });
})();
