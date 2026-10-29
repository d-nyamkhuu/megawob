// Windows Program Manager frame on the shared site template.
(function () {
  'use strict';
  const ICONS = [
    [
      'My Computer',
      '<svg viewBox="0 0 40 40" width="100%" height="100%"><g stroke="#262626" stroke-linejoin="miter"><path d="M9 3h24v23l-4 4H7V6z" fill="#777"/><path d="M9 3h22v22H7V6z" fill="#c6c6c6"/><path d="M9 4h21M8 6v18" fill="none" stroke="#fff"/><path d="M11 8h16v13H11z" fill="#333"/><path d="M13 10h12v9H13z" fill="#00167f" stroke="#ddd"/><path d="M15 17l3-5 6 1-2 4z" fill="#008354" stroke="none"/><path d="M6 26h27l3 5-4 6H2l2-6z" fill="#aaa"/><path d="M6 26h26v7H4z" fill="#ddd"/><path d="M6 27h24M5 28v4M3 36h27" stroke="#fff" fill="none"/><path d="M20 29h9v2h-9z" fill="#222"/><path d="M6 31h10M30 30h2" stroke="#008454"/></g></svg>',
    ],
    [
      'File Manager',
      '<svg viewBox="0 0 40 40" width="100%" height="100%"><path d="M3 12l4-7h9l4 4h16v27H3z" fill="#b59b42" stroke="#333"/><path d="M4 11l4-5h8l4 4h14v5H4z" fill="#fff0a1"/><path d="M3 12h33v24H3z" fill="#f2d55c" stroke="#4b4926"/><path d="M4 13h30M4 14v20" stroke="#fff6b0" fill="none"/><path d="M35 13v22H4" fill="none" stroke="#9b893c"/></svg>',
    ],
    [
      'Notepad',
      '<svg viewBox="0 0 40 40" width="100%" height="100%"><path d="M11 5h25v31l-3 3H10z" fill="#999" stroke="#222"/><path d="M10 5h23v31H10z" fill="#fafafa" stroke="#222"/><path d="M13 28h17M13 31h17M13 34h17" stroke="#59a8ac"/><path d="M9 3h25L24 29H0z" fill="#c6ffff" stroke="#222"/><path d="M10 6h21L23 26H3z" fill="#55c5ce"/><path d="M10 9h18M8 12h19M7 15h18M6 18h18M5 21h18M4 24h18" stroke="#e6ffff"/><path d="M11 2c-3-3-5 1-3 3M17 2c-3-3-5 1-3 3M23 2c-3-3-5 1-3 3M29 2c-3-3-5 1-3 3" stroke="#111" stroke-width="1.5" fill="none"/><path d="M1 28h23L34 4" fill="none" stroke="#fff"/></svg>',
    ],
    [
      'Recycle Bin',
      '<svg viewBox="0 0 40 40" width="100%" height="100%"><path d="M3 7l13-5 21 7-5 26-11 5L6 33z" fill="#b5c3c3" stroke="#222"/><path d="M21 14l16-5-5 26-11 5z" fill="#719d9e" stroke="#222"/><path d="M3 7l18 7 16-5-21-7z" fill="#e2e2e2" stroke="#222"/><path d="M6 8l10-4 17 5-12 3z" fill="#787c7c"/><path d="M6 9l1 22 13 7M4 7l17 7 15-5" fill="none" stroke="#fff"/><g fill="#19882a"><path d="M10 20l4-5 3 5-3-1-2 4zM18 22l3 5-5 2 1-3-4-1 1-3zM10 25l-3-1 1 6 6 1-2-3-2-1z"/></g></svg>',
    ],
  ];
  // Adapt template-created controls to the existing beveled desktop chrome.
  function styleControls(parent, toolbar) {
    for (const b of parent.querySelectorAll('[data-role="submit"], [data-role="xtra"]')) {
      b.className = toolbar || b.dataset.role === 'xtra'
        ? 'ds-menu-control' : b.tagName === 'A' ? 'ds-end-link' : 'ds-submit';
    }
  }

  env.site({
    name: 'design-type-text-transform-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { desktop: { bg: '#008184', panel: '#bebcbd', fg: '#000', muted: '#444', line: '#808080' } },
      LOW_THEME: { bg: '#008184', panel: '#bebcbd', fg: '#000', muted: '#444', line: '#808080' },
      ACCENTS: ['#081477'],
      LOW_ACCENTS: ['#081477'],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          _c.display = _c.ctx.display || 'header';
          document.body.classList.remove('ref-has-note');
        },
        'frame.header': () => (_c) => {
          const { util: u } = _c;
          if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
          const selection = window.getSelection();
          if (selection) selection.removeAllRanges();
          const top = u.el('header', 'ds-top', document.body);
          u.el('span', 'ds-sysmenu', top);
          u.el('span', 'ds-brand', top, 'Program Manager');
          const arrows = u.el('span', 'ds-arrows', top);
          u.el('span', '', arrows, '▾');
          u.el('span', '', arrows, '▴');
          const nav = u.el('nav', 'ds-menu', document.body);
          ['File', 'Options', 'Window', 'Help'].forEach((t) => {
            const s = u.el('span', '', nav);
            s.innerHTML = '<u>' + t[0] + '</u>' + t.slice(1);
          });
          const body = u.el('div', 'ds-body', document.body);
          const icons = u.el('div', 'ds-icons', body);
          ICONS.forEach(([n, svg]) => {
            const i = u.el('div', 'ds-icon', icons);
            const g = u.el('div', 'ds-icon-img', i);
            g.innerHTML = svg;
            u.el('span', '', i, n);
          });
          const content = u.el('div', 'ds-content', body);
          const tb = u.el('div', 'ds-dlg-title', content);
          const glyph = u.el('span', 'ds-dlg-ico', tb);
          glyph.innerHTML = ICONS[0][1];
          u.el('span', 'ds-dlg-name', tb, 'Text Transformation');
          u.el('span', 'ds-dlg-x', tb, '×');

          content.classList.toggle('ds-panel-mode', _c.display === 'panel');
          const inner = u.el('div', 'ds-dlg-body', content);
          // The dialog always has a footer for Clear, even when its end control sits in the menu.
          Object.assign(_c, { header: nav, contentWindow: content, inner, wantFooter: true });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          if (_c.display !== 'header') return;
          const note = _c.util.el('aside', 'ds-header-note', _c.inner);
          base({ ..._c, header: note });
          note.firstElementChild.classList.add('ds-instruction');
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          _c.headerTools.className = 'ds-menu-tools';
          styleControls(_c.headerTools, true);
        },
        'frame.body': () => (_c) => {
          _c.body = _c.util.el('div', 'ds-main', _c.inner);
        },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) {
            panel.className = 'ds-brief';
            panel.firstElementChild.className = 'ds-brief-title';
            panel.lastElementChild.classList.add('ds-instruction');
          }
        },
        'frame.stage': () => (_c) => {
          const { util: u, body: main } = _c;
          u.el('div', 'ds-olabel', main, 'Text entry:');
          u.el('div', 'ds-orig', main, 'Enter your response in the field below.');
          _c.stage = u.el('main', 'ds-stage', main);
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          if (_c.display !== 'toast') return;
          const note = document.querySelector('.ref-note');
          note.className = 'ds-toast';
          note.firstElementChild.classList.add('ds-instruction');
          _c.inner.insertBefore(note, _c.body);
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const { util: u, stage } = _c;
          const foot = document.querySelector('.ref-foot');
          foot.className = 'ds-footer';
          foot.querySelector('.ref-foot-text').remove();
          const tools = foot.querySelector('.ref-tools');
          tools.className = 'ds-footer-tools';
          _c.inner.append(foot);
          styleControls(tools, false);
          const clr = u.el('button', 'ds-submit ds-clear', foot);
          clr.type = 'button';
          clr.innerHTML = '<u>C</u>lear';
          clr.addEventListener('click', () => {
            const f = stage.querySelector('input,textarea');
            if (f && !f.disabled) {
              f.value = '';
              f.dispatchEvent(new Event('input', { bubbles: true }));
              f.focus();
            }
          });
          const tray = u.el('div', 'ds-taskbar', document.body);
          const st = u.el('span', 'ds-start', tray);
          st.innerHTML =
            '<i><svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M7 4l7-3 8 3-2 19-8-4-6 2z" fill="#111"/><path d="M9 5l5-2v7l-5 1z" fill="#ed2626"/><path d="M16 4l4 1-1 7-4-2z" fill="#21b92c"/><path d="M9 13l5-1-1 6-5 1z" fill="#284bed"/><path d="M15 12l4 2-1 6-4-2z" fill="#f5de13"/><path d="M1 4h2v2H1zM4 5h2v3H4zM2 8h2v2H2zM5 10h2v2H5zM1 12h2v2H1zM3 15h2v2H3zM5 18h2v2H5z" fill="#111"/><path d="M1 6h2v2H1zM3 11h2v2H3zM2 17h2v2H2z" fill="#eee"/></svg></i>Start';
          u.el('span', 'ds-clock', tray, '10:24 AM');

          Object.assign(_c, { foot });
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) {
            dock.className = 'ds-footer-tools';
            _c.foot.prepend(dock);
            styleControls(dock, false);
          }
        },
        'frame.end': (base) => (_c) => {
          const { body: main, contentWindow: content } = _c;
          // Fit long instructions before the widget measures its stage or registers anchors.
          const missing = Math.max(0, main.scrollHeight - main.clientHeight);
          if (missing) content.style.height = content.getBoundingClientRect().height + missing + 2 + 'px';
          return base(_c);
        },
      },
    },
  });
})();
