(function () {
  'use strict';
  const palette = { bg: '#77797b', panel: '#c7c8ca', fg: '#090a0c', muted: '#343638', line: '#36383a' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display === 'panel' && (_c.W < 1400 || _c.H < 820) ? 'header' : (_c.ctx.display || 'header');
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'openlook', 'nextstep');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      u.el('div', 'system-brand', head, 'NeXT');
      const tl = u.el('nav', 'tools', head);
      ['File', 'Edit', 'View', 'Go', 'Tools', 'Window', 'Help'].forEach((t) => u.el('span', 'menu-item', tl, t));
      u.el('div', 'clock', head, 'Mon Apr 21  10:24 AM');
      u.el('div', 'sound', head, '◖))');
      u.el('div', 'menu-extra', head, '▤');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const title = u.el('div', 'title', center, 'Text Copy Task');
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML = '<i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3z"/></svg></i>';
      const inspectorSpace = u.el('div', 'inspector-space', work);
      inspectorSpace.classList.toggle('has-task-panel', _c.display === 'panel');
      Object.assign(_c, { shell, work, center, inspectorSpace, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = 'header';
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      const actions = _c.util.el('div', 'end-actions', _c.center);
      _c.header = actions;
      base(_c);
      _c.header = header;
      _c.actions = actions;
    },
    'frame.body': () => (_c) => { _c.body = _c.work; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.inspectorSpace;
      base(_c);
      _c.body = body;
      const note = _c.inspectorSpace.querySelector('.ref-panel');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = 'panel';
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
      _c.center.insertBefore(_c.stage, _c.actions);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = 'toast';
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = _c.util.el('footer', 'footer', _c.shell);
      const dock = _c.util.el('nav', 'dock', foot);
      [ ['▤', 'Workspace'], ['▱', 'Files'], ['▤', 'Edit'], ['⌕', 'Find'], ['▤', 'Text'], ['▦', 'Terminal'], ['▣', 'Print'], ['▥', 'Trash'] ].forEach(([icon, label]) => {
        const d = _c.util.el('div', 'dock-item', dock);
        _c.util.el('span', 'dock-icon', d, icon);
        _c.util.el('span', 'dock-label', d, label);
      });
      const controls = document.body.querySelector('.ref-foot');
      foot.appendChild(controls);
      const clear = _c.util.el('button', 'clear-text', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const input = _c.stage.querySelector('.ut-input');
        if (input) {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.firstChild);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      if (ctx.initial) {
        const slot = document.querySelector('.inspector-space');
        const el = u.el('aside', 'inspector notification-overlay', slot || document.body);
        const ah = u.el('div', 'inspector-title', el);
        u.el('span', 'inspector-box', ah, '');
        u.el('strong', '', ah, 'Notifications (4)');
        const close = u.el('button', 'inspector-close', ah, '×');
        close.type = 'button';
        close.setAttribute('aria-label', 'Close notifications');
        close.addEventListener('click', ctx.dismiss);
        const cards = u.el('div', 'notification-list', el);
        const entries = [
          ['▤', 'Software Update Available', 'A new version is ready to install.'],
          ['✉', '3 New Messages', 'From: Team, Alex, Pat'],
          ['▦', 'Meeting Reminder', 'Design review at 11:00 AM'],
          ['▤', 'Backup Complete', 'Your files are up to date.'],
        ];
        entries.forEach(([icon, title, sub]) => {
          const c = u.el('div', 'notification-card', cards);
          u.el('span', 'notif-icon', c, icon);
          const text = u.el('span', 'notif-copy', c);
          u.el('strong', '', text, title);
          u.el('span', '', text, sub);
          const x = u.el('button', 'notif-x', c, '×');
          x.type = 'button';
          x.setAttribute('aria-label', 'Dismiss ' + title);
          x.addEventListener('click', ctx.dismiss);
        });
        const dismiss = u.el('button', 'dismiss-all', el, 'Dismiss all');
        dismiss.type = 'button';
        dismiss.addEventListener('click', ctx.dismiss);
        return { el, dismiss };
      }
      const el = u.el('section', 'perturb ' + ctx.kind, document.body);
      u.el('strong', '', el, {
        cookie: 'Cookie preferences', toast: 'Notification', chat: 'Support', promo: 'A special offer', banner: 'Service notice',
      }[ctx.kind]);
      u.el('p', '', el, {
        cookie: 'Choose your preferences to continue.', toast: 'Your workspace is ready.', chat: 'How can we help?', promo: 'Explore the latest tools.', banner: 'A new update is available.',
      }[ctx.kind]);
      const dismiss = u.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-handle-text-unicode-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    initialOverlay: { kind: 'toast' },
    design: {
      THEMES: { 'design-handle-text-unicode-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#222426'],
      LOW_ACCENTS: ['#222426'],
      parts,
    },
  });
})();
