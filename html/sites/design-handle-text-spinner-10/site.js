(function () {
  'use strict';
  const cfg = { title: 'CalibPro 1.4.2  -  Display Calibration Utility' };
  const fallback = ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
  const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
  env.site({
    name: 'design-handle-text-spinner-10',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref linux-calib';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head);
      const icon = u.el('span', 'app-icon', title);
      icon.innerHTML =
        '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20"/><path d="M5 5h5v14H5zM13 5h6v6h-6zM13 13h6v6h-6z"/></svg>';
      u.el('span', 'app-name', title, cfg.title);
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const menu = u.el('nav', 'tools', shell);
      ['File', 'Tools', 'View', 'Help'].forEach((x) => u.el('span', 'menu-item', menu, x));
      const work = u.el('div', 'work', shell);
      const briefing = u.el('aside', 'briefing', work);
      u.el('h1', '', briefing, 'Task Briefing');
      const note = u.el('div', 'instruction', briefing, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      u.el('p', 'brief-copy', briefing, 'This utility controls display text settings for the calibration profile.');
      u.el(
        'p',
        'brief-copy',
        briefing,
        'Adjust the value on the right using the up and down arrows until it shows 19 pt.',
      );
      const center = u.el('section', 'center', work);
      const tabs = u.el('nav', 'tabs', center);
      ['Display', 'Color', 'Text', 'Gamma', 'Advanced'].forEach((x, i) =>
        u.el('span', i === 0 ? 'tab active' : 'tab', tabs, x),
      );
      const stage = u.el('div', 'stage', center);
      const actions = u.el('div', 'actions', center);
      u.el('button', 'reset', actions, 'Reset');
      let submit = null;
      let label = 'Submit';
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const labels = ctx.content && ctx.content.END_LABELS;
        const pool = Array.isArray(labels) && labels.length ? labels : fallback;
        const submits = pool.filter((x) => labelOf(x).trim().toLowerCase() === 'submit');
        label = er.bool(0.5)
          ? labelOf(submits.length ? er.pick(submits) : pool[0])
          : labelOf(
              er.pick(
                pool.filter((x) => labelOf(x).trim().toLowerCase() !== 'submit').length
                  ? pool.filter((x) => labelOf(x).trim().toLowerCase() !== 'submit')
                  : pool,
              ),
            );
        const where = er.pick(['action', 'action', 'menu', 'footer']);
        const mk = (parent, cls, text, kind) => {
          const b = u.el('button', cls, parent, text);
          b.type = 'button';
          b.title = label;
          b.setAttribute('aria-label', label);
          b.addEventListener('click', ctx.submit);
          return b;
        };
        if (where === 'action') submit = mk(actions, 'submit', label);
        else if (where === 'menu') submit = mk(menu, 'calib-end calib-menu-end', label);
        const foot = u.el('footer', 'footer', shell);
        u.el('span', 'ready', foot, 'Ready');
        u.el('span', 'status-detail', foot, 'Profile: Workstation　 |　 Display: 1024×576　 |　 v1.4.2');
        if (where === 'footer') submit = mk(foot, 'calib-end calib-footer-end', label);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const ends = pool.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (ends.length) {
            const d = u.el(
              'button',
              'calib-xtra ' + (where === 'menu' ? 'calib-menu-xtra' : 'calib-footer-xtra'),
              where === 'menu' ? menu : foot,
              labelOf(cr.pick(ends)),
            );
            d.type = 'button';
            const text = d.textContent;
            d.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
      } else {
        const foot = u.el('footer', 'footer', shell);
        u.el('span', 'ready', foot, 'Ready');
        u.el('span', 'status-detail', foot, 'Profile: Workstation　 |　 Display: 1024×576　 |　 v1.4.2');
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
