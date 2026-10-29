(function () {
  'use strict';
  const cfg = { title: 'Customer Information', theme: 'yosemite', layout: 'board', tools: '', rail: '' };
  env.site({
    name: 'design-click-control-focus-04',
    styles: ['ref.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, cfg.title);
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML = '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      if (cfg.tools) u.el('div', 'tools', head, cfg.tools);
      if (cfg.overview) {
        const ov = u.el('section', 'overview', shell);
        cfg.overview.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', ov, s));
      }
      const work = u.el('div', 'work', shell);
      if (cfg.rail) {
        const rail = u.el('nav', 'rail', work);
        cfg.rail.split('|').forEach((s, i) => u.el('div', i === 0 ? 'active' : '', rail, s));
      }
      const center = u.el('section', 'center', work);
      let display = ctx.display || 'header';
      if ((display === 'panel' && shell.clientWidth < 1260) || (display === 'toast' && shell.clientHeight < 680)) display = 'header';
      const noteParent = display === 'panel' ? work : center;
      const note = u.el('div', 'instruction', noteParent, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display === 'panel') {
        note.classList.add('episode-panel');
        const heading = u.el('strong', 'episode-panel-title', note, 'Instructions');
        note.insertBefore(heading, note.firstChild);
      }
      if (display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', center);
      const foot = u.el('footer', 'footer', shell);
      const endR = ctx.rng.fork('chrome/end');
      let placement = 'footer';
      let label = 'Submit';
      if (!ctx.finish && !endR.bool(0.5)) {
        placement = endR.pick(['header', 'link', 'footer']);
        const labels = ctx.content && ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const picked = endR.pick(labels);
        label = typeof picked === 'string' ? picked : (picked.label || picked.text || picked.name || String(picked));
      }
      if (placement === 'header' && display !== 'header' && display !== 'toast') placement = 'footer';
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      const endLabels = ctx.content && ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      if (!ctx.finish && collideR.bool(0.3)) {
        const options = endLabels.map(x => typeof x === 'string' ? x : (x.label || x.text || x.name || String(x)))
          .filter(x => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) collide = collideR.pick(options);
      }
      const decoyBtn = (parent, text) => {
        const b = u.el('button', 'episode-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
      };
      let submit = null;
      if (placement === 'header' && !ctx.finish) {
        const actions = u.el('span', 'episode-actions', note);
        if (collide) decoyBtn(actions, collide);
        submit = u.el('button', 'submit episode-submit', actions, label);
        submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', ctx.submit);
      }
      const clear = u.el('button', 'clear-form', foot, 'Cancel');
      clear.type = 'button';
      clear.addEventListener('click', () => stage.querySelectorAll('input,textarea').forEach(input => { input.value = ''; }));
      if (!ctx.finish && placement !== 'header') {
        if (collide) decoyBtn(foot, collide);
        if (placement === 'link') submit = u.el('button', 'episode-link', foot, label + ' ›');
        else submit = u.el('button', 'submit', foot, label);
        submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', ctx.submit);
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
