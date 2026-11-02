(function () {
  'use strict';

  function drawRibbon(u, toolbar) {
        const groups = {
          'File': ['New', 'Open', 'Save'],
          'Edit': ['Undo', 'Redo', 'Copy', 'Cut', 'Paste'],
          'Format': ['Heading 2', 'B', 'I', 'U', 'A'],
          'Insert': ['Image', 'Link', 'List'],
          'View': ['Zoom', 'Full Screen'],
        };
        const icons = {
          'New':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2h8l4 4v14H4Z M12 2v5h4"/></svg>',
          'Open':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 6h7l2 3h10l-3 11H3Z M3 7V4h7l2 3"/></svg>',
          'Save':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2h15l3 3v17H3Z M7 2v7h10V2 M7 14h10v8"/></svg>',
          'Undo':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5 3 10l5 5 M3 10h10q8 0 7 9"/></svg>',
          'Redo':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 5 21 10l-5 5 M21 10H11q-8 0-7 9"/></svg>',
          'Cut':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 10 19 2 M7 14 19 22 M8 9a4 4 0 1 1-1-3 M8 15a4 4 0 1 0-1 3"/></svg>',
          'Copy':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3h11v15H8Z M4 7H2v15h11v-2"/></svg>',
          'Paste':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3H3v19h18V3h-4 M8 1h8v5H8Z"/></svg>',
          'Image':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h20v18H2Z M4 18l5-7 4 5 3-3 5 5 M15 8h.1"/></svg>',
          'Link':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 15-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0 M15 9l2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0 M8 16l8-8"/></svg>',
          'List':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 5h15 M7 12h15 M7 19h15 M1 5h2 M1 12h2 M1 19h2"/></svg>',
          'Search':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 15l7 7 M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16"/></svg>',
          'Zoom':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 15l7 7 M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16"/></svg>',
          'Full Screen':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8V3h5 M16 3h5v5 M21 16v5h-5 M8 21H3v-5"/></svg>',
          'Settings':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3 M12 18v3 M3 12h3 M18 12h3 M5 5l3 3 M16 16l3 3 M19 5l-3 3 M8 16l-3 3 M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8"/></svg>',
          'Help':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20 M8 8a4 4 0 0 1 8 0c0 4-4 3-4 7 M12 18h.1"/></svg>',
          'About':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2h13l4 4v16H4Z M8 9h9 M8 13h9 M8 17h9"/></svg>',
          'Reset':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h20v14H2Z M8 21h8 M12 17v4"/></svg>',
        };
        icons['Open'] =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8V5h6l3 3h9v12H3Z M3 10h18"/></svg>';
        icons['Copy'] =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 6H4v16h14V6Z M8 6V3h6v3 M18 8h3v12h-3"/></svg>';
        icons['Paste'] =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5H5v17h12V9Z M9 5V2h9l3 3v13h-4 M9 5h6l2 4 M9 12h5 M9 16h5"/></svg>';
        icons['Cut'] =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 16 19 3 M16 16 5 3 M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0 M21 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/></svg>';
        icons['Link'] =
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 15l6-6 M8 16l-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0 M16 8l1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0"/></svg>';
        for (const [label, items] of Object.entries(groups)) {
          const g = u.el('div', 'ribbon-group', toolbar);
          if (label) u.el('strong', 'ribbon-label', g, label);
          const row = u.el('div', 'ribbon-row', g);
          for (const item of items) {
            const b = u.el('div', 'ribbon-tool', row);
            b.dataset.tool = item;
            if (item === 'Heading 2') {
              b.classList.add('tool-select');
              u.el('span', 'tool-symbol', b, 'Heading 2');
            } else if (icons[item]) b.innerHTML = icons[item];
            else u.el('span', 'tool-symbol', b, item.length === 1 ? item : '');
            u.el('span', '', b, item);
          }
        }
  }

  function decorateNote(u, note, display) {
    if (!note) return;
    note.classList.add('instruction');
    note.dataset.display = display;
    u.el('div', 'instruction-subtitle', note, 'Read the notes below and open the requested link.');
  }

  const palette = { bg: '#faf7ef', panel: '#faf7ef', fg: '#000000', muted: '#515b6a', line: '#cccccc' };
  const parts = {
    'frame.layout': (base) => (_c) => {
      base(_c);
      _c.display = _c.ctx.display || 'header';
      if (_c.display === 'panel' && _c.W < 1180) _c.display = 'header';
      document.body.classList.toggle('ref-has-note', _c.display === 'toast');
    },
    'frame.placement': (base) => (_c) => {
      base(_c);
      _c.wantFooter = true;
      _c.nav = false;
      _c.sidebar = false;
    },
    'frame.header': () => (_c) => {
      const u = _c.util;
      document.body.classList.add('ref', 'bauhaus', 'board');
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, 'DocuWork');
      const sw = u.el('span', 'swatches', head);
      u.el('i', '', sw);
      u.el('i', 'dark', sw);
      u.el('i', 'line', sw);
      const toolbar = u.el('div', 'tools', head);
      drawRibbon(u, toolbar);
      // Construct the document area early so the template can place its header note here.
      const work = u.el('div', 'work');
      const center = u.el('section', 'center', work);
      Object.assign(_c, { shell, title, work, center, header: center });
    },
    'frame.nav': () => () => {},
    'frame.instruction': (base) => (_c) => {
      base(_c);
      decorateNote(_c.util, _c.header.querySelector('.ref-instruction'), _c.display);
    },
    'frame.tools': (base) => (_c) => {
      const header = _c.header;
      _c.header = _c.title;
      base(_c);
      _c.header = header;
      _c.headerTools.classList.add('title-tools');
    },
    'frame.body': () => (_c) => {
      _c.shell.appendChild(_c.work);
      _c.body = _c.work;
    },
    'frame.panel': (base) => (_c) => {
      base(_c);
      const panel = _c.body.querySelector('.ref-panel');
      if (panel) {
        panel.classList.add('episode-panel');
        const title = panel.querySelector('.ref-panel-title');
        title.classList.add('episode-panel-title');
        title.textContent = 'Task note';
        const note = panel.querySelector('.ref-panel-text');
        decorateNote(_c.util, note, _c.display);
        note.classList.add('panel-note');
      }
    },
    'frame.stage': () => (_c) => {
      _c.stage = _c.util.el('div', 'stage', _c.center);
    },
    'frame.toast': (base) => (_c) => {
      base(_c);
      if (_c.display === 'toast') {
        const note = document.body.querySelector('.ref-note');
        note.classList.add('instruction', 'instruction-toast');
        note.dataset.display = _c.display;
        _c.center.insertBefore(note, _c.stage);
      }
    },
    'frame.footer': (base) => (_c) => {
      base(_c);
      const foot = document.body.querySelector('.ref-foot');
      foot.classList.add('footer');
      _c.shell.appendChild(foot);
      const ready = foot.querySelector('.ref-foot-text');
      ready.classList.add('ready');
      ready.textContent = 'Ready';
      const doc = _c.util.el('span', 'docname', null, 'Document: Project_Notes');
      foot.insertBefore(doc, foot.querySelector('.ref-tools'));
      _c.foot = foot;
    },
    'frame.floating': (base) => (_c) => {
      base(_c);
      const dock = document.body.querySelector('.ref-float-dock');
      if (dock) _c.foot.appendChild(dock);
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
    name: 'design-click-control-link-02',
    template: 'site/base',
    langs: ['en'],
    styles: ['templates/site/css/base-hooks.css', 'site.css'],
    design: {
      THEMES: { 'design-click-control-link-02': palette },
      LOW_THEME: palette,
      ACCENTS: ['#0054ed'],
      LOW_ACCENTS: ['#0054ed'],
      parts,
    },
  });
})();
