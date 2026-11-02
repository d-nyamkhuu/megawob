(function () {
  'use strict';
  const palette = { bg: '#1d132b', panel: '#21192e', fg: '#f5efff', muted: '#a9a1ba', line: '#473c53' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'Pointer Tracking Test');
      const meta = u.el('div', 'ds-window-meta', top);
      u.el('span', '', meta, 'Mon, Apr 27, 2026  10:14 AM');
      if (!_c.ctx.finish) ['−', '□', '×'].forEach((t) => {
        const b = u.el('button', '', meta, t);
        b.type = 'button';
      });
      const status = u.el('div', 'ds-chase-status', document.body);
      u.el('span', '', status, '●  Ready');
      const brief = u.el('aside', 'ds-brief');
      u.el('h2', '', brief, 'Tracking Task');
      const shelf = u.el('div', 'ds-footer');
      Object.assign(_c, { top, meta, status, brief, shelf, header: brief });
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
      if (_c.display === 'hidden') _c.brief.classList.add('ds-brief-hidden');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.shelf;
      base(_c);
      _c.header = header;
      const extras = _c.util.el('div', 'ds-extra-tools', _c.meta);
      _c.headerTools.querySelectorAll('.ref-xtra').forEach((b) => extras.appendChild(b));
      if (_c.placement === 'icon') _c.meta.appendChild(_c.headerTools);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const outer = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', outer);
      const main = u.el('div', 'ds-main', content);
      main.appendChild(_c.brief);
      content.appendChild(_c.shelf);
      Object.assign(_c, { body: main });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.brief;
      base(_c);
      _c.body = body;
      const note = _c.brief.querySelector('.ref-panel-text');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.brief.appendChild(note);
        note.querySelector('.ref-note-text').classList.add('ds-instruction', 'ds-instruction-toast');
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      _c.status.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.shelf.appendChild(dock);
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
    name: 'design-act-in-time-chase-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-chase-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ff716e'],
      LOW_ACCENTS: ['#ff716e'],
      parts,
    },
  });
})();
