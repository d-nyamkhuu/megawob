(function () {
  'use strict';
  const palette = { bg: '#e8e8e6', panel: '#f0f0ee', fg: '#000000', muted: '#222222', line: '#000000' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
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
      u.el('span', 'ds-brand', top, 'TOS');
      ['File', 'Edit', 'View', 'Desk', 'Options'].forEach((t) => u.el('span', 'ds-mi', top, t));
      u.el('span', 'ds-clock', top, 'Mon  Mar 10  1986  10:24');
      const desktop = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', desktop);
      [
        ['Disk A', 'M3 1h16l3 3v19H3z M7 2v8h10V2 M6 13h13v9H6z M9 16h7 M9 19h7'],
        ['Files', 'M4 1h12l5 5v17H4z M16 1v6h5 M7 10h11 M7 14h11 M7 18h11'],
        ['Mail', 'M1 3h22v18H1z M3 5h18v14H3z M3 5l9 8 9-8 M3 19l6-7 M21 19l-6-7'],
        ['Apps', 'M2 2h20v19H2z M5 5h14v13H5z M5 20h14'],
        ['Trash', 'M4 6h16v17H4z M2 4h20v3H2z M8 1h8v3H8z M8 9v12 M12 9v12 M16 9v12'],
      ].forEach(([t, d]) => {
        const it = u.el('div', 'ds-ico' + (t === 'Mail' ? ' sel' : ''), rail);
        it.innerHTML = '<svg viewBox="0 0 24 24" width="40" height="40" fill="#eee" stroke="#000" stroke-width="2" stroke-linejoin="miter"><path d="' + d + '"/></svg>';
        if (t === 'Mail') it.querySelector('svg').innerHTML = '<rect x="1" y="3" width="22" height="18" fill="#eee"/><rect x="3" y="5" width="18" height="14" fill="#eee" stroke-width="1"/><path d="M3 5l9 8 9-8 M3 19l6-7 M21 19l-6-7" fill="none" stroke-width="1"/>';
        if (t === 'Disk A') it.querySelector('svg').innerHTML = '<path d="M3 1h16l3 3v19H3z" fill="#111"/><path d="M7 2h10v8H7z M6 13h13v9H6z" fill="#eee" stroke-width="1"/><path d="M13 3v5 M8 15h9 M8 18h9 M8 20h9" fill="none" stroke-width="1"/>';
        if (t === 'Apps') it.querySelector('svg').insertAdjacentHTML('beforeend', '<path fill="#111" stroke="none" d="M5 5h14v13H5z"/><path stroke="#eee" stroke-width="1" d="M6 6h3"/>');
        u.el('span', '', it, t);
      });
      const content = u.el('div', 'ds-content', desktop);
      const toolbar = u.el('div', 'ds-wintitle', content);
      u.el('i', 'gem-box', toolbar);
      u.el('span', '', toolbar, 'Mail - Customer Inquiry');
      u.el('i', 'gem-box r', toolbar);
      const header = u.el('aside', _c.display === 'header' ? 'ds-brief' : 'gem-note-slot');
      Object.assign(_c, { content, toolbar, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('gem-chrome-tools');
      _c.toolbar.insertBefore(_c.headerTools, _c.toolbar.lastElementChild);
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'ds-main', _c.content);
      body.dataset.display = _c.display;
      if (_c.display === 'header') body.appendChild(_c.header);
      Object.assign(_c, { body });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
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
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.content.appendChild(foot);
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
    name: 'design-fill-form-email-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-fill-form-email-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#000000'],
      LOW_ACCENTS: ['#000000'],
      parts,
    },
  });
})();
