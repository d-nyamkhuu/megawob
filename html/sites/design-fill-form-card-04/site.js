(function () {
  'use strict';
  const C = {
    'site': 'design-fill-form-card-04',
    'instruction': 'left',
    'menu': 'File|Edit|Windows|Special|Help',
    'clock': 'Mon Apr 16   9:24 AM',
  };
  const APPLE =
    '<svg viewBox="0 0 24 28" width="22" height="26"><path d="M17 1c0 2-1.5 4-3.800 4.200C13 3 14.800 1 17 1zM12 7c1.200-.8 2.600-1.200 4-.8 1.500.4 2.400 1.200 3 2-2.500 1.500-2.800 5 .2 6.400-1 2.800-3.200 6.400-5.400 6.400-1.200 0-1.400-.8-2.800-.8s-1.700.8-2.800.8C5.800 21 2 15.500 2 11.500 2 7.500 5.200 6 7.500 6.200 9.500 6.400 10.500 7.800 12 7z" fill="#111"/></svg>';
  const FOLDER =
    '<svg viewBox="0 0 80 60" width="100%" height="100%"><path d="M3 10l5-5h22l6 7h39v46H3z" fill="#dedbd0" stroke="#111" stroke-width="2.500" stroke-linejoin="round"/></svg>';
  const TRASH =
    '<svg viewBox="0 0 50 70" width="100%" height="100%"><path d="M4 15l2 50q19 5 38 0l2-50" fill="#ece9de" stroke="#111" stroke-width="2.5"/><path d="M11 22l1 39m6-38v40m7-40v41m7-41v40m7-40-1 38" stroke="#111" stroke-width="2"/><ellipse cx="25" cy="14" rx="23" ry="7" fill="#ece9de" stroke="#111" stroke-width="2.5"/><path d="M6 12q19 8 38 0M19 10V3q6-4 12 0v7" fill="#ece9de" stroke="#111" stroke-width="2"/></svg>';
  function episodeEnd(ctx) {
    const r = ctx.rng.fork('chrome/end');
    const labels = ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
    const original = r.bool(0.5);
    return {
      placement: original ? 'footer' : r.pick(['title', 'link']),
      label: original ? 'Submit' : r.pick(labels),
      labels,
    };
  }
  function decoyBtn(ctx, parent, label, placement, collide) {
    const b = ctx.util.el('button', 'ds-xtra ds-end-' + placement, parent, label);
    b.type = 'button';
    b.dataset.role = 'xtra';
    b.addEventListener('click', () => env.log('decoy', collide ? { label, collide: true } : { label }));
    return b;
  }
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
      const logo = u.el('span', 'ds-apple', top);
      logo.innerHTML = APPLE;
      C.menu.split('|').forEach((t) => u.el('span', 'ds-mi', top, t));
      u.el('span', 'ds-clock', top, C.clock);
      const dI = u.el('div', 'ds-icon ds-icon-docs', document.body);
      u.el('div', 'ds-glyph', dI).innerHTML = FOLDER;
      u.el('span', 'ds-cap', dI, 'Documents');
      const tI = u.el('div', 'ds-icon ds-icon-trash', document.body);
      u.el('div', 'ds-glyph', tI).innerHTML = TRASH;
      u.el('span', 'ds-cap', tI, 'Trash');
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const desktop = document.documentElement;
      const roomy = desktop.clientWidth >= 1200 && desktop.clientHeight >= 700;
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : !roomy
            ? 'top'
            : ctx.display === 'panel'
              ? 'left'
              : ctx.display === 'toast'
                ? 'toast'
                : 'top';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        // Long templates use the full-width stationery instead of overflowing a desktop note.
        if (cls !== 'ds-header-note' && b.scrollHeight > b.clientHeight + 1) b.className = 'ds-header-note';
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      if (mode === 'left') briefing(main, 'ds-brief');
      const stage = u.el('main', 'ds-stage', main);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      const end = episodeEnd(ctx);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'ds-submit ds-end-' + end.placement, foot, end.label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = end.label;
        submit.setAttribute('aria-label', end.label);
        submit.addEventListener('click', () => ctx.submit());
      }
      const cancel = u.el('button', 'ds-cancel', foot, 'Clear');
      cancel.type = 'button';
      cancel.dataset.role = 'xtra';
      cancel.addEventListener('click', () => env.log('decoy', { label: 'Clear' }));
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = [...new Set(end.labels)].filter(
          (x) => x.trim().toLowerCase() !== end.label.trim().toLowerCase(),
        );
        if (options.length)
          decoyBtn(ctx, content, cr.pick(options), end.placement === 'title' ? 'footer' : 'title', true);
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
