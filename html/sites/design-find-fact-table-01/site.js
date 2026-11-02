(function () {
  'use strict';
  const palette = {
    bg: '#396a95', panel: '#f7f7f5', fg: '#102c4c', muted: '#66707d', line: '#bbc2c9',
  };
  const parts = {
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
      u.el('span', 'ds-brand', top, 'Employee Records');
      const stamp = u.el('div', 'ds-directory-stamp', top);
      u.el('div', '', stamp, 'Workplace Directory');
      u.el('div', '', stamp, 'Mon, Apr 14, 2003');
      const rings = u.el('div', 'ds-binding', document.body);
      for (let i = 0; i < 20; i++) u.el('i', '', rings);
      // The note belongs inside the directory sheet, below the title bar.
      const content = u.el('div', 'ds-content');
      Object.assign(_c, { top, content, header: content });
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'ds-menu', document.body);
      _c.util.el('span', '', nav, 'Workplace Directory');
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      for (const text of ['People', 'Projects', 'Reports', 'Resources', 'Settings']) u.el('div', '', rail, text);
      body.appendChild(_c.content);
      const main = u.el('div', 'ds-main', _c.content);
      Object.assign(_c, { body, main });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.main;
      base(_c);
      _c.body = body;
      const panel = _c.main.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-title').textContent = 'Instructions';
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
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
      const u = _c.util;
      const notes = u.el('section', 'ds-directory-notes', _c.content);
      u.el('h3', '', notes, 'Notes');
      const list = u.el('ul', '', notes);
      for (const text of ['Each field must match the information in the table.', 'All requested fields are required.']) u.el('li', '', list, text);
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.content.appendChild(foot);
      if (_c.placement === 'icon' && _c.submit) foot.querySelector('.ref-tools').appendChild(_c.submit);
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
    name: 'design-find-fact-table-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-table-01': palette },
      LOW_THEME: palette,
      ACCENTS: ['#537fa4'],
      LOW_ACCENTS: ['#537fa4'],
      parts,
    },
  });
})();
