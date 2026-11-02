/* GTK Clearlooks "Image Adjuster" design on the shared site frame. */
(function () {
  'use strict';
  function lake(parent) {
    const img = env.util.el('img', 'lake', parent);
    img.src = 'sites/design-set-slider-range-09/assets/misty-lake.webp';
    img.alt = 'Misty lake and forest reflected in still water';
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'gtk-dialog overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const title = {chat: 'Feedback', cookie: 'Preferences', toast: 'Notice', promo: 'Support', banner: 'Service notice'}[ctx.kind];
    const bar = u.el('div', 'gd-title', el, title);
    const x = u.el('button', 'gd-x', bar, '×'); x.setAttribute('aria-label', 'Close notice'); x.onclick = () => ctx.dismiss(ctx.kind === 'cookie' ? 'reject' : 'close');
    u.el('p', '', el, {chat: 'Did you find this tool easy to use?', cookie: 'This application can remember your display preferences.', toast: 'The image is ready for editing.', promo: 'Try the new Image Adjuster extras.', banner: 'Adjustments are available offline.'}[ctx.kind]);
    const dismiss = u.el('button', 'gd-ok', el, ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
    dismiss.type = 'button'; dismiss.onclick = () => ctx.dismiss(ctx.kind === 'cookie' ? 'reject' : 'close');
    return {el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0};
  }
  const palette = {bg: '#edeae3', panel: '#f6f4ef', fg: '#222', muted: '#333', line: '#c4c1ba'};
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('gtk');
      const win = u.el('div', 'win', document.body);
      const tb = u.el('header', 'titlebar', win);
      const ic = u.el('span', 'tb-icon', tb);
      const icon = u.svg('svg', {viewBox: '0 0 20 20', width: '100%', height: '100%'}, ic);
      u.svg('path', {d: 'M5 3h10M5 17h10M6 4l2 6-2 6m8-12-2 6 2 6M9 4v12m2-12v12', fill: 'none', stroke: '#93958f', 'stroke-width': 1}, icon);
      u.el('span', 'tb-title', tb, 'Image Adjuster');
      const ctl = u.el('span', 'tb-btns', tb);
      u.el('i', 'tb-b min', ctl, '_'); u.el('i', 'tb-b max', ctl, '□'); u.el('i', 'tb-b close', ctl, '✕');
      const menu = u.el('nav', 'menubar', win);
      for (const m of ['File', 'Edit', 'View', 'Help']) u.el('span', '', menu, m);
      Object.assign(_c, {win, header: menu});
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.win;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.win;
      const pic = _c.util.el('div', 'picture', _c.body);
      lake(pic);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.win.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.win.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.win.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-set-slider-range-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: {'design-set-slider-range-09': palette},
      LOW_THEME: palette,
      ACCENTS: ['#4a88c7'],
      LOW_ACCENTS: ['#4a88c7'],
      parts,
    },
  });
})();
