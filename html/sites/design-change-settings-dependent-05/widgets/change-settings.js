// Design on the change-settings/preferences template; defaults reproduce the reference scaffold.
env.widget({
  task: 'change-settings',
  site: 'design-change-settings-dependent-05',
  name: 'design',
  split: 'train',
  scenarios: ['dependent'],
  template: 'change-settings/preferences',
  design: {
    widthInset: 24, widthMax: 1600, tabWidthMin: 700, sideTabsAt: 700,
    titleSize: '0px', labelSize: '17px', detailSize: '14px', rowHeight: 74,
    minRowHeight: 32, descriptionAt: 0, onOffChance: 0, bottomSpace: 0,
    subtitles: [''], placeholders: ['Search settings...'],
    parts: {
      row: (base, S) => (ctx, panel, setting, depth) => {
        const row = base(ctx, panel, setting, depth);
        const label = setting.label.toLowerCase();
        const kind = /notif|alert|remind/.test(label) ? 'bell'
          : /guest|shar|invite|team|member|access/.test(label) ? 'people'
          : /offline|download|sync|backup/.test(label) ? 'download'
          : /battery|power/.test(label) ? 'battery'
          : /time|length|date|schedule/.test(label) ? 'clock' : 'screen';
        const shapes = {
          bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
          people: '<circle cx="8" cy="8" r="3"/><circle cx="17" cy="8" r="3"/><path d="M2 20v-2a6 6 0 0 1 12 0v2ZM14 14a6 6 0 0 1 8 6v0h-6"/>',
          download: '<path d="M12 2v13m-5-5 5 5 5-5M3 17v4h18v-4"/>',
          battery: '<rect x="2" y="6" width="18" height="12" rx="2"/><path d="M22 10v4M6 12h7"/>',
          clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
          screen: '<rect x="2" y="3" width="20" height="15" rx="1"/><path d="M8 22h8m-4-4v4"/>',
        };
        const icon = ctx.util.el('span', 'setting-icon', row);
        icon.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + shapes[kind] + '</svg>';
        return row;
      },
      navigation: (base, S) => (ctx, body) => {
        if (!S.geo.long) return base(ctx, body);
        const tabs = ctx.util.el('nav', 'sp-index', body);
        for (const [i, section] of ctx.spec.sections.entries()) {
          const tab = ctx.util.el('a', i === 0 ? 'active' : '', tabs, section.title);
          tab.href = '#';
          tab.addEventListener('click', (e) => {
            e.preventDefault();
            const heading = S.els.secEls[section.id];
            const panel = S.els.panel;
            if (heading && panel) panel.scrollTop = heading.offsetTop - panel.offsetTop;
            for (const link of tabs.children) link.classList.toggle('active', link === tab);
          });
          S.els.navEls[section.id] = tab;
        }
      },
      footer: (base, S) => (ctx, card) => {
        const result = base(ctx, card);
        if (S.geo.long) {
          const spacer = card.lastElementChild;
          if (spacer !== result.foot && !spacer.className) spacer.remove();
          if (S.els.headSave && result.saveBtn === S.els.headSave) result.foot.append(result.saveBtn);
        }
        return result;
      },
      panel: (base, S) => (ctx, body) => {
        const panel = base(ctx, body);
        if (!S.geo.long) {
          panel.style.maxHeight = '100%';
          panel.style.boxSizing = 'border-box';
        }
        return panel;
      },
      select: (base, S) => (ctx, row, setting) => {
        const control = base(ctx, row, setting);
        // Menus belong above the scrolling rows, without being clipped by them.
        S.els.card.append(control.pop);
        return control;
      },
      paintRow: (base, S) => (model, id, row, visible, query) => {
        base(model, id, row, visible, query);
        if (!S.geo.long && S.ctx.size.height < 620) {
          Object.assign(row.row.style, { minHeight: '32px', padding: '4px 10px', gap: '4px 10px' });
          row.row.querySelector('.lab b').style.fontSize = '15px';
          if (row.kind === 'toggle') Object.assign(row.ctl.style, { width: '24px', height: '24px', lineHeight: '19px' });
          else if (row.kind === 'select') row.ctl.style.height = '30px';
          for (const heading of S.els.card.querySelectorAll('.sp-sec')) Object.assign(heading.style, { fontSize: '18px', padding: '4px 10px', marginBottom: '6px' });
        }
        if (row.kind !== 'select' || model.open !== id || !visible.has(id)) return;
        const card = S.els.card;
        const bounds = card.getBoundingClientRect();
        const trigger = row.ctl.getBoundingClientRect();
        const stage = S.ctx.stage.getBoundingClientRect();
        const menuHeight = row.pop.getBoundingClientRect().height;
        const top = Math.max(4, stage.top);
        const bottom = Math.min(window.innerHeight - 4, stage.bottom);
        const below = trigger.bottom - 4;
        const y = below + menuHeight <= bottom ? below : trigger.top - menuHeight + 4;
        row.pop.style.top = Math.max(top, Math.min(y, bottom - menuHeight)) - bounds.top - card.clientTop + 'px';
        row.pop.style.bottom = '';
        row.pop.style.right = Math.max(2, bounds.right - trigger.right) + 'px';
      },
      pointOf: (base, S) => (el) => {
        const panel = S.els.panel;
        const tabs = el.closest && el.closest('.sp-tabs, .sp-index');
        if (tabs && tabs.contains(el)) {
          const r = el.getBoundingClientRect();
          const t = tabs.getBoundingClientRect();
          if (r.right > t.right - 4) tabs.scrollLeft += r.right - t.right + 16;
          else if (r.left < t.left + 4) tabs.scrollLeft += r.left - t.left - 16;
        }
        if (panel && panel.contains(el)) {
          const r = el.getBoundingClientRect();
          const p = panel.getBoundingClientRect();
          if (r.bottom > p.bottom - 8) panel.scrollTop += r.bottom - p.bottom + 16;
          else if (r.top < p.top + 8) panel.scrollTop += r.top - p.top - 16;
        }
        return base(el);
      },
    },
  },
});
