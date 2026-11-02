(function () {
  'use strict';
  const C = {
    site: 'design-find-fact-chart-03',
    tabs: [
      ['▂▅▇', 'Insights'],
      ['▰', 'Projects'],
      ['●●', 'People'],
      ['◉', 'Resources'],
      ['⚙', 'Settings'],
    ],
  };
  const palette = {
    bg: '#f4f7fb', panel: '#f7f9fc', fg: '#102448', muted: '#66799d', line: '#d3dfed',
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All four notes used this frame's content pane at every viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const top = u.el('header', 'ds-top', document.body);
      const nav = u.el('nav', 'ds-tabs', top);
      C.tabs.forEach((it, i) => {
        const t = u.el('div', 'ds-tab' + (i === 0 ? ' active' : ''), nav);
        u.el('span', 'ds-icon', t, it[0]);
        u.el('span', '', t, it[1]);
      });
      const tools = u.el('div', 'ds-tools', top);
      const content = u.el('div', 'ds-content', document.body);
      const header = _c.display === 'header' ? u.el('aside', 'ds-header-note', content) : content;
      Object.assign(_c, { top, tools, content, header });
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
      _c.body = _c.content;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.content.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-text').classList.add('ds-instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.content);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        note.querySelector('.ref-note-text').classList.add('ds-instruction');
        _c.content.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) {
        foot.querySelector('.ref-foot-text').textContent = 'Ready';
        _c.content.appendChild(foot);
      }
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.content.appendChild(dock);
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
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-chart-03': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1764f5'],
      LOW_ACCENTS: ['#1764f5'],
      parts,
    },
  });
})();
