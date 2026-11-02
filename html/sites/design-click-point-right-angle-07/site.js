(function () {
  'use strict';
  const palette = { bg: '#ffffff', panel: '#ffffff', fg: '#000000', muted: '#333333', line: '#9db4d8' };
  const link = (u, p, t) => {
    const a = u.el('a', 'gl-link', p, t);
    a.href = '#';
    a.onclick = (e) => e.preventDefault();
    return a;
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated side pane for both panel and toast notes.
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'gl');
      document.documentElement.style.setProperty('--font', 'Arial, Helvetica, sans-serif');
      const shell = u.el('div', 'shell gl-shell', document.body);
      const head = u.el('header', 'gl-head', shell);
      const logo = u.svg('svg', { class: 'gl-globe', width: 54, height: 54, viewBox: '0 0 54 54', fill: 'none', stroke: '#9ce5ff', 'stroke-width': 1.8 }, head);
      u.svg('circle', { cx: 27, cy: 27, r: 25, fill: '#168dcc' }, logo);
      u.svg('ellipse', { cx: 27, cy: 27, rx: 11, ry: 25 }, logo);
      u.svg('path', { d: 'M2 27H52M6 14Q27 21 48 14M6 40Q27 33 48 40M27 2V52' }, logo);
      const brand = u.el('div', 'gl-brand', head);
      u.el('span', 'gl-geo', brand, 'Geo');
      u.el('span', 'gl-learn', brand, 'Learn');
      u.el('div', 'gl-tag', head, 'Math Resources for Everyone');
      const nav = u.el('nav', 'gl-nav', head);
      ['Home', 'Subjects', 'Resources', 'Help'].forEach((t, i) => {
        if (i) u.el('span', 'gl-bar', nav, '|');
        link(u, nav, t);
      });
      u.el('div', 'gl-date', head, 'Wed, Apr 22, 1998');
      const portal = u.el('section', 'gl-portal', shell);
      const cols = [
        ['Browse by Subject', ['Algebra', 'Geometry', 'Trigonometry', 'Calculus', 'Statistics']],
        ['Math Tools', ['Graphing Calculator', 'Unit Converter', 'Formula Library', 'Practice Problems', 'Math Games']],
        ['Student Center', ['Study Guides', 'Homework Help', 'Test Preparation', 'College Resources', 'Educator Corner']],
      ];
      for (const [t, items] of cols) {
        const c = u.el('div', 'gl-col', portal);
        u.el('div', 'gl-strip', c, t);
        for (const i of items) link(u, c, i);
      }
      const sc = u.el('div', 'gl-col gl-search', portal);
      u.el('div', 'gl-strip', sc, 'Search Our Site');
      const row = u.el('div', 'gl-srow', sc);
      u.el('div', 'gl-input', row);
      const sb = u.el('button', 'gl-btn gl-sbtn', row, 'Search');
      sb.type = 'button';
      const rad = u.el('div', 'gl-radios', sc);
      for (const [i, t] of ['All Pages', 'Math Resources'].entries()) {
        const l = u.el('label', '', rad);
        const r = u.el('input', '', l);
        r.type = 'radio';
        r.name = 'gl-scope';
        r.checked = i === 0;
        u.el('span', '', l, t);
      }
      const adv = u.el('div', 'gl-adv', sc);
      link(u, adv, 'Advanced Search');
      u.el('span', 'gl-bar', adv, '|');
      link(u, adv, 'Site Map');
      const ad = u.el('div', 'gl-ad', portal);
      for (const t of ['A', 'Brighter', 'Future', 'Through', 'Mathematics']) u.el('div', '', ad, t);
      const main = u.el('div', 'gl-main', shell);
      const left = u.el('section', 'gl-left', main);
      const toolbar = u.el('div', 'gl-lh', left);
      u.el('span', 'gl-lt', toolbar, 'Geometry Practice');
      const lk = u.el('span', 'gl-lk', toolbar);
      ['Problems', 'Hints', 'Glossary'].forEach((t, i) => {
        if (i) u.el('span', 'gl-bar', lk, '|');
        link(u, lk, t);
      });
      const content = u.el('div', 'content gl-content', left);
      const header = u.el('section', 'task-note', content);
      header.hidden = _c.display !== 'header';
      const aside = u.el('aside', 'aside gl-aside', main);
      const heading = u.el('div', 'gl-ah', aside, 'Your Task');
      heading.hidden = _c.display !== 'panel' && _c.display !== 'toast';
      // Reserve the original task summary's space without repeating the goal.
      u.el('div', 'gl-summary-space', aside);
      const noteSlot = u.el('div', 'gl-note-slot', aside);
      u.el('hr', 'gl-rule', aside);
      u.el('div', 'gl-strip gl-strip2', aside, 'Tools');
      const tp = u.el('button', 'gl-btn gl-tool sel', aside);
      tp.type = 'button';
      const ic = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 32 32', fill: '#fff', stroke: '#000', 'stroke-width': 1.8 }, tp);
      u.svg('path', { d: 'M8 3V27L14 21L18 30L22 28L18 20H26Z' }, ic);
      u.el('span', '', tp, 'Point Tool (Click)');
      const cl = u.el('button', 'gl-btn gl-tool', aside);
      cl.type = 'button';
      const ic2 = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 32 32', fill: '#d8e4e9', stroke: '#000', 'stroke-width': 1.8, 'stroke-linejoin': 'round' }, cl);
      u.svg('path', { d: 'M5 20L19 5L28 13L14 28H8ZM12 12L21 21' }, ic2);
      u.el('span', '', cl, 'Clear Point');
      cl.onclick = () => { env.widgetDef.clear?.(); };
      Object.assign(_c, { shell, main, content, toolbar, aside, noteSlot, header });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => { _c.body = _c.main; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.noteSlot;
      base(_c);
      _c.body = body;
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.content);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.noteSlot.appendChild(note);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.toggle('gl-finish', !!_c.ctx.finish);
      _c.aside.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.aside.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title = {
        cookie: 'Your privacy',
        toast: 'Changes saved',
        chat: 'Support',
        promo: 'Workspace update',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This site stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with this page?',
        promo: 'Explore the latest GeoLearn features.',
        banner: 'You are viewing a shared workspace.',
      }[kind];
      const label = kind === 'cookie' ? 'Reject optional' : 'Close';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, label);
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  env.site({
    name: 'design-click-point-right-angle-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'gl.css'],
    design: {
      THEMES: { site: palette },
      LOW_THEME: palette,
      ACCENTS: ['#1a2a8a'],
      LOW_ACCENTS: ['#1a2a8a'],
      parts,
    },
  });
})();
