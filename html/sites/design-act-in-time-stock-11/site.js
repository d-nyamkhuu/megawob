(function () {
  'use strict';
  const palette = { bg: '#071d2b', panel: '#09283a', fg: '#c5dff2', muted: '#8eb3ce', line: '#287092' };
  function drawSidePanes(u) {
    const quick = u.el('aside', 'ds-quick-notes', document.body);
    u.el('h3', '', quick, 'Notifications (5)');
    u.el('ul', 'ds-quick-values', quick);
    const notices = u.el('section', 'ds-notifications', quick);
    [
      ['✉', 'News Alert', '10:12 AM', 'Market update: tech stocks rally further today.'],
      ['♟', 'Watchlist Update', '10:09 AM', '3 symbols hit new 52-week highs.'],
      ['▤', 'System Message', '10:06 AM', 'Platform maintenance scheduled this weekend.'],
      ['▥', 'Research Note', '10:03 AM', 'New report available on renewable energy sector.'],
      ['◆', 'Promotion', '9:58 AM', 'Get 3 months of real-time data at a discount.'],
    ].forEach((a) => {
      const n = u.el('article', 'ds-notification', notices);
      n.dataset.icon = a[0];
      u.el('b', '', n, a[1]);
      u.el('small', '', n, a[2]);
      u.el('span', '', n, a[3]);
      u.el('i', '', n, '×');
    });
    const dismiss = u.el('button', 'ds-dismiss-all', quick, 'Dismiss all');
    dismiss.type = 'button';
    dismiss.addEventListener('click', () => { notices.remove(); dismiss.remove(); });
    const preview = u.el('aside', 'ds-preview', document.body);
    u.el('div', 'ds-preview-title', preview, 'Preview – JCA');
    u.el('div', 'ds-preview-plot', preview);
  }
  const parts = {
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
      u.el('span', 'ds-brand', top, 'Stock Watcher');
      const topTools = u.el('div', 'ds-top-tools', top);
      u.el('span', 'ds-window-buttons', top, '−    □    ×');
      Object.assign(_c, { top, topTools, header: top });
    },
    'frame.nav': () => (_c) => {
      const nav = _c.util.el('nav', 'ds-menu', document.body);
      'Watch|Charts|Orders|Notes|Settings'.split('|').forEach((t) => _c.util.el('span', '', nav, t));
      _c.util.el('span', 'ds-stock-date', nav, 'Apr 26, 2018  10:24 AM');
      _c.util.el('span', 'ds-window-buttons ds-nav-window-buttons', nav, '−    □    ×');
    },
    'frame.instruction': (base) => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const header = _c.header;
      if (_c.display === 'header') {
        _c.header = u.el('aside', 'ds-header-note', content);
        base(_c);
        const ins = _c.header.querySelector('.ref-instruction');
        ins.classList.add('ds-instruction');
        let fs = _c.H > 820 ? 50 : 31;
        while (fs > 20) {
          ins.style.fontSize = fs + 'px';
          if (ins.getBoundingClientRect().height <= (_c.H > 820 ? 62 : 40)) break;
          fs -= 1;
        }
      } else {
        base(_c);
      }
      _c.header = header;
      Object.assign(_c, { body, content });
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.topTools;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.main = _c.util.el('div', 'ds-main', _c.content);
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
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      if (_c.placement === 'link') foot.classList.add('ds-footer-link');
      _c.content.appendChild(foot);
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('ds-ready');
      ready.textContent = 'Ready';
      _c.foot = foot;
      drawSidePanes(_c.util);
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
    name: 'design-act-in-time-stock-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#ffd51c'],
      LOW_ACCENTS: ['#ffd51c'],
      parts,
    },
  });
})();
