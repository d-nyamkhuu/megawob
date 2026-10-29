(function () {
  env.site({
    name: 'design-handle-text-spinner-12',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref eink';
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const ttl = u.el('div', 'title', head);
      ttl.innerHTML =
        '<svg class="ico" viewBox="0 0 16 16" width="22" height="22" fill="none" stroke="#222" stroke-width="1.2"><rect x="1.5" y="3" width="13" height="11.5"/><path d="M1.5 6.5h13M5 1.5v3M11 1.5v3M4 9h2M7 9h2M10 9h2M4 12h2M7 12h2"/></svg><span>Event Planner &mdash; Riverside Room</span><span class="wc"><i>&minus;</i><i>&#9633;</i><i>&times;</i></span>';
      u.el('div', 'tools', head, 'File    Edit    View    Tools    Help');
      const work = u.el('div', 'work', shell);
      const endRng = ctx.rng.fork('chrome/end');
      const labels = (
        (ctx.content && ctx.content.END_LABELS) || [
          'Submit',
          'Done',
          'Finish',
          'Continue',
          'Save',
          'OK',
          'Confirm',
          'Apply',
          'Complete',
          "I'm done",
        ]
      ).map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)));
      const placement = ctx.finish ? null : endRng.pick(['actions', 'actions', 'header', 'footer']);
      const originalLabel = labels.find((x) => x.trim().toLowerCase() === 'submit') || labels[0];
      const endLabel = placement ? (placement === 'actions' ? originalLabel : endRng.pick(labels)) : originalLabel;
      const collideRng = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideRng.bool(0.3)) {
        const pool = [...new Set(labels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()))];
        if (pool.length) collide = collideRng.pick(pool);
      }
      const ledger = u.el('section', 'guest-ledger', work);
      u.el('h1', '', ledger, 'Guest Ledger');
      const srch = u.el('div', 'search', ledger);
      srch.innerHTML =
        '<svg viewBox="0 0 16 16" width="22" height="22" fill="none" stroke="#222" stroke-width="1.5"><circle cx="6.5" cy="6.5" r="4.5"/><path d="M10 10l4.5 4.5"/></svg><span>Search guests...</span>';
      const table = u.el('table', '', ledger);
      table.innerHTML = '<tr><th>#</th><th>Name</th><th>Group</th><th>Meal Preference</th><th>Status</th></tr>';
      [
        'Taylor Kim',
        'Jordan Lee',
        'Morgan Patel',
        'Casey Nguyen',
        'Riley Chen',
        'Avery Wilson',
        'Jamie Park',
        'Quinn Davis',
        'Sydney Brooks',
        'Drew Martinez',
      ].forEach((t, i) => {
        const row = u.el('tr', '', table);
        [
          String(i + 1),
          t,
          ['Friends', 'Work', 'Family'][i % 3],
          [
            'Regular',
            'Vegetarian',
            'Regular',
            'Vegan',
            'Regular',
            'Vegetarian',
            'Regular',
            'Regular',
            'Vegan',
            'Regular',
          ][i],
          i % 3 === 2 ? 'Pending' : 'Confirmed',
        ].forEach((t) => u.el('td', '', row, t));
      });
      const pg = u.el('p', 'pager', ledger);
      pg.innerHTML =
        '<span class="cnt">Showing 10 of 24 guests</span><span class="pgr"><b>&#9664;</b><span>Page 1 of 3</span><b>&#9654;</b></span>';
      const pane = u.el('section', 'event-settings', work);
      u.el('h2', '', pane, 'Event Settings');
      const facts = u.el('div', 'event-facts', pane);
      facts.innerHTML =
        '<span>Event:</span><span>Team Dinner</span><span>Date:</span><span>Sat, Apr 26, 2025</span><span>Room:</span><span>Riverside Room</span>';
      const note = u.el('div', 'instruction', pane, ctx.instruction);
      note.hidden = ctx.display === 'hidden';
      note.dataset.display = ctx.display || 'header';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const stage = u.el('div', 'stage', pane);
      const actions = u.el('div', 'event-actions', pane);
      const save = u.el('button', 'save-view', actions, 'Save view');
      save.addEventListener('click', () => {
        hint.textContent = 'View preferences saved.';
        env.log('decoy', { label: 'Save view' });
      });
      const hint = u.el('p', 'save-hint', pane, 'Saves only your\npresentation preferences.');
      let submit = null;
      const endButton = (parent, cls) => {
        const b = u.el('button', cls, parent, endLabel);
        b.type = 'button';
        b.setAttribute('aria-label', endLabel);
        b.title = endLabel;
        b.addEventListener('click', ctx.submit);
        return b;
      };
      if (placement === 'actions') submit = endButton(actions, 'submit');
      if (placement === 'header') submit = endButton(head.querySelector('.tools'), 'chrome-end chrome-end-header');
      if (collide) {
        const d = u.el('button', 'chrome-xtra', head.querySelector('.tools'), collide);
        d.type = 'button';
        d.addEventListener('click', () => env.log('decoy', { label: collide, collide: true }));
      }
      const preview = u.el('section', 'room-preview', work);
      const ph = u.el('h3', '', preview, 'Room Preview');
      u.el('span', 'collapse', ph, '−');
      preview.innerHTML +=
        '<svg viewBox="0 0 450 205" fill="none" stroke="#222" stroke-width="1.3"><defs><g id="table"><circle r="29"/><g id="chair"><path d="M-8-31v-7q0-4 8-4t8 4v7Z M-8-37q8-3 16 0"/></g><use href="#chair" transform="rotate(60)"/><use href="#chair" transform="rotate(120)"/><use href="#chair" transform="rotate(180)"/><use href="#chair" transform="rotate(240)"/><use href="#chair" transform="rotate(300)"/></g><path id="leaf" d="M0 0Q-9-9 0-17Q9-9 0 0Z M0-2V-13"/></defs><path d="M6 6H444V199H6Z M6 6v88 M6 130v69"/><g transform="translate(-4 -4)"><path d="M9 94Q39 94 39 130H9" fill="#efeee8"/><use href="#table" x="110" y="65"/><use href="#table" x="235" y="65"/><use href="#table" x="162" y="148"/><path d="M323 30h48v95h-48Z M335 51v55 M332 53h6 M332 104h6 M303 142h135v49H303Z"/><text x="347" y="51" fill="#111" stroke="none" transform="rotate(90,347,51)" font-family="Georgia" font-size="19">Buffet</text><g transform="translate(419 34)"><use href="#leaf"/><use href="#leaf" transform="rotate(45)"/><use href="#leaf" transform="rotate(90)"/><use href="#leaf" transform="rotate(135)"/><use href="#leaf" transform="rotate(180)"/><use href="#leaf" transform="rotate(225)"/><use href="#leaf" transform="rotate(270)"/><use href="#leaf" transform="rotate(315)"/><circle r="4"/></g><text x="370" y="162" text-anchor="middle" fill="#111" stroke="none" font-family="Georgia" font-size="18">Riverside Room</text><text x="370" y="183" text-anchor="middle" fill="#111" stroke="none" font-family="Georgia" font-size="17">Capacity: 50</text></g></svg>';
      const foot = u.el('footer', 'footer', shell, 'Ready');
      u.el('span', '', foot, 'Apr 10, 2025    10:24 AM');
      if (placement === 'footer') submit = endButton(foot, 'submit chrome-end-footer');
      return { stage, submit };
    },
    overlay(ctx) {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el('strong', '', el, 'Notice');
      ctx.util.el('p', '', el, 'Close this notice to continue.');
      const dismiss = ctx.util.el('button', 'dismiss', el, 'Close');
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  });
})();
