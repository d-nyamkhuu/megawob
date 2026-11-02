// OpenLook chrome on the shared frame; controls and perturbations use site/base.
(function () {
  'use strict';

  const workstation = {
    bg: '#a8b3c4', panel: '#e3e8ef', fg: '#10151c', accent: '#5f87c4',
    font: "'Lucida Grande','Lucida Sans','Lucida Sans Unicode',Verdana,sans-serif",
    line: '#8b97a8', muted: '#3b4452',
  };

  function taskNote(note) {
    if (!note) return;
    note.classList.add('task-note');
    note.dataset.role = 'instruction';
  }

  env.site({
    name: 'design-use-social-feed-some-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { workstation },
      LOW_THEME: workstation,
      ACCENTS: [workstation.accent],
      LOW_ACCENTS: [workstation.accent],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          // The original frame has a dedicated panel and notification strip at every size.
          _c.display = _c.ctx.display;
          document.body.className = 'bottom instruction-' + _c.display;
        },
        'frame.placement': (base) => (_c) => {
          base(_c);
          // OpenLook always reserves its bottom action row, including in finish mode.
          _c.wantFooter = true;
        },
        'frame.header': () => (_c) => {
          const { util: u } = _c;
          const shell = u.el('div', 'site-shell', document.body);
          const bar = u.el('header', 'ol-menubar', shell);
          const sun = u.el('span', 'ol-sun', bar);
          sun.innerHTML =
            '<svg viewBox="0 0 28 28" width="28" height="28"><g transform="translate(14 14) rotate(45) translate(-9 -9)" fill="none" stroke="#26356e" stroke-width="1.2"><rect width="18" height="18"/><path d="M3 3h5v5H3v5h5v3M10 3v5h5V3M10 10h5v5h-5v-5H5M1 6h4M13 17v-4M17 6h-4M6 1v4"/><path d="M1 10h2M10 1v2M17 10h-2M10 17v-2"/></g></svg><b>Sun</b>';
          for (const m of ['File', 'Edit', 'View', 'Go', 'Bookmarks', 'Help']) {
            const item = u.el('span', 'ol-mi', bar, m);
            item.addEventListener('click', () => env.log('decoy', { what: m }));
          }
          u.el('span', 'ol-clock', bar, 'Mon Apr 13   10:24 AM');
          const win = u.el('div', 'ol-window', shell);
          const title = u.el('div', 'ol-title', win);
          u.el('span', 'ol-pin', title, '−');
          u.el('span', 'ol-title-t', title, 'Social  Reader');
          u.el('span', 'ol-pin r', title, '▾');
          const header = u.el('div', 'ol-menu', win);
          for (const m of ['File', 'Edit', 'View', 'Options', 'Help']) u.el('span', '', header, m);
          Object.assign(_c, { shell, win, header });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base(_c);
          taskNote(_c.header.querySelector('.ref-instruction'));
        },
        'frame.controls': (base) => (_c) => {
          base(_c);
          const { endBtn, decoyBtn } = _c;
          _c.endBtn = (parent, cls, text) => {
            const button = endBtn(parent, cls, text);
            button.classList.add('ol-btn', 'end-control');
            if (cls === 'ref-endlink') button.classList.add('end-link');
            return button;
          };
          _c.decoyBtn = (parent, text, collides) => {
            decoyBtn(parent, text, collides);
            parent.lastElementChild.classList.add('ol-btn');
          };
        },
        'frame.body': () => (_c) => {
          const { header, util: u, win } = _c;
          const body = u.el('div', 'design-body ref-body', win);
          const surface = u.el('section', 'ol-surface', body);
          const note = header.querySelector('.ref-instruction');
          if (note) surface.append(note);
          Object.assign(_c, { body, surface });
        },
        'frame.panel': (base) => (_c) => {
          base({ ..._c, body: _c.surface });
          taskNote(_c.surface.querySelector('.ref-panel'));
        },
        frameAlign: () => () => {},
        'frame.stage': (base) => (_c) => {
          const section = { ..._c, body: _c.surface };
          base(section);
          _c.stage = section.stage;
          _c.stage.classList.add('stage');
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          if (_c.display === 'toast') {
            const note = document.querySelector('.ref-note');
            taskNote(note);
            _c.body.append(note);
          }
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const foot = document.querySelector('.ref-foot');
          foot.classList.add('ol-actions');
          _c.body.append(foot);
          const reply = _c.util.el('button', 'ol-btn dim', null, 'Reply');
          reply.type = 'button';
          reply.disabled = true;
          const refresh = _c.util.el('button', 'ol-btn', null, 'Refresh');
          refresh.type = 'button';
          refresh.addEventListener('click', () => env.log('decoy', { what: 'Refresh' }));
          foot.prepend(reply, refresh);
          _c.foot = foot;
        },
        'frame.floating': (base) => (_c) => {
          base(_c);
          const dock = document.querySelector('.ref-float-dock');
          if (dock) _c.foot.append(dock);
        },
      },
    },
  });
})();
