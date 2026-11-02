(function () {
  'use strict';
  const palette = { bg: '#d9e7f5', panel: '#f8fbff', fg: '#072c60', muted: '#5f6a78', line: '#c8cdd5' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original frame has a dedicated note cell at every viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.remove('instruction-header', 'instruction-panel', 'instruction-toast', 'instruction-hidden');
      document.body.classList.add('bottom', 'instruction-' + _c.display);
      document.body.classList.toggle('finish-mode', !!_c.ctx.finish);
      const shell = u.el('div', 'site-shell', document.body);
      const top = u.el('header', 'design-header', shell);
      u.el('div', 'design-brand', top, 'Chirp');
      u.el('div', 'window-controls', top, '−  □  ×');
      const toolbar = u.el('div', 'header-tools', top);
      u.el('nav', 'design-nav', toolbar, 'Alex Chen');
      const ribbon = u.el('div', 'office-ribbon', top);
      const paths = {
        home: '<path d="M3 11L12 3l9 8M5 10v11h14V10M10 21v-7h4v7"/>',
        refresh: '<path d="M20 8a8 8 0 1 0 0 9M20 3v6h-6"/>',
        folder: '<path d="M3 6h7l2 3h9v12H3z"/>',
        save: '<path d="M3 3h16l2 3v15H3zM7 3v7h10V3M7 21v-7h10v7"/>',
        search: '<circle cx="10" cy="10" r="7"/><path d="M15 15l7 7"/>',
        filter: '<path d="M3 3h18l-7 9v9l-4-3v-6z"/>',
        mail: '<rect x="2" y="4" width="20" height="16" rx="1"/><path d="M2 5l10 8L22 5"/>',
        star: '<path d="M12 2l3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1z"/>',
        gear: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/>',
      };
      for (const [label, key] of [
        ['Refresh', 'home'], ['New Post', 'refresh'], ['Open', 'folder'], ['Save', 'save'],
        ['Search', 'search'], ['Filter', 'filter'], ['Mark Read', 'mail'], ['Mark Unread', 'mail'],
        ['Favorite', 'star'], ['Settings', 'gear'], ['Help', 'gear'],
      ]) {
        const b = u.el('button', 'ribbon-tool', ribbon);
        b.type = 'button';
        b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">' + paths[key] + '</svg>';
        u.el('span', '', b, label);
        b.addEventListener('click', () => env.log('decoy', { what: label }));
      }
      for (const [name, start, end] of [['Timeline', 0, 1], ['File', 1, 4], ['Find', 4, 6], ['Actions', 6, 9], ['Options', 9, 11]]) {
        const group = u.el('section', 'ribbon-group', ribbon);
        for (const b of Array.from(ribbon.querySelectorAll(':scope > button')).slice(0, end - start)) group.append(b);
        u.el('span', 'ribbon-group-name', group, name);
      }
      const note = u.el('section', 'task-note');
      note.classList.toggle('long-instruction', _c.ctx.instruction.length > 80);
      note.hidden = _c.display === 'hidden';
      u.el('span', 'task-clipboard', note, '▣');
      Object.assign(_c, { shell, toolbar, header: note, note });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'design-body', _c.shell);
      body.appendChild(_c.note);
      const lower = u.el('section', 'office-lower', body);
      const details = u.el('div', 'task-details', lower);
      u.el('h3', '', details, 'Task Details');
      const fields = u.el('dl', 'task-detail-fields', details);
      for (const [label, value] of [['Action:', 'Use the requested post action.'], ['Target Author:', ''], ['Post Starts With:', ''], ['Status:', 'Not completed']]) {
        u.el('dt', '', fields, label);
        u.el('dd', 'detail-' + label.split(':')[0].replaceAll(' ', '-').toLowerCase(), fields, value);
      }
      const right = u.el('div', 'office-reminder-side', lower);
      const actionbar = u.el('div', 'office-final-actions', right);
      const footer = u.el('footer', 'design-footer', _c.shell);
      u.el('span', 'footer-label', footer, 'Ready');
      u.el('span', 'status-count', footer, 'Posts: 3    │    Filter: All');
      Object.assign(_c, { body, actionbar });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.note;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
      _c.body.insertBefore(_c.stage, _c.body.querySelector('.office-lower'));
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') _c.note.appendChild(document.body.querySelector('.ref-note'));
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.actionbar.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.actionbar.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const named = null;
      const texts = {
        cookie: ['We use cookies', 'We use optional cookies to improve your experience.', 'Reject optional'],
        toast: ['Notification', 'Your workspace is up to date.', 'Dismiss'],
        chat: ['Help', 'Need help with this workspace?', 'Close'],
        promo: ['News and updates', 'Discover the latest workspace updates.', 'Close'],
        banner: ['Announcement', 'You can still work now. Save your changes regularly.', 'Collapse announcement'],
      };
      let [title, copy, label] = texts[ctx.kind];
      if (named && ['promo', 'toast', 'banner', 'cookie'].includes(ctx.kind)) {
        [title, copy, label] = named;
      }
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
      if (/Tip/.test(title)) {
        const c = u.el('label', '', el);
        c.style.cssText = 'display:block;padding:0 22px 14px';
        const ch = u.el('input', '', c);
        ch.type = 'checkbox';
        c.append(' Do not show again');
      }
      const dismiss = u.el('button', 'primary', actions, label);
      dismiss.type = 'button';
      dismiss.addEventListener('click', () => ctx.dismiss());
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-use-social-feed-one-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-use-social-feed-one-09': palette }, LOW_THEME: palette,
      ACCENTS: ['#188de0'], LOW_ACCENTS: ['#188de0'], parts,
    },
  });
})();
