// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  const documentIcon = (u, parent) => {
    const svg = u.svg(
      'svg',
      { class: 'document-icon', viewBox: '0 0 48 60', fill: 'white', stroke: 'black', 'stroke-width': 2.5 },
      parent,
    );
    u.svg('path', { d: 'M3 2H34L45 14V58H3ZM34 2V14H45M10 12H24M10 19H24M10 26H33M10 33H33M10 40H33M10 47H30' }, svg);
  };
  const bitmapLabel = (element) => {
    if (!element || element.querySelector('canvas')) return;
    const text = element.textContent.trim(),
      style = getComputedStyle(element),
      rect = element.getBoundingClientRect();
    if (!text || !rect.width || !rect.height) return;
    const isInstruction = element.classList.contains('instruction'),
      size = parseFloat(style.fontSize),
      base = isInstruction ? Math.min(16, Math.floor(size)) : Math.min(18, Math.max(10, Math.floor(size)));
    const scale = size / base,
      compress = isInstruction ? 0.88 : 1,
      padL = parseFloat(style.paddingLeft) || 0,
      padR = parseFloat(style.paddingRight) || 0;
    const available = Math.max(1, rect.width - padL - padR - 2),
      width = Math.max(1, Math.floor(available / (scale * compress)));
    const canvas = document.createElement('canvas'),
      paint = canvas.getContext('2d');
    const bold = parseInt(style.fontWeight, 10) >= 600,
      font = (bold ? 'bold ' : '') + base + 'px Arial';
    paint.font = font;
    const lines = [];
    let line = '';
    for (const word of text.split(/\s+/)) {
      const next = line ? line + ' ' + word : word;
      if (isInstruction && line && paint.measureText(next).width > width) {
        lines.push(line);
        line = word;
      } else line = next;
    }
    if (line) lines.push(line);
    const lineHeight = Math.ceil(base * 1.25);
    const textWidth = Math.ceil(Math.max(...lines.map((value) => paint.measureText(value).width))) + 3;
    canvas.width = isInstruction ? width : Math.max(width, textWidth);
    canvas.height = lines.length * lineHeight;
    paint.font = font;
    paint.textBaseline = 'alphabetic';
    const centered = element.matches('.title,.aside h3,.submit,.dismiss,.mq');
    paint.textAlign = centered ? 'center' : 'left';
    lines.forEach((value, i) => {
      const x = centered ? Math.round(canvas.width / 2) : 1,
        metrics = paint.measureText(value),
        ascent = metrics.actualBoundingBoxAscent,
        descent = metrics.actualBoundingBoxDescent,
        y = Math.round(i * lineHeight + (lineHeight - ascent - descent) / 2 + ascent);
      if (element.matches('.title,.aside h3')) {
        paint.strokeStyle = '#fff';
        paint.lineWidth = 1.5;
        paint.strokeText(value, x, y);
      }
      paint.fillStyle = '#000';
      if (bold) {
        paint.strokeStyle = '#000';
        paint.lineWidth = 0.35;
        paint.strokeText(value, x, y);
      }
      paint.fillText(value, x, y);
    });
    const pixels = paint.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < pixels.data.length; i += 4) {
      pixels.data[i + 3] = pixels.data[i + 3] >= 96 ? 255 : 0;
      const color = pixels.data[i] > 128 ? 255 : 0;
      pixels.data[i] = pixels.data[i + 1] = pixels.data[i + 2] = color;
    }
    paint.putImageData(pixels, 0, 0);
    canvas.className = 'bitmap-ink';
    canvas.setAttribute('aria-hidden', 'true');
    Object.assign(canvas.style, {
      width: Math.min(available, canvas.width * scale * compress) + 'px',
      height: canvas.height * scale + 'px',
      left: padL + 'px',
    });
    if (style.position === 'static') element.style.position = 'relative';
    element.classList.add('bitmap-label');
    element.append(canvas);
  };
  const bitmapLabels = (root) =>
    root
      .querySelectorAll(
        '.title,.aside h3,.instruction,.mi,.clock,.mq:not(.mq2),.submit,.menu-end-link,.dismiss,.notification-card strong,.notification-card p',
      )
      .forEach(bitmapLabel);
  env.site({
    name: 'design-sort-into-bins-collect-11',
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'promo' },
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'three',
        'theme': 'bitmap',
        'title': 'Shape Sorter',
        'menu': 'File    Edit    Game    Window    Help',
        'aside': 'Notifications (5)',
        'foot': '',
        'accent': '#111',
        'bg': '#fff',
        'surface': '#fff',
        'font': "Chicago, Geneva, 'DejaVu Sans', Verdana, sans-serif",
        'ob': 'notifications',
      },
      parts: {
        'frame.2': (_base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx } = _c;
            body.className =
              'design ' +
              C.theme +
              ' layout-' +
              C.layout +
              ' instruction-' +
              ctx.display +
              (ctx.display === 'toast' ? ' has-instruction-toast' : '');
          },
        'frame.3': () => () => {},
        'frame.11': (_base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.menu) {
              const nav = u.el('nav', 'menu', head);
              const ap = u.svg('svg', { class: 'apple', width: 26, height: 26, viewBox: '0 0 24 24' }, nav);
              u.svg(
                'path',
                {
                  d: 'M12 6C9 4 4 6 5 12c1 4 3 8 5.500 7 1-.5 2.500-.5 3.500 0 2.500 1 4.500-3 5-6-3.500-1.500-3.500-5.500-.5-7C17 4.500 14 4.500 12 6zM13 1c0 2.500-2 4-3.500 4 0-2.500 1.500-4 3.500-4z',
                  fill: '#000',
                },
                ap,
              );
              for (const w of C.menu.split(/\s+/)) u.el('span', 'mi', nav, w);
              u.el('span', 'clock', nav, '10:24 AM');
              const hq = u.el('span', 'mq', nav, '?');
              const bag = u.el('span', 'mq mq2', nav);
              const bi = u.svg('svg', { viewBox: '0 0 32 32', fill: 'none', stroke: 'black', 'stroke-width': 2 }, bag);
              u.svg('path', { d: 'M2 14H30V30H2ZM5 14V9H27V14M10 9V3H22V9M14 3V9M5 17H27' }, bi);
            }
          },
        'frame.15': (_base, S) =>
          function (_c) {
            const { ctx, note, u } = _c;
            documentIcon(u, note);
            const instruction = u.el('div', 'instruction', note, ctx.instruction);
            Object.assign(_c, { instruction });
          },
        'frame.19': (_base, S) =>
          function (_c) {
            const { content, u } = _c;
            const interactionPane = u.el('section', 'interaction-pane', content);
            const stage = u.el('main', 'stage', interactionPane);
            Object.assign(_c, { interactionPane, stage });
          },
        'frame.22': () => () => {},
        'frame.24': (_base, S) =>
          function (_c) {
            const { interactionPane, u } = _c;
            const footer = u.el('footer', 'footer', interactionPane);
            Object.assign(_c, { footer });
          },
        'frame.27': (_base, S) =>
          function (_c) {
            const { ctx, footer, head, u } = _c;
            if (!ctx.finish) {
              const endRng = ctx.rng.fork('chrome/end'),
                collideRng = ctx.rng.fork('chrome/collide');
              const fallback = [
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
              const labels =
                ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                  ? ctx.content.END_LABELS
                  : fallback;
              const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
              const clean = labels.map(labelOf),
                defaultLabel = clean.find((x) => x.toLowerCase() === 'submit') || 'Submit';
              const keepDefault = endRng.bool(0.5);
              let placement = keepDefault ? 'footer' : endRng.pick(['title', 'menu']);
              const label = keepDefault
                ? defaultLabel
                : endRng.pick(clean.filter((x) => x.toLowerCase() !== defaultLabel.toLowerCase()));
              const decoy = collideRng.bool(0.3)
                ? collideRng.pick(clean.filter((x) => x.toLowerCase() !== label.toLowerCase()))
                : null;
              if (decoy) {
                const d = u.el('button', 'menu-end-xtra', head, decoy);
                d.type = 'button';
                d.dataset.role = 'xtra';
                d.onclick = () => env.log('decoy', { label: decoy, collide: true });
              }
              if (placement === 'menu') {
                const nav = head.querySelector('.menu');
                if (nav) {
                  _c.submit = u.el('a', 'menu-end-link', nav, label);
                  _c.submit.href = '#';
                } else placement = 'title';
              }
              if (placement === 'title') _c.submit = u.el('button', 'submit title-submit', head, label);
              if (placement === 'footer') _c.submit = u.el('button', 'submit', footer, label);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', label);
              _c.submit.title = label;
              _c.submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
            }
          },
        'frame.30': (_base, S) =>
          function (_c) {
            const { shell, stage } = _c;
            bitmapLabels(shell);
            return { stage, submit: _c.submit };
          },
        'overlay.9': (_base, S) =>
          function (_c) {
            const { C } = S;
            const { box, o, u } = _c;
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
                documentIcon(u, card);
                u.el('strong', '', card, name);
                u.el('p', '', card, body);
                const x = u.el('button', 'notification-x', card, '×');
                x.onclick = () => card.remove();
              }
            } else u.el('p', '', box, _c.text);
          },
        'overlay.16': (_base, S) =>
          function (_c) {
            const { dismiss, el, kind } = _c;
            bitmapLabels(el);
            return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
          },
      },
    },
  });
})();
