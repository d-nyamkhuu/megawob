(function () {
  'use strict';
  const C = {
    'site': 'design-fill-form-email-12',
    'brand': 'Mail',
    'title': 'Add Contact',
    'instruction': 'right',
    'rail': '',
    'menu': 'Reply|Reply All|Forward|Delete|Flag',
    'briefTitle': 'Instructions',
  };
  const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      if (C.menu && false) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
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
      const qa = u.el('div', 'ds-quick', foot);
      qa.setAttribute('aria-disabled', 'true');
      u.el('span', 'ds-qbolt', qa, '⚡');
      const qt = u.el('div', 'ds-qtext', qa);
      u.el('b', '', qt, 'Quick action');
      u.el('i', '', qt, 'Auto-fill from email');
      u.el('small', 'ds-qnote', foot, 'Unavailable at this time');
      u.el('span', 'ds-divider', foot);
      const clr = u.el('button', 'ds-clear', foot, 'Clear form');
      clr.type = 'button';
      // Separate streams leave every existing seeded choice untouched.
      const er = ctx.rng.fork('chrome/end');
      const labels = ctx.content.END_LABELS.map(labelOf);
      const original = er.bool(0.5);
      const placement = original ? 'footer' : er.pick(['header', 'link']);
      const label = original ? 'Submit' : er.pick(labels);
      let submit = null;
      foot.classList.toggle('ds-finish', !!ctx.finish);
      if (!ctx.finish) {
        const parent = placement === 'header' ? u.el('div', 'ds-end-tools', main) : foot;
        submit = u.el(placement === 'link' ? 'a' : 'button', 'ds-submit ds-end-' + placement, parent, label);
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        if (placement === 'header') u.el('div', 'ds-entry-status', foot, 'Manual entry');
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const text = cr.pick(options);
          const decoy = u.el('button', 'ds-xtra', foot, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      // Only shrink notes that would otherwise clip a long instruction.
      const note = main.querySelector('.ds-brief .ds-instruction');
      if (note) {
        let fs = parseFloat(getComputedStyle(note).fontSize);
        while (note.getBoundingClientRect().height > note.parentElement.clientHeight - 4 && fs > 12) {
          fs -= 0.5;
          note.style.fontSize = fs + 'px';
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
