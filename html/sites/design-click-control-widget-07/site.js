(function () {
  'use strict';
  const cfg = {
    'title': 'User Settings',
    'obstacle': 'Welcome!',
    'copy': 'This short tour will show you around the interface.',
    'dismiss': 'Skip tour',
  };
  const ICONS = {
    floppy:
      '<svg viewBox="0 0 48 48"><path d="M5 3h34l4 4v38H5Z" fill="#f4f4f4" stroke="#111" stroke-width="3"/><rect x="12" y="4" width="22" height="14" fill="#fff" stroke="#111" stroke-width="3"/><rect x="26" y="7" width="4" height="8" fill="#111"/><rect x="11" y="26" width="26" height="17" fill="#fff" stroke="#111" stroke-width="2"/></svg>',
    folder:
      '<svg viewBox="0 0 48 48"><path d="M3 10h16l4 5h22v28H3Z" fill="#f4f4f4" stroke="#111" stroke-width="3"/><path d="M3 18h42" stroke="#111" stroke-width="2"/></svg>',
    trash:
      '<svg viewBox="0 0 48 48"><rect x="19" y="3" width="10" height="5" fill="#fff" stroke="#111" stroke-width="2.5"/><path d="M8 10h32v4H8Z" fill="#f4f4f4" stroke="#111" stroke-width="2.5"/><path d="M11 14h26l-2 31H13Z" fill="#e8e8e8" stroke="#111" stroke-width="2.5"/><path d="M19 18v24M24 18v24M29 18v24" stroke="#111" stroke-width="2"/></svg>',
    logo: '<svg viewBox="0 0 40 40"><path d="M3 38l2-9 10-4h10l10 5 2 8Z" fill="#111"/><path d="m15 26 5 9 5-9M19 30h3v6h-3Z" fill="#eee"/><path d="m12 13 2-6 6-3 7 1 4-2 3 4-4 5-1 8-5 6-7-3-3-5Z" fill="#eee" stroke="#111" stroke-width="2"/><path d="m14 12 4-4 6 1 3-3M17 14l3-3 5 1-2 4 4 1-3 4-5-1-3-4M20 21l3 2" fill="none" stroke="#111" stroke-width="1.5"/></svg>',
  };
  env.site({
    name: 'design-click-control-widget-07',
    styles: ['gem.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref gem';
      const desk = u.el('main', 'desk', document.body);
      const bar = u.el('header', 'menubar', desk);
      const lg = u.el('span', 'mb-logo', bar);
      lg.innerHTML = ICONS.logo;
      ['Desk', 'File', 'Edit', 'View', 'Options'].forEach((s) => u.el('span', 'mb-item', bar, s));
      u.el('span', 'mb-clock', bar, 'Mon Mar 16, 1987   10:24 AM');
      const task = u.el('section', 'taskwin', desk);
      task.dataset.display = ctx.display;
      task.hidden = ctx.display === 'hidden';
      u.el(
        'div',
        'tw-title',
        task,
        ctx.display === 'panel' ? 'Instructions' : ctx.display === 'toast' ? 'Task notice' : 'Task',
      );
      const note = u.el('div', 'instruction', task, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
      }
      [
        ['floppy', 'Floppy', 1],
        ['folder', 'Documents', 2],
        ['trash', 'Trash', 3],
      ].forEach((a) => {
        const ic = u.el('div', 'dicon i' + a[2], desk);
        const g = u.el('span', 'dg', ic);
        g.innerHTML = ICONS[a[0]];
        u.el('span', 'dl', ic, a[1]);
      });
      const dlg = u.el('section', 'dialog', desk);
      const tb = u.el('div', 'dtitle', dlg);
      u.el('span', 'dclose', tb);
      u.el('span', 'dtext', tb, cfg.title);
      const pointer = u.el('span', 'gem-pointer', dlg);
      pointer.setAttribute('aria-hidden', 'true');
      pointer.innerHTML =
        '<svg viewBox="0 0 24 34"><path d="M2 2v26l6-6 5 10 5-3-5-10h9Z" fill="white" stroke="#111" stroke-width="2"/></svg>';
      const stage = u.el('div', 'stage', dlg);
      u.el('hr', 'drule', dlg);
      const foot = u.el('footer', 'dfoot', dlg);
      const help = u.el('button', 'gbtn', foot, 'Help');
      help.type = 'button';
      help.addEventListener('click', () => env.log('decoy', { label: 'Help' }));
      const cancel = u.el('button', 'gbtn', foot, 'Cancel');
      cancel.type = 'button';
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const placement = er.pick(['footer', 'footer', 'header', 'link']);
      const label = placement === 'footer' ? 'Submit' : er.pick(endLabels);
      desk.dataset.endPlacement = ctx.finish ? 'none' : placement;
      const cr = ctx.rng.fork('chrome/collide');
      const alternatives = endLabels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
      const collide = cr.bool(0.3) && alternatives.length > 0;
      if (collide) cancel.textContent = cr.pick(alternatives);
      cancel.dataset.role = 'xtra';
      help.dataset.role = 'xtra';
      cancel.addEventListener('click', () =>
        env.log('decoy', collide ? { label: cancel.textContent, collide: true } : { label: 'Cancel' }),
      );
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'submit ' + (placement === 'link' ? 'end-link' : placement === 'header' ? 'gbtn end-toolbar' : 'gbtn'),
          placement === 'header' ? bar : placement === 'link' ? desk : foot,
          label,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        if (placement === 'header') bar.insertBefore(submit, bar.querySelector('.mb-clock'));
        submit.dataset.role = 'submit';
        submit.dataset.placement = placement;
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      // Keep the reference note unchanged unless a longer seeded instruction needs more room.
      if (!task.hidden && note.offsetTop + note.offsetHeight > task.clientHeight)
        task.style.height = note.offsetTop + note.offsetHeight + 4 + 'px';
      // A long notification remains in the instruction lane and clear of its completion link.
      if (!task.hidden && task.getBoundingClientRect().top < bar.getBoundingClientRect().bottom + 8) {
        task.dataset.display = 'header';
        task.querySelector('.tw-title').textContent = 'Task';
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el(
        'section',
        'perturb ' + (ctx.kind === 'chat' ? 'chat tour-overlay ' : '') + ctx.kind,
        document.body,
      );
      const head =
        ctx.kind === 'chat'
          ? cfg.obstacle
          : { cookie: 'Cookie preferences', toast: 'Notification', promo: 'A special offer', banner: 'Service notice' }[
              ctx.kind
            ];
      const body =
        ctx.kind === 'chat'
          ? cfg.copy
          : {
              cookie: 'Choose your preferences to continue.',
              toast: 'Your workspace is ready.',
              promo: 'Explore the latest tools.',
              banner: 'A new update is available.',
            }[ctx.kind];
      ctx.util.el('strong', '', el, head);
      ctx.util.el('p', '', el, body);
      const dismiss = ctx.util.el(
        'button',
        'dismiss dismiss-design',
        el,
        ctx.kind === 'cookie' ? 'Accept' : ctx.kind === 'chat' ? cfg.dismiss : 'Close',
      );
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
