(function () {
  'use strict';
  const C = {
    'layout': 'ribbon',
    'theme': 'eink',
    'title': 'Angle Practice',
    'ribbon': true,
    'foot': 'Click a point in the workspace to place a marker.',
    'accent': '#111',
    'bg': '#eeede9',
    'surface': '#f2f1ed',
    'font': 'Georgia, serif',
  };
  const NC = (ctx) => {
    const u = ctx.util,
      body = document.body;
    body.className = 'design paper display-' + ctx.display + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
    const root = document.documentElement;
    for (const [k, v] of Object.entries({
      bg: '#e4ded1',
      panel: '#f8f4eb',
      fg: '#141414',
      muted: '#5d5850',
      line: '#cfc8b8',
      accent: '#b3202a',
    }))
      root.style.setProperty('--' + k, v);
    root.style.setProperty('--font', '"Times New Roman",Georgia,serif');
    const tabs = u.el('nav', 'nb-tabs', body);
    ['Math', 'Science', 'History', 'Literature', 'Art', 'Notes'].forEach((t, i) => {
      const b = u.el('button', 'nb-tab' + (i === 0 ? ' active' : ''), tabs);
      u.el('span', '', b, t);
      b.type = 'button';
      b.onclick = () => {
        tabs.querySelectorAll('.nb-tab').forEach((x) => x.classList.remove('active'));
        b.classList.add('active');
      };
    });
    const page = u.el('div', 'nb-page', body),
      shell = page;
    const mast = u.el('header', 'nb-mast', page);
    u.el('div', 'nb-title', mast, 'The Daily Notebook');
    u.el('div', 'nb-motto', mast, 'PRACTICE  MAKES  PROGRESS');
    u.el('div', 'nb-date', mast, 'Tue, Apr 12, 2011');
    const sub = u.el('div', 'nb-sub', page);
    u.el('span', 'nb-tag', sub, 'MATHEMATICS  FOR  A  BRIGHTER  TOMORROW');
    const nav = u.el('span', 'nb-nav', sub);
    ['EXERCISES', 'TOOLS', 'HELP'].forEach((t, i) => {
      if (i) u.el('i', '', nav, '|');
      u.el('a', '', nav, t);
    });
    u.el('div', 'nb-kicker', page, 'GEOMETRY  PRACTICE');
    const note = u.el('section', 'task-note' + (ctx.instruction.length > 110 ? ' long-instruction' : ''), page);
    u.el('div', 'instruction', note, ctx.instruction);
    if (ctx.display === 'toast') {
      note.classList.add('instruction-toast');
      const x = u.el('button', 'note-close', note, '×');
      x.type = 'button';
      x.setAttribute('aria-label', 'Close');
      x.onclick = () => (note.style.display = 'none');
    }
    const row = u.el('div', 'nb-row', page);
    const stage = u.el('main', 'stage', row);
    stage.dataset.role = 'stage';
    const side = u.el('aside', 'nb-side', row);
    const box = u.el('div', 'nb-box', side);
    u.el('h4', '', box, 'TASK');
    const taskCopy = u.el('p', 'nb-task', box, ctx.instruction);
    u.el('hr', '', box);
    u.el('h4', '', box, 'TOOLS');
    const add = u.el('button', 'nb-btn on', box);
    add.type = 'button';
    add.innerHTML =
      '<svg width="22" height="26" viewBox="0 0 22 26"><path d="M3 1V20L8 15L12 24L15 22.500L11 14H18Z" fill="#fff" stroke="#fff" stroke-width="1"/></svg><span>Add Point</span>';
    const clr = u.el('button', 'nb-btn', box);
    clr.type = 'button';
    clr.innerHTML =
      '<svg width="30" height="26" viewBox="0 0 30 26" fill="none" stroke="#222" stroke-width="1.6"><path d="M5 16L15 5Q17 3 19 5L25 10Q27 12 25 14L16 24Q14 26 12 24L5 20Q3 18 5 16ZM9 12L20 22"/></svg><span>Clear All</span>';
    clr.onclick = () => {
      env.widgetDef.clear?.();
    };
    u.el('hr', '', box);
    u.el('h4', '', box, 'INFORMATION');
    u.el('p', 'nb-info', box, 'The dotted circle shows the region where point C cannot be placed.');
    let submit = null;
    let placement = null,
      label = 'Submit';
    if (!ctx.finish) {
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      placement = er.pick(['side', 'side', 'side', 'side', 'side', 'side', 'side', 'inside', 'masthead', 'masthead']);
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      label = er.bool(0.7) ? 'Submit' : labelOf(er.pick(labels));
      const makeEnd = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.onclick = () => ctx.submit();
        return b;
      };
      if (placement === 'inside') submit = makeEnd(box, 'submit nb-submit-inside', label);
      else if (placement === 'masthead') submit = makeEnd(sub, 'nb-end-masthead', label);
      else submit = makeEnd(side, 'submit', label);
      if (cr.bool(0.3)) {
        const same = (x) => labelOf(x).trim().toLowerCase() === label.trim().toLowerCase();
        const choices = [...new Set(labels.map(labelOf))].filter((x) => !same(x));
        if (choices.length) {
          const d = u.el('button', 'nb-pq', nav, cr.pick(choices));
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.onclick = () => env.log('decoy', { label: d.textContent, collide: true });
        }
      }
    }
    return { stage, submit };
  };
  env.site({
    name: 'design-click-point-right-angle-09',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      return NC(ctx);
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
      if (C.menu) u.el('nav', 'menu', head, C.menu);
      if (C.ribbon) {
        const rib = u.el('div', 'ribbon', head);
        const tool = (parent, name, path) => {
          path =
            {
              'Add Point': 'M4 2V28L12 20L18 30L23 27L17 18H29Z',
              'Erase': 'M5 20L21 3L30 12L14 29H8ZM5 20L14 29M15 10L24 19',
              'Undo': 'M13 5L3 14L13 22V16H21Q28 16 29 28Q32 9 21 9H13Z',
              'Redo': 'M19 5L29 14L19 22V16H11Q4 16 3 28Q0 9 11 9H19Z',
              'Settings':
                'M13 2H19L20 7L24 9L29 7L32 13L28 17V21L31 25L27 30L22 28L18 30L17 34H11L10 29L6 27L2 29L-1 23L3 19V15L0 11L4 6L9 8L13 6ZM22 17A6 6 0 1 1 10 17A6 6 0 1 1 22 17',
              'About': 'M29 16A13 13 0 1 1 3 16A13 13 0 1 1 29 16M16 13V24M16 7V9',
              'Rectangle': 'M4 4H28V28H4Z',
              'Fit to Window':
                'M4 4H28V28H4ZM8 8L13 13M24 8L19 13M8 24L13 19M24 24L19 19M8 13V8H13M19 8H24V13M8 19V24H13M19 24H24V19',
            }[name] || path;
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
                      : t === 'Example'
                        ? 'M6 2H20L27 9V30H6ZM20 2V10H27M10 15H23M10 20H23M10 25H21'
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
