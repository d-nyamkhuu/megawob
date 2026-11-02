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
        const SL = [
          ['Project Update', 'Q3 Launch Readiness'],
          ['Goals', 'Key objectives for this launch'],
          ['Market Opportunity', 'Growing demand in target segments'],
          ['Launch Plan', 'Timeline and key milestones'],
          ['Team', 'Cross-functional launch team'],
          ['Next Steps', 'Actions and owners'],
        ];
        SL.forEach(([t], i) => {
          const item = util.el('div', `sw-thumb${i === 0 ? ' active' : ''}`, rail);
          util.el('span', 'sw-num', item, String(i + 1));
          const card = util.el('div', 'sw-card', item);
          util.el('i', 'sw-bar', card);
          util.el('b', '', card, t);
          util.el('u', '', card);
          util.el('u', '', card);
        });
        const records = util.el('aside', 'pixel-records', shell);
        const recordsHead = util.el('div', 'pixel-records-head', records);
        util.el('strong', '', recordsHead, 'Slides (6)');
        util.el('span', '', recordsHead, '⌕');
        const search = util.el('div', 'sw-hide', records);
        const tabs = util.el('div', 'sw-hide', records);
        SL.forEach(([t, s], i) => {
          const row = util.el('div', `sw-row${i === 0 ? ' selected' : ''}`, records);
          util.el('span', 'sw-num', row, String(i + 1));
          util.el('span', 'sw-img', row);
          const tx = util.el('div', 'sw-tx', row);
          util.el('b', '', tx, t);
          util.el('span', '', tx, s);
        });
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
        const listHead = util.el('div', 'sw-hide', records);

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
        header.querySelector('.pixel-title').textContent = 'Horizon Office   |   Product Launch Plan';
        const addComment = util.el('button', 'pixel-action sw-hide', header, 'Comment');
        addComment.type = 'button';
        const track = util.el('button', 'pixel-action sw-hide', header, 'Track changes');
        track.type = 'button';
        const menu = util.el('div', 'sw-menu', editor);
        for (const m of ['File', 'Edit', 'View', 'Insert', 'Format', 'Slide', 'Arrange', 'Tools', 'Help'])
          util.el('span', '', menu, m);
        const logo = util.el('span', 'sw-logo', header, 'P');
        header.prepend(logo);
        util.el('span', 'sw-win', header, '—     ☐     ✕');
        const tb = util.el('div', 'sw-tb', editor);
        for (const [t, c] of [['↶', 'i'], ['↷', 'i dim'], ['▤', 'i'], ['⬡', 'i'], ['◢', 'i hl'], ['A', 'i'], ['T', 'i'], ['Layout ⌄', 't'], ['Theme ⌄', 't'], ['Transition ⌄', 't'], ['Helvetica      ⌄', 'f w1'], ['28   ⌄', 'f w2'], ['B', 'i b'], ['I', 'i it'], ['U', 'i u'], ['≡', 'i'], ['≣', 'i'], ['A', 'i ac'], ['☰', 'i'], ['☷', 'i'], ['▨', 'i'], ['▢', 'i']])
          util.el('span', `sw-ti ${c}`, tb, t);
        editor.append(header, menu, tb, body);
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
    name: 'design-use-slides-comments-05',
    template: 'site/base',
    design: { parts },
  });
})();
