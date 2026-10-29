(function () {
  'use strict';
  env.site({
    name: 'design-pick-color-swatch-09',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'design neumorphic';
      const shell = u.el('div', 'shell', document.body);
      const head = u.el('header', 'app-head', shell);
      const brand = u.el('div', 'brand', head);
      u.el('span', 'brand-dot', brand);
      u.el('span', 'brand-name', brand, 'Color Match');
      const tabs = u.el('nav', 'tabs', head);
      ['Tool', 'History', 'Settings'].forEach((label, i) => {
        const b = u.el('button', 'tab' + (i === 0 ? ' on' : ''), tabs, label);
        b.type = 'button';
        b.onclick = () => env.log('tab', { label });
      });
      const endRng = ctx.rng.fork('chrome/end');
      const endLabels = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
        'Complete',
        "I'm done",
      ];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const labelPool = endLabels.map(labelOf);
      const label = endRng.bool(0.5) ? 'Submit' : endRng.pick(labelPool.filter((x) => x.toLowerCase() !== 'submit'));
      const placement = endRng.pick(['footer', 'footer', 'footer', 'header', 'link', 'icon']);
      const collideRng = ctx.rng.fork('chrome/collide');
      const collide =
        !ctx.finish && collideRng.bool(0.3)
          ? collideRng.pick(labelPool.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase()))
          : null;
      const note = u.el('section', 'task-note', shell);
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      u.el('div', 'subtitle', note, 'Use the color picker to match the target color as closely as possible.');
      if (ctx.display === 'hidden') {
        instruction.hidden = true;
        note.querySelector('.subtitle').hidden = true;
      }
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const b = u.el('button', 'note-close', note, '×');
        b.setAttribute('aria-label', 'Close');
        b.onclick = () => {
          note.hidden = true;
        };
      }
      const headerActions = u.el('div', 'header-actions', head);
      if (collide && placement !== 'footer') {
        const d = u.el('button', 'header-xtra', headerActions, collide);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.onclick = () => env.log('decoy', { label: collide, collide: true });
      }
      let submit = null;
      const endButton = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.onclick = () => ctx.submit();
        return b;
      };
      if (!ctx.finish && placement === 'header') submit = endButton(headerActions, 'header-submit', label);
      if (!ctx.finish && placement === 'icon') submit = endButton(headerActions, 'header-submit header-icon', '✓');
      const stage = u.el('main', 'stage', shell);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', shell);
      const reset = u.el('button', 'reset', footer, 'Reset');
      reset.type = 'button';
      reset.onclick = () => env.log('reset');
      if (!ctx.finish && placement === 'footer') {
        submit = endButton(footer, 'submit', label);
      } else if (!ctx.finish && placement === 'link') {
        submit = u.el('button', 'footer-link', footer, `${label} ›`);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.onclick = () => ctx.submit();
      }
      if (collide && placement === 'footer') {
        const d = u.el('button', 'footer-xtra', footer, collide);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.onclick = () => env.log('decoy', { label: collide, collide: true });
      }
      const pal = u.el('aside', 'palette', document.body);
      const ph = u.el('div', 'pal-head', pal);
      u.el('span', '', ph, 'Saved Colors');
      u.el('span', 'pal-plus', ph, '+');
      const grid = u.el('div', 'pal-grid', pal);
      for (const c of ['#51ae58', '#3887fc', '#f9c33b', '#ff7568', '#8b3cce', '#43b4b9', '#c2ccda', '#424954']) {
        const s = u.el('button', 'pal-sw', grid);
        s.type = 'button';
        s.style.background = c;
        s.setAttribute('aria-label', 'Saved color');
        s.onclick = () => env.log('saved-color', { hex: c });
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
        { cookie: 'Preferences', toast: 'Notice', chat: 'Support', promo: 'Reminder', banner: 'Notice' }[kind],
      );
      u.el(
        'p',
        '',
        box,
        {
          cookie: 'Optional settings may be stored on this device.',
          toast: 'The color tool is ready.',
          chat: 'Adjust the hue and saturation/value controls to match the target.',
          promo: 'Review the saved colors before you start.',
          banner: 'Match the target color as closely as possible.',
        }[kind],
      );
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Use default settings' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
