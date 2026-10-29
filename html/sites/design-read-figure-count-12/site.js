(function () {
  'use strict';
  const C = { site: 'design-read-figure-count-12', task: 'read-figure', scenario: 'count' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    initialOverlay: { kind: 'promo' },
    frame(ctx) {
      document.body.className = 'northbridge instruction-' + ctx.display;
      const u = ctx.util,
        body = document.body;
      const endRng = ctx.rng.fork('chrome/end'),
        collideRng = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = endRng.bool(0.5);
      const placement = referenceEnd ? 'rail' : endRng.pick(['toolbar', 'footer']);
      const endLabel = referenceEnd ? 'Submit' : endRng.pick(endLabels);
      body.classList.toggle('finish-mode', ctx.finish);
      body.dataset.endPlacement = ctx.finish ? 'none' : placement;
      const head = u.el('header', 'masthead', body),
        brand = u.el('div', 'brand', head, 'Northbridge Supply Extranet'),
        right = u.el('div', 'masthead-right', head);
      u.el('div', 'utility-links', right, 'Help   |   Contact Us   |   Sign Out');
      u.el('div', 'date-line', right, 'Fri, Apr 23, 1999    10:14 AM');
      u.el('nav', 'partners', right, 'Partners   |   Products   |   Support');
      const nav = u.el('nav', 'tabs', body);
      ['Home', 'Inventory', 'Orders', 'Accounts', 'Resources', 'Administration'].forEach((x, i) =>
        u.el('div', i === 0 ? 'active' : '', nav, x),
      );
      const win = u.el('section', 'task-window', body),
        bar = u.el('div', 'window-bar', win);
      u.el('span', 'doc-icon', bar, '▯');
      u.el('b', '', bar, 'Training Module - Visual Count');
      const controls = u.el('div', 'window-controls', bar);
      ['−', '□', '×'].forEach((t) => u.el('i', '', controls, t));
      if (ctx.display !== 'hidden') {
        const note = u.el('div', 'task-instruction', ctx.display === 'header' ? win : body, ctx.instruction);
        note.setAttribute('role', 'note');
      }
      const base = u.el('div', 'task-body', win),
        stage = u.el('section', 'stage', base),
        rail = u.el('aside', 'task-rail', base);
      u.el('div', 'rail-heading', rail, 'Your Answer');
      u.el('div', 'answer-slot', rail);
      let submit = null;
      if (!ctx.finish) {
        submit = u.el(
          placement === 'footer' ? 'a' : 'button',
          'submit end-' + placement,
          placement === 'rail' ? rail : placement === 'toolbar' ? bar : win,
          endLabel,
        );
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        if (placement === 'footer') {
          submit.href = '#';
          submit.addEventListener('click', (event) => {
            event.preventDefault();
            ctx.submit();
          });
        } else {
          submit.type = 'button';
          submit.addEventListener('click', ctx.submit);
        }
        if (placement === 'toolbar') bar.insertBefore(submit, controls);
      }
      if (collideRng.bool(0.3)) {
        const pool = endLabels.filter((label) => label.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (pool.length) {
          const label = collideRng.pick(pool),
            decoy = u.el('button', 'chrome-xtra', bar, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          bar.insertBefore(decoy, controls);
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      u.el('hr', '', rail);
      u.el('b', 'rail-title', rail, 'Instructions');
      const steps = u.el('ol', '', rail);
      ['Review the task prompt.', 'Enter your response.'].forEach((t) => u.el('li', '', steps, t));
      const table = u.el('section', 'reference-table', win);
      u.el('b', 'table-title', table, 'Item List (for reference)');
      const tbl = u.el('table', '', table),
        thead = u.el('tr', '', u.el('thead', '', tbl));
      ['Shape', 'Color', 'Size', 'Quantity'].forEach((t) => u.el('th', '', thead, t));
      u.el('th', 'table-filler', thead);
      const tb = u.el('tbody', '', tbl);
      [
        ['Circle', 'Purple', 'Large', '2'],
        ['Circle', 'Purple', 'Small', '1'],
        ['Circle', 'Blue', 'Medium', '1'],
        ['Circle', 'Blue', 'Small', '1'],
        ['Square', 'Purple', 'Large', '2'],
        ['Square', 'Green', 'Large', '1'],
        ['Square', 'Green', 'Small', '1'],
        ['Triangle', 'Red', 'Large', '1'],
        ['Triangle', 'Red', 'Small', '1'],
      ].forEach((row) => {
        const tr = u.el('tr', '', tb);
        row.forEach((t) => u.el('td', '', tr, t));
        u.el('td', 'table-filler', tr);
      });
      const res = u.el('section', 'resources-window', body),
        rbar = u.el('div', 'window-bar', res);
      u.el('span', 'doc-icon', rbar, '▯');
      u.el('b', '', rbar, 'Partner Resources');
      const rc = u.el('div', 'window-controls', rbar);
      ['−', '□', '×'].forEach((t) => u.el('i', '', rc, t));
      const rbody = u.el('div', 'resources-body', res),
        menu = u.el('nav', 'resource-menu', rbody);
      ['Quick Guide', 'Color & Size Reference', 'Training Help', 'Contact Support'].forEach((t, i) =>
        u.el('div', i === 0 ? 'selected' : '', menu, t),
      );
      const guide = u.el('div', 'guide', rbody);
      u.el('h3', '', guide, 'Quick Guide');
      u.el('b', '', guide, 'Item Sizes');
      const sizes = u.el('div', 'size-examples', guide);
      ['Large', 'Medium', 'Small'].forEach((t, i) => {
        const item = u.el('div', 'size-example', sizes);
        u.el('i', 'size-dot size-' + i, item);
        u.el('span', '', item, t);
      });
      u.el('hr', '', guide);
      u.el('b', '', guide, 'Item Colors (examples)');
      const colors = u.el('div', 'color-examples', guide);
      [
        ['Purple', '#86389a'],
        ['Green', '#35a148'],
        ['Blue', '#3470ae'],
        ['Red', '#dc3d29'],
      ].forEach(([t, c]) => {
        const item = u.el('div', 'color-example', colors),
          sw = u.el('i', '', item);
        sw.style.background = c;
        u.el('span', '', item, t);
      });
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('div', 'overlay ' + ctx.kind, document.body),
        title = u.el('div', 'warning-title', el);
      u.el('b', '', title, 'Unsaved Changes');
      const close = u.el('button', 'warning-close', title, '×');
      close.setAttribute('aria-label', 'Close warning');
      close.addEventListener('click', ctx.dismiss);
      const content = u.el('div', 'warning-content', el),
        icon = u.svg('svg', { class: 'warning-icon', viewBox: '0 0 56 52', 'aria-hidden': 'true' }, content);
      u.svg(
        'path',
        {
          d: 'M26 3 Q28 0 30 3 L54 46 Q56 50 51 50 H5 Q0 50 2 46 Z',
          fill: '#ffda13',
          stroke: '#101010',
          'stroke-width': 2.5,
        },
        icon,
      );
      u.svg('path', { d: 'M26 17 Q28 14 30 17 L29 34 H27 Z', fill: '#111' }, icon);
      u.svg('circle', { cx: 28, cy: 42, r: 3.2, fill: '#111' }, icon);
      const text = u.el('div', 'warning-text', content);
      u.el('b', '', text, 'Unsaved layout changes.');
      u.el('p', '', text, 'You have made changes to the page layout.');
      u.el('p', '', text, 'If you continue, your layout changes will not be saved.');
      const actions = u.el('div', 'warning-actions', el),
        dismiss = u.el('button', 'continue', actions, 'Continue without saving');
      dismiss.addEventListener('click', ctx.dismiss);
      const cancel = u.el('button', 'cancel', actions, 'Cancel');
      cancel.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
