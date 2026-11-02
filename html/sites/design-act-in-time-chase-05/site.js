(function () {
  'use strict';
  const palette = { bg: '#252b2f', panel: '#fbf9f3', fg: '#202830', muted: '#888b8c', line: '#ddd9d0' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All four note locations fit this notebook at every training viewport.
      _c.display = _c.ctx.display || 'header';
    },
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
      u.el('span', 'ds-brand', top, 'FocusPad');
      const menu = u.el('nav', 'ds-menu', top);
      ['File', 'Edit', 'View', 'Window', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const meta = u.el('div', 'ds-window-meta', top);
      ['−', '□', '×'].forEach((t) => {
        const b = u.el('button', '', meta, t);
        b.type = 'button';
      });
      const shell = u.el('div', 'ds-shell', document.body);
      const tabs = u.el('nav', 'ds-tabs', shell);
      [
        ['Tasks', 'orange'], ['Notes', 'cream'], ['Journal', 'blue'],
        ['Sketches', 'green'], ['Archive', 'mauve'],
      ].forEach(([name, color], i) => {
        const t = u.el('div', 'ds-tab ds-tab-' + color + (i === 0 ? ' active' : ''), tabs, name);
        t.setAttribute('aria-current', i === 0 ? 'page' : 'false');
      });
      const paper = u.el('section', 'ds-paper', shell);
      paper.dataset.display = _c.display;
      const head = u.el('div', 'ds-paper-head', paper);
      u.el('span', '', head, 'Task 1');
      u.el('span', '', head, 'Apr 24, 2018');
      Object.assign(_c, { paper, header: head });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.display === 'header'
        ? _c.util.el('div', 'ds-instruction-row', _c.paper) : _c.paper;
      base(_c);
      _c.header = header;
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'ds-main', _c.paper);
      const brief = _c.util.el('aside', 'ds-brief', body);
      Object.assign(_c, { body, brief });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.brief;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.paper.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.classList.add('ds-footer');
        _c.brief.appendChild(foot);
      }
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-act-in-time-chase-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-chase-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#ff8746'],
      LOW_ACCENTS: ['#ff8746'],
      parts,
    },
  });
})();
