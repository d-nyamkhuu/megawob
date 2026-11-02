(function () {
  'use strict';
  const palette = { bg: '#85898b', panel: '#dedfdd', fg: '#17191a', muted: '#44484a', line: '#9b9d9e' };
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
      u.el('span', 'ds-brand', top, 'RISC OS');
      u.el('span', 'ds-system-date', top, 'Mon 12 Jun 1989  10:24');
      const nav = u.el('nav', 'ds-menu', document.body);
      u.el('span', 'ds-fruit', nav, '●');
      'File|Edit|View|Help'.split('|').forEach((t) => u.el('span', '', nav, t));
      const title = u.el('div', 'ds-window-title', document.body);
      u.el('span', '', title, 'Share Dealing');
      u.el('button', 'ds-window-close', title, '×');
      const shell = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', shell);
      const bar = u.el('nav', 'ds-appbar', content);
      ['Desk', 'Apps', 'Net', 'Share Dealing', 'Prices', 'Watchlist', 'Settings'].forEach((t, i) => {
        const item = u.el('div', 'ds-appitem' + (i === 3 ? ' selected' : ''), bar);
        u.el('span', 'ds-appicon icon-' + i, item, ['⌂', '▱', '◉', '▤', '▥', '▤', '⚒'][i]);
        u.el('span', '', item, t);
      });
      Object.assign(_c, { content, bar, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) {
        const box = _c.util.el('aside', 'ds-header-note');
        text.before(box);
        box.appendChild(text);
        text.classList.add('ds-instruction');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.bar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        const title = panel.querySelector('.ref-panel-title');
        title.textContent = 'Task Briefing';
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
    name: 'design-act-in-time-stock-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-stock-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2752c8'],
      LOW_ACCENTS: ['#2752c8'],
      parts,
    },
  });
})();
