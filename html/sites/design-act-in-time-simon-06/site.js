(function(){
  'use strict';
  const C = { site: 'design-act-in-time-simon-06', title: 'Memory Sequence' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const collideRng = ctx.rng.fork('chrome/collide');
      const display = ctx.display || 'header';
      const shown = display === 'hidden' ? 'hidden' : display;
      document.body.dataset.simonbrief = shown;

      const titlebar = u.el('header', 'ds-titlebar', document.body);
      u.el('span', 'ds-app-icon', titlebar, '▤');
      u.el('span', 'ds-brand', titlebar, C.title);
      const windowBtns = u.el('div', 'ds-window-buttons', titlebar);
      ['−', '□', '×'].forEach(x => u.el('span', '', windowBtns, x));
      const menu = u.el('nav', 'ds-menu', document.body);
      ['Game', 'Settings', 'Help'].forEach(x => u.el('span', '', menu, x));

      const body = u.el('div', 'ds-body', document.body);
      const brief = u.el('aside', 'ds-brief', body);
      const briefHeading = u.el('h1', 'ds-brief-heading', brief);
      u.el('span', 'ds-task-icon', briefHeading, '▤');
      u.el('span', '', briefHeading, 'Task');
      if (shown === 'panel' || shown === 'toast') {
        u.el('div', 'ds-instruction ds-instruction-banner ds-fallback-instruction', brief, ctx.instruction);
      }
      if (shown === 'header') u.el('div', 'ds-instruction ds-instruction-banner', brief, ctx.instruction);
      if (shown === 'panel') {
        const panel = u.el('section', 'ds-instruction-panel', brief);
        u.el('h2', '', panel, 'Your task');
        u.el('div', 'ds-instruction', panel, ctx.instruction);
      }
      u.el('p', 'ds-description', brief, 'Watch the sequence of lights. After the sequence finishes, press the buttons in the same order.');
      const details = u.el('section', 'ds-details', brief);
      u.el('h2', '', details, 'Details');
      const list = u.el('ul', '', details);
      ['Four colored buttons (red, green, blue, yellow).', 'The sequence gets longer each round.', 'Wait for the sequence to finish, then repeat it by clicking the buttons.'].forEach(x => u.el('li', '', list, x));
      const sideStatus = u.el('section', 'ds-side-status', brief);
      u.el('h2', '', sideStatus, 'Current Round');
      u.el('div', '', sideStatus, '1');
      u.el('h2', '', sideStatus, 'Status');
      u.el('div', '', sideStatus, 'Watch the sequence.');
      if (shown === 'toast') {
        const note = u.el('div', 'ds-toast', brief);
        u.el('span', '', note, ctx.instruction);
        brief.insertBefore(note, briefHeading.nextSibling);
      }

      const workspace = u.el('section', 'ds-content', body);
      const stage = u.el('main', 'ds-stage', workspace);
      let submit = null;
      const finish = ctx.finish;
      const placement = finish ? null : endRng.pick(['footer', 'footer', 'toolbar', 'link', 'icon']);
      const labels = ctx.content && ctx.content.END_LABELS;
      const pickedLabel = endRng.bool(0.5) ? 'Submit' : labels && labels.length ? endRng.pick(labels) : 'Submit';
      const endLabel = typeof pickedLabel === 'string' ? pickedLabel : pickedLabel.label || pickedLabel.text || 'Submit';
      const endWords = labels && labels.length ? labels.map(x => typeof x === 'string' ? x : x.label || x.text || String(x)) : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const otherEndWords = endWords.filter(x => x.toLowerCase() !== endLabel.toLowerCase());
      const decoys = !finish && collideRng.bool(0.3) && otherEndWords.length ? [collideRng.pick(otherEndWords)] : [];
      const button = (parent, cls, label, real) => {
        const b = u.el('button', cls, parent, label);
        b.type = 'button';
        b.dataset.role = real ? 'submit' : 'decoy';
        b.title = label;
        if (real) {
          b.setAttribute('aria-label', endLabel);
          b.addEventListener('click', () => ctx.submit());
        } else b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        return b;
      };
      const toolbar = u.el('div', 'ds-toolbar', workspace);
      if (placement === 'toolbar') submit = button(toolbar, 'ds-submit ds-submit-small', endLabel, true);
      else if (placement === 'icon') submit = button(toolbar, 'ds-submit ds-submit-icon', '✓', true);
      const footer = u.el('footer', finish ? 'ds-footer ds-footer-finish' : 'ds-footer', workspace);
      u.el('span', 'ds-ready', footer, '');
      if (decoys.length) button(placement === 'footer' ? footer : toolbar, 'ds-xtra', decoys[0], false);
      if (placement === 'footer') submit = button(footer, 'ds-submit', endLabel, true);
      if (placement === 'link') {
        submit = u.el('a', 'ds-endlink', footer, `${endLabel} ›`);
        submit.href = '#';
        submit.dataset.role = 'submit';
        submit.addEventListener('click', e => { e.preventDefault(); ctx.submit(); });
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = { cookie: 'We use cookies to remember your preferences.', toast: 'Changes saved.', chat: 'Hello. How can we help?', promo: 'Try our new workspace.', banner: 'Scheduled maintenance tonight.' };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    }
  });
})();
