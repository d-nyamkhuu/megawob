// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-reorder-items-move-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'stack',
        'theme': 'material',
        'title': '',
        'foot': '',
        'accent': '#5146d8',
        'bg': '#f5f7fb',
        'surface': '#ffffff',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.13': (base, S) =>
          function (_c) {
            const { shell, u } = _c;
            const tabs = u.el('nav', 'material-tabs', shell);
            for (const [i, label] of ['Tasks', 'Calendar', 'Notes', 'Files', 'People'].entries()) {
              const b = u.el('button', 'material-tab' + (i === 0 ? ' active' : ''), tabs);
              b.type = 'button';
              b.innerHTML = ['☑', '▣', '▤', '▱', '♙'][i] + '<span>' + label + '</span>';
              b.onclick = () => {
                tabs.querySelectorAll('.material-tab').forEach((x) => x.classList.remove('active'));
                b.classList.add('active');
              };
            }
            u.el('button', 'search', tabs, '⌕').onclick = () => {};
            u.el('button', 'profile', tabs, 'A').onclick = () => {};
            const content = u.el('div', 'content', shell),
              summary = u.el('aside', 'material-summary', content);
            u.el('h2', '', summary, 'Task list');
            const stats = u.el('div', 'status-list', summary);
            for (const [name, color, count] of [
              ['Not started', '#aab1bb', '6'],
              ['In progress', '#5da2ee', '0'],
              ['Completed', '#19a768', '0'],
              ['Blocked', '#ef6969', '0'],
            ]) {
              const row = u.el('div', 'status-row', stats);
              u.el('i', 'status-dot', row).style.background = color;
              u.el('span', '', row, name);
              u.el('b', '', row, count);
            }
            u.el('hr', '', summary);
            u.el('h3', '', summary, 'Total items');
            u.el('strong', 'total-count', summary, '6');
            u.el('hr', '', summary);
            u.el('h3', '', summary, 'Due soon');
            for (const [date, num] of [
              ['Apr 12, 2024', '1'],
              ['Apr 18, 2024', '1'],
              ['Apr 25, 2024', '1'],
            ]) {
              const d = u.el('div', 'due-row', summary);
              u.el('span', 'calendar-icon', d, '▢');
              u.el('span', '', d, date);
              u.el('b', '', d, num);
            }
            const note = u.el('section', 'task-note', content);
            Object.assign(_c, { content, note, stats, summary, tabs });
          },
        'frame.19': (base, S) =>
          function (_c) {
            const { content, u } = _c;
            const stageBar = u.el('div', 'material-stage-bar', content);
            u.el('h1', '', stageBar, 'Project tasks');
            const order = u.el('button', 'order-control', stageBar);
            order.type = 'button';
            order.innerHTML =
              '<span aria-hidden="true">☷</span><span>Custom order</span><span aria-hidden="true">⌄</span>';
            order.onclick = () => {};
            const stage = u.el('main', 'stage', content);
            Object.assign(_c, { order, stage, stageBar });
          },
        'frame.22': () => () => {},
        'frame.27': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, u } = _c;
            if (!ctx.finish) {
              const endRng = ctx.rng.fork('chrome/end'),
                bank = ctx.content && ctx.content.END_LABELS,
                labels =
                  Array.isArray(bank) && bank.length
                    ? bank
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
              let label = 'Submit',
                placement = 'footer';
              if (!endRng.bool(0.5)) {
                const alternatives = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== 'submit');
                if (alternatives.length) label = endRng.pick(alternatives);
                placement = endRng.pick(['link', 'icon']);
              }
              const parent = C.layout === 'three' && _c.aside ? _c.aside : footer;
              _c.submit = u.el(
                'button',
                'submit' + (placement === 'link' ? ' end-link' : placement === 'icon' ? ' end-icon' : ''),
                parent,
              );
              u.el('span', 'submit-label', _c.submit, placement === 'icon' ? '✓' : label);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', label);
              _c.submit.title = label;
              _c.submit.onclick = () => ctx.submit();
              if (placement === 'link') _c.submit.append(' ›');
              const collideRng = ctx.rng.fork('chrome/collide');
              if (collideRng.bool(0.3)) {
                const other = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
                if (other.length) {
                  const decoy = u.el('button', 'end-pq', footer, collideRng.pick(other));
                  decoy.type = 'button';
                  decoy.dataset.role = 'xtra';
                  decoy.onclick = () => env.log('decoy', { label: decoy.textContent, collide: true });
                  footer.insertBefore(decoy, _c.submit);
                }
              }
            }
          },
      },
    },
  });
})();
