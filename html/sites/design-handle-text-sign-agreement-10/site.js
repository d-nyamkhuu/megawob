(() => {
  'use strict';
  const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
  const ICONS = {
    Help: '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M5 15q13-5 26 1 14-6 28-1v38q-14-5-28 0-13-5-26 0z" fill="#a97630" stroke="#071f25" stroke-width="3"/><path d="M9 10q12-3 22 3v34q-10-5-22-2zM55 10q-12-3-22 3v34q10-5 22-2z" fill="#f9ebc5" stroke="#563d22" stroke-width="1.5"/><path d="M14 15v24m4-24v25m4-24v25m19-25v25m4-26v25m4-26v25" stroke="#c8b995" stroke-width=".8"/><path d="M32 13v37" stroke="#352d20" stroke-width="2"/></svg>',
    Contents: '<img src="sites/design-handle-text-sign-agreement-10/assets/globe-detail.webp" alt=""/>',
    Search:
      '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M25 36L9 58" stroke="#06171e" stroke-width="10"/><path d="M24 36L8 56" stroke="#cbb990" stroke-width="6"/><circle cx="36" cy="24" r="19" fill="#051f28" stroke="#e8d7ae" stroke-width="2"/><circle cx="36" cy="24" r="14" fill="#4096a1" stroke="#122e36" stroke-width="2"/><path d="M26 23q1-9 10-10" fill="none" stroke="#c5eeeb" stroke-width="3"/><path d="M42 14q6 5 5 11" fill="none" stroke="#78b0ad" stroke-width="2"/></svg>',
    Tips: '<svg viewBox="0 0 64 64" aria-hidden="true"><defs><radialGradient id="jewel"><stop stop-color="#228f9d"/><stop offset="1" stop-color="#023540"/></radialGradient></defs><circle cx="32" cy="32" r="27" fill="url(#jewel)" stroke="#001d24" stroke-width="3"/><text x="32" y="48" text-anchor="middle" font-family="Georgia,serif" font-weight="bold" font-size="52" fill="#f1c459" stroke="#493512" stroke-width=".7">?</text></svg>',
  };
  env.site({
    name: 'design-handle-text-sign-agreement-10',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util,
        b = document.body;
      b.className = 'ref clearlooks agreement';
      const shell = u.el('main', 'shell', b);
      u.el('div', 'margin-art', shell);
      u.el('div', 'brand', shell);
      const title = u.el('header', 'agreement-top', shell);
      u.el('div', 'agreement-title', title, 'User Agreement');
      u.el('div', 'agreement-tagline', title, 'A Wider World Awaits');
      const tabs = u.el('nav', 'tabs', shell);
      ['Overview', 'User Agreement', 'Privacy', 'Support'].forEach((x, i) =>
        u.el('div', i === 1 ? 'selected' : '', tabs, x),
      );
      const work = u.el('div', 'work', shell);
      const note = u.el('div', 'instruction', work, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', work);
      const rail = u.el('nav', 'rail', shell);
      [
        ['📖', 'Help'],
        ['🌐', 'Contents'],
        ['🔎', 'Search'],
        ['?', 'Tips'],
      ].forEach(([ico, label]) => {
        const item = u.el('div', 'tool', rail);
        const icon = u.el('span', 'tool-icon', item);
        icon.innerHTML = ICONS[label];
        u.el('span', 'tool-label', item, label);
      });
      const foot = u.el('footer', 'footer', shell);
      const r = ctx.rng.fork('chrome/end');
      const labels = ctx.content.END_LABELS.map(labelOf);
      const classic = r.bool(0.5);
      const placement = classic ? 'footer' : r.pick(['header', 'link']);
      const label = classic ? 'Submit' : r.pick(labels);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el('button', 'submit end-' + placement, foot, label);
        submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', ctx.submit);
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const text = cr.pick(options),
            decoy = u.el('button', 'chrome-xtra', foot, text);
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
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
