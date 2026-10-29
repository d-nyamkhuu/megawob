// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        S.frameAlign(_c, stage);
        const help = util.el('aside', 'gem-help', body);
        util.el('strong', '', help, 'Working with comments');
        util.el('ol', 'gem-help-steps', help);
        const steps = help.querySelector('.gem-help-steps');
        for (const line of [
          'Select text in your document.',
          'Click “Add Comment” to attach a comment to the selected text.',
          'Comments appear in the list and stay anchored to the relevant text.',
        ])
          util.el('li', '', steps, line);
        util.el('strong', 'gem-help-tip-title', help, 'Tip');
        util.el(
          'p',
          'gem-help-tip',
          help,
          'Scroll through comments and select an item to jump to its place in the document.',
        );
        Object.assign(_c, { help, stage, steps });
      },
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
        const desktop = util.el('div', 'gem-desktop', document.body);
        util.el(
          'div',
          'gem-menubar',
          desktop,
          'Desk　 File　 Edit　 Document　 Format　 Tools　 View　 Help　　　　　　　　　　　　 ▣　 Mon 27 Jan 1986　 10:24',
        );
        const shortcuts = util.el('div', 'gem-shortcuts', desktop);
        for (const [icon, label] of [
          ['▣', 'ST'],
          ['▱', 'Documents'],
          ['▤', 'Printer'],
          ['▥', 'Trash'],
        ]) {
          const item = util.el('div', 'gem-shortcut', shortcuts);
          util.el('span', 'gem-shortcut-icon', item, icon);
          util.el('span', '', item, label);
        }
        const gemTabRow = util.el('div', 'gem-tabs', editor);
        for (const [i, label] of ['Write', 'Slides', 'Sheets', 'Database'].entries())
          util.el('div', `gem-tab${i === 0 ? ' active' : ''}`, gemTabRow, label);
        const format = util.el('div', 'gem-format', editor);
        for (const [icon, label] of [
          ['▤', 'New'],
          ['▱', 'Open'],
          ['▣', 'Print'],
          ['✂', 'Cut'],
          ['▧', 'Copy'],
          ['▤', 'Paste'],
        ]) {
          const item = util.el('div', 'gem-format-item', format);
          util.el('span', '', item, icon);
          util.el('small', '', item, label);
        }
        util.el('span', 'gem-separator', format);
        util.el('div', 'gem-select', format, 'Times　⌄');
        util.el('div', 'gem-select size', format, '12　⌄');
        for (const x of ['B', 'I', 'U']) util.el('div', 'gem-letter', format, x);
        util.el('span', 'gem-separator', format);
        for (const x of ['☰', '≡', '☷', '▤', '•', '↕', '⇤']) util.el('div', 'gem-tool-icon', format, x);
        const title = header.querySelector('.ref-brand');
        if (title) {
          title.textContent = 'Office Suite';
          title.classList.add('pixel-title');
        } else {
          const h = util.el('div', 'pixel-title', header, 'Office Suite');
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
        editor.prepend(header);
        const foot = document.querySelector('.ref-foot');
        if (foot) editor.append(foot);
        document.body.append(shell);
        Object.assign(_c, {
          addComment,
          dates,
          desktop,
          editor,
          foot,
          format,
          gemTabRow,
          labels,
          listHead,
          oldHeaderNav,
          oldSpacer,
          rail,
          records,
          recordsHead,
          search,
          shell,
          shortcuts,
          submit,
          tabs,
          title,
          track,
        });
      },
  };

  env.site({
    name: 'design-use-slides-comments-04',
    template: 'site/base',
    design: { parts },
  });
})();
