(function () {
  'use strict';
  env.site({
    name: 'design-click-control-hover-04',
    styles: ['dark.css'],
    frame(ctx) {
      const u = ctx.util;
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const original = er.bool(0.5);
      const endLabel = original ? 'Submit' : er.pick(endLabels);
      const placement = original ? 'side' : er.pick(['header', 'link']);
      document.body.className = 'ref dark-dev';
      const shell = u.el('main', 'shell', document.body);
      const top = u.el('section', 'top', shell);
      const tl = u.el('div', 'top-left', top);
      const bar = u.el('div', 'top-bar', tl);
      u.el('span', 'dot', bar);
      u.el('span', 'tab', bar, 'HOVER TASK');
      u.el('span', 'subtitle', bar, 'Precision Interaction Test');
      const note = u.el('div', 'instruction', tl, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const help = u.el('div', 'help', tl);
      u.el('p', '', help, 'The blue square will move to different positions within the marked area.');
      u.el(
        'p',
        '',
        help,
        'Your progress only counts while the mouse is over the square. It does not need to be 3 seconds in a row.',
      );
      const ov = u.el('aside', 'overview', top);
      u.el('div', 'task-count', top, 'Task 1 / 1');
      u.el('h2', '', ov, 'Task Overview');
      [
        ['Goal', 'Hover for 3 seconds (total)'],
        ['Target', 'Blue square (it moves)'],
        ['Input', 'Mouse pointer'],
        ['Attempts', 'Unlimited'],
      ].forEach((r) => {
        const row = u.el('div', 'kv', ov);
        u.el('span', 'k', row, r[0]);
        u.el('span', 'v', row, r[1]);
      });
      if (ctx.display === 'panel' && shell.getBoundingClientRect().width >= 1150) {
        ov.classList.add('instruction-panel');
        ov.querySelectorAll('.kv').forEach((row) => (row.hidden = true));
        ov.append(note);
      }
      const work = u.el('section', 'work', shell);
      const area = u.el('div', 'area', work);
      const ah = u.el('div', 'area-head', area);
      u.el('h2', '', ah, 'Task Area');
      u.el('span', 'track', ah, 'Move tracking within the dashed region');
      const stage = u.el('div', 'stage', area);
      const side = u.el('aside', 'side', work);
      const progress = u.el('div', 'card progress', side);
      u.el('h3', '', progress, 'Your Progress');
      u.el('div', 'progress-value', progress);
      const progressBar = u.el('div', 'progress-bar', progress);
      u.el('i', '', progressBar);
      const st = u.el('div', 'card status', side);
      u.el('h3', '', st, 'Status');
      const sr = u.el('div', 'status-row', st);
      u.el('span', 'led', sr);
      u.el('span', 'status-text', sr, 'Not hovering');
      const nt = u.el('div', 'card notes', side);
      u.el('h3', '', nt, 'Notes');
      const ul = u.el('ul', '', nt);
      [
        'The blue square moves to new positions within the dashed area.',
        'Keep the mouse over the square for a total of 3 seconds (it does not need to be continuous).',
        'The timer only counts while hovering.',
        'Clicking is not required.',
      ].forEach((t) => u.el('li', '', ul, t));
      let submit = null;
      const tools = u.el('div', 'chrome-tools', bar);
      if (!ctx.finish) {
        const parent = placement === 'header' ? tools : side;
        submit = u.el(placement === 'link' ? 'a' : 'button', 'submit end-' + placement, parent, endLabel);
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const choices = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (choices.length) {
          const label = cr.pick(choices);
          const decoy = u.el('button', 'chrome-xtra', tools, label);
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
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
