(function () {
  'use strict';
  const TOOLS = [
    ['New', '<path d="M7 3h9l5 5v13H7z"/><path d="M14 12v7M10.5 15.5h7"/>'],
    ['Copy', '<rect x="3" y="7" width="12" height="14"/><path d="M8 7V3h13v14h-6"/>'],
    [
      'Cut',
      '<circle cx="7" cy="19" r="2.6"/><circle cx="17" cy="19" r="2.6"/><path d="M8.5 16.5L17 3M15.5 16.5L7 3"/>',
    ],
    ['Delete', '<path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v8M14 10v8"/>'],
    ['|'],
    ['Rename', '<path d="M4 20l1-5L16 4l4 4L9 19z"/><path d="M13 7l4 4"/>'],
    ['Properties', '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7v1.5"/>'],
  ];
  env.site({
    name: 'design-click-control-dialog-08',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref modernist';
      const endRng = ctx.rng.fork('chrome/end');
      const endOptions =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabels = endOptions.map(labelOf);
      const standard = endLabels.find((x) => x.toLowerCase() === 'submit') || 'Submit';
      const defaultEnd = ctx.finish ? false : endRng.bool(0.5);
      const placement = ctx.finish ? null : defaultEnd ? 'footer' : endRng.pick(['brief', 'link']);
      const label = defaultEnd ? standard : endRng.pick(endLabels);
      const collideRng = ctx.rng.fork('chrome/collide');
      const collisionOptions = [...new Set(endLabels)].filter(
        (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
      );
      const collide =
        !ctx.finish && collisionOptions.length && collideRng.bool(0.3) ? collideRng.pick(collisionOptions) : null;
      const shell = u.el('main', 'shell', document.body);
      const work = u.el('div', 'work', shell);
      const brief = u.el('aside', 'brief', work);
      const briefHead = u.el('div', 'brief-head', brief);
      u.el('div', 'brief-k', briefHead, 'TASK');
      const makeEnd = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', ctx.submit);
        return b;
      };
      let submit = null;
      if (placement === 'brief' && !ctx.finish) submit = makeEnd(briefHead, 'submit brief-submit', label);
      const note = u.el('div', 'instruction', brief, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      u.el('hr', '', brief);
      [
        ['FILE', 'Project Plan.docx'],
        ['LOCATION', 'Documents'],
        ...(ctx.display === 'hidden' ? [] : [['GOAL', ctx.instruction]]),
      ].forEach((p) => {
        const r = u.el('div', 'meta', brief);
        u.el('span', 'mk', r, p[0]);
        u.el('span', 'mv', r, p[1]);
      });
      const center = u.el('section', 'center', work);
      const stage = u.el('div', 'stage', center);
      const foot = u.el('footer', 'footer', shell);
      const tb = u.el('div', 'tools', foot);
      TOOLS.forEach((t) => {
        if (t[0] === '|') {
          u.el('span', 'tsep', tb);
          return;
        }
        const b = u.el('span', 'tool', tb);
        const i = u.el('i', '', b);
        i.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">' +
          t[1] +
          '</svg>';
        u.el('span', '', b, t[0]);
      });
      if (collide) {
        const d = u.el('button', 'toolbar-xtra', tb, collide);
        d.type = 'button';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      if (placement === 'footer') submit = makeEnd(foot, 'submit', label);
      else if (placement === 'link') {
        const link = u.el('a', 'footer-link', foot, label + ' ›');
        link.href = '#';
        link.dataset.role = 'submit';
        link.setAttribute('aria-label', label);
        link.title = label;
        link.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        submit = link;
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
