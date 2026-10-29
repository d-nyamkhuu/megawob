(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-phone-book-10',
    'brand': 'Contact Book',
    'title': 'People you work with',
    'instruction': 'top',
    'rail': 'Contacts|Calendar|Notes|Settings',
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
      const endR = ctx.rng.fork('chrome/end');
      const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const labels = (ctx.content && ctx.content.END_LABELS) || [
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
      ];
      const label = endR.bool(0.5) ? 'Submit' : labelText(endR.pick(labels.filter((x) => labelText(x) !== 'Submit')));
      const placement = endR.pick(['header', 'footer', 'footer', 'link']);
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideR.bool(0.3)) {
        const pool = [
          ...new Set(labels.map(labelText).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
        ];
        if (pool.length)
          collide = { label: labelText(collideR.pick(pool)), where: collideR.pick(['header', 'footer']) };
      }
      const top = u.el('header', 'ds-top', document.body);
      const tl = u.el('span', 'ds-tl', top);
      ['#ff5f57', '#febc2e', '#28c840'].forEach((c) => {
        u.el('i', '', tl).style.background = c;
      });
      u.el('span', 'ds-brand', top, 'Contacts');
      const topTools = u.el('div', 'ds-chrome-tools', top);
      const decoyBtn = (parent, text, isCollide) => {
        const b = u.el('button', 'ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      const endBtn = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', () => ctx.submit());
        return b;
      };
      if (collide && collide.where === 'header') decoyBtn(topTools, collide.label, true);
      let submit = null;
      if (!ctx.finish && placement === 'header') submit = endBtn(topTools, 'ds-submit ds-top-submit', label);
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const body = u.el('div', 'ds-body', document.body);
      if (false) {
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
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        u.el('h2', '', b, 'Task');
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
      const side = u.el('aside', 'ds-side', body);
      const sq = u.el('div', 'ds-sq', side, 'Search Contacts');
      u.el('div', 'ds-sh', side, 'No Contact Selected');
      u.el('div', 'ds-av', side);
      u.el('div', 'ds-sn', side, 'Click a contact to view details.');
      let foot = null;
      if (
        (!ctx.finish && (placement === 'footer' || placement === 'link')) ||
        (collide && collide.where === 'footer')
      ) {
        foot = u.el('footer', 'ds-footer', side);
        if (collide && collide.where === 'footer') decoyBtn(foot, collide.label, true);
        if (!ctx.finish && (placement === 'footer' || placement === 'link')) {
          submit = endBtn(
            foot,
            placement === 'link' ? 'ds-end-link' : 'ds-submit',
            placement === 'link' ? label + ' ›' : label,
          );
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
