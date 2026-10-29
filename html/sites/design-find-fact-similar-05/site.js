(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-similar-05',
    'brand': 'Word Finder',
    'title': 'Word Options',
    'instruction': 'left',
    'rail': '',
    'menu': '',
    'briefTitle': 'Task',
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
      const book =
        '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.3"><path d="M16 6C10 2 4 3 3 5v23c5-2 9-2 13 0 4-2 8-2 13 0V5c-3-2-9-2-13 1Zm0 0v22M7 9h5M7 13h5M20 9h5M20 13h5"/></svg>';
      const top = u.el('header', 'ds-top', document.body);
      const appIcon = u.el('span', 'ds-app-icon', top);
      appIcon.innerHTML = book;
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', '', top, '−    □    ×');
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      document.body.classList.toggle('ds-finish', !!ctx.finish);
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
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
      const ends = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
      ];
      const er = ctx.rng.fork('chrome/end');
      const placement = ctx.finish ? null : er.pick(['link', 'footer', 'footer', 'header', 'footer']);
      const label =
        !ctx.finish && er.bool(0.5)
          ? 'Submit'
          : (ends.filter((x) => String(x).toLowerCase() !== 'submit')[0] &&
              er.pick(ends.filter((x) => String(x).toLowerCase() !== 'submit'))) ||
            'Done';
      const cr = ctx.rng.fork('chrome/collide');
      const collide =
        !ctx.finish && cr.bool(0.3)
          ? cr.pick(
              ends
                .map((x) => (typeof x === 'string' ? x : x.label || x.text || String(x)))
                .filter((x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase()),
            )
          : null;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') {
          const heading = u.el('h2', '', b, C.briefTitle || 'Task');
          const icon = u.el('span', 'ds-book', heading);
          icon.innerHTML = book;
        }
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'top') briefing(content, 'ds-header-note');
      const main = u.el('div', 'ds-main', content);
      main.classList.toggle('ds-panel-mode', ctx.display === 'panel');
      if (mode === 'left' || mode === 'right') {
        const b = briefing(main, 'ds-brief');
        if (mode === 'right') b.style.order = '2';
      }
      const workspace = u.el('section', 'ds-workspace', main);
      const stage = u.el('main', 'ds-stage', workspace);
      if (mode === 'toast') {
        const note = briefing(content, 'ds-toast');
        content.insertBefore(note, main);
      }
      const foot = u.el('footer', 'ds-footer', workspace);
      const clear = u.el('button', 'ds-clear', foot, 'Clear All');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        if (env.widgetDef.clear) env.widgetDef.clear();
      });
      u.el('span', '', foot, 'Ready');
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
      if (!ctx.finish) {
        if (placement === 'header') {
          const tools = u.el('div', 'ds-header-tools', document.body);
          submit = makeEnd(tools, 'ds-submit ds-submit-head', label);
        } else if (placement === 'link') submit = makeEnd(foot, 'ds-end-link', label + ' ›');
        else submit = makeEnd(foot, 'ds-submit', label);
        if (collide) {
          const d = u.el('button', 'ds-xtra', foot, collide);
          d.type = 'button';
          d.dataset.role = 'xtra';
          d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
        }
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
