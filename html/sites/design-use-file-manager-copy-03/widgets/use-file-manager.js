// Design on the shared use-file-manager/explorer template.
env.widget({
  task: 'use-file-manager',
  site: 'design-use-file-manager-copy-03',
  name: 'design',
  split: 'train',
  scenarios: ['copy'],
  template: 'use-file-manager/explorer',
  design: {
    margin: 0,
    titleHeight: 0,
    toolbarHeight: 93,
    windowRadius: 0,
    fontSize: 14,
    parts: {
      fit(base, S) {
        return (ctx) => {
          base(ctx);
          S.geo = { left: 0, top: 0, winW: ctx.size.width, winH: ctx.size.height };
        };
      },
      title(base, S) {
        return (ctx) => {
          base(ctx);
          S.els.title.remove();
        };
      },
      paneSize(base, S) {
        return (ctx) => {
          base(ctx);
          const { winW } = S.geo;
          const treeW = Math.round(Math.max(150, winW * 0.24));
          const relatedW = Math.round(Math.max(138, winW * 0.25));
          S.geo = { treeW, paneW: winW - treeW - relatedW - 3 };
        };
      },
      body(base, S) {
        return (ctx) => {
          base(ctx);
          const { winW, treeW, paneW } = S.geo;
          const related = ctx.util.el('div', 'fm-related', S.els.bodyEl);
          related.style.flex = `0 0 ${winW - treeW - paneW - 3}px`;
          related.textContent = 'Related Items\nName  ▲                 Type\nBudget                  File Folder\nResources             File Folder\nAgenda.doc      Microsoft Word…\nNotes.txt             Text Document\nProject plan.pdf  Adobe Acrobat…\nUntitled 1.pdf    Adobe Acrobat…\nMinutes walkthrough…  MP4 Video\nMockup.png            PNG Image\nSchedule.xls    Microsoft Excel…\nTodo.txt             Text Document';
        };
      },
      toolbar(base, S) {
        return (ctx) => {
          base(ctx);
          const { util } = ctx;
          const E = S.els;
          const win = E.win;
          const old = E.bar;
          E.backBtn.textContent = 'Back';
          E.upBtn.textContent = 'Up';
          const menu = util.el('div', 'fm-menurow', win);
          menu.textContent = 'File    Edit    View    Favorites    Tools    Help';
          const commands = util.el('div', 'fm-commandrow', win);
          const address = util.el('div', 'fm-addressrow', win);
          util.el('span', 'fm-address-label', address, 'Address');
          const kids = [...old.children];
          const crumbs = E.crumbs;
          const forward = util.el('button', 'fm-ib fm-forward', commands, 'Forward');
          forward.type = 'button'; forward.disabled = true;
          const search = util.el('button', 'fm-ib fm-search', commands, '⌕　Search');
          const folders = util.el('button', 'fm-ib fm-folders', commands, '📁　Folders');
          for (const node of [E.backBtn, forward, E.upBtn, search, folders, ...kids.filter((n) => n !== crumbs && n !== E.backBtn && n !== E.upBtn)]) commands.appendChild(node);
          address.appendChild(crumbs);
          for (const [button, label] of [[search, 'Search'], [folders, 'Folders']]) {
            button.addEventListener('click', () => ctx.log('decoy', { label }));
          }
          win.insertBefore(menu, old);
          win.insertBefore(commands, old);
          win.insertBefore(address, old);
          old.remove();
          E.bar = commands;
        };
      },
    },
  },
});
