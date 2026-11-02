// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-reorder-items-list-12',
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'banner' },
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'left',
        'theme': 'memphis',
        'title': 'List Organizer',
        'foot': '',
        'accent': '#ff867b',
        'bg': '#fbf5e8',
        'surface': '#fbf5e8',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, note, shell, u } = _c;
            if (ctx.display === 'panel' && C.theme === 'memphis') {
              const heading = note.querySelector('.brief-title');
              heading.classList.add('panel-title');
              shell.append(heading);
            }
            const stage = u.el('main', 'stage', content);
            Object.assign(_c, { stage });
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, shell, u } = _c;
            if (C.theme === 'memphis') {
              if (ctx.display === 'header' || ctx.display === 'panel')
                u.el('div', 'workspace-instruction', shell, ctx.instruction);
              const decor = u.svg(
                'svg',
                { class: 'memphis-art', viewBox: '0 0 1672 941', preserveAspectRatio: 'none', 'aria-hidden': 'true' },
                shell,
              );
              const defs = u.svg('defs', {}, decor);
              const coral = u.svg('linearGradient', { id: 'memphis-coral', x1: '0', y1: '0', x2: '1', y2: '1' }, defs);
              u.svg('stop', { offset: '0', 'stop-color': '#ff8479' }, coral);
              u.svg('stop', { offset: '1', 'stop-color': '#ff9083' }, coral);
              const lilac = u.svg('linearGradient', { id: 'memphis-lilac', x1: '0', y1: '0', x2: '1', y2: '1' }, defs);
              u.svg('stop', { offset: '0', 'stop-color': '#bba5fb' }, lilac);
              u.svg('stop', { offset: '1', 'stop-color': '#b79ef6' }, lilac);
              u.svg('path', { d: 'M39 52H119', stroke: '#b9a1f7', 'stroke-width': 11 }, decor);
              u.svg('path', { d: 'M0 685L160 620L74 839L0 758Z', fill: 'url(#memphis-coral)' }, decor);
              u.svg('circle', { cx: 308, cy: 791, r: 79, fill: 'url(#memphis-lilac)' }, decor);
              u.el('div', 'bz-window', shell);
              const side = u.el('nav', 'bz-side', shell);
              const logo = u.el('div', 'bz-logo', side);
              u.el('i', '', logo);
              const lt = u.el('b', '', logo, 'Task');
              u.el('em', '', lt, 'Flow');
              const navs = [
                ['Tasks', 'M5 4h15v3H5ZM5 11h15v3H5ZM5 18h15v3H5Z'],
                ['My Work', 'M3 3h18v18H3ZM7 12l4 4 7-8'],
                ['Notes', 'M3 2h18v20H3ZM7 7h10M7 12h10M7 17h6'],
                [
                  'Settings',
                  'M10 1h4l1 4 3-2 3 3-2 3 4 1v4l-4 1 2 3-3 3-3-2-1 4h-4l-1-4-3 2-3-3 2-3-4-1v-4l4-1-2-3 3-3 3 2ZM16.5 12a4.5 4.5 0 1 0-9 0 4.5 4.5 0 0 0 9 0Z',
                ],
              ];
              for (const [i, [name, d]] of navs.entries()) {
                const it = u.el('div', 'bz-nav' + (i === 0 ? ' on' : ''), side);
                const sv = u.svg(
                  'svg',
                  {
                    width: 36,
                    height: 36,
                    viewBox: '0 0 24 24',
                    fill: i === 0 || i === 3 ? 'currentColor' : 'none',
                    stroke: i === 0 || i === 3 ? 'none' : 'currentColor',
                    'stroke-width': 1.8,
                    'fill-rule': 'evenodd',
                  },
                  it,
                );
                u.svg('path', { d }, sv);
                u.el('span', '', it, name);
              }
              const pal = u.el('aside', 'bz-pal', shell);
              const ph = u.el('div', 'bz-pal-h', pal);
              const bulb = u.svg('svg', { class: 'bz-bulb', viewBox: '0 0 24 32', 'aria-hidden': 'true' }, ph);
              u.svg(
                'path',
                { d: 'M12 1a10 10 0 0 0-7 17c2 2 2 3 2 5h10c0-2 0-3 2-5A10 10 0 0 0 12 1Z', fill: '#eb2428' },
                bulb,
              );
              u.svg('path', { d: 'M8 25h8M9 28h6M10 30h4', stroke: '#111', 'stroke-width': 2 }, bulb);
              u.el('b', '', ph, 'Quick Tips');
              u.el('span', '', ph, '×');
              const ul = u.el('ul', '', pal);
              for (const t of [
                'Drag the items using the handle on the left.',
                'Arrange from A to Z.',
              ])
                u.el('li', '', ul, t);
              u.svg('circle', { cx: 1488, cy: -46, r: 118, fill: 'url(#memphis-lilac)' }, decor);
              for (let row = 0; row < 4; row++)
                for (let col = 0; col < 4; col++)
                  u.svg('circle', { cx: 1588 + col * 21, cy: 54 + row * 20, r: 2.8, fill: '#10103b' }, decor);
              const dots = u.svg('g', { transform: 'rotate(29 127 830)', fill: '#b79ff8' }, decor);
              for (let row = 0; row < 6; row++)
                for (let col = 0; col < 3; col++)
                  u.svg('circle', { cx: 102 + col * 24, cy: 767 + row * 25, r: 4.2 }, dots);
              u.svg(
                'path',
                {
                  d: 'M1491 127Q1526 103 1528 135T1561 155T1582 174T1614 185T1633 214',
                  fill: 'none',
                  stroke: 'url(#memphis-coral)',
                  'stroke-width': 14,
                  'stroke-linecap': 'round',
                },
                decor,
              );
              u.svg(
                'path',
                {
                  d: 'M1295 76L1318 63M1298 97L1325 100M1291 116L1310 134',
                  fill: 'none',
                  stroke: '#ff867b',
                  'stroke-width': 9,
                  'stroke-linecap': 'round',
                },
                decor,
              );
            }
          },
        'frame.27': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, note, shell, u } = _c;
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const endRng = ctx.rng.fork('chrome/end'),
              collideRng = ctx.rng.fork('chrome/collide');
            const endForm = endRng.pick(['footer', 'header', 'link', 'footer']);
            const referenceEnd = endForm === 'footer';
            const endLabel = referenceEnd ? 'Submit' : endRng.pick(endLabels.filter((x) => x !== 'Submit'));
            if (!ctx.finish) {
              const parent = C.layout === 'three' && _c.aside ? _c.aside : footer;
              footer.classList.add('end-' + endForm);
              _c.submit = u.el('button', 'submit', parent, endLabel);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.onclick = () => ctx.submit();
            }
            const completionTip = shell.querySelector('.completion-tip');
            if (completionTip)
              completionTip.textContent = ctx.finish
                ? 'Finish when you’re done.'
                : `Click ${endLabel} when you’re done.`;
            if (collideRng.bool(0.3)) {
              const label = collideRng.pick(endLabels.filter((x) => x !== endLabel));
              const actions = u.el('div', 'chrome-xtras', ctx.display === 'panel' ? note : shell);
              const decoy = u.el('button', 'xtra-end', actions, label);
              decoy.type = 'button';
              decoy.onclick = () => env.log('decoy', { label, collide: true });
            }
            Object.assign(_c, {
              collideRng,
              completionTip,
              endForm,
              endLabel,
              endLabels,
              endRng,
              labelOf,
              referenceEnd,
            });
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
                banner: 'Unsaved layout changes',
              }[kind];
              _c.text = {
                cookie: 'This application stores optional cookies.',
                toast: 'Your changes have been saved.',
                chat: 'Need a hand with this workspace?',
                promo: 'Explore the latest workspace features.',
                banner:
                  'You have unsaved changes to this task. If you continue, your changes will still be kept, but they won’t be saved to your workspace.',
              }[kind];
              _c.label =
                kind === 'cookie' ? 'Reject optional' : kind === 'banner' ? 'Continue without saving' : 'Close';
            }
          },
        'overlay.15': (base, S) =>
          function (_c) {
            const { box, ctx, kind, o, u } = _c;
            if (kind === 'banner') {
              const bx = u.el('button', 'bz-x', box, '×');
              bx.type = 'button';
              bx.onclick = () => ctx.dismiss('close');
            }
            if (o === 'privacy' || (kind === 'cookie' && !o)) {
              const accept = u.el('button', 'dismiss', box, 'Accept optional');
              accept.onclick = () => ctx.dismiss('accept');
            }
          },
      },
    },
  });
})();
