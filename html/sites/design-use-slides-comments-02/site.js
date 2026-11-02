// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.floating': (base, S) =>
      function (_c) {
        const { body, endBtn, header, label, placement, util } = _c;
        let { submit } = _c;
        if (placement === 'floating') {
          // Reserve the control's space so it cannot intercept task clicks or drags.
          // On scrollable pages the dock follows the content, just like a form footer.
          const dock = util.el('div', 'ref-float-dock', document.body);
          submit = endBtn(dock, 'ref-submit ref-float', label);
        }

        // The 2019 Pixel Suite frame: app rail + document index beside the editor.
        const shell = util.el('div', 'pixel-shell', document.body);
        const rail = util.el('nav', 'pixel-rail', shell);
        util.el('div', 'pixel-logo', rail, 'Pixel\nSuite');
        for (const [icon, text] of [
          ['⌂', 'Home'],
          ['▤', 'Docs'],
          ['▣', 'Slides'],
          ['▦', 'Sheets'],
          ['☑', 'Projects'],
          ['▣', 'Calendar'],
          ['♙', 'People'],
          ['⚙', 'Settings'],
        ]) {
          const item = util.el('div', `pixel-navitem${text === 'Docs' ? ' active' : ''}`, rail);
          util.el('span', 'pixel-navicon', item, icon);
          util.el('span', 'pixel-navlabel', item, text);
        }
        const records = util.el('aside', 'pixel-records', shell);
        const recordsHead = util.el('div', 'pixel-records-head', records);
        util.el('strong', '', recordsHead, 'Documents');
        util.el('button', 'pixel-new', recordsHead, '+ New');
        const search = util.el('div', 'pixel-search', records, '⌕  Search documents...');
        const tabs = util.el('div', 'pixel-tabs', records);
        for (const [i, tab] of ['All', 'Shared', 'Starred', 'Recent'].entries())
          util.el('span', `pixel-tab${i === 0 ? ' active' : ''}`, tabs, tab);
        const labels = [
          'Q3 Marketing Plan',
          'Partner Workshop Brief',
          'Brand Guidelines',
          'Campaign Ideas',
          'Q2 Performance Review',
          'Website Redesign Notes',
          'Product Launch Plan',
          'Customer Feedback Summary',
          'Team Offsite Notes',
          'Competitive Analysis',
          'Budget Proposal',
          'Marketing Resources',
          'Leadership Update',
          'Press Release Draft',
        ];
        const dates = [
          'Aug 14, 2019',
          'Aug 12, 2019',
          'Aug 10, 2019',
          'Aug 8, 2019',
          'Aug 6, 2019',
          'Aug 1, 2019',
          'Jul 28, 2019',
          'Jul 24, 2019',
          'Jul 18, 2019',
          'Jul 12, 2019',
          'Jul 8, 2019',
          'Jun 30, 2019',
          'Jun 24, 2019',
          'Jun 18, 2019',
        ];
        const listHead = util.el('div', 'pixel-listhead', records);
        util.el('span', '', listHead, 'Name');
        util.el('span', '', listHead, 'Modified  ⌄');
        labels.forEach((label, i) => {
          const row = util.el('div', `pixel-docrow${i === 0 ? ' selected' : ''}`, records);
          util.el('span', 'pixel-docicon', row, '▤');
          util.el('span', 'pixel-doctitle', row, label);
          util.el('span', 'pixel-docdate', row, dates[i]);
        });

        // Reuse all episode frame and controls; place them in the editor column.
        const editor = util.el('div', 'pixel-editor', shell);
        const title = header.querySelector('.ref-brand');
        if (title) {
          title.textContent = 'Q3 Marketing Plan';
          title.classList.add('pixel-title');
        } else {
          const h = util.el('div', 'pixel-title', header, 'Q3 Marketing Plan');
          header.prepend(h);
        }
        const oldHeaderNav = header.querySelector('.ref-nav');
        if (oldHeaderNav) oldHeaderNav.remove();
        const oldSpacer = header.querySelector('.ref-spacer');
        if (oldSpacer) oldSpacer.remove();
        const addComment = util.el('button', 'pixel-action', header, '▱  Comment');
        addComment.type = 'button';
        const track = util.el('button', 'pixel-action', header, '◷  Track changes');
        track.type = 'button';
        util.el('span', 'pixel-search-icon', header, '⌕');
        editor.append(header, body);
        const foot = document.querySelector('.ref-foot');
        if (foot) editor.append(foot);
        document.body.append(shell);
        Object.assign(_c, {
          addComment,
          dates,
          editor,
          foot,
          labels,
          listHead,
          oldHeaderNav,
          oldSpacer,
          rail,
          records,
          recordsHead,
          search,
          shell,
          submit,
          tabs,
          title,
          track,
        });
      },
  };

  env.site({
    name: 'design-use-slides-comments-02',
    template: 'site/base',
    design: { parts },
  });
})();
