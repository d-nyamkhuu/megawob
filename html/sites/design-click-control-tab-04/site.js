// Carbon browser frame on the shared site template. Task widgets keep their original pane hooks.
(function () {
  'use strict';

  const palette = { bg: '#0b0c0e', panel: '#0e1011', fg: '#c3ccda', muted: '#9aa4b4', line: '#2c3037' };

  env.site({
    name: 'design-click-control-tab-04',
    template: 'site/base',
    styles: ['site.css', 'carbon.css'],
    design: {
      THEMES: { carbon: palette },
      LOW_THEME: palette,
      ACCENTS: ['#7fb3ee'],
      LOW_ACCENTS: ['#7fb3ee'],
      LANGS: ['en'],
      parts: {
        'frame.theme': (base) => (_c) => {
          base(_c);
          document.body.className = 'ref carbon ledger';
        },
        'frame.layout': (base) => (_c) => {
          base(_c);
          // Both panes fit even at the smallest viewport; keep the requested instruction mode.
          _c.display = _c.ctx.display || 'header';
          document.body.classList.toggle('ref-has-note', _c.display === 'toast');
        },
        'frame.header': () => (_c) => {
          const u = _c.util;
          const shell = u.el('main', 'shell', document.body);
          const head = u.el('header', 'head', shell);
          const title = u.el('div', 'title', head, 'Knowledge Browser');
          const book = u.el('span', 'book-icon', title);
          book.innerHTML =
            '<svg viewBox="0 0 32 28"><defs><linearGradient id="book-blue" x2="0" y2="1"><stop stop-color="#b7e3ff"/><stop offset="1" stop-color="#4386bd"/></linearGradient></defs><path d="M16 5Q8 0 2 4v19q7-3 14 2 7-5 14-2V4Q23 0 16 5Z" fill="url(#book-blue)" stroke="#234c70" stroke-width="2"/><path d="M16 5v20M5 7q4-1 8 2M5 11q4-1 8 2M5 15q4-1 8 2M19 9q4-3 8-2M19 13q4-3 8-2M19 17q4-3 8-2" fill="none" stroke="#d5edff" stroke-width="1.4"/></svg>';
          const controls = u.el('span', 'window-controls', title);
          controls.innerHTML =
            '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
          const header = u.el('div', 'tools', head);
          for (const text of ['File', 'Edit', 'View', 'Tools', 'Help']) {
            const item = u.el('span', '', header);
            u.el('u', '', item, text[0]);
            item.appendChild(document.createTextNode(text.slice(1)));
          }
          Object.assign(_c, { shell, header });
        },
        'frame.nav': () => () => {},
        'frame.body': () => (_c) => {
          const { shell, header, util } = _c;
          const body = util.el('div', 'work ref-body', shell);
          const center = util.el('section', 'center', body);
          const instruction = header.querySelector('.ref-instruction');
          if (instruction) {
            instruction.classList.add('instruction');
            instruction.dataset.display = 'header';
            center.appendChild(instruction);
          }
          const aside = util.el('aside', 'inspector', body);
          util.el('h2', '', aside, 'Details');
          const inspectorBody = util.el('div', 'inspector-body', aside);
          Object.assign(_c, { body, center, inspectorBody });
        },
        'frame.panel': (base) => (_c) => {
          base({ ..._c, body: _c.inspectorBody });
          const panel = _c.inspectorBody.querySelector('.ref-panel');
          if (panel) {
            panel.classList.add('instruction', 'instruction-panel');
            panel.dataset.display = 'panel';
          }
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('div', 'stage', _c.center);
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const foot = document.querySelector('.ref-foot') || _c.util.el('footer', '', _c.shell);
          foot.classList.add('footer');
          _c.shell.appendChild(foot);
          const status = foot.querySelector('.ref-foot-text') || _c.util.el('span', '', foot);
          status.classList.add('ready');
          status.textContent = 'Ready';
          // The template's dismissible toast sits in the window's status bar.
          const note = document.querySelector('.ref-note');
          if (note) {
            note.classList.add('instruction-status');
            foot.insertBefore(note, foot.firstChild);
          }
          _c.foot = foot;
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) _c.foot.appendChild(dock);
        },
        'frame.end': (base) => (_c) => {
          // Class aliases retain the existing carbon stylesheet for shared template controls.
          for (const button of document.querySelectorAll('.ref-submit')) button.classList.add('submit');
          for (const button of _c.header.querySelectorAll('.ref-submit')) button.classList.add('toolbar-end');
          for (const link of document.querySelectorAll('.ref-endlink')) link.classList.add('submit', 'end-link');
          for (const button of document.querySelectorAll('.ref-xtra')) button.classList.add('chrome-xtra');
          return base(_c);
        },
      },
    },
  });
})();
