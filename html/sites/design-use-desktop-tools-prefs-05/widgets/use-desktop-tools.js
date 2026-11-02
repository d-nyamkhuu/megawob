// Design on templates/use-desktop-tools/base.js: the base site's use-desktop-tools widget for this scenario, unchanged.
// Restyle it in site.css, set the template's tokens and replace the parts the design draws differently
// (design: { parts: { name: (base, S) => replacement } }; templates/README.md).
env.widget({
  task: 'use-desktop-tools',
  site: 'design-use-desktop-tools-prefs-05',
  name: 'design',
  split: 'train',
  scenarios: ['prefs'],
  template: 'use-desktop-tools/base',
  design: { parts: {
    frame: (base) => function (ctx) {
      // Let the template consume exactly its original draws and retain its anchors.
      const chrome = base(ctx);
      const { util } = ctx;
      chrome.win.classList.add('wb-files-window');
      const slot = document.querySelector('.wb-prefs-slot');
      slot.textContent = '';
      document.querySelectorAll('.wb-app-dropdown').forEach(node => node.remove());
      chrome.gear.className = 'wb-prefs';
      chrome.gear.innerHTML = window.wbIcon('gear') + '<span>Preferences</span>';
      slot.appendChild(chrome.gear);
      if (chrome.appMenu) {
        chrome.gear.classList.add('wb-gear-only');
        chrome.appMenu.className = 'wb-prefs-menu';
        chrome.appMenu.textContent = 'Preferences';
        slot.appendChild(chrome.appMenu);
      }
      const browser = util.el('div', 'wb-browser', chrome.main);
      const sidebar = util.el('aside', 'wb-file-sidebar', browser);
      [['My Files','Files'],['Starred','star'],['Recent','recent'],['Shared','shared'],['Trash','trash'],['Documents','Files'],['Pictures','Files'],['Music','Files'],['Videos','Files'],['Projects','Files'],['Downloads','Files']].forEach(([name, icon], i) => {
        const row = util.el('div', 'wb-file-link' + (i === 0 ? ' active' : '') + (i === 5 ? ' separated' : ''), sidebar);
        row.innerHTML = window.wbIcon(icon);
        util.el('span', '', row, name);
      });
      const content = util.el('section', 'wb-file-content', browser);
      const toolbar = util.el('div', 'wb-file-toolbar', content);
      util.el('span', 'wb-back', toolbar, '‹');
      util.el('span', 'wb-forward', toolbar, '›');
      const title = util.el('b', 'wb-folder-title', toolbar);
      title.innerHTML = window.wbIcon('Files') + '<span>My Files</span>';
      const views = util.el('div', 'wb-views', toolbar);
      util.el('span', 'selected', views).innerHTML = window.wbIcon('list');
      util.el('span', '', views).innerHTML = window.wbIcon('grid');
      util.el('div', 'wb-sort', toolbar, 'Name ﹀');
      const search = util.el('div', 'wb-file-search', toolbar);
      search.innerHTML = window.wbIcon('search') + '<span>Search files</span>';
      const table = util.el('div', 'wb-file-table', content);
      const head = util.el('div', 'wb-file-row wb-file-head', table);
      ['Name ⌃', 'Modified', 'Size', 'Type'].forEach(t => util.el('span', '', head, t));
      [
        ['Design','Apr 12, 2025  10:24 AM','—','Folder','Files'],
        ['Documents','Apr 10, 2025  2:11 PM','—','Folder','Files'],
        ['Ideas','Apr 8, 2025  9:03 AM','—','Folder','Files'],
        ['Projects','Apr 15, 2025  4:36 PM','—','Folder','Files'],
        ['Vacation','Mar 28, 2025  1:20 PM','—','Folder','Files'],
        ['beach.jpg','Mar 28, 2025  1:18 PM','2.4 MB','JPEG image','image'],
        ['Budget.xlsx','Apr 14, 2025  3:02 PM','18 KB','Excel spreadsheet','document'],
        ['Project Plan.pdf','Apr 12, 2025  11:06 AM','560 KB','PDF document','pdf'],
        ['Readme.txt','Mar 25, 2025  9:14 AM','4 KB','Text document','document'],
        ['Roadmap.png','Apr 11, 2025  5:07 PM','310 KB','PNG image','image'],
        ['Summary.docx','Apr 9, 2025  4:22 PM','28 KB','Word document','document'],
        ['Travel Guide.pdf','Mar 30, 2025  10:15 AM','1.2 MB','PDF document','pdf']
      ].forEach(([name, date, size, type, icon], i) => {
        const row = util.el('div', 'wb-file-row', table);
        const cell = util.el('span', 'wb-file-name wb-file-kind-' + icon + (i === 6 ? ' excel' : '') + (i === 8 ? ' text' : ''), row);
        cell.innerHTML = window.wbIcon(icon);
        util.el('span', '', cell, name);
        [date,size,type].forEach(t => util.el('span', '', row, t));
      });
      chrome.dashboard = browser;
      return chrome;
    },
    buildPrefs: (base) => function (ctx, main, chrome) {
      const view = base(ctx, main, chrome);
      let portals = [];
      // Keep the home view and every dialog handler in the original builder.
      // Only its welcome panel is concealed behind the reference's Files browser.
      const decorate = () => {
        if (!chrome.dashboard.isConnected) main.prepend(chrome.dashboard);
        for (const child of main.children) {
          if (child !== chrome.dashboard && /Welcome back|Pick up where you left off/.test(child.textContent) && !child.textContent.includes('Reset all')) child.classList.add('wb-welcome');
        }
        // The template anchors its title menu to the window. Its opener now lives
        // in the workspace bar, so place that same menu next to the moved opener.
        if (chrome.appMenu) {
          const menus = Array.from(chrome.win.querySelectorAll('[class*="menu"]')).filter(node => node.tagName !== 'BUTTON' && !node.parentElement.closest('[class*="menu"]'));
          const opener = chrome.appMenu.getBoundingClientRect();
          portals = menus.map(node => {
            const parent = node.parentElement;
            document.body.appendChild(node);
            node.classList.add('wb-app-dropdown');
            Object.assign(node.style, { position: 'fixed', top: (opener.bottom + 4) + 'px', left: Math.max(4, opener.right - 200) + 'px', zIndex: '2000' });
            return { node, parent };
          });
        }
      };
      const sync = view.sync;
      view.sync = function (m) {
        for (const { node, parent } of portals) if (node.isConnected) parent.appendChild(node);
        portals = [];
        const result = sync.call(view, m);
        decorate();
        return result;
      };
      decorate();
      return view;
    }
  } },
});
