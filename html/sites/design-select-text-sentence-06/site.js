// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-select-text-sentence-06',
    styles: ['site.css', 'irix.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'document',
        'theme': 'industrial',
        'title': 'NorthBridge  Extranet',
        'menu': 'Home       Catalog       Orders       Invoices       Reports       Admin',
        'foot': '',
        'accent': '#173959',
        'bg': '#d3d7da',
        'surface': '#fff',
        'font': 'Verdana, sans-serif',
      },
      parts: {
        'frame.2': (base, S) =>
          function (_c) {
            const { C } = S;
            const { body, ctx, u } = _c;
            if (true) {
              body.className = 'design irix' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
              const shell = u.el('div', 'shell', body),
                rail = u.el('nav', 'rail', shell),
                main = u.el('div', 'main', shell);
              const logo = u.el('div', 'logo', rail, 'sgi');
              const P = 'stroke="#292b47" stroke-width=".8" stroke-linejoin="round"';
              const icons = {
                Open:
                  '<path d="M7 2H23L34 14V37H7Z" fill="url(#metalOpen)" ' +
                  P +
                  '/><path d="M23 2V14H34" fill="#e9e5fb" ' +
                  P +
                  '/><path d="M8 36V3H22M24 3V13H32" fill="none" stroke="#f2edff"/><path d="M9 37H34V15" fill="none" stroke="#535675" stroke-width="2"/>',
                Save:
                  '<rect x="5" y="2" width="30" height="34" fill="url(#metalSave)" ' +
                  P +
                  '/><path d="M6 35V3H34" fill="none" stroke="#ece9ff"/><rect x="9" y="3" width="21" height="16" fill="#a9a4d5" ' +
                  P +
                  '/><path d="M12 5H27M12 8H27M12 11H27M12 14H25" stroke="#ddd8fa"/><rect x="9" y="24" width="22" height="12" fill="#7d80a7" ' +
                  P +
                  '/><path d="M12 35V25H28V35" fill="#b3afd9" stroke="#edeaff"/><path d="M34 3V36H6" fill="none" stroke="#444b68" stroke-width="2"/>',
                Print:
                  '<rect x="9" y="2" width="24" height="15" fill="url(#metalPrint)" ' +
                  P +
                  '/><path d="M12 5H29M12 8H29M12 11H29" stroke="#5d648a"/><path d="M6 12H34V20H6Z" fill="#a8abd0" ' +
                  P +
                  '/><rect x="2" y="18" width="36" height="16" rx="1" fill="url(#metalPrint)" ' +
                  P +
                  '/><path d="M3 32V19H37" fill="none" stroke="#eee9ff"/><path d="M6 29H34" stroke="#575d83" stroke-width="2"/><rect x="8" y="30" width="25" height="6" fill="#9696c5" ' +
                  P +
                  '/><path d="M8 31H32" stroke="#e7e2ff"/><path d="M31 23H34" stroke="#5a5984"/>',
                Find:
                  '<path d="M20 2L38 36H2Z M20 13L14 25H26Z M11 30H29L32 35H8Z" fill="url(#metalFind)" fill-rule="evenodd" ' +
                  P +
                  '/><path d="M3 35L20 3L36 35M15 24L20 14L25 24" fill="none" stroke="#e3dffa"/><path d="M3 36H38L20 2" fill="none" stroke="#515979"/>',
                Tools:
                  '<rect x="6" y="2" width="29" height="35" fill="url(#metalTools)" ' +
                  P +
                  '/><path d="M7 36V3H34" fill="none" stroke="#e2ddf7"/><path d="M10 8H31V13H10Z M10 18H31V23H10Z M10 28H31V33H10Z" fill="#828aad" stroke="#555d81" stroke-width=".7"/><path d="M10 12V8H31M10 22V18H31M10 32V28H31" fill="none" stroke="#dedaf5" stroke-width="1"/><path d="M34 3V36H7" fill="none" stroke="#444d6b"/>',
                Prefs:
                  '<path d="M20 2L36 11V30L20 39L4 30V11Z" fill="url(#metalPrefs)" ' +
                  P +
                  '/><path d="M20 20L36 11V30L20 39Z" fill="#525a84" ' +
                  P +
                  '/><path d="M4 11L20 20L36 11L20 2Z" fill="#bfb4f0" ' +
                  P +
                  '/><path d="M4 29V11L20 3L35 11M5 11L20 20V38" fill="none" stroke="#e3ddff" stroke-width=".7"/>',
              };
              for (const n of ['Open', 'Save', 'Print', 'Find', 'Tools', 'Prefs']) {
                const b = u.el('button', 'rbtn', rail);
                b.type = 'button';
                const s = u.svg('svg', { width: 40, height: 40, viewBox: '0 0 40 40' }, b);
                s.innerHTML =
                  '<defs><linearGradient id="metal' +
                  n +
                  '" x2=".8" y2="1"><stop stop-color="#ded8ff"/><stop offset=".45" stop-color="#aaa5d6"/><stop offset="1" stop-color="#757da3"/></linearGradient></defs>' +
                  icons[n];
                u.el('span', '', b, n);
                b.onclick = () => env.log('rail', { n });
              }
              const tb = u.el('div', 'titlebar', main);
              u.el('span', 'tt', tb, '|Textwork 1.2');
              u.el('span', 'clock', tb, 'Mon Apr 14  10:27 AM');
              const mb = u.el('div', 'menubar', main);
              for (const t of ['File', 'Edit', 'View', 'Insert', 'Format', 'Tools', 'Help']) {
                const a = u.el('a', '', mb, t);
                a.href = '#';
                a.onclick = (e) => {
                  e.preventDefault();
                  if (t === 'Edit') {
                    const old = main.querySelector('.edit-popup');
                    if (old) {
                      old.remove();
                      return;
                    }
                    const pop = u.el('div', 'edit-popup', main);
                    const clear = u.el('button', '', pop, 'Clear Selection');
                    clear.type = 'button';
                    clear.onclick = () => {
                      env.widgetDef.clear?.();
                      pop.remove();
                    };
                  }
                };
              }
              u.el('span', 'docname', mb, 'Document: notes.txt');
              const bar = u.el('div', 'toolbar', main);
              const arrow =
                '<path d="M12 2L3 12L12 21V14C21 13 24 17 24 25C29 10 22 6 12 7Z" fill="url(#toolmetal)" ' +
                P +
                '/><path d="M4 12L11 4M13 8C22 7 27 11 25 20" fill="none" stroke="#e0e1f2" stroke-width=".7"/>';
              const tp = {
                new:
                  '<path d="M4 1H18L26 9V27H4Z" fill="url(#toolmetal)" ' +
                  P +
                  '/><path d="M18 1V9H26" fill="#edeafc" ' +
                  P +
                  '/><path d="M5 26V2H17" fill="none" stroke="#fcfaff"/>',
                open:
                  '<path d="M2 6H10L12 4H22L25 8V25H2Z" fill="url(#toolmetal)" ' +
                  P +
                  '/><path d="M2 10H26V25H2Z" fill="url(#toolmetal)" ' +
                  P +
                  '/><path d="M3 24V11H25M3 7H10L13 5H21" fill="none" stroke="#f3f0ff"/>',
                save:
                  '<rect x="2" y="2" width="24" height="25" fill="url(#toolmetal)" ' +
                  P +
                  '/><rect x="6" y="2" width="16" height="13" fill="#9899bf" ' +
                  P +
                  '/><path d="M8 4H20M8 6H20M8 8H20M8 10H20M8 12H20" stroke="#dcdcf5" stroke-width=".8"/><rect x="6" y="19" width="17" height="8" fill="#666f95" ' +
                  P +
                  '/><path d="M9 26V20H20V26M3 26V3H25" fill="none" stroke="#e8e6f8"/>',
                undo: arrow,
                redo: '<g transform="translate(28 0) scale(-1 1)">' + arrow + '</g>',
              };
              const sep = () => u.el('i', 'sep', bar);
              const tool = (k) => {
                const b = u.el('button', 'tbtn', bar);
                b.type = 'button';
                const s = u.svg('svg', { width: 28, height: 28, viewBox: '0 0 28 28' }, b);
                s.innerHTML =
                  '<defs><linearGradient id="toolmetal" x2=".8" y2="1"><stop stop-color="#e0def5"/><stop offset=".4" stop-color="#b1afd3"/><stop offset="1" stop-color="#7380a0"/></linearGradient></defs>' +
                  tp[k];
              };
              tool('new');
              sep();
              tool('open');
              sep();
              tool('save');
              sep();
              tool('undo');
              tool('redo');
              sep();
              for (const k of [0, 1, 2, 3]) {
                const b = u.el('button', 'tbtn align', bar);
                b.type = 'button';
                const s = u.svg('svg', { width: 28, height: 28, viewBox: '0 0 28 28' }, b);
                let h = '';
                for (let i = 0; i < 5; i++) {
                  const w = k === 3 || i % 2 === 0 ? 22 : 14;
                  const x = k === 0 ? 3 : k === 1 ? 14 - w / 2 : k === 2 ? 25 - w : 3;
                  h +=
                    '<rect x="' +
                    x +
                    '" y="' +
                    (4 + i * 4) +
                    '" width="' +
                    w +
                    '" height="2" fill="#949caf" stroke="#25283c" stroke-width=".9"/><path d="M' +
                    x +
                    ' ' +
                    (4.4 + i * 4) +
                    'h' +
                    w +
                    '" stroke="#ececf6" stroke-width=".4"/>';
                }
                s.innerHTML = h;
              }
              sep();
              u.el('span', 'spacer', bar);
              const f = u.el('div', 'combo wide', bar);
              u.el('span', '', f, 'Helvetica Condensed');
              u.el('b', '', f, '▼');
              const z = u.el('div', 'combo', bar);
              u.el('span', '', z, '12');
              u.el('b', '', z, '▼');
              const content = u.el('div', 'content', main),
                note = u.el('section', 'task-note', content);
              let display = ctx.display;
              if (display === 'panel' && window.innerWidth < 1260) display = 'header';
              if (display === 'panel') content.classList.add('instruction-panel');
              if (display === 'toast') content.classList.add('instruction-toast-mode');
              u.el('div', 'instruction', note, ctx.instruction);
              if (display === 'hidden') note.hidden = true;
              else if (display === 'toast') {
                note.classList.add('instruction-toast');
                const x = u.el('button', 'note-close', note, '×');
                x.type = 'button';
                x.setAttribute('aria-label', 'Close');
                x.onclick = () => (note.style.visibility = 'hidden');
              } else if (display === 'panel') note.classList.add('instruction-panel');
              const stage = u.el('main', 'stage', content);
              stage.dataset.role = 'stage';
              const st = u.el('footer', 'statusbar', main);
              u.el('span', 'pos', st, 'Ln 1, Col 1');
              u.el('span', 'ins', st, 'INS');
              const endRng = ctx.rng.fork('chrome/end'),
                labels = ctx.content.END_LABELS;
              const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
              const endLabels = (
                Array.isArray(labels) && labels.length
                  ? labels
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
              ).map(labelText);
              const standard = !ctx.finish && endRng.bool(0.5),
                placement = standard ? 'footer' : endRng.pick(['toolbar', 'link', 'footer']);
              const endLabel = standard ? 'Submit' : endRng.pick(endLabels);
              let submit = null;
              const addEnd = (parent, kind, label) => {
                const b = u.el(
                  kind === 'link' ? 'a' : 'button',
                  kind === 'link' ? 'end-link' : 'submit chrome-end',
                  parent,
                  label,
                );
                if (kind === 'link') b.href = '#';
                else b.type = 'button';
                b.dataset.role = 'submit';
                b.setAttribute('aria-label', endLabel);
                b.title = endLabel;
                b.onclick = (e) => {
                  e.preventDefault();
                  ctx.submit();
                };
                return b;
              };
              const collideRng = ctx.rng.fork('chrome/collide');
              let collide = null;
              if (!ctx.finish && collideRng.bool(0.3)) {
                const pool = [
                  ...new Set(endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase())),
                ];
                if (pool.length) collide = collideRng.pick(pool);
              }
              const decoyBtn = (parent, label) => {
                const b = u.el('button', 'chrome-xtra', parent, label);
                b.type = 'button';
                b.dataset.role = 'xtra';
                b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
                return b;
              };
              if (!ctx.finish) {
                if (placement === 'footer') submit = addEnd(st, 'button', endLabel);
                else if (placement === 'link') submit = addEnd(st, 'link', endLabel);
              }
              if (collide) decoyBtn(tb, collide);
              if (!ctx.finish && placement === 'toolbar') submit = addEnd(bar, 'button', endLabel);
              return { stage, submit };
            }
            body.className =
              'design ' + C.theme + ' layout-' + C.layout + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
          },
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
            const frame = u.el('div', 'frame', shell),
              ph = u.el('div', 'ptitle', frame);
            {
              const ic = u.svg(
                'svg',
                { width: 34, height: 40, viewBox: '0 0 34 40', fill: '#fff', stroke: '#1d3557', 'stroke-width': 2 },
                ph,
              );
              u.svg('path', { d: 'M3 2H22L31 11V38H3Z M22 2V11H31 M9 17H25 M9 22H25 M9 27H25 M9 32H25' }, ic);
              u.el('b', '', ph, 'Document Review');
              u.el('span', '', ph, 'Ref: DR-4827');
            }
            u.el(
              'div',
              'hint',
              frame,
              'Read the text below. Use your mouse to highlight the requested sentence.',
            );
            const content = u.el('div', 'content', frame),
              note = u.el('section', 'task-note', content);
            Object.assign(_c, { content, frame, note, ph });
          },
        'frame.22': () => () => {},
        'frame.24': (base, S) =>
          function (_c) {
            const { frame, u } = _c;
            const footer = u.el('footer', 'footer', frame);
            const clr = u.el('button', 'clear', footer, 'Clear Selection');
            clr.type = 'button';
            clr.onclick = () => {
              env.widgetDef.clear?.();
            };
            Object.assign(_c, { clr, footer });
          },
        'frame.26': (base, S) =>
          function (_c) {
            const { footer, u } = _c;
            {
              const cn = u.el('button', 'cancel', footer, 'Cancel');
              cn.type = 'button';
              cn.onclick = () => env.log('cancel', {});
            }
            _c.submit = null;
          },
      },
    },
  });
})();
