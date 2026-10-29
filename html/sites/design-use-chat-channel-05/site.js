// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) => function (_c) {
      const { ctx } = _c;
      const W = window.innerWidth;
      const H = window.innerHeight;
      const roomy = W >= 1260;
      const tall = H >= 700;
      let display = ctx.display || 'header';
      if (display === 'panel' && !roomy) display = 'header';
      if (display === 'toast' && !tall) display = 'header';
      // reset() reuses the body: a previous toast must not shrink later episodes.
      document.body.classList.toggle('ref-has-note', display === 'toast');
      document.body.classList.toggle('ref-header-note', display === 'header');
      document.body.classList.toggle('ref-panel-note', display === 'panel');
      Object.assign(_c, { H, W, display, roomy, tall });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const tips = util.el('aside', 'channel-tips', body);
      util.el('span', 'channel-tips-icon', tips, 'i');
      const tipText = util.el('div', '', tips);
      util.el('b', '', tipText, 'Tips: ');
      util.el('span', '', tipText, 'Use Channel Settings to rename the channel, update the topic, and manage members. You can invite people to this channel and set up breakout rooms when you start a meeting.');

      // Library masthead and hero band above the task area (static frame text).
      const mast = util.el('header', 'ref-mast', document.body);
      const emblem = util.el('div', 'ref-mast-emblem', mast);
      emblem.innerHTML = '<svg viewBox="0 0 150 70" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.3"><path d="M6 67h139M16 65V42l17-11 18 11v23m-31-24 13-8 14 8M51 65V25l24-18 24 18v40M60 63V28h30v35M67 64V41h16v23M64 23l11-9 11 9M70 12V5h10v7M75 5V0M99 65V42l17-11 18 11v23m-31-24 13-8 14 8M10 65V51h6m118 0h7v14M24 49h5v8h-5zm12 0h5v8h-5zm73 0h5v8h-5zm12 0h5v8h-5zM66 29h5v7h-5zm13 0h5v7h-5zM55 63V31m40 0v32M20 61h25m59 0h25M5 67l5-4m130 4 5-4"/></g></svg>';
      util.el('div', 'ref-mast-brand', mast, 'Riverton University Library');
      util.el('div', 'ref-mast-search', mast, 'Search channels, people, or messages...');
      util.el('div', 'ref-mast-date', mast, 'Mon, Apr 14, 1997');
      const hero = util.el('section', 'ref-hero', document.body);
      const art = util.el('div', 'ref-hero-art', hero);
      art.setAttribute('role', 'img');
      art.setAttribute('aria-label', 'Engraved view of the university library');
      const heroText = util.el('div', 'ref-hero-text', hero);
      util.el('h1', '', heroText, 'Team Collaboration');
      util.el('p', '', heroText, 'A space for library staff to discuss projects, share updates, and coordinate our work. Use channels for focused topics, start meetings for real-time discussions, and keep our collection and community moving forward together.');
      const up = util.el('div', 'ref-upcoming', hero);
      util.el('h3', '', up, 'Upcoming Meetings');
      for (const [when, time, title] of [['Apr 14', '10:00 AM', 'Cataloging Sync'], ['Apr 15', '2:00 PM', 'Digital Archive Plan'], ['Apr 16', '11:00 AM', 'Staff Check-In']]) {
        const row = util.el('div', 'ref-upcoming-row', up);
        util.el('span', '', row, when);
        util.el('span', '', row, time);
        util.el('span', '', row, title);
      }

      // Static channel list and details column flanking the task frame (decorative frame only).
      const cols = util.el('aside', 'ref-col ref-col-left', document.body);
      util.el('h4', 'ref-channel-title', cols, 'Channels');
      util.el('span', 'ref-channel-add', cols, '+');
      for (const name of ['general', 'announcements', 'collection-care', 'digital-archive', 'field-notes', 'events', 'facilities', 'research-help']) {
        util.el('div', 'ref-col-row' + (name === 'field-notes' ? ' ref-col-active' : ''), cols, '# ' + name);
      }
      util.el('h4', 'ref-col-dm', cols, 'Direct Messages');
      for (const name of ['Ebba Nilsson', 'Oliver Peeters', 'Marcus Chen', 'Sofia Patel', 'Jonah Lee']) {
        const row = util.el('div', 'ref-col-row ref-col-member', cols);
        util.el('span', 'ref-col-chip', row, name.split(' ').map(s => s[0]).join(''));
        util.el('span', '', row, name);
      }
      const insp = util.el('aside', 'ref-col ref-col-right', document.body);
      util.el('h4', '', insp, 'Channel Details');
      util.el('div', 'ref-col-label', insp, 'Name');
      util.el('div', 'ref-col-field ref-col-name', insp, '');
      util.el('div', 'ref-col-label', insp, 'Topic');
      util.el('div', 'ref-col-field ref-col-topic', insp, '');
      util.el('h4', 'ref-members-title', insp, 'Members');
      const roster = util.el('div', 'ref-col-roster', insp);
      for (const [name, tag] of [['Marcus Chen', 'Owner'], ['Sofia Patel', ''], ['Jonah Lee', ''], ['Amara Okafor', ''], ['Lena Berg', '']]) {
        const row = util.el('div', 'ref-col-row ref-col-member', roster);
        util.el('span', 'ref-col-chip', row, name.split(' ').map(s => s[0]).join(''));
        util.el('span', '', row, name);
        if (tag) util.el('span', 'ref-col-owner', row, tag);
      }

      // The channel-era design uses a compact left rail (dock) rather than workspace rails.
      const dock = util.el('nav', 'channel-dock', document.body);
      const dockItems = [['home', 'Channels'], ['people', 'People'], ['calendar', 'Meetings'], ['file', 'Library'], ['tasks', 'Settings']];
      const dockArt = {
        home: '<path d="M2 4q6-3 11 0 6-3 12 0v21q-7-3-12 0-6-3-11 0zm2 1v17q5-2 8 0V5q-4-2-8 0zm10 0v17q5-2 9 0V5q-5-2-9 0z" fill-rule="evenodd"/>',
        people: '<circle cx="13" cy="7" r="4"/><circle cx="4" cy="10" r="3"/><circle cx="22" cy="10" r="3"/><path d="M6 23v-5c0-5 14-5 14 0v5zM0 22v-5c0-3 5-5 7-2l-3 7zM22 22l-3-7c2-3 7-1 7 2v5z"/>',
        calendar: '<path fill-rule="evenodd" d="M3 5h20v20H3zm3 6v3h3v-3zm5 0v3h3v-3zm5 0v3h3v-3zm-10 5v3h3v-3zm5 0v3h3v-3zm5 0v3h3v-3z"/><path d="M6 2h3v6H6zm11 0h3v6h-3z"/>',
        file: '<path fill-rule="evenodd" d="M2 3q6-3 11 0 6-3 12 0v23q-7-3-12 0-6-3-11 0zm3 2v17q4-1 7 0V5q-4-2-7 0zm9 0v17q4-1 8 0V5q-4-2-8 0z"/><path d="M6 8h4m-4 4h4m-4 4h4m6-8h4m-4 4h4m-4 4h4" stroke="currentColor"/>',
        tasks: '<path fill-rule="evenodd" d="m11 1 6 0 1 4 3 2 4-1 3 5-3 3 0 3 3 3-3 5-4-1-3 2-1 4h-6l-1-4-3-2-4 1-3-5 3-3v-3l-3-3 3-5 4 1 3-2zm3 8a6 6 0 1 0 0 12 6 6 0 0 0 0-12z"/>',
        help: '<circle cx="14" cy="14" r="12"/><path d="M10 10c0-6 10-6 9 0 0 3-5 3-5 7m0 2v3" fill="none" stroke="#587fa8" stroke-width="3"/>',
      };
      for (const [icon, title] of dockItems) {
        const item = util.el('div', 'channel-dock-item', dock);
        const svg = util.svg('svg', { viewBox: '0 0 28 28', width: 28, height: 28, 'aria-hidden': 'true' }, item);
        svg.innerHTML = dockArt[icon];
        util.el('span', '', item, title);
      }
      Object.assign(_c, { dock, dockArt, dockItems, stage, tipText, tips });
    },
    'frame.end': (base, S) => function (_c) {
      const mast = document.querySelector('.ref-mast');
      if (_c.display !== 'header' && _c.headerTools && mast) mast.append(_c.headerTools);
      return base(_c);
    },
  };

  env.site({
    name: 'design-use-chat-channel-05',
    template: 'site/base',
    design: { parts },
  });
})();
