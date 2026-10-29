// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, ctx, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      // 2008 newspaper layout: slim masthead, related-story index, reading pane.
      const header = util.el('header', 'ref-task nl-masthead', document.body);
      const logo = util.el('div', 'ref-brand nl-brand', header);
      logo.dataset.role = 'brand';
      util.el('span', 'nl-name', logo, 'Fieldnote');
      util.el('span', 'nl-name nl-name-red', logo, 'Weekly');
      if (display !== 'header' || nav) rng.pick(TITLES);
      if (nav) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
      if (display === 'header') util.el('div', 'ref-instruction nl-task-note', header, ctx.instruction);
      else util.el('div', 'ref-spacer', header);
      util.el('div', 'nl-tagline', header, display === 'header' ? ctx.instruction : 'IDEAS. PLACES. A BRIGHTER TOMORROW.');
      util.el('div', 'nl-date', header, 'Tuesday, 14 October 2008');
      Object.assign(_c, { header, logo });
    },
    'frame.tools': (base, S) => function (_c) {
      const { collide, decoyBtn, decoys, endBtn, header, label, placement, util, wantFooter } = _c;
      let submit = null;
      const headerTools = util.el('div', 'ref-tools nl-header-tools', header);
      for (const d of decoys.slice(0, wantFooter ? 1 : 2)) decoyBtn(headerTools, d);
      if (collide && (collide.where === 'header' || !wantFooter)) decoyBtn(headerTools, collide.text, true);
      if (placement === 'header') submit = endBtn(headerTools, 'ref-submit', label);
      if (placement === 'icon') {
        submit = endBtn(headerTools, 'ref-submit ref-icon', '✓');
      }
      Object.assign(_c, { headerTools, submit });
    },
    'frame.body': (base, S) => function (_c) {
      const { content, ctx, display, local, lr, rng, sidebar, util, word } = _c;
      const { K } = S;
      const body = util.el('div', 'ref-body nl-layout', document.body);
      if (sidebar) local(rng.sample(content.NAV_ITEMS, rng.int(4, 7)), K.nav);
      const savedSide = util.el('aside', 'nl-aside', body);
      util.el('h2', 'nl-section', savedSide, 'Technology');
      const more = util.el('section', 'nl-card nl-more', savedSide);
      const stories = [
        ['Our verdict on the new electric scooters', '14 October 2008', 'scooter'],
        ['Ten great netbooks for travellers', '12 October 2008', 'laptop'],
        ['Is a smartphone right for you?', '10 October 2008', 'phone'],
        ['Small tech, big difference: home energy monitors', '8 October 2008', 'wind'],
        ['High-speed rail in Europe: what’s next?', '6 October 2008', 'train'],
        ['Digital cameras: quality on a budget', '3 October 2008', 'camera'],
        ['A cleaner home: solar power for real people', '1 October 2008', 'solar'],
        ['Five cities leading the bike revival', '28 September 2008', 'bike'],
      ];
      for (const [title, date, art] of stories) {
        const row = util.el('div', 'nl-story', more);
        if (art === 'scooter') row.classList.add('selected');
        util.el('span', `nl-thumb nl-thumb-${art}`, row);
        const copy = util.el('div', 'nl-story-copy', row);
        util.el('div', '', copy, title);
        util.el('small', '', copy, date);
      }
      if (display === 'panel') {
        rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        const panelRight = rng.bool(0.5);
        const panel = util.el('aside', 'ref-panel nl-panel', savedSide);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : 'Your task');
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (panelRight) body.classList.add('ref-panel-right');
      }
      Object.assign(_c, { body, more, savedSide, stories });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, closeLabel, collide, ctx, decoyBtn, decoys, display, endBtn, label, placement, rng, savedSide, util, wantFooter } = _c;
      let { submit } = _c;
      const stage = util.el('main', 'ref-stage', body);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      stage.style.justifyContent = 'stretch';
      stage.style.alignItems = 'stretch';
      if (display === 'toast') {
        const note = util.el('div', 'ref-note nl-toast', savedSide);
        util.el('div', 'ref-note-text', note, ctx.instruction);
        const x = util.el('button', 'ref-note-x', note, '×');
        x.type = 'button';
        x.setAttribute('aria-label', closeLabel);
        x.addEventListener('click', () => { note.style.visibility = 'hidden'; env.log('note-close'); });
      }
      if (wantFooter) {
        const foot = util.el('footer', 'ref-foot nl-dock', document.body);
        const footText = rng.pick(['© 2024 Example Co.', 'All changes are saved automatically.',
          'Need help? Contact your administrator.', 'v4.2.1 · Status: all systems normal']);
        util.el('span', 'nl-footer-caption', foot, 'Fieldnote Weekly');
        const tools = util.el('div', 'ref-tools nl-dock-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      Object.assign(_c, { stage, submit });
    },
    'frame.nav': (base, S) => function (_c) {
    },
    'frame.instruction': (base, S) => function (_c) {
    },
    'frame.panel': (base, S) => function (_c) {
    },
    'frame.toast': (base, S) => function (_c) {
    },
    'frame.footer': (base, S) => function (_c) {
    },
  };

  env.site({
    name: 'design-avoid-dark-patterns-privacy-04',
    template: 'site/base',
    design: { parts },
  });
})();
