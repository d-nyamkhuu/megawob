(function () {
  'use strict';
  const C = {
    site: 'design-set-date-range-01',
    brand: 'Rivermere Public Library',
    instruction: 'top',
    rail: '',
    menu: 'Home|Catalog Search|Research Tools|Help',
    briefTitle: 'Your Task',
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
        '<svg width="80" height="58" viewBox="0 0 80 58" fill="none" stroke="#6b1d2a" stroke-width="2.4"><path d="M40 10C30 4 16 4 9 6v43c12-2 22-1 31 4 9-5 19-6 31-4V6C60 4 50 4 40 10zM40 10v43M5 10v43l31-3M75 10v43l-31-3M2 14v42l32-4M78 14v42l-32-4M14 12c7-1 15 0 21 3M14 18c7-1 15 0 21 3M14 24c7-1 15 0 21 3M14 30c7-1 15 0 21 3M14 36c7-1 15 0 21 3M14 42c7-1 15 0 21 3M66 12c-7-1-15 0-21 3M66 18c-7-1-15 0-21 3M66 24c-7-1-15 0-21 3M66 30c-7-1-15 0-21 3M66 36c-7-1-15 0-21 3M66 42c-7-1-15 0-21 3"/></svg>';
      const bx = u.el('span', 'ds-brandbox', top);
      u.el('span', 'ds-brand', bx, C.brand);
      u.el('span', 'ds-tag', bx, 'CATALOG  •  RESEARCH  •  LEARN  •  DISCOVER');
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', top);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
      }
      const frame = u.el('div', 'ds-frame', document.body);
      const banner = u.el('div', 'ds-banner', frame);
      u.el('span', '', banner, 'Search the Library Catalog');
      const motto = u.el('i', '', banner, 'Knowledge Endures');
      const swash = u.el('span', 'ds-swash', motto);
      swash.innerHTML =
        '<svg viewBox="0 0 60 24" fill="none" stroke="#fff" stroke-width="1.2"><path d="M29 13C13 0 0 6 4 12c4 6 18-1 26 1s22 9 27 1c4-7-9-7-8-3M15 10c12 0 19 9 29 6M23 5c8 1 11 10 18 10"/></svg>';
      const body = u.el('div', 'ds-body', frame);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      let mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'left'
              : C.instruction;
      // A narrow catalog uses the full-width task heading rather than squeezing its calendars.
      if (mode === 'left' && top.clientWidth < 1100) mode = 'top';
      if (mode === 'toast' && document.body.clientHeight < 700) mode = 'top';
      document.body.dataset.instruction = mode;
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        if (cls === 'ds-brief') u.el('h2', '', b, C.briefTitle || 'Task');
        u.el('div', 'ds-instruction', b, ctx.instruction);
        u.el('div', 'ds-guidance', b, 'Select the start date and end date to find items added to the catalog.');
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
      document.body.classList.toggle('ds-finish', !!ctx.finish);
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', '', foot, 'Ready');
      let submit = null;
      let placement = 'footer';
      let label = 'Submit';
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end').fork(ctx.instruction);
        if (er.bool(0.5)) {
          const bank = (ctx.content && ctx.content.END_LABELS) || [
            'Submit',
            'Done',
            'Finish',
            'Continue',
            'Save',
            'OK',
            'Confirm',
            'Apply',
          ];
          const picked = er.pick(bank);
          label = typeof picked === 'string' ? picked : picked.label || picked.text || String(picked);
          placement = er.pick(['header', 'link']);
        }
        const mkEnd = (parent, cls, text) => {
          const tag = cls === 'ds-end-link' ? 'a' : 'button';
          const b = u.el(tag, cls, parent, text);
          if (tag === 'a') b.href = '#';
          else b.type = 'button';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        if (placement === 'footer') submit = mkEnd(foot, 'ds-submit', label);
        else if (placement === 'header') submit = mkEnd(top, 'ds-submit ds-end-header', label);
        else submit = mkEnd(foot, 'ds-end-link', label + ' ›');
      }
      foot.dataset.end = ctx.finish ? 'none' : placement;
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const bank = (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
        ];
        const options = Array.from(
          new Set(bank.map((x) => (typeof x === 'string' ? x : x.label || x.text || String(x)))),
        ).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const text = cr.pick(options);
          const parent = placement === 'link' ? foot : top;
          const b = u.el('button', placement === 'link' ? 'ds-xtra ds-xtra-footer' : 'ds-xtra', parent, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      const pf = u.el('footer', 'ds-pagefoot', document.body);
      u.el('span', '', pf, 'Rivermere Public Library');
      u.el('span', 'ds-pf2', pf, 'BOOKS   BUILD   BRIGHTER   LIVES');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your catalog preferences.',
        toast: 'Your catalog preferences have been saved.',
        chat: 'Ask a librarian. How can we help?',
        promo: 'Discover more with your library card.',
        banner: 'Catalog maintenance is scheduled for tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
