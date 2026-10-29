// Design on templates/site/app-email-unread-04.js: only what this site changed.
(function () {
  'use strict';
  const MAIL =
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#eaf1f3" stroke="#171717" d="M2 4h20v16H2z"/><path fill="#b3c5ce" stroke="#171717" d="m2 20 8-8h4l8 8"/><path fill="#f5f4e9" stroke="#171717" d="m2 4 10 9L22 4"/></svg>';
  env.site({
    name: 'design-use-email-nl-07',
    styles: ['site.css'],
    scripts: [],
    template: 'site/use-email-unread-04',
    design: {
      C: {
        'style': 'irix',
        'brand': 'TerraMail 1.2.4',
        'nav': 'File  Edit  View  Message  Tools  Help',
        'site': 'design-use-email-nl-07',
        'scenario': 'nl',
        'platform': 'desktop',
        'account': 'Apr 26  09:16',
        'noteTitle': null,
        'dock': [],
      },
      parts: {
        'frame.3': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E } = _c;
            E('div', 'win-frame', document.body);
            const bar = E('header', 'desktop-bar', document.body);
            E('span', 'brand-ic', bar).innerHTML = MAIL;
            E('span', 'brand', bar, C.brand);
            const gad = E('span', 'win-gadgets', bar);
            for (const g of ['_', '▢', '×']) E('span', 'gad', gad, g);
            const n = E('nav', 'menubar', document.body);
            for (const label of C.nav.split(/\s{2,}/)) {
              const a = E('button', 'chrome-nav', n);
              a.type = 'button';
              a.innerHTML = '<u>' + label[0] + '</u>' + label.slice(1);
              a.addEventListener('click', () => env.log('decoy', { label }));
            }
            Object.assign(_c, { bar, gad, n });
          },
        'frame.4': () => () => {},
        'frame.5': () => () => {},
        'frame.6': () => () => {},
        'frame.7': () => () => {},
        'frame.8': () => () => {},
        'frame.9': () => () => {},
        'frame.10': () => () => {},
        'frame.13': (base, S) =>
          function (_c) {
            const { C } = S;
            const { E, ctx, footer } = _c;
            const gear = E('span', 'tb-gear', footer);
            gear.innerHTML =
              '<svg viewBox="0 0 24 24"><path fill="#a73746" stroke="#171717" d="m9 2 1 3h4l1-3 3 2-1 3 2 2 3-1v4l-3 1-1 3 2 2-3 3-2-2-3 1-1 3H8l-1-3-3-1 1-3-2-2-2 1V9l3-1 1-3-1-2z"/><circle cx="12" cy="12" r="4" fill="#d4d4d0" stroke="#222"/></svg>';
            for (const t of ['Applications', 'Places', 'System']) E('span', 'tb-item', footer, t);
            const task = E('span', 'tb-task', footer);
            task.innerHTML = MAIL + '<span>TerraMail 1.2.4</span>';
            const right = E('span', 'tb-right', footer);
            right.innerHTML =
              '<svg viewBox="0 0 24 24"><path fill="#999" stroke="#171717" d="M2 9h5l5-5v16l-5-5H2z"/><path stroke="#171717" d="M16 8q5 4 0 8M19 4q9 8 0 16"/></svg><svg viewBox="0 0 24 24"><path fill="#b9bdba" stroke="#171717" d="M2 2h20v16H2z"/><path fill="#626968" stroke="#171717" d="M4 4h16v12H4z"/><path stroke="#171717" d="M12 18v4M7 22h10"/></svg><span>' +
              C.account +
              '</span>';
            if (ctx.display !== 'hidden') {
              const note = E('aside', 'task-note', document.body);
              note.dataset.display = ctx.display;
              note.setAttribute('aria-label', 'Task instruction');
              if (C.noteTitle) E('div', 'note-title', note, C.noteTitle);
              if (ctx.display === 'panel' || ctx.display === 'toast')
                E('div', 'note-caption', note, ctx.display === 'panel' ? 'Task details' : 'TerraMail notification');
              E('div', 'instruction', note, ctx.instruction);
            }
            const er = ctx.rng.fork('chrome/end'),
              cr = ctx.rng.fork('chrome/collide');
            const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
            const endLabels = ctx.content.END_LABELS.map(labelOf);
            const original = er.bool(0.5),
              placement = original ? 'footer' : er.pick(['toolbar', 'link']);
            const endLabel = original ? 'Submit' : er.pick(endLabels);
            Object.assign(_c, { cr, endLabel, endLabels, er, gear, labelOf, original, placement, right, task });
          },
        'frame.14': () => () => {},
        'frame.15': () => () => {},
        'frame.16': () => () => {},
        'frame.17': () => () => {},
        'frame.19': (base, S) =>
          function (_c) {
            const { E, cr, ctx, endLabel, endLabels, n, placement } = _c;
            if (!ctx.finish) {
              _c.submit = E(
                placement === 'link' ? 'a' : 'button',
                'end-control end-' + placement,
                document.body,
                endLabel,
              );
              if (placement === 'link') _c.submit.href = '#';
              else _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.title = endLabel;
              _c.submit.setAttribute('aria-label', endLabel);
              _c.submit.addEventListener('click', (e) => {
                e.preventDefault();
                ctx.submit();
              });
            }
            if (cr.bool(0.3)) {
              const choices = [...new Set(endLabels)].filter(
                (x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
              );
              if (choices.length) {
                const label = cr.pick(choices),
                  decoy = E('button', 'end-xtra', n, label);
                decoy.type = 'button';
                decoy.dataset.role = 'xtra';
                decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
              }
            }
          },
      },
    },
  });
})();
