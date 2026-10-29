(function () {
  'use strict';
  const cfg = {
    'title': 'Feedback Form',
    'theme': 'eink',
    'layout': 'board',
    'tools': '',
    'side': 'Inspector|Widget type|—|Label|—|State|—|Position|—|Size|—',
    'obstacle': 'Welcome!',
    'copy': 'This short tour will show you around the interface.',
    'dismiss': 'Skip tour',
  };
  env.site({
    name: 'design-click-control-widget-01',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, cfg.title);
      if (['qt', 'openlook', 'win92', 'clearlooks', 'industrial', 'electron', 'yosemite', 'eink'].includes(cfg.theme)) {
        const controls = u.el('span', 'window-controls', title);
        controls.innerHTML =
          '<i><svg viewBox="0 0 16 16"><path d="M3 8h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
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
      if (cfg.theme === 'eink') {
        u.el('h1', 'eink-h', center, 'We value your feedback');
        u.el('p', 'eink-sub', center, 'Please complete the form below.');
        title.insertAdjacentHTML(
          'afterbegin',
          '<svg class="eink-ico" viewBox="0 0 16 16"><path d="M12 6V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2M2 7h12V5a3 3 0 0 0-3-3M6 2v9h4M9 6v6"/></svg>',
        );
      }
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
        u.el('span', 'ready', foot, 'Training Mode');
        u.el('span', 'stepinfo', foot, 'Step 1 of 1   |   Time: Paused');
      } // Keep the reference form-footer Submit in half of episodes; new choices have isolated streams.
      const endR = ctx.rng.fork('chrome/end');
      note.classList.toggle('instruction-long', ctx.instruction.length > 36);
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const common = endR.bool(0.5);
      const placement = common ? 'footer' : endR.pick(['header', 'inspector-link']);
      const label = common ? 'Submit' : endR.pick(endLabels);
      if (ctx.display === 'panel' && aside) {
        aside.append(note);
        note.classList.add('instruction-panel');
      }
      let submit = null;
      if (!ctx.finish) {
        const parent = placement === 'header' ? head : placement === 'inspector-link' ? aside : foot;
        submit = u.el(placement === 'inspector-link' ? 'a' : 'button', 'submit end-' + placement, parent, label);
        if (submit.tagName === 'BUTTON') submit.type = 'button';
        else submit.href = '#';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const collideR = ctx.rng.fork('chrome/collide');
      if (collideR.bool(0.3)) {
        const options = endLabels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (options.length) {
          const text = collideR.pick(options);
          const decoy = u.el('button', 'chrome-xtra', head, text);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      if (ctx.kind === 'chat') {
        const old = document.querySelector('.design-obstacle');
        if (old) old.hidden = true;
        const el = ctx.util.el('section', 'perturb chat tour-overlay', document.body);
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
