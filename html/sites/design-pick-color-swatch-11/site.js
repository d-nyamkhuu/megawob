(function () {
  'use strict';
  const RW = 1672,
    RH = 941;
  // Position an element by reference-pixel box, as percentages of the shell.
  const pos = (el, x, y, w, h) => {
    el.style.left = (x / RW) * 100 + '%';
    el.style.top = (y / RH) * 100 + '%';
    el.style.width = (w / RW) * 100 + '%';
    el.style.height = (h / RH) * 100 + '%';
    return el;
  };
  env.site({
    name: 'design-pick-color-swatch-11',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'design platinum';
      const shell = u.el('div', 'shell', document.body);

      // Menu bar
      const menu = pos(u.el('nav', 'menu-bar', shell), 0, 0, 1672, 40);
      const apple = u.el('span', 'apple', menu);
      apple.innerHTML =
        '<svg viewBox="0 0 30 36" aria-hidden="true"><defs><linearGradient id="apple-metal" x2="0" y2="1"><stop stop-color="#e2edf3"/><stop offset="1" stop-color="#607b91"/></linearGradient></defs><path d="M16 9c-1-5 3-7 6-8 1 4-2 7-6 8Zm-1 3c-4-4-9-2-11 2-4 7 1 18 6 19 3 1 4-2 7-1 4 3 7-2 9-7-6-3-6-9-1-12-4-4-7-3-10-1Z" fill="url(#apple-metal)" stroke="#17212b" stroke-width="1.6"/></svg>';
      const menus = u.el('div', 'menus', menu);
      for (const label of ['File', 'Edit', 'View', 'Window', 'Help']) {
        const b = u.el('button', 'menu-item', menus, label);
        b.type = 'button';
        b.onclick = () => env.log('menu', { label });
      }
      u.el('div', 'clock', menu, '10:24 AM');
      const badge = u.el('div', 'app-badge', menu);
      badge.innerHTML =
        '<svg viewBox="0 0 32 36" aria-hidden="true"><path d="M8 2h16l6 6v22l-6 4H8l-6-4V8Z" fill="#e2e8ec" stroke="#202830" stroke-width="2"/><path d="M10 6h12l5 5v15l-5 5H10l-5-5V11Z" fill="#9e9bde" stroke="#36437d"/><path d="M11 10h10v15H11z" fill="#b5d4ef" stroke="#33448d"/><path d="m15 10 4 3-2 5 3 3-5 3-3-6Z" fill="#8175d4" stroke="#333e83"/></svg>';
      u.el('div', 'app-name', menu, 'Color Matcher');

      // Window frame + title bar
      pos(u.el('div', 'window', shell), 2, 42, 1668, 892);
      const title = pos(u.el('header', 'title-bar', shell), 12, 50, 1648, 40);
      u.el('div', 'close-box', title);
      u.el('div', 'title', title, 'Color Matcher');
      const zoom = u.el('div', 'zoom-dots', title);
      for (let i = 0; i < 3; i++) u.el('i', '', zoom);

      // Zones
      pos(u.el('div', 'zone', shell), 12, 92, 1280, 798);
      pos(u.el('div', 'status-strip', shell), 12, 893, 1648, 38);

      // Briefing zone
      const note = pos(u.el('section', 'task-note', shell), 34, 114, 1250, 194);
      u.el('div', 'brief-title', note, 'Match the Color');
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      u.el(
        'div',
        'brief-hint',
        note,
        'Adjust the color in the picker until the Current swatch matches the Target.',
      );
      const display = ctx.display || 'header';
      if (display === 'hidden') {
        instruction.hidden = true;
        note.classList.add('instruction-hidden');
      }
      if (display === 'panel') note.classList.add('instruction-panel');
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const b = u.el('button', 'note-close', note, '×');
        b.type = 'button';
        b.setAttribute('aria-label', 'Close instruction');
        b.onclick = () => {
          instruction.style.visibility = 'hidden';
          b.hidden = true;
        };
      }

      // Picker zone
      const head = pos(u.el('div', 'picker-head', shell), 34, 326, 1250, 44);
      u.el('span', '', head, 'Color Picker');
      const stage = pos(u.el('main', 'stage', shell), 36, 372, 1246, 498);
      stage.dataset.role = 'stage';

      // Feedback zone
      pos(u.el('section', 'feedback', shell), 1313, 103, 332, 777);
      const fbHead = pos(u.el('div', 'fb-head', shell), 1313, 103, 332, 44);
      u.el('span', '', fbHead, 'Feedback');
      pos(u.el('div', 'fb-label', shell, 'Color difference'), 1338, 190, 250, 30);
      pos(u.el('div', 'fb-label big', shell, 'ΔE00:'), 1338, 240, 100, 40);
      const delta = pos(u.el('div', 'difference-value', shell, '—'), 1435, 230, 182, 60);
      delta.dataset.role = 'color-difference';
      pos(u.el('div', 'fb-label small', shell, 'Goal: ≤ 4'), 1435, 302, 182, 28);
      pos(u.el('div', 'fb-rule', shell), 1333, 381, 293, 2);
      pos(u.el('div', 'fb-label', shell, 'Preview (side by side)'), 1338, 408, 280, 30);
      const pc = pos(u.el('div', 'preview-swatch', shell), 1344, 450, 129, 131);
      pc.dataset.role = 'preview-current';
      const pt = pos(u.el('div', 'preview-swatch', shell), 1488, 450, 129, 131);
      pt.dataset.role = 'preview-target';
      pos(u.el('div', 'fb-label small c', shell, 'Current'), 1344, 590, 129, 26);
      pos(u.el('div', 'fb-label small c', shell, 'Target'), 1488, 590, 129, 26);

      let submit = null;
      if (!ctx.finish) {
        const endRng = ctx.rng.fork('chrome/end');
        const classic = endRng.bool(0.5);
        const placement = classic ? 'feedback' : endRng.pick(['toolbar', 'status']);
        const words = ctx.content && ctx.content.END_LABELS;
        const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
        const label = classic
          ? 'Submit'
          : labelOf(
              endRng.pick(
                words && words.length
                  ? words
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'],
              ),
            );
        const makeButton = (cls, text, parent) => {
          const b = u.el('button', cls, parent, text);
          b.type = 'button';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', text);
          b.title = text;
          b.onclick = () => ctx.submit();
          return b;
        };
        if (placement === 'feedback') {
          submit = pos(makeButton('submit', label, shell), 1338, 766, 285, 73);
        } else if (placement === 'toolbar') {
          submit = pos(makeButton('submit end-toolbar', label, shell), 1085, 330, 185, 34);
        } else {
          submit = pos(makeButton('submit end-status', label, shell), 1450, 896, 190, 29);
        }

        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3)) {
          const pool = (
            words && words.length ? words : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
          ).map(labelOf);
          const options = [...new Set(pool)].filter((word) => word.trim().toLowerCase() !== label.trim().toLowerCase());
          if (options.length) {
            const decoyLabel = collideRng.pick(options);
            const decoy = pos(u.el('button', 'xtra-end', shell, decoyLabel), 875, 330, 155, 34);
            decoy.type = 'button';
            decoy.dataset.role = 'xtra';
            decoy.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
          }
        }
      }

      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      if (kind === 'chat') {
        const tour = pos(u.el('section', 'tour help-tour', document.body), 708, 104, 510, 196);
        tour.dataset.role = 'overlay';
        u.el('div', 'tour-tip', tour);
        u.el('div', 'tour-title', tour, 'Take a quick tour?');
        const x = u.el('button', 'tour-close', tour, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close tour');
        u.el('div', 'tour-copy', tour, 'We’ll highlight the main parts of Color Matcher in a few steps.');
        const start = u.el('button', 'tour-btn start', tour, 'Start tour');
        start.type = 'button';
        start.onclick = () => ctx.dismiss('start');
        const skip = u.el('button', 'tour-btn skip', tour, 'Skip tour');
        skip.type = 'button';
        skip.onclick = () => ctx.dismiss('skip');
        x.onclick = () => ctx.dismiss('close');
        return { el: tour, dismiss: skip, ttlSteps: 0 };
      }
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      u.el(
        'h3',
        '',
        box,
        { cookie: 'Preferences', toast: 'Notice', chat: 'Help', promo: 'Reminder', banner: 'System notice' }[kind],
      );
      u.el(
        'p',
        '',
        box,
        {
          cookie: 'Optional settings may be stored on this computer.',
          toast: 'Color Matcher is ready.',
          chat: 'Adjust the hue and saturation/value controls to match the target.',
          promo: 'Review the display profile before matching.',
          banner: 'Color Matcher is using the Generic RGB profile.',
        }[kind],
      );
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Use default settings' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
