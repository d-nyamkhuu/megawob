(() => {
  'use strict';
  env.site({
    name: 'design-handle-text-unicode-05',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref openlook workbench';
      const shell = u.el('main', 'shell', document.body),
        head = u.el('header', 'head', shell),
        title = u.el('div', 'title', head, 'Text Practice');
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const work = u.el('div', 'work', shell),
        center = u.el('section', 'center', work),
        note = u.el('div', 'instruction', center, ctx.instruction);
      let display = ctx.display;
      if ((display === 'panel' && shell.clientWidth < 1260) || (display === 'toast' && shell.clientHeight < 700))
        display = 'header';
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', center),
        aside = u.el('aside', 'inspector', work);
      [
        'Task Details',
        'Task     Copy the greeting text',
        'Source     Greeting box (left)',
        'Target     "Copied text" field',
        'Input     Keyboard, mouse, wheel',
        'Goal     Match the text exactly.',
        'Text Info',
        'Language     French',
        'Characters     52',
        'Accents     Yes (ç, ê, é)',
        'Actions',
        'Use the copy button or select and copy with your keyboard.',
      ].forEach((s, i) => {
        if (i === 0 || i === 6 || i === 10) {
          u.el('h2', '', aside, s);
        } else if (i !== 11) {
          const row = u.el('p', 'ins-row', aside),
            parts = s.split(/\s{2,}/);
          u.el('span', 'ins-label', row, parts.shift());
          u.el('span', 'ins-value', row, parts.join(' '));
        } else u.el('p', 'ins-help', aside, s);
      });
      if (display === 'panel') {
        aside.classList.add('has-task-note');
        aside.firstElementChild.after(note);
      }
      const foot = u.el('footer', 'footer', shell),
        tools = u.el('div', 'chrome-tools', title);
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf),
        endRng = ctx.rng.fork('chrome/end');
      const original = endRng.bool(0.5),
        placement = original ? 'form' : endRng.pick(['toolbar', 'inspector']);
      const label = original ? 'Submit' : endRng.pick(labels);
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'form' ? foot : placement === 'toolbar' ? tools : aside;
        submit = u.el(
          placement === 'inspector' ? 'a' : 'button',
          placement === 'form' ? 'submit' : 'chrome-end end-' + placement,
          parent,
          label,
        );
        if (placement === 'inspector') {
          submit.href = '#';
          aside.firstElementChild.after(submit);
        } else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.dataset.placement = placement;
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const pool = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) {
          const decoyLabel = collideRng.pick(pool),
            decoy = u.el('button', 'chrome-xtra', tools, decoyLabel);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
        }
      }
      const clear = u.el('button', 'clear-text', foot, 'Clear');
      clear.type = 'button';
      clear.addEventListener('click', () => {
        const input = stage.querySelector('.ut-input');
        if (input) {
          input.value = '';
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'perturb ' + ctx.kind, document.body);
      u.el(
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
      u.el(
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
      const dismiss = u.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
