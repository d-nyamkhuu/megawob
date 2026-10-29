(function () {
  'use strict';
  env.site({
    name: 'design-act-in-time-moving-01', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const collideRng = ctx.rng.fork('chrome/collide');
      const endLabels = (ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length)
        ? ctx.content.END_LABELS.map(x => typeof x === 'string' ? x : (x.label || x.text || x.name || String(x)))
        : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const placement = ctx.finish ? null : endRng.pick(['footer', 'footer', 'footer', 'link', 'inspector']);
      const label = ctx.finish || endRng.bool(0.5) ? 'Submit' : endRng.pick(endLabels);
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const choices = [...new Set(endLabels)].filter(x => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase());
        if (choices.length) collide = collideRng.pick(choices);
      }
      const page = u.el('div', 'ds-page', document.body);
      const work = u.el('section', 'ds-workbench', page);
      const note = u.el('h1', 'ds-instruction', work, ctx.instruction);
      if (ctx.display === 'hidden' || ctx.display === 'panel') note.hidden = true;
      if (ctx.display === 'toast') note.classList.add('ds-toast');
      const time = u.el('div', 'ds-time', work);
      time.append('Time remaining: ');
      u.el('b', 'ds-time-value', time, '');
      time.append(' seconds');
      const stage = u.el('main', 'ds-stage', work);
      const foot = u.el('footer', 'ds-footer', work);
      let submit = null;
      if (!ctx.finish) {
        const makeSubmit = (parent, cls, text) => {
          const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, parent, text);
          if (b.tagName === 'BUTTON') b.type = 'button'; else b.href = '#';
          b.dataset.role = 'submit'; b.setAttribute('aria-label', label); b.title = label;
          b.addEventListener('click', e => { e.preventDefault(); ctx.submit(); });
          return b;
        };
        if (placement === 'footer') submit = makeSubmit(foot, 'ds-submit', label);
        if (placement === 'link') submit = makeSubmit(foot, 'ds-endlink', label + ' ›');
        if (collide && placement !== 'inspector') {
          const b = u.el('button', 'ds-xtra', foot, collide);
          b.type = 'button'; b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
        }
      }
      const info = u.el('aside', 'ds-inspector', page);
      u.el('h2', '', info, 'Task Info');
      const goal = u.el('div', 'ds-goal', info);
      if (ctx.display === 'panel') {
        goal.classList.add('ds-panel-note');
        u.el('strong', 'ds-panel-heading', goal, 'Task instructions');
        u.el('span', 'ds-goal-text', goal, ctx.instruction);
      } else {
        u.el('span', '', goal, 'Goal:');
        u.el('span', 'ds-goal-text', goal, ctx.instruction);
      }
      if (ctx.display === 'hidden' || ctx.display === 'toast') goal.hidden = true;
      u.el('div', 'ds-task-state', info);
      if (!ctx.finish && placement === 'inspector') {
        submit = u.el('button', 'ds-submit ds-inspector-submit', info, label);
        submit.type = 'button'; submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label); submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
      }
      if (!ctx.finish && collide && placement === 'inspector') {
        const b = u.el('button', 'ds-xtra ds-inspector-xtra', info, collide);
        b.type = 'button'; b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const text = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.' };
      u.el('div', '', el, text[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.type = 'button'; dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    }
  });
})();
