// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-crop-image-marquee-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'three',
        'theme': 'organizer',
        'title': 'Photo Crop',
        'subtitle': 'Trim your image to the area you want to keep.',
        'aside': 'Tips',
        'foot': '',
        'accent': '#9a7446',
        'bg': '#efe6d4',
        'surface': '#fbf8ef',
        'font': "Georgia, 'Times New Roman', serif",
      },
      parts: {
        'frame': () => function (ctx) {
          const u = ctx.util;
          const size = ctx.size || {};
          const width = size.width || size.w || document.documentElement.clientWidth;
          const display = width < 1260 && (ctx.display === 'panel' || ctx.display === 'toast') ? 'header' : (ctx.display || 'header');
          document.body.className = 'flash';
          const shell = u.el('div', 'flash-shell', document.body);
          const top = u.el('header', 'flash-top', shell);
          const logo = u.el('div', 'flash-logo', top);
          u.el('span', 'flash-mark', logo);
          const brand = u.el('span', 'flash-brand', logo);
          brand.innerHTML = 'Photo<b>Works</b>';
          const tabs = u.el('nav', 'flash-tabs', top);
          for (const name of ['Library', 'Edit', 'Organize', 'Share', 'Print']) {
            const tab = u.el('button', 'flash-tab' + (name === 'Edit' ? ' active' : ''), tabs, name);
            tab.type = 'button';
            tab.onclick = () => {
              tabs.querySelectorAll('.flash-tab').forEach(x => x.classList.remove('active'));
              tab.classList.add('active');
              env.log('decoy', { label: name, what: 'tab' });
            };
          }
          const main = u.el('main', 'flash-main', shell);
          if (display === 'header') {
            const note = u.el('div', 'flash-header-note', main);
            u.el('span', 'flash-info-dot', note, 'i');
            u.el('span', 'flash-note-copy', note, ctx.instruction);
          }
          const workspace = u.el('div', 'flash-workspace', main);
          const library = u.el('aside', 'flash-library', workspace);
          u.el('h2', 'flash-bar-title', library, 'My Images');
          const list = u.el('div', 'flash-image-list', library);
          const records = [
            ['Beach.jpg', 'Apr 12, 2002', 'beach', '🌴'],
            ['Building.jpg', 'Apr 14, 2002', 'building', '⌂'],
            ['Shapes.png', 'Apr 20, 2002', 'shapes', ''],
            ['Flowers.jpg', 'Apr 22, 2002', 'flowers', '✿'],
            ['Lake.jpg', 'Apr 23, 2002', 'lake', '▲'],
            ['Boat.jpg', 'Apr 24, 2002', 'boat', '⛵'],
            ['Trees.jpg', 'Apr 25, 2002', 'trees', '♠'],
          ];
          for (const [name, date, kind, glyph] of records) {
            const row = u.el('button', 'flash-image-row' + (kind === 'shapes' ? ' selected' : ''), list);
            row.type = 'button';
            const thumb = u.el('span', 'flash-thumb thumb-' + kind, row, glyph);
            if (kind === 'shapes') {
              for (const shape of ['circle', 'diamond', 'triangle', 'square']) u.el('i', 'mini-' + shape, thumb);
            }
            const words = u.el('span', 'flash-image-words', row);
            u.el('strong', '', words, name);
            u.el('small', '', words, date);
            row.onclick = () => env.log('decoy', { label: name, what: 'image-list' });
          }
          const scroll = u.el('div', 'flash-scroll', library);
          u.el('span', 'flash-scroll-up', scroll, '▲');
          u.el('span', 'flash-scroll-track', scroll);
          u.el('span', 'flash-scroll-down', scroll, '▼');
          const editor = u.el('section', 'flash-editor', workspace);
          const editorHead = u.el('div', 'flash-editor-head', editor);
          u.el('h1', '', editorHead, 'Image Editor');
          const editorBody = u.el('div', 'flash-editor-body', editor);
          const imageBay = u.el('div', 'flash-image-bay', editorBody);
          const stage = u.el('div', 'stage', imageBay);
          const tools = u.el('section', 'flash-tools', editorBody);
          u.el('div', 'flash-tool-tab', tools, 'Crop');
          const select = u.el('button', 'flash-tool-row selected', tools);
          select.type = 'button';
          u.el('span', 'flash-select-icon', select);
          u.el('span', '', select, 'Drag to select');
          const move = u.el('button', 'flash-tool-row', tools);
          move.type = 'button';
          const hand = u.el('span', 'flash-hand-icon', move);
          hand.innerHTML = '<svg viewBox="0 0 36 40" width="36" height="40" aria-hidden="true"><path d="M10 18V9c0-2.5 3-3 4 0v8-12c0-2.5 3.5-2.5 3.5 0v12-11c0-2.5 3.5-2.5 3.5 0v12-8c0-2.3 3.5-2.5 3.5.3V24l2.1-4c1.5-2.5 4.7-.9 3.7 1.7l-4.4 11c-.8 2.2-2.7 3.5-5.2 3.5h-6c-2.1 0-3.5-1-4.8-2.5L4 25c-1.9-2.5 1-4.5 3-2.5l3 3.5z" fill="#eaf3fc" stroke="#183866" stroke-width="1.8" stroke-linejoin="round"/></svg>';
          u.el('span', '', move, 'Drag to move');
          select.onclick = () => { select.classList.add('selected'); move.classList.remove('selected'); };
          move.onclick = () => { move.classList.add('selected'); select.classList.remove('selected'); };
          u.el('div', 'flash-rule', tools);
          u.el('label', 'flash-field-title', tools, 'Aspect Ratio');
          const ratio = u.el('button', 'flash-ratio', tools, 'Free');
          ratio.type = 'button';
          u.el('span', '', ratio, '▼');
          ratio.onclick = () => env.log('decoy', { label: 'Aspect Ratio', what: 'ratio' });
          u.el('div', 'flash-rule', tools);
          u.el('label', 'flash-field-title', tools, 'Preview');
          u.el('div', 'flash-preview', tools);
          u.el('div', 'flash-tool-actions', tools);
          const info = u.el('section', 'flash-info', editorBody);
          u.el('h2', 'flash-bar-title', info, 'Image Info');
          const infoThumb = u.el('div', 'flash-info-thumb', info);
          for (const shape of ['circle', 'diamond', 'triangle', 'square']) u.el('i', 'mini-' + shape, infoThumb);
          const meta = u.el('div', 'flash-meta', info);
          for (const [key, val] of [['Name:', 'Shapes.png'], ['Date:', 'Apr 20, 2002'], ['Size:', '640 × 480'], ['Type:', 'PNG Image']]) {
            const line = u.el('div', 'flash-meta-line', meta);
            u.el('span', '', line, key);
            u.el('span', '', line, val);
          }
          if (display === 'panel') {
            const panel = u.el('div', 'flash-side-note', info);
            u.el('h3', '', panel, 'Task');
            const note = u.el('div', '', panel);
            u.el('span', 'flash-info-dot', note, 'i');
            u.el('span', '', note, ctx.instruction);
          }
          if (display === 'toast') {
            const toast = u.el('div', 'flash-toast-note', shell);
            u.el('span', 'flash-info-dot', toast, 'i');
            u.el('span', '', toast, ctx.instruction);
            const x = u.el('button', '', toast, '×');
            x.type = 'button'; x.onclick = () => toast.remove();
          }
          const footer = u.el('footer', 'flash-footer', shell);
          const footerControls = u.el('div', 'flash-footer-controls', footer);
          let submit = null;
          if (!ctx.finish) {
            const r = ctx.rng.fork('chrome/end');
            const labels = (ctx.content && ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']).map(x => typeof x === 'string' ? x : x.label || x.text || x.name || String(x));
            const common = r.bool(0.5);
            const placement = common ? 'footer' : r.pick(['footer', 'header', 'link', 'icon']);
            const label = common ? 'OK' : r.pick(labels.filter(x => x !== 'OK'));
            const parent = placement === 'header' ? editorHead : footerControls;
            submit = u.el(placement === 'link' ? 'a' : 'button', 'flash-end flash-end-' + placement, parent, placement === 'icon' ? '✓' : label);
            if (submit.tagName === 'BUTTON') submit.type = 'button'; else submit.href = '#';
            submit.dataset.role = 'submit';
            submit.title = placement === 'icon' ? 'Mark complete' : label;
            submit.setAttribute('aria-label', placement === 'icon' ? 'Mark complete' : label);
            submit.onclick = e => { e.preventDefault(); ctx.submit(); };
            const cr = ctx.rng.fork('chrome/collide');
            if (cr.bool(0.3)) {
              const other = cr.pick(labels.filter(x => x.toLowerCase() !== label.toLowerCase()));
              const b = u.el('button', 'flash-extra', footerControls, other);
              b.type = 'button';
              b.onclick = () => env.log('decoy', { label: other, collide: true });
            }
          }
          return { stage, submit };
        },
        'overlay': () => function (ctx) {
          const u = ctx.util;
          const el = u.el('div', 'flash-overlay flash-overlay-' + ctx.kind, document.body);
          el.dataset.role = 'overlay';
          const box = u.el('div', 'flash-overlay-box', el);
          u.el('strong', '', box, ctx.kind === 'cookie' ? 'Privacy settings' : ctx.kind === 'chat' ? 'PhotoWorks Help' : ctx.kind === 'promo' ? 'Discover more with PhotoWorks' : 'PhotoWorks update');
          const text = ctx.content.bannerText(ctx.rng, ctx.kind === 'banner' ? 'notice' : ctx.kind).text;
          u.el('p', '', box, text);
          const x = u.el('button', 'flash-overlay-close', box, ctx.kind === 'cookie' ? 'OK' : '×');
          x.type = 'button';
          x.setAttribute('aria-label', 'Close');
          x.onclick = () => ctx.dismiss(ctx.kind === 'cookie' ? 'accept' : 'close');
          return { el, dismiss: x };
        },
        'frame.2': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx } = _c;
            _c.display = ctx.display || 'header';
            const size = ctx.size || {},
              width = size.width || size.w || document.documentElement.clientWidth;
            if ((_c.display === 'panel' || _c.display === 'toast') && width < 1260) _c.display = 'header';
            body.className =
              'design ' + C.theme + ' layout-' + C.layout + (_c.display === 'toast' ? ' has-instruction-toast' : '');
            Object.assign(_c, { size, width });
          },
        'frame.3': () => () => {},
        'frame.18': (base, S) =>
          function (_c) {
            const { note, u } = _c;
            if (_c.display === 'hidden' || _c.display === 'panel') note.hidden = true;
            else if (_c.display === 'toast') {
              note.classList.add('instruction-toast');
              const x = u.el('button', 'note-close', note, '×');
              x.onclick = () => (note.style.visibility = 'hidden');
            }
          },
        'frame.22': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, u } = _c;
            if (['three', 'windows', 'offset', 'sheet', 'notebook', 'rail', 'palette', 'ledger'].includes(C.layout)) {
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
                if (C.theme === 'organizer') {
                  const rows = [
                    ['select', 'Drag on the image to draw a selection box.'],
                    ['move', 'Drag inside the box to move it.'],
                    ['resize', 'Drag the handles to resize the box.'],
                  ];
                  for (const [kind, text] of rows) {
                    const row = u.el('div', 'tip-row tip-' + kind, _c.aside);
                    u.el('span', 'tip-icon', row, kind === 'select' ? '↖' : kind === 'move' ? '↕' : '□');
                    u.el('p', '', row, text);
                  }
                  const rule = u.el('div', 'tip-rule', _c.aside);
                  const row = u.el('div', 'tip-row tip-apply', _c.aside);
                  u.el('span', 'tip-thumb', row, '▧');
                  u.el('p', '', row, 'Click “Apply crop” when you’re happy with the selection.');
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
                } else if (C.layout === 'windows') u.el('p', '', _c.aside, 'Drag on the image to draw a selection box.');
                else if (C.theme === 'crop-minimal' && _c.display !== 'hidden')
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
            if (_c.display === 'panel' && _c.aside) {
              _c.aside.classList.add('panel-mode');
              u.el('p', 'completion-note panel-instruction', _c.aside, ctx.instruction);
            }
            if (_c.display === 'hidden' && _c.aside) _c.aside.classList.add('hidden-mode');
          },
        'frame.23': () => () => {},
        'frame.26': (base, S) =>
          function (_c) {
            const { ctx, footer, shell, u } = _c;
            const endRng = ctx.rng.fork('chrome/end'),
              labelBank = ctx.content && ctx.content.END_LABELS;
            const endLabels = (
              Array.isArray(labelBank) && labelBank.length
                ? labelBank
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
            ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
            ((_c.placement = null), (_c.label = null));
            if (!ctx.finish) {
              const common = [endRng.bool(0.5), endRng.bool(0.5), endRng.bool(0.5)].filter(Boolean).length >= 2;
              if (common) {
                _c.placement = 'aside';
                _c.label = 'Submit';
              } else {
                _c.placement = endRng.pick(['footer', 'link']);
                const alternatives = endLabels.filter((x) => String(x).trim().toLowerCase() !== 'submit');
                _c.label = endRng.pick(alternatives.length ? alternatives : endLabels);
              }
            }
            const collideRng = ctx.rng.fork('chrome/collide');
            _c.collide = null;
            if (!ctx.finish && collideRng.bool(0.3)) {
              const options = [
                ...new Set(
                  endLabels.filter((x) => String(x).trim().toLowerCase() !== String(_c.label).trim().toLowerCase()),
                ),
              ];
              if (options.length) _c.collide = collideRng.pick(options);
            }
            _c.submit = null;
            const makeSubmit = (parent, cls, text) => {
              const b = u.el(cls === 'end-link' ? 'a' : 'button', cls, parent, text);
              if (b.tagName === 'BUTTON') b.type = 'button';
              else b.href = '#';
              b.dataset.role = 'submit';
              b.setAttribute('aria-label', _c.label);
              b.title = _c.label;
              b.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
              return b;
            };
            if (_c.placement === 'aside' && _c.aside) _c.submit = makeSubmit(shell, 'submit placed-aside', _c.label);
            else if (_c.placement === 'footer') _c.submit = makeSubmit(shell, 'submit placed-footer', _c.label);
            else if (_c.placement === 'link') _c.submit = makeSubmit(shell, 'end-link', _c.label + ' ›');
            if (!ctx.finish && _c.aside && (!_c.submit || !_c.submit.isConnected || _c.submit.closest('[hidden]'))) {
              if (_c.submit) _c.submit.remove();
              _c.placement = 'aside';
              _c.label = 'Submit';
              _c.submit = makeSubmit(shell, 'submit placed-aside', _c.label);
            }
            if (_c.collide) {
              const parent = _c.aside || footer;
              const b = u.el('button', 'end-xtra', parent, _c.collide);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.onclick = () => env.log('decoy', { label: _c.collide, collide: true });
            }
            footer.hidden = true;
            Object.assign(_c, { collideRng, endLabels, endRng, labelBank, makeSubmit });
          },
        'frame.27': () => () => {},
      },
    },
  });
})();
