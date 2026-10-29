(function () {
  'use strict';
  const cfg = {
    'title': 'The Daily Chronicle',
    'theme': 'news',
    'layout': 'dock',
    'tools':
      'News　　 Business　　 Opinion　　 Life　　 Sports　　 Arts　　 More ▾　　　　　　 Tuesday, March 22, 2011　　 Sign In　|　Register　　 Search articles...　 🔍',
    'rail': 'Tools|➤　Pointer|▦　Keyboard|●　Wheel|Help|❔　Task Help|Contact Support',
    'side':
      'Related Links|Library Hours|Events Calendar|Getting a Library Card|Research Resources|Contact The Library|Need Assistance?|If you have questions about this task, visit our help page for more information.|Go to Help Page',
    'foot': '',
  };
  env.site({
    name: 'design-handle-text-copy-paste-2-05',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body);
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head);
      u.el('span', 'title-text', title, cfg.title);
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
      const work = u.el('div', 'work', shell);
      if (cfg.rail) {
        const rail = u.el('nav', 'rail', work);
        cfg.rail.split('|').forEach((s, i) => u.el('div', i === 0 ? 'active' : '', rail, s));
      }
      const center = u.el('section', 'center', work);
      const width = (ctx.size && ctx.size.width) || document.documentElement.clientWidth;
      let display = ctx.display;
      if (
        display === 'panel' &&
        (width < 1200 || ((ctx.size && ctx.size.height) || document.documentElement.clientHeight) < 800)
      )
        display = 'header';
      if (display === 'toast' && width < 1024) display = 'header';
      const note = u.el('div', 'instruction', center, ctx.instruction);
      note.dataset.display = display;
      note.hidden = display === 'hidden';
      if (display === 'toast') note.classList.add('instruction-toast');
      if (display === 'panel') note.classList.add('instruction-panel');
      const stage = u.el('div', 'stage', center);
      let aside = null;
      if (cfg.side) {
        aside = u.el('aside', 'inspector', work);
        cfg.side.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', aside, s));
      }
      if (display === 'panel' && aside) aside.insertBefore(note, aside.firstChild);
      if (cfg.layout === 'console' && aside && display !== 'toast') {
        aside.insertBefore(note, aside.children[1] || null);
      }
      const foot = u.el('footer', 'footer', shell);
      if (cfg.foot) {
        const dock = u.el('div', 'dock-sections', foot);
        cfg.foot.split('|').forEach((s) => {
          const d = u.el('section', 'dock-section', dock);
          const parts = s.split(/ (.+)/);
          const label = u.el('div', 'dock-copy', d);
          u.el('strong', '', label, parts[0]);
          u.el('span', '', label, parts[1] || '');
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
      } else u.el('span', 'ready', foot, 'Ready.');
      if (cfg.theme === 'modernist') {
        const paths = [
          'M21 8h18l13 14v36q0 5-5 5H21q-5 0-5-5V13q0-5 5-5Z M39 8v14h13 M16 20H10q-6 0-6 6v39q0 5 5 5h23q5 0 5-5v-2',
          'M18 8h-5q-5 0-5 5v46q0 5 5 5h34q5 0 5-5V13q0-5-5-5h-7 M23 3h12q5 0 5 5v7H18V8q0-5 5-5Z',
          'M9 18h43q4 0 4 4v28q0 4-4 4H9q-5 0-5-4V22q0-4 5-4Z M13 28h4v2h-4Z M27 28h4v2h-4Z M41 28h4v2h-4Z M13 41h12v2H13Z M39 41h5v2h-5Z',
          'M30 3c-13 0-19 9-19 23v20c0 15 7 24 19 24s19-9 19-24V26C49 12 43 3 30 3Z M29 17h2v11h-2Z',
        ];
        foot.querySelectorAll('.dock-section').forEach((d, i) => {
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 60 76');
          svg.innerHTML = '<path d="' + paths[i] + '"/>';
          d.prepend(svg);
        });
      }
      const endRng = ctx.rng.fork('chrome/end');
      const collideRng = ctx.rng.fork('chrome/collide');
      const labelOf = (x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x));
      const labels = (ctx.content && ctx.content.END_LABELS) || [
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
      ];
      const placement = endRng.bool(0.5) ? 'form' : endRng.pick(['header', 'link']);
      const label = placement === 'form' ? 'Submit' : labelOf(endRng.pick(labels));
      let submit = null;
      const makeEnd = (parent, cls, text) => {
        const b = u.el(cls === 'news-end-link' ? 'a' : 'button', cls, parent, text);
        if (b.tagName === 'BUTTON') b.type = 'button';
        else b.href = '#';
        b.dataset.role = 'submit';
        b.setAttribute('aria-label', label);
        b.title = label;
        b.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
        return b;
      };
      const makeDecoy = (parent, text) => {
        const b = u.el('button', 'news-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () => env.log('decoy', { label: text, collide: true }));
        return b;
      };
      const pool = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
      if (pool.length && collideRng.bool(0.3) && aside) makeDecoy(aside, collideRng.pick(pool));
      if (!ctx.finish) {
        if (placement === 'header') submit = makeEnd(center, 'news-end-header', label);
        else if (placement === 'link') submit = makeEnd(work.querySelector('nav.rail'), 'news-end-link', label + ' ›');
        else submit = makeEnd(foot, 'submit news-end-form', label);
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
