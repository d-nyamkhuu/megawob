// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-point-path-mid-01',
    styles: ['site.css', 'trail.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'trails',
        'theme': 'trails',
        'title': 'Riverside Trails',
        'ribbon': false,
        'foot': '',
        'accent': '#c83228',
        'bg': '#f4f1e9',
        'surface': '#fbf9f3',
        'font': "Georgia, 'Times New Roman', serif",
      },
      parts: {
        'frame.3': () => () => {},
        'frame.5': (base, S) =>
          function (_c) {
            const { C } = S;
            const { root } = _c;
            for (const [k, v] of Object.entries({
              bg: C.bg,
              panel: C.surface,
              fg: C.theme === 'developer' ? '#eff4ff' : '#171512',
              muted: '#766f64',
              line: '#b9b1a4',
              accent: C.accent,
            }))
              root.style.setProperty('--' + k, v);
          },
        'frame.7': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx, u } = _c;
            if (C.theme === 'trails') {
              const u = ctx.util,
                body = document.body;
              body.className = 'design trails display-' + ctx.display;
              const shell = u.el('div', 'trail-shell', body),
                head = u.el('header', 'trail-head', shell);
              u.el('div', 'tree-mark', head, '♣');
              u.el('div', 'trail-brand', head, C.title);
              const nav = u.el('nav', 'trail-nav', head);
              for (const [i, t] of ['PARKS', 'TRAILS', 'PLACES', 'COMMUNITY'].entries()) {
                if (i) u.el('i', 'nav-sep', nav, '|');
                u.el('span', '', nav, t);
              }
              const note = u.el('div', 'trail-task-note', head);
              const instruction = u.el('div', 'instruction', note, ctx.instruction);
              if (ctx.display === 'hidden') note.hidden = true;
              else if (ctx.display === 'toast') note.classList.add('instruction-toast');
              else if (ctx.display === 'panel') note.classList.add('instruction-panel');
              const index = u.el('section', 'trail-index', shell);
              const indexHead = u.el('div', 'trail-index-head', index);
              u.el('h2', '', indexHead, 'Trails');
              u.el('span', 'trail-count', indexHead, '7 trails');
              const arrows = u.el('div', 'trail-arrows', indexHead);
              for (const x of ['‹', '›']) u.el('button', '', arrows, x);
              const rows = u.el('div', 'trail-rows', index);
              for (const [i, n] of [
                'Lakeside Path',
                'Maple Loop',
                'Pine Ridge',
                'Cedar Run',
                'Willow Creek',
                'Fern Trail',
                'Oak Valley',
              ].entries()) {
                const row = u.el('div', 'trail-row' + (i === 0 ? ' selected' : ''), rows);
                u.el('span', 'trail-thumb thumb-' + i, row);
                const words = u.el('span', 'trail-words', row);
                u.el('b', '', words, n);
                u.el('small', '', words, ['2.8', '3.1', '4.6', '2.9', '5.4', '3.7', '4.1'][i] + ' miles');
              }
              const stage = u.el('main', 'stage trail-stage', shell);
              stage.dataset.role = 'stage';
              const fake = u.el('div', 'trail-window-title', stage);
              u.el('h1', '', fake, 'Lakeside Path');
              u.el('div', 'lake-photo', fake);
              const footer = u.el('footer', 'trail-dock', shell);
              for (const [i, v] of ['Home', 'Trails', 'Map', 'Photos', 'Guide', 'Community'].entries()) {
                const item = u.el('div', 'dock-item' + (i === 1 ? ' active' : ''), footer);
                u.el('span', 'dock-icon', item, ['◆', '◆', '◫', '▣', '▤', '♟'][i]);
                u.el('span', '', item, v);
              }
              let submit = null;
              const endR = ctx.rng.fork('chrome/end'),
                finishMode = !!ctx.finish,
                endMode = finishMode ? 'none' : endR.bool(0.5) ? 'toolbar' : endR.pick(['footer', 'link']);
              const endBank =
                ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                  ? ctx.content.END_LABELS
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete'];
              const asLabel = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              const endLabel = endMode === 'toolbar' ? 'Continue' : asLabel(endR.pick(endBank));
              if (!finishMode) {
                const parent = endMode === 'toolbar' ? head : footer,
                  tag = endMode === 'link' ? 'a' : 'button';
                submit = u.el(
                  tag,
                  'trail-continue ' + (endMode === 'link' ? 'as-link' : ''),
                  parent,
                  endMode === 'link' ? endLabel + ' ›' : endLabel,
                );
                if (tag === 'button') submit.type = 'button';
                else submit.href = '#';
                submit.dataset.role = 'submit';
                submit.title = endLabel;
                submit.setAttribute('aria-label', endLabel);
                submit.onclick = (e) => {
                  e.preventDefault();
                  ctx.submit();
                };
              }
              const collideR = ctx.rng.fork('chrome/collide');
              if (!finishMode && collideR.bool(0.3)) {
                const pool = [
                  ...new Set(endBank.map(asLabel).filter((x) => x.toLowerCase() !== endLabel.toLowerCase())),
                ];
                if (pool.length) {
                  const target = endMode === 'toolbar' ? head : footer,
                    decoy = u.el('button', 'trail-xtra', target, collideR.pick(pool));
                  decoy.type = 'button';
                  decoy.dataset.role = 'xtra';
                  decoy.onclick = () => env.log('decoy', { label: decoy.textContent, collide: true });
                }
              }
              return { stage, submit };
            }
            const shell = u.el('div', 'shell', body),
              head = u.el('header', 'head', shell);
            Object.assign(_c, { head, shell });
          },
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
        'frame.27': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, head, u } = _c;
            const endR = ctx.rng.fork('chrome/end');
            const finishMode = !!ctx.finish;
            const endMode = finishMode ? 'none' : endR.bool(0.5) ? 'footer' : endR.pick(['toolbar', 'link']);
            const endBank =
              ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                ? ctx.content.END_LABELS
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
            const asLabel = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
            const endLabel = endMode === 'footer' ? 'Submit' : asLabel(endR.pick(endBank));
            const submitInto = (parent, tag, cls, text) => {
              const b = u.el(tag, cls, parent, text);
              if (tag === 'button') b.type = 'button';
              else b.href = '#';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', endLabel);
              b.title = endLabel;
              b.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
              return b;
            };
            const toolbarHead = head;
            if (endMode === 'footer') {
              _c.submit = submitInto(footer, 'button', 'submit', 'Submit');
            } else if (endMode === 'link') {
              _c.submit = submitInto(footer, 'a', 'end-link', endLabel + ' ›');
              _c.submit.style.cssText =
                'margin-left:auto;color:#111;text-decoration:underline;font:20px Georgia,serif;padding:10px 14px;white-space:nowrap';
            } else if (endMode === 'toolbar') {
              _c.submit = submitInto(toolbarHead, 'button', 'toolbar-end', endLabel);
              _c.submit.style.cssText =
                'position:absolute;left:210px;top:5px;height:34px;min-width:104px;padding:3px 12px;border:1px solid #555;background:#eee;color:#111;font:18px Georgia,serif';
            }
            const collideR = ctx.rng.fork('chrome/collide');
            if (collideR.bool(0.3)) {
              const collidePool = [
                ...new Set(
                  endBank.map(asLabel).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()),
                ),
              ];
              if (collidePool.length) {
                const decoy = u.el('button', 'chrome-xtra', footer, collideR.pick(collidePool));
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.style.cssText =
                  'height:42px;padding:5px 10px;border:1px dashed #555;background:#f2f1ed;color:#111;font:16px Georgia,serif';
                decoy.onclick = () => env.log('decoy', { label: decoy.textContent, collide: true });
              }
            }
            if (C.theme === 'eink') {
              const points = u.el('span', 'points', footer, 'Points: 0/1');
              footer.insertBefore(points, _c.submit && _c.submit.parentNode === footer ? _c.submit : null);
              const clear = u.el('button', 'clear', footer, 'Clear');
              clear.onclick = () => {
                env.widgetDef.clear?.();
              };
            }
            Object.assign(_c, {
              asLabel,
              collideR,
              endBank,
              endLabel,
              endMode,
              endR,
              finishMode,
              submitInto,
              toolbarHead,
            });
          },
        'frame.28': () => () => {},
      },
    },
  });
})();
