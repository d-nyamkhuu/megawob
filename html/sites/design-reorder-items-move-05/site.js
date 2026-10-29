// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-reorder-items-move-05',
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
            const tb = u.el('div', 'beos-title', shell);
            u.el('span', 'beos-tab', tb, 'Projects').dataset.role = 'tab';
            const wc = u.el('span', 'beos-wc', tb);
            for (const g of ['_', '□', '×']) u.el('i', '', wc, g);
            const menu = u.el('div', 'beos-menu', shell);
            for (const m of ['File', 'Edit', 'Item', 'View', 'Tools', 'Help']) u.el('span', '', menu, m);
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
            const det = u.el('div', 'beos-detail', summary);
            u.el('h2', '', det, 'Project details');
            for (const [k, v] of [['Status:', 'In progress'], ['Start date:', 'Mar 1, 1999'], ['Due date:', 'May 28, 1999'], ['Owner:', 'Alex Chen']]) {
              const r = u.el('div', 'bd-row', det);
              u.el('span', '', r, k);
              u.el('span', '', r, v);
            }
            u.el('div', 'bd-lab', det, 'Description:');
            u.el('div', 'bd-box', det, 'Redesign the corporate website with updated brand and content.');
            u.el('div', 'bd-lab', det, 'Notes:');
            u.el('div', 'bd-box s', det, 'Initial designs approved. Moving to development phase next.');
            const rel = u.el('aside', 'beos-rel', content);
            u.el('h3', '', rel, 'Related Documents');
            for (const [n, d] of [['Project brief', 'Feb 12, 1999'], ['Design mockups', 'Mar 3, 1999'], ['Content outline', 'Mar 18, 1999'], ['Technical notes', 'Apr 6, 1999'], ['Launch checklist', 'Apr 21, 1999']]) {
              const r = u.el('div', 'rel-row', rel);
              u.el('span', 'rel-ic', r);
              u.el('span', '', r, n);
              u.el('span', 'rel-d', r, d);
            }
            u.el('h2', 'hid', summary, 'Task list');
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
            const dock = u.el('div', 'beos-dock', footer);
            for (const [i, n] of ['Projects', 'Calendar', 'Contacts', 'Documents'].entries()) {
              u.el('span', 'dk' + (i === 0 ? ' on' : ''), dock).innerHTML = '<i class="dki' + i + '"></i>' + n;
            }
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
