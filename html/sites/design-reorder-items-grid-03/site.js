// Design on templates/site/click-point-bisect-03.js: only what this site changed.
(function () {
  'use strict';
  const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
  env.site({
    name: 'design-reorder-items-grid-03',
    styles: ['site.css', 'mac.css'],
    scripts: [],
    template: 'site/click-point-bisect-03',
    design: {
      C: {
        'layout': 'stack',
        'theme': 'collage',
        'title': '',
        'foot': 'Reorder all tiles. The list will be read left to right, top to bottom.',
        'accent': '#ff7921',
        'bg': '#f6f4ef',
        'surface': '#fcfcfc',
        'font': 'Arial, sans-serif',
      },
      parts: {
        frame: (base, S) =>
          function (ctx) {
            const u = ctx.util,
              body = document.body;
            body.className = 'mac-os9';
            const er = ctx.rng.fork('chrome/end');
            const labels = (ctx.content && ctx.content.END_LABELS) || [
              'Submit',
              'Done',
              'Finish',
              'Continue',
              'Save',
              'OK',
              'Confirm',
              'Apply',
              'Complete',
            ];
            const alternatives = labels.filter((x) => labelText(x).trim().toLowerCase() !== 'submit');
            const label = er.bool(0.5) ? 'Submit' : labelText(er.pick(alternatives.length ? alternatives : labels));
            const placement = ctx.finish ? null : er.pick(['footer', 'footer', 'footer', 'header', 'header', 'link']);
            const cr = ctx.rng.fork('chrome/collide');
            let collide = null;
            if (cr.bool(0.3)) {
              const pool = [
                ...new Set(labels.map(labelText).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
              ];
              if (pool.length) collide = cr.pick(pool);
            }
            const bar = u.el('div', 'mb', body);
            const ap = u.svg('svg', { width: 28, height: 32, viewBox: '0 0 28 32', class: 'apple' }, bar);
            u.svg(
              'path',
              { d: 'M15 8C14 4 17 2 20 1C21 5 18 7 15 8Z', fill: '#567caf', stroke: '#151b35', 'stroke-width': 1.5 },
              ap,
            );
            u.svg(
              'path',
              {
                d: 'M14 10C10 7 4 9 3 15C2 21 6 29 10 29C13 27 14 27 17 29C20 30 24 25 25 21C20 19 19 14 24 12C21 8 17 8 14 10Z',
                fill: '#5789e3',
                stroke: '#18213a',
                'stroke-width': 1.7,
              },
              ap,
            );
            u.svg('path', { d: 'M6 14Q7 10 12 11', fill: 'none', stroke: '#c9e7ff', 'stroke-width': 1.5 }, ap);
            for (const m of ['File', 'Edit', 'View', 'Special', 'Help']) {
              const menu = u.el(m === 'Edit' ? 'button' : 'span', 'mi', bar, m);
              if (m === 'Edit') {
                menu.type = 'button';
                menu.title = 'Reset';
                menu.onclick = () => env.widgetDef.clear?.();
              }
            }
            u.el('span', 'sp', bar);
            u.el('span', 'clock', bar, 'Mon 10:24 AM');
            const sound = u.svg(
              'svg',
              {
                class: 'spk',
                viewBox: '0 0 32 32',
                width: 32,
                height: 32,
                fill: 'none',
                stroke: '#202330',
                'stroke-width': 1.8,
              },
              bar,
            );
            u.svg('path', { d: 'M4 12H9L16 6V26L9 20H4ZM20 10Q27 16 20 22M24 6Q35 16 24 26' }, sound);
            const appIcon = (parent, cls) => {
              const s = u.svg('svg', { class: cls, viewBox: '0 0 32 36', width: 28, height: 32 }, parent);
              u.svg('path', { d: 'M3 2H23L29 8V33H3Z', fill: '#e1e2e7', stroke: '#252937', 'stroke-width': 2 }, s);
              u.svg('path', { d: 'M23 2V8H29M6 5H19V29H6Z', fill: '#91accc', stroke: '#353f58' }, s);
              u.svg(
                'path',
                {
                  d: 'M8 8L11 22L14 12L18 25L21 9M8 28L21 13M7 14L23 20',
                  fill: 'none',
                  stroke: '#f0f4fa',
                  'stroke-width': 1.2,
                },
                s,
              );
              u.svg('path', { d: 'M15 18H24L29 23V34H15Z', fill: '#729cd5', stroke: '#29384f' }, s);
              u.svg('path', { d: 'M18 21L25 29M24 22L19 30', stroke: '#e8f0ff', 'stroke-width': 1.5 }, s);
              return s;
            };
            appIcon(bar, 'appic');
            const desk = u.el('div', 'desk', body),
              win = u.el('div', 'win', desk),
              tb = u.el('div', 'tbar', win);
            const bs = u.el('div', 'tbtn', tb);
            for (let i = 0; i < 3; i++) u.el('i', '', bs);
            u.el('div', 'ttl', tb, 'Tile Sort');
            u.el('div', 'zoom', tb);
            const endButton = (parent, cls, text) => {
              const b = u.el('button', cls, parent, text);
              b.type = 'button';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', label);
              b.title = label;
              b.onclick = () => ctx.submit();
              return b;
            };
            if (placement === 'header') endButton(tb, 'mac-end mac-end-header', label);
            const doc = u.el('div', 'doc', win),
              note = u.el('section', 'task-note', doc);
            const instruction = u.el('div', 'instruction', note, ctx.instruction);
            if (ctx.display === 'hidden' || ctx.display === 'panel') note.hidden = true;
            else if (ctx.display === 'toast') {
              note.classList.add('instruction-toast');
              const x = u.el('button', 'note-close', note, '×');
              x.onclick = () => (note.style.visibility = 'hidden');
            }
            u.el('hr', 'rule', doc);
            const stage = u.el('main', 'stage', doc);
            stage.dataset.role = 'stage';
            const footer = u.el('footer', 'footer', doc);
            let submit = null;
            if (placement === 'footer') submit = endButton(footer, 'submit', label);
            const mg = u.el('aside', 'margin', desk);
            const marginInstruction = u.el('div', 'margin-instruction', mg);
            u.el('h3', '', marginInstruction, 'Instructions');
            u.el('p', '', marginInstruction, ctx.instruction);
            if (ctx.display !== 'panel') marginInstruction.hidden = true;
            u.el('h3', '', mg, 'Notes');
            const ul = u.el('ul', '', mg);
            for (const t of [
              'Each tile shows a unique item.',
              'Arrange all tiles in the correct order.',
              'Reading order is left to right,',
            ]) {
              const li = u.el('li', '', ul, t);
              if (t.startsWith('Reading')) u.el('div', '', li, 'then top to bottom.');
            }
            u.el('h3', 'fin', mg, 'When you are finished');
            const u2 = u.el('ul', '', mg);
            u.el('li', '', u2, ctx.finish ? 'Finish when the arrangement is complete.' : `Click the ${label} button.`);
            if (placement === 'link') {
              submit = u.el('button', 'mac-endlink', mg, `${label} ›`);
              submit.type = 'button';
              submit.dataset.role = 'submit';
              submit.setAttribute('aria-label', label);
              submit.title = label;
              submit.onclick = () => ctx.submit();
            }
            if (collide) {
              const d = u.el('button', 'mac-xtra', placement === 'link' ? mg : tb, collide);
              d.type = 'button';
              d.dataset.role = 'xtra';
              d.onclick = () => env.log('decoy', { label: collide, collide: true });
            }
            if (placement === 'header') submit = tb.querySelector('[data-role="submit"]');
            const sb = u.el('div', 'sbar', body);
            appIcon(sb, 'sic');
            u.el('span', '', sb, 'Tile Sort');
            return { stage, submit };
          },
        'frameOld.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.ribbon) {
              const rib = u.el('div', 'ribbon', head);
              const tool = (parent, name, path) => {
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
                            : t === 'Instructions' || t === 'Help'
                              ? 'M29 16A13 13 0 1 1 3 16A13 13 0 1 1 29 16M12 10Q12 5 17 6Q23 8 17 14L16 19M16 23V25'
                              : 'M5 5H27V27H5ZM10 16L14 20L23 10',
                    );
                }
                u.el('small', '', gr, name);
              }
            }
          },
        'frameOld.25': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, u } = _c;
            if (!ctx.finish) {
              const parent = C.layout === 'three' && _c.aside ? _c.aside : footer;
              _c.submit = u.el('button', 'submit', parent);
              u.el('span', 'submit-label', _c.submit, 'Submit');
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.onclick = () => ctx.submit();
            }
          },
      },
    },
  });
})();
