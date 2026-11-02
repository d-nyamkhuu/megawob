(function () {
  'use strict';
  const C = {
    site: 'design-find-fact-phone-book-05',
    brand: 'City of Riverton',
    sub: 'Community Portal',
    nav: 'Home|Services|Contact Book|Help',
  };
  const palette = { bg: '#fff', panel: '#fff', fg: '#1d2433', muted: '#4a5568', line: '#d5dae1' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This design has a dedicated note pane even in the smallest viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const br = u.el('div', 'ds-brandbox', top);
      br.innerHTML =
        '<svg width="44" height="44" viewBox="0 0 44 44" fill="#fff"><path d="M22 3 3 12v4h38v-4zM6 19h5v16H6zm9 0h5v16h-5zm9 0h5v16h-5zm9 0h5v16h-5zM3 37h38v4H3z"/></svg>';
      const bt = u.el('div', 'ds-brandtext', br);
      u.el('div', 'ds-brand', bt, C.brand);
      u.el('div', 'ds-sub', bt, C.sub);
      const nav = u.el('nav', 'ds-menu', top);
      C.nav.split('|').forEach((t) => u.el('span', t === 'Contact Book' ? 'on' : '', nav, t));
      const acct = u.el('div', 'ds-acct', top);
      u.el('span', 'ds-avatar', acct);
      u.el('span', '', acct, 'My Account');
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      const side = u.el('aside', 'ds-side', body);
      Object.assign(_c, { header: top, body, main, side });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.side;
      base(_c);
      _c.header = header;
      const note = _c.side.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => { base(_c); },
    'frame.body': () => () => {},
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.side;
      base(_c);
      _c.body = body;
      const panel = _c.side.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-panel-note');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.side.append(note);
      }
      const u = _c.util;
      const pv = u.el('div', 'ds-preview', _c.side);
      u.el('h3', '', pv, 'Contact Preview');
      const pb = u.el('div', 'ds-pvbody', pv);
      pb.innerHTML =
        '<svg width="82" height="82" viewBox="0 0 82 82" fill="#a9afb8"><circle cx="41" cy="22" r="21"/><path d="M0 82c0-22 12-32 41-32s41 10 41 32z"/></svg>';
      u.el('span', 'ds-preview-detail', pb, 'No contact selected.');
      _c.preview = pv;
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.querySelector('.ref-foot-text').remove();
        if (_c.placement === 'link') _c.side.append(foot);
        else _c.side.insertBefore(foot, _c.preview);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.side.insertBefore(dock, _c.preview);
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
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-phone-book-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1b4f8f'],
      LOW_ACCENTS: ['#1b4f8f'],
      parts,
    },
  });
})();
