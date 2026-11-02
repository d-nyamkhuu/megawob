(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#fff', fg: '#131313', muted: '#52667a', line: '#c7e6fb' };
  function styleControls(parent, header) {
    parent.querySelectorAll('.ref-submit').forEach((b) => {
      b.classList.add('ds-submit');
      if (header) b.classList.add('ds-submit-header');
    });
    parent.querySelectorAll('.ref-endlink').forEach((b) => b.classList.add('ds-end-link'));
    parent.querySelectorAll('.ref-xtra').forEach((b) => b.classList.add('ds-end-xtra'));
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Preserve the original frame's note modes and compact breakpoint.
      _c.display = _c.ctx.display || 'header';
      if (_c.display === 'panel' && _c.W < 1100) _c.display = 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
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
      const logo = u.el('span', 'ds-logo', top);
      u.el('i', '', logo);
      u.el('i', '', logo);
      const bt = u.el('span', 'ds-brandbox', top);
      u.el('span', 'ds-brand', bt, 'My Contact Book');
      u.el('span', 'ds-tag', bt, 'People  •  Keep in Touch  •  A Brighter Day');
      const sb = u.el('div', 'ds-sbox', top);
      const searchInput = u.el('input', 'ds-contact-search', sb);
      searchInput.type = 'text';
      searchInput.placeholder = 'Search contacts...';
      searchInput.setAttribute('aria-label', 'Search contacts');
      const searchButton = u.el('button', 'ds-search-go', sb);
      searchButton.type = 'button';
      searchButton.title = 'Search contacts';
      searchButton.setAttribute('aria-label', 'Search contacts');
      searchButton.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="10" cy="10" r="6.5"/><path d="m15 15 6 6"/></svg>';
      const content = u.el('div', 'ds-content');
      Object.assign(_c, { top, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.content.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
      const spacer = _c.content.querySelector('.ref-spacer');
      if (spacer) spacer.remove();
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      styleControls(_c.headerTools, true);
      if (_c.headerTools.querySelector('.ref-icon')) {
        _c.top.insertBefore(_c.headerTools, _c.top.querySelector('.ds-sbox'));
      }
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'ds-body', document.body);
      body.appendChild(_c.content);
      const main = _c.util.el('div', 'ds-main', _c.content);
      Object.assign(_c, { body, main });
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.main });
      const panel = _c.main.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      _c.stage = u.el('main', 'ds-stage', _c.main);
      if (_c.display !== 'panel') {
        const side = u.el('aside', 'ds-side', _c.main);
        u.el('div', 'ds-side-h', side, 'Contact Details');
        const sb2 = u.el('div', 'ds-side-b', side);
        u.el('div', 'ds-avatar', sb2);
        u.el('div', 'ds-side-t', sb2, 'No contact selected');
        u.el('div', 'ds-side-s', sb2, 'Choose a contact from the list to view their details here.');
      }
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'My Contact Book  |  Stay Connected';
      if (!_c.ctx.finish) {
        const clr = _c.util.el('button', 'ds-clear', foot, 'Clear Selection');
        clr.type = 'button';
      }
      styleControls(foot, false);
      const link = foot.querySelector('.ref-endlink');
      if (link) foot.insertBefore(link, foot.firstChild);
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.foot.insertBefore(dock, _c.foot.firstChild);
        styleControls(dock, false);
      }
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
    name: 'design-find-fact-phone-book-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-phone-book-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0b5fc4'],
      LOW_ACCENTS: ['#0b5fc4'],
      parts,
    },
  });
})();
