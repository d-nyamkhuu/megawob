(function () {
  'use strict';
  const C = {
    site: 'design-act-in-time-moving-02',
    app: 'Shape Sprint',
    menu: ['File', 'Edit', 'Game', 'Window', 'Help'],
    instruction: 'right',
  };
  const END_FALLBACK = [
    'Submit',
    'Done',
    'Finish',
    'Continue',
    'Save',
    'OK',
    'Confirm',
    'Apply',
    'Complete',
    "I'm done",
  ];
  const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
  const APPLE =
    '<svg viewBox="0 0 16 18" width="15" height="17"><path fill="#1d3b63" d="M11.2 9.5c0-1.7 1.4-2.5 1.5-2.6-.8-1.2-2.1-1.4-2.5-1.4-1.1-.1-2.1.6-2.6.6s-1.4-.6-2.300-.6c-1.200 0-2.300.7-2.900 1.700-1.200 2.100-.3 5.300.9 7 .6.800 1.300 1.800 2.200 1.700.9 0 1.200-.6 2.300-.6s1.300.6 2.300.5c.9 0 1.500-.8 2.100-1.700.7-1 .9-1.900.9-2-.1 0-1.700-.7-1.700-2.600zM9.500 4.300c.5-.6.8-1.400.7-2.200-.7 0-1.500.5-2 1.100-.4.500-.8 1.300-.7 2.100.8.100 1.500-.4 2-1z"/></svg>';
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const bar = u.el('header', 'ds-menubar', document.body);
      const ap = u.el('span', 'ds-apple', bar);
      ap.innerHTML = APPLE;
      u.el('b', '', bar, C.app);
      C.menu.forEach((t) => u.el('span', 'ds-mi', bar, t));
      const icons = u.el('span', 'ds-system', bar);
      icons.innerHTML =
        '<svg viewBox="0 0 24 26" aria-label="Bluetooth"><circle cx="12" cy="13" r="10"/><path d="M12 1v24M7 7l11 11-6 5V3l6 5L7 19"/></svg><svg viewBox="0 0 30 24" aria-label="Wi-Fi"><path d="M2 7Q15 -3 28 7M6 11Q15 3 24 11M10 15Q15 10 20 15"/><circle cx="15" cy="19" r="1.5" fill="currentColor"/></svg><svg viewBox="0 0 34 24" aria-label="Battery"><rect x="1" y="4" width="28" height="16" rx="3"/><path d="M32 8v8"/><path fill="currentColor" stroke="none" d="M5 7h20v10H5z"/></svg>';
      u.el('span', 'ds-clock', bar, 'Mon 10:24 AM');
      const wallpaper = u.el('div', 'ds-wallpaper', document.body);
      wallpaper.innerHTML =
        '<svg viewBox="0 0 1672 941" preserveAspectRatio="none"><path fill="#78b7e9" opacity=".20" d="M0 0h1672v58L0 30z"/><path fill="#75b6e9" opacity=".17" d="M0 216 0 451 208 607 0 470z"/><path fill="#8cc9f3" opacity=".13" d="M0 451 0 640 342 890 474 890z"/><path fill="#74b7ed" opacity=".19" d="M0 615 0 732 216 890 338 890z"/><path fill="#7dbce9" opacity=".16" d="M184 890 403 941h492L541 890z"/><path fill="#5fa5df" opacity=".13" d="M1104 890 1672 590v135L1367 890z"/><path fill="#82c2ed" opacity=".17" d="M1555 0h117v237l-117 68-81-49z"/><path fill="#8ac8f1" opacity=".19" d="M1672 288v177l-132-83z"/><path fill="none" stroke="#9dd4f7" stroke-width="2" opacity=".16" d="M0 451 338 707M0 615 405 890M184 890 541 890M1672 288 1540 382M1672 590 1104 890"/></svg>';
      const win = u.el('div', 'ds-win', document.body);
      const tb = u.el('div', 'ds-titlebar', win);
      const lights = u.el('span', 'ds-lights', tb);
      ['r', 'y', 'g'].forEach((c) => u.el('i', 'ds-l-' + c, lights));
      u.el('span', 'ds-wtitle', tb, C.app);
      const endRng = ctx.rng.fork('chrome/end');
      const keepOriginal = !ctx.finish && endRng.bool(0.5);
      const placement = ctx.finish ? null : keepOriginal ? 'footer' : endRng.pick(['toolbar', 'link']);
      const endBank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : END_FALLBACK;
      const label = keepOriginal ? 'Submit' : labelOf(endRng.pick(endBank));
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const options = [...new Set(endBank.map(labelOf))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (options.length)
          collide = { label: collideRng.pick(options), where: collideRng.pick(['toolbar', 'footer']) };
      }
      const titleTools = u.el('div', 'ds-title-tools', tb);
      const decoyBtn = (parent, text, isCollide) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      const endBtn = (parent, cls, text) => {
        const b = u.el(cls === 'ds-end-link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      let submit = null;
      if (placement === 'toolbar') submit = endBtn(titleTools, 'ds-toolbar-submit', label);
      if (collide && collide.where === 'toolbar') decoyBtn(titleTools, collide.label, true);
      const natural = C.instruction;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
      const ov = u.el('section', 'ds-panel ds-overview', win);
      u.el('div', 'ds-phead', ov, 'Overview');
      const ovb = u.el('div', 'ds-ovbody', ov);
      if (mode === 'top' || mode === 'left' || mode === 'right') u.el('div', 'ds-instruction', ovb, ctx.instruction);
      if (mode === 'toast') {
        const t = u.el('aside', 'ds-toast', win);
        u.el('div', 'ds-instruction', t, ctx.instruction);
        win.insertBefore(t, ov);
      }
      const bp = u.el('section', 'ds-panel ds-boardpanel', win);
      u.el('div', 'ds-phead', bp, 'Motion Board');
      const stage = u.el('main', 'ds-stage', bp);
      const foot = u.el('footer', 'ds-footer', win);
      const score = u.el('span', 'ds-score', foot);
      u.el('span', '', score, 'Score:');
      u.el('span', 'ds-score-value', score, '0');
      const footerTools = u.el('div', 'ds-footer-tools', foot);
      if (collide && collide.where === 'footer') decoyBtn(footerTools, collide.label, true);
      if (placement === 'footer') submit = endBtn(footerTools, 'ds-submit', label);
      if (placement === 'link') submit = endBtn(footerTools, 'ds-end-link', label + ' ›');
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
