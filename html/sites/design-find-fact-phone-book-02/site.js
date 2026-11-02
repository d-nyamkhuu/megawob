(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#000', muted: '#000', line: '#000' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original window has room for its inline toast at every size.
      _c.display = _c.ctx.display || 'header';
      if (_c.W <= 1100 && _c.display === 'panel') _c.display = 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const apple = u.el('span', 'ds-brand', top);
      apple.innerHTML = '<svg viewBox="0 0 32 36" aria-label="Apple"><path d="M19 8c0-4 3-7 7-7 0 4-3 7-7 7ZM25 10c-4-2-6 0-9 0-3 0-5-2-8 0-9 5-4 22 3 24 3 1 4-2 7-2s4 3 7 1c3-2 5-6 6-9-7-2-8-10-1-13Z"/></svg>';
      ['File', 'Edit', 'View', 'Special', 'Help'].forEach((t) => u.el('span', 'ds-mi', top, t));
      const statusIcon = u.el('span', 'ds-status-icon', top);
      statusIcon.innerHTML = '<svg viewBox="0 0 24 30" fill="white" stroke="black" stroke-width="2"><path d="M4 7h4V2h12v25H2V7h2Zm4 0v8h9V7ZM6 19h10v5H6Z"/><path d="m10 8 4-4 3 4-3 5Z" fill="black"/></svg>';
      u.el('span', 'ds-clock', top, '10:24 AM');
      ['Macintosh HD|hd', 'Notes|notes', 'Trash|trash'].forEach((s) => {
        const p = s.split('|');
        const ic = u.el('div', 'ds-icon ds-icon-' + p[1], document.body);
        const glyph = u.el('div', 'ds-glyph', ic);
        const paths = {
          hd: '<path d="M10 7h40l3 31H7Z"/><path d="M4 39h52v15H4Z"/><path d="M19 7v5h23V7M39 45h10v4H39Z"/>',
          notes: '<path d="M10 2h31l13 14v44H10Z"/><path d="M41 2v15h13M18 23h27M18 30h27M18 37h27M18 44h27M18 51h27"/>',
          trash: '<path d="M12 15h38l-3 45H16Z"/><path d="M8 10h46v6H8ZM20 10V5h23v5M22 23v30M30 23v30M38 23v30"/>',
        };
        glyph.innerHTML = '<svg viewBox="0 0 64 64" fill="white" stroke="black" stroke-width="3" stroke-linejoin="miter">' + paths[p[1]] + '</svg>';
        u.el('span', '', ic, p[0]);
      });
      const shell = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', shell);
      ['Contacts', 'Calendar', 'Notes', 'Settings'].forEach((t) => u.el('div', '', rail, t));
      const content = u.el('div', 'ds-content', shell);
      const toolbar = u.el('div', 'ds-titlebar', content);
      u.el('span', 'ds-close', toolbar);
      u.el('span', 'ds-ttl', toolbar, 'Contact Book');
      Object.assign(_c, { content, toolbar, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-title-tools');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-brief');
      const title = _c.body.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Instructions';
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const side = u.el('div', 'ds-side', _c.body);
      u.el('div', '', side, 'Search:');
      const searchBox = u.el('input', 'ds-sbox', side);
      searchBox.type = 'text';
      searchBox.readOnly = true;
      searchBox.setAttribute('aria-label', 'Search contacts');
      searchBox.title = 'Search is available in search episodes';
      u.el('div', '', side, 'Groups:');
      const gl = u.el('div', 'ds-groups', side);
      ['All Contacts', 'Friends', 'Work', 'Family', 'Other'].forEach((t, i) => u.el('div', i ? '' : 'sel', gl, t));
      _c.stage = u.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      const text = foot.querySelector('.ref-foot-text');
      text.classList.add('ds-contact-total');
      text.textContent = 'Contacts';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-find-fact-phone-book-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-phone-book-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000'],
      LOW_ACCENTS: ['#000'],
      parts,
    },
  });
})();
