(function () {
  'use strict';
  const cfg = { 'title': 'Acme Workspace', 'theme': 'clearlooks', 'layout': 'split', 'tools': '', 'overview': '' };
  env.site({
    name: 'design-handle-text-sign-agreement-03',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, cfg.title);
      const glyph = u.el('span', 'title-document', title);
      glyph.innerHTML =
        '<svg viewBox="0 0 20 24"><path d="M2 1h11l5 5v16H2Z" fill="#f4f4ef" stroke="#59636c"/><path d="M13 1v6h5M5 9h9M5 12h8M5 15h9M5 18h6" fill="none" stroke="#849097"/><path d="M6 6h3v4H6Z" fill="#a9bac7" stroke="#5e6d77"/></svg>';
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const work = u.el('div', 'work', shell);
      const briefing = u.el('aside', 'briefing', work);
      u.el('div', 'brief-label', briefing, 'TASK');
      const note = u.el('div', 'instruction', briefing, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      u.el('div', 'brief-rule', briefing);
      u.el('div', 'brief-heading', briefing, 'Additional information');
      u.el(
        'p',
        'brief-copy',
        briefing,
        'Review the agreement on the right. You can scroll using your mouse wheel or the scrollbar.',
      );
      u.el(
        'p',
        'brief-copy',
        briefing,
        'After entering the requested name, click "Agree". You may also click "Cancel" if you do not wish to agree.',
      );
      const center = u.el('section', 'center', work);
      const appbar = u.el('div', 'workspace-bar', center);
      const appIcon = u.el('span', 'app-icon', appbar);
      appIcon.innerHTML =
        '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" stroke-width="1.6"/></svg>';
      u.el('strong', '', appbar, 'Document Center');
      u.el('span', 'bar-spacer', appbar);
      const help = u.el('span', 'help-item', appbar);
      help.innerHTML = '<b>?</b> Help';
      u.el('span', 'avatar', appbar, 'LC');
      const stage = u.el('div', 'stage', center);
      const titleCard = u.el('div', 'agreement-heading', stage);
      u.el('h1', '', titleCard, 'Software License Agreement');
      u.el('p', '', titleCard, 'Last updated: March 1, 2024');
      const foot = u.el('footer', 'footer', center);
      u.el('span', 'ready', foot, '');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const er = ctx.rng.fork('chrome/end');
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['toolbar', 'titlebar']);
      const endLabel = referenceEnd ? labels.find((x) => x === 'Submit') || labels[0] : er.pick(labels);
      let submit = null;
      foot.hidden = ctx.finish || placement !== 'footer';
      shell.dataset.end = ctx.finish ? 'finish' : placement;
      if (!ctx.finish) {
        const parent = placement === 'footer' ? foot : placement === 'toolbar' ? appbar : title;
        submit = u.el('button', 'submit end-' + placement, parent, placement === 'titlebar' ? '✓' : endLabel);
        submit.type = 'button';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.dataset.role = 'submit';
        if (placement === 'toolbar') appbar.insertBefore(submit, help);
        submit.addEventListener('click', ctx.submit);
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = labels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = cr.pick(options);
          const decoy = u.el('button', 'chrome-xtra', appbar, label);
          appbar.insertBefore(decoy, help);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
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
