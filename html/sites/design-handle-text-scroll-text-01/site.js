(function () {
  'use strict';
  const cfg = {
    'title': 'Northbridge Supply Co.',
    'theme': 'extranet',
    'layout': 'board',
    'tools': 'Orders        Inventory        Documents        Partners        Support',
  };
  env.site({
    name: 'design-handle-text-scroll-text-01',
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
      const display = ctx.display || 'header';
      const roomy = window.innerWidth >= 1260;
      const shownDisplay =
        (display === 'panel' && !roomy) || (display === 'toast' && window.innerHeight < 680) ? 'header' : display;
      const note = u.el(
        'div',
        'instruction ' + (shownDisplay === 'panel' ? 'instruction-panel' : ''),
        shownDisplay === 'panel' ? work : cfg.layout === 'response' ? work : center,
        ctx.instruction,
      );
      note.dataset.display = shownDisplay;
      note.hidden = shownDisplay === 'hidden';
      if (shownDisplay === 'toast') {
        note.classList.add('instruction-toast');
      }
      const stage = u.el('div', 'stage', center);
      let aside = null;
      if (cfg.side) {
        aside = u.el('aside', 'inspector', work);
        cfg.side.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', aside, s));
      }
      if (cfg.layout === 'console' && aside && shownDisplay !== 'toast') {
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
      const endR = ctx.rng.fork('chrome/end');
      const placement = ctx.finish
        ? null
        : endR.pick(['board', 'board', 'board', 'board', 'header', 'header', 'footer', 'footer']);
      const labels =
        ctx.content && Array.isArray(ctx.content.END_LABELS)
          ? ctx.content.END_LABELS
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply', 'Complete', "I'm done"];
      const submitLabel = labels.find(
        (x) =>
          String((x && x.label) || x)
            .trim()
            .toLowerCase() === 'submit',
      );
      const label =
        placement === 'board'
          ? String((submitLabel && submitLabel.label) || submitLabel || 'Submit')
          : ((x) => String((x && x.label) || x))(endR.pick(labels));
      const collideR = ctx.rng.fork('chrome/collide');
      let collide = null;
      if (!ctx.finish && collideR.bool(0.3)) {
        const opts = labels
          .map((x) => String(x.label || x))
          .filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
        if (opts.length) collide = collideR.pick(opts);
      }
      const decoy = (parent, text, collision) => {
        const b = u.el('button', 'chrome-xtra', parent, text);
        b.type = 'button';
        b.addEventListener('click', () =>
          env.log('decoy', collision ? { label: text, collide: true } : { label: text }),
        );
      };
      if (collide) decoy(foot, collide, true);
      if (!ctx.finish) {
        if (placement === 'board') {
          const parent =
            cfg.layout === 'response'
              ? work
              : cfg.layout === 'inspector' || cfg.layout === 'console'
                ? aside || note
                : work;
          submit = u.el(
            'button',
            'submit',
            cfg.theme === 'qt' && cfg.layout === 'dock' ? foot.querySelector('.dock-section:last-child') : parent,
            label,
          );
        } else if (placement === 'header') {
          submit = u.el('button', 'submit chrome-head-end', head, label);
        } else {
          submit = u.el('a', 'chrome-footer-end', foot, label + ' ›');
          submit.href = '#';
        }
        if (submit.tagName === 'BUTTON') submit.type = 'button';
        submit.dataset.role = 'submit';
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
