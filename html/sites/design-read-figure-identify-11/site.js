(function () {
  'use strict';
  const C = {
    'site': 'design-read-figure-identify-11',
    'task': 'read-figure',
    'scenario': 'identify',
    'style': 'gnome',
    'title': 'Shape Quiz',
    'menu': '',
    'note': 'Identify the Shape',
    'layout': 'brief-left',
    'subtitle': '',
    'aside': '',
  };
  const NOTES = [
    ['New message', '10:18', 'Team update available\nin your inbox.', '#2b7cf6', 'M3 5h18v14H3z'],
    [
      'System update',
      '10:16',
      'A restart is recommended\nfor the latest security fixes.',
      '#9161df',
      'M12 3a2 2 0 0 0-2 2 5 5 0 0 0-4 5v5l-2 3h16l-2-3v-5a5 5 0 0 0-4-5 2 2 0 0 0-2-2zM9 20h6l-3 2z',
    ],
    [
      'Calendar reminder',
      '10:12',
      'Design meeting\nin 10 minutes.',
      '#10a970',
      'M4 5h16v15H4zM4 9h16M8 3v4M16 3v4M8 12h1v1H8zM12 12h1v1h-1zM16 12h1v1h-1zM8 16h1v1H8zM12 16h1v1h-1zM16 16h1v1h-1z',
    ],
    [
      'Cloud sync complete',
      '10:07',
      'Your files are up to date.',
      '#687180',
      'M7 17a4 4 0 0 1 0-8 5 5 0 0 1 10 1 3.5 3.5 0 0 1 0 7z',
    ],
  ];
  env.site({
    name: C.site,
    styles: ['site.css', 'gnome.css'],
    initialOverlay: { kind: 'toast' },
    frame(ctx) {
      document.body.className = C.style + ' ' + C.layout + ' instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body);
      const er = ctx.rng.fork('chrome/end'),
        labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name),
        endLabels = ctx.content.END_LABELS.map(labelOf),
        original = er.bool(0.5),
        placement = original ? 'footer' : er.pick(['header', 'link']),
        endLabel = original ? 'Submit' : er.pick(endLabels);
      app.classList.toggle('finish-mode', ctx.finish);
      app.classList.add('end-' + placement);
      const bar = u.el('div', 'gbar', app);
      u.el('span', 'g-act', bar, 'Activities');
      const ap = u.el('span', 'g-app', bar);
      u.el('i', 'g-dot', ap);
      u.el('b', '', ap, 'Shape Quiz');
      u.el('span', 'g-clock', bar, 'Apr 26  10:24');
      const tray = u.el('span', 'g-tray', bar);
      const ti = u.svg('svg', { width: 70, height: 18, viewBox: '0 0 70 18' }, tray);
      u.svg(
        'path',
        { d: 'M3 7a9 9 0 0 1 12 0M6 10a5 5 0 0 1 6 0', fill: 'none', stroke: '#fff', 'stroke-width': 2 },
        ti,
      );
      u.svg('path', { d: 'M26 7h3l4-3v10l-4-3h-3z', fill: '#fff' }, ti);
      u.svg('rect', { x: 48, y: 4, width: 10, height: 11, rx: 2, fill: 'none', stroke: '#fff', 'stroke-width': 2 }, ti);
      const top = u.el('header', 'top', app);
      const ic = u.el('i', 'h-icon', top);
      u.el('i', '', ic);
      u.el('span', 'h-title', top, C.title);
      const wc = u.el('div', 'native-window-controls', top);
      for (const kind of ['min', 'max', 'close']) {
        const svg = u.svg('svg', { width: 20, height: 20, viewBox: '0 0 20 20' }, wc);
        u.svg(
          'path',
          {
            d: kind === 'min' ? 'M4 10h12' : kind === 'max' ? 'M5 5h10v10H5z' : 'M5 5l10 10M15 5L5 15',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': 1.6,
          },
          svg,
        );
      }
      const center = u.el('div', 'center', app),
        side = u.el('section', 'side', center);
      u.el('h2', '', side, C.note);
      u.el('p', '', side, 'Look at the figure in the workspace and choose the name that best describes it.');
      const ul = u.el('ul', '', side);
      ['There is one correct answer.', 'Click a button to select it.'].forEach((t, i) => {
        const li = u.el('li', '', ul);
        const s = u.svg('svg', { width: 26, height: 26, viewBox: '0 0 26 26' }, li);
        if (i === 0) {
          u.svg('circle', { cx: 13, cy: 13, r: 10, fill: 'none', stroke: '#222', 'stroke-width': 2 }, s);
          u.svg('circle', { cx: 13, cy: 13, r: 4, fill: '#222' }, s);
        } else if (i === 1) u.svg('path', { d: 'M8 4v16l4-4 3 6 3-1-3-6h5z', fill: '#222' }, s);
        u.el('span', '', li, t);
      });
      const brief = u.el('div', 'brief', center, ctx.display === 'hidden' ? '' : ctx.instruction);
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', document.body);
      const footer = u.el('footer', 'bottom', app);
      const tm = u.el('div', 'timer', footer);
      const tsv = u.svg('svg', { width: 40, height: 40, viewBox: '0 0 40 40' }, tm);
      u.svg('circle', { cx: 20, cy: 20, r: 16, fill: 'none', stroke: '#222', 'stroke-width': 3 }, tsv);
      u.svg('path', { d: 'M20 10v10l6 4', fill: 'none', stroke: '#222', 'stroke-width': 3 }, tsv);
      u.el('span', '', tm, 'Timer\nPaused');
      u.el('div', 'tnote', footer, 'The timer will start after notifications are cleared.');
      u.el('i', 'vsep', footer);
      const reset = u.el('button', 'reset', footer, 'Reset');
      reset.type = 'button';
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          'button',
          'submit' + (placement === 'header' ? ' header-end' : placement === 'link' ? ' end-link' : ''),
          placement === 'header' ? top : footer,
          endLabel,
        );
        submit.type = 'button';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.dataset.role = 'submit';
        submit.addEventListener('click', ctx.submit);
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const pool = [...new Set(endLabels)].filter(
          (label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (pool.length) {
          const label = cr.pick(pool),
            decoy = u.el('button', 'chrome-xtra', top, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay notes ' + ctx.kind, document.body);
      const hd = u.el('div', 'nhead', el);
      u.el('b', '', hd, 'Notifications (4)');
      const dismiss = u.el('button', 'dismiss-all', hd, 'Dismiss all');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      NOTES.forEach((n) => {
        const c = u.el('div', 'ncard', el);
        const ico = u.el('i', 'nico', c);
        ico.style.background = n[3];
        const s = u.svg('svg', { width: 32, height: 32, viewBox: '0 0 24 24' }, ico);
        u.svg(
          'path',
          {
            d: n[4],
            fill: ['Cloud sync complete', 'System update', 'New message'].includes(n[0]) ? '#fff' : 'none',
            stroke: n[0] === 'New message' ? '#2b7cf6' : '#fff',
            'stroke-width': 1.5,
          },
          s,
        );
        if (n[0] === 'New message')
          u.svg(
            'path',
            { d: 'M3 5l9 8 9-8M3 19l6-6M21 19l-6-6', fill: 'none', stroke: '#2b7cf6', 'stroke-width': 1.2 },
            s,
          );
        const t = u.el('div', 'ntext', c);
        const r = u.el('div', 'nrow', t);
        u.el('b', '', r, n[0]);
        u.el('span', '', r, n[1]);
        u.el('p', '', t, n[2]);
        u.el('span', 'nx', c, '✕');
      });
      return { el, dismiss };
    },
  });
})();
