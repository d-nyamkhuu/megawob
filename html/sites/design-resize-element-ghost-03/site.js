(function () {
  'use strict';
  const C = {
    'layout': 'ledger',
    'theme': 'aero',
    'title': 'ClearWork',
    'menu': 'Home       Ledger       Files       Contacts       Tools',
    'foot': 'ClearWork',
    'accent': '#54a636',
    'bg': '#eefaff',
    'surface': '#fff',
    'font': 'Arial, sans-serif',
  };
  env.site({
    name: 'design-resize-element-ghost-03',
    styles: ['quiet.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className =
        'design quiet display-' + ctx.display + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const shell = u.el('div', 'qshell', body),
        main = u.el('div', 'qmain', shell);
      const eyebrow = u.el('div', 'q-eyebrow', main, 'CANVAS');
      const note = u.el('section', 'task-note', main);
      u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.onclick = () => (note.style.visibility = 'hidden');
      }
      const sub = u.el(
        'p',
        'q-sub',
        main,
        "Resize the panel by dragging the bottom-right corner handle. The panel's width and height should match the dashed outline.",
      );
      if (ctx.display === 'hidden') sub.hidden = true;
      const frame = u.el('div', 'q-frame', main),
        stage = u.el('main', 'stage', frame);
      stage.dataset.role = 'stage';
      u.el('span', 'q-work', frame, 'Work area');
      u.el('span', 'q-tgt', frame, 'Target size').dataset.tgt = 'label';
      const aside = u.el('aside', 'q-aside', shell);
      u.el('h2', 'q-title', aside, 'Inspector');
      for (const [head, key] of [
        ['Size (current)', 'cur'],
        ['Target size', 'tgt'],
      ]) {
        u.el('h3', '', aside, head);
        for (const [label, k] of [
          ['Width', 'w'],
          ['Height', 'h'],
        ]) {
          const r = u.el('div', 'q-row', aside);
          u.el('span', '', r, label);
          const f = u.el('span', 'q-field', r);
          f.dataset[key] = k;
        }
        u.el('hr', '', aside);
      }
      const guideTitle = u.el('h3', 'q-guide-title', aside, 'Instructions');
      guideTitle.hidden = ctx.display === 'hidden';
      if (ctx.display === 'panel') {
        const card = u.el('div', 'episode-instruction', aside, ctx.instruction);
        card.setAttribute('aria-label', 'Instructions');
      }
      const ol = u.el('ol', 'q-steps', aside);
      ol.hidden = ctx.display === 'hidden';
      for (const [i, t] of [
        'Drag the bottom-right corner of the panel.',
        'Match the dashed outline (±3 px).',
        'Finish when the sizes match.',
      ].entries()) {
        const li = u.el('li', '', ol, t);
        li.dataset.guide = String(i);
      }
      const er = ctx.rng.fork('chrome/end');
      const placement = ctx.finish ? null : er.pick(['aside', 'aside', 'header', 'link']);
      const rawLabels =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labels = rawLabels.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      const alternateLabel = er.bool(0.5) ? 'Submit' : er.pick(labels);
      const label = placement === 'aside' ? 'Submit' : alternateLabel;
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(0.3)) {
        const pool = labels.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
        const options = [...new Set(pool)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) collide = cr.pick(options);
      }
      const addDecoy = (parent, text) => {
        const b = u.el('button', 'q-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', { label: text, collide: true });
        return b;
      };
      if (collide && !ctx.finish && placement !== 'header') {
        const decoy = addDecoy(eyebrow, collide);
        decoy.classList.add('q-toolbar-xtra');
      }
      let submit = null;
      if (placement === 'header') {
        const b = u.el('button', 'q-header-action', eyebrow, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.onclick = () => ctx.submit();
        submit = b;
        if (collide && !ctx.finish) addDecoy(eyebrow, collide);
      } else if (placement === 'link') {
        const a = u.el('a', 'q-link-action', aside, label + ' ›');
        a.href = '#';
        a.dataset.role = 'submit';
        a.setAttribute('aria-label', label);
        a.title = label;
        a.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
        submit = a;
      } else if (!ctx.finish) {
        submit = u.el('button', 'submit', aside, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.onclick = () => ctx.submit();
      }
      return { stage, submit };
    },
    _oldFrame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className =
        'design ' + C.theme + ' layout-' + C.layout + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.surface,
        fg: C.theme === 'developer' ? '#eff4ff' : '#111820',
        muted: C.theme === 'developer' ? '#8b9aaf' : '#657080',
        line: C.theme === 'developer' ? '#283544' : '#c9cfd5',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', body),
        head = u.el('header', 'head', shell);
      if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk'].includes(C.theme)) {
        const controls = u.el('div', 'window-controls', head);
        for (const label of ['−', '□', '×']) {
          const bt = u.el('button', '', controls, label);
          bt.type = 'button';
          bt.onclick = () => env.log('window-control', { label });
        }
      }
      if (C.title) u.el('div', 'title', head, C.title);
      if (C.subtitle) u.el('div', 'subtitle', head, C.subtitle);
      if (C.menu) {
        const nav = u.el('nav', 'menu', head);
        for (const label of ['Home', 'Ledger', 'Files', 'Contacts', 'Tools'])
          u.el('span', label === 'Ledger' ? 'selected' : '', nav, label);
      }
      const search = u.el('div', 'header-search', head);
      u.el('span', 'search-icon', search);
      u.el('span', '', search, 'Search');
      const account = u.el('div', 'header-account', head);
      u.el('span', 'account-icon', account);
      u.el('span', '', account, 'Alex Chen');
      u.el('span', '', account, '▾');
      if (C.ribbon) {
        const rib = u.el('div', 'ribbon', head);
        const tool = (parent, name, path) => {
          const bt = u.el('button', 'tool', parent);
          bt.type = 'button';
          const icon = u.svg(
            'svg',
            { width: 32, height: 34, viewBox: '0 0 32 32', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.8 },
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
      const content = u.el('div', 'content', shell),
        note = u.el('section', 'task-note', content);
      u.el('div', 'note-label', note, C.layout === 'left' ? 'Task' : '');
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      if (C.theme === 'memphis') {
        u.el('h1', 'brief-title', note, C.title);
        note.prepend(note.lastChild);
        u.el(
          'p',
          'brief-copy',
          note,
          'Drag and drop the months on the right to arrange them from January to December.',
        );
      }
      if (C.theme === 'minimal') {
        const steps = u.el('ol', 'steps', note);
        for (const text of [
          'Drag the shape from its current position.',
          'Drop it inside the rectangular box.',
          'The shape must fit fully inside the box.',
        ])
          u.el('li', '', steps, text);
        u.el('h3', '', note, 'Notes');
        u.el(
          'p',
          'brief-copy',
          note,
          'Use your mouse or trackpad (pointer) to move the shape. Do not resize the shape.',
        );
      }
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const ledger = u.el('section', 'resize-ledger', content);
      const ledgerHead = u.el('div', 'ledger-head', ledger);
      const ledgerTitle = u.el('h2', '', ledgerHead);
      const chart = u.el('span', 'ledger-chart', ledgerTitle);
      for (let i = 0; i < 4; i++) u.el('i', '', chart);
      u.el('span', '', ledgerTitle, 'Ledger');
      const period = u.el('button', 'ledger-period', ledgerHead, 'This Month');
      const add = u.el('button', 'ledger-add', ledgerHead, 'Add Transaction');
      add.onclick = () => env.log('ledger-add');
      const table = u.el('table', '', ledger);
      const tr = u.el('tr', '', table);
      for (const v of ['Date', 'Description', 'Category', 'Amount', 'Status']) u.el('th', '', tr, v);
      for (const [i, values] of [
        ['Office Supplies', 'Business', '-$48.20'],
        ['Client Payment - Rivera', 'Income', '$1,250.00'],
        ['Cloud Hosting', 'Software', '-$32.00'],
        ['Travel - Train', 'Travel', '-$86.50'],
        ['Design Contract', 'Income', '$980.00'],
        ['Team Lunch', 'Meals', '-$54.30'],
        ['Domain Renewal', 'Software', '-$18.00'],
        ['Client Payment - Park', 'Income', '$640.00'],
      ].entries()) {
        const row = u.el('tr', '', table);
        for (const [j, v] of ['Jun ' + String(i + 1).padStart(2, '0') + ', 2025', ...values, 'Posted'].entries()) {
          const td = u.el('td', '', row, v);
          if (j === 4) td.className = 'posted';
          if (j === 3) td.style.color = v.startsWith('-') ? '#d90042' : '#008020';
        }
      }
      const stage = u.el('main', 'stage', content);
      stage.dataset.role = 'stage';
      let aside = null;
      if (['three', 'windows', 'offset', 'sheet', 'notebook', 'rail', 'palette', 'ledger'].includes(C.layout)) {
        aside = u.el('aside', 'aside', content);
        if (C.tabs) {
          aside.classList.add('tabs');
          for (const text of C.tabs) {
            const bt = u.el('button', 'tab', aside, text);
            bt.type = 'button';
            bt.onclick = () => {
              aside.querySelectorAll('.tab').forEach((x) => x.classList.remove('active'));
              bt.classList.add('active');
            };
          }
        } else if (C.layout === 'sheet') {
          for (let i = 1; i <= 20; i++) u.el('div', 'index-number', aside, String(i));
        } else if (C.layout === 'offset') {
          for (const text of ['Select', 'Zoom In', 'Zoom Out', 'Pan']) u.el('button', 'map-tool', aside, text);
        } else {
          const previewHead = u.el('h3', '', aside);
          const miniFile = u.svg(
            'svg',
            { class: 'mini-file', viewBox: '0 0 24 28', fill: 'none', stroke: '#d8f4ff', 'stroke-width': 1.5 },
            previewHead,
          );
          u.svg('path', { d: 'M3 2H14L21 9V26H3ZM14 2V10H21M7 15H17M7 18H17M7 21H14' }, miniFile);
          u.el('span', '', previewHead, 'Document Preview');
          u.el('span', 'preview-controls', previewHead, '−　□　×');
          const previewBody = u.el('div', 'preview-body', aside);
          const file = u.svg(
            'svg',
            { class: 'file-icon', viewBox: '0 0 50 60', fill: 'none', stroke: '#7194bc', 'stroke-width': 3.5 },
            previewBody,
          );
          u.svg('path', { d: 'M7 3H31L45 17V56H7ZM31 3V18H45M15 29H37M15 36H37M15 43H31' }, file);
          const details = u.el('div', 'preview-details', previewBody);
          u.el('strong', '', details, 'Project Plan.pdf');
          u.el('p', '', details, '2.4 MB • Modified Jun 6, 2025');
          u.el('button', '', previewBody, 'Open');
          if (C.aside === 'Your Answer') {
            u.el('p', '', aside, 'No point selected yet.');
            u.el('hr', '', aside);
            u.el('p', '', aside, 'X:    —');
            u.el('p', '', aside, 'Y:    —');
          } else if (C.aside === 'Progress') {
            u.el('p', '', aside, 'Problem 1 of 5');
            u.el('progress', '', aside).value = 0.2;
            u.el('h3', '', aside, 'Tips');
            u.el('p', '', aside, 'Click outside the dotted circle.');
          } else if (C.layout === 'windows') u.el('p', '', aside, ctx.instruction);
          else if (C.theme === 'crop-minimal') u.el('p', '', aside, 'Drag the handles to resize the crop box.');
          else if (C.layout === 'palette') {
            const ol = u.el('ol', 'guide', aside);
            for (const t of [
              'Drag each handle to the target value.',
              'Keep the lower value on the left and the higher value on the right.',
              'Do not click on the track.',
            ])
              u.el('li', '', ol, t);
          }
        }
      }
      const footer = u.el('footer', 'footer', shell);
      u.el('div', 'footer-copy', footer, C.foot || '');
      let submit = null;
      if (!ctx.finish) {
        const parent = C.layout === 'three' && aside ? aside : footer;
        submit = u.el('button', 'submit', parent, 'Submit');
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.onclick = () => ctx.submit();
      }
      if (C.theme === 'eink') {
        const points = u.el('span', 'points', footer, 'Points: 0/1');
        footer.insertBefore(points, submit);
        const clear = u.el('button', 'clear', footer, 'Clear');
        clear.onclick = () => {
          env.widgetDef.clear?.();
        };
      }
      if (['aqua', 'collage'].includes(C.theme)) {
        const reset = u.el('button', 'clear', footer, C.theme === 'aqua' ? 'Reset Panel' : 'Reset');
        reset.onclick = () => env.widgetDef.clear?.();
        if (submit) footer.insertBefore(reset, submit);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      let title, text, label;
      const o = C.ob;
      if (o === 'update') {
        title = 'A new version is available';
        text = 'Get the latest features and security fixes.';
        label = 'Remind me later';
      } else if (o === 'privacy') {
        title = 'We’d like your consent';
        text =
          'We use optional analytics to improve this application. You can change this setting at any time in the Options menu.';
        label = 'Reject optional';
      } else if (o === 'tips') {
        title = 'Tip of the day';
        text = 'The midpoint is the point that is the same distance from both marked points.';
        label = 'Close';
      } else if (o === 'newsletter') {
        title = 'Stay in the loop';
        text = 'Get occasional tips, practice problems, and feature updates.';
        label = 'Close';
      } else if (o === 'notifications') {
        title = 'Notifications (5)';
        text = 'Software Update Available\nDisk Almost Full\nTip of the Day\nWelcome to Shape Sorter\nReminder';
        label = 'Dismiss all';
      } else if (o === 'survey') {
        title = 'Quick Survey';
        text = 'Please take a moment to give us some feedback.\nHow easy is this training task?';
        label = 'Close survey';
      } else {
        title = {
          cookie: 'Your privacy',
          toast: 'Changes saved',
          chat: 'Support',
          promo: 'Workspace update',
          banner: 'Service notice',
        }[kind];
        text = {
          cookie: 'This application stores optional cookies.',
          toast: 'Your changes have been saved.',
          chat: 'Need a hand with this workspace?',
          promo: 'Explore the latest workspace features.',
          banner: 'You are viewing a shared workspace.',
        }[kind];
        label = kind === 'cookie' ? 'Reject optional' : 'Close';
      }
      u.el('h3', '', box, title);
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
      } else u.el('p', '', box, text);
      if (o === 'tips') {
        const label = u.el('label', 'tip-option', box);
        const input = u.el('input', '', label);
        input.type = 'checkbox';
        u.el('span', '', label, 'Do not show again');
      }
      const dismiss = u.el('button', 'dismiss', box, label);
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
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (o === 'privacy' || (kind === 'cookie' && !o)) {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
