/* GTK Clearlooks "Image Adjuster" utility window: title bar, menu bar, open canvas with the task slider. */
(function () {
  'use strict';
  function lake(parent) {
    const img = env.util.el('img', 'lake', parent);
    img.src = 'sites/design-set-slider-range-09/assets/misty-lake.webp';
    img.alt = 'Misty lake and forest reflected in still water';
  }
  function btn(parent, cls, label) {
    const b = env.util.el('button', cls, parent, label); b.type = 'button'; return b;
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'gtk-dialog overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const title = {chat: 'Feedback', cookie: 'Preferences', toast: 'Notice', promo: 'Support', banner: 'Service notice'}[ctx.kind];
    const bar = u.el('div', 'gd-title', el, title);
    const x = u.el('button', 'gd-x', bar, '×'); x.setAttribute('aria-label', 'Close notice'); x.onclick = () => ctx.dismiss(ctx.kind === 'cookie' ? 'reject' : 'close');
    u.el('p', '', el, {chat: 'Did you find this tool easy to use?', cookie: 'This application can remember your display preferences.', toast: 'The image is ready for editing.', promo: 'Try the new Image Adjuster extras.', banner: 'Adjustments are available offline.'}[ctx.kind]);
    const dismiss = u.el('button', 'gd-ok', el, ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
    dismiss.type = 'button'; dismiss.onclick = () => ctx.dismiss(ctx.kind === 'cookie' ? 'reject' : 'close');
    return {el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0};
  }
  env.site({name: 'design-set-slider-range-09', styles: ['site.css'], scripts: [],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = `gtk instruction-${ctx.display}`;
      const win = u.el('div', 'win', document.body);
      const tb = u.el('header', 'titlebar', win);
      const ic = u.el('span', 'tb-icon', tb);
      const icon = u.svg('svg', {viewBox: '0 0 20 20', width: '100%', height: '100%'}, ic);
      u.svg('path', {d: 'M5 3h10M5 17h10M6 4l2 6-2 6m8-12-2 6 2 6M9 4v12m2-12v12', fill: 'none', stroke: '#93958f', 'stroke-width': 1}, icon);
      u.el('span', 'tb-title', tb, 'Image Adjuster');
      const ctl = u.el('span', 'tb-btns', tb);
      u.el('i', 'tb-b min', ctl, '_'); u.el('i', 'tb-b max', ctl, '□'); u.el('i', 'tb-b close', ctl, '✕');
      const menu = u.el('nav', 'menubar', win);
      for (const m of ['File', 'Edit', 'View', 'Help']) u.el('span', '', menu, m);
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (value) => typeof value === 'string' ? value : value.label || value.text || value.name;
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = endRng.bool(0.5);
      const placement = referenceEnd ? 'footer' : endRng.pick(['toolbar', 'link']);
      const label = referenceEnd ? 'Submit' : endRng.pick(endLabels);
      const tools = u.el('div', 'menu-tools', menu);
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const options = endLabels.filter((text) => text.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const decoyLabel = collideRng.pick(options);
          const decoy = btn(tools, 'menu-button', decoyLabel);
          decoy.dataset.role = 'xtra';
          decoy.onclick = () => env.log('decoy', {label: decoyLabel, collide: true});
        }
      }
      const instruction = u.el('div', 'instruction', win, ctx.instruction);
      if (ctx.display === 'hidden') instruction.hidden = true;
      if (ctx.display === 'toast') {
        const close = u.el('button', 'instruction-close', instruction, 'Close');
        close.onclick = () => { instruction.hidden = true; };
      }
      const pic = u.el('div', 'picture', win);
      lake(pic);
      const stage = u.el('main', 'stage', win); stage.dataset.role = 'stage';
      const actions = u.el('div', 'actions', win);
      const reset = btn(actions, 'reset', 'Reset'); reset.dataset.action = 'reset';
      reset.onclick = () => env.log('decoy', {label: 'Reset'});
      let submit = null;
      if (!ctx.finish) {
        if (placement === 'footer') submit = btn(actions, 'primary', label);
        else if (placement === 'toolbar') submit = btn(tools, 'menu-button', label);
        else {
          submit = u.el('a', 'end-link', win, label);
          submit.href = '#';
        }
        submit.dataset.role = 'submit';
        submit.title = label; submit.setAttribute('aria-label', label);
        submit.onclick = (event) => { event.preventDefault(); ctx.submit(); };
      }
      return {stage, submit};
    },
    overlay: drawOverlay,
  });
})();
