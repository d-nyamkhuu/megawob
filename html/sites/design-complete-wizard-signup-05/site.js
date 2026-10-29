// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  function icon(util, parent, kind) {
    const paths = {
      account: '<circle cx="20" cy="10" r="6" fill="white"/><path d="M9 34V25q0-8 11-8t11 8v9z" fill="white"/><path d="M15 33V25m10 8V25M18 18v8h4v-8"/>',
      mail: '<path d="M3 10h34v23H3z" fill="white"/><path d="m4 11 16 13 16-13M4 32l12-12m20 12L24 20"/>',
      contacts: '<path d="M7 3h27v34H7z" fill="white"/><path d="M3 7h5M3 14h5M3 21h5M3 28h5M3 35h5M12 30h17"/><circle cx="20" cy="13" r="5"/><path d="M12 25q0-8 8-8t8 8z"/>',
      calendar: '<path d="M4 6h32v31H4z" fill="white"/><path d="M4 13h32M11 2v9M29 2v9"/><text x="8" y="31" stroke="none" fill="black" font-family="Arial" font-size="20" font-weight="bold">31</text>',
      settings: '<path d="m5 33 20-20q-2-7 4-10l-1 7 5 2 5-4q1 9-8 10L10 38z" fill="white"/><circle cx="9" cy="33" r="1" fill="black"/>',
      envelope: '<path d="m5 9 25-5 8 8-3 25-28-4z" fill="white"/><path d="m5 9 27 6 6-3M7 33l2-20 23 4 3 20M9 14l10 12 13-9M8 32l8-9m15 13-8-12"/>',
      people: '<circle cx="20" cy="8" r="4" fill="#a5d6d6"/><circle cx="9" cy="16" r="4" fill="#a5d6d6"/><circle cx="31" cy="16" r="4" fill="#a5d6d6"/><path d="M13 33V20q0-7 7-7t7 7v13M4 33V25q0-6 6-6l4 2m12 0 4-2q6 0 6 6v8zM9 27v6m22-6v6M20 23v10" fill="#a5d6d6"/>',
      globe: '<circle cx="20" cy="20" r="16" fill="none"/><ellipse cx="20" cy="20" rx="7" ry="16" fill="none"/><path d="M4 20h32M7 11q13 7 26 0M7 29q13-7 26 0"/>'
    };
    const box = util.el('span', 'os-drawing', parent);
    box.innerHTML = '<svg viewBox="0 0 40 40" aria-hidden="true" fill="none" stroke="#111" stroke-width="2.3" stroke-linejoin="miter">' + paths[kind] + '</svg>';
    return box;
  }

  const parts = {
    endLabel: (base, S) => function (rng, content) {
      const original = base(rng, content);
      return rng.fork('os2/end-label').bool(0.5) ? 'Confirm' : original;
    },
    'frame.header': (base, S) =>
      function (_c) {
        const { util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        const title = util.el('div', 'os-title', header);
        const appIcon = util.el('span', 'os-app-icon', title);
        icon(util, appIcon, 'account');
        util.el('strong', '', title, 'Inboxly - Create Account');
        const controls = util.el('div', 'os-window-controls', title);
        for (const x of ['−', '□', '×']) util.el('span', '', controls, x);
        const menu = util.el('div', 'os-menu', header);
        for (const x of ['File', 'Edit', 'View', 'Tools', 'Help']) util.el('span', '', menu, x);
        S.frameBrand(_c, header);
        Object.assign(_c, { header, title, menu });
      },
    'frame.nav': (base, S) =>
      function (_c) {
        const { content, header, local, nav, rng, util } = _c;
        const { K } = S;
        if (nav) {
          const n = util.el('nav', 'ref-nav', header);
          for (const item of local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav)) {
            const a = util.el('a', 'ref-navlink', n, item);
            a.dataset.role = 'nav';
            a.addEventListener('click', (e) => {
              e.preventDefault();
              env.log('decoy', { what: 'nav', label: item });
            });
          }
        }
        const tabs = util.el('nav', 'portal-tabs', header);
        for (const [kind, item] of [['account','Create Account'], ['mail','Mail'], ['contacts','Contacts'], ['calendar','Calendar'], ['settings','Settings']]) {
          const a = util.el('a', item === 'Create Account' ? 'portal-tab active' : 'portal-tab', tabs);
          icon(util, a, kind);
          util.el('span', '', a, item);
          a.href = '#';
          a.addEventListener('click', (e) => {
            e.preventDefault();
            env.log('decoy', { what: 'nav', label: item });
          });
        }
        const brand = util.el('div', 'os-brand', tabs);
        util.el('b', '', brand, 'Inboxly'); icon(util, brand, 'envelope');
        Object.assign(_c, { tabs });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        S.frameSidebar(_c, body);
        Object.assign(_c, { body });
      },
    'frame.panel': (base, S) =>
      function (_c) {
        base(_c);
        const panel = _c.body.querySelector('.ref-panel');
        if (panel) _c.body.classList.add('os-with-panel');
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const workspace = util.el('section', 'os-workspace', body);
        const stage = util.el('main', 'ref-stage', workspace);
        const rail = util.el('aside', 'os-step-rail', workspace);
        for (const [n, label] of [['1','Account'], ['2','Profile'], ['3','Preferences'], ['4','Review']]) {
          const row = util.el('div', n === '1' ? 'os-step current' : 'os-step', rail);
          util.el('span', 'os-step-number', row, n);
          util.el('span', 'os-step-label', row, label);
        }
        util.el('div', 'os-form-heading', workspace, 'Create Your Account');
        const status = util.el('footer', 'os-status', body);
        icon(util, status, 'people');
        util.el('span', '', status, 'Accounts: 0');
        util.el('i', '', status);
        util.el('span', '', status, 'Messages: 0');
        util.el('i', '', status);
        util.el('span', '', status, 'Contacts: 0');
        const connection = util.el('span', 'os-status-connection', status);
        icon(util, connection, 'globe');
        util.el('span', '', connection, 'Not connected');
        S.frameAlign(_c, stage);
        Object.assign(_c, { stage });
      },
    'frame.end': (base, S) => function (_c) {
      const result = base(_c);
      const { ctx, util, submit, headerTools, label } = _c;
      const originalFoot = document.querySelector('.ref-foot');
      if (originalFoot) {
        for (const button of originalFoot.querySelectorAll('.ref-xtra')) headerTools.append(button);
        if (submit && originalFoot.contains(submit)) headerTools.append(submit);
        originalFoot.remove();
      }
      if (submit && !ctx.finish) {
        const placement = ctx.rng.fork('os2/end-place').pick(['footer', 'footer', 'footer', 'header', 'icon', 'link']);
        if (placement === 'footer' || placement === 'link') {
          const strip = util.el('footer', 'os-end-strip', document.body);
          strip.append(submit);
          if (placement === 'link') submit.classList.add('os-end-link');
        } else {
          headerTools.append(submit);
          if (placement === 'icon') { submit.textContent = '✓'; submit.classList.add('ref-icon'); }
          else submit.textContent = label;
        }
      }
      const dock = document.querySelector('.ref-float-dock');
      if (dock && !dock.querySelector('[data-role="submit"]')) dock.remove();
      return result;
    },
  };

  env.site({
    name: 'design-complete-wizard-signup-05',
    template: 'site/base',
    design: { parts },
  });
})();
