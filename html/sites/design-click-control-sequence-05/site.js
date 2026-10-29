(function () {
  'use strict';
  const ICONS = {
    Select: '<path d="M8 3v26l7-7 5 11 5-2-5-11h9Z"/>',
    Pan: '<path d="M10 17V7a2 2 0 0 1 4 0v8V5a2 2 0 0 1 4 0v10V6a2 2 0 0 1 4 0v10V10a2 2 0 0 1 4 0v12c0 6-4 9-9 9s-7-3-10-8l-3-5a2 2 0 0 1 4-2l2 3Z"/>',
    Zoom: '<defs><linearGradient id="lens" x2="1" y2="1"><stop stop-color="#f2fbff"/><stop offset=".5" stop-color="#91bddc"/><stop offset="1" stop-color="#d7ebf7"/></linearGradient></defs><path d="m21 20 10 10-3 3-10-10Z"/><circle cx="14" cy="14" r="10" fill="url(#lens)"/><circle cx="14" cy="14" r="7.5" fill="none" stroke="#effaff" stroke-width="1.5"/><path d="m9 12 6-5" stroke="#fff" stroke-width="2.5"/>',
    Undo: '<path d="M15 3 3 14l12 10v-7h5c6 0 8 4 8 11h3c2-13-3-18-11-18h-5Z"/>',
    Redo: '<path d="m19 3 12 11-12 10v-7h-5c-6 0-8 4-8 11H3C1 15 6 10 14 10h5Z"/>',
    Clear: '<path d="M5 8h24v4H5Z M13 8V4h9v4 M8 12l1 20h16l1-20 M13 15v13 M17 15v13 M21 15v13"/>',
  };
  const TOOLS = ['Select|Pan|Zoom', 'Undo|Redo', 'Clear'];
  env.site({
    name: 'design-click-control-sequence-05',
    styles: ['site.css', 'flash.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref fx';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const tab = u.el('div', 'head-tab', head);
      u.el('div', 'head-title', tab, 'Task Center');
      u.el('div', 'head-sub', tab, 'Follow the instructions to complete the task.');
      const badge = u.el('div', 'head-badge', head);
      u.el('div', '', badge, 'Project  Alpha');
      u.el('div', 'badge-user', badge, 'User: Guest');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const display = ctx.display || 'header';
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display === 'toast') note.classList.add('instruction-toast');
      if (display === 'panel') note.classList.add('instruction-panel');
      const stage = u.el('div', 'stage', center);
      const foot = u.el('footer', 'footer', shell);
      u.el('div', 'tools-label', foot, 'Tools');
      TOOLS.forEach((grp, gi) => {
        const g = u.el('div', 'tool-group group-' + gi, foot);
        grp.split('|').forEach((n) => {
          const b = u.el(
            'div',
            'tool' + (n === 'Select' ? ' sel' : '') + (n === 'Undo' || n === 'Redo' ? ' dim' : ''),
            g,
          );
          b.innerHTML = '<svg viewBox="0 0 34 34">' + ICONS[n] + '</svg><span>' + n + '</span>';
        });
        if (gi < 2) u.el('div', 'tool-sep', foot);
      });
      let submit = null;
      const endR = ctx.rng.fork('chrome/end');
      const placement = ctx.finish ? 'none' : endR.pick(['dock', 'dock', 'head', 'dock-link']);
      shell.dataset.end = placement;
      const labels = (ctx.content && ctx.content.END_LABELS) || [
        'Submit',
        'Done',
        'Finish',
        'Continue',
        'Save',
        'OK',
        'Confirm',
        'Apply',
        'Complete',
        "I'm done",
      ];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endLabel = placement === 'dock' ? 'Submit' : labelOf(endR.pick(labels));
      const makeEnd = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.addEventListener('click', ctx.submit);
        return b;
      };
      if (placement === 'dock') submit = makeEnd(foot, 'submit', endLabel);
      else if (placement === 'head') submit = makeEnd(head, 'submit-top', endLabel);
      else if (placement === 'dock-link') submit = makeEnd(foot, 'submit-link', endLabel + ' ›');
      else if (ctx.finish) u.el('div', 'dock-status', foot, 'Workspace ready');
      const collideR = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collideR.bool(0.3)) {
        const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (pool.length) {
          const b = u.el('button', 'flash-pq', foot, labelOf(collideR.pick(pool)));
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label: b.textContent, collide: true }));
        }
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
