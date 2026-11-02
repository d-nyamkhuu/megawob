// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.theme': (base, S) => function (_c) {
      const { ctx } = _c;
      const { ACCENTS, LOW_ACCENTS, THEMES } = S;
      const { rng, util, content } = ctx;
      let name = rng.pick(Object.keys(THEMES));
      const root = document.documentElement;
      let accent = rng.pick(ACCENTS);
      const tr = rng.fork('chrome/theme');
      if (tr.bool(0.08)) {
        name = 'low';
        accent = tr.pick(LOW_ACCENTS);
      }
      // Keep the seeded theme draws stable, while this Aqua reference design stays blue and light.
      for (const [k, v] of Object.entries(THEMES.light)) root.style.setProperty(`--${k}`, v);
      root.style.setProperty('--accent', '#1685d4');
      root.dataset.theme = 'light';
      Object.assign(_c, { accent, content, name, rng, root, tr, util });
    },
    'frame.placement': (base, S) => function (_c) {
      const { W, content, ctx, local, lr, rng, roomy, tall, util, word } = _c;
      const { K, endLabel } = S;
      // End control placement (none in finish mode).
      let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
      const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
      if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
      const sidebar = roomy && rng.bool(0.35);
      const nav = W >= 1180 && rng.bool(0.5);
      const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
      let label = endLabel(rng, content);
      if (word) label = word(lr.pick(K.end));
      // A decoy that reads like an end control (another end word, never this episode's label).
      const { collide, cr } = S.frameCollide(_c, label);
      const titlebar = util.el('div', 'aqua-titlebar', document.body);
      const dots = util.el('span', 'aqua-window-dots', titlebar);
      for (const color of ['red', 'yellow', 'green']) util.el('i', `aqua-dot aqua-dot-${color}`, dots);
      util.el('strong', 'aqua-window-title', titlebar, 'Northstar IT Administration Console');
      for (const mark of ['−', '□', '×']) util.el('button', 'amiga-window-control', titlebar, mark);
      Object.assign(_c, { collide, cr, decoys, dots, label, nav, placement, sidebar, titlebar, wantFooter });
    },
    'frame.header': (base, S) => function (_c) {
      const { display, nav, rng, util } = _c;
      const { TITLES } = S;
      const header = util.el('header', 'ref-task', document.body);
      const tabs = util.el('nav', 'amiga-menu', header);
      for (const label of ['Workbench', 'Account', 'Directory', 'Security', 'Reports', 'Help']) {
        util.el('span', 'amiga-menu-item', tabs, label);
      }
      const globalSearch = null;
      Object.assign(_c, { globalSearch, header, tabs });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, local, rng, sidebar, util } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body', document.body);
      if (sidebar) {
        const side = util.el('aside', 'ref-side', body);
        const sampledSide = local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
        const sideLabels = ['User Accounts', 'Groups', 'Roles', 'Licences', 'Service Desk', 'Audit Log', 'Settings', 'System Status'];
        const sideItems = sideLabels.slice(0, sampledSide.length);
        util.el('div', 'aqua-side-heading', side, 'Directory');
        for (let i = 0; i < sideItems.length; i++) {
          if (i === 4) util.el('div', 'aqua-side-heading', side, 'Support');
          if (i === 6) util.el('div', 'aqua-side-heading', side, 'Administration');
          const item = sideItems[i];
          const a = util.el('a', 'ref-sidelink', side, item);
          a.dataset.role = 'nav';
          a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'sidebar', label: item }); });
        }
      }
      Object.assign(_c, { body });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, util } = _c;
      const stage = util.el('main', 'ref-stage', body);
      const details = util.el('section', 'amiga-detail', body);
      const dtitle = util.el('div', 'amiga-section-title', details, 'Account Details');
      const profile = util.el('div', 'amiga-profile', details);
      const avatar = util.el('div', 'amiga-avatar', profile);
      avatar.innerHTML = '<svg viewBox="0 0 64 64" aria-hidden="true"><path d="M32 5c-9 0-15 7-15 17 0 7 3 12 7 15-2 5-6 8-12 11-5 3-7 6-7 11h54c0-5-2-9-7-11-6-3-10-6-12-11 5-3 7-9 7-16C47 12 41 5 32 5z" fill="#333"/></svg>';
      const fields = util.el('div', 'amiga-fields', profile);
      for (const label of ['Email:', 'Display name:', 'Role:', 'Department:', 'MFA status:', 'Last sign-in:']) {
        const row = util.el('div', 'amiga-field', fields);
        util.el('b', '', row, label); util.el('span', '', row, '—');
      }
      const iconArt = {
        key: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M29 4a13 13 0 0 0-12 18L3 36v9h10v-6h7v-7l3-3A13 13 0 1 0 29 4zm5 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8z" fill="currentColor"/></svg>',
        person: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 4a11 11 0 1 0 0 22 11 11 0 0 0 0-22zM5 44c0-11 7-17 19-17s19 6 19 17v2H5z" fill="currentColor"/></svg>',
        document: '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 3h22l8 8v34H10z" fill="none" stroke="currentColor" stroke-width="4"/><path d="M30 4v9h9M16 21h18M16 28h18M16 35h18" fill="none" stroke="currentColor" stroke-width="3"/></svg>',
      };
      for (const [kind, label] of [['key', 'Reset MFA'], ['person', 'Manage Access'], ['document', 'View Details']]) {
        const button = util.el('button', 'amiga-action', details);
        const glyph = util.el('span', 'amiga-action-icon', button); glyph.innerHTML = iconArt[kind]; util.el('span', '', button, label);
      }
      const recent = util.el('section', 'amiga-recent', body);
      util.el('div', 'amiga-section-title', recent, 'Recent Accounts');
      const recentHead = util.el('div', 'amiga-recent-row amiga-recent-head', recent);
      util.el('span', '', recentHead, 'Email Address'); util.el('span', '', recentHead, 'Last Activity');
      for (const [email, date] of [['oscar.silva@northstar.example','2025-04-04 10:22'],['maya.patel@northstar.example','2025-04-03 16:11'],['dmitri.volkov@northstar.example','2025-04-02 09:37'],['carla.mendes@northstar.example','2025-04-01 14:05'],['timur-abdullaev.2@northstar.example','2025-03-30 18:21']]) {
        const row = util.el('div', 'amiga-recent-row', recent); util.el('span', '', row, email); util.el('span', '', row, date);
      }
      const dock = util.el('nav', 'amiga-dock', body);
      const dockArt = [
        '<svg viewBox="0 0 48 40" aria-hidden="true"><g fill="currentColor"><circle cx="10" cy="10" r="5"/><circle cx="24" cy="7" r="6"/><circle cx="38" cy="10" r="5"/><path d="M2 35V23c0-5 4-8 9-8s9 3 9 8v12zm15 0V20c0-6 3-9 7-9s7 3 7 9v15zm13 0V23c0-5 4-8 9-8s9 3 9 8v12z"/></g></svg>',
        '<svg viewBox="0 0 48 40" aria-hidden="true"><rect x="4" y="3" width="40" height="27" rx="1" fill="#1749ba" stroke="#111" stroke-width="4"/><path d="M18 30h12v5h8v3H10v-3h8z" fill="#111"/></svg>',
        '<svg viewBox="0 0 48 40" aria-hidden="true"><g fill="#1749ba" stroke="#111" stroke-width="2"><rect x="3" y="3" width="17" height="15"/><rect x="28" y="3" width="17" height="15"/><rect x="3" y="23" width="17" height="14"/><rect x="28" y="23" width="17" height="14"/></g></svg>',
        '<svg viewBox="0 0 48 40" aria-hidden="true"><path d="M24 2 43 10v12c0 9-8 15-19 19C13 37 5 31 5 22V10z" fill="#1749ba" stroke="#111" stroke-width="3"/></svg>',
        '<svg viewBox="0 0 48 40" aria-hidden="true"><path d="M9 2h22l8 8v28H9z" fill="#1749ba" stroke="#111" stroke-width="3"/><path d="M29 3v9h9M15 18h18M15 24h18M15 30h18" fill="none" stroke="#111" stroke-width="3"/></svg>',
        '<svg viewBox="0 0 48 40" aria-hidden="true"><g fill="#1749ba" stroke="#111" stroke-width="2"><path d="M3 23h7v14H3zM15 16h7v21h-7zM27 8h7v29h-7zM39 2h7v35h-7z"/></g></svg>',
      ];
      for (const [i, label] of ['Accounts','Devices','Applications','Security','Service Desk','Reporting'].entries()) {
        const item = util.el('div', `amiga-dock-item${label === 'Accounts' ? ' selected' : ''}`, dock);
        const glyph = util.el('span', 'amiga-dock-icon', item); glyph.innerHTML = dockArt[i]; util.el('span', '', item, label);
      }
      S.frameAlign(_c, stage);

      Object.assign(_c, { stage, details, recent, dock });
    },
  };

  env.site({
    name: 'design-use-admin-console-resetuser-05',
    template: 'site/base',
    design: { parts },
  });
})();
