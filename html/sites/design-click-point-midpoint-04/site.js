// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  const beos = (ctx) => {
    const u = ctx.util,
      body = document.body;
    body.className = 'design beos' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
    const sv = (p, parent, w, h) => {
      const s = u.svg(
        'svg',
        {
          width: w || 40,
          height: h || 40,
          viewBox: '0 0 40 40',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': 2.4,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        },
        parent,
      );
      u.svg('path', { d: p }, s);
      return s;
    };
    const shell = u.el('div', 'shell', body),
      head = u.el('header', 'head', shell);
    const tab = u.el('div', 'bt-tab', head);
    const ic = u.svg('svg', { width: 24, height: 26, viewBox: '0 0 20 22', class: 'bt-ico' }, tab);
    u.svg('rect', { x: 1, y: 1, width: 18, height: 20, fill: '#f6f5ed', stroke: '#111', 'stroke-width': 1.5 }, ic);
    u.svg('path', { d: 'M4 18V9H8V18M12 18V5H15V18M3 12H17', stroke: '#223044', 'stroke-width': 2 }, ic);
    u.svg('path', { d: 'M5 4L14 16M14 3L6 18', stroke: '#151515', 'stroke-width': 1.5 }, ic);
    u.svg('rect', { x: 5, y: 8, width: 4, height: 4, fill: '#c73025' }, ic);
    u.svg('rect', { x: 11, y: 12, width: 4, height: 5, fill: '#276da0' }, ic);
    u.el('span', '', tab, 'Point Tool');
    u.el('div', 'bt-os', head, 'BeOS');
    const wc = u.el('div', 'bt-wc', head);
    for (const l of ['min', 'max', 'close']) {
      const b = u.el('button', '', wc);
      b.type = 'button';
      b.onclick = () => env.log('window-control', { label: l });
      const s = u.svg(
        'svg',
        { width: 14, height: 14, viewBox: '0 0 14 14', fill: 'none', stroke: '#000', 'stroke-width': 2 },
        b,
      );
      u.svg('path', { d: l === 'min' ? 'M2 11H12' : l === 'max' ? 'M2 2H12V12H2Z' : 'M2 2L12 12M12 2L2 12' }, s);
    }
    const rib = u.el('div', 'ribbon', shell);
    const grp = (n, cls) => {
      const g = u.el('fieldset', 'bt-g ' + (cls || ''), rib);
      u.el('legend', '', g, n);
      return g;
    };
    const tool = (g, n, p, sel) => {
      const b = u.el('button', 'bt-tool' + (sel ? ' selected' : ''), g);
      b.type = 'button';
      b.dataset.tool = n;
      const icon = sv(p, b, 38, 38);
      if (n === 'Select') icon.firstChild.setAttribute('fill', '#090b10');
      if (n.startsWith('Zoom')) {
        u.svg('circle', { cx: 17, cy: 17, r: 8, fill: '#a9ccfc', stroke: 'none' }, icon);
        icon.appendChild(icon.firstChild);
      }
      u.el('span', '', b, n);
      b.onclick = () => {
        rib.querySelectorAll('.bt-tool').forEach((x) => x.classList.remove('selected'));
        b.classList.add('selected');
      };
    };
    const g1 = grp('Tools', 'g-tools');
    tool(g1, 'Select', 'M10 4V32L16 26L21 36L25 34L20 24H29Z', true);
    tool(g1, 'Point', 'M20 20m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0');
    tool(g1, 'Line', 'M4 36L36 4');
    tool(g1, 'Rectangle', 'M4 6H36V33H4Z');
    const g2 = grp('View', 'g-view');
    tool(g2, 'Zoom In', 'M17 17m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0M24 24L33 33M17 13V21M13 17H21');
    tool(g2, 'Zoom Out', 'M17 17m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0M24 24L33 33M13 17H21');
    tool(g2, 'Pan', 'M20 5V35M5 20H35M16 9L20 5L24 9M16 31L20 35L24 31M9 16L5 20L9 24M31 16L35 20L31 24');
    const g3 = grp('Options', 'g-opt');
    for (const [t, c] of [
      ['Show labels', 1],
      ['Snap to grid', 1],
      ['Show grid', 0],
    ]) {
      const l = u.el('label', 'bt-chk', g3);
      const i = u.el('input', '', l);
      i.type = 'checkbox';
      i.checked = !!c;
      u.el('span', '', l, t);
    }
    const g4 = grp('Help', 'g-help');
    const hb = u.el('button', 'bt-tool', g4);
    hb.type = 'button';
    const hs = u.svg('svg', { width: 40, height: 40, viewBox: '0 0 40 40' }, hb);
    u.svg('circle', { cx: 20, cy: 20, r: 16, fill: '#1d4fc4', stroke: '#123a96', 'stroke-width': 1.5 }, hs);
    const q = u.svg(
      'text',
      { x: 20, y: 28, 'text-anchor': 'middle', 'font-size': 24, 'font-weight': 'bold', fill: '#fff' },
      hs,
    );
    q.textContent = '?';
    u.el('span', '', hb, 'Help');
    const content = u.el('div', 'content', shell),
      note = u.el('section', 'task-note', content);
    u.el('div', 'note-label', note, '');
    u.el('div', 'instruction', note, ctx.instruction);
    if (ctx.display === 'hidden') note.hidden = true;
    else if (ctx.display === 'toast') {
      note.classList.add('instruction-toast');
      const x = u.el('button', 'note-close', note, '×');
      x.onclick = () => (note.style.visibility = 'hidden');
    } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
    const stage = u.el('main', 'stage', content);
    stage.dataset.role = 'stage';
    const footer = u.el('footer', 'footer', shell);
    u.el('div', 'bt-s1', footer, 'Ready.');
    u.el('div', 'footer-copy', footer, 'Click on the canvas to place a point.');
    const xy = u.el('div', 'bt-xy', footer);
    u.el('span', '', xy, 'X: —');
    u.el('span', '', xy, 'Y: —');
    let submit = null;
    let placement = null,
      label = 'Submit';
    if (!ctx.finish) {
      const er = ctx.rng.fork('chrome/end');
      const legacy = er.bool(0.5);
      placement = legacy ? 'footer' : er.pick(['ribbon', 'link']);
      const ends = (
        ctx.content.END_LABELS || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
          "I'm done",
        ]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      label = legacy
        ? 'Submit'
        : ends.filter((x) => x.toLowerCase() !== 'submit').length
          ? er.pick(ends.filter((x) => x.toLowerCase() !== 'submit'))
          : 'Done';
      if (placement === 'ribbon') rib.classList.add('has-end-control');
      const parent = placement === 'ribbon' ? rib : footer;
      submit = u.el(
        placement === 'link' ? 'a' : 'button',
        placement === 'ribbon' ? 'beos-end-ribbon' : placement === 'link' ? 'submit beos-endlink' : 'submit',
        parent,
        label,
      );
      if (placement === 'link') submit.href = '#';
      else submit.type = 'button';
      submit.dataset.role = 'submit';
      submit.setAttribute('aria-label', label);
      submit.title = label;
      submit.onclick = (e) => {
        e.preventDefault();
        ctx.submit();
      };
    }
    const cr = ctx.rng.fork('chrome/collide');
    if (cr.bool(0.3)) {
      const ends = (
        ctx.content.END_LABELS || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
          "I'm done",
        ]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      const choices = ends.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
      if (choices.length) {
        const text = cr.pick(choices),
          inRibbon = placement !== 'ribbon' && cr.bool(0.5),
          parent = inRibbon ? rib : footer;
        if (inRibbon) rib.classList.add('has-end-control');
        const decoy = u.el('button', inRibbon ? 'beos-end-xtra beos-ribbon-xtra' : 'beos-end-xtra', parent, text);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', { label: text, collide: true });
      }
    }
    return { stage, submit };
  };
  env.site({
    name: 'design-click-point-midpoint-04',
    styles: ['site.css', 'beos.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'ribbon',
        'theme': 'beos',
        'title': 'Point Tool',
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
            const { C } = S;
            const { ctx } = _c;
            if (C.theme === 'beos') return beos(ctx);
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
