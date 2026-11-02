(function () {
  'use strict';
  // The kit schedules and dismisses this notification stack as an initial overlay.
  // Its reserved margin and task anchors remain unchanged when it is cleared.
  function notificationCenter(ctx, shell) {
    const u = ctx.util;
    const pane = u.el('aside', 'reference-overlay toast notification-center', shell);
    pane.setAttribute('aria-label', 'Notifications');
    const heading = u.el('h2', '', pane, 'Notifications (5)');
    const stack = u.el('div', 'notification-stack', pane);
    const rows = [
      ['New message', 'You have a new message\nfrom Team Update.', '10:24 AM'],
      ['Reminder', 'Standup meeting\nin 10 minutes.', '9:18 AM'],
      ['System update', 'A new update is available\nto install.', '8:52 AM'],
      ['Friend request', 'Alex Chen sent you\na friend request.', '8:20 AM'],
      ['Tips', 'Explore new features\nin Social Task Runner.', '7:41 AM'],
    ];
    const clear = () => ctx.dismiss();
    rows.forEach(([title, copy, time], i) => {
      const card = u.el('section', 'notification-card nc-' + i, stack);
      u.el('b', '', card, title);
      u.el('span', 'nc-time', card, time);
      u.el('p', '', card, copy);
      const close = u.el('button', 'notification-close', card, '×');
      close.type = 'button';
      close.setAttribute('aria-label', 'Dismiss ' + title);
      close.addEventListener('click', () => {
        card.remove();
        heading.textContent = 'Notifications (' + stack.children.length + ')';
        if (!stack.children.length) clear();
      });
    });
    const actions = u.el('div', 'overlay-actions', pane);
    const dismiss = u.el('button', 'primary', actions, 'Dismiss all');
    dismiss.type = 'button';
    dismiss.addEventListener('click', clear);
    return { el: pane, dismiss };
  }
  const D = {
    'site': 'design-use-social-feed-all-11',
    'brand': 'Social Task Runner',
    'mode': 'top',
    'tokens': {
      'bg': '#efede3',
      'panel': '#ffffff',
      'fg': '#00135c',
      'accent': '#0954e8',
      'font': "Tahoma,Verdana,'Segoe UI',sans-serif",
      'line': '#c8cdd5',
      'muted': '#5f6a78',
    },
    'nav': 'File    Edit    View    Tools    Help',
    'obstruction': [
      'Notifications (5)',
      'New message \u00b7 Reminder \u00b7 System update \u00b7 Friend request \u00b7 Tips',
      'Dismiss all',
    ],
    'footer': 'Ready',
  };
  const palette = {
    bg: D.tokens.bg, panel: D.tokens.panel, fg: D.tokens.fg,
    muted: D.tokens.muted, line: D.tokens.line,
  };
  function decorateNote(note) {
    if (!note) return;
    note.classList.add('task-note');
    note.dataset.role = 'instruction';
    if (note.classList.contains('ref-instruction')) {
      const text = note.textContent;
      note.textContent = '';
      const p = document.createElement('p');
      p.textContent = text;
      note.appendChild(p);
    }
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This design has a compact form of its panel and a reserved toast area.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.documentElement.style.setProperty('--font', D.tokens.font);
      document.body.classList.add('top', 'instruction-' + _c.display);
      document.body.classList.toggle('finish-mode', !!_c.ctx.finish);
      const shell = u.el('div', 'site-shell', document.body);
      const header = u.el('header', 'design-header', shell);
      const tb = u.el('div', 'design-brand', header);
      u.el('span', 'xp-logo', tb);
      u.el('span', '', tb, D.brand);
      const caps = u.el('span', 'xp-caps', tb);
      u.el('i', 'xp-cap min', caps, '_');
      u.el('i', 'xp-cap max', caps, '▢');
      u.el('i', 'xp-cap cls', caps, '✕');
      const toolbar = u.el('nav', 'design-nav', header);
      for (const label of D.nav.trim().split(/\s+/)) {
        const item = u.el('span', '', toolbar);
        u.el('u', '', item, label[0]);
        item.append(label.slice(1));
      }
      const body = u.el('div', 'design-body', shell);
      Object.assign(_c, { shell, header: toolbar, toolbar, body });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.body;
      base(_c);
      _c.header = header;
      decorateNote(_c.body.querySelector('.ref-instruction'));
      const spacer = _c.body.querySelector('.ref-spacer');
      if (spacer) spacer.remove();
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      base(_c);
      decorateNote(_c.body.querySelector('.ref-panel'));
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        decorateNote(note);
        _c.body.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      _c.shell.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.classList.add('footer-label');
      text.textContent = D.footer;
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      if (ctx.initial) return notificationCenter(ctx, document.body);
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
      if (ctx.kind === 'toast') {
        el.querySelector('.overlay-copy').remove();
        const stack = u.el('div', 'notification-stack', el);
        for (const [title, copy] of [
          ['New message', 'You have a new message\nfrom Team Update.'],
          ['Reminder', 'Standup meeting\nin 10 minutes.'],
          ['System update', 'A new update is available\nto install.'],
          ['Friend request', 'Alex Chen sent you\na friend request.'],
          ['Tips', 'Explore new features\nin Social Task Runner.'],
        ]) {
          const card = u.el('section', 'notification-card nc-' + stack.children.length, stack);
          u.el('b', '', card, title);
          u.el(
            'span',
            'nc-time',
            card,
            ['10:24 AM', '9:18 AM', '8:52 AM', '8:20 AM', '7:41 AM'][stack.children.length - 1],
          );
          u.el('p', '', card, copy);
          const close = u.el('button', 'notification-close', card, '×');
          close.setAttribute('aria-label', 'Dismiss ' + title);
          close.addEventListener('click', () => {
            card.remove();
            if (!stack.children.length) ctx.dismiss();
          });
        }
      }
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
    name: D.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'toast' },
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: [D.tokens.accent], LOW_ACCENTS: [D.tokens.accent], parts,
    },
  });
})();
