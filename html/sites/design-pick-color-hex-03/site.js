(function () {
  'use strict';
  env.site({
    name: 'design-pick-color-hex-03',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'design bauhaus';
      const shell = u.el('div', 'shell', document.body);
      // New frame choices use independent streams; preserve the widget's seeded draws.
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = endRng.bool(0.5);
      const placement = referenceEnd ? 'footer' : endRng.pick(['header', 'link']);
      const endLabel = referenceEnd ? 'Submit' : endRng.pick(labels);
      let display = ctx.display;
      if (display === 'panel' && (shell.clientWidth < 1200 || shell.clientHeight < 800)) display = 'header';
      if (display === 'toast' && shell.clientHeight < 700) display = 'header';
      const top = u.el('header', 'top-bar', shell);
      u.el('div', 'dot', top);
      u.el('div', 'brand', top, 'COLOR TOOL');
      const sep = u.el('div', 'sep', top);
      const note = u.el('section', 'task-note', top);
      const instruction = u.el('div', 'instruction', note);
      String(ctx.instruction)
        .split(/(#[0-9a-fA-F]{6})/)
        .forEach((part, i) => {
          if (i % 2) u.el('span', 'hl', instruction, part);
          else instruction.append(part);
        });
      if (display === 'hidden' || display === 'panel') {
        note.hidden = display === 'hidden';
        sep.hidden = true;
      }
      if (display === 'panel') note.classList.add('instruction-panel');
      if (display === 'toast') {
        note.classList.add('instruction-toast');
        const b = u.el('button', 'note-close', note, '×');
        b.type = 'button';
        b.setAttribute('aria-label', 'Dismiss instruction');
        b.onclick = () => {
          instruction.style.visibility = 'hidden';
          b.hidden = true;
        };
      }
      const headerTools = u.el('div', 'header-tools', top);
      const workspace = u.el('div', 'workspace', shell);
      const stage = u.el('main', 'stage', workspace);
      stage.dataset.role = 'stage';
      if (display === 'panel') {
        workspace.classList.add('with-panel');
        workspace.append(note);
        const heading = u.el('div', 'note-heading', note, 'Target instruction');
        note.prepend(heading);
      }
      const footer = u.el('footer', 'footer', shell);
      u.el('div', 'hint', footer, 'Adjust the color using the picker. Match the target color.');
      const delta = u.el('div', 'difference-value', footer, '—');
      delta.dataset.role = 'color-difference';
      const action = u.el('div', 'actions', footer);
      const reset = u.el('button', 'btn reset', action, 'Reset');
      reset.type = 'button';
      reset.onclick = () => {
        env.log('reset', {});
        document.dispatchEvent(new Event('cp-reset'));
      };
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const alternatives = labels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (alternatives.length) {
          const label = collideRng.pick(alternatives);
          const decoy = u.el('button', 'btn reset xtra', action, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.onclick = () => env.log('decoy', { label, collide: true });
        }
      }
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'header' ? headerTools : action;
        submit = u.el('button', 'btn submit' + (placement === 'link' ? ' end-link' : ''), parent, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.dataset.placement = placement;
        submit.onclick = () => ctx.submit();
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
