(function () {
  'use strict';
  const C = { 'site': 'design-fill-form-card-02', 'brand': 'Contact Entry', 'instruction': 'top' };
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
      const ico = u.el('span', 'ds-appicon', top);
      ico.innerHTML =
        '<svg viewBox="0 0 40 44"><defs><linearGradient id="book"><stop stop-color="#e8d99d"/><stop offset="1" stop-color="#a58a49"/></linearGradient></defs><rect x="5" y="3" width="31" height="38" rx="4" fill="url(#book)" stroke="#f0dfa2"/><path d="M9 4v36M4 10h5M4 18h5M4 26h5M4 34h5" stroke="#594927" stroke-width="2"/><ellipse cx="23" cy="17" rx="5" ry="6" fill="#382e1b"/><path d="M14 34c0-12 17-13 17 0z" fill="#382e1b"/><path d="M19 25v11" stroke="#dac589" stroke-width="2"/></svg>';
      u.el('span', 'ds-brand', top, C.brand);
      const wc = u.el('span', 'ds-winctl', top);
      wc.innerHTML =
        '<i><svg viewBox="0 0 20 20" width="18" height="18"><path d="M4 14h12" stroke="#e8d9b0" stroke-width="2"/></svg></i><i><svg viewBox="0 0 20 20" width="18" height="18"><rect x="4" y="4" width="12" height="12" fill="none" stroke="#e8d9b0" stroke-width="2"/></svg></i><i><svg viewBox="0 0 20 20" width="18" height="18"><path d="M4 4l12 12M16 4L4 16" stroke="#e8d9b0" stroke-width="2"/></svg></i>';
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const roomy = window.innerWidth >= 1280 && window.innerHeight >= 700;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel' && roomy
              ? 'panel'
              : 'top';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        const i = u.el('span', 'ds-info', b, 'i');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'panel') briefing(main, 'ds-panel-note');
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', document.body);
      const contacts = u.el('button', 'ds-brass ds-contacts', foot);
      contacts.type = 'button';
      contacts.innerHTML =
        '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="9" cy="8" r="4" fill="#3a2a14"/><path d="M1 21c0-8 16-8 16 0z" fill="#3a2a14"/><path d="M15 12l6 4v5h-6" fill="#3a2a14"/></svg><span>Contacts</span>';
      u.el('span', 'ds-spacer', foot);
      const clear = u.el('button', 'ds-brass ds-cancel', foot, 'Clear');
      clear.type = 'button';
      const endRng = ctx.rng.fork('chrome/end');
      const contentLabels = ctx.content && ctx.content.END_LABELS;
      const endLabels =
        Array.isArray(contentLabels) && contentLabels.length
          ? contentLabels
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const originalEnd = endRng.bool(0.5);
      const currentLabel = originalEnd ? 'Submit' : labelOf(endRng.pick(endLabels));
      const placement = originalEnd ? 'footer' : endRng.pick(['header', 'link']);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideRng.bool(0.3)) {
        const options = endLabels
          .map(labelOf)
          .filter((x) => String(x).trim().toLowerCase() !== currentLabel.trim().toLowerCase());
        if (options.length) collide = String(collideRng.pick(options));
      }
      const endButton = (parent, cls, label, isLink) => {
        const b = u.el(isLink ? 'a' : 'button', cls, parent, label);
        if (isLink) b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', currentLabel);
        b.title = currentLabel;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      let submit = null;
      if (collide) {
        const decoy = u.el('button', 'ds-brass ds-xtra', foot, collide);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      if (!ctx.finish) {
        if (placement === 'header') {
          submit = endButton(top, 'ds-brass ds-top-submit', currentLabel, false);
          top.insertBefore(submit, wc);
        } else if (placement === 'link') submit = endButton(foot, 'ds-endlink', currentLabel + ' ›', true);
        else submit = endButton(foot, 'ds-brass ds-submit', currentLabel, false);
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
