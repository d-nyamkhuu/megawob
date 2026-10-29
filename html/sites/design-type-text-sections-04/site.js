(function () {
  'use strict';
  const C = { site: 'design-type-text-sections-04' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        desktop = u.el('div', 'gem-desktop', document.body);
      const menu = u.el('header', 'gem-menu', desktop);
      u.el('b', 'gem-mark', menu, '♟');
      ['Desk', 'File', 'Edit', 'Record', 'View', 'Options', 'Help'].forEach((x) => u.el('span', '', menu, x));
      u.el('time', '', menu, 'Mon 12 May 1986　14:27');
      const icons = u.el('aside', 'gem-icons', desktop);
      [
        ['▤', 'DISK A'],
        ['▤', 'DISK B'],
        ['♜', 'TRASH'],
      ].forEach(([a, b]) => {
        const i = u.el('div', 'gem-icon', icons);
        u.el('b', '', i, a);
        u.el('span', '', i, b);
      });
      const win = u.el('section', 'gem-window', desktop);
      const title = u.el('div', 'gem-title', win);
      u.el('b', '', title, '−');
      u.el('strong', '', title, 'Personal Records');
      u.el('span', '', title, '⊡　+');
      const nav = u.el('nav', 'gem-nav', win);
      [
        ['▤', 'People'],
        ['▣', 'Departments'],
        ['♟', 'Groups'],
        ['▤', 'Reports'],
        ['⚒', 'Settings'],
      ].forEach(([a, b], i) => {
        const n = u.el('div', 'gem-nav-item' + (!i ? ' active' : ''), nav);
        u.el('b', '', n, a);
        u.el('span', '', n, b);
      });
      const stage = u.el('main', 'ds-stage gem-stage', win);
      const list = u.el('section', 'gem-list', stage);
      u.el('h3', '', list, 'People (23)');
      const head = u.el('div', 'gem-list-head', list);
      u.el('span', '', head, 'Name　　▲');
      u.el('span', '', head, 'Department');
      const rows = u.el('div', 'gem-rows', list);
      [
        ['Bondarenko, Iryna', 'Sales'],
        ['Kowalski, Piotr', 'Engineering'],
        ['Melnyk, Oksana', 'Administration'],
        ['Petrov, Alexei', 'Engineering'],
        ['Smith, John', 'Sales'],
        ['Ivanova, Elena', 'Finance'],
        ['Garcia, Miguel', 'Support'],
        ['Müller, Hans', 'Engineering'],
        ['Dupont, Claire', 'Marketing'],
        ['Rossi, Marco', 'Sales'],
        ['Tanaka, Yuki', 'Support'],
        ['Nguyen, Lan', 'Finance'],
        ['O’Connor, Seamus', 'Engineering'],
        ['Novak, Jana', 'Administration'],
        ['Silva, Carlos', 'Support'],
        ['Chen, Li', 'Sales'],
        ['Patel, Asha', 'Finance'],
        ['Andersson, Erik', 'Engineering'],
        ['Sato, Kenji', 'Marketing'],
        ['Moreau, Luc', 'Support'],
        ['Popescu, Andrei', 'Administration'],
        ['Wilson, Emma', 'Sales'],
        ['Khan, Amir', 'Engineering'],
      ].forEach((r, i) => {
        const row = u.el('div', 'gem-row' + (i === 2 ? ' selected' : ''), rows);
        u.el('span', '', row, r[0]);
        u.el('span', '', row, r[1]);
      });
      const noteMode = ctx.display;
      let note = null;
      if (noteMode !== 'hidden' && noteMode !== 'toast' && noteMode !== 'panel') {
        note = u.el('div', 'gem-note', win, ctx.instruction);
      }
      const foot = u.el('footer', 'gem-status', win);
      u.el('span', '', foot, '1 person selected');
      u.el('span', '', foot, 'Melnyk, Oksana　 |　 Administration');
      u.el('span', '', foot, 'Record 3 of 23');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          canonical = er.bool(0.5),
          labels = ctx.content && ctx.content.END_LABELS,
          pool =
            Array.isArray(labels) && labels.length
              ? labels
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        let label = 'Done';
        if (!canonical) label = String(er.pick(pool));
        submit = u.el('button', 'gem-submit', foot, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.addEventListener('click', () => ctx.submit());
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const options = pool.map(String).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (options.length) {
            const decoyLabel = cr.pick(options),
              decoy = u.el('button', 'gem-submit gem-xtra', nav, decoyLabel);
            decoy.type = 'button';
            decoy.dataset.role = 'xtra';
            decoy.addEventListener('click', () => env.log('decoy', { label: decoyLabel, collide: true }));
          }
        }
      }
      if (noteMode === 'panel') {
        note = u.el('aside', 'gem-instruction-panel', desktop, ctx.instruction);
      }
      if (noteMode === 'toast') {
        note = u.el('aside', 'gem-toast', desktop, ctx.instruction);
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      u.el(
        'div',
        '',
        el,
        ctx.kind === 'cookie'
          ? 'This desk uses local preferences.'
          : ctx.kind === 'chat'
            ? 'Help desk　How can we help?'
            : ctx.kind === 'promo'
              ? 'New features are available.'
              : 'System notice',
      );
      const dismiss = u.el('button', '', el, 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: 0 };
    },
  });
})();
