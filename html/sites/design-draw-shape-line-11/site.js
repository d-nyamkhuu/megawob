(function () {
  'use strict';
  const C = {
    title: 'Line Practice',
    menu: ['Workspace', 'File', 'Edit', 'Tools', 'Help'],
  };
  const TOOLS = [
    ['Select', 'M4 2V22L9 17L13 26L17 24L13 15H21Z'],
    ['Freehand', 'M5 24L6 18L19 5L23 9L10 22ZM16 8L20 12M6 18L10 22M19 5L21 3L25 7L23 9'],
    ['Rectangle', 'M3 5H25V23H3Z'],
    ['Ellipse', 'M24 14A10 10 0 1 1 4 14A10 10 0 1 1 24 14Z'],
    ['Eraser', 'M4 17L15 5L24 12L14 24H9ZM10 11L19 18'],
  ];
  function drawTools(u, bar) {
    for (const [name, d] of TOOLS) {
      const g = u.el('div', 'ns-tool', bar);
      const b = u.el('button', 'ns-tbtn' + (name === 'Freehand' ? ' sel' : ''), g);
      b.type = 'button';
      const s = u.svg('svg', {
        width: 42, height: 42, viewBox: '0 0 28 28',
        fill: name === 'Select' ? '#111' : name === 'Eraser' ? '#999' : 'none',
        stroke: '#111', 'stroke-width': 2, 'stroke-linejoin': 'round',
      }, b);
      u.svg('path', { d }, s);
      u.el('span', name === 'Freehand' ? 'b' : '', g, name);
      b.onclick = () => { if (name === 'Eraser') env.widgetDef.clear?.(); };
    }
    u.el('div', 'ns-vsep', bar);
    u.el('span', 'ns-lbl', bar, 'Line Width:');
    const w = u.el('div', 'ns-width', bar);
    u.el('span', '', w, '1');
    const sp = u.el('div', 'ns-spin', w);
    for (const d of ['M7 15V3M2 9L7 3L12 9', 'M7 2V14M2 8L7 14L12 8']) {
      const i = u.el('i', '', sp);
      const s = u.svg('svg', { width: 14, height: 17, viewBox: '0 0 14 17', fill: 'none', stroke: '#111', 'stroke-width': 1.5 }, i);
      u.svg('path', { d }, s);
    }
    u.el('span', 'ns-lbl ns-b', bar, 'Color:');
    const sw = u.el('div', 'ns-color', bar);
    u.el('i', '', sw);
    u.el('div', 'ns-vsep', bar);
    const un = u.el('button', 'ns-btn dis', bar, 'Undo');
    un.type = 'button';
    const cl = u.el('button', 'ns-btn', bar, 'Clear');
    cl.type = 'button';
    cl.onclick = () => env.widgetDef.clear?.();
    u.el('div', 'ns-vsep', bar);
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original dedicated task pane supports every display at every size.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('design', 'nextstep', 'layout-ns');
      document.body.classList.toggle('has-instruction-toast', _c.display === 'toast');
      document.documentElement.style.setProperty('--font', 'Helvetica, Arial, sans-serif');
      const shell = u.el('div', 'shell', document.body);
      const mb = u.el('div', 'ns-menubar', shell);
      u.el('span', 'ns-logo', mb, '✕');
      for (const m of C.menu) u.el('span', 'ns-menu', mb, m);
      u.el('span', 'ns-clock', mb, 'Mon Oct 18   9:24 AM');
      const title = u.el('div', 'title', shell, C.title);
      const left = u.el('section', 'ns-pane ns-task');
      const lh = u.el('div', 'ns-phead', left);
      u.el('i', 'ns-sq', lh);
      u.el('span', '', lh, 'Task');
      const note = u.el('div', 'task-note ns-pbody', left);
      lh.hidden = note.hidden = _c.display === 'hidden';
      const foot = u.el('footer', 'footer ns-foot');
      const fh = u.el('div', 'ns-phead', foot);
      u.el('i', 'ns-sq', fh);
      u.el('span', '', fh, 'Tools & Actions');
      const bar = u.el('div', 'ns-bar', foot);
      drawTools(u, bar);
      Object.assign(_c, { shell, title, left, note, foot, bar, actionHeading: fh, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.note.querySelector('.ref-instruction');
      if (text) text.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.bar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const body = _c.util.el('div', 'content', _c.shell);
      body.appendChild(_c.left);
      _c.body = body;
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.note;
      base(_c);
      _c.body = body;
      const text = _c.note.querySelector('.ref-panel-text');
      if (text) text.classList.add('instruction');
      if (_c.display !== 'hidden' && _c.display !== 'toast') {
        const u = _c.util;
        // Preserve the old hint spacing without repeating the drawing goal.
        u.el('div', 'ns-guide-space', _c.note);
        u.el('hr', 'ns-rule', _c.note);
        const st = u.el('div', 'ns-stats', _c.note);
        u.el('div', 'ns-points', st, '');
        u.el('div', '', st, 'Tool:  Freehand pencil');
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const right = u.el('section', 'ns-pane ns-draw', _c.body);
      const rh = u.el('div', 'ns-phead', right);
      u.el('i', 'ns-sq', rh);
      u.el('span', '', rh, 'Drawing Area');
      const well = u.el('div', 'ns-well', right);
      const stage = u.el('main', 'stage', well);
      stage.dataset.role = 'stage';
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('instruction-toast');
        note.querySelector('.ref-note-text').classList.add('instruction');
        _c.note.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      if (_c.placement === 'link') {
        foot.classList.add('ns-status-link');
        _c.actionHeading.appendChild(foot);
      } else {
        _c.bar.appendChild(foot);
      }
      const extras = _c.util.el('div', 'ns-actions', _c.actionHeading);
      for (const button of _c.foot.querySelectorAll('.ref-xtra')) extras.appendChild(button);
      _c.shell.appendChild(_c.foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.title.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const h = u.el('h3', '', box);
      const xb = u.el('button', 'ns-x', h);
      xb.type = 'button';
      xb.setAttribute('aria-label', 'Close consent dialog');
      xb.onclick = () => ctx.dismiss('close');
      const xicon = u.svg(
        'svg',
        { width: 23, height: 23, viewBox: '0 0 24 24', fill: 'none', stroke: '#111', 'stroke-width': 1.6 },
        xb,
      );
      u.svg('path', { d: 'M5 5L19 19M19 5L5 19' }, xicon);
      u.el('span', '', h, 'Data Use Consent');
      const body = u.el('div', 'ns-ob', box);
      const ic = u.svg(
        'svg',
        {
          class: 'ob-icon',
          width: 100,
          height: 108,
          viewBox: '0 0 100 108',
          fill: '#ccc',
          stroke: '#111',
          'stroke-width': 2,
        },
        body,
      );
      u.svg('path', { d: 'M2 2H82L98 18V106H2Z' }, ic);
      u.svg('path', { d: 'M82 2V18H98', fill: 'none' }, ic);
      for (let i = 0; i < 7; i++)
        u.svg('path', { d: 'M18 ' + (18 + i * 12) + 'H' + (i === 6 ? 50 : i === 0 ? 66 : 82), fill: 'none' }, ic);
      const t = u.el('div', 'ns-obtext', body);
      u.el(
        'p',
        '',
        t,
        'We’d like to collect anonymous information about how you use this drawing tool to help improve it.',
      );
      const ul = u.el('ul', '', t);
      for (const s of [
        'What you draw (e.g., strokes and shapes)',
        'Basic device information',
        'Approximate time spent on tasks',
      ])
        u.el('li', '', ul, s);
      u.el('p', '', t, 'This data is not used to identify you.');
      const row = u.el('div', 'ns-obrow', body);
      const dismiss = u.el('button', 'dismiss', row, 'Reject (optional)');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      const accept = u.el('button', 'dismiss agree', row, 'I Agree');
      accept.type = 'button';
      accept.onclick = () => ctx.dismiss('accept');
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  };
  const palette = { bg: '#bbb', panel: '#fff', fg: '#111820', muted: '#657080', line: '#c9cfd5' };
  env.site({
    name: 'design-draw-shape-line-11',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'nextstep.css'],
    design: {
      THEMES: { 'design-draw-shape-line-11': palette },
      LOW_THEME: palette,
      ACCENTS: ['#333'],
      LOW_ACCENTS: ['#333'],
      parts,
    },
  });
})();
