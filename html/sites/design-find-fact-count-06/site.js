(function () {
  'use strict';
  const C = {
    site: 'design-find-fact-count-06',
    brand: 'Product Library',
    menu: 'File|Edit|View|Go|Tools|Help',
    tabs: 'Overview|Products|Documentation|Support|Reports',
  };
  const palette = { bg: '#bdbcb7', panel: '#c9c9c5', fg: '#101010', muted: '#454844', line: '#80817e' };
  const parts = {
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      const frame = u.el('div', 'motif-frame', document.body);
      const top = u.el('header', 'ds-top', frame);
      u.el('span', 'window-icon', top, '▤');
      u.el('span', 'ds-brand', top, C.brand);
      const controls = u.el('span', 'window-controls', top);
      ['−', '□', '×'].forEach((x) => u.el('span', '', controls, x));
      Object.assign(_c, { frame, header: top, windowControls: controls });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const nav = u.el('nav', 'ds-menu', _c.frame);
      C.menu.split('|').forEach((t, i) => {
        const s = u.el('span', '', nav, t);
        if (i < 3) s.innerHTML = '<u>' + t[0] + '</u>' + t.slice(1);
      });
      const tabs = u.el('div', 'ds-tabs', _c.frame);
      C.tabs.split('|').forEach((t, i) => u.el('span', i === 1 ? 'active' : '', tabs, t));
      _c.toolbar = nav;
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('ds-instruction', 'title-note');
        _c.header.insertBefore(note, _c.windowControls);
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
      const work = u.el('div', 'ds-workframe', _c.frame);
      const lib = u.el('aside', 'ds-library', work);
      u.el('div', 'ds-library-title', lib, 'Library');
      const tree = u.el('div', 'ds-tree', lib);
      const rows = [
        ['▾', '▣', 'Product Line', ''],
        ['', '▤', 'Introduction', 'child'],
        ['', '▤', 'Models', 'selected'],
        ['', '▤', 'Specifications', 'child'],
        ['', '▤', 'Accessories', 'child'],
        ['▸', '▤', 'Release Notes', ''],
        ['▸', '▤', 'Service & Support', ''],
        ['▸', '▤', 'Marketing', ''],
        ['▸', '▤', 'Archive', ''],
      ];
      rows.forEach(([arrow, icon, label, kind]) => {
        const row = u.el('div', 'ds-tree-row ' + kind, tree);
        u.el('span', 'ds-tree-arrow', row, arrow);
        u.el('span', 'ds-tree-icon', row, icon);
        u.el('span', 'ds-tree-label', row, label);
      });
      const toolbar = u.el('div', 'motif-toolbar', work);
      const cmds = [
        ['back', '◀', 'Back'],
        ['forward', '▶', 'Forward'],
        ['home', '⌂', 'Home'],
        ['print', '▣', 'Print'],
        ['find', '⌕', 'Find'],
        ['expand', '▦', 'Expand All'],
      ];
      cmds.forEach(([key, icon, label]) => {
        const b = u.el('button', 'motif-tool motif-tool-' + key, toolbar);
        b.type = 'button';
        b.dataset.command = key;
        u.el('span', 'motif-tool-icon', b, icon);
        u.el('span', '', b, label);
        b.addEventListener('click', () => {
          const stage = _c.stage;
          if (key === 'find') stage.querySelector('.rl-tbtn[data-key="open"]')?.click();
          if (key === 'expand') stage.querySelector('.rl-tbtn[data-key="expand"]')?.click();
          if (key === 'home') stage.querySelector('.rl-dpane')?.scrollTo({ top: 0 });
          if (key === 'back') stage.querySelector('.rl-dpane')?.scrollBy({ top: -240 });
          if (key === 'forward') stage.querySelector('.rl-dpane')?.scrollBy({ top: 240 });
        });
      });
      Object.assign(_c, { body: work });
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) panel.classList.add('ds-brief');
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage', _c.body);
      _c.body.prepend(_c.stage);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('ds-toast');
        _c.frame.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const footer = document.body.querySelector('.ref-foot');
      footer.classList.add('ds-footer');
      _c.frame.appendChild(footer);
      const ready = footer.querySelector('.ref-foot-text');
      ready.classList.add('status-text');
      ready.textContent = 'Ready';
      _c.footer = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.footer.appendChild(dock);
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
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  };
  env.site({
    name: C.site,
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'motif.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#39466c'],
      LOW_ACCENTS: ['#39466c'],
      TITLES: [C.brand],
      parts,
    },
  });
})();
