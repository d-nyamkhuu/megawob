// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-rename-03',
  name: 'design',
  split: 'train',
  scenarios: ['rename'],
  template: 'use-file-manager/explorer',
  design: {
    tileGap: 18,
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
          const frame = bar.parentElement;
          const address = ctx.util.el('div', 'win-address-row', frame);
          frame.insertBefore(address, bar);
          const nav = ctx.util.el('div', 'win-nav', address);
          nav.appendChild(S.els.backBtn);
          const forward = ctx.util.el('button', 'win-nav-button', nav, '→');
          forward.type = 'button'; forward.title = 'Forward'; forward.disabled = true;
          nav.appendChild(S.els.upBtn);
          const refresh = ctx.util.el('button', 'win-nav-button win-refresh', nav, '⟳');
          refresh.type = 'button'; refresh.title = 'Refresh';
          refresh.addEventListener('click', () => ctx.log('refresh', {}));
          address.appendChild(S.els.crumbs);
          const search = ctx.util.el('div', 'win-search', address, 'Search Downloads');
          ctx.util.el('span', 'win-search-icon', search, '⌕');
          const newBtn = ctx.util.el('button', 'win-new', bar, '⊕  New ⌄');
          bar.insertBefore(newBtn, bar.firstChild);
          newBtn.type = 'button'; newBtn.addEventListener('click', () => ctx.log('new', {}));
          const lead = ctx.util.el('span', 'win-tool-icons', bar);
          lead.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="18" r="2.2"/><path d="M7.6 16.5 17 4M16.4 16.5 7 4"/></svg><svg viewBox="0 0 24 24"><rect x="8" y="5" width="11" height="14" rx="1"/><path d="M5 8v12h11"/></svg><svg viewBox="0 0 24 24"><rect x="6" y="5" width="13" height="16" rx="1"/><path d="M9 3h6M10 8h5"/></svg><svg viewBox="0 0 24 24"><rect x="4" y="7" width="16" height="12" rx="1"/><path d="m10 12 4-4 2 2-4 4-3 1z"/></svg>';
          bar.insertBefore(lead, S.els.trashBtn);
          const sort = ctx.util.el('span', 'win-sort', bar, '↕  Sort ⌄');
          const view = ctx.util.el('span', 'win-view', bar, '▤  View ⌄');
          const more = ctx.util.el('span', 'win-more', bar, '⋯');
          const details = ctx.util.el('span', 'win-details', bar, '▣  Details');
        };
      },
      body(base, S) {
        return (ctx) => {
          base(ctx);
          const frame = S.els.bodyEl.parentElement;
          const stage = frame.parentElement;
          const title = frame.querySelector('.fm-title');
          if (title) {
            title.textContent = '';
            const tab = ctx.util.el('span', 'win-active-tab', title);
            const tabName = ctx.util.el('span', 'win-active-name', tab, 'Downloads');
            ctx.util.el('span', 'win-active-close', tab, '×');
            ctx.util.el('span', 'win-active-plus', title, '+');
            const updateTitle = () => {
              const crumbs = Array.from(S.els.crumbs.querySelectorAll('.fm-crumb'));
              if (crumbs.length) tabName.textContent = crumbs[crumbs.length - 1].textContent.trim();
            };
            updateTitle();
            new MutationObserver(updateTitle).observe(S.els.crumbs, { childList: true, subtree: true, characterData: true });
          }
          const bg = ctx.util.el('div', 'win-background', stage);
          stage.insertBefore(bg, frame);
          bg.innerHTML = `<div class="bg-address"><span>‹　›　↑　⟳</span><div class="bg-path">▣　This PC　›</div><div class="bg-search">Search This PC　⌕</div></div><div class="bg-toolbar"><span>⊕　New　⌄</span><span>✂　　▢　　▣　　↗</span><span>↕　Sort　⌄</span><span>▤　View　⌄</span><span>⋯</span></div><div class="bg-layout"><div class="bg-side"><div>Home</div><div>Desktop</div><div>Documents</div><div>Downloads</div><div>Pictures</div><div>Music</div><div>Videos</div><div class="bg-current">This PC</div><div>Local Disk (C:)</div><div>Network</div></div><div class="bg-content"><div class="bg-section">⌄　Folders</div><div class="bg-folders"><span>Desktop</span><span>Documents</span><span>Downloads</span><span>Pictures</span><span>Music</span><span>Videos</span></div><div class="bg-section">⌄　Devices and drives</div><div class="bg-drive">Local Disk (C:)<div class="bg-meter"></div><small>312 GB free of 476 GB</small></div></div></div>`;
        };
      },
    },
  },
});
