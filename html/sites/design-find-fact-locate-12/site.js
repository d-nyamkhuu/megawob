(function () {
  'use strict';
  const C = {
    site: 'design-find-fact-locate-12',
    brand: 'Technical Reference Library',
    rail: 'Help & Tips|Use the document to find the information you need.|You can:|• Read the sections|• Use the Find button (Ctrl+F) to search for a word|• Scroll to see more content|Each section lists names with their associated extensions or reference numbers.|Only the first section is shown. Click a section heading to expand it, or use Expand all to show every section.',
    menu: 'File|Edit|View|Go|Tools|Help',
  };
  const palette = { bg: '#c9c9c9', panel: '#dedede', fg: '#111111', muted: '#444444', line: '#858585' };
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
      u.el('span', 'ds-brand', top, '▣　' + C.brand);
      u.el('span', 'ds-window', top, '−　□　×');
      _c.header = top;
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const nav = u.el('nav', 'ds-menu', document.body);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      C.rail.split('|').forEach((t, i) => u.el(i === 0 ? 'h2' : 'p', i === 0 ? 'ds-rail-title' : '', rail, t));
      _c.contentPane = u.el('div', 'ds-content', body);
    },
    'frame.instruction': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.contentPane;
      base(_c);
      _c.header = header;
      const note = _c.contentPane.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note');
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'ds-main', _c.contentPane);
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      _c.body.classList.remove('ref-panel-right');
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('ds-brief');
        panel.querySelector('.ref-panel-title').textContent = 'Help & Tips';
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
        _c.contentPane.insertBefore(note, _c.body);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('ds-footer');
      _c.contentPane.appendChild(foot);
      const tools = foot.querySelector('.ref-tools');
      ['▣　Workplace Shell', '▤　Technical Reference Library', '✉　Mail', '▦　Calendar', '▧　Programs', '◈　Shredder'].forEach((text, i) => {
        const item = _c.util.el('div', 'ds-dockitem' + (i === 1 ? ' ds-active' : ''), foot, text);
        foot.insertBefore(item, tools);
      });
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
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
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#087f90'],
      LOW_ACCENTS: ['#087f90'],
      parts,
    },
  });
})();
