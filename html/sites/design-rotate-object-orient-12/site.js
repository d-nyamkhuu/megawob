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
  env.site({
    name: 'design-rotate-object-orient-12', styles: ['site.css', 'widget.css'], scripts: [],
    initialOverlay: { kind: 'chat' },
    frame(ctx) {
      const u = ctx.util;
      // Compact windows use the full-width task note rather than a narrow side card.
      const compact = document.body.getBoundingClientRect().width < 1120;
      const display = compact && ctx.display === 'panel' ? 'header' : ctx.display;
      document.body.className = `cdrom instruction-${display}`;
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

      const tabs = u.el('nav', 'cd-tabs', document.body);
      tabs.setAttribute('aria-label', 'Sections');
      const notes = {
        puzzles: 'More geometry puzzles will unlock as you finish each shape.',
        activities: 'Activities: orientation, symmetry and tiling.',
        help: 'Drag the round handle around the circle to turn the shape.',
      };
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
      const page = u.el('section', 'cd-sheet', document.body);
      const heading = u.el('h1', 'instruction', page, ctx.instruction);
      if (display === 'hidden') heading.hidden = true;
      if (display === 'panel') heading.setAttribute('aria-label', 'Your task');
      if (display === 'toast') {
        const close = u.el('button', 'instruction-dismiss', heading, 'Close');
        close.type = 'button'; close.onclick = () => { heading.hidden = true; };
      }
      const stage = u.el('main', 'cube-stage', page);
      stage.dataset.role = 'stage';
      const note = u.el('aside', 'cd-note', page); note.hidden = true;
      tabs.addEventListener('click', (event) => {
        const action = event.target.closest('[data-action]')?.dataset.action;
        if (!action) return;
        note.hidden = action === 'shapelab';
        note.textContent = notes[action] || '';
        for (const t of tabs.children) t.classList.toggle('active', t.dataset.action === action);
      });

      const bar = u.el('footer', 'cd-bar', document.body);
      const nav = u.el('div', 'cd-nav', bar);
      [['home', 'Home'], ['reset', 'Reset Shape'], ['help', 'Instructions']].forEach(([ic, label]) => {
        const b = u.el('button', 'cd-nav-btn', nav);
        b.type = 'button'; icon(b, ic, 34); u.el('span', '', b, label);
        b.dataset.action = 'nav-' + ic;
        if (ic !== 'help') b.onclick = () => env.log('decoy', { label });
        if (ic === 'help') b.onclick = () => { note.hidden = !note.hidden; note.textContent = 'Drag the round handle around the circle until the shape matches the reference.'; };
      });
      if (ctx.finish) u.el('span', 'cd-session', bar, 'Discovery Workshop • Shape Lab');
      let submit = null;
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = value => typeof value === 'string' ? value : value.label || value.text || value.name;
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const placement = endRng.pick(['footer', 'footer', 'toolbar', 'link']);
      const label = placement === 'footer' ? 'Submit' : endRng.pick(endLabels);
      if (!ctx.finish) {
        submit = u.el(placement === 'link' ? 'a' : 'button', 'submit-button end-' + placement, placement === 'toolbar' ? tabs : bar, label);
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.title = label; submit.setAttribute('aria-label', label);
        submit.dataset.role = 'submit';
        submit.onclick = event => { event.preventDefault(); ctx.submit(); };
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(.3)) {
        const options = [...new Set(endLabels)].filter(text => text.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const decoyLabel = collideRng.pick(options);
          const decoy = u.el('button', 'cd-nav-btn end-xtra', bar, decoyLabel);
          decoy.type = 'button'; decoy.dataset.role = 'xtra';
          decoy.onclick = () => env.log('decoy', { label: decoyLabel, collide: true });
        }
      }
      // Reserve space for wrapped instructions before the widget establishes its anchors.
      if (!heading.hidden && display !== 'panel') {
        const pageBox = page.getBoundingClientRect();
        const noteBox = heading.getBoundingClientRect();
        const stageBox = stage.getBoundingClientRect();
        if (noteBox.bottom + 12 > stageBox.top) stage.style.top = `${noteBox.bottom - pageBox.top + 12}px`;
      }
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
