(function () {
  'use strict';
  const C = { site: 'design-fill-form-claim-03', brand: 'ClaimCenter Lite' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util,
        er = ctx.rng.fork('chrome/end'),
        bank = ctx.content && ctx.content.END_LABELS;
      const labels =
        Array.isArray(bank) && bank.length
          ? bank
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const preferred =
        labels.find((x) => labelOf(x).trim().toLowerCase() === 'finish') ||
        labels.find((x) => labelOf(x).trim().toLowerCase() === 'submit') ||
        labels[0];
      const alternatives = labels.filter(
        (x) => labelOf(x).trim().toLowerCase() !== labelOf(preferred).trim().toLowerCase(),
      );
      const label = labelOf(er.bool(0.5) ? preferred : er.pick(alternatives.length ? alternatives : labels));
      const placement = ctx.finish
        ? null
        : label === labelOf(preferred)
          ? 'toolbar'
          : er.pick(['toolbar', 'footer', 'link', 'icon']);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const choices = [...new Set(labels.map(labelOf))].filter((x) => x.toLowerCase() !== label.toLowerCase());
        if (choices.length) collide = cr.pick(choices);
      }
      const top = u.el('header', 'cc-titlebar', document.body);
      u.el('span', 'cc-mark', top, '◆');
      u.el('strong', '', top, C.brand);
      u.el('span', 'cc-window-controls', top, '−　□　×');
      const toolbar = u.el('div', 'cc-toolbar', document.body);
      u.el('div', 'cc-tasktitle', toolbar, 'Document to Form');
      let submit = null;
      const makeEnd = (parent, cls, text, tag = 'button') => {
        const b = u.el(tag, cls, parent, text);
        if (tag === 'button') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.title = text;
        b.setAttribute('aria-label', text);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (!ctx.finish && placement === 'toolbar') submit = makeEnd(top, 'cc-end', label);
      if (collide) {
        const b = u.el('button', 'cc-xtra', top, collide);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      let mode = ctx.display === 'hidden' ? 'hidden' : ctx.display;
      if ((mode === 'panel' && window.innerWidth < 1260) || (mode === 'toast' && window.innerHeight < 700))
        mode = 'header';
      if (mode === 'header') {
        const n = u.el('div', 'cc-instruction-header', top, ctx.instruction);
      }
      const main = u.el('div', 'cc-main' + (mode === 'toast' ? ' cc-main-toast' : ''), document.body);
      if (mode === 'panel') {
        const p = u.el('aside', 'cc-instruction-panel', main);
        u.el('strong', '', p, 'Task note');
        u.el('div', '', p, ctx.instruction);
      }
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const n = u.el('aside', 'cc-toast', main, ctx.instruction);
      }
      const dock = u.el('footer', 'cc-dock', document.body),
        nav = u.el('nav', 'cc-nav', dock);
      [
        ['⌂', 'Home'],
        ['▣', 'Document to Form'],
        ['▱', 'Claims'],
        ['▤', 'Documents'],
        ['⚙', 'Settings'],
      ].forEach(([icon, text], i) => {
        const b = u.el('div', i === 1 ? 'cc-navitem active' : 'cc-navitem', nav);
        u.el('span', 'cc-navicon', b, icon);
        u.el('span', '', b, text);
      });
      const stats = u.el('div', 'cc-stats', dock);
      u.el('span', '', stats, '1 document');
      u.el('i', '', stats);
      u.el('span', '', stats, '0 of 6 fields completed');
      u.el('b', 'cc-progress', stats);
      if (!ctx.finish && placement === 'footer') submit = makeEnd(stats, 'cc-dock-end', label);
      if (!ctx.finish && placement === 'link') submit = makeEnd(stats, 'cc-link', label, 'a');
      if (!ctx.finish && placement === 'icon') {
        const b = makeEnd(stats, 'cc-icon-end', '✓');
        b.title = label;
        b.setAttribute('aria-label', label);
        submit = b;
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'cc-overlay cc-overlay-' + ctx.kind, document.body);
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
