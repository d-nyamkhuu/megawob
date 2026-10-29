(function () {
  'use strict';
  const cfg = {
    'title': 'Acme Solutions',
    'theme': 'clearlooks',
    'layout': 'inspector',
    'tools': 'Home Documents Accounts Support',
    'side': 'Your Task',
  };
  env.site({
    name: 'design-handle-text-sign-agreement-02',
    styles: ['site.css'],
    frame(ctx) {
      const u = ctx.util;
      const er = ctx.rng.fork('chrome/end');
      const labelOf = (x) => (typeof x === 'string' ? x : x.label || x.text || x.name);
      const labels = ctx.content.END_LABELS.map(labelOf);
      const original = er.bool(0.5);
      const endPlacement = original ? 'panel-footer' : er.pick(['toolbar', 'panel-link']);
      const endLabel = original ? 'Submit' : er.pick(labels);
      document.body.className = 'ref ' + cfg.theme + ' ' + cfg.layout;
      const shell = u.el('main', 'shell', document.body);
      shell.dataset.end = ctx.finish ? 'none' : endPlacement;
      shell.dataset.display = ctx.display;
      const head = u.el('header', 'head', shell);
      const title = u.el('div', 'title', head, cfg.title);
      const glyph = u.el('span', 'title-document', title);
      glyph.innerHTML =
        '<svg viewBox="0 0 20 24"><path d="M2 1h11l5 5v16H2Z" fill="#f4f4ef" stroke="#59636c"/><path d="M13 1v6h5M5 9h9M5 12h8M5 15h9M5 18h6" fill="none" stroke="#849097"/><path d="M6 6h3v4H6Z" fill="#a9bac7" stroke="#5e6d77"/></svg>';
      if (['qt', 'openlook', 'win92', 'clearlooks', 'industrial', 'electron', 'yosemite'].includes(cfg.theme)) {
        const controls = u.el('span', 'window-controls', title);
        controls.innerHTML =
          '<i><svg viewBox="0 0 16 16"><path d="M3 12h10"/></svg></i><i><svg viewBox="0 0 16 16"><path d="M3 3h10v10H3Z"/></svg></i><i><svg viewBox="0 0 16 16"><path d="m3 3 10 10M13 3 3 13"/></svg></i>';
      }
      if (cfg.tools) {
        const menus = u.el('div', 'tools', head);
        menus.innerHTML =
          '<span>Home</span><span>Documents</span><span>Accounts</span><span>Support</span><span class="welcome">Welcome, Alex <b>▼</b></span>';
      }
      if (cfg.overview) {
        const ov = u.el('section', 'overview', shell);
        cfg.overview.split('|').forEach((s, i) => u.el(i === 0 ? 'h2' : 'p', '', ov, s));
      }
      const overview = shell.querySelector('.overview');
      if (overview) {
        overview.replaceChildren();
        const file = u.el('div', 'license-file-icon', overview);
        file.innerHTML =
          '<svg viewBox="0 0 100 125"><defs><linearGradient id="paper" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#e5e5e3"/></linearGradient></defs><path d="M8 3h58l26 27v89q0 3-3 3H11q-3 0-3-3Z" fill="url(#paper)" stroke="#999" stroke-width="2"/><path d="M66 3v28h26" fill="#ddd" stroke="#999" stroke-width="2"/><path d="M23 24h27M23 34h27M23 44h53M23 54h53M23 64h53M23 74h53M23 84h53M23 94h45" stroke="#b5b6b6" stroke-width="4" stroke-linecap="round"/></svg>';
        const details = u.el('div', 'license-details', overview);
        u.el('h2', '', details, 'ExampleApp');
        const table = u.el('div', 'license-facts', details);
        [
          'Version:|2.4.1',
          'Publisher:|Example Software',
          'Type:|Desktop Application',
          'Size:|18.6 MB',
          'Modified:|Mar 3, 2009',
        ].forEach((text) => {
          const parts = text.split('|');
          u.el('span', '', table, parts[0]);
          u.el('span', '', table, parts[1]);
        });
        u.el(
          'p',
          'license-description',
          overview,
          'ExampleApp helps you organize your notes, tasks and schedule in one simple place.',
        );
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
      if ((cfg.layout === 'console' || cfg.layout === 'inspector') && aside) {
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
        const parent = endPlacement === 'toolbar' ? head : aside;
        submit = u.el(endPlacement === 'panel-link' ? 'a' : 'button', 'submit end-' + endPlacement, parent, endLabel);
        if (submit.tagName === 'BUTTON') submit.type = 'button';
        else submit.href = '#';
        submit.dataset.role = 'submit';
        submit.title = endLabel;
        submit.setAttribute('aria-label', endLabel);
        submit.addEventListener('click', (e) => {
          e.preventDefault();
          ctx.submit();
        });
      }
      const cr = ctx.rng.fork('chrome/collide');
      if (cr.bool(0.3)) {
        const options = [...new Set(labels)].filter((x) => x.trim().toLowerCase() !== endLabel.trim().toLowerCase());
        if (options.length) {
          const label = cr.pick(options);
          const decoy = u.el('button', 'chrome-xtra', aside, label);
          decoy.type = 'button';
          decoy.dataset.role = 'xtra';
          decoy.addEventListener('click', () => env.log('decoy', { label, collide: true }));
        }
      }
      head
        .querySelectorAll('.tools span:not(.welcome)')
        .forEach((item) => item.addEventListener('click', () => env.log('decoy', { label: item.textContent })));
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
