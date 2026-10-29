// Design on templates/site/click-point-bisect-03.js: only what this site changed.
(function () {
  'use strict';
  const TOOLS = [
    ['Select', 'M5 3V25L11 20L15 29L19 27L15 19H23Z', 1],
    ['Point', '', 0, 1],
    ['Segment', 'M4 24L26 8M4 24h0M26 8h0', 0],
    ['Line', 'M3 26L28 6M3 26h0M28 6h0', 0, 1],
    ['Circle', 'M16 4A12 12 0 1 1 15.9 4M16 16h0', 0, 1],
    ['Angle', 'M6 26L16 6M6 26H27M10 20Q14 18 14 26', 0, 1],
    ['Perpendicular', 'M16 4V24M5 24H27M16 18H22V24', 0],
    ['Parallel', 'M12 26L22 4M20 26L30 4', 0, 1],
    ['Compass', 'M16 4V8M16 8L8 27M16 8L24 27M11 20H21', 0],
    ['Text', 'M6 27L16 4L26 27M10 20H22', 0, 1],
    ['Zoom In', 'M13 5A8 8 0 1 1 12.9 5M19 19L28 28M9 13H17M13 9V17', 0],
    ['Zoom Out', 'M13 5A8 8 0 1 1 12.9 5M19 19L28 28M9 13H17', 0],
    ['Fit', 'M5 5H27V27H5ZM9 9L23 23M23 9L9 23', 0, 1],
  ];
  function qtFrame(ctx) {
    const u = ctx.util,
      body = document.body;
    body.className = 'qt';
    const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
    const endRng = ctx.rng.fork('chrome/end'),
      endBank = ctx.content && ctx.content.END_LABELS;
    const endLabels =
      Array.isArray(endBank) && endBank.length
        ? endBank.map(labelOf)
        : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', '✓'];
    const keepOriginal = endRng.bool(0.5),
      originalLabel = endLabels.find((x) => x.trim().toLowerCase() === 'submit') || endLabels[0];
    const placement = keepOriginal ? 'side' : endRng.pick(['side', 'toolbar', 'status']);
    const alternatives = endLabels.filter((x) => x.trim().toLowerCase() !== originalLabel.trim().toLowerCase());
    const endLabel = keepOriginal ? originalLabel : endRng.pick(alternatives.length ? alternatives : endLabels);
    const collideRng = ctx.rng.fork('chrome/collide');
    const collideOptions = [...new Set(endLabels)].filter(
      (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
    );
    const collide =
      collideOptions.length && collideRng.bool(0.3)
        ? { label: collideRng.pick(collideOptions), where: collideRng.pick(['toolbar', 'status']) }
        : null;
    const win = u.el('div', 'qt-win', body);
    const tb = u.el('div', 'qt-title', win);
    const ic = u.el('span', 'qt-appicon', tb);
    u.el('span', 'qt-name', tb, 'GeoConstruct 2.1');
    u.el('span', 'qt-doc', tb, '-   Untitled');
    const wc = u.el('div', 'qt-wc', tb);
    for (const l of ['_', '□', '×']) {
      const b = u.el('button', '', wc, l);
      b.type = 'button';
      b.onclick = () => env.log('window-control', { label: l });
    }
    const mb = u.el('nav', 'qt-menu', win);
    for (const m of ['File', 'Edit', 'View', 'Construct', 'Measure', 'Tools', 'Window', 'Help']) {
      const s = u.el('span', '', mb);
      s.innerHTML = '<u>' + m[0] + '</u>' + m.slice(1);
    }
    const tool = u.el('div', 'qt-tools', win);
    for (const [n, p, sel, sep] of TOOLS) {
      const b = u.el('button', 'qt-tool' + (sel ? ' sel' : ''), tool);
      b.type = 'button';
      const s = u.svg(
        'svg',
        {
          width: 32,
          height: 32,
          viewBox: '0 0 32 32',
          fill: n === 'Select' ? '#111' : 'none',
          stroke: '#222',
          'stroke-width': 1.8,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        },
        b,
      );
      if (n === 'Point') u.svg('circle', { cx: 16, cy: 12, r: 5, fill: '#1a2fc0', stroke: 'none' }, s);
      else u.svg('path', { d: p }, s);
      if (n === 'Segment') {
        s.firstChild.setAttribute('d', 'M1 26L31 9');
        for (const [cx, cy] of [
          [1, 26],
          [31, 9],
        ])
          u.svg('circle', { cx, cy, r: 1.7, fill: '#243b97', stroke: '#111', 'stroke-width': 0.8 }, s);
      }
      if (n === 'Line') {
        u.svg('path', { d: 'M3 26L4 20L8 24ZM28 6L23 7L27 11Z', fill: '#121b35', stroke: 'none' }, s);
        u.svg('circle', { cx: 15, cy: 16, r: 1.8, fill: '#243b97', stroke: 'none' }, s);
      }
      if (n === 'Circle') u.svg('circle', { cx: 16, cy: 16, r: 1.4, fill: '#253e97', stroke: 'none' }, s);
      if (n === 'Compass') {
        s.firstChild.setAttribute('d', 'M16 3V8M13 9L7 28M19 9L25 28M11 17H21M12 9A4 4 0 1 1 20 9A4 4 0 1 1 12 9');
        u.svg('path', { d: 'M10 18L8 27M21 18L24 27', stroke: '#0b1b35', 'stroke-width': 2.5 }, s);
      }
      if (n === 'Text') {
        s.firstChild.remove();
        u.svg(
          'text',
          {
            x: 16,
            y: 28,
            'text-anchor': 'middle',
            fill: '#111',
            stroke: 'none',
            'font-family': 'Times New Roman,serif',
            'font-size': 31,
          },
          s,
        ).textContent = 'A';
      }
      if (n.startsWith('Zoom')) {
        s.firstChild.setAttribute('stroke', '#101c2d');
        u.svg(
          'path',
          { d: 'M9 13H17' + (n === 'Zoom In' ? 'M13 9V17' : ''), stroke: '#315ca8', 'stroke-width': 1.8 },
          s,
        );
      }
      if (n === 'Fit') {
        s.firstChild.setAttribute('d', 'M5 5H27V27H5Z');
        u.svg(
          'path',
          {
            d: 'M8 8L13 13M24 8L19 13M8 24L13 19M24 24L19 19M8 12V8H12M20 8H24V12M8 20V24H12M20 24H24V20',
            stroke: '#1b438c',
            'stroke-width': 2.3,
          },
          s,
        );
      }
      u.el('span', '', b, n);
      b.onclick = () => {
        tool.querySelectorAll('.qt-tool').forEach((x) => x.classList.remove('sel'));
        b.classList.add('sel');
      };
      if (sep) u.el('i', 'qt-sep', tool);
    }
    const main = u.el('div', 'qt-main', win);
    const stage = u.el('main', 'stage qt-stage', main);
    stage.dataset.role = 'stage';
    const side = u.el('aside', 'qt-side', main);
    const note = u.el('section', 'task-note qt-note', side);
    u.el('div', 'instruction', note, ctx.instruction);
    if (ctx.display === 'hidden') note.remove();
    else if (ctx.display === 'panel') {
      note.classList.add('qt-instruction-panel');
      u.el('h4', '', note, 'Task instructions');
      note.prepend(note.lastChild);
    } else if (ctx.display === 'toast') {
      note.classList.add('qt-instruction-toast');
      const x = u.el('button', 'note-close', note, '×');
      x.type = 'button';
      x.setAttribute('aria-label', 'Dismiss instruction');
      x.onclick = () => note.remove();
    }
    const nt = u.el('div', 'qt-sec', side);
    u.el('h4', '', nt, 'Notes:');
    const ul = u.el('ul', '', nt);
    for (const t of [
      'The new point will be point C.',
      'Segment BC must be perpendicular to segment BA.',
      'Do not click inside the dotted circle.',
    ])
      u.el('li', '', ul, t);
    const ct = u.el('div', 'qt-sec', side);
    u.el('h4', '', ct, 'Current tool:');
    u.el('p', '', ct, 'Point');
    const ac = u.el('div', 'qt-sec', side);
    u.el('h4', '', ac, 'Action:');
    u.el('p', '', ac, 'Click in the drawing area to place point C.');
    let submit = null;
    const sp = u.el('div', 'qt-submit', side);
    const makeEnd = (parent, cls, text, decoy = false) => {
      const b = u.el('button', cls, parent, text);
      b.type = 'button';
      b.dataset.role = decoy ? 'decoy' : 'submit';
      if (decoy) {
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      } else {
        b.title = text;
        b.setAttribute('aria-label', text);
        b.onclick = () => ctx.submit();
      }
      return b;
    };
    if (!ctx.finish && placement === 'side') submit = makeEnd(sp, 'submit', endLabel);
    const st = u.el('footer', 'qt-status', win);
    u.el('span', 'qt-ready', st, 'Ready');
    u.el('span', 'qt-xy', st, 'x: 6.32     y: -1.48');
    u.el('span', 'qt-zoom', st, '100%');
    if (!ctx.finish && placement === 'toolbar') submit = makeEnd(tool, 'qt-end-toolbar', endLabel);
    if (!ctx.finish && placement === 'status') submit = makeEnd(st, 'qt-end-status', endLabel);
    if (!ctx.finish && collide) {
      const parent = collide.where === 'toolbar' ? tool : st;
      makeEnd(
        parent,
        collide.where === 'toolbar' ? 'qt-end-toolbar qt-xtra' : 'qt-end-status qt-xtra',
        collide.label,
        true,
      );
    }
    if (ctx.finish || placement !== 'side') sp.remove();
    const instruction = body.querySelector('.qt-note .instruction');
    const unit = parseFloat(getComputedStyle(document.documentElement).fontSize) / 16;
    if (instruction && instruction.getBoundingClientRect().height > 184 * unit)
      instruction.style.paddingBottom = 'calc(6 * var(--p))';
    return { stage, submit };
  }
  env.site({
    name: 'design-click-point-right-angle-02',
    styles: ['site.css', 'qt.css'],
    scripts: [],
    template: 'site/click-point-bisect-03',
    design: {
      parts: {
        frame: (base, S) =>
          function (ctx) {
            return qtFrame(ctx);
          },
      },
    },
  });
})();
