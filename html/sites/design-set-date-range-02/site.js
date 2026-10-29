(function () {
  'use strict';
  const C = {
    'site': 'design-set-date-range-02',
    'brand': 'Vehicle Rental Reservations',
    'instruction': 'top',
    'rail': '',
    'menu': '',
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
      // New episode choices use independent streams; the task's RNG draws stay unchanged.
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const alternativeLabel = er.pick(endLabels);
      const placement = er.pick(['footer', 'footer', 'toolbar', 'link']);
      const endLabel = placement === 'footer' ? 'Submit' : alternativeLabel;
      const cr = ctx.rng.fork('chrome/collide');
      const collide = cr.bool(0.3)
        ? cr.pick(endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.toLowerCase()))
        : null;
      function endControl(parent, cls) {
        const b = u.el(placement === 'link' ? 'a' : 'button', cls, parent, endLabel);
        if (b.tagName === 'A') b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.title = endLabel;
        b.setAttribute('aria-label', endLabel);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      }
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'ds-toplinks', top, 'Help   |   My Account   |   Sign Out');
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const natural = C.instruction;
      const display = ctx.display === 'toast' && document.documentElement.clientHeight <= 760 ? 'header' : ctx.display;
      const mode =
        display === 'hidden' ? 'hidden' : display === 'toast' ? 'toast' : display === 'panel' ? 'left' : natural;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction' + (ctx.instruction.length > 70 ? ' ds-long-instruction' : ''), b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      if (mode === 'top') top.style.display = 'none';
      const secBar = u.el('div', 'ds-secbar', content, '1. Select Dates');
      u.el('div', 'ds-intro', content, 'Choose your pick-up and return dates using the calendars below.');
      content.insertBefore(secBar, main);
      content.insertBefore(content.lastChild, main);
      const rent = u.el('section', 'ds-rental', content);
      u.el('div', 'ds-secbar', rent, '2. Rental Details');
      [
        ['Vehicle type:', 'Standard Car'],
        ['Pick-up location:', 'Downtown'],
        ['Return location:', 'Same as pick-up'],
      ].forEach((r) => {
        const row = u.el('div', 'ds-rrow', rent);
        u.el('span', 'ds-rlab', row, r[0]);
        const s = u.el('span', 'ds-rsel', row);
        const label = u.el('span', '', s, r[1]);
        u.el('i', '', s, '▾');
        s.tabIndex = 0;
        s.setAttribute('role', 'combobox');
        s.setAttribute('aria-expanded', 'false');
        const choices =
          r[0] === 'Vehicle type:'
            ? ['Standard Car', 'Compact Car', 'SUV']
            : r[0] === 'Pick-up location:'
              ? ['Downtown', 'Airport', 'Train Station']
              : ['Same as pick-up', 'Downtown', 'Airport'];
        function toggle() {
          const old = s.querySelector('.ds-options');
          if (old) {
            old.remove();
            s.setAttribute('aria-expanded', 'false');
            return;
          }
          s.setAttribute('aria-expanded', 'true');
          const menu = u.el('div', 'ds-options', s);
          (s.dataset.sceneValue ? [s.dataset.sceneValue] : choices).forEach((t) => {
            const option = u.el('button', '', menu, t);
            option.type = 'button';
            option.addEventListener('click', (e) => {
              e.stopPropagation();
              label.textContent = t;
              menu.remove();
              s.setAttribute('aria-expanded', 'false');
            });
          });
        }
        s.addEventListener('click', toggle);
        s.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggle();
          }
          if (e.key === 'Escape') {
            s.querySelector('.ds-options')?.remove();
            s.setAttribute('aria-expanded', 'false');
          }
        });
      });
      const foot = u.el('footer', 'ds-footer', content);
      const reset = u.el('button', 'ds-btn ds-reset', foot, 'Reset Dates');
      reset.type = 'button';
      if (!ctx.finish) {
        const cancel = u.el('button', 'ds-btn ds-cancel', foot, 'Cancel');
        cancel.type = 'button';
      }
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'toolbar') submit = endControl(secBar, 'ds-submit ds-end-toolbar');
        else if (placement === 'link') {
          submit = endControl(foot, 'ds-end-link');
          foot.insertBefore(submit, reset.nextSibling);
        } else submit = endControl(foot, 'ds-submit');
      }
      if (collide) {
        const decoy = u.el('button', 'ds-btn ds-xtra', foot, collide);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
        foot.insertBefore(decoy, foot.querySelector('.ds-cancel') || null);
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
