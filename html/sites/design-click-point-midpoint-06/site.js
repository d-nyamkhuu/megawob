(function () {
  'use strict';
  const C = {
    'title': 'Geometry Practice',
    'accent': '#3b8fe8',
    'bg': '#fcfdfe',
    'surface': '#ffffff',
    'font': "'Noto Sans','Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif",
  };
  env.site({
    name: 'design-click-point-midpoint-06',
    styles: ['kde.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design breeze' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.surface,
        fg: '#232f3e',
        muted: '#6b7785',
        line: '#dfe5ec',
        accent: '#2a7fd6',
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const S = (parent, w, h, d, extra) => {
        const s = u.svg(
          'svg',
          {
            width: w,
            height: h,
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': 1.8,
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          },
          parent,
        );
        for (const p of [].concat(d)) u.svg('path', Object.assign({ d: p }, extra || {}), s);
        return s;
      };
      const desk = u.el('div', 'desktop', body);
      // main window
      const shell = u.el('div', 'shell win', desk),
        head = u.el('header', 'head', shell);
      const ti = u.el('div', 'titlebar', head);
      const logo = u.el('span', 'app-logo', ti, 'K');
      u.el('span', 'title', ti, C.title);
      const wc = u.el('div', 'window-controls', ti);
      for (const [label, d] of [
        ['min', 'M6 17H18'],
        ['max', 'M6 6H18V18H6Z'],
        ['close', 'M6 6L18 18M18 6L6 18'],
      ]) {
        const b = u.el('button', '', wc);
        b.type = 'button';
        b.setAttribute('aria-label', label);
        S(b, 16, 16, d);
        b.onclick = () => env.log('window-control', { label });
      }
      const menu = u.el('nav', 'menu', head);
      for (const m of ['File', 'Edit', 'View', 'Tools', 'Help']) u.el('span', '', menu, m);
      const tb = u.el('div', 'toolbar', head);
      const tools = [
        ['Select', 'M7 3L7 19L11 15L14 21L16.5 20L13.5 14H19Z', 1],
        ['Point', 'M12 12m-3.7 0a3.7 3.7 0 1 0 7.4 0a3.7 3.7 0 1 0 -7.4 0'],
        ['Line', 'M5 19L19 5M13 18L19 15'],
        ['Segment', 'M6 18L18 6M5 18h2M18 5v2'],
        ['Circle', 'M12 12m-8 0a8 8 0 1 0 16 0a8 8 0 1 0 -16 0'],
        ['Text', 'M5 19L12 5L19 19M8 14H16'],
      ];
      const mk = (name, d, sel, dis) => {
        const b = u.el('button', 'tool' + (sel ? ' selected' : '') + (dis ? ' disabled' : ''), tb);
        b.type = 'button';
        const icon = S(b, 26, 26, d, ['Point', 'Select'].includes(name) ? { fill: 'currentColor' } : null);
        if (name === 'Segment')
          for (const [cx, cy] of [
            [6, 18],
            [18, 6],
          ])
            u.svg('circle', { cx, cy, r: 1.7, fill: 'currentColor', stroke: 'none' }, icon);
        if (name === 'Text') {
          icon.replaceChildren();
          u.svg(
            'text',
            {
              x: 12,
              y: 20,
              'text-anchor': 'middle',
              fill: 'currentColor',
              stroke: 'none',
              'font-size': 23,
              'font-family': 'Arial,sans-serif',
              'font-weight': 500,
            },
            icon,
          ).textContent = 'A';
        }
        u.el('span', '', b, name);
        if (!dis)
          b.onclick = () => {
            tb.querySelectorAll('.tool.sel-able').forEach((x) => x.classList.remove('selected'));
            b.classList.add('selected');
          };
        if (!dis) b.classList.add('sel-able');
        return b;
      };
      for (const [n, d, s] of tools) mk(n, d, s);
      u.el('span', 'sep', tb);
      mk('Undo', ['M11 5L6 10L11 14', 'M6 10H14Q21 10 19 17Q18 21 13 19'], 0, 0).classList.remove('sel-able');
      mk('Redo', ['M13 5L18 10L13 14', 'M18 10H10Q3 10 5 17Q6 21 11 19'], 0, 1);
      const content = u.el('div', 'content', shell),
        stage = u.el('main', 'stage', content);
      stage.dataset.role = 'stage';
      const aside = u.el('aside', 'aside', content);
      const note = u.el('section', 'task-note', aside);
      u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'header') {
        note.classList.add('instruction-header');
        head.insertBefore(note, tb);
      } else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const det = u.el('section', 'panel details', aside);
      u.el('h3', '', det, 'Point Details');
      u.el('p', '', det, 'Click on the graph to place a point.');
      const act = u.el('section', 'panel actions', aside);
      u.el('h3', '', act, 'Actions');
      const status = u.el('footer', 'footer', shell);
      u.el('span', 'footer-copy', status, 'Ready');
      const endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide');
      const endBank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const endWord = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const originalLabel = 'Submit',
        placements = ['panel', 'panel', 'toolbar', 'footer'];
      const placement = ctx.finish ? 'none' : endR.pick(placements),
        label = ctx.finish || endR.bool(0.5) ? originalLabel : endWord(endR.pick(endBank));
      let submit = null;
      const makeEnd = (parent, cls) => {
        const b = u.el('button', 'submit ' + cls, parent, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.onclick = () => ctx.submit();
        return b;
      };
      if (!ctx.finish) {
        if (placement === 'panel') submit = makeEnd(act, 'end-panel');
        else if (placement === 'toolbar') submit = makeEnd(tb, 'end-toolbar');
        else submit = makeEnd(status, 'end-footer');
      }
      const collideBank = endBank.map(endWord).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
      const collide = collideR.bool(0.3) && collideBank.length ? endWord(collideR.pick(collideBank)) : null;
      if (collide) {
        const target = collideR.pick(['toolbar', 'actions']);
        const b = u.el(
          'button',
          target === 'toolbar' ? 'end-xtra toolbar-xtra' : 'end-xtra action-xtra',
          target === 'toolbar' ? tb : act,
          collide,
        );
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      const clear = u.el('button', 'clear', act);
      clear.type = 'button';
      S(clear, 24, 24, ['M5 7H19', 'M10 7V5H14V7', 'M7 7L8 20H16L17 7', 'M10 11V16', 'M14 11V16']);
      u.el('span', '', clear, 'Clear Points');
      clear.onclick = () => {
        env.widgetDef.clear?.();
      };
      const co = u.el('span', 'coords', status);
      u.el('span', '', co, 'x: 16.0');
      u.el('span', '', co, 'y: 10.0');
      // floating palette
      const pal = u.el('div', 'palette win', desk);
      const ph = u.el('div', 'palette-head', pal);
      u.el('span', '', ph, 'Tools');
      const pb = u.el('span', 'pbtns', ph);
      S(pb, 16, 16, ['M14 4L20 10L17 11L13 15L13 18L6 11L9 11L13 7Z', 'M8 16L4 20']);
      S(pb, 16, 16, 'M6 6L18 18M18 6L6 18');
      const pbody = u.el('div', 'palette-body', pal);
      for (const [t, on] of [
        ['Snap to Grid', 1],
        ['Show Coordinates', 1],
      ]) {
        const l = u.el('label', 'pcheck', pbody);
        const i = u.el('input', '', l);
        i.type = 'checkbox';
        i.checked = !!on;
        u.el('span', '', l, t);
      }
      const gs = u.el('div', 'pgrid', pbody);
      u.el('span', '', gs, 'Grid Spacing');
      const sb = u.el('span', 'fakesel', gs);
      u.el('span', '', sb, '1 unit');
      S(sb, 12, 12, 'M6 9L12 15L18 9');
      // taskbar
      const tk = u.el('div', 'taskbar', desk);
      const gear = u.el('span', 'tk-ic gear', tk, '⚙');
      const files = u.el('span', 'tk-ic files', tk);
      const folder = u.svg('svg', { width: 34, height: 34, viewBox: '0 0 32 32' }, files);
      u.svg('path', { d: 'M2 5H13L16 8H29V28H2Z', fill: '#258bcc', stroke: '#1172b5' }, folder);
      u.svg('path', { d: 'M4 10H27V14H4Z', fill: '#d1eafa' }, folder);
      u.svg('path', { d: 'M2 14H29V28H2Z', fill: '#53b4ed' }, folder);
      u.svg(
        'path',
        { d: 'M13 20V18Q16 14 19 18V20M12 20H20V25H12Z', fill: '#268ccb', stroke: '#2581be', 'stroke-width': 1.2 },
        folder,
      );
      const ff = u.el('span', 'tk-ic ff', tk);
      const fox = u.svg('svg', { width: 34, height: 34, viewBox: '0 0 32 32' }, ff);
      u.svg('circle', { cx: 16, cy: 17, r: 12, fill: '#1363c4' }, fox);
      u.svg(
        'path',
        {
          d: 'M7 3L11 9L20 8L26 3L25 12Q34 23 21 29Q6 34 2 18L5 10L7 3M6 13Q3 24 17 25Q24 25 25 18L20 20L15 17L20 12L14 10L9 13Z',
          fill: '#ff9f15',
        },
        fox,
      );
      u.svg('path', { d: 'M4 18Q8 31 24 25Q17 33 8 27Z', fill: '#f45325' }, fox);
      const term = u.el('span', 'tk-ic term', tk);
      S(term, 29, 29, ['M5 7L10 12L5 17', 'M13 18H20']);
      const tkw = u.el('span', 'tk-task', tk);
      S(tkw, 22, 22, ['M4 4H20V20H4Z', 'M7 16L12 10L15 13L18 8']);
      u.el('span', '', tkw, C.title);
      const tray = u.el('span', 'tk-tray', tk);
      S(tray, 22, 22, ['M4 10H8L13 6V20L8 16H4Z', 'M16 9Q21 13 16 17', 'M18 6Q25 13 18 20']);
      S(tray, 22, 22, ['M7 5H19V20H7Z', 'M10 2V5M16 2V5M10 20V23M16 20V23', 'M10 8H16V16H10Z']);
      S(tray, 22, 22, 'M5 15L12 8L19 15');
      const clock = u.el('span', 'tk-clock', tk);
      u.el('span', '', clock, '10:24 AM');
      u.el('span', '', clock, 'Apr 17, 2018');
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
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Reject optional' : 'Close');
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
