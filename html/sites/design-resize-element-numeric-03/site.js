(function () {
  'use strict';
  const C = {
    'title': 'Canvas Studio',
    'menu': ['File', 'Edit', 'View', 'Image', 'Layer', 'Select', 'Filter', 'Tools', 'Help'],
    'accent': '#b8913f',
    'bg': '#e9e8e2',
    'surface': '#fbf7ea',
    'font': "Georgia,'Times New Roman',serif",
  };

  const ICONS = {
    New: 'M7 3H20L26 9V29H7ZM20 3V9H26',
    Open: 'M3 9H12L15 12H28V26H3ZM3 26L8 15H31L27 26',
    Save: 'M4 4H24L28 8V28H4ZM9 4V11H21V4M9 28V18H23V28',
    Undo: 'M12 3L2 11L12 19V13H18C28 13 28 26 18 27C33 29 35 7 18 7H12Z',
    Redo: 'M20 3L30 11L20 19V13H14C4 13 4 26 14 27C-1 29 -3 7 14 7H20Z',
    Crop: 'M9 2V23H30M2 9H23V30',
    Resize: 'M4 12V4H12M20 4H28V12M28 20V28H20M12 28H4V20M5 5L12 12M27 5L20 12M27 27L20 20M5 27L12 20',
    Rotate: 'M26 16A10 10 0 1 1 20 7M20 2V8H26',
    Flip: 'M16 3V29M13 8L4 26H13ZM19 8L28 26H19Z',
    Select: 'M8 3V26L13 21L17 29L21 27L17 19H24Z',
    Brush: 'M26 4L14 17L17 20L29 8ZM13 18Q6 18 6 26Q12 26 15 21',
    Eraser: 'M4 20L16 6L28 16L18 28H10ZM10 14L22 24',
    Fill: 'M6 16L16 5L26 15L16 26ZM27 20Q30 25 27 27Q24 25 27 20',
    Text: 'M5 5H27M16 5V28M11 28H21',
    'Bring Forward': 'M5 5H20V20H5ZM12 12H27V27H12Z',
    'Send Backward': 'M12 12H27V27H12ZM5 5H20V20H5Z',
    Align: 'M6 4V28M6 8H24M6 15H17M6 22H22',
    Group: 'M5 5H27V27H5Z',
    Fit: 'M3 11V3H11M17 3H25V11M3 17V25H11M14 9A7 7 0 1 1 14 23A7 7 0 1 1 14 9M19 21L28 29',
    '100%': 'M13 4A9 9 0 1 1 13 22A9 9 0 1 1 13 4M20 20L28 28',
    Grid: 'M4 4H28V28H4ZM12 4V28M20 4V28M4 12H28M4 20H28',
  };
  const GROUPS = [
    ['Canvas', ['New', 'Open', 'Save', '|', 'Undo', 'Redo']],
    ['Edit', ['Crop', 'Resize', 'Rotate', 'Flip']],
    ['Tools', ['Select', 'Brush', 'Eraser', 'Fill', 'Text']],
    ['Arrange', ['Bring Forward', 'Send Backward', 'Align', 'Group']],
    ['View', ['Fit', '100%', 'Grid']],
  ];

  env.site({
    name: 'design-resize-element-numeric-03',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className =
        'design wooden' +
        (ctx.display === 'toast' ? ' has-instruction-toast' : '') +
        (ctx.display === 'hidden' ? ' note-hidden' : '');
      // Separate streams keep every existing frame and widget draw unchanged.
      const endR = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = endR.bool(0.5);
      const placement = referenceEnd ? 'footer' : endR.pick(['titlebar', 'link']);
      const endLabel = referenceEnd ? 'Submit' : endR.pick(endLabels);
      const collideR = ctx.rng.fork('chrome/collide');
      const collideLabels = endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = collideR.bool(0.3) && collideLabels.length ? collideR.pick(collideLabels) : null;
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.surface,
        fg: '#1d140c',
        muted: '#6a5a46',
        line: '#b99a5c',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', body),
        head = u.el('header', 'head', shell);
      const bar = u.el('div', 'titlebar', head);
      const logo = u.svg('svg', { class: 'logo', width: 30, height: 30, viewBox: '0 0 32 32' }, bar);
      u.svg(
        'path',
        {
          d: 'M16 6Q9 1 3 7V28Q9 23 16 29Q23 23 29 28V7Q23 1 16 6ZM16 6V29M6 8Q10 6 13 9V23Q9 21 6 23ZM19 9Q23 6 26 8V23Q22 21 19 23Z',
          fill: '#d9b560',
          stroke: '#271d0d',
          'stroke-width': 1.5,
          'stroke-linejoin': 'round',
        },
        logo,
      );
      u.el('div', 'title', bar, C.title);
      u.el('span', 'sep', bar, '');
      const nav = u.el('nav', 'menu', bar);
      for (const m of C.menu) u.el('span', 'mi', nav, m);
      const controls = u.el('div', 'window-controls', bar);
      for (const [label, d] of [
        ['−', 'M4 11H14'],
        ['□', 'M4 4H14V14H4Z'],
        ['×', 'M4 4L14 14M14 4L4 14'],
      ]) {
        const bt = u.el('button', '', controls);
        bt.type = 'button';
        bt.setAttribute('aria-label', label);
        const s = u.svg(
          'svg',
          { width: 18, height: 18, viewBox: '0 0 18 18', fill: 'none', stroke: '#fff', 'stroke-width': 2.2 },
          bt,
        );
        u.svg('path', { d }, s);
        bt.onclick = () => env.log('window-control', { label });
      }
      const rib = u.el('div', 'ribbon', head);
      for (const [gname, items] of GROUPS) {
        const gr = u.el('div', 'tool-group g-' + gname.toLowerCase(), rib);
        u.el('div', 'gname', gr, gname);
        const row = u.el('div', 'tools', gr);
        for (const t of items) {
          if (t === '|') {
            u.el('i', 'vsep', row);
            continue;
          }
          const bt = u.el('button', 'tool' + (t === 'Select' ? ' selected' : '') + (t === 'Redo' ? ' dim' : ''), row);
          bt.type = 'button';
          const ic = u.svg(
            'svg',
            {
              width: 34,
              height: 34,
              viewBox: '0 0 32 32',
              fill: 'none',
              stroke: t === 'Redo' ? '#a09a90' : '#3a2a1a',
              'stroke-width': 2,
              'stroke-linejoin': 'round',
              'stroke-linecap': 'round',
            },
            bt,
          );
          u.svg('path', { d: ICONS[t] || ICONS.Grid }, ic);
          const lab = u.el('span', '', bt, t);
          if (t === 'Align') lab.textContent = 'Align ▾';
          if (['Select', 'Brush', 'Eraser', 'Fill', 'Save', 'Flip', 'Undo', 'Redo'].includes(t))
            ic.firstChild.setAttribute('fill', t === 'Redo' ? '#99968f' : '#302e29');
          if (t === 'New') ic.firstChild.setAttribute('fill', '#fffdf6');
          if (t === 'Open') ic.firstChild.setAttribute('fill', '#c6a45e');
          if (t === 'Save') {
            u.svg('path', { d: 'M10 4H21V11H10ZM10 19H22V28H10', fill: '#fffdf6', stroke: 'none' }, ic);
          }
          if (t === 'Eraser')
            u.svg(
              'path',
              { d: 'M4 20L10 14L22 24L18 28H10Z', fill: '#fffdf6', stroke: '#302e29', 'stroke-width': 1.5 },
              ic,
            );
          if (t === 'Bring Forward' || t === 'Send Backward')
            u.svg(
              'path',
              {
                d: t === 'Bring Forward' ? 'M5 5H20V20H5Z' : 'M12 12H27V27H12Z',
                fill: '#c1a05e',
                stroke: '#302e29',
                'stroke-width': 1.5,
              },
              ic,
            );
          if (t === 'Group') ic.firstChild.setAttribute('stroke-dasharray', '3 2');
          if (t === 'Fill')
            u.svg(
              'path',
              {
                d: 'M11 9L9 5Q13 0 17 5L21 10M5 16L12 23L18 17M27 20Q32 27 27 29Q22 27 27 20Z',
                fill: '#fffaf0',
                stroke: '#302e29',
                'stroke-width': 1.4,
              },
              ic,
            );
          bt.onclick = () => {
            rib.querySelectorAll('.tool').forEach((x) => x.classList.remove('selected'));
            bt.classList.add('selected');
          };
        }
      }
      const content = u.el('div', 'content', shell),
        note = u.el('section', 'task-note', content);
      for (const p of ['tl', 'tr', 'bl', 'br']) u.el('i', 'pin ' + p, note);
      u.el('div', 'note-label', note, '');
      u.el('div', 'instruction', note, ctx.instruction);
      u.el('hr', 'note-rule', note);
      const ul = u.el('ul', 'note-list', note);
      u.el('li', 'instruction-sub', ul, 'Drag the bottom-right corner of the panel to resize it.');
      u.el('li', '', ul, 'The panel’s current size is shown on the right.');
      u.el('li', '', ul, 'Match the target size exactly (within tolerance).');
      u.el('li', '', ul, 'Use only the mouse. No typing is required.');
      if (ctx.display === 'hidden') note.classList.add('note-bare');
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const stage = u.el('main', 'stage', content);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', shell);
      u.el('span', 'fs', footer, '1000 × 562 px');
      u.el('i', 'fsep', footer);
      u.el('span', 'fs', footer, 'Zoom: 100% ▾');
      u.el('i', 'fsep', footer);
      u.el('span', 'fs', footer, 'Layer:  Background');
      u.el('span', 'grow', footer, '');
      if (collide) {
        const decoy = u.el('button', 'chrome-xtra', footer, collide);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', { label: collide, collide: true });
      }
      u.el('i', 'fsep', footer);
      const rd = u.el('span', 'fs ready', footer);
      u.el('i', 'led', rd);
      u.el('span', '', rd, 'Ready');
      let submit = null;
      if (!ctx.finish) {
        if (placement !== 'titlebar') u.el('i', 'fsep', footer);
        submit = u.el(
          'button',
          'submit' + (placement === 'titlebar' ? ' submit-titlebar' : placement === 'link' ? ' submit-link' : ''),
          placement === 'titlebar' ? bar : footer,
          endLabel,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.onclick = () => ctx.submit();
      }
      const edit = nav.querySelectorAll('.mi')[1];
      edit.style.cursor = 'pointer';
      const editMenu = u.el('div', 'edit-menu', bar);
      editMenu.hidden = true;
      const reset = u.el('button', '', editMenu, 'Reset panel');
      reset.onclick = () => {
        env.widgetDef.clear?.();
        editMenu.hidden = true;
      };
      edit.onclick = () => {
        editMenu.hidden = !editMenu.hidden;
      };
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title = {
        cookie: 'Your privacy',
        toast: 'Changes saved',
        chat: 'Support',
        promo: 'Studio update',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This application stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with this workspace?',
        promo: 'Explore the latest studio features.',
        banner: 'You are viewing a shared canvas.',
      }[kind];
      const label = kind === 'cookie' ? 'Reject optional' : 'Close';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, label);
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
