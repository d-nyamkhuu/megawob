// This design moves the tab strip above the page and adds browser details and generic tab help.
(() => {
env.widget({
  task: 'click-control',
  site: 'design-click-control-tab-04',
  name: 'design',
  split: 'train',
  scenarios: ['tab'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      tabButton: () => () => {},
      tabStrip: () => (ctx, wrap, strip) => {
        const { spec, util } = ctx;
        const center = ctx.stage.parentElement;
        center.insertBefore(strip, center.firstChild);
        const details = document.querySelector('.inspector-body');
        if (details) {
          details.querySelectorAll('.detail-copy').forEach((el) => el.remove());
          const title = util.el('h3', 'detail-copy about-title', details, 'About This Browser');
          details.insertBefore(title, details.firstChild);
          util.el('p', 'detail-copy detail-instruction', details, 'Browse information and reference material across the available tabs.');
          const facts = util.el('dl', 'detail-copy task-facts', details);
          const pairs = [
            ['Tabs available:', spec.tabs.map((t) => t.label).join(', ')],
            ['Content:', 'Reference articles'],
            ['Navigation:', 'Tabbed pages'],
            ['Input method:', 'Mouse pointer only'],
          ];
          pairs.forEach(([key, value]) => {
            util.el('dt', '', facts, key);
            util.el('dd', '', facts, value);
          });
        }
      },
      tabPanel: (base, S) => (ctx, p, t, i, links) => {
        const { util } = ctx;
        util.el('h2', 'welcome-title', p, i === 0 ? 'Welcome' : t.label);
        util.el('p', 'welcome-intro', p, 'This application contains useful information across several tabs.');
        util.el(
          'p',
          'welcome-guide',
          p,
          'Use the tabs above to explore the content.',
        );
        const reading = util.el('div', 'tab-reading', p);
        links.push(...S.P.paragraph(ctx, reading, t.words, i));
        const started = util.el('section', 'getting-started', p);
        util.el('h3', '', started, 'Getting Started');
        const steps = util.el('ol', '', started);
        [
          'Read the information in each tab.',
          'Browse the reference material.',
          'Open links to explore related information.',
        ].forEach((text) => util.el('li', '', steps, text));
      },
    },
  },
});
})();
