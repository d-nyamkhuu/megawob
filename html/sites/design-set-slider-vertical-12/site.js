/* 2013 bootstrap-style admin: Edit Image workspace anchored right of a briefing column. */
(function () {
  'use strict';
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'adm-overlay overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    const title = {chat:'Feedback',cookie:'Cookies',toast:'Notice',promo:'Upgrade your library',banner:'Service notice'}[ctx.kind] || 'Notice';
    u.el('h2', '', el, title);
    const x = u.el('button', 'adm-x', el, '×'); x.type = 'button'; x.setAttribute('aria-label', 'Close notice'); x.onclick = () => ctx.dismiss('close');
    u.el('p', '', el, {cookie:'This tool remembers your display preferences.',toast:'The image is ready for editing.',promo:'Try the new image tools today.',banner:'The image editor is available offline.',chat:'Tell us how the editor is working for you.'}[ctx.kind] || 'Notice');
    const dismiss = u.el('button', 'btn btn-primary', el, ctx.kind === 'cookie' ? 'Reject optional' : 'Dismiss');
    dismiss.type = 'button'; dismiss.onclick = () => ctx.dismiss('dismiss');
    return {el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0};
  }
  function fakeSlider(parent, u, label, pos) {
    const row = u.el('div', 'fake-row', parent);
    const body = u.el('div', 'fake-body', row);
    u.el('div', 'fake-label', body, label);
    const rail = u.el('div', 'fake-rail', body);
    const th = u.el('div', 'fake-thumb', rail); th.style.left = pos + '%';
    u.el('div', 'fake-val', row, '0');
  }
  const END_LABELS = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
  const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
  function endLabel(ctx, rng) {
    const bank = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
      ? ctx.content.END_LABELS : END_LABELS;
    return labelOf(rng.pick(bank));
  }
  env.site({name:'design-set-slider-vertical-12', styles:['site.css'], scripts:[],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = `adm instruction-${ctx.display}`;
      const endRng = ctx.rng.fork('chrome/end');
      const collideRng = ctx.rng.fork('chrome/collide');
      const originalEnd = !ctx.finish && endRng.bool(0.5);
      const placement = ctx.finish ? null : (originalEnd ? 'footer' : endRng.pick(['header', 'title-link']));
      const label = ctx.finish ? null : (originalEnd ? 'Submit' : endLabel(ctx, endRng));
      let collide = null;
      let collideWhere = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const bank = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS : END_LABELS;
        const options = [...new Set(bank.map(labelOf))].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          collide = labelOf(collideRng.pick(options));
          collideWhere = collideRng.pick(['header', 'footer']);
        }
      }
      const nav = u.el('header', 'adm-nav', document.body);
      u.el('div', 'adm-nav-fill', nav);
      const tabs = u.el('nav', 'adm-tabs', nav);
      for (const t of ['Library', 'Edit', 'Organize', 'Share']) { const a = u.el('span', 'adm-tab' + (t === 'Edit' ? ' on' : ''), tabs, t); }
      const util = u.el('div', 'adm-util', nav);
      ['Help', 'Settings', 'Sign Out'].forEach((t) => u.el('span', '', util, t));
      const body = u.el('div', 'adm-body', document.body);
      const brief = u.el('aside', 'adm-brief', body);
      u.el('div', 'adm-kicker', brief, 'TASK');
      const instruction = u.el('div', 'instruction display-' + ctx.display, brief, ctx.instruction);
      if (ctx.instruction.length > 70) instruction.classList.add('verbose');
      if (ctx.display === 'hidden') instruction.hidden = true;
      if (ctx.display === 'toast') {
        const close = u.el('button', 'instruction-close', instruction, 'Close'); close.type = 'button';
        close.onclick = () => { instruction.hidden = true; };
      }
      u.el('p', '', brief, 'Adjust the image overlay using the slider on the right.');
      u.el('p', '', brief, 'Match the target value shown above; a value within the stated tolerance is acceptable.');
      u.el('hr', '', brief);
      u.el('div', 'adm-notes', brief, 'Notes:');
      const ul = u.el('ul', '', brief);
      u.el('li', '', ul, 'Use the slider, not the Quick action button (it’s disabled).');
      u.el('li', '', ul, 'You do not need to type anything.');
      const work = u.el('section', 'adm-work', body);
      const head = u.el('div', 'adm-head', work);
      u.el('h1', '', head, 'Edit Image');
      u.el('div', 'adm-file', head, 'File: mountain.jpg');
      let submit = null;
      if (placement === 'header') {
        const submitHead = u.el('button', 'btn btn-primary adm-end-head', head, label);
        submitHead.type = 'button'; submitHead.dataset.role = 'submit'; submitHead.onclick = () => ctx.submit();
        submit = submitHead;
      } else if (placement === 'title-link') {
        const submitLink = u.el('button', 'adm-end-link', head, label + ' ›');
        submitLink.type = 'button'; submitLink.dataset.role = 'submit'; submitLink.onclick = () => ctx.submit();
        submit = submitLink;
      }
      if (collide && (collideWhere === 'header' || placement !== 'footer')) {
        const decoy = u.el('button', 'adm-pq', head, collide);
        decoy.type = 'button'; decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', {label: collide, collide: true}));
      }
      const row = u.el('div', 'adm-row', work);
      const fig = u.el('div', 'adm-photo', row);
      u.el('div', 'adm-caption', fig, 'Preview (overlay applied)');
      const panel = u.el('div', 'adm-panel', row);
      u.el('div', 'adm-panel-head', panel, 'Adjustments');
      const decor = u.el('div', 'adm-decor', panel);
      fakeSlider(decor, u, 'Brightness', 50);
      fakeSlider(decor, u, 'Contrast', 50);
      const stage = u.el('main', 'adm-stage', panel); stage.dataset.role = 'stage';
      const quick = u.el('div', 'adm-quick', panel);
      u.el('div', 'adm-quick-title', quick, 'Quick action');
      const qrow = u.el('div', 'adm-quick-row', quick);
      const qb = u.el('button', 'btn btn-disabled', qrow, 'Auto Enhance'); qb.type = 'button'; qb.disabled = true;
      u.el('span', 'adm-quick-note', qrow, 'This feature is currently unavailable.');
      const foot = u.el('footer', 'adm-foot', work);
      const reset = u.el('button', 'btn btn-default', foot, 'Reset'); reset.type = 'button'; reset.dataset.action = 'reset';
      if (!ctx.finish && placement === 'footer') {
        submit = u.el('button', 'btn btn-primary', foot, label);
        submit.dataset.role = 'submit'; submit.onclick = () => ctx.submit();
      }
      if (collide && collideWhere === 'footer' && placement === 'footer') {
        const decoy = u.el('button', 'btn btn-default adm-pq-foot', foot, collide);
        decoy.type = 'button'; decoy.dataset.role = 'xtra';
        decoy.addEventListener('click', () => env.log('decoy', {label: collide, collide: true}));
      }
      return {stage, submit};
    },
    overlay: drawOverlay,
  });
})();
