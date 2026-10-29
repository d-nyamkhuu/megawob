// GNOME browser frame on site/base; shared controls and episode UI stay in the template.
(function () {
  'use strict';

  const palette = { bg: '#eceef2', panel: '#fff', fg: '#17212d', muted: '#6b7280', line: '#d4d8df' };

  // Keep the original CSS hooks on controls created by the template.
  function dressControls(parent, placement) {
    for (const button of parent.querySelectorAll('.ref-submit, .ref-endlink')) {
      button.classList.add('submit', 'place-' + (button.classList.contains('ref-endlink') ? 'link' : placement));
    }
    for (const button of parent.querySelectorAll('.ref-xtra')) button.classList.add('chrome-xtra');
  }

  env.site({
    name: 'design-click-control-tab-06',
    template: 'site/base',
    langs: ['en'],
    design: {
      THEMES: { gnome: palette }, LOW_THEME: palette,
      ACCENTS: ['#1e70f2'], LOW_ACCENTS: ['#1e70f2'],
      parts: {
        'frame.theme': (base) => (_c) => {
          base(_c);
          document.body.className = 'ref gnome ledger';
        },
        'frame.layout': (base) => (_c) => {
          base(_c);
          // This frame has room for its own compact panel and toast at every supported size.
          _c.display = _c.ctx.display;
          document.body.classList.remove('ref-has-note');
        },
        'frame.placement': (base) => (_c) => {
          base(_c);
          _c.wantFooter = true;
        },
        'frame.header': () => (_c) => {
          const { ctx, util: u } = _c;
          const topbar = u.el('div', 'gn-top', document.body);
          u.el('span', 'gn-act', topbar, 'Activities');
          const app = u.el('span', 'gn-app', topbar);
          app.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c-6 5-6 13 0 18M12 3c6 5 6 13 0 18"/></svg>Web';
          u.el('span', 'gn-clock', topbar, 'Apr 24   10:15');
          const tray = u.el('span', 'gn-tray', topbar);
          tray.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6"><path d="M3 8q9-7 18 0M6 12q6-5 12 0M9 16q3-3 6 0"/><circle cx="12" cy="19" r="1" fill="currentColor"/></svg><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9h4l5-4v14l-5-4H3Z" fill="currentColor"/><path d="M16 8q4 4 0 8M19 5q6 7 0 14"/></svg><svg viewBox="0 0 26 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="2" y="5" width="21" height="14" rx="2"/><path d="M25 9v6"/><rect x="5" y="8" width="15" height="8" fill="currentColor"/></svg>';
          const shell = u.el('main', 'shell', document.body);
          shell.dataset.display = ctx.display;
          const head = u.el('header', 'head', shell);
          const title = u.el('div', 'title', head, '');
          const controls = u.el('span', 'window-controls', title);
          controls.innerHTML =
            '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
          Object.assign(_c, { shell, header: head });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base(_c);
          const note = _c.header.querySelector('.ref-instruction');
          if (note) {
            note.classList.add('instruction');
            note.classList.toggle('long-instruction', _c.ctx.instruction.length > 40);
            note.dataset.display = _c.display;
          }
        },
        'frame.tools': (base) => (_c) => {
          base(_c);
          dressControls(_c.headerTools, 'header');
        },
        'frame.body': () => (_c) => {
          const { shell, header, util } = _c;
          const body = util.el('div', 'work ref-body', shell);
          const center = util.el('section', 'center', body);
          const note = header.querySelector('.instruction');
          if (note) center.append(note);
          Object.assign(_c, { body, center });
        },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) panel.classList.add('instruction', 'instruction-panel');
          _c.body.classList.remove('ref-panel-right');
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('div', 'stage', _c.center);
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            note.classList.add('instruction', 'instruction-toast');
            _c.shell.append(note);
          }
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const foot = document.querySelector('.ref-foot');
          foot.classList.add('footer');
          _c.shell.append(foot);
          const settings = foot.querySelector('.ref-foot-text');
          settings.className = 'ready';
          settings.innerHTML =
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="m9 3 1-2h4l1 3 3 1 3-1 2 4-2 2v4l2 2-2 4-3-1-3 1-1 3h-4l-1-3-3-1-3 1-2-4 2-2v-4L1 8l2-4 3 1Z"/><circle cx="12" cy="12" r="4"/></svg>Settings';
          const tools = foot.querySelector('.ref-tools');
          for (const decoy of _c.headerTools.querySelectorAll('.chrome-xtra')) tools.prepend(decoy);
          dressControls(tools, 'footer');
          Object.assign(_c, { foot });
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) {
            _c.foot.append(dock);
            dressControls(dock, 'center');
          }
        },
      },
    },
  });
})();
