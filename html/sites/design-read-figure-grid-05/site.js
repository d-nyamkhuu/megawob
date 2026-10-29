(function () {
  'use strict';
  const C = { site: 'design-read-figure-grid-05' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    frame(ctx) {
      if (!document.body._fragGuard) {
        document.body._fragGuard = true;
        document.body.addEventListener('click', (e) => {
          const a = e.target.closest && e.target.closest('a[href]');
          if (a && /^#?$/.test(a.getAttribute('href'))) e.preventDefault();
        });
      }
      document.body.className = 'directory98 portal instruction-' + ctx.display;
      const endR = ctx.rng.fork('chrome/end'),
        baseline = !ctx.finish && endR.bool(0.5),
        placement = ctx.finish ? 'none' : baseline ? 'bottom' : endR.pick(['activity', 'mast']);
      document.body.classList.add('end-' + placement);
      const u = ctx.util,
        bank = ctx.content && ctx.content.END_LABELS,
        labels =
          Array.isArray(bank) && bank.length
            ? bank
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const asText = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const label = baseline ? 'Submit' : asText(endR.pick(labels));
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const pool = labels.map(asText).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (pool.length) collide = asText(collideR.pick(pool));
      }
      const app = u.el('main', 'app', document.body),
        top = u.el('header', 'top', app),
        brand = u.el('div', 'brand', top),
        globe = u.svg('svg', { width: 64, height: 64, viewBox: '0 0 64 64', class: 'globe' }, brand);
      u.svg('circle', { cx: 32, cy: 32, r: 30, fill: '#2868d7', stroke: '#103f9d', 'stroke-width': 2 }, globe);
      u.svg(
        'path',
        {
          d: 'M18 9l8 2 3 5-5 4 2 6-7 3-6-5-5 1 2-9zm24-1 7 4-3 5-5 1-4-5zM33 27l8-4 7 4-1 8-6 2-3 10-6 6-4-5 1-9-5-4 2-6zM8 34l8-4 6 5-2 8 5 5-6 6-7-3-4-9zM49 42l8-3-2 8-6 5-4-4z',
          fill: '#59b943',
        },
        globe,
      );
      const name = u.el('div', 'brand-copy', brand);
      u.el('strong', '', name, 'WebGuide ’98');
      u.el('span', '', name, 'Your Guide to the World Wide Web');
      const nav = u.el('nav', 'mast-nav', top);
      ['Home', 'Search', 'Sites by Subject', 'Add a Site', 'Help'].forEach((x, i) => {
        if (i) u.el('span', 'divider', nav, '|');
        const a = u.el('a', '', nav, x);
        a.href = '#';
      });
      u.el('div', 'date', top, 'Tuesday, March 3, 1998');
      const center = u.el('section', 'center', app),
        bar = u.el('div', 'activity-title', center, 'Interactive Activity'),
        brief = u.el(
          'div',
          'brief',
          center,
          ctx.display === 'hidden' || ctx.display === 'panel' ? '' : ctx.instruction,
        );
      if (ctx.display === 'toast') brief.classList.add('brief-notice');
      if (ctx.display === 'hidden' || ctx.display === 'panel') brief.classList.add('brief-absent');
      const description = u.el(
        'p',
        'task-description',
        center,
        'Find the requested point on the coordinate grid below. Click the point to select it.',
      );
      const stage = u.el('section', 'stage', center);
      const aside = u.el('aside', 'aside', app);
      function section(title, cls) {
        const box = u.el('section', 'portal-section ' + (cls || ''), aside);
        u.el('h2', '', box, title);
        return box;
      }
      const search = section('Search the Web');
      const form = u.el('div', 'search-row', search);
      const field = u.el('input', '', form);
      field.type = 'text';
      field.setAttribute('aria-label', 'Search the Web');
      const searchButton = u.el('button', 'search-button', form, 'Search');
      searchButton.type = 'button';
      const radios = u.el('div', 'search-types', search);
      ['Web', 'Images', 'News'].forEach((x, i) => {
        const label = u.el('label', '', radios),
          input = u.el('input', '', label);
        input.type = 'radio';
        input.name = 'portal-search';
        input.checked = i === 0;
        u.el('span', '', label, x);
      });
      const browse = section('Browse by Subject', 'subjects');
      const subjects = [
        'Arts & Humanities',
        'Recreation & Sports',
        'Business & Economy',
        'Reference',
        'Computers & Internet',
        'Regional',
        'Education',
        'Science',
        'Entertainment',
        'Society & Culture',
        'Health',
        'Kids',
        'News & Media',
        'All Categories',
      ];
      const subjectGrid = u.el('div', 'link-grid', browse);
      subjects.forEach((x) => {
        const a = u.el('a', '', subjectGrid, x);
        a.href = '#';
      });
      const featured = section('Featured Links', 'featured');
      ['Yahoo!', 'AltaVista', 'Lycos', 'Excite', 'About.com', 'MapQuest', 'Weather Channel'].forEach((x) => {
        const a = u.el('a', 'featured-link', featured, x);
        a.href = '#';
      });
      const controls = section('Task Controls', 'task-controls');
      if (ctx.display === 'panel') {
        const panel = u.el('div', 'instruction-panel-card', controls);
        u.el('b', '', panel, 'Instructions');
        u.el('div', 'instruction-panel-text', panel, ctx.instruction);
      }
      u.el('p', 'control-status', controls, 'No point selected.');
      let submit = null;
      function addEnd(parent, cls, text) {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.title = label;
        b.setAttribute('aria-label', label);
        b.dataset.role = 'submit';
        b.addEventListener('click', ctx.submit);
        return b;
      }
      const footer = u.el('footer', 'bottom', app);
      if (placement === 'activity') submit = addEnd(bar, 'submit-in-title', label);
      if (placement === 'mast') submit = addEnd(top, 'submit-in-mast', label);
      if (placement === 'bottom') submit = addEnd(footer, 'submit', label);
      if (collide) {
        const parent = placement === 'bottom' ? footer : placement === 'activity' ? bar : top;
        const b = u.el('button', 'end-xtra', parent, collide);
        b.type = 'button';
        b.dataset.role = 'xtra';
        b.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      if (ctx.finish) u.el('span', 'footer-note', footer, 'WebGuide directory services');
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
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Dismiss');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
