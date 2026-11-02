(function () {
  'use strict';
  const documentIcon =
    '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M2 2h27v27H2z" fill="#ddd" stroke="#222"/><path d="M4 4h23v23H4z" fill="#fff" stroke="#234cb7" stroke-width="2"/><path d="M5 5h21v4H5z" fill="#2455bd"/><path d="M7 12h17M7 15h10M7 18h16M7 22h11M7 25h16" stroke="#777"/><path d="M21 10h4v4h-4z" fill="#2695ce"/><path d="M17 16h8v6h-8z" fill="#d92918"/><path d="M18 18h5v3h-5z" fill="#eece4e"/><path d="M24 20h4v4h-4z" fill="#336dd6"/></svg>';
  const appIcon =
    '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 2h23l4 5v23H3z" fill="#fff" stroke="#222"/><path d="M5 4h20v4H5z" fill="#285cc6"/><path d="M7 12h19M7 15h12M7 18h17M7 22h11M7 25h13" stroke="#777"/><path d="M21 16h8v9h-8z" fill="#ddd" stroke="#444"/><path d="M23 19h4v4h-4z" fill="#e33"/><path d="M26 2v6h4" fill="none" stroke="#222"/></svg>';
  const flowerIcon =
    '<svg viewBox="0 0 42 38" aria-hidden="true"><path d="M1 1h40v36H1z" fill="#aaa" stroke="#444"/><g stroke="#333" stroke-width=".8"><path d="M20 18C5 7 8 3 18 10C23-6 28 2 24 13C42 6 40 15 27 19C43 22 36 29 25 24C28 41 20 37 20 26C6 37 5 28 14 23C-1 22 3 14 16 17z" fill="#eac600"/><path d="M17 18L12 8L17 6L22 18L23 7L28 8L25 19L35 14L37 19L26 22L34 28L30 33L23 24L20 34L16 34L18 23L6 28L4 24L16 20L5 15L9 11z" fill="#1579dc"/><path d="M18 19L16 9L21 8L22 19L30 12L33 16L25 22L29 32L24 33L21 24L11 29L9 25z" fill="#1ac12c"/><path d="M20 18h5v8h-5z" fill="#ec2525"/></g></svg>';
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'riscos');
      const shell = u.el('div', 'shell', document.body);
      const tb = u.el('div', 'titlebar', shell);
      u.el('span', 'tb-icon', tb).innerHTML = documentIcon;
      u.el('span', 'tb-title', tb, 'Card Sort');
      const closeGadget = u.el('span', 'tb-close', tb, '×');
      const page = u.el('div', 'page display-' + _c.display, shell);
      Object.assign(_c, { shell, tb, closeGadget, page, header: page });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.page.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('task-note');
        const text = _c.util.el('div', 'instruction', note);
        text.textContent = note.firstChild.textContent;
        note.firstChild.remove();
      }
      const spacer = _c.page.querySelector('.ref-spacer');
      if (spacer) spacer.remove();
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tb;
      base(_c);
      _c.header = header;
      _c.tb.insertBefore(_c.headerTools, _c.closeGadget);
    },
    'frame.body': () => (_c) => { _c.body = _c.page; },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.page.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note', 'instruction-panel');
        panel.querySelector('.ref-panel-title').classList.add('note-title');
        panel.querySelector('.ref-panel-text').classList.add('instruction');
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
        note.classList.add('task-note', 'instruction-toast');
        note.querySelector('.ref-note-text').classList.add('instruction');
        note.querySelector('.ref-note-x').classList.add('note-close');
        _c.page.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('footer');
      footer.querySelector('.ref-foot-text').remove();
      _c.page.appendChild(footer);
      if (!_c.ctx.finish) {
        const clr = _c.util.el('button', 'clearall', footer);
        _c.util.el('span', 'control-caption', clr, 'Clear All');
        clr.type = 'button';
        clr.onclick = () => env.log('clear-all', {});
        footer.insertBefore(clr, footer.firstChild);
      }
      _c.footer = footer;
      const u = _c.util;
      const bar = u.el('div', 'iconbar', _c.shell);
      const a = u.el('div', 'ib-item ib-os', bar);
      u.el('span', 'ib-ico star', a).innerHTML = flowerIcon;
      u.el('span', '', a, 'RISC OS');
      const b = u.el('div', 'ib-item ib-app', bar);
      u.el('span', 'ib-ico doc', b).innerHTML = appIcon;
      u.el('span', '', b, 'Card Sort');
      u.el('div', 'ib-fill', bar);
      const clock = u.el('div', 'ib-clock', bar);
      u.el('span', 'clock-caption', clock, '10:24');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.insertBefore(dock, _c.footer.firstChild);
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
  const palette = { bg: '#d0d0d0', panel: '#f0eee8', fg: '#000000', muted: '#222222', line: '#444444' };
  env.site({
    name: 'design-reorder-items-kanban-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-reorder-items-kanban-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2a5ad0'],
      LOW_ACCENTS: ['#2a5ad0'],
      parts,
    },
  });
})();
