(function () {
  'use strict';
  env.site({
    name: 'design-act-in-time-moving-06',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util,
        root = document.body;
      const sys = u.el('header', 'wb-system', root);
      u.el('span', 'wb-system-name', sys, 'Amiga Workbench');
      u.el('span', '', sys, 'Release 2.04');
      u.el('span', '', sys, '1,948,688 graphics mem');
      u.el('span', '', sys, '7,340,032 other mem');
      u.el('button', 'wb-screen', sys, '▣');
      const title = u.el('header', 'wb-title', root);
      u.el('span', 'wb-app-icon', title, '◉');
      u.el('strong', '', title, 'Shape Catcher');
      const gadgets = u.el('div', 'wb-gadgets', title);
      u.el('button', '', gadgets, '▱');
      u.el('button', '', gadgets, '×');
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      const labels = (ctx.content && ctx.content.END_LABELS) || [
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
      const endLabel = endRng.bool(0.5) ? 'Submit' : labelOf(endRng.pick(labels));
      const placement = endRng.pick(['footer', 'footer', 'title', 'brief']);
      const collide = collideRng.bool(0.3)
        ? labelOf(
            collideRng.pick(labels.filter((x) => labelOf(x).trim().toLowerCase() !== endLabel.trim().toLowerCase())),
          )
        : null;
      const content = u.el('div', 'wb-content', root);
      const display = ctx.display === 'top' ? 'header' : ctx.display;
      content.classList.toggle('wb-hidden', display === 'hidden');
      let briefing = null;
      if (display === 'header' || display === 'panel' || display === 'toast') {
        briefing = u.el('section', 'wb-brief wb-brief-' + display, content);
        u.el('h2', '', briefing, display === 'panel' ? 'Task File' : 'Task');
        u.el('div', 'wb-instruction', briefing, ctx.instruction);
      }
      const stage = u.el('main', 'wb-stage', content);
      const controls = u.el('section', 'wb-control-panel', root);
      u.el('h2', '', controls, 'Controls');
      for (const text of ['Pause', 'Reset']) {
        const b = u.el('button', 'wb-utility', controls, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text }));
      }
      const makeEnd = (parent, cls, text) => {
        const b = u.el('button', cls + ' wb-submit', parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.title = labelOf(text);
        b.setAttribute('aria-label', labelOf(text));
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      const addDecoy = (parent, text, collides) => {
        const b = u.el('button', 'wb-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      let submit = null;
      if (collide) {
        const d = addDecoy(placement === 'title' || placement === 'brief' ? gadgets : sys, collide, true);
        d.classList.add('wb-pq');
      }
      const fillers = (ctx.content && ctx.content.DECOY_LABELS) || [
        'Help',
        'Feedback',
        'Preview',
        'Save draft',
        'Reset view',
        'Share',
        'Export',
        'History',
      ];
      if (endRng.bool(0.35)) addDecoy(gadgets, labelOf(endRng.pick(fillers)), false);
      if (!ctx.finish) {
        if (placement === 'footer') submit = makeEnd(root, 'wb-submit', endLabel);
        else if (placement === 'brief' && briefing) submit = makeEnd(briefing, 'wb-end-brief', endLabel);
        else submit = makeEnd(gadgets, 'wb-end-title', endLabel);
      }
      if (display === 'hidden' && briefing) briefing.remove();
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
