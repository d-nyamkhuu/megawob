(function () {
  'use strict';
  const C = {
    title: 'World Explorer',
    sub: 'CD-ROM COMPANION',
    nav: ['DISCOVER', 'LEARN', 'EXPLORE'],
    quick: ['Tab #1 — Overview', 'Tab #2 — Places', 'Tab #3 — Cultures', 'Tab #4 — Photos'],
    intro:
      'Explore countries, cultures, natural wonders and more from around the globe. Use the tabs above to browse different sections of the CD-ROM.',
  };
  const END_FALLBACK = [
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
  const DISC =
    '<svg viewBox="0 0 100 100"><defs><linearGradient id="dg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6d1e8"/><stop offset=".25" stop-color="#8fd3f0"/><stop offset=".5" stop-color="#f4ee9a"/><stop offset=".75" stop-color="#e48fc4"/><stop offset="1" stop-color="#7fb0ee"/></linearGradient></defs><circle cx="50" cy="50" r="47" fill="url(#dg)" stroke="#cfd3d8" stroke-width="3"/><circle cx="50" cy="50" r="16" fill="#eef"/><circle cx="50" cy="50" r="8" fill="#223"/></svg>';
  const GLOBE =
    '<svg viewBox="0 0 100 100"><defs><radialGradient id="gg" cx=".35" cy=".3"><stop offset="0" stop-color="#7cc4ff"/><stop offset=".6" stop-color="#1c5aa8"/><stop offset="1" stop-color="#08224a"/></radialGradient></defs><circle cx="50" cy="50" r="47" fill="url(#gg)"/><path d="M22 30c10-8 22-6 26 2-6 6-10 14-18 12-6-4-10-8-8-14ZM52 52c8-4 20 0 24 8-2 12-10 22-18 24-6-8-10-20-6-32Z" fill="#3f9a4c"/><circle cx="50" cy="50" r="47" fill="none" stroke="#0a1a33" stroke-width="2"/></svg>';
  const ICONS = [
    '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#1f6fd0" stroke="#123" stroke-width="1.5"/><path d="M8 12c6-6 12-4 12 2-4 4-8 6-10 12-4-4-4-10-2-14ZM22 22c6-2 10 2 10 6-2 6-6 8-8 8-3-4-4-10-2-14Z" fill="#3ea04a"/></svg>',
    '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="#e8dcb0" stroke="#6a4a1a" stroke-width="3"/><path d="M20 5l3 15-3 15-3-15Z" fill="#a22"/><path d="M5 20l15-3 15 3-15 3Z" fill="#555"/></svg>',
    '<svg viewBox="0 0 40 40"><path d="M3 9c6-2 12-2 17 2 5-4 11-4 17-2v24c-6-2-12-2-17 2-5-4-11-4-17-2Z" fill="#f5ecd0" stroke="#222" stroke-width="2.5"/><path d="M20 11v24" stroke="#222" stroke-width="2"/></svg>',
    '<svg viewBox="0 0 40 40"><rect x="3" y="11" width="34" height="23" rx="3" fill="#222"/><rect x="13" y="7" width="12" height="6" fill="#222"/><circle cx="20" cy="23" r="8" fill="#ddd" stroke="#666" stroke-width="2"/><circle cx="20" cy="23" r="4.5" fill="#223"/></svg>',
  ];
  env.site({
    name: 'design-click-control-tab-03',
    styles: ['site.css', 'ref.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref cdrom';
      const endR = ctx.rng.fork('chrome/end'),
        collideR = ctx.rng.fork('chrome/collide');
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : END_FALLBACK;
      const labelText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const label = endR.bool(0.5) ? 'Submit' : labelText(endR.pick(labels));
      const placements = ['footer', 'footer', 'footer', 'header', 'link', 'link'];
      const placement = ctx.finish ? null : endR.pick(placements);
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const options = [
          ...new Set(labels.map(labelText).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
        ];
        if (options.length) collide = collideR.pick(options);
      }
      const shell = u.el('main', 'shell', document.body);
      const marble = u.el('div', 'cd-marble', shell);
      marble.setAttribute('aria-hidden', 'true');
      marble.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="cd-marble-tile" width="220" height="100" patternUnits="userSpaceOnUse"><svg width="220" height="100" viewBox="750 8 220 100"><image href="sites/design-click-control-tab-03/assets/reference-art.webp" width="1672" height="941"/></svg></pattern></defs><rect width="100%" height="100%" fill="url(#cd-marble-tile)"/></svg>';
      const head = u.el('header', 'head', shell);
      head.classList.toggle('has-instruction', ctx.display === 'header');
      const disc = u.el('span', 'cd-disc', head);
      disc.innerHTML = DISC;
      const tt = u.el('div', 'cd-titles', head);
      u.el('div', 'cd-title', tt, C.title);
      u.el('div', 'cd-sub', tt, C.sub);
      const nav = u.el('div', 'cd-nav', head);
      C.nav.forEach((n, i) => {
        if (i) u.el('i', '', nav, '·');
        u.el('span', '', nav, n);
      });
      const gl = u.el('span', 'cd-globe', head);
      gl.innerHTML = GLOBE;
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const stage = u.el('div', 'stage', center);
      const aside = u.el('aside', 'inspector', work);
      u.el('h2', '', aside, 'Quick Links');
      const ql = u.el('ul', 'cd-quick', aside);
      C.quick.forEach((q, i) => {
        const li = u.el('li', '', ql);
        const ic = u.el('span', 'cd-ic', li);
        ic.innerHTML = ICONS[i];
        u.el('span', 'cd-ql', li, q);
      });
      const note = u.el('div', 'instruction', aside, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      if (ctx.display === 'header' && !note.hidden) {
        head.appendChild(note);
        note.classList.add('instruction-header');
      }
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const foot = u.el('footer', 'footer', shell);
      const hb = u.el('span', 'cd-btn cd-help', foot);
      hb.innerHTML = '<b>?</b>Help';
      const ob = u.el('span', 'cd-btn cd-opt', foot);
      ob.innerHTML = '<b>&#9881;</b>Options';
      const decoy = (parent, text) => {
        const b = u.el('button', 'cd-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      let submit = null;
      if (!ctx.finish) {
        if (collide) decoy(placement === 'footer' ? foot : head, collide);
        if (placement === 'footer' || placement === 'link') {
          if (placement === 'link') {
            submit = u.el('a', 'cd-endlink', foot, label + ' ›');
            submit.href = '#';
            submit.addEventListener('click', (e) => {
              e.preventDefault();
              ctx.submit();
            });
          } else {
            submit = u.el('button', 'submit', foot, label);
            submit.type = 'button';
            submit.addEventListener('click', ctx.submit);
          }
        } else {
          submit = u.el('button', 'cd-head-submit', head, label);
          submit.type = 'button';
          submit.addEventListener('click', ctx.submit);
        }
      }
      return { stage, submit };
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
