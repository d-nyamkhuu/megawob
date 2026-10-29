(function () {
  'use strict';
  const cfg = {
    'title': 'Text Task – last word – /home/user/docs/sample.txt',
    'theme': 'motif',
    'layout': 'board',
    'tools': 'File        Edit        View        Options        Help',
    'side':
      'Text Inspector|File|Name: sample.txt|Location: /home/user/docs/|Size: 1.4 KB|Lines: 25|Modified: Apr 24, 2024 10:17|View|Font: Helvetica 12|Line numbers: On|Word wrap: Off',
  };
  env.site({
    name: 'design-handle-text-scroll-text-05',
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
      if (ctx.display === 'panel' && aside) {
        note.classList.add('instruction-panel');
        aside.insertBefore(note, aside.children[1] || null);
      }
      if (cfg.layout === 'console' && aside && ctx.display !== 'toast' && ctx.display !== 'panel') {
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
        const endR = ctx.rng.fork('chrome/end');
        const placement = endR.bool(0.5) ? 'bottom' : endR.pick(['toolbar', 'inspector']);
        const labels = ctx.content && ctx.content.END_LABELS;
        const endLabels = Array.isArray(labels)
          ? labels.map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)))
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const label =
          placement === 'bottom'
            ? 'Submit'
            : endR.pick(
                endLabels.length
                  ? endLabels
                  : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'],
              );
        const parent = placement === 'toolbar' ? head : placement === 'inspector' ? aside || work : work;
        submit = u.el('button', 'submit end-' + placement, parent, label);
        submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', ctx.submit);
        if (placement === 'toolbar') submit.classList.add('toolbar-end');
        if (placement === 'inspector') submit.classList.add('inspector-end');
      }
      const collR = ctx.rng.fork('chrome/collide');
      if (!ctx.finish && collR.bool(0.3)) {
        const pool = ctx.content && ctx.content.END_LABELS;
        const labels = Array.isArray(pool)
          ? pool.map((x) => (typeof x === 'string' ? x : (x && (x.label || x.text || x.name)) || String(x)))
          : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const options = labels.filter(
          (x) => String(x).trim().toLowerCase() !== String(submit.textContent).trim().toLowerCase(),
        );
        if (options.length) {
          const label = collR.pick(options);
          const b = u.el('button', 'submit end-xtra', head, label);
          b.type = 'button';
          b.addEventListener('click', () => env.log('decoy', { label, collide: true }));
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
