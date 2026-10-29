// Design on the change-settings/preferences template; defaults reproduce the reference scaffold.
env.widget({
  task: 'change-settings',
  site: 'design-change-settings-toggle-02',
  name: 'design',
  split: 'train',
  scenarios: ['toggle'],
  template: 'change-settings/preferences',
  design: {
    foreground: '#e4e8ee', muted: '#aeb6c1', panel: '#1c2228',
    background: '#111519', line: '#434b53', accent: '#1685ef',
    // Retain the sampled long-page or section-tab presentation and all RNG draws.
    parts: {
      style: (base) => (ctx) => {
        base(ctx);
        if (document.getElementById('carbon-preferences-style')) return;
        const style = ctx.util.el('style', '', document.head);
        style.id = 'carbon-preferences-style';
        style.textContent = `
          .sp-head .t { display:none; }
          .sp-head { padding:10px 22px; padding-left:calc(clamp(150px,17vw,258px) + 22px); }
          .sp-search { flex:1; width:auto; }
          .sp-tabs { width:clamp(150px,17vw,258px); padding:12px 0; }
          .sp-tab { white-space:normal; }
          .sp-panel { padding:4px 24px 8px; }
          .sp-row { padding:2px; }
          .sp-switch { width:92px; height:34px; }
          .sp-switch::after { top:2px; left:2px; width:28px; height:28px; }
          .sp-switch.on::after { left:60px; }
          .sp-foot { padding:5px 18px; }
        `;
      },
      wrap: (base) => (ctx) => {
        const wrap = base(ctx);
        Object.assign(wrap.style, { margin: '0', width: '100%', minHeight: '100%' });
        return wrap;
      },
      width: (base) => (ctx) => { base(ctx); return ctx.size.width; },
      card: (base, S) => (ctx, wrap) => {
        const card = base(ctx, wrap);
        if (!S.geo.long) card.style.height = ctx.size.height + 'px';
        card.style.boxSizing = 'border-box';
        return card;
      },
      geometry: (base, S) => (ctx) => {
        const geo = base(ctx);
        const headH = S.els.head.getBoundingClientRect().height;
        const rowH = Math.max(28, Math.min(44, Math.floor((ctx.size.height - headH - 112) / env.taskDef.helpers.RESULT_CAP)));
        return { ...geo, sideTabs: true, rowH, showDesc: false };
      },
      panel: (base) => (ctx, body) => {
        const panel = base(ctx, body);
        panel.style.height = 'auto';
        panel.style.minHeight = '0';
        return panel;
      },
      navigation: (base, S) => (ctx, body) => {
        base(ctx, body);
        const links = Object.values(S.els.navEls);
        if (links.length) links[0].parentElement.style.top = '0px';
      },
      indexLink: (base, S) => (ctx, index, section) => {
        const link = base(ctx, index, section);
        link.addEventListener('click', (event) => {
          event.preventDefault();
          const heading = S.els.secEls[section.id];
          ctx.stage.scrollTop += heading.getBoundingClientRect().top - ctx.stage.getBoundingClientRect().top - 12;
        });
        return link;
      },
      tab: (base) => (ctx, tabs, section) => {
        const tab = base(ctx, tabs, section);
        tab.style.padding = ctx.size.height < 330 ? '7px 12px' : '16px 20px';
        return tab;
      },
      place: (base, S) => (ctx) => {
        base(ctx);
        S.els.wrap.style.marginTop = '0';
      },
    },
  },
});
