(function () {
  'use strict';
  const C = {
    site: 'design-set-date-range-09',
    brand: 'Data Range',
    title: 'Report Generator',
    tag: 'Prepare your date range and generate the report.',
    heading: 'Date Range',
    intro: 'Select the start date and end date for your report.',
  };
  const ICONS = [
    '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="1.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/><rect x="11" y="13" width="3" height="3"/></svg>',
    '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="miter"><path d="M5 2h10l5 6v14H5z"/><path d="M14 2v7h6M8 12h9M8 16h9"/></svg>',
    '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square"><path d="M6 20V12M12 20V8M18 20V4"/></svg>',
    '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2.5l1.6 2.4 2.8-.6.7 2.8 2.7 1-.9 2.7 1.8 2.2-2.2 1.8.3 2.8-2.8.5-1.1 2.6-2.5-1.3-2.5 1.3-1.1-2.6-2.8-.5.3-2.8-2.2-1.8 1.8-2.2-.9-2.7 2.7-1 .7-2.8 2.8.6z"/></svg>',
  ];
  // Format the template's note, preserving the original black lead-in and red date.
  function styleNote(el, u) {
    if (!el) return;
    el.classList.add('ds-instruction');
    const t = el.textContent;
    const i = t.indexOf(': ');
    const date = t.match(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d|\b\d{4}-\d{2}-\d{2}/i);
    const split = i > 0 ? i + 1 : date && date.index > 0 ? date.index : 0;
    if (split) {
      el.textContent = t.slice(0, split).trim();
      u.el('br', '', el);
      u.el('span', 'bx-red', el, t.slice(split).trim());
    }
  }
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
      const u = _c.util;
      const left = u.el('aside', 'bx-left', document.body);
      const brand = u.el('div', 'bx-brand', left);
      u.el('span', 'bx-dot', brand);
      u.el('span', 'bx-name', brand, C.brand);
      const mainCol = u.el('div', 'bx-main', document.body);
      const head = u.el('header', 'bx-head', mainCol);
      u.el('span', 'bx-title', head, C.title);
      u.el('span', 'bx-tag', head, C.tag);
      const content = u.el('div', 'ds-content', mainCol);
      const rail = u.el('aside', 'bx-rail', document.body);
      ICONS.forEach((s, i) => {
        const b = u.el('div', 'bx-ico' + (i === 0 ? ' on' : ''), rail);
        b.innerHTML = s;
      });
      Object.assign(_c, { left, mainCol, head, content, header: head });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.left;
      base(_c);
      _c.header = header;
      styleNote(_c.left.querySelector('.ref-instruction'), _c.util);
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const intro = u.el('div', 'bx-intro', _c.content);
      u.el('h2', '', intro, C.heading);
      u.el('p', '', intro, C.intro);
      _c.body = u.el('div', 'ds-main ref-body', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.left;
      base(_c);
      _c.body = body;
      styleNote(_c.left.querySelector('.ref-panel-text'), _c.util);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.content.prepend(note);
        styleNote(note.querySelector('.ref-note-text'), _c.util);
      }
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
  const palette = { bg: '#fbfaf8', panel: '#fbfaf8', fg: '#111', muted: '#555', line: '#d9d7d3' };
  env.site({
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-range-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#cc1f26'],
      LOW_ACCENTS: ['#cc1f26'],
      parts,
    },
  });
})();
