(function () {
  'use strict';
  const D = { brand: 'Social Desk', obstruction: null };
  const palette = { bg: '#f1eee0', panel: '#f1eee0', fg: '#111111', muted: '#333333', line: '#111111' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All note modes share the workstation's dedicated briefing pane.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.documentElement.style.setProperty('--font', "Georgia,'Times New Roman',serif");
      document.body.classList.remove('instruction-header', 'instruction-panel', 'instruction-toast', 'instruction-hidden');
      document.body.classList.add('bottom', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const menu = u.el('header', 'design-header', shell);
      const apple = u.el('span', 'menu-apple', menu);
      apple.innerHTML =
        '<svg viewBox="0 0 24 24" width="22" height="22"><path fill="#111" d="M16.5 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.15-2.8.85-3.5.85-.75 0-1.85-.8-3.05-.8-1.55 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.35 1.2 0 1.6-.75 3-.75s1.8.75 3.05.7c1.25 0 2.05-1.15 2.8-2.25.9-1.3 1.25-2.55 1.3-2.6-.05 0-2.5-.95-2.5-3.8zM14.2 5.8c.65-.8 1.1-1.9.95-3-.95.05-2.1.65-2.75 1.45-.6.7-1.1 1.8-.95 2.9 1.05.1 2.1-.5 2.75-1.35z"/></svg>';
      for (const m of ['File', 'Edit', 'View', 'Special', 'Help']) {
        const b = u.el('span', 'menu-item', menu, m);
        b.tabIndex = 0;
        b.addEventListener('click', () => {
          env.log('decoy', { what: m });
          if (m === 'Edit') menu.classList.toggle('edit-open');
        });
        b.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') b.click();
        });
      }
      const clockIcon = u.el('span', 'menu-clock-icon', menu);
      clockIcon.innerHTML =
        '<svg viewBox="1296 7 34 27"><image href="sites/design-use-social-feed-all-09/assets/lisa-details.webp" width="1672" height="941"/></svg>';
      u.el('span', 'menu-clock', menu, 'Mon Apr 16, 1984    9:27 AM');
      const win = u.el('div', 'lisa-window', shell);
      const tb = u.el('div', 'titlebar', win);
      u.el('span', 'tb-box', tb);
      u.el('span', 'tb-lines', tb);
      u.el('span', 'tb-title', tb, D.brand);
      u.el('span', 'tb-lines', tb);
      u.el('span', 'tb-box zoom', tb);
      const body = u.el('div', 'design-body', win);
      const note = u.el('section', 'task-note', body);
      note.hidden = _c.display === 'hidden';
      const nh = u.el('h2', '', note);
      nh.innerHTML =
        '<svg viewBox="49 116 43 51"><image href="sites/design-use-social-feed-all-09/assets/lisa-details.webp" width="1672" height="941"/></svg><span>Task Briefing</span>';
      const noteContent = u.el('div', 'brief-content', note);
      u.el('div', 'brief-rule', note);
      u.el('div', 'brief-static', note, 'Scan the posts on the right. Ignore posts that do not match.');
      const lower = u.el('section', 'office-lower', win);
      const tools = u.el('div', 'tool-strip', lower);
      for (const [k, label, cls] of [
        ['write', 'Write Reply', ''],
        ['reply', 'Reply', ' disabled'],
        ['trash', 'Ignore Post', ''],
      ]) {
        const b = u.el('button', 'tool' + cls, tools);
        b.type = 'button';
        const crop = { write: '155 769 73 73', reply: '493 770 82 70', trash: '852 762 59 76' }[k];
        b.innerHTML = '<svg viewBox="' + crop + '"><image href="sites/design-use-social-feed-all-09/assets/lisa-details.webp" width="1672" height="941"/></svg><span>' + label + '</span>';
        if (!cls) b.addEventListener('click', () => env.log('decoy', { what: label }));
      }
      const actionbar = u.el('div', 'office-final-actions', lower);
      const clear = u.el('button', 'clear-task', menu, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => env.log('decoy', { what: 'Clear' }));
      Object.assign(_c, { shell, win, menu, tb, body, actionbar, header: noteContent });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.actionbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.header.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        _c.tb.insertBefore(foot, _c.tb.children[3]);
        foot.querySelector('.ref-foot-text').textContent = '';
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.menu.insertBefore(dock, _c.menu.querySelector('.menu-clock-icon'));
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const named = D.obstruction;
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
    name: 'design-use-social-feed-all-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#111111'],
      LOW_ACCENTS: ['#111111'],
      parts,
    },
  });
})();
