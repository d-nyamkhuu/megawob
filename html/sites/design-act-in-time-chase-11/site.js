(function () {
  'use strict';
  const C = {
    'site': 'design-act-in-time-chase-11',
    'brand': 'Focus Challenge',
    'title': 'Focus Challenge',
    'instruction': 'top',
    'rail': '',
    'menu': '',
    'briefTitle': 'Your Progress',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    initialOverlay: { kind: 'promo' },
    pauseOnOverlay: true,
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      const meta = u.el('div', 'ds-window-meta', top);
      u.el('span', '', meta, 'Mon, Apr 27, 2026  10:14 AM');
      ['−', '□', '×'].forEach((t) => {
        const b = u.el('button', '', meta, t);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: t }));
      });
      const status = u.el('div', 'ds-chase-status', document.body);
      u.el('span', '', status, '●  Ready');
      u.el('span', '', status, 'Keep the pointer inside the circle for the required time.');
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
      const roomy = content.clientWidth >= 1260 && content.clientHeight >= 750;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? roomy
              ? 'toast'
              : natural
            : ctx.display === 'panel'
              ? roomy
                ? 'left'
                : natural
              : natural;
      content.dataset.instructionMode = mode;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        b.classList.add('ds-panel-note');
        if (mode === 'right') b.style.order = '2';
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      const endRng = ctx.rng.fork('chrome/end');
      const endForm = endRng.pick(['reference', 'reference', 'toolbar', 'link']);
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const endLabel = endForm === 'reference' ? 'Submit' : endRng.pick(endWords);
      let tools = null;
      function toolbar() {
        if (!tools) {
          tools = u.el('div', 'ds-end-tools', top);
          top.insertBefore(tools, meta);
        }
        return tools;
      }
      let submit = null;
      if (!ctx.finish) {
        const parent = endForm === 'toolbar' ? toolbar() : foot;
        if (endForm === 'link') foot.classList.add('ds-footer-link');
        if (endForm === 'toolbar') foot.classList.add('ds-footer-unused');
        submit = u.el(
          'button',
          endForm === 'toolbar' ? 'ds-toolbar-submit' : endForm === 'link' ? 'ds-end-link' : 'ds-submit',
          parent,
          endLabel,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
      } else foot.classList.add('ds-footer-finish');
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const options = endWords.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = collideRng.pick(options);
          const decoy = u.el('button', 'ds-end-xtra', toolbar(), label);
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
      el.dataset.initial = String(!!ctx.initial);
      if (ctx.kind === 'promo') {
        el.classList.add('ds-newsletter');
        const icon = u.el('div', 'ds-newsletter-icon', el);
        icon.innerHTML =
          '<svg viewBox="0 0 40 32" aria-hidden="true"><rect x="2" y="4" width="36" height="25" rx="3" fill="#1674e8"/><path d="M4 7l16 12L36 7" fill="none" stroke="white" stroke-width="2.5" stroke-linejoin="round"/></svg>';
        const copy = u.el('div', 'ds-newsletter-copy', el);
        u.el('h2', '', copy, 'Join our newsletter');
        u.el('p', '', copy, 'Get product tips and updates, straight to your inbox.');
        const x = u.el('button', 'ds-newsletter-x', el, '×');
        x.setAttribute('aria-label', 'Close');
        x.addEventListener('click', () => ctx.dismiss('close'));
        const actions = u.el('div', 'ds-newsletter-actions', el);
        const later = u.el('button', 'ds-newsletter-later', actions, 'Not now');
        later.addEventListener('click', () => ctx.dismiss('close'));
        const dismiss = u.el('button', 'ds-newsletter-close', actions, 'Close');
        dismiss.addEventListener('click', () => ctx.dismiss('close'));
        return { el, dismiss };
      }
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss(ctx.kind === 'cookie' ? 'accept' : 'close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
