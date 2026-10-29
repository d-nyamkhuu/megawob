(function () {
  'use strict';
  env.site({
    name: 'design-click-control-button-02',
    styles: ['site.css', 'ref.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ref2';
      const endR = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const original = endR.bool(0.5);
      const placement = original ? 'footer' : endR.pick(['header', 'link']);
      const endLabel = original ? 'Submit' : endR.pick(labels);
      const collideR = ctx.rng.fork('chrome/collide');
      const collision = collideR.bool(0.3);
      const alternatives = labels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collideLabel = collision && alternatives.length ? collideR.pick(alternatives) : null;
      const shell = u.el('main', 'shell', document.body);
      const top = u.el('div', 'top2', shell);
      const left = u.el('aside', 'brief', top);
      u.el('h1', '', left, 'Quick Task');
      u.el('p', 'lead', left, 'Follow the instruction and complete the action in the workspace.');
      if (ctx.display !== 'hidden') {
        u.el('hr', '', left);
        const task = u.el('section', 'task-note task-' + ctx.display, left);
        u.el('div', 'lbl', task, ctx.display === 'toast' ? 'Task notice:' : 'Task:');
        const note = u.el('div', 'instruction', task, ctx.instruction);
        note.dataset.display = ctx.display;
        if (ctx.display === 'toast') {
          note.classList.add('instruction-toast');
        }
      }
      u.el('hr', '', left);
      u.el('div', 'lbl', left, 'Notes:');
      const ul = u.el('ul', 'notes2', left);
      [
        'Use only the mouse pointer.',
        'Do not type anything.',
        ctx.finish
          ? 'Finish when the action is complete.'
          : `Click ${endLabel} ${placement === 'header' ? 'above the workspace' : 'in the Actions strip'} when finished.`,
      ].forEach((t) => u.el('li', '', ul, t));
      const main = u.el('section', 'main2', top);
      const hd = u.el('div', 'mhead', main);
      u.el('h2', '', hd, 'Customer Feedback');
      const pg = u.el('div', 'pager', hd);
      u.el('span', 'pg', pg, 'Page 1 of 3');
      u.el('b', 'cur', pg, '1');
      u.el('span', 'num', pg, '2');
      u.el('span', 'num', pg, '3');
      u.el(
        'p',
        'intro',
        main,
        ctx.finish
          ? 'Please review the information below. Complete the requested action when you are ready.'
          : `Please review the information below. When you are ready, click the ${endLabel} ${placement === 'link' ? 'link' : 'button'}.`,
      );
      const card = u.el('div', 'card2', main);
      const cardHeader = u.el('div', 'cardh', card, 'Feedback Form');
      const body = u.el('div', 'cardb', card);
      const stage = u.el('div', 'stage', body);
      const dec = u.el('div', 'deco', body);
      dec.setAttribute('aria-hidden', 'true');
      u.el('div', 'q', dec, 'How did you find our website?');
      ['Very easy', 'Easy', 'Neutral', 'Difficult', 'Very difficult'].forEach((t, i) => {
        const r = u.el('div', 'opt' + (i === 1 ? ' on' : ''), dec);
        u.el('i', '', r);
        u.el('span', '', r, t);
      });
      u.el('div', 'q c', dec, 'Additional comments (optional):');
      u.el('div', 'ta', dec);
      const foot = u.el('footer', 'footer', shell);
      const actions = u.el('h3', '', foot, 'Actions');
      u.el('p', '', foot, 'When you are finished, click the button to submit your feedback.');
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          placement === 'link' ? 'end-link' : 'submit' + (placement === 'header' ? ' end-header' : ''),
          placement === 'header' ? cardHeader : foot,
          endLabel,
        );
        if (placement === 'link') {
          submit.href = '#';
          foot.insertBefore(submit, actions.nextSibling);
        } else submit.type = 'button';
        submit.dataset.placement = placement;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      } else
        foot.querySelector('p').textContent = 'Your feedback workspace is ready. Finish when the action is complete.';
      if (collideLabel) {
        const decoy = u.el('button', 'end-xtra', foot, collideLabel);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: collideLabel, collide: true }));
        if (submit && placement === 'footer') foot.insertBefore(decoy, submit);
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
