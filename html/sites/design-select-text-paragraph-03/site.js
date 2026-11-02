// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-select-text-paragraph-03',
    styles: ['site.css', 'win31.css', 'carbon.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'ribbon',
        'theme': 'carbon',
        'title': 'Reading Task - Text Selection',
        'tabs': ['Open', 'Save', 'Print', 'Find', 'Notes', 'Settings', 'Help'],
        'foot': '',
        'accent': '#000080',
        'bg': '#00878d',
        'surface': '#fff',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.3': (base, St) =>
          function (_c) {
            const { C } = St;
            const { body, ctx, u } = _c;
            if (C.theme === 'carbon') {
              const icon = (host, name) => {
                const s = u.svg(
                  'svg',
                  {
                    viewBox: '0 0 32 32',
                    class: 'carbon-icon',
                    fill: 'none',
                    stroke: '#dce4eb',
                    'stroke-width': 1.5,
                    'stroke-linejoin': 'round',
                  },
                  host,
                );
                const drawings = {
                  document:
                    '<path d="M5 2h19l4 5v24H5z" fill="#f4f6fa" stroke="#99b5ce"/><path d="M8 6h13v4H8z" fill="#659bd1"/><path d="M9 14h14M9 18h14M9 22h14M9 26h14" stroke="#4a77ac"/><text x="7" y="17" fill="#346aa0" stroke="none" font-size="12" font-family="serif">W</text>',
                  paste:
                    '<path d="M4 5h21v25H4z" fill="#d4ad4d" stroke="#a08238"/><path d="M6 7h17v21H6z" fill="#f3cf6d"/><path d="M10 3h9l2 5H8z" fill="#c0c6ca" stroke="#505c66"/><path d="M13 1h4v4h-4z" fill="#ccd4da" stroke="#627079"/><path d="M14 12h14v19H14z" fill="#fafafa" stroke="#748694"/><path d="M16 15h9M16 18h9M16 21h9M16 24h9" stroke="#e1e5e8"/>',
                  cut: '<circle cx="9" cy="25" r="4" stroke="#8d9aa5" stroke-width="3"/><circle cx="23" cy="25" r="4" stroke="#8d9aa5" stroke-width="3"/><path d="M11 21L23 3M21 21L9 3" stroke="#bdc5cc" stroke-width="3"/>',
                  copy: '<path d="M4 3h15v21H4z" fill="#a1a9af" stroke="#606b76"/><path d="M12 10h15v21H12z" fill="#c6ccd1" stroke="#687681"/><path d="M15 15h9M15 19h9M15 23h9M15 27h9" stroke="#768591"/>',
                  painter:
                    '<path d="M6 5l15 6-5 10L2 15z" fill="#a7cadf" stroke="#536474"/><path d="M20 13l9-9 3 3-10 11-8 13-5-4z" fill="#e3bc79" stroke="#68717c"/><path d="M20 13l4 4"/>',
                  find: '<path d="M5 10l2-7h5v12H4zM20 3h5l3 7 1 5h-9z" fill="#88b8e6" stroke="#435e87"/><path d="M3 13h10v14H2zM19 13h10l1 14H19z" fill="#6496c5" stroke="#283c57"/><path d="M12 15h8v5h-8z" fill="#b3c5d7"/><ellipse cx="7" cy="24" rx="4" ry="3" fill="#c0e0fa"/><ellipse cx="24" cy="24" rx="4" ry="3" fill="#c0e0fa"/><path d="M6 6h4M22 6h3" stroke="#eaf3fa"/>',
                  replace:
                    '<text x="3" y="13" fill="#fff" stroke="none" font-family="Arial" font-size="16">ab</text><text x="10" y="29" fill="#c7d2db" stroke="none" font-family="Arial" font-size="15">ac</text><path d="M2 18h9l-3-3M11 18l-3 3" stroke="#a1bbd3"/>',
                  select: '<path d="M9 2v25l7-7 6 10 4-3-6-10h10z" fill="#fff" stroke="#0e141a" stroke-width="2"/>',
                  view: '<rect x="3" y="3" width="26" height="26" rx="1" fill="#edf1f3" stroke="#111"/><path d="M7 6h5v21H7z" fill="#8c9aa7"/><path d="M16 7h9M16 12h9M16 17h9M16 22h9M14 4v24" stroke="#333e47"/>',
                  pages:
                    '<path d="M4 3h11v26H4zM17 3h11v26H17z" fill="#eee" stroke="#171a1c"/><path d="M6 7h7M6 11h7M6 15h7M6 19h7M19 7h7M19 11h7M19 15h7M19 19h7M19 23h7" stroke="#53616d"/>',
                };
                if (drawings[name]) s.innerHTML = drawings[name];
                else if (name.startsWith('align')) {
                  const n = Number(name.slice(5));
                  s.innerHTML = [5, 10, 15, 20, 25]
                    .map((y, i) => {
                      const w = n === 3 ? 22 : i % 2 ? 15 : 22,
                        x = n === 1 ? (32 - w) / 2 : n === 2 ? 27 - w : 5;
                      return (
                        '<path d="M' +
                        x +
                        ' ' +
                        y +
                        'h' +
                        w +
                        '" stroke="#101418" stroke-width="3.5"/><path d="M' +
                        x +
                        ' ' +
                        (y - 1) +
                        'h' +
                        w +
                        '" stroke="#e2e6e9" stroke-width="1.5"/>'
                      );
                    })
                    .join('');
                } else if (name === 'list2')
                  s.innerHTML =
                    '<path d="M10 6h18M16 15h12M22 24h6" stroke="#e6ecf1" stroke-width="2"/><path d="M2 3l5 3-5 3zM8 12l5 3-5 3zM14 21l5 3-5 3z" fill="#90b9d9" stroke="#152637"/><path d="M10 9h18M16 18h12M22 27h6" stroke="#0b1118"/>';
                else if (name.startsWith('list'))
                  s.innerHTML =
                    '<path d="M12 7h16M12 15h16M12 23h16" stroke="#e5e8ec" stroke-width="2"/><path d="M12 9h16M12 17h16M12 25h16" stroke="#10161c"/>' +
                    (name === 'list1'
                      ? '<text x="1" y="10" font-size="9" fill="#a3c6e3" stroke="none">1</text><text x="1" y="18" font-size="9" fill="#a3c6e3" stroke="none">2</text><text x="1" y="26" font-size="9" fill="#a3c6e3" stroke="none">3</text>'
                      : '<path d="M3 6h4v3H3zM3 14h4v3H3zM3 22h4v3H3z" fill="#86b8dc" stroke="#2a4356"/>');
                else if (name === 'indent0' || name === 'indent1')
                  s.innerHTML =
                    '<path d="M12 5h17M12 10h17M12 15h17M12 20h17M5 25h24" stroke="#e1e7eb" stroke-width="2"/><path d="' +
                    (name === 'indent0' ? 'M10 11L3 16l7 5z' : 'M3 11l7 5-7 5z') +
                    '" fill="#88badc" stroke="#263e52"/>';
                else if (name === 'pilcrow')
                  s.innerHTML =
                    '<path d="M3 5h26M3 8h26M7 11h18M10 14h12M13 14v14M18 14v14M11 20h10M11 24h10M11 28h10" stroke="#171c20" stroke-width="4"/><path d="M3 5h26M3 8h26M7 11h18M10 14h12M13 14v14M18 14v14M11 20h10M11 24h10M11 28h10" stroke="#eef0f1" stroke-width="1.5"/>';
                else if (name === 'spacing')
                  s.innerHTML =
                    '<path d="M16 4h12M16 9h12M16 14h12M16 19h12M16 24h12M16 29h12" stroke="#eef2f5" stroke-width="2"/><path d="M3 3h7v8H3zM3 20h7v8H3z" fill="#a1c3df" stroke="#213648"/><path d="M7 5v21M4 16l3-3 3 3M4 18l3 3 3-3" stroke="#89b7d9" stroke-width="2"/>';
                else
                  s.innerHTML =
                    '<path d="M9 7l14 8-8 11-13-8z" fill="#b1bdc8" stroke="#23303e"/><path d="M7 5l14 8 2-4-13-8z" fill="#d5dfe7" stroke="#354554"/><path d="M14 4q9-8 9 6v7" stroke="#dbe5ed" stroke-width="2"/><path d="M25 15q7 10 0 11q-7-1 0-11z" fill="#e1e9ee" stroke="#5b6979"/><path d="M3 29h25" stroke="#5595d5" stroke-width="4"/>';
                return s;
              };
              const win = u.el('div', 'cw', body);
              // Reserve space for episode notes; compact windows use the document's header note.
              const compact = win.clientWidth < 1200 || win.clientHeight < 680;
              const display = compact && ['panel', 'toast'].includes(ctx.display) ? 'header' : ctx.display;
              body.classList.toggle('has-instruction-toast', display === 'toast');
              const tt = u.el('div', 'ctitle', win);
              const ti = u.el('span', 'cdoc', tt);
              icon(ti, 'document');
              u.el('span', '', tt, 'Document1 - Writer');
              const wc = u.el('div', 'cwc', tt);
              for (const [k, l] of [
                ['min', '−'],
                ['max', '□'],
                ['close', '×'],
              ]) {
                const b = u.el('button', 'cwb ' + k, wc, l);
                b.type = 'button';
                b.onclick = () => env.log('window-control', { label: l });
              }
              const tabs = u.el('div', 'ctabs', win);
              ['Home', 'Insert', 'Page Layout', 'References', 'Mailings', 'Review', 'View'].forEach((t, i) =>
                u.el('span', 'ctab' + (i === 0 ? ' on' : ''), tabs, t),
              );
              const rib = u.el('div', 'cribbon', win);
              const grp = (name, cls) => {
                const g = u.el('div', 'cg ' + (cls || ''), rib);
                const body = u.el('div', 'cgb', g);
                u.el('div', 'cgn', g, name);
                return body;
              };
              const ic = (p, glyph, cls, txt) => {
                const s = u.el('span', 'ci ' + (cls || ''), p, glyph);
                if (txt) s.title = txt;
                return s;
              };
              {
                const g = grp('Clipboard', 'g-clip');
                const big = u.el('div', 'paste', g);
                icon(u.el('span', 'paste-ic', big), 'paste');
                u.el('span', '', big, 'Paste');
                u.el('span', 'dd', big, '▾');
                const col = u.el('div', 'col', g);
                for (const [i, t] of [
                  ['cut', 'Cut'],
                  ['copy', 'Copy'],
                  ['painter', 'Format Painter'],
                ]) {
                  const r = u.el('div', 'row', col);
                  icon(u.el('span', 'ri', r), i);
                  u.el('span', '', r, t);
                }
              }
              {
                const g = grp('Font', 'g-font');
                const r1 = u.el('div', 'row', g);
                const f = u.el('span', 'combo f1', r1);
                u.el('span', '', f, 'Calibri');
                u.el('i', '', f, '▾');
                const s = u.el('span', 'combo f2', r1);
                u.el('span', '', s, '11');
                u.el('i', '', s, '▾');
                const r2 = u.el('div', 'row r2', g);
                for (const [t, c] of [
                  ['B', 'b'],
                  ['I', 'it'],
                  ['U', 'ul'],
                  ['▾', 'sm'],
                  ['abc', 'ab'],
                  ['ab', 'hl'],
                  ['▾', 'sm'],
                  ['A', 'fc'],
                  ['▾', 'sm'],
                ])
                  u.el('span', 'fb ' + c, r2, t);
              }
              {
                const g = grp('Paragraph', 'g-para');
                const r1 = u.el('div', 'row', g);
                const lists = u.el('span', 'list-tools', r1);
                ['list0', 'list1', 'list2', 'indent0', 'indent1', 'pilcrow'].forEach((t, i) => {
                  const b = u.el('span', 'fb ptool' + (i < 3 ? ' dropdown' : ''), i < 3 ? lists : r1);
                  icon(b, t);
                });
                const r2 = u.el('div', 'row r2', g);
                ['align0', 'align1', 'align2', 'align3', 'spacing', 'paint'].forEach((t, i) => {
                  const b = u.el('span', 'fb ptool ' + t + (i === 0 ? ' on' : '') + (i > 3 ? ' dropdown' : ''), r2);
                  icon(b, t);
                });
              }
              {
                const g = grp('Styles', 'g-styles');
                const r = u.el('div', 'srow', g);
                ['Normal', 'No Spacing', 'Heading 1', 'Heading 2', 'Title'].forEach((t, i) =>
                  u.el('span', 'sty' + (i === 0 ? ' on' : ''), r, t),
                );
              }
              {
                const g = grp('Editing', 'g-edit');
                const col = u.el('div', 'col', g);
                for (const [i, t] of [
                  ['find', 'Find ▾'],
                  ['replace', 'Replace'],
                  ['select', 'Select ▾'],
                ]) {
                  const r = u.el('div', 'row', col);
                  icon(u.el('span', 'ri', r), i);
                  u.el('span', '', r, t);
                }
              }
              const work = u.el('div', 'cwork', win);
              const paper = u.el('div', 'paper', work);
              const note = u.el('section', 'task-note', paper);
              u.el('div', 'instruction', note, ctx.instruction);
              if (display === 'hidden') note.hidden = true;
              else if (display === 'toast') {
                const notice = u.el('div', 'cnotice', win);
                notice.append(note);
                note.classList.add('instruction-toast');
                note.setAttribute('role', 'note');
                const x = u.el('button', 'note-close', note, '×');
                x.type = 'button';
                x.title = 'Dismiss task note';
                x.setAttribute('aria-label', 'Dismiss task note');
                x.onclick = () => (note.style.visibility = 'hidden');
              } else if (display === 'panel') {
                work.classList.add('with-task-panel');
                work.append(note);
                note.classList.add('instruction-panel');
                const heading = u.el('div', 'task-panel-title', note, 'Selection task');
                note.prepend(heading);
              }
              const endRng = ctx.rng.fork('chrome/end');
              let endPlacement = 'status',
                endLabel = 'Submit';
              if (!ctx.finish) {
                const labels = ctx.content.END_LABELS || [
                  'Submit',
                  'Done',
                  'Finish',
                  'Continue',
                  'Save',
                  'OK',
                  'Confirm',
                  'Apply',
                  'Complete',
                  "I'm done",
                ];
                endPlacement = endRng.pick(['status', 'status', 'tabs', 'status-link']);
                if (endPlacement !== 'status') {
                  const alternates = labels.filter((x) => String(x).trim().toLowerCase() !== 'submit');
                  endLabel = endRng.pick(alternates.length ? alternates : labels);
                }
              }
              const collisionRng = ctx.rng.fork('chrome/collide');
              let collision = null;
              if (!ctx.finish && collisionRng.bool(0.3)) {
                const labels = ctx.content.END_LABELS || [
                  'Submit',
                  'Done',
                  'Finish',
                  'Continue',
                  'Save',
                  'OK',
                  'Confirm',
                  'Apply',
                  'Complete',
                  "I'm done",
                ];
                const options = [...new Set(labels)].filter(
                  (x) => String(x).trim().toLowerCase() !== String(endLabel).trim().toLowerCase(),
                );
                if (options.length) collision = collisionRng.pick(options);
              }
              if (collision) {
                const b = u.el('button', 'tab-action tab-xtra', tabs, collision);
                b.type = 'button';
                b.dataset.role = 'xtra';
                b.onclick = () => env.log('decoy', { label: collision, collide: true });
              }
              let tabSubmit = null;
              if (!ctx.finish && endPlacement === 'tabs') {
                tabSubmit = u.el('button', 'tab-action tab-submit', tabs, endLabel);
                tabSubmit.type = 'button';
                tabSubmit.dataset.role = 'submit';
                tabSubmit.title = endLabel;
                tabSubmit.setAttribute('aria-label', endLabel);
                tabSubmit.onclick = () => ctx.submit();
              }
              const stage = u.el('main', 'stage', paper);
              stage.dataset.role = 'stage';
              const st = u.el('div', 'cstatus', win);
              u.el('span', 'si', st, 'Page 1 of 1');
              u.el('span', 'si', st, 'Words: 93');
              u.el('span', 'si', st, 'English (U.S.)');
              u.el('span', 'grow', st);
              icon(u.el('span', 'vb on', st), 'view');
              icon(u.el('span', 'vb', st), 'pages');
              u.el('span', 'zp', st, '100%');
              u.el('span', 'zm', st, '−');
              const tr = u.el('span', 'ztrack', st);
              u.el('span', 'zthumb', tr);
              u.el('span', 'zm', st, '+');
              let submit = null;
              if (!ctx.finish && endPlacement === 'status') {
                submit = u.el('button', 'submit', st, endLabel);
                submit.type = 'button';
                submit.dataset.role = 'submit';
                submit.onclick = () => ctx.submit();
              }
              if (!ctx.finish && endPlacement === 'status-link') {
                submit = u.el('button', 'status-link', st, endLabel + ' ›');
                submit.type = 'button';
                submit.dataset.role = 'submit';
                submit.title = endLabel;
                submit.setAttribute('aria-label', endLabel);
                submit.onclick = () => ctx.submit();
              }
              if (tabSubmit) submit = tabSubmit;
              return { stage, submit };
            }
          },
        'frame.8': (base, St) =>
          function (_c) {
            const { C } = St;
            const { head, u } = _c;
            if (['eink', 'office', 'vista', 'plain', 'aqua', 'motif', 'human', 'gtk', 'win31'].includes(C.theme)) {
              const controls = u.el('div', 'window-controls', head);
              for (const label of ['−', '□', '×']) {
                const bt = u.el('button', '', controls, label);
                bt.type = 'button';
                bt.onclick = () => env.log('window-control', { label });
              }
            }
          },
        'frame.22': (base, St) =>
          function (_c) {
            const { C } = St;
            const { content, ctx, u } = _c;
            if (['three', 'windows', 'offset', 'sheet', 'notebook', 'rail', 'palette', 'ledger'].includes(C.layout)) {
              _c.aside = u.el('aside', 'aside', content);
              if (C.tabs) {
                _c.aside.classList.add('tabs');
                for (const text of C.tabs) {
                  const bt = u.el('button', 'tab', _c.aside);
                  bt.type = 'button';
                  {
                    const P = {
                      Open: '<path d="M8 3h12l6 6v20H8z" fill="#fff" stroke="#000080" stroke-width="2"/><path d="M12 14h10M12 18h10M12 22h10" stroke="#000080" stroke-width="2"/>',
                      Save: '<path d="M4 4h24v24H4z" fill="#000080"/><path d="M9 4h14v9H9z" fill="#fff"/><path d="M10 19h12v9H10z" fill="#808080"/>',
                      Print:
                        '<path d="M9 4h14v9H9z" fill="#fff" stroke="#000" stroke-width="2"/><path d="M3 13h26v12H3z" fill="#c0c0c0" stroke="#000" stroke-width="2"/><path d="M8 21h16v8H8z" fill="#fff" stroke="#000" stroke-width="2"/>',
                      Find: '<circle cx="13" cy="13" r="8" fill="#bfe8ff" stroke="#000080" stroke-width="3"/><path d="M19 19l9 9" stroke="#000080" stroke-width="5"/>',
                      Notes: '<path d="M3 8h10l3 3h13v16H3z" fill="#ffff55" stroke="#808000" stroke-width="2"/>',
                      Settings:
                        '<circle cx="16" cy="16" r="10" fill="#808080" stroke="#404040" stroke-width="4" stroke-dasharray="4 3"/><circle cx="16" cy="16" r="6" fill="#c0c0c0" stroke="#404040" stroke-width="2"/>',
                      Help: '<text x="16" y="27" font-size="30" font-weight="bold" text-anchor="middle" fill="#000080" font-family="Arial">?</text>',
                    };
                    const ic = u.svg('svg', { width: 34, height: 34, viewBox: '0 0 32 32' }, bt);
                    ic.innerHTML =
                      {
                        'Open':
                          '<path d="M5 2h18l5 5v24H5z" fill="#fff" stroke="#111" stroke-width="1.5"/><path d="M23 2v6h5M8 6h12M8 11h16M8 14h16M8 17h16M8 20h16M8 23h16M8 26h16" fill="none" stroke="#5555ed" stroke-width="1.3"/>',
                        'Save':
                          '<path d="M3 2h24l3 3v25H3z" fill="#000080" stroke="#111" stroke-width="1.5"/><path d="M5 3h3v24H5z" fill="#7777ff"/><path d="M10 3h14v11H10z" fill="#ddd" stroke="#111"/><path d="M12 4h10v8H12z" fill="#fff"/><path d="M9 19h15v11H9z" fill="#aaa" stroke="#111"/><path d="M14 22h4v7h-4z" fill="#000080"/><path d="M27 7v20" stroke="#6666ff" stroke-width="2"/>',
                        'Print':
                          '<path d="M5 16h24v12l-4 3H2V21z" fill="#999" stroke="#111" stroke-width="1.5"/><path d="M2 21h23l4-5M25 21v10" fill="none" stroke="#111"/><path d="M10 2h17l-5 16H6z" fill="#fff" stroke="#111" stroke-width="1.5"/><path d="M13 5h10M12 8h10M11 11h10M10 14h10" stroke="#000080" stroke-width="1.3"/><path d="M6 20h15l-2 7H4z" fill="#ddd" stroke="#111"/><path d="M8 21h9" stroke="#fff"/><path d="M23 24h3" stroke="#000"/>',
                        'Find':
                          '<path d="M20 19l10 10-3 3-10-10z" fill="#777" stroke="#111" stroke-width="1.3"/><circle cx="13" cy="13" r="11" fill="#000080" stroke="#111"/><circle cx="13" cy="13" r="9" fill="#5ce6ff"/><path d="M6 13a7 7 0 0 1 12-6v7H6z" fill="#e0ffff"/><path d="M6 7l3-2M5 11v4" stroke="white" stroke-width="2"/>',
                        'Notes':
                          '<path d="M2 4h11l4 5h13v23H2z" fill="#ffff91" stroke="#111" stroke-width="1.6"/><path d="M4 7h8l3 4h12v18H4z" fill="#ffff99"/><path d="M3 29h26V10" fill="none" stroke="#aaa954" stroke-width="2"/>',
                        'Settings':
                          '<path d="M12 2h7l1 5 4 1 4-2 4 6-4 3v4l4 3-4 6-4-2-4 1-1 5h-7l-1-5-4-1-4 2-4-6 4-3v-4l-4-3 4-6 4 2 4-1z" fill="#999" stroke="#111" stroke-width="1.5"/><path d="M13 4h4M24 11l3 3M6 12l-2 3M23 26l-3 1" stroke="#eee" stroke-width="1.5"/><circle cx="15.5" cy="17" r="7" fill="#ddd" stroke="#111" stroke-width="1.4"/><circle cx="15.5" cy="17" r="4" fill="#aaa"/>',
                        'Help':
                          '<text x="16" y="29" font-size="34" font-weight="bold" text-anchor="middle" fill="#0808b3" stroke="#111" stroke-width=".7" font-family="Arial">?</text>',
                      }[text] ||
                      P[text] ||
                      '';
                  }
                  u.el('span', '', bt, text);
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
          },
        'frame.23': () => () => {},
        'frame.28': (base, St) =>
          function (_c) {
            const { C } = St;
            const { body, footer, u } = _c;
            if (C.theme === 'win31') {
              const clr = u.el('button', 'clear', footer, 'Clear');
              clr.type = 'button';
              clr.onclick = () => {
                env.widgetDef.clear?.();
              };
              const tb = u.el('div', 'taskbar', body);
              const st = u.el('div', 'tb-start', tb);
              const fl = u.el('span', 'tb-flag', st);
              u.el('b', '', st, 'Start');
              u.el('div', 'tb-task', tb, C.title);
              const tr = u.el('div', 'tb-tray', tb);
              {
                const sp = u.svg(
                  'svg',
                  { width: 20, height: 18, viewBox: '0 0 20 18', fill: 'none', stroke: '#000', 'stroke-width': 1.6 },
                  tr,
                );
                u.svg('path', { d: 'M2 6h3l4-4v14l-4-4H2zM12 6q2 3 0 6M15 4q4 5 0 10' }, sp);
              }
              u.el('span', '', tr, '10:24 AM');
            }
            if (C.theme === 'eink') {
              const points = u.el('span', 'points', footer, 'Points: 0/1');
              footer.insertBefore(points, _c.submit);
              const clear = u.el('button', 'clear', footer, 'Clear');
              clear.onclick = () => {
                env.widgetDef.clear?.();
              };
            }
          },
      },
    },
  });
})();
