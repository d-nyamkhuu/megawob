/* GNOME libadwaita Video Settings, drawn on the shared site frame. */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  function svgEl(tag, attrs, parent) {
    const n = document.createElementNS(NS, tag);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function tuneIcon(parent) {
    const s = svgEl('svg', {viewBox: '0 0 48 48', class: 'tune', 'aria-hidden': 'true'}, parent);
    [[14, 30], [24, 14], [34, 28]].forEach(([y, x]) => {
      svgEl('line', {x1: 6, y1: y, x2: 42, y2: y, stroke: '#205db0', 'stroke-width': 3.5, 'stroke-linecap': 'round'}, s);
      svgEl('circle', {cx: x, cy: y, r: 4.2, fill: '#dbe9fb', stroke: '#205db0', 'stroke-width': 3}, s);
    });
  }
  function winBtn(parent, kind) {
    const b = env.util.el('span', 'wb', parent);
    const s = svgEl('svg', {viewBox: '0 0 16 16'}, b);
    if (kind === 'min') svgEl('path', {d: 'M3 8h10', stroke: '#222', 'stroke-width': 1.5}, s);
    if (kind === 'max') svgEl('rect', {x: 3.5, y: 3.5, width: 9, height: 9, fill: 'none', stroke: '#222', 'stroke-width': 1.5}, s);
    if (kind === 'close') svgEl('path', {d: 'M3.5 3.5l9 9M12.5 3.5l-9 9', stroke: '#222', 'stroke-width': 1.5}, s);
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'adw-dialog overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const title = {chat: 'We value your feedback', cookie: 'Your privacy matters', toast: 'Settings notice', promo: 'Try the new player', banner: 'Service notice'}[ctx.kind];
    u.el('h2', '', el, title);
    const body = {chat: 'Tell us how the video settings feel.', cookie: 'This app can remember your display preferences.', toast: 'Your changes are applied to this preview only.', promo: 'Discover more playback options.', banner: 'Video settings are available offline.'}[ctx.kind];
    u.el('p', '', el, body);
    const dismiss = u.el('button', 'suggested', el, ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('dismiss');
    return {el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0};
  }
  const palette = {bg: '#edf0f4', panel: '#f9fbfd', fg: '#0b1030', muted: '#646d84', line: '#dbe2ec'};
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All note modes fit in the original dedicated task heading.
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
      document.body.className = `adw instruction-${_c.display}`;
      const head = u.el('header', 'headerbar', document.body);
      const ico = u.el('span', 'app-icon', head);
      u.el('span', 'app-icon-screen', ico);
      u.el('h1', '', head, 'Video Settings');
      const toolbar = u.el('div', 'header-tools', head);
      const wc = u.el('div', 'wincontrols', head);
      winBtn(wc, 'min'); winBtn(wc, 'max'); winBtn(wc, 'close');
      const preview = u.el('section', 'preview-card', document.body);
      u.el('h2', '', preview, 'Preview');
      u.el('p', 'sub', preview, 'This is a preview of how your current settings affect the video.');
      const row = u.el('div', 'preview-row', preview);
      const pic = u.el('div', 'pic', row);
      const photo = u.el('img', 'scene', pic);
      photo.src = 'sites/design-set-slider-horizontal-04/assets/alpine-preview-v2.webp';
      photo.alt = 'Alpine mountains and forest reflected in a still lake at dusk';
      const cs = u.el('div', 'current', row);
      u.el('h3', '', cs, 'Current Settings');
      const dl = u.el('dl', '', cs);
      for (const [k, v, cls] of [['Resolution', '1920 × 1080'], ['Frame Rate', '60 fps'], ['Speed', '—', 'cs-speed'], ['Color Profile', 'Standard'], ['Audio', 'On']]) {
        u.el('dt', '', dl, k);
        u.el('dd', cls || '', dl, v);
      }
      const panel = u.el('section', 'task-panel', document.body);
      const top = u.el('div', 'task-top', panel);
      const circle = u.el('span', 'task-icon', top);
      tuneIcon(circle);
      Object.assign(_c, {toolbar, header: top, taskPanel: panel});
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.taskPanel; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'speed-card', _c.body);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.header.appendChild(note);
        note.querySelector('.ref-note-x').textContent = 'Close';
      }
    },
    'frame.footer': (base) => (_c) => {
      const actions = _c.util.el('div', 'actions', _c.body);
      const reset = _c.util.el('button', 'reset', actions, 'Reset');
      reset.type = 'button';
      reset.dataset.action = 'reset';
      base(_c);
      actions.appendChild(document.body.querySelector('.ref-foot'));
      _c.actions = actions;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.actions.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-set-slider-horizontal-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {THEMES: {'design-set-slider-horizontal-04': palette}, LOW_THEME: palette,
      ACCENTS: ['#247cff'], LOW_ACCENTS: ['#247cff'], parts},
  });
})();
