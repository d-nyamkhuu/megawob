(function () {
  'use strict';
  const palette = { bg: '#dce8f5', panel: '#fff', fg: '#111', muted: '#526276', line: '#b9c8da' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
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
      const title = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-appicon', title, '▣');
      u.el('span', 'ds-brand', title, 'Community Guide - Documentation Viewer');
      const win = u.el('div', 'ds-window', title);
      ['−', '□', '×'].forEach((x, i) => u.el('span', 'ds-winbtn w' + i, win, x));
      const menu = u.el('nav', 'ds-menu', document.body);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      [['▤', 'Documents'], ['◷', 'Recent'], ['★', 'Favorites'], ['📁', 'Libraries'], ['⌕', 'Search']].forEach((v, i) => {
        const item = u.el('div', 'ds-navitem' + (i === 0 ? ' active' : ''), rail);
        u.el('i', '', item, v[0]);
        u.el('span', '', item, v[1]);
      });
      const content = u.el('div', 'ds-content', body);
      Object.assign(_c, { title, body, rail, content, header: content });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.content.querySelector('.ref-instruction');
      if (note) note.classList.add('ds-header-note', 'ds-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('ds-tools');
    },
    'frame.body': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.content);
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.rail });
      const note = _c.rail.querySelector('.ref-panel');
      if (note) note.classList.add('ds-brief');
    },
    'frame.stage': () => (_c) => {
      const expand = _c.util.el('button', 'ds-expand', _c.content, '⊞　Expand all');
      expand.type = 'button';
      expand.addEventListener('click', () => {
        const actual = _c.stage.querySelector('.rl-tbtn[data-key=expand]');
        if (actual) { actual.click(); return; }
        _c.stage.querySelectorAll('button.rl-sech[aria-expanded="false"]').forEach((b) => b.click());
      });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.content.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const foot = u.el('footer', 'ds-footer', _c.content);
      u.el('div', 'ds-inspector-title', foot, 'Document Details');
      const details = u.el('div', 'ds-details', foot);
      const left = u.el('div', 'ds-detail-left', details);
      u.el('div', 'ds-fileicon', left, '▤');
      const meta = u.el('div', 'ds-meta', left);
      u.el('b', '', meta, 'Riverton Community Guide');
      u.el('span', '', meta, 'Type:　 Help Document');
      u.el('span', '', meta, 'Size:　 214 KB');
      u.el('span', '', meta, 'Modified:　 Apr 12, 2007 10:24 AM');
      const right = u.el('div', 'ds-detail-right', details);
      u.el('span', '', right, 'Summary:');
      u.el('p', '', right, 'An introduction to Riverton, including information about neighborhoods, parks, services, and upcoming events.');
      u.el('span', '', right, 'Keywords:');
      u.el('p', '', right, 'Riverton, community, Harbor, travel, city guide');
      base(_c);
      const controls = document.body.querySelector('.ref-foot');
      controls.querySelector('.ref-foot-text').remove();
      foot.appendChild(controls);
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
      const d = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      d.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss: d, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: 'design-find-fact-count-13',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-find-fact-count-13': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1555a0'],
      LOW_ACCENTS: ['#1555a0'],
      parts,
    },
  });
})();
