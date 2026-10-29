(function () {
  'use strict';
  const C = {
    'layout': 'plain',
    'theme': 'atlas',
    'title': 'Trail Atlas',
    'subtitle': '',
    'menu': 'Map       Trails       Parks       Photos       Field Notes',
    'foot': '',
    'accent': '#176475',
    'bg': '#f5f1e4',
    'surface': '#faf7ed',
    'font': 'Georgia, serif',
  };
  env.site({
    name: 'design-draw-shape-polygon-02',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body,
        display =
          (ctx.display === 'panel' || ctx.display === 'toast') && (window.innerWidth < 1400 || window.innerHeight < 800)
            ? 'header'
            : ctx.display;
      body.className =
        'design ' + C.theme + ' layout-' + C.layout + (display === 'toast' ? ' has-instruction-toast' : '');
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
      const sprite = (x, y, w, h, cls = '') =>
        `<svg class="pixel-sprite ${cls}" width="${w}" height="${h}" viewBox="${x} ${y} ${w} ${h}" aria-hidden="true"><image href="sites/design-draw-shape-polygon-02/assets/reference.webp" width="1672" height="941"/></svg>`;
      if (C.theme === 'community')
        shell.insertAdjacentHTML(
          'afterbegin',
          '<svg class="paper-texture" width="100%" height="100%" aria-hidden="true"><defs><pattern id="community-paper" width="128" height="128" patternUnits="userSpaceOnUse"><svg width="128" height="128" viewBox="260 0 128 128"><image href="sites/design-draw-shape-polygon-02/assets/reference.webp" width="1672" height="941"/></svg></pattern></defs><rect width="100%" height="100%" fill="url(#community-paper)"/></svg>',
        );
      if (C.theme === 'community') {
        const t = head.querySelector('.title'),
          s = head.querySelector('.subtitle');
        const left = u.el('div', 'h-left', head),
          mid = u.el('div', 'h-mid', head),
          right = u.el('div', 'h-right', head);
        left.innerHTML =
          '<svg width="76" height="82" viewBox="0 0 38 41"><path d="M2 20L19 4L36 20Z" fill="#c9566b" stroke="#6a2c3c"/><rect x="6" y="20" width="26" height="17" fill="#f1e7b8" stroke="#6a5a3c"/><rect x="10" y="24" width="5" height="5" fill="#4a8a9a"/><rect x="22" y="24" width="5" height="5" fill="#4a8a9a"/><rect x="16" y="29" width="6" height="8" fill="#7a5a3c"/><path d="M2 38H36" stroke="#4a9a4a" stroke-width="3"/></svg>';
        left.innerHTML = sprite(35, 27, 78, 83, 'house');
        const nav = u.el('nav', 'h-nav', left);
        for (const x of ['Home', 'My Page', 'Friends', 'Guestbook']) {
          const a = u.el('a', '', nav, x);
          a.href = '#';
          a.onclick = (e) => e.preventDefault();
        }
        const leaf =
          '<svg class="leaf" width="56" height="68" viewBox="0 0 28 34"><path d="M14 2L19 9L25 8L22 15L26 20L18 21L14 26L10 21L2 20L6 15L3 8L9 9Z" fill="#2f9a6a" stroke="#1a5a40"/><path d="M14 10V32" stroke="#1a5a40" stroke-width="2"/></svg>';
        const row = u.el('div', 'h-row', mid);
        row.innerHTML = sprite(506, 18, 58, 70, 'leaf');
        const tw = u.el('div', 'h-tw', row);
        row.insertAdjacentHTML('beforeend', sprite(1105, 18, 58, 70, 'leaf'));
        tw.append(t, s);
        right.innerHTML =
          '<svg width="76" height="84" viewBox="0 0 38 42"><path d="M6 40V18L9 6L14 14H24L29 6L32 18V40Z" fill="#8c93a6" stroke="#444a5c"/><circle cx="14" cy="22" r="1.6" fill="#222"/><circle cx="24" cy="22" r="1.6" fill="#222"/></svg><div class="h-wish">Good<br>People<br>Brighter<br>Days</div><svg width="34" height="44" viewBox="0 0 17 22"><circle cx="8.5" cy="7" r="5.5" fill="#d83a55" stroke="#7a1830"/><path d="M8.5 12V22" stroke="#2f7a3a" stroke-width="2"/></svg>';
      }
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
      if (C.theme === 'community') {
        head.querySelector('.h-right').innerHTML =
          sprite(1324, 40, 75, 83, 'cat') +
          '<div class="h-wish">Good<br>People<br>Brighter<br>Days</div>' +
          sprite(1556, 64, 39, 49, 'rose');
      }
      const content = u.el('div', 'content', shell);
      if (C.theme === 'community') {
        const bar = u.el('div', 'act-bar', content);
        bar.insertAdjacentHTML('beforeend', sprite(29, 149, 35, 41, 'act-flower'));
        u.el('b', '', bar, "Today's Activity");
        u.el('span', 'act-date', bar, 'Tue, Apr 16, 1996');
      }
      const note = u.el('section', 'task-note', content);
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
      if (display === 'hidden') note.hidden = true;
      else if (display === 'toast') {
        note.hidden = false;
        note.classList.add('toast-note');
        const toast = u.el('div', 'community-toast', note);
        u.el('span', '', toast, ctx.instruction);
        const x = u.el('button', 'note-close', toast, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.onclick = () => {
          toast.style.visibility = 'hidden';
        };
      } else if (display === 'panel' && C.theme !== 'atlas') note.hidden = true;
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
      if (C.theme === 'community' && aside) {
        if (display === 'panel') {
          aside.classList.add('has-task-panel');
          aside.querySelector('h3').textContent = 'Today’s Activity';
        }
        const icons = [
          '<svg width="38" height="38" viewBox="0 0 20 20"><path d="M3 17L4 13L14 3L17 6L7 16Z" fill="#f2b84a" stroke="#6a4a1c"/><path d="M3 17L4 13L7 16Z" fill="#e8b0a0" stroke="#6a4a1c"/></svg>',
          '<svg width="34" height="34" viewBox="0 0 18 18"><circle cx="9" cy="7" r="5" fill="#f7e060" stroke="#7a6a1c"/><rect x="7" y="12" width="4" height="4" fill="#888"/></svg>',
          '<svg width="42" height="34" viewBox="0 0 22 18"><circle cx="6" cy="6" r="3" fill="#e8a070" stroke="#444"/><circle cx="16" cy="6" r="3" fill="#e8a070" stroke="#444"/><circle cx="11" cy="8" r="3.2" fill="#f0b890" stroke="#444"/><path d="M1 17Q6 9 11 11Q16 9 21 17Z" fill="#5a78c8" stroke="#334"/></svg>',
        ];
        const badges = [sprite(1297, 149, 42, 42), sprite(1298, 332, 32, 37), sprite(1295, 584, 46, 35)];
        const tips = aside.querySelectorAll('li');
        tips[0].innerHTML = 'Click and drag to draw <br class="reference-break">a single continuous circle.';
        tips[3].innerHTML = 'The hollow dot must be on <br class="reference-break">the circle’s edge.';
        aside.querySelectorAll('h3').forEach((h, i) => {
          if (badges[i]) {
            h.style.display = 'flex';
            h.style.alignItems = 'center';
            h.style.gap = '10px';
            h.insertAdjacentHTML('afterbegin', badges[i]);
          }
        });
        const fp = aside.querySelector('p');
        if (fp) {
          fp.innerHTML =
            '<span class="cur"><svg width="34" height="50" viewBox="0 0 17 25"><path d="M2 2V20L7 15L11 23L14 22L10 14H17Z" fill="#fff" stroke="#111" stroke-width="1.5"/></svg></span><span>' +
            (display === 'panel' ? ctx.instruction : 'Freehand Drawing<br>(Click and drag<br>to draw.)') +
            '</span>';
        }
        aside.insertAdjacentHTML(
          'beforeend',
          '<svg class="flwr" width="52" height="80" viewBox="0 0 26 40"><path d="M13 20V38" stroke="#2f7a3a" stroke-width="3"/><path d="M13 30Q4 28 3 22Q10 22 13 30Z" fill="#4aa860"/><circle cx="13" cy="11" r="9" fill="#e870b0" stroke="#7a2050"/><circle cx="13" cy="11" r="3.5" fill="#f5d040"/></svg>',
        );
      }
      if (C.theme === 'community' && aside) {
        aside.querySelector('.cur').innerHTML = sprite(1325, 226, 48, 65);
        aside.querySelector('.flwr').outerHTML = sprite(1295, 821, 60, 86, 'flwr');
      }
      const footer = u.el('footer', 'footer', C.theme === 'community' ? content : shell);
      u.el('div', 'footer-copy', footer, C.foot || '');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          labels =
            ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
              ? ctx.content.END_LABELS
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"],
          labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        let placement = 'footer',
          label = 'Submit';
        if (!er.bool(0.5)) {
          placement = er.pick(['activity', 'footer-link']);
          label = labelOf(er.pick(labels));
        }
        const makeEnd = (parent, tag, cls, text) => {
          const b = u.el(tag, cls, parent, text);
          if (tag === 'button') b.type = 'button';
          else b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.onclick = (e) => {
            e.preventDefault();
            ctx.submit();
          };
          return b;
        };
        const cr = ctx.rng.fork('chrome/collide');
        let collide = null;
        if (cr.bool(0.3)) {
          const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) collide = cr.pick(pool);
        }
        if (placement === 'activity' && C.theme !== 'atlas') {
          const bar = content.querySelector('.act-bar');
          submit = makeEnd(bar, 'button', 'community-end activity-end', label);
        } else if (placement === 'footer-link') {
          submit = makeEnd(footer, 'a', 'community-endlink', label + ' ›');
        } else submit = makeEnd(footer, 'button', 'submit', label);
        if (collide) {
          const decoy = u.el('button', 'community-xtra', footer, collide);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.onclick = () => env.log('decoy', { label: collide, collide: true });
        }
        if (C.collapsed) {
          const show = u.el(
            'button',
            'show-controls',
            placement === 'activity' ? content.querySelector('.act-bar') : footer,
            'Show controls',
          );
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
