/* Climate Control: a design on the shared site frame. */
(function () {
  'use strict';
  function icon(parent, name) {
    const svg = env.util.svg('svg', { viewBox: '0 0 32 40', 'aria-hidden': 'true' }, parent);
    if (name === 'temperature') {
      env.util.svg('path', { d: 'M11 24V7a5 5 0 0 1 10 0v17a10 10 0 1 1-10 0Z', fill: 'none', stroke: '#00a5f4', 'stroke-width': 2.6, 'stroke-linejoin': 'round' }, svg);
      env.util.svg('path', { d: 'M16 10v19m0-3a6 6 0 1 0 0 12a6 6 0 0 0 0-12M24 10h3m-3 5h3m-3 5h3', fill: 'none', stroke: '#00a5f4', 'stroke-width': 2.5, 'stroke-linecap': 'round' }, svg);
    } else {
      svg.setAttribute('viewBox', '0 0 32 32');
      env.util.svg('path', { d: 'M13 3h6l1 4 3 2 4-1 3 5-3 3v3l3 3-3 5-4-1-3 2-1 4h-6l-1-4-3-2-4 1-3-5 3-3v-3l-3-3 3-5 4 1 3-2Z', transform: 'translate(2 0) scale(.88)', fill: 'none', stroke: 'currentColor', 'stroke-width': 3, 'stroke-linejoin': 'round' }, svg);
      env.util.svg('circle', { cx: 16, cy: 16, r: 4.1, fill: 'none', stroke: 'currentColor', 'stroke-width': 2.5 }, svg);
    }
  }
  function overlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'utility-notice notice-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const text = {
      cookie: ['Privacy preferences', 'Choose your cookie preferences for this utility.', 'Accept', 'Reject optional'],
      toast: ['Settings saved', 'Your climate workspace is ready.', null, 'Dismiss'],
      chat: ['Climate Control help', 'Drag the blue marker around the dial to adjust the current value.', null, 'Close help'],
      promo: ['Climate Control', 'Explore more controls after this session.', null, 'Not now'],
      banner: ['Workspace notice', 'This climate control utility works offline.', null, 'Dismiss'],
    }[ctx.kind];
    u.el('h2', '', el, text[0]);
    u.el('p', '', el, text[1]);
    const actions = u.el('div', 'notice-actions', el);
    if (text[2]) {
      const accept = u.el('button', 'notice-primary', actions, text[2]);
      accept.type = 'button'; accept.onclick = () => ctx.dismiss('accept');
    }
    const dismiss = u.el('button', 'notice-dismiss', actions, text[3]);
    dismiss.type = 'button'; dismiss.onclick = () => ctx.dismiss('dismiss');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  const palette = { bg: '#eef3f9', panel: '#f4f7fc', fg: '#0b1220', muted: '#52617c', line: '#d0d9e6' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('climate-control', 'instruction-' + _c.display);
      const header = u.el('header', 'utility-header', document.body);
      const logo = u.el('div', 'utility-logo', header); icon(logo, 'temperature');
      u.el('span', 'utility-title', header, 'Climate Control');
      const settings = u.el('button', 'settings-button', header);
      settings.type = 'button'; settings.setAttribute('aria-label', 'Settings'); icon(settings, 'settings');
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'climate-body', document.body);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'climate-stage', _c.body);
      _c.stage.dataset.role = 'stage';
    },
    overlay: () => overlay,
  };
  env.site({
    name: 'design-rotate-object-dial-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#328dff'], LOW_ACCENTS: ['#328dff'],
      parts,
    },
  });
})();
