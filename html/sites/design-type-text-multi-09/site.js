(function () {
  'use strict';
  const palette = { bg: '#f4f7fb', panel: '#f4f7fb', fg: '#1a1f26', muted: '#5a6676', line: '#b9c6d8' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-corner', top);
      u.el('span', 'ds-brand', top, 'FreightTrack');
      u.el('span', 'ds-sub', top, 'Customer Management System');
      const who = u.el('span', 'ds-who', top);
      u.el('span', '', who, 'Logged in as: jsmith');
      u.el('span', 'ds-sep', who, '|');
      u.el('u', '', who, 'Help');
      u.el('span', 'ds-sep', who, '|');
      u.el('u', '', who, 'Sign Out');
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      for (let i = 1; i <= 10; i++) u.el('div', 'ds-idx' + (i === 1 ? ' on' : ''), rail, String(i));
      const content = u.el('div', 'ds-content', body);
      Object.assign(_c, { header: content, toolbar: who, siteBody: body, contentPane: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.siteBody;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.contentPane;
      base(_c);
      _c.body = body;
      const panel = _c.contentPane.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-panel');
        panel.querySelector('.ref-panel-title').classList.add('ds-panel-title');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const main = u.el('div', 'ds-main', _c.contentPane);
      _c.main = main;
      _c.stage = u.el('main', 'ds-stage', main);
      const contact = u.el('section', 'ds-contact', main);
      contact.setAttribute('aria-hidden', 'true');
      u.el('div', 'ds-bar', contact, 'Contact Information (optional)');
      const cb = u.el('div', 'ds-cbody', contact);
      ['Contact name:', 'Phone (optional):', 'Email (optional):'].forEach((t) => {
        const r = u.el('div', 'ds-crow', cb);
        u.el('span', '', r, t);
        u.el('div', 'ds-fake', r);
      });
      const foot = u.el('footer', 'ds-footer', _c.contentPane);
      for (const label of ['Clear Form', 'Cancel']) {
        const b = u.el('button', 'ds-btn', foot, label);
        b.type = 'button';
        b.tabIndex = -1;
      }
      u.el('span', 'ds-grow', foot);
      _c.statusBar = foot;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.contentPane.insertBefore(note, _c.main);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.statusBar.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.statusBar.appendChild(dock);
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
    name: 'design-type-text-multi-09',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-type-text-multi-09': palette },
      LOW_THEME: palette,
      ACCENTS: ['#3d5f8f'],
      LOW_ACCENTS: ['#3d5f8f'],
      parts,
    },
  });
})();
