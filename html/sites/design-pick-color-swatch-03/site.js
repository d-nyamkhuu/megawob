(function () {
  'use strict';
  const BAND = [
    '#112d40',
    '#194f75',
    '#216796',
    '#46a7c4',
    '#77d7c6',
    '#6ed067',
    '#348641',
    '#375c33',
    '#9e834e',
    '#a55f53',
    '#803552',
    '#904385',
    '#40315d',
  ];
  const BAND_W = [108, 100, 111, 118, 127, 129, 126, 120, 113, 106, 102, 97, 79];
  env.site({
    name: 'design-pick-color-swatch-03',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'design blueprint';
      const shell = u.el('div', 'shell', document.body);
      const display = ctx.display || 'header';
      shell.classList.add('display-' + display);
      const title = u.el('header', 'title-bar', shell);
      u.el('div', 'app-icon', title);
      u.el('div', 'title', title, 'Color Matcher');
      const controls = u.el('div', 'window-controls', title);
      for (const [label, name] of [
        ['—', 'Minimize'],
        ['☐', 'Maximize'],
        ['✕', 'Close'],
      ]) {
        const b = u.el('button', 'window-button', controls, label);
        b.type = 'button';
        b.setAttribute('aria-label', name);
        b.onclick = () => env.log('window-control', { name });
      }
      const menu = u.el('nav', 'menu-bar', shell);
      for (const label of ['File', 'Edit', 'View', 'Tools', 'Help']) {
        const b = u.el('button', 'menu-item', menu, label);
        b.type = 'button';
        b.onclick = () => env.log('menu', { label });
      }
      const src = u.el('section', 'source-row', shell);
      const srcMain = u.el('div', 'source-main', src);
      u.el('div', 'source-label', srcMain, 'Source Image (reference band)');
      const band = u.el('div', 'source-band', srcMain);
      BAND.forEach((c, i) => {
        const s = u.el('div', '', band);
        s.style.background = c;
        s.style.flex = BAND_W[i] + ' 1 0';
      });
      const info = u.el('div', 'source-info', src);
      u.el('div', '', info, 'W: 1200   H: 60');
      u.el('div', '', info, 'X: –     Y: –');
      u.el('div', '', info, 'RGB: –');
      const note = u.el('section', 'task-note', shell);
      note.classList.add('instruction-' + display);
      if (display === 'panel') u.el('div', 'note-heading', note, 'Task instruction');
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      instruction.style.fontSize = 'min(4.9cqh, ' + (154 / Math.max(1, ctx.instruction.length)).toFixed(3) + 'cqw)';
      if (display === 'hidden') note.style.visibility = 'hidden';
      if (display === 'toast') {
        const b = u.el('button', 'note-close', note, '×');
        b.onclick = () => {
          instruction.style.visibility = 'hidden';
          b.hidden = true;
        };
      }
      const stage = u.el('main', 'stage', shell);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', shell);
      const view = u.el('section', 'foot-sec view-sec', footer);
      u.el('div', 'foot-title', view, 'View Options');
      const checks = [
        ['Show crosshair', true],
        ['Show numeric readouts', false],
        ['Lock hue (H)', false],
      ];
      for (const [label, on] of checks) {
        const row = u.el('div', 'chk-row', view);
        const box = u.el('span', 'chk' + (on ? ' on' : ''), row, on ? '✓' : '');
        u.el('span', '', row, label);
        row.onclick = () => {
          /* decorative */
        };
      }
      const samp = u.el('section', 'foot-sec samp-sec', footer);
      u.el('div', 'foot-title', samp, 'Sampling');
      const pick = u.el('button', 'pick-btn', samp);
      pick.type = 'button';
      pick.innerHTML =
        '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M28 12l7 7 7-7a6 6 0 0 0-9-8z" fill="#cef2fc"/><path d="M23 13l12 12M27 18L9 36l-3 9 9-3 18-18" fill="none" stroke="#e0f5ff" stroke-width="3"/><path d="M10 36l5 6" stroke="#e0f5ff" stroke-width="2"/></svg><span>Pick from image</span>';
      pick.onclick = () => env.log('tool', { name: 'pick-from-image' });
      const act = u.el('div', 'foot-sec action-section', footer);
      const reset = u.el('button', 'reset', act, 'Reset');
      reset.type = 'button';
      reset.onclick = () => env.log('reset-decor', {});
      let submit = null;
      if (!ctx.finish) {
        const endRng = ctx.rng.fork('chrome/end');
        const choices =
          ctx.content && Array.isArray(ctx.content.END_LABELS)
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const label = endRng.bool(0.5) ? 'Submit' : labelOf(endRng.pick(choices));
        const placement = endRng.pick(['button', 'button', 'link', 'icon']);
        if (placement === 'link') {
          submit = u.el('a', 'submit submit-link', act, label + ' ›');
          submit.href = '#';
        } else {
          submit = u.el('button', 'submit' + (placement === 'icon' ? ' submit-icon' : ''), act);
          u.el('span', '', submit, placement === 'icon' ? '✓' : label);
          submit.type = 'button';
        }
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };

        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3)) {
          const norm = (x) => x.trim().toLowerCase();
          const pool = [...new Set(choices.map(labelOf))].filter((x) => norm(x) !== norm(label));
          if (pool.length) {
            const decoyLabel = labelOf(collideRng.pick(pool));
            const decoy = u.el('button', 'menu-item pq-xtra', menu, decoyLabel);
            decoy.type = 'button';
            decoy.dataset.role = 'xtra';
            decoy.onclick = () => env.log('decoy', { label: decoyLabel, collide: true });
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
      u.el(
        'h3',
        '',
        box,
        { cookie: 'Preferences', toast: 'Notice', chat: 'Support', promo: 'Reminder', banner: 'Workstation notice' }[
          kind
        ],
      );
      u.el(
        'p',
        '',
        box,
        {
          cookie: 'Optional settings may be stored on this workstation.',
          toast: 'The color matcher is ready.',
          chat: 'Adjust the hue and saturation/value controls to match the target.',
          promo: 'Review the source image before matching.',
          banner: 'The matcher is using the default display profile.',
        }[kind],
      );
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Use default settings' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
