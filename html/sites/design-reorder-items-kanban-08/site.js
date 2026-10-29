(function () {
  'use strict';
  env.site({
    name: 'design-reorder-items-kanban-08',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const placement = endRng.pick([
        'inspector',
        'toolbar',
        'inspector',
        'inspector-link',
        'inspector',
        'toolbar',
        'inspector',
        'inspector-link',
      ]);
      const referenceEnd = placement === 'inspector';
      const endLabel = referenceEnd ? 'Submit' : endRng.pick(endLabels);
      const collideRng = ctx.rng.fork('chrome/collide');
      const collideLabels = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
      const collideLabel = collideRng.bool(0.3) && collideLabels.length ? collideRng.pick(collideLabels) : null;
      document.body.className = 'design xp';
      const shell = u.el('div', 'shell', document.body);
      const tb = u.el('div', 'titlebar', shell);
      const icon = u.el('span', 'tb-icon', tb);
      icon.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#f6f5de" stroke="#596b80" d="M3 2h18v20H3z"/><path fill="#6d8594" stroke="#334c62" d="m7 5 7-2 3 11-7 2z"/><path fill="#fff" stroke="#536e73" d="m5 8 7-2 3 11-7 2z"/><path fill="#809461" d="m9 9 6-1 1 5-6 2z"/><path stroke="#405968" d="m7 16 5-1m-4 3 5-1m3-12 3 1m-2 2 2 1"/></svg>';
      u.el('span', 'tb-title', tb, 'Sort the Cards');
      const btns = u.el('div', 'tb-btns', tb);
      u.el('span', 'tb-btn', btns, '_');
      u.el('span', 'tb-btn', btns, '□');
      u.el('span', 'tb-btn close', btns, '×');
      const menu = u.el('div', 'menubar', shell);
      for (const m of ['File', 'Edit', 'View', 'Help']) u.el('span', 'menu-item', menu, m);
      const tools = u.el('div', 'menu-tools', menu);
      const body = u.el('div', 'xp-body', shell);
      const page = u.el('div', 'page', body);
      const side = u.el('aside', 'inspector', body);
      const inspectorHead = u.el('div', 'insp-head', side, 'Task Details');
      const ib = u.el('div', 'insp-body', side);
      const sideInstruction = u.el('div', 'insp-instruction', ib);
      u.el('b', '', sideInstruction, 'Instruction:');
      u.el('div', 'insp-text', sideInstruction, ctx.instruction);
      if (ctx.display === 'hidden') sideInstruction.hidden = true;
      const insBtns = u.el('div', 'insp-actions', side);
      const note = u.el('header', 'task-note', page);
      u.el('div', 'instruction', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      if (ctx.display === 'panel') note.hidden = true;
      if (ctx.display === 'toast') {
        sideInstruction.hidden = true;
        note.classList.add('instruction-toast');
        const close = u.el('button', 'note-close', note, '×');
        close.type = 'button';
        close.onclick = () => {
          note.style.visibility = 'hidden';
          sideInstruction.style.visibility = 'hidden';
        };
      }
      const stage = u.el('main', 'stage', page);
      stage.dataset.role = 'stage';
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? tools : placement === 'inspector-link' ? side : insBtns;
        submit = u.el(
          placement === 'inspector-link' ? 'a' : 'button',
          placement === 'toolbar'
            ? 'sysbtn toolbar-end'
            : placement === 'inspector-link'
              ? 'inspector-endlink'
              : 'submit',
          parent,
          endLabel,
        );
        if (placement === 'inspector-link') {
          submit.href = '#';
          inspectorHead.after(submit);
        } else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
      }
      if (collideLabel) {
        const decoy = u.el('button', 'sysbtn toolbar-xtra', tools, collideLabel);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', { label: collideLabel, collide: true });
      }
      const row = u.el('div', 'insp-row', insBtns);
      for (const name of ['Clear All', 'Reset']) {
        const b = u.el('button', 'sysbtn', row, name);
        b.type = 'button';
        b.onclick = () => {
          env.log('inspector-button', { name });
          env.log('decoy', { label: name });
        };
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'obstruction obstruction-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const titles = {
        cookie: 'Privacy notice',
        toast: 'Changes saved',
        chat: 'Help',
        promo: 'Notebook news',
        banner: 'Notice',
      };
      u.el('h3', '', box, titles[ctx.kind] || 'Notice');
      u.el(
        'p',
        '',
        box,
        ctx.kind === 'cookie'
          ? 'Allow optional cookies for this page?'
          : 'You can close this note to return to the activity.',
      );
      const dismiss = u.el('button', 'dismiss', box, ctx.kind === 'cookie' ? 'Reject optional' : 'Close');
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
    },
  });
})();
