// Design on the choose-option/widgets template.
env.widget({
  task: 'choose-option',
  site: 'design-choose-option-radio-02',
  name: 'design',
  split: 'train',
  scenarios: ['radio'],
  template: 'choose-option/widgets',
  design: {
    parts: {
      heading: () => () => {},
      field: () => (ctx, card) => {
        const { util, spec } = ctx;
        const head = util.el('header', 'ds-email-heading', card);
        util.el('h1', '', head, 'Calibration Setup');
        util.el('p', '', head, 'Choose your display profile and subscription level, then click Submit to continue.');
        const row = util.el('div', 'cp-row', card);
        const p1 = util.el('section', 'cp-panel cp-info', row);
        util.el('h4', '', p1, '1. Display Information');
        const dl = util.el('dl', '', p1);
        [
          ['Monitor:', 'DELL 2001FP'],
          ['Resolution:', '1600 x 900'],
          ['Color Depth:', '32 bit'],
          ['Current Profile:', 'Default'],
          ['Last Calibrated:', '2004-11-02  14:27'],
        ].forEach((r) => {
          util.el('dt', '', dl, r[0]);
          util.el('dd', '', dl, r[1]);
        });
        const p2 = util.el('section', 'cp-panel cp-target', row);
        util.el('h4', '', p2, '2. Target Settings');
        [
          ['White Point:', 'D65 (6500K)', '▼'],
          ['Gamma:', '2.2', '▼'],
          ['Luminance (cd/m²):', '120', '⇕'],
        ].forEach((r) => {
          const l = util.el('div', 'cp-trow', p2);
          util.el('span', '', l, r[0]);
          const b = util.el('div', 'cp-fake', l);
          util.el('span', '', b, r[1]);
          util.el('i', '', b, r[2]);
        });
        const panel = util.el('section', 'cp-panel cp-sub', card);
        util.el('h4', '', panel, '3. ' + spec.label);
        util.el('p', 'cp-sub-note', panel, 'Select a subscription for calibration updates and support.');
        const field = util.el('div', 'fp-field', panel);
        return field;
      },
      emailContent: () => (ctx, card) => {
        const { util } = ctx;
        const decoys = util.el('section', 'ds-email-content', card);
        util.el('h4', '', decoys, '4. Preview');
        util.el('p', '', decoys, 'This is a preview of how colors will be adjusted.');
        const bar = util.el('div', 'cp-bar', decoys);
        for (let i = 0; i < 18; i++) {
          const g = Math.round((i * 255) / 17);
          const sw = util.el('span', '', bar);
          sw.style.background = 'rgb(' + g + ',' + g + ',' + g + ')';
        }
      },
      choiceDetail: () => (ctx, o) => {
        const { spec } = ctx;
        const subscriptionDetails = {
          Starter: 'Free basic updates',
          Standard: 'Standard updates and support',
          Professional: 'Extended features and tools',
          Business: 'Business updates and support',
          Team: 'Multi-seat license',
          Enterprise: 'Advanced support and deployment',
        };
        const detail = (spec.details && spec.details[o]) || (spec.label === 'Subscription' && subscriptionDetails[o]);
        return detail;
      },
      scale: () => (ctx, card) => {
        const availableHeight = Math.max(1, ctx.size.height - (ctx.stage.offsetHeight - ctx.stage.clientHeight));
        const ratio = Math.min(1, availableHeight / card.offsetHeight);
        if (ratio < 1) {
          card.style.transformOrigin = 'top left';
          card.style.transform = `scale(${ratio})`;
        }
      },
    },
  },
});
