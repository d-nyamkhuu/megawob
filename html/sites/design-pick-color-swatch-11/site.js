(function () {
  'use strict';
  const RW = 1672, RH = 941;
  const pos = (el, x, y, w, h) => {
    el.style.left = (x / RW) * 100 + '%';
    el.style.top = (y / RH) * 100 + '%';
    el.style.width = (w / RW) * 100 + '%';
    el.style.height = (h / RH) * 100 + '%';
    return el;
  };
  const palette = { bg: '#8197a7', panel: '#d6dce1', fg: '#101113', muted: '#1c1d20', line: '#6d727c' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This frame has a dedicated note card even in the smallest viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'platinum');
      const shell = u.el('div', 'shell', document.body);
      const menu = pos(u.el('nav', 'menu-bar', shell), 0, 0, 1672, 40);
      const apple = u.el('span', 'apple', menu);
      apple.innerHTML = '<svg viewBox="0 0 30 36" aria-hidden="true"><defs><linearGradient id="apple-metal" x2="0" y2="1"><stop stop-color="#e2edf3"/><stop offset="1" stop-color="#607b91"/></linearGradient></defs><path d="M16 9c-1-5 3-7 6-8 1 4-2 7-6 8Zm-1 3c-4-4-9-2-11 2-4 7 1 18 6 19 3 1 4-2 7-1 4 3 7-2 9-7-6-3-6-9-1-12-4-4-7-3-10-1Z" fill="url(#apple-metal)" stroke="#17212b" stroke-width="1.6"/></svg>';
      const menus = u.el('div', 'menus', menu);
      for (const label of ['File', 'Edit', 'View', 'Window', 'Help']) {
        const b = u.el('button', 'menu-item', menus, label);
        b.type = 'button';
        b.onclick = () => env.log('menu', { label });
      }
      u.el('div', 'clock', menu, '10:24 AM');
      const badge = u.el('div', 'app-badge', menu);
      badge.innerHTML = '<svg viewBox="0 0 32 36" aria-hidden="true"><path d="M8 2h16l6 6v22l-6 4H8l-6-4V8Z" fill="#e2e8ec" stroke="#202830" stroke-width="2"/><path d="M10 6h12l5 5v15l-5 5H10l-5-5V11Z" fill="#9e9bde" stroke="#36437d"/><path d="M11 10h10v15H11z" fill="#b5d4ef" stroke="#33448d"/><path d="m15 10 4 3-2 5 3 3-5 3-3-6Z" fill="#8175d4" stroke="#333e83"/></svg>';
      u.el('div', 'app-name', menu, 'Color Matcher');
      pos(u.el('div', 'window', shell), 2, 42, 1668, 892);
      const title = pos(u.el('header', 'title-bar', shell), 12, 50, 1648, 40);
      u.el('div', 'close-box', title);
      u.el('div', 'title', title, 'Color Matcher');
      const zoom = u.el('div', 'zoom-dots', title);
      for (let i = 0; i < 3; i++) u.el('i', '', zoom);
      pos(u.el('div', 'zone', shell), 12, 92, 1280, 798);
      const status = pos(u.el('div', 'status-strip', shell), 12, 893, 1648, 38);
      const note = pos(u.el('section', 'task-note', shell), 34, 114, 1250, 194);
      u.el('div', 'brief-title', note, 'Match the Color');
      note.classList.toggle('instruction-hidden', _c.display === 'hidden');
      note.classList.toggle('instruction-panel', _c.display === 'panel');
      note.classList.toggle('instruction-toast', _c.display === 'toast');
      const toolbar = pos(u.el('div', 'picker-head', shell), 34, 326, 1250, 44);
      u.el('span', '', toolbar, 'Color Picker');
      Object.assign(_c, { shell, status, toolbar, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
      _c.util.el('div', 'brief-hint', _c.header, 'Color Matcher uses the Generic RGB display profile.');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      // Keep the shell as the coordinate system for the original fixed zones.
      _c.body = _c.shell;
    },
    'frame.panel': (base) => (_c) => {
      const b = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = b;
    },
    'frame.stage': () => (_c) => {
      const u = _c.util, shell = _c.shell;
      const stage = pos(u.el('main', 'stage', shell), 36, 372, 1246, 498);
      stage.dataset.role = 'stage';
      pos(u.el('section', 'feedback', shell), 1313, 103, 332, 777);
      const fbHead = pos(u.el('div', 'fb-head', shell), 1313, 103, 332, 44);
      u.el('span', '', fbHead, 'Feedback');
      pos(u.el('div', 'fb-label', shell, 'Color difference'), 1338, 190, 250, 30);
      pos(u.el('div', 'fb-label big', shell, 'ΔE00:'), 1338, 240, 100, 40);
      const delta = pos(u.el('div', 'difference-value', shell, '—'), 1435, 230, 182, 60);
      delta.dataset.role = 'color-difference';
      pos(u.el('div', 'fb-label small', shell, 'Goal: ≤ 4'), 1435, 302, 182, 28);
      pos(u.el('div', 'fb-rule', shell), 1333, 381, 293, 2);
      pos(u.el('div', 'fb-label', shell, 'Preview (side by side)'), 1338, 408, 280, 30);
      const pc = pos(u.el('div', 'preview-swatch', shell), 1344, 450, 129, 131);
      pc.dataset.role = 'preview-current';
      const pt = pos(u.el('div', 'preview-swatch', shell), 1488, 450, 129, 131);
      pt.dataset.role = 'preview-target';
      pos(u.el('div', 'fb-label small c', shell, 'Current'), 1344, 590, 129, 26);
      pos(u.el('div', 'fb-label small c', shell, 'Target'), 1488, 590, 129, 26);
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.status.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = '';
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.shell.appendChild(dock);
        pos(dock, 1338, 766, 285, 73);
      }
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      if (kind === 'chat') {
        const tour = pos(u.el('section', 'tour help-tour', document.body), 708, 104, 510, 196);
        tour.dataset.role = 'overlay';
        u.el('div', 'tour-tip', tour);
        u.el('div', 'tour-title', tour, 'Take a quick tour?');
        const x = u.el('button', 'tour-close', tour, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close tour');
        u.el('div', 'tour-copy', tour, 'We’ll highlight the main parts of Color Matcher in a few steps.');
        const start = u.el('button', 'tour-btn start', tour, 'Start tour');
        start.type = 'button';
        start.onclick = () => ctx.dismiss('start');
        const skip = u.el('button', 'tour-btn skip', tour, 'Skip tour');
        skip.type = 'button';
        skip.onclick = () => ctx.dismiss('skip');
        x.onclick = () => ctx.dismiss('close');
        return { el: tour, dismiss: skip, ttlSteps: 0 };
      }
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      u.el('h3', '', box,
        { cookie: 'Preferences', toast: 'Notice', chat: 'Help', promo: 'Reminder', banner: 'System notice' }[kind]);
      u.el('p', '', box, {
        cookie: 'Optional settings may be stored on this computer.',
        toast: 'Color Matcher is ready.',
        chat: 'Adjust the hue and saturation/value controls to match the target.',
        promo: 'Review the display profile before matching.',
        banner: 'Color Matcher is using the Generic RGB profile.',
      }[kind]);
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Use default settings' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-pick-color-swatch-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-pick-color-swatch-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2a3f8f'],
      LOW_ACCENTS: ['#2a3f8f'],
      parts,
    },
  });
})();
