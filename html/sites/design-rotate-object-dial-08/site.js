/* BeOS-style Oven Controller design on the shared site frame. */
(function () {
  'use strict';
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'beos-note overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const content = {
      chat: ['Welcome', 'Take a quick tour to learn the controls.', 'Start tour', 'Skip tour'],
      cookie: ['Your privacy', 'Allow optional cookies for this workspace?', 'Accept optional', 'Reject optional'],
      toast: ['Settings saved', 'Your current settings are ready to continue.', null, 'Dismiss'],
      promo: ['More utilities', 'Explore more controls after completing this task.', 'Show details', 'Not now'],
      banner: ['Notice', 'This utility works offline.', null, 'Dismiss'],
    }[ctx.kind];
    u.el('h2', '', el, content[0]);
    const close = u.el('button', 'bubble-close', el, '×');
    close.type = 'button'; close.setAttribute('aria-label', 'Close notice');
    close.onclick = () => ctx.dismiss('close');
    const message = u.el('p', '', el, content[1]);
    const actions = u.el('div', 'tour-actions', el);
    if (content[2]) {
      const primary = u.el('button', 'tour-primary', actions, content[2]); primary.type = 'button';
      primary.onclick = () => {
        if (ctx.kind === 'cookie') ctx.dismiss('accept');
        else { message.textContent = 'Drag the knob around its dial to the requested value.'; primary.hidden = true; }
      };
    }
    const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('skip');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }

  function glyph(parent, kind) {
    const s = env.util.svg('svg', { viewBox: '0 0 40 40', width: 40, height: 40, 'aria-hidden': 'true' }, parent);
    const p = (d, extra) => env.util.svg('path', Object.assign({ d, fill: 'none', stroke: '#222', 'stroke-width': 2.4 }, extra || {}), s);
    if (kind === 'temp') {
      p('M16 6a4 4 0 0 1 8 0V24a7 7 0 1 1-8 0Z');
      env.util.svg('circle', { cx: 20, cy: 29, r: 4, fill: '#222' }, s); p('M20 12V28');
    } else if (kind === 'timer') {
      env.util.svg('circle', { cx: 20, cy: 20, r: 15, fill: 'none', stroke: '#f2e6c8', 'stroke-width': 2.6 }, s);
      env.util.svg('path', { d: 'M20 10V21H28', fill: 'none', stroke: '#f2e6c8', 'stroke-width': 2.6 }, s);
    } else {
      p('M10 3q5 6 0 13t0 13M20 3q5 6 0 13t0 13M30 3q5 6 0 13t0 13', { 'stroke-width': 3 });
      p('M5 36H35', { 'stroke-width': 3 });
    }
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original reserves a dedicated band for every note mode, even on small screens.
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
      document.body.className = `beos-oven instruction-${_c.display}`;
      const win = u.el('div', 'win', document.body);
      const titlebar = u.el('header', 'titlebar', win);
      const tab = u.el('div', 'title-tab', titlebar);
      const lg = u.svg('svg', { viewBox: '0 0 30 24', width: 30, height: 24, 'aria-hidden': 'true' }, tab);
      u.svg('path', { d: 'M3 11L11 10L15 3L19 5L17 10L26 11L27 14L20 16L18 21L13 21L11 17L5 16Z M5 12L13 15L24 12 M12 17L19 17', fill: '#e4e4d8', stroke: '#222', 'stroke-width': 1.6 }, lg);
      u.el('span', '', tab, 'Oven Controller');
      const wa = u.el('div', 'window-actions', titlebar);
      for (const a of ['min', 'max', 'close']) {
        const b = u.el('button', 'window-action ' + a, wa); b.type = 'button'; b.setAttribute('aria-label', a);
        b.dataset.role = 'xtra'; b.onclick = () => env.log('decoy', { label: a });
      }
      const menu = u.el('nav', 'menubar', win);
      for (const m of ['File', 'Edit', 'View', 'Help']) {
        const item = u.el('span', '', menu, m);
        item.onclick = () => env.log('decoy', { label: m });
      }
      const tools = u.el('div', 'menu-tools', menu);
      const header = u.el('section', 'band band-instr', win);
      Object.assign(_c, { win, header, tools });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tools;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('section', 'band band-main', _c.win);
      const legend = u.el('div', 'legend', body);
      u.el('span', '', legend, 'Oven Settings'); u.el('i', '', legend);
      const list = u.el('ul', 'settings', body);
      [['temp', 'Temperature', '200 °C'], ['timer', 'Timer', '12 min'], ['mode', 'Mode', 'Convection']].forEach(([k, a, b]) => {
        const li = u.el('li', k === 'timer' ? 'sel' : '', list);
        glyph(li, k);
        const t = u.el('div', '', li);
        u.el('b', '', t, a); u.el('span', '', t, b);
      });
      Object.assign(_c, { body, list });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const list = _c.list;
      const stage = u.el('main', 'dial-stage', _c.body);
      stage.dataset.role = 'stage';
      const units = u.el('div', 'units', _c.body, 'Units: minutes');
      stage.showDialState = (label, value, unit) => {
        const selected = list.querySelector('.sel');
        if (selected.dataset.label !== label) {
          selected.dataset.label = label;
          const temperature = /temperature/i.test(label);
          selected.querySelector('svg').remove();
          glyph(selected, temperature ? 'temp' : 'timer');
          selected.prepend(selected.lastElementChild);
          const passive = list.firstElementChild;
          passive.querySelector('b').textContent = temperature ? 'Timer' : 'Temperature';
          passive.querySelector('span').textContent = temperature ? '12 min' : '200 °C';
          passive.querySelector('svg').remove();
          glyph(passive, temperature ? 'timer' : 'temp');
          passive.prepend(passive.lastElementChild);
        }
        selected.querySelector('b').textContent = label;
        selected.querySelector('span').textContent = value;
        units.textContent = 'Units: ' + (unit.trim() === 'min' ? 'minutes' : unit.trim() || 'degrees');
      };
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.querySelector('.ref-note-x').textContent = _c.closeLabel;
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('band', 'band-foot');
      _c.win.appendChild(foot);
      const led = u.el('i', 'led');
      foot.prepend(led);
      const status = foot.querySelector('.ref-foot-text');
      status.classList.add('status');
      status.textContent = 'Oven ready.';
      const reset = u.el('button', 'btn reset', null, 'Reset'); reset.type = 'button';
      reset.dataset.role = 'xtra'; reset.onclick = () => env.log('decoy', { label: 'Reset' });
      foot.insertBefore(reset, foot.querySelector('.ref-tools'));
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  const palette = { bg: '#d9d9d9', panel: '#e6e6e6', fg: '#111111', muted: '#555555', line: '#4a4a4a' };
  env.site({
    name: 'design-rotate-object-dial-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-rotate-object-dial-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1a3f94'],
      LOW_ACCENTS: ['#1a3f94'],
      parts,
    },
  });
})();
