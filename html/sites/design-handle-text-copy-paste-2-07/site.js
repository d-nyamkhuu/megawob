(function () {
  'use strict';
  const cfg = { title: 'File     Edit     Document     Window     Help', theme: 'lisa', layout: 'station', tools: 'Mon Apr 21   10:24 AM' };
  env.site({
    name: 'design-handle-text-copy-paste-2-07',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const labels = ctx.content.END_LABELS.map(x => typeof x === 'string' ? x : (x.label || x.text || x.name));
      const referenceEnd = endRng.bool(0.5);
      const placement = referenceEnd ? 'footer' : endRng.pick(['toolbar', 'brief-link']);
      const endLabel = referenceEnd ? 'Submit' : endRng.pick(labels.filter(x => x !== 'Submit'));
      document.body.className = `ref ${cfg.theme} ${cfg.layout}`;
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head);
      u.el('span', 'title-text', title, '●');
      u.el('span', 'menu-labels', title, cfg.title);
      u.el('div', 'tools', head, cfg.tools);

      const work = u.el('div', 'work', shell);
      const left = u.el('aside', 'left-brief', work);
      u.el('h1', 'brief-title', left, 'Task');
      const center = u.el('section', 'center', work);
      const note = u.el('div', 'instruction', left, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      u.el('div', 'brief-rule', left);
      u.el('p', 'brief-copy', left,
        'The entries are on the right. Each line is numbered, and the number is separate from the content. Copy only the requested text (do not include the line number) and paste it into the “Answer” field.');

      const stage = u.el('div', 'stage', center);
      let submit = null;
      if (!ctx.finish) {
        const clear = u.el('button', 'station-clear', center, 'Clear');
        clear.type = 'button';
        clear.addEventListener('click', () => {
          const input = center.querySelector('.ut-input');
          if (!input || input.disabled) return;
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        });
        submit = u.el('button', `submit end-${placement}`, placement === 'brief-link' ? left : center, endLabel);
        submit.type = 'button';
        submit.dataset.placement = placement;
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', ctx.submit);
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const label = collideRng.pick(labels.filter(x => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()));
        const decoy = u.el('button', `station-xtra${placement === 'toolbar' && !ctx.finish ? ' xtra-footer' : ''}`, center, label);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', `perturb ${ctx.kind}`, document.body);
      ctx.util.el('strong', '', el, { cookie: 'Cookie preferences', toast: 'Notification', chat: 'Support', promo: 'A special offer', banner: 'Service notice' }[ctx.kind]);
      ctx.util.el('p', '', el, { cookie: 'Choose your preferences to continue.', toast: 'Your workspace is ready.', chat: 'How can we help?', promo: 'Explore the latest tools.', banner: 'A new update is available.' }[ctx.kind]);
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
