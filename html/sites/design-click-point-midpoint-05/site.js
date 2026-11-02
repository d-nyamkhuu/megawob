// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  function frameNew(ctx) {
    const u = ctx.util,
      body = document.body;
    body.className = 'design forum rf' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
    const endRng = ctx.rng.fork('chrome/end'),
      collideRng = ctx.rng.fork('chrome/collide');
    const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
    const labels = (
      ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
        ? ctx.content.END_LABELS
        : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"]
    ).map(labelOf);
    const legacy = endRng.bool(0.5),
      endLabel = legacy ? labels.find((x) => x.trim().toLowerCase() === 'submit') || 'Submit' : endRng.pick(labels),
      placement = ctx.finish ? null : legacy ? 'controls' : endRng.pick(['controls', 'toolbar', 'activity']);
    let collide = null;
    if (!ctx.finish && collideRng.bool(0.3)) {
      const choices = [...new Set(labels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()))];
      if (choices.length) collide = collideRng.pick(choices);
    }
    const root = document.documentElement;
    for (const [k, v] of Object.entries({
      bg: '#eef2f8',
      panel: '#ffffff',
      fg: '#111111',
      muted: '#555b66',
      line: '#9fb0c8',
      accent: '#1c3d6e',
    }))
      root.style.setProperty('--' + k, v);
    root.style.setProperty('--font', 'Verdana, Tahoma, "DejaVu Sans", sans-serif');
    const shell = u.el('div', 'rf-shell', body);
    const top = u.el('header', 'rf-top', shell);
    u.el('div', 'rf-brand', top, 'TaskTools');
    u.el('div', 'rf-title', top, 'Point Precision Task');
    const links = u.el('div', 'rf-links', top);
    for (const [i, t] of ['Profile', '|', 'Log Out'].entries()) {
      if (t === '|') u.el('span', '', links, t);
      else {
        const a = u.el('a', '', links, t);
        a.href = '#';
        a.onclick = (e) => {
          e.preventDefault();
        };
      }
    }
    const rail = u.el('nav', 'rf-rail', shell);
    const ICONS = {
      Tasks: 'M6 2H17L23 8V26H6ZM17 2V8H23M10 13H19M10 17H19M10 21H17',
      Results: 'M5 26V15H10V26M12 26V6H17V26M19 26V11H24V26',
      Help: 'M15 3A12 12 0 1 1 14.9 3ZM11 11Q11 7 15 7Q19 7 19 11Q19 14 15 15V18M15 21V23',
      Settings:
        'M15 4V8M15 22V26M4 15H8M22 15H26M7 7L10 10M20 20L23 23M23 7L20 10M10 20L7 23M19 15A4 4 0 1 1 11 15A4 4 0 1 1 19 15',
    };
    for (const [i, n] of ['Tasks', 'Results', 'Help', 'Settings'].entries()) {
      const b = u.el('button', 'rf-nav' + (i === 0 ? ' on' : ''), rail);
      b.type = 'button';
      const s = u.svg('svg', { width: 28, height: 28, viewBox: '0 0 30 30' }, b);
      const defs = u.svg('defs', {}, s),
        grad = u.svg('linearGradient', { id: 'nav-fill-' + i, x2: '0', y2: '1' }, defs);
      u.svg('stop', { offset: '0', 'stop-color': '#6ca8d5' }, grad);
      u.svg('stop', { offset: '1', 'stop-color': '#14557d' }, grad);
      if (n === 'Tasks') {
        u.svg('path', { d: 'M6 2H18L24 8V28H6Z', fill: '#f5fbff', stroke: '#39729c', 'stroke-width': 1.2 }, s);
        u.svg('path', { d: 'M18 2V9H24', fill: '#bfd9ed', stroke: '#39729c' }, s);
        u.svg('path', { d: 'M10 13H20M10 17H20M10 21H19M10 25H17', stroke: '#75a7c9', 'stroke-width': 1.5 }, s);
      } else if (n === 'Results') {
        for (const [x, y, h] of [
          [3, 21, 7],
          [10, 3, 25],
          [18, 12, 16],
          [25, 6, 22],
        ])
          u.svg('rect', { x, y, width: 4, height: h, fill: 'url(#nav-fill-' + i + ')' }, s);
      } else if (n === 'Help') {
        u.svg('circle', { cx: 15, cy: 15, r: 13, fill: 'url(#nav-fill-' + i + ')', stroke: '#4f8bb4' }, s);
        const t = u.svg(
          'text',
          {
            x: 15,
            y: 23,
            fill: 'white',
            'text-anchor': 'middle',
            'font-family': 'Arial',
            'font-weight': 'bold',
            'font-size': 23,
          },
          s,
        );
        t.textContent = '?';
      } else {
        u.svg(
          'path',
          {
            d: 'M12 1H18L19 5L22 7L26 6L29 11L26 14V17L29 20L26 25L22 24L19 26L18 30H12L11 26L8 24L4 25L1 20L4 17V14L1 11L4 6L8 7L11 5Z',
            fill: '#416d89',
            stroke: '#2e546f',
          },
          s,
        );
        u.svg('circle', { cx: 15, cy: 15, r: 7, fill: '#a7c5d9', stroke: '#315775', 'stroke-width': 2 }, s);
        u.svg('circle', { cx: 15, cy: 15, r: 3, fill: '#d4e4ef' }, s);
      }
      u.el('span', '', b, n);
      b.onclick = () => env.log('nav', { n });
    }
    const main = u.el('div', 'rf-main', shell);
    u.el('div', 'rf-bar', main, 'Instructions');
    const content = u.el('div', 'content rf-content', main),
      box = u.el('div', 'rf-intro' + (ctx.instruction.length > 70 ? ' rf-long-note' : ''), content),
      note = u.el('section', 'task-note', box);
    u.el('div', 'note-label', note, '');
    u.el('div', 'instruction', note, ctx.instruction);
    if (ctx.display === 'hidden') {
      note.hidden = true;
      box.hidden = true;
    } else if (ctx.display === 'toast') {
      note.classList.add('rf-toast-note');
      const x = u.el('button', 'note-close', note, '×');
      x.type = 'button';
      x.setAttribute('aria-label', 'Close');
      x.onclick = () => note.remove();
    } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
    if (ctx.display !== 'hidden' && ctx.display !== 'toast') {
      u.el(
        'p',
        'rf-sub',
        box,
        'A and B are the endpoints of a straight line. Click the point that is exactly in the middle.',
      );
      u.el('p', 'rf-sub', box, 'Do not click on A or B.');
    }
    const stage = u.el('main', 'stage', content);
    stage.dataset.role = 'stage';
    const low = u.el('div', 'rf-low', main);
    const act = u.el('section', 'rf-panel', low),
      actBar = u.el('div', 'rf-bar rf-activity-bar', act, 'Activity');
    const tb = u.el('table', 'rf-tbl', act);
    const hr = u.el('tr', '', u.el('thead', '', tb));
    for (const h of ['#', 'Time', 'Event']) u.el('th', '', hr, h);
    const tbody = u.el('tbody', '', tb);
    for (const r of [
      ['3', '14:22:18', 'Task loaded'],
      ['2', '14:22:10', 'Instructions viewed'],
      ['1', '14:22:03', 'Session started'],
      ['', '', ''],
    ]) {
      const tr = u.el('tr', '', tbody);
      for (const c of r) u.el('td', '', tr, c);
    }
    const ctl = u.el('section', 'rf-panel rf-ctl', low);
    u.el('div', 'rf-bar', ctl, 'Controls');
    const cb = u.el('div', 'rf-ctlbody', ctl);
    u.el('p', '', cb, 'Click on the canvas above to place your point, then submit.');
    if (ctx.display === 'panel' || ctx.display === 'toast') {
      box.hidden = true;
      cb.classList.add('rf-note-mode');
      cb.appendChild(note);
      if (ctx.display === 'panel') note.classList.add('rf-panel-note');
    }
    const submitButton = (parent, kind, label) => {
      const b = u.el(
        kind === 'link' ? 'a' : 'button',
        kind === 'link' ? 'rf-endlink' : 'submit rf-submit',
        parent,
        label,
      );
      if (kind === 'link') {
        b.href = '#';
        b.onclick = (e) => e.preventDefault();
      } else b.type = 'button';
      b.dataset.role = 'submit';
      b.setAttribute('aria-label', label);
      b.title = label;
      b.addEventListener('click', (e) => {
        e.preventDefault();
        ctx.submit();
      });
      return b;
    };
    let submit = null;
    if (!ctx.finish) {
      if (placement === 'controls') submit = submitButton(cb, 'button', endLabel);
      else if (placement === 'toolbar') submit = submitButton(links, 'button', endLabel);
      else submit = submitButton(actBar, 'link', endLabel);
    }
    const decoyButton = (parent, label) => {
      const b = u.el('button', 'rf-xtra', parent, label);
      b.type = 'button';
      b.dataset.role = 'xtra';
      b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
      return b;
    };
    if (collide) decoyButton(placement === 'toolbar' ? actBar : links, collide);
    return { stage, submit };
  }
  env.site({
    name: 'design-click-point-midpoint-05',
    styles: ['site.css', 'ref.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'ribbon',
        'theme': 'eink',
        'title': 'Angle Practice',
        'ribbon': true,
        'foot': 'Click a point in the workspace to place a marker.',
        'accent': '#111',
        'bg': '#eeede9',
        'surface': '#f2f1ed',
        'font': 'Georgia, serif',
      },
      parts: {
        'frame.1': (base, S) =>
          function (_c) {
            const { ctx } = _c;
            return frameNew(ctx);
            const u = ctx.util,
              body = document.body;
            Object.assign(_c, { body, u });
          },
        'frame.3': () => () => {},
        'frame.12': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.ribbon) {
              const rib = u.el('div', 'ribbon', head);
              const tool = (parent, name, path) => {
                path =
                  {
                    'Add Point': 'M4 2V28L12 20L18 30L23 27L17 18H29Z',
                    'Erase': 'M5 20L21 3L30 12L14 29H8ZM5 20L14 29M15 10L24 19',
                    'Undo': 'M13 5L3 14L13 22V16H21Q28 16 29 28Q32 9 21 9H13Z',
                    'Redo': 'M19 5L29 14L19 22V16H11Q4 16 3 28Q0 9 11 9H19Z',
                    'Settings':
                      'M13 2H19L20 7L24 9L29 7L32 13L28 17V21L31 25L27 30L22 28L18 30L17 34H11L10 29L6 27L2 29L-1 23L3 19V15L0 11L4 6L9 8L13 6ZM22 17A6 6 0 1 1 10 17A6 6 0 1 1 22 17',
                    'About': 'M29 16A13 13 0 1 1 3 16A13 13 0 1 1 29 16M16 13V24M16 7V9',
                    'Rectangle': 'M4 4H28V28H4Z',
                    'Fit to Window':
                      'M4 4H28V28H4ZM8 8L13 13M24 8L19 13M8 24L13 19M24 24L19 19M8 13V8H13M19 8H24V13M8 19V24H13M19 24H24V19',
                  }[name] || path;
                const bt = u.el('button', 'tool', parent);
                bt.type = 'button';
                const icon = u.svg(
                  'svg',
                  {
                    width: 32,
                    height: 34,
                    viewBox: '0 0 32 32',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': 1.8,
                  },
                  bt,
                );
                u.svg('path', { d: path }, icon);
                u.el('span', '', bt, name);
                bt.onclick = () => {
                  rib.querySelectorAll('.tool').forEach((x) => x.classList.remove('selected'));
                  bt.classList.add('selected');
                };
                return bt;
              };
              const groups =
                C.theme === 'eink'
                  ? ['Tools', 'View', 'Style', 'Help']
                  : C.theme === 'office'
                    ? ['Navigate', 'Draw', 'Edit', 'Options']
                    : ['Navigation', 'Draw', 'Options', 'Support'];
              for (const [j, name] of groups.entries()) {
                const gr = u.el('div', 'tool-group', rib);
                if (j === 0) {
                  for (const t of [
                    'Select',
                    'Pan',
                    'Zoom In',
                    'Zoom Out',
                    C.theme === 'office' ? 'Fit to Window' : 'Reset View',
                  ]) {
                    const path =
                      t === 'Select'
                        ? 'M4 2V28L12 20L18 30L23 27L17 18H29Z'
                        : t === 'Pan'
                          ? 'M9 28L3 16Q2 12 6 13L11 18V5Q13 1 15 5V15V3Q18 0 19 4V15V6Q22 3 23 7V17V11Q27 7 28 12V23L23 30Z'
                          : t === 'Reset View'
                            ? 'M6 9A13 13 0 1 1 4 22M6 2V10H15'
                            : 'M22 22L30 30M25 14A11 11 0 1 1 3 14A11 11 0 1 1 25 14M8 14H20' +
                              (t === 'Zoom In' ? 'M14 8V20' : '');
                    tool(gr, t, path);
                  }
                } else if ((C.theme === 'eink' && j === 1) || (C.theme === 'vista' && j === 2)) {
                  for (const label of C.theme === 'eink'
                    ? ['Show Labels', 'Show Dotted Circle', 'Show Grid']
                    : ['Show Grid', 'Snap to Grid', 'Show Measurements']) {
                    const l = u.el('label', 'check-tool', gr);
                    const input = u.el('input', '', l);
                    input.type = 'checkbox';
                    input.checked =
                      label === 'Show Labels' ||
                      label === 'Show Dotted Circle' ||
                      (label === 'Show Grid' && C.theme === 'vista');
                    u.el('span', '', l, label);
                  }
                } else if (C.theme === 'eink' && j === 2) {
                  for (const [title, values] of [
                    ['Line Thickness', ['2', '1', '3']],
                    ['Dashed Style', ['Dotted', 'Dashed', 'Solid']],
                  ]) {
                    const l = u.el('label', 'style-tool', gr, title);
                    const select = u.el('select', '', l);
                    for (const v of values) u.el('option', '', select, v);
                  }
                } else {
                  let names =
                    C.theme === 'eink'
                      ? ['Instructions', 'Example']
                      : C.theme === 'office'
                        ? j === 1
                          ? ['Add Point', 'Add Circle', 'Add Line', 'Erase']
                          : j === 2
                            ? ['Undo', 'Redo']
                            : ['Settings']
                        : j === 1
                          ? ['Line', 'Circle', 'Rectangle', 'Point']
                          : ['Help', 'About'];
                  for (const t of names)
                    tool(
                      gr,
                      t,
                      t.includes('Circle')
                        ? 'M29 16A13 13 0 1 1 3 16A13 13 0 1 1 29 16'
                        : t.includes('Line')
                          ? 'M3 29L29 3'
                          : t === 'Point'
                            ? 'M19 16A3 3 0 1 1 13 16A3 3 0 1 1 19 16'
                            : t === 'Example'
                              ? 'M6 2H20L27 9V30H6ZM20 2V10H27M10 15H23M10 20H23M10 25H21'
                              : t === 'Instructions' || t === 'Help'
                                ? 'M29 16A13 13 0 1 1 3 16A13 13 0 1 1 29 16M12 10Q12 5 17 6Q23 8 17 14L16 19M16 23V25'
                                : 'M5 5H27V27H5ZM10 16L14 20L23 10',
                    );
                }
                u.el('small', '', gr, name);
              }
            }
          },
        'frame.22': () => () => {},
      },
    },
  });
})();
