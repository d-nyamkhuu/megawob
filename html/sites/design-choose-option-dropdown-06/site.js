(function () {
  'use strict';
  const C = { 'site': 'design-choose-option-dropdown-06', 'brand': 'Video Settings', 'links': ['Home', 'Help', 'Logout'] };
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
      const links = u.el('nav', 'ds-links', top);
      C.links.forEach((t) => {
        const a = u.el('a', '', links, t);
        a.href = '#';
        a.addEventListener('click', (e) => e.preventDefault());
      });
      const endR = ctx.rng.fork('chrome/end');
      const choices = (ctx.content.END_LABELS || []).map((x) =>
        typeof x === 'string' ? x : x.label || x.text || x.name || String(x),
      );
      const alternatives = choices.filter((x) => x.trim().toLowerCase() !== 'submit');
      const keepDefault = endR.bool(0.5);
      const placement = keepDefault ? 'footer' : endR.pick(['header', 'link']);
      const label = keepDefault ? 'Submit' : alternatives.length ? endR.pick(alternatives) : 'Done';
      const content = u.el('div', 'ds-content', document.body);
      if (ctx.display !== 'hidden') {
        const mode = ctx.display || 'header';
        const note = mode === 'header' ? content : u.el('aside', 'ds-note ds-note-' + mode, content);
        u.el('h1', 'ds-instruction', note, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', content);
      const foot = u.el('footer', 'ds-footer', content);
      u.el('hr', 'ds-rule', foot);
      const acts = u.el('div', 'ds-acts', foot);
      ['Save Settings', 'Reset'].forEach((t) => {
        const b = u.el('button', 'ds-btn', acts, t);
        b.type = 'button';
      });
      const help = u.el('aside', 'ds-help', acts);
      u.el('div', 'ds-help-h', help, 'Need help?');
      const hl = u.el('a', '', help, 'Video Settings Guide');
      hl.href = '#';
      hl.addEventListener('click', (e) => e.preventDefault());
      const endBtn = (parent, cls) => {
        const b = u.el(placement === 'link' ? 'a' : 'button', 'ds-btn ' + cls, parent, label);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'footer') submit = endBtn(foot, 'ds-submit');
        else if (placement === 'header') submit = endBtn(links, 'ds-header-end');
        else {
          submit = endBtn(acts, 'ds-link-end');
          acts.insertBefore(submit, help);
        }
      }
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(0.3)) {
        const pool = choices.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) collide = cr.pick(pool);
      }
      if (collide) {
        const b = u.el('button', 'ds-xtra', links, collide);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
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
      const dismiss = u.el('button', 'ds-btn', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
