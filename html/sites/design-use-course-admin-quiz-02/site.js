// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.placement': (base, S) =>
      function (_c) {
        const { content, ctx, local, lr, rng, tall, word } = _c;
        const { K, endLabel } = S;
        // End control placement (none in finish mode).
        let placement = ctx.finish ? null : rng.pick(['header', 'header', 'footer', 'link', 'icon', 'floating']);
        const wantFooter = tall && (placement === 'footer' || placement === 'link' || rng.bool(0.3));
        if (!wantFooter && (placement === 'footer' || placement === 'link')) placement = 'header';
        const sidebar = false;
        const nav = false;
        const decoys = local(content.decoyLabels(rng, rng.int(0, 2)), K.decoy);
        let label = endLabel(rng, content);
        if (word) label = word(lr.pick(K.end));
        // A decoy that reads like an end control (another end word, never this episode's label).
        const { collide, cr } = S.frameCollide(_c, label);
        Object.assign(_c, { collide, cr, decoys, label, nav, placement, sidebar, wantFooter });
      },
    'frame.header': (base, S) =>
      function (_c) {
        const { display, nav, util } = _c;
        const header = util.el('header', 'ref-task', document.body);
        header.classList.add('portal-header');
        if (display !== 'header' || nav) {
          const title = 'Course Manager';
          const brand = util.el('div', 'ref-brand', header, title);
          brand.dataset.role = 'brand';
        }
        Object.assign(_c, { header });
      },
    'frame.instruction': (base, S) =>
      function (_c) {
        const { ctx, display, header, util } = _c;
        if (display === 'header') util.el('div', 'ref-instruction', header, ctx.instruction);
        else util.el('div', 'ref-spacer', header);
        util.el('div', 'portal-course', header, 'Statistics 101');
      },
    'frame.tools': (base, S) =>
      function (_c) {
        const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
        let submit = null;
        const headerTools = util.el('div', 'ref-tools', header);
        for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
        if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
        if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
        if (placement === 'icon') {
          submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
        }

        // Mac OS 9 application frame: title, compact menus, icon strip, and related quiz index.
        header.classList.add('mac-titlebar');
        const appIcon = util.el('span', 'mac-app-icon', header, '🍎');
        appIcon.setAttribute('aria-hidden', 'true');
        appIcon.innerHTML =
          '<svg viewBox="0 0 24 26" aria-hidden="true"><path fill="#49a447" d="M13 3c1-2 3-2 5-2-1 2-2 3-5 3z"/><path fill="#e23b35" d="M12 6c-2-2-6-1-7 2-2 4 1 11 4 14 1 1 2 1 3 0 1-1 2-1 3 0 1 1 2 1 3 0 2-2 4-7 4-10-1 1-2 2-4 1-2-1-2-4-6-7z"/><path fill="#f5ce35" d="M6 7c1-2 3-2 5-1-1 2-3 3-5 1z"/><path fill="#4779c2" d="M15 7c2-2 4-1 5 1-2 1-4 1-5-1z"/></svg>';
        const menu = util.el('nav', 'mac-menubar', document.body);
        for (const item of ['File', 'Edit', 'View', 'Course', 'Quiz', 'Student', 'Tools', 'Window', 'Help']) {
          const m = util.el('span', 'mac-menu-item', menu, item);
          m.dataset.role = 'menu';
        }
        const toolbar = util.el('div', 'mac-toolbar', document.body);
        const macIcons = [
          '<path d="M7 2h10l7 7v13H7z"/><path d="M17 2v7h7M10 13h10M10 17h10"/>',
          '<path d="M2 7h8l2 2h10v12H2z"/><path d="M2 7V4h8l2 3"/>',
          '<path d="M6 8V2h12v6M6 18H3V9h18v9h-3"/><path d="M6 14h12v8H6zM8 4h8"/>',
          '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 21v-2a6 6 0 0 1 12 0v2zM15 15a5 5 0 0 1 6 5v1h-4"/>',
          '<path d="M4 3h14a3 3 0 0 1 3 3v15H7a3 3 0 0 1-3-3z"/><path d="M7 3v18M10 8h7M10 12h7M10 16h6"/>',
          '<path d="M3 4h18v16H3zM3 9h18M9 4v16M15 4v16"/>',
          '<path d="M6 2h10l5 5v15H6zM16 2v5h5"/><path d="M9 12h9M9 16h9"/>',
          '<path d="M4 3h16v18H4zM8 7h8M8 11h8M8 15h4"/><path d="m14 17 2 2 4-5"/>',
        ];
        for (const [index, label] of [
          'New',
          'Open',
          'Print',
          'Students',
          'Gradebook',
          'Modules',
          'Quizzes',
          'Rubrics',
        ].entries()) {
          const item = util.el('div', 'mac-tool', toolbar);
          const icon = util.el('span', 'mac-tool-icon', item);
          icon.innerHTML = `<svg viewBox="0 0 26 26" aria-hidden="true">${macIcons[index]}</svg>`;
          util.el('span', 'mac-tool-label', item, label);
        }
        const related = util.el('div', 'mac-related', document.body);
        util.el('strong', 'mac-related-label', related, 'Related Quizzes:');
        for (const [name, date, selected] of [
          ['Week 1 Quiz', 'Sep 4, 2024'],
          ['Week 2 Quiz', 'Sep 11, 2024'],
          ['Research Quiz', 'Sep 18, 2024'],
          ['Charts and Graphs', 'Sep 25, 2024', true],
          ['Final Review', 'Oct 2, 2024'],
          ['Citations Quiz', 'Oct 9, 2024'],
        ]) {
          const q = util.el('div', `mac-related-item${selected ? ' selected' : ''}`, related);
          util.el('span', 'mac-related-icon', q, '▤');
          const copy = util.el('span', 'mac-related-copy', q);
          util.el('span', 'mac-related-name', copy, name);
          util.el('span', 'mac-related-date', copy, date);
        }
        util.el('div', 'mac-quiz-title', document.body, 'Charts and Graphs');
        const quizTabs = util.el('nav', 'mac-quiz-tabs', document.body);
        for (const [name, selected] of [
          ['Details', false],
          ['Questions', true],
          ['Settings', false],
          ['Preview', false],
        ]) {
          const tab = util.el('span', `mac-quiz-tab${selected ? ' selected' : ''}`, quizTabs, name);
          tab.dataset.role = 'tab';
        }
        Object.assign(_c, { appIcon, headerTools, macIcons, menu, quizTabs, related, submit, toolbar });
      },
    'frame.stage': (base, S) =>
      function (_c) {
        const { body, util } = _c;
        const stage = util.el('main', 'ref-stage', body);
        stage.classList.add('mac-stage');
        stage.style.justifyContent = 'stretch';
        stage.style.alignItems = 'stretch';
        Object.assign(_c, { stage });
      },
  };

  env.site({
    name: 'design-use-course-admin-quiz-02',
    template: 'site/base',
    design: { parts },
  });
})();
