// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-pick-color-named-01',
    styles: ['site.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'three',
        'theme': 'directory',
        'title': 'WebCentral',
        'subtitle': 'Your Guide to the Web',
        'foot': '',
        'accent': '#12398f',
        'bg': '#ededed',
        'surface': '#ffffff',
        'font': 'Arial, sans-serif',
        aside: 'Site Statistics',
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
            const shell = u.el('div', 'shell', body),
              rail = u.el('nav', 'portal-rail', shell);
            for (const [group, links] of [
              ['Home', ['Home']],
              [
                'Channels',
                ['News', 'Business', 'Computers', 'Internet', 'Living', 'Health', 'Recreation', 'Reference'],
              ],
              ['Tools', ['Email', 'Calendar', 'Address Book', 'Notepad', 'Color Tools', 'Calculators']],
              ['Web Guide', ['Top Sites', 'New Sites', 'Cool Links', 'Add a Site']],
            ]) {
              u.el('strong', 'rail-heading', rail, group);
              for (const label of links) {
                const a = u.el('a', 'rail-link', rail, label);
                a.href = '#';
                a.onclick = (e) => {
                  e.preventDefault();
                };
                if (label === 'Color Tools') a.classList.add('active');
              }
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
            u.el('nav', 'forum-nav', head, 'Help　|　Site Map　|　Contact');
          },
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
            }
            _c.aside = null;
          },
        'frame.22': () => () => {},
        'frame.24': (base, S) =>
          function (_c) {
            const { C } = S;
            const { content, ctx, head, instruction, note, shell, u } = _c;
            if (_c.aside && C.theme === 'directory') {
              const info = u.el('section', 'portal-info', _c.aside);
              u.el('h3', 'portal-info-title', info, 'Color Information');
              u.el('div', 'portal-info-swatch', info);
              for (const label of ['Hex Code:', 'RGB:', 'HSL:']) {
                const row = u.el('div', 'portal-info-row', info);
                u.el('strong', '', row, label);
                u.el('span', '', row, '');
              }
              const stats = u.el('section', 'portal-stats', _c.aside);
              u.el('h3', '', stats, 'Site Statistics');
              for (const [label, value] of [
                ['Total Colors:', '216'],
                ['Web-Safe Colors:', '40'],
                ['Recent Selections:', '5'],
                ['Saved Colors:', '0'],
              ]) {
                const row = u.el('div', 'portal-stat-row', stats);
                u.el('strong', '', row, label);
                u.el('span', '', row, value);
              }
            }
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
            u.el('div', 'footer-copy', footer, C.foot || '');
            const endR = ctx.rng.fork('chrome/end'),
              collideR = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const original = endR.bool(0.5),
              placement = original ? 'footer' : endR.pick(['toolbar', 'link']);
            const endLabel = original ? 'Submit' : endR.pick(endLabels);
            _c.submit = null;
            if (!ctx.finish) {
              const parent = placement === 'toolbar' ? content.querySelector('.picker-title') || head : footer;
              _c.submit = u.el(
                placement === 'link' ? 'a' : 'button',
                'submit' + (placement === 'toolbar' ? ' end-toolbar' : placement === 'link' ? ' end-link' : ''),
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
