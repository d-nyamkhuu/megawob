(function () {
  'use strict';
  const cfg = {
    'title': 'Text Entry Task',
    'theme': 'plainform',
    'layout': 'plain',
    'rail': 'Home|Messages|Tasks|Notes|Settings|Help',
    'notes': 'Type the text exactly as shown, including accented characters.',
  };
  env.site({
    name: 'design-handle-text-unicode-06',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, cfg.title);
      if (['qt', 'openlook', 'win92', 'clearlooks', 'industrial', 'electron', 'yosemite'].includes(cfg.theme)) {
        const controls = u.el('span', 'window-controls', title);
        controls.innerHTML =
          '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      }
      if (cfg.tools) {
        const tl = u.el('div', 'tools', head);
        cfg.tools.split(/\s{2,}/).forEach((t) => u.el('span', 'menu-item', tl, t + ' ▼'));
      }
      if (cfg.overview) {
        const ov = u.el('section', 'overview', shell);
        cfg.overview.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', ov, s));
      }
      const work = u.el('div', 'work', shell);
      if (cfg.rail) {
        const rail = u.el('nav', 'rail', work);
        cfg.rail.split('|').forEach((s, i) => u.el('div', i === 0 ? 'active' : '', rail, s));
      }
      const center = u.el('section', 'center', work);
      let display = ctx.display || 'header';
      const sz = ctx.size || shell.getBoundingClientRect();
      if ((display === 'panel' && (sz.width || 0) < 1120) || (display === 'toast' && (sz.height || 0) < 700))
        display = 'header';
      const note = u.el('div', 'instruction', cfg.layout === 'response' ? work : center, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display === 'toast') {
        note.classList.add('instruction-toast');
      }
      if (display === 'panel') note.classList.add('instruction-panel');
      const stage = u.el('div', 'stage', center);
      let notes = null;
      if (cfg.notes) {
        notes = u.el('section', 'notes-section', center);
        u.el('h2', '', notes, 'Notes:');
        const list = u.el('ul', '', notes);
        cfg.notes.split('|').forEach((s) => {
          const li = u.el('li', '', list, s);
          if (s.startsWith('Then click')) li.className = 'completion-note';
        });
      }
      let aside = null;
      if (cfg.side) {
        aside = u.el('aside', 'inspector', work);
        cfg.side.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', aside, s));
      }
      if (cfg.layout === 'console' && aside && display !== 'toast') {
        aside.insertBefore(note, aside.children[1] || null);
      }
      const foot = u.el('footer', 'footer', shell);
      const brand = u.el('div', 'sun-brand', foot);
      brand.innerHTML =
        '<svg viewBox="0 0 40 40" aria-hidden="true"><g transform="rotate(45 20 20)" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 5h13v13H9V9h5v5M22 5h13v13H26V9h5v5M5 22h13v13H9V26h5v5M22 22h13v13H26V26h5v5"/><path d="M5 18V5M22 18V5M5 35V22M22 35V22"/></g></svg><span>Sun</span>';
      if (cfg.foot) {
        const dock = u.el('div', 'dock-sections', foot);
        cfg.foot.split('|').forEach((s) => {
          const d = u.el('section', 'dock-section', dock);
          u.el('strong', '', d, s);
          if (cfg.theme === 'qt') {
            if (s === 'Task List') {
              ['1.  Click requested control', '2.  Review result', '3.  Submit', '4.  Finish'].forEach((t, i) =>
                u.el('div', i === 0 ? 'current-task' : 'task-row', d, t),
              );
            } else if (s === 'Status') {
              ['Current Step:     1 of 4', 'Status:    Not completed', 'Attempts:    0', 'Result:    —'].forEach((t) =>
                u.el('div', 'status-row', d, t),
              );
            } else if (s === 'Notes') {
              u.el('div', 'dock-note', d, 'Follow the instruction above.');
            }
          }
        });
      } else u.el('span', 'ready', foot, 'Ready.');
      const endR = ctx.rng.fork('chrome/end');
      const existingLabel = 'Submit';
      const endPool =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete'];
      const endText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const placement = endR.bool(0.5) ? 'form' : endR.pick(['header', 'link']);
      const label = placement === 'form' ? existingLabel : endText(endR.pick(endPool));
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'header' ? head : placement === 'link' ? notes || center : notes || center;
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          'plain-end ' +
            (placement === 'header' ? 'end-header' : placement === 'link' ? 'end-link' : 'submit end-form'),
          parent,
          label,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const collideR = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collideR.bool(0.3)) {
        const choices = endPool.map(endText).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (choices.length) {
          const inHeader = collideR.bool(0.5);
          const decoy = u.el(
            'button',
            'plain-xtra ' + (inHeader ? 'xtra-header' : 'xtra-notes'),
            inHeader ? head : notes || center,
            endText(collideR.pick(choices)),
          );
          decoy.title = decoy.textContent;
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
        }
      }
      if (ctx.finish) {
        const completion = notes && notes.querySelector('.completion-note');
        if (completion) completion.remove();
      } else {
        const completion = notes && notes.querySelector('.completion-note');
        if (completion && label !== 'Submit') completion.textContent = 'Then use ' + label + ' to finish.';
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
