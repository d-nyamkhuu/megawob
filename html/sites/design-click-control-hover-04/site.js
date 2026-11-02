(function () {
  'use strict';
  const palette = { bg: '#090e12', panel: '#111820', fg: '#c4cbd6', muted: '#9aa4b3', line: '#25313d' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      // The original toast lives in the top pane, including short viewports.
      _c.display = _c.ctx.display || 'header';
      if (_c.display === 'panel' && _c.W * .98 < 1150) _c.display = 'header';
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.nav = false;
      _c.sidebar = false;
      _c.wantFooter = true;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'dark-dev');
      const shell = u.el('main', 'shell', document.body);
      const top = u.el('section', 'top', shell);
      const tl = u.el('div', 'top-left', top);
      const bar = u.el('div', 'top-bar', tl);
      u.el('span', 'dot', bar);
      u.el('span', 'tab', bar, 'HOVER TASK');
      u.el('span', 'subtitle', bar, 'Precision Interaction Test');
      const ov = u.el('aside', 'overview', top);
      u.el('div', 'task-count', top, 'Task 1 / 1');
      u.el('h2', '', ov, 'Task Overview');
      [
        ['Workspace', 'Interaction test'],
        ['Surface', 'Marked area'],
        ['Input', 'Mouse pointer'],
        ['Attempts', 'Unlimited'],
      ].forEach((r) => {
        const row = u.el('div', 'kv', ov);
        u.el('span', 'k', row, r[0]);
        // The widget still updates its legacy readout; it is not frame copy.
        const legacy = u.el('span', 'v', row);
        legacy.hidden = true;
        u.el('span', 'summary-v', row, r[1]);
      });
      if (_c.display === 'panel') {
        ov.classList.add('instruction-panel');
        ov.querySelectorAll('.kv').forEach((row) => { row.hidden = true; });
      }
      Object.assign(_c, { shell, tl, bar, ov, header: tl });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      const note = _c.header.querySelector('.ref-instruction');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
      const help = _c.util.el('div', 'help', _c.tl);
      // Preserve widget selectors without displaying its duplicated instructions.
      _c.util.el('p', '', help).hidden = true;
      _c.util.el('p', '', help).hidden = true;
      _c.util.el('div', 'help-copy', help, 'The marked area below contains the interactive workspace for this session.');
      _c.util.el('div', 'help-copy', help, 'Your progress and current status are shown in the cards beside the workspace. Use this area to review the session.');
      _c.help = help;
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.bar;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('chrome-tools');
    },
    'frame.body': () => (_c) => {
      const u = _c.util;
      const work = u.el('section', 'work', _c.shell);
      const area = u.el('div', 'area', work);
      const ah = u.el('div', 'area-head', area);
      u.el('h2', '', ah, 'Task Area');
      u.el('span', 'track', ah, 'Move tracking within the dashed region');
      const side = u.el('aside', 'side', work);
      const progress = u.el('div', 'card progress', side);
      u.el('h3', '', progress, 'Your Progress');
      u.el('div', 'progress-value', progress);
      const progressBar = u.el('div', 'progress-bar', progress);
      u.el('i', '', progressBar);
      const st = u.el('div', 'card status', side);
      u.el('h3', '', st, 'Status');
      const sr = u.el('div', 'status-row', st);
      u.el('span', 'led', sr);
      u.el('span', 'status-text', sr, 'Not hovering');
      const nt = u.el('div', 'card notes', side);
      u.el('h3', '', nt, 'Notes');
      const legacyNotes = u.el('ul', '', nt);
      legacyNotes.hidden = true;
      u.el('li', '', legacyNotes);
      u.el('li', '', legacyNotes);
      const ul = u.el('ul', '', nt);
      [
        'The workspace is contained within the dashed area.',
        'Progress information is displayed in the cards above throughout the current session.',
        'The status card reflects workspace activity.',
        'Mouse input is available.',
      ].forEach((t) => u.el('li', '', ul, t));
      Object.assign(_c, { body: work, area, side });
    },
    'frame.panel': (base) => (_c) => {
      const body = _c.body;
      _c.body = _c.ov;
      base(_c);
      _c.body = body;
      const note = _c.ov.querySelector('.ref-panel-text');
      if (note) {
        note.classList.add('instruction');
        note.dataset.display = _c.display;
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.area);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      const note = document.body.querySelector('.ref-note');
      if (note) {
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.tl.insertBefore(note, _c.help);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      if (foot) _c.side.appendChild(foot);
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.side.appendChild(dock);
    },
    overlay: () => (ctx) => {
      const el = ctx.util.el('section', 'perturb ' + ctx.kind, document.body);
      ctx.util.el(
        'strong',
        '',
        el,
        {
          cookie: 'Cookie preferences',
          toast: 'Notification',
          chat: 'Support',
          promo: 'A special offer',
          banner: 'Service notice',
        }[ctx.kind],
      );
      ctx.util.el(
        'p',
        '',
        el,
        {
          cookie: 'Choose your preferences to continue.',
          toast: 'Your workspace is ready.',
          chat: 'How can we help?',
          promo: 'Explore the latest tools.',
          banner: 'A new update is available.',
        }[ctx.kind],
      );
      const dismiss = ctx.util.el('button', 'dismiss', el, ctx.kind === 'cookie' ? 'Accept' : 'Close');
      dismiss.type = 'button';
      dismiss.addEventListener('click', ctx.dismiss);
      return { el, dismiss };
    },
  };
  env.site({
    name: 'design-click-control-hover-04',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-hover-04': palette },
      LOW_THEME: palette,
      ACCENTS: ['#6be85a'],
      LOW_ACCENTS: ['#6be85a'],
      parts,
    },
  });
})();
