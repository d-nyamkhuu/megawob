(function () {
  'use strict';
  env.site({
    name: 'design-solve-puzzle-hot-cold-08',
    styles: ['site.css'],
    frame(ctx) {
      document.body.className = 'bootstrap-admin operational instruction-' + ctx.display;
      const u = ctx.util,
        app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app),
        brand = u.el('div', 'brand', top);
      u.el('strong', '', brand, 'Acme Admin');
      u.el('small', '', brand, 'Project Management');
      const nav = u.el('nav', 'menu', top);
      for (const [name, active] of [
        ['Home', false],
        ['Projects', true],
        ['Tasks', false],
        ['Reports', false],
        ['People', false],
        ['Settings', false],
      ])
        u.el('span', active ? 'active' : '', nav, name);
      const utility = u.el('div', 'utility', top);
      u.el('span', '', utility, 'Help');
      u.el('i', '', utility, '|');
      u.el('span', '', utility, 'Sign out');
      const center = u.el('section', 'center', app),
        heading = u.el('div', 'page-heading', center);
      u.el('h1', '', heading, 'Project Search');
      u.el('p', '', heading, 'Find and view projects by name, owner, or keyword.');
      const stage = u.el('section', 'stage', center);
      const recent = u.el('section', 'recent', center);
      u.el('h2', '', recent, 'Recent Projects');
      const table = u.el('table', 'project-table', recent),
        head = u.el('tr', '', u.el('thead', '', table));
      for (const title of ['Name', 'Owner', 'Status', 'Last Updated']) u.el('th', '', head, title);
      const tbody = u.el('tbody', '', table);
      for (const row of [
        ['Website Redesign', 'Taylor Kim', 'In Progress', 'Apr 12, 2013'],
        ['Mobile App', 'Jordan Lee', 'Planning', 'Apr 10, 2013'],
        ['Customer Portal', 'Morgan Diaz', 'On Hold', 'Apr 2, 2013'],
        ['Internal Tools', 'Riley Chen', 'Completed', 'Mar 28, 2013'],
      ]) {
        const tr = u.el('tr', '', tbody);
        for (const value of row) u.el('td', '', tr, value);
      }
      const footer = u.el('footer', 'bottom', app);
      let display = ctx.display || 'header';
      const roomy = innerWidth >= 1180 && innerHeight >= 700;
      if ((display === 'panel' && !roomy) || (display === 'toast' && innerHeight < 700)) display = 'header';
      document.body.classList.add('display-' + display);
      let brief = null;
      if (display === 'header') {
        brief = u.el('div', 'brief chrome-instruction', heading, ctx.instruction);
      } else if (display === 'panel') {
        brief = u.el('div', 'brief chrome-panel', recent, ctx.instruction);
      } else if (display === 'toast') {
        brief = u.el('div', 'brief chrome-toast', footer, ctx.instruction);
      }
      if (ctx.finish) u.el('span', 'workspace-status', footer, 'Acme Admin · Project workspace');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          cr = ctx.rng.fork('chrome/collide');
        const placement = er.pick(['footer', 'footer', 'footer', 'header', 'link']);
        const labels = (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
        ];
        const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
        let label = er.bool(0.8)
          ? 'Submit'
          : labelOf(er.pick(labels.filter((x) => labelOf(x).trim().toLowerCase() !== 'submit')));
        if (placement !== 'footer' && label === 'Submit')
          label = labelOf(
            ctx.rng.fork('chrome/end-label').pick(labels.filter((x) => labelOf(x).trim().toLowerCase() !== 'submit')),
          );
        const endParent = placement === 'header' ? utility : footer;
        const makeEnd = (parent, text, link) => {
          const b = u.el(link ? 'a' : 'button', link ? 'end-link' : 'submit', parent, text);
          if (link) {
            b.href = '#';
          } else b.type = 'button';
          b.title = label;
          b.setAttribute('aria-label', label);
          b.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
          return b;
        };
        submit = makeEnd(endParent, label, placement === 'link');
        if (cr.bool(0.3)) {
          const options = [...new Set(labels.map(labelOf))].filter(
            (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
          );
          if (options.length) {
            const text = cr.pick(options),
              parent = placement === 'footer' ? utility : footer;
            const decoy = u.el('button', 'xtra-end', parent, text);
            decoy.type = 'button';
            decoy.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          }
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body);
      const messages = {
        cookie: 'This application stores preferences on your device.',
        toast: 'Your workspace has been synced.',
        chat: 'Need help with this exercise?',
        promo: 'Try the new practice collection.',
        banner: 'An updated practice collection is available.',
      };
      u.el('span', '', el, messages[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
