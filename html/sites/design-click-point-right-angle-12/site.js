(function () {
  'use strict';
  const C = {
    'title': 'Maple Grove Math Club',
    'accent': '#0a2a9c',
    'bg': '#f0ece0',
    'surface': '#fdfdfb',
    'font': "'Times New Roman', Times, 'Liberation Serif', Georgia, serif",
  };
  env.site({
    name: 'design-click-point-right-angle-12',
    styles: ['ref.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design hp' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.surface,
        fg: '#0b1440',
        muted: '#33406e',
        line: '#9aa4c8',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide');
      const labels = (ctx.content && ctx.content.END_LABELS) || [
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
      ];
      const preferred = labels.find((x) => String(x).trim().toLowerCase() === 'submit') || labels[0];
      const endLabel = endR.bool(0.5) ? preferred : endR.pick(labels),
        placement = ctx.finish ? null : endR.pick(['ledger', 'ledger', 'ledger', 'toolbar', 'nav']);
      const collideOptions = labels.filter(
        (x) => String(x).trim().toLowerCase() !== String(endLabel).trim().toLowerCase(),
      );
      const collide = !ctx.finish && collideR.bool(0.3) && collideOptions.length ? collideR.pick(collideOptions) : null;
      const small = window.innerWidth < 1120,
        display = small && ctx.display !== 'hidden' && ctx.display !== 'header' ? 'header' : ctx.display;
      const S = (parent, w, h, vb, paths) => {
        const s = u.svg('svg', { width: w, height: h, viewBox: vb }, parent);
        for (const [t, a] of paths) u.svg(t, a, s);
        return s;
      };
      const pixel = (parent, kind) => {
        const s = S(parent, '100%', '100%', '0 0 48 52', []);
        s.setAttribute('shape-rendering', 'crispEdges');
        s.setAttribute('preserveAspectRatio', 'none');
        const p = (d, fill, stroke = '#101632', sw = 1.5) =>
          u.svg('path', { d, fill, stroke, 'stroke-width': sw, 'stroke-linejoin': 'miter' }, s);
        const r = (x, y, w, h, fill) => u.svg('rect', { x, y, width: w, height: h, fill }, s);
        if (kind === 'tree') {
          p(
            'M21 3H25V7H29V11H33V15H29V19H37V23H41V27H35V31H41V35H45V39H37V43H28V48H34V51H15V48H20V43H10V39H3V35H8V31H3V27H10V23H7V19H15V15H12V11H17V7H21Z',
            '#285b39',
          );
          p('M22 41H27V49H32V51H16V49H22Z', '#a67761');
          p('M22 7H25V11H29V15H22V19H16V22H12V20H17V15H20V11H22Z', '#92ba72', 'none');
          p('M15 24H24V20H30V24H34V27H26V30H18V28H11V26H15Z', '#69a958', 'none');
          p('M11 34H18V32H24V35H31V32H36V35H40V38H31V40H24V38H16V40H9V37H11Z', '#76ad63', 'none');
          r(21, 13, 3, 3, '#d4ddb3');
          r(19, 25, 3, 2, '#c6d89c');
          r(29, 35, 4, 2, '#d0dfa7');
          r(8, 34, 3, 2, '#9bbfe1');
          r(33, 22, 3, 2, '#94b8df');
        }
        if (kind === 'people') {
          for (const [x, y, c] of [
            [4, 9, '#00bfea'],
            [29, 9, '#f69323'],
            [17, 17, '#36e600'],
          ]) {
            p(
              `M${x + 4} ${y}H${x + 10}V${y + 3}H${x + 13}V${y + 10}H${x + 10}V${y + 14}H${x + 14}V${y + 18}H${x + 17}V${y + 33}H${x - 1}V${y + 18}H${x + 2}V${y + 14}H${x + 4}V${y + 10}H${x + 1}V${y + 3}H${x + 4}Z`,
              c,
            );
            r(x + 3, y + 3, 4, 3, '#b4f1ff');
            r(x + 2, y + 20, 3, 10, '#166077');
          }
        }
        if (kind === 'pencil') {
          p('M7 43L10 31L33 8L39 8L44 13L43 19L20 42L7 46Z', '#fff2a0');
          p('M10 31L15 35L20 40L39 21L29 11Z', '#ffd643');
          p('M29 11L34 6L39 6L45 12V17L39 23Z', '#ed6ca0');
          p('M7 46L10 36L16 42Z', '#252030');
          p('M15 33L32 16', '#fff8b2', '#fff8b2', 2);
        }
        if (kind === 'globe') {
          p(
            'M18 5H30V7H36V10H40V14H43V20H45V32H43V38H40V42H35V46H29V48H18V46H12V43H8V39H5V33H3V21H5V15H9V10H13V7H18Z',
            '#16b9eb',
          );
          p('M17 7H29V11H25V14H21V17H17V21H12V17H9V13H13V10H17Z', '#55eb1c');
          p('M24 20H31V23H36V27H33V31H29V35H27V42H23V40H21V34H17V30H13V26H18V23H24Z', '#29d91b');
          p('M36 12H39V18H42V25H38V29H42V35H39V39H36V34H34V29H37V23H34V18H36Z', '#128c28');
          r(7, 24, 3, 8, '#84e3ff');
          r(10, 34, 3, 3, '#76d9ff');
          r(29, 9, 3, 3, '#b3f0ff');
          r(15, 10, 4, 2, '#b2f853');
          r(24, 28, 3, 3, '#79f540');
          r(18, 24, 3, 2, '#90f657');
          r(21, 41, 3, 3, '#074c97');
          r(37, 31, 3, 3, '#1d7cb3');
        }
        if (kind === 'star') {
          p('M24 4L29 19H45L32 29L37 45L24 35L11 45L16 29L3 19H19Z', '#ffe128', '#101632', 2);
          p('M24 9L27 21H12L21 26L23 21H26Z', '#fff8a0', 'none');
          p('M12 43L18 29L20 32L17 38Z', '#e6b81b', 'none');
          r(23, 30, 3, 3, '#d29d00');
        }
        if (kind === 'heart') {
          p('M7 15H11V11H20V14H27V11H36V14H40V18H43V28H39V32H35V36H31V40H27V44H23V40H19V36H15V32H11V28H7Z', '#ef72ad');
          p('M10 17H14V14H19V17H16V22H11Z', '#fff4fb', 'none');
          p('M36 19H40V27H36V31H32V35H28V39H25V35H29V31H33V27H36Z', '#d94f95', 'none');
        }
        if (kind === 'flower') {
          p('M9 25H16V30H21V37H24V20H27V37H30V30H37V36H33V42H27V47H37V51H10V47H21V42H14V36H9Z', '#39a43c');
          p('M10 25H16V30H10ZM31 28H36V34H31Z', '#97d947');
          p('M21 3H27V9H33V14H28V19H21V14H16V9H21Z', '#ef75ae');
          p('M11 16H16V20H20V25H15V29H10V25H6V21H11Z', '#d871c1');
          p('M32 17H37V21H42V26H37V30H32V26H28V21H32Z', '#f59ebf');
          p('M23 8H27V13H22V9ZM12 20H16V24H12ZM33 21H37V25H33Z', '#ffdf47');
          r(22, 5, 3, 2, '#fff1cc');
          r(34, 18, 2, 2, '#ffe7f7');
          r(12, 17, 2, 2, '#fddff9');
          r(24, 31, 2, 10, '#82c758');
        }
        if (kind === 'tree') {
          for (const [x, y, c] of [
            [19, 9, '#b1cdae'],
            [27, 14, '#6aa955'],
            [12, 18, '#3f8144'],
            [19, 19, '#bdd0a1'],
            [24, 21, '#174b39'],
            [8, 25, '#90b77a'],
            [13, 28, '#102d36'],
            [29, 25, '#c4d6b0'],
            [34, 27, '#6ea85b'],
            [20, 30, '#90c773'],
            [26, 31, '#1d5336'],
            [8, 35, '#adcb96'],
            [17, 35, '#b4ce93'],
            [22, 37, '#3b813c'],
            [34, 37, '#acc995'],
            [12, 39, '#558552'],
            [29, 39, '#72a35c'],
          ])
            r(x, y, 3, 2, c);
        }
        return s;
      };
      const tree = (parent) => pixel(parent, 'tree');
      const shell = u.el('div', 'shell', body);
      const head = u.el('header', 'head', shell);
      const hl = u.el('div', 'hd-left', head);
      S(u.el('div', 'ico house', hl), '100%', '100%', '0 0 40 46', [
        ['path', { d: 'M4 21H36V44H4Z', fill: '#f8edca', stroke: '#11172d', 'stroke-width': 2 }],
        [
          'path',
          {
            d: 'M1 21V18H5V14H9V10H13V6H17V3H21V6H25V10H29V14H33V18H38V21Z',
            fill: '#b34d69',
            stroke: '#11172d',
            'stroke-width': 2,
          },
        ],
        ['path', { d: 'M7 17H11V13H15V9H19V6H22M27 15H31V19H34', fill: 'none', stroke: '#f0a4ba', 'stroke-width': 2 }],
        ['rect', { x: 9, y: 25, width: 8, height: 18, fill: '#bdbdea', stroke: '#11172d', 'stroke-width': 2 }],
        ['rect', { x: 23, y: 25, width: 8, height: 9, fill: '#658dbc', stroke: '#11172d', 'stroke-width': 2 }],
        ['path', { d: 'M27 26V33M24 29H30M11 36H13', stroke: '#e4bddc', 'stroke-width': 1.5 }],
      ]);
      u.el('div', 'hd-tag', hl, 'A Friendlier\nWeb Since\n1996');
      const hc = u.el('div', 'hd-center', head);
      tree(u.el('div', 'ico tree', hc));
      const tt = u.el('div', 'hd-titles', hc);
      u.el('h1', '', tt, C.title);
      u.el('div', 'sub', tt, 'Small Problems  Brighter Neighbors');
      tree(u.el('div', 'ico tree', hc));
      const hr = u.el('div', 'hd-right', head);
      u.el('div', 'hd-tag', hr, 'Math\nPeople\nBelong Here');
      S(u.el('div', 'ico books', hr), '100%', '100%', '0 0 48 48', [
        ['path', { d: 'M7 5H43L40 9V14H7Q1 10 7 5Z', fill: '#398552', stroke: '#101632', 'stroke-width': 2 }],
        ['path', { d: 'M12 8H40V12H12Q8 10 12 8Z', fill: '#ffffdb', stroke: '#101632' }],
        ['path', { d: 'M3 16H43V20H46V24H3Z', fill: '#ef6496', stroke: '#101632', 'stroke-width': 2 }],
        ['path', { d: 'M7 25H44L40 29V34H7Q2 30 7 25Z', fill: '#3d60dd', stroke: '#101632', 'stroke-width': 2 }],
        ['path', { d: 'M13 28H40V32H13Q9 30 13 28Z', fill: '#ffffe5', stroke: '#101632' }],
        ['path', { d: 'M3 35H43V39H46V44H12L3 39Z', fill: '#e1d69c', stroke: '#101632', 'stroke-width': 2 }],
        ['path', { d: 'M12 38H42V41H16Z', fill: '#fffde5', stroke: '#101632' }],
      ]);
      const nav = u.el('nav', 'nav', shell);
      ['Home', 'Puzzles', 'Math Circle', 'Resources', 'Our Town', 'Guestbook'].forEach((t, i) => {
        if (i) u.el('span', 'sep', nav, '|');
        const a = u.el('a', '', nav, t);
        a.href = '#';
        a.onclick = (e) => {
          e.preventDefault();
          env.log('nav', { label: t });
        };
      });
      const frame = u.el('section', 'frame', shell);
      const fh = u.el('div', 'frame-head', frame);
      u.el('h2', '', fh, 'Geometry Corner');
      u.el('i', '', fh, 'Think Together ✧ Grow Together');
      const content = u.el('div', 'content', frame);
      const left = u.el('div', 'left', content);
      const note = u.el('section', 'task-note', left);
      S(u.el('div', 'ico hand', note), '100%', '100%', '0 0 52 36', [
        [
          'path',
          {
            d: 'M2 12H10V9H14V5H18V2H26V5H30V7H50V13H32V16H38V21H32V24H35V29H26V32H12V34H2Z',
            fill: '#fff',
            stroke: '#101950',
            'stroke-width': 2.5,
          },
        ],
        [
          'path',
          {
            d: 'M3 12H10V33H3ZM14 12V26H18V29H27M19 8H25V14H21V18H28V21H19M30 10H47M17 5V10',
            fill: 'none',
            stroke: '#253ab0',
            'stroke-width': 2,
          },
        ],
        ['path', { d: 'M12 25H17V29H29V32H12Z', fill: '#617ed2' }],
      ]);
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      instruction.style.setProperty('--instr-scale', Math.min(1, 98 / ctx.instruction.length));
      if (display === 'hidden') note.hidden = true;
      else if (display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (display === 'panel') note.classList.add('instruction-panel');
      const stage = u.el('main', 'stage', left);
      stage.dataset.role = 'stage';
      const aside = u.el('aside', 'aside', content);
      u.el('h3', '', aside, 'Task');
      const ol = u.el('ol', '', aside);
      for (const t of ['Click to add point C.', 'Make ∠ABC = 90°.', 'Click outside the dotted circle.'])
        u.el('li', '', ol, t);
      u.el('h3', '', aside, 'Notes');
      const ul = u.el('ul', '', aside);
      for (const t of [
        'Point C must be outside the dotted circle.',
        'Use only your mouse.',
        'The figure is not to scale.',
      ])
        u.el('li', '', ul, t);
      const acts = u.el('div', 'acts', aside);
      const clear = u.el('button', 'clear', acts, 'Clear Point C');
      clear.type = 'button';
      clear.onclick = () => {
        env.widgetDef.clear?.();
      };
      let submit = null;
      const endControl = (parent, cls, label, tag = 'button') => {
        const b = u.el(tag, cls, parent, label);
        if (tag === 'button') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
        return b;
      };
      const decoy = (parent, label, collides) => {
        const b = u.el('button', 'end-xtra', parent, label);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', collides ? { label, collide: true } : { label });
        return b;
      };
      if (display === 'panel') {
        note.classList.add('instruction-panel');
        aside.insertBefore(note, aside.firstChild);
      } else if (display === 'toast') {
        note.classList.add('instruction-toast');
        shell.appendChild(note);
      }
      if (!ctx.finish && placement === 'ledger') submit = endControl(acts, 'submit', endLabel);
      if (!ctx.finish && placement === 'toolbar') submit = endControl(fh, 'episode-end toolbar-end', endLabel);
      if (!ctx.finish && placement === 'nav') submit = endControl(nav, 'episode-end nav-end', endLabel, 'a');
      if (collide) decoy(acts, collide, true);
      u.el('div', 'motto', aside, 'Angles build brighter communities.');
      const comm = u.el('aside', 'community', shell);
      u.el('h3', '', comm, 'Our Community');
      ['Local Students', 'Homework Help', 'Math Events', 'Member Pages'].forEach((t, i) => {
        const r = u.el('div', 'crow', comm);
        pixel(u.el('span', 'cico', r), ['people', 'pencil', 'globe', 'star'][i]);
        const a = u.el('a', '', r, t);
        a.href = '#';
        a.onclick = (e) => {
          e.preventDefault();
          env.log('link', { label: t });
        };
      });
      u.el('hr', '', comm);
      const mr = u.el('div', 'crow motto2', comm);
      pixel(u.el('span', 'cico heart', mr), 'heart');
      u.el('i', '', mr, 'Different Minds\nA Brighter Town');
      const quote = u.el('div', 'quote', shell);
      pixel(u.el('span', 'cico flower', quote), 'flower');
      const qt = u.el('div', 'quote-copy', quote);
      u.el('i', '', qt, '“Good neighbors\nmake great problems.”');
      u.el('div', 'quote-credit', qt, '– Maple Grove Math Club');
      const pv = u.el('div', 'preview', shell);
      u.el('h3', '', pv, 'Preview Your Work');
      const pr = u.el('div', 'pv-row', pv);
      const th = u.el('div', 'thumb', pr);
      S(th, '100%', '100%', '0 0 190 114', [
        ['line', { x1: 20, y1: 50, x2: 136, y2: 50, stroke: '#0a2a9c', 'stroke-width': 3 }],
        ['circle', { cx: 20, cy: 50, r: 5, fill: '#0a2a9c' }],
        ['circle', { cx: 136, cy: 50, r: 5, fill: '#0a2a9c' }],
        [
          'circle',
          { cx: 136, cy: 50, r: 27, fill: 'none', stroke: '#273c61', 'stroke-dasharray': '2 4', 'stroke-width': 1.5 },
        ],
        ['text', { x: 14, y: 76, 'font-size': 18, 'font-family': 'serif' }],
      ]);
      u.el('span', 'tA', th, 'A');
      u.el('span', 'tB', th, 'B');
      const pbtn = u.el('button', 'pv-btn', pr);
      S(pbtn, '42', '44', '0 0 42 44', [
        ['path', { d: 'M4 3L40 23L4 43Z', fill: '#810819' }],
        ['path', { d: 'M2 1L38 21L2 41Z', fill: '#ffe538', stroke: '#a85b05', 'stroke-width': 1 }],
      ]).setAttribute('aria-hidden', 'true');
      u.el('span', '', pbtn, 'Preview');
      pbtn.type = 'button';
      pbtn.onclick = () => env.log('preview', {});
      u.el('div', 'pv-note', pv, 'See how it looks before submitting!');
      if (ctx.finish) {
        acts.classList.add('finish-acts');
      }
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
