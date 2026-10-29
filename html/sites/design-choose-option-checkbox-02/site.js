(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-checkbox-02',
    'brand': 'Preferences - Topic Selection',
    'instruction': 'top',
    'rail': '',
    'menu': 'File|Edit|View|Help',
    'briefTitle': 'Your Task',
  };
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
      const placeRng = ctx.rng.fork('chrome/end-placement');
      const collideRng = ctx.rng.fork('chrome/collide');
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const submitLabel = labels.find((x) => labelOf(x).toLowerCase() === 'submit') || labels[0];
      const alternates = labels.filter((x) => labelOf(x).toLowerCase() !== labelOf(submitLabel).toLowerCase());
      const endLabel = labelOf(endRng.bool(0.5) || !alternates.length ? submitLabel : endRng.pick(alternates));
      const placement = placeRng.pick(['footer', 'footer', 'header', 'link']);
      const distinct = labels.filter((x) => labelOf(x).toLowerCase() !== endLabel.toLowerCase());
      const collide = collideRng.bool(0.3) && distinct.length ? labelOf(collideRng.pick(distinct)) : null;
      const top = u.el('header', 'ds-top', document.body);
      const mast = u.el('div', 'ds-mast', top);
      u.el('div', 'ds-brand', mast, 'The Daily Chronicle');
      const tag = u.el('div', 'ds-tag', mast);
      u.el('i', '', tag);
      u.el('span', '', tag, 'News for a brighter tomorrow');
      u.el('i', '', tag);
      const tr = u.el('div', 'ds-topright', top);
      u.el('div', 'ds-date', tr, 'Monday, March 14, 2011');
      const lk = u.el('div', 'ds-links', tr);
      ['Home', 'Help', 'Contact'].forEach((t, i) => {
        if (i) u.el('b', '', lk, '|');
        u.el('span', '', lk, t);
      });
      const decoyBtn = (parent, text) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      const endBtn = (parent, cls, text, link) => {
        const b = u.el(link ? 'a' : 'button', cls, parent, text);
        if (link) b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (collide && !ctx.finish) decoyBtn(lk, collide);
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const natural = C.instruction;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      const main = u.el('div', 'ds-main', content);
      const side = u.el('aside', 'ds-side', main);
      u.el('h2', '', side, 'Topic Preferences');
      u.el(
        'p',
        '',
        side,
        'Tell us which topics you’re interested in so we can personalize your news experience. Select any topics you want to follow. You can change these at any time.',
      );
      u.el('hr', '', side);
      u.el('h3', '', side, 'Your Selections');
      u.el('p', 'ds-none', side, 'No topics selected yet.');
      const work = u.el('div', 'ds-work', main);
      u.el('div', 'ds-step', work, 'Step 1 of 1');
      u.el('h1', '', work, 'Choose Your Topics');
      if (mode === 'top') {
        briefing(work, 'ds-header-note');
      } else if (mode === 'left' || mode === 'right') {
        briefing(work, 'ds-brief');
      }
      u.el('div', 'ds-lead', work, 'Select the topics you’re interested in:');
      const stage = u.el('main', 'ds-stage', work);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const rd = u.el('span', 'ds-ready', foot);
      u.el('b', '', rd, 'Ready to continue?');
      u.el('em', '', rd, 'Make your selections, then click ' + endLabel + '.');
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'header') submit = endBtn(lk, 'ds-submit ds-submit-head', endLabel);
        else if (placement === 'link') submit = endBtn(foot, 'ds-endlink', endLabel + ' ›', true);
        else submit = endBtn(foot, 'ds-submit', endLabel);
        if (collide && placement !== 'header') decoyBtn(foot, collide);
      }
      if (!ctx.finish) {
        const clr = u.el('button', 'ds-clear', foot, 'Clear All');
        clr.type = 'button';
        clr.addEventListener('click', () => {
          stage.querySelectorAll('input:checked').forEach((i) => i.click());
        });
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
