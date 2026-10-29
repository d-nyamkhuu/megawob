// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-single-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'ledger',
        'theme': 'intranet',
        'title': 'WorkZone',
        'subtitle': '',
        'menu': '▦     1  Tasks       2  Records       3  Reports       4  Settings',
        'aside': 'Task',
        'foot': '',
        'accent': '#f45a08',
        'bg': '#e8f5f1',
        'surface': '#fff',
        'font': 'Arial Narrow, Arial, sans-serif',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.menu) {
              const nav = u.el('nav', 'menu', head);
              if (C.theme === 'intranet') {
                for (const [i, label] of ['Tasks', 'Records', 'Reports', 'Settings'].entries()) {
                  const item = u.el('button', 'nav-item' + (i === 0 ? ' active' : ''), nav, i + 1 + '  ' + label);
                  item.type = 'button';
                }
                const project = u.el('div', 'project-label', nav, 'Project　Q2 Operations　▾');
                const avatar = u.el('div', 'avatar', nav, 'JD');
              } else nav.textContent = C.menu;
            }
          },
        'frame.13': (base, S) =>
          function (_c) {
            const { shell, u } = _c;
            const content = u.el('div', 'content', shell);
            const ledger = u.el('section', 'ledger-sheet', content);
            u.el('h2', 'ledger-title', ledger, 'Task Ledger');
            const table = u.el('table', 'ledger-table', ledger);
            const headrow = u.el('tr', '', u.el('thead', '', table));
            for (const label of ['#', 'Task', 'Type', 'Status', 'Due Date', 'Owner']) u.el('th', '', headrow, label);
            const tbody = u.el('tbody', '', table);
            for (const row of [
              ['001', 'Align documents', 'Review', 'Complete', 'Apr 14, 2025', 'Taylor'],
              ['002', 'Verify data', 'Check', 'Complete', 'Apr 15, 2025', 'Morgan'],
              ['003', 'Update records', 'Edit', 'In Progress', 'Apr 16, 2025', 'Casey'],
              ['004', 'Prepare summary', 'Report', 'Pending', 'Apr 17, 2025', 'Jordan'],
              ['005', 'Organize assets', 'File', 'Pending', 'Apr 18, 2025', 'Riley'],
            ]) {
              const tr = u.el('tr', '', tbody);
              for (const value of row) u.el('td', '', tr, value);
            }
            const note = u.el('section', 'task-note', content);
            u.el('div', 'note-label', note, 'Task');
            Object.assign(_c, { content, headrow, ledger, note, table, tbody });
          },
        'frame.14': () => () => {},
        'frame.16': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, note, u } = _c;
            if (C.theme === 'intranet') {
              const controls = u.el('section', 'control-card', note);
              u.el('h3', '', controls, 'Controls');
              const line = u.el('div', 'control-copy', controls);
              u.el('span', 'cursor-glyph', line, '↖');
              u.el('span', '', line, 'Drag the colored shape to move it. Place it entirely inside the outlined box.');
            }
            if (C.theme === 'memphis') {
              u.el('h1', 'brief-title', note, C.title);
              note.prepend(note.lastChild);
              u.el(
                'p',
                'brief-copy',
                note,
                'Drag and drop the months on the right to arrange them from January to December.',
              );
            }
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
          },
        'frame.17': () => () => {},
        'frame.22': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { ctx, footer, ledger, note, u } = _c;
            const endRng = ctx.rng.fork('chrome/end'),
              collideRng = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const referenceEnd = endRng.bool(0.5);
            const placement = referenceEnd ? 'note' : endRng.pick(['toolbar', 'ledger-link']);
            const endLabel = referenceEnd
              ? endLabels.find((label) => label === 'Submit') || endLabels[0]
              : endRng.pick(endLabels);
            _c.submit = null;
            if (!ctx.finish) {
              let parent = footer,
                cls = 'submit';
              if (placement === 'toolbar') {
                parent = ledger.querySelector('.ledger-title');
                cls += ' ledger-end';
              } else if (placement === 'ledger-link') {
                parent = u.el('div', 'ledger-end-shelf', ledger);
                cls += ' ledger-end-link';
              }
              _c.submit = u.el('button', cls, parent, endLabel);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.onclick = () => ctx.submit();
            }
            if (ctx.finish || placement !== 'note') footer.hidden = true;
            if (_c.submit && placement === 'note' && !note.hidden && ctx.display !== 'toast') {
              const controls = note.querySelector('.control-card');
              if (controls && controls.getBoundingClientRect().bottom > _c.submit.getBoundingClientRect().top - 8)
                controls.hidden = true;
            }
            if (collideRng.bool(0.3)) {
              const alternatives = [...new Set(endLabels)].filter(
                (label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
              );
              if (alternatives.length) {
                const label = collideRng.pick(alternatives),
                  shelf = u.el('div', 'ledger-xtra-shelf', ledger);
                const decoy = u.el('button', 'ledger-xtra', shelf, label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label, collide: true });
              }
            }
            Object.assign(_c, { collideRng, endLabel, endLabels, endRng, labelOf, placement, referenceEnd });
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
