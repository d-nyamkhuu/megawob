(function () {
  'use strict';
  const TOOLS = [
    ['Select', 'M-5 -11Q-7 -11 -7 -9Q-7 -7 -4 -7H-3V3H-6Q-9 3 -9 5Q-9 7 -6 7H-1V13L0 15L1 13V7H6Q9 7 9 5Q9 3 6 3H3V-7H4Q7 -7 7 -9Q7 -11 5 -11Z'],
    ['Point', 'M-4 0A4 4 0 1 1 4 0A4 4 0 1 1 -4 0Z'],
    ['Segment', 'M-9 10L9 -10'],
    ['Circle', 'M-11 0A11 11 0 1 1 11 0A11 11 0 1 1 -11 0Z'],
    ['Measure', 'M-9 -10L-9 10L11 10Z'],
    ['Clear', 'M-8 -12H3L8 -7V12H-8ZM3 -12V-5H8M-4 -1H4M-4 4H4M-4 8H4'],
  ];
  const TOOL_NOTE = {
    Select: 'Click to add a point.', Point: 'Click to add a point.',
    Segment: 'Click two points to draw a segment.', Circle: 'Click to set a center.',
    Measure: 'Click to measure an angle.', Clear: 'Clears the drawing.',
  };
  const palette = { bg: '#d9dbde', panel: '#fcfcfd', fg: '#10131a', muted: '#5a6270', line: '#c9cdd4' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // All modes have always used the card above the drawing.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.className = 'ol';
      const shell = u.el('div', 'shell', document.body);
      const rail = u.el('nav', 'rail', shell);
      const grip = u.el('div', 'rail-grip', rail);
      grip.innerHTML = '<svg width="18" height="12" viewBox="0 0 18 12"><path d="M1 2H17M1 6H17M1 10H17" stroke="#555" stroke-width="1.4"/></svg>';
      const toolNote = {};
      const btns = [];
      for (const [name, path] of TOOLS) {
        const bt = u.el('button', 'rtool' + (name === 'Select' ? ' sel' : ''), rail);
        bt.type = 'button';
        const s = u.svg('svg', {
          width: 44, height: 34, viewBox: '-16 -16 32 32',
          fill: name === 'Point' || name === 'Select' ? '#111' : 'none',
          stroke: '#111', 'stroke-width': 2.2, 'stroke-linejoin': 'round',
        }, bt);
        u.svg('path', { d: path }, s);
        u.el('span', '', bt, name);
        btns.push(bt);
        bt.onclick = () => {
          if (name === 'Clear') { env.widgetDef.clear?.(); return; }
          btns.forEach((x) => x.classList.remove('sel'));
          bt.classList.add('sel');
          if (toolNote.t) {
            toolNote.t.textContent = 'Tool: ' + name;
            toolNote.h.textContent = TOOL_NOTE[name];
          }
        };
      }
      u.el('div', 'rail-fill', rail);
      const win = u.el('div', 'win', shell);
      const head = u.el('header', 'head', win);
      u.el('div', 'title', head, 'Geometry Workshop');
      const wc = u.el('div', 'wctl', head);
      for (const k of ['p', 'm']) {
        const b = u.el('button', '', wc);
        b.type = 'button';
        b.innerHTML = k === 'p'
          ? '<svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 2H11M7 2V12M3 12H11" stroke="#111" stroke-width="2" fill="none"/></svg>'
          : '<svg width="14" height="14" viewBox="0 0 14 14"><rect x="2" y="2" width="10" height="10" fill="none" stroke="#111" stroke-width="2.2"/></svg>';
        b.onclick = () => env.log('window-control', { k });
      }
      const menu = u.el('nav', 'menu', win);
      for (const m of ['File', 'Edit', 'View', 'Tools', 'Help']) u.el('span', '', menu, m);
      const content = u.el('div', 'content', win);
      const note = u.el('section', 'note-slot', content);
      note.hidden = _c.display === 'hidden';
      Object.assign(_c, { shell, win, menu, content, header: note, toolNote });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        _c.header.classList.add('task-note');
        note.classList.add('instruction');
      }
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.menu;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.content; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const panel = _c.header.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('task-note', 'instruction-panel');
        panel.querySelector('.ref-panel-title').classList.add('panel-heading');
        panel.querySelector('.ref-panel-text').classList.add('instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.content);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note', 'instruction-toast');
        note.querySelector('.ref-note-text').classList.add('instruction');
        note.querySelector('.ref-note-x').classList.add('note-close');
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const u = _c.util;
      const footer = u.el('footer', 'footer', _c.win);
      const st = u.el('div', 'f-status', footer);
      Object.assign(_c.toolNote, {
        t: u.el('div', '', st, 'Tool: Select'),
        h: u.el('div', '', st, 'Click to add a point.'),
      });
      const co = u.el('div', 'f-coords', footer);
      u.el('span', '', co, 'x:  —');
      u.el('span', '', co, 'y:  —');
      const act = u.el('div', 'f-act', footer);
      const undo = u.el('button', 'obtn', act, 'Undo');
      undo.type = 'button';
      undo.onclick = () => { env.widgetDef.clear?.(); };
      const redo = u.el('button', 'obtn', act, 'Redo');
      redo.type = 'button';
      redo.disabled = true;
      const foot = document.body.querySelector('.ref-foot');
      act.appendChild(foot);
      Object.assign(_c, { footer, act, co });
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.co.classList.add('has-floating');
        _c.co.appendChild(dock);
      }
    },
    overlay: () => (ctx) => {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title = {
        cookie: 'Your privacy', toast: 'Changes saved', chat: 'Support',
        promo: 'Workspace update', banner: 'Service notice',
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
    name: 'design-click-point-right-angle-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { site: palette }, LOW_THEME: palette,
      ACCENTS: ['#c0392b'], LOW_ACCENTS: ['#c0392b'], parts,
    },
  });
})();
