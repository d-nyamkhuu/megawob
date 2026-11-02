(function () {
  'use strict';
  const palette = { bg: '#f7f3e9', panel: '#fffdf7', fg: '#101b33', muted: '#28364b', line: '#aab9cf' };
  const hourglass = (u, note) => {
    const icon = u.el('span', 'mh-hourglass', null, '⌛');
    note.prepend(icon);
  };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      if (document.activeElement && document.activeElement !== document.body) document.activeElement.blur();
      const selection = window.getSelection();
      if (selection) selection.removeAllRanges();
      const u = _c.util;
      const shell = u.el('div', 'mh-body', document.body);
      const rail = u.el('aside', 'mh-rail', shell);
      u.el('div', 'mh-leaf', rail, '🍁');
      u.el('div', 'mh-railbrand', rail, 'Maple Hollow Online');
      [ ['⌂', 'Home'], ['▤', 'News'], ['👥', 'Members'], ['▣', 'Events'],
        ['📷', 'Photos'], ['☏', 'Forums'], ['▣', 'Links'], ['⚙', 'Settings'] ].forEach(([i, t]) => {
        const a = u.el('a', 'mh-nav', rail);
        u.el('span', 'mh-icon', a, i);
        u.el('span', '', a, t);
      });
      const content = u.el('div', 'mh-content', shell);
      const mast = u.el('header', 'mh-mast', content);
      u.el('div', 'mh-trees mh-lefttrees', mast);
      const title = u.el('div', 'mh-title', mast);
      u.el('h1', '', title, 'Maple Hollow');
      u.el('div', 'mh-subtitle', title, 'Community Page');
      u.el('div', 'mh-motto', title, 'Neighbors　🍁　Friends　🍁　A Brighter Tomorrow');
      u.el('div', 'mh-trees mh-righttrees', mast);
      const date = u.el('div', 'mh-date', mast);
      u.el('div', '', date, 'Mon, Apr 14, 1996');
      u.el('div', '', date, 'Local Time: 10:24 AM　☀️');
      const header = u.el('div', 'mh-note-slot', content);
      if (_c.display === 'header') {
        header.classList.add('mh-note');
        hourglass(u, header);
      }
      const right = u.el('div', 'mh-rightcol');
      right.dataset.end = _c.ctx.finish ? 'finish' : ['header', 'icon'].includes(_c.placement) ? 'controls' : _c.placement;
      const endpanel = u.el('section', 'mh-panel mh-controls', right);
      u.el('h2', '', endpanel, 'Task Controls');
      const endrow = u.el('div', 'mh-endrow', endpanel);
      const railTools = u.el('div', 'mh-rail-tools', rail);
      Object.assign(_c, { shell, rail, railTools, content, header, right, endpanel, endrow });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) note.classList.add('mh-instruction');
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.endrow;
      base(_c);
      _c.header = header;
      // Auxiliary controls live in the original navigation rail.
      _c.headerTools.querySelectorAll('.ref-xtra').forEach((b) => _c.railTools.appendChild(b));
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      u.el('div', 'mh-divider', _c.content);
      const body = u.el('div', 'mh-grid', _c.content);
      const photo = u.el('section', 'mh-panel mh-photo', body);
      u.el('h2', '', photo, 'Community Photo Archive');
      const photoBody = u.el('div', 'mh-photo-body', photo);
      u.el('div', 'mh-lake', photoBody, '');
      const details = u.el('div', 'mh-details', photoBody);
      [ ['Photo:', 'Sunset at Maple Lake'], ['Added by:', 'RiverDan'],
        ['Date:', 'Apr 14, 1996'], ['Views:', '128'] ].forEach(([a, b]) => {
        const row = u.el('div', 'mh-detail', details);
        u.el('span', '', row, a);
        u.el('span', '', row, b);
      });
      body.appendChild(_c.right);
      Object.assign(_c, { body, photo });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.photo;
      base(_c);
      _c.body = body;
      const panel = _c.photo.querySelector('.ref-panel');
      if (panel) {
        _c.photo.classList.add('mh-has-panel-note');
        panel.classList.add('mh-note', 'mh-panelmode');
        panel.querySelector('.ref-panel-text').classList.add('mh-instruction');
        hourglass(_c.util, panel);
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('main', 'ds-stage mh-task');
      _c.right.prepend(_c.stage);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('mh-note', 'mh-toast');
        note.querySelector('.ref-note-text').classList.add('mh-instruction');
        hourglass(_c.util, note);
        _c.content.insertBefore(note, _c.content.querySelector('.mh-divider'));
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const footer = u.el('footer', 'mh-footer', _c.content);
      u.el('span', 'mh-footnote', footer, '🌲　A Small Town Makes a Big Difference　🌲');
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      footer.appendChild(foot);
      foot.querySelectorAll('.ref-xtra').forEach((b) => _c.railTools.appendChild(b));
      // The original link placement was in the navigation rail.
      const link = foot.querySelector('.ref-endlink');
      if (link) _c.railTools.appendChild(link);
      const tables = u.el('div', 'mh-tables', _c.content);
      const posts = u.el('section', 'mh-panel mh-posts', tables);
      u.el('h2', '', posts, 'Recent Community Posts');
      const posttable = u.el('table', '', posts);
      posttable.innerHTML = '<thead><tr><th>Subject</th><th>Author</th><th>Replies</th><th>Last Post</th></tr></thead><tbody><tr><td><a>Spring Cleanup This Saturday</a></td><td>Maple_Lee</td><td>4</td><td>Apr 14, 10:02 AM</td></tr><tr><td><a>Best Hiking Trails Nearby?</a></td><td>TrailScout</td><td>7</td><td>Apr 13, 6:18 PM</td></tr><tr><td><a>Sharing Garden Tips</a></td><td>GreenThumb</td><td>3</td><td>Apr 12, 9:41 AM</td></tr></tbody>';
      const events = u.el('section', 'mh-panel mh-events', tables);
      u.el('h2', '', events, 'Community Events');
      const ev = u.el('table', '', events);
      ev.innerHTML = '<thead><tr><th>Date</th><th>Event</th><th>Location</th></tr></thead><tbody><tr><td>Apr 20, 1996</td><td>Riverside Clean-Up</td><td>Maple Lake</td></tr><tr><td>Apr 26, 1996</td><td>Community Potluck</td><td>Town Hall</td></tr><tr><td>May 3, 1996</td><td>Plant a Tree Day</td><td>Riverside Park</td></tr></tbody>';
      _c.foot = footer;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.railTools.appendChild(dock);
    },
    overlay: () => (ctx) => {
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
  };
  env.site({
    name: 'design-act-in-time-delay-06',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-delay-06': palette },
      LOW_THEME: palette,
      ACCENTS: ['#061f71'],
      LOW_ACCENTS: ['#061f71'],
      parts,
    },
  });
})();
