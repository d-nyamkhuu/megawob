(function () {
  'use strict';
  const cfg = { 'title': 'Text Reader', 'theme': 'platinum', 'layout': 'board', 'tools': '' };
  env.site({
    name: 'design-handle-text-scroll-text-06',
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
      const icons = u.el('div', 'desktop-icons', work);
      icons.innerHTML =
        '<div class="desktop-icon drive"><svg viewBox="0 0 48 42" aria-hidden="true"><path d="M8 12 13 4h23l5 8v20H7V13z" fill="#d9dce3" stroke="#45495a" stroke-width="1.5"/><path d="M9 13h30v15H9z" fill="#bfc4ce" stroke="#666b79"/><path d="M14 8h21l3 5H10z" fill="#eef0f4" stroke="#707583"/><path d="M13 18h22M13 22h22M13 26h18" stroke="#8f95a2"/><path d="M19 32h13" stroke="#555a68" stroke-width="2"/></svg><span>Macintosh HD</span></div><div class="desktop-icon folder"><svg viewBox="0 0 48 42" aria-hidden="true"><path d="M5 10h15l5 5h18v21H5z" fill="#a9a8df" stroke="#454464" stroke-width="1.5"/><path d="M5 16h38v19H5z" fill="#c5c4f0" stroke="#605f89"/><path d="m8 18 30 0-3 14H7z" fill="#b2b0e4" stroke="#7977a8"/><path d="M8 19h29" stroke="#e4e3ff" stroke-width="2"/></svg><span>Documents</span></div><div class="desktop-icon trash"><svg viewBox="0 0 48 42" aria-hidden="true"><path d="M13 11h22l-2 27H15z" fill="#c2c5ce" stroke="#555a68" stroke-width="1.5"/><path d="M11 9h26v4H11zM17 6h14l2 3H15z" fill="#e0e2e8" stroke="#555a68"/><path d="M19 16v17M24 16v17M29 16v17" stroke="#858a97" stroke-width="1.5"/><path d="M15 13h18" stroke="#f7f7fa"/></svg><span>Trash</span></div></div>';
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
      if (ctx.display === 'header') note.classList.add('instruction-header');
      if (ctx.display === 'panel') note.classList.add('instruction-panel');
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
        const er = ctx.rng.fork('chrome/end');
        const labels =
          Array.isArray(ctx.content?.END_LABELS) && ctx.content.END_LABELS.length
            ? ctx.content.END_LABELS
            : ['Submit', 'Done', 'Finish', 'Continue', 'Save', 'OK', 'Confirm', 'Apply'];
        const labelOf = (x) => (typeof x === 'string' ? x : x?.label || x?.text || x?.name || String(x));
        const place = er.pick(['window', 'window', 'toolbar', 'link']);
        const label = labelOf(er.pick(labels));
        const parent = place === 'toolbar' ? head : place === 'link' ? work : work;
        const cls =
          'submit platinum-end ' +
          (place === 'window' ? 'end-window' : place === 'toolbar' ? 'end-toolbar' : 'end-link');
        submit = u.el('button', cls, parent, label);
        submit.type = 'button';
        submit.setAttribute('aria-label', label);
        submit.title = label;
        submit.addEventListener('click', ctx.submit);
        submit.dataset.placement = place;
        const cr = ctx.rng.fork('chrome/collide');
        if (cr.bool(0.3)) {
          const options = labels.map(labelOf).filter((x) => x.trim().toLowerCase() !== label.trim().toLowerCase());
          if (options.length) {
            const dlabel = cr.pick(options);
            const decoy = u.el('button', 'platinum-xtra', head, dlabel);
            decoy.type = 'button';
            decoy.addEventListener('click', () => env.log('decoy', { label: dlabel, collide: true }));
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
