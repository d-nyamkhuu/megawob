(function () {
  'use strict';
  env.site({
    name: 'design-act-in-time-simon-08',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const header = u.el('header', 'ds-top', document.body);
      const mark = u.el('div', 'ds-mark', header);
      u.el('span', 'ds-leaf', mark, '❧');
      u.el('span', 'ds-brand', mark, 'MEMORY\nPATTERN');
      const kicker = u.el('div', 'ds-kicker', header, 'A QUICK\nMEMORY CHALLENGE');
      const round = u.el('div', 'ds-round', header);
      u.el('span', '', round, 'ROUND');
      u.el('strong', '', round, '1 / 5');
      const display = ctx.display || 'header';
      document.body.dataset.simonbrief = display;
      document.body.dataset.finish = String(!!ctx.finish);
      const band = u.el('section', 'ds-center', document.body);
      if (display !== 'hidden') {
        const note = u.el(
          'div',
          display === 'toast' ? 'ds-instruction ds-toast' : 'ds-instruction',
          band,
          ctx.instruction,
        );
        if (display === 'panel') note.classList.add('ds-panel-note');
      }
      const stage = u.el('main', 'ds-stage', band);
      const footer = u.el('footer', 'ds-footer', document.body);
      const seq = u.el('div', 'ds-sequence', footer);
      u.el('span', '', seq, 'SEQUENCE');
      u.el('strong', '', seq, '1 / 5');
      const tools = u.el('div', 'ds-foot-mark', footer, '');
      let submit = null;
      let label = '';
      if (!ctx.finish) {
        const r = ctx.rng.fork('chrome/end');
        const style = r.pick(['footer', 'footer', 'link', 'header']);
        const labels = (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
        ];
        const picked = r.pick(labels);
        label =
          style === 'footer'
            ? 'Submit'
            : typeof picked === 'string'
              ? picked
              : picked.label || picked.text || picked.name;
        const parent = style === 'header' ? header : footer;
        submit = u.el(
          style === 'link' ? 'a' : 'button',
          style === 'header' ? 'ds-submit ds-submit-head' : style === 'link' ? 'ds-submit ds-submit-link' : 'ds-submit',
          parent,
          label,
        );
        if (submit.tagName === 'BUTTON') submit.type = 'button';
        else submit.href = '#';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const bank = (ctx.content && ctx.content.END_LABELS) || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK'];
        const choices = bank
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name))
          .filter((x) => x && x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (choices.length) {
          const text = cr.pick(choices);
          const decoy = u.el('button', 'ds-xtra', tools, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
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
