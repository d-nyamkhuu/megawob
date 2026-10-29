(function () {
  'use strict';
  const cfg = {
    'title': '',
    'theme': 'extranet',
    'layout': 'notebook',
    'tools': '',
    'rail': 'Text|Notes|Tasks|Settings',
  };
  env.site({
    name: 'design-handle-text-scroll-text-09',
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
      u.el('div', 'sub', head, 'EXTRANET  |  PARTNER ACCESS  |  EST. 1999');
      const who = u.el('div', 'who', head);
      who.innerHTML =
        'Logged in: jcarter &nbsp;|&nbsp; Acme Parts Ltd. &nbsp;|&nbsp; <u>Help</u> &nbsp;|&nbsp; <u>Sign Out</u>';
      u.el('div', 'date', head, 'Tue, Mar 16, 1999');
      if (cfg.tools) {
        const tb = u.el('div', 'tools', head);
        cfg.tools.split(/\s{2,}/).forEach((t) => u.el('span', t === 'Documents' ? 'tab on' : 'tab', tb, t));
      }
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
      // Independent frame streams leave the existing widget's seeded draws untouched.
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const endLabels = ctx.content.END_LABELS.map(labelOf);
      const referenceEnd = er.bool(0.5);
      const placement = referenceEnd ? 'footer' : er.pick(['toolbar', 'link']);
      const endLabel = referenceEnd ? 'Submit' : er.pick(endLabels.filter((x) => x !== 'Submit'));
      work.classList.add(ctx.finish ? 'end-finish' : 'end-' + placement);
      const cr = ctx.rng.fork('chrome/collide');
      const collision = cr.bool(0.3)
        ? cr.pick(endLabels.filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase()))
        : null;
      let actions = null;
      if ((!ctx.finish && placement === 'toolbar') || collision) {
        actions = u.el('div', 'notebook-actions', center);
        if (collision) {
          const decoy = u.el('button', 'notebook-xtra', actions, collision);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label: collision, collide: true }));
        }
      }
      const note = u.el('div', 'instruction', cfg.layout === 'response' ? work : center, ctx.instruction);
      note.dataset.display = ctx.display;
      note.hidden = ctx.display === 'hidden';
      if (ctx.display === 'toast') {
        note.classList.add('instruction-toast');
      }
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
        u.el('span', 'ready', foot, '© 1999 Northbridge Supply Co.  |  Partner Extranet');
        u.el('span', 'flinks', foot, 'Terms of Use  |  Privacy  |  Contact');
      }
      let submit = null;
      if (!ctx.finish) {
        const parent =
          cfg.layout === 'response'
            ? work
            : cfg.layout === 'inspector' || cfg.layout === 'console'
              ? aside || note
              : work;
        submit = u.el(
          'button',
          'submit',
          cfg.theme === 'qt' && cfg.layout === 'dock'
            ? foot.querySelector('.dock-section:last-child')
            : placement === 'toolbar'
              ? actions
              : parent,
          endLabel,
        );
        submit.type = 'button';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        if (placement === 'link') submit.classList.add('submit-link');
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
