// This tab design wraps each panel's links in a document view and adds guidance beneath them.
env.widget({
  task: 'click-control',
  site: 'design-click-control-tab-07',
  name: 'design',
  split: 'train',
  scenarios: ['tab'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      tabButton: () => () => {},
      tabPanel: (base, S) => (ctx, p, t, i, links) => {
        const { util } = ctx;
        util.el('h2', 'document-heading', p, t.label);
        util.el('p', 'document-intro', p, 'This document gathers useful information for the project.');
        const article = util.el('div', 'document-article', p);
        const art = util.el('div', 'document-icon', article);
        art.setAttribute('aria-hidden', 'true');
        art.innerHTML =
          '<svg viewBox="0 0 145 166" fill="white" stroke="black" stroke-width="4" stroke-linejoin="miter"><path d="M5 22h115v140H5z"/><path d="M14 12h115v140H14z"/><path d="M25 3h95l20 18v121H25z"/><path d="M45 36h74M45 54h74M45 72h74M45 90h74M45 108h57" fill="none" stroke-width="3"/></svg>';
        const prose = util.el('div', 'document-prose', article);
        links.push(...S.P.paragraph(ctx, prose, t.words, i));
        util.el('p', 'document-guidance', prose, 'Select a tab to get started.');
      },
      tabsReady: () => (ctx, wrap, strip) => {
        ctx.stage.parentElement.style.setProperty('--tab-strip-height', strip.offsetHeight + 'px');
      },
    },
  },
});
