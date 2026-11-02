(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#101725', muted: '#4a5568', line: '#8a97ab' };
  function box(u, title, parent) {
    const p = u.el('section', 'ds-box', parent);
    u.el('h3', '', p, title);
    return p;
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
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
      const brand = u.el('div', 'ds-brandbox', top);
      u.el('div', 'ds-brand', brand, 'Riverside Manufacturing');
      u.el('div', 'ds-brandsub', brand, 'CLIENT INFORMATION SYSTEM');
      const links = u.el('div', 'ds-toplinks', top);
      links.innerHTML = 'Welcome, <b>jsmith</b><i>|</i>Help<i>|</i>Log Out';
      u.el('div', 'ds-date', top, 'Thu, Apr 15, 1999');
      const nav = u.el('nav', 'ds-menu', document.body);
      'Home|Clients|Orders|Reports|Administration'.split('|').forEach((t) => u.el('span', '', nav, t));
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const side = u.el('aside', 'ds-side', body);
      const panel = u.el('section', 'ds-panel', content);
      const title = u.el('h1', 'ds-title', panel, 'Data Entry Task');
      Object.assign(_c, { body, side, panel, title, header: panel });
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
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const td = box(u, 'Task Details', _c.side);
      const tb = u.el('table', 'ds-kv', td);
      [ ['Task ID:', 'C-1047'], ['Task type:', 'Form entry'], ['Due date:', 'Apr 15, 1999'], ['Status:', 'Not started'] ].forEach(([k, v]) => {
        const r = u.el('tr', '', tb);
        u.el('th', '', r, k);
        u.el('td', '', r, v);
      });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.side;
      base(_c);
      _c.body = body;
      const fn = box(_c.util, 'Field Notes', _c.side);
      _c.util.el('p', '', fn, 'Leave a field empty if its information is not mentioned in the profile. Copy only the information provided.');
    },
    'frame.stage': () => (_c) => {
      const main = _c.util.el('div', 'ds-main', _c.panel);
      _c.stage = _c.util.el('main', 'ds-stage', main);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.panel.insertBefore(note, _c.panel.querySelector('.ds-main'));
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.panel.appendChild(foot);
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
    name: 'design-fill-form-card-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-fill-form-card-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#14305c'],
      LOW_ACCENTS: ['#14305c'],
      parts,
    },
  });
})();
