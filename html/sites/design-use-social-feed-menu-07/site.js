(function () {
  'use strict';
  const palette = { bg: '#c8c8c8', panel: '#ffffff', fg: '#111111', muted: '#555555', line: '#c9c9c9' };
  const MENUS = ['File', 'Edit', 'View', 'Post', 'Options', 'Help'];
  const TABS = ['Home', 'Explore', 'Notifications', 'Messages'];
  const PEOPLE = '<svg viewBox="0 0 48 32" width="100%" height="100%" fill="#111"><circle cx="24" cy="6.5" r="6.5"/><path d="M12 30c0-10 5-15 12-15s12 5 12 15z"/><circle cx="9" cy="10" r="5"/><path d="M0 30c0-8 3-13 9-13 2 0 3 0 4 1-3 3-4 7-4 12z"/><circle cx="39" cy="10" r="5"/><path d="M48 30c0-8-3-13-9-13-2 0-3 0-4 1 3 3 4 7 4 12z"/></svg>';
  const DOC = '<svg viewBox="0 0 40 48" width="100%" height="100%" fill="#fff" stroke="#111" stroke-width="2.2"><path d="M10 2h18l9 9v32H10z"/><path d="M6 5h18l9 9v32H6z"/><path d="M2 3h19l9 9v34H2z"/><path d="M21 3v10h9M8 18h16M8 23h16M8 28h16M8 33h12M8 38h15" fill="none"/><path d="M8 7h7v6H8z" fill="#111"/></svg>';
  const PEN = '<svg viewBox="0 0 40 40" width="100%" height="100%" fill="#fff" stroke="#111" stroke-width="2.2"><path d="M6 34l2-9L28 5l7 7L15 32z"/><path d="M24 9l7 7M6 34l9-2"/></svg>';
  function decorateNote(_c, note, text) {
    const icon = _c.util.el('span', 'task-clipboard');
    icon.innerHTML = DOC;
    note.insertBefore(icon, text);
    text.classList.add('task-copy');
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      const { W, H, ctx } = _c;
      _c.display = ((ctx.display === 'panel' && (W < 1440 || H < 801)) ||
        (ctx.display === 'toast' && (W < 1180 || H < 700))) ? 'header' : (ctx.display || 'header');
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.documentElement.style.setProperty('--font', "'Segoe UI',Tahoma,Arial,sans-serif");
      document.body.classList.add('bottom', 'instruction-' + _c.display);
      const shell = u.el('div', 'site-shell', document.body);
      const title = u.el('header', 'os-title', shell);
      const ic = u.el('span', 'os-icon', title);
      ic.innerHTML = '<svg viewBox="0 0 28 30" width="28" height="30" stroke="#111" stroke-width="1.3" stroke-linejoin="miter"><path d="M4 10h5V5h5V2h5v5h5v5h3v13H4z" fill="#ffe65b"/><path d="M1 12h11v13H1z" fill="#fff"/><path d="M12 15h12v13H12z" fill="#e57565"/><path d="M3 15h7m-7 3h7m-7 3h7m5-12h7m-7 3h7m-7 6h7m-7 3h7"/><path d="M7 9h3v4H7z" fill="#8dd7ef"/></svg>';
      u.el('span', 'os-name', title, 'FriendSphere - OS/2');
      const wc = u.el('span', 'os-wc', title);
      for (const g of [
        '<svg viewBox="0 0 24 24"><path d="M3 18h17" stroke="#111" stroke-width="3"/></svg>',
        '<svg viewBox="0 0 24 24" fill="none" stroke="#111" stroke-width="2"><path d="M8 3h13v14M3 8h13v13H3z"/></svg>',
        '<svg viewBox="0 0 24 24"><path d="M5 4l14 16M19 4L5 20" stroke="#111" stroke-width="2.5"/></svg>',
      ]) u.el('i', '', wc).innerHTML = g;
      const menu = u.el('nav', 'os-menu', shell);
      MENUS.forEach((m) => { u.el('span', '', menu).innerHTML = '<u>' + m[0] + '</u>' + m.slice(1); });
      u.el('span', 'os-date', menu, 'Mon Apr 11, 1994   10:24 AM');
      const body = u.el('div', 'design-body', shell);
      Object.assign(_c, { shell, menu, body, header: body });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('task-note');
        const text = _c.util.el('p', '', null, note.textContent);
        note.textContent = '';
        note.appendChild(text);
        decorateNote(_c, note, text);
      }
      const spacer = _c.header.querySelector('.ref-spacer');
      if (spacer) spacer.remove();
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const tabs = u.el('div', 'os-tabs', _c.body);
      TABS.forEach((t, i) => { u.el('span', 'os-tab' + (i === 0 ? ' on' : ''), tabs).innerHTML = i === 0 ? '<u>H</u>ome' : t; });
      const book = u.el('div', 'os-book', _c.body);
      const bh = u.el('div', 'os-bookhead', book);
      u.el('span', 'os-logo', bh).innerHTML = PEOPLE;
      const bt = u.el('div', 'os-booktitle', bh);
      u.el('b', '', bt, 'FriendSphere');
      u.el('span', '', bt, 'Share ideas. Keep in touch.');
      const cb = u.el('button', 'os-compose', bh);
      cb.type = 'button';
      cb.innerHTML = PEN + "<span>What's happening?</span>";
      cb.addEventListener('click', () => env.log('decoy', { what: 'compose' }));
      _c.book = book;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('task-note', 'task-note-panel');
        const heading = note.querySelector('.ref-panel-title');
        heading.classList.add('task-caption');
        heading.textContent = 'Task';
        decorateNote(_c, note, note.querySelector('.ref-panel-text'));
      }
    },
    'frame.stage': () => (_c) => { _c.stage = _c.util.el('main', 'stage', _c.book); },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note', 'task-note-toast');
        decorateNote(_c, note, note.querySelector('.ref-note-text'));
        _c.body.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('design-footer');
      foot.querySelector('.ref-foot-text').remove();
      _c.shell.appendChild(foot);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
      const [title, copy, label] = texts[ctx.kind];
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
    name: 'design-use-social-feed-menu-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: { THEMES: { site: palette }, LOW_THEME: palette, ACCENTS: ['#111111'], LOW_ACCENTS: ['#111111'], parts },
  });
})();
