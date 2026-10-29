(function () {
  'use strict';
  const C = {
    'site': 'design-act-in-time-delay-09',
    'brand': 'Focus Timer',
    'title': 'Focus Timer',
    'instruction': 'top',
    'rail': 'Toolchest|Desktop|Files|Applications|System|Help',
    'menu': 'File|Edit|Tasks|View|Help',
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
      const er = ctx.rng.fork('chrome/end');
      const labelBank =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const commonLabel = labelBank.find((x) => labelOf(x).trim().toLowerCase() === 'submit') || labelBank[0];
      const baseline = !ctx.finish && er.bool(0.5);
      const placement = ctx.finish ? null : baseline ? 'footer' : er.pick(['header', 'panel']);
      const label = baseline ? labelOf(commonLabel) : labelOf(er.pick(labelBank));
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = labelBank.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) collide = { text: cr.pick(pool), where: cr.pick(['header', 'panel']) };
      }
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, C.brand);
      const headerTools = u.el('div', 'ds-top-tools', top);
      u.el('span', 'ds-window-controls', top, '−    □    ×');
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
      const panelTools = u.el('div', 'ds-panel-tools', content);
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
      const endBtn = (host, cls, text) => {
        const b = u.el('button', cls, host, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', text);
        b.title = text;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'footer') submit = endBtn(foot, 'ds-submit', label);
        if (placement === 'header') submit = endBtn(headerTools, 'ds-submit ds-submit-header', label);
        if (placement === 'panel') submit = endBtn(panelTools, 'ds-submit ds-submit-panel', label);
      }
      if (collide) {
        const host = collide.where === 'header' ? headerTools : panelTools;
        const b = u.el(
          'button',
          collide.where === 'header' ? 'ds-xtra ds-xtra-header' : 'ds-xtra ds-xtra-panel',
          host,
          collide.text,
        );
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide.text, collide: true }));
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
