// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-outline-12',
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'banner' },
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'notebook',
        'theme': 'os2',
        'title': 'OS/2 Image Cropper - Photo Layout',
        'menu': 'File    Edit    View    Tools    Help',
        'tabs': ['1  Crop', '2  Adjust', '3  Preview'],
        'aside': 'CROP CONTROLS',
        'foot': 'Ready',
        'accent': '#008f99',
        'bg': '#bdbdbd',
        'surface': '#d5d5d5',
        'font': 'Courier New, monospace',
      },
      parts: {
        'frame.2': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx } = _c;
            const display =
              ['panel', 'toast'].includes(ctx.display) && document.documentElement.clientWidth < 1150
                ? 'header'
                : ctx.display;
            body.className =
              'design ' + C.theme + ' layout-' + C.layout + (display === 'toast' ? ' has-instruction-toast' : '');
            body.dataset.instruction = display;
            Object.assign(_c, { display });
          },
        'frame.3': () => () => {},
        'frame.8': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk', 'os2'].includes(C.theme)) {
              const controls = u.el('div', 'window-controls', head);
              for (const label of ['−', '□', '×']) {
                const bt = u.el('button', '', controls, label);
                bt.type = 'button';
                bt.onclick = () => env.log('window-control', { label });
              }
            }
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, display, note, u } = _c;
            if (['three', 'windows', 'offset', 'sheet', 'notebook', 'rail', 'palette', 'ledger'].includes(C.layout)) {
              _c.aside = u.el('aside', 'aside', content);
              if (C.tabs) {
                _c.aside.classList.add('tabs');
                for (const text of C.tabs) {
                  const bt = u.el('button', 'tab', _c.aside);
                  u.el('span', 'tab-label', bt, text);
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
            note.hidden = display === 'hidden';
            note.classList.toggle('instruction-panel', display === 'panel');
            note.classList.toggle('instruction-toast', display === 'toast');
            if (display !== 'toast') note.querySelector('.note-close')?.remove();
          },
        'frame.23': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { ctx, footer, head, u } = _c;
            const footerTools = u.el('div', 'footer-tools', footer),
              headerTools = u.el('div', 'chrome-tools', head);
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const labels = ctx.content.END_LABELS.map(labelOf),
              er = ctx.rng.fork('chrome/end');
            const referenceEnd = er.bool(0.5),
              placement = referenceEnd ? 'footer' : er.pick(['toolbar', 'link']);
            const endLabel = referenceEnd ? 'Submit' : er.pick(labels);
            _c.submit = null;
            if (!ctx.finish) {
              const parent = placement === 'toolbar' ? headerTools : footerTools;
              _c.submit = u.el('button', 'submit end-' + placement, parent, endLabel);
              _c.submit.type = 'button';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.dataset.role = 'submit';
              _c.submit.onclick = () => ctx.submit();
            }
            const cr = ctx.rng.fork('chrome/collide');
            if (cr.bool(0.3)) {
              const pool = labels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
              if (pool.length) {
                const label = cr.pick(pool),
                  decoy = u.el('button', 'chrome-xtra', headerTools, label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label, collide: true });
              }
            }
            Object.assign(_c, { cr, endLabel, er, footerTools, headerTools, labelOf, labels, placement, referenceEnd });
          },
        'frame.27': () => () => {},
        'overlay.7': (base, S) =>
          function (_c) {
            const { C } = S;
            const { kind, o } = _c;
            if (C.theme === 'os2') {
              _c.title = 'OS/2 Workplace Shell';
              _c.text =
                'Unsaved layout changes\nYou have unsaved layout changes.\nDo you want to continue without saving?';
              _c.label = 'Continue without saving';
            } else if (o === 'update') {
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
            if (C.theme === 'os2') {
              const cancel = u.el('button', 'dismiss cancel', box, 'Cancel');
              cancel.type = 'button';
              cancel.onclick = () => ctx.dismiss('close');
            }
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
                      : 'M32 4L54 14V30Q54 49 32 59Q10 49 10 30V14ZM22 30L29 37L44 21',
                },
                icon,
              );
            }
          },
      },
    },
  });
})();
