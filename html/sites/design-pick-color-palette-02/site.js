// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-pick-color-palette-02',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'strip',
        'theme': 'soft',
        'title': 'Color Picker',
        'subtitle': '',
        'foot': '',
        'accent': '#287cf3',
        'bg': '#eef3fa',
        'surface': '#f7f9fc',
        'font': 'Arial, Segoe UI, sans-serif',
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
            u.el('nav', 'forum-nav', head, 'Home　|　Forums　|　Tools　|　Help');
          },
        'frame.13': (base, S) =>
          function (_c) {
            const { shell, u } = _c;
            const library = u.el('aside', 'color-library', shell);
            u.el('h2', '', library, 'Color Library');
            const search = u.el('div', 'library-search', library, '⌕　 Search colors...');
            const list = u.el('div', 'library-list', library);
            for (const [name, hex] of [
              ['Ocean', '#0EA5E9'],
              ['Sky', '#3B8DF8'],
              ['Indigo', '#6366F1'],
              ['Blue', '#2563EB'],
              ['Royal', '#1D4ED8'],
              ['Violet', '#8B5CF6'],
              ['Purple', '#A855F7'],
              ['Fuchsia', '#D946EF'],
              ['Pink', '#EC4899'],
              ['Rose', '#F43F5E'],
              ['Red', '#EF4444'],
              ['Orange', '#F97316'],
              ['Amber', '#FACC15'],
              ['Lime', '#22C55E'],
              ['Teal', '#14B8A6'],
            ]) {
              const row = u.el('div', 'library-row', list);
              const sw = u.el('i', '', row);
              sw.style.background = hex;
              const words = u.el('span', '', row);
              u.el('b', '', words, name);
              u.el('small', '', words, hex);
            }
            const content = u.el('div', 'content', shell),
              note = u.el('section', 'task-note', content);
            u.el('div', 'note-label', note, '');
            Object.assign(_c, { content, library, list, note, search });
          },
        'frame.14': () => () => {},
        'frame.21': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, note, stage, u } = _c;
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
            } else if (C.theme === 'soft') {
              u.el('div', 'picker-title', content, 'Color Picker');
            }
            _c.aside = null;
          },
        'frame.22': () => () => {},
        'frame.24': (base, S) =>
          function (_c) {
            const { content, ctx, head, instruction, note, shell, u } = _c;
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
            if (close) {
              close.type = 'button';
              close.title = 'Dismiss instruction';
              close.setAttribute('aria-label', 'Dismiss instruction');
            }
            const details = u.el('aside', 'color-details', shell);
            u.el('h2', '', details, 'Color Details');
            const detailSwatch = u.el('div', 'detail-swatch', details);
            detailSwatch.dataset.liveColor = 'swatch';
            detailSwatch.style.background = '#3B82F6';
            const values = u.el('div', 'detail-values', details);
            for (const [k, v] of [
              ['Hex', '#3B82F6'],
              ['RGB', '59, 130, 246'],
              ['HSL', '217°, 91%, 60%'],
            ]) {
              u.el('span', '', values, k);
              const value = u.el('b', '', values, v);
              value.dataset.liveColor = k.toLowerCase();
            }
            u.el('h3', '', details, 'Recent Colors');
            const recent = u.el('div', 'recent-colors', details);
            for (const color of [
              '#3B82F6',
              '#22C55E',
              '#F97316',
              '#EF4444',
              '#8B5CF6',
              '#14B8A6',
              '#475569',
              '#CBD5E1',
            ]) {
              const sw = u.el('i', '', recent);
              sw.style.background = color;
            }
            const footer = u.el('footer', 'footer', shell);
            u.el('div', 'footer-copy', footer, '');
            const dock = u.el('nav', 'bottom-dock', footer);
            for (const [icon, label] of [
              ['◉', 'Colors'],
              ['▦', 'Palettes'],
              ['▤', 'Templates'],
              ['⚙', 'Settings'],
            ]) {
              const item = u.el('button', 'dock-item' + (label === 'Colors' ? ' active' : ''), dock);
              item.type = 'button';
              u.el('span', 'dock-icon', item, icon);
              u.el('span', '', item, label);
            }
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
            Object.assign(_c, {
              close,
              collideR,
              detailSwatch,
              details,
              dock,
              endLabel,
              endLabels,
              endR,
              footer,
              labelOf,
              original,
              placement,
              recent,
              values,
            });
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
