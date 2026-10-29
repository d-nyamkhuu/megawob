(function () {
  'use strict';
  const C = { site: 'design-fill-form-receipt-02' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const er = ctx.rng.fork('chrome/end');
      const labels = (ctx.content && ctx.content.END_LABELS) || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const preferred = labels.find((x) => labelOf(x).toLowerCase() === 'submit') || labels[0];
      const original = !ctx.finish && er.bool(0.5);
      const endLabel = original ? labelOf(preferred) : labelOf(er.pick(labels));
      const placement = ctx.finish ? null : original ? 'toolbar' : er.pick(['toolbar', 'footer', 'link']);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const choices = [...new Set(labels.map(labelOf))].filter((x) => x.toLowerCase() !== endLabel.toLowerCase());
        if (choices.length) collide = { label: cr.pick(choices), where: 'toolbar' };
      }
      const top = u.el('header', 'appbar', document.body);
      u.el('span', 'brand-icon', top, '▣');
      u.el('strong', 'brand', top, 'DOC-TO-FORM LITE');
      const nav = u.el('nav', 'mainnav', top);
      ['EXPENSES', 'DOCUMENTS', 'SETTINGS'].forEach((t, i) => {
        const n = u.el('span', i === 0 ? 'selected' : '', nav, t);
      });
      const search = u.el('div', 'searchbox', top);
      search.innerHTML = '<b>⌕</b><span>Search documents...</span>';
      let submit = null;
      const makeEnd = (parent, cls, text, tag = 'button') => {
        const b = u.el(tag, cls, parent, text);
        if (tag === 'button') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const decoy = (parent, text) => {
        const b = u.el('button', 'xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      if (placement === 'toolbar') submit = makeEnd(top, 'finish-button', endLabel);
      if (collide) {
        decoy(top, collide.label);
        const cp = u.el('button', 'xtra', top, 'Copy link');
        cp.type = 'button';
        cp.addEventListener('click', () => env.log('decoy', { label: 'Copy link' }));
      }
      const natural = ctx.display;
      let noteMode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'panel'
            ? 'panel'
            : ctx.display === 'toast'
              ? 'toast'
              : 'header';
      if (noteMode === 'header') {
        const note = u.el('div', 'tasknote headernote', document.body, ctx.instruction);
      } else if (noteMode === 'toast') {
        u.el('div', 'tasknote toastnote', document.body, ctx.instruction);
      }
      const content = u.el('div', 'appcontent', document.body);
      const main = u.el('div', 'workarea', content);
      if (noteMode === 'panel') u.el('aside', 'tasknote panelnote', main, ctx.instruction);
      const stage = u.el('main', 'ds-stage', main);
      if (placement === 'footer') {
        const foot = u.el('footer', 'appfooter', content);
        submit = makeEnd(foot, 'finish-button', endLabel);
      }
      if (placement === 'link') {
        const foot = u.el('footer', 'appfooter', content);
        submit = makeEnd(foot, 'finish-link', endLabel, 'a');
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
