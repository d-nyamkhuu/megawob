(function () {
  'use strict';
  const palette = { bg: '#fcfaf7', panel: '#fcfaf7', fg: '#282d34', muted: '#515b6a', line: '#d6d6d6' };
  const paths = {
    Code: 'm8 6-6 6 6 6 M16 6l6 6-6 6',
    OList: 'M9 5h13 M9 12h13 M9 19h13 M2 3h1v4 M2 10h2v2H2v2h2 M2 17h2v4H2 M2 19h2',
    Image: 'M2 3h20v18H2Z M4 18l5-7 4 5 3-3 5 5 M15 8h.1',
    Link: 'm10 14 4-4 M8 12l-3 3a4 4 0 0 0 6 6l4-4a4 4 0 0 0 0-6 M16 12l3-3a4 4 0 0 0-6-6l-4 4a4 4 0 0 0 0 6',
    List: 'M8 5h14 M8 12h14 M8 19h14 M2 5h1 M2 12h1 M2 19h1',
  };
  function drawToolbar(u, toolbar) {
    const groups = { a: ['Normal Text'], b: ['B', 'I', 'U', 'Code'], c: ['List', 'OList'], d: ['Link'], e: ['Image'] };
    for (const [label, items] of Object.entries(groups)) {
      const g = u.el('div', 'ribbon-group', toolbar);
      u.el('strong', 'ribbon-label', g, label);
      const row = u.el('div', 'ribbon-row', g);
      for (const item of items) {
        const b = u.el('div', 'ribbon-tool', row);
        if (paths[item]) b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="' + paths[item] + '"/></svg>';
        else u.el('span', 'tool-symbol', b, item.length === 1 ? item : '');
        u.el('span', '', b, item);
      }
    }
  }
  function styleControls(parent) {
    parent.querySelectorAll('.ref-submit').forEach((el) => el.classList.add('submit'));
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The notebook's instruction shelf also supports panel notes on narrow screens.
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
      document.body.classList.add('ref', 'electron', 'board');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, 'Notebook');
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML = '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const noteShelf = u.el('div', 'note-shelf', head);
      const toolbar = u.el('div', 'tools', head);
      drawToolbar(u, toolbar);
      Object.assign(_c, { shell, head, header: noteShelf, toolbar });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      styleControls(_c.headerTools);
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'work', _c.shell);
      const center = _c.util.el('section', 'center', body);
      Object.assign(_c, { body, center });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const note = _c.header.querySelector('.ref-panel');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.center.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      const ready = foot.querySelector('.ref-foot-text');
      ready.className = 'ready';
      ready.textContent = 'Ln 1, Col 1';
      _c.util.el('span', 'ready-type', ready, 'Plain Text');
      const saved = _c.util.el('span', 'saved', foot, 'Saved 10:24 AM');
      foot.insertBefore(saved, foot.querySelector('.ref-tools'));
      styleControls(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.foot.appendChild(dock);
        styleControls(dock);
      }
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-click-control-link-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { 'design-click-control-link-01': palette }, LOW_THEME: palette, ACCENTS: ['#0055ed'], LOW_ACCENTS: ['#0055ed'], parts },
  });
})();
