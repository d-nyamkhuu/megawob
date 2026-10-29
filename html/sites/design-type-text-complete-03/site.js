(function () {
  'use strict';
  const C = { site: 'design-type-text-complete-03' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util;
      const top = u.el('header', 'ds-top', document.body);
      const logo = u.el('div', 'ds-logo', top);
      u.el('span', 'ds-globe', logo, '');
      const brand = u.el('div', 'ds-brand', top);
      u.el('div', 'ds-title', brand, 'Sunrise Software');
      u.el('div', 'ds-subtitle', brand, 'CUSTOMER MANAGER');
      const vista = u.el('div', 'ds-vista', top);
      u.el('div', '', vista, 'PEOPLE');
      u.el('div', '', vista, 'PRODUCTS');
      u.el('div', '', vista, 'SUPPORT');
      const body = u.el('div', 'ds-body', document.body);
      const rail = u.el('aside', 'ds-rail', body);
      [
        ['♟', 'Customers'],
        ['◉', 'Products'],
        ['▤', 'Orders'],
        ['◖', 'Support'],
        ['▥', 'Reports'],
        ['⚙', 'Settings'],
      ].forEach((x, i) => {
        const a = u.el('div', 'ds-navitem' + (i === 0 ? ' active' : ''), rail);
        u.el('span', 'ds-navicon', a, x[0]);
        u.el('span', '', a, x[1]);
      });
      const content = u.el('div', 'ds-content', body);
      const board = u.el('section', 'ds-board', content);
      u.el('h1', 'ds-board-title', board, 'Customers');
      const filter = u.el('div', 'ds-filter', board);
      u.el('span', '', filter, 'Show:');
      u.el('span', 'ds-select', filter, 'All Customers　　▾');
      const table = u.el('div', 'ds-table', board);
      const head = u.el('div', 'ds-row ds-row-head', table);
      ['Last Name', 'First Name', 'City'].forEach((x) => u.el('span', '', head, x));
      [
        ['Baker', 'Susan', 'Denver'],
        ['Carter', 'Michael', 'Seattle'],
        ['Chang', 'Kevin', 'San Jose'],
        ['Davis', 'Amy', 'Portland'],
        ['Garcia', 'Robert', 'Austin'],
        ['Hall', 'Patricia', 'Chicago'],
        ['Kim', 'Daniel', 'Boston'],
        ['Lopez', 'Maria', 'Phoenix'],
        ['Mitchell', 'James', 'Columbus'],
        ['Nguyen', 'Linda', 'San Diego'],
        ['Parker', 'William', 'Denver'],
        ['Reed', 'Karen', 'Raleigh'],
        ['Scott', 'Steven', 'Atlanta'],
        ['Turner', 'Angela', 'Miami'],
        ['Walker', 'Brian', 'Las Vegas'],
      ].forEach((r, i) => {
        const row = u.el('div', 'ds-row' + (i === 10 ? ' selected' : ''), table);
        r.forEach((x) => u.el('span', '', row, x));
      });
      const natural = 'header';
      const mode =
        ctx.display === 'hidden'
          ? 'hidden'
          : ctx.display === 'toast'
            ? 'toast'
            : ctx.display === 'panel'
              ? 'panel'
              : natural;
      const stageWrap = u.el('section', 'ds-window' + (mode === 'header' ? ' ds-window-note' : ''), content);
      const winbar = u.el('div', 'ds-window-title', stageWrap);
      u.el('strong', '', winbar, 'Edit Customer Information');
      u.el('span', 'ds-window-controls', winbar, '−　□　×');
      function briefing(parent, cls) {
        const b = u.el('aside', cls, parent);
        u.el('div', 'ds-instruction', b, ctx.instruction);
        return b;
      }
      if (mode === 'header') briefing(content, 'ds-header-note');
      if (mode === 'panel') board.insertBefore(briefing(board, 'ds-brief'), filter);
      const stage = u.el('main', 'sunrise-stage', stageWrap);
      if (mode === 'toast') briefing(content, 'ds-toast');
      let submit = null;
      let placement = null;
      let label = 'Save';
      let collide = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const canonical = er.bool(0.5);
        if (!canonical) {
          placement = er.pick(['header', 'link']);
          const labels = ctx.content && ctx.content.END_LABELS;
          const pool =
            Array.isArray(labels) && labels.length
              ? labels
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
          label = String(er.pick(pool));
        }
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const labels = ctx.content && ctx.content.END_LABELS;
          const pool = (
            Array.isArray(labels) && labels.length
              ? labels
              : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
          ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
          const options = [...new Set(pool)].filter(
            (x) => String(x).trim().toLowerCase() !== label.trim().toLowerCase(),
          );
          if (options.length) collide = cr.pick(options);
        }
        const addDecoy = (parent, text) => {
          const b = u.el('button', 'ds-end-xtra', parent, text);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
          return b;
        };
        const endButton = (parent, cls, text) => {
          const b = u.el('button', cls, parent, text);
          b.type = 'button';
          b.dataset.role = 'submit';
          b.setAttribute('aria-label', label);
          b.title = label;
          b.addEventListener('click', () => ctx.submit());
          return b;
        };
        if (canonical) {
          const actions = u.el('div', 'ds-window-actions', stageWrap);
          submit = endButton(actions, 'ds-endcontrol', label);
        } else if (placement === 'header') {
          if (collide) addDecoy(top, collide).classList.add('ds-end-pq-header');
          submit = endButton(winbar, 'ds-endcontrol ds-endcontrol-header', label);
        } else {
          const actions = u.el('div', 'ds-window-actions', stageWrap);
          if (collide) addDecoy(actions, collide).classList.add('ds-end-pq-link');
          submit = endButton(actions, 'ds-endcontrol ds-endcontrol-link', label);
        }
      }
      const foot = u.el('footer', 'ds-footer', content);
      u.el('span', 'ds-status', foot, 'Customer records');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util;
      const el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Changes synced.',
        chat: 'Hello. How can we help?',
        promo: 'Try our new workspace.',
        banner: 'Scheduled maintenance tonight.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept all' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
