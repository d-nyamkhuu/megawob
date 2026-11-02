/* Carbon photo editor, using the shared frame controls and episode hooks. */
(function () {
  'use strict';
  const palette = { bg: '#101314', panel: '#272c2f', fg: '#eeeeee', muted: '#a6a9ac', line: '#676d71' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All note modes have a dedicated strip, including on smaller viewports.
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'carbon-editor instruction-' + _c.display;
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const menu = u.el('header', 'menu-bar', document.body);
      const logo = u.el('span', 'app-logo', menu);
      u.el('b', 'red', logo, 'P');
      logo.append('h');
      u.el('b', 'gold', logo, 'o');
      logo.append('to');
      u.el('b', 'green', logo, 'Ed');
      logo.append('it');
      for (const label of ['File', 'Edit', 'View', 'Image', 'Adjust', 'Window', 'Help'])
        u.el('span', 'menu-item', menu, label);
      const noteSlot = u.el('section', 'instruction-slot', document.body);
      noteSlot.hidden = _c.display === 'hidden';
      Object.assign(_c, { header: menu, noteSlot });
    },
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.noteSlot;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => { base(_c); },
    'frame.body': () => (_c) => { _c.body = document.body; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'editor-stage', _c.body);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.noteSlot.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const foot = u.el('footer', 'editor-footer', document.body);
      const layout = u.el('button', 'layout-icon', foot);
      layout.setAttribute('aria-label', 'Window layout');
      const svg = u.svg('svg', { viewBox: '0 0 30 30', 'aria-hidden': 'true' }, layout);
      for (const [x, y, w, h] of [[3, 3, 11, 11], [3, 17, 7, 10], [13, 17, 11, 10]])
        u.svg('rect', { x, y, width: w, height: h, fill: '#92b4cc' }, svg);
      u.svg('path', { d: 'M20 3H26V9M23 6H19', stroke: '#92b4cc', 'stroke-width': 2, fill: 'none' }, svg);
      u.el('span', 'file-name', foot, 'Mountains.jpg');
      u.el('span', 'file-dimensions', foot, '1024 × 576');
      const actions = u.el('div', 'footer-actions', foot);
      const reset = u.el('button', 'reset', actions, 'Reset');
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
    overlay: () => (ctx) => {
      const u = ctx.util;
      if (ctx.initial && ctx.kind === 'banner') {
        const warning = u.el('section', 'stale-warning', document.body);
        warning.setAttribute('role', 'dialog');
        warning.setAttribute('aria-label', 'Unsaved layout changes');
        const triangle = u.svg('svg', { viewBox: '0 0 64 62', class: 'warning-icon', 'aria-hidden': 'true' }, warning);
        u.svg(
          'path',
          {
            d: 'M27 6Q32 -2 37 6L61 50Q64 57 56 58H8Q0 58 4 50Z',
            fill: '#eed555',
            stroke: '#f9e68c',
            'stroke-width': 1.5,
          },
          triangle,
        );
        u.svg('path', { d: 'M30 19H35L34 39H31ZM30 45H35V50H30Z', fill: '#1c1d1a' }, triangle);
        const content = u.el('div', 'warning-content', warning);
        u.el('h2', '', content, 'Unsaved layout changes');
        u.el(
          'p',
          '',
          content,
          'You have unsaved layout changes. If you continue without saving, your layout changes will be discarded.',
        );
        const buttons = u.el('div', 'warning-actions', content);
        const cancel = u.el('button', '', buttons, 'Cancel');
        const proceed = u.el('button', 'continue', buttons, 'Continue without saving');
        const dismiss = () => ctx.dismiss('close');
        proceed.onclick = dismiss;
        cancel.onclick = dismiss;
        const x = u.el('button', 'warning-x', warning, '×');
        x.setAttribute('aria-label', 'Close warning');
        x.onclick = dismiss;
        return { el: warning, dismiss: proceed };
      }
      const el = u.el('aside', 'episode-notice', document.body);
      const titles = {
        cookie: 'Privacy preferences',
        toast: 'Image ready',
        chat: 'Need help?',
        promo: 'Explore more tools',
        banner: 'Workspace notice',
      };
      u.el('h2', '', el, titles[ctx.kind]);
      u.el('p', '', el, 'Continue editing the current photo. Your adjustments are kept in this session.');
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
      dismiss.onclick = () => ctx.dismiss('dismiss');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-set-slider-horizontal-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'banner' },
    design: {
      THEMES: { 'design-set-slider-horizontal-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#61b4ff'],
      LOW_ACCENTS: ['#61b4ff'],
      parts,
    },
  });
})();
