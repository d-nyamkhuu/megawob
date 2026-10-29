// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  function yosFrame(ctx) {
    const u = ctx.util,
      body = document.body;
    body.className = 'design ysm' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
    const rs = document.documentElement;
    for (const [k, v] of Object.entries({
      bg: '#f6f7f9',
      panel: '#ffffff',
      fg: '#1b2230',
      muted: '#5d6675',
      line: '#d3d7de',
      accent: '#2b6df0',
    }))
      rs.style.setProperty('--' + k, v);
    rs.style.setProperty('--font', '"Helvetica Neue",Helvetica,Arial,sans-serif');
    const shell = u.el('div', 'shell', body);
    const tb = u.el('header', 'ys-title', shell);
    const lights = u.el('div', 'ys-lights', tb);
    for (const c of ['#ff5f57', '#febc2e', '#28c840']) u.el('i', '', lights).style.background = c;
    u.el('div', 'ys-name', tb, 'Geometry Practice');
    const bar = u.el('div', 'ys-toolbar', shell);
    const icons = {
      Select: 'M9 4V27L15 21L20 29L23 27L18 19H25Z',
      Line: 'M6 26L26 6M7 26A1 1 0 1 1 5 26A1 1 0 1 1 7 26M27 6A1 1 0 1 1 25 6A1 1 0 1 1 27 6',
      Circle: 'M28 16A12 12 0 1 1 4 16A12 12 0 1 1 28 16M16 16.1V16',
      Eraser: 'M7 19L20 6Q21 5 22 6L28 12Q29 13 28 14L15 27Q14 28 13 27L7 21Q6 20 7 19ZM14 12L23 21',
      Reset: 'M5 20A12 12 0 1 0 5 15M2 18L5 22L9 18',
      Help: 'M28 16A12 12 0 1 1 4 16A12 12 0 1 1 28 16M13 12Q13 8 17 9Q22 11 17 15L16 19M16 23V23.5',
    };
    const tool = (parent, name) => {
      const b = u.el('button', 'ys-tool', parent);
      b.type = 'button';
      const s = u.svg(
        'svg',
        {
          width: 32,
          height: 32,
          viewBox: '0 0 32 32',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 1.6,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        },
        b,
      );
      u.svg('path', { d: icons[name] }, s);
      u.el('span', '', b, name);
      if (name === 'Select') b.classList.add('sel');
      if (['Select', 'Line', 'Circle', 'Eraser'].includes(name))
        b.onclick = () => {
          bar.querySelectorAll('.ys-tool').forEach((x) => x.classList.remove('sel'));
          b.classList.add('sel');
        };
      else if (name === 'Reset')
        b.onclick = () => {
          env.widgetDef.clear?.();
        };
      return b;
    };
    const left = u.el('div', 'ys-tools-l', bar);
    for (const n of ['Select', 'Line', 'Circle', 'Eraser']) tool(left, n);
    const right = u.el('div', 'ys-tools-r', bar);
    for (const n of ['Reset', 'Help']) tool(right, n);
    const row = u.el('div', 'ys-row', shell);
    const idx = u.el('aside', 'ys-index', row);
    for (let i = 1; i <= 10; i++) u.el('div' + '', 'ys-idx' + (i === 1 ? ' on' : ''), idx, String(i));
    const col = u.el('div', 'ys-col', row);
    const sheet = u.el('div', 'ys-sheet', col);
    const note = u.el('section', 'task-note', sheet);
    u.el('div', 'instruction', note, ctx.instruction);
    if (ctx.display === 'hidden') note.hidden = true;
    else if (ctx.display === 'toast') {
      note.classList.add('instruction-toast');
      const x = u.el('button', 'note-close', note, '×');
      x.type = 'button';
      x.setAttribute('aria-label', 'Dismiss instruction');
      x.onclick = () => (note.style.visibility = 'hidden');
    } else if (ctx.display === 'panel') {
      note.classList.add('instruction-panel');
      sheet.classList.add('has-note-panel');
    }
    const stage = u.el('main', 'stage', sheet);
    stage.dataset.role = 'stage';
    const footer = u.el('footer', 'footer', col);
    u.el('div', 'footer-copy', footer, 'Click on the canvas to place a point.');
    // Independent streams preserve every pre-existing frame and widget RNG draw.
    const er = ctx.rng.fork('chrome/end'),
      cr = ctx.rng.fork('chrome/collide');
    const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
    const endWords = ctx.content.END_LABELS.map(labelOf);
    const referenceEnd = er.bool(0.5);
    const placement = referenceEnd ? 'footer' : er.pick(['toolbar', 'link']);
    const label = referenceEnd ? 'Submit' : er.pick(endWords.filter((x) => x !== 'Submit'));
    let submit = null;
    if (!ctx.finish) {
      submit = u.el(
        'button',
        'submit' + (placement === 'toolbar' ? ' ys-end-toolbar' : placement === 'link' ? ' ys-end-link' : ''),
        placement === 'toolbar' ? right : footer,
        label,
      );
      submit.type = 'button';
      submit.dataset.role = 'submit';
      submit.title = label;
      submit.setAttribute('aria-label', label);
      submit.onclick = () => ctx.submit();
      if (placement === 'toolbar') right.prepend(submit);
      else if (placement === 'link') footer.prepend(submit);
    }
    if (cr.bool(0.3)) {
      const options = [...new Set(endWords)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
      if (options.length) {
        const text = cr.pick(options),
          decoy = u.el('button', 'ys-xtra', right, text);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', { label: text, collide: true });
        right.prepend(decoy);
      }
    }
    right.querySelectorAll('.ys-tool').forEach((b) => {
      if (b.textContent === 'Help') b.onclick = () => env.log('decoy', { label: 'Help' });
    });
    return { stage, submit };
  }
  env.site({
    name: 'design-click-point-right-angle-04',
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
            if (true) return yosFrame(ctx);
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
