(function () {
  'use strict';
  const palette = { bg: '#fff', panel: '#f6f7f9', fg: '#222', muted: '#667', line: '#b9c0c8' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original invoice has room for its margin note at every viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const brand = u.el('span', 'ds-brand', top);
      u.el('b', '', brand, 'Acme');
      brand.append(' Finance');
      const nav = u.el('nav', 'ds-menu', top);
      'Invoices|Expenses|Vendors|Reports|Admin'.split('|').forEach((t) => u.el('span', '', nav, t));
      const ut = u.el('nav', 'ds-util', top);
      'Help|Sign out'.split('|').forEach((t) => u.el('span', '', ut, t));
      const tools = u.el('div', 'ds-tools', top);
      const main = u.el('div', 'ds-main');
      const header = u.el('aside', 'ds-brief' + (_c.display === 'panel' ? ' ds-brief-panel' : ''), main);
      header.hidden = _c.display !== 'header' && _c.display !== 'panel';
      Object.assign(_c, { top, tools, main, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tools;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'ds-body', document.body);
      const content = _c.util.el('div', 'ds-content', body);
      content.dataset.instruction = _c.display === 'header' ? 'left' : _c.display;
      content.appendChild(_c.main);
      Object.assign(_c, { body, content });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const title = _c.header.querySelector('.ref-panel-title');
      if (title) title.textContent = 'Invoice entry instructions';
      const note = _c.header.querySelector('.ref-panel-text');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.main);
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
      const u = _c.util;
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      foot.querySelector('.ref-foot-text').remove();
      const actions = u.el('div', 'ds-btns', foot);
      actions.appendChild(foot.querySelector('.ref-tools'));
      const margin = u.el('div', 'ds-margin-end', foot);
      const notes = u.el('div', 'ds-notes', foot);
      u.el('b', '', notes, 'Notes:');
      const ul = u.el('ul', '', notes);
      ['Enter the information exactly as it appears on the invoice.', 'If the invoice does not mention a field, leave it empty.'].forEach((t) => u.el('li', '', ul, t));
      Object.assign(_c, { foot, margin });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.margin.appendChild(dock);
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
    name: 'design-fill-form-invoice-05',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-fill-form-invoice-05': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1f66c2'],
      LOW_ACCENTS: ['#1f66c2'],
      parts,
    },
  });
})();
