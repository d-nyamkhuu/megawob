(function () {
  'use strict';
  const cfg = { title: 'Text Reader - Quiz', theme: 'win92', layout: 'reader', tools: 'File        Edit        Search        Help' };
  env.site({
    name: 'design-handle-text-scroll-text-10',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, cfg.title);
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML = '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 5 5 5 5-5"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i>';
      u.el('div', 'sub', head, 'EXTRANET  |  PARTNER ACCESS  |  EST. 1999');
      const who = u.el('div', 'who', head);
      who.innerHTML = 'Logged in: jcarter &nbsp;|&nbsp; Acme Parts Ltd. &nbsp;|&nbsp; <u>Help</u> &nbsp;|&nbsp; <u>Sign Out</u>';
      u.el('div', 'date', head, 'Tue, Mar 16, 1999');
      let toolbar = null;
      if (cfg.tools) {
        toolbar = u.el('div', 'tools', head);
        cfg.tools.split(/\s{2,}/).forEach(t => u.el('span', t === 'Documents' ? 'tab on' : 'tab', toolbar, t));
      }
      const work = u.el('div', 'work', shell);
      work.classList.toggle('finish-mode', ctx.finish);
      const center = u.el('section', 'center', work);
      const display = ctx.display === 'panel' && window.innerWidth < 1440 ? 'header' : ctx.display;
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display === 'panel') {
        work.classList.add('has-task-panel');
        const panel = u.el('aside', 'task-panel', work);
        u.el('strong', '', panel, 'Task instructions');
        note.classList.add('instruction-panel');
        panel.appendChild(note);
      }
      if (display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', center);

      const endRng = ctx.rng.fork('chrome/end');
      const placement = ctx.finish ? null : (endRng.bool(0.5) ? 'strip' : endRng.pick(['menu', 'link']));
      const labelEntries = ctx.content && ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labels = labelEntries.map(x => typeof x === 'string' ? x : (x.label || x.text || x.name || String(x)));
      const label = placement === 'strip' ? 'Submit' : endRng.pick(labels);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'menu' ? (toolbar || head) : work;
        const cls = placement === 'link' ? 'submit end-link' : placement === 'menu' ? 'submit end-menu' : 'submit';
        submit = u.el('button', cls, parent, label);
        submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', ctx.submit);
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collideRng.bool(0.3)) {
        const same = x => String(x).trim().toLowerCase() === String(label).trim().toLowerCase();
        const choices = labels.filter(x => !same(x));
        if (choices.length) {
          const text = collideRng.pick(choices);
          const decoy = u.el('button', 'end-xtra', toolbar || head, text);
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      {
        const clear = u.el('button', 'aux clear', work, 'Clear');
        clear.type = 'button';
        clear.addEventListener('click', () => {
          const input = stage.querySelector('.ut-input');
          if (input) { input.value = ''; input.dispatchEvent(new Event('input', { bubbles: true })); }
        });
        const close = u.el('button', 'aux close', work, 'Close');
        close.type = 'button';
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el('strong', '', el, { cookie: 'Cookie preferences', toast: 'Notification', chat: 'Support', promo: 'A special offer', banner: 'Service notice' }[ctx.kind]);
      ctx.util.el('p', '', el, { cookie: 'Choose your preferences to continue.', toast: 'Your workspace is ready.', chat: 'How can we help?', promo: 'Explore the latest tools.', banner: 'A new update is available.' }[ctx.kind]);
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
