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
    'word': true,
  };
  const definition = {
    name: 'design-select-text-phrase-01',
    styles: ['site.css', 'word.css'],
    scripts: [],
    frame(ctx) {
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
      if (C.word) {
        body.className = 'design wordapp';
        const E = (t, c, p, x) => u.el(t, c, p, x);
        const icon = (parent, name, cls = '') => {
          const s = u.svg(
            'svg',
            {
              class: 'w-icon ' + cls,
              viewBox: '0 0 32 32',
              fill: 'none',
              stroke: '#486886',
              'stroke-width': 1.3,
              'stroke-linejoin': 'round',
            },
            parent,
          );
          const P = (d, attrs = {}) => u.svg('path', { d, ...attrs }, s);
          const R = (x, y, width, height, attrs = {}) => u.svg('rect', { x, y, width, height, ...attrs }, s);
          const defs = u.svg('defs', {}, s);
          const grad = u.svg(
            'linearGradient',
            { id: 'w-' + name + '-' + cls.replace(/\W/g, ''), x1: 0, y1: 0, x2: 0, y2: 1 },
            defs,
          );
          u.svg('stop', { offset: 0, 'stop-color': '#91c6f2' }, grad);
          u.svg('stop', { offset: 1, 'stop-color': '#1164b9' }, grad);
          const blue = 'url(#w-' + name + '-' + cls.replace(/\W/g, '') + ')';
          if (name === 'office') {
            R(6, 4, 21, 25, { rx: 1, fill: blue, stroke: '#fff' });
            P('M10 8H16V15H10ZM19 11H23V15H19ZM10 18H16V25H10ZM19 18H23V25H19Z', { fill: '#fff', stroke: 'none' });
          } else if (name === 'save') {
            R(5, 3, 23, 26, { rx: 1, fill: '#7470ba', stroke: '#4c5284' });
            R(10, 4, 12, 9, { fill: '#e5f6ff' });
            R(10, 18, 14, 10, { fill: '#fff' });
            R(19, 5, 3, 6, { fill: '#444b85' });
            P('M13 21H22M13 24H22', { stroke: '#adb8c7' });
          } else if (name === 'undo' || name === 'redo') {
            P('M8 11Q21 4 24 16Q26 24 18 28L15 24Q22 20 19 15Q16 10 10 15L13 18L3 17L4 6Z', {
              fill: blue,
              stroke: '#3978b2',
            });
            if (name === 'redo') s.style.transform = 'scaleX(-1)';
          } else if (name === 'paste') {
            R(5, 4, 19, 24, { rx: 1, fill: '#f3c45a', stroke: '#bc9450' });
            R(9, 2, 10, 5, { rx: 2, fill: '#eef2f6', stroke: '#6f7b83' });
            P('M17 13H27L30 16V31H17Z', { fill: '#fff', stroke: '#78848d' });
            P('M27 13V17H30M20 20H27M20 23H27M20 26H27', { stroke: '#a1a7ad' });
          } else if (name === 'cut') {
            P('M10 4L21 23M21 3L11 23', { stroke: '#85939f', 'stroke-width': 2 });
            u.svg('circle', { cx: 8, cy: 25, r: 4 }, s);
            u.svg('circle', { cx: 23, cy: 25, r: 4 }, s);
          } else if (name === 'copy') {
            R(4, 4, 15, 20, { fill: '#f8fcff', stroke: '#9eacb7' });
            R(11, 10, 15, 20, { fill: '#fff', stroke: '#9eacb7' });
            P('M14 14H23M14 18H23M14 22H23M14 26H23', { stroke: '#adb9c4' });
          } else if (name === 'paint') {
            P('M10 22L25 5L29 9L14 26Z', { fill: '#ffd15b', stroke: '#ab8737' });
            P('M8 18L18 25L13 30Q5 29 3 25Z', { fill: '#5087c2', stroke: '#4a688a' });
          } else if (name === 'find') {
            P('M4 12H12V29H2V21ZM20 12H28L30 21V29H20ZM10 6H13V16H9ZM19 6H22V16H18Z', {
              fill: blue,
              stroke: '#234f81',
            });
            P('M12 19H20M12 24H20', { stroke: '#244e7d', 'stroke-width': 3 });
            P('M5 16V25M23 16V25', { stroke: '#cce7fa', 'stroke-width': 2 });
          } else if (name === 'replace') {
            u.svg(
              'text',
              { x: 2, y: 12, fill: '#172d50', stroke: 'none', 'font-size': 13, 'font-family': 'Arial' },
              s,
            ).textContent = 'ab';
            u.svg(
              'text',
              { x: 2, y: 29, fill: '#172d50', stroke: 'none', 'font-size': 13, 'font-family': 'Arial' },
              s,
            ).textContent = 'ac';
            P('M23 8V24M19 20L23 24L27 20', { stroke: '#704acc', 'stroke-width': 2 });
          } else if (name === 'select') {
            P('M8 2V27L14 21L20 30L24 27L18 18H28Z', { fill: '#fff', stroke: '#52667c' });
          } else if (name === 'highlight') {
            P('M8 21L19 7L26 12L15 25Z', { fill: '#fff', stroke: '#4b678a' });
            P('M8 21L6 27L15 25Z', { fill: '#426292' });
            P('M3 30H27', { stroke: '#fff000', 'stroke-width': 4 });
          } else if (name === 'border') {
            R(5, 5, 22, 22, { fill: '#e8eff9', stroke: '#90a2b6' });
            P('M16 5V27M5 16H27', { stroke: '#8196ac' });
            P('M9 9H12M20 9H23M9 23H12M20 23H23', { stroke: '#8196ac' });
          } else if (name === 'shade') {
            P('M7 18L18 6L27 16L16 27Z', { fill: '#fff', stroke: '#56769a' });
            P('M4 29H28', { stroke: '#b2bdc9', 'stroke-width': 3 });
            P('M24 21Q31 28 24 28Q20 27 24 21Z', { fill: blue });
          } else if (name === 'view1') {
            R(6, 4, 20, 25, { fill: '#fff', stroke: '#285a8e' });
            R(9, 7, 14, 3, { fill: '#78858b', stroke: 'none' });
            P('M9 14H23M9 18H23M9 22H23M9 26H23', { stroke: '#4f5f6a' });
          } else if (name === 'view2') {
            R(5, 6, 22, 22, { fill: '#e8f3ff', stroke: '#295a92' });
            P('M9 11H13M19 11H23M9 16H13M19 16H23M9 22H13M19 22H23', { stroke: '#295a92', 'stroke-width': 3 });
          } else if (name === 'view3') {
            R(5, 6, 22, 22, { fill: '#e8f3ff', stroke: '#295a92' });
            P('M10 10H24M10 16H24M10 22H24', { stroke: '#295a92', 'stroke-width': 2 });
            P('M3 10H6M3 16H6M3 22H6', { stroke: '#295a92', 'stroke-width': 3 });
          }
          return s;
        };
        const sh = E('div', 'w-shell', body),
          tb = E('header', 'w-title', sh);
        const orb = E('div', 'w-orb', tb);
        icon(orb, 'office');
        const qa = E('div', 'w-qa', tb);
        icon(qa, 'save');
        icon(qa, 'undo');
        E('span', 'w-arrow', qa, '▾');
        icon(qa, 'redo');
        E('div', 'w-name', tb, 'Morning Reflections.docx - Word Processor');
        const wc = E('div', 'w-wc', tb);
        for (const [c, l] of [
          ['', ' –'],
          ['', '▢'],
          ['x', '✕'],
        ]) {
          const b = E('button', 'w-wbtn ' + c, wc, l);
          b.type = 'button';
          b.onclick = () => env.log('window-control', { label: l });
        }
        const tabs = E('nav', 'w-tabs', sh);
        const tabEls = [];
        for (const [i, t] of ['Home', 'Insert', 'Page Layout', 'References', 'Mailings', 'Review', 'View'].entries()) {
          const b = E('button', 'w-tab' + (i === 0 ? ' on' : ''), tabs, t);
          b.type = 'button';
          tabEls.push(b);
          b.onclick = () => {
            tabEls.forEach((x) => x.classList.remove('on'));
            b.classList.add('on');
          };
        }
        E('div', 'w-help', tabs, '?');
        const rb = E('div', 'w-ribbon', sh);
        const grp = (name, cls) => {
          const g = E('div', 'w-group ' + cls, rb);
          const body2 = E('div', 'w-gbody', g);
          E('div', 'w-glabel', g, name);
          if (['Clipboard', 'Font', 'Paragraph'].includes(name)) E('span', 'w-launcher', g, '↘');
          return body2;
        };
        let g = grp('Clipboard', 'g-clip');
        const paste = E('div', 'w-paste', g);
        icon(E('div', 'w-pico', paste), 'paste');
        E('div', '', paste, 'Paste');
        E('span', 'w-pdrop', paste, '▾');
        const sm = E('div', 'w-small', g);
        for (const [ic, t, dis] of [
          ['cut', 'Cut', 1],
          ['copy', 'Copy', 1],
          ['paint', 'Format Painter', 0],
        ]) {
          const r = E('div', 'w-srow' + (dis ? ' dis' : ''), sm);
          icon(E('span', 'w-sic', r), ic);
          E('span', '', r, t);
        }
        g = grp('Font', 'g-font');
        const r1 = E('div', 'w-row', g);
        for (const [c, t] of [
          ['wide', 'Segoe UI'],
          ['sz', '11'],
        ]) {
          const b = E('div', 'w-combo ' + c, r1);
          E('span', '', b, t);
          E('span', 'w-arrow', b, '▾');
        }
        const grow = E('span', 'w-grow', r1);
        E('span', '', grow, 'A');
        E('sup', '', grow, '▴');
        const shrink = E('span', 'w-grow shrink', r1);
        E('span', '', shrink, 'A');
        E('sup', '', shrink, '▾');
        const r2 = E('div', 'w-row', g);
        for (const [t, s] of [
          ['B', 'font-weight:700'],
          ['I', 'font-style:italic'],
          ['U', 'text-decoration:underline'],
          ['abc', 'text-decoration:line-through;font-size:.7em'],
          ['x²', 'font-weight:700'],
        ]) {
          const b = E('span', 'w-fb', r2, t);
          b.style.cssText = s;
        }
        icon(E('span', 'w-fb highlighter', r2), 'highlight');
        E('span', 'w-arrow', r2, '▾');
        const color = E('span', 'w-fb color', r2, 'A');
        E('span', 'w-arrow', r2, '▾');
        g = grp('Paragraph', 'g-par');
        const p1 = E('div', 'w-row', g);
        const lineIcon = (parent, kind) => {
          const holder = E('span', 'w-paricon ' + kind, parent);
          const s = u.svg(
            'svg',
            { viewBox: '0 0 30 30', fill: 'none', stroke: '#172e40', 'stroke-width': 1.8 },
            holder,
          );
          for (let j = 0; j < 4; j++) {
            const y = 5 + j * 6;
            let x = kind === 'right' ? 10 : kind === 'center' ? 6 : 3;
            let end = kind === 'left' && j % 2 ? 20 : 27;
            if (kind === 'bullets' || kind === 'numbers' || kind === 'levels') x = 12;
            u.svg('path', { d: `M${x} ${y}H${end}` }, s);
            if (kind === 'bullets') u.svg('circle', { cx: 4, cy: y, r: 1.4, fill: '#164986', stroke: 'none' }, s);
            if (kind === 'numbers') {
              const n = u.svg('text', { x: 1, y: y + 2, fill: '#164986', stroke: 'none', 'font-size': 8 }, s);
              n.textContent = String(j + 1);
            }
            if (kind === 'levels') {
              const n = u.svg('text', { x: 1 + j, y: y + 2, fill: '#164986', stroke: 'none', 'font-size': 8 }, s);
              n.textContent = j % 2 ? 'a' : '1';
            }
          }
          return holder;
        };
        for (const name of ['bullets', 'numbers', 'levels']) {
          lineIcon(p1, name);
          E('span', 'w-arrow', p1, '▾');
        }
        for (const t of ['⇤', '⇥', '¶']) E('span', 'w-fb parletter', p1, t);
        const p2 = E('div', 'w-row', g);
        for (const name of ['left', 'center', 'right', 'justify']) {
          const b = lineIcon(p2, name);
          if (name === 'left') b.classList.add('sel');
        }
        E('span', 'w-fb parletter', p2, '↕');
        E('span', 'w-arrow', p2, '▾');
        icon(E('span', 'w-fb', p2), 'shade');
        E('span', 'w-arrow', p2, '▾');
        icon(E('span', 'w-fb', p2), 'border');
        g = grp('Styles', 'g-sty');
        const sr = E('div', 'w-row sty', g);
        for (const [t, c] of [
          ['Normal', 'n'],
          ['Heading 1', 'h1'],
          ['Heading 2', 'h2'],
          ['Title', 'tt'],
        ]) {
          const s = E('div', 'w-style ' + c + (c === 'n' ? ' on' : ''), sr);
          E('div', 'w-aa', s, 'AaBbCc');
          E('div', 'w-sn', s, t);
        }
        E('span', 'w-style-scroll', sr, '▴\n▾\n▾');
        g = grp('Editing', 'g-edit');
        for (const [ic, t] of [
          ['find', 'Find'],
          ['replace', 'Replace'],
          ['select', 'Select ▾'],
        ]) {
          const r = E('div', 'w-erow', g);
          icon(E('span', 'w-eic', r), ic);
          E('span', '', r, t);
        }
        const display = ctx.display === 'panel' && document.documentElement.clientWidth < 1150 ? 'header' : ctx.display;
        const content = E('div', 'w-content', sh);
        const note = E('section', 'task-note w-note', content);
        if (display === 'hidden') note.hidden = true;
        else if (display === 'toast') {
          note.classList.add('instruction-toast');
          const x = E('button', 'note-close', note, '×');
          x.type = 'button';
          x.onclick = () => (note.style.visibility = 'hidden');
        } else if (display === 'panel') {
          note.classList.add('instruction-panel');
          content.classList.add('with-panel');
        }
        E('span', 'w-info', note, 'i');
        E('div', 'instruction', note, ctx.instruction);
        const stage = E('main', 'stage w-stage', content);
        stage.dataset.role = 'stage';
        const foot = E('footer', 'w-status', sh);
        for (const t of ['Page 1 of 1', '131 words', 'English (United States)']) E('span', 'w-st', foot, t);
        E('span', 'w-sp', foot);
        const views = E('div', 'w-views', foot);
        for (const n of ['view1', 'view2', 'view3']) icon(E('span', n === 'view1' ? 'selected' : '', views), n);
        const zoom = E('div', 'w-zoom', foot);
        E('span', 'zoom-minus', zoom, '−');
        E('span', 'zoom-circle', zoom);
        const track = E('span', 'zoom-track', zoom);
        E('span', 'zoom-thumb', track);
        E('span', 'zoom-plus', zoom, '+');
        E('span', 'zoom-value', zoom, '100%');
        // Independent streams keep all existing episode and widget draws unchanged.
        const er = ctx.rng.fork('chrome/end'),
          cr = ctx.rng.fork('chrome/collide');
        const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
        const labels = ctx.content.END_LABELS.map(labelOf);
        const original = er.bool(0.5),
          placement = original ? 'footer' : er.pick(['toolbar', 'link']);
        const endLabel = original ? 'Submit' : er.pick(labels);
        const tools = E('div', 'w-tabtools', tabs);
        let submit = null;
        if (!ctx.finish) {
          submit = E(
            'button',
            'submit w-submit' + (placement === 'toolbar' ? ' w-toolbar-end' : placement === 'link' ? ' w-endlink' : ''),
            placement === 'toolbar' ? tools : foot,
            endLabel,
          );
          submit.type = 'button';
          submit.dataset.role = 'submit';
          submit.title = endLabel;
          submit.setAttribute('aria-label', endLabel);
          submit.onclick = () => ctx.submit();
          if (placement === 'link') foot.insertBefore(submit, foot.firstChild);
        }
        if (cr.bool(0.3)) {
          const options = labels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
          if (options.length) {
            const label = cr.pick(options),
              b = E('button', 'w-chrome-xtra', tools, label);
            b.type = 'button';
            b.dataset.role = 'xtra';
            b.onclick = () => env.log('decoy', { label, collide: true });
          }
        }
        return { stage, submit };
      }
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
