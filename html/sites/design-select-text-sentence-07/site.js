// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-select-text-sentence-07',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'notebook',
        'theme': 'pixel',
        'title': 'Reading Practice',
        'menu': 'Home',
        'foot': '',
        'accent': '#2a8f93',
        'bg': '#17305a',
        'surface': '#fffdf0',
        'font': "'Courier New', Courier, monospace",
        'tabs': ['Notes', 'Read', 'Tasks', 'Tools', 'Help'],
      },
      parts: {
        'frame.1': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx } = _c;
            const u = ctx.util,
              body = document.body,
              display = ctx.display;
            body.className =
              'design ' +
              C.theme +
              ' layout-' +
              C.layout +
              (display === 'toast' ? ' has-instruction-toast' : display === 'panel' ? ' has-instruction-panel' : '');
            Object.assign(_c, { body, display, u });
          },
        'frame.2': () => () => {},
        'frame.3': () => () => {},
        'frame.9': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            const mast = u.el('div', 'mast', head),
              ttl = u.el('div', 'title', mast);
            u.el('span', 'brand', ttl, 'NorthBridge');
            u.el('span', 'sub', ttl, 'Extranet');
            const tl = u.el('div', 'toplinks', mast);
            ['Suppliers', 'Orders', 'Support', 'Account', 'Log Out'].forEach((t, i) => {
              if (i) u.el('i', '', tl, '|');
              u.el('span', '', tl, t);
            });
            const nav = u.el('nav', 'menu', head);
            C.menu.split(/\s{2,}/).forEach((t, i) => {
              const a = u.el('a', i === 0 ? 'on' : '', nav, t);
              a.href = '#';
              a.onclick = (e) => e.preventDefault();
            });
            u.el('span', 'date', nav, 'Tue, Apr 13, 1999');
            Object.assign(_c, { mast, nav, tl, ttl });
          },
        'frame.10': () => () => {},
        'frame.11': () => () => {},
        'frame.13': (base, S) =>
          function (_c) {
            const { ctx, shell, u } = _c;
            const pixelIcon = (parent, name) => {
              const icon = u.svg(
                'svg',
                { viewBox: '0 0 24 24', 'shape-rendering': 'crispEdges', 'aria-hidden': 'true' },
                parent,
              );
              const path = (d, fill, stroke = 'none', sw = 0) =>
                u.svg('path', { d, fill, stroke, 'stroke-width': sw }, icon);
              const navy = '#080e3b',
                paper = '#eaf3ff',
                shadow = '#7594b5';
              if (name === 'Notes') {
                path('M3 1H18V3H21V23H3Z', navy);
                path('M5 3H17V5H19V21H5Z', paper);
                path('M7 6H16V8H7ZM7 11H16V13H7ZM7 16H16V18H7Z', navy);
                path('M17 5H19V21H17Z', shadow);
              } else if (name === 'Read') {
                path('M1 4H3V2H9V3H11V4H13V3H15V2H21V4H23V21H15V22H9V21H1Z', navy);
                path('M3 5H5V4H9V5H11V19H8V18H3Z', paper);
                path('M13 5H15V4H19V5H21V18H16V19H13Z', paper);
                path('M5 7H9V9H5ZM5 11H9V13H5ZM5 15H9V17H5ZM15 7H19V9H15ZM15 11H19V13H15ZM15 15H19V17H15Z', '#5088ac');
                path('M3 20H10V21H14V20H21', paper);
              } else if (name === 'Tasks') {
                path('M3 2H18V3H21V5H22V21H20V23H3V22H2V3Z', navy);
                path('M5 4H17V6H20V20H18V21H5Z', paper);
                path('M14 3H18V5H19V9H15V8H14Z', shadow);
                path('M6 12H8V14H10V12H12V10H14V8H16V9H18V11H16V13H14V15H12V17H10V19H8V17H6Z', navy);
              } else if (name === 'Tools') {
                path(
                  'M2 17H4V15H6V13H8V11H10V5H12V3H14V1H21V3H19V5H17V7H20V5H22V10H20V12H15V14H13V16H11V18H9V20H7V22H2V20H1V18Z',
                  navy,
                );
                path(
                  'M4 17H6V15H8V13H10V11H12V5H14V3H18V4H16V6H15V9H20V10H14V12H12V14H10V16H8V18H6V20H3V18H4Z',
                  '#a8d8e9',
                );
                path('M4 17H6V19H4Z', navy);
              } else {
                path('M6 1H18V2H20V4H22V20H20V22H18V23H6V22H4V20H2V4H4V2H6Z', navy);
                path('M7 3H17V4H19V6H20V18H18V20H16V21H8V20H6V18H4V6H6V4H7Z', paper);
                path('M8 7V5H15V6H17V10H15V12H13V15H10V11H12V9H14V7ZM10 17H13V20H10Z', navy);
              }
              return icon;
            };
            const endRng = ctx.rng.fork('chrome/end'),
              collideRng = ctx.rng.fork('chrome/collide');
            const placement = ctx.finish ? null : endRng.pick(['footer', 'footer', 'footer', 'title', 'link']);
            _c.endLabel = placement === 'footer' && endRng.bool(0.8) ? 'Submit' : null;
            if (placement && !_c.endLabel) {
              const bank = ctx.content && ctx.content.END_LABELS;
              const labels =
                Array.isArray(bank) && bank.length
                  ? bank
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
              const v = endRng.pick(labels);
              _c.endLabel = typeof v === 'string' ? v : (v && (v.label || v.text || v.name)) || String(v);
            }
            _c.collision = null;
            if (!ctx.finish && collideRng.bool(0.3)) {
              const bank = ctx.content && ctx.content.END_LABELS;
              const labels =
                Array.isArray(bank) && bank.length
                  ? bank
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
              const same = (x) => String(x).trim().toLowerCase() === String(_c.endLabel).trim().toLowerCase();
              const options = [
                ...new Set(
                  labels.map((v) => (typeof v === 'string' ? v : (v && (v.label || v.text || v.name)) || String(v))),
                ),
              ].filter((x) => !same(x));
              if (options.length) _c.collision = collideRng.pick(options);
            }
            _c.submit = null;
            const frame = u.el('div', 'frame', shell),
              ph = u.el('div', 'ptitle', frame);
            {
              const ic = u.svg(
                'svg',
                { width: 34, height: 40, viewBox: '0 0 36 40', 'shape-rendering': 'crispEdges' },
                ph,
              );
              u.svg('path', { d: 'M10 6H34V38H10Z', fill: '#a9a5da', stroke: '#080e3b', 'stroke-width': 3 }, ic);
              u.svg('path', { d: 'M3 1H27V37H3Z', fill: '#e5e1f6', stroke: '#080e3b', 'stroke-width': 3 }, ic);
              u.svg(
                'path',
                { d: 'M8 8H22M8 15H22M8 22H22M8 29H19', fill: 'none', stroke: '#080e3b', 'stroke-width': 2.5 },
                ic,
              );
              u.el('b', '', ph, 'Reading Practice');
              if (placement === 'title') {
                _c.submit = u.el('button', 'title-end', ph, _c.endLabel);
                _c.submit.type = 'button';
                _c.submit.dataset.role = 'submit';
                _c.submit.setAttribute('aria-label', _c.endLabel);
                _c.submit.title = _c.endLabel;
                _c.submit.onclick = () => ctx.submit();
              }
              u.el('span', '', ph, 'Page 1 of 1');
            }
            u.el(
              'div',
              'hint',
              frame,
              'Read the text below. Use your mouse to highlight the requested sentence.',
            );
            const content = u.el('div', 'content', frame),
              note = u.el('section', 'task-note', content);
            Object.assign(_c, { collideRng, content, endRng, frame, note, ph, pixelIcon, placement });
          },
        'frame.18': (base, S) =>
          function (_c) {
            const { display, note, u } = _c;
            if (display === 'hidden') note.hidden = true;
            else if (display === 'toast') {
              note.classList.add('instruction-toast');
              const x = u.el('button', 'note-close', note, '×');
              x.onclick = () => (note.style.visibility = 'hidden');
            } else if (display === 'panel') note.classList.add('instruction-panel');
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, frame, pixelIcon, u } = _c;
            if (['three', 'windows', 'offset', 'sheet', 'notebook', 'rail', 'palette', 'ledger'].includes(C.layout)) {
              _c.aside = u.el('aside', 'aside', content);
              if (C.tabs) {
                _c.aside.classList.add('tabs');
                for (const text of C.tabs) {
                  const bt = u.el('button', 'tab' + (text === 'Read' ? ' active' : ''), _c.aside, text);
                  bt.type = 'button';
                  {
                    const ic = pixelIcon(bt, text);
                    bt.prepend(ic);
                  }
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
                if (C.aside === 'Your Answer') {
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
            const footer = u.el('footer', 'footer', frame);
            const sel = u.el('button', 'clear selbtn', footer, 'Select Text');
            sel.type = 'button';
            const clr = u.el('button', 'clear', footer, 'Clear Highlight');
            clr.type = 'button';
            clr.onclick = () => {
              env.widgetDef.clear?.();
            };
            Object.assign(_c, { clr, footer, sel });
          },
        'frame.23': () => () => {},
        'frame.24': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { ctx, footer, placement, u } = _c;
            {
              const cn = u.el('button', 'cancel', footer, 'Cancel');
              cn.type = 'button';
              cn.onclick = () => env.log('cancel', {});
            }
            if (!ctx.finish && placement !== 'title') {
              if (placement === 'link') {
                _c.submit = u.el('a', 'end-link', footer, _c.endLabel + ' ›');
                _c.submit.href = '#';
              } else _c.submit = u.el('button', 'submit', footer, _c.endLabel);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.setAttribute('aria-label', _c.endLabel);
              _c.submit.title = _c.endLabel;
              _c.submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
            }
            if (_c.collision) {
              const d = u.el('button', 'end-xtra', footer, _c.collision);
              d.type = 'button';
              d.dataset.role = 'xtra';
              d.onclick = () => env.log('decoy', { label: _c.collision, collide: true });
            }
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
