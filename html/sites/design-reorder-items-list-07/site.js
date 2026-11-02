(function () {
  'use strict';
  const C = {
    accent: '#9bff7e',
    bg: '#0a1016',
    surface: '#111820',
    font: "'DejaVu Sans Mono','Menlo','Consolas',monospace",
  };
  const palette = { bg: C.bg, panel: C.surface, fg: '#e6edf6', muted: '#8a97aa', line: '#1d2838' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated note strip at every viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const { util: u, ctx } = _c;
      document.body.className = 'design memphis devstrip' + (_c.display === 'toast' ? ' has-instruction-toast' : '');
      document.documentElement.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', document.body);
      const head = u.el('header', 'head panel', shell);
      const ic = u.el('div', 'app-icon', head);
      const svg = u.svg('svg', {
        width: '100%', height: '100%', viewBox: '0 0 48 48', fill: 'none', stroke: C.accent,
        'stroke-width': 3.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
      }, ic);
      u.svg('path', { d: 'M11 12H37Q42 12 42 17V40Q42 44 38 44H10Q6 44 6 40V17Q6 12 11 12ZM6 22H42M15 5V15M33 5V15' }, svg);
      for (const [x, y] of [[17, 27], [24, 27], [31, 27], [17, 34], [24, 34]]) {
        u.svg('circle', { cx: x, cy: y, r: 1.6, fill: C.accent, stroke: 'none' }, svg);
      }
      const tt = u.el('div', 'titles', head);
      u.el('div', 'kicker', tt, 'Task');
      u.el('h1', 'brief-title', tt, 'Month Ordering');
      u.el('p', 'workspace-copy', tt, 'A workspace for arranging items.');
      const meta = u.el('div', 'meta', head);
      for (const [k, v] of [
        ['Items', String(ctx.spec && ctx.spec.items ? ctx.spec.items.length : 12)],
        ['Workspace', 'Month collection'], ['Method', 'Drag and drop'],
      ]) {
        u.el('span', 'mk', meta, k);
        u.el('span', 'meta-value', meta, v);
      }
      const content = u.el('div', 'content panel', shell);
      const top = u.el('div', 'top', content);
      const header = u.el('section', 'task-note', top);
      header.hidden = _c.display !== 'header';
      const hint = u.el('div', 'hintbox', top);
      const hi = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: '#9aa7ba', 'stroke-width': '1.6', class: 'hint-ic' }, hint);
      u.svg('circle', { cx: 12, cy: 12, r: 9.5 }, hi);
      u.svg('path', { d: 'M12 11V17M12 7.5V8.5', 'stroke-linecap': 'round' }, hi);
      u.el('span', '', hint, 'Drag the items using the handle on the left to arrange them in the correct order.');
      const toolbar = u.el('footer', 'footer panel', shell);
      const reset = u.el('button', 'ghost reset', toolbar, '');
      reset.type = 'button';
      const ri = u.svg('svg', { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: '#a8b7c7', 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, reset);
      u.svg('path', { d: 'M3 10A9 9 0 0 1 20 8M20 4V9H15M21 14A9 9 0 0 1 4 16M4 20V15H9' }, ri);
      u.el('span', '', reset, 'Reset list');
      reset.onclick = () => { env.widgetDef.clear?.(); };
      u.el('div', 'footer-copy', toolbar, '');
      const cancel = u.el('button', 'ghost cancel', toolbar, 'Cancel');
      cancel.type = 'button';
      cancel.onclick = () => env.log('cancel', {});
      Object.assign(_c, { shell, contentPane: content, top, hint, toolbar, header });
    },
    'frame.nav': () => () => {},
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.contentPane; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.top;
      base(_c);
      _c.body = body;
      const panel = _c.top.querySelector('.ref-panel');
      if (panel) _c.top.insertBefore(panel, _c.hint);
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.body);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) _c.top.insertBefore(note, _c.hint);
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.toolbar.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.toolbar.appendChild(dock);
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
        cookie: 'This application stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with this workspace?',
        promo: 'Explore the latest workspace features.',
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
    name: 'design-reorder-items-list-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-reorder-items-list-07': palette },
      LOW_THEME: palette,
      ACCENTS: [C.accent],
      LOW_ACCENTS: [C.accent],
      parts,
    },
  });
})();
