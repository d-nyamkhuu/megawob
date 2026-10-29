(function () {
  'use strict';
  const C = {
    site: 'design-find-fact-locate-06',
    brand: 'Facilities Handbook.pdf - Document Viewer',
    instruction: 'hidden',
    briefTitle: 'Task',
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
      const title = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-appicon', title, '▣');
      u.el('span', 'ds-brand', title, C.brand);
      u.el('span', 'ds-window-controls', title, '−　□　×');
      const menu = u.el('nav', 'ds-menu', document.body);
      ['File', 'Edit', 'View', 'Go', 'Tools', 'Help'].forEach((t) => u.el('span', '', menu, t));
      const bar = u.el('div', 'ds-toolbar', document.body);
      u.el('span', 'ds-toolicon', bar, '▱');
      u.el('span', '', bar, 'Open');
      u.el('span', 'ds-toolicon', bar, '▤');
      u.el('span', '', bar, 'Print');
      u.el('i', 'ds-sep', bar);
      u.el('span', 'ds-toolicon', bar, '‹');
      u.el('span', '', bar, 'Previous');
      u.el('span', 'ds-toolicon', bar, '›');
      u.el('span', '', bar, 'Next');
      u.el('i', 'ds-sep', bar);
      u.el('span', 'ds-toolicon', bar, '⌕');
      u.el('span', '', bar, 'Find (Ctrl+F)');
      u.el('span', 'ds-fit', bar, '▣　Fit Width⌄');
      const content = u.el('div', 'ds-content', document.body);
      const mode = ctx.display === 'hidden' ? 'hidden' : ctx.display;
      let note = null;
      if (mode === 'header') note = u.el('div', 'ds-header-note', content, ctx.instruction);
      const stage = u.el('main', 'ds-stage', content);
      const rail = u.el('aside', 'ds-docnav', stage);
      u.el('strong', '', rail, 'Document');
      [
        '1. Phone Extensions',
        '2. Building Access',
        '3. IT Support',
        '4. Facilities Services',
        '5. Safety and Security',
        '6. Meeting Rooms',
        '7. General Information',
      ].forEach((x, i) => u.el('div', i ? '' : 'active', rail, (i ? '›　' : '⌄　') + x));
      u.el(
        'aside',
        'ds-tips',
        stage,
        'Tips\n\n•　Use the Find button (Ctrl+F) to search for a term on the page.\n\n•　The document has 7 sections. You can expand a section to read more details.\n\n•　Scroll within the document pane if needed.\n\n•　The term you’re looking for appears exactly once in the document.',
      );
      if (mode === 'panel') {
        const n = u.el('aside', 'ds-brief', content);
        u.el('h2', '', n, 'Task');
        u.el('div', 'ds-instruction', n, ctx.instruction);
      }
      if (mode === 'toast') {
        const n = u.el('aside', 'ds-toast', content, ctx.instruction);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
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
        ]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const baseline = !ctx.finish && er.bool(0.5);
      const placement = ctx.finish ? null : baseline ? 'footer' : er.pick(['header', 'link']);
      const label = ctx.finish ? '' : baseline ? 'Apply' : er.pick(labels);
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) collide = cr.pick(labels.filter((x) => x !== label));
      const decoy = (p, t, c) => {
        const b = u.el('button', 'ds-xtra', p, t);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', c ? { label: t, collide: true } : { label: t }));
      };
      const end = (p, cl, t) => {
        const b = u.el(cl === 'ds-endlink' ? 'a' : 'button', cl, p, t);
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
      const tools = u.el('div', 'ds-tools', title);
      if (collide) decoy(placement === 'footer' ? foot : tools, collide, true);
      if (placement === 'header') submit = end(tools, 'ds-submit ds-header-submit', label);
      if (placement === 'footer') submit = end(foot, 'ds-submit', label);
      if (placement === 'link') submit = end(foot, 'ds-endlink', label + ' ›');
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
