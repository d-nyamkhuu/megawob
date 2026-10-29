// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-sort-11',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'three',
        'theme': 'industrial',
        'title': 'Acme Supply Co.',
        'menu': 'Home       Orders       Inventory       Reports       Partners       Administration',
        'aside': 'Quick Survey',
        'foot': '',
        'accent': '#a8441a',
        'bg': '#e9eef4',
        'surface': '#fff',
        'font': 'Verdana, sans-serif',
        'ob': 'survey',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.9': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            const brand = u.el('div', 'brand', head);
            u.el('div', 'title', brand, C.title);
            u.el('div', 'subtitle', brand, 'PARTNER EXTRANET');
            const who = u.el('div', 'who', head);
            const wl = u.el('div', 'who-links', who);
            u.el('span', '', wl, 'Welcome, Pat Miller');
            for (const t of ['Account', 'Help', 'Sign Out']) {
              u.el('i', '', wl, '|');
              u.el('a', '', wl, t);
            }
            u.el('div', 'who-date', who, 'May 14, 1999');
            if (C.menu) {
              const nav = u.el('nav', 'menu', head);
              for (const t of C.menu.split(/\s{2,}/)) {
                const tb = u.el('span', 'tabx' + (t === 'Inventory' ? ' cur' : ''), nav, t);
              }
            }
            Object.assign(_c, { brand, who, wl });
          },
        'frame.10': () => () => {},
        'frame.11': () => () => {},
        'frame.13': (base, S) =>
          function (_c) {
            const { ctx, shell, u } = _c;
            const er = ctx.rng.fork('chrome/end'),
              endLabels = ctx.content && ctx.content.END_LABELS;
            const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
            const labels =
              Array.isArray(endLabels) && endLabels.length
                ? endLabels.map(labelOf)
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
            const endLabel = er.pick(labels);
            const placeHash = [...String(endLabel).toLowerCase()].reduce((n, c) => n + c.charCodeAt(0), 0);
            const placement = ctx.finish ? null : ['footer', 'footer', 'header', 'link'][placeHash % 4];
            const content = u.el('div', 'content', shell),
              note = u.el('section', 'task-note', content);
            Object.assign(_c, { content, endLabel, endLabels, er, labelOf, labels, note, placeHash, placement });
          },
        'frame.15': (base, S) =>
          function (_c) {
            const { ctx, note, u } = _c;
            u.el('div', 'panel-bar bar-task', note, 'Training Task');
            const nbody = u.el('div', 'note-body', note);
            const instruction = u.el('div', 'instruction', nbody, ctx.instruction);
            u.el(
              'div',
              'sub-instr',
              nbody,
              'Drag a shape from the list below into the matching box. All shapes must be sorted.',
            );
            const tbl = u.el('div', 'stat-box', nbody);
            for (const [k, v, c] of [
              ['Task:', 'Shape Sorting'],
              ['Items to sort:', '—', 'item-total'],
              ['Status:', 'Not complete', 'task-status'],
              ['Time:', 'Ready', 'task-time'],
            ]) {
              u.el('b', '', tbl, k);
              const value = u.el('span', c || '', tbl, c === 'task-time' ? '' : v);
              if (c === 'task-time') {
                u.el('span', 'time-ready', value, 'Ready');
                u.el('span', 'time-paused', value, 'Paused (survey open)');
              }
            }
            Object.assign(_c, { instruction, nbody, tbl });
          },
        'frame.19': (base, S) =>
          function (_c) {
            const { content, u } = _c;
            u.el('div', 'panel-bar bar-shapes', content, 'Shapes');
            const stage = u.el('main', 'stage', content);
            Object.assign(_c, { stage });
          },
        'frame.22': () => () => {},
        'frame.24': (base, S) =>
          function (_c) {
            const { content, u } = _c;
            const footer = u.el('footer', 'footer', content);
            Object.assign(_c, { footer });
          },
        'frame.27': (base, S) =>
          function (_c) {
            const { ctx, endLabel, footer, head, labels, placement, u } = _c;
            const endButton = (parent, cls, tag = 'button') => {
              const b = u.el(tag, cls, parent, endLabel);
              if (tag === 'button') b.type = 'button';
              if (tag === 'a') b.href = '#';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', endLabel);
              b.title = endLabel;
              b.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
              return b;
            };
            if (!ctx.finish) {
              if (placement === 'footer') _c.submit = endButton(footer, 'submit');
              else if (placement === 'link') _c.submit = endButton(footer, 'submit submit-link', 'a');
              else _c.submit = endButton(head, 'submit header-submit');
            }
            const cr = ctx.rng.fork('chrome/collide');
            if (cr.bool(0.3)) {
              const same = (x) => x.trim().toLowerCase() === String(endLabel).trim().toLowerCase();
              const options = [...new Set(labels)].filter((x) => !same(x));
              if (options.length) {
                const d = u.el('button', 'pqs-xtra', head, cr.pick(options));
                d.type = 'button';
                d.dataset.role = 'xtra';
                d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
              }
            }
            Object.assign(_c, { cr, endButton });
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
              _c.text = 'Please take a moment to give us some feedback.';
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
                {
                  const section = u.el('fieldset', '', form);
                  u.el('legend', '', section, '1. How easy is this training task?');
                  for (const value of ['Very easy', 'Easy', 'Neutral', 'Difficult', 'Very difficult']) {
                    const label = u.el('label', 'survey-choice', section);
                    const input = u.el('input', '', label);
                    input.type = 'radio';
                    input.name = 'survey-0';
                    input.value = value;
                    u.el('span', '', label, value);
                  }
                }
                u.el('p', 'q', form, '2. What do you like most about the partner site?');
                const sel = u.el('div', 'fake-select', form);
                u.el('span', '', sel, 'Select one...');
                u.el('i', '', sel, '▼');
                u.el('p', 'q', form, '3. Additional comments (optional):');
                const comments = u.el('div', 'comment-wrap', form);
                u.el('textarea', 'survey-comment', comments);
                const scroll = u.el('div', 'comment-scroll', comments);
                u.el('span', '', scroll, '▲');
                u.el('span', '', scroll, '▼');
                const send = u.el('button', 'survey-send', form, 'Send Feedback');
                send.onclick = () => ctx.dismiss('feedback');
              }
            }
          },
        'overlay.15': (base, S) =>
          function (_c) {
            const { box, ctx, kind, o, u } = _c;
            if (o === 'survey') {
              const xb = u.el('button', 'ob-x', box, '✕');
              xb.type = 'button';
              xb.onclick = () => ctx.dismiss('close');
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
