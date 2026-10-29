(function () {
  'use strict';
  const C = {
    site: 'design-find-fact-locate-04',
    brand: 'Building Materials Reference',
    instruction: 'top',
    rail: '',
    menu: '',
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
      const top = u.el('header', 'ds-top', document.body);
      u.el('span', 'ds-appicon', top, '◉');
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'ds-window-controls', top, '−　□　×');
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
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
      if (mode === 'left') {
        const b = briefing(main, 'ds-brief');
      }
      const stage = u.el('main', 'ds-stage', main);
      const help = u.el('aside', 'ds-help', main);
      u.el('h3', '', help, 'Help');
      u.el('h4', '', help, 'About this document');
      u.el(
        'p',
        '',
        help,
        'This reference lists common building materials and the file extension used for their design files. The information is grouped into seven sections. Click a section heading to view its details.',
      );
      u.el('h4', 'ds-tips-title', help, 'Tips');
      const ul = u.el('ul', '', help);
      [
        'Only the first section is expanded. Click a section heading to show or hide details.',
        'Use the scroll bar to view more content within a section.',
        'You can use Find (Ctrl+F) to search for a material name in the document.',
      ].forEach((t) => u.el('li', '', ul, t));
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', 'ds-status', foot, 'Ready');
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
            ? 'Submit'
            : er.pick(labels.filter((x) => String(x).toLowerCase() !== 'submit'));
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && cr.bool(0.3)) {
        const pool = labels.filter((x) => String(x).toLowerCase() !== String(label).toLowerCase());
        if (pool.length) collide = cr.pick(pool);
      }
      const decoy = (parent, text, isCollide) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
      };
      const end = (parent, cls, text) => {
        const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, parent, text);
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
      const tools = u.el('div', 'ds-tools', top);
      if (collide) decoy(placement === 'footer' ? foot : tools, collide, true);
      if (placement === 'header') submit = end(tools, 'ds-submit ds-header-submit', label);
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
