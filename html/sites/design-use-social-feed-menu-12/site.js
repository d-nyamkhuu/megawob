// GEM desktop design on the shared frame; task behavior stays in the widget.
(function () {
  'use strict';

  const palette = {
    bg: '#1b7730', panel: '#eeeeee', fg: '#000000', accent: '#777777',
    font: 'monospace', line: '#bebebe', muted: '#5e6779',
  };
  const doc = '<svg viewBox="0 0 32 40" fill="#eee" stroke="currentColor" stroke-width="2"><path d="M3 2h18l8 8v28H3zM21 2v10h8M8 9h8M8 16h16M8 21h16M8 26h16M8 31h16"/></svg>';

  function taskCard(note, u) {
    const text = note.querySelector('.ref-panel-text') || note.querySelector('.ref-note-text') || note;
    const instruction = text.textContent;
    const close = note.querySelector('.ref-note-x');
    note.replaceChildren();
    note.classList.add('task-note');
    note.dataset.role = 'instruction';
    const icon = u.el('div', 'task-icon', note);
    u.el('i', '', icon).innerHTML = doc;
    u.el('span', '', icon, 'Task');
    u.el('p', '', note, instruction);
    if (close) note.append(close);
  }

  function styleTools(parent) {
    for (const b of parent.querySelectorAll('.ref-xtra')) b.classList.add('design-pq');
    for (const b of parent.querySelectorAll('.ref-submit')) b.classList.add('end-control');
    for (const b of parent.querySelectorAll('.ref-endlink')) b.classList.add('end-control', 'end-link');
  }

  env.site({
    name: 'design-use-social-feed-menu-12',
    template: 'site/base',
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'site.css'],
    langs: ['en'],
    design: {
      THEMES: { gem: palette }, LOW_THEME: palette,
      ACCENTS: [palette.accent], LOW_ACCENTS: [palette.accent],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          // Both instruction cards occupy the desktop's task region, even at small sizes.
          _c.display = _c.ctx.display;
          document.body.className = 'top instruction-' + _c.display;
        },
        'frame.placement': (base) => (_c) => {
          base(_c);
          // The GEM status/shortcut bar is part of the desktop in every episode.
          _c.wantFooter = true;
        },
        'frame.header': () => (_c) => {
          const { util: u } = _c;
          const shell = u.el('div', 'site-shell', document.body);
          const header = u.el('header', 'design-header', shell);
          u.el('span', 'gem-svgdefs', header).innerHTML = '<svg xmlns="http://www.w3.org/2000/svg"><defs><filter id="gem-ink" x="-2%" y="-5%" width="104%" height="110%" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncA type="discrete" tableValues="0 1"/></feComponentTransfer></filter></defs></svg>';
          u.el('div', 'design-brand', header).innerHTML = doc;
          const nav = u.el('nav', 'design-nav', header);
          for (const text of ['Desk', 'File', 'Edit', 'View', 'Options']) u.el('span', '', nav, text);
          const clock = u.el('div', 'design-clock', header, 'Mon 27 Jan 1986  10:24');
          clock.insertAdjacentHTML('beforeend', '<svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2"><path d="M6 2h12l4 4v12l-4 4H6l-4-4V6zM8 5h8v13H7V5M10 8h3v7h-3z"/></svg>');
          Object.assign(_c, { shell, header, clock });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base(_c);
          const note = _c.header.querySelector('.ref-instruction');
          if (note) {
            taskCard(note, _c.util);
            note.remove();
            _c.note = note;
          }
          const spacer = _c.header.querySelector('.ref-spacer');
          if (spacer) spacer.remove();
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          styleTools(_c.headerTools);
          if (_c.submit) _c.submit.classList.add('header-end');
          _c.header.insertBefore(_c.headerTools, _c.clock);
        },
        'frame.body': () => (_c) => {
          _c.body = _c.util.el('div', 'design-body ref-body', _c.shell);
          if (_c.note) _c.body.append(_c.note);
        },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const note = _c.body.querySelector('.ref-panel');
          if (note) {
            taskCard(note, _c.util);
            note.classList.add('instruction-panel');
          }
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('main', 'stage', _c.body);
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            taskCard(note, _c.util);
            _c.body.append(note);
          }
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const { util: u, shell } = _c;
          const footer = document.querySelector('.ref-foot');
          footer.classList.add('design-footer');
          footer.querySelector('.ref-foot-text').remove();
          shell.append(footer);
          const label = u.el('span', 'footer-label', footer, 'Browse your timeline and manage posts.');
          footer.prepend(label);
          styleTools(footer);
          const decoy = u.el('button', 'design-xtra', footer);
          u.el('b', '', decoy, 'Quick action');
          u.el('small', '', decoy, 'Unavailable');
          decoy.type = 'button';
          decoy.disabled = true;
          _c.footer = footer;
          const strip = u.el('div', 'design-strip', shell);
          const disk = u.el('span', '', strip);
          disk.innerHTML = '<svg viewBox="0 0 36 36" fill="#ddd" stroke="#111" stroke-width="1.6"><path d="M5 2h24l4 5v26H2V8z"/><path d="M9 2v12h18V2M7 23h21v10H7zM13 4h9v7h-9z"/><path d="M10 27h15"/></svg>';
          disk.append('A:\\>');
          const waste = u.el('span', '', strip);
          waste.innerHTML = '<svg viewBox="0 0 36 36" fill="#ddd" stroke="#111" stroke-width="1.6"><path d="M8 9h22l-2 25H10zM5 6h28v4H5zM14 3h11v3H14zM14 13v17M19 13v17M24 13v17"/></svg>';
          waste.append('Waste');
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) {
            styleTools(dock);
            _c.footer.append(dock);
          }
        },
      },
    },
  });
})();
