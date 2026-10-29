// Chirp's pixel frame, composed from the shared site frame and its control behavior.
(function () {
  'use strict';

  const palette = {
    bg: '#0d2a5c', panel: '#fffdf3', fg: '#0a2350',
    line: '#c9d6e6', muted: '#4d6285',
  };
  const clipboard = '<svg viewBox="0 0 24 28" width="100%" height="100%" fill="#f4f8ff" stroke="#1e3f7a" stroke-width="2" stroke-linejoin="miter"><path d="M3 2h13l5 5v19H3z"/><path d="M16 2v5h5"/><path d="M7 12h10M7 16h10M7 20h10" stroke-width="2"/></svg>';
  const gear = '<svg viewBox="0 0 24 24" width="100%" height="100%" fill="#10213f"><path d="M10 1h4v3l2 1 2-2 3 3-2 2 1 2h3v4h-3l-1 2 2 2-3 3-2-2-2 1v3h-4v-3l-2-1-2 2-3-3 2-2-1-2H1v-4h3l1-2-2-2 3-3 2 2 2-1z"/><circle cx="12" cy="12" r="3.500" fill="#fffdf3"/></svg>';
  const checkmark = '<svg viewBox="0 0 20 16" width="26" height="22" fill="none" stroke="#10213f" stroke-width="4"><path d="M2 8l5 5L18 2"/></svg>';

  const parts = {
    'frame.theme': (base) => (_c) => {
      base(_c);
      _c.root.style.setProperty('--font', "'Lucida Console','DejaVu Sans Mono',Consolas,'Courier New',monospace");
    },
    'frame.layout': (base) => (_c) => {
      base(_c);
      const { ctx, root, util } = _c;
      const display = root.clientWidth < 1100 && ['panel', 'toast'].includes(ctx.display) ? 'header' : ctx.display;
      document.body.className = 'bottom instruction-' + display + (ctx.finish ? ' finish-mode' : '');
      const shell = util.el('div', 'site-shell ref-body', document.body);
      Object.assign(_c, { display, shell });
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      // This design always has a bottom bar and uses Skip as its inert decoy.
      Object.assign(_c, { wantFooter: true, sidebar: false, nav: false, decoys: ['Skip'] });
    },
    'frame.header': () => (_c) => {
      const { shell, util } = _c;
      const workspace = util.el('div', 'workspace', shell);
      const header = util.el('header', 'ws-head', workspace);
      const brand = util.el('div', 'ws-brand', header);
      brand.innerHTML = '<svg viewBox="0 0 24 20" width="48" height="40" fill="#2aa3ef" shape-rendering="crispEdges"><path d="M1 3h3v2h3v2h4V4h2V2h5V1h3v2h3v2h-3v2h-1v4h-2v3h-2v2h-3v2H3v-2h4v-2H5v-2H3V9H2V6H1z"/></svg><span>Chirp</span>';
      const tabs = util.el('nav', 'ws-tabs', header);
      for (const [i, text] of ['Home', 'Explore', 'Notifications', 'Messages'].entries()) {
        const button = util.el('button', 'ws-tab' + (i === 0 ? ' on' : ''), tabs, text);
        button.type = 'button';
        button.addEventListener('click', () => env.log('decoy', { what: text }));
      }
      const search = util.el('div', 'ws-search', header);
      search.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#0d2a5c" stroke-width="3"><circle cx="10" cy="10" r="6"/><path d="M15 15l6 6"/></svg><span>Search Chirp...</span>';
      Object.assign(_c, { header, workspace });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const instruction = _c.header.querySelector('.ref-instruction');
      if (instruction) {
        instruction.className = 'mode-note header-note';
        instruction.dataset.role = 'instruction';
        _c.workspace.append(instruction);
      } else _c.header.querySelector('.ref-spacer').remove();
    },
    'frame.controls': (base) => (_c) => {
      base(_c);
      const { endBtn, decoyBtn } = _c;
      _c.endBtn = (parent, cls, text) => {
        const button = endBtn(parent, cls, text);
        if (_c.placement === 'header' || _c.placement === 'icon') button.className = 'header-end';
        else if (cls === 'ref-endlink') button.className = 'end-link';
        else {
          button.className = 'end-control';
          button.textContent = '';
          button.innerHTML = checkmark;
          _c.util.el('span', '', button, text);
        }
        return button;
      };
      _c.decoyBtn = (parent, text, collides) => {
        decoyBtn(parent, text, collides);
        parent.lastElementChild.className = collides ? 'pqd-xtra' : 'skip-btn';
      };
    },
    'frame.body': () => (_c) => {
      // The instruction panel belongs beside the workspace in the shell's grid.
      _c.body = _c.shell;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (!note) return;
      note.className = 'task-note';
      note.dataset.role = 'instruction';
      _c.shell.prepend(note);
      _c.body.classList.remove('ref-panel-right');
      const title = note.querySelector('.ref-panel-title');
      title.remove();
      _c.util.el('h2', '', note, 'Task');
      const text = note.querySelector('.ref-panel-text');
      const body = _c.util.el('div', 'task-body', note);
      _c.util.el('span', 'task-clipboard', body).innerHTML = clipboard;
      text.className = 'task-text';
      body.append(text);
      _c.util.el('hr', '', body);
      const details = _c.util.el('div', 'task-details', body);
      _c.util.el('h3', '', details, 'Details:');
      const list = _c.util.el('ul', '', details);
      for (const line of ['Browse posts in your feed.', 'Post options are in More (•••).', 'Scroll to see more posts.'])
        _c.util.el('li', '', list, line);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.workspace);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.querySelector('.ref-note');
        // Reserve space in the workspace, retaining the shared dismiss behavior.
        _c.stage.before(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.querySelector('.ref-foot');
      footer.className = 'design-footer';
      _c.shell.append(footer);
      footer.querySelector('.ref-foot-text').remove();
      const tools = footer.querySelector('.ref-tools');
      for (const decoy of _c.headerTools.querySelectorAll('[data-role="xtra"]')) tools.prepend(decoy);
      const icon = _c.util.el('span', 'foot-gear');
      icon.innerHTML = gear;
      const text = _c.util.el('div', 'foot-text');
      _c.util.el('b', '', text, 'Step 1 of 1');
      _c.util.el('span', '', text, 'Follow the instruction above.');
      const separator = _c.util.el('i', 'foot-sep');
      footer.prepend(icon, text, separator);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) _c.footer.append(dock);
    },
    overlay: () => (ctx) => {
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
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-label', title);
      u.el('h2', '', el, title);
      u.el('div', 'overlay-copy', el, copy);
      const actions = u.el('div', 'overlay-actions', el);
      if (ctx.kind === 'cookie') {
        const accept = u.el('button', '', actions, 'Accept all');
        accept.addEventListener('click', () => ctx.dismiss());
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };

  env.site({
    name: 'design-use-social-feed-menu-04',
    template: 'site/base',
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { chirp: palette }, LOW_THEME: palette,
      ACCENTS: ['#2ee6d6'], LOW_ACCENTS: ['#2ee6d6'], LANGS: ['en'],
      parts,
    },
  });
})();
