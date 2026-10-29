(function () {
  'use strict';
  const C = {
    'title': 'Panel resize task',
    'accent': '#6b1a3a',
    'bg': '#f6efe2',
    'surface': '#fbf6ec',
    'font': "Georgia, 'Times New Roman', serif",
  };
  env.site({
    name: 'design-resize-element-ghost-07',
    styles: ['site.css', 'riso.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'design riso' + (ctx.display === 'toast' ? ' has-instruction-toast' : '');
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = (
        ctx.content.END_LABELS || ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map(labelOf);
      const referenceEnd = endRng.bool(0.5);
      const placement = referenceEnd ? 'footer' : endRng.pick(['header', 'link']);
      const endLabel = referenceEnd ? 'Submit' : endRng.pick(endLabels);
      const root = document.documentElement;
      for (const [k, v] of Object.entries({
        bg: C.bg,
        panel: C.surface,
        fg: '#1d3a40',
        muted: '#6a6a64',
        line: '#6b1a3a',
        accent: C.accent,
      }))
        root.style.setProperty('--' + k, v);
      root.style.setProperty('--font', C.font);
      const shell = u.el('div', 'shell', body);
      const note = u.el('section', 'task-note', shell);
      u.el('div', 'note-label', note, 'Panel resize task');
      u.el('div', 'note-rule', note);
      const instruction = u.el('div', 'instruction', note, ctx.instruction);
      const info = u.el('div', 'info-card', note);
      u.el('div', 'info-k', info, 'Current size (W × H)');
      const cur = u.el('div', 'info-v', info, '');
      cur.dataset.role = 'cur-size';
      u.el('div', 'info-k', info, 'Target size (W × H)');
      const tgt = u.el('div', 'info-v', info, '');
      tgt.dataset.role = 'tgt-size';
      u.el('p', 'info-help', info, 'The top-left corner stays fixed. Drag only the bottom-right corner handle.');
      if (ctx.display === 'hidden') instruction.hidden = true;
      else if (ctx.display === 'toast') {
        instruction.classList.add('instruction-toast');
        const x = u.el('button', 'note-close', instruction, '×');
        x.onclick = () => (instruction.style.visibility = 'hidden');
      } else if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const ws = u.el('section', 'workspace', shell);
      const wh = u.el('div', 'ws-head', ws);
      u.el('span', 'ws-title', wh, 'Workspace');
      u.el('span', 'ws-hint', wh, 'Same top-left corner  •  Resize to match dashed outline');
      const stage = u.el('main', 'stage', ws);
      stage.dataset.role = 'stage';
      const footer = u.el('footer', 'footer', shell);
      const fl = u.el('div', 'foot-label', footer);
      u.el('div', 'note-label', fl, 'Actions');
      u.el('div', 'note-rule', fl);
      const reset = u.el('button', 'clear', footer, 'Reset');
      reset.type = 'button';
      reset.onclick = () => {
        env.widgetDef.clear?.();
      };
      const show = u.el('button', 'clear', footer, 'Show target size');
      show.type = 'button';
      show.setAttribute('aria-pressed', 'false');
      show.onclick = () => {
        const expanded = show.getAttribute('aria-pressed') !== 'true';
        show.setAttribute('aria-pressed', String(expanded));
        let badge = stage.querySelector('.target-size-badge');
        if (!badge) badge = u.el('div', 'target-size-badge', stage);
        badge.textContent = 'Target: ' + tgt.textContent;
        badge.hidden = !expanded;
        env.log('show-target');
      };
      let submit = null;
      if (!ctx.finish) {
        shell.classList.add('end-' + placement);
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'submit' + (placement === 'header' ? ' submit-header' : placement === 'link' ? ' submit-link' : ''),
          placement === 'header' ? wh : footer,
          endLabel,
        );
        if (placement === 'link') {
          submit.href = '#';
          footer.insertBefore(submit, reset);
        } else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
      }
      if (collideRng.bool(0.3)) {
        const options = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = collideRng.pick(options);
          const decoy = u.el('button', 'clear end-xtra', footer, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          footer.insertBefore(decoy, reset);
          decoy.onclick = () => env.log('decoy', { label, collide: true });
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        kind = ctx.kind;
      const el = u.el('section', 'obstruction obstruction-' + kind, document.body);
      el.dataset.role = 'overlay';
      const box = u.el('div', 'obstruction-box', el);
      const title = {
        cookie: 'Your privacy',
        toast: 'Changes saved',
        chat: 'Support',
        promo: 'Workspace update',
        banner: 'Service notice',
      }[kind];
      const text = {
        cookie: 'This application stores optional cookies.',
        toast: 'Your changes have been saved.',
        chat: 'Need a hand with this workspace?',
        promo: 'Explore the latest workspace features.',
        banner: 'You are viewing a shared workspace.',
      }[kind];
      const label = kind === 'cookie' ? 'Reject optional' : 'Close';
      u.el('h3', '', box, title);
      u.el('p', '', box, text);
      const dismiss = u.el('button', 'dismiss', box, label);
      dismiss.type = 'button';
      dismiss.onclick = () => ctx.dismiss('close');
      if (kind === 'cookie') {
        const accept = u.el('button', 'dismiss', box, 'Accept optional');
        accept.onclick = () => ctx.dismiss('accept');
      }
      return { el, dismiss, ttlSteps: kind === 'toast' ? 5 : 0 };
    },
  });
})();
