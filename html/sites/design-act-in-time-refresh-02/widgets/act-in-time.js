// Keep the reference task logic; contact presentation lives in template parts.
env.widget({
  task: 'act-in-time',
  site: 'design-act-in-time-refresh-02',
  name: 'design',
  split: 'train',
  scenarios: ['refresh'],
  template: 'act-in-time/base',
  design: {
    parts: {
      // Keep the template's state, events and seeded draws. Only the contact
      // presentation differs: a full-width list, with three skeleton columns.
      frame: (base) => (ctx) => {
        const f = base(ctx);
        f.arena.classList.add('contacts-arena');
        Object.assign(f.arena.style, {
          left: '0px', top: '0px',
          width: ctx.size.width + 'px', height: ctx.size.height + 'px',
        });
        f.arena.firstElementChild.style.display = 'none';
        f.body.classList.add('contacts-body');
        return f;
      },
      buildRefresh: (base) => (ctx, f) => {
        const view = base(ctx, f);
        const main = f.body.firstElementChild;
        main.classList.add('contacts-main');
        const col = main.firstElementChild;
        col.classList.add('contacts-col');
        col.style.left = '0px';
        col.style.width = main.getBoundingClientRect().width + 'px';
        const res = col.firstElementChild;
        res.classList.add('contacts-res');
        const [head, list, skeleton, detail] = res.children;
        head.classList.add('contacts-head');
        head.lastElementChild.classList.add('contacts-busy');
        list.classList.add('contacts-list');
        skeleton.classList.add('contacts-skeleton');
        detail.classList.add('contacts-detail');
        const columns = ctx.util.el('div', 'contacts-columns', res);
        ['Name', 'Company', 'Phone'].forEach(label =>
          ctx.util.el('span', 'contacts-column', columns, label));
        res.insertBefore(columns, list);
        for (const row of skeleton.children) {
          row.classList.add('contacts-placeholder');
          row.style.height = '37px';
          row.replaceChildren();
          for (let i = 0; i < 3; i++)
            ctx.util.el('div', 'contacts-placeholder-bar', row);
        }
        return view;
      },
      ensureStyle: (base) => () => {
        base();
        if (document.getElementById('contacts-design')) return;
        const style = document.createElement('style');
        style.id = 'contacts-design';
        style.textContent = `
        .contacts-arena { background:#fff; border:0; border-radius:0; box-shadow:none; }
        .contacts-body { padding:0; gap:0; }
        .contacts-main { align-items:stretch; justify-content:stretch; }
        .contacts-col { gap:0; }
        .contacts-res { display:flex; flex-direction:column; border:0; border-radius:0; background:#fff; }
        .contacts-head { flex:none; height:68px; padding:0; border:0; background:#fff; color:#080808; font:bold 32px "Times New Roman",serif; }
        .contacts-columns { flex:none; display:grid; grid-template-columns:1.4fr 1.4fr .85fr; gap:4.5%; height:42px; padding:7px 18px; border:1px solid #aaa; background:#d9d9d9; font-weight:bold; }
        .contacts-list, .contacts-skeleton { flex:1; min-height:0; overflow:auto; border:1px solid #b7b9bb; background:#fff; }
        .contacts-placeholder { display:grid; grid-template-columns:1.4fr 1.4fr .85fr; gap:4.5%; padding:0 16px; border:0; background:#fff; }
        .contacts-placeholder-bar { height:22px; background:#e2e5e8; }
        .contacts-busy { position:absolute; left:50%; top:58%; transform:translate(-50%,-50%); z-index:2; flex-direction:column; gap:7px; padding:8px 12px; background:#ffffffd9; color:#080808; font:22px "Times New Roman",serif; }
        .contacts-busy svg { width:70px; height:70px; }
        .contacts-busy .ut-spin-track { stroke:#ddd; }
        .contacts-busy .ut-spin-arc { stroke:#555; }
        .contacts-list .ut-row2 { background:#fff; }
        .contacts-list .ut-rn b { color:#080808; white-space:normal; overflow:visible; text-overflow:clip; font-size:20px; }
        .contacts-detail { inset:110px 0 0; overflow:auto; background:#fff; z-index:3; }
        @media(max-width:1100px) { .contacts-head { font-size:26px; } .contacts-list .ut-rn b { font-size:18px; } }
        `;
        document.head.append(style);
      },
    },
  },
});
