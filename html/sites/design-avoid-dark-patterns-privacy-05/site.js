// Design on templates/site/base.js (the base site.js): only what this site changed.
(function () {
  'use strict';

  const parts = {
    'frame.header': (base, S) => function (_c) {
      const { content, ctx, display, local, nav, rng, util } = _c;
      const { K, TITLES } = S;
      // 2019 tablet news layout: a masthead, split reading surface and bottom dock.
      const header = util.el('header', 'ref-task nl-masthead', document.body);
      const logo = util.el('div', 'ref-brand nl-brand', header);
      logo.dataset.role = 'brand';
      util.el('span', 'nl-mark', logo);
      const nm = util.el('span', 'nl-name', logo);
      util.el('span', '', nm, 'Sablefen');
      util.el('span', '', nm, 'Standard');
      if (display !== 'header' || nav) rng.pick(TITLES);
      if (nav) local(rng.sample(content.NAV_ITEMS, rng.int(3, 5)), K.nav);
      if (display === 'header') util.el('div', 'ref-instruction nl-task-note', header, ctx.instruction);
      else {
        const tag = util.el('div', 'ref-spacer nl-tagline', header);
        util.el('span', '', tag, 'NEWS  PEOPLE  PLACES');
        util.el('span', '', tag, 'A BRIGHTER PERSPECTIVE');
      }
      for (const cls of ['nl-h-circle', 'nl-h-dot', 'nl-h-tri']) util.el('span', cls, header);
      const acts = util.el('div', 'nl-actions', header);
      util.el('span', 'nl-act nl-act-search', acts, 'Search');
      util.el('span', 'nl-act nl-act-user', acts, 'Sign in');
      util.el('span', 'nl-subscribe', acts, 'Subscribe');
      const n = util.el('nav', 'ref-nav nl-topnav', document.body);
      ['Home', 'News', 'Opinion', 'Culture', 'Lifestyle', 'Travel', 'Science', 'Business', 'Sport'].forEach((item, i) => {
        const a = util.el('a', 'ref-navlink' + (i ? '' : ' nl-on'), n, item);
        a.dataset.role = 'nav';
        a.addEventListener('click', (e) => { e.preventDefault(); env.log('decoy', { what: 'nav', label: item }); });
      });
      Object.assign(_c, { header, logo, n });
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
      const more = util.el('section', 'nl-left', savedSide);
      util.el('h2', '', more, 'Today’s top stories');
      const stories = [
        ['Riverside town plans greener high street', '2 hours ago'],
        ['Puffins return to Sablefen cliffs after steep decline', '4 hours ago'],
        ['Town library celebrates 120 years', '6 hours ago'],
      ];
      for (const [title, when] of stories) {
        const row = util.el('div', 'nl-story', more);
        util.el('span', 'nl-thumb', row);
        const copy = util.el('div', 'nl-story-copy', row);
        util.el('div', '', copy, title);
        util.el('small', '', copy, when);
      }
      const stats = util.el('section', 'nl-right', body);
      util.el('h2', '', stats, 'Most read');
      for (const [i, t] of ['Beneath the high street, a lost passage comes to light', 'Why our town’s old cinemas still matter', 'The people keeping Sablefen’s crafts alive', 'A weekend on the Silvermere Trail', 'How to make the most of a rainy day'].entries()) {
        const line = util.el('div', 'nl-read', stats);
        util.el('b', '', line, String(i + 1));
        util.el('span', '', line, t);
      }
      const news = util.el('section', 'nl-news', body);
      const nh = util.el('div', 'nl-news-head', news);
      util.el('span', 'nl-env', nh);
      const nt = util.el('div', '', nh);
      util.el('b', '', nt, 'The latest from Sablefen Standard');
      util.el('small', '', nt, 'Top stories, straight to your inbox.');
      const nf = util.el('div', 'nl-news-form', news);
      util.el('span', 'nl-news-in', nf, 'Your email address');
      util.el('span', 'nl-news-go', nf, '→');
      if (display === 'panel') {
        rng.pick(['Your task', 'Instructions', 'To do', 'Goal']);
        const panelRight = rng.bool(0.5);
        const panel = util.el('aside', 'ref-panel nl-panel', savedSide);
        util.el('div', 'ref-panel-title', panel, word ? word(lr.pick(K.panel)) : 'Your task');
        util.el('div', 'ref-panel-text', panel, ctx.instruction);
        if (panelRight) body.classList.add('ref-panel-right');
      }
      Object.assign(_c, { body, more, savedSide, stats, stories });
    },
    'frame.stage': (base, S) => function (_c) {
      const { body, closeLabel, collide, ctx, decoyBtn, decoys, display, endBtn, label, placement, rng, util, wantFooter } = _c;
      let { submit } = _c;
      const stage = util.el('main', 'ref-stage', body);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      rng.pick(['center', 'center', 'flex-start', 'flex-end']);
      stage.style.justifyContent = 'stretch';
      stage.style.alignItems = 'stretch';
      const hero = null;
      if (display === 'toast') {
        const note = util.el('div', 'ref-note nl-toast', document.body);
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
        util.el('div', 'nl-dock-nav', foot, 'Sablefen Standard · Help · Tips: use the tabs above to move around the site');
        const tools = util.el('div', 'ref-tools nl-dock-tools', foot);
        if (decoys.length > 1) decoyBtn(tools, decoys[1]);
        if (collide && collide.where === 'footer') decoyBtn(tools, collide.text, true);
        if (placement === 'footer') submit = endBtn(tools, 'ref-submit', label);
        if (placement === 'link') submit = endBtn(tools, 'ref-endlink', `${label} ›`);
      }
      Object.assign(_c, { hero, stage, submit });
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
    name: 'design-avoid-dark-patterns-privacy-05',
    template: 'site/base',
    design: { parts },
  });
})();
