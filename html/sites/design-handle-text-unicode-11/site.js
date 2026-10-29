(function () {
  'use strict';
  const cfg = { title: 'Text Copy Task', theme: 'openlook' };
  env.site({
    name: 'design-handle-text-unicode-11',
    styles: ['site.css'],
    initialOverlay: { kind: 'toast' },
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' nextstep';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const brand = u.el('div', 'system-brand', head, 'NeXT');
      const tl = u.el('nav', 'tools', head);
      ['File', 'Edit', 'View', 'Go', 'Tools', 'Window', 'Help'].forEach((t) => u.el('span', 'menu-item', tl, t));
      u.el('div', 'clock', head, 'Mon Apr 21  10:24 AM');
      u.el('div', 'sound', head, '◖))');
      u.el('div', 'menu-extra', head, '▤');
      const work = u.el('div', 'work', shell);
      const center = u.el('section', 'center', work);
      const title = u.el('div', 'title', center, cfg.title);
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3z"/></svg></i>';
      const display =
        ctx.display === 'panel' && (shell.clientWidth < 1400 || shell.clientHeight < 820) ? 'header' : ctx.display;
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', center);
      const inspectorSpace = u.el('div', 'inspector-space', work);
      if (display === 'panel') {
        inspectorSpace.append(note);
        inspectorSpace.classList.add('has-task-panel');
      }
      const foot = u.el('footer', 'footer', shell);
      const dock = u.el('nav', 'dock', foot);
      [
        ['▤', 'Workspace'],
        ['▱', 'Files'],
        ['▤', 'Edit'],
        ['⌕', 'Find'],
        ['▤', 'Text'],
        ['▦', 'Terminal'],
        ['▣', 'Print'],
        ['▥', 'Trash'],
      ].forEach(([icon, label]) => {
        const d = u.el('div', 'dock-item', dock);
        u.el('span', 'dock-icon', d, icon);
        u.el('span', 'dock-label', d, label);
      }); // Separate streams leave every existing frame and widget draw unchanged.
      const er = ctx.rng.fork('chrome/end');
      const placement = er.pick(['form', 'form', 'toolbar', 'dock']);
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const endLabel = placement === 'form' ? 'Submit' : er.pick(labels);
      let submit = null;
      if (!ctx.finish) {
        const parent =
          placement === 'form' ? u.el('div', 'end-actions', center) : placement === 'toolbar' ? title : foot;
        // A frame-only class keeps this control outside the widget's clipped action group.
        submit = u.el('button', 'end-control end-' + placement, parent, endLabel);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', ctx.submit);
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = labels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = cr.pick(options);
          const decoy = u.el('button', 'end-xtra', foot, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
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
      const u = ctx.util;
      if (ctx.initial) {
        const slot = document.querySelector('.inspector-space');
        const el = u.el('aside', 'inspector notification-overlay', slot || document.body);
        const ah = u.el('div', 'inspector-title', el);
        u.el('span', 'inspector-box', ah, '');
        u.el('strong', '', ah, 'Notifications (4)');
        const close = u.el('button', 'inspector-close', ah, '×');
        close.type = 'button';
        close.setAttribute('aria-label', 'Close notifications');
        close.addEventListener('click', ctx.dismiss);
        const cards = u.el('div', 'notification-list', el);
        const entries = [
          ['▤', 'Software Update Available', 'A new version is ready to install.'],
          ['✉', '3 New Messages', 'From: Team, Alex, Pat'],
          ['▦', 'Meeting Reminder', 'Design review at 11:00 AM'],
          ['▤', 'Backup Complete', 'Your files are up to date.'],
        ];
        entries.forEach(([icon, title, sub]) => {
          const c = u.el('div', 'notification-card', cards);
          u.el('span', 'notif-icon', c, icon);
          const text = u.el('span', 'notif-copy', c);
          u.el('strong', '', text, title);
          u.el('span', '', text, sub);
          const x = u.el('button', 'notif-x', c, '×');
          x.type = 'button';
          x.setAttribute('aria-label', 'Dismiss ' + title);
          x.addEventListener('click', ctx.dismiss);
        });
        const dismiss = u.el('button', 'dismiss-all', el, 'Dismiss all');
        dismiss.type = 'button';
        dismiss.addEventListener('click', ctx.dismiss);
        return { el, dismiss };
      }
      const el = u.el('section', 'perturb ' + ctx.kind, document.body);
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
