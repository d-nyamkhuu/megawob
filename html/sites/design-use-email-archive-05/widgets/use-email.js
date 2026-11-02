// SkyMail visuals on the shared mail renderer; model actions and lookup anchors stay shared.
env.widget({
  task: 'use-email',
  site: 'design-use-email-archive-05',
  name: 'design',
  split: 'train',
  scenarios: ['archive'],
  template: 'use-email/base',
  design: {
    parts: {
      '+0.aeroIcon': () => {
        const icon = (kind, fill, stroke) => `<svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="a-${kind}" x2="0" y2="1"><stop stop-color="#fff" stop-opacity=".9"/><stop offset=".45" stop-color="${fill}"/><stop offset="1" stop-color="${stroke}"/></linearGradient></defs>${kind === 'envelope' ? `<rect x="2" y="5" width="28" height="23" rx="2" fill="url(#a-${kind})" stroke="${stroke}"/><path d="M3 6L16 19 29 6M3 27l9-11m17 11-9-11" stroke="${stroke}" stroke-width="1.5"/>` : kind === 'delete' ? `<path d="M7 6l19 20m0-20L7 26" stroke="${stroke}" stroke-width="7" stroke-linecap="round"/><path d="M7 5l19 20m0-20L7 25" stroke="${fill}" stroke-width="3.5" stroke-linecap="round"/>` : `<path d="M3 9h10l3-5h10v9h4v15H2V11z" fill="url(#a-${kind})" stroke="${stroke}" stroke-width="1.5"/><path d="M7 16h21" stroke="#fff" stroke-opacity=".7"/>`}</svg>`;
        return icon;
      },
      mailGeometry: (base, S) => (ctx, ads) => {
        const original = base(ctx, ads);
        const W = ctx.size.width;
        const H = ctx.size.height;
        const appW = Math.max(320, Math.floor(W - 16));
        const appH = Math.max(260, Math.floor(H - 20));
        const chromeH = 132;
        const rowH = Math.min(W >= 1450 ? 49 : 41, Math.floor((H - 20 - (W >= 1450 ? 136 : 116)) / ctx.spec.rows));
        return {
          ...original,
          appW, appH, left: 8, top: 12,
          rail: false, sideW: 0, stack: true,
          adCol: false, bannerH: 0, sponsorK: 0,
          chromeH, listW: appW, readW: appW,
          rowH, rowKind: 'compact',
        };
      },
      mailTopActions: (base, S) => (ctx, n) => {
        const state = base(ctx, n);
        n.newBtn.querySelector('svg').outerHTML = S.aeroIcon('envelope','#8ed526','#327b05');
        const controls = ctx.util.el('div', 'sky-tools', n.topEl);
        const select = n.button('sky-action sky-select', '', '▾', controls, 'Select all');
        const box = ctx.util.el('span', 'sky-check', select);
        select.prepend(box);
        n.on(select, () => {
          const order = env.taskDef.helpers.listOrder(ctx.model, ctx.spec);
          return { checkAll: !(order.length && order.every(i => ctx.model.checked.includes(i))) };
        });
        for (const [key, icon, label] of [['archive', S.aeroIcon('archive','#82c92c','#347d04'), 'Archive'], ['trash', S.aeroIcon('delete','#ff9691','#de2820'), 'Delete'], ['read', S.aeroIcon('envelope','#f4faff','#6f9abf'), 'Mark as Read']]) {
          const b = n.button('sky-action sky-' + key, icon, label, controls, label);
          n.on(b, { bulk: key });
        }
        for (const [icon, label] of [[S.aeroIcon('folder','#ffe579','#ce9b00'), 'Move'], ['', 'More']]) {
          const b = n.button('sky-action sky-menu', icon, label + ' ▾', controls, label);
          b.addEventListener('click', () => {
            const existing = controls.querySelector('.sky-popup');
            if (existing) { existing.remove(); return; }
            const pop = ctx.util.el('div', 'sky-popup', controls);
            const choices = label === 'Move' ? ['archive', 'inbox', 'trash', ...ctx.spec.folders] : ['read', 'unread', 'star'];
            for (const choice of choices) {
              const b = n.button('sky-option', '', choice.charAt(0).toUpperCase() + choice.slice(1), pop);
              n.on(b, () => {
                pop.remove();
                return label === 'Move' ? { move: [ctx.model.checked, choice] } : { bulk: choice };
              });
            }
          });
        }
        return state;
      },
      mailSidebar: (base) => (ctx, side) => {
        const state = base(ctx, side);
        const custom = ctx.util.el('div', 'sky-custom', side);
        for (const folder of [...side.querySelectorAll('.am-folder')]) {
          if (folder.querySelector('.am-dot')) custom.append(folder);
        }
        return state;
      },
      mailPaintTop: (base, S) => (ctx, state, model) => {
        base(ctx, state, model);
        const total = env.taskDef.helpers.listOrder(model, ctx.spec).length;
        const count = document.querySelector('.sky-count');
        if (count) count.textContent = total + ' messages';
      },
      mailListHeading: (base) => (ctx, lb) => {
        base(ctx, lb);
        const old = lb.parentElement.querySelector('.sky-columns');
        if (old) old.remove();
        const header = ctx.util.el('div', 'sky-columns', null);
        lb.before(header);
        for (const label of ['', 'From', 'Subject', 'Date ▾', '']) ctx.util.el('span', '', header, label);
      },
      mailSized: (base) => (ctx, lb) => {
        base(ctx, lb);
        const app = ctx.stage.querySelector('.am-app');
        const count = ctx.util.el('span', 'sky-count', app.querySelector('.am-top'));
        count.textContent = env.taskDef.helpers.listOrder(ctx.model, ctx.spec).length + ' messages';
        app.querySelector('.am-search input').placeholder = '';
      },
    },
  },
});
