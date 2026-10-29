(function () {
  'use strict';
  const C = {
    menus: ['Desk', 'File', 'Edit', 'Options', 'Window'],
    clock: 'Mon 27 Jan 1986  10:24',
    title: 'Button Sequence',
    tools: [
      [
        'Select',
        '<rect x="6" y="6" width="28" height="28" fill="none" stroke="#000" stroke-width="2" stroke-dasharray="4 3"/>',
      ],
      [
        'Draw',
        '<path d="m12 24 6 5 16-16 2-9-7 1-15 16Z" fill="#000"/><path d="m13 23-5 4-5 9 9-3 7-6Z" fill="#ddd" stroke="#000" stroke-width="1.5"/><path d="m5 34 10-10m-5 8 7-6" stroke="#000"/><path d="m15 22 4 4" stroke="#ddd" stroke-width="1.5"/>',
      ],
      [
        'Erase',
        '<defs><pattern id="eraser-stipple" width="2" height="2" patternUnits="userSpaceOnUse"><rect width="2" height="2" fill="#ccc"/><path d="M0 0h1v1H0Z" fill="#111"/></pattern></defs><path d="m4 26 21-22 6 1 6 7-23 24-5-1-5-5Z" fill="url(#eraser-stipple)" stroke="#000" stroke-width="2"/><path d="m4 26 8-8 10 9-8 9-5-1-5-5Z" fill="#eee" stroke="#000" stroke-width="2"/>',
      ],
      [
        'Zoom',
        '<circle cx="16" cy="16" r="10" fill="#fff" stroke="#000" stroke-width="3.5"/><path d="M24 24l11 11" stroke="#000" stroke-width="5"/>',
      ],
    ],
  };
  env.site({
    name: 'design-click-control-sequence-04',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref gem';
      const mb = u.el('header', 'menubar', document.body);
      const ml = u.el('div', 'menus', mb);
      C.menus.forEach((m) => u.el('span', '', ml, m));
      u.el('span', 'clock', mb, C.clock);
      const win = u.el('main', 'gwin', document.body);
      const tb = u.el('div', 'gtitle', win);
      u.el('i', 'gbox', tb);
      u.el('b', '', tb, C.title);
      u.el('i', 'gbox full', tb);
      const center = u.el('section', 'center', win);
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', center);
      const foot = u.el('footer', 'footer', win);
      u.el('span', 'ready', foot, 'Ready.');
      u.el('i', 'grip', foot);
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const original = er.bool(0.5);
      const placement = original ? 'reference' : er.pick(['title', 'status']);
      const endLabel = original ? 'Submit' : er.pick(endLabels);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(placement === 'status' ? 'a' : 'button', 'submit end-' + placement, win, endLabel);
        if (placement === 'status') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const pal = u.el('aside', 'palette', document.body);
      const pt = u.el('div', 'ptitle', pal);
      u.el('i', 'pclose', pt).innerHTML = '<svg viewBox="0 0 16 16"><path d="m2 2 12 1-2 5 1 6-5-3-5 3V8Z"/></svg>';
      u.el('b', '', pt, 'Tools');
      u.el('i', 'pclose', pt).innerHTML =
        '<svg viewBox="0 0 16 16"><path d="M3 3l10 10M13 3L3 13" stroke="#000" stroke-width="2.4"/></svg>';
      const grid = u.el('div', 'pgrid', pal);
      C.tools.forEach((t) => {
        const c = u.el('div', 'tool', grid);
        const b = u.el('div', 'ticon', c);
        b.innerHTML = '<svg viewBox="0 0 40 40">' + t[1] + '</svg>';
        u.el('span', '', c, t[0]);
      });
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = cr.pick(options);
          const decoy = u.el('button', 'palette-xtra', pal, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      const wb = u.el('div', 'waste', document.body);
      wb.innerHTML =
        '<svg viewBox="0 0 44 52"><path d="M6 14 7 46q15 7 30 0l1-32Z" fill="#ddd" stroke="#000" stroke-width="2"/><path d="M10 17v27m4-27v29m5-29v30m5-30v30m5-30v29m5-29v27" stroke="#111" stroke-width="1.4"/><path d="M4 11q18-7 36 0v5q-18 6-36 0Z" fill="#ddd" stroke="#000" stroke-width="2"/><path d="M3 11q19 8 38 0M7 47q15 5 29 0" fill="none" stroke="#000" stroke-width="1.4"/><path d="M16 8V3h11v5h-4V6h-3v2Z" fill="#eee" stroke="#000" stroke-width="1.5"/><path d="M8 10h6m16 0h6M9 14h25" stroke="#000"/></svg>';
      u.el('span', '', wb, 'Wastebasket');
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
