(function () {
  'use strict';
  const palette = { bg: '#f5f0e4', panel: '#f5f0e4', fg: '#5e1f28', muted: '#7a6f66', line: '#b9aca0' };
  const guidance = (u, parent) => u.el('div', 'ds-guidance', parent,
    'Select the start date and end date to find items added to the catalog.');
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const { util: u, ctx } = _c;
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('span', 'ds-logo', top);
      logo.innerHTML =
        '<svg width="80" height="58" viewBox="0 0 80 58" fill="none" stroke="#6b1d2a" stroke-width="2.4"><path d="M40 10C30 4 16 4 9 6v43c12-2 22-1 31 4 9-5 19-6 31-4V6C60 4 50 4 40 10zM40 10v43M5 10v43l31-3M75 10v43l-31-3M2 14v42l32-4M78 14v42l-32-4M14 12c7-1 15 0 21 3M14 18c7-1 15 0 21 3M14 24c7-1 15 0 21 3M14 30c7-1 15 0 21 3M14 36c7-1 15 0 21 3M14 42c7-1 15 0 21 3M66 12c-7-1-15 0-21 3M66 18c-7-1-15 0-21 3M66 24c-7-1-15 0-21 3M66 30c-7-1-15 0-21 3M66 36c-7-1-15 0-21 3M66 42c-7-1-15 0-21 3"/></svg>';
      const bx = u.el('span', 'ds-brandbox', top);
      u.el('span', 'ds-brand', bx, 'Rivermere Public Library');
      u.el('span', 'ds-tag', bx, 'CATALOG  •  RESEARCH  •  LEARN  •  DISCOVER');
      const nav = u.el('nav', 'ds-menu', top);
      'Home|Catalog Search|Research Tools|Help'.split('|').forEach((t) => u.el('span', '', nav, t));
      const frame = u.el('div', 'ds-frame', document.body);
      const banner = u.el('div', 'ds-banner', frame);
      u.el('span', '', banner, 'Search the Library Catalog');
      const motto = u.el('i', '', banner, 'Knowledge Endures');
      const swash = u.el('span', 'ds-swash', motto);
      swash.innerHTML =
        '<svg viewBox="0 0 60 24" fill="none" stroke="#fff" stroke-width="1.2"><path d="M29 13C13 0 0 6 4 12c4 6 18-1 26 1s22 9 27 1c4-7-9-7-8-3M15 10c12 0 19 9 29 6M23 5c8 1 11 10 18 10"/></svg>';
      const body = u.el('div', 'ds-body', frame);
      const content = u.el('div', 'ds-content', body);
      document.body.dataset.instruction = { header: 'top', panel: 'left', toast: 'toast', hidden: 'hidden' }[_c.display];
      document.body.classList.toggle('ds-finish', !!ctx.finish);
      Object.assign(_c, { top, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-header-note');
        const text = note.textContent;
        note.textContent = '';
        _c.util.el('div', 'ds-instruction', note, text);
        guidance(_c.util, note);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const note = _c.body.querySelector('.ref-panel');
      if (note) {
        note.classList.add('ds-brief');
        note.querySelector('.ref-panel-title').textContent = 'Your Task';
        note.querySelector('.ref-panel-text').classList.add('ds-instruction');
        guidance(_c.util, note);
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        guidance(_c.util, note);
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.dataset.end = _c.ctx.finish ? 'none' : ['footer', 'link'].includes(_c.placement) ? _c.placement : 'header';
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.content.appendChild(foot);
      _c.foot = foot;
      const pf = _c.util.el('footer', 'ds-pagefoot', document.body);
      _c.util.el('span', '', pf, 'Rivermere Public Library');
      _c.util.el('span', 'ds-pf2', pf, 'BOOKS   BUILD   BRIGHTER   LIVES');
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
        cookie: 'We use cookies to remember your catalog preferences.',
        toast: 'Your catalog preferences have been saved.',
        chat: 'Ask a librarian. How can we help?',
        promo: 'Discover more with your library card.',
        banner: 'Catalog maintenance is scheduled for tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-set-date-range-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-set-date-range-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#5e1f28'],
      LOW_ACCENTS: ['#5e1f28'],
      parts,
    },
  });
})();
