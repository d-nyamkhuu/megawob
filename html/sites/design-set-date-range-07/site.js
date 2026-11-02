(function () {
  'use strict';
  const palette = { bg: '#1b1e1f', panel: '#25292b', fg: '#e8eaed', muted: '#9aa0a8', line: '#363b43' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
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
      const dots = u.el('span', 'ds-dots', top);
      ['#ff5f57', '#febc2e', '#28c840'].forEach((c) => {
        u.el('i', '', dots).style.background = c;
      });
      u.el('span', 'ds-brand', top, 'Event Planner');
      const nav = u.el('nav', 'ds-menu', top);
      'File|Edit|View|Tools|Help'.split('|').forEach((t) => u.el('span', '', nav, t));
      const srch = u.el('span', 'ds-search', top);
      srch.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#c8ccd2" stroke-width="1.6"><circle cx="6.5" cy="6.5" r="4.7"/><path d="M10 10l4.2 4.2"/></svg>';
      u.el('span', '', srch, 'Search events');
      // The note is inserted into the content pane when the body section runs.
      const header = u.el('div', 'ds-note-slot');
      Object.assign(_c, { top, header });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      content.appendChild(_c.header);
      const main = u.el('div', 'ds-main', content);
      Object.assign(_c, { body: main, content });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.content.insertBefore(note, _c.body);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
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
    name: 'design-set-date-range-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#2f6fd0'],
      LOW_ACCENTS: ['#2f6fd0'],
      parts,
    },
  });
})();
