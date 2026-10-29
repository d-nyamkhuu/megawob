(function () {
  'use strict';
  const C = {
    'site': 'design-type-text-password-08',
    'brand': 'Account Access',
    'title': '',
    'instruction': 'top',
    'rail': '',
    'menu': 'Home|Accounts|Settings|Help|Sign out',
    'briefTitle': 'Instructions',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      window.scrollTo(0, 0);
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const originalEnd = endRng.bool(0.5);
      const placement = originalEnd ? 'footer' : endRng.pick(['header', 'link']);
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const endLabel = originalEnd ? 'Submit' : endRng.pick(endLabels);
      const collideRng = ctx.rng.fork('chrome/collide');
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      ['Account', 'Profile', 'Security', 'Preferences', 'Billing'].forEach((t, i) =>
        u.el('div', 'ds-tab ds-tab' + i, rail, t),
      );
      const content = u.el('div', 'ds-content', body);
      const head = u.el('div', 'ds-title', content);
      u.el('h1', '', head, 'Account Settings');
      const headMeta = u.el('span', '', head, 'USER  //  SETTINGS');
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
        b.style.setProperty('--instruction-chars', ctx.instruction.length);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
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
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      let submit = null;
      if (!ctx.finish) {
        let endParent = foot;
        if (placement === 'header') {
          const tools = u.el('div', 'ds-title-tools', head);
          tools.append(headMeta);
          endParent = tools;
        }
        submit = u.el(
          'button',
          'ds-submit' + (placement === 'header' ? ' ds-end-header' : placement === 'link' ? ' ds-end-link' : ''),
          endParent,
          endLabel,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
        const clr = u.el('button', 'ds-clear', foot, 'Clear');
        clr.type = 'button';
        clr.addEventListener('click', () => env.widgetDef.clear());
        if (placement === 'link') foot.append(submit);
      }
      if (collideRng.bool(0.3)) {
        const options = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = collideRng.pick(options);
          const decoy = u.el('button', 'ds-clear ds-xtra', foot, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
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
