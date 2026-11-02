(function () {
  'use strict';
  const palette = { bg: '#eeeae1', panel: '#f8f7f2', fg: '#101f53', muted: '#53617f', line: '#b7c0cf' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // Every note mode fits in this design's paper margin.
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
      u.el('span', 'ds-brand', top, 'Maple Grove Online');
      u.el('span', '', top, '');
      const header = u.el('aside', 'ds-header-note', document.body);
      header.hidden = _c.display !== 'header';
      const toolbar = u.el('div', 'ds-toolbar', document.body);
      Object.assign(_c, { header, toolbar });
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'ds-menu', document.body);
      'Quotes|News|Watchlist|Community|Notes|Settings|Help'.split('|').forEach((t) => _c.util.el('span', '', nav, t));
      _c.util.el('span', 'ds-stock-date', nav, 'Mon, Apr 28, 1996  10:24 AM');
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const ins = _c.header.querySelector('.ref-instruction');
      if (ins) {
        ins.classList.add('ds-instruction');
        let fs = _c.H > 820 ? 50 : 31;
        while (fs > 20) {
          ins.style.fontSize = fs + 'px';
          if (ins.getBoundingClientRect().height <= (_c.H > 820 ? 240 : 190)) break;
          fs -= 1;
        }
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      const quick = u.el('aside', 'ds-quick-notes', document.body);
      u.el('h3', '', quick, 'Maple Grove Online 1996');
      u.el('ul', 'ds-quick-values', quick);
      Object.assign(_c, { body, content, main });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.main;
      base(_c);
      _c.body = body;
      const panel = _c.main.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
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
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.content.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.toolbar.appendChild(dock);
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
    name: 'design-act-in-time-stock-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-stock-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#244dc0'],
      LOW_ACCENTS: ['#244dc0'],
      parts,
    },
  });
})();
