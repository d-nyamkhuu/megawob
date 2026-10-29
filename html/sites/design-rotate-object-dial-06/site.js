/* Navigation Console: ivory/ink modernist heading tool with a floating reference window. */
(function () {
  'use strict';
  function icon(parent, name, size = 24) {
    const paths = {
      close: 'M5 5L21 21M21 5L5 21', minimize: 'M5 14H21',
      map: 'M3 6L10 4L18 6L25 4V22L18 24L10 22L3 24ZM10 4V22M18 6V24',
      left: 'M10 6L4 12L10 18M4 12H16Q23 12 23 20',
      right: 'M18 6L24 12L18 18M24 12H12Q5 12 5 20',
      reset: 'M22 14A8 8 0 1 1 18 7M18 2V8H24',
    };
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, parent);
    env.util.svg('path', { d: paths[name], fill: 'none', stroke: 'currentColor', 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, svg);
    return svg;
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const content = {
      chat: ['Console notice', 'Heading telemetry is live. Use the dial to set the heading.', 'Got it', 'Dismiss'],
      cookie: ['Your privacy', 'Allow optional cookies for this console?', 'Accept optional', 'Reject optional'],
      toast: ['Settings saved', 'Your console preferences are stored.', null, 'Dismiss'],
      promo: ['More tools', 'Explore additional navigation tools.', 'Show details', 'Not now'],
      banner: ['Console notice', 'This session works offline.', null, 'Dismiss'],
    }[ctx.kind];
    u.el('h2', '', el, content[0]);
    const close = u.el('button', 'bubble-close', el);
    close.type = 'button'; close.setAttribute('aria-label', 'Close notice'); icon(close, 'close', 22);
    close.onclick = () => ctx.dismiss('close');
    u.el('p', '', el, content[1]);
    const actions = u.el('div', 'tour-actions', el);
    if (content[2]) {
      const primary = u.el('button', 'tour-primary', actions, content[2]); primary.type = 'button';
      primary.onclick = () => ctx.dismiss('accept');
    }
    const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('skip');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  function drawReference(u) {
    const ref = u.el('aside', 'ref-window', document.body);
    const rb = u.el('div', 'ref-bar', ref);
    icon(rb, 'map', 28);
    u.el('span', 'ref-title', rb, 'NAVIGATION  REFERENCE');
    const ra = u.el('div', 'ref-actions', rb);
    icon(ra, 'minimize', 26); icon(ra, 'close', 26);
    const tabs = u.el('div', 'ref-tabs', ref);
    ['COMPASS ROSE', 'COMMON HEADINGS', 'NOTES'].forEach((t, i) => u.el('span', i === 0 ? 'on' : '', tabs, t));
    const rbody = u.el('div', 'ref-body', ref);
    const rose = u.el('div', 'rose', rbody);
    const rs = u.svg('svg', { viewBox: '-80 -80 160 160', width: '100%', height: '100%', 'aria-hidden': 'true' }, rose);
    u.svg('circle', { r: 58, fill: 'none', stroke: '#111', 'stroke-width': 1.5 }, rs);
    u.svg('path', { d: 'M-26 -26L0 -8L26 -26L8 0L26 26L0 8L-26 26L-8 0Z', fill: '#b6b5b2' }, rs);
    u.svg('path', { d: 'M0 -50L9 -9L50 0L9 9L0 50L-9 9L-50 0L-9 -9Z', fill: '#111a20', stroke: '#111a20', 'stroke-width': .6 }, rs);
    u.svg('path', { d: 'M0 -50L0 0L-9 -9ZM50 0L0 0L9 -9ZM0 50L0 0L9 9ZM-50 0L0 0L-9 9Z', fill: '#f7f6f0' }, rs);
    [['N', 0, -66], ['S', 0, 74], ['E', 70, 5], ['W', -70, 5]].forEach(([t, x, y]) => {
      const tx = u.svg('text', { x, y, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, fill: '#111' }, rs);
      tx.textContent = t;
    });
    const tbl = u.el('div', 'bearings', rbody);
    const bearingsHead = u.el('div', 'b-head', tbl);
    u.el('span', 'condensed-chrome', bearingsHead, 'SELECTED BEARINGS');
    [['0°', 'North'], ['90°', 'East'], ['180°', 'South'], ['270°', 'West']].forEach(([a, b]) => {
      const r = u.el('div', 'b-row', tbl); u.el('span', '', r, a); u.el('span', '', r, b);
    });
  }

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This instrument has a dedicated status pane and an absolute notice slot at every size.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.remove('ref-has-note', 'instruction-header', 'instruction-panel', 'instruction-toast', 'instruction-hidden');
      document.body.classList.add('console', `instruction-${_c.display}`);
    },
    'frame.header': () => (_c) => {
      const { util: u } = _c;
      const win = u.el('div', 'main-window', document.body);
      const header = u.el('header', 'nav-bar', win);
      const logo = u.el('span', 'logo', header);
      const svg = u.svg('svg', { width: 30, height: 30, viewBox: '0 0 30 30', 'aria-hidden': 'true' }, logo);
      u.svg('path', { d: 'M15 5L23 23L15 19L7 23Z', fill: '#9eff2e' }, svg);
      u.el('span', 'app-name', header, 'NAVIGATION CONSOLE');
      u.el('i', 'bar-sep', header);
      const nav = u.el('nav', 'bar-nav', header);
      ['HEADING', 'WAYPOINTS', 'SYSTEM', 'LOGS'].forEach((t, i) => u.el('span', i === 0 ? 'on' : '', nav, t));
      const right = u.el('div', 'bar-right', header);
      u.el('span', 'utc', right, '14:26 UTC');
      u.el('i', 'dot', right);
      u.el('span', 'online', right, 'ONLINE');
      const body = u.el('div', 'win-body', win);
      const left = u.el('section', 'left-pane', body);
      u.el('div', 'kicker', left, 'HEADING CONTROL');
      Object.assign(_c, { win, header, right, body, left });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base({ ..._c, header: _c.left });
      const heading = _c.left.querySelector('.ref-instruction');
      if (!heading) return;
      heading.classList.add('instruction');
      heading.textContent = '';
      const text = _c.util.el('span', 'instruction-text', heading, _c.ctx.instruction);
      const available = heading.clientWidth - parseFloat(getComputedStyle(heading).paddingLeft) * 2;
      text.style.transform = `scaleX(${Math.min(.76, available / text.offsetWidth)})`;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.right.append(_c.headerTools);
    },
    'frame.body': () => (_c) => {
      const { body, left, util: u } = _c;
      const work = u.el('div', 'work', left);
      const side = u.el('div', 'center-col', work);
      u.el('div', 'lab', side, 'DIAL CONTROL');
      const help = u.el('div', 'dial-help', side);
      u.el('span', '', help, 'Drag the handle to adjust the value.');
      const row = u.el('div', 'btn-row', left);
      [['left', 'Rotate\nLeft', 'dark'], ['right', 'Rotate\nRight', 'dark'], ['reset', 'Reset', 'grey']].forEach(([ic, t, k]) => {
        const b = u.el('button', 'tool-btn ' + k, row); b.type = 'button';
        b.dataset.dialAction = ic;
        icon(b, ic, 30); u.el('span', '', b, t);
      });
      const status = u.el('aside', 'status-pane', body);
      Object.assign(_c, { work, side, status });
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.status });
      const { status, util: u } = _c;
      const panel = status.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('episode-note', 'episode-note-panel');
        panel.firstElementChild.classList.add('episode-note-title');
        panel.lastElementChild.classList.add('episode-note-text');
      }
      u.el('div', 'st-head', status, 'HEADING STATUS');
      [['Mode', 'Manual'], ['Units', 'Degrees (°)'], ['Range', '0° – 359°'], ['Resolution', '1°'], ['Control', 'Rotary']].forEach(([k, v], i) => {
        const r = u.el('div', 'st-row', status);
        u.el('span', '', r, k); u.el('span', i === 0 ? 'green' : '', r, v);
      });
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('main', 'cube-stage', _c.work);
      stage.dataset.role = 'stage';
      _c.stage = stage;
      drawReference(_c.util);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        note.classList.add('episode-note', 'episode-note-toast');
        note.firstElementChild.classList.add('episode-note-text');
        _c.body.append(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.querySelector('.ref-foot');
      if (foot) {
        for (const decoy of foot.querySelectorAll('.ref-xtra')) _c.headerTools.append(decoy);
        _c.side.append(foot);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.side.append(dock);
      if (_c.submit && ['footer', 'link', 'floating'].includes(_c.placement)) {
        _c.submit.classList.add('submit-button');
      }
    },
    // The existing overlays use the console's ivory, ink and lime window chrome.
    overlay: () => drawOverlay,
  };

  const theme = { bg: '#f6f5ef', panel: '#f6f5ef', fg: '#111', muted: '#555', line: '#3a3a3a' };
  env.site({
    name: 'design-rotate-object-dial-06',
    template: 'site/base',
    design: {
      THEMES: { console: theme },
      LOW_THEME: theme,
      ACCENTS: ['#9eff2e'],
      LOW_ACCENTS: ['#9eff2e'],
      LANGS: ['en'],
      parts,
    },
  });
})();
