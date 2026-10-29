(function () {
  'use strict';
  env.site({
    name: 'design-solve-puzzle-fix-error-03',
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'ipad instruction-' + ctx.display + (ctx.finish ? ' finish' : '');
      const u = ctx.util,
        root = u.el('main', 'app', document.body),
        head = u.el('header', 'top', root);
      const title = u.el('div', 'app-title', head);
      u.el('strong', '', title, 'Contacts');
      if (ctx.display === 'header') u.el('div', 'task-note', head, ctx.instruction);
      const workspace = u.el('div', 'workspace', root),
        side = u.el('aside', 'contact-list', workspace);
      u.el('h1', '', side, 'Contacts');
      const search = u.el('div', 'search', side);
      u.el('span', 'search-icon', search, '⌕');
      u.el('span', '', search, 'Search');
      const people = [
        'Jordan Taylor',
        'Morgan Smith',
        'Alex Kim',
        'Priya Rao',
        'Daniel Lee',
        'Sophia Chen',
        'James Miller',
        'Emma Wilson',
      ];
      people.forEach((name, i) => {
        const row = u.el('div', 'contact-row' + (i === 0 ? ' active' : ''), side);
        u.el(
          'i',
          'avatar ' + (i ? 'muted' : ''),
          row,
          name
            .split(' ')
            .map((x) => x[0])
            .join(''),
        );
        u.el('span', '', row, name);
      });
      const stage = u.el('section', 'stage', workspace);
      const summary = u.el('aside', 'summary', workspace);
      u.el('h2', '', summary, 'Contact Summary');
      [
        ['♟', 'Total Contacts', '8'],
        ['●', 'Customers', '5'],
        ['▦', 'Partners', '2'],
        ['★', 'Leads', '1'],
      ].forEach(([ic, label, n]) => {
        const row = u.el('div', 'stat', summary);
        u.el('span', 'stat-icon', row, ic);
        u.el('span', '', row, label);
        u.el('b', '', row, n);
      });
      if (ctx.display === 'panel') u.el('div', 'panel-note', summary, ctx.instruction);
      const tools = u.el('div', 'toolbar', head);
      let submit = null;
      const ends =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const r = ctx.rng.fork('chrome/end'),
        placement = ctx.finish ? null : r.pick(['toolbar', 'footer', 'link', 'icon', 'toolbar']);
      if (!ctx.finish) {
        const choice = r.pick(ends),
          label =
            placement === 'toolbar'
              ? 'Apply'
              : typeof choice === 'string'
                ? choice
                : choice.label || choice.text || choice.name || 'Done';
        submit = u.el('button', 'submit ' + placement, tools, placement === 'icon' ? '✓' : label);
        submit.type = 'button';
        submit.title = placement === 'icon' ? 'Send' : label;
        submit.setAttribute('aria-label', placement === 'icon' ? 'Send' : label);
        submit.addEventListener('click', ctx.submit);
      }
      if (!ctx.finish && ctx.rng.fork('chrome/collide').bool(0.3)) {
        const b = u.el('button', 'xtra', tools, 'Proceed');
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: 'Proceed', collide: true }));
      }
      const dock = u.el('nav', 'dock', root);
      [
        ['♟', 'Contacts'],
        ['▢', 'Calendar'],
        ['✓', 'Tasks'],
        ['⚙', 'Settings'],
      ].forEach(([ic, l], i) => {
        const item = u.el('div', 'dock-item' + (!i ? ' selected' : ''), dock);
        u.el('span', 'dock-icon', item, ic);
        u.el('span', '', item, l);
      });
      if (placement === 'footer' && !ctx.finish) {
        const b = u.el('button', 'footer-end', root, 'Save and exit');
        b.addEventListener('click', ctx.submit);
        submit = b;
      }
      if (placement === 'link' && !ctx.finish) {
        const b = u.el('button', 'link-end', root, 'Go');
        b.addEventListener('click', ctx.submit);
        submit = b;
      }
      if (ctx.display === 'toast') u.el('div', 'toast-note', document.body, ctx.instruction);
      if (ctx.display === 'hidden') document.body.classList.add('no-note');
      if (placement === 'toolbar') document.body.classList.add('ep-end-toolbar');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        messages = {
          cookie: 'This application stores preferences on your device.',
          toast: 'Your workspace has been synced.',
          chat: 'Need help with this exercise?',
          promo: 'Try the new practice collection.',
          banner: 'An updated practice collection is available.',
        };
      u.el('span', '', el, messages[ctx.kind]);
      const b = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      b.addEventListener('click', ctx.dismiss);
      return { el, dismiss: b };
    },
  });
})();
