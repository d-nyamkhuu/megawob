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
  const palette = { bg: '#f3f7fd', panel: '#f8fafd', fg: '#202738', muted: '#6b7891', line: '#dce4ef' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('stream', 'instruction-' + _c.display);
      const head = u.el('header', 'topbar', document.body);
      const brand = u.el('div', 'stream-brand', head);
      icon(u.el('span', 'brand-mark', brand), 'play');
      u.el('strong', '', brand, 'StreamLite');
      const nav = u.el('nav', 'top-nav', head);
      [['video', 'Video'], ['library', 'Library'], ['heart', 'Favorites'], ['settings', 'Settings']].forEach(([glyph, label], i) => {
        const a = u.el('div', `nav-item${i === 0 ? ' active' : ''}`, nav);
        icon(a, glyph);
        u.el('span', '', a, label);
      });
      const search = u.el('div', 'searchbox', head);
      icon(search, 'search');
      u.el('span', '', search, 'Search videos');
      const header = u.el('div', 'note-host', document.body);
      Object.assign(_c, { header, topbar: head });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('task-note', 'header-note');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.topbar;
      base(_c);
      _c.header = header;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const body = u.el('div', 'player-area', document.body);
      const inspector = u.el('aside', 'inspector', body);
      const tabs = u.el('div', 'inspector-tabs', inspector);
      ['Details', 'Chapters', 'Related'].forEach((t, i) => u.el('span', i === 0 ? 'selected' : '', tabs, t));
      Object.assign(_c, { body, inspector });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.inspector;
      base(_c);
      _c.body = body;
      const note = _c.inspector.querySelector('.ref-panel');
      if (note) {
        note.classList.add('task-note', 'panel-note');
        note.prepend(_c.util.el('span', 'note-symbol', null, 'i'));
      }
      const u = _c.util;
      const item = u.el('div', 'media-item', _c.inspector);
      u.el('div', 'media-thumbnail', item);
      const info = u.el('div', 'media-info', item);
      u.el('strong', '', info, 'Coastal Horizons');
      u.el('span', '', info, 'Scenic Journeys');
      u.el('span', 'media-duration', info, '');
      const rows = u.el('div', 'detail-rows', _c.inspector);
      [
        ['Description', 'Explore stunning coastal views, charming towns, and dramatic cliffs along the Pacific coastline.'],
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
    },
    'frame.stage': () => (_c) => {
      const stage = _c.util.el('main', 'record-stage', _c.body);
      stage.dataset.role = 'stage';
      _c.body.prepend(stage);
      _c.stage = stage;
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('task-note', 'toast-note');
        note.prepend(_c.util.el('span', 'note-symbol', null, 'i'));
        note.querySelector('.ref-note-x').classList.add('note-close');
        _c.body.appendChild(note);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('end-actions');
      foot.querySelector('.ref-foot-text').textContent = 'Ready';
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
    },
    overlay: () => drawOverlay,
  };
  env.site({
    name: 'design-set-slider-media-01',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { stream: palette },
      LOW_THEME: palette,
      ACCENTS: ['#246bff'],
      LOW_ACCENTS: ['#246bff'],
      parts,
    },
  });
})();
