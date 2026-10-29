(function () {
  'use strict';
  const C = {
    'site': 'design-act-in-time-chase-09',
    'brand': 'Mouse Tracking Task',
    'title': 'Mouse Tracking Task',
    'instruction': 'top',
    'rail': '',
    'menu': 'File|Edit|View|Help',
    'briefTitle': 'Progress',
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
      u.el('span', 'ds-brand', top, C.brand);
      const meta = u.el('div', 'ds-window-meta', top);
      ['−', '□', '×'].forEach((t) => {
        const b = u.el('button', '', meta, t);
        b.type = 'button';
      });
      const nav = u.el('nav', 'ds-menu', document.body);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      const body = u.el('div', 'ds-body', document.body);
      const content = u.el('div', 'ds-content', body);
      const natural = C.instruction;
      let mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : natural;
      if (mode === 'panel' && window.innerWidth < 1100) mode = 'top';
      if (mode === 'toast' && window.innerHeight < 680) mode = 'top';
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        else if (cls === 'ds-panel-note') u.el('h2', '', b, 'Instructions');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      const brief = u.el('aside', 'ds-brief ds-inspector', main);
      brief.dataset.role = 'inspector';
      if (mode === 'panel') briefing(brief, 'ds-panel-note');
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
      const labels = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
      ];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endRng = ctx.rng.fork('chrome/end');
      const labelPool = labels.map(labelOf);
      const label = endRng.bool(0.5)
        ? labelPool.find((x) => x.toLowerCase() === 'submit') || labelPool[0]
        : endRng.pick(labelPool);
      const placement = ctx.finish
        ? null
        : label.trim().toLowerCase() === 'submit'
          ? 'footer'
          : endRng.pick(['toolbar', 'link']);
      let submit = null;
      const makeEnd = (parent, cls, text, tag) => {
        const b = u.el(tag || 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const collideRng = ctx.rng.fork('chrome/collide');
      let collision = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const options = [...new Set(labelPool)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) collision = collideRng.pick(options);
      }
      const collideBtn = (parent) => {
        if (!collision) return;
        const b = u.el('button', 'ds-xtra', parent, collision);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collision, collide: true }));
      };
      if (placement === 'footer') submit = makeEnd(foot, 'ds-submit', label);
      if (placement === 'toolbar') {
        const b = makeEnd(nav, 'ds-toolbar-end', label);
        submit = b;
      }
      if (placement === 'link') {
        submit = makeEnd(nav, 'ds-end-link', label, 'a');
      }
      collideBtn(nav);
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
