// Design on templates/site/click-point-bisect-03.js: only what this site changed.
(function () {
  'use strict';
  env.site({
    name: 'design-click-point-center-05',
    styles: ['site.css'],
    scripts: [],
    template: 'site/click-point-bisect-03',
    design: {
      parts: {
        frame: (base, S) =>
          function (ctx) {
            const u = ctx.util,
              body = document.body;
            body.className = 'design mac' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
            const rs = document.documentElement.style;
            for (const [k, v] of Object.entries({
              bg: '#6a70b4',
              panel: '#ffffff',
              fg: '#1c1c1c',
              muted: '#555',
              line: '#8c8c8c',
              accent: '#222',
            }))
              rs.setProperty('--' + k, v);
            rs.setProperty('--font', 'Arial,Helvetica,sans-serif');
            const bar = u.el('div', 'mac-menubar', body);
            const ap = u.el('span', 'mac-apple', bar, '');
            ap.innerHTML =
              '<svg width="24" height="30" viewBox="0 0 24 30"><defs><linearGradient id="apple-metal" x2=".7" y2="1"><stop stop-color="#cbd0e4"/><stop offset="1" stop-color="#647396"/></linearGradient></defs><path d="M12 7c-3-3-8-1-9 3-2 6 2 15 6 16 2 0 2-1 3-1s2 1 4 1c3-1 5-5 6-8-5-2-5-7-1-9-2-3-6-4-9-2zM12 6c-1-3 1-5 5-5 0 3-2 5-5 5z" fill="url(#apple-metal)" stroke="#29324a" stroke-width="1.2"/></svg>';
            u.el('b', '', bar, 'Arc Center Finder');
            for (const m of ['File', 'Edit', 'View', 'Window', 'Help']) u.el('span', '', bar, m);
            u.el('span', 'mac-clock', bar, 'Mon 10:24 AM');
            const sp = u.el('span', 'mac-spk', bar);
            sp.innerHTML =
              '<svg width="22" height="20" viewBox="0 0 22 20"><path d="M2 7h4l5-4v14l-5-4H2z" fill="#fff" stroke="#222" stroke-width="1.4"/><path d="M14 6q3 4 0 8M17 3q5 7 0 14" fill="none" stroke="#222" stroke-width="1.3"/></svg>';
            const mkWin = (cls, title) => {
              const w = u.el('section', 'mac-win ' + cls, body),
                tb = u.el('div', 'mac-title', w);
              const lights = u.el('span', 'mac-lights', tb);
              for (let i = 0; i < 3; i++) u.el('i', '', lights);
              u.el('span', 'mac-ttl', tb, title);
              return w;
            };
            const win = mkWin('mac-main', 'Arc Center Finder'),
              ins = mkWin('mac-ins', 'Instructions');
            const endRng = ctx.rng.fork('chrome/end');
            let placement = 'footer',
              endLabel = 'Submit';
            if (!ctx.finish && !endRng.bool(0.5)) {
              placement = endRng.pick(['titlebar', 'link']);
              const labels = ctx.content && ctx.content.END_LABELS;
              if (Array.isArray(labels) && labels.length) {
                const item = endRng.pick(labels);
                endLabel = typeof item === 'string' ? item : item.label || item.text || item.name || String(item);
              }
            }
            const collideRng = ctx.rng.fork('chrome/collide');
            let collide = null;
            if (!ctx.finish && collideRng.bool(0.3)) {
              const labels = ctx.content && ctx.content.END_LABELS;
              const pool = Array.isArray(labels)
                ? labels.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
                : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
              const options = [...new Set(pool)].filter(
                (x) => String(x).trim().toLowerCase() !== endLabel.trim().toLowerCase(),
              );
              if (options.length)
                collide = { label: collideRng.pick(options), where: collideRng.pick(['titlebar', 'footer']) };
            }
            const decoyBtn = (parent, label, collides) => {
              const b = u.el('button', 'mac-btn mac-xtra', parent, label);
              b.type = 'button';
              b.dataset.role = 'xtra';
              b.addEventListener('click', () => env.log('decoy', collides ? { label, collide: true } : { label }));
              return b;
            };
            let submit = null;
            const addSubmit = (parent, cls, label) => {
              const b = u.el('button', 'mac-btn ' + cls, parent, label);
              b.type = 'button';
              b.dataset.role = 'submit';
              b.title = endLabel;
              b.setAttribute('aria-label', endLabel);
              b.onclick = () => ctx.submit();
              return b;
            };
            if (placement === 'titlebar' && !ctx.finish)
              submit = addSubmit(win.querySelector('.mac-title'), 'mac-title-submit', endLabel);
            const note = u.el('section', 'task-note mac-note', win);
            u.el('div', 'instruction', note, ctx.instruction);
            if (ctx.display === 'hidden' || ctx.display === 'panel') {
              note.hidden = true;
            } else if (ctx.display === 'toast') {
              note.classList.add('instruction-toast');
              const x = u.el('button', 'note-close', note, '×');
              x.onclick = () => (note.style.visibility = 'hidden');
            }
            const stage = u.el('main', 'stage', win);
            stage.dataset.role = 'stage';
            const foot = u.el('footer', 'mac-foot', win);
            u.el('div', 'mac-status', foot, 'Click in the drawing area to choose a point.');
            if (!ctx.finish && placement === 'footer') submit = addSubmit(foot, 'mac-default', endLabel);
            else if (!ctx.finish && placement === 'link') {
              const b = u.el('button', 'mac-endlink', foot, endLabel + ' ›');
              b.type = 'button';
              b.dataset.role = 'submit';
              b.title = endLabel;
              b.setAttribute('aria-label', endLabel);
              b.onclick = () => ctx.submit();
              submit = b;
            }
            if (collide && collide.where === 'footer') decoyBtn(foot, collide.label, true);
            const clr = u.el('button', 'mac-btn', foot, 'Clear');
            clr.type = 'button';
            clr.onclick = () => {
              env.widgetDef.clear?.();
            };
            const pane = u.el('div', 'mac-pane', ins);
            const panelInstruction = u.el('div', 'mac-ins-h', pane, ctx.instruction);
            if (ctx.display === 'hidden' || ctx.display === 'toast') panelInstruction.hidden = true;
            u.el('hr', '', pane);
            u.el('p', '', pane, 'Use the mouse pointer to click on the drawing area in the main window.');
            u.el('p', '', pane, 'The drawing is part of a circle.\nIts center is not marked.');
            if (!ctx.finish) u.el('p', '', pane, 'When you are ready, click ' + endLabel + '.');
            if (collide && collide.where === 'titlebar') decoyBtn(win.querySelector('.mac-title'), collide.label, true);
            const tr = u.el('div', 'mac-trash', body);
            tr.innerHTML =
              '<svg width="46" height="64" viewBox="0 0 46 64"><defs><linearGradient id="can-metal"><stop stop-color="#555"/><stop offset=".18" stop-color="#fafafa"/><stop offset=".5" stop-color="#aaa"/><stop offset=".75" stop-color="#ddd"/><stop offset="1" stop-color="#555"/></linearGradient><linearGradient id="can-lid" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#777"/></linearGradient></defs><ellipse cx="23" cy="59" rx="18" ry="3" fill="#28314d" opacity=".4"/><path d="M7 18l2 36q14 12 28 0l2-36" fill="url(#can-metal)" stroke="#333" stroke-width="1.5"/><path d="M11 25l1 27m4-25 1 28m5-27v29m5-29-1 29m6-30-1 28m5-29-1 26" fill="none" stroke="#666" stroke-width="2"/><path d="M13 25l1 28m5-26 1 28m5-27v28m6-29-1 27m5-28-1 26" fill="none" stroke="#eee"/><ellipse cx="23" cy="18" rx="19" ry="8" fill="#888" stroke="#333" stroke-width="1.5"/><ellipse cx="23" cy="15" rx="19" ry="8" fill="url(#can-lid)" stroke="#333" stroke-width="1.5"/><ellipse cx="23" cy="13" rx="15" ry="5" fill="none" stroke="#555"/><path d="M16 9l-1-4q5-6 11-2l4 4-3 3-5-5-4 2 2 2" fill="#ccc" stroke="#333" stroke-width="1.5"/><path d="M6 16q15 11 33 2" fill="none" stroke="#fff"/></svg>';
            u.el('span', '', tr, 'Trash');
            return { stage, submit };
          },
      },
    },
  });
})();
