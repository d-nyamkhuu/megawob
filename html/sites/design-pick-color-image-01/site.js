// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-pick-color-image-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'strip',
        'theme': 'forum',
        'title': 'Design Studio',
        'subtitle': '',
        'foot': '',
        'accent': '#111827',
        'bg': '#ffffff',
        'surface': '#ffffff',
        'font': 'Arial, sans-serif',
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
            const nav = u.el('nav', 'forum-nav', head);
            for (const [i, label] of ['Projects', 'Assets', 'Brand', 'Templates'].entries()) {
              u.el('span', i === 1 ? 'active' : '', nav, label);
            }
            const tools = u.el('div', 'header-tools', head);
            u.el('span', 'top-search', tools, '⌕　Search assets…');
            u.el('span', 'bell', tools, '♧');
            u.el('span', 'avatar', tools, 'JD');
            Object.assign(_c, { nav, tools });
          },
        'frame.21': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, note, stage, u } = _c;
            if (C.theme === 'forum') {
              content.append(note);
              u.el('div', 'picker-title', content, '');
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
            const records = u.el('section', 'asset-list', shell);
            const listHead = u.el('div', 'asset-list-head', records);
            u.el('strong', '', listHead, 'Assets');
            u.el('span', 'asset-search', listHead, '⌕　Search assets…');
            u.el('span', 'asset-sort', listHead, 'Newest first　⌄');
            const table = u.el('div', 'asset-table', records);
            const headings = u.el('div', 'asset-row asset-headings', table);
            for (const label of ['Name', 'Type', 'Added　↓', 'Size', 'Dimensions', ''])
              u.el('span', '', headings, label);
            const thumbPos = ['74% 40%', '3% 56%', '35% 75%', '93% 55%'];
            for (const [i, [name, date, size, dim]] of [
              ['Coastal House', 'Jun 18, 2024', '2.4 MB', '4032 × 2268'],
              ['Olive Branch', 'Jun 14, 2024', '1.1 MB', '3000 × 2000'],
              ['Bougainvillea', 'Jun 12, 2024', '1.8 MB', '3024 × 2016'],
              ['Sea Cliffs', 'Jun 10, 2024', '2.6 MB', '3840 × 2160'],
            ].entries()) {
              const row = u.el('div', 'asset-row', table);
              const nm = u.el('span', 'asset-name', row);
              const thumb = u.el('i', 'asset-thumb', nm);
              thumb.style.backgroundImage = 'url(sites/design-pick-color-image-01/assets/coast.webp)';
              thumb.style.backgroundSize = '280% auto';
              thumb.style.backgroundPosition = thumbPos[i];
              u.el('b', '', nm, name);
              u.el('span', '', row, 'Image');
              u.el('span', '', row, date);
              u.el('span', '', row, size);
              u.el('span', '', row, dim);
              u.el('span', '', row, '•••');
            }
            const footer = u.el('footer', 'footer', shell);
            Object.assign(_c, { close, footer, headings, listHead, records, table, thumbPos });
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
