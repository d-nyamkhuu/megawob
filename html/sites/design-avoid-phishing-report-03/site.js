// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, LOW_THEME, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      for (const [k, v] of Object.entries(name === 'low' ? LOW_THEME : THEMES[name])) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', accent);
      // This design keeps a stable Memphis palette across episode frame scenarios.
      root.style.setProperty('--bg', '#fffaf1');
      root.style.setProperty('--panel', '#ffffff');
      root.style.setProperty('--fg', '#101b3e');
      root.style.setProperty('--muted', '#5e6884');
      root.style.setProperty('--line', '#c9cbd4');
      root.style.setProperty('--accent', '#1768e8');
      root.dataset.theme = name;
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.header': (base, S) => function (_c) {
      const { rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const title = rng.pick(TITLES);
      const titlebar = util.el('div', 'ref-titlebar', header);
      util.el('span', 'ref-app-icon', titlebar, '✉');
      const brand = util.el('div', 'ref-brand', titlebar, 'SecureMail Pro');
      brand.dataset.role = 'brand';
      util.el('span', 'ref-window-controls', titlebar, '−　▢　×');
      const menu = util.el('nav', 'ref-menubar', header);
      for (const item of ['File', 'Edit', 'View', 'Message', 'Tools', 'Accounts', 'Help']) util.el('span', 'ref-menu-item', menu, item);
      const actionbar = util.el('div', 'ref-actionbar', header);
      for (const [icon, text] of [['✉','New'],['↶','Reply'],['⇇','Reply All'],['↗','Forward'],['▤','Delete'],['⬡','Report'],['▣','Move⌄'],['◇','Tags⌄'],['•••','More']]) {
        const item = util.el('span', 'ref-action-item', actionbar, `${icon}　${text}`);
      }
      util.el('div', 'ref-search', actionbar, '⌕　Search mail');
      Object.assign(_c, { actionbar, brand, header, menu, title, titlebar });
    },
    'frame.instruction': (base, S) => function (_c) {
      const { actionbar, ctx, display, util } = _c;
      if (display === 'header') util.el('div', 'ref-instruction', actionbar, ctx.instruction);
      else util.el('div', 'ref-spacer', actionbar);
    },
    'frame.tools': (base, S) => function (_c) {
      const { actionbar, collide, decoyBtn, decoys, endBtn, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools', actionbar);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { util } = _c;
      const body = util.el('div', 'ref-body', document.body);
      const tips = util.el('aside', 'ref-tips', body);
      const iconPaths = {
        inbox: '<path d="M3 5h18v14H3z"/><path d="m3 7 9 6 9-6"/>', star: '<path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1.1 6.2L12 17.4l-5.6 2.9 1.1-6.2L3 9.7l6.2-.9z"/>',
        draft: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 12h6M9 16h6"/>', sent: '<path d="m3 11 18-8-7 18-3.2-7z"/><path d="m10.8 14 5-5"/>',
        archive: '<path d="M3 5h18v4H3zM5 9v11h14V9M9 13h6"/>', junk: '<path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6z"/><path d="M12 8v5M12 16h.01"/>',
        trash: '<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>', all: '<path d="M3 5h18v14H3zM3 9h5l2 3h4l2-3h5"/>', flag: '<path d="M6 21V4M6 5h12l-2 4 2 4H6"/>',
        attach: '<path d="m8 12 6.8-6.8a4 4 0 0 1 5.7 5.7l-8.7 8.7a6 6 0 0 1-8.5-8.5l8.2-8.2"/>',
        mail: '<path d="M3 5h18v14H3z"/><path d="m3 7 9 6 9-6"/>', shield: '<path d="M12 3 20 6v5c0 5-3.4 8.5-8 10-4.6-1.5-8-5-8-10V6z"/><path d="M12 8v5M12 16h.01"/>',
        ticket: '<path d="M4 5h16v4a3 3 0 0 0 0 6v4H4v-4a3 3 0 0 0 0-6z"/><path d="M12 7v2M12 12v2M12 17v1"/>', file: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 12h6M9 16h6"/>'
      };
      const putIcon = (parent, cls, kind) => {
        const wrap = util.el('span', cls, parent);
        wrap.innerHTML = `<svg class="ref-icon-svg" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[kind] || iconPaths.mail}</svg>`;
        return wrap;
      };
      const folders = [['inbox','Inbox','8'],['star','Starred',''],['draft','Drafts',''],['sent','Sent',''],['archive','Archive',''],['junk','Junk',''],['trash','Deleted Items','']];
      const folderBadges = {};
      for (const [icon, text, count] of folders) {
        const row = util.el('div', `ref-folder${text === 'Inbox' ? ' active' : ''}`, tips);
        putIcon(row, 'ref-folder-icon', icon);
        util.el('span', 'ref-folder-name', row, text);
        if (count) folderBadges[text] = util.el('span', 'ref-folder-count', row, count);
      }
      util.el('div', 'ref-folder-section', tips, 'Views');
      for (const [icon, text, count] of [['all','All Mail',''],['mail','Unread','8'],['flag','Flagged','0'],['attach','With Attachments','3']]) {
        const row = util.el('div', 'ref-folder', tips);
        putIcon(row, 'ref-folder-icon', icon);
        util.el('span', 'ref-folder-name', row, text);
        if (count) folderBadges[text] = util.el('span', 'ref-folder-count', row, count);
      }
      S.frameSidebar(_c, body);
      Object.assign(_c, { body, folderBadges, folders, iconPaths, putIcon, tips });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, putIcon, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      S.frameAlign(_c, stage);
      const summary = util.el('aside', 'ref-summary', body);
      putIcon(util.el('div', 'ref-summary-heading', summary), 'ref-summary-head-icon', 'mail');
      summary.querySelector('.ref-summary-heading').append(' Inbox Summary');
      const total = util.el('div', 'ref-summary-total', summary);
      util.el('span', '', total, 'Total messages');
      const totalValue = util.el('strong', '', total, '8');
      const metricNodes = {};
      for (const [icon, kind, text, count] of [['mail','unread','Unread','8'],['attach','attachments','With attachments','3'],['shield','reported','Reported','0'],['ticket','tickets','Likely ticket notifications','4'],['file','other','Other','2']]) {
        const row = util.el('div', 'ref-summary-row', summary);
        putIcon(row, `ref-summary-icon ref-summary-${kind}`, icon);
        util.el('span', 'ref-summary-label', row, text);
        metricNodes[kind] = util.el('span', 'ref-summary-count', row, count);
      }
      util.el('div', 'ref-summary-subhead', summary, 'Senders');
      const senders = util.el('div', 'ref-summary-senders', summary);
      for (const [sender, count] of [['Help desk', '3'], ['Billing', '2'], ['Accounts', '2'], ['Newsletter', '1']]) {
        const row = util.el('div', 'ref-summary-sender', senders);
        util.el('span', '', row, sender);
        util.el('span', '', row, count);
      }
      Object.assign(_c, { metricNodes, senders, stage, summary, total, totalValue });
    },
  };

  env.site({
    name: 'design-avoid-phishing-report-03',
    template: 'site/base',
    design: { parts },
  });
})();
