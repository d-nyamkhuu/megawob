// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-point-right-angle-05',
    styles: ['site.css'],
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
            const { C } = S;
            const { ctx } = _c;
            const u = ctx.util,
              body = document.body,
              display = ctx.display === 'panel' && window.innerWidth < 1260 ? 'header' : ctx.display;
            body.className =
              'design ' + C.theme + ' layout-' + C.layout + (display === 'toast' ? ' has-instruction-toast' : '');
            const endRng = ctx.rng.fork('chrome/end'),
              collideRng = ctx.rng.fork('chrome/collide');
            const endLabels = (
              ctx.content && Array.isArray(ctx.content.END_LABELS)
                ? ctx.content.END_LABELS
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
            ).map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)));
            const defaultEnd = endRng.bool(0.5),
              placement = defaultEnd ? 'bottom' : endRng.pick(['top-link', 'progress']);
            const endLabel = defaultEnd
              ? 'Submit'
              : endRng.pick(endLabels.filter((x) => x.trim().toLowerCase() !== 'submit')) || 'Done';
            _c.collide = null;
            if (collideRng.bool(0.3)) {
              const options = [...new Set(endLabels)].filter(
                (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
              );
              if (options.length) _c.collide = collideRng.pick(options);
            }
            Object.assign(_c, { body, collideRng, defaultEnd, display, endLabel, endLabels, endRng, placement, u });
          },
        'frame.2': () => () => {},
        'frame.3': () => () => {},
        'frame.7': (base, S) =>
          function (_c) {
            const { body, ctx, display, endLabel, placement, u } = _c;
            const shell = u.el('div', 'shell', body);
            if (true) {
              const left = u.el('div', 'left', shell);
              u.el('div', 'kicker', left, 'GEOMETRY LAB');
              const note = u.el('section', 'task-note', left),
                ins = u.el('h1', 'instruction', note);
              const txt = String(ctx.instruction || '');
              let cut = txt.indexOf(' at the ');
              if (cut < 0) cut = txt.lastIndexOf(' ', Math.floor(txt.length / 2));
              u.el('span', 'hl', ins, txt.slice(0, cut));
              u.el('span', 'hl-rest', ins, txt.slice(cut).trim());
              if (display === 'hidden') note.hidden = true;
              else if (display === 'toast') {
                note.classList.add('instruction-toast');
                const x = u.el('button', 'note-close', note, '×');
                x.onclick = () => (note.style.visibility = 'hidden');
              }
              const sub = u.el(
                'p',
                'sub',
                left,
                'A segment AB is shown. Click to place point C so that ∠ABC = 90° and C is outside the dotted circle.',
              );
              if (display === 'hidden' || display === 'panel') sub.hidden = true;
              const stage = u.el('main', 'stage', left);
              stage.dataset.role = 'stage';
              const ins2 = u.el('aside', 'insp', shell);
              u.el('h4', '', ins2, 'TASK DETAILS');
              for (const [k, v] of [
                ['Vertex (filled dot)', 'B'],
                ['Given segment', 'AB'],
                ['Required', '∠ABC = 90°'],
                ['Constraint', 'Point C must be outside the dotted circle.'],
              ]) {
                const r = u.el('div', 'row', ins2);
                u.el('span', '', r, k);
                u.el('b', '', r, v);
              }
              if (display === 'panel') {
                note.classList.add('instruction-panel');
                ins2.insertBefore(note, ins2.children[5] || null);
              }
              let submit = null;
              const topSubmit = () => {
                const b = u.el('a', 'end-link', ins2, endLabel + ' ›');
                b.href = '#';
                b.dataset.role = 'submit';
                b.onclick = (e) => {
                  e.preventDefault();
                  ctx.submit();
                };
                return b;
              };
              const progressSubmit = () => {
                const b = u.el('button', 'submit compact-submit', ins2, endLabel);
                b.type = 'button';
                b.dataset.role = 'submit';
                b.onclick = () => ctx.submit();
                return b;
              };
              if (!ctx.finish && placement === 'top-link') submit = topSubmit();
              const t2 = u.el('h4', 't2', ins2, 'TOOLS');
              const tl = u.el('button', 'tool', ins2);
              tl.type = 'button';
              tl.innerHTML =
                '<svg width="42" height="42" viewBox="0 0 42 42"><path d="M12 3V34L19 27L24 38L29 35L24 25H34Z" fill="#0033ff" stroke="#080e29" stroke-width="2.8" stroke-linejoin="round"/></svg><span><strong>Point</strong><small>Click to place a point</small></span>';
              u.el('h4', 't2', ins2, 'PROGRESS');
              const pr = u.el('div', 'prog', ins2);
              u.el('i', '', pr);
              u.el('em', '', pr, 'Point C').style.fontStyle = 'normal';
              u.el('span', '', pr, 'Not placed');
              if (!ctx.finish && placement === 'progress') submit = progressSubmit();
              if (_c.collide) {
                const b = u.el('button', 'end-xtra', ins2, _c.collide);
                b.type = 'button';
                b.dataset.role = 'xtra';
                b.onclick = () => env.log('decoy', { label: _c.collide, collide: true });
              }
              u.el('div', 'spacer', ins2);
              if (!ctx.finish && placement === 'bottom') {
                submit = u.el('button', 'submit', ins2, endLabel);
                submit.type = 'button';
                submit.dataset.role = 'submit';
                submit.onclick = () => ctx.submit();
              }
              const clr = u.el('button', 'clear', ins2, 'Clear');
              clr.type = 'button';
              clr.onclick = () => {
                env.widgetDef.clear?.();
              };
              if (display === 'header') {
                const lines = [...ins.children];
                const factor = Math.min(0.52, ins.clientWidth / Math.max(...lines.map((x) => x.scrollWidth)));
                for (const line of lines) line.style.transform = `scaleX(${factor})`;
              }
              return { stage, submit };
            }
            const head = u.el('header', 'head', shell);
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
      },
    },
  });
})();
