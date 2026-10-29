/* NeXTSTEP-style Lab Control reference frame. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  function drawOverlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
      el.setAttribute('role', 'dialog');
      const content = {
        chat: ['Welcome to Lab Control', 'Take a quick tour to learn the controls and features.', 'Start tour', 'Skip tour'],
        cookie: ['Your privacy', 'Allow optional cookies for this practice workspace?', 'Accept optional', 'Reject optional'],
        toast: ['Settings saved', 'Your current workspace is ready to continue.', null, 'Dismiss'],
        promo: ['More experiments', 'Explore more exercises after completing this task.', 'Show details', 'Not now'],
        banner: ['Workspace notice', 'This practice session works offline.', null, 'Dismiss'],
      }[ctx.kind];
      u.el('h2', '', el, content[0]);
      const close = u.el('button', 'bubble-close', el, '×');
      close.type = 'button'; close.setAttribute('aria-label', 'Close notice');
      close.onclick = () => ctx.dismiss('close');
      const message = u.el('p', '', el, content[1]);
      const actions = u.el('div', 'tour-actions', el);
      if (content[2]) {
        const primary = u.el('button', 'tour-primary', actions, content[2]); primary.type = 'button';
        primary.onclick = () => {
          if (ctx.kind === 'cookie') ctx.dismiss('accept');
          else { message.textContent = 'Click and drag the knob around its center to turn it to the requested setting.'; primary.hidden = true; }
        };
      }
      const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('skip');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  function titlebar(u, parent, text, cls) {
    const bar = u.el('header', 'nx-title ' + (cls || ''), parent);
    const mini = u.el('i', 'nx-mini', bar);
    const glyph = u.svg('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' }, mini);
    u.svg('path', { d: 'M4 9L13 3L20 9L11 15ZM4 12L11 18L20 12M4 15L11 21L20 15', fill: '#b9b9b9', stroke: '#eee', 'stroke-width': .8 }, glyph);
    u.svg('path', { d: 'M13 3V10L20 9M4 9L11 15V21', fill: 'none', stroke: '#555', 'stroke-width': 1 }, glyph);
    u.el('span', 'nx-title-text', bar, text);
    u.el('i', 'nx-close', bar, '×');
    return bar;
  }
  env.site({
    name: 'design-rotate-object-dial-02', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const endLabels = ctx.content.END_LABELS.map(x => typeof x === 'string' ? x : (x.label || x.text || x.name));
      const placement = endRng.pick(['footer', 'footer', 'toolbar', 'link']);
      const endLabel = placement === 'footer' ? 'Submit' : endRng.pick(endLabels.filter(x => x !== 'Submit'));
      document.body.className = `nextstep instruction-${ctx.display}`;
      const menu = u.el('nav', 'nx-menu', document.body);
      u.el('span', 'nx-apple', menu, '');
      u.svg('svg', { width: 16, height: 18, viewBox: '0 0 16 18' }, menu.firstChild);
      menu.firstChild.firstChild.innerHTML = '<path d="M8 4C6 2.7 2 4 2 9c0 4 3 8 5 7 1-.5 2-.5 3 0 1.7.9 3.8-2.5 4.6-4.5-1.8-.8-2.5-3.5-.5-5.3C12.7 2.8 10.5 3 9 4zM9 3C9 1 10 0 11.5 0 11.5 2 10 3 9 3z" fill="#111"/>';
      for (const m of ['File', 'Edit', 'View', 'Tools', 'Windows', 'Help']) u.el('span', '', menu, m);
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const options = endLabels.filter(x => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        const label = collideRng.pick(options);
        const decoy = u.el('button', 'nx-menu-xtra', menu, label);
        decoy.type = 'button'; decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', { label, collide: true });
      }
      u.el('span', 'nx-clock', menu, 'Mon Apr 12   10:24 AM');

      const top = u.el('section', 'nx-win nx-overview', document.body);
      const overviewBar = titlebar(u, top, 'Lab Control — Thermal Chamber');
      const tb = u.el('div', 'nx-ov-body', top);
      const left = u.el('div', 'nx-ov-left', tb);
      u.el('h3', '', left, 'Experiment Overview');
      for (const [k, v] of [['Project:', 'Alloy Stress Test'], ['Sample ID:', 'A3-1187'], ['Chamber Mode:', 'Heat Soak'],
        ['Temperature:', '125 °C'], ['Hold Time (Target):', 'See task'], ['Status:', 'Ready']]) {
        const r = u.el('div', 'nx-kv', left); u.el('span', '', r, k); u.el('span', '', r, v);
        if (k === 'Hold Time (Target):') r.lastChild.dataset.role = 'overview-target';
      }
      const right = u.el('div', 'nx-ov-right', tb);
      u.el('h3', '', right, 'Procedure');
      const steps = ['Place sample in chamber.', 'Set temperature to 125 °C.', 'Turn the knob to the requested setting.', 'Close the chamber door.'];
      steps.forEach((s, i) => {
        const r = u.el('div', 'nx-step' + (i === 2 ? ' on' : ''), right);
        u.el('span', '', r, (i + 1) + '.'); u.el('span', '', r, s);
        if (i === 2) r.lastChild.dataset.role = 'procedure-goal';
      });

      const win = u.el('section', 'nx-win nx-setter', document.body);
      const setterBar = titlebar(u, win, 'Set Timer');
      const page = u.el('div', 'nx-set-body', win);
      const heading = u.el('h1', 'instruction', page, ctx.instruction);
      if (ctx.display === 'hidden') heading.hidden = true;
      if (ctx.display === 'panel') {
        right.querySelector('h3').textContent = 'Task Inspector';
        right.appendChild(heading);
      }
      if (ctx.display === 'toast') {
        const close = u.el('button', 'instruction-dismiss', heading, 'Close');
        close.type = 'button'; close.onclick = () => { heading.hidden = true; };
      }
      const stage = u.el('main', 'cube-stage', page);
      stage.dataset.role = 'stage';
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'footer' ? page : (placement === 'toolbar' ? setterBar : overviewBar);
        submit = u.el(placement === 'link' ? 'a' : 'button',
          placement === 'footer' ? 'submit-button' : `nx-end nx-end-${placement}`, parent, endLabel);
        if (placement === 'link') submit.href = '#';
        submit.type = 'button'; submit.dataset.role = 'submit'; submit.onclick = () => ctx.submit();
        submit.title = endLabel; submit.setAttribute('aria-label', endLabel);
        if (placement === 'link') submit.onclick = e => { e.preventDefault(); ctx.submit(); };
      }
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
