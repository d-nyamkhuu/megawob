(function () {
  'use strict';
  env.site({
    name: 'design-pick-color-swatch-07',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'design colormatch';
      const shell = u.el('div', 'shell', document.body);
      const title = u.el('header', 'title-bar', shell);
      u.el('div', 'app-icon', title, '▣');
      const t = u.el('div', 'title', title);
      t.innerHTML = 'ColorMatch 1.2.0 &nbsp;- &nbsp;Display Calibration Utility';
      const controls = u.el('div', 'window-controls', title);
      for (const [label, name] of [
        ['_', 'Minimize'],
        ['□', 'Maximize'],
        ['×', 'Close'],
      ]) {
        const b = u.el('button', 'window-button', controls, label);
        b.type = 'button';
        b.setAttribute('aria-label', name);
        b.onclick = () => env.log('window-control', { name });
      }
      const endRng = ctx.rng.fork('chrome/end');
      const endWords = Array.isArray(ctx.content && ctx.content.END_LABELS)
        ? ctx.content.END_LABELS
        : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const wordLabel = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const labels = [...new Set(endWords.map(wordLabel).filter(Boolean))];
      if (!labels.some((x) => x.toLowerCase() === 'submit')) labels.unshift('Submit');
      const alternatives = labels.filter((x) => x.toLowerCase() !== 'submit');
      const label = endRng.bool(0.75) ? 'Submit' : endRng.pick(alternatives.length ? alternatives : ['Done']);
      const placement = ctx.finish
        ? null
        : endRng.pick(['controls', 'controls', 'controls', 'controls', 'title', 'status']);
      const menu = u.el('nav', 'menu-bar', shell);
      for (const label of ['File', 'Edit', 'Tools', 'Help']) {
        const b = u.el('button', 'menu-item', menu);
        b.type = 'button';
        b.onclick = () => env.log('menu', { label });
        u.el('u', '', b, label[0]);
        b.append(label.slice(1));
      }
      const body = u.el('div', 'body', shell);
      const left = u.el('div', 'left-col', body);
      const note = ctx.display === 'hidden' ? null : u.el('section', 'task-note display-' + ctx.display, left);
      if (note) {
        const instruction = u.el('div', 'instruction', note, ctx.instruction);
        if (ctx.instruction.length > 55) instruction.classList.add('long-instruction');
        if (ctx.display === 'toast') {
          const b = u.el('button', 'note-close', note, '×');
          b.type = 'button';
          b.setAttribute('aria-label', 'Close notice');
          b.onclick = () => {
            note.hidden = true;
          };
        }
      }
      const stage = u.el('main', 'stage', left);
      stage.dataset.role = 'stage';

      const right = u.el('aside', 'right-col', body);
      u.el('div', 'rp-head', right, 'Preview');
      const prev = u.el('div', 'prev-row', right);
      for (const k of ['target', 'current']) {
        const blk = u.el('div', 'prev-blk', prev);
        const lab = u.el('div', 'prev-label', blk, k === 'target' ? 'Target' : 'Current');
        lab.dataset.role = 'prev-' + k + '-label';
        u.el('div', 'prev-swatch', blk).dataset.role = 'prev-' + k;
      }
      const diff = u.el('section', 'diff-box', right);
      u.el('div', 'diff-title', diff, 'Color Difference (display only)');
      const dv = u.el('div', 'diff-value', diff);
      u.el('span', 'diff-key', dv, 'ΔE00');
      const delta = u.el('span', 'diff-num', dv, '—');
      delta.dataset.role = 'color-difference';
      u.el('div', 'rp-head ctl-head', right, 'Controls');
      const rows = u.el('div', 'ctl-rows', right);
      const r1 = u.el('div', 'ctl-row one', rows);
      const r2 = u.el('div', 'ctl-row two', rows);
      for (const [p, label] of [
        [r1, 'Reset'],
        [r2, 'Randomize Current'],
        [r2, 'Copy Current Hex'],
      ]) {
        const b = u.el('button', 'push', p, label);
        b.type = 'button';
        b.dataset.action = label;
      }
      let submit = null;
      const footer = u.el('footer', 'status-bar', shell);
      u.el('span', 'st-ready', footer, 'Ready');
      u.el('span', 'st-info', footer, 'sRGB  |  Display: Generic LCD  |  1920 × 1080');
      const endButton = (parent, cls) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.onclick = () => ctx.submit();
        submit = b;
      };
      if (!ctx.finish && placement === 'title') endButton(controls, 'end-title');
      if (!ctx.finish && placement === 'status') endButton(footer, 'end-status');
      if (!ctx.finish && placement === 'controls') {
        submit = u.el('button', 'submit', right, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.onclick = () => ctx.submit();
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const collidePool = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (collidePool.length) {
          const decoyLabel = collideRng.pick(collidePool);
          const decoy = u.el('button', 'end-xtra', footer, decoyLabel);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.onclick = () => env.log('decoy', { label: decoyLabel, collide: true });
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
          toast: 'The calibration utility is ready.',
          chat: 'Adjust the hue and saturation/value controls to match the target.',
          promo: 'Review the display profile before calibration.',
          banner: 'The display is using the Generic LCD profile.',
        }[kind],
      );
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Use default settings' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
