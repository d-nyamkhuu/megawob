// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-point-center-02',
    styles: ['site.css', 'swiss.css'],
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
            {
              const u = ctx.util,
                body = document.body,
                rng = ctx.rng,
                endRng = rng.fork('chrome/end'),
                collideRng = rng.fork('chrome/collide');
              body.className = 'design swiss';
              const shell = u.el('div', 'sw-shell', body),
                lcol = u.el('section', 'sw-left', shell);
              u.el('div', 'sw-num', lcol, '01');
              u.el('div', 'sw-rule', lcol);
              const display = ctx.display || 'header',
                note = u.el('div', 'sw-instruction', lcol, ctx.instruction);
              note.dataset.display = String(display);
              if (display === 'hidden') note.hidden = true;
              else if (display === 'panel') note.classList.add('sw-note-panel');
              else if (display === 'toast') {
                note.classList.add('sw-note-toast');
                const close = u.el('button', 'sw-note-close', note, '×');
                close.type = 'button';
                close.title = 'Dismiss instruction';
                close.setAttribute('aria-label', 'Dismiss instruction');
                close.onclick = () => (note.style.visibility = 'hidden');
              }
              const labels =
                  ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                    ? ctx.content.END_LABELS
                    : [
                        'Submit',
                        'Done',
                        'Finish',
                        'Continue',
                        'Save',
                        'OK',
                        'Confirm',
                        'Apply',
                        'Complete',
                        "I'm done",
                      ],
                labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              const label = labelOf(
                endRng.bool(0.5) ? labels.find((x) => labelOf(x) === 'Submit') || 'Submit' : endRng.pick(labels),
              );
              const placements = ['left-footer', 'left-footer', 'left-footer', 'left-link', 'tool-footer'];
              const placement = ctx.finish ? null : endRng.pick(placements);
              shell.dataset.endPlacement = placement || 'finish';
              const mkEnd = (parent, cls, text, isDecoy) => {
                const b = u.el('button', cls, parent, text);
                b.type = 'button';
                if (!isDecoy) {
                  b.dataset.role = 'submit';
                  b.setAttribute('aria-label', text);
                  b.onclick = () => ctx.submit();
                } else b.onclick = () => env.log('decoy', { label: text, collide: true });
                return b;
              };
              const decoyPool = labels
                  .map(labelOf)
                  .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()),
                collide = collideRng.bool(0.3) && decoyPool.length ? collideRng.pick(decoyPool) : null;
              let submit = null;
              if (!ctx.finish) {
                if (placement === 'tool-footer') submit = mkEnd(lcol, 'sw-tool-submit', label, false);
                else if (placement === 'left-link') {
                  u.el('div', 'sw-rule sw-rule2', lcol);
                  submit = mkEnd(lcol, 'sw-submit sw-submit-link submit', label, false);
                } else {
                  u.el('div', 'sw-rule sw-rule2', lcol);
                  submit = mkEnd(lcol, 'sw-submit submit', label, false);
                }
              }
              if (!ctx.finish && placement === 'tool-footer') u.el('div', 'sw-rule sw-rule2', lcol);
              const stage = u.el('main', 'sw-stage stage', shell);
              stage.dataset.role = 'stage';
              const strip = u.el('aside', 'sw-tools', shell);
              const P = {
                'Select': 'M6 3L6 22L11 17L15 26L18 25L14 16L21 16Z',
                'Zoom in': 'M3 10A7 7 0 1 1 17 10A7 7 0 1 1 3 10M15 15L23 23M6.5 10H13.5M10 6.5V13.5',
                'Zoom out': 'M3 10A7 7 0 1 1 17 10A7 7 0 1 1 3 10M15 15L23 23M6.5 10H13.5',
                'Reset': 'M5 12A7 7 0 1 0 8 6.5M5 3V8H10',
              };
              let first = true;
              for (const [n, d] of Object.entries(P)) {
                const b = u.el('button', 'sw-tool' + (first ? ' on' : '') + (n === 'Reset' ? ' gap' : ''), strip);
                b.type = 'button';
                b.title = n;
                const s = u.svg(
                  'svg',
                  {
                    width: 26,
                    height: 26,
                    viewBox: '0 0 26 26',
                    fill: n === 'Select' ? 'currentColor' : 'none',
                    stroke: 'currentColor',
                    'stroke-width': n === 'Select' ? 0 : 1.15,
                  },
                  b,
                );
                u.svg('path', { d }, s);
                b.onclick = () => {
                  strip.querySelectorAll('.sw-tool').forEach((x) => x.classList.remove('on'));
                  b.classList.add('on');
                  if (n === 'Reset') env.widgetDef.clear?.();
                };
                first = false;
              }
              if (placement === 'tool-footer') strip.appendChild(submit);
              if (collide) {
                const decoy = mkEnd(lcol, 'sw-xtra-end', collide, true);
                decoy.title = collide;
              }
              return { stage, submit };
            }
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
