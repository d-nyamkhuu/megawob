// Design on templates/site/drag-composition-event-02.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-complete-goals-booking-04',
    styles: ['site.css'],
    scripts: [],
    template: 'site/complete-goals-event-02',
    design: {
      parts: {
        'frame.16': (base, S) =>
          function (_c) {
            const { W } = _c;
            const roomy = W >= 1440;
            Object.assign(_c, { roomy });
          },
        'frame.21': (base, S) =>
          function (_c) {
            document.body.dataset.instruction = _c.display;
            document.body.classList.toggle('ref-has-note', _c.display === 'toast');
          },
        'frame.24': (base, S) =>
          function (_c) {
            const { rng, wantFooter } = _c;
            document.body.dataset.footer = wantFooter ? 'yes' : 'no';
            if (!wantFooter && (_c.placement === 'footer' || _c.placement === 'link')) _c.placement = 'header';
            const sidebarDraw = rng.bool(0.35);
            const sidebar = true;
            const navDraw = rng.bool(0.5);
            const nav = true;
            Object.assign(_c, { nav, navDraw, sidebar, sidebarDraw });
          },
        'frame.25': () => () => {},
        'frame.26': () => () => {},
        'frame.45': (base, S) =>
          function (_c) {
            const { content, headerTools, rng, sidebar, util } = _c;
            document.body.dataset.headerTools = headerTools.children.length ? 'yes' : 'no';
            const body = util.el('div', 'ref-body', document.body);
            if (sidebar) {
              const side = util.el('aside', 'ref-side', body);
              // Keep the original seeded draw for downstream frame, but use the fixed navigation
              // shown by this reservation application.
              rng.sample(content.NAV_ITEMS, rng.int(4, 7));
              const entries = [
                ['home', 'Home'],
                ['reservation', 'Reservations'],
                ['customers', 'Customers'],
                ['inventory', 'Inventory'],
                ['reports', 'Reports'],
                ['settings', 'Settings'],
              ];
              for (const [icon, item] of entries) {
                const a = util.el('a', `ref-sidelink${item === 'Reservations' ? ' active' : ''}`, side);
                const mark = util.el('span', `ref-side-icon icon-${icon}`, a);
                const svg = {
                  home: '<svg viewBox="0 0 40 40"><g stroke="#111" stroke-width="1.5" stroke-linejoin="round"><path fill="#fff" d="M29 4h5v14h-5z"/><path fill="#fff9cd" d="M5 17 20 5l14 12v20H5z"/><path fill="#e8593b" d="M2 19 20 2l18 17-3 3L20 8 5 22z"/><path fill="#fff" d="m7 20 13-12 12 12v14H7z"/><path fill="#dfb848" d="M17 24h7v13h-7z"/><path fill="#4276c4" d="M10 19h5v6h-5zm15 0h5v6h-5zM10 29h5v5h-5z"/><path fill="none" stroke="#fff" d="M11 20v4m15-4v4"/></g><path stroke="#222" d="M4 38h32"/></svg>',
                  reservation:
                    '<svg viewBox="0 0 40 40"><g stroke="#111" stroke-width="1.4" stroke-linejoin="round"><path fill="#aaa" d="M5 5h27v33H5z"/><path fill="#fff" d="M3 4h27v32H3z"/><path fill="#ddd" d="M7 2h3v5H7zm7 0h3v5h-3zm7 0h3v5h-3z"/><path stroke="#454e93" d="M7 11h18M7 15h17M7 19h17M7 23h17M7 27h12"/><path fill="#ffe24b" d="m16 25 18-18 4 4-18 18-7 3z"/><path fill="#f24e46" d="m31 10 3-3 4 4-3 3z"/><path fill="#d3bc81" d="m16 25 4 4-7 3z"/><path fill="#222" d="m13 32 2-5 3 3z"/></g></svg>',
                  customers:
                    '<svg viewBox="0 0 40 40"><g stroke="#111" stroke-width="1.3" stroke-linejoin="round"><path fill="#bbb" d="M14 3h16l5 6v24H14z"/><path fill="#fff" d="M12 1h15l6 7v24H12z"/><path fill="#ccd1f7" d="M27 1v8h6"/><path fill="#fff" d="m7 9 20 3 3 24-21 2z"/><path fill="#ecebff" d="m4 16 17-5 8 22-17 6-8-6z"/><path stroke="#6f73ad" d="m8 19 13-4m-12 8 14-4m-12 8 13-4m-12 8 13-4M16 5h8m-8 3h7"/></g></svg>',
                  inventory:
                    '<svg viewBox="0 0 40 40"><g stroke="#111" stroke-width="1.5" stroke-linejoin="round"><path fill="#e3ce53" d="M3 8h12l5 5h15v23H3z"/><path fill="#fffbc1" d="M5 11h11l4 4h13v18H5z"/><path fill="#fff257" d="M9 17h29l-7 20H1z"/><path fill="none" stroke="#fff" d="M10 19h25M5 9h9"/></g></svg>',
                  reports:
                    '<svg viewBox="0 0 40 40"><g stroke="#111" stroke-width="1.5" stroke-linejoin="round"><path fill="#fff" d="M3 2h5v35H3z"/><path fill="#4b4bff" d="M12 21h6v16h-6z"/><path fill="#ffff6e" d="M21 13h6v24h-6z"/><path fill="#3232ec" d="M30 4h6v33h-6z"/><path stroke="#fff" d="M4 4v30m9-11v12m9-20v20m9-29v29"/><path fill="#aaa" d="M3 36h35v3H3z"/></g></svg>',
                  settings:
                    '<svg viewBox="0 0 40 40"><path fill="#aeb7c5" stroke="#273344" stroke-width="2" d="m17 3 6 0 2 5 4 2 5-1 3 5-3 4v5l3 4-3 5-5-1-4 2-2 5h-6l-2-5-4-2-5 1-3-5 3-4v-5l-3-4 3-5 5 1 4-2z"/><circle cx="20" cy="20" r="6" fill="#e8ebef" stroke="#273344" stroke-width="2"/></svg>',
                }[icon];
                mark.innerHTML = svg;
                util.el('span', 'ref-side-label', a, item);
                a.dataset.role = 'nav';
                a.addEventListener('click', (e) => {
                  e.preventDefault();
                  env.log('decoy', { what: 'sidebar', label: item });
                });
              }
            }
            Object.assign(_c, { body });
          },
        'frame.46': () => () => {},
        'frame.47': () => () => {},
        'frame.48': () => () => {},
        'frame.49': () => () => {},
        'frame.50': () => () => {},
        'frame.51': () => () => {},
        'frame.52': () => () => {},
        'frame.53': () => () => {},
        'frame.54': () => () => {},
        'frame.55': () => () => {},
        'frame.56': () => () => {},
        'frame.57': () => () => {},
        'frame.58': () => () => {},
        'frame.59': () => () => {},
        'frame.60': () => () => {},
        'frame.61': () => () => {},
        'frame.62': () => () => {},
        'frame.63': () => () => {},
        'frame.64': () => () => {},
        'frame.65': () => () => {},
        'frame.66': () => () => {},
        'frame.67': () => () => {},
        'frame.68': () => () => {},
        'frame.69': () => () => {},
        'frame.70': () => () => {},
        'frame.71': () => () => {},
        'frame.76': (base, S) =>
          function (_c) {
            const { body, closeLabel, ctx, decoyBtn, decoys, endBtn, lr, rng, stage, util, wantFooter, word } = _c;
            const inspector = util.el('aside', 'booking-inspector', body);
            util.el('h2', '', inspector, 'Reservation Details');
            const details = [
              ['Business:', 'Riverside Outfitters'],
              ['Email Frequency:', 'Daily'],
              ['Reservation Date:', '04/20/1994'],
            ];
            const detailValues = [];
            for (const [key, value] of details) {
              const row = util.el('div', 'booking-detail', inspector);
              util.el('span', '', row, key);
              detailValues.push(util.el('span', 'booking-detail-value', row, value));
            }
            const detailRule = util.el('div', 'booking-detail-rule', inspector);
            detailRule.setAttribute('aria-hidden', 'true');
            for (const [key, value] of [
              ['Reminders:', 'Yes'],
              ['Special Offers:', 'Yes'],
            ]) {
              const row = util.el('div', 'booking-detail', inspector);
              util.el('span', '', row, key);
              util.el('span', '', row, value);
            }
            const refreshDetails = () => {
              const nameInput = stage.querySelector('.ft-input');
              const choice = stage.querySelector('.fp-val, .fp-choice.on span, .fp-input');
              const dateInput = stage.querySelector('.fd-input, .fd-txt');
              if (nameInput) detailValues[0].textContent = nameInput.value;
              if (choice) detailValues[1].textContent = choice.value || choice.textContent.trim();
              if (dateInput) detailValues[2].textContent = dateInput.value || dateInput.textContent;
            };
            stage.addEventListener('input', refreshDetails);
            stage.addEventListener('change', refreshDetails);
            stage.addEventListener('click', () => queueMicrotask(refreshDetails));
            if (_c.display === 'toast') {
              const note = util.el('div', 'ref-note', document.body);
              util.el('div', 'ref-note-text', note, ctx.instruction);
              const x = util.el('button', 'ref-note-x', note, '×');
              x.type = 'button';
              x.setAttribute('aria-label', closeLabel);
              x.addEventListener('click', () => {
                note.style.visibility = 'hidden';
                env.log('note-close');
              });
            }
            if (wantFooter) {
              const foot = util.el('footer', 'ref-foot', document.body);
              const footText = rng.pick([
                '© 2024 Example Co.',
                'All changes are saved automatically.',
                'Need help? Contact your administrator.',
                'v4.2.1 · Status: all systems normal',
              ]);
              util.el(
                'span',
                'ref-foot-text',
                foot,
                word
                  ? lr.pick([
                      `© 2024 Example Co. ${word('footRights')}`,
                      word('footSaved'),
                      word('footHelp'),
                      `v4.2.1 · ${word('footStatus')}`,
                    ])
                  : footText,
              );
              const tools = util.el('div', 'ref-tools', foot);
              if (decoys.length > 1) decoyBtn(tools, decoys[1]);
              if (_c.collide && _c.collide.where === 'footer') decoyBtn(tools, _c.collide.text, true);
              if (_c.placement === 'footer') _c.submit = endBtn(tools, 'ref-submit', _c.label);
              if (_c.placement === 'link') _c.submit = endBtn(tools, 'ref-endlink', `${_c.label} ›`);
              if (!tools.children.length) {
                foot.classList.add('ref-empty-foot');
                document.body.dataset.footer = 'no';
              }
            }
            Object.assign(_c, { detailRule, detailValues, details, inspector, refreshDetails });
          },
        'frame.77': () => () => {},
      },
    },
  });
})();
