(function () {
  'use strict';
  const palette = { bg: '#e8edf5', panel: '#f4f7fc', fg: '#2b3448', muted: '#5b667a', line: '#cdd6e4' };
  function noteIcon(u, note) {
    const ic = u.el('div', 'note-icon', note);
    const svg = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: '#3a6fc4', 'stroke-width': 1.7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, ic);
    u.svg('path', { d: 'M6 3H14L19 8V21H6ZM14 3V8H19M9 12H16M9 15H16M9 18H13' }, svg);
  }
  function drawDock(u, footer) {
    const grp = (label, cls) => {
      const g = u.el('div', 'dock-group ' + cls, footer);
      u.el('div', 'dock-label', g, label);
      return u.el('div', 'dock-row', g);
    };
    const btn = (parent, text, cls, fn, icon) => {
      const b = u.el('button', 'dock-btn ' + (cls || ''), parent);
      b.type = 'button';
      if (icon) {
        const s = u.svg(
          'svg',
          {
            width: 26,
            height: 26,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': 1.6,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          },
          b,
        );
        u.svg('path', { d: icon }, s);
      }
      if (text) u.el('span', '', b, text);
      b.onclick = fn;
      return b;
    };
    const tools = grp('Selection Tools', 'g-tools');
    const tb = [];
    for (const [t, p, fn] of [
      ['Select', 'M5 2V21L10 16L14 23L17 21L13 14H21Z', null],
      ['Highlight', 'M3 21L5 16L16 3Q17 2 18 3L22 7L10 20L5 18ZM5 16L10 20M3 21L6 20', null],
      [
        'Clear',
        'M4 14L14 3Q15 2 16 3L21 8Q22 9 21 10L11 21Q10 22 9 21L4 16Q3 15 4 14ZM8 10L16 17',
        () => env.widgetDef.clear?.(),
      ],
    ]) {
      const b = btn(
        tools,
        t,
        t === 'Select' ? 'sel' : '',
        () => {
          if (fn) {
            fn();
            return;
          }
          tb.forEach((x) => x.classList.remove('sel'));
          b.classList.add('sel');
        },
        p,
      );
      tb.push(b);
    }
    u.el('div', 'dock-sep', footer);
    const view = grp('View', 'g-view');
    btn(view, '−', 'sq', () => {});
    u.el('span', 'zoom', view, '100%');
    btn(view, '+', 'sq', () => {});
    u.el('div', 'dock-sep', footer);
    const ts = grp('Text Style', 'g-style');
    btn(ts, 'A−', 'sq w', () => {});
    btn(ts, 'A', 'sq w', () => {});
    btn(ts, 'A+', 'sq w', () => {});
  }
  function neuOverlay(ctx) {
    const u = ctx.util,
      kind = ctx.kind;
    const copy = {
      cookie: ['Your privacy', 'This workspace stores optional cookies.', 'Reject optional'],
      toast: ['Workspace update', 'Your changes have been saved.', 'Close'],
      chat: ['Support', 'Need a hand with this document?', 'Close'],
      promo: ['Workspace update', 'Explore the latest reading tools.', 'Close'],
      banner: ['Service notice', 'You are viewing a shared workspace.', 'Dismiss'],
    }[kind];
    const el = u.el('section', 'obstruction obstruction-' + kind + ' neu-overlay', document.body);
    el.dataset.role = 'overlay';
    const box = u.el('div', 'obstruction-box', el);
    u.el('h3', '', box, copy[0]);
    u.el('p', '', box, copy[1]);
    const dismiss = u.el('button', 'dismiss', box, copy[2]);
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('close');
    if (kind === 'cookie') {
      const accept = u.el('button', 'dismiss', box, 'Accept optional');
      accept.type = 'button';
      accept.onclick = () => ctx.dismiss('accept');
    }
    return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
  }
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
      const u = _c.util;
      document.body.className = 'design neu' + (_c.display === 'toast' ? ' has-instruction-toast' : '');
      _c.root.style.setProperty('--font', 'Lato, "Segoe UI", "Helvetica Neue", Arial, sans-serif');
      const shell = u.el('div', 'shell', document.body);
      const content = u.el('div', 'content', shell);
      const footer = u.el('footer', 'footer', shell);
      if (_c.placement) footer.classList.add('end-' + _c.placement);
      drawDock(u, footer);
      const toolbar = u.el('div', 'frame-actions', footer);
      const note = u.el('section', 'task-note', content);
      note.hidden = _c.display !== 'header';
      if (_c.display === 'header') noteIcon(u, note);
      Object.assign(_c, { shell, content, toolbar, footer, note, header: note });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.note.querySelector('.ref-instruction');
      if (text) text.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.toolbar;
      base(_c);
      _c.header = header;
      _c.toolbar.hidden = !_c.headerTools.children.length;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.content;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      if (_c.display === 'panel') {
        _c.content.classList.add('has-panel-note');
        const panel = _c.content.querySelector('.ref-panel');
        panel.classList.add('task-note', 'instruction-panel');
        noteIcon(_c.util, panel);
        panel.prepend(panel.lastChild);
        panel.querySelector('.ref-panel-text').classList.add('instruction');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'stage', _c.content);
      _c.stage.dataset.role = 'stage';
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('task-note', 'instruction-toast');
        noteIcon(_c.util, note);
        note.prepend(note.lastChild);
        note.querySelector('.ref-note-text').classList.add('instruction');
        note.querySelector('.ref-note-x').classList.add('note-close');
        _c.content.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.toolbar.appendChild(foot);
      _c.toolbar.hidden = !_c.toolbar.querySelector('button, a');
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) {
        _c.toolbar.appendChild(dock);
        _c.toolbar.hidden = false;
      }
    },
    overlay: () => neuOverlay,
  };
  env.site({
    name: 'design-select-text-phrase-08',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'neu.css'],
    design: {
      THEMES: { 'design-select-text-phrase-08': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2f7bea'],
      LOW_ACCENTS: ['#2f7bea'],
      parts,
    },
  });
})();
