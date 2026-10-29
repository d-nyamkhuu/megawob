(function () {
  'use strict';
  const TOOLS = [
    [
      'Print',
      '<path d="M6 8V1h12v7h-1.5V2.5h-9V8ZM2 8h20a1 1 0 0 1 1 1v10H18v4H6v-4H1V9a1 1 0 0 1 1-1Zm5.5 10v3.5h9V18Z" fill="currentColor" stroke="none"/>',
    ],
    ['Download', '<path d="M12 2v11m-4-4 4 4 4-4M3 15v6h18v-6" stroke-width="3"/>'],
    [
      'Share',
      '<circle cx="5" cy="12" r="4" fill="currentColor" stroke="none"/><circle cx="19" cy="4" r="4" fill="currentColor" stroke="none"/><circle cx="19" cy="20" r="4" fill="currentColor" stroke="none"/><path d="m7 11 9-5M7 13l9 5"/>',
    ],
  ];
  env.site({
    name: 'design-click-control-tab-10',
    styles: ['site.css', 't10.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref t10';
      const shell = u.el('main', 't10-shell', document.body);
      const left = u.el('section', 't10-left', shell);
      const note = u.el('div', 'instruction', left, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const endRng = ctx.rng.fork('chrome/end');
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endChoice = ctx.finish
        ? null
        : endRng.pick(['classic', 'classic', 'classic', 'classic', 'alternate', 'left-top', 'tools']);
      const alternateLabels = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== 'submit');
      const endLabel =
        endChoice === 'classic' ? 'Submit' : labelOf(endRng.pick(alternateLabels.length ? alternateLabels : labels));
      const pickedPlacement = !endChoice
        ? null
        : endChoice === 'classic' || endChoice === 'alternate'
          ? 'left-bottom'
          : endChoice;
      const placement = pickedPlacement === 'left-top' && ctx.display === 'toast' ? 'tools' : pickedPlacement;
      const addSubmit = (parent, cls) => {
        const b = u.el('button', cls, parent, endLabel);
        b.type = 'button';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', ctx.submit);
        return b;
      };
      const addDecoy = (parent, label, collide, position) => {
        const b = u.el('button', 't10-xtra ' + position, parent, label);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', collide ? { label, collide: true } : { label }));
        return b;
      };
      let submit = null;
      if (placement === 'left-bottom') submit = addSubmit(left, 'submit');
      if (placement === 'left-top')
        submit = addSubmit(left, 't10-end-top' + (ctx.display === 'toast' ? ' t10-end-top-right' : ''));
      const doc = u.el('section', 't10-doc', shell);
      const stage = u.el('div', 'stage', doc);
      const tools = u.el('aside', 't10-tools', doc);
      TOOLS.forEach((t) => {
        const b = u.el('div', 't10-tool', tools);
        const i = u.el('span', '', b);
        i.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">' +
          t[1] +
          '</svg>';
        u.el('em', '', b, t[0]);
      });
      if (placement === 'tools') submit = addSubmit(tools, 't10-end-tool');
      const collideRng = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collideRng.bool(0.3)) {
        const same = (x) => labelOf(x).trim().toLowerCase() === endLabel.trim().toLowerCase();
        const options = labels.map(labelOf).filter((x) => !same(x));
        if (options.length) {
          const parent = placement === 'left-bottom' ? tools : left;
          const position = placement === 'left-bottom' ? 't10-xtra-tools' : 't10-xtra-lower';
          addDecoy(parent, collideRng.pick(options), true, position);
        }
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
