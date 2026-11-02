// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.layout': (base, S) =>
      function (_c) {
        const { ctx, util } = _c;
        const W = window.innerWidth;
        const H = window.innerHeight;
        const roomy = W >= 1260;
        const tall = H >= 700;
        let display = ctx.display || 'header';
        if (display === 'panel' && !roomy) display = 'header';
        if (display === 'toast' && !tall) display = 'header';
        document.body.dataset.noteDisplay = display;
        // reset() reuses the body: a previous toast must not shrink later episodes.
        document.body.classList.toggle('ref-has-note', display === 'toast');

        // BeOS desktop frame: a compact yellow application tab on the blue desktop bar.
        const winbar = util.el('div', 'next-titlebar', document.body);
        util.el('span', 'next-window-icon', winbar, '▣');
        util.el('span', 'next-window-title', winbar, 'Cloud Administration');
        util.el('span', 'next-app-menu', winbar, '▾');
        const desktopControls = util.el('span', 'next-desktop-controls', winbar);
        for (const name of ['minimize', 'maximize', 'close']) util.el('i', `window-mark ${name}`, desktopControls);
        Object.assign(_c, { H, W, desktopControls, display, roomy, tall, winbar });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const rail = util.el('aside', 'next-rail', body);
        util.el('strong', 'org-heading', rail, 'Organization');
        const org = util.el('div', 'org-card', rail);
        const orgIcon = util.el('span', 'org-icon', org);
        orgIcon.innerHTML =
          '<svg viewBox="0 0 47 66" aria-hidden="true"><g stroke="#07112e" stroke-width="2" stroke-linejoin="round"><path fill="#1686d5" d="M3 13 30 2l13 6v42L17 63 3 55z"/><path fill="#7ec9fc" d="m17 20 26-12v14L17 34zm0 17 26-12v13L17 51zm0 17 26-13v14L17 64z"/><path fill="#54a8e7" d="m5 15 10 5v13L5 28zm0 17 10 5v13L5 45zm0 17 10 5v8L5 57z"/><path d="m22 24 6-3m-6 20 6-3m-6 20 6-3m9-35 2-1m-2 18 2-1m-2 17 2-1"/></g></svg>';
        const orgcopy = util.el('div', 'org-copy', org);
        util.el('strong', '', orgcopy, 'Acme Systems');
        util.el('span', '', orgcopy, 'Cloud Console');
        const stats = (title, rows) => {
          const group = util.el('section', 'org-section', rail);
          if (title) util.el('strong', 'org-section-title', group, title);
          for (const [label, value] of rows) {
            const row = util.el('div', 'org-stat', group);
            util.el('span', '', row, label);
            util.el('span', '', row, value);
          }
        };
        stats('', [
          ['Subscriptions', '6'],
          ['Regions', '8'],
          ['Users', '42'],
          ['Open Tickets', '3'],
        ]);
        stats('Compute Resources', [
          ['VM Instances', '118'],
          ['Public Addresses', '410'],
          ['Load Balancers', '44'],
          ['Storage (TB)', '52'],
        ]);
        const health = util.el('section', 'org-section org-health', rail);
        util.el('strong', 'org-section-title', health, 'Service Health');
        for (const [label, status, color] of [
          ['Compute', 'Healthy', '#00a52a'],
          ['Networking', 'Healthy', '#00a52a'],
          ['Identity', 'Healthy', '#00a52a'],
          ['Storage', 'Degraded', '#e8c400'],
        ]) {
          const row = util.el('div', 'org-stat', health);
          util.el('i', 'health-dot', row).style.background = color;
          util.el('span', 'health-name', row, label);
          util.el('span', '', row, status);
        }
        const updated = util.el('div', 'org-updated', rail);
        util.el('span', '', updated, 'Last updated');
        util.el('span', '', updated, 'Apr 25, 1999　10:24 AM');
        S.frameSidebar(_c, body);
        Object.assign(_c, { body, health, org, orgIcon, orgcopy, rail, stats, updated });
      },
    'frame.floating': (base, S) =>
      function (_c) {
        const { body, endBtn, header, label, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }
        // The episode tools share the desktop title bar; their original actions and draws stay intact.
        header.classList.add('quota-episode-tools');
        const panel = body.querySelector('.ref-panel');
        if (panel) body.append(panel);
        Object.assign(_c, { panel, submit });
      },
  };

  env.site({
    name: 'design-use-admin-console-quota-02',
    template: 'site/base',
    design: { parts },
  });
})();
