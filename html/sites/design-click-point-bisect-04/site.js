// Design on templates/site/click-point-bisect-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-point-bisect-04',
    styles: ['site.css', 'pixel.css'],
    scripts: [],
    template: 'site/click-point-bisect-03',
    design: {
      parts: {
        frame: (base, S) =>
          function (ctx) {
            const u = ctx.util,
              body = document.body;
            body.className = 'design pc' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
            const root = document.documentElement;
            for (const [k, v] of Object.entries({
              bg: '#fdf9ec',
              panel: '#fdf9ec',
              fg: '#0f1f4d',
              muted: '#2a3b6b',
              line: '#9fb4c8',
              accent: '#0f1f4d',
            }))
              root.style.setProperty('--' + k, v);
            root.style.setProperty('--font', '"Lucida Console","Courier New",monospace');
            const shell = u.el('div', 'shell pc-shell', body),
              top = u.el('header', 'pc-top', shell);
            u.el('div', 'pc-title', top, 'Geometry Practice');
            const tabs = u.el('nav', 'pc-tabs', top);
            ['Angle Tasks', 'Shapes', 'Tools', 'Help'].forEach((t, i) => {
              const b = u.el('button', 'pc-tab' + (i === 0 ? ' on' : ''), tabs, t);
              b.type = 'button';
              b.onclick = () => {
                tabs.querySelectorAll('.pc-tab').forEach((x) => x.classList.remove('on'));
                b.classList.add('on');
              };
            });
            const grid = u.el('div', 'pc-grid', shell),
              left = u.el('div', 'pc-left', grid),
              content = u.el('div', 'content pc-center', grid),
              right = u.el('div', 'pc-right', grid);
            const box = (p, t, cls) => {
              const b = u.el('section', 'pc-box ' + (cls || ''), p);
              if (t) u.el('div', 'pc-box-h', b, t);
              return u.el('div', 'pc-box-b', b);
            };
            const pt = box(left, 'Pointer', 'pc-pointer');
            const btn = u.el('button', 'pc-tool', pt);
            btn.type = 'button';
            btn.title = 'Clear point';
            btn.setAttribute('aria-label', 'Clear point');
            btn.onclick = () => env.widgetDef.clear?.();
            const ic = u.svg(
              'svg',
              {
                width: 34,
                height: 44,
                viewBox: '0 0 24 32',
                fill: '#fff',
                stroke: '#080f18',
                'stroke-width': 1.8,
                'shape-rendering': 'crispEdges',
              },
              btn,
            );
            u.svg(
              'path',
              {
                d: 'M3 2V26L9 20H11V23H13V27H15V31H19V28H17V24H15V20H22V18H20V16H18V14H16V12H14V10H12V8H10V6H8V4H6V2Z',
              },
              ic,
            );
            const hint = u.el('div', 'pc-hint', left);
            u.el('span', 'pc-hint-copy', hint, 'Click on\nthe diagram\nto place\na point.');
            const roomy = (ctx.size?.width || window.innerWidth) >= 1180;
            let display = ctx.display || 'header';
            if (display === 'panel' && !roomy) display = 'header';
            if (display === 'toast' && (ctx.size?.height || window.innerHeight) < 680) display = 'header';
            const note = u.el(
              'section',
              'task-note',
              display === 'panel' ? right : display === 'toast' ? left : content,
            );
            u.el('div', 'note-label', note, display === 'panel' ? 'Instructions' : '');
            u.el('div', 'instruction', note, ctx.instruction);
            if (display === 'hidden') note.hidden = true;
            else if (display === 'toast') {
              note.classList.add('instruction-toast');
              const x = u.el('button', 'note-close', note, '×');
              x.type = 'button';
              x.onclick = () => (note.style.visibility = 'hidden');
            } else if (display === 'panel') note.classList.add('instruction-panel');
            const stage = u.el('main', 'stage', content);
            stage.dataset.role = 'stage';
            const tb = box(right, 'Task', 'pc-task');
            u.el('p', '', tb, 'Find the angle bisector.');
            const lg = box(right, 'Legend', 'pc-legend');
            const row = (sym, txt) => {
              const r = u.el('div', 'pc-lrow', lg);
              const s = u.el('span', 'pc-sym', r);
              if (sym === 'dot') s.innerHTML = '<i class="d"></i>';
              else if (sym === 'line') s.innerHTML = '<i class="l"></i>';
              else s.innerHTML = '<i class="t"></i>';
              u.el('span', '', r, txt);
            };
            row('dot', '= labeled point');
            row('line', '= ray (extends\n  in one direction)');
            row('dots', '= exclusion circle\n  (do not click inside)');
            let submit = null;
            if (!ctx.finish) {
              const endRng = ctx.rng.fork('chrome/end'),
                collideRng = ctx.rng.fork('chrome/collide'),
                bank = ctx.content?.END_LABELS || [
                  'Submit',
                  'Done',
                  'Finish',
                  'Continue',
                  'Save',
                  'OK',
                  'Confirm',
                  'Apply',
                  '✓',
                ],
                labelOf = (x) => (typeof x === 'string' ? x : x?.label || x?.text || x?.name || String(x));
              let label = endRng.bool(0.5) ? 'Submit' : labelOf(endRng.pick(bank)),
                placement = endRng.pick(['right', 'right', 'right', 'header', 'left']);
              const collides = collideRng.bool(0.3),
                choices = [
                  ...new Set(bank.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
                ],
                collision = collides && choices.length ? collideRng.pick(choices) : null;
              const endButton = (parent, cls, text) => {
                const b = u.el('button', 'submit ' + cls, parent, text);
                b.type = 'button';
                b.dataset.role = 'submit';
                b.setAttribute('aria-label', label);
                b.title = label;
                b.onclick = () => ctx.submit();
                return b;
              };
              if (placement === 'right') {
                const sp = u.el('div', 'pc-sub', right);
                submit = endButton(sp, 'pc-submit', label);
              } else if (placement === 'header') {
                submit = endButton(top, 'pc-header-submit', label);
              } else {
                const dock = u.el('div', 'pc-left-end', left);
                submit = endButton(dock, 'pc-link-submit', label);
              }
              const decoy = (parent, text, collide) => {
                const b = u.el('button', 'pc-xtra', parent, text);
                b.type = 'button';
                b.dataset.role = 'xtra';
                b.onclick = () => env.log('decoy', collide ? { label: text, collide: true } : { label: text });
              };
              if (collision) decoy(top, collision, true);
            }
            return { stage, submit };
          },
      },
    },
  });
})();
