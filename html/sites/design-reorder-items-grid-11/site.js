// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-reorder-items-grid-11',
    styles: ['site.css', 'ref.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'perimeter',
        'theme': 'gnome',
        'title': 'Word Sorter',
        'subtitle': 'Practice Mode',
        'aside': 'Time',
        'foot': '',
        'accent': '#2879ed',
        'bg': '#eceef0',
        'surface': '#fff',
        'font': 'Arial, sans-serif',
        'ob': 'privacy',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.7': (base, S) =>
          function (_c) {
            const { body, u } = _c;
            const icon = (parent, path, w = 20, cls = '') => {
              const s = u.svg(
                'svg',
                {
                  width: w,
                  height: w,
                  viewBox: '0 0 24 24',
                  fill: 'none',
                  stroke: 'currentColor',
                  'stroke-width': 2,
                  'stroke-linecap': 'round',
                  'stroke-linejoin': 'round',
                  class: cls,
                },
                parent,
              );
              u.svg('path', { d: path }, s);
              return s;
            };
            const appPath = 'M5 5H15V17H5ZM9 8H19V20H9M7 9H12M7 12H12M11 15H17M11 18H17';
            const shell = u.el('div', 'shell', body),
              topbar = u.el('div', 'topbar', shell);
            u.el('span', 'tb-act', topbar, 'Activities');
            const app = u.el('span', 'tb-app', topbar);
            icon(u.el('span', 'tb-mini', app), appPath, 15);
            u.el('span', '', app, 'Word Sorter');
            u.el('span', 'tb-clock', topbar, 'Apr 22  10:24');
            const sys = u.el('span', 'tb-sys', topbar);
            icon(sys, 'M3 8Q12 1 21 8M6 11Q12 6 18 11M9 14Q12 11 15 14M12 17H12.01');
            icon(sys, 'M3 9H7L12 5V19L7 15H3ZM16 8Q21 12 16 16M18 5Q25 12 18 19');
            icon(sys, 'M3 6H19V18H3ZM21 10V14M6 9H16V15H6Z');
            const head = u.el('header', 'head', shell);
            icon(u.el('span', 'app-icon', head), appPath, 22);
            const wc = u.el('div', 'wc', head);
            for (const path of ['M6 12H18', 'M6 6H18V18H6Z', 'M6 6L18 18M18 6L6 18']) icon(wc, path, 20);
            Object.assign(_c, { app, appPath, head, icon, shell, sys, topbar, wc });
          },
        'frame.14': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, note, u } = _c;
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
              img.src = 'sites/' + 'design-reorder-items-grid-11' + '/mountains.png';
              img.alt = 'Alpine mountains reflected in a lake';
            }
            u.el('div', 'note-label', note, C.layout === 'left' ? 'Task' : '');
          },
        'frame.19': (base, S) =>
          function (_c) {
            const { content, icon, u } = _c;
            const prog = u.el('aside', 'prog', content);
            u.el('b', '', prog, 'Progress');
            u.el('div', 'prog-n', prog, '0 placed');
            u.el('div', 'prog-bar', prog);
            u.el('hr', '', prog);
            const tip = u.el('div', 'tip-label', prog);
            icon(
              tip,
              'M12 2A8 8 0 0 0 6.4 15.7C8 17.2 8 18 8 19H16C16 18 16 17.2 17.6 15.7A8 8 0 0 0 12 2ZM9 22H15',
              26,
              'tip-icon',
            );
            u.el('b', '', tip, 'Tip');
            u.el('p', '', prog, 'Drag tiles to reorder them.');
            const stage = u.el('main', 'stage', content);
            Object.assign(_c, { prog, stage, tip });
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, u } = _c;
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
                if (C.aside === 'Time') {
                  const r = u.el('div', 't-row', _c.aside);
                  u.el('span', 't-ic', r, '❚❚');
                  u.el('b', '', r, 'Paused');
                  u.el('p', '', _c.aside, 'Starts after consent\nis dismissed.');
                  u.el('hr', '', _c.aside);
                  const r2 = u.el('div', 't-row', _c.aside);
                  u.el('span', 't-ic', r2, '?');
                  u.el('b', '', r2, 'Need help?');
                  u.el('p', '', _c.aside, 'Read the instructions\ncarefully.');
                } else if (C.aside === 'Your Answer') {
                  u.el('p', '', _c.aside, 'No point selected yet.');
                  u.el('hr', '', _c.aside);
                  u.el('p', '', _c.aside, 'X:    —');
                  u.el('p', '', _c.aside, 'Y:    —');
                } else if (C.aside === 'Progress') {
                  u.el('p', '', _c.aside, 'Problem 1 of 5');
                  u.el('progress', '', _c.aside).value = 0.2;
                  u.el('h3', '', _c.aside, 'Tips');
                  u.el('p', '', _c.aside, 'Click outside the dotted circle.');
                } else if (C.layout === 'windows') u.el('p', '', _c.aside, ctx.instruction);
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
        'frame.27': (base, S) =>
          function (_c) {
            const { ctx, footer, head, u } = _c;
            _c.collide = null;
            _c.endPlacement = null;
            _c.endText = 'Submit';
            if (!ctx.finish) {
              const er = ctx.rng.fork('chrome/end');
              const placements = ['footer', 'footer', 'footer', 'header', 'link'];
              _c.endPlacement = er.pick(placements);
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
                "I'm done",
              ];
              if (!er.bool(0.5)) {
                const xs = labels.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name)).filter(Boolean);
                if (xs.length) _c.endText = er.pick(xs);
              }
              const parent = _c.endPlacement === 'header' ? head : footer;
              _c.submit = u.el(
                _c.endPlacement === 'link' ? 'a' : 'button',
                _c.endPlacement === 'link' ? 'submit end-link' : 'submit end-header',
                parent,
                _c.endPlacement === 'link' ? _c.endText + ' ›' : _c.endText,
              );
              if (_c.endPlacement === 'link') _c.submit.href = '#';
              else _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', _c.endText);
              _c.submit.title = _c.endText;
              _c.submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
              const cr = ctx.rng.fork('chrome/collide');
              if (cr.bool(0.3)) {
                const pool = ((ctx.content && ctx.content.END_LABELS) || labels)
                  .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name))
                  .filter((x) => x && x.trim().toLowerCase() !== _c.endText.trim().toLowerCase());
                if (pool.length) {
                  _c.collide = { label: cr.pick(pool), where: cr.pick(['header', 'footer']) };
                  const box = u.el(
                    'div',
                    'chrome-xtras ' + (_c.collide.where === 'header' ? 'header-xtras' : 'footer-xtras'),
                    _c.collide.where === 'header' ? head : footer,
                  );
                  const b = u.el('button', 'xtra-control', box, _c.collide.label);
                  b.type = 'button';
                  b.dataset.role = 'xtra';
                  b.onclick = () => env.log('decoy', { label: _c.collide.label, collide: true });
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
              _c.title = 'Help us improve';
              _c.text =
                'We’d like to collect optional usage data to help us understand\nhow people use Word Sorter. This may include information\nabout your interactions, device type, and general location.\nThis data is used only for product improvement and is not\nshared with third parties for advertising.';
              _c.label = 'Reject optional';
            } else if (o === 'tips') {
              _c.title = 'Tip of the day';
              _c.text = 'The midpoint is the point that is the same distance from both marked points.';
              _c.label = 'Close';
            } else if (o === 'newsletter') {
              _c.title = 'Stay in the loop';
              _c.text = 'Get occasional tips, practice problems, and feature updates.';
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
        'overlay.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { box, o, u } = _c;
            if (o === 'privacy') u.el('a', 'learn', box, 'Learn more');
            const dismiss = u.el('button', 'dismiss', box, _c.label);
            if (o === 'privacy' || o === 'newsletter') {
              const icon = u.svg(
                'svg',
                {
                  class: 'ob-icon',
                  width: 64,
                  height: 64,
                  viewBox: '0 0 64 64',
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
                      ? 'M8 14H56V50H8ZM8 14L32 34L56 14'
                      : 'M32 7L53 16V30Q53 48 32 59Q11 48 11 30V16Z',
                },
                icon,
              );
              if (o === 'privacy')
                u.svg('path', { d: 'M32 18V49Q45 41 45 29V23Z', fill: '#fff', stroke: 'none' }, icon);
            }
            Object.assign(_c, { dismiss });
          },
        'overlay.12': () => () => {},
        'overlay.15': (base, S) =>
          function (_c) {
            const { box, ctx, kind, o, u } = _c;
            if (o === 'privacy' || (kind === 'cookie' && !o)) {
              const accept = u.el('button', 'dismiss accept', box, 'Accept');
              accept.onclick = () => ctx.dismiss('accept');
            }
          },
      },
    },
  });
})();
