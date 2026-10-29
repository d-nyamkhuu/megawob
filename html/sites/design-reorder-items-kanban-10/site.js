(function () {
  'use strict';
  env.site({
    name: 'design-reorder-items-kanban-10',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const placement = endRng.pick(['footer', 'toolbar', 'footer', 'link']);
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const endLabel =
        placement === 'footer'
          ? endLabels.find((label) => label === 'Submit') || endRng.pick(endLabels)
          : endRng.pick(endLabels);
      const collideRng = ctx.rng.fork('chrome/collide');
      const collideLabels = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collide = collideRng.bool(0.3) && collideLabels.length ? collideRng.pick(collideLabels) : null;
      document.body.className = 'design precision';
      const shell = u.el('div', 'shell', document.body);
      const bar = u.el('div', 'titlebar', shell);
      const menu = u.el('span', 'tb-menu', bar);
      menu.innerHTML =
        '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M15 2H3L1 4v1M2 8h13M1 11v1l2 2h12" fill="none" stroke="#e8e0ee" stroke-width="1.2"/></svg>';
      u.el('span', 'tb-title', bar, 'Card Sort');
      const ctl = u.el('span', 'tb-ctl', bar);
      ctl.innerHTML =
        '<svg viewBox="0 0 16 16" width="16" height="16"><path d="M2 8h12" stroke="#e8e0ee"/></svg><svg viewBox="0 0 16 16" width="16" height="16"><rect x="2.5" y="2.5" width="11" height="11" fill="none" stroke="#e8e0ee"/></svg><svg viewBox="0 0 16 16" width="16" height="16"><path d="M2 2l12 12M14 2L2 14" stroke="#e8e0ee"/></svg>';
      const page = u.el('div', 'page', shell);
      const note = u.el('header', 'task-note', page);
      u.el('div', 'instruction', note, ctx.instruction);
      const side = u.el('div', 'note-side', note);
      u.el('span', 'note-count', side, 'cards');
      u.el('span', 'note-hint', side, 'Drag the cards into the correct columns below.');
      if (ctx.display === 'hidden') note.hidden = true;
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        const close = u.el('button', 'note-close', note, '×');
        close.type = 'button';
        close.onclick = () => {
          note.style.visibility = 'hidden';
        };
      }
      const stage = u.el('main', 'stage', page);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', page);
      const reset = u.el('button', 'reset', footer);
      reset.type = 'button';
      reset.innerHTML =
        '<svg viewBox="0 0 20 20" width="22" height="22"><path d="M4 10a6 6 0 1 0 2-4.5M4 3v3.5h3.5" fill="none" stroke="#f1eaf5" stroke-width="1.5"/></svg><span>Reset</span>';
      reset.onclick = () => env.log('reset-click', {});
      if (collide) {
        const decoy = u.el('button', 'end-xtra', footer, collide);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', { label: collide, collide: true });
      }
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? bar : footer;
        const cls =
          placement === 'toolbar' ? 'submit submit-toolbar' : placement === 'link' ? 'submit submit-link' : 'submit';
        submit = u.el('button', cls, parent, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.onclick = () => ctx.submit();
        if (placement === 'toolbar') bar.insertBefore(submit, ctl);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'obstruction obstruction-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const titles = {
        cookie: 'Privacy notice',
        toast: 'Changes saved',
        chat: 'Help',
        promo: 'News',
        banner: 'Notice',
      };
      u.el('h3', '', box, titles[ctx.kind] || 'Notice');
      u.el(
        'p',
        '',
        box,
        ctx.kind === 'cookie'
          ? 'Allow optional cookies for this page?'
          : 'You can close this note to return to the activity.',
      );
      const dismiss = u.el('button', 'dismiss', box, ctx.kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
    },
  });
})();
