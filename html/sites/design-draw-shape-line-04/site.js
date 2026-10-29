(function () {
  'use strict';
  env.site({
    name: 'design-draw-shape-line-04',
    styles: ['site.css', 'sketch.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className =
        'design sketch' +
        (ctx.display === 'toast' ? ' has-instruction-toast' : '') +
        (ctx.display === 'panel' ? ' has-instruction-panel' : '');
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: '#fff',
        panel: '#fff',
        fg: '#222a33',
        muted: '#5d6670',
        line: '#c3c8ce',
        accent: '#2563d6',
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', '"Helvetica Neue",Helvetica,Arial,sans-serif');
      const shell = u.el('div', 'sk-shell', body);
      const nav = u.el('header', 'sk-nav', shell);
      u.el('div', 'sk-brand', nav, 'Sketch Task');
      const links = u.el('nav', 'sk-links', nav);
      for (const t of ['Home', 'Tasks', 'Help']) {
        const a = u.el('a', 'sk-link' + (t === 'Tasks' ? ' active' : ''), links, t);
        a.href = '#';
        a.onclick = (ev) => ev.preventDefault();
      }
      const user = u.el('div', 'sk-user', nav, 'User');
      u.el('span', 'sk-caret', user);
      const content = u.el('div', 'sk-content', shell);
      const note = u.el('section', 'task-note sk-note', content);
      if (ctx.display === 'panel') u.el('div', 'sk-panel-title', note, 'Task instructions');
      u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      else if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close');
        x.onclick = () => (note.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const stage = u.el('main', 'stage', content);
      stage.dataset.role = 'stage';
      const dock = u.el('footer', 'sk-dock', shell);
      u.el('span', 'sk-toollabel', dock, 'Tool:');
      const pen = u.el('button', 'sk-btn sk-pen', dock);
      pen.type = 'button';
      pen.setAttribute('aria-pressed', 'true');
      const pi = u.svg('svg', { width: 36, height: 36, viewBox: '0 0 36 36' }, pen);
      u.svg('path', { d: 'M3 33l3-11 18-18q2-2 4 0l4 4q2 2 0 4L14 30z', fill: '#080b0d' }, pi);
      u.svg('path', { d: 'M6 22l8 8M21 7l8 8M9 23l13-13', fill: 'none', stroke: '#d3dce4', 'stroke-width': 1.5 }, pi);
      u.svg('path', { d: 'M4 32l3-8 5 5z', fill: '#d3dce4' }, pi);
      u.svg('path', { d: 'M4 32l1-4 3 3z', fill: '#080b0d' }, pi);
      u.el('span', '', pen, 'Freehand Pencil');
      const clr = u.el('button', 'sk-btn clear', dock);
      clr.type = 'button';
      const ei = u.svg('svg', { width: 36, height: 36, viewBox: '0 0 36 36' }, clr);
      u.svg('path', { d: 'M3 23L22 4q2-2 4 0l8 8q2 2 0 4L17 33H11z', fill: '#68727e' }, ei);
      u.svg('path', { d: 'M5 23l8-8 12 12-5 5h-8z', fill: '#f5f6f8' }, ei);
      u.el('span', '', clr, 'Clear');
      clr.onclick = () => {
        env.widgetDef.clear?.();
      };
      u.el('span', 'sk-sep', dock);
      const hint = u.el('div', 'sk-hint', dock);
      u.el('div', '', hint, 'Click and hold to draw.');
      u.el('div', '', hint, 'Draw one continuous line.');
      let submit = null;
      if (!ctx.finish) {
        const endRng = ctx.rng.fork('chrome/end'),
          labels = ctx.content.END_LABELS || [
            'Submit',
            'Done',
            'Finish',
            'Continue',
            'Save',
            'OK',
            'Confirm',
            'Apply',
            'Complete',
          ];
        const original = endRng.bool(0.5),
          placement = original ? 'dock' : endRng.pick(['header', 'link']);
        const alternates = labels.filter(
          (x) =>
            String(x.label || x.text || x.name || x)
              .trim()
              .toLowerCase() !== 'submit',
        );
        const chosen = original ? 'Submit' : endRng.pick(alternates.length ? alternates : labels),
          label = String(chosen.label || chosen.text || chosen.name || chosen);
        const makeEnd = (parent, cls, text, tag = 'button') => {
          const b = u.el(tag, cls, parent, text);
          if (tag === 'button') b.type = 'button';
          else b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.onclick = (ev) => {
            ev.preventDefault();
            ctx.submit();
          };
          return b;
        };
        if (placement === 'header') submit = makeEnd(nav, 'sk-end-head', label);
        else if (placement === 'link') submit = makeEnd(dock, 'sk-end-link', label, 'a');
        else submit = makeEnd(dock, 'submit', label);
      }
      if (!ctx.finish) {
        const collideRng = ctx.rng.fork('chrome/collide'),
          labels = ctx.content.END_LABELS || [
            'Submit',
            'Done',
            'Finish',
            'Continue',
            'Save',
            'OK',
            'Confirm',
            'Apply',
            'Complete',
          ];
        if (collideRng.bool(0.3)) {
          const own = submit.textContent.trim().toLowerCase(),
            options = [
              ...new Set(
                labels
                  .map((x) => String(x.label || x.text || x.name || x))
                  .filter((x) => x.trim().toLowerCase() !== own),
              ),
            ];
          if (options.length) {
            const d = u.el('button', 'sk-xtra', nav, String(collideRng.pick(options)));
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.onclick = () => env.log('decoy', { label: d.textContent, collide: true });
          }
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title = {
        cookie: 'Your privacy',
        toast: 'Changes saved',
        chat: 'Support',
        promo: 'Workspace update',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This application stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with this workspace?',
        promo: 'Explore the latest workspace features.',
        banner: 'You are viewing a shared workspace.',
      }[kind];
      const label = kind === 'cookie' ? 'Reject optional' : 'Close';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, label);
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
