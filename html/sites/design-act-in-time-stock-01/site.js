(function () {
  'use strict';
  const palette = { bg: '#687176', panel: '#f3f0e9', fg: '#19252b', muted: '#66707d', line: '#bbc2c9' };
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
      u.el('span', 'ds-brand', top, 'Stock Watcher');
      u.el('span', '', top, '−    □    ×');
      const menu = u.el('nav', 'ds-menu', document.body);
      'Watch|Charts|Orders|Notes|Settings'.split('|').forEach((t) => u.el('span', '', menu, t));
      const date = u.el('span', 'ds-stock-date', menu, 'Apr 26, 2018  10:24 AM');
      const content = u.el('div', 'ds-content');
      Object.assign(_c, { menu, date, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        const box = _c.util.el('aside', 'ds-header-note', _c.content);
        note.classList.add('ds-instruction');
        box.appendChild(note);
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
      _c.menu.insertBefore(_c.headerTools, _c.date);
    },
    'frame.body': () => (_c) => {
      const outer = _c.util.el('div', 'ds-body', document.body);
      outer.appendChild(_c.content);
      const body = _c.util.el('div', 'ds-main', _c.content);
      const note = _c.content.querySelector('.ref-instruction');
      if (note) {
        let fs = _c.H > 820 ? 50 : 31;
        while (fs > 20) {
          note.style.fontSize = fs + 'px';
          if (note.getBoundingClientRect().height <= (_c.H > 820 ? 62 : 40)) break;
          fs -= 1;
        }
      }
      Object.assign(_c, { body });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        _c.body.classList.remove('ref-panel-right');
        panel.querySelector('.ref-panel-title').textContent = 'Instructions';
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
        _c.content.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.content.appendChild(foot);
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      const clear = _c.util.el('button', 'ds-clear', foot, 'Clear');
      clear.type = 'button';
      foot.insertBefore(clear, foot.querySelector('.ref-tools'));
      const quick = _c.util.el('aside', 'ds-quick-notes', document.body);
      _c.util.el('h3', '', quick, '▤ Quick Notes');
      _c.util.el('ul', 'ds-quick-values', quick);
      const info = _c.util.el('ul', 'ds-workspace-values', quick);
      ['Market overview', 'Live price history', 'Order workspace'].forEach((text) => _c.util.el('li', '', info, text));
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.insertBefore(dock, _c.foot.firstChild);
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
    name: 'design-act-in-time-stock-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#f06823'],
      LOW_ACCENTS: ['#f06823'],
      parts,
    },
  });
})();
