// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) =>
      function (_c) {
        const { display, nav, rng, util } = _c;
        const { TITLES } = S;
        const header = util.el('header', 'ref-task', document.body);
        // Keep the design's application identity present in every instruction mode.
        // Preserve the original title draw when this branch used to render a generic brand.
        let title = 'Files';
        if (display !== 'header' || nav) rng.pick(TITLES);
        const brand = util.el('div', 'ref-brand', header, 'Project Files');
        brand.dataset.role = 'brand';
        Object.assign(_c, { brand, header, title });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, util } = _c;
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        else util.el('div', 'ref-spacer', header);
        const search = util.el('div', 'fm-search', header);
        util.el('span', 'fm-search-icon', search, '⌕');
        const searchText = util.el('span', 'fm-search-text', search, 'Search files');
        searchText.setAttribute('aria-label', 'Search files');
        const launcher = util.el('div', 'fm-launcher', header, '⠿');
        launcher.setAttribute('aria-label', 'Applications');
        const account = util.el('div', 'fm-account', header, '●');
        account.setAttribute('aria-label', 'Account');
        Object.assign(_c, { account, launcher, search, searchText });
      },
    'frame.body': (base, S) =>
      function (_c) {
        const { util } = _c;
        const body = util.el('div', 'ref-body', document.body);
        const appMenu = util.el('div', 'fm-menubar', document.body);
        for (const item of ['File', 'Edit', 'View', 'Go', 'Bookmarks', 'Tools', 'Help'])
          util.el('span', '', appMenu, item);
        const appTools = util.el('div', 'fm-app-toolbar', document.body);
        for (const [icon, label] of [
          ['←', 'Back'],
          ['→', 'Forward'],
          ['↑', 'Up'],
          ['▱', 'New folder'],
          ['▤', 'Copy'],
          ['▣', 'Paste'],
          ['▤', 'Delete'],
          ['⇄', 'Rename'],
          ['ⓘ', 'Properties'],
        ]) {
          const item = util.el('div', 'fm-tool', appTools);
          util.el('span', 'fm-tool-icon', item, icon);
          util.el('span', '', item, label);
        }
        S.frameSidebar(_c, body);
        Object.assign(_c, { appMenu, appTools, body });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const inspector = util.el('aside', 'fm-inspector', body);
        util.el('strong', 'fm-recent-title', inspector, 'Recent');
        for (const [icon, name, time] of [
          ['▤', 'Project Plan.docx', 'Today 10:24 AM'],
          ['▧', '20210802_meeting-notes.csv', 'Today 10:18 AM'],
          ['◉', 'Proposal v2 FINAL.fig', 'Today 9:52 AM'],
          ['▧', 'UI-mockup.png', 'Yesterday 4:37 PM'],
          ['▧', 'Budget.xlsx', 'Yesterday 3:12 PM'],
          ['▱', 'Client - Kinship Family', 'Aug 1, 2021'],
          ['▤', 'Research Notes.txt', 'Jul 30, 2021'],
          ['▧', 'Website Brief.pdf', 'Jul 29, 2021'],
          ['▱', 'Assets', 'Jul 28, 2021'],
          ['▤', 'Meeting Agenda.docx', 'Jul 27, 2021'],
          ['▧', 'Brand Guidelines.pdf', 'Jul 26, 2021'],
          ['◉', 'Product Screens.fig', 'Jul 25, 2021'],
          ['▱', 'Team Photos', 'Jul 24, 2021'],
          ['▤', 'Draft Slides.pptx', 'Jul 22, 2021'],
        ]) {
          const row = util.el('div', 'fm-recent-row', inspector);
          util.el('span', 'fm-recent-icon', row, icon);
          const copy = util.el('span', 'fm-recent-copy', row);
          util.el('span', '', copy, name);
          util.el('small', '', copy, time);
        }
        const identity = util.el('div', 'fm-inspector-identity', inspector);
        util.el('span', 'fm-folder-icon', identity, '');
        const folder = util.el('div', 'fm-folder-copy', identity);
        util.el('strong', '', folder, 'Edits');
        util.el('span', '', folder, 'File folder');
        const properties = util.el('div', 'fm-properties', inspector);
        for (const [key, value] of [
          ['Location', 'My Files › Projects › Website Redesign'],
          ['Size', '—'],
          ['Contains', '11 files, 1 folder'],
          ['Modified', 'Apr 16, 2014 5:42 PM'],
        ]) {
          const row = util.el('div', 'fm-property', properties);
          util.el('span', '', row, key);
          util.el('span', '', row, value);
        }
        Object.assign(_c, { folder, identity, inspector, properties, stage });
      },
  };

  env.site({
    name: 'design-use-file-manager-range-02',
    template: 'site/base',
    design: { parts },
  });
})();
