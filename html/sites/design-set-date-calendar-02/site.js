// Design on templates/site/base.js; desktop ribbon and adoption-record styling.
(function () {
  'use strict';
  const C = {
    site: 'design-set-date-calendar-02',
    app: 'Adoption Records',
    menus: ['Home', 'Edit', 'View', 'Tools', 'Help'],
    heading: 'Pet Adoption Record',
    sub: 'Complete the details below for the adoption.',
    groups: [
      {
        name: 'Records',
        items: [
          ['New Record', 'file'],
          ['Open', 'folder'],
          ['Save', 'save'],
          ['Delete', 'trash'],
        ],
      },
      {
        name: 'Editing',
        items: [
          ['Undo', 'undo', 1],
          ['Redo', 'redo', 1],
        ],
      },
      {
        name: 'Insert',
        items: [
          ['Add Pet', 'user'],
          ['Add Adopter', 'users'],
          ['Attach File', 'file'],
        ],
      },
      {
        name: 'Manage',
        items: [
          ['Notes', 'list'],
          ['Tags', 'tag'],
          ['History', 'clock'],
        ],
      },
      {
        name: 'System',
        items: [
          ['Preferences', 'gear'],
          ['Help', 'help'],
        ],
      },
    ],
  };
  const P = {
    file: '<path d="M5 3h9l6 6v12H5z"/><path d="M14 3v6h6"/>',
    folder: '<path d="M3 19V5h6l3 3h8v3M3 19l2-9h17l-3 9z"/>',
    save: '<path d="M4 4h13l3 3v13H4z"/><path d="M8 4v6h8V4M8 20v-6h8v6"/>',
    trash: '<path d="M3 5h18M8 5V2h8v3M5 5v16h14V5M9 8v10M15 8v10"/>',
    undo: '<path d="M8 6l-5 5 5 4M3 11h9c5 0 8 3 8 8"/>',
    redo: '<path d="M16 6l5 5-5 4M21 11h-9c-5 0-8 3-8 8"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-5 4-7 8-7s8 2 8 7z"/>',
    users:
      '<circle cx="9" cy="8" r="3.5"/><circle cx="17" cy="9" r="3"/><path d="M2 20c0-4 3-6 7-6s7 2 7 6zM16 14c4 0 6 2 6 6h-4"/>',
    list: '<path d="M9 6h12M9 12h12M9 18h12"/><g fill="currentColor" stroke="none"><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></g>',
    tag: '<path d="M21 3v8L10 22l-8-8L13 3z"/><circle cx="17" cy="7" r="1.3"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v7h5"/>',
    gear: '<circle cx="12" cy="12" r="3.5"/><path d="M9 2h6l.6 3 2.1 1.2 2.8-1 3 5.2-2.2 2v2.4l2.2 2-3 5.2-2.8-1-2.1 1.2-.6 3H9l-.6-3-2.1-1.2-2.8 1-3-5.2 2.2-2v-2.4l-2.2-2 3-5.2 2.8 1L8.4 5z" transform="translate(2 0) scale(.84)"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17v.5"/>',
  };
  const svg = (p, cls) =>
    '<svg class="' +
    cls +
    '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">' +
    p +
    '</svg>';
  // The alert treatment is visual; instruction routing and copy stay with the template.
  function noteStyle(note, text, mode, u) {
    note.classList.add('ds-note', 'ds-note-' + mode);
    text.classList.add('ds-instruction');
    const icon = u.el('span', 'ds-alert', null, '!');
    note.prepend(icon);
  }

  const theme = { bg: '#21192b', panel: '#2b2235', fg: '#eeedf8',
    muted: '#b8b3c6', line: '#5c506b' };
  env.site({
    name: C.site,
    template: 'site/base',
    styles: ['templates/site/css/base-overlays.css', 'templates/site/css/base-hooks.css', 'site.css'],
    langs: ['en'],
    design: {
      THEMES: { dark: theme }, LOW_THEME: theme,
      ACCENTS: ['#ff747b'], LOW_ACCENTS: ['#ff747b'],
      parts: {
        'frame.layout': (base) => (_c) => {
          base(_c);
          // This frame has room for its full-width instruction panel at every viewport.
          _c.display = _c.ctx.display;
        },
        'frame.placement': (base) => (_c) => {
          base(_c);
          // The desktop status bar is always present; placement and labels remain shared.
          _c.wantFooter = true;
        },
        'frame.header': () => (_c) => {
          const { util: u } = _c;
          const root = u.el('div', 'ds-win', document.body);
          const tb = u.el('header', 'ds-title', root);
          tb.insertAdjacentHTML(
            'beforeend',
            '<svg class="ds-paw" viewBox="0 0 24 24" fill="#ff7e87"><ellipse cx="3" cy="10" rx="2.3" ry="3" transform="rotate(-22 3 10)"/><ellipse cx="8" cy="5.5" rx="2.3" ry="3" transform="rotate(-10 8 5.5)"/><ellipse cx="14" cy="5.5" rx="2.3" ry="3" transform="rotate(10 14 5.5)"/><ellipse cx="19" cy="10" rx="2.3" ry="3" transform="rotate(22 19 10)"/><path d="M11 11c2.6 0 6.5 4.5 6.5 7.5 0 2-2 3-3.6 2.2-1.8-.9-4-.9-5.8 0-1.6.8-3.6-.2-3.6-2.2 0-3 3.9-7.5 6.5-7.5z"/></svg>',
          );
          u.el('span', 'ds-apptitle', tb, C.app);
          const controls = u.el('span', 'ds-winctl', tb);
          ['minimize', 'maximize', 'close'].forEach((name) => {
            const item = u.el('span', 'ds-window-icon', controls);
            item.setAttribute('aria-label', name);
            item.innerHTML = svg(
              name === 'minimize'
                ? '<path d="M4 12h16"/>'
                : name === 'maximize'
                  ? '<rect x="4" y="4" width="16" height="16"/>'
                  : '<path d="M5 5l14 14M19 5L5 19"/>',
              '',
            );
          });
          const mn = u.el('nav', 'ds-menu', root);
          C.menus.forEach((m, i) => u.el('span', 'ds-tab' + (i === 0 ? ' on' : ''), mn, m));
          const rb = u.el('div', 'ds-ribbon', root);
          C.groups.forEach((g) => {
            const gr = u.el('div', 'ds-group', rb);
            const its = u.el('div', 'ds-items', gr);
            g.items.forEach((it) => {
              const b = u.el(
                'div',
                'ds-btn' + (it[2] ? ' dis' : '') + (['user', 'users'].includes(it[1]) ? ' ds-filled' : ''),
                its,
              );
              b.insertAdjacentHTML('beforeend', svg(P[it[1]], 'ds-ico'));
              const t = u.el('span', '', b);
              t.innerHTML = it[0].replace(' ', '<br>');
            });
            u.el('div', 'ds-gname', gr, g.name);
          });
          const header = u.el('div', 'ds-head', root);
          u.el('h1', '', header, C.heading);
          u.el('p', '', header, C.sub);
          Object.assign(_c, { header, win: root });
        },
        'frame.nav': () => () => {},
        'frame.instruction': (base) => (_c) => {
          base(_c);
          const text = _c.header.querySelector('.ref-instruction');
          if (text) {
            const note = _c.util.el('aside', '', _c.win);
            _c.header.after(note);
            note.append(text);
            noteStyle(note, text, 'header', _c.util);
          }
          _c.header.querySelector('.ref-spacer')?.remove();
        },
        'frame.body': () => (_c) => {
          const body = _c.util.el('div', 'ds-workspace ref-body', _c.win);
          if (_c.display === 'panel') body.classList.add('ds-with-panel');
          Object.assign(_c, { body });
        },
        'frame.panel': (base) => (_c) => {
          base(_c);
          const panel = _c.body.querySelector('.ref-panel');
          if (panel) {
            panel.querySelector('.ref-panel-title').remove();
            noteStyle(panel, panel.querySelector('.ref-panel-text'), 'panel', _c.util);
          }
        },
        'frame.stage': () => (_c) => {
          _c.stage = _c.util.el('main', 'ds-stage', _c.body);
        },
        'frame.toast': (base) => (_c) => {
          base(_c);
          const note = document.querySelector('.ref-note');
          if (note) {
            noteStyle(note, note.querySelector('.ref-note-text'), 'toast', _c.util);
            _c.body.before(note);
          }
        },
        'frame.footer': (base) => (_c) => {
          base(_c);
          const { util: u } = _c;
          const foot = document.querySelector('.ref-foot');
          foot.classList.add('ds-footer');
          _c.win.append(foot);
          foot.querySelector('.ref-foot-text').remove();
          const status = u.el('div', 'ds-status', null);
          u.el('span', 'ds-ok', status, '✓');
          u.el('span', 'ds-ready', status, 'Ready');
          u.el('span', 'ds-sep', status);
          u.el('span', 'ds-saved', status, 'All changes saved');
          foot.prepend(status);
          const cancel = u.el('button', 'ds-cancel', null, 'Cancel');
          cancel.type = 'button';
          foot.querySelector('.ref-tools').prepend(cancel);
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
