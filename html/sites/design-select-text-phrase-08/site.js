(function () {
  'use strict';
  const C = {
    'layout': 'three',
    'theme': 'human-text',
    'title': 'Text Task \u2014 Document',
    'aside': 'Notifications (4)',
    'foot': 'Help',
    'accent': '#ed8333',
    'bg': '#eee6d7',
    'surface': '#fbf7ef',
    'font': 'Lato, Ubuntu, Segoe UI, sans-serif',
    'ob': 'notifications',
  };
  function neuFrame(ctx) {
    const u = ctx.util,
      body = document.body;
    body.className = 'design neu' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
    const endRng = ctx.rng.fork('chrome/end'),
      collideRng = ctx.rng.fork('chrome/collide');
    const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
    const endLabels = ctx.content.END_LABELS.map(labelOf);
    const original = !endRng.bool(0.5);
    const placement = original ? 'dock' : endRng.pick(['header', 'link']);
    const endLabel = original ? 'Submit' : endRng.pick(endLabels.filter((x) => x !== 'Submit'));
    const collide = collideRng.bool(0.3)
      ? collideRng.pick(endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()))
      : null;
    const decoyBtn = (parent, label) => {
      const b = u.el('button', 'dock-btn end-xtra', parent, label);
      b.type = 'button';
      b.dataset.role = 'xtra';
      b.onclick = () => env.log('decoy', { label, collide: true });
      return b;
    };
    const root = document.documentElement;
    for (const [k, v] of Object.entries({
      bg: '#e8edf5',
      panel: '#f4f7fc',
      fg: '#2b3448',
      muted: '#5b667a',
      line: '#cdd6e4',
      accent: '#2f7bea',
    }))
      root.style.setProperty('--' + k, v);
    root.style.setProperty('--font', 'Lato, "Segoe UI", "Helvetica Neue", Arial, sans-serif');
    const shell = u.el('div', 'shell', body),
      content = u.el('div', 'content', shell);
    const note = u.el('section', 'task-note', content);
    const ic = u.el('div', 'note-icon', note);
    const svg = u.svg(
      'svg',
      {
        width: 26,
        height: 26,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: '#3a6fc4',
        'stroke-width': 1.7,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      },
      ic,
    );
    u.svg('path', { d: 'M6 3H14L19 8V21H6ZM14 3V8H19M9 12H16M9 15H16M9 18H13' }, svg);
    u.el('div', 'instruction', note, ctx.instruction);
    if (ctx.display === 'hidden') note.hidden = true;
    else if (ctx.display === 'toast') {
      note.classList.add('instruction-toast');
      const x = u.el('button', 'note-close', note, '×');
      x.onclick = () => (note.style.visibility = 'hidden');
    } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
    const stage = u.el('main', 'stage', content);
    stage.dataset.role = 'stage';
    if (ctx.display === 'toast') content.append(note);
    if (ctx.display === 'panel') content.classList.add('has-panel-note');
    const footer = u.el('footer', 'footer', shell);
    const grp = (label, cls) => {
      const g = u.el('div', 'dock-group ' + cls, footer);
      u.el('div', 'dock-label', g, label);
      return u.el('div', 'dock-row', g);
    };
    const btn = (parent, text, cls, fn, icon) => {
      const b = u.el('button', 'dock-btn ' + (cls || ''), parent);
      b.type = 'button';
      if (icon) {
        const s = u.svg(
          'svg',
          {
            width: 26,
            height: 26,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': 1.6,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          },
          b,
        );
        u.svg('path', { d: icon }, s);
      }
      if (text) u.el('span', '', b, text);
      b.onclick = fn;
      return b;
    };
    const tools = grp('Selection Tools', 'g-tools');
    const tb = [];
    for (const [t, p, fn] of [
      ['Select', 'M5 2V21L10 16L14 23L17 21L13 14H21Z', null],
      ['Highlight', 'M3 21L5 16L16 3Q17 2 18 3L22 7L10 20L5 18ZM5 16L10 20M3 21L6 20', null],
      [
        'Clear',
        'M4 14L14 3Q15 2 16 3L21 8Q22 9 21 10L11 21Q10 22 9 21L4 16Q3 15 4 14ZM8 10L16 17',
        () => env.widgetDef.clear?.(),
      ],
    ]) {
      const b = btn(
        tools,
        t,
        t === 'Select' ? 'sel' : '',
        () => {
          if (fn) {
            fn();
            return;
          }
          tb.forEach((x) => x.classList.remove('sel'));
          b.classList.add('sel');
        },
        p,
      );
      tb.push(b);
    }
    u.el('div', 'dock-sep', footer);
    const view = grp('View', 'g-view');
    btn(view, '−', 'sq', () => {});
    u.el('span', 'zoom', view, '100%');
    btn(view, '+', 'sq', () => {});
    u.el('div', 'dock-sep', footer);
    const ts = grp('Text Style', 'g-style');
    btn(ts, 'A−', 'sq w', () => {});
    btn(ts, 'A', 'sq w', () => {});
    btn(ts, 'A+', 'sq w', () => {});
    let submit = null;
    if (!ctx.finish) {
      let parent = footer;
      if (placement === 'header') {
        const toolbar = u.el('div', 'completion-toolbar', content);
        content.insertBefore(toolbar, note);
        u.el('span', 'completion-caption', toolbar, 'Document');
        parent = toolbar;
      } else u.el('div', 'dock-sep', footer);
      const controls = u.el('div', 'completion-controls', parent);
      if (collide) decoyBtn(controls, collide);
      submit = u.el(
        placement === 'link' ? 'a' : 'button',
        'submit' + (placement === 'link' ? ' end-link' : ''),
        controls,
        endLabel,
      );
      if (submit.tagName === 'BUTTON') submit.type = 'button';
      else submit.href = '#';
      submit.dataset.role = 'submit';
      submit.title = endLabel;
      submit.setAttribute('aria-label', endLabel);
      submit.onclick = (e) => {
        e.preventDefault();
        ctx.submit();
      };
    } else if (collide) {
      const controls = u.el('div', 'completion-controls', footer);
      decoyBtn(controls, collide);
    }
    return { stage, submit };
  }
  function neuOverlay(ctx) {
    const u = ctx.util,
      kind = ctx.kind;
    const copy = {
      cookie: ['Your privacy', 'This workspace stores optional cookies.', 'Reject optional'],
      toast: ['Workspace update', 'Your changes have been saved.', 'Close'],
      chat: ['Support', 'Need a hand with this document?', 'Close'],
      promo: ['Workspace update', 'Explore the latest reading tools.', 'Close'],
      banner: ['Service notice', 'You are viewing a shared workspace.', 'Dismiss'],
    }[kind];
    const el = u.el('section', 'obstruction obstruction-' + kind + ' neu-overlay', document.body);
    el.dataset.role = 'overlay';
    const box = u.el('div', 'obstruction-box', el);
    u.el('h3', '', box, copy[0]);
    u.el('p', '', box, copy[1]);
    const dismiss = u.el('button', 'dismiss', box, copy[2]);
    dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('close');
    if (kind === 'cookie') {
      const accept = u.el('button', 'dismiss', box, 'Accept optional');
      accept.type = 'button';
      accept.onclick = () => ctx.dismiss('accept');
    }
    return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
  }
  const definition = {
    name: 'design-select-text-phrase-08',
    styles: ['site.css', 'neu.css'],
    scripts: [],
    frame(ctx) {
      return neuFrame(ctx);
    },
    frameOld(ctx) {
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
      if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk', 'human-text'].includes(C.theme)) {
        const controls = u.el('div', 'window-controls', head);
        for (const label of ['−', '□', '×']) {
          const bt = u.el('button', '', controls, label);
          bt.type = 'button';
          bt.onclick = () => env.log('window-control', { label });
        }
      }
      if (C.theme === 'human-text') {
        const appIcon = u.svg(
          'svg',
          {
            class: 'app-icon',
            viewBox: '0 0 16 20',
            fill: 'none',
            stroke: '#ffe0a8',
            'stroke-width': 1.1,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          },
          head,
        );
        u.svg(
          'path',
          { d: 'M5 3H10L13 6V17H4V4M10 3V6H13M7 7V13Q7 16 9 16Q11 16 11 13V8Q11 5 9 5Q7 5 7 8V12' },
          appIcon,
        );
      }
      if (C.title) u.el('div', 'title', head, C.title);
      if (C.subtitle) u.el('div', 'subtitle', head, C.subtitle);
      if (C.menu) u.el('nav', 'menu', head, C.menu);
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
      if (C.theme === 'human-text') {
        const pause = u.el('div', 'pause-notice', note);
        u.el('span', 'pause-icon', pause, 'Ⅱ');
        u.el('span', '', pause, 'Timer paused until notifications are cleared.');
      }
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
      if (C.layout === 'split-level') {
        const text = u.el(
          'p',
          'overview-copy',
          note,
          C.theme === 'vista'
            ? 'Click at the start dot, then drag along the curved path to the arrowhead. Keep your pointer on the line and complete it in one continuous stroke. Do not lift the mouse button until you reach the arrowhead.'
            : 'Drag within the color area or the hue slider to find the closest match.',
        );
      }
      const stage = u.el('main', 'stage', content);
      stage.dataset.role = 'stage';
      let aside = null;
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
          'material-twin',
          'margin',
          'crop-dock',
        ].includes(C.layout)
      ) {
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
          u.el('h3', '', aside, C.aside || 'Instructions');
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
          else if (C.theme === 'community') {
            u.el('p', '', aside, 'Freehand Drawing (Click and drag to draw.)');
            u.el('h3', '', aside, 'Tips');
            const list = u.el('ul', '', aside);
            for (const t of [
              'Click and drag to draw a single continuous circle.',
              'Try to make a smooth circle.',
              'Release to finish the circle.',
              'The hollow dot must be on the circle’s edge.',
            ])
              u.el('li', '', list, t);
            u.el('h3', '', aside, 'Community Corner');
            for (const t of [
              'Welcome, Neighbor!',
              'Sign My Guestbook',
              'View Recent Updates',
              'Our Little Town',
              'Helpful Links',
            ]) {
              const a = u.el('a', 'community-link', aside, t);
              a.href = '#';
              a.onclick = (ev) => ev.preventDefault();
            }
          } else if (C.disabled) {
            const tools = u.el('div', 'actual-tools', aside);
            for (const text of ['Add point', 'Remove point', 'Clear all']) {
              const bt = u.el('button', '', tools, text);
              bt.onclick = () => {
                if (text !== 'Add point') env.widgetDef.clear?.();
              };
            }
            u.el('h3', '', aside, 'Quick action');
            const shortcut = u.el('button', 'disabled-shortcut', aside, 'Auto-find center (disabled)');
            shortcut.disabled = true;
            u.el('p', '', aside, 'This shortcut is not available for this exercise.');
            u.el('h3', '', aside, 'Status');
            u.el('p', '', aside, 'No points placed yet.');
          } else if (C.collapsed) {
            for (const t of [
              'Show labels: A, B, V',
              'Point style: ●',
              'Line style: ━',
              'Grid: Show grid',
              'Snap to grid: Enabled',
            ]) {
              const l = u.el('label', 'preference', aside, t);
              const check = u.el('input', '', l);
              check.type = 'checkbox';
              check.checked = t.startsWith('Show labels');
            }
          } else if (C.theme === 'crop-minimal') u.el('p', '', aside, 'Drag the handles to resize the crop box.');
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
      const cancel = u.el('button', 'cancel-btn', footer, 'Cancel');
      cancel.type = 'button';
      cancel.onclick = () => env.log('cancel', {});
      let submit = null;
      if (!ctx.finish) {
        const parent =
          (C.layout === 'three' || C.layout === 'material-twin' || C.layout === 'margin') && aside ? aside : footer;
        submit = u.el('button', 'submit', parent, 'Submit');
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.onclick = () => ctx.submit();
        if (C.collapsed) {
          const show = u.el('button', 'show-controls', parent, 'Show controls');
          show.type = 'button';
          show.onclick = () => {
            show.classList.add('revealed');
            show.textContent = 'Task controls';
            submit.style.visibility = 'visible';
          };
          submit.style.visibility = 'hidden';
        }
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
      return neuOverlay(ctx);
    },
    overlayOld(ctx) {
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
        title = 'Notifications (4)';
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
              ['New messages', 'You have 3 unread messages.'],
              ['Software update', 'A new version is available.'],
              ['Calendar reminder', 'Team sync at 11:00.'],
              ['Storage almost full', 'You have 1.2 GB remaining.'],
            ]) {
          const card = u.el('div', 'notification-card', notifications);
          u.el('strong', '', card, name);
          if (C.theme === 'human-text') {
            const index = notifications.children.length - 1;
            u.el('div', 'notification-time', card, ['10:14', '09:52', '09:20', '08:47'][index]);
            const svg = u.svg(
              'svg',
              {
                class: 'notification-icon',
                width: 44,
                height: 48,
                viewBox: '0 0 48 48',
                fill: 'none',
                stroke: '#423024',
                'stroke-width': 3,
                'stroke-linecap': 'round',
                'stroke-linejoin': 'round',
              },
              card,
            );
            if (index === 0) {
              u.svg('rect', { x: 4, y: 10, width: 40, height: 32, rx: 3 }, svg);
              u.svg('path', { d: 'M5 12L24 28L43 12' }, svg);
            } else if (index === 1) {
              u.svg('path', { d: 'M6 20A18 18 0 0 1 40 15M40 5V16H29M42 28A18 18 0 0 1 8 33M8 43V32H19' }, svg);
            } else if (index === 2) {
              u.svg('rect', { x: 5, y: 8, width: 38, height: 37, rx: 3, fill: '#faf8f3' }, svg);
              u.svg('path', { d: 'M6 16H42', stroke: '#b33020', 'stroke-width': 7 }, svg);
              u.svg('path', { d: 'M14 5V12M34 5V12' }, svg);
              for (const x of [13, 23, 33])
                for (const y of [25, 35])
                  u.svg('rect', { x: x - 2, y: y - 2, width: 4, height: 4, fill: '#b33020', stroke: 'none' }, svg);
            } else {
              u.svg(
                'path',
                {
                  d: 'M20 6Q24 0 28 6M19 41Q24 49 29 41M5 40Q11 36 11 27V20Q11 8 24 8Q37 8 37 20V27Q37 36 43 40Z',
                  fill: '#d9ad74',
                },
                svg,
              );
            }
          }
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
  };
  env.site(definition);
})();
