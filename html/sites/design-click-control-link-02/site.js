(function () {
  'use strict';
  const cfg = {
    'title': 'DocuWork',
    'theme': 'bauhaus',
    'layout': 'board',
    'tools':
      'File     New   Open   Save       Edit     Undo   Redo   Copy   Cut   Paste       Format     B   I   U       Insert     Image   Link   List',
  };
  env.site({
    name: 'design-click-control-link-02',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, cfg.title);
      if (cfg.theme === 'bauhaus') {
        const sw = u.el('span', 'swatches', head);
        u.el('i', '', sw);
        u.el('i', 'dark', sw);
        u.el('i', 'line', sw);
      }
      if (['qt', 'openlook', 'win92', 'clearlooks', 'industrial', 'electron', 'yosemite'].includes(cfg.theme)) {
        const controls = u.el('span', 'window-controls', title);
        controls.innerHTML =
          '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      }
      if (cfg.tools) u.el('div', 'tools', head, cfg.tools);
      if (cfg.overview) {
        const ov = u.el('section', 'overview', shell);
        cfg.overview.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', ov, s));
      }
      const toolbar = head.querySelector('.tools');
      if (toolbar) {
        toolbar.textContent = '';
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
      const work = u.el('div', 'work', shell);
      if (cfg.rail) {
        const rail = u.el('nav', 'rail', work);
        cfg.rail.split('|').forEach((s, i) => u.el('div', i === 0 ? 'active' : '', rail, s));
      }
      const center = u.el('section', 'center', work);
      const dimensions = ctx.size || {};
      let display = ctx.display || 'header';
      if (display === 'panel' && (dimensions.width || dimensions.w || window.innerWidth) < 1180) display = 'header';
      const note = u.el('div', 'instruction', cfg.layout === 'response' ? work : center, ctx.instruction);
      u.el('div', 'instruction-subtitle', note, 'Read the notes below and open the requested link.');
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display === 'toast') {
        note.classList.add('instruction-toast');
      }
      const stage = u.el('div', 'stage', center);
      if (display === 'panel') {
        const taskPanel = u.el('aside', 'episode-panel', work);
        u.el('div', 'episode-panel-title', taskPanel, 'Task note');
        taskPanel.appendChild(note);
        note.classList.add('panel-note');
      }
      let aside = null;
      if (cfg.side) {
        aside = u.el('aside', 'inspector', work);
        cfg.side.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', aside, s));
      }
      if (cfg.layout === 'console' && aside && ctx.display !== 'toast') {
        aside.insertBefore(note, aside.children[1] || null);
      }
      const foot = u.el('footer', 'footer', shell);
      if (cfg.foot) {
        const dock = u.el('div', 'dock-sections', foot);
        cfg.foot.split('|').forEach((s) => {
          const d = u.el('section', 'dock-section', dock);
          u.el('strong', '', d, s);
          if (cfg.theme === 'qt') {
            if (s === 'Task List') {
              ['1.  Click requested control', '2.  Review result', '3.  Submit', '4.  Finish'].forEach((t, i) =>
                u.el('div', i === 0 ? 'current-task' : 'task-row', d, t),
              );
            } else if (s === 'Status') {
              ['Current Step:     1 of 4', 'Status:    Not completed', 'Attempts:    0', 'Result:    —'].forEach((t) =>
                u.el('div', 'status-row', d, t),
              );
            } else if (s === 'Notes') {
              u.el('div', 'dock-note', d, 'Follow the instruction above.');
            }
          }
        });
      } else {
        u.el('span', 'ready', foot, 'Ready');
        u.el('span', 'docname', foot, 'Document: Project_Notes');
      }
      let submit = null;
      if (!ctx.finish) {
        const endR = ctx.rng.fork('chrome/end');
        const keepReference = endR.bool(0.5);
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
        )
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name))
          .filter(Boolean);
        const label = keepReference ? 'Submit' : endR.pick(labels);
        const placement = keepReference ? 'button' : endR.pick(['link', 'icon']);
        const parent =
          cfg.layout === 'response'
            ? work
            : cfg.layout === 'inspector' || cfg.layout === 'console'
              ? aside || note
              : foot;
        const endParent =
          cfg.theme === 'qt' && cfg.layout === 'dock' ? foot.querySelector('.dock-section:last-child') : parent;
        const cr = ctx.rng.fork('chrome/collide');
        const bank = (
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
        )
          .map((x) => (typeof x === 'string' ? x : x.label || x.text || x.name))
          .filter(Boolean);
        const collisionOptions = [...new Set(bank)].filter(
          (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
        );
        if (cr.bool(0.3) && collisionOptions.length) {
          const decoy = u.el('button', 'end-xtra', endParent, cr.pick(collisionOptions));
          decoy.type = 'button';
          decoy.addEventListener('click', () => env.log('decoy', { label: decoy.textContent, collide: true }));
        }
        if (placement === 'link') {
          submit = u.el('a', 'submit end-link', endParent, label + ' ›');
          submit.href = '#';
          submit.addEventListener('click', (e) => {
            e.preventDefault();
            ctx.submit();
          });
        } else {
          submit = u.el(
            'button',
            'submit' + (placement === 'icon' ? ' end-icon' : ''),
            endParent,
            placement === 'icon' ? '✓' : label,
          );
          submit.type = 'button';
          if (placement === 'icon') {
            submit.setAttribute('aria-label', label);
            submit.title = label;
          }
          submit.addEventListener('click', ctx.submit);
        }
      }
      return { stage, submit };
    },
    overlay(ctx) {
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
  });
})();
