(function () {
  'use strict';
  const cfg = {
    title: 'Text Exercise - Copy and Paste',
    theme: 'xp',
    layout: 'dock',
    tools: 'File     Edit     Format     View     Help',
    foot: '',
  };
  env.site({
    name: 'design-handle-text-copy-paste-2-04',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body),
        head = u.el('header', 'head', shell),
        title = u.el('div', 'title', head);
      u.el('span', 'title-text', title, cfg.title);
      if (
        ['qt', 'openlook', 'win92', 'clearlooks', 'industrial', 'electron', 'yosemite', 'xp', 'xp', 'xp'].includes(
          cfg.theme,
        )
      ) {
        const controls = u.el('span', 'window-controls', title);
        controls.innerHTML =
          '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      }
      const toolbar = cfg.tools ? u.el('div', 'tools', head, cfg.tools) : null;
      if (cfg.overview) {
        const ov = u.el('section', 'overview', shell);
        cfg.overview.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', ov, s));
      }
      const work = u.el('div', 'work', shell);
      if (cfg.rail) {
        const rail = u.el('nav', 'rail', work);
        cfg.rail.split('|').forEach((s, i) => u.el('div', i === 0 ? 'active' : '', rail, s));
      }
      const center = u.el('section', 'center', work),
        note = u.el('div', 'instruction', cfg.layout === 'response' ? work : center, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      const stage = u.el('div', 'stage', center);
      let aside = null;
      if (cfg.side) {
        aside = u.el('aside', 'inspector', work);
        cfg.side.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', aside, s));
      }
      if (cfg.layout === 'console' && aside && ctx.display !== 'toast')
        aside.insertBefore(note, aside.children[1] || null);
      const foot = u.el('footer', 'footer', shell);
      if (cfg.foot) {
        const dock = u.el('div', 'dock-sections', foot);
        cfg.foot.split('|').forEach((s) => {
          const d = u.el('section', 'dock-section', dock),
            parts = s.split(/ (.+)/),
            label = u.el('div', 'dock-copy', d);
          u.el('strong', '', label, parts[0]);
          u.el('span', '', label, parts[1] || '');
          if (cfg.theme === 'qt') {
            if (s === 'Task List')
              ['1.  Click requested control', '2.  Review result', '3.  Submit', '4.  Finish'].forEach((t, i) =>
                u.el('div', i === 0 ? 'current-task' : 'task-row', d, t),
              );
            else if (s === 'Status')
              ['Current Step:     1 of 4', 'Status:    Not completed', 'Attempts:    0', 'Result:    —'].forEach((t) =>
                u.el('div', 'status-row', d, t),
              );
            else if (s === 'Notes') u.el('div', 'dock-note', d, 'Follow the instruction above.');
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
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end'),
          labels = (ctx.content && ctx.content.END_LABELS) || [
            'Submit',
            'Done',
            'Finish',
            'Continue',
            'Save',
            'OK',
            'Confirm',
            'Apply',
          ],
          labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name || String(x)),
          label = er.bool(0.5) ? 'Submit' : labelOf(er.pick(labels)),
          placement = er.pick(['footer', 'footer', 'footer', 'toolbar', 'link', 'toolbar']),
          cr = ctx.rng.fork('chrome/collide');
        let collide = null;
        if (cr.bool(0.3)) {
          const options = [...new Set(labels.map(labelOf))].filter(
            (x) => x.trim().toLowerCase() !== label.trim().toLowerCase(),
          );
          if (options.length) collide = cr.pick(options);
        }
        const decoy = (parent, text, isCollide) => {
          const b = u.el('button', isCollide ? 'xp-xtra xp-pq' : 'xp-xtra', parent, text);
          b.type = 'button';
          b.addEventListener('click', () =>
            env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
          );
        };
        if (collide) decoy(placement === 'toolbar' ? toolbar : foot, collide, true);
        const parent = placement === 'toolbar' ? toolbar : foot;
        submit = u.el('button', placement === 'link' ? 'submit xp-end-link' : 'submit', parent, label);
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', ctx.submit);
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
