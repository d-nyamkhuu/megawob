(function () {
  'use strict';
  const cfg = {
    'title': 'My Organizer',
    'theme': 'organizer',
    'layout': 'compact',
    'tools': 'Notes        Calendar        Tasks        Settings',
  };
  env.site({
    name: 'design-click-control-hover-02',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
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
      const work = u.el('div', 'work', shell);
      if (cfg.rail) {
        const rail = u.el('nav', 'rail', work);
        cfg.rail.split('|').forEach((s, i) => u.el('div', i === 0 ? 'active' : '', rail, s));
      }
      const center = u.el('section', 'center', work);
      let display = ctx.display || 'header';
      const note = u.el('div', 'instruction', cfg.layout === 'response' ? work : center, ctx.instruction);
      if (cfg.layout === 'compact') {
        const text = note.textContent;
        note.textContent = '';
        u.el('strong', 'note-title', note, 'Task');
        u.el('span', '', note, text);
        u.el(
          'span',
          'note-copy',
          note,
          'The square will move to different positions within the box. Keep your cursor on it as it moves.',
        );
      }
      if ((display === 'panel' || display === 'toast') && window.innerWidth < 1150) display = 'header';
      note.dataset.display = display;
      if (display === 'header') head.appendChild(note);
      note.hidden = display === 'hidden';
      if (display === 'toast') {
        note.classList.add('instruction-toast');
      }
      u.el('span', 'notebook-tagline', center, 'A calmer day, a more organized you.');
      u.el('div', 'notebook-rule', center);
      u.el('div', 'notebook-binding', center);
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
      } else u.el('span', 'ready', foot, 'Ready.');
      let submit = null;
      if (!ctx.finish) {
        const er = ctx.rng.fork('chrome/end');
        const keepDefault = er.bool(0.5);
        const label = keepDefault
          ? 'Submit'
          : labelOf(
              er.pick(
                (
                  (ctx.content && ctx.content.END_LABELS) || [
                    'Submit',
                    'Done',
                    'Finish',
                    'Continue',
                    'Save',
                    'OK',
                    'Confirm',
                    'Apply',
                  ]
                ).filter((x) => labelOf(x) !== 'Submit'),
              ),
            );
        const placement = keepDefault ? 'footer' : er.pick(['header', 'link']);
        const addEnd = (parent, kind, text) => {
          const e = u.el(
            kind === 'link' ? 'a' : 'button',
            kind === 'footer' ? 'submit' : kind === 'link' ? 'submit-link' : 'submit header-submit',
            parent,
            text,
          );
          if (kind === 'link') e.href = '#';
          else e.type = 'button';
          e.setAttribute('aria-label', label);
          e.title = label;
          e.addEventListener('click', (ev) => {
            ev.preventDefault();
            ctx.submit();
          });
          return e;
        };
        const parent =
          placement === 'footer' ? foot : placement === 'link' ? foot : head.querySelector('.tools') || head;
        submit = addEnd(parent, placement, label);
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const pool = (
            (ctx.content && ctx.content.END_LABELS) || [
              'Submit',
              'Done',
              'Finish',
              'Continue',
              'Save',
              'OK',
              'Confirm',
              'Apply',
            ]
          )
            .map(labelOf)
            .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (pool.length) {
            const d = u.el('button', 'end-xtra', head.querySelector('.tools') || head, cr.pick(pool));
            d.type = 'button';
            d.addEventListener('click', () => env.log('decoy', { label: d.textContent, collide: true }));
          }
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
