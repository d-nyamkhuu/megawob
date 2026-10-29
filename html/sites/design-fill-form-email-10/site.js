(function () {
  'use strict';
  const C = {
    'site': 'design-fill-form-email-10',
    'brand': 'Mail',
    'title': 'Add Contact',
    'instruction': 'top',
    'rail': '',
    'menu': 'Reply|Reply All|Forward|Delete|Flag',
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
      const globe = u.el('span', 'ds-globe', top);
      globe.innerHTML = `<svg viewBox="0 0 64 64"><defs><radialGradient id="ocean" cx=".32" cy=".2" r=".8"><stop stop-color="#d2f6ff"/><stop offset=".45" stop-color="#44bce9"/><stop offset=".8" stop-color="#1887c1"/><stop offset="1" stop-color="#036583"/></radialGradient><radialGradient id="land" cx=".25" cy=".15" r=".95"><stop stop-color="#c2ed83"/><stop offset="1" stop-color="#50c663"/></radialGradient><linearGradient id="earthShine" x2="0" y2="1"><stop stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><circle cx="32" cy="32" r="30" fill="url(#ocean)" stroke="#268991" stroke-width="1.5"/><path d="M9 17Q11 9 20 7L24 8Q27 10 30 10L27 15L20 17Q18 17 18 21L21 24Q22 27 18 28L14 27Q9 25 9 17ZM24 30Q30 31 33 35L34 40L30 44Q29 48 27 50L26 55L23 57Q21 52 22 47L19 43Q17 39 19 35Z M39 5Q48 7 52 13L53 18L48 22Q46 24 49 26L53 29L54 33Q52 35 49 34L45 32L40 30L40 25L34 23L35 19L39 16L35 12Z M40 35Q45 34 47 38L46 44L42 50Q39 47 38 42Z" fill="url(#land)" stroke="#55b87d" stroke-width=".6"/><ellipse cx="27" cy="17" rx="22" ry="13" fill="url(#earthShine)" transform="rotate(-20 27 17)"/></svg>`;
      const bt = u.el('span', 'ds-brand', top);
      u.el('b', '', bt, 'Data Entry');
      u.el('i', '', bt, 'Customer Information');
      const links = u.el('span', 'ds-links', top);
      ['Help', 'Settings', 'Sign Out'].forEach((t) => {
        const a = u.el('a', '', links, t);
        a.addEventListener('click', () => env.log('decoy', { label: t }));
      });
      const sr = u.el('span', 'ds-search', top);
      u.el('span', 'ds-mag', sr);
      u.el('span', '', sr, 'Search...');
      const body = u.el('div', 'ds-body', document.body);
      {
        const rail = u.el('aside', 'ds-rail', body);
        for (let i = 1; i <= 10; i++) {
          const d = u.el('div', i === 1 ? 'on' : '', rail, String(i));
        }
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
        if (cls === 'ds-header-note' || cls === 'ds-brief') u.el('span', 'ds-info', b, 'i');
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
      u.el('span', '', foot, ''); // Episode controls use isolated streams so task content keeps its existing seed draws.
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endWords = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['header', 'link']);
      const label = referenceEnd ? 'Submit' : er.pick(endWords);
      let submit = null;
      const tools = u.el('div', 'ds-episode-tools', top);
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'ds-submit' + (placement === 'header' ? ' ds-end-header' : placement === 'link' ? ' ds-end-link' : ''),
          placement === 'header' ? tools : foot,
          label,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.dataset.placement = placement;
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const pool = endWords.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) {
          const text = cr.pick(pool);
          const decoy = u.el('button', 'ds-end-xtra', tools, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
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
