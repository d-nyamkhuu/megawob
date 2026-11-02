// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-point-axis-05',
    styles: ['site.css', 'studio.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'ribbon',
        'theme': 'eink',
        'title': 'Data Studio',
        'ribbon': true,
        'foot': '',
        'accent': '#ff8069',
        'bg': '#1b1728',
        'surface': '#262137',
        'font': 'Segoe UI, Arial, sans-serif',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.12': (base, S) =>
          function (_c) {
            const { C } = S;
            {
              const { head, u } = _c;
              document.body.classList.add('studio-mode-' + (_c.ctx.display || 'header'));
              const rib = u.el('div', 'studio-ribbon', head);
              const menu = u.el('nav', 'studio-menu', rib);
              for (const label of ['File', 'Edit', 'View', 'Data', 'Tools', 'Help']) {
                const b = u.el('button', '', menu, label);
                b.type = 'button';
                b.onclick = () => env.log('menu', { label });
              }
              const side = u.el('aside', 'studio-sidebar', rib);
              const sideTop = u.el('div', 'studio-side-top', side);
              u.el('span', '', sideTop, 'Datasets');
              const plus = u.el('button', 'studio-plus', sideTop, '+');
              plus.type = 'button';
              const search = u.el('input', 'studio-search', side);
              search.type = 'search';
              search.placeholder = '⌕  Search datasets...';
              search.setAttribute('aria-label', 'Search datasets');
              const list = u.el('div', 'studio-list', side);
              const records = [
                ['Product Adoption', 'Mar 1, 2026'], ['Website Traffic', 'Feb 18, 2026'],
                ['Customer Retention', 'Feb 10, 2026'], ['Revenue Growth', 'Jan 28, 2026'],
                ['Market Share', 'Jan 15, 2026'], ['User Engagement', 'Jan 5, 2026'],
                ['Feature Usage', 'Dec 18, 2025'], ['Support Tickets', 'Dec 2, 2025'],
                ['Conversion Rate', 'Nov 20, 2025'], ['Active Users', 'Nov 6, 2025'],
                ['Churn Risk', 'Oct 24, 2025'], ['Net Promoter Score', 'Oct 9, 2025']
              ];
              records.forEach(([name, date], i) => {
                const row = u.el('button', 'studio-row' + (i === 0 ? ' active' : ''), list);
                row.type = 'button';
                const icon = u.el('span', 'studio-row-icon', row);
                icon.innerHTML = '<svg viewBox="0 0 40 40" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 5v28h28"/><path d="M9 26l8-8 7 4 9-12"/></svg>';
                const copy = u.el('span', 'studio-row-copy', row);
                u.el('span', 'studio-row-name', copy, name);
                u.el('span', 'studio-row-date', copy, date);
                row.onclick = () => {
                  list.querySelectorAll('.studio-row').forEach(x => x.classList.remove('active'));
                  row.classList.add('active');
                  document.querySelector('.studio-main-title').textContent = name;
                  document.querySelector('.studio-main-date').textContent = date;
                };
              });
              search.oninput = () => list.querySelectorAll('.studio-row').forEach(row => {
                row.hidden = !row.textContent.toLowerCase().includes(search.value.toLowerCase());
              });
              const card = u.el('section', 'studio-header-card', rib);
              const hero = u.el('div', 'studio-hero', card);
              const heroIcon = u.el('div', 'studio-hero-icon', hero);
              heroIcon.innerHTML = '<svg viewBox="0 0 60 60" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.7"><path stroke="#bcb5c8" d="M9 8v42h43"/><path d="M10 39l14-15 10 7 16-20"/></svg>';
              const heroCopy = u.el('div', 'studio-hero-copy', hero);
              u.el('div', 'studio-main-title', heroCopy, 'Product Adoption');
              u.el('div', 'studio-main-date', heroCopy, 'Mar 1, 2026');
              const metadata = u.el('div', 'studio-metadata', card);
              for (const [label, value] of [
                ['Segment', 'All Users'], ['Date Range', 'Jan 1, 2026 – Mar 1, 2026'],
                ['Metric', 'Adoption Rate'], ['View', 'Line Chart']
              ]) {
                const cell = u.el('div', 'studio-meta-cell', metadata);
                u.el('div', '', cell, label);
                u.el('div', '', cell, value);
              }
              return;
            }
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
        'frame.27': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, head, u } = _c;
            {
              const endR = ctx.rng.fork('chrome/end');
              const endBank = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                ? ctx.content.END_LABELS : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
              const asLabel = x => typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x);
              const mode = ctx.finish ? 'none' : endR.bool(0.5) ? 'toolbar' : endR.pick(['footer', 'link', 'icon']);
              const label = mode === 'toolbar' ? 'Apply' : asLabel(endR.pick(endBank));
              const menu = document.querySelector('.studio-menu');
              const actionBar = u.el('div', 'studio-actions', head);
              const addButton = (parent, text, cls, callback) => {
                const b = u.el('button', cls, parent, text);
                b.type = 'button';
                b.onclick = callback;
                return b;
              };
              if (!ctx.finish) {
                const parent = mode === 'toolbar' || mode === 'icon' ? actionBar : footer;
                const text = mode === 'icon' ? '✓' : label;
                const b = mode === 'link' ? u.el('a', 'studio-end-link', parent, label) : addButton(parent, text, 'studio-end', () => ctx.submit());
                if (mode === 'link') { b.href = '#'; b.onclick = e => { e.preventDefault(); ctx.submit(); }; }
                b.dataset.role = 'submit';
                b.title = mode === 'icon' ? 'Finish task' : label;
                b.setAttribute('aria-label', mode === 'icon' ? 'Finish task' : label);
                _c.submit = b;
              }
              const cr = ctx.rng.fork('chrome/collide');
              if (cr.bool(0.3)) {
                const options = [...new Set(endBank.map(asLabel))].filter(x => x.toLowerCase() !== label.toLowerCase());
                if (options.length) {
                  const txt = cr.pick(options);
                  addButton(actionBar, txt, 'studio-extra', () => env.log('decoy', { label: txt, collide: true }));
                }
              }
              queueMicrotask(() => {
                const stage = document.querySelector('.stage');
                if (!stage || stage.querySelector('.studio-chart')) return;
                document.querySelectorAll('button').forEach(b => {
                  if (b.textContent.trim() === 'Submit answer' && !b.classList.contains('studio-end')) b.remove();
                });
                const ticks = [...stage.querySelectorAll('*')].filter(el => !el.children.length)
                  .map(el => ({ el, raw: el.textContent.trim() }))
                  .filter(t => /^-?\d+(?:\.\d+)?$/.test(t.raw))
                  .map(t => ({ value: Number(t.raw), x: t.el.getBoundingClientRect().left + t.el.getBoundingClientRect().width / 2 }));
                const lo = ticks.length ? Math.min(...ticks.map(t => t.value)) : 0;
                const hi = ticks.length ? Math.max(...ticks.map(t => t.value)) : 100;
                const lowTick = ticks.find(t => t.value === lo);
                const highTick = ticks.find(t => t.value === hi);
                const unit = stage.textContent.includes('°C') ? '°C' : stage.textContent.includes('%') ? '%' : '';
                const fmt = v => Number.isInteger(v) ? String(v) : String(Number(v.toFixed(1)));
                const chart = u.el('div', 'studio-chart', stage);
                let svg = '<svg viewBox="0 0 1200 500" preserveAspectRatio="none" aria-label="Adoption Rate line chart">';
                const X = x => 105 + x * 10.5;
                const Y = y => 412 - y * 3.65;
                for (let v = 0; v <= 100; v += 10) {
                  const x = X(v);
                  svg += '<line class="chart-grid" x1="' + x + '" y1="54" x2="' + x + '" y2="412"/><text class="chart-tick" x="' + x + '" y="440" text-anchor="middle">' + fmt(lo + (hi-lo)*v/100) + (unit === '%' ? '%' : '') + '</text>';
                }
                for (let v = 0; v <= 100; v += 20) {
                  const y = Y(v);
                  svg += '<line class="chart-grid" x1="105" y1="' + y + '" x2="1155" y2="' + y + '"/><text class="chart-tick" x="90" y="' + (y + 5) + '" text-anchor="end">' + v + '%</text>';
                }
                svg += '<line class="chart-axis" x1="105" y1="54" x2="105" y2="412"/><line class="chart-axis" x1="105" y1="412" x2="1155" y2="412"/>';
                const vals = [3,6,10,15,21,28,37,48,61,77,89];
                svg += '<polyline class="chart-line" points="' + vals.map((v,i) => X(i*10) + ',' + Y(v)).join(' ') + '"/>';
                vals.forEach((v,i) => { svg += '<circle class="chart-point" cx="' + X(i*10) + '" cy="' + Y(v) + '" r="5"/>'; });
                svg += '<text class="chart-axis-label" x="630" y="480" text-anchor="middle">Progress</text><text class="chart-axis-label" x="26" y="235" text-anchor="middle" transform="rotate(-90 26 235)">Adoption Rate</text><circle class="placed-point" cx="-20" cy="-20" r="8"/></svg>';
                chart.innerHTML = svg;
                stage.addEventListener('pointerdown', e => {
                  const r = chart.getBoundingClientRect();
                  const p = Math.max(0, Math.min(1, ((e.clientX-r.left)/r.width-105/1200)/(1050/1200)));
                  const c = chart.querySelector('.placed-point');
                  const index = p*10, before = Math.floor(index), after = Math.min(10,before+1);
                  const lineValue = vals[before] + (vals[after]-vals[before])*(index-before);
                  if (c) { c.setAttribute('cx', X(p*100)); c.setAttribute('cy', Y(lineValue)); }
                }, true);
              });
              const dock = u.el('nav', 'studio-dock', footer);
              const dockIcons = [
                '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5c0 1.7-3.6 3-8 3S4 6.7 4 5Zm0 7v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6c0 1.7-3.6 3-8 3s-8-1.3-8-3Z"/></svg>',
                '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><rect x="3" y="12" width="4" height="9"/><rect x="10" y="5" width="4" height="16"/><rect x="17" y="9" width="4" height="12"/></svg>',
                '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2a8 8 0 0 0-8 8c0 5 8 12 8 12s8-7 8-12a8 8 0 0 0-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/></svg>',
                '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M5 2h10l5 5v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Zm9 1v5h5M7 12h10v1H7Zm0 4h10v1H7Z"/></svg>',
                '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M10 1h4l.7 2.4 2 .8 2.2-1.2 2.8 2.8-1.2 2.2.8 2L23 11v4l-2.4.7-.8 2 1.2 2.2-2.8 2.8-2.2-1.2-2 .8L14 24h-4l-.7-2.4-2-.8-2.2 1.2-2.8-2.8 1.2-2.2-.8-2L0 14v-4l2.4-.7.8-2L2 5.1l2.8-2.8L7 3.5l2-.8L10 1Zm2 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/></svg>'
              ];
              for (const [i, name] of ['Datasets','Visualizations','Maps','Reports','Settings'].entries()) {
                const item = u.el('button', 'studio-dock-item' + (i === 0 ? ' active' : ''), dock);
                item.type = 'button';
                const icon = u.el('span', 'studio-dock-icon', item);
                icon.innerHTML = dockIcons[i];
                u.el('span', '', item, name);
                item.onclick = () => { dock.querySelectorAll('.studio-dock-item').forEach(x => x.classList.remove('active')); item.classList.add('active'); };
              }
              return;
            }
            const endR = ctx.rng.fork('chrome/end');
            const finishMode = !!ctx.finish;
            const endMode = finishMode ? 'none' : endR.bool(0.5) ? 'footer' : endR.pick(['toolbar', 'link']);
            const endBank =
              ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
                ? ctx.content.END_LABELS
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
            const asLabel = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
            const endLabel = endMode === 'footer' ? 'Submit' : asLabel(endR.pick(endBank));
            const submitInto = (parent, tag, cls, text) => {
              const b = u.el(tag, cls, parent, text);
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
            const toolbarHead = head;
            if (endMode === 'footer') {
              _c.submit = submitInto(footer, 'button', 'submit', 'Submit');
            } else if (endMode === 'link') {
              _c.submit = submitInto(footer, 'a', 'end-link', endLabel + ' ›');
              _c.submit.style.cssText =
                'margin-left:auto;color:#111;text-decoration:underline;font:20px Georgia,serif;padding:10px 14px;white-space:nowrap';
            } else if (endMode === 'toolbar') {
              _c.submit = submitInto(toolbarHead, 'button', 'toolbar-end', endLabel);
              _c.submit.style.cssText =
                'position:absolute;left:210px;top:5px;height:34px;min-width:104px;padding:3px 12px;border:1px solid #555;background:#eee;color:#111;font:18px Georgia,serif';
            }
            const collideR = ctx.rng.fork('chrome/collide');
            if (collideR.bool(0.3)) {
              const collidePool = [
                ...new Set(
                  endBank.map(asLabel).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()),
                ),
              ];
              if (collidePool.length) {
                const decoy = u.el('button', 'chrome-xtra', footer, collideR.pick(collidePool));
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.style.cssText =
                  'height:42px;padding:5px 10px;border:1px dashed #555;background:#f2f1ed;color:#111;font:16px Georgia,serif';
                decoy.onclick = () => env.log('decoy', { label: decoy.textContent, collide: true });
              }
            }
            if (C.theme === 'eink') {
              const points = u.el('span', 'points', footer, 'Points: 0/1');
              footer.insertBefore(points, _c.submit && _c.submit.parentNode === footer ? _c.submit : null);
              const clear = u.el('button', 'clear', footer, 'Clear');
              clear.onclick = () => {
                env.widgetDef.clear?.();
              };
            }
            Object.assign(_c, {
              asLabel,
              collideR,
              endBank,
              endLabel,
              endMode,
              endR,
              finishMode,
              submitInto,
              toolbarHead,
            });
          },
        'frame.28': () => () => {},
      },
    },
  });
})();
