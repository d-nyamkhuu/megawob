(function () {
  'use strict';
  const C = {
    'site': 'design-fill-form-email-06',
    'brand': 'Civic Services',
    'title': 'Add Contact',
    'instruction': 'top',
    'rail': '',
    'menu': 'Home|Partners|Reports|Help',
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
      const logo = u.el('span', 'ds-logo', top);
      logo.innerHTML =
        '<svg viewBox="0 0 60 44" fill="currentColor"><circle cx="30" cy="10" r="9"/><circle cx="10" cy="14" r="6"/><circle cx="50" cy="14" r="6"/><path d="M16 40V32a14 14 0 0 1 28 0v8ZM1 40V31a9 9 0 0 1 13-8v17ZM46 40V23a9 9 0 0 1 13 8v9Z"/></svg>';
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'ds-sub', top, 'Community Partner Directory');
      const nav = u.el('nav', 'ds-menu', top);
      C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      const avatar = u.el('span', 'ds-user', top);
      avatar.innerHTML =
        '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#f6f9fb"/><circle cx="20" cy="14" r="6" fill="#264469"/><path d="M8 33v-5c0-9 24-9 24 0v5Z" fill="#264469"/></svg>';
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
      const clr = u.el('button', 'ds-clear', foot, 'Clear Form');
      clr.type = 'button';
      clr.addEventListener('click', () => {
        stage.dispatchEvent(new Event('ff-clear-form'));
      }); // Isolated streams keep the task's existing seeded content unchanged.
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const original = endRng.bool(0.5);
      const placement = original ? 'footer' : endRng.pick(['toolbar', 'link']);
      const endLabel = original ? 'Submit' : endRng.pick(labels);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? nav : foot;
        if (placement === 'toolbar') nav.classList.add('ds-end-toolbar');
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'ds-submit' + (placement === 'link' ? ' ds-endlink' : ''),
          parent,
          endLabel,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const options = [...new Set(labels)].filter((t) => t.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = collideRng.pick(options);
          const decoy = u.el('button', 'ds-xtra', foot, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
          foot.insertBefore(decoy, clr);
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
