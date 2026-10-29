(function () {
  'use strict';
  const cfg = { title: 'Button Practice', theme: 'yosemite', layout: 'response', tools: 'File    Edit    View    Window    Help' };
  env.site({
    name: 'design-click-control-sequence-02',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      const rng = ctx.rng.fork('chrome/end');
      const labelRng = ctx.rng.fork('chrome/end/label');
      const collideRng = ctx.rng.fork('chrome/collide');
      const rawLabels = ctx.content && ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x);
      const labels = rawLabels.map(labelOf);
      const placement = rng.pick(['panel', 'panel', 'panel', 'toolbar', 'footer', 'toolbar']);
      const submitLabel = labels.find((x) => x.toLowerCase() === 'submit') || 'Submit';
      const alternateLabels = labels.filter((x) => x.trim().toLowerCase() !== submitLabel.trim().toLowerCase());
      const label = labelRng.bool(0.5) || !alternateLabels.length ? submitLabel : labelRng.pick(alternateLabels);
      let collide = null;
      if (collideRng.bool(0.3)) {
        const options = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) collide = collideRng.pick(options);
      }

      document.body.className = `ref ${cfg.theme} ${cfg.layout}`;
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, cfg.title);
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML = '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      let submit = null;
      const toolbar = u.el('div', 'tools', head, cfg.tools);
      if (collide) {
        const decoy = u.el('button', 'chrome-xtra', toolbar, collide);
        decoy.type = 'button';
        decoy.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      if (!ctx.finish && placement === 'toolbar') {
        submit = u.el('button', 'submit chrome-submit toolbar-submit', toolbar, label);
        submit.type = 'button';
        submit.addEventListener('click', ctx.submit);
      }

      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const note = u.el('div', 'instruction', work, ctx.instruction);
      const heading = u.el('span', 'instruction-heading', null, ctx.instruction);
      note.textContent = '';
      note.appendChild(heading);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'header') {
        head.appendChild(note);
        note.classList.add('header-instruction');
      } else if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', center);

      const foot = u.el('footer', 'footer', shell);
      const ready = u.el('span', 'ready', foot, 'Ready.');
      if (!ctx.finish && placement === 'panel') {
        submit = u.el('button', 'submit', work, label);
        submit.type = 'button';
        submit.addEventListener('click', ctx.submit);
      } else if (!ctx.finish && placement === 'footer') {
        submit = u.el('button', 'submit footer-submit', foot, label);
        submit.type = 'button';
        submit.addEventListener('click', ctx.submit);
        foot.classList.add('response-footer');
        ready.hidden = true;
      } else if (ctx.finish) foot.classList.add('finish-footer');
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
