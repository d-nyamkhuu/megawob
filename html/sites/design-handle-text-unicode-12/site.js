(function () {
  'use strict';
  const cfg = {
    'title': 'Rivermere Public Library',
    'theme': 'library',
    'layout': 'board',
    'tools': 'Search    Help    Contact',
    'rail': 'Quick Tools|New Search|Browse Subjects|My Account|Help|A library is a hospital for the mind.',
    'side':
      'Today|Tue, Apr 23, 1996|10:24 AM|“Better information builds a kinder world.”|Need Help?|Ask a librarian at the front desk or click Help.',
  };
  env.site({
    name: 'design-handle-text-unicode-12',
    styles: ['site.css'],
    initialOverlay: { kind: 'promo' },
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
      const note = u.el('div', 'instruction', cfg.layout === 'response' ? work : center, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
      }
      const stage = u.el('div', 'stage', center);
      let aside = null;
      if (cfg.side) {
        aside = u.el('aside', 'inspector', work);
        cfg.side.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', aside, s));
      }
      if (cfg.layout === 'console' && aside && ctx.display !== 'toast') {
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
      const endRng = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = (ctx.content.END_LABELS || ['Submit', 'Done', 'Finish']).map(labelOf);
      const original = endRng.bool(0.5);
      const placement = original ? 'form' : endRng.pick(['header', 'footer']);
      const label = original ? 'Submit' : endRng.pick(endLabels.filter((x) => x !== 'Submit'));
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'header' ? center : foot;
        submit = u.el('button', placement === 'form' ? 'submit' : 'end-control end-' + placement, parent, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', ctx.submit);
      }
      const collideRng = ctx.rng.fork('chrome/collide');
      if (collideRng.bool(0.3)) {
        const options = [...new Set(endLabels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const text = collideRng.pick(options);
          const decoy = u.el('button', 'end-xtra', foot, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      let display = ctx.display;
      if ((display === 'panel' && shell.clientWidth < 1260) || (display === 'toast' && shell.clientHeight < 760))
        display = 'header';
      note.dataset.display = display;
      note.classList.toggle('instruction-toast', display === 'toast');
      center.dataset.instruction = display;
      if (display === 'panel') {
        aside.classList.add('task-panel');
        aside.append(note);
      } else if (display === 'toast') {
        shell.insertBefore(note, foot);
      } else if (display === 'hidden') {
        note.remove();
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
      if (ctx.initial) {
        const restore = ctx.util.el('section', 'restore-modal', document.body);
        const restoreHead = ctx.util.el('strong', 'restore-title', restore, 'Layout could not be restored');
        ctx.util.el(
          'p',
          '',
          restore,
          'Your previous session’s layout could not be restored.\nSome panels may be misplaced or hidden.',
        );
        ctx.util.el('p', 'restore-question', restore, 'Would you like to use the default layout?');
        const restoreActions = ctx.util.el('div', 'restore-actions', restore);
        const restoreBtn = ctx.util.el('button', 'restore-default', restoreActions, 'Use default layout');
        ctx.util.el('button', 'restore-current', restoreActions, 'Keep current layout');
        restoreBtn.type = 'button';
        restoreBtn.addEventListener('click', () => ctx.dismiss());
        restoreActions.lastChild.type = 'button';
        restoreActions.lastChild.addEventListener('click', () => ctx.dismiss());
        const end = document.querySelector('.submit,.end-control');
        if (end) {
          const er = end.getBoundingClientRect(),
            rr = restore.getBoundingClientRect();
          const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
          if (overlaps(er, rr)) {
            const note = document.querySelector('.instruction:not([hidden])');
            const nr = note && note.getBoundingClientRect();
            const shell = document.querySelector('.shell');
            const W = shell.clientWidth,
              H = shell.clientHeight;
            const choices = [
              { left: rr.left, top: er.top - rr.height - 12 },
              { left: rr.left, top: er.bottom + 12 },
              { left: er.right + 12, top: rr.top },
              { left: er.left - rr.width - 12, top: rr.top },
            ]
              .map((p) => ({ ...p, right: p.left + rr.width, bottom: p.top + rr.height }))
              .filter((p) => p.left >= 8 && p.top >= 8 && p.right <= W - 8 && p.bottom <= H - 8 && !overlaps(p, er));
            const position = choices.find((p) => !nr || !overlaps(p, nr)) || choices[0];
            if (position) {
              restore.style.left = position.left + 'px';
              restore.style.top = position.top + 'px';
              restore.style.transform = 'none';
            }
          }
        }
        return { el: restore, dismiss: restoreBtn };
      }
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
