(function () {
  'use strict';
  const C = {
    'layout': 'web2',
    'theme': 'web2',
    'title': 'Document Viewer',
    'aside': 'Notifications (4)',
    'foot': 'Help',
    'accent': '#3a86d4',
    'bg': '#f3f7fc',
    'surface': '#ffffff',
    'font': 'Trebuchet MS, Lucida Grande, DejaVu Sans, sans-serif',
    'ob': 'notifications',
  };
  const definition = {
    name: 'design-select-text-phrase-06',
    styles: ['site.css', 'web2.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className =
        'design ' + C.theme + ' layout-' + C.layout + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      if (C.theme === 'web2') {
        for (const [key, value] of Object.entries({
          accent: C.accent,
          panel: '#fff',
          bg: '#f2f8fc',
          fg: '#0b1740',
          line: '#c5dff4',
          muted: '#344d72',
        }))
          document.documentElement.style.setProperty('--' + key, value);
        let iconCount = 0;
        const icon = (par, paths, kind) => {
          const s = u.svg(
            'svg',
            { width: 30, height: 30, viewBox: '0 0 32 32', fill: 'none', 'stroke-linejoin': 'round' },
            par,
          );
          const id = 'w2-icon-' + ++iconCount,
            defs = u.svg('defs', {}, s),
            g = u.svg('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
          const gold = kind === 'Open' || kind === 'Highlight';
          u.svg('stop', { offset: '0%', 'stop-color': gold ? '#fff5a7' : '#9bd4ff' }, g);
          u.svg('stop', { offset: '100%', 'stop-color': gold ? '#ffb322' : '#246ac3' }, g);
          const path = (d, fill, stroke, width = 1.8) =>
            u.svg('path', { d, fill: fill || 'none', stroke: stroke || '#386dab', 'stroke-width': width }, s);
          if (kind === 'Open') {
            path('M3 25V7Q3 4 6 4H12L15 8H27V25Z', '#ffe4a4', '#dc951d');
            path('M3 26L6 12H30L27 26Z', 'url(#' + id + ')', '#df941c');
            path('M7 14H27', null, '#fff8d1');
          } else if (kind === 'Save') {
            path('M4 3H26L29 6V29H4Z', 'url(#' + id + ')', '#2164b4');
            path('M9 3H23V13H9Z', '#e6f4ff');
            path('M19 4V11', null, '#2671c7', 3);
            path('M9 19H24V29H9Z', '#f8fcff');
            path('M12 22H21M12 25H21', null, '#9cbada', 1);
          } else if (kind === 'Print') {
            path('M9 3H23V14H9Z', '#f7fcff', '#6e96bc');
            path('M4 12H28V25H4Z', '#d8e4ed', '#527b9d');
            path('M5 13H27V17H5Z', '#f8fcff', '#a4b9cb');
            path('M9 21H23V30H9Z', '#fff', '#557ba0');
            path('M12 24H20M12 27H20', null, '#94afc7', 1);
            path('M24 19H26', null, '#55b063', 2);
          } else if (kind === 'Find') {
            u.svg(
              'circle',
              { cx: 13, cy: 12, r: 10, fill: 'url(#' + id + ')', stroke: '#186ac6', 'stroke-width': 1.5 },
              s,
            );
            u.svg('circle', { cx: 13, cy: 12, r: 6.7, fill: '#e9faff', stroke: '#fff' }, s);
            path('M20 20L28 28', null, '#2164b4', 6);
            path('M21 20L28 27', null, '#5b9ee8', 3);
          } else {
            path('M3 29L6 20L12 26Z', '#203f5e', '#183954');
            path('M6 20L23 3Q25 1 27 3L31 7Q32 9 30 11L13 28Z', 'url(#' + id + ')', '#dea119');
            path('M7 20L13 26M22 5L27 10', null, '#fff3b5', 2);
            path('M5 29H24', null, '#a3b7c8', 2);
          }
          return s;
        };
        const main = u.el('div', 'w2-main', body),
          bar = u.el('div', 'w2-bar', main);
        const di = u.svg(
          'svg',
          {
            class: 'w2-docicon',
            width: 30,
            height: 34,
            viewBox: '0 0 24 28',
            fill: '#fff',
            stroke: '#dfeaf7',
            'stroke-width': 1,
          },
          bar,
        );
        u.svg('path', { d: 'M3 1H14L21 8V27H3Z' }, di);
        u.svg('path', { d: 'M7 12H17M7 16H17M7 20H17', stroke: '#3d83cf', 'stroke-width': 1.6 }, di);
        u.el('span', 'w2-apptitle', bar, 'Document Viewer');
        const wel = u.el('span', 'w2-welcome', bar, 'Welcome, Alex');
        u.el('i', '', wel, '|');
        const so = u.el('span', '', wel, 'Sign ');
        u.el('u', '', so, 'Out');
        const tabs = u.el('div', 'w2-tabs', main);
        for (const [i, t] of ['Home', 'Documents', 'Tasks', 'Calendar', 'Contacts'].entries()) {
          const b = u.el('button', 'w2-tab' + (i === 1 ? ' on' : ''), tabs, t);
          b.type = 'button';
          b.onclick = () => {
            tabs.querySelectorAll('.w2-tab').forEach((x) => x.classList.remove('on'));
            b.classList.add('on');
          };
        }
        const tb = u.el('div', 'w2-toolbar', main);
        const tbtn = (txt, paths, cls) => {
          const b = u.el('button', 'w2-tbtn ' + (cls || ''), txt === 'Open' || txt === 'Save' ? grp1 : tb);
          b.type = 'button';
          icon(b, paths, txt);
          u.el('span', '', b, txt);
          b.onclick = () => env.log('toolbar', { txt });
          return b;
        };
        const grp1 = u.el('div', 'w2-tgroup', tb);
        tbtn('Open', [['M2 7H9L11 9H21V20H2Z', '#f3c04e']]);
        tbtn('Save', [
          ['M3 3H18L21 6V21H3Z', '#3a7fd0'],
          ['M7 3V9H16V3', '#fff'],
        ]);
        tbtn('Print', [['M6 9V3H18V9M6 18H3V10H21V18H18M6 14H18V21H6Z', '#d6dde6']], 'gap');
        u.el('span', 'w2-sep', tb);
        tbtn('Find', [['M10 3A7 7 0 1 1 10 17A7 7 0 1 1 10 3M15 15L21 21']]);
        const hb = tbtn(
          'Highlight',
          [
            ['M4 20L10 14L15 19L9 21Z', '#f3c04e'],
            ['M10 14L18 5L22 9L15 17Z', '#e9d860'],
          ],
          'hl',
        );
        u.el('b', 'w2-caret', hb);
        const stage = u.el('main', 'stage', main);
        stage.dataset.role = 'stage';
        const st = u.el('div', 'w2-status', main);
        u.el('span', '', st, 'Page 1 of 1');
        u.el('i', '', st, '');
        u.el('span', '', st, '173 words');
        const zm = u.el('div', 'w2-zoom', st);
        u.el('span', '', zm, '100%');
        u.el('b', '', zm, '−');
        const tr = u.el('div', 'w2-track', zm);
        u.el('div', 'w2-thumb', tr);
        u.el('b', '', zm, '+');
        const win = u.el('div', 'w2-task', body),
          tt = u.el('div', 'w2-ttitle', win);
        u.el('span', '', tt, 'Task');
        const wc = u.el('span', 'w2-wc', tt);
        for (const l of ['−', '□', '×']) {
          const x = u.el('i', '', wc, l);
        }
        const note = u.el('section', 'task-note', win);
        const ic = u.el('div', 'w2-tico', note);
        const si = u.svg('svg', { width: 30, height: 34, viewBox: '0 0 24 28', fill: '#fff' }, ic);
        u.svg('path', { d: 'M3 1H21V27H3Z' }, si);
        u.svg('path', { d: 'M7 8H17M7 12H17M7 16H17M7 20H17', stroke: '#4ea133', 'stroke-width': 1.6 }, si);
        u.el('div', 'instruction', note, ctx.instruction);
        if (ctx.display === 'hidden') note.hidden = true;
        else if (ctx.display === 'toast') {
          const close = u.el('button', 'w2-note-close', note, '×');
          close.type = 'button';
          close.onclick = () => (note.style.visibility = 'hidden');
        }
        const tools = u.el('div', 'w2-tools', win);
        u.el('h4', '', tools, 'Tools');
        u.el(
          'p',
          '',
          tools,
          'Select text with your mouse. You can use the highlight tool in the document if you prefer.',
        );
        const hb2 = u.el('button', 'w2-tbtn hl', tools);
        hb2.type = 'button';
        icon(hb2, [], 'Highlight');
        u.el('span', '', hb2, 'Highlight');
        u.el('b', 'w2-caret', hb2);
        const acts = u.el('div', 'w2-acts', tools);
        const clr = u.el('button', 'w2-clear', acts, 'Clear Highlight');
        clr.type = 'button';
        clr.onclick = () => {
          env.widgetDef.clear?.();
        };
        const er = ctx.rng.fork('chrome/end');
        const original = er.bool(0.5),
          placement = original ? 'task' : er.pick(['toolbar', 'link']);
        const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
        const endLabels = ctx.content.END_LABELS.map(labelOf);
        const endLabel = original ? 'Submit' : er.pick(endLabels);
        let submit = null;
        if (!ctx.finish) {
          const parent = placement === 'task' ? acts : placement === 'toolbar' ? tb : st;
          submit = u.el(placement === 'link' ? 'a' : 'button', 'submit w2-end-' + placement, parent, endLabel);
          if (placement === 'link') {
            submit.href = '#';
            st.insertBefore(submit, zm);
          } else submit.type = 'button';
          submit.dataset.role = 'submit';
          submit.title = endLabel;
          submit.setAttribute('aria-label', endLabel);
          submit.onclick = (e) => {
            e.preventDefault();
            ctx.submit();
          };
        }
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const options = [...new Set(endLabels)].filter(
            (label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
          );
          if (options.length) {
            const label = cr.pick(options),
              decoy = u.el('button', 'w2-xtra', st, label);
            decoy.type = 'button';
            decoy.dataset.role = 'xtra';
            st.insertBefore(decoy, zm);
            decoy.onclick = () => env.log('decoy', { label, collide: true });
          }
        }
        return { stage, submit };
      }
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
