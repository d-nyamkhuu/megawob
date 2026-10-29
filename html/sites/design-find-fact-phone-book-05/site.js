(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-phone-book-05',
    'brand': 'City of Riverton',
    'sub': 'Community Portal',
    'nav': 'Home|Services|Contact Book|Help',
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
      const top = u.el('header', 'ds-top', document.body);
      const br = u.el('div', 'ds-brandbox', top);
      br.innerHTML =
        '<svg width="44" height="44" viewBox="0 0 44 44" fill="#fff"><path d="M22 3 3 12v4h38v-4zM6 19h5v16H6zm9 0h5v16h-5zm9 0h5v16h-5zm9 0h5v16h-5zM3 37h38v4H3z"/></svg>';
      const bt = u.el('div', 'ds-brandtext', br);
      u.el('div', 'ds-brand', bt, C.brand);
      u.el('div', 'ds-sub', bt, C.sub);
      const nav = u.el('nav', 'ds-menu', top);
      C.nav.split('|').forEach((t) => {
        const s = u.el('span', t === 'Contact Book' ? 'on' : '', nav, t);
      });
      const acct = u.el('div', 'ds-acct', top);
      u.el('span', 'ds-avatar', acct);
      u.el('span', '', acct, 'My Account');
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const main = u.el('div', 'ds-main', content);
      const stage = u.el('main', 'ds-stage', main);
      const side = u.el('aside', 'ds-side', body);
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : 'top';
      if (mode === 'toast') {
        const note = u.el('aside', 'ds-toast', side);
        u.el('div', 'ds-instruction', note, ctx.instruction);
      } else if (mode === 'panel') {
        const note = u.el('aside', 'ds-panel-note', side);
        u.el('h3', '', note, 'Current request');
        u.el('div', 'ds-instruction', note, ctx.instruction);
      } else if (mode === 'top') {
        const note = u.el('aside', 'ds-header-note', side);
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const endR = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = !endR.bool(0.5);
      const placement = referenceEnd ? 'side' : endR.pick(['toolbar', 'footer']);
      const endLabel = referenceEnd ? 'Submit' : endR.pick(endLabels);
      let submit = null;
      const foot = u.el('footer', 'ds-footer', side);
      if (!ctx.finish) {
        const host =
          placement === 'toolbar' ? top : placement === 'footer' ? u.el('footer', 'ds-end-footer', side) : foot;
        submit = u.el(
          'button',
          'ds-submit' + (placement === 'toolbar' ? ' ds-end-toolbar' : placement === 'footer' ? ' ds-end-link' : ''),
          host,
          endLabel,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', () => ctx.submit());
      }
      const collideR = ctx.rng.fork('chrome/collide');
      if (collideR.bool(0.3)) {
        const options = [...new Set(endLabels)].filter(
          (label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase(),
        );
        if (options.length) {
          const label = collideR.pick(options);
          const decoy = u.el('button', 'ds-xtra', foot, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      if (!foot.childElementCount) foot.remove();
      const pv = u.el('div', 'ds-preview', side);
      u.el('h3', '', pv, 'Contact Preview');
      const pb = u.el('div', 'ds-pvbody', pv);
      const endFoot = side.querySelector('.ds-end-footer');
      if (endFoot) side.append(endFoot);
      pb.innerHTML =
        '<svg width="82" height="82" viewBox="0 0 82 82" fill="#a9afb8"><circle cx="41" cy="22" r="21"/><path d="M0 82c0-22 12-32 41-32s41 10 41 32z"/></svg>';
      u.el('span', 'ds-preview-detail', pb, 'No contact selected.');
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
