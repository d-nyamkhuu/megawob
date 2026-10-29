(function () {
  'use strict';
  const cfg = { title: 'Knowledge Guide', menus: ['File', 'Edit', 'View', 'Go', 'Help'] };
  env.site({
    name: 'design-click-control-collapsible-02',
    styles: ['site.css', 'gtk.css'],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const collideRng = ctx.rng.fork('chrome/collide');
      const endBank = Array.isArray(ctx.content && ctx.content.END_LABELS)
        ? ctx.content.END_LABELS
        : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const endText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      // Preserve the depicted bottom-right Submit control as the most common case.
      const placement = ctx.finish ? null : endRng.pick(['footer', 'footer', 'footer', 'toolbar', 'footer-link']);
      const label = placement === 'footer' && endRng.bool(0.72) ? 'Submit' : endText(endRng.pick(endBank));
      const collide = collideRng.bool(0.3)
        ? endText(
            collideRng.pick(endBank.filter((x) => endText(x).trim().toLowerCase() !== label.trim().toLowerCase())),
          )
        : null;
      document.body.className = 'ref gtk';
      const win = u.el('main', 'gwin', document.body);
      const tb = u.el('header', 'gtitle', win);
      const ic = u.el('span', 'gicon', tb);
      ic.innerHTML =
        '<svg viewBox="0 0 20 20" aria-hidden="true"><defs><linearGradient id="paper" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#d9dfed"/></linearGradient></defs><rect x="1" y="1" width="18" height="18" rx="4" fill="url(#paper)" stroke="#476181"/><path d="M4 5h5l2 2h5v9H4Z" fill="#9aaabe" stroke="#687a94"/><path d="M6 5v8l3-1 2 2 3-1V6l-3 1-2-2Z" fill="#f8f6eb" stroke="#9d9a8c" stroke-width=".6"/><path d="M6 8h2m3 2h2m-7 1h2m3 1h2" stroke="#78859b" stroke-width=".6"/></svg>';
      u.el('span', 'gtitle-text', tb, cfg.title);
      const wc = u.el('span', 'gwc', tb);
      wc.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M4 12h8"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3.5 3.5h9v9h-9Z"/></svg></i><i class="gx"><svg viewBox="0 0 16 16"><path d="m3.5 3.5 9 9M12.5 3.5l-9 9"/></svg></i>';
      const mb = u.el('nav', 'gmenu', win);
      cfg.menus.forEach((m) => u.el('span', '', mb, m));
      const actionGroup = u.el('div', 'gmenu-actions', mb);
      const addDecoy = (parent, text) => {
        const b = u.el('button', 'gtk-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      const addEnd = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.title = text;
        b.setAttribute('aria-label', text);
        b.addEventListener('click', ctx.submit);
        return b;
      };
      if (collide && placement === 'toolbar') addDecoy(actionGroup, collide);
      let topSubmit = null;
      if (placement === 'toolbar') topSubmit = addEnd(actionGroup, 'gtk-top-end', label);
      const work = u.el('div', 'gwork', win);
      const index = u.el('nav', 'gindex', work);
      const sheet = u.el('section', 'gsheet', work);
      const note = u.el('div', 'instruction', sheet, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', sheet);
      const foot = u.el('footer', 'footer', sheet);
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'footer') submit = addEnd(foot, 'submit', label);
        else if (placement === 'footer-link') {
          const link = u.el('a', 'gtk-end-link', foot, label + ' ›');
          link.href = '#';
          link.title = label;
          link.setAttribute('aria-label', label);
          link.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          submit = link;
        }
        if (collide && placement !== 'toolbar') addDecoy(foot, collide);
      }
      // side index: static line numbers (filler)
      for (let n = 37; n <= 50; n++) u.el('span', '', index, String(n));
      return { stage, submit: ctx.finish ? null : submit || topSubmit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
