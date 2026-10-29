// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-set-slider-log-11',
    initialOverlay: { kind: 'cookie' },
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'bleed',
        'theme': 'riso',
        'title': 'Image Adjuster',
        'foot': 'Adjust the contrast until it matches the target, then submit.',
        'accent': '#902c41',
        'bg': '#f3eedf',
        'surface': '#f3eedf',
        'font': 'Georgia, serif',
        'ob': 'tips',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            const status = u.el('div', 'task-status', head);
            u.el('span', '', status, 'Task 1 of 1');
            u.el('span', 'task-mode', status);
            if (C.menu) u.el('nav', 'menu', head, C.menu);
            Object.assign(_c, { status });
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
              u.el('h1', '', copy, 'Adjust Image\nContrast');
              u.el('p', '', copy, 'Use the slider to match the target value.\nThe image updates in real time.');
              const photo = u.el('div', 'riso-photo', display);
              const img = u.el('img', '', photo);
              img.src = 'sites/' + 'design-set-slider-log-11' + '/mountains.webp';
              img.alt = 'Alpine mountains reflected in a lake';
            }
            u.el('div', 'note-label', note, C.layout === 'left' ? 'Task' : '');
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
        'frame.26': (base, S) =>
          function (_c) {
            const { body, ctx, footer, head, shell, u } = _c;
            const er = ctx.rng.fork('chrome/end'),
              labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endWords = ctx.content.END_LABELS.map(labelOf),
              referenceEnd = er.bool(0.5);
            const placement = referenceEnd ? 'footer' : er.pick(['header', 'link']);
            const label = referenceEnd ? 'Submit' : er.pick(endWords.filter((x) => x !== 'Submit'));
            _c.submit = null;
            if (!ctx.finish) {
              shell.dataset.end = placement;
              const parent = placement === 'header' ? head : footer;
              _c.submit = u.el('button', 'submit end-' + placement, parent, label);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = label === '✓' ? 'Complete task' : label;
              _c.submit.setAttribute('aria-label', _c.submit.title);
              _c.submit.onclick = () => ctx.submit();
              if (label.length > 9) _c.submit.style.fontSize = 'clamp(16px,1.4vw,24px)';
              if (placement === 'header') body.classList.add('has-header-end');
            }
            const cr = ctx.rng.fork('chrome/collide');
            if (cr.bool(0.3)) {
              const options = [...new Set(endWords)].filter(
                (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
              );
              if (options.length) {
                const text = cr.pick(options),
                  decoy = u.el('button', 'chrome-xtra', footer, text);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label: text, collide: true });
              }
            }
            Object.assign(_c, { cr, endWords, er, label, labelOf, placement, referenceEnd });
          },
        'frame.27': () => () => {},
        'overlay.7': (base, S) =>
          function (_c) {
            const { C } = S;
            const { box, ctx, kind, o, u } = _c;
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
              _c.text =
                'Small changes can make a big difference.\nTry dragging slowly for finer control, especially on a logarithmic scale.';
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
            const heading = u.el('h3', '', box, _c.title);
            if (o === 'tips') {
              const bulb = u.svg('svg', { class: 'tip-bulb', viewBox: '0 0 36 48', fill: 'currentColor' }, heading);
              u.svg(
                'path',
                { d: 'M18 1C1 1 0 19 7 27L11 35H25L29 27C36 19 35 1 18 1ZM11 38H25V41H11ZM13 44H23L21 47H15Z' },
                bulb,
              );
              const close = u.el('button', 'tip-x', heading, '×');
              close.type = 'button';
              close.setAttribute('aria-label', 'Close tip');
              close.onclick = () => ctx.dismiss('close');
            }
            if (o === 'notifications') {
              const notifications = u.el('div', 'notifications', box);
              for (const [name, body] of C.theme === 'bitmap'
                ? [
                    ['Software Update Available', 'A new version is ready.'],
                    ['Disk Almost Full', 'You have 12 MB remaining.'],
                    ['Tip of the Day', 'Organize your files faster.'],
                    ['Welcome to Shape Sorter', 'Learn how to play.'],
                    ['Reminder', 'Back up your disk.'],
                  ]
                : [
                    ['New message', 'You have a new message from Alex.'],
                    ['Weekly digest', 'Your summary is ready to view.'],
                    ['Product update', 'Check out what’s new this week.'],
                    ['Event reminder', 'Design sync starts in 1 hour.'],
                  ]) {
                const card = u.el('div', 'notification-card', notifications);
                u.el('strong', '', card, name);
                u.el('p', '', card, body);
                const x = u.el('button', 'notification-x', card, '×');
                x.onclick = () => card.remove();
              }
            } else if (o === 'tips') {
              const copy = u.el('div', 'tip-copy', box);
              u.el('strong', '', copy, 'Small changes can make a big difference.');
              u.el('p', '', copy, 'Try dragging slowly for finer control,\nespecially on a logarithmic scale.');
            } else u.el('p', '', box, _c.text);
            Object.assign(_c, { heading });
          },
        'overlay.8': () => () => {},
        'overlay.9': () => () => {},
      },
    },
  });
})();
