(function () {
  'use strict';
  const palette = { bg: '#eeeddf', panel: '#fff', fg: '#101827', muted: '#59606a', line: '#bec2c4' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original has a dedicated note card even at compact viewports.
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
      const u = _c.util, body = document.body;
      const top = u.el('header', 'xp-title', body);
      u.el('span', 'xp-appicon', top, '▣');
      u.el('strong', 'xp-appname', top, 'Photo Organizer');
      const win = u.el('div', 'xp-window', top);
      ['−', '□', '×'].forEach((x, i) => u.el('span', 'xp-windowbtn ' + (i === 2 ? 'close' : ''), win, x));
      const menu = u.el('nav', 'xp-menu', body);
      ['File', 'Edit', 'View', 'Tools', 'Help'].forEach((x) => u.el('span', '', menu, x));
      const tools = u.el('div', 'xp-toolbar', body);
      [ ['▰', 'Add Photos'], ['×', 'Remove'], ['↶', 'Rotate Left'], ['↷', 'Rotate Right'], ['◆', 'Tag'], ['▣', 'Properties'] ].forEach((item, i) => {
        if (i === 2 || i === 4) u.el('i', 'xp-separator', tools);
        const b = u.el('button', 'xp-tool', tools);
        b.type = 'button';
        u.el('b', '', b, item[0]);
        u.el('span', '', b, item[1]);
      });
      const note = u.el('aside', 'xp-instruction');
      note.dataset.display = _c.display;
      note.hidden = _c.display === 'hidden';
      u.el('div', 'xp-clockface', note, '◷');
      const noteText = u.el('div', 'xp-notecontent', note);
      Object.assign(_c, { tools, note, header: noteText });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const text = _c.header.querySelector('.ref-instruction');
      if (text) text.classList.add('xp-prompt');
    },
    'frame.tools': (base) => (_c) => {
      const h = _c.header;
      _c.header = _c.tools;
      base(_c);
      _c.header = h;
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const workspace = u.el('main', 'xp-stage', document.body);
      // Keep the task stage first in the workspace, as in the original.
      const stage = u.el('div', 'xp-skin-stage', workspace);
      const table = u.el('section', 'xp-ledger', workspace);
      const heads = u.el('div', 'xp-headrow', table);
      ['Name', 'Date Taken', 'Size', 'Type', 'Tag'].forEach((x) => u.el('span', '', heads, x));
      const rows = [
        ['Beach.jpg', '7/12/2008 10:24 AM', '2.4 MB', 'JPEG Image', 'Vacation'],
        ['Forest.jpg', '6/3/2008 4:17 PM', '1.8 MB', 'JPEG Image', 'Nature'],
        ['City.jpg', '5/21/2008 2:03 PM', '2.1 MB', 'JPEG Image', 'Trip'],
        ['Family.jpg', '4/6/2008 11:20 AM', '1.6 MB', 'JPEG Image', 'Family'],
        ['Mountains.jpg', '3/14/2008 9:15 AM', '2.8 MB', 'JPEG Image', 'Nature'],
        ['Dog.jpg', '2/2/2008 1:10 PM', '1.1 MB', 'JPEG Image', 'Pets'],
        ['Sunset.jpg', '1/27/2008 6:43 AM', '2.0 MB', 'JPEG Image', 'Nature'],
        ['Garden.jpg', '12/11/2007 3:36 PM', '1.5 MB', 'JPEG Image', 'Outdoors'],
      ];
      rows.forEach((r, i) => {
        const row = u.el('div', 'xp-row' + (i === 0 ? ' selected' : ''), table);
        u.el('span', 'xp-thumb', row, ['▧', '▨', '▧', '▦'][i % 4]);
        r.forEach((v) => u.el('span', '', row, v));
      });
      const preview = u.el('aside', 'xp-preview', workspace);
      const pbar = u.el('div', 'xp-previewbar', preview);
      u.el('b', '', pbar, 'Preview');
      const close = u.el('button', 'xp-previewclose', pbar, '×');
      close.type = 'button';
      const landscape = u.el('div', 'xp-landscape', preview);
      u.el('div', 'xp-island', landscape);
      u.el('div', 'xp-caption', preview, 'Beach.jpg');
      u.el('div', 'xp-caption', preview, '2.4 MB');
      u.el('div', 'xp-caption', preview, '7/12/2008 10:24 AM');
      workspace.appendChild(_c.note);
      Object.assign(_c, { body: workspace, stage });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.header;
      base(_c);
      _c.body = body;
      const panel = _c.header.querySelector('.ref-panel-text');
      if (panel) panel.classList.add('xp-prompt');
    },
    'frame.stage': () => () => {},
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        _c.header.appendChild(note);
        note.querySelector('.ref-note-text').classList.add('xp-prompt');
      }
      if (_c.display !== 'hidden') {
        const u = _c.util;
        u.el('div', 'xp-subtext', _c.header, 'The Start button will become enabled on the task clock.');
        const readout = u.el('div', 'xp-readout', _c.header);
        u.el('span', '', readout, 'Task clock:');
        // Decorative readout must not advertise a task target outside the note.
        u.el('span', 'xp-time', readout, '--:--');
        u.el('span', 'xp-status', readout, 'Status: Waiting for start time…');
      }
    },
    'frame.footer': (base) => (_c) => {
      const u = _c.util;
      const endbar = u.el('footer', 'xp-endbar', document.body);
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) endbar.appendChild(foot);
      const taskbar = u.el('footer', 'xp-taskbar', document.body);
      const osStart = u.el('button', 'xp-os-start', taskbar);
      u.el('span', 'xp-windows-logo', osStart);
      u.el('span', '', osStart, 'start');
      const task = u.el('button', 'xp-taskitem', taskbar);
      u.el('span', 'xp-taskicon', task, '▣');
      u.el('span', '', task, 'Photo Organizer');
      const tray = u.el('div', 'xp-tray', taskbar);
      u.el('span', '', tray, '▣  ▪  ◖');
      u.el('time', '', tray, '10:24 AM');
      _c.endbar = endbar;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.endbar.appendChild(dock);
    },
    overlay: () => (ctx) => {
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
  };
  env.site({
    name: 'design-act-in-time-delay-07',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-act-in-time-delay-07': palette },
      LOW_THEME: palette,
      ACCENTS: ['#075bd5'],
      LOW_ACCENTS: ['#075bd5'],
      parts,
    },
  });
})();
