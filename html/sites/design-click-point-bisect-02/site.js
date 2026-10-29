// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  function frameOS2(ctx) {
    const u = ctx.util,
      body = document.body;
    body.className = 'design os2' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
    const rt = document.documentElement;
    for (const [k, v] of Object.entries({
      bg: '#c9c9c9',
      panel: '#d0d0d0',
      fg: '#000',
      muted: '#444',
      line: '#777',
      accent: '#000',
    }))
      rt.style.setProperty('--' + k, v);
    rt.style.setProperty('--font', 'Arial,Helvetica,sans-serif');
    const shell = u.el('div', 'shell', body);
    const tb = u.el('header', 'os2-title', shell);
    const ic = u.el('span', 'os2-sysicon', tb);
    u.el('span', 'os2-titletext', tb, 'OS/2  Geometry Practice');
    ic.innerHTML =
      '<svg viewBox="0 0 32 26"><path fill="#111" d="M4 6H27V21H4Z"/><path stroke="#ddd" fill="none" d="M6 8H24M7 11H16M19 10L24 14L18 18M7 17L13 13L16 17M6 19H25"/><path stroke="#aaa" d="M7 9L9 10M11 8L14 10M20 7L22 9M9 15L12 16M23 17L25 19"/></svg>';
    const wc = u.el('span', 'os2-wc', tb);
    for (const [i, g] of ['_', '▢', '✕'].entries()) {
      const b = u.el('button', 'control-' + i, wc);
      b.type = 'button';
      b.setAttribute('aria-label', g);
      b.onclick = () => env.log('window-control', { label: g });
    }
    const mb = u.el('div', 'os2-menubar', shell);
    const mn = u.el('nav', 'os2-menu', mb);
    for (const t of ['File', 'Edit', 'View', 'Options', 'Help']) u.el('span', '', mn, t);
    const brand = u.el('div', 'os2-brand', mb);
    const lg = u.el('span', 'os2-logo', brand);
    lg.innerHTML =
      '<svg viewBox="0 0 64 64" fill="none" stroke="#111" stroke-width="1.3"><path fill="#111" d="M25 8Q30 0 40 5Q50 3 53 15L54 28Q62 34 57 43L50 49Q51 58 40 59L27 60Q18 56 18 48Q8 47 8 38Q0 33 6 25Q5 18 15 17Q16 9 25 8Z"/><path fill="#ddd" d="M22 10Q23 5 29 9L32 16L40 13L45 18L45 24Q53 23 53 31L49 34Q57 37 52 43L44 45L41 51L34 49L29 40L23 42L20 35Q10 37 9 29L13 25L15 19L23 22L27 17Z"/><path fill="#ddd" d="M30 4L34 8L42 7L46 12L40 10L36 13L30 10ZM23 45L30 47L31 55L26 53ZM42 49L46 48L44 55L37 57L38 53Z"/><path d="M22 10L26 15L22 20M15 19L18 25L13 29L19 32L20 35M23 22L29 24L30 31L24 34L23 42M32 16L36 19L40 18L39 24L45 24M30 31L38 29L43 32L49 34M29 40L34 35L41 38L44 45M41 51L36 46L34 49"/><path stroke="#ddd" d="M29 8L31 10M35 5L39 6M43 10L47 14M48 15L51 21M47 20L49 25M54 33L55 38M48 44L47 46M46 51L44 53M37 51L38 55M27 47L25 51M20 43L24 45M14 38L18 40M20 49L23 53M23 54L28 57"/><path d="M20 13L22 16M17 23L20 26M25 25L27 28M33 20L36 22M38 26L42 27M35 31L38 34M28 34L30 37M37 39L40 42M47 37L50 40M31 42L34 45"/></svg>';
    const bt = u.el('span', 'os2-brandtext', brand);
    u.el('span', '', bt, 'OS/2');
    u.el('span', '', bt, 'Workplace Shell');
    const tabs = u.el('div', 'os2-tabs', shell);
    ['1. Angle Bisector', '2. Triangles', '3. Circles', '4. Practice'].forEach((t, i) => {
      const b = u.el('button', 'os2-tab' + (i === 0 ? ' on' : ''), tabs, t);
      b.type = 'button';
      b.onclick = () => {
        tabs.querySelectorAll('.os2-tab').forEach((x) => x.classList.remove('on'));
        b.classList.add('on');
      };
    });
    const content = u.el('div', 'content', shell),
      note = u.el(
        'section',
        'task-note ' +
          (ctx.display === 'panel'
            ? 'instruction-panel'
            : ctx.display === 'toast'
              ? 'instruction-toast'
              : 'instruction-header'),
        content,
      );
    u.el('div', '', note, '');
    u.el('div', 'instruction', note, ctx.instruction);
    if (ctx.display === 'hidden') note.hidden = true;
    else if (ctx.display === 'toast') {
      note.classList.add('instruction-toast');
      const x = u.el('button', 'note-close', note, '×');
      x.onclick = () => (note.style.visibility = 'hidden');
    } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
    const stage = u.el('main', 'stage', content);
    stage.dataset.role = 'stage';
    const footer = u.el('footer', 'footer', shell);
    const tool = u.el('span', 'os2-tool', footer);
    tool.innerHTML =
      '<svg viewBox="0 0 56 80" fill="none" stroke="#111" stroke-width="2"><path fill="#eee" d="M25 3H30V17H25ZM21 29L7 75L3 77L17 27ZM32 28L48 73L51 77L37 27Z"/><circle cx="28" cy="24" r="10" fill="#aaa" stroke-width="3"/><circle cx="28" cy="24" r="6" fill="#ddd"/><path d="M15 57H42M17 53H40M28 44V62M25 48H31M9 68L17 48M43 63L35 42M5 72L13 50M39 51L46 71"/><path stroke="#777" stroke-width="1" d="M18 35L10 63M35 34L46 67M24 5V13M32 19L34 23M21 22L22 18"/></svg>';
    const copy = u.el('div', 'footer-copy', footer);
    u.el('div', '', copy, 'Use the mouse to click at a point.');
    u.el('div', '', copy, 'Your click must be on the bisector, outside the dotted circle.');
    const btns = u.el('div', 'os2-btns', footer);
    let submit = null;
    const endR = ctx.rng.fork('chrome/end'),
      collideR = ctx.rng.fork('chrome/collide');
    const keepDefault = ctx.finish || endR.bool(0.5),
      endPlacement = ctx.finish ? 'none' : keepDefault ? 'footer' : endR.pick(['toolbar', 'status']);
    const endBank =
      ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
        ? ctx.content.END_LABELS
        : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete'];
    const pickedEnd = keepDefault ? 'Submit' : endR.pick(endBank),
      endLabel =
        typeof pickedEnd === 'string'
          ? pickedEnd
          : String(pickedEnd.label || pickedEnd.text || pickedEnd.name || pickedEnd);
    const addSubmit = (parent, cls, label) => {
      const b = u.el('button', cls, parent, label);
      b.type = 'button';
      b.dataset.role = 'submit';
      b.title = label;
      b.setAttribute('aria-label', label);
      b.onclick = () => ctx.submit();
      return b;
    };
    if (!ctx.finish && endPlacement === 'footer') submit = addSubmit(btns, 'submit', endLabel);
    if (!ctx.finish && endPlacement === 'toolbar') {
      const topEnd = addSubmit(tb, 'os2-end-toolbar', endLabel);
      submit = topEnd;
    }
    const collidePool = endBank
      .map((x) => String((x && (x.label || x.text)) || x))
      .filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
    if (!ctx.finish && collideR.bool(0.3) && collidePool.length) {
      const decoy = u.el('button', 'os2-xtra', btns, collideR.pick(collidePool));
      decoy.type = 'button';
      decoy.dataset.role = 'xtra';
      decoy.onclick = () => env.log('decoy', { label: decoy.textContent, collide: true });
    }
    const clear = u.el('button', 'clear', btns, 'Clear');
    clear.type = 'button';
    clear.onclick = () => {
      env.widgetDef.clear?.();
    };
    const na = u.el('button', 'clear', btns, 'New Angle');
    na.type = 'button';
    // Reuse the reference's etched frame artwork without importing any task geometry.
    const artwork = (node, box) => {
      node.innerHTML =
        '<svg viewBox="' +
        box +
        '" aria-hidden="true"><image href="sites/design-click-point-bisect-02/assets/os2-reference.webp" width="1672" height="941"/></svg>';
    };
    artwork(ic, '7 8 36 35');
    artwork(lg, '1370 65 65 66');
    artwork(tool, '32 774 85 85');
    const st = u.el('div', 'os2-status', shell);
    u.el('span', '', st, 'Ready');
    if (!ctx.finish && endPlacement === 'status') {
      const link = u.el('a', 'os2-end-link', st, endLabel + ' ›');
      link.href = '#';
      link.dataset.role = 'submit';
      link.title = endLabel;
      link.setAttribute('aria-label', endLabel);
      link.onclick = (e) => {
        e.preventDefault();
        ctx.submit();
      };
      submit = link;
    }
    u.el('span', 'os2-date', st, 'Mar 8, 1994    10:24 AM');
    return { stage, submit };
  }
  env.site({
    name: 'design-click-point-bisect-02',
    styles: ['site.css', 'os2.css'],
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
            return frameOS2(ctx);
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
