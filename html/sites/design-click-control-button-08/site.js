(function () {
  'use strict';
  env.site({
    name: 'design-click-control-button-08',
    styles: ['site.css', 'civic.css'],
    frame(ctx) {
      const u = ctx.util;
      // New episode choices have their own streams; the widget's seeded draws stay unchanged.
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'aside' : er.pick(['header', 'footer']);
      const endLabel = referenceEnd ? 'Submit' : er.pick(labels);
      document.body.className = 'ref civic';
      const shell = u.el('main', 'cv-shell', document.body);
      const head = u.el('header', 'cv-head', shell);
      u.el('div', 'cv-name', head, 'Riverton City Council');
      u.el('div', 'cv-tag', head, 'A stronger community together');
      const tools = u.el('div', 'cv-head-tools', head);
      const work = u.el('div', 'cv-work', shell);
      const main = u.el('section', 'cv-main', work);
      u.el('h1', 'cv-h1', main, 'Contact Us');
      u.el('p', 'cv-lead', main, 'We’d like to hear from you. Please fill out the form below.');
      const stage = u.el('div', 'stage cv-stage', main);
      const aside = u.el('aside', 'cv-aside', work);
      if (ctx.display !== 'hidden') {
        const note = u.el('div', 'instruction cv-instr', aside, ctx.instruction);
        note.dataset.display = ctx.display;
        note.dataset.long = String(ctx.instruction.length > 35);
        if (ctx.display === 'toast') note.classList.add('instruction-toast');
      }
      u.el(
        'p',
        'cv-help',
        aside,
        ctx.finish
          ? 'Your form is ready for review.'
          : `When you’re ready, click the ${endLabel} button to send your message.`,
      );
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          'button',
          'submit cv-submit cv-end-' + placement,
          placement === 'header' ? tools : aside,
          endLabel,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', ctx.submit);
      }
      if (submit && placement === 'footer') aside.append(submit);
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const pool = labels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (pool.length) {
          const label = cr.pick(pool);
          const decoy = u.el('button', 'cv-xtra', tools, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
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
