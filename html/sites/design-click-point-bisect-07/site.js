(function () {
  'use strict';
  const C = {
    'title': 'Angle Practice',
    'accent': '#111',
    'bg': '#8f929a',
    'surface': '#f8f8f6',
    'font': '"Courier New", monospace',
  };
  env.site({
    name: 'design-click-point-bisect-07',
    styles: ['site.css', 'risc.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design risc' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.surface,
        fg: '#111',
        muted: '#444',
        line: '#222',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', body);
      shell.style.cssText = 'position:absolute;inset:0;padding:0;display:block';
      const bar = u.el('header', 'rk-bar', shell);
      const os = u.el('div', 'rk-os', bar);
      const logo = u.svg('svg', { width: 34, height: 38, viewBox: '0 0 34 38', 'shape-rendering': 'crispEdges' }, os);
      u.svg(
        'path',
        {
          d: 'M5 35V28L8 25L5 19L6 12L11 9L10 4L14 2L18 5L24 3L26 8L30 10L28 17L31 22L27 29L30 35Z',
          fill: '#080b13',
          stroke: '#000',
          'stroke-width': 1.5,
        },
        logo,
      );
      for (const [x, y, c] of [
        [11, 8, '#65d728'],
        [18, 6, '#f2d72f'],
        [23, 10, '#3db326'],
        [8, 15, '#169c36'],
        [15, 13, '#f34321'],
        [22, 17, '#f1d922'],
        [12, 21, '#279cec'],
        [18, 23, '#1e65df'],
        [25, 23, '#179e49'],
        [7, 25, '#3763c7'],
        [18, 16, '#fce632'],
      ])
        u.svg('path', { d: `M${x - 2} ${y - 3}h4l2 3-2 4h-4l-1-3Z`, fill: c, stroke: '#111', 'stroke-width': 1 }, logo);
      u.svg('path', { d: 'M5 35H30V37H4ZM10 28H13V34H10ZM21 28H24V34H21', fill: '#101329' }, logo);
      u.el('span', '', os, 'RISC OS');
      const icons = [
        ['Files', 16.9, 'M3 6H13L16 9H29V28H3Z', '#e8d84a'],
        ['Apps', 25.4, 'M16 3L28 9V22L16 29L4 22V9Z M4 9L16 15L28 9 M16 15V29', '#5a6fd8'],
        ['Settings', 33.8, 'M3 27L17 13A6 6 0 1 1 25 5L21 9L23 11L27 7A6 6 0 0 1 19 15L5 29Z', '#9aa0ac'],
        ['Help', 42.3, 'M16 3A13 13 0 1 0 16.1 3ZM12 12Q12 7 16 7Q21 7 20 12Q19 15 16 17V19M16 22V24', '#eef'],
      ];
      for (const [name, x, d, col] of icons) {
        const it = u.el('div', 'rk-ico', bar);
        it.style.left = x + '%';
        it.style.transform = 'translateX(-50%)';
        const s = u.svg('svg', { viewBox: '0 0 32 32' }, it);
        if (name === 'Apps') {
          u.svg(
            'path',
            { d: 'M6 10L9 8H24L27 11L24 28L17 31L9 28Z', fill: '#aaaed8', stroke: '#121523', 'stroke-width': 1.3 },
            s,
          );
          u.svg(
            'path',
            {
              d: 'M7 11L17 15L27 11M17 15V29M10 14L12 26M23 15L22 27M5 11L3 13V20L7 22M27 12L30 14V20L26 22',
              fill: 'none',
              stroke: '#333864',
              'stroke-width': 1,
            },
            s,
          );
          u.svg(
            'path',
            { d: 'M9 8V5L13 2H21L24 5V9L28 11L19 15L7 11Z', fill: '#414ecc', stroke: '#10152e', 'stroke-width': 1.2 },
            s,
          );
          u.svg(
            'path',
            { d: 'M12 3H21M9 9L17 12L24 10M11 18V22M21 19V23', fill: 'none', stroke: '#7788e7', 'stroke-width': 1.4 },
            s,
          );
        } else {
          u.svg('path', { d, fill: col, stroke: '#171b23', 'stroke-width': 1.5 }, s);
          if (name === 'Files')
            u.svg('path', { d: 'M4 8H12L15 11H28M4 10V27H27', fill: 'none', stroke: '#faf197', 'stroke-width': 1 }, s);
          if (name === 'Settings')
            u.svg(
              'path',
              { d: 'M5 26L18 13M18 7L19 5M22 15L25 13', fill: 'none', stroke: '#e1e3e7', 'stroke-width': 1 },
              s,
            );
        }
        u.el('span', '', it, name);
      }
      u.el('div', 'rk-clock', bar, '10:24');
      const win = u.el('section', 'rk-win', shell);
      const tb = u.el('div', 'rk-title', win);
      const gadget = u.el('i', '', tb);
      const gs = u.svg('svg', { viewBox: '0 0 28 28' }, gadget);
      u.svg(
        'path',
        { d: 'M7 7L9 10M18 6L17 10M6 18L10 17M18 18L21 21M13 12V16', stroke: '#444', 'stroke-width': 1.5 },
        gs,
      );
      u.svg('circle', { cx: 14, cy: 14, r: 1.5, fill: '#333' }, gs);
      u.el('span', '', tb, C.title);
      const close = u.el('button', 'rk-close', tb, '×');
      close.type = 'button';
      close.onclick = () => env.log('window-control', { label: '×' });
      const bodyEl = u.el('div', 'rk-body', win);
      const content = bodyEl;
      const note = u.el('section', 'task-note', content);
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
      const endR = ctx.rng.fork('chrome/end');
      const endLabels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const standard = endR.bool(0.5),
        placement = standard ? 'footer' : endR.pick(['bar', 'title']);
      const endLabel = standard
        ? labelOf(endLabels.find((x) => labelOf(x).trim().toLowerCase() === 'submit') || 'Submit')
        : labelOf(endR.pick(endLabels));
      const collideR = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (collideR.bool(0.3)) {
        const choices = [
          ...new Set(endLabels.map(labelOf).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase())),
        ];
        if (choices.length) collision = labelOf(collideR.pick(choices));
      }
      const makeEnd = (parent, cls, label) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.onclick = () => ctx.submit();
        return b;
      };
      const decoy = (parent, label) => {
        const b = u.el('button', 'rk-btn rk-xtra', parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', { label, collide: true });
        return b;
      };
      const footer = u.el('footer', 'rk-foot', content);
      const ptr = u.el('div', 'rk-ptr', footer);
      const cursor = u.el('span', '', ptr);
      const cs = u.svg('svg', { viewBox: '0 0 36 44' }, cursor);
      u.svg(
        'path',
        { d: 'M7 4V35L15 27L22 39L27 36L20 24H30Z', fill: '#080808', stroke: '#080808', 'stroke-width': 1 },
        cs,
      );
      const pt = u.el('span', '', ptr);
      pt.innerHTML = 'Pointer<br>(click to select)';
      u.el('div', 'rk-sp', footer);
      const clear = u.el('button', 'rk-btn', footer);
      u.el('span', '', clear, 'Clear');
      clear.type = 'button';
      clear.onclick = () => {
        env.widgetDef.clear?.();
      };
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'footer') {
          submit = u.el('button', 'rk-btn submit', footer);
          u.el('span', '', submit, endLabel);
          submit.type = 'button';
          submit.dataset.role = 'submit';
          submit.setAttribute('aria-label', endLabel);
          submit.title = endLabel;
          submit.onclick = () => ctx.submit();
        } else if (placement === 'bar') {
          submit = makeEnd(bar, 'rk-end rk-end-bar', endLabel);
        } else {
          submit = makeEnd(tb, 'rk-end rk-end-title', endLabel);
        }
      }
      if (collision) decoy(footer, collision);
      const quit = u.el('button', 'rk-btn', footer);
      u.el('span', '', quit, 'Quit');
      quit.type = 'button';
      quit.onclick = () => env.log('quit', {});
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
        promo: 'Workspace update',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This application stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with this workspace?',
        promo: 'Explore the latest workspace features.',
        banner: 'You are viewing a shared workspace.',
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
