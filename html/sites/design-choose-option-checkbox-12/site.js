(function () {
  'use strict';
  const C = {
    'site': 'design-choose-option-checkbox-12',
    'brand': 'Preferences - Topic Selection',
    'instruction': 'top',
    'rail': '',
    'menu': 'File|Edit|View|Help',
    'briefTitle': 'Your Task',
  };
  env.site({
    name: C.site,
    initialOverlay: { kind: 'tour' },
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const win = u.el('div', 'sf-win', document.body);
      const top = u.el('header', 'ds-top', win);
      u.el('span', 'sf-home', top);
      u.el('span', 'ds-brand', top, 'StayFinder');
      ['Stays', 'Experiences', 'Saved', 'Trips'].forEach((t) => u.el('span', 'sf-nav', top, t));
      u.el('span', 'sf-avatar', top);
      const hero = u.el('div', 'sf-hero', win);
      u.el('div', 'sf-h1', hero, 'Explore your next stay');
      u.el('div', 'sf-h2', hero, 'Homes, apartments and more');
      u.el('span', 'sf-mount', hero);
      const body = u.el('div', 'ds-body', win);
      const rail = u.el('aside', 'ds-rail', body);
      u.el('div', 'sf-ft', rail, 'Filters');
      u.el('div', 'sf-fs', rail, 'Narrow down your results');
      ['Location', 'Dates', 'Guests', 'Amenities', 'Property type'].forEach((t) => {
        const it = u.el('div', 'sf-item' + (t === 'Amenities' ? ' on' : ''), rail);
        u.el('span', 'sf-ic', it);
        u.el('span', '', it, t);
      });
      const side = u.el('aside', 'sf-side', document.body);
      const sh = u.el('div', 'sf-sh', side, 'Your search');
      u.el('span', '', sh, '—');
      ['San Diego, CA', 'Apr 12, 2015 – Apr 18, 2015', '2 guests'].forEach((t) => {
        const r = u.el('div', 'sf-row', side);
        u.el('span', 'sf-ic sm', r);
        u.el('span', '', r, t);
      });
      u.el('hr', 'sf-hr', side);
      u.el('div', 'sf-img', side);
      u.el('div', 'sf-pt', side, 'Find the perfect place');
      u.el('div', 'sf-ps', side, 'Apply filters to see updated results.');
      const content = u.el('div', 'ds-content', body);
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
      const foot = u.el('footer', 'ds-footer', win);
      u.el('span', '', foot, 'Clear all filters');
      let submit = null;
      const er = ctx.rng.fork('chrome/end');
      const labels = (
        (ctx.content && ctx.content.END_LABELS) || [
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
        ]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      const base = er.bool(0.5);
      const placement = base ? 'footer' : er.pick(['header', 'footer-link', 'header']);
      const label = base ? 'Submit' : er.pick(labels);
      const decoyBtn = (parent, text, collide) => {
        const b = u.el('button', 'sf-reset ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', collide ? { label: text, collide: true } : { label: text }));
        return b;
      };
      if (!ctx.finish) {
        const rs = u.el('button', 'sf-reset', foot, 'Reset');
        rs.type = 'button';
        rs.dataset.role = 'xtra';
        rs.addEventListener('click', () => env.log('decoy', { label: 'Reset' }));
        if (placement === 'footer') {
          submit = u.el('button', 'ds-submit', foot, label);
          submit.type = 'button';
        } else if (placement === 'footer-link') {
          submit = u.el('a', 'ds-endlink', foot, label + ' ›');
          submit.href = '#';
        } else {
          submit = u.el('button', 'ds-submit ds-header-end', top, label);
          submit.type = 'button';
        }
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const pool = Array.from(labels).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) decoyBtn(foot, cr.pick(pool), true);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      if (ctx.initial) {
        const stage = document.querySelector('.ds-stage');
        if (stage) stage.inert = true;
        const obstacle = u.el('section', 'ds-initial ds-initial-tour', document.body);
        const close = u.el('button', '', obstacle, 'Expand tools  ⌄');
        close.type = 'button';
        close.addEventListener('click', () => {
          if (stage) stage.inert = false;
          ctx.dismiss('close');
          env.log('reference-obstruction-dismiss', { kind: 'tour' });
        });
        return { el: obstacle, dismiss: close };
      }
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
