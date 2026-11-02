(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#0a0a0a', muted: '#84858b', line: '#d4d6d9' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original frame reserves a task pane even at the smallest viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const page = u.el('div', 'sw-page', document.body);
      const left = u.el('div', 'sw-left', page);
      const head = u.el('header', 'sw-head', left);
      u.el('div', 'sw-num', head, '03');
      const ht = u.el('div', 'sw-headtext', head);
      u.el('div', 'sw-kicker', ht, 'Video settings');
      u.el('div', 'sw-sub', ht, 'Configure how videos are played');
      u.el('div', 'sw-rule', left);
      const right = u.el('aside', 'sw-right', page);
      const top = u.el('div', 'sw-task', right);
      if (_c.display === 'header') u.el('div', 'sw-legend', top, 'Your task');
      const toolbar = u.el('div', 'sw-toptools');
      const acts = u.el('div', 'sw-actions', right);
      const cancel = u.el('button', 'sw-cancel', acts, 'Cancel');
      cancel.type = 'button';
      Object.assign(_c, { page, left, right, top, toolbar, acts, cancel, header: top });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      _c.top.appendChild(_c.toolbar);
      const h = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.left;
    },
    'frame.panel': (base) => (_c) => {
      const b = _c.body;
      _c.body = _c.top;
      base(_c);
      _c.body = b;
      const panel = _c.top.querySelector('.ref-panel');
      if (panel) _c.top.insertBefore(panel, _c.toolbar);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.left);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.top.insertBefore(note, _c.toolbar);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.acts.insertBefore(foot, _c.cancel);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.acts.insertBefore(dock, _c.cancel);
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
    name: 'design-choose-option-dropdown-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#0080ff'],
      LOW_ACCENTS: ['#0080ff'],
      parts,
    },
  });
})();
