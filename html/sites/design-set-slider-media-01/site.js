/* StreamLite: full-width media workspace with a compact details inspector. */
(function () {
  'use strict';
  function icon(parent, name) {
    const u = env.util;
    const svg = u.svg(
      'svg',
      {
        viewBox: '0 0 24 24',
        class: 'app-icon',
        'aria-hidden': 'true',
        fill: 'none',
        stroke: 'currentColor',
        'stroke-width': 1.8,
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      },
      parent,
    );
    const paths = {
      play: 'M8 5l11 7-11 7Z',
      video: 'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
      library: 'M3 8V5a2 2 0 0 1 2-2h5l3 3h6a2 2 0 0 1 2 2v12H3V8Zm0 0h18',
      heart: 'M12 21 3.6 13A5.5 5.5 0 0 1 12 5.9 5.5 5.5 0 0 1 20.4 13Z',
      settings:
        'm10 2-.6 2.5-2.1.9L5 4.1 2.8 7.9l1.8 1.7-.3 2.4L2 13l1.5 4.2 2.5-.3 1.7 1.7-.3 2.5 4.2 1.1 1-2.3 2.4-.3 1.7 1.8 3.8-2.2-1.3-2.3.9-2.1 2.5-.6v-4.4l-2.5-.6-.9-2.1 1.3-2.3-3.8-2.2-1.7 1.8-2.4-.3L12 2Z',
      search: 'M16 16l5 5M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
    };
    u.svg('path', { d: paths[name] || paths.play }, svg);
    if (name === 'settings') u.svg('circle', { cx: 12, cy: 12, r: 3.4 }, svg);
    if (name === 'video') {
      svg.firstChild.setAttribute('fill', 'currentColor');
      u.svg('path', { d: 'm10 8 6 4-6 4Z', fill: '#fff', stroke: 'none' }, svg);
    }
    return svg;
  }
  function drawOverlay(ctx) {
    const u = ctx.util;
    const el = u.el('aside', 'stream-overlay overlay-' + ctx.kind, document.body);
    el.setAttribute('role', 'dialog');
    if (ctx.kind === 'banner') {
      const header = document.querySelector('.header-note:not([hidden])') || document.querySelector('.topbar');
      el.style.top = Math.ceil(header.getBoundingClientRect().bottom + 8) + 'px';
    }
    const dismiss = (reason) => ctx.dismiss(reason);
    const title =
      {
        chat: 'StreamLite Support',
        cookie: 'We use cookies to improve your experience.',
        toast: 'Your video is ready',
        promo: 'Discover more with StreamLite',
        banner: 'A better viewing experience is here',
      }[ctx.kind] || 'StreamLite';
    const copy = {
      chat: 'Hi there! How can we help you today?',
      cookie: 'We use cookies to personalize content, analyze traffic, and provide a better experience.',
      toast: 'Enjoy your next journey with StreamLite.',
      promo: 'Get the latest films and scenic journeys delivered to your inbox.',
      banner: 'Explore our newest collection of scenic journeys.',
    }[ctx.kind];
    if (ctx.kind === 'cookie') u.el('span', 'overlay-symbol', el, '🍪');
    const content = u.el('div', 'overlay-content', el);
    u.el('h2', '', content, title);
    u.el('p', '', content, copy);
    const closeButton = u.el('button', 'overlay-dismiss', el, 'Dismiss');
    closeButton.type = 'button';
    closeButton.onclick = () => dismiss('dismiss');
    const x = u.el('button', 'overlay-x', el, '×');
    x.type = 'button';
    x.title = 'Close';
    x.setAttribute('aria-label', 'Close notice');
    x.onclick = () => dismiss('close');
    return { el, dismiss: closeButton, ttlSteps: ctx.kind === 'toast' ? 5 : 0 };
  }
  env.site({
    name: 'design-set-slider-media-01',
    styles: ['site.css'],
    scripts: [],
    frame(ctx) {
      const u = ctx.util;
      const endRng = ctx.rng.fork('chrome/end');
      const placement = endRng.pick(['footer', 'footer', 'header', 'note']);
      const endLabels = ctx.content && ctx.content.END_LABELS;
      const endLabel = endRng.pick(
        Array.isArray(endLabels) && endLabels.length
          ? endLabels
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"],
      );
      const sampledLabel =
        typeof endLabel === 'string' ? endLabel : endLabel.label || endLabel.text || endLabel.name || String(endLabel);
      const label = placement === 'footer' ? 'OK' : placement === 'note' ? "I'm done" : sampledLabel;
      const collideRng = ctx.rng.fork('chrome/collide');
      const collisionPool = (
        Array.isArray(endLabels) && endLabels.length
          ? endLabels
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"]
      )
        .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)))
        .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
      const collision = collideRng.bool(0.3) && collisionPool.length ? collideRng.pick(collisionPool) : null;
      document.body.className = `stream instruction-${ctx.display}${!ctx.finish && placement !== 'header' ? ' has-footer-control' : ''}`;
      const head = u.el('header', 'topbar', document.body);
      const brand = u.el('div', 'stream-brand', head);
      icon(u.el('span', 'brand-mark', brand), 'play');
      u.el('strong', '', brand, 'StreamLite');
      const nav = u.el('nav', 'top-nav', head);
      [
        ['video', 'Video'],
        ['library', 'Library'],
        ['heart', 'Favorites'],
        ['settings', 'Settings'],
      ].forEach(([glyph, label], i) => {
        const a = u.el('div', `nav-item${i === 0 ? ' active' : ''}`, nav);
        icon(a, glyph);
        u.el('span', '', a, label);
      });
      const search = u.el('div', 'searchbox', head);
      icon(search, 'search');
      u.el('span', '', search, 'Search videos');
      let submit = null;
      const makeSubmit = (parent, cls, text) => {
        const b = u.el('button', cls, parent, text);
        b.type = 'button';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.onclick = () => ctx.submit();
        return b;
      };
      if (!ctx.finish && placement === 'header') submit = makeSubmit(head, 'primary header-submit', label);
      const note = u.el('div', 'task-note', document.body);
      u.el('span', 'note-symbol', note, 'i');
      u.el('span', 'note-text', note, ctx.instruction);
      if (ctx.display === 'hidden') note.hidden = true;
      if (ctx.display === 'header') note.classList.add('header-note');
      const main = u.el('div', 'player-area', document.body);
      const stage = u.el('main', 'record-stage', main);
      stage.dataset.role = 'stage';
      const inspector = u.el('aside', 'inspector', main);
      const tabs = u.el('div', 'inspector-tabs', inspector);
      ['Details', 'Chapters', 'Related'].forEach((t, i) => u.el('span', i === 0 ? 'selected' : '', tabs, t));
      if (ctx.display === 'panel') {
        note.classList.add('panel-note');
        inspector.append(note);
      }
      const item = u.el('div', 'media-item', inspector);
      u.el('div', 'media-thumbnail', item);
      const info = u.el('div', 'media-info', item);
      u.el('strong', '', info, 'Coastal Horizons');
      u.el('span', '', info, 'Scenic Journeys');
      u.el('span', 'media-duration', info, '');
      const rows = u.el('div', 'detail-rows', inspector);
      [
        [
          'Description',
          'Explore stunning coastal views, charming towns, and dramatic cliffs along the Pacific coastline.',
        ],
        ['Location', 'Big Sur, California'],
        ['Category', 'Travel'],
        ['Resolution', '1920 × 1080'],
        ['Frame rate', '24 fps'],
        ['Audio', 'Stereo'],
        ['Size', '284 MB'],
      ].forEach(([a, b]) => {
        const row = u.el('div', 'detail-row', rows);
        u.el('span', '', row, a);
        u.el('b', '', row, b);
      });
      if (ctx.display === 'toast') {
        note.classList.add('toast-note');
        main.append(note);
      }
      if (ctx.display === 'toast') {
        const close = u.el('button', 'note-close', note, '×');
        close.onclick = () => {
          note.hidden = true;
        };
      }
      const actions = u.el('div', 'end-actions', document.body);
      if (ctx.finish) actions.hidden = true;
      if (!ctx.finish && placement === 'footer') submit = makeSubmit(actions, 'footer-submit', label);
      if (!ctx.finish && placement === 'note') {
        submit = u.el('a', 'footer-submit end-link', actions, label);
        submit.href = '#';
        submit.dataset.role = 'submit';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.onclick = (e) => {
          e.preventDefault();
          ctx.submit();
        };
      }
      if (!ctx.finish && collision) {
        const decoy = u.el('button', 'end-xtra', actions, collision);
        decoy.type = 'button';
        decoy.dataset.role = 'xtra';
        decoy.onclick = () => env.log('decoy', { label: collision, collide: true });
      }
      return { stage, submit };
    },
    overlay: drawOverlay,
  });
})();
