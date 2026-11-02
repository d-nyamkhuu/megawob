// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-point-right-angle-03',
    styles: ['site.css', 'organizer.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'ribbon',
        'theme': 'eink',
        'title': 'Angle Practice',
        'ribbon': true,
        'foot': 'Click a point in the workspace to place a marker.',
        'accent': '#111',
        'bg': '#eeede9',
        'surface': '#f2f1ed',
        'font': 'Georgia, serif',
      },
      parts: {
        'frame.1': (base, S) =>
          function (_c) {
            const { ctx } = _c;
            {
              const u = ctx.util,
                body = document.body;
              body.className = 'design org' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
              const root = document.documentElement;
              for (const [k, v] of Object.entries({
                bg: '#cfc3b0',
                panel: '#f7f1e1',
                fg: '#2a1d12',
                muted: '#6b5a48',
                line: '#cdbfa5',
                accent: '#1f4f8f',
              }))
                root.style.setProperty('--' + k, v);
              root.style.setProperty('--font', 'Georgia, "Times New Roman", serif');
              const shell = u.el('div', 'shell', body);
              const binding = u.el('div', 'binder-hardware', shell);
              u.el('i', '', binding);
              u.el('i', '', binding);
              const head = u.el('header', 'head', shell);
              u.el('span', 'brass', head);
              u.el('div', 'title', head, 'Geometry Practice');
              const tabs = u.el('nav', 'org-tabs', head);
              ['Problems', 'Notes', 'My Work'].forEach((t, i) => {
                const b = u.el('button', 'org-tab' + (i === 0 ? ' on' : ''), tabs, t);
                b.type = 'button';
                b.onclick = () => {
                  tabs.querySelectorAll('.org-tab').forEach((x) => x.classList.remove('on'));
                  b.classList.add('on');
                };
              });
              const content = u.el('div', 'content', shell);
              const side = u.el('nav', 'org-side', content);
              ['1. Construct', '2. Explore', '3. Review', '4. Finish'].forEach((t, i) => {
                const b = u.el('button', 'org-step' + (i === 0 ? ' on' : ''), side, t);
                b.type = 'button';
                b.onclick = () => {
                  side.querySelectorAll('.org-step').forEach((x) => x.classList.remove('on'));
                  b.classList.add('on');
                };
              });
              const page = u.el('div', 'org-page', content);
              const note = u.el('section', 'task-note', page);
              u.el('div', 'note-label', note, '');
              const instruction = u.el('div', 'instruction', note);
              const sentences = ctx.instruction.match(/^(.*?\.)(\s+.*)$/s);
              if (sentences) {
                u.el('strong', '', instruction, sentences[1]);
                u.el('span', 'instruction-second', instruction, sentences[2].trim());
              } else instruction.textContent = ctx.instruction;
              if (ctx.display === 'hidden') note.hidden = true;
              else if (ctx.display === 'toast') {
                note.classList.add('instruction-toast');
                u.el('span', 'note-mode-label', note, 'Notice');
                const x = u.el('button', 'note-close', note, '×');
                x.onclick = () => (note.style.visibility = 'hidden');
              } else if (ctx.display === 'panel') {
                note.classList.add('instruction-panel');
                u.el('span', 'note-mode-label', note, 'Instructions');
              }
              const stage = u.el('main', 'stage', page);
              stage.dataset.role = 'stage';
              const footer = u.el('footer', 'footer', page);
              const reset = u.el('button', 'clear', footer);
              reset.type = 'button';
              const ic = u.svg(
                'svg',
                {
                  width: 30,
                  height: 30,
                  viewBox: '0 0 32 32',
                  fill: 'none',
                  stroke: 'currentColor',
                  'stroke-width': 3,
                },
                reset,
              );
              u.svg('path', { d: 'M27 17A12 12 0 1 1 23 7M27 3V12H18' }, ic);
              u.el('span', '', reset, 'Reset');
              reset.onclick = () => {
                env.widgetDef.clear?.();
              };
              let submit = null;
              if (!ctx.finish) {
                const endRng = ctx.rng.fork('chrome/end'),
                  collideRng = ctx.rng.fork('chrome/collide');
                const endBank =
                  ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                    ? ctx.content.END_LABELS
                    : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
                const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
                const submitOption = endBank.find((x) => labelOf(x).trim().toLowerCase() === 'submit');
                const alternateLabels = endBank.filter((x) => labelOf(x).trim().toLowerCase() !== 'submit');
                const commonPick = endRng.bool(0.5);
                const label = commonPick
                  ? labelOf(submitOption || 'Submit')
                  : labelOf(endRng.pick(alternateLabels.length ? alternateLabels : endBank));
                const placement = commonPick ? 'footer' : endRng.pick(['footer', 'header', 'header', 'link']);
                const collide = collideRng.bool(0.3);
                let collisionLabel = null;
                if (collide) {
                  const options = endBank
                    .map(labelOf)
                    .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
                  if (options.length) collisionLabel = collideRng.pick(options);
                }
                const makeEnd = (parent, asLink) => {
                  const b = u.el(asLink ? 'a' : 'button', asLink ? 'submit-link' : 'submit', parent, label);
                  if (asLink) {
                    b.href = '#';
                  } else b.type = 'button';
                  b.dataset.role = 'submit';
                  b.title = label;
                  b.setAttribute('aria-label', label);
                  b.onclick = (e) => {
                    e.preventDefault();
                    ctx.submit();
                  };
                  return b;
                };
                const decoy = (parent, text) => {
                  const b = u.el('button', 'end-xtra', parent, text);
                  b.type = 'button';
                  b.dataset.role = 'xtra';
                  b.onclick = () => env.log('decoy', { label: text, collide: true });
                };
                if (placement === 'header') {
                  const tools = u.el('div', 'org-head-tools', head);
                  if (collisionLabel) decoy(tools, collisionLabel);
                  submit = makeEnd(tools, false);
                } else {
                  if (collisionLabel) decoy(footer, collisionLabel);
                  submit = makeEnd(footer, placement === 'link');
                }
              }
              const pal = u.el('aside', 'palette', body);
              const ph = u.el('div', 'pal-head', pal);
              u.el('span', '', ph, 'Tools');
              const px = u.el('button', 'pal-x', ph, '×');
              px.type = 'button';
              px.setAttribute('aria-label', 'Close tools');
              px.onclick = () => (pal.hidden = true);
              const pb = u.el('div', 'pal-body', pal);
              const sel = u.el('div', 'pal-tool', pb);
              u.svg('svg', { width: 34, height: 40, viewBox: '0 0 32 38' }, u.el('span', 'pal-icon', sel)).appendChild(
                u.svg('path', {
                  d: 'M4 2V30L11 23L16 34L21 32L16 21H26Z',
                  fill: '#222',
                  stroke: '#fff',
                  'stroke-width': 1.5,
                }),
              );
              u.el('div', 'pal-name', pb, 'Select');
              u.el('div', 'pal-hint', pb, 'Click on the canvas to place a point.');
              return { stage, submit };
            }
            const u = ctx.util,
              body = document.body;
            Object.assign(_c, { body, u });
          },
        'frame.3': () => () => {},
        'frame.12': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
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
                  {
                    width: 32,
                    height: 34,
                    viewBox: '0 0 32 32',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': 1.8,
                  },
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
          },
        'frame.22': () => () => {},
      },
    },
  });
})();
