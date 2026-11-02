(function () {
  'use strict';
  const palette = { bg: '#f3f6f9', panel: '#ffffff', fg: '#101214', muted: '#626c79', line: '#d1dbe6' };
      const icon = (name) => {
        const paths = {
          pen: '<path d="m4 20 1.4-6L16.6 2.8a2 2 0 0 1 2.8 0l1.8 1.8a2 2 0 0 1 0 2.8L10 18.6Z" fill="currentColor" stroke-width="1.4"/><path d="m14.5 5 4.5 4.5M5.4 14l4.6 4.6" stroke="#fff" stroke-width="1.4"/>',
          eraser:
            '<path d="m3.3 14.2 10-10a1.6 1.6 0 0 1 2.2 0l5.1 5.1a1.6 1.6 0 0 1 0 2.2l-9 9H8.2l-4.9-4.1a1.6 1.6 0 0 1 0-2.2Z"/><path d="m11.2 6.3 7 7-4 4-7-7Z" fill="currentColor" stroke="none"/>',
          undo: '<path d="m8 4-5 5 5 5M3 9h9a8 8 0 1 1 0 16" transform="translate(1 -2) scale(.9)"/>',
          document: '<path d="M6 2h9l5 5v15H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/><path d="M14 2v6h6M8 12h8M8 16h8"/>',
          size: '<path d="M3 8V3h5m8 0h5v5m0 8v5h-5m-8 0H3v-5M3 11v2m8-10h2m8 8v2m-10 8h2"/>',
          folder:
            '<path d="M3 6a2 2 0 0 1 2-2h5l2 3h8a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 1-2Z"/>',
          photo:
            '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="8" r="1.5"/><path d="m4 18 5-5 3 3 5-7 4 6"/>',
          settings:
            '<path d="m9 3 1-2h4l1 2 3 2 3 1 1 4-2 2-1 3 1 3-3 3-3-1-3-1-2 2-4-1-1-3-2-3-2-1V9l2-1 2-3Z" transform="translate(2 2) scale(.83)"/><circle cx="12" cy="12" r="3.5"/>',
          check: '<path d="m5 12 5 5L20 6"/>',
          close: '<path d="m6 6 12 12M6 18 18 6"/>',
        };
        return (
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
          (paths[name] || '') +
          '</svg>'
        );
      };
  const styleControls = (parent) => {
    for (const el of parent.querySelectorAll('.ref-submit, .ref-endlink, .ref-xtra, .ref-float')) {
      el.classList.add('gn-end');
      if (el.classList.contains('ref-xtra')) el.classList.add('gn-xtra');
      if (el.classList.contains('ref-endlink')) el.classList.add('gn-end-link');
      if (el.classList.contains('ref-icon')) {
        el.classList.add('gn-end-icon');
        el.innerHTML = icon('check');
      }
    }
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original frame provides dedicated panel and notification space at every size.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util, body = document.body;
      body.classList.add('design', 'gnome-whiteboard');
      document.documentElement.style.setProperty('--font', 'Arial, sans-serif');
      const shell = u.el('div', 'gn-shell', body),
        head = u.el('header', 'gn-titlebar', shell);
      const appIcon = u.el('span', 'gn-app-icon', head);
      appIcon.innerHTML = icon('pen');
      u.el('div', 'gn-window-title', head, 'Whiteboard');
      const headerActions = u.el('div', 'gn-header-actions', head);
      const controls = u.el('div', 'gn-window-controls', head);
      for (const [label, text] of [
        ['Minimize', '−'],
        ['Maximize', '□'],
        ['Close', '×'],
      ]) {
        const bt = u.el('button', 'gn-window-button', controls, text);
        bt.type = 'button';
        bt.setAttribute('aria-label', label);
        bt.onclick = () => env.log('window-control', { label });
      }
      const main = u.el('div', 'gn-main', shell);
      const summary = u.el('section', 'gn-summary', main);
      const thumb = u.el('div', 'gn-thumbnail', summary);
      thumb.innerHTML =
        '<svg class="gn-preview" viewBox="0 0 132 78" aria-hidden="true"><path d="M7 27q10-12 20 0t20 0t20 0" fill="none" stroke="#2878ee"/><circle cx="103" cy="25" r="10" fill="none" stroke="#ffb21f"/><path d="M103 7v-4m0 44v-4m-17-18h-5m44 0h-5m-29-12-4-4m32 32-4-4m0-24 4-4m-32 32 4-4" stroke="#ffb21f"/><path d="m9 68 12-20 12 20z" fill="none" stroke="#25b55b"/><rect x="49" y="49" width="20" height="19" fill="none" stroke="#ef3853"/><path d="M105 65c-14 0-14-18 0-18s14 18 0 18-7-11 0-11 4 5 0 5" fill="none" stroke="#7538e8"/></svg>';
      const project = u.el('div', 'gn-project-info', summary);
      u.el('h1', 'gn-project-title', project, 'Project Sketch');
      u.el('div', 'gn-edited', project, 'Edited today at 10:24 AM');
      const stats = u.el('div', 'gn-stats', summary);
      for (const [kind, label, value] of [
        ['strokes', 'Strokes', '5'],
        ['colors', 'Colors', '4'],
        ['size', 'Size', '1024 × 576'],
      ]) {
        const card = u.el('div', 'gn-stat gn-stat-' + kind, stats),
          mark = u.el('span', 'gn-stat-icon', card);
        mark.innerHTML =
          kind === 'colors'
            ? '<svg viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="10" r="7" fill="#2c79ff"/><circle cx="10" cy="25" r="7" fill="#ffdc37"/><circle cx="27" cy="25" r="7" fill="#31b4ac"/></svg>'
            : icon(kind === 'strokes' ? 'document' : 'size');
        const copy = u.el('span', 'gn-stat-copy', card);
        u.el('span', 'gn-stat-label', copy, label);
        u.el('strong', 'gn-stat-value', copy, value);
      }
      Object.assign(_c, { shell, main, project, headerActions, header: project });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('gn-header-note');
        _c.project.insertBefore(note, _c.project.querySelector('.gn-edited'));
      }
      const spacer = _c.header.querySelector('.ref-spacer');
      if (spacer) spacer.remove();
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.headerActions;
      base(_c);
      _c.header = header;
      styleControls(_c.headerTools);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'gn-work', _c.main);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('gn-task-panel');
        note.insertAdjacentHTML('afterbegin', icon('document'));
        note.querySelector('.ref-panel-text').classList.add('gn-panel-copy');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage gn-stage', _c.body);
      _c.stage.dataset.role = 'stage';
      _c.body.prepend(_c.stage);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const row = _c.util.el('div', 'gn-notice-row', _c.main);
        const note = document.body.querySelector('.ref-note');
        note.classList.add('gn-task-notification');
        note.insertAdjacentHTML('afterbegin', icon('document'));
        note.querySelector('.ref-note-text').classList.add('gn-notification-copy');
        const close = note.querySelector('.ref-note-x');
        close.classList.add('gn-note-close');
        close.innerHTML = icon('close');
        row.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util, shell = _c.shell;
      const footer = u.el('footer', 'gn-footer', shell),
        nav = u.el('nav', 'gn-nav', footer);
      for (const [name, label] of [
        ['pen', 'Whiteboard'],
        ['folder', 'Files'],
        ['photo', 'Photos'],
        ['settings', 'Settings'],
      ]) {
        const bt = u.el('button', 'gn-nav-button' + (name === 'pen' ? ' active' : ''), nav);
        bt.type = 'button';
        bt.innerHTML = icon(name);
        u.el('span', '', bt, label);
        bt.onclick = () => env.log('navigation', { label });
      }
      const foot = document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      styleControls(foot);
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.footer.appendChild(dock);
        styleControls(dock);
      }
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box gn-overlay-box', el);
      const close = u.el('button', 'gn-overlay-close', box, '×');
      close.type = 'button';
      close.title = 'Close';
      close.setAttribute('aria-label', 'Close');
      close.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const cookie = u.el('span', 'gn-cookie-icon', box);
        cookie.innerHTML =
          '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M27 15a6 6 0 0 1-8-8 5 5 0 0 1-2-5A14 14 0 1 0 30 17a5 5 0 0 1-3-2Z" fill="#e7ac67"/><g fill="#995e35"><circle cx="10" cy="10" r="2"/><circle cx="7" cy="20" r="2.4"/><circle cx="17" cy="17" r="2.1"/><circle cx="19" cy="26" r="2.2"/><circle cx="25" cy="21" r="1.8"/><circle cx="13" cy="25" r="1.3"/></g></svg>';
        u.el('p', 'gn-overlay-message', box, 'We use cookies to improve your experience and analyze usage.');
        const more = u.el('button', 'gn-learn-more', box, 'Learn more');
        more.type = 'button';
        more.onclick = () => env.log('decoy', { label: 'Learn more' });
      } else if (kind === 'chat') {
        const heading = u.el('div', 'gn-chat-heading', box);
        u.el('span', 'gn-chat-badge', heading, '•••');
        u.el('h3', '', heading, 'Chat with us');
        u.el('p', '', box, 'Hi! How can we help you?');
        const compose = u.el('div', 'gn-chat-compose', box);
        u.el('div', 'gn-chat-placeholder', compose, 'Type a message…');
        const send = u.el('button', 'gn-chat-send', compose, '➤');
        send.type = 'button';
        send.setAttribute('aria-label', 'Send message');
        send.onclick = () => env.log('decoy', { label: 'Send message' });
      } else if (kind === 'promo') {
        const art = u.el('div', 'gn-newsletter-art', box);
        art.innerHTML =
          '<svg viewBox="0 0 180 180" aria-hidden="true"><path d="m25 80 65-52 65 52v75H25Z" fill="#0875ff"/><rect x="45" y="40" width="92" height="100" rx="8" fill="#fff" stroke="#d8e4fa" stroke-width="3"/><path d="m25 80 65 43 65-43v75H25Z" fill="#bcd3ff"/><path d="m25 155 65-48 65 48Z" fill="#d4e1ff"/><path d="m91 59 6 15 16 1-12 10 4 15-14-8-14 8 4-15-12-10 16-1Z" fill="#ffcc3e"/><path d="m52 24-7-12m90 12 7-10M22 48v11m-5-6h10m131-8v12m-6-6h12" stroke="#ffc25e" stroke-width="5" stroke-linecap="round"/></svg>';
        const copy = u.el('div', 'gn-newsletter-copy', box);
        u.el('h3', '', copy, 'Get creative tips in your inbox');
        u.el('p', '', copy, 'Join our newsletter for updates, design inspiration, and more.');
        const field = u.el('input', 'gn-newsletter-email', copy);
        field.type = 'email';
        field.placeholder = 'Your email address';
        field.setAttribute('aria-label', 'Your email address');
        const actions = u.el('div', 'gn-newsletter-actions', copy),
          later = u.el('button', 'gn-newsletter-later', actions, 'Not now');
        later.type = 'button';
        later.onclick = () => ctx.dismiss('close');
        const subscribe = u.el('button', 'dismiss', actions, 'Subscribe');
        subscribe.type = 'button';
        subscribe.onclick = () => env.log('decoy', { label: 'Subscribe' });
      } else if (kind === 'banner') {
        const summary = document.querySelector('.gn-summary');
        if (summary) el.style.top = summary.getBoundingClientRect().bottom + 7 + 'px';
        u.el('span', 'gn-announcement-icon', box, '⚑');
        u.el('h3', '', box, 'New templates are here!');
        u.el('p', '', box, 'Start faster with a collection of professional templates.');
      } else {
        u.el('h3', '', box, 'Changes saved');
        u.el('p', '', box, 'Your whiteboard is up to date.');
      }
      return { el, dismiss: close, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-draw-shape-erase-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-draw-shape-erase-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0961ed'],
      LOW_ACCENTS: ['#0961ed'],
      parts,
    },
  });
})();
