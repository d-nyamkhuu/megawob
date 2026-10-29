(function () {
  'use strict';
  env.site({
    name: 'design-pick-color-swatch-08',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'design material';
      const shell = u.el('div', 'shell', document.body);
      const note = u.el('section', 'task-note', shell);
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      const doc = u.el('div', 'doc', shell);
      const bar = u.el('header', 'app-bar', doc);
      u.el('div', 'app-title', bar, 'Color Matcher');
      u.el('div', 'app-hint', bar, 'Match the color to proceed');
      const display = ctx.display || 'header';
      shell.classList.add('display-' + display);
      if (display === 'header') {
        note.classList.add('instruction-header');
      } else if (display === 'hidden') {
        note.hidden = true;
      } else if (display === 'panel') {
        note.classList.add('instruction-panel');
      } else if (display === 'toast') {
        note.classList.add('instruction-toast');
        const b = u.el('button', 'note-close', note, '×');
        b.type = 'button';
        b.setAttribute('aria-label', 'Close');
        b.onclick = () => {
          note.hidden = true;
          env.log('note-close');
        };
      }
      const body = u.el('div', 'doc-body', doc);
      const stage = u.el('main', 'stage', body);
      stage.dataset.role = 'stage';
      const tools = u.el('aside', 'tools', body);
      u.el('div', 'tools-label', tools, 'Tools');
      u.el('div', 'tools-rule', tools);
      const t1 = u.el('div', 'tool-btn on', tools);
      t1.innerHTML =
        '<svg viewBox="0 0 24 24" width="100%" height="100%"><path fill="#3d55c0" d="M20.71 5.63l-2.34-2.34a1 1 0 0 0-1.41 0l-3.12 3.12-1.93-1.91-1.41 1.41 1.42 1.42L3 16.25V21h4.75l8.92-8.92 1.42 1.42 1.41-1.41-1.92-1.92 3.12-3.12a1 1 0 0 0 .01-1.42zM6.92 19L5 17.08l8.06-8.06 1.92 1.92L6.92 19z"/></svg>';
      const t2 = u.el('div', 'tool-btn', tools);
      t2.innerHTML =
        '<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="12" r="8.5" fill="none" stroke="#606977" stroke-width="2.4"/><circle cx="12" cy="12" r="4.4" fill="#606977"/><path d="M11 5h2v4h-2z" fill="#606977"/><circle cx="10.4" cy="9.2" r="1.2" fill="#f8f9fb"/></svg>';
      u.el('div', 'tools-rule two', tools);
      const t3 = u.el('div', 'tool-trash', tools);
      t3.innerHTML =
        '<svg viewBox="0 0 24 24" width="100%" height="100%"><path fill="#606977" d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>';
      const footer = u.el('footer', 'doc-footer', doc);
      const reset = u.el('button', 'reset', footer, 'Reset');
      reset.type = 'button';
      reset.onclick = () => env.log('reset-click', {});
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const placement = er.pick(['footer', 'footer', 'header', 'link']);
        const labels = ctx.content && ctx.content.END_LABELS;
        const pickedLabel = labels && labels.length ? er.pick(labels) : 'Submit';
        const label = er.bool(0.5)
          ? 'Submit'
          : typeof pickedLabel === 'string'
            ? pickedLabel
            : pickedLabel.label || pickedLabel.text || pickedLabel.name || 'Submit';
        const endButton = (parent, cls, text, icon) => {
          const b = u.el(icon ? 'button' : cls === 'submit-link' ? 'a' : 'button', cls, parent, text);
          b.type = 'button';
          if (icon)
            b.innerHTML =
              '<svg viewBox="0 0 24 24" width="100%" height="100%"><path fill="currentColor" d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>';
          if (cls === 'submit-link') b.href = '#';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.onclick = (e) => {
            e.preventDefault();
            ctx.submit();
          };
          return b;
        };
        if (placement === 'header') {
          const slot = u.el('div', 'header-actions', bar);
          submit = endButton(slot, 'submit header-submit', label);
        } else if (placement === 'link') {
          submit = endButton(footer, 'submit-link', label + ' ›');
        } else {
          submit = endButton(footer, 'submit', label);
        }
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const values =
            labels && labels.length
              ? labels
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
          const own = label.trim().toLowerCase();
          const choices = values
            .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name))
            .filter((x) => x && x.trim().toLowerCase() !== own);
          if (choices.length) {
            const decoyLabel = cr.pick(choices);
            const parent = placement === 'header' ? bar : footer;
            const decoy = u.el('button', 'end-xtra', parent, decoyLabel);
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
        {
          cookie: 'Console preferences',
          toast: 'Instrument notice',
          chat: 'Laboratory support',
          promo: 'Calibration reminder',
          banner: 'Workstation notice',
        }[kind],
      );
      u.el(
        'p',
        '',
        box,
        {
          cookie: 'Optional settings may be stored on this workstation.',
          toast: 'The calibration console is ready.',
          chat: 'Adjust the hue and saturation/value controls to match the target.',
          promo: 'Review the instrument profile before calibration.',
          banner: 'The instrument is operating with the Generic RGB profile.',
        }[kind],
      );
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Use default settings' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
