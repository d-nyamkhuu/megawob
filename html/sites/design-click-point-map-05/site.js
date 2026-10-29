// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-point-map-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'ribbon',
        'theme': 'aero',
        'title': 'City Maps',
        'ribbon': true,
        'foot': '',
        'accent': '#2a8a2a',
        'bg': '#e6f3fc',
        'surface': '#ffffff',
        'font': 'Trebuchet MS, Segoe UI, Verdana, sans-serif',
      },
      parts: {
        'frame.3': () => () => {},
        'frame.12': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            const bar = u.el('div', 'tabbar', head);
            const tabs = u.el('div', 'tabs', bar);
            ['Map', 'Satellite', 'Transit', 'Places', 'My Maps'].forEach((t, i) => {
              const b = u.el('button', 'tab' + (i === 0 ? ' on' : ''), tabs, t);
              b.type = 'button';
              b.onclick = () => {
                tabs.querySelectorAll('.tab').forEach((x) => x.classList.remove('on'));
                b.classList.add('on');
              };
            });
            const util = u.el('div', 'tabutil', bar);
            u.el('button', 'ut print', util, 'Print').type = 'button';
            u.el('i', 'sep', util);
            u.el('button', 'ut help', util, 'Help').type = 'button';
            const insp = u.el('div', 'inspector', head);
            const card1 = u.el('div', 'icard', insp);
            u.el('h3', '', card1, 'Location Details');
            const ph = u.el('div', 'photo', card1);
            ph.innerHTML = '<svg viewBox="0 0 220 90" preserveAspectRatio="none" width="100%" height="100%"><defs><linearGradient id="phs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9cc8ee"/><stop offset="1" stop-color="#e4eef4"/></linearGradient></defs><rect width="220" height="90" fill="url(#phs)"/><rect x="95" y="22" width="52" height="38" fill="#ddd2a8"/><path d="M90 26L121 8L152 26Z" fill="#8a7e6a"/><rect x="104" y="32" width="8" height="10" fill="#6d7f93"/><rect x="124" y="32" width="8" height="10" fill="#6d7f93"/><rect x="160" y="14" width="60" height="46" fill="#dfe6ee"/><path d="M156 18L190 6L224 18Z" fill="#7a8794"/><rect x="170" y="30" width="10" height="14" fill="#5d7088"/><rect x="0" y="0" width="75" height="62" fill="#2f6a2c" opacity=".0"/><circle cx="22" cy="28" r="30" fill="#3d7a35"/><circle cx="58" cy="22" r="26" fill="#2f6a2c"/><circle cx="84" cy="34" r="18" fill="#4a8a3c"/><circle cx="175" cy="26" r="18" fill="#3a7430"/><rect x="0" y="62" width="220" height="12" fill="#6fa04a"/><rect x="0" y="74" width="220" height="16" fill="#6e6a64"/><rect x="0" y="72" width="220" height="3" fill="#b8b2a4"/><circle cx="195" cy="64" r="9" fill="#4f8a3a"/></svg>';
            {
              let t = 11; const q = () => { t = (t * 16807) % 2147483647; return t / 2147483647; };
              let leaves = '';
              const blob = (cx, cy, rx, ry, n, cols) => { for (let i = 0; i < n; i++) { const a = q() * 6.283, d = Math.sqrt(q()); leaves += '<circle cx="' + (cx + Math.cos(a) * d * rx).toFixed(1) + '" cy="' + (cy + Math.sin(a) * d * ry).toFixed(1) + '" r="' + (3 + q() * 5).toFixed(1) + '" fill="' + cols[Math.floor(q() * cols.length)] + '"/>'; } };
              blob(35, 28, 38, 26, 70, ['#1f4a1c', '#2f6a26', '#3f7f2e', '#56933a']);
              blob(80, 20, 28, 20, 40, ['#2a5a22', '#3c7a2c', '#6aa044']);
              blob(200, 30, 24, 28, 40, ['#2a5a22', '#3c7a2c', '#5a9a3c']);
              ph.innerHTML = '<svg viewBox="0 0 220 90" preserveAspectRatio="none" width="100%" height="100%"><defs><linearGradient id="phs2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a9c9e6"/><stop offset="1" stop-color="#e9efe6"/></linearGradient><linearGradient id="phr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a766c"/><stop offset="1" stop-color="#4c4a46"/></linearGradient></defs><rect width="220" height="90" fill="url(#phs2)"/><rect x="92" y="24" width="56" height="38" fill="#dccf9a"/><path d="M88 28L120 6L152 28Z" fill="#8c8272"/><g stroke="#c4b684" stroke-width=".6"><path d="M92 30H148M92 36H148M92 42H148M92 48H148M92 54H148"/></g><rect x="100" y="32" width="9" height="12" fill="#5b6f84"/><rect x="128" y="32" width="9" height="12" fill="#5b6f84"/><rect x="112" y="46" width="14" height="16" fill="#f1ece0"/><rect x="156" y="12" width="64" height="52" fill="#e8ecf2"/><path d="M152 18L188 2L224 18Z" fill="#6f7c8a"/><rect x="166" y="30" width="10" height="16" fill="#52667e"/><rect x="190" y="30" width="10" height="16" fill="#52667e"/><rect x="0" y="60" width="220" height="10" fill="#5f8f3e"/><rect x="0" y="70" width="220" height="20" fill="url(#phr)"/><rect x="0" y="69" width="220" height="2" fill="#c9c3b4"/>' + leaves + '<ellipse cx="60" cy="68" rx="70" ry="5" fill="#000" opacity=".25"/></svg>';
            }
            const globe = u.el('div', 'globe', head);
            globe.innerHTML = '<svg viewBox="0 0 60 60" width="100%" height="100%"><defs><radialGradient id="gl" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#8fd0ff"/><stop offset="1" stop-color="#1a62b8"/></radialGradient></defs><circle cx="30" cy="30" r="27" fill="url(#gl)" stroke="#fff" stroke-width="2"/><path d="M14 16Q24 8 30 14Q26 22 32 26Q24 34 28 46Q16 40 12 28Z" fill="#5fb04a"/><path d="M38 14Q50 18 50 30Q46 34 42 28Q44 22 38 14Z" fill="#6cbc52"/><path d="M36 38Q44 36 46 42Q40 50 34 48Z" fill="#5fb04a"/><ellipse cx="22" cy="14" rx="12" ry="6" fill="#fff" opacity=".35"/></svg>';
            const sb = u.el('div', 'scalebar', head);
            sb.innerHTML = '<svg viewBox="0 0 220 44" width="220" height="44"><g font-family="Trebuchet MS,sans-serif" font-size="13" fill="#222"><text x="0" y="14">0</text><text x="52" y="14">100</text><text x="116" y="14">200</text><text x="180" y="14">300</text><text x="236" y="14" opacity="0"> </text></g><path d="M3 22V34M3 33H181M67 26V34M131 26V34M181 22V34" stroke="#14406c" stroke-width="3" fill="none"/></svg>';
            const sky = u.el('div', 'skyline', head);
            sky.innerHTML = '<svg viewBox="0 0 520 70" width="100%" height="100%" preserveAspectRatio="xMaxYMax meet"><g fill="#5a98c8" opacity=".9"><rect x="10" y="38" width="36" height="32"/><rect x="60" y="28" width="12" height="42"/><rect x="100" y="8" width="18" height="62"/><rect x="135" y="26" width="34" height="44"/><rect x="200" y="30" width="12" height="40"/></g><g fill="#2f6ea8"><rect x="48" y="44" width="14" height="26"/><rect x="118" y="20" width="14" height="50"/><rect x="172" y="36" width="22" height="34"/></g><g fill="#cfe8f8" opacity=".8"><rect x="104" y="14" width="3" height="48"/><rect x="140" y="32" width="3" height="36"/></g><g fill="#6f9a5a"><circle cx="270" cy="40" r="20"/><circle cx="310" cy="28" r="24"/><circle cx="360" cy="36" r="20"/><circle cx="420" cy="42" r="18"/></g><path d="M240 70Q330 52 520 66V70Z" fill="#8cc070"/></svg>';
            for (const [k, v] of [['Street', '—'], ['Cross Street', '—'], ['Neighborhood', '—'], ['City', 'Riverton'], ['ZIP Code', '—'], ['Coordinates', '—']]) {
              const r = u.el('div', 'irow', card1);
              u.el('span', '', r, k);
              u.el('b', '', r, v);
            }
            const card2 = u.el('div', 'icard', insp);
            u.el('h3', '', card2, 'Nearby Places');
            for (const [k, v, c] of [['Riverton Park', '0.3 km', '#3a9a3a'], ['Maple Street Café', '0.6 km', '#2a6aa8'], ['Lakeside Market', '0.8 km', '#2a7ad8'], ['Riverton Elementary', '1.1 km', '#2a5a98'], ['Riverton Medical Center', '1.4 km', '#d82a2a']]) {
              const r = u.el('div', 'prow', card2);
              const ic = u.el('i', '', r);
              ic.style.background = 'none';
              ic.innerHTML = {
                '#3a9a3a': '<svg viewBox="0 0 22 22"><path d="M11 1L17 9H14L19 15H12V21H10V15H3L8 9H5Z" fill="#3a9a3a"/></svg>',
                '#2a6aa8': '<svg viewBox="0 0 22 22"><path d="M5 1V8Q5 10 7 10V21H9V1H8V7H7V1ZM15 1Q12 3 12 9Q12 11 14 11V21H16V1Z" fill="#2a6aa8"/></svg>',
                '#2a7ad8': '<svg viewBox="0 0 22 22"><path d="M3 8H19L18 21H4Z" fill="#2a7ad8"/><path d="M7 8V6Q7 2 11 2Q15 2 15 6V8" fill="none" stroke="#1a5aa8" stroke-width="1.6"/></svg>',
                '#2a5a98': '<svg viewBox="0 0 22 22"><path d="M11 3L21 8L11 13L1 8Z" fill="#2a5a98"/><path d="M5 11V16Q11 20 17 16V11L11 14Z" fill="#3a6aa8"/></svg>',
                '#d82a2a': '<svg viewBox="0 0 22 22"><path d="M8 2H14V8H20V14H14V20H8V14H2V8H8Z" fill="#d82a2a"/></svg>',
              }[c];
              u.el('span', '', r, k);
              u.el('em', '', r, v);
            }
            if (false) {
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
