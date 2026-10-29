// Notebook chrome on the shared site frame; task and end-control behavior stay in site/base.
(function () {
  'use strict';
  const ICONS = {
    list: '<svg viewBox="0 0 24 24"><path d="M9 6h12M9 12h12M9 18h12"/><circle cx="4" cy="6" r="1.4"/><circle cx="4" cy="12" r="1.4"/><circle cx="4" cy="18" r="1.4"/></svg>',
    indent: '<svg viewBox="0 0 24 24"><path d="M10 6h11M10 12h11M3 18h18M3 8l4 4-4 4"/></svg>',
    link: '<svg viewBox="0 0 24 24"><path d="M10 14a4 4 0 0 0 6 0l4-4a4 4 0 0 0-6-6l-1 1M14 10a4 4 0 0 0-6 0l-4 4a4 4 0 0 0 6 6l1-1"/></svg>',
    image:
      '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="1"/><circle cx="8" cy="9" r="1.5"/><path d="M4 18l5-6 4 4 3-4 4 6Z" fill="currentColor"/></svg>',
    search: '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="6"/><path d="M15 15l6 6"/></svg>',
    caret: '<svg viewBox="0 0 12 8"><path d="M1 1.5l5 5 5-5"/></svg>',
  };

  // Apply the notebook's existing button classes to controls created by the template.
  function styleControls(parent, toolbar) {
    parent.querySelectorAll('[data-role="submit"]').forEach((button) => {
      button.classList.add(button.tagName === 'A' ? 'end-link' : toolbar ? 'toolbar-submit' : 'submit');
    });
  }

  env.site({
    name: 'design-click-control-collapsible-08',
    template: 'site/base',
    styles: ['site.css', 'nb.css'],
    design: {
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          // The notebook has a permanent margin panel, including at the smallest viewport.
          _c.display = _c.ctx.display || 'header';
          document.body.classList.toggle('ref-has-note', _c.display === 'toast');
        },
        'frame.header': () => (_c) => {
          const { util: u } = _c;
          document.body.classList.add('ref', 'nb');
          const shell = u.el('main', 'shell', document.body);
          const head = u.el('header', 'head', shell);
          const appIcon = u.el('span', 'appicon', head);
          appIcon.innerHTML =
            '<svg viewBox="0 0 18 22" aria-hidden="true"><path d="M3 3h12v16H3Z"/><path d="M5 7h8M5 10h8M5 13h8M5 16h6"/></svg>';
          u.el('span', 'title', head, 'NotePad Pro');
          const menu = u.el('nav', 'menus', head);
          ['File', 'Edit', 'View', 'Note', 'Tools', 'Help'].forEach((t) => u.el('span', '', menu, t));
          const wc = u.el('span', 'window-controls', head);
          wc.innerHTML =
            '<i><svg viewBox="0 0 16 16"><path d="M3 8h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
          const tb = u.el('div', 'toolbar', shell);
          const sel = u.el('span', 'fmtsel', tb);
          sel.innerHTML = 'Normal Text' + ICONS.caret;
          const tl = u.el('span', 'tools', tb);
          tl.innerHTML = '<b>B</b><em>I</em><u>U</u>' + ICONS.list + ICONS.list + ICONS.indent + ICONS.link + ICONS.image;
          const sr = u.el('span', 'search', tb);
          sr.innerHTML = ICONS.search + '<span>Search notes...</span>';
          const aside = u.el('aside', 'inspector');
          Object.assign(_c, { shell, header: tb, aside });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          const { aside, display, util } = _c;
          if (display === 'header') util.el('div', 'mlabel task', aside, 'Task');
          base({ ..._c, header: aside });
          const note = aside.querySelector('.ref-instruction');
          if (note) {
            note.classList.add('instruction');
            note.dataset.display = display;
          }
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          styleControls(_c.headerTools, true);
        },
        'frame.body': () => (_c) => {
          const { aside, shell, util } = _c;
          const body = util.el('div', 'work ref-body', shell);
          const center = util.el('section', 'center', body);
          util.el('h1', 'doctitle', center, 'Project Onboarding');
          util.el('div', 'docsub', center, 'Last updated: Apr 24, 2018');
          body.appendChild(aside);
          Object.assign(_c, { body, center });
        },
        'frame.panel': (base) => (_c) => {
          const { aside, display } = _c;
          base({ ..._c, body: aside });
          const panel = aside.querySelector('.ref-panel');
          if (panel) {
            const heading = panel.querySelector('.ref-panel-title');
            heading.classList.add('mlabel', 'task');
            heading.textContent = 'Task';
            const note = panel.querySelector('.ref-panel-text');
            note.classList.add('instruction');
            note.dataset.display = display;
            panel.replaceWith(heading, note);
          }
        },
        'frame.stage': () => (_c) => {
          const { aside, center, ctx, decoyBtn, util } = _c;
          const stage = util.el('div', 'stage', center);
          util.el('div', 'mlabel', aside, 'Notes');
          util.el('p', 'mnote', aside,
            'Sections organize the document on the left. Expand a section to view its contents.');
          util.el('div', 'mlabel', aside, 'Tip');
          util.el('p', 'mnote', aside,
            'Blue underlined text opens a link. Section headers show or hide content.');
          const actions = util.el('div', 'actions', aside);
          if (!ctx.finish) {
            decoyBtn(actions, 'Mark for Later');
            actions.lastElementChild.classList.add('later');
          }
          Object.assign(_c, { stage, actions });
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const footer = document.querySelector('.ref-foot');
          if (footer) {
            _c.actions.appendChild(footer);
            // Keep the margin's two-button row; generic filler controls fit in the toolbar.
            footer.querySelectorAll('.ref-xtra').forEach((button) => _c.headerTools.appendChild(button));
            styleControls(footer, false);
          }
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) {
            _c.actions.appendChild(dock);
            styleControls(dock, false);
          }
        },
      },
    },
  });
})();
