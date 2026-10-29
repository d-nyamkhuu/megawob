(function () {
  'use strict';
  const C = {
    'site': 'design-find-fact-find-word-03',
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
      const top = u.el('header', 'ds-top', document.body);
      const mb = u.el('span', 'ds-menus', top);
      mb.innerHTML =
        '<svg width="30" height="30" viewBox="0 0 30 30"><path d="M15 1L3 14h24z M3 16h24L15 29z" fill="#000"/></svg>';
      ['File', 'Edit', 'Find', 'Options', 'Help'].forEach((t) => u.el('span', '', mb, t));
      u.el('span', 'ds-clock', top, 'Mon  Jun 16, 1987      10:24 AM');
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      const IC = {
        Tasks: '<path d="M7 3h17l7 7v25H7zM24 3v8h7M11 13h15M11 18h15M11 23h15M11 28h15"/>',
        Lookup: '<path d="M2 9V6h10l4 4h17v4H2z" fill="#fff"/><path d="M1 12h36v24H1z" fill="#fff"/>',
        Notes: '<path d="M7 6h24v28H7zM11 2v8M16 2v8M22 2v8M27 2v8M10 13h18M11 18h14M11 23h14M11 28h8M27 29l5 4-4 3"/>',
        Settings:
          '<path d="M16 2h6l1 4 4 2 4-2 4 5-3 4 1 4 4 2-1 6-5 1-3 3v5l-6 2-3-4h-4l-3 4-6-3 1-5-3-3-4-1v-6l4-2 1-4-2-4 4-4 4 2 4-2z"/><circle cx="19" cy="20" r="7"/>',
        Exit: '<path d="M5 9h28l-2-3H24l-2-3h-7l-2 3H7zM7 10l2 25h20l2-25M13 14v17M19 14v17M25 14v17"/>',
      };
      ['Tasks', 'Lookup', 'Notes', 'Settings', 'Exit'].forEach((t) => {
        const it = u.el('div', 'ds-ri' + (t === 'Lookup' ? ' on' : '') + (t === 'Exit' ? ' exit' : ''), rail);
        const ic = u.el('span', 'ds-ico', it);
        ic.innerHTML =
          '<svg viewBox="0 0 38 38" width="100%" height="100%" fill="none" stroke="currentColor" stroke-width="2">' +
          IC[t] +
          '</svg>';
        u.el('span', '', it, t);
      });
      const content = u.el('div', 'ds-content', body);
      const tb = u.el('div', 'ds-titlebar', content);
      u.el('span', 'ds-dia', tb, '◆');
      u.el('span', 'ds-wt', tb, 'Word Finder');
      const wb = u.el('span', 'ds-wb', tb);
      ['–', '□', '×'].forEach((t) => u.el('b', '', wb, t));
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : 'top';
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
      let submit = null;
      const endR = ctx.rng.fork('chrome/end');
      const words =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const text = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      let label = endR.bool(0.5) ? 'Submit' : text(endR.pick(words));
      const placement = endR.pick(['title', 'footer', 'footer', 'footer', 'link', 'icon']);
      if (placement === 'footer') label = 'Submit';
      const end = (parent, cls, shown) => {
        const b = u.el(cls === 'ds-endlink' ? 'a' : 'button', cls, parent, shown);
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
      const decoy = (parent, word) => {
        const b = u.el('button', 'ds-xtra', parent, word);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: word, collide: true }));
        return b;
      };
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideR.bool(0.3)) {
        const options = [...new Set(words.map(text))].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (options.length) collide = text(collideR.pick(options));
      }
      if (collide) {
        const target = collideR.pick(['title', 'footer']);
        decoy(target === 'title' ? tb : foot, collide);
      }
      if (!ctx.finish) {
        if (placement === 'footer') submit = end(foot, 'ds-submit', label);
        else if (placement === 'link') submit = end(foot, 'ds-endlink', label + ' ›');
        else if (placement === 'title') submit = end(tb, 'ds-title-end', label);
        else submit = end(tb, 'ds-title-icon', '✓');
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
