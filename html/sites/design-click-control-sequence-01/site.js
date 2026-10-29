(function () {
  'use strict';
  const cfg = {
    'title': 'My Organizer',
    'theme': 'organizer',
    'layout': 'rail',
    'tools': '',
    'rail': 'Home|Calendar|Tasks|Notes|Settings',
  };
  env.site({
    name: 'design-click-control-sequence-01',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
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
      const note = u.el('div', 'instruction', cfg.layout === 'response' ? work : center, ctx.instruction);
      note.dataset.display = ctx.display || 'header';
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') note.classList.add('instruction-toast');
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
      const paths = [
        'M2 11 12 2 22 11l-2 2-2-2v11h-5v-8h-4v8H4V11l-1 2Z M16 3v4h3V3Z',
        'M3 5h18v17H3Z M7 2v6 M17 2v6 M3 10h18 M7 13h1 M12 13h1 M17 13h1 M7 17h1 M12 17h1 M17 17h1',
        'M5 3h14q2 0 2 2v14q0 2-2 2H5q-2 0-2-2V5q0-2 2-2Z M7 12l4 4 7-9',
        'M5 2h15v20H5Z M3 5H1 M3 9H1 M3 13H1 M3 17H1 M8 6h9 M8 9h9 M8 12h9 M8 15h9 M22 5v15',
        'M10 1h4l1 4 3 1 3-1 2 4-3 2v3l3 2-2 4-3-1-3 1-1 4h-4l-1-4-3-1-3 1-2-4 3-2v-3L1 9l2-4 3 1 3-1Z M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
      ];
      shell.querySelectorAll('nav.rail>div').forEach((e, i) => {
        e.insertAdjacentHTML('afterbegin', '<svg viewBox="0 0 24 24"><path d="' + paths[i] + '"/></svg>');
      });
      u.el('div', 'organizer-date', shell, 'Tuesday, April 27, 2010');
      u.el('div', 'organizer-motto', shell, 'A more organized day is a brighter tomorrow.');
      const ornament = u.el('img', 'organizer-twig', center);
      ornament.src = 'sites/design-click-control-sequence-01/assets/twig.svg';
      ornament.alt = '';
      ornament.setAttribute('aria-hidden', 'true');
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
      const endR = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x && (x.label || x.text || x.name)) || String(x);
      const endWords =
        ctx.content && Array.isArray(ctx.content.END_LABELS) && ctx.content.END_LABELS.length
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
      const classic = endR.bool(0.5);
      const label = classic ? 'Submit' : labelOf(endR.pick(endWords));
      const placement = classic ? 'footer' : endR.pick(['toolbar', 'footer-link']);
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (collideR.bool(0.3)) {
        const choices = [
          ...new Set(endWords.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase())),
        ];
        if (choices.length)
          collide = { label: labelOf(collideR.pick(choices)), where: collideR.pick(['toolbar', 'footer']) };
      }
      const decoyBtn = (parent, text, isCollide) => {
        const b = u.el('button', 'organizer-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () =>
          env.log('decoy', isCollide ? { label: text, collide: true } : { label: text }),
        );
        return b;
      };
      let submit = null;
      let toolbar = null;
      if (placement === 'toolbar' || (collide && collide.where === 'toolbar'))
        toolbar = u.el('div', 'organizer-toolbar', head);
      if (toolbar && collide && collide.where === 'toolbar') decoyBtn(toolbar, collide.label, true);
      if (placement === 'toolbar' && !ctx.finish) {
        submit = u.el('button', 'submit organizer-toolbar-end', toolbar, label);
        submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
        submit.addEventListener('click', ctx.submit);
      }
      if (collide && collide.where === 'footer') decoyBtn(foot, collide.label, true);
      if (!ctx.finish && placement !== 'toolbar') {
        submit = u.el(
          'button',
          placement === 'footer-link' ? 'submit organizer-end-link' : 'submit organizer-footer-end',
          foot,
          placement === 'footer-link' ? label + ' ›' : label,
        );
        submit.type = 'button';
        submit.title = label;
        submit.setAttribute('aria-label', label);
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
