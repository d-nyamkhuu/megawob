// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-point-midpoint-03',
    styles: ['site.css', 'atari.css'],
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
                body = document.body;
              body.className = 'design atari' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
              const mb = u.el('div', 'ag-menubar', body);
              for (const t of ['Desk', 'File', 'Edit', 'View', 'Options']) u.el('span', '', mb, t);
              const ck = u.el('div', 'ag-clock', mb);
              u.el('span', '', ck, 'Mon 27 Jan 1986');
              u.el('span', '', ck, '10:24');
              u.el('i', '', ck);
              const ic = u.el('div', 'ag-icons', body);
              const mk = (label, svg) => {
                const d = u.el('div', '', ic);
                d.innerHTML = svg;
                u.el('span', '', d, label);
              };
              mk(
                'A:\\\nDISK',
                '<svg width="60" height="56" viewBox="0 0 60 56" fill="#ececec" stroke="#000" stroke-width="3"><path d="M4 2H50L56 8V54H4Z"/><path d="M14 2H44V23H14Z" fill="#000"/><path d="M17 3V20H23V3" fill="#fff"/><path d="M10 54V31Q10 27 14 27H46Q50 27 50 31V54Z" fill="#fff"/></svg>',
              );
              mk(
                'B:\\\nDISK',
                '<svg width="76" height="44" viewBox="0 0 76 44" fill="#ececec" stroke="#000" stroke-width="3"><rect x="2" y="3" width="72" height="38"/><path d="M4 25H72"/><rect x="9" y="29" width="57" height="9" fill="#000"/><path d="M10 9V13H14M65 9V13H61M15 31V36M60 31V36" stroke-width="3"/></svg>',
              );
              mk(
                'TRASH',
                '<svg width="44" height="58" viewBox="0 0 44 58" fill="#ececec" stroke="#000" stroke-width="3"><rect x="14" y="3" width="16" height="6"/><rect x="3" y="9" width="38" height="6"/><path d="M7 15H37L34 55H10Z"/><path d="M16 22V48M22 22V48M28 22V48" stroke-width="2"/></svg>',
              );
              const win = u.el('div', 'ag-window', body),
                tb = u.el('div', 'ag-title', win);
              u.el('button', 'ag-gadget', tb);
              u.el('div', 'ag-stripes', tb);
              u.el('span', 'ag-ttext', tb, 'Geometry Trainer');
              u.el('div', 'ag-stripes', tb);
              u.el('button', 'ag-gadget', tb);
              let note = null;
              if (ctx.display === 'header') {
                note = u.el('section', 'ag-note task-note', win);
                u.el('div', 'instruction', note, ctx.instruction);
              } else if (ctx.display === 'toast') {
                note = u.el('section', 'ag-note task-note instruction-toast', win);
                u.el('div', 'instruction', note, ctx.instruction);
                const x = u.el('button', 'note-close', note, '×');
                x.type = 'button';
                x.setAttribute('aria-label', 'Close');
                x.onclick = () => (note.style.visibility = 'hidden');
              }
              const row = u.el('div', 'ag-row', win),
                stage = u.el('main', 'ag-stage', row);
              stage.dataset.role = 'stage';
              const side = u.el('aside', 'ag-side', row),
                help = u.el('div', 'ag-box help', side);
              const helpCopy = u.el(
                'div',
                'ag-help-copy' + (ctx.display === 'panel' ? ' ag-panel-instruction' : ''),
                help,
                ctx.display === 'panel'
                  ? ctx.instruction
                  : ctx.display === 'hidden'
                    ? 'Geometry Trainer\n\nPointer tool active.'
                    : 'Click on the point\nthat is exactly\nhalfway between\nA and B.',
              );
              const tl = u.el('div', 'ag-box tools', side);
              u.el('div', '', tl, 'Tools');
              const tt = u.el('div', 'ag-tool', tl);
              const sp = u.el('span', '', tt);
              sp.innerHTML =
                '<svg width="28" height="38" viewBox="0 0 28 38" fill="#fff" stroke="#000" stroke-width="2"><path d="M3 2V28L10 22L15 34L19 32L14 21H23Z"/></svg>';
              u.el('div', '', tt, 'Pointer');
              let submit = null;
              if (!ctx.finish) {
                const er = ctx.rng.fork('chrome/end'),
                  labels = (ctx.content && ctx.content.END_LABELS) || [
                    'Submit',
                    'Done',
                    'Finish',
                    'Continue',
                    'Save',
                    'OK',
                    'Confirm',
                    'Apply',
                  ];
                const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
                let label = 'Submit';
                if (er.bool(0.5)) {
                  const pool = labels.map(labelOf).filter((x) => x.toLowerCase() !== 'submit');
                  if (pool.length) label = er.pick(pool);
                }
                const variedPlacement = er.pick(['help', 'tools', 'title', 'tools', 'title']);
                const placement = label === 'Submit' ? 'help' : variedPlacement;
                const putSubmit = (parent, cls) => {
                  submit = u.el('button', cls, parent, label);
                  submit.type = 'button';
                  submit.dataset.role = 'submit';
                  submit.setAttribute('aria-label', label);
                  submit.title = label;
                  submit.onclick = () => ctx.submit();
                };
                if (placement === 'help') putSubmit(help, 'ag-submit');
                else if (placement === 'tools') {
                  tl.classList.add('ag-tools-end');
                  putSubmit(tl, 'ag-submit ag-submit-tools');
                } else putSubmit(tb, 'ag-submit ag-submit-title');
                const cr = ctx.rng.fork('chrome/collide');
                if (cr.bool(0.3)) {
                  const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
                  if (pool.length) {
                    const decoyLabel = cr.pick(pool),
                      where = cr.pick(['help', 'tools', 'title']);
                    void where;
                    const b = u.el('button', 'ag-xtra', tb, decoyLabel);
                    b.type = 'button';
                    b.dataset.role = 'xtra';
                    b.onclick = () => env.log('decoy', { label: decoyLabel, collide: true });
                  }
                }
              }
              const ov = u.el('div', 'ag-overview', body),
                ot = u.el('div', 'ag-title', ov);
              u.el('button', 'ag-gadget', ot);
              u.el('span', 'ag-ttext', ot, 'Overview');
              u.el('div', 'ag-stripes', ot);
              u.el('button', 'ag-gadget', ot);
              u.el('div', 'ag-ov-body', ov).dataset.role = 'ov';
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
