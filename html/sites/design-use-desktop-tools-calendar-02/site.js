// Calendar ribbon and status bar as a design on the shared site frame.
(function () {
  'use strict';

  // Keep the calendar ribbon's condensed type and lime time emphasis in every instruction mode.
  function decorateInstruction(note, text, util) {
    note.classList.add('task-note');
    note.dataset.role = 'instruction';
    note.classList.toggle('long-note', text.length > 110);
    note.style.setProperty('--instruction-size', Math.min(6.6, 430 / text.length) + 'vw');
    const paragraph = util.el('p', '', null);
    const match = text.match(/^(.*?)(\s+(?:starting|start|at|from)\b.*)$/i) || text.match(/^(.*?)(\d{1,2}:\d{2}.*)$/);
    if (match) {
      paragraph.append(document.createTextNode(match[1]));
      util.el('span', 'instruction-accent', paragraph, match[2]);
    } else paragraph.textContent = text;
    const copy = note.querySelector('.ref-panel-text, .ref-note-text');
    if (copy) copy.replaceChildren(paragraph);
    else note.replaceChildren(paragraph);
  }

  const palette = { bg: '#faf9f5', panel: '#ffffff', fg: '#111111',
    line: '#d1cec5', muted: '#626675' };

  const parts = {
    'frame.layout': (base) => function (_c) {
      base(_c);
      document.body.classList.remove('instruction-header', 'instruction-panel', 'instruction-toast', 'instruction-hidden');
      document.body.classList.add('top', 'instruction-' + _c.display);
    },
    'frame.placement': (base) => function (_c) {
      base(_c);
      // The reference always has a status footer, including when the end control is elsewhere.
      _c.wantFooter = true;
    },
    'frame.header': () => function (_c) {
      const { ctx, util: u, placement } = _c;
      const shell = u.el('div', 'site-shell', document.body);
      shell.classList.toggle('finish-mode', ctx.finish);
      shell.dataset.end = placement || 'none';
      const header = u.el('header', 'design-header', shell);
      const logo = u.el('span', 'design-logo', header);
      logo.innerHTML =
        '<svg viewBox="0 0 40 36" width="100%" height="100%"><rect x="1" y="4" width="38" height="31" rx="5" fill="#f4f3ee"/><rect x="7" y="0" width="3" height="7" fill="#c2ff5e"/><rect x="30" y="0" width="3" height="7" fill="#c2ff5e"/><g fill="#111"><circle cx="9" cy="16" r="3" fill="#8fd400"/><rect x="16" y="13" width="6" height="6" rx="1"/><rect x="27" y="13" width="6" height="6" rx="1"/><circle cx="9" cy="27" r="3"/><circle cx="19" cy="27" r="3"/><rect x="27" y="24" width="6" height="6" rx="1"/></g></svg>';
      u.el('div', 'design-brand', header, 'CalMate');
      const nav = u.el('nav', 'design-nav', header);
      const IC = {
        Day: '<rect x="4" y="3" width="16" height="18" rx="2" fill="#111" stroke="#111"/><rect x="6" y="9" width="12" height="10" fill="#c2ff5e" stroke="none"/>',
        Week: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4M7 13h3M14 16h3"/>',
        Month:
          '<path fill="#fff" stroke="none" d="M3 3h5v5H3zM9.5 3h5v5h-5zM16 3h5v5h-5zM3 9.5h5v5H3zM9.5 9.5h5v5h-5zM16 9.5h5v5h-5zM3 16h5v5H3zM9.5 16h5v5h-5zM16 16h5v5h-5z"/>',
        'New Event': '<path d="M12 3v18M3 12h18"/>',
        Delete:
          '<path d="M4 6h16M8 6V3h8v3"/><path fill="#fff" stroke="none" fill-rule="evenodd" d="M5 8h14l-1 14H6zM9 10v9h2v-9zM13 10v9h2v-9z"/>',
        Today: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4M7 13h3M14 16h3"/>',
        Settings:
          '<path fill="#fff" stroke="none" fill-rule="evenodd" d="M10 1h4l.7 3 2 .9 2.7-1.6 2.8 2.8-1.6 2.7.9 2 3 .7v4l-3 .7-.9 2 1.6 2.7-2.8 2.8-2.7-1.6-2 .9-.7 3h-4l-.7-3-2-.9-2.7 1.6-2.8-2.8 1.6-2.7-.9-2-3-.7v-4l3-.7.9-2L1.8 6.1l2.8-2.8 2.7 1.6 2-.9z M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8"/>',
      };
      for (const t of ['Day', 'Week', 'Month', 'New Event', 'Delete', 'Today', 'Settings']) {
        const b = u.el('span', 'nav-item' + (t === 'Day' ? ' on' : '') + (t === 'Settings' ? ' last' : ''), nav);
        const ic = u.el('i', '', b);
        ic.innerHTML =
          '<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="' +
          (t === 'Day' ? '#111' : '#fff') +
          '" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="butt">' +
          IC[t] +
          '</svg>';
        u.el('span', '', b, t);
      }
      Object.assign(_c, { shell, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => function (_c) {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) decorateInstruction(note, _c.ctx.instruction, _c.util);
    },
    'frame.controls': (base) => function (_c) {
      base(_c);
      const { endBtn, decoyBtn } = _c;
      // The template owns the labels, events and placement; these aliases retain the site's styling.
      _c.endBtn = (parent, cls, text) => {
        const button = endBtn(parent, cls, text);
        button.classList.add('end-control');
        if (cls === 'ref-endlink') button.classList.add('end-link');
        return button;
      };
      _c.decoyBtn = (parent, text, collides) => {
        decoyBtn(parent, text, collides);
        parent.lastElementChild.classList.add('chrome-xtra');
        _c.shell.classList.add('has-xtra');
      };
    },
    'frame.body': () => function (_c) {
      const body = _c.util.el('div', 'ref-body design-body', _c.shell);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) body.append(note);
      Object.assign(_c, { body });
    },
    'frame.panel': (base) => function (_c) {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.querySelector('.ref-panel-title').classList.add('panel-heading');
        decorateInstruction(panel, _c.ctx.instruction, _c.util);
      }
    },
    'frame.stage': (base) => function (_c) {
      base(_c);
      _c.stage.classList.add('stage');
    },
    'frame.toast': (base) => function (_c) {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        decorateInstruction(note, _c.ctx.instruction, _c.util);
        _c.body.append(note);
      }
    },
    'frame.footer': (base) => function (_c) {
      base(_c);
      const { shell, util: u, placement, submit } = _c;
      const footer = document.querySelector('.ref-foot');
      footer.classList.add('design-footer');
      shell.append(footer);
      const label = u.el('span', 'footer-label', null);
      u.el('i', 'dot', label);
      u.el('b', '', label, 'Ready');
      u.el('em', '', label, 'No event selected');
      footer.querySelector('.ref-foot-text').replaceWith(label);
      const tools = footer.querySelector('.ref-tools');
      const appSlot = u.el('span', 'chrome-app-slot', tools);
      appSlot.setAttribute('aria-hidden', 'true');
      if (submit && (placement === 'footer' || placement === 'link')) tools.insertBefore(appSlot, submit);
    },
    'frame.floating': (base) => function (_c) {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.shell.querySelector('.design-footer .ref-tools').append(dock);
    },
  };

  env.site({
    name: 'design-use-desktop-tools-calendar-02',
    template: 'site/base',
    design: {
      THEMES: { light: palette },
      LOW_THEME: palette,
      ACCENTS: ['#c2ff5e'],
      LOW_ACCENTS: ['#c2ff5e'],
      parts,
    },
  });
})();
