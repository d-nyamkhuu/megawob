(function () {
  'use strict';
  const cfg = { title: 'Reading Task' };
  env.site({
    name: 'design-click-control-link-07',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref eink';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const icon = u.el('span', 'app-icon', head);
      icon.innerHTML =
        '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="6"/><path d="M8 10h8v6H8Z M10 10V8h4v2 M8 12q4 3 8 0 M11 13h2"/></svg>';
      u.el('div', 'title', head, cfg.title);
      const controls = u.el('span', 'window-controls', head);
      controls.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 8h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const brief = u.el('div', 'brief', center);
      u.el('div', 'brief-label', brief, 'Your Task');
      const note = u.el('div', 'instruction', brief, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      brief.hidden = ctx.display !== 'header';
      if (ctx.instruction.length > 65) note.classList.add('long-instruction');
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
        head.appendChild(note);
      }
      const stage = u.el('div', 'stage', center);
      const aside = u.el('aside', 'inspector', work);
      if (ctx.display === 'panel') {
        note.classList.add('instruction-panel');
        aside.appendChild(note);
      }
      u.el('h2', '', aside, 'Your Selection');
      u.el('div', 'selection-box', aside, 'No link selected.');
      const hint = u.el('p', 'selection-hint', aside, 'Click a link in the article to select it.');
      let submit = null;
      let label = 'Submit';
      let placement = 'inspector';
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const choice = er.int(0, 9);
        if (choice >= 5) {
          const labels = ctx.content && ctx.content.END_LABELS;
          const picked = er.pick(
            labels && labels.length
              ? labels
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"],
          );
          label = typeof picked === 'string' ? picked : picked.label || picked.text || picked.name || String(picked);
          placement = choice < 7 ? 'head' : choice < 9 ? 'link' : 'inspector';
        }
        const parent = placement === 'head' ? head : aside;
        const tag = placement === 'link' ? 'a' : 'button';
        submit = u.el(
          tag,
          placement === 'head' ? 'submit head-end' : placement === 'link' ? 'text-end' : 'submit',
          parent,
          placement === 'head' ? '✓' : placement === 'link' ? label + ' ›' : label,
        );
        if (tag === 'button') submit.type = 'button';
        else submit.href = '#';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (!ctx.finish) hint.textContent += ' Then click ' + label + '.';
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const labels = ctx.content && ctx.content.END_LABELS;
        const bank =
          labels && labels.length
            ? labels
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const options = bank
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name))
          .filter((x) => x && x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const text = cr.pick(options);
          const target = placement === 'inspector' ? aside : head;
          const d = u.el('button', placement === 'inspector' ? 'xtra' : 'xtra head-xtra', target, text);
          if (placement === 'inspector' && submit) target.insertBefore(d, submit);
          d.type = 'button';
          d.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
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
