// Design on templates/site/click-point-bisect-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-reorder-items-grid-07',
    styles: ['site.css', 'os2.css'],
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
            body.className = 'design os2';
            for (const [k, v] of Object.entries({
              bg: '#bdbdbb',
              panel: '#c4c4c2',
              fg: '#111',
              muted: '#555',
              line: '#555',
              accent: '#008d98',
              font: 'Arial, sans-serif',
            }))
              document.documentElement.style.setProperty('--' + k, v);
            const win = u.el('div', 'os2-win', body);
            const tb = u.el('div', 'os2-title', win);
            const sys = u.el('span', 'os2-sysicon', tb);
            const si = u.svg('svg', { viewBox: '0 0 32 32', fill: 'none', stroke: '#222', 'stroke-width': 1.2 }, sys);
            u.svg('path', { d: 'M4 4H28V28H4ZM8 9H24V20H8ZM10 12H22M10 23H21M12 25H19M8 17L12 21H20L24 17' }, si);
            u.el('span', 'os2-ttext', tb, 'Number Sorter - OS/2 Workplace Shell');
            const wc = u.el('div', 'os2-wc', tb);
            for (const l of ['_', '□', '×']) {
              const b = u.el('button', '', wc, l);
              b.type = 'button';
            }
            const mn = u.el('div', 'os2-menu', win);
            for (const m of ['File', 'Edit', 'View', 'Options', 'Help']) u.el('span', '', mn, m);
            const main = u.el('div', 'os2-main', win),
              left = u.el('div', 'os2-left', main),
              right = u.el('div', 'os2-right', main);
            const t1 = u.el('div', 'os2-tabrow', left);
            u.el('span', 'os2-tab', t1, 'Task');
            const note = u.el('section', 'task-note os2-note', left);
            const ic = u.svg(
              'svg',
              {
                width: 40,
                height: 48,
                viewBox: '0 0 40 48',
                fill: '#ddd',
                stroke: '#111',
                'stroke-width': 1.5,
                class: 'os2-ic',
              },
              note,
            );
            u.svg('path', { d: 'M8 4H32L38 10V47H8ZM4 1H29L35 7V44H4ZM29 1V7H35' }, ic);
            for (let i = 0; i < 6; i++) {
              u.svg('rect', { x: 8, y: 7 + i * 6, width: 3, height: 3, fill: '#aaa' }, ic);
              u.svg('path', { d: 'M15 ' + (9 + i * 6) + 'H29', stroke: '#666' }, ic);
            }
            if (ctx.display === 'hidden') {
              note.hidden = true;
              t1.hidden = true;
            } else if (ctx.display === 'toast') {
              note.classList.add('instruction-toast');
              const x = u.el('button', 'note-close', note, '×');
              x.type = 'button';
              x.onclick = () => (note.style.visibility = 'hidden');
            } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
            u.el('div', 'instruction', note, ctx.instruction);
            const t2 = u.el('div', 'os2-tabrow os2-tabs2', left);
            u.el('span', 'os2-tab on', t2, 'Tiles');
            for (const label of ['Your Order', 'Notes'])
              u.el('span', 'os2-tab-label', u.el('span', 'os2-tab', t2), label);
            const sp = u.el('div', 'os2-stagepanel', left);
            const stage = u.el('main', 'stage', sp);
            stage.dataset.role = 'stage';
            const t3 = u.el('div', 'os2-tabrow', right);
            u.el('span', 'os2-tab', t3, 'Progress');
            const pp = u.el('aside', 'os2-prog', right);
            if (ctx.display === 'panel') {
              t1.hidden = true;
              pp.classList.add('os2-with-note');
              pp.prepend(note);
              u.el('div', 'os2-note-heading', note, 'Task');
            }
            const n = (ctx.spec && ctx.spec.items && ctx.spec.items.length) || 10;
            u.el('div', 'os2-lbl', pp, 'Tiles placed:');
            u.el('div', 'os2-lbl2', pp, '0 of ' + n);
            u.el('div', 'os2-bar', pp);
            u.el('hr', '', pp);
            u.el('div', 'os2-lbl', pp, 'Current order (reading order):');
            const sl = u.el('div', 'os2-slots', pp);
            for (let i = 0; i < n; i++) u.el('i', '', sl);
            u.el('hr', '', pp);
            u.el('div', 'os2-sp', pp);
            const er = ctx.rng.fork('chrome/end');
            const labelOf = (x) => (typeof x === 'string' ? x : String(x.label || x.text || x.name));
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const referenceEnd = er.bool(0.5);
            const placement = referenceEnd ? 'progress' : er.pick(['toolbar', 'status']);
            const endLabel = referenceEnd ? 'Submit' : er.pick(endLabels);
            const endBtn = (parent, cls) => {
              const b = u.el('button', cls, parent);
              u.el('span', 'submit-label', b, endLabel);
              b.type = 'button';
              b.dataset.role = 'submit';
              b.title = endLabel;
              b.setAttribute('aria-label', endLabel);
              b.onclick = () => ctx.submit();
              return b;
            };
            let submit = null;
            if (!ctx.finish && placement === 'progress') submit = endBtn(pp, 'submit');
            const tools = u.el('div', 'os2-menu-tools', mn);
            if (!ctx.finish && placement === 'toolbar') submit = endBtn(tools, 'submit os2-end-toolbar');
            const cr = ctx.rng.fork('chrome/collide');
            if (cr.bool(0.3)) {
              const options = [...new Set(endLabels)].filter(
                (l) => l.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
              );
              if (options.length) {
                const label = cr.pick(options),
                  b = u.el('button', 'os2-xtra', tools, label);
                b.type = 'button';
                b.dataset.role = 'xtra';
                b.onclick = () => env.log('decoy', { label, collide: true });
              }
            }
            const br = u.el('div', 'os2-btns', pp);
            for (const l of ['Clear All', 'Reset']) {
              const b = u.el('button', 'os2-btn', br, l);
              b.type = 'button';
              b.onclick = () => env.widgetDef.clear?.();
            }
            const sb = u.el('div', 'os2-status', win);
            const a = u.el('span', 'os2-s1', sb);
            const logo = u.el('b', '', a);
            const li = u.svg('svg', { viewBox: '0 0 32 32', fill: 'none' }, logo);
            u.svg(
              'path',
              { d: 'M4 8L13 4L19 11L27 9L24 20L17 28L11 20L5 22Z', stroke: '#efd126', 'stroke-width': 1.2 },
              li,
            );
            u.svg('text', { x: 3, y: 17, fill: '#eee', 'font-size': 11, 'font-family': 'Arial' }, li).textContent =
              'OS';
            u.svg('text', { x: 17, y: 24, fill: '#efd126', 'font-size': 13, 'font-family': 'Arial' }, li).textContent =
              '2';
            a.append('OS/2');
            u.el('span', 'os2-s2', sb, 'Number Sorter');
            u.el('span', 'os2-s3', sb, '10:24 AM');
            if (!ctx.finish && placement === 'status') {
              submit = endBtn(sb, 'submit os2-end-status');
              sb.insertBefore(submit, sb.querySelector('.os2-s3'));
            }
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
