(function () {
  env.site({
    name: 'design-handle-text-sign-agreement-12',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref minimal-sign';
      const shell = u.el('main', 'shell', document.body),
        head = u.el('header', 'head', shell);
      head.innerHTML =
        '<b>Bright<span>Path</span></b><small><i class="av"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#556" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-5 4-7 8-7s8 2 8 7"/></svg></i>Guest User <svg viewBox="0 0 12 12" width="12" height="12" fill="none" stroke="#556" stroke-width="1.5"><path d="M2 4l4 4 4-4"/></svg></small>';
      const work = u.el('div', 'work', shell),
        nav = u.el('nav', 'minimal-nav', work);
      const IC = [
        '<path d="M3 11l9-8 9 8M5 10v10h5v-6h4v6h5V10"/>',
        '<path d="M6 2h8l5 5v15H6zM14 2v5h5"/>',
        '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-5 4-7 8-7s8 2 8 7"/>',
        '<circle cx="12" cy="12" r="3.5"/><path d="M9 3l1-2h4l1 2 2 1 2-1 3 3-1 2 1 2 2 1v4l-2 1-1 2 1 2-3 3-2-1-2 1-1 2h-4l-1-2-2-1-2 1-3-3 1-2-1-2-2-1v-4l2-1 1-2-1-2 3-3 2 1z"/>',
      ];
      ['Home', 'Documents', 'Profile', 'Settings'].forEach((t, i) => {
        const d = u.el('div', i === 1 ? 'active' : '', nav);
        d.innerHTML =
          '<svg class="ico" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round">' +
          IC[i] +
          '</svg><span>' +
          t +
          '</span>';
      });
      const card = u.el('section', 'agreement-card', work);
      u.el('h1', '', card, 'User Agreement');
      const stage = u.el('div', 'stage', card);
      const aside = u.el(ctx.display === 'header' ? 'header' : 'aside', 'task-note note-' + ctx.display, work);
      aside.hidden = ctx.display === 'hidden';
      u.el('h2', '', aside, 'Your task');
      const note = u.el('div', 'instruction', aside, ctx.instruction);
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const headerNote = ctx.display === 'header' || (ctx.display !== 'hidden' && work.clientWidth <= 1280);
      if (headerNote) {
        aside.className = 'task-note note-header';
        shell.insertBefore(aside, work);
      }
      const shortcut = u.el('section', 'shortcut', work);
      const bolt = u.el('span', 'bolt', shortcut);
      bolt.innerHTML =
        '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7z"/></svg>';
      u.el('strong', '', shortcut, 'Quick action');
      u.el('p', '', shortcut, 'Auto-fill my name');
      const disabled = u.el('button', '', shortcut, 'Unavailable');
      disabled.disabled = true;
      if (ctx.display !== 'hidden' && !headerNote) {
        const noteBottom = aside.offsetTop + aside.offsetHeight;
        shortcut.style.top = Math.max(work.clientHeight * 0.388, noteBottom + 24) + 'px';
      }
      const er = ctx.rng.fork('chrome/end'),
        cr = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const original = er.bool(0.5),
        placement = original ? 'reference' : er.pick(['header', 'link']);
      const label = original ? 'Submit' : er.pick(labels.filter((x) => x !== 'Submit'));
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(placement === 'link' ? 'a' : 'button', 'submit end-' + placement, shell, label);
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.dataset.role = 'submit';
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (cr.bool(0.3)) {
        const options = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const text = cr.pick(options),
            decoy = u.el('button', 'end-xtra', nav, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
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
      ctx.util.el('p', '', el, 'Close this notice to continue.');
      const dismiss = ctx.util.el('button', 'dismiss', el, 'Close');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
