// Design on the change-settings/preferences template; defaults reproduce the reference scaffold.
env.widget({
  task: 'change-settings',
  site: 'design-change-settings-toggle-05',
  name: 'design',
  split: 'train',
  scenarios: ['toggle'],
  template: 'change-settings/preferences',
  design: {
    bottomSpace: 8,
    rowHeight: 40,
    minRowHeight: 32,
    descriptionAt: 0,
    parts: {
      width: (base) => (ctx) => {
        base(ctx); // Retain the template's seeded width draw.
        const available = ctx.stage.getBoundingClientRect().width || ctx.size.width;
        const desired = available;
        return Math.max(480, Math.min(ctx.size.width, desired));
      },
      wrap: (base) => (ctx) => {
        const wrap = base(ctx);
        Object.assign(wrap.style, {
          position: 'relative', zIndex: '2', flex: 'none',
          alignSelf: 'flex-start', margin: '0', padding: '0',
        });
        return wrap;
      },
      card: (base, S) => (ctx, wrap) => {
        const card = base(ctx, wrap);
        card.style.paddingTop = '36px';
        if (!S.geo.long) {
          const stageStyle = getComputedStyle(ctx.stage);
          const inset = parseFloat(stageStyle.paddingTop) + parseFloat(stageStyle.paddingBottom);
          const dock = ctx.size.width > 1100 ? 98 : 70;
          card.style.height = Math.max(240, ctx.size.height - 44 - dock - inset) + 'px';
        }
        return card;
      },
      panel: (base, S) => (ctx, body) => {
        const panel = base(ctx, body);
        if (!S.geo.long) panel.style.overflow = 'auto';
        return panel;
      },
      navigation: (base, S) => (ctx, body) => {
        if (!S.geo.long) return base(ctx, body);
        const tabs = ctx.util.el('nav', 'sp-index', body);
        for (const section of ctx.spec.sections) {
          const a = S.P.indexLink(ctx, tabs, section);
          a.addEventListener('click', (e) => {
            e.preventDefault();
            const panel = S.els.panel;
            panel.scrollTop += S.els.secEls[section.id].getBoundingClientRect().top - panel.getBoundingClientRect().top - 8;
          });
          S.els.navEls[section.id] = a;
        }
      },
      pointOf: (base, S) => (el) => {
        const panel = S.els.panel;
        if (panel && panel.contains(el)) {
          const box = panel.getBoundingClientRect();
          const rect = el.getBoundingClientRect();
          if (rect.top < box.top + 3 || rect.bottom > box.bottom - 3) {
            panel.scrollTop += rect.top - box.top - (box.height - rect.height) / 2;
          }
        }
        return base(el);
      },
      footer: (base) => (ctx, card) => {
        const actions = base(ctx, card);
        const inspector = document.querySelector('.nx-status-box');
        if (inspector) {
          actions.foot.classList.add('nx-actions');
          inspector.append(actions.foot);
        }
        return actions;
      },
      label: (base) => (ctx, row, setting, section) => {
        const tag = base(ctx, row, setting, section);
        row.classList.add('nx-row-' + setting.kind);
        return tag;
      },
      place: (base, S) => (ctx) => {
        base(ctx);
        S.els.wrap.style.marginTop = '0';
      },
      paint: (base, S) => {
        let previousPanel, previousShape;
        return (model) => {
          const shape = JSON.stringify([
            model.tab, model.query,
            env.taskDef.helpers.visibleIds(model, S.spec),
          ]);
          base(model);
          for (const id in S.els.tabEls) S.els.tabEls[id].classList.toggle('on', !model.query && id === model.tab);
          const inspector = document.querySelectorAll('.nx-status-r span:last-child');
          if (inspector.length === 3) {
            const changes = Object.values(S.els.rows).length && env.taskDef.helpers.isDirty(model, S.spec);
            inspector[0].textContent = model.saves ? 'Custom' : 'Default';
            inspector[1].textContent = changes ? 'Pending' : '0';
            inspector[2].textContent = model.saves ? 'Saved' : 'Never';
          }
          if (previousPanel === S.els.panel && previousShape !== shape) S.ctx.reanchor();
          previousPanel = S.els.panel;
          previousShape = shape;
        };
      },
    },
  },
});
