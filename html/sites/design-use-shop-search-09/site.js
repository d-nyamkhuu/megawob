(function () {
  'use strict';
  const D = {
    site: 'design-use-shop-search-09',
    tokens: {
      bg: '#9a9a9a',
      panel: '#ffffff',
      fg: '#000000',
      accent: '#000000',
      font: 'monospace',
      line: '#000000',
      muted: '#222222',
    },
    menu: ['File', 'Edit', 'View', 'Search', 'Help'],
    strip: [
      ['Home', '<path d="M2 11L12 2l10 9" stroke-width="3"/><path d="M5 10v12h14V10M10 22v-8h5v8M18 7V2h3v8"/>'],
      ['Search', '<circle cx="10" cy="10" r="7" stroke-width="2.5"/><path d="M15 15l8 8" stroke-width="3"/>'],
      [
        'Categories',
        '<path d="M4 6l4-4h9l4 4v14l-4 2H8l-4-2zM4 6h17M4 9h17M4 12h17M4 15h17M4 18h17M6 21h13" stroke-width="1.4"/>',
      ],
      [
        'My Apps',
        '<path d="M3 2h16l2 2v18H3z" fill="black"/><path d="M7 2h10v7H7zM7 13h10v8H7z" fill="white" stroke="none"/><path d="M13 3v5M9 16h6M9 19h5" stroke-width="1.5"/>',
      ],
      [
        'Settings',
        '<path d="M4 2h17v21H4z" stroke-width="2"/><path d="M8 1v4h9V1M8 9h10M8 13h10M8 17h8" stroke-width="1.4"/>',
      ],
    ],
  };
  const systemIcon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 3h8v5h4V3h8v18h-8v-5h-4v5H2zM4 5l4 4-3 3 4 2M20 5l-4 4 3 3-4 2"/></svg>';
  const noteIcon = '<svg viewBox="0 0 48 48" fill="none" stroke="#000" stroke-width="3"><path d="M4 3h32v39H4zM10 12h20M10 19h18M10 27h7"/><circle cx="31" cy="30" r="9" fill="white"/><path d="M38 37l8 8" stroke-width="4"/></svg>';
  function decorateNote(u, note, text, display) {
    note.classList.add('task-note');
    const icon = u.el('span', 'gem-nicon');
    icon.innerHTML = noteIcon;
    note.insertBefore(icon, note.firstChild);
    text.classList.add('gem-task');
    text.dataset.display = display;
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      if ((_c.display === 'panel' || _c.display === 'toast') && _c.W <= 1300) _c.display = 'header';
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
      document.documentElement.style.setProperty('--font', D.tokens.font);
      document.body.classList.add('gem', 'instruction-' + _c.display);
      const mb = u.el('header', 'gem-menubar', document.body);
      for (const m of D.menu) u.el('span', '', mb, m);
      u.el('span', 'gem-clock', mb, 'Mon  Apr 21  1987  10:24 AM');
      const win = u.el('section', 'gem-win', document.body);
      const tb = u.el('div', 'gem-title', win);
      u.el('span', 'gem-ticon', tb).innerHTML = systemIcon;
      u.el('span', 'gem-ttext', tb, 'App Shop');
      const ctl = u.el('span', 'gem-tctl', tb);
      for (const g of ['min', 'max', 'close']) u.el('i', 'gem-' + g, ctl);
      Object.assign(_c, { win, titlebar: tb, titleControls: ctl, header: win });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.win.querySelector('.ref-instruction');
      if (note) {
        // The header note itself is the card; wrap its text to retain the icon.
        const text = _c.util.el('p', '', null, note.textContent);
        note.textContent = '';
        note.appendChild(text);
        decorateNote(_c.util, note, text, _c.display);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.titlebar;
      base(_c);
      _c.header = header;
      _c.titlebar.insertBefore(_c.headerTools, _c.titleControls);
    },
    'frame.body': () => (_c) => {
      Object.assign(_c, { body: _c.win });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = document.body;
      base(_c);
      _c.body = body;
      const note = document.body.querySelector('.ref-panel');
      if (note) decorateNote(_c.util, note, note.querySelector('.ref-panel-text'), _c.display);
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'stage', _c.win);
      const strip = u.el('nav', 'gem-strip', _c.win);
      D.strip.forEach(([n, p], i) => {
        const b = u.el('div', 'gem-tool' + (i === 1 ? ' on' : ''), strip);
        b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linejoin="miter">' + p + '</svg><span>' + n + '</span>';
      });
      const pv = u.el('aside', 'gem-prev', document.body);
      const pt = u.el('div', 'gem-title small', pv);
      u.el('span', 'gem-ticon', pt).innerHTML = systemIcon;
      u.el('span', 'gem-ttext', pt, 'Preview');
      const pc = u.el('span', 'gem-tctl', pt);
      for (const g of ['min', 'close']) u.el('i', 'gem-' + g, pc);
      const pb = u.el('div', 'gem-pbody', pv);
      const ph = u.el('div', 'gem-phead', pb);
      const ico = u.el('div', 'gem-bigicon', ph);
      ico.innerHTML = '<i></i><i></i><i></i>';
      const pi = u.el('div', 'gem-pinfo', ph);
      u.el('b', 'gem-preview-name', pi, 'No selection');
      u.el('span', 'gem-preview-host', pi, 'Search results');
      u.el('span', 'gem-preview-path', pi, '—');
      u.el('span', 'gem-preview-date', pi, 'Updated: —');
      u.el('p', 'gem-pdesc', pb, 'Search above to view the matching results.');
      const pbtn = u.el('div', 'gem-pbtns', pb);
      for (const label of ['More Info', 'Add to Library']) {
        const b = u.el('button', label === 'More Info' ? 'gem-more-info' : 'gem-add-library', pbtn, label);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { what: label }));
      }
      _c.previewButtons = pbtn;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) decorateNote(_c.util, note, note.querySelector('.ref-note-text'), _c.display);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const tray = document.body.querySelector('.ref-foot');
      tray.classList.add('gem-tray');
      tray.querySelector('.ref-foot-text').remove();
      const icon = _c.util.el('span', 'gem-tico');
      icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.6"><path d="M3 6h8v15H3zM13 4h8v17h-8z" fill="#eee"/><path d="M7 2h9v6H7z" fill="black"/><path d="M5 11h4M15 11h4M15 14h4M15 17h4"/></svg>';
      tray.prepend(icon);
      const app = _c.util.el('span', 'gem-tbtn', null, 'App Shop');
      icon.after(app);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.previewButtons.appendChild(dock);
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
  const palette = { bg: '#9a9a9a', panel: '#ffffff', fg: '#000000', muted: '#222222', line: '#000000' };
  env.site({
    name: D.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#000000'],
      LOW_ACCENTS: ['#000000'],
      parts,
    },
  });
})();
