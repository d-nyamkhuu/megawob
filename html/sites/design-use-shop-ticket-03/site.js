// Macintosh frame design on the shared site template.
(function () {
  'use strict';
  const D = {
    brand: 'Ticket Finder',
    nav: ['File', 'Edit', 'View', 'Options', 'Help'],
    clock: 'Mon Apr 24   10:15 AM',
  };
  const MAC = {
    bg: '#ffffff', panel: '#ffffff', fg: '#000000', line: '#000000', muted: '#222222',
    font: "Geneva,'Helvetica Neue',Arial,sans-serif",
  };
  const ICONS = {
    search:
      '<svg viewBox="0 0 32 32" fill="none" stroke="#000" stroke-width="3"><circle cx="13" cy="13" r="7"/><path d="M15 10a4 4 0 1 0 0 6" stroke-width="1.5"/><path d="M18 18l9 9"/></svg>',
    details:
      '<svg viewBox="0 0 32 32" fill="none" stroke="#000" stroke-width="2.5"><rect x="8" y="5" width="16" height="22"/><path d="M12 11h8M12 16h8M12 21h8"/></svg>',
    compare:
      '<svg viewBox="0 0 32 32" fill="none" stroke="#000" stroke-width="3"><path d="M5 11h21M21 6l5 5-5 5M27 21H6M11 16l-5 5 5 5"/></svg>',
    clear:
      '<svg viewBox="0 0 32 32" fill="none" stroke="#000" stroke-width="2.5"><path d="M7 8h18M12 8V5h8v3M9 8l1 20h12l1-20M13 12v12M16 12v12M19 12v12"/></svg>',
  };

  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This design has a permanent task pane, even at the smallest viewport.
      _c.display = _c.ctx.display || 'header';
      document.body.className = 'mac instruction-' + _c.display;
    },
    'frame.header': () => (_c) => {
      const { util: u } = _c;
      const shell = u.el('div', 'mac-shell', document.body);
      const menu = u.el('header', 'mac-menu', shell);
      u.el('span', 'mac-apple', menu).innerHTML =
        '<svg viewBox="0 0 16 18" width="1.1em" height="1.2em"><path d="M8 5c-2-2-6-1-6 4 0 4 2 8 4 8 1 0 1-.5 2-.5s1 .5 2 .5c2 0 4-4 4-5-2-1-2-4 0-5-1-2-4-2-6-1zM8 4c0-2 1-3 3-4 0 2-1 3-3 4z" fill="#000"/></svg>';
      for (const n of D.nav) u.el('span', 'mac-mi', menu, n);
      u.el('span', 'mac-clock', menu, D.clock);
      const win = u.el('div', 'mac-win', shell);
      const tb = u.el('div', 'mac-titlebar', win);
      u.el('span', 'mac-box', tb);
      u.el('span', 'mac-stip', tb);
      u.el('span', 'mac-title', tb, D.brand);
      u.el('span', 'mac-stip', tb);
      u.el('span', 'mac-box mac-box2', tb);
      u.el('span', 'mac-box mac-box3', tb, '×');
      Object.assign(_c, { shell, win, header: tb });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('mac-header-note');
        note.dataset.role = 'instruction';
      }
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      const { header, headerTools } = _c;
      header.insertBefore(headerTools, header.querySelector('.mac-box2'));
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'mac-cols ref-body', _c.win);
      Object.assign(_c, { body });
    },
    'frame.panel': (base) => (_c) => {
      const { body, util: u } = _c;
      const left = u.el('section', 'mac-panel mac-left', body);
      const lh = u.el('div', 'mac-band', left);
      u.el('span', '', lh, 'Task');
      const note = u.el('div', 'mac-note', left);
      base({ ..._c, body: note });
      const panel = note.querySelector('.ref-panel');
      if (panel) {
        const task = panel.querySelector('.ref-panel-text');
        task.classList.add('mac-task');
        task.dataset.role = 'instruction';
        note.append(task);
        panel.remove();
      }
      if (_c.display === 'hidden') note.classList.add('mac-no-instruction');
      u.el('hr', '', note);
      u.el('p', 'mac-help mac-trip', note);
      u.el('p', 'mac-help', note, 'Compare the options on the right.');
      u.el(
        'p',
        'mac-help',
        note,
        'Each row lists the operator, departure, arrival, duration and price.',
      );
      u.el('dl', 'mac-details', note);
      u.el(
        'p',
        'mac-help mac-status',
        note,
        'Prices are shown per passenger.',
      );
      Object.assign(_c, { note });
    },
    'frame.stage': () => (_c) => {
      const { body, util: u } = _c;
      const right = u.el('section', 'mac-panel mac-right', body);
      const rh = u.el('div', 'mac-band', right);
      u.el('span', '', rh, 'Available Tickets');
      const stage = u.el('main', 'stage', right);
      Object.assign(_c, { stage });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const toast = document.querySelector('.ref-note');
      if (toast) {
        toast.classList.add('mac-toast');
        toast.querySelector('.ref-note-text').dataset.role = 'instruction';
        _c.note.prepend(toast);
      }
    },
    'frame.footer': (base) => (_c) => {
      const { util: u, stage, win } = _c;
      const acts = u.el('footer', 'mac-panel mac-actions', win);
      const ah = u.el('div', 'mac-band', acts);
      u.el('span', '', ah, 'Actions');
      const row = u.el('div', 'mac-arow', acts);
      for (const [label, key, icon] of [
        ['Search Again', 'search', 'search'],
        ['Details', 'details', 'details'],
        ['Compare', 'compare', 'compare'],
        ['Clear Selection', 'clear', 'clear'],
      ]) {
        const w = u.el('div', 'mac-tool', row);
        const b = u.el('button', 'mac-ibtn', w);
        b.type = 'button';
        b.innerHTML = ICONS[icon];
        b.setAttribute('aria-label', label);
        b.addEventListener('click', () => {
          if (key === 'clear' && stage.clearSelection) stage.clearSelection();
          else env.log('decoy', { what: label });
        });
        u.el('span', 'mac-tl', w, label);
      }
      u.el('span', 'mac-sep', row);
      const buy = u.el('button', 'mac-btn mac-buy', row, 'Buy ticket');
      buy.type = 'button';
      buy.addEventListener('click', () => {
        if (stage.buySelected) stage.buySelected();
      });
      // Reuse the template's footer controls inside the Mac action strip.
      base(_c);
      const foot = document.querySelector('.ref-foot');
      if (foot) row.append(foot);
      Object.assign(_c, { row });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.row.append(dock);
    },
    'frame.end': (base) => (_c) => {
      const { header, win } = _c;
      const note = header.querySelector('.mac-header-note');
      if (note) {
        const needed = Math.ceil(note.getBoundingClientRect().height +
          header.querySelector('.mac-title').getBoundingClientRect().height + 6);
        if (needed > header.clientHeight) win.style.gridTemplateRows = needed + 'px minmax(0,1fr) 17vh';
      }
      return base(_c);
    },
    overlay: () => function (ctx) {
      const u = ctx.util;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
      const el = u.el('section', 'reference-overlay ' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      let accept = null;
      if (ctx.kind === 'cookie') {
        accept = u.el('button', '', actions, 'Accept all');
        accept.type = 'button';
        accept.addEventListener('click', () => ctx.dismiss('accept'));
      }
      if (/Tip/.test(title)) {
        const c = u.el('label', '', el);
        c.style.cssText = 'display:block;padding:0 22px 14px';
        const ch = u.el('input', '', c);
        ch.type = 'checkbox';
        c.append(' Do not show again');
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss(ctx.kind === 'cookie' ? 'reject' : 'close'));
      return { el, dismiss: accept || dismiss };
    },
  };

  env.site({
    name: 'design-use-shop-ticket-03',
    template: 'site/base',
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { mac: MAC },
      LOW_THEME: MAC,
      ACCENTS: ['#000000'],
      LOW_ACCENTS: ['#000000'],
      LANGS: ['en'],
      parts,
    },
  });
})();
