(function () {
  'use strict';
  env.site({
    name: 'design-act-in-time-delay-12', styles: ['site.css'], scripts: [],
    initialOverlay: { kind: 'banner' },
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection(); if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('span', 'ds-logo', top); logo.setAttribute('aria-hidden', 'true');
      const identity = u.el('div', 'ds-identity', top);
      u.el('strong', 'ds-brand', identity, 'TaskFlow');
      u.el('span', 'ds-tagline', identity, 'Simple tools for everyday tasks');
      const account = u.el('div', 'ds-account', top);
      u.el('span', '', account, 'Welcome, Alex');
      const links = u.el('div', 'ds-account-links', account);
      u.el('span', '', links, 'Help'); u.el('i', '', links, '|'); u.el('span', '', links, 'Sign out');
      const endRng = ctx.rng.fork('chrome/end');
      const placements = ctx.finish ? [] : ['footer', 'footer', 'footer', 'header', 'link', 'icon'];
      const placement = ctx.finish ? null : endRng.pick(placements);
      const labelBank = ctx.content && ctx.content.END_LABELS;
      const labelValues = Array.isArray(labelBank) && labelBank.length ? labelBank.map(x => typeof x === 'string' ? x : x.label || x.text || 'Submit') : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK'];
      const endLabel = placement === 'footer' ? 'Submit' : endRng.pick(labelValues);
      const collideRng = ctx.rng.fork('chrome/collide');
      const collisionLabels = labelValues.filter(x => x.toLowerCase() !== endLabel.toLowerCase());
      const collide = !ctx.finish && collisionLabels.length && collideRng.bool(0.3) ? collideRng.pick(collisionLabels) : null;
      const endButton = (parent, cls, text, icon) => {
        const b = u.el('button', cls, parent, icon ? '✓' : text);
        b.type = 'button'; b.dataset.role = 'submit'; b.setAttribute('aria-label', text); b.title = text;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };

      const content = u.el('div', 'ds-content', document.body);
      const mode = ctx.display || 'header';
      const stage = u.el('main', 'ds-stage', content);
      stage.classList.add('tools-open');
      stage.dataset.display = mode;
      const skyline = u.el('div', 'ds-skyline', content);
      for (let i = 0; i < 11; i++) u.el('span', 'ds-building', skyline);
      const leaves = u.el('div', 'ds-leaves', content);
      for (let i = 0; i < 5; i++) u.el('i', '', leaves);
      const heading = u.el('section', 'ds-heading', content);
      u.el('h1', '', heading, mode === 'panel' ? 'Task instructions' : 'Prepare to continue');
      const instruction = u.el('div', 'ds-instruction', heading, ctx.instruction);
      const waiting = u.el('div', 'ds-waiting', heading, 'Waiting for the task clock');
      const explainer = u.el('p', 'ds-explainer', heading, 'The next step will be available on the task clock.');
      const contextLine = u.el('p', 'ds-context-line', heading, 'Please wait, then click “Next” when it is enabled.');
      if (mode === 'hidden') heading.classList.add('ds-no-instruction');
      if (mode === 'toast') heading.classList.add('ds-toast-note');
      if (mode === 'panel') heading.classList.add('ds-panel-note');
      if (mode === 'toast') { explainer.hidden = true; contextLine.hidden = true; }
      if (mode === 'panel') { explainer.hidden = true; contextLine.hidden = true; }
      const slogan = u.el('aside', 'ds-slogan', content);
      ['Small', 'Steps', 'Bright', 'Results'].forEach(t => u.el('span', '', slogan, t));
      const foot = u.el('footer', 'ds-footer', content);
      if (ctx.finish) foot.classList.add('ds-finish-footer');
      const clock = u.el('div', 'ds-footer-clock', foot);
      u.el('span', 'ds-clock-icon', clock, '◷');
      const clockcopy = u.el('div', '', clock);
      const clockLabel = u.el('small', '', clockcopy, 'Task clock');
      u.el('strong', '', clockcopy, '00:00');
      const warning = u.el('strong', 'ds-warning', foot, ctx.instruction);
      let submit = null;
      if (placement === 'footer') submit = endButton(foot, 'ds-submit', endLabel, false);
      if (placement === 'link') submit = endButton(foot, 'ds-endlink', endLabel + ' ›', false);
      if (placement === 'header') submit = endButton(top, 'ds-submit ds-top-submit', endLabel, false);
      if (placement === 'icon') submit = endButton(top, 'ds-submit ds-top-icon', endLabel, true);
      if (collide) {
        const decoy = u.el('button', 'ds-xtra', top, collide);
        decoy.type = 'button'; decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      if (ctx.finish) warning.classList.add('finish-spacer');
      if (mode === 'hidden') warning.hidden = true;
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      if (ctx.initial) {
        const stage = document.querySelector('.ds-stage');
        const clockLabel = document.querySelector('.ds-footer-clock small');
        const waiting = document.querySelector('.ds-waiting');
        stage.classList.remove('tools-open');
        clockLabel.textContent = 'Task clock (paused)';
        const el = u.el('section', 'ds-fold ds-initial-fold', document.querySelector('.ds-content'));
        el.dataset.role = 'overlay';
        const toolIcon = u.el('span', 'ds-tool-icon', el); toolIcon.setAttribute('aria-hidden', 'true');
        const foldCopy = u.el('div', 'ds-fold-copy', el);
        u.el('strong', '', foldCopy, 'Tools are hidden');
        u.el('span', '', foldCopy, 'Expand tools to show the task controls.');
        const dismiss = u.el('button', 'ds-expand', el);
        dismiss.type = 'button'; dismiss.dataset.role = 'expand-tools';
        u.el('span', 'ds-expand-mark', dismiss, '⌄'); u.el('b', '', dismiss, 'Expand tools');
        dismiss.addEventListener('click', () => {
          waiting.hidden = true; clockLabel.textContent = 'Task clock';
          stage.classList.add('tools-open'); ctx.dismiss('close');
        });
        return { el, dismiss };
      }
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body); el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes synced.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.' };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
