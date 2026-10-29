// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-sort-into-bins-sort-06',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'aqua-doc',
        'theme': 'aqua',
        'title': 'Shape Sorter',
        'menu': 'Finder       File       Edit       View       Go       Window       Help',
        'foot': '',
        'accent': '#0876df',
        'bg': '#79b9f1',
        'surface': '#f7fbff',
        'font': "Arial, 'Lucida Grande', sans-serif",
        'aside': 'Instructions',
      },
      parts: {
        'frame.2': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx } = _c;
            body.className =
              'design ' +
              C.theme +
              ' layout-' +
              C.layout +
              (C.layout === 'aqua-doc' ? ' aqua-doc' : '') +
              (ctx.display === 'toast' ? ' has-instruction-toast' : '') +
              ' display-' +
              ctx.display;
            const endR = ctx.rng.fork('chrome/end'),
              collideR = ctx.rng.fork('chrome/collide');
            const endLabels =
              ctx.content && Array.isArray(ctx.content.END_LABELS)
                ? ctx.content.END_LABELS
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
            const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
            _c.label = endR.bool(0.5) ? 'Submit' : labelText(endR.pick(endLabels));
            const placement = endR.pick(['footer', 'footer', 'header', 'link']);
            if (placement === 'footer') _c.label = 'Submit';
            _c.collide = null;
            if (collideR.bool(0.3)) {
              const options = [...new Set(endLabels.map(labelText))].filter(
                (x) => x.trim().toLowerCase() !== _c.label.trim().toLowerCase(),
              );
              if (options.length) _c.collide = collideR.pick(options);
            }
            Object.assign(_c, { collideR, endLabels, endR, labelText, placement });
          },
        'frame.3': () => () => {},
        'frame.11': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, shell, u } = _c;
            for (const corner of ['tl', 'tr', 'bl', 'br']) {
              const ornament = u.el('div', 'corner corner-' + corner, shell);
              ornament.innerHTML =
                '<svg viewBox="0 0 30 30"><path d="M2 2H26L20 8L23 17L15 14L8 25L7 13L2 14Z" fill="#bd8d3d" stroke="#453016" stroke-width="2"/><path d="M4 4L18 5L11 9L9 18L8 8Z" fill="#ffe3a0"/><path d="M13 12L20 9L18 15L24 19L15 17L10 24Z" fill="#e0b25c" stroke="#674019"/></svg>';
            }
            if (C.menu) {
              const nav = u.el('nav', 'menu', head);
              C.menu.split(/\s{2,}/).forEach((t, i) => {
                const b = u.el('button', 'mtab' + (i === 0 ? ' on' : ''), nav, t);
                b.type = 'button';
                b.onclick = () => {
                  nav.querySelectorAll('.mtab').forEach((x) => x.classList.remove('on'));
                  b.classList.add('on');
                };
              });
              u.el('div', 'tagline', head, 'Learn ✦ Explore ✦ Grow');
            }
          },
        'frame.18': (base, S) =>
          function (_c) {
            const { ctx, note } = _c;
            if (ctx.display === 'hidden' || ctx.display === 'panel' || ctx.display === 'toast') note.hidden = true;
            else if (ctx.display === 'panel') note.classList.add('instruction-panel');
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, u } = _c;
            if (
              ['three', 'windows', 'offset', 'sheet', 'notebook', 'rail', 'palette', 'ledger', 'aqua-doc'].includes(
                C.layout,
              )
            ) {
              _c.aside = u.el('aside', 'aside', content);
              if (C.tabs) {
                _c.aside.classList.add('tabs');
                for (const text of C.tabs) {
                  const bt = u.el('button', 'tab', _c.aside, text);
                  bt.type = 'button';
                  bt.onclick = () => {
                    _c.aside.querySelectorAll('.tab').forEach((x) => x.classList.remove('active'));
                    bt.classList.add('active');
                  };
                }
              } else if (C.layout === 'sheet') {
                for (let i = 1; i <= 20; i++) u.el('div', 'index-number', _c.aside, String(i));
              } else if (C.layout === 'offset') {
                for (const text of ['Select', 'Zoom In', 'Zoom Out', 'Pan']) u.el('button', 'map-tool', _c.aside, text);
              } else {
                u.el('h3', '', _c.aside, C.aside || 'Instructions');
                if (C.layout === 'aqua-doc') {
                  if (['header', 'panel', 'toast'].includes(ctx.display)) {
                    const p = u.el('p', ctx.display === 'toast' ? 'margin-toast' : '', _c.aside, ctx.instruction);
                    if (ctx.display === 'toast') {
                      const x = u.el('button', 'margin-toast-close', p, '×');
                      x.type = 'button';
                      x.onclick = () => (p.style.visibility = 'hidden');
                    }
                  }
                  u.el('h3', 'margin-heading', _c.aside, 'Actions');
                  const ol = u.el('ol', 'margin-actions', _c.aside);
                  for (const t of [
                    'Point to a shape.',
                    'Drag it to the box with the same color.',
                    'Repeat for all shapes.',
                  ])
                    u.el('li', '', ol, t);
                } else if (C.aside === 'Your Answer') {
                  u.el('p', '', _c.aside, 'No point selected yet.');
                  u.el('hr', '', _c.aside);
                  u.el('p', '', _c.aside, 'X:    —');
                  u.el('p', '', _c.aside, 'Y:    —');
                } else if (C.aside === 'Progress') {
                  u.el('p', '', _c.aside, 'Problem 1 of 5');
                  u.el('progress', '', _c.aside).value = 0.2;
                  u.el('h3', '', _c.aside, 'Tips');
                  u.el('p', '', _c.aside, 'Click outside the dotted circle.');
                } else if (C.layout === 'windows') u.el('p', '', _c.aside, ctx.instruction);
                else if (C.theme === 'crop-minimal')
                  u.el('p', '', _c.aside, 'Drag the handles to resize the crop box.');
                else if (C.layout === 'palette') {
                  const ol = u.el('ol', 'guide', _c.aside);
                  for (const t of [
                    'Drag each handle to the target value.',
                    'Keep the lower value on the left and the higher value on the right.',
                    'Do not click on the track.',
                  ])
                    u.el('li', '', ol, t);
                }
              }
            }
          },
        'frame.23': () => () => {},
        'frame.25': (base, S) =>
          function (_c) {
            const { footer, u } = _c;
            const tools = u.el('div', 'tools', footer);
            u.el('span', 'tools-label', tools, 'Tools');
            for (const [nm, path] of [
              ['Select', 'M6 3V27L12 21L17 31L21 29L16 19H25Z'],
              ['Clear', 'M3 20L19 3L27 10L29 16L14 31L3 24Z'],
              ['Reset', 'M10 9A10 10 0 1 1 6 20'],
            ]) {
              const w = u.el('button', 'tool2' + (nm === 'Select' ? ' sel' : ''), tools);
              w.type = 'button';
              const s = u.svg(
                'svg',
                {
                  width: 34,
                  height: 34,
                  viewBox: '0 0 32 32',
                  fill: nm === 'Clear' ? '#9290b9' : nm === 'Select' ? '#fff' : 'none',
                  stroke: nm === 'Clear' ? '#30254c' : nm === 'Select' ? '#000' : '#a8a4c5',
                  'stroke-width': nm === 'Clear' ? 1 : nm === 'Select' ? 1.6 : 3.6,
                  'stroke-linejoin': 'round',
                },
                w,
              );
              u.svg('path', { d: path }, s);
              if (nm === 'Clear') {
                u.svg(
                  'path',
                  { d: 'M3 20L14 27L29 12L27 10L12 24Z', fill: '#b0afd0', stroke: '#50456d', 'stroke-width': 0.8 },
                  s,
                );
                u.svg(
                  'path',
                  { d: 'M14 27V31M3 20L14 27M12 24L27 10', fill: 'none', stroke: '#42375f', 'stroke-width': 1 },
                  s,
                );
              }
              if (nm === 'Reset')
                u.svg('path', { d: 'M11 2L3 9L12 16Z', fill: '#a8a4c5', stroke: '#a8a4c5', 'stroke-width': 0.5 }, s);
              u.el('small', '', w, nm);
              if (nm === 'Select')
                w.onclick = () => {
                  tools.querySelectorAll('.tool2').forEach((x) => x.classList.remove('sel'));
                  w.classList.add('sel');
                };
              else w.onclick = () => env.log('tool', { label: nm });
            }
            u.el('div', 'tool-sep', footer);
            Object.assign(_c, { tools });
          },
        'frame.27': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, head, placement, u } = _c;
            const makeEnd = (parent, cls, text) => {
              const b = u.el('button', cls, parent, text);
              b.type = 'button';
              b.dataset.role = 'submit';
              b.onclick = () => ctx.submit();
              return b;
            };
            const makeDecoy = (parent, text, collides) => {
              const b = u.el('button', collides ? 'aqua-xtra aqua-pq' : 'aqua-xtra', parent, text);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.onclick = () => env.log('decoy', collides ? { label: text, collide: true } : { label: text });
              return b;
            };
            if (!ctx.finish) {
              if (placement === 'header') _c.submit = makeEnd(head, 'submit aqua-title-submit', _c.label);
              else if (placement === 'link') _c.submit = makeEnd(footer, 'aqua-end-link', _c.label + ' ›');
              else _c.submit = makeEnd(footer, 'submit', _c.label);
              if (_c.collide) makeDecoy(placement === 'header' ? footer : head, _c.collide, true);
            }
            if (C.theme === 'eink') {
              const points = u.el('span', 'points', footer, 'Points: 0/1');
              if (_c.submit && _c.submit.parentNode === footer) footer.insertBefore(points, _c.submit);
              else footer.appendChild(points);
              const clear = u.el('button', 'clear', footer, 'Clear');
              clear.onclick = () => {
                env.widgetDef.clear?.();
              };
            }
            if (['aqua', 'collage'].includes(C.theme)) {
              const reset = u.el('button', 'clear', footer, C.theme === 'aqua' ? 'Reset Panel' : 'Reset');
              reset.onclick = () => env.widgetDef.clear?.();
              if (_c.submit && _c.submit.parentNode === footer) footer.insertBefore(reset, _c.submit);
            }
            if (ctx.display === 'hidden' && _c.aside) {
              const heading = _c.aside.querySelector('h3');
              if (heading) heading.remove();
              const actions = _c.aside.querySelector('.margin-heading');
              if (actions) actions.classList.add('margin-heading-first');
            }
            Object.assign(_c, { makeDecoy, makeEnd });
          },
        'frame.28': () => () => {},
        'frame.29': () => () => {},
      },
    },
  });
})();
