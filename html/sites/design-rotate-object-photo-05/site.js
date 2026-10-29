/* The Daily Chronicle photo desk: newspaper utility page. Task state and rotations belong to the rotate task. */
(function () {
  'use strict';
  const NAV = ['Photos', 'Articles', 'Schedules', 'People', 'Library', 'Settings'];
  const NAV_ICON = {
    Photos: 'M3 4H21V20H3ZM5 17L10 11L13 15L15 13L19 17Z',
    Articles: 'M6 3H14L19 8V21H6ZM9 12H16M9 16H16',
    Schedules: 'M3 5H21V21H3ZM3 10H21M8 3V7M16 3V7',
    People: 'M9 11A4 4 0 1 0 9 3A4 4 0 0 0 9 11ZM2 21C2 15 16 15 16 21ZM17 4A3 3 0 0 1 17 10M18 14C23 15 22 20 22 21H19',
    Library: 'M2 5H10L12 7H22V20H2Z',
    Settings: 'M12 8A4 4 0 1 0 12 16A4 4 0 0 0 12 8ZM12 1V5M12 19V23M1 12H5M19 12H23M4 4L7 7M17 17L20 20M4 20L7 17M17 7L20 4',
  };
  function icon(parent, label) {
    const svg = env.util.svg('svg', { width: 24, height: 24, viewBox: '0 0 24 24', 'aria-hidden': 'true' }, parent);
    env.util.svg('path', { d: NAV_ICON[label], fill: label === 'Library' || label === 'Articles' || label === 'People' ? 'currentColor' : 'none',
      stroke: 'currentColor', 'stroke-width': 2.6, 'stroke-linejoin': 'round' }, svg);
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('section', 'tour-bubble overlay-' + ctx.kind, document.body);
    if (ctx.initial) el.classList.add('reference-initial');
    el.setAttribute('role', 'dialog');
    const content = {
      chat: ['Ask the Photo Desk', 'Editors are online to help with your photo.', 'Start chat', 'Not now'],
      cookie: ['Your privacy', 'Allow optional cookies on The Daily Chronicle?', 'Accept optional', 'Reject optional'],
      toast: ['Photo desk', 'Your changes are kept on this page.', null, 'Dismiss'],
      promo: ['Subscribe to the Chronicle', 'Get the morning edition in your inbox.', 'Sign up', 'No thanks'],
      banner: ['Notice', 'The photo desk closes at 6 PM today.', null, 'Dismiss'],
    }[ctx.kind];
    u.el('h2', '', el, content[0]);
    const close = u.el('button', 'bubble-close', el, '×');
    close.type = 'button'; close.setAttribute('aria-label', 'Close notice');
    close.onclick = () => ctx.dismiss('close');
    const message = u.el('p', '', el, content[1]);
    if (ctx.kind === 'banner') {
      const head = document.querySelector('.sheet-head');
      const note = document.querySelector('.sheet .note-header:not(.panel-fallback)');
      const sheet = document.querySelector('.sheet');
      const r = sheet.getBoundingClientRect();
      el.style.left = r.left + 'px';
      el.style.right = 'auto';
      el.style.width = r.width + 'px';
      el.style.top = Math.max(head.getBoundingClientRect().bottom, note ? note.getBoundingClientRect().bottom : 0) + 8 + 'px';
    }
    const actions = u.el('div', 'tour-actions', el);
    if (content[2]) {
      const primary = u.el('button', 'tour-primary', actions, content[2]); primary.type = 'button';
      primary.onclick = () => {
        if (ctx.kind === 'cookie') ctx.dismiss('accept');
        else { message.textContent = 'Thanks. Drag the round handle above the photo to rotate it.'; primary.hidden = true; }
      };
    }
    const dismiss = u.el('button', 'tour-dismiss', actions, content[3]); dismiss.type = 'button';
    dismiss.onclick = () => ctx.dismiss('skip');
    return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  env.site({
    name: 'design-rotate-object-photo-05', template: 'site/base',
    design: { parts: { frame: () => frame, overlay: () => drawOverlay } },
  });
  function frame(ctx) {
      const u = ctx.util;
      document.body.className = `chronicle instruction-${ctx.display}`;
      const rail = u.el('nav', 'rail', document.body);
      const brand = u.el('div', 'brand', rail);
      u.el('span', '', brand, 'The Daily'); u.el('span', '', brand, 'Chronicle');
      const list = u.el('ul', 'rail-list', rail);
      NAV.forEach((label, i) => {
        const li = u.el('li', 'rail-item' + (i === 0 ? ' on' : ''), list);
        icon(li, label); u.el('span', '', li, label);
      });
      if (ctx.display === 'panel') {
        const side = u.el('aside', 'rail-note', document.body);
        u.el('h3', '', side, 'Assignment');
        u.el('p', 'instruction', side, ctx.instruction);
      }
      const sheet = u.el('section', 'sheet', document.body);
      const head = u.el('header', 'sheet-head', sheet);
      u.el('h1', '', head, 'Rotate Photo');
      u.el('div', 'dateline', head, 'The Daily Chronicle  |  Photo Desk');
      if (ctx.display === 'header') u.el('p', 'instruction note-header', head, ctx.instruction);
      if (ctx.display === 'panel') u.el('p', 'instruction note-header panel-fallback', sheet, ctx.instruction);
      const stage = u.el('main', 'stage-box', sheet);
      stage.dataset.role = 'stage';
      const stats = u.el('div', 'stats', sheet);
      [['Total Photos', '24'], ['Rotated', '7'], ['Remaining', '17']].forEach(([k, v]) => {
        const d = u.el('div', 'stat', stats); u.el('span', '', d, k); u.el('b', '', d, v);
      });
      if (ctx.display === 'toast') u.el('aside', 'instruction note-toast', document.body, ctx.instruction);
      const footer = u.el('footer', 'foot', document.body);
      if (ctx.finish) footer.classList.add('foot-empty');
      let submit = null;
      if (!ctx.finish) {
        const endRng = ctx.rng.fork('chrome/end');
        const placements = ['page-footer', 'page-footer', 'page-toolbar', 'page-link'];
        const placement = endRng.pick(placements);
        const fallbackLabels = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
        const labels = ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS : fallbackLabels;
        const labelValue = endRng.pick(labels);
        const endLabel = typeof labelValue === 'string' ? labelValue : (labelValue.label || labelValue.text || labelValue.name || String(labelValue));
        const host = placement === 'page-toolbar' ? head : footer;
        submit = u.el(placement === 'page-link' ? 'a' : 'button', 'submit-button ' + placement, host, placement === 'page-link' ? endLabel : endLabel);
        if (placement === 'page-link') submit.href = '#'; else submit.type = 'button';
        submit.dataset.role = 'submit'; submit.setAttribute('aria-label', endLabel); submit.title = endLabel;
        submit.onclick = (event) => { event.preventDefault(); ctx.submit(); };

        const collideRng = ctx.rng.fork('chrome/collide');
        if (collideRng.bool(0.3)) {
          const candidates = labels.map((x) => typeof x === 'string' ? x : (x.label || x.text || x.name || String(x)))
            .filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
          if (candidates.length) {
            const decoyLabel = collideRng.pick(candidates);
            const decoy = u.el('button', 'end-xtra', host, decoyLabel);
            decoy.type = 'button'; decoy.dataset.role = 'xtra';
            decoy.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
          }
        }
      }
      return { stage, submit };
  }
})();
