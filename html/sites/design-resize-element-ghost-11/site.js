// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-resize-element-ghost-11',
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'banner', p: 1, at: 0 },
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'twin',
        'theme': 'magazine',
        'title': 'Manor & Blake',
        'subtitle': 'Project Workspace',
        'meta': ['Riverside Library Renovation', 'Saved 10:14 AM'],
        'aside': 'Project Proposal',
        'foot': 'Manor & Blake',
        'accent': '#b50b0b',
        'bg': '#f9f7f2',
        'surface': '#fffdf9',
        'font': 'Georgia, serif',
        'ob': 'announcement',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.meta) {
              const m = u.el('div', 'head-meta', head);
              u.el('span', '', m, C.meta[0]);
              u.el('i', '', m);
              u.el('span', '', m, C.meta[1]);
            }
            if (C.menu) u.el('nav', 'menu', head, C.menu);
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
              img.src = 'sites/' + 'design-resize-element-ghost-11' + '/mountains.png';
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
            if (C.layout === 'twin' && _c.aside) {
              u.el('div', 'art-sub', _c.aside, 'Riverside Library Renovation');
              u.el('div', 'art-date', _c.aside, 'April 24, 2008');
              u.el('hr', 'art-rule', _c.aside);
              u.el(
                'p',
                'art-lead',
                _c.aside,
                'The Riverside Library has served our community for more than fifty years. This proposal outlines a renovation plan to improve accessibility, expand reading spaces, and preserve the building’s historic character.',
              );
              u.el('h4', 'art-h', _c.aside, '1. Goals');
              const ul = u.el('ul', 'art-ul', _c.aside);
              for (const t of [
                'Improve accessibility for all visitors',
                'Create flexible reading and event spaces',
                'Preserve and highlight historic architectural features',
              ])
                u.el('li', '', ul, t);
              u.el('h4', 'art-h', _c.aside, '2. Proposed Improvements');
              u.el(
                'p',
                'art-p',
                _c.aside,
                'The renovation will include a redesigned main floor, additional study areas, and an upgraded mechanical system. Natural light and sustainable materials will be prioritized throughout the project.',
              );
              u.el('h4', 'art-h', _c.aside, '3. Next Steps');
              u.el(
                'p',
                'art-p',
                _c.aside,
                'Pending approval, we will begin detailed design in May 2008, with construction expected to start in the fall.',
              );
              const ph = u.el('div', 'pane-head', content);
              u.el('h2', '', ph, 'Comments');
              u.el('span', '', ph, '3 comments');
            }
          },
        'frame.23': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, head, u } = _c;
            if (C.layout === 'twin') {
              const pg = u.el('div', 'pager', footer);
              u.el('span', 'pg', pg, 'Page 1 of 3');
              u.el('span', 'sep', pg, '|');
              u.el('span', 'lnk', pg, '‹ Previous');
              u.el('span', 'sep', pg, '|');
              u.el('span', 'lnk', pg, 'Next ›');
            }
            const endR = ctx.rng.fork('chrome/end'),
              collideR = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endWords = ctx.content.END_LABELS.map(labelOf);
            const placement = endR.pick(['footer', 'footer', 'header', 'link']);
            const endLabel = placement === 'footer' ? 'Submit' : endR.pick(endWords);
            _c.submit = null;
            if (!ctx.finish) {
              _c.submit = u.el(
                placement === 'link' ? 'a' : 'button',
                'submit end-' + placement,
                placement === 'header' ? head : footer,
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
            if (ctx.finish || placement === 'header') footer.classList.add('no-footer-end');
            if (collideR.bool(0.3)) {
              const options = endWords.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
              if (options.length) {
                const label = collideR.pick(options),
                  decoy = u.el('button', 'end-xtra', footer, label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label, collide: true });
                footer.insertBefore(decoy, footer.querySelector('.pager'));
              }
            }
            Object.assign(_c, { collideR, endLabel, endR, endWords, labelOf, placement });
          },
        'frame.27': () => () => {},
        'overlay.2': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, kind, u } = _c;
            if (ctx.initial && C.ob === 'announcement') {
              const announcement = u.el('section', 'announcement', document.body);
              announcement.dataset.role = 'overlay';
              announcement.setAttribute('aria-label', 'Workspace announcement');
              const icon = u.svg(
                'svg',
                { class: 'announcement-icon', viewBox: '0 0 60 56', 'aria-hidden': 'true' },
                announcement,
              );
              u.svg('path', { d: 'M27 3Q30 -1 33 3L59 49Q62 55 55 55H5Q-2 55 1 49Z', fill: '#b90009' }, icon);
              u.svg('path', { d: 'M30 19V35', stroke: 'white', 'stroke-width': 5, 'stroke-linecap': 'round' }, icon);
              u.svg('circle', { cx: 30, cy: 44, r: 3, fill: 'white' }, icon);
              const copy = u.el('div', 'announcement-copy', announcement);
              u.el('h3', '', copy, 'Scheduled maintenance this Saturday, 8:00 AM – 12:00 PM (ET).');
              u.el(
                'p',
                '',
                copy,
                'During this time the workspace may be slower than usual. Your work is still being saved.',
              );
              const collapse = u.el('button', 'announcement-collapse', announcement, 'Collapse announcement');
              collapse.type = 'button';
              collapse.onclick = () => ctx.dismiss('close');
              return { el: announcement, dismiss: collapse, ttlSteps: 0 };
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
      },
    },
  });
})();
