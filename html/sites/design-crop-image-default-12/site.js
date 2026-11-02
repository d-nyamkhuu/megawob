// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-default-12',
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'promo' },
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'sheet',
        'theme': 'soft-sheet',
        'title': '',
        'aside': '',
        'foot': '',
        'accent': '#3488ff',
        'bg': '#edf2f8',
        'surface': '#ffffff',
        'font': "system-ui, -apple-system, 'Segoe UI', Arial, sans-serif",
        'ob': 'restore',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.22': () =>
          function (_c) {
            const { content, u } = _c;
            _c.aside = u.el('aside', 'aside', content);
            for (let i = 1; i <= 10; i++) u.el('div', 'index-number', _c.aside, String(i));
          },
        'frame.23': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, head, shell, u } = _c;
            const actions = u.el('div', 'sheet-actions', footer);
            actions.dataset.role = 'crop-actions';
            if (C.layout === 'sheet') {
              const reset = u.el('button', 'clear', footer, 'Reset');
              reset.type = 'button';
              reset.onclick = () => env.widgetDef.clear?.();
            }
            const endR = ctx.rng.fork('chrome/end'),
              collideR = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const labels = ctx.content.END_LABELS.map(labelOf);
            const original = endR.bool(0.5);
            const placement = original ? 'footer' : endR.pick(['header', 'link']);
            const label = original ? 'Submit' : endR.pick(labels);
            _c.submit = null;
            if (!ctx.finish) {
              shell.classList.add('end-' + placement);
              const parent = placement === 'header' ? head : footer;
              _c.submit = u.el(
                placement === 'link' ? 'a' : 'button',
                'submit' + (placement === 'link' ? ' end-link' : ''),
                parent,
                label,
              );
              if (placement === 'link') _c.submit.href = '#';
              else _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = label;
              _c.submit.setAttribute('aria-label', label);
              _c.submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
              if (placement === 'link') footer.insertBefore(_c.submit, actions);
            }
            if (collideR.bool(0.3)) {
              const options = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
              const text = collideR.pick(options),
                decoy = u.el('button', 'sheet-xtra', actions, text);
              decoy.type = 'button';
              decoy.dataset.role = 'xtra';
              decoy.onclick = () => env.log('decoy', { label: text, collide: true });
            }
            Object.assign(_c, { actions, collideR, endR, label, labelOf, labels, original, placement });
          },
        'frame.27': () => () => {},
        'overlay.2': (base, S) =>
          function (_c) {
            const { ctx, kind, u } = _c;
            const el = u.el(
              'section',
              'obstruction obstruction-' + kind + (ctx.initial ? ' initial-obstruction' : ''),
              document.body,
            );
            Object.assign(_c, { el });
          },
        'overlay.6': (base, S) =>
          function (_c) {
            const { C } = S;
            const { kind } = _c;
            if (C.ob === 'restore') {
              _c.title = 'Layout could not be restored';
              _c.text = 'Your previous layout could not be restored.\nSome panels may be out of place.';
              _c.label = 'Use default layout';
            }
            const o = C.ob;
            if (o === 'restore') {
              /* values set above */
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
            Object.assign(_c, { o });
          },
        'overlay.7': () => () => {},
      },
    },
  });
})();
