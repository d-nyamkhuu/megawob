// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-rename-01',
  name: 'design',
  split: 'train',
  scenarios: ['rename'],
  template: 'use-file-manager/explorer',
  design: {
    tileGap: 22,
    parts: {
      sizes(base, S) {
        return (ctx) => {
          // The inspector shares the body with the tree and file pane. Size the
          // grid from that pane rather than the template's two-column estimate.
          const { pane } = S.els;
          S.geo = {
            paneW: pane.clientWidth - 16,
            paneH: pane.clientHeight - 20,
          };
          base(ctx);
        };
      },
      toolbar(base, S) {
        return (ctx) => {
          base(ctx);
          const { bar } = S.els;
          const label = (button, text) => {
            const span = ctx.util.el('span', 'xp-tool-label', button, text);
            span.setAttribute('aria-hidden', 'true');
          };
          S.els.backBtn.innerHTML = '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#31a51d" stroke="#257f19" stroke-width="2"/><path d="M22 10L12 20l10 10M13 20h16" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
          label(S.els.backBtn, 'Back');
          label(S.els.upBtn, 'Up');
          label(S.els.trashBtn, 'Delete');
          const add = (icon, label, title, disabled = false) => {
            const b = S.P.ib(icon, label, title);
            if (disabled) b.disabled = true;
            return b;
          };
          const forward = add('<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>', '', 'Forward', true);
          forward.innerHTML = '<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" fill="#d7d7d7" stroke="#aaa" stroke-width="2"/><path d="M18 10l10 10-10 10M27 20H12" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
          label(forward, 'Forward');
          bar.insertBefore(forward, S.els.upBtn);
          const search = add('<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="#4076b6" stroke-width="2"/><path d="M15.5 15.5L21 21" stroke="#4076b6" stroke-width="2.5"/></svg>', 'Search', 'Search');
          search.dataset.role = 'xtra';
          search.addEventListener('click', () => S.ctx.log('decoy', { label: 'Search' }));
          const folders = add('<svg viewBox="0 0 24 24"><path d="M2 6h8l2 2h10v12H2z" fill="#f5c33b" stroke="#b1841b"/><path d="M2 9h20" stroke="#fff1ad" stroke-width="2"/></svg>', 'Folders', 'Folders');
          folders.dataset.role = 'xtra';
          folders.addEventListener('click', () => S.ctx.log('decoy', { label: 'Folders' }));
          bar.insertBefore(search, S.els.crumbs);
          bar.insertBefore(folders, S.els.crumbs);
          const address = ctx.util.el('div', 'xp-address-row', bar.parentElement);
          ctx.util.el('span', 'xp-address-label', address, 'Address');
          address.appendChild(S.els.crumbs);
          const go = ctx.util.el('button', 'xp-go', address, '➜');
          go.type = 'button';
          go.title = 'Go';
          go.addEventListener('click', () => ctx.log('decoy', { label: 'Go' }));
        };
      },
      body(base, S) {
        return (ctx) => {
          base(ctx);
          const { bodyEl, main } = S.els;
          const inspector = ctx.util.el('aside', 'xp-inspector', bodyEl);
          S.els.inspector = inspector;
          const selected = ctx.model.selected && ctx.model.selected[0];
          const item = selected && ctx.spec.items && ctx.spec.items.find((x) => x.id === selected);
          const fileName = item ? item.name : 'PXL_20210428_762409343.svg';
          const head = ctx.util.el('div', 'xp-inspector-head', inspector);
          head.innerHTML = '<svg viewBox="0 0 32 36" aria-hidden="true"><path d="M4 1h16l8 8v25H4z" fill="#fff" stroke="#777" stroke-width="2"/><path d="M20 1v9h8" fill="#e9eef7" stroke="#777"/><circle cx="16" cy="20" r="7" fill="#36aadd"/><path d="M10 19q6-7 12 0M12 25q4-3 8 0" fill="none" stroke="#f5cf22" stroke-width="2"/></svg>';
          ctx.util.el('span', 'xp-head-name', head, fileName);
          const preview = ctx.util.el('div', 'xp-preview', inspector);
          preview.innerHTML = '<svg class="xp-svg-art" viewBox="0 0 100 136" aria-hidden="true"><path d="M13 2h51l22 22v108H13z" fill="#fff" stroke="#777" stroke-width="2"/><path d="M64 2v24h22" fill="#e6eaf0" stroke="#777" stroke-width="2"/><circle cx="50" cy="68" r="23" fill="#20a8e0" stroke="#1679ad" stroke-width="2"/><path d="M30 62q10-12 19-5l-5 9-9 2zM51 48l10 4 5 9-8 3-4-6-8 1zM41 72l11 3 4 11-8 6-9-10zM62 72l9-2-3 12-8 4z" fill="#f3d52e"/><rect x="27" y="101" width="46" height="20" rx="2" fill="#279c14"/><text x="50" y="116" text-anchor="middle" fill="white" font-family="Arial" font-weight="bold" font-size="16">SVG</text></svg>';
          ctx.util.el('div', 'xp-file-name', inspector, fileName);
          ctx.util.el('div', 'xp-kind', inspector, 'SVG Document');
          ctx.util.el('div', 'xp-rule', inspector);
          const metadata = ctx.util.el('div', 'xp-metadata', inspector);
          for (const [k, v] of [['Date Modified:', 'Apr 28, 2021 10:24 AM'], ['Size:', '236 KB'], ['Dimensions:', '1024 x 768']]) {
            const row = ctx.util.el('div', 'xp-meta-row', metadata);
            ctx.util.el('span', '', row, k);
            ctx.util.el('span', '', row, v);
          }
          main.style.flex = '1 1 0';
        };
      },
    },
  },
});
