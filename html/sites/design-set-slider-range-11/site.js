// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-set-slider-range-11',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'stack',
        'theme': 'modernist-dark',
        'title': '',
        'foot': 'Image Calibration',
        'accent': '#bbff32',
        'bg': '#f6f5eb',
        'surface': '#141a1d',
        'font': 'Nimbus Sans Narrow, Liberation Sans Narrow, Arial Narrow, sans-serif',
        'ob': 'newsletter',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.14': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, note, u } = _c;
            if (C.layout === 'ledger') {
              const ledger = u.el('section', 'ledger-table', content);
              u.el('h2', '', ledger, C.theme === 'vista' ? 'Photo Library' : 'Ledger');
              const table = u.el('table', '', ledger);
              const header = u.el('tr', '', table);
              for (const t of C.theme === 'vista'
                ? ['Name', 'Date Modified', 'Size', 'Type', 'Status']
                : ['Date', 'Description', 'Category', 'Amount', 'Status'])
                u.el('th', '', header, t);
              const files = [
                'Forest',
                'Lake',
                'Mountains',
                'City',
                'Road',
                'Beach',
                'Flowers',
                'Architecture',
                'Sunset',
                'River',
                'Wildlife',
                'Garden',
                'Snow',
                'Desert',
              ];
              for (let i = 0; i < (C.theme === 'vista' ? 14 : 8); i++) {
                const tr = u.el('tr', '', table);
                for (const value of C.theme === 'vista'
                  ? [files[i] + '.jpg', '2024-08-' + String(12 - i).padStart(2, '0'), '2.4 MB', 'JPG image', 'Ready']
                  : [
                      'Jun ' + String(i + 1).padStart(2, '0') + ', 2025',
                      [
                        'Office Supplies',
                        'Client Payment - Rivera',
                        'Cloud Hosting',
                        'Travel - Train',
                        'Design Contract',
                        'Team Lunch',
                        'Domain Renewal',
                        'Client Payment - Park',
                      ][i],
                      i % 2 ? 'Income' : 'Business',
                      i % 2 ? '$1,250.00' : '-$48.20',
                      'Posted',
                    ])
                  u.el('td', '', tr, value);
              }
            }
            if (C.theme === 'newspaper') {
              const intro = u.el('div', 'article-intro', note);
              u.el('small', '', intro, 'PUZZLES & GAMES');
              u.el('h1', '', intro, 'Word Order');
              u.el('p', '', intro, 'Rearrange the cards below to form an alphabetical list:');
            }
            if (C.theme === 'riso') {
              const display = u.el('div', 'riso-preview', content);
              const copy = u.el('div', '', display);
              u.el('h1', '', copy, 'Adjust Image Contrast');
              u.el('p', '', copy, 'Use the slider to match the target value. The image updates in real time.');
              const img = u.el('img', '', display);
              img.src = 'sites/' + 'design-set-slider-range-11' + '/mountains.png';
              img.alt = 'Alpine mountains reflected in a lake';
            }
            u.el('div', 'note-label', note, C.layout === 'left' ? 'Task' : '');
            const instruction = u.el('div', 'instruction', note);
            {
              const m = /^(.*?\.)\s+(.+)$/.exec(ctx.instruction || '');
              if (m) {
                u.el('span', 'ins-main', instruction, m[1]);
                u.el('span', 'ins-sub', instruction, m[2]);
              } else u.el('span', 'ins-main', instruction, ctx.instruction);
            }
            {
              const tm = u.el('div', 'timer-badge', note);
              const ic = u.el('span', 'timer-ic', tm);
              u.el('i', '', ic);
              u.el('i', '', ic);
              const tt = u.el('span', 'timer-tx', tm);
              u.el('b', '', tt, 'Timer paused');
              u.el('small', '', tt, 'Resumes after closing overlay');
            }
            Object.assign(_c, { instruction });
          },
        'frame.15': () => () => {},
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, u } = _c;
            {
              const hd = u.el('div', 'stage-head', content);
              u.el('small', '', hd, 'Image Settings');
              u.el('h2', '', hd, 'Adjust Display');
              u.el('p', '', hd, 'Fine-tune the range to improve detail and clarity.');
            }
            if (
              [
                'three',
                'windows',
                'offset',
                'sheet',
                'notebook',
                'rail',
                'palette',
                'ledger',
                'newspaper',
                'perimeter',
                'twin',
              ].includes(C.layout)
            ) {
              _c.aside = u.el('aside', 'aside', content);
              if (C.tabs) {
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
                } else if (C.layout === 'windows') u.el('p', '', _c.aside, 'Drag the handles to adjust the range.');
                else if (C.theme === 'crop-minimal')
                  u.el('p', '', _c.aside, 'Drag the handles to resize the crop box.');
                else if (C.layout === 'palette') {
                  const ol = u.el('ol', 'guide', _c.aside);
                  for (const t of [
                    'Drag each handle to the target value.',
                    'Keep the lower value on the left and the higher value on the right.',
                    'Do not click on the track.',
                  ])
                    u.el('li', '', ol, t);
                }
              }
            }
          },
        'frame.23': () => () => {},
        'frame.25': (base, S) =>
          function (_c) {
            const { C } = S;
            const { footer, u } = _c;
            {
              const fi = u.svg(
                'svg',
                {
                  class: 'foot-ic',
                  width: 56,
                  height: 48,
                  viewBox: '0 0 56 48',
                  fill: 'none',
                  stroke: '#111',
                  'stroke-width': 3,
                },
                footer,
              );
              u.svg('path', { d: 'M2 8H54M2 24H54M2 40H54' }, fi);
              for (const [cx, cy] of [
                [18, 8],
                [38, 24],
                [16, 40],
              ])
                u.svg('circle', { cx, cy, r: 5, fill: '#f6f5eb' }, fi);
            }
            {
              const fc = u.el('div', 'footer-copy', footer);
              u.el('b', '', fc, C.foot || '');
              u.el('small', '', fc, 'Adjust the settings, then submit.');
            }
          },
        'frame.27': (base, S) =>
          function (_c) {
            const { ctx, footer, u } = _c;
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end'),
                labels = (
                  ctx.content && Array.isArray(ctx.content.END_LABELS)
                    ? ctx.content.END_LABELS
                    : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
                ).map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x))),
                defaultLabel = labels.find((x) => x.toLowerCase() === 'submit') || 'Submit',
                label = er.bool(0.75) ? defaultLabel : er.pick(labels),
                placement = er.pick(['button', 'button', 'button', 'button', 'link', 'icon']),
                decoyRng = ctx.rng.fork('chrome/collide');
              if (placement === 'button') {
                const b = u.el('button', 'submit', footer, label);
                b.type = 'button';
                b.dataset.role = 'submit';
                b.setAttribute('aria-label', label);
                b.title = label;
                b.onclick = () => ctx.submit();
                _c.submit = b;
              } else if (placement === 'link') {
                const a = u.el('a', 'submit submit-link', footer, label + ' →');
                a.href = '#';
                a.dataset.role = 'submit';
                a.setAttribute('aria-label', label);
                a.title = label;
                a.onclick = (e) => {
                  e.preventDefault();
                  ctx.submit();
                };
                _c.submit = a;
              } else {
                const b = u.el('button', 'submit submit-icon', footer, '✓');
                b.type = 'button';
                b.dataset.role = 'submit';
                b.setAttribute('aria-label', label);
                b.title = label;
                b.onclick = () => ctx.submit();
                _c.submit = b;
              }
              if (decoyRng.bool(0.3)) {
                const pool = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
                if (pool.length) {
                  const d = u.el('button', 'submit-xtra', footer, decoyRng.pick(pool));
                  d.type = 'button';
                  d.dataset.role = 'xtra';
                  d.onclick = () => env.log('decoy', { label: d.textContent, collide: true });
                }
              }
            }
          },
        'overlay.7': (base, S) =>
          function (_c) {
            const { kind, o } = _c;
            if (o === 'update') {
              _c.title = 'A new version is available';
              _c.text = 'Get the latest features and security fixes.';
              _c.label = 'Remind me later';
            } else if (o === 'privacy') {
              _c.title = 'We’d like your consent';
              _c.text =
                'We use optional analytics to improve this application. You can change this setting at any time in the Options menu.';
              _c.label = 'Reject optional';
            } else if (o === 'tips') {
              _c.title = 'Tip of the day';
              _c.text = 'The midpoint is the point that is the same distance from both marked points.';
              _c.label = 'Close';
            } else if (o === 'newsletter') {
              _c.title = 'Join our newsletter';
              _c.text = 'Get product updates, tips and more.';
              _c.label = 'Close';
            } else if (o === 'notifications') {
              _c.title = 'Notifications (5)';
              _c.text =
                'Software Update Available\nDisk Almost Full\nTip of the Day\nWelcome to Shape Sorter\nReminder';
              _c.label = 'Dismiss all';
            } else if (o === 'announcement') {
              _c.title = 'Scheduled maintenance this Saturday, 8:00 AM – 12:00 PM (ET).';
              _c.text = 'During this time the workspace may be slower than usual. Your work is still being saved.';
              _c.label = 'Collapse announcement';
            } else if (o === 'survey') {
              _c.title = 'Quick Survey';
              _c.text = 'Please take a moment to give us some feedback.\nHow easy is this training task?';
              _c.label = 'Close survey';
            } else {
              _c.title = {
                cookie: 'Your privacy',
                toast: 'Changes saved',
                chat: 'Support',
                promo: 'Workspace update',
                banner: 'Service notice',
              }[kind];
              _c.text = {
                cookie: 'This application stores optional cookies.',
                toast: 'Your changes have been saved.',
                chat: 'Need a hand with this workspace?',
                promo: 'Explore the latest workspace features.',
                banner: 'You are viewing a shared workspace.',
              }[kind];
              _c.label = kind === 'cookie' ? 'Reject optional' : 'Close';
            }
          },
        'overlay.12': (base, S) =>
          function (_c) {
            const { C } = S;
            const { box, ctx, o, u } = _c;
            if (o === 'privacy' || o === 'newsletter') {
              const icon = u.svg(
                'svg',
                {
                  class: 'ob-icon',
                  width: 64,
                  height: 64,
                  viewBox: o === 'newsletter' ? '6 12 52 40' : '0 0 64 64',
                  fill: 'none',
                  stroke: C.accent,
                  'stroke-width': 3,
                },
                box,
              );
              u.svg(
                'path',
                {
                  d:
                    o === 'newsletter'
                      ? 'M8 14H56V50H8ZM8 14L30 33Q32 35 34 33L56 14'
                      : 'M32 4L54 14V30Q54 49 32 59Q10 49 10 30V14ZM22 30L29 37L44 21',
                },
                icon,
              );
            }
            if (o === 'newsletter') {
              const email = u.el('div', 'nl-email', box);
              u.el('span', '', email, 'Your email address');
              const sb = u.el('button', 'nl-sub', box, 'Subscribe');
              sb.type = 'button';
              const nt = u.el('button', 'nl-no', box, 'No thanks');
              nt.type = 'button';
              nt.onclick = () => ctx.dismiss('close');
            }
          },
      },
    },
  });
})();
