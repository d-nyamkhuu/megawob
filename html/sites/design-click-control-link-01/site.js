(function () {
  'use strict';
  const cfg = {
    'title': 'Notebook',
    'theme': 'electron',
    'layout': 'board',
    'tools': 'Normal Text      B    I    U     \u2039 \u203a     \u2637     \u2261      Link     Image',
  };
  env.site({
    name: 'design-click-control-link-01',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const endRng = ctx.rng.fork('chrome/end');
      const placement = endRng.pick(['footer', 'footer', 'toolbar', 'link']);
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const endWords = (
        ctx.content && ctx.content.END_LABELS
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply']
      ).map(labelOf);
      const label = placement === 'footer' ? 'Submit' : endRng.pick(endWords);
      const collideRng = ctx.rng.fork('chrome/collide');
      const collideOptions = endWords.filter(
        (x) => String(x).trim().toLowerCase() !== String(label).trim().toLowerCase(),
      );
      const collide = collideOptions.length && collideRng.bool(0.3) ? collideRng.pick(collideOptions) : null;
      let submit = null;
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, cfg.title);
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
          'a': ['Normal Text'],
          'b': ['B', 'I', 'U', 'Code'],
          'c': ['List', 'OList'],
          'd': ['Link'],
          'e': ['Image'],
        };
        const icons = {
          'Code':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m8 6-6 6 6 6 M16 6l6 6-6 6"/></svg>',
          'OList':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5h13 M9 12h13 M9 19h13 M2 3h1v4 M2 10h2v2H2v2h2 M2 17h2v4H2 M2 19h2"/></svg>',
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
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m10 14 4-4 M8 12l-3 3a4 4 0 0 0 6 6l4-4a4 4 0 0 0 0-6 M16 12l3-3a4 4 0 0 0-6-6l-4 4a4 4 0 0 0 0 6"/></svg>',
          'List':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5h14 M8 12h14 M8 19h14 M2 5h1 M2 12h1 M2 19h1"/></svg>',
          'Search':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 15l7 7 M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16"/></svg>',
          'Settings':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v3 M12 18v3 M3 12h3 M18 12h3 M5 5l3 3 M16 16l3 3 M19 5l-3 3 M8 16l-3 3 M12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8"/></svg>',
          'Help':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20 M8 8a4 4 0 0 1 8 0c0 4-4 3-4 7 M12 18h.1"/></svg>',
          'About':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2h13l4 4v16H4Z M8 9h9 M8 13h9 M8 17h9"/></svg>',
          'Reset':
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h20v14H2Z M8 21h8 M12 17v4"/></svg>',
        };
        for (const [label, items] of Object.entries(groups)) {
          const g = u.el('div', 'ribbon-group', toolbar);
          if (label) u.el('strong', 'ribbon-label', g, label);
          const row = u.el('div', 'ribbon-row', g);
          for (const item of items) {
            const b = u.el('div', 'ribbon-tool', row);
            if (icons[item]) b.innerHTML = icons[item];
            else u.el('span', 'tool-symbol', b, item.length === 1 ? item : '');
            u.el('span', '', b, item);
          }
        }
      }
      if (!ctx.finish && placement === 'toolbar') {
        const actions = u.el('div', 'chrome-actions', toolbar);
        if (collide) {
          const d = u.el('button', 'chrome-xtra', actions, String(collide));
          d.type = 'button';
          d.addEventListener('click', () => env.log('decoy', { label: String(collide), collide: true }));
        }
        submit = u.el('button', 'submit toolbar-submit', actions, label);
        submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', ctx.submit);
      } else if (!ctx.finish && collide) {
        const d = u.el('button', 'chrome-xtra toolbar-xtra', toolbar, String(collide));
        d.type = 'button';
        d.addEventListener('click', () => env.log('decoy', { label: String(collide), collide: true }));
      }
      const work = u.el('div', 'work', shell);
      if (cfg.rail) {
        const rail = u.el('nav', 'rail', work);
        cfg.rail.split('|').forEach((s, i) => u.el('div', i === 0 ? 'active' : '', rail, s));
      }
      const center = u.el('section', 'center', work);
      const note = u.el('div', 'instruction', cfg.layout === 'response' ? work : center, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
      }
      if (cfg.theme === 'electron' && ctx.display !== 'toast') head.insertBefore(note, head.querySelector('.tools'));
      const stage = u.el('div', 'stage', center);
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
        const rd = u.el('span', 'ready', foot, 'Ln 1, Col 1');
        u.el('span', 'ready-type', rd, 'Plain Text');
        u.el('span', 'saved', foot, 'Saved 10:24 AM');
      }
      if (!ctx.finish && placement !== 'toolbar') {
        submit =
          placement === 'link'
            ? u.el('a', 'submit footer-link', foot, label + ' ›')
            : u.el('button', 'submit', foot, label);
        submit.type = 'button';
        if (placement === 'link') submit.href = '#';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
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
