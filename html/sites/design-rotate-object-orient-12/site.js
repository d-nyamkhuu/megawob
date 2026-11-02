/* CD-ROM companion web reference frame (Discovery Workshop). Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  function icon(parent, name, size = 24) {
    const paths = {
      close: 'M5 5L21 21M21 5L5 21',
      home: 'M1 13L14 1L27 13H23V27H5V13ZM5 3H10V8H5Z',
      reset: 'M9 6A12 12 0 1 1 6 24L9 20A8 8 0 1 0 11 10L15 14L2 16L3 3Z',
      help: 'M10 10Q10 5 14 5Q19 5 19 9Q19 12 15 14V17M15 21V23',
    };
    const svg = env.util.svg('svg', { width: size, height: size, viewBox: '0 0 28 28', 'aria-hidden': 'true' }, parent);
    if (name === 'help') env.util.svg('circle', {cx:14,cy:14,r:14,fill:'currentColor'},svg);
    const fill = name === 'home' || name === 'reset';
    env.util.svg('path', { d: paths[name], fill: fill ? 'currentColor' : 'none',
      stroke: fill ? 'none' : name === 'help' ? '#6682bd' : 'currentColor', 'stroke-width': 3.2, 'stroke-linecap': 'round' }, svg);
    return svg;
  }
  function compass(parent) {
    const s = env.util.svg('svg', { class: 'rose', viewBox: '-50 -50 100 100', 'aria-hidden': 'true' }, parent);
    const g = (tag, a) => env.util.svg(tag, a, s);
    const defs = g('defs', {});
    const gold = env.util.svg('linearGradient', {id:'rose-gold'}, defs);
    env.util.svg('stop', {offset:0,'stop-color':'#e6b542'}, gold);
    env.util.svg('stop', {offset:.5,'stop-color':'#f5d473'}, gold);
    env.util.svg('stop', {offset:1,'stop-color':'#b18023'}, gold);
    g('circle', { r: 38, fill: 'none', stroke: '#d6b25a', 'stroke-width': 1.5 });
    for(let a=0;a<360;a+=45){
      const r=a%90===0?49:43;
      const w=a%90===0?9:5;
      env.util.svg('path',{d:`M0,-${r} L${w},0 L0,7 Z`,transform:`rotate(${a})`,fill:'url(#rose-gold)',stroke:'#705a22','stroke-width':.7},s);
      env.util.svg('path',{d:`M0,-${r} L-${w},0 L0,7 Z`,transform:`rotate(${a})`,fill:'#85703d',stroke:'#d0a246','stroke-width':.7},s);
    }
    g('circle', { r: 5, fill: '#16295e', stroke: '#f0d98a', 'stroke-width': 1.5 });
  }
  function disc(parent) {
    const s = env.util.svg('svg', { class: 'cd', viewBox: '-50 -50 100 100', 'aria-hidden': 'true' }, parent);
    const defs = env.util.svg('defs', {}, s);
    const blur = env.util.svg('filter', {id:'cd-soft'}, defs);
    env.util.svg('feGaussianBlur', {stdDeviation:3}, blur);
    const clip = env.util.svg('clipPath', {id:'cd-edge'}, defs);
    env.util.svg('circle', {r:48}, clip);
    const lg = env.util.svg('linearGradient', { id: 'cdg', x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
    [['0', '#f4f4f8'], ['.3', '#9aa3b4'], ['.5', '#ffffff'], ['.7', '#e08a6a'], ['.85', '#6fc7a0'], ['1', '#7a8cd8']].forEach(([o, c]) =>
      env.util.svg('stop', { offset: o, 'stop-color': c }, lg));
    env.util.svg('circle', { r: 48, fill: 'url(#cdg)', stroke: '#111', 'stroke-width': 1.5 }, s);
    const wedges=['#89bbd7','#be87c6','#999bd0','#ea99a6','#eee178','#6fe1b4','#718be3','#bac4d2','#959bad','#d5d6de','#869fad','#c9bcdd'];
    const sheen = env.util.svg('g', {'clip-path':'url(#cd-edge)'}, s);
    const rays = env.util.svg('g', {filter:'url(#cd-soft)'}, sheen);
    wedges.forEach((color,i)=>{const a=(i*30-105)*Math.PI/180,b=((i+1)*30-105)*Math.PI/180;env.util.svg('path',{d:`M0,0 L${48*Math.cos(a)},${48*Math.sin(a)} A48,48 0 0 1 ${48*Math.cos(b)},${48*Math.sin(b)}Z`,fill:color,opacity:.65},rays);});
    env.util.svg('circle', { r: 15, fill: '#ddd', stroke: '#666', 'stroke-width': 1.5 }, s);
    env.util.svg('circle', { r: 7, fill: '#222' }, s);
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'layout-dialog overlay-' + ctx.kind, document.body);
    el.classList.add(ctx.initial ? 'reference-initial' : 'episode-overlay');
    // The kit can schedule both channels at step zero. Keep their dismiss targets separate.
    if (ctx.initial) {
      for (const notice of document.querySelectorAll('.episode-overlay')) notice.classList.add('stacked-notice');
    } else if (document.querySelector('.reference-initial')) {
      el.classList.add('stacked-notice');
    }
    el.setAttribute('role', 'dialog');
    const content = {
      chat: ['Layout Error', 'Layout could not be restored.', 'Some panels may be hidden or out of place. Use the default layout to return to the standard workspace.', 'Use default layout'],
      cookie: ['Privacy', 'Allow optional cookies?', 'Allow optional cookies for this workspace?', 'Accept optional'],
      toast: ['Notice', 'Practice saved', 'Your current workspace is ready to continue.', 'Dismiss'],
      promo: ['More Activities', 'Discover more practice', 'Explore more exercises after completing this task.', 'Not now'],
      banner: ['Workspace notice', 'Offline session', 'This practice session works offline.', 'Dismiss'],
    }[ctx.kind];
    const bar = u.el('div', 'dlg-bar', el);
    u.el('span', '', bar, content[0]);
    const close = u.el('button', 'dlg-close', bar);
    close.type = 'button'; close.setAttribute('aria-label', 'Close notice');
    icon(close, 'close', 16);
    close.onclick = () => ctx.dismiss('close');
    const body = u.el('div', 'dlg-body', el);
    if (ctx.kind === 'chat') {
      const w = u.svg('svg', { class: 'dlg-warn', viewBox: '0 0 60 54', 'aria-hidden': 'true' }, body);
      u.svg('path', { d: 'M26 5Q30 -1 34 5L58 46Q62 52 55 52H5Q-2 52 2 46Z', fill: '#f6cf1d', stroke: '#111', 'stroke-width': 3, 'stroke-linejoin': 'round' }, w);
      u.svg('path', { d: 'M30 16Q24 16 25 22L28 35Q30 38 32 35L35 22Q36 16 30 16Z', fill: '#111' }, w);
      u.svg('circle', { cx: 30, cy: 43, r: 4, fill: '#111' }, w);
    }
    const text = u.el('div', 'dlg-text', body);
    u.el('h2', '', text, content[1]);
    u.el('p', '', text, content[2]);
    const dismiss = u.el('button', 'dlg-button', text, content[3]);
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss(ctx.kind === 'cookie' ? 'accept' : 'skip');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  const palette = { bg: '#efe3c0', panel: '#f5ecd2', fg: '#1b1b2a', muted: '#555555', line: '#9a8f70' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.W < 1120 && _c.ctx.display === 'panel' ? 'header' : (_c.ctx.display || 'header');
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('cdrom', `instruction-${_c.display}`);
      const header = u.el('header', 'cd-header', document.body);
      const brand = u.el('div', 'brand', header);
      compass(brand);
      const bt = u.el('div', 'brand-text', brand);
      u.el('div', 'brand-name', bt, 'Discovery\nWorkshop');
      u.el('div', 'brand-tag', bt, 'EXPLORE • PRACTICE • LEARN');
      const right = u.el('div', 'header-right', header);
      u.el('div', 'gp-title', right, 'Geometry Puzzles');
      u.el('div', 'gp-sub', right, 'A MIND BRIGHTER\nBRIGHTER TOMORROW');
      disc(header);
      const page = u.el('section', 'cd-sheet', document.body);
      Object.assign(_c, { page, header: page });
    },
    'frame.nav': () => (_c) => {
      const u = _c.util;
      const tabs = u.el('nav', 'cd-tabs', document.body);
      tabs.setAttribute('aria-label', 'Sections');
      ['Shape Lab', 'Puzzles', 'Activities', 'Help'].forEach((label, i) => {
        const tab = u.el('button', 'cd-tab' + (i === 0 ? ' active' : ''), tabs);
        const bg = u.svg('svg', {viewBox:'0 0 225 56',preserveAspectRatio:'none','aria-hidden':'true'}, tab);
        const defs = u.svg('defs', {}, bg);
        const grad = u.svg('linearGradient', {id:'tab-'+i,x2:'0',y2:'1'}, defs);
        u.svg('stop', {offset:'0','stop-color':i===0?'#eee1b8':'#6c83b1'}, grad);
        u.svg('stop', {offset:'1','stop-color':i===0?'#e7d7a7':'#445e98'}, grad);
        u.svg('path', {d:i===0?'M1 56L14 9Q17 1 27 1H198Q208 1 211 10L224 56Z':'M1 1H197Q207 1 211 10L224 56H18Z',fill:'url(#tab-'+i+')',stroke:i===0?'#c5ae73':'#97afd8','stroke-width':2}, bg);
        u.el('span', '', tab, label);
        tab.type = 'button'; tab.dataset.action = label.toLowerCase().replace(' ', '');
      });
      _c.tabs = tabs;
    },
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.page.querySelector('.ref-instruction');
      if (note) note.classList.add('instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.tabs;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      _c.body = _c.page;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
    },
    'frame.stage': () => (_c) => {
      const u = _c.util;
      const stage = u.el('main', 'cube-stage', _c.page);
      stage.dataset.role = 'stage';
      const note = u.el('aside', 'cd-note', _c.page); note.hidden = true;
      const notes = {
        puzzles: 'More geometry puzzles will unlock as you finish each shape.',
        activities: 'Activities: orientation, symmetry and tiling.',
        help: 'Drag the round handle around the circle to turn the shape.',
      };
      _c.tabs.addEventListener('click', (event) => {
        const action = event.target.closest('[data-action]')?.dataset.action;
        if (!action) return;
        note.hidden = action === 'shapelab';
        note.textContent = notes[action] || '';
        for (const t of _c.tabs.querySelectorAll('.cd-tab')) t.classList.toggle('active', t.dataset.action === action);
      });
      Object.assign(_c, { stage, note });
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        _c.page.insertBefore(note, _c.stage);
        note.querySelector('.ref-note-x').textContent = 'Close';
      }
      const heading = _c.page.querySelector('.ref-instruction, .ref-note');
      if (heading && _c.display !== 'panel') {
        const pageBox = _c.page.getBoundingClientRect();
        const noteBox = heading.getBoundingClientRect();
        const stageBox = _c.stage.getBoundingClientRect();
        if (noteBox.bottom + 12 > stageBox.top) _c.stage.style.top = `${noteBox.bottom - pageBox.top + 12}px`;
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const bar = u.el('footer', 'cd-bar', document.body);
      const nav = u.el('div', 'cd-nav', bar);
      [['home', 'Home'], ['reset', 'Reset Shape'], ['help', 'Instructions']].forEach(([ic, label]) => {
        const b = u.el('button', 'cd-nav-btn', nav);
        b.type = 'button'; icon(b, ic, 34); u.el('span', '', b, label);
        b.dataset.action = 'nav-' + ic;
        if (ic !== 'help') b.onclick = () => env.log('decoy', { label });
        if (ic === 'help') b.onclick = () => { _c.note.hidden = !_c.note.hidden; _c.note.textContent = 'Drag the round handle around the circle until the shape matches the reference.'; };
      });
      if (_c.ctx.finish) u.el('span', 'cd-session', bar, 'Discovery Workshop • Shape Lab');
      base(_c);
      bar.appendChild(document.body.querySelector('.ref-foot'));
      _c.bar = bar;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.bar.appendChild(dock);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-rotate-object-orient-12',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css', 'widget.css'],
    initialOverlay: { kind: 'chat' },
    design: {
      THEMES: { 'design-rotate-object-orient-12': palette },
      LOW_THEME: palette,
      ACCENTS: ['#1d3f8f'],
      LOW_ACCENTS: ['#1d3f8f'],
      parts,
    },
  });
})();
