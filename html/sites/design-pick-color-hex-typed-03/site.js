// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-pick-color-hex-typed-03',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'three',
        'theme': 'developer',
        'title': 'VectorDraft Pro',
        'subtitle': 'Color Tools  ›  Picker Challenge',
        'foot': '',
        'accent': '#4ea8ec',
        'bg': '#172a39',
        'surface': '#1b3040',
        'font': 'Arial, Segoe UI, sans-serif',
        'menu':
          'File      Edit      View      Draw      Modify      Annotate      Layers      Tools      Window      Help',
        'ribbon': true,
        'aside': 'Help & Tips',
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
              u.el('strong', '', sub, 'Color Picker');
              u.el('p', '', sub, '');
            }
            u.el('nav', 'forum-nav', head, 'Project　　Drawing　　Layers　　Styles　　Materials　　Views');
          },
        'frame.13': (base, S) =>
          function (_c) {
            const { C } = S;
            const { shell, u } = _c;
            const content = u.el('div', 'content', shell);
            if (C.theme === 'developer') {
              const rail = u.el('aside', 'cad-rail', content);
              const lh = u.el('div', 'rail-head', rail, 'Layers');
              const layers = [
                ['Site Plan', '#9bc8e5'],
                ['Buildings', '#b7b7b7'],
                ['Roads', '#a7bac9'],
                ['Utilities', '#609ac4'],
                ['Landscaping', '#79af54'],
                ['Annotations', '#f2cf58'],
              ];
              for (const [name, color] of layers) {
                const row = u.el('div', 'layer-row' + (name === 'Landscaping' ? ' active' : ''), rail);
                u.el('span', 'eye', row, '◉');
                const sw = u.el('i', 'layer-swatch', row);
                sw.style.background = color;
                u.el('span', '', row, name);
              }
              u.el('div', 'rail-head legend-head', rail, 'Drafting Legend');
              for (const [name, kind] of [
                ['Property Line', 'solid'],
                ['Setback Line', 'dash'],
                ['Easement', 'dashdot'],
                ['Centerline', 'center'],
                ['Building Outline', 'outline'],
                ['Road Edge', 'heavy'],
                ['Fence', 'fence'],
                ['Tree (Deciduous)', 'tree'],
                ['Shrub / Hedge', 'shrub'],
                ['Pavement', 'pave'],
                ['Gravel / Landscape', 'gravel'],
              ]) {
                const row = u.el('div', 'legend-row', rail);
                u.el('span', 'legend-mark ' + kind, row);
                u.el('span', '', row, name);
              }
            }
            const note = u.el('section', 'task-note', content);
            Object.assign(_c, { content, note });
          },
        'frame.21': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, note, stage, u } = _c;
            if (C.theme === 'developer') {
              const band = u.el('div', 'workspace-band', content);
              const style = u.el('section', 'style-panel', band);
              u.el('h2', 'band-title', style, 'Layer Style');
              const field = (parent, label, value, cls = '') => {
                const row = u.el('div', 'style-field ' + cls, parent);
                u.el('span', 'field-name', row, label);
                const box = u.el('span', 'field-box', row, value);
                u.el('span', 'field-drop', box, '▾');
              };
              field(style, 'Name:', 'Landscaping', 'name-field');
              field(style, 'Type:', 'Fill', 'type-field');
              field(style, 'Opacity:', '100', 'opacity-field');
              const pct = u.el('span', 'percent', style, '%');
              const preview = u.el('section', 'preview-panel', band);
              u.el('h2', 'band-title', preview, 'Preview');
              const sw = u.el('div', 'preview-swatch', preview);
              sw.style.background = '#76a662';
              const details = u.el('section', 'details-panel', band);
              u.el('h2', 'band-title', details, 'Details');
              u.el('p', '', details, 'Layer:　 Landscaping');
              u.el('p', '', details, 'Type:　 Fill');
              u.el('p', '', details, 'Opacity:　100%');
              u.el('div', 'color-section-title', content, 'Color');
              u.el('div', 'color-work-title', content, 'Target Color');
            } else if (C.theme === 'forum') {
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
            }
            const close = note.querySelector('.note-close');
            if (close) {
              close.type = 'button';
              close.title = 'Dismiss instruction';
              close.setAttribute('aria-label', 'Dismiss instruction');
            }
            const footer = u.el('footer', 'footer', shell);
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
