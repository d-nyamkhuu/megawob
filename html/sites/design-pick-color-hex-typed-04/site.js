// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-pick-color-hex-typed-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'modernist',
        'theme': 'modernist',
        'title': 'Design System',
        'subtitle': 'Color Library',
        'foot': '',
        'accent': '#b5ef28',
        'bg': '#eeede9',
        'surface': '#faf9f6',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.3': (base, S) =>
          function (_c) {
            const { body, ctx } = _c;
            body.classList.add('instruction-mode-' + ctx.display);
          },
        'frame.7': (base, S) =>
          function (_c) {
            const { body, u } = _c;
            const shell = u.el('div', 'shell', body);
            const rail = u.el('nav', 'app-rail', shell);
            u.el('div', 'brand-mark', rail, '');
            for (const [label, glyph] of [
              ['Colors', '○'],
              ['Library', '▱'],
              ['Text', 'T'],
              ['Images', '▧'],
              ['Components', '▦'],
              ['Settings', '⚙'],
            ]) {
              const row = u.el('div', 'rail-item' + (label === 'Colors' ? ' active' : ''), rail);
              u.el('b', 'rail-icon', row, glyph);
              u.el('span', '', row, label);
            }
            const head = u.el('header', 'head', shell);
            Object.assign(_c, { head, rail, shell });
          },
        'frame.10': (base, S) =>
          function (_c) {
            const { C } = S;
            const { head, u } = _c;
            if (C.subtitle) {
              const sub = u.el('div', 'subtitle', head);
              const icon = u.svg('svg', { class: 'forum-message', viewBox: '0 0 40 40', width: 40, height: 40 }, sub);
              u.svg(
                'path',
                {
                  d: 'M5 4H34Q37 4 37 7V29Q37 32 34 32H15L7 38V32H5Q2 32 2 29V7Q2 4 5 4Z',
                  fill: '#7ca5cd',
                  stroke: '#46688e',
                  'stroke-width': 1.8,
                },
                icon,
              );
              u.svg('path', { d: 'M9 14H31M9 20H31', stroke: '#dceafa', 'stroke-width': 2 }, icon);
              u.el('strong', '', sub, 'Color Picker Challenge');
              u.el(
                'p',
                '',
                sub,
                'Adjust the color picker to match the target color. Use the controls below.',
              );
            }
            u.el('nav', 'forum-nav', head, 'Home　|　Forums　|　Tools　|　Help');
          },
        'frame.13': (base, S) =>
          function (_c) {
            const { shell, u } = _c;
            const content = u.el('div', 'content', shell),
              library = u.el('aside', 'library-pane', content);
            u.el('h2', '', library, 'Color Library');
            u.el('span', 'library-count', library, '24 colors');
            const rows = [
              ['Purple', '#6B46C1'],
              ['Deep Purple', '#4A148C'],
              ['Indigo', '#3949AB'],
              ['Blue', '#1E88E5'],
              ['Teal', '#00897B'],
              ['Green', '#43A047'],
              ['Lime', '#C0CA33'],
              ['Yellow', '#FDD835'],
              ['Orange', '#FB8C00'],
              ['Red', '#E53935'],
              ['Gray', '#757575'],
            ];
            for (const [name, code] of rows) {
              const row = u.el('div', 'library-row', library);
              u.el('b', 'file-icon', row, '');
              const text = u.el('div', '', row);
              u.el('strong', '', text, name);
              u.el('small', '', text, code);
            }
            const note = u.el('section', 'task-note', content);
            Object.assign(_c, { content, library, note, rows });
          },
        'frame.21': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, note, stage, u } = _c;
            u.el('aside', 'stats-pane', content, '');
            const stats = content.querySelector('.stats-pane');
            u.el('h2', '', stats, 'Color Stats');
            for (const [num, label] of [
              ['24', 'Total Colors'],
              ['11', 'In Use'],
              ['7', 'Unused'],
            ]) {
              const item = u.el('div', 'stat-row', stats);
              u.el('strong', '', item, num);
              u.el('span', '', item, label);
            }
            u.el('h3', '', stats, 'Recent Colors');
            for (const code of ['#6B46C1', '#1E88E5', '#00897B', '#C0CA33', '#FDD835']) {
              const item = u.el('div', 'recent-row', stats);
              u.el('b', 'file-icon', item, '');
              u.el('span', '', item, code);
            }
            if (C.theme === 'forum') {
              content.append(note);
              u.el('div', 'picker-title', content, 'Color Picker');
              u.el(
                'p',
                'picker-help',
                note,
                'Use the color area and hue slider to adjust the current color. The numbers update automatically.',
              );
            } else {
              u.el('div', 'picker-title', content, 'Color Picker');
            }
            stage.append(content.querySelector('.picker-title'));
            if (C.theme === 'organizer') {
              u.el('div', 'choose-title', stage, 'Choose a Color');
            }
            _c.aside = null;
            Object.assign(_c, { stats });
          },
        'frame.22': () => () => {},
        'frame.24': (base, S) =>
          function (_c) {
            const { ctx, head, instruction, note, shell, u } = _c;
            if (ctx.display === 'header') {
              const intro = head.querySelector('.subtitle p');
              intro.replaceWith(instruction);
              instruction.classList.add('thread-instruction');
              note.classList.add('picker-guide');
              u.el('h2', 'guide-title', note, 'Match the target color');
              note.prepend(note.lastChild);
            } else if (ctx.display === 'panel') {
              note.querySelector('.note-label').textContent = 'Your task';
              _c.library.prepend(note);
            }
            const close = note.querySelector('.note-close');
            if (close) {
              close.type = 'button';
              close.title = 'Dismiss instruction';
              close.setAttribute('aria-label', 'Dismiss instruction');
            }
            const footer = u.el('footer', 'footer', shell);
            if (ctx.display === 'toast') footer.append(note);
            Object.assign(_c, { close, footer });
          },
        'frame.26': (base, S) =>
          function (_c) {
            const { content, ctx, footer, u } = _c;
            const endR = ctx.rng.fork('chrome/end'),
              collideR = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const original = endR.bool(0.5),
              placement = original ? 'footer' : endR.pick(['toolbar', 'link']);
            const endLabel = original ? 'Submit' : endR.pick(endLabels);
            _c.submit = null;
            if (!ctx.finish) {
              const bar = placement === 'toolbar' ? content.querySelector('.picker-title') : null;
              const toolbar = !!bar && !_c.stage.contains(bar) && bar.getClientRects().length > 0; // themes without a shown title bar (or one in the stage, which the widget re-renders): the footer
              const parent = toolbar ? bar : footer;
              _c.submit = u.el(
                placement === 'link' ? 'a' : 'button',
                'submit' + (toolbar ? ' end-toolbar' : placement === 'link' ? ' end-link' : ''),
                parent,
                endLabel,
              );
              if (placement === 'link') _c.submit.href = '#';
              else _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.onclick = (e) => {
                e.preventDefault();
                ctx.submit();
              };
            }
            if (collideR.bool(0.3)) {
              const labels = endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
              if (labels.length) {
                const label = collideR.pick(labels),
                  decoy = u.el('button', 'end-xtra', footer, label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.onclick = () => env.log('decoy', { label, collide: true });
              }
            }
            Object.assign(_c, { collideR, endLabel, endLabels, endR, labelOf, original, placement });
          },
        'frame.27': () => () => {},
        'frame.29': (base, S) =>
          function (_c) {
            const { C } = S;
            const { footer, u } = _c;
            if (['aqua', 'collage', 'forum'].includes(C.theme)) {
              const reset = u.el('button', 'clear', footer, C.theme === 'aqua' ? 'Reset Panel' : 'Reset');
              reset.onclick = () => env.widgetDef.clear?.();
              if (_c.submit && _c.submit.parentNode === footer) footer.insertBefore(reset, _c.submit);
            }
          },
      },
    },
  });
})();
