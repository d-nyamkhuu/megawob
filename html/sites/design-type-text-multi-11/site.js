(function () {
  'use strict';
  const C = {
    'site': 'design-type-text-multi-11',
    'brand': 'TASK HUB',
    'tag': 'Simple tools for real work.',
    'instruction': 'top',
  };
  const MEGA =
    '<svg viewBox="0 0 170 145" width="100%" height="100%"><path d="M25 86 L36 126 L49 122 L40 83" fill="#080808" stroke="#080808" stroke-width="9" stroke-linejoin="round"/><path d="M8 68 L15 65 L20 90 L12 91 Z" fill="#080808" stroke="#080808" stroke-width="8" stroke-linejoin="round"/><path d="M14 59 L45 53 L99 16 L111 105 L50 84 L20 91 Z" fill="#fff" stroke="#080808" stroke-width="8" stroke-linejoin="round"/><path d="M45 53 L50 84 M99 16 L111 105" fill="none" stroke="#080808" stroke-width="7"/><path d="M125 30 L138 14 M131 52 L150 48 M131 75 L147 83" stroke="#080808" stroke-width="7" stroke-linecap="round"/></svg>';
  const USER =
    '<svg viewBox="0 0 24 24" width="100%" height="100%"><circle cx="12" cy="8" r="4.5" fill="#111"/><path d="M3 21 C3 14 21 14 21 21 Z" fill="#111"/></svg>';
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'ds-tag', top, C.tag);
      const prof = u.el('span', 'ds-profile', top, 'Profile');
      const ic = u.el('i', '', prof);
      ic.innerHTML = USER;
      const er = ctx.rng.fork('chrome/end');
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['header', 'link']);
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const endLabel = referenceEnd ? 'Submit' : er.pick(labels);
      const tools = u.el('div', 'ds-tools', top);
      top.insertBefore(tools, prof);
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = labels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = cr.pick(options);
          const decoy = u.el('button', 'ds-xtra', tools, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      if (env.episode && env.episode.perturb === 'banner') content.classList.add('ds-reserve');
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : C.instruction;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, 'Instructions');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') briefing(main, 'ds-brief');
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'ds-submit' + (placement === 'header' ? ' ds-submit-header' : placement === 'link' ? ' ds-submit-link' : ''),
          placement === 'header' ? tools : foot,
          endLabel,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (ctx.finish || placement === 'header') foot.classList.add('ds-footer-empty');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      if (ctx.kind === 'banner') {
        const ic = u.el('i', 'ds-mega', el);
        ic.innerHTML = MEGA;
        const tx = u.el('div', 'ds-ann', el);
        u.el('h1', '', tx, 'ANNOUNCEMENT');
        u.el('p', '', tx, 'Important: Please read this update before continuing.');
        const dismiss = u.el('button', 'ds-collapse', el, 'Collapse announcement');
        u.el('b', '', dismiss, '');
        dismiss.addEventListener('click', () => ctx.dismiss('close'));
        return { el, dismiss, ttlSteps: 0 };
      }
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
