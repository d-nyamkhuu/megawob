(function () {
  'use strict';
  const steps = [
    'Review feedback from the discovery phase',
    'Align on priorities with the team',
    'Prepare a first round of designs',
    'Schedule a follow-up check-in',
  ];
  const related = ['Product roadmap', 'Design principles', 'User research summary', 'Release plan'];
  env.site({
    name: 'design-click-control-tab-01',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref collage';
      const endR = ctx.rng.fork('chrome/end');
      const endWords = ctx.content.END_LABELS;
      const standard = endR.bool(0.5);
      const endLabel = standard
        ? 'Submit'
        : endR.pick(endWords.filter((x) => String(x).trim().toLowerCase() !== 'submit'));
      const placement = standard ? 'dock' : endR.pick(['link', 'icon']);
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideR.bool(0.3)) {
        const pool = endWords.filter((x) => String(x).trim().toLowerCase() !== String(endLabel).trim().toLowerCase());
        if (pool.length) collide = collideR.pick(pool);
      }
      const shell = u.el('main', 'shell', document.body);
      const defs = u.el('div', 'paper-defs', shell);
      defs.innerHTML =
        '<svg width="0" height="0" aria-hidden="true"><defs><filter id="paper-edge" x="-5%" y="-10%" width="110%" height="120%"><feTurbulence type="fractalNoise" baseFrequency=".075" numOctaves="3" seed="12" result="grain"/><feDisplacementMap in="SourceGraphic" in2="grain" scale="8" xChannelSelector="R" yChannelSelector="G"/></filter></defs></svg>';
      const top = u.el('header', 'top', shell);
      const note = u.el('div', 'instruction', top, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display !== 'header';
      u.el('div', 'hint', top, 'Explore the notes below. The link is in one of the tabs.');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const stage = u.el('div', 'stage', center);
      const aside = u.el('aside', 'inspector', work);
      if (ctx.display === 'panel') {
        const task = u.el('div', 'episode-panel', aside);
        u.el('strong', '', task, 'Task');
        u.el('span', '', task, ctx.instruction);
      }
      if (ctx.display === 'toast') {
        const task = u.el('div', 'episode-toast', work);
        u.el('strong', '', task, 'Task');
        u.el('span', '', task, ctx.instruction);
      }
      u.el('span', 'tape', aside);
      u.el('h2', '', aside, 'Next Steps');
      const ol = u.el('ol', 'steps', aside);
      steps.forEach((s, i) => {
        const li = u.el('li', '', ol);
        u.el('b', '', li, String(i + 1));
        u.el('span', '', li, s);
      });
      u.el('hr', '', aside);
      u.el('h2', '', aside, 'Related Links');
      const ul = u.el('ul', 'related', aside);
      related.forEach((s) => {
        const li = u.el('li', '', ul);
        u.el('span', '', li, s);
      });
      const star = u.el('span', 'star', aside);
      star.innerHTML =
        '<svg viewBox="0 0 60 64"><path d="M34 5l2 19 19 7-19 8 1 19-14-15-17 4 9-18L7 18l20 4Z" fill="#ffda70" stroke="#fff" stroke-width="10" stroke-linejoin="round"/><path d="M34 5l2 19 19 7-19 8 1 19-14-15-17 4 9-18L7 18l20 4Z" fill="none" stroke="#ffab18" stroke-width="4" stroke-linejoin="round"/><path d="m17 23 18 17-4-21-14 25 24-14-24-2 18 19" stroke="#ffaf22" stroke-width="3" fill="none" stroke-linejoin="round"/></svg>';
      const foot = u.el('footer', 'footer', shell);
      const ic = u.el('span', 'dock-icon', foot);
      ic.innerHTML =
        '<svg viewBox="0 0 24 24"><path d="M5 7h14M5 12h14M5 17h14" stroke="#1f2126" stroke-width="2.6" stroke-linecap="round"/></svg>';
      const tk = u.el('div', 'dock-task', foot);
      u.el('strong', '', tk, 'Task');
      if (ctx.display === 'header') u.el('span', '', tk, ctx.instruction);
      const help = u.el('span', 'help', foot);
      help.innerHTML = '<i>?</i><u>Help</u>';
      let submit = null;
      const decoy = (label, collides) => {
        const b = u.el('button', collides ? 'dock-xtra collide' : 'dock-xtra', foot, label);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', collides ? { label, collide: true } : { label }));
      };
      if (collide) decoy(collide, true);
      if (!ctx.finish) {
        const text = placement === 'icon' ? '✓' : placement === 'link' ? `${endLabel} ›` : endLabel;
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          placement === 'link' ? 'submit submit-link' : placement === 'icon' ? 'submit submit-icon' : 'submit',
          foot,
          text,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.setAttribute('aria-label', String(endLabel));
        submit.title = String(endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
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
