(function () {
  'use strict';
  env.site({
    name: 'design-click-control-row-reveal-04',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = document.body;
      body.className = 'ref qt dock';
      const shell = u.el('main', 'shell', body),
        head = u.el('header', 'head', shell),
        title = u.el('div', 'title', head, 'People');
      const controls = u.el('span', 'window-controls', title);
      controls.innerHTML =
        '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      const tools = u.el('div', 'tools', head);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((label) => {
        const item = u.el('span', 'menu-label', tools);
        u.el('u', '', item, label[0]);
        u.el('span', '', item, label.slice(1));
      });
      const work = u.el('div', 'work', shell),
        rail = u.el('nav', 'people-rail', work);
      const navItems = [
        ['All People', '24', 'people', true],
        ['Favorites', '3', 'star', false],
        ['Teams', '8', 'teams', false],
        ['Labels', '6', 'tag', false],
        ['Archived', '12', 'archive', false],
      ];
      const paths = {
        people:
          'M4 7a3 3 0 1 0 6 0 3 3 0 0 0-6 0Zm9 1a2 2 0 1 0 0-4m-8 7c-3 0-5 2-5 5v1h14v-1c0-3-2-5-5-5Zm9 1c2 0 4 1 4 4v1h-3',
        star: 'm10 1 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L10 15.3l-5.6 2.9 1.1-6.2L1 7.6l6.2-.9Z',
        teams:
          'M4 7a3 3 0 1 0 6 0 3 3 0 0 0-6 0Zm9 1a2 2 0 1 0 0-4m-8 7c-3 0-5 2-5 5v1h14v-1c0-3-2-5-5-5Zm9 1c2 0 4 1 4 4v1h-3',
        tag: 'm2 3 8-.5 9 9-7.5 7.5-9-9Zm5 3h.1',
        archive: 'M3 3h14v4H3zm1 4v12h12V7m-8 4h4',
      };
      navItems.forEach(([label, count, icon, active]) => {
        const row = u.el('div', 'people-nav-item' + (active ? ' active' : ''), rail);
        const svg = u.el('span', 'people-nav-icon', row);
        svg.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="' + paths[icon] + '"/></svg>';
        u.el('span', 'people-nav-label', row, label);
        u.el('span', 'people-nav-count', row, count);
      });
      const center = u.el('section', 'center', work),
        note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', center),
        foot = u.el('footer', 'footer', shell),
        dock = u.el('div', 'dock-sections', foot);
      ['Task List', 'Status', 'Notes', 'Actions'].forEach((s) => {
        const d = u.el('section', 'dock-section', dock);
        u.el('strong', '', d, s);
        if (s === 'Notes') u.el('div', 'dock-note', d, 'Follow the instruction above.');
      });
      const statusbar = u.el('div', 'bottom-status', shell);
      u.el('span', '', statusbar, 'Ready');
      u.el('span', '', statusbar, 'Tue Apr 23, 2002   10:24 AM');
      const endRng = ctx.rng.fork('chrome/end'),
        endBank =
          ctx.content && Array.isArray(ctx.content.END_LABELS)
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const endText = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const label = endRng.bool(0.5) ? 'Submit' : endText(endRng.pick(endBank.filter((x) => endText(x) !== 'Submit'))),
        placement = endRng.pick(['actions', 'actions', 'header', 'status']);
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideRng.bool(0.3)) {
        const choices = [
          ...new Set(endBank.map(endText).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
        ];
        if (choices.length) collide = collideRng.pick(choices);
      }
      const decoy = (parent, text, isCollide) => {
        const b = u.el('button', 'xtra-task', parent, text);
        b.type = 'button';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      let submit = null;
      if (!ctx.finish) {
        const actions = foot.querySelector('.dock-section:last-child');
        const makeEnd = (parent, compact) => {
          const b = u.el('button', compact ? 'submit chrome-submit' : 'submit', parent, label);
          b.type = 'button';
          b.addEventListener('click', ctx.submit);
          return b;
        };
        if (placement === 'actions') submit = makeEnd(actions, false);
        else if (placement === 'header') submit = makeEnd(tools, true);
        else submit = makeEnd(statusbar, true);
        if (collide) decoy(collideRng.pick([tools, actions]), collide, true);
      }
      if (ctx.display === 'panel') {
        const panel = foot.querySelector('.dock-section:nth-child(3)');
        const placeholder = panel.querySelector('.dock-note');
        if (placeholder) placeholder.remove();
        work.appendChild(note);
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
