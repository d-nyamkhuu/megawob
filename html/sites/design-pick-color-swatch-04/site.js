(function () {
  'use strict';
  const ICONS = {
    Pick: '<svg viewBox="0 0 40 40"><path d="M4 35l2-8 16-16 7 7-16 16z" fill="none" stroke="#111" stroke-width="3" stroke-linejoin="round"/><path d="M17 9l14 14M24 12l7-7a5 5 0 0 1 7 7l-7 7z" fill="#111" stroke="#111" stroke-width="3" stroke-linecap="round"/></svg>',
    Adjust:
      '<svg viewBox="0 0 40 40"><path d="M4 9h32M4 21h32M4 32h32" stroke="#111" stroke-width="3" stroke-linecap="round"/><circle cx="17" cy="9" r="4.5" fill="#111"/><circle cx="27" cy="21" r="4.5" fill="#111"/><circle cx="16" cy="32" r="4.5" fill="#111"/></svg>',
    View: '<svg viewBox="0 0 40 40"><rect x="6" y="6" width="28" height="28" fill="none" stroke="#111" stroke-width="3"/><path d="M6 15h28M6 25h28M15 6v28M25 6v28" stroke="#111" stroke-width="2.5"/></svg>',
    Reset:
      '<svg viewBox="0 0 40 40"><path d="M7 15a15 15 0 1 1 1 13" fill="none" stroke="#111" stroke-width="3.5" stroke-linecap="round"/><path d="M3 12l4 4 5-4" fill="none" stroke="#111" stroke-width="3" stroke-linejoin="round"/></svg>',
  };
  env.site({
    name: 'design-pick-color-swatch-04',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const collideRng = ctx.rng.fork('chrome/collide');
      document.body.className = 'design laboratory';
      const shell = u.el('div', 'shell', document.body);
      const ribbon = u.el('header', 'ribbon', shell);
      const brand = u.el('div', 'brand', ribbon);
      u.el('div', 'brand-name', brand, 'COLOR MATCH');
      u.el('div', 'brand-sub', brand, 'PICK · ADJUST · MATCH');
      u.el('div', 'rule', ribbon);
      for (const label of ['Pick', 'Adjust', 'View', 'Reset']) {
        const b = u.el('button', 'tool' + (label === 'Pick' ? ' on' : ''), ribbon);
        b.type = 'button';
        const ic = u.el('span', 'tool-ic', b);
        ic.innerHTML = ICONS[label];
        u.el('span', 'tool-name', b, label);
        b.onclick = () => env.log('menu', { label });
      }
      u.el('div', 'rule', ribbon);
      const mode = u.el('div', 'mode', ribbon);
      u.el('div', 'mode-title', mode, 'Mode');
      const mb = u.el('div', 'mode-btns', mode);
      for (const label of ['RGB', 'HSL', 'HEX']) {
        const b = u.el('button', 'mode-btn' + (label === 'RGB' ? ' on' : ''), mb, label);
        b.type = 'button';
        b.onclick = () => env.log('mode', { label });
      }
      const note = u.el('section', 'task-note', shell);
      let display = ctx.display || 'header';
      if (display === 'panel') note.classList.add('instruction-panel');
      if (display === 'toast') note.classList.add('instruction-toast');
      if (display === 'hidden') {
        note.hidden = true;
        shell.classList.add('instruction-hidden');
      }
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      instruction.style.fontSize = Math.min(2.85, 154 / Math.max(1, ctx.instruction.length)) + 'cqw';
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
      const hint = u.el('div', 'hint', footer);
      const ic = u.el('span', 'hint-ic', hint);
      ic.innerHTML =
        '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="13" fill="none" stroke="#111" stroke-width="2"/><circle cx="20" cy="20" r="6" fill="none" stroke="#111" stroke-width="2"/><path d="M20 1v13M20 26v13M1 20h13M26 20h13" stroke="#111" stroke-width="2.5" stroke-linecap="round"/></svg>';
      u.el('span', 'hint-text', hint, 'Adjust the picker until the Current swatch matches the Target (ΔE00 ≤ 4).');
      u.el('div', 'rule', footer);
      const difference = u.el('section', 'difference-section', footer);
      u.el('div', 'diff-label', difference, 'ΔE00 (preview)');
      const delta = u.el('div', 'difference-value', difference, '—');
      delta.dataset.role = 'color-difference';
      let submit = null;
      if (!ctx.finish) {
        const action = u.el('div', 'action-section', footer);
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
        ).map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)));
        const baseline = endRng.bool(0.5);
        const label = baseline ? 'Submit' : endRng.pick(labels);
        const placement = baseline ? 'button' : endRng.pick(['link', 'icon']);
        const endText = placement === 'icon' ? '✓' : placement === 'link' ? `${label} ›` : label;
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'submit' + (placement === 'link' ? ' end-link' : placement === 'icon' ? ' end-icon' : ''),
          action,
          endText,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };

        const collision = collideRng.bool(0.3);
        if (collision && labels.length > 1) {
          const choices = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (choices.length) {
            const decoyLabel = collideRng.pick(choices);
            const decoy = u.el('button', 'end-xtra', action, decoyLabel);
            action.classList.add('has-xtra');
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
