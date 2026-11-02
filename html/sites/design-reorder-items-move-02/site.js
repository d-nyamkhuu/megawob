// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-reorder-items-move-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'stack',
        'theme': 'collage',
        'title': 'Workflow',
        'menu': 'Projects       Tasks       Calendar       People       Reports',
        'foot': '',
        'accent': '#c8fa69',
        'bg': '#f7f6f2',
        'surface': '#fff',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.menu) {
              const nav = u.el('nav', 'menu', head);
              for (const [i, label] of C.menu.split(/\s{2,}/).entries()) {
                const item = u.el('button', 'menu-item' + (label === 'Tasks' ? ' active' : ''), nav, label);
                item.type = 'button';
                item.onclick = () => {
                  nav.querySelectorAll('.menu-item').forEach((x) => x.classList.remove('active'));
                  item.classList.add('active');
                };
              }
              const utilities = u.el('div', 'nav-utilities', nav);
              for (const [symbol, label] of [
                ['search', 'Search'],
                ['bell', 'Notifications'],
                ['AW', 'Account'],
              ]) {
                const b = u.el(
                  'button',
                  'nav-util' + (label === 'Account' ? ' avatar' : ''),
                  utilities,
                  label === 'Account' ? symbol : '',
                );
                b.type = 'button';
                b.setAttribute('aria-label', label);
                b.title = label;
                b.onclick = () => env.log('nav-tool', { label });
                if (label === 'Search') {
                  const s = u.svg(
                    'svg',
                    {
                      width: 27,
                      height: 27,
                      viewBox: '0 0 28 28',
                      fill: 'none',
                      stroke: 'currentColor',
                      'stroke-width': 2.2,
                    },
                    b,
                  );
                  u.svg('circle', { cx: 12, cy: 12, r: 8 }, s);
                  u.svg('path', { d: 'M18 18L25 25' }, s);
                } else if (label === 'Notifications') {
                  const s = u.svg(
                    'svg',
                    {
                      width: 25,
                      height: 27,
                      viewBox: '0 0 28 30',
                      fill: 'none',
                      stroke: 'currentColor',
                      'stroke-width': 2,
                    },
                    b,
                  );
                  u.svg('path', { d: 'M6 21V13a8 8 0 0 1 16 0v8l3 3H3zM11 26a3 3 0 0 0 6 0' }, s);
                }
              }
            }
          },
        'frame.13': (base, S) =>
          function (_c) {
            const { shell, u } = _c;
            const hero = u.el('section', 'campaign-hero', shell);
            const details = u.el('div', 'campaign-details', hero);
            u.el('div', 'campaign-kicker', details, 'Campaign');
            u.el('h1', 'campaign-title', details, 'Spring Launch');
            const stats = u.el('div', 'campaign-stats', details);
            for (const [value, label] of [
              ['8', 'Tasks'],
              ['Apr 8, 2021', 'Start date'],
              ['Apr 30, 2021', 'Due date'],
              ['In Progress', 'Status'],
            ]) {
              const item = u.el('div', 'campaign-stat', stats);
              u.el('strong', '', item, value);
              u.el('span', '', item, label);
            }
            const banner = u.el('div', 'campaign-banner', hero);
            const content = u.el('div', 'content', shell),
              note = u.el('section', 'task-note', content);
            Object.assign(_c, { banner, content, details, hero, note, stats });
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, hero, note, u } = _c;
            if (C.layout === 'stack') {
              hero.appendChild(note);
              _c.aside = u.el('aside', 'tips-rail', content);
              u.el('h2', '', _c.aside, 'Tips');
              for (const [icon, title, copy] of [
                ['⠿', 'Drag and drop', 'Grab the handle at the right end of a row to move an item.'],
                ['⌨', 'Use your keyboard', 'Select an item and press Alt + ↑ or Alt + ↓ to move it up or down.'],
                ['ⓘ', 'Keep the order updated', 'The list reflects the current sequence for this project.'],
              ]) {
                const tip = u.el('div', 'tip-row', _c.aside);
                u.el('span', 'tip-icon', tip, icon);
                const words = u.el('div', 'tip-copy', tip);
                u.el('strong', '', words, title);
                u.el('p', '', words, copy);
              }
            }
          },
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
