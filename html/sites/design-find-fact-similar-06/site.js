(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-similar-06',
    'brand': 'Vocabulary Exercise',
    'title': 'Word Options',
    'instruction': 'left',
    'rail': '',
    'menu': 'File|Edit|Format|Tools|Window|Help',
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
      const u = ctx.util;
      const content = ctx.content || {};
      const bank =
        Array.isArray(content.END_LABELS) && content.END_LABELS.length
          ? content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endRng = ctx.rng.fork('chrome/end');
      const placement = ctx.finish ? null : endRng.pick(['header', 'footer', 'link', 'footer']);
      const label = endRng.bool(0.5) ? 'Submit' : labelOf(endRng.pick(bank));
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const pool = [
          ...new Set(bank.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
        ];
        if (pool.length) collide = labelOf(collideRng.pick(pool));
      }
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', '', top, '−    □    ×');
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const contentBox = u.el('div', 'ds-content' + (placement === 'header' ? ' has-header-end' : ''), body);
      const rawMode = ctx.display || 'header';
      const compact =
        ctx.size && ((ctx.size.width && ctx.size.width < 1180) || (ctx.size.height && ctx.size.height < 700));
      const mode = compact && (rawMode === 'panel' || rawMode === 'toast') ? 'header' : rawMode;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-panel-note') u.el('h2', '', b, C.briefTitle);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') briefing(contentBox, 'ds-page-note');
      const main = u.el('div', 'ds-main', contentBox);
      if (mode === 'panel') briefing(main, 'ds-panel-note');
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') briefing(contentBox, 'ds-toast-note');
      const foot = u.el('footer', 'ds-footer', contentBox);
      u.el('span', '', foot, 'Ready');
      const tools = u.el('div', placement === 'header' ? 'ds-end-head' : 'ds-end-tools', contentBox);
      let submit = null;
      function endButton(parent, cls, text, asLink) {
        const b = u.el(asLink ? 'a' : 'button', cls, parent, text);
        if (asLink) {
          b.href = '#';
        } else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      }
      if (collide) {
        const d = u.el('button', 'ds-xtra', tools, collide);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      if (!ctx.finish) {
        if (placement === 'footer') submit = endButton(foot, 'ds-submit', label, false);
        else if (placement === 'header') submit = endButton(tools, 'ds-submit ds-head-submit', label, false);
        else submit = endButton(foot, 'ds-submit ds-link-submit', label, true);
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
