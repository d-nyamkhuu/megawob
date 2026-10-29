// Macintosh window chrome on the shared site frame.
(function () {
  'use strict';

  const palette = {
    bg: '#000000', panel: '#ffffff', fg: '#000000', accent: '#000000',
    font: 'monospace', line: '#000000', muted: '#000000', 'button-fg': '#000000',
  };

  function titlebar(u, parent, label, closeBox) {
    const title = u.el('div', 'mac-titlebar', parent);
    if (closeBox) u.el('i', '', title);
    u.el('span', '', title, label);
  }

  function styleTools(parent) {
    for (const b of parent.querySelectorAll('.ref-xtra')) b.classList.add('chrome-xtra');
    for (const b of parent.querySelectorAll('[data-role="submit"]')) {
      b.classList.add('end-control');
      if (b.classList.contains('ref-endlink')) b.classList.add('end-link');
    }
  }

  env.site({
    name: 'design-use-social-feed-menu-02',
    template: 'site/base',
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'frame-support.css', 'site.css'],
    design: {
      THEMES: { mac: palette }, LOW_THEME: palette,
      ACCENTS: ['#000000'], LOW_ACCENTS: ['#000000'],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          // Both instruction windows fit this design even at the smallest viewport.
          _c.display = _c.ctx.display;
          document.body.className = 'side-right instruction-' + _c.display;
        },
        'frame.header': () => (_c) => {
          const { util: u, ctx } = _c;
          const shell = u.el('div', 'site-shell', document.body);
          shell.classList.toggle('finish-mode', ctx.finish);
          const header = u.el('header', 'design-header', shell);
          const apple = u.el('div', 'design-brand', header);
          apple.innerHTML = '<svg viewBox="0 0 24 28"><path fill="black" d="M15 6c2-1 3-3 3-5-3 0-5 2-5 5zM19 16c-2-2-2-5 1-7-2-3-5-3-8-1-3-2-6-1-8 2-3 5 0 12 3 15 2 2 3 0 5 0s4 2 6 0c2-2 3-4 4-6-2 0-3-1-3-3z"/></svg>';
          Object.assign(_c, { shell, header });
        },
        'frame.nav': () => (_c) => {
          const { util: u, header } = _c;
          const nav = u.el('nav', 'design-nav', header);
          for (const label of ['File', 'Edit', 'View', 'Post', 'Window', 'Help']) u.el('span', '', nav, label);
          u.el('div', 'design-clock', header, 'Mon Apr 11  10:24 AM');
        },
        'frame.instruction': (base) => (_c) => {
          const { util: u, display } = _c;
          const note = u.el('section', 'task-note');
          note.dataset.role = 'instruction';
          note.hidden = display !== 'header' && display !== 'panel';
          if (!note.hidden) {
            // Reuse instruction handling, placing it in the reference's Task window.
            base({ ..._c, header: note, display: 'header' });
            const text = note.querySelector('.ref-instruction');
            const p = u.el('p', '', note);
            for (const part of text.textContent.split(/(@[\w]+)/)) {
              if (/^@[\w]+$/.test(part)) u.el('strong', '', p, part);
              else p.append(part);
            }
            text.remove();
          }
          titlebar(u, note, 'Task', false);
          _c.note = note;
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          styleTools(_c.headerTools);
        },
        'frame.body': () => (_c) => {
          _c.body = _c.util.el('div', 'design-body ref-body', _c.shell);
          _c.body.append(_c.note);
        },
        'frame.panel': () => () => {},
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('main', 'stage', _c.body);
          titlebar(_c.util, _c.stage, 'Chatter', true);
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const inherited = document.querySelector('.ref-foot');
          const footer = _c.util.el('footer', 'design-footer', _c.shell);
          if (inherited) {
            const tools = inherited.querySelector('.ref-tools');
            styleTools(tools);
            footer.append(tools);
            inherited.remove();
          }
          _c.footer = footer;
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) {
            styleTools(dock);
            _c.footer.append(dock);
          }
        },
        'frame.end': (base) => (_c) => {
          const { shell, note, footer, submit, placement, display, ctx } = _c;
          // The reference's upper end-control position is inside the Task window.
          const top = (placement === 'header' || placement === 'icon') && !note.hidden;
          shell.dataset.end = top ? 'task-top' : placement === 'link' ? 'footer-link' : 'footer';
          if (submit && (placement === 'header' || placement === 'icon')) (top ? note : footer).append(submit);
          footer.hidden = ctx.finish || top;
          return base(_c);
        },
      },
    },
  });
})();
