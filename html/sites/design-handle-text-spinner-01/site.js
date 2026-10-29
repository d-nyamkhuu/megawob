(function () {
  'use strict';
  const cfg = {
    'title': 'Document Settings',
    'theme': 'material',
    'layout': 'inspector',
    'tools': '',
    'side':
      'Document Info|Title|Meeting Notes|Type|Text Document|Last Modified|Apr 24, 2014   10:15 AM|Helpful Tips|Click the up or down arrows to change the value.|You can also use your keyboard arrow keys.|Your mouse wheel can adjust the value when the control is focused.',
  };
  env.site({
    name: 'design-handle-text-spinner-01',
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
      if (cfg.tools) u.el('div', 'tools', head, cfg.tools);
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
      const appearance = u.el('section', 'appearance-heading', center);
      u.el('h2', '', appearance, 'Text Appearance');
      u.el('p', '', appearance, 'Adjust the document formatting below.');
      const note = u.el('div', 'instruction', cfg.layout === 'response' ? work : center, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden' || ctx.display === 'panel';
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
      }
      const stage = u.el('div', 'stage', center);
      let aside = null;
      if (cfg.side) {
        aside = u.el('aside', 'inspector', work);
        cfg.side.split('|').forEach((s, i) => {
          if (i === 7) {
            const divider = u.el('div', 'inspector-divider', aside);
            const tk = u.el('div', 'taskbox', aside);
            tk.hidden = ctx.display !== 'panel';
            u.el('strong', '', tk, 'Task');
            u.el('span', '', tk, ctx.instruction);
          }
          u.el(i === 0 ? 'h2' : 'p', i >= 8 ? 'tip' : i % 2 === 1 ? 'k' : '', aside, s);
        });
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
      } else u.el('span', 'ready', foot, 'Ready.');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const current = er.bool(0.5);
        const labels = (ctx.content && Array.isArray(ctx.content.END_LABELS) ? ctx.content.END_LABELS : [])
          .map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || ''))
          .filter(Boolean);
        const alternatives = labels.filter((x) => x.trim().toLowerCase() !== 'submit');
        const label = current ? 'Submit' : alternatives.length ? er.pick(alternatives) : 'Done';
        const placement = current ? 'inspector' : er.pick(['workbench', 'header']);
        const parent = placement === 'header' ? head : placement === 'workbench' ? center : aside;
        submit = u.el('button', 'submit end-control end-' + placement, parent, label);
        submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', ctx.submit);
        if (placement === 'header') shell.classList.add('has-head-end');
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = labels.filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) {
            const collision = cr.pick(pool);
            const decoy = u.el('button', 'end-xtra', head, collision);
            decoy.type = 'button';
            decoy.setAttribute('aria-label', collision);
            decoy.addEventListener('click', () => env.log('decoy', { label: collision, collide: true }));
          }
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
