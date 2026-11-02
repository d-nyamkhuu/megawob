(function () {
  'use strict';
  const palette = { bg: '#fbf8ee', panel: '#fbf8ee', fg: '#0d1a3a', muted: '#5d6a85', line: '#14264a' };
  function pencil(u, s) {
    for (const [d, fill] of [
      ['M2 30V26H4V21H6V19H8V17H10V15H12V13H14V11H16V9H18V7H20V3H22V1H26V3H28V5H30V9H28V11H26V13H24V15H22V17H20V19H18V21H16V23H14V25H10V27H6V29Z', '#060d30'],
      ['M20 4H22V2H25V4H27V6H29V9H27V11H25L20 6Z', '#ee8093'],
      ['M21 4H24V5H26V7H27V9H25L21 6Z', '#ffa6ac'],
      ['M7 20L20 7L25 12L12 25Z', '#d3971d'],
      ['M7 20L20 7L22 9L9 22Z', '#ffe37b'],
      ['M9 22L22 9L24 11L11 24Z', '#ffc634'],
      ['M5 22H7V21L12 25H9V26H5Z', '#ffefd0'],
      ['M4 27V25H6V27Z', '#fff8de'],
    ]) u.svg('path', { d, fill }, s);
  }
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // This design has a dedicated note card in every viewport.
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('pc');
      _c.root.style.setProperty('--font', "'Courier New', Courier, monospace");
      const shell = u.el('div', 'pc-shell', document.body);
      const head = u.el('header', 'pc-head', shell);
      const ic = u.svg('svg', { class: 'pc-logo', width: 46, height: 46, viewBox: '0 0 32 32', shapeRendering: 'crispEdges' }, head);
      u.svg('rect', { width: 32, height: 32, fill: '#73b9b4' }, ic);
      pencil(u, ic);
      u.el('div', 'pc-title', head, 'Shape Practice');
      u.el('nav', 'pc-nav', head, 'Draw  •  Learn  •  Improve');
      const main = u.el('div', 'pc-main', shell);
      const left = u.el('div', 'pc-left', main);
      const right = u.el('aside', 'pc-right', main);
      const task = u.el('section', 'pc-zone pc-task', left);
      u.el('div', 'pc-tab', task, 'Task');
      task.hidden = _c.display === 'hidden';
      const card = u.el('div', 'pc-note-slot', task);
      Object.assign(_c, { shell, head, main, left, right, task, header: card });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('pc-panel', 'pc-note', 'instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.head;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => { _c.body = _c.main; },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const panel = _c.header.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('pc-panel', 'pc-note', 'instruction-panel');
        panel.querySelector('.ref-panel-text').classList.add('instruction');
      }
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const dz = u.el('section', 'pc-zone pc-draw', _c.left);
      u.el('div', 'pc-tab', dz, 'Drawing Area');
      _c.stage = u.el('main', 'stage pc-panel', dz);
      _c.stage.dataset.role = 'stage';
      u.el('div', 'pc-tab pc-tab-r', _c.right, 'Tools');
      const rp = u.el('div', 'pc-panel pc-tools', _c.right);
      const pen = u.el('button', 'pc-tool selected', rp);
      pen.type = 'button';
      pencil(u, u.svg('svg', { width: 96, height: 96, viewBox: '0 0 32 32', shapeRendering: 'crispEdges' }, pen));
      u.el('span', '', pen, 'Pencil');
      const clr = u.el('button', 'pc-tool clear', rp);
      clr.type = 'button';
      const ci = u.svg('svg', { width: 96, height: 96, viewBox: '0 0 32 32', shapeRendering: 'crispEdges' }, clr);
      for (const [d, fill] of [
        ['M2 18L17 3H29L31 5V17L18 30H4L2 28Z', '#080e30'],
        ['M3 19L18 4H28L30 6L17 20Z', '#fff'],
        ['M17 20L30 6V16L17 28Z', '#567087'],
        ['M4 20H17V28H4Z', '#c3cdd2'],
        ['M4 20H6V27H4Z', '#edf0ec'],
        ['M6 27H17V28H6Z', '#a9b8c4'],
        ['M17 20L30 6V8L19 20Z', '#91a7b5'],
      ]) u.svg('path', { d, fill }, ci);
      u.el('span', '', clr, 'Clear');
      clr.onclick = () => { env.widgetDef.clear?.(); };
      u.el('hr', 'pc-rule', rp);
      u.el('div', 'pc-hint', rp, 'Use the pencil to draw on the canvas.');
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('pc-panel', 'pc-note', 'instruction-toast');
        note.querySelector('.ref-note-text').classList.add('instruction');
        note.querySelector('.ref-note-x').classList.add('note-close');
        _c.header.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.right.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.right.appendChild(dock);
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
    name: 'design-draw-shape-circle-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-draw-shape-circle-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#2f8f86'],
      LOW_ACCENTS: ['#2f8f86'],
      parts,
    },
  });
})();
