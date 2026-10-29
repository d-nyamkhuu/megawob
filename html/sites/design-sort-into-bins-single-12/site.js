// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-single-12',
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'promo' },
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'offset',
        'theme': 'amiga',
        'title': 'Shape Trainer',
        'subtitle': '',
        'foot': '',
        'accent': '#ff7900',
        'bg': '#bfc0c2',
        'surface': '#bfc0c2',
        'font': 'monospace',
        'tabs': ['Select', 'Marquee', 'Rectangle'],
      },
      parts: {
        'frame.3': (base, S) =>
          function (_c) {
            const { ctx } = _c;
            const er = ctx.rng.fork('chrome/end'),
              cr = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endWords = ctx.content.END_LABELS.map(labelOf);
            const referenceEnd = er.bool(0.5),
              placement = referenceEnd ? 'footer' : er.pick(['toolbar', 'icon']);
            const endLabel = referenceEnd ? 'Submit' : er.pick(endWords);
            const otherEnd = endWords.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
            const collide = cr.bool(0.3) && otherEnd.length ? cr.pick(otherEnd) : null;
            Object.assign(_c, { collide, cr, endLabel, endWords, er, labelOf, otherEnd, placement, referenceEnd });
          },
        'frame.5': (base, S) =>
          function (_c) {
            const { C } = S;
            const { root } = _c;
            for (const [k, v] of Object.entries({
              bg: C.bg,
              panel: C.surface,
              fg: C.theme === 'developer' ? '#eff4ff' : '#111820',
              muted: C.theme === 'developer' ? '#8b9aaf' : '#657080',
              line: C.theme === 'developer' ? '#283544' : '#77797b',
              accent: C.accent,
            }))
              root.style.setProperty('--' + k, v);
          },
        'frame.7': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, u } = _c;
            if (C.theme === 'amiga') {
              const wb = u.el('div', 'workbench-bar', body);
              u.el('strong', '', wb, 'Amiga Workbench');
              u.el('span', '', wb, '1,948,848 graphics mem');
              u.el('span', '', wb, '7,864,320 other mem');
              u.el('b', 'wb-gadget', wb, '▣');
            }
            const shell = u.el('div', 'shell', body),
              head = u.el('header', 'head', shell);
            Object.assign(_c, { head, shell });
          },
        'frame.17': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, note, u } = _c;
            if (C.theme === 'minimal') {
              const shape =
                (ctx.plainInstruction || ctx.instruction)
                  .match(/\b(circle|square|triangle|diamond|hexagon|star)\b/i)?.[0]
                  .toLowerCase() || 'shape';
              const color = (ctx.plainInstruction || ctx.instruction)
                .match(/\b(blue|red|green|yellow|orange|purple|pink|cyan|teal|brown|gray)\b/i)?.[0]
                .toLowerCase();
              const target = color ? color + ' ' + shape : shape;
              const steps = u.el('ol', 'steps', note);
              for (const text of [
                'Drag the ' + target + ' from its current position.',
                'Drop it inside the rectangular box.',
                'The ' + shape + ' must fit fully inside the box.',
              ])
                u.el('li', '', steps, text);
              u.el('h3', '', note, 'Notes');
              const nl = u.el('ul', 'notes-list', note);
              for (const text of [
                'Use your mouse or trackpad (pointer) to move the ' + shape + '.',
                'Do not resize the shape.',
                'The ' + shape + ' must be completely inside the box, not touching or outside the borders.',
              ])
                u.el('li', '', nl, text);
            }
            if (C.theme === 'amiga') {
              const shape =
                (ctx.plainInstruction || ctx.instruction)
                  .match(/\b(circle|square|triangle|diamond|hexagon|star)\b/i)?.[0]
                  .toLowerCase() || 'square';
              const color =
                (ctx.plainInstruction || ctx.instruction)
                  .match(/\b(blue|red|green|yellow|orange|purple|pink|cyan|teal|brown|gray)\b/i)?.[0]
                  .toLowerCase() || 'orange';
              const preview = u.el('section', 'task-preview', note);
              u.el('div', 'preview-title', preview, 'Task Preview');
              const scene = u.el('div', 'preview-scene', preview);
              const item = u.el('div', 'preview-item shape-' + shape, scene);
              item.style.setProperty('--shape-color', color);
              u.el('div', 'preview-box', scene);
              u.el(
                'p',
                'preview-copy',
                preview,
                'Move the ' + color + ' ' + shape + ' into the box.',
              );
            }
          },
        'frame.21': (base, S) =>
          function (_c) {
            const { C } = S;
            const { shell, u } = _c;
            if (C.theme === 'amiga') {
              const bar = u.el('div', 'app-titlebar', shell);
              bar.style.cssText = 'left:33.5vw;right:0;top:47px;height:40px';
              u.el('span', 'app-gadget', bar, '▣');
              u.el('span', '', bar, 'Shape Trainer');
              const ctr = u.el('span', 'app-controls', bar);
              for (const t of ['−', '□', '×']) u.el('b', '', ctr, t);
              const tabs = u.el('div', 'app-tabs', shell);
              tabs.style.cssText = 'left:34.2vw;right:5vw;top:95px;height:48px';
              const pref = u.el('button', 'app-tab', tabs, 'Preferences');
              const task = u.el('button', 'app-tab active', tabs, 'Task');
              pref.type = task.type = 'button';
              pref.onclick = () => env.log('decoy', { label: 'Preferences' });
              task.onclick = () => env.log('tab', { label: 'Task' });
              const tools = u.el('div', 'tool-strip', shell);
              tools.style.cssText = 'right:12px;top:151px;bottom:80px;width:58px';
              for (const [label, icon] of [
                ['Pointer', '↖'],
                ['Marquee', '▧'],
                ['Rectangle', '□'],
              ]) {
                const b = u.el('button', 'strip-tool', tools, icon);
                b.type = 'button';
                b.title = label;
                b.onclick = () => env.log('decoy', { label });
              }
            }
            _c.aside = null;
          },
        'frame.22': () => () => {},
        'frame.27': (base, S) =>
          function (_c) {
            const { collide, ctx, endLabel, footer, note, placement, shell, u } = _c;
            if (!ctx.finish) {
              const parent =
                placement === 'toolbar'
                  ? shell.querySelector('.app-tabs')
                  : placement === 'icon'
                    ? shell.querySelector('.app-titlebar')
                    : footer;
              _c.submit = u.el('button', 'submit end-' + placement, parent, placement === 'icon' ? '✓' : endLabel);
              _c.submit.type = 'button';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.dataset.role = 'submit';
              _c.submit.onclick = () => ctx.submit();
            }
            if (collide) {
              const decoy = u.el('button', 'amiga-button end-xtra', footer, collide);
              decoy.type = 'button';
              decoy.dataset.role = 'xtra';
              decoy.onclick = () => env.log('decoy', { label: collide, collide: true });
              footer.prepend(decoy);
            }
          },
        'overlay.2': (base, S) =>
          function (_c) {
            const { ctx, kind, u } = _c;
            if (ctx.initial) {
              const tabs = document.querySelector('.app-tabs'),
                pref = tabs.querySelector('.app-tab'),
                task = tabs.querySelectorAll('.app-tab')[1];
              pref.classList.add('active');
              task.classList.remove('active');
              const sheet = u.el('section', 'preferences-sheet initial-preferences', document.body);
              sheet.dataset.role = 'overlay';
              sheet.style.cssText = 'left:34.2vw;right:5.8vw;top:146px;bottom:50px';
              u.el('div', 'sheet-title', sheet, 'Preferences');
              const groups = u.el('div', 'pref-grid', sheet);
              for (const [title, rows] of [
                [
                  'Display',
                  [
                    ['Background', 'Gray'],
                    ['Grid', 'Off'],
                    ['Show hints', 'On'],
                  ],
                ],
                [
                  'Appearance',
                  [
                    ['Tool icons', 'Standard'],
                    ['Window borders', '3D'],
                    ['Font size', 'Normal'],
                  ],
                ],
                [
                  'Sounds',
                  [
                    ['Move sound', 'On'],
                    ['Complete sound', 'On'],
                  ],
                ],
                ['Other', [['☑', 'Show welcome message at startup']]],
              ]) {
                const g = u.el('fieldset', 'pref-group', groups);
                u.el('legend', '', g, title);
                for (const [a, b] of rows) {
                  const row = u.el('div', 'pref-row', g);
                  if (a === '☑') {
                    u.el('span', 'fake-check', row, '✓');
                    u.el('span', '', row, b);
                  } else {
                    u.el('span', '', row, a + ':');
                    const val = u.el('span', 'fake-select', row, b);
                    u.el('i', '', val, '▲\n▼');
                  }
                }
              }
              const actions = u.el('div', 'pref-actions', sheet);
              for (const t of ['Restore Defaults', 'Cancel', 'Apply']) {
                const b = u.el('button', 'amiga-button', actions, t);
                b.type = 'button';
                b.onclick = () => env.log('decoy', { label: t });
              }
              task.onclick = () => {
                pref.classList.remove('active');
                task.classList.add('active');
                ctx.dismiss('task');
                task.onclick = () => env.log('tab', { label: 'Task' });
              };
              return { el: sheet, dismiss: task };
            }
            const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
            Object.assign(_c, { el });
          },
      },
    },
  });
})();
