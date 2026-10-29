(function () {
  'use strict';
  const C = {
    'site': 'design-act-in-time-popup-06',
    'brand': 'Orion Desk',
    'title': 'Welcome Back',
    'instruction': 'top',
    'rail': '01|02|03|04|05|06|07|08|09|10',
    'menu': 'File|Edit|View|Tools|Help',
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
      u.el('span', 'ds-mark', top, '✳');
      u.el('span', 'ds-brand', top, C.brand);
      u.el('span', 'ds-window', top, '−　□　×');
      if (C.menu) {
        const nav = u.el('nav', 'ds-menu', document.body);
        C.menu.split('|').forEach((t) => u.el('span', '', nav, t));
        const tools = u.el('span', 'ds-menu-tools', nav);
        tools.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="m9 3-1 3-3 1 1 3-3 2 3 2-1 3 3 1 1 3 3-1 3 1 1-3 3-1-1-3 3-2-3-2 1-3-3-1-1-3-3 1Z"/><circle cx="12" cy="12" r="3"/></svg><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 5m0 2v1"/></svg>';
      }
      const body = u.el('div', 'ds-body', document.body);
      if (C.rail) {
        const rail = u.el('aside', 'ds-rail', body);
        C.rail.split('|').forEach((t) => u.el('div', '', rail, t));
      }
      const content = u.el('div', 'ds-content', body);
      content.dataset.display = ctx.display;
      content.dataset.finish = String(!!ctx.finish);
      const heading = u.el('div', 'ds-apphead', content);
      u.el('span', 'ds-lock', heading, '♙');
      u.el('strong', '', heading, 'Account Access');
      u.el('span', 'ds-app-brand', heading, 'Orion Desk');
      u.el('div', 'ds-secure-caption', content, 'Secure tools\nfor focused work');
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
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          cr = ctx.rng.fork('chrome/collide');
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        const allowed = [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
          String.fromCharCode(73, 39) + 'm done',
        ];
        const raw = (ctx.content && ctx.content.END_LABELS) || allowed;
        let labels = Array.isArray(raw) ? raw.map(labelOf).filter(Boolean) : [];
        if (!labels.length) labels = allowed;
        const common = er.bool(0.5);
        const label = common ? 'Submit' : labelOf(er.pick(labels));
        const alternate = er.pick(['header', 'link', 'icon']);
        const place = common ? 'footer' : alternate;
        content.dataset.end = place;
        const makeEnd = (parent, cls, text, tag) => {
          const b = u.el(tag || 'button', cls, parent, text);
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
        let dock = null;
        if (place === 'footer' || place === 'link') {
          dock = u.el('footer', 'ds-footer', content);
          submit = makeEnd(
            dock,
            place === 'link' ? 'ds-end-link' : 'ds-submit',
            label,
            place === 'link' ? 'a' : undefined,
          );
        } else
          submit = makeEnd(
            heading,
            place === 'icon' ? 'ds-submit ds-end-icon' : 'ds-submit ds-end-header',
            place === 'icon' ? String.fromCharCode(10003) : label,
          );
        if (cr.bool(0.3)) {
          const pool = labels.map(labelOf).filter((x) => x.toLowerCase() !== label.toLowerCase());
          if (pool.length) {
            const dec = u.el(
              'button',
              'ds-xtra',
              place === 'header' || place === 'icon' ? heading : dock || heading,
              labelOf(cr.pick(pool)),
            );
            dec.type = 'button';
            dec.dataset.role = 'xtra';
            dec.addEventListener('click', () => env.log('decoy', { label: dec.textContent, collide: true }));
          }
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
