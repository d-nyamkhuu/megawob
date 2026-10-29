// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-set-slider-multi-11',
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'banner' },
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'stack',
        'theme': 'riscos',
        'title': 'RISC OS',
        'subtitle': 'Image Adjuster',
        'foot': 'Apps       Files       Discs       Paint       Image Adjuster       Edit       Help',
        'accent': '#555',
        'bg': '#c0c0c0',
        'surface': '#c0c0c0',
        'font': 'monospace',
        'ob': 'announcement',
      },
      parts: {
        'frame.3': (base, S) =>
          function (_c) {
            const { ctx } = _c;
            const er = ctx.rng.fork('chrome/end'),
              cr = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endWords = ctx.content.END_LABELS.map(labelOf);
            const referenceEnd = er.bool(0.5);
            const endPlacement = referenceEnd ? 'footer' : er.pick(['header', 'link']);
            const endLabel = referenceEnd ? 'Submit' : er.pick(endWords);
            Object.assign(_c, { cr, endLabel, endPlacement, endWords, er, labelOf, referenceEnd });
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
              img.src = 'sites/' + 'design-set-slider-multi-11' + '/mountains.png';
              img.alt = 'Alpine mountains reflected in a lake';
            }
            u.el('div', 'note-label', note, 'Adjust Image Settings');
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
        'frame.25': (base, S) =>
          function (_c) {
            const { footer, u } = _c;
            const bar = u.el('div', 'footer-copy iconbar', footer);
            {
              const P = {
                Apps: `<path d="M17 6V2H23V6L30 10L33 19V24H29V32L24 39L20 41L16 39L11 32V24H7V19L10 10Z" fill="#009300" stroke="#111" stroke-width="1.5"/><path d="M11 24H29V30L24 37L19 40L13 33Z" fill="#00bd00"/><path d="M9 19H31M11 14H29M16 9V23M21 8V23M26 11V23" stroke="#111" stroke-width="1.6" stroke-dasharray="1.5 1.5"/>`,
                Files: `<path d="M9 3H31L35 6V37H31" fill="#999" stroke="#111" stroke-width="1.5"/><rect x="7" y="4" width="25" height="33" fill="#bcbcbc" stroke="#111" stroke-width="1.5"/><path d="M9 36V6H29" fill="none" stroke="#fff" stroke-width="1.5"/><path d="M11 11H28M11 16H28M11 21H28M11 26H28M11 31H28" stroke="#666" stroke-width="2"/>`,
                Discs: `<rect x="4" y="5" width="32" height="32" rx="1" fill="#bbb" stroke="#111" stroke-width="1.5"/><path d="M5 7H34M5 17H34M5 27H34" stroke="#fff"/><path d="M4 16H36M4 26H36" stroke="#111" stroke-width="1.5"/><path d="M15 11H25M15 21H25M15 31H25" stroke="#111" stroke-width="2"/><path d="M7 8V14M7 18V24M7 28V35" stroke="#eee" stroke-width="2"/>`,
                Paint: `<path d="M5 27Q3 15 17 8Q30 4 35 10L34 21L27 34Q23 40 18 35L17 30Z" fill="#ddd" stroke="#111" stroke-width="1.5"/><circle cx="12" cy="25" r="3" fill="#305af0"/><circle cx="13" cy="17" r="3" fill="#39aa24"/><circle cx="22" cy="12" r="3" fill="#65c82c"/><circle cx="24" cy="29" r="3" fill="#ffd931"/><path d="M19 32L29 14L33 15L23 34Z" fill="#f6d02a" stroke="#777"/><path d="M29 14L32 8L36 10L33 17Z" fill="#f23a22" stroke="#111"/>`,
                'Image Adjuster': `<rect x="4" y="6" width="32" height="30" fill="#bbb" stroke="#111" stroke-width="1.5"/><path d="M6 34V8H34" fill="none" stroke="#fff" stroke-width="1.5"/><rect x="9" y="11" width="22" height="20" fill="#7ca9df" stroke="#111" stroke-width="1.5"/><path d="M10 30V24L15 18L20 24L24 22L30 28V30Z" fill="#60a439" stroke="#111" stroke-width=".7"/><circle cx="26" cy="15" r="1.8" fill="#fff"/>`,
                Edit: `<path d="M7 6H33V36H7Z" fill="#bbb" stroke="#111" stroke-width="1.5"/><path d="M9 34V8H31" fill="none" stroke="#fff" stroke-width="1.5"/><path d="M10 3V10M15 3V10M20 3V10M25 3V10M30 3V10" stroke="#111" stroke-width="2"/><path d="M10 3H12M15 3H17M20 3H22M25 3H27M30 3H32" stroke="#eee"/><path d="M11 14H29M11 20H29M11 26H29M11 31H29" stroke="#666" stroke-width="1.5"/>`,
                Help: `<rect x="5" y="6" width="30" height="30" fill="#bbb" stroke="#111" stroke-width="1.5"/><path d="M7 34V8H33" fill="none" stroke="#fff" stroke-width="1.5"/><text x="20" y="32" font-size="29" font-weight="bold" text-anchor="middle" fill="#172bc5" font-family="monospace">?</text>`,
              };
              for (const n of Object.keys(P)) {
                const ib = u.el('div', 'ib' + (n === 'Image Adjuster' ? ' on' : ''), bar);
                const ic = u.el('div', 'ib-icon', ib);
                ic.innerHTML = '<svg width="100%" height="100%" viewBox="0 0 40 40">' + P[n] + '</svg>';
                u.el('div', 'ib-label', ib, n);
              }
              u.el('div', 'ib-sep', bar);
            }
            Object.assign(_c, { bar });
          },
        'frame.28': (base, S) =>
          function (_c) {
            const { C } = S;
            const { bar, cr, ctx, endLabel, endPlacement, endWords, footer, head, u } = _c;
            if (_c.submit) {
              _c.submit.textContent = endLabel;
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.classList.add('end-' + endPlacement);
              if (endPlacement !== 'footer') head.append(_c.submit);
            }
            const alternatives = endWords.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
            if (cr.bool(0.3) && alternatives.length) {
              const label = cr.pick(alternatives),
                decoy = u.el('button', 'chrome-xtra' + (endPlacement === 'header' ? ' xtra-right' : ''), head, label);
              decoy.type = 'button';
              decoy.dataset.role = 'xtra';
              decoy.onclick = () => env.log('decoy', { label, collide: true });
            }
            if (ctx.finish || endPlacement !== 'footer') bar.querySelector('.ib-sep').hidden = true;
            if (C.theme === 'eink') {
              const points = u.el('span', 'points', footer, 'Points: 0/1');
              footer.insertBefore(points, _c.submit);
              const clear = u.el('button', 'clear', footer, 'Clear');
              clear.onclick = () => {
                env.widgetDef.clear?.();
              };
            }
            Object.assign(_c, { alternatives });
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
              _c.title = 'Important Notice';
              _c.text =
                'A new version of Image Adjuster is available.\nPlease read the release notes before continuing.';
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
