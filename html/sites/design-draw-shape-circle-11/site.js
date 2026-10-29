// GeoSketch notebook frame on the shared site template.
(function () {
  'use strict';

  // The tip window is part of this notebook's visual design.
  function notebookTip(ctx) {
    const u = ctx.util,
      kind = ctx.kind;
    const el = u.el('section', 'obstruction obstruction-' + kind + ' gs-tip', document.body);
    el.dataset.role = 'overlay';
    const box = u.el('div', 'obstruction-box', el);
    const hd = u.el('div', 'gs-tip-head', box);
    const bs = u.svg(
      'svg',
      { width: 26, height: 30, viewBox: '0 0 26 30', fill: 'none', stroke: '#102b2e', 'stroke-width': 1.8 },
      hd,
    );
    u.svg('path', { d: 'M13 2A9 9 0 0 0 7 18L9 23H17L19 18A9 9 0 0 0 13 2ZM9 26H17M11 29H15' }, bs);
    u.el('h3', '', hd, 'Tip of the day');
    const x = u.el('button', 'gs-tip-x', hd, '✕');
    x.type = 'button';
    u.el('p', '', box, 'Press and drag on the canvas to draw. Use Undo to clear your stroke.');
    const row = u.el('div', 'gs-tip-row', box);
    const label = u.el('label', 'tip-option', row);
    const input = u.el('input', '', label);
    input.type = 'checkbox';
    u.el('span', '', label, 'Do not show again');
    const dismiss = u.el('button', 'dismiss', row, 'Close');
    dismiss.type = 'button';
    dismiss.onclick = () => {
      if (env.timeText) env.timeText.textContent = 'Paused';
      ctx.dismiss('close');
    };
    x.onclick = () => dismiss.click();
    return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
  }

  const palette = {
    bg: '#d9e8df',
    panel: '#eef7f1',
    fg: '#13251f',
    muted: '#657b70',
    line: '#b9cfc2',
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This notebook has room for its margin note at every supported viewport.
      _c.display = _c.ctx.display;
      document.body.className = 'design gs gs-display-' + _c.display +
        (_c.display === 'toast' ? ' has-instruction-toast' : '');
    },
    'frame.header': () => (_c) => {
      const { display, util: u } = _c;
      const shell = u.el('div', 'gs-shell', document.body);
      const left = u.el('section', 'gs-left task-note', shell);
      left.hidden = display === 'hidden';
      const app = u.el('div', 'gs-app', shell);
      const head = u.el('header', 'gs-head', app);
      u.el('span', 'gs-logo', head, 'GeoSketch');
      u.el('span', 'gs-sep', head);
      u.el('span', 'gs-sub', head, 'Geometric Construction Notebook');
      u.el('span', 'gs-fill', head);
      u.el('span', 'gs-task', head, 'Task 1 of 5');
      u.el('span', 'gs-sep', head);
      const pz = u.svg('svg', { width: 20, height: 22, viewBox: '0 0 20 22' }, head);
      u.svg('rect', { x: 3, y: 3, width: 5, height: 16, fill: '#fff' }, pz);
      u.svg('rect', { x: 12, y: 3, width: 5, height: 16, fill: '#fff' }, pz);
      env.timeText = u.el('span', 'gs-paused', head, 'Paused');

      Object.assign(_c, { shell, left, app, header: head });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base({ ..._c, header: _c.left });
      _c.left.querySelector('.ref-instruction')?.classList.add('instruction');
      _c.left.querySelector('.ref-spacer')?.remove();
    },
    'frame.tools': (base) => (_c) => {
      base(_c);
      _c.headerTools.querySelectorAll('.ref-xtra').forEach((el) => el.classList.add('gs-pq'));
      _c.submit?.classList.add('gs-head-submit');
    },
    'frame.body': () => (_c) => {
      _c.body = _c.util.el('div', 'gs-main ref-body', _c.app);
    },
    'frame.panel': (base) => (_c) => {
      base({ ..._c, body: _c.left });
      const panel = _c.left.querySelector('.ref-panel');
      if (panel) {
        panel.querySelector('.ref-panel-title').classList.add('gs-note-title');
        panel.querySelector('.ref-panel-text').classList.add('instruction');
        panel.replaceWith(...panel.childNodes);
      }
    },
    'frame.stage': () => (_c) => {
      const { util: u, body: main } = _c;
      const stage = u.el('main', 'stage', main);
      stage.dataset.role = 'stage';
      const rail = u.el('aside', 'gs-rail', main);
      const ICONS = {
        Select: 'M10 3V25L15 20L19 29L23 27L19 18H25Z',
        Freehand: 'M4 28L7 19L23 3Q25 1 27 3L29 5Q31 7 29 9L13 25ZM21 5L27 11M7 19L13 25M4 28L9 26',
        Line: 'M5 27L27 5',
        Point: 'M16 12A4 4 0 1 1 16 20A4 4 0 1 1 16 12',
        Erase: 'M19 4L28 13L12 29L4 21ZM12 13L21 22',
        Undo: 'M6 15C9 6 26 6 26 19M6 7V15H14',
      };
      for (const t of ['Select', 'Freehand', 'Line', 'Point', 'Erase', 'Undo']) {
        const bt = u.el('button', 'gs-tool' + (t === 'Freehand' ? ' sel' : ''), rail);
        bt.type = 'button';
        const s = u.svg(
          'svg',
          {
            width: 34,
            height: 34,
            viewBox: '0 0 32 32',
            fill: t === 'Point' ? '#1c3a30' : 'none',
            stroke: '#1c2b26',
            'stroke-width': 1.8,
            'stroke-linejoin': 'round',
          },
          bt,
        );
        u.svg('path', { d: ICONS[t] }, s);
        u.el('span', '', bt, t);
        bt.onclick = () => {
          rail.querySelectorAll('.gs-tool').forEach((x) => x.classList.remove('sel'));
          bt.classList.add('sel');
          if (t === 'Undo') env.widgetDef.clear?.();
        };
      }

      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.querySelector('.ref-note');
      if (note) {
        // Keep the template's close behavior on the margin-note container.
        note.classList.add('gs-left', 'task-note');
        note.querySelector('.ref-note-text').classList.add('instruction');
        note.querySelector('.ref-note-x').classList.add('note-close');
        _c.left.replaceWith(note);
        _c.left = note;
      }
    },
    'frame.footer': (base) => (_c) => {
      const { util: u, app } = _c;
      // The grid controls always occupy the notebook footer.
      const foot = u.el('footer', 'gs-foot', app);
      const gr = u.el('div', 'gs-grid', foot, 'Grid: 1 unit');
      u.el('span', 'gs-caret', gr);
      u.el('span', 'gs-fill', foot);
      u.el('span', 'gs-showgrid', foot, 'Show grid');
      const cb = u.el('span', 'gs-cb', foot);
      cb.innerHTML =
        '<svg width="18" height="18" viewBox="0 0 18 18"><path d="M3 9L7 13L15 4" fill="none" stroke="#fff" stroke-width="2.2"/></svg>';

      base({ ..._c, wantFooter: true });
      const templateFoot = document.querySelector('.ref-foot');
      const tools = templateFoot.querySelector('.ref-tools');
      tools.querySelectorAll('.ref-xtra').forEach((el) => el.classList.add('gs-pq'));
      tools.querySelector('.ref-submit')?.classList.add('submit', 'gs-submit');
      tools.querySelector('.ref-endlink')?.classList.add('gs-endlink');
      foot.append(tools);
      _c.submit = tools.querySelector('[data-role="submit"]') || _c.submit;
      templateFoot.remove();
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.querySelector('.ref-float-dock');
      if (dock) {
        // Reserve the end control's space in the footer, away from the drawing.
        dock.querySelector('.ref-submit').classList.add('submit', 'gs-submit');
        _c.foot.append(dock);
      }
    },
    overlay: () => notebookTip,
  };

  env.site({
    name: 'design-draw-shape-circle-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['site.css', 'site2.css', 'templates/site/css/base-hooks.css', 'frame-support.css'],
    design: {
      THEMES: { notebook: palette },
      LOW_THEME: palette,
      ACCENTS: ['#244a3b'],
      LOW_ACCENTS: ['#244a3b'],
      parts,
    },
  });
})();
