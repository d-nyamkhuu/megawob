/* Image Adjuster: pastel native desktop utility, two unequal panes, status shelf. */
(function () {
  'use strict';
  function scene(parent) {
    const u = env.util;
    const image = u.el('img', 'landscape-photo', parent);
    image.src = 'sites/design-set-slider-log-02/assets/mountain-lake-reference.webp';
    image.alt = 'Alpine mountains and evergreen forest reflected in a lake';
  }
  const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'note-dlg overlay-' + ctx.kind, document.body); el.setAttribute('role', 'dialog');
    const title = {chat:'Feedback', cookie:'Privacy', toast:'Notice', promo:'Tip', banner:'Notice'}[ctx.kind];
    u.el('h2', '', el, title);
    u.el('p', '', el, {chat:'Tell us how Image Adjuster is working for you.', cookie:'This app can remember your display preferences.', toast:'Settings are ready for editing.', promo:'Try the new adjustment presets.', banner:'Image Adjuster is available offline.'}[ctx.kind]);
    const dismiss = u.el('button', 'pill', el, ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
    dismiss.type = 'button'; dismiss.onclick = () => ctx.dismiss('dismiss');
    return {el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0};
  }
  env.site({name:'design-set-slider-log-02', styles:['site.css'], scripts:[],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = `adjuster instruction-${ctx.display}`;
      const W = window.innerWidth, H = window.innerHeight;
      let display = ctx.display || 'header';
      if (display === 'panel' && W < 1260) display = 'header';
      if (display === 'toast' && H < 700) display = 'header';
      document.body.className = `adjuster instruction-${display}`;
      const endRng = ctx.rng.fork('chrome/end');
      const standardEnd = !ctx.finish && endRng.bool(0.5);
      const placement = ctx.finish ? null : (standardEnd ? 'actions' : endRng.pick(['menu', 'status']));
      const labels = ctx.content && ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const endLabel = standardEnd ? 'Submit' : labelOf(endRng.pick(labels));
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (pool.length) collide = labelOf(collideRng.pick(pool));
      }
      const win = u.el('div', 'win', document.body);
      const title = u.el('div', 'titlebar', win);
      const logo = u.svg('svg', {viewBox:'0 0 24 24', class:'logo'}, title);
      u.svg('path', {d:'M2 21Q0 21 1 18L7 9Q8 7 10 10L12 13L16 4Q17 2 18 5L24 18Q25 21 22 21Z', fill:'#2175f8'}, logo);
      u.el('span', 'apptitle', title, 'Image Adjuster');
      const wc = u.el('div', 'wincontrols', title);
      u.el('span', 'wc-min', wc); u.el('span', 'wc-max', wc); u.el('span', 'wc-close', wc);
      const menu = u.el('div', 'menubar', win);
      for (const m of ['File', 'Edit', 'View', 'Window', 'Help']) u.el('span', '', menu, m);
      u.el('span', 'spacer', menu);
      const menutools = u.el('span', 'menu-tools', menu);
      let submit = null;
      const addEnd = (parent, where, text, cls) => {
        const b = u.el(where === 'status' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button'; else b.href = '#';
        b.dataset.role = 'submit'; b.setAttribute('aria-label', text); b.title = text;
        b.onclick = (e) => { e.preventDefault(); ctx.submit(); };
        return b;
      };
      const addCollide = (parent) => {
        if (!collide) return;
        const b = u.el('button', 'menu-xtra', parent, collide); b.type = 'button';
        b.dataset.role = 'xtra';
        b.onclick = () => env.log('decoy', {label: collide, collide: true});
      };
      if (placement === 'menu') submit = addEnd(menutools, 'menu', endLabel, 'menu-end');
      addCollide(menutools);
      for (const m of ['Help', 'Settings']) u.el('span', 'right', menu, m);
      const main = u.el('div', 'panes', win);
      const left = u.el('section', 'pane-left', main);
      const task = u.el('div', 'instruction', left, ctx.instruction);
      if (display === 'hidden') task.hidden = true;
      if (display === 'panel') task.classList.add('instruction-panel');
      if (display === 'toast') {
        task.classList.add('instruction-toast');
        const close = u.el('button', 'instruction-close pill', task, 'Close');
        close.type = 'button'; close.onclick = () => { task.hidden = true; };
      }
      const photo = u.el('div', 'photo-frame', left);
      scene(photo);
      u.el('div', 'divider', main);
      const right = u.el('section', 'pane-right', main);
      u.el('h2', '', right, 'Adjustments');
      const stage = u.el('main', 'record-stage', right); stage.dataset.role = 'stage';
      const actions = u.el('div', 'actions', right);
      const reset = u.el('button', 'pill reset', actions, 'Reset'); reset.type = 'button'; reset.dataset.action = 'reset';
      if (placement === 'actions') submit = addEnd(actions, 'actions', endLabel, 'pill primary');
      const status = u.el('footer', 'statusbar', win);
      u.el('span', '', status, 'Ready');
      if (placement === 'status') submit = addEnd(status, 'status', endLabel, 'status-end');
      u.el('span', 'spacer', status);
      u.el('span', '', status, '1920 × 1080');
      u.el('span', 'sep', status);
      u.el('span', '', status, '100%');
      // Reference shows no obstruction on load; the oracle wrapper is not installed here.
      return {stage, submit};
    },
    overlay: drawOverlay,
  });
})();
