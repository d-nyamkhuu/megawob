(function () {
  'use strict';
  const cfg = {
    'title': 'Desk  File  Edit  Options  Help',
    'theme': 'atari',
    'layout': 'board',
    'tools': 'Mon  Mar 10  1986  10:24',
    'side':
      'Information|Fill in the form to get in touch.\nYou can also visit our help page\nfor more details.|◉General enquiry\n○Technical support\n○Feedback|☑Send me a copy of my message\n☐I agree to the terms',
    'obstacle': 'Welcome!',
    'copy': 'This short tour will show you around the interface.',
    'dismiss': 'Skip tour',
  };
  env.site({
    name: 'design-click-control-widget-02',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const desk = u.el('span', 'desk-emblem', head);
      desk.innerHTML =
        '<svg viewBox="0 0 24 30" fill="#ddd" stroke="black" stroke-width="1.5"><path d="M2 2h17l3 4v22H2z" fill="black"/><path d="M7 4h9v6h-3v8l5 6H7l3-6V9H7z"/><path d="M4 12h4M17 10h3M4 16h5M17 16h3M4 22h3M18 22h2" stroke="#ddd"/></svg>';
      const title = u.el('div', 'title', head, cfg.title);
      if (['qt', 'openlook', 'win92', 'clearlooks', 'industrial', 'electron', 'yosemite'].includes(cfg.theme)) {
        const controls = u.el('span', 'window-controls', title);
        controls.innerHTML =
          '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      }
      if (cfg.tools) {
        const tl = u.el('div', 'tools', head);
        cfg.tools.split('|').forEach((s) => u.el('div', '', tl, s));
        u.el('div', 'badge', head, 'Lesson 1/3');
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
      const display =
        (ctx.display === 'panel' || ctx.display === 'toast') && shell.getBoundingClientRect().width < 1180
          ? 'header'
          : ctx.display;
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display === 'toast') {
        note.classList.add('instruction-toast');
      }
      const stage = u.el('div', 'stage', center);
      u.el('span', 'gem-x', work);
      u.el('span', 'gem-z', work);
      const wt = u.el('span', 'gem-title', work);
      u.el('span', 'gem-caption', wt, 'Contact Form');
      [
        ['A:', 'f'],
        ['B:', 'd'],
        ['TRASH', 't'],
      ].forEach((a) => {
        const ic = u.el('div', 'icon icon-' + a[1], shell);
        const pic = u.el('i', '', ic);
        pic.innerHTML =
          a[1] === 'f'
            ? '<svg viewBox="0 0 64 70"><path fill="black" d="M2 2h58l2 4v62H2z"/><path fill="#ddd" d="M14 5h34v21H14zM11 34h42v30H11z"/><path d="M37 8h7v14h-7zM27 55h8v5h-8z"/></svg>'
            : a[1] === 'd'
              ? '<svg viewBox="0 0 64 76" fill="#ddd" stroke="black" stroke-width="3"><path d="M8 3h34l16 17v53H8z"/><path d="M42 3v18h16M18 15h15M18 23h15M18 32h29M18 39h29M18 46h29M18 53h29M18 60h24"/></svg>'
              : '<svg viewBox="0 0 64 80" fill="#ddd" stroke="black" stroke-width="3"><path d="M12 20l3 54q18 8 34 0l3-54z"/><ellipse cx="32" cy="20" rx="25" ry="8"/><path d="M13 17v-5h12V8h15v4h11v5M23 29v40M32 30v41M41 29v40"/></svg>';
        u.el('span', '', ic, a[0]);
      });
      let aside = null;
      if (cfg.side) {
        aside = u.el('aside', 'inspector', work);
        cfg.side.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', aside, s));
      }
      if (aside) {
        aside.querySelectorAll('p').forEach((p) => {
          p.innerHTML = p.textContent
            .replace('help page', '<u class="gem-link">help page</u>')
            .replace('terms', '<u class="gem-link">terms</u>')
            .replace(/◉/g, '<i class="gr on"></i>')
            .replace(/○/g, '<i class="gr"></i>')
            .replace(/☑/g, '<i class="gb on">✓</i>')
            .replace(/☐/g, '<i class="gb"></i>');
        });
      }
      if (cfg.layout === 'console' && aside && ctx.display !== 'toast') {
        aside.insertBefore(note, aside.children[1] || null);
      }
      const foot = u.el('footer', 'footer', shell);
      const emblem = u.el('span', 'status-emblem', foot);
      emblem.innerHTML = desk.innerHTML;
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
      } else {
        u.el('span', 'ready', foot, 'Ready.');
        u.el('span', 'stepinfo', foot, 'Step 1 of 1   |   Time: Paused');
      }
      let submit = null;
      const er = ctx.rng.fork('chrome/end');
      const labels = ctx.content.END_LABELS.map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name));
      const placement = er.pick(['form', 'form', 'toolbar', 'status']);
      const label = placement === 'form' ? labels.find((x) => x === 'Submit') || labels[0] : er.pick(labels);
      if (!ctx.finish) {
        const parent = placement === 'toolbar' ? work : foot;
        submit = u.el(
          placement === 'status' ? 'a' : 'button',
          'submit' + (placement === 'form' ? '' : ' submit-' + placement),
          parent,
          label,
        );
        if (placement === 'status') submit.href = '#';
        else submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const pool = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) {
          const text = cr.pick(pool);
          const decoy = u.el('button', 'end-xtra', foot, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      if (ctx.kind === 'chat') {
        const el = ctx.util.el('section', 'perturb chat design-obstacle tour-overlay', document.body);
        ctx.util.el('h2', '', el, cfg.obstacle);
        ctx.util.el('p', '', el, cfg.copy);
        const dismiss = ctx.util.el('button', 'dismiss-design', el, cfg.dismiss);
        dismiss.type = 'button';
        dismiss.addEventListener('click', ctx.dismiss);
        const next = ctx.util.el('button', 'next-design', el, 'Next');
        next.type = 'button';
        next.addEventListener('click', ctx.dismiss);
        const x = ctx.util.el('button', 'x-design', el, '×');
        x.type = 'button';
        x.setAttribute('aria-label', 'Close tour');
        x.addEventListener('click', ctx.dismiss);
        return { el, dismiss };
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
