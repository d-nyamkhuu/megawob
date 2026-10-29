(function () {
  'use strict';
  const paths = {
    Select: 'M5 2V29L12 22L18 32L23 29L17 20H28Z',
    Pan: 'M12 32L3 20Q0 14 4 14Q6 14 11 19V7Q11 3 15 5V17V3Q15 -1 19 3V17V4Q19 0 23 4V18V8Q23 4 27 8V20V12Q27 8 31 12V25L25 34H14Z',
    'Zoom In': 'M23 23L32 32M26 13A11 11 0 1 1 4 13A11 11 0 1 1 26 13M9 13H21M15 7V19',
    'Zoom Out': 'M23 23L32 32M26 13A11 11 0 1 1 4 13A11 11 0 1 1 26 13M9 13H21',
    'Fit to Window': 'M4 4H30V30H4ZM7 7L13 13M27 7L21 13M7 27L13 21M27 27L21 21M7 12V7H12M22 7H27V12M7 22V27H12M22 27H27V22M14 14H20V20H14Z',
    'Add Point': 'M5 2V29L12 22L18 32L23 29L17 20H28Z',
    'Add Circle': 'M31 17A14 14 0 1 1 3 17A14 14 0 1 1 31 17Z',
    'Add Line': 'M5 29L29 5M8 29A3 3 0 1 1 2 29A3 3 0 1 1 8 29M32 5A3 3 0 1 1 26 5A3 3 0 1 1 32 5',
    Erase: 'M3 21L20 3H26L33 10V15L16 32H10ZM3 21L14 31M14 9L26 21',
    Undo: 'M15 3L2 14L15 23V17H22Q30 17 31 28Q33 10 22 10H15Z',
    Redo: 'M19 3L32 14L19 23V17H12Q4 17 3 28Q1 10 12 10H19Z',
    Settings: 'M14 1H20L21 6L25 8L30 6L34 12L30 16V20L34 24L30 30L25 28L21 30L20 35H14L13 30L9 28L4 30L0 24L4 20V16L0 12L4 6L9 8L13 6ZM24 18A7 7 0 1 1 10 18A7 7 0 1 1 24 18'
  };
  env.site({
    name: 'design-click-point-center-01', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'design office' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const vars = { bg: '#e5edf6', panel: '#ffffff', fg: '#07152b', muted: '#40526b', line: '#a5bfdc', accent: '#4f83c5', font: '"Segoe UI", Arial, sans-serif' };
      for (const [key, value] of Object.entries(vars)) document.documentElement.style.setProperty('--' + key, value);
      const shell = u.el('div', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const titlebar = u.el('div', 'titlebar', head);
      const quick = u.el('div', 'quick-tools', titlebar);
      for (const [i, color] of ['#d1a845', '#c9504b'].entries()) {
        const bt = u.el('button', 'quick-tool', quick); bt.type = 'button'; bt.setAttribute('aria-label', i ? 'Save practice' : 'Geometry Practice');
        const icon = u.svg('svg', { width: 19, height: 21, viewBox: '0 0 20 22' }, bt);
        u.svg('path', { d: 'M3 1H13L18 6V21H3Z', fill: '#dfedfc', stroke: '#4d7299' }, icon);
        u.svg('path', { d: 'M13 1V7H18M5 17L9 5L14 17M7 13H12', fill: 'none', stroke: color, 'stroke-width': 2.7 }, icon);
      }
      u.el('div', 'title', titlebar, 'Geometry Practice - Circle Center');
      const controls = u.el('div', 'window-controls', titlebar);
      for (const [label, name] of [['−', 'Minimize'], ['□', 'Maximize'], ['×', 'Close']]) {
        const bt = u.el('button', 'window-' + name.toLowerCase(), controls, label);
        bt.type = 'button'; bt.setAttribute('aria-label', name);
        bt.onclick = () => env.log('window-control', { label });
      }
      const menu = u.el('nav', 'menu', head);
      const file = u.el('button', 'file-menu', menu); file.type = 'button'; file.setAttribute('aria-label', 'Application menu');
      const fileIcon = u.svg('svg', { width: 24, height: 20, viewBox: '0 0 24 20', fill: 'none', stroke: '#fff', 'stroke-width': 2 }, file);
      u.svg('path', { d: 'M4 15V6H10V14H15V7H21M6 4H12M8 1V8M17 3L21 7L17 11M2 12H9' }, fileIcon);
      for (const name of ['Home', 'View', 'Tools', 'Help']) {
        const bt = u.el('button', 'menu-tab' + (name === 'Home' ? ' active' : ''), menu, name); bt.type = 'button';
        bt.onclick = () => { menu.querySelectorAll('.menu-tab').forEach(el => el.classList.toggle('active', el === bt)); };
      }
      const ribbon = u.el('div', 'ribbon', head);
      const groups = [['Navigate', ['Select', 'Pan', 'Zoom In', 'Zoom Out', 'Fit to Window']], ['Draw', ['Add Point', 'Add Circle', 'Add Line', 'Erase']], ['Edit', ['Undo', 'Redo']], ['Options', ['Settings']]];
      for (const [group, names] of groups) {
        const container = u.el('div', 'tool-group group-' + group.toLowerCase(), ribbon);
        const row = u.el('div', 'tool-row', container);
        for (const name of names) {
          const bt = u.el('button', 'tool' + (name === 'Select' ? ' selected' : '') + (name === 'Add Point' ? ' add-point' : ''), row);
          bt.type = 'button'; bt.dataset.tool = name;
          const frame = u.el('span', 'icon-frame', bt);
          const icon = u.svg('svg', { width: 38, height: 38, viewBox: '-2 -2 40 40', fill: 'none', stroke: '#294564', 'stroke-width': 1.8, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, frame);
          const defs = u.svg('defs', {}, icon);
          const id = 'tool-' + name.replaceAll(' ', '-');
          const gradient = u.svg('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
          const colors = name === 'Erase' ? ['#ffb6bb', '#dd666c'] : ['#c1d8f5', '#5b86bd'];
          u.svg('stop', { offset: '0%', 'stop-color': colors[0] }, gradient);
          u.svg('stop', { offset: '100%', 'stop-color': colors[1] }, gradient);
          const filled = ['Select', 'Add Point', 'Erase', 'Undo', 'Redo', 'Settings'].includes(name);
          if (name === 'Zoom In' || name === 'Zoom Out') u.svg('circle', { cx: 15, cy: 13, r: 10.5, fill: '#e9f3fc', stroke: 'none' }, icon);
          u.svg('path', { d: paths[name], fill: name === 'Pan' ? '#f6faff' : filled ? 'url(#' + id + ')' : 'none', 'fill-rule': name === 'Settings' ? 'evenodd' : 'nonzero', 'stroke-width': name === 'Add Circle' ? 2.5 : 1.8 }, icon);
          if (name === 'Fit to Window') for (const [x, y] of [[7, 7], [23, 7], [7, 23], [23, 23]]) u.svg('rect', { x, y, width: 4, height: 4, rx: 1, fill: '#5e8ebf', stroke: '#426589', 'stroke-width': .7 }, icon);
          if (name === 'Add Line') for (const [cx, cy] of [[5, 29], [29, 5]]) u.svg('circle', { cx, cy, r: 2.8, fill: '#6c8cba', stroke: '#294564', 'stroke-width': 1.5 }, icon);
          if (name === 'Zoom In' || name === 'Zoom Out') u.svg('path', { d: 'M24 24L32 32', stroke: '#243a50', 'stroke-width': 4 }, icon);
          const caption = u.el('span', 'tool-caption', bt);
          if (name === 'Fit to Window' || name === 'Add Point') {
            u.el('span', '', caption, name === 'Add Point' ? 'Add' : 'Fit to');
            u.el('span', '', caption, name === 'Add Point' ? 'Point' : 'Window');
          } else caption.textContent = name;
          if (name === 'Settings') u.el('span', 'dropdown-arrow', bt);
          bt.onclick = () => { ribbon.querySelectorAll('.tool').forEach(el => el.classList.toggle('selected', el === bt)); };
        }
        u.el('div', 'group-label', container, group);
      }
      const content = u.el('div', 'content', shell);
      const dims = ctx.size || {};
      const viewportWidth = dims.width || dims.w || document.documentElement.clientWidth;
      const viewportHeight = dims.height || dims.h || document.documentElement.clientHeight;
      let display = ctx.display || 'header';
      if ((display === 'panel' && viewportWidth < 1260) || (display === 'toast' && viewportHeight < 700)) display = 'header';
      const note = u.el('section', 'task-note', content);
      u.el('div', 'panel-heading note-label', note, 'Task');
      const brief = u.el('div', 'brief', note);
      const instruction = u.el('div', 'instruction', brief, ctx.instruction);
      const explanation = u.el('p', 'explanation', brief, 'Click exactly at the center of the circle shown below.');
      if (display === 'hidden' || display === 'panel') {
        note.hidden = true;
        content.classList.add('note-removed');
      }
      if (display === 'toast') {
        note.classList.add('toast-note');
        brief.classList.add('toast-brief'); explanation.hidden = true;
        const close = u.el('button', 'note-close', brief, '×'); close.type = 'button';
        close.setAttribute('aria-label', 'Close');
        close.onclick = () => { brief.style.visibility = 'hidden'; };
      }
      const stage = u.el('main', 'stage', content); stage.dataset.role = 'stage';
      const aside = u.el('aside', 'aside', content);
      if (display === 'panel') {
        const panel = u.el('section', 'instruction-panel', aside);
        u.el('h3', 'panel-heading', panel, 'Task instructions');
        u.el('div', 'panel-instruction', panel, ctx.instruction);
      }
      u.el('h3', 'panel-heading', aside, 'Your Answer');
      const answer = u.el('div', 'answer-body', aside);
      u.el('p', 'answer-state', answer, 'No point selected yet.');
      u.el('hr', '', answer);
      for (const axis of ['X', 'Y']) {
        const p = u.el('p', 'coordinate', answer);
        u.el('span', 'coordinate-label', p, axis + ':'); u.el('span', 'coordinate-value', p, '—');
      }
      let submit = null;
      let makeEnd = null;
      let endPlacement = null;
      if (!ctx.finish) {
        const endRng = ctx.rng.fork('chrome/end');
        const labels = (ctx.content && Array.isArray(ctx.content.END_LABELS) ? ctx.content.END_LABELS : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'])
          .map(x => typeof x === 'string' ? x : x && (x.label || x.text || x.name)).filter(Boolean);
        const submitLabel = labels.find(x => String(x).trim().toLowerCase() === 'submit') || 'Submit';
        const baseline = endRng.bool(0.5);
        endPlacement = baseline ? 'answer' : endRng.pick(['toolbar', 'footer']);
        const label = baseline ? submitLabel : endRng.pick(labels.filter(x => String(x).trim().toLowerCase() !== String(submitLabel).trim().toLowerCase()));
        makeEnd = (parent, cls) => {
          const button = u.el('button', cls, parent, label); button.type = 'button';
          button.dataset.role = 'submit'; button.setAttribute('aria-label', label); button.title = label;
          button.onclick = () => ctx.submit(); return button;
        };
        if (endPlacement === 'answer') submit = makeEnd(answer, 'submit');
        else if (endPlacement === 'toolbar') submit = makeEnd(menu, 'submit ribbon-submit');

        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3)) {
          const options = [...new Set(labels)].filter(x => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase());
          if (options.length) {
            const decoyLabel = collideRng.pick(options);
            const decoy = u.el('button', 'end-xtra', menu, decoyLabel); decoy.type = 'button';
            decoy.dataset.role = 'xtra';
            decoy.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
          }
        }
      }
      const footer = u.el('footer', 'footer', shell);
      u.el('div', 'footer-copy', footer, 'Click to select a point.');
      if (endPlacement === 'footer') submit = makeEnd(footer, 'submit footer-submit');
      const zoom = u.el('div', 'zoom-status', footer);
      u.el('span', 'zoom-value', zoom, '100%');
      u.el('span', 'zoom-minus', zoom, '−');
      const track = u.el('span', 'zoom-track', zoom); u.el('span', 'zoom-thumb', track);
      u.el('span', 'zoom-plus', zoom, '+');
      u.el('span', 'resize-grip', footer);
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'obstruction obstruction-' + ctx.kind, document.body); el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const titles = { cookie: 'Your privacy', toast: 'Changes saved', chat: 'Support', promo: 'Workspace update', banner: 'Service notice' };
      const descriptions = { cookie: 'This application stores optional cookies.', toast: 'Your changes have been saved.', chat: 'Need a hand with this workspace?', promo: 'Explore the latest workspace features.', banner: 'You are viewing a shared workspace.' };
      u.el('h3', '', box, titles[ctx.kind]); u.el('p', '', box, descriptions[ctx.kind]);
      const dismiss = u.el('button', 'dismiss', box, ctx.kind === 'cookie' ? 'Reject optional' : 'Close'); dismiss.type = 'button'; dismiss.onclick = () => ctx.dismiss('close');
      if (ctx.kind === 'cookie') { const accept = u.el('button', 'dismiss', box, 'Accept optional'); accept.type = 'button'; accept.onclick = () => ctx.dismiss('accept'); }
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
    }
  });
})();
