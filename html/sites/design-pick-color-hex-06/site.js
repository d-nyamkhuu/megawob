(function () {
  'use strict';
  env.site({
    name: 'design-pick-color-hex-06',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'design laboratory';
      const shell = u.el('div', 'shell', document.body);
      const title = u.el('header', 'title-bar', shell);
      const icon = u.el('div', 'app-icon', title, '');
      icon.innerHTML =
        '<svg viewBox="0 0 32 32" width="100%" height="100%"><defs><linearGradient id="paletteGold" x2="0" y2="1"><stop stop-color="#ffff8c"/><stop offset="1" stop-color="#ebbe25"/></linearGradient></defs><path d="M29 12C28 4 18 1 10 5S0 17 4 24s12 8 16 4c3-3-2-5 0-8s10-1 9-8Z" fill="url(#paletteGold)" stroke="#bd9b22"/><ellipse cx="7.5" cy="16" rx="3" ry="2.5" fill="#f33"/><ellipse cx="12" cy="8.5" rx="3" ry="2.3" fill="#31bb4e"/><ellipse cx="21" cy="8.5" rx="3" ry="2.3" fill="#339aff"/><ellipse cx="24" cy="14" rx="2.7" ry="2.3" fill="#f77521"/><ellipse cx="11" cy="24" rx="3" ry="2.5" fill="#466ddd"/><ellipse cx="17" cy="16.5" rx="2.7" ry="3.3" transform="rotate(25 17 16.5)" fill="#0761ea" stroke="#b7a72c"/></svg>';
      u.el('div', 'title', title, 'Color Picker');
      const controls = u.el('div', 'window-controls', title);
      for (const [label, name, cls] of [
        ['', 'Minimize', ' minimize'],
        ['', 'Maximize', ' maximize'],
        ['', 'Close', ' close'],
      ]) {
        const b = u.el('button', 'window-button' + cls, controls, label);
        b.type = 'button';
        b.setAttribute('aria-label', name);
        b.onclick = () => env.log('window-control', { name });
      }
      const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const endRng = ctx.rng.fork('chrome/end');
      const labels = (
        (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
        ]
      ).map(labelOf);
      const placement = ctx.finish ? null : endRng.pick(['footer', 'footer', 'footer', 'toolbar', 'link']);
      const endLabel = endRng.bool(0.5) ? 'Submit' : endRng.pick(labels);
      let submit = null;
      const collideRng = ctx.rng.fork('chrome/collide');
      const collidePool = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = !ctx.finish && collidePool.length && collideRng.bool(0.3) ? collideRng.pick(collidePool) : null;
      const collideButton = (parent) => {
        if (!collide) return null;
        const b = u.el('button', 'title-xtra', parent, collide);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
        return b;
      };
      const submitButton = (parent, cls, label) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = endLabel;
        b.setAttribute('aria-label', endLabel);
        b.onclick = () => ctx.submit();
        return b;
      };
      if (placement === 'toolbar') {
        submit = submitButton(title, 'toolbar-submit', endLabel);
        title.insertBefore(submit, controls);
      }
      const titleCollide = collideButton(title);
      if (titleCollide) title.insertBefore(titleCollide, controls);
      const note = u.el('section', 'task-note', shell);
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      let display = ctx.display || 'header';
      const size = ctx.size || {};
      if (
        (display === 'panel' && (size.width < 1180 || size.height < 700)) ||
        (display === 'toast' && size.height < 700)
      )
        display = 'header';
      if (display === 'hidden') {
        instruction.hidden = true;
        note.hidden = true;
      }
      if (display === 'panel') note.classList.add('instruction-panel');
      if (display === 'toast') {
        note.classList.add('instruction-toast');
        const b = u.el('button', 'note-close', note, '×');
        b.onclick = () => {
          instruction.style.visibility = 'hidden';
          b.hidden = true;
        };
      }
      const stage = u.el('main', 'stage', shell);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', shell);
      const action = u.el('div', 'action-section', footer);
      const reset = u.el('button', 'reset', action, 'Reset');
      reset.type = 'button';
      reset.onclick = () => env.log('reset-click');
      if (!ctx.finish) {
        if (placement === 'link') {
          submit = u.el('a', 'footer-submit-link', action, endLabel + ' ›');
          submit.href = '#';
          submit.dataset.role = 'submit';
          submit.title = endLabel;
          submit.setAttribute('aria-label', endLabel);
          submit.onclick = (e) => {
            e.preventDefault();
            ctx.submit();
          };
        } else if (placement === 'footer') {
          submit = submitButton(action, 'submit', endLabel);
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
