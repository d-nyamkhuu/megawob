// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-reorder-items-move-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'rail',
        'theme': 'collage',
        'title': 'Project Plan',
        'aside': 'All Tasks',
        'tabs': ['Inbox', 'Tasks', 'Today', 'Upcoming', 'Anytime', 'Completed'],
        'foot': '',
        'accent': '#3478f6',
        'bg': '#eef2f6',
        'surface': '#ffffff',
        'font': "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      },
      parts: {
        'frame.3': () => () => {},
        'frame.13': (base, S) =>
          function (_c) {
            const { C } = S;
            const { shell, u } = _c;
            const rail = C.layout === 'rail' ? u.el('nav', 'mac-rail', shell) : null;
            if (rail) {
              for (let i = 0; i < C.tabs.length; i++) {
                const b = u.el('button', 'rail-item' + (i === 1 ? ' active' : ''), rail);
                b.type = 'button';
                b.innerHTML =
                  '<span class="rail-icon">' +
                  ['✉', '☑', '▦', '▦', '◈', '✓'][i] +
                  '</span><span>' +
                  C.tabs[i] +
                  '</span>';
                b.onclick = () => {
                  rail.querySelectorAll('.rail-item').forEach((x) => x.classList.remove('active'));
                  b.classList.add('active');
                };
              }
              u.el('div', 'rail-sep', rail);
              for (const [label, color] of [
                ['Website Redesign', '#3682f6'],
                ['Product Launch', '#31b956'],
                ['Marketing', '#f39217'],
                ['Personal', '#9256cb'],
              ]) {
                const b = u.el('div', 'project-link', rail);
                u.el('i', 'project-dot', b).style.background = color;
                u.el('span', '', b, label);
              }
              u.el('div', 'rail-sep', rail);
              for (const t of ['Work', 'Home', 'Errands', 'Research', 'Someday']) {
                const b = u.el('div', 'tag-link', rail);
                u.el('span', 'tag-icon', b, '◇');
                u.el('span', '', b, t);
              }
            }
            const content = u.el('div', 'content', shell),
              note = u.el('section', 'task-note', content);
            Object.assign(_c, { content, note, rail });
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, u } = _c;
            if (['three', 'windows', 'offset', 'sheet', 'notebook', 'rail', 'palette', 'ledger'].includes(C.layout)) {
              _c.aside = u.el('aside', 'aside', content);
              if (C.layout === 'rail') {
                u.el('h3', '', _c.aside, 'All Tasks');
                const search = u.el('div', 'task-search', _c.aside);
                u.el('span', '', search, '⌕');
                u.el('span', 'search-placeholder', search, 'Search');
                for (const [i, t] of [
                  'Draft press release',
                  'Schedule product demo',
                  'Design landing page',
                  'Set up analytics',
                  'Gather customer feedback',
                  'Plan post-launch review',
                ].entries()) {
                  const row = u.el('div', 'related-row' + (i === 0 ? ' selected' : ''), _c.aside);
                  u.el('span', 'related-check', row);
                  const box = u.el('div', '', row);
                  u.el('div', 'related-title', box, t);
                  u.el(
                    'div',
                    'related-date',
                    box,
                    ['May 2, 2025', 'May 9, 2025', 'May 14, 2025', 'May 18, 2025', 'May 24, 2025', 'May 30, 2025'][i],
                  );
                }
              } else if (C.tabs) {
                _c.aside.classList.add('tabs');
                for (const text of C.tabs) {
                  const bt = u.el('button', 'tab', _c.aside, text);
                  bt.type = 'button';
                  bt.onclick = () => {
                    _c.aside.querySelectorAll('.tab').forEach((x) => x.classList.remove('active'));
                    bt.classList.add('active');
                  };
                }
              } else if (C.layout === 'sheet') {
                for (let i = 1; i <= 20; i++) u.el('div', 'index-number', _c.aside, String(i));
              } else if (C.layout === 'offset') {
                for (const text of ['Select', 'Zoom In', 'Zoom Out', 'Pan']) u.el('button', 'map-tool', _c.aside, text);
              } else {
                u.el('h3', '', _c.aside, C.aside || 'Instructions');
                if (C.aside === 'Your Answer') {
                  u.el('p', '', _c.aside, 'No point selected yet.');
                  u.el('hr', '', _c.aside);
                  u.el('p', '', _c.aside, 'X:    —');
                  u.el('p', '', _c.aside, 'Y:    —');
                } else if (C.aside === 'Progress') {
                  u.el('p', '', _c.aside, 'Problem 1 of 5');
                  u.el('progress', '', _c.aside).value = 0.2;
                  u.el('h3', '', _c.aside, 'Tips');
                  u.el('p', '', _c.aside, 'Click outside the dotted circle.');
                }
              }
            }
          },
        'frame.23': () => () => {},
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
