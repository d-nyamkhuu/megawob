// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-reorder-items-list-11',
    styles: ['site.css', 'site2.css', 'site3.css'],
    scripts: [],
    initialOverlay: { kind: 'promo' },
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'newspaper',
        'theme': 'newspaper',
        'title': 'The Daily Chronicle',
        'menu': 'NEWS   |   BUSINESS   |   LIFE   |   OPINION   |   ARTS',
        'aside': 'Preview',
        'foot': '',
        'accent': '#be1818',
        'bg': '#faf9f6',
        'surface': '#faf9f6',
        'font': 'Georgia, serif',
        'ob': 'survey',
      },
      parts: {
        'frame.2': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx } = _c;
            body.className =
              'design ' +
              C.theme +
              ' layout-' +
              C.layout +
              (ctx.display === 'toast' ? ' has-instruction-toast' : '') +
              (ctx.display === 'hidden' ? ' instruction-hidden' : '');
          },
        'frame.3': () => () => {},
        'frame.12': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            {
              const ut = u.el('div', 'paper-util', head);
              u.el('span', 'date', ut, 'Mon, Apr 18, 2011');
              u.el('a', '', ut, 'Sign In');
              u.el('span', '', ut, '|');
              u.el('a', '', ut, 'Subscribe');
            }
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
              const introCopy = u.el('p', '', intro, 'Rearrange the cards below to form an ');
              u.el('strong', '', introCopy, 'alphabetical list:');
            }
            if (C.theme === 'riso') {
              const display = u.el('div', 'riso-preview', content);
              const copy = u.el('div', '', display);
              u.el('h1', '', copy, 'Adjust Image Contrast');
              u.el('p', '', copy, 'Use the slider to match the target value. The image updates in real time.');
              const img = u.el('img', '', display);
              img.src = 'sites/' + 'design-reorder-items-list-11' + '/mountains.png';
              img.alt = 'Alpine mountains reflected in a lake';
            }
            u.el('div', 'note-label', note, C.layout === 'left' ? 'Task' : '');
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, content, ctx, note, stage, u } = _c;
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
            if (C.theme === 'newspaper') {
              const rail = u.el('div', 'rail', content);
              if (_c.aside) rail.appendChild(_c.aside);
              if (ctx.display !== 'header') {
                const intro = note.querySelector('.article-intro');
                if (intro) {
                  intro.classList.add('article-heading');
                  content.insertBefore(intro, note);
                }
                if (ctx.display === 'panel' || ctx.display === 'toast') {
                  rail.appendChild(note);
                  const caption = u.el(
                    'div',
                    'episode-note-label',
                    note,
                    ctx.display === 'panel' ? 'Puzzle instructions' : 'Puzzle notice',
                  );
                  note.prepend(caption);
                }
              }
              // Use the full-width editorial note if a long toast cannot fit the footer shelf.
              if (ctx.display === 'toast' && note.scrollHeight > note.clientHeight + 1) {
                const intro = content.querySelector('.article-heading');
                if (intro) {
                  intro.classList.remove('article-heading');
                  note.prepend(intro);
                }
                note.querySelector('.episode-note-label')?.remove();
                note.querySelector('.note-close')?.remove();
                note.classList.remove('instruction-toast');
                body.classList.remove('has-instruction-toast');
                content.insertBefore(note, stage);
              }
            }
          },
        'frame.23': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { ctx, footer, head, u } = _c;
            const endR = ctx.rng.fork('chrome/end'),
              labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name),
              endWords = ctx.content.END_LABELS.map(labelOf);
            const alternateLabel = endR.pick(endWords.filter((x) => x !== 'Submit')),
              alternatePlacement = endR.pick(['toolbar', 'link']),
              referenceEnd = endR.bool(0.5),
              placement = referenceEnd ? 'footer' : alternatePlacement,
              endLabel = referenceEnd ? 'Submit' : alternateLabel;
            _c.submit = null;
            if (!ctx.finish) {
              _c.submit = u.el(
                placement === 'link' ? 'a' : 'button',
                'submit end-' + placement,
                placement === 'toolbar' ? head : footer,
                endLabel,
              );
              if (placement === 'link') _c.submit.href = '#';
              else _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
            }
            const collideR = ctx.rng.fork('chrome/collide');
            if (collideR.bool(0.3)) {
              const alternatives = endWords.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
              if (alternatives.length) {
                const label = collideR.pick(alternatives),
                  decoy = u.el('button', 'paper-xtra', footer, label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label, collide: true });
              }
            }
            Object.assign(_c, {
              alternateLabel,
              alternatePlacement,
              collideR,
              endLabel,
              endR,
              endWords,
              labelOf,
              placement,
              referenceEnd,
            });
          },
        'frame.27': () => () => {},
        'overlay.2': (base, S) =>
          function (_c) {
            const { ctx, kind, u } = _c;
            if (ctx.initial) {
              const dr = u.el('section', 'survey-drawer initial-survey', document.body);
              dr.dataset.role = 'overlay';
              const top = u.el('div', 'sd-head', dr);
              u.el('h3', '', top, 'We value your opinion');
              const close = u.el('button', 'sd-close', top, '✕ Close survey');
              close.type = 'button';
              const collapse = (how) => {
                env.log('survey', { how });
                ctx.dismiss(how);
              };
              close.onclick = () => collapse('close');
              u.el('p', 'sd-lede', dr, 'Help us improve The Daily Chronicle.');
              const sb = u.el('div', 'sd-body', dr);
              for (const [i, [q, opts]] of [
                ['How often do you visit our site?', ['Daily', 'A few times a week', 'A few times a month', 'Rarely']],
                ['What do you enjoy most?', ['News', 'Business', 'Lifestyle', 'Opinion', 'Arts']],
              ].entries()) {
                const fs = u.el('div', 'sd-q', sb),
                  lg = u.el('div', 'sd-legend', fs);
                u.el('span', 'sd-num', lg, i + 1 + '.');
                u.el('span', '', lg, q);
                for (const v of opts) {
                  const row = u.el('button', 'sd-opt', fs);
                  row.type = 'button';
                  u.el('span', 'sd-radio', row);
                  u.el('span', '', row, v);
                  row.onclick = () => {
                    fs.querySelectorAll('.sd-opt').forEach((x) => x.classList.remove('on'));
                    row.classList.add('on');
                  };
                }
              }
              const send = u.el('button', 'sd-send', sb, 'Submit survey');
              send.type = 'button';
              send.onclick = () => collapse('submit');
              const scroll = u.el('div', 'sd-scroll', dr);
              scroll.setAttribute('aria-hidden', 'true');
              u.el('div', 'sd-scroll-thumb', scroll);
              return { el: dr, dismiss: close, ttlSteps: 0 };
            }
            const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
            Object.assign(_c, { el });
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
              _c.title = 'We value your opinion';
              _c.text = 'Help us improve The Daily Chronicle.';
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
        'overlay.9': (base, S) =>
          function (_c) {
            const { C } = S;
            const { box, ctx, o, u } = _c;
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
            } else {
              u.el('p', '', box, _c.text);
              if (o === 'survey') {
                const form = u.el('div', 'survey-form', box);
                for (const [i, q] of ['1. How often do you visit our site?', '2. What do you enjoy most?'].entries()) {
                  const section = u.el('fieldset', '', form);
                  u.el('legend', '', section, q);
                  for (const value of i === 0
                    ? ['Daily', 'A few times a week', 'A few times a month', 'Rarely']
                    : ['News', 'Business', 'Lifestyle', 'Opinion', 'Arts']) {
                    const label = u.el('label', 'survey-choice', section);
                    const input = u.el('input', '', label);
                    input.type = 'radio';
                    input.name = 'survey-' + i;
                    input.value = value;
                    u.el('span', '', label, value);
                  }
                }
                const send = u.el('button', 'survey-send', form, 'Submit survey');
                send.onclick = () => ctx.dismiss('feedback');
              }
            }
          },
      },
    },
  });
})();
