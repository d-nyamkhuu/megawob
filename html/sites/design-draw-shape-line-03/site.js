// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  function frameNew(ctx) {
    const u = ctx.util,
      body = document.body;
    body.className = 'design rb';
    // Compact windows use the header note so the inspector's end control stays visible.
    const display =
      ['panel', 'toast'].includes(ctx.display) && document.documentElement.clientHeight < 700 ? 'header' : ctx.display;
    body.dataset.instructionDisplay = display;
    for (const [k, v] of Object.entries({
      bg: '#a9c4e2',
      panel: '#fff',
      fg: '#111820',
      muted: '#657080',
      line: '#c9cfd5',
      accent: '#2685dd',
    }))
      document.documentElement.style.setProperty('--' + k, v);
    const win = u.el('div', 'rb-win', body);
    const tb = u.el('div', 'rb-title', win);
    const ic = u.svg('svg', { class: 'rb-appicon', width: 22, height: 22, viewBox: '0 0 22 22' }, tb);
    u.svg('rect', { x: 1, y: 1, width: 9, height: 9, fill: '#e8742a' }, ic);
    u.svg('rect', { x: 11, y: 1, width: 9, height: 9, fill: '#59a8e8' }, ic);
    u.svg('rect', { x: 1, y: 11, width: 9, height: 9, fill: '#5fbf4a' }, ic);
    u.svg('rect', { x: 11, y: 11, width: 9, height: 9, fill: '#f2c53a' }, ic);
    u.el('span', 'rb-ttext', tb, 'Line Challenge - Draw');
    const wc = u.el('div', 'rb-wc', tb);
    for (const [c, t] of [
      ['min', '▁'],
      ['max', '▢'],
      ['close', '✕'],
    ]) {
      const b = u.el('button', 'rb-wcb ' + c, wc, t);
      b.type = 'button';
      b.onclick = () => env.log('window-control', { label: c });
    }
    const tabs = u.el('div', 'rb-tabs', win);
    for (const [i, t] of ['Home', 'View', 'Help'].entries()) {
      const b = u.el('button', 'rb-tab' + (i === 0 ? ' on' : ''), tabs, t);
      b.type = 'button';
    }
    const rib = u.el('div', 'rb-ribbon', win);
    const P = {
      Select: 'M6 3V26L12 21L16 30L20 28L16 19L24 19Z',
      Pencil: 'M5 27L7 20L24 3L29 8L12 25ZM21 6L26 11',
      Eraser: 'M4 20L16 8L28 14L18 26H10ZM10 14L22 20',
      Clear: 'M13 4L19 4L18 14L25 20L22 28H10L8 20L13 14Z',
      'Zoom In': 'M13 4A9 9 0 1 1 13 22A9 9 0 1 1 13 4M20 20L29 29M9 13H17M13 9V17',
      'Zoom Out': 'M13 4A9 9 0 1 1 13 22A9 9 0 1 1 13 4M20 20L29 29M9 13H17',
      '100%': 'M8 3H21L26 8V29H8ZM12 12H22M12 17H22M12 22H18',
      Undo: 'M12 6L4 14L12 22M4 14H20Q28 14 28 24',
      Redo: 'M20 6L28 14L20 22M28 14H12Q4 14 4 24',
      'Clear All': 'M7 8H25M12 8V4H20V8M9 8L11 29H21L23 8M14 13V24M18 13V24',
    };
    const tool = (par, name, on, dis, fn) => {
      const b = u.el('button', 'rb-tool' + (on ? ' on' : '') + (dis ? ' dis' : ''), par);
      b.type = 'button';
      const s = u.svg(
        'svg',
        {
          width: 36,
          height: 36,
          viewBox: '0 0 32 32',
          fill: 'none',
          stroke: '#4e719d',
          'stroke-width': 1.2,
          'stroke-linejoin': 'round',
        },
        b,
      );
      const id = 'rb-icon-' + name.replace(/\W/g, '');
      const defs = u.svg('defs', {}, s);
      const grad = u.svg('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
      for (const [offset, color] of [
        ['0%', '#c2d9f1'],
        ['48%', '#89aed5'],
        ['100%', '#3e6d9e'],
      ])
        u.svg('stop', { offset, 'stop-color': color }, grad);
      const silver = u.svg('linearGradient', { id: id + 's', x1: 0, y1: 0, x2: 1, y2: 1 }, defs);
      u.svg('stop', { offset: '0%', 'stop-color': '#fff' }, silver);
      u.svg('stop', { offset: '100%', 'stop-color': '#939594' }, silver);
      const path = (d, fill = 'none', stroke = '#4e719d', width = 1.2) =>
        u.svg('path', { d, fill, stroke, 'stroke-width': width }, s);
      if (name === 'Pencil') {
        path('M4 28L28 4', 'none', '#315a8b', 2.7);
        path('M6 26L27 5', 'none', '#7093b9', 1);
      } else if (name === 'Select') path(P[name], 'url(#' + id + ')');
      else if (name === 'Eraser') {
        path('M4 20L18 6L29 12L15 26Z', 'url(#' + id + 's)', '#676966');
        path('M4 20L15 26V29L4 24Z', '#a9a9a4', '#666');
        path('M15 26L29 12V17L15 29Z', '#737670', '#555');
        path('M4 20L11 13L22 19L15 26Z', '#f2f3ef', '#777');
      } else if (name === 'Clear') {
        path('M12 4L15 3L17 6L14 25L9 27L11 6Z', 'url(#' + id + 's)', '#8a8a82');
        path('M9 24L25 9L27 12L14 27Z', 'url(#' + id + 's)', '#8a8a82');
        path('M6 26Q16 33 29 24L29 20Q18 27 6 24Z', 'url(#' + id + 's)', '#888');
      } else if (name === 'Undo' || name === 'Redo') {
        const d =
          name === 'Undo'
            ? 'M14 7L3 16L14 23V18Q25 18 29 25Q29 12 14 12Z'
            : 'M18 7L29 16L18 23V18Q7 18 3 25Q3 12 18 12Z';
        path(d, 'url(#' + id + ')', '#7090b0');
      } else if (name === 'Clear All') {
        path('M9 8L10 29H23L24 8Z', 'url(#' + id + 's)', '#8b8c87');
        path('M6 6H27V9H6Z', 'url(#' + id + 's)', '#8b8c87');
        path('M13 6V3H21V6', 'none', '#8b8c87', 2);
        for (const x of [13, 17, 21]) path('M' + x + ' 12V25', 'none', '#f7f7f2', 1.8);
      } else if (name.startsWith('Zoom')) {
        u.svg('circle', { cx: 13, cy: 13, r: 10, fill: 'url(#' + id + ')', stroke: '#406997' }, s);
        u.svg('circle', { cx: 13, cy: 13, r: 7.2, fill: '#f4faff', stroke: '#7293b8' }, s);
        path('M21 21L29 29', 'none', '#315c8e', 4.5);
        path('M9 13H17' + (name === 'Zoom In' ? 'M13 9V17' : ''), 'none', '#41699b', 2);
      } else {
        path(P[name], '#f7fbff', '#3d669d', 1.4);
        for (const y of [10, 15, 20]) path('M11 ' + y + 'H13', 'none', '#4676a8', 1.2);
        path('M18 21L20 28L22 24L25 26L26 24L23 22L26 20Z', '#7699bd', '#3d669d', 0.7);
      }
      u.el('span', '', b, name);
      b.onclick = () => {
        if (fn) fn();
      };
      return b;
    };
    const grp = (name, cls) => {
      const g = u.el('div', 'rb-group ' + (cls || ''), rib);
      const r = u.el('div', 'rb-grow', g);
      u.el('small', '', g, name);
      return r;
    };
    let r = grp('Tools');
    const tools = [];
    for (const n of ['Select', 'Pencil', 'Eraser', 'Clear']) {
      const b = tool(r, n, n === 'Pencil', false, () => {
        if (n === 'Clear') env.widgetDef.clear?.();
        else {
          tools.forEach((x) => x.classList.remove('on'));
          b.classList.add('on');
        }
      });
      if (n !== 'Clear') tools.push(b);
    }
    r = grp('Color');
    const sw = u.el('div', 'rb-swatches', r);
    for (const [i, c] of ['#000', '#ee1c25', '#2a6fe0', '#12b83a', '#8c8c8c'].entries()) {
      const s = u.el('button', 'rb-sw' + (i === 0 ? ' on' : ''), sw);
      s.type = 'button';
      s.style.background = c;
      s.onclick = () => {
        sw.querySelectorAll('.rb-sw').forEach((x) => x.classList.remove('on'));
        s.classList.add('on');
      };
    }
    r = grp('Stroke Width');
    const sd = u.el('div', 'rb-stroke', r);
    for (const h of [2, 3, 5]) u.el('i', '', sd).style.height = h + 'px';
    u.el('b', '', sd, '▾');
    r = grp('Zoom');
    for (const n of ['Zoom In', 'Zoom Out', '100%']) tool(r, n);
    r = grp('Edit');
    for (const n of ['Undo', 'Redo']) tool(r, n, false, true);
    tool(r, 'Clear All', false, false, () => env.widgetDef.clear?.());
    const main = u.el('div', 'rb-main', win);
    const left = u.el('div', 'rb-bench', main);
    const note = u.el('section', 'task-note rb-note', left);
    const instruction = u.el('div', 'instruction', note, ctx.instruction);
    if (display === 'hidden') note.hidden = true;
    else if (display === 'toast') {
      note.classList.add('instruction-toast');
      const x = u.el('button', 'note-close', note, '×');
      x.onclick = () => (note.style.visibility = 'hidden');
    } else if (display === 'panel') note.classList.add('instruction-panel');
    const stage = u.el('main', 'stage', left);
    stage.dataset.role = 'stage';
    const ins = u.el('aside', 'rb-insp', main);
    u.el('h3', 'rb-h', ins, 'Drawing Settings');
    const b1 = u.el('div', 'rb-sec', ins);
    u.el('label', '', b1, 'Line Color');
    const sel = u.el('div', 'rb-sel', b1);
    u.el('i', 'rb-chip', sel);
    u.el('span', '', sel, 'Black');
    u.el('b', '', sel, '▾');
    u.el('label', '', b1, 'Line Width');
    const sel2 = u.el('div', 'rb-sel', b1);
    u.el('i', 'rb-line', sel2);
    u.el('span', '', sel2, '2 px');
    u.el('b', '', sel2, '▾');
    const b2 = u.el('div', 'rb-sec rb-canvas', ins);
    u.el('h4', '', b2, 'Canvas');
    u.el('p', '', b2, 'Width:  800 px');
    u.el('p', '', b2, 'Height: 450 px');
    u.el('h3', 'rb-h rb-h2', ins, 'Instructions');
    const ol = u.el('ol', 'rb-steps', ins);
    // Help describes the drawing controls without interpreting or repeating the goal.
    const li = u.el('li', '', ol, 'Click and drag ');
    u.el('u', '', li, 'on the canvas');
    li.append(' to draw a freehand stroke.');
    u.el('li', '', ol, 'Release the mouse button to finish drawing.');
    u.el('li', '', ol, 'Use Clear All to remove your drawing.');
    if (display === 'panel') {
      ins.insertBefore(note, ol);
    } else if (display === 'toast') {
      win.insertBefore(note, main);
    }
    const er = ctx.rng.fork('chrome/end');
    const original = er.bool(0.5);
    const placement = original ? 'footer' : er.pick(['header', 'link']);
    const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
    const labels = ctx.content.END_LABELS.map(labelOf);
    const endLabel = original ? 'Submit' : er.pick(labels);
    win.dataset.endPlacement = ctx.finish ? 'none' : placement;
    const actions = u.el('div', 'rb-actions', tabs);
    let submit = null;
    const foot = u.el('div', 'rb-foot', ins);
    if (!ctx.finish) {
      submit = u.el(
        placement === 'link' ? 'a' : 'button',
        placement === 'link' ? 'rb-endlink' : placement === 'header' ? 'submit rb-endheader' : 'submit',
        placement === 'header' ? actions : foot,
        endLabel,
      );
      if (placement === 'link') submit.href = '#';
      else submit.type = 'button';
      submit.dataset.role = 'submit';
      submit.title = endLabel;
      submit.setAttribute('aria-label', endLabel);
      submit.onclick = (e) => {
        e.preventDefault();
        ctx.submit();
      };
    }
    if (ctx.finish || placement === 'header') foot.hidden = true;
    const cr = ctx.rng.fork('chrome/collide');
    if (cr.bool(0.3)) {
      const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      if (options.length) {
        const label = cr.pick(options);
        const decoy = u.el('button', 'rb-xtra', actions, label);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', { label, collide: true });
      }
    }
    if (!actions.children.length) actions.hidden = true;
    return { stage, submit };
  }
  env.site({
    name: 'design-draw-shape-line-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'split-level',
        'theme': 'vista',
        'title': 'Path Tracer',
        'menu': 'File    Edit    View    Tools    Help',
        'foot': '',
        'accent': '#2685dd',
        'bg': '#d8e8f6',
        'surface': '#fff',
        'font': 'Arial, sans-serif',
        'ob': 'newsletter',
      },
      parts: {
        'frame.1': () => ({ ctx }) => frameNew(ctx),
        'overlay.7': (base, S) =>
          function (_c) {
            const { kind, o } = _c;
            if (o === 'update') {
              _c.title = 'A new version is available';
              _c.text = 'Get the latest features and security fixes.';
              _c.label = 'Remind me later';
            } else if (o === 'privacy') {
              _c.title = 'We’d like your consent';
              _c.text =
                'We use optional analytics to improve this application. You can change this setting at any time in the Options menu.';
              _c.label = 'Reject optional';
            } else if (o === 'tips') {
              _c.title = 'Tip of the day';
              _c.text = 'Use the ribbon to explore the drawing tools.';
              _c.label = 'Close';
            } else if (o === 'newsletter') {
              _c.title = 'Product Updates Newsletter';
              _c.text = 'Get occasional updates about new features and tips.';
              _c.label = 'Close';
            } else if (o === 'notifications') {
              _c.title = 'Notifications (5)';
              _c.text =
                'Software Update Available\nDisk Almost Full\nTip of the Day\nWelcome to Shape Sorter\nReminder';
              _c.label = 'Dismiss all';
            } else if (o === 'survey') {
              _c.title = 'Quick Survey';
              _c.text = 'Please take a moment to give us some feedback.\nHow easy is this training task?';
              _c.label = 'Close survey';
            } else {
              _c.title = {
                cookie: 'Your privacy',
                toast: 'Changes saved',
                chat: 'Support',
                promo: 'Workspace update',
                banner: 'Service notice',
              }[kind];
              _c.text = {
                cookie: 'This application stores optional cookies.',
                toast: 'Your changes have been saved.',
                chat: 'Need a hand with this workspace?',
                promo: 'Explore the latest workspace features.',
                banner: 'You are viewing a shared workspace.',
              }[kind];
              _c.label = kind === 'cookie' ? 'Reject optional' : 'Close';
            }
          },
        'overlay.13': (base, S) =>
          function (_c) {
            const { box, ctx, dismiss, o, u } = _c;
            if (o === 'newsletter') {
              u.el('div', 'nl-input', box, 'Your email address (optional)');
              const cb = u.el('div', 'nl-check', box);
              u.el('span', 'nl-box', cb);
              u.el('span', '', cb, 'Send me product updates');
              const x = u.el('button', 'nl-x', box, '✕');
              x.type = 'button';
              x.onclick = () => dismiss.click();
              if (env.timeText) env.timeText.textContent = 'Time: Paused (starts after you close the newsletter)';
            }
            dismiss.type = 'button';
            dismiss.onclick = () => {
              if (env.timeText) env.timeText.textContent = 'Time: Ready';
              ctx.dismiss('close');
            };
          },
        'overlay.14': () => () => {},
      },
    },
  });
})();
