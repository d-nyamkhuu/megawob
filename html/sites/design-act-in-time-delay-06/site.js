(function () {
  'use strict';
  const C = { site: 'design-act-in-time-delay-06' };
  env.site({
    name: C.site,
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = ctx.util,
        rng = ctx.rng.fork('community/chrome');
      const body = u.el('div', 'mh-body', document.body),
        rail = u.el('aside', 'mh-rail', body);
      u.el('div', 'mh-leaf', rail, '🍁');
      u.el('div', 'mh-railbrand', rail, 'Maple Hollow Online');
      [
        ['⌂', 'Home'],
        ['▤', 'News'],
        ['👥', 'Members'],
        ['▣', 'Events'],
        ['📷', 'Photos'],
        ['☏', 'Forums'],
        ['▣', 'Links'],
        ['⚙', 'Settings'],
      ].forEach(([i, t]) => {
        const a = u.el('a', 'mh-nav', rail);
        u.el('span', 'mh-icon', a, i);
        u.el('span', '', a, t);
      });
      const content = u.el('div', 'mh-content', body),
        mast = u.el('header', 'mh-mast', content);
      u.el('div', 'mh-trees mh-lefttrees', mast);
      const title = u.el('div', 'mh-title', mast);
      u.el('h1', '', title, 'Maple Hollow');
      u.el('div', 'mh-subtitle', title, 'Community Page');
      u.el('div', 'mh-motto', title, 'Neighbors　🍁　Friends　🍁　A Brighter Tomorrow');
      u.el('div', 'mh-trees mh-righttrees', mast);
      const date = u.el('div', 'mh-date', mast);
      u.el('div', '', date, 'Mon, Apr 14, 1996');
      u.el('div', '', date, 'Local Time: 10:24 AM　☀️');
      const mode = ctx.display || 'header';
      let note = null;
      if (mode === 'header' || mode === 'toast' || mode === 'panel') {
        note = u.el('aside', mode === 'toast' ? 'mh-note mh-toast' : 'mh-note', content);
        u.el('span', 'mh-hourglass', note, '⌛');
        u.el('div', 'mh-instruction', note, ctx.instruction);
      }
      const divider = u.el('div', 'mh-divider', content);
      const grid = u.el('div', 'mh-grid', content);
      const photo = u.el('section', 'mh-panel mh-photo', grid);
      u.el('h2', '', photo, 'Community Photo Archive');
      const photoBody = u.el('div', 'mh-photo-body', photo);
      u.el('div', 'mh-lake', photoBody, '');
      const details = u.el('div', 'mh-details', photoBody);
      [
        ['Photo:', 'Sunset at Maple Lake'],
        ['Added by:', 'RiverDan'],
        ['Date:', 'Apr 14, 1996'],
        ['Views:', '128'],
      ].forEach(([a, b]) => {
        const row = u.el('div', 'mh-detail', details);
        u.el('span', '', row, a);
        u.el('span', '', row, b);
      });
      const right = u.el('div', 'mh-rightcol', grid);
      const stage = u.el('main', 'ds-stage mh-task', right);
      const endpanel = u.el('section', 'mh-panel mh-controls', right);
      u.el('h2', '', endpanel, 'Task Controls');
      const endrow = u.el('div', 'mh-endrow', endpanel);
      let submit = null;
      const footer = u.el('footer', 'mh-footer', content);
      u.el('span', 'mh-footnote', footer, '🌲　A Small Town Makes a Big Difference　🌲');
      const tables = u.el('div', 'mh-tables', content);
      const posts = u.el('section', 'mh-panel mh-posts', tables);
      u.el('h2', '', posts, 'Recent Community Posts');
      const posttable = u.el('table', '', posts);
      posttable.innerHTML =
        '<thead><tr><th>Subject</th><th>Author</th><th>Replies</th><th>Last Post</th></tr></thead><tbody><tr><td><a>Spring Cleanup This Saturday</a></td><td>Maple_Lee</td><td>4</td><td>Apr 14, 10:02 AM</td></tr><tr><td><a>Best Hiking Trails Nearby?</a></td><td>TrailScout</td><td>7</td><td>Apr 13, 6:18 PM</td></tr><tr><td><a>Sharing Garden Tips</a></td><td>GreenThumb</td><td>3</td><td>Apr 12, 9:41 AM</td></tr></tbody>';
      const events = u.el('section', 'mh-panel mh-events', tables);
      u.el('h2', '', events, 'Community Events');
      const ev = u.el('table', '', events);
      ev.innerHTML =
        '<thead><tr><th>Date</th><th>Event</th><th>Location</th></tr></thead><tbody><tr><td>Apr 20, 1996</td><td>Riverside Clean-Up</td><td>Maple Lake</td></tr><tr><td>Apr 26, 1996</td><td>Community Potluck</td><td>Town Hall</td></tr><tr><td>May 3, 1996</td><td>Plant a Tree Day</td><td>Riverside Park</td></tr></tbody>';
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
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
        ]
      ).map(labelOf);
      const railTools = u.el('div', 'mh-rail-tools', rail);
      let endLabel = null;
      if (ctx.finish) {
        endpanel.classList.add('mh-finish');
        right.dataset.end = 'finish';
      } else {
        // Preserve both existing draws; all added episode choices have their own stream.
        const legacyPlacement = rng.pick(['controls', 'controls', 'footer', 'link', 'icon']);
        const legacyLabel = rng.pick(
          (ctx.content && ctx.content.END_LABELS) || [
            'Submit',
            'Done',
            'Finish',
            'Continue',
            'Save',
            'OK',
            'Confirm',
            'Apply',
          ],
        );
        const er = ctx.rng.fork('chrome/end'),
          original = er.bool(0.5);
        const placement = original ? 'controls' : er.pick(['footer', 'link']);
        const label = original ? 'Submit' : er.pick(labels.filter((x) => x !== 'Submit'));
        endLabel = label;
        right.dataset.end = placement;
        submit = u.el(
          placement === 'link' ? 'a' : 'button',
          placement === 'link' ? 'mh-submit mh-link' : 'mh-submit',
          placement === 'footer' ? footer : placement === 'link' ? railTools : endrow,
          label,
        );
        if (placement === 'link') submit.href = '#';
        else submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        if (placement === 'link') submit.textContent = label + ' ›';
      }
      const d = rng.fork('community/decoy');
      if (!ctx.finish && d.bool(0.3)) {
        const legacyDecoy = d.pick((ctx.content && ctx.content.END_LABELS) || ['Save', 'Done', 'Apply']);
        const cr = ctx.rng.fork('chrome/collide'),
          pool = labels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (pool.length) {
          const label = cr.pick(pool),
            b = u.el('button', 'mh-xtra', railTools, label);
          b.type = 'button';
          b.dataset.role = 'xtra';
          b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      if (mode === 'panel' && note) {
        note.classList.add('mh-panelmode');
        photo.classList.add('mh-has-panel-note');
        photo.appendChild(note);
      }
      if (mode === 'hidden') content.classList.add('mh-hidden-note');
      if (mode === 'toast' && note) note.classList.add('mh-toast');
      return { stage, submit };
    },
    overlay(ctx) {
      const u = ctx.util,
        el = u.el('section', 'ds-overlay ds-overlay-' + ctx.kind, document.body);
      el.dataset.role = 'overlay';
      const texts = {
        cookie: 'We use cookies to remember your preferences.',
        toast: 'Community notices updated.',
        chat: 'Hello, neighbor. How can we help?',
        promo: 'Visit the Maple Hollow garden fair.',
        banner: 'Community meeting this evening.',
      };
      u.el('div', '', el, texts[ctx.kind]);
      const dismiss = u.el('button', '', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.addEventListener('click', () => ctx.dismiss('close'));
      return { el, dismiss, ttlSteps: ctx.kind === 'toast' ? 4 : 0 };
    },
  });
})();
