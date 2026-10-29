(function () {
  'use strict';
  env.site({
    name: 'design-click-control-collapsible-09',
    styles: ['site.css', 'site2.css'],
    frame(ctx) {
      const u = ctx.util;
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endRng = ctx.rng.fork('chrome/end');
      const placement = endRng.pick(['panel', 'panel', 'header', 'link']);
      const endLabel = placement === 'panel' ? 'Submit' : labelOf(endRng.pick(labels));
      const collideRng = ctx.rng.fork('chrome/collide');
      const collide = collideRng.bool(0.3);
      const collidePool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collideLabel = collide && collidePool.length ? labelOf(collideRng.pick(collidePool)) : null;
      document.body.className = 'ref neu';
      const shell = u.el('main', 'shell', document.body);
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      u.el('h1', 'nm-title', center, 'Project Details');
      u.el('p', 'nm-sub', center, 'Review the sections below. Click a section to expand and view its contents.');
      const stage = u.el('div', 'stage', center);
      const aside = u.el('aside', 'inspector', work);
      u.el('h2', 'nm-task', aside, 'Task');
      const note = u.el('div', 'instruction', aside, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
      }
      if (collideLabel) {
        const decoy = u.el('button', 'xtra', aside, collideLabel);
        decoy.type = 'button';
        decoy.addEventListener('click', () => env.log('decoy', { label: collideLabel, collide: true }));
      }
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'header' ? center : aside;
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'submit ' + (placement === 'header' ? 'submit-header' : placement === 'link' ? 'submit-link' : ''),
          parent,
          placement === 'link' ? endLabel + ' ›' : endLabel,
        );
        submit.type = 'button';
        if (placement === 'link') {
          submit.href = '#';
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        } else submit.addEventListener('click', ctx.submit);
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
