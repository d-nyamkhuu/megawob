// Design of this site on the click-control/controls template (templates/click-control/controls.js): an editorial byline under the heading and a "Related links" label before the link list.
env.widget({
  task: 'click-control',
  site: 'design-click-control-link-06',
  name: 'design',
  split: 'train',
  scenarios: ['link'],
  traits: { menuOpen: ['hover', 'click'] },
  template: 'click-control/controls',
  design: {
    parts: {
      linkDecor: () => (ctx, art) => {
        const { util } = ctx;
        const h3 = art.querySelector('h3');
        const by = util.el('div', 'cn-by', art, 'By Elena Park  |  April 14, 2015');
        h3.after(by);
        const lst = art.querySelector('.uc-links');
        if (lst) { const lab = util.el('strong', 'cn-rel', lst, 'Related links:'); lst.prepend(lab); }
      },
    },
  },
});
