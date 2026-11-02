(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#000000', muted: '#000000', line: '#888888' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Every note display uses the notebook's existing task box.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'notebook');
      const shell = u.el('div', 'shell', document.body);
      const tabs = u.el('nav', 'notebook-tabs', shell);
      for (const name of ['Activity', 'Notes', 'Resources', 'Calendar', 'Help']) {
        const tab = u.el('button', 'notebook-tab' + (name === 'Activity' ? ' active' : ''), tabs, name);
        tab.type = 'button';
        tab.onclick = () => env.log('notebook-tab', { name });
      }
      const rings = u.el('div', 'binding', shell);
      rings.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < 19; i++) {
        const ring = u.el('div', 'binding-ring', rings);
        ring.innerHTML =
          '<svg viewBox="0 0 72 36"><defs><linearGradient id="metal' +
          i +
          '" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#42423f"/><stop offset=".3" stop-color="#999a97"/><stop offset=".52" stop-color="#d2d3cf"/><stop offset=".7" stop-color="#666763"/><stop offset="1" stop-color="#30312e"/></linearGradient></defs><ellipse cx="62" cy="17" rx="9" ry="11" fill="#333431"/><path d="M61 17C51 8 11 7 8 18C3 31 38 29 57 27" fill="none" stroke="#363732" stroke-width="12"/><path d="M61 17C51 8 11 7 8 18C3 31 38 29 57 27" fill="none" stroke="url(#metal' +
          i +
          ')" stroke-width="8"/><path d="M55 12C43 9 19 9 12 14" fill="none" stroke="#e1e1dd" stroke-width="2"/></svg>';
      }
      const page = u.el('div', 'page', shell);
      const header = u.el('header', 'task-note', page);
      header.classList.toggle('instruction-panel', _c.display === 'panel');
      header.classList.toggle('instruction-toast', _c.display === 'toast');
      Object.assign(_c, { shell, page, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.header.hidden = _c.display === 'hidden';
    },
    'frame.body': () => (_c) => {
      _c.body = _c.page;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const panel = _c.header.querySelector('.ref-panel');
      if (panel) {
        panel.querySelector('.ref-panel-text').classList.add('instruction');
        _c.header.insertBefore(panel, _c.headerTools);
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.page);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.querySelector('.ref-note-text').classList.add('instruction');
        _c.header.insertBefore(note, _c.headerTools);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      if (_c.display === 'hidden' && _c.headerTools.children.length) {
        const tools = foot.querySelector('.ref-tools');
        while (_c.headerTools.firstChild) tools.prepend(_c.headerTools.lastChild);
      }
      if (_c.ctx.finish && !foot.querySelector('.ref-xtra')) foot.classList.add('footer-finish');
      _c.page.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'obstruction obstruction-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const titles = {
        cookie: 'Privacy notice',
        toast: 'Changes saved',
        chat: 'Help',
        promo: 'Notebook news',
        banner: 'Notice',
      };
      u.el('h3', '', box, titles[ctx.kind] || 'Notice');
      u.el(
        'p',
        '',
        box,
        ctx.kind === 'cookie'
          ? 'Allow optional cookies for this page?'
          : 'You can close this note to return to the activity.',
      );
      const dismiss = u.el('button', 'dismiss', box, ctx.kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-reorder-items-kanban-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-reorder-items-kanban-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#555555'],
      LOW_ACCENTS: ['#555555'],
      parts,
    },
  });
})();
