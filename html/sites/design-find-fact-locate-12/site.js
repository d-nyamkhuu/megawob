(function () {
  'use strict';
  const C = {
    site: 'design-find-fact-locate-12',
    brand: 'Technical Reference Library',
    instruction: 'top',
    rail: 'Help & Tips|Use the document to find the information you need.|You can:|• Read the sections|• Use the Find button (Ctrl+F) to search for a word|• Scroll to see more content|Each section lists names with their associated extensions or reference numbers.|Only the first section is shown. Click a section heading to expand it, or use Expand all to show every section.',
    menu: 'File|Edit|View|Go|Tools|Help',
    briefTitle: 'Help & Tips',
  };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util,
        top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-brand', top, '▣　' + C.brand);
      u.el('span', 'ds-window', top, '−　□　×');
      const nav = u.el('nav', 'ds-menu', document.body);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      const body = u.el('div', 'ds-body', document.body),
        rail = u.el('aside', 'ds-rail', body);
      C.rail.split('|').forEach((t, i) => u.el(i === 0 ? 'h2' : 'p', i === 0 ? 'ds-rail-title' : '', rail, t));
      const content = u.el('div', 'ds-content', body),
        natural = 'hidden';
      let mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : 'top';
      if (mode === 'left' && window.innerWidth < 1260) mode = 'top';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle);
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
      u.el('div', 'ds-dockitem', foot, '▣　Workplace Shell');
      u.el('div', 'ds-dockitem ds-active', foot, '▤　Technical Reference Library');
      u.el('div', 'ds-dockitem', foot, '✉　Mail');
      u.el('div', 'ds-dockitem', foot, '▦　Calendar');
      u.el('div', 'ds-dockitem', foot, '▧　Programs');
      u.el('div', 'ds-dockitem', foot, '◈　Shredder');
      let submit = null;
      const er = ctx.rng.fork('chrome/end'),
        labels = (
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
          ]
        ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const baseline = !ctx.finish && er.bool(0.5),
        placement = ctx.finish ? null : baseline ? 'footer' : er.pick(['header', 'link']),
        label = ctx.finish
          ? ''
          : baseline
            ? 'Apply'
            : er.pick(labels.filter((x) => String(x).toLowerCase() !== 'submit'));
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = labels.filter((x) => String(x).toLowerCase() !== String(label).toLowerCase());
        if (pool.length) collide = cr.pick(pool);
      }
      const decoy = (p, t, c) => {
        const b = u.el('button', 'ds-xtra', p, t);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', c ? { label: t, collide: true } : { label: t }));
      };
      const end = (p, cls, t) => {
        const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, p, t);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      if (collide) decoy(placement === 'footer' ? foot : top, collide, true);
      if (placement === 'header') submit = end(top, 'ds-submit ds-header-submit', label);
      if (placement === 'footer') submit = end(foot, 'ds-submit', label);
      if (placement === 'link') submit = end(foot, 'ds-endlink', label + ' ›');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
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
