(function () {
  'use strict';
  const C = { site: 'design-set-date-segmented-04' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util,
        body = u.el('div', 'ds-body', document.body),
        rail = u.el('aside', 'ds-rail', body);
      u.el('div', 'ds-mark', rail, 'p');
      const nav = u.el('nav', 'ds-nav', rail);
      const icons = [
        '<path d="M3 6h7l2 2h9v11H3z"/><path d="M3 9h18"/>',
        '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="m7 12 3 3 7-7"/>',
        '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M7 14h2M12 14h2M7 18h2"/>',
        '<path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20z"/><circle cx="9.5" cy="7" r="3"/><path d="M17 11a3 3 0 1 0-1-5.8M17 14h1a3 3 0 0 1 3 3v3h-3"/>',
        '<path d="M4 20V12h4v8M10 20V7h4v13M16 20V3h4v17"/>',
        '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.7a8 8 0 0 1-1.8 1l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.8-1l-1.7.7-1.4-2.4 1.4-1.1a7 7 0 0 1 0-2l-1.4-1.1 1.4-2.4 1.7.7a8 8 0 0 1 1.8-1l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.8 1l1.7-.7 1.4 2.4-1.4 1.1a7 7 0 0 1 0 2z" transform="translate(-1 -1) scale(1.08)"/>',
      ];
      [['Projects'], ['Tasks'], ['Calendar'], ['Team'], ['Reports'], ['Settings']].forEach((x, i) => {
        const a = u.el('div', 'ds-navitem' + (i === 0 ? ' active' : ''), nav),
          icon = u.el('b', '', a);
        icon.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + icons[i] + '</svg>';
        u.el('span', '', a, x[0]);
      });
      const content = u.el('div', 'ds-content', body),
        top = u.el('header', 'ds-top', content);
      u.el('h1', '', top, 'Projects');
      const search = u.el('div', 'ds-search', top, '⌕　Search projects, tasks or people');
      u.el('b', 'ds-user', top, 'JD');
      const statrow = u.el('section', 'ds-stats', content);
      [
        ['12', 'Active projects', '▱'],
        ['48', 'Open tasks', '☷'],
        ['7', 'Due this week', '▦'],
        ['3', 'Blocked', '!'],
      ].forEach((x, i) => {
        const c = u.el('div', 'ds-stat', statrow);
        u.el('b', '', c, x[0]);
        u.el('span', '', c, x[1]);
        u.el('i', 'ds-stat-icon ' + (i === 3 ? 'alert' : ''), c, x[2]);
      });
      const app = u.el('div', 'ds-app', content),
        list = u.el('section', 'ds-projects', app);
      u.el('h2', '', list, 'All projects');
      u.el('div', 'ds-list-head', list, 'Name ↑');
      const names = [
        'Website Redesign',
        'Mobile App',
        'Marketing Campaign',
        'Product Launch',
        'Customer Research',
        'Operations',
        'Brand Refresh',
        'Internal Tools',
        'Q4 Planning',
        'Partner Program',
        'Sustainability Initiative',
        'Archive',
      ];
      const colors = [
        '#38a34a',
        '#477be8',
        '#9955c8',
        '#e89127',
        '#16a39d',
        '#747d84',
        '#eb6570',
        '#e4c62d',
        '#477be8',
        '#653fd1',
        '#38a34a',
        '#747d84',
      ];
      names.forEach((n, i) => {
        const row = u.el('div', 'ds-project-row', list);
        u.el('i', '', row, '');
        row.lastChild.style.background = colors[i];
        u.el('span', '', row, n);
      });
      const detail = u.el('section', 'ds-detail', app);
      u.el('h2', '', detail, 'Website Redesign');
      u.el('div', 'ds-active', detail, '●　Active');
      const tabs = u.el('div', 'ds-tabs', detail);
      ['Overview', 'Tasks', 'Team', 'Files'].forEach((t, i) => u.el('span', i === 1 ? 'selected' : '', tabs, t));
      const table = u.el('div', 'ds-table', detail);
      u.el('div', 'ds-table-head', table, 'Task　　　　　　　　　　　　　　　　　　　　　　　　　Due　　　　　 Status');
      [
        'Homepage wireframes',
        'Review mobile layouts',
        'Update brand assets',
        'Accessibility audit',
        'Landing page copy',
        'QA responsive pages',
        'Prepare launch notes',
      ].forEach((t, i) => {
        const r = u.el('div', 'ds-task-row', table);
        u.el('span', '', r, t);
        u.el(
          'span',
          '',
          r,
          [
            'Apr 12, 2021',
            'Apr 18, 2021',
            'Apr 25, 2021',
            'May 3, 2021',
            'May 10, 2021',
            'May 17, 2021',
            'May 24, 2021',
          ][i],
        );
        u.el(
          'b',
          'ds-status ' + (i === 0 ? 'progress' : i === 3 ? 'blocked' : ''),
          r,
          i === 0 ? 'In progress' : i === 3 ? 'Blocked' : 'Todo',
        );
      });
      if (ctx.display !== 'hidden') {
        const note = u.el(
          'aside',
          'ds-instruction-note ' + (ctx.display === 'panel' ? 'panel' : ctx.display === 'toast' ? 'toast' : 'header'),
          content,
        );
        u.el('div', 'ds-instruction', note, ctx.instruction);
      }
      const main = u.el('main', 'ds-main', content),
        stage = u.el('div', 'ds-stage', main);
      const footer = u.el('footer', 'ds-footer', main),
        er = ctx.rng.fork('chrome/end'),
        bank =
          ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      let label = 'Continue',
        place = 'footer';
      if (!ctx.finish && er.bool(0.5)) {
        const opts = bank.map(labelOf).filter((x) => x.toLowerCase() !== 'submit');
        if (opts.length) label = er.pick(opts);
        place = er.pick(['footer', 'footer', 'header', 'link']);
      }
      let submit = null;
      if (!ctx.finish) {
        const b = u.el(
          place === 'link' ? 'a' : 'button',
          place === 'header' ? 'ds-end-header' : place === 'link' ? 'ds-end-link' : 'ds-submit',
          footer,
          place === 'link' ? label + ' ›' : label,
        );
        if (place === 'link') b.href = '#';
        else b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        submit = b;
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const words = bank.map(labelOf).filter((x) => x.toLowerCase() !== label.toLowerCase());
          if (words.length) {
            const t = cr.pick(words),
              d = u.el('button', 'ds-xtra', footer, t);
            d.type = 'button';
            d.dataset.role = 'xtra';
            d.addEventListener('click', () => env.log('decoy', { label: t, collide: true }));
          }
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to improve your experience.',
        toast: 'Project status updated.',
        chat: 'Hello. How can we help?',
        promo: 'Get more from your projects.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
