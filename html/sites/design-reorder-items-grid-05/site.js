// Design on templates/site/drag-reorder-list-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-reorder-items-grid-05',
    styles: ['site.css', 'nb.css'],
    scripts: [],
    template: 'site/reorder-items-list-03',
    design: {
      C: {
        'layout': 'stack',
        'theme': 'collage',
        'title': '',
        'foot': 'Reorder all tiles. The list will be read left to right, top to bottom.',
        'accent': '#ff7921',
        'bg': '#f6f4ef',
        'surface': '#fcfcfc',
        'font': 'Arial, sans-serif',
      },
      parts: {
        'frame.1': (base, S) =>
          function (_c) {
            const { ctx } = _c;
            if (true) {
              const u = ctx.util,
                body = document.body;
              body.className = 'design nb';
              const shell = u.el('div', 'nb-shell', body);
              const tb = u.el('div', 'nb-title', shell);
              const ic = u.el('span', 'nb-appicon', tb);
              const logo = u.svg(
                'svg',
                { viewBox: '0 0 20 20', width: 16, height: 16, fill: 'none', stroke: '#fff', 'stroke-width': 1.4 },
                ic,
              );
              u.svg('path', { d: 'M5 3h11v14H5zM3 6h4M3 10h4M3 14h4M9 6h4v5H9zM9 14h4' }, logo);
              u.el('span', '', tb, 'Notebook');
              const wc = u.el('div', 'nb-wc', tb);
              for (const d of ['M4 10h14', 'M4 4h13v13H4z', 'M4 4l13 13M17 4L4 17']) {
                const control = u.el('span', '', wc);
                const icon = u.svg(
                  'svg',
                  {
                    width: 21,
                    height: 21,
                    viewBox: '0 0 21 21',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': 1.8,
                  },
                  control,
                );
                u.svg('path', { d }, icon);
              }
              const mn = u.el('nav', 'nb-menu', shell);
              for (const m of ['File', 'Edit', 'View', 'Note', 'Tools', 'Help']) u.el('span', '', mn, m);
              const tabs = u.el('div', 'nb-tabs', shell);
              const ics = {
                Tasks: 'M6 3H4Q2 3 2 5v12q0 2 2 2h11q2 0 2-2V5q0-2-2-2h-2M6 2h7v3H6zM7 8h6v6H7zM10 7v3M12 11h2',
                Notes: 'M4 2h8l5 5v12H4zM12 2v5h5M7 6h2M7 10h7M7 13h7M7 16h5',
                Bookmarks: 'M4 2h13v17l-6.5-4L4 19z',
                Search: 'M9 2a7 7 0 1 0 0 14a7 7 0 1 0 0-14M14 14L19 19',
              };
              for (const t of ['Tasks', 'Notes', 'Bookmarks', 'Search']) {
                const b = u.el('span', 'nb-tab' + (t === 'Tasks' ? ' on' : ''), tabs);
                const s = u.svg(
                  'svg',
                  {
                    width: 22,
                    height: 22,
                    viewBox: '0 0 20 20',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': 1.5,
                  },
                  b,
                );
                u.svg('path', { d: ics[t] }, s);
                u.el('span', '', b, t);
              }
              const endR = ctx.rng.fork('chrome/end'),
                collideR = ctx.rng.fork('chrome/collide');
              const endWords = ctx.content.END_LABELS.map((x) =>
                typeof x === 'string' ? x : x.label || x.text || x.name,
              );
              const alternateLabel = endR.pick(endWords.filter((x) => x !== 'Submit'));
              const endPlacement = endR.fork('placement').pick(['footer', 'footer', 'toolbar', 'link']);
              const endLabel = endPlacement === 'footer' ? 'Submit' : alternateLabel;
              const tools = u.el('div', 'nb-tools', tabs);
              if (collideR.bool(0.3)) {
                const choices = endWords.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
                if (choices.length) {
                  const label = collideR.pick(choices),
                    decoy = u.el('button', 'nb-xtra', tools, label);
                  decoy.type = 'button';
                  decoy.dataset.role = 'xtra';
                  decoy.onclick = () => env.log('decoy', { label, collide: true });
                }
              }
              const area = u.el('div', 'nb-area', shell),
                frame = u.el('div', 'nb-frame', area);
              const note = u.el('section', 'task-note nb-note', frame);
              u.el('div', 'instruction', note, ctx.instruction);
              if (ctx.display === 'hidden') note.hidden = true;
              else if (ctx.display === 'toast') {
                note.classList.add('instruction-toast');
                const x = u.el('button', 'note-close', note, '×');
                x.onclick = () => (note.style.visibility = 'hidden');
              } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
              const stage = u.el('main', 'stage', frame);
              stage.dataset.role = 'stage';
              const footer = u.el('footer', 'nb-foot', frame);
              const reset = u.el('button', 'nb-reset', footer, 'Reset');
              reset.type = 'button';
              reset.onclick = () => env.widgetDef.clear?.();
              let submit = null;
              if (!ctx.finish) {
                submit = u.el(
                  endPlacement === 'link' ? 'a' : 'button',
                  'submit nb-submit' +
                    (endPlacement === 'toolbar' ? ' nb-toolbar-end' : endPlacement === 'link' ? ' nb-endlink' : ''),
                  endPlacement === 'toolbar' ? tools : footer,
                  endLabel,
                );
                if (endPlacement === 'link') submit.href = '#';
                else submit.type = 'button';
                submit.dataset.role = 'submit';
                submit.title = endLabel;
                submit.setAttribute('aria-label', endLabel);
                submit.onclick = (e) => {
                  e.preventDefault();
                  ctx.submit();
                };
              }
              const rs = document.documentElement.style;
              rs.setProperty('--bg', '#faf7f1');
              rs.setProperty('--panel', '#fff');
              rs.setProperty('--fg', '#1b1c20');
              rs.setProperty('--muted', '#8a8d93');
              rs.setProperty('--line', '#b9bcc2');
              rs.setProperty('--accent', '#ee6a1f');
              rs.setProperty('--font', '"Segoe UI",Arial,sans-serif');
              return { stage, submit };
            }
            const u = ctx.util,
              body = document.body;
            Object.assign(_c, { body, u });
          },
        'frame.3': () => () => {},
        'frame.22': () => () => {},
        'frame.27': (base, S) =>
          function (_c) {
            const { C } = S;
            const { ctx, footer, u } = _c;
            if (!ctx.finish) {
              const parent = C.layout === 'three' && _c.aside ? _c.aside : footer;
              _c.submit = u.el('button', 'submit', parent);
              u.el('span', 'submit-label', _c.submit, 'Submit');
              _c.submit.type = 'button';
              _c.submit.dataset.role = 'submit';
              _c.submit.onclick = () => ctx.submit();
            }
          },
      },
    },
  });
})();
