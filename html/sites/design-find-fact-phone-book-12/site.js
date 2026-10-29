(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-phone-book-12',
    'brand': 'Address Book',
    'title': 'People you work with',
    'instruction': 'top',
    'rail': '',
    'menu': '',
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
      const top = u.el('header', 'ds-top', document.body);
      const icon = u.el('span', 'ds-appicon', top);
      icon.innerHTML =
        '<svg viewBox="0 0 30 30" aria-hidden="true"><path fill="#eeeae0" stroke="#333" d="M5 4h20v22H5z"/><path fill="#888" stroke="#222" d="M8 7h15v16H8z"/><path fill="#eee" d="M10 8h11v14H10z"/><path stroke="#922" d="M13 9v11m3-10v10m3-8v7"/><path stroke="#222" d="M3 27h24M4 3h22"/></svg>';
      u.el('span', 'ds-brand', top, C.brand);
      const wb = u.el('span', 'ds-wbtns', top);
      ['_', '□', '×'].forEach((t) => u.el('i', '', wb, t));
      const nav = u.el('nav', 'ds-menu', document.body);
      ['File', 'Edit', 'View', 'Actions', 'Help'].forEach((t) => u.el('span', '', nav, t));
      u.el('span', 'ds-clock', nav, 'Mon Apr 15   10:24 AM');
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      const natural = C.instruction;
      let mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : natural;
      const viewportWidth = (ctx.size && ctx.size.width) || document.documentElement.clientWidth;
      if ((mode === 'left' && viewportWidth < 1260) || (mode === 'toast' && viewportWidth < 1100)) mode = 'top';
      const er = ctx.rng.fork('chrome/end');
      const endPlacement = ctx.finish ? null : er.pick(['side', 'footer', 'header', 'side']);
      const endBank = ctx.content && ctx.content.END_LABELS;
      const endLabels =
        Array.isArray(endBank) && endBank.length
          ? endBank
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const endRaw = endPlacement === 'side' ? 'Submit' : er.pick(endLabels);
      const endLabel =
        typeof endRaw === 'string' ? endRaw : endRaw.label || endRaw.text || endRaw.name || String(endRaw);
      const cr = ctx.rng.fork('chrome/collide');
      const collide = cr.bool(0.3)
        ? cr.pick(
            endLabels
              .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
              .filter((x) => String(x).trim().toLowerCase() !== String(endLabel).trim().toLowerCase()),
          )
        : null;
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
      const side = u.el('aside', 'ds-side', main);
      const sv = u.el('button', 'ds-save', side, 'Save View…');
      sv.type = 'button';
      sv.addEventListener('click', () => env.log('decoy', { label: 'Save View…' }));
      u.el('div', 'ds-savenote', side, 'Saves only your presentation preferences (column widths, sort order, etc).');
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', 'ds-total', foot, 'Contacts');
      u.el('span', 'ds-sel', foot, 'No contact selected');
      let submit = null;
      if (collide) {
        const d = u.el('button', 'ds-xtra-end', nav, collide);
        d.type = 'button';
        d.dataset.role = 'xtra';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      if (!ctx.finish) {
        const parent = endPlacement === 'footer' ? foot : endPlacement === 'header' ? nav : side;
        submit = u.el('button', 'ds-submit' + (endPlacement === 'header' ? ' ds-end-header' : ''), parent, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', endLabel);
        submit.title = endLabel;
        submit.addEventListener('click', () => ctx.submit());
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
