(function () {
  'use strict';
  const cfg = {
    title: 'Widget Playground',
    sub: 'Explore the different form controls below.',
    obstacle: 'Welcome!',
    copy: 'This short tour will show you around the interface.',
    dismiss: 'Skip tour',
  };
  const fallbackEnds = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', '✓'];
  const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
  env.site({
    name: 'design-click-control-widget-06',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref devdark';
      const shell = u.el('main', 'shell', document.body),
        main = u.el('div', 'dv-main', shell),
        head = u.el('header', 'dv-head', main);
      const logo = u.el('span', 'dv-logo', head);
      logo.innerHTML =
        '<svg viewBox="0 0 40 24" width="40" height="24"><path d="M3 3l9 8-9 8" fill="none" stroke="#7ee02b" stroke-width="3"/><path d="M22 20h14" stroke="#7ee02b" stroke-width="3"/></svg>';
      const ht = u.el('div', 'dv-ht', head);
      u.el('div', 'dv-title', ht, cfg.title);
      u.el('div', 'dv-sub', ht, cfg.sub);
      const stage = u.el('div', 'stage', main),
        aside = u.el('aside', 'dv-side', shell);
      const display = ctx.display || 'header';
      if (display !== 'hidden') u.el('div', 'dv-tasklabel', aside, 'TASK');
      const note = u.el('div', 'instruction', aside, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'hidden' || display === 'header' || display === 'toast';
      if (display === 'panel') note.hidden = false;
      if (display === 'header') {
        const headerNote = u.el('div', 'dv-header-note', aside, ctx.instruction);
        headerNote.dataset.role = 'instruction';
      } else if (display === 'toast') {
        const toast = u.el('div', 'dv-toast', aside, ctx.instruction);
        toast.dataset.role = 'instruction';
      }
      u.el('p', 'dv-hint', aside, 'Use the interface on the left to complete the task.');

      const er = ctx.rng.fork('chrome/end');
      const endPool =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : fallbackEnds;
      const referenceEnd = er.bool(0.5);
      const label = referenceEnd ? 'Submit' : labelOf(er.pick(endPool));
      const sampledPlacement = er.pick(['side', 'side', 'head', 'foot']);
      const placement = referenceEnd
        ? 'side'
        : sampledPlacement === 'side'
          ? ctx.rng.fork('chrome/end/alternate').pick(['head', 'foot'])
          : sampledPlacement;
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(0.3)) {
        const options = [...new Set(endPool.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (options.length) collide = labelOf(cr.pick(options));
      }
      const decoy = (parent, text) => {
        const b = u.el('button', 'dv-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      let submit = null;
      if (!ctx.finish) {
        let parent = aside,
          cls = 'submit';
        if (placement === 'head') {
          parent = head;
          cls = 'dv-head-submit';
        }
        if (placement === 'foot') {
          parent = u.el('footer', 'dv-foot', main);
          u.el('span', 'dv-foot-copy', parent, 'Workspace · all changes saved');
          cls = 'dv-foot-submit';
        }
        if (collide) decoy(placement === 'head' ? head : aside, collide);
        submit = u.el('button', cls, parent, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', ctx.submit);
      } else if (collide) decoy(head, collide);
      return { stage, submit: ctx.finish ? null : submit };
    },
    overlay(ctx) {
      if (ctx.kind === 'chat') {
        const old = document.querySelector('.design-obstacle');
        if (old) old.hidden = true;
        const el = ctx.util.el('section', 'perturb chat tour-overlay', document.body);
        ctx.util.el('h2', '', el, cfg.obstacle);
        ctx.util.el('p', '', el, cfg.copy);
        const dismiss = ctx.util.el('button', 'dismiss-design', el, cfg.dismiss);
        dismiss.type = 'button';
        dismiss.addEventListener('click', ctx.dismiss);
        return { el, dismiss };
      }
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
