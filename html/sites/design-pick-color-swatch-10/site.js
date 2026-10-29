(function () {
  'use strict';
  env.site({
    name: 'design-pick-color-swatch-10',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'design lisa';
      const shell = u.el('div', 'shell', document.body);
      const menu = u.el('nav', 'menu-bar', shell);
      const icon = u.el('div', 'app-icon', menu);
      icon.innerHTML =
        '<svg viewBox="0 0 34 34" width="100%" height="100%"><rect x="5" y="2" width="24" height="19" fill="#f4f0e4" stroke="#111" stroke-width="2.5"/><rect x="9" y="6" width="16" height="11" fill="#cfcabb" stroke="#111" stroke-width="1.5"/><rect x="2" y="23" width="30" height="8" fill="#f4f0e4" stroke="#111" stroke-width="2.5"/><line x1="8" y1="27" x2="26" y2="27" stroke="#111" stroke-width="2"/></svg>';
      const menus = u.el('div', 'menus', menu);
      for (const label of ['File', 'Edit', 'Tools', 'Window', 'Help']) {
        const b = u.el('button', 'menu-item', menus, label);
        b.type = 'button';
        b.onclick = () => env.log('menu', { label });
      }
      const clock = u.el('div', 'clock', menu, 'Mon Apr 22, 1985   10:24 AM');

      const endRng = ctx.rng.fork('chrome/end');
      const endWords = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
        '✓',
      ];
      const wordOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const referenceEnd = endRng.bool(0.5);
      const label = referenceEnd ? 'Submit' : wordOf(endRng.pick(endWords));
      const placement = referenceEnd ? 'footer' : endRng.pick(['footer-link', 'menu']);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (collideRng.bool(0.3)) {
        const alternatives = [
          ...new Set(endWords.map(wordOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
        ];
        if (alternatives.length) collision = wordOf(collideRng.pick(alternatives));
      }
      const makeSubmit = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.onclick = () => ctx.submit();
        return b;
      };
      const makeDecoy = (parent, text) => {
        const b = u.el('button', 'chrome-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', { label: text, collide: true });
      };
      let submit = null;
      if (!ctx.finish && placement === 'menu') {
        if (collision) makeDecoy(menus, collision);
        submit = makeSubmit(menu, 'menu-end', label);
      } else if (collision) makeDecoy(menus, collision);
      menu.insertBefore(clock, menu.lastChild);

      const main = u.el('div', 'main', shell);
      const win = u.el('section', 'workbench', main);
      const tb = u.el('div', 'title-strip', win);
      u.el('span', 'close-box', tb);
      u.el('span', 'title-rule', tb);
      u.el('span', 'title', tb, 'Color Match');
      u.el('span', 'title-rule', tb);
      // Small workstations use the document header when a separate note cannot fit.
      let display = ctx.display;
      if (display === 'panel' && (shell.clientWidth < 1260 || shell.clientHeight < 760)) display = 'header';
      if (display === 'toast' && shell.clientHeight < 700) display = 'header';
      const note = u.el('section', 'task-note', win);
      note.classList.add('instruction-' + display);
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      if ((ctx.instruction || '').length > 50) instruction.classList.add('instruction-long');
      if (display === 'hidden') instruction.hidden = true;
      if (display === 'toast') {
        const b = u.el('button', 'note-close', note, '×');
        b.type = 'button';
        b.title = 'Dismiss note';
        b.setAttribute('aria-label', 'Dismiss note');
        b.onclick = () => {
          instruction.style.visibility = 'hidden';
          b.hidden = true;
        };
      }
      if (display === 'hidden' || display === 'panel') win.classList.add('instruction-hidden');
      const stage = u.el('main', 'stage', win);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', win);
      const reset = u.el('button', 'reset', footer, 'Reset');
      reset.type = 'button';
      reset.onclick = () => env.log('reset');
      if (!ctx.finish) {
        if (placement === 'footer-link') {
          const link = u.el('button', 'footer-link', footer, label + ' ›');
          link.type = 'button';
          link.dataset.role = 'submit';
          link.setAttribute('aria-label', label);
          link.title = label;
          link.onclick = () => ctx.submit();
          submit = link;
        } else if (placement === 'footer') submit = makeSubmit(footer, 'submit', label);
      }

      const insp = u.el('aside', 'inspector', main);
      u.el('div', 'insp-title', insp, 'Inspector');
      const pv = u.el('div', 'insp-sec', insp);
      u.el('div', 'insp-head', pv, 'Color Preview');
      const row1 = u.el('div', 'prev-row', pv);
      u.el('div', 'prev-sw', row1).dataset.role = 'insp-target';
      u.el('div', 'prev-label', row1, 'Target');
      const row2 = u.el('div', 'prev-row', pv);
      u.el('div', 'prev-sw', row2).dataset.role = 'insp-current';
      const l2 = u.el('div', 'prev-label', row2, 'Current');
      u.el('div', '', l2).dataset.role = 'insp-hex';
      const cv = u.el('div', 'insp-sec rule', insp);
      u.el('div', 'insp-head', cv, 'Current Values');
      const g1 = u.el('div', 'kv', cv);
      for (const k of ['H', 'S', 'V']) {
        u.el('span', '', g1, k + ':');
        u.el('span', '', g1).dataset.role = 'insp-' + k.toLowerCase();
      }
      const g2 = u.el('div', 'kv rule2', cv);
      for (const k of ['R', 'G', 'B']) {
        u.el('span', '', g2, k + ':');
        u.el('span', '', g2).dataset.role = 'insp-' + k.toLowerCase();
      }
      const df = u.el('div', 'insp-sec rule', insp);
      u.el('div', 'insp-head', df, 'Color Difference');
      const g3 = u.el('div', 'kv last', df);
      u.el('span', '', g3, 'ΔE00:');
      const delta = u.el('span', '', g3, '—');
      delta.dataset.role = 'color-difference';
      if (display === 'panel') {
        note.setAttribute('aria-label', 'Task note');
        insp.append(note);
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
        { cookie: 'Preferences', toast: 'Notice', chat: 'Help', promo: 'Reminder', banner: 'Workstation notice' }[kind],
      );
      u.el(
        'p',
        '',
        box,
        {
          cookie: 'Optional settings may be stored on this workstation.',
          toast: 'The color utility is ready.',
          chat: 'Adjust the hue and saturation/value controls to match the target.',
          promo: 'Review the color profile before matching.',
          banner: 'The workstation is using the default profile.',
        }[kind],
      );
      const dismiss = u.el('button', 'dismiss', box, kind === 'cookie' ? 'Use default settings' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
