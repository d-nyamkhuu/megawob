(function () {
  'use strict';
  const palette = { bg: '#f2f1ed', panel: '#f2f1ed', fg: '#080808', muted: '#66707d', line: '#bbc2c9' };
  const svg = (p, w) => '<svg width="' + (w || 18) + '" height="' + (w || 18) + '" viewBox="0 0 18 18" fill="none" stroke="#111" stroke-width="1.5">' + p + '</svg>';
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original toast also fits the short desktop viewport.
      if (_c.ctx.display === 'toast') _c.display = 'toast';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const win = u.el('div', 'ev-win', document.body);
      const tb = u.el('div', 'ev-title', win);
      const ic = u.el('span', 'ev-ico', tb);
      ic.innerHTML = svg('<rect x="2" y="4" width="14" height="10"/><path d="M2 4l7 6 7-6"/>', 22);
      u.el('span', 'ev-name', tb, 'Newsletter Preferences');
      const wc = u.el('span', 'ev-wc', tb);
      wc.innerHTML = svg('<path d="M3 9h12"/>', 20) + svg('<rect x="3" y="3" width="12" height="12"/>', 20) + svg('<path d="M3 3l12 12M15 3L3 15"/>', 20);
      const mn = u.el('div', 'ev-menu', win);
      ['File', 'Edit', 'View', 'Help'].forEach((t) => {
        const s = u.el('span', '', mn);
        s.innerHTML = '<u>' + t[0] + '</u>' + t.slice(1);
      });
      const body = u.el('div', 'ds-body', win);
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      const surf = u.el('div', 'ev-surface', main);
      const hd = u.el('header', 'ev-head', surf);
      u.el('h1', '', hd, 'Email Settings');
      u.el('p', '', hd, 'Manage how often you receive emails from us.');
      Object.assign(_c, { win, body, content, main, surf, header: surf });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ev-instr');
    },
    'frame.tools': (base) => (_c) => {
      const foot = _c.util.el('footer', 'ds-footer', _c.surf);
      const header = _c.header;
      _c.header = foot;
      base(_c);
      _c.header = header;
      _c.foot = foot;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.surf;
      base(_c);
      _c.body = body;
      const panel = _c.surf.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ev-instr', 'ev-instr-panel');
        _c.surf.insertBefore(panel, _c.foot);
      }
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('main', 'ds-stage', _c.surf);
      _c.surf.insertBefore(stage, _c.foot);
      _c.stage = stage;
      const reset = _c.util.el('button', 'ds-reset', _c.foot, 'Cancel');
      reset.type = 'button';
      reset.addEventListener('click', () => {
        stage.querySelectorAll('input[type=radio]').forEach((el) => (el.checked = false));
      });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const sb = u.el('div', 'ev-status', _c.win);
      const g = u.el('span', 'ev-gear', sb);
      g.innerHTML = svg('<path stroke-linejoin="round" d="M7 2h4l.5 2 1.5.9 2-.5 2 3.2-1.5 1.5v1.8l1.5 1.5-2 3.2-2-.5-1.5.9-.5 2H7l-.5-2-1.5-.9-2 .5-2-3.2L2.5 10V8.2L1 6.7l2-3.2 2 .5 1.5-.9z"/><circle cx="9" cy="9" r="2.5"/>', 20);
      u.el('span', '', sb, 'Ready');
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      sb.appendChild(foot);
      u.el('span', 'ev-date', sb, 'Apr 24, 2025   10:17 AM');
      _c.status = sb;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.status.insertBefore(dock, _c.status.querySelector('.ev-date'));
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
    name: 'design-choose-option-radio-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { 'design-choose-option-radio-04': palette }, LOW_THEME: palette, ACCENTS: ['#111111'], LOW_ACCENTS: ['#111111'], parts },
  });
})();
