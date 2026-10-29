(function () {
  'use strict';
  const cfg = {
    'title': 'Text Task',
    'theme': 'risograph',
    'layout': 'board',
    'tools': '',
    'side':
      'Your Progress|Read the text|Find the last word|Type it into the Word field|Result|—|Not submitted yet.',
  };
  env.site({
    name: 'design-handle-text-scroll-text-03',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const end = ctx.rng.fork('chrome/end');
      const collideRng = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const labels = (
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', '✓']
      ).map(labelOf);
      const primary = labels.find((x) => x.trim().toLowerCase() === 'submit') || labels[0];
      let placement = null,
        label = primary;
      if (!ctx.finish) {
        if (end.bool(0.5)) placement = 'footer';
        else {
          placement = end.pick(['header', 'panel']);
          const alternatives = labels.filter((x) => x.trim().toLowerCase() !== primary.trim().toLowerCase());
          label = end.pick(alternatives.length ? alternatives : labels);
        }
      }
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) collide = collideRng.pick(options);
      }
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, cfg.title);
      title.insertAdjacentHTML('afterbegin', '<span class="book-icon" aria-hidden="true">▱</span>');
      u.el('div', 'sub', head, 'READ  •  FIND  •  TYPE  •  SUBMIT');
      const who = u.el('div', 'who', head);
      who.textContent = '';
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = ctx.display;
      document.body.dataset.end = placement || 'finish';
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', center);
      let aside = null;
      if (cfg.side) {
        aside = u.el('aside', 'inspector', work);
        cfg.side.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', aside, s));
      }
      if (ctx.display === 'panel' && aside) {
        note.classList.add('instruction-panel');
        aside.appendChild(note);
      }
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const decoyBtn = (parent, text, collides) => {
        const b = u.el('button', 'chrome-xtra', parent, text);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () =>
          env.log('decoy', collides ? { label: text, collide: true } : { label: text }),
        );
      };
      if (collide && placement !== 'header') decoyBtn(head, collide, true);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'header' ? head : placement === 'panel' && aside ? aside : work;
        const cls =
          placement === 'header' ? 'submit end-header' : placement === 'panel' ? 'submit end-panel' : 'submit';
        submit = u.el(placement === 'panel' ? 'a' : 'button', cls, parent, label);
        if (placement === 'panel') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      if (collide && placement === 'header') decoyBtn(aside || work, collide, true);
      const foot = u.el('footer', 'footer', shell);
      if (
        ctx.display === 'panel' &&
        aside &&
        note.getBoundingClientRect().bottom >
          (placement === 'panel' ? submit.getBoundingClientRect().top - 12 : aside.getBoundingClientRect().bottom - 20)
      ) {
        note.classList.remove('instruction-panel');
        note.dataset.display = 'header';
        center.insertBefore(note, stage);
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
