// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-set-slider-vertical-11',
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'cookie', p: 1, at: 0 },
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'ledger',
        'theme': 'vista',
        'title': 'Image Adjuster',
        'menu': 'File    Edit    View    Tools    Help',
        'aside': 'Preview',
        'foot': '14 items      |      1 item selected (2.7 MB)',
        'accent': '#2386ca',
        'bg': '#dcebf9',
        'surface': '#fff',
        'font': 'Arial, sans-serif',
        'ob': 'privacy',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.10': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.theme === 'vista') {
              const ft = document.createElement('span');
              ft.className = 'stage-title';
              ft.textContent = 'Adjustments';
            }
            if (C.subtitle) u.el('div', 'subtitle', head, C.subtitle);
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
                'Autumn',
                '',
              ];
              for (let i = 0; i < (C.theme === 'vista' ? 16 : 8); i++) {
                const tr = u.el('tr', C.theme === 'vista' && i === 7 ? 'sel' : '', table);
                for (const value of C.theme === 'vista'
                  ? [
                      files[i] ? files[i] + '.jpg' : '',
                      [
                        '2024-08-12 10:24',
                        '2024-08-12 11:03',
                        '2024-08-11 09:17',
                        '2024-08-10 14:52',
                        '2024-08-09 16:20',
                        '2024-08-08 10:11',
                        '2024-08-07 13:44',
                        '2024-08-06 15:36',
                        '2024-08-05 12:44',
                        '2024-08-04 12:28',
                        '2024-08-03 12:34',
                        '2024-08-02 12:00',
                        '2024-08-01 12:01',
                        '2024-07-31 12:33',
                        '2024-07-30 12:06',
                        '',
                      ][i],
                      [
                        '2.4 MB',
                        '3.1 MB',
                        '2.8 MB',
                        '2.2 MB',
                        '3.4 MB',
                        '2.9 MB',
                        '2.1 MB',
                        '2.7 MB',
                        '2.5 MB',
                        '3.2 MB',
                        '2.6 MB',
                        '2.3 MB',
                        '1.9 MB',
                        '3.0 MB',
                        '2.4 MB',
                        '3.0 MB',
                      ][i],
                      'JPEG image',
                      'Ready',
                    ]
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
                    ]) {
                  const td = u.el('td', '', tr, value);
                  if (C.theme === 'vista' && String(value).endsWith('.jpg')) {
                    const ic = document.createElement('i');
                    ic.className = 'fico';
                    td.prepend(ic);
                  }
                }
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
              img.src = 'sites/' + 'design-set-slider-vertical-11' + '/mountains.png';
              img.alt = 'Alpine mountains reflected in a lake';
            }
            u.el('div', 'note-label', note, C.layout === 'left' ? 'Task' : '');
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, head, shell, u } = _c;
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
            const er = ctx.rng.fork('chrome/end'),
              cr = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const referenceEnd = er.bool(0.5),
              endPlace = referenceEnd ? 'adjustments' : er.pick(['toolbar', 'footer']);
            const endLabel = referenceEnd ? 'Submit' : er.pick(endLabels);
            const footer = u.el('footer', 'footer', shell);
            const foot = u.el('div', 'footer-copy', footer, C.foot || '');
            if (C.theme === 'vista') {
              foot.textContent = '';
              u.el('span', 'footer-count', foot, '14 items');
              u.el('span', 'footer-selection', foot, '1 item selected (2.7 MB)');
            }
            _c.submit = null;
            if (!ctx.finish) {
              const parent = endPlace === 'toolbar' ? head.querySelector('.menu') : footer;
              _c.submit = u.el('button', 'submit end-' + endPlace, parent, endLabel);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.onclick = () => ctx.submit();
            }
            if (cr.bool(0.3)) {
              const choices = endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
              if (choices.length) {
                const label = cr.pick(choices),
                  decoy = u.el('button', 'chrome-xtra', head.querySelector('.menu'), label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label, collide: true });
              }
            }
            Object.assign(_c, { cr, endLabel, endLabels, endPlace, er, foot, footer, labelOf, referenceEnd });
          },
        'frame.23': () => () => {},
        'frame.24': () => () => {},
        'frame.25': () => () => {},
        'frame.26': () => () => {},
        'frame.27': () => () => {},
        'frame.30': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, endPlace, note, stage, u } = _c;
            if (C.theme === 'vista') {
              const adj = u.el('section', 'adj-pane', content);
              u.el('h3', 'pane-head', adj, 'Adjustments');
              adj.append(stage, note);
              if (_c.submit && endPlace === 'adjustments') adj.append(_c.submit);
              if (_c.aside) {
                const pv = u.el('div', 'prev-img', _c.aside);
                const photo = u.el('img', '', pv);
                photo.src = 'sites/design-set-slider-vertical-11/assets/preview.webp';
                photo.alt = 'Domed stone building framed by trees';
              }
            }
            return { stage, submit: _c.submit };
          },
        'overlay.7': (base, S) =>
          function (_c) {
            const { kind, o } = _c;
            if (o === 'update') {
              _c.title = 'A new version is available';
              _c.text = 'Get the latest features and security fixes.';
              _c.label = 'Remind me later';
            } else if (o === 'privacy') {
              _c.title = "We'd like your consent";
              _c.text =
                'We use optional analytics to help improve Image Adjuster.\nThis may include information about how you use the app,\nsuch as features you adjust and general performance data.\nNo personal files are shared.';
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
        'overlay.10': (base, S) =>
          function (_c) {
            const { box, o, u } = _c;
            if (o === 'privacy') {
              const opts = u.el('div', 'consent-opts', box);
              for (const [t, on] of [
                ['Allow optional analytics (recommended)', true],
                ['Show this message at startup', false],
              ]) {
                const r = u.el('div', 'consent-opt', opts);
                const cb = u.el('button', 'consent-cb' + (on ? ' on' : ''), r, on ? '✓' : '');
                cb.type = 'button';
                cb.setAttribute('role', 'checkbox');
                cb.setAttribute('aria-label', t);
                cb.setAttribute('aria-checked', String(on));
                cb.onclick = () => {
                  const checked = cb.getAttribute('aria-checked') !== 'true';
                  cb.setAttribute('aria-checked', String(checked));
                  cb.classList.toggle('on', checked);
                  cb.textContent = checked ? '✓' : '';
                };
                u.el('span', '', r, t);
              }
              u.el('a', 'consent-learn', box, 'Learn more…');
            }
            if (o === 'tips') {
              const label = u.el('label', 'tip-option', box);
              const input = u.el('input', '', label);
              input.type = 'checkbox';
              u.el('span', '', label, 'Do not show again');
            }
          },
        'overlay.13': (base, S) =>
          function (_c) {
            const { box, ctx, dismiss, o } = _c;
            if (o === 'privacy') {
              const tb = document.createElement('div');
              tb.className = 'ob-titlebar';
              tb.textContent = 'Your Privacy Matters';
              const xb = document.createElement('button');
              xb.type = 'button';
              xb.setAttribute('aria-label', 'Close privacy dialog');
              xb.onclick = () => ctx.dismiss('close');
              xb.className = 'ob-x';
              xb.textContent = '✕';
              tb.append(xb);
              box.prepend(tb);
            }
            dismiss.type = 'button';
          },
        'overlay.15': (base, S) =>
          function (_c) {
            const { box, ctx, kind, o, u } = _c;
            if (o === 'privacy' || (kind === 'cookie' && !o)) {
              const accept = u.el('button', 'dismiss accept', box, o === 'privacy' ? 'Accept' : 'Accept optional');
              accept.onclick = () => ctx.dismiss('accept');
            }
          },
      },
    },
  });
})();
