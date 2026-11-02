(function () {
  'use strict';
  const palette = { bg: '#f3ead4', panel: '#f5eddb', fg: '#102d53', muted: '#5d6470', line: '#b9a77c' };
  const parks = 'Parks|Acadia|Arches|Badlands|Big Bend|Canyon|Everglades|Glacier|Grand Teton|Great Smoky Mtns|Joshua Tree|Mesa Verde|Olympic|Rocky Mountain|Shenandoah|Yellowstone|Yosemite';
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
      u.el('span', 'ds-brand', top, 'National Parks Guide');
      u.el('span', '', top, '');
      const intro = u.el('section', 'ds-intro', document.body);
      u.el('div', 'ds-canyon', intro);
      const copy = u.el('div', 'ds-intro-copy', intro);
      u.el('h1', '', copy, 'Park Entrance Fees');
      u.el('p', '', copy, 'Find up-to-date entrance fees for all national parks. Fees help support conservation, trail maintenance and visitor services. Select a park from the list to view fee details.');
      u.el('div', 'ds-heritage', intro, 'NATIONAL PARKS\nOUR HERITAGE\nFOR GENERATIONS');
      const body = u.el('div', 'ds-body');
      const rail = u.el('aside', 'ds-rail', body);
      parks.split('|').forEach((t) => u.el('div', '', rail, t));
      const content = u.el('div', 'ds-content', body);
      Object.assign(_c, { top, body, content, header: content });
    },
    'frame.nav': () => () => {},
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
      document.body.appendChild(_c.body);
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
      _c.content.appendChild(foot);
      const tools = foot.querySelector('.ref-tools');
      ['Home', 'Parks', 'Maps', 'Photos', 'Travel Tips', 'About'].forEach((t, i) => {
        const item = _c.util.el('div', 'ds-dock-item' + (i === 1 ? ' active' : ''));
        _c.util.el('span', 'ds-dock-icon', item, ['◉', '♠', '▧', '▣', '◫', '▤'][i]);
        _c.util.el('span', '', item, t);
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
    name: 'design-find-fact-locate-03',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#07345c'],
      LOW_ACCENTS: ['#07345c'],
      parts,
    },
  });
})();
