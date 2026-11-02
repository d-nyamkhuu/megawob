(function () {
  'use strict';
  const palette = { bg: '#f7f6f1', panel: '#f7f6f1', fg: '#161616', muted: '#555555', line: '#777777' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      const requested = _c.ctx.display || 'header';
      const small = innerWidth < 1150 || innerHeight < 670;
      _c.display = small && (requested === 'panel' || requested === 'toast') ? 'header' : requested;
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
      ['header', 'panel', 'toast', 'hidden'].forEach((x) =>
        document.body.classList.toggle('ds-display-' + x, _c.display === x));
      document.body.classList.toggle('ds-finish', !!_c.ctx.finish);
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, 'Rivermere Capital');
      u.el('span', '', top, '−    □    ×');
      const nav = u.el('nav', 'ds-menu', document.body);
      'INVEST|PLAN|RESEARCH|ACCOUNT'.split('|').forEach((t) => u.el('span', '', nav, t));
      u.el('span', 'ds-stock-date', nav, 'Mon, Apr 14, 2008  10:27 AM ET');
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      Object.assign(_c, { top, body, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        const box = _c.util.el('aside', 'ds-header-note', _c.header);
        box.appendChild(note);
        note.classList.add('ds-instruction');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.top;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-frame-tools');
      if (_c.submit) _c.submit.classList.add('ds-frame-end');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const main = u.el('div', 'ds-main', _c.content);
      const quick = u.el('aside', 'ds-quick-notes', document.body);
      u.el('h3', '', quick, 'Notes');
      const noteSlot = u.el('div', 'ds-note-slot', quick);
      u.el('p', 'ds-right-intro', quick, 'Check the current price and recent history before placing an order.');
      u.el('h4', 'ds-recent-title', quick, 'Recent Prices');
      const rt = u.el('table', 'ds-recent-table', quick);
      const rh = u.el('tr', '', u.el('thead', '', rt));
      ['Date / Time', 'Price', 'Change'].forEach((t) => u.el('th', '', rh, t));
      const rb = u.el('tbody', '', rt);
      [
        ['Apr 14, 10:27 AM', '52.18', '+0.67'],
        ['Apr 14, 9:54 AM', '51.96', '+0.45'],
        ['Apr 11, 4:00 PM', '52.03', '-0.12'],
        ['Apr 10, 4:00 PM', '51.44', '-0.38'],
        ['Apr 9, 4:00 PM', '51.82', '+0.21'],
        ['Apr 8, 4:00 PM', '51.61', '-0.06'],
      ].forEach((row) => {
        const tr = u.el('tr', '', rb);
        row.forEach((v) => u.el('td', '', tr, v));
      });
      u.el('ul', 'ds-quick-values', quick);
      Object.assign(_c, { main, quick, noteSlot });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
      const text = _c.noteSlot.querySelector('.ref-panel-text');
      if (text) text.classList.add('ds-instruction');
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
      _c.content.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
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
    name: 'design-act-in-time-stock-10',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#a41412'], LOW_ACCENTS: ['#a41412'], parts,
    },
  });
})();
