(function () {
  'use strict';
  const C = {
    'site': 'design-type-text-multi-07',
    'instruction': 'top',
    'menu': 'File|Edit|Record|Format|Specials|Window|Help',
    'clock': 'Mon Apr 22   10:24 AM',
    'winTitle': 'New Contact',
    'rail': 'Contacts|Notes|Calendar|Files|Prefs',
  };
  const ICONS = {
    Contacts:
      '<svg viewBox="0 0 40 44"><path d="M7 3h19l8 8v30H7z M26 3v8h8" fill="#f6f2e4" stroke="#111" stroke-width="2.4"/></svg>',
    Notes:
      '<svg viewBox="0 0 40 44"><path d="M8 5h25v15H8z M6 11h29v12H6z M4 20h32v20H4z" fill="#f1eddf" stroke="#111" stroke-width="2.2"/><path d="M10 9h20 M10 15h20 M16 25h9 M17 34h8" stroke="#111" stroke-width="2"/></svg>',
    Calendar:
      '<svg viewBox="0 0 40 44"><path d="M5 6h30v32H5z M5 14h30" fill="#f6f2e4" stroke="#111" stroke-width="2.4"/><path d="M10 19h4v4h-4z M18 19h4v4h-4z M26 19h4v4h-4z M10 26h4v4h-4z M18 26h4v4h-4z M26 26h4v4h-4z M10 32h4v3h-4z M18 32h4v3h-4z M26 32h4v3h-4z" fill="none" stroke="#111" stroke-width="1.6"/></svg>',
    Files:
      '<svg viewBox="0 0 40 44"><path d="M3 10h13l3 4h18v24H3z M19 18h18" fill="#f1eddf" stroke="#111" stroke-width="2.4"/></svg>',
    Prefs:
      '<svg viewBox="0 0 40 44"><path d="M17 4h6l1 5 4 2 4-2 4 5-3 4 1 4 4 2-2 6-5-1-3 3v5h-6l-2-4-4-1-4 3-4-5 2-4-1-4-5-2 2-6 5 1 3-3z" fill="#f1eddf" stroke="#111" stroke-width="2.2"/><circle cx="20" cy="22" r="6" fill="none" stroke="#111" stroke-width="2.2"/></svg>',
  };
  const DOC =
    '<svg viewBox="0 0 40 44"><path d="M7 3h19l8 8v30H7z M26 3v8h8 M12 15h17 M12 20h17 M12 25h17 M12 29h17" fill="none" stroke="#111" stroke-width="1.4"/></svg>';
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const bank = (key, fallback) =>
        ctx.content && Array.isArray(ctx.content[key]) && ctx.content[key].length ? ctx.content[key] : fallback;
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const er = ctx.rng.fork('chrome/end');
      const original = er.bool(0.5);
      const placement = original ? 'footer' : er.pick(['titlebar', 'footer-link']);
      const ends = bank('END_LABELS', ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']);
      const endLabel = original ? 'Submit' : labelOf(er.pick(ends));
      const cr = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (cr.bool(0.3)) {
        const choices = [
          ...new Set(ends.map(labelOf).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase())),
        ];
        if (choices.length) collide = labelOf(cr.pick(choices));
      }
      const top = u.el('header', 'ds-top', document.body);
      const apple = u.el('span', 'ds-apple', top);
      apple.innerHTML =
        '<svg viewBox="0 0 24 28" width="22" height="26"><path d="M12 8c-3-3-9-1-9 6 0 6 4 12 7 12 1 0 1.500-.600 2-.600s1 .600 2 .600c3 0 7-5 7-9-4-2-4-7 0-9-2-3-6-3-9 0z M13 6c0-3 2-5 4-5 0 3-1 5-4 5z" fill="#111"/></svg>';
      C.menu.split('|').forEach((t) => u.el('span', 'ds-mi', top, t));
      u.el('span', 'ds-clock', top, C.clock);
      const ci = u.el('span', 'ds-cicon', top);
      ci.innerHTML =
        '<svg viewBox="0 0 28 28" width="26" height="26"><path d="M3 2h22v25H3z M10 5l1 4 M19 5l-1 4 M14 8l-1 5h4 M8 15q6 7 13-1 M8 23h11" fill="none" stroke="#111" stroke-width="2"/></svg>';
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      C.rail.split('|').forEach((t) => {
        const it = u.el('div', 'ds-ritem', rail);
        const ic = u.el('span', 'ds-ricon', it);
        ic.innerHTML = ICONS[t];
        u.el('span', '', it, t);
      });
      const content = u.el('div', 'ds-content', body);
      const bar = u.el('div', 'ds-titlebar', content);
      const ti = u.el('span', 'ds-ticon', bar);
      ti.innerHTML = DOC;
      u.el('span', 'ds-ttl', bar, C.winTitle);
      const titleTools = u.el('span', 'ds-title-tools', bar);
      const wc = u.el('span', 'ds-wctl', bar);
      ['−', '□', '×'].forEach((t) => u.el('i', '', wc, t));
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
        if (cls === 'ds-brief') u.el('h2', '', b, 'Instructions');
        const ic = u.el('span', 'ds-bicon', b);
        ic.innerHTML = DOC;
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
      ['Clear', 'Cancel'].forEach((t) => {
        const b = u.el('button', 'ds-btn', foot, t);
        b.type = 'button';
      });
      const decoy = (parent, text, collides) => {
        const b = u.el('button', collides ? 'ds-btn ds-xtra ds-pq' : 'ds-btn ds-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      let submit = null;
      if (!ctx.finish) {
        const makeEnd = (parent, cls, text) => {
          const el = u.el('button', cls, parent, text);
          el.type = 'button';
          el.dataset.role = 'submit';
          el.setAttribute('aria-label', endLabel);
          el.title = endLabel;
          el.addEventListener('click', () => ctx.submit());
          return el;
        };
        if (placement === 'titlebar') {
          if (collide) decoy(titleTools, collide, true);
          submit = makeEnd(titleTools, 'ds-btn ds-top-submit', endLabel);
        } else if (placement === 'footer-link') {
          if (collide) decoy(foot, collide, true);
          const link = u.el('a', 'ds-endlink', foot, endLabel + ' ›');
          link.href = '#';
          link.dataset.role = 'submit';
          link.setAttribute('aria-label', endLabel);
          link.title = endLabel;
          link.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          submit = link;
        } else {
          if (collide) decoy(foot, collide, true);
          const w = u.el('span', 'ds-subwrap', foot);
          submit = makeEnd(w, 'ds-btn ds-submit', endLabel);
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
