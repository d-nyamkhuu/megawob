// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-use-email-star-10',
    styles: ['site.css', 'extra.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'flash',
        'brand': 'Mail Manager',
        'nav': 'File  Edit  View  Message  Help',
        'foot': true,
        'bg': '#9fcbef',
        'surface': '#eff6fc',
        'fg': '#062354',
        'line': '#8daed0',
        'title': '#3164a2',
        'titlefg': '#fff',
        'control': '#d3e4f4',
        'accent': '#f6d956',
        'accentfg': '#082356',
        'sel': '#c3ddf3',
        'bar': 75,
        'note': 'left:1%;top:13%;width:19%;background:#ffe896;clip-path:polygon(0 0,100% 0,100% 86%,90% 100%,0 100%)',
        'end': 'left:2%;bottom:5%;width:17%;clip-path:polygon(9% 0,94% 0,100% 50%,90% 100%,0 100%,0 60%)',
        'geo': {
          'folders': 'left:.5%;top:24%;width:20%;height:74%;background:#80b6e8;border:0',
          'ledger': 'left:21.2%;top:1%;width:78%;height:44%',
          'document': 'left:21.2%;top:47%;width:78%;height:51%',
          'editor': 'left:52%;top:48%;width:47%;height:50%',
          'contacts': 'display:none',
        },
        'site': 'design-use-email-star-10',
        'scenario': 'star',
        'platform': 'web',
        'account': '',
        'noteTitle': 'Task  Overview',
        'folderLabels': {
          'sent': 'Sent Mail',
          'drafts': 'Drafts',
          'junk': 'Junk',
          'spam': 'Spam',
          'templates': 'Templates',
          'compose': 'Compose',
        },
        'folderList': ['inbox', 'compose', 'sent', 'drafts', 'trash'],
        'rowHeight': 44,
        'stack': false,
        'dock': ['Start', 'Mail Manager', '10:24 AM'],
      },
      parts: {
        'frame.3': (base, S) =>
          function (_c) {
            const { E, ctx } = _c;
            document.body.dataset.display = ctx.display;
            const bar = E('header', 'desktop-bar', document.body);
            Object.assign(_c, { bar });
          },
        'frame.7': (base, S) =>
          function (_c) {
            const { E, bar } = _c;
            const controls = E('div', 'title-controls', bar);
            for (const t of ['minimize', 'maximize', 'close']) {
              const b = E('button', t, controls);
              b.type = 'button';
              b.setAttribute('aria-label', t);
              b.addEventListener('click', () => env.log('decoy', { label: t }));
            }
            const icons = E('div', 'desk-icons', document.body);
            const drawings = [
              '<path d="M13 3 18 1h28v25l-4 4H13z" fill="#888"/><path d="M13 3h29v27H13z" fill="#dedede"/><path d="M15 5h25v23H15z" fill="#888" stroke="white"/><path d="M18 7h20v17H18z" fill="#000080" stroke="#333"/><path d="M22 11h13v9H22z" fill="#355bbb"/><path d="M24 13h9v5h-9" stroke="#ccc" stroke-width="1"/><path d="M26 14v3m3-3v3m3-3v3" stroke="white" stroke-width="1"/><path d="M24 30h11v4H24zM8 35l6-5h34v12l-5 5H8z" fill="#999"/><path d="M8 35h35v12H8z" fill="#ddd"/><path d="M10 36h31v8H10z" stroke="white" fill="#aaa"/><path d="M14 38h18v4H14z" fill="#333"/><path d="M15 39h15" stroke="#eee" stroke-width="1"/><path d="M35 38h4v4h-4" fill="#ddd"/><path d="M44 35v8" stroke="#333"/>',
              '<path d="M15 7h27v40H15z" fill="#ffe679"/><path d="M15 7l5-5h27v39l-5 6V7" fill="#a58c22"/><path d="m17 5 4-2h23" stroke="#fff5ba"/><path d="M18 10v34h22" fill="none" stroke="#fff4ac"/><path d="M20 12h17v12H20zM20 29h17v12H20z" fill="#fff5a5"/><path d="M25 15h7v3h-7M25 32h7v3h-7" fill="#555"/><path d="M24 16h7M24 33h7" stroke="white" stroke-width="1"/>',
              '<path d="M13 7h30v39H13z" fill="white"/><path d="M13 7l4-4h29v38l-3 5" fill="#ccc"/><path d="M17 13h22M17 18h22M17 23h22M17 28h22M17 33h17M17 38h13" stroke="#188c9c"/><path d="M16 3v7M21 3v7M26 3v7M31 3v7M36 3v7M41 3v7" stroke="#333"/><path d="M27 36L44 8l4 3-17 28-6 3z" fill="#ef1515"/><path d="M25 42l3-7 4 3z" fill="#ffe3a0"/>',
              '<path d="M12 25h31l6 7v14H8V32z" fill="#b9b9c2"/><path d="M17 7h24l-4 20H13z" fill="#888"/><path d="M20 9h18l-3 16H16z" fill="white"/><path d="M21 12h13M20 15h13M19 18h13" stroke="#c9c9e5" stroke-width="1"/><path d="M10 34h35v9H10z" fill="#eee"/><path d="M43 33h6v11l-6 4" fill="#888"/><path d="M12 28h28M12 31h28" stroke="white"/><path d="M11 43h29" stroke="#7c7c90"/><path d="M39 36h3v3h-3" fill="#000080"/>',
            ];
            for (const [i, t] of ['Program Manager', 'File Manager', 'Windows Write', 'Print Manager'].entries()) {
              const d = E('div', 'desk-icon', icons);
              const s = E('span', 'glyph', d);
              s.innerHTML =
                '<svg viewBox="0 0 56 52" aria-hidden="true"><g stroke="#151515" stroke-width="1.5" stroke-linejoin="miter">' +
                drawings[i] +
                '</g></svg>';
              E('span', '', d, t);
            }
            Object.assign(_c, { controls, drawings, icons });
          },
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.15': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx } = _c;
            if (ctx.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = ctx.display;
              if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              E('div', 'instruction', note, ctx.instruction);
            }
            const endR = ctx.rng.fork('chrome/end');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endWords = ctx.content.END_LABELS.map(labelOf);
            const referenceEnd = endR.bool(0.5);
            const placement = referenceEnd ? 'footer' : endR.pick(['menu', 'footer-left']);
            const endLabel = referenceEnd ? 'Submit' : endR.pick(endWords);
            Object.assign(_c, { endLabel, endR, endWords, labelOf, placement, referenceEnd });
          },
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, ctx, endLabel, endWords, placement } = _c;
            if (!ctx.finish) {
              _c.submit = E('button', 'end-control', document.body, endLabel);
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.dataset.placement = placement;
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.addEventListener('click', () => ctx.submit());
            }
            const collideR = ctx.rng.fork('chrome/collide');
            if (collideR.bool(0.3)) {
              const label = collideR.pick(
                endWords.filter((word) => word.trim().toLowerCase() !== endLabel.trim().toLowerCase()),
              );
              const b = E('button', 'end-xtra', document.body, label);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
            }
            Object.assign(_c, { collideR });
          },
      },
    },
  });
})();
