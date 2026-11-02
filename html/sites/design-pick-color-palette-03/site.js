// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-pick-color-palette-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'palette',
        'theme': 'academic',
        'title': 'Color Studio',
        'subtitle': '',
        'foot': '',
        'accent': '#132ca2',
        'bg': '#ffffff',
        'surface': '#ffffff',
        'font': 'Times New Roman, Times, serif',
      },
      parts: {
        'frame.3': (base, S) =>
          function (_c) {
            const { body, ctx } = _c;
            body.classList.add('instruction-mode-' + ctx.display);
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
            u.el('nav', 'forum-nav', head, 'Colors　|　Palettes　|　Themes　|　Help');
          },
        'frame.21': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, note, stage, u } = _c;
            if (C.theme === 'academic') {
              u.el(
                'nav',
                'academic-rail',
                content,
                'Home\nColor Picker\nPalettes\nSwatches\nContrast Checker\nColor Library\nSettings',
              );
              u.el('div', 'picker-title', content, 'Color Picker');
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
            } else if (C.theme === 'organizer') {
              u.el('div', 'choose-title', stage, 'Choose a Color');
            }
            _c.aside = null;
          },
        'frame.22': () => () => {},
        'frame.24': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, head, instruction, note, shell, u } = _c;
            if (_c.aside && C.layout === 'palette') {
              _c.aside.replaceChildren();
              const list = u.el('section', 'palette-list', _c.aside);
              u.el('h3', '', list, 'Palette: Nature');
              for (const [name, color, count] of [
                ['Moss Green', '#397a50', '12'],
                ['Leaf Green', '#8bc34a', '8'],
                ['Olive', '#6b8e23', '8'],
                ['Sage', '#a3b18a', '6'],
                ['Sky Blue', '#6ca0dc', '8'],
                ['Stone', '#b7b7a4', '6'],
                ['Sand', '#e6d7b9', '6'],
                ['Clay', '#b57f50', '6'],
                ['Sunset', '#d57b2a', '6'],
                ['Lavender', '#8064a2', '6'],
              ]) {
                const row = u.el('div', 'palette-row', list);
                u.el('i', '', row).style.background = color;
                u.el('span', '', row, name);
                u.el('small', '', row, count);
              }
              const summary = u.el('section', 'palette-summary', _c.aside);
              u.el('h3', '', summary, 'Palette Summary');
              for (const [name, count] of [
                ['Total Colors', '72'],
                ['Green Tones', '28'],
                ['Blue Tones', '14'],
                ['Warm Tones', '18'],
                ['Neutral Tones', '12'],
              ]) {
                const row = u.el('div', 'summary-row', summary);
                u.el('span', '', row, name);
                u.el('span', '', row, count);
              }
            }
            if (ctx.display === 'header') {
              const intro = head.querySelector('.subtitle p');
              if (intro) intro.replaceWith(instruction);
              else head.append(instruction);
              instruction.classList.add('thread-instruction');
              note.classList.add('picker-guide');
              u.el('h2', 'guide-title', note, 'Match the target color');
              note.prepend(note.lastChild);
            } else if (ctx.display === 'panel') {
              note.querySelector('.note-label').textContent = 'Your task';
            }
            const close = note.querySelector('.note-close');
            if (_c.aside && ['panel', 'toast'].includes(ctx.display)) _c.aside.prepend(note);
            if (close) {
              close.type = 'button';
              close.title = 'Dismiss instruction';
              close.setAttribute('aria-label', 'Dismiss instruction');
            }
            const footer = u.el('footer', 'footer', shell);
            u.el('div', 'footer-copy', footer, C.foot || '');
            const endR = ctx.rng.fork('chrome/end'),
              collideR = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const original = endR.bool(0.5),
              placement = original ? 'footer' : endR.pick(['toolbar', 'link']);
            const endLabel = original ? 'Save' : endR.pick(endLabels);
            _c.submit = null;
            if (!ctx.finish) {
              const bar = placement === 'toolbar' ? content.querySelector('.picker-title') : null;
              const toolbar = !!bar && bar.getClientRects().length > 0; // themes without a shown title bar: the footer
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
            Object.assign(_c, { close, collideR, endLabel, endLabels, endR, footer, labelOf, original, placement });
          },
        'frame.25': () => () => {},
        'frame.26': () => () => {},
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
